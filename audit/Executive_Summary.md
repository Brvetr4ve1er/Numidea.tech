# Executive Summary — full codebase audit

*2026-07-31 · commit `a9fd6da` · every file read; every claim verified by
static analysis or headless-browser measurement. Index of reports below.*

## Verdict

The codebase is **fundamentally healthy**: a disciplined zero-dependency static
site with a real token-based design system, a trilingual i18n engine whose
invariants held under audit (every key ×3, no orphans), honest content states,
strong baseline accessibility, and no security exposure in code. Zero JS errors
and zero layout overflow across 14 page/viewport/theme/language combinations.

## What the audit found

- **3 real visual bugs, all in the Daylight theme** — hard-coded light-gray text
  (incl. one reference to a token that doesn't exist) renders the hero lede,
  founder bio and the two "soon" project covers unreadable (~1.35:1 contrast).
  The other four themes were unaffected. **Fixed.**
- **1 stale fact**: the services proof line still cited `almaflowclim.fr`
  (corrected everywhere else months ago). **Fixed** in all three languages.
- **20 dead links** in the hub footer duplicating real links that already exist
  60 lines up, plus a listing for a dead service. **Fixed.**
- **Sharing was silently broken**: relative-URL SVG `og:image` — no social
  platform renders it. **Fixed** (absolute 1200×630 PNG).
- **404 page broke for nested URLs** on GitHub Pages. **Fixed** (host-aware).
- Small: 6th mobile-menu link skipped the stagger; scene arrow keys ignored
  RTL. **Fixed.**
- **1 owner decision flagged, untouched**: the internal `knowledge-base/`
  (market intel, decision history, failure log) is publicly deployed —
  see `Security_Privacy.md` S-01.

## What changed structurally

Conventions that were enforced by memory are now enforced by tooling:
`npm run check` validates the i18n invariants, asset references, cache-stamp
freshness and cross-file project-URL sync; `npm run bump` rewrites all
cache-bust stamps atomically. No dependencies added; no behavior changed
outside the listed fixes.

## Reports

| File | Covers |
| --- | --- |
| `Architecture.md` | System overview, repository map, data flow, conventions, risks |
| `Findings.md` | All 12 verified defects with locations and fixes |
| `Security_Privacy.md` | knowledge-base exposure (S-01), verified-healthy list, CSP notes |
| `Performance_A11y.md` | Measured results, font/hosting levers, a11y gaps |
| `Technical_Debt.md` | Ranked register incl. accepted debt with rationale |
| `Improvement_Roadmap.md` | Applied fixes · decisions needed · later · not-recommended |
