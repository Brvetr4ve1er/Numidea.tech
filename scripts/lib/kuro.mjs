/**
 * Kūro's episodes (hub/lanterne/kuro.html, 2026-11-27): « Le dernier départ », the point-and-click episode written in
 * lanterne-later/kuro/ (PR #29), brought onto the site as a Librairie page so that finishing it counts: the page loads
 * hub/game.js, the episode calls NUMIDEA_GAME.episodeDone(id, world) (+pts.episode Encre, world.kuro_in_bag) and the
 * game's card says so.
 *
 * Where things live:
 *   hub/kuro/<id>.json        an episode (format: lanterne-later/kuro/EPISODE-FORMAT.md), all its words in FR/EN/AR
 *   hub/episode.js            the player; hub/css/episode.css its sheet, scoped to .ep
 *   hub/img/<art>.webp        the scene's objects (hub/img/kuro/, the scooter from the Librairie's kit); the characters are the site's own art (hub/bible/art/face-*,
 *                             pose-*, kuro-*), the same drawings as the kit's
 *   lant.kuro.*               the page's own words (title, description, mast, lead, no-script line)
 *
 * This module checks the episode against what the player draws (every picture it names is a file, every language is
 * there) and returns the page. Called by scripts/lib/lanterne.mjs with its helpers.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export const KURO_EP = 'ep01-dernier-depart';

export function kuro(h) {
  const { HUB, DICT, LANGS, fail, json, need, headFor, swap, menu, motionBtn, langSwitch, scripts, WA, TOOLS, WM, stFoot, gameBlock, enqMenu } = h;
  const file = join(HUB, 'kuro', KURO_EP + '.json');
  if (!existsSync(file)) return null;
  const E = json(file);
  const at = `hub/kuro/${KURO_EP}.json`;
  if (E.id !== KURO_EP) fail(`${at}: its id is « ${E.id} », the file says ${KURO_EP}`);
  if (!/^[a-z0-9-]{1,40}$/.test(E.id)) fail(`${at}: the id must match the save's ep keys (a-z, 0-9, -)`);
  for (const k of Object.keys((E.reward && E.reward.world) || {})) if (!/^[a-z0-9_]{1,40}$/.test(k)) fail(`${at}: the world flag « ${k} » is not a save key`);
  /* every picture the player will ask for */
  const pics = new Set(), objs = new Set();
  const walk = (o) => {
    if (Array.isArray(o)) return o.forEach(walk);
    if (!o || typeof o !== 'object') return;
    if (typeof o.pose === 'string') pics.add('pose-' + o.pose);
    if (typeof o.face === 'string') pics.add('face-' + o.face);
    if (typeof o.kuro === 'string') pics.add('kuro-' + o.kuro);
    if (typeof o.art === 'string') objs.add(o.art);
    if (typeof o.swap === 'string') objs.add(o.swap);
    Object.values(o).forEach(walk);
  };
  walk(E); pics.add('kuro-loaf');
  for (const p of pics) if (!existsSync(join(HUB, 'bible', 'art', p + '.webp'))) fail(`${at}: the character drawing hub/bible/art/${p}.webp is not a file`);
  for (const p of objs) if (!/^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(p) || !existsSync(join(HUB, 'img', p + '.webp'))) fail(`${at}: the object hub/img/${p}.webp is not a file`);
  /* every language of every line */
  const lines = (o, path) => {
    if (Array.isArray(o)) return o.forEach((x, i) => lines(x, `${path}[${i}]`));
    if (!o || typeof o !== 'object') return;
    if ('fr' in o && typeof o.fr === 'string') { for (const l of LANGS) if (typeof o[l] !== 'string' || !o[l].trim()) fail(`${at}: ${path} has no ${l} line`); return; }
    for (const [k, v] of Object.entries(o)) lines(v, path ? `${path}.${k}` : k);
  };
  lines(E, '');
  const k = (s) => need(`lant.kuro.${s}`, 'the Kūro episode page');
  for (const s of ["title", "desc", "mast", "lead", "noscript", "skip"]) k(s);

  const page = 'kuro';
  let head = headFor('kuro.html', 'lant.kuro', page, [['La Librairie Lanterne', ''], [DICT.fr['lant.kuro.mast'], 'kuro.html']]);
  head = swap(head, '<link rel="stylesheet" href="../css/lanterne.css?v={{stamp}}">', '<link rel="stylesheet" href="../css/lanterne.css?v={{stamp}}">\n<link rel="stylesheet" href="../css/episode.css?v={{stamp}}">', 1, "the episode's sheet");
  const links = JSON.stringify({ back: './', tarifs: '../../tarifs/', contact: '../../#contact' });
  const html = `${head}
<body class="lt lt-kuro">
<a class="skip" href="#main" data-i18n="lant.kuro.skip"></a>
<header class="mast lt-wrap">
  ${WM}
  <a class="mast__back" href="./" data-i18n="lant.ui.library"></a>
  <p class="mast__title" data-i18n="lant.kuro.mast"></p>
  ${motionBtn(' mast__motion')}
  ${langSwitch()}
  ${menu([['./', 'lant.ui.library'], ...(TOOLS ? [['outils.html', 'lant.tools.mast']] : []), ...enqMenu.filter(([f]) => f !== 'kuro.html'), ['./#comptoir', 'lant.shelf.cta'], [WA, 'lant.ui.wa'], ['../', 'lant.ui.studio']], true)}
</header>
<main id="main" class="lt-wrap" tabindex="-1">
  <h1 class="sr" data-i18n="lant.kuro.mast"></h1>
  <p class="lt-kuro__lead" data-i18n="lant.kuro.lead"></p>
  <!-- the episode's stage: hub/episode.js draws it from hub/kuro/${KURO_EP}.json with textContent only; the mast above
       carries the way back and the language (data-shell) -->
  <div id="ep" class="ep" data-src="../kuro/${KURO_EP}.json" data-art="../img/" data-kit="../bible/art/" data-shell data-links='${links}'>
    <noscript><p data-i18n="lant.kuro.noscript"></p></noscript>
  </div>
</main>
${stFoot('')}
<!-- hub/lanterne.js reads #lant-data for the page's kind: an empty tools list keeps it to the mast, the menu and the words -->
<script type="application/json" id="lant-data">{"tools":[]}</script>${gameBlock('./#passeport')}
${scripts(['../lanterne.js', '../game.js', '../episode.js', '../../assets/carry.js'])}
</body>
</html>
`;
  const runtime = new Set(Object.keys(DICT.fr).filter((key) => /^lant\.ui\.game\./.test(key)));
  return { out: { file: 'hub/lanterne/kuro.html', name: 'lanterne/kuro.html', page, html }, runtime, mast: [['kuro.html', 'lant.kuro.mast']] };
}
