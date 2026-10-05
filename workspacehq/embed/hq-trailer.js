const { CompositionStage, useComposition, Shot, Easing, clamp } = window;
const W = 1920, H = 1080;
const C = { bg: "#0d0d0f", card: "#141416", frame: "#2c2a27", frameHi: "#4d4841", text: "#e8e4dc", muted: "#a39d92", faint: "#6e695f", acc: "#d97757", accHi: "#f2a27e", accLo: "#a5543a", ok: "#9cc48a", bad: "#e0655a", warn: "#e2a856", gold: "#e8c46a", eye: "#1b1430" };
const F = "'IBM Plex Mono', ui-monospace, monospace";
const P = (T, s, d, e) => {
  const k = clamp((T - s) / d, 0, 1);
  return e ? e(k) : k;
};
const MOTION = {
  enter: (T, s, d = 0.6) => P(T, s, d, Easing.easeOutCubic),
  draw: (T, s, d = 1) => P(T, s, d, Easing.easeInOutCubic),
  pop: (T, s, d = 0.45) => P(T, s, d, Easing.easeOutBack)
};
const mix = (a, b, k) => a + (b - a) * k;
const rnd = (a, b = 0) => {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const GL = "\u2593\u2592\u2591\u2588<>/\\|#*+=_~:;01\u03A3\u0394\u273B\u2733";
const SPIN = ["\xB7", "\u2722", "\u2733", "\u2736", "\u273B", "\u273D", "\u273B", "\u2736", "\u2733", "\u2722"];
const typed = (s, T, t0, cps = 22) => s.slice(0, Math.max(0, Math.floor((T - t0) * cps)));
const decode = (s, T, t0, d) => [...s].map((ch, i) => {
  if (ch === " ") return " ";
  const r = t0 + d * (i / s.length) + rnd(i, 9) * 0.15;
  if (T >= r) return ch;
  if (T < r - 0.45) return " ";
  return GL[Math.floor(rnd(i, Math.floor(T * 24)) * GL.length)];
}).join("");
const abs = (o) => ({ position: "absolute", ...o });
function Cursor({ T, h = "1.05em" }) {
  return /* @__PURE__ */ React.createElement("span", { style: { display: "inline-block", width: ".58em", height: h, background: C.acc, verticalAlign: "-0.16em", marginLeft: ".06em", opacity: Math.floor(T * 2.4) % 2 === 0 ? 1 : 0 } });
}
const PB = ["...oooooo...", "..ohoooooo..", ".ohoooooooo.", ".ooeooooeoo.", ".ooeooooeoo.", "oooooooooooo", ".oooooooooo.", ".dddddddddd.", "..d.d..d.d.."];
const FRAMES = {
  idle: PB,
  happy: PB.map((r, i) => i === 3 ? ".ooeooooeoo." : i === 4 ? ".oeoeooeoeo." : r),
  nervous: PB.map((r, i) => i === 3 || i === 4 ? ".oeooooeooo." : r),
  blink: PB.map((r, i) => i === 3 ? ".oooooooooo." : r)
};
const CROWN = ["..y..yy..y..", "..yyyyyyyy..", "..yyhyyhyy.."];
const BC = { o: C.acc, h: C.accHi, d: C.accLo, e: C.eye, y: C.gold, s: "#9fd0e8" };
function Bit({ x, y, px = 10, mood = "idle", sq = 0, crown = null, sweat = 0 }) {
  const w = 12 * px, h = 9 * px, rects = [];
  const push = (rows, oy) => rows.forEach((r, yy) => [...r].forEach((ch, xx) => {
    if (BC[ch]) rects.push(/* @__PURE__ */ React.createElement("rect", { key: rects.length, x: xx, y: yy + oy, width: "1.02", height: "1.02", fill: BC[ch] }));
  }));
  push(FRAMES[mood] || PB, 0);
  if (crown != null) push(CROWN, crown);
  if (sweat) rects.push(/* @__PURE__ */ React.createElement("rect", { key: "sw", x: "11", y: 1 + sweat, width: "1", height: "1.6", fill: BC.s }));
  return /* @__PURE__ */ React.createElement("div", { style: abs({ left: x - w / 2, top: y - h, width: w, height: h, transform: `scale(${1 + sq},${1 - sq})`, transformOrigin: "50% 100%" }) }, /* @__PURE__ */ React.createElement("svg", { width: w, height: h, viewBox: "0 0 12 9", shapeRendering: "crispEdges", style: { overflow: "visible", display: "block" } }, rects));
}
function Backdrop({ T, op }) {
  const gx = 960 + Math.sin(T * 0.35) * 420, gy = 540 + Math.cos(T * 0.27) * 220;
  return /* @__PURE__ */ React.createElement("div", { style: abs({ inset: 0, opacity: op }) }, /* @__PURE__ */ React.createElement("div", { style: abs({ inset: -60, backgroundImage: "radial-gradient(circle, #2b2926 1.3px, transparent 1.6px)", backgroundSize: "30px 30px", backgroundPosition: `${T * 7 % 30}px ${T * 3 % 30}px` }) }), /* @__PURE__ */ React.createElement("div", { style: abs({ inset: 0, background: `radial-gradient(620px 420px at ${gx}px ${gy}px, rgba(217,119,87,.10), transparent 70%)` }) }), /* @__PURE__ */ React.createElement("div", { style: abs({ inset: 0, background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,.6) 100%)" }) }));
}
function Boot({ T, K }) {
  const lines = ["mounting ~/code", "47 repos found", "reading the room\u2026"];
  const s = mix(1, 1.05, P(T, K.Boot, 3));
  return /* @__PURE__ */ React.createElement(Shot, { from: K.Boot, to: K.Chaos }, /* @__PURE__ */ React.createElement("div", { style: abs({ inset: 0, transform: `scale(${s})`, transformOrigin: "30% 50%" }) }, /* @__PURE__ */ React.createElement("div", { style: abs({ left: 260, top: 380, fontFamily: F, color: C.text }) }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 64, fontWeight: 500, whiteSpace: "pre" } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.acc } }, "\u276F "), typed("hq --wake", T, K.Boot + 0.4, 12), /* @__PURE__ */ React.createElement(Cursor, { T })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 14, marginTop: 34 } }, lines.map((l, i) => {
    const k = MOTION.enter(T, K.Boot + 1.45 + i * 0.32, 0.35);
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { fontSize: 34, color: C.muted, opacity: k, transform: `translateY(${(1 - k) * 14}px)`, display: "flex", gap: 18 } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.acc } }, SPIN[(Math.floor(T * 10) + i * 3) % 10]), l);
  })))));
}
const CARDS = [
  { n: "47", l: "repos on this machine" },
  { n: "12", l: "with uncommitted work" },
  { n: "3", l: "secrets in plain sight", bad: true },
  { n: "02:14", l: "and still pushing" },
  { n: "?", l: "where was I" }
];
function Chaos({ T, K }) {
  const d = (K.Decode - K.Chaos) / CARDS.length;
  return CARDS.map((c, i) => {
    const s = K.Chaos + i * d, g = 1 - P(T, s, 0.14), right = i % 2 === 1;
    const jx = g * (rnd(i, Math.floor(T * 60)) - 0.5) * 90;
    const sc = mix(1, 1.07, MOTION.enter(T, s, d));
    const fg = c.bad ? C.bg : C.acc, sub = c.bad ? C.bg : C.muted;
    return /* @__PURE__ */ React.createElement(Shot, { key: i, from: s, to: s + d }, /* @__PURE__ */ React.createElement("div", { style: abs({ inset: 0, background: c.bad ? C.bad : C.bg }) }), /* @__PURE__ */ React.createElement("div", { style: abs({ inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: right ? "flex-end" : "flex-start", padding: "0 220px", fontFamily: F, transform: `translateX(${jx}px) scale(${sc})`, transformOrigin: right ? "80% 50%" : "20% 50%" }) }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 360, lineHeight: 0.95, fontWeight: 600, color: fg, letterSpacing: "-0.04em", textShadow: g > 0 ? `${g * 18}px 0 ${C.accLo}, ${-g * 18}px 0 ${C.text}` : "none" } }, c.n), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 56, color: sub, marginTop: 18, fontWeight: 500, whiteSpace: "nowrap" } }, c.l)));
  });
}
function Wordmark({ T, t0, d, size, top, hqColor = C.acc }) {
  const s = decode("WORKSPACE HQ", T, t0, d);
  return /* @__PURE__ */ React.createElement("div", { style: abs({ left: 0, right: 0, top, textAlign: "center", fontFamily: F, fontWeight: 600, fontSize: size, lineHeight: 1, letterSpacing: "-0.02em", whiteSpace: "pre", color: C.text }) }, s.slice(0, 10), /* @__PURE__ */ React.createElement("span", { style: { color: hqColor } }, s.slice(10)));
}
function Decode({ T, K }) {
  const out = P(T, K.Scan - 0.15, 0.45, Easing.easeInCubic), sc = mix(1, 1.05, P(T, K.Decode, 3.5));
  const n = Math.floor(78 * MOTION.draw(T, K.Decode + 0.1, 0.9));
  return /* @__PURE__ */ React.createElement(Shot, { from: K.Decode, to: K.Scan + 0.4 }, /* @__PURE__ */ React.createElement("div", { style: abs({ inset: 0, opacity: 1 - out, transform: `translateY(${-out * 80}px) scale(${sc})` }) }, /* @__PURE__ */ React.createElement("div", { style: abs({ left: 0, right: 0, top: 360, textAlign: "center", fontFamily: F, fontSize: 28, color: C.frameHi, whiteSpace: "pre" }) }, "\u256D" + "\u2500".repeat(n) + "\u256E"), /* @__PURE__ */ React.createElement(Wordmark, { T, t0: K.Decode + 0.25, d: 1.1, size: 176, top: 430 }), /* @__PURE__ */ React.createElement("div", { style: abs({ left: 0, right: 0, top: 640, textAlign: "center", fontFamily: F, fontSize: 28, color: C.frameHi, whiteSpace: "pre" }) }, "\u2570" + "\u2500".repeat(n) + "\u256F"), /* @__PURE__ */ React.createElement("div", { style: abs({ left: 0, right: 0, top: 730, textAlign: "center", fontFamily: F, fontSize: 44, color: C.muted, whiteSpace: "pre" }) }, typed("your workspace, alive.", T, K.Decode + 1.8, 24))));
}
const PX = 310, PY = 200, PW = 1300, PH = 700;
const ROWS = [
  { n: "almaflow", b: "main", s: "ok", t: "clean" },
  { n: "atlas-api", b: "dev", s: "bad", t: "secret in .env" },
  { n: "pixel-forge", b: "main", s: "warn", t: "3 uncommitted" },
  { n: "notes-cli", b: "main", s: "ok", t: "clean" },
  { n: "orbit-ui", b: "feat/map", s: "warn", t: "stale 9d" },
  { n: "ledger", b: "main", s: "ok", t: "clean" }
];
const GLYPH = { ok: "\u2713", bad: "\u2715", warn: "!" };
const COL = { ok: C.ok, bad: C.bad, warn: C.warn };
function Panel({ T, K }) {
  const inK = MOTION.enter(T, K.Scan, 0.7), outK = P(T, K.Level - 0.1, 0.5, Easing.easeInCubic);
  const fixT = K.Bit + 2, commitT = K.Ship + 1.1;
  const fill = MOTION.draw(T, K.Scan + 0.5, 3.2);
  const health = Math.round(mix(0, 82, fill) + 7 * MOTION.enter(T, fixT, 0.6) + 11 * MOTION.enter(T, commitT + 0.2, 0.6));
  const scanning = T < K.Scan + 3.7;
  return /* @__PURE__ */ React.createElement("div", { style: abs({ left: PX, top: PY, width: PW, height: PH, opacity: inK * (1 - outK), transform: `translateY(${(1 - inK) * 90 + outK * 60}px)`, background: "rgba(20,20,22,.92)", border: `1.5px solid ${C.frame}`, borderRadius: 18, fontFamily: F, color: C.text, boxShadow: "0 40px 120px rgba(0,0,0,.55)" }) }, /* @__PURE__ */ React.createElement("div", { style: abs({ left: 50, right: 50, top: 30, display: "flex", justifyContent: "space-between", fontSize: 26, color: C.faint, whiteSpace: "pre" }) }, /* @__PURE__ */ React.createElement("span", null, "\u256D\u2500 ", /* @__PURE__ */ React.createElement("span", { style: { color: C.acc } }, "hq scan"), " \u2500\u2500 ~/code \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500"), /* @__PURE__ */ React.createElement("span", { style: { color: scanning ? C.acc : C.ok } }, scanning ? SPIN[Math.floor(T * 10) % 10] + " scanning" : "\u2713 done")), ROWS.map((r, i) => {
    const e = MOTION.enter(T, K.Scan + 0.3 + i * 0.08, 0.5), done = T >= K.Scan + 0.8 + i * 0.4;
    let s = r.s, t = r.t;
    if (i === 1 && T >= fixT) {
      s = "ok";
      t = "rotated \u2192 vault";
    }
    if (i === 2 && T >= commitT) {
      s = "ok";
      t = "committed";
    }
    const alarm = i === 1 && T >= K.Bit + 0.8 && T < fixT ? 0.5 + 0.5 * Math.sin(T * 14) : 0;
    const flash = (i === 1 ? 1 - P(T, fixT, 0.5) : i === 2 ? 1 - P(T, commitT, 0.5) : 1) * (i === 1 && T >= fixT || i === 2 && T >= commitT ? 1 : 0);
    return /* @__PURE__ */ React.createElement("div", { key: i, style: abs({ left: 30, right: 30, top: 100 + i * 62, height: 54, padding: "0 20px", borderRadius: 10, display: "grid", gridTemplateColumns: "360px 230px 1fr 40px", alignItems: "center", fontSize: 30, opacity: e, transform: `translateX(${(1 - e) * -30}px)`, background: alarm ? `rgba(224,101,90,${0.1 + alarm * 0.14})` : flash ? `rgba(156,196,138,${flash * 0.18})` : "transparent" }) }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 500 } }, r.n), /* @__PURE__ */ React.createElement("span", { style: { color: C.faint } }, r.b), /* @__PURE__ */ React.createElement("span", { style: { color: done ? s === "ok" ? C.muted : COL[s] : C.faint } }, done ? t : "scanning\u2026"), /* @__PURE__ */ React.createElement("span", { style: { color: done ? COL[s] : C.acc, textAlign: "right", fontWeight: 600 } }, done ? GLYPH[s] : SPIN[(Math.floor(T * 10) + i * 2) % 10]));
  }), /* @__PURE__ */ React.createElement("div", { style: abs({ left: 50, right: 50, top: 500, display: "flex", alignItems: "center", gap: 28 }) }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "grid", gridTemplateColumns: "repeat(40, 1fr)", gap: 5, height: 22 } }, Array.from({ length: 40 }, (_, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { borderRadius: 2, background: i / 40 < fill ? C.acc : C.frame, opacity: i / 40 < fill ? 1 : 0.7 } }))), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 30, color: C.muted, whiteSpace: "pre" } }, "health ", /* @__PURE__ */ React.createElement("span", { style: { color: health >= 100 ? C.ok : C.acc, fontWeight: 600, fontSize: 40 } }, String(health).padStart(3, " ")))), /* @__PURE__ */ React.createElement("div", { style: abs({ left: 50, top: 580, fontSize: 32, whiteSpace: "pre", opacity: T >= K.Ship ? 1 : 0 }) }, /* @__PURE__ */ React.createElement("span", { style: { color: C.acc } }, "\u276F "), typed('git commit -m "clean"', T, K.Ship + 0.1, 26), T < commitT && T >= K.Ship ? /* @__PURE__ */ React.createElement(Cursor, { T }) : null), /* @__PURE__ */ React.createElement("div", { style: abs({ left: 90, top: 636, fontSize: 28, whiteSpace: "pre", color: C.faint, opacity: MOTION.enter(T, commitT, 0.3) }) }, /* @__PURE__ */ React.createElement("span", { style: { color: C.ok } }, "+214"), "  ", /* @__PURE__ */ React.createElement("span", { style: { color: C.bad } }, "\u221238"), "  \xB7 6 files \xB7 pixel-forge@main"));
}
function camAt(T, K) {
  const k = [[K.Scan, 0.9, 960, 580], [K.Scan + 4.4, 1, 960, 540], [K.Bit + 0.35, 1, 960, 540], [K.Bit + 1.1, 1.5, 1120, 330], [K.Bit + 3.4, 1.55, 1120, 340], [K.Ship + 0.5, 1.12, 960, 600], [K.Level - 0.1, 1.15, 960, 600], [K.Level + 0.6, 1, 960, 540]];
  if (T <= k[0][0]) return k[0];
  for (let i = 0; i < k.length - 1; i++) {
    const a = k[i], b = k[i + 1];
    if (T <= b[0]) {
      const e = MOTION.draw(T, a[0], b[0] - a[0]);
      return [T, mix(a[1], b[1], e), mix(a[2], b[2], e), mix(a[3], b[3], e)];
    }
  }
  return k[k.length - 1];
}
function Bubble({ x, y, text, k, color = C.text }) {
  return /* @__PURE__ */ React.createElement("div", { style: abs({ left: x, top: y, transform: `translate(-50%,-100%) scale(${k})`, transformOrigin: "50% 100%", opacity: Math.min(1, k * 2), padding: "10px 18px", borderRadius: 12, background: C.card, border: `1.5px solid ${C.frameHi}`, fontFamily: F, fontSize: 26, color, whiteSpace: "nowrap" }) }, text);
}
function BitActor({ T, K }) {
  if (T < K.Bit) return null;
  const fixT = K.Bit + 2, commitT = K.Ship + 1.1;
  const fall = clamp((T - K.Bit) / 0.45, 0, 1);
  let x = 1440, y = mix(-260, PY, fall * fall), px = 10, sq = 0, mood = "idle", crown = null, sweat = 0;
  const land = T - (K.Bit + 0.45);
  if (land >= 0 && land < 0.4) sq = 0.28 * Math.sin(land * 22) * (1 - land / 0.4);
  if (fall < 1) sq = -0.12 * fall;
  if (T >= K.Bit + 0.8 && T < fixT) {
    mood = "nervous";
    x += Math.sin(T * 70) * 2.2;
    sweat = T * 2 % 1 * 2.5;
  }
  if (T >= fixT) {
    mood = "happy";
    const h = P(T, fixT + 0.05, 0.5);
    y -= Math.sin(Math.PI * h) * 70;
    if (h > 0.9 && h < 1) sq = 0.12;
  }
  if (T >= K.Ship) {
    mood = "idle";
    if (Math.floor(T * 1.6) % 5 === 0) mood = "blink";
  }
  if (T >= commitT) {
    mood = "happy";
    const h = P(T, commitT + 0.05, 0.4);
    y -= Math.sin(Math.PI * h) * 40;
  }
  const g = MOTION.draw(T, K.Level - 0.1, 0.8);
  x = mix(x, 960, g);
  y = mix(y, 660, g);
  px = mix(px, 30, g);
  if (T >= K.Level) {
    mood = "happy";
    y += Math.sin(T * 4) * 5;
    const c = MOTION.pop(T, K.Level + 1.25, 0.5);
    crown = mix(-34, -3.4, c);
    const ct = T - (K.Level + 1.6);
    if (ct > 0 && ct < 0.35) sq = 0.14 * Math.sin(ct * 18) * (1 - ct / 0.35);
  }
  const o = MOTION.draw(T, K.Outro, 0.9);
  x = mix(x, 1418, o);
  y = mix(y, 438, o);
  px = mix(px, 7, o);
  if (T >= K.Outro + 1) mood = Math.floor(T * 1.4) % 4 === 0 ? "blink" : "happy";
  const showUh = T >= K.Bit + 0.85 && T < fixT, showOk = T >= fixT + 0.1 && T < K.Ship;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Bit, { x, y, px, mood, sq, crown, sweat }), showUh ? /* @__PURE__ */ React.createElement(Bubble, { x: x - 190, y: y - 40, text: "uh oh", color: C.bad, k: MOTION.pop(T, K.Bit + 0.85, 0.35) }) : null, showOk ? /* @__PURE__ */ React.createElement(Bubble, { x: x - 190, y: y - 40, text: "fixed \u273B", color: C.ok, k: MOTION.pop(T, fixT + 0.1, 0.35) }) : null, /* @__PURE__ */ React.createElement(Coins, { T, t0: fixT + 0.15, x: 1440, y: PY - 40 }));
}
function Coins({ T, t0, x, y }) {
  const t = T - t0;
  if (t < 0 || t > 1.3) return null;
  return Array.from({ length: 7 }, (_, i) => {
    const a = -Math.PI / 2 + (i - 3) * 0.32 + (rnd(i, 3) - 0.5) * 0.2, v = 520 + rnd(i, 4) * 260;
    const cx = x + Math.cos(a) * v * t, cy = y + Math.sin(a) * v * t + 900 * t * t;
    return /* @__PURE__ */ React.createElement("div", { key: i, style: abs({ left: cx - 13, top: cy - 13, width: 26, height: 26, borderRadius: "50%", background: C.gold, border: `3px solid ${C.accLo}`, transform: `scaleX(${Math.abs(Math.cos(T * 14 + i))})`, opacity: 1 - P(T, t0 + 0.9, 0.4) }) });
  });
}
function Explode({ T, K }) {
  const t0 = K.Ship + 1.55, boom = K.Ship + 2.55, word = "pixel-forge";
  if (T < t0 - 0.05 || T > K.Level + 0.2) return null;
  const scrim = MOTION.enter(T, t0, 0.3) * (1 - P(T, boom + 0.3, 0.6));
  const b = P(T, boom, 1.1, Easing.easeOutCubic), cw = 0.6 * 170;
  return /* @__PURE__ */ React.createElement("div", { style: abs({ inset: 0 }) }, /* @__PURE__ */ React.createElement("div", { style: abs({ inset: 0, background: `rgba(13,13,15,${scrim * 0.72})` }) }), [...word].map((ch, i) => {
    const p = MOTION.pop(T, t0 + i * 0.04, 0.4), a = rnd(i, 7) * Math.PI * 2, dist = b * (380 + rnd(i, 8) * 520);
    const x0 = 960 - word.length * cw / 2 + i * cw;
    return /* @__PURE__ */ React.createElement("div", { key: i, style: abs({ left: x0 + Math.cos(a) * dist, top: 420 + Math.sin(a) * dist - b * 80, fontFamily: F, fontWeight: 600, fontSize: 170, lineHeight: 1, color: C.acc, opacity: p * (1 - b), transform: `scale(${p}) rotate(${b * (rnd(i, 2) - 0.5) * 720}deg)` }) }, ch);
  }), /* @__PURE__ */ React.createElement("div", { style: abs({ left: 0, right: 0, top: 620, textAlign: "center", fontFamily: F, fontSize: 44, color: C.ok, opacity: MOTION.enter(T, t0 + 0.45, 0.3) * (1 - b) }) }, "\u2713 clean"), Array.from({ length: 18 }, (_, i) => {
    const a = i / 18 * Math.PI * 2 + rnd(i, 5), d = b * (260 + rnd(i, 6) * 520);
    return /* @__PURE__ */ React.createElement("div", { key: "s" + i, style: abs({ left: 960 + Math.cos(a) * d, top: 500 + Math.sin(a) * d, fontFamily: F, fontSize: 40 + rnd(i, 1) * 30, color: i % 3 ? C.accHi : C.gold, opacity: b > 0 ? 1 - b : 0 }) }, "\u273B");
  }));
}
function Level({ T, K }) {
  const e = MOTION.enter(T, K.Level + 0.45, 0.5), out = P(T, K.Outro, 0.45);
  const roll = MOTION.pop(T, K.Level + 0.9, 0.5);
  return /* @__PURE__ */ React.createElement(Shot, { from: K.Level, to: K.Outro + 0.5 }, /* @__PURE__ */ React.createElement("div", { style: abs({ left: 0, right: 0, top: 720, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 30, fontFamily: F, opacity: e * (1 - out), transform: `translateY(${(1 - e) * 30}px)` }) }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 72, color: C.muted, fontWeight: 500 } }, "LEVEL"), /* @__PURE__ */ React.createElement("span", { style: { position: "relative", display: "inline-block", width: "0.62em", height: "1.05em", overflow: "hidden", fontSize: 150, fontWeight: 600, color: C.acc, lineHeight: 1.05 } }, /* @__PURE__ */ React.createElement("span", { style: abs({ left: 0, top: `${-roll * 1.05}em` }) }, "4"), /* @__PURE__ */ React.createElement("span", { style: abs({ left: 0, top: `${(1 - roll) * 1.05}em` }) }, "5"))), /* @__PURE__ */ React.createElement("div", { style: abs({ left: 0, right: 0, top: 910, textAlign: "center", fontFamily: F, fontSize: 40, color: C.muted, opacity: MOTION.enter(T, K.Level + 1.65, 0.4) * (1 - out) }) }, "Bit earned a crown."));
}
function Outro({ T, K, total }) {
  return /* @__PURE__ */ React.createElement(Shot, { from: K.Outro, to: total + 1 }, /* @__PURE__ */ React.createElement(Wordmark, { T, t0: K.Outro + 0.25, d: 0.8, size: 150, top: 430 }), /* @__PURE__ */ React.createElement("div", { style: abs({ left: 0, right: 0, top: 630, textAlign: "center", fontFamily: F, fontSize: 44, color: C.muted, whiteSpace: "pre" }) }, typed("your workspace, alive.", T, K.Outro + 1.05, 30)), /* @__PURE__ */ React.createElement("div", { style: abs({ left: 0, right: 0, top: 760, display: "flex", justifyContent: "center", fontFamily: F, fontSize: 34, color: C.text, opacity: MOTION.enter(T, K.Outro + 1.9, 0.4), whiteSpace: "pre" }) }, /* @__PURE__ */ React.createElement("span", { style: { padding: "14px 26px", border: `1.5px solid ${C.frameHi}`, borderRadius: 12 } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.acc } }, "\u276F "), "v3 out now", /* @__PURE__ */ React.createElement(Cursor, { T }))));
}
function cues1(K) {
  const c = [], add = (t, s, g = 1, o = {}) => c.push({ t, s, g, ...o });
  add(K.Boot + 0.05, "riser", 0.3);
  add(K.Boot + 0.4, "type", 0.7, { dur: 0.8 });
  [0, 1, 2].forEach((i) => add(K.Boot + 1.45 + i * 0.32, "tick", 0.6));
  const d = (K.Decode - K.Chaos) / 5;
  for (let i = 0; i < 5; i++) {
    add(K.Chaos + i * d, "hit", 0.85);
    add(K.Chaos + i * d, "glitch", 0.3, { dur: 0.35 });
  }
  add(K.Chaos + 2 * d + 0.05, "alert", 0.55);
  add(K.Decode, "whoosh", 0.7);
  add(K.Decode + 0.25, "glitch", 0.8);
  add(K.Decode + 1.8, "type", 0.5, { dur: 0.9 });
  add(K.Scan, "whoosh", 0.5);
  add(K.Scan + 0.5, "scan", 0.4);
  for (let i = 0; i < 6; i++) add(K.Scan + 0.8 + i * 0.4, i === 1 ? "alert" : "tick", i === 1 ? 0.4 : 0.55);
  add(K.Scan + 3.7, "chime", 0.6);
  add(K.Bit + 0.45, "boop", 0.9);
  add(K.Bit + 0.85, "alert", 0.7);
  add(K.Bit + 2, "chime", 0.8);
  add(K.Bit + 2.15, "coins", 0.7);
  add(K.Ship + 0.1, "type", 0.7, { dur: 0.85 });
  add(K.Ship + 1.1, "pop", 0.9);
  add(K.Ship + 1.4, "riser", 0.5, { off: 1.85, dur: 1.15 });
  add(K.Ship + 2.55, "burst", 1);
  add(K.Ship + 2.55, "hit", 0.75);
  add(K.Level - 0.1, "whoosh", 0.6);
  add(K.Level + 0.9, "pop", 0.8);
  add(K.Level + 1.25, "levelup", 0.9);
  add(K.Outro, "whoosh", 0.55);
  add(K.Outro + 0.25, "glitch", 0.7);
  add(K.Outro + 1.05, "type", 0.5, { dur: 0.7 });
  add(K.Outro + 1.9, "pop", 0.7);
  add(K.Outro + 1.9, "hit", 0.45);
  return c;
}
window.__HQ1 = { K: null, total: 30 };
function Piece({ scanlines, sound }) {
  const { T, CUES: K, authoredTotal, playing } = useComposition();
  const total = authoredTotal || 30;
  window.__HQ1 = { K, total };
  HQAudio.useHQAudio({ T, playing, cues: cues1(K), music: "music1", musicGain: 0.55, enabled: sound, total });
  const [, s, cx, cy] = camAt(T, K);
  const bgOp = MOTION.enter(T, K.Decode, 0.8) * (1 - P(T, total - 0.6, 0.6));
  const black = P(T, total - 0.45, 0.45);
  return /* @__PURE__ */ React.createElement("div", { "data-screen-label": `t=${Math.floor(T)}s`, style: abs({ inset: 0, overflow: "hidden", background: C.bg }) }, /* @__PURE__ */ React.createElement(Backdrop, { T, op: bgOp }), /* @__PURE__ */ React.createElement(Boot, { T, K }), /* @__PURE__ */ React.createElement(Chaos, { T, K }), /* @__PURE__ */ React.createElement(Decode, { T, K }), /* @__PURE__ */ React.createElement("div", { style: abs({ left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${W / 2}px,${H / 2}px) scale(${s}) translate(${-cx}px,${-cy}px)` }) }, /* @__PURE__ */ React.createElement(Panel, { T, K }), /* @__PURE__ */ React.createElement(BitActor, { T, K })), /* @__PURE__ */ React.createElement(Explode, { T, K }), /* @__PURE__ */ React.createElement(Level, { T, K }), /* @__PURE__ */ React.createElement(Outro, { T, K, total }), scanlines ? /* @__PURE__ */ React.createElement("div", { style: abs({ inset: 0, pointerEvents: "none", background: "repeating-linear-gradient(0deg, rgba(0,0,0,.16) 0 1px, transparent 1px 4px)" }) }) : null, /* @__PURE__ */ React.createElement("div", { style: abs({ inset: 0, background: "#000", opacity: black, pointerEvents: "none" }) }));
}
function HQTrailer() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  const wrap = React.useRef(null);
  React.useEffect(() => {
    const fire = () => window.dispatchEvent(new Event("resize"));
    const ro = new ResizeObserver(fire);
    if (wrap.current) ro.observe(wrap.current);
    const ts = [0, 300, 1e3, 2500].map((d) => setTimeout(fire, d));
    return () => {
      ro.disconnect();
      ts.forEach(clearTimeout);
    };
  }, []);
  return /* @__PURE__ */ React.createElement("div", { ref: wrap, style: { position: "fixed", inset: 0, width: "100vw", height: "100vh" } }, /* @__PURE__ */ React.createElement(CompositionStage, { width: W, height: H, scenes: window.OM_SCENES, playback: window.OM_PLAYBACK, bg: C.bg }, /* @__PURE__ */ React.createElement(Piece, { scanlines: t.scanlines, sound: t.sound })), /* @__PURE__ */ React.createElement(TweaksPanel, null, /* @__PURE__ */ React.createElement(TweakSection, { label: "Trailer" }), /* @__PURE__ */ React.createElement(TweakToggle, { label: "Motion editor", value: t.motionEditor, onChange: (v) => setTweak("motionEditor", v) }), /* @__PURE__ */ React.createElement(TweakToggle, { label: "Scanlines", value: t.scanlines, onChange: (v) => setTweak("scanlines", v) }), /* @__PURE__ */ React.createElement(TweakSection, { label: "Audio" }), /* @__PURE__ */ React.createElement(TweakToggle, { label: "Sound", value: t.sound, onChange: (v) => setTweak("sound", v) }), /* @__PURE__ */ React.createElement(TweakButton, { label: "Download soundtrack (.wav)", onClick: () => {
    const h = window.__HQ1;
    if (h.K) HQAudio.renderWav(cues1(h.K), "music1", h.total, 0.55, "WorkspaceHQ-trailer-1");
  } })), /* @__PURE__ */ React.createElement(HQAudio.SoundChip, { enabled: t.sound }));
}
window.HQTrailer = HQTrailer;
window.HQKit = { C, F, P, MOTION, mix, rnd, GL, SPIN, typed, decode, abs, Cursor, Bit, Backdrop, Wordmark, Bubble, Coins };
