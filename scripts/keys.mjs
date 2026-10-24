#!/usr/bin/env node
/**
 * Keyboard, motion and direction gate — `npm run keys`. Self-hosting; exits
 * non-zero on any failure.
 *
 * Every page in site.mjs PAGES (each needs an entry in SPEC below, so a new
 * page is classified rather than silently skipped), in French and Arabic where
 * the page has them, at 1280x900 and on a 390x844 phone. The keyboard drives:
 * Tab, Shift+Tab, Enter, Escape and the arrows. Where a test starts deep in
 * the page it focuses that control first, then carries on with keys only.
 *
 *  skip link      the first Tab stop; on screen and on top once focused;
 *                 Enter moves focus to the page's <main> (404 is exempt: it
 *                 is one short block)
 *  focus ring     each of the first 25 Tab stops shows a ring when focused
 *                 (a non-empty outline, or a box-shadow other than its
 *                 unfocused one) and is rendered inside the viewport
 *  phone menu     (index) Enter opens it and focus moves in; Tab and
 *                 Shift+Tab stay inside; everything behind it is inert;
 *                 Escape closes it and focus returns to the toggle; Enter on
 *                 one of its links closes it and the next Tab continues from
 *                 that section, not from the top or the hidden menu
 *  theme menu     (index) ArrowDown opens it on the checked theme, ArrowUp
 *                 on the last; arrows, Home and End move; Escape closes and
 *                 refocuses the button; Tab closes it; Enter applies a theme
 *  CV panel       (index) Enter toggles aria-expanded; open, Tab reaches its
 *                 link and the link is visible; closed, it is inert
 *  contact form   (index) submitted empty: every field aria-invalid, focus
 *                 on the first, each field's aria-describedby names a polite
 *                 live error with text in the page's language; typing clears
 *                 a field's error; a malformed email gets its own message
 *  dialogs        hub's lightbox and scene/'s capture viewer open with Enter,
 *                 close with Escape and give focus back; Tab never leaves
 *                 them for the page behind; the lightbox's arrows follow the
 *                 reading direction (forward is ArrowLeft when it is RTL).
 *                 scene/'s viewer shows one capture and has no arrow keys
 *                 (the 2026-07 audit's A-04 was about arrows it no longer has)
 *  embeds         (workspacehq/) Tab from the stop before the trailer or the
 *                 walkthrough, with the frame below the fold, lands in it and
 *                 its focused control is on screen; a click (a tap on the
 *                 phone) into one that is only 35% on screen does not scroll
 *                 the page
 *  reduced motion prefers-reduced-motion: reduce emulated, the site's own
 *                 handling only (nothing injected, nothing killed): nothing
 *                 that reveals on scroll is hidden at load; once the network
 *                 is idle and a key has woken the page, no script writes
 *                 styles, classes or text for 6s (rotations, cyclers,
 *                 parallax, counters), and then no infinite or long (>1s
 *                 left) animation is running
 *  direction      ?lang=ar gives html dir="rtl" lang="ar" on every page that
 *                 has Arabic, and still does after the language hold's 1.5s
 *                 fallback; the English-only pages stay ltr
 * A JS error during a run fails it, and so does any Content-Security-Policy
 * violation, from any frame (lib/csp-watch.mjs, shared with audit.mjs). This
 * gate holds the CSP proof for what only it drives: the theme menu, the
 * contact form submitted, hub's lightbox, scene/'s viewer and the embeds
 * taking focus; audit.mjs holds it for page loads, the CV panel, the phone
 * menu, the booted WorkspaceHQ console and the throttled phone's FAQ,
 * estimator, currency and language switches. Optional arg: only the pages
 * whose name contains it (`npm run keys -- hub`; the home page is `index`).
 *
 * Traps the checks are built around (the reveal and the image ones each
 * produced false failures while this was written):
 *  - a box-shadow is no focus ring if the control has the same one at rest
 *    (buttons with a glow), so the unfocused value is read after a blur
 *  - Tab past the last control leaves the document (activeElement = body);
 *    that ends the walk on a short page, and is not "focus escaped" in a
 *    modal dialog, where the browser chrome is the only way out
 *  - a control in a block that reveals on scroll is faded out until Tab
 *    brings it on screen: it gets 1.6s to fade in before it counts as hidden
 *  - Tab goes on into an embed's own controls (workspacehq/): the ring and
 *    the visibility are read inside the frame, and the frame must be on
 *    screen too
 *  - images that finish loading after `load` add a class: the reduced-motion
 *    watch starts once the network is idle, or that reads as motion
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { serve, launch } from './lib/serve.mjs';
import { watchCsp } from './lib/csp-watch.mjs';
import { ROOT, PAGES } from './site.mjs';

/* langs: the languages a page has (`only`: why it has just one); tests: its
   own keyboard paths; noSkip: why it has no skip link */
