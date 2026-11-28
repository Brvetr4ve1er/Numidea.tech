/* Numidea Labs — the game layer (2026-11-26; the spec: « Numidea game loop spec »). One currency, Encre, earned
   everywhere and never spent; ten ranks; a card that lands when a district is finished; a commission at the end of a book.
   Encre is never stored. It is added up, on every load and after every finish, from the keys the pages already keep:
   the atlases ('numidea-lanterne-<slug>', or an old manual's stamps the atlas has not moved yet, read, never rewritten),
   the night cases ('numidea-lanterne-enquetes', XP ÷ pts.enqDiv, 2: a case of three depths at most 90), Kūro's seals ('numidea-seals') and the episodes
   finished (kept here). This file writes one key only, 'numidea-save' (v1):
     { v: 1, rank: 1..10 (the highest reached; a rank is never taken back), seen: [ranks whose card has played],
       world: { flag: value } (what the hub remembers), ep: { id: { done: true, t: ms } }, name: '',
       last: the atlas last opened (its slug; the home menu's « Reprendre » goes there, 2026-11-27) }
   A save that is not an object, or is broken in parts, is rebuilt from what can be read (the broken parts dropped, never
   the whole progress: that lives in the other keys); a save from a newer version is read and never written over.
   Two parts. The CORE has no page in it, so scripts/game-sim.mjs runs it in Node. The VIEW: the rank chip in the atlas
   bar, the card (one impact on the site's tempo, nothing that loops; a still under reduced motion or « Mouvement »
   off), the reset on the shelf. Words: lant.ui.game.* in the page's dictionary, textContent only. Data: #game-data,
   written by the build from hub/src/lanterne/game.json. Game moments are counted as virtual views of /go/game/<what>
   (assets/carry.js, numideaGame), as contact clicks already are. Nothing is sent anywhere else. */
