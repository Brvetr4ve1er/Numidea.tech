---
type: map
updated: 2026-11-06
sources: [README.md, BRAND.md, OWNER-CONTENT.md, IMPROVEMENTS.md, index.html, en/index.html, ar/index.html, tarifs/index.html, 404.html, assets/app.js, assets/i18n/fr.js, assets/i18n/en.js, assets/i18n/ar.js, assets/page-i18n.js, assets/carry.js, assets/styles.css, scene/style.css, hub/index.html, workspacehq/index.html, scripts/build-lang.mjs, scripts/build-tarifs.mjs, scripts/build-og.mjs, scripts/lib/i18n.mjs, scripts/lib/ayn.mjs, scripts/build-scene.mjs, scripts/scene-data.mjs, scripts/build-sitemap.mjs, scripts/check.mjs, scripts/keys.mjs, scripts/audit.mjs, package.json]
---

# Languages and RTL

The site is trilingual: French, English and Arabic, with a mirrored right-to-left layout for Arabic (logical CSS properties, Western digits, arrows that follow the reading direction) (README.md › Features). Since 2026-10-31 the home page and the price guide are one static page per language, written from the French template and one dictionary file per language, so no page paints in one language and switches to another; the project sheets and the legal page still switch in place with `?lang=` (scripts/build-lang.mjs › header; scripts/build-sitemap.mjs › header; IMPROVEMENTS.md › decision 15, A8). This map covers which page speaks what, how a page gets its language, how the baked text is kept in step with the dictionaries, and the Arabic rules the gates enforce. Start with the page table, then the bake; the page layout itself is in [[Site architecture]].

## Which page speaks what

| Page | Languages | Where the strings live | How the language is applied |
|---|---|---|---|
| `index.html` | FR | `assets/i18n/fr.js` (`var I18N = {…}`, `EXTRA` merged) | Baked by `scripts/build-lang.mjs`; `app.js` re-applies the same dictionary on load (scripts/build-lang.mjs › header; assets/app.js › applyLang) |
| `en/index.html`, `ar/index.html` | EN, AR | `assets/i18n/en.js`, `assets/i18n/ar.js` | Written from `index.html` by `build-lang.mjs`, each loading only its own dictionary before `app.js`; a banner comment says never to edit them by hand (en/index.html › 2–4; scripts/build-lang.mjs › header) |
| `tarifs/`, `en/tarifs/`, `ar/tarifs/` | FR, EN, AR, one each | The same three dictionaries (`tarifs.*`, `mk.*`, `md.*`, `price.*` keys) | Written by `scripts/build-tarifs.mjs`, which bakes its template through `bakeLang()` (scripts/build-tarifs.mjs › header) |
| `scene/` | FR, EN, AR | Inline `<script type="application/json" id="i18n">` written by `build-scene.mjs` (scripts/build-scene.mjs › dictionary) | Head script picks it from `?lang=` or the stored choice, `assets/page-i18n.js` swaps the text (assets/page-i18n.js › 1) |
| `legal/` (once published) | FR, EN, AR | One section per language; `html[lang]` hides the others (assets/page-i18n.js › followHash) | `assets/page-i18n.js` |
| `404.html` | FR, EN, AR | All three in the markup; the title comes from a `TITLE` map (404.html › TITLE) | `html[lang]` picks which label shows, so nothing is swapped after paint (404.html › the second head script) |
| `hub/` | English | — | `<html lang="en">` (hub/index.html › 2) |
| `workspacehq/` | English | — | `<html lang="en">` (workspacehq/index.html › 2) |

- The static language pages are listed once each in the sitemap with `hreflang` alternates naming the three plus `x-default`; the pages that switch in place carry the same alternates as `?lang=` versions (scripts/build-sitemap.mjs › header, STATIC_LANG, TARIFS_LANG, MULTILINGUAL). See [[sitemap.xml (hreflang alternates)]].
- The three dictionaries held 399 keys each on 2026-10-31 (387 after the WhatsApp pending path's key left, 391 with the share-card keys, 399 with the guide's eight) (IMPROVEMENTS.md › C8, F17; BRAND.md › The language pages). `check` block 1 holds them to the same key set (scripts/check.mjs › block 1).

