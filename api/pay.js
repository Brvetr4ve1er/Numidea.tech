/**
 * POST /api/pay: the counter's checkout (mode "cart", priced from api/_shop.js) and the deposit/balance of a signed quote, through
 * PayPal Orders v2, with no PayPal script on the page (the CSP stays 'self').
 *
 * Flow: the owner mints a link with `node scripts/pay-link.mjs` and sends it
 * with the quote: /comptoir/?ref=Q-2026-014&part=deposit&amt=600.00&cur=EUR&exp=…&sig=…
 * The page posts those fields here with op "create"; this file re-checks the
 * HMAC (the browser is never trusted with an amount), creates the order and
 * answers the PayPal approval URL; the page sends the visitor there. PayPal
 * returns them to /comptoir/?…&done=1&token=<order id>, which posts op "capture".
 * GET answers {ready, env} so the page shows the button only when it works.
 *
 * Environment (Vercel project settings, never git):
 *   PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET  the REST app's pair
 *   PAYPAL_ENV        "live" for real money; anything else is sandbox
 *   PAY_LINK_SECRET   the HMAC key scripts/pay-link.mjs signs links with
 *   PAYPAL_ME         the owner's PayPal.me name (not a secret), for the pay-link fallback
 *   PAYPAL_PROVEN     "yes" once a real payment has reached the owner's PayPal account (2026-11-27: not yet proven
 *                     that an Algerian account can receive). Until then no real-money PayPal path exists: live keys
 *                     answer ready:false and the PayPal.me link is withheld. Sandbox keys still work (test money).
 * Without them this answers 503 and the page shows the transfer details only.
 *
 * Raw fetch, no SDK: the project deploys with no install step.
 */
import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';
import { price, publicCatalog } from './_shop.js';

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

/* A brake on "create" (checklist 2026-11-27): each call opens a PayPal order, so a script hammering it would fill the
   owner's PayPal account with dead orders. Per visitor address: at most RATE_MAX creates in RATE_WINDOW ms, then 429.
   It lives in the function's memory, so it holds per warm instance, not across all of Vercel: a brake on one browser or
   one script, not a wall. The durable wall is a Vercel Firewall rate-limit rule on /api/pay (owner, dashboard). */
export const RATE_MAX = 8, RATE_WINDOW = 10 * 60 * 1000;
const hits = new Map();
export function limited(ip, now = Date.now(), store = hits) {
  const key = typeof ip === 'string' && ip ? ip.slice(0, 64) : 'unknown';
  const recent = (store.get(key) || []).filter((t) => now - t < RATE_WINDOW);
  if (recent.length >= RATE_MAX) { store.set(key, recent); return true; }
  recent.push(now); store.set(key, recent);
  if (store.size > 5000) for (const [k, v] of store) if (!v.some((t) => now - t < RATE_WINDOW)) store.delete(k);
  return false;
}
export const visitor = (req) => String(req.headers['x-real-ip'] || (req.headers['x-forwarded-for'] || '').split(',')[0] || '').trim();

const allowedOrigin = (o) => {
  if (!o) return false;
  try {
    const h = new URL(o).hostname;
    return h === 'www.numedialab.dev' || h === 'numedialab.dev' || /^numidea-tech-[a-z0-9-]+\.vercel\.app$/.test(h) || h === 'localhost';
  } catch { return false; }
};

