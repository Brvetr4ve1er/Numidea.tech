---
domain: 07 — Operations
status: partial
owner: Technical Rep (T)
last_updated: 2026-06-22
sources: [index.html, README.md, assets/app.js, .github/workflows/pages.yml, scripts/shots.mjs]
tags: [operations, delivery, sop, deploy, support, incident, risk]
---

# Domain 7 — Operations

## KB-07-001 · Delivery model (verified)
**One team owns the whole chain: design → code → deploy.** The person who scopes the
work ships it. Post-launch support is a promise ("we answer when it breaks," replies
< 24h). No internal handoffs by design.

## KB-07-002 · Engineering operations (verified, this repo)
- **Source control:** Git/GitHub. Feature branch for the landing page:
  `claude/numidea-labs-landing-c4jokc`.
- **CI/CD:** `.github/workflows/pages.yml` auto-deploys to **GitHub Pages** on push.
  Live URL: `https://brvetr4ve1er.github.io/Numidea.tech/`. One-time setup: repo
  Settings → Pages → Source: GitHub Actions.
- **Deploy verification:** check the latest `pages.yml` workflow run is
  `completed/success` before declaring a change live (standard practice this session).
- **Asset pipeline:** `npm run shots` (Playwright + sharp) captures project
  screenshots at 1280×800 retina → optimized WebP. `node_modules` git-ignored; only
  `.webp` committed.

## KB-07-003 · Quality bar (verified)
Zero-dependency static build; target **100 Lighthouse**; accessibility (skip link,
focus rings, keyboard order, semantic landmarks, `prefers-reduced-motion`); "one
flourish per screen, then discipline."

## KB-07-004 · Operational risks (verified/inferred)
- 🔴 **Contact form does not deliver leads.** `assets/app.js` validates and shows a
  success state but performs **no POST/email** ("front-end demo"). Any lead submitted
  is **silently lost**. *Highest-priority operational defect.* `confidence: verified`.
- **Bus factor / capacity:** 4 people own everything; single points of failure per
  function. `confidence: inferred`.
- **Scraping dependency:** intelligence products depend on third-party sites
  (Maps/Facebook/Instagram/Ouedkniss/Jumia) whose structure/ToS can change.
- **Doc drift:** README still describes "Neon Noir" post-Arcanum (Domain 2).

## KB-07-005 · SOPs / playbooks
> 🔴 GAP: No written SOPs for client onboarding, incident management, escalation,
> market-launch, or QA beyond the engineering practices above. **Owner action:**
> formalize: (1) lead intake & response, (2) scoping → Preview, (3) build checklist,
> (4) launch checklist, (5) post-launch support/incident path.
