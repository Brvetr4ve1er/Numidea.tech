---
type: map
updated: 2026-10-28
sources: [README.md, BRAND.md, OWNER-CONTENT.md, index.html, assets/app.js, assets/carry.js, assets/styles.css, hub/index.html, hub/app.js, hub/style.css, scripts/build-hub-art.mjs, scripts/hub-art-data.mjs, workspacehq/index.html, workspacehq/app.js, workspacehq/style.css, workspacehq/embed/trailer.html, scripts/site.mjs, scripts/scene-data.mjs, scripts/build-sitemap.mjs, scripts/check.mjs, scripts/audit.mjs, scripts/keys.mjs, scripts/lib/csp.mjs, workspacehq/embed/hq-fx.js]
---

# WorkspaceHQ and hub

Two published pages sit beside the studio's landing page with their own CSS and JavaScript: `hub/`, VOIDSPLUNKER.std, the founder's personal page, and `workspacehq/`, the launch page of WorkspaceHQ v3, the studio's own product (README.md › This repository — the landing page). Both are in English and both are in the deploy set (hub/index.html › 2; workspacehq/index.html › 2; scripts/site.mjs › DEPLOY); a small game-cartridge link in the hub and in the home footer leads to WorkspaceHQ (BRAND.md › workspacehq/, The cartridge). Start with the comparison table, then read the section for the page you are changing; the WorkspaceHQ project sheet is covered in [[Project sheets]].

## At a glance

| | `hub/` | `workspacehq/` |
|---|---|---|
| What it is | Yasser's own page: his art, design work and social presence (BRAND.md › hub/ — the artist's page, not the studio's) | Launch page for WorkspaceHQ v3, "your codebase, now playable" (workspacehq/index.html › 7) |
| Title | `b4vetrave1er.exe // VOIDSPLUNKER.std` (hub/index.html › 7) | `WorkspaceHQ v3 — your codebase, now playable` (workspacehq/index.html › 7) |
| Language | English (hub/index.html › 2) | English (workspacehq/index.html › 2) |
| Themes | Paper by default and night, stored under `void-theme`; only `dark` reads as night (hub/index.html › head script) | One look: the WorkspaceHQ design system's ARCADE tokens (workspacehq/style.css › 1) |
| Fonts | Syne, Geist and Geist Mono, self-hosted through `assets/fonts-hub.css`; the cartridge's Press Start 2P from `workspacehq/fonts/` (hub/index.html › head) | Press Start 2P and VT323, self-hosted in `workspacehq/fonts/` (workspacehq/style.css › 11) |
| Scripts | `hub/app.js`, `assets/carry.js` (hub/index.html › end of body) | `workspacehq/app.js`, `assets/carry.js` (workspacehq/index.html › 334) |
| Reached from | The home page's founder section, "Portfolio personnel ↗" (index.html › 1071); the WorkspaceHQ footer (workspacehq/index.html › 328) | The cartridge in the hub hero, the hub's Developer links and Elsewhere (hub/index.html › HERO, WHAT I MAKE, ELSEWHERE); project sheet 04 (scripts/scene-data.mjs › PROJECTS). The home footer's cartridge went on 2026-10-26, an owner decision (BRAND.md › workspacehq/, The cartridge) |
| Sitemap | One URL, no language alternates (scripts/build-sitemap.mjs › MULTILINGUAL) | One URL, no language alternates (scripts/build-sitemap.mjs › MULTILINGUAL) |

Both pages load `assets/carry.js`, so a link back to the home page keeps any `ref`, `utm_*`, `fbclid`, `gclid` or `lang` parameter the visitor arrived with (assets/carry.js › 1).

## hub/ — the artist's page

**Rule:** client websites do not belong here; a "Selected Work" section was added once and removed at the owner's request, and `npm run check` fails if the host of any project site linked from the home page appears in `hub/` (BRAND.md › hub/ — the artist's page, not the studio's; scripts/check.mjs › block 5).

