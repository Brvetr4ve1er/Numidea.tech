#!/usr/bin/env node
/**
 * Share images for pages that have none — `node scripts/og-capture.mjs`
 *
 * A 1200×630 render of the page itself (its real first screen, not artwork
 * made for the purpose), saved as JPEG next to the page: hub/og.jpg,
 * workspacehq/og.jpg. Re-run after a visual change to either page.
 */
import { serve, launch } from './lib/serve.mjs';
import { ROOT } from './site.mjs';
import { join } from 'node:path';

const PAGES = { 'hub/': 'hub/og.jpg', 'workspacehq/': 'workspacehq/og.jpg' };
const { base, close } = await serve();
const b = await launch();
try {
  for (const [page, out] of Object.entries(PAGES)) {
    const p = await (await b.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce' })).newPage();
    await p.goto(base + '/' + page, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(1200);
    await p.screenshot({ path: join(ROOT, out), type: 'jpeg', quality: 82 });
    console.log('✓ ' + out);
  }
} finally { await b.close(); close(); }