## How a page gets its language

- Each static page sets `lang` and `dir` in its markup (`ar` is `rtl`), its own `<title>`, meta description, share texts (`meta.ogTitle`, `meta.ogDesc`, `meta.twDesc`, `meta.ogAlt`), `og:locale`, `og:url`, the switch's `aria-current`, the share card (`assets/og.jpg`, `og-en.jpg`, `og-ar.jpg`) and the dictionary file it loads (scripts/build-lang.mjs › header; scripts/build-og.mjs › header).
- The language switch is three links (`./`, `en/`, `ar/` at the root; `../`, `../en/`, `../ar/` one folder down), with `hreflang`, no `js-only`, so it works with scripts off; a click stores `numidea-lang` before navigating (index.html › .lang; BRAND.md › The language pages).
- On `/`, the head script's `LANG:fr-only` block (left out of `en/` and `ar/` by `build-lang`) reads a shared `?lang=` link, else the stored `numidea-lang`; an `en` or `ar` goes to that page with `location.replace` before the stylesheets, `?lang=` dropped and `?ref=`, `utm_*` and the `#hash` kept; `?lang=fr` stores `fr`; an unknown value stays (index.html › LANG:fr-only). `hub/`, `workspacehq/`, `scene/` and 404's links home land on the stored language's page through that redirect (BRAND.md › The language pages).
- The guide's boot script is the home's with that block replaced by a stored-preference redirect to the guide's version in that language; nothing reads `?lang=` there (scripts/build-tarifs.mjs › header).
- `scene/` keeps the earlier pattern: its head script reads `?lang=` case-insensitively, then the stored choice, and sets `lang` and `dir` before paint; links to it from `en/` and `ar/` carry `?lang=` (scripts/build-scene.mjs › head script; scripts/build-lang.mjs › header).
- The canonical rule (scripts/check.mjs › block 6): a page whose head script reads `?lang=` (`index.html`, `scene/`, `legal/`) sets its canonical from that script, resolving a language to its page through the `hreflang` alternates (`index.html` › canon); a page that reads none (`en/`, `ar/`, the guide, `hub/`, `workspacehq/`) carries a static canonical naming itself; both at once, or neither, fails.
- History: from 2026-08 to 2026-10-31 one `index.html` served the three languages, `applyLang()` swapped 194 nodes after paint (CLS 0.63 before the paint-hold), and an EN or AR visitor waited behind `data-i18n-pending` with the body hidden until `app.js` had run, every visitor downloading the three dictionaries inside `app.js` (BRAND.md › The language is resolved before first paint, history). `switchLang()`, `NUMIDEA_LANG`, `NUMIDEA_CANON` and the hold are gone; `app.js` no longer switches language on a bfcache `pageshow` (BRAND.md › The language pages).

Graph: [[Language resolved before first paint]], [[Head bootstrap  pre-paint resolver]], [[data-i18n-pending Paint Hold]], [[switchLang()]], [[_COMMUNITY_Arabic RTL and Head Boot]], wiki [[Arabic_RTL_and_Head_Boot]]: the generated graph of 2026-10-19 describes the one-page design; those three mechanisms no longer exist.

## The bake

`index.html` ships French so it reads right before `app.js` runs, with scripts off, and for scrapers that run no scripts; `en/` and `ar/` are the same page written with their dictionary (scripts/build-lang.mjs › header). `bakeLang(html, lang, dict, {depth, path})` writes into:

