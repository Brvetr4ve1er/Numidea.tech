---
type: map
updated: 2026-10-25
sources: [package.json, README.md, BRAND.md, netlify.toml, vercel.json, .github/workflows/pages.yml, scripts/check.mjs, scripts/themes-check.mjs, scripts/validate.mjs, scripts/audit.mjs, scripts/sweep.mjs, scripts/vbugs.mjs, scripts/vbugs-allow.json, scripts/verify.mjs, scripts/bump.mjs, scripts/site.mjs, scripts/lib/serve.mjs, scripts/build-fr.mjs, scripts/build-scene.mjs, scripts/build-voices.mjs, scripts/build-legal.mjs, scripts/build-sitemap.mjs, scripts/build-og.mjs, scripts/og-capture.mjs, scripts/shots.mjs, scripts/work-capture.mjs, scripts/client-logos.mjs, scripts/verify-domains.mjs, scripts/build-kb.mjs, scripts/stage-site.mjs, scripts/legal-data.mjs, scripts/lib/i18n.mjs, scripts/build-creative.mjs, scripts/build-csp.mjs, scripts/lib/csp.mjs, scripts/keys.mjs, scripts/links.mjs, scripts/lib/stage-404.mjs, .github/workflows/check.yml, .github/workflows/monitor.yml, RELEASE.md, index.html, OWNER-CONTENT.md, audit/Technical_Debt.md, audit/Architecture.md, package-lock.json, knowledge-base/graphify/GRAPH_REPORT.md]
---

# Build and gates

The site has no framework and no runtime dependency, and the only deploy-time "build" is staging the publishable files; a few Node scripts generate pages and regions of pages, and a set of "gates" must pass before a push (README.md › This repository — the landing page; .github/workflows/pages.yml › 3–15; BRAND.md › The gates). Start with the commands table; `npm run verify` runs every gate in one go, and the block-by-block table of `scripts/check.mjs` tells you what a red line means. Publishing is in [[Deploy]]; the theme contract in [[Themes and tokens]].

## Commands

| Command | Runs | What it does | Needs |
|---|---|---|---|
| `npm run build` | `build-fr`, `build-scene`, `build-voices`, `build-legal`, `build-sitemap`, then `build-csp` last | Regenerates the French baked into `index.html`, `scene/`, the voices region, `legal/` (only when complete) and `sitemap.xml`, then the Content-Security-Policy meta of the hand-written pages | Node only |
| `npm run check` | `check.mjs`, then `themes-check.mjs` | Repository invariants and the theme contract | Node only, no dependencies |
| `npm run validate` | `validate.mjs` | html-validate on every page | `npm install` |
| `npm run audit` | `audit.mjs` | Browser audit, 76 runs: desktop LCP over 1.5 s fails, every CSP violation fails, the WorkspaceHQ embeds and the booted console, 404 two folders down, the first screen in fallback type, then a throttled phone that only reports until `AUDIT_PHONE_STRICT=1` | Playwright, Chromium, axe-core |
| `npm run sweep` | `sweep.mjs` | Contrast measured on the painted pixels | Playwright, Chromium, sharp |
| `npm run vbugs` | `vbugs.mjs` | Layout scanner with an allowlist | Playwright, Chromium |
| `npm run keys` | `keys.mjs` | Keyboard paths, focus rings, dialogs, the contact form, reduced motion, right-to-left; 39 runs | Playwright, Chromium |
| `npm run verify` | `verify.mjs` | All seven gates (check, themes, validate, audit, sweep, vbugs, keys) | All of the above |
| `npm run links` | `links.mjs` | Every external link the published site carries answers; not part of `verify` | The network |
| `npm run csp` | `build-csp.mjs` | Rewrites the CSP meta of the hand-written pages; `-- --check` only reports | Node only |
| `npm run kb` | `build-kb.mjs` | Exports the graphify graph into this vault | Node only |
| `npm run bump` | `bump.mjs` | Rewrites every `?v=` cache stamp | Node only |
| `npm run stage` | `stage-site.mjs` | Copies the deploy set into `_site/` and points `404.html`'s JavaScript-off links at the site root (`--pages`: the path of `BASE`) | Node only |
| `npm run scene` | `build-scene.mjs` | Regenerates `scene/` only | Node only |
| `npm run og` | `og-capture.mjs`, `build-og.mjs` | Share images for `hub/`, `workspacehq/` and `assets/og.jpg` | Playwright |
| `npm run shots` | `shots.mjs` | Screenshots of the live client sites into `assets/previews/` | Playwright, sharp, network |
| `npm run work:capture` | `work-capture.mjs` | Project-sheet captures into `assets/work/<slug>/` | Playwright, sharp, network |
| `npm run logos` | `client-logos.mjs` | The client logos, taken from each live site's header | Playwright, sharp, network |

