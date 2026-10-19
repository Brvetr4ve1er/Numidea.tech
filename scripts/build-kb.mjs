#!/usr/bin/env node
/**
 * Knowledge base — `npm run kb` (add `-- --code` to refresh the code graph first).
 *
 * knowledge-base/ is an Obsidian vault (open the folder as a vault). It has two
 * layers:
 *   Home.md, Maps/        written by people (and Claude), each fact citing its
 *                         source file. This script never touches them.
 *   graph/, wiki/,        generated from the knowledge graph that graphify
 *   graphify/             builds over this repository (code by tree-sitter,
 *                         docs by the assistant). This script rewrites them.
 *   archive/              the June 2026 snapshot, kept as history.
 *
 * Building the graph needs graphify (`uv tool install graphifyy`):
 *   - in Claude Code, `/graphify . --update` reads code and docs
 *     (.graphifyignore keeps images, fonts, vendor bundles and the generated
 *     vault out) and writes graphify-out/ (git-ignored);
 *   - `npm run kb -- --code` runs the offline `graphify update .` (code only,
 *     no model) before exporting.
 * Then this script exports graphify-out/ into the vault: the Obsidian notes and
 * canvas (graph/), the community articles (wiki/), and graph.json,
 * GRAPH_REPORT.md and graph.html (graphify/), so `graphify query --graph
 * knowledge-base/graphify/graph.json "…"` works on a fresh clone.
 * Nothing in knowledge-base/ is deployed (scripts/site.mjs NOT_DEPLOYED), and
 * check.mjs refuses anything from the private vault in it.
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './site.mjs';

const KB = join(ROOT, 'knowledge-base');
const OUT = join(ROOT, 'graphify-out');
const run = (args) => execFileSync('graphify', args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'inherit'] }).toString();

try { run(['--version']); } catch {
  console.error('graphify is not installed: uv tool install graphifyy (see knowledge-base/Home.md)');
  process.exit(1);
}
if (process.argv.includes('--code')) process.stdout.write(run(['update', '.']));
if (!existsSync(join(OUT, 'graph.json'))) {
  console.error('no graphify-out/graph.json yet: run /graphify . in Claude Code first (knowledge-base/Home.md)');
  process.exit(1);
}
const labels = existsSync(join(OUT, '.graphify_labels.json')) ? ['--labels', join(OUT, '.graphify_labels.json')] : [];

// generated layers are rebuilt from scratch; Home.md, Maps/ and archive/ are never touched
for (const d of ['graph', 'wiki', 'graphify']) rmSync(join(KB, d), { recursive: true, force: true });

run(['export', 'obsidian', '--graph', join(OUT, 'graph.json'), ...labels, '--dir', join(KB, 'graph')]);
run(['export', 'wiki', '--graph', join(OUT, 'graph.json'), ...labels]);
cpSync(join(OUT, 'wiki'), join(KB, 'wiki'), { recursive: true });
run(['export', 'html', '--graph', join(OUT, 'graph.json'), ...labels]);
mkdirSync(join(KB, 'graphify'), { recursive: true });
for (const f of ['graph.json', 'GRAPH_REPORT.md', 'graph.html']) if (existsSync(join(OUT, f))) cpSync(join(OUT, f), join(KB, 'graphify', f));

// one vault, one .obsidian/: graphify's community colours join the folder colours
const gObs = join(KB, 'graph', '.obsidian', 'graph.json');
const vObs = join(KB, '.obsidian', 'graph.json');
if (existsSync(gObs)) {
  const groups = JSON.parse(readFileSync(gObs, 'utf8')).colorGroups || [];
  const mine = existsSync(vObs) ? JSON.parse(readFileSync(vObs, 'utf8')) : {};
  const keep = (mine.colorGroups || []).filter((g) => !String(g.query).startsWith('tag:#community'));
  writeFileSync(vObs, JSON.stringify({ ...mine, colorGroups: [...keep, ...groups] }, null, 2) + '\n');
  rmSync(join(KB, 'graph', '.obsidian'), { recursive: true, force: true });
}
rmSync(join(KB, 'graph', '.graphify_obsidian_manifest.json'), { force: true });

// the graph is built from a checkout: no machine path may stay in what is committed
const walk = (d) => readdirSync(d).flatMap((e) => (statSync(join(d, e)).isDirectory() ? walk(join(d, e)) : [join(d, e)]));
let scrubbed = 0;
for (const f of walk(KB).filter((p) => /\.(md|json|canvas|html)$/.test(p) && !p.includes(`${KB}/archive`) && !p.includes(`${KB}/Maps`))) {
  const src = readFileSync(f, 'utf8');
  const clean = src.split(ROOT + '/').join('').split(ROOT).join('.');
  if (clean !== src) { writeFileSync(f, clean); scrubbed++; }
}
const notes = readdirSync(join(KB, 'graph')).filter((f) => f.endsWith('.md')).length;
console.log(`✓ knowledge-base/: ${notes} graph notes, wiki and graph exported (${scrubbed} files had a machine path removed)`);
