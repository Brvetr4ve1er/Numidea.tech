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
