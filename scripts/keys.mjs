#!/usr/bin/env node
/**
 * Keyboard, motion and direction gate — `npm run keys`. Self-hosting; exits
 * non-zero on any failure.
 *
 * Every page in site.mjs PAGES (each needs an entry in SPEC below, so a new
 * page is classified rather than silently skipped), in each language it has
 * (the home page and the price guide are one page per language: index.html
 * French, en/, ar/, tarifs/ and its en/, ar/; the pages that switch in
 * place, in French and Arabic), at 1280x900 and on a
 * 390x844 phone. The keyboard drives:
 * Tab, Shift+Tab, Enter, Escape and the arrows. Where a test starts deep in
 * the page it focuses that control first, then carries on with keys only.
 *
 *  skip link      the first Tab stop; on screen and on top once focused;
 *                 it points at the page's <main> or a block inside it,
 *                 Enter moves focus there, and the next Tab lands past the
 *                 stop that follows the skip link anyway (404 is exempt: it
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
 *                 refocuses the button; Tab closes it; Enter applies a theme.
 *                 The page carries two pickers: the header's, and the phone
 *                 menu's, which takes over below 960px (the header's is
 *                 display:none there to make room for the language switch).
 *                 The one driven is the one rendered: on the phone the menu
 *                 is opened first (Enter on the toggle), the picker inside
 *                 it keeps the same contract with the menu open around it
 *                 (Escape closes the picker alone, Enter leaves the menu
 *                 open), and one more Escape closes the menu
 *  CV panel       (index) Enter toggles aria-expanded; open, Tab reaches its
 *                 link and the link is visible; closed, it is inert
 *  estimate       (index) Enter opens the folded estimator; Enter on its
 *                 "prix ferme" link hands the scope to the message, type and
 *                 size first (price.tyCustom · …), then the range; a type
 *                 chosen with Space and handed again, then the estimator
 *                 folded and the currency switched: the untouched message
 *                 still starts with that type, now in €. On the price guide
 *                 (tarifs/), where the estimator is open at load and there is
 *                 no form, Enter on the link lands on that language's home
 *                 page at #contact with the same scope in the message, under
 *                 a greeting line (price.estHello), and nothing left in
 *                 sessionStorage (the hand-off, app.js)
 *  contact form   (index) submitted empty: every field aria-invalid, focus
 *                 on the first, each field's aria-describedby names a polite
 *                 live error with text in the page's language; typing clears
 *                 a field's error; a malformed email gets its own message.
 *                 Then submitted valid: the browser is asked to open a
 *                 mailto: URL to the form's own address, with the subject
 *                 (form.subj in the page's language, then the name: the
 *                 plain contact, since the message was typed here and not
 *                 handed over by the offer or the estimator) and
 *                 a body ending in the page's language; the form gives way
 *                 to the success panel, which takes focus; its "copy" button
 *                 puts that subject and body (and not the address) on the
 *                 clipboard, and a line inside the panel's role=status says
 *                 so (form.copied, the page language's dictionary string,
 *                 compared whole); its "edit" button brings the
 *                 form back, still filled in, focus in the message. With the
 *                 clipboard refusing, then missing, "copy" brings the form
 *                 back with the whole message selected, focus in it, and
 *                 form.copyFail in the page's language under it (a hint, not
 *                 an error: no aria-invalid, not in the errors' colour)
 *  lead store     (index, one run) the Supabase switch turned on in a copy of
 *                 index.html served in its place, its policy rebuilt by
 *                 withCsp: connect-src names the store, and a valid submit
 *                 sends one POST to /rest/v1/leads with no CSP violation
 *  dialogs        scene/'s capture viewer opens with Enter,
 *                 closes with Escape and gives focus back; Tab never leaves
 *                 it for the page behind. It shows one capture and has no
 *                 arrow keys (the 2026-07 audit's A-04 was about arrows it no
 *                 longer has); hub/'s lightbox went with its diary (56f29c1)
 *  rig            (hub/) the live rig: Tab from Yasser goes to Kūro, then to
 *                 every act button in the page's order, each on screen with
 *                 a ring; Enter on Yasser changes the state line at once and
 *                 #rigSaid (aria-live) says his line, Space says the next;
 *                 Enter on Kūro shows another frame; Space on "Say a line"
 *                 says one; Enter on Smirk presses it, Release lets it go
 *  hits           (hub/) every visible link and button, scrolled into view,
 *                 is the topmost element at its own centre: no picture layer
 *                 or die-cut laid over it takes its clicks (Tab reaches a
 *                 covered control all the same, so the paths above miss it)
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
 *                 left) animation is running. Then the page is scrolled
 *                 through a viewport at a time, each held 400ms: nothing is
 *                 written after the first 150ms of a hold (what a scroll
 *                 handler writes at once is the page following the scroll),
 *                 no frame (the embeds included) has such an animation
 *                 running afterwards, each embedded player, on screen
 *                 and loaded, does not advance its playhead in 2s, and
 *                 each of hub/'s loops (img[data-anim], an animated WebP
 *                 app.js swaps in on view) still shows its still, decoded
 *                 (lib/loop-state.mjs; audit.mjs proves the swap without
 *                 the preference). A jump
 *                 lands at once: html and body are not scroll-behavior:
 *                 smooth, and Enter on the skip link moves scrollY in one
 *                 step. On workspacehq/ (desktop) the live console is booted
 *                 and its sidekick Bit stays where he is for 8s; one more run
 *                 does the same with no OS preference and the page's PAUSE
 *                 MOTION button pressed
 *  direction      ?lang=ar gives html dir="rtl" lang="ar" on every page that
 *                 switches in place, and still does after the language hold's
 *                 1.5s fallback; on the root it lands on ar/ before paint (the
 *                 head script's redirect); en/ and ar/ are one language each
 *                 and ignore it, as do the price guide's three pages (tarifs/
 *                 never had a ?lang= address: a stored preference, not the
 *                 address, sends it to its version) and the English-only
 *                 pages, which stay ltr
 * A JS error during a run fails it, and so does any Content-Security-Policy
 * violation, from any frame (lib/csp-watch.mjs, shared with audit.mjs). This
 * gate holds the CSP proof for what only it drives: the theme menu, the
 * contact form submitted (its validation, the mail hand-off and, with the
 * switch on, the lead store's POST), hub's rig, scene/'s viewer and the
 * embeds taking focus; audit.mjs holds it for page loads, the CV panel, the phone
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
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { serve, launch } from './lib/serve.mjs';
import { watchCsp } from './lib/csp-watch.mjs';
import { loopState } from './lib/loop-state.mjs';
import { withCsp } from './lib/csp.mjs';
import { loadDicts } from './lib/i18n.mjs';
import { STATIC_LANG, TARIFS_LANG } from './build-sitemap.mjs';
import { ROOT, PAGES } from './site.mjs';

/* langs: the languages a page has (`only`: why it has just one); tests: its
   own keyboard paths; noSkip: why it has no skip link. The home page is one
   page per language (STATIC_LANG: index.html French, en/, ar/, each with the
   same paths), and so is the price guide (TARIFS_LANG: tarifs/, en/tarifs/,
   ar/tarifs/), which carries the home's chrome (its theme and menu paths
   would pass there too) and the estimator, open at load, whose path hands
   the scope to the home page's form across a navigation; hub/'s path is the
   live rig (rig() below: since 56f29c1 the page is the founder's character
   bible, and the studio diary's viewer went with it), and its pointer check
   (hits() below). */
