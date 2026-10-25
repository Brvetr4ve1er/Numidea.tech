---
type: map
updated: 2026-10-25
sources: [BRAND.md, assets/app.js, assets/illus/, scripts/plates.mjs, scripts/check.mjs, scripts/keys.mjs, hub/style.css, workspacehq/embed/hq-fx.js]
---

# Motion and illustration

How the home page moves and what it draws with: the ambient layer (parallax, hero floaters, reveal), the hand-drawn icons, the generated line-art illustrations, the six engraved plates of the atlas and the founder section, plus the scrolling rules learned while making all of it smooth (BRAND.md › The ambient layer — parallax, aurora, reveal; The icon set; Generated illustrations; The atlas — engraved plates and animated icons; Performance — what made scrolling slow). The ambient layer is pure decoration: `aria-hidden`, under the content at `z-index:0`, and removed completely by `prefers-reduced-motion` (BRAND.md › The ambient layer — parallax, aurora, reveal). Start with the ambient layer, then the atlas table; the colours every mask is inked in come from [[Themes and tokens]].

## The ambient layer

| Piece | What it does | Source |
|---|---|---|
| Parallax | `data-parallax="<k>"` adds depth, roughly −0.2 to +0.2, negative against the scroll; `app.js` writes one inline `translate` per element | BRAND.md › The ambient layer — parallax, aurora, reveal |
| Cached positions | Layout positions are cached and re-read only on resize, on load and on `numidea:relayout`, which `applyTheme` dispatches | BRAND.md › same section; assets/app.js › 921 |
| Time-based easing | The easing settles at the same speed on a 60 Hz and a 120 Hz display | BRAND.md › same section |
| Hero floaters | Hand-drawn SVG geometry in the hero's empty bands, never behind the headline or buttons; dropped below 960px | BRAND.md › same section |
| Reveal | Batched on the next animation frame, staggered 70ms apart (at most 210ms), rising 12px from 8% of a screen below the fold | BRAND.md › same section |
| Aurora | Removed in the anti-slop sweep; kept as a lesson | BRAND.md › same section |

- Parallax rides the `translate` property, never `transform`, so one element can be parallaxed and still run a reveal, a hover scale and a spin without one clobbering another (BRAND.md › The ambient layer — parallax, aurora, reveal).
- `check` block 3b fails when a `data-parallax` depth does not parse to a non-zero number (scripts/check.mjs › block 3b).
- `npm run keys` holds the site's own reduced-motion handling, with `prefers-reduced-motion: reduce` emulated and nothing injected: nothing that reveals on scroll is hidden at load; once the network is idle and a key has woken the page, no script writes styles, classes or text for 6 s; no infinite or long animation runs, in any frame; each embedded player holds its playhead; `html` and `body` are not `scroll-behavior: smooth` and the skip link's jump lands in one step; and WorkspaceHQ's booted console keeps Bit still, with the OS setting and with the page's PAUSE MOTION button (scripts/keys.mjs › header).
- hub/'s reduced-motion block names `html` for `scroll-behavior:auto`: its universal rule lost to `html{scroll-behavior:smooth}` on specificity (hub/style.css › MOTION-SAFE). With motion off, Bit no longer walks on his own; a drag still moves him (workspacehq/embed/hq-fx.js › tick).
- Only `html.js-ready`, set by `app.js` as its first act, hides anything, so a blocked script never leaves sections invisible (BRAND.md › Stress test).
- The hero headline, lede and plate rise with `transform` only and are never transparent: with the fade, the browser credited the hero plate as painted at 7.5s on Slow 3G, and at 3.7s without it (BRAND.md › Stress test).
- Graph: [[Ambient layer (parallax, aurora, reveal)]], [[Parallax via CSS translate property]], [[Cached layout positions (numidearelayout)]], [[Reveal entrance (rAF-batched stagger)]], [[Hero floaters (hand-drawn SVG geometry)]], [[Never fade the LCP element (hero-rise-solid)]], [[Stress test harness]].

## Scrolling: what made it slow

| Measured, CPU 4× | Style recalc | Script | Idle, 3 s untouched |
|---|---|---|---|
| index, before / after | 4.5s / 0.95s | 2.0s / 0.5s | 0 / 0 |
| hub, before / after | 2.3s / 0.69s | 0.74s / 0.41s | 181 frames / 0 |

Source: BRAND.md › Performance — what made scrolling slow.

