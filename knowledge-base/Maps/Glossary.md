---
type: map
updated: 2026-10-26
sources: [README.md, BRAND.md, OWNER-CONTENT.md, index.html, 404.html, scene/index.html, assets/app.js, assets/carry.js, assets/styles.css, scripts/site.mjs, scripts/check.mjs, scripts/build-fr.mjs, scripts/bump.mjs, scripts/plates.mjs, scripts/scene-data.mjs, scripts/stage-site.mjs, scripts/voices-data.mjs, scripts/build-kb.mjs, git log, knowledge-base/archive/2026-06-snapshot/glossary.md]
---

# Glossary

The words this studio and this codebase use for their own things: the offer and its packages, the design system, the pictures, the pages, the scripts and the checks. Each term has a one-line meaning, the file that defines it and, where one exists, its note in the graph. New readers start with "The studio and the offer"; anyone about to change code starts with "Build, gates and deploy".

Several words look alike and mean different things: "plate" (the hero rotator), "plates" (the five engravings of the atlas) and "planches" (the project sheets in `scene/`). They are split out in "Plate, plates and planches" below.

## The studio and the offer

| Term | Meaning | Source | Graph |
|---|---|---|---|
| Numidea Labs | A development studio out of Bordj Bou Arréridj, Algeria, that designs, builds, ships and maintains digital products | README.md › Numidea Labs | [[Numidea Labs (studio)]] |
| "Rooted in Numidia, built on ideas" | The studio's tagline | README.md › Numidea Labs | [[Tagline Rooted in Numidia · built on ideas]] |
| L'Aperçu / The Preview / المعاينة | The signature offer: before any payment, the homepage of the client's new site with their own content in 5 working days, shown on a 30-minute video call; free, no obligation, registered businesses only, at most 4 a month across all clients | assets/app.js › prev.brief, prev.terms; README.md › What we build | [[L'Aperçu  The Preview (signature offer)]] |
| `#apercu` | The L'Aperçu card that opens the services section; the offer is also step 3 of the method | BRAND.md › Page structure and design system (home page) | [[_COMMUNITY_L'Aperçu and Method]] |
| Method | The one four-step process on the page, in `#how` | BRAND.md › Page structure and design system (home page) | [[Method Section (four steps)]] |
| Essentiel | First package: a showcase or landing site of 1 to 5 pages, 2 to 4 weeks, 1 month of support, 90 000–160 000 DA | assets/app.js › price.t1*, PRICE_MODEL.vitrine | [[Essentiel Package]] |
| Studio (package) | Second package, marked "Recommandé": a custom site of 6 to 15 pages, trilingual, documented design system, CMS, technical SEO; 3 to 7 weeks, 3 months of support, 180 000–420 000 DA | assets/app.js › price.t2*, PRICE_MODEL.surmesure; index.html › 782 | [[Studio Package (recommended)]] |
| Moteur | Third package: a custom web application with payment, accounts, dashboards, scraping and API integrations; 8 to 16 weeks, 6 months of support, 450 000–1 200 000 DA | assets/app.js › price.t3*, PRICE_MODEL.app | [[Moteur Package]] |
| Maintenance | Optional monthly upkeep after delivery, 18 000–60 000 DA a month, no fixed term | assets/app.js › RETAINER, price.retainerA, price.retainerB | [[Maintenance Retainer]] |
| Delivered clients | The four client sites the page shows as delivered: Bordj Steel, Alliance Travel, AlmaFlowClim, Nomara Voyages | BRAND.md › Client logo strip | [[Delivered clients (quotable)]] |
| Démo portfolio | The label for Glaive Store, a portfolio demo that is never presented as a client | BRAND.md › The hero plate; BRAND.md › Project sheets (scene/) | [[Glaive Store gaming-gear shop (sheet 03, portfolio demo)]] |
| Retired claims | Copy the owner retired as unsupported ("Le plus choisi", "Démo →", "5 / 7" and their translations); `check.mjs` fails if any comes back | scripts/check.mjs › RETIRED | [[RETIRED]] |
| Owner items | What only the owner can supply (legal fields, client quotes, photos, permissions, confirmations), each with its status | OWNER-CONTENT.md › table | [[Owner-supplied content register]] |

