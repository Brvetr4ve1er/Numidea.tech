/**
 * A small job pool for the browser gates (audit, sweep, vbugs): independent
 * page runs go to one shared browser N at a time, each run in its own page
 * and context, as before. Added 2026-11-27, when verify passed 50 minutes and
 * GitHub's deploy job (45 minutes) could no longer hold these gates and keys
 * one after the other. Nothing is skipped: every run still runs, only side by
 * side.
 *
 * What a run prints with console.log is held and printed whole, in the order
 * the runs were queued, so a report reads as it did when the runs went one
 * after the other; a line printed outside a run while runs are still pending
 * (a section heading) takes its place in that order too.
 *
 *   const { q, drain } = pool(jobs('AUDIT_JOBS'));
 *   q(() => run(...));     // queues; returns nothing, so `await q(...)` does not wait
 *   await drain();         // every queued run done and printed
 *   crashed()              // how many runs threw (the caller fails on them)
 *
 * jobs(envName): that variable if set (1 = one at a time, as before), else
 * the cores less one, at most 4.
 */
import { AsyncLocalStorage } from 'node:async_hooks';
import { availableParallelism } from 'node:os';

export const jobs = (env) => Math.max(1, parseInt(process.env[env] || '', 10) || Math.min(4, availableParallelism() - 1));

export function pool(n) {
  const als = new AsyncLocalStorage();
  const out = console.log.bind(console);
  const slots = [];               // in queue order: { lines, done }
  let head = 0, active = 0, crashed = 0;
  const waiting = [], all = [];
  const flush = () => {
    while (head < slots.length && slots[head].done) { for (const a of slots[head].lines) out(...a); slots[head].lines = null; head++; }
  };
  console.log = (...a) => {
    const slot = als.getStore();
    if (slot) slot.lines.push(a);
    else if (head < slots.length) slots.push({ lines: [a], done: true });
    else out(...a);
  };
  const next = () => {
    while (active < n && waiting.length) {
      const [slot, fn, res, name] = waiting.shift();
      active++;
      als.run(slot, () => Promise.resolve().then(fn)).catch((e) => { slot.lines.push(['FAIL (crashed) ' + (name ? name + ': ' : '') + String(e && e.stack || e).split('\n').slice(0, 3).join(' | ')]); crashed++; })
        .finally(() => { slot.done = true; active--; flush(); next(); res(); });
    }
  };
  // name (optional): which run it is, printed if it crashes (a crash's stack names the line, not the page)
  const q = (fn, name) => {
    const slot = { lines: [], done: false };
    slots.push(slot);
    all.push(new Promise((res) => { waiting.push([slot, fn, res, name]); }));
    next();
  };
  const drain = async () => { for (let i = 0; i < all.length; i++) await all[i]; flush(); };
  // crashed(): runs that threw; each caller counts them as failures
  return { q, drain, crashed: () => crashed };
}