Since 2026-10-28 the page is built on the owner's illustrations of himself and his black cat Kūro; the copy is his published wording, and the eight diary titles are drafts for him to approve (BRAND.md › hub/; hub/index.html › STUDIO DIARY).

| Section | Anchor | What it holds |
|---|---|---|
| Hero | `#hero` | Breadcrumb, "Artist · Designer · Developer", the handle br4vetr4veler, the name, "form is a function of obsession.", the WorkspaceHQ cartridge, over a stage of three registered layers: the paper, Kūro, Yasser (hub/index.html › HERO) |
| What I make | `#make` | "Design meets code.": Designer, Developer and Artist, each a cut-out with its links; the skip link's target (hub/index.html › WHAT I MAKE) |
| Design | `#design` | "Identity. Posters. Print.": the 12 Behance projects from the profile's first page, covers self-hosted, titles only (hub/index.html › DESIGN) |
| Studio diary | `#collection` | "Yasser and Kūro, after hours.": eight prints in story order, each opening in the viewer (hub/index.html › STUDIO DIARY) |
| Viewer | `#lb` | A native `<dialog>`; Close comes first; from 1024px its controls sit on the backdrop, off the picture (hub/index.html › the viewer; hub/style.css › the viewer) |
| Elsewhere | `#links` | "One handle. Every world.": Design, Code and Social links, and a loop of Yasser reading a maze map (hub/index.html › ELSEWHERE) |
| Footer | `#foot` | "Say hello" and the one email, the bio ("an agency of one", kept by the owner), the theme pill, two loops (hub/index.html › FOOTER) |

How it is built:

- The first Tab stop is a skip link, "Skip to the work", to `#make`, past the hero; `npm run keys` requires a skip link that points inside `<main>` and skips something, and on hub/ also checks that every link and button is the topmost element at its own centre (hub/index.html › Skip link; scripts/keys.mjs › hits).
- Two grounds sampled from the art, paper `#fcecdc` and night `#0f1420`; a ground travels with its art, so each theme shows the other as inset prints (hub/style.css › header; BRAND.md › hub/).
- The hero's three layers are one 2752×1674 frame with paper added above and below, so the bleed and the parallax only eat paper; one scroll lag for the whole stage, the pointer separates the layers by 2 px at most, and the stage takes no pointer events (hub/index.html › HERO; hub/style.css › HERO; BRAND.md › hub/).
- The images come from the owner's private masters through `npm run hub:art`, which checks each master's size and sha256 and fails on an oversized file or an endless loop; check block 17b holds the page to the files (scripts/build-hub-art.mjs; scripts/hub-art-data.mjs; scripts/check.mjs › block 17b).
- The three loops are animated WebP, finite (at most 5 s of motion each), settle on their poster frame, and stay stills under reduced motion (hub/app.js › 4 · loops; BRAND.md › hub/).
- `hub/app.js` sections: 1 parallax, 2 entrance, 3 reveal, 4 loops, 5 theme pill, 6 year, 7 the diary's viewer, 8 pictures fade in, 9 the motion preference changing mid-visit and printing (hub/app.js › header).

Graph: [[br4vetr4veler hub (b4vetrave1er.exe  VOIDSPLUNKER.std)]], [[hubapp.js]], [[Hub poster viewer (native dialog)]], [[Lightdark theme pill (void-theme key)]], [[The Archive one handle, every world (link hub)]]. The generated graph predates the rebuild of 2026-10-28 (it still holds the poster series); refresh it with `/graphify . --update` and `npm run kb` (knowledge-base/Home.md).

## workspacehq/ — the WorkspaceHQ v3 launch page

### The product, as the page describes it

