const Easing = {
  linear: (t) => t,
  // Quad
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  // Cubic
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => --t * t * t + 1,
  easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  // Quart
  easeInQuart: (t) => t * t * t * t,
  easeOutQuart: (t) => 1 - --t * t * t * t,
  easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  // Expo
  easeInExpo: (t) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
  easeOutExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutExpo: (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10);
    return 1 - 0.5 * Math.pow(2, -20 * t + 10);
  },
  // Sine
  easeInSine: (t) => 1 - Math.cos(t * Math.PI / 2),
  easeOutSine: (t) => Math.sin(t * Math.PI / 2),
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  // Back (overshoot)
  easeOutBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeInOutBack: (t) => {
    const c1 = 1.70158, c2 = c1 * 1.525;
    return t < 0.5 ? Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2) / 2 : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },
  // Elastic
  easeOutElastic: (t) => {
    const c4 = 2 * Math.PI / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
};
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
function interpolate(input, output, ease = Easing.linear) {
  return (t) => {
    if (t <= input[0]) return output[0];
    if (t >= input[input.length - 1]) return output[output.length - 1];
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i];
        const local = span === 0 ? 0 : (t - input[i]) / span;
        const easeFn = Array.isArray(ease) ? ease[i] || Easing.linear : ease;
        const eased = easeFn(local);
        return output[i] + (output[i + 1] - output[i]) * eased;
      }
    }
    return output[output.length - 1];
  };
}
function animate({ from = 0, to = 1, start = 0, end = 1, ease = Easing.easeInOutCubic }) {
  return (t) => {
    if (t <= start) return from;
    if (t >= end) return to;
    const local = (t - start) / (end - start);
    return from + (to - from) * ease(local);
  };
}
const TimelineContext = React.createContext({ time: 0, duration: 10, playing: false });
const useTime = () => React.useContext(TimelineContext).time;
const useTimeline = () => React.useContext(TimelineContext);
var SS_EXT_PLAY_MS = 400;
function useInlineFontsInto(svgRef) {
  React.useEffect(() => {
    const svg = svgRef.current;
    const host = svg && svg.querySelector("foreignObject > div");
    if (!svg || !host) return;
    let cancelled = false;
    (async () => {
      const rules = [];
      for (const ss of document.styleSheets) {
        let cssRules;
        try {
          cssRules = ss.cssRules;
        } catch {
          if (ss.href) {
            try {
              const txt = await fetch(ss.href).then((r) => {
                if (!r.ok) throw 0;
                return r.text();
              });
              for (const ff of txt.match(/@font-face\s*{[^}]*}/g) || [])
                rules.push({ css: ff, base: ss.href });
            } catch {
            }
          }
          continue;
        }
        if (!cssRules) continue;
        for (const r of cssRules) {
          if (r.type === CSSRule.FONT_FACE_RULE) {
            rules.push({ css: r.cssText, base: ss.href || location.href });
          }
        }
      }
      const toDataURL = (url) => fetch(url).then((r) => {
        if (!r.ok) throw 0;
        return r.blob();
      }).then((b) => new Promise((res) => {
        const fr = new FileReader();
        fr.onload = () => res(fr.result);
        fr.onerror = () => res(url);
        fr.readAsDataURL(b);
      })).catch(() => url);
      const parts = await Promise.all(rules.map(async ({ css, base }) => {
        const re = /url\((['"]?)([^'")]+)\1\)/g;
        let out = css, m;
        while (m = re.exec(css)) {
          const u = m[2];
          if (u.startsWith("data:")) continue;
          let abs;
          try {
            abs = new URL(u, base).href;
          } catch {
            continue;
          }
          out = out.split(m[0]).join(`url("${await toDataURL(abs)}")`);
        }
        return out;
      }));
      if (cancelled || !parts.length) {
        svg.setAttribute("data-om-fonts-inlined", "true");
        return;
      }
      const style = document.createElement("style");
      style.textContent = parts.join("\n");
      host.insertBefore(style, host.firstChild);
      svg.setAttribute("data-om-fonts-inlined", "true");
    })();
    return () => {
      cancelled = true;
    };
  }, []);
}
function Stage({
  width = 1280,
  height = 720,
  duration = 10,
  background = "#f6f4ef",
  fps = 60,
  loop = true,
  autoplay = true,
  // Parsed playback object ({mode:'loop'} | {mode:'times',count:N}) or
  // null. When present it overrides the legacy loop prop — CompositionStage
  // passes the validated value from the OM_PLAYBACK authoring contract.
  playback = null,
  persistKey = "animstage-v3",
  children
}) {
  width = +width || 1280;
  height = +height || 720;
  duration = +duration || 10;
  fps = +fps || 60;
  if (typeof loop === "string") loop = loop !== "false";
  if (typeof autoplay === "string") autoplay = autoplay !== "false";
  const playTimes = playback && playback.mode === "times" ? playback.count : null;
  const loopEff = playback ? playback.mode === "loop" : loop;
  const [time, setTime] = React.useState(() => {
    try {
      const v = parseFloat(localStorage.getItem(persistKey + ":t") || "0");
      return isFinite(v) ? clamp(v, 0, duration) : 0;
    } catch {
      return 0;
    }
  });
  const [playing, setPlaying] = React.useState(autoplay);
  const [extPlay, setExtPlay] = React.useState(false);
  const extPlayTimerRef = React.useRef(null);
  const [hoverTime, setHoverTime] = React.useState(null);
  const [scale, setScale] = React.useState(1);
  const stageRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const lastTsRef = React.useRef(null);
  React.useEffect(() => {
    try {
      localStorage.setItem(persistKey + ":t", String(time));
    } catch {
    }
  }, [time, persistKey]);
  React.useEffect(() => {
    if (!stageRef.current) return;
    const el = stageRef.current;
    const measure = () => {
      const barH = 44;
      const s = Math.min(
        el.clientWidth / width,
        (el.clientHeight - barH) / height
      );
      setScale(Math.max(0.05, s));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [width, height]);
  const passesRef = React.useRef(0);
  React.useEffect(() => {
    if (!playing) {
      lastTsRef.current = null;
      return;
    }
    passesRef.current = 0;
    const step = (ts) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1e3;
      lastTsRef.current = ts;
      setTime((t) => {
        let next = t + dt;
        if (next >= duration) {
          if (playTimes !== null) {
            passesRef.current += 1;
            if (passesRef.current >= playTimes) {
              next = duration;
              setPlaying(false);
            } else {
              next = next % duration;
            }
          } else if (loopEff) {
            next = next % duration;
          } else {
            next = duration;
            setPlaying(false);
          }
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [playing, duration, loopEff, playTimes]);
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      if (e.code === "Space") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.code === "ArrowLeft") {
        setTime((t) => clamp(t - (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.code === "ArrowRight") {
        setTime((t) => clamp(t + (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.key === "0" || e.code === "Home") {
        setTime(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [duration]);
  React.useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const canSyncSeek = typeof ReactDOM !== "undefined" && typeof ReactDOM.flushSync === "function";
    const onSeek = (e) => {
      const apply = () => {
        setPlaying(false);
        const hostPlay = !!(e.detail && e.detail.playing === true);
        if (extPlayTimerRef.current) {
          clearTimeout(extPlayTimerRef.current);
          extPlayTimerRef.current = null;
        }
        if (hostPlay) {
          extPlayTimerRef.current = setTimeout(() => {
            extPlayTimerRef.current = null;
            setExtPlay(false);
          }, SS_EXT_PLAY_MS);
        }
        setExtPlay(hostPlay);
        setTime(clamp(e.detail.time, 0, duration));
      };
      if (canSyncSeek && e.detail && e.detail.sync === true) {
        ReactDOM.flushSync(apply);
      } else {
        apply();
      }
    };
    el.addEventListener("data-om-seek-to-time-frame", onSeek);
    if (canSyncSeek) el.setAttribute("data-om-sync-seek", "true");
    return () => {
      el.removeEventListener("data-om-seek-to-time-frame", onSeek);
      el.removeAttribute("data-om-sync-seek");
      if (extPlayTimerRef.current) {
        clearTimeout(extPlayTimerRef.current);
        extPlayTimerRef.current = null;
      }
      setExtPlay(false);
    };
  }, [duration]);
  useInlineFontsInto(canvasRef);
  const displayTime = hoverTime != null ? hoverTime : time;
  const ctxValue = React.useMemo(
    // extPlaying is ADDITIVE: "time is advancing under an external
    // driver's continuous playback". `playing` keeps meaning the
    // engine's OWN clock — the hidden PlaybackBar glyph (and through it
    // the host's clock-reporter/adoption channel) reads that — and
    // CompositionClock is the one consumer that widens to either.
    () => ({
      time: displayTime,
      duration,
      playing,
      extPlaying: extPlay,
      setTime,
      setPlaying
    }),
    [displayTime, duration, playing, extPlay]
  );
  return (
    // data-om-starter: inert presence marker — Claude Design's starter-usage
    // probe reads it; it renders nothing. Keep it on this root element.
    /* @__PURE__ */ React.createElement(
      "div",
      {
        ref: stageRef,
        "data-om-starter": "animations-v3",
        style: {
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#0a0a0a",
          fontFamily: "Inter, system-ui, sans-serif"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: {
        flex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        minHeight: 0
      } }, /* @__PURE__ */ React.createElement(
        "svg",
        {
          ref: canvasRef,
          width,
          height,
          "data-om-exportable-video-with-duration-secs": duration,
          style: {
            transform: `scale(${scale})`,
            transformOrigin: "center",
            flexShrink: 0,
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            display: "block"
          }
        },
        /* @__PURE__ */ React.createElement("foreignObject", { x: "0", y: "0", width: "100%", height: "100%" }, /* @__PURE__ */ React.createElement(
          "div",
          {
            xmlns: "http://www.w3.org/1999/xhtml",
            style: {
              width,
              height,
              background,
              position: "relative",
              overflow: "hidden"
            }
          },
          /* @__PURE__ */ React.createElement(TimelineContext.Provider, { value: ctxValue }, children)
        ))
      )),
      /* @__PURE__ */ React.createElement(
        PlaybackBar,
        {
          time: displayTime,
          actualTime: time,
          duration,
          playing,
          onPlayPause: () => setPlaying((p) => !p),
          onReset: () => {
            setTime(0);
          },
          onSeek: (t) => setTime(t),
          onHover: (t) => setHoverTime(t)
        }
      )
    )
  );
}
function PlaybackBar({ time, duration, playing, onPlayPause, onReset, onSeek, onHover }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const timeFromEvent = React.useCallback((e) => {
    const rect = trackRef.current.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    return x * duration;
  }, [duration]);
  const onTrackMove = (e) => {
    if (!trackRef.current) return;
    const t = timeFromEvent(e);
    if (dragging) {
      onSeek(t);
    } else {
      onHover(t);
    }
  };
  const onTrackLeave = () => {
    if (!dragging) onHover(null);
  };
  const onTrackDown = (e) => {
    setDragging(true);
    const t = timeFromEvent(e);
    onSeek(t);
    onHover(null);
  };
  React.useEffect(() => {
    if (!dragging) return;
    const onUp = () => setDragging(false);
    const onMove = (e) => {
      if (!trackRef.current) return;
      const t = timeFromEvent(e);
      onSeek(t);
    };
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
    };
  }, [dragging, timeFromEvent, onSeek]);
  const pct = duration > 0 ? time / duration * 100 : 0;
  const fmt = (t) => {
    const total = Math.max(0, t);
    const m = Math.floor(total / 60);
    const s = Math.floor(total % 60);
    const cs = Math.floor(total * 100 % 100);
    return `${String(m).padStart(1, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
  };
  const mono = "JetBrains Mono, ui-monospace, SFMono-Regular, monospace";
  return /* @__PURE__ */ React.createElement("div", { "data-omelette-chrome": true, style: {
    // Slimmed to visually match the host editor bar's basic row (the
    // single-scrubber look): transport first, tighter metrics, quieter
    // chrome. Shown only outside the app — the host bar suppresses this
    // whenever it is present.
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "6px 12px",
    background: "rgba(20,20,20,0.92)",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
    borderRadius: 6,
    color: "#f6f4ef",
    fontFamily: "Inter, system-ui, sans-serif",
    userSelect: "none",
    flexShrink: 0
  } }, /* @__PURE__ */ React.createElement(IconButton, { onClick: onPlayPause, title: "Play/pause (space)" }, playing ? /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none" }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "2", width: "3", height: "10", fill: "currentColor" }), /* @__PURE__ */ React.createElement("rect", { x: "8", y: "2", width: "3", height: "10", fill: "currentColor" })) : /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none" }, /* @__PURE__ */ React.createElement("path", { d: "M3 2l9 5-9 5V2z", fill: "currentColor" }))), /* @__PURE__ */ React.createElement(IconButton, { onClick: onReset, title: "Return to start (0)" }, /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none" }, /* @__PURE__ */ React.createElement("path", { d: "M3 2v10M12 2L5 7l7 5V2z", stroke: "currentColor", strokeWidth: "1.5", strokeLinejoin: "round", strokeLinecap: "round" }))), /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: mono,
    fontSize: 12,
    fontVariantNumeric: "tabular-nums",
    width: 64,
    textAlign: "right",
    color: "#f6f4ef"
  } }, fmt(time)), /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: trackRef,
      onMouseMove: onTrackMove,
      onMouseLeave: onTrackLeave,
      onMouseDown: onTrackDown,
      style: {
        flex: 1,
        height: 22,
        position: "relative",
        cursor: "pointer",
        display: "flex",
        alignItems: "center"
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      left: 0,
      right: 0,
      height: 4,
      background: "rgba(255,255,255,0.12)",
      borderRadius: 2
    } }),
    /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      left: 0,
      width: `${pct}%`,
      height: 4,
      background: "oklch(72% 0.12 250)",
      borderRadius: 2
    } }),
    /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      left: `${pct}%`,
      top: "50%",
      width: 12,
      height: 12,
      marginLeft: -6,
      marginTop: -6,
      background: "#fff",
      borderRadius: 6,
      boxShadow: "0 2px 4px rgba(0,0,0,0.4)"
    } })
  ), /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: mono,
    fontSize: 12,
    fontVariantNumeric: "tabular-nums",
    width: 64,
    textAlign: "left",
    color: "rgba(246,244,239,0.55)"
  } }, fmt(duration)), typeof VideoEncoder !== "undefined" && /* @__PURE__ */ React.createElement(
    IconButton,
    {
      title: "Export video",
      onClick: () => window.parent.postMessage({ type: "omelette:request-video-export" }, "*")
    },
    /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none" }, /* @__PURE__ */ React.createElement("path", { d: "M7 2v7m0 0L4 6m3 3l3-3M2 12h10", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }))
  ));
}
function IconButton({ children, onClick, title }) {
  const [hover, setHover] = React.useState(false);
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick,
      title,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: hover ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 5,
        color: "#f6f4ef",
        cursor: "pointer",
        padding: 0,
        transition: "background 120ms"
      }
    },
    children
  );
}
function ssParse(raw) {
  if (typeof raw !== "string" || !raw || raw.length > 16 * 1024) return null;
  var parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return null;
  }
  if (!Array.isArray(parsed) || parsed.length === 0 || parsed.length > 50) return null;
  for (var i = 0; i < parsed.length; i++) {
    var s = parsed[i];
    if (typeof s !== "object" || s === null) return null;
    if (typeof s.name !== "string" || typeof s.dur !== "number") return null;
    if (!isFinite(s.dur) || s.dur <= 0 || s.dur > 300) return null;
  }
  return parsed;
}
function ppParse(raw) {
  if (typeof raw !== "string" || !raw || raw.length > 256) return null;
  var parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
  var keys = Object.keys(parsed);
  if (parsed.mode === "loop") return keys.length === 1 ? { mode: "loop" } : null;
  if (parsed.mode === "times") {
    if (keys.length !== 2) return null;
    var c = parsed.count;
    if (typeof c !== "number" || c !== Math.floor(c) || c < 1 || c > 99) return null;
    return { mode: "times", count: c };
  }
  return null;
}
function PlaybackSync(props) {
  var ref = React.useRef(null);
  var raw = props.raw;
  var onUpdate = props.onUpdate;
  React.useEffect(function() {
    var el = ref.current;
    if (!el) return;
    var root = el.closest("[data-om-exportable-video-with-duration-secs]");
    if (!root) return;
    root.setAttribute("data-om-timeline-playback", raw);
    var onEvent = function(e) {
      var next = e && e.detail;
      if (ppParse(next)) onUpdate(next);
    };
    root.addEventListener("data-om-timeline-playback-update", onEvent);
    return function() {
      root.removeEventListener("data-om-timeline-playback-update", onEvent);
      root.removeAttribute("data-om-timeline-playback");
    };
  }, [raw, onUpdate]);
  return /* @__PURE__ */ React.createElement("div", { ref, style: { display: "none" } });
}
function SceneSync(props) {
  var ref = React.useRef(null);
  var raw = props.raw;
  var onUpdate = props.onUpdate;
  React.useEffect(function() {
    var el = ref.current;
    if (!el) return;
    var root = el.closest("[data-om-exportable-video-with-duration-secs]");
    if (!root) return;
    root.setAttribute("data-om-timeline-scenes", raw);
    var onEvent = function(e) {
      var next = e && e.detail;
      if (ssParse(next)) onUpdate(next);
    };
    root.addEventListener("data-om-timeline-scenes-update", onEvent);
    return function() {
      root.removeEventListener("data-om-timeline-scenes-update", onEvent);
      root.removeAttribute("data-om-timeline-scenes");
    };
  }, [raw, onUpdate]);
  return /* @__PURE__ */ React.createElement("div", { ref, style: { display: "none" } });
}
var CompositionContext = React.createContext(null);
function useComposition() {
  var ctx = React.useContext(CompositionContext);
  if (!ctx) throw new Error("useComposition() must be called inside <CompositionStage>");
  return ctx;
}
function ccDerive(scenes) {
  var playStart = 0;
  var authStart = 0;
  var sections = [];
  var table = /* @__PURE__ */ Object.create(null);
  for (var i = 0; i < scenes.length; i++) {
    var s = scenes[i];
    var nat = typeof s.nat === "number" && isFinite(s.nat) && s.nat > 0 ? s.nat : s.dur;
    sections.push({ name: s.name, playStart, dur: s.dur, authStart, nat });
    if (!Object.prototype.hasOwnProperty.call(table, s.name)) {
      table[s.name] = Math.round(authStart * 1e3) / 1e3;
    }
    playStart += s.dur;
    authStart += nat;
  }
  return {
    sections,
    table,
    total: Math.round(playStart * 1e3) / 1e3,
    authoredTotal: Math.round(authStart * 1e3) / 1e3
  };
}
function ccWarp(d, t) {
  var ss = d.sections;
  if (ss.length === 0) return 0;
  var idx = ss.length - 1;
  for (var i = 0; i < ss.length; i++) {
    if (t < ss[i].playStart + ss[i].dur) {
      idx = i;
      break;
    }
  }
  var s = ss[idx];
  var local = Math.min(Math.max(t - s.playStart, 0), s.dur);
  var T = s.authStart + (s.dur > 0 ? local * (s.nat / s.dur) : 0);
  return Math.min(T, d.authoredTotal);
}
var CC_META = Object.assign(/* @__PURE__ */ Object.create(null), {
  toString: 1,
  toLocaleString: 1,
  valueOf: 1,
  toJSON: 1,
  then: 1,
  constructor: 1,
  hasOwnProperty: 1,
  isPrototypeOf: 1,
  propertyIsEnumerable: 1,
  default: 1
});
function ccCueProxy(table, unknownRef) {
  if (typeof Proxy !== "function") return table;
  return new Proxy(table, {
    get: function(target, prop) {
      if (typeof prop !== "string" || prop in target) return target[prop];
      if (CC_META[prop] || prop.indexOf("@@") === 0) return Object.prototype[prop];
      unknownRef.current[prop] = true;
      return NaN;
    }
  });
}
function CcUnknownWatch(props) {
  var tl = useTimeline();
  React.useEffect(function() {
    var next = Object.keys(props.unknownRef.current).sort().join(", ");
    if (next !== props.badge) props.setBadge(next);
  }, [tl.time]);
  return null;
}
function CompositionClock(props) {
  var tl = useTimeline();
  var d = props.derived;
  var T = ccWarp(d, tl.time);
  var value = React.useMemo(function() {
    return {
      T,
      CUES: props.cues,
      time: tl.time,
      duration: tl.duration,
      authoredTotal: d.authoredTotal,
      playing: tl.playing || tl.extPlaying === true
    };
  }, [T, props.cues, tl.time, tl.duration, d, tl.playing, tl.extPlaying]);
  return /* @__PURE__ */ React.createElement(CompositionContext.Provider, { value }, props.children);
}
function Shot(props) {
  var c = useComposition();
  var from = +props.from;
  var to = props.to == null ? Infinity : +props.to;
  var on = isFinite(from) && c.T >= from && c.T < to;
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, visibility: on ? "visible" : "hidden" } }, props.children);
}
var CAPTION_FADE = 0.18;
function Captions(props) {
  var c = useComposition();
  var t = c.T;
  var items = (props.items || []).filter(function(it) {
    return it && isFinite(+it.at);
  }).sort(function(a, b) {
    return a.at - b.at;
  });
  var active = null;
  var end = Infinity;
  for (var i = 0; i < items.length; i++) {
    if (t < items[i].at) break;
    active = items[i];
    end = typeof active.until === "number" && isFinite(active.until) ? active.until : i + 1 < items.length ? items[i + 1].at : Infinity;
  }
  if (!active || t >= end) return null;
  var o = Math.min(1, (t - active.at) / CAPTION_FADE);
  if (isFinite(end)) o = Math.min(o, (end - t) / CAPTION_FADE);
  o = Math.max(0, Math.min(1, o));
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      "data-om-caption": true,
      style: Object.assign({
        position: "absolute",
        left: "8%",
        right: "8%",
        bottom: "7%",
        textAlign: "center",
        opacity: o,
        pointerEvents: "none",
        font: "500 30px Inter, system-ui, sans-serif",
        color: "#f6f4ef",
        textShadow: "0 1px 14px rgba(0,0,0,0.45)"
      }, props.style)
    },
    active.text
  );
}
function CompositionStage(props) {
  var width = +props.width || 1280;
  var height = +props.height || 720;
  var bg = props.bg || "#0b0b0e";
  var autoplay = props.autoplay == null ? true : String(props.autoplay) !== "false";
  var loop = props.loop == null ? true : String(props.loop) !== "false";
  var state = React.useState(props.scenes);
  var raw = state[0];
  var setRaw = state[1];
  var scenes = React.useMemo(function() {
    return ssParse(raw);
  }, [raw]);
  var pstate = React.useState(props.playback);
  var praw = pstate[0];
  var setPraw = pstate[1];
  var pb = React.useMemo(function() {
    return ppParse(praw);
  }, [praw]);
  var unknownRef = React.useRef({});
  var badgeState = React.useState("");
  var badge = badgeState[0];
  var setBadge = badgeState[1];
  var derived = React.useMemo(function() {
    unknownRef.current = {};
    return scenes ? ccDerive(scenes) : null;
  }, [scenes]);
  var cues = React.useMemo(function() {
    return derived ? ccCueProxy(derived.table, unknownRef) : null;
  }, [derived]);
  React.useEffect(function() {
    var next = Object.keys(unknownRef.current).sort().join(", ");
    if (next !== badge) setBadge(next);
  });
  if (!scenes) {
    return /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0b0b0e",
      color: "#c96442",
      font: "500 16px Inter, system-ui, sans-serif",
      textAlign: "center"
    } }, "animations-v3: the scenes prop isn't a valid JSON scene list", /* @__PURE__ */ React.createElement("br", null), "(expected '[", "{", '"name":"\u2026","dur":N', "}", ", \u2026]')");
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    Stage,
    {
      width,
      height,
      duration: derived.total,
      background: bg,
      autoplay,
      loop,
      playback: pb
    },
    /* @__PURE__ */ React.createElement(SceneSync, { raw, onUpdate: setRaw }),
    typeof praw === "string" && praw !== "" && /* @__PURE__ */ React.createElement(PlaybackSync, { raw: praw, onUpdate: setPraw }),
    /* @__PURE__ */ React.createElement(CompositionClock, { derived, cues }, props.children),
    /* @__PURE__ */ React.createElement(CcUnknownWatch, { unknownRef, badge, setBadge })
  ), badge !== "" && // Sibling of Stage, outside the exportable <svg>: visible in the
  // preview (and its screenshots), never in the exported video.
  /* @__PURE__ */ React.createElement(
    "div",
    {
      "data-om-unknown-cues": true,
      style: {
        position: "absolute",
        left: 12,
        bottom: 56,
        zIndex: 10,
        padding: "6px 10px",
        borderRadius: 6,
        background: "rgba(0,0,0,0.72)",
        color: "#e8906a",
        font: "500 12px Inter, system-ui, sans-serif",
        pointerEvents: "none"
      }
    },
    "choreography references unknown section",
    badge.indexOf(",") >= 0 ? "s" : "",
    ": ",
    badge
  ));
}
var WC_PIXEL_CAP = 11e6;
function wcLayerOpts(props) {
  var w = +props.width || 900, h = +props.height || 1200;
  var askScale = +props.scale || 1;
  return { width: w, height: h, scale: Math.min(askScale, Math.sqrt(WC_PIXEL_CAP / (w * h))), seed: props.seed == null ? void 0 : +props.seed, quality: props.quality == null ? void 0 : +props.quality };
}
var wcWarned = {};
function wcWarnOnce(key, message, err) {
  if (wcWarned[key]) return;
  wcWarned[key] = true;
  console.warn(message, err);
}
function useWatercolorLayers(painting, opts) {
  var kit = window.WatercolorKit;
  if (typeof painting !== "function" || !kit || typeof kit.layers !== "function") return null;
  try {
    return kit.layers(painting, wcLayerOpts(opts || {}));
  } catch (e) {
    wcWarnOnce("layers:" + e, "watercolor painting failed to build; rendering the fallback sheet", e);
    return null;
  }
}
var WatercolorSheetContext = React.createContext(null);
function WatercolorSheet(props) {
  var L = props.layers || null;
  var style = Object.assign({
    position: "relative",
    display: "block",
    width: "100%",
    aspectRatio: L ? L.width + " / " + L.height : "3 / 4",
    isolation: "isolate",
    overflow: "hidden"
  }, props.style);
  if (!L) {
    return /* @__PURE__ */ React.createElement("div", { style: Object.assign(style, { background: "#f4f1e8", color: "#8a8270", font: "12px system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }) }, "watercolor-kit.js not loaded (or the painting failed to build)");
  }
  return /* @__PURE__ */ React.createElement(WatercolorSheetContext.Provider, { value: L }, /* @__PURE__ */ React.createElement("div", { style, "data-om-watercolor-sheet": true }, /* @__PURE__ */ React.createElement("img", { src: L.paper, alt: props.alt || "", style: { position: "absolute", left: 0, top: 0, width: "100%", height: "100%", display: "block" } }), props.children));
}
function WatercolorStroke(props) {
  var fromSheet = React.useContext(WatercolorSheetContext);
  var L = props.layers || fromSheet;
  if (!L) return null;
  var i = +props.index;
  if (!(i >= 0) || i >= L.count) return null;
  var at = props.at == null ? 1 : clamp(+props.at, 0, 1);
  if (!(at > 0)) return null;
  var box, src;
  try {
    box = L.box(i);
    src = box ? L.src(i, at) : null;
  } catch (e) {
    wcWarnOnce("stroke:" + i + ":" + e, "watercolor stroke " + i + " failed to render; skipping it", e);
    return null;
  }
  if (!box || !src) return null;
  var style = Object.assign({
    position: "absolute",
    display: "block",
    left: box.x * 100 + "%",
    top: box.y * 100 + "%",
    width: box.w * 100 + "%",
    height: box.h * 100 + "%",
    mixBlendMode: L.kind(i) === "reserve" ? "normal" : "multiply",
    pointerEvents: "none"
  }, props.style);
  return /* @__PURE__ */ React.createElement("img", { src, alt: "", "data-om-watercolor-stroke": i, "data-om-stroke-kind": L.kind(i), style });
}
function WatercolorPainting(props) {
  var c = useComposition();
  var from = +props.from || 0;
  var to = props.to == null ? from + 6 : +props.to;
  var u = clamp((c.T - from) / Math.max(to - from, 1e-3), 0, 1);
  var eased = Easing.easeInOutQuad(u);
  var L = useWatercolorLayers(props.painting, props);
  var tick = React.useState(0)[1];
  var warmed = React.useRef(null);
  React.useEffect(function() {
    if (!L || typeof L.warm !== "function") return;
    var p = L.warm();
    if (warmed.current === p) return;
    var live = true;
    p.then(function() {
      warmed.current = p;
      if (live) tick(function(x) {
        return x + 1;
      });
    });
    return function() {
      live = false;
    };
  }, [L && L.paper, props.painting]);
  var strokes = [];
  if (L) {
    for (var i = 0; i < L.count; i++) {
      var sp = L.span(i);
      var at = clamp((eased - sp.from) / Math.max(sp.to - sp.from, 1e-6), 0, 1);
      if (at <= 0) break;
      strokes.push(/* @__PURE__ */ React.createElement(WatercolorStroke, { key: i, layers: L, index: i, at }));
    }
  }
  return /* @__PURE__ */ React.createElement(WatercolorSheet, { layers: L, style: props.style, alt: props.alt }, strokes);
}
function WatercolorReveal(props) {
  var c = useComposition();
  var from = +props.from || 0;
  var to = props.to == null ? from + 6 : +props.to;
  var u = clamp((c.T - from) / Math.max(to - from, 1e-3), 0, 1);
  var style = Object.assign({ display: "block", width: "100%", height: "100%", objectFit: "contain" }, props.style);
  var frames = Array.isArray(props.frames) && props.frames.length ? props.frames : null;
  var steps = frames ? frames.length - 1 : Math.max(1, Math.round(+props.steps || 36));
  var i = Math.min(steps, Math.round(Easing.easeInOutQuad(u) * steps));
  var painting = typeof props.painting === "function" ? props.painting : null;
  var kit = window.WatercolorKit;
  var w = +props.width || 900, h = +props.height || 1200;
  var askScale = +props.scale || Math.min(2, window.devicePixelRatio || 1);
  var opts = {
    width: w,
    height: h,
    scale: Math.min(askScale, Math.sqrt(11e6 / (w * h))),
    seed: props.seed == null ? void 0 : +props.seed,
    steps,
    type: props.format || "image/jpeg",
    quality: props.quality == null ? 0.88 : +props.quality
  };
  var key = opts.width + "x" + opts.height + "#" + opts.seed + "@" + opts.scale + "/" + steps + ":" + opts.type + "/" + opts.quality;
  var cache = React.useRef({ fn: null, key: "", frames: {}, baking: false }).current;
  var tick = React.useState(0)[1];
  if (cache.fn !== painting && String(cache.fn) !== String(painting) || cache.key !== key) {
    cache.key = key;
    cache.frames = {};
    cache.baking = false;
  }
  cache.fn = painting;
  React.useEffect(function() {
    if (frames || cache.baking || !painting || !kit || typeof kit.bake !== "function") return;
    cache.baking = true;
    var target = cache.frames;
    try {
      kit.bake(painting, opts, function(n, _t, url) {
        target[n] = url;
      }).then(function(all) {
        if (cache.frames !== target) return;
        for (var n = 0; n < all.length; n++) target[n] = all[n];
        tick(function(x) {
          return x + 1;
        });
      }).catch(function() {
      });
    } catch (e) {
    }
  });
  if (frames) return /* @__PURE__ */ React.createElement("img", { src: frames[i], alt: props.alt || "", style });
  if (!kit || !painting) {
    return /* @__PURE__ */ React.createElement("div", { style: Object.assign({ width: "100%", height: "100%", background: "#f4f1e8", color: "#8a8270", font: "12px system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }, props.style) }, "watercolor-kit.js not loaded (or no painting function)");
  }
  if (!cache.frames[i]) {
    try {
      cache.frames[i] = kit.frame(painting, Object.assign({}, opts, { at: i / steps }));
    } catch (e) {
      return /* @__PURE__ */ React.createElement("div", { style: Object.assign({ width: "100%", height: "100%", background: "#f4f1e8", color: "#8a8270", font: "12px system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }, props.style) }, "painting too large to render (", String(e && e.message).slice(0, 80), ")");
    }
  }
  return /* @__PURE__ */ React.createElement("img", { src: cache.frames[i], alt: props.alt || "", style });
}
Object.assign(window, {
  Easing,
  interpolate,
  animate,
  clamp,
  TimelineContext,
  useTime,
  useTimeline,
  Stage,
  PlaybackBar,
  CompositionStage,
  useComposition,
  Shot,
  Captions,
  WatercolorReveal,
  WatercolorPainting,
  WatercolorSheet,
  WatercolorStroke,
  useWatercolorLayers
});
