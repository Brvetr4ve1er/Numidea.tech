// WorkspaceHQ v2 — fx engine: Bit the pet, click bursts, chiptune blips, coin flights.
window.HQFx = (function () {
  const C = { o: '#d97757', h: '#f2a27e', d: '#a5543a', e: '#1b1430' };
  const PB = ['...oooooo...','..ohoooooo..','.ohoooooooo.','.ooeooooeoo.','.ooeooooeoo.','oooooooooooo','.oooooooooo.','.dddddddddd.','..d.d..d.d..'];
  const pf = o => PB.map((r, i) => (o[i] != null ? o[i] : r));
  const sh = rows => { const out = []; rows.forEach((r, y) => [...r].forEach((ch, x) => { if (C[ch]) out.push(`${x * 3}px ${y * 3}px 0 ${C[ch]}`); })); return out.join(','); };
  const FR = {
    idle: sh(PB),
    walk: sh(pf({ 8: '.d.d....d.d.' })),
    blink: sh(pf({ 3: '.oooooooooo.', 4: '.oeeooooeeo.' })),
    happy: sh(pf({ 1: 'o.ohoooooo.o', 2: 'oohooooooooo', 4: '.oeoeooeoeo.', 5: '.oooooooooo.', 6: '.ooooddoooo.' })),
    sleep: sh(pf({ 3: '.oooooooooo.', 4: '.oeeooooeeo.', 8: '............' })),
    held: sh(pf({ 6: '.ooooddoooo.' })),
    look: sh(pf({ 3: '.oeoooooeoo.', 4: '.oooooooooo.' })),
  };
  let px = -1, layer, pet, opts = { sound: true, pet: true, reduce: false, floor: () => 6, facts: () => ['Hi.'] }, ac, raf, lastInteract = performance.now();

  function sfx(kind) {
    if (!opts.sound) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const seq = { click: [[880, .022]], open: [[520, .03], [780, .04]], done: [[523, .06], [659, .06], [784, .11]], level: [[523, .08], [659, .08], [784, .08], [1046, .26]], error: [[180, .14]], pet: [[988, .04], [1318, .07]], run: [[392, .05], [523, .07]], tab: [[660, .02], [990, .03]] }[kind] || [[660, .03]];
      let t = ac.currentTime;
      seq.forEach(([f, d]) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = kind === 'error' ? 'sawtooth' : 'square'; o.frequency.value = f;
        g.gain.setValueAtTime(kind === 'click' ? .018 : .03, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
        o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d + .02); t += d * .9;
      });
    } catch (e) {}
  }
  function burst(x, y, colors) {
    if (opts.reduce || !layer) return;
    colors = colors || ['#ffd23f', '#ffe27a', '#e8e6ff'];
    for (let i = 0; i < 8; i++) {
      const d = document.createElement('i');
      const s = i % 3 === 0 ? 5 : 3;
      d.style.cssText = `position:fixed;left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px;background:${colors[i % colors.length]};pointer-events:none`;
      layer.appendChild(d);
      const a = (Math.PI * 2 * i) / 8 + Math.random() * .5, r = 16 + Math.random() * 22;
      d.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${Math.cos(a) * r}px,${Math.sin(a) * r + 6}px)`, opacity: 0 }], { duration: 380 + Math.random() * 160, easing: 'cubic-bezier(.22,1,.36,1)' }).onfinish = () => d.remove();
    }
  }
  function floatText(x, y, text, color) {
    if (!layer) return;
    const d = document.createElement('div');
    d.textContent = text;
    d.style.cssText = `position:fixed;left:${x}px;top:${y}px;font:20px VT323, monospace;color:${color || '#ffe27a'};pointer-events:none;transform:translate(-50%,-50%);text-shadow:0 2px 0 #050409`;
    layer.appendChild(d);
    d.animate([{ transform: 'translate(-50%,-50%)', opacity: 1 }, { transform: 'translate(-50%,-180%)', opacity: 0 }], { duration: opts.reduce ? 10 : 900, easing: 'ease-out' }).onfinish = () => d.remove();
  }
  function coinFly(x, y, target) {
    return new Promise(res => {
      if (!layer || !target || opts.reduce) return res();
      const r = target.getBoundingClientRect();
      const c = document.createElement('div');
      c.style.cssText = `position:fixed;left:${x - 11}px;top:${y - 11}px;width:22px;height:22px;background:radial-gradient(circle at 35% 30%,#ffe27a,#ffd23f 65%,#c98f1b);border:2px solid #8a6200;pointer-events:none`;
      layer.appendChild(c);
      const dx = r.left + r.width / 2 - x, dy = r.top + r.height / 2 - y;
      c.animate([{ transform: 'translate(0,0) scale(1) rotateY(0)' }, { transform: `translate(${dx * .45}px,${dy * .45 - 90}px) scale(1.35) rotateY(360deg)` }, { transform: `translate(${dx}px,${dy}px) scale(.6) rotateY(720deg)`, opacity: .8 }], { duration: 700, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = () => { c.remove(); burst(r.left + r.width / 2, r.top + r.height / 2); res(); };
    });
  }
  // ---- Bit ----
  function buildPet() {
    const el = document.createElement('div');
    el.title = 'Bit · click or drag me';
    el.style.cssText = 'position:fixed;left:0;bottom:0;width:36px;height:27px;pointer-events:auto;cursor:grab;touch-action:none;will-change:transform;z-index:1';
    const body = document.createElement('div'); body.style.cssText = 'position:absolute;inset:0;transform-origin:50% 100%';
    const spr = document.createElement('div'); spr.style.cssText = 'position:absolute;left:0;top:0;width:3px;height:3px';
    const shadow = document.createElement('div'); shadow.style.cssText = 'position:absolute;left:4px;right:4px;bottom:-4px;height:3px;background:rgba(0,0,0,.35)';
    body.appendChild(spr);
    const hat = document.createElement('div'); hat.style.cssText = 'position:absolute;left:0;top:-9px;width:3px;height:3px;display:none';
    hat.style.boxShadow = ['..g..g..g...', '..gggggggg..', '..gyygyygg..'].map((r, y) => [...r].map((ch, x) => ch === 'g' ? `${x * 3}px ${y * 3}px 0 #ffd23f` : ch === 'y' ? `${x * 3}px ${y * 3}px 0 #e5645a` : null).filter(Boolean).join(',')).join(',');
    const cape = document.createElement('div'); cape.style.cssText = 'position:absolute;left:-3px;top:12px;width:3px;height:3px;display:none';
    cape.style.boxShadow = [0, 1, 2, 3, 4].map(y => `0px ${y * 3}px 0 #7aa2d6`).join(',');
    body.append(hat, cape);
    const helmet = document.createElement('div'); helmet.style.cssText = 'position:absolute;left:0;top:-6px;width:3px;height:3px;display:none';
    helmet.style.boxShadow = ['...yyyyyy...', '..yyyyyyyy..', '.dddddddddd.'].map((r, y) => [...r].map((ch, x) => ch === 'y' ? x * 3 + 'px ' + y * 3 + 'px 0 #e0c35a' : ch === 'd' ? x * 3 + 'px ' + y * 3 + 'px 0 #8a6a20' : null).filter(Boolean).join(',')).join(',');
    const drop = document.createElement('div'); drop.style.cssText = 'position:absolute;right:-4px;top:2px;width:3px;height:3px;opacity:0;box-shadow:0 0 0 #7aa2d6,0 3px 0 #7aa2d6,-3px 3px 0 #7aa2d6,0 6px 0 #a9c4e8';
    body.append(helmet, drop);
    const bub = document.createElement('div');
    bub.style.cssText = 'position:absolute;bottom:38px;left:50%;transform:translateX(-50%);background:#14102b;color:#e8e6ff;border:2px solid #050409;box-shadow:0 0 0 2px #5a4ea8;font:17px/1.1 VT323, monospace;padding:4px 9px;white-space:nowrap;opacity:0;transition:opacity .15s;pointer-events:none';
    const z = document.createElement('div'); z.textContent = 'z z'; z.style.cssText = 'position:absolute;right:-14px;top:-14px;font:16px VT323, monospace;color:#9a93c9;opacity:0;pointer-events:none';
    el.append(shadow, body, bub, z); layer.appendChild(el);
    pet = { el, body, spr, bub, z, shadow, hat, cape, helmet, drop, nextSweat: 0, x: Math.max(120, innerWidth * .5), y: 0, vy: 0, dir: 1, mode: 'idle', until: performance.now() + 1800, frame: '', t0: 0 };
    el.addEventListener('pointerdown', petDown);
  }
  function say(text, ms) {
    if (!pet) return;
    pet.bub.textContent = text; pet.bub.style.opacity = 1;
    clearTimeout(pet.bt); pet.bt = setTimeout(() => { pet.bub.style.opacity = 0; }, ms || 2400);
  }
  function event(kind, text, ms) {
    if (!pet || !opts.pet) return;
    const t = performance.now();
    if (kind === 'cheer') { pet.mode = 'cheer'; pet.t0 = t; pet.until = t + (ms || 1100); }
    if (kind === 'look') { pet.mode = 'look'; pet.until = t + (ms || 2600); }
    if (text) say(text, ms ? ms + 600 : 2400);
  }
  function petDown(e) {
    e.preventDefault(); e.stopPropagation();
    lastInteract = performance.now();
    pet.mode = 'held'; pet.dx = e.clientX; pet.dy = e.clientY; pet.moved = false; pet.el.style.cursor = 'grabbing';
    addEventListener('pointermove', petMove); addEventListener('pointerup', petUp, { once: true });
  }
  function petMove(e) {
    if (Math.abs(e.clientX - pet.dx) + Math.abs(e.clientY - pet.dy) > 5) pet.moved = true;
    if (pet.moved) { pet.x = e.clientX - 18; pet.y = Math.max(0, innerHeight - e.clientY - opts.floor() - 12); }
  }
  function petUp() {
    removeEventListener('pointermove', petMove); pet.el.style.cursor = 'grab';
    if (!pet.moved) {
      const t = performance.now(); pet.mode = 'cheer'; pet.t0 = t; pet.until = t + 900;
      const f = opts.facts(); say(f[Math.floor(Math.random() * f.length)]); sfx('pet');
      const r = pet.el.getBoundingClientRect(); floatText(r.left + 18, r.top - 4, '♥', '#ff6bcb');
    } else { pet.mode = 'fall'; pet.vy = 0; say('Wheee', 900); }
  }
  function tick(t) {
    raf = requestAnimationFrame(tick);
    if (!pet) return;
    pet.el.style.display = opts.pet ? 'block' : 'none';
    if (!opts.pet) return;
    const dt = Math.min(50, t - (pet.last || t)); pet.last = t;
    const W = innerWidth, floor = opts.floor();
    if (pet.mode === 'walk') {
      pet.x += pet.dir * .04 * dt;
      if (pet.x < 10) { pet.x = 10; pet.dir = 1; } if (pet.x > W - 50) { pet.x = W - 50; pet.dir = -1; }
      if (pet.target != null && Math.abs(pet.x - pet.target) < 6) { pet.target = null; pet.mode = 'cheer'; pet.t0 = t; pet.until = t + 600; }
      if (Math.random() < .004) floatText(pet.x + 18, innerHeight - opts.floor() - 34, '♪', '#e8916f');
      if (t > pet.until) { pet.mode = 'idle'; pet.until = t + 1500 + Math.random() * 3500; }
    } else if (pet.mode === 'idle') {
      if (t > pet.until) {
        if (t - lastInteract > 40000) { pet.mode = 'sleep'; }
        else { const r = Math.random(); if (r < .3 && px > 0) { pet.mode = 'walk'; pet.target = px - 18; pet.dir = pet.target > pet.x ? 1 : -1; pet.until = t + 6000; if (Math.random() < .4) say(['Hi!', 'What are we doing?', 'Ooh.', '♪'][Math.floor(Math.random() * 4)], 1400); } else if (r < .45) { pet.mode = 'look'; pet.until = t + 1600; } else { pet.mode = 'walk'; pet.target = null; pet.dir = Math.random() < .5 ? -1 : 1; pet.until = t + 2000 + Math.random() * 5000; } }
      }
    } else if (pet.mode === 'cheer') {
      pet.y = opts.reduce ? 0 : Math.abs(Math.sin((t - pet.t0) / 110)) * 16;
      if (t > pet.until) { pet.mode = 'idle'; pet.y = 0; pet.until = t + 900; }
    } else if (pet.mode === 'look') {
      if (t > pet.until) { pet.mode = 'idle'; pet.until = t + 600; }
    } else if (pet.mode === 'fall') {
      pet.vy += .0024 * dt; pet.y -= pet.vy * dt;
      if (pet.y <= 0) { pet.y = 0; if (pet.vy > .3) pet.vy = -pet.vy * .42; else { pet.vy = 0; pet.mode = 'idle'; pet.until = t + 1200; } }
    } else if (pet.mode === 'sleep') {
      if (t - lastInteract < 1000) { pet.mode = 'idle'; pet.until = t + 400; say('!', 700); }
    }
    pet.x = Math.min(Math.max(pet.x, 4), W - 40);
    let fr = 'idle';
    if (pet.mode === 'walk') fr = Math.floor(t / 150) % 2 ? 'walk' : 'idle';
    else if (pet.mode === 'cheer') fr = 'happy';
    else if (pet.mode === 'sleep') fr = 'sleep';
    else if (pet.mode === 'held' || pet.mode === 'fall') fr = 'held';
    else if (pet.mode === 'look') fr = 'look';
    else if (t % 3600 < 140) fr = 'blink';
    if (fr !== pet.frame) { pet.frame = fr; pet.spr.style.boxShadow = FR[fr]; }
    const sq = pet.mode === 'walk' && !opts.reduce ? 1 + Math.sin(t / 75) * .04 : 1;
    pet.body.style.transform = `scaleX(${pet.dir}) scaleY(${sq})`;
    pet.el.style.transform = `translate(${pet.x}px,${-(floor + pet.y)}px)`;
    pet.shadow.style.opacity = pet.y > 2 ? .15 : 1;
    const busy = opts.mood === 'busy';
    pet.helmet.style.display = busy ? 'block' : 'none';
    pet.hat.style.display = !busy && (opts.level || 0) >= 5 ? 'block' : 'none';
    if (opts.mood === 'nervous' && t > pet.nextSweat && !opts.reduce) { pet.nextSweat = t + 2600 + Math.random() * 2000; pet.drop.animate([{ opacity: 0, transform: 'translateY(0)' }, { opacity: 1, offset: .2 }, { opacity: 0, transform: 'translateY(10px)' }], { duration: 1100, easing: 'ease-in' }); pet.body.animate([{ translate: '0 0' }, { translate: '1px 0' }, { translate: '-1px 0' }, { translate: '0 0' }], { duration: 240, iterations: 2 }); }
    if (opts.mood === 'sleepy' && pet.mode === 'idle' && t - lastInteract > 12000) pet.mode = 'sleep';
    pet.cape.style.display = (opts.level || 0) >= 7 ? 'block' : 'none';
    pet.z.style.opacity = pet.mode === 'sleep' ? (.5 + .5 * Math.sin(t / 420)) : 0;
  }
  addEventListener('pointermove', e => { px = e.clientX; });
  function onDown(e) {
    lastInteract = performance.now();
    const b = e.target.closest && e.target.closest('button,a,[role=button],[role=tab],input[type=checkbox]');
    if (b && !b.disabled && b.getAttribute('aria-disabled') !== 'true') { burst(e.clientX, e.clientY); sfx('click'); }
  }
  function asciiBurst(x, y, text) {
    if (!layer || opts.reduce) return;
    const chars = (text || '✻').split('').concat(['*', '+', '·', '✶', '✻', '#', '=']);
    for (let i = 0; i < 26; i++) {
      const d = document.createElement('div'); d.textContent = chars[i % chars.length];
      d.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;font:600 ' + (12 + Math.random() * 10) + 'px "IBM Plex Mono",monospace;color:' + ['#d97757', '#e8916f', '#e8e4dc', '#86b98a', '#e0c35a'][i % 5] + ';pointer-events:none;transform:translate(-50%,-50%)';
      layer.appendChild(d);
      const a = Math.random() * Math.PI * 2, r = 60 + Math.random() * 120;
      d.animate([{ transform: 'translate(-50%,-50%) scale(.4)', opacity: 1 }, { transform: 'translate(calc(-50% + ' + Math.cos(a) * r + 'px), calc(-50% + ' + (Math.sin(a) * r + 40) + 'px)) scale(1) rotate(' + (Math.random() * 180 - 90) + 'deg)', opacity: 0 }], { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(.2,.8,.3,1)' }).onfinish = () => d.remove();
    }
    if (text && text.length > 1) { const w = document.createElement('div'); w.textContent = text; w.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;font:600 22px "IBM Plex Mono",monospace;color:#e8916f;pointer-events:none;transform:translate(-50%,-50%);letter-spacing:.1em;white-space:nowrap'; layer.appendChild(w); w.animate([{ opacity: 0, transform: 'translate(-50%,-30%)', letterSpacing: '.6em' }, { opacity: 1, offset: .25, letterSpacing: '.12em' }, { opacity: 0, transform: 'translate(-50%,-120%)' }], { duration: 1600, easing: 'ease-out' }).onfinish = () => w.remove(); }
  }
  let keys = '', lastCareful = 0;
  addEventListener('keydown', e => {
    const tg = (e.target.tagName || '').toLowerCase(); if (tg === 'input' || tg === 'textarea') return;
    keys = (keys + e.key.toLowerCase()).slice(-12);
    if (keys.endsWith('bit') && pet) { pet.mode = 'cheer'; pet.t0 = performance.now(); pet.until = pet.t0 + 2400; say('you found me ✻', 2200); sfx('level'); const r = pet.el.getBoundingClientRect(); asciiBurst(r.left + 18, r.top, '♥'); }
    if (keys.endsWith('arrowuparrowup') || keys.endsWith('dance')) { if (pet) { pet.mode = 'cheer'; pet.t0 = performance.now(); pet.until = pet.t0 + 4000; say('♪ ♫ ♪', 3000); } }
  });
  document.addEventListener('mouseover', e => {
    const b = e.target.closest && e.target.closest('button'); if (!b || !pet || !opts.pet) return;
    const st = b.getAttribute('style') || '';
    if (/color:var\(--red\)/.test(st) && performance.now() - lastCareful > 9000) { lastCareful = performance.now(); say(['careful…', 'are you sure?', 'eep.'][Math.floor(Math.random() * 3)], 1400); pet.mode = 'look'; pet.until = performance.now() + 1400; }
  });
  function init(o) {
    Object.assign(opts, o || {});
    if (layer) return;
    layer = document.createElement('div');
    layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2000;overflow:hidden';
    document.body.appendChild(layer);
    buildPet();
    document.addEventListener('pointerdown', onDown);
    raf = requestAnimationFrame(tick);
  }
  function set(o) { Object.assign(opts, o); }
  function destroy() { cancelAnimationFrame(raf); document.removeEventListener('pointerdown', onDown); if (layer) layer.remove(); layer = null; pet = null; }
  return { init, set, sfx, burst, coinFly, floatText, event, say, destroy, asciiBurst };
})();
