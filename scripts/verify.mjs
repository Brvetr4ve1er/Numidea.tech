#!/usr/bin/env node
/**
 * Every gate in one command — `npm run verify`. Runs them all (it does not
 * stop at the first failure, so one run shows everything that is wrong) and
 * exits non-zero if any failed.
 *
 *   check      repository invariants (check.mjs + themes-check.mjs)
 *   validate   html-validate on every page
 *   audit      browser audit: axe, CLS, LCP, overflow, taps, images, loops, network
 *   sweep      painted-contrast sweep
 *   vbugs      layout scanner
 */
import { spawnSync } from 'node:child_process';
import { ROOT } from './site.mjs';

const STEPS = [
  ['check', ['scripts/check.mjs']],
  ['themes', ['scripts/themes-check.mjs']],
  ['validate', ['scripts/validate.mjs']],
  ['audit', ['scripts/audit.mjs']],
  ['sweep', ['scripts/sweep.mjs']],
  ['vbugs', ['scripts/vbugs.mjs']],
];
const results = [];
for (const [name, args] of STEPS) {
  console.log(`\n━━━ ${name} ━━━`);
  const t = Date.now();
  const r = spawnSync(process.execPath, args, { cwd: ROOT, stdio: 'inherit' });
  results.push([name, r.status === 0, ((Date.now() - t) / 1000).toFixed(0) + 's']);
}
console.log('\n━━━ summary ━━━');
for (const [n, okk, s] of results) console.log(`${okk ? '✓' : '✗'} ${n.padEnd(9)} ${s}`);
process.exit(results.every((r) => r[1]) ? 0 : 1);
