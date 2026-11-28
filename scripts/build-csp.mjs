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
 * generators with it, so they are left to them; en/ and ar/ come out of
 * build-lang.mjs with it too and get the same again here, a no-op that
 * keeps PAGES the one list of what this covers. The pages (not the embeds)
 * also get the Google tag first, withGtag() from scripts/lib/gtag.mjs: right
 * after <head>, before the policy is computed so its inline script is hashed. It runs last because every
 * earlier build step may rewrite an inline script (and bump.mjs re-applies it
 * after stamping): a hash taken before the last edit would block the script.
 * Then the hosts' header policy (vercel.json, netlify.toml), the union of
 * every page's meta plus reporting (scripts/lib/csp-header.mjs): it changes
 * whenever a hash does, so it is written right after the metas.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, PAGES, EXTRA_PAGES } from './site.mjs';
import { withCsp, cspKind, scriptHashes } from './lib/csp.mjs';
import { withGtag } from './lib/gtag.mjs';
import { applyHeaders } from './lib/csp-header.mjs';

// pages whose generator calls withCsp itself (build-scene.mjs, build-legal.mjs)
export const GENERATED = ['scene/index.html', 'legal/index.html'];
export const CSP_FILES = [...PAGES, ...EXTRA_PAGES].filter((f) => !GENERATED.includes(f));

/** Applies (or, with write = false, only computes) the policy on each file. */
export function applyCsp(files = CSP_FILES, { write = true } = {}) {
  return files.map((file) => {
    const p = join(ROOT, file), html = readFileSync(p, 'utf8'), kind = cspKind(file), want = withCsp(kind === 'embed' ? html : withGtag(html), kind);
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
  const stale = applyHeaders({ write: !check });
  for (const f of ['vercel.json', 'netlify.toml']) {
    const s = stale.includes(f);
    console.log(check ? `${s ? '✗' : '✓'} ${f} header policy${s ? ': stale (run: npm run csp)' : ''}` : `✓ ${f} header policy${s ? ' — updated' : ''}`);
  }
  if (check) process.exit(rows.some((r) => r.changed) || stale.length ? 1 : 0);
}
