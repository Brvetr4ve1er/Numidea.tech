# 03 · Characters, mascot, Talk board, intro/nav Menu (ACTIVE at snapshot; menu packaged 23:49 UTC)

Thread: "Improve artworks, characters and mascot animations".
Its own, newer notes: `/mnt/project-files/characters/STATE.md`. **Read that first; it wins over this file.**

## A. Code: PR #20 (`claude/project-thread-vm2rxf` @ 17b86e3). **MERGED into the trunk 2026-11-26 00:14 UTC [V]** (merge ccb6e80, gate fixes a827417). Not live yet.
- **C1 continuity:** skin recolor on workbench/diorama + Studio "make" trio; Kūro canon black (`scripts/kuro-canon.mjs`); orphan art deleted; Librairie traveller back to canon; model sheet in BRAND.md.
- **C2 bible §02:** drawn 5-view turnaround (hard cuts, drag) + Kūro at scale; sil-0/2/3 deleted.
- **C3 bible §00 "Talk to Yasser":** `api/yasser.js` Vercel function on Haiku, returns JSON `{line, emotion, act, kuro}`, cached system prompt; written choice chips cost nothing. `api/` is in NOT_DEPLOYED for static staging.
- **Before publish:** merge the trunk in (base 702b008 is ~24 behind, mergeable state dirty) and rerun verify. Its last verify only failed on WorkspaceHQ issues, which PR 23 has since fixed.
- **Owner setup for C3:** `ANTHROPIC_API_KEY` in Vercel env + a Console spend limit. Without it the box shows an offline line. Never handle the key.
- **Easy follow-up:** swap the cleaned frames from `characters/bible-clean/` into the site (the shipped ones have white paper halos visible on dark backgrounds).
- **Enum gap:** acts `ride`, `deploy`, `oops` exist only on the canvas. If ported, add them to the `act` enum in `api/yasser.js`.
- Remaining off-model on the site: bible `sil-*` pixel row and animated `yasser-lost` (lighter skin).

## B. Claude Design canvas: https://claude.ai/artifact/8dwp6X1pUjckGmv6LUWybA (prototypes, not site code)
| Board | Source | State |
|---|---|---|
| Main: paper rig | `canvas-src/Main.dc.html` | three.js turntable of paper cut-outs, done |
| Talk to him (`#artboard-Talk`) | `canvas-src/Talk.dc.html` | v4: slam, ink/red echo twin, prop burst + callout card, blink and lip flap, Kūro card in the dialogue box, 18 acts incl. `oops` |
| Intro and navigation menu (`#artboard-Menu`) | `canvas-src/Menu.dc.html` | v3 (canvas version 12). Owner approved the v2 look on 2026-11-26 ("I like it more like this now"). v3 adds motion tokens, press and exit. **Site-ready package: `characters/site-menu/`** |

Menu v2 content [R]: 5-beat intro at 90 BPM (typed line, red slab, Yasser slams with echo + shake, shards + burst, name stamp, cards fan out). Six cards → Travaux `/scene/`, Tarifs `/tarifs/`, L'Atelier `/hub/`, La Lanterne `/hub/lanterne/`, La Bible `/hub/bible/`, Contact (WhatsApp). Hover, arrows or keys 1–6; click plays a red wipe. HUD: mood grid, Yasser's banner line, Kūro with tarot card. Background: the owner's React "constellation grid" snippet ported to plain canvas in Numidea colours, neighbour-only links, stops under reduced motion.

Owner feedback trail: v1 "don't like the way the cards are laid out", "missing the other 50% of the style, check the references". v2: liked (see quote above). Open: whether the mesh should be more visible (the collage mostly covers it).

