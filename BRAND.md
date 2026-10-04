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

## The other three pages

`index.html` is not the site. An error scan across all four pages found the
render-blocking third-party font link — the one whose removal from `index.html`
took first paint from 13s to 0.3s when the host is unreachable — still present
on `404.html`, `hub/` and `scene/`. Every family `404.html` and `scene/` asked
for was already in `assets/fonts/`, so both now use the local sheet. `hub/` uses
Syne and Space Mono, which are not self-hosted, so its link stays third-party
but is loaded `media="print"` + `onload` and can no longer hold the page.

Also found there: `scene/` had an `<h1>` and a link that only JavaScript ever
filled, so with JS off the page carried 64 characters and a screen reader had
nothing to announce (both are seeded from the first card now, then rewritten at
runtime); `404.html` had no heading and no landmark at all; and `hub/` and
`scene/` declared no favicon, so every visit logged a 404 for `/favicon.ico`.

**Whatever is verified for the main page is not thereby verified for the
others.** Run the checks against all four.

## The anti-slop sweep

The generic layer came off all four pages. What stays is the drafting identity —
the construction grid, the title block, dimension lines, the real client
screenshots, the hand-drawn icon set. What went was the vocabulary any generated
page arrives with:

- **Gradient-filled text.** Five uses, including the primary headline. Not only
  the loudest "generated" tell in the set — `--grad-text`'s own stops measure
  **2.7:1 on noir and 3.1:1 on daylight**, under the 4.5 floor, on the largest
  text on the page. **axe reported zero contrast violations the whole time**:
  gradient-filled text computes as `color:transparent`, so the rule skips the
  node. A clean axe run does not mean the type is legible.
- **Perpetual motion.** 31 infinite animations across the four pages — drifting
  colour fields, bobbing geometry, spinning icons, pulsing dots, blinking
  carets, a sweeping "glitch" bar. Now **zero**: nothing on any page animates
  forever. Two of them were also layout bugs: the hub's identity scramble
  reflowed its own `<h1>` every frame (**CLS 1.16**), and the glitchbar animated
  `top`, a layout property.
- **The aurora**, three colour fields under every page, and the neon bloom on
  buttons and chrome (a 32–40px glow became a hairline ring).

**Flattening a gradient changes what the text sits on.** Dropping
`--grad-blood` from the primary button left near-white on arcanum's gold at
**1.67:1** — the gradient's dark end had been carrying the label. Each palette
now states its own `--on-crimson`, because there is no single answer: ice on
noir's red is 5.73:1 and 2.68:1 on arcanum's gold.

**Regex is the wrong tool for CSS.** Two sweeps here damaged the stylesheet —
`[^}]*\}` stops at the first inner brace of an `@keyframes` block, which left
nine orphaned closing braces the first time and a fragment that silently killed
the next rule the second (`.frame-cap` lost `position:absolute` and climbed to
the top of the portrait). Remove rules by matching braces, and check the balance
before believing the result.

**Reserve the axis that actually varies.** The hub's cycling heading was fixed
by `min-width:20ch` — wrong axis. It blew the box to 1247px and left the shift,
because what varied was the *wrap count*. Two lines of its own line-height was
the fix.

## Every page needs its own preloads

`index.html` had them; `404.html` and `scene/` had none at all, so every face
arrived after first paint and the swap resized the centred content — 404's
`<main>` jumped 420px to 474px. Each page now preloads exactly the faces it
paints in, and the paths are relative to the page (`../assets/fonts/` from
`scene/`, which one missing `../` turned into a 404 the run caught).

**Content that JavaScript fills must be seeded in the markup.** Scene's title
block shipped five empty label spans and grew 102px to 141px when the script
filled them; its callout link used `[hidden]{display:none}`, so on the one sheet
with no live URL the box left the flow and moved the callout ~40px every time
that sheet came round. Labels are seeded now and the hidden link keeps its box
(`visibility:hidden`) — `[hidden]` still keeps it out of the a11y tree and the
tab order.

**Reserve for the longest case, on the axis that varies.** Scene's callout
needed three: the copy (43–86px across sheets), the project name (one sheet
wraps to two lines), and the link. Reserving one and re-measuring found the
next.

