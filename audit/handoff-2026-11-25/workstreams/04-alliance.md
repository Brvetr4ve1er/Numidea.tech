# 04 · Alliance Travel brand package

Thread: "Upgrade Alliance Travel brand package". **Status (2026-11-26, 00:10 UTC): done on this side and handed off.** Nothing here was published. Merging and publishing belong to the publishing session.

## Site code: draft PR #18, branch `claude/project-thread-j3qmb0` @ 8874067
| commit | what |
|---|---|
| 2c50a22 | Old Alliance link change. Redundant now that the trunk has wave 3; the merge kept the trunk's side. |
| 1acd819 | Case page in five chapters, mockups, and the brand book at `/hub/brand/alliance/`. |
| 626ec43 | Arabic font fix. |
| f328fdc | Social kit: two case tiles, plus the "Le kit réseaux" row on plate 14. |
| cdf9c57 | **Merge of trunk f32a749.** Conflicts went to the trunk side, and the brand-book `book:` link in scene-data was kept. Cache-bust stamps bumped, asset budget +736,057. |
| 8874067 | **2D + 3D (owner said yes):** two case tiles, the eight inked destinations and the 3D scene. New plate 15 "Illustration & 3D" in the book, so the page now says 15 plates. Budget +118,891. |

- **Gates:** `node scripts/check.mjs` passes with 0 failures after two builds with no diff. Full `npm run verify` was not re-run after the merge. The last full audit was 139/141 on 2026-11-24, and both failures were in WorkspaceHQ, which trunk PR 23 has since fixed. **The publishing session should run `npm run verify` before merging.**
- **Preview (branch alias, follows the latest push):** https://numidea-tech-git-claude-project-0caf1a-br4vetravelers-projects.vercel.app/hub/brand/alliance/
- **PR base:** the trunk `claude/numidea-labs-landing-c4jokc`. Never `main`.
- **Honest flags:**
  - The 2023 charter credits another designer, so the book says it "builds on" that charter.
  - The Arabic needs a native reader.
  - The 6 earlier case mockups (stationery, boarding pass, reception wall, bus shelter, fair booth, suitcase) came from Magnific on 11-24, before the zero-credit rule. The 400-credit figure is unverified.

## Asset files: `/mnt/project-files/alliance-brand/` (zero credits, made in code)
- `social/`: 12 PNGs.
  - Posts: Bali, Istanbul, Kuala Lumpur, Vietnam, signature.
  - Carousel checklist 1–3.
  - Story poll, highlight covers, Facebook cover, Instagram grid.
- `illustrations/`: 8 inked destinations (v2) and `planche-destinations.png`; `v1/` is kept.
- `3d/`: the suitcase scene, 6 objects (suitcase, passport, ticket, plane, pin, cloud) and their sheet. These are three.js renders, a step simpler than the owner's clay reference.
- `murmuration/` (**new**): a vanilla-JS port of the owner's React MurmurationWordmark in the Alliance palette.
  - `murmuration.js`: the module.
  - `demo.html`: two elements. A navy hero cycles through Bali, Vietnam, Istanbul and Tunisie over the charter's dashed flight path. A sand closing band spells "Partez.".
  - `README.md` and `previews/`.
  - **Not wired into any site.** alliancetravel.app's repo isn't in this project's scope.
  - The Numidea hub forbids infinite motion (check.mjs), so it can't go on the hub as-is. It would need an exemption or a "N cycles then rest" mode.
- `src/`: sources to regenerate everything.
  - `social/kit.html` + `render.cjs`.
  - `illustrations/marks*.html` + `emarks.cjs`.
  - `3d/scene.js`, `index.html`, `shoot.cjs`, `package.json`.
  - `canvas/project/*`.
- Techniques: memory `zero-credit-assets.md`.

## Claude Design canvas
https://claude.ai/artifact/EqY2khQ5dVTLA4DtvQQ2NS
- **Live boards (3):** Main (tote, cap, mug, passport cover, luggage tag), Post-Bali, Post-Vietnam.
- **Empty frames (4):** Carousel-1, Carousel-2, Story, Cover. The canvas publish was blocked twice by the safety check. Their content exists as PNGs in `social/`, and the board sources are in `src/canvas/project/`.

## Open items for the publishing session
1. Run `npm run verify` on PR #18, review the preview, then merge it into the trunk.
2. Get a native Arabic read of the new strings (`hub/src/cases/alliance.i18n.json`, keys `x.*`/`alt.*`).
3. Optionally put the murmuration hero on alliancetravel.app.
