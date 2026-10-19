---
type: community
cohesion: 0.25
members: 9
---

# Technical Debt Register

**Cohesion:** 0.25 - loosely connected
**Members:** 9 nodes

## Members
- [[D-04 - package-lock.json was gitignored (non-reproducible installs)]] - concept - audit/Technical_Debt.md
- [[D-05 - README structure drift]] - concept - audit/Technical_Debt.md
- [[D-06 - Intentional CSS layering (hub RTL rule, premium-pass overrides)]] - concept - audit/Technical_Debt.md
- [[D-08 - No test suite]] - concept - audit/Technical_Debt.md
- [[Explicitly not recommended frameworkbundler, minification, test suite, stylesheet split]] - concept - audit/Improvement_Roadmap.md
- [[P-03 - Non-issues CSS 68 KB  JS 72 KB uncompressed]] - concept - audit/Performance_A11y.md
- [[Risk single-file JSCSS growth (~900 lines each)]] - concept - audit/Architecture.md
- [[Technical Debt Register (ranked)]] - document - audit/Technical_Debt.md
- [[package.json  package-lock.json (screenshot pipeline deps only)]] - concept - audit/Architecture.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Technical_Debt_Register
SORT file.name ASC
```

## Connections to other communities
- 3 edges to [[_COMMUNITY_i18n and Contact Flow]]
- 3 edges to [[_COMMUNITY_Audit Findings (Daylight, Hub)]]
- 2 edges to [[_COMMUNITY_Home Page Runtime (app.js)]]
- 2 edges to [[_COMMUNITY_package.json]]
- 2 edges to [[_COMMUNITY_Conventions Enforced by Tooling]]
- 2 edges to [[_COMMUNITY_Studio Overview and Tooling]]
- 1 edge to [[_COMMUNITY_check.mjs Repository Gate]]
- 1 edge to [[_COMMUNITY_Browser Audit and OG Build]]
- 1 edge to [[_COMMUNITY_Project Screenshot Capture]]
- 1 edge to [[_COMMUNITY_Menu and Scene Accessibility]]
- 1 edge to [[_COMMUNITY_Design Audit Diagnoses]]

## Top bridge nodes
- [[Technical Debt Register (ranked)]] - degree 9, connects to 4 communities
- [[P-03 - Non-issues CSS 68 KB  JS 72 KB uncompressed]] - degree 5, connects to 3 communities
- [[Explicitly not recommended frameworkbundler, minification, test suite, stylesheet split]] - degree 5, connects to 2 communities
- [[D-08 - No test suite]] - degree 5, connects to 2 communities
- [[D-04 - package-lock.json was gitignored (non-reproducible installs)]] - degree 4, connects to 2 communities