- Nomara Voyages is shown as delivered work, but whether it is a client with permission to show the site is unconfirmed (OWNER-CONTENT.md › 7); see [[Nomara Voyages (unconfirmed client)]].
- One Essentiel line, "Mise en ligne, domaine et certificat configurés", is among the claims only the owner can confirm (OWNER-CONTENT.md › 14).
- Since the copy rewrite of 2026-10-14, "Moteur/Engine" names only the package, not a service group (commit 16d16e7).
- More in [[Studio and offer]], [[Clients and projects]] and [[Open owner items]].

## Prices and the estimator

| Term | Meaning | Source | Graph |
|---|---|---|---|
| `PRICE_MODEL` | The one price source, in dinars: base range, per-unit rate, size limits and weeks for six project types (vitrine, surmesure, ecommerce, app, auto, identite) | assets/app.js › estimator model | [[PRICE_MODEL]] |
| `PRICE_OPTS` | The six estimator options (i18n, cms, pay, ds, seo, api); each adds money and weeks unless the tier already includes it | assets/app.js › estimator model | [[Project Estimator]] |
| `ESTIMATE` | The estimator's pure block, figures and arithmetic with no page, so a script can test it; it never quotes a Vitrine above the Studio figure for the same pages | assets/app.js › estimator model | [[ESTIMATE]] |
| Rush | The faster pace: 25% more, calendar times 0.7 but never below two thirds | assets/app.js › RUSH_PRICE, rushWeeks | [[Price estimator]] |
| Display currency | Prices are set in DZD and converted for display only, at 151 DA/EUR and 134 DA/USD; `?cur=eur`, `usd` or `dzd` picks the currency | BRAND.md › Prices: set in dinars, converted for display; assets/app.js › 12a | [[FX display-currency table (app.js section 12a)]] |
| `tidy()` | Rounds each converted figure to what a person would actually quote | BRAND.md › Prices: set in dinars, converted for display | [[Prices set in DZD, converted for display (tidy())]] |
| HT / reverse charge | The € view is shown before tax, with the French B2B reverse-charge note | BRAND.md › Prices: set in dinars, converted for display | — |
| Market comparison ("Ici et ailleurs") | Each project type priced across Algeria, Numidea, France and the US, from an experienced freelancer's low end to an agency's high end | BRAND.md › Market comparison ("Ici et ailleurs") and pricing models | [[Market comparison ('Ici et ailleurs')]] |
| `MARKET` | The market ranges in app.js §14, mirrored by static cells in index.html for readers without scripts | BRAND.md › Market comparison ("Ici et ailleurs") and pricing models | [[MARKET (app.js section 14)]] |
| "Comment on chiffre" | The folded disclosure under the estimator that holds the market comparison, billing models and cost drivers | BRAND.md › Page structure and design system (home page); index.html › 899 | [[Pricing Section (Tarifs)]] |

- The conversion rate is the Bank of Algeria official rate of early October 2026 (BRAND.md › Prices: set in dinars, converted for display); see [[Bank of Algeria official FX rate]].
- Numidea's own column in the market table is computed from `PRICE_MODEL`, never typed (BRAND.md › Market comparison ("Ici et ailleurs") and pricing models).
- `check.mjs` requires the dinar figures in the tier and maintenance markup to equal `PRICE_MODEL` and `RETAINER` (BRAND.md › Prices: set in dinars, converted for display).
- Figures and sources in [[Pricing and market]]; see also [[_COMMUNITY_Pricing Model and Estimator]] and [[Pricing_Model_and_Estimator]].

