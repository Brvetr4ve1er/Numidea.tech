# Index: PRs, branches, previews, canvases, docs, assets

Snapshot 2026-11-25 23:45 UTC. [V] = verified here, [R] = reported by a thread.

## Repo: Brvetr4ve1er/Numidea.tech

### PRs [V] (00:20 UTC: #26, #24 and #20 are MERGED into the trunk, head 44e082a; open: #18, #14, #27)

| PR | Branch @ head | Title | Workstream |
|---|---|---|---|
| [#26](https://github.com/Brvetr4ve1er/Numidea.tech/pull/26) | `claude/project-thread-r84igh` @ cbe6e8b | RELEASE.md: the one-trunk rule | 01 release |
| [#24](https://github.com/Brvetr4ve1er/Numidea.tech/pull/24) | `claude/project-thread-ogl5jr` @ 5ecaa7b | Lantern shelf: 3D hardcovers + type system | 02 typography |
| [#20](https://github.com/Brvetr4ve1er/Numidea.tech/pull/20) | `claude/project-thread-vm2rxf` @ 17b86e3 | Characters C1–C3 | 03 characters |
| [#18](https://github.com/Brvetr4ve1er/Numidea.tech/pull/18) | `claude/project-thread-j3qmb0` @ 8874067 | Alliance Travel case + brand book (adding 2D+3D assets now) | 04 Alliance |
| [#14](https://github.com/Brvetr4ve1er/Numidea.tech/pull/14) | `claude/project-thread-a0zy0f` @ dc26b39 | Online banking course, slice 1 | **parked** until the RPG game loop spec (owner, 2026-11-26) |
| [#27](https://github.com/Brvetr4ve1er/Numidea.tech/pull/27) | `claude/project-thread-n0kxe1` @ ae7247e | docs only, under `audit/handoff-2026-11-25/` | 00 |

### Merged or closed in this project [R]

- Merged and live: #19 (aesthetics), #22 (analytics), #23 (WorkspaceHQ CSP fix).
- Closed: #17 (duplicate of wave 3's Alliance link), #21 (bot duplicate of #22), #15 (social assets targeting `main`), #16 and #11 (Dependabot, Playwright clash).

### Branches

- Trunk: `claude/numidea-labs-landing-c4jokc` @ **44e082a** (00:14 UTC) [V]. Live is still f32a749. Trunk preview: https://numidea-tech-k8ucxpo9i-br4vetravelers-projects.vercel.app
- Keep: the PR branches above, `claude/project-thread-3x5f4n` (social files), `social-media-cmf2a` (Postiz media).
- Delete via script (after the Vercel setting): `main`, `master`, `claude/fix-fleets-wip`, `claude/wave2-release`, `claude/alliance-release`, `claude/alliance-real-domain`, `claude/project-thread-5rclm4`, `claude/project-thread-yirj4x`, `vercel/install-vercel-web-analytics-i-uj1ar9`, the dependabot dev-dependencies branch. Per-branch unmerged counts are in the script header.

### Previews [R]

- PR #24 (branch alias): https://numidea-tech-git-claude-project-54438a-br4vetravelers-projects.vercel.app/hub/lanterne/#rayons
- PR #18 brand book, plate 15 (2D+3D): https://numidea-tech-git-claude-project-0caf1a-br4vetravelers-projects.vercel.app/hub/brand/alliance/#p15
- Other PR previews: open the PR's Vercel check.

## Claude artifacts (private to the owner's account) [V listed]

| Link | What |
|---|---|
| https://claude.ai/artifact/8dwp6X1pUjckGmv6LUWybA | Claude Design canvas "Yasser paper rig · 3D prototype". Boards: Main (three.js paper-rig turntable), `#artboard-Talk` (Talk to him v4), `#artboard-Menu` (Intro and navigation menu v2). Sources copied in `characters/canvas-src/`. |
| https://claude.ai/artifact/QqmYWdH7JKc2BG7oF7xt8M | RPG game loop spec (Claude Doc): Encre currency, 10 ranks, reward card, commissions; 3 open owner questions |
| https://claude.ai/artifact/BrvX62HC49TTPheF3Yiwhw | Numidea type system (spec) |
| https://claude.ai/artifact/JSfpN8TEdBE4s6jpwue4cX | Pop-up scenes: the motion rules |
| https://claude.ai/artifact/AMyLWoFbM8KFPHGnL2BwA5 | Characters & mascot: audit and plan |
| https://claude.ai/artifact/EqY2khQ5dVTLA4DtvQQ2NS | Alliance Travel · réseaux & objets (canvas) |

## Project files (/mnt/project-files/, Claude project shared folder)

| Folder | What |
|---|---|
| `handoff/` | this package |
| `ops/` | `release-audit-2026-11-25.md` (full branch/PR audit with hand-off section), `delete-dead-branches.sh` |
| `aesthetics/` | `HANDOFF.md` (typography thread's own notes), screenshots: `tree-v1-*`, `tree-v2-*`, `b2-*`, `b4-*`, `books-3d-*`, `type-shelf-*` |
| `characters/STATE.md` | characters thread's own current-state notes |
| `characters/kit/` (repo copy: `files/character-kit/`) | **character kit**: `art/` (95 WebPs), `manifest.json`, `kit.json` (24 actions, 12 reactions, 24 scenes), `kit.js` + `kit.css` (2.8 KB gz player), README (wiring), MISSING.md (ranked gaps → unrun Magnific generators), `generators.json`, `build.py`/`data.py`, `qa/`. Not integrated. |
| `characters/site-menu/` (repo copy: `files/site-menu/`) | **site-ready intro + navigation menu**: `index.html` preview, `menu.html` markup, `menu.css` (motion tokens at top), `menu.js`, `img/` (20 WebPs), `fonts/` (Archivo 900, Noto Sans JP subset), `qa/` (shots + Playwright scripts), README with motion spec and integration steps. Not integrated. |
| `characters/bible-clean/` | 25 bible frames with paper halos removed + rig frames (blink, talk a/b), turnaround. **The site still ships the old haloed frames**: swap these into PR #20 |
| `characters/new-props/cut-v2/` | clean prop cut-outs (satchel, laptop, sketchbook, fineliner, boxes, headphones, scooter, server rack, hairsticks, tarot, masters). `raw/`, `cut/` are older |
| `characters/site-ready/` | turnaround WebPs + kuro-scale used by PR #20, README |
| `characters/magnific-import/` | 254 WebPs cut from 31 "Character Bible v2" sheets, 1024 px (2K blocked: allow `pikaso.cdnpk.net` to fetch originals). Also `magnific-cuts-2026-11-24.zip` |
| `characters/canvas-src/` | `Main.dc.html`, `Talk.dc.html`, `Menu.dc.html`, `canvas.json` |
| `characters/board-v3/`, `board-menu/` | proof sheets of the Talk and Menu boards |
| `characters/tools/` | matting (`matte.py`, `refine.py`, `comps.py`, `recut.py`, `holes.py`, `dehalo.py`, `propcut.py`), `board-render.cjs` (local canvas renderer), `menu-render-gen.cjs` |
| `characters/model-drift.jpg`, `c1-before-after.jpg` | continuity evidence |
| `alliance-brand/social/` | Instagram/Facebook kit: posts, carousel, stories, highlights, cover, grid |
| `alliance-brand/illustrations/` | 8 hand-inked destination drawings v2 (+ `v1/`), board `planche-destinations.png` |
| `alliance-brand/murmuration/` (repo copy, code only: `files/murmuration/`) | flock wordmark (vanilla JS port of the owner's React snippet): `murmuration.js`, `demo.html`, `previews/`, README with options. Not wired into any site |
| `alliance-brand/3d/` | code-rendered 3D: hero scene + 6 objects (transparent PNG) |
| `uploads/hearth/` | owner uploads (references), named by id |

## Other places

- Magnific space "Numidea" (`a32d1daa-…`): page "Rig frames · Yasser & Kūro", 28 generators queued, not run. Magnific project "Alliance Travel · brand package": 8 mockups (6 used in PR 18).
- Vercel project settings: https://vercel.com/br4vetravelers-projects/numidea-tech/settings/environments
- Live Lanterne: https://www.numedialab.dev/hub/lanterne/