- WorkspaceHQ v3 scans every repo on your machine, turns git hygiene into quests and puts one clear next move on top; it is a Claude-powered desktop console built on Electron, with a pixel sidekick called Bit (workspacehq/index.html › 01 HERO, 06 MEET BIT).
- Scans run on your machine; when you ask Claude something, only the question and the repo context it needs are sent (workspacehq/index.html › 9 FAQ).
- The code is public on GitHub at `Brvetr4ve1er/workspace-HQ`, and the install step is `git clone` (workspacehq/index.html › 10 INSTALL).
- The design said `brew install workspacehq` and `npm i -g workspacehq`, but neither package exists, so the page points at GitHub until they are published (BRAND.md › workspacehq/ — the WorkspaceHQ v3 launch page).

### Page sections

| # | Anchor | Section |
|---|---|---|
| 01 | — | Hero: breadcrumb NUMIDEA LABS › BR4VETR4VELER › WORKSPACEHQ, the clone command, a sample scan card |
| 02 | `#reel` | Launch trailer, `embed/trailer.html` |
| 03 | `#features` | "Eight ways to win": HQ Scan, Since last visit, Next move, Secret guard, Commit diffs, Ask Claude, Living map, Bit |
| 04 | `#walkthrough` | Utility walkthrough with chapters, `embed/walkthrough.html` |
| 05 | `#demo` | The real v3 console on sample repos, `embed/console.html`, loaded only when the visitor presses "Boot the console" |
| 06 | `#bit` | Meet Bit: click to feed XP, moods, level, achievements |
| 07 | `#v3` | Changelog v3.0 |
| 08 | `#faq` | Five questions |
| 09 | `#install` | Clone command and "Open on GitHub" |

Source: workspacehq/index.html › 01 HERO to 09 INSTALL; the demo's lazy boot (workspacehq/app.js › live demo). The footer reads "WORKSPACEHQ · v3.0 · OCTOBER 2026" and links to the hub and to Numidea Labs (workspacehq/index.html › 328).

### How it is built