- The causes: parallax wrote inherited custom properties, restyling whole subtrees; the scroll position was read right after a style write in the same frame; the hub's animation loop never stopped; fixed backgrounds, blend modes and large blurs cost GPU work (BRAND.md › Performance — what made scrolling slow).
- The rules now: never animate through inherited custom properties; never read layout after a style write in the same frame; every animation loop must have a stop condition (BRAND.md › Performance — what made scrolling slow).
- Round 3 added: one read of the scroll position per event into `scrollPos` (assets/app.js › 988–990); read content held still on touch screens (`.px-still`); touch decoration driven by `ScrollTimeline` instead of script; read content moved at most 12px, decoration 64px (assets/app.js › 1137–1158; BRAND.md › Scroll comfort (round 3)).
- On a throttled phone, frames over 25ms fell from 17% to 10% of the scroll, and the median reveal now starts 115ms before its element enters view, where it used to start 167ms after (BRAND.md › Scroll comfort (round 3)).
- What is left on the phone is the icons drawing themselves in, which is kept as designed because it does not touch the scroll itself (BRAND.md › Scroll comfort (round 3)).
- Graph: [[Scroll performance fixes]], [[Scroll comfort (round 3)]].

## Icons

- **The service icon set.** Eleven hand-authored SVGs, one per service, on a 24×24 viewBox with a 1.5 stroke in `currentColor`; no icon library and no raster assets (BRAND.md › The icon set).
- They draw themselves on reveal through `stroke-dashoffset`, so every shape must be a stroked path; a check asserts each mark's box stays inside 0–24 (BRAND.md › The icon set).
- Each is specific to its label, for example a registration mark for L'Aperçu and a viewport for web (BRAND.md › The icon set).
- A separate section, Iconography, describes the service marks differently, as geometric constructions on the page's hexagonal motif (an aperture, a compass vesica, an escapement, an astrolabe, a lattice), and names the animation hooks `.spin`, `.sweep`, `.gem`, `.r2` and `.r3`, with `pathLength="1"` on every drawable element (BRAND.md › Iconography). BRAND.md does not say which of the two descriptions is current.
- **Animated icons (`.ai`).** 32 inline icons on the same grammar, from the proof stats to the contact channels; they draw in once, then an idle loop runs (BRAND.md › Animated icons (`.ai`)).
- Select drawable parts by class `.p`, never as `[pathLength]`: Chromium kept a stale style on the attribute selector and the contact icons never appeared (BRAND.md › Animated icons (`.ai`)).
- Put icons beside `data-i18n` elements, never inside, because `applyLang` replaces their content (BRAND.md › Animated icons (`.ai`)).
- Graph: [[Service icon set (11 hand-authored SVGs)]], [[Geometric service marks (hexagonal motif)]], [[pathLength=1 stroke draw-on]], [[Animated icons (.ai)]].

## Generated illustrations

- Monochrome line art, white on black, applied as CSS luminance masks over `currentColor` and never as `<img>`, so one file re-tints itself in all six palettes (BRAND.md › Generated illustrations).
- BRAND.md counts 13 such rasters (BRAND.md › Generated illustrations); `assets/illus/` today holds ten PNG figures for the FAQ and the hub, twelve WebP masks for the atlas plates, the lantern and the workbench, and three `px-*` WebP textures (assets/illus/).
- Below roughly 90px they collapse into smudges, so the FAQ figure sits in the open answer at 92px and the method tiles put it above the text at 124px (BRAND.md › Generated illustrations).
- Check polarity after every batch: one render came back inverted and masked to a solid block (BRAND.md › Generated illustrations).
- Every figure sits in a fixed-size box, so measured layout shift stays 0 on index; they are `aria-hidden`, and print drops them (BRAND.md › Generated illustrations).
- A harness that checks masks must serve over HTTP: `file://` blocks masks without a console error (BRAND.md › Two traps this cost time on).
- Graph: [[Generated illustrations (assetsillus)]], [[CSS luminance mask over currentColor (.ill)]].

## The atlas: six engraved plates

The page reads as an engraved atlas of the region the studio works from, after the footer line "rooted in Numidia" (BRAND.md › The atlas — engraved plates and animated icons).

| Plate | Where | File | Motion |
|---|---|---|---|
| I — Les Bibans | Full-bleed under the hero | `vista-far/mid/near.webp` | Three-layer parallax, twinkling sky, a constellation that draws itself |
| II — Arc de Trajan, Timgad | Behind the `#work` header | `arch.webp` | Parallax |
| III — Monnaies numides | Beside the `#pricing` header, at 1100px and up | `coin-*.webp` | Three coins at three depths, each turning |
| IV — Coupe des couches | Behind `#stack` | `strata.webp` | A core sample drilling across |
| V — Cap Carbon, Béjaïa | Behind the contact channels | `lighthouse.webp` | The beam sweeps |
| VI — Le Grand Erg | Between `</main>` and the footer | `dunes.webp` | Parallax |

Source: BRAND.md › The atlas — engraved plates and animated icons.