**A sweep is only as wide as the files it reads.** The anti-slop pass covered
`assets/styles.css` and missed the `<style>` block inline in `404.html` — which
still held the last gradient-filled string on the site and a `34ch` width, both
of which the pass existed to remove. `hub/` kept four `ch` widths for the same
reason. Grep every stylesheet *and* every inline block.

## Syne and Space Mono are self-hosted too

`assets/fonts-hub.css` holds them; `hub/` loads it render-blocking, like any
first-party sheet. **No page on this site now makes a third-party request.**
Trimmed to latin and latin-ext (hub sets no Greek or Vietnamese), 208KB, all ten
faces `font-display:optional`.

**A fallback font hides how wide the real one is.** Every size on hub had been
tuned against the metrics of whatever the system substituted for Syne. The real
face runs roughly twice as wide, so both display headings overflowed the moment
it loaded: the identity wanted 1465px in a 739px column and was clipped behind
the portrait, and the section heading put 223px of horizontal scroll on the page.
Nothing was wrong with the CSS — it had simply never been measured against the
font it names.

**Viewport units cannot size a column that does not track the viewport.** The
identity column is *narrower* at 1280 (585px, two-up with the portrait) than at
768 (707px), so no `vw` clamp fits both. Both headings size from their own column
with `cqw` (`container-type:inline-size` on the parent), which is exact at every
width and needs no breakpoints. It also matters that these identities are
unbreakable tokens — `VOIDSPLUNKER.std`, `EVERY&nbsp;WORLD.` — with nowhere to
wrap, so the type must fit or it overflows.

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

## Generated illustrations

`assets/illus/` holds 13 monochrome rasters (248K total) drawn as white line
art on pure black. They are applied as **CSS luminance masks over
`currentColor`**, never as `<img>`:

```css
.ill{background:currentColor;
  -webkit-mask-image:url(illus/x.png);mask-image:url(illus/x.png);
  -webkit-mask-size:contain;mask-size:contain;
  -webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;
  -webkit-mask-source-type:luminance;mask-mode:luminance}
```

One asset therefore re-tints itself across all six palettes — teal on
arcanum, orange on engineering — instead of shipping six copies. Keep both
the `-webkit-mask-source-type` and `mask-mode` lines; older WebKit only
honours the first.

**Size is the whole problem.** These are detailed technical renderings, not
glyphs. Below roughly 90px they collapse into illegible smudges. Three
placements were built and torn out again before this landed:

- FAQ summary rows (34px) — unreadable. The figure moved into `.faq-a`, the
  open answer panel, at 92px, where it also belongs semantically: it
  illustrates the answer, not the question.
- hub footer column headings (18px) — unreadable, and there was no room to
  grow. The four hub marks became `.lgroup` headers in the archive grid at
  60px, which also gave that flat 18-tile list the grouping its source
  comments had always described.
- `#how` step tiles beside the copy (86px) — legible but cramped at the 3-up
  breakpoint. The tile now sits *above* the text there via
  `grid-template-areas`, at 124px.

Regenerate rather than shrink-to-fit: `faq3`, `hub-design`, `hub-dev` and
`hub-studio` were re-prompted for "large simple readable silhouette" after
the first pass produced scenes too busy to survive downscaling.

Pipeline: `sharp().resize(512).greyscale().linear(1.9,-38).png({palette:true,
colours:16})`. **Check polarity after every batch** — one render came back
inverted (mean luminance 242/255) and masked to a solid block. Assert the
output mean is low before writing.

Every figure lives in a fixed-size box, so a late-decoding PNG has nothing to
reflow: measured CLS stays 0.0000 on index. They are `aria-hidden` throughout,
and `@media print` drops them — the mask's backdrop is a `background`, which
printers discard, leaving an empty bordered box.

### Two traps this cost time on

`file://` blocks masks exactly as it blocks fonts (`net::ERR_FAILED`, no
console error). Any harness checking mask rendering **must** serve over HTTP
or it will report a working mask as broken.

