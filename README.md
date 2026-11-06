# Numidea Labs

**Rooted in Numidia, built on ideas.**

A development studio out of **Bordj Bou Arréridj, Algeria** that designs, builds,
ships and maintains digital products — and answers when they break. No middlemen
between you and the people typing the code.

> We build the software your business has been *waiting* for.

---

## What we build

| Offer | The promise |
| --- | --- |
| **Sites & applications** | Bespoke websites and web apps — fast, ranked, conversion-built, front-end to cloud. |
| **Automation & data** | Scrapers, lead pipelines, market-intelligence systems, internal tools, integrations. |
| **Brand & design systems** | Logos, visual identity, design systems, motion — the full kit. |
| **Strategy & consulting** | Market audits, funnel analysis, competitive intelligence, growth roadmaps. |
| **L'Aperçu / The Preview** *(signature)* | Before any payment, the homepage of your new site with your own content, in 5 working days, shown on a 30-minute video call. Free, no obligation; registered businesses; at most 4 a month. |

## How we work

1. **No middleman.** One team scopes, builds and ships your project.
2. **One team owns the whole chain.** Design → code → deploy.
3. **We answer when it breaks.** Deadlines kept, a reply the next working day.

---

## This repository — the landing page

A **static site**: hand-written HTML, CSS and vanilla JavaScript, no framework and
no runtime dependency. Open `index.html` and it runs. A few pages and files are
**generated** by small Node scripts (below), and every deploy publishes only the
files listed in `scripts/site.mjs`.

```
index.html            # the landing page in French: the template of the three
en/, ar/              # the English and Arabic pages, written from index.html by
                      #   scripts/build-lang.mjs (never edited by hand)
tarifs/               # the price guide (FR), with en/tarifs/ and ar/tarifs/,
                      #   written by scripts/build-tarifs.mjs from index.html's
                      #   tiers and estimator; tarifs/style.css is its own sheet
404.html              # not-found page (host-aware paths, three languages)
assets/
  themes.css          # the six themes: one block of the 44 contract tokens each
  styles.css          # layout and components; reads theme tokens only
  fonts.css           # the self-hosted faces, one rule per file and weight range
  app.js              # nav, menu dialog, prices in DA/€/$, estimator, lead
                      #   source, contact form, WhatsApp links, the deck
  i18n/{fr,en,ar}.js  # the dictionaries, one language per file: edit these
  page-i18n.js        # language switch for the pages that still switch in place (scene/, legal/)
  fonts/              # self-hosted faces (no third-party requests)
  previews/*.webp     # screenshots of the live client sites, 1280 wide and -720 (hero plate, cards)
  clients/            # the four delivered clients' own logos (npm run logos)
  work/<slug>/*.webp  # project-sheet captures, each with its phone-size twin (npm run work:capture)
  og.jpg, og-en.jpg, og-ar.jpg  # link-preview cards, one per language, rendered by scripts/build-og.mjs
  apple-touch-icon.png  # 180 px home-screen icon, the favicon's N in brass on the page ground (linked from the pages)
scene/                # project sheets, generated from scripts/scene-data.mjs (scene/og.jpg: its card)
hub/                  # the founder's own page (English): his character bible, a live drawn rig of him and Kūro, the black cat, who he is, his faces, poses and lines, a day on Studio, his links (own CSS/JS, one paper palette)
  art/                #   the rig's frames and the sections' drawings, WebP (npm run hub:rig)
  fonts/              #   its own faces: Archivo and a Noto Sans JP subset (OFL.txt), Permanent Marker (LICENSE-permanent-marker.txt)
workspacehq/          # WorkspaceHQ v3, the studio's own product page
sitemap.xml           # generated with hreflang alternates
scripts/              # generators, gates and tools (never deployed)
knowledge-base/       # Obsidian vault: knowledge graph + maps (never deployed; see below)
audit/                # 2026-07 code audit, dated snapshot (never deployed; superseded by IMPROVEMENTS.md)
OWNER-CONTENT.md      # everything only the owner can supply, and its status
RELEASE.md            # release checklist, rollback, monitoring, owner-only settings, the outage fallback
IMPROVEMENTS.md       # the backlog, the owner's decisions, the metrics history and the log
NOTICE.md             # what LICENSE (CC0) covers and what it does not
.htmlvalidate.json    # npm run validate's rules for the pages (the embeds: scripts/validate-embed.json)
.nvmrc                # 22.22, the Node the gates run on
.gitattributes        # LF line endings in every checkout; binary types marked
.github/
  dependabot.yml      # weekly update pull requests: npm dev dependencies, pinned actions
  workflows/
    check.yml         # static gates on every push and pull request; browser gates nightly
    pages.yml         # every gate, then stages and publishes to GitHub Pages
    monitor.yml       # the live site every six hours; a failure opens one issue
```

