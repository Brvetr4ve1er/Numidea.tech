/**
 * « Les enquêtes de nuit »: the rules, walked without a browser (npm run enquetes:lint).
 *
 * Loads the core of hub/enquetes.js (window.NightCases.core: no page, no DOM) and the data block of the built page
 * (hub/lanterne/enquetes.html, #enq-data), then plays the three depths three ways, with the numbers the reviewed
 * prototype's walk gave:
 *   perfect                          XP 60, 60, 60 · flames 3, 3, 3 · first try 6 of 6 each · the top title
 *   a first miss, a second miss, a return   XP 50, 50, 45 · flames 2, 2, 2
 *   rough                            XP 25, 50, 45 · flames 1, 2, 2 · three queued (two return, one answered wrong),
 *                                    an objection lost to the third hint, a one-try miss, a slot swap
 * and checks on the way: two tries, one on a two-sided item and on a return; hints one and two free, the third the
 * answer; the two earliest queued items return before the stamp; an objection never returns; flames light on first
 * tries 1, 3 and 5 and never dim; a replay never takes XP away and never farms it; a title needs its depths closed in
 * order; progress survives a reload; the engine's source makes no network call and names no key the build does not hold.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './site.mjs';
import { enqKeys, ENQ_PREFIX } from './lib/enquetes.mjs';

let asserts = 0, errs = 0;
const assert = (ok, what) => { asserts++; if (!ok) { errs++; console.error('  ✗ ' + what); } };
const src = readFileSync(join(ROOT, 'hub/enquetes.js'), 'utf8');
const html = readFileSync(join(ROOT, 'hub/lanterne/enquetes.html'), 'utf8');
const D = JSON.parse(/<script type="application\/json" id="enq-data">([\s\S]*?)<\/script>/.exec(html)[1]);
const win = {}; new Function('window', src)(win);
const core = win.NightCases.core;
/* the open cases' own files (hub/lanterne/enq/), registered as the page registers them once a case opens; case 1 too
   once it has moved out of the page */
const addOf = (f) => { let o = null; try { new Function('NightCases', readFileSync(join(ROOT, 'hub/lanterne/enq', f), 'utf8'))({ add: (x) => { o = x; } }); } catch (e) {} return o; };
const FILES = {};
for (const r of D.season) if (r.open && !(r.file === 'c01' && D.cases && D.cases.length)) { const o = addOf(`${r.file}.js`); if (o && o.data) FILES[r.file] = o.data; }
const mkCore = (DD, opt) => { const g = core.create(DD, opt); for (const id in FILES) g.register(id, FILES[id]); return g; };
const fl = (n) => (n >= 1 ? 1 : 0) + (n >= 3 ? 1 : 0) + (n >= 5 ? 1 : 0);
const sum = (a) => a.reduce((x, y) => x + y, 0);

