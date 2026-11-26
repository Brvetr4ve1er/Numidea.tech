/* Numidea character kit player. No dependencies, ~4 KB.
   Data: kit.json (actions, reactions, motions, scenes) + manifest.json (asset id → file).
   Everything runs on the 90 BPM clock: holds are counted in eighths (e8 = 83 ms).

   Kit.load(base)                      → Promise<kit>, base = folder that holds kit.json, manifest.json, art/
   kit.src(id)                         → file URL for an asset id ('yasser:face:smirk', or short forms below)
   kit.play(slot, actionId)            → Promise; slot = element holding <img data-base> + <img data-over>
   kit.idle(slot, actionId)            → starts a random-gap loop (blink); returns stop()
   kit.react(stage, emotion)           → swaps face, Kūro, mark; runs the motion; returns Promise
   kit.scene(stage, sceneId)           → reaction + body (pose or action) + word stamp + prop + card
   Short ids: 'pose:x' → yasser:pose:x · face 'x' → yasser:face:x · kuro 'x' → kuro:react:x · prop 'x' → props:x
   Reduced motion: actions jump to their last frame, motions don't run, idle loops don't start. */
(function (g) {
  'use strict';
  var reduce = g.matchMedia && g.matchMedia('(prefers-reduced-motion: reduce)');
  function still() { return !!(reduce && reduce.matches); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function Kit(base, data, manifest) {
    this.base = base.replace(/\/?$/, '/'); this.d = data; this.files = {};
    var self = this; manifest.assets.forEach(function (a) { self.files[a.id] = a.file; });
    this.e8 = data.clock.e8;
  }
  Kit.prototype.id = function (id, kind) {
    if (!id) return null;
    if (id.split(':').length === 3) return id;
    if (/^pose:/.test(id)) return 'yasser:' + id;
    if (kind === 'face') return 'yasser:face:' + id;
    if (kind === 'kuro') return 'kuro:react:' + id;
    if (kind === 'prop') return 'props:' + id;
    return id;
  };
  Kit.prototype.src = function (id, kind) { var f = this.files[this.id(id, kind)]; return f ? this.base + f : ''; };
  Kit.prototype.preload = function (ids) { var self = this; ids.forEach(function (i) { var im = new Image(); im.src = self.src(i); }); };

  /* frame sequences. A rig action draws over its base; a body action replaces the image. */
  Kit.prototype.play = function (slot, name) {
    var a = this.d.actions[name], self = this; if (!a) return Promise.resolve();
    var base = slot.querySelector('[data-base]'), over = slot.querySelector('[data-over]') || base;
    var token = {}; slot._kit = token;
    if (a.base && base) base.src = this.src(a.base);
    var steps = a.steps, loops = typeof a.loop === 'number' ? a.loop : 1;
    if (still()) { var last = steps[steps.length - 1][0]; (a.base ? over : base).src = this.src(last); if (a.base && over !== base) over.style.opacity = last === a.base ? 0 : 1; return Promise.resolve(); }
    var run = Promise.resolve();
    for (var n = 0; n < loops; n++) steps.forEach(function (st) {
      run = run.then(function () {
        if (slot._kit !== token) return;
        var target = a.base ? over : base;
        if (a.base && over !== base) { over.style.opacity = st[0] === a.base ? 0 : 1; if (st[0] !== a.base) over.src = self.src(st[0]); }
        else target.src = self.src(st[0]);
        return wait(Math.round(st[1] * self.e8));
      });
    });
    return run.then(function () { if (a.base && over !== base && slot._kit === token) over.style.opacity = 0; });
  };
  Kit.prototype.idle = function (slot, name) {
    var a = this.d.actions[name], self = this, t = 0, on = true;
    if (!a || still()) return function () {};
    var gap = a.every || [2.2, 4.8];
    (function next() { t = setTimeout(function () { if (!on) return; self.play(slot, name).then(next); }, (gap[0] + Math.random() * (gap[1] - gap[0])) * 1000); })();
    return function () { on = false; clearTimeout(t); };
  };

  var EASE = { out: 'cubic-bezier(.16,1,.3,1)', 'in': 'cubic-bezier(.7,0,.84,0)', snap: 'cubic-bezier(.34,1.56,.64,1)', move: 'cubic-bezier(.65,0,.35,1)' };
  Kit.prototype.motion = function (el, name) {
    if (el && el.getAnimations) el.getAnimations().forEach(function (x) { x.cancel(); });   // a held droop/tilt never leaks into the next reaction
    var m = this.d.motions[name]; if (!el || !m || !m.keyframes || still() || !el.animate) return Promise.resolve();
    var kf = m.keyframes.map(function (k) { return { offset: k[0], transform: k[1] }; });
    var anim = el.animate(kf, { duration: m.ms, easing: EASE[m.ease] || m.ease, fill: name === 'droop' || name === 'tilt' || name === 'push-in' ? 'forwards' : 'none' });
    return anim.finished.catch(function () {});
  };

  /* stage contract (any markup works if it has these hooks):
     [data-kit=face] img · [data-kit=kuro] img · [data-kit=mark] · [data-kit=body] slot · [data-kit=word]
     [data-kit=prop] img · [data-kit=card-name] · [data-kit=card-line] · [data-kit=line] · [data-kit=shake] wrapper */
  function q(stage, k) { return stage.querySelector('[data-kit="' + k + '"]'); }
  function restart(el, cls) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
  Kit.prototype.react = function (stage, emo) {
    var r = this.d.reactions[emo]; if (!r) return Promise.resolve();
    var face = q(stage, 'face'), kuro = q(stage, 'kuro'), mark = q(stage, 'mark');
    if (face) face.src = this.src(r.face, 'face');
    if (kuro && r.kuro) kuro.src = this.src(r.kuro, 'kuro');
    if (mark) { mark.textContent = r.mark; restart(mark, 'kit-pop'); }
    var jobs = [this.motion(q(stage, 'shake') || face, r.motion)];
    if (r.action && q(stage, 'head')) jobs.push(this.play(q(stage, 'head'), r.action));
    return Promise.all(jobs);
  };
  Kit.prototype.scene = function (stage, id) {
    var s = this.d.scenes[id], self = this; if (!s) return Promise.resolve();
    stage.setAttribute('data-scene', id);
    var body = q(stage, 'body'), word = q(stage, 'word'), prop = q(stage, 'prop'), line = q(stage, 'line');
    var cn = q(stage, 'card-name'), cl = q(stage, 'card-line'), kuro = q(stage, 'kuro');
    var jobs = [];
    if (s.reaction) jobs.push(this.react(stage, s.reaction));
    else { var mk = q(stage, 'mark'); if (mk) mk.textContent = ''; this.motion(q(stage, 'shake') || q(stage, 'face'), 'none'); }
    if (s.kuro && s.kuro !== 'none' && kuro) kuro.src = this.src(s.kuro, 'kuro');
    if (s.face && q(stage, 'face')) q(stage, 'face').src = this.src(s.face, 'face');
    if (line) line.textContent = s.line || '';
    stage.classList.toggle('kit-has-body', !!s.body);
    if (body && s.body) {
      var img = body.querySelector('[data-base]');
      if (this.d.actions[s.body]) jobs.push(this.play(body, s.body)); else if (img) img.src = this.src(s.body);
      restart(body, 'kit-slam');
    }
    if (word) { word.textContent = s.word || s.label || ''; restart(word, 'kit-stamp'); }
    stage.classList.toggle('kit-has-prop', !!s.prop);
    if (prop && s.prop) { prop.src = this.src(s.prop, 'prop'); restart(prop, 'kit-pop'); }
    if (cn) cn.textContent = s.card ? s.card[0] : ''; if (cl) cl.textContent = s.card ? s.card[1] : '';
    stage.classList.toggle('kit-has-card', !!s.card);
    return Promise.all(jobs);
  };

  g.Kit = {
    load: function (base) {
      base = base || './';
      var get = function (f) { return fetch(base.replace(/\/?$/, '/') + f).then(function (r) { return r.json(); }); };
      return Promise.all([get('kit.json'), get('manifest.json')]).then(function (x) { return new Kit(base, x[0], x[1]); });
    }
  };
})(window);
