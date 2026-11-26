#!/usr/bin/env node
/**
 * Builds the Studio page, hub/index.html, the manual, hub/manuel.html, and
 * their dictionary hub/i18n.js, from hub/src — `node scripts/build-hub.mjs`
 * (`--check`: write nothing, exit 1 if a file differs from what the sources
 * give).
 *
 *   hub/src/page.html            the Studio: head, nav, screens 01-12, footer
 *   hub/src/monde.html           the world's body (the codex, the personal
 *                                dossiers, the Lab, the diary); its head is
 *                                the Studio's too, re-addressed here
 *   hub/src/fabrique.html        la fabrique's body (2026-11-19: the four scenes
 *                                of the owner's "Outside the Artboard", two
 *                                six-lesson sets, the references); its head is
 *                                the Studio's, re-addressed here
 *   hub/src/manuel.html          the manual's body (the lessons, the coaching
 *                                services, the radio); its head is the
 *                                Studio's, re-addressed here
 *   hub/src/cases/<slug>.html    the five cases of 09 Proof, each inlined at
 *                                its <!-- CASE:<slug> --> marker (a missing
 *                                fragment leaves the marker's place empty)
 *   hub/src/cases/<slug>.i18n.json   { fr, en, ar }: a case's own copy, its
 *                                keys under cases.<slug>.
 *   hub/src/i18n/{fr,en,ar}.json the page's copy, nested; flattened here to
 *                                the dotted keys the markup names
 *                                (services.items.0.gets.1)
 *
 * The page is static HTML with French baked in, so it reads whole with
 * scripts off and search engines see French; English and Arabic ship in
 * hub/i18n.js, which the head script fetches only for a visitor who asked
 * for them (or app.js, on a switch). Markup conventions are the site's
 * (assets/page-i18n.js): data-i18n (text), data-i18n-html (our own inline
 * markup), data-i18n-alt, data-i18n-aria, data-i18n-title; an element that
 * carries data-i18n or data-i18n-html is written empty in the template and
 * the build fills it. Two more, for the head only: data-i18n-content on a
 * meta and data-i18n-doc on the title are baked and dropped.
 *
 * A dictionary value "@home:<key>" is the home page's own string
 * (assets/i18n/<lang>.js): the FAQ answers, the Aperçu's terms and message,
 * the estimator's labels and the freelancers' row are the site's settled
 * wording and follow it when the owner changes it there. The estimator's
 * figures come from assets/app.js itself (the ESTIMATE model, the rush
 * factors, the exchange rates and the maintenance range), written into the
 * page as a JSON block, and its starting estimate is baked from the same
 * model: nothing here restates a price.
 *
 * Refused (the build fails and says where): a key missing in one language,
 * a key the markup names that no dictionary has, an <img> without alt or
 * data-i18n-alt, an image whose width/height differ from its file (when
 * absent they are written from the file), a local file that does not
 * exist, an http(s) resource (a src), a link to a host outside the
 * allow-list, a style attribute other than custom properties, an inline
 * on*= handler. A hub/img file no page part references fails the
 * build (it is only listed while a case's fragment is still missing). The output is stable: keys sorted,
 * no dates, so two runs leave no diff.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { BASE } from './site.mjs';
import { withCsp, cspKind } from './lib/csp.mjs';
import { withGtag } from './lib/gtag.mjs';
import { loadDicts } from './lib/i18n.mjs';
import { AYN } from './lib/ayn.mjs';
import { WORDMARK } from './lib/wordmark.mjs';
import { lanterne } from './lib/lanterne.mjs';
import { carte, CARTE_HOSTS } from './lib/carte.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const HUB = join(ROOT, 'hub'), SRC = join(HUB, 'src');
const LANGS = ['fr', 'en', 'ar'];
// the cases in the design's order (09 Proof): the four delivered clients
// (Nomara joined on 2026-11-24, wave 3), then the founder's two; a fragment
// may be named by its short slug too (bordj for bordjsteel)
const CASES = [['bordjsteel', 'bordj'], ['alliance'], ['almaflow'], ['nomara'], ['traveler'], ['heetch']];
const stamp = (readFileSync(join(ROOT, 'index.html'), 'utf8').match(/\?v=(\d+)/) || [, '1'])[1];
const errors = [], notes = [];
const fail = (m) => errors.push(m);

/* ---------------- dictionaries ---------------- */
const HOME = loadDicts();
const flatten = (o, pre = '', out = {}) => {
  for (const [k, v] of Object.entries(o)) {
    const key = pre ? `${pre}.${k}` : k;
    if (v && typeof v === 'object') flatten(v, key, out); else out[key] = String(v);
  }
  return out;
};
/* French typography, as the home's dictionaries write it: a narrow
   no-break space before ? ! ; : » and after «, so none of them opens a
   line (check.mjs 8f holds the home to it). Applied to our own French
   strings; the home's arrive already set. */
const frTypo = (s) => s.replace(/ ([?!;:»])/g, ' $1').replace(/« /g, '« ');
const resolve = (lang, dict, file) => {
  const out = {};
  for (const [k, v] of Object.entries(dict)) {
    const m = /^@home:(.+)$/.exec(v);
    if (m) {
      if (HOME[lang][m[1]] == null) fail(`${file}: ${k} names @home:${m[1]}, which assets/i18n/${lang}.js does not have`);
      out[k] = HOME[lang][m[1]] ?? '';
    } else out[k] = lang === 'fr' ? frTypo(v) : v;
  }
  return out;
};
const DICT = {};
for (const l of LANGS) {
  const file = `hub/src/i18n/${l}.json`;
  DICT[l] = resolve(l, flatten(JSON.parse(readFileSync(join(ROOT, file), 'utf8'))), file);
}

/* ---------------- the reel ----------------
   hub/src/reel.json lists the motion section's clips (scripts/motion-add.mjs
   appends to it): id, src (an .mp4 under hub/img), poster, w and h, tall for
   a portrait clip, and name and what in each language (French stands in for
   a missing one). Their texts join the dictionary as motion.reel.items.<id>. */
const REEL = JSON.parse(readFileSync(join(SRC, 'reel.json'), 'utf8'));
for (const c of REEL) {
  if (!/^[a-z0-9-]+$/.test(c.id || '')) fail(`hub/src/reel.json: a clip's id must be lowercase letters, digits and hyphens ("${c.id}")`);
  for (const f of ['src', 'poster']) if (!c[f] || !existsSync(join(HUB, c[f]))) fail(`hub/src/reel.json ${c.id}: ${f} "${c[f]}" is not a file under hub/`);
  if (!(c.w > 0 && c.h > 0) || !c.name || !c.name.fr) fail(`hub/src/reel.json ${c.id}: w, h and a French name are needed`);
  for (const l of LANGS) {
    DICT[l][`motion.reel.items.${c.id}.name`] = (c.name && (c.name[l] || c.name.fr)) || '';
    DICT[l][`motion.reel.items.${c.id}.what`] = (c.what && (c.what[l] || c.what.fr)) || '';
  }
}

/* ---------------- the radio ----------------
   hub/src/radio.json lists the workshop radio's tracks: id, src (an .mp3 in
   hub/audio), dur in seconds, and a name in each language. A file in
   hub/audio that the list does not name fails the build, as art does. */
