#!/usr/bin/env node
/**
 * Cache-bust bump — rewrites every ?v=<stamp> across all pages atomically
 * (`npm run bump`). Run after any CSS/JS/content change, before committing;
 * a stale stamp is exactly how "the website didn't update" happens.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = ['index.html', '404.html', 'hub/index.html', 'scene/index.html'];
const stamp = new Date().toISOString().replace(/[-:TZ]/g, '').slice(0, 12);

for (const f of PAGES) {
  const p = join(ROOT, f);
  const next = readFileSync(p, 'utf8').replace(/\?v=\d+/g, '?v=' + stamp);
  writeFileSync(p, next);
  console.log(`✓ ${f} → ?v=${stamp}`);
}
