# lanterne-later/ (not published)

Kept out of the published set (scripts/site.mjs NOT_DEPLOYED). It held volume 2 of « Le web3, sans fumée » (the nine
modules, 33 stops) while the Librairie Lanterne shipped without it (owner decision L9 of 2026-11-21).

**Published on 2026-11-22** (owner decision: publish the nine modules) as the Librairie atlas « web3-modules »
(`hub/lanterne/web3-modules.html`, lantern/SPEC.md §4.4). What it held went back where it lives:

- `web3x.js` (the labs) → `hub/web3x.js`, loaded by `hub/lanterne.js` when an exercise comes near; each lab now reports
  its end state as `numidea:exercise {atlas:'web3-modules', id, done:true}`.
- `img/studio/web3c/mod-1…9(-640).webp` (the module headers) → `hub/img/studio/web3c/`, the atlas's act plates.
- `i18n/{fr,en,ar}.json` (`web3c.mods`, `.x`, `.chap`, `.carnet`, `.deeper`) → merged back into `hub/src/i18n`.
- `chapters.html` was cut into `hub/src/lanterne/ex/web3-modules/` (each stop's lab, misconception card and references;
  each module's head, closing lines, bridge and questions for the vendor; the nine source lists).

Only `web3-modules/chapters.html`, the verbatim record of the old manual's markup, is left here. Nothing reads it any
more: the folder can go whenever the integrator removes it.
