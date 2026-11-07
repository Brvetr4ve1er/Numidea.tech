#!/usr/bin/env node
/**
 * Builds scene/index.html (the blueprint showcase) from scripts/scene-data.mjs
 * — `npm run scene`. The page is static HTML with French baked in, so it
 * reads fully with JavaScript off; scene/app.js only swaps the language and
 * adds the image viewer.
 *
 * Optional client material is discovered on disk, nothing to register:
 *   assets/work/<slug>/before/<name>.webp  +  after/<name>.webp  → pair
 *   assets/work/<slug>/brand/<name>.(webp|png|jpg|svg)           → asset
 * Sections without material are not rendered at all.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PROJECTS, UI } from './scene-data.mjs';
import { VOICES, VOICE_CLIENTS } from './voices-data.mjs';
import { BASE, THEMES } from './site.mjs';
import { withCsp } from './lib/csp.mjs';
import { esc, loadDicts } from './lib/i18n.mjs';
import { AYN } from './lib/ayn.mjs';
import { WORDMARK } from './lib/wordmark.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const stamp = (readFileSync(join(ROOT, 'index.html'), 'utf8').match(/\?v=(\d+)/) || [, '1'])[1];
const LANGS = ['fr', 'en', 'ar'];
// Each theme's page colour (themes.css --void, #rrggbb by themes-check), for
// the browser's own bar, and which themes are light, for the controls'
// colour scheme: read off the sheet, so a new theme needs no edit here.
const VOID = Object.fromEntries([...readFileSync(join(ROOT, 'assets/themes.css'), 'utf8').matchAll(/:root\[data-theme="([a-z]+)"\]\{([^}]*)\}/g)]
  .map((m) => [m[1], /--void:\s*(#[0-9a-fA-F]{6})/.exec(m[2])[1]]));
for (const t of THEMES) if (!VOID[t]) throw new Error('themes.css: no --void for theme ' + t);
const LIGHT = THEMES.filter((t) => [1, 3, 5].map((i) => parseInt(VOID[t].slice(i, i + 2), 16)).reduce((a, c, i) => a + c * [.2126, .7152, .0722][i], 0) > 128);
// The home page's dictionaries: the offer's conditions under each live
// sheet (decision 17) are its own prev.terms, so the sheets never state
// terms of their own and follow the home page when the owner changes them.
const HOME = loadDicts();
// a home-page string the sheets reuse as it is (the masthead's links, the
// offer's buttons, the WhatsApp openers): one key in both dictionaries, so
// the page follows the home page's copy and never words it twice
const home = (k) => put(k, Object.fromEntries(LANGS.map((l) => [l, HOME[l][k]])));
// The studio's WhatsApp number, as the home page states it (index.html),
// and a link that opens the conversation on one of the home page's lines.
// The French text is baked; scene/app.js swaps it for the page's language
// when the link is followed.
const WA = (readFileSync(join(ROOT, 'index.html'), 'utf8').match(/window\.NUMIDEA_WA = '(\d+)'/) || [])[1];
if (!WA) throw new Error('index.html: no window.NUMIDEA_WA number for the WhatsApp links');
const WA_ICON = '<span class="wa-i" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.6-4.3a8.5 8.5 0 1 1 15.4-4.6Z"/><path d="M8.9 8.4c.3-.7.6-.7.9-.7h.6c.2 0 .5 0 .7.6l.8 1.9c.1.2.1.4 0 .6l-.4.6c-.1.2-.2.4 0 .7a6 6 0 0 0 2.8 2.4c.3.1.5.1.7-.1l.6-.7c.2-.2.4-.2.6-.1l1.8.9c.3.1.5.3.5.5 0 .9-.6 1.7-1.4 1.9a3 3 0 0 1-1.6 0 11 11 0 0 1-6.4-5.4 3.4 3.4 0 0 1-.2-2.6Z"/></svg></span>';
const waLink = (cls, textKey, labelKey) => `<a class="${cls} wa-link" href="https://wa.me/${WA}?text=${encodeURIComponent(home(textKey))}" data-wa-text="${textKey}" target="_blank" rel="noopener">${WA_ICON}<span ${T(labelKey)}>${esc(home(labelKey))}</span></a>`;
/* The arrows are drawn, not typed: →, ← and ↗ are in none of the faces the
   page loads, so each came in whatever system face had it (DejaVu,
   Liberation), heavier than the label beside it. A label's own arrow is cut
   off here, in every language, and the drawing takes its place: E is
   forward (it turns in Arabic, as the reading does), NE leaves the site. */
