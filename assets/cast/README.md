# The dock cast: Yasser and Kūro on every page

This folder is not published as a page: `README.md` is in `DEPLOY_SKIP`.

The dock is a small companion card in the corner of every page. Yasser breathes, blinks and follows the pointer with his eyes. Kūro sits on the card's shoulder and reacts. Both answer what the visitor does, and they talk in a game-style dialogue box.

| File | What it is |
|---|---|
| `cast.js` | The engine. `assets/carry.js` loads it once the page is idle, so it adds nothing to first-load weight. |
| `cast.css` | The dock, the bubble and the talk panel. Numidea palette, 90 BPM motion tokens. |
| `lines.json` | Every written line, in FR, EN and AR, under the same keys in each language. |
| `npc.js` | The home menu's big Yasser as a talking NPC: emotes, a dialogue box with his face as a portrait, written choice trees (`npc` in lines.json, written by `scripts/npc-lines.py`), Kūro's arcana on the tarot. Only "ask your own question" reaches the talk route. Loaded by `cast.js` on the home only. |
| `yasser.webp`, `kuro-face.webp`, `kuro-react.webp` | Sprite strips cut from `hub/bible/art/rig-*` and `kuro-*` by `scripts/cast-art.py`. |

## Canon (the persona sheet the lines, the route and the art all follow)

**Yasser**
- Founder of Numidea Labs, a one-person web and design studio in Bordj Bou Arréridj.
- Always artwork, never a photo.
- Deep brown skin, black hair worn loose or tied up (locs or strands), round glasses, black turtleneck, cream coat with red patches.
- A night owl with black coffee. Deadpan, warm, a little dry. He ships more than he talks.
- Says one or two short sentences, at most 160 characters. No lists, no emoji.
- Never invents prices, deadlines, clients or facts. Prices live on the Tarifs page. Contact is WhatsApp: no middleman, he answers himself.

**Kūro (クロ)**
- Jet black, flat fur, amber eyes, red collar.
- **Kūro never speaks.** He reacts, and only from a fixed list: judge, loaf, smug, stamp, peek, shook, hiss, love, leave, mug. The silence is the joke.

## What triggers what

| Trigger | Line key | Notes |
|---|---|---|
| First visit / return / night (23:00 to 05:00) | `hello` / `back` / `night` | At most once a visit. |
| The page itself | `home` `tarifs` `studio` `lanterne` `bible` `work` `comptoir` `lost` | Plays about 26 s after the greeting. |
| WhatsApp link, price link, preview button (hover or focus) | `wa` / `price` / `cta` | Once a page. |
| Bottom of a long page, copy, tab back after 20 s, Encre earned (`numidea:gain`) | `bottom` `copy` `tabback` `gain` | |
| 28 s of quiet / 60 s of quiet | `idle` / yawn, then heavy lids | |
| Petting Kūro (his own button), five times fast | reaction / `poke5` | |

**Bubble limits:** one every 22 s, five a page. "Fewer bubbles" (💬 in the panel) turns the unasked ones off on this device. The minus button minimizes the cast for the visit, and Kūro alone stays peeking.

**Where the dock steps out:**
- while a big staging of the same characters is on screen: the home menu `.nl-menu`, the bible's `#talks`, the Studio's `.st-hero`, Kūro's play pad `.st-pad`;
- it rises above bottom bars (`.st-dock.is-on`, `.st-pad`, `.st-rchip`);
- it never appears on WorkspaceHQ, the legal page or Kūro's episode;
- on the Librairie, Kūro already walks the shelf (`hub/life.js`), so the dock hides its own Kūro.

## Talk: written chips, then Claude Haiku

- **Chips** (`chips` in lines.json) are written answers. They cost nothing.
- **Typed questions** go to `POST /api/yasser` with `{history, page, lang}`.
  - The server holds the key; the browser never sees it.
  - The reply is `{line, emotion, act, kuro}`, each field from a fixed list, and the page maps emotion and act to a face.
- **Owner setup (once):**
  1. Add `ANTHROPIC_API_KEY` in Vercel → numidea-tech → Settings → Environment Variables (Production + Preview).
  2. Set a monthly spend limit on that key in the Anthropic Console ($5 chosen on 2026-11-28).
  3. Redeploy.
- **Without the key** the route answers 503, and the dock plays the written `offline` line.
- **Cost:**
  - About 900 input tokens a turn, mostly read from the prompt cache, plus about 60 output tokens.
  - That is roughly $0.0001 a turn, so $5 buys tens of thousands of turns.
- **Guardrails** (in `api/yasser.js`):
  - Rate limits: 6 turns a minute and 20 a day per address, 1,500 a day per instance, under the Console cap.
  - A rule-rewrite attempt ("ignore your instructions", "system prompt", "you are now"…) gets a written deflection, "Joli essai. Kūro a vu.", and never reaches the model.
  - A reply that contains a money amount, a link, an email or a phone number other than the studio's own is replaced by a written line pointing to Tarifs or WhatsApp.
  - Every field of the reply is checked against its list. The line is cut at 220 characters.
  - The page and language travel in a second, uncached system block, so the persona's cache stays warm.

## Editing

- **Lines:** edit `lines.json`, keeping the same keys in fr, en and ar.
  - French typography: a narrow no-break space (U+202F) before `? ! : ;`.
  - Arabic uses Western digits.
  - Never write a price, a date or a client's name here.
- **Art:** `python3 scripts/cast-art.py` re-cuts the three strips. The frame order there and in `cast.js` (`Y`, `KF`, `KR`) must match.
- **New Yasser faces** (more expressions, a wave, a point): add rig frames in the bible's style. They must be registered to the same 501×565 canvas as `rig-y-base`. Then add them to `Y` in both files.
