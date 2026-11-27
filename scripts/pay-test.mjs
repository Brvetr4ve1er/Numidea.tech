#!/usr/bin/env node
/* npm run pay:test — the payment link's signature rules, offline (no PayPal call). */
import assert from 'node:assert/strict';
import { sign, verify, gate } from '../api/pay.js';

const S = 'test-secret';
const exp = String(Math.floor(Date.now() / 1000) + 3600);
const ok = { ref: 'Q-2026-014', part: 'deposit', amt: '600.00', cur: 'EUR', exp };
const sig = sign(ok, S);
const t = (name, fn) => { fn(); console.log('ok', name); };

t('a minted link verifies', () => assert.deepEqual(verify({ ...ok, sig }, S), ok));
t('a changed amount fails', () => assert.equal(verify({ ...ok, amt: '6.00', sig }, S), null));
t('a changed part fails', () => assert.equal(verify({ ...ok, part: 'full', sig }, S), null));
t('a changed currency fails', () => assert.equal(verify({ ...ok, cur: 'USD', sig }, S), null));
t('another secret fails', () => assert.equal(verify({ ...ok, sig }, 'other'), null));
t('an expired link fails', () => assert.equal(verify({ ...ok, sig }, S, (+exp + 1) * 1000), null));
t('a bad reference fails', () => {
  const f = { ...ok, ref: 'Q-26-1' };
  assert.equal(verify({ ...f, sig: sign(f, S) }, S), null);
});
t('an amount over the guard fails', () => {
  const f = { ...ok, amt: '20000.01' };
  assert.equal(verify({ ...f, sig: sign(f, S) }, S), null);
});
t('no secret fails', () => assert.equal(verify({ ...ok, sig }, ''), null));
t('junk fails', () => { assert.equal(verify(null, S), null); assert.equal(verify({ ...ok, sig: 'x' }, S), null); });

/* The counter's prices (api/_shop.js) are the site's own fixed figures: re-read each one from assets/app.js
   ESTIMATE (the carte DESIGN, the money services PRICE_MODEL.argent / PRICE_OPTS) and fail on any drift. */
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { ITEMS, COMBOS, FX, price } from '../api/_shop.js';

const app = readFileSync(new URL('../assets/app.js', import.meta.url), 'utf8');
const start = app.indexOf('var ESTIMATE = (function () {');
const end = app.indexOf('})();', start);
assert.ok(start > 0 && end > start, 'ESTIMATE block not found in assets/app.js');
const E = vm.runInNewContext(`${app.slice(start, end + 5)}; ESTIMATE`, {});
const at = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), E);

for (const it of ITEMS) t(`${it.id} matches app.js ${it.src}`, () => assert.equal(it.da, at(it.src), `${it.id}: ${it.da} vs ${at(it.src)}`));
for (const c of COMBOS) t(`${c.id} matches app.js ${c.src}`, () => assert.equal(c.off, at(c.src)));
t('the combo needs the site kit', () => assert.deepEqual(COMBOS[0].needs.filter((id) => id !== 'appel').sort(), [...E.PRICE_MODEL.argent.kit.needs].sort()));
const fxm = app.match(/var FX = \{ DZD: 1, EUR: (\d+), USD: (\d+) \}/);
t('the rates match app.js FX', () => assert.deepEqual(FX, { EUR: +fxm[1], USD: +fxm[2] }));

t('a bag is priced by the server list', () => {
  const p = price([{ id: 'setup', qty: 1 }, { id: 'pack', qty: 1 }, { id: 'appel', qty: 2 }, { id: 'logo-ess', qty: 1 }], 'EUR', 'deposit');
  assert.equal(p.totalDA, 67000); assert.equal(p.dueDA, 26800); assert.equal(p.amount, '176.00');
});
t('a bag with a bad line is refused', () => {
  assert.equal(price([{ id: 'nope', qty: 1 }]), null);
  assert.equal(price([{ id: 'logo-ess', qty: 2 }]), null);
  assert.equal(price([{ id: 'carte', qty: 1.5 }]), null);
  assert.equal(price([{ id: 'carte', qty: 1 }, { id: 'carte', qty: 1 }]), null);
  assert.equal(price([]), null);
});
t('a small bag cannot take a deposit', () => assert.equal(price([{ id: 'carte', qty: 1 }], 'EUR', 'deposit'), null));

