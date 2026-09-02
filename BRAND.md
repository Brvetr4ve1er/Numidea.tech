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

## The Engineering hero

Both media live in the **right column**, terminal above plate, with the copy
centred against them across both rows. The plate used to span `1/-1` into a
full-width second row, where its 16:9 image alone is ~630px — that one line
made the hero 1957px tall, a full screen of dead space between the fold and
the title block. Stacked, the plate is the same ~550px it is in every other
theme and the hero is ~1200px.

Parallax is retired on both once the grid collapses to one column. Stacked,
they drift toward each other — the terminal carries the default 64px envelope,
the plate is capped at 26 — and closed a 32px gap into a 42px overlap. Two
columns gave that motion somewhere to happen; one column does not. Same rule as
the floaters: **clearance is sized for the motion envelope, never the static
position.**

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

## Framing: the sweep

Every `grid-template-columns` in both stylesheets uses `minmax(0,<n>fr)`. A bare
`fr` track carries `min-width:auto` and inflates to its longest unbreakable
word instead of shrinking — 59 grids carried that fault. `repeat(auto-fill,
minmax(180px,1fr))` is correct as written and must be left alone: the `1fr`
there is already inside a `minmax`.

**The 12-column desktop grid needs an explicit default span.** At ≥1100 both
`main.wrap>section` and `.footer` become 12-column grids, but the default-span
rule read `main.wrap>section>*` — so no footer child had a span, and each one
landed in a single 1/12 track: 72px wide holding 191px of content, at every
width above 1100. Any element given `display:grid` by that block must also
appear in the default-span selector.

**Crops need an anchor.** A 16:10 screenshot cropped into a narrow portrait box
shows a meaningless slice of its middle — at 820px the Bordj Steel card read
"R L'AVENIR, ENSE". `object-position:top left` keeps the part that identifies a
site: its logo, nav and headline.

**An audit that ignores clipping ancestors reports mostly noise.** The first
sweep returned 12 faults; 9 were decoration correctly clipped by `.hero`,
`.preview` or an `overflow:hidden` parent, or elements with `display:contents`
whose rect is always zero. Any overflow assertion must walk the ancestor chain
for a clipping context and skip `display:contents` before it reports anything.

## The icon set

Eleven hand-authored SVGs, one per service. No icon library and no raster
assets — the same rule the floaters follow. The system:

```
viewBox="0 0 24 24"   stroke 1.5, currentColor, fill:none
straight runs, true circles, 45° diagonals — no freehand curves
every mark inside the 24x24 frame (asserted, not assumed)
```

They draw themselves via `stroke-dashoffset` on reveal, so each shape must be a
stroked path — a filled shape will not animate. `.glyph svg{overflow:visible}`
means a path outside the viewBox will still paint rather than clip, which hides
the mistake; the check asserts `getBBox()` sits inside 0–24 in both axes.

Each is specific to what it labels: a registration mark for L'Aperçu, a viewport
for web, three plates in register for identity, a two-into-one route for
pipelines, a scope with an off-centre reading for market intelligence, steps and
a vector for growth, a drilled tag for commerce, a ruled artboard for design,
axes and a series for data, a hub-and-four graph for knowledge systems, a pinned
die for AI tooling.

## Enclosure

Every child sits inside its container's **padding** box, verified at nine widths
from 320 to 1600. The one flagged exception — a 60px decorative glyph reaching
6px past `.art` — is clipped by `.thumb`'s `overflow:hidden`, so it is enclosed
in what actually paints. Any enclosure assertion must resolve the nearest
clipping ancestor before it reports; the check that does not will report
decoration that the design already frames.

## Fonts are self-hosted

`assets/fonts/` holds the woff2 binaries; `assets/fonts.css` holds the
`@font-face` rules. Nothing on the critical path touches a third-party host —
that is what "0 dépendance" has to mean if the title block is going to print it.

