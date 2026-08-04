# Numidea Labs — Themes

The site ships **Arcanum** (arcane-blue + brass, Cinzel display) as its identity.
Five palette variants and one full alternate design system sit behind the theme
switcher.

---

## How themes work here

Five of the six are **token swaps**: `[data-theme]` remaps the colour custom
properties in `assets/styles.css`, and every rule that reads `var(--token)`
reskins for free.

| Theme | Character |
| --- | --- |
| **Arcanum** *(default)* | Arcane-blue ground, brass flourish, engraved Cinzel display |
| **Neon Noir** | The `:root` base palette — navy, crimson, teal |
| **Daylight** | Light surface, same structure |
| **Monochrome** | Near-black with a single warm accent |
| **Alt-neon** | Amber + violet on the noir ground |

**Engineering** is different: it is a *complete design system*, not a palette —
cool near-black, Geist + Geist Mono, monospace as texture, a deploy terminal and
build indices. It cannot be expressed as token values, so it ships as an
**alternate stylesheet**:

```
assets/theme-engineering.css      loaded with media="not all"
app.js                            flips media to "all" for data-theme="engineering"
index.html <head>                 the pre-paint resolver does the same, so the
                                  theme never flashes the base skin first
```

Because both sheets stay in the document, `theme-engineering.css` opens with a
**reset block** that neutralises everything the base sheet paints and this system
does not use — the brass dividers, the full-bleed band tints, the gradient-clipped
headings, the fanned hero deck, the arcane texture layers. It loads second, so
matching specificity is enough; there is no `!important` in the file.

A computed-style audit walks every visible element in the Engineering theme and
fails on any base-palette colour still being painted. It currently reports zero.

## Engineering-only markup

Three elements live in `index.html` for that theme and are hidden by the base
sheet (`.term, .logo .brick { display:none }`):

- `.term` — the hero deploy terminal, showing this repository's real GitHub
  Pages run: checkout, configure-pages, upload-artifact, deploy, 18s, live.
- `.logo .brick` — the accent monogram square.
- `data-idx="0n/07"` on each project card — the build index badge.

## The logo

Swap point in `index.html`, and it serves both systems:

```html
<a class="logo" href="#top">
  <span class="brick">N</span>Num<i>idea</i> Labs<span class="cursor"></span>
</a>
```

`.brick` is the Engineering mark, `.cursor` is the Arcanum blinking block. Replace
either (or both) with the delivered artwork.

## Adding another full design system

Copy the pattern: a self-contained sheet, a reset block at the top, one entry in
`THEMES` in `app.js`, one `<link media="not all">`, one line in the pre-paint
resolver, and a button in the theme menu.