Sources: package.json › scripts; README.md › Commands; scripts/verify.mjs › STEPS; scripts/keys.mjs › header; scripts/links.mjs › header; scripts/build-csp.mjs › header; scripts/stage-site.mjs › header; scripts/check.mjs › header; scripts/lib/serve.mjs › header; scripts/audit.mjs › 82; scripts/sweep.mjs › 30; scripts/shots.mjs › header; scripts/work-capture.mjs › header; scripts/client-logos.mjs › header; the `Needs` column also follows each script's own `import` lines.

- Node 22.22 or later; the dev dependencies are axe-core, html-validate, Playwright and sharp (package.json › engines, devDependencies).
- The browser gates find Chromium through `CHROMIUM_PATH`, else a pre-installed build, else Playwright's own (scripts/lib/serve.mjs › header).
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
| `PAGES` | The five entry pages, plus `legal/index.html` once it exists | `check`, `bump`, `validate`, `build-sitemap`, `build-csp`, `csp-test`, `keys` |
| `EXTRA_PAGES` | The three WorkspaceHQ embeds: checked for references, not entry pages | `check`, `build-csp`, `csp-test` |
| `DEPLOY`, `DEPLOY_SKIP` | Exactly what is published, and file names never published inside it | `stage-site`, `check`, `build-legal`, `lib/deploy-files` |
| `NOT_DEPLOYED` | Folders and files that must never be published, local tool state included | `check` |
| `LEGAL_PUBLISHED` | Whether `legal/index.html` exists; it extends `PAGES` and `DEPLOY` | `check` |

Sources: scripts/site.mjs › 1–38; the `import` line of each script, for example scripts/build-sitemap.mjs › 16 and scripts/lib/serve.mjs › 19, and the imports at the top of scripts/check.mjs and scripts/stage-site.mjs.

- `scripts/shots.mjs` works out its own root, and `scripts/work-capture.mjs` and `scripts/plates.mjs` write to paths relative to where they are run; none of the three imports `site.mjs` (their import lines).
- A new root folder must be added to `DEPLOY` or `NOT_DEPLOYED` before `check` passes (scripts/check.mjs › block 6); what that means for publishing is in [[Deploy]].
- A new theme name goes into `THEMES` here and in `app.js`, among other places, or `themes-check` fails (BRAND.md › Theme contract (replaces the Engineering alternate stylesheet)); see [[Themes and tokens]].
- In the graph the shared constant is [[ROOT_1|ROOT]], a god node with 19 edges (knowledge-base/graphify/GRAPH_REPORT.md › God Nodes); the note named plain `ROOT` is the constant inside `build-scene.mjs`. Wiki [[wiki/ROOT|ROOT]]; nodes [[site.mjs]], [[BASE]], [[THEMES]], [[PAGES_3]], [[EXTRA_PAGES]], [[DEPLOY]], [[NOT_DEPLOYED]], [[LEGAL_PUBLISHED]].

## What the build generates