Trimmed to the subsets this site actually sets type in — **latin, latin-ext,
arabic**. Cyrillic, cyrillic-ext and vietnamese were dropped: 24 faces nothing
here is typeset in. `unicode-range` is preserved, so loading is usage-driven —
a French reader fetches 7 files, and the Arabic binaries are fetched only when
`lang=ar` actually renders Arabic glyphs. 543 KB on disk; no visitor pays that.

Regenerate by fetching the CSS2 API with a modern User-Agent (an old UA gets
you TTF instead of woff2), keeping only those three subsets, downloading each
url() and rewriting it to `fonts/`. Fonts are OFL-1.1; the license ships in
`assets/fonts/OFL.txt` and must stay there.

**Every screenshot taken in a sandbox that blocks fonts.googleapis.com was
lying.** The arcanum h1 is Cinzel, but with the webfont blocked it painted in
the Georgia fallback, and the h1 box measures 256px against Cinzel's 320px.
Judging type or vertical rhythm from a run where the faces never loaded means
judging a different design. Check `document.fonts.check()` before trusting a
screenshot of type.

## The font swap must not move the page

`font-display:optional`, not `swap`, and the above-the-fold faces are preloaded.
That pairing is what actually removes the shift: preloaded same-origin files
almost always make the deadline so the page paints in its real type, and when one
misses, `optional` keeps the fallback for the whole load instead of reflowing
mid-read. `swap` guarantees a reflow every time a face lands after first paint.

Metric-matched fallback faces back this up for the rare miss — `size-adjust` plus
ascent/descent/line-gap overrides, computed from the woff2 with fontTools and
calibrated against an **unadjusted twin** of the same `local()` list. Calibrating
against a generic stack instead is wrong: `system-ui` and `local("Arial")` resolve
to different files, which put Geist 12% out and left the hero lede a line short.

**`ch` is a font metric, so it is not a layout unit.** `1ch` is the advance of
"0", and Geist's "0" is 19.21% wider than the fallback's while its average glyph
is only 1.92% wider — a 17pp spread one `size-adjust` scalar cannot satisfy. All
34 `max-width:Nch` are now `em`, computed from the intended face's own "0", so
the measure is identical once the face loads and independent of which face
resolves. Do not reintroduce `ch` for layout width.

Know the limit: a single `size-adjust` cannot make *every* string wrap
identically, because it matches one number against a whole width distribution.
Fallbacks narrow the gap; only preload + `optional` closes it.

**Measure CLS with the layout-shift API, not by diffing two page loads.** Under
`optional` those two loads legitimately differ — that is the feature, not a bug —
and a geometric diff reports it as a 152px failure.

## The language is resolved before first paint

The markup is baked in French. For a visitor whose saved language is EN or AR the
deferred `applyLang()` rewrote 194 nodes and flipped `dir` *after* the page had
painted — measured at CLS 0.63, the largest shift on the site.

`lang` and `dir` are now set in the head bootstrap, alongside variant and theme.
The text cannot be swapped that early — the dictionary is in app.js and none of
those 194 elements have been parsed yet — so when the baked language is not the
one about to be shown, the bootstrap sets `data-i18n-pending` and an inline
`<head>` style holds `body{visibility:hidden}` until app.js has done the swap.
A French visitor never takes that path and paints exactly as before.

Two rules for touching this:

- **The guard style must stay inline in `<head>`.** Moved to an external sheet it
  applies after the paint it exists to suppress.
- **The release must stay failsafe.** `DOMContentLoaded` fires after deferred
  scripts, so if app.js executed at all it has already released the hold; that
  event bounds the worst case to parse time instead of a timer. Verified with
  app.js blocked entirely: the page reveals, degraded to the baked French copy,
  rather than staying blank. With JS off the bootstrap never runs, so nothing is
  ever hidden.

The cost is honest: an EN or AR visitor pays roughly 100–200ms of FCP for this.
A French visitor pays nothing.

