/**
 * Outbound GET for the link gates (links.mjs, verify-domains.mjs): the user
 * agent and headers of a normal desktop browser, a timeout per attempt, and
 * retries with a short back-off.
 *
 * Behind an HTTPS proxy Node's fetch goes direct (and fails) unless the
 * process started with NODE_USE_ENV_PROXY=1, so useEnvProxy() re-runs the
 * calling script once with it whenever HTTPS_PROXY is set. Without a proxy
 * (CI, most machines) it does nothing.
 */
import { spawnSync } from 'node:child_process';
import { lookup } from 'node:dns/promises';

export const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const HEADERS = {
  'user-agent': UA,
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'accept-language': 'fr-FR,fr;q=0.9,en;q=0.8,ar;q=0.7',
};

export function useEnvProxy() {
  if (!(process.env.HTTPS_PROXY || process.env.https_proxy) || process.env.NODE_USE_ENV_PROXY) return;
  const r = spawnSync(process.execPath, ['--disable-warning=UNDICI-EHPA', ...process.execArgv, ...process.argv.slice(1)],
    { stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1' } });
  process.exit(r.status ?? 1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// what a thrown fetch means: a timeout, a host that does not resolve (asked
// of the system resolver, so it reads the same with or without a proxy), or
// another network failure (refused, reset, TLS, too many redirects)
async function why(url, e) {
  if (e?.name === 'TimeoutError') return 'timeout';
  const host = new URL(url).hostname;
  try { await lookup(host); } catch (d) {
    if (['ENOTFOUND', 'EAI_AGAIN', 'ENODATA', 'EAI_NONAME'].includes(d.code)) return `DNS: ${host} does not resolve (${d.code})`;
  }
  const c = e?.cause;
  return 'network: ' + String(c?.code || c?.message || e?.message || e).slice(0, 80);
}

/**
 * GET `url`, following redirects. A pass is a 2xx answer; anything else (a
 * 4xx or 5xx, a timeout, a DNS or network failure) is tried again, up to
 * `retries` more times. Resolves the last attempt:
 *   { ok, status (0 when nothing answered), url (after redirects), error, attempts, ms, text }
 * `text` is the body, read only when `body` is set.
 */
export async function get(url, { timeout = 20000, retries = 2, body = false } = {}) {
  let last;
  for (let i = 0; i <= retries; i++) {
    if (i) await sleep(1500 * i);
    const t = Date.now();
    try {
      const r = await fetch(url, { redirect: 'follow', headers: HEADERS, signal: AbortSignal.timeout(timeout) });
      const text = body ? await r.text() : undefined;
      if (!body) await r.body?.cancel().catch(() => {});
      last = { ok: r.ok, status: r.status, url: r.url, attempts: i + 1, ms: Date.now() - t, text };
    } catch (e) {
      last = { ok: false, status: 0, url, error: await why(url, e), attempts: i + 1, ms: Date.now() - t };
    }
    if (last.ok) return last;
  }
  return last;
}