const ARROW = {
  e: '<svg class="arr" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>',
  ne: '<svg class="arr" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5"/></svg>',
};
const bare = (v) => v.replace(/^\s*[←→↗]\s*|\s*[←→↗]\s*$/g, '');
const putBare = (key, byLang) => put(key, Object.fromEntries(LANGS.map((l) => [l, bare(byLang[l])])));
const uiBare = (k) => putBare('ui.' + k, Object.fromEntries(LANGS.map((l) => [l, UI[l][k]])));
// The address a sheet's browser bar shows. Our own product is a page of this
// site: its relative link resolves against the published BASE, never an
// invented host. Host only: the path and hash are cut mid-word at 390px, so
// the full address stays in the visit link's title.
const shownHost = (url) => new URL(url, BASE + 'scene/').host;
const fullHref = (url) => new URL(url, BASE + 'scene/').href;

/* every translatable string gets a key; the dictionary ships inline */
const DICT = { fr: {}, en: {}, ar: {} };
const put = (key, byLang) => { for (const l of LANGS) DICT[l][key] = byLang[l]; return byLang.fr; };
const ui = (k) => put('ui.' + k, Object.fromEntries(LANGS.map((l) => [l, UI[l][k]])));
const T = (key, attr = '') => `data-i18n${attr}="${key}"`;
const AR_LANG = { FR: 'الفرنسية', EN: 'الإنجليزية', AR: 'العربية' };

const files = (slug, sub, exts = ['.webp', '.png', '.jpg', '.jpeg', '.svg']) => {
  const d = join(ROOT, 'assets/work', slug, sub);
  return existsSync(d) ? readdirSync(d).filter((f) => exts.includes(extname(f).toLowerCase())).sort() : [];
};
const caption = (f) => basename(f, extname(f)).replace(/[-_]+/g, ' ');
const pad = (n) => String(n).padStart(2, '0');

/* A capture and its smaller candidate, both written by work-capture.mjs: the
   desktop frames at 720w beside the 1440 file, the phone frames at 416w
   beside the 780 one. sizes is each frame's width as scene/style.css lays
   it out on the sheet's 12 columns (32px gaps), measured on 2026-11-07: the
   main frame (8 columns) 54vw from 1000px, 902px once the page stops
   growing at 1700, the sheet's width below; a page frame (4 columns) 26vw
   from 700px, 435px from 1700, and on a phone 85% of the strip it scrolls
   in; a phone frame 248px in the phone's own strip, then half the 440px
   box, then half of 4 columns. Without these the page sent 1.5 MB of
   1440-wide captures to a phone. */
const SIZES = {
  main: '(min-width:1700px) 902px, (min-width:1000px) 54vw, 86vw',
  page: '(min-width:1700px) 435px, (min-width:700px) 26vw, 70vw',
  // a card is half the page from 1000px (two side by side), less its frame
  card: '(min-width:1700px) 626px, (min-width:1000px) 37vw, 86vw',
  phone: '(min-width:1700px) 206px, (min-width:1000px) 12vw, (min-width:700px) 210px, 248px',
};
const SMALL = { 1440: 720, 780: 416 };
function shot(slug, file, alt, cls, w, h, kind, eager) {
  const src = `../assets/work/${slug}/${file}.webp`, small = `../assets/work/${slug}/${file}-${SMALL[w]}.webp`;
  for (const f of [src, small]) if (!existsSync(join(ROOT, 'assets/work', slug, basename(f)))) throw new Error('missing capture ' + f);
  return `<a class="zoom ${cls}" href="${src}"><img src="${src}" srcset="${small} ${SMALL[w]}w, ${src} ${w}w" sizes="${SIZES[kind]}" alt="${esc(alt)}" width="${w}" height="${h}" decoding="async"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}></a>`;
}

