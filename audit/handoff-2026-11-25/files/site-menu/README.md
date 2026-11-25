# Intro + navigation menu: site-ready package

**Status:** ready to integrate. **Not integrated and not published.** This project does not publish; the publishing session does.
**Owner sign-off:** the layout and style were approved on 2026-11-26 ("i like it more like this now"). The owner then asked for the motion rules, effects and easings, and for the menu to be readied for publishing.
**Design source:** the board "Intro and navigation menu" on the canvas https://claude.ai/artifact/8dwp6X1pUjckGmv6LUWybA (version 12). Its source is at `../canvas-src/Menu.dc.html`.

## Files

| File | What |
|---|---|
| `index.html` | Standalone preview. The menu markup sits between the `MENU` comments. |
| `menu.html` | The same markup on its own, ready to paste. |
| `menu.css` | All styles, scoped under `.nl-menu`. Motion tokens are at the top. ~5.5 KB gzip. |
| `menu.js` | No dependencies. Runs the intro state machine, card picking, keys, the exit wipe and the cursor mesh. ~3.7 KB gzip. |
| `img/` | 20 WebPs, ~350 KB total. The full body is 96 KB and has `fetchpriority=high`. Everything else is under 20 KB each. |
| `fonts/` | Archivo 900 (latin and latin-ext, OFL, 26 KB). A 2.4 KB subset of Noto Sans JP 900 containing only ヌミデア, for the watermark. |
| `qa/` | Screenshots and the two Playwright scripts used to test this package. |

## Integrating it into the site (for the publishing session)

1. **Copy the files.**
   - `menu.css` and `menu.js` go to `assets/` (or wherever you choose).
   - `img/*` goes to e.g. `assets/menu/`.
   - `fonts/*` goes to `assets/fonts/`.
   - Update the relative `url(fonts/…)` paths in `menu.css` and the `img/…` paths in the markup to match.
2. **Place the markup.** Paste `menu.html` where the home intro should be. Load `menu.css` in `<head>` and `menu.js` with `defer`. The JS contains no inline script, so it fits the site's CSP (`script-src 'self'`). Inline `style=""` attributes are used for per-card custom properties, which `style-src 'unsafe-inline'` already allows.
3. **Decide what it replaces.** This is a full-height intro plus nav. The owner has not said whether it replaces the current hero or sits above it. **Ask the owner.**
4. **`<h1>`.** The menu ships an `<h1>Numidea Labs</h1>`. If the page already has an h1, change this one to a `<p>` or remove the other.
5. **Languages.**
   - All copy is French.
   - EN and AR versions need translated `data-say`, `data-label`, `data-dest`, `data-kuro-say` and visible text. Those strings are not written yet.
   - AR also needs a mirrored layout (`dir="rtl"`): flip the `--x` positions and the `.l` and `.r` classes.
   - The FR/EN/AR pills link to `/`, `/en/` and `/ar/`.
6. **Run the gates.** Run the site gates (`npm run verify`). Expected friction:
   - **check.mjs** forbids naming the image tool or model under `hub/`. This package names neither.
   - **audit.mjs** flags infinite animations. There are none: the idle breath runs 3 times and stops. The cursor mesh is canvas drawing, not a CSS animation.
   - **keys.mjs** reduced-motion gate. Under reduced motion the JS writes once at load, then nothing.
   - **Image budgets.** If a gate caps home weight, the full body (96 KB) is the one to look at first.

## Tested here (Playwright, Chromium)

- **Layout:** at 1920×1080, 1440×900, 1280×720 and 390×844 there was no horizontal overflow and the layout shift (CLS) was **0.0000**. The root height comes from CSS, and JS only scales with `transform`.
- **No infinite animations:** nothing is still running 9 s after load.
- **Interaction:**
  - Hover and focus select a card and update the HUD.
  - Keys 1 to 6 and the arrows move the selection.
  - Clicking plays the wipe, then navigates to the right URL (checked with `/tarifs/`).
  - Contact (WhatsApp, `target=_blank`) opens normally, with no wipe.
  - Ctrl or Cmd-click and middle-click are never intercepted.
- **Intro replay:** the intro plays once per tab session (`sessionStorage`). A revisit lands on the menu. Skip with the button, Esc, Space or Enter. "Rejouer l'intro" replays it.
- **Reduced motion:** no intro, no wipe and no breath. The mesh is drawn once. Colour changes stay.
- **No JS:** the menu renders at rest and every card is a plain link.
- **Not tested:** Safari and Firefox, a real phone, and how the animation feels to watch in real time. Screenshots only prove the frames.

