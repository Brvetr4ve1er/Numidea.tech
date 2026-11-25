# Numidea Labs: handoff to the publishing session

Snapshot: **2026-11-25 23:45 UTC (00:45 Paris, 26 Nov)**. Written by the "Package project handoff" thread of the Claude project "Numidea Labs landing page".

**The rule that created this file:** the owner (Br4ve, GitHub `Brvetr4ve1er`) decided that the project does not publish. It produces drafts, previews, canvases and files. **You, the publishing session, do all merging, deploying, repo cleanup and settings changes.** Nothing below has been published unless it says "live".

Tags used throughout:
- **[V]**: verified by this thread against GitHub or Vercel at the snapshot time.
- **[R]**: reported by a worker thread and not re-checked here. Re-verify before you act on it.

Also in the repo: draft PR [#27](https://github.com/Brvetr4ve1er/Numidea.tech/pull/27), folder `audit/handoff-2026-11-25/` (same content, frozen at this snapshot).

Files in this folder:
- `HANDOFF.md`: this file. Read it first.
- `INDEX.md`: every PR, branch, preview, canvas, doc and asset folder, with links.
- `RULES.md`: the owner's standing rules and art direction. Follow them as if the owner said them to you.
- `workstreams/01-release-repo.md` to `workstreams/06-finished.md`: detail per workstream.

---

## 1. What is live [V]

| | |
|---|---|
| Site | https://www.numedialab.dev/ (apex redirects to www). `numidea.tech` is **not** attached to Vercel. |
| Vercel | team `br4vetravelers-projects` (`team_UkgaYAHaeEAwabVQAOE0Q0Qh`), project `numidea-tech` (`prj_0iqOV9qSeEnwmKlEjJgUvSFnyPJn`) |
| Production deployment | `dpl_4EruGTCVW2JmrQWRcQFtVbjh7dJa`, commit **f32a749**, branch `claude/numidea-labs-landing-c4jokc`, created 2026-11-25 21:38 UTC |
| Trunk head | `claude/numidea-labs-landing-c4jokc` = **f32a749** too. The trunk and live are identical. |
| Repo | `Brvetr4ve1er/Numidea.tech`. GitHub's default branch is the trunk above. |

f32a749 contains [R, consistent with the commit log]: wave 2, wave 3 (including alliancetravel.app links, 7aeb98b), PR 19 (aesthetics: device-framed hero and work, hand-drawn Tree of Knowledge), PR 22 (Vercel Web Analytics and contact-click counting), PR 23 (WorkspaceHQ console CSP fix), and the four redrawn Lantern objects.

Rollback candidates [V]: `dpl_AfqYsxoFHQYQosjqJwKwu6ecosDY` (20686fb, PR 19 merge) and `dpl_EpeQw2CzXsKjcxAW2whPEMENV6As` (ba7e1b3, wave2-release, older line; avoid it).

---

## 2. Ready or nearly ready to publish, in recommended order

Open PRs [V] (all drafts, all based on the trunk):

| Order | PR | What | State | Do this |
|---|---|---|---|---|
| 1 | [#26](https://github.com/Brvetr4ve1er/Numidea.tech/pull/26) `claude/project-thread-r84igh` @ cbe6e8b | RELEASE.md section 0: the one-trunk rule | Docs only, on f32a749. [R] check passes, preview ready | Merge first. It changes no published file (RELEASE.md is in NOT_DEPLOYED). |
| 2 | [#24](https://github.com/Brvetr4ve1er/Numidea.tech/pull/24) `claude/project-thread-ogl5jr` @ 5ecaa7b | 3D atlas books on the Lanterne shelf, plus the new type system and the shelf rebuilt on it | On f32a749. [R] gates passed on f9ce984; the 5ecaa7b type commit was pushed at 23:39 UTC and its gates were still running | **Thread still active.** Wait for the owner's verdict on the type-system shelf, then run gates on the final head. See `workstreams/02`. |
| 3 | [#18](https://github.com/Brvetr4ve1er/Numidea.tech/pull/18) `claude/project-thread-j3qmb0` @ f328fdc | Alliance Travel case in five chapters, six mockups, 14-plate brand book, social kit | Retargeted to the trunk on 11-25 [V base]. [R] its first commit 2c50a22 is now redundant. Audit was 139/141 on 11-24, with the 2 failures in WorkspaceHQ (since fixed by PR 23) | Merge the trunk in, rerun verify, owner looks at the preview, publish. Two owner questions are still open (see `workstreams/04`). |
| 4 | [#20](https://github.com/Brvetr4ve1er/Numidea.tech/pull/20) `claude/project-thread-vm2rxf` @ 17b86e3 | Characters C1 to C3: canon Yasser and Kūro, drawn turnaround, "Talk to Yasser" box with `api/yasser.js` | **Stale base** (702b008, about 24 commits behind), mergeable state dirty [R] | Merge or rebase the trunk in, rerun verify. The talk box needs the owner's `ANTHROPIC_API_KEY` in Vercel plus a spend cap before it does anything live. See `workstreams/03`. |
| — | [#14](https://github.com/Brvetr4ve1er/Numidea.tech/pull/14) `claude/project-thread-a0zy0f` @ dc26b39 | Online banking course slice 1 (hub/banque.html), from an older project | Untouched since 2026-11-22, very stale base | **Owner decision needed:** revive or close. Arabic copy needs a native reader. |

Never publish from a side branch. The safe path is: PR into the trunk, Vercel preview of the trunk, `npm run verify`, then publish that exact deployment. That rule exists because a side-branch release nearly rolled back PR 19 on 2026-11-25.

---

## 3. In progress at snapshot time (moving)

1. **Typography / gaming-anime UI type system** (thread "Rebuild typography for a gaming anime look"). Owner called the current type and layout "mediocre", "1-dimensional", and "a cheap knock-off of a real anime website". The thread wrote a type system (4 roles, one scale) and rebuilt the Lanterne shelf on it in PR #24 (5ecaa7b). Spec: https://claude.ai/artifact/BrvX62HC49TTPheF3Yiwhw. Roll-out to the rest of the site waits on the owner's OK on the shelf. Its own notes: `/mnt/project-files/aesthetics/HANDOFF.md`.
2. **Characters: intro and navigation menu** (thread "Improve artworks, characters and mascot animations"). Menu v2 (collage of six tilted cards around a full-body Yasser, cursor-mesh background) is on the Claude Design canvas. The owner said at 23:39 UTC "I like it more like this now, do the animation rules, motion effects and easings, and get it ready for publishing". The thread is now locking motion tokens and building a **site-ready plain HTML/CSS/JS version**. Its own notes: `/mnt/project-files/characters/STATE.md`. Expect a site-ready package to appear in `/mnt/project-files/characters/` after this snapshot.

Re-read both of those files when you start. They will be newer than this one.

---

## 4. Blocked on the owner (only they can do these)

| # | What | Where | Why it matters |
|---|---|---|---|
| 1 | Set Vercel production branch tracking to `claude/numidea-labs-landing-c4jokc` | [Vercel settings → Environments → Production → Branch Tracking](https://vercel.com/br4vetravelers-projects/numidea-tech/settings/environments). Not exposed via the API/MCP. | [R] Pushes to the trunk build previews, not production, which suggests production tracks another branch (probably `main`). Do this **before** step 2. |
| 2 | Run `ops/delete-dead-branches.sh` | `/mnt/project-files/handoff/files/delete-dead-branches.sh` (copy) | Cloud sessions get 403 on branch deletes and tag pushes. The script tags every branch `archive/<name>` first, then deletes. Fully reversible. |
| 3 | `ANTHROPIC_API_KEY` in Vercel env + a Console spend limit | Vercel project env | Only needed if the PR #20 talk box ships. Without it the box plays an offline line. Never handle the key yourself. |
| 4 | Search Console: add a **Domain** property for `numedialab.dev`, resubmit the sitemap | Google Search Console | Current property is URL-prefix non-www, so it shows 0 impressions. |
| 5 | Verdicts: type-system shelf (PR 24), Menu v2 cards and mesh visibility, PR 14 revive-or-close, PR 18's two questions | the owner | Gates the order in section 2. |
| 6 | Magnific: 28 rig-frame generators queued in the owner's "Numidea" space, not run | Magnific app (runs free there; via MCP it costs credits) | Feeds missing poses (second pose per gesture, one pose per menu section, side/back views). |

---

## 5. Known risks and gotchas

1. **Vercel production branch is probably not the trunk** [R]. Until #1 above is done, a merge into `main` could ship a 7-week-old site. Publish only by redeploying a verified trunk preview to production.
2. **`request_promote` returns 422** on previews [R]. What has worked: Vercel `create_deployment` with `deploymentId` of the verified preview and `target: "production"`. It needs the owner's explicit go.
3. **GitHub Actions is locked on billing** since 2026-10-25 [R]. A red `check` within ~3 s is that, not the diff. Run the gates locally: `npm ci`, then `npm run verify` (11 gates, about 1 h). In cloud containers, run gates one by one with `timeout`; `keys` page by page (`node scripts/keys.mjs <page>`).
4. **Asset budget:** every byte added to the published set must raise `TOTAL` in `scripts/check.mjs` by the measured amount, with a dated note, or the Vercel build fails. Every multi-PR merge conflicts on this line. Re-measure, don't hand-merge numbers.
5. **Cache-bust stamps:** `npm run bump` must stamp every page including root pages, or Vercel fails with "cache-bust stamps diverge" (bit PR 24 once).
6. **Shallow clones:** cloud clones are cut at 2026-11-16. Run `git fetch --unshallow` before any "is this branch merged" check (this produced a wrong audit once).
7. **Another session also pushes to the trunk**: `session_01TKjpKS8z4yQPZgiqdcfyuF` (the original site session, waves 2 and 3, the Lantern objects). Check the trunk head right before you merge or publish.
8. **Live site is not reachable by curl from cloud containers** (proxy 403). Use Vercel `web_fetch_vercel_url` for live checks.
9. **Playwright:** the lockfile pins 1.61 while cloud containers ship 1.63. Symlink `node_modules/playwright` to the preinstalled global one. That's why Dependabot bumps were closed.
10. **Naming rule enforced by check.mjs:** never name the image tool or model (e.g. "Magnific", model names) anywhere under `hub/`.
11. **Arabic copy** in PRs 14, 18 and the Lantern objects is flagged for a native reader before or after publish.
12. **Menu as the home intro** [R, the characters thread's own warning]: about 3 s before content and six fanned cards don't fit 390 px. Recommended: play once per visitor with a skip, stacked cards on mobile. Not built yet.

---

## 6. Standing rules (short version, full list in RULES.md)

- One trunk, `claude/numidea-labs-landing-c4jokc`. Every change by PR into it. `main` is retired. Never target it.
- Every change: Vercel preview, `npm run verify`, then publish, with the owner's go.
- Copy is French-first (FR/EN/AR).
- Yasser (the founder, who is the owner) appears only as artwork or animation, never a photo.
- Zero Magnific credits (about 237 left). Stock costs 40 per item too.
- Gaming/anime art direction, carried through UI and a real typographic system. Take the grammar of game references, not their skin.
- Nomara Voyages stays listed. Alliance links to alliancetravel.app. Other clients keep their netlify links.
- The owner likes blunt, prioritized feedback.

---

## 7. Scheduled task

"Weekly site health check", Mondays 08:00 Europe/Paris, lives in the Claude project and posts a summary there. It changes nothing. It is not your concern unless the owner moves it.