[LICENSE](LICENSE) is CC0 1.0; [NOTICE.md](NOTICE.md) says what it covers and what it does not (the fonts, React, the clients' logos and captures, the owner's illustrations, the third-party skills).

### Deploy

- **GitHub Pages is canonical:** <https://brvetr4ve1er.github.io/Numidea.tech/>.
  Every push to the working branch runs the gates in `pages.yml` (below); only
  when every one is green does `scripts/stage-site.mjs` copy `DEPLOY` from
  `scripts/site.mjs` into `_site/`, which is published. A red gate leaves the
  live site as it was.
- **Netlify and Vercel are mirrors.** `netlify.toml` and `vercel.json` run
  `check` and `themes-check`, then the same staging, and publish `_site/`.
  They do not run the browser gates.
- **Never published:** `scripts/`, `knowledge-base/`, `audit/`, `legal-preview/`
  and anything in `NOT_DEPLOYED`. `check.mjs` fails if a root folder is
  unclassified or a deployed page links to an unpublished file.
- The marketing campaign kit is kept **outside this public repository**.
  `scripts/build-creative.mjs` renders the ad images from it (`CAMPAIGN_DIR`,
  default `./campaign`, git-ignored).
- **Releasing, rolling back, monitoring** and the repository settings only the
  owner can change (branch protection, notifications, domain): see
  [RELEASE.md](RELEASE.md).

### Commands