## Themes and tokens

| Term | Meaning | Source | Graph |
|---|---|---|---|
| Arcanum | The identity and default theme: arcane-blue ground, brass flourish, engraved Cinzel display, electric teal as rationed neon | README.md › Design system; BRAND.md › How themes work here | [[Arcanum theme (default)]] |
| The six themes | arcanum, noir, daylight, mono, altneon, engineering; the list is `THEMES` | scripts/site.mjs › THEMES; BRAND.md › How themes work here | [[Six themes (Arcanum, Noir, Daylight, Mono, Alt-neon, Engineering)]] |
| Tokens | CSS custom properties set per theme in `themes.css`; `styles.css` reads theme values only through `var(--token)` and may not contain a `[data-theme]` selector, so a theme is a swap of values | BRAND.md › How themes work here; README.md › This repository — the landing page | [[Design-token system (every rule reads var(--token))]] |
| The contract | The 46 tokens every theme block in `assets/themes.css` sets, exactly and nothing else | BRAND.md › Theme contract; README.md › Design system | [[Theme contract (47 tokens)]] |
| `themes-check` | The gate on the contract: a missing or extra token, a text/surface pair under 4.5:1 (7:1 for `--ice`), a theme selector or colour literal in `styles.css`, a drifting theme list, an unpreloaded heading face | BRAND.md › Theme contract (replaces the Engineering alternate stylesheet) | [[themes-check gate]] |
| `HEAD` / `LOGO` maps | Each theme's heading face that index.html preloads (`HEAD`) and each theme's wordmark face on the 404 page (`LOGO`) | index.html › 109; 404.html › 95; BRAND.md › Theme contract | [[headMap]] |
| Fill vs text tokens | `--teal` and `--crimson` are fills; `--teal-text` and `--crimson-text` are for text; `color:` is never set from a fill | BRAND.md › Text tokens vs fill tokens | [[Text tokens vs fill tokens]] |
| `--ice` | The foreground colour in every theme, light on dark palettes and dark on Daylight | BRAND.md › Text tokens vs fill tokens | [[--ice foreground token]] |
| `--ink-k` | Illustration strength, a multiplier on each plate's opacity | BRAND.md › Theme contract | [[CSS luminance mask over currentColor (.ill)]] |
| DESIGN SYSTEM block | The block near the end of `styles.css` that is the source of truth for every theme: seven text sizes, corner radii 4 / 8 / 14, the section rhythm | BRAND.md › Page structure and design system (home page) | [[DESIGN SYSTEM block (styles.css)]] |
| Anti-slop | The rule against the generic generated-page look: no gradient-filled text, no animation that runs forever, no aurora or neon bloom | BRAND.md › The anti-slop sweep | [[Anti-slop sweep]] |

- Adding a theme means one block in `themes.css` plus the name in `THEMES` (site.mjs and app.js), the theme menu, `HEAD` and `LOGO`; `themes-check` fails until all agree (BRAND.md › Theme contract).
- More in [[Themes and tokens]], [[_COMMUNITY_Theme Token Contract]] and [[Theme_Token_Contract]].

## Plate, plates and planches

