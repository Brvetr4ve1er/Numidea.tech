# Kūro episodes · episode 1 « Le dernier départ »

**Status:** playable prototype plus design notes. **Not integrated and not published.** This project doesn't publish; the publishing session does.
**Supersedes:** `kuro-episode-note.md` (still accurate, this goes further).

| File | What |
|---|---|
| `episode/` | The playable prototype: `index.html`, `episode.js` (engine, ~17 KB), `episode.css`, `episodes/ep01-dernier-depart.json` (all content, FR/EN/AR), `art/` (22 WebPs from the character kit, ~800 KB), one font. |
| `SCRIPT-ep01.md` | The full script in readable form, **generated** from the JSON by `tools/script-md.py`. Edit the JSON, then regenerate. |
| `EPISODE-FORMAT.md` | The episode template and data format, so episode 2 is content, not code. |
| `tools/script-md.py` | JSON → script. |
| `qa/` | Play-through screenshots (desktop, phone FR, phone AR). |

**Preview:** serve the `episode/` folder from any static server and open `index.html` (`?lang=en` or `?lang=ar` to switch). It uses `fetch`, so `file://` won't work.

## 1. Placement (settled with the game loop thread, 2026-11-26)

- Kūro episodes are reached **from the Librairie** and stay **out of the enquêtes core**. *Les enquêtes de nuit* remains the only night-case game.
- Completion goes into `numidea-save`: `ep: {"ep01-dernier-depart": {done: true, t}}` and `world: {kuro_in_bag: true}`.
- Encre is **derived** by the game loop: +100 per finished episode, never stored here.
- The event `numidea:gain` fires with `{source:"episode", id, encre}`.
- **Seals are untouched.** The seven stay the perch game in `hub/life.js`, and no eighth was added. Reason: "all seven open the night drawing" is a finished rule with its own payoff. Episodes pay in Encre and in a visible change to the hub instead.
- **Storage is behind one object** (`store` in `episode.js`). `store.done()` calls `window.NUMIDEA_GAME.episodeDone(id, world)` when slice 1 provides it, and writes the same shape itself otherwise. In-progress state is in its own key, `numidea-ep-<id>`, and is cleared on finish.

## 2. The episode

The setup: the scooter is ready, the parcel is packed, and Kūro has vanished. Four clues lead to the bag, and each one teaches one piece of studio craft:

| Clue (right action) | What the player learns | Lesson kept in the Carnet |
|---|---|---|
| Laptop · *Toucher le capot*: still warm, fur leads to the bag | Debugging | Look where it last worked. The last known state beats ten guesses. |
| Carnet · *Lire la page cornée*: "porthole cut at whisker height, tested by the user" | Design | Design at the real user's eye level, not your own. |
| Colis · *Vérifier l'étiquette* (or the wrong *Rouvrir*) | Delivery | Check before you close. Reopening costs more than checking. |
| Sacoche · *Défaire la boucle* after finding him | Fixing | When it's stuck, loosen before you pull. A clean step back beats forcing it. |

**The solution path:** read the carnet → look through the porthole → undo the buckle → hand Yasser the keys.

**Every reaction has a cause.** Each reaction is tied to one action:

| Wrong turn | What it gets |
|---|---|
| Keys too early | Facepalm: "On part sans le chat ?" |
| Calling Kūro | Shrug: "find him, don't call him" |
| Reopening the parcel | Angry |
| Pulling the tail | Angry, plus Kūro's hiss |
| Opening the laptop | Side-eye |

**The hub remembers.** The end card says Kūro now sleeps in the bag. The hub has to show it by reading `world.kuro_in_bag`; see section 4.

**Replay:**
- Encre is paid on the first finish only.
- Missed lessons show as locked lines on the end card, with a "replay to find it" note.

**The business door stays open.** The end card's main button is *Retour à l'atelier*, and it also has quiet links to *Tarifs* and *Contact*.

## 3. Art map: every beat, and what's missing

Everything below comes from `/mnt/project-files/characters/kit/art`. Zero credits were spent.

