# Architecture & Repository Map (audit 2026-07-31)

> God node · 30 connections · `audit/Architecture.md`

**Community:** [i18n and Contact Flow](i18n_and_Contact_Flow.md)

## Connections by Relation

### cites
- [Executive Summary - full codebase audit (2026-07-31, commit a9fd6da)](Executive_Summary_-_full_codebase_audit_2026-07-31,_commit_a9fd6da.md) `EXTRACTED`
- D-02 - Project data is quadruplicated `EXTRACTED`

### references
- Project-explorer modal (#/work/<slug> hash router) `EXTRACTED`
- GitHub Pages deploy workflow (pages.yml) `EXTRACTED`
- Hosting topology: GitHub Pages canonical, Netlify/Vercel mirrors `EXTRACTED`
- Contact form flow (validation -> optional Supabase insert -> mailto) `EXTRACTED`
- scene/ - engineering-drawing project showcase `EXTRACTED`
- Offline screenshot-capture pipeline (Playwright + sharp) `EXTRACTED`
- Zero-dependency trilingual static marketing site `EXTRACTED`
- Convention: honest statuses (no fake screenshots; explicit soon/pending states) `EXTRACTED`
- Convention: every i18n key appears exactly 3x in app.js (fr/en/ar) `EXTRACTED`
- hub/ - VOIDSPLUNKER.std personal portfolio subsite `EXTRACTED`
- Trilingual i18n engine (FR/EN/AR dictionaries) `EXTRACTED`
- Theme switcher / theme set `EXTRACTED`
- Convention: every asset reference carries ?v=<stamp>; bump all pages on change `EXTRACTED`
- Convention: new features no-op gracefully when config is absent (Supabase pattern) `EXTRACTED`
- Design-token system (every rule reads var(--token)) `EXTRACTED`
- localStorage coupling (numidea-lang / numidea-theme shared by / and /scene/) `EXTRACTED`
- Open Graph share image (og.svg -> og.jpg) `EXTRACTED`
- Committed client-site preview screenshots (assets/previews/*.webp) `EXTRACTED`
- Vercel-ready hosting config (vercel.json) `EXTRACTED`
- Convention: every data-i18n* attribute resolves to a dictionary key `EXTRACTED`
- *…and 8 more `references` connection(s) not listed (lowest-degree first to go)*

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*