---
type: map
updated: 2026-10-24
sources: [package.json, README.md, BRAND.md, netlify.toml, vercel.json, .github/workflows/pages.yml, scripts/check.mjs, scripts/themes-check.mjs, scripts/validate.mjs, scripts/audit.mjs, scripts/sweep.mjs, scripts/vbugs.mjs, scripts/vbugs-allow.json, scripts/verify.mjs, scripts/bump.mjs, scripts/site.mjs, scripts/lib/serve.mjs, scripts/build-fr.mjs, scripts/build-scene.mjs, scripts/build-voices.mjs, scripts/build-legal.mjs, scripts/build-sitemap.mjs, scripts/build-og.mjs, scripts/og-capture.mjs, scripts/shots.mjs, scripts/work-capture.mjs, scripts/client-logos.mjs, scripts/verify-domains.mjs, scripts/build-kb.mjs, scripts/stage-site.mjs, scripts/legal-data.mjs, scripts/lib/i18n.mjs, scripts/build-creative.mjs, .github/workflows/check.yml, .github/workflows/monitor.yml, RELEASE.md, index.html, OWNER-CONTENT.md, audit/Technical_Debt.md, audit/Architecture.md, package-lock.json, knowledge-base/graphify/GRAPH_REPORT.md]
---

# Build and gates

The site has no framework and no runtime dependency, and the only deploy-time "build" is staging the publishable files; a few Node scripts generate pages and regions of pages, and a set of "gates" must pass before a push (README.md › This repository — the landing page; .github/workflows/pages.yml › 3–15; BRAND.md › The gates). Start with the commands table; `npm run verify` runs every gate in one go, and the block-by-block table of `scripts/check.mjs` tells you what a red line means. Publishing is in [[Deploy]]; the theme contract in [[Themes and tokens]].

## Commands

| Command | Runs | What it does | Needs |
|---|---|---|---|
| `npm run build` | `build-fr`, `build-scene`, `build-voices`, `build-legal`, `build-sitemap` | Regenerates the French baked into `index.html`, `scene/`, the voices region, `legal/` (only when complete) and `sitemap.xml` | Node only |
| `npm run check` | `check.mjs`, then `themes-check.mjs` | Repository invariants and the theme contract | Node only, no dependencies |
| `npm run validate` | `validate.mjs` | html-validate on every page | `npm install` |
| `npm run audit` | `audit.mjs` | Browser audit, about 54 runs | Playwright, Chromium, axe-core |
| `npm run sweep` | `sweep.mjs` | Contrast measured on the painted pixels | Playwright, Chromium, sharp |
| `npm run vbugs` | `vbugs.mjs` | Layout scanner with an allowlist | Playwright, Chromium |
| `npm run verify` | `verify.mjs` | All six gates above (check, themes, validate, audit, sweep, vbugs) | All of the above |
| `npm run bump` | `bump.mjs` | Rewrites every `?v=` cache stamp | Node only |
| `npm run stage` | `stage-site.mjs` | Copies the deploy set into `_site/` | Node only |
| `npm run scene` | `build-scene.mjs` | Regenerates `scene/` only | Node only |
| `npm run og` | `og-capture.mjs`, `build-og.mjs` | Share images for `hub/`, `workspacehq/` and `assets/og.jpg` | Playwright |
| `npm run shots` | `shots.mjs` | Screenshots of the live client sites into `assets/previews/` | Playwright, sharp, network |
| `npm run work:capture` | `work-capture.mjs` | Project-sheet captures into `assets/work/<slug>/` | Playwright, sharp, network |
| `npm run logos` | `client-logos.mjs` | The client logos, taken from each live site's header | Playwright, sharp, network |

Sources: package.json › scripts; README.md › Commands; scripts/check.mjs › 33; scripts/lib/serve.mjs › header; scripts/audit.mjs › 31; scripts/sweep.mjs › 30; scripts/shots.mjs › header; scripts/work-capture.mjs › header; scripts/client-logos.mjs › header; the `Needs` column also follows each script's own `import` lines.

