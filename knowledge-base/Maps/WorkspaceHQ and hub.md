---
type: map
updated: 2026-10-19
sources: [README.md, BRAND.md, OWNER-CONTENT.md, index.html, assets/app.js, assets/carry.js, assets/styles.css, hub/index.html, hub/app.js, hub/poses/README.md, workspacehq/index.html, workspacehq/app.js, workspacehq/style.css, workspacehq/embed/trailer.html, scripts/site.mjs, scripts/scene-data.mjs, scripts/build-sitemap.mjs, scripts/check.mjs, scripts/audit.mjs]
---

# WorkspaceHQ and hub

Two published pages sit beside the studio's landing page with their own CSS and JavaScript: `hub/`, VOIDSPLUNKER.std, the founder's personal page, and `workspacehq/`, the launch page of WorkspaceHQ v3, the studio's own product (README.md › This repository — the landing page). Both are in English and both are in the deploy set (hub/index.html › 2; workspacehq/index.html › 2; scripts/site.mjs › DEPLOY); a small game-cartridge link in the hub and in the home footer leads to WorkspaceHQ (BRAND.md › workspacehq/, The cartridge). Start with the comparison table, then read the section for the page you are changing; the WorkspaceHQ project sheet is covered in [[Project sheets]].

## At a glance

| | `hub/` | `workspacehq/` |
|---|---|---|
| What it is | Yasser's own page: his art, design work and social presence (BRAND.md › hub/ — the artist's page, not the studio's) | Launch page for WorkspaceHQ v3, "your codebase, now playable" (workspacehq/index.html › 6) |
| Title | `b4vetrave1er.exe // VOIDSPLUNKER.std` (hub/index.html › 6) | `WorkspaceHQ v3 — your codebase, now playable` (workspacehq/index.html › 6) |
| Language | English (hub/index.html › 2) | English (workspacehq/index.html › 2) |
| Themes | Its own dark and light, stored under `void-theme`; anything else reads as dark (hub/index.html › 25) | One look: the WorkspaceHQ design system's ARCADE tokens (workspacehq/style.css › 1) |
| Fonts | Syne and Space Mono, self-hosted through `assets/fonts-hub.css` (hub/index.html › 30) | Press Start 2P and VT323, self-hosted in `workspacehq/fonts/` (workspacehq/style.css › 11) |
| Scripts | `hub/app.js`, `assets/carry.js` (hub/index.html › 490) | `workspacehq/app.js`, `assets/carry.js` (workspacehq/index.html › 332) |
| Reached from | The home page's founder section, "Portfolio personnel ↗" (index.html › 1048); the WorkspaceHQ footer (workspacehq/index.html › 326) | The cartridge in the home footer and in the hub (index.html › 1265; hub/index.html › 72, 423); project sheet 04 (scripts/scene-data.mjs › PROJECTS) |
| Sitemap | One URL, no language alternates (scripts/build-sitemap.mjs › MULTILINGUAL) | One URL, no language alternates (scripts/build-sitemap.mjs › MULTILINGUAL) |

Both pages load `assets/carry.js`, so a link back to the home page keeps any `ref`, `utm_*`, `fbclid`, `gclid` or `lang` parameter the visitor arrived with (assets/carry.js › 1).

## hub/ — the artist's page

**Rule:** client websites do not belong here; a "Selected Work" section was added once and removed at the owner's request, and `npm run check` fails if the host of any project site linked from the home page appears in `hub/` (BRAND.md › hub/ — the artist's page, not the studio's; scripts/check.mjs › header, 5).

| Section | Anchor | What it holds |
|---|---|---|
| Hero | `#hero` | Name, "ARTIST · DESIGNER · DEVELOPER", the WorkspaceHQ cartridge, and the avatar whose four Traveler portraits step from calm to scream as you scroll (hub/index.html › HERO; BRAND.md › hub/) |
| The Series | `#collection` | BR4VETR4VELER, "a story in 33 posters": Prologue *The Traveler*, I *The Sky*, II *The Noise*, III *The Ink*, Epilogue *The Power of Imagination* (hub/index.html › THE SERIES; BRAND.md › hub/) |
| Viewer | `#lb` | A native `<dialog>`; Close comes first so the external DeviantArt link is not focused on open (hub/index.html › 303) |
| Design | `#design` | Twelve Behance projects from the profile's first page, covers self-hosted (BRAND.md › hub/; hub/index.html › DESIGN) |
| Social highlights | `#social` | Behance and DeviantArt figures as the public profiles showed them in October 2026, updated by hand and never fetched; Instagram shows no number (hub/index.html › SOCIAL HIGHLIGHTS) |
| The Archive | `#links` | Links grouped as Design, Dev, Social, Shop & contact; handles with no verified URL sit on one "coming soon" line (hub/index.html › LINKS) |
| Footer | `#foot` | Bio, social shortcuts, the theme pill (hub/index.html › FOOTER) |

