#!/usr/bin/env node
/**
 * Repo invariant check — run before every commit (`npm run check`).
 *
 * Enforces the conventions the site depends on but that break silently:
 *   1. i18n balance   — every dictionary key appears exactly 3× (fr/en/ar)
 *   2. i18n coverage  — every data-i18n* attribute resolves to a key
 *   3. assets         — every local src/href on every page exists on disk
 *   4. stamp sync     — all ?v= cache-bust stamps are identical across pages
 *   5. client links   — data-client links agree (plate, card, browser bar, shots, showcase); none on hub/
 *   7. generated pages — scene/index.html, the voices region and the French baked
 *                        into index.html (with its FAQ structured data) equal their
 *                        generators' output, and every page with an inline
 *                        dictionary resolves its keys in fr/en/ar
 *   6. deploy coverage — the published set (scripts/site.mjs DEPLOY) exists, every
 *                        page folder is classified, deployed pages link only to
 *                        deployed files (nothing points into knowledge-base/, scripts/…),
 *                        and every page names one canonical, from its markup or its
 *                        head script but never both
 *   8. anchors + claims — every #fragment link lands on an id in its target page,
 *                        copy the owner retired as unsupported does not come back, and
 *                        French copy keeps its no-break spaces before ? ! ; : » etc.
 *
 * Exits non-zero on any failure. No dependencies.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, normalize, basename } from 'node:path';
import { ROOT, PAGES, EXTRA_PAGES, DEPLOY, DEPLOY_SKIP, NOT_DEPLOYED, BASE, LANGS, LEGAL_PUBLISHED } from './site.mjs';
import { SCENE_HTML } from './build-scene.mjs';
import { renderSitemap } from './build-sitemap.mjs';
import { applyVoices } from './build-voices.mjs';
import { renderLegal, markerRegions } from './build-legal.mjs';
import { LEGAL, missing as legalMissing } from './legal-data.mjs';
import { validate as validateVoices } from './voices-data.mjs';
import { bakeFr } from './build-fr.mjs';
import { loadDicts, norm } from './lib/i18n.mjs';
import { UI as SCENE_UI, PROJECTS as SCENE_PROJECTS } from './scene-data.mjs';

const read = (p) => readFileSync(join(ROOT, p), 'utf8');
let fail = 0;
const bad = (msg) => { console.error('✗ ' + msg); fail = 1; };
const ok = (msg) => console.log('✓ ' + msg);

/* 1 + 2 — i18n */
const app = read('assets/app.js');
const DICT = loadDicts(app);
const counts = {};
for (const m of app.matchAll(/'([a-z0-9]+(?:\.[A-Za-z0-9_.]+)?)'\s*:/g)) {
  counts[m[1]] = (counts[m[1]] || 0) + 1;
}
// keys that look like i18n entries: referenced from HTML or dotted
const html = read('index.html');
const refs = new Set([...html.matchAll(/data-i18n(?:-[a-z]+)?="([^"]+)"/g)].map((m) => m[1]));
// a key must exist once per language (×3) — variant copy overrides add whole
// extra fr/en/ar sets, so any multiple of 3 is balanced
const unbalanced = Object.entries(counts).filter(([k, v]) => (refs.has(k) || k.includes('.')) && v % 3 !== 0);
unbalanced.length
  ? bad('i18n unbalanced (must be a multiple of 3): ' + unbalanced.map(([k, v]) => `${k}=${v}`).join(', '))
  : ok('i18n dictionary balanced (every key ×3 per copy set)');
const orphans = [...refs].filter((k) => !counts[k]);
orphans.length ? bad('orphan data-i18n refs: ' + orphans.join(', ')) : ok('no orphan data-i18n references');

/* 3 — assets exist */
// every entry page plus the embedded WorkspaceHQ pages, each resolved from its own folder
const pages = Object.fromEntries([...PAGES, ...EXTRA_PAGES].map((f) => [f, dirname(f)]));
const missing = [];
for (const [f, base] of Object.entries(pages)) {
  // strip HTML comments first: commented-out markup (e.g. slots waiting on
  // artwork) references files that legitimately don't exist yet
  const src = read(f).replace(/<!--[\s\S]*?-->/g, '');
  for (const m of src.matchAll(/(?:src|href)="([^"#][^"]*)"/g)) {
    const u = m[1].split('#')[0].split('?')[0];
    if (/^(https?:|mailto:|data:|\/\/)/.test(u) || u === '') continue;
    // template bindings ({{ x }}) and app-internal schemes (model:rocket) in the
    // WorkspaceHQ console are resolved by its runtime, not by the server
    if (u.includes('{{') || /^[a-z][a-z0-9+.-]*:/i.test(u)) continue;
    // An inline script assembling a tag by concatenation ("href=\"' + x + '\"")
    // is code, not a path. Its real targets are checked below from the literals.
    if (u.includes("'")) continue;
    if (!existsSync(join(ROOT, base, u)) && !existsSync(join(ROOT, base, u.replace(/\/$/, '')))) {
      missing.push(`${f} → ${m[1]}`);
    }
  }
  // Paths that only exist inside inline scripts: quoted 'assets/...' literals
  // (e.g. NUMIDEA_ENG_CSS) and the preloaded font names, which are listed as
  // bare names and joined onto 'assets/fonts/' + f + '.woff2' at runtime.
  for (const m of src.matchAll(/'((?:\.\.\/)*assets\/[^'?\s]+)/g)) {
    if (m[1].endsWith('/')) continue;                      // a prefix, not a file
    if (!existsSync(join(ROOT, base, m[1]))) missing.push(`${f} → ${m[1]} (script)`);
  }
  if (/assets\/fonts\/' \+ \w+ \+ '\.woff2/.test(src)) {
    for (const m of src.matchAll(/'([a-z0-9]+(?:-[a-z0-9]+)*-(?:latin|arabic|latin-ext))'/g)) {
      if (!existsSync(join(ROOT, base, 'assets/fonts', m[1] + '.woff2'))) missing.push(`${f} → assets/fonts/${m[1]}.woff2 (preload)`);
    }
  }
}
missing.length ? bad('missing assets: ' + missing.join(', ')) : ok('all local asset references resolve');

