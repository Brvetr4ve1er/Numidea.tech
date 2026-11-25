/* The Lantern objects and the owner's panels (2026-11-24, lb2 SPEC §4.3), on the Librairie's atlases.
   play: once when it enters the open district's view, then « Rejouer »; never with reduced motion or Mouvement off (the
   markup is already the teaching frame). steps/toggle: no data-lo-step = the final frame; a press moves one step.
   slide: counts the days of data-lo-runs inside the window. A district's visit ends when it loses .is-current.
   Panels: one rise when they first come into view. */
(function () {
  'use strict';
  var d = document, de = d.documentElement;
  var mq = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  function motionOn() { return !(mq && mq.matches) && !de.classList.contains('motion-off'); }
  var FR = null;
  function T(k) {
    var D = (window.HUB_I18N && window.HUB_I18N[de.getAttribute('lang') || 'fr']) || {};
    if (D[k] != null) return D[k];
    if (!FR) try { FR = JSON.parse(d.getElementById('hub-fr').textContent); } catch (e) { FR = {}; }
    return FR[k] != null ? FR[k] : '';
  }
  function each(l, f) { for (var i = 0; i < l.length; i++) f(l[i], i); }
  function label(b, k) { if (b) each(b.querySelectorAll('[data-lo-l]'), function (s) { s.hidden = s.getAttribute('data-lo-l') !== k; }); }
  function inVisit(f) { var z = f.closest('.district'); return !z || z.classList.contains('is-current'); }
  function beat(f, cls, ms) {
    f.classList.remove(cls); void f.getBoundingClientRect(); f.classList.add(cls);
    clearTimeout(f['_' + cls]); f['_' + cls] = setTimeout(function () { f.classList.remove(cls); }, ms);
  }
  function play(f) {
    f._played = 1; label(f._btn, 'replay');
    if (motionOn()) beat(f, 'is-playing', (+f.getAttribute('data-lo-ms') || 4000) + 50);
  }
  function setStep(f, s) {
    var n = +f.getAttribute('data-lo-n') || 2, fmt = f.getAttribute('data-lo-fmt'), now = f.querySelector('[data-lo-now]');
    f._step = s; f.setAttribute('data-lo-step', s);
    each(f.querySelectorAll('[data-s]'), function (e) { e.classList.toggle('is-off', s < +e.getAttribute('data-s')); });
    each(f.querySelectorAll('[data-s-until]'), function (e) { e.classList.toggle('is-off', s > +e.getAttribute('data-s-until')); });
    if (motionOn()) beat(f, 'is-step', 300);
    if (f.getAttribute('data-lo-kind') === 'toggle') {
      each(f.querySelectorAll('[data-lo-b]'), function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-lo-b') === s)); });
      /* a toggle with a caption per state: the caption follows the frame */
      each(f.querySelectorAll('[data-lo-cap]'), function (c) { c.hidden = +c.getAttribute('data-lo-cap') !== s; });
      if (now) now.textContent = (f.querySelector('[data-lo-b="' + s + '"]') || {}).textContent || '';
    } else {
      label(f._btn, s >= n ? 'restart' : 'next');
      if (fmt && now) now.textContent = T(fmt).replace('{i}', s).replace('{n}', n);
    }
  }
  function slide(f) {
    var r = f.querySelector('[data-lo-range]'), o = f.querySelector('[data-lo-out]'), fmt = f.getAttribute('data-lo-fmt');
    var win = +f.getAttribute('data-lo-win') || 180, runs = [];
    each((f.getAttribute('data-lo-runs') || '').split(','), function (p) {
      var m = /^(-?\d+)-(-?\d+)$/.exec(p.trim()); if (m) runs.push([+m[1], +m[2]]);
    });
    function upd() {
      var v = +r.value, lo = v - win + 1, c = 0;
      each(runs, function (p) { var a = Math.max(p[0], lo), b = Math.min(p[1], v); if (b >= a) c += b - a + 1; });
      f.style.setProperty('--lo-v', v);
      if (o && fmt) o.textContent = T(fmt).replace('{n}', c);
    }
    if (r) { r.addEventListener('input', upd); upd(); f._upd = upd; }
  }
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    each(es, function (e) { var f = e.target; if (e.isIntersecting && !f._played && inVisit(f) && motionOn()) play(f); });
  }, { threshold: 0.6 }) : null;
  var plays = [];
  each(d.querySelectorAll('figure.lo[data-lo-kind]'), function (f) {
    var k = f.getAttribute('data-lo-kind'), b = f.querySelector('[data-lo-btn]');
    f._btn = b;
    if (k === 'play') {
      plays.push(f); label(b, 'play');
      if (b) { b.hidden = !motionOn(); b.addEventListener('click', function () { play(f); }); }
      if (io) io.observe(f);
    } else if (k === 'steps') {
      label(b, 'steps');
      if (b) b.addEventListener('click', function () { var n = +f.getAttribute('data-lo-n'); setStep(f, !f._step || f._step >= n ? 1 : f._step + 1); });
    } else if (k === 'toggle') {
      each(f.querySelectorAll('[data-lo-b]'), function (x) { x.addEventListener('click', function () { setStep(f, +x.getAttribute('data-lo-b')); }); });
    } else if (k === 'slide') slide(f);
  });
  /* the page's language changes the strings the controller wrote: write them again */
  function rewrite() {
    each(d.querySelectorAll('figure.lo'), function (f) { if (f._upd) f._upd(); else if (f._step) setStep(f, f._step); });
  }
  if ('MutationObserver' in window) {
    /* a district's visit ends when it loses .is-current: the next visit plays once more */
    var mo = new MutationObserver(function (ms) {
      each(ms, function (m) {
        var z = m.target; if (z.classList.contains('is-current')) return;
        each(z.querySelectorAll('figure.lo'), function (f) { f._played = 0; f.classList.remove('is-playing'); label(f._btn, 'play'); });
      });
    });
    each(d.querySelectorAll('.district'), function (z) { mo.observe(z, { attributes: true, attributeFilter: ['class'] }); });
    /* Mouvement off: the play buttons go, a play under way stops on its teaching frame; the language: the strings again */
    new MutationObserver(function (ms) {
      each(ms, function (m) {
        if (m.attributeName === 'lang') rewrite();
        else each(plays, function (f) { if (f._btn) f._btn.hidden = !motionOn(); if (!motionOn()) f.classList.remove('is-playing'); });
      });
    }).observe(de, { attributes: true, attributeFilter: ['class', 'lang'] });
  }
  /* the owner's panels: one rise when they first come into view, never again */
  var ps = d.querySelectorAll('[data-lo-enter]');
  if (ps.length && io && motionOn()) {
    var pio = new IntersectionObserver(function (es) {
      each(es, function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); pio.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    each(ps, function (p) { var r = p.getBoundingClientRect(); if (r.top > innerHeight || !r.height) { p.classList.add('lt-panel--wait'); pio.observe(p); } });
  }
})();
