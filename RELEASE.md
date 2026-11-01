# Releasing the site

How a change reaches the live site, what proves each step, how to undo a
release, what watches the site afterwards, and the settings only the owner can
change. Each claim names the file or the documentation it comes from. This
file is not deployed (`scripts/site.mjs` `NOT_DEPLOYED`). Status as of
2026-10-31: nothing has deployed since 2026-10-25 (GitHub Actions is blocked
on billing; [section 9](#9-outage-and-fallback) says what to do meanwhile).

## 1. Where the site lives

- **Canonical host: GitHub Pages**, <https://brvetr4ve1er.github.io/Numidea.tech/>
  (`BASE` in `scripts/site.mjs`). Every page except 404 names one canonical
  URL (`check.mjs` block 6). `sitemap.xml` is generated from `BASE`
  (`scripts/build-sitemap.mjs`).
- **Repository:** `Brvetr4ve1er/Numidea.tech` on GitHub. Its former name,
  `Brvetr4ve1er/STICKITTY.INC`, redirects there; older clones may still name
  it as their remote, and that keeps working.
- **Working branch:** `claude/numidea-labs-landing-c4jokc`. It is also the
  repository's default branch, so scheduled workflows and Dependabot run on it.
  Every push to it deploys, once the gates pass (`.github/workflows/pages.yml`).
- **Mirrors: Netlify and Vercel** (`netlify.toml`, `vercel.json`). They stage
  the same files into `_site/` (`scripts/stage-site.mjs`). They also send HTTP
  headers that GitHub Pages cannot set.
  - Their build runs only `check.mjs` and `themes-check.mjs`. It skips the
    browser gates and does not wait for `pages.yml`. A mirror connected to the
    repository therefore builds every push on its own, and can publish a
    commit that the Pages gates refused.
  - Their pages carry the same canonical URLs, which point at GitHub Pages.
  - The repository does not record the mirrors' addresses or whether they are
    live (owner, below).
- **What is published:** exactly `DEPLOY` in `scripts/site.mjs`: the home
  page in its three languages (`index.html`, `en/`, `ar/`), the price guide
  in three (`tarifs/`, `en/tarifs/`, `ar/tarifs/`), `404.html`,
  `robots.txt`, `sitemap.xml`, `assets/`, `scene/`, `hub/`, `workspacehq/`,
  and `legal/` once it is complete. `scripts/`, `knowledge-base/`, `audit/`
  and the documents (this file, `NOTICE.md` included) never are. What is
  served is the staged copy: since 2026-10-31 `npm run stage` strips the
  comments from every stylesheet and script it copies (the repository keeps
  them), and `node scripts/stage-check.mjs` proves in a browser that the
  stripped files parse and compile as their sources do.
- **Caching:** GitHub Pages answered with `cache-control: max-age=600` on
  2026-10-24, for HTML and assets alike, so a deploy can take up to ten
  minutes to reach a browser. Stylesheets and scripts carry a `?v=` stamp,
  which changes their URL. The mirrors cache `/assets/*`, `/hub/art/*` and
  `/workspacehq/embed/*` for a day (`netlify.toml`, `vercel.json`). Netlify's
  install step runs with `NPM_FLAGS="--omit=dev"`: `package.json` declares
  only dev dependencies, so it installs nothing.

## 2. Release checklist

Each step names the command that proves it and where CI runs that command.
Locally, `npm run verify` runs check, themes, validate, audit, sweep, vbugs,
keys and stage-check in one go, and does not stop at the first failure
(`scripts/verify.mjs`). On this machine the browser gates take about an
hour in all (keys ≈ 14 min, audit ≈ 20, sweep ≈ 10, vbugs ≈ 8, stage-check
under a minute; 2026-10-31).

| # | Before the push | Proved by | In CI |
| --- | --- | --- | --- |
| 1 | A CSS or JS change has a new `?v=` stamp | `npm run bump`. No gate can tell that a stamp is due; `check.mjs` block 4 only keeps all stamps identical | after the deploy, `monitor.yml` checks that the live stamp equals the branch's |
| 2 | Repository invariants hold: the three dictionaries (`assets/i18n/{fr,en,ar}.js`) hold the same keys and every `data-i18n` reference on the language pages resolves in each (blocks 1 and 2), every local asset and every `srcset` candidate exists with its stated width (block 3), links, deploy coverage, generated pages (scene/, the three home pages, the three guide pages), French typography, legal gating, the Supabase switch, LF line endings, no runtime dependency (block 15c), the CSP meta (block 16), every published file under its folder's or its own byte ceiling, the share cards ≤ 300 kB, the set under its total and no two published files alike, licence texts aside (block 17), SEO and structured data (block 18) | `npm run check` (`check.mjs` + `themes-check.mjs`) | `check.yml` job `check` (every push and pull request); `pages.yml` job `gates` |
| 3 | Every page is valid HTML: the entry pages on html-validate's recommended rules (`.htmlvalidate.json`, nothing relaxed) and the three WorkspaceHQ embed templates on `scripts/validate-embed.json`, which relaxes only what their runtime's `{{ }}` bindings are (the export's own accessibility gaps stay as warnings) | `npm run validate` | `check` job; `gates` job |
| 4 | The build leaves no change: generated files are committed as the generators write them (`build-scene`, `build-voices`, `build-legal`, `build-lang` for `en/` and `ar/`, `build-tarifs` for the three guide pages, `build-sitemap`, then `build-csp`) | `npm run build && git diff --exit-code` | `check` job; `gates` job |
| 5 | The CSP meta matches each page's inline scripts | `npm run csp` (rewrites it); `check.mjs` block 16 fails when it is stale | within 2 and 4 |
| 6 | The site has no runtime npm dependency | `check.mjs` block 15c fails when `package.json` declares one. `npm audit --omit=dev` audits runtime dependencies only: with none, it cannot fail, and it would audit the first one the owner allows | `check` job (both); `gates` job (15c) |
| 7 | Browser audit (89 runs): axe, layout shift, desktop LCP, overflow, tap targets, CSP violations, on the home page and the price guide in each language's own page, scene/, hub/, workspacehq/ and its embeds; 404.html two folders down (here and on an emulated GitHub Pages, JavaScript on and off); the first screen in fallback type (each theme in French and English, webfonts refused vs loaded, 360 to 1600 wide); the Arabic font files a page in another language fetched (report-only until the copy change); the throttled phone's targets are warnings until the phone-speed pass (below) | `npm run audit` (`AUDIT_PHONE_STRICT=1` to enforce the phone targets) | `gates` job; `check.yml` job `nightly` (inside `verify`) |
| 8 | Painted contrast in every theme, on every language page of the home and the guide | `npm run sweep` | `gates`; `nightly` |
| 9 | No visual layout bug outside the allowlist (`scripts/vbugs-allow.json`) | `npm run vbugs` | `gates`; `nightly` |
| 10 | Keyboard paths, focus rings, dialogs, the contact form (errors, the mail hand-off, the lead store's POST with its switch on), the guide's estimator handing its scope to the home page's form, reduced motion (WorkspaceHQ's booted console included), RTL (60 runs) | `npm run keys` | `gates`; `nightly` |
| 11 | The staged site is the site: every page byte for byte the repository's (404.html's root links aside), every stripped stylesheet parsing to the same rules and every stripped script compiling | `node scripts/stage-check.mjs` (last step of `npm run verify`) | `gates` (after keys); `nightly` (inside `verify`) |
| 12 | No dead owned or client link | `npm run links` (needs the network) | `nightly`; `monitor.yml` |
| 13 | No known advisory in any dependency, dev tools included | `npm audit` reports 0 | `nightly` |

Rows 7 to 13 run on a GitHub runner, without deploying, when the Check
workflow is run by hand on the branch. Do that before the working branch
moves ([section 3](#3-how-a-change-reaches-the-live-site), step 3).

| # | After the push | Proved by |
| --- | --- | --- |
| 14 | The gated deploy is green | Actions → "Deploy to GitHub Pages": the `gates` job and then `deploy` (`pages.yml`). The workflow file puts the gates at about twelve minutes. A red gate leaves the live site as it was. A push that changes only `**.md`, `knowledge-base/**` or `audit/**` starts no deploy (`paths-ignore`); `check.yml` still runs on it |
| 15 | The live pages answer, carry the new stamp, and stay within the Lighthouse budgets | Actions → "Live monitor" → Run workflow (`monitor.yml`). It also runs every six hours |
| 16 | The live site passes the browser audit | `AUDIT_BASE=https://brvetr4ve1er.github.io/Numidea.tech npm run audit` (`scripts/audit.mjs`; the local-only runs are skipped) |
| 17 | The mirrors built the same commit | the Netlify and Vercel dashboards (owner); nothing in this repository watches them |

### Owner-only items

No command can prove these, and none of them stops a deploy. Each one is a
decision or a document only the owner has; the last column says what the
site does until then. Details and status are in
[OWNER-CONTENT.md](OWNER-CONTENT.md).

| Item | Section | What the repository does meanwhile |
| --- | --- | --- |
| Legal notice and privacy details | [§1](OWNER-CONTENT.md#1-legal-notice--privacy-page) | `legal/` is built and deployed only when every field is filled; until then `check.mjs` refuses any link to it |
| Client quotes, with consent | [§2](OWNER-CONTENT.md#2-client-quotes-voices) | the build refuses a quote without a consent date and where the consent is kept |
| Founder photo | [§3](OWNER-CONTENT.md#3-founder-photo) | a monogram shows |
| Team photos; the "four specialists" claim | [§4](OWNER-CONTENT.md#4-team) | answered 2026-10-30 (one founder, with freelancers when needed); initials and the claim stay on the page until the copy change ships |
| A studio email on its own domain | [§5](OWNER-CONTENT.md#5-studio-email-on-its-own-domain) | `check.mjs` fails until every contact point uses one address |
| Clients' permission for paid ads | [§6](OWNER-CONTENT.md#6-clients-permission-for-paid-ads) | the campaign kit is not in this repository |
| Nomara Voyages: client or not | [§7](OWNER-CONTENT.md#7-nomara-voyages) | shown as delivered work |
| Arabic native review | [§8](OWNER-CONTENT.md#8-arabic-native-review) | the Arabic dictionary blocks carry a banner |
| Clients' own domains | [§9](OWNER-CONTENT.md#9-clients-own-domains) | the cards link the Netlify builds; `node scripts/verify-domains.mjs` says when a domain can replace one |
| Hub fan art rights | [§10](OWNER-CONTENT.md#10-hub-fan-art) | none on the hub since its rebuild of 2026-10-28 (not live: nothing has deployed since 2026-10-25, section 9); still in git history |
| Supabase lead store | [§11](OWNER-CONTENT.md#11-supabase-lead-store) | off; `check.mjs` refuses to switch it on without the legal page, the region and a new form note |
| Campaign kit and git history | [§12](OWNER-CONTENT.md#12-campaign-kit-and-this-repository) | see [section 8](#8-the-git-history) below |
| WorkspaceHQ: open source or not | [§13](OWNER-CONTENT.md#13-workspacehq-open-source) | the pages say the code is public, not open source |
| Claims only the owner can confirm | [§14](OWNER-CONTENT.md#14-claims-only-the-owner-can-confirm) | on the site until confirmed or corrected |
| Hub illustrations: titles, Kūro, the badge | [§15](OWNER-CONTENT.md#15-hub-illustrations) | the diary titles are drafts; the page says only "Kūro, the black cat"; the badge is a costume detail |
| Commercial terms | [§16](OWNER-CONTENT.md#16-commercial-terms) | drafted on the owner's instruction of 2026-10-31, his to change; the FAQ carries them from the next change on |
| Team and contact facts | [§17](OWNER-CONTENT.md#17-team-and-contact-facts-answered-2026-10-30) | answered 2026-10-30; the copy follows with the next change |

Then the one-time repository settings in [section 7](#7-settings-only-the-owner-can-change),
and the domain in [section 6](#6-domain-and-dns).

### Phone speed: not met yet

The phone targets are LCP ≤ 2.5 s, long tasks ≤ 300 ms and the slowest interaction ≤ 200 ms on a throttled phone (`scripts/audit.mjs`, `PHONE`), and LCP ≤ 2.5 s, TBT ≤ 200 ms in Lighthouse mobile. The site misses them today. The throttled phone in `npm run audit` measured LCP 2.8–3.7 s, 1.3–3.6 s of long tasks, and the language switch, its slowest interaction, at 0.4–0.9 s against 200 ms (2026-10-24 and 25, a 4-CPU machine, French faster than Arabic). Lighthouse mobile on the live site, a different measurement, gave median LCP 4.99 s (fr) and 5.89 s (ar), TBT 236–252 ms. Gating deploys on them would block every deploy, so for now:

- `npm run audit` reports the phone targets as warnings; `AUDIT_PHONE_STRICT=1` makes them fail.
- `monitor.yml` holds Lighthouse mobile to regression ceilings at today's level (`LCP_MS_MOBILE` 6500, `TBT_MS_MOBILE` 350), so the phone cannot get slower unnoticed; desktop and layout shift are held to the targets. Its Arabic run opens `/ar/`, the Arabic page, since 2026-10-31.

The first speed pass shipped on 2026-10-31 (IMPROVEMENTS F17): the language paint-hold is gone with the static `/en/` and `/ar/` pages (each loads one dictionary, about 10 KB gzipped, instead of the three inside `app.js`), the staged stylesheets and scripts lose their comments, every capture has a phone-size variant in a `srcset`, the hero deck's other four slides wait for the first interaction, and the Geist faces are declared once per weight range. Measured on a phone served gzipped from the checkout: the home's first screen 467 → 344 KB (ar 587 → 465 KB), the scene's full page 1.69 → 0.74 MB. The throttled phone's timed interactions are now the menu, the FAQ, the folded estimator, its slider and the currency switch; the language switch is a link to the other language's page, so it is no longer timed (the tap must land on that page, in that language). It still misses the target: the throttled Arabic home measured LCP 3,032 ms on 2026-10-31 (report-only). What remains: the hero image, main-thread work at start, the fonts on Android. None of the faces in `assets/fonts.css`'s fallback lists ships there, so on Android a late webfont swaps from unadjusted system fonts and can still move the hero. Calibrating fallbacks for Android's own fonts needs a real device to confirm how Chrome there resolves `local()` names. When the phone meets the targets, set `AUDIT_PHONE_STRICT=1` in `pages.yml` and `check.yml`, and lower `LCP_MS_MOBILE` and `TBT_MS_MOBILE` in `monitor.yml` to 2500 and 200.

## 3. How a change reaches the live site

1. Commit on a branch and push it. `check.yml` runs its `check` job on every
   push to every branch, in about a minute (no browser).
2. Run `npm run verify` and `npm run links` locally.
3. Run the browser gates on a GitHub runner, on that branch, before anything
   deploys: Actions → Check → Run workflow, choose the branch, and leave "Also
   run the nightly job" ticked (`browser: true`, the default). Through the
   API, `POST /repos/Brvetr4ve1er/Numidea.tech/actions/workflows/check.yml/dispatches`
   with `{"ref": "<branch>"}` does the same.
   - That run's `check` and `nightly` jobs cover every gate of `pages.yml`
     (the static gates, build-no-diff, then audit, sweep, vbugs and keys
     inside `npm run verify`), plus `links` and the full `npm audit`. They
     deploy nothing.
   - The timing gates (the throttled phone, desktop LCP) have so far run only
     on a local machine. A runner can be slower, and if one of them fails
     there, step 5 refuses every deploy until it is fixed. Here that failure
     costs nothing.
   - Re-run a timing gate that fails once before treating it as real (Re-run
     failed jobs).
4. Only when both jobs are green, fast-forward the working branch to that
   branch and push.
5. `pages.yml` runs `gates`: the invariants, validate, build-no-diff, then
   audit, sweep, vbugs, keys and stage-check on Playwright's Chromium. Every
   gate runs even after one fails, so a red run lists everything that is
   wrong. `deploy` runs only when `gates` passed (`needs: gates`). It stages
   `_site/` (`stage-site.mjs --pages`, which also points `404.html`'s
   JavaScript-off links at the repository subpath and strips the comments
   from the staged stylesheets and scripts) and publishes it, and it is the
   only job with Pages write and OIDC token permissions. A push that touches
   only documentation (`**.md`, `knowledge-base/**`, `audit/**`) does not
   start this workflow at all.
6. Deploys run one at a time (`concurrency: pages`, never cancelled
   mid-flight). Newer pushes wait, and of those only the latest queued one
   runs.

Once branch protection is on ([section 7](#7-settings-only-the-owner-can-change)),
step 1 is required: the working branch accepts only a commit that has
already passed `check`.

## 4. Rollback

The site keeps nothing on a server and sets no cookies or analytics, and the
Supabase store is off (README, `OWNER-CONTENT.md` §11). The browser only
remembers display preferences in `localStorage`, and a rollback leaves them
in place:

- the language, theme and currency (`numidea-lang`, `numidea-theme`,
  `numidea-cur`; `assets/app.js`, `assets/page-i18n.js`; the language
  switch's links and the home page's head script store and read
  `numidea-lang`, so a stored `en` or `ar` sends `/` to that language's
  page), and, for one tab, the price guide's estimator scope on its way to
  the home page's form (`sessionStorage` `numidea-prefill`, cleared on
  arrival);
- hub/'s theme (`void-theme`, `hub/app.js`);
- WorkspaceHQ's motion switch (`whq-motion`, `workspacehq/app.js`) and the
  embeds' playback position (`animstage-v3…`,
  `workspacehq/embed/animations-v3.js`).

A rollback therefore only changes which files are served.

**A. Revert and push: permanent, and the default choice.**

```bash
git revert --no-edit <bad-commit>             # or a range: <oldest>^..<newest>
git push origin claude/numidea-labs-landing-c4jokc
```

`pages.yml` runs the gates on the revert and deploys it, which takes as long
as any release. The revert must pass the gates like any other commit.

**B. Re-run an earlier Pages deployment: no new commit, and temporary.**

1. Actions → "Deploy to GitHub Pages".
2. Open the last good run → Re-run all jobs.

GitHub re-runs a workflow with the same commit (`GITHUB_SHA`) and the same
ref as the original run. It allows this up to 30 days after the run, with
the privileges of whoever triggered the original (GitHub Docs, "Re-running
workflows and jobs"). Both jobs run again for that commit, `gates` and then
`deploy`. The `deploy` job checks the commit out and stages it again, so it
does not depend on an earlier run's artifact.

This holds only until the next push, which deploys the branch head again, so
follow it with A. Meanwhile `monitor.yml` reports the live `?v=` stamp as
behind the branch, unless the two commits share a stamp. That is expected,
and it opens the monitor issue.

**C. Mirrors.**

- **Netlify:** Deploys → open an earlier successful deploy → Publish deploy.
  It is instant and rebuilds nothing. With auto publishing on, the next
  production deploy from Git replaces it. To hold the rollback, use "Lock to
  stop auto publishing" in the Deploys list, and "Unlock to start auto
  publishing" afterwards (Netlify Docs, "Manage deploys").
- **Vercel:** the project's Production Deployment tile → Instant Rollback, or
  Deployments → ⋮ → Instant Rollback. On the Hobby plan only the immediately
  previous production deployment is eligible. After a rollback Vercel stops
  assigning the production domains to new deployments. "Undo Rollback" on the
  same tile, or `vercel promote <deployment>`, restores that (Vercel Docs,
  "Instant Rollback").

## 5. Monitoring

| What | When | Watches | How a failure arrives |
| --- | --- | --- | --- |
| `check.yml` job `check` | every push and pull request | steps 2–6 of the checklist | a red run on the commit (and on the pull request) |
| `check.yml` job `nightly` | 03:17 UTC every night, and Actions → Check → Run workflow | `npm run verify` (every gate, `keys` included), `links`, the full `npm audit`: a new advisory against a dev tool turns it red without blocking pushes | a red scheduled run |
| `monitor.yml` job `live` | 00:41, 06:41, 12:41, 18:41 UTC, and Actions → Live monitor → Run workflow | the live site, below | one issue, "Live monitor failed" |
| Dependabot (`.github/dependabot.yml`) | Mondays 05:00 Africa/Algiers | npm dev dependencies and the pinned actions | pull requests against the working branch, each running `check` |

What the live monitor checks (`monitor.yml`). Each check runs even after an
earlier one failed:

1. **Pages and assets.**
   - Every page in `PAGES` answers 200, and an unknown path answers 404 with
     the site's 404 page. The HTML is fetched past the CDN cache.
   - Every page carries the `?v=` stamp of the branch head, and every stamped
     stylesheet and script it loads answers 200.
   - `sitemap.xml`, `robots.txt` and `assets/og.jpg` answer 200 with the
     right type.
   - The last finished Pages run on the default branch succeeded (read
     through the Actions API). Most commits keep the stamp, so this is what
     catches a deploy whose gates were red: the old site stays live, and the
     stamp alone would not show it.
   - A stamp behind the branch, or a failed last run, is only a warning while
     a newer Pages run is queued or running. Otherwise the error names the
     last Pages run and how it ended.
2. **External links:** `npm run links`.
3. **Lighthouse.** The version is pinned in the file. It runs on the live
   index, in French and in Arabic, on mobile and desktop, three runs each.
   The reports are kept as a run artifact for 14 days. The medians must stay
   within the budgets in the `env` block of the `live` job:
   - CLS ≤ 0.1 on both;
   - desktop: LCP ≤ 2.5 s and TBT ≤ 200 ms, the target;
   - mobile: LCP ≤ 6.5 s and TBT ≤ 350 ms. These are regression ceilings,
     not the target. The target is the same as on desktop.

How a failure reaches the owner:

- The `report` job (the only one that can write issues) opens one issue,
  "Live monitor failed", and mentions the repository owner.
- A later failure refreshes the issue's body. It adds a comment only when
  the issue was closed, or when the set of failing checks changed, so a
  standing failure does not notify four times a day.
- The first green run comments on the issue and closes it.

**Mobile is short of the target (owner decision).** On 2026-10-24 the
live site's mobile medians were LCP 4.99 s (fr) and 5.89 s (ar), TBT 236 and
252 ms. Desktop met the target (LCP 1.05 s and 1.21 s).

- Held to 2.5 s and 200 ms, the monitor would be red from its first run, and
  its issue would never close. A real outage would then arrive only as a
  "failing checks changed" comment on an issue nobody reads any more.
- So the mobile budgets are ceilings: those medians plus a margin. A red
  mobile row means the page got slower, not that it is still slow.
- The medians were measured on a machine with a Lighthouse `benchmarkIndex`
  of about 2000, not on a GitHub runner. If the first runs on GitHub are
  over a ceiling for no other reason, set the ceiling from their medians.
- Each time the page gets faster, lower the ceilings toward the target. The
  owner decides when mobile is held to the target itself. In those reports,
  Lighthouse put the largest saving in the render-blocking stylesheets (about
  1.2 s, `assets/styles.css` first).

GitHub's own rules that affect this (GitHub Docs, "Events that trigger
workflows", `schedule`):

- Scheduled workflows run only on the default branch.
- In a public repository, they are disabled automatically after 60 days
  without repository activity. Re-enable them at Actions → the workflow →
  Enable workflow.
- Notifications for a scheduled run go to the user who last changed the
  `cron` line in the workflow file.

Not watched:

- the mirrors (the monitor reads only `BASE`);
- CSP violations on the live site (run checklist step 16 by hand);
- anything between two six-hourly runs;
- anything at all while Actions is blocked ([section 9](#9-outage-and-fallback)).

## 6. Domain and DNS

**Status: pending, owner.**

- The site has no domain of its own. It is served at `github.io` (`BASE`),
  and contact goes to a personal Gmail address (`OWNER-CONTENT.md` §5).
- The clients' domains are a separate question (`OWNER-CONTENT.md` §9).

The owner decides:

- which domain;
- the registrar account, held in the owner's name;
- the DNS host;
- whether the mirrors get names under it.

When a domain exists:

1. **Verify it first** in the owner's GitHub profile settings → Pages. A
   verified domain cannot be taken over by another GitHub user's Pages site
   if it is ever unlinked from this one (GitHub Docs, "Verifying your custom
   domain for GitHub Pages").
2. **Set it** at Settings → Pages → Custom domain, then turn on Enforce
   HTTPS. A `CNAME` file in the repository does not set the domain; this
   setting does (GitHub Docs, "Configuring a publishing source").
3. **Change `BASE`** in `scripts/site.mjs`, run `npm run build` (sitemap,
   scene/, and the generated `en/`, `ar/` and `tarifs/` pages, which take
   their addresses from `index.html`'s head), and update the hand-written
   heads in `index.html`, `hub/`, `workspacehq/` and `robots.txt`.
   - `npm run check` names what still points at the old address: block 6
     checks the static canonicals; block 18 checks the `og:` URLs, the
     hreflang alternates against the sitemap, the `Sitemap:` line in
     `robots.txt` and every site URL in the JSON-LD (`url`, `image`, `logo`,
     the BreadcrumbList items).
   - As a last look, `grep -rn '<old host>' index.html 404.html hub
     workspacehq scene robots.txt sitemap.xml` returns nothing.
   - `monitor.yml` reads the new address from `BASE`, and so does the Pages
     staging step (`stage-site.mjs --pages`: `404.html`'s JavaScript-off links
     go to the path of `BASE`, `/` on a domain of its own). `AUDIT_BASE` is
     given by hand.
4. **Mail:** a mailbox on the domain needs SPF, DKIM and DMARC
   (`OWNER-CONTENT.md` §5).

## 7. Settings only the owner can change

These are repository and account settings. The sessions that prepare
releases cannot reach them, so the owner sets them in GitHub.

**Branch protection** for `claude/numidea-labs-landing-c4jokc`. Use Settings
→ Branches → Add branch protection rule, or Settings → Rules → Rulesets →
New branch ruleset. Both are available for public repositories on GitHub
Free.

- **Require status checks to pass, with `check`**, the job in `check.yml`
  (source: GitHub Actions). GitHub Docs: once required checks pass, commits
  "must either be pushed to another branch and then merged or pushed directly
  to the protected branch". So a push of a commit that has not passed `check`
  is refused, and section 3's step 1 is what makes a release possible.
- Do not require `gates` or `nightly`:
  - `gates` runs only after a push to this branch, so it cannot be a
    condition for one;
  - `nightly` does not run per commit.
- **Block force pushes and deletion.** A classic rule blocks force pushes by
  default. A history rewrite ([section 8](#8-the-git-history)) needs that
  lifted for its duration.
- **Who may bypass: the owner's call.** A classic rule does not bind
  repository admins unless "Do not allow bypassing the above settings" is
  ticked. A ruleset exempts only the roles on its bypass list. If the owner
  is exempt, the owner's own pushes skip the check, and so does anything
  that pushes with the owner's credentials. If not, an emergency fix also
  has to pass `check` first.

**The `github-pages` environment.** Settings → Environments → github-pages →
Deployment branches and tags → Selected branches →
`claude/numidea-labs-landing-c4jokc`. GitHub recommends that only the
default branch may deploy to it.

**Actions.** Settings → Actions → General → Actions permissions → "Require
actions to be pinned to a full-length commit SHA". Every action in
`.github/workflows/` already is, with its version in a comment.

**Dependabot alerts and security updates.** Settings → Advanced Security.
`.github/dependabot.yml` covers version updates only. Security updates need
this setting, and they skip the seven-day cooldown.

**Issues** stay on (Settings → General → Features). The monitor reports
through an issue.

**Notifications** (github.com/settings/notifications):

- System → Actions → Email, optionally "Only notify for failed workflows".
- "Participating, @mentions and custom" → Email, for the monitor issue.

**Mirrors.** Record whether the Netlify and Vercel projects exist and are
public, and their addresses.

- The privacy page must name every host that serves the site
  (`OWNER-CONTENT.md` §1, `hosts`).
- If a mirror should never publish a commit the Pages gates refused, its
  own settings must hold it: section 1 explains why.

## 8. The git history

The repository is public. The campaign kit (strategy, budget, client
permissions):

- was committed on 2026-10-10 (394faa1, 09adb12);
- was removed on 2026-10-12 (08efea7, "Take the campaign kit out of the
  public repository");
- is still readable in the working branch's history.

On 2026-10-24:

- The other branches on the remote, `main` and `master`, do not contain it.
- Neither do the ten pull-request refs (`refs/pull/1–10/head`); all of them
  predate it.
- `knowledge-base/` and `audit/` are also readable on GitHub, though never
  on the site (`OWNER-CONTENT.md` §12).

**Whether to rewrite the history is the owner's call.** The facts for that
decision (GitHub Docs, "Removing sensitive data from a repository"):

- **The rewrite.** On a fresh clone, run `git-filter-repo
  --sensitive-data-removal --invert-paths --path campaign` (version 2.47 or
  later), then force-push every branch. Every later commit gets a new SHA.
  The pinned action SHAs in the workflows are unaffected, because they
  belong to other repositories.
- **Pull requests.** A pull request's ref cannot be rewritten by a push.
  Dependabot runs on Mondays at 05:00 (Algiers) once
  `.github/dependabot.yml` is on the working branch. Any pull request it
  opens will descend from the kit's commits, so a rewrite is cleanest
  before its first one, or with no pull request open.
- **Cached views and pull-request refs** on GitHub are removed only by
  GitHub Support. Support "will only assist in the removal of sensitive data
  in cases where we determine that the risk can't be mitigated by rotating
  affected credentials", and won't remove non-sensitive data. A business
  document may not qualify.
- **Copies elsewhere keep it.** Forks and existing clones keep the old
  history: the owner's machine and the clones the agent sessions work in.
  Each branch made from the old history must be rebased, not merged, or a
  merge brings the history back.
- **Settings.** Branch protection must allow the force push while the
  rewrite runs.

## 9. Outage and fallback

**Status (2026-10-31): nothing has deployed since 2026-10-25.** Every GitHub
Actions run on the repository has failed within seconds since 2026-10-25
16:42 UTC, before any step runs: the account's billing (a spending limit or
an unpaid balance, which GitHub's billing documentation says stops Actions
from running) blocks the runners. So `pages.yml` deploys nothing, `check.yml` proves nothing on a
runner, `monitor.yml` watches nothing, and Dependabot's pull requests get no
`check` run. The live site still carries stamp `202610251516`; everything
pushed since (the hub rebuild of 2026-10-28, the fleet of 2026-10-31, the
static `/en/`, `/ar/` and `/tarifs/` pages) is on the branch and not live.
Only the owner can clear it (Settings → Billing and plans), and nothing in
this repository can tell when he has.

**What the sessions do meanwhile (owner decision, 2026-10-30: push anyway,
the site deploys later).**

- Every push still runs the whole protocol locally first: `npm run build`
  (no diff), `npm run verify` green with `CHROMIUM_PATH` set, `npm run
  links`, `npm run metrics`; the Actions state is reported honestly in the
  log (IMPROVEMENTS.md) and never as "deployed".
- The weekly session probes the live stamp itself while the monitor cannot:
  `curl -s https://brvetr4ve1er.github.io/Numidea.tech/ | grep -o '?v=[0-9]\{12\}' | head -1`
  against the branch head's stamp (`grep -o '?v=[0-9]\{12\}' index.html | head -1`).
  Equal stamps mean the site has moved; the stamp alone cannot show a deploy
  whose gates were red, so the first run after billing clears is read in
  Actions.
- Once Actions runs again: re-run "Deploy to GitHub Pages" on the branch
  head (it deploys the whole branch, so no intermediate push needs
  replaying), then "Live monitor", then check Dependabot's open pull
  requests, which will each want a green `check`.

**Fallback release path, if the site must move before billing is cleared.**
`BASE` does not move: the canonical host stays GitHub Pages, the sitemap,
the canonicals and the share-card URLs keep naming it, and nothing in the
repository changes. The mirrors are only a way to put the same files on a
screen.

1. Run the gates locally as above; stage the site with the mirrors' root:
   `npm run stage` (the site at `/`; `--pages` is GitHub's subpath and is
   wrong for a mirror), then `node scripts/stage-check.mjs` has already
   proved the stripped copies, and `_site/` is what the hosts would build.
2. Deploy by hand with the host's CLI, from the repository root:
   - Netlify: `npx netlify-cli deploy --dir=_site --prod` publishes the
     staged folder as it is (first `npx netlify-cli login`, then
     `netlify link` to the project; its state goes to `.netlify/`, which
     `NOT_DEPLOYED` already lists). The mirror's Git-connected builds, if
     any, replace it at the next push.
   - Vercel: `npx vercel --prod` after `npx vercel login` (state in
     `.vercel/`, also in `NOT_DEPLOYED`) sends the repository and lets
     Vercel run `vercel.json`'s build command (check, themes-check, stage:
     Node only, no browser), so the headers in `vercel.json` apply; `cd
     _site && npx vercel --prod` would publish the folder bare, without
     them.
   Both CLIs come from npm, not from `package.json`: run them with `npx`,
   never add them as dependencies (check block 15c would fail, and the
   site needs none).
3. Say where it went: the mirror's address is not recorded in this
   repository (section 7, "Mirrors"), and a mirror serving the branch while
   GitHub Pages serves the 2026-10-25 build means two versions of the site
   are public at once, each carrying the canonical of the one that is
   behind. That is acceptable for days, not for a campaign: an ad link must
   point at the host that has the page it promises (`/en/`, `/ar/`,
   `/tarifs/` do not exist on the live GitHub Pages build).
4. When GitHub Pages deploys again, the mirror becomes a mirror again by
   itself at the next push, or is rolled back as in section 4C.

Nothing above was exercised on 2026-10-31: the owner chose to push and wait,
and no mirror deploy was made.