const HOME_TESTS = ['theme', 'menu', 'cv', 'estimate', 'form'];
const SPEC = {
  'index.html': { langs: ['fr'], tests: HOME_TESTS, only: 'the French page (one language per page; its Arabic is ar/, its English en/)' },
  'en/index.html': { langs: ['en'], tests: HOME_TESTS, only: 'the English page (one language per page)' },
  'ar/index.html': { langs: ['ar'], tests: HOME_TESTS, only: 'the Arabic page (one language per page)' },
  'tarifs/index.html': { langs: ['fr'], tests: ['estimate'], only: 'the French guide (one language per page; its Arabic is ar/tarifs/, its English en/tarifs/)' },
  'en/tarifs/index.html': { langs: ['en'], tests: ['estimate'], only: 'the English guide (one language per page)' },
  'ar/tarifs/index.html': { langs: ['ar'], tests: ['estimate'], only: 'the Arabic guide (one language per page)' },
  'scene/index.html': { langs: ['fr', 'ar'], tests: ['viewer'] },
  'hub/index.html': { langs: ['fr', 'en', 'ar'], base: 'fr', tests: [] },
  'hub/bible/index.html': { langs: ['en'], tests: ['rig', 'hits'], only: "English only (the founder's own page)" },
  'workspacehq/index.html': { langs: ['en'], tests: ['embeds'], only: 'English only (the product page)' },
  '404.html': { langs: ['fr', 'ar'], tests: [], noSkip: 'one short block: the wordmark and two links (home, the offer)' },
  'legal/index.html': { langs: ['fr', 'ar'], tests: [] },
};
const ONLY = process.argv[2];       // optional: only the pages whose name contains this
const name = (f) => (f === 'index.html' ? 'index' : f.replace(/\/index\.html$/, '/'));
const pages = PAGES.slice();
if (existsSync(join(ROOT, 'legal-preview/index.html'))) { pages.push('legal-preview/index.html'); SPEC['legal-preview/index.html'] = SPEC['legal/index.html']; }
if (ONLY) pages.splice(0, pages.length, ...pages.filter((f) => name(f).includes(ONLY)));
const SIZES = [[1280, 900], [390, 844]];
const RING_N = 25;
// index's dictionaries, as app.js holds them: the form's status lines are
// compared with these strings, not merely with the script they are written in
const DICT = loadDicts();

const srv = await serve();
const B = srv.base;
const b = await launch();
let fails = 0, runs = 0;
const unclassified = pages.filter((f) => !SPEC[f]);
if (unclassified.length) { console.log('FAIL no keys spec for: ' + unclassified.join(', ') + ' (add it to SPEC in scripts/keys.mjs)'); fails++; }

// a language page (the home's three, the guide's three) is its language; the
// pages that switch in place take ?lang=
const STATIC = { ...STATIC_LANG, ...TARIFS_LANG };
const url = (f, l) => B + '/' + f.replace(/index\.html$/, '') + (l && l !== (SPEC[f]?.base || 'en') && !STATIC[f] ? '?lang=' + l : '');
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

/* The booted console's template (embed/console.html, as the design tool
   exports it) holds SVG attributes like points="{{ t.pts }}" that its runtime
   fills in; Chrome logs each one as an error first. Waived for that file and
   that message only, as audit.mjs waives them. */