| Generator | Writes | From | Kept in step by |
|---|---|---|---|
| `build-fr.mjs` | Every `data-i18n` text and attribute in `index.html`, its title, meta description, the studio's JSON-LD description and the FAQ JSON-LD | `I18N.fr` in `assets/app.js` | `check` (scripts/check.mjs › block 8e) |
| `build-scene.mjs` | `scene/index.html`, with its CSP meta | `scripts/scene-data.mjs` | `check` (scripts/check.mjs › block 7) |
| `build-voices.mjs` | The `SLOT:voices` region of `index.html`; empty while there are no voices | `scripts/voices-data.mjs` | `check` (scripts/check.mjs › block 8e) |
| `build-legal.mjs` | `legal/index.html` and the legal link regions, only when every owner field is set; otherwise nothing, and the regions stay empty | `scripts/legal-data.mjs` | `check` (scripts/check.mjs › block 8d) |
| `build-sitemap.mjs` | `sitemap.xml`, with `fr`/`en`/`ar` alternates for `index.html`, `scene/` and, once published, `legal/` | `PAGES` in `scripts/site.mjs` | `check` (scripts/check.mjs › block 6) |
| `build-csp.mjs` | The Content-Security-Policy meta of `index.html`, `404.html`, `hub/`, `workspacehq/` and its three embeds, with the sha256 of each inline script; it runs last, since every step before it may rewrite an inline script | `withCsp()` in `scripts/lib/csp.mjs` | `check` (scripts/check.mjs › block 16) |

Sources: the generators' headers (scripts/build-fr.mjs, scripts/build-scene.mjs, scripts/build-voices.mjs, scripts/build-legal.mjs, scripts/build-sitemap.mjs, scripts/build-csp.mjs › header comments).