const SPEC = {
  'index.html': { langs: ['fr', 'ar'], tests: ['theme', 'menu', 'cv', 'form'] },
  'scene/index.html': { langs: ['fr', 'ar'], tests: ['viewer'] },
  'hub/index.html': { langs: ['en'], tests: ['lightbox'], only: "English only (the founder's own page)" },
  'workspacehq/index.html': { langs: ['en'], tests: ['embeds'], only: 'English only (the product page)' },
  '404.html': { langs: ['fr', 'ar'], tests: [], noSkip: 'one short block: the logo and one link' },
  'legal/index.html': { langs: ['fr', 'ar'], tests: [] },
};
const ONLY = process.argv[2];       // optional: only the pages whose name contains this
const name = (f) => (f === 'index.html' ? 'index' : f.replace(/\/index\.html$/, '/'));
const pages = PAGES.slice();
if (existsSync(join(ROOT, 'legal-preview/index.html'))) { pages.push('legal-preview/index.html'); SPEC['legal-preview/index.html'] = SPEC['legal/index.html']; }
if (ONLY) pages.splice(0, pages.length, ...pages.filter((f) => name(f).includes(ONLY)));
const SIZES = [[1280, 900], [390, 844]];
const RING_N = 25;

const srv = await serve();
const B = srv.base;
const b = await launch();
let fails = 0, runs = 0;
const unclassified = pages.filter((f) => !SPEC[f]);
if (unclassified.length) { console.log('FAIL no keys spec for: ' + unclassified.join(', ') + ' (add it to SPEC in scripts/keys.mjs)'); fails++; }

const url = (f, l) => B + '/' + f.replace(/index\.html$/, '') + (l && l !== 'en' ? '?lang=' + l : '');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* page helpers, defined before any page script runs */
const HELPERS = () => {
  window.__d = (e) => {
    if (!e) return 'null';
    if (e === document.body) return 'body';
    let s = e.tagName.toLowerCase();
    if (e.id) s += '#' + e.id; else if (e.classList.length) s += '.' + [...e.classList].slice(0, 2).join('.');
    const t = (e.getAttribute('aria-label') || e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 24);
    return t ? s + ' "' + t + '"' : s;
  };
  window.__op = (e) => { let o = 1; for (let a = e; a && a.nodeType === 1; a = a.parentElement) o *= parseFloat(getComputedStyle(a).opacity); return o; };
  window.__shown = (e) => {
    const r = e.getBoundingClientRect(), s = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && __op(e) > 0.1
      && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
  };
};

