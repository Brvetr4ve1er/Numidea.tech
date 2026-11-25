# Characters thread: current state (2026-11-26 00:45 Paris)

Thread: "Improve artworks, characters and mascot animations".
Project rule from the owner (2026-11-26): **this project does not publish.**
A separate session publishes. Everything below is a draft, a canvas board or a file.

## 1. Code on GitHub (not merged, not live)

- Repo `Brvetr4ve1er/numidea.tech`, branch `claude/project-thread-vm2rxf`, **draft PR #20**, head `17b86e3`.
- PR #20 contains:
  - **C1, continuity.** Skin recolor on the workbench, diorama and make trio. Kūro set to canon black (`scripts/kuro-canon.mjs`). Orphan art deleted. Librairie traveller back to canon. Model sheet added to BRAND.md.
  - **C2, bible §02.** Drawn 5-view turnaround with hard cuts and drag, plus Kūro at scale. The Studio menu mock uses the same files. sil-0/2/3 deleted.
  - **C3, bible §00 "Talk to Yasser".** `api/yasser.js` is a Vercel function on Haiku that returns JSON `{line, emotion, act, kuro}` with a cached system prompt. The written chips cost nothing.
- PR #20 state:
  - Its mergeable state is "dirty", so it needs a rebase onto the trunk (`claude/numidea-labs-landing-c4jokc`).
  - `npm run verify` last failed only on the pre-existing WorkspaceHQ CSP and reduced-motion issues, which another thread owns.
- C3 setup the owner must do: add `ANTHROPIC_API_KEY` in the Vercel env and a Console spend limit. Without it the box plays an offline line. Claude never handles the key.
- C3 enum gap: if the canvas acts `ride`, `deploy` and `oops` are ported to the site, add them to the `act` enum in `api/yasser.js`.

## 2. Claude Design canvas (prototypes only)

Canvas "Yasser paper rig · 3D prototype": https://claude.ai/artifact/8dwp6X1pUjckGmv6LUWybA (version 11).
Copies of the board sources are in `/mnt/project-files/characters/canvas-src/`.

| Board | File | State |
|---|---|---|
| Paper rig: Yasser and Kūro | Main.dc.html | three.js turntable of paper cut-outs, done |
| Talk to him: the reaction board | Talk.dc.html | v4: slam, echo, prop burst and callout card, blink and lip flap, Kūro card in the dialogue box. 18 acts, including `oops` |
| Intro and navigation menu | Menu.dc.html | v2 (collage). **Waiting on owner feedback** |

Menu v2 details:
- **Intro, 5 beats at 90 BPM:** a typed line, the red slab, Yasser slams with an echo and a shake, shards and a burst, the name stamps, then the cards fan out.
- **Cards and their routes:** Travaux `/scene/`, Tarifs `/tarifs/`, L'Atelier `/hub/`, La Lanterne `/hub/lanterne/`, La Bible `/hub/bible/`, Contact (WhatsApp).
- **Controls:** hover, arrows or keys 1 to 6. Clicking plays a red wipe.
- **HUD:** a mood grid, Yasser's banner line, Kūro with the tarot card.
- **Cursor mesh background:** the owner pasted a React "constellation grid" snippet. It is ported to plain canvas in Numidea colours, linking neighbours only, and it stops under reduced motion. The site has no React, Tailwind or shadcn, so don't add them for this.
- **Owner feedback so far:**
  - v1: "don't like the card layout", "missing the other 50% of the style". v2 answers that with a dense collage.
  - v2: no verdict yet.
- **Open questions for the owner:** which cards still feel wrong, and whether the mesh should be more visible.
- **Not ported to the site.** Porting changes the home, so it needs the owner's call and goes through the publishing session.

## 3. Docs

- Plan doc: https://claude.ai/artifact/AMyLWoFbM8KFPHGnL2BwA5
- Motion rules ("Pop-up scenes: the motion rules"): https://claude.ai/artifact/JSfpN8TEdBE4s6jpwue4cX
  - 90 BPM grid: beat 667 ms, eighth 83 ms.
  - 5 depth planes, a cream sticker outline on every cut-out, an echo twin, a slam with one shake.
  - Interactions under 300 ms.

## 4. Art files in /mnt/project-files/characters/

- `bible-clean/`: 25 bible frames with the white paper trapped in the hair removed, plus rig frames for blink and talk-a/b.
  - **The site still ships the old frames**, which show halos on dark backgrounds. Swapping these in is an easy follow-up for PR #20.
- `new-props/cut-v2/`: clean prop cut-outs (satchel, laptop, sketchbook, fineliner, boxes, scooter, server, hairsticks, tarot and others).
- `magnific-import/`: 254 WebPs cut from the 31 "Character Bible v2" sheets, at 1024 px.
- Proof sheets:
  - `board-v3/board-v3-states.jpg` and `board-v3/board-v4-popups.jpg`
  - `board-menu/menu-v1-states.jpg` and `board-menu/menu-v2-states.jpg`
- `tools/`:
  - Matting: `comps.py`, `recut.py`, `holes.py` (rembg `birefnet-general-lite` works on objects, `isnet-anime` does not), `dehalo.py`, `propcut.py`, `matte.py`, `refine.py`.
  - `board-render.cjs`: a local Playwright stand-in for the canvas runtime. Run `node board-render.cjs BOARD.dc.html MAP.json OUTDIR`. **Always render a board before publishing it to the canvas.**

## 5. Standing owner rules for this work

- **Founder art:** Yasser appears only as artwork or animation, never as a photo.
- **Yasser canon:** deep brown skin, black hair worn loose or tied up (locs or strands are both fine), round glasses, black turtleneck, cream coat with red patches.
- **Kūro canon:** jet black, amber eyes, red collar.
- **Magnific:** zero credits. Reading or importing existing creations is fine.
- **Copy:** French-first.
- **Naming:** never name the image tool or model under `hub/` (check.mjs enforces this).
- **Game references:** take the grammar and the density of the game references. Don't clone a specific game's lettering, logo or exact palette. Use Numidea's palette: parchment #F3ECE1 / #D8CBB8, ink #211E1B, brick red #A34135.
- **Feedback style:** blunt and prioritized.

## 6. Not done or parked

- 28 queued rig-frame generators in the owner's Magnific space have not been run. The owner runs them in the app.
- Drawings that are missing:
  - a second pose per gesture
  - side and back views for a real turn
  - one pose per menu section
  - Kūro reacting in the scene
- On a phone, the menu needs a stacked layout and a play-once intro with a skip. Not built yet.