/* 3b — parallax depths parse. A typo'd data-parallax silently coerces to 0,
   which looks like "the effect just isn't working" and is miserable to find. */
const badDepth = [];
for (const f of ['index.html', 'hub/index.html']) {
  for (const m of read(f).replace(/<!--[\s\S]*?-->/g, '').matchAll(/data-parallax="([^"]*)"/g)) {
    if (!Number.isFinite(parseFloat(m[1])) || parseFloat(m[1]) === 0) badDepth.push(`${f} → "${m[1]}"`);
  }
}
badDepth.length
  ? bad('unparseable data-parallax depths: ' + badDepth.join(', '))
  : ok('parallax depths all parse to a non-zero number');

/* 4 — cache stamps identical everywhere */
const stamps = new Set();
for (const f of Object.keys(pages)) for (const m of read(f).matchAll(/\?v=(\d+)/g)) stamps.add(m[1]);
stamps.size > 1
  ? bad('cache-bust stamps diverge: ' + [...stamps].join(' vs ') + '  (run: npm run bump)')
  : ok(`cache-bust stamp uniform (${[...stamps][0] || 'none'})`);

/* 5 — client links agree everywhere. index.html is the source: every link to
   a client site carries data-client="<slug>" (hero plate + work card). The plate
   and the card must point at the same URL, the card's fake browser bar must name
   that host, scripts/shots.mjs must cover the same clients, the showcase may
   only use those URLs, and the hub (the artist's page) lists none of them. */
