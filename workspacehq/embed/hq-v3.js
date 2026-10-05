// WorkspaceHQ v3 — ascii background, text animations, animated icons. Plain custom elements.
(function () {
  const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.hqReduce === '1';
  const css = (el, n, f) => (getComputedStyle(el).getPropertyValue(n) || f).trim() || f;

  // ---------- <hq-ascii-bg> : calm tech field (slow contour waves through a dot grid) ----------
  if (!customElements.get('hq-ascii-bg')) customElements.define('hq-ascii-bg', class extends HTMLElement {
    connectedCallback() {
      this.style.cssText += ';position:absolute;inset:0;display:block;pointer-events:none;overflow:hidden;z-index:0';
      this.cv = document.createElement('canvas'); this.cv.style.cssText = 'width:100%;height:100%;display:block'; this.appendChild(this.cv);
      this.mx = -999; this.my = -999; this.lx = -999; this.ly = -999; this.t0 = performance.now(); this.last = 0;
      this.onMove = e => { const r = this.getBoundingClientRect(); this.mx = e.clientX - r.left; this.my = e.clientY - r.top; };
      addEventListener('pointermove', this.onMove);
      const loop = t => { this.raf = requestAnimationFrame(loop); if (t - this.last < 50) return; this.last = t; this.draw(t); };
      this.raf = requestAnimationFrame(loop); setTimeout(() => this.draw(performance.now()), 60);
    }
    disconnectedCallback() { cancelAnimationFrame(this.raf); removeEventListener('pointermove', this.onMove); }
    draw(t) {
      const cv = this.cv, W = this.clientWidth, H = this.clientHeight, dpr = Math.min(2, devicePixelRatio || 1);
      if (!W || !H) return;
      if (cv.width !== W * dpr || cv.height !== H * dpr) { cv.width = W * dpr; cv.height = H * dpr; this.seed(W, H); }
      const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, H);
      const faint = css(this, '--faint', '#6e695f'), line = css(this, '--frame', '#2c2a27'), acc = css(this, '--gold', '#d97757'), font = css(this, '--term', 'monospace');
      const k = RM() ? 0 : (t - this.t0) / 1000, cs = 22;
      this.lx += (this.mx - this.lx) * .12; this.ly += (this.my - this.ly) * .12;
      c.font = '10px ' + font; c.textBaseline = 'middle'; c.textAlign = 'center';
      for (let y = cs / 2; y < H; y += cs) for (let x = cs / 2; x < W; x += cs) {
        const wave = Math.sin(x * .006 + y * .004 - k * .35) + Math.sin(x * .003 - y * .007 + k * .22);
        const band = Math.max(0, 1 - Math.abs(wave - .6) * 2.2);
        const d = Math.hypot(x - this.lx, y - this.ly), lens = d < 180 ? Math.pow(1 - d / 180, 2) : 0;
        c.globalAlpha = .10 + band * .22 + lens * .35;
        c.fillStyle = lens > .3 ? acc : faint;
        c.fillText(band > .7 ? '+' : '·', x, y);
      }
      c.globalAlpha = .35; c.strokeStyle = line; c.lineWidth = 1; c.fillStyle = faint; c.textAlign = 'left';
      this.frames.forEach(f => {
        const b = 12, o = .5 + .5 * Math.sin(k * .4 + f.ph); c.globalAlpha = .18 + o * .2; c.beginPath();
        [[f.x, f.y, 1, 1], [f.x + f.w, f.y, -1, 1], [f.x, f.y + f.h, 1, -1], [f.x + f.w, f.y + f.h, -1, -1]].forEach(([x, y, sx, sy]) => { c.moveTo(x + sx * b, y); c.lineTo(x, y); c.lineTo(x, y + sy * b); });
        c.stroke(); c.fillText(f.label, f.x + 8, f.y + 10);
      });
      c.globalAlpha = 1;
    }
    seed(W, H) {
      const L = ['node.a · stable', 'scan · idle', 'git.mon · 8 repos', 'pod.042', 'mem · nominal'];
      this.frames = Array.from({ length: 3 }, (_, i) => ({ x: 60 + Math.random() * (W - 340), y: 80 + Math.random() * (H - 240), w: 140 + Math.random() * 160, h: 70 + Math.random() * 80, label: L[i % L.length], ph: Math.random() * 6 }));
    }
  });

  // ---------- alive: gentle ambient motion applied to the live DOM ----------
  const alive = { seen: new WeakSet() };
  function enliven(root) {
    if (RM()) return;
    root.querySelectorAll('span[style*="width:7px"],span[style*="width:8px"],span[style*="width:10px"]').forEach(el => {
      if (alive.seen.has(el)) return; const st = el.getAttribute('style') || ''; if (!/background:var\(--(red|orange|green|gold|blue)/.test(st) || el.offsetHeight > 12) return;
      alive.seen.add(el); const hot = /--red/.test(st);
      el.animate(hot ? [{ opacity: 1, transform: 'scale(1)' }, { opacity: .5, transform: 'scale(1.35)' }, { opacity: 1, transform: 'scale(1)' }] : [{ opacity: 1 }, { opacity: .45 }, { opacity: 1 }], { duration: hot ? 1600 : 2800, delay: Math.random() * 1500, iterations: Infinity, easing: 'ease-in-out' });
    });
    root.querySelectorAll('section[style*="solid var(--gold)"]').forEach(el => {
      if (alive.seen.has(el)) return; alive.seen.add(el);
      el.animate([{ boxShadow: '0 0 0 0 rgba(217,119,87,0)' }, { boxShadow: '0 0 28px -6px rgba(217,119,87,.35)' }, { boxShadow: '0 0 0 0 rgba(217,119,87,0)' }], { duration: 4200, iterations: Infinity, easing: 'ease-in-out' });
    });
  }
  function stagger(root) {
    if (RM()) return;
    const els = [...root.querySelectorAll('main section, main button[style*="border-radius:12px"], main div[style*="border-radius:12px"]')].filter(e => e.offsetParent && e.getBoundingClientRect().top < innerHeight).slice(0, 22);
    els.forEach((e, i) => e.animate([{ opacity: 0, translate: '0 10px' }, { opacity: 1, translate: '0 0' }], { duration: 420, delay: i * 35, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }));
  }
  let pend = 0;
  const mo = new MutationObserver(() => { if (pend) return; pend = setTimeout(() => { pend = 0; enliven(document); }, 120); });
  addEventListener('DOMContentLoaded', () => { mo.observe(document.body, { childList: true, subtree: true }); enliven(document); });
  if (document.body) { mo.observe(document.body, { childList: true, subtree: true }); setTimeout(() => enliven(document), 400); }
  // tilt on big cards
  addEventListener('pointermove', e => {
    if (RM()) return; const el = e.target.closest && e.target.closest('button');
    if (alive.tilt && alive.tilt !== el) { alive.tilt.style.rotate = ''; alive.tilt = null; }
    if (!el || el.offsetHeight < 70 || el.offsetWidth > 900) return;
    const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
    el.style.rotate = (-py).toFixed(3) + ' ' + px.toFixed(3) + ' 0 ' + (Math.hypot(px, py) * 4).toFixed(2) + 'deg'; alive.tilt = el;
  });
  // idle icon flourish on the active destination
  setInterval(() => { if (RM()) return; const i = document.querySelector('button[aria-current="page"] hq-icon'); if (i && i.play) i.play(); }, 9000);
  window.HQAlive = { stagger: () => setTimeout(() => stagger(document), 30), enliven: () => enliven(document) };

  // ---------- <hq-ember days> : small flickering streak flame ----------
  if (!customElements.get('hq-ember')) customElements.define('hq-ember', class extends HTMLElement {
    connectedCallback() {
      const rt = this.shadowRoot || this.attachShadow({ mode: 'open' }), n = +(this.getAttribute('days') || 0);
      rt.innerHTML = '<span style="display:inline-flex;align-items:baseline;gap:3px;font-size:12px"><svg viewBox="0 0 10 14" width="10" height="14" style="overflow:visible"><path d="M5 0C6 3 9 5 9 9a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3C4 6 4 3 5 0z" fill="#e0a35a"/><path d="M5 6c1 1.5 2 2.4 2 4a2 2 0 0 1-4 0c0-1 .6-1.6 1.2-2C4.4 9 5 9.3 5 6z" fill="#d97757"/></svg><b style="font-weight:600;color:var(--accent-text)">' + n + '</b></span>';
      if (!RM()) rt.querySelectorAll('path').forEach((p, i) => p.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(.92,1.12)' }, { transform: 'scale(1.04,.94)' }, { transform: 'scale(1,1)' }], { duration: 900 + i * 300, iterations: Infinity, easing: 'ease-in-out' }));
      rt.querySelectorAll('path').forEach(p => { p.style.transformOrigin = '50% 100%'; p.style.transformBox = 'fill-box'; });
    }
  });
  // ---------- <hq-prompt hints> : rotating typewriter placeholder ----------
  if (!customElements.get('hq-prompt')) customElements.define('hq-prompt', class extends HTMLElement {
    connectedCallback() {
      const rt = this.shadowRoot || this.attachShadow({ mode: 'open' });
      rt.innerHTML = '<span></span><span style="display:inline-block;width:.55em;height:1em;vertical-align:-.15em;background:var(--gold);margin-left:1px"></span>';
      const s = rt.firstChild; blink(rt.lastChild);
      const hints = (this.getAttribute('hints') || 'ask or run anything').split('|'); let h = 0, i = 0, dir = 1, hold = 0;
      if (RM()) { s.textContent = hints[0]; return; }
      this.iv = setInterval(() => { const w = hints[h]; if (hold > 0) { hold--; return; } i += dir; s.textContent = w.slice(0, i); if (i >= w.length) { dir = -1; hold = 40; } else if (i <= 0) { dir = 1; h = (h + 1) % hints.length; hold = 6; } }, 45);
    }
    disconnectedCallback() { clearInterval(this.iv); }
  });

  // ---------- <hq-clock> ----------
  if (!customElements.get('hq-clock')) customElements.define('hq-clock', class extends HTMLElement {
    connectedCallback() { const rt = this.shadowRoot || this.attachShadow({ mode: 'open' }); const tick = () => { const d = new Date(); rt.innerHTML = String(d.getHours()).padStart(2, '0') + '<span style="opacity:' + (d.getSeconds() % 2 ? .3 : 1) + '">:</span>' + String(d.getMinutes()).padStart(2, '0'); }; tick(); this.iv = setInterval(tick, 1000); }
    disconnectedCallback() { clearInterval(this.iv); }
  });

  // ---------- text animations ---------- (render into shadow roots so React re-renders can't clear them)
  const SR = el => el.shadowRoot || el.attachShadow({ mode: 'open' });
  const GL = '!<>-_\\/[]{}—=+*^?#%01ABCDEF';
  function blink(el) { if (!RM()) el.animate([{ opacity: 1 }, { opacity: 1, offset: .5 }, { opacity: 0, offset: .51 }, { opacity: 0 }], { duration: 1000, iterations: Infinity }); }
  if (!customElements.get('hq-type')) customElements.define('hq-type', class extends HTMLElement {
    static get observedAttributes() { return ['text']; }
    connectedCallback() { this.style.display = 'inline'; this.run(); }
    attributeChangedCallback() { if (this.isConnected) this.run(); }
    run() {
      const txt = this.getAttribute('text') || ''; clearInterval(this.iv);
      const rt = SR(this); rt.innerHTML = '<span></span><span style="display:inline-block;width:.55em;height:1em;margin-left:.08em;vertical-align:-.12em;background:var(--gold)"></span>';
      const s = rt.firstChild, cur = rt.lastChild; blink(cur);
      if (RM()) { s.textContent = txt; return; }
      let i = 0; const sp = +(this.getAttribute('speed') || 28);
      this.iv = setInterval(() => { i++; s.textContent = txt.slice(0, i); if (i >= txt.length) { clearInterval(this.iv); if (this.hasAttribute('hide-cursor')) setTimeout(() => cur.remove(), 1200); } }, sp);
    }
    disconnectedCallback() { clearInterval(this.iv); }
  });
  if (!customElements.get('hq-scramble')) customElements.define('hq-scramble', class extends HTMLElement {
    static get observedAttributes() { return ['text']; }
    connectedCallback() { this.style.display = 'inline'; this.run(true); }
    attributeChangedCallback(n, o, v) { if (this.isConnected && o !== v) this.run(false); }
    run(first) {
      const to = String(this.getAttribute('text') ?? ''); cancelAnimationFrame(this.raf);
      const rt = SR(this);
      if (RM() || (first && !this.hasAttribute('intro'))) { rt.textContent = to; return; }
      const from = rt.textContent || '', len = Math.max(from.length, to.length), t0 = performance.now(), dur = 420;
      const step = t => {
        const p = Math.min(1, (t - t0) / dur); let out = '';
        for (let i = 0; i < len; i++) { const done = i / len < p; out += done ? (to[i] || '') : (to[i] === ' ' ? ' ' : GL[Math.floor(Math.random() * GL.length)]); }
        rt.textContent = out; if (p < 1) this.raf = requestAnimationFrame(step); else rt.textContent = to;
      };
      this.raf = requestAnimationFrame(step); clearTimeout(this.fb); this.fb = setTimeout(() => { cancelAnimationFrame(this.raf); rt.textContent = to; }, dur + 120);
    }
  });
  if (!customElements.get('hq-roll')) customElements.define('hq-roll', class extends HTMLElement {
    static get observedAttributes() { return ['value']; }
    connectedCallback() { this.style.display = 'inline'; this.cur = 0; this.run(); }
    attributeChangedCallback() { if (this.isConnected) this.run(); }
    run() {
      const to = +(this.getAttribute('value') || 0), from = this.cur || 0; cancelAnimationFrame(this.raf);
      const rt = SR(this);
      if (RM() || from === to) { this.cur = to; rt.textContent = to.toLocaleString(); return; }
      const t0 = performance.now(), dur = 700;
      const step = t => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); this.cur = Math.round(from + (to - from) * e); rt.textContent = this.cur.toLocaleString(); if (p < 1) this.raf = requestAnimationFrame(step); };
      this.raf = requestAnimationFrame(step); clearTimeout(this.fb); this.fb = setTimeout(() => { cancelAnimationFrame(this.raf); this.cur = to; rt.textContent = to.toLocaleString(); }, dur + 120);
    }
  });
  const SPIN = ['·', '✢', '✳', '✶', '✻', '✽', '✻', '✶', '✳', '✢'];
  if (!customElements.get('hq-spin')) customElements.define('hq-spin', class extends HTMLElement {
    connectedCallback() {
      this.style.display = 'inline-flex'; this.style.gap = '.5em'; this.style.alignItems = 'baseline';
      const rt = SR(this); rt.innerHTML = '<span style="color:var(--gold);width:1em;display:inline-block;text-align:center"></span><span></span>';
      let i = 0; const g = rt.firstChild, v = rt.lastChild;
      const verbs = (this.getAttribute('verbs') || this.getAttribute('verb') || 'Working').split('|');
      const tick = () => { g.textContent = SPIN[i % SPIN.length]; v.textContent = verbs[Math.floor(i / 24) % verbs.length] + '…'; i++; };
      tick(); if (!RM()) this.iv = setInterval(tick, 110);
    }
    disconnectedCallback() { clearInterval(this.iv); }
  });
  if (!customElements.get('hq-lines')) customElements.define('hq-lines', class extends HTMLElement {
    static get observedAttributes() { return ['text']; }
    connectedCallback() { this.style.display = 'block'; this.shown = 0; this.run(); }
    attributeChangedCallback() { if (this.isConnected) this.run(); }
    run() {
      const lines = (this.getAttribute('text') || '').split('\n');
      const rt = SR(this);
      if (lines.length < this.shown || !rt.childNodes.length) { rt.innerHTML = ''; this.shown = 0; }
      for (let i = this.shown; i < lines.length; i++) {
        const d = document.createElement('div'); d.textContent = lines[i];
        const l = lines[i]; if (l.startsWith('+')) d.style.color = 'var(--green)'; else if (l.startsWith('-')) d.style.color = 'var(--red)'; else if (l.startsWith('✗')) d.style.color = 'var(--red)'; else if (l.startsWith('@@')) d.style.color = 'var(--blue)';
        rt.appendChild(d);
        if (!RM()) d.animate([{ opacity: 0, transform: 'translateX(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 260, delay: (i - this.shown) * 55, easing: 'ease-out', fill: 'backwards' });
      }
      this.shown = lines.length;
    }
  });

  // ---------- <hq-icon name> : filled, animated ----------
  const I = {
    home: ['M12 3 2.5 11h2.5v9h5v-6h4v6h5v-9h2.5z'],
    projects: ['M3 3h8v8H3z', 'M13 3h8v8h-8z', 'M3 13h8v8H3z', 'M13 13h8v8h-8z'],
    tasks: ['M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h14V5z', 'M10.2 15.6 6.6 12l1.4-1.4 2.2 2.2 5.8-5.8 1.4 1.4z'],
    automations: ['M13 2 4 14h6l-1 8 9-12h-6z'],
    claude: ['M12 1.5l1.6 7.2 6.4-3.7-3.7 6.4 7.2 1.6-7.2 1.6 3.7 6.4-6.4-3.7L12 22.5l-1.6-7.2-6.4 3.7 3.7-6.4-7.2-1.6 7.2-1.6L4 5l6.4 3.7z'],
    history: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16z', 'M11 6h2v6.2l4 2.4-1 1.7-5-3z'],
    system: ['M7 7h10v10H7zm2 2v6h6V9z', 'M9 2h2v4H9zM13 2h2v4h-2zM9 18h2v4H9zM13 18h2v4h-2zM2 9h4v2H2zM2 13h4v2H2zM18 9h4v2h-4zM18 13h4v2h-4z'],
    life: ['M12 21s-8.5-5.3-8.5-11.2A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8.5 3.2C20.5 15.7 12 21 12 21z'],
    studio: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16z', 'M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z'],
    search: ['M10 3a7 7 0 1 0 4.2 12.6l5.1 5.1 1.4-1.4-5.1-5.1A7 7 0 0 0 10 3zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z'],
    focus: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 3a7 7 0 1 1 0 14 7 7 0 0 1 0-14z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
    activity: ['M2 11h4l3-7 5 16 3-9h5v2h-3.6L14 21 9 5l-1.7 4H2z'],
    settings: ['M10.3 2h3.4l.5 2.6 1.9.8 2.2-1.5 2.4 2.4-1.5 2.2.8 1.9 2.6.5v3.4l-2.6.5-.8 1.9 1.5 2.2-2.4 2.4-2.2-1.5-1.9.8-.5 2.6h-3.4l-.5-2.6-1.9-.8-2.2 1.5-2.4-2.4 1.5-2.2-.8-1.9L2 13.7v-3.4l2.6-.5.8-1.9-1.5-2.2 2.4-2.4 2.2 1.5 1.9-.8zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z'],
    theme: ['M12 2a10 10 0 1 0 0 20zm0 2v16a8 8 0 0 1 0-16z'],
    scan: ['M12 4a8 8 0 0 1 7.4 5H17v2h6V5h-2v2.3A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z', 'M12 20a8 8 0 0 1-7.4-5H7v-2H1v6h2v-2.3A10 10 0 0 0 22 12h-2a8 8 0 0 1-8 8z'],
    bell: ['M12 2a2 2 0 0 1 2 2v.3A7 7 0 0 1 19 11v5l2 2v1H3v-1l2-2v-5a7 7 0 0 1 5-6.7V4a2 2 0 0 1 2-2z', 'M10 20h4a2 2 0 0 1-4 0z'],
    plus: ['M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z'],
    status: ['M3 4h18v4H3zM3 10h18v4H3zM3 16h18v4H3z'],
  };
  const HOVER = {
    home: p => p[0].animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-3px)' }, { transform: 'translateY(0)' }], { duration: 360, easing: 'cubic-bezier(.3,1.6,.5,1)' }),
    projects: p => p.forEach((e, i) => e.animate([{ transform: 'scale(1)' }, { transform: 'scale(.6)' }, { transform: 'scale(1)' }], { duration: 300, delay: i * 50 })),
    tasks: p => p[1] && p[1].animate([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 320, easing: 'ease-out' }),
    automations: p => p[0].animate([{ opacity: 1 }, { opacity: .2 }, { opacity: 1 }, { opacity: .4 }, { opacity: 1 }], { duration: 380 }),
    claude: p => p[0].animate([{ transform: 'rotate(0)' }, { transform: 'rotate(90deg)' }], { duration: 520, easing: 'cubic-bezier(.3,1.4,.5,1)' }),
    history: p => p[1] && p[1].animate([{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], { duration: 700, easing: 'ease-in-out' }),
    system: p => p[1] && p[1].animate([{ opacity: 1 }, { opacity: .25 }, { opacity: 1 }], { duration: 420, iterations: 2 }),
    life: p => p[0].animate([{ transform: 'scale(1)' }, { transform: 'scale(1.22)' }, { transform: 'scale(.95)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 620 }),
    studio: p => p[1] && p[1].animate([{ transform: 'scale(1)' }, { transform: 'scale(.4)' }, { transform: 'scale(1)' }], { duration: 380, easing: 'cubic-bezier(.3,1.5,.5,1)' }),
    settings: p => p[0].animate([{ transform: 'rotate(0)' }, { transform: 'rotate(120deg)' }], { duration: 560, easing: 'cubic-bezier(.3,1.4,.5,1)' }),
    scan: p => p.forEach(e => e.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], { duration: 600, easing: 'ease-in-out' })),
    bell: p => p[0].animate([{ transform: 'rotate(0)' }, { transform: 'rotate(14deg)' }, { transform: 'rotate(-12deg)' }, { transform: 'rotate(6deg)' }, { transform: 'rotate(0)' }], { duration: 520 }),
    focus: p => p[1] && p[1].animate([{ transform: 'scale(1)' }, { transform: 'scale(1.6)' }, { transform: 'scale(1)' }], { duration: 420 }),
    search: p => p[0].animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-14deg)' }, { transform: 'rotate(0)' }], { duration: 360 }),
    theme: p => p[0].animate([{ transform: 'rotate(0)' }, { transform: 'rotate(180deg)' }], { duration: 480, easing: 'cubic-bezier(.3,1.3,.5,1)' }),
    activity: p => p[0].animate([{ strokeDashoffset: 0, opacity: 1 }, { opacity: .3 }, { opacity: 1 }], { duration: 400 }),
    plus: p => p[0].animate([{ transform: 'rotate(0)' }, { transform: 'rotate(90deg)' }], { duration: 300 }),
    status: p => p.forEach((e, i) => e.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(.5)' }, { transform: 'scaleX(1)' }], { duration: 300, delay: i * 40 })),
  };
  if (!customElements.get('hq-icon')) customElements.define('hq-icon', class extends HTMLElement {
    static get observedAttributes() { return ['name', 'active']; }
    connectedCallback() { this.render(true); }
    attributeChangedCallback(n) { if (this.isConnected) { if (n === 'name') this.render(false); else if (this.getAttribute('active') === 'true') this.play(); } }
    render(intro) {
      const name = this.getAttribute('name') || 'home', size = this.getAttribute('size') || 18, paths = I[name] || I.home;
      this.style.cssText = `display:inline-flex;width:${size}px;height:${size}px;flex:0 0 auto;color:inherit`;
      SR(this).innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="currentColor" style="overflow:visible;display:block">${paths.map(d => `<path d="${d}" fill-rule="evenodd" style="transform-box:fill-box;transform-origin:center"/>`).join('')}</svg>`;
      this.paths = [...SR(this).querySelectorAll('path')];
      if (intro && !RM()) this.paths.forEach((p, i) => p.animate([{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 380, delay: 60 + i * 60 + (+(this.getAttribute('delay') || 0)), easing: 'cubic-bezier(.3,1.5,.5,1)', fill: 'backwards' }));
      const host = this.closest('button,a') || this;
      if (this._host !== host) { if (this._host) this._host.removeEventListener('mouseenter', this._h); this._host = host; this._h = () => this.play(); host.addEventListener('mouseenter', this._h); }
    }
    play() { if (RM() || !this.paths) return; (HOVER[this.getAttribute('name')] || HOVER.home)(this.paths); }
  });
})();