- `build-fr`, `build-voices`, `build-legal`, `build-sitemap` and `build-csp` each take `--check`, which exits 1 when the committed file differs (same headers).
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
| audit | `scripts/audit.mjs` | Layout shift over 0.01, axe violations, horizontal overflow, reveals that never fired, tap targets under 24px, broken images, endless animations, JS errors, failed and third-party requests, any CSP violation in any frame; desktop page runs fail when LCP at load is over 1.5 s; the three WorkspaceHQ embeds and the booted console; `404.html` two folders down, here and on an emulated GitHub Pages, with JavaScript on and off; the first screen in fallback type (every theme in French and English, webfonts refused vs loaded, 360 to 1600 wide: no text block may change height); then a throttled phone (LCP ≤ 2.5 s, long tasks ≤ 300 ms, interaction ≤ 200 ms), report-only unless `AUDIT_PHONE_STRICT=1` | `verify`, the nightly CI job, every Pages deploy |
| sweep | `scripts/sweep.mjs` | Text under 4.5:1 (3:1 for large text) against the background actually painted | `verify`, the nightly CI job, every Pages deploy |
| vbugs | `scripts/vbugs.mjs` | Overlapping text, text escaping its box, clipped text, stretched images, horizontal scroll | `verify`, the nightly CI job, every Pages deploy |
| keys | `scripts/keys.mjs` | The skip link, focus rings, the phone and theme menus, the CV panel, the contact form (errors, the mail hand-off, the lead store's POST with its switch on), hub's and scene/'s dialogs, the embeds taking focus; with reduced motion, anything hidden at load, script still moving things, endless animations, playing embeds, smooth scrolling and a walking Bit in the booted console; `dir="rtl"` with `?lang=ar`; any JS error or CSP violation | `verify`, the nightly CI job, every Pages deploy |
| links | `scripts/links.mjs` | A dead owned or client link (4xx, 5xx, DNS, timeout); hosts that refuse bots are only warned, each with its reason | the nightly CI job and `monitor.yml`; not in `verify`, since it needs the network |

Sources: scripts/verify.mjs › STEPS; scripts/validate.mjs › header; scripts/audit.mjs › header, `DESKTOP_LCP`, `PHONE`; scripts/keys.mjs › header; scripts/links.mjs › header; scripts/sweep.mjs › header, 115, 149; scripts/vbugs.mjs › header; .github/workflows/check.yml › 38–111; every gate in this table runs before a Pages deploy (.github/workflows/pages.yml › 51–102), while the mirrors run only check and themes (netlify.toml › 12; vercel.json › 3) (more in [[Deploy]]).

- `npm run verify` runs the seven steps in order, does not stop at the first failure, prints a summary with each step's time, and exits non-zero if any failed (scripts/verify.mjs › header, STEPS).
- In CI the browser gates run in two places, each after `npx playwright install --with-deps chromium`. One is the Check workflow's `nightly` job, every night and from Actions, Check, Run workflow (the `browser` input defaults to true), through `npm run verify`. The other is the `gates` job before every Pages deploy, one step per gate. In both, every gate runs even after one failed, so one run lists every failure (.github/workflows/check.yml › 13–16, 22–32, 80–105; .github/workflows/pages.yml › 6–9, 83–102).
- CI installs with `npm ci` and `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` before `validate`, on Node 22 (.github/workflows/check.yml › 46–57).
- The `check` job, on every push and pull request, also runs `npm run build` and fails when the build changes or adds a file, then `npm audit --omit=dev` (.github/workflows/check.yml › 61–78). The `nightly` job also runs `npm run links` and the full `npm audit` (.github/workflows/check.yml › 106–111). Which command proves which release step is in RELEASE.md › 2.
- The rule is "seven commands, all green before a push"; `npm run csp` and `npm run links` are listed beside them as commands that are not gates (BRAND.md › The gates).
- Graph: [[The gates (pre-push commands)]], [[Verify gates (npm run verify)]], [[STEPS]], [[Check workflow (CI)]], [[Browser gates step (on demand)]], [[npm ci without browser download]].

## check.mjs, block by block

The header lists every block under the label its body comment carries, and asks for citations by label, never by line, because blocks merged from other work move the lines (scripts/check.mjs › header). This map cites it that way: `scripts/check.mjs › block 8b`.

| Block | Fails when |
|---|---|
| 1 + 2 i18n | A dictionary key in `app.js` does not appear a multiple of 3 times, or a `data-i18n*` attribute names no key |
| 3 assets | A local `src`/`href` on any page or WorkspaceHQ embed is missing, including asset paths in inline scripts and preloaded font names |
| 3b parallax | A `data-parallax` depth does not parse to a non-zero number |
| 4 stamps | The `?v=` stamps differ between pages (fix: `npm run bump`) |
| 5 client links | A client's plate, card and browser bar disagree; `shots.mjs` covers other clients; the sheets use a URL the page does not link; `hub/` lists a client site |
| 5b client logos | The logo strip is not exactly the delivered clients, each with its own file, alt, intrinsic size, mask and card link |
| 5c client benefits | A sheet lacks its context or 3 to 5 benefits in three languages with a live page each; a work card lacks its benefit line; any benefit reads as a figure or a result |
| 6 deploy coverage | A `DEPLOY` path is missing; a root folder is neither deployed nor excluded; a deployed page links to an unpublished file; the sitemap is stale or lists unpublished URLs; staging `404.html` (`scripts/lib/stage-404.mjs`) finds nothing to rewrite, leaves a relative link or changes a script; a page does not name exactly one canonical (none on `404.html`) |
| 7 generated pages | `scene/index.html` differs from its generator; an inline dictionary misses a key in `fr`, `en` or `ar` |
| 8 anchors | A `#fragment` link lands on no id; an `aria-labelledby`/`describedby`/`controls` or `label for` names no id |
| 8b Supabase switch | The lead store is switched on without the published legal page, its region and a rewritten form note |
| 8c prices | Tier and maintenance figures differ from `PRICE_MODEL`/`RETAINER`; a € or $ amount is typed into the studio's own prices; the estimator gives a bad quote on any size, option set or pace |
| 8d legal gating | Anything links to `legal/` before it is published, or the published page is incomplete or stale |
| 8e baked French and voices | The baked French (text, attributes, title, description, the studio's and the FAQ's structured data) or the voices region differs from its source |
| 8f digits and typography | Arabic-Indic digits appear; French copy has a breakable space before `? ! ; : »`, after `«`, or between a number and `%` or `h` |
| 8g contact and JSON-LD | More than one contact address across the pages; JSON-LD does not parse, or its phone or e-mail disagrees with the page |
| 8h retired claims | Copy the owner retired as unsupported comes back (`RETIRED`) |
| 15 knowledge base | Anything under `knowledge-base/` holds a machine path, a private-vault marker, or an e-mail address other than the two it allows |
| 15b line endings | `.gitattributes` does not start with `* text=auto eol=lf`, a binary file's type is not marked binary there, a tracked text file holds a CR, or a `.gitignore` or `.gitattributes` pattern uses syntax the check cannot read; without git it walks the files `.gitignore` keeps |
| 15c no runtime dependency | `package.json` declares a runtime dependency (`dependencies`, optional, peer or bundled); the site has none, and every package is a tool for the scripts |
| 16 content security policy | A page's meta is not `withCsp(page)` (`scripts/lib/csp.mjs`); an inline script is unhashed; an inline event handler or `javascript:` URL appears; anything the policy governs comes before the meta; a policy falls below the floor in `scripts/lib/csp-floor.mjs` (`'unsafe-eval'` is allowed on the WorkspaceHQ embeds only); `netlify.toml` and `vercel.json` send different headers, or lack `frame-ancestors` or an HSTS of at least a year |
| 17 asset budgets | A published file is over its folder's byte ceiling, an `og.jpg` is over 300 kB, or the whole published set is over its total |
| 18 SEO and structured data | A public page lacks its title, a 50 to 160 character description in each of its languages, its og/twitter tags, an og:image size equal to the file, or exactly one h1; `404.html` and the embeds are not `noindex`; `robots.txt` disallows a sitemap URL or lacks its `Sitemap:` line; the head hreflang alternates differ from the sitemap's; the ProfessionalService or WebSite JSON-LD lacks a required property; any JSON-LD site URL (`url`, `image`, `logo`, a BreadcrumbList item…) is not under `BASE` |

Every row cites scripts/check.mjs › header and the block with that label. The prices behind the price check are in [[Pricing and market]]; the clients behind blocks 5 to 5c in [[Clients and projects]].

Graph: [[check.mjs]], [[Repository invariants (npm run check)]], [[RETIRED]], [[deployMissing]], [[legalErr]], [[_COMMUNITY_check.mjs Repository Gate]], wiki [[check.mjs_Repository_Gate]].

## Browser gates in detail

- **Shared harness.** `scripts/lib/serve.mjs` serves the repository root on a free port and launches Chromium; it is used by audit, sweep, vbugs and keys. Its `compress` option gzips text as the hosts do, and `fallback404` answers a missing file with `404.html` and status 404, as they do; audit uses both (scripts/lib/serve.mjs › header; scripts/audit.mjs › `srv`). Graph: [[serve()]], [[launch()]].
- **audit.** Runs `index.html` in all six themes in three languages at 1280×900 and in two languages on a 390×844 phone, plus `scene/`, `404.html`, `hub/`, `workspacehq/` and its embeds, tablets, short landscape, one run with the phone menu open and two with the CV panel open; then `404.html` two folders down and the throttled phone (scripts/audit.mjs › header and the run list at its end). Tap targets apply WCAG 2.5.8's spacing exception, reveals get 1.8 s, and axe "incomplete" results are warnings, not failures (scripts/audit.mjs › header). WorkspaceHQ is exempt from the no-endless-animation rule because its loops are its design (scripts/audit.mjs › the comment above the `workspacehq` run). A timing failure counts only when a second measurement fails too (scripts/audit.mjs › header). Graph: [[Browser audit (npm run audit)]], [[axe accessibility engine]].
- **keys.** Every page in `PAGES` needs an entry in its `SPEC`, so a new page is classified rather than skipped; it drives the keyboard at 1280×900 and 390×844, in French and Arabic where the page has them, then repeats each page with reduced motion emulated and the site's own handling only, then checks `?lang=ar` on every page (scripts/keys.mjs › header, `SPEC`).
- **sweep.** Renders each page twice, once normally and once with all text transparent, and composites each text colour over the background sampled from the second render (scripts/sweep.mjs › header). Text inside an `aria-hidden` picture still counts; only `data-decorative` text, and pending or disabled controls, are reported as notes (scripts/sweep.mjs › header, 121, 152). An optional argument limits it to one theme (scripts/sweep.mjs › 39). Graph: [[Contrast sweep (npm run sweep)]].
- **vbugs.** Renders `index.html` at seven widths (1440 down to 360) in four theme and language pairs (scripts/vbugs.mjs › 16). An issue passes only if a prefix in `scripts/vbugs-allow.json` matches it, and each entry states its reason; there is one entry today, for the hero's decorative glow fields (scripts/vbugs.mjs › 65–72; scripts/vbugs-allow.json). Graph: [[Visual bug scan (npm run vbugs)]], [[ALLOW]].
- When two tools disagree, look: axe caught one failure the sweep missed, and the sweep caught many axe's sampling did not (BRAND.md › `npm run sweep`).
- Graph: [[Clipping-ancestor-aware layout audits]], [[_COMMUNITY_Browser Audit and OG Build]], [[_COMMUNITY_Anti-slop and Gates]].

## Cache stamps

- The CSS and JS links carry `?v=<stamp>` (netlify.toml › 20–22); `npm run bump` rewrites every stamp in every page in `PAGES` with a new one built from the current UTC time to the minute (scripts/bump.mjs › header, 13–19).
- Run it after any CSS, JS or content change and before committing; a stale stamp is how "the website didn't update" happens (scripts/bump.mjs › header).
- `check` fails while stamps differ (scripts/check.mjs › block 4). The current stamp is `202610171206` (index.html › 193).
- `bump` re-applies each page's CSP meta after stamping, since a stamp inside an inline script changes that script's hash (scripts/bump.mjs › header).
- `scene/` is generated with the stamp read from `index.html` (scripts/build-scene.mjs › stamp).
- Graph: [[v= cache stamps (npm run bump)]], [[bump.mjs]], [[_COMMUNITY_Conventions Enforced by Tooling]], wiki [[Conventions_Enforced_by_Tooling]].

## Habits the gates encode

- A check that is always red stops being read: `check` once showed the same false failure for weeks, until it learned to skip script-built strings and verify their real targets (BRAND.md › The gates).
- Verify the harness before fixing the site: most of the sweep's first 549 flags were measurement errors, not page errors (BRAND.md › `npm run sweep`).

## History

- The July 2026 code audit listed conventions kept by discipline rather than tooling, and manual cache stamps, as debt, and recorded both as cured by `npm run check` and `npm run bump` (audit/Technical_Debt.md › D-01, D-03): [[D-01 - Conventions enforced by discipline, not tooling]], [[D-03 - Manual cache-bust stamps]]. Today `check` and `bump` still cover both (scripts/check.mjs › header, blocks 1 to 4; scripts/bump.mjs › header).
- The whole July audit, with what became of each finding, is mapped in [[Code audit (2026-07)]].
- The June 2026 knowledge base in `archive/2026-06-snapshot/` is history only: [[June 2026 archive]]. Dates are in [[Timeline]].

## Related

- Maps: [[Deploy]], [[Themes and tokens]], [[Site architecture]], [[Languages and RTL]], [[Project sheets]], [[Pricing and market]], [[Open owner items]], [[Captures and image tools]], [[Code audit (2026-07)]], [[Maps/Glossary|Glossary]].
- Communities: [[_COMMUNITY_check.mjs Repository Gate]], [[_COMMUNITY_CI Check Workflow]], [[_COMMUNITY_Anti-slop and Gates]], [[_COMMUNITY_Browser Audit and OG Build]], [[_COMMUNITY_Conventions Enforced by Tooling]], [[_COMMUNITY_Dev Dependencies]], [[_COMMUNITY_package.json]], [[_COMMUNITY_Legal Page Generator]], [[_COMMUNITY_Legal Data and Privacy]].
- Wiki: [[check.mjs_Repository_Gate]], [[CI_Check_Workflow]], [[Anti-slop_and_Gates]], [[Browser_Audit_and_OG_Build]], [[Conventions_Enforced_by_Tooling]], [[wiki/package.json|package.json]], [[wiki/ROOT|ROOT]], [[Legal_Page_Generator]].