const WAIVED = [[/\/workspacehq\/embed\/console\.html$/, /^Error: <\w+> attribute [\w:-]+: Expected (number|length), "\{\{/]];

async function open(w, h, opts = {}) {
  const touch = w < 600;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch, ...opts });
  const p = await ctx.newPage();
  const errs = [], csp = [];
  p.on('pageerror', (e) => errs.push(String(e).slice(0, 120)));
  p.on('console', (m) => {
    if (m.type() !== 'error') return;
    const at = (m.location().url || '').split(/[?#]/)[0];
    if (!WAIVED.some(([f, r]) => f.test(at) && r.test(m.text()))) errs.push(m.text().slice(0, 120));
  });
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
      if (!tgt || !tgt.closest('main,[role="main"]')) return { err: 'skip link points at ' + href + ', which is not <main> or inside it' };
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
    // a chip's or an option's input (.echip, .eopt: the estimator, open at
    // load on the price guide) is visually hidden and its label wears the
    // ring (styles.css .echip:has(input:focus-visible)), so the ring and the
    // visibility are read on the label
    const lab = await h.evaluateHandle((e) => (e && e.tagName === 'INPUT' && !__shown(e) && e.closest('label')) || null);
    if (lab.asElement()) { await h.dispose(); h = lab; } else await lab.dispose();
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
  // Enter on the skip link moves focus to its target
  if (n && !spec.noSkip && !bad.some((m) => m.startsWith('first Tab') || m.startsWith('skip link points'))) {
    await p.evaluate(() => scrollTo(0, 0));
    await seen[0].h.evaluate((a) => a.focus());
    await p.keyboard.press('Enter');
    await wait(300);
    const m = await p.evaluate((a) => { const t = document.getElementById(a.getAttribute('href').slice(1)), f = document.activeElement; return { ok: !!f && f === t, d: __d(f), want: __d(t) }; }, seen[0].h);
    if (!m.ok) bad.push('Enter on the skip link leaves focus on ' + m.d + ', not on its target ' + m.want);
    // and it skips something: the next Tab is not the stop that follows the skip link anyway
    else if (seen[1]) {
      await p.keyboard.press('Tab'); await wait(60);
      const same = await p.evaluate((b) => document.activeElement === b, seen[1].frame || seen[1].h);
      if (same) bad.push('the skip link skips nothing: after Enter, Tab lands on ' + seen[1].d + ', the next stop without it');
    }
  }
  for (const x of seen) { await x.h.dispose(); if (x.frame) await x.frame.dispose(); }
  return { bad, note: `ring ${n}` + (byShadow || frames ? ` (${[byShadow && byShadow + ' by glow', frames && frames + ' in an embed'].filter(Boolean).join(', ')})` : '') };
}

async function themeMenu(p) {
  const bad = [];
  // the picker under test: the first .theme-switch whose button is shown
  // (the header's from 960px; below, the phone menu's, once the menu is
  // open). Shown, not merely rendered: the closed menu is a fixed panel
  // slid off screen, so offsetParent is set on everything inside it, and
  // the picker fades in last once the menu opens (a .5s stagger after .3s)
  const shown = () => p.evaluate(() => [...document.querySelectorAll('.theme-switch')].findIndex((sw) => { const x = sw.querySelector('.theme-btn'); return !!x && __shown(x); }));
  let which = await shown(), inMenu = false;
  if (which < 0 && await p.evaluate(() => { const t = document.querySelector('.menu-toggle'); return !!t && t.offsetParent !== null; })) {
    await p.focus('.menu-toggle'); await p.keyboard.press('Enter');
    for (let t = 0; which < 0 && t < 16; t++) { await wait(100); which = await shown(); }
    inMenu = true;
  }
  if (which < 0) return { bad: ['theme button not rendered' + (inMenu ? ' (not in the open phone menu either)' : '')], note: 'theme' };
  const st = () => p.evaluate((which) => {
    const sw = document.querySelectorAll('.theme-switch')[which], m = sw.querySelector('.theme-menu'), btn = sw.querySelector('.theme-btn');
    const items = [...m.querySelectorAll('[role="menuitemradio"]')];
    return { open: m.classList.contains('open'), exp: btn.getAttribute('aria-expanded'), i: items.indexOf(document.activeElement),
      onBtn: document.activeElement === btn, checked: items.findIndex((x) => x.getAttribute('aria-checked') === 'true'), n: items.length,
      theme: document.documentElement.getAttribute('data-theme'), val: items.map((x) => x.getAttribute('data-theme-val')),
      menuOpen: !!document.querySelector('.mobile-menu.open'),
      // every picker on the page marks the chosen theme, not only the one driven
      marked: [...document.querySelectorAll('.theme-menu')].every((x) => { const c = x.querySelector('[aria-checked="true"]'); return !!c && c.getAttribute('data-theme-val') === document.documentElement.getAttribute('data-theme'); }) };
  }, which);
  const focusBtn = () => p.evaluate((which) => document.querySelectorAll('.theme-switch')[which].querySelector('.theme-btn').focus(), which);
  await focusBtn();
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
  if (inMenu && !s.menuOpen) bad.push('Escape on the picker closes the phone menu around it too');
  await p.keyboard.press('ArrowUp'); s = await st();
  if (!s.open || s.i !== s.n - 1) bad.push('ArrowUp on the button does not open on the last theme');
  await p.keyboard.press('Tab'); s = await st();
  if (s.open) bad.push('Tab does not close the menu');
  await focusBtn();
  await p.keyboard.press('Enter'); await p.keyboard.press('ArrowDown'); s = await st();
  const want = s.val[s.i];
  await p.keyboard.press('Enter'); s = await st();
  if (s.theme !== want || s.open || !s.onBtn) bad.push('Enter on a theme does not apply it, close and refocus the button');
  if (!s.marked) bad.push('the chosen theme is not aria-checked on every picker');
  if (inMenu) {
    if (!s.menuOpen) bad.push('choosing a theme closes the phone menu around the picker');
    // the menu, for the tests after this one: one Escape, with the picker closed
    await p.keyboard.press('Escape'); await wait(100); s = await st();
    if (s.menuOpen) bad.push('Escape with the picker closed does not close the phone menu');
  }
  return { bad, note: 'theme' + (inMenu ? ' (in the phone menu)' : '') };
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

/* The estimator's scope, handed to the message (M4 folded it in a closed
   <details>, where its list is not rendered: the scope once came out as the
   price range alone). Opened with Enter, nothing changed, "Obtenir le prix
   ferme" gives the default type and size first (price.tyCustom · …), then
   the range. Re-configured (E-commerce) and handed again, then folded and
   the currency switched: the untouched message follows, type first, in €.
   The message is emptied and the currency put back for the form test.
   On the price guide the estimator is open at load and the page has no
   form: Enter on the link is a navigation to that language's home page at
   #contact, the scope carried in sessionStorage (app.js HANDOFF), which the
   home must have read into the message, under the greeting price.estHello on
   its own line, and cleared; the fold and the
   currency switch are tried on the home alone. Whatever the scope says, it
   says in plain text, in the summary list as in the message: a dictionary
   value with markup in it (the Arabic's <bdi>SEO</bdi>, which the default
   type includes) printed its tags there and sent them on in the visitor's
   mailto body and WhatsApp text, until app.js t() returned plain text. */
async function estimatePrefill(p, lang) {
  const bad = [];
  const D = DICT[lang] || {};
  const msg = () => p.evaluate(() => { const f = document.getElementById('f-message'); return f ? f.value : null; });
  const isOpen = () => p.evaluate(() => document.querySelector('.price-est').open);
  const space = async (sel) => { await p.focus(sel); await p.keyboard.press('Space'); await wait(100); };
  const guide = await p.evaluate(() => !document.getElementById('f-message'));
  const TAG = /<\/?[a-z][^>]*>/i;
  const tagged = (where, s) => { if (s && TAG.test(s)) bad.push(`markup printed as text in the ${where}: "${s.match(TAG)[0]}" in "${s.slice(0, 60).replace(/\n/g, '⏎')}…"`); };
  tagged('estimator summary', await p.evaluate(() => [...document.querySelectorAll('#est-summary li')].map((l) => l.textContent).join(' | ')));
  if (await isOpen()) { if (!guide) bad.push('the estimator is open at load (the home folds it)'); }
  else {
    if (guide) bad.push('the guide\'s estimator is folded at load (it renders open)');
    await p.focus('.price-est>summary'); await p.keyboard.press('Enter'); await wait(150);
    if (!(await isOpen())) bad.push('Enter on the estimator\'s summary does not open it');
  }
  if (guide) {
    const from = new URL(p.url()).pathname, home = '/' + (lang === 'fr' ? '' : lang + '/');
    await p.focus('#est-cta');
    await Promise.all([p.waitForURL((u) => u.pathname !== from, { waitUntil: 'load', timeout: 10000 }).catch(() => {}), p.keyboard.press('Enter')]);
    await p.waitForLoadState('networkidle'); await wait(300);
    const at = new URL(p.url());
    if (at.pathname !== home || at.hash !== '#contact') bad.push(`Enter on the guide's "prix ferme" link lands on ${at.pathname}${at.hash}, not on ${home}#contact`);
    const m = await msg();
    tagged('message carried to the home', m);
    if (m === null) bad.push('no message field where the link landed');
    // the home puts the greeting (price.estHello) on the line above the carried scope
    else if (!D['price.estHello'] || !m.startsWith(D['price.estHello'] + '\n' + D['price.tyCustom'] + ' · ') || !m.includes(' — ')) bad.push('the scope carried to the home reads "' + m.slice(0, 60).replace(/\n/g, '⏎') + '", not price.estHello ⏎ price.tyCustom · … — range');
    const left = await p.evaluate(() => { try { return sessionStorage.getItem('numidea-prefill'); } catch (e) { return 'unreadable'; } });
    if (left !== null) bad.push('the carried scope is still in sessionStorage once the home has read it');
    if (m !== null) await p.fill('#f-message', '');
    return { bad, note: 'estimate → home message' };
  }
  await p.focus('#est-cta'); await p.keyboard.press('Enter'); await wait(200);
  let m = await msg();
  tagged('message', m);
  if (!m.startsWith(D['price.tyCustom'] + ' · ') || !m.includes(' — ')) bad.push('the estimator\'s default scope hands "' + m.slice(0, 60) + '" to the message, not price.tyCustom · … — range');
  await space('input[name="est-type"][value="ecommerce"]');
  await p.focus('#est-cta'); await p.keyboard.press('Enter'); await wait(200);
  m = await msg();
  if (!m.startsWith(D['price.tyShop'] + ' · ')) bad.push('a re-configured estimate hands "' + m.slice(0, 60) + '" to the message, not price.tyShop · …');
  await p.focus('.price-est>summary'); await p.keyboard.press('Enter'); await wait(150);
  if (await isOpen()) bad.push('Enter on the estimator\'s summary does not fold it again');
  await space('input[name="pr-cur"][value="EUR"]');
  m = await msg();
  if (!m.startsWith(D['price.tyShop'] + ' · ') || !m.includes('€')) bad.push('folded, a currency switch turns the untouched scope into "' + m.slice(0, 60) + '"');
  await space('input[name="pr-cur"][value="DZD"]');
  await p.fill('#f-message', '');
  return { bad, note: 'estimate → message' };
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
      rendered: !!e && e.getClientRects().length > 0, color: e ? getComputedStyle(e).color : '' };
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
  const emptyEmail = s[1].text, errColor = s[2].color;   // the message's error, for the hint below
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
  // A valid submit: the lead goes to the visitor's mail app (the page asks the
  // browser to open a mailto: URL to the form's own address, which a test
  // browser refuses; CDP still reports the request), the form gives way to
  // the success panel, which takes focus, and "Revoir mon message" brings the
  // form back, still filled in, with focus in the message.
  const to = await p.evaluate(() => (document.getElementById('contact-form').getAttribute('action') || '').replace(/^mailto:/, ''));
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Page.enable');
  const navs = [];
  cdp.on('Page.frameRequestedNavigation', (e) => navs.push(e.url));
  await p.fill('#f-email', 'ada@example.com');
  await p.focus('#f-message'); await p.keyboard.type('Bonjour');
  await submit(); await wait(400);
  const ok = await p.evaluate(() => {
    const f = document.getElementById('contact-form'), s = document.querySelector('.form-success');
    return { gone: getComputedStyle(f).display === 'none', show: !!s && s.classList.contains('show') && s.getClientRects().length > 0,
      focused: !!s && document.activeElement === s, a: __d(document.activeElement) };
  });
  if (!ok.gone) bad.push('a valid submit leaves the form on screen');
  if (!ok.show) bad.push('a valid submit does not show the success panel');
  if (!ok.focused) bad.push('after a valid submit focus is on ' + ok.a + ', not on the success panel');
  const mail = navs.find((u) => u.startsWith('mailto:'));
  let handed = null;                // subject and body as the hand-off composed them
  if (!to.includes('@')) bad.push('the form has no mailto: action to compare the hand-off with');
  else if (!mail) bad.push('a valid submit does not hand the lead to a mail app (no mailto: navigation)');
  else {
    const m = new URL(mail), subject = m.searchParams.get('subject') || '', body = m.searchParams.get('body') || '';
    handed = subject + '\n\n' + body;
    if (decodeURIComponent(m.pathname) !== to) bad.push('the hand-off goes to ' + m.pathname + ', not to the form\'s address');
    // the subject is composed by entry point (app.js: form.subjPrev after
    // the offer's prefill, form.subjEst after the estimator's, form.subj
    // otherwise) plus the name; a message typed here is the plain contact
    const subj = String((DICT[lang] || {})['form.subj'] || '') + 'Test';
    if (subject !== subj) bad.push('the hand-off\'s subject is "' + subject + '", not form.subj + the name ("' + subj + '")');
    if (!body.startsWith('Test <ada@example.com>') || !body.includes('Bonjour') || !body.includes('numidealabs · ' + lang)) bad.push('the hand-off\'s body is "' + body.slice(0, 80).replace(/\n/g, '⏎') + '"');
  }
  await cdp.detach();
  // the line says exactly the page language's dictionary string (a French
  // line on the Arabic page, or an English one on the French page, fails)
  const says = (s, key) => !!s && s === String((DICT[lang] || {})[key] || '').trim();
  let copied = false;
  if (ok.show) {
    // "Copier mon message", for a visitor whose mail app did not open: the
    // clipboard gets what the hand-off carried, the address stays out of it,
    // the panel stays, and its role=status says it in the page's language
    await p.context().grantPermissions(['clipboard-read', 'clipboard-write'], { origin: B });
    await p.focus('#form-copy'); await p.keyboard.press('Enter'); await wait(400);
    const cp = await p.evaluate(async () => {
      const n = document.getElementById('form-copied'), s = document.querySelector('.form-success');
      return { clip: await navigator.clipboard.readText().catch((e) => 'readText failed: ' + e.message),
        note: n ? n.textContent.trim() : '', inStatus: !!n && !!n.closest('[role="status"][aria-live="polite"]'),
        shown: !!s && s.classList.contains('show'), a: __d(document.activeElement) };
    });
    if (handed !== null && cp.clip !== handed) bad.push('"copy" put "' + cp.clip.slice(0, 60).replace(/\n/g, '⏎') + '" on the clipboard, not the hand-off\'s subject and body');
    if (cp.clip.includes(to)) bad.push('"copy" puts the address on the clipboard');
    if (!cp.shown) bad.push('"copy" closes the panel (focus on ' + cp.a + ')');
    if (!cp.inStatus) bad.push('the "copied" line is not inside the panel\'s polite role=status');
    if (!says(cp.note, 'form.copied')) bad.push('after "copy" the panel says "' + cp.note.slice(0, 40) + '", not form.copied in ' + lang);
    copied = handed !== null && cp.clip === handed;
    await p.focus('#form-edit'); await p.keyboard.press('Enter'); await wait(150);
    const back = await p.evaluate(() => ({ shown: getComputedStyle(document.getElementById('contact-form')).display !== 'none',
      onMsg: document.activeElement === document.getElementById('f-message'), a: __d(document.activeElement), kept: document.getElementById('f-message').value }));
    if (!back.shown || !back.onMsg) bad.push('"edit" does not bring the form back with focus in the message (focus on ' + back.a + ')');
    if (back.kept !== 'Bonjour') bad.push('the form comes back without the message typed');
    // No clipboard to write to (it refuses, or the browser has none): the
    // form comes back with the message selected, to copy by hand, and a
    // line under it says so; a hint, so the field is not marked invalid
    for (const how of ['refusing', 'missing']) {
      await submit(); await wait(400);
      await p.evaluate((how) => {
        if (how === 'refusing') navigator.clipboard.writeText = () => Promise.reject(new DOMException('Write permission denied.', 'NotAllowedError'));
        else Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
      }, how);
      await p.focus('#form-copy'); await p.keyboard.press('Enter'); await wait(300);
      const nc = await p.evaluate(() => {
        const m = document.getElementById('f-message'), e = document.getElementById('f-message-err');
        return { shown: getComputedStyle(document.getElementById('contact-form')).display !== 'none',
          panel: document.querySelector('.form-success').classList.contains('show'),
          onMsg: document.activeElement === m, a: __d(document.activeElement),
          all: m.selectionStart === 0 && m.selectionEnd === m.value.length && m.value.length > 0,
          hint: e ? e.textContent.trim() : '', described: (m.getAttribute('aria-describedby') || '').split(/\s+/).includes('f-message-err'),
          inv: m.getAttribute('aria-invalid'), color: e ? getComputedStyle(e).color : '' };
      });
      if (!nc.shown || nc.panel) bad.push('with the clipboard ' + how + ', "copy" does not bring the form back');
      if (!nc.onMsg || !nc.all) bad.push('with the clipboard ' + how + ', focus is not in the message with all of it selected (focus on ' + nc.a + ')');
      if (!says(nc.hint, 'form.copyFail') || !nc.described) bad.push('with the clipboard ' + how + ', the line under the message is not form.copyFail in ' + lang + ' ("' + nc.hint.slice(0, 40) + '")');
      if (nc.inv) bad.push('with the clipboard ' + how + ', the message is marked aria-invalid');
      if (errColor && nc.color === errColor) bad.push('with the clipboard ' + how + ', the line under the message is drawn in the error colour (' + errColor + ')');
    }
  }
  return { bad, note: 'form' + (mail ? ' → mailto' : '') + (copied ? ' + copy' : '') };
}

async function dialog(p, kind) {
  const bad = [];
  const D = { dlg: '#viewer', opener: 'a.zoom' };
  const idx = await p.evaluate((D) => [...document.querySelectorAll(D.opener)].findIndex((a) => a.offsetParent !== null), D);
  if (idx < 0) return { bad: ['no visible ' + D.opener + ' to open the dialog with'], note: kind };
  const opener = (await p.$$(D.opener))[idx];
  await opener.focus();
  await p.keyboard.press('Enter'); await wait(400);
  const st = () => p.evaluate(([D, idx]) => {
    const d = document.querySelector(D.dlg), list = [...document.querySelectorAll(D.opener)], a = document.activeElement;
    return { open: d.open, inside: d.contains(a), body: a === document.body, onOpener: a === list[idx], a: __d(a),
      n: [...d.querySelectorAll('a[href],button')].filter((e) => e.offsetParent !== null).length };
  }, [D, idx]);
  let s = await st();
  if (!s.open) return { bad: ['Enter on ' + D.opener + ' does not open ' + D.dlg], note: kind };
  if (!s.inside) bad.push('opening leaves focus outside the dialog (' + s.a + ')');
  for (let i = 0; i < s.n + 1; i++) {
    await p.keyboard.press('Tab');
    const x = await st();
    if (!x.inside && !x.body) { bad.push('Tab leaves the open dialog for ' + x.a); break; }
  }
  await p.keyboard.press('Escape'); await wait(300);
  s = await st();
  if (s.open) bad.push('Escape does not close the dialog');
  if (!s.onOpener) bad.push('closing does not return focus to the opener (' + s.a + ')');
  return { bad, note: kind };
}

/* hub/'s live rig (00 He's alive, hub/app.js §1): Yasser and Kūro are
   buttons, the acts a group of buttons under them (.ctrls). From Yasser, Tab
   goes to Kūro, then to each act in the order the page lists them, each
   on screen and wearing a ring. Enter on Yasser is a reaction at once (the
   state line leaves its rest label: the smirk before the line) and, once
   the line is typed, #rigSaid (aria-live) says it; Space on him, once that
   line has gone (a second poke within 2.5 s is the laugh, no line), says
   the next one. Enter on Kūro changes the frame he shows; Space on "Say a
   line" writes a line again, and Enter on Smirk presses it (aria-pressed)
   and Release lets it go. */
async function rig(p) {
  const bad = [];
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  if (!(await p.$('#rig #rigY')) || !(await p.$('#rigSaid'))) return { bad: ['no #rig with #rigY and #rigSaid (the live rig)'], note: 'rig ?' };
  await p.locator('#rig').scrollIntoViewIfNeeded();
  // the frames come in once the panel is on screen; a frame is shown only once loaded
  await p.waitForFunction(() => [...document.querySelectorAll('#rig img')].length > 2 && [...document.querySelectorAll('#rig img')].every((i) => i.complete), null, { timeout: 10000 }).catch(() => {});
  const st = () => p.evaluate(() => ({ said: document.getElementById('rigSaid').textContent.trim(), state: (document.getElementById('rigState') || {}).textContent || '',
    k: ([...document.querySelectorAll('#rigK img[data-kf]')].find((i) => getComputedStyle(i).opacity === '1') || { dataset: {} }).dataset.kf || 'none',
    smirk: (document.querySelector('.ctrl[data-act="smirk"]') || { getAttribute: () => null }).getAttribute('aria-pressed') }));
  const until = async (f, ms) => { for (let t = 0; t < ms; t += 100) { const s = await st(); if (f(s)) return s; await wait(100); } return st(); };
  // Tab order and rings: Yasser, Kūro, then every act in the page's order
  const want = await p.evaluate(() => ['#rigY', '#rigK', ...[...document.querySelectorAll('.ctrls .ctrl[data-act]')].map((b) => `.ctrl[data-act="${b.dataset.act}"]`)]);
  await p.focus('#rigY');
  let order = 0;
  for (let i = 0; i < want.length; i++) {
    if (i) { await p.keyboard.press('Tab'); await wait(60); }
    const r = await p.evaluate((sel) => {
      const a = document.activeElement, s = getComputedStyle(a);
      const clear = /^transparent$|rgba\([^)]*,\s*0\)$/.test(s.outlineColor);
      return { on: a === document.querySelector(sel), d: __d(a), shown: __shown(a), ring: (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0 && !clear) || s.boxShadow !== 'none' };
    }, want[i]);
    if (!r.on) { bad.push(`Tab from ${want[i - 1] || 'the start'} lands on ${r.d}, not on ${want[i]}`); break; }
    order++;
    if (!r.shown) bad.push(`${r.d} takes focus off screen or hidden`);
    if (!r.ring) bad.push(`no focus ring on ${r.d}`);
  }
  await p.evaluate(() => document.activeElement.blur());
  // Yasser: Enter, then Space once his line has gone
  const s0 = await st();
  await p.focus('#rigY'); await p.keyboard.press('Enter');
  const s1 = await until((s) => s.state !== s0.state, 400);
  if (s1.state === s0.state) bad.push(`Enter on Yasser changes nothing on screen (the state line stays "${s0.state}")`);
  const s2 = await until((s) => s.said && s.said !== s0.said, 6000);
  if (!s2.said || s2.said === s0.said) bad.push('Enter on Yasser: #rigSaid (aria-live) never says his line');
  await until((s) => !/^Talking/.test(s.state), 6000); await wait(2700);
  await p.focus('#rigY'); await p.keyboard.press('Space');
  const s3 = await until((s) => s.said && s.said !== s2.said, 6000);
  if (s3.said === s2.said) bad.push('Space on Yasser: #rigSaid does not move on to his next line');
  // Kūro: Enter shows another frame
  await until((s) => s.k === 'base', 2000);
  await p.focus('#rigK'); await p.keyboard.press('Enter');
  const k = await until((s) => s.k !== 'base', 600);
  if (k.k === 'base') bad.push('Enter on Kūro changes nothing (he stays on his base frame)');
  // the acts: Space on "Say a line" says one; Enter on Smirk holds it, Release lets go
  if (await p.$('.ctrl[data-act="say"]')) {
    const before = (await st()).said;
    await p.focus('.ctrl[data-act="say"]'); await p.keyboard.press('Space');
    const a = await until((s) => s.said && s.said !== before, 6000);
    if (a.said === before) bad.push('Space on "Say a line": #rigSaid does not say a new line');
  }
  if (await p.$('.ctrl[data-act="smirk"]')) {
    await p.focus('.ctrl[data-act="smirk"]'); await p.keyboard.press('Enter'); await wait(150);
    if ((await st()).smirk !== 'true') bad.push('Enter on Smirk does not press it (aria-pressed)');
    if (await p.$('.ctrl[data-act="release"]')) {
      await p.focus('.ctrl[data-act="release"]'); await p.keyboard.press('Enter'); await wait(150);
      if ((await st()).smirk !== 'false') bad.push('Enter on Release leaves Smirk pressed');
    }
  }
  await p.evaluate(() => { document.activeElement.blur(); scrollTo(0, 0); });
  return { bad, note: `rig ${order}/${want.length} in order, said "${(s3.said || s2.said || '').slice(0, 22)}…"` };
}

/* hub/: every link and button outside the (closed) viewer, scrolled to the
   middle of the screen, is the element at its own centre. The hero's stage
   (three full-frame pictures) once sat over the WorkspaceHQ cartridge from
   1024px: no click or hover reached it, and only a pointer finds that. */
async function hits(p) {
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  const r = await p.evaluate(async () => {
    const out = [];
    const els = [...document.querySelectorAll('a[href],button')].filter((e) => e.offsetParent !== null && !e.closest('dialog'));
    for (const e of els) {
      e.scrollIntoView({ block: 'center', inline: 'nearest' });
      await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));
      const b = e.getBoundingClientRect();
      if (!b.width || !b.height || b.bottom < 0 || b.top > innerHeight) continue;
      const t = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
      if (!t || (t !== e && !e.contains(t))) out.push(__d(e) + ' lies under ' + __d(t));
    }
    scrollTo(0, 0);
    return { n: els.length, out };
  });
  return { bad: r.out.map((m) => 'covered for the pointer: ' + m), note: `hits ${r.n}` };
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