Wrapping step copy in `.step-body` broke the engineering sheet silently: it
placed `.step h3,.step p` with `grid-column:2`, and those were no longer grid
children. When a component's children are re-parented, grep every stylesheet
for rules that place them — `grid-column`, `grid-area`, `:nth-child`.

## Text tokens vs fill tokens

Every palette defines two versions of its accents: `--teal` / `--crimson` are
**fills** (borders, glows, icon strokes, chips) and `--teal-text` /
`--crimson-text` are **text**. Never set `color:` from a fill token.

The bug hides in opposite directions, which is why it survived so long:

- `--teal` as text looks fine on every dark palette (where `--teal-text` *is*
  `--teal`) and fails on Daylight (`#0A9C8E` on white, ~3.4:1).
- `--crimson` as text looks fine on Daylight and fails on the dark palettes —
  `.tl-date` measured **1.05:1** on Noir. `--crimson-hi` is a hover highlight
  and is never text either.

49 rules were corrected in one pass with a lookbehind that matches a bare
`color:` property and leaves `border-color` / `background-color` alone.

**Per-project colour as text** (`--brand` on the index, `--acc` on scene/)
cannot be guaranteed legible on an arbitrary palette. Mix it toward the
palette's own ink: `color-mix(in srgb, rgb(var(--brand)) 55%, var(--ice))`.
`--ice` is the foreground in every theme — light on dark palettes, dark on
Daylight — so the hue stays the client's and the contrast becomes the theme's.

## No literal palette colours in shared rules

A shared rule that hard-codes a colour is a rule that is correct in exactly one
palette. Three of these were found by the sweep, each now a token:

- `--band` — the wash behind every `.band` section was literal navy at 34%,
  turning Daylight's white page mid-grey-blue under teal text (1.55:1). It had
  been patched once before, but only for `[data-variant="b"]`.
- `--shade` / `--shade-k` — every card shadow was literal black at .8–.92.
  Invisible on a dark ground; a grey smear under every card on a light one, and
  the hero plate's shadow fell across its own caption (2.95:1). Shadows keep
  their individual strengths: `rgb(var(--shade) / calc(.85 * var(--shade-k)))`.
- The estimator readout and service tiles used literal arcanum navy.

Hub and Scene each carry their own palettes and had never received the
`--faint` fix the main sheet got long ago (2.83:1 and ~3.2–4.0:1).

## RTL

The ambient glows in `body::before` are placed for the LTR layout. In Arabic
the layout mirrors and the glows did not, so the text column and logo sat on
the warm glow. `html[dir="rtl"] body::before{transform:scaleX(-1)}` mirrors all
six palettes at once; the layer is a fixed field of gradients with nothing
directional in it, so the flip is exact.

Letter-spacing on Arabic: Chromium renders tracked and untracked Arabic
identically (it suppresses tracking on cursive scripts, per the CSS spec), so
the 38 widely-tracked label rules are not broken there. **Firefox is
unverified** — if it applies the tracking, connected letters will pull apart.

## Thumbnails

`.proj .shot` is overscanned to 124% height for its parallax drift, so
`object-fit:cover` crops ~42px off each side. Centred, that cut every
left-aligned headline mid-word ("e monde, uidé et rganisé"). The anchor is
**per site** — wherever its logo and headline actually sit: top-left by
default, top-right for Nomara (RTL), top-centre for Bordj Steel (centred).

Do not put `data-parallax` on an element inside a tight `overflow:hidden` card.
The founder avatar drifted upward and was sliced off by its own card's top edge.

## `npm run sweep`

Measures what is actually painted. It renders each page twice — once to
collect every text run, once with all text transparent — and samples the real
background under each run from the second render. That sees gradients,
textures, translucent panels and parallax fields; a declared-colour check sees
none of them. It self-hosts, covers all six themes × FR/AR plus hub/, scene/
and 404, and exits non-zero on any failure.

It took 549 flagged → 0, but **most of the first 549 were the harness, not the
site**. Every one of these produced confident, wrong results before it was
caught — verify before you fix:

