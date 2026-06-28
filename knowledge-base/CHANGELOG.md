# Knowledge Base — Changelog

All notable changes to the Numidea Labs knowledge base. Newest first.
Format: `vMAJOR.MINOR — YYYY-MM-DD`.

## v0.3 — 2026-06-28 — Codebase optimization pass
- **Resolved KB-14-003 / KB-02-005 doc-drift**: README + `styles.css` header now
  describe Arcanum-primary (+ 4 alt themes) and the real Geist/Cinzel font stack.
- Dead-code sweep across `styles.css` / `app.js`: removed an unused rule (`.note`),
  two unreferenced color tokens (`--maroon`, `--teal-dim`), and three orphan i18n
  keys (`nav.cta`, `ship.status`, `work.code`) — verified by usage analysis.
- Perf: trimmed the Google Fonts request to only the weights in use (Cinzel 6→1,
  Cinzel Decorative 3→1, Geist Mono →2, IBM Plex Arabic 4→3).

## v0.2 — 2026-06-22 — Contact form fixed
- **Resolved KB-14-001** (critical): the contact form now delivers leads via a
  `mailto:` handoff to `hello@numidealabs.com` instead of silently dropping them;
  success copy rewritten to be honest. Updated Domains 7, 8, 10, 14 accordingly.
- Residual/open: no server-side capture, no conversion analytics (upgrade path:
  Web3Forms/Formspree). README still has Neon Noir doc-drift.

## v0.1 — 2026-06-22 — First edition
- Created `knowledge-base/` with the full 15-domain structure + glossary + index.
- Populated **verified** content for Domains 1 (Identity), 2 (Brand), 5 (Product),
  7 (Operations), 13 (Decision History), 15 (AI Readiness), and the Glossary, from
  the landing-page repo, README, and the 2026-06-22 design/build session.
- Captured **partial** content for Domains 3, 4, 10, 12, 14 and **scaffolds** for
  Domains 6, 8, 9, 11 with explicit owner questions.
- Logged two real defects in Domain 14: **contact form drops leads (OPEN, critical)**
  and **misleading "Live" labels (RESOLVED)**; plus README doc-drift (OPEN).
- Established metadata schema, confidence scale (`verified/inferred/assumed/unknown`),
  stable `KB-DD-NNN` ids, and the honesty contract.

### Known state at v0.1
- 🟢 Rich: 01, 02, 05, 13, 15, glossary.
- 🟡 Partial: 03, 04, 07, 10, 12, 14.
- 🟠 Scaffold: 06, 08, 09, 11.
- Largest gaps: founder/employee names, finances, contracts/legal, real customer &
  channel data, competitor specifics, pre-session history.

### Next edition (suggested)
1. Founder interview → fill Domains 1, 12, 13 (pre-session), 14.
2. Owner pass to convert every `assumed`/`unknown` to `verified` where possible.
3. Fix + document the contact-form/lead-capture and analytics (Domains 7/8/10/14).
4. Refresh `README.md` for Arcanum (Domain 2 doc-drift).
