---
type: map
updated: 2026-10-26
sources: [package.json, README.md, BRAND.md, OWNER-CONTENT.md, .gitignore, audit/Architecture.md, scripts/shots.mjs, scripts/work-capture.mjs, scripts/client-logos.mjs, scripts/og-capture.mjs, scripts/build-og.mjs, scripts/plates.mjs, scripts/build-creative.mjs, scripts/lib/screen-quad.mjs, scripts/lib/serve.mjs, scripts/verify.mjs, scripts/check.mjs, .github/workflows/pages.yml]
---

# Captures and image tools

Seven Node scripts make the site's pictures offline with Playwright and sharp: screenshots of the live client sites, project-sheet captures, the client logos, the share images, the atlas masks and the ad creatives (package.json › scripts, devDependencies; each script's header). None of them is one of the gates, and none runs in CI or before a deploy (scripts/verify.mjs › STEPS; .github/workflows/check.yml › 38–111; .github/workflows/pages.yml › 36–144). The images they write are committed with the site (README.md › This repository — the landing page; scripts/shots.mjs › header), except the ad images, which are written into the private campaign kit (scripts/build-creative.mjs › header). Start with the table, then read the section for the tool you are about to run; the gates themselves are in [[Build and gates]].

## The tools

| Script | Command | Takes | Writes | Needs |
|---|---|---|---|---|
| `shots.mjs` | `npm run shots [slug]` | Five live builds on Netlify, at 1280×800, 2× | `assets/previews/<slug>.webp` | Network |
| `work-capture.mjs` | `npm run work:capture [slug]` | Four desktop pages (1440×900) and two phone screens (390×844, 2×) per project | `assets/work/<slug>/` | Network; a local server on port 8765 for WorkspaceHQ |
| `client-logos.mjs` | `npm run logos` | The header logo of each delivered client's live site | `assets/clients/` | Network |
| `og-capture.mjs` | `npm run og` (first step) | The first screen of `hub/` and `workspacehq/` at 1200×630 | `hub/og.jpg`, `workspacehq/og.jpg` | The local harness |
| `build-og.mjs` | `npm run og` (second step) | Arcanum tokens, self-hosted faces, one real client capture | `assets/og.jpg` | The local harness |
| `plates.mjs` | `node scripts/plates.mjs <dir>` | Generated engravings, kept outside this repository | `assets/illus/*.webp` and skyline polygons | sharp only |
| `build-creative.mjs` | `node scripts/build-creative.mjs [ad-id …]` | The private campaign kit and committed captures | JPEG ads in the kit's own output folder | The kit; Playwright, sharp |

Sources: package.json › scripts; the header of each script; scripts/shots.mjs › W, H, deviceScaleFactor; scripts/og-capture.mjs › PAGES.

- Playwright and sharp are dev dependencies (package.json › devDependencies); the July audit described them as existing only for this offline screenshot pipeline, never shipped to the browser (audit/Architecture.md › What this system is). Graph: [[playwright]], [[sharp]], [[Offline screenshot-capture pipeline (Playwright + sharp)]], [[Zero-dependency trilingual static marketing site]].
- `og-capture`, `build-og` and `build-creative` serve the repository through the shared harness, and `client-logos` uses its browser launcher (their import lines; scripts/lib/serve.mjs › header). `shots.mjs` and `work-capture.mjs` launch Playwright's Chromium themselves; `work-capture.mjs` names a fixed browser path in the script (scripts/shots.mjs › run; scripts/work-capture.mjs › chromium.launch).
- Graph: [[_COMMUNITY_Studio Overview and Tooling]], [[_COMMUNITY_Dev Dependencies]], wiki [[Studio_Overview_and_Tooling]], [[Dev_Dependencies]].

## Client screenshots: shots.mjs

- Captures each live project at a fixed 16:10 viewport, 1280×800, which matches the work card's thumbnail ratio; renders at 2× and writes a WebP at quality 80 (scripts/shots.mjs › header, W, H, run).
- Five entries: Bordj Steel, AlmaFlowClim, Alliance Travel, Nomara Voyages and the Glaive demo, each captured from its Netlify build even when a card links a production domain (scripts/shots.mjs › PROJECTS).
- A failed capture keeps the existing file (scripts/shots.mjs › run).
- `check` fails when `shots.mjs` and the page cover different clients (scripts/check.mjs › block 5).
- Graph: [[shots.mjs]], [[_COMMUNITY_Project Screenshot Capture]], wiki [[Project_Screenshot_Capture]]. Where the pictures appear: [[Clients and projects]].

## Project-sheet captures: work-capture.mjs

- Four desktop pages and two phone screens per project, from the live sites, into `assets/work/<slug>/{d1..d4,m1,m2}.webp`; its page lists must match `scripts/scene-data.mjs`, and `npm run scene` comes next (scripts/work-capture.mjs › header).
- Notes from the first capture on 2026-10-06: Alliance Travel's home hero is a WebGL globe that renders black in headless Chromium, so its desktop "home" is the `#voyages` section; one Bordj Steel product page showed the site's own error screen, so `/products` is used (scripts/work-capture.mjs › header).
- On Alliance Travel's trip pages the script presses the site's own "Passer" (skip) control so the shot shows what a visitor lands on (scripts/work-capture.mjs › skip).
- Graph: [[work-capture.mjs]]. The sheets are in [[Project sheets]].

## Client logos: client-logos.mjs

