/* ============================================================
   Numidea Labs — the measurement consent card (2026-11-27).

   The Google tag (scripts/lib/gtag.mjs) starts with every Consent Mode
   signal denied. This card is the only place it can change, and only for
   analytics_storage: the ad signals (ad_storage, ad_user_data,
   ad_personalization) stay denied whatever the visitor answers.

   - Accept: gtag('consent','update',{analytics_storage:'granted'}), the
     answer kept in localStorage "numidea.consent" = "granted". The inline
     tag (scripts/lib/gtag.mjs) reads the stored answer on the next pages,
     so it is granted there from the first hit. Either answer is counted
     as numidea_consent (granted / denied), so the acceptance rate is known.
   - Refuse: "denied" kept, nothing sent, the card never comes back.
   - No answer: nothing kept, the card comes back on a later page.
   - #consent in the address (the privacy page links it) opens the card
     again, so an answer can be withdrawn as easily as given.

   The card waits: it shows on the visitor's second page, or after 25 s on
   the first, so the home menu's first impression stays clean. Loaded by
   assets/carry.js, on the pages that carry the Google tag, on the live host
   and Vercel previews only (a local test server never sees it). The Vercel
   counts (carry.js) are cookieless and do not depend on this answer.
   ============================================================ */
(function () {
  var KEY = 'numidea.consent';
  var d = document, root = d.documentElement;
  if (window.__numideaConsent) return;
  window.__numideaConsent = true;
  var gtag = function () { (window.dataLayer = window.dataLayer || []).push(arguments); };
  var stored = function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  var keep = function (v) { try { localStorage.setItem(KEY, v); } catch (e) {} };

  var WORDS = {
    fr: { k: 'Registre', t: 'Kūro tient le registre.', b: 'Avec ton accord, Google Analytics mesure tes visites (cookies d’audience, aucune publicité). Sans, on compte quand même : anonyme, sans cookie.', y: 'D’accord', n: 'Non merci', a: 'Mesure d’audience' },
    en: { k: 'Register', t: 'Kūro keeps the register.', b: 'With your OK, Google Analytics measures your visits (audience cookies, no ads). Without it we still count: anonymous, no cookie.', y: 'OK', n: 'No thanks', a: 'Audience measurement' },
    ar: { k: 'السجل', t: 'كورو يمسك السجل.', b: 'بموافقتك، يقيس Google Analytics زياراتك (ملفات تعريف ارتباط للقياس فقط، بلا إعلانات). وبدونها نعدّ أيضاً: دون هوية ودون ملفات تعريف.', y: 'موافق', n: 'لا، شكراً', a: 'قياس الجمهور' }
  };
  var lang = function () { var l = (window.NUMIDEA_LANG || root.getAttribute('lang') || 'fr').slice(0, 2); return WORDS[l] ? l : 'fr'; };

  var CSS = '' +
    '.nc{all:initial;box-sizing:border-box;display:block;position:fixed;z-index:2147483000;inset-inline-end:16px;bottom:16px;width:min(360px,calc(100vw - 32px));color:#211E1B;font:400 15px/1.45 Geist,"Geist Fallback",system-ui,sans-serif;filter:drop-shadow(8px 8px 0 #211E1B)}' +
    '.nc[dir=rtl]{font-family:"IBM Plex Sans Arabic","NL Arabic",system-ui,sans-serif;font-size:16px}' +
    '.nc-in{position:relative;background:#F3ECE1;padding:18px 18px 16px 88px;clip-path:polygon(2.5% 0,100% 0,97.5% 100%,0 100%);border-top:4px solid #A34135}' +
    '.nc[dir=rtl] .nc-in{padding:18px 88px 16px 18px}' +
    '.nc-cat{position:absolute;inset-inline-start:14px;top:14px;width:64px;height:64px;object-fit:contain}' +
    '.nc-k{display:inline-block;margin:0 0 6px;padding:2px 8px;background:#211E1B;color:#F3ECE1;font:800 11px/1.4 "Geist Mono","Geist Mono Fallback",ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;transform:skewX(-8deg)}' +
    '.nc[dir=rtl] .nc-k{letter-spacing:0;font-family:inherit;font-size:12px}' +
    '.nc-t{margin:0 0 4px;font:900 18px/1.2 Archivo,Geist,system-ui,sans-serif}' +
    '.nc[dir=rtl] .nc-t{font-family:inherit;font-weight:700}' +
    '.nc-b{margin:0 0 12px}' +
    '.nc-r{display:flex;gap:10px;flex-wrap:wrap}' +
    '.nc-r button{min-height:44px;padding:0 18px;border:2px solid #211E1B;font:800 15px/1 inherit;font-family:inherit;cursor:pointer;clip-path:polygon(6% 0,100% 0,94% 100%,0 100%);transition:transform .12s ease-out}' +
    '.nc-y{background:#211E1B;color:#F3ECE1}.nc-n{background:#D8CBB8;color:#211E1B}' +
    '.nc-r button:hover{transform:translateY(-2px)}.nc-r button:focus-visible{outline:3px solid #A34135;outline-offset:3px}' +
    '@media (prefers-reduced-motion:no-preference){.nc{animation:nc-in .28s cubic-bezier(.2,.9,.3,1.2) both}@keyframes nc-in{from{opacity:0;transform:translateY(24px)}}}' +
    '@media (max-width:480px){.nc{inset-inline:12px;width:auto;bottom:12px}.nc-in{padding-inline-start:76px}.nc[dir=rtl] .nc-in{padding:18px 76px 16px 18px}.nc-cat{width:52px;height:52px}}' +
    'html.mbar-on .nc{bottom:calc(76px + env(safe-area-inset-bottom))}' +
    '@media print{.nc{display:none}}';

  var box = null;
  function close() { if (box) { box.remove(); box = null; } }
  function answer(yes) {
    keep(yes ? 'granted' : 'denied');
    if (yes) {
      gtag('consent', 'update', { analytics_storage: 'granted' });
    }
    if (window.numideaTrack) window.numideaTrack('consent', yes ? 'granted' : 'denied');
    close();
  }
  function open() {
    if (box) return;
    var l = lang(), w = WORDS[l], base = (d.querySelector('script[src*="assets/carry.js"]') || {}).src || '';
    var cat = base ? base.replace(/assets\/carry\.js.*$/, 'assets/kit/art/kuro/react/judge.webp') : '';
    if (!d.getElementById('nc-css')) { var st = d.createElement('style'); st.id = 'nc-css'; st.textContent = CSS; d.head.appendChild(st); }
    box = d.createElement('div');
    box.className = 'nc';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', w.a);
    box.setAttribute('lang', l);
    box.dir = l === 'ar' ? 'rtl' : 'ltr';
    box.innerHTML = '<div class="nc-in">' + (cat ? '<img class="nc-cat" alt="" width="64" height="64" decoding="async">' : '') +
      '<p class="nc-k"></p><p class="nc-t"></p><p class="nc-b"></p>' +
      '<div class="nc-r"><button type="button" class="nc-y"></button><button type="button" class="nc-n"></button></div></div>';
    if (cat) box.querySelector('.nc-cat').src = cat;
    box.querySelector('.nc-k').textContent = w.k;
    box.querySelector('.nc-t').textContent = w.t;
    box.querySelector('.nc-b').textContent = w.b;
    box.querySelector('.nc-y').textContent = w.y;
    box.querySelector('.nc-n').textContent = w.n;
    box.querySelector('.nc-y').addEventListener('click', function () { answer(true); });
    box.querySelector('.nc-n').addEventListener('click', function () { answer(false); });
    box.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    d.body.appendChild(box);
  }
  window.numideaConsent = { open: open, state: stored };

  var asked = stored();
  if (location.hash === '#consent') { open(); return; }
  window.addEventListener('hashchange', function () { if (location.hash === '#consent') open(); });
  if (asked === 'granted' || asked === 'denied') return;
  // the second page of the visit, or 25 s on the first
  var n = 0;
  try { n = +(sessionStorage.getItem('numidea.pages') || 0) + 1; sessionStorage.setItem('numidea.pages', String(n)); } catch (e) {}
  if (n >= 2) open(); else setTimeout(open, 25000);
})();
