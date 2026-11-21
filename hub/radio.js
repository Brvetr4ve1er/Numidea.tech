/* ============================================================
   Numidea Labs — the workshop radio (2026-11-21: hub/app.js 15, moved here
   so it rides on every page of the Librairie Lanterne, with or without
   app.js). The shelf (hub/lanterne/) holds the set ([data-radio], its tracks
   in #hub-radio); an atlas page holds only its chip ([data-radio-chip]).
   Nothing is fetched and nothing sounds until a press: the <audio> element
   is made on the first one. Play and pause, previous and next, a track
   picked by name, the volume; a track that ends hands over to the next. The
   track, the place in it and the volume are kept on this device
   ('numidea-radio'), so the radio started on the shelf takes up where it
   stopped on an atlas page, once play is pressed there (a browser never
   lets a new page start sound by itself). On the shelf the chip follows at
   the foot of the screen while the radio is on and its set is out of sight;
   on an atlas page it is always there. Lock-screen keys where the browser
   has them (Media Session). The only writes without a press are the clock
   and the bar while it plays.
   ============================================================ */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || d).querySelectorAll(s)); };
  var FR = {};
  try { FR = JSON.parse($('#hub-fr').textContent); } catch (e) {}
  var t = function (k) { var l = root.getAttribute('lang') || 'fr', D = (window.HUB_I18N && window.HUB_I18N[l]) || FR; return D[k] != null ? D[k] : (FR[k] != null ? FR[k] : ''); };
  var emit = function (name, detail) { try { d.dispatchEvent(new CustomEvent(name, { detail: detail })); } catch (e) {} };
  var list = null;
  try { list = JSON.parse($('#hub-radio').textContent); } catch (e) {}
  var box = $('[data-radio]'), chip = $('[data-radio-chip]');
  if ((!box && !chip) || !list || !list.length) return;
  var KEY = 'numidea-radio', st = { i: 0, t: 0, v: 0.6 };
  try { var kept = JSON.parse(localStorage.getItem(KEY) || '{}'); if (kept && typeof kept === 'object') { if (kept.i >= 0 && kept.i < list.length) st.i = kept.i; if (kept.t >= 0) st.t = kept.t; if (kept.v >= 0 && kept.v <= 1) st.v = kept.v; } } catch (e) {}
  var me = $('script[src*="radio.js"]'), ver = ((me && /\?v=\d+/.exec(me.getAttribute('src'))) || [''])[0];
  var audio = null, started = false, seen = !!box, saved = 0;
  var plays = $$('[data-radio-play]'), titles = $$('[data-radio-title]'), picks = box ? $$('[data-radio-pick]', box) : [], vol = box && $('[data-radio-vol]', box);
  var stateEl = box && $('[data-radio-state]', box), timeEl = box && $('[data-radio-time]', box), durEl = box && $('[data-radio-dur]', box), bar = box && $('[data-radio-bar]', box);
  var mmss = function (s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); };
  var set = function (el, v) { if (el && el.textContent !== v) el.textContent = v; };
  var on = function () { return !!audio && !audio.paused; };
  var keep = function () { try { localStorage.setItem(KEY, JSON.stringify({ i: st.i, t: audio ? Math.floor(audio.currentTime) : st.t, v: st.v })); } catch (e) {} };
  var paint = function () {
    var name = t('radio.tracks.' + list[st.i].id + '.name'), playing = on();
    titles.forEach(function (n) { set(n, name); });
    set(durEl, mmss(list[st.i].dur));
    picks.forEach(function (b, i) { b.setAttribute('aria-pressed', String(i === st.i)); });
    plays.forEach(function (b) {
      b.setAttribute('aria-pressed', String(playing)); b.setAttribute('aria-label', t(playing ? 'radio.pause' : 'radio.play'));
      $('[data-radio-ico-play]', b).toggleAttribute('hidden', playing); $('[data-radio-ico-pause]', b).toggleAttribute('hidden', !playing);
    });
    var key = playing ? 'radio.onair' : started ? 'radio.paused' : 'radio.idle';
    if (stateEl) { stateEl.setAttribute('data-i18n', key); set(stateEl, t(key)); }
    var host = box || chip;
    if (host.classList.contains('is-on') !== playing) emit('numidea:radio', { on: playing });
    host.classList.toggle('is-on', playing);
    // on the shelf the chip follows once the set is out of sight; on an atlas page it is the radio
    if (chip && box) chip.hidden = !(started && !seen);
  };
  var tick = function () {
    var c = audio.currentTime || 0, du = audio.duration || list[st.i].dur;
    set(timeEl, mmss(c)); if (bar) bar.style.setProperty('--p', Math.min(1, c / du).toFixed(4));
    if (c - saved > 5 || c < saved) { saved = c; keep(); }
  };
  var session = function () {
    if (!('mediaSession' in navigator) || !window.MediaMetadata) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({ title: t('radio.tracks.' + list[st.i].id + '.name'), artist: 'Numidea Labs', album: t('radio.title') });
      navigator.mediaSession.setActionHandler('play', function () { audio.play(); });
      navigator.mediaSession.setActionHandler('pause', function () { audio.pause(); });
      navigator.mediaSession.setActionHandler('nexttrack', function () { go(1, true); });
      navigator.mediaSession.setActionHandler('previoustrack', function () { go(-1, true); });
    } catch (e) {}
  };
  var load = function (i, at) {
    st.i = (i + list.length) % list.length; saved = at || 0;
    audio.src = list[st.i].src + ver;
    if (at > 0) audio.addEventListener('loadedmetadata', function once() { audio.removeEventListener('loadedmetadata', once); if (at < (audio.duration || 1e9) - 3) audio.currentTime = at; });
    set(timeEl, mmss(at || 0)); if (bar) bar.style.setProperty('--p', '0');
    session(); paint();
  };
  var ensure = function () {
    if (audio) return;
    audio = new Audio(); audio.preload = 'none'; audio.volume = st.v;
    audio.addEventListener('timeupdate', tick);
    audio.addEventListener('play', paint); audio.addEventListener('pause', function () { keep(); paint(); });
    audio.addEventListener('ended', function () { load(st.i + 1, 0); audio.play().catch(function () {}); });
    audio.addEventListener('error', function () { paint(); });
  };
  var play = function () { var p = audio.play(); if (p && p.catch) p.catch(function () { paint(); }); };
  var toggle = function () {
    ensure();
    if (!started) { started = true; load(st.i, st.t); play(); return; }
    if (audio.paused) play(); else audio.pause();
  };
  var go = function (dir, keepPlaying) {
    ensure();
    var was = started && !audio.paused;
    started = true; load(st.i + dir, 0);
    if (was || keepPlaying) play(); else keep();
  };
  plays.forEach(function (b) { b.disabled = false; b.addEventListener('click', toggle); });
  $$('[data-radio-next]').forEach(function (b) { b.disabled = false; b.addEventListener('click', function () { go(1, true); }); });
  $$('[data-radio-prev]').forEach(function (b) { b.disabled = false; b.addEventListener('click', function () { go(-1, true); }); });
  picks.forEach(function (b, i) { b.disabled = false; b.addEventListener('click', function () { ensure(); started = true; load(i, 0); play(); }); });
  if (vol) {
    vol.disabled = false; vol.value = String(Math.round(st.v * 100));
    vol.addEventListener('input', function () { st.v = Math.min(1, Math.max(0, Number(vol.value) / 100)); if (audio) audio.volume = st.v; keep(); });
  }
  $$('[data-radio-off]').forEach(function (b) {
    b.addEventListener('click', function () { if (audio) { audio.pause(); keep(); } started = false; paint(); });
  });
  if (chip && box && 'IntersectionObserver' in window) new IntersectionObserver(function (es) { seen = es[0].isIntersecting; if (started) paint(); }).observe(box);
  addEventListener('pagehide', function () { if (audio && started) keep(); });
  // the kept track's name and length (the dictionary may land after this script: paint again then)
  paint();
  d.addEventListener('numidea:lang', function () { paint(); if (started) session(); });
})();