| Term | Meaning | Source | Graph |
|---|---|---|---|
| The plate (hero plate) | The hero's rotator: one live site at a time, five slides (the four client sites shown as delivered and the Glaive demo), changed by a wipe, never a cross-fade, with a pause button | index.html › 305; BRAND.md › The hero plate; README.md › Features | [[Hero plate (one live site at a time)]] |
| The atlas, plates I–V | Five numbered generated engravings of the region, used as luminance masks over `currentColor`, so each re-inks in every theme | BRAND.md › The atlas — engraved plates and animated icons | [[The atlas - six engraved plates]] |
| `plates.mjs` | Turns the generated engravings into the masks in `assets/illus/` and the skyline polygons that clip each vista layer | scripts/plates.mjs › header | [[plates.mjs]] |
| `.lz` / `.ai` | Plate masks that load a screen ahead of the viewport; hand-drawn animated line icons that draw in once and settle | BRAND.md › The atlas — engraved plates and animated icons | [[Animated icons (.ai)]] |
| Planches (project sheets) | `scene/`, "Planches — le travail, livrable par livrable": one sheet per project with its pages, phones and visual system | scene/index.html › 7, 8; BRAND.md › Project sheets (scene/) | [[Planches project sheets page (work, deliverable by deliverable)]] |
| Scene sheets | The same sheets by folder name: `scene/index.html` is generated, so changes go into `scripts/scene-data.mjs`, then `npm run scene` | BRAND.md › Project sheets (scene/) | [[Project sheet (planche) structure]] |
| Sheet slugs | bordjsteel, alliance, glaive, workspacehq, almaflow | BRAND.md › Project sheets (scene/) | [[scriptsscene-data.mjs (project sheet data)]] |
| `context` / `gains` / `at` | A sheet's "what it gives the client" block: who the client is, 3 to 5 things a visitor can do on the live site, and the page that shows each; no figures or results | scripts/scene-data.mjs › header; scripts/check.mjs › block 5c | [[Project benefits (context  gains  at)]] |
| Planches banner | The one call to action that ends `#work`, "Ouvrir les planches →" | index.html › 545; BRAND.md › Page structure and design system (home page) | [[Project Plates Banner (Planches)]] |
| Title block | The hero drawn as a drafting sheet, with a strip of checkable fields along its bottom edge | BRAND.md › The hero as a drafting sheet | [[Hero as drafting-sheet title block]] |
| Visualisations | Five pictures of figures the page already states, each beside its text equivalent and `aria-hidden` | BRAND.md › Visualisations (r3/c) | [[Visualisations (r3c)]] |
| Client logo strip | "Ils nous ont confié leur site": the own logos of the four clients shown as delivered, in one theme colour, each linked to its work card | BRAND.md › Client logo strip | [[Client logo strip ('Ils nous ont confié leur site')]] |

- An old `#/work/<slug>` link from the removed explorer is sent to the matching sheet through the `SHEET` map (assets/app.js › SHEET).
- More in [[Project sheets]], [[_COMMUNITY_Founder Section and Atlas Plates]], [[_COMMUNITY_Hero Plate and Client Logos]] and [[_COMMUNITY_Project Sheets Generator]].

## Languages

| Term | Meaning | Source | Graph |
|---|---|---|---|
| Baked French | The French copy written into `index.html`, so the page reads right before app.js runs and for scrapers; `build-fr` writes `I18N.fr` into it and `check.mjs` fails on drift | scripts/build-fr.mjs › header; BRAND.md › Project sheets (scene/) | [[Baked French copy (I18N.fr) in index.html]] |
| `I18N` / `applyLang()` | The fr, en and ar dictionaries in app.js, and the function that applies one to the page: `lang` and `dir`, title, meta description, structured data and every translated node | assets/app.js › i18n dictionary, applyLang | [[applyLang()]] |
| Head bootstrap | The inline head script that sets theme, `lang` and `dir` before first paint | BRAND.md › The language is resolved before first paint | [[Head bootstrap  pre-paint resolver]] |
| `?lang=` | A link parameter that sets the language and the canonical URL | README.md › Features | [[Trilingual FRENAR with mirrored RTL]] |
| `page-i18n.js` | The language switch for the generated pages | README.md › This repository — the landing page | [[assetspage-i18n.js (applies the i18n dictionary)]] |
| Western digits | Owner decision: Western digits everywhere; `check.mjs` fails on any Arabic-Indic digit in a page, the dictionaries or a generator | BRAND.md › Arabic conventions | [[Arabic conventions]] |
| French typography rule | No breakable space before ? ! ; : » in French copy | scripts/check.mjs › block 8f; README.md › Commands | [[Repository invariants (npm run check)]] |

