# Payments on numedialab.dev: placement plan (v1, 2026-11-26)

Thread: "Add PayPal payments across the site". This file is the living plan; each increment ships as a draft PR against the trunk `claude/numidea-labs-landing-c4jokc`. Nothing here is published from this project.

## 0. The blocker to clear first

- **PayPal accounts registered in Algeria are send-only**: they can pay, they cannot receive. Every PayPal button on the site is worthless unless the money lands in a PayPal Business account registered in a country that can receive (France, UAE, etc.), owned by the owner or his company. To confirm on the owner's own account (PayPal → Settings → "Receive payments"), not assumed. Sources: PayPal Community thread "Receive Money Algeria"; Ecwid "Payment options for Algeria".
- The studio's own terms (FAQ "Comment se passe le paiement ?") say: signed quote and purchase order under Algerian law, 40 % at order, 60 % on delivery, by bank transfer or CCP in Algeria, by EUR/USD transfer from abroad. Money received abroad for Algerian work also has to fit the owner's foreign-currency declaration (Argent atlas already says "project declaration made before you are paid"). Owner to check with his accountant; this plan does not decide it.
- **Algerian clients will never pay by PayPal.** They pay DA by CCP / BaridiMob / CIB / Edahabia / transfer. PayPal only serves foreign and diaspora clients paying in EUR/USD. So "maximize income" with PayPal = make paying easy for that segment, not put PayPal everywhere.

## 1. Where a payment button earns money (ranked)

| # | Place | What is paid | Why it ranks here | Vibe risk |
|---|---|---|---|---|
| 1 | `/payer/` page (FR/EN/AR), linked from the quote/invoice and WhatsApp, not from the menu | The **40 % deposit** and the **60 % balance** of a signed quote, by reference + amount | This is where the money already is. Today a foreign client who said yes has to do an international transfer (days, fees, friction). A 1-minute PayPal/card payment removes the last step between "yes" and "paid". | None: only people with a quote see it. Styled as a game "contract seal" screen. |
| 2 | Tarifs, maintenance line ("Maintenance après livraison… par mois. Sans engagement") | **Monthly maintenance subscription** (PayPal Subscriptions), EUR/USD | The only fixed, recurring price the site already publishes. Recurring revenue with no new sales effort. | Low: one quiet secondary button under the existing line, never on the tier cards. |
| 3 | End-of-book "commissions" (game loop, brief B) | A **fixed-price starter pack** per book (e.g. brand audit, site audit), if the owner sets fixed prices | Converts learners at the moment of highest intent. Needs prices that don't exist yet. | Medium: must stay an offer, never a gate; Encre still buys nothing. |
| 4 | Lanterne footer | Pay-what-you-want "Soutenir la Lanterne" | Small money; mostly goodwill. | Medium-high: a tip jar on a free school can read as begging. Later, only if asked. |

## 2. Where it does not go

- **Tier cards (Essentiel / Studio / Moteur)**: prices are "dès…", the firm price comes after scoping. A "buy" button on a range is a lie and invites refund fights. They keep pointing at the quote.
- **Home menu / hero**: Tarifs and Contact are the dominant buttons (PR 31). A PayPal button there trades a 90 000 DA lead for nothing.
- **Inside atlases, night cases, episodes**: never mid-lesson. Encre is never sold.
- **Shop (CMF Buds, DZD, cash on delivery)**: Algerian buyers, COD market. PayPal is the wrong tool there.

## 3. How it is built (so it looks native and keeps the CSP)

