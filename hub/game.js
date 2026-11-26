/* Numidea Labs — the game layer (2026-11-26; the spec: « Numidea game loop spec »). One currency, Encre, earned
   everywhere and never spent; ten ranks; a card that lands when a district is finished; a commission at the end of a book.
   Encre is never stored. It is added up, on every load and after every finish, from the keys the pages already keep:
   the atlases ('numidea-lanterne-<slug>', or an old manual's stamps the atlas has not moved yet, read, never rewritten),
   the night cases ('numidea-lanterne-enquetes', XP ÷ pts.enqDiv, 2: a case of three depths at most 90), Kūro's seals ('numidea-seals') and the episodes
   finished (kept here). This file writes one key only, 'numidea-save' (v1):
     { v: 1, rank: 1..10 (the highest reached; a rank is never taken back), seen: [ranks whose card has played],
       world: { flag: value } (what the hub remembers), ep: { id: { done: true, t: ms } }, name: '' }
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
  var count = function (what) { try { if (G.numideaGame) G.numideaGame(what); } catch (e) {} };
  var P = compute(D, get, s);
  /* a first visit, or a save rebuilt: the rank already earned is taken quietly (no card for progress made before this layer) */
  if (L.fresh || L.bad) { s.rank = P.rank; s.seen = []; for (var i = 1; i <= P.rank; i++) s.seen.push(i); write(); }
  var motionOn = function () { return !matchMedia('(prefers-reduced-motion: reduce)').matches && !root.classList.contains('motion-off'); };
  var rankName = function (r) { return t('lant.ui.game.r.' + r); };

  /* ---- the chip: rank and Encre in the atlas bar, to the passport ---- */
  var chip = null;
  /* the chip sits in the masthead only where it fits on the line: measured before any paint (no layout shift);
     where it would wrap the masthead (the shelf, with its call to action, at some widths) it stays hidden */
  var mast = null, mastH = 0;
  function paintChip() {
    if (!chip) {
      var nav = $('.mast__nav'); if (!nav) return;
      mast = nav.closest('header') || nav.parentNode; mastH = mast.offsetHeight;
      chip = el('a', 'gm-chip'); chip.href = D.passport; chip.setAttribute('data-gm-chip', '');
      nav.appendChild(chip);
    }
    chip.textContent = t('lant.ui.game.chip', { rank: rankName(P.rank), n: num(P.encre) });
    chip.hidden = false;
    if (mast.offsetHeight > mastH + 1) chip.hidden = true;
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
    card.addEventListener('animationend', function () { card.classList.remove('is-in'); });
  }
  function close(back) { if (!card || card.hidden) return; var had = card.contains(d.activeElement); card.hidden = true; if (back && had && last && last.focus) last.focus(); }
  var last = null;
  /* o: { gain, up: [ranks newly reached], book: slug finished now } */
  function show(o) {
    shell(); last = d.activeElement;
    card.textContent = '';
    var box = el('div', 'gm-card__in');
    var h = el('p', 'gm-card__gain', o.gain > 0 ? t('lant.ui.game.gain', { n: num(o.gain) }) : t('lant.ui.game.upK')); h.id = 'gm-card-h';
    box.appendChild(h);
    box.appendChild(el('p', 'gm-card__rank', t('lant.ui.game.rank', { n: P.rank, name: rankName(P.rank) })));
    var bar = el('div', 'gm-bar'); bar.setAttribute('role', 'progressbar'); bar.setAttribute('aria-valuemin', '0'); bar.setAttribute('aria-valuemax', '100');
    bar.setAttribute('aria-valuenow', String(Math.round(P.p * 100))); bar.setAttribute('aria-label', t('lant.ui.game.barLabel'));
    bar.style.setProperty('--p', String(P.p)); bar.appendChild(el('span', 'gm-bar__fill'));
    box.appendChild(bar);
    box.appendChild(el('p', 'gm-card__next', P.next ? t('lant.ui.game.next', { n: num(P.next.left), name: rankName(P.next.rank) }) : t('lant.ui.game.max')));
    var summary = [h.textContent, t('lant.ui.game.rank', { n: P.rank, name: rankName(P.rank) })];
    if (o.up.length) {
      var r = o.up[o.up.length - 1], R = D.ranks[r - 1];
      var fig = el('figure', 'gm-card__unlock');
      var im = el('img'); im.src = D.art + R.art; im.width = R.w; im.height = R.h; im.alt = t('lant.ui.game.u.' + r); im.decoding = 'async';
      fig.appendChild(im);
      fig.appendChild(el('figcaption', null, t('lant.ui.game.up', { name: rankName(r) })));
      box.insertBefore(fig, box.firstChild);
      summary.push(t('lant.ui.game.up', { name: rankName(r) }));
      card.setAttribute('data-gm-up', String(r));
    } else card.removeAttribute('data-gm-up');
    if (P.rank >= D.discount.rank) box.appendChild(el('p', 'gm-card__code', t('lant.ui.game.code', { code: D.discount.code })));
    if (o.book) {
      var com = el('div', 'gm-com');
      com.appendChild(el('p', 'gm-com__k', t('lant.ui.game.comK')));
      com.appendChild(el('p', 'gm-com__t', t('lant.ui.game.comT', { b: bookName(o.book) })));
      var go = el('a', 'btn gm-com__go', t('lant.ui.game.comPrice')); go.href = D.root + (D.service[o.book] || 'tarifs/');
      var wa = el('a', 'lnk gm-com__wa', t('lant.ui.game.comTalk')); wa.href = D.wa + '?text=' + encodeURIComponent(t('lant.ui.game.comWa', { b: bookName(o.book) })); wa.rel = 'noopener';
      com.appendChild(go); com.appendChild(wa);
      box.appendChild(com);
      summary.push(t('lant.ui.game.comK'));
    }
    var x = el('button', 'gm-card__x', t('lant.ui.game.close')); x.type = 'button';
    x.addEventListener('click', function () { close(true); });
    box.appendChild(x);
    card.appendChild(box);
    card.hidden = false;
    card.classList.remove('is-in');
    if (motionOn()) { void card.offsetWidth; card.classList.add('is-in'); }
    live.textContent = summary.map(function (x) { return String(x).replace(/[.。]\s*$/, ''); }).join('. ') + '.';
  }

  /* ---- a finish: count again, and say what changed ---- */
  function settle(bookSlug) {
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
    if (P.parts.district + P.parts.side > before.parts.district + before.parts.side) count('district');
    if (book) { count('book'); count('commission'); }
    up.forEach(function (r) { count('rank-' + r); });
    show({ gain: Math.max(0, gain), up: up, book: book });
  }
  var here = (function () { try { var A = JSON.parse($('#lant-data').textContent); return A.slug || null; } catch (e) { return null; } })();
  var soon = function (slug) { setTimeout(function () { settle(slug); }, 0); };
  d.addEventListener('numidea:lesson', function () { soon(here); });
  d.addEventListener('numidea:exercise', function (e) { soon((e.detail && e.detail.atlas) || here); });
  d.addEventListener('numidea:gain', function () { soon(null); });
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
    /* a rank earned elsewhere (a night case, a seal) since the last page: its card, once */
    if (!L.fresh && !L.bad && P.earned > s.rank) settle(null);
  };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else start();
})(typeof window !== 'undefined' ? window : globalThis);
