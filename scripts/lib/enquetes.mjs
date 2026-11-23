/**
 * « Les enquêtes de nuit » (hub/lanterne/enquetes.html, 2026-11-23): the Librairie's night stall as a game. One claim
 * about « web3 » waits; the player bets, points at the proof on a mock screen six times, and stamps the claim. Case 1
 * (Chrome → Brave) at depths 1 to 3.
 *
 * hub/src/lanterne/enquetes.json holds the structure and never a sentence: every string is a key under lant.enq.*,
 * derived here from the ids (the same derivation as hub/enquetes.js, which reads the same file from the page). This
 * module checks the file against the engine's contract, refuses what the contract refuses, and returns the page: the
 * Librairie's mast and menu, the radio's chip, the game's empty stage, and « Le dossier, en clair », the plain text a
 * reader without scripts gets (the engine hides it once it runs).
 *
 * Called by scripts/lib/lanterne.mjs with its helpers. The names this page may print: scripts/lib/enquetes-names.mjs.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const ENQ_PREFIX = 'lant.enq.';
const P = ENQ_PREFIX;
/* a word is a run with a letter or a digit in it: « ? » after its narrow space is not one */
export const words = (s) => String(s).split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
/* what brings the standing 25-10 sentence onto a step: a token, a wallet, Rewards, a crypto-asset, in French or English */
export const CRYPTO_WORD = /\b(tokens?|jetons?|wallets?|portefeuilles?|rewards|crypto[- ]?(?:assets?|actifs?|monnaies?)|cryptos?)\b/i;

