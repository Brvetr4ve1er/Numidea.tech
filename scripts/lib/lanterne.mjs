/**
 * La Librairie Lanterne (hub/lanterne/, 2026-11-21, scratchpad lantern/SPEC.md): the pages scripts/build-hub.mjs
 * writes for the learning side, from hub/src/lanterne/:
 *
 *   shelf.html               the shelf's body (the mast, the books, the passport, the radio, the night round, the
 *                            counter, the way back, the footer); its {{lant.*}} holes are written here
 *   shelf.json               the books on their three shelves (a book is published once its atlas file exists)
 *   art.json                 one file per drawing, its natural size, the cast each plate paints
 *   atlases/<slug>.json      one atlas: its acts, its districts (guide, diorama slots, the right answer's index,
 *                            the exercise kind, the keepsake), never copy: copy is in hub/src/i18n under
 *                            lant.at.<key>.* (a district's or an atlas's key may name an existing key instead,
 *                            through its "keys" map)
 *   apps.json                « La boîte à outils » (2026-11-22): the apps, their plain official address, the owner's
 *                            partner URL (ref, empty until he joins a programme), the regions where it is never shown;
 *                            built into hub/lanterne/outils.html (copy under lant.tools.*), partner links put on by
 *                            hub/lanterne.js after the region check only, so no partner link is ever in the markup
 *   enquetes.json            « Les enquêtes de nuit » (2026-11-23): the night stall as a game (the painting's rings, the
 *                            season's rows, the cases' steps and their returns, the sources), never copy: copy is under
 *                            lant.enq.*; checked and built into hub/lanterne/enquetes.html by scripts/lib/enquetes.mjs,
 *                            played by hub/enquetes.js
 *   ex/<slug>/<id>.html      a district's exercise markup (the courses' existing labs, cut verbatim), set in its
 *                            board; without one, the board is the kit's (hub/lanterne.js) or its resting line
 *   ex/<slug>/_<slot>.html   an atlas's own blocks: _hero (under the hero, on paper: the legal lines), _sac (the set's
 *                            reward, inside the sac), _sources (the references), _end (before the footer); and per act
 *                            (web3 vol. 2, 2026-11-22): _act-<act> (its head, above its districts), _actfoot-<act> (its
 *                            closing lines, below them), _jact-<act> (after its notes in the journal), _journal (after the
 *                            journal's notes)
 *
 * and hub/manuel.html, the old manual's address, as a forwarding stub (§1.4). The pages share the Studio's head
 * (re-addressed, a level down), its sheet and faces, plus hub/css/lanterne.css and hub/lanterne.js; the shelf adds
 * hub/app.js (the counter's prices in the page's language), hub/radio.js and hub/life.js; an atlas adds hub/radio.js
 * (the chip) and hub/app.js only when its exercises are bound there ("app": true).
 *
 * Refused (the build fails and says where), as the prototype's tools/build.mjs did: an atlas whose districts are not
 * its book's, a district without its keys in French or with other than three answers, a right answer out of range or
 * the answers in a 0,1,2 cycle, an unknown cut-out, a cut-out of a character its plate already paints (new pairings;
 * an atlas marked asDrawn keeps the owner's compositions, L13), two consecutive districts with the same diorama, a
 * drawing used for two keepsakes, an exercise kind not registered, a count typed in a template line. Key parity
 * (FR, EN, AR; AR plural sets complete) is build-hub.mjs's own gate.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { AYN } from './ayn.mjs';
import { enquetes } from './enquetes.mjs';

const W3M_KEYS = /^web3c\.(mods|x|chap|carnet)\./;
const KIT = ['compose', 'observe', 'focus', 'scrub', 'ab', 'machineLaunch', 'machineAsh', 'funnel', 'toggles', 'path'];
const BOUND = /^(pick|calc:(rate|treso|funnel|quote|zones|week|fee)|fiche|bins|flow|law|states|marktest|web3x:[a-z0-9]+)$/;
const WA = 'https://wa.me/213672412578';
const DISTRICT_KEYS = ['name', 'sub', 'alt', 'lore', 'rule', 'q', 'keep', 'scene', 'handoff', 'decision', 'ex.t', 'ex.brief'];
const ATLAS_KEYS = ['title1', 'title2', 'kicker', 'pitch', 'caseLabel', 'search', 'desc', 'coverAlt', 'conclusion'];

export function lanterne(ctx) {
  const { HUB, SRC, DICT, LANGS, fail, notes, esc, pageSrc, headEnd, swap, RADIO, RUNTIME_OLD } = ctx;
  const LS = join(SRC, 'lanterne');
  const json = (f) => { try { return JSON.parse(readFileSync(f, 'utf8')); } catch (e) { fail(`${f.slice(f.indexOf('hub/'))}: ${e.message}`); return null; } };
  /* strings awaiting the dictionaries (hub/src/lanterne/pending-i18n.json, 2026-11-24): used only while a key is missing */
  if (existsSync(join(LS, 'pending-i18n.json'))) {
    const miss = [];
    for (const r of (json(join(LS, 'pending-i18n.json')) || {}).keys || []) for (const l of LANGS) {
      const v = r[l], forms = v && typeof v === 'object' ? Object.entries(v).map(([c, x]) => [`${r.key}.${c}`, x]) : [[r.key, v]];
      for (const [k, x] of forms) if (DICT[l][k] == null && x != null) { DICT[l][k] = x; if (l === 'fr') miss.push(k); }
      /* French and English take their .other for the Arabic-only plural forms, as build-hub.mjs does for the dictionaries */
      for (const c of ['zero', 'two', 'few', 'many']) if (v && typeof v === 'object' && DICT[l][`${r.key}.${c}`] == null) DICT[l][`${r.key}.${c}`] = DICT[l][`${r.key}.other`];
    }
    if (miss.length) notes.push(`the Librairie: ${miss.length} strings from hub/src/lanterne/pending-i18n.json, not yet in hub/src/i18n (${miss.slice(0, 4).join(', ')}${miss.length > 4 ? ', …' : ''})`);
  }
  const ART = json(join(LS, 'art.json')), SHELF = json(join(LS, 'shelf.json'));
  if (!ART || !SHELF) return null;
  const books = SHELF.shelves.flatMap((s) => s.books);
  const ATLAS = {};
  for (const b of books) { const f = join(LS, 'atlases', `${b.slug}.json`); if (existsSync(f)) ATLAS[b.slug] = json(f); }
  for (const f of existsSync(join(LS, 'atlases')) ? readdirSync(join(LS, 'atlases')) : [])
    if (!books.some((b) => `${b.slug}.json` === f)) notes.push(`hub/src/lanterne/atlases/${f}: on no shelf, not built (volume 2 waits for its own pass, L9)`);
  const live = books.filter((b) => ATLAS[b.slug]);
  /* the toolbox's registry (hub/src/lanterne/apps.json): checked here, its page built after the shelf */
  const TOOLS = existsSync(join(LS, 'apps.json')) ? json(join(LS, 'apps.json')) : null;
  /* « Les enquêtes de nuit » (2026-11-23): the night stall as a game, built after the toolbox once its data file exists (scripts/lib/enquetes.mjs) */
  const ENQ = existsSync(join(LS, 'enquetes.json'));
  const enqMenu = ENQ ? [['enquetes.html', 'lant.enq.mast']] : [];
  const toolIds = new Set(TOOLS ? [...TOOLS.categories.map((c) => 'tl-' + c.id), ...TOOLS.apps.map((a) => 'tl-app-' + a.id)] : []);
  for (const b of books) if (!ATLAS[b.slug]) notes.push(`the Librairie: « ${b.slug} » has no atlas file yet (hub/src/lanterne/atlases/${b.slug}.json): its book reads « bientôt »`);
  const fr = (k) => DICT.fr[k];
  const need = (k, where) => { if (fr(k) == null) fail(`the Librairie, ${where}: no key ${k} in hub/src/i18n/fr.json`); return k; };
  const pre = (p) => (u) => (/^(https?:|#|\.\.\/|mailto:)/.test(u) ? u : p + u);
  const up = pre('../');

  /* ---------------- keys an atlas names ---------------- */
  const ak = (A, f) => (A.keys && A.keys[f]) || `lant.at.${A.key}.${f}`;
  const dk = (A, id, f) => { const o = A.districts[id].keys || {}; return o[f] || `lant.at.${A.key}.d.${id}.${f}`; };
  const ansK = (A, id, f, j) => `${dk(A, id, f)}.${j}`;
  // a district's per-answer lines: lant.at.<key>.d.<id>.f.<j>, or the course's own three keys in answer order
  // ("f": [no.0, ok, no.1] in its keys map: the client courses wrote one line per answer, SPEC §4 [WT])
  const fK = (A, id, j) => { const o = (A.districts[id].keys || {}).f; return Array.isArray(o) ? o[j] : ansK(A, id, 'f', j); };

  /* ---------------- art ---------------- */
  const plateOf = (A, id) => { const d = A.districts[id], act = A.acts.find((a) => a.districts.includes(id)); return d.plate || act.plate; };
  const actOfA = (A, id) => A.acts.find((a) => a.districts.includes(id));
  /* a keepsake "seal": the act's seal, a glyph (web3 vol. 2: the module's seal in the carnet, web3x X10), not a drawing */
  const sealOf = (A, id) => (A.districts[id].keep === 'seal' ? actOfA(A, id).seal : null);
  const ksOf = (A, id) => {
    const d = A.districts[id];
    if (d.keep === 'seal') return null;
    if (d.keep === 'plate') return ART.plates[plateOf(A, id)] && ART.plates[plateOf(A, id)].src;
    if (ART.cut[d.keep]) return ART.cut[d.keep].src;
    if (/^img\//.test(d.keep || '') && existsSync(join(HUB, d.keep))) return d.keep;
    return null;
  };
  /* a keepsake shows at 72 px at most (the grid; 48 in the dossier, 60 in the passport): a drawing with a -240 file beside it
     (the money set's ls-*, 480 px) serves that one, the 480 px one only to a 2x screen */
  const ksSmall = (src) => { const s = src && src.replace(/\.webp$/, '-240.webp'); return s && s !== src && existsSync(join(HUB, s)) ? s : null; };
  const ksAttrs = (A, id, sz) => { const src = ksOf(A, id), sm = ksSmall(src); return sm ? `src="${up(src)}" srcset="${up(sm)} 240w, ${up(src)} 480w" sizes="${sz}px" width="480" height="480"` : `src="${up(src)}"`; };
  const ksImg = (A, id, sz) => (sealOf(A, id) ? `<span class="ks__seal" lang="ja" aria-hidden="true">${sealOf(A, id)}</span>` : `<img ${ksAttrs(A, id, sz)} alt="" loading="lazy">`);

  /* ---------------- checks, atlas by atlas ---------------- */
  for (const b of live) {
    const A = ATLAS[b.slug], at = `hub/src/lanterne/atlases/${b.slug}.json`;
    if (A.slug !== b.slug) fail(`${at}: slug "${A.slug}" is not the book's "${b.slug}"`);
    const ids = A.acts.flatMap((a) => a.districts);
    if (ids.join() !== b.ids.join()) fail(`${at}: its districts (${ids.join(' ')}) are not the book's in hub/src/lanterne/shelf.json (${b.ids.join(' ')})`);
    for (const f of ATLAS_KEYS) need(ak(A, f), `${at}`);
    for (const a of A.acts) { need(ak(A, `act.${a.id}`), at); need(ak(A, `actShort.${a.id}`), at); if (a.plate && !ART.plates[a.plate]) fail(`${at}: act ${a.id}'s plate "${a.plate}" is not in art.json`); }
    const kept = new Map();
    ids.forEach((id, i) => {
      if (A.districts[id] && A.districts[id].icon && !existsSync(join(HUB, A.districts[id].icon))) fail(`${at}: ${id}'s list icon ${A.districts[id].icon} is not a file under hub/`);
      const d = A.districts[id];
      if (!d) { fail(`${at}: district ${id} has no data`); return; }
      for (const f of DISTRICT_KEYS) need(dk(A, id, f), `${at} ${id}`);
      if (d.done && !/^((touch|seen:[^|]+|sel:[^|]+|text:[^|]+|vis:[^|]+|range:\d+)(\||$))+$/.test(d.done)) fail(`${at} ${id}: done "${d.done}" is not a known condition (touch, seen:, sel:, text:, vis:, range:)`);
      for (let j = 0; j < 3; j++) { need(ansK(A, id, 'a', j), `${at} ${id}`); need(fK(A, id, j), `${at} ${id}`); }
      if (Array.isArray((d.keys || {}).f) && !/\.ok$/.test(d.keys.f[d.right])) fail(`${at} ${id}: the right answer's line (${d.keys.f[d.right]}) is not the course's ok line`);
      if (fr(ansK(A, id, 'a', 3)) != null) fail(`${at} ${id}: more than three answers`);
      if (!(d.right >= 0 && d.right <= 2)) fail(`${at} ${id}: no right answer (right is 0, 1 or 2)`);
      if (!KIT.includes(d.ex) && !BOUND.test(d.ex || '')) fail(`${at} ${id}: exercise kind "${d.ex}" is not registered (SPEC §3.6)`);
      if (!KIT.includes(d.ex) && !existsSync(join(LS, 'ex', b.slug, `${id}.html`))) notes.push(`the Librairie, ${b.slug} ${id}: its ${d.ex} exercise has no markup yet (hub/src/lanterne/ex/${b.slug}/${id}.html)`);
      const pl = ART.plates[plateOf(A, id)];
      if (!pl) { fail(`${at} ${id}: plate "${plateOf(A, id)}" is not in art.json`); return; }
      for (const slot of ['lead', 'companion', 'prop']) {
        const c = d[slot]; if (!c) continue;
        if (!ART.cut[c]) { fail(`${at} ${id}: unknown cut-out "${c}"`); continue; }
        if (pl.wide && slot === 'prop') fail(`${at} ${id}: a wide plate (house art) takes no prop`);
        if (!A.asDrawn && pl.paints.includes(ART.cut[c].who)) fail(`${at} ${id}: the plate paints ${ART.cut[c].who}; the ${slot} cut-out would double it (the no-doubles rule, SPEC §5.2)`);
      }
      const ks = ksOf(A, id);
      if (sealOf(A, id)) { if (!/^\S$/u.test(sealOf(A, id))) fail(`${at} ${id}: its act's seal "${sealOf(A, id)}" is not one glyph`); }
      else if (!ks) fail(`${at} ${id}: keepsake "${d.keep}" is neither a cut-out, 'plate' nor an image under hub/`);
      else if (kept.has(ks)) fail(`${at}: one drawing for two keepsakes (${kept.get(ks)} and ${id}: ${ks})`);
      else kept.set(ks, id);
      if (i) { const p = A.districts[ids[i - 1]]; if (p && plateOf(A, ids[i - 1]) === plateOf(A, id) && ['lead', 'companion', 'prop'].every((s) => p[s] === d[s])) fail(`${at}: ${ids[i - 1]} and ${id} would show the same diorama`); }
    });
    if (/^(012)+0?1?$/.test(ids.map((id) => A.districts[id] && A.districts[id].right).join(''))) fail(`${at}: the right answers follow the 0,1,2 cycle`);
  }

  /* ---------------- derived keys, in every language (never typed) ----------------
     a book's kind without its slash form, its line as the lead's first sentence; a page's title and description;
     the Studio's third door counts the published atlases and the counter's services */
  const firstSentence = (s) => { const m = String(s).match(/^.*?[.!?؟](?=\s|$)/); return m ? m[0] : s; };
  const nSvc = Object.keys(DICT.fr).filter((k) => /^money\.svc\.items\.\d+\.name$/.test(k)).length;
  for (const l of LANGS) {
    for (const b of books) {
      for (const [f, src] of [['kind', b.kind], ['line', b.line], ['title', b.title]]) if (DICT[l][src] == null) fail(`hub/src/lanterne/shelf.json ${b.slug}: no key ${src} in ${l}`);
      DICT[l][`lant.book.${b.slug}.kind`] = String(DICT[l][b.kind] || '').replace(/^\/\s*/, '');
      DICT[l][`lant.book.${b.slug}.line`] = firstSentence(DICT[l][b.line] || '');
    }
    for (const b of live) { const A = ATLAS[b.slug]; DICT[l][`lant.page.${b.slug}.title`] = DICT[l][ak(A, 'search')] || ''; DICT[l][`lant.page.${b.slug}.desc`] = DICT[l][ak(A, 'desc')] || ''; }
    for (const k of ['doors.c.d']) if (DICT[l][k] != null) DICT[l][k] = DICT[l][k].replace(/\{atlases\}/g, String(live.length)).replace(/\{services\}/g, String(nSvc));
  }

  /* ---------------- pieces every page shares ---------------- */
  const t = (k) => `<span data-i18n="${k}"></span>`;
  const langSwitch = () => `<div class="lang" role="group" data-i18n-aria="nav.lang">
      <a href="?lang=fr" hreflang="fr" lang="fr" data-lt-lang="fr" aria-current="true">FR</a><a href="?lang=en" hreflang="en" lang="en" data-lt-lang="en" aria-current="false">EN</a><a href="?lang=ar" hreflang="ar" lang="ar" data-lt-lang="ar" aria-current="false" aria-label="العربية (ع)">${AYN}</a>
    </div>`;
  const ext = ` target="_blank" rel="noopener"`;
  const motionBtn = (cls) => `<button type="button" class="motion js-only${cls}" data-lt-motion aria-pressed="true" data-i18n-title="lant.ui.motionHint"><span class="motion__dot" aria-hidden="true"></span><span data-i18n="lant.ui.motion"></span></button>`;
  const menu = (links, motion) => `<button type="button" class="menu-btn js-only" data-lt-menu-open aria-haspopup="dialog"><span class="menu-btn__bars" aria-hidden="true"></span><span class="menu-btn__t" data-i18n="nav.menu"></span></button>
  <dialog class="menu" data-lt-menu aria-labelledby="lt-menu-h">
    <div class="menu__top"><p class="menu__h" id="lt-menu-h" data-i18n="nav.menu"></p><button type="button" class="btn" data-lt-menu-close><span data-i18n="nav.menuClose"></span></button></div>${motion ? `
    ${motionBtn(' menu__motion')}` : ''}
    <ul class="menu__list">${links.map(([href, key]) => `<li><a href="${href}"${href.startsWith('https:') ? ext : ''}><span data-i18n="${key}"></span>${href.startsWith('https:') ? '<span class="sr" data-i18n="case.newTab"></span>' : ''}</a></li>`).join('')}</ul>
  </dialog>`;
  /* the Studio's wordmark (hub/src/page.html), to the site's root as its name says (« Numidea Labs, le site ») */
  const WM = `<a class="st-wm mast__word" href="../../" data-i18n-aria="nav.home" dir="ltr"><span class="st-wm__t"><span>NUMIDEA</span> <span class="st-wm__l">LABS</span></span><span class="st-wm__kana" aria-hidden="true">ヌミディア・ラボ</span></a>`;
  /* an atlas's and the toolbox's foot: the shelf's colophon (hub/src/lanterne/shelf.html) without its skyline; the way
     home, the Librairie, the Studio, the world, the prices and WhatsApp (L-16) */
  const footLinks = (shelf) => `<nav class="st-foot__links" data-i18n-aria="footer.nav">
      <a href="../../" data-i18n="footer.site"></a>${shelf ? '' : `
      <a href="./" data-i18n="lant.ui.library"></a>`}
      <a href="../" data-i18n="manual.nav.studio"></a>
      <a href="../monde.html" data-i18n="nav.world"></a>
      <a href="../#pricing" data-i18n="nav.pricing"></a>
      <a href="${WA}"${ext}><span data-i18n="lant.ui.wa"></span><span class="st-sr" data-i18n="case.newTab"></span></a>
    </nav>`;
  const stFoot = (before) => `<footer class="st-foot lt-sfoot">
  <div class="st-wrap">${before || ''}
  <div class="st-foot__in">
    <span class="st-label st-foot__ok" aria-hidden="true">奥付</span>
    <a class="st-wm st-wm--foot" href="../../" data-i18n-aria="nav.home" dir="ltr"><span class="st-wm__t"><span>NUMIDEA</span> <span class="st-wm__l">LABS</span></span><span class="st-wm__kana" aria-hidden="true">ヌミディア・ラボ</span></a>
    <p class="st-foot__line"><span data-i18n="footer.line"></span></p>
    ${footLinks(false)}
    <span class="st-seal st-seal--fill st-foot__seal" aria-hidden="true">印</span>
    <p class="st-label st-foot__rights" data-i18n="footer.rights"></p>
  </div></div>
</footer>`;
  const radioJson = JSON.stringify(RADIO.map((tr) => ({ id: tr.id, src: '../' + tr.src, dur: tr.dur }))).replace(/</g, '\\u003c');
  const dataBlock = (o) => `<script type="application/json" id="lant-data">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;

  /* the Studio's head, a level down: its own address, title and description, its dictionary per page */
  const headFor = (file, ui, page, crumbs) => {
    let h = pageSrc.slice(0, headEnd);
    h = swap(h, '<html lang="fr" dir="ltr">', `<html lang="fr" dir="ltr" data-ui="${ui}" data-dict="i18n/${page}.">`, 1, 'the html tag');
    h = swap(h, '<noscript>{{lazyFonts}}</noscript>\n', '', 1, "the cases' faces");
    h = swap(h, '{{caseCss}}\n', '', 1, "the cases' sheets");
    h = swap(h, '"ui.title"', `"${ui}.title"`, 3, 'the title key');
    h = swap(h, '"ui.desc"', `"${ui}.desc"`, 3, 'the description key');
    const at = /\{\{base\}\}hub\/(?=["'?])/g, n = (h.match(at) || []).length;
    if (n !== 7) fail(`the head of hub/lanterne/${file || 'index.html'}: the Studio's address found ${n} times, 7 expected`);
    h = h.replace(at, `{{base}}hub/lanterne/${file}`);
    h = swap(h, `{"@type":"ListItem","position":2,"name":"Studio","item":"{{base}}hub/lanterne/${file}"}]}`,
      `{"@type":"ListItem","position":2,"name":"Studio","item":"{{base}}hub/"}${crumbs.map(([name, f], i) => `,{"@type":"ListItem","position":${3 + i},"name":${JSON.stringify(name)},"item":"{{base}}hub/lanterne/${f}"}`).join('')}]}`, 1, 'the breadcrumb');
    h = swap(h, "sc.src='i18n.'+l+'.js?v={{stamp}}'", `sc.src='i18n/${page}.'+l+'.js?v={{stamp}}'`, 1, "the head script's dictionary");
    h = swap(h, "['fonts/reem-kufi-700-arabic.woff2','../assets/fonts/", "['../fonts/reem-kufi-700-arabic.woff2','../../assets/fonts/", 1, 'the Arabic preloads');
    h = swap(h, "'../assets/fonts/ibm-plex-sans-arabic-600", "'../../assets/fonts/ibm-plex-sans-arabic-600", 1, 'the Arabic preloads');
    h = swap(h, "i.src='bible/art/rig-'", "i.src='../bible/art/rig-'", 1, "the sting's pictures");
    h = h.replace(/(\s(?:href|src)=")(?!https?:|#|\{\{)([^"]+)"/g, (all, a, u) => `${a}../${u}"`);
    h = swap(h, '<link rel="stylesheet" href="../style.css?v={{stamp}}">', '<link rel="stylesheet" href="../style.css?v={{stamp}}">\n<link rel="stylesheet" href="../css/lanterne.css?v={{stamp}}">', 1, 'the sheet');
    h = swap(h, '{{fr}}', `{{lantFr.${page.replace(/[^a-z]/g, '')}}}`, 1, "the runtime French block");
    return h;
  };
  const holes = {}, out = [], runtime = {}, lazyFr = {};
  /* a link from a Studio page to an atlas (hub/src/page.html, monde.html, fabrique.html: {{lant.to.<slug>}}, relative to hub/): the
     atlas once its file exists, the shelf until then, so no page ever links to an atlas not built yet */
  for (const b of books) {
    const k = 'lant.to.' + b.slug.replace(/[^a-z0-9]/g, ''), live = !!ATLAS[b.slug];
    holes[k] = live ? 'lanterne/' + b.slug + '.html' : 'lanterne/';
    // {{lant.to.<slug>.<district>}}: that district open; the shelf alone (no fragment) until the atlas is built
    for (const id of b.ids) holes[k + '.' + id] = live ? 'lanterne/' + b.slug + '.html#' + id : 'lanterne/';
  }
  const scripts = (list) => list.map((s) => `<script src="${s}?v={{stamp}}" defer></script>`).join('\n');
  const lantRuntime = (extra) => new Set(Object.keys(DICT.fr).filter((k) => /^lant\.(ui|cast)\./.test(k) || extra(k)));

  /* ================= an atlas ================= */
  const castName = (c) => `lant.cast.${c}`;
  for (const b of live) {
    const A = ATLAS[b.slug], P = b.slug;
    const ids = A.acts.flatMap((a) => a.districts), sideIds = A.acts.filter((a) => a.side).flatMap((a) => a.districts);
    const N = ids.length - sideIds.length;
    const actOf = (id) => A.acts.find((a) => a.districts.includes(id));
    const part = (name) => { const f = join(LS, 'ex', P, `${name}.html`); return existsSync(f) ? readFileSync(f, 'utf8').trim() : ''; };
    const cutImg = (c, cls, rate, eager) => { const a = ART.cut[c]; return `<img class="layer ${cls}" style="--rate:${rate};--nw:${a.w}px;--nh:${a.h}px" src="${up(a.src)}" width="${a.w}" height="${a.h}" alt="" loading="${eager ? 'eager' : 'lazy'}" decoding="async">`; };
    const plateImg = (pl, eager, cls, rate) => `<img class="layer ${cls}" style="--rate:${rate}" src="${up(pl.src)}"${pl.small ? ` srcset="${up(pl.small.src)} ${pl.small.w}w, ${up(pl.src)} ${pl.w}w" sizes="${pl.wide ? '(max-width:1010px) 94vw, 760px' : '(max-width:650px) 92vw, (max-width:1010px) 44vw, 607px'}"` : ''} width="${pl.w}" height="${pl.h}" alt="" loading="${eager ? 'eager' : 'lazy'}" decoding="async">`;
    const answers = (id) => [0, 1, 2].map((j) => `<li><button type="button" class="ans" data-lt-ans="${j}" aria-pressed="false" aria-describedby="${id}-fb"><span class="ans__t" data-i18n="${ansK(A, id, 'a', j)}"></span><span class="ans__m"></span></button></li>`).join('');
    const sit = (id) => `<fieldset class="sit js-only" data-lt-sit="${id}">
              <legend><span class="k" data-i18n="lant.ui.situation"></span><span class="sit__q" data-i18n="${dk(A, id, 'q')}"></span></legend>
              <ul class="sit__list">${answers(id)}</ul>
              <p class="sit__fb" id="${id}-fb" role="status" data-i18n="lant.ui.idle"></p>
              <p class="sit__next" hidden><a href="#${id}-ex" data-i18n="lant.ui.rightNext"></a><span class="sit__ok" data-i18n="lant.ui.rightDone"></span></p>
            </fieldset>`;
    /* a long rule (the nine modules: 126 to 178 words) reads in the body weight, its first sentence bold (L-05): hub/lanterne.js
       sets the first sentence apart in the page's language (two derived keys would have put 100 kB more in hub/i18n.js) */
    const ruleT = (id) => `<p class="rule__t${A.ruleLead ? ' rule__t--long' : ''}" data-i18n="${dk(A, id, 'rule')}"></p>`;
    const district = (id, i) => {
      const d = A.districts[id], act = actOf(id), pl = ART.plates[plateOf(A, id)], after = d.ask === 'after', wide = !!pl.wide;
      const hasCut = !!(d.lead || d.companion || d.prop);
      /* the act's plate again (the district before it in the same act shows the same picture): a strip, not a second full plate (L-20) */
      const prevId = ids[i - 1], strip = !!prevId && actOf(prevId) === act && plateOf(A, prevId) === plateOf(A, id);
      /* « read each explanation » is a reading, not the quarter's exercise: the district is done by its situation (L-07) */
      const read = d.ex === 'pick';
      const board = part(id);
      /* a wide plate (a module header, house art: SPEC §3.3, §4.4) is shown alone in its frame, without parallax; the
         district's guide and companion stand beside it, on the paper, never on it */
      const frame = wide ? `<div class="dio__frame">
                ${plateImg(pl, i === 0, 'dio__plate', '0')}
              </div>
              ${hasCut ? `<div class="dio__paper">${d.companion ? cutImg(d.companion, 'dio__comp', '0', i === 0) : ''}${d.lead ? cutImg(d.lead, 'dio__lead', '0', i === 0) : ''}</div>` : ''}` : `<div class="dio__frame"${hasCut ? ' data-lt-parallax' : ''}>
                ${plateImg(pl, i === 0, 'dio__plate', hasCut ? '.36' : '0')}
                ${d.prop ? cutImg(d.prop, 'dio__prop', '-.52', i === 0) : ''}
                ${d.companion ? cutImg(d.companion, 'dio__comp', '-.72', i === 0) : ''}
                ${d.lead ? cutImg(d.lead, 'dio__lead', '1.05', i === 0) : ''}
              </div>`;
      const more = d.more && ATLAS[d.more.to] && live.some((x) => x.slug === d.more.to)
        ? `<p class="more"><span class="k" data-i18n="${need(d.more.l || 'web3c.x.deeperL', `${P} ${id}`)}"></span> <a href="${d.more.to}.html#${d.more.at}" data-i18n="${need(d.more.k, `${P} ${id}`)}"></a></p>` : '';
      /* a district that names a kind of tool points to its shelf in the toolbox ("tools": { "k": its line, "at": "tl-<shelf>" }) */
      if (d.tools && (!TOOLS || !toolIds.has(d.tools.at))) fail(`hub/src/lanterne/atlases/${P}.json ${id}: tools.at "${d.tools.at}" is not a shelf or an app of the toolbox (hub/src/lanterne/apps.json)`);
      const toolsLine = d.tools && TOOLS ? `<p class="more more--tools"><span class="k" data-i18n="lant.tools.in.k"></span> <a href="outils.html#${d.tools.at}" data-i18n="${need(d.tools.k, `${P} ${id}`)}"></a></p>` : '';
      return `
      <section class="district" id="${id}" data-act="${act.id}"${A.course ? ` data-ls-panel="${id}"` : ''} aria-labelledby="${id}-h"${d.accent ? ` style="--accent:${d.accent}"` : ''}>
        <div class="stage${wide ? ' stage--wide' : ''}${strip ? ' stage--strip' : ''}">
          <div class="dio-wrap">
            <p class="dio__cap" aria-hidden="true"><span class="dio__name" data-i18n="${dk(A, id, 'name')}"></span><span class="dio__guide" data-i18n="${castName(d.guide)}"></span><strong data-i18n="${dk(A, id, 'sub')}"></strong></p>
            <figure class="dio${wide ? ' dio--wide' : ''}${hasCut ? '' : ' dio--alone'}${strip ? ' dio--strip' : ''}" dir="ltr" role="img" data-i18n-aria="${dk(A, id, 'alt')}" style="--pw:${pl.w}px;--pr:${pl.w}/${pl.h}">
              ${frame}
            </figure>
            <button type="button" class="dio__zoom js-only" data-lt-zoom="${up(pl.src)}"><span data-i18n="lant.ui.zoom"></span></button>
          </div>
          <div class="dossier${after ? ' dossier--after' : ''}">
            <p class="k" data-lt-dossier-k>${esc(fr('lant.ui.dossierK').replace('{act}', fr(ak(A, `actShort.${act.id}`))).replace('{i}', i + 1).replace('{N}', ids.length))}</p>
            <h3 class="dossier__h" id="${id}-h" tabindex="-1" data-i18n="${dk(A, id, 'name')}"></h3>
            <p class="dossier__sub"><span data-i18n="${dk(A, id, 'sub')}"></span> · <span data-lt-with="${d.guide}">${esc(fr('lant.ui.with').replace('{g}', fr(castName(d.guide))))}</span></p>
            <p class="dossier__lore" data-i18n="${dk(A, id, 'lore')}"></p>
            <div class="rule"><p class="k" data-i18n="lant.ui.rule"></p>${ruleT(id)}</div>
            ${more}${toolsLine}
            ${after ? '' : sit(id)}
            <p class="keep" hidden>${ksImg(A, id, 48)}<span data-lt-keep></span></p>
            ${after ? `<div class="dossier__ex"><p class="k" data-i18n="${read ? 'lant.ui.readK' : 'lant.ui.exK'}"></p><p class="dossier__ext" data-i18n="${dk(A, id, 'ex.t')}"></p><p class="dossier__exb" data-i18n="${dk(A, id, 'ex.brief')}"></p></div>` : ''}
            <a class="to-ex" href="#${id}-ex" data-i18n="${after ? 'lant.ui.toRead' : read ? dk(A, id, 'ex.t') : 'lant.ui.toEx'}"></a>
          </div>
        </div>
        <section class="terrain" id="${id}-ex" aria-labelledby="${id}-ex-h ${id}-h">
          <div class="terrain__head">
            <div><p class="k" data-i18n="${read ? 'lant.ui.readK' : 'lant.ui.exK'}"></p><h3 class="terrain__h" id="${id}-ex-h" data-i18n="${dk(A, id, 'ex.t')}"></h3></div>
            ${read ? '' : `<p class="badge-wrap js-only"><span class="badge" data-lt-badge data-i18n="lant.ui.badgeOpen"></span>${d.ex === 'bins' ? '<span class="badge__score" data-lt-score hidden></span><button type="button" class="lnk lnk--btn badge__redo" data-lt-redo hidden><span data-i18n="lant.ui.redo"></span></button>' : ''}</p>`}
          </div>
          <p class="terrain__brief" data-i18n="${dk(A, id, 'ex.brief')}"></p>
          <div class="board" data-lt-ex="${esc(d.ex)}" data-lt-id="${id}">${board || '<p class="board__nojs" data-i18n="lant.ui.noJs"></p>'}</div>
          <p class="result" role="status" data-lt-result></p>
          ${after ? sit(id) : ''}
          <div class="terrain__act">
            <a href="#journal" class="lnk lnk--t" data-i18n="lant.ui.readJournal"></a>
            ${KIT.includes(d.ex) || read ? '' : '<button type="button" class="lnk lnk--btn js-only" data-lt-skip hidden><span data-i18n="lant.ui.skipEx"></span></button>'}
            <button type="button" class="btn btn--amber js-only" data-lt-next>${esc(ids[i + 1] ? fr('lant.ui.next').replace('{q}', fr(dk(A, ids[i + 1], 'name'))) : fr('lant.ui.first'))}</button>
          </div>
        </section>
        <p class="note-nojs"><b data-i18n="${dk(A, id, 'scene')}"></b> · <span data-i18n="${dk(A, id, 'decision')}"></span></p>
      </section>`;
    };
    /* a stop's short name and its sentence title, in the rail and the picker (L-09: « Niveau 3 » said nothing); the nine
       modules' names are already sentences */
    const titled = !A.carnet;
    const optT = (id) => fr(dk(A, id, 'name')) + (titled ? ' · ' + fr(dk(A, id, 'sub')) : '');
    const list = A.acts.map((a) => `
        <p class="list__act${a.side ? ' list__act--side' : ''}" id="act-${a.id}" data-i18n="${ak(A, `act.${a.id}`)}"></p>
        <ul class="list__ul" aria-labelledby="act-${a.id}">${a.districts.map((id) => `
          <li><a class="list__btn" href="#${id}" data-lt-go="${id}"${A.course ? ` data-ls-tab="${id}"` : ''}><span class="list__mk" aria-hidden="true"></span>${A.districts[id].icon ? `<img class="list__ic" src="${up(A.districts[id].icon)}" alt="" width="260" height="260" loading="lazy" decoding="async">` : ''}<span class="list__w"><span class="list__n" data-i18n="${dk(A, id, 'name')}"></span>${titled ? `<span class="list__s" data-i18n="${dk(A, id, 'sub')}"></span>` : ''}</span><span class="sr list__st"></span></a></li>`).join('')}
        </ul>`).join('');
    const select = `<label class="jump js-only"><span class="sr" data-i18n="lant.ui.go"></span><select data-lt-jump>${A.acts.map((a) => `<optgroup data-i18n-label="${ak(A, `act.${a.id}`)}" label="${esc(fr(ak(A, `act.${a.id}`)))}">${a.districts.map((id) => `<option value="${id}" data-lt-opt>${esc(optT(id))}</option>`).join('')}</optgroup>`).join('')}</select></label>`;
    const actStrip = `<div class="acts js-only" role="group" data-i18n-aria="lant.ui.acts">${A.acts.map((a) => `<button type="button" class="chip" data-lt-act-go="${a.id}" data-i18n="${ak(A, `actShort.${a.id}`)}"></button>`).join('')}</div>`;
    /* a note's two lines may carry a label (web3 vol. 2: « Idée reçue » before the misconception, « En fait » before the
       answer, so a misconception never reads as a fact) */
    const NL = A.noteLabels || {};
    /* web3 vol. 2 (33 districts in nine acts): each act's notes fold under its title, the act on show open (hub/lanterne.js
       show()); open for all without script (review 2026-11-22: 33 locked cards made a 10,600 px journal at 390) */
    const fold = !!A.carnet;
    const journal = A.acts.map((a) => `${fold ? `
      <details class="notes__mod" data-lt-jmod="${a.id}" open><summary>` : ''}
      <h3 class="notes__act"${fold ? '' : ` data-lt-jgrp="${a.id}"`} data-i18n="${ak(A, `act.${a.id}`)}"></h3>${fold ? '</summary>' : ''}
      <ol class="notes"${fold ? '' : ` data-lt-jgrp="${a.id}"`}>${a.districts.map((id) => `
        <li class="note" data-lt-note="${id}"><a class="note__go" href="#${id}" data-lt-go="${id}" data-i18n="${dk(A, id, 'scene')}"></a>${NL.hand ? `<p class="note__hand"><b class="note__l" data-i18n="${need(NL.hand, P)}"></b> <span data-i18n="${dk(A, id, 'handoff')}"></span></p>` : `<p class="note__hand" data-i18n="${dk(A, id, 'handoff')}"></p>`}${NL.dec ? `<p class="note__decw"><b class="note__l" data-i18n="${need(NL.dec, P)}"></b> <span class="note__dec" data-i18n="${dk(A, id, 'decision')}"></span></p>` : `<p class="note__dec" data-i18n="${dk(A, id, 'decision')}"></p>`}</li>`).join('')}
      </ol>${part(`_jact-${a.id}`)}${fold ? '\n      </details>' : ''}`).join('') + `
      <p class="notes__left js-only" data-lt-journal-left></p>` + part('_journal');
    const sac = A.carnet
      /* the carnet (web3 vol. 2, web3x §7): one seal per act, inked once each of its districts is done; the act's
         stamps counted under it */
      ? `
      <h3 class="notes__act" data-i18n="${need('web3c.carnet.t', P)}"></h3>
      <p class="sec__lead" data-i18n="${need('web3c.carnet.d', P)}"></p>
      <ul class="sac sac--carnet">${A.acts.map((a, n) => `
        <li class="ks ks--seal" data-lt-seal="${a.id}"><span class="ks__frame"><span class="ks__seal" lang="ja" aria-hidden="true">${a.seal}</span><span class="ks__q" aria-hidden="true">?</span></span><span class="ks__d"><span data-i18n="web3c.chap.mod"></span> ${n + 1}</span><strong class="ks__n" data-i18n="${ak(A, `actShort.${a.id}`)}"></strong><span class="ks__c" data-lt-seal-n dir="ltr">0 / ${a.districts.length}</span><span class="sr ks__un" data-i18n="lant.ui.unknown"></span></li>`).join('')}
      </ul>
      <p class="carnet__left" data-lt-carnet-left></p>`
      /* L-12: the keepsakes won, and one line per act for the slots still empty */
      : A.acts.map((a) => `
      <div class="sac__head"><h3 class="notes__act" data-i18n="${ak(A, `act.${a.id}`)}"></h3><p class="sac__left js-only" data-lt-sac-left="${a.id}"></p></div>
      <ul class="sac">${a.districts.map((id) => `
        <li class="ks" data-lt-ks="${id}"><span class="ks__frame">${ksImg(A, id, 72)}<span class="ks__q" aria-hidden="true">?</span></span><span class="ks__d" data-i18n="${dk(A, id, 'name')}"></span><strong class="ks__n" data-i18n="${dk(A, id, 'keep')}"></strong><span class="sr ks__un" data-i18n="lant.ui.unknown"></span></li>`).join('')}
      </ul>`).join('');
    /* the cover: the owner's composition (plate + cut-outs, as he built it) or the course's scene, as drawn */
    let cover;
    if (A.cover && A.cover.plate) {
      const bk = ART.keys[A.cover.plate] || ART.plates[A.cover.plate];
      if (!bk) fail(`hub/src/lanterne/atlases/${P}.json: cover plate "${A.cover.plate}" is not in art.json`);
      cover = `<div class="hero__art" dir="ltr" data-lt-parallax role="img" data-i18n-aria="${ak(A, 'coverAlt')}">
        <img class="layer hero__back" style="--rate:.33" src="${up(bk.src)}" width="${bk.w}" height="${bk.h}" alt="" fetchpriority="high">
        ${A.cover.prop ? cutImg(A.cover.prop, 'hero__prop', '-.5', true) : ''}
        ${A.cover.companion ? cutImg(A.cover.companion, 'hero__comp', '-.75', true) : ''}
        ${A.cover.lead ? cutImg(A.cover.lead, 'hero__lead', '1.05', true) : ''}
      </div>`;
    } else {
      const c = A.cover || {};
      if (!c.src || !existsSync(join(HUB, c.src))) fail(`hub/src/lanterne/atlases/${P}.json: cover.src "${c.src}" is not a file under hub/`);
      cover = `<figure class="hero__art hero__art--scene" role="img" data-i18n-aria="${ak(A, 'coverAlt')}"><img class="hero__back" src="${up(c.src)}"${c.srcset ? ` srcset="${c.srcset.split(',').map((x) => up(x.trim())).join(', ')}" sizes="(max-width:1010px) 94vw, 60vw"` : ''} alt="" fetchpriority="high" decoding="async"></figure>`;
    }
    const caseArt = A.caseArt && ART.cut[A.caseArt] ? `<div class="case__art" aria-hidden="true"><img src="${up(ART.cut[A.caseArt].src)}" alt="" width="${ART.cut[A.caseArt].w}" height="${ART.cut[A.caseArt].h}" loading="lazy"></div>` : (A.caseArt && existsSync(join(HUB, A.caseArt)) ? `<div class="case__art" aria-hidden="true"><img src="${up(A.caseArt)}"${existsSync(join(HUB, A.caseArt.replace(/\.webp$/, '-320.webp'))) ? ` srcset="${up(A.caseArt.replace(/\.webp$/, '-320.webp'))} 320w, ${up(A.caseArt)} 640w" sizes="120px"` : ''} alt="" loading="lazy"></div>` : '');
    const plural = (base, n, v) => { const f = fr(`${base}.${new Intl.PluralRules('fr').select(n)}`) ?? fr(`${base}.other`) ?? ''; return f.replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m)); };
    const client = {
      slug: P, key: A.key, store: A.store || `numidea-lanterne-${P}`, migrate: b.migrate || null, carnet: !!A.carnet,
      labs: A.labs ? { script: '../' + A.labs.script, fr: A.lazyFr ? `i18n/${P}.fr.js` : null } : null,
      acts: A.acts.map((a) => ({ id: a.id, side: !!a.side, districts: a.districts, ...(a.seal ? { seal: a.seal } : {}) })),
      k: { conclusion: ak(A, 'conclusion'), act: Object.fromEntries(A.acts.map((a) => [a.id, ak(A, `act.${a.id}`)])), actShort: Object.fromEntries(A.acts.map((a) => [a.id, ak(A, `actShort.${a.id}`)])) },
      districts: Object.fromEntries(ids.map((id) => { const d = A.districts[id]; return [id, { right: d.right, ex: d.ex, guide: d.guide, lead: d.lead || null, companion: d.companion || null, prop: d.prop || null, ks: ksOf(A, id) ? up(ksSmall(ksOf(A, id)) || ksOf(A, id)) : null, ...(sealOf(A, id) ? { seal: sealOf(A, id) } : {}),
        ...(d.ex === 'pick' ? { read: true } : {}), k: { name: dk(A, id, 'name'), ...(titled ? { sub: dk(A, id, 'sub') } : {}), keep: dk(A, id, 'keep'), scene: dk(A, id, 'scene'), handoff: dk(A, id, A.caseHand || 'handoff'), alt: dk(A, id, 'alt'), f: dk(A, id, 'f'), fs: [0, 1, 2].map((j) => fK(A, id, j)), ex: `lant.at.${A.key}.d.${id}.ex` }, ...(d.done ? { done: d.done } : {}) }]; })),
      cut: { kuro: up(ART.cut.kuro.src) },
    };
    const page = P;
    const title = fr(ak(A, 'title1')) + ' ' + fr(ak(A, 'title2'));
    const html = `${headFor(`${P}.html`, `lant.page.${P}`, page, [['La Librairie Lanterne', ''], [title.replace(/\.$/, ''), `${P}.html`]])}
<body class="lt lt-atlas" data-lt-atlas="${P}">
<a class="skip" href="#quartiers" data-i18n="lant.ui.skip"></a>
<header class="mast lt-wrap">
  ${WM}
  <a class="mast__back" href="./" data-i18n="lant.ui.library"></a>
  <p class="mast__title"><span data-i18n="${ak(A, 'title1')}"></span> <span data-i18n="${ak(A, 'title2')}"></span></p>
  <nav class="mast__nav" data-i18n-aria="lant.ui.menuLabel">
    <a href="#journal" data-i18n="lant.ui.journal"></a>
    <a href="#sac" data-i18n="lant.ui.sac"></a>${(A.mast || []).map(([href, k]) => `
    <a href="${href}" data-i18n="${need(k, P)}"></a>`).join('')}
  </nav>
  ${motionBtn(' mast__motion')}
  ${langSwitch()}
  ${menu([['./', 'lant.ui.library'], ['#journal', 'lant.ui.journal'], ['#sac', 'lant.ui.sac'], ...(A.mast || []), ['./#comptoir', 'lant.shelf.navComptoir'], ...(TOOLS ? [['outils.html', 'lant.tools.mast']] : []), ...enqMenu, [WA, 'lant.ui.wa'], ['../', 'lant.ui.studio'], ['../fabrique.html', 'nav.fab'], ['../monde.html', 'nav.world']], true)}
</header>
<main id="main" class="lt-wrap${A.course || A.brief ? ' st-crs' : ''}"${A.course ? ` data-lt-course="${A.course}"` : ''}${A.brief ? ` data-lt-brief="${A.brief}"` : ''}>
  <section class="hero" id="hero" aria-labelledby="hero-h">
    <div class="hero__copy">
      <p class="k k--amber" data-i18n="${ak(A, 'kicker')}"></p>
      <h1 class="hero__h${['fr', 'en', 'ar'].some((l) => ((DICT[l][ak(A, 'title1')] || '') + (DICT[l][ak(A, 'title2')] || '')).length > 30) ? ' hero__h--long' : ''}" id="hero-h"><span data-i18n="${ak(A, 'title1')}"></span> <em data-i18n="${ak(A, 'title2')}"></em></h1>
      ${fr(ak(A, 'sub')) != null ? `<p class="hero__sub" data-i18n="${ak(A, 'sub')}"></p>` : ''}
      <p class="hero__pitch" data-i18n="${ak(A, 'pitch')}"></p>
      <p class="hero__case" data-i18n="${ak(A, 'caseLabel')}"></p>
      <a class="btn btn--amber btn--down" href="#quartiers" data-lt-hero-cta><span data-i18n="lant.ui.open"></span></a>
    </div>
    <div class="hero__stage">
      ${cover}
    </div>
  </section>
  ${part('_hero')}

  <section class="world" id="quartiers" aria-labelledby="world-h" tabindex="-1">
    <div class="heading">
      <div><p class="k" data-i18n="lant.ui.pickK"></p><h2 id="world-h" tabindex="-1" data-i18n="lant.ui.districtsH"></h2></div>
      <p class="hud" aria-live="polite"><span class="hud__main" data-lt-hud>${esc(plural('lant.ui.hud', 0, { n: 0, N }))}</span>${sideIds.length ? `<span class="hud__side" data-lt-hud-side>${esc(fr('lant.ui.hudSide').replace('{m}', 0).replace('{M}', sideIds.length))}</span>` : ''}</p>
    </div>
    <div class="mini js-only" data-lt-mini>
      <button type="button" class="mini__b" data-lt-step="-1"><span class="sr" data-i18n="lant.ui.prev"></span><span aria-hidden="true" class="mini__arrow mini__arrow--prev"></span></button>
      <span class="mini__pos" data-lt-mini-pos dir="ltr">1 / ${ids.length}</span>
      <button type="button" class="mini__b" data-lt-step="1"><span class="sr" data-i18n="lant.ui.nextShort"></span><span aria-hidden="true" class="mini__arrow"></span></button>
      ${select}
      <a href="#journal" class="mini__l" data-i18n="lant.ui.journalSac"></a>
      <a href="./" class="mini__l mini__back"><span class="mini__bt" data-i18n="lant.ui.library"></span></a>
    </div>
    <div class="layout">
      <nav class="list" data-i18n-aria="lant.ui.listLabel">
        ${actStrip}
        ${list}
      </nav>
      <div class="view">${A.acts.map((a) => { const h = part(`_act-${a.id}`), f = part(`_actfoot-${a.id}`), at0 = ids.indexOf(a.districts[0]);
        return `${h ? `
      <div class="acthead" id="act-${a.id}-head" data-lt-acthead="${a.id}">${h}</div>` : ''}${a.districts.map((id, j) => district(id, at0 + j)).join('')}${f ? `
      <div class="actfoot" data-lt-actfoot="${a.id}">${f}</div>` : ''}`; }).join('')}
      </div>
    </div>
    <!-- the case so far, after the districts (L-25: « Quartier suivant » came before the list in the Tab order), and only
         once a district is done (L-11: hub/lanterne.js shows it) -->
    <div class="case js-only" data-lt-case hidden>
      ${caseArt}
      <div class="case__txt">
        <p class="k k--red"><span data-i18n="${ak(A, 'caseLabel')}"></span> · <span data-lt-case-act></span></p>
        <h3 class="case__h" data-lt-case-scene>${esc(fr(dk(A, ids[0], 'scene')))}</h3>
        <p class="case__hand" data-lt-case-hand></p>
      </div>
      <button type="button" class="btn btn--amber" data-lt-resume>${esc(fr('lant.ui.next').replace('{q}', fr(dk(A, ids[1] || ids[0], 'name'))))}</button>
    </div>
    <p class="sr" aria-live="polite" data-lt-live></p>
  </section>

  <section class="sec" id="journal" aria-labelledby="journal-h">
    <div class="heading">
      <div><p class="k" data-i18n="lant.ui.journalK"></p><h2 id="journal-h" data-i18n="lant.ui.journalH"></h2></div>
      <p class="hud" data-lt-journal-count>${esc(plural(sideIds.length ? 'lant.ui.journalCount' : 'lant.ui.journalCountMain', 0, { n: 0, N, m: 0, M: sideIds.length }))}</p>
    </div>
    <p class="conclusion" data-lt-conclusion data-i18n="lant.ui.journalIdle"></p>
    ${journal}
    <p class="sec__act js-only"><button type="button" class="btn" data-lt-print><span data-i18n="lant.ui.print"></span></button></p>
  </section>

  <section class="sec" id="sac" aria-labelledby="sac-h">
    <div class="heading">
      <div><p class="k" data-i18n="lant.ui.sacK"></p><h2 id="sac-h" data-i18n="lant.ui.sacH"></h2></div>
      <p class="hud" data-lt-sac-count>${esc(plural('lant.ui.sacCount', 0, { n: 0, N: ids.length }))}</p>
    </div>
    <p class="sec__lead" data-i18n="lant.ui.sacLead"></p>
    ${sac}
    ${part('_sac')}
  </section>
  ${part('_sources')}
  ${part('_end')}
</main>
${stFoot(`
  <div class="lt-foot">
  <a href="./" class="mast__back" data-i18n="lant.ui.footerBack"></a>
  <div class="lt-rchip" data-radio-chip role="group" data-i18n-aria="radio.chip">
    <span class="lt-rchip__k" data-i18n="radio.chip"></span>
    <button type="button" class="st-rchip__b" data-radio-play aria-pressed="false" data-i18n-aria="radio.play" disabled><svg class="st-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path data-radio-ico-play d="M7 4l13 8-13 8z"/><path data-radio-ico-pause d="M6 4h4v16H6zM14 4h4v16h-4z" hidden/></svg></button>
    <span class="lt-rchip__t" data-radio-title>{{radioFirst}}</span>
    <button type="button" class="st-rchip__b" data-radio-next data-i18n-aria="radio.next" disabled><svg class="st-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 4l11 8-11 8zM17 4h3v16h-3z"/></svg></button>
  </div>
  </div>`)}
<dialog class="zoom" data-lt-zoom-dialog><form method="dialog"><button type="submit" class="btn"><span data-i18n="lant.ui.close"></span></button></form><img alt="" src="${up(ART.plates[plateOf(A, ids[0])].src)}" loading="lazy" data-lt-zoom-img></dialog>
<script type="application/json" id="hub-radio">${radioJson}</script>
${dataBlock(client)}
${scripts([...(A.app ? ['../app.js'] : []), '../radio.js', '../lanterne.js', '../../assets/carry.js'])}
</body>
</html>
`;
    out.push({ file: `hub/lanterne/${P}.html`, name: `lanterne/${P}.html`, page, html });
    /* the keys a page's scripts write themselves: an atlas's own, and its districts' (web3 vol. 2: only the fields hub/lanterne.js
       writes, so its 33 explanations, questions and answers stay baked in the markup and out of #hub-fr) */
    const JSK = ['name', 'keep', 'scene', 'handoff', 'decision', 'alt', 'f'];
    const extra = (A.keys ? Object.values(A.keys) : []).concat(ids.flatMap((id) => Object.entries(A.districts[id].keys || {}).filter(([f]) => !A.labs || JSK.includes(f)).map(([, v]) => v).flat()));
    const own = A.runtime ? new RegExp(A.runtime) : null;
    // (the nine modules' lab and shell lines are RUNTIME for the old manual's sake: an atlas that is not the modules' leaves them out)
    runtime[page] = lantRuntime((k) => k.startsWith(`lant.at.${A.key}.`) || extra.some((e) => k === e || k.startsWith(e + '.')) || /^radio\.(play|pause|onair|idle|paused|title|chip)$|^radio\.tracks\./.test(k) || (A.app && ctx.RUNTIME.test(k) && !W3M_KEYS.test(k)) || (own && own.test(k)));
    /* the labs' French lines (web3 vol. 2: hub/web3x.js writes them) ride with the labs, fetched when they load, not in
       the page's #hub-fr block: i18n/<page>.fr.js (window.LANT_XFR) */
    if (A.lazyFr) { const lz = new RegExp(A.lazyFr); lazyFr[page] = Object.fromEntries([...runtime[page]].filter((k) => lz.test(k)).sort().map((k) => [k, DICT.fr[k]])); }
  }

  /* ================= the shelf ================= */
  {
    const page = 'index';
    /* the web3 book's two volumes (SPEC §2.1): « Vous venez pour quoi ? », the two ways in (web3c.path.*; a press keeps the
       choice in numidea-web3-path, as the manual's start did), each its volume; the second's count and resume are its own */
    const vols = (b) => {
      const v2 = books.find((x) => x.in === b.slug), A2 = v2 && ATLAS[v2.slug];
      if (!A2) return `<p class="book__vols"><span data-i18n="lant.shelf.vol1"></span><span class="book__soon" data-i18n="lant.shelf.web3Vol2"></span></p>`;
      const n2 = A2.acts.flatMap((a) => a.districts).length;
      return `<div class="book__vols book__vols--two">
              <p class="book__path" data-i18n="${need('lant.shelf.web3Path', 'the shelf')}"></p>
              <a class="book__vol" href="${b.slug}.html" data-lt-path="0"><b data-i18n="web3c.path.k.0"></b><span data-i18n="lant.shelf.vol1"></span></a>
              <a class="book__vol" href="${v2.slug}.html" data-lt-path="1" data-lt-vol="${v2.slug}"><b data-i18n="web3c.path.k.1"></b><span data-i18n="lant.shelf.vol2"></span><span class="book__vn"><span data-lt-count="${n2}">${esc((fr(`lant.shelf.count.${new Intl.PluralRules('fr').select(n2)}`) || fr('lant.shelf.count.other')).replace('{n}', 0).replace('{N}', n2))}</span> · ${minT(v2.slug)}</span></a>
            </div>`;
    };
    /* a book's reading time, derived from its atlas's French text (its districts' lines and answers, its exercises' markup
       and the lines they name): about 200 words a minute, to the nearest 5 minutes (L-04); never typed */
    const minutes = (slug) => {
      const A = ATLAS[slug]; if (!A) return 0;
      const ids = A.acts.flatMap((a) => a.districts);
      const txt = [];
      for (const id of ids) {
        for (const f of DISTRICT_KEYS) txt.push(fr(dk(A, id, f)));
        for (let j = 0; j < 3; j++) txt.push(fr(ansK(A, id, 'a', j)), fr(fK(A, id, j)));
        const f = join(LS, 'ex', slug, `${id}.html`);
        if (existsSync(f)) { const h = readFileSync(f, 'utf8').replace(/<!--[\s\S]*?-->/g, ' '); txt.push(h.replace(/<[^>]*>/g, ' ')); for (const m of h.matchAll(/\sdata-i18n(?:-html)?="([^"]+)"/g)) txt.push(String(fr(m[1]) || '').replace(/<[^>]*>/g, ' ')); }
      }
      const w = txt.join(' ').split(/\s+/).filter((x) => /\p{L}/u.test(x)).length;
      return Math.max(5, Math.round(w / 200 / 5) * 5);
    };
    need('lant.shelf.minutes', 'the shelf'); need('lant.shelf.start', 'the shelf');
    const minT = (slug) => { const n = minutes(slug); return `<span class="book__min" data-lt-tpl="lant.shelf.minutes" data-lt-n="${n}">${esc(fr('lant.shelf.minutes').replace('{n}', n))}</span>`; };
    const book = (b) => {
      const A = ATLAS[b.slug], ids = A ? A.acts.flatMap((a) => a.districts) : b.ids;
      let coverHtml;
      if (b.cover === 'composite') {
        const bk = ART.keys.bookstall, ky = ART.cut.kuro, y = ART.cut.yasser;
        coverHtml = `<span class="book__cover book__cover--comp"><span class="book__comp" dir="ltr"><img class="book__bk" src="${up(bk.src)}" alt="" width="${bk.w}" height="${bk.h}" loading="lazy"><img class="book__k" src="${up(ky.src)}" alt="" width="${ky.w}" height="${ky.h}" loading="lazy"><img class="book__y" src="${up(y.src)}" alt="" width="${y.w}" height="${y.h}" loading="lazy"></span></span>`;
      } else {
        if (!existsSync(join(HUB, b.cover.src))) fail(`hub/src/lanterne/shelf.json ${b.slug}: cover ${b.cover.src} is not a file under hub/`);
        coverHtml = `<span class="book__cover"><img src="${up(b.cover.src)}" alt="" loading="lazy" decoding="async"></span>`;
      }
      const n = ids.length;
      return `
        <li class="book" data-lt-book="${b.slug}" style="--spine:${b.accent}">
          ${A ? `<a class="book__link" href="${b.slug}.html" tabindex="-1" aria-hidden="true">${coverHtml}</a>` : coverHtml}
          <div class="book__body">${b.start && A ? `
            <a class="book__start" href="${b.slug}.html" data-i18n="lant.shelf.start"></a>` : ''}
            <p class="book__kind" data-i18n="lant.book.${b.slug}.kind"></p>
            <h3 class="book__t" data-i18n="${b.title}"></h3>
            <p class="book__line" data-i18n="lant.book.${b.slug}.line"></p>
            ${A ? `<p class="book__meta"><span data-lt-with="${b.guide}">${esc(fr('lant.shelf.with').replace('{g}', fr(`lant.cast.${b.guide}`)))}</span> · <span data-lt-count="${n}">${esc((fr(`lant.shelf.count.${new Intl.PluralRules('fr').select(n)}`) || fr('lant.shelf.count.other')).replace('{n}', 0).replace('{N}', n))}</span> · ${minT(b.slug)}</p>
            <span class="bar" aria-hidden="true"><span class="bar__fill" data-lt-bar></span></span>` : ''}
            ${b.vol2 ? vols(b) : ''}
            <p class="book__keeps js-only" data-lt-keeps hidden><span class="sr" data-i18n="lant.shelf.kept"></span></p>
            ${A ? (b.vol2 && books.some((x) => x.in === b.slug && ATLAS[x.slug])
              /* two volumes on the card: each is its own way in, no third « Ouvrir l'atlas » that opened vol. 1 only */
              ? '' : `<a class="btn btn--amber book__go" href="${b.slug}.html" data-lt-book-go><span data-i18n="lant.shelf.open"></span></a>`) : `<p class="book__moving" data-i18n="lant.shelf.moving"></p>`}
            ${(b.notes || []).map((k) => `<p class="book__note" data-i18n="${need(k, `shelf.json ${b.slug}`)}"></p>`).join('')}
          </div>
        </li>`;
    };
    const rayons = SHELF.shelves.map((s) => `
    <div class="rayon">
      <h2 class="rayon__h" data-i18n="lant.shelf.${s.id}"></h2>
      <ul class="books">${s.books.filter((b) => !b.in).map(book).join('')}
      </ul>
      <div class="plank" aria-hidden="true"></div>
      ${s.notes ? `<div class="legal">${s.notes.map((k) => `<p data-i18n="${need(k, `shelf.json ${s.id}`)}"></p>`).join('')}</div>` : ''}
    </div>`).join('');
    const total = books.reduce((a, b) => a + (ATLAS[b.slug] ? ATLAS[b.slug].acts.flatMap((x) => x.districts) : b.ids).length, 0);
    const passRow = (b) => {
      const A = ATLAS[b.slug], ids = A ? A.acts.flatMap((a) => a.districts) : b.ids;
      return `
      <li class="pass__row" data-lt-pass="${b.slug}" data-empty style="--spine:${b.accent}">
        <div class="pass__head"><h3 data-i18n="${b.title}"></h3><p class="hud" data-lt-pass-n="${ids.length}">${esc(fr('lant.shelf.passRow').replace('{n}', 0).replace('{N}', ids.length))}</p><span class="bar pass__bar" aria-hidden="true"><span class="bar__fill" data-lt-bar></span></span></div>
        <ul class="pass__grid${ids.length > 16 ? ' pass__grid--many' : ''}">${ids.map((id) => `<li class="pass__ks" data-lt-pass-ks="${id}"><span class="ks__q" aria-hidden="true">?</span><span class="sr" data-i18n="lant.ui.unknown"></span></li>`).join('')}</ul>
        ${A ? `<p class="pass__act js-only"><a class="lnk" href="${b.slug}.html"><span data-i18n="lant.shelf.open"></span></a> <button type="button" class="lnk lnk--btn" data-lt-clear="${b.slug}"><span data-i18n="lant.shelf.clear"></span></button></p>` : ''}
      </li>`;
    };
    /* with nothing earned the passport is one line (L-02); the rows come once a keepsake is won, an atlas at 0 as one row */
    const passport = `<ul class="pass" data-lt-pass-list hidden>${books.map(passRow).join('')}
    </ul>`;
    const pt = (n) => fr(need('lant.shelf.passZero', 'the shelf')).replace('{N}', n).replace('{A}', books.length);
    const k1 = ART.keys['lanterne-nuit'];
    holes['lant.shelf.mast'] = `<header class="mast lt-wrap">
  ${WM}
  <p class="mast__title mast__title--shop" data-i18n="lant.shelf.name"></p>
  <nav class="mast__nav" data-i18n-aria="lant.shelf.menuLabel">
    <a href="#rayons" data-i18n="lant.shelf.navAtlases"></a>
    <a class="mast__more" href="#passeport" data-i18n="lant.shelf.navPassport"></a>
    ${TOOLS ? '<a href="outils.html" data-i18n="lant.tools.mast"></a>' : ''}${ENQ ? '<a href="enquetes.html" data-i18n="lant.enq.mast"></a>' : ''}
    <a class="mast__more" href="#comptoir" data-i18n="lant.shelf.navComptoir"></a>
  </nav>
  ${langSwitch()}
  <a class="btn btn--amber mast__cta" href="#rayons" data-i18n="lant.shelf.cta"></a>
  ${menu([['#rayons', 'lant.shelf.navAtlases'], ['#passeport', 'lant.shelf.navPassport'], ['#radio', 'radio.title'], ['#comptoir', 'lant.shelf.navComptoir'], ...(TOOLS ? [['outils.html', 'lant.tools.mast']] : []), ...enqMenu, ['#ronde', 'lant.shelf.navRonde'], [WA, 'lant.ui.wa'], ['../', 'lant.ui.studio'], ['../fabrique.html', 'nav.fab'], ['../monde.html', 'nav.world']])}
</header>`;
    holes['lant.shelf.hero'] = `<div class="hero__art hero__art--key" dir="ltr" role="img" data-i18n-aria="lant.shelf.heroAlt"><img class="hero__back" src="${up(k1.src)}" srcset="${up(k1.small.src)} ${k1.small.w}w, ${up(k1.src)} ${k1.w}w" sizes="(max-width:1010px) 94vw, 58vw" width="${k1.w}" height="${k1.h}" alt="" fetchpriority="high" decoding="async"></div>`;
    holes['lant.shelf.rayons'] = rayons;
    holes['lant.shelf.passport'] = passport;
    holes['lant.shelf.passTotal'] = `<p class="hud" data-lt-pass-total="${total}" data-lt-books="${books.length}">${esc(pt(total))}</p>`;
    holes['lant.radio'] = radioJson;
    const client = { books: books.map((b) => { const A = ATLAS[b.slug]; const ids = A ? A.acts.flatMap((a) => a.districts) : b.ids;
      return { slug: b.slug, key: b.key, live: !!A, store: b.store, migrate: b.migrate || null, ids, ...(b.in ? { in: b.in } : {}),
        acts: A ? A.acts.map((a) => ({ id: a.id, side: !!a.side, districts: a.districts })) : [{ id: 'all', side: false, districts: ids }],
        d: A ? Object.fromEntries(ids.map((id) => [id, { ks: ksOf(A, id) ? up(ksSmall(ksOf(A, id)) || ksOf(A, id)) : null, ...(sealOf(A, id) ? { seal: sealOf(A, id) } : {}), name: dk(A, id, 'name'), keep: dk(A, id, 'keep') }])) : {} }; }) };
    holes['lant.shelf.data'] = dataBlock(client);
    let html = headFor('', 'lant.shelf', page, [['La Librairie Lanterne', '']]) + readFileSync(join(LS, 'shelf.html'), 'utf8');
    out.push({ file: 'hub/lanterne/index.html', name: 'lanterne/index.html', page, html });
    const named = new Set(client.books.flatMap((b) => Object.values(b.d).flatMap((x) => [x.name, x.keep])));
    runtime[page] = lantRuntime((k) => k.startsWith('lant.shelf.') || named.has(k) || RUNTIME_OLD.test(k));
  }
  /* ================= la boîte à outils (2026-11-22, scratchpad courses-biz/PLAN.md §6.6, addendum A1, A2) =================
     one card per app, on its shelf (a category), alphabetical within it (never by what a link earns, §2.5): its name as a
     wordmark plate (no brand artwork), one line on what it is, who it is for, what to check first, then the option without a
     partner link FIRST and at the same weight as the app's own button (§2.5, §6.6: a ghost button each, never the amber
     call to action), then the app's button, and the day and page where its terms were read. On the crypto shelf the free
     lesson is the only button and the app is a plain text link to its official address (the owner's decision A2 keeps the
     link; the card does not sell it). Every link in the markup is the app's plain official address (rel="noopener", no tag): a reader without
     scripts, a crawler and a visitor in a hidden region never get a partner link. Only the apps whose "ref" is set are in
     the page's data, and hub/lanterne.js puts that link on (rel="sponsored noopener", the tag shown) after its region check
     (the visitor's time zone, read on the device, never sent). */
  const appHosts = new Set();
  if (TOOLS) {
    const at = 'hub/src/lanterne/apps.json', page = 'outils';
    const cats = TOOLS.categories, FREE = Object.fromEntries((TOOLS.free || []).map((f) => [f.id, f]));
    const httpsUrl = (u) => { try { const x = new URL(u); return x.protocol === 'https:' && !/\s/.test(u) ? x : null; } catch (e) { return null; } };
    const seen = new Set();
    for (const a of TOOLS.apps) {
      const w = `${at} ${a.id}`;
      if (seen.has(a.id)) fail(`${w}: two apps with this id`); seen.add(a.id);
      if (!cats.some((c) => c.id === a.category)) fail(`${w}: category "${a.category}" is not one of the shelves`);
      const u = httpsUrl(a.url); if (!u) fail(`${w}: url "${a.url}" is not an https address`); else appHosts.add(u.host);
      if (!['affiliate', 'referral', 'none'].includes(a.kind)) fail(`${w}: kind "${a.kind}" is not affiliate, referral or none`);
      if (typeof a.ref !== 'string') fail(`${w}: ref is a string (empty until the owner pastes his link)`);
      if (a.ref) {
        if (a.kind === 'none') fail(`${w}: a ref on an app without a programme (kind none)`);
        if (!httpsUrl(a.ref)) fail(`${w}: ref "${a.ref}" is not an https address`);
        for (const p of a.forbid || []) if (new RegExp(p, 'i').test(a.ref)) fail(`${w}: ref matches "${p}": a personal invite link, whose terms forbid posting it publicly (only the programme's affiliate link may go here)`);
        if (!a.programme || !a.programme.joined) notes.push(`${w}: a ref is set while programme.joined is false`);
      }
      /* the EU/EEA, the UK, the US and their outlying zones, Singapore, Hong Kong (A2; Binance's own rule): Ceuta is Spain,
         the Canaries, Madeira and the Azores are Atlantic/, Svalbard is Arctic/, Midway, Wake and Johnston are the US */
      if (a.category === 'crypto') for (const z of ['Europe/', 'America/', 'Atlantic/', 'Arctic/', 'Africa/Ceuta', 'Asia/Singapore', 'Asia/Hong_Kong', 'Asia/Nicosia', 'Asia/Famagusta', 'Indian/Reunion', 'Indian/Mayotte', 'Pacific/Honolulu', 'Pacific/Guam', 'Pacific/Saipan', 'Pacific/Pago_Pago', 'Pacific/Midway', 'Pacific/Wake', 'Pacific/Johnston', 'US/', 'GB', 'Eire', 'Singapore', 'Hongkong', 'Etc/', 'UTC']) if (!(a.hideTz || []).includes(z)) fail(`${w}: a crypto app's partner link must stay hidden in ${z} (hideTz)`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(a.checked || '')) fail(`${w}: checked is the day its terms were read (YYYY-MM-DD)`);
      else if (!a.unread && a.kind !== 'none') { need(`lant.tools.on.d${a.checked.replace(/-/g, '')}`, w); const t = a.programme && httpsUrl(a.programme.terms || ''); if (!t) fail(`${w}: programme.terms is the https page its terms were read on`); else appHosts.add(t.host); }
      if (!Array.isArray(a.hideTz) || a.hideTz.some((z) => !/^[A-Za-z_]+(\/([A-Za-z0-9_+-]+\/?)*)?$|^[A-Z][A-Za-z0-9_-]*$/.test(z))) fail(`${w}: hideTz is a list of IANA zone names or prefixes ending in /`);
      if (a.category === 'crypto' && !a.risk) fail(`${w}: a crypto app shows its risk line (risk)`);
      for (const k of ['desc', 'who', 'check']) need((a.keys || {})[k] || `(${k})`, w);
      if (a.risk) need(a.risk, w); if (a.hideNote) need(a.hideNote, w);
      for (const f of [].concat(a.free || [])) if (!FREE[f]) fail(`${w}: free option "${f}" is not in the free list`);
    }
    for (const f of TOOLS.free || []) { need(f.key, `${at} free ${f.id}`); if (f.url) { const u = httpsUrl(f.url); if (!u) fail(`${at} free ${f.id}: url is not https`); else appHosts.add(u.host); } if (f.to && !ATLAS[f.to]) fail(`${at} free ${f.id}: atlas "${f.to}" is not published`); }
    for (const c of cats) { need(c.key, at); if (c.note) need(c.note, at); if (c.glyph && !/^\S$/u.test(c.glyph)) fail(`${at} ${c.id}: glyph "${c.glyph}" is not one character`); }
    const P2 = TOOLS.p2; if (!P2 || typeof P2.cleared !== 'boolean' || !Array.isArray(P2.lang) || !Array.isArray(P2.tz)) fail(`${at}: p2 is the France gate { cleared, lang, tz } (PLAN.md §0 P2)`);
    const ext = (u) => ` href="${esc(u)}" target="_blank" rel="noopener" data-app`;
    const host = (u) => new URL(u).host.replace(/^www\./, '');
    /* the option without a partner link: a ghost button when it has an address (as heavy as the app's own), else its line */
    const freeLine = (id) => { const f = FREE[id];
      if (f.to) return `<p class="tl-free"><a class="btn tl-free__go tl-free__go--in" href="${f.to}.html"><span data-i18n="${f.key}"></span> <span class="tl-free__n" data-i18n="${need(books.find((b) => b.slug === f.to).title, at)}"></span></a></p>`;
      if (f.url) return `<p class="tl-free"><a class="btn tl-free__go"${ext(f.url)}><bdi>${esc(f.name)}</bdi><span class="sr" data-i18n="case.newTab"></span><span aria-hidden="true"> ↗</span></a> <span class="tl-free__t" data-i18n="${f.key}"></span></p>`;
      /* the working route said once, on its shelf (L-06): the cards point to it */
      if (f.route) return `<p class="tl-free"><a class="tl-free__to" href="#tl-route-${f.id}" data-i18n="${need(f.route.to, at)}"></a></p>`;
      return `<p class="tl-free tl-free--t" data-i18n="${f.key}"></p>`; };
    const routes = (c) => (TOOLS.free || []).filter((f) => f.route && f.route.cat === c.id).map((f) => `
      <div class="tl-route" id="tl-route-${f.id}" tabindex="-1">
        <h3 class="tl-route__h" data-i18n="${need(f.route.h, at)}"></h3>
        <dl class="tl-route__dl">
          <div><dt data-i18n="${need(f.route.dzK, at)}"></dt><dd data-i18n="${f.key}"></dd></div>
          <div><dt data-i18n="${need(f.route.outK, at)}"></dt><dd data-i18n-html="${need(f.route.out, at)}"></dd></div>
        </dl>
      </div>`).join('');
    const read = (a) => a.unread ? `<p class="tl-read tl-read--no" data-lt-tpl="lant.tools.unread" data-lt-host="${esc(host(a.url))}">${esc(fr('lant.tools.unread').replace('{host}', host(a.url)))}</p>`
      : a.kind === 'none' ? `<p class="tl-read" data-i18n="lant.tools.noProg"></p>`
      /* the day the card was checked, in the visitor's terms (L-17: the partner programme's page is our bookkeeping) */
      : `<p class="tl-read"><span data-i18n="lant.tools.read"></span> <span data-i18n="lant.tools.on.d${a.checked.replace(/-/g, '')}"></span></p>`;
    const card = (a, n) => { const quiet = a.category === 'crypto', fr0 = [].concat(a.free || []), paid = fr0.some((id) => FREE[id].paid); return `
        <li class="tl-card${quiet ? ' tl-card--quiet' : ''}" id="tl-app-${a.id}" data-tl-app="${a.id}">
          <a class="tl-logo"${ext(a.url)} data-tl-go tabindex="-1" aria-hidden="true" style="--len:${Math.max(4, a.name.length)}"><span class="tl-logo__i" dir="ltr">/ ${String(n + 1).padStart(2, '0')}</span><span class="tl-logo__n" dir="ltr">${esc(a.name)}</span><span class="tl-logo__tag" data-tl-tag hidden data-i18n="lant.tools.tag"></span></a>
          <div class="tl-card__body">
            <div class="tl-card__main">
              <h3 class="tl-card__h"><bdi dir="ltr">${esc(a.name)}</bdi></h3>
              <p class="tl-card__d" data-i18n="${a.keys.desc}"></p>${a.unread ? `
              <p class="tl-unread" data-i18n="lant.tools.unreadK"></p>` : ''}${a.risk ? `
              <p class="tl-risk"><b class="tl-risk__k" data-i18n="lant.tools.f.risk"></b> <span data-i18n="${a.risk}"></span></p>` : ''}
              <dl class="tl-facts">
                <div><dt data-i18n="lant.tools.f.who"></dt><dd data-i18n="${a.keys.who}"></dd></div>
                <div><dt data-i18n="lant.tools.f.check"></dt><dd data-i18n="${a.keys.check}"></dd></div>
              </dl>
            </div>
            <div class="tl-card__side">
              <div class="tl-alt">
                <p class="tl-alt__k" data-i18n="${paid ? 'lant.tools.f.alt' : 'lant.tools.f.free'}"></p>${fr0.map(freeLine).join('')}
              </div>
              ${quiet ? `<p class="tl-act tl-act--quiet"><span class="tl-act__k" data-i18n="lant.tools.official"></span> <a class="tl-link"${ext(a.url)} data-tl-go><span class="tl-go__tag" data-tl-tag hidden data-i18n="lant.tools.tag"></span><bdi class="tl-host" dir="ltr">${esc(host(a.url))}</bdi><span class="sr"> (<bdi>${esc(a.name)}</bdi>)</span><span class="sr" data-i18n="case.newTab"></span><span aria-hidden="true"> ↗</span></a></p>`
              : `<p class="tl-act"><a class="btn tl-go"${ext(a.url)} data-tl-go><span class="tl-go__tag" data-tl-tag hidden data-i18n="lant.tools.tag"></span><span class="tl-go__t"><span data-i18n="lant.tools.go"></span> <bdi>${esc(a.name)}</bdi><span class="sr" data-i18n="case.newTab"></span><span aria-hidden="true"> ↗</span></span></a><span class="tl-host" dir="ltr">${esc(host(a.url))}</span></p>`}
              <p class="tl-note" data-tl-note hidden data-i18n="${a.hideNote || 'lant.tools.hideNote'}"></p>
              ${read(a)}
            </div>
          </div>
        </li>`; };
    const byName = (x, y) => x.name.localeCompare(y.name, 'en', { sensitivity: 'base' });
    const shelves = cats.map((c) => { const apps = TOOLS.apps.filter((a) => a.category === c.id).sort(byName); return apps.length ? `
    <section class="tl-cat" id="tl-${c.id}" aria-labelledby="tl-${c.id}-h">
      <div class="tl-cat__head"><h2 class="tl-cat__h" id="tl-${c.id}-h">${c.glyph ? `<span class="tl-cat__g" lang="ja" aria-hidden="true" data-decorative>${esc(c.glyph)}</span>` : ''}<span data-i18n="${c.key}"></span></h2>${c.note ? `<p class="tl-cat__note" data-i18n="${c.note}"></p>` : ''}</div>${routes(c)}
      <ul class="tl-grid">${apps.map(card).join('')}
      </ul>
    </section>` : ''; }).join('');
    const data = { tools: TOOLS.apps.filter((a) => a.ref && httpsUrl(a.ref)).map((a) => ({ id: a.id, ref: a.ref, sub: a.sub || '', hide: a.hideTz || [] })) };
    if (!P2.cleared && data.tools.length) data.p2 = { lang: P2.lang, tz: P2.tz };
    let head = headFor('outils.html', 'lant.tools', page, [['La Librairie Lanterne', ''], [fr('lant.tools.mast'), 'outils.html']]);
    head = swap(head, '<link rel="stylesheet" href="../css/lanterne.css?v={{stamp}}">', '<link rel="stylesheet" href="../css/lanterne.css?v={{stamp}}">\n<link rel="stylesheet" href="../css/outils.css?v={{stamp}}">', 1, "the toolbox's sheet");
    const html = `${head}
<body class="lt lt-tools" data-lt-tools>
<a class="skip" href="#tl-rayons" data-i18n="lant.tools.nav.cats"></a>
<header class="mast lt-wrap">
  ${WM}
  <a class="mast__back" href="./" data-i18n="lant.ui.library"></a>
  <p class="mast__title" data-i18n="lant.tools.mast"></p>
  <nav class="mast__nav" data-i18n-aria="lant.tools.nav.menu">
    <a href="#tl-disc" data-i18n="lant.tools.nav.disc"></a>
    <a href="#tl-how" data-i18n="lant.tools.nav.how"></a>
  </nav>
  ${langSwitch()}
  ${menu([['./', 'lant.ui.library'], ['#tl-disc', 'lant.tools.nav.disc'], ...cats.map((c) => ['#tl-' + c.id, c.key]), ['#tl-how', 'lant.tools.nav.how'], ['./#comptoir', 'lant.shelf.navComptoir'], [WA, 'lant.ui.wa'], ['../', 'lant.ui.studio']])}
</header>
<main id="main" class="lt-wrap tl">
  <section class="tl-hero" aria-labelledby="tl-h">
    <div class="tl-hero__copy">
    <p class="k k--amber" data-i18n="lant.tools.kicker"></p>
    <h1 class="tl-hero__h" id="tl-h"><span data-i18n="lant.tools.h1a"></span> <em data-i18n="lant.tools.h1b"></em></h1>
    <p class="tl-hero__lead" data-i18n="lant.tools.lead"></p>
    </div>
    <img class="tl-hero__art" src="${up(ART.cut.pigeonStand.src)}" width="${ART.cut.pigeonStand.w}" height="${ART.cut.pigeonStand.h}" alt="" fetchpriority="high" decoding="async">
  </section>
  <!-- the disclosure, at the top and always visible (law 18-05 art. 30, the EU brief, the FTC: PLAN.md §2.3). It leads with
       the state of the page: no partner link (true without scripts, and until one is on for this visitor), then the rule
       for later. Once hub/lanterne.js puts a partner link on, it swaps to the other state (data-tl-some). No « same
       price » line: no programme's tracked price has been compared with its direct price (§2.3). -->
  <aside class="tl-disc" id="tl-disc" data-i18n-aria="lant.tools.nav.disc">
    <p class="tl-disc__t" data-tl-none><b class="tl-disc__k" data-i18n="lant.tools.disc.noneK"></b> <span data-i18n="lant.tools.disc.none"></span></p>
    <p class="tl-disc__t" data-tl-some hidden><b class="tl-disc__k" data-i18n="lant.tools.disc.k"></b> <span data-i18n="lant.tools.disc.some"></span></p>
    <p class="tl-disc__rule" data-tl-none data-i18n="lant.tools.disc.t"></p>
  </aside>
  <nav class="tl-toc" id="tl-rayons" aria-labelledby="tl-toc-k" tabindex="-1">
    <p class="k" id="tl-toc-k" data-i18n="lant.tools.nav.cats"></p>
    <ul class="tl-toc__ul">${cats.map((c) => `<li><a href="#tl-${c.id}" data-i18n="${c.key}"></a></li>`).join('')}</ul>
  </nav>${shelves}
  <section class="tl-how" id="tl-how" aria-labelledby="tl-how-h">
    <h2 class="tl-how__h" id="tl-how-h" data-i18n="lant.tools.how.h"></h2>
    <p class="tl-how__t" data-i18n="lant.tools.how.t"></p>
    <p class="tl-legal" data-i18n="lant.tools.legal"></p>
  </section>
</main>
${stFoot('')}
${dataBlock(data)}
${scripts(['../lanterne.js', '../../assets/carry.js'])}
</body>
</html>
`;
    out.push({ file: 'hub/lanterne/outils.html', name: 'lanterne/outils.html', page, html });
    runtime[page] = new Set(TOOLS.apps.some((a) => a.unread) ? ['lant.tools.unread'] : []);   // a template hub/lanterne.js fills ({host})
  }

  let ENQG = null;
  /* ================= les enquêtes de nuit (2026-11-23, scripts/lib/enquetes.mjs) =================
     the page, its checks and the strings its engine writes; its sources' hosts join the toolbox's (a source there is a
     plain link to the page that was read, marked data-app like an app's official address) */
  if (ENQ) {
    ENQG = enquetes({ LS, HUB, DICT, LANGS, fail, notes, esc, json, need, headFor, swap, menu, langSwitch, scripts, radioJson, WA, TOOLS, WM, stFoot });   // WM, stFoot: the Librairie's mark and foot, for E-05
    if (ENQG) { out.push(ENQG.out); runtime[ENQG.out.page] = ENQG.runtime; for (const hst of ENQG.hosts) appHosts.add(hst); }
  }

  /* the French runtime strings each page writes itself (the rest is baked) */
  for (const { page } of out) holes[`lantFr.${page.replace(/[^a-z]/g, '')}`] = JSON.stringify(Object.fromEntries([...runtime[page]].filter((k) => !(lazyFr[page] && k in lazyFr[page])).sort().map((k) => [k, DICT.fr[k]]))).replace(/</g, '\\u003c');
  const files = Object.entries(lazyFr).map(([page, o]) => [`hub/lanterne/i18n/${page}.fr.js`, `/* GENERATED by scripts/build-hub.mjs (scripts/lib/lanterne.mjs): the French lines the labs of hub/lanterne/${page}.html write themselves, fetched with them (hub/lanterne.js). */\nwindow.LANT_XFR = ${JSON.stringify(o).replace(/</g, '\\u003c')};\n`]);
  /* the open night cases' own files (hub/lanterne/enq/: their structure and their strings, added when a case opens) */
  if (ENQG) files.push(...ENQG.files);

  /* ================= the old manual's address: a forwarding stub (§1.4) ================= */
  const pub = Object.fromEntries(live.map((b) => [b.slug, 1]));
  /* every other id of the old page (a fiche's field or heading, a lab's input, a shelf section's heading) goes where it
     lives now: the district that holds it on its atlas (the atlas opens a district named in the address), or the same id
     on the shelf or on an atlas outside its districts (rev2: they all landed on the shelf's top). Read from the old
     page's source (hub/src/manuel.html) and the pages just built; the source lists and the tabs keep their rules below */
  const oldIds = existsSync(join(SRC, 'manuel.html')) ? new Set([...readFileSync(join(SRC, 'manuel.html'), 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])) : new Set();
  /* the nine web3 modules left hub/src/manuel.html before the Librairie (lanterne-later/, L9); their stops' markup was cut
     verbatim into ex/web3-modules/, so the ids there are the old page's own (a lab's line, a source): they count as old */
  const W3M = join(LS, 'ex', 'web3-modules');
  if (existsSync(W3M)) for (const f of readdirSync(W3M)) if (/^m\d\d\.html$|^_sources\.html$|^_jact-/.test(f)) for (const m of readFileSync(join(W3M, f), 'utf8').matchAll(/\sid="([^"]+)"/g)) if (!/^sources-m\d$/.test(m[1])) oldIds.add(m[1]);
  const firstOf = ATLAS['web3-modules'] ? Object.fromEntries(ATLAS['web3-modules'].acts.map((a) => [a.id, a.districts[0]])) : {};
  const OWN = /^(bsrc-|wsrc-|nsrc-|src-s\d|m\d+src-|ls-[tp]-|hub-fr$|hub-prices$|hub-radio$|main$|menu$)/;
  const lives = {};
  for (const o of out) {
    const slug = o.file === 'hub/lanterne/index.html' ? '' : o.file.slice(13, -5);
    const h = o.html.replace(/\{\{([^}]+)\}\}/g, (all, k) => (typeof holes[k] === 'string' ? holes[k] : ''));
    const ds = [...h.matchAll(/<section class="district" id="([^"]+)"/g)].map((m) => [m.index, m[1]]);
    const end = ds.length ? h.indexOf('id="journal"', ds[ds.length - 1][0]) : -1;
    for (const m of h.matchAll(/\sid="([^"]+)"/g)) {
      if (!oldIds.has(m[1]) || OWN.test(m[1])) continue;
      const inD = ds.length && m.index >= ds[0][0] && m.index < end ? ds.filter(([at]) => at <= m.index).pop()[1] : null;
      (lives[m[1]] = lives[m[1]] || new Set()).add(`${slug}#${inD || m[1]}`);
    }
  }
  const M = Object.fromEntries(Object.entries(lives).filter(([, v]) => v.size === 1).map(([k, v]) => [k, [...v][0]]).sort());
  for (const [k, v] of Object.entries(lives)) if (v.size > 1) notes.push(`the stub: the old id #${k} lives in ${v.size} places now (${[...v].join(', ')}): it lands on the shelf`);
  const router = `(function(){var P=${JSON.stringify(pub)},M=${JSON.stringify(M)},s=location.search,h=location.hash.slice(1),q=new URLSearchParams(s),ls=q.get('ls')||'',l=q.get('lang');
var V=P['web3-modules']?'web3-modules':'',F=${JSON.stringify(firstOf)};
var of=function(id){return /^b[1-9]$/.test(id)?'marque':/^w[1-8]$/.test(id)?'web3':/^n[1-8]$/.test(id)?'route':/^g[1-8]$/.test(id)?'jeu':/^(pay|bank|rate|treso|crypto)$/.test(id)?'argent':/^m[1-9][0-9]$/.test(id)?(V||'web3'):'';},mm=function(id){return /^m/.test(id)&&!V?'':id;};
var S={lessons:'argent',marque:'marque',web3:'web3',nomade:'route',jeu:'jeu'},R={radio:'#radio','hub-radio':'#radio',game:'#ronde',services:'#comptoir'},to='',at='',k=h.replace(/^ls-[tp]-/,''),H=h.replace(/-h$/,'');
if(ls&&of(ls)){to=of(ls);at=mm(ls);}
else if(M[h]){to=M[h].split('#')[0];at=M[h].split('#')[1];}
else if(S[h]||S[H]){to=S[h]||S[H];}
else if(k!==h&&of(k)){to=of(k);at=mm(k);}
else if(of(h)){to=of(h);at=mm(h);}
else if(H!==h&&of(H)){to=of(H);at=mm(H);}
else if(/^web3-m[1-9](-h)?$/.test(h)){to=V||'web3';at=V?F[h.slice(5,7)]:'';}
else if(/^bsrc-/.test(h)){to='marque';at=h;}else if(/^wsrc-/.test(h)){to='web3';at=h;}else if(/^m[1-9]src-/.test(h)){to=V||'web3';at=V?h:'';}
else if(/^nsrc-/.test(h)){to='route';at=h;}else if(/^src-s[0-9]+$/.test(h)){to='jeu';at=h;}
var u=to&&P[to]?'lanterne/'+to+'.html':'lanterne/';if(to&&!P[to])at='';if(!to&&R[h])at=R[h].slice(1);
if(l==='en'||l==='ar')u+='?lang='+l;if(at)u+='#'+at;location.replace(u);})();`;
  const stubLines = LANGS.map((l) => `<div lang="${l}" dir="${l === 'ar' ? 'rtl' : 'ltr'}"><h1>${esc(DICT[l]['lant.stub.t'] || '')}</h1><p><a href="lanterne/${l === 'fr' ? '' : '?lang=' + l}">${esc(DICT[l]['lant.stub.go'] || '')}</a></p></div>`).join('\n  ');
  for (const k of ['lant.stub.t', 'lant.stub.go', 'lant.stub.title', 'lant.stub.desc']) need(k, 'the stub');
  const stub = `<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(fr('lant.stub.title'))}</title>
<meta name="description" content="${esc(fr('lant.stub.desc'))}">
<meta name="robots" content="noindex">
<link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
<!-- GENERATED by scripts/build-hub.mjs (scripts/lib/lanterne.mjs): the old manual's address since 2026-11-21. The
     Librairie Lanterne holds its courses; this page sends every old address (an anchor, ?ls=, ?lang=) to its new
     home (SPEC §1.4), with script at once and without script after the refresh. Kept at least 12 months (L2). -->
<script>${router}</script>
<noscript><meta http-equiv="refresh" content="0;url=lanterne/"></noscript>
<style>body{margin:0;padding:40px 20px;background:#D8CBB8;color:#211E1B;font:16px/1.5 system-ui,sans-serif}main{max-width:640px;margin:0 auto;display:grid;gap:18px}h1{font-size:20px;line-height:1.35;margin:0 0 6px}a{color:#8A3127;font-weight:700}</style>
</head>
<body>
<main>
  ${stubLines}
</main>
</body>
</html>
`;
  out.push({ file: 'hub/manuel.html', name: 'manuel.html', page: null, html: stub });

  const generated = ['lanterne/index.html', ...live.map((b) => `lanterne/${b.slug}.html`), ...(TOOLS ? ['lanterne/outils.html'] : []), ...(ENQ ? ['lanterne/enquetes.html'] : []), ...out.filter((o) => o.page).flatMap((o) => ['en', 'ar'].map((l) => `lanterne/i18n/${o.page}.${l}.js`)), ...files.map(([f]) => f.slice(4))];
  return { out, holes, runtime, generated, files, live: live.map((b) => b.slug), books, ATLAS, appHosts };
}
