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
3. **We answer when it breaks.** Deadlines kept, replies within 24 working hours.

---

## This repository — the landing page

A **static site**: hand-written HTML, CSS and vanilla JavaScript, no framework and
no runtime dependency. Open `index.html` and it runs. A few pages and files are
**generated** by small Node scripts (below), and every deploy publishes only the
files listed in `scripts/site.mjs`.

```
index.html            # the landing page (French baked in; EN/AR swapped by app.js)
404.html              # not-found page (host-aware paths, three languages)
assets/
  themes.css          # the six themes: one block of the 47 contract tokens each
  styles.css          # layout and components; reads theme tokens only
  app.js              # i18n (fr/en/ar), nav, menu dialog, prices in DA/€/$,
                      #   estimator, lead source, contact form, WhatsApp links
  page-i18n.js        # language switch for the generated pages
  fonts/              # self-hosted faces (no third-party requests)
  previews/*.webp     # screenshots of the live client sites (hero plate, cards)
  clients/            # the four delivered clients' own logos (npm run logos)
  work/<slug>/*.webp  # project-sheet captures (npm run work:capture)
  og.jpg              # link-preview card (French), rendered by scripts/build-og.mjs
scene/                # project sheets, generated from scripts/scene-data.mjs
hub/                  # VOIDSPLUNKER.std — the founder's personal page (own CSS/JS)
workspacehq/          # WorkspaceHQ v3, the studio's own product page
sitemap.xml           # generated with hreflang alternates
scripts/              # generators, gates and tools (never deployed)
knowledge-base/       # Obsidian vault: knowledge graph + maps (never deployed; see below)
audit/                # 2026-07 code audit, dated snapshot (never deployed)
OWNER-CONTENT.md      # everything only the owner can supply, and its status
RELEASE.md            # release checklist, rollback, monitoring, owner-only settings
.gitattributes        # LF line endings in every checkout; binary types marked
.github/
  dependabot.yml      # weekly update pull requests: npm dev dependencies, pinned actions
  workflows/
    check.yml         # static gates on every push and pull request; browser gates nightly
    pages.yml         # every gate, then stages and publishes to GitHub Pages
    monitor.yml       # the live site every six hours; a failure opens one issue
```

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
| `npm run build` | Regenerates the French baked into index.html (from `I18N.fr`), scene/, the client-voices region, the legal page (only when complete) and sitemap.xml; last, the CSP meta of the hand-written pages (`npm run csp`). CI fails when it leaves a change |
| `npm run check` | Repo invariants: i18n ×3, assets, cache stamps, client links, deploy coverage, generated pages in sync, anchors, retired claims, prices = PRICE_MODEL, the estimator tested on every size, option set and pace, baked French = `I18N.fr`, French typography (no breakable space before ? ! ; : »), one canonical per page (language versions set theirs in the head script), one contact address, Western digits in Arabic, legal gating, the Supabase switch, LF line endings in every tracked text file (`.gitattributes` pins LF for every checkout, Windows included; the generator comparisons ignore line endings), the Content-Security-Policy meta on every page as `scripts/lib/csp.mjs` computes it (block 16), SEO and structured data: title, description, og/twitter tags, one h1, robots.txt, hreflang = sitemap, JSON-LD (block 18); plus `themes-check` |
| `npm run validate` | html-validate on every page |
| `npm run audit` | Browser audit (~60 runs): axe, layout shift, LCP (desktop ≤ 1.5 s), overflow, tap targets, Content-Security-Policy violations, the three WorkspaceHQ embeds and the booted console, in three languages, six themes and five viewport sizes; then a throttled phone (LCP ≤ 2.5 s, long tasks ≤ 300 ms, slowest interaction ≤ 200 ms). `AUDIT_BASE=<url>` audits a deployed copy instead |
| `npm run sweep` | Contrast sweep over the rendered pixels |
| `npm run vbugs` | Visual bug scan (allowlist with reasons in `scripts/vbugs-allow.json`) |
| `npm run keys` | Keyboard, reduced-motion and direction gate, in French and Arabic, on desktop and a phone: skip link, focus rings, the phone menu (focus kept inside, Escape), theme menu, CV panel, contact-form errors, the hub and scene dialogs, nothing animating under reduced motion, `dir="rtl"` with `?lang=ar` (`npm run keys -- hub` for one page) |
| `npm run links` | Every external link on the pages, in `scripts/scene-data.mjs` and hub/, fetched with a timeout and two retries: a dead owned or client link fails; hosts that refuse bots are only warned, with the reason. Needs the network |
| `npm run verify` | check, themes, validate, audit, sweep, vbugs and keys in one run (it does not stop at the first failure); push only when it is green |
| `npm run csp` | Rewrites the Content-Security-Policy meta on the hand-written pages (index, 404, hub, workspacehq and its three embeds) with the sha256 of each inline script (`scripts/build-csp.mjs`; `npm run csp -- --check` only reports) |
| `npm run bump` | Refresh the `?v=` cache stamps after a CSS/JS change; it re-applies the CSP meta too, since a stamp inside an inline script changes that script's hash |
| `npm run stage` | Copy the deploy set into `_site/` |
| `npm run scene` | Regenerate scene/ only |
| `npm run og` | Re-render the share images (hub, workspacehq, assets/og.jpg) |
| `npm run shots` / `work:capture` | Re-capture the client-site screenshots |
| `npm run logos` | Re-take the four client logos from their live sites' headers (checks each is still the header logo) |
| `npm run kb` | Export the graphify knowledge graph into the `knowledge-base/` vault (`-- --code` refreshes the code graph first) |

