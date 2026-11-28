#!/usr/bin/env node
/**
 * The home's first-screen stylesheet: assets/home-first.css (`npm run first`
 * after any change to styles.css or to the markup above <main>; `--check`
 * exits 1 when the file is stale, and `npm run verify` runs it). Not part of
 * `npm run build`: it needs a browser, which CI's build job does not install.
 *
 * Why: assets/styles.css (about 320 KB, 85 KB gzipped) blocked the home's
 * first paint, though most of it styles <main>, which starts below the
 * menu. The home now links home-first.css in the head instead. It holds
 * every rule of styles.css that can touch the part of the page above <main>:
 * the navbar, the drawer and the menu. styles.css itself loads in the body,
 * right before <main>. Chrome paints what comes before a body stylesheet
 * and holds back only what follows it, so the first screen paints without
 * waiting for the full sheet, and <main> (with its lazy captures) never
 * shows unstyled. The empty script after the link makes Firefox hold back
 * what follows it too. menu.css is linked again after styles.css, so the
 * cascade order stays fonts, themes, styles, menu.
 *
 * Nothing is hand-copied: a rule goes in when one of its selectors, with
 * user-action pseudo-classes and pseudo-elements stripped, matches an
 * element above <main> on the French, English or Arabic home, in either
 * theme, at phone and desktop widths. A selector the browser cannot test is
 * kept. @font-face, @property and @view-transition always go in, @keyframes
 * when a kept rule names it; @media, @supports, @container and
 * @starting-style blocks go in with the rules they keep. The rules keep
 * their source text and order, so for the elements above <main> the full
 * sheet changes nothing when it lands (scripts/first-check.mjs compares
 * their computed styles with and without it).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from './site.mjs';
import { serve, launch } from './lib/serve.mjs';

const SRC = 'assets/styles.css';
const OUT = 'assets/home-first.css';
const PAGES = ['', 'en/', 'ar/'];
const THEMES = ['arcanum', 'daylight'];
const WIDTHS = [[390, 844], [1440, 900]];

/* ---- a small CSS splitter: comments out, blocks by brace depth, strings respected ---- */
function stripComments(css) {
  let out = '', i = 0, q = null;
  while (i < css.length) {
    const c = css[i];
    if (q) { out += c; if (c === '\\') { out += css[i + 1] || ''; i += 2; continue; } if (c === q) q = null; i++; continue; }
    if (c === '"' || c === "'") { q = c; out += c; i++; continue; }
    if (c === '/' && css[i + 1] === '*') { const e = css.indexOf('*/', i + 2); i = e < 0 ? css.length : e + 2; continue; }
    out += c; i++;
  }
  return out;
}
/** [{ prelude, body }] for blocks, [{ stmt }] for `@x ...;` statements */
function split(css) {
  const items = [];
  let i = 0;
  while (i < css.length) {
    while (i < css.length && /\s/.test(css[i])) i++;
    if (i >= css.length) break;
    let j = i, q = null, depth = 0, open = -1;
    for (; j < css.length; j++) {
      const c = css[j];
      if (q) { if (c === '\\') { j++; continue; } if (c === q) q = null; continue; }
      if (c === '"' || c === "'") { q = c; continue; }
      if (c === ';' && depth === 0 && open < 0) break;
      if (c === '{') { if (depth === 0) open = j; depth++; }
      else if (c === '}') { depth--; if (depth === 0) break; }
    }
    if (open < 0) { items.push({ stmt: css.slice(i, j + 1).trim() }); i = j + 1; continue; }
    items.push({ prelude: css.slice(i, open).trim(), body: css.slice(open + 1, j) });
    i = j + 1;
  }
  return items;
}
const GROUP = /^@(media|supports|container|starting-style|layer)\b/i;
function tree(css) {
  return split(css).map((it) => (it.stmt != null ? it
    : GROUP.test(it.prelude) ? { prelude: it.prelude, kids: tree(it.body) }
    : it.prelude.startsWith('@') ? { prelude: it.prelude, body: it.body.trim(), at: true }
    : { prelude: it.prelude, body: it.body.trim(), sel: it.prelude }));
}
/** top-level comma split of a selector list */
function parts(sel) {
  const out = []; let d = 0, s = '';
  for (const c of sel) { if (c === '(' || c === '[') d++; else if (c === ')' || c === ']') d--; if (c === ',' && d === 0) { out.push(s.trim()); s = ''; } else s += c; }
  if (s.trim()) out.push(s.trim());
  return out;
}
/* user-action and state pseudo-classes, and every pseudo-element, go: the
   element is what has to exist above <main> */