- The page is native HTML, CSS and JS with no React, implemented from the Claude Design file "WorkspaceHQ v3 Launch Site.dc.html": the imported components (Button, Tag, ProgressBar, Kpi, Achievement, SectionHeading) are rebuilt in CSS with the bundle's exact values, and the design's DCLogic class is ported to plain JS (BRAND.md › workspacehq/; workspacehq/app.js › 1).
- Tokens are the design system's ARCADE theme verbatim, except `--faint`, lifted from `#5e588a` (about 3:1) to `#8a83bd` because the page sets it as text (workspacehq/style.css › 1; BRAND.md › workspacehq/).
- The three embedded experiences stay the design's own React pages on the Claude Design runtime (`embed/support.js`); React 18.3.1 UMD is self-hosted in `embed/vendor/` and loaded before `support.js`, the `.jsx` sources were precompiled with esbuild, and IBM Plex Mono is self-hosted, so the page makes zero third-party requests (BRAND.md › workspacehq/; workspacehq/embed/trailer.html › 14).
- To update an embed from a new design export, repeat those steps, keep the rule in `console.html` that sets fields at 16px on a coarse pointer (so iOS does not zoom), then run `npm run csp` (or `npm run build`): an export comes without its Content-Security-Policy meta, and this writes it and hashes any inline script; then `npm run check` and open the embed through `workspacehq/` (BRAND.md › workspacehq/; BRAND.md › Content-Security-Policy, Re-exporting an embed).
- The embeds alone carry a looser policy than the other pages: `'unsafe-eval'` (`support.js` runs component code with `new Function`), `font-src data:` (the stage inlines its `@font-face` files) and `img-src blob:` (the runtime's bundled-resource mode); check block 16 refuses `'unsafe-eval'` on any other page (BRAND.md › Content-Security-Policy, The embed exception; scripts/lib/csp.mjs › cspPolicy; scripts/check.mjs › block 16).
- Loops (INSERT COIN blinking, the glitching headline, the marquee, Bit floating) are part of the product's identity, so the browser audit runs this page with `allowLoops` (BRAND.md › workspacehq/; scripts/audit.mjs › the comment above the `workspacehq` run).
- A "pause motion" button stops every loop on the page and inside the players (WCAG 2.2.2); `prefers-reduced-motion` starts it pressed, and a choice that differs from that default is stored under `whq-motion` (workspacehq/app.js › motion). Loops also pause when their section is off screen (workspacehq/app.js › reveal + pause).
- In the booted console, motion off (either way) also stops Bit walking on his own: he switches between idle and look, and only a drag moves him (workspacehq/embed/hq-fx.js › tick). `npm run keys` boots the console with reduced motion, and again with PAUSE MOTION pressed, and fails if Bit moves within 8 s (scripts/keys.mjs › bitHolds).
- The embeds are listed as extra pages that `check.mjs` reads for references but that are not entry pages (scripts/site.mjs › EXTRA_PAGES).

Graph: [[WorkspaceHQ v3 launch site]], [[WorkspaceHQ v3 (personal ops console)]], [[WorkspaceHQ v3 Launch Site.dc.html (Claude Design file)]], [[Claude Design runtime (embedsupport.js)]], [[Rebuilt design-system components (Button, Tag, ProgressBar, Kpi, Achievement, SectionHeading)]], [[--faint token contrast fix]], [[Bit (pixel sidekick)]], [[Pause-motion control (WCAG 2.2.2)]], [[setMotion()]], [[Live in-browser demo console (sample repos)]], [[GitHub repo Brvetr4ve1erworkspace-HQ]].

Communities and wiki: [[_COMMUNITY_WorkspaceHQ Product]], [[_COMMUNITY_WorkspaceHQ Page Script]], [[WorkspaceHQ_v3_launch_site]], [[WorkspaceHQ_v3_personal_ops_console]], [[WorkspaceHQ_Product]], [[WorkspaceHQ_Page_Script]].

## The cartridge

- WorkspaceHQ is the founder's favourite build, so it is linked as a small NES cartridge with Bit on the label in the hub hero, and as a link in the hub's Developer links and Elsewhere (BRAND.md › workspacehq/, The cartridge; hub/index.html).
- The Numidea footer carried a second cartridge until 2026-10-26, an owner decision: it made every visitor of the home page download Press Start 2P (12,512 B) for an English-only developer tool. Its keys `whq.kick` and `whq.sub` and its CSS left `assets/app.js` and `assets/styles.css` with it (BRAND.md › workspacehq/, The cartridge).
- It wears WorkspaceHQ's palette in every theme and moves only on hover or focus, so the hub keeps its no-endless-animation rule; the cut corner is drawn with `::after` in `--whq-page` rather than `clip-path` (BRAND.md › workspacehq/; hub/style.css › WorkspaceHQ cartridge).

Graph: [[WorkspaceHQ NES cartridge link]].

## Open items

- **WorkspaceHQ "open source":** the repository had no licence and no README on 2026-10-13, so the pages now say the code is public on GitHub; to say "open source" again, add a LICENSE and a root README there, then restore the wording in `workspacehq/index.html` and `scripts/scene-data.mjs` (OWNER-CONTENT.md › 13). Graph: [[WorkspaceHQ open-source claim]].
- **Hub illustrations, four review points:** the fan art left the hub with its rebuild of 2026-10-28; the owner reviews the eight diary titles (drafts), what the page says about Kūro, the hexagon "N" as a costume detail, and the glyph-like symbols on one print (OWNER-CONTENT.md › 10).
- **"An agency of one":** the hub footer says VOIDSPLUNKER.std is an agency of one while the home page presents a studio of four specialists; the owner chose on 2026-10-28 to keep the line on the hub, and the home page's team wording is the open half (OWNER-CONTENT.md › 14; IMPROVEMENTS.md › decision 22; hub/index.html › FOOTER). Graph: [[VOIDSPLUNKER.std (agency of one)]].

See [[Open owner items]].

## Related

- Maps: [[Site architecture]], [[Project sheets]], [[Studio and offer]], [[Open owner items]], [[Themes and tokens]].
- Communities: [[_COMMUNITY_Audit Findings (Daylight, Hub)]].
