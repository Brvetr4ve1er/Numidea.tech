/**
 * « Les enquêtes de nuit », played in a real browser (npm run enquetes:play; CHROMIUM_PATH as the other browser gates).
 *
 * Depth 1, twelve runs: the perfect path and a path with misses (a first miss on a part that brings the law line, a
 * second miss and its return) × 390 and 1440 px × fr, en, ar. The answers are read from the page's own data block,
 * never typed here. Each run holds: the end card's numbers equal the core's for the same path; the sticker lands on
 * row 1; a reload keeps progress; no horizontal overflow on any screen; controls 44 px or more, rings and answers 56;
 * dir="rtl" in Arabic; the law band on the steps marked for it; no console error; nothing requested once the page has
 * loaded; no audio context while the radio is off; after a first miss the reason is on screen without a scroll by hand.
 * No text under 14 px (the page's floor: BRAND.md, « The night cases »; SPEC asked for 16).
 * Depths 2 and 3, four runs (each depth perfect and with every first answer missed, two of them shown and carried
 * back): the same moves go to the core in Node and to the page, so the core says which step is up; the page must show
 * that step's prompt, its chips on a built sentence, the law band as marked, and the core's numbers on the end card.
 * Three more runs: reduced motion (nothing animates), the list view by keyboard alone (the first Tab after a question,
 * and after a first miss, lands on an answer), and scripts disabled (« Le dossier, en clair »).
 * A screenshot of every screen goes to ENQ_SHOTS (a folder) when it is set. Every wait has a timeout.
 */
import { readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { serve, launch, isStubbed } from './lib/serve.mjs';
import { ROOT } from './site.mjs';

const SHOTS = process.env.ENQ_SHOTS || '';
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
const errs = []; let asserts = 0;
const assert = (ok, what) => { asserts++; if (!ok) errs.push(what); };
const win = {}; new Function('window', readFileSync(join(ROOT, 'hub/enquetes.js'), 'utf8'))(win);
const fillIn = (s, v) => String(s).replace(/\{(\w+)\}/g, (m, k) => (v && v[k] != null ? v[k] : m));
const T0 = 12000;

const srv = await serve(undefined, { compress: true });
const browser = await launch();
const URL0 = (lang) => `${srv.base}/hub/lanterne/enquetes.html${lang === 'fr' ? '' : '?lang=' + lang}`;

/* the same path through the core alone: what the end card must print */
function expected(D, path) {
  const g = win.NightCases.core.create(D, { random: () => 0.5 }), s = g.state;
  g.start(); g.openSlip(); g.placeBet(g.level(1).steps[0].options[1]);
  let guard = 0;
  while (s.screen === 'case' && guard++ < 30) {
    const st = g.cur();
    if (st.kind === 'stamp') { g.pickStamp(st.options[2]); g.next(); continue; }
    const tks = g.targets(st), right = tks.find((t) => t.right), wrong = tks.filter((t) => !t.right);
    const m = st.ret ? 'right' : (path[st.id] || 'right');
    if (m === 'retry') g.pick((wrong.find((t) => (st.lawWith || []).includes(t.id)) || wrong[0]).id);
    if (m === 'reveal') { g.pick(wrong[0].id); g.pick(wrong[1].id); } else g.pick(right.id);
    g.next(); if (s.phase === 'bubble') g.next();
  }
  return s.last;
}

async function open(ctx, lang) {
  const p = await ctx.newPage(), log = { console: [], late: [], seen: new Set(), loaded: false };
  await p.addInitScript(() => {
    window.__ac = 0;
    for (const n of ['AudioContext', 'webkitAudioContext']) { const O = window[n]; if (!O) continue; window[n] = function () { window.__ac++; return new O(); }; }
  });
  p.on('console', (m) => { if (m.type() === 'error') log.console.push(m.text()); });
  p.on('pageerror', (e) => log.console.push(String(e)));
  p.on('request', (r) => { const u = r.url().split('?')[0]; if (isStubbed(r.url()) || u.startsWith('data:')) return;
    if (r.resourceType() !== 'image' && /(\/|\.html)$/.test(u)) return;   // assets/carry.js warms the page behind a focused link: the site's own, not the game's
    if (log.loaded && !log.seen.has(u)) log.late.push(u.replace(srv.base, '')); log.seen.add(u); });
  await p.goto(URL0(lang), { waitUntil: 'load', timeout: 20000 });
  await p.waitForSelector('html[data-enq-ready]', { timeout: T0 });
  await p.waitForLoadState('networkidle', { timeout: T0 }).catch(() => {});
  log.loaded = true;
  return { p, log };
}
const dict = (p) => p.evaluate(() => { const l = document.documentElement.lang, fr = JSON.parse(document.getElementById('hub-fr').textContent); return Object.assign({}, fr, (window.HUB_I18N && window.HUB_I18N[l]) || {}); });

/* what every screen is held to */
async function screenOk(p, where, name, tag) {
  await p.waitForTimeout(320);
  const r = await p.evaluate(() => {
    const vis = (n) => { const b = n.getBoundingClientRect(); return b.width > 0 && b.height > 0 && getComputedStyle(n).visibility !== 'hidden'; };
    const small = [], app = document.getElementById('enq');
    for (const b of app.querySelectorAll('button')) {
      if (!vis(b)) continue;
      const q = b.getBoundingClientRect(), min = b.matches('.enq-ring,.enq-part,.enq-verdict,.enq-choose,.enq-go,.enq-next') ? 56 : 44;
      if (q.height < min - 0.5 || q.width < Math.min(min, 44) - 0.5 || (b.matches('.enq-ring') && q.width < 55.5)) small.push(`${b.className.split(' ')[0]} ${Math.round(q.width)}×${Math.round(q.height)} (${min})`);
    }
    const tiny = [...app.querySelectorAll('*')].filter((n) => vis(n) && [...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()) && parseFloat(getComputedStyle(n).fontSize) < 14).map((n) => n.className);
    return { sw: document.documentElement.scrollWidth, iw: innerWidth, small, tiny, screen: app.getAttribute('data-screen'), anim: document.getAnimations ? document.getAnimations().filter((a) => a.playState === 'running').length : 0 };
  });
  assert(r.sw <= r.iw, `${where} ${name}: the page is ${r.sw}px wide on a ${r.iw}px screen`);
  assert(r.small.length === 0, `${where} ${name}: targets too small: ${r.small.slice(0, 4).join(', ')}`);
  assert(r.tiny.length === 0, `${where} ${name}: text under 14 px: ${r.tiny.slice(0, 3).join(', ')}`);
  if (SHOTS && tag) await p.locator('#enq').screenshot({ path: join(SHOTS, `${tag}-${name}.png`), timeout: T0 }).catch(() => {});
  return r;
}

/* after a first miss: the reason sits on screen (nobody scrolls to find it) and the keyboard is back on the question */
async function missOk(p, where, name) {
  const r = await p.evaluate(() => { const f = document.querySelector('#enq .enq-fb'), a = document.activeElement, b = f ? f.getBoundingClientRect() : null;
    return { fb: !!b && b.top >= -1 && b.bottom <= innerHeight + 1, at: b ? Math.round(b.top) + '..' + Math.round(b.bottom) + ' of ' + innerHeight : 'none', prompt: !!a && a.classList.contains('enq-prompt') }; });
  assert(r.fb, `${where} ${name}: after a first miss the reason is off screen (${r.at})`);
  assert(r.prompt, `${where} ${name}: after a first miss focus is back on the question`);
}
async function tabToAnswer(p, where, name, when) {
  await p.keyboard.press('Tab');
  const at = await p.evaluate(() => { const a = document.activeElement; return a ? (a.matches('.enq-part,.enq-chip,.enq-slot') ? '' : (a.getAttribute('data-f') || a.className || a.tagName)) : 'nothing'; });
  assert(at === '', `${where} ${name}: the first Tab ${when} lands on « ${at} », not on an answer`);
}

async function run(lang, w, pathName, path, opt = {}) {
  const where = `${lang} ${w} ${pathName}`, tag = `${lang}-${w}-${pathName}`;
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 500 ? 844 : 900 }, reducedMotion: opt.reduce ? 'reduce' : 'no-preference' });
  try {
    const { p, log } = await open(ctx, lang);
    const D = await p.evaluate(() => JSON.parse(document.getElementById('enq-data').textContent)), L = await dict(p);
    const T = (k, v) => fillIn(L['lant.enq.' + k], v), law = L[D.law];
    const press = opt.keys
      ? async (f) => { for (let i = 0; i < 80; i++) { if (await p.evaluate((x) => { const a = document.activeElement; return !!a && a.getAttribute('data-f') === x && a.tagName === 'BUTTON'; }, f)) { await p.keyboard.press('Enter'); return; } await p.keyboard.press('Tab'); } assert(false, `${where}: Tab never reached ${f}`); }
      : (f) => p.locator(`#enq [data-f="${f}"]`).first().click({ timeout: T0 });
    assert((await p.getAttribute('html', 'dir')) === (lang === 'ar' ? 'rtl' : 'ltr') && (await p.getAttribute('html', 'lang')) === lang, `${where}: lang and dir`);
    assert(await p.locator('[data-enq-clair]').isHidden() && await p.locator('#enq').isVisible(), `${where}: the game shows, the plain text is put away`);
    await screenOk(p, where, 'door', tag);
    assert((await p.locator('#enq .enq-law').first().textContent()) === law, `${where}: the standing sentence is on the door, word for word`);
    if (opt.keys) { await press('list'); assert(await p.locator('#enq.is-list').count() === 1 && await p.locator('.enq-art').isHidden(), `${where}: the list view drops the painting`); }
    await press('go'); await screenOk(p, where, 'stall', tag);
    if (!opt.keys) {
      assert(await p.locator('.enq-ring').count() === D.rings.length && D.rings.length <= 4, `${where}: the painting's rings`);
      await press('ring-book'); await screenOk(p, where, 'sheet', tag); assert((await p.locator('.enq-talk__t').textContent()) === T('ring.book.line'), `${where}: a ring only looks`);
      await press('crew-yasser'); await screenOk(p, where, 'crew', tag);
    } else assert(await p.locator('.enq-rings-list button').count() === D.rings.length, `${where}: the rings are buttons in the list view`);
    await press('goal'); await screenOk(p, where, 'slip', tag);
    const c = D.cases[0], bet = c.steps[0].options[1];
    await press('opt-' + bet);
    let guard = 0;
    while (guard++ < 30) {
      const pos = await p.locator('.enq-bar__pos').textContent({ timeout: T0 }).catch(() => null);
      if (pos == null) break;
      const st = await p.evaluate((dd) => {   // which step is on screen: read from the prompt, through the dictionary
        const l = document.documentElement.lang, fr = JSON.parse(document.getElementById('hub-fr').textContent), Lx = Object.assign({}, fr, (window.HUB_I18N && window.HUB_I18N[l]) || {});
        const pr = document.querySelector('#enq .enq-prompt').textContent, c0 = dd.cases[0];
        for (const s of c0.steps) { const k = 'lant.enq.c.' + c0.key + '.' + s.id; if (Lx[k + '.prompt'] === pr) return { s, ret: false }; if (s.return && Lx[k + '.r.prompt'] === pr) return { s: Object.assign({}, s.return, { id: s.id }), ret: true }; }
        return null;
      }, D);
      if (!st) { assert(false, `${where}: a prompt no step owns`); break; }
      const s = st.s, name = s.id + (st.ret ? '-return' : '');
      const band = () => p.locator('#enq .enq-law--band').count();
      await screenOk(p, where, name, tag);
      assert((await band() === 1) === !!s.law, `${where} ${name}: the law band as marked (${!!s.law})`);
      if (opt.keys && s.kind !== 'stamp') {
        assert(await p.evaluate(() => { const a = document.activeElement; return !!a && a.classList.contains('enq-prompt'); }), `${where} ${name}: a step opens with focus on its question`);
        await tabToAnswer(p, where, name, 'after the question');
      }
      if (s.kind === 'stamp') {
        await press('opt-' + s.options[2]); await screenOk(p, where, 'stamped', tag);
        assert((await p.locator('.enq-result__l').textContent()) === T('ui.result', { bet: T('ui.opt.' + bet), stamp: T('ui.opt.' + s.options[2]), checked: T('ui.opt.' + s.checked) }), `${where}: the two stamps and the checked verdict`);
        assert((await p.locator('.enq-result__u').textContent()) === T('ui.under'), `${where}: named as an example, not a recommendation`);
        await press('next'); break;
      }
      const wrong = s.parts.filter((t) => t.id !== s.answer), m = st.ret ? 'right' : (path[s.id] || 'right');
      if (m === 'retry') {
        const bad = wrong.find((t) => (s.lawWith || []).includes(t.id)) || wrong[0];
        await press('p-' + bad.id); await screenOk(p, where, name + '-miss', tag);
        assert((await band() === 1) === !!(s.law || (s.lawWith || []).includes(bad.id)), `${where} ${name}: the law line comes with the reason of a marked part`);
        assert(await p.locator(`#enq [data-f="p-${bad.id}"]`).isDisabled() && (await p.locator('.enq-fb__head').textContent()) === T('ui.notThis'), `${where} ${name}: a first miss greys the part and leaves a second try`);
        assert((await p.locator('#enq-live').textContent()).includes(T('ui.notThis')), `${where} ${name}: the verdict is said in the live region`);
        await missOk(p, where, name);
        if (opt.keys) await tabToAnswer(p, where, name, 'after a first miss');
      }
      if (m === 'reveal') { await press('p-' + wrong[0].id); await press('p-' + wrong[1].id); await screenOk(p, where, name + '-shown', tag); assert((await p.locator('.enq-xp').textContent()) === T('ui.xp0'), `${where} ${name}: shown for 0 XP`); }
      else { await press('p-' + s.answer); await screenOk(p, where, name + '-hit', tag); assert(await p.locator('.enq-seal').count() === 1 && await p.locator(`#enq [data-f="p-${s.answer}"][data-mode="hit"]`).count() === 1, `${where} ${name}: the seal lands on a right answer`); }
      if (opt.reduce) assert((await p.evaluate(() => document.getAnimations().length)) === 0, `${where} ${name}: nothing animates under reduced motion`);
      assert(await p.evaluate(() => { const a = document.activeElement; return !!a && a.getAttribute('data-f') === 'next'; }), `${where} ${name}: focus is on Continue after an answer`);
      await press('next');
      if (await p.locator('.enq-box--bubble').count()) { await screenOk(p, where, name + '-bubble', tag); await press('next'); }
      else assert(await p.evaluate(() => { const a = document.activeElement; return !!a && a.classList.contains('enq-prompt'); }), `${where} ${name}: focus moves to the next prompt`);
    }
    // the end card: the core's numbers for the same path
    const E = expected(D, path);
    await screenOk(p, where, 'end', tag);
    const lines = await p.locator('.enq-endcard__l').allTextContents();
    assert(lines[0] === T('ui.end.score', { first: E.first, end: E.end }) && lines[1] === T('ui.end.flames', { flames: E.flames, hints: E.hints }), `${where}: end card « ${lines.join(' / ')} », the core says first ${E.first}, end ${E.end}, flames ${E.flames}`);
    assert((await p.locator('.enq-endcard__xp').textContent()) === T('ui.end.xpFirst', { n: E.xp }) && (await p.locator('.enq-bar__xp').textContent()) === T('ui.xp', { n: E.xp }), `${where}: ${E.xp} XP on the card and in the bar`);
    assert(await p.locator('.enq-endcard .enq-flame.is-lit').count() === E.flames, `${where}: ${E.flames} flames lit`);
    assert(!/review|révision|مراجعة/i.test(await p.locator('.enq-endcard').textContent()), `${where}: the end card promises no review`);
    await press('stick'); await screenOk(p, where, 'chart-waiting', tag);
    assert(await p.locator('.enq-rows .enq-row2').count() === 13 && await p.locator('.enq-row2__soon').count() === 12, `${where}: thirteen rows, twelve not written yet`);
    assert(await p.locator('.enq-row2:not(.enq-row2--mine) a, .enq-row2:not(.enq-row2--mine) button').count() === 0, `${where}: an unwritten row links nowhere`);
    await press('row'); await screenOk(p, where, 'chart-landed', tag);
    assert(await p.locator('.enq-rows .enq-row2').first().locator('.enq-sticker[data-state="1"]').count() === 1, `${where}: the sticker lands on row 1`);
    await press('sback'); await screenOk(p, where, 'sticker-back', tag);
    assert((await p.locator('.enq-back .enq-law').textContent()) === law && await p.locator('.enq-back .enq-src a').count() === D.sticker.src.length, `${where}: the sticker's back carries its sources and the law line`);
    await press('back'); await screenOk(p, where, 'stall-lit', tag);
    assert(await p.locator('.enq-art.is-lit').count() === 1, `${where}: the lantern is lit after a closed case`);
    if (!opt.keys) { await press('ring-kuro'); await press('sheet-go'); await screenOk(p, where, 'card', tag); assert(await p.locator('.enq-ladder__r').count() === 3, `${where}: the card lists the three written depths`); }
    // a reload keeps progress
    log.loaded = false;
    await p.reload({ waitUntil: 'load', timeout: 20000 }); await p.waitForSelector('html[data-enq-ready]', { timeout: T0 });
    await p.waitForLoadState('networkidle', { timeout: T0 }).catch(() => {}); log.loaded = true;
    assert((await p.locator('#enq [data-f="go"]').textContent()) === T('ui.door.open'), `${where}: after a reload the door says « ${T('ui.door.open')} »`);
    await p.locator('#enq [data-f="go"]').click({ timeout: T0 });
    assert((await p.locator('.enq-bar__xp').textContent()) === T('ui.xp', { n: E.xp }) && (await p.locator('.enq-bar__rank').textContent()) === T('rank.' + (E.xp >= 60 ? 1 : 0)), `${where}: a reload keeps the XP and the title`);
    assert(log.console.length === 0, `${where}: console: ${log.console.slice(0, 3).join(' | ')}`);
    assert(log.late.length === 0, `${where}: requested after load: ${[...new Set(log.late)].slice(0, 4).join(', ')}`);
    assert((await p.evaluate(() => window.__ac)) === 0, `${where}: an audio context was made with the radio off`);
  } catch (e) { assert(false, `${where}: ${String(e.message || e).split('\n')[0]}`); }
  await ctx.close();
}

