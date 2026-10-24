# Releasing the site

How a change reaches the live site, what proves each step, how to undo a
release, what watches the site afterwards, and the settings only the owner can
change. Each claim names the file or the documentation it comes from. This
file is not deployed (`scripts/site.mjs` `NOT_DEPLOYED`). Status as of
2026-10-24.

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
- **What is published:** exactly `DEPLOY` in `scripts/site.mjs`. `scripts/`,
  `knowledge-base/`, `audit/` and the documents (this file included) never
  are.
- **Caching:** GitHub Pages answered with `cache-control: max-age=600` on
  2026-10-24, for HTML and assets alike, so a deploy can take up to ten
  minutes to reach a browser. Stylesheets and scripts carry a `?v=` stamp,
  which changes their URL. The mirrors cache `/assets/*` for a day
  (`netlify.toml`, `vercel.json`).

## 2. Release checklist

Each step names the command that proves it and where CI runs that command.
Locally, `npm run verify` runs check, themes, validate, audit, sweep, vbugs
and keys in one go, and does not stop at the first failure
(`scripts/verify.mjs`).

| # | Before the push | Proved by | In CI |
| --- | --- | --- | --- |
| 1 | A CSS or JS change has a new `?v=` stamp | `npm run bump`. No gate can tell that a stamp is due; `check.mjs` block 4 only keeps all stamps identical | after the deploy, `monitor.yml` checks that the live stamp equals the branch's |
| 2 | Repository invariants hold: i18n ×3, assets, links, deploy coverage, generated pages, French typography, legal gating, the Supabase switch, LF line endings, the CSP meta (block 16), asset byte budgets per folder and for the whole published set (block 17), SEO and structured data (block 18) | `npm run check` (`check.mjs` + `themes-check.mjs`) | `check.yml` job `check` (every push and pull request); `pages.yml` job `gates` |
| 3 | Every page is valid HTML | `npm run validate` | `check` job; `gates` job |
| 4 | The build leaves no change: generated files are committed as the generators write them | `npm run build && git diff --exit-code` | `check` job; `gates` job |
| 5 | The CSP meta matches each page's inline scripts | `npm run csp` (rewrites it); `check.mjs` block 16 fails when it is stale | within 2 and 4 |
| 6 | The runtime has no vulnerable dependency (it has none) | `npm audit --omit=dev` | `check` job |
| 7 | Browser audit: axe, layout shift, LCP budgets, overflow, tap targets, CSP violations, the throttled phone | `npm run audit` | `gates` job; `check.yml` job `nightly` (inside `verify`) |
| 8 | Painted contrast in every theme | `npm run sweep` | `gates`; `nightly` |
| 9 | No visual layout bug outside the allowlist (`scripts/vbugs-allow.json`) | `npm run vbugs` | `gates`; `nightly` |
| 10 | Keyboard paths, focus rings, dialogs, reduced motion, RTL | `npm run keys` | `gates`; `nightly` |
| 11 | No dead owned or client link | `npm run links` (needs the network) | `nightly`; `monitor.yml` |
| 12 | No known advisory in any dependency, dev tools included | `npm audit` reports 0 | `nightly` |