## Motion spec

One clock: 90 BPM. **beat = 667 ms**, **e8 (an eighth) = 83 ms**. Every duration is on this ladder:

| Token | ms | Used for |
|---|---|---|
| `--e8` | 83 | colour flips, fades, press-down |
| `--d2` | 167 | card steps toward him, cards leaving, prop leaving |
| `--d3` | 250 | stamps (label re-stamp, name stamp, final label), shard cut-in, shadow snap, speech pop |
| `--d4` | 333 | card fan-out, burst, HUD arrival, wipe in |
| `--d5` | 420 | slab cut-in, his slam, name moving to the corner |
| `--beat` | 667 | phase spacing, delay before the breath |
| `--bar` | 2667 | one breath |

| Curve | Value | Rule |
|---|---|---|
| `--out` | `cubic-bezier(.16,1,.3,1)` | Anything arriving. Fast start, long settle. |
| `--in` | `cubic-bezier(.7,0,.84,0)` | Anything leaving. Never use it to arrive. |
| `--snap` | `cubic-bezier(.34,1.56,.64,1)` | Stamps and pops: exactly one overshoot. |
| `--move` | `cubic-bezier(.65,0,.35,1)` | Going from one rest spot to another (the name to the corner). |
| `--breathe` | `cubic-bezier(.45,0,.55,1)` | The only loop, and it is finite. |

### Choreography

**Intro, about 3 s:**

- **0 ms:** the line types itself, one letter per 42 ms.
- **1000 ms (p1):** the red slab cuts in with `--out`.
- **1333 ms (p2):**
  - He slams: 60 px rise, squash and stretch, two settles.
  - An ink echo twin trails him on a slower curve.
  - Three shards cut in, delayed one e8.
  - The ink burst pops with `--snap`, delayed d2.
  - The screen shakes once: 200 ms in 5 hard steps, delayed d3.
- **2000 ms (p3):** "Numidea Labs" stamps big over him with `--snap`.
- **3000 ms (p4):**
  - The name moves to the corner with `--move`.
  - Six cards fan out from behind him, 42 ms apart, using `--snap`.
  - The HUD settles one d4 later.
  - The breath starts one beat later.

**Card select (hover, focus or key):**

- The card steps 14 px toward him and grows to 1.13 (`--out`, d2).
- Its face flips paper to brick (e8, linear).
- The label re-stamps from 1.22 (`--snap`, d3).
- The hard shadow snaps further out and turns paper (`--snap`, d3).
- The prop pops on with `--snap` while the old one leaves with `--in`.
- Yasser's line re-pops (`--out`, d3), the mood grid ringlight moves, and Kūro swaps.

**Press:** the card sinks 3–4 px and scales to 0.97 in one e8.

**Exit (click):**

- The other cards drop out (`--in`, d2).
- The red wipe crosses (`--out`, d4, delayed e8).
- The destination label stamps (`--snap`, d3, delayed d3).
- The browser navigates at 7 e8 (583 ms).

**Mesh:**

- **How it moves:** a 55 px grid of points on springs (k = 18, damping 0.82). The cursor pushes points within 180 px, and faster sweeps push harder.
- **What it draws:** a red radar ring and a hex coordinate label within 90 px.
- **Cost:** O(n), since each point only links to its right and lower neighbours.
- **When it runs:** only with a fine pointer, at ≥ 760 px, with motion allowed, the tab visible and the menu on screen.

### Rules to keep if anyone edits this

1. No duration off the ladder. No new curves.
2. Arrive with OUT, leave with IN, stamp with SNAP. Never use linear for movement, only for colour and opacity.
3. Respond to input within 300 ms. The longest reaction here (label re-stamp) is 250 ms.
4. At most 2 things overshoot at once.
5. Transforms and opacity only. Never animate `top`, `left`, `width` or `height`.
6. Nothing loops forever.
7. Reduced motion means a still frame, not a slower one.

## Known gaps

- The figure is a single still. The reference energy comes from the character posing differently per option, which needs **one drawn pose per section** (6 drawings). Those don't exist yet.
- EN and AR copy and the RTL layout are not written.
- The phone layout works (stacked cards, smaller figure, no mesh, no mood grid or Kūro panel) but has not been reviewed on a real device.
- On desktop the mesh redraws every frame while the menu is on screen, to keep the points pulsing. If a battery or CPU budget complains, cap it at 30 fps or stop it when the cursor is away.
