/**
 * Fits graphify's Obsidian export into a vault that has other notes beside it
 * (used by scripts/build-kb.mjs; `node scripts/lib/kb-vault.mjs <vault>` runs it
 * on any vault laid out the same way).
 *
 * graphify writes its notes as if graph/ were the vault root. Inside a larger
 * vault two things break:
 *   - names: Obsidian resolves [[Name]] case-insensitively across the whole
 *     vault, so a graph note named like a map, a wiki page or an archived file
 *     (README, index, a competitor…) makes those links ambiguous. Such a graph
 *     note is renamed "<name> (graph)" and the links inside graph/ follow it;
 *   - the canvas: its cards name files from the export root, so they gain the
 *     graph/ prefix.
 */
import { existsSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const walk = (d) => readdirSync(d).flatMap((e) => {
  const p = join(d, e);
  return statSync(p).isDirectory() ? (e.startsWith('.') ? [] : walk(p)) : [p];
});

export function fitGraphInVault(vault) {
  const graph = join(vault, 'graph');
  if (!existsSync(graph)) return { renamed: 0 };
  const others = new Set(walk(vault).filter((p) => p.endsWith('.md') && !relative(vault, p).startsWith('graph/'))
    .map((p) => p.split('/').pop().slice(0, -3).toLowerCase()));
  const renames = new Map();
  for (const f of readdirSync(graph).filter((f) => f.endsWith('.md'))) {
    const stem = f.slice(0, -3);
    if (!others.has(stem.toLowerCase())) continue;
    let next = `${stem} (graph)`, n = 2;
    while (existsSync(join(graph, next + '.md'))) next = `${stem} (graph ${n++})`;
    renameSync(join(graph, f), join(graph, next + '.md'));
    renames.set(stem, next);
  }
  if (renames.size) {
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\[\\[(${[...renames.keys()].map(esc).join('|')})(?=[|#\\]])`, 'g');
    for (const f of readdirSync(graph).filter((f) => f.endsWith('.md'))) {
      const src = readFileSync(join(graph, f), 'utf8');
      const out = src.replace(re, (_, name) => '[[' + renames.get(name));
      if (out !== src) writeFileSync(join(graph, f), out);
    }
  }
  const canvasPath = join(graph, 'graph.canvas');
  if (existsSync(canvasPath)) {
    const canvas = JSON.parse(readFileSync(canvasPath, 'utf8'));
    for (const node of canvas.nodes || []) {
      if (node.type !== 'file' || !node.file) continue;
      let file = node.file.replace(/^graph\//, '');
      const stem = file.replace(/\.md$/, '');
      if (renames.has(stem)) file = renames.get(stem) + '.md';
      node.file = 'graph/' + file;
    }
    writeFileSync(canvasPath, JSON.stringify(canvas));
  }
  return { renamed: renames.size };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { renamed } = fitGraphInVault(process.argv[2] || 'knowledge-base');
  console.log(`✓ graph notes fitted into the vault (${renamed} renamed to avoid a name clash)`);
}
