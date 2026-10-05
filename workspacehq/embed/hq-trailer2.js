const { CompositionStage, useComposition, Easing, clamp } = window;
const { C, F, P, MOTION, mix, rnd, SPIN, typed, decode, abs, Cursor, Bit, Backdrop, Wordmark, Coins } = window.HQKit;
const W2 = 1920, H2 = 1080;
const LX = 150, LW = 560, PX2 = 790, PY2 = 170, PW2 = 980, PH2 = 720;
const CH = [
  { k: "Scan", n: "01", h: "hq scan", t: "See every repo at once.", d: "One scan reads git state, builds and risk across your whole machine." },
  { k: "Since", n: "02", h: "hq since", t: "Pick up where you left off.", d: "A digest of everything that moved while you were away." },
  { k: "Next", n: "03", h: "hq next", t: "Always know the next move.", d: "HQ ranks what needs you and puts one clear action on top." },
  { k: "Secrets", n: "04", h: "hq guard", t: "Catch secrets before they ship.", d: "Keys in plain sight get flagged, and Bit stays nervous until they\u2019re gone." },
  { k: "Diffs", n: "05", h: "hq diff", t: "Read every commit.", d: "Inline diffs for each project, without leaving the console." },
  { k: "Ask", n: "06", h: "hq ask", t: "Just ask.", d: "Type a question in the prompt bar. Claude answers from your actual repos." },
  { k: "Map", n: "07", h: "hq map", t: "Watch it live.", d: "A living map of your workspace. Lit windows for activity, smoke for risk." },
  { k: "Bit", n: "08", h: "hq bit", t: "Good work gets noticed.", d: "Bit levels up as you keep things clean, and lets you know it." }
];
const ends = (K, i) => i < CH.length - 1 ? K[CH[i + 1].k] : K.Outro;
const win = (T, a, b) => MOTION.enter(T, a + 0.15, 0.55) * (1 - P(T, b - 0.45, 0.4, Easing.easeInCubic));
const COL2 = { ok: C.ok, bad: C.bad, warn: C.warn };
const GLY = { ok: "\u2713", bad: "\u2715", warn: "!" };
function Intro({ T, K }) {
  const out = P(T, K.Scan - 0.5, 0.45, Easing.easeInCubic);
  if (T > K.Scan + 0.1) return null;
  return /* @__PURE__ */ React.createElement("div", { style: abs({ inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40, fontFamily: F, opacity: 1 - out, transform: `translateY(${-out * 40}px)` }) }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 44, color: C.muted, whiteSpace: "pre" } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.acc } }, "\u276F "), typed("hq", T, 0.3, 6), /* @__PURE__ */ React.createElement(Cursor, { T })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 96, fontWeight: 600, color: C.text, letterSpacing: "-0.02em", whiteSpace: "pre" } }, decode("Every repo. One console.", T, 1.2, 1.1)));
}
function Captions({ T, K }) {
  return CH.map((c, i) => {
    const a = K[c.k], b = ends(K, i);
    if (T < a - 0.1 || T > b + 0.1) return null;
    const op = MOTION.enter(T, a + 0.1, 0.6) * (1 - P(T, b - 0.45, 0.4, Easing.easeInCubic));
    const shown = typed(c.t, T, a + 0.35, 34), dk = MOTION.enter(T, a + 1, 0.7);
    return /* @__PURE__ */ React.createElement("div", { key: c.k, style: abs({ left: LX, top: 300, width: LW, fontFamily: F, opacity: op, transform: `translateY(${(1 - op) * 24}px)` }) }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 130, fontWeight: 600, color: C.acc, lineHeight: 1, letterSpacing: "-0.03em", whiteSpace: "pre" } }, decode(c.n, T, a + 0.1, 0.4)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 58, fontWeight: 600, color: C.text, lineHeight: 1.14, marginTop: 34, letterSpacing: "-0.01em" } }, /* @__PURE__ */ React.createElement("span", null, shown), /* @__PURE__ */ React.createElement("span", { style: { opacity: 0 } }, c.t.slice(shown.length))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 30, color: C.muted, lineHeight: 1.5, marginTop: 30, opacity: dk, transform: `translateY(${(1 - dk) * 14}px)`, textWrap: "pretty" } }, c.d));
  });
}
function Rail({ T, K, op }) {
  return /* @__PURE__ */ React.createElement("div", { style: abs({ left: LX, right: 150, top: 968, display: "grid", gridTemplateColumns: `repeat(${CH.length}, minmax(0,1fr))`, gap: 14, fontFamily: F, opacity: op }) }, CH.map((c, i) => {
    const a = K[c.k], b = ends(K, i), p = clamp((T - a) / (b - a), 0, 1), on = T >= a && T < b;
    return /* @__PURE__ */ React.createElement("div", { key: c.k, style: { display: "grid", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, color: on ? C.text : p >= 1 ? C.muted : C.faint, whiteSpace: "nowrap" } }, c.n, " ", /* @__PURE__ */ React.createElement("span", { style: { color: on ? C.acc : "inherit" } }, c.h.slice(3))), /* @__PURE__ */ React.createElement("div", { style: { height: 4, borderRadius: 2, background: C.frame, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", width: `${p * 100}%`, background: on ? C.acc : C.frameHi } })));
  }));
}
const REPOS = [["almaflow", "ok", "clean"], ["atlas-api", "bad", "secret found"], ["pixel-forge", "warn", "3 uncommitted"], ["notes-cli", "ok", "clean"], ["orbit-ui", "warn", "stale 9d"], ["ledger", "ok", "clean"], ["dotfiles", "ok", "clean"], ["hq-ext", "ok", "clean"], ["blog", "warn", "1 unpushed"], ["pomodoro", "ok", "clean"], ["infra", "ok", "clean"], ["sketchbook", "ok", "clean"]];
function ScanView({ T, a }) {
  const done = a + 0.8 + REPOS.length * 0.22;
  const health = Math.round(86 * MOTION.draw(T, a + 0.8, done - a - 0.6));
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: abs({ left: 40, right: 40, top: 90, display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16 }) }, REPOS.map(([n, s, t], i) => {
    const r = a + 0.8 + i * 0.22, ok = T >= r, e = MOTION.enter(T, a + 0.2 + i * 0.04, 0.5);
    const flash = ok ? 1 - P(T, r, 0.5) : 0;
    return /* @__PURE__ */ React.createElement("div", { key: n, style: { height: 104, padding: "16px 18px", borderRadius: 12, border: `1.5px solid ${ok && s !== "ok" ? COL2[s] : C.frame}`, background: `rgba(232,228,220,${0.02 + flash * 0.06})`, display: "grid", alignContent: "space-between", opacity: e, transform: `translateY(${(1 - e) * 16}px)` } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 10, fontSize: 22, fontWeight: 500, whiteSpace: "nowrap" } }, /* @__PURE__ */ React.createElement("span", { style: { flex: "1 1 0", minWidth: 0 } }, n), /* @__PURE__ */ React.createElement("span", { style: { flexShrink: 0, color: ok ? COL2[s] : C.acc } }, ok ? GLY[s] : SPIN[(Math.floor(T * 10) + i) % 10])), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, whiteSpace: "nowrap", color: ok ? s === "ok" ? C.faint : COL2[s] : C.faint } }, ok ? t : "scanning\u2026"));
  })), /* @__PURE__ */ React.createElement("div", { style: abs({ left: 40, right: 40, top: 590, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 20, fontSize: 26, color: C.muted, whiteSpace: "nowrap" }) }, /* @__PURE__ */ React.createElement("span", null, T >= done ? "12 repos \xB7 3 need you \xB7 2.1s" : "reading ~/code \u2026"), /* @__PURE__ */ React.createElement("span", null, "health ", /* @__PURE__ */ React.createElement("span", { style: { fontSize: 64, fontWeight: 600, color: C.acc, marginLeft: 14 } }, health))));
}
const SINCE = [["ok", "atlas-api", "3 commits pushed", "2h"], ["bad", "pixel-forge", "build failed on main", "5h"], ["warn", "orbit-ui", "stale for 9 days", "\u2014"], ["ok", "ledger", "tests back to green", "9h"], ["ok", "notes-cli", "tagged v1.0.0", "11h"]];
function SinceView({ T, a }) {
  return /* @__PURE__ */ React.createElement("div", { style: abs({ left: 50, right: 50, top: 100, display: "grid", gap: 10 }) }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, color: C.muted, marginBottom: 18, whiteSpace: "pre" } }, "welcome back \xB7 ", /* @__PURE__ */ React.createElement("span", { style: { color: C.text } }, "you were gone 14h 22m")), SINCE.map(([s, n, t, ago], i) => {
    const e = MOTION.enter(T, a + 0.9 + i * 0.55, 0.5);
    return /* @__PURE__ */ React.createElement("div", { key: n, style: { display: "grid", gridTemplateColumns: "50px 260px minmax(0,1fr) 70px", alignItems: "center", height: 76, padding: "0 22px", borderRadius: 12, background: "rgba(232,228,220,.03)", border: `1.5px solid ${C.frame}`, fontSize: 28, opacity: e, transform: `translateX(${(1 - e) * 40}px)` } }, /* @__PURE__ */ React.createElement("span", { style: { color: COL2[s], fontWeight: 600 } }, s === "ok" ? "\u2191" : GLY[s]), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 500 } }, n), /* @__PURE__ */ React.createElement("span", { style: { color: s === "ok" ? C.muted : COL2[s] } }, t), /* @__PURE__ */ React.createElement("span", { style: { color: C.faint, textAlign: "right" } }, ago));
  }));
}
function NextView({ T, a }) {
  const press = a + 3.2, done = T >= press + 0.3;
  const pk = T >= press && T < press + 0.3 ? Math.sin(P(T, press, 0.3) * Math.PI) : 0;
  const ce = MOTION.enter(T, a + 0.4, 0.6), sw = MOTION.enter(T, press + 0.3, 0.45);
  const queue = ["Rotate the key in atlas-api", "Review stale branch in orbit-ui"];
  return /* @__PURE__ */ React.createElement("div", { style: abs({ left: 50, right: 50, top: 100 }) }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: 300, padding: "34px 40px", borderRadius: 16, border: `2px solid ${done ? C.ok : C.acc}`, background: done ? "rgba(156,196,138,.06)" : "rgba(217,119,87,.06)", opacity: ce, transform: `translateY(${(1 - ce) * 30}px)` } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, color: done ? C.ok : C.acc, fontWeight: 600, letterSpacing: ".12em" } }, done ? "\u2713 DONE" : "NEXT"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 46, fontWeight: 600, marginTop: 22, lineHeight: 1.2 } }, done ? "Committed pixel-forge" : "Commit 3 files in pixel-forge"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 26, color: C.muted, marginTop: 16 } }, done ? "+214 \u221238 \xB7 health 86 \u2192 91" : "uncommitted for 2 days \xB7 about 2 min"), /* @__PURE__ */ React.createElement("div", { style: abs({ right: 40, bottom: 34, padding: "14px 26px", borderRadius: 10, fontSize: 28, fontWeight: 600, background: done ? "transparent" : pk ? C.accHi : C.acc, color: done ? C.ok : C.bg, border: done ? `1.5px solid ${C.ok}` : "none", transform: `scale(${1 - pk * 0.07})` }) }, done ? "\u2713" : "\u23CE do it")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, color: C.faint, margin: "34px 0 14px", opacity: MOTION.enter(T, a + 1.2, 0.5) } }, "then"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 10 } }, queue.map((q, i) => {
    const e = MOTION.enter(T, a + 1.4 + i * 0.3, 0.5), hi = i === 0 && done;
    return /* @__PURE__ */ React.createElement("div", { key: q, style: { fontSize: 28, padding: "18px 24px", borderRadius: 12, border: `1.5px solid ${hi ? C.acc : C.frame}`, color: hi ? C.text : C.muted, opacity: e, transform: `translateY(${(1 - e) * 14 - (hi ? sw * 6 : 0)}px)` } }, hi ? /* @__PURE__ */ React.createElement("span", { style: { color: C.acc } }, "\u25B8 ") : "  ", q);
  })));
}
function SecretsView({ T, a }) {
  const alarmT = a + 1.3, fixT = a + 4, alarm = T >= alarmT && T < fixT, fixed = T >= fixT;
  const pulse = alarm ? 0.5 + 0.5 * Math.sin((T - alarmT) * 6) : 0, flash = fixed ? 1 - P(T, fixT, 0.7) : 0;
  const lines = ["NODE_ENV=production", "PORT=8080", fixed ? "STRIPE_KEY=vault://stripe/live" : "STRIPE_KEY=sk_live_51Hx\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", "DATABASE_URL=postgres://db.internal/atlas", "LOG_LEVEL=info"];
  let mood = "idle", sweat = 0, bx = 840, by = 0, sq = 0;
  if (alarm) {
    mood = "nervous";
    sweat = T * 2 % 1 * 2.5;
    bx += Math.sin(T * 60) * 2;
  }
  if (fixed) {
    mood = "happy";
    const h = P(T, fixT + 0.05, 0.5);
    by -= Math.sin(Math.PI * h) * 60;
  }
  const e = MOTION.enter(T, a + 0.3, 0.6);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: abs({ left: 50, right: 50, top: 100, fontSize: 26, color: C.muted, opacity: e }) }, "atlas-api / ", /* @__PURE__ */ React.createElement("span", { style: { color: C.text } }, ".env")), /* @__PURE__ */ React.createElement("div", { style: abs({ left: 50, right: 50, top: 160, display: "grid", gap: 6, opacity: e, transform: `translateY(${(1 - e) * 20}px)` }) }, lines.map((l, i) => {
    const k = i === 2;
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "grid", gridTemplateColumns: "60px minmax(0,1fr)", alignItems: "center", height: 62, padding: "0 18px", borderRadius: 10, fontSize: 28, background: k && alarm ? `rgba(224,101,90,${0.1 + pulse * 0.14})` : k && fixed ? `rgba(156,196,138,${0.05 + flash * 0.16})` : "transparent", whiteSpace: "pre" } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.faint } }, i + 1), /* @__PURE__ */ React.createElement("span", { style: { color: k ? fixed ? C.ok : alarm ? C.bad : C.text : C.muted } }, l));
  })), /* @__PURE__ */ React.createElement("div", { style: abs({ left: 50, top: 520, fontSize: 30, fontWeight: 600, whiteSpace: "nowrap", color: fixed ? C.ok : C.bad, opacity: T >= alarmT ? MOTION.enter(T, fixed ? fixT : alarmT, 0.4) : 0 }) }, fixed ? "\u2713 moved to vault \xB7 history scrubbed" : "\u2715 live key in plain sight"), T >= a + 0.2 ? /* @__PURE__ */ React.createElement(Bit, { x: bx, y: by + mix(-60, 0, MOTION.pop(T, a + 0.5, 0.5)), px: 9, mood, sweat, sq }) : null);
}
const DIFF = [[" ", "async function fetchTiles(url) {"], ["-", "  const res = await fetch(url);"], ["+", "  const res = await retry(() => fetch(url), {"], ["+", "    tries: 3, backoff: 400,"], ["+", "    on: [429, 503],"], ["+", "  });"], [" ", "  if (!res.ok) throw new HttpError(res);"], [" ", "  return res.json();"], [" ", "}"]];
function DiffView({ T, a }) {
  const e = MOTION.enter(T, a + 0.3, 0.6), end = a + 0.8 + DIFF.length * 0.28;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: abs({ left: 50, right: 50, top: 96, display: "flex", justifyContent: "space-between", gap: 24, fontSize: 26, opacity: e, whiteSpace: "pre" }) }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.gold } }, "a41f9c2"), "  fix: retry on 429"), /* @__PURE__ */ React.createElement("span", { style: { color: C.faint } }, "pixel-forge \xB7 2m ago")), /* @__PURE__ */ React.createElement("div", { style: abs({ left: 50, right: 50, top: 150, display: "grid", gap: 2 }) }, DIFF.map(([s, l], i) => {
    const k = MOTION.enter(T, a + 0.8 + i * 0.28, 0.35);
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "grid", gridTemplateColumns: "40px minmax(0,1fr)", height: 44, alignItems: "center", padding: "0 14px", borderRadius: 6, fontSize: 26, whiteSpace: "pre", opacity: k, transform: `translateX(${(1 - k) * -20}px)`, background: s === "+" ? "rgba(156,196,138,.12)" : s === "-" ? "rgba(224,101,90,.12)" : "transparent" } }, /* @__PURE__ */ React.createElement("span", { style: { color: s === "+" ? C.ok : s === "-" ? C.bad : C.faint } }, s), /* @__PURE__ */ React.createElement("span", { style: { color: s === " " ? C.muted : C.text } }, l));
  })), /* @__PURE__ */ React.createElement("div", { style: abs({ left: 50, top: 600, fontSize: 28, whiteSpace: "pre", opacity: MOTION.enter(T, end, 0.4) }) }, /* @__PURE__ */ React.createElement("span", { style: { color: C.ok } }, "+4"), "  ", /* @__PURE__ */ React.createElement("span", { style: { color: C.bad } }, "\u22121"), "  ", /* @__PURE__ */ React.createElement("span", { style: { color: C.faint } }, "\xB7 1 file \xB7 build green again")));
}
const ANSWER = [["\u273B", "Two things broke since yesterday:"], ["", ""], ["1", "pixel-forge  build failing since a41f9c2"], ["", "   \u2192 TILE_API_KEY missing from CI env"], ["2", "orbit-ui     e2e tests timing out on CI"], ["", ""], ["", "Want me to open pixel-forge first?"]];
function AskView({ T, a }) {
  const q = "what broke today?", qT = a + 0.6, think = a + 1.6, ans = a + 2.6;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: abs({ left: 50, right: 50, top: 100, display: "grid", gap: 4 }) }, T >= think && T < ans ? /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, color: C.acc } }, SPIN[Math.floor(T * 10) % 10], " Thinking\u2026") : null, ANSWER.map(([g, l], i) => {
    const k = MOTION.enter(T, ans + i * 0.42, 0.4);
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "grid", gridTemplateColumns: "44px minmax(0,1fr)", minHeight: 50, alignItems: "center", fontSize: 28, whiteSpace: "pre", opacity: T >= ans ? k : 0, transform: `translateY(${(1 - k) * 10}px)` } }, /* @__PURE__ */ React.createElement("span", { style: { color: g === "\u273B" ? C.acc : C.gold, fontWeight: 600 } }, g), /* @__PURE__ */ React.createElement("span", { style: { color: i === 0 || i === 6 ? C.text : l.trim().startsWith("\u2192") ? C.warn : C.muted } }, l));
  })), /* @__PURE__ */ React.createElement("div", { style: abs({ left: 40, right: 40, bottom: 40, height: 84, borderRadius: 14, border: `1.5px solid ${T >= qT && T < think ? C.acc : C.frameHi}`, background: C.card, display: "flex", alignItems: "center", padding: "0 28px", fontSize: 30, whiteSpace: "pre", opacity: MOTION.enter(T, a + 0.2, 0.5) }) }, /* @__PURE__ */ React.createElement("span", { style: { color: C.acc } }, "\u276F "), T >= qT ? typed(q, T, qT, 24) : /* @__PURE__ */ React.createElement("span", { style: { color: C.faint } }, "ask anything about your repos\u2026"), T < think ? /* @__PURE__ */ React.createElement(Cursor, { T }) : null));
}
const CITY = [["almaflow", 260], ["atlas-api", 340], ["pixel-forge", 300], ["notes-cli", 180], ["orbit-ui", 380, true], ["ledger", 220], ["hq-ext", 280], ["blog", 160]];
function MapView({ T, a }) {
  const ground = 600, bw = 88, gap = 26, x0 = (PW2 - (CITY.length * bw + (CITY.length - 1) * gap)) / 2;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, Array.from({ length: 22 }, (_, i) => /* @__PURE__ */ React.createElement("div", { key: "st" + i, style: abs({ left: 40 + rnd(i, 1) * (PW2 - 80), top: 90 + rnd(i, 2) * 170, width: 3, height: 3, background: C.faint, opacity: (0.3 + 0.7 * Math.abs(Math.sin(T * 1.3 + i))) * MOTION.enter(T, a + 0.3, 0.6) }) })), /* @__PURE__ */ React.createElement("div", { style: abs({ right: 46, top: 92, fontSize: 22, color: C.faint, whiteSpace: "pre", opacity: MOTION.enter(T, a + 1.4, 0.5) }) }, /* @__PURE__ */ React.createElement("span", { style: { color: C.gold } }, "\u25A0"), " activity   ", /* @__PURE__ */ React.createElement("span", { style: { color: C.muted } }, "\u2248"), " risk"), /* @__PURE__ */ React.createElement("div", { style: abs({ left: 40, right: 40, top: ground, height: 2, background: C.frameHi, opacity: MOTION.enter(T, a + 0.2, 0.4) }) }), CITY.map(([n, h, risk], i) => {
    const g = MOTION.draw(T, a + 0.3 + i * 0.1, 0.9), hh = h * g, x = x0 + i * (bw + gap), rows = Math.floor(h / 34);
    return /* @__PURE__ */ React.createElement(React.Fragment, { key: n }, /* @__PURE__ */ React.createElement("div", { style: abs({ left: x, top: ground - hh, width: bw, height: hh, overflow: "hidden", borderRadius: "6px 6px 0 0", border: `1.5px solid ${risk ? C.warn : C.frameHi}`, borderBottom: "none", background: C.card }) }, /* @__PURE__ */ React.createElement("div", { style: abs({ left: 14, right: 14, top: 16, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }) }, Array.from({ length: rows * 3 }, (_, j) => {
      const lit = rnd(i * 31 + j, Math.floor(T * 1.2 + rnd(j, i) * 5)) > (risk ? 0.75 : 0.52);
      return /* @__PURE__ */ React.createElement("div", { key: j, style: { height: 16, borderRadius: 2, background: lit ? C.gold : C.frame, opacity: lit ? 0.95 : 0.6, boxShadow: lit ? "0 0 10px rgba(232,196,106,.5)" : "none" } });
    }))), /* @__PURE__ */ React.createElement("div", { style: abs({ left: x - 20, width: bw + 40, top: ground + 16, textAlign: "center", fontSize: 15, whiteSpace: "nowrap", color: risk ? C.warn : C.faint, opacity: g }) }, n), risk && g > 0.9 ? Array.from({ length: 6 }, (_, k) => {
      const ph = ((T - a) * 0.55 + k / 6) % 1;
      return /* @__PURE__ */ React.createElement("div", { key: "sm" + k, style: abs({ left: x + bw / 2 - 18 + Math.sin(ph * 6 + k) * 20 + ph * 30, top: ground - hh - 30 - ph * 160, width: 36 + ph * 40, height: 36 + ph * 40, borderRadius: "50%", background: C.muted, opacity: (1 - ph) * 0.22 }) });
    }) : null);
  }));
}
function BitView({ T, a }) {
  const fill = MOTION.draw(T, a + 0.6, 1.6), lv = a + 2.4, roll = MOTION.pop(T, lv, 0.5);
  const c = MOTION.pop(T, lv + 0.25, 0.5), hop = T >= lv ? Math.sin(Math.PI * P(T, lv, 0.45)) * 40 : 0;
  const xp = Math.round(mix(1240, 1500, fill));
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Bit, { x: PW2 / 2, y: 380 - hop + Math.sin(T * 3) * 4, px: 22, mood: T >= lv ? "happy" : Math.floor(T * 1.4) % 4 === 0 ? "blink" : "idle", crown: T >= lv + 0.2 ? mix(-30, -3.4, c) : null }), /* @__PURE__ */ React.createElement("div", { style: abs({ left: 190, right: 190, top: 440, display: "flex", alignItems: "baseline", justifyContent: "center", gap: 22, fontFamily: F }) }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 40, color: C.muted, fontWeight: 500 } }, "LV"), /* @__PURE__ */ React.createElement("span", { style: { position: "relative", display: "inline-block", width: "0.62em", height: "1.05em", overflow: "hidden", fontSize: 84, fontWeight: 600, color: C.acc, lineHeight: 1.05 } }, /* @__PURE__ */ React.createElement("span", { style: abs({ left: 0, top: `${-roll * 1.05}em` }) }, "4"), /* @__PURE__ */ React.createElement("span", { style: abs({ left: 0, top: `${(1 - roll) * 1.05}em` }) }, "5"))), /* @__PURE__ */ React.createElement("div", { style: abs({ left: 190, right: 190, top: 580, display: "grid", gap: 12 }) }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(30, 1fr)", gap: 4, height: 18 } }, Array.from({ length: 30 }, (_, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { borderRadius: 2, background: i / 30 < fill ? C.acc : C.frame } }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 20, fontSize: 22, color: C.faint, whiteSpace: "nowrap" } }, /* @__PURE__ */ React.createElement("span", null, "xp ", xp.toLocaleString(), " / 1,500"), /* @__PURE__ */ React.createElement("span", { style: { color: T >= lv ? C.gold : C.faint } }, T >= lv ? "+ crown unlocked" : "next: crown"))));
}
const VIEWS = { Scan: ScanView, Since: SinceView, Next: NextView, Secrets: SecretsView, Diffs: DiffView, Ask: AskView, Map: MapView, Bit: BitView };
function Console({ T, K }) {
  const inK = MOTION.enter(T, K.Scan - 0.2, 0.8), outK = P(T, K.Outro - 0.1, 0.6, Easing.easeInCubic);
  if (inK <= 0 || outK >= 1) return null;
  let ai = 0;
  CH.forEach((c, i) => {
    if (T >= K[c.k]) ai = i;
  });
  const cur = CH[ai];
  return /* @__PURE__ */ React.createElement("div", { style: abs({ left: PX2, top: PY2, width: PW2, height: PH2, borderRadius: 20, border: `1.5px solid ${C.frame}`, background: "rgba(20,20,22,.94)", boxShadow: "0 40px 120px rgba(0,0,0,.55)", fontFamily: F, color: C.text, opacity: inK * (1 - outK), transform: `translateY(${(1 - inK) * 60 + outK * 40}px) scale(${mix(0.97, 1, inK)})` }) }, /* @__PURE__ */ React.createElement("div", { style: abs({ left: 40, right: 40, top: 30, display: "flex", justifyContent: "space-between", fontSize: 24, color: C.faint, whiteSpace: "pre" }) }, /* @__PURE__ */ React.createElement("span", null, "\u256D\u2500 ", /* @__PURE__ */ React.createElement("span", { style: { color: C.acc } }, decode(cur.h, T, K[cur.k], 0.35)), " \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500"), /* @__PURE__ */ React.createElement("span", null, "~/code")), CH.map((c, i) => {
    const a = K[c.k], b = ends(K, i), V = VIEWS[c.k];
    if (T < a - 0.05 || T > b + 0.05) return null;
    const o = win(T, a, b);
    return /* @__PURE__ */ React.createElement("div", { key: c.k, style: abs({ inset: 0, opacity: o, transform: `translateY(${(1 - o) * 18}px)` }) }, /* @__PURE__ */ React.createElement(V, { T, a }));
  }));
}
function Outro2({ T, K }) {
  const o = K.Outro;
  if (T < o) return null;
  const land = o + 2.2, f = clamp((T - (land - 0.4)) / 0.4, 0, 1);
  const lt = T - land, sq = lt > 0 && lt < 0.35 ? 0.25 * Math.sin(lt * 22) * (1 - lt / 0.35) : 0;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Wordmark, { T, t0: o + 0.4, d: 0.9, size: 150, top: 410 }), T >= land - 0.4 ? /* @__PURE__ */ React.createElement(Bit, { x: 1418, y: mix(-100, 406, f * f), px: 7, mood: T >= land ? "happy" : "idle", sq }) : null, /* @__PURE__ */ React.createElement("div", { style: abs({ left: 0, right: 0, top: 610, textAlign: "center", fontFamily: F, fontSize: 44, color: C.muted, whiteSpace: "pre" }) }, typed("your workspace, alive.", T, o + 1.3, 28)), /* @__PURE__ */ React.createElement("div", { style: abs({ left: 0, right: 0, top: 740, display: "flex", justifyContent: "center", fontFamily: F, fontSize: 32, color: C.text, opacity: MOTION.enter(T, o + 2.6, 0.5), whiteSpace: "pre" }) }, /* @__PURE__ */ React.createElement("span", { style: { padding: "14px 26px", border: `1.5px solid ${C.frameHi}`, borderRadius: 12 } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.acc } }, "\u276F "), "v3 \xB7 out now", /* @__PURE__ */ React.createElement(Cursor, { T }))));
}
function cues2(K) {
  const c = [], add = (t, s, g = 1, o = {}) => c.push({ t, s, g, ...o });
  add(0, "riser", 0.22);
  add(0.3, "type", 0.45, { dur: 0.4 });
  add(1.2, "glitch", 0.55);
  CH.forEach((ch) => {
    const a2 = K[ch.k];
    add(a2, "whoosh", 0.35);
    add(a2 + 0.35, "type", 0.3, { dur: Math.min(1.1, ch.t.length / 34) });
  });
  let a = K.Scan;
  add(a + 0.6, "scan", 0.35);
  REPOS.forEach(([, s], i) => add(a + 0.8 + i * 0.22, s === "bad" ? "alert" : "tick", s === "bad" ? 0.3 : 0.3));
  add(a + 0.8 + REPOS.length * 0.22 + 0.1, "chime", 0.55);
  a = K.Since;
  SINCE.forEach((_, i) => add(a + 0.9 + i * 0.55, "pop", 0.35));
  a = K.Next;
  add(a + 3.2, "pop", 0.7);
  add(a + 3.5, "chime", 0.65);
  add(a + 3.6, "coins", 0.3);
  a = K.Secrets;
  add(a + 0.5, "boop", 0.5);
  add(a + 1.3, "alert", 0.55);
  add(a + 2.4, "alert", 0.3);
  add(a + 4, "chime", 0.7);
  add(a + 4.05, "boop", 0.45);
  a = K.Diffs;
  DIFF.forEach((_, i) => add(a + 0.8 + i * 0.28, "tick", 0.25));
  add(a + 0.8 + DIFF.length * 0.28, "chime", 0.45);
  a = K.Ask;
  add(a + 0.6, "type", 0.5, { dur: 0.75 });
  add(a + 1.6, "tick", 0.4);
  ANSWER.forEach(([, l], i) => {
    if (l) add(a + 2.6 + i * 0.42, "pop", 0.25);
  });
  a = K.Map;
  add(a + 0.3, "scan", 0.3);
  CITY.forEach((_, i) => add(a + 0.3 + i * 0.1, "tick", 0.2));
  a = K.Bit;
  add(a + 0.3, "riser", 0.35, { off: 0.9, dur: 2.1 });
  add(a + 2.4, "levelup", 0.8);
  add(a + 2.7, "coins", 0.55);
  a = K.Outro;
  add(a, "whoosh", 0.45);
  add(a + 0.4, "glitch", 0.65);
  add(a + 1.3, "type", 0.4, { dur: 0.75 });
  add(a + 2.2, "boop", 0.6);
  add(a + 2.2, "hit", 0.35);
  return c;
}
function Piece2({ scanlines, sound }) {
  const { T, CUES: K, authoredTotal, playing } = useComposition();
  const total = authoredTotal || 61;
  window.__HQ2 = { K, total };
  HQAudio.useHQAudio({ T, playing, cues: cues2(K), music: "music2", musicGain: 0.6, enabled: sound, total });
  const s = 1 + 0.012 * Math.sin(T * 0.22);
  const uiOp = MOTION.enter(T, K.Scan - 0.2, 0.8) * (1 - P(T, K.Outro - 0.1, 0.6));
  return /* @__PURE__ */ React.createElement("div", { "data-screen-label": `t=${Math.floor(T)}s`, style: abs({ inset: 0, overflow: "hidden", background: C.bg }) }, /* @__PURE__ */ React.createElement(Backdrop, { T, op: MOTION.enter(T, 0, 1.5) * (1 - P(T, total - 0.8, 0.8)) }), /* @__PURE__ */ React.createElement("div", { style: abs({ left: 0, top: 0, width: W2, height: H2, transform: `scale(${s})`, transformOrigin: "50% 50%" }) }, /* @__PURE__ */ React.createElement(Intro, { T, K }), /* @__PURE__ */ React.createElement(Captions, { T, K }), /* @__PURE__ */ React.createElement(Console, { T, K }), /* @__PURE__ */ React.createElement(Rail, { T, K, op: uiOp }), /* @__PURE__ */ React.createElement(Outro2, { T, K })), scanlines ? /* @__PURE__ */ React.createElement("div", { style: abs({ inset: 0, pointerEvents: "none", background: "repeating-linear-gradient(0deg, rgba(0,0,0,.14) 0 1px, transparent 1px 4px)" }) }) : null, /* @__PURE__ */ React.createElement("div", { style: abs({ inset: 0, background: "#000", opacity: P(T, total - 0.5, 0.5), pointerEvents: "none" }) }));
}
function HQTrailer2() {
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
  return /* @__PURE__ */ React.createElement("div", { ref: wrap, style: { position: "fixed", inset: 0, width: "100vw", height: "100vh" } }, /* @__PURE__ */ React.createElement(CompositionStage, { width: W2, height: H2, scenes: window.OM_SCENES, playback: window.OM_PLAYBACK, bg: C.bg }, /* @__PURE__ */ React.createElement(Piece2, { scanlines: t.scanlines, sound: t.sound })), /* @__PURE__ */ React.createElement(TweaksPanel, null, /* @__PURE__ */ React.createElement(TweakSection, { label: "Trailer 2" }), /* @__PURE__ */ React.createElement(TweakToggle, { label: "Motion editor", value: t.motionEditor, onChange: (v) => setTweak("motionEditor", v) }), /* @__PURE__ */ React.createElement(TweakToggle, { label: "Scanlines", value: t.scanlines, onChange: (v) => setTweak("scanlines", v) }), /* @__PURE__ */ React.createElement(TweakSection, { label: "Audio" }), /* @__PURE__ */ React.createElement(TweakToggle, { label: "Sound", value: t.sound, onChange: (v) => setTweak("sound", v) }), /* @__PURE__ */ React.createElement(TweakButton, { label: "Download soundtrack (.wav)", onClick: () => {
    const h = window.__HQ2;
    if (h && h.K) HQAudio.renderWav(cues2(h.K), "music2", h.total, 0.6, "WorkspaceHQ-trailer-2");
  } })), /* @__PURE__ */ React.createElement(HQAudio.SoundChip, { enabled: t.sound }));
}
window.HQTrailer2 = HQTrailer2;
