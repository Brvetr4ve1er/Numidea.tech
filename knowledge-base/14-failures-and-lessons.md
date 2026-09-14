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

## KB-14-001 · Contact form silently dropped every lead (FIXED 2026-06-22)
- **What:** The contact form (`assets/app.js`) validated input and showed a designed
  success state but performed **no submission** (no POST, no email). Code comment:
  "front-end demo." Every prospect believed they'd reached Numidea; the message went
  nowhere — a direct revenue leak at the top of the funnel.
- **Fix:** On valid submit the form now opens a **`mailto:` handoff** pre-filled to
  `hello@numidealabs.com` (subject `Numidea Labs · <name>`, body = name/email/message),
  and the success copy was rewritten to be honest ("your email is ready — hit send").
  Chosen because the site is a static GitHub Pages build with no backend and the
  owner opted for zero-signup delivery.
- **Residual limitation:** Delivery depends on the visitor having a configured mail
  client; it is **not** a server-side capture, and there is still **no analytics on
  conversion**. For guaranteed background capture, upgrade to Web3Forms/Formspree
  later (the handler is the single place to change).
- **Lesson / never-again:** Never show a "success" state unless a real handoff/2xx
  occurred. Audit every "it works" state against what actually happens.
- `confidence: verified`. Status: **RESOLVED (mailto); upgrade path open.**

## KB-14-002 · Misleading "Live" labels (FIXED 2026-06-22)
- **What:** 3 of 5 project cards displayed a "Live" pill + demo link, but only
  `almaflowclim.fr` actually resolved; the rest were `href="#"`.
- **Fix:** Honest "Soon" state for not-live projects; "Live" reserved for the truly
  live one (commit `7a68fab`).
- **Lesson:** Public claims must match reality — especially for a studio whose brand
  is "proof over promises." Audit marketing claims against ground truth.
- `confidence: verified`. Status: **RESOLVED**.

## KB-14-003 · Documentation drift — README vs Arcanum (FIXED 2026-06-28)
- **What:** `README.md` documented "Neon Noir v2" as *the* design system (and the
  wrong font stack — Space Grotesk/IBM Plex) after the Arcanum rebrand.
- **Fix:** Rewrote the README design-system section to Arcanum-primary (+ 4 alt
  themes) with the real Geist/Cinzel/IBM Plex Arabic type stack; the `styles.css`
  header comments were corrected in the same pass.
- **Lesson:** Update docs in the same change as the thing they describe.
- `confidence: verified`. Status: **RESOLVED**.

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
