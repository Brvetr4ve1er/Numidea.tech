---
type: map
updated: 2026-10-24
sources: [README.md, BRAND.md, OWNER-CONTENT.md, scripts/site.mjs, scripts/stage-site.mjs, scripts/check.mjs, scripts/build-legal.mjs, scripts/legal-data.mjs, scripts/build-kb.mjs, .github/workflows/pages.yml, .github/workflows/check.yml, .github/workflows/monitor.yml, RELEASE.md, netlify.toml, vercel.json, .gitignore, index.html, 404.html, robots.txt, package.json, scripts/bump.mjs, scripts/build-sitemap.mjs, audit/Security_Privacy.md, audit/Performance_A11y.md, audit/Architecture.md]
---

# Deploy

Only the paths named in `DEPLOY` in `scripts/site.mjs` are ever published: `scripts/stage-site.mjs` copies exactly those into `_site/`, and every host publishes that folder (scripts/site.mjs › header; scripts/stage-site.mjs › header). GitHub Pages is the canonical host and Netlify and Vercel are mirrors (README.md › Deploy). GitHub Pages publishes only once every gate in `pages.yml` is green, the browser gates included; the mirrors run only the two static checks before staging (.github/workflows/pages.yml › 3–15; netlify.toml › 12; vercel.json › 3). Start with the hosts table, then the pipeline; what the checks themselves test is in [[Build and gates]].

## Hosts

| Host | Role | Config | Build command | Publishes | Extra |
|---|---|---|---|---|---|
| GitHub Pages | Canonical, `https://brvetr4ve1er.github.io/Numidea.tech/` | `.github/workflows/pages.yml` | Job `gates`: `check.mjs` and `themes-check.mjs`, `npm ci`, `validate`, the build-leaves-no-change check, then `audit`, `sweep`, `vbugs` and `keys`; job `deploy`, only when `gates` passed: `node scripts/stage-site.mjs` | `_site/` as a Pages artifact | Runs on every push to `claude/numidea-labs-landing-c4jokc` and on manual dispatch; Node 22 |
| Netlify | Mirror | `netlify.toml` | `node scripts/check.mjs && node scripts/themes-check.mjs && node scripts/stage-site.mjs` | `_site` | `NODE_VERSION = "22"`, `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "1"`; cache and security headers |
| Vercel | Mirror | `vercel.json` | Same command | `_site` | `installCommand` is `echo skip`; `trailingSlash: true`; cache and security headers |

Sources: README.md › Deploy; scripts/site.mjs › BASE; .github/workflows/pages.yml › 20–23, 36–142; netlify.toml › 11–17; vercel.json › 2–5.

- Netlify installs the `package.json` dependencies before the build, as it does for any repository with a `package.json`, even though the build command needs none; none of them downloads a browser on install today (netlify.toml › 1–10).
- Whether the Netlify or Vercel mirror is live is left open: the privacy page's hosts list names GitHub only, and the owner is asked to add `netlify` or `vercel` if a mirror is public (OWNER-CONTENT.md › 1. Legal notice + privacy page; scripts/legal-data.mjs › 40–44). See [[Open owner items]].
- Graph: [[GitHub Pages canonical deploy]], [[Netlify and Vercel mirrors]], [[Hosting topology GitHub Pages canonical, NetlifyVercel mirrors]], [[vercel.json]].

## The GitHub Pages pipeline

1. A push to the working branch, or a manual run, starts the workflow (.github/workflows/pages.yml › 20–23).
2. Job `gates`, read-only: checkout and Node 22, then `check.mjs` and `themes-check.mjs`, `npm ci`, `validate`, and `npm run build` followed by `git diff --exit-code` (the build must change and add no file) (.github/workflows/pages.yml › 36–81).
3. Still in `gates`: Playwright's Chromium is installed, then `audit`, `sweep`, `vbugs` and `keys` run, about twelve minutes in all. Every gate runs even after one failed, so a red run lists everything that is wrong (.github/workflows/pages.yml › 6–9, 83–102).
4. Job `deploy` runs only when `gates` passed (`needs: gates`), so any red gate leaves the live site as it was. It checks out again and `stage-site.mjs` stages the publishable files into `_site/` (.github/workflows/pages.yml › 10–15, 104–128).
5. `configure-pages` with `enablement: true` turns Pages on with Actions as the source, then `_site` is uploaded and deployed (.github/workflows/pages.yml › 130–142).

