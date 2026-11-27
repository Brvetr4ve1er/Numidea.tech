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
- Increment 6 (2026-11-27, "advance as far as possible"):
  - Ground truth: the trunk took PR #32 up to increment 3 at 9647176 (the counter, PayPal through the Orders API only). Increments 4-6 live on this branch, re-synced with the trunk.
  - **PayPal proof gate** (`gate()` in api/pay.js): no real-money PayPal path until `PAYPAL_PROVEN=yes` is set after a real payment reaches the account. Live keys answer `ready:false` and the PayPal.me link is withheld; sandbox keys still work. Production has no PayPal variable today (checked in Vercel: all four are preview-only, scoped to this branch), and no key is in the git history (scan of all 797 commits).
  - **Studio console**: when the money services are picked, the receipt shows « Prix fixe : mettre dans le sac → », which opens the counter with the same calls and options (`?add=appel*2,setup,pack`); the starter combo applies there too.
  - **Carte**: three more single-figure headline tiers in the shop list (Pack papeterie 30 000, Maquette app 10 écrans 120 000, Packaging 1 référence 45 000), so 11 cards link. Papeterie now sells the pack its tag shows.
  - `?add=` takes a list (`id*n`, comma-separated, at most 8, each within its max).

## Where a visitor is ready to pay (map, 2026-11-27)

| Rank | Place | Decision | Why |
|---|---|---|---|
| 1 | Studio carte cards (hub/#carte) | **Placed** (11 cards) | The buyer has read a fixed price and a scope; one tap puts it in the bag. WhatsApp stays the main button. |
| 2 | Studio console, money services (hub/#pricing) | **Placed** | The receipt is a fixed total the shop sells line for line. |
| 3 | Signed quote links (deposit / balance) | Already built (increment 1) | Sent by hand with a quote; not a page link. |
| - | Console, web projects; Tarifs page; home estimator | Left out | Ranges. A cart would sell a figure the studio has not quoted. |
| - | Formules (Marque, Produit) | Left out | Big bundles; a conversation closes them better. Produit (185 000, fixed) is the first candidate if wanted. |
| - | Monthly plan, maintenance | Left out | Recurring; needs PayPal subscriptions, not built. |
| - | Game reward card (the first-project −5 % code; rank and code are `discount` in hub/src/lanterne/game.json, whatever the game thread sets) | Left out | Encre buys nothing; the code stays a WhatsApp handshake, confirmed by hand. |
| - | Book-finish commission card | Left out, candidate | Points to Tarifs today. Next candidate: the money books (argent, route) open the console on the money services. Touches the lessons, so the owner decides. |
| - | Case pages, home menu, lessons, enquêtes, COD shop | Left out | Proof and play, not a till. |

## Increment 7 (2026-11-27): no lost orders, and terms of sale

**The capture gap, closed.** `api/pay.js` captured an order only when the buyer came back to the counter. A buyer who
approved on PayPal and closed the tab left an approved, uncharged order that expired with no trace. Now:

- `api/pay-hook.js` is PayPal's webhook. Every event is checked with PayPal (`verify-webhook-signature`, the certificate
  must be on paypal.com) before anything happens. On `CHECKOUT.ORDER.APPROVED` it captures the order with the same
  `PayPal-Request-Id` (`cap-<order id>`) as the page, so PayPal charges once whichever arrives first. A failed capture
  answers 500 so PayPal retries.
- The order trace: one JSON line per step in the function logs (Vercel → Logs, filter `"pay"`): created, captured,
  capture-failed, completed / denied / refunded / reversed / pending, hook-refused. Reference, amount, status and
  PayPal's ids only; never a payer's name, e-mail or card.
- `gate()` applies to the hook too: live keys do nothing before `PAYPAL_PROVEN=yes`.
- Owner step (with the proof test, before PAYPAL_PROVEN): in the PayPal REST app → Webhooks, add
  `https://www.numedialab.dev/api/pay-hook` with the events Checkout order approved, Payment capture completed, denied,
  refunded, reversed; put the webhook id in Vercel as `PAYPAL_WEBHOOK_ID`. Without it the hook answers 503.
- Tests: `node scripts/pay-test.mjs` (the hook block mocks PayPal: shared capture key, forged event refused, foreign
  certificate refused, off without the id, off when live and unproven).

**Terms of sale and refunds** (`comptoir/conditions/`, FR/EN/AR on one page). Drafted in `scripts/build-terms.mjs`,
facts in `scripts/terms-data.mjs`. Same rule as the legal page: every `null` is a fact only the owner can give and
blocks publication, and so does any gap in `scripts/legal-data.mjs` (the page repeats the seller's identity).
`node scripts/build-terms.mjs` lists the gaps; `--preview` writes `terms-preview/` (git-ignored) with each gap marked;
once nothing is missing it writes the page and the counter links to it under the pay buttons. The text is a draft, not
legal advice: `reviewed` stays null until the owner (ideally a lawyer) has read it against Loi 18-05.

## Increment 8 (2026-11-27): a brake on order creation, and a counter that speaks its total

- `op: "create"` on `/api/pay` is braked per visitor address: at most 8 orders in 10 minutes, then 429 with
  `Retry-After`, before any PayPal call. It lives in the function's memory, so it stops one browser or one script on a
  warm instance; it is not a wall across all of Vercel. The durable wall, for the owner when PayPal goes live: a Vercel
  Firewall rate-limit rule on `/api/pay` (dashboard → Firewall → Rate limiting).
- `/comptoir/`: a polite status line (`#c-live`, visually hidden) says « Sac : 2 articles, total 45 000 DA » once the bag
  settles, in FR/EN/AR; never on the first paint. The skip link to the shelves was already there.
