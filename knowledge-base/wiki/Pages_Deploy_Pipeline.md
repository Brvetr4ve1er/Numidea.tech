# Pages Deploy Pipeline

> 15 nodes · cohesion 0.20

## Key Concepts

- **stage-site.mjs** (15 connections) — `scripts/stage-site.mjs`
- **GitHub Pages canonical deploy** (9 connections) — `README.md`
- **Deploy to GitHub Pages workflow** (8 connections) — `.github/workflows/pages.yml`
- **DEPLOY** (8 connections) — `scripts/site.mjs`
- **Stage publishable files into _site/** (5 connections) — `.github/workflows/pages.yml`
- **_site/ (staged deploy folder)** (5 connections) — `README.md`
- **Check repository invariants step** (4 connections) — `.github/workflows/pages.yml`
- **Netlify and Vercel mirrors** (4 connections) — `README.md`
- **DEPLOY_SKIP** (4 connections) — `scripts/site.mjs`
- **Configure, upload and deploy Pages artifact** (2 connections) — `.github/workflows/pages.yml`
- **stage** (2 connections) — `package.json`
- **Pages concurrency group (no cancel-in-progress)** (1 connections) — `.github/workflows/pages.yml`
- **Working branch claude/numidea-labs-landing-c4jokc** (1 connections) — `.github/workflows/pages.yml`
- **missing** (1 connections) — `scripts/stage-site.mjs`
- **OUT** (1 connections) — `scripts/stage-site.mjs`

## Relationships

- [Hosting and Security](Hosting_and_Security.md) (7 shared connections)
- [Sitemap and Site Scope](Sitemap_and_Site_Scope.md) (5 shared connections)
- [check.mjs Repository Gate](check.mjs_Repository_Gate.md) (3 shared connections)
- [Private Folders and Reviews](Private_Folders_and_Reviews.md) (3 shared connections)
- [Design System Summary](Design_System_Summary.md) (2 shared connections)
- [Legal Page Generator](Legal_Page_Generator.md) (2 shared connections)
- [Browser Audit and OG Build](Browser_Audit_and_OG_Build.md) (2 shared connections)
- [Theme Token Contract](Theme_Token_Contract.md) (1 shared connections)
- [CI Check Workflow](CI_Check_Workflow.md) (1 shared connections)
- [Legal Data and Privacy](Legal_Data_and_Privacy.md) (1 shared connections)
- [Products and Operations (2026-06)](Products_and_Operations_2026-06.md) (1 shared connections)

## Source Files

- `.github/workflows/pages.yml`
- `README.md`
- `package.json`
- `scripts/site.mjs`
- `scripts/stage-site.mjs`

## Audit Trail

- EXTRACTED: 47 (96%)
- INFERRED: 2 (4%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*