- Two uncaptioned figures join them: a lantern in the `#faq` gutter and the founder's workbench behind the founder card (BRAND.md › The atlas — engraved plates and animated icons).
- The mid layer of plate I is a generic round tomb, not the Medracen, and is never captioned as such (BRAND.md › The atlas — engraved plates and animated icons).
- Depth needs occlusion: each vista layer is a fill clipped to its skyline, then the ink; the skylines are traced by `scripts/plates.mjs` (BRAND.md › The atlas — engraved plates and animated icons; scripts/plates.mjs › skyline). The masks are made by the same script: [[Captures and image tools]].
- Masks load lazily: their URLs apply only under `.lz-on`, which `app.js` §15 adds a screen ahead of the viewport (BRAND.md › The atlas — engraved plates and animated icons; assets/app.js › 15. illustrations and animated icons).
- Nothing loops forever: each loop plays a few cycles and settles, and replays when it comes back on screen; `npm run audit` fails on any infinite animation (BRAND.md › The atlas — engraved plates and animated icons).
- Graph: [[The atlas - six engraved plates]], [[plates.mjs]].

## The founder section

- Every date, title and one-liner in the founder card comes from `assets/cv_yasser_hamisse_2026.pdf`; edit the CV and the site together (BRAND.md › Founder section — the CV is the source of truth).
- The timeline follows the CV's order, current roles first; ongoing roles carry `.tl-now`; Arabic dates use the Maghreb month names (BRAND.md › Founder section — the CV is the source of truth).
- The team is anonymized by design: initials only, no names or genders, so the copy uses no pronouns for D, S and T (BRAND.md › Founder section — the CV is the source of truth).
- The CV panel opens by animating a grid row from `0fr` to `1fr`, not `max-height` (BRAND.md › Founder section — the CV is the source of truth).
- On wide screens the founder card spans 8 of 12 columns and the team the other 4 (BRAND.md › Bento, loading states and wayfinding).
- The founder's own artist page is `hub/`, which holds no client sites (BRAND.md › hub/ — the artist's page, not the studio's); see [[WorkspaceHQ and hub]].
- Graph: [[Founder section]], [[assetscv_yasser_hamisse_2026.pdf]], [[hub (Yasser's artist page)]], [[_COMMUNITY_Founder Section and Atlas Plates]], wiki [[Founder_Section_and_Atlas_Plates]].

## Ground, grids and wayfinding

- **Background.** A construction grid of 64px hairlines that fades out by about 76% of the viewport height, over two radial gradients; it replaced a honeycomb tile and a film grain (BRAND.md › The background). Graph: [[Construction-grid background]].
- **Bento.** Work is a 3-column bento at 1100px and up, where the card order in `index.html` is part of the layout; services and stack use 6 columns, 3+3 over 2+2+2 (BRAND.md › Bento, loading states and wayfinding). Graph: [[Home bento grids (work, services, stack, founder)]].
- **Loading.** Images still loading get a finite shimmer (`.sk`); every `<img>` declares `loading` (BRAND.md › Bento, loading states and wayfinding).
- **Wayfinding.** Scroll-spy marks the current nav link with `aria-current`, a crumb shows the section at 960px and below, and a back-to-top button appears after 1.5 viewports (BRAND.md › Bento, loading states and wayfinding).

## Traps and the visual pass

- BRAND.md keeps a list of CSS traps the codebase actually hit, each found by measuring: a grid item with auto margins collapsing to 0×0, a zero-size box passing every overlap test, a bare `1fr` track inflating to its longest word, `justify-content:center` pushing an overflowing menu out of both ends, an ancestor's `z-index` capping its overlay, and more (BRAND.md › CSS traps this codebase has actually hit). Graph: [[CSS traps this codebase has hit]].
- A visual pass, viewport by viewport, found bugs every gate had passed: the wordmark reversed in Arabic, "<24h" rendered backwards, an empty-looking proof band, a footer icon sitting low; the same section introduces `npm run vbugs`, which scans for overlapping, escaping and clipped text (BRAND.md › Visual pass — what the automated checks could not see). Graph: [[Visual pass (manual viewport walk)]].

## Related

- Maps: [[Themes and tokens]], [[Site architecture]], [[Captures and image tools]], [[Build and gates]], [[WorkspaceHQ and hub]], [[Studio and offer]], [[Maps/Glossary|Glossary]].
- Communities: [[_COMMUNITY_Ambient Motion and Reveal]], [[_COMMUNITY_Founder Section and Atlas Plates]], [[_COMMUNITY_Hero Plate and Client Logos]], [[_COMMUNITY_Design System Summary]], [[_COMMUNITY_Anti-slop and Gates]].
- Wiki: [[Ambient_Motion_and_Reveal]], [[Founder_Section_and_Atlas_Plates]], [[Hero_Plate_and_Client_Logos]], [[Design_System_Summary]], [[Anti-slop_and_Gates]].
