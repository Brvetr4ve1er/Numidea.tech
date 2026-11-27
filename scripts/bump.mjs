#!/usr/bin/env node
/**
 * Cache-bust bump — rewrites every ?v=<stamp> across all pages atomically
 * (`npm run bump`). Run after any CSS/JS/content change, before committing;
 * a stale stamp is exactly how "the website didn't update" happens.
 * Each page's Content-Security-Policy meta is re-applied after stamping
 * (scripts/lib/csp.mjs): a stamp inside an inline script changes its hash,
 * and a stale hash would block the script. The hosts' header policy, which
 * names every page's hashes (scripts/lib/csp-header.mjs), is rewritten last.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES } from './site.mjs';
import { withCsp, cspKind } from './lib/csp.mjs';
import { withGtag } from './lib/gtag.mjs';
import { applyHeaders } from './lib/csp-header.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const stamp = new Date().toISOString().replace(/[-:TZ]/g, '').slice(0, 12);

for (const f of PAGES) {
  const p = join(ROOT, f);
  const next = withCsp(withGtag(readFileSync(p, 'utf8').replace(/\?v=\d+/g, '?v=' + stamp)), cspKind(f));
  writeFileSync(p, next);
  console.log(`✓ ${f} → ?v=${stamp}`);
}
for (const f of applyHeaders()) console.log(`✓ ${f} header policy rewritten`);