const clientHref = {};
const tagDrift = [];
for (const m of html.matchAll(/<a\b[^>]*\bdata-client="([a-z0-9-]+)"[^>]*>/g)) {
  const href = (/\bhref="([^"]+)"/.exec(m[0]) || [])[1];
  if (!href) { tagDrift.push(`${m[1]}: link without href`); continue; }
  if (clientHref[m[1]] && clientHref[m[1]] !== href) tagDrift.push(`${m[1]}: ${clientHref[m[1]]} vs ${href}`);
  clientHref[m[1]] ||= href;
}
for (const art of html.split(/<article\b/).slice(1)) {
  const bar = (/class="browser"[^>]*>(?:<i><\/i>)*<span>([^<]+)<\/span>/.exec(art) || [])[1];
  const link = /<a\b[^>]*\bdata-client="([a-z0-9-]+)"/.exec(art);
  if (bar && link && new URL(clientHref[link[1]]).host !== bar) tagDrift.push(`${link[1]}: browser bar "${bar}" vs ${clientHref[link[1]]}`);
}
const shotClients = new Set([...read('scripts/shots.mjs').matchAll(/client:\s*'([a-z0-9-]+)'/g)].map((m) => m[1]));
const pageClients = new Set(Object.keys(clientHref));
const shotDrift = [...new Set([...shotClients, ...pageClients])].filter((c) => !(shotClients.has(c) && pageClients.has(c)));
const known = new Set(Object.values(clientHref));
const stray = [...read('scripts/scene-data.mjs').matchAll(/url:\s*'(https:[^']+)'/g)].map((m) => m[1]).filter((u) => !known.has(u));
const captureHosts = [...read('scripts/shots.mjs').matchAll(/capture:\s*'https:\/\/([^'/]+)/g)].map((m) => m[1]);
const hub = read('hub/index.html').replace(/<!--[\s\S]*?-->/g, '');
const onHub = [...new Set([...Object.values(clientHref).map((u) => new URL(u).host), ...captureHosts])].filter((h) => hub.includes(h));
tagDrift.length ? bad('client links disagree: ' + tagDrift.join('; ')) : ok(`client links agree across plate, cards and browser bars (${pageClients.size} clients)`);
shotDrift.length ? bad('scripts/shots.mjs and the page cover different clients: ' + shotDrift.join(', ')) : ok('screenshot pipeline covers exactly the linked clients');
stray.length ? bad('showcase uses URLs the main page does not link: ' + stray.join(', ')) : ok('showcase URLs all linked from the main page');
onHub.length ? bad("client sites listed on the hub (it is the artist's page): " + onHub.join(', ')) : ok('hub lists no client sites');