| Beat | Asset |
|---|---|
| Scene objects | `props/scooter`, `laptop-closed`, `sketchbook`, `box-closed`, `satchel`, and `satchel-open` once freed |
| Yasser in the scene | `pose/shrug` (start, calling), `pose/facepalm` (keys too early), `pose/handover` (the keys) |
| Yasser's face in the dialogue | `face/deadpan, focus, think, smirk, sideeye, angry, shocked, laugh` |
| Kūro | `react/judge` (found, tail stuck), `react/hiss` (pulled), `react/love` (freed, end), `react/loaf` (sitting on the open bag) |

**Missing, ranked.** None of these block play.

1. **Kūro seen through the porthole.** This is the episode's key image, and it doesn't exist. Today the dialogue portrait carries it (Yasser shocked + Kūro judging). A cheap stopgap needs no new art: mask a crop of `kuro/react/judge` (the eyes) into the porthole circle of `props/satchel` with CSS. The same composite is what the hub needs afterwards.
2. **The tail caught in the buckle,** as a close-up insert.
3. **A full-body standing Yasser in the room.** The poses are busts, so he's cut at the floor line. This is `MISSING.md` #1 in the kit (J01/J02).
4. **A drawn room background.** Today it's a CSS gradient, a lamp glow and a floor line. The existing `assets/illus/workbench-night` is off-model (lighter skin), so I didn't use it.
5. **The scooter leaving at night,** for the end card.

## 4. Wiring it into the site (for the publishing session, after slice 1)

1. **Copy files.** Copy `episode/` to `hub/lanterne/kuro/`. Put the art in `hub/img/kuro/`, or point `data-art` at the kit's `assets/kit/art/` once the kit ships. Rename the art paths, or keep the flat names.
2. **Add the page.** Add the page to `scripts/site.mjs` PAGES so `build-csp.mjs` writes its policy. The page has no inline script, so the policy needs no hashes beyond the gtag one.
3. **Strings.**
   - UI strings sit in `UI` at the top of `episode.js`. Move them to `hub/lanterne/i18n/` if the lint wants them there.
   - Arabic needs a pass through the Arabic linting the enquêtes use: `<bdi>` for "Kūro", numerals.