(function (G) {
  'use strict';

  /* ======================= the core ======================= */
  var KEY = 'numidea-save', V = 1;
  var isObj = function (o) { return !!o && typeof o === 'object' && !Array.isArray(o); };
  var isInt = function (x, lo, hi) { return typeof x === 'number' && x === Math.floor(x) && x >= lo && x <= hi; };
  function blank() { return { v: V, rank: 1, seen: [1], world: {}, ep: {}, name: '' }; }
  /* raw: the stored string (or null). Returns { s, fresh: nothing was stored, bad: something had to be dropped, future } */
  function load(raw, nRanks) {
    var s = blank(), o = null, bad = false;
    if (raw == null) return { s: s, fresh: true, bad: false, future: false };
    try { o = JSON.parse(raw); } catch (e) { return { s: s, fresh: false, bad: true, future: false }; }
    if (!isObj(o)) return { s: s, fresh: false, bad: true, future: false };
    var future = typeof o.v === 'number' && o.v > V;
    /* v0 (no v, the spec's draft shape) and v1 read the same fields */
    if (isInt(o.rank, 1, nRanks)) s.rank = o.rank; else if (o.rank != null) bad = true;
    if (Array.isArray(o.seen)) { s.seen = []; o.seen.forEach(function (r) { if (isInt(r, 1, nRanks) && s.seen.indexOf(r) < 0) s.seen.push(r); else bad = true; }); if (s.seen.indexOf(1) < 0) s.seen.unshift(1); }
    else if (o.seen != null) bad = true;
    if (isObj(o.world)) Object.keys(o.world).forEach(function (k) { var v = o.world[k]; if (/^[a-z0-9_]{1,40}$/.test(k) && (typeof v === 'boolean' || typeof v === 'number' || (typeof v === 'string' && v.length <= 80))) s.world[k] = v; else bad = true; });
    else if (o.world != null) bad = true;
    if (isObj(o.ep)) Object.keys(o.ep).forEach(function (k) { var e = o.ep[k]; if (/^[a-z0-9-]{1,40}$/.test(k) && isObj(e) && e.done === true) s.ep[k] = { done: true, t: typeof e.t === 'number' ? e.t : 0 }; else bad = true; });
    else if (o.ep != null) bad = true;
    if (typeof o.name === 'string') s.name = o.name.slice(0, 40);
    if (typeof o.last === 'string' && /^[a-z0-9-]{1,40}$/.test(o.last)) s.last = o.last; else if (o.last != null) bad = true;
    return { s: s, fresh: false, bad: bad || o.v !== V && !future, future: future };
  }
  /* an atlas's finished districts: its own key, else the old manual's stamps it would migrate (read only) */
  function bookDone(get, b) {
    var S = get(b.store), ids = [].concat.apply([], b.acts.map(function (a) { return a.d; }));
    if (isObj(S) && S.v === 1 && isObj(S.d)) return ids.filter(function (id) { var r = S.d[id]; return !!(r && r.a && r.x); });
    var got = [];
    [].concat(b.migrate || []).forEach(function (k) { var old = get(k); if (Array.isArray(old)) old.forEach(function (id) { if (ids.indexOf(id) > -1 && got.indexOf(id) < 0) got.push(id); }); });
    return got;
  }
  function enqXp(get, store) {
    var S = get(store), n = 0;
    if (!isObj(S) || !isObj(S.by)) return 0;
    Object.keys(S.by).forEach(function (k) { var e = S.by[k]; if (isObj(e) && Array.isArray(e.x)) e.x.forEach(function (x) { if (isInt(x, 0, 1e6)) n += x; }); });
    return n;
  }
  function rankAt(D, encre) { var r = 1; D.ranks.forEach(function (R, i) { if (encre >= R.at) r = i + 1; }); return r; }
  /* the whole profile: Encre and where it comes from, each book's count, the rank (earned now, and shown: never lower than the highest reached) */
  function compute(D, get, s) {
    var P = { encre: 0, parts: { district: 0, side: 0, act: 0, book: 0, enq: 0, seal: 0, episode: 0 }, books: {} }, pts = D.pts;
    D.books.forEach(function (b) {
      var got = bookDone(get, b), all = 0;
      b.acts.forEach(function (a) {
        var n = a.d.filter(function (id) { return got.indexOf(id) > -1; }).length;
        all += a.d.length;
        if (a.side) P.parts.side += n; else P.parts.district += n;
        if (n === a.d.length) P.parts.act++;
      });
      if (got.length === all) P.parts.book++;
      P.books[b.slug] = { n: got.length, N: all, done: got };
    });
    var xp = D.enq ? enqXp(get, D.enq.store) : 0;
    var seals = get(D.seals.key), ns = 0;
    if (Array.isArray(seals)) seals.forEach(function (x, i) { if (typeof x === 'string' && seals.indexOf(x) === i) ns++; });
    P.parts.enq = Math.floor(xp / pts.enqDiv);
    P.parts.seal = Math.min(ns, D.seals.n);
    P.parts.episode = s ? Object.keys(s.ep).length : 0;
    P.encre = P.parts.district * pts.district + P.parts.side * pts.side + P.parts.act * pts.act + P.parts.book * pts.book + P.parts.enq + P.parts.seal * pts.seal + P.parts.episode * pts.episode;
    P.earned = rankAt(D, P.encre);
    P.rank = Math.max(P.earned, s ? s.rank : 1);
    var nx = D.ranks[P.rank];          // the next rank (index = rank, since ranks are 1-based)
    P.next = nx ? { rank: P.rank + 1, at: nx.at, left: Math.max(0, nx.at - P.encre) } : null;
    var from = D.ranks[P.rank - 1].at;
    P.p = nx ? Math.max(0, Math.min(1, (P.encre - from) / (nx.at - from))) : 1;
    return P;
  }
  var Core = { KEY: KEY, V: V, blank: blank, load: load, bookDone: bookDone, compute: compute, rankAt: rankAt };
  G.NumideaGameCore = Core;
  if (!G.document) return;

  /* ======================= the view ======================= */
  var d = document, root = d.documentElement;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var el = function (tag, cls, text) { var n = d.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  var D = null, FR = {};
  try { D = JSON.parse($('#game-data').textContent); } catch (e) { return; }
  try { FR = JSON.parse($('#hub-fr').textContent); } catch (e) {}
  var lang = function () { return G.NUMIDEA_LANG || root.getAttribute('lang') || 'fr'; };
  var t = function (k, v) {
    var D2 = (G.HUB_I18N && G.HUB_I18N[lang()]) || {}, s = D2[k] != null ? D2[k] : (FR[k] != null ? FR[k] : '');
    return v ? String(s).replace(/\{(\w+)\}/g, function (m, x) { return v[x] != null ? v[x] : m; }) : s;
  };
  var num = function (n) { try { return n.toLocaleString(lang() === 'ar' ? 'ar-DZ-u-nu-latn' : lang()); } catch (e) { return String(n); } };
  var get = function (k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
  var raw = null; try { raw = localStorage.getItem(KEY); } catch (e) {}
  var L = load(raw, D.ranks.length), s = L.s;
  var write = function () { if (L.future) return; try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };
  var T0 = Date.now();
  var count = function (what) { try { if (G.numideaGame) G.numideaGame(what); } catch (e) {} };
  var P = compute(D, get, s);
  /* a first visit, or a save rebuilt: the rank already earned is taken quietly (no card for progress made before this layer) */
  if (L.fresh || L.bad) { s.rank = P.rank; s.seen = []; for (var i = 1; i <= P.rank; i++) s.seen.push(i); write(); }
  var motionOn = function () { return !matchMedia('(prefers-reduced-motion: reduce)').matches && !root.classList.contains('motion-off'); };
  var rankName = function (r) { return t('lant.ui.game.r.' + r); };

  /* ---- the chip: rank and Encre in the atlas bar, to the passport ---- */
  var chip = null;
  /* the chip sits in the masthead only where it fits on the line: shown only if nothing in the masthead changes row
     for it; where it would push a neighbour down (the shelf's language pill onto its call to action's row at 1280,
     CLS 0.014 on 2026-11-26: a masthead already on two rows, so its height alone did not tell) it stays hidden.
     Nor does it cost the page its title: where the atlas's name would be cut short for it (web3-modules at 1440,
     « Les neuf modules. » under « Journal »), it stays hidden too.
     The fit is measured again when the web fonts land: a ResizeObserver runs after layout and before paint, so a
     chip that fitted in the fallback type and not in the face is never drawn pushing; once hidden it stops watching. */
  var mast = null, nav = null, ro = null;
  var snap = function () {
    var o = [mast.offsetHeight], ti = mast.querySelector('.mast__title');
    if (ti) o.push(ti.scrollWidth > ti.clientWidth + 1 ? 'cut' : 'whole');
    [].forEach.call(mast.querySelectorAll(':scope > *, .mast__nav > *'), function (e) {
      if (e === chip || e === nav) return;
      o.push(Math.round(e.getBoundingClientRect().top));
    });
    return o.join(' ');
  };
  var fit = function () {
    chip.hidden = true; var before = snap();
    chip.hidden = false; if (snap() !== before) chip.hidden = true;
    return !chip.hidden;
  };
  function paintChip() {
    if (!chip) {
      nav = $('.mast__nav'); if (!nav) return;
      mast = nav.closest('header') || nav.parentNode;
      chip = el('a', 'gm-chip'); chip.href = D.passport; chip.setAttribute('data-gm-chip', '');
      nav.appendChild(chip);
    }
    chip.textContent = '';
    var cs = el('span', 'gm-rank__seal'); cs.setAttribute('aria-hidden', 'true'); cs.appendChild(el('span', 'gm-num', String(P.rank)));
    chip.appendChild(cs); chip.appendChild(el('span', 'gm-chip__t', num(P.encre) + ' ' + t('lant.ui.game.unit')));
    chip.style.setProperty('--p', String(P.p)); /* the hairline under the chip: the road to the next rank */
    chip.setAttribute('aria-label', t('lant.ui.game.chip', { rank: rankName(P.rank), n: num(P.encre) })); chip.title = chip.getAttribute('aria-label');
    /* the review's shorter chip (seal + Encre), shown by the trunk's rule: only where it moves nothing else in the masthead and cuts no title, checked again when the faces land */
    if (fit() && !ro && G.ResizeObserver) {
      ro = new ResizeObserver(function () { if (!fit()) ro.disconnect(); });
      ro.observe(mast); ro.observe(chip);
    }
  }

  /* ---- the Find (2026-11-28, the Zelda-feel plan): each rank from 2 gives a lantern part, held up by Yasser ----
     The parts are drawn here as small felt-tip icons (48 x 48, ink stroke): f = amber fill, p = paper, k = ink, n = a bare line,
     e = amber with its hole cut out. No file to load, nothing borrowed: our own shapes. */
  var NS = 'http://www.w3.org/2000/svg';
  var ICONS = {
    wick: [['M24 5c5 7 7 11 7 15a7 7 0 0 1-14 0c0-4 2-8 7-15z', 'f'], ['M24 29c-3 3 3 5 0 8s3 5 0 8', 'n']],
    flint: [['M8 36c-2-8 4-16 12-19 8-3 17-1 20 6 3 8-3 14-12 16-9 2-18 3-20-3z', 'f'], ['M15 31c4 1 9 0 13-3', 'n'], ['M35 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z', 'f']],
    glass: [['M19 5h10v6c6 4 9 10 9 17 0 8-6 14-14 14S10 36 10 28c0-7 3-13 9-17z', 'p'], ['M16 25c0-4 2-7 4-9', 'n'], ['M19 5h10', 'n']],
    key: [['M9 24a8 8 0 1 0 16 0a8 8 0 1 0-16 0z', 'f'], ['M14 24a3 3 0 1 0 6 0a3 3 0 1 0-6 0z', 'p'], ['M25 24h17M36 24v7M41 24v5', 'n']],
    ring: [['M24 9a15 15 0 1 0 .01 0zM24 16a8 8 0 1 1-.01 0z', 'e'], ['M14 18c2-3 5-5 8-5', 'n']],
    seal: [['M24 7a17 17 0 1 0 .01 0z', 'f'], ['M24 26c-5 0-8 4-8 7 0 2 2 3 4 3h8c2 0 4-1 4-3 0-3-3-7-8-7z', 'k'], ['M14 22a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0-5.2 0zM19 16a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0-5.2 0zM24.8 16a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0-5.2 0zM28.8 22a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0-5.2 0z', 'k']],
    handle: [['M8 34a16 16 0 0 1 32 0', 'w'], ['M5 34a3 3 0 1 0 6 0a3 3 0 1 0-6 0zM37 34a3 3 0 1 0 6 0a3 3 0 1 0-6 0z', 'f']],
    oil: [['M24 5c7 10 12 17 12 25a12 12 0 0 1-24 0c0-8 5-15 12-25z', 'f'], ['M18 31c0 4 3 7 6 7', 'n']],
    lantern: [['M21 5a3 3 0 1 0 6 0a3 3 0 1 0-6 0z', 'n'], ['M15 13h18l-4-5H19z', 'f'], ['M17 13h14v21H17z', 'p'], ['M24 17c3 4 4 6 4 9a4 4 0 0 1-8 0c0-3 1-5 4-9z', 'f'], ['M13 34h22v6H13z', 'f']]
  };
  function icon(obj) {
    var sv = d.createElementNS(NS, 'svg'); sv.setAttribute('viewBox', '0 0 48 48'); sv.setAttribute('class', 'gm-ico'); sv.setAttribute('aria-hidden', 'true'); sv.setAttribute('focusable', 'false');
    (ICONS[obj] || ICONS.lantern).forEach(function (q) {
      var pa = d.createElementNS(NS, 'path'); pa.setAttribute('d', q[0]); pa.setAttribute('class', 'gm-ico__' + q[1]);
      if (q[1] === 'e') pa.setAttribute('fill-rule', 'evenodd');
      sv.appendChild(pa);
    });
    return sv;
  }

  /* ---- the chime: our own four notes (E5 A5 G5 D6, a rising sixth then a turn), drawn by the browser itself, no file.
     Off unless the visitor turns it on from the card (the choice is kept in this browser); never with motion reduced or off. */
  var SOUND = 'numidea-sound', ac = null;
  var soundOn = function () { try { return localStorage.getItem(SOUND) === 'on'; } catch (e) { return false; } };
  function chime(kind) {
    var AC = G.AudioContext || G.webkitAudioContext; if (!AC) return;
    try {
      ac = ac || new AC(); if (ac.state === 'suspended' && ac.resume) ac.resume();
      var now = ac.currentTime + 0.02, out = ac.createGain(); out.gain.value = 0.16; out.connect(ac.destination);
      var notes = kind === 'find' ? [[659.25, 0], [880, 0.11], [783.99, 0.22], [1174.66, 0.38]] : [[1046.5, 0], [1567.98, 0.08]];
      notes.forEach(function (n, i) {
        var g = ac.createGain(), o = ac.createOscillator(), o2 = ac.createOscillator(), g2 = ac.createGain(), at = now + n[1], len = i === notes.length - 1 ? 0.9 : 0.35;
        o.type = 'triangle'; o.frequency.value = n[0]; o2.type = 'sine'; o2.frequency.value = n[0] * 2; g2.gain.value = 0.25;
        g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(1, at + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, at + len);
        o.connect(g); o2.connect(g2); g2.connect(g); g.connect(out);
        o.start(at); o2.start(at); o.stop(at + len + 0.05); o2.stop(at + len + 0.05);
      });
    } catch (e) {}
  }
  function soundBtn(kind) {
    var b = el('button', 'gm-btn gm-card__snd', t('lant.ui.game.sound')); b.type = 'button';
    b.setAttribute('aria-pressed', String(soundOn())); b.title = t('lant.ui.game.soundK');
    b.addEventListener('click', function () {
      var on = !soundOn(); try { localStorage.setItem(SOUND, on ? 'on' : 'off'); } catch (e) {}
      b.setAttribute('aria-pressed', String(on)); if (on) chime(kind);
    });
    return b;
  }

  /* ---- the card ---- */
  var card = null, live = null;
  var bookName = function (slug) { return t(D.titles[slug] || '').replace(/[\s.。!?]+$/, ''); };
  function shell() {
    if (card) return;
    live = el('p', 'sr'); live.setAttribute('aria-live', 'polite'); live.setAttribute('data-gm-live', ''); d.body.appendChild(live);
    card = el('aside', 'gm-card'); card.hidden = true; card.setAttribute('data-gm-card', ''); card.setAttribute('aria-labelledby', 'gm-card-h');
    d.body.appendChild(card);
    card.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(true); });
  }
  function close(back) { if (!card || card.hidden) return; var had = card.contains(d.activeElement); card.hidden = true; if (back && had && last && last.focus) last.focus(); }
  var last = null;
  /* o: { gain, up: [ranks newly reached], book: slug finished now } */
  function show(o) {
    shell(); last = d.activeElement;
    card.textContent = '';
    card.classList.toggle('gm-card--com', !!o.book);
    var box = el('div', 'gm-card__in');
    var summary = [];
    /* the Find: a rank reached outside a book's end, and that rank has a lantern part (every rank from 2) */
    var fr = o.up.length && !o.book ? o.up[o.up.length - 1] : 0, FO = fr && D.ranks[fr - 1].obj;
    card.classList.toggle('gm-card--find', !!FO);
    card.classList.toggle('gm-card--quiet', !o.up.length && !o.book);
    /* the tape across the card's head: a find, a district done, or (navy card) a whole book done and the studio's offer */
    box.appendChild(el('p', 'gm-card__tape', t(FO ? 'lant.ui.game.find' : o.book ? 'lant.ui.game.tapeBook' : TAPE[o.src] || 'lant.ui.game.tape')));
    if (FO) {
      /* Yasser holds the part up over a burst of ink rays; its name is the card's heading, its line under it */
      var fd = el('div', 'gm-find'), st = el('div', 'gm-find__stage'); st.setAttribute('aria-hidden', 'true');
      st.appendChild(el('span', 'gm-find__rays'));
      if (D.find) { var yi = el('img', 'gm-find__y'); yi.src = D.art + D.find.art; yi.width = D.find.w; yi.height = D.find.h; yi.alt = ''; yi.decoding = 'async'; st.appendChild(yi); }
      var ob = el('span', 'gm-find__obj'); ob.appendChild(icon(FO)); st.appendChild(ob);
      fd.appendChild(st);
      var tx = el('div', 'gm-find__t');
      var nm = el('p', 'gm-find__name', t('lant.ui.game.o.' + fr)); nm.id = 'gm-card-h'; tx.appendChild(nm);
      tx.appendChild(el('p', 'gm-find__line', t('lant.ui.game.od.' + fr)));
      fd.appendChild(tx); box.appendChild(fd);
      summary.push(t('lant.ui.game.find') + ' · ' + t('lant.ui.game.o.' + fr));
    }
    if (o.book) {
      box.appendChild(el('p', 'gm-card__where gm-label', bookName(o.book)));
      box.appendChild(el('p', 'gm-card__h', t('lant.ui.game.comH')));
    }
    /* the gain, huge (DISPLAY numerals, Latin in every language), its unit as a LABEL */
    var h = el('p', 'gm-card__gain' + (FO ? ' gm-card__gain--foot' : '')); if (!FO) h.id = 'gm-card-h';
    if (o.gain > 0) { h.appendChild(el('span', 'gm-num', '+' + num(o.gain))); h.appendChild(d.createTextNode(' ')); h.appendChild(el('span', 'gm-label', t('lant.ui.game.unit'))); summary.push(t('lant.ui.game.gain', { n: num(o.gain) })); }
    else { h.appendChild(el('span', 'gm-card__upk', t('lant.ui.game.upK'))); summary.push(t('lant.ui.game.upK')); }
    box.appendChild(h);
    /* the rank badge: the seal with its number, the name, the road to the next */
    var rk = el('div', 'gm-rank'); rk.style.setProperty('--p', String(P.p)); rk.style.setProperty('--p0', String(Math.min(P.p, o.p0 || 0)));
    var seal = el('span', 'gm-rank__seal'); seal.setAttribute('aria-hidden', 'true'); seal.appendChild(el('span', 'gm-num', String(P.rank)));
    rk.appendChild(seal);
    rk.appendChild(el('span', 'gm-rank__k gm-label', t('lant.ui.game.rankOf', { n: P.rank, N: D.ranks.length })));
    rk.appendChild(el('p', 'gm-rank__name', rankName(P.rank)));
    var bar = el('span', 'gm-bar'); bar.setAttribute('role', 'progressbar'); bar.setAttribute('aria-valuemin', '0'); bar.setAttribute('aria-valuemax', '100');
    bar.setAttribute('aria-valuenow', String(Math.round(P.p * 100))); bar.setAttribute('aria-label', t('lant.ui.game.barLabel'));
    bar.appendChild(el('i', 'gm-bar__fill')); rk.appendChild(bar);
    rk.appendChild(el('p', 'gm-rank__next gm-label', P.next ? t('lant.ui.game.next', { n: num(P.next.left), name: rankName(P.next.rank) }) : t('lant.ui.game.max')));
    box.appendChild(rk);
    summary.push(t('lant.ui.game.rank', { n: P.rank, name: rankName(P.rank) }));
    /* a rank reached: the red stamp on the corner, and its drawing breaking the card's edge (else the current rank's, as decoration) */
    var r = o.up.length ? o.up[o.up.length - 1] : P.rank, R = D.ranks[r - 1];
    var fig = el('figure', 'gm-card__unlock');
    var im = el('img', 'gm-card__art'); im.src = D.art + R.art; im.width = R.w; im.height = R.h; im.decoding = 'async';
    if (FO) { card.setAttribute('data-gm-up', String(r)); summary.push(t('lant.ui.game.up', { name: rankName(r) })); box.appendChild(el('p', 'gm-card__stamp', t('lant.ui.game.upK'))); }
    else if (o.up.length) {
      box.appendChild(el('p', 'gm-card__stamp', t('lant.ui.game.upK')));
      im.alt = t('lant.ui.game.u.' + r);
      fig.appendChild(im); fig.appendChild(el('figcaption', o.book ? 'sr' : 'gm-card__echo', t('lant.ui.game.up', { name: rankName(r) })));
      summary.push(t('lant.ui.game.up', { name: rankName(r) }));
      card.setAttribute('data-gm-up', String(r));
    } else { im.alt = ''; fig.setAttribute('aria-hidden', 'true'); fig.appendChild(im); card.removeAttribute('data-gm-up'); }
    if (!FO) box.appendChild(fig);
    if (P.rank >= D.discount.rank) box.appendChild(el('p', 'gm-card__code', t('lant.ui.game.code', { code: D.discount.code })));
    var go = el('div', 'gm-card__go');
    if (o.book) {
      box.appendChild(el('p', 'gm-card__echo', t('lant.ui.game.comT', { b: bookName(o.book) })));
      var price = el('a', 'gm-btn gm-btn--amber', t('lant.ui.game.comPrice')); price.href = D.root + (D.service[o.book] || 'tarifs/');
      var wa = el('a', 'gm-btn', t('lant.ui.game.comTalk')); wa.href = D.wa + '?text=' + encodeURIComponent(t('lant.ui.game.comWa', { b: bookName(o.book) })); wa.rel = 'noopener';
      go.appendChild(price); go.appendChild(wa);
      summary.push(t('lant.ui.game.comK'));
    }
    var x = el('button', 'gm-btn gm-card__x', t('lant.ui.game.close')); x.type = 'button';
    x.addEventListener('click', function () { close(true); });
    if (FO || o.book) go.appendChild(soundBtn(FO ? 'find' : 'tink'));
    go.appendChild(x);
    box.appendChild(go);
    card.appendChild(box);
    card.hidden = false;
    card.classList.remove('is-in');
    if (motionOn()) {
      void card.offsetWidth; card.classList.add('is-in');
      if (soundOn()) chime(FO || o.book ? 'find' : 'tink');
      /* the gain counts up once (about half a second, eased out), the way ink fills a stamp; the final figure is
         in the markup from the start, so a reader or a still page always has it */
      var gn = o.gain > 0 && $('.gm-card__gain .gm-num', card);
      if (gn && G.requestAnimationFrame) {
        var t0 = 0, dur = 520, to = o.gain;
        var step = function (ts) {
          if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3);
          gn.textContent = '+' + num(Math.round(to * e));
          if (k < 1 && card.classList.contains('is-in')) requestAnimationFrame(step); else gn.textContent = '+' + num(to);
        };
        gn.textContent = '+' + num(0); requestAnimationFrame(step);
      }
    }
    live.textContent = summary.map(function (x) { return String(x).replace(/[.。]\s*$/, ''); }).join('. ') + '.';
  }

  /* ---- a finish: count again, and say what changed ---- */
  /* the tape names what paid: a district (the default), a night case, a seal, an episode */
  var TAPE = { enq: 'lant.ui.game.tapeCase', seal: 'lant.ui.game.tapeSeal', episode: 'lant.ui.game.tapeEp' };
  function settle(bookSlug, src) {
    var before = P, beforeRank = s.rank;
    P = compute(D, get, s);
    paintChip();
    var gain = P.encre - before.encre;
    if (gain <= 0 && P.rank <= beforeRank) return;
    var up = [];
    for (var r = beforeRank + 1; r <= P.rank; r++) if (s.seen.indexOf(r) < 0) { up.push(r); s.seen.push(r); }
    if (P.rank > s.rank) s.rank = P.rank;
    write();
    var b = bookSlug && P.books[bookSlug], wasDone = bookSlug && before.books[bookSlug] && before.books[bookSlug].n === before.books[bookSlug].N;
    var book = b && b.n === b.N && !wasDone ? bookSlug : null;
    /* pacing: minutes from this page's opening to the district's end, in buckets (m2 = under 2, … m30 = 30 or more),
       to test the 4-minutes-a-district guess against real visitors */
    if (P.parts.district + P.parts.side > before.parts.district + before.parts.side) {
      count('district');
      var mins = (Date.now() - T0) / 60000;
      count('district-m' + (mins < 2 ? 2 : mins < 4 ? 4 : mins < 8 ? 8 : mins < 15 ? 15 : 30));
    }
    if (book) { count('book'); count('commission'); }
    up.forEach(function (r) { count('rank-' + r); });
    /* the chip answers too: one amber ping where it shows (no size change, so nothing in the masthead moves) */
    if (chip && !chip.hidden && motionOn()) { chip.classList.remove('gm-chip--ping'); void chip.offsetWidth; chip.classList.add('gm-chip--ping'); }
    show({ gain: Math.max(0, gain), up: up, book: book, src: src || '', p0: up.length ? 0 : before.p });
  }
  var here = (function () { try { var A = JSON.parse($('#lant-data').textContent); return A.slug || null; } catch (e) { return null; } })();
  var soon = function (slug, src) { setTimeout(function () { settle(slug, src); }, 0); };
  d.addEventListener('numidea:lesson', function () { soon(here); });
  d.addEventListener('numidea:exercise', function (e) { soon((e.detail && e.detail.atlas) || here); });
  d.addEventListener('numidea:gain', function (e) { soon(null, e.detail && typeof e.detail.source === 'string' ? e.detail.source : ''); });
  addEventListener('storage', function (e) { if (e.key === KEY) { L = load(e.newValue, D.ranks.length); s = L.s; P = compute(D, get, s); paintChip(); } });

  /* ---- the reset, on the shelf: the game's own key only, never an atlas, a case or a seal ---- */
  function reset() {
    var host = $('[data-gm-reset]'); if (!host) return;
    var b = el('button', 'lnk lnk--btn', t('lant.ui.game.reset')); b.type = 'button';
    host.appendChild(b);
    b.addEventListener('click', function () {
      var keep = [].slice.call(host.childNodes), ask = el('span', null, t('lant.ui.game.resetAsk') + ' ');
      var yes = el('button', 'lnk lnk--btn', t('lant.ui.game.resetYes')), no = el('button', 'lnk lnk--btn', t('lant.ui.game.resetNo'));
      yes.type = no.type = 'button';
      host.textContent = ''; host.append(ask, yes, d.createTextNode(' '), no); yes.focus();
      yes.onclick = function () { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); };
      no.onclick = function () { host.textContent = ''; keep.forEach(function (n) { host.appendChild(n); }); b.focus(); };
    });
  }

  /* ---- what other parts of the site may use (the episodes, the hub's memory) ---- */
  /* a world flag: a short lower-case key, a plain value (true, a number, a short string) */
  var setWorld = function (k, v) {
    if (!/^[a-z0-9_]{1,40}$/.test(k)) return false;
    if (!(typeof v === 'boolean' || (typeof v === 'number' && isFinite(v)) || (typeof v === 'string' && v.length <= 80))) return false;
    s.world[k] = v; return true;
  };
  G.NUMIDEA_GAME = {
    profile: function () { return JSON.parse(JSON.stringify(P)); },
    world: function (k, v) { if (arguments.length < 2) return s.world[k]; if (setWorld(k, v)) write(); },
    episodeDone: function (id, flags) {
      if (!/^[a-z0-9-]{1,40}$/.test(id)) return;
      if (flags && typeof flags === 'object') Object.keys(flags).forEach(function (k) { setWorld(k, flags[k]); });
      if (s.ep[id]) { write(); return; }
      s.ep[id] = { done: true, t: Date.now() }; write();
      try { d.dispatchEvent(new CustomEvent('numidea:gain', { detail: { source: 'episode', id: id } })); } catch (e) {}
    }
  };

  var start = function () {
    paintChip(); reset();
    /* the atlas last opened, for the home menu's way back in (assets/menu/menu.js reads it) */
    if (here && D.books.some(function (b) { return b.slug === here; }) && s.last !== here) { s.last = here; write(); }
    /* a rank earned elsewhere (a night case, a seal) since the last page: its card, once */
    if (!L.fresh && !L.bad && !L.future && P.earned > s.rank) settle(null);
  };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else start();
})(typeof window !== 'undefined' ? window : globalThis);