export const api = () => (process.env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com');

export async function token() {
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

/* The order trace: one JSON line per step, in the function logs (Vercel → Logs, filter "pay"). Reference, amount,
   status and PayPal's ids only; never a payer's name, e-mail or card. */
export const trace = (step, data) => console.log(JSON.stringify({ pay: step, at: new Date().toISOString(), ...data }));

/* Capture an approved order. The page (on return) and the webhook (api/pay-hook.js, when the buyer never comes back)
   both call this with the same PayPal-Request-Id, so PayPal charges once whichever arrives first. */
export async function capture(id, bearer, via) {
  const r = await fetch(`${api()}/v2/checkout/orders/${id}/capture`, {
    method: 'POST',
    headers: { authorization: `Bearer ${bearer}`, 'content-type': 'application/json', 'PayPal-Request-Id': `cap-${id}` },
    body: '{}',
    signal: AbortSignal.timeout(10000),
  });
  const out = await r.json().catch(() => ({}));
  // already captured (a reload of the thank-you page, or the webhook got there first) counts as paid
  const done = out.status === 'COMPLETED' || (out.details || []).some((d) => d.issue === 'ORDER_ALREADY_CAPTURED');
  const unit = (out.purchase_units || [])[0] || {};
  const cap = ((unit.payments || {}).captures || [])[0] || {};
  const res = { done, ref: unit.reference_id || null, amount: cap.amount || null, capture: cap.id || null };
  trace(done ? 'captured' : 'capture-failed', { via, order: id, ref: res.ref, amount: res.amount, capture: res.capture, status: out.status || r.status });
  return res;
}

const LABEL = { deposit: 'Acompte 40 %', balance: 'Solde 60 %', full: 'Paiement' };

/* real money moves through PayPal only once the owner has proven the account receives (PAYPAL_PROVEN=yes) */
export function gate(e = process.env) {
  const live = e.PAYPAL_ENV === 'live', proven = e.PAYPAL_PROVEN === 'yes';
  const me = e.PAYPAL_ME || '';
  return {
    env: live ? 'live' : 'sandbox',
    api: Boolean(e.PAYPAL_CLIENT_ID && e.PAYPAL_CLIENT_SECRET && e.PAY_LINK_SECRET) && (!live || proven),
    paylink: proven && /^[A-Za-z0-9]{1,20}$/.test(me) ? `https://www.paypal.com/paypalme/${me}` : null,
  };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const g = gate(), configured = g.api;
  // GET: is the button worth showing? Says only the mode, never a key.
  // The counter's price list comes with it, so the page and the charge read one list.
  if (req.method === 'GET') {
    const { env, paylink } = g, catalog = publicCatalog();
    if (!configured) return res.status(200).json({ ready: false, paylink, catalog });
    try { await token(); return res.status(200).json({ ready: true, env, paylink, catalog }); }
    catch { return res.status(200).json({ ready: false, env, error: 'auth', paylink, catalog }); }
  }
  if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ error: 'method' }); }
  if (!allowedOrigin(req.headers.origin)) return res.status(403).json({ error: 'origin' });
  if (!configured) return res.status(503).json({ error: 'offline' });
  let body;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; } catch { return res.status(400).json({ error: 'json' }); }
  if (!body || JSON.stringify(body).length > 2000) return res.status(413).json({ error: 'size' });

  // before any PayPal call: a visitor over the brake costs nothing upstream
  if (body.op === 'create' && limited(visitor(req))) { trace('create-limited', {}); res.setHeader('Retry-After', '600'); return res.status(429).json({ error: 'busy' }); }
  const origin = new URL(req.headers.origin).origin;
  try {
    const bearer = await token();
    const headers = { authorization: `Bearer ${bearer}`, 'content-type': 'application/json' };

    if (body.op === 'create') {
      const lang = ['fr', 'en', 'ar'].includes(body.lang) ? body.lang : 'fr';
      let unit, requestId, back;
      if (body.mode === 'cart') {
        // the counter: the server prices the bag from its own list; the browser only names items and counts
        const q = price(body.bag, body.cur, body.part);
        if (!q) return res.status(400).json({ error: 'bag' });
        const ref = `C-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomUUID().slice(0, 6).toUpperCase()}`;
        const items = q.lines.map((l) => `${l.id}x${l.qty}`).join(' ');
        unit = {
          reference_id: ref,
          custom_id: `${ref}:${q.part}:${items}`.slice(0, 127),
          invoice_id: ref,
          description: `Numidea Labs · ${q.part === 'deposit' ? 'Acompte 40 %' : 'Commande'} · ${items}`.slice(0, 127),
          amount: { currency_code: q.cur, value: q.amount },
        };
        requestId = ref;
        back = new URLSearchParams({ lang, ref });
      } else {
        // a quote: the amount is in the owner's signed link
        const f = verify(body, PAY_LINK_SECRET);
        if (!f) return res.status(400).json({ error: 'link' });
        unit = {
          reference_id: f.ref,
          custom_id: `${f.ref}:${f.part}`,
          invoice_id: `${f.ref}-${f.part}`,
          description: `Numidea Labs · ${f.ref} · ${LABEL[f.part]}`,
          amount: { currency_code: f.cur, value: f.amt },
        };
        // one order per link and part: a double click or a reload reuses it
        requestId = `${f.ref}-${f.part}-${f.exp}`;
        // the page reads the signed fields again on return, so a cancel lands back on the same contract
        back = new URLSearchParams({ lang, ref: f.ref, part: f.part, amt: f.amt, cur: f.cur, exp: f.exp, sig: body.sig });
      }
      const r = await fetch(`${api()}/v2/checkout/orders`, {
        method: 'POST',
        headers: { ...headers, 'PayPal-Request-Id': requestId },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [unit],
          payment_source: { paypal: { experience_context: {
            brand_name: 'Numidea Labs',
            user_action: 'PAY_NOW',
            shipping_preference: 'NO_SHIPPING',
            locale: lang === 'fr' ? 'fr-FR' : lang === 'ar' ? 'ar-EG' : 'en-US',
            return_url: `${origin}/comptoir/?${back}&done=1`,
            cancel_url: `${origin}/comptoir/?${back}&cancel=1`,
          } } },
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) return res.status(502).json({ error: 'upstream' });
      const order = await r.json();
      const approve = (order.links || []).find((l) => l.rel === 'payer-action' || l.rel === 'approve');
      if (!approve) return res.status(502).json({ error: 'shape' });
      trace('created', { order: order.id, ref: unit.reference_id, custom: unit.custom_id, amount: unit.amount });
      return res.status(200).json({ approve: approve.href, ref: unit.reference_id });
    }

    if (body.op === 'capture') {
      if (typeof body.token !== 'string' || !/^[A-Z0-9]{10,24}$/.test(body.token)) return res.status(400).json({ error: 'token' });
      const c = await capture(body.token, bearer, 'page');
      if (!c.done) return res.status(402).json({ error: 'declined' });
      return res.status(200).json({ paid: true, ref: c.ref, amount: c.amount });
    }

    return res.status(400).json({ error: 'op' });
  } catch (e) {
    return res.status(e && e.name === 'TimeoutError' ? 504 : 502).json({ error: 'upstream' });
  }
}
