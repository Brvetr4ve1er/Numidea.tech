#!/usr/bin/env node
/**
 * The staged site is the site — `node scripts/stage-check.mjs`. Stages it
 * as the Pages deploy does (scripts/stage-site.mjs --pages), then proves
 * that what the stripping of comments (scripts/lib/strip-comments.mjs) left
 * in _site/ is what the repository's files say:
 *   - every page is byte for byte the repository's, except 404.html, which
 *     gets its JavaScript-off links from the site root (lib/stage-404.mjs);
 *   - every stylesheet, parsed by the browser from both copies, holds the
 *     same rules: the same count at every depth and the same cssText rule
 *     by rule (comments are not serialised, so a stripped sheet that parses
 *     the same way serialises the same way);
 *   - every script compiles from both copies, in the browser
 *     (new Function(src)) and in Node (--check); a script that compiles from
 *     the repository and not from _site/ is the stripper's fault.
 * Run by npm run verify and the Pages workflow's gates job; needs the gates'
 * browser (scripts/lib/serve.mjs: CHROMIUM_PATH, a local build, or
 * Playwright's own).
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './site.mjs';
import { serve, launch } from './lib/serve.mjs';

const SITE = join(ROOT, '_site');
const errors = [];
const ok = (m) => console.log('✓ ' + m);
const bad = (m) => { errors.push(m); console.log('✗ ' + m); };
const fmt = (n) => (n / 1000).toFixed(1) + ' kB';

const stage = spawnSync(process.execPath, ['scripts/stage-site.mjs', '--pages'], { cwd: ROOT, stdio: 'inherit' });
if (stage.status !== 0 || !existsSync(SITE)) { console.log('✗ stage-site.mjs failed'); process.exit(1); }

const walk = (p) => (statSync(join(SITE, p)).isDirectory() ? readdirSync(join(SITE, p)).sort().flatMap((e) => walk(p ? p + '/' + e : e)) : [p]);
const files = walk('');
const css = files.filter((f) => /\.css$/i.test(f)), js = files.filter((f) => /\.m?js$/i.test(f)), html = files.filter((f) => /\.html$/i.test(f));

// pages: untouched, 404.html aside
const touched = html.filter((f) => f !== '404.html' && !readFileSync(join(SITE, f)).equals(readFileSync(join(ROOT, f))));
touched.length ? bad('pages changed by staging: ' + touched.join(', ')) : ok(`${html.length} pages staged unchanged (404.html links rewritten from the site root, as intended)`);

// scripts: Node parses both copies
for (const f of js) {
  const [a, b] = [join(ROOT, f), join(SITE, f)].map((p) => spawnSync(process.execPath, ['--check', p], { encoding: 'utf8' }));
  if (a.status === 0 && b.status !== 0) bad(`${f}: the staged copy no longer parses (node --check): ${b.stderr.split('\n').slice(0, 3).join(' | ')}`);
}

// the browser: every stylesheet rule by rule, every script compiled
const srv = await serve(ROOT, { compress: true });
const browser = await launch();
const page = await browser.newPage();
// the page's own errors, not the browser asking a text file for a favicon
page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) console.log('  console: ' + m.text()); });
await page.goto(srv.base + '/robots.txt');
let before = 0, after = 0, rules = 0;
for (const f of css) {
  const r = await page.evaluate(async (f) => {
    const load = async (u) => { const t = await (await fetch(u)).text(); const s = new CSSStyleSheet(); s.replaceSync(t); return [t, s]; };
    const [ta, a] = await load('/' + f), [tb, b] = await load('/_site/' + f);
    const flat = (s) => { const out = []; const rec = (list) => { for (const r of list) { out.push(r.cssText); if (r.cssRules) rec(r.cssRules); } }; rec(s.cssRules); return out; };
    const ra = flat(a), rb = flat(b);
    const diff = ra.findIndex((t, i) => t !== rb[i]);
    return { before: ta.length, after: tb.length, rules: ra.length, staged: rb.length, diff, at: diff < 0 ? '' : (ra[diff] || '').slice(0, 120) + ' ≠ ' + (rb[diff] || '').slice(0, 120) };
  }, f);
  before += r.before; after += r.after; rules += r.rules;
  if (r.rules !== r.staged) bad(`${f}: ${r.rules} rules in the repository, ${r.staged} staged`);
  else if (r.diff >= 0) bad(`${f}: rule ${r.diff} differs once staged: ${r.at}`);
}
errors.length === 0 && ok(`${css.length} stylesheets parse to the same ${rules} rules staged as in the repository, rule by rule (${fmt(before)} → ${fmt(after)})`);
let jsBefore = 0, jsAfter = 0, compiled = 0, skipped = [];
for (const f of js) {
  const r = await page.evaluate(async (f) => {
    const [a, b] = await Promise.all(['/' + f, '/_site/' + f].map(async (u) => (await fetch(u)).text()));
    const tryIt = (t) => { try { new Function(t); return ''; } catch (e) { return String(e.message || e); } };
    return { before: a.length, after: b.length, ea: tryIt(a), eb: tryIt(b) };
  }, f);
  jsBefore += r.before; jsAfter += r.after;
  if (r.ea) { skipped.push(f); continue; }           // a module, or not a classic script: node --check covered it
  if (r.eb) bad(`${f}: compiles from the repository, not from _site/: ${r.eb}`);
  else compiled++;
}
if (!errors.some((e) => /_site\//.test(e))) ok(`${compiled} scripts compile from both copies in the browser${skipped.length ? ` (${skipped.join(', ')}: not a classic script, parsed by node --check only)` : ''} (${fmt(jsBefore)} → ${fmt(jsAfter)})`);
await browser.close(); srv.close();

if (errors.length) { console.log(`\n✗ stage check: ${errors.length} problem(s)`); process.exit(1); }
console.log(`\n✓ stage check passed: ${css.length} stylesheets, ${js.length} scripts, ${html.length} pages`);
