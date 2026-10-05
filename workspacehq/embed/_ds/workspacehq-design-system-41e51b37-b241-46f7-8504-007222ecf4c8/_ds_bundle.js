/* @ds-bundle: {"format":4,"namespace":"WorkspaceHQDesignSystem_41e51b","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"ProgressBar","sourcePath":"components/core/ProgressBar.jsx"},{"name":"SectionHeading","sourcePath":"components/core/SectionHeading.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Kpi","sourcePath":"components/data/Kpi.jsx"},{"name":"ProjectCard","sourcePath":"components/data/ProjectCard.jsx"},{"name":"Achievement","sourcePath":"components/game/Achievement.jsx"},{"name":"Coin","sourcePath":"components/game/Coin.jsx"},{"name":"MissionCard","sourcePath":"components/game/MissionCard.jsx"},{"name":"QuestItem","sourcePath":"components/game/QuestItem.jsx"},{"name":"SpellCard","sourcePath":"components/game/SpellCard.jsx"}],"sourceHashes":{"components/core/Button.jsx":"5e2c0bda8c60","components/core/ProgressBar.jsx":"fce8b5449c63","components/core/SectionHeading.jsx":"cf7a2bf61209","components/core/Tag.jsx":"8cc903a703e1","components/data/Kpi.jsx":"bbe2c925ad22","components/data/ProjectCard.jsx":"cbd97056830e","components/game/Achievement.jsx":"e0eedb2ce72b","components/game/Coin.jsx":"30364d9e9fcb","components/game/MissionCard.jsx":"1cabee6c6f40","components/game/QuestItem.jsx":"e7821a02a71d","components/game/SpellCard.jsx":"953fae656cac","ui_kits/nexus/GrimoireScreen.jsx":"f06c82778ee1","ui_kits/nexus/Shell.jsx":"6e91984113b1","ui_kits/nexus/TodayScreen.jsx":"f3050bb73648"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.WorkspaceHQDesignSystem_41e51b = window.WorkspaceHQDesignSystem_41e51b || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — the arcade console's action control. Pixel (Press Start 2P) label,
 * hard-edged frame, no border-radius. Chunky variants carry a hard 0-3px drop
 * shadow that collapses on :active (the cabinet-button press).
 */
function Button({
  children,
  variant = "ghost",
  size = "md",
  block = false,
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const sizes = {
    sm: {
      fontSize: 7,
      padding: "6px 10px",
      letterSpacing: "1px"
    },
    md: {
      fontSize: 8,
      padding: "9px 14px",
      letterSpacing: "1px"
    },
    lg: {
      fontSize: 9,
      padding: "12px 18px",
      letterSpacing: "1px"
    }
  };
  const base = {
    display: block ? "flex" : "inline-flex",
    width: block ? "100%" : undefined,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: "var(--px)",
    lineHeight: 1.4,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    borderRadius: 0,
    textTransform: "none",
    transition: "transform .12s, background .12s, border-color .12s, box-shadow .12s",
    ...sizes[size]
  };
  const variants = {
    // chunky gold cabinet button — the primary CTA
    primary: {
      color: "#3a2a00",
      background: "linear-gradient(180deg, var(--gold-2), var(--gold))",
      border: "2px solid #8a6200",
      boxShadow: pressed ? "none" : "0 3px 0 #8a6200",
      transform: pressed ? "translateY(3px)" : "none"
    },
    // chunky green — confirm / complete
    success: {
      color: "var(--ink)",
      background: "var(--green)",
      border: "2px solid var(--ink)",
      boxShadow: pressed ? "0 1px 0 #1f9e4b" : "0 3px 0 #1f9e4b",
      transform: pressed ? "translateY(2px)" : "none"
    },
    // pixel utility button (qbtn) — ink fill, frame edge, gold on hover
    ghost: {
      color: hover && !disabled ? "var(--gold-2)" : "var(--muted)",
      background: "var(--ink)",
      border: `2px solid ${hover && !disabled ? "var(--gold)" : "var(--frame)"}`,
      transform: pressed ? "translateY(2px)" : "none"
    },
    // outline (sec-btn) — transparent, cyan label, ink border + frame ring
    outline: {
      color: hover && !disabled ? "var(--gold-2)" : "var(--cyan)",
      background: "transparent",
      border: "2px solid var(--ink)",
      boxShadow: "0 0 0 1px var(--frame)"
    },
    // danger — red fill
    danger: {
      color: "#fff",
      background: "var(--red)",
      border: "2px solid var(--red)",
      filter: hover && !disabled ? "brightness(1.12)" : "none"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: disabled ? undefined : onClick,
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPressed(false);
    },
    style: {
      ...base,
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ProgressBar — the segmented "energy meter". A coloured fill glows behind a
 * repeating-gradient mask that chops it into pixel cells (the arcade signature).
 */
function ProgressBar({
  value = 0,
  color = "var(--green)",
  height = 10,
  style,
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, value));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      height,
      background: "var(--ink)",
      border: "2px solid var(--ink)",
      boxShadow: "0 0 0 1px var(--frame)",
      overflow: "hidden",
      borderRadius: 0,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("i", {
    style: {
      display: "block",
      height: "100%",
      width: pct + "%",
      background: color,
      color,
      boxShadow: "0 0 8px currentColor",
      transition: "width .7s cubic-bezier(.22,1,.36,1)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      content: "''",
      position: "absolute",
      inset: 0,
      background: "repeating-linear-gradient(90deg, transparent 0 6px, var(--ink) 6px 8px)",
      pointerEvents: "none"
    }
  }));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SectionHeading — h2.sec. Pixel label, cyan phosphor glow, a ■ bullet, wide
 * tracking. The recurring section divider across every dashboard view. Pass
 * `count` for the muted trailing tally, `color` to retint (e.g. red for alerts).
 */
function SectionHeading({
  children,
  count,
  color = "var(--cyan)",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("h2", _extends({
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8,
      margin: "30px 0 14px",
      fontFamily: "var(--px)",
      fontSize: 10,
      letterSpacing: "2px",
      color,
      textShadow: "0 0 9px rgba(0,240,255,.5)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--faint)"
    }
  }, "\u25A0"), /*#__PURE__*/React.createElement("span", null, children), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--term)",
      fontSize: "1.7em",
      color: "var(--faint)",
      letterSpacing: 0,
      textShadow: "none"
    }
  }, count));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tag — a small status chip. Terminal (VT323) label, ink fill, hairline frame.
 * Tones tint the label + border + a faint wash, matching the app's badge set.
 */