- `color-mix()` serialises as `color(srgb r g b)` with **0–1** channels.
  Parsed as 0–255 it reads as near-black, and correct labels "fail" at 1.2:1.
- Text clipped by an `overflow` ancestor is laid out but never painted, so the
  sampler reads whatever lies underneath. The collapsed CV panel produced ~21
  false failures per theme; it is now audited open, as people read it.
- Lazy images race the screenshot. Thumbnails "went blank" in five themes in a
  pattern that changed from run to run — random is the tell. Force
  `img.decode()` before capturing.
- `pkill -f <pattern>` matches the shell command that contains the pattern and
  kills itself (exit 144).

When two tools disagree, look. axe caught one failure the sweep missed (the
retainer line, at 4.49:1); the sweep caught hundreds axe's sampling did not.

## Three commands, all green

- `npm run check` — repo invariants (i18n balance, asset references, stamps).
- `npm run sweep` — painted contrast, six themes × FR/AR plus hub/scene/404.
- `npm run audit` — 30 browser runs, desktop and touch: CLS, LCP, axe,
  overflow, reveals, tap targets, images, animations, JS, network.

`check` had shown the same ✗ on every run for weeks — it read a `document.write`
string concatenation as a file path. It was waved through as a "known false
positive" each time, which is precisely how a check stops being read. It now
skips concatenation fragments **and verifies their real targets** from the
literals (the Engineering stylesheet constant and each preloaded font name);
a deliberately misnamed font is caught. A permanently red check is worse than
no check.

Audit traps, on top of the sweep's list:
- A tap-target check without WCAG 2.5.8's spacing exception flags the whole
  desktop nav. axe applies the exception; match it.
- Reveals run 1s plus a stagger delay — sample sooner and you measure a fade.
- The Engineering deploy log scrolled sideways on phones only once the typing
  animation reached its longest line, so the axe failure came and went. It now
  wraps below 600px.

## Market comparison ("Ici et ailleurs") and pricing models

The pricing section compares each project type across Algeria, Numidea,
France and the US, then explains the four billing models and what moves a
quote. Every external figure was read at its source, not taken from a search
summary:

| Market | Source |
|---|---|
| Algeria | Onyxlab Baromètre 2026 — Confirmé → Agence columns |
| France | Tandem Studio (sites), Les Créavores (103-price dataset, June 2026), HeySimon (identity), Malt day rates via LeFreelance |
| USA | Pitchsite (sites, apps, hourly), 8GNC (branding), Clutch (agency hourly, Sept 2026) |
| FX | Bank of Algeria official rate, 1 Oct 2026: €1 = 151.06, $1 = 133.66 DZD |

Each cell runs from the low end of an experienced freelancer's range to the
high end of an agency's; `+` marks an open upper bound. The Bank of Algeria
site serves an incomplete certificate chain, so the rate was cross-checked
against an independent page (agreed within 0.3%) rather than fetched with
verification disabled. The parallel-market rate (~275 DZD/€) is deliberately
not used: an international client pays through official channels.

**Where the numbers live — update all of them together:**
- market ranges: `MARKET` in `app.js` §14 **and** the static cells in
  `index.html` (the static values are the JS-off fallback)
- exchange rate: `FX` in `app.js` §14, the `mk.note` string ×3, and the
  static callout figure
- Numidea's column: nowhere — it is computed from `PRICE_MODEL`

**The estimator now matches the tier cards.** It didn't before, despite a
comment claiming it did: at defaults it quoted a showcase site at 60–120k
against Essentiel's 90–160k, and a custom site at 160–320k against Studio's
180–420k. The table would have put those side by side. `base_u` now spans
each tier's stated scope (Essentiel 1–5 pages, Studio 6–15), so the cards,
the estimator and the table agree to the dinar.

**The Numidea column comes first.** The table keeps its columns on a phone and
scrolls inside its own frame. With Algeria first, Numidea's own prices started
off-screen with nothing to say they were there.

### Ranges must not wrap apart

