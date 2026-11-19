/* ============================================================
   Numidea Labs: the books on a phone or a tablet (brand books and bible).
   Loaded with `defer` by hub/bible/ and each hub/brand/<slug>/ page, after
   book.css. Nothing here is needed to read a page: without it the plates
   keep their desktop-shaped, single-column layout.

   1. A "Plates" chip (up to 1023 px) that follows the reader and opens the
      list of plates in a dialog: the current plate is shown in the chip.
   2. On phones (up to 640 px) the social posts turn into what a feed shows:
      the 3 x 3 grids are three-across thumbnails (in the brand books up to
      1023 px) (each post is drawn at its
      design width and scaled, so nothing is re-flowed), the stories and the
      reel are one swipe row, and a tap on a thumbnail opens the post large
      in a dialog with its caption, previous and next, and a swipe; the
      large post grows out of its thumbnail and goes back into it.
   3. Carousels (slides) are swipe rows; blocks marked data-fold fold
      behind one button on phones.
   4. Long jumps land: a jump in the page longer than two screens (the
      chip's list, the contents, "top of page") is made at once and the
      plate rises into place, instead of a long glide.
   5. Plates and sections arrive: those below the screen at load rise in
      as they come on screen (the site's [data-reveal] contract); nothing
      shown at load is ever hidden or moved.
   The page change itself is the browser's (a view transition, in the
   books' stylesheets), so nothing here holds a link back. Every motion is
   on the site's 90 BPM grid and none runs with reduced motion; nothing
   moves by itself; no network request is made.
   ============================================================ */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  // the site's tempo (the stylesheets' --m-* tokens): 90 BPM, a beat of 667 ms;
  // M(n) is n eighths of a beat, Q() rounds a drawn time to the nearest sixteenth
  var BEAT = 2000 / 3;
  var M = function (n) { return Math.round(n * BEAT / 8); };
  var Q = function (ms) { var s = BEAT / 16; return Math.round(Math.round(ms / s) * s); };
  var EASE_ENTER = 'cubic-bezier(.16,1,.3,1)';
  var EASE_EXIT = 'cubic-bezier(.5,0,.75,0)';
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var rtl = function () { return getComputedStyle(root).direction === 'rtl'; };
  var FR = /^fr/i.test(root.lang || '');
  var T = FR
    ? { plates: 'Planches', sections: 'Sections', plate: 'Pl.', list: 'Les planches', sectionList: 'Sections', close: 'Fermer', open: 'Agrandir', prev: 'Post précédent', next: 'Post suivant',
        swipe: 'Faites glisser', of: ' sur ', show: 'Afficher : ', hide: 'Masquer : ', view: 'Aperçu du post', top: 'Haut de page' }
    : { plates: 'Plates', sections: 'Sections', plate: 'Pl.', list: 'The plates', sectionList: 'The sections', close: 'Close', open: 'Enlarge', prev: 'Previous post', next: 'Next post',
        swipe: 'Swipe', of: ' of ', show: 'Show: ', hide: 'Hide: ', view: 'Post preview', top: 'Top of page' };
  var phone = window.matchMedia('(max-width:640px), (orientation:landscape) and (max-height:500px)');
  var small = window.matchMedia('(max-width:1023px)');

  function el(tag, cls, html) { var e = d.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function txt(e) { return (e && e.textContent || '').replace(/\s+/g, ' ').trim(); }

  /* ---------- 1. the plates chip ---------- */
  function plateIndex() {
    var items = [].slice.call(d.querySelectorAll('.plate[id], .sec[id]')).map(function (s) {
      var n = s.querySelector('.plate__n, .sh .num'), t = s.querySelector('.plate__t, .sh h2');
      if (!n || !t) return null;
      var title = txt(t).replace(/\s*クロ\s*$/, '');
      return { s: s, id: s.id, n: txt(n).replace(/\s*\/\s*$/, ''), t: title };
    }).filter(Boolean);
    if (items.length < 3) return;
    var KIND = d.querySelector('.plate[id]') ? T.plates : T.sections;
    var chip = el('button', 'pi-chip', '<span class="pi-k">' + KIND + '</span> <b class="pi-n" aria-hidden="true"></b>');
    chip.type = 'button'; chip.setAttribute('aria-haspopup', 'dialog');
    var dlg = el('dialog', 'pi-dlg');
    dlg.setAttribute('aria-label', d.querySelector('.plate[id]') ? T.list : T.sectionList);
    var html = '<div class="pi-hd"><h2 class="pi-h">' + T.list + '</h2><button type="button" class="pi-x" aria-label="' + T.close + '"><span aria-hidden="true">×</span></button></div><ol class="pi-ol">';
    items.forEach(function (i) { html += '<li><a href="#' + i.id + '"><b>' + i.n + '</b><span>' + i.t + '</span></a></li>'; });
    html += '</ol><a class="pi-top" href="#top">↑ ' + T.top + '</a>';
    dlg.innerHTML = html;
    d.body.appendChild(chip); d.body.appendChild(dlg);
    var links = [].slice.call(dlg.querySelectorAll('.pi-ol a'));
    var cur = -1;
    function mark(i) {
      if (i === cur) return; cur = i;
      chip.querySelector('.pi-n').textContent = items[i].n + (items.length < 30 ? '' : '');
      chip.setAttribute('aria-label', KIND + ' : ' + items[i].n + ' ' + items[i].t);
      links.forEach(function (a, k) { if (k === i) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
    }
    mark(0);
    var seen = new Set();
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) seen.add(e.target); else seen.delete(e.target); });
        var best = -1; items.forEach(function (it, k) { if (seen.has(it.s)) best = k; });
        if (best >= 0) mark(best);
      }, { rootMargin: '-35% 0px -60% 0px' });
      items.forEach(function (it) { io.observe(it.s); });
      // show the chip once the top of the page (the cover or the contents) is behind the reader
      var head = d.querySelector('.toc, .cover');
      if (head) {
        var tick = false;
        var upd = function () { tick = false; chip.classList.toggle('is-on', head.getBoundingClientRect().bottom < 0); };
        window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
        // the first read waits for a frame, so it is not a layout forced in the middle of loading
        tick = true; requestAnimationFrame(upd);
      } else chip.classList.add('is-on');
    } else chip.classList.add('is-on');
    chip.addEventListener('click', function () { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); });
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || e.target.closest('.pi-x') || e.target.closest('.pi-ol a') || e.target.closest('.pi-top')) { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }
    });
  }

  /* ---------- 2. posts as thumbnails, stories as a row ---------- */
  var DW = { grid: 360, row: 300 };
  var sets = [], swipes = [];
  var viewer = null;

  function labelFor(set) {
    var p = set.node.closest('.kit-part, .sk-part, .nsl-set');
    var h = p && p.querySelector('.sk-h, .kit-h');
    if (!h) return '';
    var c = h.cloneNode(true); var l = c.querySelector('.lab'); if (l) l.remove();
    return txt(c);
  }

  function prepare(node, kind) {
    var figs = [].slice.call(node.querySelectorAll('figure'));
    if (!figs.length) return;
    // a brand book's grid is a thumbnail feed on a tablet too (book.css); the bible's grid keeps its full posts there
    var set = { node: node, kind: kind, cells: [], tab: kind === 'grid' && !!node.closest('.plate') };
    node.classList.add('pv-set', 'pv-set--' + kind);
    figs.forEach(function (fig) {
      var cell = el('div', 'pv-cell');
      fig.parentNode.insertBefore(cell, fig);
      cell.appendChild(fig);
      var post = fig.querySelector('[role="img"]');
      var b = el('button', 'pv-open'); b.type = 'button';
      b.setAttribute('aria-label', T.open + ' : ' + (post ? post.getAttribute('aria-label') : txt(fig.querySelector('figcaption'))));
      cell.appendChild(b);
      fig.setAttribute('aria-hidden', 'true');
      set.cells.push({ cell: cell, fig: fig, btn: b });
      b.addEventListener('click', function () { openViewer(set, set.cells.length && set.cells.map(function (c) { return c.btn; }).indexOf(b)); });
    });
    sets.push(set);
  }

  function swipeRow(node) {
    node.classList.add('pv-swipe'); swipes.push(node);
    var l = (function () { var p = node.closest('.kit-part, .sk-part, .nsl-set'); var h = p && p.querySelector('.sk-h, .kit-h'); if (!h) return ''; var c = h.cloneNode(true), x = c.querySelector('.lab'); if (x) x.remove(); return txt(c); })();
    node.setAttribute('data-pv-label', l);
    var hint = el('p', 'pv-hint', '<span aria-hidden="true">' + T.swipe + ' →</span>');
    hint.setAttribute('aria-hidden', 'true');
    node.parentNode.insertBefore(hint, node);
  }

  // Reads first, then writes: every width and height is measured in one
  // pass and the scales written in the next, so the browser lays the page
  // out once, not once per post.
  function fit() {
    var on = phone.matches, jobs = [];
    swipes.forEach(function (n) {
      if (on) { n.setAttribute('tabindex', '0'); if (n.tagName === 'DIV') n.setAttribute('role', 'group'); if (n.getAttribute('data-pv-label')) n.setAttribute('aria-label', n.getAttribute('data-pv-label')); }
      else { n.removeAttribute('tabindex'); n.removeAttribute('role'); n.removeAttribute('aria-label'); }
    });
    sets.forEach(function (s) {
      var son = phone.matches || (s.tab && small.matches);
      s.node.classList.toggle('pv-on', son);
      var dw = s.kind === 'grid' ? DW.grid : DW.row;
      s.cells.forEach(function (c) {
        if (!son) { c.fig.style.removeProperty('--k'); c.cell.style.removeProperty('height'); c.fig.removeAttribute('aria-hidden'); return; }
        c.fig.setAttribute('aria-hidden', 'true');
        c.fig.style.setProperty('--dw', dw + 'px');
        jobs.push({ c: c, dw: dw });
      });
    });
    // the cell's width comes from its grid or row, the post's height from its design width: neither depends on the scale
    jobs.forEach(function (j) { j.w = j.c.cell.clientWidth; j.h = j.c.fig.offsetHeight; });
    jobs.forEach(function (j) {
      if (!j.w) { j.c.fig.style.removeProperty('--k'); j.c.cell.style.removeProperty('height'); return; }
      var k = j.w / j.dw;
      j.c.fig.style.setProperty('--k', k.toFixed(4));
      j.c.cell.style.height = Math.round(j.h * k) + 'px';
    });
  }

  function openViewer(set, i) {
    var v;
    if (!viewer) {
      var dlg = el('dialog', 'pv-dlg');
      dlg.setAttribute('aria-label', T.view);
      dlg.innerHTML = '<div class="pv-stage"></div><div class="pv-bar"><button type="button" class="pv-prev" aria-label="' + T.prev + '"><span aria-hidden="true">←</span></button><span class="pv-count" aria-live="polite"></span><button type="button" class="pv-next" aria-label="' + T.next + '"><span aria-hidden="true">→</span></button><button type="button" class="pv-close" aria-label="' + T.close + '"><span aria-hidden="true">×</span></button></div>';
      d.body.appendChild(dlg);
      viewer = v = { dlg: dlg, stage: dlg.querySelector('.pv-stage'), count: dlg.querySelector('.pv-count'), set: null, i: 0 };
      dlg.addEventListener('click', function (e) {
        if (e.target.closest('.pv-close') || e.target === dlg || e.target === viewer.stage) dlg.close();
        else if (e.target.closest('.pv-prev')) go(-1);
        else if (e.target.closest('.pv-next')) go(1);
      });
      dlg.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') go(-1); else if (e.key === 'ArrowRight') go(1); });
      var x0 = null, y0 = 0;
      dlg.addEventListener('touchstart', function (e) { var t = e.touches[0]; x0 = e.touches.length === 1 ? t.clientX : null; y0 = t.clientY; }, { passive: true });
      dlg.addEventListener('touchend', function (e) {
        if (x0 === null) return; var t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0; x0 = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
        else if (dy > 90 && dy > Math.abs(dx) * 1.5 && v.stage.scrollTop <= 0) dlg.close();
      }, { passive: true });
      dlg.addEventListener('touchcancel', function () { x0 = null; }, { passive: true });
      // closing: the post shrinks back into its thumbnail while the ink fades
      // (the stylesheet keeps the dialog drawn through its exit)
      dlg.addEventListener('close', function () { var c = v.set && v.set.cells[v.i]; if (c) morph(v.stage.firstElementChild, c.cell, true); });
    }
    viewer.set = set; show(i, 0);
    if (!viewer.dlg.open) { viewer.dlg.showModal(); morph(viewer.stage.firstElementChild, set.cells[i].cell, false); }
  }
  // The large post grows out of the thumbnail that was pressed (half a beat,
  // enter curve) and goes back into it on closing (three eighths, exit
  // curve), so the eye keeps which post it was. The post's top corner is
  // mapped onto the thumbnail's (the thumbnail shows the post without its
  // caption). Skipped with reduced motion, and when the thumbnail is off
  // screen (after a run of swipes): then the plain fade alone.
  function morph(shell, cell, back) {
    if (reduce.matches || !shell || !shell.animate || !cell) return;
    var a = cell.getBoundingClientRect();
    if (!a.width || a.bottom <= 0 || a.top >= window.innerHeight) return;
    var post = shell.querySelector('[role="img"]') || shell, s = shell.getBoundingClientRect(), p = post.getBoundingClientRect();
    if (!p.width) return;
    var k = a.width / p.width;
    var at = 'translate(' + (a.left - p.left).toFixed(1) + 'px,' + (a.top - p.top).toFixed(1) + 'px) scale(' + k.toFixed(4) + ')';
    shell.style.transformOrigin = (p.left - s.left).toFixed(1) + 'px ' + (p.top - s.top).toFixed(1) + 'px';
    shell.animate(back ? [{ transform: 'none' }, { transform: at }] : [{ transform: at }, { transform: 'none' }],
      { duration: back ? M(3) : M(4), easing: back ? EASE_EXIT : EASE_ENTER, fill: back ? 'forwards' : 'none' });
  }
  function go(n) { var c = viewer.set.cells.length; show((viewer.i + n + c) % c, n); }
  // dir: 1 for the next post, -1 for the previous one, 0 when the viewer opens.
  // The new post slides in from the side it comes from, half a beat on the
  // enter curve; the old one is simply replaced (no exit to wait for), so a
  // fast run of swipes never queues.
  function show(i, dir) {
    var v = viewer, c = v.set.cells[i]; v.i = i;
    var f = c.fig.cloneNode(true);
    f.removeAttribute('aria-hidden'); f.removeAttribute('style'); f.classList.add('pv-big');
    [].forEach.call(f.querySelectorAll('[id]'), function (e) { e.removeAttribute('id'); });
    [].forEach.call(f.querySelectorAll('img'), function (m) { m.loading = 'eager'; });
    var story = !!f.querySelector('.sp--st, .nst');
    v.stage.className = 'pv-stage' + (story ? ' pv-stage--st' : '');
    var pl = c.fig.closest('.plate'), shell = el('div', pl ? 'plate pv-shell' : 'pv-shell');
    if (pl && pl.getAttribute('data-tone')) shell.setAttribute('data-tone', pl.getAttribute('data-tone'));
    shell.appendChild(f);
    v.stage.textContent = ''; v.stage.appendChild(shell);
    v.count.textContent = (i + 1) + T.of + v.set.cells.length;
    // back to the top of the stage: at once between posts; on opening, in the frame after showModal(), whose own layout it would have doubled (a scroll written to a closed dialog lays it out)
    if (dir || v.dlg.open) v.stage.scrollTop = 0;
    else requestAnimationFrame(function () { v.stage.scrollTop = 0; });
    if (dir && !reduce.matches && shell.animate) {
      var x = dir * (rtl() ? -24 : 24);
      shell.animate([{ transform: 'translateX(' + x + 'px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: M(4), easing: EASE_ENTER });
    }
  }

  /* ---------- 3. folds ---------- */
  function folds() {
    [].forEach.call(d.querySelectorAll('[data-fold]'), function (b, k) {
      var name = b.getAttribute('data-fold');
      var btn = el('button', 'fold-btn'); btn.type = 'button'; btn.setAttribute('aria-expanded', 'false');
      var id = 'fold-' + k; btn.setAttribute('aria-controls', id);
      btn.innerHTML = '<span class="fold-t">' + T.show + name + '</span><span class="fold-i" aria-hidden="true">+</span>';
      var body = el('div', 'fold-body'); body.id = id;
      while (b.firstChild) body.appendChild(b.firstChild);
      // the heading stays outside the fold
      var h = body.querySelector('.sk-h, .kit-h'); if (h && body.firstElementChild === h) b.appendChild(h);
      b.appendChild(btn); b.appendChild(body); b.classList.add('is-folded');
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        b.classList.toggle('is-folded', !open);
        btn.querySelector('.fold-t').textContent = (open ? T.hide : T.show) + name;
        var mark = btn.querySelector('.fold-i');
        mark.textContent = open ? '−' : '+';
        // the new mark turns a quarter into place (the minus as the plus's
        // upright laid down) in three eighths of a beat (250, as the home's); the content's rise is the
        // stylesheet's, and closing is a cut
        if (!reduce.matches && mark.animate) mark.animate([{ transform: 'rotate(-90deg)' }, { transform: 'none' }], { duration: M(3), easing: EASE_ENTER });
      });
    });
  }

  /* ---------- 4. long jumps land ---------- */
  var rio = null;
  // a plate still waiting to rise is let go first (no reveal on top of the
  // arrival), so it is measured where it rests, not 12px low
  function unmark(t) {
    if (t.hasAttribute('data-reveal') && !t.classList.contains('is-in')) { t.removeAttribute('data-reveal'); if (rio) rio.unobserve(t); }
  }
  // the plate's arrival after a jump: three quarters of a beat, rising 12px, the reveal's own motion
  function arrive(t) {
    if (t.animate) t.animate([{ opacity: .001, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: M(6), easing: EASE_ENTER });
  }
  // A short hop keeps the page's smooth scroll; a jump of more than two
  // screens would glide for a second and a half past plates nobody asked
  // for, so it is made at once and the plate arrives where the reader is.
  // With reduced motion the stylesheet already makes every jump instant.
  function jumps() {
    d.addEventListener('click', function (e) {
      if (reduce.matches || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest ? e.target.closest('.pi-ol a, .toc a, a.pi-top') : null;
      var href = a && a.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;
      var id = decodeURIComponent(href.slice(1)), t = id && d.getElementById(id);
      if (!t) return;
      var m = parseFloat(getComputedStyle(t).scrollMarginTop) || 0;
      var top = Math.max(0, Math.round(t.getBoundingClientRect().top + window.scrollY - m));
      if (Math.abs(top - window.scrollY) <= 2 * window.innerHeight) return;
      e.preventDefault();
      if (t.hasAttribute('data-reveal')) { unmark(t); top = Math.max(0, Math.round(t.getBoundingClientRect().top + window.scrollY - m)); }
      if (location.hash !== href) history.pushState(null, '', href);
      window.scrollTo({ top: top, behavior: 'instant' });
      // focus follows the reader, as a link to the plate would take it
      if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
      t.focus({ preventScroll: true });
      arrive(t);
    });
  }

  /* ---------- 5. plates and sections arrive ----------
     Only what the observer's first report puts below the screen is marked
     data-reveal (the stylesheets hide it then, 12px low); what is on
     screen at load, or above it, is never touched. A marked block rises in
     once it is 8% into the screen, and is let go. Never with reduced
     motion: then nothing is marked at all. */
  function reveals() {
    if (reduce.matches || !('IntersectionObserver' in window)) return;
    var els = [].slice.call(d.querySelectorAll('.plate[id], .sec'));
    if (!els.length) return;
    // started a fifth of a screen before the block is in, as on the home and the Studio: the reader never sees the empty place first
    rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var t = e.target;
        if (!t.__rv) {
          t.__rv = true;
          if (!e.isIntersecting && e.boundingClientRect.top >= window.innerHeight) t.setAttribute('data-reveal', '');
          else rio.unobserve(t);
          return;
        }
        if (e.isIntersecting) { t.classList.add('is-in'); rio.unobserve(t); }
      });
    }, { rootMargin: '0px 0px 20% 0px', threshold: 0 });
    els.forEach(function (t) { rio.observe(t); });
  }

  function init() {
    plateIndex();
    [].forEach.call(d.querySelectorAll('.pgrid'), function (n) { prepare(n, 'grid'); });
    [].forEach.call(d.querySelectorAll('.stories, .nstories, .reel'), function (n) { prepare(n, 'row'); swipeRow(n); });
    [].forEach.call(d.querySelectorAll('.slides, .car, .nsl-grid, .igs'), swipeRow);
    folds();
    jumps();
    reveals();
    root.classList.add('pv');
    // the posts are measured once, when the faces they are set in have
    // arrived (measured earlier, a later font swap would leave them the wrong
    // height); waiting a frame first lets the first layout ask for those
    // faces, so fonts.ready means them. After that, only a change of width
    // measures again (a phone's toolbar changes the height on every scroll).
    var lastW = window.innerWidth;
    var measure = function () { if (d.fonts && d.fonts.ready) d.fonts.ready.then(fit); else fit(); };
    requestAnimationFrame(function () { setTimeout(measure, 0); });
    var t; window.addEventListener('resize', function () {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth; clearTimeout(t); t = setTimeout(fit, M(1));
    });
    if (phone.addEventListener) { phone.addEventListener('change', fit); small.addEventListener('change', fit); }
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init();
})();
