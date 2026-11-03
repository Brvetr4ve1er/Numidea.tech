---
type: map
updated: 2026-11-03
sources: [package.json, README.md, BRAND.md, RELEASE.md, IMPROVEMENTS.md, netlify.toml, vercel.json, .nvmrc, .htmlvalidate.json, .github/workflows/pages.yml, scripts/check.mjs, scripts/themes-check.mjs, scripts/validate.mjs, scripts/validate-embed.json, scripts/audit.mjs, scripts/sweep.mjs, scripts/vbugs.mjs, scripts/vbugs-allow.json, scripts/verify.mjs, scripts/bump.mjs, scripts/site.mjs, scripts/lib/serve.mjs, scripts/build-lang.mjs, scripts/build-tarifs.mjs, scripts/build-scene.mjs, scripts/build-voices.mjs, scripts/build-legal.mjs, scripts/build-sitemap.mjs, scripts/build-og.mjs, scripts/og-capture.mjs, scripts/shots.mjs, scripts/work-capture.mjs, scripts/client-logos.mjs, scripts/verify-domains.mjs, scripts/build-kb.mjs, scripts/stage-site.mjs, scripts/stage-check.mjs, scripts/lib/strip-comments.mjs, scripts/metrics.mjs, scripts/legal-data.mjs, scripts/lib/i18n.mjs, scripts/build-creative.mjs, scripts/build-csp.mjs, scripts/lib/csp.mjs, scripts/keys.mjs, scripts/links.mjs, scripts/lib/stage-404.mjs, .github/workflows/check.yml, .github/workflows/monitor.yml, index.html, OWNER-CONTENT.md, audit/Technical_Debt.md, audit/Architecture.md, package-lock.json, knowledge-base/graphify/GRAPH_REPORT.md]
---

# Build and gates

The site has no framework and no runtime dependency, and the only deploy-time "build" is staging the publishable files; a few Node scripts generate pages and regions of pages, and a set of "gates" must pass before a push (README.md › This repository — the landing page; .github/workflows/pages.yml › header; BRAND.md › The gates). Start with the commands table; `npm run verify` runs every gate in one go, and the block-by-block table of `scripts/check.mjs` tells you what a red line means. Publishing is in [[Deploy]]; the theme contract in [[Themes and tokens]]. Since 2026-10-25 no gate runs in CI: GitHub Actions is blocked on the account's billing, so every gate runs locally before a push (RELEASE.md › 9).

## Commands