// no real money through PayPal before the owner has proven the account receives (PAYPAL_PROVEN=yes)
const KEYS = { PAYPAL_CLIENT_ID: 'id', PAYPAL_CLIENT_SECRET: 'x', PAY_LINK_SECRET: 'k' };
t('live keys stay off until the account is proven', () => {
  assert.equal(gate({ ...KEYS, PAYPAL_ENV: 'live' }).api, false);
  assert.equal(gate({ ...KEYS, PAYPAL_ENV: 'live', PAYPAL_PROVEN: 'yes' }).api, true);
  assert.equal(gate({ ...KEYS }).api, true, 'sandbox keys move test money only');
});
t('the PayPal.me link waits for the proof too', () => {
  assert.equal(gate({ PAYPAL_ME: 'numidea' }).paylink, null);
  assert.equal(gate({ PAYPAL_ME: 'numidea', PAYPAL_PROVEN: 'yes' }).paylink, 'https://www.paypal.com/paypalme/numidea');
  assert.equal(gate({ PAYPAL_ME: 'a/b', PAYPAL_PROVEN: 'yes' }).paylink, null);
});
t('an empty environment offers no PayPal at all (production today)', () => {
  const g = gate({}); assert.equal(g.api, false); assert.equal(g.paylink, null);
});

/* The webhook (api/pay-hook.js) captures an order the buyer approved but never came back from, only when PayPal
   vouches for the event, and with the page's own idempotency key. fetch is mocked: no PayPal call. */
{
  const { default: hook } = await import('../api/pay-hook.js');
  const ENV = { PAYPAL_CLIENT_ID: 'id', PAYPAL_CLIENT_SECRET: 'x', PAY_LINK_SECRET: 'k', PAYPAL_WEBHOOK_ID: 'WH-1' };
  const H = { 'paypal-auth-algo': 'SHA256withRSA', 'paypal-cert-url': 'https://api.paypal.com/v1/notifications/certs/C', 'paypal-transmission-id': 't', 'paypal-transmission-sig': 's', 'paypal-transmission-time': 'now' };
  const run = async (env, headers, event, verdict = 'SUCCESS') => {
    const calls = [], saved = { ...process.env }, f = globalThis.fetch, log = console.log;
    Object.assign(process.env, env);
    globalThis.fetch = async (url, o = {}) => {
      calls.push({ url: String(url), id: (o.headers || {})['PayPal-Request-Id'] });
      const j = /oauth2/.test(url) ? { access_token: 'T' } : /verify-webhook/.test(url) ? { verification_status: verdict }
        : { status: 'COMPLETED', purchase_units: [{ reference_id: 'C-1', payments: { captures: [{ id: 'CAP', amount: { value: '9.00' } }] } }] };
      return { ok: true, status: 200, json: async () => j };
    };
    console.log = () => {};
    let code; const res = { setHeader() {}, status(c) { code = c; return { json: () => code }; } };
    try { await hook({ method: 'POST', headers, body: event }, res); } finally {
      globalThis.fetch = f; console.log = log;
      for (const k of Object.keys(process.env)) if (!(k in saved)) delete process.env[k];
      Object.assign(process.env, saved);
    }
    return { code, calls };
  };
  const approved = { id: 'WH-EV', event_type: 'CHECKOUT.ORDER.APPROVED', resource: { id: '5O190127TN364715T', status: 'APPROVED' } };
  const a = await run(ENV, H, approved);
  t('an approved order the buyer left is captured by the webhook', () => {
    assert.equal(a.code, 200);
    const cap = a.calls.find((c) => /\/capture$/.test(c.url));
    assert.ok(cap, 'a capture call');
    assert.equal(cap.id, 'cap-5O190127TN364715T', 'the page and the webhook share one idempotency key');
  });
  const b = await run(ENV, H, approved, 'FAILURE');
  t('an event PayPal does not vouch for is refused, nothing captured', () => {
    assert.equal(b.code, 400); assert.ok(!b.calls.some((c) => /\/capture$/.test(c.url)));
  });
  const c = await run(ENV, { ...H, 'paypal-cert-url': 'https://evil.example/cert' }, approved);
  t('a certificate from outside paypal.com is refused', () => { assert.equal(c.code, 400); assert.equal(c.calls.filter((x) => /verify/.test(x.url)).length, 0); });
  const d = await run({ ...ENV, PAYPAL_WEBHOOK_ID: '' }, H, approved);
  t('no webhook id: the hook stays off', () => { assert.equal(d.code, 503); assert.equal(d.calls.length, 0); });
  const e = await run({ ...ENV, PAYPAL_ENV: 'live' }, H, approved);
  t('live and not proven: the hook stays off too', () => { assert.equal(e.code, 503); assert.equal(e.calls.length, 0); });
}