/* 6 — deploy coverage */
const deployMissing = DEPLOY.filter((e) => !existsSync(join(ROOT, e)));
// every root folder, page or not: a new folder (campaign/, drafts…) must be
// declared published or private before it can reach a deploy by accident
const rootDirs = readdirSync(ROOT).filter((e) => statSync(join(ROOT, e)).isDirectory());
const unclassified = rootDirs.filter((d) => !DEPLOY.includes(d) && !NOT_DEPLOYED.includes(d));
const leaks = [];
for (const f of PAGES) {
  const src = read(f).replace(/<!--[\s\S]*?-->/g, '');
  for (const m of src.matchAll(/(?:src|href)="([^"#][^"]*)"/g)) {
    const u = m[1].split('#')[0].split('?')[0];
    if (!u || /^(https?:|mailto:|tel:|data:|\/\/)/.test(u) || u.includes('{{') || u.includes("'")) continue;
    const rel = normalize(join(dirname(f), u)).replace(/\\/g, '/').replace(/\/$/, '');
    if (rel === '.' || rel === '') continue;               // the site root is index.html
    const top = rel.split('/')[0];
    if (rel.startsWith('..') || !DEPLOY.includes(top) || DEPLOY_SKIP.includes(basename(rel))) leaks.push(`${f} → ${m[1]}`);
  }
}
const sitemapLeaks = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => {
  if (!u.startsWith(BASE)) return true;
  // ?lang= alternates are the same published page
  const rel = u.slice(BASE.length).split('?')[0].replace(/\/$/, '');
  return rel !== '' && !DEPLOY.includes(rel.split('/')[0]);
});
const problems = [
  deployMissing.length && 'deploy list names missing paths: ' + deployMissing.join(', '),
  unclassified.length && 'root folders neither deployed nor excluded (add to scripts/site.mjs): ' + unclassified.join(', '),
  leaks.length && 'deployed pages link to files that are not published: ' + leaks.join(', '),
  sitemapLeaks.length && 'sitemap lists unpublished URLs: ' + sitemapLeaks.join(', '),
].filter(Boolean);
// absolute links to this site (og:image, canonical, hreflang) are deploy links too
for (const f of PAGES) {
  for (const m of read(f).matchAll(new RegExp('"' + BASE.replace(/[.]/g, '\\.') + '([^"?#]*)', 'g'))) {
    const rel = m[1].replace(/\/$/, '') || 'index.html';
    const file = existsSync(join(ROOT, rel)) && statSync(join(ROOT, rel)).isDirectory() ? join(rel, 'index.html') : rel;
    if (!existsSync(join(ROOT, file)) || !DEPLOY.includes(rel.split('/')[0])) problems.push(`${f} names ${BASE}${m[1]}, which is not published`);
  }
}
if (read('sitemap.xml') !== renderSitemap()) problems.push('sitemap.xml is stale (run: npm run build)');
problems.length ? problems.forEach(bad) : ok(`deploy set covers every page and link (${DEPLOY.length} entries); sitemap current`);
// One canonical per page, from one place. index.html, scene/ and legal/ set
// theirs in the head script, because each language version names itself
// (?lang=en is its own URL); a static <link rel="canonical"> back in their
// markup would give them two, the static one naming the French page on every
// language view, and search engines then fold the versions together. hub/
// and workspacehq/ carry a static one naming themselves; 404.html has none.
const canonErr = [];
let canonStatic = 0, canonScripted = 0;
for (const f of PAGES) {
  const src = read(f).replace(/<!--[\s\S]*?-->/g, '');
  const inline = [...src.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).join('\n');
  const scripted = /\.rel\s*=\s*(['"])canonical\1|setAttribute\(\s*(['"])rel\2\s*,\s*(['"])canonical\3/.test(inline) ? 1 : 0;
  const links = src.replace(/<script\b[\s\S]*?<\/script>/gi, '').match(/<link\b[^>]*\brel\s*=\s*["']?[^"'>]*\bcanonical\b[^>]*>/gi) || [];
  const want = f === '404.html' ? 0 : 1, self = BASE + (dirname(f) === '.' ? '' : dirname(f) + '/');
  if (scripted && links.length) canonErr.push(`${f} has a static canonical and sets one in its head script (remove the <link>)`);
  else if (links.length + scripted !== want) canonErr.push(`${f} names ${links.length + scripted} canonical URLs (want ${want})`);
  for (const l of links) {
    const href = (/\bhref\s*=\s*["']?([^"'\s>]+)/.exec(l) || [])[1];
    if (href !== self) canonErr.push(`${f}: static canonical ${href} is not the page's own URL ${self}`);
  }
  canonStatic += links.length; canonScripted += scripted;
}
canonErr.length ? bad('canonical: ' + canonErr.join('; '))
  : ok(`one canonical per page (${canonStatic} static, ${canonScripted} set by the head script, none on 404.html)`);

/* 7 — generated pages */
read('scene/index.html') === SCENE_HTML
  ? ok('scene/index.html matches scripts/build-scene.mjs')
  : bad('scene/index.html differs from its generator (edit scripts/scene-data.mjs, then npm run scene)');
const dictGaps = [];
for (const f of PAGES) {
  const src = read(f);
  const m = /<script type="application\/json" id="i18n">([\s\S]*?)<\/script>/.exec(src);
  if (!m) continue;
  let dict; try { dict = JSON.parse(m[1]); } catch (e) { dictGaps.push(`${f}: dictionary is not valid JSON`); continue; }
  for (const r of src.matchAll(/data-i18n(?:-[a-z]+)?="([^"]+)"/g)) {
    for (const l of LANGS) if (!dict[l] || dict[l][r[1]] == null) dictGaps.push(`${f}: ${r[1]} missing in ${l}`);
  }
}
dictGaps.length ? bad('inline dictionaries incomplete: ' + [...new Set(dictGaps)].join(', ')) : ok('inline dictionaries cover every key in fr/en/ar');

/* 8 — anchors and retired claims */
const ids = (f) => new Set([...read(f).matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
const deadAnchors = [];
for (const f of PAGES) {
  const src = read(f).replace(/<!--[\s\S]*?-->/g, '');
  for (const m of src.matchAll(/\bhref="([^"]*)#([^"/]+)"/g)) {
    const [, path, frag] = m;
    if (/^(https?:|mailto:|\/\/)/.test(path) || path.includes("'") || frag.includes("'")) continue;
    let target = path ? normalize(join(dirname(f), path)).replace(/\\/g, '/') : f;
    if (target === '.' || target.endsWith('/') || existsSync(join(ROOT, target)) && statSync(join(ROOT, target)).isDirectory()) target = join(target, 'index.html').replace(/\\/g, '/');
    if (!existsSync(join(ROOT, target))) continue;            // check 3 reports missing files
    if (!ids(target).has(frag)) deadAnchors.push(`${f} → ${m[1]}#${frag}`);
  }
}
deadAnchors.length ? bad('links to ids that do not exist: ' + deadAnchors.join(', ')) : ok('every #fragment link lands on an id');
// id references inside a page (a dangling aria-labelledby names nothing)
const deadRefs = [];
for (const f of PAGES) {
  const src = read(f).replace(/<!--[\s\S]*?-->/g, ''), own = ids(f);
  for (const m of src.matchAll(/\b(aria-labelledby|aria-describedby|aria-controls|for)="([^"]+)"/g)) {
    for (const id of m[2].split(/\s+/)) if (id && !id.includes("'") && !own.has(id)) deadRefs.push(`${f}: ${m[1]}="${id}"`);
  }
}
// The form note promises the site keeps nothing. Turning the Supabase lead
// store on breaks that promise: it needs the published legal page, the store's
// region in scripts/legal-data.mjs, and new form.note copy in every language
// and in the French baked into index.html. app.js only tests truthiness, so
// "on" is any assignment whose value is truthy: a non-empty string literal in
// any quote style, or any other expression except null, undefined, false, 0,
// NaN and void 0. A trailing // comment is not part of the value, and lines
// commented out (// or /* */ at the start of a line) assign nothing. Every
// assignment counts; when in doubt the store reads as on.
function cfgOn(src, name) {
  src = src.replace(/<!--[\s\S]*?-->/g, '').replace(/^[ \t]*\/\*[\s\S]*?\*\//gm, '').replace(/^[ \t]*\/\/.*$/gm, '');
  // the rest of the statement, comments dropped
  const upTo = (s) => s.split(/[;,\n]/)[0].replace(/\/\*.*?\*\/|\/\/.*$/g, '').trim();
  for (const m of src.matchAll(new RegExp(`\\b${name}\\s*=(?!=)\\s*`, 'g'))) {
    const rest = src.slice(m.index + m[0].length);
    const str = /^(["'`])((?:\\[\s\S]|(?!\1)[^\\])*)\1/.exec(rest);
    if (str) {
      // "" on its own is off; "" + something is an expression: on
      if (str[2] !== '' || !/^[)}]?$/.test(upTo(rest.slice(str[0].length)))) return true;
    } else if (!/^(?:null|undefined|false|0|NaN|void 0)$/.test(upTo(rest))) return true;
  }
  return false;
}
if (cfgOn(html, 'NUMIDEA_SUPABASE_URL') || cfgOn(html, 'NUMIDEA_SUPABASE_KEY')) {
  const KEEPS_NOTHING = /ne conserve pas|does not keep|keeps nothing|لا يحتفظ|لا يحفظ/;
  const notes = ['fr', 'en', 'ar'].map((l) => DICT[l]['form.note'] || '');
  notes.push((/data-i18n="form\.note">([^<]*)</.exec(html) || [])[1] || '');
  if (!LEGAL_PUBLISHED || !LEGAL.privacy.supabaseRegion || notes.some((n) => KEEPS_NOTHING.test(n)))
    bad('the Supabase lead store is on: publish legal/, set privacy.supabaseRegion in scripts/legal-data.mjs, and rewrite form.note in fr, en and ar');
  else ok('Supabase store on, with the legal page, its region and an honest form note');
} else ok('form store off; form.note ("the site keeps nothing") holds');
// Prices have one source. The tier cards and the maintenance line carry their
// dinar figures in the markup (scripts off); they must equal PRICE_MODEL and
// RETAINER in app.js, and no € or $ amount may be typed into the page: the
// converted views are computed at runtime from the same numbers.
const priceErr = [];
const digits = (x) => Number(String(x).replace(/\D/g, ''));
const base = (key) => { const m = new RegExp(key + ":\\s*\\{\\s*base:\\s*\\[(\\d+),\\s*(\\d+)\\]").exec(app); return m && [Number(m[1]), Number(m[2])]; };
for (const m of html.matchAll(/<p class="t-range" data-tier="([a-z]+)"><b>([^<]+)<\/b>/g)) {
  const want = base(m[1]); const got = m[2].split('–').map(digits);
  if (!want || got[0] !== want[0] || got[1] !== want[1]) priceErr.push(`tier ${m[1]}: markup ${m[2]} vs PRICE_MODEL ${want}`);
}
const ret = (/RETAINER = \[(\d+), (\d+)\]/.exec(app) || []).slice(1).map(Number);
const retHtml = (/<b id="pr-ret">([^<]+)<\/b>/.exec(html) || [])[1] || '';
if (retHtml.split('–').map(digits).join() !== ret.join()) priceErr.push(`maintenance: markup ${retHtml} vs RETAINER ${ret}`);
if ((html.match(/class="t-range"/g) || []).length !== (html.match(/class="t-range" data-tier=/g) || []).length) priceErr.push('a tier range without data-tier is not converted');
// only Numidea's own prices: the market table quotes other markets on purpose
const ownPrices = html.slice(html.indexOf('<div class="tiers">'), html.indexOf('<div class="market"'));
if (!ownPrices) priceErr.push('could not find the tiers-to-market region');
const typed = [...ownPrices.replace(/<!--[\s\S]*?-->/g, '').matchAll(/(?:€|\$)\s?\d[\d\s  .,]*|\d[\d  .,]*\s?(?:€|\$)/g)]
  .map((m) => m[0]).filter((x) => !/^\$\{/.test(x));
if (typed.length) priceErr.push('hard-coded €/$ amounts in index.html: ' + typed.slice(0, 5).join(' | '));
priceErr.length ? bad('prices drift from PRICE_MODEL: ' + priceErr.join('; ')) : ok('tier and maintenance figures equal PRICE_MODEL/RETAINER; no typed €/$ amounts');
// Legal notice + privacy: published only when complete. While legal/ does not
// exist, nothing may point at it (comments included) and the two link regions
// in index.html stay empty; once it exists, every owner field must be filled,
// the page must equal fresh generator output and both links must be in place.
const legalErr = [];
const regions = (published) => { try { return markerRegions(html, published); } catch (e) { legalErr.push(e.message); return html; } };
if (!LEGAL_PUBLISHED) {
  for (const f of PAGES) if (/["'(=](?:\.\.\/|\.\/)?legal\//.test(read(f))) legalErr.push(`${f} points at legal/, which is not published`);
  if (regions(false) !== html) legalErr.push('index.html legal link regions must stay empty until legal/ is published');
} else {
  const gaps = legalMissing(LEGAL);
  if (gaps.length) legalErr.push('legal/ exists but scripts/legal-data.mjs still misses ' + gaps.join(', '));
  else if (read('legal/index.html') !== renderLegal(LEGAL)) legalErr.push('legal/index.html differs from scripts/build-legal.mjs (run: npm run build)');
  if (regions(true) !== html) legalErr.push('index.html lacks the legal and privacy links (run: npm run build)');
  for (const h of ['legal/#mentions', 'legal/#confidentialite'])
    if (!html.includes(`href="${h}"`)) legalErr.push(`index.html has no link to ${h}`);
}
legalErr.length ? bad('legal page: ' + legalErr.join('; '))
  : ok(LEGAL_PUBLISHED ? 'legal page complete, current and linked' : 'legal page unpublished and nothing points at it');
// The French baked into index.html (text, translated attributes, title,
// description, FAQ structured data) equals I18N.fr: app.js re-applies the
// dictionary on load, so any drift shows as copy changing after paint, and
// no-JS readers and the FAQ rich result would read an older offer.
let frStale = '';
try { frStale = bakeFr(html, DICT.fr) !== html ? 'differs' : ''; } catch (e) { frStale = e.message; }
frStale ? bad('index.html French: ' + (frStale === 'differs' ? 'differs from I18N.fr (run: npm run build)' : frStale))
  : ok('index.html French and its FAQ structured data equal I18N.fr');
// Client voices: valid (consent recorded, delivered clients only) and the
// index.html region equals what scripts/build-voices.mjs writes from them.
const voiceErr = validateVoices();
let voiceStale = false;
try { voiceStale = applyVoices(html) !== html; } catch (e) { voiceErr.push(String(e.message)); }
voiceErr.length ? bad('client voices: ' + voiceErr.join('; '))
  : voiceStale ? bad('voices region in index.html is stale (run: npm run build)')
  : ok('client voices valid and in step with index.html');
// Arabic uses Western digits on this site (owner decision): no Arabic-Indic
// digits in any shipped page, dictionary or generator.
const indic = [];
for (const f of [...PAGES, 'assets/app.js', 'scripts/scene-data.mjs', 'scripts/build-legal.mjs', 'scripts/voices-data.mjs']) {
  const hits = (read(f).match(/[٠-٩۰-۹٫٬]/g) || []).length;
  if (hits) indic.push(`${f} (${hits})`);
}
indic.length ? bad('Arabic-Indic digits (use 0-9): ' + indic.join(', ')) : ok('Arabic uses Western digits everywhere');
// French typography: no breakable space before ? ! ; : » or after «, nor
// between a number and % or h (U+202F narrow no-break space, or U+00A0, holds
// them together). Otherwise the browser may break the line there and strand
// the mark or the unit on its own. Every French string the pages show:
// I18N.fr (EXTRA merged), scene-data UI.fr and each project's French.
const frStrings = [];
const collect = (v, at) => {
  if (typeof v === 'string') frStrings.push([at, v]);
  else if (Array.isArray(v)) v.forEach((x, i) => collect(x, `${at}[${i}]`));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) collect(x, `${at}.${k}`);
};
const collectFr = (v, at) => {                 // only what sits under a `fr` key
  if (Array.isArray(v)) v.forEach((x, i) => collectFr(x, `${at}[${i}]`));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) (k === 'fr' ? collect : collectFr)(x, `${at}.${k}`);
};
collect(DICT.fr, 'I18N.fr');
collect(SCENE_UI.fr, 'scene UI.fr');
SCENE_PROJECTS.forEach((p) => collectFr(p, `scene ${p.slug}`));
const FR_SPACE = /[ \t\r\n](?=[?!;:»])|«[ \t\r\n]|\d[ \t\r\n](?=(?:%|h)(?!\p{L}))/gu;
const frTypo = [];
for (const [at, s] of frStrings) {
  const t = norm(s.replace(/<[^>]*>/g, ''));   // as rendered: tags out, entities decoded
  const hits = [...t.matchAll(FR_SPACE)].map((m) => `"…${t.slice(Math.max(0, m.index - 12), m.index + 4)}…"`);
  if (hits.length) frTypo.push(`${at} ${hits.join(' ')}`);
}
frTypo.length ? bad(`French typography (U+202F before ? ! ; : », after «, and between a number and % or h; ${frTypo.length} strings): ` + frTypo.join(', '))
  : ok(`French typography holds in ${frStrings.length} strings (no breakable space before ? ! ; : », after «, or before % and h)`);
// One contact address everywhere: every mailto on every page, the form's
// mailto in app.js and the structured-data email are the same string.
const mails = new Map();
for (const f of [...PAGES, 'assets/app.js']) {
  const src = read(f).replace(/<!--[\s\S]*?-->/g, '');
  for (const m of src.matchAll(/mailto:([^"'?\s<>$]+)/g)) mails.set(m[1], (mails.get(m[1]) || []).concat(f));
  for (const m of src.matchAll(/"email"\s*:\s*"([^"]+)"/g)) mails.set(m[1], (mails.get(m[1]) || []).concat(f + ' (JSON-LD)'));
}
mails.size === 1 ? ok(`one contact address across the site (${[...mails.keys()][0]})`)
  : bad('contact addresses differ: ' + [...mails].map(([a, fs]) => `${a} in ${[...new Set(fs)].join(', ')}`).join(' | '));
// structured data parses, and states the same phone and email as the page
// (every ld+json block, whatever other attributes it carries: id="ld-faq"…)
const ldErr = [];
for (const f of PAGES) for (const m of read(f).replace(/<!--[\s\S]*?-->/g, '').matchAll(/<script\b[^>]*\btype=["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi)) {
  let d; try { d = JSON.parse(m[1]); } catch (e) { ldErr.push(`${f}: JSON-LD does not parse`); continue; }
  const wa = (/NUMIDEA_WA = '(\d+)'/.exec(read(f)) || [])[1];
  if (d.telephone && wa && d.telephone.replace(/\D/g, '') !== wa) ldErr.push(`${f}: JSON-LD telephone ${d.telephone} ≠ NUMIDEA_WA ${wa}`);
  if (d.email && !read(f).includes('mailto:' + d.email)) ldErr.push(`${f}: JSON-LD email ${d.email} is not the page's mailto`);
}
ldErr.length ? bad(ldErr.join(', ')) : ok('structured data parses and matches the page');
deadRefs.length ? bad('attributes point at ids that do not exist: ' + deadRefs.join(', ')) : ok('every aria-labelledby/describedby/controls and label for= resolves');
// Owner decision: Glaive is a portfolio demo (4 live client sites, not 5), the
// "most chosen" tier claim has no data behind it, and client sites are not demos.
const RETIRED = ['Le plus choisi', 'Most chosen', 'الأكثر اختياراً', 'Démo →', 'Live demo →', 'عرض حيّ', '5 / 7'];
const back = [];
for (const f of [...PAGES, 'assets/app.js', 'scripts/scene-data.mjs', 'scripts/voices-data.mjs']) {
  const src = read(f);
  for (const s of RETIRED) if (src.includes(s)) back.push(`${f}: "${s}"`);
}
back.length ? bad('retired claims are back: ' + back.join(', ')) : ok('retired claims stay retired');

process.exit(fail);