## The alternate sheet must be parser-inserted

Engineering ships as a whole alternate stylesheet. Loaded the usual way — a
`<link media="not all">` flipped by script — it is **not render-blocking**, so
the page painted in base styles and restyled when it applied: `.wrap` jumped
1190px to 1200px, CLS 0.0768 in about half of loads.

Three things do NOT make a script-chosen stylesheet render-blocking, all tested
by delaying the sheet 900ms and checking whether first-paint waited:

- removing `media="not all"` — necessary, nowhere near sufficient
- assigning `href` from a head script — this is what makes it *dynamic*, and a
  dynamic stylesheet never blocks
- adding `blocking="render"` — applies to parser-inserted elements only

What works is `document.write` of the `<link>` from the head bootstrap. It runs
while the head is still parsing, so the **parser** inserts it and rendering
waits. That is the legitimate use of `document.write`; the thing to avoid is
calling it after load. Only the theme actually in use is written, so the other
five neither download nor wait on 46KB — which they previously downloaded and
never used, because `media="not all"` still fetches.

**Layout-critical tokens belong in the render-blocking sheet.** `--max` and
`--gutter` for Engineering now live in `styles.css` under
`html[data-theme="engineering"]`, because `data-theme` is set before first paint
and that sheet always blocks. Colour and component styling can arrive whenever.

A theme switch made by clicking is user-initiated, so its restyle is excluded
from CLS by `hadRecentInput` — appending the link dynamically is fine there. Only
the boot path needs to block.

## Stress test

What the page does past normal conditions, measured rather than assumed. The
harness pushed it through 280–3440px viewports, Slow/Fast 3G with CPU 4–6×,
resource failures, keyboard-only use, axe across all six themes × three
languages, 190 rapid interactions, forced-colours, reduced-motion and print.

**Never fade the LCP element in.** The hero plate — the largest thing above the
fold — rose from `opacity:0` with the rest of the entrance choreography. Its
image was downloaded, `opacity:1` and visible at 3.6s on Slow 3G, but the
browser did not credit it as painted until 7.5s; with the fade removed, 3.7s.
The headline, lede and plate now rise with `transform` only (`hero-rise-solid`)
and are never transparent. The smaller elements keep the fade.

**Auto-rotation is an LCP hazard.** Every deck turn before the visitor's first
interaction re-elected LCP onto the new slide — a 3.6s LCP reported as 10.8s
because the deck turned at 10.8s. Rotation now waits for any interaction
(`held.idle`); LCP is finalised at that moment, so a rotation after it is free.
A visitor who has not moved sees the first, high-priority slide.

**`filter:blur` on a fixed full-viewport layer with animating children is
re-rasterised every frame.** The aurora cost 83ms/frame *at rest* under CPU 4×
— 12fps with nothing happening — and 17ms with it gone. The softness now lives
in the gradient stops; the fields animate on the compositor. Engineering's own
`blur(90px)` override went with it. Every theme: 0% dropped frames, resting or
scrolling.

**A hidden-until-JS reveal must be gated on JS having run, not on JS being
enabled.** `.reveal{opacity:0}` was unconditional and the only thing that
un-hid it lived in `app.js`; with that file blocked — a 404, a content
blocker, a corporate proxy — 27/27 sections stayed invisible. `<noscript>`
covers JS being *disabled*, not JS failing to load. Now `html.js-ready`, set
by app.js as its first act, is the only thing that hides anything; if the page
has already painted when the script lands, on-screen content is revealed in the
same style pass that arms the gate, so nothing blinks off.

**Preload only what paints above the fold.** Five font preloads (125KB) ahead
of `styles.css` held first paint to 4.2s on a 400kbps link. Four now (96KB):
body, mono, the display serif, and Geist 600 — the headline weight in the themes
that do not use Cinzel. Dropping 600 too measured CLS 0.02 on daylight and mono:
the face landed ~170ms after layout and the hero reflowed. The preloads stay
*ahead* of the stylesheets; moving them behind produced the same shift.

