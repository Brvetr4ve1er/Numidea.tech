/**
 * « Les enquêtes de nuit » (hub/lanterne/enquetes.html, 2026-11-23): the Librairie's night stall as a game. One claim
 * about « web3 » waits; the player bets, points at the proof on a mock screen six times, and stamps the claim. The
 * season's thirteen rows on the chart; the rows marked open are playable at depths 1 to 3.
 *
 * Where things live (the season plan of 2026-11-23, section 3):
 *   hub/src/lanterne/enquetes.json          the shell: the stall, the chart's thirteen rows, the titles, and case 1
 *                                           (Chrome → Brave) until it moves to its own files; never a sentence
 *   hub/src/lanterne/enquetes/cNN.json      one open case: its depths, steps, sticker and sources; never a sentence
 *   hub/src/lanterne/enquetes/cNN.<l>.json  its strings, flat, keys relative to lant.enq.c.<slug>. (« d1.box.prompt »),
 *                                           the same keys in fr, en and ar
 *   hub/src/i18n/{fr,en,ar}.json            the shell's strings and case 1's (lant.enq.*)
 * A case's chart line, its sticker and, per depth, its claim and its reveal are copied from its files into the page's
 * dictionary (the chart and the plain text print them before the case is opened). Everything else of a case is
 * published as hub/lanterne/enq/cNN.js and cNN.<l>.js, one call to NightCases.add() each, which hub/enquetes.js adds as
 * script elements when the case is opened or the language changes. Nothing is published for a row that is not open.
 *
 * This module checks every file against the engine's contract (SPEC section 10), refuses what the contract refuses,
 * and returns the page: the Librairie's mast and menu, the radio's chip, the game's empty stage, and « Le dossier, en
 * clair », the plain text a reader without scripts gets (the engine hides it once it runs).
 *
 * Until the dictionaries hold them, a build may borrow English: ENQ_PLACEHOLDERS=<keys.json> lends the shell keys of
 * that manifest (key → English) to the three languages, and lends a case's English file to a language it lacks. Each
 * one borrowed is listed in the build's notes. Without it a missing string is refused, as everywhere else.
 *
 * Called by scripts/lib/lanterne.mjs with its helpers. The names this page may print: scripts/lib/enquetes-names.mjs.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export const ENQ_PREFIX = 'lant.enq.';
const P = ENQ_PREFIX;
/* a word is a run with a letter or a digit in it: « ? » after its narrow space is not one */
export const words = (s) => String(s).split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
/* what brings the standing 25-10 sentence onto a step: a token, a wallet, Rewards, a crypto-asset, in French or English */
export const CRYPTO_WORD = /\b(tokens?|jetons?|wallets?|portefeuilles?|rewards|crypto[- ]?(?:assets?|actifs?|monnaies?)|cryptos?)\b/i;
/* mock screens whose title is a shell string (tpl.*); any other template's title is the case's own (c.<slug>.tpl.*) */
const SHELL_TPL = ['browser-bar', 'browser-bar-phone', 'message', 'new-tab', 'results', 'settings-rows', 'shields-panel', 'shields-panel-phone', 'web-page'];
const NO_TITLE = ['four-tiles', 'web-page-with-bar', 'duo'];
/* the strings a case copies into the page's dictionary, relative to lant.enq.c.<slug>. */
export const CASE_SHELL = (c) => ['row', 'sticker.name', 'sticker.line', 'sticker.back', ...c.depths.flatMap((d) => [`d${d.level}.claim`, `d${d.level}.stamp.reveal`])];

/* the keys a step names, with what each one is (so a limit can be held): [key, kind] */
function stepKeys(key, st) {
  const out = [], base = `${P}c.${key}.${st.id}`;
  const body = (b, o, ret) => {
    out.push([`${b}.prompt`, 'prompt']);
    if (o.address) out.push([`${b}.address`, 'label']);
    if (o.kind === 'diff') { o.b.forEach((x, i) => { out.push([`${b}.g.${i}.say`, 'label'], [`${b}.g.${i}.why`, 'why'], [`${b}.g.${i}.after`, i === o.answer ? 'label' : 'after']); }); out.push([`${b}.why`, 'why']); }
    if (o.kind === 'build') out.push([`${b}.frame`, 'label']);
    for (const t of o.parts || []) {
      const k = `${b}.p.${t.id}`, right = Array.isArray(o.answer) ? o.answer.includes(t.id) : o.answer === t.id;
      if (t.text) out.push([`${k}.text`, 'label']);
      if (t.caption) out.push([`${k}.cap`, 'label']);
      if (t.say) out.push([`${k}.say`, 'label']);
      if (t.mark) out.push([`${k}.mark`, 'label']);
      if (t.after) out.push([`${k}.after`, right ? 'label' : 'after']);
      out.push([`${k}.why`, 'why']);
    }
    if (!ret) { for (let i = 0; i < 3; i++) out.push([`${b}.hint.${i}`, 'hint']); out.push([`${b}.kuro`, 'kuro']); }
  };
  if (st.kind === 'bet') out.push([`${base}.prompt`, 'prompt']);
  else if (st.kind === 'stamp') out.push([`${base}.prompt`, 'prompt'], [`${base}.reveal`, 'reveal']);
  else { body(base, st, false); if (st.return) body(`${base}.r`, st.return, true); }
  return out;
}
/* every key one case needs, full: [key, kind]. c = { slug, depths, legacy } */
export function caseKeys(c) {
  const K = [], tpls = new Set();
  for (const d of c.depths) {
    K.push([`${P}c.${d.key}.slip`, 'slip'], [`${P}c.${d.key}.slipTag`, ''], [`${P}c.${d.key}.can`, ''], [`${P}c.${d.key}.claim`, '']);
    for (const b of d.bubbles) K.push([`${P}c.${d.key}.bub.${b.id}`, 'bubble']);
    for (const st of d.steps) { for (const o of [st, st.return]) if (o && o.template) tpls.add(o.template); K.push(...stepKeys(d.key, st)); }
  }
  if (!c.legacy) {
    for (const t of tpls) if (!SHELL_TPL.includes(t) && !NO_TITLE.includes(t)) K.push([`${P}c.${c.slug}.tpl.${t}`, '']);
    K.push([`${P}c.${c.slug}.row`, ''], [`${P}c.${c.slug}.sticker.name`, ''], [`${P}c.${c.slug}.sticker.line`, ''], [`${P}c.${c.slug}.sticker.back`, 'back']);
  }
  return K;
}
/* the shell's strings added for the season (2026-11-23): until the dictionaries hold them, the translators' manifest
   lends them (ENQ_PLACEHOLDERS) */
