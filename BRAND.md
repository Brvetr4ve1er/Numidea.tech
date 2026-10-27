# Numidea Labs — Themes

The site ships **Arcanum** (arcane-blue + brass, Cinzel display) as its identity.
Five more themes sit behind the theme switcher. All six are token themes on one
contract; none of them is a separate stylesheet.

---

## How themes work here

All six are **token swaps**: `assets/themes.css` holds one
`:root[data-theme="name"]` block per theme, each setting exactly the same **46
contract tokens**, and every rule in `assets/styles.css` that reads
`var(--token)` reskins for free. `styles.css` may not contain a `[data-theme]`
selector. `scripts/themes-check.mjs` (part of `npm run check`) enforces that, the
token contract, the WCAG contrast pairs, and that every list of theme names
agrees with `THEMES` in `scripts/site.mjs`. Details under "Theme contract" below.

| Theme | Character |
| --- | --- |
| **arcanum** *(default)* | Arcane blue and brass, engraved Cinzel display |
| **noir** *(formerly "Neon Noir")* | Cinematic black, signal red, steel |
| **daylight** | Warm paper, ink, ochre and deep teal |
| **mono** | True black and white, sharp, no colour |
| **altneon** | Synthwave violet, magenta and cyan |
| **engineering** | Graphite, safety orange, drafting grid |

### History (removed features): Engineering as an alternate stylesheet

*Removed in the 2026-10 cleanup; kept as a lesson.* Engineering is
now a token theme like the other five; what follows describes the file it used
to be.

**Engineering** was different: a *complete design system*, not a palette —
cool near-black, Geist + Geist Mono, monospace as texture, a deploy terminal and
build indices. It could not be expressed as token values, so it shipped as an
**alternate stylesheet**:

```
assets/theme-engineering.css      loaded with media="not all"
app.js                            flipped media to "all" for data-theme="engineering"
index.html <head>                 the pre-paint resolver did the same, so the
                                  theme never flashed the base skin first
```

Because both sheets stayed in the document, `theme-engineering.css` opened with a
**reset block** that neutralised everything the base sheet painted and that
system did not use — the brass dividers, the full-bleed band tints, the
gradient-clipped headings, the fanned hero deck, the arcane texture layers. It
loaded second, so matching specificity was enough; there was no `!important` in
the file.

A computed-style audit walked every visible element in the Engineering theme and
failed on any base-palette colour still being painted. It reported zero.

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
one inline `translate` per element (pointer and scroll offsets summed) — never
inherited custom properties; see "Performance" below.

Two rules that were each learned by watching the page misbehave:

- **Layout positions are cached, never re-read while scrolling.** A rect read
  back already contains the translate just applied, so measuring per-scroll
  makes each frame feed on the last and the element creeps away from where it
  belongs. Worse, a *rotating* element's bounding box grows and shrinks as it
  spins — the hero ring's box swings ~20px per revolution — which pumps that
  wobble straight into its own parallax target. Caching makes the target a
  pure function of scroll position. Re-cache on resize, on load, and on
  `numidea:relayout` (dispatched by `applyTheme`, because a theme's type
  tokens change line lengths). It was first added because the old Engineering
  sheet revealed a `display:none` hero terminal, cached at zero everywhere
  else; that terminal went in the 2026-10 cleanup.
- **The easing is time-based, not per-frame.** A fixed per-frame lerp settles
  twice as fast on a 120Hz display as on a 60Hz one, and "unhurried" cannot be
  a property of the user's monitor.

**Aurora** — *removed in the anti-slop sweep (below); kept as a lesson.* Three
slow colour fields fixed behind the whole page, inked from palette tokens via
`color-mix`, never from literals, so they reskinned with every theme. Light
palettes got lower opacity or they turned muddy. (The old
Engineering sheet re-inked them to a single cold instrument glow; that sheet
was removed in the 2026-10 cleanup.)

**Floaters** — hand-drawn SVG geometry in the hero, no raster assets. They
live strictly in the hero's negative space (the bands above and below the
deck) and never behind the headline, lede or CTA; decoration drifting behind a
button reads as a rendering fault, not atmosphere. Each carries a ~40px motion
envelope (bob ±11px plus parallax travel), so clearances are sized for that,
not for the static position. Below 960px the hero collapses to one column and
that negative space disappears, so they are dropped rather than shuffled into
the copy.

**Reveal** — batched on the next animation frame and staggered 70ms apart
(capped at 210ms) so a row assembles as a wave. It rises 12px and starts 8% of
a screen *below* the fold, so content arrives already under way rather than
entering blank (see "Scroll comfort" below). The flush is scheduled on rAF,
*not* a resettable timeout: a fast scroll fires the observer faster than any
debounce window, so a re-armed timer can be starved indefinitely and strand
cards invisible.

## History (removed features): the Engineering hero

*Removed in the 2026-10 cleanup; kept as a lesson.* The hero
terminal no longer exists; the plate is the same in every theme.

Both media lived in the **right column**, terminal above plate, with the copy
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

## History (removed features): Engineering-only markup

*Removed in the 2026-10 cleanup; kept as a lesson.* None of these
elements is in `index.html` any more.

Three elements lived in `index.html` for that theme and were hidden by the base
sheet (`.term, .logo .brick { display:none }`):

- `.term` — the hero deploy terminal, showing this repository's real GitHub
  Pages run: checkout, configure-pages, upload-artifact, deploy, 18s, live.
- `.logo .brick` — the accent monogram square.
- `data-idx="0n/07"` on each project card — the build index badge.

## The logo

Swap point in `index.html` (the navbar and the footer carry the same markup):

```html
<a class="logo" href="#top">Num<i>idea</i> Labs<span class="cursor" aria-hidden="true"></span></a>
```

`.cursor` is the solid block after the wordmark; it no longer blinks (see "The
anti-slop sweep"). Replace it with the delivered artwork. (The
Engineering `.brick` monogram that used to sit before "Num" was removed in the
2026-10 cleanup.)

## History (removed features): adding another full design system

*Removed in the 2026-10 cleanup; kept as a lesson.* There are no
alternate sheets now; a new theme is a token block (see "Theme contract").

The pattern was: a self-contained sheet, a reset block at the top, one entry in
`THEMES` in `app.js`, one `<link media="not all">`, one line in the pre-paint
resolver, and a button in the theme menu.

## Framing: the sweep

Every `grid-template-columns` in `styles.css` (and, at the time, the
since-removed Engineering sheet) uses `minmax(0,<n>fr)`. A bare
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
from 320 to 1600. The one flagged exception was a 60px decorative glyph
reaching 6px past `.art` on the work cards of sites not yet live (removed with
those cards on 2026-10-26); `.thumb`'s `overflow:hidden` clipped it, so it was
enclosed in what actually paints. Any enclosure assertion must resolve the
nearest clipping ancestor before it reports; the check that does not will
report decoration that the design already frames.

## Fonts are self-hosted

`assets/fonts/` holds the woff2 binaries; `assets/fonts.css` holds the
`@font-face` rules. Nothing on the critical path touches a third-party host —
that is what "0 dépendance" has to mean if the title block is going to print it.

Trimmed to the subsets this site actually sets type in — **latin, latin-ext,
arabic**. Cyrillic, cyrillic-ext and vietnamese were dropped: 24 faces nothing
here is typeset in. `unicode-range` is preserved, so loading is usage-driven —
a French reader of the default theme fetches 5 files from it (Geist, Geist
Mono, Cinzel, Cinzel Decorative, and Plex Arabic for the ع button), and the
rest of the Arabic binaries are fetched only when `lang=ar` actually renders
Arabic glyphs. 335 KB on disk; no visitor pays that.

**One file per family and subset.** Geist, Geist Mono and Syne are variable
fonts: the API answers every weight with the same file, and it had been saved
once per weight, as byte-identical copies. The browser caches by URL, so each
copy was downloaded again: 81,928 B of repeats on every first home visit, in
all three languages. Each weight keeps its own `@font-face` rule (weight,
`unicode-range`, `font-display` and fallbacks unchanged), and all of them
point at `geist-latin.woff2`, `geist-mono-latin-ext.woff2` and so on.

Regenerate by fetching the CSS2 API with a modern User-Agent (an old UA gets
you TTF instead of woff2), keeping only those three subsets, downloading each
distinct url() once, named by family and subset (by weight too only where the
weights are different files, as Cinzel and Plex Arabic are), and rewriting
every rule that uses it to `fonts/`. Fonts are OFL-1.1; the license ships in
`assets/fonts/OFL.txt` and must stay there.

**Every screenshot taken in a sandbox that blocks fonts.googleapis.com was
lying.** The arcanum h1 is Cinzel, but with the webfont blocked it painted in
the Georgia fallback, and the h1 box measures 256px against Cinzel's 320px.
Judging type or vertical rhythm from a run where the faces never loaded means
judging a different design. Check `document.fonts.check()` before trusting a
screenshot of type.

## The font swap must not move the page