function Tag({
  children,
  tone = "default",
  style,
  ...rest
}) {
  const tones = {
    default: {
      color: "var(--muted)",
      border: "1px solid var(--frame)",
      background: "var(--ink)"
    },
    green: {
      color: "var(--green)",
      border: "1px solid rgba(58,255,110,.5)",
      background: "rgba(58,255,110,.06)"
    },
    red: {
      color: "var(--red)",
      border: "1px solid rgba(255,71,87,.5)",
      background: "rgba(255,71,87,.07)"
    },
    orange: {
      color: "var(--orange)",
      border: "1px solid rgba(255,165,2,.5)",
      background: "rgba(255,165,2,.07)"
    },
    blue: {
      color: "var(--blue)",
      border: "1px solid rgba(77,159,255,.45)",
      background: "rgba(77,159,255,.06)"
    },
    gold: {
      color: "var(--gold-2)",
      border: "1px solid rgba(255,210,63,.5)",
      background: "rgba(255,210,63,.07)"
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      fontFamily: "var(--term)",
      fontSize: 14,
      lineHeight: 1.1,
      padding: "3px 8px",
      borderRadius: 0,
      whiteSpace: "nowrap",
      ...tones[tone],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/Kpi.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Kpi — a single stat tile. Gradient card body, a coloured left accent rail,
 * a big VT323 value and a tiny pixel label. Optional delta chip (up/down/flat).
 */
function Kpi({
  value,
  label,
  accent = "var(--blue)",
  delta,
  trend = "flat",
  style,
  ...rest
}) {
  const trendColor = {
    up: "var(--green)",
    down: "var(--red)",
    flat: "var(--faint)"
  }[trend];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      background: "linear-gradient(160deg, var(--card-hi), var(--card))",
      border: "2px solid var(--ink)",
      boxShadow: "0 0 0 2px var(--frame), 0 0 14px -6px rgba(90,78,168,.55)",
      borderRadius: 0,
      padding: "13px 14px",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      background: accent
    }
  }), delta != null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 11,
      right: 12,
      fontFamily: "var(--term)",
      fontSize: 15,
      color: trendColor
    }
  }, delta), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--term)",
      fontSize: 34,
      lineHeight: 0.9,
      color: "var(--text)"
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--px)",
      fontSize: 6.5,
      letterSpacing: "1px",
      color: "var(--muted)",
      marginTop: 9,
      textTransform: "uppercase"
    }
  }, label));
}
Object.assign(__ds_scope, { Kpi });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Kpi.jsx", error: String((e && e.message) || e) }); }

