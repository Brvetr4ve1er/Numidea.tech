#!/usr/bin/env node
/**
 * Add a clip to the Studio's reel (in the Lab, hub/#reel).
 *
 *   npm run motion:add -- <file> <id> "<name>" ["<line under the name>"] [posterAt]
 *   npm run motion:add -- ~/Desktop/logo-reveal.gif logo-reveal "Logo Atlas" "Logo animé · 4 s"
 *   npm run motion:add -- ~/Desktop/passage.mov wipe2 "Le passage" "La page se soulève" 2.5
 *
 * <file> is a GIF, an MP4, a MOV or a WebM. It is cut into what the page
 * serves: an H.264 .mp4 without sound (640 px wide for a landscape clip, 540
 * for a portrait one, 25 frames a second, at most MAX_S seconds) and a WebP
 * poster taken a third of the way in (or at posterAt seconds, when given: it is
 * kept in reel.json so a later re-cut takes the same frame), both in
 * hub/img/studio/reel/. The clip
 * is then appended to hub/src/reel.json, the list the build turns into
 * tiles. The name and the line are French; add "en" and "ar" beside "fr" in
 * reel.json for the other two languages (French stands in until then).
 *
 * Then: npm run build, and npm run check. The page never plays a clip on its
 * own: a tile is its poster until the pointer rests on it or it is pressed.
 *
 * Needs ffmpeg and ffprobe on the PATH. Nothing is uploaded anywhere.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import sharp from 'sharp';
import { ROOT } from './site.mjs';

const MAX_S = 12;                 // seconds kept from the source
const CEILING = 741 * 1000;       // hub/img's per-file ceiling (scripts/check.mjs, check 17)
const die = (m) => { console.error(`✗ ${m}`); process.exit(1); };

const [file, id, name, what = '', at] = process.argv.slice(2);
if (!file || !id || !name) die('usage: npm run motion:add -- <file> <id> "<name>" ["<line under the name>"] [posterAt]');
const posterAt = at === undefined || at === '' ? null : Number(at);
if (posterAt !== null && !(posterAt >= 0)) die(`posterAt is a number of seconds, 0 or more ("${at}")`);
if (!/^[a-z0-9-]+$/.test(id)) die(`the id is lowercase letters, digits and hyphens ("${id}")`);
const src = resolve(file);
if (!existsSync(src)) die(`${file}: no such file`);
for (const bin of ['ffmpeg', 'ffprobe']) { try { execFileSync(bin, ['-version'], { stdio: 'ignore' }); } catch { die(`${bin} is not installed (it cuts the clip)`); } }

const REEL = join(ROOT, 'hub/src/reel.json');
const reel = JSON.parse(readFileSync(REEL, 'utf8'));
if (reel.some((c) => c.id === id)) die(`hub/src/reel.json already has a clip named "${id}"`);

const probe = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'csv=p=0', src], { encoding: 'utf8' }).trim().split(/\s+/);
const [sw, sh] = probe[0].split(',').map(Number);
const dur = Math.min(MAX_S, Number(probe[1]) || MAX_S);
if (!(sw > 0 && sh > 0)) die(`${file}: no picture in it`);
const tall = sh > sw;
const w = Math.min(tall ? 540 : 640, sw - (sw % 2));
const h = Math.round(w * sh / sw / 2) * 2;      // H.264 wants even sides

const dir = join(ROOT, 'hub/img/studio/reel');
mkdirSync(dir, { recursive: true });
const mp4 = join(dir, `${id}.mp4`), webp = join(dir, `${id}.webp`), png = join(tmpdir(), `reel-${id}-${process.pid}.png`);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, '-t', String(dur), '-an', '-vf', `scale=${w}:${h}:flags=lanczos,fps=25`,
  '-c:v', 'libx264', '-preset', 'veryslow', '-crf', '27', '-pix_fmt', 'yuv420p', '-profile:v', 'main', '-movflags', '+faststart', mp4], { stdio: 'inherit' });
const ss = posterAt === null ? dur / 3 : Math.min(posterAt, Math.max(0, dur - 0.04));
execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(ss), '-i', src, '-frames:v', '1', '-vf', `scale=${w}:${h}:flags=lanczos`, png], { stdio: 'inherit' });
await sharp(png).webp({ quality: 80, effort: 6, smartSubsample: true }).toFile(webp);
rmSync(png, { force: true });
const bytes = statSync(mp4).size;
if (bytes > CEILING) { rmSync(mp4); rmSync(webp); die(`the clip comes to ${Math.round(bytes / 1000)} kB, over the ${CEILING / 1000} kB a file under hub/img may weigh: shorten the source and run again`); }

reel.push({ id, src: `img/studio/reel/${id}.mp4`, poster: `img/studio/reel/${id}.webp`, w, h, ...(tall ? { tall: true } : {}), ...(posterAt === null ? {} : { posterAt }), name: { fr: name }, what: { fr: what } });
writeFileSync(REEL, JSON.stringify(reel, null, 2) + '\n');
console.log(`✓ ${id}: ${w}×${h}, ${dur.toFixed(1)} s, ${Math.round(bytes / 1000)} kB, with its poster; added to hub/src/reel.json`);
console.log('  next: npm run build && npm run check  (the published-size ceiling in scripts/check.mjs may need raising by the clip\'s weight)');