- The Arabic copy is still pending a native speaker's review (BRAND.md › Arabic conventions; OWNER-CONTENT.md › 8).
- More in [[Languages and RTL]] and [[_COMMUNITY_Arabic RTL and Head Boot]].

## Leads, voices and legal

| Term | Meaning | Source | Graph |
|---|---|---|---|
| Lead source | Where a lead came from, read when it is sent and written into the email's "Source" line; nothing is stored | BRAND.md › Lead source | [[Lead source without tracking]] |
| Ref code | The `?ref=` code each ad and email carries; WhatsApp links append it to the text as `[ref]` | BRAND.md › Lead source; assets/app.js › refTag | [[refTag()]] |
| Carry | `assets/carry.js`, on every page: links between the site's pages carry `ref`, `utm_*`, `fbclid`, `gclid` and `lang`, read at click time | assets/carry.js › header | [[assetscarry.js (shared cross-page script)]] |
| `NUMIDEA_WA` | The WhatsApp number, set by the head script and used to build `wa.me` links | index.html › 154; assets/app.js › 13 · WhatsApp | [[WhatsApp Channel (NUMIDEA_WA)]] |
| Supabase switch | The lead store, off on purpose; turning it on needs the published legal page, the store's region and a new form note, and `check.mjs` enforces all three | OWNER-CONTENT.md › 11; scripts/check.mjs › block 8b | [[Supabase lead store (off on purpose)]] |
| Voices | Client quotes, published only with consent; `VOICES` is empty and nothing renders until an entry exists | scripts/voices-data.mjs › header | [[Client voices (scriptsvoices-data.mjs)]] |
| `VOICE_CLIENTS` | The four clients shown as delivered who may carry a voice (Nomara Voyages unconfirmed, OWNER-CONTENT.md › 7); never the Glaive demo or WorkspaceHQ | scripts/voices-data.mjs › VOICE_CLIENTS | [[VOICE_CLIENTS]] |
| `SLOT:voices` | The marked region in `#work` that `build-voices` fills | index.html › 537 | [[Client Voices Slot]] |
| Legal gating | The legal page is generated only once every owner field is filled; until then nothing may link to it | BRAND.md › Legal notice and privacy — generated, unpublished until complete | [[Legal notice + privacy page (generated, unpublished)]] |
| `legal-preview/` | `--preview` output with the gaps marked, never deployed | BRAND.md › Legal notice and privacy — generated, unpublished until complete | [[legal-preview (build-legal --preview)]] |
| `LEGAL_PUBLISHED` | True only when `legal/index.html` exists; it adds the page to the page and deploy lists | scripts/site.mjs › LEGAL_PUBLISHED | [[LEGAL_PUBLISHED]] |

- As of 2026-10-12 the legal fields are missing (14 fields, 5 of them in three languages) (OWNER-CONTENT.md › table, item 1), and the repository has no `legal/` page, so nothing links to it yet (scripts/site.mjs › LEGAL_PUBLISHED).

## Build, gates and deploy

