# lanterne-later/ (not published)

Kept for a later pass, out of the published set (scripts/site.mjs NOT_DEPLOYED), on the owner's decision L9 of 2026-11-21
(the Librairie Lanterne: volume 2 of « Le web3, sans fumée » ships later; the shelf shows it « bientôt », with no link).

- `web3-modules/chapters.html`: the nine module chapters (33 stops), cut verbatim from hub/src/manuel.html.
- `web3-modules/web3x.js`: their labs (was hub/web3x.js).
- `web3-modules/img/studio/web3c/mod-1…9(-640).webp`: the module headers (were hub/img/studio/web3c/).
- `web3-modules/i18n/{fr,en,ar}.json`: their strings, the `web3c.mods`, `.x`, `.chap`, `.carnet` and `.deeper` subtrees (were in hub/src/i18n).

To publish: move each back, write hub/src/lanterne/atlases/web3-modules.json (SPEC §4.4), put the book on the shelf, and have
web3x.js dispatch `numidea:exercise {atlas:'web3-modules', id, done:true}` at each lab's end state (SPEC §3.6).
