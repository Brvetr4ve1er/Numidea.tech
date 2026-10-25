---
type: map
updated: 2026-10-19
sources: [assets/themes.css, assets/styles.css, scripts/themes-check.mjs, scripts/site.mjs, index.html, 404.html, assets/app.js, scripts/build-legal.mjs, scripts/build-og.mjs, scripts/audit.mjs, scripts/sweep.mjs, package.json, .github/workflows/check.yml, .github/workflows/pages.yml, netlify.toml, vercel.json, README.md, BRAND.md, audit/Performance_A11y.md]
---

# Themes and tokens

The site ships six themes, and every one of them is a single block in `assets/themes.css` that sets the same 47 tokens and nothing else; `assets/styles.css` only reads those tokens, so a theme can change how the page looks but cannot break it (assets/themes.css › 1–13; scripts/themes-check.mjs › CONTRACT; scripts/site.mjs › THEMES). `scripts/themes-check.mjs` enforces that contract on every `npm run check` (package.json › scripts.check). Start with the theme table, then the token groups; the checks the contract runs are listed under "What themes-check enforces".

## The six themes

Arcanum is the studio's identity and the default; the other five sit behind the theme switcher (README.md › Design system; BRAND.md › Numidea Labs — Themes).

| `data-theme` | Menu label | Character | Page `--void` | Accent `--crimson` | Accent `--teal` | Heading face | `--r-sm` / `--r-md` |
|---|---|---|---|---|---|---|---|
| `arcanum` (default) | Arcanum | Arcane blue and brass, engraved Cinzel | `#0A1420` | `#E6B450` (brass) | `#34D0E8` | Cinzel 700 | 8px / 14px |
| `noir` | Noir | Cinematic black, signal red, steel | `#0B0B0E` | `#E5484D` | `#C9CED6` | Geist 700 | 6px / 10px |
| `daylight` | Daylight | Warm paper, ink, ochre and deep teal (the one light theme) | `#F6F3EC` | `#8C5E0A` | `#0E6E78` | Geist 600 | 10px / 16px |
| `mono` | Monochrome | True black and white, sharp, no colour | `#0A0A0A` | `#F5F5F5` | `#BDBDBD` | Geist 500 | 2px / 4px |
| `altneon` | Alt-neon | Synthwave violet, magenta and cyan | `#0C0716` | `#FF3EA5` | `#3EE6FF` | Geist 700 | 10px / 18px |
| `engineering` | Engineering | Graphite, safety orange, drafting grid | `#0E1012` | `#FF5B1F` | `#8EC5E8` | Geist 600 | 2px / 4px |

Sources for the table: the six blocks (assets/themes.css › ARCANUM, NOIR, DAYLIGHT, MONO, ALT-NEON, ENGINEERING), the menu labels (index.html › 235–240), the heading faces (index.html › 108 `HEAD`; assets/styles.css › 13–17 `--font-display`, `--font-deco`), the default (index.html › 2), Daylight being light (assets/app.js › 911).

- The theme names live once in `THEMES` in `scripts/site.mjs`: `arcanum`, `noir`, `daylight`, `mono`, `altneon`, `engineering` (scripts/site.mjs › THEMES).
- Noir was formerly called "Neon Noir" (BRAND.md › How themes work here).
- Of the published pages, only `index.html` and `404.html` follow the six themes; `hub/` and `scene/` carry their own palettes (scripts/sweep.mjs › 46; BRAND.md › No literal palette colours in shared rules). `hub/` and `workspacehq/` are in [[WorkspaceHQ and hub]], `scene/` in [[Project sheets]].
- The generated legal page, unpublished until the owner's fields are complete, loads `themes.css` and resolves the stored theme from the same `THEMES` list (scripts/build-legal.mjs › 288, 300). The link-preview card is drawn with the Arcanum tokens (scripts/build-og.mjs › header).
- Graph: [[Arcanum theme (default)]], [[Noir theme]], [[Daylight theme]], [[Mono theme]], [[Altneon theme]], [[Engineering theme]], [[THEMES]].

## The 47-token contract

The token list is `CONTRACT` in `scripts/themes-check.mjs`, in six groups (scripts/themes-check.mjs › CONTRACT). The names are historical: `--crimson` is the primary accent whatever its colour, which is why it is brass in Arcanum (assets/themes.css › 15–19, ARCANUM).

