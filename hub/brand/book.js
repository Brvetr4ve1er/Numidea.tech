/* ============================================================
   Numidea Labs: the books on a phone or a tablet (brand books and bible).
   Loaded with `defer` by hub/bible/ and each hub/brand/<slug>/ page, after
   book.css. Nothing here is needed to read a page: without it the plates
   keep their desktop-shaped, single-column layout.

   1. A "Plates" chip (up to 1023 px) that follows the reader and opens the
      list of plates in a dialog: the current plate is shown in the chip.
   2. On phones (up to 640 px) the social posts turn into what a feed shows:
      the 3 x 3 grids are three-across thumbnails (each post is drawn at its
      design width and scaled, so nothing is re-flowed), the stories and the
      reel are one swipe row, and a tap on a thumbnail opens the post large
      in a dialog with its caption, previous and next, and a swipe.
   3. Carousels (slides) are swipe rows; blocks marked data-fold fold
      behind one button on phones.
   Nothing moves by itself; no network request is made.
   ============================================================ */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var FR = /^fr/i.test(root.lang || '');
  var T = FR
    ? { plates: 'Planches', sections: 'Sections', plate: 'Pl.', list: 'Les planches', sectionList: 'Sections', close: 'Fermer', open: 'Agrandir', prev: 'Post précédent', next: 'Post suivant',
        swipe: 'Faites glisser', of: ' sur ', show: 'Afficher : ', hide: 'Masquer : ', view: 'Aperçu du post', top: 'Haut de page' }
    : { plates: 'Plates', sections: 'Sections', plate: 'Pl.', list: 'The plates', sectionList: 'The sections', close: 'Close', open: 'Enlarge', prev: 'Previous post', next: 'Next post',
        swipe: 'Swipe', of: ' of ', show: 'Show: ', hide: 'Hide: ', view: 'Post preview', top: 'Top of page' };
  var phone = window.matchMedia('(max-width:640px)');
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
        var io2 = new IntersectionObserver(function (es) {
          chip.classList.toggle('is-on', !es[0].isIntersecting && es[0].boundingClientRect.bottom < 0);
        });
        io2.observe(head);
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
    var set = { node: node, kind: kind, cells: [] };
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

  function fit() {
    swipes.forEach(function (n) {
      if (phone.matches) { n.setAttribute('tabindex', '0'); n.setAttribute('role', 'group'); if (n.getAttribute('data-pv-label')) n.setAttribute('aria-label', n.getAttribute('data-pv-label')); }
      else { n.removeAttribute('tabindex'); n.removeAttribute('role'); n.removeAttribute('aria-label'); }
    });
    sets.forEach(function (s) {
      var on = phone.matches;
      s.node.classList.toggle('pv-on', on);
      s.cells.forEach(function (c) {
        c.fig.style.removeProperty('--k'); c.cell.style.removeProperty('height');
        if (!on) { c.fig.removeAttribute('aria-hidden'); return; }
        c.fig.setAttribute('aria-hidden', 'true');
        var dw = s.kind === 'grid' ? DW.grid : DW.row;
        c.fig.style.setProperty('--dw', dw + 'px');
        var w = c.cell.clientWidth; if (!w) return;
        var k = w / dw;
        c.fig.style.setProperty('--k', k.toFixed(4));
        c.cell.style.height = Math.round(c.fig.offsetHeight * k) + 'px';
      });
    });
  }

  function openViewer(set, i) {
    if (!viewer) {
      var dlg = el('dialog', 'pv-dlg');
      dlg.setAttribute('aria-label', T.view);
      dlg.innerHTML = '<div class="pv-stage"></div><div class="pv-bar"><button type="button" class="pv-prev" aria-label="' + T.prev + '"><span aria-hidden="true">←</span></button><span class="pv-count" aria-live="polite"></span><button type="button" class="pv-next" aria-label="' + T.next + '"><span aria-hidden="true">→</span></button><button type="button" class="pv-close" aria-label="' + T.close + '"><span aria-hidden="true">×</span></button></div>';
      d.body.appendChild(dlg);
      viewer = { dlg: dlg, stage: dlg.querySelector('.pv-stage'), count: dlg.querySelector('.pv-count'), set: null, i: 0 };
      dlg.addEventListener('click', function (e) {
        if (e.target.closest('.pv-close') || e.target === dlg || e.target === viewer.stage) dlg.close();
        else if (e.target.closest('.pv-prev')) go(-1);
        else if (e.target.closest('.pv-next')) go(1);
      });
      dlg.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') go(-1); else if (e.key === 'ArrowRight') go(1); });
      var x0 = null, y0 = 0;
      dlg.addEventListener('pointerdown', function (e) { x0 = e.clientX; y0 = e.clientY; });
      dlg.addEventListener('pointerup', function (e) {
        if (x0 === null) return; var dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
        else if (dy > 90 && dy > Math.abs(dx) * 1.5) dlg.close();
      });
      dlg.addEventListener('pointercancel', function () { x0 = null; });
    }
    viewer.set = set; show(i);
    if (!viewer.dlg.open) viewer.dlg.showModal();
  }
  function go(n) { var c = viewer.set.cells.length; show((viewer.i + n + c) % c); }
  function show(i) {
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
    v.stage.scrollTop = 0;
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
        btn.querySelector('.fold-i').textContent = open ? '−' : '+';
      });
    });
  }

  function init() {
    plateIndex();
    [].forEach.call(d.querySelectorAll('.pgrid'), function (n) { prepare(n, 'grid'); });
    [].forEach.call(d.querySelectorAll('.stories, .nstories, .reel'), function (n) { prepare(n, 'row'); swipeRow(n); });
    [].forEach.call(d.querySelectorAll('.slides, .car, .nsl-grid, .igs'), swipeRow);
    folds();
    root.classList.add('pv');
    fit();
    var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fit, 60); });
    if (phone.addEventListener) phone.addEventListener('change', fit);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(fit);
    window.addEventListener('load', fit);
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init();
})();