/* workspacehq/'s live console, booted: its sidekick Bit (embed/hq-fx.js)
   holds still while motion is off, whether by the OS setting or by the
   page's PAUSE MOTION button. He is moved by script, which no CSS rule
   reaches, and once walked the screen on his own with both. The pointer is
   kept outside the frame, so nothing invites him to follow it. */
async function bitHolds(p) {
  await p.locator('#bootDemo').scrollIntoViewIfNeeded();
  await p.click('#bootDemo');
  let f;
  try {
    f = await (await p.waitForSelector('#demoStage iframe', { timeout: 5000 })).contentFrame();
    await f.waitForLoadState('load', { timeout: 30000 });
    await f.waitForFunction(() => /workspace-hq/.test(document.body.innerText) && !/\{\{/.test(document.body.innerText), null, { timeout: 20000 });
  } catch { return { bad: ['the console did not boot'], note: 'bit ?' }; }
  await p.mouse.move(2, 2);
  // Bit's next move is a random draw; these draws would each send him walking
  // if nothing held him, so the watch decides the same way every run
  await f.evaluate(() => { const seq = [0.9, 0.6, 0.75, 0.95, 0.5]; let i = 0; Math.random = () => seq[i++ % seq.length]; });
  const at = [];
  for (let i = 0; i < 32; i++) {
    at.push(await f.evaluate(() => { const e = document.querySelector('[title="Bit · click or drag me"]'); return e ? e.style.transform || 'none' : null; }));
    await wait(250);
  }
  if (at.includes(null)) return { bad: ['Bit is not in the booted console'], note: 'bit ?' };
  const seen = [...new Set(at)];
  return { bad: seen.length > 1 ? [`Bit moves with motion off: ${seen.slice(0, 4).join(' → ')}${seen.length > 4 ? ' …' : ''} in 8s`] : [], note: `bit held ${seen.length === 1 ? 'still' : 'NOT'}` };
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
      else if (t === 'estimate') out.push(await estimatePrefill(p, lang));
      else if (t === 'form') out.push(await contactForm(p, lang));
      else if (t === 'embeds') out.push(await embeds(p, w, h));
      else if (t === 'hits') out.push(await hits(p));
      else if (t === 'rig') out.push(await rig(p));
      else out.push(await dialog(p, t));
    }
    out.push({ bad: await direction(p, spec, lang, 'after the tests'), note: 'dir ' + (lang === 'ar' ? 'rtl' : 'ltr') });
    report(`${name(f)} ${lang} ${w}`, out, errs, csp);
    await close();
  }
}