| Group | Tokens | What they carry |
|---|---|---|
| Colour (16) | `--void` `--navy` `--plum` · `--ice` `--body-strong` `--muted` `--faint` · `--crimson` `--crimson-hi` `--on-crimson` `--crimson-text` · `--teal` `--teal-text` `--on-teal` · `--hairline` `--hairline-2` | Page ground, card surface, raised surface; primary text, long copy, secondary text; primary and secondary accents, each with a text version and a text-on-fill colour; hairline borders (assets/themes.css › 15–19; assets/styles.css › 864) |
| Depth and effects (9) | `--band` `--shade` `--shade-k` `--grad-blood` `--grad-noir` `--grad-teal` `--glow-teal` `--glow-crimson` `--btn-glow` | The wash behind `.band` sections, shadow colour and strength, three gradients, glows, the primary button's glow (assets/styles.css › 1008, 611, 130, 162, 825, 44) |
| Atmosphere (5) | `--atmos` `--grid-color` `--grid-opacity` `--grid-size` `--ink-k` | The glow fields behind the page, the construction grid, the strength of the illustration plates (assets/styles.css › 98–109, 2008; BRAND.md › Theme contract) |
| Surfaces (4) | `--nav-glass` `--glass` `--field-bg` `--cover-shadow` | The scrolled navbar, glass panels, form fields, project covers (assets/styles.css › 137, 864, 732, 535) |
| Type (10) | `--font-head` `--font-head-em` `--head-weight` `--head-tracking` `--font-logo` `--logo-weight` `--logo-tracking` `--hero-fs` `--hero-fs-wide` `--hero-lh` | Heading and wordmark faces, weights and tracking; hero size and line height (assets/styles.css › 37–43, 1191) |
| Shape (3) | `--r-sm` `--r-md` `--kicker-node` | Corner radii and the size of the node after each kicker (assets/styles.css › 46) |

- The theme-independent tokens sit in the `:root` of `styles.css`: font stacks, the spacing scale, `--r-pill` and `--r-lg`, motion timings, `--max`, `--gutter` and `--nav-h` (assets/styles.css › 9–31).
- The header comment of `styles.css` still describes a base palette in `:root` reskinned by each `[data-theme]`; the `:root` block itself says colour tokens live in `themes.css` (assets/styles.css › 1–10).
- Graph: [[Theme contract (47 tokens)]], [[CONTRACT]], [[assetsthemes.css (six theme blocks)]], [[assetsstyles.css]].

## Rules for using tokens in styles.css

- **Text tokens, not fill tokens.** `--teal` and `--crimson` are fills (borders, glows, icon strokes, chips); `--teal-text` and `--crimson-text` are for text; `--crimson-hi` is a hover highlight and never text (BRAND.md › Text tokens vs fill tokens). See [[Text tokens vs fill tokens]].
- **A client's own colour as text** is mixed toward the theme's ink, `color-mix(in srgb, rgb(var(--brand)) 55%, var(--ice))`, because `--ice` is the foreground in every theme (BRAND.md › Text tokens vs fill tokens). See [[--brand per-project colour triplet]].
- **No literal palette colours in shared rules.** Shadows read `rgb(var(--shade) / calc(.85 * var(--shade-k)))`, so each theme sets their colour and strength (Daylight's `--shade-k` is `.28`, Arcanum's `1`), and theme-coloured literals are written as `color-mix(in srgb,var(--token) N%,transparent)` (BRAND.md › No literal palette colours in shared rules; BRAND.md › Theme contract; assets/styles.css › 611; assets/themes.css › ARCANUM, DAYLIGHT). See [[No literal palette colours in shared rules (--band, --shade)]].
- **The switcher's swatches**, `.theme-menu .dot.<name>`, type each theme's colours in on purpose, and `themes-check` skips those rules when it looks for palette literals (assets/styles.css › 69–75; scripts/themes-check.mjs › 157). The print palette below also types Daylight's accent values in (assets/styles.css › 2079–2090).
- **Print** overrides the colour tokens with `!important`, because the theme blocks are `:root[data-theme]` (specificity 0,2,0) and would win; Daylight's ink accents stand in for every theme on paper (assets/styles.css › 2079–2090).

## What themes-check enforces

`scripts/themes-check.mjs` exits non-zero on any of these (scripts/themes-check.mjs › 21, 162).

| Check | Fails when | Locator |
|---|---|---|
| Block shape | A rule in `themes.css` is not `:root[data-theme="name"]`, or sets a property instead of a token | scripts/themes-check.mjs › 59–72 |
| Exact contract | A theme misses a token or adds one outside `CONTRACT` | scripts/themes-check.mjs › 73–76 |
| Contrast | One of the 15 pairs in `PAIRS` falls below its floor: 7:1 for `--ice` on `--void` and `--navy`, 4.5:1 for the rest; each colour must be `#rrggbb` | scripts/themes-check.mjs › PAIRS, 78–83 |
| No dead tokens | A contract token is read by none of `styles.css`, `404.html` or `legal/index.html` | scripts/themes-check.mjs › 89–95 |
| No re-declaration | `styles.css` sets a contract token, except the print palette, which must carry `!important` | scripts/themes-check.mjs › 97–116 |
| No variants | `styles.css` has a `[data-variant` selector | scripts/themes-check.mjs › 114–117 |
| Lists agree | `index.html` `HEAD`, `404.html` `LOGO`, `THEMES` in `app.js` or the theme menu differ from `THEMES` in `site.mjs` | scripts/themes-check.mjs › 120–136 |
| Faces preloaded | A theme's heading face is not the one `HEAD` preloads, or its wordmark face not the one `LOGO` preloads | scripts/themes-check.mjs › 137–146 |
| No theme selectors | `styles.css` contains `[data-theme` | scripts/themes-check.mjs › 148–151 |
| No palette literals | `styles.css` writes one of the listed theme colours as an `rgb()`/`rgba()` literal outside the switcher swatches | scripts/themes-check.mjs › 152–160 |

