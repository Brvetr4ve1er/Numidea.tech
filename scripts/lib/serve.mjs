/**
 * Shared harness for the browser gates (audit, sweep, vbugs, keys): a static
 * server over the repository root on a free port, and a Chromium launcher.
 *
 * serve(root, { compress, fallback404 }): compress gzips text as the hosts
 * do; fallback404 answers a missing file the way GitHub Pages, Netlify and
 * Vercel do, with the root's 404.html and status 404 (off by default: then a
 * missing file is an empty 404).
 *
 * Chromium: CHROMIUM_PATH if set; else the newest of this environment's
 * pre-installed builds if there is one; else Playwright's own (CI, a
 * contributor's machine).
 * Always with --font-render-hinting=none. Without it, the binary decides
 * where text wraps: Playwright's default headless shell (what CI gets)
 * forces full hinting, which rounds glyph advances to whole pixels, while the
 * full build follows fontconfig (slight, so fractional advances, as on
 * phones and Macs). Arcanum's French hero at 360px ends a line 0.6px inside
 * its box in one and wraps it in the other, so the audit's fallback-type
 * runs passed here and fail on CI's binary (reproduced with it). With hinting
 * off, the full build and the headless shell, both 141 and 149, give the
 * same 12 results.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, extname, resolve, sep } from 'node:path';
import { ROOT } from '../site.mjs';

const TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.woff2': 'font/woff2', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.txt': 'text/plain', '.xml': 'application/xml',
};

// gzip like the hosts do (GitHub Pages gzips every text type): the audit's
// throttled phone profile measures transfer time, and uncompressed text would
// take about 3.5 times as long to arrive as it does in production
const TEXT = new Set(['.html', '.css', '.js', '.mjs', '.json', '.svg', '.txt', '.xml']);

export async function serve(root = ROOT, { compress = false, fallback404 = false } = {}) {
  const top = resolve(root);
  const send = (q, r, status, file, b) => {
    const head = { 'content-type': TYPES[extname(file)] || 'application/octet-stream' };
    if (compress && TEXT.has(extname(file)) && /\bgzip\b/.test(q.headers['accept-encoding'] || '')) {
      r.writeHead(status, { ...head, 'content-encoding': 'gzip', vary: 'accept-encoding' });
      r.end(gzipSync(b));
      return;
    }
    r.writeHead(status, head);
    r.end(b);
  };
  const srv = createServer(async (q, r) => {
    // only files under root: join() resolves ../ (sent raw or as %2e%2e/%2f),
    // so the resolved path is what gets tested; a malformed %-escape is a 400
    let file;
    try {
      let p = decodeURIComponent(q.url.split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      file = join(top, p);
    } catch { r.writeHead(400); r.end(); return; }
    if (!file.startsWith(top + sep)) { r.writeHead(403); r.end(); return; }
    let b;
    try { b = await readFile(file); } catch {
      const page = fallback404 && join(top, '404.html');
      try { if (page) { send(q, r, 404, page, await readFile(page)); return; } } catch { /* no 404.html */ }
      r.writeHead(404); r.end(); return;
    }
    send(q, r, 200, file, b);
  }).listen(0, '127.0.0.1');
  await new Promise((res) => srv.on('listening', res));
  return { base: 'http://127.0.0.1:' + srv.address().port, close: () => srv.close() };
}

// The pre-installed builds live in Playwright's own layout, one folder per
// build number; the newest that has a binary wins (chrome-linux64/ in the
// current builds, chrome-linux/ in older ones), so a new image needs no edit
// here. The number the locked Playwright wants may be absent: then
// CHROMIUM_PATH names the build to use, as the plan's setup facts say.
const PW_BROWSERS = '/opt/pw-browsers';
function localChrome() {
  let builds;
  try { builds = readdirSync(PW_BROWSERS).filter((d) => /^chromium-\d+$/.test(d)); } catch { return undefined; }
  builds.sort((a, b) => Number(b.slice(9)) - Number(a.slice(9)));
  for (const d of builds) {
    for (const bin of ['chrome-linux64/chrome', 'chrome-linux/chrome']) {
      if (existsSync(join(PW_BROWSERS, d, bin))) return join(PW_BROWSERS, d, bin);
    }
  }
  return undefined;
}
export function launch(opts = {}) {
  const executablePath = process.env.CHROMIUM_PATH || localChrome();
  return chromium.launch({ executablePath, ...opts, args: ['--font-render-hinting=none', ...(opts.args || [])] });
}
