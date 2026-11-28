#!/usr/bin/env node
/**
 * Every gate in one command — `npm run verify`. Runs them all (it does not
 * stop at the first failure, so one run shows everything that is wrong) and
 * exits non-zero if any failed.
 *
 *   check      repository invariants (check.mjs + themes-check.mjs)
 *   validate   html-validate on every page
 *   first      assets/home-first.css is current with styles.css, and the home
 *              above <main> computes the same without styles.css as with it
 *              (build-first.mjs --check, first-check.mjs)
 *   audit      browser audit: axe, CLS, LCP, overflow, taps, images, loops, network,
 *              CSP violations, the WorkspaceHQ embeds and console, 404 two folders
 *              down (locally and on an emulated GitHub Pages), a throttled phone
 *              (LCP, long tasks, interaction latency: report-only targets until the
 *              home page meets them; AUDIT_PHONE_STRICT=1 npm run verify fails on them)
 *   sweep      painted-contrast sweep
 *   vbugs      layout scanner
 *   hub-mobile the Studio on phones: overflow 280-430, tiles in their tracks, the
 *              bubble, the arrows, the menu and the viewer (check-hub-mobile.mjs)
 *   keys       keyboard paths, focus rings, dialogs, the contact form through its
 *              mail hand-off, reduced motion (the booted console included), RTL
 *   design     design intent: type scale, hero ratio, space set, one button, card
 *              paddings, grid gutter (scripts/design-check.mjs; report-only until
 *              the styles settle, DESIGN_STRICT=1 makes it fail)
 *   stage      the staged copy: every stylesheet parses to the same rules and every
 *              script compiles from _site/ as from the repository
 *              (scripts/stage-check.mjs; it runs stage-site.mjs --pages itself)
 *
 * Not here: `npm run links` (every external link answers), because it needs
 * the network and the answer depends on other people's servers; CI runs it
 * nightly and the live monitor every 6 hours.
 */
import { spawnSync } from 'node:child_process';
import { ROOT } from './site.mjs';

const STEPS = [
  ['check', ['scripts/check.mjs']],
  ['themes', ['scripts/themes-check.mjs']],
  ['hub', ['scripts/build-hub.mjs', '--check']],
  ['validate', ['scripts/validate.mjs']],
  ['first', ['scripts/build-first.mjs', '--check']],
  ['first-paint', ['scripts/first-check.mjs']],
  ['audit', ['scripts/audit.mjs']],
  ['sweep', ['scripts/sweep.mjs']],
  ['vbugs', ['scripts/vbugs.mjs']],
  ['hub-mobile', ['scripts/check-hub-mobile.mjs']],
  ['keys', ['scripts/keys.mjs']],
  ['design', ['scripts/design-check.mjs']],
  ['stage', ['scripts/stage-check.mjs']],
];
/* A gate that stops answering (a browser call that never returns: seen once
   in design, 2026-11-27, which passes in about 2 minutes on its own) fails
   here after VERIFY_GATE_MIN minutes (default 30; each gate takes 17 at
   most) instead of holding the whole run: the summary names it, and the
   gates after it still run. */
const LIMIT = Math.max(1, Number(process.env.VERIFY_GATE_MIN) || 30) * 60000;
const results = [];
for (const [name, args] of STEPS) {
  console.log(`\n━━━ ${name} ━━━`);
  const t = Date.now();
  const r = spawnSync(process.execPath, args, { cwd: ROOT, stdio: 'inherit', timeout: LIMIT, killSignal: 'SIGKILL' });
  const out = r.error && r.error.code === 'ETIMEDOUT';
  if (out) console.log(`✗ ${name} gave no verdict in ${LIMIT / 60000} min: stopped (VERIFY_GATE_MIN raises the limit)`);
  results.push([name, r.status === 0, ((Date.now() - t) / 1000).toFixed(0) + 's' + (out ? ' (stopped: no verdict)' : '')]);
}
console.log('\n━━━ summary ━━━');
for (const [n, okk, s] of results) console.log(`${okk ? '✓' : '✗'} ${n.padEnd(9)} ${s}`);
process.exit(results.every((r) => r[1]) ? 0 : 1);
