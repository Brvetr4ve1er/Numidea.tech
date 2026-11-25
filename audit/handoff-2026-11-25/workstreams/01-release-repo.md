# 01 · Release line and repo cleanup

Thread: "Untangle release branches and PRs" (resolved; it stopped all repo/Vercel actions at 23:39 UTC).
Full source: `/mnt/project-files/ops/release-audit-2026-11-25.md` (read its section 5).

## Done [R, consistent with PR list V]
- PRs 21, 15, 16, 11 closed with reasons. PR 18 retargeted to the trunk.
- One-trunk rule written as RELEASE.md section 0 → draft PR #26 (docs only).
- `delete-dead-branches.sh` rewritten and re-verified on a FULL clone at 23:40 UTC: it tags every branch `archive/<name>`, pushes the tag, and only then deletes. Restore: `git push origin archive/<name>:refs/heads/<name>`.

## Left for you, in this order
1. Owner (or you, if you have dashboard access): Vercel → Settings → Environments → Production → Branch Tracking = `claude/numidea-labs-landing-c4jokc`. Recommended: keep auto-publish to domains off so publishing stays manual. Not settable via MCP.
2. Run `ops/delete-dead-branches.sh` from a full clone. Cloud sessions get 403 on deletes/tags, so this may need the owner's machine.
3. Merge PR #26.
4. Owner decides PR #14 (revive or close).
5. Optional later: rename the trunk to `main` once no session is mid-push (breaks every running branch reference; not urgent).

## Why the rule exists
2026-11-25: production went ba7e1b3 (from `claude/wave2-release`) → 20686fb (PR 19) → f32a749 (trunk). A release built on an older base nearly rolled PR 19 back. Since then: trunk only.

## Corrections already made (don't repeat them)
- The first audit claimed `main` "shares no history" and `fix-fleets-wip` had "475 unmerged commits". Both came from a shallow clone. On full history both have 0 unmerged commits. Only `master` is truly unrelated (31 commits, Next.js "StickyTech" prototype).
