---
type: map
updated: 2026-11-06
sources: [README.md, BRAND.md, NOTICE.md, OWNER-CONTENT.md, IMPROVEMENTS.md, index.html, assets/app.js, assets/carry.js, assets/styles.css, assets/fonts-hub.css, hub/index.html, hub/app.js, hub/style.css, hub/fonts/OFL.txt, scripts/build-hub-rig.mjs, scripts/build-hub-art.mjs, scripts/hub-art-data.mjs, scripts/build-og.mjs, scripts/build-legal.mjs, scripts/sweep.mjs, scripts/vbugs.mjs, scripts/validate.mjs, scripts/validate-embed.json, workspacehq/index.html, workspacehq/app.js, workspacehq/style.css, workspacehq/embed/trailer.html, scripts/site.mjs, scripts/scene-data.mjs, scripts/build-sitemap.mjs, scripts/check.mjs, scripts/audit.mjs, scripts/keys.mjs, scripts/lib/csp.mjs, workspacehq/embed/hq-fx.js, netlify.toml, vercel.json]
---

# WorkspaceHQ and hub

Two published pages sit beside the studio's landing page with their own CSS and JavaScript: `hub/`, VOIDSPLUNKER.std, the founder's personal page, and `workspacehq/`, the launch page of WorkspaceHQ v3, the studio's own product (README.md › This repository — the landing page). Both are in English and both are in the deploy set (hub/index.html › 2; workspacehq/index.html › 2; scripts/site.mjs › DEPLOY); the hub links WorkspaceHQ from one Elsewhere row, "my favourite build", and WorkspaceHQ's footer links back (hub/index.html › 08 · ELSEWHERE; workspacehq/index.html › footer); the game-cartridge link that did this left with the hub's rebuild of 2026-11-05 (BRAND.md › workspacehq/, The cartridge). Start with the comparison table, then read the section for the page you are changing; the WorkspaceHQ project sheet is covered in [[Project sheets]].

## At a glance

