# Release audit — numidea.tech (2026-11-25, 21:45 UTC)

Read-only. Nothing was merged, deleted, deployed or reconfigured.

## 1. What is live (verified in Vercel)

- **Production = f32a749** from `claude/numidea-labs-landing-c4jokc`, published 21:38 UTC (dpl_4EruGTCVW2JmrQWRcQFtVbjh7dJa).
- It contains: wave 2, wave 3 (7aeb98b, includes the alliancetravel.app links), PR 19 (aesthetics), PR 22 (click tracking), PR 23 (console CSP fix), the four redrawn Lantern objects.
- Production history today: 15:36 ba7e1b3 (wave2-release) → 17:08 20686fb (PR 19) → 21:38 f32a749. Each a manual publish of a preview.
- Pushes to the working branch build **previews**, not production. So Vercel's configured "production branch" is not the working branch (not readable via the API here; check Settings → Git).

## 2. The real trunk

| Branch | Status |
|---|---|
| `claude/numidea-labs-landing-c4jokc` | **The trunk.** GitHub default branch, every merged PR targets it, production ships from it. |
| `main` | Retired. Fully contained in the trunk (0 unmerged commits), last touched 2026-10-07. *Correction 23:40 UTC: an earlier version said it shares no history; that came from a shallow clone.* |
| `master` | July 2025 Next.js prototype, separate history, 31 commits. Abandoned; archive as a tag. |
| `claude/wave2-release` | Superseded. Its console fix is in live; its 2 other commits only change a size number in `scripts/check.mjs`. |
| `claude/alliance-release`, `claude/alliance-real-domain` | Superseded by wave 3 (7aeb98b). PR 17 closed. |
| `claude/project-thread-5rclm4`, `-yirj4x`, `-ogl5jr` | Fully merged (PRs 23, 22, 19). |
| `claude/fix-fleets-wip` | Fully contained in the trunk (0 unmerged commits; the earlier "475" was the shallow-clone error). |
| `social-media-cmf2a` | Temp media for Postiz (2026-11-23). Not site code. |

## 3. Open PRs

| PR | Base | Behind trunk | Verdict |
|---|---|---|---|
| 20 Characters C1–C3 (draft) | trunk | 24 | Alive. Needs a merge from trunk before any preview. |
| 18 Alliance case + brand book (draft) | `claude/alliance-real-domain` (wrong base) | 27 | Retarget to trunk; its first commit (2c50a22) is redundant now. |
| 21 Vercel Web Analytics bot PR (draft) | trunk | 27 | Redundant with PR 22. Close. |
| 14 Banking course slice 1 (draft) | trunk | 58 | Stale 3 days. Decide: revive or close. |
| 15 LinkedIn visuals (draft) | **main** | 85 | Social assets, not site code. Doesn't belong in the site repo; close and keep files in project files. |
| 16, 11 Dependabot | trunk | 44 | Playwright 1.65 bump conflicts with the container's 1.63 browser. Close or ignore. |

## 4. One release line (proposal)

**Rule:** one trunk = `claude/numidea-labs-landing-c4jokc`. Every change is a PR into it. Production is only ever a publish of a trunk preview that passed `npm run verify`. No release branches, no publishing from side branches.

Steps (each needs your yes):

1. **Vercel:** set the production branch to the trunk with auto-publish to domains *off* (keeps manual publish, removes the trap where a push to `main` would ship a 7-week-old site).
2. **Kill `main` and `master`:** tag them `archive/main-2026-10-07` and `archive/master-2025-07`, then delete the branches.
3. **Delete superseded branches:** wave2-release, alliance-release, alliance-real-domain, project-thread-5rclm4, -yirj4x, -ogl5jr, the two dependabot branches.
4. **PRs:** close 21, 15, 16, 11; retarget 18 to trunk (drop 2c50a22); decide on 14.
5. **Optional, later:** rename the trunk to `main` once no thread is mid-push. Cleaner name, but it breaks every running session's branch reference, so not tonight.
6. Add a one-line `RELEASING.md` in the repo with the rule above, so every thread reads it.

## 5. Status at hand-off (2026-11-25 23:40 UTC)

Owner rule: this project does not publish; a separate session does publishing and repo handling. This thread took no further repo or Vercel actions after this point.

- **Done:** PRs 21, 15, 16, 11 closed with reasons; PR 18 retargeted to the trunk; one-trunk rule written as RELEASE.md section 0 in draft **PR 26** (`claude/project-thread-r84igh`, check.mjs passes, Vercel preview ready).
- **Not done (for the publishing session):** set Vercel production branch tracking to the trunk; then run `ops/delete-dead-branches.sh` (tags every branch `archive/<name>` before deleting; counts verified on a full clone); decide PR 14 and PR 26.
- **Gotcha:** cloud clones are shallow. Run `git fetch --unshallow` before any "is this branch merged" check.
- Live is still **f32a749**. Nothing was published by this thread.