const DYNAMIC = /::?[a-z-]+(\((?:[^()]|\([^()]*\))*\))?/gi;
const KEEP_PSEUDO = /^:(not|is|where|has|nth-child|nth-last-child|nth-of-type|nth-last-of-type|first-child|last-child|only-child|first-of-type|last-of-type|only-of-type|root|lang|dir|empty|defined|scope)\b/i;
function testable(part) {
  return part.replace(DYNAMIC, (m) => (m.startsWith('::') || !KEEP_PSEUDO.test(m) ? '' : m)).replace(/\s+([>+~])?\s*$/, '').trim() || '*';
}

function collectSelectors(nodes, acc = new Set()) {
  for (const n of nodes) {
    if (n.kids) collectSelectors(n.kids, acc);
    else if (n.sel) for (const p of parts(n.sel)) acc.add(testable(p));
  }
  return acc;
}

async function matching(selectors) {
  const site = await serve(ROOT, { compress: false, fallback404: true });
  const browser = await launch();
  const hit = new Set();
  try {
    for (const [width, height] of WIDTHS) for (const theme of THEMES) for (const p of PAGES) {
      const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
      await ctx.addInitScript((t) => { try { localStorage.setItem('numidea-theme', t); sessionStorage.setItem('nl-intro-seen', '1'); } catch (e) {} }, theme);
      const page = await ctx.newPage();
      await page.goto(site.base + '/' + p, { waitUntil: 'load' });
      // app.js gives the header button its classes when the browser is idle: wait for them
      await page.waitForFunction(() => { const c = document.querySelector('.nav-cta'); return !c || c.classList.contains('btn'); }, null, { timeout: 5000 }).catch(() => {});
      const found = await page.evaluate((list) => {
        const main = document.querySelector('main');
        const above = [...document.querySelectorAll('*')].filter((e) => !e.closest('head') && e !== main && !(main && main.contains(e))
          && (!main || e.contains(main) || (main.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_PRECEDING)));
        const out = [];
        for (const s of list) {
          try { if (above.some((e) => e.matches(s))) out.push(s); } catch (err) { out.push(s); }   // untestable: kept
        }
        return out;
      }, [...selectors].filter((s) => !hit.has(s)));
      found.forEach((s) => hit.add(s));
      await ctx.close();
    }
  } finally { await browser.close(); site.close(); }
  return hit;
}

function emit(nodes, hit, names) {
  const out = [];
  for (const n of nodes) {
    if (n.stmt != null) { if (/^@(charset|import|namespace|layer)\b/i.test(n.stmt)) out.push(n.stmt); continue; }
    if (n.kids) { const inner = emit(n.kids, hit, names); if (inner.length) out.push(`${n.prelude}{${inner.join('')}}`); continue; }
    if (n.at) {
      const m = n.prelude.match(/^@(?:-webkit-)?keyframes\s+([^\s{]+)/i);
      if (m ? names.has(m[1]) : /^@(font-face|property|view-transition|counter-style|font-feature-values)\b/i.test(n.prelude)) out.push(`${n.prelude}{${n.body}}`);
      continue;
    }
    if (parts(n.sel).some((p) => hit.has(testable(p)))) out.push(`${n.prelude}{${n.body}}`);
  }
  return out;
}

export async function buildFirst() {
  const css = stripComments(readFileSync(join(ROOT, SRC), 'utf8'));
  const nodes = tree(css);
  const hit = await matching(collectSelectors(nodes));
  const kept = emit(nodes, hit, new Set()).join('');
  // keyframes named by a kept rule (animation / animation-name)
  const names = new Set([...kept.matchAll(/animation(?:-name)?\s*:([^;}]+)/gi)].flatMap((m) => m[1].split(/[\s,]+/)));
  const body = emit(nodes, hit, names).join('\n').replace(/[ \t]*\n[ \t]*/g, '\n').replace(/\n{2,}/g, '\n');
  return `/* GENERATED by scripts/build-first.mjs from ${SRC}: do not edit. The rules of\n   styles.css that can touch the home above <main>; the home links this in\n   its head and loads styles.css itself right before <main>. */\n${body}\n`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const want = await buildFirst();
  const file = join(ROOT, OUT);
  let have = '';
  try { have = readFileSync(file, 'utf8'); } catch (e) { /* first run */ }
  if (process.argv.includes('--check')) {
    if (have !== want) { console.log(`✗ ${OUT} is stale: run npm run first`); process.exit(1); }
    console.log(`✓ ${OUT} matches ${SRC}`);
  } else {
    writeFileSync(file, want);
    console.log(`✓ ${OUT}: ${want.length} bytes from ${SRC}'s ${readFileSync(join(ROOT, SRC)).length}`);
  }
}
