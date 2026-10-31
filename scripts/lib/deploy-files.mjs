/**
 * Every file the hosts publish, as repository-relative paths: the DEPLOY
 * entries of scripts/site.mjs walked the way scripts/stage-site.mjs copies
 * them (the names isDeploySkipped() knows left out at any depth). check.mjs
 * sizes them for the asset budgets; links.mjs reads the links out of them.
 */
import { readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';
import { ROOT, DEPLOY, isDeploySkipped } from '../site.mjs';

export function deployFiles() {
  const walk = (p) => (isDeploySkipped(basename(p)) ? []
    : statSync(join(ROOT, p)).isDirectory() ? readdirSync(join(ROOT, p)).sort().flatMap((e) => walk(p + '/' + e)) : [p]);
  return DEPLOY.flatMap(walk);
}
