---
domain: 08 — Marketing
status: scaffold
owner: Sales & Partnerships (S)
last_updated: 2026-06-22
sources: [index.html, README.md]
tags: [marketing, acquisition, channels, campaigns, content]
---

> **Historical snapshot (2026-06-22).** Not deployed. Where this file disagrees with README.md, BRAND.md or the code, those win. Current owner to-dos live in OWNER-CONTENT.md.

# Domain 8 — Marketing

## KB-08-001 · Known marketing assets (verified)
- **The landing page** itself (this repo) — primary marketing surface, trilingual,
  Arcanum brand, live on GitHub Pages.
- **OG/social share image** (`assets/og.svg`), favicon, brand voice (Domain 2).
  [2026-10: the share image is now `assets/og.jpg`, rendered by
  `scripts/build-og.mjs`; `og.svg`/`og.png` removed.]
- **The Preview offer** (Domain 5) — the central conversion mechanism / lead magnet.

## KB-08-002 · Acquisition (inferred)
Primary motion appears **relationship/referral + portfolio proof + the free Preview**.
Local network and the work itself are the implied top-of-funnel.

## KB-08-003 · Instrumentation (verified — and a problem)
- 🔴 **No analytics/tracking installed** on the site (no GA/Plausible/etc.).
- ✅ **Contact form now delivers leads** via `mailto:` handoff (fixed 2026-06-22 —
  Domain 7/14). Residual: no server-side capture and **no conversion measurement**
  yet, so the funnel is functional but still **unmeasured**.
  [2026-10: the mailto now carries the lead source (`?ref`, `utm_*` and whether
  `fbclid`/`gclid` were present), read at send time; nothing is stored.]

> 🔴 SCAFFOLD: No documented acquisition channels, paid performance, social presence,
> CRM, email/push, referral program, or influencer activity. Historical campaign
> archive is empty.
> [2026-10: the campaign kit (`campaign/`) is kept outside the public repository.]

## Campaign archive template (one block per campaign)
```
### <Campaign name> — <date>
- Objective / Audience:
- Channel(s) / Creative assets:
- Budget / Spend:
- Results (vs objective):
- Lessons learned:
- Sources / confidence:
```

> **Owner questions / first actions:** (1) Add privacy-respecting analytics. (2) Make
> the contact form actually deliver leads + measure conversion. (3) Document where
> your last 5 clients actually came from (channel attribution).
