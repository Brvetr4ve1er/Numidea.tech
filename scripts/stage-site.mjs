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
 */
import { rmSync, cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { ROOT, DEPLOY, DEPLOY_SKIP, BASE } from './site.mjs';
import { stage404 } from './lib/stage-404.mjs';

const OUT = join(ROOT, '_site');
const SITE_ROOT = process.argv.includes('--pages') ? new URL(BASE).pathname : '/';
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);
const missing = DEPLOY.filter((p) => !existsSync(join(ROOT, p)));
if (missing.length) { console.error('✗ deploy list names missing paths: ' + missing.join(', ')); process.exit(1); }
for (const p of DEPLOY) {
  cpSync(join(ROOT, p), join(OUT, p), { recursive: true, filter: (src) => !DEPLOY_SKIP.includes(basename(src)) });
}
const e404 = join(OUT, '404.html');
writeFileSync(e404, stage404(readFileSync(e404, 'utf8'), SITE_ROOT));
console.log('✓ _site/ staged: ' + DEPLOY.join(', ') + ` (404.html links from ${SITE_ROOT})`);
