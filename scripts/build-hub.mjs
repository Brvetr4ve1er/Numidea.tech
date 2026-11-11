#!/usr/bin/env node
/**
 * Builds the Studio page, hub/index.html and its dictionary hub/i18n.js,
 * from hub/src — `node scripts/build-hub.mjs` (`--check`: write nothing,
 * exit 1 if either file differs from what the sources give).
 *
 *   hub/src/page.html            the page: head, nav, screens 01-13, footer
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
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { BASE } from './site.mjs';
import { withCsp, cspKind } from './lib/csp.mjs';
import { loadDicts } from './lib/i18n.mjs';
import { AYN } from './lib/ayn.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const HUB = join(ROOT, 'hub'), SRC = join(HUB, 'src');
const LANGS = ['fr', 'en', 'ar'];
// the five cases in the design's order (09 Proof); a fragment may be named
// by its short slug too (bordj for bordjsteel)
const CASES = [['bordjsteel', 'bordj'], ['alliance'], ['almaflow'], ['traveler'], ['heetch']];
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
for (const k of new Set(LANGS.flatMap((l) => Object.keys(DICT[l]))))
  for (const l of LANGS) if (DICT[l][k] == null) fail(`key ${k}: missing in ${l}`);

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
  opts: Object.fromEntries(Object.entries(ESTIMATE.PRICE_OPTS).map(([k, o]) => [k, { add: o.add, weeks: o.weeks }])),
  rush: [Number(rushP), Number(rushW)], fx: { EUR: FX.EUR, USD: FX.USD }, retainer: RETAINER,
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

/* ---------------- the page ---------------- */
const RUNTIME = /^(rig\.|sting\.|case\.|hero\.(live|still)$|pricing\.(units\.|kuro|cur$|included$)|process\.steps\.\d+\.m$|contact\.previewMsg$)/;
const sorted = (o) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = (s) => esc(s).replace(/"/g, '&quot;');
let html = readFileSync(join(SRC, 'page.html'), 'utf8');
for (const [slug] of CASES) html = html.replace(`<!-- CASE:${slug} -->`, fragments[slug] ? `<!-- CASE:${slug} -->\n${fragments[slug]}` : `<!-- CASE:${slug} -->`);
/* Markup in a dictionary value is allowed only where the page applies it as
   markup (data-i18n-html). The home's Arabic wraps Latin names in <bdi>; a
   text key gets the same isolation as Unicode (FSI ... PDI), so no tag is ever
   printed. Anything else with a '<' is refused. */
const htmlKeys = new Set([...html.matchAll(/\sdata-i18n-html="([^"]+)"/g)].map((m) => m[1]));
for (const l of LANGS)
  for (const [k, v] of Object.entries(DICT[l])) {
    if (htmlKeys.has(k) || !v.includes('<')) continue;
    DICT[l][k] = v.replace(/<bdi>([^<]*)<\/bdi>/g, '\u2068$1\u2069');
    if (DICT[l][k].includes('<')) fail(`${l} ${k}: markup in a value the page sets as text (declare it data-i18n-html or drop the tag)`);
  }
const waPreview = 'https://wa.me/213672412578?text=' + encodeURIComponent(DICT.fr['contact.previewMsg']);
const holes = {
  base: BASE, stamp, ayn: AYN, waPreview: attr(waPreview),
  prices: JSON.stringify(PRICES).replace(/</g, '\\u003c'),
  // the French strings app.js writes itself (the rig, the estimator's
  // labels, the process card's mood, the cases' badges): a French visitor
  // never fetches i18n.js
  fr: JSON.stringify(sorted(Object.fromEntries(Object.entries(DICT.fr).filter(([k]) => RUNTIME.test(k))))).replace(/</g, '\\u003c'),
  caseCss: caseCss.map((h) => `<link rel="stylesheet" href="${h}?v=${stamp}">`).join('\n'),
  ...Object.fromEntries(Object.entries(EST).map(([k, v]) => [`est.${k}`, esc(v)])),
};
html = html.replace(/\{\{([a-zA-Z.]+)\}\}/g, (all, k) => { if (holes[k] == null) { fail(`page.html: unknown hole {{${k}}}`); return all; } return holes[k]; });
// a template line that is all hole (caseCss with no case css yet) leaves no blank line
html = html.replace(/\n\n(?=<script type="application\/ld\+json">)/, '\n');

const used = new Set();
const fr = (k, where) => { used.add(k); if (DICT.fr[k] == null) { fail(`${where}: no key ${k}`); return ''; } return DICT.fr[k]; };
// text and markup: the element is written empty, the build fills it
html = html.replace(/<([a-z][a-z0-9]*)\b([^>]*?\sdata-i18n(-html)?="([^"]+)"[^>]*)><\/\1>/g,
  (all, tag, attrs, isHtml, k) => `<${tag}${attrs}>${isHtml ? fr(k, `<${tag} data-i18n-html>`) : esc(fr(k, `<${tag} data-i18n>`))}</${tag}>`);
html = html.replace(/<title data-i18n-doc="([^"]+)"><\/title>/, (all, k) => `<title>${esc(fr(k, '<title>'))}</title>`);
html = html.replace(/\sdata-i18n-content="([^"]+)"/g, (all, k) => ` content="${attr(fr(k, '<meta>'))}"`);
// a case fragment may carry an empty alt="" beside data-i18n-alt (its own placeholder): the dictionary's line replaces it
html = html.replace(/<[a-z][^>]*\sdata-i18n-(alt|aria|title)=[^>]*>/g, (t) => t.replace(/\s(alt|aria-label|title)=""/g, ''));
for (const [a, to] of [['alt', 'alt'], ['aria', 'aria-label'], ['title', 'title']])
  html = html.replace(new RegExp(`(\\sdata-i18n-${a}="([^"]+)")`, 'g'), (all, whole, k) => `${whole} ${to}="${attr(fr(k, `data-i18n-${a}`))}"`);
