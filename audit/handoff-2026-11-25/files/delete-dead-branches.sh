#!/usr/bin/env bash
# One-trunk cleanup for Brvetr4ve1er/Numidea.tech (owner approved 2026-11-25).
# Fully reversible: every branch is tagged archive/<name> before it is deleted.
# To restore one:  git push origin archive/<name>:refs/heads/<name>
#
# Do this FIRST: set Vercel's production branch to claude/numidea-labs-landing-c4jokc
# (Settings > Environments > Production > Branch Tracking), then run this.
#
# Re-verified 2026-11-25 23:40 UTC on a FULL (unshallowed) clone, against the trunk
# claude/numidea-labs-landing-c4jokc @ f32a749. "Unmerged" = commits not on the trunk.
#
#   main                            0 unmerged  (fully inside the trunk; last 2026-10-07)
#   claude/fix-fleets-wip           0 unmerged  (fully inside the trunk; last 2026-11-10)
#   claude/project-thread-5rclm4    0 unmerged  (PR 23, merged)
#   claude/project-thread-yirj4x    0 unmerged  (PR 22, merged)
#   claude/wave2-release            3 unmerged  (console fix is on the trunk as an equal patch;
#                                                the other 2 only change a size number in scripts/check.mjs)
#   claude/alliance-release         4 unmerged  (the same 3 + the Alliance link change)
#   claude/alliance-real-domain     1 unmerged  (Alliance link change; the trunk already has it via
#                                                wave 3 7aeb98b: 0 site files still use the old netlify link)
#   vercel/install-vercel-web-analytics-i-uj1ar9   1 unmerged  (bot PR 21, closed; PR 22 did it properly)
#   dependabot/.../dev-dependencies-0574a99f48     1 unmerged  (PR 11, closed; package bump only)
#   master                          31 unmerged, NO shared history: the July 2025 Next.js
#                                   "StickyTech" prototype. Abandoned; kept as a tag.
#
# Not touched: the trunk, claude/project-thread-ogl5jr (aesthetics, active),
# -vm2rxf (PR 20), -j3qmb0 (PR 18), -a0zy0f (PR 14), -3x5f4n (social files),
# social-media-cmf2a (Postiz media), claude/project-thread-r84igh (PR 26).
set -euo pipefail

BRANCHES=(
  main master claude/fix-fleets-wip
  claude/wave2-release claude/alliance-release claude/alliance-real-domain
  claude/project-thread-5rclm4 claude/project-thread-yirj4x
  vercel/install-vercel-web-analytics-i-uj1ar9
  dependabot/npm_and_yarn/claude/numidea-labs-landing-c4jokc/dev-dependencies-0574a99f48
)

git fetch origin --prune

# 1. Archive every branch as a tag (nothing is lost)
TAGS=()
for b in "${BRANCHES[@]}"; do
  if git rev-parse -q --verify "refs/remotes/origin/$b" >/dev/null; then
    git tag -f "archive/$b" "origin/$b"
    TAGS+=("refs/tags/archive/$b")
  else
    echo "skip (already gone): $b"
  fi
done
git push origin "${TAGS[@]}"

# 2. Delete only the branches that now have an archive tag on the remote
for t in "${TAGS[@]}"; do
  b="${t#refs/tags/archive/}"
  git ls-remote --exit-code --tags origin "archive/$b" >/dev/null && git push origin --delete "$b"
done
echo "Done. Restore any branch with: git push origin archive/<name>:refs/heads/<name>"
