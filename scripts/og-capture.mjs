#!/usr/bin/env node
/**
 * Share images for pages that have none — `node scripts/og-capture.mjs [page]`
 *
 * A 1200×630 render of the page itself (its real first screen, not artwork
 * made for the purpose), saved as JPEG next to the page: hub/og.jpg,
 * workspacehq/og.jpg. Re-run after a visual change to either page; with a
 * page name (`hub` or `workspacehq`) only that card is rendered, so the other
 * stays byte for byte as it was. With reduced motion, so the first screen is
 * drawn at rest; the hub in its paper palette, its default, set explicitly so
 * a stored choice can never reach the card. check.mjs block 17 holds every
 * og.jpg to 300 kB.
 */
import { serve, launch } from './lib/serve.mjs';
import { ROOT } from './site.mjs';
import { join } from 'node:path';

const PAGES = {
  hub: { path: 'hub/', out: 'hub/og.jpg', init: { 'void-theme': 'light' } },
  workspacehq: { path: 'workspacehq/', out: 'workspacehq/og.jpg', init: {} },
};
const only = process.argv[2];
if (only && !PAGES[only]) { console.error(`✗ no share card for "${only}" (one of: ${Object.keys(PAGES).join(', ')})`); process.exit(1); }
const { base, close } = await serve();
const b = await launch();
try {
  for (const [name, { path, out, init }] of Object.entries(PAGES)) {
    if (only && name !== only) continue;
    const p = await (await b.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce' })).newPage();
    await p.addInitScript((init) => { for (const k in init) localStorage.setItem(k, init[k]); }, init);
    await p.goto(base + '/' + path, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(1200);
    await p.screenshot({ path: join(ROOT, out), type: 'jpeg', quality: 82 });
    console.log('✓ ' + out);
  }
} finally { await b.close(); close(); }
