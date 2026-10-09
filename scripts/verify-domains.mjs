#!/usr/bin/env node
/**
 * Can a client card link the client's own domain? — `node scripts/verify-domains.mjs`
 *
 * For every data-client link on index.html: read the canonical URL the linked
 * site declares, resolve that host (DNS-over-HTTPS), fetch it, and compare it
 * with the build we link (title + nav words). Only a host that resolves AND
 * serves the same site is reported as switchable. Switching itself is a
 * one-line change per client in index.html (plate + card href, browser bar)
 * and scripts/scene-data.mjs; check.mjs keeps them in step.
 *
 * Read-only: it never edits anything.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './site.mjs';

const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
const clients = {};
for (const m of html.matchAll(/<a\b[^>]*\bdata-client="([a-z0-9-]+)"[^>]*>/g)) {
  const href = (/\bhref="([^"]+)"/.exec(m[0]) || [])[1];
  if (href) clients[m[1]] = href;
}

const get = async (u) => {
  const r = await fetch(u, { redirect: 'follow', signal: AbortSignal.timeout(20000) });
  return { status: r.status, url: r.url, text: await r.text() };
};
const title = (t) => ((/<title>([^<]*)<\/title>/i.exec(t) || [])[1] || '').trim();
const generator = (t) => ((/<meta[^>]+name="generator"[^>]+content="([^"]*)"/i.exec(t) || [])[1] || '');
const words = (t) => new Set((t.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ')
  .match(/<nav[\s\S]*?<\/nav>/gi) || [t]).join(' ').replace(/<[^>]+>/g, ' ').toLowerCase().match(/[a-zà-ÿ؀-ۿ]{3,}/g) || []);
const jaccard = (a, b) => { const i = [...a].filter((x) => b.has(x)).length; return i / ((a.size + b.size - i) || 1); };

const rows = [];
for (const [slug, href] of Object.entries(clients)) {
  const row = { slug, linked: href, canonical: '', resolves: '', same: '', verdict: 'keep' };
  try {
    const live = await get(href);
    const canon = (/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i.exec(live.text) || [])[1] || '';
    row.canonical = canon;
    const host = canon ? new URL(canon).host : '';
    if (!host || host === new URL(href).host) { row.verdict = 'keep (no other canonical)'; rows.push(row); continue; }
    const dns = await (await fetch(`https://dns.google/resolve?name=${host}&type=A`, { signal: AbortSignal.timeout(15000) })).json();
    row.resolves = dns.Status === 0 && (dns.Answer || []).length ? 'yes' : `no (DNS status ${dns.Status})`;
    if (row.resolves !== 'yes') { rows.push(row); continue; }
    const prod = await get(canon);
    const sim = jaccard(words(live.text), words(prod.text));
    const sameGen = generator(live.text) === generator(prod.text);
    row.same = `title "${title(prod.text).slice(0, 50)}", nav similarity ${sim.toFixed(2)}, generator ${generator(prod.text) || 'none'}`;
    if (prod.status === 200 && sim >= 0.8 && sameGen) row.verdict = 'SWITCHABLE';
  } catch (e) { row.verdict = 'keep (error: ' + String(e.message || e).slice(0, 60) + ')'; }
  rows.push(row);
}
for (const r of rows) {
  console.log(`\n${r.slug}: ${r.verdict}\n  linked:    ${r.linked}\n  canonical: ${r.canonical || '—'}` +
    (r.resolves ? `\n  resolves:  ${r.resolves}` : '') + (r.same ? `\n  compare:   ${r.same}` : ''));
}