- Node 22.22 or later; the dev dependencies are axe-core, html-validate, Playwright and sharp (package.json › engines, devDependencies).
- The browser gates find Chromium through `CHROMIUM_PATH`, else a pre-installed build, else Playwright's own (scripts/lib/serve.mjs › header).
- `scripts/build-kb.mjs` (the vault export) calls itself `npm run kb` in its header, but `package.json` has no `kb` script; run it as `node scripts/build-kb.mjs` (scripts/build-kb.mjs › 3; package.json › scripts).
- `scripts/verify-domains.mjs` checks whether a client's own domain serves the same build as the card links; it never edits anything (scripts/verify-domains.mjs › header). No client's own domain verifies yet; that is an owner item (OWNER-CONTENT.md › 9. Clients' own domains): [[Open owner items]].
- `package.json` is private and an ES-module package (`"type": "module"`); it declares no runtime dependencies, only the four dev dependencies, and `package-lock.json` is committed beside it (package.json; package-lock.json). In July 2026 the two files held only the screenshot pipeline's dependencies (audit/Architecture.md › Repository map): [[package.json  package-lock.json (screenshot pipeline deps only)]].
- The capture and image scripts (`shots`, `work:capture`, `logos`, `og`, `scripts/plates.mjs`, `scripts/build-creative.mjs`) are not gates; they are mapped in [[Captures and image tools]].
- Graph: [[npm commands table]], [[npm run build (page generators)]], [[_COMMUNITY_package.json]], wiki [[wiki/package.json|package.json]], [[_COMMUNITY_Dev Dependencies]], wiki [[Dev_Dependencies]].

## Shared script config: scripts/site.mjs

`scripts/site.mjs` describes the site once, as data only: importing it has no side effects, so every script can share it (scripts/site.mjs › header). Change a page list, the deploy set, a language or a theme here, not in the scripts.

| Export | What it holds | Imported by |
|---|---|---|
| `ROOT` | The repository root, worked out from the module's own location | 19 modules, from `check.mjs` and the generators to `lib/serve.mjs` and `lib/i18n.mjs` |
| `BASE` | The GitHub Pages address, `https://brvetr4ve1er.github.io/Numidea.tech/` | `check`, `build-scene`, `build-sitemap`, `build-legal` |
| `LANGS` | `fr`, `en`, `ar` | `check`, `build-sitemap`, `build-legal`, `legal-data` |
| `THEMES` | The six theme names | `themes-check`, `audit`, `sweep`, `build-legal` |
| `PAGES` | The five entry pages, plus `legal/index.html` once it exists | `check`, `bump`, `validate`, `build-sitemap` |
| `EXTRA_PAGES` | The three WorkspaceHQ embeds: checked for references, not entry pages | `check` |
| `DEPLOY`, `DEPLOY_SKIP` | Exactly what is published, and file names never published inside it | `stage-site`, `check`, `build-legal` |
| `NOT_DEPLOYED` | Folders and files that must never be published, local tool state included | `check` |
| `LEGAL_PUBLISHED` | Whether `legal/index.html` exists; it extends `PAGES` and `DEPLOY` | `check` |

Sources: scripts/site.mjs › 1–38; the `import` line of each script, for example scripts/check.mjs › 39, scripts/stage-site.mjs › 11, scripts/build-sitemap.mjs › 16 and scripts/lib/serve.mjs › 13.

- `scripts/shots.mjs` works out its own root, and `scripts/work-capture.mjs` and `scripts/plates.mjs` write to paths relative to where they are run; none of the three imports `site.mjs` (their import lines).
- A new root folder must be added to `DEPLOY` or `NOT_DEPLOYED` before `check` passes (scripts/check.mjs › 248–254); what that means for publishing is in [[Deploy]].
- A new theme name goes into `THEMES` here and in `app.js`, among other places, or `themes-check` fails (BRAND.md › Theme contract (replaces the Engineering alternate stylesheet)); see [[Themes and tokens]].
- In the graph the shared constant is [[ROOT_1|ROOT]], a god node with 19 edges (knowledge-base/graphify/GRAPH_REPORT.md › God Nodes); the note named plain `ROOT` is the constant inside `build-scene.mjs`. Wiki [[wiki/ROOT|ROOT]]; nodes [[site.mjs]], [[BASE]], [[THEMES]], [[PAGES_3]], [[EXTRA_PAGES]], [[DEPLOY]], [[NOT_DEPLOYED]], [[LEGAL_PUBLISHED]].

## What the build generates

| Generator | Writes | From | Kept in step by |
|---|---|---|---|
| `build-fr.mjs` | Every `data-i18n` text and attribute in `index.html`, its title, meta description and FAQ JSON-LD | `I18N.fr` in `assets/app.js` | `check` (scripts/check.mjs › 460–467) |
| `build-scene.mjs` | `scene/index.html` | `scripts/scene-data.mjs` | `check` block 7 (scripts/check.mjs › 319–322) |
| `build-voices.mjs` | The `SLOT:voices` region of `index.html`; empty while there are no voices | `scripts/voices-data.mjs` | `check` (scripts/check.mjs › 468–475) |
| `build-legal.mjs` | `legal/index.html` and the legal link regions, only when every owner field is set; otherwise nothing, and the regions stay empty | `scripts/legal-data.mjs` | `check` (scripts/check.mjs › 441–459) |
| `build-sitemap.mjs` | `sitemap.xml`, with `fr`/`en`/`ar` alternates for `index.html`, `scene/` and, once published, `legal/` | `PAGES` in `scripts/site.mjs` | `check` block 6 (scripts/check.mjs › 286) |

Sources: the generators' headers (scripts/build-fr.mjs, scripts/build-scene.mjs, scripts/build-voices.mjs, scripts/build-legal.mjs, scripts/build-sitemap.mjs › header comments).

- `build-fr`, `build-voices`, `build-legal` and `build-sitemap` each take `--check`, which exits 1 when the committed file differs (same headers).
- `build-legal.mjs --preview` writes `legal-preview/` with the gaps marked; it is git-ignored and never deployed (scripts/build-legal.mjs › header). The missing fields are in [[Open owner items]].
- The legal page's facts are `LEGAL` in `scripts/legal-data.mjs`: every `null` is a fact only the owner can give and blocks publication, `false` means "does not apply" where a comment allows it, and free-text fields take one value per language (scripts/legal-data.mjs › header). `missing()` lists the gaps, which `npm run build` prints instead of writing the page (scripts/legal-data.mjs › missing; scripts/build-legal.mjs › header).
- The legal page holds all three languages and `html[lang]` shows one, so no text is swapped after paint (scripts/build-legal.mjs › header).
- Graph for the legal page: [[build-legal.mjs]], [[legal-data.mjs]], [[Legal notice + privacy page (generated, unpublished)]], [[_COMMUNITY_Legal Page Generator]], [[_COMMUNITY_Legal Data and Privacy]], wiki [[Legal_Page_Generator]], [[Legal_Data_and_Privacy]].
- The sheets themselves are in [[Project sheets]]; the French baking in [[Languages and RTL]].
- Graph: [[_COMMUNITY_Generated Pages and Voices]], [[_COMMUNITY_French Baking (build-fr)]], wiki [[Generated_Pages_and_Voices]].

## The gates

| Gate | Script | What it catches | Where it runs |
|---|---|---|---|
| check | `scripts/check.mjs` | Repository invariants, table below | `verify`, CI on every push and pull request, every deploy |
| themes | `scripts/themes-check.mjs` | The 47-token contract, contrast pairs, theme lists, preloaded faces | `verify`, CI on every push and pull request, every deploy |
| validate | `scripts/validate.mjs` | html-validate on every entry page in `PAGES`, plus `legal-preview/` when it exists | `verify`, CI on every push and pull request, every Pages deploy |
| audit | `scripts/audit.mjs` | Layout shift over 0.01, axe violations, horizontal overflow, reveals that never fired, tap targets under 24px, broken images, endless animations, JS errors, failed and third-party requests; LCP is measured and printed but does not fail a run | `verify`, the nightly CI job, every Pages deploy |
| sweep | `scripts/sweep.mjs` | Text under 4.5:1 (3:1 for large text) against the background actually painted | `verify`, the nightly CI job, every Pages deploy |
| vbugs | `scripts/vbugs.mjs` | Overlapping text, text escaping its box, clipped text, stretched images, horizontal scroll | `verify`, the nightly CI job, every Pages deploy |

Sources: scripts/verify.mjs › STEPS; scripts/validate.mjs › header; scripts/audit.mjs › header, 76–79; scripts/sweep.mjs › header, 115, 149; scripts/vbugs.mjs › header; .github/workflows/check.yml › 38–111; every gate in this table runs before a Pages deploy (.github/workflows/pages.yml › 51–102), while the mirrors run only check and themes (netlify.toml › 12; vercel.json › 3) (more in [[Deploy]]).

- `npm run verify` runs the six steps in order, does not stop at the first failure, prints a summary with each step's time, and exits non-zero if any failed (scripts/verify.mjs › header, 24–33).
- In CI the browser gates run in two places, each after `npx playwright install --with-deps chromium`. One is the Check workflow's `nightly` job, every night and from Actions, Check, Run workflow (the `browser` input defaults to true), through `npm run verify`. The other is the `gates` job before every Pages deploy, one step per gate. In both, every gate runs even after one failed, so one run lists every failure (.github/workflows/check.yml › 13–16, 22–32, 80–105; .github/workflows/pages.yml › 6–9, 83–102).
- CI installs with `npm ci` and `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` before `validate`, on Node 22 (.github/workflows/check.yml › 44–57).
- The `check` job, on every push and pull request, also runs `npm run build` and fails when the build changes or adds a file, then `npm audit --omit=dev` (.github/workflows/check.yml › 61–78). The `nightly` job also runs `npm run links` and the full `npm audit` (.github/workflows/check.yml › 106–111). Which command proves which release step is in RELEASE.md › 2.
- The rule is "six commands, all green before a push" (BRAND.md › The gates).
- Graph: [[The gates (pre-push commands)]], [[Verify gates (npm run verify)]], [[STEPS]], [[Check workflow (CI)]], [[Browser gates step (on demand)]], [[npm ci without browser download]].

## check.mjs, block by block

The header lists blocks 1 to 8 with 5b and 5c, then 15b and 15c; the body also has 3b and 15 (scripts/check.mjs › 1–32, 117, 544). The rows marked 8 below are the checks that run after the block 8 comment; the header files the French and voices checks under 7 (scripts/check.mjs › 16–20, 335).

| Block | Fails when | Lines |
|---|---|---|
| 1 + 2 i18n | A dictionary key in `app.js` does not appear a multiple of 3 times, or a `data-i18n*` attribute names no key | 62–79 |
| 3 assets | A local `src`/`href` on any page or WorkspaceHQ embed is missing, including asset paths in inline scripts and preloaded font names | 81–115 |
| 3b parallax | A `data-parallax` depth does not parse to a non-zero number | 117–127 |
| 4 stamps | The `?v=` stamps differ between pages (fix: `npm run bump`) | 129–134 |
| 5 client links | A client's plate, card and browser bar disagree; `shots.mjs` covers other clients; the sheets use a URL the page does not link; `hub/` lists a client site | 136–165 |
| 5b client logos | The logo strip is not exactly the delivered clients, each with its own file, alt, intrinsic size, mask and card link | 167–210 |
| 5c client benefits | A sheet lacks its context or 3 to 5 benefits in three languages with a live page each; a work card lacks its benefit line; any benefit reads as a figure or a result | 212–246 |
| 6 deploy coverage | A `DEPLOY` path is missing; a root folder is neither deployed nor excluded; a deployed page links to an unpublished file; the sitemap is stale or lists unpublished URLs; a page does not name exactly one canonical (none on `404.html`) | 248–317 |
| 7 generated pages | `scene/index.html` differs from its generator; an inline dictionary misses a key in `fr`, `en` or `ar` | 319–333 |
| 8 anchors | A `#fragment` link lands on no id; an `aria-labelledby`/`describedby`/`controls` or `label for` names no id | 335–357, 533 |
| 8 Supabase switch | The lead store is switched on without the published legal page, its region and a rewritten form note | 358–384 |
| 8 prices | Tier and maintenance figures differ from `PRICE_MODEL`/`RETAINER`; a € or $ amount is typed into the studio's own prices; the estimator gives a bad quote on any size, option set or pace | 385–440 |
| 8 legal gating | Anything links to `legal/` before it is published, or the published page is incomplete or stale | 441–459 |
| 8 French and voices | The baked French or the voices region differs from its source | 460–475 |
| 8 digits and typography | Arabic-Indic digits appear; French copy has a breakable space before `? ! ; : »`, after `«`, or between a number and `%` or `h` | 476–512 |
| 8 contact and data | More than one contact address across the pages; JSON-LD does not parse, or its phone or e-mail disagrees with the page | 513–532 |
| 8 retired claims | Copy the owner retired as unsupported comes back (`RETIRED`) | 534–542 |
| 15 knowledge base | Anything under `knowledge-base/` holds a machine path, a private-vault marker, or an e-mail address other than the two it allows | 544–560 |
| 15b line endings | `.gitattributes` does not start with `* text=auto eol=lf`, a binary file's type is not marked binary there, a tracked text file holds a CR, or a `.gitignore` or `.gitattributes` pattern uses syntax the check cannot read; without git it walks the files `.gitignore` keeps | 562–621 |
| 15c no runtime dependency | `package.json` declares a runtime dependency (`dependencies`, optional, peer or bundled); the site has none, and every package is a tool for the scripts | 623–633 |

Every row cites scripts/check.mjs at the lines shown. The prices behind the price check are in [[Pricing and market]]; the clients behind blocks 5 to 5c in [[Clients and projects]].

Graph: [[check.mjs]], [[Repository invariants (npm run check)]], [[RETIRED]], [[deployMissing]], [[legalErr]], [[_COMMUNITY_check.mjs Repository Gate]], wiki [[check.mjs_Repository_Gate]].

## Browser gates in detail

- **Shared harness.** `scripts/lib/serve.mjs` serves the repository root on a free port and launches Chromium; it is used by audit, sweep and vbugs (scripts/lib/serve.mjs › header). Graph: [[serve()]], [[launch()]].
- **audit.** Runs `index.html` in all six themes in three languages at 1280×900 and in two languages on a 390×844 phone, plus `scene/`, `404.html`, `hub/`, `workspacehq/`, tablets, short landscape and one run with the phone menu open (scripts/audit.mjs › header, 88–118). Tap targets apply WCAG 2.5.8's spacing exception, reveals get 1.8 s, and axe "incomplete" results are warnings, not failures (scripts/audit.mjs › header). WorkspaceHQ is exempt from the no-endless-animation rule because its loops are its design (scripts/audit.mjs › 93–96). Graph: [[Browser audit (npm run audit)]], [[axe accessibility engine]].
- **sweep.** Renders each page twice, once normally and once with all text transparent, and composites each text colour over the background sampled from the second render (scripts/sweep.mjs › header). Text inside an `aria-hidden` picture still counts; only `data-decorative` text, and pending or disabled controls, are reported as notes (scripts/sweep.mjs › header, 121, 152). An optional argument limits it to one theme (scripts/sweep.mjs › 39). Graph: [[Contrast sweep (npm run sweep)]].
- **vbugs.** Renders `index.html` at seven widths (1440 down to 360) in four theme and language pairs (scripts/vbugs.mjs › 16). An issue passes only if a prefix in `scripts/vbugs-allow.json` matches it, and each entry states its reason; there is one entry today, for the hero's decorative glow fields (scripts/vbugs.mjs › 65–72; scripts/vbugs-allow.json). Graph: [[Visual bug scan (npm run vbugs)]], [[ALLOW]].
- When two tools disagree, look: axe caught one failure the sweep missed, and the sweep caught many axe's sampling did not (BRAND.md › `npm run sweep`).
- Graph: [[Clipping-ancestor-aware layout audits]], [[_COMMUNITY_Browser Audit and OG Build]], [[_COMMUNITY_Anti-slop and Gates]].

## Cache stamps

- The CSS and JS links carry `?v=<stamp>` (netlify.toml › 19–21); `npm run bump` rewrites every stamp in every page in `PAGES` with a new one built from the current UTC time to the minute (scripts/bump.mjs › header, 13–19).
- Run it after any CSS, JS or content change and before committing; a stale stamp is how "the website didn't update" happens (scripts/bump.mjs › header).
- `check` fails while stamps differ (scripts/check.mjs › 117–122). The current stamp is `202610171206` (index.html › 170).
- `scene/` is generated with the stamp read from `index.html` (scripts/build-scene.mjs › stamp).
- Graph: [[v= cache stamps (npm run bump)]], [[bump.mjs]], [[_COMMUNITY_Conventions Enforced by Tooling]], wiki [[Conventions_Enforced_by_Tooling]].

## Habits the gates encode

- A check that is always red stops being read: `check` once showed the same false failure for weeks, until it learned to skip script-built strings and verify their real targets (BRAND.md › The gates).
- Verify the harness before fixing the site: most of the sweep's first 549 flags were measurement errors, not page errors (BRAND.md › `npm run sweep`).

## History

- The July 2026 code audit listed conventions kept by discipline rather than tooling, and manual cache stamps, as debt, and recorded both as cured by `npm run check` and `npm run bump` (audit/Technical_Debt.md › D-01, D-03): [[D-01 - Conventions enforced by discipline, not tooling]], [[D-03 - Manual cache-bust stamps]]. Today `check` and `bump` still cover both (scripts/check.mjs › 6–9; scripts/bump.mjs › header).
- The whole July audit, with what became of each finding, is mapped in [[Code audit (2026-07)]].
- The June 2026 knowledge base in `archive/2026-06-snapshot/` is history only: [[June 2026 archive]]. Dates are in [[Timeline]].

## Related

- Maps: [[Deploy]], [[Themes and tokens]], [[Site architecture]], [[Languages and RTL]], [[Project sheets]], [[Pricing and market]], [[Open owner items]], [[Captures and image tools]], [[Code audit (2026-07)]], [[Maps/Glossary|Glossary]].
- Communities: [[_COMMUNITY_check.mjs Repository Gate]], [[_COMMUNITY_CI Check Workflow]], [[_COMMUNITY_Anti-slop and Gates]], [[_COMMUNITY_Browser Audit and OG Build]], [[_COMMUNITY_Conventions Enforced by Tooling]], [[_COMMUNITY_Dev Dependencies]], [[_COMMUNITY_package.json]], [[_COMMUNITY_Legal Page Generator]], [[_COMMUNITY_Legal Data and Privacy]].
- Wiki: [[check.mjs_Repository_Gate]], [[CI_Check_Workflow]], [[Anti-slop_and_Gates]], [[Browser_Audit_and_OG_Build]], [[Conventions_Enforced_by_Tooling]], [[wiki/package.json|package.json]], [[wiki/ROOT|ROOT]], [[Legal_Page_Generator]].
