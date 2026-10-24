/**
 * Every file the hosts publish, as repository-relative paths: the DEPLOY
 * entries of scripts/site.mjs walked the way scripts/stage-site.mjs copies
 * them (DEPLOY_SKIP names left out at any depth). check.mjs sizes them for
 * the asset budgets; links.mjs reads the links out of them.
 */
import { readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';
import { ROOT, DEPLOY, DEPLOY_SKIP } from '../site.mjs';

export function deployFiles() {
  const walk = (p) => (DEPLOY_SKIP.includes(basename(p)) ? []
    : statSync(join(ROOT, p)).isDirectory() ? readdirSync(join(ROOT, p)).sort().flatMap((e) => walk(p + '/' + e)) : [p]);
  return DEPLOY.flatMap(walk);
}
