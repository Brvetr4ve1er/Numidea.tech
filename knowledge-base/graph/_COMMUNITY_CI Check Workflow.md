---
type: community
cohesion: 0.16
members: 19
---

# CI Check Workflow

**Cohesion:** 0.16 - loosely connected
**Members:** 19 nodes

## Members
- [[ALLOW]] - code - scripts/vbugs.mjs
- [[Browser audit (npm run audit)]] - code - README.md
- [[Browser gates step (on demand)]] - code - .github/workflows/check.yml
- [[Check workflow (CI)]] - code - .github/workflows/check.yml
- [[Contrast sweep (npm run sweep)]] - code - README.md
- [[HTML validation (npm run validate)]] - code - README.md
- [[HTML validation step]] - code - .github/workflows/check.yml
- [[Invariants step (check + theme contract)]] - code - .github/workflows/check.yml
- [[Verify gates (npm run verify)]] - rationale - README.md
- [[Visual bug scan (npm run vbugs)]] - code - README.md
- [[audit]] - code - package.json
- [[logos]] - code - package.json
- [[npm ci without browser download]] - code - .github/workflows/check.yml
- [[npm commands table]] - code - README.md
- [[scripts]] - code - package.json
- [[sweep]] - code - package.json
- [[validate]] - code - package.json
- [[vbugs]] - code - package.json
- [[verify]] - code - package.json

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/CI_Check_Workflow
SORT file.name ASC
```

## Connections to other communities
- 4 edges to [[_COMMUNITY_Browser Audit and OG Build]]
- 3 edges to [[_COMMUNITY_Generated Pages and Voices]]
- 3 edges to [[_COMMUNITY_Private Folders and Reviews]]
- 2 edges to [[_COMMUNITY_Conventions Enforced by Tooling]]
- 2 edges to [[_COMMUNITY_Sitemap and Site Scope]]
- 2 edges to [[_COMMUNITY_Design System Summary]]
- 1 edge to [[_COMMUNITY_check.mjs Repository Gate]]
- 1 edge to [[_COMMUNITY_package.json]]
- 1 edge to [[_COMMUNITY_Project Screenshot Capture]]
- 1 edge to [[_COMMUNITY_Pages Deploy Pipeline]]
- 1 edge to [[_COMMUNITY_Owner Items and Clients]]
- 1 edge to [[_COMMUNITY_Theme Token Contract]]

## Top bridge nodes
- [[scripts]] - degree 16, connects to 6 communities
- [[Invariants step (check + theme contract)]] - degree 4, connects to 3 communities
- [[Verify gates (npm run verify)]] - degree 9, connects to 2 communities
- [[Check workflow (CI)]] - degree 6, connects to 1 community
- [[Visual bug scan (npm run vbugs)]] - degree 4, connects to 1 community