/* The lead store (window.NUMIDEA_SUPABASE_URL in index.html; off on the site
   today). With the switch on, lib/csp.mjs adds that one origin to
   connect-src, and a valid submit POSTs the lead there before the mail
   hand-off. Proven on a copy of index.html served in its place, with the
   switch on and the policy rebuilt by withCsp, the store answered here. */
const STORE = 'https://abcdefghijklmnop.supabase.co';
if (pages.includes('index.html')) {
  const src = readFileSync(join(ROOT, 'index.html'), 'utf8');
  const on = src.replace('window.NUMIDEA_SUPABASE_URL = "";', `window.NUMIDEA_SUPABASE_URL = "${STORE}";`)
    .replace('window.NUMIDEA_SUPABASE_KEY = "";', 'window.NUMIDEA_SUPABASE_KEY = "test-key";');
  const bad = [];
  if (!on.includes(STORE) || !on.includes('"test-key"')) bad.push('the lead-store switch (window.NUMIDEA_SUPABASE_URL = "", _KEY = "") was not found in index.html');
  const html = withCsp(on, 'page');
  const { p, errs, csp, close } = await open(1280, 900);
  const posts = [];
  const cors = { 'access-control-allow-origin': B, 'access-control-allow-methods': 'POST', 'access-control-allow-headers': 'content-type, apikey, authorization' };
  await p.route((u) => u.origin === B && (u.pathname === '/' || u.pathname === '/index.html'), (r) => r.fulfill({ status: 200, contentType: 'text/html', body: html }));
  await p.route(STORE + '/**', (r) => {
    if (r.request().method() === 'POST') posts.push(r.request().url().replace(STORE, ''));
    return r.fulfill({ status: r.request().method() === 'POST' ? 201 : 204, headers: cors, body: '' });
  });
  await p.goto(url('index.html', 'fr'), { waitUntil: 'networkidle' });
  const policy = await p.evaluate(() => (document.querySelector('meta[http-equiv="Content-Security-Policy"]') || {}).content || '');
  if (!policy.includes(`connect-src 'self' ${STORE};`)) bad.push('the policy served does not open connect-src to the store');
  await p.fill('#f-name', 'Test'); await p.fill('#f-email', 'ada@example.com'); await p.fill('#f-message', 'Bonjour');
  await p.focus('#contact-form [type="submit"]'); await p.keyboard.press('Enter');
  for (let t = 0; t < 20 && !posts.length; t++) await wait(100);
  if (posts.length !== 1 || posts[0] !== '/rest/v1/leads') bad.push('a valid submit sent ' + (posts.length ? posts.join(', ') : 'no POST') + ' to the store, not one POST to /rest/v1/leads');
  report('index lead store', [{ bad, note: `store POST ${posts.length}` }], errs, csp);
  await close();
}