## C. Site-ready menu package: `/mnt/project-files/characters/site-menu/` (not integrated)
- Files: `index.html` (standalone preview), `menu.html` (markup to paste), `menu.css` (scoped `.nl-menu`, motion tokens on top, ~5.5 KB gz), `menu.js` (no deps, ~3.7 KB gz), `img/` (20 WebPs, ~350 KB, full body 96 KB with fetchpriority=high), `fonts/` (Archivo 900 26 KB; Noto Sans JP 900 subset 2.4 KB for the ヌミデア watermark), `qa/`.
- **Integration steps are in its README.** Copy the assets, fix the relative paths, paste the markup, load the CSS in `<head>` and the JS with `defer`, resolve the `<h1>`, then run `npm run verify`.
- Motion: 90 BPM clock. Tokens `--e8` 83 ms, `--d2` 167, `--d3` 250, `--d4` 333, `--d5` 420, `--beat` 667, `--bar` 2667. Easings are in the README.
- Behaviour [R, Chromium only]: the intro plays once per tab session (sessionStorage). It can be skipped with the button, Esc, Space or Enter, and "Rejouer l'intro" replays it. Keys 1–6 and the arrows move the selection. A click plays the wipe, then navigates. Contact (WhatsApp) opens normally. Ctrl/Cmd-click and middle-click are never intercepted. Under reduced motion there's no intro, wipe or breath, and the mesh is drawn once. With no JS, every card is a plain link. CLS was 0 at 1920, 1440, 1280 and 390 px, with no horizontal overflow and no infinite animations.
- **Open:**
  1. **Decided 2026-11-26: it replaces the home hero.** Remove the current hero when you integrate it, and keep a single `<h1>`.
  2. Untested on Safari, Firefox and real phones, and nobody has watched it play in real time.
  3. EN/AR strings (`data-say`, `data-label`, `data-dest`, `data-kuro-say`, visible text) and the mirrored AR layout (flip `--x`, `.l`/`.r`) aren't written.
  4. There's one still pose only. The six per-section drawings don't exist; they could come from the 28 queued Magnific generators, which the owner runs free in the app.
- No React, Tailwind or shadcn. CSP is `'self'`.

## C2. Character kit: `/mnt/project-files/characters/kit/` (00:12 UTC, not integrated)
- 95 cleaned drawings: Yasser has 12 full poses, 12 action frames (6 two-frame gestures), 12 faces, 13 head-rig frames on a shared 501×565 canvas, the 5-view turn and 2 hero masters. Kūro has 12 reactions and 7 rig frames on a shared 360×294 canvas. There are also 20 props.
- Ids follow `owner:kind:name` (e.g. `yasser:face:smirk`, `kuro:react:judge`), and short forms are accepted.
- `kit.json` holds the clock, easings, 24 actions, 12 reactions, motions and 24 scenes. `kit.js` (no dependencies, CSP-safe) and `kit.css` add up to 2.8 KB gzip.
- Wiring steps are in its README. Don't ship `index.html` or `preview/`. To test: `node qa/test.cjs`.
- **MISSING.md, ranked:**
  1. One pose per menu section (J01/J02).
  2. A second frame for the 12 single poses (the rig-frames page and J08).
  3. Kūro reacting in the scene (J03/J09/C04/C05).
  4. Locomotion (J04–J06/B01).
  5. A busy loop for the talk box (J07/J12).
  6. Page transitions (J10/J11).
  7. Matching side and back views (B05/I11).
- All of those are **unrun** generators in the owner's Magnific space. Through the API they cost about 50 credits each and the owner chose zero, so the owner runs them in the app. Each new sheet takes about 10 minutes to cut in with `tools/`.
- Excluded as off-model: `sil-5`, `yasser-lost`, and the expression sets 2–4 imports.

## D. Tools and how to check work
- Always render a board before publishing it to the canvas: `node characters/tools/board-render.cjs BOARD.dc.html map.json OUTDIR` (map = blob id → local file). Menu: `menu-render-gen.cjs`.
- Matting: rembg `birefnet-general-lite` works on objects; `isnet-anime` does not. `dehalo.py` removes paper trapped in hair.
- Motion rules: https://claude.ai/artifact/JSfpN8TEdBE4s6jpwue4cX · Plan: https://claude.ai/artifact/AMyLWoFbM8KFPHGnL2BwA5
