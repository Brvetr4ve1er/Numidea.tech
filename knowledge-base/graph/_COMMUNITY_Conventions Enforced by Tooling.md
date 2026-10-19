---
type: community
cohesion: 0.17
members: 18
---

# Conventions Enforced by Tooling

**Cohesion:** 0.17 - loosely connected
**Members:** 18 nodes

## Members
- [[v= cache stamps (npm run bump)]] - rationale - README.md
- [[Convention every asset reference carries v=stamp; bump all pages on change]] - concept - audit/Architecture.md
- [[Convention every data-i18n attribute resolves to a dictionary key]] - concept - audit/Architecture.md
- [[Convention every i18n key appears exactly 3x in app.js (frenar)]] - concept - audit/Architecture.md
- [[Conventions enforced by tooling (npm run check  npm run bump)]] - concept - audit/Executive_Summary.md
- [[D-01 - Conventions enforced by discipline, not tooling]] - concept - audit/Technical_Debt.md
- [[D-03 - Manual cache-bust stamps]] - concept - audit/Technical_Debt.md
- [[Headless-Chromium measured results]] - concept - audit/Performance_A11y.md
- [[ROOT_2]] - code - scripts/bump.mjs
- [[Verdict codebase fundamentally healthy]] - concept - audit/Executive_Summary.md
- [[bump]] - code - package.json
- [[bump.mjs]] - code - scripts/bump.mjs
- [[check]] - code - package.json
- [[missing]] - code - scripts/check.mjs
- [[orphans]] - code - scripts/check.mjs
- [[stamp]] - code - scripts/bump.mjs
- [[stamps]] - code - scripts/check.mjs
- [[unbalanced]] - code - scripts/check.mjs

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Conventions_Enforced_by_Tooling
SORT file.name ASC
```

## Connections to other communities
- 6 edges to [[_COMMUNITY_check.mjs Repository Gate]]
- 6 edges to [[_COMMUNITY_Audit Findings (Daylight, Hub)]]
- 4 edges to [[_COMMUNITY_Sitemap and Site Scope]]
- 3 edges to [[_COMMUNITY_i18n and Contact Flow]]
- 2 edges to [[_COMMUNITY_CI Check Workflow]]
- 2 edges to [[_COMMUNITY_Owner Items and Clients]]
- 2 edges to [[_COMMUNITY_Design System Summary]]
- 2 edges to [[_COMMUNITY_Technical Debt Register]]
- 1 edge to [[_COMMUNITY_Home Page Runtime (app.js)]]
- 1 edge to [[_COMMUNITY_Hosting and Security]]
- 1 edge to [[_COMMUNITY_Browser Audit and OG Build]]
- 1 edge to [[_COMMUNITY_Design Audit Diagnoses]]
- 1 edge to [[_COMMUNITY_Studio Overview and Tooling]]
- 1 edge to [[_COMMUNITY_Menu and Scene Accessibility]]

## Top bridge nodes
- [[check]] - degree 6, connects to 4 communities
- [[D-01 - Conventions enforced by discipline, not tooling]] - degree 11, connects to 3 communities
- [[Convention every i18n key appears exactly 3x in app.js (frenar)]] - degree 6, connects to 3 communities
- [[Conventions enforced by tooling (npm run check  npm run bump)]] - degree 10, connects to 2 communities
- [[bump.mjs]] - degree 10, connects to 2 communities