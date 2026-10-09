/**
 * Shared harness for the browser gates (audit, sweep, vbugs): a static server
 * over the repository root on a free port, and a Chromium launcher.
 *
 * Chromium: CHROMIUM_PATH if set; else this environment's pre-installed
 * build if it exists; else Playwright's own (CI, a contributor's machine).
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { ROOT } from '../site.mjs';

const TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.woff2': 'font/woff2', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.txt': 'text/plain', '.xml': 'application/xml',
};

export async function serve(root = ROOT) {
  const srv = createServer(async (q, r) => {
    let p = decodeURIComponent(q.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    try {
      const b = await readFile(join(root, p));
      r.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' });
      r.end(b);
    } catch { r.writeHead(404); r.end(); }
  }).listen(0, '127.0.0.1');
  await new Promise((res) => srv.on('listening', res));
  return { base: 'http://127.0.0.1:' + srv.address().port, close: () => srv.close() };
}

const LOCAL_CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
export function launch(opts = {}) {
  const executablePath = process.env.CHROMIUM_PATH || (existsSync(LOCAL_CHROME) ? LOCAL_CHROME : undefined);
  return chromium.launch({ executablePath, ...opts });
}
