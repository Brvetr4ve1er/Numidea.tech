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
 *  5b. client logos   — the proof band's logo strip: the four delivered clients only, each
 *                        logo its own file, alt, intrinsic size and mask, linked to its card
 *  5c. client benefits — each project sheet: the client's context and 3-5 benefits
 *                        (fr/en/ar, each with its live page); each client work card: one
 *                        benefit line linked to its sheet; no figures or results anywhere
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
import { runInNewContext } from 'node:vm';
import { join, dirname, normalize, basename } from 'node:path';
import { ROOT, PAGES, EXTRA_PAGES, DEPLOY, DEPLOY_SKIP, NOT_DEPLOYED, BASE, LANGS, LEGAL_PUBLISHED } from './site.mjs';
import { SCENE_HTML } from './build-scene.mjs';
import { renderSitemap } from './build-sitemap.mjs';
import { applyVoices } from './build-voices.mjs';
import { renderLegal, markerRegions } from './build-legal.mjs';
import { LEGAL, missing as legalMissing } from './legal-data.mjs';
import { validate as validateVoices, VOICE_CLIENTS } from './voices-data.mjs';
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

/* 5b — the client logo strip in the proof band ("Ils nous ont confié leur
   site"): exactly the four delivered clients (VOICE_CLIENTS: never the Glaive
   demo or WorkspaceHQ), each logo a file in assets/clients/ with the client's
   name as its alt, width/height equal to the file's own size (the box is
   reserved before the file arrives), the same file as its styles.css
   mask, and a link to that client's own work card. scripts/client-logos.mjs
   takes the files from the live sites. */