for (const m of html.matchAll(/\sdata-i18n(?:-html)?="([^"]+)"/g)) if (!used.has(m[1])) fail(`an element with data-i18n="${m[1]}" is not empty in the template (the build fills it)`);
for (const k of Object.keys(DICT.fr)) if (!used.has(k) && !RUNTIME.test(k) && !/^cases\./.test(k))
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
const CLIENT_HOSTS = [...readFileSync(join(ROOT, 'index.html'), 'utf8').matchAll(/href="https:\/\/([^/"]+)[^"]*"/g)].map((m) => m[1]);
const ALLOW = new Set([new URL(BASE).host, 'wa.me', 'www.behance.net', 'www.deviantart.com', 'www.instagram.com', 'instagram.com', ...CLIENT_HOSTS]);
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
  if (/^(mailto:|#|data:)/.test(v) || v === '') continue;
  if (/^https?:\/\//.test(v)) {
    const host = new URL(v).host;
    if (a !== 'href') fail(`${a}="${v}": a third-party request`);
    else if (!ALLOW.has(host)) fail(`href="${v}": ${host} is not on the allow-list (the home's client sites, wa.me, Behance, DeviantArt, Instagram)`);
    continue;
  }
  const file = localFile(v);
  if (v.endsWith('/')) { if (!existsSync(join(file, 'index.html'))) fail(`${a}="${v}": no page there`); continue; }
  if (/^i18n\.js\b/.test(v)) continue;                      // written below
  if (!existsSync(file)) fail(`${a}="${v}": no such file`); else refs.add(relative(ROOT, file));
}
// (the wordmark's accent group is the one exception: lib/wordmark.mjs draws it so)
for (const m of html.matchAll(/\sstyle="([^"]*)"/g))
  if (m[1] !== 'fill:var(--teal-text,currentColor)' && !/^\s*(--[a-z0-9-]+\s*:\s*[^;"]+;?\s*)+$/i.test(m[1])) fail(`style="${m[1]}": only custom properties (style="--i:3"), the rest is the stylesheet's`);
for (const m of html.matchAll(/<[a-z][^>]*\s(on[a-z]+)=/gi)) fail(`an inline ${m[1]}= handler: attach it from hub/app.js`);
for (const m of html.matchAll(/url\((['"]?)([^)'"]+)\1\)/g)) if (!/^data:/.test(m[2]) && !existsSync(localFile(m[2]))) fail(`url(${m[2]}): no such file`);
// the stylesheets' own pictures count as referenced
for (const css of ['style.css', ...(existsSync(join(HUB, 'css')) ? readdirSync(join(HUB, 'css')) : []).filter((f) => f.endsWith('.css')).map((f) => `css/${f}`)]) {
  const p = join(HUB, css);
  if (!existsSync(p)) continue;
  for (const m of readFileSync(p, 'utf8').matchAll(/url\((['"]?)([^)'"]+)\1\)/g))
    if (!/^data:/.test(m[2])) refs.add(relative(ROOT, join(dirname(p), m[2].split(/[?#]/)[0])));
}
// app.js builds a few picture paths in script ('img/motion/sting-' + ...): any 'img/…' literal there counts
for (const m of readFileSync(join(HUB, 'app.js'), 'utf8').matchAll(/'(sting-(?:916|169)\.webp)/g)) refs.add(relative(ROOT, join(HUB, 'img/motion', m[1])));
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [relative(ROOT, p)]; });
const unref = existsSync(join(HUB, 'img')) ? walk(join(HUB, 'img')).filter((f) => !refs.has(f) && !refs.has(f.replace(/\.full\.webp$/, '.webp'))) : [];
if (unref.length) (casesIn === CASES.length ? fail : (m) => notes.push(m))(`${unref.length} file${unref.length === 1 ? '' : 's'} in hub/img that nothing references${casesIn < CASES.length ? ` (${casesIn} of ${CASES.length} cases in)` : ''}: ${unref.slice(0, 6).join(', ')}${unref.length > 6 ? ', …' : ''}`);

/* ---------------- outputs ---------------- */
const page = withCsp(html, cspKind('hub/index.html'));
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
const OUT = [['hub/index.html', page], ['hub/i18n.js', i18n]];
if (process.argv.includes('--check')) {
  const stale = OUT.filter(([f, s]) => !existsSync(join(ROOT, f)) || readFileSync(join(ROOT, f), 'utf8') !== s).map(([f]) => f);
  console.log(stale.length ? `✗ ${stale.join(', ')} differ from hub/src (run: node scripts/build-hub.mjs)` : '✓ hub/index.html and hub/i18n.js match hub/src');
  process.exit(stale.length ? 1 : 0);
}
for (const [f, s] of OUT) writeFileSync(join(ROOT, f), s);
console.log(`✓ hub/index.html (${(page.length / 1000).toFixed(1)} kB, ${casesIn} of ${CASES.length} cases) and hub/i18n.js (${Object.keys(DICT.fr).length} keys × 3)`);