French uses a space as the thousands separator, so every space in
"18 000 – 60 000 DA" was a line break, and the retainer line rendered as
"18 000 – 60" / "000 DA". Three characters fix it:
- U+202F narrow no-break space inside a number (`18 000`)
- U+00A0 no-break space before a currency (`000 DA`)
- U+2060 word joiner after the en dash. The dash is Unicode class BA
  ("break after"), and a no-break space after it does **not** cancel that.

All pricing strings in the dictionaries and the static markup carry these. A
browser test confirmed no range splits at 1280/1024/768/390 in FR/EN/AR.

## hub/ — the artist's page, not the studio's

The hub is Yasser's own page (b4vetrave1er / VOIDSPLUNKER.std): his art,
his design work, his social presence. **Client websites do not belong here**
— they live on the Numidea page. A "Selected Work" section of the five client
sites was added once and removed at the owner's request; `npm run check` now
fails if any project URL appears in hub/.

- **Hero frame:** until the pose photos exist, `#portrait` holds four pieces
  from the collection as a contact sheet. The scroll-driven pose index (0-3)
  lights one strip at a time; `.portrait:has(.pose) .sheet{display:none}`
  retires it when the photos are dropped in. Update `.frame-cap` then too.
- **The Collection:** 28 pieces from the DeviantArt gallery (br4vetr4veler5),
  self-hosted in `hub/art/` (`-s` 480w for the grid, `-l` ≤1100px for the
  viewer) because the audit fails any third-party request. Filed as Ink /
  Covers / Skies. A CSS-columns masonry keeps every piece at its own aspect;
  captions are always visible (hover-only titles vanish on touch). Left out:
  the two adult-rated pieces, a duplicate, and the April 2025 series whose
  titles are image-generation prompts — ask before adding those back.
- **The viewer** is a native `<dialog>` (focus trap and Esc for free). It only
  intercepts a plain click, so cmd/ctrl-click still opens the DeviantArt page,
  and with scripts off every piece is just that link. Its placeholder `src` is
  a real 1×1 GIF: `data:,` counts as a broken image in the audit.
- **Design:** the 12 Behance projects on the profile's first page, covers
  self-hosted, view counts as read from the profile.
- **Social highlights:** Behance and DeviantArt figures as the public profiles
  showed them in October 2026 (hand-updated, never fetched at runtime).
  Instagram shows no public count without signing in, so its card carries no
  number rather than a guess.
- The footer's link columns were removed: the archive grid is the one list.
  Handles with no verified URL are a single "coming soon" line.

## Founder section — the CV is the source of truth

Every date, title and one-liner in the founder card comes from
`assets/cv_yasser_hamisse_2026.pdf`. The PDF is vector text over an empty
image overlay, so extract it with pdf.js (`pdfjs-dist`, legacy build);
pypdf breaks on this machine's cryptography binding. Edit the CV and the site
together.

- **Timeline order is the CV's:** current roles first, then past work newest
  first. It read as scrambled only because the site dropped the months and the
  "present" marker; ongoing roles now carry `.tl-now` (a filled rail node).
  Dates sit on their own line, because "Août 2025 – fév. 2026" fits no fixed
  column in every language. Arabic dates use the Maghreb month names
  (فيفري، أوت، جويلية).
- **The team is anonymized by design** (knowledge-base 12-organization): initials
  only, with the KB's verified responsibilities. No names or genders are
  documented, so the copy uses no pronouns for D, S and T (noun forms in
  Arabic, where verbs are gendered).
- **The CV panel animates a `0fr -> 1fr` grid row**, not `max-height`. The
  1600px cap it replaced was already within 100px of the French content on a
  390px phone. The row that collapses (`.cv-clip`) must carry no padding or
  border, or it cannot reach 0 and the closed panel shows a stray rule.

### French punctuation

French puts a space before `;` `:` `!` `?` and inside « », and an ordinary
space there lets a line begin with the mark ("; animation d'ateliers"). The
French dictionaries now use U+202F before `; ! ?` and U+00A0 before `:` and
inside guillemets (27 strings, URLs untouched). New French copy should follow
suit.

## The atlas — engraved plates and animated icons

