#!/usr/bin/env node
/**
 * Project preview capture — committed-screenshot pipeline.
 *
 * Captures each LIVE project URL at a fixed 16:10 viewport, optimises to a
 * lean WebP, and writes it to assets/previews/<slug>.webp. Sites that are not
 * yet live (url: null) are skipped — the page falls back to the Arcanum
 * abstract cover for those automatically, so nothing ever looks broken.
 *
 * Usage:
 *   npm install
 *   npx playwright install chromium     # one-time, downloads the browser
 *   npm run shots                       # capture everything
 *   npm run shots -- almaflowclim       # capture a single slug
 *
 * Re-run whenever a site ships or changes, then commit the updated .webp.
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'assets', 'previews');

// slug → live URL (null = not live yet → keep the abstract cover)
const PROJECTS = {
  almaflowclim:   'https://almaflowclim.netlify.app',
  alliancetravel: 'https://alliancetravel34.netlify.app',
  nomara:         'https://nomaravoyages.netlify.app',
  glaive:         'https://glaivestore.netlify.app',
  doctorcherfia:  null, // not deployed yet
  hammasat:       null, // not deployed yet
  etoileest:      null, // not deployed yet
};

const W = 1280, H = 800; // 16:10, matches .proj .thumb aspect-ratio

const only = process.argv[2];

async function run() {
  await mkdir(OUT, { recursive: true });
  const targets = Object.entries(PROJECTS)
    .filter(([slug, url]) => url && (!only || slug === only));

  if (!targets.length) { console.log('Nothing to capture (no live URLs match).'); return; }

  const browser = await chromium.launch({
    executablePath: process.env.PW_CHROME || undefined,
    proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined,
  });
  const ctx = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 2,            // retina capture, downscaled on output
    colorScheme: 'light',
    ignoreHTTPSErrors: !!process.env.HTTPS_PROXY,
  });

  for (const [slug, url] of targets) {
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(1200); // let fonts/animations settle
      const png = await page.screenshot({ type: 'png' });
      await sharp(png)
        .resize(W, H, { fit: 'cover', position: 'top' })
        .webp({ quality: 80 })
        .toFile(join(OUT, `${slug}.webp`));
      console.log(`✓ ${slug}.webp  ←  ${url}`);
    } catch (e) {
      console.warn(`✗ ${slug}: ${e.message.split('\n')[0]} (kept existing cover)`);
    } finally {
      await page.close();
    }
  }
  await browser.close();
}

run().catch((e) => { console.error(e); process.exit(1); });
