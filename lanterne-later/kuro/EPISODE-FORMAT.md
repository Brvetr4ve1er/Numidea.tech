# Episode format (v1)

An episode is **one JSON file**. The engine (`episode.js`) contains no story, so episode 2 means a new JSON and nothing else. Every visible string is `{fr, en, ar}`, and French is the fallback.

## The episode template: a writing checklist

1. **One ordinary moment.** Closing time, one task, one thing missing. It should fit in 3 to 5 minutes.
2. **Five or six objects.** One is the answer, and one or two are red herrings that still teach something.
3. **Three or four lessons, one per object.** Each lesson is something the studio actually does: design, delivery, debugging, fixing, business. State it as a sentence someone could repeat to a colleague.
4. **Two conditions on the path.** For example, the porthole only appears after the carnet is read. This makes the clue matter, and it keeps the solution path short (4 to 5 actions).
5. **One wrong turn per object.** Each wrong turn gets its own reaction and its own line, never a generic "nope". A wrong turn may teach the lesson too, as reopening the parcel does.
6. **One premature ending.** Something like keys too early gives the facepalm and a way back. Never a dead end, never a timer.
7. **One change to the world.** One flag the hub reads afterwards, which the visitor caused.
8. **Write French first,** then EN and AR. Run `tools/script-md.py` and read the script out loud.

## Schema

```jsonc
{
  "v": 1,
  "id": "ep02-serveur-qui-fume",        // also the save key and the URL step prefix
  "n": 2,
  "title":  {fr, en, ar},
  "kicker": {fr, en, ar},
  "reward": { "encre": 100, "world": { "<flag>": true } },   // Encre is informational: the game loop derives it
  "start":  { "pose": "<art>", "face": "<art>", "mark": "?", "line": {fr, en, ar} },
  "hotspots": [
    {
      "id": "laptop",
      "art": "laptop-closed",           // file in art/ without .webp; null = no scene image (Yasser is built in)
      "name": {fr, en, ar},             // the button's accessible name, shown under the object
      "at":       { "x": 4, "y": 60, "w": 20 },   // % of the 16:9 room (left, top, width)
      "atNarrow": { "x": 4, "y": 35, "w": 42 },   // % of the 3:4 phone room
      "actions": [
        {
          "id": "touch",
          "label": {fr, en, ar},
          "when":   ["flag"],            // all must be set to show the action
          "unless": ["flag"],            // any set hides it
          "set":    ["flag"],            // flags this action sets (each new flag is a tracked step)
          "swap":   "satchel-open",      // optional: new art for this hotspot
          "pose": "facepalm", "face": "focus", "kuro": "love", "mark": "!",   // the reaction
          "lesson": "last-known",        // optional: id from lessons[]
          "wrong": true,                 // optional: counts as a wrong turn in the metrics
          "end": true,                   // optional: finishes the episode
          "line": {fr, en, ar}           // *word* renders as emphasis
        }
      ]
    }
  ],
  "lessons": [ { "id": "last-known", "tag": {fr, en, ar}, "text": {fr, en, ar} } ],
  "end": { "pose": "handover", "title": {fr, en, ar}, "line": {fr, en, ar}, "hub": {fr, en, ar} }
}
```

**Art names** are files in the episode's `art/` folder:
- poses and faces by their kit name;
- Kūro as `kuro-<reaction>`.

**Marks** are the kit's set: ♪ ! ? … ✦ ✱ ✱✱ !!

**Rules the engine enforces:**
- It shows an action only when its conditions hold.
- It awards a lesson once.
- It counts a wrong turn as a tracked step.
- It saves after every action.
- It ends on the first `end` action.

**Rules the writer keeps:**
- Every flag in a `when` must be settable by some action.
- Every lesson must be reachable.
- The `end` action must be reachable.

A small validator for these three is the next useful tool. It isn't written yet.
