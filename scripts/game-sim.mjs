#!/usr/bin/env node
/**
 * The game layer's numbers and its save, in Node — `npm run game:sim`. Exits non-zero on any failed check.
 *
 * Runs the CORE of hub/game.js (no page) on the data the build wrote into hub/lanterne/index.html (#game-data), then:
 *  1. checks the save: nothing stored, a broken string, an array, a save with broken parts, a save from a newer
 *     version, a v0 save (the spec's draft shape), the old manual's stamps read without being rewritten;
 *  2. simulates a visitor: one lesson, the first book, every book in shelf order, then the night cases and the seals,
 *     and prints the Encre and the minutes each rank takes at MIN_PER_DISTRICT (a guess until real data comes in);
 *  3. checks the tuning rules: rank 2 on the first lesson, rank 3 inside the first book, the top rank reachable
 *     on the atlases alone, and no rank further than 3 hours of play from the one before.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MIN_PER_DISTRICT = 4;      // minutes: a situation + its exercise (a guess, see the spec's "still unproven")
const ctx = {}; vm.createContext(ctx);
vm.runInContext(readFileSync(join(ROOT, 'hub/game.js'), 'utf8'), ctx);
const C = ctx.NumideaGameCore;
const page = readFileSync(join(ROOT, 'hub/lanterne/index.html'), 'utf8');
const D = JSON.parse(page.match(/<script type="application\/json" id="game-data">(.*?)<\/script>/s)[1]);
let bad = 0;
const ok = (c, msg) => { if (c) console.log('  ✓ ' + msg); else { bad++; console.log('  ✗ ' + msg); } };
const store = (o) => (k) => (k in o ? JSON.parse(JSON.stringify(o[k])) : null);
const N = D.ranks.length;

console.log('the save');
{
  let L = C.load(null, N); ok(L.fresh && !L.bad && L.s.rank === 1, 'nothing stored: a blank save, rank 1');
  L = C.load('{not json', N); ok(L.bad && L.s.rank === 1, 'a broken string: rebuilt blank, flagged');
  L = C.load('[1,2]', N); ok(L.bad && L.s.v === 1, 'an array: rebuilt blank, flagged');
  L = C.load(JSON.stringify({ v: 1, rank: 4, seen: [1, 2, 99, 'x'], world: { kuro_in_bag: true, 'Bad Key': 1, ok_n: 2 }, ep: { 'le-dernier-depart': { done: true, t: 5 }, nope: { done: 'yes' } }, name: 'A'.repeat(90) }), N);
  ok(L.bad && L.s.rank === 4 && L.s.seen.join() === '1,2' && L.s.world.kuro_in_bag === true && !('Bad Key' in L.s.world) && L.s.world.ok_n === 2 && Object.keys(L.s.ep).join() === 'le-dernier-depart' && L.s.name.length === 40,
    'broken parts dropped, the rest kept (rank, seen, world flags, episodes, name)');
  L = C.load(JSON.stringify({ v: 2, rank: 3, newThing: 1 }), N); ok(L.future && L.s.rank === 3, 'a newer version: read, flagged so the page never writes over it');
  L = C.load(JSON.stringify({ rank: 2, seen: [1, 2] }), N); ok(L.bad && L.s.v === 1 && L.s.rank === 2, 'a v0 save (no v): upgraded to v1, its rank kept');
  const old = D.books.find((b) => b.migrate);
  const ids = old.acts.flatMap((a) => a.d), mig = [].concat(old.migrate)[0];
  const got = C.bookDone(store({ [mig]: ids.slice(0, 2) }), old);
  ok(got.length === 2, `an atlas not yet moved (${old.slug}): its old stamps (${mig}) count, read only`);
  const got2 = C.bookDone(store({ [old.store]: { v: 1, d: { [ids[0]]: { a: 1 }, [ids[1]]: { a: 1, x: 1 } } } }), old);
  ok(got2.length === 1, 'a district counts once answered AND its exercise done');
}

/* a visitor, in shelf order */
const keys = {}, s = C.blank();
const P = () => C.compute(D, store(keys), s);
const order = D.books.flatMap((b) => b.acts.flatMap((a) => a.d.map((id) => [b, id])));
const finish = (b, id) => { const S = keys[b.store] || (keys[b.store] = { v: 1, d: {}, last: null }); S.d[id] = { a: 1, x: 1 }; };
const reached = {}; let minutes = 0;
const mark = () => { const p = P(); for (let r = 2; r <= p.earned; r++) if (!(r in reached)) reached[r] = minutes; return p; };
console.log('\na visitor (' + MIN_PER_DISTRICT + ' min a district, shelf order)');
finish(...order[0]); minutes += MIN_PER_DISTRICT; let p = mark();
console.log(`  one lesson: ${p.encre} Encre, rank ${p.earned}`);
const first = D.books[0], firstIds = first.acts.flatMap((a) => a.d);
for (const id of firstIds.slice(1)) { finish(first, id); minutes += MIN_PER_DISTRICT; mark(); }
p = P(); console.log(`  the first book (${first.slug}, ${firstIds.length} districts, ${minutes} min): ${p.encre} Encre, rank ${p.earned}`);
const firstBookRank = p.earned, firstBookMin = minutes;
for (const [b, id] of order.slice(firstIds.length)) { finish(b, id); minutes += MIN_PER_DISTRICT; mark(); }
p = P(); const atlasOnly = p.encre;
console.log(`  every book (${order.length} districts, ${(minutes / 60).toFixed(1)} h): ${p.encre} Encre, rank ${p.earned}`);
keys[D.enq.store] = { v: 2, by: Object.fromEntries(Array.from({ length: 13 }, (_, i) => ['c' + String(i + 1).padStart(2, '0'), { x: [60, 60, 60], f: [], k: [] }])) };
keys[D.seals.key] = ['s1', 's2', 's3', 's4', 's5', 's6', 's7'];
s.ep['le-dernier-depart'] = { done: true, t: 1 };
p = P(); console.log(`  + all 13 night cases at full XP (2,340), the 7 seals, one episode: ${p.encre} Encre (cases ${p.parts.enq}, seals ${p.parts.seal * D.pts.seal}, episode ${p.parts.episode * D.pts.episode})`);