Rows 7 to 12 run on a GitHub runner, without deploying, when the Check
workflow is run by hand on the branch. Do that before the working branch
moves ([section 3](#3-how-a-change-reaches-the-live-site), step 3).

| # | After the push | Proved by |
| --- | --- | --- |
| 13 | The gated deploy is green | Actions → "Deploy to GitHub Pages": the `gates` job and then `deploy` (`pages.yml`). The workflow file puts the gates at about twelve minutes. A red gate leaves the live site as it was |
| 14 | The live pages answer, carry the new stamp, and stay within the Lighthouse budgets | Actions → "Live monitor" → Run workflow (`monitor.yml`). It also runs every six hours |
| 15 | The live site passes the browser audit | `AUDIT_BASE=https://brvetr4ve1er.github.io/Numidea.tech npm run audit` (`scripts/audit.mjs`; the local-only runs are skipped) |
| 16 | The mirrors built the same commit | the Netlify and Vercel dashboards (owner); nothing in this repository watches them |

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
| Team photos; the "four specialists" claim | [§4](OWNER-CONTENT.md#4-team) | initials show; the claim stays until confirmed or corrected |
| A studio email on its own domain | [§5](OWNER-CONTENT.md#5-studio-email-on-its-own-domain) | `check.mjs` fails until every contact point uses one address |
| Clients' permission for paid ads | [§6](OWNER-CONTENT.md#6-clients-permission-for-paid-ads) | the campaign kit is not in this repository |
| Nomara Voyages: client or not | [§7](OWNER-CONTENT.md#7-nomara-voyages) | shown as delivered work |
| Arabic native review | [§8](OWNER-CONTENT.md#8-arabic-native-review) | the Arabic dictionary blocks carry a banner |
| Clients' own domains | [§9](OWNER-CONTENT.md#9-clients-own-domains) | the cards link the Netlify builds; `node scripts/verify-domains.mjs` says when a domain can replace one |
| Hub fan art rights | [§10](OWNER-CONTENT.md#10-hub-fan-art) | shown |
| Supabase lead store | [§11](OWNER-CONTENT.md#11-supabase-lead-store) | off; `check.mjs` refuses to switch it on without the legal page, the region and a new form note |
| Campaign kit and git history | [§12](OWNER-CONTENT.md#12-campaign-kit-and-this-repository) | see [section 8](#8-the-git-history) below |
| WorkspaceHQ: open source or not | [§13](OWNER-CONTENT.md#13-workspacehq-open-source) | the pages say the code is public, not open source |
| Claims only the owner can confirm | [§14](OWNER-CONTENT.md#14-claims-only-the-owner-can-confirm) | on the site until confirmed or corrected |

Then the one-time repository settings in [section 7](#7-settings-only-the-owner-can-change),
and the domain in [section 6](#6-domain-and-dns).

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
   - The timing gates (the throttled phone, desktop LCP) were set on a local
     machine. A runner can be slower, and if one of them fails there, step 5
     refuses every deploy until it is fixed. Here that failure costs nothing.
   - Re-run a timing gate that fails once before treating it as real (Re-run
     failed jobs).
4. Only when both jobs are green, fast-forward the working branch to that
   branch and push.
5. `pages.yml` runs `gates`: the invariants, validate, build-no-diff, then
   audit, sweep, vbugs and keys on Playwright's Chromium. Every gate runs even
   after one fails, so a red run lists everything that is wrong. `deploy`
   runs only when `gates` passed (`needs: gates`). It stages `_site/` and
   publishes it, and it is the only job with Pages write and OIDC token
   permissions.
6. Deploys run one at a time (`concurrency: pages`, never cancelled
   mid-flight). Newer pushes wait, and of those only the latest queued one
   runs.

Once branch protection is on ([section 7](#7-settings-only-the-owner-can-change)),
step 1 is required: the working branch accepts only a commit that has
already passed `check`.

## 4. Rollback

The site stores nothing: no cookies, no analytics, and the Supabase store is
off (README, `OWNER-CONTENT.md` §11). A rollback therefore only changes which
files are served.

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
   - A stamp behind the branch is only a warning while a Pages deploy is
     queued or running. Otherwise the error names the last Pages run and how
     it ended.
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
- CSP violations on the live site (run checklist step 15 by hand);
- anything between two six-hourly runs.

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
   scene/), and update the hand-written heads in `index.html`, `hub/`,
   `workspacehq/` and `robots.txt`.
   - `npm run check` names what still points at the old address: block 6
     checks the static canonicals; block 18 checks the `og:` URLs, the
     hreflang alternates against the sitemap, the `Sitemap:` line in
     `robots.txt` and the JSON-LD URLs.
   - `monitor.yml` reads the new address from `BASE`. `AUDIT_BASE` is given
     by hand.
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