const RADIO = JSON.parse(readFileSync(join(SRC, 'radio.json'), 'utf8'));
for (const tr of RADIO) {
  if (!/^[a-z0-9-]+$/.test(tr.id || '')) fail(`hub/src/radio.json: a track's id must be lowercase letters, digits and hyphens ("${tr.id}")`);
  if (!tr.src || !/^audio\/[a-z0-9-]+\.mp3$/.test(tr.src) || !existsSync(join(HUB, tr.src))) fail(`hub/src/radio.json ${tr.id}: src "${tr.src}" is not an .mp3 in hub/audio`);
  if (!(tr.dur > 0) || !tr.name || !tr.name.fr) fail(`hub/src/radio.json ${tr.id}: dur and a French name are needed`);
  for (const l of LANGS) DICT[l][`radio.tracks.${tr.id}.name`] = (tr.name && (tr.name[l] || tr.name.fr)) || '';
}
if (existsSync(join(HUB, 'audio'))) for (const f of readdirSync(join(HUB, 'audio'))) if (!RADIO.some((tr) => tr.src === `audio/${f}`)) fail(`hub/audio/${f} is not a track of hub/src/radio.json`);
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

/* ---------------- cases ---------------- */
const fragments = {};
let casesIn = 0;
const caseCss = [];
for (const names of CASES) {
  const name = names.find((n) => existsSync(join(SRC, 'cases', `${n}.html`)));
  fragments[names[0]] = '';
  if (!name) continue;
  casesIn++;
  fragments[names[0]] = readFileSync(join(SRC, 'cases', `${name}.html`), 'utf8').trim();
  const jf = join(SRC, 'cases', `${name}.i18n.json`);
  if (existsSync(jf)) {
    const all = JSON.parse(readFileSync(jf, 'utf8'));
    for (const l of LANGS) {
      if (!all[l]) { fail(`hub/src/cases/${name}.i18n.json: no "${l}" block`); continue; }
      const flat = flatten(all[l]);
      const pre = Object.fromEntries(Object.entries(flat).map(([k, v]) => [k.startsWith('cases.') ? k : `cases.${name}.${k}`, v]));
      Object.assign(DICT[l], resolve(l, pre, `hub/src/cases/${name}.i18n.json`));
    }
  }
  for (const n of names) if (existsSync(join(HUB, 'css', `case-${n}.css`))) { caseCss.push(`css/case-${n}.css`); break; }
}
/* plural sets (the Librairie's counts, 2026-11-21): Arabic has forms French and English do not (Intl.PluralRules:
   zero one two few many other); those languages take their own .other there, so the three keep one set of keys, and
   every Arabic set a French one/other set opens must be complete */
/* La carte (2026-11-21, scripts/lib/carte.mjs): its words, { fr, en, ar } with keys carte.*, as a case's are */
{
  const all = JSON.parse(readFileSync(join(SRC, 'carte.i18n.json'), 'utf8'));
  for (const l of LANGS) { if (!all[l]) fail(`hub/src/carte.i18n.json: no "${l}" block`); else Object.assign(DICT[l], resolve(l, flatten(all[l]), 'hub/src/carte.i18n.json')); }
}
for (const k of Object.keys(DICT.ar)) { const m = /^(.*)\.(zero|two|few|many)$/.exec(k); if (m) for (const l of ['fr', 'en']) if (DICT[l][k] == null && DICT[l][m[1] + '.other'] != null) DICT[l][k] = DICT[l][m[1] + '.other']; }
for (const k of new Set(LANGS.flatMap((l) => Object.keys(DICT[l]))))
  for (const l of LANGS) if (DICT[l][k] == null) fail(`key ${k}: missing in ${l}`);
for (const k of Object.keys(DICT.fr)) if (/\.other$/.test(k) && DICT.fr[k.replace(/other$/, 'one')] != null && /^lant\./.test(k))
  for (const c of ['zero', 'one', 'two', 'few', 'many', 'other']) if (DICT.ar[k.replace(/other$/, c)] == null) fail(`key ${k.replace(/other$/, c)}: the Arabic plural set is incomplete`);

/* ---------------- prices: the home's own model ---------------- */
const APP = readFileSync(join(ROOT, 'assets/app.js'), 'utf8');
const grab = (re, what) => { const m = re.exec(APP); if (!m) throw new Error(`assets/app.js: ${what} not found`); return m; };
const estSrc = APP.slice(APP.indexOf('var ESTIMATE = (function () {'), APP.indexOf('})();', APP.indexOf('var ESTIMATE = (function () {')) + 5);
const ESTIMATE = new Function(`${estSrc}\nreturn ESTIMATE;`)();
const [, rushP, rushW] = grab(/var RUSH_PRICE = ([\d.]+), RUSH_WEEKS = ([\d.]+);/, 'RUSH_PRICE / RUSH_WEEKS');
const FX = new Function(`return ${grab(/var FX = (\{[^}]*\});/, 'FX')[1]}`)();
const RETAINER = JSON.parse(grab(/var RETAINER = (\[[^\]]*\]);/, 'RETAINER')[1]);
if (Number(rushP) !== ESTIMATE.RUSH_PRICE) fail('assets/app.js: RUSH_PRICE read twice, two values');
const PRICES = {
  model: Object.fromEntries(Object.entries(ESTIMATE.PRICE_MODEL).map(([k, m]) => [k, { ...m, u: m.u.replace(/^price\./, '') }])),
  opts: Object.fromEntries(Object.entries(ESTIMATE.PRICE_OPTS).map(([k, o]) => [k, { add: o.add, weeks: o.weeks, ...(o.only ? { only: o.only } : {}), ...(o.one ? { one: o.one } : {}) }])),
  rush: [Number(rushP), Number(rushW)], fx: { EUR: FX.EUR, USD: FX.USD }, retainer: RETAINER, mid: ESTIMATE.MID_RANGE,
  // what the same project costs on three markets (the price guide's sourced table, assets/app.js 14): [low, high, open-ended]
  market: new Function(`return ${grab(/var MARKET = (\{[\s\S]*?\n    \});/, 'MARKET')[1]}`)(),
  // the design services' approved figures and lead times (la carte, 2026-11-21): the page reads them from here too
  design: ESTIMATE.DESIGN,
};
/* The figures as the home's estimator writes them (assets/app.js 12a):
   French and Arabic group with a narrow no-break space and put the currency
   after; English groups with commas and puts € and $ first. hub/app.js
   formats with the same rules. */
const fmt = (lang) => {
  const en = lang === 'en', sp = en ? ',' : ' ';
  const grp = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sp);
  const dash = en ? '⁠–⁠' : ' –⁠ ';
  const tidy = (n, c) => { const g = c === 'DZD' ? (n >= 1e6 ? 50000 : n >= 150000 ? 10000 : 5000) : (n >= 10000 ? 500 : n >= 1000 ? 100 : 10); return Math.max(g, Math.round(n / g) * g); };
  const sym = (c) => (c === 'DZD' ? DICT[lang]['pricing.cur'] : c === 'EUR' ? '€' : '$');
  return (lo, hi, c) => {
    const a = c === 'DZD' ? lo : tidy(lo / PRICES.fx[c], c), b = c === 'DZD' ? hi : tidy(hi / PRICES.fx[c], c);
    return en && c !== 'DZD' ? sym(c) + grp(a) + dash + grp(b) : grp(a) + dash + grp(b) + ' ' + sym(c);
  };
};
const M0 = ESTIMATE.PRICE_MODEL.vitrine, q0 = ESTIMATE.quote('vitrine', M0.def, [], false), f0 = fmt('fr');
const EST = {
  n: M0.def, min: M0.min, max: M0.max, step: M0.step,
  dz: f0(q0.lo, q0.hi, 'DZD'), eu: f0(q0.lo, q0.hi, 'EUR'), us: f0(q0.lo, q0.hi, 'USD'),
  w: `${q0.wLo}–${q0.wHi}`, care: f0(RETAINER[0], RETAINER[1], 'DZD'),
};
/* The console's starting screen and receipt, as hub/app.js 6 writes them in
   French (a reader without scripts gets these): the type and its size, what
   the package covers and what a unit over it adds, one row per line of the
   quote, the two totals. */