function sheet(p, i) {
  const n = pad(i + 1), k = 'p.' + p.slug;
  const t = (f) => put(`${k}.${f}`, Object.fromEntries(LANGS.map((l) => [l, p.t[l][f]])));
  const statusTxt = put(`${k}.status`, Object.fromEntries(LANGS.map((l) => [l, UI[l].status[p.status]])));
  const ext = /^https?:/.test(p.url);
  const visit = put('ui.visit', Object.fromEntries(LANGS.map((l) => [l, UI[l].visit])));

  const rows = [
    ['sector', t('sector'), `${k}.sector`],
    ['scope', t('scope'), `${k}.scope`],
    p.pageCount ? ['pagesL', String(p.pageCount), null] : null,
    // the languages as each page names them: codes in Latin, words in Arabic
    ['langsL', put(`${k}.langs`, { fr: p.langs, en: p.langs, ar: p.langs.split(' · ').map((c) => AR_LANG[c] || c).join('، ') }), `${k}.langs`],
  ].filter(Boolean).map(([lbl, val, key]) =>
    `<div><dt ${T('ui.' + lbl)}>${esc(ui(lbl))}</dt><dd${key ? ' ' + T(key) : ''}>${esc(val)}</dd></div>`).join('\n          ');

  const deliv = p.t.fr.deliverables.map((d, j) =>
    `<li ${T(`${k}.d${j}`)}>${esc(put(`${k}.d${j}`, Object.fromEntries(LANGS.map((l) => [l, p.t[l].deliverables[j]]))))}</li>`).join('\n            ');
  // the founder's own work on the same client (`identity`): after the
  // deliverables and named as his, never among them (it is not the site's)
  const ident = p.identity ? `
          <p class="sh-ident"><span ${T('ui.by')}>${esc(ui('by'))}</span> <a href="${esc(p.identity.href)}" target="_blank" rel="noopener"><span ${T(`${k}.identity`)}>${esc(putBare(`${k}.identity`, p.identity))}</span>${ARROW.ne}</a></p>` : '';
  // decision 17: a delivered site ends on the offer, with the home page's
  // own conditions, and its two ways in: the request, which lands on the
  // home page's form already written (data-prefill, scene/app.js), and
  // WhatsApp, opened on the home page's Aperçu line. ../#contact is the form
  // on the French page; its head sends an English or Arabic visitor on to
  // en/ or ar/ with the hash kept.
  const act = p.status === 'live' ? `
      <div class="sh-act">
        <a class="btn btn-primary" href="../#contact" data-prefill><span ${T('ui.act')}>${esc(uiBare('act'))}</span>${ARROW.e}</a>
        ${waLink('btn btn-teal', 'prev.waText', 'prev.wa')}
        <small ${T('prev.terms')}>${esc(home('prev.terms'))}</small>
      </div>` : '';

  const label = (pg, j, kind) => put(`${k}.${kind}${j}`, pg.label);
  // each capture's alt says what it is: whose site, which page (and its
  // address), that it is the live site, and on which screen (UI.alt*)
  const altOf = (pg, j, kind) => put(`${k}.${kind}a${j}`, Object.fromEntries(LANGS.map((l) =>
    [l, UI[l][kind === 'pha' ? 'altPhone' : 'altDesk'].replace('{name}', p.name).replace('{label}', pg.label[l]).replace('{path}', pg.path || '/')])));
  const [main, ...rest] = p.pages;
  label(main, 0, 'pg'); const mainAlt = altOf(main, 0, 'pg');

  const pages = rest.map((pg, j) => `<figure class="pg">
            ${shot(p.slug, pg.file, altOf(pg, j + 1, 'pg'), 'frame', 1440, 900, 'page').replace('alt=', `${T(`${k}.pga${j + 1}`, '-alt')} alt=`)}
            <figcaption><b ${T(`${k}.pg${j + 1}`)}>${esc(label(pg, j + 1, 'pg'))}</b><code>${esc(pg.path)}</code></figcaption>
          </figure>`).join('\n          ');

  const phones = p.phones.map((pg, j) => `<figure class="ph">
              ${shot(p.slug, pg.file, altOf(pg, j, 'pha'), 'phone', 780, 1688, 'phone').replace('alt=', `${T(`${k}.phaa${j}`, '-alt')} alt=`)}
              <figcaption ${T(`${k}.ph${j}`)}>${esc(label(pg, j, 'ph'))}</figcaption>
            </figure>`).join('\n            ');

  const sw = p.palette.map((c) => {
    const role = put('ui.role.' + c.role, Object.fromEntries(LANGS.map((l) => [l, UI[l].role[c.role]])));
    return `<li><i style="--c:${c.hex}"></i><b ${T('ui.role.' + c.role)}>${esc(role)}</b><code>${c.hex}</code></li>`;
  }).join('\n                ');

  // before/after pairs: a "before" file needs an "after" file of the same name
  const befores = files(p.slug, 'before'), afters = new Set(files(p.slug, 'after'));
  const pairs = befores.filter((f) => afters.has(f));
  // their alts name the side in the visitor's language, like the page captures
  const baAlt = (f, j, side, lbl) => put(`${k}.ba${j}${side}`, Object.fromEntries(LANGS.map((l) => [l, `${p.name} — ${caption(f)} (${UI[l][lbl]})`])));
  const ba = pairs.length ? `
      <section class="sh-block" aria-labelledby="ba-${p.slug} h-${p.slug}">
        <h3 class="sh-h" id="ba-${p.slug}" ${T('ui.before')}>${esc(ui('before'))}</h3>
        ${pairs.map((f, j) => `<figure class="ba">
          <div><span class="ba-tag" ${T('ui.beforeL')}>${esc(ui('beforeL'))}</span><a class="zoom frame" href="../assets/work/${p.slug}/before/${f}"><img src="../assets/work/${p.slug}/before/${f}" ${T(`${k}.ba${j}b`, '-alt')} alt="${esc(baAlt(f, j, 'b', 'beforeL'))}" loading="lazy" decoding="async"></a></div>
          <div><span class="ba-tag is-after" ${T('ui.afterL')}>${esc(ui('afterL'))}</span><a class="zoom frame" href="../assets/work/${p.slug}/after/${f}"><img src="../assets/work/${p.slug}/after/${f}" ${T(`${k}.ba${j}a`, '-alt')} alt="${esc(baAlt(f, j, 'a', 'afterL'))}" loading="lazy" decoding="async"></a></div>
          <figcaption>${esc(caption(f))}</figcaption>
        </figure>`).join('\n        ')}
      </section>` : '';

  const brand = files(p.slug, 'brand');
  const br = brand.length ? `
      <section class="sh-block" aria-labelledby="br-${p.slug} h-${p.slug}">
        <h3 class="sh-h" id="br-${p.slug}" ${T('ui.brand')}>${esc(ui('brand'))}</h3>
        <ul class="assets">
          ${brand.map((f) => `<li><a class="zoom" href="../assets/work/${p.slug}/brand/${f}"><img src="../assets/work/${p.slug}/brand/${f}" alt="${esc(p.name)} — ${esc(caption(f))}" loading="lazy" decoding="async"></a><span>${esc(caption(f))}</span></li>`).join('\n          ')}
        </ul>
      </section>` : '';

  // What the work gives the client (for the demo: what it shows; for our
  // product: what it gives its users). The client's context in one sentence,
  // then 3-5 things a visitor can do on the live site today, each with the
  // page that shows it. The home page's work cards link here (#gv-<slug>).
  const gainT = put('ui.gain.' + p.status, Object.fromEntries(LANGS.map((l) => [l, UI[l].gain[p.status]])));
  const ctxL = put('ui.ctxL.' + p.status, Object.fromEntries(LANGS.map((l) => [l, UI[l].ctxL[p.status]])));
  const gv = `
      <section class="sh-block gv" aria-labelledby="gv-${p.slug} h-${p.slug}">
        <h3 class="sh-h" id="gv-${p.slug}" ${T('ui.gain.' + p.status)}>${esc(gainT)}</h3>
        <div class="gv-body">
          <p class="gv-ctx"><b ${T('ui.ctxL.' + p.status)}>${esc(ctxL)}</b><span ${T(`${k}.ctx`)}>${esc(put(`${k}.ctx`, p.context))}</span></p>
          <ol class="gv-list">
            ${p.gains.map((g, j) => `<li><span class="gv-n" aria-hidden="true">${pad(j + 1)}</span><p ${T(`${k}.g${j}`)}>${esc(put(`${k}.g${j}`, g))}</p><code>${esc(g.at)}</code></li>`).join('\n            ')}
          </ol>
        </div>
      </section>`;

  // the client's own words, in the language they gave them (scripts/voices-data.mjs)
  const voices = VOICES.filter((v) => v.client === p.slug);
  const vq = voices.length ? `
      <section class="sh-block" aria-labelledby="vq-${p.slug} h-${p.slug}">
        <h3 class="sh-h" id="vq-${p.slug}" ${T('ui.voice')}>${esc(ui('voice'))}</h3>
        ${voices.map((v) => `<figure class="voice" lang="${v.lang}" dir="${v.lang === 'ar' ? 'rtl' : 'ltr'}">
          <blockquote><p>${esc(v.quote)}</p></blockquote>
          <figcaption>${v.name ? `<b>${esc(v.name)}</b>, ` : ''}${esc(v.role)} · ${esc(VOICE_CLIENTS[v.client])}</figcaption>
        </figure>`).join('\n        ')}
      </section>` : '';

  return `
    <!-- ===================== ${p.name} ===================== -->
    <article class="sheet" id="${p.slug}" aria-labelledby="h-${p.slug}">
      <span class="tick tl" aria-hidden="true"></span><span class="tick tr" aria-hidden="true"></span>
      <span class="tick bl" aria-hidden="true"></span><span class="tick br" aria-hidden="true"></span>
      <header class="sh-head">
        <span class="sh-no"><span ${T('ui.sheet')}>${esc(ui('sheet'))}</span> ${n}</span>
        <h2 id="h-${p.slug}" dir="ltr">${esc(p.name)}</h2>
        <span class="chip is-${p.status}" ${T(`${k}.status`)}>${esc(statusTxt)}</span>
        <a class="visit" href="${esc(p.url)}" title="${esc(fullHref(p.url))}"${ext ? ' target="_blank" rel="noopener"' : ''}><span ${T('ui.visit')}>${esc(visit)}</span> ${ext ? ARROW.ne : ARROW.e}</a>
      </header>

      <div class="sh-body">
        <div class="sh-spec">
          <p class="sh-sum" ${T(`${k}.summary`)}>${esc(t('summary'))}</p>
          <dl class="tblock">
          ${rows}
          </dl>
          <h3 class="sh-h" ${T('ui.deliverables')}>${esc(ui('deliverables'))}</h3>
          <ul class="deliv">
            ${deliv}
          </ul>${ident}
        </div>
        <figure class="sh-main">
          <div class="chrome" aria-hidden="true"><i></i><i></i><i></i><span dir="ltr">${esc(shownHost(p.url))}</span></div>
          ${shot(p.slug, main.file, mainAlt, 'frame', 1440, 900, 'main', i === 0).replace('alt=', `${T(`${k}.pga0`, '-alt')} alt=`)}
          <figcaption class="dims" aria-hidden="true"><span class="dim-w"><span>1440&nbsp;px</span></span><span class="dim-h">900</span></figcaption>
        </figure>
      </div>
${gv}

      <section class="sh-block sh-pgs" aria-labelledby="pg-${p.slug} h-${p.slug}">
        <h3 class="sh-h" id="pg-${p.slug}" ${T('ui.pages')}>${esc(ui('pages'))}</h3>
        <div class="pages">
          ${pages}
        </div>
      </section>

      <div class="sh-pair">
        <section class="sh-block sh-mob" aria-labelledby="mb-${p.slug} h-${p.slug}">
          <h3 class="sh-h" id="mb-${p.slug}" ${T('ui.mobile')}>${esc(ui('mobile'))}</h3>
          <div class="phones">
            ${phones}
          </div>
        </section>
        <section class="sh-block sh-sys" aria-labelledby="sy-${p.slug} h-${p.slug}">
          <h3 class="sh-h" id="sy-${p.slug}" ${T('ui.system')}>${esc(ui('system'))}</h3>
          <div class="system">
            <div>
              <h4 ${T('ui.palette')}>${esc(ui('palette'))}</h4>
              <ul class="swatches">
                ${sw}
              </ul>
            </div>
            <div>
              <h4 ${T('ui.type')}>${esc(ui('type'))}</h4>
              <ul class="faces" dir="ltr">
                ${p.type.map((f) => `<li>${esc(f)}</li>`).join('')}
              </ul>
            </div>
          </div>
        </section>
      </div>${ba}${br}${vq}${act}
    </article>`;
}

