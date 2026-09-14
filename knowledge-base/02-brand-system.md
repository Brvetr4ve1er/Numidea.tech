---
domain: 02 — Brand System
status: rich
owner: Design & development lead (N)
last_updated: 2026-06-22
sources: [assets/styles.css, index.html, assets/app.js, README.md, session 2026-06-22 research]
tags: [brand, visual-identity, verbal-identity, voice, color, typography, assets, archetype]
---

# Domain 2 — Brand System

> The brand was substantially **redesigned on 2026-06-22** from "Neon Noir" to
> **"Arcanum"** (an original, IP-safe Art-Deco arcane-engineering identity). Both
> systems are documented; Arcanum is current/default.

## KB-02-001 · Brand foundations

- **Brand promise:** Powerful, almost-magical technology — made accessible, safe,
  and real, with the builder reachable directly.
- **Brand essence:** *Prestige engineering with conscience* — "engineering that
  feels like magic; discipline that ships it."
- **Brand archetype:** **Magician (lead) + Creator + Sage.** Magician = the
  transformation/"make-real" promise; Creator = the inventor/workshop drive; Sage =
  the precision + ethical restraint that makes the magic trustworthy.
- **Brand personality:** Visionary-but-grounded · precise/prestige-engineered ·
  optimistic-but-controlled · responsible/human · authoritative without arrogance.

`confidence: verified` (derived from shipped copy + 2026-06-22 brand research).

---

## KB-02-002 · Visual identity — Arcanum (current)

| Token | Value | Role |
| --- | --- | --- |
| `--void` | `#0A1420` | Canvas (deep midnight navy) |
| `--navy` | `#0F1E30` | Surface |
| `--teal` (arcane blue) | `#34D0E8` | Primary accent / "arcane energy" |
| `--teal-dim` | `#1FA8C4` | Secondary blue |
| `--crimson` (brass gold) | `#E6B450` | The "shout" / CTAs / prestige |
| `--crimson-hi` | `#F4D27A` | Gold highlight |
| `--ice` | `#EAF1F8` | Text |
| `--muted` | `#9DB2C6` | Secondary text |

- **Motif:** the **hexagon/honeycomb** as atmosphere (SVG grid, gem-glow fields) +
  **diamond/gem** accents for framing. *Note:* hexagon is a world/atmosphere motif,
  not the literal UI grid (see Domain 13 research correction).
- **Glow language:** arcane-blue + brass-gold radial fields, gem-glow CTA, brass
  kicker bars with a diamond node.

## KB-02-003 · Typography

| Use | Typeface | Notes |
| --- | --- | --- |
| Display / headings / logo | **Cinzel** (+ Cinzel Decorative) | Engraved Roman caps, "brass-plaque" feel. LTR only. |
| Body / UI | **Geist** | Neutral neo-grotesque (Vercel). |
| Data / code / numerals | **Geist Mono** | Engineered register. |
| Arabic / RTL | **IBM Plex Sans Arabic** | Cinzel has no Arabic glyphs; RTL keeps Plex. |

All via Google Fonts (OFL, commercial-safe).

## KB-02-004 · Theme system

Token-driven multi-theme switcher (persisted to `localStorage` key
`numidea-theme`). Themes: **Arcanum (default)**, Neon Noir, Daylight (light),
Monochrome, Alt-neon. Switching any theme re-skins the whole site via CSS custom
properties.

---

## KB-02-005 · Visual identity — Neon Noir (previous, retained as alt theme)

Deep navy/maroon (`--void #0D1A2F`), crimson shout (`#BD0927`), teal rationed neon
(`#09D8C7`); Space Grotesk + IBM Plex (historical). Still selectable as the "Neon
Noir" theme. `confidence: verified`.

> ✅ DOC-DRIFT RESOLVED (2026-06-28): `README.md` and the `styles.css` header now
> describe Arcanum as the primary theme with Neon Noir as one of four alternates.

---

## KB-02-006 · Verbal identity (tone of voice)

**Register:** Magician+Creator+Sage. Authority is carried by **evidence and
receipts**, not boasting.

**DO** — paint the transformation; be precise (real numbers, named methods); stay
confident and calm; name the ethics/safety/people; keep human warmth.
**DON'T** — hype vaporware or over-promise "magic" you can't ship; jargon-gatekeep;
exclamation-heavy boosterism; brag about yourself instead of the client's outcome.

**Signature lines (shipped):**
- Hero: *"Engineering that feels like magic. Discipline that ships it."*
- Services: *"What we make real."*
- Contact: *"Let's make it real."*
- Proof: *"Real clients. Real deployments. The receipts are below — open them."*
- Retained punchy lines: *"Small enough to care. Senior enough to ship."*

**Messaging hierarchy:** (1) the transformation/promise → (2) the proof/receipts →
(3) the differentiators (direct, full-chain, the automation moat) → (4) the human/
local warmth.

**Trilingual:** every public string exists in FR/EN/AR (i18n dictionary in
`assets/app.js`). Arabic is a first-class, mirrored RTL experience.

---

## KB-02-007 · Copywriting principles

- Lead with the outcome, prove with a fact.
- Trade generic CTAs for momentum verbs ("Let's build it," "See the proof").
- "One flourish per screen, then discipline."
- Honesty in microcopy (form validation in the brand voice; "Soon" not fake "Live").

---

## KB-02-008 · Brand asset catalog

| Asset | Path | Notes |
| --- | --- | --- |
| Favicon | `assets/favicon.svg` | Gradient signature mark |
| OG / social share image | `assets/og.svg` | Built from the gradient signature |
| Project preview screenshots | `assets/previews/*.webp` | Committed, ~10 KB each (currently: `almaflowclim.webp`) |
| Arcanum abstract covers | inline SVG in `index.html` | Fallback covers for not-live projects |
| Service glyph set | inline SVG in `index.html` | Arcane line-art, motion-ready (gear/radar/sonar/gem) |
| Design tokens | `assets/styles.css` `:root` + `[data-theme]` | The machine-readable brand source |

> 🔴 GAP: No logo lockup files (SVG/PNG variants), no brand guidelines PDF, no
> photography library, no illustration set, no motion-design spec beyond CSS.

---

## KB-02-009 · IP / trademark guardrail (binding)

The Arcanum aesthetic is **inspired by** the Art-Deco arcane-engineering genre but is
**legally independent**. Because Numidea is commercial, third-party fan-content
allowances do **not** apply. **Never** use protected names (e.g. "Hextech / Piltover
/ Zaun / Shimmer / Arcane"), logos, characters, or trade dress in shipped assets,
copy, theme names, or commits. Safe: the genre, the Magician archetype, original
glyphs/palette/copy. *(Brand-strategy guidance, not legal advice — have counsel
clear the final identity.)* `confidence: verified` (Domain 13 research).