How it is built:

- Every gallery grid uses square units (row height equals column width), so a tile spanning C×R has the shape C:R; tile order is chosen so dense auto-placement leaves no holes at 6 and at 4 columns, and a change to a chapter's count needs the hole check rerun (BRAND.md › hub/; hub/index.html › THE SERIES).
- Poster titles are HTML labels, never baked into the image, because AI lettering garbles (BRAND.md › hub/).
- Without scripts, every poster is a plain link to DeviantArt; the viewer only intercepts a plain click (hub/app.js › 8 · the collection).
- Pose frames go in `hub/poses/` as `pose-0.webp` to `pose-3.webp` at 5:6; the drawn placeholder hides itself once a `.pose` exists, and the scroll-driven pose count adapts to the number of frames (hub/poses/README.md).
- `hub/app.js` sections: 3 parallax, 3b staggered reveal, 5 avatar pose system, 6 theme toggle, 7 scroll-driven pose shift, 8 year, 8 collection filter and viewer, 9 images fade in (hub/app.js › 3–9).
- Sections 1 (identity cycler), 2 (philosophy line) and 4 (reticle cursor) look for `#cyText`, `#philo` and `#reticle`, which `hub/index.html` does not contain, so they never run (hub/app.js › 1, 2, 4); BRAND.md lists the cycling handle, the philosophy line and the custom cursor as removed (BRAND.md › hub/). One static philosophy line, "form is a function of obsession.", is still in the hero markup; only its rotation is gone (hub/index.html › HERO).

Graph: [[br4vetr4veler hub (b4vetrave1er.exe  VOIDSPLUNKER.std)]], [[hubapp.js]], [[BR4VETR4VELER poster series (a story in 33 posters)]], [[Bento grid on square units]], [[Hub poster viewer (native dialog)]], [[Scroll-driven pose index]], [[Traveler portrait pose frames (pose-0 to pose-3)]], [[Lightdark theme pill (void-theme key)]], [[Social Highlights section (seen, saved, shared)]], [[The Archive one handle, every world (link hub)]].

Communities and wiki: [[_COMMUNITY_Hub Page Script]], [[_COMMUNITY_Founder Poster Series]], [[_COMMUNITY_Founder Design Portfolio]], [[_COMMUNITY_Founder Social Handles]], [[Hub_Page_Script]], [[Founder_Poster_Series]], [[Founder_Design_Portfolio]], [[Founder_Social_Handles]].

## workspacehq/ — the WorkspaceHQ v3 launch page

### The product, as the page describes it

- WorkspaceHQ v3 scans every repo on your machine, turns git hygiene into quests and puts one clear next move on top; it is a Claude-powered desktop console built on Electron, with a pixel sidekick called Bit (workspacehq/index.html › 7).
- Scans run on your machine; when you ask Claude something, only the question and the repo context it needs are sent (workspacehq/index.html › 08 FAQ).
- The code is public on GitHub at `Brvetr4ve1er/workspace-HQ`, and the install step is `git clone` (workspacehq/index.html › 09 INSTALL).
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

Source: workspacehq/index.html › 01 HERO to 09 INSTALL; the demo's lazy boot (workspacehq/app.js › live demo). The footer reads "WORKSPACEHQ · v3.0 · OCTOBER 2026" and links to the hub and to Numidea Labs (workspacehq/index.html › 326).

### How it is built