/* ---- depths 2 and 3 ---- */
/* the answers a step takes, each a list of moves; the same list goes to the core and to the page */
function movesFor(g, st, how) {
  const tks = g.targets(st);
  if (st.kind === 'build') {
    const ans = st.answer, place = (arr, only) => arr.flatMap((id, i) => (only && !only(i) ? [] : [['chip', id], ['slot', i]]));
    if (how === 'right') return [place(ans)];
    const spare = tks.find((x) => !x.right), arr = ans.slice();
    if (spare) arr[0] = spare.id; else { arr[0] = ans[1]; arr[1] = ans[0]; }
    return [place(arr), place(ans, (i) => arr[i] !== ans[i])];
  }
  const one = (id) => (st.ring ? [['pick', id], ['choose', id]] : [['pick', id]]);
  const right = tks.find((x) => x.right), wrong = tks.filter((x) => !x.right), first = wrong.find((x) => (st.lawWith || []).includes(x.id)) || wrong[0];
  if (how === 'right') return [one(right.id)];
  if (how === 'reveal') return [one(first.id), one(wrong.find((x) => x !== first).id)];
  return [one(first.id), one(right.id)];
}
const CORE = { pick: 'pick', choose: 'choose', chip: 'tapChip', slot: 'tapSlot' };
const DATA_F = { pick: (x) => 'p-' + x, choose: () => 'choose', chip: (x) => 'chip-' + x, slot: (x) => 'slot-' + x };