// components/data/ProjectCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ProjectCard — one tracked product. Gradient body, a glowing left rail (rc),
 * a big completion percent + pixel name, stack line, segmented progress meter,
 * and a row of status badges. Lifts on hover. The core repeating unit of the
 * portfolio grid.
 */
function ProjectCard({
  name,
  percent = 50,
  stack = "",
  barColor = "var(--green)",
  railColor = "var(--green)",
  xp,
  tags = [],
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: "relative",
      background: "linear-gradient(165deg, var(--card-hi), var(--card))",
      border: "2px solid var(--ink)",
      boxShadow: hover ? "0 0 0 2px var(--frame-hi), 0 8px 26px -10px rgba(0,0,0,.9)" : "0 0 0 2px var(--frame), 0 0 14px -6px rgba(90,78,168,.55)",
      borderRadius: 0,
      padding: "15px 16px",
      cursor: onClick ? "pointer" : "default",
      transform: hover ? "translateY(-3px)" : "none",
      transition: "transform .15s cubic-bezier(.22,1,.36,1), box-shadow .15s",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      background: railColor,
      boxShadow: `0 0 9px ${railColor}`
    }
  }), xp != null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 12,
      right: 13,
      fontFamily: "var(--term)",
      fontSize: 15,
      color: "var(--gold-2)"
    }
  }, xp), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "0 0 4px",
      display: "flex",
      alignItems: "baseline",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--term)",
      fontSize: 27,
      color: "var(--gold-2)",
      lineHeight: 0.9,
      textShadow: "0 0 8px rgba(255,210,63,.45)"
    }
  }, percent, "%"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--px)",
      fontSize: 9,
      letterSpacing: ".5px",
      lineHeight: 1.5,
      color: "var(--text)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, name)), stack && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--term)",
      fontSize: 14,
      color: "var(--faint)",
      marginBottom: 11
    }
  }, stack), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 13
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ProgressBar, {
    value: percent,
    color: barColor
  })), tags.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 7
    }
  }, tags.map((t, i) => typeof t === "string" ? /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    key: i
  }, t) : /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    key: i,
    tone: t.tone
  }, t.label))));
}
Object.assign(__ds_scope, { ProjectCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ProjectCard.jsx", error: String((e && e.message) || e) }); }

// components/game/Achievement.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Achievement — a trophy tile. Locked = desaturated & dim; unlocked = full
 * colour with a gold ring and ★. Optional progress meter for counter trophies.
 */
function Achievement({
  icon = "🏆",
  name,
  desc,
  unlocked = false,
  progress,
  progressLabel,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      textAlign: "center",
      background: "linear-gradient(165deg, var(--card-hi), var(--card))",
      border: "2px solid var(--ink)",
      boxShadow: unlocked ? "0 0 0 2px var(--gold), 0 0 22px -8px rgba(255,210,63,.9)" : "0 0 0 2px var(--frame), 0 0 14px -6px rgba(90,78,168,.55)",
      borderRadius: 0,
      padding: "16px 14px",
      opacity: unlocked ? 1 : 0.55,
      filter: unlocked ? "none" : "saturate(.4)",
      ...style
    }
  }, rest), unlocked && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 8,
      right: 10,
      color: "var(--gold-2)",
      fontSize: 15,
      textShadow: "0 0 8px rgba(255,210,63,.8)"
    }
  }, "\u2605"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 34,
      filter: unlocked ? "none" : "grayscale(1) opacity(.45)"
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--px)",
      fontSize: 8.5,
      letterSpacing: ".5px",
      marginTop: 11,
      lineHeight: 1.5,
      color: "var(--text)"
    }
  }, name), desc && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--term)",
      fontSize: 14,
      color: "var(--muted)",
      marginTop: 6,
      lineHeight: 1.3
    }
  }, desc), progress != null && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ProgressBar, {
    value: progress,
    color: "var(--gold)",
    height: 8
  }), progressLabel && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--term)",
      fontSize: 14,
      color: "var(--faint)",
      marginTop: 6
    }
  }, progressLabel)));
}
Object.assign(__ds_scope, { Achievement });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/game/Achievement.jsx", error: String((e && e.message) || e) }); }

// components/game/Coin.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Coin — the golden XP token. Radial gold gradient, dark pixel label, glow.
 * Used as the quest reward chip (shows XP) and anywhere the economy surfaces.
 */
