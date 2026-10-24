#!/usr/bin/env node
/**
 * External links — `npm run links`. It needs the network, so it is not part
 * of `npm run verify`; CI runs it nightly and the live monitor every 6 hours.
 * Exits non-zero when a link is dead.
 *
 * What it collects, every external https link the published site carries:
 *  - every published text file (scripts/site.mjs DEPLOY): the pages with
 *    their inline dictionaries and JSON-LD, app.js's I18N/EXTRA (where the
 *    English and Arabic copy lives, so links that appear only after a
 *    language switch are read too), the other scripts, the stylesheets,
 *    sitemap.xml and robots.txt; and the link annotations of the published
 *    PDFs. HTML comments are left out, as check.mjs does. Not links: JSON-LD's
 *    "@context" (a vocabulary name) and the files in SKIP, each with its
 *    reason. A URL a script completes at runtime ('https://wa.me/' + the
 *    number) is checked as completed (PREFIXES); a prefix not listed there
 *    fails, so a new one gets classified.
 *  - the client pages the project sheets name (scripts/scene-data.mjs): each
 *    capture's `path` and each benefit's `at` is a page of the client's live
 *    site that the sheet says is there.
 *
 * How it checks: each distinct URL (fragment dropped) gets a GET with a
 * normal browser's user agent and headers, a 20 s timeout and two retries
 * (scripts/lib/http.mjs), at most two at a time per host. A link passes on a
 * 2xx after redirects; a 4xx, a 5xx, a DNS failure, any other network error
 * or a timeout fails it. Every link counts: the live site, the client sites,
 * the owner's accounts and repositories (the workspace-HQ repo), the sources
 * the pricing table cites.
 *
 * The one exception is BLOCKS: URLs on hosts that answer this script the same
 * way whatever the page, so the answer says nothing about the link (bot
 * walls, and one certificate chain only browsers can complete). They are
 * still requested, once, and listed with the reason; a 2xx there passes, and
 * anything else is only warned. Each entry was seen; a pattern that matches a
 * live-site or client URL stops the run.
 *
 * Deploy lag: a live-site link that answers 404 while this checkout publishes
 * the file and carries another ?v= stamp than the live site is "not deployed
 * yet": warned, not failed (a branch ahead of the deploy). With the same
 * stamp it fails. A link that answers 2xx only by redirecting to its site's
 * home page is warned too: that is how many sites answer for a removed page.
 *
 *   node scripts/links.mjs --list       the links and where each comes from; no requests
 *   LINKS_ONLY=<regex>                  check only the URLs it matches
 *   LINKS_SKIP=<regex>                  leave out the URLs it matches, and say so: for a
 *                                       network that answers for a host itself (the agent
 *                                       sandbox this repository is worked on answers
 *                                       github.com with its own 403; `git ls-remote`
 *                                       still reaches the repository there)
 */
import { readFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { ROOT, BASE } from './site.mjs';
import { deployFiles } from './lib/deploy-files.mjs';
import { get, useEnvProxy } from './lib/http.mjs';
import { PROJECTS } from './scene-data.mjs';

const LIST = process.argv.includes('--list');
if (!LIST) useEnvProxy();

const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const html = read('index.html');

// Published files whose URLs nobody is shown or sent to
const SKIP = [
  [/(^|\/)vendor\//, 'third-party library code (React names its error-decoder page in its error messages)'],
  [/(^|\/)OFL\.txt$/, 'font licence texts (the copyright line names the font project)'],
];
// URLs that scripts build from a prefix, and what they complete it with
const WA = ((/window\.NUMIDEA_WA\s*=\s*'([^']*)'/.exec(html) || [])[1] || '').replace(/\D/g, '');
const PREFIXES = {
  // app.js: 'https://wa.me/' + WA + '?text=…', WA = window.NUMIDEA_WA from
  // index.html; with no number set, app.js removes the href instead
  'https://wa.me/': () => (WA ? 'https://wa.me/' + WA : null),
};
// Seen 2026-10-24 from a datacenter network with this script's browser user
// agent; a headless Chromium got the same answers. "host/path-prefix", and
// "*." for any subdomain. DeviantArt, YouTube and x.com answer (404 for a
// page that does not exist), so they are checked like any other host.
const BLOCKS = {
  'www.linkedin.com/': 'answers 999 (its bot wall) or 429 to anyone not signed in, whatever the profile',
  'www.instagram.com/': 'after a request or two, redirects every page to its login with a 429, existing or not',
  'www.behance.net/gallery/': 'gallery pages answer 403 with an empty noindex page, a gallery that does not exist too (profile pages answer 200 or 404 and stay checked)',
  'www.etsy.com/': 'DataDome bot wall: 403 "Please enable JS" (x-datadome: protected)',
  'clutch.co/': 'Cloudflare challenge: 403 "Just a moment…" (cf-mitigated: challenge)',
  '*.tumblr.com/': '403 "Checking your browser…", a JavaScript check in front of every blog',
  'www.bank-of-algeria.dz/': 'serves its certificate without the DigiCert intermediate: browsers complete the chain, Node and curl refuse it ("unable to verify the first certificate")',
};
// hosts that answer 200 whatever the name, so a pass shows only that the host is up
const SOFT = {
  't.me': 'answers 200 for any name',
  'www.pinterest.com': 'answers 200 for any name',
};
const TEXT = new Set(['.html', '.js', '.mjs', '.css', '.xml', '.txt', '.json', '.svg', '.webmanifest']);

const blockOf = (u) => {
  const { host, pathname } = new URL(u);
  return Object.keys(BLOCKS).find((k) => {
    const [h, ...p] = k.split('/');
    return (h.startsWith('*.') ? host.endsWith(h.slice(1)) : host === h) && pathname.startsWith('/' + p.join('/'));
  });
};
const clientHosts = new Set([
  ...[...html.matchAll(/<a\b[^>]*\bdata-client="[a-z0-9-]+"[^>]*\bhref="(https:[^"]+)"/g)].map((m) => new URL(m[1]).host),
  ...PROJECTS.filter((p) => /^https:/.test(p.url)).map((p) => new URL(p.url).host),     // our own product's sheet links to a page of this site
]);

/* collect: url → Set of where it appears */
const links = new Map();
const add = (u, where) => {
  let url; try { url = new URL(u); } catch { url = null; }
  url = url ? (url.hash = '', url.href) : u;     // https://host and https://host/ are one link
  if (!links.has(url)) links.set(url, new Set());
  links.get(url).add(where);
};
const notRead = new Map(), unknownPrefix = [];
const published = deployFiles();
for (const f of published) {
  const ext = extname(f).toLowerCase();
  const skip = SKIP.find(([re]) => re.test(f));
  if (skip) { if (TEXT.has(ext)) notRead.set(skip[1], (notRead.get(skip[1]) || 0) + 1); continue; }
  if (ext === '.pdf') {
    for (const m of readFileSync(join(ROOT, f)).toString('latin1').matchAll(/\/URI\s*\((https:[^)]+)\)/g)) add(m[1], f + ' (a link in the PDF)');
    continue;
  }
  if (!TEXT.has(ext)) continue;
  let src = read(f);
  if (/\.(html|xml|svg)$/.test(ext)) src = src.replace(/<!--[\s\S]*?-->/g, '');
  for (const m of src.matchAll(/https:\/\/[^\s"'<>`\\)\]}|]+/g)) {
    const u = m[0].replace(/\$\{.*$/, '').replace(/&amp;/g, '&').replace(/[.,;:!?]+$/, '');
    if (/@context["']?\s*:\s*["']$/.test(src.slice(Math.max(0, m.index - 16), m.index))) continue;
    if (/^['"]\s*\+/.test(src.slice(m.index + m[0].length, m.index + m[0].length + 4))) {
      if (!PREFIXES[u]) { unknownPrefix.push(`${f}: '${u}' + …`); continue; }
      const full = PREFIXES[u]();
      if (full) add(full, `${f} ('${u}' + …, completed)`);
      continue;
    }
    add(u, f);
  }
}
for (const p of PROJECTS.filter((x) => /^https:/.test(x.url))) {
  const site = p.url.replace(/\/$/, '');
  add(p.url, `scripts/scene-data.mjs ${p.slug}.url`);
  for (const pg of p.pages || []) if (pg.path) add(site + pg.path, `scripts/scene-data.mjs ${p.slug} capture ${pg.file}`);
  (p.gains || []).forEach((g, i) => g.at && add(site + g.at, `scripts/scene-data.mjs ${p.slug} gains[${i}].at`));
}

const kind = (u) => (u.startsWith(BASE) ? 'site' : clientHosts.has(new URL(u).host) ? 'client' : blockOf(u) ? 'blocked' : 'other');
const excused = [...links.keys()].filter((u) => (u.startsWith(BASE) || clientHosts.has(new URL(u).host)) && blockOf(u));
if (excused.length) { console.error('✗ BLOCKS may not excuse the live site or a client: ' + excused.join(', ')); process.exit(1); }
const only = process.env.LINKS_ONLY ? new RegExp(process.env.LINKS_ONLY) : null;
const skipRe = process.env.LINKS_SKIP ? new RegExp(process.env.LINKS_SKIP) : null;
const all = [...links.keys()].filter((u) => !only || only.test(u)).sort();
const left = skipRe ? all.filter((u) => skipRe.test(u)) : [];
const todo = all.filter((u) => !left.includes(u));
const count = (k) => todo.filter((u) => kind(u) === k).length;
console.log(`— ${todo.length} external links: site ${count('site')}, client ${count('client')}, other ${count('other')}, on hosts that answer bots the same whatever the page ${count('blocked')}` +
  (only ? ` (LINKS_ONLY ${only})` : '') + ' —');
for (const [why, n] of notRead) console.log(`  not read: ${n} file${n > 1 ? 's' : ''}, ${why}`);
if (left.length) console.log(`  LEFT OUT by LINKS_SKIP ${skipRe} (not checked, not passed): ${left.join(', ')}`);

if (LIST) {
  for (const u of todo) console.log(`${kind(u).padEnd(7)} ${u}\n        ${[...links.get(u)].join(' · ')}`);
  process.exit(unknownPrefix.length ? 1 : 0);
}

/* check: at most PER_HOST requests at a time per host, POOL in all */
const POOL = 8, PER_HOST = 2;
const host = (u) => new URL(u).host;
const results = new Map(), busy = new Map(), queue = [...todo];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await Promise.all(Array.from({ length: POOL }, async () => {
  while (queue.length) {
    const i = queue.findIndex((u) => (busy.get(host(u)) || 0) < PER_HOST);
    if (i < 0) { await sleep(50); continue; }
    const [u] = queue.splice(i, 1);
    busy.set(host(u), (busy.get(host(u)) || 0) + 1);
    results.set(u, await get(u, { retries: kind(u) === 'blocked' ? 0 : 2 }));
    busy.set(host(u), busy.get(host(u)) - 1);
  }
}));

/* deploy lag: asked only when a live-site link answered 404 */
const stampOf = (t) => (/\?v=(\d+)/.exec(t || '') || [])[1];
const localStamp = stampOf(html);
const liveStamp = todo.some((u) => kind(u) === 'site' && results.get(u).status === 404) ? stampOf((await get(BASE, { body: true })).text) : undefined;
const publishedSet = new Set(published);
const localFile = (u) => {
  let rel = decodeURIComponent(new URL(u).pathname.slice(new URL(BASE).pathname.length));
  if (rel === '' || rel.endsWith('/')) rel += 'index.html';
  return publishedSet.has(rel) ? rel : '';
};

const fails = unknownPrefix.map((p) => `✗ a link built from a prefix links.mjs cannot complete (add it to PREFIXES): ${p}`);
const warns = new Map();
const warn = (group, line) => warns.set(group, (warns.get(group) || []).concat(line));
const answer = (r, u) => (r.status ? String(r.status) : r.error) + (r.status && r.url !== u ? ` at ${r.url}` : '');
for (const u of todo) {
  const r = results.get(u), k = kind(u);
  if (r.ok) {
    const soft = SOFT[host(u)] ? `  (${SOFT[host(u)]}: the host is up)` : '';
    console.log(`✓ ${r.status} ${k.padEnd(7)} ${u}${r.url !== u ? '  → ' + r.url : ''}${soft}`);
    // a page that is gone is often redirected to the home page: it answers 200
    const [from, to] = [new URL(u), new URL(r.url)];
    if (from.pathname.length > 1 && to.pathname === '/' && !to.search) warn('redirected to the home page: the page it names may be gone', `${u}  → ${r.url}`);
    continue;
  }
  if (k === 'blocked') { warn(`${blockOf(u)}  ${BLOCKS[blockOf(u)]}`, `${answer(r, u)}  ${u}`); continue; }
  if (k === 'site' && r.status === 404 && localFile(u) && liveStamp && localStamp && liveStamp !== localStamp) {
    warn(`not deployed yet: in this checkout (?v=${localStamp}), not on the live site (?v=${liveStamp})`, `404  ${u}`);
    continue;
  }
  fails.push(`✗ ${answer(r, u)}${r.attempts > 1 ? ` (${r.attempts} attempts)` : ''}  ${k}  ${u}\n      in ${[...links.get(u)].join(' · ')}`);
}
let nw = 0;
if (warns.size) {
  console.log('\n— warned, not failed —');
  for (const [g, lines] of warns) { nw += lines.length; console.log(`⚠ ${g}\n` + lines.map((l) => '    ' + l).join('\n')); }
}
if (fails.length) console.error('\n— dead —\n' + fails.join('\n'));
console.log(fails.length ? `\nFAILURES: ${fails.length} of ${todo.length} links`
  : `\nALL LINKS ANSWER (${todo.length - nw} passed, ${nw} warned${left.length ? `, ${left.length} left out by LINKS_SKIP` : ''})`);
process.exit(fails.length ? 1 : 0);
