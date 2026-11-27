/**
 * POST /api/csp-report: where browsers send Content-Security-Policy violations
 * (security headers, 2026-11-27). The header policy names it in report-uri
 * (scripts/lib/csp-header.mjs), which every browser sends as
 * application/csp-report, one report per POST. The Reporting API shape
 * (report-to, application/reports+json, an array) is read too, so adding
 * report-to later needs no change here.
 *
 * It stores nothing. Each violation becomes one line in the function's
 * runtime log (Vercel → the project → Logs, filter "csp-violation"), reduced
 * to what explains it: the page, the directive, what was blocked, where.
 * URLs lose their query strings (a page URL can hold a signed payment link),
 * and every field is cut short. Anything else (a GET, a body that is not a
 * report, more than 16 kB) gets a 4xx and no log line, so the log cannot be
 * flooded with arbitrary text. The answer is always empty: a browser never
 * reads it.
 */
const MAX = 16 * 1024;
const TYPES = ['application/csp-report', 'application/reports+json', 'application/json'];

// a URL without its query or fragment; a keyword ("inline", "eval") as it is
const bare = (u) => { const s = String(u ?? '').slice(0, 300); try { const x = new URL(s); return x.origin + x.pathname; } catch { return s.replace(/[?#].*$/, ''); } };
const short = (v, n = 80) => String(v ?? '').replace(/[\r\n\t]+/g, ' ').slice(0, n);

/* one report, either shape, as the fields this logs */
function fields(r) {
  // report-to: { type: 'csp-violation', url, body: { documentURL, effectiveDirective, blockedURL, ... } }
  const b = r && r.body && typeof r.body === 'object' ? r.body : null;
  if (b) {
    if (r.type && r.type !== 'csp-violation') return null;
    return { page: bare(b.documentURL || r.url), directive: short(b.effectiveDirective), blocked: bare(b.blockedURL), source: bare(b.sourceFile),
      line: Number(b.lineNumber) || 0, sample: short(b.sample, 40), mode: short(b.disposition, 10) };
  }
  // report-uri: { 'csp-report': { 'document-uri', 'effective-directive' | 'violated-directive', 'blocked-uri', ... } }
  const c = r && r['csp-report'];
  if (!c || typeof c !== 'object') return null;
  return { page: bare(c['document-uri']), directive: short(c['effective-directive'] || c['violated-directive']), blocked: bare(c['blocked-uri']),
    source: bare(c['source-file']), line: Number(c['line-number']) || 0, sample: short(c['script-sample'], 40), mode: short(c.disposition, 10) };
}

async function rawBody(req) {
  if (typeof req.body === 'string') return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');
  if (req.body && typeof req.body === 'object') return JSON.stringify(req.body);
  let s = '';
  for await (const chunk of req) { s += chunk; if (s.length > MAX) break; }
  return s;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  const type = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
  if (!TYPES.includes(type)) return res.status(415).end();
  if (Number(req.headers['content-length'] || 0) > MAX) return res.status(413).end();
  let data;
  try { const s = await rawBody(req); if (s.length > MAX) return res.status(413).end(); data = JSON.parse(s); } catch { return res.status(400).end(); }
  const reports = (Array.isArray(data) ? data : [data]).slice(0, 20).map(fields).filter(Boolean);
  if (!reports.length) return res.status(400).end();
  for (const r of reports) console.warn('csp-violation ' + JSON.stringify(r));
  return res.status(204).end();
}