The main sheet is `font-display:swap`. The boot script preloads the files
that set most of a visitor's first screen, each once: in French and English,
Geist (one file for every weight: 400 body, 600 headline, and the heading in
every theme but Arcanum), Geist Mono (the call-to-action's 700 included) and,
in Arcanum, Cinzel; in Arabic, Plex Arabic 400 and 600, Plex Arabic 600
latin, Geist Mono and Geist. The rest of the first screen is not preloaded:
Arcanum's Cinzel Decorative swash and the ع button's Plex for Latin
visitors. Those rely on their metric-matched fallback faces, which the
fallback-type runs check in French and English.

**Why not `optional`.** It would never move the page, but Chromium never shows
an optional face first requested after the page has rendered, however fast it
arrives, and this page asks for faces long after load: the theme menu
requests Cinzel when someone picks Arcanum, and the language switch requests
Plex Arabic. Measured on 2026-10-25, a face requested 1.5 s after load and
delivered within milliseconds stayed in its fallback for the rest of the
visit. Until
that day this file said the faces were `optional`, but the `@font-face` rules
had always said `swap`. The claim was never true, and the live audit caught
the shift it hid. `hub/` has no such switches, so `fonts-hub.css` is `optional`.

**Fallback faces.** Each is `size-adjust` plus ascent, descent and
line-gap overrides, calibrated against an **unadjusted twin** of the same
`local()` list. Calibrating against a generic stack instead is wrong:
`system-ui` and `local("Arial")` resolve to different files, which put Geist
12% out and left the hero lede a line short. Three rules came from the
2026-10-25 failure (fonts.css has the numbers):
- **A bold heading needs a bold fallback.** A 700 heading drawn from a regular face
  gets synthetic bold, which keeps the regular advances. Geist is ~7% wider at
  700 than at 400, so Alt-neon's French hero wrapped to 4 lines in the
  fallback and 5 in Geist: a 0.02 layout shift on the live site.
  Geist and Cinzel now have a face for every weight the site sets. Geist Mono
  needs only one (its advances are the same at every weight). Plex Arabic has
  one 400 face, uncalibrated, because Linux has no Arabic Arial to measure
  against.
- **Each `local()` list starts with one metric family.** That family is
  Arial / Liberation Sans / Arimo, Times New Roman / Liberation Serif / Tinos,
  or Courier New / Liberation Mono / Cousine. The Cinzel list started with
  Georgia, but its size had been measured on a machine without Georgia
  (against Liberation Serif), so on Windows and macOS it came out too wide.
  The Geist lists end with Helvetica Neue and DejaVu Sans, unmatched last
  resorts.
- **Geist 700 and Cinzel use the hero title's own ratio.** Geist 700's other
  copy (headings and nav in Noir and Alt-neon, prices elsewhere) would have
  made Noir's hero a line too tall. Geist 500 and 600 also carry heroes
  (Mono's, Daylight's and Engineering's) and pass on their copy ratio.
- **Android ships none of these faces.** There no fallback resolves, and the
  stacks fall through to the system fonts unadjusted. Calibrating for it
  needs a device; RELEASE.md lists it with the phone-speed work.

**`ch` is a font metric, so it is not a layout unit.** `1ch` is the advance of
"0", and Geist's "0" is 19.21% wider than the fallback's while its average glyph
is only 1.92% wider — a 17pp spread one `size-adjust` scalar cannot satisfy. All
34 `max-width:Nch` are now `em`, computed from the intended face's own "0", so
the measure is identical once the face loads and independent of which face
resolves. Do not reintroduce `ch` for layout width.

Know the limit: a single `size-adjust` cannot make *every* string wrap
identically, because it matches one number against a whole width
distribution. The first screen is what matters (a shift below it is not
seen), and `npm run audit` proves it. Its fallback-type runs load each
theme in French and English twice, once with every webfont file refused and
once with the faces, at seven widths from 360 to 1600. Every text block in
the first screen must be equally tall in both loads. Arabic is left out:
Linux has no Arabic in Liberation Sans, so there the measurement would say
nothing about a visitor's Arial. **After editing the hero copy or its sizes,
run `AUDIT_ONLY='^fallback type' npm run audit`.**

**A local audit cannot see a font swap.** Served from the checkout, the faces
arrive before the first paint, so its CLS stays 0 whatever the fallbacks
do. The fallback-type runs exist for that. `AUDIT_BASE=<live site>` shows the
real swap.

**The browser gates lay text out without hinting.** `scripts/lib/serve.mjs`
launches Chromium with `--font-render-hinting=none`, the way phones and Macs
lay text out. Without that switch, the binary decides where a line wraps.
Playwright's default headless shell, the one CI gets, rounds glyph advances
to whole pixels, while the full build does not. Arcanum's French hero at
360px ends a line 0.6px inside its box in one and wraps it in the other, so
the fallback-type runs passed locally and failed on CI's binary.

**Measure CLS with the layout-shift API, not by diffing two page loads.** A load
whose faces missed their deadline (hub's `optional` faces) legitimately differs
from one whose faces made it, and a geometric diff reports that as a failure.

## The language is resolved before first paint

The markup is baked in French. For a visitor whose saved language is EN or AR the
deferred `applyLang()` rewrote 194 nodes and flipped `dir` *after* the page had
painted — measured at CLS 0.63, the largest shift on the site.

`lang` and `dir` are now set in the head bootstrap, alongside the theme.
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

## History (removed features): the alternate sheet must be parser-inserted

*Removed in the 2026-10 cleanup; kept as a lesson.* No theme loads
a stylesheet now, and `styles.css` holds no `html[data-theme="engineering"]`
rule; the `document.write` lesson still applies to any script-chosen sheet.

Engineering shipped as a whole alternate stylesheet. Loaded the usual way — a
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
`--gutter` for Engineering then lived in `styles.css` under
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
(Geist 400 and 600 later turned out to be one variable file saved twice; it
is now one file, preloaded once, so the 600 weight is still there before
first paint.)

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
behind the portfolio dialog was `inert` while it was open (that dialog, the
project explorer, was removed in the 2026-10 cleanup); a print stylesheet
(ink-safe palette, decoration off, gradient type as solid ink); the validator's
15 findings cleared. Slow 3G FCP 4.2s→3.6s, LCP 10.1s→3.8s; Fast 3G LCP
3.0s→1.4s; 190 rapid theme/language/modal/resize interactions: +0.0MB heap,
+0 listeners.

## Second full audit — what it still found

**`transition:all` and the focus ring.** Nine interactive rules animated the
outline in from 0 over 200–300ms. A `transition-property` list now excludes it —
placed at the *end* of each sheet, because any later `transition` shorthand
resets the property list back to `all` (the first attempt, placed early, changed
nothing). The old Engineering sheet restated it for the same reason.

**A token name that means two things.** Project cards set an inline RGB triplet
for `rgb(var(--…))` fills; the old Engineering sheet (removed in the 2026-10
cleanup) used the same name, `--accent`, as a whole colour, including in its
`:focus-visible` outline. Inside a card that outline
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
Trimmed to latin and latin-ext (hub sets no Greek or Vietnamese), all ten
faces `font-display:optional`. Syne's three weights are one variable file per
subset, so the six files are 112KB.

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
down from four that overlapped into a single haze, and the aurora sat at .18
(it was later removed in the anti-slop sweep).

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
  modal. Overlays belong as direct children of `<body>`. (The explorer was
  removed in the 2026-10 cleanup; the rule stands.)
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
GitHub Actions deploy, and a status field that reads "4 / 7 en ligne".

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
fanned right. It showed three of the sites at a size where nothing was
legible — the studio's strongest asset used as texture.

It is now **one live site at a time, big enough to read**, cycling five: the
four delivered client sites (Bordj Steel, Alliance Travel, Nomara Voyages,
AlmaFlowClim) and the Glaive Store portfolio demo, which is captioned "Démo
portfolio" and is never presented as a client. Each slide carries the real
name, category and URL. Rules that matter:

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
- *Removed in the 2026-10 cleanup; kept as a lesson:* the old
  Engineering sheet restyled the plate in full rather than letting it
  inherit; otherwise the base sheet's crimson, rounded card and CRT scanlines
  leaked into a surface that owned none of them. Now the plate reads tokens
  and every theme gets it for free.

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

Wrapping step copy in `.step-body` broke the old engineering sheet (since
removed) silently: it
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
  been patched once before, but only for `[data-variant="b"]`. (The A/B/C
  variants were removed in the 2026-10 cleanup; `themes-check`
  now fails on any `[data-variant` selector in `styles.css`.)
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
identically (it suppresses tracking on cursive scripts, per the CSS spec), but
Firefox was never verified, and if it applied the tracking, connected letters
would pull apart. Settled now: Arabic sets no letter-spacing outside the Latin
logo (`html[dir="rtl"] body :not(.logo, .logo *){letter-spacing:0!important}`). See
"Arabic conventions" below.

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

Visible text counts whatever its accessibility-tree state. The pictures
(charts, the Aperçu timeline, the estimator) are `aria-hidden` beside their
text equivalents, but their labels are still read by eye, so they must meet
4.5:1 like any other text; until r3 the sweep reported them as notes and
could not fail on them. Only an element marked `data-decorative` is exempt.
Pages render with reduced motion, so a picture app.js would hold back for
its entrance (`.vz-arm`, some of it at opacity 0) is measured as drawn.

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

## The gates

Seven commands, all green before a push:

- `npm run check` — `scripts/check.mjs` (repo invariants: i18n balance, asset
  references, stamps, the deploy set and sitemap, prices against
  `PRICE_MODEL`, legal gating, one contact address; the Content-Security-Policy
  meta, asset byte budgets, SEO and structured data, blocks 16 to 18) plus
  `scripts/themes-check.mjs` (the theme contract).
- `npm run validate` — html-validate on every page in `scripts/site.mjs`.
- `npm run audit` — the browser audit, 76 runs on desktop, phone, tablet and
  landscape: axe, CLS, overflow, reveals, tap targets, images, animations, JS
  errors, failed and third-party requests, and every Content-Security-Policy
  violation in every frame. It includes the WorkspaceHQ embeds on their own,
  a run that boots the live console, and 404.html two folders down (here and
  on an emulated GitHub Pages, JavaScript on and off). Desktop page runs fail
  when LCP is over 1.5 s. Then the first screen in fallback type (each theme
  in French and English, webfonts refused vs loaded, 360 to 1600 wide; see
  "The font swap must not move the page"). Last comes a throttled phone (Slow 4G, CPU 4×),
  whose LCP, long-task and interaction targets are report-only until
  `AUDIT_PHONE_STRICT=1`.
- `npm run sweep` — the painted-contrast sweep (above).
- `npm run vbugs` — the visual bug scan, `scripts/vbugs.mjs` (see "Visual
  pass" below); accepted issues live in `scripts/vbugs-allow.json`, each with
  its reason.
- `npm run keys` — `scripts/keys.mjs`, the keyboard, reduced-motion and
  direction gate, in French and Arabic, on desktop and a phone: skip link,
  focus rings, the phone and theme menus, the CV panel, the contact form
  (errors, the mail hand-off, the lead store's POST with its switch on), the
  dialogs, nothing moving under reduced motion (smooth scrolling and the
  booted console's Bit included), and `dir="rtl"` with `?lang=ar`.
- `npm run verify` — runs all of the above (check, themes, validate, audit,
  sweep, vbugs, keys) and does not stop at the first failure, so one run
  shows everything that is wrong.

Two more commands are not gates:

- `npm run csp` — rewrites the CSP meta of the hand-written pages
  (`scripts/build-csp.mjs`; `-- --check` only reports). It is also the last
  step of `npm run build`, and check block 16 fails when a page's meta is
  stale.
- `npm run links` — every external link answers. It needs the network and
  depends on other people's servers, so it is not in verify; it runs in the
  nightly CI job and in `monitor.yml`.

CI is in `.github/workflows/` (README → CI has the table, RELEASE.md maps each
gate to the release checklist):
- `check.yml` job `check`, on every push and pull request, no browser: check,
  themes-check, validate, "the build leaves no change", `npm audit --omit=dev`;
- `check.yml` job `nightly`, every night and from Actions → Check → Run
  workflow: the browser gates (`npm run verify`), `npm run links` and the full
  `npm audit`;
- `pages.yml`: job `gates` runs the static gates, then audit, sweep, vbugs and
  keys; job `deploy` stages and publishes `_site/` only once `gates` is green;
- `monitor.yml`, every six hours: the live site; a failure opens one issue.

`check` had shown the same ✗ on every run for weeks — it read a `document.write`
string concatenation as a file path. It was waved through as a "known false
positive" each time, which is precisely how a check stops being read. It now
skips concatenation fragments **and verifies their real targets** from the
literals (each preloaded font name, and at the time the Engineering stylesheet
constant, since removed); a deliberately misnamed font is caught. A
permanently red check is worse than no check.

Audit traps, on top of the sweep's list:
- A tap-target check without WCAG 2.5.8's spacing exception flags the whole
  desktop nav. axe applies the exception; match it.
- Reveals run 1s plus a stagger delay — sample sooner and you measure a fade.
- *Removed in the 2026-10 cleanup; kept as a lesson:* the
  Engineering deploy log scrolled sideways on phones only once the typing
  animation reached its longest line, so the axe failure came and went. The
  fix was to wrap it below 600px.

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
- exchange rate: `FX` in `app.js` §12a (the one display-currency table, see
  "Prices: set in dinars, converted for display"), the `mk.note` string ×3,
  the `price.curNote*` strings, and the static callout figure
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
— they live on the Numidea page. A "Selected Work" section of the studio's
sites was added once and removed at the owner's request; `npm run check` now
fails if any project URL appears in hub/.

- **Hero frame:** the four Traveler portraits (Yasser's own self-portrait
  series) fill the pose slots, ordered calm to scream — violet, cobalt,
  vermilion, acid — so the scroll-driven pose index escalates as you read.
- **The Series — BR4VETR4VELER, a story in 33 posters.** The DeviantArt
  gallery was remade with Magnific (Nano Banana Pro; Seedream 5 Pro where
  Nano's safety filter falsely blocked a piece) into one poster series, each
  piece re-drawn from its original with one of Yasser's portraits as the style
  reference: hand-inked manga line, riso halftone, cream paper, a broken halo
  ring. It reads as a story:
  - Prologue, *The Traveler* — the four portraits.
  - I *The Sky* (cobalt/yellow), II *The Noise* (vermilion/orange),
    III *The Ink* (violet/acid) — one palette per chapter.
  - Epilogue, *The Power of Imagination* — his Neville Goddard poster.
  Titles are HTML labels, never baked into the image: AI lettering garbles. Every chapter poster links to its original.
  DAMN (p19) and DEJA VU (p29, formerly "Phone background") were redone: the
  first pass put DAMN on a dark ground and turned the DEJA VU collage into two
  clean skulls. The DAMN redo keeps the face in shadow on purpose — the other
  candidate came out as a recognisable likeness of a real person.
  Files: `hub/art/pNN-{s,l}.webp` (NN = the DeviantArt item), `tv0-3-*`
  (portraits), `imagination-*`; Magnific project "br4vetr4veler posters".
- **Bento layout.** Every gallery grid runs on square units (row height =
  column width, from `100cqw`), so a tile spanning C×R has shape C:R and each
  piece gets its own shape: posters 2x3/4x6, portraits 2x2/4x4, the Goddard
  poster 4x7. Measured crop is ≤0.2% at every width 320–1600. Tile ORDER is
  part of the layout: with dense auto-flow it is what closes each chapter
  flush at 6 columns and at 4 (per chapter: big + head + 7 small; head + big +
  7 small; head + quote + big + 11 small; tall head + big + 3 small;
  poster + text). Change a chapter's count and the hole check
  (`.tmp/holes.mjs`-style: cells covered vs cols × rows) must be rerun.
  Text tiles are their own containers and size type from their own width —
  sized from the chapter, "TRAVELER" broke mid-word in a 2-column tile.
  Labels sit on the image, hidden until hover/focus on a pointer and always
  shown on touch. Images fade in once decoded; the viewer eases open and
  closed (`@starting-style`).
- **Clutter removed:** grain, scanlines, the custom cursor, the giant VOID
  word, the dot grid, the floating geometry, the aurora, corner marks, tape,
  the cycling handle and philosophy line, the code-comment eyebrows, the
  poster card chrome and the chapter nav.
- **The viewer** is a native `<dialog>` (focus trap and Esc for free). It only
  intercepts a plain click, so cmd/ctrl-click still opens the original, and
  with scripts off every poster is just that link. Its placeholder `src` is a
  real 1×1 GIF: `data:,` counts as a broken image in the audit.
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
- **The team is anonymized by design** (knowledge-base/archive/2026-06-snapshot/12-organization.md): initials
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
reads as an engraved atlas of the region the studio works from. Five numbered
plates, each a generated engraving (white line art on black) used as a
luminance mask over `currentColor` — the `.ill` rule, so every plate re-inks
itself in all six palettes from one file:

| Plate | Where | File | Motion |
|---|---|---|---|
| I — Les Bibans | `.vista`, full-bleed under the hero (above 960px only) | `vista-far/mid/near.webp` | 3-layer parallax, twinkling sky, a constellation that draws itself |
| II — Arc de Trajan, Timgad | behind the `#work` header | `arch.webp` | parallax |
| III — Monnaies numides | beside the `#pricing` header (≥1100px) | `coin-*.webp` | three coins, three depths, each turns on its own axis |
| IV — Cap Carbon, Béjaïa | behind the contact channels | `lighthouse.webp` | the beam sweeps |
| V — Le Grand Erg | between `</main>` and the footer | `dunes.webp` | parallax |

A sixth plate, *Coupe des couches* (`strata.webp`, a core sample drilling
across), stood behind the tools section, "Nos outils". It left the page with
that section on 2026-10-26 (owner decision, see Page structure), and the
lighthouse and the erg moved up to IV and V.

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

**Plate I is not lazy, so phones do without it.** It starts about 1,075px down
on a 1280×900 desktop, inside the loader's 900px lookahead, so its three masks
(416 KB) arrive with the first screen: 33% of a phone visit in the 2026-10-26
audit, before any scroll. At 960px and below the vista is `display:none`
(owner decision, 2026-10-26): the observer never reports it, `.lz-on` is never
set, and with scripts off nothing under it is fetched either. At 640px and
below the in-section plates are hidden too, so a phone keeps plate V only.
Above 960px it still loads with the first screen; that costs no LCP, which is
the hero text, painted before the masks are requested. Where the vista is
gone, nothing covers the seam between the hero and the proof: the proof drops
its opaque ground (it was there so the vista's layers never slid under its
kicker) and the hero mesh fades out before the hero clips it.

**Captions are solid chips.** 10px type on hatching measured 4.0–4.4:1 under
axe wherever the line work is dense; each `.pl-cap` sits on `--void`.

**Nothing loops forever — still.** The anti-slop rule stands and
`npm run audit` fails on any infinite animation. Every loop (icon or plate)
plays a few cycles (`--n`, default 3) and settles; `.live`, toggled by an
IntersectionObserver, removes and re-adds the animation, so it replays each
time the element comes back on screen. Off-screen, nothing runs.

### Animated icons (`.ai`)

21 inline icons on the 24×24 / 1.5-stroke grammar: tiers,
pricing models, estimator, market, onboarding steps, FAQ questions,
contact channels. Drawable parts carry **class `.p`** and
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

## Performance — what made scrolling slow

Measured with a Chrome trace while wheel-scrolling, CPU throttled 4×:

| | style recalc | script | idle (3s, untouched) |
|---|---|---|---|
| index, before | 4.5s | 2.0s | 0 |
| index, after | 0.95s | 0.5s | 0 |
| hub, before | 2.3s | 0.74s | 181 animation frames |
| hub, after | 0.69s | 0.41s | 0 |

**1. Parallax wrote inherited custom properties.** Both engines moved elements
by setting `--px/--py/--sy` on them every frame. Custom properties inherit, so
each write restyled the element's entire subtree — ~166 elements per pass for
39 moving ones. Now each element gets one plain `translate` (index) or
`transform` (hub) — not inherited, so only that element restyles — and only
when the value changed and the element is within 300px of the viewport.

**2. A forced synchronous style recalc per frame.** `aim()` read `scrollY`
inside the rAF callback, right after `frame()` had written styles: 45ms per
frame on the throttled CPU. The scroll position is now read in the scroll
event and cached.

**3. The hub's loop never stopped.** `requestAnimationFrame(frame)` ran
unconditionally, 60 times a second, for the life of the tab — and its scroll
handler called `getBoundingClientRect()` on every moving element per event
(layout thrash). Positions are now cached (on load and resize), and the loop
runs only while something is still easing.

**4. GPU work the headless numbers under-report.** On the hub:
`background-attachment:fixed` (Chrome repaints the whole viewport every scroll
frame — the glow now sits on a fixed `body::before`), a full-viewport noise
layer with `mix-blend-mode:overlay` over everything, and `filter:blur(60px)` on
a layer 140% of the viewport. Blend and blur are gone; the gradients were
already soft.

**5. Smaller ones.** The progress bar animated `width` (a layout per scroll
event) and read `scrollHeight` per event; it is now `transform:scaleX` with the
height cached via ResizeObserver. The three remaining PNG textures
(`px-*`, 562KB) are WebP (319KB) and lazy-loaded behind `.lz-on` like every
other plate.

Rules: never animate through inherited custom properties; never read layout
(`scrollY`, `getBoundingClientRect`, `scrollHeight`) after a style write in the
same frame; every rAF loop must have a stop condition.

### Scroll comfort (round 3)

Measured by real input, not `scrollTo`: wheel gestures at 1280×800, and touch
swipes (`Input.dispatchTouchEvent`; `synthesizeScrollGesture`'s touch source
does nothing in headless Chromium) at 390×844 with the CPU throttled 4×, top to
bottom of index.html. A plain page scrolled the same way drops 0 frames at 1280
and ~1% on the phone, so the page's own numbers are its own.

- **One read of the scroll position per event.** Six scroll listeners each
  read `scrollY`, around each other's writes, so each read forced a style
  recalculation: 2,198 forced recalcs (1.9s) in one phone scroll. A first
  listener now reads it once into `scrollPos`; the others only write.
- **Read content stays put on a touch screen.** A finger drags the page on
  the compositor; a main-thread translate is a frame or more behind it, eased
  on purpose, and text drifting against the finger read as the page swimming.
  Kickers, the hero plate and the card screenshots are `.px-still` there.
- **Touch decoration is scroll-linked, not scripted.** The layers that keep
  their depth on a touch screen (the vista above 960px, hero mesh, glyphs,
  footer ink) run one `ScrollTimeline` animation each, its keyframes the
  parallax formula sampled where the cap starts and stops clamping. Same
  resting positions as the eased loop, in step with the finger, no work per
  frame. The loop stays for a fine pointer (where its lag is the point) and
  for browsers without ScrollTimeline.
- **Read content is bounded at 12px** by default (decoration keeps 64): in a
  fast wheel scroll the eased lag carried a kicker 36px down onto its heading,
  32px below it at rest.
- **The progress bar is a scroll-driven CSS animation** where supported, so it
  is drawn on the compositor; app.js draws it otherwise and under reduced
  motion.
- **Skeleton shimmers pause off screen** (`.sk-run`): they animate a
  background, which restyles and repaints every frame wherever the box is.
- **scene/ had the hub's old problem**: its drafting-paper grid was
  `background-attachment:fixed` on body, meant to spare repaints; in Chrome
  it forces them. Ten wheel scrolls at 1280 cost 7.2s of raster
  (the whole viewport, every frame) and 431 paints; the grid now sits on a
  fixed `body::before` layer, identical on screen: 0.13s and 33 paints.
  Text over it may lose LCD subpixel antialiasing on low-DPI screens, as on
  index.html, which has used fixed layers all along.
- What is *not* the problem: every scroll and touch listener is passive, there
  is no scroll-snap, no `background-attachment:fixed` on index.html, no
  layout shift while scrolling (CLS 0), and anchor jumps land the heading
  clear of the navbar. Backdrop blur (navbar, card bars, title block) is most
  of what the 1280 run drops in headless software raster, but removing it
  changed nothing on the throttled phone, whose limit is the main thread.

| index.html, one scroll top to bottom (median of 3) | before round 3 | after |
|---|---|---|
| phone: frames over 25ms | 514 of 3,008 (17%) | 268 of 2,676 (10%) |
| phone: style recalculation | 4,065 (4.9s) | 2,528 (2.6s) |
| phone: script | 3.5s | 1.4s |
| phone: main thread busy | 32.9s | 20.5s |
| phone: read content moving against the finger | up to 30px | 0 |
| phone: reveal start after entering view, p50 / p90 / max | 167 / 258 / 600ms | −115 / −79 / 0ms |
| 1280: closest kicker to its heading while scrolling | −4px (overlap) | 20px |

Taken on a shared 4-CPU machine at load 2–4. The 1280 run drops the same
~18% of frames before and after: that is software raster of the backdrop
blur in headless Chromium, not the main thread.

What is left on the phone is the icons drawing themselves in (`ai-draw`, a
stroke animation the compositor cannot run): with it switched off the same
scroll drops ~140 frames instead of ~270 and the main thread does ~5s less.
It is left as designed: it does not touch the scroll itself, which runs on
the compositor with nothing that moves with it left on the main thread.

### Mobile audit (round 3)

Every page (index, scene/, hub/, workspacehq/, 404) at 320×568, 360×740,
375×667, 390×844, 414×896, 430×932 and in landscape at 667×375 and 844×390,
in fr/en/ar where the page has them, with touch emulation (`hasTouch`,
`isMobile`: coarse pointer, no hover). Real taps and swipes
(`Input.dispatchTouchEvent`), notch insets emulated with
`Emulation.setSafeAreaInsetsOverride` (47px a side and 21px below in
landscape, 34px below in portrait). What was found and changed:

| Where | Found | Now |
|---|---|---|
| Phone menu | the × hit-tested as the first link at 320×568, 360×740 en, 667×375 (links paint later, carry a transform, stretched full width) | × on top, links as wide as their words |
| Phone menu | list 719px tall on a 568px screen, 477–504px in landscape: Contact and/or the language switch below the fold of the dialog | type follows the height on short portrait phones; two columns in landscape; fits everywhere |
| Phone menu | × inside the 47px notch inset in landscape | inset by `env(safe-area-inset-*)` |
| Landscape 667×375 | navbar 73px + contact bar 69px = 38% of the screen | bar gives way on a short screen (as it already did at 844×390), back-to-top returns, navbar 57px: 15% |
| Contact form | fields at 15px: iOS zooms into them on focus | 16px under 960px and on a coarse pointer |
| Estimator slider | a vertical swipe starting on the track scrolled the page AND set the size (22 → 9 pages): Chrome on Android jumps the thumb on pointerdown | value restored on `pointercancel`; sideways drags unchanged |
| Estimator options | an option tapped off kept the ticked look (sticky `:hover`) | option, chip, plate-rail and "how we price" hovers behind `(hover:hover)` |
| Estimator options | "already in the plan" squeezed its label to 69px at 320 | its own line under 480px, tick on the box |
| Plate rail | a finger has no hover and Safari gives a tapped button no focus, so the deck left the slide just chosen 5.2s later (reproduced by dropping the tap's focus) | a touch pick holds the deck until the next touch outside the plate; a scroll that starts on the plate does not |
| Market table | scroll frame 178px at 320 with a 140px sticky label column: 38px of figures | frame 252px, label 112px, ~140px of figures |
| Contact email | broke as "…gmail.co / m" at 320 | breaks after the @ (`<wbr>`) |
| Vista caption | ran off the screen at 320 in French, cut at "ARRÉR" | wrapped on a narrow screen; since 2026-10-26 the vista is not shown at 960px and below |
| scene/, hub/ | `viewport-fit=cover` but not inset: text and controls under the notch in landscape (x 34–810 of 844) | inset; all content 47–797 |
| scene/, hub/ viewers | `max-height:94vh`, the LARGE viewport on iOS | `94dvh` |
| hub/ 320×568 | matched the landscape side-by-side hero: name broken mid-word | stacks like every other phone |
| hub/ tiles and cards | a 5-line label taller than its 138×108 tile lost its first word; handles broke one letter from the end | tighter labels under 400px; a card's handle moves under the badge whole, the ↗ stays pinned in the card corner (it never wraps alone) |
| workspacehq/ | wordmark, breadcrumb and footer links 12, 13 and 7px tall | padded hit areas, no layout change; hero `100svh` |
| Phone contact bar | with the navbar it covered 142px of a portrait phone the whole way down (25% at 320×568, 15% at 430×932); the bar alone is 69px (12% / 7%) | steps aside while the reader scrolls down; back on a scroll up, after 600ms still, or while focus is in it. Touch swipes at 320×568 and 430×932: shown in 0 of 32 samples while swiping down (was 32 of 32 at 320×568), back 600ms after the last swipe. A same-page jump (a client logo, a menu link) keeps it aside until the visitor next touches, scrolls or types: back 600ms after a logo's jump, it covered the landed card's benefit line at 320×568 |
| workspacehq/ console embed | its fields are 13–14px inline styles: iOS zooms on focus, and from the frame the whole page zooms | 16px on a coarse pointer (`embed/console.html` style block; mouse unchanged) |

Checked and found sound: no horizontal overflow on any page, size,
orientation or language; no stretched or broken image; theme menu (opens,
fits, closes on an outside tap, every size, RTL); language switch from the
menu; anchor jumps land 85–101px below the navbar; the market table swipes
sideways without moving the page; the plate rail's tabs are 24px+ apart
targets; 404 already used `svh` (workspacehq/'s hero now does too: it was
`100vh`).

Left as is: the navbar stays (73px; 13% at 320×568, 8% at 430×932); the
market table's caption scrolls away with the figures (it is part of the
table); the WorkspaceHQ demo stage keeps its 560px minimum in landscape,
taller than the screen, because the console inside it needs that height.

## workspacehq/ — the WorkspaceHQ v3 launch page

Implemented from the Claude Design project ("WorkspaceHQ v3 Launch Site.dc.html")
for the product's public v3 launch. Two halves, built differently on purpose:

- **The page itself is native** — `workspacehq/index.html`, `style.css`,
  `app.js`, no React. The design-system components the design imported
  (Button, Tag, ProgressBar, Kpi, Achievement, SectionHeading) are rebuilt in
  CSS with the bundle's exact values; the DCLogic class (Bit's sprite and moods,
  feeding/levels/achievements, copy, chapter seek, demo boot, progress, nav,
  reveal) is ported to plain JS. Tokens are the DS ARCADE theme verbatim, with
  one change: `--faint` is lifted from #5e588a (~3:1) to #8a83bd, because the
  page uses it as text.
- **The three embedded experiences stay the design's own React pages** —
  `embed/trailer.html`, `embed/walkthrough.html`, `embed/console.html`, on the
  Claude Design runtime (`embed/support.js`). Made self-contained:
  React 18.3.1 UMD is self-hosted in `embed/vendor/` and loaded BEFORE
  support.js (the runtime only fetches React when `window.React` is missing);
  the `.jsx` sources were compiled ahead of time with esbuild
  (`--loader=tsx --jsx=transform`), so the runtime never fetches Babel (it
  picks Babel only for `.jsx`/`.tsx` URLs); IBM Plex Mono is self-hosted
  (`embed/fonts/`); the CDN fallback URLs in support.js point at the local
  copies. Net: zero third-party requests, as everywhere else on the site.
  To update an embed from a new design export, repeat those four steps,
  and keep the one rule added to `console.html`'s style block (fields at
  16px on a coarse pointer, so iOS does not zoom on focus). Keep its
  Content-Security-Policy meta too: an export comes without it, and
  `npm run csp` writes it back (see "Content-Security-Policy" below).

**Install = GitHub.** The design said `brew install workspacehq` /
`npm i -g workspacehq`; neither package exists (both registries 404), and an
install command for an unclaimed name invites someone else to claim it. The
page points at `github.com/Brvetr4ve1er/workspace-HQ` until the packages are
published — then restore the BREW/NPM tabs from the design.

**Loops are allowed here.** INSERT COIN blinking, the glitching headline, the
marquee and Bit floating ARE this product's identity, so the audit runs this
page with `allowLoops`. They pause when their section is off screen (`.off`),
the cursor glow's rAF stops once it catches the pointer, and reduced motion
turns all of it off.

**The cartridge.** WorkspaceHQ is the founder's favourite build, so it is
linked as a little NES cartridge with Bit on the label in the hub hero, and
as a link in the hub's Dev links. It wears WorkspaceHQ's palette in every
theme, and only moves on hover/focus (Bit hops and blinks, +1 XP rises, PRESS
START flashes) — still at rest, so the hub keeps its no-endless-animation
rule. The cut corner is drawn with `::after` in the page colour
(`--whq-page`), not `clip-path`, which would clip the hover ring.
The Numidea footer carried a second cartridge until 2026-10-26 (owner
decision): it made every visitor of the home page download Press Start 2P
(12,512 B) for a developer tool on an English-only page. WorkspaceHQ stays
reachable from the hub and from project sheet 04.

### Audit pass after launch

`npm run sweep` now covers workspacehq/ too. Its first run there found what
axe had passed: locked achievements dimmed to opacity .55 (text at 2.8:1 —
now only the icon greys out), and the nav's INSTALL button under the vignette
and scanline layers (3.6:1 at the screen edge — the nav now sits above them,
z 75). The sweep also learned to skip text above the top of the document: a
parked skip link was being measured against nothing, and light-on-dark skip
links had only been passing by luck.

The live console logs `<polyline> attribute points: Expected number,
"{{ … }}"` while booting: the browser parses the design runtime's template
before binding it. Harmless (the same happens in Claude Design) and inside the
design's own runtime, so left alone.

## Visual pass — what the automated checks could not see

Every gate was green (check, validator, sweep, 32-run audit) and the page still
had visual bugs, found by walking it viewport by viewport at 1280 and 390 in
arcanum/fr, engineering/en and daylight/ar:

- **RTL wordmark.** "Num · idea · Labs" is three runs; in an Arabic paragraph
  the bidi algorithm laid them out as "Labs idea Num". `.logo` is now
  `direction:ltr; unicode-bidi:isolate` — a brand name has one direction.
- **RTL "<24h"** rendered "24h>" (the "<" is a neutral). `.stat` was isolated
  LTR; the counters left the page on 2026-10-26 (owner decision).
- **Engineering navbar** turned navy when scrolled (the base sheet's
  rgba(13,26,47,.72)); fixed then to the instrument black. *(Old Engineering
  sheet, removed in the 2026-10 cleanup; kept as a lesson.)*
- **Engineering method steps** were squeezed into the left 70% of the row:
  the base desktop grid makes three columns, that theme's sheet capped the
  list at 820px. The cap was lifted on desktop. *(Same: old sheet, kept as a
  lesson.)*
- **Proof band** carried full section padding (109px a side) and read as an
  empty box; it is a compact strip now.
- **Scene banner** art was three blank plates that read as a missing image;
  they now carry real client screenshots.
- **Footer WhatsApp** sat 10px low (flex-centred in a 39px row while its
  siblings sat at the top). The footer's contact column left the page on
  2026-10-26 (owner decision).
- **Phones (<600px):** work cards showed a narrow slice of each 16:10
  screenshot, cutting every headline mid-word; they now stack with the shot
  at its real shape. The "see every capability" summary drops its hint to its
  own line instead of squeezing the label into three. The WorkspaceHQ
  cartridge got air above it (it left the footer on 2026-10-26).

`scripts/vbugs.mjs` (`npm run vbugs`, part of `npm run verify`) scans 7 widths
x 4 theme/lang pairs for overlapping text, text escaping its card, clipped
text, stretched images and horizontal scroll. Content of closed `<details>` is
skipped, because it keeps stale layout boxes. Anything else that is acceptable
on purpose (decorative clipped glows, for instance) must be listed in
`scripts/vbugs-allow.json` with its reason; any other finding exits non-zero.

## Bento, loading states and wayfinding

- **Work** is a 3-column bento at ≥1100px: wide(2)+1 / 1+1+1, so the card
  order in `index.html` is part of the layout. Only the first card (Bordj
  Steel) is wide; at 961–1099px it stays wide (2+2+2). Below 961px cards are
  rows (≥600) or stacked (<600); no span applies there, or it creates an
  implicit second column. Five cards: the four client sites and the Glaive
  demo. A project in progress gets a card once its site is live: the two "En
  cours" cards (Doctor Cherfia, Étoile de l'Est) had no screenshot and nothing
  to open, and came off the page on 2026-10-26 (owner decision), when Nomara
  became a normal-width card so the grid still closes flush.
- **Services**: 6-column grid, 3+3 over 2+2+2. Narrow cards (and the two large
  ones below 1280px) put icon and drawing on one row with the copy full-width
  beneath; `align-content:start` keeps eyebrows aligned across a row.
- **Founder** card spans 8 of 12 columns, the team the other 4.
- *Removed in the 2026-10 cleanup; kept as a lesson:*
  `theme-engineering.css` re-declared the work, services and stack grids, so
  every bento rule needed its counterpart there (it loaded last and won). A
  theme now sets tokens only, so a layout rule lives in `styles.css` once.
- **Skeletons**: images still loading get `.sk` (finite 8-cycle shimmer), then
  `.sk-done`. Every `<img>` declares `loading`.
- **Wayfinding**: scroll-spy marks the current nav link with `aria-current`
  (section tops cached, never measured per scroll frame); a crumb shows the
  section on ≤960px; a back-to-top button appears after 1.5 viewports.
- **Sub-pages** carry a visible breadcrumb and `BreadcrumbList` JSON-LD; all
  pages have a canonical URL. `sitemap.xml` and `robots.txt` live at the root
  (on GitHub Pages project sites crawlers only read the domain-root
  robots.txt — submit the sitemap in Search Console instead).

## Page structure and design system (home page)

**Order:** hero, proof, work, services, method, pricing, team, FAQ,
contact. Each idea is said once:
- The hero's two buttons are the Aperçu (to #apercu) and WhatsApp, which
  opens a chat pre-filled with the Aperçu's own message (`prev.waText`),
  beside the lede that states its terms. WhatsApp replaced "Voir nos
  réalisations" on 2026-10-26 (owner decision): on a phone the first screen
  offered no way to write, the first wa.me link sat 8.5 screens down and the
  phone bar only shows past 1.5 screens. The plate beside the copy still
  shows the client sites, and the navbar leads to #work. Scripts build the
  link (app.js §13), so the button is `.js-only`: with them off it would be
  a dead button on the first screen.
- There is no tools section. "Nos outils" (20 tools in five groups, with
  the strata plate behind it) left the page on 2026-10-26 (owner decision): 8 of its
  20 tools repeated the service cards' tags, four were not shown by any
  delivered project, and it held the FAQ and the form a phone screen
  further down. The service cards keep their tools; confirmed tools can be
  listed later on a studio page or the project sheets. The kickers after it
  moved up (07 FAQ, 08 Contact).
- The proof band is one trust line, "4 sites livrés · réponse < 24 h ouvrées
  · FR · EN · AR", then the client logo strip. Its four animated counters
  repeated the hero's title block and the line under them; they went on
  2026-10-26 (owner decision). Each item of the line is held together by
  no-break spaces, so a narrow screen breaks it only after a separator.
- The free demo (L'Aperçu) is the services lead card and step 3 of the method.
- The footer is the logo, the section links, the tagline "Enraciné en
  Numidie · bâti sur des idées", ©, the legal slot, the language switch and
  "Haut de page". Its Studio, Contact and Le fondateur columns repeated
  #contact (the email, WhatsApp, the reply time, the town) and the founder
  card's three profiles, and the WorkspaceHQ cartridge loaded its own pixel
  font on every visit; they went on 2026-10-26 (owner decision), as the hub's
  footer columns did before (see hub/). The signoff ("avec du café noir et du
  TypeScript") went with the Studio column.
- The process is the four-step method. There is no second process in pricing.
- Pricing reads tiers, then the estimator, and stops. The market comparison,
  billing models and cost drivers sit in the "Comment on chiffre" disclosure.
- Work ends on one call to action, the planches banner. The project explorer
  modal was removed in the 2026-10 cleanup; an old
  `#/work/<slug>` link now redirects to the matching project sheet,
  `scene/#<sheet slug>` (the `SHEET` map in `app.js`), and anything else under
  `#/work` lands on `#work`.

**Design system:** the `DESIGN SYSTEM` block at the end of `styles.css` is the
source of truth for every theme, Engineering included (its separate
`theme-engineering.css` was removed in the same cleanup).
- Seven text sizes below the display headings:
  - `--t-label` 11, mono uppercase at `--ls-label`;
  - `--t-small` 13;
  - `--t-ui` 14;
  - `--t-body` 15;
  - `--t-lead` 18;
  - `--t-title` 22, every card title;
  - `--t-feature` 30, featured titles and price figures. Price figures are
    fluid down to 19px, because a figure like "1 200 000" cannot wrap.
- Corner radii: 4 / 8 / 14. Panels use the card radius.
- Section headers: every section has a kicker, a heading and a lead. Every
  section heading is one display size with one accent colour, contact included.
- Section rhythm:
  - `--sec-pad` from 961px up;
  - bands fade in and out over `--band-fade` instead of ending on a hard edge.
- Cards show one marker each, a number or an icon. Never both, and no
  decorative drawing beside the icon.
- Anything inside a closed `<details>` must not carry `.reveal`: the scroll
  observer never sees it, so it stays invisible.


## Theme contract (replaces the Engineering alternate stylesheet)

The themes broke whenever the layout changed because they were not only
palettes: ~40 rules in `styles.css` special-cased a theme, ~40 colours were
written as literals that could not re-skin, and Engineering was a separate
59KB stylesheet that re-laid out the page. All three are gone.

- `assets/themes.css` holds one block per theme, `:root[data-theme="name"]`,
  setting exactly the 46 contract tokens (colour, effects, atmosphere,
  surfaces, heading type, radii, kicker node) and nothing else. It loads
  before `styles.css`. `--cover-shadow` left the contract on 2026-10-26: its
  one reader, the title on the covers of work cards not yet live, went with
  those cards, and a token nothing reads fails `themes-check`.
- `styles.css` reads tokens only. Theme-coloured literals are written as
  `color-mix(in srgb,var(--token) N%,transparent)`.
- `scripts/themes-check.mjs` (part of `npm run check`) fails when a theme
  misses or adds a token, when a text/surface pair drops under 4.5:1 (7:1 for
  `--ice`), when `styles.css` gains a `[data-theme]` or `[data-variant]`
  selector or a theme colour literal, when any list of theme names drifts
  from `THEMES` in `scripts/site.mjs`, or when a theme's heading face is not
  the one index.html preloads for it (`HEAD` map — a late face shifts the
  hero; 404.html's `LOGO` map does the same for the wordmark). Any Geist or
  Geist Mono weight is that family's one file.
- Illustration strength is `--ink-k`, a multiplier on each plate's opacity.
- Engineering is now a token theme like the others. The sections marked
  "History (removed features)" above describe a file that no longer exists.

To add a theme: copy a block in `themes.css`, change the values, and add the
name to `THEMES` in `scripts/site.mjs`, to `THEMES` in app.js, to the theme
menu, to the `HEAD` map in index.html and to the `LOGO` map in 404.html.
`themes-check` fails until every list agrees.

## Project sheets (scene/)

`scene/index.html` is generated: edit `scripts/scene-data.mjs`, run
`npm run scene`. Captures are refreshed with `npm run work:capture [slug]`
(needs the local server for WorkspaceHQ).

Client material appears without code changes:
- `assets/work/<slug>/before/<name>.webp` + `after/<name>.webp` (same name) →
  a before/after pair
- `assets/work/<slug>/brand/<name>.webp|png|jpg|svg` → delivered brand assets

The file name is the caption. Slugs: bordjsteel, alliance, glaive,
workspacehq, almaflow. Run `npm run scene` after adding files.

Every statement on the sheets was read off the live sites on 2026-10-06.
Glaive is labelled a portfolio demo because its own site says so; it was never
a client.

**What each project gives the client.** After its title block every sheet
says, in one sentence, who the client is (`context`), then lists 3 to 5
things a visitor can do on the live site today (`gains`), each printed with
the page that shows it (`at`). The heading follows the status: "Ce que le
site apporte au client", "Ce que la démo montre" (Glaive), "Ce que l'outil
apporte à ses utilisateurs" (WorkspaceHQ). They were read off the live sites
on 2026-10-17, clicking through what each one claims (a calculator, a filter,
a copy button) rather than trusting its labels. A benefit is what the client
or their customers can now do, never a result: `check.mjs` (5c) refuses any
digit, %, or word like increased, boosted or conversion in them and in the
home cards' one-line versions (`proj*.gain`, keys after `proj7.desc`). Each
client card links its line to its sheet's block (`scene/#gv-<slug>`), and a
visually hidden `work.gainMore` ("— le détail sur la planche") ends the
link's name, so a screen reader hears where it goes (the arrow is CSS with an
empty alt); Nomara has no sheet, so its line is plain text.

Two claims went while doing this. AlmaFlowClim's /realisations is nine
text cards (trade, town, what was done): its filter buttons do nothing on the
live site (no script, no categories on the cards) and the only images on it
are the logo. So it is no longer "filterable", no longer a "galerie" /
"gallery" / "معرض", and the French card no longer says "ses chantiers en
photos": the copy says "ses réalisations chantier par chantier", "a page of
past jobs", and the deliverable is "Page de réalisations". Its footer links to `/#zones`
are dead too (the section is `#zones-title`). Fixing the client's site is
the studio's call; the word can come back after.

`npm run build` runs the page generators in one go: `build-fr` (writes
`I18N.fr` into the French baked into `index.html`, its title, description and
FAQ structured data), `build-scene`, `build-voices`, `build-legal`,
`build-sitemap` (the share images are separate, `npm run og`). `check.mjs`
fails when the baked French differs from the dictionary: app.js re-applies it
on load, so drift shows as copy changing after paint, and readers without
scripts (and the FAQ rich result) would see an older offer. A sheet shows a client quote
only when a consented voice exists for it (see "Client voices and photo
slots").

## Prices: set in dinars, converted for display

Every price is set in DZD: `PRICE_MODEL` (the tier and estimator figures) and
`RETAINER` (the monthly maintenance line) in `assets/app.js`. They are
converted for display only, in §12a: `FX` holds 151 DA/EUR and 134 DA/USD (the
Bank of Algeria official rate, early October 2026), and `tidy()` rounds each
converted figure to what a person would actually quote. Tier cards, the
maintenance line, the estimator and the market table all go through that one
place, so no two figures can disagree. `?cur=eur|usd|dzd` (an ad or a shared
link) wins over the stored choice; dinars otherwise, which is also what the
markup says with scripts off. EUR is shown HT, with the French B2B
reverse-charge note (`price.curNoteEUR`). `check.mjs` requires the dinar
figures in the tier and maintenance markup to equal `PRICE_MODEL`/`RETAINER`,
and fails on any € or $ amount typed into the studio's own prices.

## Lead source

Where a lead came from is read at the moment it is sent, and nothing is
stored. `leadSource()` in `app.js` §13 takes `?ref=` (each ad and email
carries its own code), the `utm_*` parameters and whether `fbclid` or `gclid`
is present, and writes them into the "Source" line of the mailto body.
WhatsApp links append only the ref code, as `[ref]`, to the pre-filled text.
It rides in the message the visitor sends themselves and goes nowhere else.
The query string survives every `#anchor` jump, and links to the site's
other pages (the project sheets, hub/, WorkspaceHQ and back) carry `ref`,
`utm_*`, `fbclid`, `gclid` and an explicit `?lang=` along: `assets/carry.js`,
loaded on every page, adds them from the address at the moment a link is
followed, so a language switch and links added after load are covered. A
`?cur=` or `?lang=` arrival is kept in local storage like a choice made on
the page. There is one contact address site-wide; `check.mjs` fails if any
mailto or JSON-LD email differs.

## Legal notice and privacy — generated, unpublished until complete

`scripts/build-legal.mjs` renders the legal notice and privacy policy (all
three languages in one page) from `scripts/legal-data.mjs`, as part of
`npm run build`. While any owner field is still empty it writes nothing,
keeps the legal marker regions in `index.html` empty and lists what is
missing; `--preview` writes `legal-preview/index.html` with the gaps marked
(never deployed). Once every field is filled it writes `legal/index.html` and
fills the footer and contact-form links. `check.mjs` gates both states:
before publication any link to `legal/` fails; after, the published page must
equal the generator's output.

## The link-preview card

Scrapers (WhatsApp, LinkedIn, Facebook, X) read `og:image` without running
scripts, so one static card serves every language. `scripts/build-og.mjs`
renders `assets/og.jpg`, in French, from the Arcanum tokens in `themes.css`
and the self-hosted faces, so it cannot drift from the brand; its only image
is a real capture of a delivered site. `hub/og.jpg` and `workspacehq/og.jpg`
are 1200×630 renders of those pages' own first screen
(`scripts/og-capture.mjs`). `npm run og` runs both; re-run after a theme or
copy change. (The old `og.svg`/`og.png` went in the 2026-10 cleanup.)

## Sitemap

`scripts/build-sitemap.mjs` writes `sitemap.xml` from the page list in
`scripts/site.mjs`, as part of `npm run build`. Pages whose language follows
`?lang=` (the landing page, the project sheets and, once published, `legal/`)
carry `hreflang` alternates for fr/en/ar plus `x-default`, the French
original. No `lastmod`: a date nobody maintains is worse than none.
`check.mjs` fails when the committed file differs from the generator's output
or lists an unpublished URL.

**What search engines and link previews read** is gated too (`check.mjs`
block 18). The rules cover the pages in `PAGES`: `index.html`, `hub/`,
`scene/`, `workspacehq/` and `legal/`. Until `legal/` is published it is
checked from its template (`renderLegal`), so publishing it cannot turn the
check red. Each of these pages carries one `<title>`, a meta description of
50 to 160 characters (each language's: `meta.desc` in `app.js`, `ui.desc` in
a generated page's dictionary), `og:title`, `og:description`, `og:image`,
`og:url` (its own URL), `og:type`, `twitter:card` and `twitter:image`, and
`og:image:width`/`height` equal to the image file's real size. Re-rendering a
share image at another size fails the check until its tags follow. Each has
exactly one `<h1>`; `legal/`, which carries its three languages in the body
(`html[lang]` shows one), has one per language block.

`404.html` is served for every missing URL, so it stays `noindex` and out of
the sitemap. The WorkspaceHQ embeds (`workspacehq/embed/*.html`,
`EXTRA_PAGES`) are deployed but only framed by their page, so the rules above
do not apply to them: they keep their `noindex`, stay out of the sitemap, and
`robots.txt` leaves them crawlable (a crawler never reads the `noindex` of a
page it may not fetch). A `noindex` counts in any robots meta (`robots`,
`googlebot`, `bingbot`…), and no other page may carry one.

`robots.txt` names the sitemap and disallows none of the sitemap's URLs,
`?lang=` versions included, for a search engine: the `*` group, and the
groups Googlebot and Bingbot obey. A group for another crawler (an AI-crawler
opt-out such as `User-agent: GPTBot` / `Disallow: /`) is the owner's call and
passes. A page's `hreflang` alternates equal its sitemap entry.

The studio's `ProfessionalService` JSON-LD states name, URL, town, country
and phone. A `WebSite` object gives the site name (the `og:site_name`), the
home URL and the three languages. Search engines take a site name only from a
domain's or subdomain's home page, not from a subdirectory such as
`/Numidea.tech/`, so it names the site in results once the site has its own
domain. Legal fields (legal name, registration number…) join the structured
data only once the owner supplies them (`OWNER-CONTENT.md` §1).

## Client voices and photo slots

Nothing on the page claims content it does not have.

- **Voices.** `scripts/voices-data.mjs` holds client quotes and stays empty
  until a client agrees to an exact text (each entry records `consentDate`
  and `consentRef`). Only the four delivered clients can carry one, never the
  Glaive demo or WorkspaceHQ. `scripts/build-voices.mjs` fills the
  `<!-- SLOT:voices -->` region in `#work`, and the client's project sheet
  shows the same quotes (Nomara Voyages has no sheet). With no voices nothing
  renders: no heading, no placeholder.
  Each quote stays in the language it was given in.
- **Photos.** The founder card and the team grid carry commented-out `<img>`
  slots in `index.html`. Until a real photo is added (for the founder, never
  a generated one), the monogram and the initials stay.

## Client logo strip

Under the proof line, "Ils nous ont confié leur site" shows the four
delivered clients (Bordj Steel, Alliance Travel, AlmaFlowClim, Nomara
Voyages), never the Glaive demo or WorkspaceHQ. Each logo is the file the
client's live site shows in its header, taken by `npm run logos`
(`scripts/client-logos.mjs`, which refuses a file that is no longer the
header logo): two SVGs as served (path data to 2 decimals), two PNGs as
WebP 96px tall, every file cropped to its ink. Nothing is redrawn or
recoloured on disk.

- **One colour, every theme.** The page paints each logo in `--muted`
  (`--ice` on hover and focus) through a CSS mask of its own file; the
  `<img>` keeps the alt and its own pixels are pushed out of its box.
  `crossorigin` on the `<img>` makes it the same CORS request as the mask:
  4 requests instead of 8 (measured).
- **Not lazy, so small.** The CSS mask is fetched as soon as the strip is
  styled, so the four files load with the page, scrolled or not, whatever
  `loading="lazy"` on the `<img>` says (about 0.2 s after navigation at 390
  and 1280). `npm run logos` therefore writes SVG path data to 2 decimals
  and the WebPs at quality 75, alpha 70 (the masks match the lossless-alpha
  files to the eye): 51 KB raw, about 24 KB gzipped in all (was 73 KB /
  39 KB). On a throttled phone (390×844, 1.6 Mbps, 150 ms RTT, CPU 4×,
  local server without gzip) the load event moves about 0.3 s against the
  page without the strip (was 0.44 s); LCP does not move.
- **Nomara is masked by brightness**, from the light-ink file its own site
  shows on a dark ground: its mark is a dark tile with a light glyph, which
  as a shape would be a blank square. The glyph and the wordmark carry the
  colour; the tile stays a faint ground. Browsers without a luminance mask
  (Chromium before 120) get the file as it is, in grey, on a dark chip
  (`rgb(var(--shade))`), never the solid block an alpha mask would paint.
- **Each logo links to its own work card** (`#w-<slug>`), never off-site.
  The targeted card is shown at once (the reveal would have it low by its
  12px rise, so the jump would land that much short of the scroll padding,
  its top against the nav) and outlined in the client's colour.
- **Layout.** One row from 725px up (it never wraps; an orphaned fourth logo
  at 601-680px was the bug), two by two at or below 720px.
- `check.mjs` holds the rules: only the four delivered clients, each its own
  file, alt, intrinsic width/height and mask, linked to its own card.

## Arabic conventions

- **Western digits everywhere** (owner decision). `check.mjs` fails on any
  Arabic-Indic digit in a page, the dictionaries or a generator.
- **Forward arrows are `←`**, because Arabic reads right to left.
- **Logical CSS properties** (`margin-inline`, `padding-inline`, …), so one
  rule serves both directions.
- **Mono labels fall back to IBM Plex Sans Arabic.** Geist Mono has no Arabic
  glyphs, so in RTL `--font-mono` lists Plex Arabic right after it; Latin and
  digits keep the mono face, and Arabic is no longer set one monospace cell
  apart.
- **No letter-spacing in Arabic**: tracking breaks the joins of a cursive
  script, so it is off for the whole Arabic page (the Latin logo keeps its
  own).
- The Arabic copy is still pending a native speaker's review.

## Deploy scope

Only what `DEPLOY` in `scripts/site.mjs` names is published: `index.html`,
`404.html`, `robots.txt`, `sitemap.xml`, `assets/`, `scene/`, `hub/`,
`workspacehq/`, and `legal/` once it is complete. `scripts/stage-site.mjs`
(`npm run stage`) copies exactly that into `_site/`, and a missing entry fails
the stage. Every host builds from `_site/`: GitHub Pages is canonical
(https://brvetr4ve1er.github.io/Numidea.tech/, via
`.github/workflows/pages.yml`), and Netlify and Vercel are mirrors.
`NOT_DEPLOYED` lists what must never be served, including `knowledge-base/`,
`audit/`, `scripts/`, `legal-preview/` and this file. `campaign/` is kept
outside the repository altogether.

## Content-Security-Policy

Every page carries its policy as `<meta http-equiv="Content-Security-Policy">`,
written right after the viewport meta, because GitHub Pages (the canonical
host) cannot send headers. A meta policy governs only what comes after it, so
nothing it covers (script, style, link, base) may come first; check.mjs 16
holds that. `scripts/lib/csp.mjs` (`withCsp(html, kind)`) computes the policy
from the page's own markup. `npm run build` applies it: `build-csp.mjs` runs
last over the hand-written pages and the three embeds, `build-scene` and
`build-legal` apply it to their own output, and `bump.mjs` applies it again
after stamping.

**The page policy** (index, 404, hub, scene, workspacehq, legal):

| Directive | Value | Why |
|---|---|---|
| `default-src` | `'self'` | the site makes no third-party request, and anything not listed below falls back to this |
| `script-src` | `'self'` + one `sha256-…` per inline script | the inline boot scripts (language and theme before paint, the Supabase switch) are allowed by hash. No `'unsafe-inline'`, and no nonces: a static host cannot mint one per response |
| `style-src` | `'self' 'unsafe-inline'` | the pages' own `<style>` blocks and `style="--x:…"` custom properties. Without it, index logs 29 refusals and scene 26. Writing `el.style.x` from a script is not governed either way. The risk accepted is CSS injection only, and the site shows no user content |
| `img-src` | `'self' data:` | the hub lightbox's placeholder is a `data:` GIF, plus `data:` URIs in CSS |
| `font-src` | `'self'` | every font is self-hosted |
| `connect-src` | `'self'` (+ the Supabase origin) | the origin is added only on index.html, only when its lead-store switch is on. It is read by running the switch script in a sandbox, as check.mjs block 8b reads it. A switch that cannot be read, or a non-https URL, stops the build |
| `media-src`, `frame-src` | `'self'` | workspacehq/ frames its own three embeds |
| `worker-src`, `object-src` | `'none'` | neither is used |
| `base-uri` | `'self'` | |
| `form-action` | `mailto:` | without scripts, the contact form posts to its `mailto:` action. With scripts, app.js opens a `mailto:` address itself, and form-action does not govern that |

JSON-LD, the scene/legal dictionaries (`application/json`) and the embeds'
`text/x-dc` templates are data blocks. The browser never runs them, so they
are not hashed and their content can change without a rebuild. No tag may
carry an inline handler (`onclick=…`) or a `javascript:` URL, because no hash
can allow either one. Attach listeners from a script file instead. No
`<script>` may sit inside an inline `<svg>` or `<math>` either: there the
browser decodes `&lt;` and CDATA in the script's text before hashing it, so
the hash taken from the source would not match. `csp.mjs` stops the build on
one, and check.mjs 16 fails; load that code from a script file.

**The embed exception** (`workspacehq/embed/*.html`, which run on the Claude
Design runtime) uses the same policy plus:
- `'unsafe-eval'`: `support.js` runs each component's code with
  `new Function`, and without this the console does not boot. It stays
  contained: the embeds are same-origin frames that run only first-party
  static code, the page that frames them keeps a strict script-src, and
  check.mjs 16 refuses `'unsafe-eval'` on any page that is not an embed.
- `font-src data:`: the stage inlines its `@font-face` files as `data:`
  URLs. Without it, the trailer and the walkthrough each log 3 refusals.
- `img-src blob:`: this is for the runtime's bundled-resource mode
  (`window.__resourceBlobs`). Today's exports do not use it, so dropping it
  changes nothing measurable. It is kept so that a re-export using that
  mode still works.
The runtime re-creates each helmet `<script>` with the same text, so the
hashes match both times it runs. The template's `onClick="{{ … }}"`
attributes are bindings that the runtime turns into React listeners, not
code. check.mjs 16 exempts them only on the embeds.

**Re-exporting an embed.** A new Claude Design export comes without the
meta. Run `npm run csp` (or `npm run build`), which writes the meta and
hashes any inline script the export carries. Then `npm run check`, and open
the embed through workspacehq/. Do this together with the self-containment
steps and the 16px rule in the WorkspaceHQ section above.

**Keeping hashes fresh.** Edit an inline script, then run `npm run build`
(or `npm run csp`). A page shipped with a stale hash loses its boot script.
The browser refuses it, `html.js` is never set, and every `js-only` control
(theme button, language switch, menu) stays hidden. check.mjs 16 fails when:
- a page's meta is not `withCsp(page)`;
- an inline script has no hash, or a hash no longer names a script;
- a page has an inline handler or a `javascript:` URL;
- an inline `<script>` sits inside an `<svg>` or `<math>`;
- something the policy governs comes before the meta;
- the policy drops below its floor. The floor is written down apart from
  the code that builds the policy, in `scripts/lib/csp-floor.mjs`, so that
  loosening `csp.mjs` does not pass on its own: every directive must be one
  the floor knows, given once (the browser enforces the first of a repeated
  directive and ignores the rest), with each value on that directive's list.
  script-src is limited to `'self'` and hashes (plus `'unsafe-eval'` on the
  embeds), default-src is `'self'`, `object-src 'none'`, `base-uri 'self'`.
  `script-src-elem` and `script-src-attr` are refused outright, because they
  override script-src for `<script>` elements and inline handlers. So are
  `'unsafe-inline'`, `'unsafe-hashes'`, `'strict-dynamic'`, nonces,
  wildcards, schemes and hosts in any script directive or default-src.
  Loosening the policy on purpose takes an edit to both files.

**Headers on the mirrors** (`netlify.toml` "/*" and `vercel.json` "/(.*)",
which check.mjs 16 keeps identical):
- `Content-Security-Policy: frame-ancestors 'self'; base-uri 'self';
  object-src 'none'`: frame-ancestors is the part a meta cannot carry. The
  browser enforces this policy on top of each page's meta, so it holds no
  fetch directive, which would block what the meta allows.
- `Strict-Transport-Security: max-age=63072000` (two years). Vercel already
  sends `max-age=63072000; includeSubDomains; preload` on every
  `*.vercel.app` deployment, and Netlify sends `max-age=31536000;
  includeSubDomains; preload` on `*.netlify.app` (both read with
  `curl -sI`, October 2026). A custom header most likely replaces the
  platform's, so ours uses Vercel's two years rather than shorten it there.
  check.mjs 16 accepts a year or more. `includeSubDomains` and `preload` are
  left out: they bind every subdomain of a custom domain, which is the
  owner's decision. After a deploy, `curl -sI` on each mirror shows the
  header actually sent.
- `X-Frame-Options: SAMEORIGIN`, for older browsers.

On the mirrors, another site that frames any page of this one is refused
(tested with an embed). On GitHub Pages it is not, and only a header could
change that.

**Proved in a real browser** (October 2026, Chromium, Playwright, no
`bypassCSP`):
- Zero violations on every page and frame, under the meta alone (Pages) and
  under the meta plus the mirrors' headers.
- index in fr/en/ar: the language switch, the theme menu, currency, the
  estimator, the FAQ, the pricing panels, the CV panel, and the form through
  to its `mailto:` handoff.
- scene's viewer, the hub lightbox, 404 at a nested path (also on an
  emulated `https://brvetr4ve1er.github.io/Numidea.tech/`), and the legal
  page's preview.
- workspacehq/ with the trailer and walkthrough playing and the console
  booted from "Boot the console" and clicked through, plus each embed
  opened directly.
- Each negative case is seen refused: a planted script on each of the 8
  pages, an edited boot script, an inline handler, a third-party image, the
  console without `'unsafe-eval'`, the trailer without `font-src data:`,
  cross-origin framing on the mirrors, and the Supabase switch flipped
  without a rebuild.

The gates now repeat most of this on every run, each failing on any
violation in any frame: `npm run audit` (every page loaded and scrolled, the
CV panel, the phone menu, the booted console, 404 two folders down here and
on an emulated Pages, the throttled phone's FAQ, estimator, currency and
language switches) and `npm run keys` (the theme menu, the form through its
`mailto:` hand-off, the lead store's POST with the switch on in a rebuilt
copy, the dialogs, the embeds taking focus).

Google's CSP Evaluator (npm `csp_evaluator` 1.1.8) has two findings on the
page policies, both MEDIUM_MAYBE:
- `'self'` in script-src. This matters only on a site that hosts JSONP,
  AngularJS or user uploads, and this one hosts none of them.
- `'unsafe-eval'`, on the embeds only.
It reports "script-src missing" on the mirrors' header policy alone. That is
expected: the header only adds frame-ancestors, and each page's meta, which
the browser enforces alongside it, carries script-src.

A browser check of the policy must count `securitypolicyviolation` events
from every frame and the console messages that name "Content Security
Policy". A frame-ancestors refusal reaches only the console, not the page.
A blocked request also shows as a failed request (`csp`).

## Visualisations (r3/c)

Five pictures, each of figures the page already states, each beside its text
equivalent (so the picture itself is `aria-hidden`):

| Picture | Where | Drawn from | Text equivalent |
|---|---|---|---|
| The section's own rail grows node to node, ending as the static rail | `#how` | the four steps | the steps |
| Send → 5 working days → call → decide, `0 DA` paid | `#apercu` | `prev.brief`'s terms | `prev.brief` |
| The delivery window, shortest to longest, on one 0–16-week ruler with both ends labelled | each tier card | `PRICE_MODEL.weeks` | `.t-time` |
| Estimate as a dimension line over the three packages | estimator | `ESTIMATE.quote`, `PRICE_MODEL.base` | the status line |
| Every range on one price scale | `#market` | `MARKET`, `nlRange`, `FX` | the table |

- **Scales are logarithmic** where the ranges span two orders of magnitude,
  and the market caption says so. Their bounds come from the data, so a
  price change never pushes a bar off its scale: the estimator's from the
  extreme quotes `ESTIMATE` can give (today 90 000–2 700 000 DA, drawn from
  72 000 to 2 970 000), the market's from `MARKET` and Numidea's ranges,
  never narrower than 40 000–10 000 000 DA.
- **The bars never move with the currency.** Converting is a constant factor,
  which on a log scale only slides the tick labels.
- **The drawn state is the default.** app.js adds `.vz-arm` to hold a picture
  back and `.vz-go` / `.vz-lit` (the rail: `--rail`) to play it, only when motion is
  allowed and the picture is not already on screen; reduced motion and
  scripts-off get the finished picture at once. Entrance only, started by
  IntersectionObserver, on transform and opacity: no scroll handler. A
  picture held back never dims text below its contrast: the method's
  numbered nodes wait small, not faded, until the rail reaches them.
- **Buttons answer focus as they answer hover** (the ring stays the focus
  indicator), and buttons and estimator chips give a little under a press
  (`scale(.97)`, motion allowed only).
- Numidea is the accent (`--teal`, thicker); the markets share one neutral
  (`--muted` at 75%, at least 3:1 against the ground in every theme; the
  estimator's unlit package bands keep a light fill with a `--muted` edge). An open range ("+", no ceiling) is drawn solid up to
  its stated top like any other, then fades out over the next half of its
  value: the fade says "and up" and never shortens the range the table
  states. Text keeps the text tokens. Lane names are always
  written out, never coded: under a 440px chart (a phone) each name takes
  its own line above its bar, so the bars keep the whole width.
- The Aperçu timeline, the estimator and the market chart lay themselves
  out by **container query**: the box's own width decides, not the screen's.
- **A floating label is pinned on its inline-start side** (`inset-inline-start`,
  the right in Arabic) and moved only by its transform. Pinned by its other
  edge, every new text width moves its start corner, and Chrome counts that
  as a layout shift even on hover or scroll (neither is an input).
- **The market chart is built on first open** of the folded "Comment on
  chiffre" panel (on the summary's click, before the panel opens, so it is
  there in the panel's first frame): the page load pays nothing for a
  picture most visitors never unfold. Two exceptions keep a target in
  place: an arrival on a fragment inside the panel (`#mk-cap`, or a
  `#:~:text=` link, which only the navigation entry still carries) builds
  it before load, because the browser fixes its scroll target at load and
  a chart built after it left the target a chart's height below the
  screen; and any other opening (find in page) holds the table where it
  was while the chart goes in above it.
