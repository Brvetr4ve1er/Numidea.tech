/**
 * Shared harness for the browser gates (audit, sweep, vbugs, keys): a static
 * server over the repository root on a free port, and a Chromium launcher.
 *
 * serve(root, { compress, fallback404 }): compress gzips text as the hosts
 * do; fallback404 answers a missing file the way GitHub Pages, Netlify and
 * Vercel do, with the root's 404.html and status 404 (off by default: then a
 * missing file is an empty 404).
 *
 * Chromium: CHROMIUM_PATH if set; else this environment's pre-installed
 * build if it exists; else Playwright's own (CI, a contributor's machine).
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
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

const LOCAL_CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
export function launch(opts = {}) {
  const executablePath = process.env.CHROMIUM_PATH || (existsSync(LOCAL_CHROME) ? LOCAL_CHROME : undefined);
  return chromium.launch({ executablePath, ...opts });
}