- The page is native HTML, CSS and JS with no React, implemented from the Claude Design file "WorkspaceHQ v3 Launch Site.dc.html": the imported components (Button, Tag, ProgressBar, Kpi, Achievement, SectionHeading) are rebuilt in CSS with the bundle's exact values, and the design's DCLogic class is ported to plain JS (BRAND.md › workspacehq/; workspacehq/app.js › 1).
- Tokens are the design system's ARCADE theme verbatim, except `--faint`, lifted from `#5e588a` (about 3:1) to `#8a83bd` because the page sets it as text (workspacehq/style.css › 1; BRAND.md › workspacehq/).
- The three embedded experiences stay the design's own React pages on the Claude Design runtime (`embed/support.js`); React 18.3.1 UMD is self-hosted in `embed/vendor/` and loaded before `support.js`, the `.jsx` sources were precompiled with esbuild, and IBM Plex Mono is self-hosted, so the page makes zero third-party requests (BRAND.md › workspacehq/; workspacehq/embed/trailer.html › 13).
- To update an embed from a new design export, repeat those steps and keep the rule in `console.html` that sets fields at 16px on a coarse pointer, so iOS does not zoom (BRAND.md › workspacehq/).
- Loops (INSERT COIN blinking, the glitching headline, the marquee, Bit floating) are part of the product's identity, so the browser audit runs this page with `allowLoops` (BRAND.md › workspacehq/; scripts/audit.mjs › 96).
- A "pause motion" button stops every loop on the page and inside the players (WCAG 2.2.2); `prefers-reduced-motion` starts it pressed, and a choice that differs from that default is stored under `whq-motion` (workspacehq/app.js › motion). Loops also pause when their section is off screen (workspacehq/app.js › reveal + pause).
- The embeds are listed as extra pages that `check.mjs` reads for references but that are not entry pages (scripts/site.mjs › EXTRA_PAGES).

Graph: [[WorkspaceHQ v3 launch site]], [[WorkspaceHQ v3 (personal ops console)]], [[WorkspaceHQ v3 Launch Site.dc.html (Claude Design file)]], [[Claude Design runtime (embedsupport.js)]], [[Rebuilt design-system components (Button, Tag, ProgressBar, Kpi, Achievement, SectionHeading)]], [[--faint token contrast fix]], [[Bit (pixel sidekick)]], [[Pause-motion control (WCAG 2.2.2)]], [[setMotion()]], [[Live in-browser demo console (sample repos)]], [[GitHub repo Brvetr4ve1erworkspace-HQ]].

Communities and wiki: [[_COMMUNITY_WorkspaceHQ Product]], [[_COMMUNITY_WorkspaceHQ Page Script]], [[WorkspaceHQ_v3_launch_site]], [[WorkspaceHQ_v3_personal_ops_console]], [[WorkspaceHQ_Product]], [[WorkspaceHQ_Page_Script]].

## The cartridge

- WorkspaceHQ is the founder's favourite build, so it is linked as a small NES cartridge with Bit on the label: in the hub hero, in the hub's Dev links and in the Numidea footer (BRAND.md › workspacehq/, The cartridge).
- On the home page its text is translated through the keys `whq.kick` and `whq.sub` (assets/app.js › i18n dictionary).
- It wears WorkspaceHQ's palette in every theme and moves only on hover or focus, so the host pages keep their no-endless-animation rule; the cut corner is drawn with `::after` in `--whq-page` rather than `clip-path` (BRAND.md › workspacehq/; assets/styles.css › 2383).

Graph: [[WorkspaceHQ NES cartridge link]].

## Open items

- **WorkspaceHQ "open source":** the repository had no licence and no README on 2026-10-13, so the pages now say the code is public on GitHub; to say "open source" again, add a LICENSE and a root README there, then restore the wording in `workspacehq/index.html` and `scripts/scene-data.mjs` (OWNER-CONTENT.md › 13). Graph: [[WorkspaceHQ open-source claim]].
- **Hub fan art:** the hub shows fan art, and the rights to show it are an open question for the owner (OWNER-CONTENT.md › 10). Graph: [[Hub fan art rights]].
- **"An agency of one":** the hub footer says VOIDSPLUNKER.std is an agency of one while the home page presents a studio of four specialists; the owner has to confirm which is true (OWNER-CONTENT.md › 14; hub/index.html › FOOTER). Graph: [[VOIDSPLUNKER.std (agency of one)]].

See [[Open owner items]].

## Related

- Maps: [[Site architecture]], [[Project sheets]], [[Studio and offer]], [[Open owner items]], [[Themes and tokens]].
- Communities: [[_COMMUNITY_Audit Findings (Daylight, Hub)]].