| Term | Meaning | Source | Graph |
|---|---|---|---|
| `npm run build` | The page generators in one go: build-fr, build-scene, build-voices, build-legal, build-sitemap, then build-csp last (the CSP meta of the hand-written pages) | package.json › scripts; README.md › Commands | [[npm run build (generated pages)]] |
| Gates | Seven commands, all green before a push: check, validate, audit, sweep, vbugs, keys, verify | BRAND.md › The gates | [[The gates (pre-push commands)]] |
| `check` | Repository invariants: i18n ×3, assets, stamps, client links, deploy coverage, generated pages, anchors and retired claims, the Content-Security-Policy meta (block 16), asset byte budgets (block 17), SEO and structured data (block 18), plus `themes-check` | scripts/check.mjs › header; README.md › Commands | [[Repository invariants (npm run check)]] |
| `validate` | html-validate on every page | README.md › Commands | [[HTML validation (npm run validate)]] |
| `audit` | The browser audit, 76 runs: axe, layout shift, overflow, tap targets, CSP violations, desktop LCP ≤ 1.5 s (fails), the WorkspaceHQ embeds and booted console, 404 two folders down, the first screen in fallback type; then a throttled phone, report-only until `AUDIT_PHONE_STRICT=1` | scripts/audit.mjs › header; README.md › Commands | [[Browser audit (npm run audit)]] |
| `keys` | The keyboard, reduced-motion and direction gate, in French and Arabic, on desktop and a phone | scripts/keys.mjs › header; README.md › Commands | — |
| `links` | Every external link the published site carries answers; needs the network, so it runs nightly and in the monitor, not in `verify` | scripts/links.mjs › header | — |
| `csp`, CSP meta | `npm run csp` writes each hand-written page's Content-Security-Policy meta, with the sha256 of every inline script; `npm run build` ends with it and check block 16 fails when it is stale | scripts/build-csp.mjs › header; BRAND.md › Content-Security-Policy | — |
| Live monitor | `.github/workflows/monitor.yml`, every six hours: the live pages, stamps, links and Lighthouse; a failure opens one issue, "Live monitor failed" | .github/workflows/monitor.yml › header; RELEASE.md › 5. Monitoring | — |
| RELEASE.md | The owner's release checklist: each step and the command or CI job that proves it, rollback, monitoring, domain and the settings only the owner can change | RELEASE.md › 2, 4, 5, 6, 7 | — |
| `sweep` | The contrast sweep over rendered pixels; only an element marked `data-decorative` is exempt | BRAND.md › `npm run sweep` | [[Contrast sweep (npm run sweep)]] |
| `vbugs` | The visual bug scan; accepted issues sit in `scripts/vbugs-allow.json`, each with its reason | README.md › Commands | [[Visual bug scan (npm run vbugs)]] |
| `verify` | Runs every gate (check, themes, validate, audit, sweep, vbugs, keys) and does not stop at the first failure | BRAND.md › The gates; scripts/verify.mjs › STEPS | [[Verify gates (npm run verify)]] |
| Cache stamps | The `?v=` stamps on asset links; `npm run bump` rewrites them across all pages after a CSS or JS change | scripts/bump.mjs › header | [[v= cache stamps (npm run bump)]] |
| `DEPLOY` | Exactly what is published: index.html, 404.html, robots.txt, sitemap.xml, assets/, scene/, hub/, workspacehq/, and legal/ once it exists | scripts/site.mjs › DEPLOY | [[DEPLOY]] |
| `NOT_DEPLOYED` | Folders and files that must never be served, among them scripts/, knowledge-base/, audit/, campaign/, legal-preview/, BRAND.md and README.md | scripts/site.mjs › NOT_DEPLOYED | [[NOT_DEPLOYED]] |
| `_site/` and stage | `npm run stage` copies the deploy set into `_site/` and points `404.html`'s JavaScript-off links at the site root; every host builds from it, and a missing entry fails | scripts/stage-site.mjs › header; scripts/lib/stage-404.mjs › header | [[_site (staged deploy folder)]] |
| Canonical and mirrors | GitHub Pages is the canonical host; Netlify and Vercel are mirrors that publish the same `_site/` | README.md › Deploy | [[GitHub Pages canonical deploy]] |
| r3/a, r3/b, r3/c | The three strands of round 3: FAQ columns, scroll comfort and mobile; client logos and benefit lines; visualisations and motion | assets/styles.css › 2775, 418, 1565 | [[Scroll comfort (round 3)]] |

- More in [[Build and gates]], [[Deploy]], [[_COMMUNITY_check.mjs Repository Gate]], [[_COMMUNITY_Anti-slop and Gates]] and [[check.mjs_Repository_Gate]].

