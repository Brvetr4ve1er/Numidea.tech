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
import { readFileSync } from 'node:fs';
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

/* ---------- one case, by a plan: { stepId: 'retry' | 'reveal' | 'hint3' | 'swap', 'ret:stepId': 'wrong' } ---------- */
function play(g, depth, plan, open) {
  const s = g.state, lv = g.level(depth), w = (x) => `depth ${depth} ${x}`;
  open();
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
        if (st.lawWith) assert(g.lawShown(), at + ': the law line shows with the reason of a marked part');
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
  assert(s.screen === 'end' && s.closed[depth - 1] && exp.bubbles === 2, w('ends on its end card, two bubbles heard'));
  assert(L.xp === exp.xp && L.first === exp.first && L.end === exp.end && L.hints === exp.hints && L.flames === fl(exp.first) && exp.xp <= D.xp.max, w(`end card: XP ${L.xp}, first ${L.first}, in the end ${L.end}, flames ${L.flames}`));
  assert(s.lost.join() === exp.lost.join(), w('what did not return: ' + s.lost.join()));
  return exp;
}

function walk(name, plans, want) {
  let kept = null;
  const g = core.create(D, { random: () => 0.37, save: (p) => { kept = JSON.parse(JSON.stringify(p)); } }), s = g.state;
  assert(s.screen === 'door' && !s.back, name + ': the door');
  g.start(); assert(s.screen === 'stall' && s.talk && s.talk.who === 'yasser' && s.talk.k === 'v.yasser.greet.0', name + ': the stall opens on Yasser');
  for (const r of D.rings) { g.look(r.id); assert(s.sheet === r.id && !s.talk, name + ': the look sheet of ' + r.id); g.closeSheet(); }
  for (const c of D.crew) { g.tapCrew(c.id); assert(s.crew === c.id && s.talk.who === c.id, name + ': ' + c.id + ' gives one line'); }
  // leaving a case keeps what was earned and closes nothing
  g.openSlip(); g.placeBet(g.level(1).steps[0].options[0]); g.pick(g.rightOf(g.cur()).id); g.toStall();
  assert(s.screen === 'stall' && g.totalXp() === 10 && g.closedCount() === 0, name + ': leaving keeps the 10 XP and closes nothing');
  const out = [];
  for (const depth of [1, 2, 3]) {
    out.push(play(g, depth, plans[depth - 1], () => { assert(g.recDepth() === depth, name + ': tonight\'s slip is depth ' + depth); g.openSlip(); }));
    assert(s.toStick === depth && s.stuck === depth - 1, name + ': a sticker waits');
    g.toChart(); assert(g.stick() && s.stuck === depth && s.toStick === 0 && !g.stick(), name + ': the sticker lands in state ' + depth + ', once');
    g.toStall();
  }
  assert(g.recDepth() === 0, name + ': no new slip after depth 3'); g.openSlip(); assert(s.screen === 'card', name + ': the goal line then opens the card');
  assert(out.map((e) => e.xp).join() === want.xp.join() && g.totalXp() === sum(want.xp), `${name}: XP by depth ${out.map((e) => e.xp).join()}, wanted ${want.xp.join()}`);
  assert(s.flBy.join() === want.flames.join(), `${name}: flames by depth ${s.flBy.join()}, wanted ${want.flames.join()}`);
  assert(out.map((e) => e.first).join() === want.first.join() && out.map((e) => e.end).join() === want.end.join(), `${name}: first ${out.map((e) => e.first).join()}, in the end ${out.map((e) => e.end).join()}`);
  assert(g.titleIndex() === want.title, `${name}: title ${g.titleIndex()}, wanted ${want.title}`);
  assert(g.tools().join() === 'eye,ring', name + ': the ring arrived');
  if (want.replay) {
    play(g, 1, {}, () => g.openSlip(1));
    const xp2 = g.totalXp();
    assert(s.xpBy[0] === 60 && xp2 === want.replay && s.toStick === 0, `${name}: after a perfect replay of depth 1 the total is ${xp2}, wanted ${want.replay}; no new sticker`);
    play(g, 2, { fix: 'reveal', token: 'reveal' }, () => g.openSlip(2));
    assert(g.totalXp() === xp2 && s.flBy.join() === [3, want.flames[1], want.flames[2]].join(), name + ': a worse replay takes nothing away, and no flame dims');
    g.toDoor(); assert(s.screen === 'door' && s.back, name + ': the door on return'); g.start(); assert(!s.talk, name + ': the first bubble is not repeated');
  }
  // a reload: what was saved, and only that
  const again = core.create(D, { saved: kept });
  assert(JSON.stringify(again.progress()) === JSON.stringify(g.progress()), name + ': a reload keeps progress');
  return g;
}

walk('perfect', [{}, {}, { hintFree: true }], { xp: [60, 60, 60], flames: [3, 3, 3], first: [6, 6, 6], end: [6, 6, 6], title: 3 });
walk('first miss, second miss, return', [{ shield: 'retry', count: 'reveal' }, { fix: 'retry', diff: 'reveal' }, { embed: 'retry', tracker: 'reveal', shares: 'retry' }],
  { xp: [50, 50, 45], flames: [2, 2, 2], first: [4, 4, 3], end: [6, 6, 6], title: 2 });
walk('rough', [{ engine: 'reveal', note: 'reveal', advert: 'reveal', boss: 'hint3', 'ret:note': 'wrong' }, { scope: 'reveal', download: 'retry' }, { shares: 'swap', boss: 'reveal' }],
  { xp: [25, 50, 45], flames: [1, 2, 2], first: [2, 4, 4], end: [3, 6, 5], title: 2, replay: 155 });

/* ---------- titles follow the depths closed in order; a broken save is not trusted ---------- */
{
  const mk = (closed, xpBy) => core.create(D, { saved: { v: 1, xpBy, flBy: [0, 0, 0], closed, stuck: 0, toStick: 0 } });
  assert(mk([false, false, true], [0, 0, 60]).titleIndex() === 0, 'closing depth 3 alone turns no title');
  assert(mk([true, false, true], [60, 0, 60]).titleIndex() === 1, 'depths 1 and 3 give the second title, not the third');
  assert(mk([false, false, false], [0, 0, 0]).tools().join() === 'eye', 'the eye flower from the start, alone');
  for (const bad of [null, 'x', { v: 2 }, { v: 1, xpBy: [999, 0, 0], closed: 'yes', flBy: [9, 9, 9], stuck: 7, toStick: -1 }]) {
    const g = core.create(D, { saved: bad });
    assert(g.totalXp() === 0 && g.closedCount() === 0 && g.state.stuck === 0 && g.state.screen === 'door', 'a broken save starts clean: ' + JSON.stringify(bad));
  }
}
console.log(errs ? `✗ enquetes-lint: ${errs} of ${asserts} checks failed` : `✓ enquetes-lint: ${asserts} checks; three walks of three depths (perfect 60/60/60, misses 50/50/45, rough 25/50/45), replay, reload, titles, no network call`);
process.exit(errs ? 1 : 0);