const logoErr = [];
const strip = (/<ul class="cl-row">([\s\S]*?)<\/ul>/.exec(html) || [])[1];
const fileSize = (f) => {
  const b = readFileSync(join(ROOT, f));
  if (f.endsWith('.svg')) {
    const tag = /<svg\b[^>]*>/.exec(b.toString('utf8'))?.[0] || '';
    return [Number(/\swidth="([\d.]+)"/.exec(tag)?.[1]), Number(/\sheight="([\d.]+)"/.exec(tag)?.[1])];
  }
  const kind = b.toString('latin1', 12, 16);
  if (kind === 'VP8X') return [b.readUIntLE(24, 3) + 1, b.readUIntLE(27, 3) + 1];
  if (kind === 'VP8L') { const v = b.readUInt32LE(21); return [(v & 0x3fff) + 1, ((v >> 14) & 0x3fff) + 1]; }
  if (kind === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  return [NaN, NaN];
};
const css = read('assets/styles.css');
const seen = [];
if (!strip) logoErr.push('no <ul class="cl-row"> in index.html');
else for (const li of strip.match(/<li>[\s\S]*?<\/li>/g) || []) {
  const slug = (/class="cl cl-([a-z0-9-]+)"/.exec(li) || [])[1];
  const at = (k) => (new RegExp(`\\s${k}="([^"]*)"`).exec(li) || [])[1];
  if (!slug || !Object.hasOwn(VOICE_CLIENTS, slug)) { logoErr.push(`${slug || '?'}: not a delivered client`); continue; }
  seen.push(slug);
  const [href, src, alt] = [at('href'), at('src'), at('alt')];
  if (alt !== VOICE_CLIENTS[slug]) logoErr.push(`${slug}: alt "${alt}" ≠ "${VOICE_CLIENTS[slug]}"`);
  const card = html.split(/<article\b/).slice(1).find((a) => a.startsWith(` id="w-${slug}"`));
  if (href !== `#w-${slug}` || !card || !card.includes(`data-client="${slug}"`)) logoErr.push(`${slug}: must link to its own work card, <article id="w-${slug}"> with data-client="${slug}"`);
  if (!/^assets\/clients\/[a-z0-9-]+\.(svg|webp)$/.test(src || '') || !existsSync(join(ROOT, src))) { logoErr.push(`${slug}: logo file ${src} missing`); continue; }
  const [w, h] = fileSize(src);
  if (Number(at('width')) !== Math.round(w) || Number(at('height')) !== Math.round(h)) logoErr.push(`${slug}: width/height ${at('width')}×${at('height')} ≠ ${src} ${Math.round(w)}×${Math.round(h)}`);
  const masks = [...css.matchAll(new RegExp(`\\.cl-${slug} img\\{[^}]*?mask-image:url\\(([^)]+)\\)`, 'g'))].map((m) => m[1]);
  if (!masks.length || masks.some((m) => 'assets/' + m !== src)) logoErr.push(`${slug}: styles.css mask (${masks.join(', ') || 'none'}) is not ${src}`);
}
const absent = Object.keys(VOICE_CLIENTS).filter((c) => !seen.includes(c));
if (strip && absent.length) logoErr.push('missing: ' + absent.join(', '));
const unused = readdirSync(join(ROOT, 'assets/clients')).filter((f) => !(strip || '').includes(`assets/clients/${f}"`));
if (unused.length) logoErr.push('assets/clients/ files not on the strip: ' + unused.join(', '));
logoErr.length ? bad('client logo strip: ' + logoErr.join('; ')) : ok(`client logo strip: the ${seen.length} delivered clients, each its own file, alt, size and work card`);

/* 5c — what each project gives the client: every project sheet carries the
   client's context and 3-5 benefits in fr/en/ar, each with the live page
   that shows it (`at`); every delivered client's work card carries one
   benefit line (<slug-key>.gain, linked to its sheet's #gv-<slug> when it
   has one, the link named "… — le détail sur la planche" by a visually
   hidden work.gainMore so it says where it goes). Benefits say what someone can now do, never a result: no
   figures at all, no %, no "increased"/"boosted"/"conversion" and the like. */
const gainErr = [];
const RESULT = /[0-9٠-٩۰-۹%]|\b(augment|hausse|boost|doubl|tripl|record|increas|grow|conversion|ranking|classement|r[ée]sultat|result|ROI|leader)|زياد|ارتفاع|ضاعف|نسبة|نتائج|الأول في/i;
const say = (where, s) => { if (typeof s !== 'string' || !s.trim()) gainErr.push(`${where}: empty`); else if (RESULT.test(s)) gainErr.push(`${where}: reads as a metric or result ("${s.match(RESULT)[0]}")`); };
for (const p of SCENE_PROJECTS) {
  for (const l of LANGS) say(`${p.slug} context.${l}`, p.context?.[l]);
  const g = p.gains || [];
  if (g.length < 3 || g.length > 5) gainErr.push(`${p.slug}: ${g.length} benefits (3 to 5)`);
  g.forEach((x, i) => {
    if (!/^\/\S*$/.test(x.at || '')) gainErr.push(`${p.slug} gains[${i}]: \`at\` must be the live page that shows it ("/…")`);
    for (const l of LANGS) say(`${p.slug} gains[${i}].${l}`, x[l]);
  });
}
const sheets = new Set(SCENE_PROJECTS.map((p) => p.slug));
for (const slug of Object.keys(VOICE_CLIENTS)) {
  const card = html.split(/<article\b/).slice(1).find((a) => a.startsWith(` id="w-${slug}"`)) || '';
  // a link: the sentence in its own span, then a visually hidden suffix
  // (work.gainMore) so its name says it opens the sheet; plain text: <p>
  const a = /<a class="gain" href="([^"]*)"><span data-i18n="([^"]+)">[^<]*<\/span><span class="sr-only" data-i18n="work\.gainMore">[^<]*<\/span><\/a>/.exec(card);
  const p = /<p class="gain" data-i18n="([^"]+)">/.exec(card);
  if (!a && !p) { gainErr.push(`${slug}: work card has no benefit line (<a class="gain"><span data-i18n>…</span><span class="sr-only" data-i18n="work.gainMore">…</span></a>, or <p class="gain" data-i18n>)`); continue; }
  const [href, key] = a ? [a[1], a[2]] : [undefined, p[1]];
  const want = sheets.has(slug) ? `scene/#gv-${slug}` : undefined;
  if (href !== want) gainErr.push(`${slug}: benefit line ${want ? 'must link to ' + want : 'has no sheet, so it links nowhere'} (found ${href || 'no link'})`);
  for (const l of LANGS) say(`${key} (${l})`, DICT[l]?.[key]);
}
for (const l of LANGS) say(`work.gainMore (${l})`, DICT[l]?.['work.gainMore']);
gainErr.length ? bad('client benefits: ' + gainErr.join('; '))
  : ok(`client benefits: ${SCENE_PROJECTS.length} sheets with context and 3-5 benefits each, ${Object.keys(VOICE_CLIENTS).length} work cards with a line, no figures or results`);

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
  // a page with language versions (hreflang alternates) must name itself from
  // the head script, whatever else changes: a static canonical alone would
  // name the French page on every ?lang= view
  const multi = /<link\b[^>]*\bhreflang\s*=/i.test(src);
  if (multi && !scripted) canonErr.push(`${f} has language versions but its head script sets no canonical`);
  if (multi && links.length) canonErr.push(`${f} has language versions and a static canonical (remove the <link>)`);
  else if (scripted && links.length) canonErr.push(`${f} has a static canonical and sets one in its head script (remove the <link>)`);
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
// and in the French baked into index.html. Whether it is on is decided the way
// the browser decides it: the inline script that sets the two values is run
// in a sandbox with a bare window, and either value being truthy counts as on
// (app.js needs both; the guard is stricter). A script that cannot run counts
// as on too: fail safe.
let supaOn = false;
{
  const cfg = [...html.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<script\b(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => m[1]).filter((t) => /NUMIDEA_SUPABASE_(URL|KEY)/.test(t));
  for (const code of cfg) {
    const win = {};
    try { runInNewContext(code, { window: win }, { timeout: 200 }); }
    catch (e) { supaOn = true; continue; }
    if (win.NUMIDEA_SUPABASE_URL || win.NUMIDEA_SUPABASE_KEY) supaOn = true;
  }
}
if (supaOn) {
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
// The estimator's arithmetic (ESTIMATE in app.js, a pure block) is tested on
// every size, option set and pace: a quote is a real range, a Vitrine is never
// quoted above the Studio tier for the same pages, and no tier charges for an
// option it includes.
{
  const at = app.indexOf('  var ESTIMATE = (function () {');
  const end = at < 0 ? -1 : app.indexOf('\n  })();', at);
  if (at < 0 || end < 0) priceErr.push('could not find the ESTIMATE block in app.js');
  else {
    const E = new Function(`${app.slice(at, end + 7)}\nreturn ESTIMATE;`)();
    const keys = Object.keys(E.PRICE_OPTS), subsets = [];
    for (let m = 0; m < 1 << keys.length; m++) subsets.push(keys.filter((_, b) => m >> b & 1));
    const bad = [];
    for (const [key, M] of Object.entries(E.PRICE_MODEL)) {
      for (let n = M.min; n <= M.max; n += M.step) for (const o of subsets) for (const rush of [false, true]) {
        const q = E.quote(key, n, o, rush);
        if (!(q.lo > 0 && q.lo <= q.hi && q.wLo >= 1 && q.wLo <= q.wHi)) bad.push(`${key} n=${n} [${o}] ${rush ? 'rush' : ''}: ${q.lo}-${q.hi}, ${q.wLo}-${q.wHi} wk`);
        // never above what the tier itself adds up to
        const t = E.tally(key, n, o), k = rush ? E.RUSH_PRICE : 1;
        if (q.lo > E.roundTo(t.lo * k) || q.hi > E.roundTo(t.hi * k)) bad.push(`${key} n=${n} [${o}] ${rush ? 'rush' : ''} above its own sum`);
        if (key === 'vitrine') {
          const s = E.quote('surmesure', n, o, rush);
          if (q.lo > s.lo || q.hi > s.hi || q.wHi > s.wHi) bad.push(`vitrine n=${n} [${o}] ${rush ? 'rush' : ''} above Studio (${q.lo}-${q.hi} vs ${s.lo}-${s.hi})`);
        }
        const incl = M.incl || [];
        if (incl.length) {
          const without = E.quote(key, n, o.filter((x) => !incl.includes(x)), rush);
          if (without.lo !== q.lo || without.hi !== q.hi) bad.push(`${key} charges for an included option [${o}]`);
        }
      }
    }
    if (bad.length) priceErr.push(`estimator: ${bad.length} bad quotes, e.g. ` + bad.slice(0, 3).join('; '));
  }
}
priceErr.length ? bad('prices drift from PRICE_MODEL: ' + priceErr.join('; ')) : ok('tier and maintenance figures equal PRICE_MODEL/RETAINER; no typed €/$ amounts; estimator sound on every size, option set and pace');
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
// breakable: any white space but the no-break ones (U+00A0, U+202F, U+2007);
// a thin space U+2009 looks like U+202F but breaks
const FR_SPACE = /[^\S\u00a0\u202f\u2007](?=[?!;:»])|«[^\S\u00a0\u202f\u2007]|\d[^\S\u00a0\u202f\u2007](?=(?:%|h)(?!\p{L}))/gu;
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

/* 15 — the knowledge base stays public */
// knowledge-base/ sits in the public repository (never deployed). The full
// vault — competitor research, the campaign kit, the owner's decision log —
// is kept privately; nothing from it, and no machine path, may land here.
const kbErr = [];
const KB_PRIVATE = [/\/tmp\//, /scratchpad/i, /claude\.ai\/(?:code\/)?artifact/, /copy-gulf-(?:ar|en)|outreach-fr|prospects-template/,
  /^type:\s*(?:competitor|market|decision-log|self-audit|design-direction|review|timeline)\s*$/m];
const KB_EMAILS = new Set(['hamissemohamedyasser@gmail.com', 'hello@numidealabs.com']);   // the contact; the archive's old placeholder
const kbWalk = (d) => readdirSync(join(ROOT, d)).flatMap((e) => (statSync(join(ROOT, d, e)).isDirectory() ? kbWalk(d + '/' + e) : [d + '/' + e]));
if (existsSync(join(ROOT, 'knowledge-base'))) {
  for (const f of kbWalk('knowledge-base').filter((p) => /\.(md|json|canvas|html|txt)$/.test(p))) {
    const src = read(f);
    for (const re of KB_PRIVATE) if (re.test(src)) kbErr.push(`${f} (${re.source.slice(0, 24)})`);
    for (const m of src.matchAll(/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[a-z]{2,}\b/g)) if (!KB_EMAILS.has(m[0].toLowerCase())) kbErr.push(`${f} (e-mail ${m[0]})`);
  }
}
kbErr.length ? bad('knowledge-base/ holds private material: ' + [...new Set(kbErr)].slice(0, 8).join(', ')) : ok('knowledge-base/ holds nothing from the private vault');

/* 16 — content security policy */
// Every page carries the policy scripts/lib/csp.mjs computes for it: one meta
// right after the viewport meta, script-src naming the sha256 of each inline
// script. npm run build writes it (build-csp.mjs last; build-scene and
// build-legal on their own output). A script edited without the build keeps
// its old hash, and the browser refuses it: the page would ship without its
// boot script. So the committed page must equal withCsp(page).
// What withCsp decides is then checked a second way, with this block's own
// scan of the markup: every inline script that is not a known data block has
// its hash in script-src (and script-src names no script that is gone), no
// tag carries an inline handler (onclick=…) or a javascript: URL, which no
// hash can allow, nothing the policy governs comes before the meta, and the
// policy keeps its floor (script-src only 'self' and hashes, 'unsafe-eval' on
// the WorkspaceHQ embeds alone; object-src 'none'; base-uri 'self'). The
// fixtures of scripts/csp-test.mjs run too. Last, the mirrors' headers: the
// policy parts a meta cannot carry (frame-ancestors) and HSTS, the same on
// Netlify and Vercel.
{
  const { withCsp, cspKind, cspOf } = await import('./lib/csp.mjs');
  const { fixtureErrors } = await import('./csp-test.mjs');
  const { createHash } = await import('node:crypto');
  const cspErr = [];
  // the parser turns CR LF and CR into LF before the browser hashes
  const sha = (t) => `'sha256-${createHash('sha256').update(t.replace(/\r\n?/g, '\n'), 'utf8').digest('base64')}'`;
  const directives = (p) => Object.fromEntries(p.split(';').map((d) => d.trim().split(/\s+/)).filter((d) => d[0]).map(([n, ...v]) => [n.toLowerCase(), v]));
  // script types the browser never runs; any other inline script must be hashed
  const DATA = new Set(['application/ld+json', 'application/json', 'text/x-dc']);
  // the markup as the tokenizer reads it, left to right: a comment, a script
  // (its attributes and text), a raw-text element (its name and attributes;
  // its content is text, not tags), or any other start tag
  const Q = `(?:"[^"]*"|'[^']*'|[^'">])*`;               // a tag's attributes, quoted ">" included
  const TOKEN = new RegExp(`<!--[\\s\\S]*?(?:-->|$)|<script\\b(${Q})>([\\s\\S]*?)</script[\\s/>]`
    + `|<(style|textarea|title|noscript|xmp|iframe|noembed|noframes)\\b(${Q})>[\\s\\S]*?</\\3[\\s/>]|<([a-zA-Z][^\\s/>]*)(${Q})>`, 'gi');
  const attrsOf = (s) => Object.fromEntries([...s.matchAll(/([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)]
    .map((m) => [m[1].toLowerCase(), m[2] ?? m[3] ?? m[4] ?? '']).reverse());   // the first of a repeated attribute wins
  const URL_ATTRS = ['href', 'src', 'action', 'formaction', 'data', 'xlink:href', 'poster'];
  // a URL attribute as the URL parser sees it: character references decoded,
  // tabs and newlines dropped, leading control characters and spaces trimmed
  const urlOf = (v) => v.replace(/&#x([0-9a-f]+);?/gi, (_, h) => String.fromCodePoint(parseInt(h, 16) || 0xfffd))
    .replace(/&#(\d+);?/g, (_, n) => String.fromCodePoint(Number(n) || 0xfffd)).replace(/&colon;/gi, ':').replace(/&(?:tab|newline);/gi, '')
    .replace(/[\t\n\r]/g, '').replace(/^[\x00-\x20]+/, '');
  let nScripts = 0, nPages = 0;
  for (const f of [...PAGES, ...EXTRA_PAGES]) {
    const src = read(f), kind = cspKind(f);
    try { if (withCsp(src, kind) !== src) cspErr.push(`${f}: its CSP meta is stale or missing (run: npm run build)`); }
    catch (e) { cspErr.push(`${f}: ${e.message}`); }
    const policy = cspOf(src);
    if (policy == null) { cspErr.push(`${f}: wants exactly one Content-Security-Policy meta`); continue; }
    nPages++;
    const dir = directives(policy), scriptSrc = dir['script-src'] || [];
    const need = new Set(), handlers = [];
    let metaAt = -1, governedAt = -1, metas = 0;
    for (const t of src.matchAll(TOKEN)) {
      const [whole, sAttrs, sText, raw, rAttrs, tag, tAttrs] = t;
      if (whole.startsWith('<!--')) continue;
      const name = (sAttrs !== undefined ? 'script' : raw || tag).toLowerCase();
      const a = attrsOf(sAttrs ?? rAttrs ?? tAttrs);
      if (governedAt < 0 && ['script', 'style', 'link', 'base'].includes(name)) governedAt = t.index;
      if (name === 'meta' && (a['http-equiv'] || '').toLowerCase() === 'content-security-policy') { metas++; if (metaAt < 0) metaAt = t.index; }
      for (const [k, v] of Object.entries(a)) {
        // the embeds are Claude Design templates: onClick="{{ goHome }}" is a
        // binding the runtime (support.js) renders as a React listener, not code
        if (/^on/.test(k) && !(kind === 'embed' && /^\s*\{\{[^{}]*\}\}\s*$/.test(v))) handlers.push(`<${name} ${k}>`);
        if (URL_ATTRS.includes(k) && /^javascript:/i.test(urlOf(v))) cspErr.push(`${f}: <${name} ${k}="javascript:…"> runs inline code, which script-src refuses`);
      }
      if (sAttrs === undefined) continue;                  // not a script, or one left unclosed
      const type = (a.type ?? '').trim().toLowerCase();
      if ('src' in a || sText === '' || DATA.has(type)) continue;
      nScripts++;
      const h = sha(sText);
      need.add(h);
      if (!scriptSrc.includes(h)) cspErr.push(`${f}: inline <script${a.type != null ? ` type="${a.type}"` : ''}> "${sText.trim().replace(/\s+/g, ' ').slice(0, 40)}…" is not in script-src (npm run build hashes it; a data block the browser never runs needs its type in check.mjs 16)`);
    }
    if (handlers.length) cspErr.push(`${f}: ${handlers.length} inline handler${handlers.length === 1 ? '' : 's'} (${[...new Set(handlers)].slice(0, 4).join(', ')}), which script-src refuses: attach ${handlers.length === 1 ? 'it' : 'them'} from a script file`);
    if (metas !== 1) cspErr.push(`${f}: ${metas} Content-Security-Policy metas (want 1)`);
    if (governedAt >= 0 && metaAt > governedAt) cspErr.push(`${f}: a script, style, link or base comes before the CSP meta, which then does not govern it`);
    for (const h of scriptSrc.filter((s) => /^'sha256-/.test(s))) if (!need.has(h)) cspErr.push(`${f}: script-src names ${h}, which is no script on the page (npm run build)`);
    if (!(dir['default-src'] || []).length) cspErr.push(`${f}: the policy has no default-src`);
    if (!scriptSrc.length) cspErr.push(`${f}: the policy has no script-src`);
    for (const s of scriptSrc) {
      if (!(s === "'self'" || /^'sha256-[A-Za-z0-9+/]{43}='$/.test(s) || (s === "'unsafe-eval'" && kind === 'embed')))
        cspErr.push(`${f}: script-src allows ${s} (only 'self' and hashes${kind === 'embed' ? ", plus 'unsafe-eval' on an embed" : ''})`);
    }
    if ((dir['object-src'] || []).join(' ') !== "'none'") cspErr.push(`${f}: object-src is "${(dir['object-src'] || []).join(' ')}" (want 'none')`);
    if ((dir['base-uri'] || []).join(' ') !== "'self'") cspErr.push(`${f}: base-uri is "${(dir['base-uri'] || []).join(' ')}" (want 'self')`);
  }
  for (const e of fixtureErrors()) cspErr.push(`withCsp fixtures (node scripts/csp-test.mjs): ${e}`);
  // The mirrors send the headers on every path. A second policy in a header is
  // enforced on top of the meta, so it may only add what a meta cannot carry
  // (frame-ancestors) or repeat the meta's floor: a fetch directive there
  // would block what the meta allows. HSTS: a year at least.
  const netlify = {};
  for (const b of read('netlify.toml').split(/^[ \t]*\[\[headers\]\][ \t]*(?:#.*)?$/m).slice(1)) {
    if ((/^\s*for\s*=\s*"([^"]*)"/m.exec(b) || [])[1] !== '/*') continue;
    const values = (b.split(/^[ \t]*\[headers\.values\][ \t]*(?:#.*)?$/m)[1] || '').split(/^[ \t]*\[/m)[0];
    for (const m of values.matchAll(/^[ \t]*([A-Za-z0-9-]+)[ \t]*=[ \t]*"((?:[^"\\]|\\.)*)"[ \t]*(?:#.*)?$/gm)) netlify[m[1]] = m[2];
  }
  let vercel = {};
  try {
    const all = (JSON.parse(read('vercel.json')).headers || []).find((h) => h.source === '/(.*)');
    vercel = Object.fromEntries(((all && all.headers) || []).map((h) => [h.key, h.value]));
  } catch (e) { cspErr.push(`vercel.json does not parse: ${e.message}`); }
  const differ = [...new Set([...Object.keys(netlify), ...Object.keys(vercel)])].filter((k) => netlify[k] !== vercel[k]).sort();
  if (differ.length) cspErr.push('netlify.toml ("/*") and vercel.json ("/(.*)") send different headers: '
    + differ.map((k) => `${k} ${JSON.stringify(netlify[k] ?? null)} vs ${JSON.stringify(vercel[k] ?? null)}`).join(', '));
  for (const [host, h] of [['netlify.toml', netlify], ['vercel.json', vercel]]) {
    for (const k of ['X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy', 'Permissions-Policy', 'Content-Security-Policy', 'Strict-Transport-Security'])
      if (!h[k]) cspErr.push(`${host}: no ${k} header on every path`);
    if (h['Content-Security-Policy']) {
      const d = directives(h['Content-Security-Policy']);
      const extra = Object.keys(d).filter((n) => !['frame-ancestors', 'base-uri', 'object-src', 'upgrade-insecure-requests', 'report-uri', 'report-to'].includes(n));
      if (extra.length) cspErr.push(`${host}: the header policy holds ${extra.join(', ')}, enforced on top of each page's meta (keep fetch directives in the meta)`);
      for (const [n, v] of [['frame-ancestors', "'self'"], ['base-uri', "'self'"], ['object-src', "'none'"]])
        if ((d[n] || []).join(' ') !== v) cspErr.push(`${host}: the header policy's ${n} is "${(d[n] || []).join(' ')}" (want ${v})`);
    }
    const age = Number((/\bmax-age=(\d+)/.exec(h['Strict-Transport-Security'] || '') || [])[1] || 0);
    if (h['Strict-Transport-Security'] && age < 31536000) cspErr.push(`${host}: Strict-Transport-Security max-age=${age} (want at least 31536000)`);
  }
  cspErr.length ? bad('content security policy: ' + cspErr.join('; '))
    : ok(`content security policy: ${nPages} pages equal withCsp, ${nScripts} inline scripts all hashed, no inline handlers, object-src 'none', base-uri 'self'; mirrors send frame-ancestors and HSTS`);
}

process.exit(fail);