export const SEASON_UI = ['ui.goalAt.awning', 'ui.goalAt.shelves', 'ui.goalAt.headphones', 'ui.goalAt.book', 'ui.goalAt.lantern', 'ui.stallIdle4', 'ui.goalNone2', 'ui.btn.replay2',
  'ui.fact.closedN', 'ui.fact.flamesN', 'ui.fact.slipAt', 'ui.load', 'ui.loadFail', 'ui.retry', 'chart.partly', 'chart.verdictN', 'chart.rowAria', 'chart.played', 'chart.depths',
  'card.nextS', 'card.cannot', 'card.closedIn', 'card.flamesN', 'rank.4', 'ring.awning.label', 'ring.awning.name', 'ring.awning.line', 'ring.shelves.label', 'ring.shelves.name', 'ring.shelves.line',
  'ring.headphones.label', 'ring.headphones.name', 'ring.headphones.line', 'ring.book.slip'];
/* every shell key the page needs, and case 1's while it lives in the shell: [key, kind] */
export function enqKeys(E) {
  const K = [];
  const ui = ['title', 'desc', 'mast', 'shelf.k', 'shelf.t', 'shelf.go', 'ui.skip', 'ui.door.label', 'ui.door.title', 'ui.door.season', 'ui.door.line', 'ui.door.start', 'ui.door.open', 'ui.door.kept', 'ui.door.alt',
    'ui.slipKept', 'ui.sound.off', 'ui.sound.on', 'ui.sound.aria', 'ui.leave.h', 'ui.leave.t', 'ui.leave.stay', 'ui.leave.go', 'ui.list.on', 'ui.list.off', 'ui.list.short', 'ui.stallAlt', 'ui.stallName', 'ui.stallIdle', 'ui.goal', 'ui.goalNone', 'ui.close', 'ui.toDoor', 'ui.toStall', 'ui.stop',
    'ui.crew.aria', 'ui.crew.h', 'ui.btn.slip', 'ui.btn.chart', 'ui.btn.card', 'ui.btn.replay', 'ui.fact.closed', 'ui.fact.flames', 'ui.fact.slip', 'ui.fact.noSlip', 'ui.fact.tools', 'ui.slipH', 'ui.pvAria',
    'ui.pos', 'ui.posRet', 'ui.posStamp', 'ui.flames', 'ui.betOpen', 'ui.betChip', 'ui.xp', 'ui.hint', 'ui.hint3', 'ui.eye', 'ui.continue', 'ui.closeCase', 'ui.notThis', 'ui.tryAgain', 'ui.right', 'ui.flame', 'ui.answer',
    'ui.wrongSlot', 'ui.slot', 'ui.slotFull', 'ui.slotEmpty', 'ui.placed', 'ui.gone', 'ui.xpGain', 'ui.xpRun', 'ui.xp0', 'ui.sealed', 'ui.says', 'ui.quote', 'ui.noReturn', 'ui.bossNoReturn', 'ui.thirdQueued',
    'ui.addr', 'ui.addrA', 'ui.addrB', 'ui.lawK', 'ui.choose', 'ui.under', 'ui.result', 'ui.end.closed', 'ui.end.score', 'ui.end.flames', 'ui.end.xpFirst', 'ui.end.xpRun', 'ui.end.tool', 'ui.end.stick', 'ui.end.next', 'ui.depth',
    'chart.h', 'chart.notYet', 'chart.yes', 'chart.verdict', 'chart.cta', 'chart.stickerAria', 'chart.back', 'chart.readOn', 'chart.srcK',
    'card.h', 'card.titleK', 'card.xp', 'card.xpAria', 'card.next', 'card.top', 'card.flames', 'card.tools', 'card.and', 'card.depth', 'card.open', 'card.closed', 'card.play', 'card.replay', 'card.aria',
    'clair.h', 'clair.lead', 'clair.claimK', 'clair.checkedK', 'clair.stickerK', 'tool.eye', 'tool.ring', 'tool.ringDoes', 'season.premise', ...SEASON_UI];
  for (const k of ui) K.push([P + k, '']);
  for (let i = 1; i <= 3; i++) K.push([`${P}sticker.state.${i}`, '']);
  const tags = new Set(['back']), opts = new Set(), tpls = new Set();
  /* case 1, while its structure is in the shell and its strings in the dictionaries */
  if (E.cases && E.cases.length) {
    K.push([P + 'sticker.name', ''], [P + 'sticker.line', ''], [P + 'sticker.back', 'back']);
    for (const d of E.cases) for (const st of d.steps) for (const o of [st, st.return]) if (o && o.template && !NO_TITLE.includes(o.template)) tpls.add(o.template);
    K.push(...caseKeys({ slug: 'brave', depths: E.cases, legacy: true }));
  }
  for (const d of E.cases || []) for (const st of d.steps) { tags.add(st.tag); (st.options || []).forEach((o) => opts.add(o)); }
  for (const t of ['bet', 'labels', 'read', 'point', 'note', 'boss', 'stamp', 'eye', 'duo', 'rows', 'compare', 'ring', 'build', 'line']) tags.add(t);
  for (const o of ['true', 'half', 'not', 'sales']) opts.add(o);
  for (const t of tags) K.push([`${P}ui.tag.${t}`, '']);
  for (const o of opts) K.push([`${P}ui.opt.${o}`, '']);
  for (const t of new Set([...tpls, ...SHELL_TPL])) K.push([`${P}tpl.${t}`, '']);
  for (const r of E.rings) K.push([`${P}ring.${r.id}.label`, ''], [`${P}ring.${r.id}.name`, ''], [`${P}ring.${r.id}.line`, 'look'], [`${P}ring.${r.id}.btn`, '']);
  /* a place tonight's slip can sit on draws a fourth ring there; every ring has a one-word label under it (2026-11-24) */
  for (const p of E.places) K.push([`${P}ring.${p.id}.label`, ''], [`${P}ring.${p.id}.name`, ''], [`${P}ring.${p.id}.line`, 'look'], [`${P}ui.goalAt.${p.id}`, '']);
  for (const r of [...E.rings, ...E.places]) K.push([`${P}ring.${r.id}.word`, 'word']);
  for (const r of E.season) if (r.open && r.slip) K.push([`${P}ui.goalAt.${r.slip}`, '']);
  /* the chart prints a closed row's verdict as chart.<verdict>: every verdict a row carries has its word in the three
     dictionaries (2026-11-24: « no » and « added » had none, and the line printed an empty verdict) */
  for (const r of E.season) if (r.verdict) K.push([`${P}chart.${r.verdict}`, '']);
  for (const s of E.season) { K.push([`${P}season.${s.id}.pair`, ''], [`${P}season.${s.id}.line`, '']); if (s.file === 'c01' && E.cases && E.cases.length) K.push([`${P}season.${s.id}.open`, '']); }
  for (let i = 1; i <= E.chapters; i++) K.push([`${P}season.ch.${i}.name`, ''], [`${P}season.ch.${i}.line`, '']);
  for (const d of E.depths) if (d.playable) K.push([`${P}depth.${d.n}.name`, ''], [`${P}depth.${d.n}.verbs`, '']);
  K.push([`${P}depth.1.tool`, ''], [`${P}depth.2.tool`, '']);
  E.titles.forEach((t, i) => K.push([`${P}rank.${i}`, '']));
  for (const [who, ev, n] of ENQ_VOICES) for (const i of n) K.push([`${P}v.${who}.${ev}.${i}`, 'bubble']);
  return [...new Map(K.map((x) => [x[0], x])).values()];
}
/* the crew's lines the engine speaks (hub/enquetes.js names the same ones) */
export const ENQ_VOICES = [['kuro', 'hit', [0, 1, 2, 3, 4]], ['kuro', 'miss', [0, 1, 2, 3, 4]], ['kuro', 'sticker', [0]], ['yasser', 'greet', [0]], ['yasser', 'brief', [0]], ['yasser', 'noFlameLit', [0]],
  ['pigeon', 'idle', [2]], ['pigeon', 'queued', [0]], ['raven', 'idle', [2]], ['ratman', 'idle', [0, 2]], ['ratman', 'hint', [0, 1, 2]], ['ratman', 'toolArrives', [0]]];