4. **Entry from the hub.** Keep *Taquiner Kūro* as it is. After one authored reaction, show a small text button, *Examiner la sacoche*, next to the character: a real `<button>`, reachable by keyboard.
5. **The hub change.**
   - If `numidea-save.world.kuro_in_bag` is set, the hub shows the porthole composite (missing art #1, stopgap described above).
   - Yasser gets one new line: « Il ne sort plus de cette sacoche. Merci pour l'autre soir. »
6. **Run the gates.**
   - `npm run check`. Nothing here loops. Every animation is a finite `kit-*` class, and reduced motion stops them all. All `<img>`s are decorative with `alt=""` because every object is named in its button text.
   - Then `npm run verify`.

## 5. Three more episodes the existing props can carry

The format is in `EPISODE-FORMAT.md`. Each of these is a new JSON plus at most one new art file.

**Episode 2 · « Le serveur qui fume » (Ops)**
- **Props:** `server`, `server-boom`, `server-side`, `laptop`, `headphones`.
- **Setup:** 23:40, the rack smokes, the client site is down, and Kūro is very interested in the warm vent.
- **Lessons:**
  - Read the error before you reboot.
  - Change one thing at a time.
  - A backup you've never restored isn't a backup.
  - Tell the client before they notice.
- **Wrong turns:** rebooting blind gives facepalm. Unplugging everything gets the `server-boom` act.

**Episode 3 · « La signature » (the business side, a natural bridge to Tarifs)**
- **Props:** `fountain-pen`, poses `invoice`, `sign`, `receipt`, `handover`, `tarot` as the contract card.
- **Setup:** the contract has to leave tonight. Two versions are on the desk, and Kūro is sitting on the right one.
- **Lessons:**
  - One source of truth for versions.
  - Write the scope before the price.
  - A deposit starts the work.
  - Never sign a version you haven't reread.
- **End:** the end card links to *Tarifs* with a reason to click.

**Episode 4 · « Le casque disparu » (Design craft)**
- **Props:** `headphones`, `marker`, `fineliner`, `sketchbook`, `hairsticks`.
- **Setup:** Yasser can't start the night design session without his headphones. Kūro has "borrowed" the hairsticks too.
- **Lessons:**
  - Rough it with the marker before refining with the fineliner (low fidelity first).
  - Check contrast on the real background.
  - Name files so tomorrow-you finds them.

**The treadmill, honestly.**
- Writing is the real cost, about 1 day per episode in 3 languages.
- These four episodes use nearly every prop.
- Episode 5 onward needs new drawings, or reuses props in a new room.

## 6. What success looks like (virtual page views the site can count)

`episode.js` pushes `{event:'virtual_page_view', page_path:'/hub/lanterne/kuro/<id>/<step>'}` to `window.dataLayer` whenever the site's tag is on the page.

**Steps tracked:**

| Kind | Steps |
|---|---|
| Lifecycle | `start`, `resume`, `replay`, `end` |
| Progress | `warm`, `plan`, `found`, `freed` |
| Lessons | `lesson-<id>` |
| Wrong turns | `wrong-<hotspot>-<action>` |
| Exits | `exit-back`, `exit-tarifs`, `exit-contact` |

| Metric | Formula | First target (a guess to revise after 30 days) |
|---|---|---|
| Discovery | `start` ÷ hub page views | ≥ 3% (it's hidden on purpose) |
| Completion | `end` ÷ `start` | ≥ 60% |
| Where people get stuck | the funnel `start → warm/plan → found → freed → end` | no single step loses > 25% |
| Difficulty | `wrong-*` per `start` | 1 to 3. At 0 it's too easy; above 5, the clues are unclear |
| Learning | `lesson-*` per `end` | ≥ 3 of 4 on average |
| Replay | `replay` ÷ `end` | any non-zero number is a signal |
| **Business guard** | Share of episode sessions that also reach `/tarifs/` or Contact, compared with hub sessions without the episode | **must not be lower** |
| Business bridge | (`exit-tarifs` + `exit-contact`) ÷ `end` | ≥ 5% |

**Not verified:**
- GTM needs a trigger for the `virtual_page_view` event; nobody has checked whether one exists.
- Consent defaults to denied, so raw counts cover consented visitors only.

## 7. What was tested, and what wasn't

**Played through in Chromium with Playwright: 30 of 30 checks pass.** Script: `/tmp/claude-0/eptest/play.cjs`, a scratch copy.

- **Desktop, French**, every wrong turn and both conditional paths:
  - Keys too early gives facepalm; calling Kūro gives shrug.
  - Reopening the parcel gives angry, and the delivery lesson.
  - The bag goes from *examiner* to *soulever* once the laptop is warm.
  - The porthole stays hidden until the carnet is read.
  - Finding him, pulling the tail (hiss), undoing the buckle: the bag art swaps and Kūro sits on it.
  - The early keys disappear, then the end card.
- **Reload mid-run:** it resumes with its flags and 3 lessons.
- **On finish:**
  - `numidea-save` holds `ep` + `world.kuro_in_bag`.
  - The progress key is cleared.
  - Focus moves to the end heading.
- **Replay:** no second Encre, and missed lessons are shown.
- **Phone 390 px, Arabic, reduced motion, keyboard only:**
  - RTL works.
  - No horizontal overflow.
  - It plays to the end with Tab and Enter.
  - No animations run.
- **Phone, French:** switching to EN keeps the state and the selected object.
- **CSP:** zero console or CSP errors under a stricter policy than the site's (`script-src 'self'`, `style-src 'self'`).

**Not tested:**
- Safari, Firefox, and a real phone.
- A real screen reader. The live region and button names are built for one, but nobody has listened.
- The Arabic wording by a native reader.
- Whether it's fun: the "three people" test from the pitch still has to happen.
- The ChatGPT prototype is still unread. This episode was written from the pitch, not from that file.
