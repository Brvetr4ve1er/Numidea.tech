/**
 * POST /api/pay-hook: PayPal's webhook (payments, 2026-11-27).
 *
 * Why: api/pay.js captures an order when the buyer comes back to /comptoir/?…&done=1. A buyer who approves on
 * PayPal and closes the tab never comes back, and the order would sit approved, uncharged, then expire, with no trace
 * on our side. PayPal calls this on CHECKOUT.ORDER.APPROVED whatever the buyer does next, and this captures it. The
 * capture shares its PayPal-Request-Id with the page's, so PayPal charges once whichever arrives first.
 *
 * Every event is checked with PayPal (POST /v1/notifications/verify-webhook-signature) before anything happens: an
 * unsigned or forged call is refused. The capture, refund and denial events are written to the order trace (the
 * function logs, a JSON line with "pay").
 *
 * Environment (Vercel, never git): the api/pay.js pair, PAYPAL_ENV, PAYPAL_PROVEN (gate() applies here too), and
 *   PAYPAL_WEBHOOK_ID  the id PayPal gives when the owner adds this URL under the REST app → Webhooks
 *                      (events: Checkout order approved, Payment capture completed / denied / refunded / reversed).
 * Without it this answers 503 and does nothing.
 */
import { gate, token, api, capture, trace } from './pay.js';

const HEADERS = ['paypal-auth-algo', 'paypal-cert-url', 'paypal-transmission-id', 'paypal-transmission-sig', 'paypal-transmission-time'];
const LOGGED = ['PAYMENT.CAPTURE.COMPLETED', 'PAYMENT.CAPTURE.DENIED', 'PAYMENT.CAPTURE.REFUNDED', 'PAYMENT.CAPTURE.REVERSED', 'PAYMENT.CAPTURE.PENDING'];

/* PayPal says whether this event is really theirs, for this webhook */
export async function genuine(req, event, bearer) {
  const h = Object.fromEntries(HEADERS.map((k) => [k, req.headers[k]]));
  if (HEADERS.some((k) => typeof h[k] !== 'string' || !h[k])) return false;
  // the certificate must come from PayPal itself
  try { if (!/(^|\.)paypal\.com$/.test(new URL(h['paypal-cert-url']).hostname)) return false; } catch { return false; }
  const r = await fetch(`${api()}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: { authorization: `Bearer ${bearer}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      auth_algo: h['paypal-auth-algo'], cert_url: h['paypal-cert-url'], transmission_id: h['paypal-transmission-id'],
      transmission_sig: h['paypal-transmission-sig'], transmission_time: h['paypal-transmission-time'],
      webhook_id: process.env.PAYPAL_WEBHOOK_ID, webhook_event: event,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) return false;
  return (await r.json().catch(() => ({}))).verification_status === 'SUCCESS';
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'method' }); }
  if (!gate().api || !process.env.PAYPAL_WEBHOOK_ID) return res.status(503).json({ error: 'offline' });
  let event;
  try { event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; } catch { return res.status(400).json({ error: 'json' }); }
  if (!event || typeof event.event_type !== 'string' || !event.resource) return res.status(400).json({ error: 'shape' });

  try {
    const bearer = await token();
    if (!(await genuine(req, event, bearer))) { trace('hook-refused', { event: event.event_type, id: event.id || null }); return res.status(400).json({ error: 'signature' }); }
    const r = event.resource;

    if (event.event_type === 'CHECKOUT.ORDER.APPROVED') {
      if (typeof r.id !== 'string' || !/^[A-Z0-9]{10,24}$/.test(r.id)) return res.status(400).json({ error: 'order' });
      if (r.status === 'COMPLETED') return res.status(200).json({ ok: true, already: true });
      const c = await capture(r.id, bearer, 'webhook');
      // a failed capture answers 500 so PayPal sends the event again later
      return c.done ? res.status(200).json({ ok: true }) : res.status(500).json({ error: 'capture' });
    }
    if (LOGGED.includes(event.event_type)) {
      const order = ((r.supplementary_data || {}).related_ids || {}).order_id || null;
      trace(event.event_type.toLowerCase(), { order, capture: r.id || null, ref: r.invoice_id || null, custom: r.custom_id || null, amount: r.amount || null, status: r.status || null });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    trace('hook-error', { event: event.event_type, reason: e && e.name });
    return res.status(500).json({ error: 'upstream' });
  }
}
