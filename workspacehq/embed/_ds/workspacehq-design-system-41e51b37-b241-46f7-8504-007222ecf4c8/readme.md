# WorkspaceHQ — Design System

The brand + UI system for **WorkspaceHQ**, a gamified **personal ops console**. It's a
desktop (Electron) app that scans your local dev projects and turns portfolio hygiene —
git safety, builds, tests, activity — into an RPG: **quests** you clear, **XP/runes** you
earn, **coins** and **trophies**, an arsenal of castable **spells** (your scripts, skills
and MCP tools), and a scan **streak** that keeps an **ember** lit. The whole thing wears a
retro-arcade **NES/CRT** skin by default, with four alternate console skins.

> One-line vibe: *an arcade cabinet for your codebase.* Insert coin, clear the night's hunts,
> level up your workspace.

## Sources

Built by reading the product's real code, not from memory. Explore these to go deeper:

- **GitHub — `Brvetr4ve1er/workspace-HQ`** (https://github.com/Brvetr4ve1er/workspace-HQ)
  - `dashboard-v3/styles/{base,components,chrome}.css` — the v3 "NEXUS" token contract, the
    NES-frame component rules, and all five theme blocks. **This is the source of truth for
    every colour, font, radius and shadow in this system.**
  - `docs/CANON.md` — the "Nightfall" art-direction & vocabulary bible (the FromSoftware skin).
  - `schema/gamification.config.json` — the XP curve, level titles, achievements, spell economy.
  - `spellbook/README.md`, `projects/*.md` — spell format and product copy (voice examples).

Fonts (`Press Start 2P`, `VT323`) were copied verbatim from `dashboard/vendor/fonts/`.

---

## CONTENT FUNDAMENTALS

**The frame is a game, always.** Copy never says "task", it says **hunt / quest**. Not
"points" but **XP / runes**. Not "score" but **health index / vitality**. Not "run a script"
but **cast a spell**. Lean into arcade and RPG diction consistently.

**Casing.** Labels and headings are **ALL-CAPS** in the pixel face (`TODAY`, `RED HUNTS`,
`▶ PRESS START`, `INSERT COIN`, `DEEP SCAN`). Body copy and numbers are sentence case in the
terminal face. Section headings carry a `■` bullet.

**Person & tone.** Second person, direct, a little theatrical. "You rest at the Site of
Grace." "The night grows long — 4 hunts remain." It addresses *you*, the operator.

**Three voice registers** (from CANON.md — use the right one for the moment):
1. **The Hunt** — gothic, terse; for quests, risks, errors that demand action.
   *"A beast stirs in almaflowclim."*
2. **Grace** — ethereal, calm; for rest states, daily notes, progress.
   *"You rest at the Site of Grace. The Ember holds at 3."*
3. **ACCESS DENIED** — sterile, technical friction; for blocked/failed states.
   *"ACCESS DENIED — credential perimeter breached. 24 secrets exposed."*

**Numbers earn their place.** This is a dashboard — real metrics (health 30/100, 666 runes,
5-day streak, 6 red quests, 3,266 LOC) are the content, shown big in the terminal face.

**Emoji ARE part of the brand** — used as compact icons for trophies (🚀 🔒 🔥 🏆), spell
schools (🔮 📜 🌀 🧪 🛡️), familiars (🐦‍⬛), and project subnotes (❄️). Never decorative filler;
always a specific glyph standing in for a specific thing. See ICONOGRAPHY.

---

## VISUAL FOUNDATIONS

**The look: a retro arcade cabinet rendered as a desktop console.** Dark CRT stage, pixel
labels, phosphor-glow accents, hard NES window frames, chunky cabinet buttons.

- **Colour.** Base surfaces are a deep near-black indigo → violet stack (`--bg #07060f`,
  `--panel #100d24`, `--card #14102b`). Text is parchment-white (`--text #e8e6ff`) over
  lavender-grey muted tiers. Accents come from a **phosphor palette** — cyan, magenta, and
  above all **gold `#ffd23f`** (the money colour: XP, coins, active state). Green = success,
  red = danger/red-quests, orange = warning/stale. **One glow per viewport** — accent is
  feedback for something that just happened, not ambient decoration.
- **Type.** Two faces only. **Press Start 2P** (`--px`) for LABELS ONLY — tiny (6.5–12px),
  tracked, uppercase cadence; never body. **VT323** (`--term`) for body copy and *every
  number*, set large and legible (15–34px). The pairing IS the brand.
- **Spacing.** A ~4 / 7 / 10 / 14 / 16 px rhythm; cards pad `15px 16px`, quests `11px`.
- **Corners.** **Square by default** (`border-radius: 0`) — these are NES windows. Chips get
  3px; only capsule labels go pill. (Alternate themes soften: okami 16px, numidea 14px, ops 6px.)
- **Borders & depth.** The signature: a **2px `--ink` (near-black) border + a coloured frame
  ring via `box-shadow: 0 0 0 2px var(--frame)` + a faint outer glow.** No soft drop shadows.
  Depth is stacked hard rings, not blur.
- **Buttons.** Chunky cabinet buttons carry a **hard `0 3px 0` drop** (gold or green) that
  **collapses on press** (`translateY`) — a physical button-click. Utility buttons are ink-filled
  pixel chips that turn gold on hover.
- **Bars.** Progress/energy meters are **segmented into pixel cells** by a repeating-gradient
  mask over a glowing fill.
- **Motion.** Short, mechanical, snappy (`.12–.15s`, a pop easing). Hover lifts cards
  `translateY(-2/-3px)`. Coins spin, trophies bounce, legendary spells shimmer — but only **on
  attention (hover)**, never ambiently. Blink is reserved for `PRESS START` / `INSERT COIN`.
- **Atmosphere.** A pure-CSS **CRT layer** — faint scanlines + vignette — sits over everything
  (pointer-events none) in the arcade skin. Alternate skins swap it for their own ambience.
- **Imagery.** There is no photography. The system is type, glyph, glow and frame. Illustration
  = pixel/emoji glyphs and SVG isometric maps generated in-app.

### Themes (five console skins)
`ARCADE` is the default (the base `:root`). Four alternates rebind the same tokens via
`<html data-theme="…">`: **okami** (monochrome ink-wash, white pill buttons, Anton),
**numidea** (teal+blood on midnight blue, Abril Fatface), **ops** (warm graphite+amber utility,
Bebas), **nightfall** (gothic umber + lantern gold, Cinzel — "THE CANON"). See `tokens/themes.css`.

---

## ICONOGRAPHY

WorkspaceHQ has **no drawn logo** — the wordmark is set in type: `WORKSPACE` + a gold-accented
`HQ`, in Press Start 2P. Reproduce it that way; do not invent a mark. *(If a logo is later
provided, drop it in `assets/` and update this section.)*

The icon system is deliberately low-tech and matches the arcade voice:
- **Emoji** are the primary iconography — trophies, spell schools, familiars, project tags.
  They're compact, universally available, and on-brand for the playful frame. Use a *specific*
  glyph per concept (🚀 first push, 🔒 version control, 🔥 streak, 🔮 divination spell).
- **Unicode symbols** stand in for UI glyphs: `■` section bullets, `▶` start/active arrows,
  `◆` rarity pips, `★` unlocked trophies, `⚔ ⌂ ◈` rail sigils, `⏲` cooldowns.
- No icon font, no SVG icon set is shipped by the app; the isometric base-map is generated SVG.

If you need a broader UI icon set for a new surface, reach for a CDN set with a **1.5–2px stroke**
to match the pixel weight, and flag the addition — but prefer emoji + Unicode first.

---

## Index / manifest

**Tokens** (`styles.css` → `tokens/`): `fonts.css`, `colors.css`, `typography.css`,
`spacing.css` (radius/border/shadow too), `themes.css` (the 4 alternate skins). Consumers link
the single root **`styles.css`**.

**Components** (`components/`) — group / name:
- **core/** — `Button`, `Tag`, `ProgressBar`, `SectionHeading`
- **data/** — `Kpi`, `ProjectCard`
- **game/** — `Coin`, `QuestItem`, `MissionCard`, `Achievement`, `SpellCard`

Each ships a `.jsx`, a `.d.ts` (props contract), a `.prompt.md` (usage), and its group shares one
`@dsCard` gallery card. `Button`, `Kpi`, `SpellCard` and the NEXUS screen are **starting points**.

**UI kit** (`ui_kits/nexus/`) — an interactive recreation of the console: `index.html` (boot
splash → dashboard, tab nav, cast/complete toasts) composed from `Shell.jsx`, `TodayScreen.jsx`,
`GrimoireScreen.jsx`.

**Foundations** (`foundations/`) — 14 specimen cards for the Design System tab (Colors, Type,
Spacing, Brand).

**Assets** (`assets/fonts/`) — `PressStart2P.woff2`, `VT323.woff2`.

**Intentional additions:** none — every component maps to a real unit in the source dashboard
(`.kpi`, `.card`, `.quest`, `.mission`, `.ach`, `.spellcard`, `.tag`, `.bar`, `h2.sec`, `.qbtn`).

**Caveats:** the source app renders live from scan JSON; this kit uses representative fixture
data. Themes okami/numidea/ops/nightfall reference web fonts (Anton, Abril Fatface, Bebas Neue,
Cinzel, etc.) that are **not bundled** — add `@font-face`/Google Fonts if you ship those skins.