async function runDeep(lang, w, depth, mode) {
  const where = `${lang} ${w} depth ${depth} ${mode}`, tag = `${lang}-${w}-d${depth}-${mode}`;
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 500 ? 844 : 900 } });
  try {
    const { p, log } = await open(ctx, lang);
    const D = await p.evaluate(() => JSON.parse(document.getElementById('enq-data').textContent)), L = await dict(p);
    const T = (k, v) => fillIn(L['lant.enq.' + k], v);
    const press = (f) => p.locator(`#enq [data-f="${f}"]`).first().click({ timeout: T0 });
    const g = win.NightCases.core.create(D, { random: () => 0.5 }), s = g.state;
    const text = (q) => p.locator(q).first().textContent({ timeout: T0 });
    const band = () => p.locator('#enq .enq-law--band').count();
    // two first meetings are shown and carried back (a step with two wrong parts to tap); the rest are missed once
    const scored = g.level(depth).steps.filter((x) => x.kind !== 'bet' && x.kind !== 'stamp');
    const shown = mode === 'missed' ? scored.filter((x) => !x.boss && x.kind !== 'build' && (x.kind === 'diff' ? x.b.length : x.parts.length) >= 3).slice(0, 2).map((x) => x.id) : [];
    await press('go'); await press('ring-kuro'); await press('sheet-go'); await screenOk(p, where, 'card', tag);
    await press('play-' + depth); await screenOk(p, where, 'slip', tag);
    g.start(); g.openSlip(depth);
    assert((await text('.enq-slipcard__t')) === T('c.' + g.level(depth).key + '.slip'), `${where}: the slip of depth ${depth}`);
    const bet = g.level(depth).steps[0].options[1];
    await press('opt-' + bet); g.placeBet(bet);
    let guard = 0;
    while (s.screen === 'case' && guard++ < 30) {
      const st = g.cur(), pos = g.position(), name = st.id + (st.ret ? '-return' : '');
      await screenOk(p, where, name, tag);
      assert((await text('#enq .enq-prompt')) === T(st.k + '.prompt') && (await text('.enq-bar__pos')) === T(pos.k, pos.v), `${where} ${name}: the page is on the core's step (« ${T(pos.k, pos.v)} »)`);
      assert((await band() === 1) === g.lawShown(), `${where} ${name}: the law band as marked (${g.lawShown()})`);
      if (st.kind === 'stamp') {
        const o = st.options[2];
        await press('opt-' + o); g.pickStamp(o); await screenOk(p, where, 'stamped', tag);
        assert((await text('.enq-result__l')) === T('ui.result', { bet: T('ui.opt.' + bet), stamp: T('ui.opt.' + o), checked: T('ui.opt.' + st.checked) }) && (await text('.enq-result__r')) === T(st.k + '.reveal'), `${where}: the two stamps, the checked verdict and its reason`);
        await press('next'); g.next(); break;
      }
      if (st.kind === 'build') {   // two built sentences may share a prompt and their chip ids: the chips' words tell them apart
        const want = g.targets(st).map((x) => x.id + '=' + T(x.k + '.text')).sort().join('|');
        const got = (await p.evaluate(() => [...document.querySelectorAll('#enq .enq-chip')].map((n) => n.getAttribute('data-f').slice(5) + '=' + n.textContent))).sort().join('|');
        assert(got === want && await p.locator('#enq .enq-slot').count() === st.answer.length, `${where} ${name}: the chips of this sentence, and a slot for each answer`);
      }
      const how = mode === 'perfect' || st.ret ? 'right' : (shown.includes(st.id) ? 'reveal' : 'retry');
      for (const answer of movesFor(g, st, how)) {
        for (const [kind, x] of answer) { await press(DATA_F[kind](x)); g[CORE[kind]](x); }
        if (s.phase !== 'miss') break;
        await screenOk(p, where, name + '-miss', tag);
        assert((await band() === 1) === g.lawShown(), `${where} ${name}: the law line after a miss as marked (${g.lawShown()})`);
        assert((await text('.enq-fb__head')) === T('ui.notThis') && (await p.locator('#enq-live').textContent()).includes(T('ui.notThis')), `${where} ${name}: a first miss says so, on screen and in the live region`);
        await missOk(p, where, name);
      }
      assert(s.phase === 'hit' || s.phase === 'reveal', `${where} ${name}: the core is on ${s.phase} after the answer`);
      await screenOk(p, where, name + (s.phase === 'hit' ? '-hit' : '-shown'), tag);
      if (s.phase === 'hit') assert(await p.locator('.enq-seal').count() === 1 && (await text('.enq-fb__head')) === T('ui.right'), `${where} ${name}: the seal lands on a right answer`);
      else assert((await text('.enq-xp')) === T('ui.xp0') && await p.locator('#enq [data-mode="answer"]').count() >= 1, `${where} ${name}: the answer is shown, for 0 XP`);
      assert(!/\.\.$/.test(await text('.enq-fb__head')), `${where} ${name}: the answer line ends on two full stops`);
      assert(await p.evaluate(() => { const a = document.activeElement; return !!a && a.getAttribute('data-f') === 'next'; }), `${where} ${name}: focus is on Continue after an answer`);
      await press('next'); g.next();
      if (s.phase === 'bubble') {
        const b = g.bubbleFor(st);
        assert(await p.locator('.enq-box--bubble').count() === 1 && (await text('.enq-box--bubble .enq-talk__t')) === T('c.' + g.level(depth).key + '.bub.' + b.id), `${where} ${name}: the crew's line after this answer`);
        await screenOk(p, where, name + '-bubble', tag); await press('next'); g.next();
      }
    }
    const E = s.last;
    assert(s.screen === 'end' && !!E, `${where}: the core closed the case`);
    await screenOk(p, where, 'end', tag);
    const lines = await p.locator('.enq-endcard__l').allTextContents();
    assert(lines[0] === T('ui.end.score', { first: E.first, end: E.end }) && lines[1] === T('ui.end.flames', { flames: E.flames, hints: E.hints }), `${where}: end card « ${lines.join(' / ')} », the core says first ${E.first}, end ${E.end}, flames ${E.flames}`);
    assert((await text('.enq-endcard__xp')) === T('ui.end.xpFirst', { n: E.xp }) && (await text('.enq-bar__xp')) === T('ui.xp', { n: E.xp }), `${where}: ${E.xp} XP on the card and in the bar`);
    assert(await p.locator('.enq-endcard .enq-flame.is-lit').count() === E.flames, `${where}: ${E.flames} flames lit`);
    if (mode === 'missed') assert(shown.length === 2 && s.plan.filter((x) => x.ret).length === 2, `${where}: two answers were shown and two came back (${shown.join(', ')})`);
    assert(log.console.length === 0, `${where}: console: ${log.console.slice(0, 3).join(' | ')}`);
    assert(log.late.length === 0, `${where}: requested after load: ${[...new Set(log.late)].slice(0, 4).join(', ')}`);
    assert((await p.evaluate(() => window.__ac)) === 0, `${where}: an audio context was made with the radio off`);
  } catch (e) { assert(false, `${where}: ${String(e.message || e).split('\n')[0]}`); }
  await ctx.close();
}

