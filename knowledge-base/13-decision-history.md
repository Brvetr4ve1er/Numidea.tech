---
domain: 13 — Decision History
status: rich (2026-06-22 session) / sparse (prior)
owner: Design & development lead (N)
last_updated: 2026-06-22
sources: [git history, session 2026-06-22, deep-research reports]
tags: [decisions, rationale, reasoning, history, design, brand]
---

# Domain 13 — Decision History

The most valuable institutional asset: *why* things are the way they are. Each entry
follows **Situation · Decision · Alternatives · Reasoning · Outcome · Lessons**.

> Pre-2026-06-22 product/business decisions are **undocumented** (🔴 GAP — reconstruct
> from founder interviews). The following are on-the-record from the 2026-06-22
> design/build session.

---

## KB-13-001 · Adopt a multi-theme architecture (not a single skin)
- **Situation:** The site had one hard-coded "Neon Noir" look; the owner wanted to
  explore alternative identities.
- **Decision:** Refactor all color into CSS custom properties under `[data-theme]`
  blocks + a persisted switcher (localStorage), shipping 5 themes.
- **Alternatives:** Single redesign; CSS preprocessor themes; separate stylesheets.
- **Reasoning:** Token-driven theming lets the *whole* page re-skin from one place
  and lets the owner A/B looks live with zero rebuild — de-risks bigger changes.
- **Outcome:** ✅ Shipped (`7390c67`). Made the later Arcanum rebrand a low-risk
  additive change rather than a rewrite.
- **Lessons:** Invest in tokens early; it turns "rebrand" from a project into a diff.

## KB-13-002 · Type system → Geist / Geist Mono
- **Situation:** Needed a modern, technical, premium typeface.
- **Decision:** Geist (display/body) + Geist Mono (data), keeping IBM Plex Sans
  Arabic for RTL.
- **Reasoning:** Geist is a neutral neo-grotesque that signals "engineered" and lets
  an ornate display face dominate later without clashing.
- **Outcome:** ✅ `7390c67`. Enabled the Cinzel pairing in Arcanum.
- **Lessons:** Choose a quiet body face first; it buys freedom in the display layer.

## KB-13-003 · Full rebrand to "Arcanum" (Art-Deco arcane-engineering)
- **Situation:** Owner wanted an "Arcane/Hextech" vibe — tone, archetype, and look.
- **Decision:** Build an **original, IP-safe** Art-Deco arcane identity ("Arcanum"):
  arcane-blue + brass-gold over deep navy, Cinzel engraved headings, honeycomb
  atmosphere, gem-glow accents — set as the **default** theme.
- **Alternatives:** New theme only; literal fan-aesthetic; leave as Neon Noir.
- **Reasoning:** Owner chose "full rebrand / strong & cinematic." Deep research found
  the core read is the **blue-gold ordered pole** (not literal hexagon UI), so the
  hexagon was used as *atmosphere*, diamond/gem as framing.
- **Outcome:** ✅ `ae6162f`. Live as default.
- **Lessons:** **IP guardrail is binding** — commercial use forfeits fan-content
  allowances, so evoke the *genre/archetype*, never protected names/assets. Research
  before building prevented a literal-but-infringing direction.

## KB-13-004 · Brand voice → Magician + Creator + Sage
- **Situation:** Visual rebrand needed a matching verbal identity.
- **Decision:** Adopt the **Magician (lead) + Creator + Sage** archetype; rewrite
  marquee copy ("engineering that feels like magic; discipline that ships it");
  **keep** strong existing lines that already carried authority.
- **Alternatives:** Rewrite everything; leave copy unchanged.
- **Reasoning:** Magician = transformation promise; Sage = the precision/ethics that
  make it trustworthy; over-rewriting good, specific lines would lose authority.
- **Outcome:** ✅ `c46e2bd` + `7a68fab`. FR/EN/AR updated.
- **Lessons:** Elevate surgically; don't degrade copy that already works.

## KB-13-005 · Project previews → committed screenshots + honest fallback
- **Situation:** Project cards were text plinths; owner wanted real imagery.
- **Decision:** **Committed, optimized WebP screenshots** + a Playwright capture
  script (`npm run shots`); **Arcanum abstract SVG covers** for not-live projects.
- **Alternatives:** Runtime screenshot API (thum.io/microlink); owner-supplied images.
- **Reasoning:** Committed images preserve the site's fast, self-contained,
  no-third-party ethos and 100-Lighthouse target; fallbacks guarantee no card is ever
  broken. (Owner confirmed both choices.)
- **Outcome:** ✅ `8a36820`. `almaflowclim.webp` captured (only live site).
- **Lessons:** Default to self-hosted assets for a static, privacy-respecting site.

## KB-13-006 · Honesty pass on "Live" labels
- **Situation:** 3 of 5 project cards showed a "Live" pill / demo link, but only
  `almaflowclim.fr` actually resolves (HTTP 200); others were `href="#"`.
- **Decision:** Keep "Live" + demo link only on the genuinely live project; the other
  four show an honest **"Soon"** state (FR/EN/AR `work.soon`).
- **Reasoning:** A studio selling "proof over promises / no middlemen" cannot ship
  misleading "Live" badges — it contradicts the core value.
- **Outcome:** ✅ `7a68fab`.
- **Lessons:** Marketing claims must match reality; honesty is a brand asset.

## KB-13-007 · Service glyphs → motion-ready arcane set
- **Situation:** Generic line icons; owner wanted redesign + tasteful animation.
- **Decision:** Cohesive arcane glyphs (window+gem, sonar rings, gear, radar, peak
  gem) with per-service motion (spin/sweep/pulse/radiate), **transform/opacity only**,
  faster on hover, fully gated behind `prefers-reduced-motion`.
- **Reasoning:** Research: GPU-friendly props only; one tasteful motion; reduced-motion
  is mandatory. Composes with the existing stroke draw-on.
- **Outcome:** ✅ `7a68fab`.
- **Lessons:** Bake accessibility (reduced-motion) into ambient animation from line 1.

---

## Decision-making process (meta)
Observed pattern this session (`confidence: inferred`): **research → recommend with a
default → confirm material choices with the owner via explicit options → build in
small deployable commits → verify the deploy is green → report.** Material/irreversible
or brand-defining choices are surfaced for owner sign-off; reversible defaults are
taken autonomously.

> 🔴 GAP: No documented decision framework (e.g., who approves what, spend
> thresholds, RACI) exists outside this observed pattern.
