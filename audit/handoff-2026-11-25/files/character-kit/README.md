# Numidea character kit: Yasser & Kūro

**Status:** ready to integrate. **Not integrated, not published.** This project doesn't publish. The publishing session does.
**What it is:** every usable drawing of Yasser and Kūro, cleaned and named, plus the data and a 2.8 KB (gzip) player that turns them into poses, actions, reactions and scenes on the site's 90 BPM motion clock.
**Preview:** open `index.html` through any static server (`npx serve .` from this folder). It needs `fetch`, so `file://` won't work. Screenshots are in `qa/`.

## Files

| File | What |
|---|---|
| `art/` | 95 WebPs, ~2.7 MB total. The site only loads what a page uses. |
| `manifest.json` | One entry per asset: `{id, file, w, h, kind, tags, origin, bytes}`. |
| `kit.json` | The behaviour: `clock`, `ease`, `actions`, `reactions`, `motions`, `scenes`. |
| `kit.js` | The player. No dependencies, no inline script (fits `script-src 'self'`). |
| `kit.css` | The three animation classes the player toggles, plus the `.kit-slot` rule. |
| `index.html`, `preview/` | Preview page only. Don't ship it. |
| `MISSING.md`, `generators.json` | Drawings the kit still lacks, ranked, mapped to the generators already queued in Magnific. |
| `build.py`, `data.py` | Regenerate `art/` + `manifest.json`, then `kit.json`. Sources are in `/mnt/project-files/characters/`. |
| `qa/test.cjs` | Playwright check: `node qa/test.cjs`. |

## What's in it

**Library (95):**
- Yasser:
  - 12 full poses: coffee, facepalm, flagstack, handover, inspect, invoice, laptop, nap, point, receipt, shrug, sign.
  - 12 action frames, which make 6 two-frame gestures: wave, phone, point-up, sketch, win, duo hug.
  - 12 faces.
  - 13 head-rig frames on one shared 501×565 canvas, so they stack pixel-perfect.
  - The 5-view turnaround.
  - 2 hero masters.
- Kūro:
  - 12 reactions.
  - 7 rig frames on one shared 360×294 canvas.
- 20 props, including the tarot card front and back.

**Ids:** `owner:kind:name`, e.g. `yasser:face:smirk`, `kuro:react:judge`, `props:satchel`. Short forms are accepted:
- `pose:x` resolves to `yasser:pose:x`.
- A face `x` resolves to `yasser:face:x`.
- A Kūro `x` resolves to `kuro:react:x`.
- A prop `x` resolves to `props:x`.

**Actions (24):** frame sequences. Holds are counted in eighths (e8 = 83 ms).
- **Rig actions** have a `base` and draw an overlay over it: blink, talk, glance left/right, push glasses, half-lid, laugh, sip, smirk, look up, yawn, and Kūro's blink, ear, look, startle and yawn.
- **Body actions** replace the image: wave, phone, point-up, sketch, win, duo hug, and the 9-cut turn.
- `y.blink` is the idle loop. It fires at random gaps of 2.2 to 4.8 s, and only while `kit.idle()` is running.

**Reactions (12):** these match the `emotion` enum in `api/yasser.js` exactly: neutral, joy, smug, thinking, focus, surprised, annoyed, angry, tired, sleepy, embarrassed, decisive. Each one is a face, a Kūro, a mark (♪, !, ?, …), a motion (pop, tilt, push-in, shake, droop, slam) and an optional head action.

**Scenes (24):**
- **18 `talk.*` scenes** cover every `act` in `api/yasser.js`, plus `kuro`, `ride`, `deploy`, `nomiddleman` and `oops` for the written chips. Each has the chip question, his line (FR), a reaction, a body, a stamped word, a prop and a callout card.
- **6 `menu.*` scenes** cover Travaux, Tarifs, L'Atelier, La Lanterne, La Bible and Contact. Each has the label, destination, face, Kūro, prop and line. Their `body` is the shared standing figure until the per-section poses are drawn (see MISSING.md #1).

## API