- One deployment at a time: the `pages` concurrency group never cancels a run in progress; newer pushes wait, and only the latest queued one runs (.github/workflows/pages.yml › 28–33).
- Permissions are per job: the workflow grants only `contents: read`, and only the `deploy` job adds `pages: write` and `id-token: write` (.github/workflows/pages.yml › 25–26, 108–111).
- The Check workflow runs separately, and `pages.yml` does not wait for it: job `check` on every push and pull request (the static gates, the build-leaves-no-change check, `npm audit --omit=dev`), job `nightly` every night and on demand (`npm run verify`, `npm run links`, the full `npm audit`) (.github/workflows/check.yml › 3–20, 38–111). See [[Build and gates]].
- After a deploy, `monitor.yml` checks the live site every six hours: every page and stamped asset, the `?v=` stamp, the last Pages run, the external links and Lighthouse. A failure opens one issue, "Live monitor failed" (.github/workflows/monitor.yml › header).
- The release checklist, rollback, what the monitor watches and the repository settings only the owner can change are in RELEASE.md (README.md › Deploy).
- Graph: [[Deploy to GitHub Pages workflow]], [[Check repository invariants step]], [[Stage publishable files into _site]], [[Configure, upload and deploy Pages artifact]], [[Pages concurrency group (no cancel-in-progress)]], [[Working branch claudenumidea-labs-landing-c4jokc]].

## What is published

| Published (`DEPLOY`) | Never published (`NOT_DEPLOYED`) |
|---|---|
| `index.html`, `404.html`, `robots.txt`, `sitemap.xml`, `assets/`, `scene/`, `hub/`, `workspacehq/`, and `legal/` once it exists | `.git`, `.github`, `.claude`, `.tmp`, `.netlify`, `.vercel`, `node_modules`, `_site`, `audit`, `campaign`, `knowledge-base`, `scripts`, `legal-preview`, `legal`, `BRAND.md`, `README.md`, `LICENSE`, `OWNER-CONTENT.md`, `package.json`, `package-lock.json`, `netlify.toml`, `vercel.json`, `.gitignore`, `.graphifyignore`, `graphify-out` |

Sources: scripts/site.mjs › DEPLOY, NOT_DEPLOYED, LEGAL_PUBLISHED.

- `legal` is in `NOT_DEPLOYED` as written, and `DEPLOY` adds it only when `legal/index.html` exists (scripts/site.mjs › LEGAL_PUBLISHED, DEPLOY, NOT_DEPLOYED).
- `README.md` and `.DS_Store` are skipped even inside a published folder (scripts/site.mjs › DEPLOY_SKIP).
- `stage-site.mjs` deletes `_site/`, recreates it, stops with an error if a `DEPLOY` path is missing, and copies each path recursively (scripts/stage-site.mjs › 14–21). `_site/` is git-ignored (.gitignore).
- `.netlify/` and `.vercel/` hold the mirror tools' local state where the mirrors build, so they are listed as never deployed rather than treated as unknown folders (scripts/site.mjs › header).
- `check` block 6 fails when a root folder is in neither list, when a published page links to an unpublished file, or when the sitemap lists an unpublished URL (scripts/check.mjs › 248–287). A new folder therefore has to be declared before it can reach a deploy by accident (scripts/check.mjs › 250–251).
- `legal/` joins the deploy and the sitemap only once every owner field in `scripts/legal-data.mjs` is filled; until then nothing may link to it (OWNER-CONTENT.md › 1. Legal notice + privacy page; scripts/site.mjs › LEGAL_PUBLISHED; scripts/check.mjs › 441–459). That is pending: [[Open owner items]].
- `robots.txt` allows everything and names the sitemap at the GitHub Pages address (robots.txt).
- `DEPLOY`, `DEPLOY_SKIP`, `NOT_DEPLOYED` and `LEGAL_PUBLISHED` are exports of `scripts/site.mjs`, the data-only module the scripts share (scripts/site.mjs › header); the full list of its exports and the scripts that read each one is in [[Build and gates]], section "Shared script config". Graph: [[site.mjs]], [[ROOT_1|ROOT]], wiki [[wiki/ROOT|ROOT]].
- Graph: [[DEPLOY]], [[DEPLOY_SKIP]], [[NOT_DEPLOYED]], [[LEGAL_PUBLISHED]], [[stage-site.mjs]], [[_site (staged deploy folder)]], [[Deploy scope (DEPLOY, stage-site.mjs, NOT_DEPLOYED)]], [[Never-published folders (scripts, knowledge-base, audit, legal-preview)]].