/* The work that is not a client's (the demo, our product) on a card each,
   side by side: its title, what it is, its home page in the browser frame
   and the way to it. The full sheet gave them 36% of the page on a phone,
   nine screens of work nobody ordered. The data keeps their pages, phones
   and gains (check.mjs reads them); the page shows the client sheets in
   full and these two in brief. */
function card(p, i) {
  const k = 'p.' + p.slug, main = p.pages[0];
  const ext = /^https?:/.test(p.url);
  const statusTxt = put(`${k}.status`, Object.fromEntries(LANGS.map((l) => [l, UI[l].status[p.status]])));
  const visit = put('ui.visit', Object.fromEntries(LANGS.map((l) => [l, UI[l].visit])));
  const sum = put(`${k}.summary`, Object.fromEntries(LANGS.map((l) => [l, p.t[l].summary])));
  put(`${k}.pg0`, main.label);
  const alt = put(`${k}.pga0`, Object.fromEntries(LANGS.map((l) => [l, UI[l].altDesk.replace('{name}', p.name).replace('{label}', main.label[l]).replace('{path}', main.path || '/')])));
  return `
      <!-- ===================== ${p.name} ===================== -->
      <article class="sheet sh-card" id="${p.slug}" aria-labelledby="h-${p.slug}">
        <span class="tick tl" aria-hidden="true"></span><span class="tick tr" aria-hidden="true"></span>
        <span class="tick bl" aria-hidden="true"></span><span class="tick br" aria-hidden="true"></span>
        <header class="sh-head">
          <span class="sh-no"><span ${T('ui.sheet')}>${esc(ui('sheet'))}</span> ${pad(i + 1)}</span>
          <h2 id="h-${p.slug}" dir="ltr">${esc(p.name)}</h2>
          <span class="chip is-${p.status}" ${T(`${k}.status`)}>${esc(statusTxt)}</span>
        </header>
        <p class="sh-sum" ${T(`${k}.summary`)}>${esc(sum)}</p>
        <figure class="sh-main">
          <div class="chrome" aria-hidden="true"><i></i><i></i><i></i><span dir="ltr">${esc(shownHost(p.url))}</span></div>
          ${shot(p.slug, main.file, alt, 'frame', 1440, 900, 'card').replace('alt=', `${T(`${k}.pga0`, '-alt')} alt=`)}
        </figure>
        <a class="visit" href="${esc(p.url)}" title="${esc(fullHref(p.url))}"${ext ? ' target="_blank" rel="noopener"' : ''}><span ${T('ui.visit')}>${esc(visit)}</span> ${ext ? ARROW.ne : ARROW.e}</a>
      </article>`;
}