// running animations in a frame that are infinite or have over 1s left
const running = (fr) => fr.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').map((a) => {
  const t = a.effect.getComputedTiming();
  return { what: (a.animationName || a.transitionProperty || 'script') + ' on ' + __d(a.effect.target), inf: t.iterations === Infinity, left: t.endTime - (a.currentTime || 0) };
}).filter((x) => x.inf || x.left > 1000).map((a) => a.what + (a.inf ? ' (infinite)' : ` (${Math.round(a.left)}ms left)`))).catch(() => []);

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
    const anim = await running(p.mainFrame());
    const mut = Object.entries(await p.evaluate(() => __mut));
    const bad = [];
    if (rv.hidden.length) bad.push('hidden at load: ' + rv.hidden.slice(0, 6).join(', ') + (rv.hidden.length > 6 ? ' +' + (rv.hidden.length - 6) : ''));
    for (const a of anim) bad.push('still running: ' + a);
    const moved = (what, list) => { if (list.length) bad.push(what + list.slice(0, 5).map(([k, n]) => k + ' ×' + n).join(', ') + (list.length > 5 ? ' +' + (list.length - 5) : '')); };
    moved('script still moving things: ', mut);
    // A jump the page asks for lands at once. The viewport scrolls the way
    // html's scroll-behavior says, so 'smooth' there glides the skip link,
    // every #anchor and focus scrolling (hub/'s reduced-motion rule once lost
    // to its own html{scroll-behavior:smooth} on specificity). Read, then
    // tried: Enter on the skip link, scrollY sampled every frame.
    const sb = await p.evaluate(() => [document.documentElement, document.body].map((e) => getComputedStyle(e).scrollBehavior));
    if (sb.includes('smooth')) bad.push(`scroll-behavior is smooth with reduced motion on (html ${sb[0]}, body ${sb[1]})`);
    let jump = '';
    if (!spec.noSkip) {
      await p.keyboard.press('Tab'); await wait(100);
      const skip = await p.evaluate(() => { const a = document.activeElement; return !!a && a.tagName === 'A' && (a.getAttribute('href') || '')[0] === '#'; });
      if (skip) {
        await p.keyboard.press('Enter');
        const ys = await p.evaluate(() => new Promise((res) => { const ys = [Math.round(scrollY)]; const f = () => { ys.push(Math.round(scrollY)); if (ys.length < 40) requestAnimationFrame(f); else res(ys); }; requestAnimationFrame(f); }));
        const n = new Set(ys).size;
        if (n > 2) bad.push(`the skip link glides: scrollY took ${n} values in ${ys.length} frames (${ys.slice(0, 5).join(', ')} … ${ys[ys.length - 1]})`);
        jump = `  skip jump ${n > 2 ? 'glides' : 'at once'} (to ${ys[ys.length - 1]})`;
      }
    }
    // Then the rest of the page, which only a scroll reaches (count-ups,
    // parallax, reveals and lazy players start there): one viewport at a
    // time, each held 400ms. What a scroll handler writes in the first 150ms
    // after a jump is the page following the scroll (a sticky bar, a
    // progress line); what is written after that moves on its own.
    const sc = await p.evaluate(async () => {
      document.documentElement.style.scrollBehavior = 'auto';
      const out = {}; let jump = performance.now();
      const mo = new MutationObserver((list) => { if (performance.now() - jump < 150) return;
        for (const r of list) { const k = __d(r.target.nodeType === 1 ? r.target : r.target.parentElement) + ' ' + (r.attributeName || r.type); out[k] = (out[k] || 0) + 1; } });
      mo.observe(document.body, { subtree: true, attributes: true, characterData: true, childList: true });
      let n = 0;
      for (let y = innerHeight; y < document.documentElement.scrollHeight; y += innerHeight) {
        scrollTo(0, y); jump = performance.now(); n++;
        await new Promise((r) => setTimeout(r, 400));
      }
      mo.disconnect();
      return { n, moved: Object.entries(out) };
    });
    moved('moving after a scroll settles: ', sc.moved);
    // every frame's animations once the whole page has been on screen
    const fanim = [];
    for (const fr of p.frames()) fanim.push(...(await running(fr)).map((a) => (fr === p.mainFrame() ? '' : fr.url().replace(B, '').split(/[?#]/)[0] + ' › ') + a));
    for (const a of fanim) bad.push('running after the scroll: ' + a);
    // hub/'s loops: every one has been on screen, and each still shows its still
    const loops = await p.evaluate(loopState);
    for (const l of loops.filter((x) => !x.ok)) bad.push(`a loop left its still with reduced motion on: ${l.name} shows ${l.shows}, not ${l.want}`);
    // players (workspacehq/'s trailer and walkthrough) hold still: on screen
    // and loaded, their playheads (animations-v3.js keeps them in
    // localStorage) do not advance in 2s
    const players = await p.$$('iframe');
    let held = 0;
    for (const el of players) {
      await el.scrollIntoViewIfNeeded();
      const fr = await el.contentFrame();
      try { await fr.waitForLoadState('load', { timeout: 20000 }); } catch { bad.push('a player did not load: ' + (await el.getAttribute('src'))); continue; }
      const file = ((await el.getAttribute('src')) || '').split(/[?#]/)[0].split('/').pop();
      const heads = () => p.evaluate((file) => Object.fromEntries(Object.keys(localStorage).filter((k) => k.startsWith('animstage-v3:') && k.endsWith('/' + file + ':t')).map((k) => [file, parseFloat(localStorage.getItem(k))])), file);
      await wait(500);
      const t0 = await heads(); await wait(2000); const t1 = await heads();
      const adv = Object.keys(t1).filter((k) => t1[k] > (t0[k] || 0));
      if (adv.length) bad.push('a player is playing with reduced motion on: ' + adv.map((k) => `${k} ${t0[k] || 0} → ${t1[k]}`).join(', '));
      else held++;
    }
    const nPlayers = players.length;
    // workspacehq/: the live console booted, Bit holds still (on desktop: the
    // console is the same script at every width)
    const bit = spec.tests.includes('embeds') && w > 600 ? await bitHolds(p) : null;
    if (bit) bad.push(...bit.bad);
    report(`${name(f)} ${lang} ${w} rm`, [{ bad, note: `reveals ${rv.n - rv.hidden.length}/${rv.n} shown  anim ${anim.length}  moved ${mut.length}${jump}  scrolled ${sc.n}×vh: moved ${sc.moved.length}, anim ${fanim.length} in ${p.frames().length} frame(s)` + (loops.length ? `  loops on their stills ${loops.filter((x) => x.ok).length}/${loops.length}` : '') + (nPlayers ? `  players held ${held}/${nPlayers}` : '') + (bit ? '  ' + bit.note : '') }], errs, csp);
    await close();
  }
}
// workspacehq/'s own PAUSE MOTION button, with no OS preference: the same hold
if (pages.includes('workspacehq/index.html')) {
  const { p, errs, csp, close } = await open(1280, 900);
  await p.goto(url('workspacehq/index.html', 'en'), { waitUntil: 'networkidle' });
  await p.click('#motionBtn');
  const pressed = await p.evaluate(() => document.querySelector('#motionBtn').getAttribute('aria-pressed') === 'true');
  const bit = await bitHolds(p);
  if (!pressed) bit.bad.unshift('PAUSE MOTION is not pressed after a click');
  report('workspacehq/ 1280 pause', [bit], errs, csp);
  await close();
}

console.log('— direction: ?lang=ar on every page —');
for (const f of pages) {
  const spec = SPEC[f]; if (!spec) continue;
  const { p, errs, csp, close } = await open(1280, 900);
  await p.goto(B + '/' + f.replace(/index\.html$/, '') + '?lang=ar', { waitUntil: 'load' });
  let bad, note;
  if (STATIC[f]) {
    // one language per page: the root's head script sends ?lang=ar to ar/
    // before anything is painted (the address a shared link had until
    // 2026-10-31), so it must land there, Arabic; en/ and ar/ ignore it, and
    // so do the price guide's three (tarifs/ never had a ?lang= address)
    const to = f === 'index.html' ? 'ar' : STATIC[f];
    if (f === 'index.html') { try { await p.waitForURL(/\/ar\/$/, { timeout: 10000 }); } catch { /* reported below */ } }
    bad = await direction(p, { langs: [to] }, to, '?lang=ar');
    const at = new URL(p.url()).pathname;
    if (f === 'index.html' && !at.endsWith('/ar/')) bad.push(`?lang=ar on the root lands on ${at}, not on ar/`);
    note = f === 'index.html' ? 'rtl, sent to ar/' : (to === 'ar' ? 'rtl' : 'ltr') + ', ' + spec.only;
  } else {
    await wait(1700);               // past the generated pages' 1.5s hold fallback
    bad = await direction(p, spec, 'ar', '?lang=ar');
    note = spec.langs.includes('ar') ? 'rtl' : 'ltr, ' + spec.only;
  }
  report(`${name(f)} ?lang=ar`, [{ bad, note }], errs, csp);
  await close();
}

await b.close(); srv.close();
console.log(fails ? `\nFAILURES: ${fails} of ${runs}` : `\nALL CLEAN (${runs} runs)`);
process.exit(fails ? 1 : 0);
