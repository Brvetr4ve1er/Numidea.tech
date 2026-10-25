---
type: map
updated: 2026-10-25
sources: [README.md, BRAND.md, OWNER-CONTENT.md, index.html, 404.html, assets/app.js, assets/page-i18n.js, assets/carry.js, assets/styles.css, scene/style.css, hub/index.html, workspacehq/index.html, scripts/build-fr.mjs, scripts/lib/i18n.mjs, scripts/build-scene.mjs, scripts/scene-data.mjs, scripts/build-sitemap.mjs, scripts/check.mjs, package.json]
---

# Languages and RTL

The site is trilingual: French is the default and is baked into the HTML, English and Arabic are applied by script, and Arabic gets a mirrored right-to-left layout with logical CSS properties, Western digits and arrows that follow the reading direction (README.md › Features). This map covers where each language lives, how the language is chosen before first paint, how the French copy is kept in step with the dictionary, and the Arabic rules the gates enforce. Start with the head bootstrap and `applyLang()`, then the Arabic conventions; the page layout itself is in [[Site architecture]].

## Which page speaks what

| Page | Languages | Where the strings live | How the language is applied |
|---|---|---|---|
| `index.html` | FR, EN, AR | `I18N` and `EXTRA` in `assets/app.js` (assets/app.js › i18n dictionary, EXTRA) | Head script picks it, `applyLang()` swaps the text (index.html › 106–190; assets/app.js › applyLang) |
| `scene/` | FR, EN, AR | Inline `<script type="application/json" id="i18n">` written by `build-scene.mjs` (scripts/build-scene.mjs › 306) | Head script picks it, `assets/page-i18n.js` swaps the text (assets/page-i18n.js › 1) |
| `legal/` (once published) | FR, EN, AR | One section per language; `html[lang]` hides the others (assets/page-i18n.js › followHash) | `assets/page-i18n.js` |
| `404.html` | FR, EN, AR | All three in the markup; the title comes from a `TITLE` map (404.html › 99) | `html[lang]` picks which label shows, so nothing is swapped after paint (404.html › 66–67, 113–114) |
| `hub/` | English | — | `<html lang="en">` (hub/index.html › 2) |
| `workspacehq/` | English | — | `<html lang="en">` (workspacehq/index.html › 2) |

Each language version of `index.html` and `scene/` is a URL of its own (`?lang=en`, `?lang=ar`), listed with hreflang alternates in the sitemap; `hub/` and `workspacehq/` have one URL each (scripts/build-sitemap.mjs › MULTILINGUAL). See [[sitemap.xml (hreflang alternates)]].

## Choosing the language before first paint

The order, in the inline head script of `index.html` (index.html › 106–190):

1. `?lang=` in the address wins over the stored `numidea-lang` preference; an unknown `?lang=` value is ignored, and an unknown stored value falls back to the baked French.
2. `lang` and `dir` are set on `<html>` right away (`rtl` for Arabic), with the theme.
3. The canonical link, `og:url` and `og:locale` name the version the address shows; `window.NUMIDEA_CANON` lets `app.js` redo this after a switch. See [[NUMIDEA_CANON (canonical setter)]].
4. Font preloads are written per language: an Arabic visitor gets IBM Plex Sans Arabic 400 and 600 plus the Latin faces the Arabic hero still uses. See [[Language-aware script-written preloads]].
5. For an English or Arabic visitor the script sets `data-i18n-pending`, and an inline head style hides the body with `display:none` until `app.js` has swapped the text (index.html › 206). The comment there records that `visibility:hidden` and `opacity:0` still measured a layout shift, so the hold uses `display:none` (index.html › 198).
6. If `app.js` has not released the hold, a backstop does, right after `DOMContentLoaded` or at 1.5 s; the page then shows the baked French, left to right, until `app.js` applies the language (index.html › 166–174).

Why: before this, the deferred swap rewrote 194 nodes and flipped `dir` after paint, measured at CLS 0.63; a French visitor never takes the hold, and an English or Arabic visitor pays roughly 100–200 ms of first paint (BRAND.md › The language is resolved before first paint). `scene/` repeats the same pattern in its own head script, with `?lang=` read case-insensitively (scripts/build-scene.mjs › 238).

Graph: [[Language resolved before first paint]], [[Head bootstrap  pre-paint resolver]], [[data-i18n-pending Paint Hold]], [[_COMMUNITY_Arabic RTL and Head Boot]], wiki [[Arabic_RTL_and_Head_Boot]].

