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
 *   7. generated pages — scene/index.html equals its generator's output, and every
 *                        page with an inline dictionary resolves its keys in fr/en/ar
 *   6. deploy coverage — the published set (scripts/site.mjs DEPLOY) exists, every
 *                        page folder is classified, and deployed pages link only to
 *                        deployed files (nothing points into knowledge-base/, scripts/…)
 *
 * Exits non-zero on any failure. No dependencies.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, normalize, basename } from 'node:path';
import { ROOT, PAGES, EXTRA_PAGES, DEPLOY, DEPLOY_SKIP, NOT_DEPLOYED, BASE, LANGS } from './site.mjs';
import { SCENE_HTML } from './build-scene.mjs';

const read = (p) => readFileSync(join(ROOT, p), 'utf8');
let fail = 0;
const bad = (msg) => { console.error('✗ ' + msg); fail = 1; };
const ok = (msg) => console.log('✓ ' + msg);

/* 1 + 2 — i18n */
const app = read('assets/app.js');
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
const rootDirs = readdirSync(ROOT).filter((e) => statSync(join(ROOT, e)).isDirectory() && existsSync(join(ROOT, e, 'index.html')));
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
  const rel = u.slice(BASE.length).replace(/\/$/, '');
  return rel !== '' && !DEPLOY.includes(rel.split('/')[0]);
});
const problems = [
  deployMissing.length && 'deploy list names missing paths: ' + deployMissing.join(', '),
  unclassified.length && 'page folders neither deployed nor excluded (add to scripts/site.mjs): ' + unclassified.join(', '),
  leaks.length && 'deployed pages link to files that are not published: ' + leaks.join(', '),
  sitemapLeaks.length && 'sitemap lists unpublished URLs: ' + sitemapLeaks.join(', '),
].filter(Boolean);
problems.length ? problems.forEach(bad) : ok(`deploy set covers every page and link (${DEPLOY.length} entries)`);

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

process.exit(fail);