function Coin({
  children = "XP",
  size = 40,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      flex: "0 0 auto",
      width: size,
      height: size,
      display: "grid",
      placeItems: "center",
      textAlign: "center",
      fontFamily: "var(--px)",
      fontSize: size <= 40 ? 7.5 : 9,
      color: "#3a2a00",
      background: "radial-gradient(circle at 35% 30%, var(--gold-2), var(--gold) 65%, #c98f1b)",
      border: "2px solid #8a6200",
      boxShadow: "0 0 12px -2px rgba(255,210,63,.75)",
      borderRadius: 0,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Coin });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/game/Coin.jsx", error: String((e && e.message) || e) }); }

// components/game/MissionCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MissionCard — a tiered objective (Night/Blood/Ember Hunt). The tier drives a
 * coloured frame ring + glow and the tier label colour; XP sits top-right.
 */
function MissionCard({
  tier = "red",
  tierLabel,
  title,
  xp,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const tiers = {
    red: {
      c: "var(--red)",
      glow: "rgba(255,71,87,.8)",
      label: tierLabel || "NIGHT HUNT"
    },
    orange: {
      c: "var(--orange)",
      glow: "rgba(255,165,2,.8)",
      label: tierLabel || "BLOOD HUNT"
    },
    yellow: {
      c: "var(--yellow)",
      glow: "rgba(255,225,77,.7)",
      label: tierLabel || "EMBER HUNT"
    }
  };
  const t = tiers[tier];
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: "relative",
      background: "linear-gradient(165deg, var(--card-hi), var(--card))",
      boxShadow: `0 0 0 2px ${t.c}, 0 0 16px -6px ${t.glow}`,
      borderRadius: 0,
      padding: "13px 14px",
      cursor: onClick ? "pointer" : "default",
      transform: hover ? "translateY(-2px)" : "none",
      transition: "transform .12s",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--px)",
      fontSize: 6.5,
      letterSpacing: "1.5px",
      color: t.c
    }
  }, t.label), xp != null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 10,
      right: 12,
      fontFamily: "var(--px)",
      fontSize: 8,
      color: "var(--gold-2)",
      textShadow: "0 0 8px rgba(255,210,63,.6)"
    }
  }, xp), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--term)",
      fontSize: 17,
      color: "var(--text)",
      marginTop: 7,
      lineHeight: 1.25
    }
  }, title));
}
Object.assign(__ds_scope, { MissionCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/game/MissionCard.jsx", error: String((e && e.message) || e) }); }

// components/game/QuestItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * QuestItem — one actionable task row. XP coin on the left, body (title, insight,
 * project, action buttons) on the right. `done` strikes it through and dims it.
 */
function QuestItem({
  title,
  xp = 100,
  insight,
  project,
  age,
  ageOld = false,
  done = false,
  actions,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      gap: 12,
      padding: 11,
      background: "var(--card)",
      border: "2px solid var(--ink)",
      boxShadow: `0 0 0 1px ${hover ? "var(--frame-hi)" : "var(--frame)"}`,
      borderRadius: 0,
      opacity: done ? 0.75 : 1,
      transition: "box-shadow .15s",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Coin, null, done ? "✓" : xp), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--term)",
      fontSize: 17,
      lineHeight: 1.25,
      color: "var(--text)",
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap",
      textDecoration: done ? "line-through" : "none",
      textDecorationColor: "var(--faint)"
    }
  }, /*#__PURE__*/React.createElement("span", null, title), age && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--term)",
      fontSize: 13,
      color: ageOld ? "var(--orange)" : "var(--faint)",
      border: `1px solid ${ageOld ? "rgba(255,165,2,.5)" : "var(--frame)"}`,
      padding: "0 6px"
    }
  }, age)), insight && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--term)",
      fontSize: 15,
      color: "var(--muted)",
      marginTop: 3
    }
  }, insight), project && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--term)",
      fontSize: 14,
      color: "var(--faint)",
      marginTop: 4
    }
  }, project), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 9
    }
  }, actions)));
}
Object.assign(__ds_scope, { QuestItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/game/QuestItem.jsx", error: String((e && e.message) || e) }); }

// components/game/SpellCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SCHOOL_COLOR = {
  divination: "var(--cyan)",
  conjuration: "var(--purple)",
  transmutation: "var(--gold)",
  abjuration: "var(--blue)",
  evocation: "var(--red)",
  illusion: "var(--magenta)",
  enchantment: "var(--pink)",
  restoration: "var(--green)"
};
const RARITY_RING = {
  common: "0 0 0 2px var(--frame)",
  uncommon: "0 0 0 2px #1f7a3d",
  rare: "0 0 0 2px #2c5aa8, 0 0 12px -5px var(--blue)",
  epic: "0 0 0 2px #6b2ca8, 0 0 16px -5px var(--purple)",
  legendary: "0 0 0 2px #a8862c, 0 0 20px -4px var(--gold)"
};

/**
 * SpellCard — an executable "spell" (script/skill/chain) from the Grimoire.
 * School tints the left border; rarity escalates the frame ring/glow. Pips show
 * the rarity level. Foot carries cooldown, kind, and the cast button.
 */
function SpellCard({
  icon = "🔮",
  name,
  school = "divination",
  source = "skill",
  rarity = "common",
  cooldown,
  kind = "Ash of War",
  desc,
  onCast,
  disabled = false,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const sch = SCHOOL_COLOR[school] || "var(--frame)";
  const rarityIndex = {
    common: 1,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5
  }[rarity] || 1;
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: "relative",
      background: "linear-gradient(165deg, var(--card-hi), var(--card))",
      border: "2px solid var(--ink)",
      borderLeft: `4px solid ${sch}`,
      boxShadow: RARITY_RING[rarity],
      borderRadius: 0,
      padding: "12px 14px",
      transform: hover ? "translateY(-2px)" : "none",
      transition: "transform .15s cubic-bezier(.22,1,.36,1), box-shadow .15s",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20
    }
  }, icon), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--px)",
      fontSize: 9,
      color: "var(--text)",
      flex: 1,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "var(--gold)",
      letterSpacing: "2px"
    }
  }, "◆".repeat(rarityIndex))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 7,
      fontFamily: "var(--px)",
      fontSize: 6,
      letterSpacing: "1px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: sch
    }
  }, school.toUpperCase()), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--faint)"
    }
  }, source.toUpperCase()), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--faint)"
    }
  }, rarity.toUpperCase())), desc && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: "var(--term)",
      fontSize: 16,
      lineHeight: 1.25,
      color: "var(--muted)",
      maxHeight: 42,
      overflow: "hidden"
    }
  }, desc), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginTop: 9,
      minHeight: 24
    }
  }, cooldown && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--term)",
      fontSize: 15,
      color: "var(--cyan)"
    }
  }, "\u23F2 ", cooldown), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--term)",
      fontSize: 15,
      color: "var(--faint)"
    }
  }, kind), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    size: "sm",
    onClick: onCast,
    disabled: disabled
  }, "CAST"))));
}
Object.assign(__ds_scope, { SpellCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/game/SpellCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/nexus/GrimoireScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// GRIMOIRE — the Spellbook view.
const DSG = window.WorkspaceHQDesignSystem_41e51b;
function GrimoireScreen({
  onCast,
  castLog
}) {
  const {
    SpellCard,
    SectionHeading,
    Button
  } = DSG;
  const schools = ["divination", "conjuration", "transmutation", "abjuration", "evocation", "illusion", "enchantment", "restoration"];
  const [active, setActive] = React.useState("all");
  const spells = [{
    icon: "🔮",
    name: "Deep Scan",
    school: "divination",
    source: "script",
    rarity: "rare",
    cooldown: "15m",
    kind: "Ash of War",
    desc: "Re-scan the whole workspace and regenerate latest.json."
  }, {
    icon: "📜",
    name: "Weekly Saga",
    school: "evocation",
    source: "chain",
    rarity: "epic",
    kind: "Ultimate",
    desc: "Summarise the week's progress into a saga entry."
  }, {
    icon: "🌀",
    name: "Scroll Sorcery",
    school: "illusion",
    source: "skill",
    rarity: "uncommon",
    cooldown: "—",
    kind: "Ash of War",
    desc: "AOS scroll-reveal animation kit, bound as a castable skill."
  }, {
    icon: "🧪",
    name: "Rebuild Data",
    school: "transmutation",
    source: "script",
    rarity: "common",
    kind: "Gadget",
    desc: "Rebuild the renderer data bundle from the latest scan."
  }, {
    icon: "🛡️",
    name: "Secret Sweep",
    school: "abjuration",
    source: "mcp",
    rarity: "rare",
    cooldown: "5m",
    kind: "Gadget",
    desc: "Scan every product for exposed credentials and keys."
  }, {
    icon: "📖",
    name: "Grimoire Index",
    school: "enchantment",
    source: "tome",
    rarity: "legendary",
    kind: "Relic Tome",
    desc: "The master index of every known spell and its lineage."
  }];
  const shown = active === "all" ? spells : spells.filter(s => s.school === active);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeading, {
    color: "var(--gold-2)"
  }, "GRIMOIRE \xB7 SPELL OF THE DAY"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "11px 14px",
      marginBottom: 16,
      background: "linear-gradient(90deg, rgba(255,210,63,.08), transparent 60%), var(--card)",
      border: "2px solid var(--ink)",
      boxShadow: "0 0 0 2px var(--frame), 0 0 16px -6px var(--gold)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--px)",
      fontSize: 8,
      letterSpacing: "1px",
      color: "var(--gold-2)"
    }
  }, "\u2605 TODAY"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22
    }
  }, "\uD83D\uDD2E"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--px)",
      fontSize: 10,
      color: "var(--text)"
    }
  }, "Deep Scan"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: "var(--term)",
      fontSize: 15,
      color: "var(--muted)"
    }
  }, "divination \xB7 +10 bonus runes on cast"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: () => onCast("Deep Scan")
  }, "CAST")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(SchoolChip, {
    label: "all",
    active: active === "all",
    onClick: () => setActive("all"),
    count: spells.length
  }), schools.map(s => /*#__PURE__*/React.createElement(SchoolChip, {
    key: s,
    label: s,
    active: active === s,
    onClick: () => setActive(s),
    count: spells.filter(x => x.school === s).length
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
      gap: 14
    }
  }, shown.map((s, i) => /*#__PURE__*/React.createElement(SpellCard, _extends({
    key: i
  }, s, {
    disabled: castLog.includes(s.name),
    onCast: () => onCast(s.name)
  })))));
}
function SchoolChip({
  label,
  active,
  onClick,
  count
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      fontFamily: "var(--px)",
      fontSize: 7,
      letterSpacing: "1px",
      padding: "7px 10px",
      cursor: "pointer",
      background: active ? "var(--card)" : "var(--ink)",
      color: active ? "var(--cyan)" : hover ? "var(--text)" : "var(--muted)",
      border: `2px solid ${active ? "var(--cyan)" : "var(--frame)"}`,
      boxShadow: active ? "0 0 10px -3px var(--cyan)" : "none",
      textTransform: "uppercase"
    }
  }, label, " ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--text)",
      marginLeft: 4
    }
  }, count));
}
window.GrimoireScreen = GrimoireScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/nexus/GrimoireScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/nexus/Shell.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// NEXUS shell — sigil rail, topstrip (brand + level chip), statusbar.
// Recreation of the WorkspaceHQ v3 console chrome (dashboard-v3/index.html).
const {
  useState
} = React;
function Sigil({
  glyph,
  label,
  active,
  badge,
  onClick
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: 52,
      padding: "8px 2px",
      background: "none",
      border: `1px solid ${active ? "var(--active)" : hover ? "var(--divider)" : "transparent"}`,
      color: active ? "var(--active)" : hover ? "var(--text)" : "var(--muted)",
      fontFamily: "var(--term)",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      lineHeight: 1
    }
  }, glyph), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 7,
      letterSpacing: ".04em",
      textAlign: "center"
    }
  }, label), badge != null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 2,
      right: 2,
      fontSize: 8,
      background: "var(--active)",
      color: "var(--bg)",
      borderRadius: 4,
      padding: "0 3px"
    }
  }, badge));
}
function Shell({
  tab,
  onTab,
  children
}) {
  const tabs = [{
    id: "today",
    glyph: "⌂",
    label: "BASE",
    badge: null
  }, {
    id: "quests",
    glyph: "⚔",
    label: "HUNTS",
    badge: 6
  }, {
    id: "grimoire",
    glyph: "📖",
    label: "SPELLS",
    badge: null
  }, {
    id: "legacy",
    glyph: "★",
    label: "LEGACY",
    badge: null
  }, {
    id: "map",
    glyph: "◈",
    label: "LANDS",
    badge: null
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "64px 1fr 240px",
      height: "100vh",
      background: "var(--bg)",
      color: "var(--text)",
      fontFamily: "var(--term)"
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      background: "var(--panel)",
      borderRight: "1px solid var(--divider)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "8px 0",
      gap: 6
    }
  }, tabs.map(t => /*#__PURE__*/React.createElement(Sigil, _extends({
    key: t.id
  }, t, {
    active: tab === t.id,
    onClick: () => onTab(t.id)
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      borderBottom: "1px solid var(--divider)",
      padding: "8px 16px",
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--px)",
      fontSize: 11,
      letterSpacing: "1px",
      color: "var(--text)"
    }
  }, "WORKSPACE", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--active)"
    }
  }, "HQ")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontFamily: "var(--term)",
      fontSize: 13,
      color: "var(--muted)"
    }
  }, "Personal Ops Console \xB7 scan 2026-06-09"), /*#__PURE__*/React.createElement(LevelChip, {
    level: 4,
    title: "OPERATOR",
    xp: 666,
    into: 66,
    toNext: 234
  })), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: "1 1 auto",
      overflowY: "auto",
      padding: 16
    }
  }, children)), /*#__PURE__*/React.createElement("aside", {
    style: {
      background: "var(--panel)",
      borderLeft: "1px solid var(--divider)",
      padding: 12,
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement(AmbientRail, null)));
}
function LevelChip({
  level,
  title,
  xp,
  into,
  toNext
}) {
  const pct = Math.round(into / (into + toNext) * 100);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--px)",
      fontSize: 9,
      color: "var(--gold-2)",
      letterSpacing: ".5px",
      textShadow: "0 0 9px rgba(255,210,63,.7)"
    }
  }, "L", level), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--px)",
      fontSize: 6.5,
      color: "var(--muted)",
      letterSpacing: "1px",
      marginTop: 3
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 110
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--term)",
      fontSize: 13,
      color: "var(--muted)",
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", null, xp, " runes"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--faint)"
    }
  }, toNext, " to L", level + 1)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      background: "var(--ink)",
      border: "1px solid var(--frame)",
      marginTop: 3,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      height: "100%",
      width: pct + "%",
      background: "linear-gradient(90deg,var(--gold),var(--gold-2))"
    }
  }))));
}
function AmbientRail() {
  const eyebrow = {
    fontFamily: "var(--px)",
    fontSize: 7,
    letterSpacing: "1px",
    color: "var(--faint)",
    textTransform: "uppercase",
    margin: "0 0 8px"
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: eyebrow
  }, "Vitality"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--card)",
      border: "2px solid var(--ink)",
      boxShadow: "0 0 0 2px var(--frame)",
      padding: "12px 13px",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--term)",
      fontSize: 30,
      color: "var(--orange)",
      lineHeight: .8,
      textShadow: "0 0 8px rgba(255,165,2,.6)"
    }
  }, "30", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      color: "var(--faint)"
    }
  }, "/100")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--px)",
      fontSize: 6,
      letterSpacing: "1px",
      color: "var(--muted)",
      marginTop: 8
    }
  }, "HEALTH \xB7 FLAT 5 DAYS")), /*#__PURE__*/React.createElement("p", {
    style: eyebrow
  }, "Spirit Summons"), ["🐦‍⬛ playwright", "🔮 obsidian", "⚙ filesystem"].map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "9px 10px",
      background: "var(--card)",
      border: "2px solid var(--ink)",
      boxShadow: "0 0 0 2px var(--frame)",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--term)",
      fontSize: 15,
      color: "var(--text)"
    }
  }, s), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      width: 6,
      height: 6,
      background: "var(--green)",
      boxShadow: "0 0 6px var(--green)"
    }
  }))));
}
Object.assign(window, {
  Shell,
  Sigil,
  LevelChip,
  AmbientRail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/nexus/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/nexus/TodayScreen.jsx
try { (() => {
// TODAY / Roundtable Hold — the default dashboard view.
const DS = window.WorkspaceHQDesignSystem_41e51b;
function TodayScreen({
  onComplete,
  completed
}) {
  const {
    Kpi,
    MissionCard,
    QuestItem,
    ProjectCard,
    SectionHeading,
    Button,
    Tag
  } = DS;
  const quests = [{
    id: "q1",
    title: "Put almaflowclim under version control",
    insight: "No git repo at all — zero rollback safety.",
    project: "almaflowclim · Static HTML/CSS",
    age: "7d"
  }, {
    id: "q2",
    title: "Commit 26 dirty files in bruns-logistics",
    insight: "Working tree unsaved for 36 days.",
    project: "bruns-logistics · Flask · HTMX",
    age: "36d",
    ageOld: true
  }, {
    id: "q3",
    title: "Commit + push etoile-de-lest",
    insight: "Git exists, 0 commits, no remote.",
    project: "etoile-de-lest · Next.js 14 · PWA",
    age: "4d"
  }];
  const projects = [{
    name: "doctor-cherfia-clinic",
    stack: "Next.js · TS · shadcn",
    rail: "var(--red)",
    bar: "var(--orange)",
    xp: "L1 · 60 XP",
    tags: [{
      label: "active 15d",
      tone: "green"
    }, {
      label: "git high",
      tone: "red"
    }]
  }, {
    name: "hamma-sat",
    stack: "Node (no-dep) · static",
    rail: "var(--red)",
    bar: "var(--orange)",
    xp: "L1 · 60 XP",
    tags: [{
      label: "active",
      tone: "green"
    }, {
      label: "no-git",
      tone: "red"
    }]
  }, {
    name: "crucix",
    stack: "Node · Express · OSINT",
    rail: "var(--green)",
    bar: "var(--green)",
    xp: "L2 · 150 XP",
    tags: [{
      label: "dormant 71d",
      tone: "blue"
    }, {
      label: "git low",
      tone: "green"
    }]
  }, {
    name: "alliance-travel",
    stack: "Static + CF Pages",
    rail: "var(--green)",
    bar: "var(--green)",
    xp: "L2 · 150 XP",
    tags: [{
      label: "active today",
      tone: "green"
    }, {
      label: "git low",
      tone: "green"
    }]
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeading, {
    color: "var(--gold-2)"
  }, "TODAY \xB7 THE HUNT"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
      gap: 14,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(MissionCard, {
    tier: "red",
    title: "Clear all 6 red quests to move the health index for the first time in 5 days.",
    xp: "+100 XP"
  }), /*#__PURE__*/React.createElement(MissionCard, {
    tier: "orange",
    title: "4 products have no version control or zero commits.",
    xp: "+60 XP"
  }), /*#__PURE__*/React.createElement(MissionCard, {
    tier: "yellow",
    title: "Run the LLM enrichment pass \u2014 every project is stuck at carried 50%.",
    xp: "+30 XP"
  })), /*#__PURE__*/React.createElement(SectionHeading, null, "VITALS"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(132px,1fr))",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Kpi, {
    value: 30,
    label: "Health Index",
    accent: "var(--orange)",
    delta: "\u2192",
    trend: "flat"
  }), /*#__PURE__*/React.createElement(Kpi, {
    value: 666,
    label: "Runes \xB7 XP",
    accent: "var(--gold)",
    delta: "+100",
    trend: "up"
  }), /*#__PURE__*/React.createElement(Kpi, {
    value: 5,
    label: "Ember \xB7 Streak",
    accent: "var(--red)",
    delta: "+1",
    trend: "up"
  }), /*#__PURE__*/React.createElement(Kpi, {
    value: completed.length ? 6 - completed.length : 6,
    label: "Open Red Quests",
    accent: "var(--red)",
    delta: completed.length ? `-${completed.length}` : "0",
    trend: completed.length ? "up" : "flat"
  }), /*#__PURE__*/React.createElement(Kpi, {
    value: 9,
    label: "Products",
    accent: "var(--blue)",
    delta: "0",
    trend: "flat"
  })), /*#__PURE__*/React.createElement(SectionHeading, {
    count: 6 - completed.length,
    color: "var(--red)"
  }, "RED HUNTS"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 10
    }
  }, quests.map(q => /*#__PURE__*/React.createElement(QuestItem, {
    key: q.id,
    title: q.title,
    xp: 100,
    insight: q.insight,
    project: q.project,
    age: q.age,
    ageOld: q.ageOld,
    done: completed.includes(q.id),
    actions: completed.includes(q.id) ? /*#__PURE__*/React.createElement(Tag, {
      tone: "green"
    }, "\u2713 completed \xB7 +100 runes") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "success",
      onClick: () => onComplete(q.id)
    }, "\u2713 COMPLETE"), /*#__PURE__*/React.createElement(Button, {
      size: "sm"
    }, "FOCUS"), /*#__PURE__*/React.createElement(Button, {
      size: "sm"
    }, "SNOOZE"))
  }))), /*#__PURE__*/React.createElement(SectionHeading, {
    count: 9
  }, "PORTFOLIO"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
      gap: 16
    }
  }, projects.map((p, i) => /*#__PURE__*/React.createElement(ProjectCard, {
    key: i,
    name: p.name,
    percent: 50,
    stack: p.stack,
    railColor: p.rail,
    barColor: p.bar,
    xp: p.xp,
    tags: p.tags,
    onClick: () => {}
  }))));
}
window.TodayScreen = TodayScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/nexus/TodayScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Kpi = __ds_scope.Kpi;

__ds_ns.ProjectCard = __ds_scope.ProjectCard;

__ds_ns.Achievement = __ds_scope.Achievement;

__ds_ns.Coin = __ds_scope.Coin;

__ds_ns.MissionCard = __ds_scope.MissionCard;

__ds_ns.QuestItem = __ds_scope.QuestItem;

__ds_ns.SpellCard = __ds_scope.SpellCard;

})();
