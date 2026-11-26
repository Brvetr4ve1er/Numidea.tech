/* Preview page for the character kit. Not for the site: the site only needs kit.js + kit.css + art/. */
(function () {
  'use strict';
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) { if (k === 'text') e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]); }
    (kids || []).forEach(function (c) { e.appendChild(c); });
    return e;
  }
  function chip(label, on) { var b = el('button', { type: 'button', text: label, 'aria-pressed': 'false' }); b.addEventListener('click', on); return b; }
  function press(box, b) { [].forEach.call(box.querySelectorAll('button'), function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); }

  Kit.load('./').then(function (kit) {
    var d = kit.d, A = d.actions, R = d.reactions, S = d.scenes;
    var assets = Object.keys(kit.files);
    document.getElementById('stats').textContent =
      assets.length + ' fichiers · ' + Object.keys(A).length + ' actions · ' + Object.keys(R).length + ' réactions · ' + Object.keys(S).length + ' scènes · ' + d.clock.bpm + ' BPM';

    /* scenes */
    var stage = document.getElementById('sceneStage'), sc = document.getElementById('sceneChips');
    var talkTitle = el('span', { 'class': 'sep', text: 'Parle-lui (bible §00)' }); sc.appendChild(talkTitle);
    var menuDone = false;
    Object.keys(S).forEach(function (id) {
      if (!menuDone && id.indexOf('menu.') === 0) { menuDone = true; sc.appendChild(el('span', { 'class': 'sep', text: 'Menu (une pose par section manque encore)' })); }
      var s = S[id];
      var b = chip(s.q || s.label || id, function () { press(sc, b); kit.scene(stage, id); });
      b.title = id; sc.appendChild(b);
    });
    var stageHead = stage.querySelector('.st-face');
    kit.scene(stage, 'talk.wave');
    press(sc, sc.querySelector('button'));

    /* reactions */
    var rs = document.getElementById('reactStage'), rc = document.getElementById('reactChips');
    var head = rs.querySelector('[data-kit=head]'); head.querySelector('[data-base]').src = kit.src('yasser:rig:base');
    Object.keys(R).forEach(function (id) {
      var b = chip(R[id].fr + ' · ' + id, function () { press(rc, b); kit.react(rs, id); });
      rc.appendChild(b);
    });
    kit.react(rs, 'neutral'); press(rc, rc.querySelector('button'));

    /* actions */
    var grid = document.getElementById('actionGrid');
    Object.keys(A).forEach(function (id) {
      var a = A[id];
      var base = el('img', { 'data-base': '', alt: '', loading: 'lazy', src: kit.src(a.base || a.steps[0][0]) });
      var over = el('img', { 'data-over': '', alt: '' });
      var slot = el('div', { 'class': 'kit-slot' }, a.base ? [base, over] : [base]);
      var ms = a.steps.reduce(function (t, st) { return t + st[1]; }, 0) * kit.e8 * (typeof a.loop === 'number' ? a.loop : 1);
      var b = el('button', { type: 'button', text: '▶ Jouer' });
      b.addEventListener('click', function () { kit.play(slot, id); });
      grid.appendChild(el('div', { 'class': 'card', 'data-action': id }, [
        el('div', { 'class': 'frame' }, [slot]), el('b', { text: id }),
        el('small', { text: a.steps.length + ' images · ' + Math.round(ms) + ' ms' + (a.loop === 'idle' ? ' · boucle au hasard' : '') + (a.base ? ' · calque' : '') }), b]));
    });

    /* library */
    var lib = document.getElementById('libGroups'); lib.className = 'lib';
    var groups = {};
    assets.forEach(function (id) { var g = id.split(':').slice(0, 2).join(':'); (groups[g] = groups[g] || []).push(id); });
    Object.keys(groups).forEach(function (g) {
      var grid = el('div', { 'class': 'grid' });
      groups[g].forEach(function (id) {
        grid.appendChild(el('figure', {}, [el('img', { src: kit.src(id), alt: id, loading: 'lazy' }), el('figcaption', {}, [el('code', { text: id })])]));
      });
      lib.appendChild(el('h3', { text: g + ' (' + groups[g].length + ')' })); lib.appendChild(grid);
    });
    document.documentElement.setAttribute('data-ready', '1');
  }).catch(function (e) { document.getElementById('stats').textContent = 'Erreur : ' + e.message; });
})();