```js
Kit.load('/assets/kit/').then(kit => {
  kit.react(stage, 'joy');            // face + Kūro + mark + motion (+ head action)
  kit.scene(stage, 'talk.price');     // reaction + body + word + prop + card + line
  kit.play(slot, 'y.wave');           // one action → Promise
  const stop = kit.idle(head, 'y.blink');  // random-gap blink; call stop() on teardown
  kit.preload(['yasser:pose:laptop', 'props:laptop']);
  kit.src('pose:coffee');             // → URL
});
```

**Stage contract.** The markup is yours. The player only looks for these hooks inside `stage`:

| Hook | Element | Filled with |
|---|---|---|
| `[data-kit=face]` | `<img>` | face |
| `[data-kit=kuro]` | `<img>` | Kūro reaction |
| `[data-kit=mark]` | any | ♪ ! ? … (re-pops) |
| `[data-kit=shake]` | wrapper | gets the motion (falls back to the face) |
| `[data-kit=head]` | slot | head-rig actions (laugh, smirk…) |
| `[data-kit=body]` | slot | pose or body action (slams in) |
| `[data-kit=word]` | any | stamped word |
| `[data-kit=prop]` | `<img>` | prop (pops in) |
| `[data-kit=line]` · `card-name` · `card-line` | any | his line, the callout card |

**A slot** is any element that contains `<img data-base>` and, for rig actions, `<img data-over>` stacked on the same box (`.kit-slot` in `kit.css` does this). The stage gets `data-scene`, plus `kit-has-body`, `kit-has-prop` and `kit-has-card`, so CSS can hide empty parts.

## Wiring it into the site (for the publishing session)

1. **Copy.**
   - `art/`, `kit.json` and `manifest.json` go to e.g. `assets/kit/`.
   - `kit.js` goes to `assets/`, loaded with `defer`.
   - Paste the rules from `kit.css` into the site CSS. The motion tokens are already the same as the menu package.
2. **"Talk to Yasser" box (bible §00).** `api/yasser.js` already returns `{line, emotion, act, kuro}`. Use the three fields like this:
   - `emotion` → `kit.react(stage, emotion)`
   - `act` (if not `none`) → `kit.scene(stage, 'talk.' + act)`, then overwrite `[data-kit=line]` with the model's `line`
   - `kuro` (if not `none`) → `kuroImg.src = kit.src(kuro, 'kuro')`

   The written chips can call `kit.scene(stage, 'talk.<id>')` directly. They cost nothing.
3. **Menu package** (`../site-menu/`). The menu works without the kit. To make it react through the kit, call `kit.scene(stage, 'menu.' + id)` from `pick()` in `menu.js`. That swaps the face, Kūro, prop and line from one data source. Until the six poses exist this only changes the HUD, not the figure. Don't oversell it.
4. **Idle life.** On any page with his head, run `kit.idle(headSlot, 'y.blink')`, and `k.blink` for Kūro. Stop both when the element leaves the screen.
5. **Gates.**
   - **CSP:** `kit.js` fetches `kit.json` and `manifest.json` from the same origin. If a page sets `connect-src`, it must allow `'self'`.
   - **audit.mjs:** nothing loops forever. Idle loops are JS timers, and actions are finite.
   - **keys.mjs (reduced motion):** actions jump to their last frame, motions and idle loops don't start, and the CSS classes are `animation:none`.
   - **check.mjs:** nothing under `hub/` should name the image tool. This package names it only in `MISSING.md` and `generators.json`, which are planning files. Don't ship those two.
   - **Weight:** load per page, not the whole `art/`. The heaviest single file is the head master (~90 KB). Everything else is under 70 KB.

## Tested here (Playwright, Chromium)

- All 95 images load. No console or page errors.
- `y.wave` swaps both frames. The `y.blink` overlay shows, then hides.
- All 24 scenes play (face and word checked for each).
- The reactions and the 24 action cards render.
- There's no horizontal overflow at 390 px.
- Under reduced motion `y.wave` jumps straight to its last frame.
- **Not tested:** Safari and Firefox, a real phone, and how the timing feels in real time.

## Motion rules (same as the menu package, so keep them)

Holds are whole eighths (83 ms). Arrive with `--out`, leave with `--in`, stamp with `--snap`. At most two overshoots at once. Animate transform and opacity only. Nothing loops forever. Reduced motion means a still frame, not a slower one.