Node 22.22 or later. `validate` and the browser gates need `npm install` (Playwright,
axe-core, html-validate, sharp).

### CI

GitHub Actions, in `.github/workflows/`:

| Workflow | When | What |
| --- | --- | --- |
| `check.yml`, job `check` | every push to any branch, every pull request | `check` and `themes-check`, `npm ci`, `validate`, `npm run build` then `git diff --exit-code` (and no new untracked file), `npm audit --omit=dev`. About a minute, no browser |
| `check.yml`, job `nightly` | 03:17 UTC every night; Actions → Check → Run workflow | installs Chromium, then `npm run verify`, `keys`, `links` and the full `npm audit` (dev dependencies included) |
| `pages.yml` | every push to the working branch; on demand | job `gates`: the static gates above, then audit, sweep, vbugs and keys on Chromium (about twelve minutes). Job `deploy`, only when `gates` passed: stages `_site/` and publishes it to Pages. One deployment at a time |
| `monitor.yml` | every six hours (00:41, 06:41, 12:41, 18:41 UTC); on demand | the live site: every page and stamped asset answers, with the branch's `?v=` stamp; sitemap, robots.txt, og.jpg; `npm run links`; Lighthouse on the live index (fr and ar, mobile and desktop, median of three: CLS ≤ 0.1; desktop LCP ≤ 2.5 s and TBT ≤ 200 ms; mobile, still short of that target, held to regression ceilings of 6.5 s and 350 ms, RELEASE.md §5). A failure opens or updates one issue, "Live monitor failed"; the first green run closes it |

- Every gate runs even after an earlier one failed, so one run lists
  everything that is wrong.
- Every action is pinned to a commit SHA, its version in a comment.
  `.github/dependabot.yml` proposes the updates, on Mondays: npm dev
  dependencies (minor and patch in one pull request) and the actions. A
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

Then open <http://localhost:8000>. Useful links: `?lang=en`, `?lang=ar`,
`?cur=eur`, `?cur=usd`.

### Design system — see [BRAND.md](BRAND.md)

**Arcanum** is the identity: arcane-blue ground, brass flourish, engraved Cinzel
display, electric teal as rationed neon. Six themes ship in the switcher
(Arcanum, Noir, Daylight, Mono, Alt-neon, Engineering). Each is one block of
the same 47 tokens in `assets/themes.css`; `themes-check` fails if a theme
misses a token, breaks a contrast pair, or if `styles.css` special-cases a theme.

### Features

- **Trilingual** — French (default), English and Arabic with a mirrored RTL layout
  (logical CSS properties, Western digits, forward arrows that follow the
  reading direction). `?lang=` links set the language and the canonical URL.
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
(`assets/previews/<slug>.webp`). To refresh them after a site changes:

```bash
npm install
npm run shots                     # capture all live URLs
npm run shots -- almaflowclim     # or a single project
```

Live URLs and their `client:` slugs are in `scripts/shots.mjs`; `check.mjs`
keeps them in step with the links on the page.

---

## Contact

**hamissemohamedyasser@gmail.com** · WhatsApp +213 672 41 25 78 · Bordj Bou Arréridj, DZ
· replies within 24 working hours, in French, English or Arabic.

---

*Built in Bordj Bou Arréridj, with black coffee and TypeScript.*