| Command | Runs | What it does | Needs |
|---|---|---|---|
| `npm run build` | `build-scene`, `build-voices`, `build-legal`, `build-lang`, `build-tarifs`, `build-sitemap`, then `build-csp` last | Regenerates `scene/`, the voices region, `legal/` (only when complete), the French baked into `index.html` and the English and Arabic pages `en/` and `ar/` written from it, the price guide's three pages, `sitemap.xml`, then the Content-Security-Policy meta of every page (package.json › scripts.build) | Node only |
| `npm run check` | `check.mjs`, then `themes-check.mjs` | Repository invariants and the theme contract | Node only, no dependencies |
| `npm run validate` | `validate.mjs` | html-validate on every entry page (`.htmlvalidate.json`, the recommended rules) and on the three WorkspaceHQ embed templates (`scripts/validate-embed.json`) | `npm install` |
| `npm run audit` | `audit.mjs` | Browser audit, 92 runs: desktop LCP over 1.5 s fails, every CSP violation fails, each language's own page of the home and the guide, the WorkspaceHQ embeds and the booted console, 404 two folders down, the first screen in fallback type, the Arabic font files fetched by other languages' pages (a failure since 2026-11-03), then a throttled phone that only reports until `AUDIT_PHONE_STRICT=1` | Playwright, Chromium, axe-core |
| `npm run sweep` | `sweep.mjs` | Contrast measured on the painted pixels, every language page of the home and the guide in the six themes | Playwright, Chromium, sharp |
| `npm run vbugs` | `vbugs.mjs` | Layout scanner with an allowlist; the home and the guide at seven widths | Playwright, Chromium |
| `npm run keys` | `keys.mjs` | Keyboard paths, focus rings, dialogs, the contact form, the guide's cross-page estimate, reduced motion, right-to-left; 60 runs | Playwright, Chromium |
| `node scripts/stage-check.mjs` | `stage-check.mjs` | Stages the site as the Pages deploy does, then proves the comment-stripped stylesheets parse to the same rules and the scripts compile, and the pages are byte-identical (404.html's root links aside) | Playwright, Chromium |
| `npm run verify` | `verify.mjs` | All eight gates (check, themes, validate, audit, sweep, vbugs, keys, stage-check) | All of the above |
| `npm run metrics` | `metrics.mjs` | Not a gate: the home and the guide per language and size, block by block, the other pages' totals, and the row IMPROVEMENTS.md's history takes | Playwright, Chromium |
| `npm run links` | `links.mjs` | Every external link the published site carries answers; not part of `verify` | The network |
| `npm run csp` | `build-csp.mjs` | Rewrites the CSP meta of every page in `PAGES` and the three embeds; `-- --check` only reports | Node only |
| `npm run kb` | `build-kb.mjs` | Exports the graphify graph into this vault (needs graphify installed) | Node only |
| `npm run bump` | `bump.mjs` | Rewrites every `?v=` cache stamp | Node only |
| `npm run stage` | `stage-site.mjs` | Copies the deploy set into `_site/`, points `404.html`'s JavaScript-off links at the site root (`--pages`: the path of `BASE`), then strips the comments from every staged `.css` and `.js` (`scripts/lib/strip-comments.mjs`) | Node only |
| `npm run scene` | `build-scene.mjs` | Regenerates `scene/` only | Node only |
| `npm run og` | `build-og.mjs` | Every share card from its `CARDS` table: the home's three (`assets/og.jpg`, `og-en.jpg`, `og-ar.jpg`), the hub's, `scene/`'s and WorkspaceHQ's; `og-capture.mjs` retired on 2026-11-03 | Playwright, sharp |
| `npm run shots` | `shots.mjs` | Screenshots of the live client sites into `assets/previews/`, 1280 wide and 720 wide | Playwright, sharp, network |
| `npm run work:capture` | `work-capture.mjs` | Project-sheet captures into `assets/work/<slug>/`, each with its phone-size twin | Playwright, sharp, network |
| `npm run logos` | `client-logos.mjs` | The client logos, taken from each live site's header | Playwright, sharp, network |

Sources: package.json › scripts; README.md › Commands; scripts/verify.mjs › STEPS; scripts/keys.mjs › header; scripts/links.mjs › header; scripts/build-csp.mjs › header; scripts/stage-site.mjs › header; scripts/stage-check.mjs › header; scripts/metrics.mjs › header; scripts/check.mjs › header; scripts/lib/serve.mjs › header; scripts/audit.mjs › header; scripts/sweep.mjs › header; scripts/shots.mjs › header; scripts/work-capture.mjs › header; scripts/client-logos.mjs › header; the `Needs` column also follows each script's own `import` lines.

- Node 22.22 or later in the 22 line, or 24.8 or later (html-validate 11 refuses 24.0 to 24.7); `.nvmrc` says 22.22; the dev dependencies are axe-core, html-validate, Playwright and sharp (package.json › engines, devDependencies; .nvmrc).
- The browser gates and the capture scripts find Chromium through `CHROMIUM_PATH`, else the newest build under `/opt/pw-browsers/`, else Playwright's own; `shots.mjs` and `work-capture.mjs` launch through the same `launch()` since 2026-10-31 (scripts/lib/serve.mjs › header, launch).
- On the fleet's machine the browser gates took about an hour in all: keys ≈ 14 min, audit ≈ 20, sweep ≈ 10, vbugs ≈ 8, stage-check under a minute (RELEASE.md › 2; IMPROVEMENTS.md › F18).
- `npm run kb` runs `scripts/build-kb.mjs`, the vault export; `-- --code` refreshes the code graph first (scripts/build-kb.mjs › header; package.json › scripts).
- `scripts/verify-domains.mjs` checks whether a client's own domain serves the same build as the card links; it never edits anything (scripts/verify-domains.mjs › header). No client's own domain verifies yet; that is an owner item (OWNER-CONTENT.md › 9. Clients' own domains): [[Open owner items]].
- `package.json` is private and an ES-module package (`"type": "module"`); it declares no runtime dependencies, only the four dev dependencies, and `package-lock.json` is committed beside it (package.json; package-lock.json). In July 2026 the two files held only the screenshot pipeline's dependencies (audit/Architecture.md › Repository map): [[package.json  package-lock.json (screenshot pipeline deps only)]].
- The capture and image scripts (`shots`, `work:capture`, `logos`, `og`, `scripts/plates.mjs`, `scripts/build-creative.mjs`) are not gates; they are mapped in [[Captures and image tools]].
- Graph: [[npm commands table]], [[npm run build (page generators)]], [[_COMMUNITY_package.json]], wiki [[wiki/package.json|package.json]], [[_COMMUNITY_Dev Dependencies]], wiki [[Dev_Dependencies]].

## Shared script config: scripts/site.mjs

`scripts/site.mjs` describes the site once, as data only: importing it has no side effects, so every script can share it (scripts/site.mjs › header). Change a page list, the deploy set, a language or a theme here, not in the scripts.

| Export | What it holds | Imported by |
|---|---|---|
| `ROOT` | The repository root, worked out from the module's own location | 24 modules, from `check.mjs` and the generators to `lib/serve.mjs` and `lib/i18n.mjs` |
| `BASE` | The GitHub Pages address, `https://brvetr4ve1er.github.io/Numidea.tech/` | `check`, `build-scene`, `build-sitemap`, `build-legal`, `stage-site`, `audit`, `links` |
| `LANGS` | `fr`, `en`, `ar` | `check`, `build-sitemap`, `build-legal`, `legal-data` |
| `THEMES` | The six theme names | `themes-check`, `audit`, `sweep`, `build-legal` |
| `PAGES` | The ten entry pages (the home's three, the guide's three, `404.html`, `hub/`, `scene/`, `workspacehq/`), plus `legal/index.html` once it exists | `check`, `bump`, `validate`, `build-sitemap`, `build-csp`, `csp-test`, `keys` |
| `EXTRA_PAGES` | The three WorkspaceHQ embeds: checked for references, not entry pages | `check`, `build-csp`, `csp-test`, `validate` |
| `DEPLOY`, `DEPLOY_SKIP`, `isDeploySkipped()` | Exactly what is published; the file names never published inside it (`README.md`, `_ds_manifest.json`, `.DS_Store`, matched without regard to case), asked through the one function by every walker | `stage-site`, `check`, `build-legal`, `lib/deploy-files` |
| `NOT_DEPLOYED` | Folders and files that must never be published, local tool state included (`NOTICE.md` and `.nvmrc` since 2026-10-31) | `check` |
| `LEGAL_PUBLISHED` | Whether `legal/index.html` exists; it extends `PAGES` and `DEPLOY` | `check` |

Sources: scripts/site.mjs › header, PAGES, DEPLOY, isDeploySkipped, NOT_DEPLOYED; the `import` line of each script, and the imports at the top of scripts/check.mjs and scripts/stage-site.mjs.

- `scripts/shots.mjs` works out its own root, and `scripts/work-capture.mjs` and `scripts/plates.mjs` write to paths relative to where they are run; none of the three imports `site.mjs` (their import lines).
- A new root folder must be added to `DEPLOY` or `NOT_DEPLOYED` before `check` passes (scripts/check.mjs › block 6); what that means for publishing is in [[Deploy]].
- A new theme name goes into `THEMES` here and in `app.js`, among other places, or `themes-check` fails (BRAND.md › Theme contract (replaces the Engineering alternate stylesheet)); see [[Themes and tokens]].
- In the graph the shared constant is [[ROOT_1|ROOT]], a god node with 19 edges (knowledge-base/graphify/GRAPH_REPORT.md › God Nodes); the note named plain `ROOT` is the constant inside `build-scene.mjs`. Wiki [[wiki/ROOT|ROOT]]; nodes [[site.mjs]], [[BASE]], [[THEMES]], [[PAGES_3]], [[EXTRA_PAGES]], [[DEPLOY]], [[NOT_DEPLOYED]], [[LEGAL_PUBLISHED]].

## What the build generates

| Generator | Writes | From | Kept in step by |
|---|---|---|---|
| `build-lang.mjs` | The French of every `data-i18n` text and attribute in `index.html`, its title, meta description, share texts, the studio's JSON-LD description and the FAQ JSON-LD; then `en/index.html` and `ar/index.html`, the same page written with their dictionary, their own head, share card, canonical, paths and CSP (`bakeLang()`; it replaced `build-fr.mjs` on 2026-10-31) | `assets/i18n/{fr,en,ar}.js` | `check` (scripts/check.mjs › block 8e) |
| `build-tarifs.mjs` | `tarifs/index.html`, `en/tarifs/index.html`, `ar/tarifs/index.html`: the tiers and the estimator read from `index.html`'s `SLOT` markers, the home's chrome and money FAQ entries, the generator's own market comparison and pricing models (`MARKET`), through `bakeLang()` | `index.html`, the three dictionaries | `check` (scripts/check.mjs › block 7) |
| `build-scene.mjs` | `scene/index.html`, with its CSP meta; each capture named in a `srcset` with its phone-size twin | `scripts/scene-data.mjs` | `check` (scripts/check.mjs › block 7) |
| `build-voices.mjs` | The `SLOT:voices` region of `index.html`; empty while there are no voices | `scripts/voices-data.mjs` | `check` (scripts/check.mjs › block 8e) |
| `build-legal.mjs` | `legal/index.html` and the legal link regions, only when every owner field is set (16 fields; the ad and WhatsApp Business sentences follow `privacy.metaAds` and `privacy.whatsappBusiness`); otherwise nothing, and the regions stay empty | `scripts/legal-data.mjs` | `check` (scripts/check.mjs › block 8d) |
| `build-sitemap.mjs` | `sitemap.xml`: the static language pages (the home's three, the guide's three) once each with `fr`/`en`/`ar` + `x-default` alternates; `scene/` and, once published, `legal/` as `?lang=` versions | `PAGES` in `scripts/site.mjs`; `STATIC_LANG`, `TARIFS_LANG`, `MULTILINGUAL`, `LANG_FOLDERS` | `check` (scripts/check.mjs › block 6) |
| `build-csp.mjs` | The Content-Security-Policy meta of every page in `PAGES` and the three embeds, with the sha256 of each inline script; it runs last, since every step before it may rewrite an inline script (`build-lang` and `build-tarifs` apply it to their own output too, a no-op at the end) | `withCsp()` in `scripts/lib/csp.mjs` | `check` (scripts/check.mjs › block 16) |
| `build-og.mjs` (not in `npm run build`: `npm run og`) | `assets/og.jpg`, `og-en.jpg`, `og-ar.jpg`, one card per language, drawn from the tokens and faces | `CARDS` in the script, `themes.css`, `fonts.css` | `check` (scripts/check.mjs › block 18, the og:image size; block 17, ≤ 300 kB) |

Sources: the generators' headers (scripts/build-lang.mjs, scripts/build-tarifs.mjs, scripts/build-scene.mjs, scripts/build-voices.mjs, scripts/build-legal.mjs, scripts/build-sitemap.mjs, scripts/build-csp.mjs, scripts/build-og.mjs › header comments); the order (package.json › scripts.build): `build-lang` after `build-legal`, which may rewrite `index.html`, and `build-tarifs` after `build-lang`.

- `build-lang`, `build-tarifs`, `build-voices`, `build-legal`, `build-sitemap` and `build-csp` each take `--check`, which exits 1 when the committed file differs (same headers).
- `en/index.html`, `ar/index.html` and the guide's three pages open with a banner comment saying they are generated and never edited by hand (en/index.html › 2–4; tarifs/index.html › 2–5).
- `build-legal.mjs --preview` writes `legal-preview/` with the gaps marked; it is git-ignored and never deployed (scripts/build-legal.mjs › header). The missing fields are in [[Open owner items]].
- The legal page's facts are `LEGAL` in `scripts/legal-data.mjs`: every `null` is a fact only the owner can give and blocks publication, `false` means "does not apply" where a comment allows it, and free-text fields take one value per language (scripts/legal-data.mjs › header). `missing()` lists the gaps, which `npm run build` prints instead of writing the page (scripts/legal-data.mjs › missing; scripts/build-legal.mjs › header).
- The legal page holds all three languages and `html[lang]` shows one, so no text is swapped after paint (scripts/build-legal.mjs › header).
- Graph for the legal page: [[build-legal.mjs]], [[legal-data.mjs]], [[Legal notice + privacy page (generated, unpublished)]], [[_COMMUNITY_Legal Page Generator]], [[_COMMUNITY_Legal Data and Privacy]], wiki [[Legal_Page_Generator]], [[Legal_Data_and_Privacy]].
- The sheets themselves are in [[Project sheets]]; the bake of the three languages in [[Languages and RTL]]; the price guide in [[Pricing and market]].
- Graph: [[_COMMUNITY_Generated Pages and Voices]], [[_COMMUNITY_French Baking (build-fr)]], wiki [[Generated_Pages_and_Voices]] (the graph of 2026-10-19 names `build-fr.mjs`, gone on 2026-10-31).

## The gates

| Gate | Script | What it catches | Where it runs |
|---|---|---|---|
| check | `scripts/check.mjs` | Repository invariants, table below | `verify`, CI on every push and pull request, every deploy |
| themes | `scripts/themes-check.mjs` | The 44-token contract (`--field-border` added, the three logo tokens gone with the drawn wordmark), contrast pairs, theme lists, preloaded faces (`index.html`'s and `404.html`'s `HEAD` maps against each theme's heading face), each of the home's two theme pickers read on its own, every token read by a consumer sheet (`tarifs/style.css` and `scene/style.css` among them) | `verify`, CI on every push and pull request, every deploy |
| validate | `scripts/validate.mjs` | html-validate on every entry page in `PAGES`, plus `legal-preview/` when it exists, on `.htmlvalidate.json` (the recommended rules, nothing relaxed); then the three WorkspaceHQ embed templates on `scripts/validate-embed.json`, which relaxes only what their runtime's `{{ }}` bindings are (html-validate configures per folder, and a config inside `workspacehq/embed/` would be published); the export's own accessibility gaps (3 icon buttons named by `title=`, 4 unnamed landmarks) stay as warnings | `verify`, CI on every push and pull request, every Pages deploy |
| audit | `scripts/audit.mjs` | Layout shift over 0.01, axe violations, horizontal overflow, reveals that never fired, tap targets under 24px, broken images, endless animations, JS errors, failed and third-party requests, any CSP violation in any frame; desktop page runs fail when LCP at load is over 1.5 s; each language's own page of the home (six themes) and the guide (arcanum, daylight); the three WorkspaceHQ embeds and the booted console; `404.html` two folders down, here and on an emulated GitHub Pages, with JavaScript on and off; the first screen in fallback type (every theme in French and English, webfonts refused vs loaded, 360 to 1600 wide: no text block may change height); the Arabic font files a page in another language fetched, which fails the run (the rule since 2026-11-03: the one glyph that pulled the face is drawn); before axe, the plate rail's crossfade must have settled; each axe violation prints its nodes; then a throttled phone (LCP ≤ 2.5 s, long tasks ≤ 300 ms, interaction ≤ 200 ms; the language switch, a link, is followed, not timed), report-only unless `AUDIT_PHONE_STRICT=1`; 92 runs | `verify`, the nightly CI job, every Pages deploy |
| sweep | `scripts/sweep.mjs` | Text under 4.5:1 (3:1 for large text) against the background actually painted, on every language page of the home and the guide in the six themes, and the guide on a 390 phone in two | `verify`, the nightly CI job, every Pages deploy |
| vbugs | `scripts/vbugs.mjs` | Overlapping text, text escaping its box (a box that scrolls on an axis holds what lies past its edge there), clipped text, stretched images, horizontal scroll; the home and the guide at seven widths in four theme and language pairs | `verify`, the nightly CI job, every Pages deploy |
| keys | `scripts/keys.mjs` | The skip link, focus rings, the phone and theme menus, the CV panel, the folded estimator's scope handed to the message, the guide's open estimator handing its scope to the home page's form across the navigation, the contact form (errors, the mail hand-off, the lead store's POST with its switch on), hub's and scene/'s dialogs, the embeds taking focus; with reduced motion, anything hidden at load, script still moving things, endless animations, playing embeds, smooth scrolling and a walking Bit in the booted console; `dir="rtl"` on the Arabic pages and with `?lang=ar` on the pages that still switch (`/?lang=ar` must land on `/ar/`); any JS error or CSP violation; the theme test drives the picker that is shown and, below 960px, opens the phone menu first (Escape closes the picker alone, Enter leaves the menu open); the mail hand-off's subject is `form.subj` plus the name; 69 runs | `verify`, the nightly CI job, every Pages deploy |
| stage-check | `scripts/stage-check.mjs` | After `stage-site.mjs --pages`: a staged page that differs from the repository's (404.html's root links aside), a stripped stylesheet that parses in the browser to other rules than its source, a stripped script that does not compile | `verify` (last step), the Pages `gates` job after keys |
| links | `scripts/links.mjs` | A dead owned or client link (4xx, 5xx, DNS, timeout); hosts that refuse bots are only warned, each with its reason | the nightly CI job and `monitor.yml`; not in `verify`, since it needs the network |

Sources: scripts/verify.mjs › STEPS; scripts/validate.mjs › header; scripts/audit.mjs › header, `DESKTOP_LCP`, `PHONE`, arFont; scripts/keys.mjs › header; scripts/stage-check.mjs › header; scripts/links.mjs › header; scripts/sweep.mjs › header; scripts/vbugs.mjs › header; scripts/themes-check.mjs › consumers; .github/workflows/check.yml › the jobs; every gate in this table runs before a Pages deploy (.github/workflows/pages.yml › gates), while the mirrors run only check and themes (netlify.toml › build; vercel.json › buildCommand) (more in [[Deploy]]).

- `npm run verify` runs the eight steps in order, does not stop at the first failure, prints a summary with each step's time, and exits non-zero if any failed (scripts/verify.mjs › header, STEPS).
- The red run of 2026-10-31, the phone menu's 'Guide des prix' wrapping in the metric fallback, is fixed (F24: `.mobile-menu nav a{font-size:min(40px,10.5vw)}`); on the checkout of 2026-11-03 all 92 audit runs are green except the throttled phone, which only reports: the Arabic one is slow (LCP 2.9 to 3.2 s) (IMPROVEMENTS.md › F17, F24); a flake of the throttled phone, a tap before `app.js` landed, is closed by waiting for `html.js-ready`. The throttled Arabic phone is at LCP 3,032 ms, report-only (IMPROVEMENTS.md › F17).
- In CI the browser gates run in two places, each after `npx playwright install --with-deps chromium`. One is the Check workflow's `nightly` job, every night and from Actions, Check, Run workflow (the `browser` input defaults to true), through `npm run verify`. The other is the `gates` job before every Pages deploy, one step per gate. In both, every gate runs even after one failed, so one run lists every failure (.github/workflows/check.yml › 13–16, 22–32, 80–105; .github/workflows/pages.yml › 6–9, 83–102).
- CI installs with `npm ci` and `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` before `validate`, on Node 22 (.github/workflows/check.yml › 46–57).
- The `check` job, on every push and pull request, also runs `npm run build` and fails when the build changes or adds a file, then `npm audit --omit=dev` (.github/workflows/check.yml › 61–78). The `nightly` job also runs `npm run links` and the full `npm audit` (.github/workflows/check.yml › 106–111). Which command proves which release step is in RELEASE.md › 2.
- The rule is "seven commands, all green before a push"; `npm run csp` and `npm run links` are listed beside them as commands that are not gates (BRAND.md › The gates).
- Graph: [[The gates (pre-push commands)]], [[Verify gates (npm run verify)]], [[STEPS]], [[Check workflow (CI)]], [[Browser gates step (on demand)]], [[npm ci without browser download]].

## check.mjs, block by block

The header lists every block under the label its body comment carries, and asks for citations by label, never by line, because blocks merged from other work move the lines (scripts/check.mjs › header). This map cites it that way: `scripts/check.mjs › block 8b`.

| Block | Fails when |
|---|---|
| 1 i18n balance | The three dictionaries `assets/i18n/{fr,en,ar}.js` do not hold the same keys |
| 2 i18n coverage | A `data-i18n*` attribute on `index.html`, `en/`, `ar/` or the guide's pages names a key missing from a dictionary |
| 3 assets | A local `src`/`href` or a `srcset` candidate on any page or WorkspaceHQ embed is missing, or a candidate's `NNNw` descriptor is not the file's width; asset paths in inline scripts and preloaded font names included (`fileSize` and `srcset` are shared helpers read by blocks 3, 5b, 17b and 18) |
| 3b parallax | A `data-parallax` depth does not parse to a non-zero number |
| 4 stamps | The `?v=` stamps differ between pages (fix: `npm run bump`) |
| 5 client links | A client's plate, card and browser bar disagree; `shots.mjs` covers other clients; the sheets use a URL the page does not link; `hub/` lists a client site |
| 5b client logos | The logo strip is not exactly the delivered clients, each with its own file, alt, intrinsic size, mask and card link |
| 5c client benefits | A sheet lacks its context or 3 to 5 benefits in three languages with a live page each; a work card lacks its benefit line; any benefit reads as a figure or a result |
| 6 deploy coverage | A `DEPLOY` path is missing; a root folder is neither deployed nor excluded (`isDeploySkipped()` from `site.mjs` names the files skipped inside a published folder); a deployed page links to an unpublished file; the sitemap is stale or lists unpublished URLs; staging `404.html` (`scripts/lib/stage-404.mjs`) finds nothing to rewrite, leaves a relative link or changes a script; a page does not name exactly one canonical (none on `404.html`): from its head script where that script reads `?lang=` (`index.html`, `scene/`, `legal/`), from its markup where it reads none (`en/`, `ar/`, the guide, `hub/`, `workspacehq/`), never both |
| 7 generated pages | `scene/index.html` or one of the guide's three pages differs from its generator; an inline dictionary misses a key in `fr`, `en` or `ar` |
| 8 anchors | A `#fragment` link lands on no id; an `aria-labelledby`/`describedby`/`controls` or `label for` names no id |
| 8b Supabase switch | The lead store is switched on without the published legal page, its region and a rewritten form note |
| 8c prices | Tier, maintenance and FAQ figures differ from `PRICE_MODEL`/`RETAINER` on the home (read to the estimator's end marker) or on the guide (read to where the market comparison starts); a € or $ amount is typed into the studio's own prices on either; the estimator gives a bad quote on any size, option set or pace |
| 8d legal gating | Anything links to `legal/` before it is published, or the published page is incomplete or stale |
| 8e baked languages and voices | `index.html` differs from what `bakeLang` writes from `fr.js`, or `en/` and `ar/` from what it writes from `index.html` (text, attributes, title, description, the studio's and the FAQ's structured data, the head's language), or the voices region differs from its source |
| 8f digits and typography | Arabic-Indic digits appear in a page or dictionary; French copy has a breakable space before `? ! ; : »`, after `«`, or between a number and `%` or `h` |
| 8g contact and JSON-LD | More than one contact address across the pages; JSON-LD does not parse, or its phone or e-mail disagrees with the page |
| 8h retired claims | Copy the owner retired as unsupported comes back (`RETIRED`: the English register and Arabic calques of the CMO audit, the Arabic CV's Maghreb month names, matched whole where a word sits inside another) |
| 15 knowledge base | Anything under `knowledge-base/` holds a machine path, a private-vault marker, or an e-mail address other than the two it allows |
| 15b line endings | `.gitattributes` does not start with `* text=auto eol=lf`, a binary file's type is not marked binary there, a tracked text file holds a CR, or a `.gitignore` or `.gitattributes` pattern uses syntax the check cannot read; without git it walks the files `.gitignore` keeps |
| 15c no runtime dependency | `package.json` declares a runtime dependency (`dependencies`, optional, peer or bundled); the site has none, and every package is a tool for the scripts |
| 16 content security policy | A page's meta is not `withCsp(page)` (`scripts/lib/csp.mjs`); an inline script is unhashed; an inline event handler or `javascript:` URL appears; anything the policy governs comes before the meta; a policy falls below the floor in `scripts/lib/csp-floor.mjs` (`'unsafe-eval'` is allowed on the WorkspaceHQ embeds only); `netlify.toml` and `vercel.json` send different headers, or lack `frame-ancestors` or an HSTS of at least a year |
| 17 asset budgets | A published file is over the ceiling of the longest `BUDGET` folder that contains it (a folder without one takes its nearest ancestor's) or over its own `FILES` ceiling (the CV PDF); a share card (`og.jpg`, `og-en.jpg`, `og-ar.jpg`, the hub's and WorkspaceHQ's) is over 300 kB; the whole published set is over its total (20.3 MB, from 18,381,757 B in 283 files on 2026-10-31 plus 10 %); two published files hold the same bytes (sha256 over every deployed file; the three `OFL.txt` excluded) |
| 18 SEO and structured data | A public page lacks its title, a 50 to 160 character description in its language (the home's three and the guide's three each in theirs), its og/twitter tags, an og:image size equal to the file, or exactly one h1; `404.html` and the embeds are not `noindex`; `robots.txt` disallows a sitemap URL or lacks its `Sitemap:` line; the head hreflang alternates differ from the sitemap's; the ProfessionalService or WebSite JSON-LD lacks a required property; any JSON-LD site URL (`url`, `image`, `logo`, a BreadcrumbList item…) is not under `BASE` |

Every row cites scripts/check.mjs › header and the block with that label. The prices behind the price check are in [[Pricing and market]]; the clients behind blocks 5 to 5c in [[Clients and projects]].

Graph: [[check.mjs]], [[Repository invariants (npm run check)]], [[RETIRED]], [[deployMissing]], [[legalErr]], [[_COMMUNITY_check.mjs Repository Gate]], wiki [[check.mjs_Repository_Gate]].

## Browser gates in detail

- **Shared harness.** `scripts/lib/serve.mjs` serves the repository root on a free port and launches Chromium; it is used by audit, sweep, vbugs and keys. Its `compress` option gzips text as the hosts do, and `fallback404` answers a missing file with `404.html` and status 404, as they do; audit uses both (scripts/lib/serve.mjs › header; scripts/audit.mjs › `srv`). Graph: [[serve()]], [[launch()]].
- **audit.** Opens the home page's three language pages (`index.html`, `en/`, `ar/`) in all six themes at 1280×900 and in two languages on a 390×844 phone, the guide's three in arcanum and daylight (desktop fr/en/ar, phone fr/ar), plus `scene/`, `404.html`, `hub/` in both palettes, `workspacehq/` and its embeds, tablets, short landscape, one run with the phone menu open, two with the CV panel open and two with the folded estimator open; then `404.html` two folders down, the fallback-type runs and the throttled phone, which opens `index.html` and `ar/` and taps the language switch's link, waiting for the other page to land (scripts/audit.mjs › header and the run list at its end). Tap targets apply WCAG 2.5.8's spacing exception, reveals get 1.8 s, and axe "incomplete" results are warnings, not failures (scripts/audit.mjs › header). WorkspaceHQ is exempt from the no-endless-animation rule because its loops are its design (scripts/audit.mjs › the comment above the `workspacehq` run). A timing failure counts only when a second measurement fails too (scripts/audit.mjs › header). Graph: [[Browser audit (npm run audit)]], [[axe accessibility engine]].
- **keys.** Every page in `PAGES` needs an entry in its `SPEC`, so a new page is classified rather than skipped; the home and the guide have one entry per language page (`langs: ['fr']`, `['en']`, `['ar']`), the pages that switch in place get `?lang=` appended; it drives the keyboard at 1280×900 and 390×844, then repeats each page with reduced motion emulated and the site's own handling only, then the direction run (scripts/keys.mjs › header, `SPEC`, url). The ring walk reads a hidden chip's or option's input through its label (scripts/keys.mjs › the ring walk; assets/styles.css › .echip:has(input:focus-visible)).
- **sweep.** Renders each page twice, once normally and once with all text transparent, and composites each text colour over the background sampled from the second render (scripts/sweep.mjs › header). Text inside an `aria-hidden` picture still counts; only `data-decorative` text and disabled controls (`aria-disabled="true"`) are reported as notes (scripts/sweep.mjs › header, the classification selectors). An optional argument limits it to one theme (scripts/sweep.mjs › the theme argument). Graph: [[Contrast sweep (npm run sweep)]].
- **vbugs.** Renders the home's three pages and the guide at seven widths (1440 down to 360) in four theme and language pairs (scripts/vbugs.mjs › the pairs). An issue passes only if a prefix in `scripts/vbugs-allow.json` matches it, and each entry states its reason; five entries on 2026-10-31, among them the hero's decorative glow fields and the guide's two edge badges (the tiers' and the pricing models' "Notre modèle") (scripts/vbugs.mjs › ALLOW; scripts/vbugs-allow.json). Graph: [[Visual bug scan (npm run vbugs)]], [[ALLOW]].
- **stage-check.** Stages with `--pages`, then, through the harness, parses every stylesheet from the repository and from `_site/` and compares the rule counts at every depth and the `cssText` rule by rule, compiles every script from both copies (`new Function(src)`, and in Node with `--check`), and compares the pages byte for byte except `404.html`; on 2026-10-31, 13 pages unchanged, 15 stylesheets to the same 2,272 rules, 22 scripts compiling (scripts/stage-check.mjs › header; IMPROVEMENTS.md › F18).
- When two tools disagree, look: axe caught one failure the sweep missed, and the sweep caught many axe's sampling did not (BRAND.md › `npm run sweep`).
- Graph: [[Clipping-ancestor-aware layout audits]], [[_COMMUNITY_Browser Audit and OG Build]], [[_COMMUNITY_Anti-slop and Gates]].

## Cache stamps

- The CSS and JS links carry `?v=<stamp>` (netlify.toml › 20–22); `npm run bump` rewrites every stamp in every page in `PAGES` with a new one built from the current UTC time to the minute (scripts/bump.mjs › header, 13–19).
- Run it after any CSS, JS or content change and before committing; a stale stamp is how "the website didn't update" happens (scripts/bump.mjs › header).
- `check` fails while stamps differ (scripts/check.mjs › block 4). The current stamp is `202610281934` (404.html › the stylesheet links); the fleet of 2026-10-31 has not bumped it yet (the verifier does, before the push).
- `bump` re-applies each page's CSP meta after stamping, since a stamp inside an inline script changes that script's hash, and stamps `en/`, `ar/` and the guide's pages through `PAGES` (scripts/bump.mjs › header).
- `scene/` is generated with the stamp read from `index.html` (scripts/build-scene.mjs › stamp).
- Graph: [[v= cache stamps (npm run bump)]], [[bump.mjs]], [[_COMMUNITY_Conventions Enforced by Tooling]], wiki [[Conventions_Enforced_by_Tooling]].

## Habits the gates encode

- A check that is always red stops being read: `check` once showed the same false failure for weeks, until it learned to skip script-built strings and verify their real targets (BRAND.md › The gates).
- Verify the harness before fixing the site: most of the sweep's first 549 flags were measurement errors, not page errors (BRAND.md › `npm run sweep`).
- A gate that reads only part of what a page names passes what it never saw: check 3 read `src` and `href` and not `srcset`, so a missing phone-size capture would have passed and 404ed on a phone; check 8c's price slice ended at a div the home no longer had and passed by accident; check 17 saw duplicates only in `assets/fonts/` while the WorkspaceHQ embed shipped byte-identical font copies (git log › 786ba8e, 10b90ff, 590c258; IMPROVEMENTS.md › F18).
- What is served is what is reviewed: staging strips comments and never rewrites a token, and `stage-check` proves the staged copy against the source every time (scripts/lib/strip-comments.mjs › header; BRAND.md › Staging strips the comments).

## What the fleet of 2026-11-03 added to the gates

- The token contract is 44: `--field-border` (the edge of a form field or an estimator chip, a quarter of the way from `--faint` to the card, 3.2 to 4.5:1 on `--navy` and `--void` where the hairlines gave 1.5 to 1.8:1) joined, `--font-logo`, `--logo-weight` and `--logo-tracking` left, the wordmark being one drawing from `scripts/lib/wordmark.mjs` (scripts/themes-check.mjs › CONTRACT; commits 1bcdd4a, 2be10fc).
- `404.html`'s `HEAD` map (the numeral's face) is compared with each theme's heading face as `index.html`'s is; its old `LOGO` map is gone. `lib/stage-404.mjs` rewrites the `href="index.html` prefix, so the 404's second link, `index.html#apercu`, becomes the root plus `#apercu`, and the audit's nested-404 runs accept a root link with a fragment or query.
- Arabic-font rule: a page in French or English that fetches an Arabic font file fails its audit run (`arfont`); the 404 writes the Arabic face only on the Arabic page.
- check 5 requires every sheet's `identity.href` to be a gallery the hub's design grid shows; `links` collects it (a Behance gallery answers 403 and is warned, not failed). check 8h's retired list grew (scripts/check.mjs › 5, 8h). `sweep` also covers `scene/` in daylight and noir.
- The lede's wide-screen measure is 31.5em (it was 46ch), so every line ends 16px or more before the edge in the metric fallback and in Geist, in French and English (assets/styles.css › `.lede`).
- Generators and helpers named above stay as in the table: `build-lang` (with `build-tarifs`, after it) bakes the three languages and the guide, `stage-check` proves the comment-stripped copy, `lib/strip-comments.mjs` does the stripping at staging. `scripts/build-fr.mjs` is gone and nothing re-exports it.

## History

- The July 2026 code audit listed conventions kept by discipline rather than tooling, and manual cache stamps, as debt, and recorded both as cured by `npm run check` and `npm run bump` (audit/Technical_Debt.md › D-01, D-03): [[D-01 - Conventions enforced by discipline, not tooling]], [[D-03 - Manual cache-bust stamps]]. Today `check` and `bump` still cover both (scripts/check.mjs › header, blocks 1 to 4; scripts/bump.mjs › header).
- The whole July audit, with what became of each finding, is mapped in [[Code audit (2026-07)]].
- The June 2026 knowledge base in `archive/2026-06-snapshot/` is history only: [[June 2026 archive]]. Dates are in [[Timeline]].

## Related

- Maps: [[Deploy]], [[Themes and tokens]], [[Site architecture]], [[Languages and RTL]], [[Project sheets]], [[Pricing and market]], [[Open owner items]], [[Captures and image tools]], [[Code audit (2026-07)]], [[Maps/Glossary|Glossary]].
- Communities: [[_COMMUNITY_check.mjs Repository Gate]], [[_COMMUNITY_CI Check Workflow]], [[_COMMUNITY_Anti-slop and Gates]], [[_COMMUNITY_Browser Audit and OG Build]], [[_COMMUNITY_Conventions Enforced by Tooling]], [[_COMMUNITY_Dev Dependencies]], [[_COMMUNITY_package.json]], [[_COMMUNITY_Legal Page Generator]], [[_COMMUNITY_Legal Data and Privacy]].
- Wiki: [[check.mjs_Repository_Gate]], [[CI_Check_Workflow]], [[Anti-slop_and_Gates]], [[Browser_Audit_and_OG_Build]], [[Conventions_Enforced_by_Tooling]], [[wiki/package.json|package.json]], [[wiki/ROOT|ROOT]], [[Legal_Page_Generator]].
