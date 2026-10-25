#!/usr/bin/env node
/**
 * The Content-Security-Policy meta on the hand-written pages — `npm run csp`,
 * and the LAST step of `npm run build` (`--check` exits 1 when a page
 * differs).
 *
 * Every page in scripts/site.mjs (PAGES and the WorkspaceHQ embeds in
 * EXTRA_PAGES) gets withCsp() from scripts/lib/csp.mjs: the policy meta right
 * after its viewport meta, script-src listing the sha256 of each inline
 * script. The generated pages (scene/, legal/) already come out of their
 * generators with it, so they are left to them. It runs last because every
 * earlier build step may rewrite an inline script (and bump.mjs re-applies it
 * after stamping): a hash taken before the last edit would block the script.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, PAGES, EXTRA_PAGES } from './site.mjs';
import { withCsp, cspKind, scriptHashes } from './lib/csp.mjs';

// pages whose generator calls withCsp itself (build-scene.mjs, build-legal.mjs)
export const GENERATED = ['scene/index.html', 'legal/index.html'];
export const CSP_FILES = [...PAGES, ...EXTRA_PAGES].filter((f) => !GENERATED.includes(f));

/** Applies (or, with write = false, only computes) the policy on each file. */
export function applyCsp(files = CSP_FILES, { write = true } = {}) {
  return files.map((file) => {
    const p = join(ROOT, file), html = readFileSync(p, 'utf8'), kind = cspKind(file), want = withCsp(html, kind);
    const changed = want !== html;
    if (changed && write) writeFileSync(p, want);
    return { file, kind, changed, hashes: scriptHashes(want).length };
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const check = process.argv.includes('--check');
  const rows = applyCsp(CSP_FILES, { write: !check });
  for (const r of rows) {
    const what = `${r.file} (${r.kind}, ${r.hashes} inline script${r.hashes === 1 ? '' : 's'} hashed)`;
    console.log(check ? `${r.changed ? '✗' : '✓'} ${what}${r.changed ? ': CSP meta stale (run: npm run csp)' : ''}`
      : `✓ ${what}${r.changed ? ' — updated' : ''}`);
  }
  if (check) process.exit(rows.some((r) => r.changed) ? 1 : 0);
}