- Each file is the logo the client's live site shows in its header, taken from that site and never redrawn; the script checks it really is the header logo and stops if a site has changed (scripts/client-logos.mjs › header).
- Four files: `bordjsteel.svg` (the header's inline SVG), `alliance.svg` (the site's `logo.svg`, compared path by path with the inline drawing), `almaflow.webp` and `nomara.webp` (header images; Nomara's from its dark mode) (scripts/client-logos.mjs › header).
- Colour stays as served, because the page paints every logo in one theme colour through a CSS mask; each file is cropped to its drawing; SVG path data is written to 2 decimals; rasters are at most 96 px tall and saved as WebP at quality 75 (scripts/client-logos.mjs › header, RASTER_H).
- An SVG logo carrying scripts, `foreignObject`, embedded images, event handlers or `javascript:` links is refused (scripts/client-logos.mjs › ACTIVE).
- Only the four delivered client sites have a logo; Glaive Store and WorkspaceHQ are not clients (scripts/client-logos.mjs › header). If Nomara Voyages turns out not to be a client, its logo comes out of this script too (OWNER-CONTENT.md › 7); see [[Open owner items]].
- `check` block 5b requires the logo strip to be exactly the delivered clients, each with its own file, alt, intrinsic size and mask (scripts/check.mjs › block 5b).
- Graph: [[client-logos.mjs]], [[Client logo strip (scriptsclient-logos.mjs)]], [[_COMMUNITY_Client Logo Extraction]], wiki [[Client_Logo_Extraction]].

## Share images: og-capture.mjs and build-og.mjs

- `og-capture.mjs` renders `hub/` and `workspacehq/` themselves at 1200×630, their real first screen rather than artwork made for the purpose, with reduced motion, and saves a JPEG next to each page (scripts/og-capture.mjs › header, PAGES).
- `build-og.mjs` draws `assets/og.jpg`: one static card for every language, because scrapers read `og:image` without running scripts; it is in French, uses the Arcanum tokens and the self-hosted faces, and its only image is a real capture of a delivered site (scripts/build-og.mjs › header).
- Graph: [[og-capture.mjs]], [[build-og.mjs]].

## Atlas masks: plates.mjs

- Turns the generated engravings (white line art on black; the sources live in the generation account's project, not in this repository) into the luminance masks in `assets/illus/*.webp` (scripts/plates.mjs › header).
- Every output is checked for polarity: a mask that came back inverted would paint as a solid block, so a high mean luminance throws (scripts/plates.mjs › header, out()).
- It traces the skyline polygons that clip each vista layer's fill, the first bright pixel per column across 160 columns, into `.tmp/poly.json`; `.tmp/` is git-ignored, and the polygons themselves live in the stylesheet (scripts/plates.mjs › skyline; .gitignore; BRAND.md › The atlas — engraved plates and animated icons).
- Outputs: the three vista layers, dunes, lighthouse, arch, bench, lantern and three coins (scripts/plates.mjs › 39–49). The strata mask went with the tools section on 2026-10-26 (BRAND.md › The atlas — engraved plates and animated icons).
- Graph: [[plates.mjs]]. What the plates are and where they sit: [[Motion and illustration]].

## Ad creatives: build-creative.mjs and lib/screen-quad.mjs

- The campaign kit is the owner's private material and is not in this repository; the script reads it from `./campaign` (git-ignored) or from `CAMPAIGN_DIR`, and stops with an error if it is missing (scripts/build-creative.mjs › header, KIT; .gitignore).
- Each image is a photographic scene with a flat chroma-green device screen, onto which a real capture or a neutral demo homepage is warped, and every word is set as text in the site's own faces: no interface and no lettering is AI-drawn (scripts/build-creative.mjs › header).
- Where no scene was generated, the ad is "flat": the Arcanum ground with a phone or browser drawn in CSS around the capture (scripts/build-creative.mjs › flatHtml).
- Sizes: 9:16 at 1080×1920 with the top 14% and bottom 35% kept free of text, 4:5 at 1080×1350, 1:1 at 1080×1080 (scripts/build-creative.mjs › header).
- Prices in the copy are the Essentiel floor from `PRICE_MODEL`, converted to € and $ with the same rates and rounding as the page (scripts/build-creative.mjs › prices); see [[Pricing and market]].
- `screen-quad.mjs` finds the largest connected green region, fits a straight line to each edge with an outlier cut (which drops the notch, rounded corners and a thumb over the glass), and intersects the lines for the four corners; its other exports make the screen mask, the CSS `matrix3d` that maps a rectangle onto those corners, and the scene with its green screen neutralised (scripts/lib/screen-quad.mjs › header, maskPng, matrix3d, despill).
- Clients' permission to appear in paid ads has not been asked yet; that is owner item 6 (OWNER-CONTENT.md › 6).
- Graph: [[build-creative.mjs]], [[screen-quad.mjs]], [[findScreen()]], [[matrix3d()]], [[_COMMUNITY_Ad Creative Builder]], [[_COMMUNITY_Screen Compositing (screen-quad)]], wiki [[Ad_Creative_Builder]], [[Screen_Compositing_screen-quad]].

## Related

- Maps: [[Build and gates]], [[Clients and projects]], [[Project sheets]], [[Motion and illustration]], [[Open owner items]], [[Deploy]].
- Communities: [[_COMMUNITY_Project Screenshot Capture]], [[_COMMUNITY_Client Logo Extraction]], [[_COMMUNITY_Ad Creative Builder]], [[_COMMUNITY_Screen Compositing (screen-quad)]], [[_COMMUNITY_Studio Overview and Tooling]], [[_COMMUNITY_Dev Dependencies]], [[_COMMUNITY_Browser Audit and OG Build]].
- Wiki: [[Project_Screenshot_Capture]], [[Client_Logo_Extraction]], [[Ad_Creative_Builder]], [[Screen_Compositing_screen-quad]], [[Studio_Overview_and_Tooling]], [[Dev_Dependencies]], [[Browser_Audit_and_OG_Build]].
