# Legal pages: the one form (owner, 2026-11-27)

Fill this once and both pages can publish: the **legal notice + privacy policy** (`legal/`, from `scripts/legal-data.mjs`) and the **counter's terms of sale** (`comptoir/conditions/`, from `scripts/terms-data.mjs`). Until every line below has an answer, `npm run build` writes neither page and lists what is missing.

**How to answer:** reply with the number and your answer, in French or English ("3: auto-entrepreneur", "12: no"). Where a line offers a proposal, "ok" accepts it. You give the facts once; the English and Arabic versions are written from your French and come back to you to check.

> **Not legal advice.** The text is a careful draft, not a lawyer's work. Before publishing, have it read against Algerian **Law 18-05** (e-commerce) and **Law 18-07** (personal data, ANPDP), and, if you sell to EU buyers in euros, the EU consumer rules. Line 24 stays "no" until that read has happened, and the terms page will not publish before it.

Live preview with every gap highlighted: `node scripts/build-legal.mjs --preview` → `legal-preview/`, and `node scripts/build-terms.mjs --preview` → `terms-preview/` (both git-ignored, never deployed).

---

## A. Who you are (shown on both pages)

| # | Question | Field | Notes / proposal |
|---|---|---|---|
| 1 | Your legal name: the business name, or your full civil name if you trade as yourself | `publisher.name` | |
| 2 | Your legal form | `publisher.legalForm` (FR/EN/AR) | Pick one: auto-entrepreneur · personne physique (commerçant) · EURL · SARL · other |
| 3 | Share capital | `publisher.capital` (FR/EN/AR) | Only for a company (EURL/SARL). Otherwise "none" → `false` |
| 4 | Registered postal address | `publisher.address` | The one on your registration |
| 5 | Contact email for the pages | `publisher.email` | Ideally on the studio's own domain, not a personal Gmail |
| 6 | Registration type **and** number | `registration.label` (FR/EN/AR) + `registration.number` | e.g. "RC (CNRC) 34/00-…", "carte auto-entrepreneur (ANAE) n° …", "NIF …". If you are not registered at all, say so → `false` (and say it plainly: selling online in Algeria without a registration is a problem Law 18-05 cares about, art. 8) |
| 7 | Publication director (a person) | `director` | Usually you: same as 1 |
| 8 | Host confirmed: Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA | `hostCatalogue.vercel.address` | **Pre-filled** from Vercel's legal pages. "ok" or correct it. The GitHub Pages mirror is dropped from the page because it is frozen and is not the site |

## B. Privacy

| # | Question | Field | Notes / proposal |
|---|---|---|---|
| 9 | How long you keep enquiries (form, email, WhatsApp) | `privacy.retention` (FR/EN/AR) | Proposal: "3 ans après le dernier échange". No final full stop. Orders are covered separately: accounting records are kept as long as the law requires |
| 10 | Email for privacy requests | `privacy.rightsEmail` | Proposal: same as 5 |
| 11 | ANPDP declaration: its number or status | `privacy.anpdp` (FR/EN/AR) | Under Law 18-07 a processing of personal data is declared to the ANPDP. If you have not declared, answer "none" → `false`, and know that this is a real compliance gap, not a formality: worth fixing before taking payments |
| 12 | Do you run Facebook / Instagram ads that link to the site? | `privacy.metaAds` | yes → the page gets the "if you arrive from an ad" section; no → it is dropped |
| 13 | Does the WhatsApp number run on the **WhatsApp Business** app? | `privacy.whatsappBusiness` | yes / no |
| 14 | Copyright of the site's text, illustrations and CV | `ip.licence` | **cc0** (today's LICENSE file: anyone may copy and reuse everything, Yasser and Kūro included) or **reserved** (LICENSE then covers the code only; the art and text are yours). Recommendation: **reserved**. CC0 on a studio whose product is its characters gives them away |

## C. Terms of sale at Le comptoir

Already covered in the draft from your own counter, so no question: the **40 % deposit** from the counter's threshold (`api/_shop.js`), the balance on delivery, the routes (CCP · BaridiMob, € / $ transfer, PayPal), the mock-up/audit credit, and a new **right-of-withdrawal** section: custom work started at your client's request and digital guides supplied at purchase are not withdrawable; standard sticker sheets are, 14 days, for buyers who have that right.

| # | Question | Field | Notes / proposal |
|---|---|---|---|
| 15 | How fast you confirm an order once the payment arrives | `confirm` (FR/EN/AR) | Proposal: "24 heures ouvrées" |
| 16 | A cancellation **before** any work started is… | `cancelBeforeStart` (FR/EN/AR) | Proposal: "remboursée en totalité" |
| 17 | The deposit **once work has started** … | `depositAfterStart` (FR/EN/AR) | Proposal: "reste acquis au studio" |
| 18 | Hours of notice to move a call free of charge | `callNotice` | Proposal: 24 |
| 19 | Days within which a refund is sent | `refundDays` | Proposal: 14 |
| 20 | ~~Sticker sheets: shipping~~ No longer asked: physical goods moved to tr4velerz.studio (2026-11-28), so the counter ships nothing | (removed) | |
| 21 | May you show finished work in your portfolio unless the client refuses in writing? | `portfolio` | yes (opt-out) / no (only with written consent) |
| 22 | The court for disputes | `court` (FR/EN/AR) | Proposal: "les tribunaux de Bordj Bou Arréridj" (where the studio is) |

## D. Sign-off

| # | Question | Field | Notes |
|---|---|---|---|
| 23 | Date of this review | `lastUpdated` in both files | Filled with the day the answers go in, unless you give one |
| 24 | Has the text been read against Law 18-05 / 18-07 (ideally by a lawyer)? | `terms.reviewed` | Stays "no" (null) until yes. The terms page never publishes before it |

---

### What happens after you answer

1. The answers go into `scripts/legal-data.mjs` and `scripts/terms-data.mjs`, with the EN and AR versions written from your French.
2. `npm run build` then writes `legal/index.html` (the footer and the contact form link to it) and `comptoir/conditions/index.html` (the counter links to it beside the pay buttons). `check.mjs` refuses any link to either page until then.
3. You read the three languages on the preview and say go; the publishing session ships it.

### Three things this form cannot fix

- **The withdrawal waiver needs a click.** For an EU consumer, losing the right of withdrawal on custom work only holds if they asked for the work to start and acknowledged it before paying. The counter has no such checkbox yet. Worth adding next to the pay buttons before selling to EU buyers.
- **The PayPal order trace lives in Vercel's function logs**, which Vercel keeps only for a short time (it depends on the plan). It is a trace for debugging, not an order book. Keep each order slip and proof of payment yourself for the accounts.
- **Hosting and domain under Law 18-05.** As I read it, article 8 ties e-commerce to registration in the trade register **and** to a site hosted in Algeria under a `.dz` domain ("com.dz"). The counter sells from Vercel on `numedialab.dev`. If the lawyer confirms that reading, selling to Algerian buyers needs a `.dz` front (or a written view that a studio selling services is outside it). This is the question to ask first; it is bigger than any wording here.
