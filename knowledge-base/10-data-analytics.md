---
domain: 10 — Data & Analytics
status: partial
owner: Data Specialist (D)
last_updated: 2026-06-22
sources: [index.html (stats), assets/app.js]
tags: [kpi, metrics, analytics, instrumentation]
---

> **Historical snapshot (2026-06-22).** Not deployed. Where this file disagrees with README.md, BRAND.md or the code, those win. Current owner to-dos live in OWNER-CONTENT.md.

# Domain 10 — Data & Analytics

## KB-10-001 · Metrics that appear publicly (verified as *claims*)
| Metric | Value | Where | Note |
| --- | --- | --- | --- |
| Uptime | 99.9% | hero "deploy" widget | Illustrative/aspirational |
| TTFB | 38 ms | hero widget | Illustrative |
| Lighthouse | 100 | hero widget | Quality target |
| Leads enriched | 54 | service f4 stat | Real project stat |
| Requests analyzed | 544,634 | service f5 stat | Schengen audit (Alliance Travel) |
| Visa refusal rate | 35% | service f5 stat | Market-audit finding |

> These are **marketing-surface numbers**. Treat the hero widget values as
> illustrative; the f4/f5 stats are tied to real project analysis. `confidence:
> verified (as displayed claims)`.
> [2026-10: the hero deploy widget has been removed.]

## KB-10-002 · Instrumentation status (verified)
- 🔴 **No web analytics installed.** No product/marketing telemetry on the site.
- 🟡 **Lead capture works but is unmeasured.** The form now delivers via `mailto:`
  (fixed 2026-06-22), but there is no server-side capture or conversion tracking, so
  funnel/conversion data still cannot be computed.
  [2026-10: the mailto now carries the lead source (`?ref`, `utm_*` and whether
  `fbclid`/`gclid` were present), read at send time; nothing is stored.]

## KB-10-003 · Internal metrics capability (verified)
The team *can* build measurement (Family II/III: pipelines, dashboards, data science,
forecasting) — they offer it as a service. The gap is **applying it to themselves.**

> 🔴 GAP: No North Star metric, no KPI tree, no dashboards, no A/B tests, no cohort
> analyses, no financial/operational metrics documented. **Owner action:** define a
> North Star (e.g., Previews→paid conversion, or monthly shipped projects) and
> instrument the site + lead funnel first.
