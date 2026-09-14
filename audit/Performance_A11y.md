# Performance & Accessibility Report

## Verified by measurement (headless Chromium, this audit)

| Check | Result |
| --- | --- |
| Uncaught JS errors — index (fr/en/ar × arcanum/daylight), hub, scene, 404, desktop+mobile | **0** |
| Horizontal overflow at 1440px / 390px on all pages | **none** |
| Daylight `.lede` contrast | **1.35:1 — FAIL** (F-01) |
| Daylight `.fd-bio` contrast | **1.38:1 — FAIL** (F-02) |
| i18n dictionary | every key ×3, no orphan `data-i18n` refs |
| Local asset references | all resolve; all carry `?v=` stamps |

## Performance

**What's already right:** zero client dependencies; preview images are committed
~10 KB WebPs with `loading="lazy" decoding="async"` and explicit
`width/height` (no CLS); textures are inline data-URI SVGs (no extra requests);
fonts use `display=swap` with preconnect; scroll handlers are passive; animation
work is transform/opacity-only; `IntersectionObserver` everywhere instead of
scroll math.

**P-01 · Font payload is 5 families.** IBM Plex Sans Arabic (3 weights)
downloads for every visitor, including the LTR majority who never switch to
Arabic. Options: accept (simplest, current); or load the Arabic css2 request
lazily on first `applyLang('ar')` (saves ~90 KB for LTR visitors, one-line
dynamic `<link>`). Cinzel Decorative is used for exactly two flourishes — the
cheapest trim if one is ever needed.

**P-02 · Hosting headers.** GitHub Pages can't set `Cache-Control`; every visit
revalidates. `vercel.json` already encodes immutable asset caching — completing
the Vercel import is the single biggest real-world performance lever available.

**P-03 · Non-issues, on the record:** CSS 68 KB / JS 72 KB uncompressed
(≈13–15 KB each gzipped) is far below any budget worth enforcing; minification
would save less than one font weight and cost the no-build-step property. Not
recommended.

## Accessibility

**What's already right:** skip link; visible `:focus-visible` rings; semantic
landmarks; `aria-expanded/pressed/checked/current` kept in sync by JS;
portfolio modal has a real focus trap, Escape handling and focus restore;
`aria-live` on form errors, count and success; native `<details>` for FAQ and
capabilities; `prefers-reduced-motion` honored in all four stylesheets
(verified) including a global kill-switch; `<noscript>` neutralizes
scroll-reveal so content is never hidden without JS; RTL is mirrored per-rule,
not just flipped.

**Gaps:**
- **A-01 = F-01/02/03** — the Daylight contrast failures are the only WCAG-level
  defects found.
- **A-02 = F-11** — mobile overlay menu doesn't trap focus (the modal does).
- **A-03** — theme menu is `role="menu"` but has no arrow-key navigation;
  Tab/Escape work. Minor conformance gap with the menu pattern; either add
  arrow keys or downgrade to a plain disclosure list, both acceptable.
- **A-04 = F-10** — scene arrow keys don't mirror in RTL.