console.log('\nminutes to each rank');
let prev = 0, worst = 0;
for (let r = 2; r <= N; r++) {
  const m = reached[r], gap = m == null ? null : m - prev;
  console.log(`  rank ${String(r).padStart(2)} at ${String(D.ranks[r - 1].at).padStart(5)} Encre: ${m == null ? 'not on the atlases alone' : `${m} min (+${gap})`}`);
  if (m != null) { worst = Math.max(worst, gap); prev = m; }
}

console.log('\nthe tuning rules');
ok(reached[2] === MIN_PER_DISTRICT, 'rank 2 on the first lesson');
ok(firstBookRank >= 3, `rank 3 or more by the end of the first book (rank ${firstBookRank} at ${firstBookMin} min)`);
ok(atlasOnly >= D.ranks[N - 1].at, `the top rank on the atlases alone (${atlasOnly} ≥ ${D.ranks[N - 1].at})`);
{ const one = D.pts.enqDiv ? Math.floor(180 / D.pts.enqDiv) : 0; ok(one >= D.pts.district * 0.5 && one <= D.pts.district * 1.5, `a night case (3 depths, 180 XP) is worth about a district (${one} Encre)`); }
ok(worst <= 180, `no rank more than 3 hours after the one before (longest gap ${worst} min)`);
{
  const s2 = C.blank(); s2.rank = 6;
  const q = C.compute(D, store({}), s2);
  ok(q.earned === 1 && q.rank === 6, 'a rank reached is kept when the progress is cleared');
}
process.exit(bad ? 1 : 0);