| | `hub/` | `workspacehq/` |
|---|---|---|
| What it is | Yasser's own page, since 2026-11-05 his character bible: a live drawn rig of him and Kūro, then who he is, in drawings, and his links (BRAND.md › hub/ — the artist's page, not the studio's) | Launch page for WorkspaceHQ v3, "your codebase, now playable" (workspacehq/index.html › 7) |
| Title | `Yasser Hamisse (br4vetr4veler) — artist, designer, developer`: the person's name, one spelling of the handle (hub/index.html › 7; since 2026-11-02) | `WorkspaceHQ v3 — your codebase, now playable` (workspacehq/index.html › 7) |
| Language | English (hub/index.html › 2) | English (workspacehq/index.html › 2) |
| Themes | One paper palette since 2026-11-05: no theme pill, no `void-theme`, no night; `theme-color` `#d8cbb8`, `color-scheme` light (hub/index.html › head) | One look: the WorkspaceHQ design system's ARCADE tokens (workspacehq/style.css › 1) |
| Fonts | Archivo 800–900 (display), Permanent Marker (notes, the speech bubble) and Noto Sans JP 700–900 cut to six glyphs, the page's own subsets in `hub/fonts/` (Archivo and Noto Sans JP under the SIL OFL 1.1, `hub/fonts/OFL.txt`; Permanent Marker under the Apache License 2.0, `hub/fonts/LICENSE-permanent-marker.txt`); Geist (text) and Geist Mono (labels) through `assets/fonts-hub.css`; Syne is no longer set (hub/style.css › the font faces; hub/index.html › head) | Press Start 2P and VT323, self-hosted in `workspacehq/fonts/` and, since 2026-10-31, served from there to the embed's design-system tokens too (workspacehq/style.css › the font faces; the embed's `_ds/…/tokens/fonts.css`) |
| Scripts | `hub/app.js`, `assets/carry.js` (hub/index.html › end of body) | `workspacehq/app.js`, `assets/carry.js` (workspacehq/index.html › end of body) |
| Reached from | WorkspaceHQ's footer, "BY br4vetr4veler"; its breadcrumb dropped the handle on 2026-11-06 (commit 0b01ae5), and the home's "Portfolio personnel" link, `founder.portfolio`, was removed on 2026-11-02 (IMPROVEMENTS.md › decision 11); the wordmark's link from both pages goes to the studio (workspacehq/index.html › footer) | The hub's Elsewhere row "WorkspaceHQ v3 · my favourite build" (hub/index.html › 08 · ELSEWHERE); project sheet 04 (scripts/scene-data.mjs › PROJECTS). The hub's cartridge went on 2026-11-05 with the old hub, the home footer's on 2026-10-26, an owner decision (BRAND.md › workspacehq/, The cartridge) |
| Sitemap | One URL, no language alternates (scripts/build-sitemap.mjs › MULTILINGUAL) | One URL, no language alternates (scripts/build-sitemap.mjs › MULTILINGUAL) |
| Cached by the mirrors | `hub/art/*` for a day, like `assets/*` (netlify.toml, vercel.json › headers) | `workspacehq/embed/*` for a day: its audio, model and vendor code are the heaviest files published (netlify.toml › the cache comment) |

Both pages load `assets/carry.js`, so a link back to the home page keeps any `ref`, `utm_*`, `fbclid` or `gclid` parameter the visitor arrived with; since 2026-10-31 the home link lands on the visitor's stored language's page (`/`, `/en/`, `/ar/`) through the root's head script (assets/carry.js › 1; BRAND.md › The language pages).

## hub/ — the artist's page

**Rule:** client websites do not belong here; a "Selected Work" section was added once and removed at the owner's request, and `npm run check` fails if the host of any project site linked from the home page appears in `hub/` (BRAND.md › hub/ — the artist's page, not the studio's; scripts/check.mjs › block 5).

Since 2026-11-05 the page is the founder's character bible: the owner chose his own design of that name as the hub, and it was ported natively, with no runtime, no framework and no third-party host, so the CSP stays `'self'` (commits 56f29c1, 6216ec9; BRAND.md › hub/). The copy is the design's English; the footer keeps the owner's "agency of one" line (hub/index.html › FOOTER).

| Section | Anchor | What it holds |
|---|---|---|
| Cover | `#top` | Breadcrumb (the studio's wordmark, then VOIDSPLUNKER.std), "Character bible", the one `h1` "Yasser.", the 夜 seal and the tagline, the marker line, and the drawing of the two at rest (hub/index.html › COVER) |
| 00 He's alive | `#alive` | The live rig of Yasser and Kūro, fourteen act buttons, the rules it follows; the skip link's target, "Skip to the character" (hub/index.html › 00 · HE'S ALIVE) |
| 01 Who he is | `#who` | Profile card, wants, fears, flaw and tell, six axes (hub/index.html › 01) |
| 02 The silhouette | `#silhouette` | Four pixel silhouettes, seven marks, six colours (hub/index.html › 02) |
| 03 Twelve faces | `#faces` | Twelve faces, each with the job it does (hub/index.html › 03) |
| 04 What he does | `#does` | Twelve poses (hub/index.html › 04) |
| 04b Head to toe | `#toe` | Six full-body actors, two frames each, that flip on scroll-in, hover and click (hub/index.html › 04b) |
| 05 Kūro | `#kuro` | Who the cat is and his ten cards, on an ink band (hub/index.html › 05) |
| 06 How he talks | `#talks` | Six lines in French and English with their faces; what he does and never does (hub/index.html › 06) |
| 07 A day on Studio | `#day` | The day's beats, one row each (hub/index.html › 07) |
| 08 Elsewhere | `#elsewhere` | Eleven links (Behance first, WorkspaceHQ among them) and the one email (hub/index.html › 08 · ELSEWHERE) |
| Footer | `#foot` | The bio, ©, "Back to top" (hub/index.html › FOOTER) |

How it is built:

- **The rig** (hub/app.js › 1 · the rig): thirteen drawn frames of Yasser and seven of Kūro, stacked; a change of face is an opacity cut. The two base frames are in the page and the eighteen others wait in `<template id="rigFrames">` until the panel is on screen. Nothing moves on its own for longer than five seconds: the loop runs five seconds (`WINDOW`) after the panel is first seen and after every move, click or button, eases out over 700 ms and stops. With reduced motion the cursor is not followed and nothing breathes; a click or a button still cuts to a face. Both figures are buttons; every line is typed in the bubble and written in full in `#rigSaid` (`aria-live`). Without scripts the controls are not drawn (the head adds `html.js`) (hub/app.js › header; hub/index.html › 00; BRAND.md › hub/).
- **One palette, paper** (hub/style.css › header): paper `#D8CBB8`, cream, sand, floor, ink `#211E1B`, the seal's red `#A34135` as a fill only and `#8A3127` for red text (5.16:1 on paper), a teal stamp; no radii, hard offset shadows, ink rules, a 400-byte SVG grain tile. The contrast of each pair against its own ground is listed at the top of the sheet. On 2026-11-06 the sweep's two failures there were fixed: クロ on the ink band and the footer's heart (2.66:1 and 3.87:1 before; commit d3c907a).
- **Type**: the three faces of `hub/fonts/` with `font-display:swap`, Archivo and Permanent Marker preloaded with Geist latin; preloading the marker face took the cover's layout shift from 0.0128 to 0 (commit 17c8e7b); "Kūro" is still written `Ku&#x304;ro` so the latin subsets carry it; labels never under 12px (hub/index.html › head; hub/style.css › header). `scripts/build-legal.mjs` lists Archivo and Noto Sans JP with the OFL fonts and Permanent Marker on its own under the Apache License 2.0, with a sentence in FR, EN and AR (commit 1961bfd).
- **The art**: `npm run hub:rig` (`scripts/build-hub-rig.mjs`) cuts the owner's private character-sheet exports, found through `HUB_BIBLE_DIR`, into `hub/art/` as WebP, nothing upscaled, byte for byte; it fails on a rig frame over 60 kB, a rig set over 1.2 MB or any other file over 300 kB, and is not part of `npm run build`. Names: `rig-y-*`, `rig-k-*`, `face-*`, `pose-*`, `actor-*-{a,b}`, `kuro-*`, `sil-*`, plus `grain.svg`. On 2026-11-06: 71 files, 1,762,079 B, the largest `pose-inspect.webp` at 46,978 B; check 17 caps `hub/art` at 52 kB a file and `hub/fonts` at 33 kB, and block 17b holds the page to the files (scripts/build-hub-rig.mjs › header; scripts/check.mjs › block 17, 17b).
- **Share card**: `npm run og hub` draws `hub/og.jpg` (1200×630, 68,347 B) from the cover: its paper, Archivo, the marker hand, the seal and the drawing (scripts/build-og.mjs › header).
- **Gates**, in its one palette: the audit at 1280 and 390 (`hub`, `hub m`); vbugs at 1440, 1024, 768 and 390; the sweep on desktop and at 390; `npm run keys` runs `rig` (Tab goes Yasser, Kūro, then each act with a ring; Enter and Space on Yasser say a line; Kūro reacts; Smirk and Release toggle `aria-pressed`) and `hits` (every link and button on top at its own centre) (scripts/audit.mjs; scripts/vbugs.mjs › combos; scripts/sweep.mjs › RUNS; scripts/keys.mjs › SPEC, rig).
- `hub/art/` holds the founder's own drawings; he has not chosen a licence for them (`ip.licence` null), so `NOTICE.md` says the CC0 `LICENSE` does not settle their terms (NOTICE.md › The owner's illustrations; OWNER-CONTENT.md › 1).

What left with the rebuild of 2026-11-05: the Behance covers grid (check 5 now asks that each sheet's identity link be a Behance gallery and that the hub link the Behance profile), the studio diary and its `<dialog>` viewer, `hub/loops/`, the hero's three layers and their parallax, the WorkspaceHQ cartridge, the night palette with its theme pill and `void-theme`, and Syne on this page (BRAND.md › hub/, Removed with the character bible). The design's internal art-prompt section and the cover's production label are not published (commit 56f29c1).

Left behind, not yet cleaned (2026-11-06): `npm run hub:art` (`scripts/build-hub-art.mjs`, `scripts/hub-art-data.mjs`) still exports the old page and check 17b still reads `MOTION_MS` from `hub-art-data.mjs`; README.md and NOTICE.md still describe `hub/loops` and `hub:art`; `assets/fonts-hub.css` still declares Syne, never requested now; the cache stamps were not bumped after the fleet's CSS changes (`npm run bump` before the release push).

History: from 2026-10-28 to 2026-11-05 the hub was built on another set of the owner's illustrations, with a hero of three registered layers, What I make, the 12 Behance covers, an eight-print diary in a native viewer, Elsewhere and three finite loops, on paper `#fcecdc` or night `#0f1420`; its description is kept in BRAND.md › hub/, History (removed features): the hub of 2026-10-28, and in this map's git history.

Graph: [[br4vetr4veler hub (b4vetrave1er.exe  VOIDSPLUNKER.std)]], [[hubapp.js]], [[The Archive one handle, every world (link hub)]]. The generated graph of 2026-10-19 predates both rebuilds: its "Hub poster viewer" and "Light/dark theme pill (void-theme key)" nodes describe pages that are gone; refresh it with `/graphify . --update` and `npm run kb` (knowledge-base/Home.md). graphify was not installed on the fleet's machine, so this map was updated by hand.

## workspacehq/ — the WorkspaceHQ v3 launch page

### The product, as the page describes it

- WorkspaceHQ v3 scans every repo on your machine, turns git hygiene into quests and puts one clear next move on top; it is a Claude-powered desktop console built on Electron, with a pixel sidekick called Bit (workspacehq/index.html › 01 HERO, 06 MEET BIT).
- Scans run on your machine; when you ask Claude something, only the question and the repo context it needs are sent (workspacehq/index.html › 9 FAQ).
- The code is public on GitHub at `Brvetr4ve1er/workspace-HQ`, and the install step is `git clone` (workspacehq/index.html › 10 INSTALL).
- The design said `brew install workspacehq` and `npm i -g workspacehq`, but neither package exists, so the page points at GitHub until they are published (BRAND.md › workspacehq/ — the WorkspaceHQ v3 launch page).

### Page sections

| # | Anchor | Section |
|---|---|---|
| 01 | — | Hero: breadcrumb Numidea Labs › WORKSPACEHQ (the handle out since 2026-11-06), the clone command, a sample scan card |
| 02 | `#reel` | Launch trailer, `embed/trailer.html` |
| 03 | `#features` | "Eight ways to win": HQ Scan, Since last visit, Next move, Secret guard, Commit diffs, Ask Claude, Living map, Bit |
| 04 | `#walkthrough` | Utility walkthrough with chapters, `embed/walkthrough.html` |
| 05 | `#demo` | The real v3 console on sample repos, `embed/console.html`, loaded only when the visitor presses "Boot the console" |
| 06 | `#bit` | Meet Bit: click to feed XP, moods, level, achievements |
| 07 | `#v3` | Changelog v3.0 |
| 08 | `#faq` | Five questions |
| 09 | `#install` | Clone command and "Open on GitHub" |

Source: workspacehq/index.html › 01 HERO to 09 INSTALL; the demo's lazy boot (workspacehq/app.js › live demo). The footer reads "WORKSPACEHQ · v3.0 · OCTOBER 2026" and links to the hub ("BY br4vetr4veler") and to Numidea Labs (workspacehq/index.html › footer).

### How it is built

- The page is native HTML, CSS and JS with no React, implemented from the Claude Design file "WorkspaceHQ v3 Launch Site.dc.html": the imported components (Button, Tag, ProgressBar, Kpi, Achievement, SectionHeading) are rebuilt in CSS with the bundle's exact values, and the design's DCLogic class is ported to plain JS (BRAND.md › workspacehq/; workspacehq/app.js › 1).
- Tokens are the design system's ARCADE theme verbatim, except `--muted` and `--faint`, which the page sets as text: `--faint` was lifted from `#5e588a` (about 3:1) to `#8a83bd`, and on 2026-11-06 both again, to `#b9b3e0` and `#9d97cf` (10.2:1 and 7.4:1 on `--bg`), with the pixel face never under 12px (`--fs-px-min`; the design set it at 6.5 to 9px) (workspacehq/style.css › header, 1; commit 0b01ae5).
- The design pass of 2026-11-06 (commits 0b01ae5, 7a5b3b2): 44px targets, no sideways scroll at 390 and 1440 (the aurora clipped), the hero as two columns, the clone command and the terminals' labels wrapping instead of ellipsised, CSS title cards over the players, feature cards on a subgrid; the motion switch keeps its MOTION ON/OFF label at every width, and the nav's GET THE CODE is hidden under 561px (the hero terminal and the install section carry the link). The embeds' own controls stay at their export's size (36px): `workspacehq/embed/*` was not touched, and no gate looks inside an iframe (BRAND.md › The design pass of 2026-11-06).
- The three embedded experiences stay the design's own React pages on the Claude Design runtime (`embed/support.js`); React 18.3.1 UMD is self-hosted in `embed/vendor/` and loaded before `support.js`, the `.jsx` sources were precompiled with esbuild, and IBM Plex Mono is self-hosted, so the page makes zero third-party requests (BRAND.md › workspacehq/; workspacehq/embed/trailer.html › 14). React's MIT header refers to a licence file that is not in the repository, and `support.js` states no licence and names a source that is not here; `NOTICE.md` says so (NOTICE.md › React, support.js; IMPROVEMENTS.md › F22, A13).
- The export shipped byte-identical copies of the two pixel fonts and an OFL under its design-system tokens, and its `readme.md` and `_ds_manifest.json` reached the published set through a case-sensitive skip list; since 2026-10-31 the tokens' `fonts.css` serves `workspacehq/fonts/`, the copies are deleted, and `isDeploySkipped()` in `scripts/site.mjs` skips both files without regard to case (IMPROVEMENTS.md › C9; scripts/site.mjs › isDeploySkipped).
- `npm run validate` reads the three templates on `scripts/validate-embed.json`, which relaxes only what the runtime's `{{ }}` bindings are; the export's own accessibility gaps, three icon buttons named by `title=` alone and four landmarks without a unique name in `console.html`, print as warnings on every run (scripts/validate.mjs › header; IMPROVEMENTS.md › F27). Booting the console logs the runtime's `{{ }}` SVG attribute bindings as errors before binding, as before (BRAND.md › workspacehq/, Audit pass after launch).
- Check 17 holds the folder to ceilings set on 2026-10-31 from its largest files plus 10 %: `workspacehq` 64 kB, `embed` 299 kB, `embed/vendor` 146 kB, `embed/assets` 1,477 kB, `embed/assets/audio` 1,645 kB (scripts/check.mjs › block 17, BUDGET).
- To update an embed from a new design export, repeat those steps, keep the rule in `console.html` that sets fields at 16px on a coarse pointer (so iOS does not zoom), then run `npm run csp` (or `npm run build`): an export comes without its Content-Security-Policy meta, and this writes it and hashes any inline script; then `npm run check` and open the embed through `workspacehq/` (BRAND.md › workspacehq/; BRAND.md › Content-Security-Policy, Re-exporting an embed).
- The embeds alone carry a looser policy than the other pages: `'unsafe-eval'` (`support.js` runs component code with `new Function`), `font-src data:` (the stage inlines its `@font-face` files) and `img-src blob:` (the runtime's bundled-resource mode); check block 16 refuses `'unsafe-eval'` on any other page (BRAND.md › Content-Security-Policy, The embed exception; scripts/lib/csp.mjs › cspPolicy; scripts/check.mjs › block 16).
- Loops (the glitching headline, the marquee, Bit floating) are part of the product's identity, so the browser audit runs this page with `allowLoops`; since 2026-11-06 only the REC dot blinks (INSERT COIN and the other text labels stay still) and the marquee takes 60 s (BRAND.md › workspacehq/; workspacehq/style.css › the blink, marquee; scripts/audit.mjs › the comment above the `workspacehq` run).
- A "pause motion" button stops every loop on the page and inside the players (WCAG 2.2.2); `prefers-reduced-motion` starts it pressed, and a choice that differs from that default is stored under `whq-motion` (workspacehq/app.js › motion). Loops also pause when their section is off screen (workspacehq/app.js › reveal + pause).
- In the booted console, motion off (either way) also stops Bit walking on his own: he switches between idle and look, and only a drag moves him (workspacehq/embed/hq-fx.js › tick). `npm run keys` boots the console with reduced motion, and again with PAUSE MOTION pressed, and fails if Bit moves within 8 s (scripts/keys.mjs › bitHolds).
- The embeds are listed as extra pages that `check.mjs` reads for references but that are not entry pages (scripts/site.mjs › EXTRA_PAGES).

Graph: [[WorkspaceHQ v3 launch site]], [[WorkspaceHQ v3 (personal ops console)]], [[WorkspaceHQ v3 Launch Site.dc.html (Claude Design file)]], [[Claude Design runtime (embedsupport.js)]], [[Rebuilt design-system components (Button, Tag, ProgressBar, Kpi, Achievement, SectionHeading)]], [[--faint token contrast fix]], [[Bit (pixel sidekick)]], [[Pause-motion control (WCAG 2.2.2)]], [[setMotion()]], [[Live in-browser demo console (sample repos)]], [[GitHub repo Brvetr4ve1erworkspace-HQ]].

Communities and wiki: [[_COMMUNITY_WorkspaceHQ Product]], [[_COMMUNITY_WorkspaceHQ Page Script]], [[WorkspaceHQ_v3_launch_site]], [[WorkspaceHQ_v3_personal_ops_console]], [[WorkspaceHQ_Product]], [[WorkspaceHQ_Page_Script]].

## The cartridge (removed)

- Until 2026-11-05 WorkspaceHQ, the founder's favourite build, was linked as a small NES cartridge with Bit on the label in the hub hero, and as a link in the hub's Developer links and Elsewhere; it went with the old hub, and the character bible links WorkspaceHQ from one Elsewhere row (BRAND.md › workspacehq/, The cartridge; hub/index.html › 08 · ELSEWHERE). `build-og.mjs` keeps the cartridge's Bit sprite for WorkspaceHQ's share card (scripts/build-og.mjs › Bit).
- The Numidea footer carried a second cartridge until 2026-10-26, an owner decision: it made every visitor of the home page download Press Start 2P (12,512 B) for an English-only developer tool. Its keys `whq.kick` and `whq.sub` and its CSS left `assets/app.js` and `assets/styles.css` with it (BRAND.md › workspacehq/, The cartridge).

Graph: [[WorkspaceHQ NES cartridge link]] (history).

## Open items

- **WorkspaceHQ "open source":** the repository had no licence and no README on 2026-10-13, so the pages now say the code is public on GitHub; to say "open source" again, add a LICENSE and a root README there, then restore the wording in `workspacehq/index.html` and `scripts/scene-data.mjs` (OWNER-CONTENT.md › 13). Graph: [[WorkspaceHQ open-source claim]].
- **Hub illustrations, review points:** the fan art left the hub with its rebuild of 2026-10-28 and stays in git history (OWNER-CONTENT.md › 10); the owner approved the eight diary titles on 2026-10-28 (IMPROVEMENTS.md › decision 26), and the review points of OWNER-CONTENT.md › 15 (what the page says of Kūro, the hexagon "N", the glyph-like symbols on one print) were written for the 2026-10-28 art: the diary and that print left the page with the character bible on 2026-11-05, so which points still apply to the new drawings is the owner's to say.
- **"An agency of one":** the hub footer says VOIDSPLUNKER.std is an agency of one while the home page, since 2026-11-02, presents one founder with freelancers when needed; the owner chose on 2026-10-28 to keep the line on the hub and answered on 2026-10-30 on the studio (OWNER-CONTENT.md › 14, 17; IMPROVEMENTS.md › decision 22; hub/index.html › FOOTER). Graph: [[VOIDSPLUNKER.std (agency of one)]].
- **The hub's wording** was settled on 2026-11-02: one handle spelling (br4vetr4veler) in the title and card, the person's name in the title, WorkspaceHQ without a timing claim for the scan and "GET THE CODE" (the clone is a bare repository) (commit 7bb84bb).

See [[Open owner items]].

## Related

- Maps: [[Site architecture]], [[Project sheets]], [[Studio and offer]], [[Open owner items]], [[Themes and tokens]].
- Communities: [[_COMMUNITY_Audit Findings (Daylight, Hub)]].
