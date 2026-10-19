# CI Check Workflow

> 19 nodes · cohesion 0.16

## Key Concepts

- **scripts** (16 connections) — `package.json`
- **Verify gates (npm run verify)** (9 connections) — `README.md`
- **Check workflow (CI)** (6 connections) — `.github/workflows/check.yml`
- **Browser gates step (on demand)** (4 connections) — `.github/workflows/check.yml`
- **Invariants step (check + theme contract)** (4 connections) — `.github/workflows/check.yml`
- **Visual bug scan (npm run vbugs)** (4 connections) — `README.md`
- **HTML validation step** (3 connections) — `.github/workflows/check.yml`
- **audit** (3 connections) — `package.json`
- **sweep** (3 connections) — `package.json`
- **validate** (3 connections) — `package.json`
- **vbugs** (3 connections) — `package.json`
- **Browser audit (npm run audit)** (3 connections) — `README.md`
- **npm commands table** (3 connections) — `README.md`
- **Contrast sweep (npm run sweep)** (3 connections) — `README.md`
- **HTML validation (npm run validate)** (3 connections) — `README.md`
- **npm ci without browser download** (2 connections) — `.github/workflows/check.yml`
- **logos** (2 connections) — `package.json`
- **verify** (2 connections) — `package.json`
- **ALLOW** (2 connections) — `scripts/vbugs.mjs`

## Relationships

- [Browser Audit and OG Build](Browser_Audit_and_OG_Build.md) (4 shared connections)
- [Private Folders and Reviews](Private_Folders_and_Reviews.md) (3 shared connections)
- [Generated Pages and Voices](Generated_Pages_and_Voices.md) (3 shared connections)
- [Design System Summary](Design_System_Summary.md) (2 shared connections)
- [Conventions Enforced by Tooling](Conventions_Enforced_by_Tooling.md) (2 shared connections)
- [Sitemap and Site Scope](Sitemap_and_Site_Scope.md) (2 shared connections)
- [check.mjs Repository Gate](check.mjs_Repository_Gate.md) (1 shared connections)
- [Theme Token Contract](Theme_Token_Contract.md) (1 shared connections)
- [package.json](package.json.md) (1 shared connections)
- [Project Screenshot Capture](Project_Screenshot_Capture.md) (1 shared connections)
- [Pages Deploy Pipeline](Pages_Deploy_Pipeline.md) (1 shared connections)
- [Owner Items and Clients](Owner_Items_and_Clients.md) (1 shared connections)

## Source Files

- `.github/workflows/check.yml`
- `README.md`
- `package.json`
- `scripts/vbugs.mjs`

## Audit Trail

- EXTRACTED: 44 (88%)
- INFERRED: 6 (12%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*