## Never-published folders and private material

| Path | What it is | Readable where |
|---|---|---|
| `scripts/` | Generators, gates and tools | On GitHub, never on the site |
| `knowledge-base/` | Internal memory, a dated snapshot | On GitHub, never on the site |
| `audit/` | The 2026-07 code audit, a dated snapshot | On GitHub, never on the site |
| `legal-preview/` | The legal page with its gaps marked | Nowhere: git-ignored |
| The campaign kit | Strategy, budget, client permissions | Outside this repository, with the owner; still in the history of earlier commits |

Sources: README.md › This repository — the landing page, Deploy; scripts/site.mjs › NOT_DEPLOYED; .gitignore; OWNER-CONTENT.md › 12.

- The repository is public, so everything tracked here can be read on GitHub (OWNER-CONTENT.md › 12).
- `check` fails when a deployed page links to an unpublished file, for example into `knowledge-base/` or `scripts/` (scripts/check.mjs › 1–32, block 6).
- The kit was removed from the repository on 2026-10-12. Taking it out of the git history needs a force-push rewrite that also rewrites every later commit; that is the owner's call, best made when no pull request is open (OWNER-CONTENT.md › 12). It is listed in [[Open owner items]].
- `scripts/build-creative.mjs` is the one script that reads the kit, from `CAMPAIGN_DIR` or a git-ignored `./campaign` folder (README.md › Deploy; .gitignore); see [[Captures and image tools]].
- The graph groups these folders in one community with the native Arabic review, which is still pending (OWNER-CONTENT.md › 8): [[Arabic native review]].
- Graph: [[scripts (generators, gates and tools)]], [[knowledge-base (internal memory snapshot)]], [[audit (2026-07 code audit snapshot)]], [[Marketing campaign kit (CAMPAIGN_DIR)]], [[Campaign kit in public git history]], [[_COMMUNITY_Private Folders and Reviews]], wiki [[Private_Folders_and_Reviews]].

## Headers and caching

| Header | Value | Applies to |
|---|---|---|
| `Cache-Control` | `public, max-age=86400` | `/assets/*` |
| `X-Content-Type-Options` | `nosniff` | Every path |
| `X-Frame-Options` | `SAMEORIGIN` | Every path |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Every path |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Every path |

Sources: netlify.toml › 22–33; vercel.json › headers. The two files set the same values; `netlify.toml` calls itself the mirror of `vercel.json` (netlify.toml › 19).

- Assets are cached for a day, not marked immutable, because only the CSS and JS links carry `?v=` stamps, while images, the CV and `og.jpg` are regenerated under the same names (netlify.toml › 19–21).
- `SAMEORIGIN` rather than a full frame ban, because `workspacehq/` embeds its own same-origin pages (netlify.toml › 31).
- `pages.yml` sets no headers; these two files only shape the mirrors (.github/workflows/pages.yml; netlify.toml; vercel.json).
- Graph: [[headers]], [[_COMMUNITY_Hosting and Security]], wiki [[Hosting_and_Security]].

## Addresses on every host

