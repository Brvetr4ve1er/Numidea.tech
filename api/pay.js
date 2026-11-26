/**
 * POST /api/pay: the deposit/balance payment for a signed quote, through
 * PayPal Orders v2, with no PayPal script on the page (the CSP stays 'self').
 *
 * Flow: the owner mints a link with `node scripts/pay-link.mjs` and sends it
 * with the quote: /payer/?ref=Q-2026-014&part=deposit&amt=600.00&cur=EUR&exp=…&sig=…
 * The page posts those fields here with op "create"; this file re-checks the
 * HMAC (the browser is never trusted with an amount), creates the order and
 * answers the PayPal approval URL; the page sends the visitor there. PayPal
 * returns them to /payer/?…&done=1&token=<order id>, which posts op "capture".
 * GET answers {ready, env} so the page shows the button only when it works.
 *
 * Environment (Vercel project settings, never git):
 *   PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET  the REST app's pair
 *   PAYPAL_ENV        "live" for real money; anything else is sandbox
 *   PAY_LINK_SECRET   the HMAC key scripts/pay-link.mjs signs links with
 * Without them this answers 503 and the page shows the transfer details only.
 *
 * Raw fetch, no SDK: the project deploys with no install step.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

export const PARTS = ['deposit', 'balance', 'full'];
export const CURRENCIES = ['EUR', 'USD'];
const REF = /^Q-\d{4}-\d{3,4}$/;
const AMT = /^\d{1,6}\.\d{2}$/;
const MAX_AMOUNT = 20000; // a typo guard, not a business rule

/* the one string a link signs; any change here invalidates every link out there */
export const payload = ({ ref, part, amt, cur, exp }) => [ref, part, amt, cur, exp].join('|');
export const sign = (fields, secret) => createHmac('sha256', secret).update(payload(fields)).digest('base64url');

/* the fields as sent, checked; null when anything is off */
export function verify(f, secret, now = Date.now()) {
  if (!f || typeof f !== 'object' || !secret) return null;
  const { ref, part, amt, cur, exp, sig } = f;
  if (typeof ref !== 'string' || !REF.test(ref)) return null;
  if (!PARTS.includes(part) || !CURRENCIES.includes(cur)) return null;
  if (typeof amt !== 'string' || !AMT.test(amt) || +amt <= 0 || +amt > MAX_AMOUNT) return null;
  if (!/^\d{10}$/.test(String(exp)) || +exp * 1000 < now) return null;
  if (typeof sig !== 'string') return null;
  const want = Buffer.from(sign({ ref, part, amt, cur, exp: String(exp) }, secret));
  const got = Buffer.from(sig);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  return { ref, part, amt, cur, exp: String(exp) };
}

const allowedOrigin = (o) => {
  if (!o) return false;
  try {
    const h = new URL(o).hostname;
    return h === 'www.numedialab.dev' || h === 'numedialab.dev' || /^numidea-tech-[a-z0-9-]+\.vercel\.app$/.test(h) || h === 'localhost';
  } catch { return false; }
};

const api = () => (process.env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com');

async function token() {
  const basic = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const r = await fetch(`${api()}/v1/oauth2/token`, {
    method: 'POST',
    headers: { authorization: `Basic ${basic}`, 'content-type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error('auth');
  return (await r.json()).access_token;
}

const LABEL = { deposit: 'Acompte 40 %', balance: 'Solde 60 %', full: 'Paiement' };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAY_LINK_SECRET } = process.env;
  const configured = Boolean(PAYPAL_CLIENT_ID && PAYPAL_CLIENT_SECRET && PAY_LINK_SECRET);
  // GET: is the button worth showing? Says only the mode, never a key.
  if (req.method === 'GET') {
    if (!configured) return res.status(200).json({ ready: false });
    try { await token(); return res.status(200).json({ ready: true, env: process.env.PAYPAL_ENV === 'live' ? 'live' : 'sandbox' }); }
    catch { return res.status(200).json({ ready: false, env: process.env.PAYPAL_ENV === 'live' ? 'live' : 'sandbox', error: 'auth' }); }
  }
  if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ error: 'method' }); }
  if (!allowedOrigin(req.headers.origin)) return res.status(403).json({ error: 'origin' });
  if (!configured) return res.status(503).json({ error: 'offline' });
  let body;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; } catch { return res.status(400).json({ error: 'json' }); }
  if (!body || JSON.stringify(body).length > 600) return res.status(413).json({ error: 'size' });

  const origin = new URL(req.headers.origin).origin;
  try {
    const bearer = await token();
    const headers = { authorization: `Bearer ${bearer}`, 'content-type': 'application/json' };

    if (body.op === 'create') {
      const f = verify(body, PAY_LINK_SECRET);
      if (!f) return res.status(400).json({ error: 'link' });
      const lang = ['fr', 'en', 'ar'].includes(body.lang) ? body.lang : 'fr';
      // the page reads the signed fields again on return, so a cancel lands back on the same contract
      const back = new URLSearchParams({ lang, ref: f.ref, part: f.part, amt: f.amt, cur: f.cur, exp: f.exp, sig: body.sig });
      const r = await fetch(`${api()}/v2/checkout/orders`, {
        method: 'POST',
        // one order per link and part: a double click or a reload reuses it
        headers: { ...headers, 'PayPal-Request-Id': `${f.ref}-${f.part}-${f.exp}` },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            reference_id: f.ref,
            custom_id: `${f.ref}:${f.part}`,
            invoice_id: `${f.ref}-${f.part}`,
            description: `Numidea Labs · ${f.ref} · ${LABEL[f.part]}`,
            amount: { currency_code: f.cur, value: f.amt },
          }],
          payment_source: { paypal: { experience_context: {
            brand_name: 'Numidea Labs',
            user_action: 'PAY_NOW',
            shipping_preference: 'NO_SHIPPING',
            locale: lang === 'fr' ? 'fr-FR' : lang === 'ar' ? 'ar-EG' : 'en-US',
            return_url: `${origin}/payer/?${back}&done=1`,
            cancel_url: `${origin}/payer/?${back}&cancel=1`,
          } } },
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) return res.status(502).json({ error: 'upstream' });
      const order = await r.json();
      const approve = (order.links || []).find((l) => l.rel === 'payer-action' || l.rel === 'approve');
      if (!approve) return res.status(502).json({ error: 'shape' });
      return res.status(200).json({ approve: approve.href });
    }

    if (body.op === 'capture') {
      if (typeof body.token !== 'string' || !/^[A-Z0-9]{10,24}$/.test(body.token)) return res.status(400).json({ error: 'token' });
      const r = await fetch(`${api()}/v2/checkout/orders/${body.token}/capture`, {
        method: 'POST', headers: { ...headers, 'PayPal-Request-Id': `cap-${body.token}` }, body: '{}',
        signal: AbortSignal.timeout(10000),
      });
      const out = await r.json().catch(() => ({}));
      // already captured (a reload of the thank-you page) counts as paid
      const done = out.status === 'COMPLETED' || (out.details || []).some((d) => d.issue === 'ORDER_ALREADY_CAPTURED');
      if (!done) return res.status(402).json({ error: 'declined' });
      const unit = (out.purchase_units || [])[0] || {};
      const cap = ((unit.payments || {}).captures || [])[0] || {};
      return res.status(200).json({ paid: true, ref: unit.reference_id || null, amount: cap.amount || null });
    }

    return res.status(400).json({ error: 'op' });
  } catch (e) {
    return res.status(e && e.name === 'TimeoutError' ? 504 : 502).json({ error: 'upstream' });
  }
}