| Command | What it does |
| --- | --- |
| `npm run build` | Regenerates, in this order: scene/, the client-voices region, the legal page (only when complete), the English and Arabic home pages from index.html and the dictionaries (`build-lang`, after `build-legal` since that may rewrite index.html; it also checks the French baked into index.html against `assets/i18n/fr.js`), the price guide's three pages (`build-tarifs`), sitemap.xml and, last, the CSP meta of every page (`npm run csp`). CI fails when it leaves a change |
| `npm run check` | Repo invariants: the three dictionaries hold the same keys and every `data-i18n` reference on the home and guide pages resolves in each, assets (every `src`, `href` and `srcset` candidate, each `NNNw` the file's width), cache stamps, client links, deploy coverage, generated pages in sync (scene/, en/, ar/, the guide's three), anchors, retired claims, prices = PRICE_MODEL on the home and on the guide, the estimator tested on every size, option set and pace, baked text = each page's dictionary, French typography (no breakable space before ? ! ; : »), one canonical per page (a page whose head script reads `?lang=`, index.html, scene/ and legal/, sets it there; a page that reads none, en/, ar/, the guide, hub/, workspacehq/, names itself in the markup; both at once or neither fails), one contact address, Western digits in Arabic, legal gating, the Supabase switch, LF line endings in every tracked text file (`.gitattributes` pins LF for every checkout, Windows included; the generator comparisons ignore line endings), no runtime dependency in `package.json` (15c), the Content-Security-Policy meta on every page as `scripts/lib/csp.mjs` computes it (block 16), every published file under its folder's or its own byte ceiling, the share cards ≤ 300 kB, the set under its total, no two published files alike (block 17), SEO and structured data: title, description, og/twitter tags, one h1, robots.txt, hreflang = sitemap, JSON-LD (block 18); plus `themes-check` |
| `npm run validate` | html-validate on every page (`.htmlvalidate.json`: the recommended rules, nothing relaxed) and on the three WorkspaceHQ embed templates (`scripts/validate-embed.json`, which allows only what their runtime's `{{ }}` bindings are; the export's own accessibility gaps print as warnings and do not fail) |
| `npm run audit` | Browser audit (90 runs; the hub in its one palette, desktop and phone, since 2026-11-06): axe, layout shift, LCP (desktop ≤ 1.5 s), overflow, tap targets, Content-Security-Policy violations, the three WorkspaceHQ embeds and the booted console, on each language's own page (index.html, en/, ar/, the guide's three), six themes and five viewport sizes; 404.html two folders down, here and on an emulated GitHub Pages, with JavaScript on and off; the first screen in fallback type (each theme in French and English with the webfonts refused and loaded, 360 to 1600 wide: no text block may change height when a face lands); the Arabic font files a page in another language fetched (a French or English page that fetches one fails); then a throttled phone measured against LCP ≤ 2.5 s, long tasks ≤ 300 ms and slowest interaction ≤ 200 ms. The site does not meet those phone targets yet, so they are reported as warnings; `AUDIT_PHONE_STRICT=1` makes them fail (see RELEASE.md, phone speed). `AUDIT_BASE=<url>` audits a deployed copy instead |
| `npm run sweep` | Contrast sweep over the rendered pixels, every language page of the home and the guide in the six themes, hub/, scene/, 404 and workspacehq/, then other sizes and states: scene/ (Arcanum in French and Arabic, desktop and phone; Daylight and Noir in French), 404 in other themes, hub/ (one paper palette since 2026-11-06) on a 390 px phone. Text in the phone bar is measured against a viewport capture with the bar held in its state |
| `npm run vbugs` | Visual bug scan of the home and the guide in each language (7 widths × 4 theme/language pairs) and hub/ (1440, 1024, 768, 390): overlapping text, text escaping its card or clipped, stretched images, any sideways scroll (`scrollWidth` = `clientWidth`, to the pixel); since 2026-11-06 visible text under 12 px (13 px in Arabic script; TINY) and, at 390 and 360, a link, button or summary under 44×44 (SMALLTAP; links inside a sentence exempt). Allowlist with reasons in `scripts/vbugs-allow.json` |
| `npm run keys` | Keyboard, reduced-motion and direction gate (69 runs), on each language's own page, on desktop and a phone: skip link, focus rings, the phone menu (focus kept inside, Escape), theme menu, CV panel, the folded estimator's scope handed to the message, the guide's open estimator handing its scope to the home page's form across the navigation, the contact form (errors, the mail hand-off and success panel, the lead store's POST with its switch on), scene/'s capture viewer, the hub's live rig (Tab from Yasser to Kūro, then every act button with its ring; Enter and Space make him say a line in `#rigSaid`, Kūro react, Smirk and Release press and let go), every hub link and button on top for the pointer, nothing moving under reduced motion (no smooth scrolling; WorkspaceHQ's booted console holds Bit still), `dir="rtl"` on the Arabic pages and with `?lang=ar` on the pages that still switch (`/?lang=ar` must land on `/ar/`) (`npm run keys -- hub` for one page) |
| `npm run links` | Every external link on the pages, in `scripts/scene-data.mjs` and hub/, fetched with a timeout and two retries: a dead owned or client link fails; hosts that refuse bots are only warned, with the reason. Needs the network |
| `npm run verify` | check, themes, validate, audit, sweep, vbugs, keys and stage-check (`scripts/stage-check.mjs`: the staged, comment-stripped copies parse and compile as their sources do) in one run (it does not stop at the first failure); push only when it is green |
| `npm run metrics` | Not a gate: measures the home page and the price guide in each language, on a phone and a desktop, block by block (height in screens, visible words and controls, image bytes), the page totals of every other page, and how far a buyer scrolls before a price, a client, the founder, a way to write first appear; prints the row IMPROVEMENTS.md's metrics history takes (`METRICS_BASE=<url>` for a deployed copy) |
| `npm run csp` | Rewrites the Content-Security-Policy meta on every page (index, en/, ar/, the guide's three, 404, hub, workspacehq and its three embeds) with the sha256 of each inline script (`scripts/build-csp.mjs`; `npm run csp -- --check` only reports) |
| `npm run bump` | Refresh the `?v=` cache stamps after a CSS/JS change; it re-applies the CSP meta too, since a stamp inside an inline script changes that script's hash |
| `npm run stage` | Copy the deploy set into `_site/`, with `404.html`'s JavaScript-off links from the site root (`/`; `node scripts/stage-site.mjs --pages` uses the path of `BASE`, as `pages.yml` does), then strip the comments from every staged stylesheet and script (36 files, 1,021 → 848 kB on 2026-10-31; licence headers kept; the repository keeps its comments, pages are copied as they are) |
| `npm run scene` | Regenerate scene/ only |
| `npm run og` | Re-render the share images, all drawn from the tokens and faces by `scripts/build-og.mjs` (no screenshot is taken): the home's three cards (assets/og.jpg, og-en.jpg, og-ar.jpg) and the cards of scene/, hub/ and workspacehq/ (`scene/og.jpg`, `hub/og.jpg`, `workspacehq/og.jpg`; since 2026-11-06 the hub's is the character bible's cover, and `npm run og hub` rewrites it byte for byte); `node scripts/build-og.mjs ar` renders one (`fr`, `en`, `ar`, `scene`, `hub`, `workspacehq`). The wordmark on the cards and in the pages is the drawn one in `scripts/lib/wordmark.mjs`. The encoder gives a slightly different JPEG each run, so commit a card only when it changed |
| `npm run hub:rig` | Cut `hub/art` from the owner's character-bible masters (`scripts/build-hub-rig.mjs`, `HUB_BIBLE_DIR` naming the private folder): the live rig's 13 Yasser frames (501×565) and 7 Kūro frames (360×294), the twelve faces, the poses, the six head-to-toe pairs, Kūro's ten cards and the four silhouettes, WebP, nothing upscaled. Fails on a rig frame over 60 kB, a rig set over 1.2 MB, any other file over 300 kB, a missing master or a frame not the rig's size; prints each file's size, which the page's `width`/`height` must equal (check block 17b). It rewrites the committed files byte for byte. Needs the masters, so it is not part of `npm run build`: the committed images are its output |
| `npm run hub:art` | The export of the hub of 2026-10-28 (`hub/loops`, the diary, the Behance covers; `scripts/hub-art-data.mjs`), dead since the character bible replaced that page; kept until it is retired (IMPROVEMENTS F50), and check block 17b still reads its `MOTION_MS` |
| `npm run shots` / `work:capture` | Re-capture the client-site screenshots, each in two sizes (previews 1280 and 720 wide; sheet captures 1440 and 720, phones 780 and 416) for the pages' `srcset` |
| `npm run logos` | Re-take the four client logos from their live sites' headers (checks each is still the header logo) |
| `npm run kb` | Export the graphify knowledge graph into the `knowledge-base/` vault (`-- --code` refreshes the code graph first) |

Node 22.22 or later in the 22 line, or 24.8 or later (`engines` in
`package.json`; `.nvmrc` says 22.22: html-validate 11 refuses Node 24.0 to
24.7). `validate` and the browser gates need `npm install` (Playwright,
axe-core, html-validate, sharp). The browser gates and scripts find Chromium
through `CHROMIUM_PATH`, else the newest build under `/opt/pw-browsers/`,
else Playwright's own (`scripts/lib/serve.mjs`).

### CI

GitHub Actions, in `.github/workflows/`:

| Workflow | When | What |
| --- | --- | --- |
| `check.yml`, job `check` | every push to any branch, every pull request | `check` and `themes-check`, `npm ci`, `validate`, `npm run build` then `git diff --exit-code` (and no new untracked file), `npm audit --omit=dev` (runtime dependencies only; there are none, and check block 15c fails if one is declared, so this audit only starts to count the day one is allowed). About a minute, no browser |
| `check.yml`, job `nightly` | 03:17 UTC every night; Actions → Check → Run workflow | installs Chromium, then `npm run verify` (every gate, the browser ones and `keys` included), `links` and the full `npm audit` (dev dependencies included) |
| `pages.yml` | every push to the working branch that changes something other than `**.md`, `knowledge-base/**` or `audit/**` (`paths-ignore`: a documentation push deploys nothing; `check.yml` still runs on it); on demand | job `gates`: the static gates above except `npm audit --omit=dev` (check block 15c, which it does run, keeps runtime dependencies at none), then audit, sweep, vbugs, keys and stage-check on Chromium (about twelve minutes). Job `deploy`, only when `gates` passed: stages `_site/` (comments stripped from its stylesheets and scripts) and publishes it to Pages. One deployment at a time |
| `monitor.yml` | every six hours (00:41, 06:41, 12:41, 18:41 UTC); on demand | the live site: every page and stamped asset answers, with the branch's `?v=` stamp; sitemap, robots.txt, og.jpg; the last Pages run succeeded (so a deploy refused by its gates is reported even when the stamp did not change); `npm run links`; Lighthouse on the live index (fr and ar, mobile and desktop, median of three: CLS ≤ 0.1; desktop LCP ≤ 2.5 s and TBT ≤ 200 ms; mobile, still short of that target, held to regression ceilings of 6.5 s and 350 ms, RELEASE.md §5). A failure opens or updates one issue, "Live monitor failed"; the first green run closes it |

- Every gate runs even after an earlier one failed, so one run lists
  everything that is wrong.
- Every action is pinned to a commit SHA, its version in a comment.
  `.github/dependabot.yml` proposes the updates, on Mondays: npm dev
  dependencies (minor and patch in one pull request, except Playwright,
  which brings a new Chromium and so comes in its own) and the actions. A
  release must be seven days old before it is proposed.
- The workflows hold read-only permissions, except the Pages deploy job
  (`pages`, `id-token`) and the monitor's issue job (`issues`).
- [RELEASE.md](RELEASE.md) maps each gate to the release checklist, says how
  to roll back, and lists the settings only the owner can turn on, among
  them branch protection that requires `check`.

### Knowledge base

`knowledge-base/` is an Obsidian vault (Open folder as vault). `Home.md` and
`Maps/` are written by hand, every fact citing its source file; `graph/`,
`wiki/` and `graphify/` are generated by [graphify](https://pypi.org/project/graphifyy/)
over this repository (code by tree-sitter, documents by semantic extraction;
`.graphifyignore` says what it reads) and exported by `npm run kb`;
`archive/` is the June 2026 snapshot. Ask the graph from a terminal with
`graphify query "…" --graph knowledge-base/graphify/graph.json`.
The vault is public with the repository but never deployed; `check.mjs`
refuses private material, machine paths and other e-mail addresses in it.

### What only the owner can supply

See [OWNER-CONTENT.md](OWNER-CONTENT.md). The page leaves room for these and
renders them only once they exist: the legal notice and privacy page, client
quotes (with consent), a founder photo, team photos.

### Run it locally

```bash
python3 -m http.server 8000      # any static server works
```

Then open <http://localhost:8000>. Useful links: `/en/`, `/ar/`, `/tarifs/`
(`?lang=en` and `?lang=ar` on the home redirect there; scene/ still reads
them), `?cur=eur`, `?cur=usd`.

### Design system — see [BRAND.md](BRAND.md)

**Arcanum** is the identity: arcane-blue ground, brass flourish, engraved Cinzel
display, electric teal as rationed neon. Six themes ship in the switcher
(Arcanum, Noir, Daylight, Mono, Alt-neon, Engineering). Each is one block of
the same 44 tokens in `assets/themes.css`; `themes-check` fails if a theme
misses a token, breaks a contrast pair, or if `styles.css` special-cases a theme.

### Features

- **Trilingual** — French (default), English and Arabic with a mirrored RTL layout
  (logical CSS properties, Western digits, forward arrows that follow the
  reading direction). The home page and the price guide are one static page
  per language (`/`, `/en/`, `/ar/`; `/tarifs/`, `/en/tarifs/`, `/ar/tarifs/`),
  each with its own head, share card and canonical, so a shared link unfurls
  in its language; the language switch is three links, and a stored choice
  sends `/` to that language's page before paint. The project sheets still
  switch in place with `?lang=`.
- **Prices in DA, € or $** — one price source (`PRICE_MODEL` in app.js), converted
  for display at the Bank of Algeria official rate; € shown HT with the French
  reverse-charge note.
- **Lead source without tracking** — a `?ref=` code, `utm_*` and the presence of a
  Meta/Google click id ride in the email (and the ref code in the WhatsApp text)
  the visitor sends; links between the site's pages carry them in the URL
  (`assets/carry.js`, on every page). Nothing is stored, no cookies, no analytics.
- **Accessible** — skip link, visible focus, a modal menu that keeps focus, a
  pause control on the rotating hero, `prefers-reduced-motion` honoured.

---

## Project previews

Each project card shows a committed screenshot of the live site
(`assets/previews/<slug>.webp`, 1280 wide, and `<slug>-720.webp`, the phone's
`srcset` candidate). To refresh them after a site changes:

```bash
npm install
npm run shots                     # capture all live URLs
npm run shots -- almaflowclim     # or a single project
```

Live URLs and their `client:` slugs are in `scripts/shots.mjs`; `check.mjs`
keeps them in step with the links on the page.

---

## Contact

**hamissemohamedyasser@gmail.com** · WhatsApp +213 672 41 25 78 (messages only) · Bordj Bou Arréridj, DZ
· a reply the next working day (Sunday to Thursday, 9h–18h), in French, English or Arabic.

---

*Built in Bordj Bou Arréridj, with black coffee and JavaScript.*
