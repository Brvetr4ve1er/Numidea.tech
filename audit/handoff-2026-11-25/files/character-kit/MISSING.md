# What the kit still lacks, and where each drawing comes from

The kit uses **every usable drawing that exists today** (95 files). What it can't do comes down to drawings that were never generated. They are already queued as image generators in the owner's Magnific space **NUMIDEA BASE**, page **"CHARACTER BIBLE v2 · Yasser, Kūro & the World"**. None of them have run.

**Cost:** through the API each image is about 50 credits, and most of these nodes are set to 2 images each. The account has about 237 credits and the owner chose to spend zero, so this project did not run them. The owner runs them in the Magnific app when they decide to. Nothing here needs code first.

Ranked by how much each unlocks on the site:

| # | Gap | What it blocks today | Generator(s) to run | Node id |
|---|---|---|---|---|
| 1 | **One pose per menu section** (6 drawings) | Every `menu.*` scene reuses the same standing figure. This is the single biggest hit to the "game menu" feel. | J01 — Yasser UI states 1–6 · J02 — Yasser UI states 7–11 · fallback B03 — Body language sheet | `dd7dea3a…` · `38ab4f6f…` · `0aca7798…` |
| 2 | **Second frame for the 12 single poses** (coffee, facepalm, invoice, laptop…) | Those poses can only slam in and hold. They can't loop or "act". | The 28 generators on the page **"Rig frames · Yasser & Kūro"** (same space). Also J08 — Idle layers: head/eyes/glasses | page `62198ba0…` · `a1bebec4…` |
| 3 | **Kūro reacting in the scene** (not just in the box) | Kūro only swaps a still. No body language, no tail. | J03 — Kūro UI states 1–11 · J09 — Idle layers: ears/tail/eyes · C04 — Walk cycle + tail language · C05 — Emoji/sticker pack | `5f96cf6e…` · `b5b6286a…` · `06f0c38b…` · `7e42f420…` |
| 4 | **Locomotion** (walk in, run off, Kūro trot or pounce) | Entrances are slams only. There's no "he walks to the card". | J04 — Yasser walk (8f) · J05 — Kūro trot (8f) · J06 — Kūro pounce (8f) · B01 — Locomotion sheet | `e0e95675…` · `0884631b…` · `c4a27dce…` · `ae3e752e…` |
| 5 | **Busy / loading loop** | Nothing to show while the "Talk to Yasser" box waits on the model. | J07 — Yasser scribble loop (8f) · J12 — Micro-interactions sheet | `913da495…` · `5f9058af…` |
| 6 | **Page transitions** | The menu exit is a flat red wipe. | J10 — Torn-paper page change · J11 — Day → night lamp cord | `221f89aa…` · `9cca2364…` |
| 7 | **Side and back views that match the front** | The 5-view turn exists, but some views are from older sheets, so the turn has a slight style jump. | B05 — Hero portrait, three-quarter · I11 — Transparent cutouts sheet | `a2d3e249…` · `47c3c701…` |

Full node ids are in `generators.json` next to this file.

## Left out on purpose

- `sil-5` and `yasser-lost` are off-model (wrong skin or face drift). They are excluded from the kit.
- The "Yasser expression sets 2–4" imports are a flatter style with lighter skin. They're off-canon, so the faces come from the bible frames instead.

## How a new drawing gets into the kit (about 10 minutes per sheet)

1. Run the generator in Magnific and export the sheet.
2. Split and cut it with the tools in `/mnt/project-files/characters/tools/`. Use `recut.py` and `propcut.py` (rembg `birefnet-general-lite`; `isnet-anime` fails on these), then `dehalo.py` to remove the trapped white paper.
3. Check the founder canon before keeping a frame: deep brown skin, black hair loose or tied, round glasses, black turtleneck, cream coat with red patches. Reject drift.
4. Drop the cut-outs into `bible-clean/` (or a new folder) and add them to `build.py`. Run `python3 build.py`, then `python3 data.py`.
5. In `data.py`, point the scene at the new pose. Each `menu.*` scene has a `wants` field marking exactly where its pose goes. Replace its `body` with the new id, or with a two-frame action.