const PATHS = { perfect: {}, misses: { shield: 'retry', count: 'reveal' } };
const jobs = [];
for (const lang of ['fr', 'en', 'ar']) for (const w of [390, 1440]) for (const [n, path] of Object.entries(PATHS)) jobs.push(() => run(lang, w, n, path));
jobs.push(() => run('fr', 390, 'reduced', PATHS.misses, { reduce: true }));
jobs.push(() => run('fr', 390, 'keys', { shield: 'retry' }, { keys: true }));
jobs.push(() => runDeep('en', 1440, 2, 'perfect'));
jobs.push(() => runDeep('ar', 390, 2, 'missed'));
jobs.push(() => runDeep('ar', 1440, 3, 'perfect'));
jobs.push(() => runDeep('fr', 390, 3, 'missed'));
// scripts disabled: the plain text
jobs.push(async () => {
  for (const lang of ['fr']) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    try {
      const p = await ctx.newPage();
      await p.goto(URL0(lang), { waitUntil: 'load', timeout: 20000 });
      const r = await p.evaluate(() => ({ app: document.getElementById('enq').hidden, clair: !!document.querySelector('[data-enq-clair]').offsetHeight, laws: document.querySelectorAll('[data-enq-clair] .enq-law').length, cases: document.querySelectorAll('.enq-clair__case').length, src: document.querySelectorAll('.enq-clair .enq-src a').length, sw: document.documentElement.scrollWidth, iw: innerWidth, h1: document.querySelectorAll('h1').length }));
      assert(r.app && r.clair && r.cases === 3 && r.laws === 2 && r.src >= 3 && r.h1 === 1 && r.sw <= r.iw, `no script: « Le dossier, en clair » shows three depths, its sources and the law line (${JSON.stringify(r)})`);
      if (SHOTS) await p.screenshot({ path: join(SHOTS, 'fr-390-noscript.png'), fullPage: true });
    } catch (e) { assert(false, `no script: ${String(e.message || e).split('\n')[0]}`); }
    await ctx.close();
  }
});
// four at a time
const queue = jobs.slice(); await Promise.all([0, 1, 2, 3].map(async () => { while (queue.length) await queue.shift()(); }));
await browser.close(); await srv.close();
if (errs.length) { console.error(`✗ enquetes-play: ${errs.length} of ${asserts} checks failed\n  ` + errs.join('\n  ')); process.exit(1); }
console.log(`✓ enquetes-play: ${asserts} checks in ${jobs.length} runs (depth 1, perfect and with misses × 390 and 1440 × fr, en, ar; depths 2 and 3, perfect and missed; reduced motion; the list view by keyboard; no script)`);
