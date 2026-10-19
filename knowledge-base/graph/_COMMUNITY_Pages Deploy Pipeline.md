---
type: community
cohesion: 0.20
members: 15
---

# Pages Deploy Pipeline

**Cohesion:** 0.20 - loosely connected
**Members:** 15 nodes

## Members
- [[Check repository invariants step]] - code - .github/workflows/pages.yml
- [[Configure, upload and deploy Pages artifact]] - code - .github/workflows/pages.yml
- [[DEPLOY (graph)]] - code - scripts/site.mjs
- [[DEPLOY_SKIP]] - code - scripts/site.mjs
- [[Deploy to GitHub Pages workflow]] - code - .github/workflows/pages.yml
- [[GitHub Pages canonical deploy]] - rationale - README.md
- [[Netlify and Vercel mirrors]] - concept - README.md
- [[OUT_2]] - code - scripts/stage-site.mjs
- [[Pages concurrency group (no cancel-in-progress)]] - rationale - .github/workflows/pages.yml
- [[Stage publishable files into _site]] - code - .github/workflows/pages.yml
- [[Working branch claudenumidea-labs-landing-c4jokc]] - concept - .github/workflows/pages.yml
- [[_site (staged deploy folder)]] - code - README.md
- [[missing_1]] - code - scripts/stage-site.mjs
- [[stage]] - code - package.json
- [[stage-site.mjs]] - code - scripts/stage-site.mjs

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Pages_Deploy_Pipeline
SORT file.name ASC
```

## Connections to other communities
- 7 edges to [[_COMMUNITY_Hosting and Security]]
- 5 edges to [[_COMMUNITY_Sitemap and Site Scope]]
- 3 edges to [[_COMMUNITY_check.mjs Repository Gate]]
- 3 edges to [[_COMMUNITY_Private Folders and Reviews]]
- 2 edges to [[_COMMUNITY_Browser Audit and OG Build]]
- 2 edges to [[_COMMUNITY_Legal Page Generator]]
- 2 edges to [[_COMMUNITY_Design System Summary]]
- 1 edge to [[_COMMUNITY_CI Check Workflow]]
- 1 edge to [[_COMMUNITY_Products and Operations (2026-06)]]
- 1 edge to [[_COMMUNITY_Theme Token Contract]]
- 1 edge to [[_COMMUNITY_Legal Data and Privacy]]

## Top bridge nodes
- [[stage-site.mjs]] - degree 15, connects to 4 communities
- [[DEPLOY (graph)]] - degree 8, connects to 4 communities
- [[GitHub Pages canonical deploy]] - degree 9, connects to 3 communities
- [[DEPLOY_SKIP]] - degree 4, connects to 3 communities
- [[Check repository invariants step]] - degree 4, connects to 2 communities