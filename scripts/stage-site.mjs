#!/usr/bin/env node
/**
 * Stages the publishable site into _site/ — `npm run stage`.
 * Every host builds from this (GitHub Pages workflow, netlify.toml,
 * vercel.json), so the repository's internal folders (knowledge-base/,
 * audit/, scripts/, BRAND.md…) are never served. The list lives in
 * scripts/site.mjs (DEPLOY); a missing entry fails the build.
 */
import { rmSync, cpSync, existsSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { ROOT, DEPLOY, DEPLOY_SKIP } from './site.mjs';

const OUT = join(ROOT, '_site');
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);
const missing = DEPLOY.filter((p) => !existsSync(join(ROOT, p)));
if (missing.length) { console.error('✗ deploy list names missing paths: ' + missing.join(', ')); process.exit(1); }
for (const p of DEPLOY) {
  cpSync(join(ROOT, p), join(OUT, p), { recursive: true, filter: (src) => !DEPLOY_SKIP.includes(basename(src)) });
}
console.log('✓ _site/ staged: ' + DEPLOY.join(', '));