const grpFr = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f');
const countedFr = (u, n) => `${n} ${DICT.fr[`pricing.unitsN.${u}`].split('|')[n === 1 ? 0 : 1]}`;
const U0 = M0.u.replace(/^price\./, '');
Object.assign(EST, {
  what: `${DICT.fr['pricing.types.vitrine']} · ${countedFr(U0, M0.def)}`,
  incl: `${DICT.fr['pricing.rc.base']} ${countedFr(U0, M0.base_u)}. ${DICT.fr['pricing.beyond']} + ${f0(M0.unit[0], M0.unit[1], 'DZD')} / ${DICT.fr[`pricing.unitsN.${U0}`].split('|')[0]}`,
  lo: grpFr(q0.lo), hi: grpFr(q0.hi),
});
if (q0.lines.length !== 1 || q0.lines[0].k !== 'base') fail('build-hub.mjs: the starting quote is no longer one line (the baked receipt row assumes it)');
/* The money section's prices, from the same model (a card and the console cannot disagree), in French as baked. */
const MA = ESTIMATE.PRICE_MODEL.argent, MO = ESTIMATE.PRICE_OPTS, da = (n) => `${grpFr(n)}\u00a0${DICT.fr['pricing.cur']}`;
const kitQ = ESTIMATE.quote('argent', MA.kit.at, MA.kit.needs, false);
const MONEY = {
  call: da(MA.base[0]), setup: da(MO.setup.add[0]), pack: da(MO.pack.add[0]), guides: da(MO.guides.add[0]), guideOne: da(MO.guides.one),
  kit: da(kitQ.lo), kitWas: da(kitQ.lo + MA.kit.off),
};
if (kitQ.lo !== kitQ.hi) fail('build-hub.mjs: the nomad kit is no longer one figure');
/* The motion line's figures, from the same model, in French as baked (hub/app.js 6 writes them again in the page's language). */
const MM = ESTIMATE.PRICE_MODEL.motion;
const MOTION = {
  logo: f0(MM.base[0], MM.base[1], 'DZD'), sec: `+\u00a0${f0(MM.unit[0], MM.unit[1], 'DZD')}`, anim: `+\u00a0${f0(MO.anim.add[0], MO.anim.add[1], 'DZD')}`,
};
// a clip marked "studio": false (MERCURY, act 2: a personal film, services/SPEC.md §7) stays on the world page, out of the Studio's reel
// a clip marked "retired" (why, in words) is off the reel; its files stay, counted as kept, until it is re-recorded
// (2026-11-22: « Le tampon » showed the retired manual page)
const REEL_TILES = REEL.filter((c) => c.studio !== false && !c.retired).map((c) => `      <li class="st-reel__tile${c.tall ? ' st-reel__tile--tall' : ''}">
        <button type="button" class="st-reel__b" data-reel aria-pressed="false">
          <video muted playsinline preload="none" width="${c.w}" height="${c.h}" poster="${c.poster}" aria-hidden="true" tabindex="-1"><source src="${c.src}" type="video/mp4"></video>
          <span class="st-reel__cap"><span class="st-sr" data-i18n="motion.reel.play"></span> <b data-i18n="motion.reel.items.${c.id}.name"></b><span data-i18n="motion.reel.items.${c.id}.what"></span></span>
        </button>
      </li>`).join('\n');
const RADIO_PICKS = RADIO.map((tr, i) => `          <button type="button" class="st-radio__t" data-radio-pick="${i}" aria-pressed="${i === 0}" disabled><span class="st-radio__tn" aria-hidden="true">${i + 1}</span><span data-i18n="radio.tracks.${tr.id}.name"></span></button>`).join('\n');
const EST_ROWS = `<tr><th scope="row">${DICT.fr['pricing.rc.base']} ${countedFr(U0, q0.lines[0].n)}</th><td dir="ltr">${grpFr(q0.lines[0].lo)}</td><td dir="ltr">${grpFr(q0.lines[0].hi)}</td></tr>`;

/* ---------------- the faces, split: the page's own, and each case's as it nears ----------------
   hub/fonts/fonts.css is the one list of the Studio's faces (the bible and the brand books load
   it whole). The Studio itself loads hub/fonts/studio.css, the faces of the first screens, and
   each case's own faces (hub/fonts/lazy-<slug>.css) only as that case nears the screen
   (hub/app.js 12): a case's font-family is matched when its style is computed, content-visibility
   or not, so 21 files were fetched at first paint, 364 kB in French and 527 kB in Arabic. */
