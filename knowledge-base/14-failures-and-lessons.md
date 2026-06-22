---
domain: 14 — Knowledge of Failures
status: partial
owner: Technical Rep (T) / Founders
last_updated: 2026-06-22
sources: [code audit, git history, session 2026-06-22]
tags: [failures, mistakes, lessons, never-again, bugs, debt]
---

# Domain 14 — Knowledge of Failures & Lessons

> The "never rediscover this" list. Captures real, verified defects and corrected
> mistakes — plus the structure to log future ones.

## KB-14-001 · 🔴 Contact form silently drops every lead (OPEN, critical)
- **What:** The contact form (`assets/app.js`) validates input and shows a designed
  success state but performs **no submission** (no POST, no email, no service). Code
  comment: "front-end demo."
- **Impact:** Every prospect who fills the form believes they've reached Numidea;
  **the message goes nowhere.** Direct revenue leak at the top of the funnel.
- **Lesson / never-again:** A "success" state must never be shown unless data was
  actually delivered. **Fix before any marketing push.** Add a real endpoint
  (Formspree/Netlify Forms/serverless + email) and only show success on a 2xx.
- `confidence: verified`. Status: **OPEN**.

## KB-14-002 · Misleading "Live" labels (FIXED 2026-06-22)
- **What:** 3 of 5 project cards displayed a "Live" pill + demo link, but only
  `almaflowclim.fr` actually resolved; the rest were `href="#"`.
- **Fix:** Honest "Soon" state for not-live projects; "Live" reserved for the truly
  live one (commit `7a68fab`).
- **Lesson:** Public claims must match reality — especially for a studio whose brand
  is "proof over promises." Audit marketing claims against ground truth.
- `confidence: verified`. Status: **RESOLVED**.

## KB-14-003 · Documentation drift — README vs Arcanum (OPEN, minor)
- **What:** `README.md` still documents "Neon Noir v2" as the design system after the
  Arcanum rebrand.
- **Lesson:** Update docs in the same change as the thing they describe. Schedule a
  README refresh.
- `confidence: verified`. Status: **OPEN**.

## KB-14-004 · Single-source-of-truth gaps (META)
- **What:** Real names, finances, contracts, customer data, competitor and channel
  data exist only as **tribal knowledge** — none captured before this KB.
- **Lesson:** Institutional memory must be written down continuously, not
  reconstructed under pressure. This KB is the remedy; keep it current.

## Template for future failure entries
```
### KB-14-NNN · <short title> (<OPEN|RESOLVED>, <severity>)
- What happened:
- Why it happened (root cause):
- Impact:
- Fix / mitigation:
- Lesson / never-again:
- confidence / status / date:
```

> 🔴 GAP: Pre-2026-06-22 failed campaigns/features/experiments/partnerships/market
> entries are undocumented. Reconstruct from founder memory while it's fresh.
