# i18n and Contact Flow

> 22 nodes · cohesion 0.13

## Key Concepts

- **Architecture & Repository Map (audit 2026-07-31)** (30 connections) — `audit/Architecture.md`
- **Improvement Roadmap (audit 2026-07-31)** (15 connections) — `audit/Improvement_Roadmap.md`
- **applyLang()** (8 connections) — `assets/app.js`
- **Contact form flow (validation -> optional Supabase insert -> mailto)** (7 connections) — `audit/Architecture.md`
- **Trilingual i18n engine (FR/EN/AR dictionaries)** (6 connections) — `audit/Architecture.md`
- **Publishable anon key + insert-only RLS design (no SELECT policy)** (6 connections) — `audit/Security_Privacy.md`
- **P-01 - Font payload is 5 families (IBM Plex Sans Arabic for every visitor)** (5 connections) — `audit/Performance_A11y.md`
- **Convention: new features no-op gracefully when config is absent (Supabase pattern)** (4 connections) — `audit/Architecture.md`
- **Open Graph share image (og.svg -> og.jpg)** (4 connections) — `audit/Architecture.md`
- **S-03 - Residual notes (public CV/email, mailto handoff)** (4 connections) — `audit/Security_Privacy.md`
- **Fail-open init (try/catch reveals all content)** (3 connections) — `audit/Architecture.md`
- **Decision: Supabase leads store (numidea-labs-leads, insert-only RLS)** (3 connections) — `audit/Improvement_Roadmap.md`
- **FAQ Structured Data (ld-faq)** (3 connections) — `index.html`
- **I18N** (2 connections) — `index.html`
- **leadSource()** (2 connections) — `assets/app.js`
- **Designed not-found page (404.html)** (2 connections) — `audit/Architecture.md`
- **Founder resume PDF (cv_yasser_hamisse_2026.pdf)** (2 connections) — `audit/Architecture.md`
- **Landing page (index.html)** (2 connections) — `audit/Architecture.md`
- **Risk: deploy branch is a claude/... working branch** (2 connections) — `audit/Architecture.md`
- **Branch rename claude/... -> main** (2 connections) — `audit/Improvement_Roadmap.md`
- **Owner standing directives (no visual hiccups; all deployments on Netlify; real hub links)** (2 connections) — `audit/Improvement_Roadmap.md`
- **Organization/LocalBusiness JSON-LD (alongside FAQ schema)** (1 connections) — `audit/Improvement_Roadmap.md`

## Relationships

- [Hosting and Security](Hosting_and_Security.md) (11 shared connections)
- [Home Page Runtime (app.js)](Home_Page_Runtime_app.js.md) (8 shared connections)
- [Audit Findings (Daylight, Hub)](Audit_Findings_Daylight,_Hub.md) (7 shared connections)
- [Menu and Scene Accessibility](Menu_and_Scene_Accessibility.md) (6 shared connections)
- [Design Audit Diagnoses](Design_Audit_Diagnoses.md) (5 shared connections)
- [Project Screenshot Capture](Project_Screenshot_Capture.md) (3 shared connections)
- [Conventions Enforced by Tooling](Conventions_Enforced_by_Tooling.md) (3 shared connections)
- [Technical Debt Register](Technical_Debt_Register.md) (3 shared connections)
- [Market Chart and Visuals](Market_Chart_and_Visuals.md) (2 shared connections)
- [French Baking (build-fr)](French_Baking_build-fr.md) (2 shared connections)
- [Navigation and Language Switch](Navigation_and_Language_Switch.md) (1 shared connections)
- [Theme Token Contract](Theme_Token_Contract.md) (1 shared connections)

## Source Files

- `assets/app.js`
- `audit/Architecture.md`
- `audit/Improvement_Roadmap.md`
- `audit/Performance_A11y.md`
- `audit/Security_Privacy.md`
- `index.html`

## Audit Trail

- EXTRACTED: 70 (82%)
- INFERRED: 14 (16%)
- AMBIGUOUS: 1 (1%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*