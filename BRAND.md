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

## The ambient layer — parallax, aurora, reveal

Three cooperating pieces, tuned for calm rather than spectacle. All of it is
decoration: it is `aria-hidden`, it sits at `z-index:0` beneath the content,
and `prefers-reduced-motion` removes it completely.

**Parallax rides the `translate` property, never `transform`.** This is
load-bearing. `translate`, `rotate` and `transform` are independent CSS
properties, so one element can be parallaxed *and* run a reveal transform, a
hover scale and a spin animation at once without any of them clobbering the
others. Add depth by putting `data-parallax="<k>"` on an element — negative
moves against the scroll, positive with it, roughly −0.2…+0.2. `app.js` writes
only the CSS variables `--px`, `--py` and `--sy`; the stylesheet composes them.

Two rules that were each learned by watching the page misbehave:

- **Layout positions are cached, never re-read while scrolling.** A rect read
  back already contains the translate just applied, so measuring per-scroll
  makes each frame feed on the last and the element creeps away from where it
  belongs. Worse, a *rotating* element's bounding box grows and shrinks as it
  spins — the hero ring's box swings ~20px per revolution — which pumps that
  wobble straight into its own parallax target. Caching makes the target a
  pure function of scroll position. Re-cache on resize, on load, and on
  `numidea:relayout` (dispatched by `applyTheme`, because Engineering reveals
  the terminal, which is `display:none` and therefore cached at zero
  everywhere else).
- **The easing is time-based, not per-frame.** A fixed per-frame lerp settles
  twice as fast on a 120Hz display as on a 60Hz one, and "unhurried" cannot be
  a property of the user's monitor.

**Aurora** — three slow colour fields fixed behind the whole page, inked from
palette tokens via `color-mix`, never from literals, so they reskin with every
theme. Light palettes get lower opacity or they turn muddy. Engineering
re-inks them to a single cold instrument glow, because that surface doesn't
own crimson/teal/plum.

**Floaters** — hand-drawn SVG geometry in the hero, no raster assets. They
live strictly in the hero's negative space (the bands above and below the
deck) and never behind the headline, lede or CTA; decoration drifting behind a
button reads as a rendering fault, not atmosphere. Each carries a ~40px motion
envelope (bob ±11px plus parallax travel), so clearances are sized for that,
not for the static position. Below 960px the hero collapses to one column and
that negative space disappears, so they are dropped rather than shuffled into
the copy.

**Reveal** — batched on the next animation frame and staggered 70ms apart
(capped at 490ms) so a row assembles as a wave. The flush is scheduled on rAF,
*not* a resettable timeout: a fast scroll fires the observer faster than any
debounce window, so a re-armed timer can be starved indefinitely and strand
cards invisible.

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

## CSS traps this codebase has actually hit

Each of these shipped at least once and was found by measuring, not by looking.
Check for them before trusting a visual pass.

- **A grid item with auto inline margins collapses to zero if all its children
  are absolutely positioned.** Auto margins suppress grid's default `stretch`,
  so the item falls back to fit-content width — and absolute children
  contribute nothing to that. `.hero-deck` had `max-width:440px;margin:0 auto`
  under 960px and rendered 0×0 on every phone, while its caption pill, still
  absolutely positioned, landed on top of the hero buttons. Use an explicit
  `width:min(100%,<max>)` with `margin-inline:auto` instead.
- **A zero-size box passes every overlap test.** The bug above survived an
  automated sibling-overlap scan because a 0×0 rect intersects nothing. Any
  layout assertion needs a companion "is this element actually non-zero" check.
- **HTML `width`/`height` attributes beat `aspect-ratio`** unless `height:auto`
  is also set. Cost us 363×800 hero images twice, in two different rebuilds.
- **A later `padding` shorthand silently clobbers an earlier `padding-inline`.**
  Use `padding-block` when the inline padding is doing full-bleed work.
- **Reading an element's rect while animating it feeds your own offset back
  into the next measurement.** See the ambient layer notes above.
- **A bare `1fr` grid track carries `min-width:auto`**, so it inflates to the
  longest unbreakable word instead of shrinking. `AlmaFlowClim` and
  `applications` pushed card bodies ~30px outside their own cards at 280px,
  where `overflow:hidden` amputated them. Use `minmax(0,1fr)` in any grid that
  has to survive a narrow screen.
- **`justify-content:center` on an overflowing flex column pushes content out
  of BOTH ends**, and the overflowing top is unreachable — `scrollTop` stays
  pinned at 0. The mobile menu lost two links and the language switcher this
  way in landscape. Use `safe center`, and always pair a full-screen overlay
  with `overflow-y:auto`.
- **`overflow:hidden` nullifies a flex item's automatic minimum size**, so it
  becomes the one item that absorbs all the shrink. The language pill
  collapsed from 46px to a 2px sliver with its 44px buttons clipped inside it.
- **A `z-index` on an ancestor caps every descendant.** `.wrap{z-index:1}` and
  `section{z-index:1}` meant the explorer dialog's `z-index:300` lost to the
  navbar's `100` — and the nav links intercepted clicks *through* the open
  modal. Overlays belong as direct children of `<body>`.
- **A `clamp()` whose `vw` coefficient is small never engages on a phone.**
  All 25 fluid declarations here sat at their minimum from 280px to ~700px,
  because the floors were written as desktop minimums — a 42px headline on a
  280px screen. Anchor the ramp between two real viewport widths (360→1440)
  so it interpolates across the range you actually ship to.
- **Width is the wrong query for touch.** An iPad in landscape is 1024px wide
  and correctly gets the desktop nav, but it is still driven by a finger.
  `@media (pointer:coarse)` catches it; no width query ever will.

## Breakpoints

`960px` is the mobile boundary — the structural collapse and the mobile pass
fire together. They used to be split (960 and 720), leaving a 240px band that
got single-column *desktop-sized* components: measured 14292px tall at 721px
against 9255px at 719px, so crossing the breakpoint upward made the page 55%
**taller**. That band is iPad portrait, iPad Air, and every large phone in
landscape.

Height matters as much as width. A phone in landscape is ~390px *tall*, so
`@media (max-height:560px)` carries the short-viewport rhythm, and `scene/`
abandons its stacked layout entirely in landscape — the stack needs 432px of
budget in a 390px viewport and no plate size can rescue it.

`--nav-h` is the measured navbar height. Hero top padding and
`scroll-padding-top` both derive from it, so the three can never drift apart.
