#!/usr/bin/env node
/**
 * Theme contract — runs with `npm run check`.
 *
 * assets/themes.css holds one block per theme and nothing else. A theme is
 * valid only if it:
 *   1. is a single `:root[data-theme="<name>"]{...}` block of custom properties
 *   2. sets exactly the tokens in CONTRACT (no missing, no extras)
 *   3. keeps every text/surface pair in PAIRS at WCAG AA (4.5:1) or better
 * and styles.css must not contain any `[data-theme` selector or theme
 * colour literal: components read tokens, so no theme can be special-cased
 * (that is how the old themes broke whenever the layout changed).
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
let fail = 0;
const bad = (m) => { console.error('✗ ' + m); fail = 1; };
const ok = (m) => console.log('✓ ' + m);

import { THEMES } from './site.mjs';
export { THEMES };
export const CONTRACT = [
  // colour
  'void', 'navy', 'plum', 'ice', 'body-strong', 'muted', 'faint',
  'crimson', 'crimson-hi', 'on-crimson', 'crimson-text', 'teal', 'teal-text', 'on-teal',
  'hairline', 'hairline-2',
  // depth and effects
  'band', 'shade', 'shade-k', 'grad-blood', 'grad-noir', 'grad-teal', 'grad-text',
  'glow-teal', 'glow-crimson', 'btn-glow',
  // atmosphere
  'atmos', 'grid-color', 'grid-opacity', 'grid-size', 'ink-k',
  // surfaces
  'nav-glass', 'glass', 'field-bg', 'cover-shadow',
  // type
  'font-head', 'font-head-em', 'head-weight', 'head-tracking',
  'font-logo', 'logo-weight', 'logo-tracking', 'hero-fs', 'hero-fs-wide', 'hero-lh',
  // shape
  'r-sm', 'r-md', 'kicker-node',
];
// [foreground, background, minimum ratio]
const PAIRS = [
  ['ice', 'void', 7], ['ice', 'navy', 7], ['body-strong', 'void', 4.5], ['body-strong', 'navy', 4.5],
  ['muted', 'void', 4.5], ['muted', 'navy', 4.5], ['muted', 'plum', 4.5], ['faint', 'void', 4.5], ['faint', 'navy', 4.5],
  ['crimson-text', 'void', 4.5], ['crimson-text', 'navy', 4.5], ['teal-text', 'void', 4.5], ['teal-text', 'navy', 4.5],
  ['on-crimson', 'crimson', 4.5], ['on-teal', 'teal', 4.5],
];

const css = read('assets/themes.css').replace(/\/\*[\s\S]*?\*\//g, '');
const blocks = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ sel: m[1].trim(), body: m[2] }));
const seen = new Set();
const hex = (v) => { const m = /^#([0-9a-f]{6})$/i.exec(v); return m ? [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)) : null; };
const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

for (const { sel, body } of blocks) {
  const m = /^:root\[data-theme="([a-z]+)"\]$/.exec(sel);
  if (!m) { bad(`themes.css: "${sel}" is not a theme block — only :root[data-theme="name"] is allowed`); continue; }
  const name = m[1];
  if (!THEMES.includes(name)) { bad(`themes.css: unknown theme "${name}" (add it to THEMES)`); continue; }
  seen.add(name);
  const decl = {};
  for (const d of body.split(/;(?![^(]*\))/)) {
    const i = d.indexOf(':'); if (i < 0) continue;
    const k = d.slice(0, i).trim(), v = d.slice(i + 1).trim().replace(/\s+/g, ' ');
    if (!k) continue;
    if (!k.startsWith('--')) { bad(`${name}: "${k}" is a property, not a token — themes set tokens only`); continue; }
    decl[k.slice(2)] = v;
  }
  const missing = CONTRACT.filter((t) => !(t in decl));
  const extra = Object.keys(decl).filter((t) => !CONTRACT.includes(t));
  missing.length && bad(`${name}: missing tokens ${missing.map((t) => '--' + t).join(', ')}`);
  extra.length && bad(`${name}: tokens outside the contract ${extra.map((t) => '--' + t).join(', ')}`);
  const low = [];
  for (const [fg, bg, min] of PAIRS) {
    const a = hex(decl[fg]), b = hex(decl[bg]);
    if (!a || !b) { low.push(`--${fg}/--${bg} must be #rrggbb`); continue; }
    const r = ratio(a, b);
    if (r < min) low.push(`--${fg} on --${bg} ${r.toFixed(2)}:1 (need ${min})`);
  }
  low.length ? bad(`${name}: ${low.join('; ')}`) : (!missing.length && !extra.length && ok(`${name}: ${CONTRACT.length} tokens, ${PAIRS.length} contrast pairs`));
}
const absent = THEMES.filter((t) => !seen.has(t));
absent.length && bad('themes with no block in themes.css: ' + absent.join(', '));

/* the heading face each theme uses must be preloaded for it (index.html HEAD
   map), or it swaps in after first paint and shifts the hero */
const idx = read('index.html');
const headMap = Object.fromEntries([...(/var HEAD = \{([^}]*)\}/.exec(idx) || [, ''])[1].matchAll(/(\w+):\s*'([\w-]+)'/g)].map((m) => [m[1], m[2]]));
for (const { sel, body } of blocks) {
  const name = (/data-theme="([a-z]+)"/.exec(sel) || [])[1]; if (!name) continue;
  const v = (k) => ((new RegExp('--' + k + ':\\s*([^;]+)').exec(body) || [])[1] || '').trim();
  const face = v('font-head').includes('font-deco') ? 'cinzel-' + v('head-weight') + '-latin' : 'geist-' + v('head-weight') + '-latin';
  headMap[name] === face ? null : bad(`${name}: heading face ${face} is not the one index.html preloads (${headMap[name] || 'none'})`);
}
Object.keys(headMap).length && ok('every theme preloads its own heading face');

/* styles.css: no theme special cases, no theme colour literals */
const styles = read('assets/styles.css').replace(/\/\*[\s\S]*?\*\//g, '');
const scoped = (styles.match(/\[data-theme[^\]]*\]/g) || []).length;
scoped ? bad(`styles.css has ${scoped} [data-theme] selector(s) — express the difference as a token`) : ok('styles.css has no theme-specific selectors');
// colours that belong to a palette; neutral black/white and the WorkspaceHQ
// cartridge (a fixed product palette) are allowed
const PALETTE = /rgba?\(\s*(230,\s*180,\s*80|52,\s*208,\s*232|9,\s*216,\s*199|189,\s*9,\s*39|13,\s*26,\s*47|234,\s*242,\s*244|65,\s*30,\s*58|15,\s*40,\s*64|10,\s*20,\s*32|8,\s*16,\s*28|23,\s*54,\s*79)\b/g;
const lits = [];
for (const m of styles.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  if (/\.theme-menu \.dot/.test(m[1])) continue;   // the switcher shows each theme's colours on purpose
  for (const c of m[2].matchAll(PALETTE)) lits.push(`${m[1].trim().slice(0, 40)} → ${c[0]}`);
}
lits.length ? bad(`styles.css hard-codes theme colours (${lits.length}): ${lits.slice(0, 6).join(' | ')}${lits.length > 6 ? ' …' : ''}`) : ok('styles.css reads theme colours from tokens only');

process.exit(fail);