/* ---------- the source: nothing leaves the page, and every key it names is one the build holds ---------- */
for (const rx of [/\bfetch\s*\(/, /XMLHttpRequest/, /sendBeacon/, /WebSocket/, /EventSource/, /\bimport\s*\(/, /new Image\b/, /\.innerHTML/, /insertAdjacentHTML/, /document\.write/, /\beval\s*\(/])
  assert(!rx.test(src), `hub/enquetes.js holds no ${rx.source}`);
assert((src.match(/localStorage\.(get|set)Item/g) || []).length === 2 && !/sessionStorage|document\.cookie/.test(src), 'one read and one write of one localStorage key, nothing else stored');
assert(/accesskey|\.key\s*===|keydown|keyup|keypress/i.test(src) === false, 'no single-key shortcut');
{
  const have = new Set(enqKeys(JSON.parse(readFileSync(join(ROOT, 'hub/src/lanterne/enquetes.json'), 'utf8'))).map(([k]) => k.slice(ENQ_PREFIX.length)));
  const named = new Set([...src.matchAll(/'((?:ui|chart|card|tool|sticker|season|v|rank|depth|ring|clair)\.[A-Za-z0-9.]+)'/g)].map((m) => m[1]).filter((k) => !k.endsWith('.')));
  const lost = [...named].filter((k) => !have.has(k));
  assert(lost.length === 0, `every literal key of the engine is in the build's list (${lost.join(', ')})`);
}

/* ---------- Arabic: every Latin run with a hyphen, a dot, a slash, an @, a colon or an ellipsis is set apart, whole ----------
   (an address, a handle, a file, a date: read right to left in pieces it shows its hyphen or its full stop on the wrong
   side). The engine's own split() is read; each such run of every Arabic string, the cases' and the dictionary's, must
   lie inside one piece it marks, and the view writes a dictionary string only through setText (no bare text node). */
{
  const split = win.NightCases.split, AR = [];
  const ar = JSON.parse(readFileSync(join(ROOT, 'hub/src/i18n/ar.json'), 'utf8')).lant.enq;
  const flat = (o, pre) => Object.entries(o).forEach(([k, v]) => (v && typeof v === 'object' ? flat(v, pre + k + '.') : AR.push([pre + k, v])));
  flat(ar, 'lant.enq.');
  for (const r of D.season) { const f = join(ROOT, 'hub/src/lanterne/enquetes', `${r.file}.ar.json`); if (existsSync(f)) for (const [k, v] of Object.entries(JSON.parse(readFileSync(f, 'utf8')))) AR.push([`${r.file} ${k}`, v]); }
  const RUN = /[@\/.]?[A-Za-z0-9_\u00C0-\u02AF\u1D00-\u1DBF]+(?:[-.\/@:\u2026]+[A-Za-z0-9_\u00C0-\u02AF\u1D00-\u1DBF]+)+\/?|[@\/.][A-Za-z0-9_]+\/?/g;
  const loose = []; let runs = 0;
  for (const [k, v] of AR) {
    const pcs = split(v); let at = 0; const spans = pcs.map((p) => { const x = [at, at + p.t.length, !!p.iso]; at += p.t.length; return x; });
    if (pcs.map((p) => p.t).join('') !== String(v)) loose.push(`${k}: split() changed the text`);
    for (const m of String(v).matchAll(RUN)) { runs++; const a = m.index, z = a + m[0].length; if (!spans.some(([s0, s1, iso]) => iso && s0 <= a && z <= s1)) loose.push(`${k}: « ${m[0]} »`); }
  }
  assert(loose.length === 0, `every Latin run with - . / @ : or … in an Arabic string is set apart whole (${runs} runs in ${AR.length} strings; not: ${loose.slice(0, 6).join(', ')})`);
  const bare = [...src.matchAll(/createTextNode\(([^()]*(?:\([^()]*\))?[^()]*)\)/g)].map((m) => m[1]).filter((x) => !['p.t', 'w', "' '"].includes(x.trim()));
  assert(bare.length === 0, `the view writes strings through setText, no bare text node (${bare.join(' | ')})`);
}

/* ---------- one case, by a plan: { stepId: 'retry' | 'reveal' | 'hint3' | 'swap', 'ret:stepId': 'wrong' } ---------- */
function play(g, depth, plan, open) {
  const s = g.state;
  open();
  const lv = g.level(depth), w = (x) => `${s.cid} depth ${depth} ${x}`;
  assert(s.screen === 'slip' && s.depth === depth, w('opens on its slip'));
  g.pick('x'); g.askHint(); assert(s.screen === 'slip', w('nothing is answered on the slip'));
  const bet = lv.steps[0].options[1];
  g.placeBet('nope'); assert(s.screen === 'slip', w('a bet is one of the three'));
  g.placeBet(bet);
  assert(s.screen === 'case' && s.bet === bet && g.position().k === 'ui.pos' && g.position().v.i === 1, w('the first scored answer comes right after the bet'));
  const exp = { xp: 0, first: 0, end: 0, hints: 0, queue: [], lost: [], bubbles: 0 };
  let guard = 0;
  while (s.screen === 'case' && guard++ < 40) {
    const st = g.cur(), at = w(st.id + (st.ret ? ' (return)' : ''));
    if (st.kind === 'stamp') {
      assert(g.position().k === 'ui.posStamp' && !g.feedback() && g.lawShown() === !!st.law, at + ': the stamp, with the law line as marked');
      g.askHint(); g.next(); assert(s.phase === 'ask', at + ': no hint, no way past without a stamp');
      g.pickStamp(st.options[2]); assert(s.phase === 'stamped' && s.stamp === st.options[2], at + ': stamped');
      g.pickStamp(st.options[0]); assert(s.stamp === st.options[2], at + ': a stamp cannot be changed');
      g.next(); continue;
    }
    const tks = g.targets(st), right = tks.filter((t) => t.right), wrong = tks.filter((t) => !t.right);
    const mode = st.ret ? (plan['ret:' + st.id] || 'right') : (plan[st.id] || 'right');
    assert(st.tag === (st.ret ? 'back' : lv.steps.find((x) => x.id === st.id).tag), at + ': its tag');
    if (st.tag === 'eye') assert(depth === 2 && !st.boss && tks.some((t) => t.caption), at + ': tagged « eye », and the eye flower\'s button is there (depth 2, a captioned part)');
    assert(g.lawShown() === !!st.law, at + ': the law line pinned as marked');
    assert(!!st.hint === !st.ret, at + ': a hint on a first meeting only');
    assert(g.captionsOn(st) === (!st.boss && (depth === 1 || (depth === 2 && s.eye))), at + ': captions by depth');
    if (depth === 2 && !st.boss && !s.eye && tks.some((t) => t.caption)) { const xp = s.xpRun; g.tapEye(); assert(g.captionsOn(st) && s.xpRun === xp, at + ': the eye flower shows captions, free'); }
    if (st.mix) assert(s.order.slice().sort().join() === tks.map((t) => t.id).sort().join(), at + ': shuffled, all there');
    const tap = (id) => { if (st.ring) { g.pick(id); assert(s.open === id && s.phase !== 'hit' && s.phase !== 'reveal' && s.ring === true, at + ': a first tap only opens the address'); g.choose(id); } else g.pick(id); };
    const place = (id, i) => { g.tapChip(id); assert(s.sel === id, at + ': chip ' + id + ' picked up'); g.tapSlot(i); };
    const doRight = () => { if (st.kind === 'build') st.answer.forEach((id, i) => { if (s.slots[i] !== id) place(id, i); }); else tap(right[0].id); };
    const doWrong = (k) => { if (st.kind === 'build') { st.answer.forEach((id, i) => { if (i > 0 && s.slots[i] !== id) place(id, i); }); place(wrong[k].id, 0); } else tap(wrong[k].id); return wrong[k]; };
    const hint = (n) => { for (let i = 0; i < n; i++) { g.askHint(); exp.hints++; if (i < 2) assert(s.hintN === i + 1 && s.phase === 'ask' && s.xpRun === exp.xp, at + ': hint ' + (i + 1) + ' is free'); } };
    const before = s.xpRun;
    if (mode === 'right') {
      if (!st.ret && plan.hintFree) hint(2);
      doRight();
      const gain = st.ret ? D.xp.retry : D.xp.first, f = g.feedback();
      assert(s.phase === 'hit' && s.xpRun === before + gain && f.seal && f.head === 'ui.right', at + ': right gives ' + gain);
      if (!st.ret) { exp.first++; assert(f.kuro === st.k + '.kuro' && (f.extra === 'ui.flame') === (fl(exp.first) > fl(exp.first - 1)), at + ': Kūro\'s own word, and a flame on first tries 1, 3 and 5'); }
      else assert(/^v\.kuro\.hit\.\d$/.test(f.kuro), at + ': a returned item gets one of his hit lines');
      assert(f.why === (st.kind === 'build' ? st.k + '.p.' + st.answer[st.answer.length - 1] + '.why' : right[0].k + '.why'), at + ': the right part\'s reason');
      exp.xp += gain; exp.end++;
    } else if (mode === 'retry' || mode === 'swap') {
      if (mode === 'swap') { place(st.answer[1], 0); place(st.answer[0], 1); if (st.answer.length > 2) place(st.answer[2], 2); assert(s.phase === 'miss' && s.wrongSlot && s.off.length === 0 && g.feedback().why === 'ui.wrongSlot', at + ': right chips in the wrong slots are a miss without a grey chip'); }
      else {
        const k = st.lawWith ? Math.max(0, wrong.findIndex((t) => st.lawWith.includes(t.id))) : 0, bad = doWrong(k), f = g.feedback();
        assert(s.phase === 'miss' && f.head === 'ui.notThis' && f.why === bad.k + '.why' && f.extra === 'ui.tryAgain' && !f.xp && /^v\.kuro\.miss\.\d$/.test(f.kuro), at + ': a first miss gives that part\'s reason and a second try');
        if (st.lawWith && st.lawWith.includes(bad.id)) assert(g.lawShown(), at + ': the law line shows with the reason of a marked part');
        assert(s.xpRun === before && s.off.includes(bad.id), at + ': nothing is taken; the part greys');
        const n = s.off.length; if (st.kind === 'build') { g.tapChip(bad.id); assert(s.sel === '', at + ': a greyed chip cannot be picked'); } else { g.pick(bad.id); assert(s.phase === 'miss' && s.off.length === n, at + ': a greyed part cannot be tapped again'); }
      }
      doRight();
      assert(s.phase === 'hit' && s.xpRun === before + D.xp.retry && /^v\.kuro\.hit\.\d$/.test(g.feedback().kuro), at + ': right after a miss gives ' + D.xp.retry);
      exp.xp += D.xp.retry; exp.end++;
    } else {
      if (mode === 'hint3') { hint(3); const f = g.feedback(); assert(f.head === st.k + '.hint.2' && f.lead === 'v.ratman.hint.2' && !f.kuro, at + ': the third hint is the written answer, with Ratman\'s lead'); }
      else { doWrong(0); if (st.maxTries > 1) { assert(s.phase === 'miss', at + ': a second try is left'); doWrong(1); } const f = g.feedback(); assert(!f.lead && f.head === 'ui.answer' && f.answer.every(Boolean), at + ': the answer is shown'); assert(st.maxTries === 1 ? (f.kuro === 'v.kuro.miss.0' || f.kuro === 'v.kuro.miss.3') : !f.kuro, at + ': Kūro speaks once'); }
      const f = g.feedback();
      assert(s.phase === 'reveal' && f.xp === 'ui.xp0' && s.xpRun === before, at + ': shown for 0 XP');
      if (st.kind === 'build') assert(s.slots.join() === st.answer.join(), at + ': the sentence is filled in');
      if (st.ret) { exp.lost.push(st.id); assert(f.extra === 'ui.noReturn', at + ': a return comes once'); }
      else if (st.boss) { exp.lost.push(st.id); assert(f.extra === 'ui.bossNoReturn', at + ': a missed objection does not return'); }
      else { exp.queue.push(st.id); if (exp.queue.length <= 2) assert(f.extra === 'v.pigeon.queued.0' && f.extraWho === 'pigeon', at + ': Techno Pigeon carries it back'); else { exp.lost.push(st.id); assert(f.extra === 'ui.thirdQueued', at + ': a third queued item stays answered'); } }
    }
    g.pick(tks[0].id); g.askHint(); g.tapChip(tks[0].id); assert(s.xpRun === exp.xp && s.hints === exp.hints, at + ': taps and hints are ignored once the answer is in');
    g.next();
    const bub = !st.ret && lv.bubbles.find((b) => b.after === st.id);
    if (bub) { exp.bubbles++; assert(s.phase === 'bubble' && g.bubbleFor(st).id === bub.id && !g.feedback(), at + ': a case bubble'); g.next(); } else assert(s.phase !== 'bubble', at + ': no bubble');
    if (s.screen === 'case' && s.si === 6) assert(s.plan.filter((p) => p.ret).map((p) => p.id).join() === exp.queue.slice(0, 2).join(), w('the two earliest queued items return, before the stamp'));
    assert(s.first === exp.first, at + ': first tries counted');
  }
  const L = s.last;
  assert(s.screen === 'end' && s.by[s.cid].k[depth - 1] && exp.bubbles === 2, w('ends on its end card, two bubbles heard'));
  assert(L.xp === exp.xp && L.first === exp.first && L.end === exp.end && L.hints === exp.hints && L.flames === fl(exp.first) && exp.xp <= D.xp.max, w(`end card: XP ${L.xp}, first ${L.first}, in the end ${L.end}, flames ${L.flames}`));
  assert(s.lost.join() === exp.lost.join(), w('what did not return: ' + s.lost.join()));
  return exp;
}

function walk(name, plans, want) {
  let kept = null;
  const g = mkCore(D, { random: () => 0.37, save: (p) => { kept = JSON.parse(JSON.stringify(p)); } }), s = g.state;
  assert(s.screen === 'door' && !s.back, name + ': the door');
  g.start(); assert(s.screen === 'stall' && s.talk && s.talk.who === 'yasser' && s.talk.k === 'v.yasser.greet.0', name + ': the stall opens on Yasser');
  for (const r of D.rings) { g.look(r.id); assert(s.sheet === r.id && !s.talk, name + ': the look sheet of ' + r.id); g.closeSheet(); }
  for (const c of D.crew) { g.tapCrew(c.id); assert(s.crew === c.id && s.talk.who === c.id, name + ': ' + c.id + ' gives one line'); }
  // leaving a case keeps what was earned and closes nothing
  g.openSlip(); assert(s.cid === 'c01' && s.depth === 1, name + ': nothing closed, tonight\'s slip is case 1 at depth 1');
  g.placeBet(g.level(1).steps[0].options[0]); g.pick(g.rightOf(g.cur()).id); g.toStall();
  assert(s.screen === 'stall' && g.totalXp() === 10 && g.closedCount() === 0, name + ': leaving keeps the 10 XP and closes nothing');
  const out = [];
  for (const depth of [1, 2, 3]) {
    out.push(play(g, depth, plans[depth - 1], () => g.openSlip('c01', depth)));
    assert(s.ts.c01 === depth && s.st.c01 === depth - 1, name + ': a sticker waits');
    g.toChart(); assert(g.stick('c01') && s.st.c01 === depth && s.ts.c01 === 0 && !g.stick('c01'), name + ': the sticker lands in state ' + depth + ', once');
    g.toStall();
  }
  assert(g.rec() && g.rec().c !== 'c01', name + ': case 1 closed, tonight\'s slip is another case');
  assert(out.map((e) => e.xp).join() === want.xp.join() && g.totalXp() === sum(want.xp), `${name}: XP by depth ${out.map((e) => e.xp).join()}, wanted ${want.xp.join()}`);
  assert(s.by.c01.f.join() === want.flames.join(), `${name}: flames by depth ${s.by.c01.f.join()}, wanted ${want.flames.join()}`);
  assert(out.map((e) => e.first).join() === want.first.join() && out.map((e) => e.end).join() === want.end.join(), `${name}: first ${out.map((e) => e.first).join()}, in the end ${out.map((e) => e.end).join()}`);
  assert(g.titleIndex() === want.title, `${name}: title ${g.titleIndex()}, wanted ${want.title}`);
  assert(g.tools().join() === 'eye,ring', name + ': the ring arrived');
  if (want.replay) {
    play(g, 1, {}, () => g.openSlip('c01', 1));
    const xp2 = g.totalXp();
    assert(s.by.c01.x[0] === 60 && xp2 === want.replay && s.ts.c01 === 0, `${name}: after a perfect replay of depth 1 the total is ${xp2}, wanted ${want.replay}; no new sticker`);
    play(g, 2, { fix: 'reveal', token: 'reveal' }, () => g.openSlip('c01', 2));
    assert(g.totalXp() === xp2 && s.by.c01.f.join() === [3, want.flames[1], want.flames[2]].join(), name + ': a worse replay takes nothing away, and no flame dims');
    g.toDoor(); assert(s.screen === 'door' && s.back, name + ': the door on return'); g.start(); assert(!s.talk, name + ': the first bubble is not repeated');
  }
  // a reload: what was saved, and only that
  const again = mkCore(D, { saved: kept });
  assert(JSON.stringify(again.progress()) === JSON.stringify(g.progress()), name + ': a reload keeps progress');
  return g;
}

walk('perfect', [{}, {}, { hintFree: true }], { xp: [60, 60, 60], flames: [3, 3, 3], first: [6, 6, 6], end: [6, 6, 6], title: 0 });
walk('first miss, second miss, return', [{ shield: 'retry', count: 'reveal' }, { fix: 'retry', diff: 'reveal' }, { embed: 'retry', tracker: 'reveal', shares: 'retry' }],
  { xp: [50, 50, 45], flames: [2, 2, 2], first: [4, 4, 3], end: [6, 6, 6], title: 0 });
walk('rough', [{ engine: 'reveal', note: 'reveal', advert: 'reveal', boss: 'hint3', 'ret:note': 'wrong' }, { scope: 'reveal', download: 'retry' }, { shares: 'swap', boss: 'reveal' }],
  { xp: [25, 50, 45], flames: [1, 2, 2], first: [2, 4, 4], end: [3, 6, 5], title: 0, replay: 155 });

/* ---------- a save of the prototype (v1, case 1 alone) is carried over with the title it had earned; a broken one is not trusted ---------- */
{
  const mk = (closed, xpBy) => mkCore(D, { saved: { v: 1, xpBy, flBy: [0, 0, 0], closed, stuck: 0, toStick: 0 } });
  assert(mk([false, false, true], [0, 0, 60]).titleIndex() === 0, 'an old save: depth 3 alone had turned no title');
  assert(mk([true, false, true], [60, 0, 60]).titleIndex() === 1, 'an old save: depths 1 and 3 had given the second title, and keep it');
  const old = mkCore(D, { saved: { v: 1, xpBy: [60, 60, 50], flBy: [3, 3, 2], closed: [true, true, true], stuck: 2, toStick: 3, back: true, list: true, ring: true } });
  assert(old.totalXp() === 170 && old.state.by.c01.k.every(Boolean) && old.state.st.c01 === 2 && old.state.ts.c01 === 3 && old.titleIndex() === 2 && old.state.back && old.state.list && old.state.ring,
    'an old save keeps its XP, its closed depths, its waiting sticker and the title it earned (Bookseller under the prototype\'s numbers)');
  assert(old.progress().v === 2 && mkCore(D, { saved: JSON.parse(JSON.stringify(old.progress())) }).titleIndex() === 2, 'carried over once, saved in the per-case shape, the title still kept');
  assert(mk([false, false, false], [0, 0, 0]).tools().join() === 'eye', 'the eye flower from the start, alone');
  for (const bad of [null, 'x', { v: 2 }, { v: 1, xpBy: [999, 0, 0], closed: 'yes', flBy: [9, 9, 9], stuck: 7, toStick: -1 }]) {
    const g = mkCore(D, { saved: bad });
    assert(g.totalXp() === 0 && g.closedCount() === 0 && g.state.st.c01 === 0 && g.state.screen === 'door', 'a broken save starts clean: ' + JSON.stringify(bad));
  }
}

/* ---------- the season: the open rows (the chart's file ids), each depth perfect and with every first answer missed ---------- */
const OPEN = D.season.filter((r) => r.open), LATER = D.season.filter((r) => !r.open).map((r) => r.file);
for (const r of OPEN) {
  if (r.file === 'c01' && D.cases && D.cases.length) continue;
  const o = addOf(`${r.file}.js`);
  assert(!!o && o.id === r.file && !!o.data && o.data.depths.length === r.depths, `${r.file}: hub/lanterne/enq/${r.file}.js adds its ${r.depths} depths`);
  for (const l of ['fr', 'en', 'ar']) { const x = addOf(`${r.file}.${l}.js`); assert(!!x && x.id === r.file && x.lang === l && Object.keys(x.strings || {}).length > 100, `${r.file}: hub/lanterne/enq/${r.file}.${l}.js adds its ${l} strings`); }
}
for (const id of LATER) for (const f of [`${id}.js`, `${id}.fr.js`, `${id}.en.js`, `${id}.ar.js`]) assert(!existsSync(join(ROOT, 'hub/lanterne/enq', f)), `${id}: nothing published for a row that is not open (${f})`);
assert(D.season.length === 13 && OPEN.length === 13 && OPEN.map((r) => r.file).join() === D.season.map((r) => r.file).join(), 'thirteen rows; this release opens all thirteen (c01 to c13, 2026-11-24)');
/* the loader: script elements from the case's id and the language, under hub/lanterne/enq/, nothing else */
assert((src.match(/'enq\//g) || []).length === 1 && /x\.src = 'enq\/' \+ f \+ '\.js' \+ VER/.test(src) && /want\.push\(id\)/.test(src) && /want\.push\(id \+ '\.' \+ lang\)/.test(src), 'the loader adds enq/<id>.js and enq/<id>.<lang>.js, built from an open row\'s id');
const mkAll = () => { const g = mkCore(D, { random: () => 0.37 }); g.start(); return g; };
let depthsPlayed = 0;
for (const r of OPEN) for (let d = 1; d <= r.depths; d++) {
  const g1 = mkAll(), e1 = play(g1, d, {}, () => assert(g1.openSlip(r.file, d), `${r.file} depth ${d}: opens`));
  assert(e1.xp === 60 && e1.first === 6 && g1.state.last.flames === 3 && g1.state.by[r.file].x[d - 1] === 60, `${r.file} depth ${d}: perfect, 60 XP and three flames`);
  const g2 = mkAll(), plan = {};
  const e2 = play(g2, d, plan, () => { g2.openSlip(r.file, d); for (const st of g2.level(d).steps) if (st.kind !== 'bet' && st.kind !== 'stamp') plan[st.id] = st.tries === 1 ? 'reveal' : 'retry'; });
  assert(e2.first === 0 && g2.state.last.flames === 0 && e2.xp < 60 && e2.end >= 5, `${r.file} depth ${d}: every first answer missed, ${e2.xp} XP, no flame, ${e2.end} of 6 in the end`);
  depthsPlayed++;
}
/* tonight's slip, walked from nothing to everything closed: never a row that is not open */
{
  const g = mkAll(), s = g.state, seq = [];
  for (let i = 0; i < 60; i++) {
    const r = g.rec(); if (!r) break;
    assert(!LATER.includes(r.c) && !!g.row(r.c), `tonight's slip names an open row (${r.c})`);
    seq.push(`${r.c}.${r.d}`);
    play(g, r.d, {}, () => g.openSlip());
    g.toChart(); g.stick(r.c); g.toStall();
  }
  /* the season plan's section 5, worked by hand for thirteen open cases */
  const want = 'c01.1 c02.1 c01.2 c03.1 c01.3 c04.1 c02.2 c05.1 c02.3 c06.1 c03.2 c07.1 c03.3 c08.1 c04.2 c09.1 c04.3 c10.1 c05.2 c11.1 c05.3 c12.1 c06.2 c13.1 c06.3 '
    + 'c07.2 c07.3 c08.2 c08.3 c09.2 c09.3 c10.2 c10.3 c11.2 c11.3 c12.2 c12.3 c13.2 c13.3';
  assert(seq.join(' ') === want, `tonight's slip in order: ${seq.join(' ')}, wanted ${want}`);
  assert(!g.rec() && g.closedCount() === 39 && g.totalXp() === 2340, 'all closed: no new slip, 39 depths, 2,340 XP');
  g.openSlip(); assert(s.screen === 'chart', 'with no slip left, the goal line opens the chart');
  /* titles: the season's numbers; with thirteen open, Bookseller is the top reachable (no depth 4 is written), and the
     card can say what it cannot reach */
  assert(D.titles.map((t) => `${t.xp}/${t.cases}/${t.at}`).join() === '0/0/0,600/3/2,1500/3/3,2800/3/4,4500/3/5', 'titles: Clerk 600 and 3 cases at depth 2, Bookseller 1,500 and 3 at depth 3, Lamplighter 2,800 and 3 at depth 4, Keeper 4,500 and 3 at depth 5');
  assert(g.titleIndex() === 2 && g.reach(1) && g.reach(2) && !g.reach(3) && !g.reach(4), 'all thirteen open cases closed: Bookseller; Lamplighter and Keeper are out of reach of what is open');
  assert(Object.keys(s.st).every((id) => s.st[id] === 3), 'every open case\'s sticker landed in state 3');
  const back = mkCore(D, { saved: JSON.parse(JSON.stringify(g.progress())) });
  assert(back.totalXp() === 2340 && back.titleIndex() === 2 && !back.rec(), 'a reload keeps the season\'s progress');
}
{
  const g = mkAll();
  g.openSlip('c01', 1); assert(g.state.cid === 'c01', 'a case opens by its id');
  assert(!core.create(D, {}).openSlip('c02', 1), 'a case whose files are not in does not open');
  const xpSave = { v: 2, by: { c01: { x: [60, 60, 60], f: [3, 3, 3], k: [true, true, true] }, c02: { x: [60, 60, 0], f: [3, 3, 0], k: [true, true, false] }, c03: { x: [60, 60, 0], f: [3, 3, 0], k: [true, true, false] }, c04: { x: [60, 60, 0], f: [3, 3, 0], k: [true, true, false] }, c05: { x: [60, 0, 0], f: [3, 0, 0], k: [true, false, false] } }, st: {}, ts: {}, ti: 0 };
  const c = mkCore(D, { saved: xpSave });
  assert(c.titleIndex() === 1 && c.totalXp() === 600, '600 XP and three cases closed at depth 2: Clerk');
  const d2 = JSON.parse(JSON.stringify(xpSave)); d2.by.c03.k[1] = false; d2.by.c04.k[1] = false;
  assert(mkCore(D, { saved: d2 }).titleIndex() === 0, 'two cases at depth 2 turn no title, whatever the XP');
  d2.ti = 1; assert(mkCore(D, { saved: d2 }).titleIndex() === 1, 'an earned title is never taken back');
}
console.log(errs ? `✗ enquetes-lint: ${errs} of ${asserts} checks failed` : `✓ enquetes-lint: ${asserts} checks; three walks of three depths (perfect 60/60/60, misses 50/50/45, rough 25/50/45), replay, reload, titles, no network call; the season: ${depthsPlayed} depths of the open cases perfect and missed, tonight's slip from nothing to all closed, the season's titles, an old save carried over`);
process.exit(errs ? 1 : 0);