- every `data-i18n` element's inner HTML and every `data-i18n-ph`, `-aria` and `-alt` attribute;
- `<title>`, the meta description, `og:title`, `og:description`, `og:image:alt`, `twitter:title` and `twitter:description` (the `meta.*` keys); a head text that names its own key (`data-i18n` on `<title>`, `data-i18n-content` on a meta, as the guide's do) is written from that key and left alone by the home's `meta.*` pass and by `applyLang` at runtime;
- the studio's `ProfessionalService` description and the FAQ JSON-LD (`script#ld-faq`), built by `faqLd()` exactly as `applyLang()` rebuilds it;
- every WhatsApp link (`a.wa-link`), with the number in the page, else the no-number guard (no `href`, `aria-disabled`);
- `html lang` and `dir`, the switch's `aria-current`, `og:url`, `og:locale` and its alternates, the card and the dictionary file (scripts/build-lang.mjs › header).

Paths: a page one folder down gets `../` on every relative `src`, `href` and `srcset`; a link to a page that still switches with `?lang=` carries the page's language; a link into a folder that has a page per language (`LANG_FOLDERS`: the root and `tarifs/`) stays in the page's own language unless it names a language itself (scripts/build-lang.mjs › header; scripts/build-sitemap.mjs › LANG_FOLDERS). Options: `ld: false` skips the studio and FAQ structured data (the guide), `generated: null` leaves the generated-page note to the generator (scripts/build-lang.mjs › header).

Helpers live in `scripts/lib/i18n.mjs`: `loadDicts()` reads the `I18N` literal out of each `assets/i18n/<lang>.js` without running it, `i18nNodes()` finds each `data-i18n` element and the span of its inner HTML, `norm()` compares text as a browser renders it, `toMarkup()` escapes bare `&` and `<`, `esc()` escapes attribute text for the generators, and `faqLd()` builds the FAQ object (scripts/lib/i18n.mjs).

- Run it with `npm run build` (`build-lang` after `build-legal`, which may rewrite `index.html`'s legal regions; `build-tarifs` after it); `node scripts/build-lang.mjs --check` exits 1 when a page differs (package.json › scripts; scripts/build-lang.mjs › header).
- `check` block 8e bakes `en/` and `ar/` from `index.html` and fails when a committed page differs, and compares the French against `fr.js`, because drift would show as copy changing after paint and no-script readers would see an older offer; block 7 holds the guide's three pages to `renderTarifs()` (scripts/check.mjs › blocks 7, 8e).
- `scripts/build-fr.mjs` was the French-only bake until 2026-10-31; it is gone, `bakeFr(html)` being `bakeLang(html, 'fr')` in `build-lang.mjs` (scripts/build-lang.mjs › header).

Graph: [[Baked French copy (I18N.fr) in index.html]], [[build-fr.mjs]], [[bakeFr()]], [[i18n.mjs]], [[faqLd()]], [[_COMMUNITY_French Baking (build-fr)]], wiki [[French_Baking_build-fr]] (the graph names the old script).

## Swapping the text on the pages that still switch

- `applyLang(lang)` on the home and guide pages applies the one dictionary the page loaded: `lang`, `dir`, the title, the meta description, the `ProfessionalService` description, the FAQ JSON-LD, every `data-i18n*` node; it leaves a title or description that names its own key alone (assets/app.js › applyLang). It fires `numidea:lang` so strings built in script (the estimator's units, the WhatsApp text) rebuild themselves (assets/app.js › applyLang; 13 · WhatsApp).
- On `scene/` and `legal/`, `setLang()` in `page-i18n.js` swaps the text from the inline dictionary, updates the description and the breadcrumb's last name, and `syncCanon()` keeps the canonical in step; on Back/Forward from the cache it re-reads the stored choice (assets/page-i18n.js › setLang, syncCanon, pageshow).
- Arabic counted nouns use plural categories (`one | two | few | many | other`), and the Arabic dual stands without the numeral (assets/app.js › 12 · project estimator, plural, unit, dual).

Graph: [[applyLang()]], [[page-i18n.js]], [[setLang()]], [[syncCanon()]], [[_COMMUNITY_Sheet Page i18n]], [[_COMMUNITY_Navigation and Language Switch]], wiki [[Sheet_Page_i18n]], [[Navigation_and_Language_Switch]].

## Carrying the language between pages

- `assets/carry.js` adds `ref`, `utm_*`, `fbclid`, `gclid` and, to the pages that still switch in place, an explicit `?lang=` from the current address to any link to another page of the site, at the moment it is followed (assets/carry.js › 1; BRAND.md › Lead source).
- A visitor who arrives on `scene/?lang=ar` and follows a link home lands on `ar/`, because the choice is stored under the shared `numidea-lang` key and the root's head script reads it (assets/page-i18n.js › the stored choice; index.html › LANG:fr-only).
- `404.html` stores a `?lang=` arrival too, so the way home stays in that language (404.html › the second head script).
- The price guide's estimator carries its scope to the home page's form through `sessionStorage` (`numidea-prefill`), read and cleared on arrival (assets/app.js › prefillWith, the hand-off; BRAND.md › The price guide).

Graph: [[carry()]], [[numidea-lang shared language preference]].

## The ع of the language switch

The Arabic glyph on the switch is drawn, an isolated ʿayn as one stroked SVG path, `aria-hidden`, sized by the stylesheets' `.lang .ayn` rule; the control keeps its `aria-label` «العربية (ع)» and no longer carries `lang="ar"` (scripts/lib/ayn.mjs › header; index.html › .lang). Typed and marked, the one letter took the Arabic face through `styles.css`'s `[lang="ar"]` rule, 42 KB of IBM Plex Sans Arabic on every French and English visit; `en/` now requests no Arabic file, `ar/` requests all six, and the French page still requests one through the ع in `contact.vReply`'s `<span lang="ar">`, which the next change replaces with "AR" (BRAND.md › The ع is drawn; IMPROVEMENTS.md › F26). The audit lists, report-only until then, every page in another language that fetched an Arabic file (scripts/audit.mjs › header, arFont).

## Arabic conventions

| Rule | Where it lives or is enforced |
|---|---|
| Western digits everywhere (owner decision) | `check.mjs` fails on any Arabic-Indic digit in a page, the three dictionaries, `scene-data.mjs`, `build-legal.mjs` or `voices-data.mjs` (BRAND.md › Arabic conventions; scripts/check.mjs › block 8f) |
| Forward arrows are `←`; a back link uses `→` | BRAND.md › Arabic conventions; the RTL benefit-line arrow (assets/styles.css › the .gain arrow); "back" labels in Arabic (scripts/scene-data.mjs › UI.ar; 404.html › the Arabic line) |
| Logical CSS properties, so one rule serves both directions | BRAND.md › Arabic conventions |
| The whole document switches to IBM Plex Sans Arabic in RTL | assets/styles.css › html[dir="rtl"] |
| Mono labels fall back to IBM Plex Sans Arabic (Geist Mono has no Arabic glyphs) | assets/styles.css › the mono stack; scene/style.css › the mono stack |
| No letter-spacing in Arabic, except the Latin logo | assets/styles.css › html[dir="rtl"] body :not(.logo…); BRAND.md › RTL |
| An Arabic run on a French or English page takes the Arabic face | assets/styles.css › [lang="ar"] (which is why the switch's ع is drawn) |
| The ambient glows are mirrored with `scaleX(-1)` | assets/styles.css › html[dir="rtl"] body::before; BRAND.md › RTL |
| Singular "you"; brand names in Latin script except نوميديا in prose | assets/i18n/ar.js › banner comment; OWNER-CONTENT.md › 8 |
| Latin names stay left to right inside Arabic: sheet titles, browser bars and typeface lists carry `dir="ltr"` | scripts/build-scene.mjs › sheet() |
| The Arabic share card is set right to left in Plex Arabic, the logo in Latin script | scripts/build-og.mjs › header, CARDS.ar |

Graph: [[Arabic conventions]], [[RTL layout mirroring]], [[IBM Plex Sans Arabic (RTL typeface)]].

## French typography

French copy keeps a no-break space (U+202F or U+00A0) before `? ! ; : »`, after `«`, and between a number and `%` or `h`; `check.mjs` reads every French string in `fr.js`, the scene interface and each project's French text and fails on a breakable space there (scripts/check.mjs › block 8f). The contact form's French colon uses a narrow no-break space (assets/app.js › contact form). Graph: [[French punctuation spacing]].

## Gates that guard the languages

| Check | What fails |
|---|---|
| 1 · i18n balance | The three dictionaries `assets/i18n/{fr,en,ar}.js` do not hold the same keys (scripts/check.mjs › block 1) |
| 2 · i18n coverage | A `data-i18n*` attribute on `index.html`, `en/`, `ar/` or the guide's pages names a key missing from a dictionary (scripts/check.mjs › block 2) |
| 7 · generated pages | The scene page or the guide's three pages out of step with their generator; a page with an inline dictionary whose keys do not resolve in fr, en and ar (scripts/check.mjs › block 7) |
| 8e · baked languages | `index.html` out of step with `fr.js`, or `en/` and `ar/` differing from what `bakeLang` writes from `index.html` (text, attributes, title, description, the studio's and the FAQ's JSON-LD, the head's language) (scripts/check.mjs › block 8e) |
| 6 · canonicals | A page that reads `?lang=` and carries a static canonical, or one that reads none and sets it from a script, or neither (scripts/check.mjs › block 6) |
| Arabic digits, French typography | As above (scripts/check.mjs › block 8f) |
| 18 · descriptions and alternates | A meta description outside 50 to 160 characters in a page's language (`meta.desc` or `tarifs.desc` in its dictionary, `ui.desc` in a generated page's); hreflang alternates in a page's head that differ from the sitemap's (scripts/check.mjs › block 18) |
| keys · direction | `ar/` and `ar/tarifs/` give `dir="rtl" lang="ar"`; `/?lang=ar` must land on `/ar/`; `?lang=ar` on the pages that still switch gives RTL; the English-only pages and the guide's French page stay left to right (the hub's viewer, whose arrows followed the reading direction, left with the diary on 2026-11-05) (scripts/keys.mjs › header, direction) |
| keys · form errors | The contact form's error messages must be in the page's language (scripts/keys.mjs › contactForm) |
| audit · Arabic fonts | Every page in another language than Arabic that fetched an Arabic font file is listed at the end of the run, report-only until the copy change (scripts/audit.mjs › header) |

More in [[Build and gates]].

## Open items

- The Arabic copy was written for the site and is still pending a native speaker's review; every Arabic string added on 2026-10-31 (the share card's texts and the card itself, the guide's eight `tarifs.*` keys, the `price.lead` change) is listed there and awaits it (OWNER-CONTENT.md › 8; BRAND.md › Arabic conventions). The `ar` block of `assets/i18n/ar.js` carries a banner saying so (assets/i18n/ar.js › banner comment).
- The files to review are `assets/i18n/ar.js`, `CARDS.ar` in `scripts/build-og.mjs`, `UI.ar` and each project's `ar` text in `scripts/scene-data.mjs`, and the `lang="ar"` lines in `404.html` (OWNER-CONTENT.md › 8).
- Points flagged for a second look: the services title, "Shopify بواجهة مستقلة (headless)", the tag pills, the estimator's counted nouns and the privacy paragraph on ad parameters (OWNER-CONTENT.md › 8).
- The French home page still fetches one Arabic font file for the ع in `contact.vReply`; the French 404 fetches two for its inline Arabic copy (IMPROVEMENTS.md › F25, F26).
- With `lang="ar"` off the switch's control, its label «العربية (ع)» is read by the page language's voice; a translated label through `data-i18n-aria` is the copy pass's option (BRAND.md › The ع is drawn).

See [[Open owner items]] and [[Arabic native review]].

## Related

- Maps: [[Site architecture]], [[Project sheets]], [[Build and gates]], [[Pricing and market]], [[Open owner items]], [[Maps/Glossary|Glossary]].
- Communities: [[_COMMUNITY_i18n and Contact Flow]].
- Wiki: [[i18n_and_Contact_Flow]].
