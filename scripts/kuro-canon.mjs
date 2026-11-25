#!/usr/bin/env node
/**
 * Kūro's canon fur: `node scripts/kuro-canon.mjs`
 *
 * Kūro is one cat: jet black, flat fur, amber eyes, red collar (BRAND.md,
 * "The model sheet"). Three published drawings came out off-model, brown
 * (hub/img/studio/kuro-sit, kuro-paw) or navy (hub/img/lanterne/cast/kuro).
 * This pass maps their fur to the canon's cool ink black and keeps what is
 * not fur: the amber eyes, the red collar and tag, the pink of the ears and
 * the pads, the whites. Nothing is redrawn.
 *
 * `node scripts/kuro-canon.mjs <file.webp>…` runs it on those files only.
 *
 * Run it after `npm run hub:art` (which cuts kuro-sit and kuro-paw again
 * from the masters, brown). It is not idempotent: a second pass on its own
 * output darkens the fur a little more, so it refuses a file whose fur is
 * already canon (mean fur chroma under FUR_DONE).
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './site.mjs';

// with paths on the command line it works on those instead (a new Kūro cut-out, before it ships)
const FILES = process.argv.length > 2 ? process.argv.slice(2)
  : ['hub/img/studio/kuro-sit.webp', 'hub/img/studio/kuro-paw.webp', 'hub/img/lanterne/cast/kuro.webp'];
const FUR_DONE = 0.03;

for (const rel of FILES) {
  const path = join(ROOT, rel);
  const before = readFileSync(path).length;
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);
  let furN = 0, furChroma = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), sat = mx > 0 ? (mx - mn) / mx : 0;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const eye = sat > 0.45 && mx > 0.45 && r > b + 0.15;
    const red = r > g + 0.25 && r > b + 0.2 && sat > 0.5;
    const pink = r > g + 0.08 && r > b && mx > 0.45 && sat > 0.2 && sat <= 0.5;
    const light = lum > 0.62;
    if (eye || red || pink || light) continue;
    furN++; furChroma += mx - mn;
    const ink = Math.min(1, 0.03 + lum * 0.55);
    out[i] = Math.round(ink * 0.97 * 255);
    out[i + 1] = Math.round(ink * 0.97 * 255);
    out[i + 2] = Math.round(Math.min(1, ink * 1.06) * 255);
  }
  if (furN && furChroma / furN < FUR_DONE) { console.log(`${rel}: already canon, left as is`); continue; }
  const webp = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 82, effort: 6 }).toBuffer();
  writeFileSync(path, webp);
  console.log(`${rel}: ${info.width}x${info.height}, ${before} → ${webp.length} bytes`);
}