/* left out of the page (tapes, the journal, the review round): never named while they are */
export const LEFT_OUT = { fr: /magnétophones?|cassettes?|\bjournal\b|\brévisions?\b/i, en: /\brecorders?\b|\btapes?\b|\bjournal\b|\breviews?\b/i, ar: /آلة التسجيل|مسجّل|مسجِّل|كاسيت|شريط التسجيل|دفتر اليوميات|مراجعة/ };
const LIMIT = { slip: 20, prompt: 20, why: 20, hint: 20, reveal: 20, bubble: 12, look: 25, after: 5, back: 60, kuro: 3, word: 1 };
const COUNT = { screen: [3, 5], page: [3, 4], notes: [3, 3], duo: [2, 2], build: [2, 6] };
const VERDICTS = ['yes', 'partly', 'no', 'added'];
const PLACES = ['awning', 'shelves', 'headphones', 'book', 'lantern', 'satchel', 'drawers', 'kuro'];

export function enquetes(h) {
  const { LS, HUB, DICT, LANGS, fail, notes, esc, json, need, headFor, swap, menu, motionBtn, langSwitch, scripts, radioJson, WA, TOOLS, WM, stFoot } = h;
  const at = 'hub/src/lanterne/enquetes.json', CD = join(LS, 'enquetes');
  const E = json(join(LS, 'enquetes.json'));
  if (!E) return null;
  const bad = (m) => fail(`${at}: ${m}`);

  /* ---------------- the shell ---------------- */
  const srcOk = (list, w) => { for (const s of list || []) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s.read || '')) fail(`${w}: source ${s.id}: read is the day its page was read (YYYY-MM-DD)`);
    if (!s.internal) { let u = null; try { u = new URL(s.url); } catch (e) {} if (!u || u.protocol !== 'https:') fail(`${w}: source ${s.id}: url is not an https address`); }
  } };
  srcOk(E.sources, at);
  if (E.law !== 'lant.tools.risk.crypto') bad('law names the site\'s standing sentence, lant.tools.risk.crypto, and no second copy');
  for (const f of [E.painting.src, E.painting.small, E.art.seal, E.art.sprite, ...Object.values(E.art.faces), ...Object.values(E.art.tools), ...E.depths.map((d) => d.icon)]) if (!existsSync(join(HUB, f))) bad(`${f} is not a file under hub/`);
  if (E.rings.length !== 3) bad('three fixed rings on the painting (the book, Kūro, the lantern); tonight\'s slip draws the fourth');
  for (const r of [...E.rings, ...E.places]) if (!(r.at[0] > 0 && r.at[0] < 1 && r.at[1] > 0 && r.at[1] < 1)) bad(`ring ${r.id}: its centre is a fraction of the crop`);
  if (E.art.cells.length !== E.titles.length) bad('one cell of Kūro\'s sprite a title');
  if (E.titles[0].xp !== 0 || E.titles.some((t, i) => i && !(t.xp > E.titles[i - 1].xp && t.cases > 0 && t.at >= 1))) bad('titles climb: 0 XP first, then more XP and a number of cases kept at a depth');
  const rows = E.season, open = rows.filter((r) => r.open);
  if (rows.length !== 13 || rows.some((r, i) => r.n !== i + 1)) bad('thirteen rows, numbered in order');
  if (!open.length || !rows[0].open) bad('row 1 is open');
  for (const r of rows) {
    if (!/^c\d\d$/.test(r.file || '') || r.file !== `c${String(r.n).padStart(2, '0')}`) bad(`row ${r.n}: its file is c${String(r.n).padStart(2, '0')}`);
    if (r.open && (!VERDICTS.includes(r.verdict) || r.depths !== 3 || !PLACES.includes(r.slip))) bad(`row ${r.n}: an open row carries its verdict, its three written depths and where its slip sits`);
    if (r.open && r.later) bad(`row ${r.n}: open and later at once`);
    /* a slip in the book or under Kūro adds no ring (that fixed ring's sheet opens it); the lantern is the slip's own ring */
    if (r.open && !E.rings.some((x) => x.id === r.slip) && !E.places.some((p) => p.id === r.slip)) bad(`row ${r.n}: its slip sits on ${r.slip}, which has no ring`);
  }

  /* ---------------- the open cases ---------------- */
  let PH = null;
  if (process.env.ENQ_PLACEHOLDERS) { try { PH = JSON.parse(readFileSync(process.env.ENQ_PLACEHOLDERS, 'utf8')); } catch (e) { fail(`ENQ_PLACEHOLDERS: ${e.message}`); PH = {}; } }
  const CASES = [];
  for (const r of open) {
    const f = join(CD, `${r.file}.json`), w = `hub/src/lanterne/enquetes/${r.file}.json`;
    if (r.file === 'c01' && !existsSync(f)) {
      CASES.push({ id: 'c01', slug: r.id, n: 1, row: r, legacy: true, depths: E.cases, sources: E.sources, sticker: E.sticker, S: null, w: at });
      continue;
    }
    if (!existsSync(f)) { fail(`row ${r.n} is open: ${w} is missing`); continue; }
    const C = JSON.parse(readFileSync(f, 'utf8'));
    if (C.id !== r.file || C.slug !== r.id || C.n !== r.n) fail(`${w}: id, slug and number are the chart row's (${r.file}, ${r.id}, ${r.n})`);
    if (C.verdict !== r.verdict) fail(`${w}: verdict ${C.verdict}, the chart row says ${r.verdict}`);
    if (C.depths.length !== r.depths) fail(`${w}: ${C.depths.length} depths, the chart row says ${r.depths}`);
    srcOk(C.sources, w);
    const S = {};
    for (const l of ['en', ...LANGS.filter((x) => x !== 'en')]) {
      const lf = join(CD, `${r.file}.${l}.json`);
      if (existsSync(lf)) S[l] = JSON.parse(readFileSync(lf, 'utf8'));
      else if (l !== 'en' && PH && S.en) { S[l] = { ...S.en }; notes.push(`« Les enquêtes de nuit » ${r.file}: no ${l} file yet (hub/src/lanterne/enquetes/${r.file}.${l}.json); its ${Object.keys(S.en).length} strings are the English placeholders (ENQ_PLACEHOLDERS)`); C.borrowed = (C.borrowed || []).concat(l); }
      else { fail(`row ${r.n} is open: hub/src/lanterne/enquetes/${r.file}.${l}.json is missing`); S[l] = {}; }
    }
    CASES.push({ ...C, row: r, legacy: false, S, w });
  }
  /* nothing is published for a row that is not open: a file left in hub/lanterne/enq/ from an earlier build is refused */
  const PUB = join(HUB, 'lanterne', 'enq'), shipped = new Set(CASES.filter((c) => !c.legacy).flatMap((c) => [`${c.id}.js`, ...LANGS.map((l) => `${c.id}.${l}.js`)]));
  if (existsSync(PUB)) for (const f of readdirSync(PUB)) if (!shipped.has(f)) fail(`hub/lanterne/enq/${f}: published for a row that is not open (delete it)`);

  /* a case's strings, full keys: its files for an open case, the dictionaries for case 1 while it lives in the shell */
  const val = (c, l, k) => (c.legacy ? DICT[l][k] : c.S[l][k.slice(`${P}c.${c.slug}.`.length)]);

  /* ---------------- the contract (SPEC section 10) ---------------- */
  for (const c of CASES) {
    const srcIds = new Set((c.sources || []).map((s) => s.id));
    const cw = c.legacy ? at : c.w;
    const bodyOk = (w, o, ret) => {
      if (!['screen', 'page', 'notes', 'duo', 'diff', 'build'].includes(o.kind)) { fail(`${cw} ${w}: kind "${o.kind}" is not one of the engine's`); return; }
      if (!Array.isArray(o.src) || !o.src.length) fail(`${cw} ${w}: no src`);
      for (const s of o.src || []) if (!srcIds.has(s)) fail(`${cw} ${w}: src "${s}" is not in its sources`);
      if (o.kind === 'diff') { if (!Array.isArray(o.a) || !Array.isArray(o.b) || o.a.length !== o.b.length || !(o.answer >= 0 && o.answer < o.b.length)) fail(`${cw} ${w}: a diff is two addresses of as many pieces, and the index of the piece that gives it away`); return; }
      const n = (o.parts || []).length, [lo, hi] = COUNT[o.kind];
      if (n < lo || n > hi) fail(`${cw} ${w}: ${n} parts, a ${o.kind} takes ${lo === hi ? lo : `${lo} to ${hi}`}`);
      const ids = (o.parts || []).map((t) => t.id);
      if (new Set(ids).size !== ids.length) fail(`${cw} ${w}: two parts with one id`);
      for (const t of o.parts || []) {
        if ('label' in t || 'kuro' in t) fail(`${cw} ${w}/${t.id}: an old label or kuro field`);
        if (!t.text && !t.lit && !t.caption) fail(`${cw} ${w}/${t.id}: a part with neither text nor caption`);
        if (!t.text && !t.lit && !t.glyph) fail(`${cw} ${w}/${t.id}: a part without text carries a glyph to draw`);
        if (t.glyph && !['wallet', 'star', 'bars', 'reload', 'cross', 'tabs'].includes(t.glyph)) fail(`${cw} ${w}/${t.id}: glyph "${t.glyph}" is not one the engine draws`);
        if (['screen', 'page', 'duo'].includes(o.kind) && !t.after) fail(`${cw} ${w}/${t.id}: no after (what the mock shows when it is tapped)`);
      }
      if (o.kind === 'build') { if (!Array.isArray(o.answer) || o.answer.length < 2 || o.answer.length > 3 || o.answer.some((a) => !ids.includes(a))) fail(`${cw} ${w}: a built sentence has two or three slots, each answered by one of its chips`); }
      else if (!ids.includes(o.answer)) fail(`${cw} ${w}: its answer "${o.answer}" is not one of its parts`);
      for (const l of o.lawWith || []) if (!ids.includes(l)) fail(`${cw} ${w}: lawWith "${l}" is not one of its parts`);
      if (ret && (o.return || o.hint)) fail(`${cw} ${w}: a return has no return of its own`);
    };
    c.depths.forEach((lv, i) => {
      const w = `depth ${lv.level}`;
      if (lv.level !== i + 1 || lv.key !== `${c.slug}.d${lv.level}`) fail(`${cw} ${w}: depths in order, each keyed ${c.slug}.d<n>`);
      const scored = lv.steps.filter((s) => s.kind !== 'bet' && s.kind !== 'stamp');
      const bet = lv.steps[0], stamp = lv.steps[lv.steps.length - 1];
      if (!bet || bet.kind !== 'bet' || !stamp || stamp.kind !== 'stamp') { fail(`${cw} ${w}: a case opens on its bet and closes on its stamp`); return; }
      if (bet.options.join() !== stamp.options.join()) fail(`${cw} ${w}: the bet and the stamp do not offer the same three verdicts`);
      if (!stamp.options.includes(stamp.checked)) fail(`${cw} ${w}: the checked verdict is not one of the stamp's`);
      if (scored.length !== 6) fail(`${cw} ${w}: ${scored.length} scored answers, six make a case`);
      if (new Set(lv.steps.map((s) => s.id)).size !== lv.steps.length) fail(`${cw} ${w}: two steps with one id`);
      if (scored.filter((s) => s.boss).length !== 1 || !scored[scored.length - 1].boss) fail(`${cw} ${w}: the objection is one step, the last scored one`);
      if (lv.bubbles.length !== 2 || lv.bubbles[0].after !== (scored[2] || {}).id || lv.bubbles[1].after !== (scored[4] || {}).id) fail(`${cw} ${w}: case bubbles sit after scored answers 3 and 5, and nowhere else`);
      for (const b of lv.bubbles) if (!['yasser', 'pigeon', 'ratman', 'raven'].includes(b.who)) fail(`${cw} ${w}: bubble ${b.id} is spoken by one of the crew, never by Kūro`);
      for (const s of [bet, stamp]) for (const x of s.src || []) if (!srcIds.has(x)) fail(`${cw} ${w}/${s.id}: src "${x}" is not in its sources`);
      for (const s of scored) {
        bodyOk(`${w}/${s.id}`, s, false);
        /* the eye flower's button shows at depth 2, off the objection, on a step with a captioned part: a step tagged « eye »
           (« tap the eye flower ») is one of those, or it names a button that is not there */
        if (s.tag === 'eye' && (lv.level !== 2 || s.boss || !(s.parts || []).some((t) => t.caption))) fail(`${cw} ${w}/${s.id}: tagged « eye », but the eye flower's button shows only at depth 2, off the objection, on a step with a captioned part`);
        if (!s.return) fail(`${cw} ${w}/${s.id}: no return`); else { bodyOk(`${w}/${s.id} (return)`, s.return, true); if (s.return.kind !== s.kind) fail(`${cw} ${w}/${s.id}: its return is another kind (${s.return.kind}); a return is the same kind on a new surface`); }
      }
      /* depth 1 holds one item without labels and one note; depth 2 one page opened with the ring */
      if (!c.legacy && lv.level === 1 && !scored.some((s) => s.kind === 'notes')) fail(`${cw} ${w}: depth 1 holds one « tap the true note »`);
      if (!c.legacy && lv.level === 2 && !scored.some((s) => s.kind === 'page' && s.ring)) fail(`${cw} ${w}: depth 2 holds one page opened with the ring`);
    });
    if (!c.legacy) {
      for (const x of c.sticker.src) if (!srcIds.has(x)) fail(`${cw} sticker: src "${x}" is not in its sources`);
      if (c.depths.some((d) => d.crypto) && !c.depths.some((d) => d.steps.some((s) => s.law || s.lawWith))) fail(`${cw}: a case marked crypto pins the law line on no step`);
    }
  }

  /* ---------------- the keys: every one in every language, held to its limit ---------------- */
  const SHELL = enqKeys(E);
  const borrowed = { fr: 0, en: 0, ar: 0 };
  for (const [k] of SHELL) for (const l of LANGS) {
    if (DICT[l][k] != null) continue;
    if (PH && PH[k] != null) { DICT[l][k] = PH[k]; borrowed[l]++; }
    else if (l === 'fr') fail(`« Les enquêtes de nuit »: no key ${k} in hub/src/i18n/fr.json`);
    else fail(`« Les enquêtes de nuit »: key ${k} is missing in ${l}`);
  }
  for (const l of LANGS) if (borrowed[l]) notes.push(`« Les enquêtes de nuit »: ${borrowed[l]} ${l} shell strings are English placeholders (ENQ_PLACEHOLDERS), not yet in hub/src/i18n/${l}.json`);
  need(E.law, at);
  /* a case's files hold its keys, all of them and nothing else */
  const KC = new Map(CASES.map((c) => [c.id, caseKeys(c)]));
  for (const c of CASES) if (!c.legacy) {
    const want = new Set(KC.get(c.id).map(([k]) => k.slice(`${P}c.${c.slug}.`.length)));
    for (const l of LANGS) {
      const have = Object.keys(c.S[l]);
      const miss = [...want].filter((k) => c.S[l][k] == null || !String(c.S[l][k]).trim()), extra = have.filter((k) => !want.has(k));
      if (miss.length) fail(`hub/src/lanterne/enquetes/${c.id}.${l}.json: ${miss.length} keys missing or empty (${miss.slice(0, 6).join(', ')})`);
      if (extra.length) fail(`hub/src/lanterne/enquetes/${c.id}.${l}.json: ${extra.length} keys no step names (${extra.slice(0, 6).join(', ')})`);
    }
  }
  const limit = (k, kind, v, l, w) => {
    const max = LIMIT[kind]; if (!max || v == null) return;
    const n = words(v);
    if (n > max || (kind === 'kuro' && n < 1)) (l === 'ar' ? (m) => notes.push(m) : fail)(`${w}${l} ${k}: ${n} words, ${max} at most for a ${kind} (« ${String(v).slice(0, 60)} »)`);
  };
  for (const [k, kind] of SHELL) for (const l of LANGS) limit(k, kind, DICT[l][k], l, '');
  for (const c of CASES) if (!c.legacy) for (const [k, kind] of KC.get(c.id)) for (const l of LANGS) if (!(c.borrowed || []).includes(l)) limit(k, kind, val(c, l, k), l, `${c.id} `);
  /* the law line: a step whose French or English names a token, a wallet, Rewards or a crypto-asset carries law, or
     lawWith for that part; the bet's claim and slip are read with the bet */
  for (const c of CASES) for (const lv of c.depths) for (const st of lv.steps) {
    const check = (o, base, w) => {
      if (o.law) return;
      const own = (o.parts || []).map((t) => `${base}.p.${t.id}.`), marked = new Set(o.lawWith || []);
      const ks = stepKeys(lv.key, st).map(([k]) => k).filter((k) => k.startsWith(base + '.') && (base.endsWith('.r') || !k.startsWith(base + '.r.')));
      if (st.kind === 'bet') ks.push(`${P}c.${lv.key}.claim`, `${P}c.${lv.key}.slip`);
      for (const k of ks) for (const l of ['fr', 'en']) {
        const v = val(c, l, k); if (v == null || !CRYPTO_WORD.test(v) || (l === 'fr' && (c.borrowed || []).includes('fr'))) continue;
        const pid = (own.find((p) => k.startsWith(p)) || '').slice(base.length + 3, -1);
        if (pid && marked.has(pid)) continue;
        fail(`${c.legacy ? at : c.w} ${w}: ${l} ${k} names « ${v.match(CRYPTO_WORD)[0]} » and the step carries neither law nor lawWith for it`);
      }
    };
    const base = `${P}c.${lv.key}.${st.id}`;
    if (c.legacy && st.kind === 'bet') continue;   // case 1's bet: reviewed and kept as it is (its slip names no token)
    check(st, base, `${lv.id}/${st.id}`);
    if (st.return) check(st.return, `${base}.r`, `${lv.id}/${st.id} (return)`);
  }
  if (E.cases && E.cases.some((c) => c.crypto) && !E.cases.some((c) => c.steps.some((s) => s.law || s.lawWith))) bad('a case marked crypto pins the law line on no step');
  /* what was left out is promised nowhere: no string of the page names the recorder, a tape, the journal or a review
     (the stall has two tools, the eye flower and the ring) */
  const leftOut = (key, v, l, w) => { const m = v == null ? null : String(v).match(LEFT_OUT[l]); if (m) fail(`« Les enquêtes de nuit »${w}: ${l} ${key} names « ${m[0]} », which the page does not have (« ${String(v).slice(0, 60)} »)`); };
  for (const [key] of SHELL) for (const l of LANGS) leftOut(key, DICT[l][key], l, '');
  for (const c of CASES) if (!c.legacy) for (const [key] of KC.get(c.id)) for (const l of LANGS) if (!(c.borrowed || []).includes(l)) leftOut(key, val(c, l, key), l, ` ${c.id}`);

  /* the strings the chart and the plain text print before a case is opened: into the page's dictionary */
  for (const c of CASES) if (!c.legacy) for (const rel of CASE_SHELL(c)) for (const l of LANGS) DICT[l][`${P}c.${c.slug}.${rel}`] = c.S[l][rel] == null ? '' : c.S[l][rel];

  /* ---------------- the page ---------------- */
  const page = 'enquetes', k = (s) => P + s;
  const shortUrl = (u) => { const x = new URL(u), p = x.pathname.replace(/\/$/, ''); return x.host.replace(/^www\./, '') + (p.length > 34 ? p.slice(0, 16) + '…' + p.slice(-16) : p); };
  const pub = (list) => (list || []).filter((s) => !s.internal);
  const hosts = new Set(CASES.flatMap((c) => pub(c.sources).map((s) => new URL(s.url).host)));
  const stickerKey = (c) => (c.legacy ? 'sticker' : `c.${c.slug}.sticker`);
  const srcList = (list) => `
    <ul class="enq-src">${list.map((s) => `
      <li><a href="${esc(s.url)}" target="_blank" rel="noopener" data-app><bdi dir="ltr">${esc(shortUrl(s.url))}</bdi><span class="sr" data-i18n="case.newTab"></span></a> <time datetime="${s.read}">${s.read}</time></li>`).join('')}
    </ul>`;
  const clair = `
  <section class="enq-clair" id="enq-clair" aria-labelledby="enq-clair-h" data-enq-clair>
    <p class="k k--amber" data-i18n="${k('ui.door.label')}"></p>
    <h1 class="enq-clair__h1" data-i18n="${k('ui.door.title')}"></h1>
    <p class="enq-clair__line" data-i18n="${k('ui.door.line')}"></p>
    <img class="enq-clair__art" src="../${E.painting.small}" alt="" data-i18n-alt="${k('ui.door.alt')}">
    <p class="enq-law" data-i18n="${E.law}"></p>
    <h2 class="enq-clair__h" id="enq-clair-h" data-i18n="${k('clair.h')}"></h2>
    <p class="enq-clair__lead" data-i18n="${k('clair.lead')}"></p>${CASES.map((c) => `
    <h2 class="enq-clair__h enq-clair__pair" id="enq-clair-${c.id}"><span class="enq-clair__n">${String(c.n).padStart(2, '0')}</span> <span data-i18n="${k(`season.${c.slug}.pair`)}"></span></h2>
    <ol class="enq-clair__list">${c.depths.map((d) => { const stamp = d.steps[d.steps.length - 1]; return `
      <li class="enq-clair__case">
        <h3 class="enq-clair__d"><span class="enq-clair__n">${d.level}</span> <span data-i18n="${k(`depth.${d.level}.name`)}"></span></h3>
        <p><b data-i18n="${k('clair.claimK')}"></b> <span data-i18n="${k(`c.${d.key}.claim`)}"></span></p>
        <p><b data-i18n="${k('clair.checkedK')}"></b> <span class="enq-clair__v" data-i18n="${k(`ui.opt.${stamp.checked}`)}"></span></p>
        <p data-i18n="${k(`c.${d.key}.${stamp.id}.reveal`)}"></p>
      </li>`; }).join('')}
    </ol>
    <p class="enq-clair__under" data-i18n="${k('ui.under')}"></p>
    <h3 class="enq-clair__d" data-i18n="${k('clair.stickerK')}"></h3>
    <p data-i18n="${k(`${stickerKey(c)}.back`)}"></p>
    <h3 class="enq-clair__d" data-i18n="${k('chart.srcK')}"></h3>${srcList(pub(c.sources))}
    <p class="enq-law" data-i18n="${E.law}"></p>`).join('')}
  </section>`;
  /* what the engine reads: the shell as it is, the chart's rows with what an open one needs before its files come
     (its sticker's sources), the sources case 1 prints, and nothing a reader could not see */
  const strip = (steps) => steps.map(({ src: s0, return: r, ...st }) => (r ? { ...st, return: (({ src: s1, ...rr }) => rr)(r) } : st));
  const stickerSrc = (c) => pub(c.sources).filter((s) => (c.sticker.src || []).includes(s.id)).map((s) => ({ url: s.url, at: shortUrl(s.url), read: s.read }));
  const byFile = new Map(CASES.map((c) => [c.id, c]));
  const client = { ...E, sources: undefined, sticker: undefined,
    season: rows.map((r) => (byFile.has(r.file) ? { ...r, src: stickerSrc(byFile.get(r.file)) } : r)),
    cases: (E.cases || []).map((c) => ({ ...c, steps: strip(c.steps) })) };
  delete client.sources; delete client.sticker;
  let head = headFor('enquetes.html', 'lant.enq', page, [['La Librairie Lanterne', ''], [DICT.fr[k('mast')] || 'Les enquêtes de nuit', 'enquetes.html']]);
  head = swap(head, '<link rel="stylesheet" href="../css/lanterne.css?v={{stamp}}">', '<link rel="stylesheet" href="../css/lanterne.css?v={{stamp}}">\n<link rel="stylesheet" href="../css/enquetes.css?v={{stamp}}">', 1, "the night cases' sheet");
  const html = `${head}
<body class="lt lt-enq" data-lt-enq>
<a class="skip" href="#main" data-i18n="${k('ui.skip')}"></a>
<header class="mast lt-wrap">
  ${WM}
  <a class="mast__back" href="./" data-i18n="lant.ui.library"></a>
  <p class="mast__title" data-i18n="${k('mast')}"></p>
  ${motionBtn(' mast__motion')}
  ${langSwitch()}
  ${menu([['./', 'lant.ui.library'], ...(TOOLS ? [['outils.html', 'lant.tools.mast']] : []), ['./#comptoir', 'lant.shelf.cta'], [WA, 'lant.ui.wa'], ['../', 'lant.ui.studio']], true)}
</header>
<main id="main" class="lt-wrap enq" tabindex="-1">
  <!-- the game's stage: hub/enquetes.js builds every screen here, from #enq-data, the open cases' files (hub/lanterne/
       enq/, added when a case opens) and the dictionaries, with textContent only. Verdicts and reasons are also said in
       the polite region under it. -->
  <div class="enq-app" id="enq" data-enq tabindex="-1" hidden></div>
  <p class="sr" id="enq-live" aria-live="polite"></p>${clair}
</main>
<!-- the Librairie's foot (E-05): the atlases' colophon, the way back and the radio chip -->
${stFoot(`
  <div class="lt-foot">
  <a href="./" class="mast__back" data-i18n="lant.ui.footerBack"></a>
  <div class="lt-rchip" data-radio-chip role="group" data-i18n-aria="radio.chip">
    <span class="lt-rchip__k" data-i18n="radio.chip"></span>
    <button type="button" class="st-rchip__b" data-radio-play aria-pressed="false" data-i18n-aria="radio.play" disabled><svg class="st-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path data-radio-ico-play d="M7 4l13 8-13 8z"/><path data-radio-ico-pause d="M6 4h4v16H6zM14 4h4v16h-4z" hidden/></svg></button>
    <span class="lt-rchip__t" data-radio-title>{{radioFirst}}</span>
    <button type="button" class="st-rchip__b" data-radio-next data-i18n-aria="radio.next" disabled><svg class="st-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 4l11 8-11 8zM17 4h3v16h-3z"/></svg></button>
  </div>
  </div>`)}
<script type="application/json" id="hub-radio">${radioJson}</script>
<!-- hub/lanterne.js reads #lant-data for the page's kind: an empty tools list keeps it to the mast, the menu and the words -->
<script type="application/json" id="lant-data">{"tools":[]}</script>
<script type="application/json" id="enq-data">${JSON.stringify(client).replace(/</g, '\\u003c')}</script>
${scripts(['../lanterne.js', '../radio.js', '../enquetes.js', '../../assets/carry.js'])}
</body>
</html>
`;
  /* the files a case opens with: its structure, and its strings in each language, one NightCases.add() call each */
  const js = (o, what) => `/* GENERATED by scripts/build-hub.mjs (scripts/lib/enquetes.mjs) from hub/src/lanterne/enquetes/${what}: added by hub/enquetes.js when the case opens. */\nNightCases.add(${JSON.stringify(o).replace(/</g, '\\u003c')});\n`;
  const files = [];
  for (const c of CASES) if (!c.legacy) {
    files.push([`hub/lanterne/enq/${c.id}.js`, js({ id: c.id, data: { id: c.id, slug: c.slug, n: c.n, depths: c.depths.map((d) => ({ ...d, steps: strip(d.steps) })) } }, `${c.id}.json`)]);
    for (const l of LANGS) files.push([`hub/lanterne/enq/${c.id}.${l}.js`, js({ id: c.id, lang: l, strings: c.S[l] }, `${c.id}.${l}.json${(c.borrowed || []).includes(l) ? ' (English placeholders: no ' + l + ' file yet)' : ''}`)]);
  }
  /* the strings the engine writes itself: its own, the crew's names, the law line, the radio's */
  const mine = new Set([...SHELL.map(([key]) => key), ...CASES.filter((c) => !c.legacy).flatMap((c) => CASE_SHELL(c).map((rel) => `${P}c.${c.slug}.${rel}`))]);
  const runtime = new Set(Object.keys(DICT.fr).filter((key) => mine.has(key) || /^lant\.cast\.(yasser|kuro|raven|pigeon|ratman)$/.test(key) || key === E.law || key === 'case.newTab' || /^radio\.(play|pause|onair|idle|paused|title|chip)$|^radio\.tracks\./.test(key)));
  return { out: { file: 'hub/lanterne/enquetes.html', name: 'lanterne/enquetes.html', page, html }, runtime, hosts, mast: [['enquetes.html', k('mast')]], files, cases: CASES.map((c) => ({ id: c.id, slug: c.slug, legacy: c.legacy, names: c.names, borrowed: c.borrowed || [] })) };
}
