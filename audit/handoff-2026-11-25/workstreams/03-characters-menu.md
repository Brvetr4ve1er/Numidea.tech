# 03 · Characters, mascot, Talk board, intro/nav Menu (ACTIVE at snapshot)

Thread: "Improve artworks, characters and mascot animations".
Its own, newer notes: `/mnt/project-files/characters/STATE.md`. **Read that first; it wins over this file.**

## A. Code: draft PR #20 (`claude/project-thread-vm2rxf` @ 17b86e3) — not live
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
| Intro and navigation menu (`#artboard-Menu`) | `canvas-src/Menu.dc.html` | v2 collage. **Owner, 23:39 UTC: "I like it more like this now, do the animation rules and motion effects and easings and get it ready for publishing."** Thread is now adding motion tokens, idle/hover/press/exit motion, reduced-motion path, and a **site-ready plain HTML/CSS/JS build** + motion spec |

Menu v2 content [R]: 5-beat intro at 90 BPM (typed line, red slab, Yasser slams with echo + shake, shards + burst, name stamp, cards fan out). Six cards → Travaux `/scene/`, Tarifs `/tarifs/`, L'Atelier `/hub/`, La Lanterne `/hub/lanterne/`, La Bible `/hub/bible/`, Contact (WhatsApp). Hover, arrows or keys 1–6; click plays a red wipe. HUD: mood grid, Yasser's banner line, Kūro with tarot card. Background: the owner's React "constellation grid" snippet ported to plain canvas in Numidea colours, neighbour-only links, stops under reduced motion.

Owner feedback trail: v1 "don't like the way the cards are laid out", "missing the other 50% of the style, check the references". v2: liked (see quote above). Open: whether the mesh should be more visible (the collage mostly covers it).

## C. Porting the Menu to the live home (when the site-ready build lands)
- It replaces the home intro/nav, a big UX change. Get the owner's explicit go.
- Thread's own risk call: ~3 s before content; six fanned cards don't fit 390 px. Recommended: play once per visitor (with skip), stacked cards on mobile, reduced-motion = static.
- Missing art: one drawn pose per menu section (he stands still now), second pose per gesture, side/back views, Kūro reacting in scene. Those would come from the 28 queued Magnific generators (owner runs them free in the app).
- No React/Tailwind/shadcn. CSP is `'self'`.

## D. Tools and how to check work
- Always render a board before publishing it to the canvas: `node characters/tools/board-render.cjs BOARD.dc.html map.json OUTDIR` (map = blob id → local file). Menu: `menu-render-gen.cjs`.
- Matting: rembg `birefnet-general-lite` works on objects; `isnet-anime` does not. `dehalo.py` removes paper trapped in hair.
- Motion rules: https://claude.ai/artifact/JSfpN8TEdBE4s6jpwue4cX · Plan: https://claude.ai/artifact/AMyLWoFbM8KFPHGnL2BwA5