**A harness that scrolls a `scroll-behavior:smooth` document lies.** Each
`scrollTo` restarts a smooth animation, so a tight loop never actually passes
anything, and a final `scrollTo(0,0)` cancels the last one — "26 of 27 sections
never revealed" was the harness, verified by instrumenting rAF and scrollY. Set
`scrollBehavior='auto'` before programmatic scrolling.

**`--faint` was decoration by name and text by use.** Title-block labels,
indices and the sheet footer set type in it at 2.3–3.3:1. Raised per theme to
≥5:1 against every panel colour, with `--crimson-text`/`--teal-text` tokens for
accents used as text (crimson on noir was 1.9:1). Engineering's `--fg-3` and its
white-on-orange buttons likewise. Nothing on the page is set below 11px.

**Measure contrast on a settled page.** The reveal fade is 0.9s plus stagger;
axe run at 0.7s reads text mid-fade and reports the blended colour. Three
themes "failed" that way on tokens that pass.

**Engineering's `.step` grid needed explicit placement.** Three auto-placed
children in a `36px 1fr` grid put the heading in the marker column — 36px wide
holding 105px of text, wrapping one letter per line. The framing audit had only
ever run on the default theme.

**`transition:all` animates the focus ring.** Nine interactive rules used it, so
on keyboard focus the 2px outline grew from 0 over 200–300ms — instant is the
requirement, and a probe at the instant of focus saw no ring at all. Those rules
now list their transition properties; outline is not among them.

Also: `<main tabindex="-1">` so the skip link actually moves focus; the page
behind the portfolio dialog is `inert` while it is open; a print stylesheet
(ink-safe palette, decoration off, gradient type as solid ink); the validator's
15 findings cleared. Slow 3G FCP 4.2s→3.6s, LCP 10.1s→3.8s; Fast 3G LCP
3.0s→1.4s; 190 rapid theme/language/modal/resize interactions: +0.0MB heap,
+0 listeners.

## Second full audit — what it still found

**`transition:all` and the focus ring.** Nine interactive rules animated the
outline in from 0 over 200–300ms. A `transition-property` list now excludes it —
placed at the *end* of each sheet, because any later `transition` shorthand
resets the property list back to `all` (the first attempt, placed early, changed
nothing). Engineering restates it for the same reason.

**A token name that means two things.** Project cards set an inline RGB triplet
for `rgb(var(--…))` fills; Engineering uses the same name, `--accent`, as a whole
colour, including in its `:focus-visible` outline. Inside a card that outline
became `2px solid 95,214,134` — invalid — and the project links had no focus
ring at all. The card triplet is now `--brand`. A custom property is a global
name; two sheets may not use one for two types.

**Preloads are language-aware and script-written.** The preload scanner requests
static `<link rel=preload>` before any script runs, so document order cannot put
an Arabic visitor's faces ahead of the Latin ones. All four are now written by
an early inline script from the saved language. Latin text on an Arabic page is
the logo and the project names, set in Geist 600 — leave that out and the logo
widens 6px when it lands (CLS 0.03 at 1024px).

**Chrome scores a shift for a box that existed and moved, visible or not.** The
language hold as `visibility:hidden` and as `opacity:0` both measured the same
CLS through the text swap. `display:none` gives the page no box to have moved:
it lays out once, in the right language.

## The background

A construction grid, not a pattern. 64px hairlines masked to fade out by ~76%
of the viewport height, so the sheet is established at the top and gone behind
body copy. It replaced a honeycomb tile and a soft-light film grain: noise over
a page that is otherwise precise reads as a rendering fault rather than texture.
The atmosphere behind it is two radial gradients (a brass crown, a deep floor),
down from four that overlapped into a single haze, and the aurora sits at .18.

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

