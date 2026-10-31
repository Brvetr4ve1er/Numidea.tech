#!/usr/bin/env node
/**
 * Stages the publishable site into _site/ — `npm run stage`.
 * Every host builds from this (GitHub Pages workflow, netlify.toml,
 * vercel.json), so the repository's internal folders (knowledge-base/,
 * audit/, scripts/, BRAND.md…) are never served. The list lives in
 * scripts/site.mjs (DEPLOY); a missing entry fails the build.
 *
 * _site/404.html then gets its JavaScript-off links from the site root
 * (scripts/lib/stage-404.mjs), because the hosts serve it at any depth:
 *   node scripts/stage-site.mjs           the site at "/" (Netlify, Vercel)
 *   node scripts/stage-site.mjs --pages   GitHub Pages: the path of BASE in
 *                                         scripts/site.mjs ("/Numidea.tech/",
 *                                         or "/" once BASE is a custom domain)
 * Then every staged .css and .js loses its comments (scripts/lib/strip-
 * comments.mjs): the repository keeps them, the visitor does not download
 * them. Pages are copied as they are, since their inline scripts are hashed
 * in the CSP meta. scripts/stage-check.mjs proves the stripped files parse
 * and compile as their sources do.
 */
import { rmSync, cpSync, existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';
import { ROOT, DEPLOY, isDeploySkipped, BASE } from './site.mjs';
import { stage404 } from './lib/stage-404.mjs';
import { stripComments } from './lib/strip-comments.mjs';

const OUT = join(ROOT, '_site');
const SITE_ROOT = process.argv.includes('--pages') ? new URL(BASE).pathname : '/';
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);
const missing = DEPLOY.filter((p) => !existsSync(join(ROOT, p)));
if (missing.length) { console.error('✗ deploy list names missing paths: ' + missing.join(', ')); process.exit(1); }
for (const p of DEPLOY) {
  cpSync(join(ROOT, p), join(OUT, p), { recursive: true, filter: (src) => !isDeploySkipped(basename(src)) });
}
const e404 = join(OUT, '404.html');
writeFileSync(e404, stage404(readFileSync(e404, 'utf8'), SITE_ROOT));
// the comments out of every staged stylesheet and script, in place
let n = 0, before = 0, after = 0;
const strip = (p) => {
  if (statSync(p).isDirectory()) { for (const e of readdirSync(p)) strip(join(p, e)); return; }
  if (!/\.(?:css|m?js)$/i.test(p)) return;
  const src = readFileSync(p, 'utf8'), out = stripComments(src, p);
  n++; before += Buffer.byteLength(src); after += Buffer.byteLength(out);
  if (out !== src) writeFileSync(p, out);
};
strip(OUT);
console.log('✓ _site/ staged: ' + DEPLOY.join(', ') + ` (404.html links from ${SITE_ROOT}; ${n} stylesheets and scripts without their comments: ${(before / 1000).toFixed(0)} → ${(after / 1000).toFixed(0)} kB)`);
