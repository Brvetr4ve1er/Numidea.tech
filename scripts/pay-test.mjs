#!/usr/bin/env node
/* npm run pay:test — the payment link's signature rules, offline (no PayPal call). */
import assert from 'node:assert/strict';
import { sign, verify } from '../api/pay.js';

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