- **No PayPal JS SDK on the page** (it needs paypal.com scripts and frames in the CSP, which is `'self'` today, and its yellow buttons can't be restyled into the game UI). Instead: our own button (game-ui.css "seal" style, PayPal mark shown as required) → `POST /api/pay/create` (Vercel function, Orders v2, server-side client secret in Vercel env) → redirect to PayPal approval → `/payer/merci/` → `POST /api/pay/capture`. The CSP only gains `form-action`/navigation to paypal.com, no third-party script.
- Amount and currency are never trusted from the browser: the deposit page sends a quote reference; the server looks up the amount (v1: a signed short link `?ref=Q-2026-014&amt=…&sig=HMAC` minted by the owner with a script, so no database).
- Sandbox first (`PAYPAL_ENV=sandbox`), live only by the publishing session after the owner's yes.
- Webhook `PAYMENT.CAPTURE.COMPLETED` → notifies the owner (email or Telegram) so a payment is never missed.
- Analytics: `/go/pay/<step>` virtual pageviews through carry.js, like the game.

## 4. What the owner has to provide (none of it goes in the repo)

1. Which PayPal Business account receives, and its country (see §0).
2. Sandbox REST app client ID + secret (developer.paypal.com → Apps), later the live pair. They go into Vercel env vars, never into git or this thread.
3. Currency: EUR, USD, or both.
4. A payments/refunds paragraph for the legal pages (deposit non-refundable after kickoff? refund window?). I'll draft it in FR/EN/AR; owner confirms.
5. Monthly maintenance price in EUR/USD (the site shows DA with a conversion note today).

## 5. Increments

1. **This plan** + the `/payer/` page and the server flow in sandbox, provider-agnostic UI (so CCP/BaridiMob instructions can sit beside PayPal for Algerian clients).
2. Maintenance subscription on Tarifs.
3. Commissions with fixed-price packs (after game slice 3 and owner prices).
4. Revisit: Lanterne support, premium content.

## Status (2026-11-26)

- Increment 1 (PR #32): `api/pay.js` (GET probe `{ready, env}`; POST `create` / `capture`), `scripts/pay-link.mjs`, `npm run pay:test`.
- Increment 2 (PR #32): `/payer/` (FR, `?lang=en`, `?lang=ar`), noindex, linked from nowhere on the site. The button appears only when the GET probe says the route works, and the fine print says "sandbox" in test mode.
- Vercel env for this branch's previews only (Preview, git branch `claude/project-thread-5s5wmf`): `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAY_LINK_SECRET`, `PAYPAL_ENV=sandbox`. Production has none of them: the publishing session adds them when the owner says go.
- Increment 3 (PR #32, owner's redesign ask, 2026-11-26): `/payer/` became **`/comptoir/` « Le comptoir »**, a game shop grown from the price estimator. Aisles (chips) Services · Cours · Produits; loot cards with a rarity strip by price (Commun ≤ 15 000, Rare ≤ 50 000, Épique above); the bag is the estimator's receipt, with a level bar toward the 40 % deposit (from 40 000 DA), the starter combo (−5 000 DA, with a hint when one card is missing), EUR/USD chips, and two exits: PayPal, or dinars (CCP/BaridiMob) through a prefilled WhatsApp message. Kūro keeps the till and comments. A signed quote link opens the same page in contract mode.
  - Only fixed figures are sold (`api/_shop.js`): the carte's single-figure lines and the money services. Ranges stay quotes. The server re-prices every bag from its own list; `npm run pay:test` fails if a figure drifts from `assets/app.js` ESTIMATE.
  - Still noindex and linked from nowhere: where to link it from (the Studio's carte, Tarifs, the money pages) is the next decision.
  - Owner to confirm: the list of items for sale, the € / $ rounding (whole units at the site's FX), and whether the counter pays services in full or by deposit.
- Increment 4 (PR #32, 2026-11-27): the counter works **without the PayPal API**, on what is provably available.
  - Routes, chosen in the bag: **CCP · BaridiMob** (dinars, the carte price as is), **Virement € / $** (from abroad, at the site's FX), and **PayPal** only when it can take the money: the Orders API (`ready`), or else the owner's PayPal.me link (`PAYPAL_ME` env, a name, not a secret), prefilled with the amount and currency.
  - Every bag gets an order reference (`N-YYYYMMDD-XXXX`), shown in the bag and sent in a prefilled WhatsApp message with the lines, the total, the amount due and the route; a copy button gives the same text. CCP and transfer close by hand: Kūro (the owner) answers with the account details. The site never prints account numbers it was not given.
  - `/comptoir/?add=<item id>` opens the counter with that item in the bag: the link a carte card would use.
- Proposal, where to link it from (owner decides): **the Studio's carte first** (hub/#carte): each fixed-price card gets a second button « Mettre dans le sac » → `/comptoir/?add=<id>`, beside its WhatsApp button. Then the money services' page for the call, setup, pack and guides. Not the home menu or the tier cards (quotes, not carts), not lessons or Encre (the game rule: Encre buys nothing).
- Increment 5 (2026-11-27), the owner chose the carte: the 8 Studio carte cards whose lead tier the counter sells at that exact figure (Logo Signature, Mascotte, Landing, Site 5 écrans, Kit animé, Stickers, Deck 12, Audit parcours) carry « Mettre dans le sac → » under the WhatsApp button, to `../comptoir/?add=<id>` (+ `&lang=` in EN/AR). Built by scripts/lib/carte.mjs from api/_shop.js, so a card only links when its lead figure is in the shop list; ranges, quotes and Papeterie (lead tier not sold) get none. Next link spot: the money services' page.