/* the keys a step names, with what each one is (so a limit can be held): [key, kind] */
function stepKeys(c, st) {
  const out = [], base = `${P}c.${c.key}.${st.id}`;
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

/* every key the page needs, from the data file: [key, kind] (kind names the limit it is held to, '' for none) */
export function enqKeys(E) {
  const K = [];
  const ui = ['title', 'desc', 'mast', 'shelf.k', 'shelf.t', 'shelf.go', 'ui.skip', 'ui.door.label', 'ui.door.title', 'ui.door.season', 'ui.door.line', 'ui.door.start', 'ui.door.open', 'ui.door.alt',
    'ui.sound.off', 'ui.sound.on', 'ui.sound.aria', 'ui.leave.h', 'ui.leave.t', 'ui.leave.stay', 'ui.leave.go', 'ui.list.on', 'ui.list.off', 'ui.list.short', 'ui.stallAlt', 'ui.stallName', 'ui.stallIdle', 'ui.goal', 'ui.goalNone', 'ui.close', 'ui.toDoor', 'ui.toStall', 'ui.stop',
    'ui.crew.aria', 'ui.crew.h', 'ui.btn.slip', 'ui.btn.chart', 'ui.btn.card', 'ui.btn.replay', 'ui.fact.closed', 'ui.fact.flames', 'ui.fact.slip', 'ui.fact.noSlip', 'ui.fact.tools', 'ui.slipH', 'ui.pvAria',
    'ui.pos', 'ui.posRet', 'ui.posStamp', 'ui.flames', 'ui.betOpen', 'ui.betChip', 'ui.xp', 'ui.hint', 'ui.hint3', 'ui.eye', 'ui.continue', 'ui.closeCase', 'ui.notThis', 'ui.tryAgain', 'ui.right', 'ui.flame', 'ui.answer',
    'ui.wrongSlot', 'ui.slot', 'ui.slotFull', 'ui.slotEmpty', 'ui.placed', 'ui.gone', 'ui.xpGain', 'ui.xpRun', 'ui.xp0', 'ui.sealed', 'ui.says', 'ui.quote', 'ui.noReturn', 'ui.bossNoReturn', 'ui.thirdQueued',
    'ui.addr', 'ui.addrA', 'ui.addrB', 'ui.lawK', 'ui.choose', 'ui.under', 'ui.result', 'ui.end.closed', 'ui.end.score', 'ui.end.flames', 'ui.end.xpFirst', 'ui.end.xpRun', 'ui.end.tool', 'ui.end.stick', 'ui.end.next', 'ui.depth',
    'chart.h', 'chart.notYet', 'chart.yes', 'chart.verdict', 'chart.cta', 'chart.stickerAria', 'chart.back', 'chart.readOn', 'chart.srcK',
    'card.h', 'card.titleK', 'card.xp', 'card.xpAria', 'card.next', 'card.top', 'card.flames', 'card.tools', 'card.and', 'card.depth', 'card.open', 'card.closed', 'card.play', 'card.replay', 'card.aria',
    'clair.h', 'clair.lead', 'clair.claimK', 'clair.checkedK', 'clair.stickerK', 'tool.eye', 'tool.ring', 'tool.ringDoes', 'sticker.name', 'sticker.line', 'season.premise'];
  for (const k of ui) K.push([P + k, '']);
  K.push([P + 'sticker.back', 'back']);
  for (let i = 1; i <= E.sticker.states; i++) K.push([`${P}sticker.state.${i}`, '']);
  const tags = new Set(['back']), opts = new Set(), tpls = new Set();
  for (const c of E.cases) {
    K.push([`${P}c.${c.key}.slip`, 'slip'], [`${P}c.${c.key}.slipTag`, ''], [`${P}c.${c.key}.can`, ''], [`${P}c.${c.key}.claim`, '']);
    for (const b of c.bubbles) K.push([`${P}c.${c.key}.bub.${b.id}`, 'bubble']);
    for (const st of c.steps) {
      tags.add(st.tag); (st.options || []).forEach((o) => opts.add(o));
      for (const o of [st, st.return]) if (o && o.template) tpls.add(o.template);
      K.push(...stepKeys(c, st));
    }
  }
  for (const t of tags) K.push([`${P}ui.tag.${t}`, '']);
  for (const o of opts) K.push([`${P}ui.opt.${o}`, '']);
  for (const t of tpls) if (!['four-tiles', 'web-page-with-bar'].includes(t)) K.push([`${P}tpl.${t}`, '']);
  for (const r of E.rings) K.push([`${P}ring.${r.id}.label`, ''], [`${P}ring.${r.id}.name`, ''], [`${P}ring.${r.id}.line`, 'look'], [`${P}ring.${r.id}.btn`, '']);
  for (const s of E.season) { K.push([`${P}season.${s.id}.pair`, ''], [`${P}season.${s.id}.line`, '']); if (s.playable) K.push([`${P}season.${s.id}.open`, '']); }
  for (let i = 1; i <= E.chapters; i++) K.push([`${P}season.ch.${i}.name`, ''], [`${P}season.ch.${i}.line`, '']);
  for (const d of E.depths) if (d.playable) K.push([`${P}depth.${d.n}.name`, ''], [`${P}depth.${d.n}.verbs`, '']);
  K.push([`${P}depth.1.tool`, ''], [`${P}depth.2.tool`, '']);
  E.titles.forEach((t, i) => K.push([`${P}rank.${i}`, '']));
  for (const [who, ev, n] of ENQ_VOICES) for (const i of n) K.push([`${P}v.${who}.${ev}.${i}`, 'bubble']);
  return K;
}
/* the crew's lines the engine speaks (hub/enquetes.js names the same ones) */
export const ENQ_VOICES = [['kuro', 'hit', [0, 1, 2, 3, 4]], ['kuro', 'miss', [0, 1, 2, 3, 4]], ['kuro', 'sticker', [0]], ['yasser', 'greet', [0]], ['yasser', 'brief', [0]], ['yasser', 'noFlameLit', [0]],
  ['pigeon', 'idle', [2]], ['pigeon', 'queued', [0]], ['raven', 'idle', [2]], ['ratman', 'idle', [0, 2]], ['ratman', 'hint', [0, 1, 2]], ['ratman', 'toolArrives', [0]]];
/* left out of the page (tapes, the journal, the review round): never named while they are */
export const LEFT_OUT = { fr: /magnétophones?|cassettes?|\bjournal\b|\brévisions?\b/i, en: /\brecorders?\b|\btapes?\b|\bjournal\b|\breviews?\b/i, ar: /آلة التسجيل|مسجّل|مسجِّل|كاسيت|شريط التسجيل|دفتر اليوميات|مراجعة/ };
const LIMIT = { slip: 20, prompt: 20, why: 20, hint: 20, reveal: 20, bubble: 12, look: 25, after: 5, back: 60, kuro: 3 };

export function enquetes(h) {
  const { LS, HUB, DICT, LANGS, fail, notes, esc, json, need, headFor, swap, menu, langSwitch, scripts, radioJson, WA, TOOLS } = h;
  const at = 'hub/src/lanterne/enquetes.json';
  const E = json(join(LS, 'enquetes.json'));
  if (!E) return null;
  const bad = (m) => fail(`${at}: ${m}`);

  /* ---------------- the contract (SPEC section 10) ---------------- */
  const srcIds = new Set((E.sources || []).map((s) => s.id));
  for (const s of E.sources || []) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s.read || '')) bad(`source ${s.id}: read is the day its page was read (YYYY-MM-DD)`);
    if (!s.internal) { let u = null; try { u = new URL(s.url); } catch (e) {} if (!u || u.protocol !== 'https:') bad(`source ${s.id}: url is not an https address`); }
  }
  if (E.law !== 'lant.tools.risk.crypto') bad('law names the site\'s standing sentence, lant.tools.risk.crypto, and no second copy');
  for (const f of [E.painting.src, E.painting.small, E.art.seal, E.art.sprite, ...Object.values(E.art.faces), ...Object.values(E.art.tools), ...E.depths.map((d) => d.icon)]) if (!existsSync(join(HUB, f))) bad(`${f} is not a file under hub/`);
  if (E.rings.length > 4) bad('four rings at most on the painting');
  for (const r of E.rings) if (!(r.at[0] > 0 && r.at[0] < 1 && r.at[1] > 0 && r.at[1] < 1)) bad(`ring ${r.id}: its centre is a fraction of the crop`);
  const COUNT = { screen: [3, 5], page: [3, 4], notes: [3, 3], duo: [2, 2], build: [2, 6] };
  const bodyOk = (w, o, ret) => {
    if (!['screen', 'page', 'notes', 'duo', 'diff', 'build'].includes(o.kind)) { bad(`${w}: kind "${o.kind}" is not one of the engine's`); return; }
    if (!Array.isArray(o.src) || !o.src.length) bad(`${w}: no src`);
    for (const s of o.src || []) if (!srcIds.has(s)) bad(`${w}: src "${s}" is not in sources`);
    if (o.kind === 'diff') { if (!Array.isArray(o.a) || !Array.isArray(o.b) || o.a.length !== o.b.length || !(o.answer >= 0 && o.answer < o.b.length)) bad(`${w}: a diff is two addresses of as many pieces, and the index of the piece that gives it away`); return; }
    const n = (o.parts || []).length, [lo, hi] = COUNT[o.kind];
    if (n < lo || n > hi) bad(`${w}: ${n} parts, a ${o.kind} takes ${lo === hi ? lo : `${lo} to ${hi}`}`);
    const ids = (o.parts || []).map((t) => t.id);
    if (new Set(ids).size !== ids.length) bad(`${w}: two parts with one id`);
    for (const t of o.parts || []) {
      if ('label' in t || 'kuro' in t) bad(`${w}/${t.id}: an old label or kuro field`);
      if (!t.text && !t.lit && !t.caption) bad(`${w}/${t.id}: a part with neither text nor caption`);
      if (!t.text && !t.lit && !t.glyph) bad(`${w}/${t.id}: a part without text carries a glyph to draw`);
      if (['screen', 'page', 'duo'].includes(o.kind) && !t.after) bad(`${w}/${t.id}: no after (what the mock shows when it is tapped)`);
    }
    if (o.kind === 'build') { if (!Array.isArray(o.answer) || o.answer.length < 2 || o.answer.length > 3 || o.answer.some((a) => !ids.includes(a))) bad(`${w}: a built sentence has two or three slots, each answered by one of its chips`); }
    else if (!ids.includes(o.answer)) bad(`${w}: its answer "${o.answer}" is not one of its parts`);
    for (const l of o.lawWith || []) if (!ids.includes(l)) bad(`${w}: lawWith "${l}" is not one of its parts`);
    if (ret && (o.return || o.hint)) bad(`${w}: a return has no return of its own`);
  };
  for (const c of E.cases) {
    const w = `case ${c.id}`;
    const scored = c.steps.filter((s) => s.kind !== 'bet' && s.kind !== 'stamp');
    const bet = c.steps[0], stamp = c.steps[c.steps.length - 1];
    if (!bet || bet.kind !== 'bet' || !stamp || stamp.kind !== 'stamp') { bad(`${w}: a case opens on its bet and closes on its stamp`); continue; }
    if (bet.options.join() !== stamp.options.join()) bad(`${w}: the bet and the stamp do not offer the same three verdicts`);
    if (!stamp.options.includes(stamp.checked)) bad(`${w}: the checked verdict is not one of the stamp's`);
    if (scored.length !== 6) bad(`${w}: ${scored.length} scored answers, six make a case`);
    if (scored.filter((s) => s.boss).length !== 1 || !scored[scored.length - 1].boss) bad(`${w}: the objection is one step, the last scored one`);
    if (c.bubbles.length !== 2 || c.bubbles[0].after !== (scored[2] || {}).id || c.bubbles[1].after !== (scored[4] || {}).id) bad(`${w}: case bubbles sit after scored answers 3 and 5, and nowhere else`);
    for (const b of c.bubbles) if (!['yasser', 'pigeon', 'ratman', 'raven'].includes(b.who)) bad(`${w}: bubble ${b.id} is spoken by one of the crew, never by Kūro`);
    for (const s of [bet, stamp]) for (const x of s.src || []) if (!srcIds.has(x)) bad(`${w}/${s.id}: src "${x}" is not in sources`);
    for (const s of scored) {
      bodyOk(`${w}/${s.id}`, s, false);
      if (!s.return) bad(`${w}/${s.id}: no return`); else { bodyOk(`${w}/${s.id} (return)`, s.return, true); if (s.return.kind !== s.kind) bad(`${w}/${s.id}: its return is another kind (${s.return.kind}); a return is the same kind on a new surface`); }
    }
  }
  if (E.season.filter((s) => s.playable).length !== 1 || !E.season[0].playable) bad('one row of the chart is written: the first');

  /* ---------------- the keys: every one in every language, held to its limit ---------------- */
  const KEYS = enqKeys(E);
  /* until the dictionaries hold them (hub/src/i18n/*.json, lant.enq.*), a build may borrow the English of a manifest:
     ENQ_PLACEHOLDERS=<keys-en.json>. Without it a missing key is refused, as everywhere else in the Librairie. */
  let PH = null;
  if (process.env.ENQ_PLACEHOLDERS) { try { PH = JSON.parse(readFileSync(process.env.ENQ_PLACEHOLDERS, 'utf8')); } catch (e) { fail(`ENQ_PLACEHOLDERS: ${e.message}`); } }
  const borrowed = { fr: 0, en: 0, ar: 0 };
  for (const [k] of KEYS) for (const l of LANGS) {
    if (DICT[l][k] != null) continue;
    if (PH && PH[k] != null) { DICT[l][k] = PH[k]; borrowed[l]++; }
    else if (l === 'fr') fail(`« Les enquêtes de nuit »: no key ${k} in hub/src/i18n/fr.json`);
    else fail(`« Les enquêtes de nuit »: key ${k} is missing in ${l}`);
  }
  for (const l of LANGS) if (borrowed[l]) notes.push(`« Les enquêtes de nuit »: ${borrowed[l]} ${l} strings are English placeholders (ENQ_PLACEHOLDERS), not yet in hub/src/i18n/${l}.json`);
  need(E.law, at);
  for (const [k, kind] of KEYS) {
    const max = LIMIT[kind]; if (!max) continue;
    for (const l of LANGS) {
      const v = DICT[l][k]; if (v == null) continue;
      const n = words(v);
      if (n > max || (kind === 'kuro' && n < 1)) (l === 'ar' ? (m) => notes.push(m) : fail)(`${l} ${k}: ${n} words, ${max} at most for a ${kind} (« ${v.slice(0, 60)} »)`);
    }
  }
  /* the law line: a step whose French or English names a token, a wallet, Rewards or a crypto-asset carries law, or lawWith for that part */
  for (const c of E.cases) for (const st of c.steps) {
    const check = (o, base, w) => {
      if (o.law) return;
      const own = (o.parts || []).map((t) => `${base}.p.${t.id}.`), marked = new Set(o.lawWith || []);
      for (const [k] of stepKeys(c, st).filter(([k]) => k.startsWith(base + '.') && (base.endsWith('.r') || !k.startsWith(base + '.r.')))) for (const l of ['fr', 'en']) {
        const v = DICT[l][k]; if (v == null || !CRYPTO_WORD.test(v)) continue;
        const pid = (own.find((p) => k.startsWith(p)) || '').slice(base.length + 3, -1);
        if (pid && marked.has(pid)) continue;
        fail(`${at} ${w}: ${l} ${k} names « ${v.match(CRYPTO_WORD)[0]} » and the step carries neither law nor lawWith for it`);
      }
    };
    const base = `${P}c.${c.key}.${st.id}`;
    check(st, base, `${c.id}/${st.id}`);
    if (st.return) check(st.return, `${base}.r`, `${c.id}/${st.id} (return)`);
  }
  if (E.cases.some((c) => c.crypto) && !E.cases.some((c) => c.steps.some((s) => s.law || s.lawWith))) bad('a case marked crypto pins the law line on no step');
  /* what was left out is promised nowhere: no string of the page names the recorder, a tape, the journal or a review
     (the stall has two tools, the eye flower and the ring) */
  for (const [key] of KEYS) for (const l of LANGS) {
    const v = DICT[l][key], m = v == null ? null : String(v).match(LEFT_OUT[l]);
    if (m) fail(`« Les enquêtes de nuit »: ${l} ${key} names « ${m[0]} », which the page does not have (« ${String(v).slice(0, 60)} »)`);
  }

  /* ---------------- the page ---------------- */
  const page = 'enquetes', k = (s) => P + s;
  const src = (E.sources || []).filter((s) => !s.internal);
  const hosts = new Set(src.map((s) => new URL(s.url).host));
  const shortUrl = (u) => { const x = new URL(u), p = x.pathname.replace(/\/$/, ''); return x.host.replace(/^www\./, '') + (p.length > 34 ? p.slice(0, 16) + '…' + p.slice(-16) : p); };
  const playable = E.depths.filter((d) => d.playable);
  const clair = `
  <section class="enq-clair" id="enq-clair" aria-labelledby="enq-clair-h" data-enq-clair>
    <p class="k k--amber" data-i18n="${k('ui.door.label')}"></p>
    <h1 class="enq-clair__h1" data-i18n="${k('ui.door.title')}"></h1>
    <p class="enq-clair__line" data-i18n="${k('ui.door.line')}"></p>
    <img class="enq-clair__art" src="../${E.painting.small}" alt="" data-i18n-alt="${k('ui.door.alt')}">
    <p class="enq-law" data-i18n="${E.law}"></p>
    <h2 class="enq-clair__h" id="enq-clair-h" data-i18n="${k('clair.h')}"></h2>
    <p class="enq-clair__lead" data-i18n="${k('clair.lead')}"></p>
    <ol class="enq-clair__list">${E.cases.map((c) => { const stamp = c.steps[c.steps.length - 1]; return `
      <li class="enq-clair__case">
        <h3 class="enq-clair__d"><span class="enq-clair__n">${c.level}</span> <span data-i18n="${k(`depth.${c.level}.name`)}"></span></h3>
        <p><b data-i18n="${k('clair.claimK')}"></b> <span data-i18n="${k(`c.${c.key}.claim`)}"></span></p>
        <p><b data-i18n="${k('clair.checkedK')}"></b> <span class="enq-clair__v" data-i18n="${k(`ui.opt.${stamp.checked}`)}"></span></p>
        <p data-i18n="${k(`c.${c.key}.${stamp.id}.reveal`)}"></p>
      </li>`; }).join('')}
    </ol>
    <p class="enq-clair__under" data-i18n="${k('ui.under')}"></p>
    <h3 class="enq-clair__d" data-i18n="${k('clair.stickerK')}"></h3>
    <p data-i18n="${k('sticker.back')}"></p>
    <h3 class="enq-clair__d" data-i18n="${k('chart.srcK')}"></h3>
    <ul class="enq-src">${src.map((s) => `
      <li><a href="${esc(s.url)}" target="_blank" rel="noopener" data-app><bdi dir="ltr">${esc(shortUrl(s.url))}</bdi><span class="sr" data-i18n="case.newTab"></span></a> <time datetime="${s.read}">${s.read}</time></li>`).join('')}
    </ul>
    <p class="enq-law" data-i18n="${E.law}"></p>
  </section>`;
  /* what the engine reads: the file as it is, the sources it prints, and nothing a reader could not see */
  const client = { ...E, sources: src.map((s) => ({ id: s.id, url: s.url, at: shortUrl(s.url), read: s.read })), cases: E.cases.map((c) => ({ ...c, steps: c.steps.map(({ src: s0, return: r, ...st }) => (r ? { ...st, return: (({ src: s1, ...rr }) => rr)(r) } : st)) })) };
  let head = headFor('enquetes.html', 'lant.enq', page, [['La Librairie Lanterne', ''], [DICT.fr[k('mast')] || 'Les enquêtes de nuit', 'enquetes.html']]);
  head = swap(head, '<link rel="stylesheet" href="../css/lanterne.css?v={{stamp}}">', '<link rel="stylesheet" href="../css/lanterne.css?v={{stamp}}">\n<link rel="stylesheet" href="../css/enquetes.css?v={{stamp}}">', 1, "the night cases' sheet");
  const html = `${head}
<body class="lt lt-enq" data-lt-enq>
<a class="skip" href="#main" data-i18n="${k('ui.skip')}"></a>
<header class="mast lt-wrap">
  <a class="mast__word" href="../" dir="ltr" data-i18n-aria="nav.home">Numidea Labs</a>
  <a class="mast__back" href="./" data-i18n="lant.ui.library"></a>
  <p class="mast__title" data-i18n="${k('mast')}"></p>
  <button type="button" class="motion js-only" data-lt-motion aria-pressed="true" data-i18n-title="lant.ui.motionHint"><span class="motion__dot" aria-hidden="true"></span><span data-i18n="lant.ui.motion"></span></button>
  ${langSwitch()}
  ${menu([['./', 'lant.ui.library'], ...(TOOLS ? [['outils.html', 'lant.tools.mast']] : []), ['./#comptoir', 'lant.shelf.cta'], [WA, 'lant.ui.wa'], ['../', 'lant.ui.studio']])}
</header>
<main id="main" class="lt-wrap enq" tabindex="-1">
  <!-- the game's stage: hub/enquetes.js builds every screen here, from #enq-data and the dictionaries, with textContent
       only. Verdicts and reasons are also said in the polite region under it. -->
  <div class="enq-app" id="enq" data-enq tabindex="-1" hidden></div>
  <p class="sr" id="enq-live" aria-live="polite"></p>${clair}
</main>
<footer class="foot lt-foot lt-wrap">
  <a href="./" class="mast__back" data-i18n="lant.ui.footerBack"></a>
  <div class="lt-rchip" data-radio-chip role="group" data-i18n-aria="radio.chip">
    <span class="lt-rchip__k" data-i18n="radio.chip"></span>
    <button type="button" class="st-rchip__b" data-radio-play aria-pressed="false" data-i18n-aria="radio.play" disabled><svg class="st-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path data-radio-ico-play d="M7 4l13 8-13 8z"/><path data-radio-ico-pause d="M6 4h4v16H6zM14 4h4v16h-4z" hidden/></svg></button>
    <span class="lt-rchip__t" data-radio-title>{{radioFirst}}</span>
    <button type="button" class="st-rchip__b" data-radio-next data-i18n-aria="radio.next" disabled><svg class="st-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 4l11 8-11 8zM17 4h3v16h-3z"/></svg></button>
  </div>
  <a href="../" data-i18n="lant.ui.studio"></a>
  <span data-i18n="footer.line"></span>
</footer>
<script type="application/json" id="hub-radio">${radioJson}</script>
<!-- hub/lanterne.js reads #lant-data for the page's kind: an empty tools list keeps it to the mast, the menu and the words -->
<script type="application/json" id="lant-data">{"tools":[]}</script>
<script type="application/json" id="enq-data">${JSON.stringify(client).replace(/</g, '\\u003c')}</script>
${scripts(['../lanterne.js', '../radio.js', '../enquetes.js', '../../assets/carry.js'])}
</body>
</html>
`;
  /* the strings the engine writes itself: its own, the crew's names, the law line, the radio's */
  const mine = new Set(KEYS.map(([key]) => key));
  const runtime = new Set(Object.keys(DICT.fr).filter((key) => mine.has(key) || /^lant\.cast\.(yasser|kuro|raven|pigeon|ratman)$/.test(key) || key === E.law || key === 'case.newTab' || /^radio\.(play|pause|onair|idle|paused|title|chip)$|^radio\.tracks\./.test(key)));
  return { out: { file: 'hub/lanterne/enquetes.html', name: 'lanterne/enquetes.html', page, html }, runtime, hosts, mast: [['enquetes.html', k('mast')]] };
}