// decision 16: the delivered sites first, then one heading over the sheets
// that are not client work (the demo, our product); the data keeps them
// last, or the heading would stand over a client's site
const cut = PROJECTS.findIndex((p) => p.status !== 'live');
if (PROJECTS.some((p, i) => i > cut && cut >= 0 && p.status === 'live')) throw new Error('scene-data: a live sheet after the demo/product group');
const group = cut < 0 ? '' : `
    <section class="others" aria-labelledby="others">
      <h2 class="group" id="others" ${T('ui.group')}>${esc(ui('group'))}</h2>
      <div class="cards">${PROJECTS.slice(cut).map((p, j) => card(p, cut + j)).join('\n')}
      </div>
    </section>`;
const sheets = PROJECTS.slice(0, cut < 0 ? undefined : cut).map((p, i) => sheet(p, i)).join('\n') + group;
const index = PROJECTS.map((p, i) => `<li><a href="#${p.slug}"><span class="ix-n">${pad(i + 1)}</span><span class="ix-name" dir="ltr">${esc(p.name)}</span><span class="ix-go" aria-hidden="true">↓</span></a></li>`).join('\n        ');

// the request a data-prefill link leaves for the home page's form
// (scene/app.js): the home page's own Aperçu request, in each language
home('prev.msg');

