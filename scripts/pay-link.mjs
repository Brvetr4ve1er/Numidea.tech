#!/usr/bin/env node
/**
 * Mint a payment link for a signed quote (owner only, on his own machine).
 *
 *   PAY_LINK_SECRET=… node scripts/pay-link.mjs Q-2026-014 deposit 600 EUR [days=30] [lang=fr]
 *
 * Prints the /payer/ address to paste into the quote or WhatsApp. The secret
 * must be the same as PAY_LINK_SECRET in the Vercel project; it never goes in
 * git. A link stops working after `days` (default 30). Parts: deposit (40 %),
 * balance (60 %), full.
 */
import { sign, verify, PARTS, CURRENCIES } from '../api/pay.js';

const [ref, part, amount, cur = 'EUR', days = '30', lang = 'fr'] = process.argv.slice(2);
const secret = process.env.PAY_LINK_SECRET;
const host = process.env.PAY_HOST || 'https://www.numedialab.dev';
const die = (m) => { console.error(m); process.exit(1); };

if (!secret) die('PAY_LINK_SECRET is not set.');
if (!ref || !part || !amount) die('usage: node scripts/pay-link.mjs Q-2026-014 deposit 600 EUR [days] [fr|en|ar]');
if (!PARTS.includes(part)) die(`part must be one of ${PARTS.join(', ')}`);
if (!CURRENCIES.includes(cur)) die(`currency must be one of ${CURRENCIES.join(', ')}`);

const amt = Number(amount).toFixed(2);
const exp = String(Math.floor(Date.now() / 1000) + Number(days) * 86400);
const fields = { ref, part, amt, cur, exp };
const sig = sign(fields, secret);
if (!verify({ ...fields, sig }, secret)) die('the link does not verify: check the reference (Q-YYYY-NNN) and the amount.');

const base = lang === 'fr' ? '' : `/${lang}`;
console.log(`${host}${base}/payer/?${new URLSearchParams({ ...fields, sig })}`);
