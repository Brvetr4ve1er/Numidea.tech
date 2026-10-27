---
type: map
updated: 2026-10-26
sources: [assets/app.js, index.html, README.md, BRAND.md, OWNER-CONTENT.md, scripts/check.mjs]
---

# Pricing and market

The studio publishes its prices in dinars before any quote, beside the going rates in Algeria, France and the United States, and lets a visitor size a project in an estimator, folded under the tiers since 2026-10-26 behind a summary that names what the tiers do not price: automation, e-commerce, visual identity, options and the accelerated pace (index.html › #pricing, price.lead, price.estHint; BRAND.md › Page structure and design system (home page)). Every Numidea project figure comes from one object, `PRICE_MODEL` inside `ESTIMATE` in `assets/app.js`, and the monthly maintenance line from `RETAINER`; the tier cards, the estimator and the market table all read `PRICE_MODEL` (assets/app.js › ESTIMATE, 12a). Start with the three packages, then the model table, then the market comparison.

## One source of truth

- `PRICE_MODEL` (tiers and estimator) and `RETAINER` (monthly maintenance) are set in dinars and only converted for display (assets/app.js › 12a display currency; [[PRICE_MODEL]], [[ESTIMATE]]).
- `ESTIMATE` is a pure block, figures and arithmetic only, with no DOM, so a script can test it on its own (assets/app.js › ESTIMATE, comment).
- `check.mjs` requires the dinar figures in the tier and maintenance markup to equal `PRICE_MODEL` and `RETAINER`, refuses any € or $ amount typed into the studio's own prices, and tests the estimator on every size, option set and pace (scripts/check.mjs › block 8c, priceErr; [[priceErr]]).
- If a tier moves, it moves in `PRICE_MODEL` and nowhere else (assets/app.js › ESTIMATE, comment).

## The three packages

| Package (FR / EN) | Model key | Price | Time | Scope and inclusions | Support |
|---|---|---|---|---|---|
| [[Essentiel Package\|Essentiel / Essential]] | `vitrine` | 90 000 – 160 000 DA | 2 to 4 weeks | Showcase or landing site, 1 to 5 pages; custom design; responsive, performance, basic SEO; launch, domain and certificate set up | 1 month |
| [[Studio Package (recommended)\|Studio]] ("Recommandé") | `surmesure` | 180 000 – 420 000 DA | 3 to 7 weeks | Custom site, 6 to 15 pages; trilingual FR/EN/AR with RTL Arabic; documented design system; CMS; technical SEO, Core Web Vitals, accessibility | 3 months |
| [[Moteur Package\|Moteur / Engine]] | `app` | 450 000 – 1 200 000 DA | 8 to 16 weeks | Custom web application; payments, user accounts, dashboards; scraping and market intelligence; API integrations and internal tools | 6 months |

Sources: index.html › #pricing .tiers; assets/app.js › PRICE_MODEL (base and weeks); English tier names from assets/app.js › price.t1name, price.t3name.

- The cards quote exactly what the model returns over each tier's stated scope: Essentiel is `vitrine` at 1 to 5 pages (`base_u` 5), Studio is `surmesure` at 6 to 15 pages (`base_u` 15), Moteur is `app` at its default size (assets/app.js › ESTIMATE, comment).
- What a card lists as part of the tier is in its base price: the estimator shows those options as included and adds nothing for them (assets/app.js › ESTIMATE, comment).
- Maintenance after delivery, if wanted: 18 000 – 60 000 DA a month, no fixed term (index.html › .price-note; assets/app.js › RETAINER; [[Maintenance Retainer]]).
- The Essentiel line "Mise en ligne, domaine et certificat configurés" is one of the claims the owner has to confirm, because no delivered client site is served from its own domain yet (OWNER-CONTENT.md › 14).

## The model behind the estimator

All six project types of the [[Project Estimator]] (assets/app.js › PRICE_MODEL; type labels from index.html › #estimator):

| Key | Type (FR) | Base price (DA) | Each unit above base (DA) | Unit | Slider min–max (default) | Units in base | Weeks | Options included |
|---|---|---|---|---|---|---|---|---|
| `vitrine` | Vitrine | 90 000 – 160 000 | 6 000 – 12 000 | pages | 1–10 (3) | 5 | 2–4 | none |
| `surmesure` | Site sur mesure | 180 000 – 420 000 | 9 000 – 18 000 | pages | 3–25 (8) | 15 | 3–7 | i18n, cms, ds, seo |
| `ecommerce` | E-commerce | 220 000 – 550 000 | 900 – 2 200 | products | 10–400, step 10 (60) | 60 | 5–10 | none |
| `app` | Application web | 450 000 – 1 200 000 | 18 000 – 45 000 | screens | 3–20 (6) | 6 | 8–16 | pay, api |
| `auto` | Automatisation | 140 000 – 420 000 | 15 000 – 40 000 | flows | 1–12 (3) | 3 | 2–6 | none |
| `identite` | Identité visuelle | 90 000 – 180 000 | 8 000 – 16 000 | deliverables | 1–8 (2) | 2 | 2–5 | none |

Options (`PRICE_OPTS`), added unless the type includes them (assets/app.js › PRICE_OPTS; labels from index.html › #estimator):

| Key | Option | Adds (DA) | Adds (weeks) |
|---|---|---|---|
| `i18n` | Trilingue FR / EN / AR + RTL | 22 000 – 55 000 | 1–2 |
| `cms` | CMS / back-office | 35 000 – 90 000 | 1–2 |
| `pay` | Paiement en ligne | 45 000 – 110 000 | 1–2 |
| `ds` | Design system complet | 60 000 – 140 000 | 1–3 |
| `seo` | SEO avancé & performance | 20 000 – 45 000 | 0–1 |
| `api` | Intégrations API | 30 000 – 80 000 | 1–2 |

How [[quote()]] adds it up (assets/app.js › ESTIMATE):
- Base price, plus the unit price for each unit above the units in base, plus each ticked option that the type does not include (`tally`).
- A Vitrine is never quoted above the Studio tier for the same pages: each bound (price and weeks) is the lower of the two, bound by bound.
- Rush ("Accéléré"): price × 1.25; weeks × 0.7, but never below two thirds of the standard calendar (a 2-week minimum stays 2 weeks).
- Rounding to a figure a person would say: to 50 000 DA from 500 000, to 10 000 DA from 150 000, to 5 000 DA below.
- The page calls the result an indicative range, not a quote; the firm price follows once the scope is agreed and does not move after that (index.html › #estimator, price.estFine).

## Display currency

- `FX = { DZD: 1, EUR: 151, USD: 134 }`: the Bank of Algeria official rate of early October 2026 (1 Oct: €1 = 151.06 DA, $1 = 133.66 DA), cross-checked against an independent page within 0.3% (assets/app.js › FX; [[Bank of Algeria official FX rate]]).
- Converted figures are rounded by `tidy()` to what a person would quote; tier cards, maintenance line, estimator and market table all go through that one place (assets/app.js › 12a; [[Prices set in DZD, converted for display (tidy())]]).
- `?cur=eur|usd|dzd` in a link wins over the stored choice; dinars otherwise, which is also what the markup says with scripts off (assets/app.js › CUR; README.md › Run it locally).
- Euros are shown excluding VAT with the French reverse-charge note (art. 283-2 CGI) (assets/app.js › price.curNoteEUR; README.md › Features).
- The parallel-market rate is deliberately not used, because an international client pays through official channels (BRAND.md › Market comparison).
- Graph: [[Display Currency Switch]], [[FX display-currency table (app.js section 12a)]].

## The market comparison

"Algérie, France, États-Unis : un projet, trois marchés", folded under "Comment on chiffre" (index.html › #market). Numidea's column is computed from `PRICE_MODEL` at each type's default size; the other columns are `MARKET` in app.js, mirrored as static cells for readers without scripts (assets/app.js › MARKET, nlRange; BRAND.md › Market comparison).

| Project | Numidea | Algeria | France | United States |
|---|---|---|---|---|
| Vitrine | 90 000 – 160 000 DA | 50 000 – 100 000 DA | 1 500 – 6 000 € | 1 500 – 12 000 $ |
| Site sur mesure | 180 000 – 420 000 DA | 180 000 – 400 000 DA | 6 000 – 10 000+ € | 6 000 – 20 000 $ |
| E-commerce | 220 000 – 550 000 DA | 150 000 – 1 000 000 DA | 2 000 – 20 000 € | 5 000 – 30 000 $ |
| Application web | 450 000 – 1 200 000 DA | 200 000 – 2 000 000 DA | 10 000 – 50 000 € | 20 000 – 60 000+ $ |
| Identité visuelle | 90 000 – 180 000 DA | 80 000 – 150 000 DA | 1 200 – 5 000+ € | 500 – 30 000 $ |

Source: index.html › #market .mk-table; assets/app.js › MARKET.

- Each cell runs from the low end of an experienced freelancer's range to the high end of an agency's; "+" marks an open upper bound; extremes are excluded (index.html › #market .mk-src, mk.method).
- Read against the Algerian column, the Vitrine and Identité visuelle ranges top out above the Algerian high end, and the Site sur mesure top is above it by 20 000 DA; the e-commerce and application ranges sit inside it (index.html › #market .mk-table). The app.js comment states the same: some tiers sit inside that range and some above its top (assets/app.js › ESTIMATE, comment).
- Automatisation has no market row (assets/app.js › MARKET).
- A confirmed developer's day in France costs 480 – 650 €, about 70 000 – 100 000 DA at the official rate, "roughly the price of a complete showcase site on the Algerian market" (index.html › #market .mk-day).
- The table note says the gap comes from cost of living and exchange, not tools, and that the studio delivers with React, Next.js and Vercel; the owner has to confirm that line, because every delivered build linked from the site is served by Netlify and only Bordj Steel shows Next.js (index.html › #market, mk.note; OWNER-CONTENT.md › 14).
- Graph: [[MARKET]], [[Market Comparison (Algeria  France  US)]], [[Market Range Visualization]].

### Sources the page cites

| Market | Sources (index.html › #market .mk-src) |
|---|---|
| Algeria | [[Onyxlab, Baromètre des tarifs freelance 2026]], Confirmé to Agence columns |
| France | Tandem Studio, prix création site 2026; Les Créavores, baromètre de 103 prix (June 2026); HeySimon, identité visuelle 2026; LeFreelance, day rates after Malt |
| United States | Pitchsite, Web Design Pricing Guide 2026; 8GNC, branding cost 2026; Clutch, web development pricing (Sept. 2026) |
| Exchange | Banque d'Algérie, taux de change journalier |

To update a market range, change `MARKET` in app.js and the static cells in index.html together; the rate lives in `FX`, the `mk.note` string in three languages, the `price.curNote*` strings and the static callout (BRAND.md › Market comparison, "Where the numbers live").

## How a project is billed

From the [[Billing Models Explainer]] (index.html › #models):

| Model | What it is | Where it is the norm (per the page) | Tagged "Notre modèle" |
|---|---|---|---|
| [[Fixed-price Billing (au forfait)\|Au forfait]] | Fixed price for a written scope; overrun is the provider's | Algeria: the Onyxlab barometer prices all development this way | Yes: how every project is priced |
| [[Time-based Billing (au temps passé)\|Au temps passé]] | Billed by the day or hour | France (480 – 650 € a day) and the US (100 – 149 $ an hour, agency) | No |
| [[Subscription Billing (à l'abonnement)\|À l'abonnement]] | Monthly amount for ongoing service | Common everywhere after launch | Yes: the maintenance line, 18 000 – 60 000 DA a month |
| [[Value-based Billing (à la valeur)\|À la valeur]] | Price follows what the project brings in | Rarer, mostly consulting and strategy | No |

[[Quote Cost Drivers]] listed on the page: scope (pages, products, screens), design (fully custom or from an existing charter), languages (Arabic adds a right-to-left layout), integrations, content (supplied or produced) and timing, where a compressed calendar costs +25% in the estimator (index.html › #models .md-drivers).

## Graph entry points

- Communities: [[_COMMUNITY_Pricing Model and Estimator]], [[_COMMUNITY_Prices, FX and Typography]], [[_COMMUNITY_Market Chart and Visuals]].
- Wiki articles: [[Pricing_Model_and_Estimator]], [[Prices,_FX_and_Typography]], [[Market_Chart_and_Visuals]], [[Market_Comparison_Algeria_-_France_-_US]].
- Also: [[Pricing Section (Tarifs)]], [[Published Prices Before the Quote]].

## Related maps

[[Studio and offer]] · [[Open owner items]] · [[Languages and RTL]] · [[Build and gates]] · [[Maps/Glossary|Glossary]]

## History

The June 2026 market notes are in `archive/2026-06-snapshot/03-market-intelligence.md` ([[Market_Intelligence_2026-06]]); prices and ranges there are superseded by `PRICE_MODEL` and `MARKET` in assets/app.js. The whole archive is mapped in [[June 2026 archive]].