- It runs locally through `npm run check` (package.json › scripts.check), in CI on every push and pull request, and before every deploy (.github/workflows/check.yml › 50–51; .github/workflows/pages.yml › 51–52; netlify.toml › 12; vercel.json › 3); see [[Build and gates]] and [[Deploy]].
- The painted result is measured separately: the browser audit and the contrast sweep iterate `THEMES`, so a new theme is covered without editing them (scripts/audit.mjs › 99; scripts/sweep.mjs › 45).
- Graph: [[themes-check.mjs]], [[PAIRS]].

## How a theme is applied

1. `index.html` loads `fonts.css`, then `themes.css`, then `styles.css` (index.html › 186–191).
2. Before first paint, an inline head script reads `numidea-theme` from `localStorage`, falls back to `arcanum` for an unknown name, sets `data-theme` on `<html>` and colours the browser bar from its `VOID` map (index.html › 105–127). `404.html` does the same with its `LOGO` map and writes a preload for a wordmark face it does not already preload (404.html › 76–116). See [[Pre-paint Boot Script]] and [[Languages and RTL]].
3. A click in the switcher calls `applyTheme()`: it sets one attribute, reads `--void` back from the tokens for the browser bar, stores the choice and fires `numidea:relayout` because type tokens change line lengths (assets/app.js › 905–921, 959). No stylesheet is loaded on a switch (assets/app.js › 905–906).
4. When a page comes back from the back/forward cache, the stored theme is re-applied if it changed (assets/app.js › 2692–2705).

Graph: [[applyTheme()]], [[Theme Switch Menu]], [[numidea-theme localStorage key]].

## Adding a theme

1. Copy a block in `assets/themes.css` and change its values (assets/themes.css › 12–13). The same comment still says to add the name to `THEMES` in `scripts/themes-check.mjs`; that file now imports `THEMES` from `scripts/site.mjs` (scripts/themes-check.mjs › 24).
2. Add the name to `THEMES` in `scripts/site.mjs`, to `THEMES` in `assets/app.js`, to the theme menu in `index.html`, to the `HEAD` map in `index.html` and to the `LOGO` map in `404.html` (BRAND.md › Theme contract).
3. Run `npm run check`; `themes-check` fails until every list agrees and every contrast pair passes (BRAND.md › Theme contract; scripts/themes-check.mjs › 120–136).

Each item in the theme menu also carries a swatch, `.dot.<name>`, coloured in `styles.css` (index.html › 235–240; assets/styles.css › 69–75).

## History

- Engineering used to be a separate alternate stylesheet, `theme-engineering.css`, with its own reset block; it became a token theme in the 2026-10 cleanup (BRAND.md › History (removed features): Engineering as an alternate stylesheet). See [[theme-engineering.css (removed alternate stylesheet)]].
- Before the contract, about 40 rules in `styles.css` special-cased a theme and about 40 colours were literals that could not re-skin; both are gone (BRAND.md › Theme contract (replaces the Engineering alternate stylesheet)).
- The A/B/C page variants were removed in the same cleanup; `themes-check` now refuses `[data-variant` (BRAND.md › No literal palette colours in shared rules).
- The July 2026 code audit found Daylight contrast failures, the only WCAG-level defects it reported (audit/Performance_A11y.md › A-01): [[A-01 - Daylight contrast failures (= F-010203)]]. Its graph note [[Daylight theme (light theme, --voidF4F6F9)]] records an older value; today Daylight's `--void` is `#F6F3EC` (assets/themes.css › DAYLIGHT).
- The June 2026 knowledge base records the earlier decision to adopt a multi-theme architecture (history only): [[Decision adopt multi-theme token architecture]], in `archive/2026-06-snapshot/`.

## Related

- Maps: [[Site architecture]], [[Languages and RTL]], [[Build and gates]], [[Deploy]], [[Timeline]], [[Maps/Glossary|Glossary]].
- Communities: [[_COMMUNITY_Theme Token Contract]], [[_COMMUNITY_Themes and Stylesheets]], [[_COMMUNITY_Arabic RTL and Head Boot]], [[_COMMUNITY_Audit Findings (Daylight, Hub)]].
- Wiki: [[Theme_Token_Contract]], [[Themes_and_Stylesheets]], [[Design_System_Summary]].