## Pages, products and the knowledge base

| Term | Meaning | Source | Graph |
|---|---|---|---|
| hub/, VOIDSPLUNKER.std | The founder's personal page; client websites do not belong there | README.md › This repository — the landing page; BRAND.md › hub/ — the artist's page, not the studio's | [[hub (VOIDSPLUNKER.std founder page)]] |
| BR4VETR4VELER | The hub's gallery, remade as a series of 33 posters that reads as a story | BRAND.md › hub/ — the artist's page, not the studio's | [[BR4VETR4VELER poster series (33 posters)]] |
| WorkspaceHQ | WorkspaceHQ v3 and its launch page in `workspacehq/`, which the README calls "the studio's own product page" | README.md › This repository — the landing page; BRAND.md › workspacehq/ — the WorkspaceHQ v3 launch page | [[WorkspaceHQ v3 launch site]] |
| The cartridge | The hub hero's small WorkspaceHQ link, described in the markup as "the beloved one: WorkspaceHQ, presented as a game cartridge Bit lives on"; the home footer carried one too until 2026-10-26 | hub/index.html › 80; BRAND.md › workspacehq/, The cartridge | [[WorkspaceHQ Cartridge]] |
| The vault | `knowledge-base/`, an Obsidian vault: Home.md and Maps/ written by people (and Claude), graph/, wiki/ and graphify/ generated from the graphify graph, archive/ kept as history | scripts/build-kb.mjs › header | [[knowledge-base (internal memory snapshot)]] |
| Check 15 | `check.mjs` keeps `knowledge-base/` public-safe: it fails on a temporary-folder machine path, an artifact link, a campaign-kit file name, a private note type or an e-mail address outside its allowlist | scripts/check.mjs › block 15 | [[scriptscheck.mjs (npm run check)]] |

- The site no longer calls WorkspaceHQ open source: on 2026-10-13 its repository had no licence and no README, and restoring the wording is an owner item (OWNER-CONTENT.md › 13). More in [[WorkspaceHQ and hub]].

## History terms

These words appear in old commits and in `archive/`, but no longer describe the site.

| Term | What it was | Source | Graph |
|---|---|---|---|
| Neon Noir | The look of the first landing page; the `noir` theme was formerly called Neon Noir | commit eafff7b; BRAND.md › How themes work here | [[Neon Noir theme (now 'noir')]] |
| Engineering stylesheet | `theme-engineering.css`, an alternate stylesheet removed in the 2026-10 cleanup; Engineering is now a token theme | BRAND.md › History (removed features): Engineering as an alternate stylesheet | [[theme-engineering.css (removed alternate stylesheet)]], [[Alternate full-design-system stylesheet pattern (removed)]] |
| A/B/C variants | Page variants across the three deployments, removed in the 2026-10 cleanup; `themes-check` fails on any `[data-variant` selector in `styles.css` | commit 9742267; BRAND.md › No literal palette colours in shared rules | — |
| Project explorer | A portfolio modal with deep-linkable `#/work/<slug>` case-study views, removed in the 2026-10 cleanup | commit 3831985; BRAND.md › Page structure and design system (home page) | [[Project-explorer modal (workslug hash router)]] |
| The Build / The Engine / The Mind | The three service families of the June 2026 glossary | knowledge-base/archive/2026-06-snapshot/glossary.md (history) | [[The Engine (Family II) — the automation moat]] |

- The June 2026 glossary is kept as history in `archive/2026-06-snapshot/glossary.md`; its own banner says README.md, BRAND.md and the code win where they disagree (knowledge-base/archive/2026-06-snapshot/glossary.md › banner). Its graph form is [[KB Glossary — Internal Language]] and [[KB_Glossary_—_Internal_Language]]; the families are also [[The Build (Family I)]] and [[The Mind (Family III)]].
- How these terms came and went: [[Timeline]].
