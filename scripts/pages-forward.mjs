#!/usr/bin/env node
/**
 * The GitHub Pages address (scripts/site.mjs PAGES_BASE) as a forward, not a
 * copy of the site: `node scripts/pages-forward.mjs [dir]` (default _site/)
 * writes the two pages pages.yml publishes there.
 *
 * Until 2026-11-27 Pages served a full mirror. Its deploy stopped finishing
 * (the billing lock from 2026-10-25, then gates past the job's 45 minutes),
 * so it served the 25 October build: a public, indexable duplicate of the
 * site, months behind it. Now every address under PAGES_BASE answers with
 * one small page that
 *  - says noindex, so search engines drop the old copy's URLs (robots.txt
 *    cannot: a project site's /robots.txt belongs to the account's root);
 *  - names BASE as its canonical;
 *  - sends the visitor to the same path on BASE (a script, so the path is
 *    kept: /Numidea.tech/tarifs/ goes to BASE + tarifs/), or to BASE itself
 *    without scripts (meta refresh), with a plain link as the last resort.
 * index.html answers the root (200), 404.html every other path (404, which
 * also tells crawlers the old pages are gone). Nothing else is published.
 */
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { ROOT, BASE, PAGES_BASE } from './site.mjs';

const out = resolve(ROOT, process.argv[2] || '_site');
const sub = new URL(PAGES_BASE).pathname;          // /Numidea.tech/
const host = new URL(BASE).host;
const page = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${BASE}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Numidea Labs — ${host}</title>
<script>(function(){var p=location.pathname,s=${JSON.stringify(sub)};if(p.indexOf(s)===0)p=p.slice(s.length);else p=p.replace(/^\\//,'');location.replace(${JSON.stringify(BASE)}+p+location.search+location.hash);})();</script>
<noscript><meta http-equiv="refresh" content="0; url=${BASE}"></noscript>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0d0b14;color:#efe9dc;font:16px/1.5 system-ui,sans-serif}a{color:inherit}</style>
</head>
<body>
<p>Numidea Labs : <a href="${BASE}">${host}</a></p>
</body>
</html>
`;
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const f of ['index.html', '404.html']) writeFileSync(join(out, f), page);
console.log(`✓ ${out}: index.html and 404.html forward ${PAGES_BASE} to ${BASE} (noindex)`);