const FONT_RULES = [...readFileSync(join(HUB, 'fonts/fonts.css'), 'utf8').matchAll(/@font-face \{[^}]*\}/g)].map((m) => [(/font-family: "([^"]+)"/.exec(m[0]) || [])[1], m[0]]);
const LAZY = {
  bordjsteel: ['Montserrat'], alliance: ['Sora', 'DM Sans'], almaflow: ['Montserrat', 'Manrope'], nomara: ['Space Mono'],
  traveler: ['Noto Serif JP', 'Space Mono', 'Archivo Condensed', 'Archivo Expanded'], heetch: ['Archivo Condensed', 'Archivo Expanded'],
};
const lazyFamilies = new Set(Object.values(LAZY).flat());
for (const f of lazyFamilies) if (!FONT_RULES.some(([n]) => n === f)) fail(`hub/fonts/fonts.css has no face named ${f} (build-hub.mjs LAZY)`);
const FONT_HEAD = (what) => `/* GENERATED by scripts/build-hub.mjs from hub/fonts/fonts.css: ${what}. Edit fonts.css, then run: node scripts/build-hub.mjs */\n`;
const FONT_FILES = [
  ['hub/fonts/studio.css', FONT_HEAD("the Studio's faces of the first screens (every face but the five cases')") + FONT_RULES.filter(([n]) => !lazyFamilies.has(n)).map(([, r]) => r).join('\n') + '\n'],
  /* the HUD faces of the type system (2026-11-26): the condensed display and the wide UI face, for the pages that set them
     outside a case (the Lanterne); unicode-range, so a page fetches them only when a glyph is set in them */
  ['hub/fonts/hud.css', FONT_HEAD('the HUD faces: Archivo Condensed (display) and Archivo Expanded (UI)') + FONT_RULES.filter(([n]) => n === 'Archivo Condensed' || n === 'Archivo Expanded').map(([, r]) => r).join('\n') + '\n'],
  ...Object.entries(LAZY).map(([slug, fams]) => [`hub/fonts/lazy-${slug}.css`, FONT_HEAD(`the faces of the ${slug} case, loaded as it nears`) + FONT_RULES.filter(([n]) => fams.includes(n)).map(([, r]) => r).join('\n') + '\n']),
  // the arcade face of the WorkspaceHQ ticket (the font WorkspaceHQ already hosts: one file), loaded as the ticket nears
  ['hub/fonts/lazy-whq.css', FONT_HEAD('the arcade face of the WorkspaceHQ ticket') + '@font-face { font-family: "Press Start 2P"; font-style: normal; font-weight: 400; font-display: swap;\n  src: url("../../workspacehq/fonts/PressStart2P.woff2") format("woff2"); }\n'],
  // the screen face of the price console (VT323, also the file WorkspaceHQ hosts), loaded as the console nears
  ['hub/fonts/lazy-console.css', FONT_HEAD('the screen face of the price console') + '@font-face { font-family: "VT323"; font-style: normal; font-weight: 400; font-display: swap;\n  src: url("../../workspacehq/fonts/VT323.woff2") format("woff2"); }\n'],
];

const GENERATED = new Set([...FONT_FILES.map(([f]) => f.replace(/^hub\//, '')), 'manuel.html', 'monde.html', 'fabrique.html']);

/* ---------------- the page ---------------- */
/* the client courses (manual, 2026-11-19): the templates and lines hub/app.js 13b writes itself (a row's verdict, a
   score, the fiche's labels and hints, the estimate's labels); what the fiche prints from a chip or a heading is read
   from the page, so it is not repeated here */
const RUNTIME_CRS = /^(fiche\.|pricing\.(eu|us)$|(brandc|web3c)\.(brief\.|kuro\.|items\.\d+\.(sort\.score|score|count|over|rcNote|under|underFloor|siteAdd|own\.(alt|bad)|rows\.\d+\.ask|meter\.|vague$|vagueWords$|sliders\.\d+\.steps\.\d+|social\.none|pace\.note|flow\.(step|noT|noD|yesT|yesD|qs\.\d+\.(no|why))|fork\.(payT|payD)|spec\.(t|you)$|pick\.2\.site\.(no|yes)|grid\.(line|empty|whoIn\.\d+)|lab\.out|states\.step|(sort\.)?rows\.\d+\.why|opts\.dsHas|scope\.line|oursNone))|money\.note[12]$|pricing\.rc\.(line|min|max|total)$)/;
/* the web3 expansion's shell (2026-11-21, web3x/SPEC.md §4.9): what app.js 13e and hub/web3x.js write themselves (the
   path's line, the sommaire's counts and minutes, the way on, the dock, the carnet, the module done line, the one lab
   built so far). The labs' other strings are named by no markup yet and are left out of #hub-fr: web3x.js will write
   them (W3X_LATER; the spec moves them to a lazy dictionary when the labs are built) */
const RUNTIME_W3X = /^web3c\.(path\.say|chap\.(count|total|time|next|back|here)|dock\.(go|empty)|carnet\.(left|seal|all\.)|x\.(step|noCrypto|on|off|done)|mods\.\d+\.(done|items\.\d+\.lab\.hash\.bits))$/;
const W3X_LATER = /^web3c\.mods\.\d+\.items\.\d+\.lab\./;
const RUNTIME_OLD = /^(rig\.|sting\.|case\.|hero\.(live|still)$|pricing\.(units\.|unitsN\.|wkN$|types\.|o\.|rc\.(base|studio|rush|kit|call|mid)$|beyond$|kuro|cur$|included$)|money\.(kit\.k$|svc\.waMsg$|svc\.items\.\d+\.name$)|life\.(k|y)\.|radio\.(play|pause|onair|idle|paused)$|radio\.tracks\.|process\.steps\.\d+\.m$|contact\.previewMsg$)/;
/* the phase-1 labs of modules 1–9 (2026-11-21, web3x/SPEC.md §4.9): hub/web3x.js writes their lines itself (results,
   counts, templates, a label that flips), so the whole lab subtree of those modules is runtime, and x.reset */
const RUNTIME_W3X_M123 = /^web3c\.(mods\.[0-8]\.items\.\d+\.lab\.|x\.reset$)/;
const RUNTIME = { test: (k) => RUNTIME_OLD.test(k) || RUNTIME_CRS.test(k) || RUNTIME_W3X.test(k) || RUNTIME_W3X_M123.test(k) || /^lant\.ui\.game\./.test(k) };   // the game layer's words: hub/game.js writes them
const sorted = (o) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = (s) => esc(s).replace(/"/g, '&quot;');
const pageSrc = readFileSync(join(SRC, 'page.html'), 'utf8');
let html = pageSrc;
for (const [slug] of CASES) html = html.replace(`<!-- CASE:${slug} -->`, fragments[slug] ? `<!-- CASE:${slug} -->\n${fragments[slug]}` : `<!-- CASE:${slug} -->`);
/* The manual (hub/manuel.html, 2026-11-16): the Studio's head, re-addressed
   (its own address in og:url, the hreflang links and the canonical the head
   script writes; its own title and description; a third breadcrumb), without
   the cases' sheets and faces, then hub/src/manuel.html as its body. One
   head to keep: the language script, the faces and the sheet cannot drift. */
const headEnd = pageSrc.indexOf('<body>');
if (headEnd < 0) fail('page.html: no <body>');
const swap = (text, from, to, n, what) => {
  const parts = text.split(from);
  if (parts.length - 1 !== n) fail(`the manual's head: ${what} found ${parts.length - 1} times in page.html's head, ${n} expected`);
  return parts.join(to);
};
// the Studio's head for a page beside it: its file, the group that holds its title and description, its name in the breadcrumb
const headFor = (file, ui, crumb) => {
  let h = pageSrc.slice(0, headEnd);
  h = swap(h, '<html lang="fr" dir="ltr">', `<html lang="fr" dir="ltr" data-ui="${ui}">`, 1, 'the html tag');
  h = swap(h, '<noscript>{{lazyFonts}}</noscript>\n', '', 1, 'the cases\' faces');
  h = swap(h, '{{caseCss}}\n', '', 1, 'the cases\' sheets');
  h = swap(h, '"ui.title"', `"${ui}.title"`, 3, 'the title key');
  h = swap(h, '"ui.desc"', `"${ui}.desc"`, 3, 'the description key');
  const at = /\{\{base\}\}hub\/(?=["'?])/g, n = (h.match(at) || []).length;
  if (n !== 7) fail(`the head of ${file}: the Studio's address found ${n} times in page.html's head, 7 expected (og:url, four hreflang, the canonical script, the breadcrumb)`);
  h = h.replace(at, `{{base}}hub/${file}`);
  return swap(h, `{"@type":"ListItem","position":2,"name":"Studio","item":"{{base}}hub/${file}"}]}`,
    `{"@type":"ListItem","position":2,"name":"Studio","item":"{{base}}hub/"},{"@type":"ListItem","position":3,"name":"${crumb}","item":"{{base}}hub/${file}"}]}`, 1, 'the breadcrumb');
};
/* La Librairie Lanterne (2026-11-21, scripts/lib/lanterne.mjs): the learning side moved to hub/lanterne/ (the shelf and
   one page per atlas); hub/manuel.html is now a stub that sends every old address to its new home. hub/src/manuel.html
   is no longer built: it stays only as the courses' source until each is cut into its atlas. */
let manual = '';
/* The world (hub/monde.html, 2026-11-18): the same head again, and
   hub/src/monde.html as its body: the codex, the personal dossiers 06 to
   08, the Lab and the diary, which were the Studio's until then. */
let monde = headFor('monde.html', 'world.ui', 'Le monde') + readFileSync(join(SRC, 'monde.html'), 'utf8');
/* La fabrique (hub/fabrique.html, 2026-11-19): the same head again, and hub/src/fabrique.html as its body: the owner's
   "Outside the Artboard" as four scenes (what you get, at the published price), then the application's six lessons and
   the web3 engineering track's six, published as education (OWNER-ANSWERS.md, 2026-11-18). */
let fab = headFor('fabrique.html', 'fab.ui', 'La fabrique') + readFileSync(join(SRC, 'fabrique.html'), 'utf8');
/* Markup in a dictionary value is allowed only where the page applies it as
   markup (data-i18n-html). The home's Arabic wraps Latin names in <bdi>; a
   text key gets the same isolation as Unicode (FSI ... PDI), so no tag is ever
   printed. Anything else with a '<' is refused. */
const LANT = lanterne({ HUB, SRC, DICT, LANGS, fail, notes, esc, pageSrc, headEnd, swap, RADIO, RUNTIME_OLD, RUNTIME });
if (LANT) { manual = LANT.out.find((o) => o.name === 'manuel.html').html; for (const g of LANT.generated) GENERATED.add(g); }
const LPAGES = LANT ? LANT.out.filter((o) => o.page) : [];
const htmlKeys = new Set([...(html + manual + monde + fab + LPAGES.map((o) => o.html).join('')).matchAll(/\sdata-i18n-html="([^"]+)"/g)].map((m) => m[1]));
for (const l of LANGS)
  for (const [k, v] of Object.entries(DICT[l])) {
    if (htmlKeys.has(k) || !v.includes('<')) continue;
    DICT[l][k] = v.replace(/<bdi>([^<]*)<\/bdi>/g, '\u2068$1\u2069');
    if (DICT[l][k].includes('<')) fail(`${l} ${k}: markup in a value the page sets as text (declare it data-i18n-html or drop the tag)`);
  }
/* La fabrique's holes (2026-11-19): the studio's own marks for scene 01 (the wordmark, written once with its id="wm";
   the favicon, inline so check 17b's rule on an <img>'s size does not apply, without its size and hidden from
   readers), the identity's and the design-system option's figures in French as baked (hub/app.js 6 writes them
   again in the page's language), and the THE MARK card of scene 02 in each language, from that language's own
   dictionary, so the three copies cannot drift from the Studio's card. */
const MI = ESTIMATE.PRICE_MODEL.identite;
const FAVICON = readFileSync(join(ROOT, 'assets/favicon.svg'), 'utf8').trim()
  .replace(/^<svg\b([^>]*)>/, (all, a) => `<svg class="st-fav"${a.replace(/\s(width|height)="\d+"/g, '')} aria-hidden="true" focusable="false">`).replace(/>\s+</g, '><');
if (!/^<svg class="st-fav"/.test(FAVICON)) fail('assets/favicon.svg: not an <svg> the build can inline');
const FAB = {
  wordmark: WORDMARK, favicon: FAVICON,
  'type.identite': esc(f0(MI.base[0], MI.base[1], 'DZD')), 'type.identiteU': esc(countedFr(MI.u.replace(/^price\./, ''), MI.base_u)),
  'opt.ds': esc(`+\u00a0${f0(MO.ds.add[0], MO.ds.add[1], 'DZD')}`),
  ...Object.fromEntries(LANGS.flatMap((l) => [['fam', 'fam'], ['name', 'name'], ['ga', 'gets.0'], ['gb', 'gets.1'], ['gc', 'gets.2']]
    .map(([h, k]) => [`svc.${l}.${h}`, esc(DICT[l][`services.items.2.${k}`] ?? (fail(`services.items.2.${k}: missing in ${l}`), ''))]))),
};
/* The web3 course's six request panels (manuel.html B3, "Chez nous, la route la plus proche"): the ordinary route each
   request maps to and its published price, in French as baked, on hub/app.js 13b's routeQ() (an app at 6 screens for
   requests 0, 1 and 4, an automation at 3 flows for 3; for 2, the line routeQ gives while "do you have a site" is
   unanswered; for 5, no price). hub/app.js writes them again in the page's language. */
const routeFr = (type, n) => { const M = ESTIMATE.PRICE_MODEL[type], q = ESTIMATE.quote(type, n, [], false);
  return `${DICT.fr[`pricing.types.${type}`]} · ${countedFr(M.u.replace(/^price\./, ''), n)} · ${f0(q.lo, q.hi, 'DZD')}`; };
const ROUTE = {
  'route.app': esc(routeFr('app', 6)), 'route.auto': esc(routeFr('auto', 3)),
  'route.pay': esc(DICT.fr['web3c.items.2.pick.2.site.yes'] ?? (fail('web3c.items.2.pick.2.site.yes: missing in fr'), '')),
  'route.none': esc(DICT.fr['web3c.items.2.oursNone'] ?? (fail('web3c.items.2.oursNone: missing in fr'), '')),
};
/* La carte (2026-11-21): the services catalogue, every figure from the model above, every line in the three languages */
const CARTE = carte({ ESTIMATE, PRICES, DICT, LANGS, fail, esc, attr, HUB });
const waPreview = 'https://wa.me/213672412578?text=' + encodeURIComponent(DICT.fr['contact.previewMsg']);
const holes = {
  base: BASE, stamp, ayn: AYN, waPreview: attr(waPreview),
  prices: JSON.stringify(PRICES).replace(/</g, '\\u003c'),
  // the French strings app.js writes itself (the rig, the estimator's
  // labels, the process card's mood, the cases' badges): a French visitor
  // never fetches i18n.js
  fr: JSON.stringify(sorted(Object.fromEntries(Object.entries(DICT.fr).filter(([k]) => RUNTIME_OLD.test(k))))).replace(/</g, '\\u003c'),
  // the manual carries the client courses' runtime strings too (the Studio and the world do not need them)
  frManual: JSON.stringify(sorted(Object.fromEntries(Object.entries(DICT.fr).filter(([k]) => RUNTIME.test(k))))).replace(/</g, '\\u003c'),
  lazyFonts: [...CASES.map((c) => c[0]), 'whq', 'console'].map((n) => `<link rel="stylesheet" href="fonts/lazy-${n}.css?v=${stamp}">`).join(''),
  // the Studio's own sheets beyond style.css: the cases' and la carte's (hub/css/carte.css); the pages beside it drop the hole
  caseCss: [...caseCss, 'css/carte.css'].map((h) => `<link rel="stylesheet" href="${h}?v=${stamp}">`).join('\n'),
  carte: CARTE.html,
  ...Object.fromEntries(Object.entries(EST).map(([k, v]) => [`est.${k}`, esc(v)])),
  estRows: EST_ROWS,
  radio: JSON.stringify(RADIO.map((tr) => ({ id: tr.id, src: tr.src, dur: tr.dur }))).replace(/</g, '\\u003c'),
  radioPicks: RADIO_PICKS,
  radioFirst: esc(DICT.fr[`radio.tracks.${RADIO[0].id}.name`]),
  radioDur: mmss(RADIO[0].dur),
  reel: REEL_TILES,
  ...Object.fromEntries(Object.entries(MOTION).map(([k, v]) => [`motion.${k}`, esc(v)])),
  ...Object.fromEntries(Object.entries(MONEY).map(([k, v]) => [`money.${k}`, esc(v)])),
  ...FAB,
  ...ROUTE,
  ...(LANT ? LANT.holes : {}),
};
const used = new Set(), PAGE_KEYS = {};
// holes, then the dictionary's French: the same steps for the Studio and for the manual
function fill(html, name) {
  html = html.replace(/\{\{([a-zA-Z][a-zA-Z0-9.]*)\}\}/g, (all, k) => { if (k === 'fr' && name === 'manuel.html') k = 'frManual'; if (holes[k] == null) { fail(`${name}: unknown hole {{${k}}}`); return all; } return holes[k]; });
  // a template line that is all hole (caseCss with no case css yet) leaves no blank line
  html = html.replace(/\n\n(?=<script type="application\/ld\+json">)/, '\n');
  const mine = new Set();
  const fr = (k, where) => { used.add(k); mine.add(k); if (DICT.fr[k] == null) { fail(`${name}, ${where}: no key ${k}`); return ''; } return DICT.fr[k]; };
  // text and markup: the element is written empty, the build fills it
  html = html.replace(/<([a-z][a-z0-9]*)\b([^>]*?\sdata-i18n(-html)?="([^"]+)"[^>]*)><\/\1>/g,
    (all, tag, attrs, isHtml, k) => `<${tag}${attrs}>${isHtml ? fr(k, `<${tag} data-i18n-html>`) : esc(fr(k, `<${tag} data-i18n>`))}</${tag}>`);
  html = html.replace(/<title data-i18n-doc="([^"]+)"><\/title>/, (all, k) => `<title>${esc(fr(k, '<title>'))}</title>`);
  html = html.replace(/\sdata-i18n-content="([^"]+)"/g, (all, k) => ` content="${attr(fr(k, '<meta>'))}"`);
  // a case fragment may carry an empty alt="" beside data-i18n-alt (its own placeholder): the dictionary's line replaces it
  html = html.replace(/<[a-z][^>]*\sdata-i18n-(alt|aria|title|ph)=[^>]*>/g, (t) => t.replace(/\s(alt|aria-label|title|placeholder)=""/g, ''));
  for (const [a, to] of [['alt', 'alt'], ['aria', 'aria-label'], ['title', 'title'], ['ph', 'placeholder']])
    html = html.replace(new RegExp(`(\\sdata-i18n-${a}="([^"]+)")`, 'g'), (all, whole, k) => `${whole} ${to}="${attr(fr(k, `data-i18n-${a}`))}"`);
  for (const m of html.matchAll(/\sdata-i18n(?:-html)?="([^"]+)"/g)) if (!mine.has(m[1])) fail(`${name}: an element with data-i18n="${m[1]}" is not empty in the template (the build fills it)`);
  PAGE_KEYS[name] = mine;
  return html;
}
html = fill(html, 'page.html');
manual = fill(manual, 'manuel.html');
monde = fill(monde, 'monde.html');
fab = fill(fab, 'fabrique.html');
for (const o of LPAGES) o.html = fill(o.html, o.name);
// (la carte's WhatsApp lines are named by data-carte-wa, which hub/app.js 14b reads)
for (const k of Object.keys(DICT.fr)) if (!used.has(k) && !RUNTIME.test(k) && !/^cases\./.test(k) && !W3X_LATER.test(k) && !/^carte\.(items\.[a-z]+|blanche|form\.[a-z]+)\.wa$/.test(k))
  notes.push(`key ${k} is in the dictionaries but no markup names it (app.js may)`);

/* ---------------- images: sizes from the files ---------------- */
function imageSize(file) {
  const b = readFileSync(file);
  if (file.endsWith('.webp')) {
    const kind = b.toString('ascii', 12, 16);
    if (kind === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
    if (kind === 'VP8L') { const v = b.readUInt32LE(21); return [1 + (v & 0x3fff), 1 + ((v >> 14) & 0x3fff)]; }
    if (kind === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  }
  if (file.endsWith('.svg')) {
    const s = b.toString('utf8'), vb = /viewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)"/.exec(s);
    if (vb) return [Math.round(+vb[1]), Math.round(+vb[2])];
  }
  return null;
}
const refs = new Set();
const localFile = (u) => { const p = u.split(/[?#]/)[0]; return p ? join(HUB, decodeURI(p)) : null; };
const CLIENT_HOSTS = [...readFileSync(join(ROOT, 'index.html'), 'utf8').matchAll(/href="https:\/\/([^/"]+)[^"]*"/g)].map((m) => m[1]);
const ALLOW = new Set([new URL(BASE).host, 'wa.me', 'www.behance.net', 'www.deviantart.com', 'www.instagram.com', 'instagram.com', ...CLIENT_HOSTS]);
// the hosts a reference list may cite (the gamification course's sources: journals by DOI, a preprint server, a regulator, the companies' own filings, two news pages); a link to one must be marked data-ref
const REF_HOSTS = new Set(['doi.org', 'arxiv.org', 'www.sec.gov', 's203.q4cdn.com', 'hbr.org', 'www.washington.edu', 'www.aap.com.au', 'digitalnewsasia.com', 'www.ftc.gov', 'www.jesperjuul.net',
  'www.ncsc.gov.uk', 'support.zoom.com', 'support.google.com', 'messervices.cyber.gouv.fr', 'home-affairs.ec.europa.eu', 'data.iana.org',
  // the two client courses' sources (2026-11-19, COURSE.md 3.7): the design council, the trademark offices and texts, the
  // font licence, the W3C and MDN; the Algerian Official Journal, NIST, the regulators and ethereum.org's documentation
  'www.designcouncil.org.uk', 'www.wipo.int', 'wipo.int', 'www.inpi.fr', 'www.inapi.dz', 'www.moet.gov.ae', 'www.legifrance.gouv.fr', 'openfontlicense.org', 'www.w3.org', 'developer.mozilla.org',
  'www.joradp.dz', 'nvlpubs.nist.gov', 'consumer.ftc.gov', 'www.esma.europa.eu', 'www.amf-france.org', 'www.investor.gov', 'www.ic3.gov', 'www.europol.europa.eu', 'rulebooks.vara.ae', 'www.vara.ae', 'assets.adgm.com', 'ethereum.org',
  // la fabrique's references (2026-11-19, ATELIER.md 5.5): the auto-layout guide and PostgreSQL's documentation
  'help.figma.com', 'www.postgresql.org',
  // the web3 expansion's nine source lists (2026-11-21, web3x/SPEC.md §6: every URL fetched on 2026-11-20/21; documentation
  // pages, standards, regulators, the projects' own docs as cited, never a product or trading page)
  'a16zfrontier.com', 'aave.com', 'bitcoin.org', 'blog.ethereum.org', 'cosmwasm.github.io', 'csrc.nist.gov', 'developer.bitcoin.org',
  'developers.tron.network', 'developers.uniswap.org', 'docs.anza.xyz', 'docs.arweave.org', 'docs.chain.link', 'docs.coordinape.com',
  'docs.cosmos.network', 'docs.dydx.xyz', 'docs.ens.domains', 'docs.ethers.org', 'docs.filecoin.io', 'docs.ipfs.tech', 'docs.layerzero.network',
  'docs.openzeppelin.com', 'docs.pyth.network', 'docs.safe.global', 'docs.snapshot.box', 'docs.soliditylang.org', 'docs.tally.xyz',
  'docs.vyperlang.org', 'docs.walletconnect.com', 'eips.ethereum.org', 'ethereum.github.io', 'getfoundry.sh', 'github.com', 'hardhat.org',
  'home.cern', 'ibcprotocol.dev', 'lamport.azurewebsites.net', 'move-book.com', 'raw.githubusercontent.com', 'remix-ide.readthedocs.io',
  'specs.walletconnect.com', 'thegraph.com', 'viem.sh', 'vitalik.eth.limo', 'wagmi.sh', 'www.anchor-lang.com', 'www.cftc.gov', 'www.getfoundry.sh',
  'www.lifewithalacrity.com', 'www.solana-program.com', 'wyoleg.gov',
  // la carte's market lines (2026-11-21, services/prices.md §2: each page fetched on 2026-11-21)
  ...CARTE_HOSTS]);
// a page's pictures (sizes from the files) and the rest of its markup's rules: the same for the Studio and for the manual
function rules(html, dir = HUB) {
const localFile = (u) => { const p = u.split(/[?#]/)[0]; return p ? join(dir, decodeURI(p)) : null; };
const gen = (v) => { const p = v.split(/[?#]/)[0]; return GENERATED.has(relative(HUB, join(dir, p.endsWith('/') || p === '' ? p + 'index.html' : p)).replace(/\\/g, '/')); };
const refHrefs = new Set([...html.matchAll(/<a\b[^>]*\sdata-ref\s[^>]*\bhref="([^"]+)"/g)].map((m) => m[1]));
// the toolbox's links (hub/lanterne/outils.html, 2026-11-22): an <a data-app> to an app's or a free option's plain official
// address, from hub/src/lanterne/apps.json (never a partner link: hub/lanterne.js puts those on, after its region check)
const appHrefs = new Set([...html.matchAll(/<a\b[^>]*>/g)].filter((m) => /\sdata-app[\s>]/.test(m[0])).map((m) => (/\shref="([^"]+)"/.exec(m[0]) || [])[1]).filter(Boolean));
html = html.replace(/<img\b([^>]*)>/g, (all, a) => {
  const src = (/\ssrc="([^"]+)"/.exec(a) || [])[1];
  if (!src) { fail(`<img${a.slice(0, 60)}>: no src`); return all; }
  if (!/\salt="/.test(a)) fail(`<img src="${src}">: no alt (alt="" for decoration, or data-i18n-alt)`);
  if (/^(https?:)?\/\//.test(src)) { fail(`<img src="${src}">: a third-party request`); return all; }
  const file = localFile(src);
  if (!existsSync(file)) { fail(`<img src="${src}">: no such file`); return all; }
  refs.add(relative(ROOT, file));
  const size = imageSize(file);
  if (!size) return all;
  const w = (/\swidth="(\d+)"/.exec(a) || [])[1], h = (/\sheight="(\d+)"/.exec(a) || [])[1];
  if (w || h) { if (+w !== size[0] || +h !== size[1]) fail(`<img src="${src}">: width/height ${w}×${h}, the file is ${size[0]}×${size[1]}`); return all; }
  return `<img${a.replace(/\ssrc="[^"]+"/, (s) => `${s} width="${size[0]}" height="${size[1]}"`)}>`;
});

/* ---------------- the rest of the markup's rules ---------------- */
for (const m of html.matchAll(/\s(src|srcset|href|data-zoom|data-anim|poster)="([^"]*)"/g)) {
  const [, a, v] = m;
  // a srcset is a list of "file 480w" candidates: each file must exist and counts as referenced
  if (a === 'srcset') {
    for (const c of v.split(',').map((x) => x.trim().split(/\s+/)[0]).filter(Boolean)) {
      const f = localFile(c);
      if (/^(https?:)?\/\//.test(c)) fail(`srcset="${c}": a third-party request`);
      else if (!existsSync(f)) fail(`srcset="${c}": no such file`); else refs.add(relative(ROOT, f));
    }
    continue;
  }
  if (/^(mailto:|#|data:|\?)/.test(v) || v === '') continue;   // a query alone (?lang=en) is this very page
  if (/^https?:\/\//.test(v)) {
    const host = new URL(v).host;
    if (a !== 'href') fail(`${a}="${v}": a third-party request`);
    else if (REF_HOSTS.has(host) && refHrefs.has(v)) continue;   // a source in a reference list
    else if (LANT && LANT.appHosts.has(host) && appHrefs.has(v)) continue;   // an app's official address, in the toolbox
    else if (!ALLOW.has(host)) fail(`href="${v}": ${host} is not on the allow-list (the home's client sites, wa.me, Behance, DeviantArt, Instagram)`);
    continue;
  }
  const file = localFile(v);
  // './' and './#preview' are the Studio itself, from the manual beside it
  if (v.endsWith('/') || /^\.\/#/.test(v) || /^\.\.\/#/.test(v)) { if (!existsSync(join(file, 'index.html')) && !gen(v.replace(/#.*$/, '') + 'index.html')) fail(`${a}="${v}": no page there`); continue; }
  if (/^i18n\.(?:'\+l\+'\.)?js\b/.test(v) || GENERATED.has(v.split(/[?#]/)[0]) || gen(v)) continue;   // written below
  if (!existsSync(file)) fail(`${a}="${v}": no such file`); else refs.add(relative(ROOT, file));
}
// (the wordmark's accent group is the one exception: lib/wordmark.mjs draws it so)
for (const m of html.matchAll(/\sstyle="([^"]*)"/g))
  if (m[1] !== 'fill:var(--teal-text,currentColor)' && !/^\s*(--[a-z0-9-]+\s*:\s*[^;"]+;?\s*)+$/i.test(m[1])) fail(`style="${m[1]}": only custom properties (style="--i:3"), the rest is the stylesheet's`);
for (const m of html.matchAll(/<[a-z][^>]*\s(on[a-z]+)=/gi)) fail(`an inline ${m[1]}= handler: attach it from hub/app.js`);
// (a drawing's own url(#fragment), the Lantern objects' clip-paths, names no file)
for (const m of html.matchAll(/url\((['"]?)([^)'"]+)\1\)/g)) if (!/^(data:|#)/.test(m[2]) && !existsSync(localFile(m[2]))) fail(`url(${m[2]}): no such file`);
return html;
}
html = rules(html);
manual = rules(manual);
monde = rules(monde);
fab = rules(fab);
for (const o of LPAGES) o.html = rules(o.html, join(HUB, 'lanterne'));
// the stylesheets' own pictures count as referenced
for (const css of ['style.css', ...(existsSync(join(HUB, 'css')) ? readdirSync(join(HUB, 'css')) : []).filter((f) => f.endsWith('.css')).map((f) => `css/${f}`)]) {
  const p = join(HUB, css);
  if (!existsSync(p)) continue;
  for (const m of readFileSync(p, 'utf8').matchAll(/url\((['"]?)([^)'"]+)\1\)/g))
    if (!/^data:/.test(m[2])) refs.add(relative(ROOT, join(dirname(p), m[2].split(/[?#]/)[0])));
}
// a retired clip's files are kept for its re-recording (hub/src/reel.json "retired"): not orphans
for (const c of REEL) if (c.retired) for (const f of [c.src, c.poster]) refs.add(relative(ROOT, join(HUB, f)));
// app.js builds a few picture paths in script ('img/motion/sting-' + ...): any 'img/…' literal there counts
for (const m of readFileSync(join(HUB, 'app.js'), 'utf8').matchAll(/'(sting-(?:916|169)\.webp)/g)) refs.add(relative(ROOT, join(HUB, 'img/motion', m[1])));
// the character bible shares a few of hub/img's files (the footer sleeper's full-size still): what its page names counts as referenced
if (existsSync(join(HUB, 'bible/index.html')))
  for (const m of readFileSync(join(HUB, 'bible/index.html'), 'utf8').matchAll(/"\.\.\/img\/([^"?#]+)"/g)) refs.add(`hub/img/${m[1]}`);
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [relative(ROOT, p)]; });
const unref = existsSync(join(HUB, 'img')) ? walk(join(HUB, 'img')).filter((f) => !refs.has(f) && !refs.has(f.replace(/\.full\.webp$/, '.webp'))) : [];
// while a book of the Librairie still waits for its atlas file (the migration's steps, SPEC §6.1), the courses' art it will
// carry is listed, not refused, as a missing case's is
const lantAll = !LANT || LANT.live.length === LANT.books.length;
if (unref.length) (casesIn === CASES.length && lantAll ? fail : (m) => notes.push(m))(`${unref.length} file${unref.length === 1 ? '' : 's'} in hub/img that nothing references${casesIn < CASES.length ? ` (${casesIn} of ${CASES.length} cases in)` : ''}${lantAll ? '' : ` (${LANT.live.length} of ${LANT.books.length} atlases of the Librairie in)`}: ${unref.slice(0, 6).join(', ')}${unref.length > 6 ? ', …' : ''}`);

/* ---------------- outputs ---------------- */
// a template hole that fills with nothing leaves its indentation on a line of its own: html-validate's
// no-trailing-whitespace reads it as an error, so those lines go blank (before the CSP hashes are taken)
const tidy = (s) => s.replace(/^[ \t]+$/gm, '');
const page = withCsp(withGtag(tidy(html)), cspKind('hub/index.html'));
const manualPage = withCsp(withGtag(tidy(manual)), cspKind('hub/manuel.html'));
const mondePage = withCsp(withGtag(tidy(monde)), cspKind('hub/monde.html'));
const fabPage = withCsp(withGtag(tidy(fab)), cspKind('hub/fabrique.html'));
const lantPages = LPAGES.map((o) => [o.file, withCsp(withGtag(tidy(o.html)), cspKind(o.file))]);
/* each page of the Librairie gets its own English and Arabic dictionary (hub/lanterne/i18n/<page>.<lang>.js): the keys its
   markup names and the ones its scripts write (scripts/lib/lanterne.mjs), so an English reader of one atlas does not
   load the Studio's whole dictionary; French is baked, and its runtime lines ride in the page's #hub-fr block */
const lantDicts = LPAGES.flatMap((o) => {
  const keys = new Set([...(PAGE_KEYS[o.name] || []), ...LANT.runtime[o.page]]);
  for (const k of [...keys]) if (/\.other$/.test(k)) for (const c of ['zero', 'one', 'two', 'few', 'many']) if (DICT.fr[k.replace(/other$/, c)] != null) keys.add(k.replace(/other$/, c));
  return ['en', 'ar'].map((l) => [`hub/lanterne/i18n/${o.page}.${l}.js`, `/* GENERATED by scripts/build-hub.mjs (scripts/lib/lanterne.mjs): the ${l} dictionary of hub/lanterne/${o.page}.html alone. */\nwindow.HUB_I18N = window.HUB_I18N || {};\nwindow.HUB_I18N.${l} = ${JSON.stringify(sorted(Object.fromEntries([...keys].filter((k) => DICT[l][k] != null).map((k) => [k, DICT[l][k]]))))};\n`]);
});
/* no built string of the Librairie may read « undefined », « NaN » or an unfilled {placeholder} (2026-11-22: a template
   filled with a missing label wrote « La case « undefined » » into 17 keepsake names and nothing stopped it). Checked:
   every dictionary value in the three languages (a {placeholder} there is the runtime's to fill, so only the first two),
   and the visible text and the text attributes of every built page (scripts and styles left out), where all three count. */
const BADV = /\bundefined\b|\bNaN\b/;
for (const l of LANGS) for (const [k, v] of Object.entries(DICT[l])) if (typeof v === 'string' && BADV.test(v)) fail(`${l} ${k}: « ${v.slice(0, 80)} » reads « ${v.match(BADV)[0]} »`);
for (const [f, s] of [...lantPages, ['hub/manuel.html', manualPage]]) {
  const body = s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
  const texts = [...body.matchAll(/>([^<]+)</g)].map((m) => m[1]).concat([...body.matchAll(/\s(?:alt|title|aria-label|placeholder|content|value)="([^"]*)"/g)].map((m) => m[1]));
  for (const t of texts) { const m = t.match(/\bundefined\b|\bNaN\b|\{[A-Za-z_][\w.]*\}/); if (m) fail(`${f}: a built string reads « ${m[0]} »: « ${t.trim().slice(0, 80)} »`); }
}
for (const [f, s] of lantDicts) for (const m of s.matchAll(/"([^"\\]*(?:\\.[^"\\]*)*)"/g)) if (BADV.test(m[1])) fail(`${f}: « ${m[1].slice(0, 80)} » reads « ${m[1].match(BADV)[0]} »`);
const i18n = `/* GENERATED by scripts/build-hub.mjs from hub/src/i18n and hub/src/cases:
   the Studio's three dictionaries (French too, for a switch back), flat
   keys, and nothing else. Loaded by the head script for an EN or AR visitor
   and by hub/app.js on a switch. */
window.HUB_I18N = ${JSON.stringify(Object.fromEntries(LANGS.map((l) => [l, sorted(DICT[l])])))};
`;
if (errors.length) {
  console.error(`✗ hub: ${errors.length} problem${errors.length === 1 ? '' : 's'}\n  ` + errors.join('\n  '));
  process.exit(1);
}
for (const n of notes) console.log(`  · ${n}`);
// one dictionary file per language: the head script and a switch fetch only the language asked for (the three in one file were 161 kB held in front of the first paint)
// (the Librairie's own strings, and the nine web3 modules' (2026-11-22: only hub/lanterne/web3-modules.html names them, through
// its own dictionaries), stay out of the Studio's: hub/i18n.js keeps all of them for the gates)
const STUDIO_OUT = /^(lant\.|web3c\.(mods|x|chap|carnet)\.)/;
const perLang = LANGS.map((l) => [`hub/i18n.${l}.js`, `/* GENERATED by scripts/build-hub.mjs: the Studio's ${l} dictionary alone (hub/i18n.js holds the three). */\nwindow.HUB_I18N = window.HUB_I18N || {};\nwindow.HUB_I18N.${l} = ${JSON.stringify(sorted(Object.fromEntries(Object.entries(DICT[l]).filter(([k]) => !STUDIO_OUT.test(k)))))};\n`]);
const OUT = [['hub/index.html', page], ['hub/manuel.html', manualPage], ['hub/monde.html', mondePage], ['hub/fabrique.html', fabPage], ['hub/i18n.js', i18n], ...perLang, ...FONT_FILES, ...lantPages, ...lantDicts, ...(LANT ? LANT.files : [])];
if (process.argv.includes('--check')) {
  const stale = OUT.filter(([f, s]) => !existsSync(join(ROOT, f)) || readFileSync(join(ROOT, f), 'utf8') !== s).map(([f]) => f);
  console.log(stale.length ? `✗ ${stale.join(', ')} differ from hub/src (run: node scripts/build-hub.mjs)` : `✓ hub/index.html, hub/manuel.html (the stub), hub/monde.html, hub/fabrique.html, the Librairie (${lantPages.length} pages and their dictionaries) and hub/i18n.js match hub/src`);
  process.exit(stale.length ? 1 : 0);
}
mkdirSync(join(HUB, 'lanterne', 'i18n'), { recursive: true });
for (const [f, s] of OUT) { mkdirSync(dirname(join(ROOT, f)), { recursive: true }); writeFileSync(join(ROOT, f), s); }
console.log(`✓ hub/index.html (${(page.length / 1000).toFixed(1)} kB, ${casesIn} of ${CASES.length} cases), hub/manuel.html (${(manualPage.length / 1000).toFixed(1)} kB), hub/monde.html (${(mondePage.length / 1000).toFixed(1)} kB), hub/fabrique.html (${(fabPage.length / 1000).toFixed(1)} kB) the Librairie (${lantPages.map(([f, x]) => `${f.slice(13)} ${(x.length / 1000).toFixed(1)} kB`).join(', ')}) and hub/i18n.js (${Object.keys(DICT.fr).length} keys × 3)`);