## The desktop grid

`main.wrap > section` is a **twelve-column grid** above 1100px, and everything
snaps to it. Before, each block was left-flush with its own arbitrary
`max-width`, so the right edge landed on six different values (725, 893, 928,
1008, 1108, 1272px) — nothing shared a rhythm, which is exactly what reads as
"stray components scattered about". Right edges now fall on grid lines.

Section headers are two-column: title in columns 1–6 (1–5 above 1500px), lead
paragraph in 8–12, bottom-aligned to the headline. That single change is what
stops a wrapped headline sitting beside half a screen of void.

`--max` is `min(1580px, 93vw)`, not 1200px. At 1920 the old value left **43%
of the screen as empty margin**; it is now 24%. The cap stays, though — past
about 1600px a text column stops being readable, so wide screens get margin by
intent rather than by neglect.

Content spans worth knowing: `.steps` runs three abreast with the rail turned
horizontal (the node sits ABOVE its copy, or the rail strikes through the
titles); `.faq-list` runs two columns; `.preview` splits identity-left /
argument-right so the signature card doesn't repeat the page's own mistake at
card scale.

## The hero as a drafting sheet

The hero is a **title block** in the `scene/` dialect, not a marketing header:
a sheet frame with corner L-brackets, a dimension line under the headline
annotated with the workshop's real coordinates (36°04′N · 4°46′E), and a
five-field block along the bottom edge carrying values that are all true and
checkable — 0 dependencies, no build step, FR·EN·AR with native RTL, an 18s
GitHub Actions deploy, 5 of 7 projects live.

Real drawing sheets put the title block as a strip along the bottom, not a
corner box; on a hero-width canvas a corner box would simply be lost. It
reflows 5 → 2 → 1 columns.

`--nav-h` must be MEASURED, not assumed. It read 88px while the navbar was
actually 72px at desktop, so the sheet frame's top edge and both upper corner
brackets — the entire point of the frame — were painted underneath the navbar
and never seen. The token exists precisely to stop that drift; it only works if
someone checks it against the rendered box.

## The hero plate

The hero used to be the stock template: copy left, three static thumbnails
fanned right. It showed 3 of 5 clients at a size where nothing was legible —
the studio's strongest asset used as texture.

It is now **one live client site at a time, big enough to read**, cycling all
five with the real name, category and URL. Rules that matter:

- **Wipe, never cross-fade.** Two flat UIs dissolving through each other is a
  smear; a hard edge with a bright leading rule keeps both razor sharp. Same
  principle `scene/` is built on. The image swaps at the midpoint, hidden
  behind the bar.
- **All five captions live in the DOM**, one shown at a time, each with its own
  `data-i18n`. The rotator toggles a class and never touches translation, so
  `applyLang` keeps working untouched and it degrades to a static first slide
  with JS off.
- **Pausing is a latch, not a timer state.** Clicking a rail tab re-arms the
  interval — but the pointer is already inside the component at that moment, so
  no fresh `pointerenter` will ever fire to pause it again, and it resumes
  rotating under someone who just chose a slide. `held.hover/focus/hidden` is
  consulted every time the timer is armed.
- Engineering restyles the plate in full rather than letting it inherit;
  otherwise the base sheet's crimson, rounded card and CRT scanlines leak into
  a surface that owns none of them.

## Iconography

The service marks are **geometric constructions on the hexagonal motif the
page is already textured with** — an aperture, a compass vesica, an
escapement, an astrolabe, a lattice — not stock pictograms. They were a house,
a browser chrome, a gear and a shopping bag, which belonged to no identity at
all.

Every mark drives at least one animation hook, so the set has life rather than
sitting inert: `.spin` (rotor), `.sweep` (radial arm), `.gem` (pulsing
diamond), `.r2`/`.r3` (radiating rings). Keep `pathLength="1"` on every
drawable element — the stroke-dasharray draw-on depends on it.

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