The creative direction is the footer's own line, *rooted in Numidia*: the page
reads as an engraved atlas of the region the studio works from. Six numbered
plates, each a generated engraving (white line art on black) used as a
luminance mask over `currentColor` — the `.ill` rule, so every plate re-inks
itself in all six palettes from one file:

| Plate | Where | File | Motion |
|---|---|---|---|
| I — Les Bibans | `.vista`, full-bleed under the hero | `vista-far/mid/near.webp` | 3-layer parallax, twinkling sky, a constellation that draws itself |
| II — Arc de Trajan, Timgad | behind the `#work` header | `arch.webp` | parallax |
| III — Monnaies numides | beside the `#pricing` header (≥1100px) | `coin-*.webp` | three coins, three depths, each turns on its own axis |
| IV — Coupe des couches | behind `#stack` — the stack as strata | `strata.webp` | a core sample drilling across |
| V — Cap Carbon, Béjaïa | behind the contact channels | `lighthouse.webp` | the beam sweeps |
| VI — Le Grand Erg | between `</main>` and the footer | `dunes.webp` | parallax |

Plus two uncaptioned figures: a lantern (fanous) hanging in the `#faq` gutter
(≥1280px, swings), and the founder's workbench behind the founder card. The
mid layer of plate I is a generic round tomb, **not** the Medracen — the
generation came back looking Greek, so it is never captioned as Medracen.

**Depth needs occlusion, and masks cannot occlude.** Each vista layer is two
boxes: a fill (`--void`-family colour) clipped to that layer's skyline, then the
ink. The skyline polygons are traced from the engravings by
`scripts/plates.mjs` (first bright pixel per column, 160 columns) and live in
the stylesheet. Fills get darker toward the viewer — aerial perspective — so
the near palms read as standing in front of the ridge, not printed over it.
Layers are wider than the viewport and hang below the frame by more than their
parallax cap, so no drift bares an edge.

**Masks load lazily.** ~1MB of engraving would otherwise arrive with first
paint. Mask URLs are only assigned under `.lz-on`, which app.js §15 adds a
screen ahead of the viewport. The head script sets `data-lz` on `<html>`; with
scripts off it is absent and `html:not([data-lz]) .lz` loads them eagerly.

**Captions are solid chips.** 10px type on hatching measured 4.0–4.4:1 under
axe wherever the line work is dense; each `.pl-cap` sits on `--void`.

**Nothing loops forever — still.** The anti-slop rule stands and
`npm run audit` fails on any infinite animation. Every loop (icon or plate)
plays a few cycles (`--n`, default 3) and settles; `.live`, toggled by an
IntersectionObserver, removes and re-adds the animation, so it replays each
time the element comes back on screen. Off-screen, nothing runs.

### Animated icons (`.ai`)

32 inline icons on the 24×24 / 1.5-stroke grammar: proof stats, tiers,
pricing models, estimator, market, onboarding steps, stack groups, FAQ
questions, contact channels. Drawable parts carry **class `.p`** and
`pathLength="1"`; they draw in once (`.on`), then the idle loop runs (`.live`).

**Never select drawable parts as `[pathLength]`.** Chromium does not invalidate
a camelCase SVG attribute selector when an ancestor's class changes:
`.ai.on [pathLength]` matched in DevTools, yet the computed style stayed stale
at `stroke-dashoffset:1`. Icons elsewhere only drew because an ancestor's
`.reveal` happened to restyle their subtree; the contact channels have no such
ancestor, so their icons never appeared. Selecting by class fixed it.

Icons go *beside* `data-i18n` elements, never inside: `applyLang` sets
`innerHTML`, which would delete them.

### Stock vs generated

Magnific stock icons cost **300 credits each** to download, and the
"animated icons" in stock are 600-credit video clips on coloured squares that
cannot follow the palette. Plates were generated instead (60 credits each);
icons are hand-drawn SVG, which costs nothing and re-inks per theme.

### `.mk-scroll` is a `<section>`

It became one so the validator would accept its accessible name — and so it
inherited the page's `section{padding:96px 0}`, putting 96px of empty frame
above and below the market table. It now sets `padding:0`. Any element turned
into a `<section>` for semantics must shed the section rhythm.