- `BASE` in `scripts/site.mjs` is the GitHub Pages address; the sitemap, the canonical checks and the absolute-link checks all use it (scripts/site.mjs › BASE; scripts/build-sitemap.mjs › url; scripts/check.mjs › 254–305).
- The home page names its canonical from its `x-default` alternate, which is the GitHub Pages address, so a mirror serving the same file names the GitHub Pages URL as canonical (index.html › 21, 117–121).
- `404.html` works out the site root in its head script: on a `*.github.io` host it uses the first path segment (the repository subpath), elsewhere `/`; it rewrites its asset links before first paint and its home link once the page is parsed; opened from disk it stays relative (404.html › 102–114). See [[Site-root recomputation for the GitHub Pages 404]] and [[Site architecture]].
- Graph: [[BASE]], [[_COMMUNITY_404 Page and Hosting]], [[_COMMUNITY_Sitemap and Site Scope]].

## Before you push

1. Run `npm run verify` and push only when it is green (README.md › Commands). Then run the Check workflow by hand on the branch, so the browser gates also pass on a GitHub runner, before the working branch moves (RELEASE.md › 3).
2. After a CSS or JS change, run `npm run bump` first so the stamps change (README.md › Commands; scripts/bump.mjs › header).
3. To see exactly what will be served, run `npm run stage` and open `_site/` (package.json › scripts.stage; scripts/stage-site.mjs › header).
4. For a quick local look, any static server works: `python3 -m http.server 8000`, with `?lang=en`, `?lang=ar`, `?cur=eur` or `?cur=usd` (README.md › Run it locally).

## The knowledge base and deploy

- `knowledge-base/` is committed to this public repository but is never deployed (scripts/site.mjs › NOT_DEPLOYED; scripts/build-kb.mjs › 24–25).
- `check` block 15 keeps private material out of it: machine paths, private-vault markers and any e-mail address but the two it allows fail the check (scripts/check.mjs › 544–560).
- The marketing campaign kit is kept outside this public repository altogether (README.md › Deploy; .gitignore).

## History

- The July 2026 code audit found the knowledge base served on the public site, because `pages.yml` then uploaded the whole repository (audit/Security_Privacy.md › S-01). Today it uploads only the staged `_site` (.github/workflows/pages.yml › 127–138). See [[S-01 - Internal knowledge base published on the public site]].
- The same audit said GitHub Pages cannot set `Cache-Control` and that `vercel.json` encoded immutable asset caching (audit/Performance_A11y.md › P-02); today both mirrors cache assets for one day, for the reason above (netlify.toml › 19–25; vercel.json › headers). See [[P-02 - Hosting headers (GitHub Pages cannot set Cache-Control)]] and [[vercel.json security headers (nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy)]], whose title records `DENY` where the current files set `SAMEORIGIN` (netlify.toml › 31).
- The audit also listed as a known risk that the deploy branch is a `claude/` working branch (audit/Architecture.md › Known risks): [[Risk deploy branch is a claude... working branch]]. The workflow still triggers on that branch (.github/workflows/pages.yml › 22).
- The whole audit is mapped in [[Code audit (2026-07)]].
- The June 2026 knowledge base in `archive/2026-06-snapshot/` is history only: [[June 2026 archive]]. Dates are in [[Timeline]].

## Related

- Maps: [[Build and gates]], [[Site architecture]], [[Themes and tokens]], [[Open owner items]], [[Captures and image tools]], [[Code audit (2026-07)]], [[Maps/Glossary|Glossary]].
- Communities: [[_COMMUNITY_Pages Deploy Pipeline]], [[_COMMUNITY_Build Scripts and Deploy Scope]], [[_COMMUNITY_Hosting and Security]], [[_COMMUNITY_Sitemap and Site Scope]], [[_COMMUNITY_404 Page and Hosting]], [[_COMMUNITY_Private Folders and Reviews]].
- Wiki: [[Pages_Deploy_Pipeline]], [[Build_Scripts_and_Deploy_Scope]], [[Hosting_and_Security]], [[Sitemap_and_Site_Scope]], [[404_Page_and_Hosting]], [[Private_Folders_and_Reviews]], [[wiki/ROOT|ROOT]].