async function open(w, h, opts = {}) {
  const touch = w < 600;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch, ...opts });
  const p = await ctx.newPage();
  const errs = [], csp = [];
  p.on('pageerror', (e) => errs.push(String(e).slice(0, 120)));
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)); });
  await watchCsp(p, (u, v) => csp.push((u.replace(B, '').split(/[?#]/)[0] || '/') + ': ' + v));
  await p.addInitScript(HELPERS);
  return { p, errs, csp, close: () => ctx.close() };
}

/* ---------- the tests: each returns a list of problems ([] = pass) ---------- */

async function skipAndRing(p, spec) {
  const bad = [];
  // first Tab stop
  await p.keyboard.press('Tab');
  await wait(450);                  // the skip link slides in (a transform transition)
  if (!spec.noSkip) {
    const s = await p.evaluate(() => {
      const a = document.activeElement, href = a && a.getAttribute('href');
      if (!a || a.tagName !== 'A' || !href || href[0] !== '#') return { err: 'first Tab stop is ' + __d(a) + ', not a skip link' };
      const tgt = document.getElementById(href.slice(1));
      if (!tgt || !tgt.matches('main,[role="main"]')) return { err: 'skip link points at ' + href + ', which is not <main>' };
      const r = a.getBoundingClientRect(), top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      const onScreen = r.width > 0 && r.top >= 0 && r.left >= 0 && r.bottom <= innerHeight && r.right <= innerWidth;
      return { onScreen, onTop: !!top && (top === a || a.contains(top)), text: a.textContent.trim(), op: __op(a) };
    });
    if (s.err) bad.push(s.err);
    else {
      if (!s.onScreen) bad.push('skip link not inside the viewport when focused');
      if (!s.onTop) bad.push('skip link covered by another element when focused');
      if (s.op < 0.9) bad.push('skip link translucent when focused (' + s.op.toFixed(2) + ')');
      if (!s.text) bad.push('skip link has no text');
    }
  }
  // the first RING_N stops: ring when focused, unfocused value read afterwards.
  // Tab goes into an embed's own controls; those are read inside its frame.
  const seen = [];
  for (let i = 0; i < RING_N; i++) {
    if (i) { await p.keyboard.press('Tab'); await wait(60); }
    let h = await p.evaluateHandle(() => document.activeElement), frame = null;
    for (let depth = 0; depth < 3 && (await h.evaluate((e) => !!e && e.tagName === 'IFRAME')); depth++) {
      const fr = await h.asElement().contentFrame();
      const inner = fr && (await fr.evaluateHandle(() => document.activeElement));
      if (!inner || (await inner.evaluate((e) => !e || e === document.body))) break;   // the frame itself holds focus
      frame = frame || h; h = inner;
    }
    const r = await h.evaluate((e, firstSeen) => {
      if (!e || e === document.body || e === document.documentElement) return { end: true };
      if (firstSeen && e === firstSeen) return { end: true };      // wrapped round
      const s = getComputedStyle(e);
      const clear = /^transparent$|rgba\([^)]*,\s*0\)$/.test(s.outlineColor);
      return { d: __d(e), tag: e.tagName, outline: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0 && !clear, shadow: s.boxShadow, shown: __shown(e) };
    }, seen[0] ? seen[0].h : null);
    if (r.end) { await h.dispose(); break; }
    // a control in a block that reveals on scroll fades in once Tab brings it
    // on screen (1s plus a stagger): give it that long before calling it hidden
    const shown = async () => (await h.evaluate((e) => __shown(e))) && (!frame || (await frame.evaluate((e) => __shown(e))));
    r.shown = r.shown && (!frame || (await frame.evaluate((e) => __shown(e))));
    for (let t = 0; !r.shown && t < 16; t++) { await wait(100); r.shown = await shown(); }
    if (frame) r.d = 'iframe ' + (await frame.evaluate((e) => e.getAttribute('src'))) + ' › ' + r.d;
    seen.push({ h, frame, ...r });
  }
  await p.evaluate(() => document.activeElement && document.activeElement.blur && document.activeElement.blur());
  await wait(450);                  // let box-shadow transitions settle back
  let byShadow = 0, frames = 0;
  for (const x of seen) {
    if (x.frame) frames++;
    const rest = await x.h.evaluate((e) => getComputedStyle(e).boxShadow);
    const glow = x.shadow !== 'none' && x.shadow !== rest;
    if (!x.outline && glow) byShadow++;
    if (!x.outline && !glow) bad.push('no focus ring on ' + x.d);
    if (!x.shown) bad.push('focus lands on something not visible: ' + x.d);
  }
  const n = seen.length;
  // Enter on the skip link moves focus to <main>
  if (n && !spec.noSkip && !bad.some((m) => m.startsWith('first Tab') || m.startsWith('skip link points'))) {
    await p.evaluate(() => scrollTo(0, 0));
    await seen[0].h.evaluate((a) => a.focus());
    await p.keyboard.press('Enter');
    await wait(300);
    const m = await p.evaluate(() => { const a = document.activeElement; return { ok: !!a && a.matches('main,[role="main"]'), d: __d(a) }; });
    if (!m.ok) bad.push('Enter on the skip link leaves focus on ' + m.d + ', not <main>');
  }
  for (const x of seen) { await x.h.dispose(); if (x.frame) await x.frame.dispose(); }
  return { bad, note: `ring ${n}` + (byShadow || frames ? ` (${[byShadow && byShadow + ' by glow', frames && frames + ' in an embed'].filter(Boolean).join(', ')})` : '') };
}

async function themeMenu(p) {
  const bad = [];
  const st = () => p.evaluate(() => {
    const m = document.querySelector('.theme-menu'), btn = document.querySelector('.theme-btn');
    const items = [...m.querySelectorAll('[role="menuitemradio"]')];
    return { open: m.classList.contains('open'), exp: btn.getAttribute('aria-expanded'), i: items.indexOf(document.activeElement),
      onBtn: document.activeElement === btn, checked: items.findIndex((x) => x.getAttribute('aria-checked') === 'true'), n: items.length,
      theme: document.documentElement.getAttribute('data-theme'), val: items.map((x) => x.getAttribute('data-theme-val')) };
  });
  const shown = await p.evaluate(() => { const x = document.querySelector('.theme-btn'); return !!x && x.offsetParent !== null; });
  if (!shown) return { bad: ['theme button not rendered'], note: 'theme' };
  await p.focus('.theme-btn');
  await p.keyboard.press('ArrowDown'); let s = await st();
  if (!s.open || s.exp !== 'true') bad.push('ArrowDown on the button does not open the menu');
  if (s.i !== s.checked) bad.push('opening does not focus the checked theme (focus on item ' + s.i + ')');
  await p.keyboard.press('ArrowDown'); s = await st();
  if (s.i !== (s.checked + 1) % s.n) bad.push('ArrowDown does not move to the next theme');
  await p.keyboard.press('ArrowUp'); s = await st();
  if (s.i !== s.checked) bad.push('ArrowUp does not move back');
  await p.keyboard.press('End'); s = await st();
  if (s.i !== s.n - 1) bad.push('End does not reach the last theme');
  await p.keyboard.press('Home'); s = await st();
  if (s.i !== 0) bad.push('Home does not reach the first theme');
  await p.keyboard.press('Escape'); s = await st();
  if (s.open || s.exp !== 'false' || !s.onBtn) bad.push('Escape does not close the menu and refocus the button');
  await p.keyboard.press('ArrowUp'); s = await st();
  if (!s.open || s.i !== s.n - 1) bad.push('ArrowUp on the button does not open on the last theme');
  await p.keyboard.press('Tab'); s = await st();
  if (s.open) bad.push('Tab does not close the menu');
  await p.focus('.theme-btn');
  await p.keyboard.press('Enter'); await p.keyboard.press('ArrowDown'); s = await st();
  const want = s.val[s.i];
  await p.keyboard.press('Enter'); s = await st();
  if (s.theme !== want || s.open || !s.onBtn) bad.push('Enter on a theme does not apply it, close and refocus the button');
  return { bad, note: 'theme' };
}

async function phoneMenu(p, w) {
  const bad = [];
  const shown = await p.evaluate(() => { const t = document.querySelector('.menu-toggle'); return !!t && t.offsetParent !== null; });
  if (!shown) return { bad: w < 600 ? ['menu toggle not rendered on a phone'] : [], note: w < 600 ? 'menu' : 'menu n/a' };
  const st = () => p.evaluate(() => {
    const m = document.querySelector('.mobile-menu'), t = document.querySelector('.menu-toggle');
    const behind = [...document.body.children].filter((el) => el !== m && !el.contains(m) && el.tagName !== 'SCRIPT');
    return { open: m.classList.contains('open'), exp: t.getAttribute('aria-expanded'), inside: m.contains(document.activeElement),
      onToggle: document.activeElement === t, a: __d(document.activeElement),
      live: behind.filter((el) => !el.closest('[inert]')).map(__d), dead: behind.filter((el) => el.closest('[inert]')).length,
      n: [...m.querySelectorAll('a[href],button:not([disabled])')].filter((e) => e.offsetParent !== null).length };
  });
  await p.focus('.menu-toggle');
  await p.keyboard.press('Enter'); await wait(400);
  let s = await st();
  if (!s.open || s.exp !== 'true') bad.push('Enter on the toggle does not open the menu');
  if (!s.inside) bad.push('opening leaves focus outside the menu (' + s.a + ')');
  if (s.live.length) bad.push('not inert behind the open menu: ' + s.live.join(', '));
  for (const [key, label] of [['Tab', 'Tab'], ['Shift+Tab', 'Shift+Tab']]) {
    for (let i = 0; i < s.n + 2; i++) {
      await p.keyboard.press(key);
      const x = await st();
      if (!x.inside) { bad.push(label + ' leaves the open menu (focus on ' + x.a + ')'); break; }
    }
  }
  await p.keyboard.press('Escape'); await wait(100);
  s = await st();
  if (s.open || s.exp !== 'false') bad.push('Escape does not close the menu');
  if (!s.onToggle) bad.push('closing does not return focus to the toggle (' + s.a + ')');
  if (s.dead) bad.push(s.dead + ' element(s) still inert after closing');
  // a link in the menu: closes it, and the next Tab continues from its section
  await p.keyboard.press('Enter'); await wait(400);
  await p.focus('.mobile-menu a[href="#contact"]');
  await p.keyboard.press('Enter'); await wait(900);
  s = await st();
  if (s.open || s.dead) bad.push('Enter on a menu link does not close the menu');
  await p.keyboard.press('Tab');
  const nx = await p.evaluate(() => {
    const a = document.activeElement, sec = document.querySelector('#contact');
    return { d: __d(a), ok: !!a && a !== document.body && !a.closest('.mobile-menu') && (sec.contains(a) || !!(sec.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING)) };
  });
  if (!nx.ok) bad.push('after a menu link to #contact, Tab goes to ' + nx.d + ' instead of continuing from #contact');
  return { bad, note: 'menu' };
}

async function cvPanel(p) {
  const bad = [];
  const st = () => p.evaluate(() => {
    const t = document.querySelector('#cv-toggle'), c = document.querySelector('#cv-panel');
    const a = document.activeElement;
    return { exp: t.getAttribute('aria-expanded'), inert: !!c.closest('[inert]'), inPanel: c.contains(a), shown: c.contains(a) && __shown(a), a: __d(a),
      links: c.querySelectorAll('a[href],button').length };
  });
  await p.focus('#cv-toggle');
  let s = await st();
  if (s.exp !== 'false' || !s.inert) bad.push('the closed panel is not aria-expanded=false and inert');
  if (!s.links) bad.push('the panel holds nothing focusable to test');
  await p.keyboard.press('Enter'); await wait(800);
  s = await st();
  if (s.exp !== 'true' || s.inert) bad.push('Enter does not open the panel (aria-expanded ' + s.exp + ', inert ' + s.inert + ')');
  let reached = false;
  for (let i = 0; i < 6 && !reached; i++) {
    await p.keyboard.press('Tab'); await wait(60);
    s = await st();
    if (s.inPanel) {
      reached = true;
      for (let t = 0; !s.shown && t < 16; t++) { await wait(100); s = await st(); }
      if (!s.shown) bad.push('focus in the open panel is not visible: ' + s.a);
    }
  }
  if (!reached) bad.push('Tab does not reach the open panel');
  await p.focus('#cv-toggle');
  await p.keyboard.press('Enter'); await wait(800);
  s = await st();
  if (s.exp !== 'false' || !s.inert) bad.push('Enter does not close the panel again');
  return { bad, note: 'cv' };
}

async function contactForm(p, lang) {
  const bad = [];
  const F = ['f-name', 'f-email', 'f-message'];
  const st = () => p.evaluate((F) => F.map((id) => {
    const f = document.getElementById(id);
    const ids = (f.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    const errs = ids.map((x) => document.getElementById(x)).filter((e) => e && e.classList.contains('err'));
    const e = errs[0];
    return { id, inv: f.getAttribute('aria-invalid'), focused: document.activeElement === f, a: __d(document.activeElement),
      err: !!e, text: e ? e.textContent.trim() : '', live: e ? e.getAttribute('aria-live') : null,
      rendered: !!e && e.getClientRects().length > 0 };
  }), F);
  const submit = () => p.focus('#contact-form [type="submit"]').then(() => p.keyboard.press('Enter')).then(() => wait(150));
  await submit();
  let s = await st();
  for (const x of s) {
    if (x.inv !== 'true') bad.push(x.id + ' not aria-invalid after an empty submit');
    if (!x.err) bad.push(x.id + ': aria-describedby names no error element');
    else {
      if (!x.text) bad.push(x.id + ': error text is empty');
      if (x.live !== 'polite') bad.push(x.id + ': error is not aria-live="polite"');
      if (!x.rendered) bad.push(x.id + ': error not rendered');
      const arabic = /[\u0600-\u06FF]/.test(x.text);
      if (x.text && (lang === 'ar') !== arabic) bad.push(x.id + ': error not in the page language ("' + x.text.slice(0, 30) + '")');
    }
  }
  if (!s[0].focused) bad.push('focus is not on the first invalid field (on ' + s[0].a + ')');
  const emptyEmail = s[1].text;
  // typing clears that field; a malformed email gets its own message and focus
  await p.focus('#f-name'); await p.keyboard.type('Test');
  await p.focus('#f-email'); await p.keyboard.type('x@y');
  s = await st();
  if (s[0].inv || s[0].text) bad.push('typing in f-name does not clear its error');
  await submit();
  s = await st();
  if (!s[1].focused) bad.push('with only the email wrong-ish, focus is not on f-email (on ' + s[1].a + ')');
  if (s[1].inv !== 'true' || !s[1].text || s[1].text === emptyEmail) bad.push('a malformed email does not get its own error');
  if (s[2].inv !== 'true') bad.push('the empty message is no longer flagged');
  return { bad, note: 'form' };
}

async function dialog(p, kind) {
  const bad = [];
  const D = kind === 'lightbox' ? { dlg: '#lb', opener: '#collection .tile--img', title: '#lbTitle' } : { dlg: '#viewer', opener: 'a.zoom', title: null };
  const idx = await p.evaluate((D) => [...document.querySelectorAll(D.opener)].findIndex((a) => a.offsetParent !== null), D);
  if (idx < 0) return { bad: ['no visible ' + D.opener + ' to open the dialog with'], note: kind };
  const opener = (await p.$$(D.opener))[idx];
  await opener.focus();
  await p.keyboard.press('Enter'); await wait(400);
  const st = () => p.evaluate(([D, idx]) => {
    const d = document.querySelector(D.dlg), list = [...document.querySelectorAll(D.opener)], a = document.activeElement;
    return { open: d.open, inside: d.contains(a), body: a === document.body, onOpener: a === list[idx], a: __d(a),
      title: D.title ? document.querySelector(D.title).textContent : null, titles: list.map((x) => x.getAttribute('data-title')),
      dir: getComputedStyle(d).direction, n: [...d.querySelectorAll('a[href],button')].filter((e) => e.offsetParent !== null).length };
  }, [D, idx]);
  let s = await st();
  if (!s.open) return { bad: ['Enter on ' + D.opener + ' does not open ' + D.dlg], note: kind };
  if (!s.inside) bad.push('opening leaves focus outside the dialog (' + s.a + ')');
  let arrows = '';
  if (D.title) {
    const fwd = s.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight', back = s.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    if (s.title !== s.titles[idx]) bad.push('the dialog shows "' + s.title + '", not the piece it was opened on');
    await p.keyboard.press(fwd); s = await st();
    if (s.title !== s.titles[(idx + 1) % s.titles.length]) bad.push(fwd + ' does not go to the next piece in ' + s.dir.toUpperCase());
    await p.keyboard.press(back); s = await st();
    if (s.title !== s.titles[idx]) bad.push(back + ' does not go back in ' + s.dir.toUpperCase());
    arrows = ' ' + s.dir;
  }
  for (let i = 0; i < s.n + 1; i++) {
    await p.keyboard.press('Tab');
    const x = await st();
    if (!x.inside && !x.body) { bad.push('Tab leaves the open dialog for ' + x.a); break; }
  }
  await p.keyboard.press('Escape'); await wait(300);
  s = await st();
  if (s.open) bad.push('Escape does not close the dialog');
  if (!s.onOpener) bad.push('closing does not return focus to the opener (' + s.a + ')');
  return { bad, note: kind + arrows };
}

/* workspacehq/'s trailer and walkthrough: Tab into one that is below the fold
   brings it on screen (the page does that: the player runtime does not), and
   a click or tap into one that is partly on screen leaves the page where it
   is, so what is under the pointer does not slide away. Each starts with focus
   in the host page, on the Tab stop before the frame, as a visitor's would be. */
async function embeds(p, w, h) {
  const bad = [];
  const touch = w < 600;
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  // focus (without scrolling) on the last Tab stop of the host page before the frame
  const focusBefore = (sel) => p.evaluate((sel) => {
    const f = document.querySelector(sel);
    const stops = [...document.querySelectorAll('a[href],button,input,select,textarea,summary,iframe,[tabindex]')].filter((e) => e.tabIndex >= 0 && !e.disabled
      && !e.closest('[inert],[hidden]') && e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden'
      && (e.compareDocumentPosition(f) & Node.DOCUMENT_POSITION_FOLLOWING));
    const a = stops[stops.length - 1];
    if (!a) return null;
    a.focus({ preventScroll: true });
    return document.activeElement === a ? __d(a) : null;
  }, sel);
  const frameAt = (sel) => p.evaluate((sel) => { const r = document.querySelector(sel).getBoundingClientRect(); return { y: r.top + scrollY, top: r.top, bottom: r.bottom, l: r.left, w: r.width, h: r.height, vh: innerHeight }; }, sel);
  for (const [sel, what] of [['#reel iframe', 'trailer'], ['#walkFrame', 'walkthrough']]) {
    const el = p.locator(sel);
    await el.scrollIntoViewIfNeeded();                     // the frames are lazy
    const fr = await (await el.elementHandle()).contentFrame();
    try { await fr.waitForLoadState('load', { timeout: 30000 }); } catch { bad.push('the ' + what + ' did not load'); continue; }
    await wait(1500);
    const prev = await focusBefore(sel);
    if (!prev) { bad.push('no Tab stop before the ' + what + ' to start from'); continue; }
    // pointer: the frame's top 35% at the bottom of the viewport, a click near its top edge
    let f = await frameAt(sel);
    await p.evaluate((y) => scrollTo(0, y), Math.max(0, Math.round(f.y - h + f.h * 0.35)));
    await wait(600);
    const y0 = await p.evaluate(() => scrollY);
    f = await frameAt(sel);
    if (touch) await p.touchscreen.tap(f.l + f.w / 2, Math.min(h - 10, f.top + 30)); else await p.mouse.click(f.l + f.w / 2, Math.min(h - 10, f.top + 30));
    await wait(800);
    const y1 = await p.evaluate(() => scrollY);
    if (Math.abs(y1 - y0) > 1) bad.push(`a ${touch ? 'tap' : 'click'} into the partly visible ${what} scrolls the page (${y0} → ${y1})`);
    // keyboard: back on the stop before it, the frame's top 40px below the fold, then Tab
    await focusBefore(sel);
    await p.evaluate((y) => scrollTo(0, y), Math.max(0, Math.round(f.y - h - 40)));
    await wait(300);
    const below = (await frameAt(sel)).top >= h;
    await p.keyboard.press('Tab');
    await wait(500);
    const inFrame = await p.evaluate((sel) => document.activeElement === document.querySelector(sel), sel);
    if (!inFrame) { bad.push('Tab from ' + prev + ' goes to ' + (await p.evaluate(() => __d(document.activeElement))) + ', not into the ' + what); continue; }
    // the control that took focus inside the frame, in page coordinates
    f = await frameAt(sel);
    const inner = await fr.evaluate(() => { const a = document.activeElement, r = a.getBoundingClientRect(); return { body: a === document.body, top: r.top, bottom: r.bottom, d: __d(a) }; });
    const t = inner.body ? f.top : f.top + inner.top, bt = inner.body ? f.bottom : f.top + inner.bottom;
    if (!below) bad.push('could not put the ' + what + ' below the fold to test Tab');
    else if (!(t >= 0 && bt <= f.vh)) bad.push(`Tab into the ${what} leaves its focus off screen (${inner.d} at ${Math.round(t)}–${Math.round(bt)}, viewport ${f.vh})`);
  }
  return { bad, note: 'embeds' };
}

async function direction(p, spec, lang, when) {
  const d = await p.evaluate(() => ({ dir: document.documentElement.getAttribute('dir') || 'ltr', lang: document.documentElement.getAttribute('lang'), css: getComputedStyle(document.body).direction }));
  const has = spec.langs.includes(lang);
  const wantLang = has ? lang : spec.langs[0];
  const wantDir = wantLang === 'ar' ? 'rtl' : 'ltr';
  const bad = [];
  if (d.dir !== wantDir || d.css !== wantDir || d.lang !== wantLang) bad.push(`${when}: dir=${d.dir} (css ${d.css}) lang=${d.lang}, want dir=${wantDir} lang=${wantLang}`);
  return bad;
}

/* ---------- the runs ---------- */
const report = (label, results, errs, csp) => {
  runs++;
  const bad = results.flatMap((r) => r.bad);
  if (errs.length) bad.push('js: ' + errs.join(' | '));
  if (csp.length) bad.push('csp: ' + [...new Set(csp)].join(' | '));
  if (bad.length) fails++;
  console.log((bad.length ? 'FAIL ' : '  ok ') + label.padEnd(24) + results.map((r) => r.note).filter(Boolean).join('  '));
  for (const m of bad) console.log('       ' + m);
};

console.log('— keyboard —');
for (const f of pages) {
  const spec = SPEC[f]; if (!spec) continue;
  for (const lang of spec.langs) for (const [w, h] of SIZES) {
    const { p, errs, csp, close } = await open(w, h);
    await p.goto(url(f, lang), { waitUntil: 'networkidle' });
    const out = [{ bad: await direction(p, spec, lang, 'at load'), note: '' }];
    out.push(await skipAndRing(p, spec));
    for (const t of spec.tests) {
      await p.evaluate(() => { document.activeElement && document.activeElement.blur && document.activeElement.blur(); scrollTo(0, 0); });
      if (t === 'theme') out.push(await themeMenu(p));
      else if (t === 'menu') out.push(await phoneMenu(p, w));
      else if (t === 'cv') out.push(await cvPanel(p));
      else if (t === 'form') out.push(await contactForm(p, lang));
      else if (t === 'embeds') out.push(await embeds(p, w, h));
      else out.push(await dialog(p, t));
    }
    out.push({ bad: await direction(p, spec, lang, 'after the tests'), note: 'dir ' + (lang === 'ar' ? 'rtl' : 'ltr') });
    report(`${name(f)} ${lang} ${w}`, out, errs, csp);
    await close();
  }
}

console.log('— reduced motion (the site\'s own handling) —');
for (const f of pages) {
  const spec = SPEC[f]; if (!spec) continue;
  for (const lang of spec.langs) for (const [w, h] of SIZES) {
    const { p, errs, csp, close } = await open(w, h, { reducedMotion: 'reduce' });
    await p.goto(url(f, lang), { waitUntil: 'load' });
    const rv = await p.evaluate(() => {
      const all = [...document.querySelectorAll('.reveal,[data-reveal]')];
      const hidden = all.filter((e) => getComputedStyle(e).display !== 'none' && !e.closest('[hidden],dialog:not([open])')
        && (__op(e) < 0.99 || getComputedStyle(e).visibility === 'hidden')).map(__d);
      // what script still moves: rotations, cyclers, parallax and counters
      // write styles, classes or text; with reduced motion none of them run
      window.__mut = {};
      new MutationObserver((list) => { for (const r of list) { const k = __d(r.target.nodeType === 1 ? r.target : r.target.parentElement) + ' ' + (r.attributeName || r.type); __mut[k] = (__mut[k] || 0) + 1; } })
        .observe(document.body, { subtree: true, attributes: true, characterData: true, childList: true });
      return { n: all.length, hidden };
    });
    // images still arriving after load mark themselves loaded (a class, no
    // motion with reduced motion on): the watch starts once the network is
    // idle. The hero deck waits for the visitor's first input before it
    // turns, so a key wakes the page, and the watch outlasts its 5.2s turn.
    await p.waitForLoadState('networkidle');
    await p.keyboard.press('Shift');
    await p.evaluate(() => { window.__mut = {}; });
    await wait(6000);
    const anim = await p.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').map((a) => {
      const t = a.effect.getComputedTiming();
      return { what: (a.animationName || a.transitionProperty || 'script') + ' on ' + __d(a.effect.target), inf: t.iterations === Infinity, left: t.endTime - (a.currentTime || 0) };
    }).filter((x) => x.inf || x.left > 1000));
    const mut = Object.entries(await p.evaluate(() => __mut));
    const bad = [];
    if (rv.hidden.length) bad.push('hidden at load: ' + rv.hidden.slice(0, 6).join(', ') + (rv.hidden.length > 6 ? ' +' + (rv.hidden.length - 6) : ''));
    for (const a of anim) bad.push('still running: ' + a.what + (a.inf ? ' (infinite)' : ` (${Math.round(a.left)}ms left)`));
    if (mut.length) bad.push('script still moving things: ' + mut.slice(0, 5).map(([k, n]) => k + ' ×' + n).join(', ') + (mut.length > 5 ? ' +' + (mut.length - 5) : ''));
    report(`${name(f)} ${lang} ${w} rm`, [{ bad, note: `reveals ${rv.n - rv.hidden.length}/${rv.n} shown  anim ${anim.length}  moved ${mut.length}` }], errs, csp);
    await close();
  }
}

console.log('— direction: ?lang=ar on every page —');
for (const f of pages) {
  const spec = SPEC[f]; if (!spec) continue;
  const { p, errs, csp, close } = await open(1280, 900);
  await p.goto(B + '/' + f.replace(/index\.html$/, '') + '?lang=ar', { waitUntil: 'load' });
  await wait(1700);                 // past the generated pages' 1.5s hold fallback
  const bad = await direction(p, spec, 'ar', '?lang=ar');
  report(`${name(f)} ?lang=ar`, [{ bad, note: spec.langs.includes('ar') ? 'rtl' : 'ltr, ' + spec.only }], errs, csp);
  await close();
}

await b.close(); srv.close();
console.log(fails ? `\nFAILURES: ${fails} of ${runs}` : `\nALL CLEAN (${runs} runs)`);
process.exit(fails ? 1 : 0);