// withCsp: the policy meta after the viewport meta, hashing the head script
// (scripts/lib/csp.mjs); a data block like the dictionary is not hashed
const html = withCsp(`<!DOCTYPE html>
<html lang="fr" dir="ltr" data-theme="arcanum">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${esc(ui('title'))}</title>
<meta name="description" content="${esc(ui('desc'))}">
<meta name="theme-color" content="${VOID.arcanum}">
<meta name="color-scheme" content="dark">
<meta property="og:url" content="${BASE}scene/">
<link rel="alternate" hreflang="fr" href="${BASE}scene/">
<link rel="alternate" hreflang="en" href="${BASE}scene/?lang=en">
<link rel="alternate" hreflang="ar" href="${BASE}scene/?lang=ar">
<link rel="alternate" hreflang="x-default" href="${BASE}scene/">
<meta property="og:title" content="${esc(UI.fr.title)}">
<meta property="og:description" content="${esc(UI.fr.desc)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Numidea Labs">
<meta property="og:locale" content="fr_FR">
<!-- the page's own card, drawn in its drafting-sheet look (scripts/build-og.mjs) -->
<meta property="og:image" content="${BASE}scene/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(UI.fr.kicker)} — Numidea Labs : une planche de projet, son cadre coté 1440 px, sur le papier à dessin de la page">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(UI.fr.title)}">
<meta name="twitter:description" content="${esc(UI.fr.desc)}">
<meta name="twitter:image" content="${BASE}scene/og.jpg">
<!-- GENERATED by scripts/build-scene.mjs from scripts/scene-data.mjs.
     Edit the data, then run: npm run scene -->
<!-- Theme and language before first paint. The theme is the visitor's, the
     shared 'numidea-theme' key, validated as on every page (an unknown name
     would leave every token undefined: the theme blocks are the only place
     they are set); the markup carries Arcanum for scripts off. The sheet's
     own colours are aliases of the theme's tokens (style.css), so the
     drawing office follows Daylight or Noir as the home page does; the
     browser's bar and the controls' colour scheme follow it here.
     Language: ?lang= (a shared link), then the shared 'numidea-lang' key,
     validated. The text is baked in French; for EN/AR paint is held until
     ../assets/page-i18n.js has applied the dictionary, so nobody sees the
     French sheets first. The canonical is set here too: each ?lang= version
     names itself, and the served HTML names no other; og:url and og:locale
     follow it, as on the home page. ?lang= is read case-insensitively
     (?lang=AR is Arabic). If the hold is released before the dictionary was
     applied (slow network: the 1.5 s backstop), the baked French is shown
     left to right; lang keeps the chosen language, so page-i18n.js still
     applies it when it arrives. -->
<script>(function(){var d=document.documentElement,T=${JSON.stringify(THEMES)},V=${JSON.stringify(VOID)},G=${JSON.stringify(LIGHT)},L=['fr','en','ar'],th='arcanum',l='fr',q=null;
try{q=(new URLSearchParams(location.search).get('lang')||'').toLowerCase()||null;}catch(e){}
try{th=localStorage.getItem('numidea-theme')||th;l=localStorage.getItem('numidea-lang')||l;}catch(e){}
if(q&&L.indexOf(q)!==-1)l=q;if(T.indexOf(th)===-1)th='arcanum';if(L.indexOf(l)===-1)l='fr';
d.setAttribute('data-theme',th);d.lang=l;d.dir=l==='ar'?'rtl':'ltr';
var b=document.querySelector('meta[name="theme-color"]'),s=document.querySelector('meta[name="color-scheme"]');
if(b)b.setAttribute('content',V[th]);if(s)s.setAttribute('content',G.indexOf(th)===-1?'dark':'light');
var h='${BASE}scene/',c=document.createElement('link');c.rel='canonical';c.href=q===l&&l!=='fr'?h+'?lang='+l:h;document.head.appendChild(c);
if(c.href!==h){var m=function(p,v){var e=document.querySelector('meta[property="og:'+p+'"]');if(e)e.setAttribute('content',v);};m('url',c.href);m('locale',l==='ar'?'ar_DZ':'en_US');}
if(l==='ar')document.write('\\x3clink rel="preload" as="font" type="font/woff2" crossorigin href="../assets/fonts/ibm-plex-sans-arabic-400-arabic.woff2">\\x3clink rel="preload" as="font" type="font/woff2" crossorigin href="../assets/fonts/ibm-plex-sans-arabic-700-arabic.woff2">');
window.NUMIDEA_LANG=l;
if(l!=='fr'){d.setAttribute('data-i18n-pending','');var r=function(){if(d.hasAttribute('data-i18n-pending')){d.removeAttribute('data-i18n-pending');d.lang='fr';d.dir='ltr';}};document.addEventListener('DOMContentLoaded',r);setTimeout(r,1500);}})();</script>
<style>html[data-i18n-pending] body{display:none}</style>
<link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
<link rel="apple-touch-icon" href="../assets/apple-touch-icon.png">
<link rel="preload" as="font" type="font/woff2" crossorigin href="../assets/fonts/cinzel-700-latin.woff2">
<link rel="preload" as="font" type="font/woff2" crossorigin href="../assets/fonts/geist-latin.woff2">
<link rel="preload" as="font" type="font/woff2" crossorigin href="../assets/fonts/geist-mono-latin.woff2">
<link rel="stylesheet" href="../assets/fonts.css?v=${stamp}">
<link rel="stylesheet" href="../assets/themes.css?v=${stamp}">
<link rel="stylesheet" href="style.css?v=${stamp}">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Numidea Labs","item":"${BASE}"},{"@type":"ListItem","position":2,"name":"${esc(UI.fr.crumb)}","item":"${BASE}scene/"}]}</script>
</head>
<body>
<a class="skip" href="#sheets" ${T('ui.skip')}>${esc(ui('skip'))}</a>

<!-- the home page's masthead, on this page's sheet: the wordmark and where
     you are, the home page's sections from 1360px (where they fit beside
     the rest, in all three languages), the language, and the header's one
     action from 721px (the phone bar carries it below). Its inner row has
     the page's own width, so the wordmark stands on the sheets' edge. -->
<header class="hud">
  <div class="hud-bar">
  <nav class="bc" aria-label="${esc(ui('crumbNav'))}" ${T('ui.crumbNav', '-aria')}><ol>
    <li><a href="../" class="hud-logo" aria-label="Numidea Labs">${WORDMARK}</a></li>
    <li aria-current="page"><span ${T('ui.crumb')}>${esc(ui('crumb'))}</span></li>
  </ol></nav>
  <nav class="hud-nav" aria-label="${esc(home('ui.navPrimary'))}" ${T('ui.navPrimary', '-aria')}>
    ${[['../#work', 'nav.work'], ['../#services', 'nav.services'], ['../#apercu', 'nav.about'], ['../tarifs/', 'nav.pricing'], ['../#founder', 'nav.team'], ['../#faq', 'nav.faq'], ['../#contact', 'nav.contact']]
      .map(([h, key]) => `<a href="${h}" ${T(key)}>${esc(home(key))}</a>`).join('\n    ')}
  </nav>
  <div class="hud-end">
    <div class="lang" role="group" aria-label="${esc(ui('langs'))}" ${T('ui.langs', '-aria')}>
      <button type="button" data-lang="fr" aria-pressed="true" lang="fr" aria-label="Français (FR)">FR</button>
      <button type="button" data-lang="en" aria-pressed="false" lang="en" aria-label="English (EN)">EN</button>
      <button type="button" data-lang="ar" aria-pressed="false" aria-label="العربية (ع)">${AYN}</button>
    </div>
    <a class="btn btn-primary hud-cta" href="../#contact" data-prefill ${T('mbar.cta')}>${esc(home('mbar.cta'))}</a>
  </div>
  </div>
</header>

<main id="sheets" tabindex="-1">
  <header class="intro">
    <p class="kicker" ${T('ui.kicker')}>${esc(ui('kicker'))}</p>
    <h1 ${T('ui.h1', '-html')}>${ui('h1')}</h1>
    <p class="lead" ${T('ui.lead')}>${esc(ui('lead'))}</p>
    <nav class="index" ${T('ui.index', '-aria')} aria-label="${esc(ui('index'))}">
      <ol>
        ${index}
      </ol>
    </nav>
  </header>
${sheets}
</main>

<!-- the page's foot, outside <main> (the contentinfo landmark): the offer's
     two ways in, then the home page's price guide, Aperçu and contact -->
<footer class="outro">
  <div class="outro-in">
    <p class="outro-q" ${T('ui.contact')}>${esc(ui('contact'))}</p>
    <div class="outro-acts">
      <a class="btn btn-primary" href="../#contact" data-prefill><span ${T('ui.contactCta')}>${esc(uiBare('contactCta'))}</span>${ARROW.e}</a>
      ${waLink('btn btn-teal', 'prev.waText', 'prev.wa')}
    </div>
    <nav class="outro-nav" aria-label="${esc(home('footer.navAria'))}" ${T('footer.navAria', '-aria')}>
      <a href="../tarifs/" ${T('nav.pricing')}>${esc(home('nav.pricing'))}</a>
      <a href="../#apercu" ${T('nav.about')}>${esc(home('nav.about'))}</a>
      <a href="../#contact" ${T('nav.contact')}>${esc(home('nav.contact'))}</a>
      <a class="back" href="../#work"><span ${T('ui.back')}>${esc(uiBare('back'))}</span></a>
    </nav>
  </div>
</footer>

<!-- phones: the two ways in, kept in reach once the intro is passed (the
     home page's bar; scene/app.js shows it, and hides it while the foot,
     which offers the same two, is on screen) -->
<nav class="m-contact" aria-label="${esc(home('mbar.aria'))}" ${T('mbar.aria', '-aria')}>
  <a class="btn btn-primary" href="../#contact" data-prefill ${T('mbar.cta')}>${esc(home('mbar.cta'))}</a>
  ${waLink('btn btn-teal', 'wa.hello', 'footer.wa')}
</nav>

<!-- the capture at its own size: fitted to the screen on a desk, at 1:1
     in a scrolling pane on a phone (scene/app.js puts the image in it) -->
<dialog class="viewer" id="viewer" ${T('ui.viewer', '-aria')} aria-label="${esc(ui('viewer'))}">
  <form method="dialog"><button class="viewer-x" type="submit" ${T('ui.close', '-aria')} aria-label="${esc(ui('close'))}"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></form>
  <div class="viewer-pane" dir="ltr"></div>
</dialog>

<script type="application/json" id="i18n">${JSON.stringify(DICT).replace(/</g, '\\u003c')}</script>
<script src="../assets/page-i18n.js?v=${stamp}" defer></script>
<script src="../assets/carry.js?v=${stamp}" defer></script>
<script src="app.js?v=${stamp}" defer></script>
</body>
</html>
`, 'page');
export const SCENE_HTML = html;
const OUT = join(ROOT, 'scene/index.html');
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes('--check')) {
    const same = existsSync(OUT) && readFileSync(OUT, 'utf8') === html;
    console.log(same ? '✓ scene/index.html matches its generator' : '✗ scene/index.html differs from scripts/build-scene.mjs output (run: npm run scene)');
    process.exit(same ? 0 : 1);
  }
  writeFileSync(OUT, html);
  console.log('✓ scene/index.html — ' + PROJECTS.length + ' sheets, ' + Object.keys(DICT.fr).length + ' strings × 3 languages');
for (const p of PROJECTS) {
  const b = files(p.slug, 'before').length, a = files(p.slug, 'after').length, r = files(p.slug, 'brand').length;
  if (b || a || r) console.log(`  ${p.slug}: before ${b} · after ${a} · brand ${r}`);
}
}