## Swapping the text

- `applyLang(lang)` sets `lang`, `dir` and the title, rewrites the meta description and the `ProfessionalService` description, rebuilds the FAQ JSON-LD from the dictionary, and fills every `data-i18n`, `data-i18n-ph`, `data-i18n-aria` and `data-i18n-alt` (assets/app.js › applyLang).
- It stores the choice under `numidea-lang` and fires a `numidea:lang` event so that strings built in script (the estimator's units, the WhatsApp text) rebuild themselves (assets/app.js › applyLang; assets/app.js › 13 · WhatsApp).
- `switchLang()` runs on the FR / EN / ع buttons; if the address carries `?lang=`, it rewrites it and calls `NUMIDEA_CANON` (assets/app.js › DOM ready, language switch).
- On `scene/` and `legal/`, `setLang()` in `page-i18n.js` does the same job from the inline dictionary, updates the description and the breadcrumb's last name, and `syncCanon()` keeps the canonical in step; on Back/Forward from the cache it re-reads the stored choice (assets/page-i18n.js › setLang, syncCanon, pageshow).
- Arabic counted nouns use plural categories (`one | two | few | many | other`), and the Arabic dual stands without the numeral (assets/app.js › 12 · project estimator, plural, unit, dual).

Graph: [[applyLang()]], [[switchLang()]], [[FRENAR Language Switch]], [[page-i18n.js]], [[setLang()]], [[syncCanon()]], [[_COMMUNITY_Sheet Page i18n]], [[_COMMUNITY_Navigation and Language Switch]], wiki [[Sheet_Page_i18n]], [[Navigation_and_Language_Switch]].

## The French bake

`index.html` ships French so it reads right before `app.js` runs, with scripts off, and for scrapers that run no scripts (scripts/build-fr.mjs › 1). `scripts/build-fr.mjs` writes `I18N.fr` (with `EXTRA` merged) into:

- every `data-i18n` element's inner HTML;
- every `data-i18n-ph`, `-aria` and `-alt` attribute;
- the `<title>` and the meta description;
- the FAQ JSON-LD (`script#ld-faq`), built by `faqLd()` exactly as `applyLang()` rebuilds it (scripts/build-fr.mjs › 1).

Helpers live in `scripts/lib/i18n.mjs`: `loadDicts()` reads the `I18N` and `EXTRA` literals out of `app.js` without running the page, `i18nNodes()` finds each `data-i18n` element and the span of its inner HTML, `norm()` compares text as a browser renders it, `toMarkup()` escapes bare `&` and `<`, and `faqLd()` builds the FAQ object (scripts/lib/i18n.mjs › loadDicts, i18nNodes, norm, toMarkup, faqLd).

- Run it with `npm run build`; `--check` exits 1 when `index.html` differs (scripts/build-fr.mjs › 1; package.json › scripts).
- `check.mjs` fails when the baked French differs from the dictionary, because drift would show as copy changing after paint and no-script readers would see an older offer; the studio's JSON-LD description is baked too (BRAND.md › Project sheets (scene/); scripts/build-fr.mjs › header; scripts/check.mjs › block 8e).

Graph: [[Baked French copy (I18N.fr) in index.html]], [[build-fr.mjs]], [[bakeFr()]], [[i18n.mjs]], [[faqLd()]], [[_COMMUNITY_French Baking (build-fr)]], wiki [[French_Baking_build-fr]].

## Carrying the language between pages

- `assets/carry.js` adds an explicit `?lang=` (and `ref`, `utm_*`, `fbclid`, `gclid`) from the current address to any link to another page of the site, at the moment it is followed, so a language switch is covered (assets/carry.js › 1).
- A visitor who arrives on `scene/?lang=ar` and follows a link home stays in Arabic, because the choice is stored under the shared `numidea-lang` key (assets/page-i18n.js › 102).
- `404.html` stores a `?lang=` arrival too, so the way home stays in that language (404.html › 105).

Graph: [[carry()]], [[numidea-lang shared language preference]].

## Arabic conventions

| Rule | Where it lives or is enforced |
|---|---|
| Western digits everywhere (owner decision) | `check.mjs` fails on any Arabic-Indic digit in a page, `app.js`, `scene-data.mjs`, `build-legal.mjs` or `voices-data.mjs` (BRAND.md › Arabic conventions; scripts/check.mjs › block 8f) |
| Forward arrows are `←`; a back link uses `→` | BRAND.md › Arabic conventions; the RTL benefit-line arrow (assets/styles.css › 516); "back" labels in Arabic (scripts/scene-data.mjs › UI.ar; 404.html › 150) |
| Logical CSS properties, so one rule serves both directions | BRAND.md › Arabic conventions |
| The whole document switches to IBM Plex Sans Arabic in RTL | assets/styles.css › 20, 84 |
| Mono labels fall back to IBM Plex Sans Arabic (Geist Mono has no Arabic glyphs) | assets/styles.css › 91; scene/style.css › 28 |
| No letter-spacing in Arabic, except the Latin logo | assets/styles.css › 92; BRAND.md › RTL |
| An Arabic run on a French or English page takes the Arabic face | assets/styles.css › 96 |
| The ambient glows are mirrored with `scaleX(-1)` | assets/styles.css › 2024; BRAND.md › RTL |
| Singular "you"; brand names in Latin script except نوميديا in prose | assets/app.js › ar banner comment; OWNER-CONTENT.md › 8 |
| Latin names stay left to right inside Arabic: sheet titles, browser bars and typeface lists carry `dir="ltr"` | scripts/build-scene.mjs › sheet() |

Graph: [[Arabic conventions]], [[RTL layout mirroring]], [[IBM Plex Sans Arabic (RTL typeface)]].

## French typography

French copy keeps a no-break space (U+202F or U+00A0) before `? ! ; : »`, after `«`, and between a number and `%` or `h`; `check.mjs` reads every French string in `I18N.fr`, the scene interface and each project's French text and fails on a breakable space there (scripts/check.mjs › block 8f). The contact form's French colon uses a narrow no-break space (assets/app.js › contact form). Graph: [[French punctuation spacing]].

## Gates that guard the languages

| Check | What fails |
|---|---|
| 1 · i18n balance | A dictionary key whose count in `app.js` is not a multiple of three, that is, not once per language for each copy set (scripts/check.mjs › block 1 + 2) |
| 2 · i18n coverage | A `data-i18n*` attribute with no key (scripts/check.mjs › block 1 + 2) |
| 7 · generated pages | The scene page out of step with its generator; a page with an inline dictionary whose keys do not resolve in fr, en and ar (scripts/check.mjs › block 7) |
| 8e · baked French | The French baked into `index.html` (text, attributes, title, description, the studio's and the FAQ's JSON-LD) out of step with `I18N.fr` (scripts/check.mjs › block 8e) |
| 6 · canonicals | A page that names its canonical in both markup and head script, or names none (scripts/check.mjs › block 6) |
| Arabic digits, French typography | As above (scripts/check.mjs › block 8f) |
| 18 · descriptions and alternates | A meta description outside 50 to 160 characters in any language the page switches to (`meta.desc` in `app.js`, `ui.desc` in a generated page's dictionary); hreflang alternates in a page's head that differ from the sitemap's (scripts/check.mjs › block 18) |
| keys · direction | `?lang=ar` must give `dir="rtl" lang="ar"` on every page that has Arabic, also after the language hold's 1.5 s fallback, and the English-only pages stay left to right; hub's lightbox arrows follow the reading direction (scripts/keys.mjs › header) |
| keys · form errors | The contact form's error messages must be in the page's language (scripts/keys.mjs › contactForm) |

More in [[Build and gates]]. Graph: [[Convention every i18n key appears exactly 3x in app.js (frenar)]].

## Open items

- The Arabic copy was written for the site and is still pending a native speaker's review (OWNER-CONTENT.md › 8; BRAND.md › Arabic conventions). Both `ar:` blocks in `app.js` carry a banner saying so (assets/app.js › ar banner comment).
- The files to review are `assets/app.js`, `UI.ar` and each project's `ar` text in `scripts/scene-data.mjs`, and the `lang="ar"` lines in `404.html` (OWNER-CONTENT.md › 8).
- Points flagged for a second look: the services title, "Shopify بواجهة مستقلة (headless)", the tag pills, the estimator's counted nouns and the privacy paragraph on ad parameters (OWNER-CONTENT.md › 8).

See [[Open owner items]] and [[Arabic native review]].

## Related

- Maps: [[Site architecture]], [[Project sheets]], [[Build and gates]], [[Open owner items]], [[Maps/Glossary|Glossary]].
- Communities: [[_COMMUNITY_i18n and Contact Flow]].
- Wiki: [[i18n_and_Contact_Flow]].
