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

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const stamp = (readFileSync(join(ROOT, 'index.html'), 'utf8').match(/\?v=(\d+)/) || [, '1'])[1];
const LANGS = ['fr', 'en', 'ar'];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const BASE = 'https://brvetr4ve1er.github.io/Numidea.tech/';

/* every translatable string gets a key; the dictionary ships inline */
const DICT = { fr: {}, en: {}, ar: {} };
const put = (key, byLang) => { for (const l of LANGS) DICT[l][key] = byLang[l]; return byLang.fr; };
const ui = (k) => put('ui.' + k, Object.fromEntries(LANGS.map((l) => [l, UI[l][k]])));
const T = (key, attr = '') => `data-i18n${attr}="${key}"`;

const files = (slug, sub, exts = ['.webp', '.png', '.jpg', '.jpeg', '.svg']) => {
  const d = join(ROOT, 'assets/work', slug, sub);
  return existsSync(d) ? readdirSync(d).filter((f) => exts.includes(extname(f).toLowerCase())).sort() : [];
};
const caption = (f) => basename(f, extname(f)).replace(/[-_]+/g, ' ');
const pad = (n) => String(n).padStart(2, '0');

function shot(slug, file, alt, cls, w, h, eager) {
  const src = `../assets/work/${slug}/${file}.webp`;
  if (!existsSync(join(ROOT, 'assets/work', slug, file + '.webp'))) throw new Error('missing capture ' + src);
  return `<a class="zoom ${cls}" href="${src}"><img src="${src}" alt="${esc(alt)}" width="${w}" height="${h}" decoding="async"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}></a>`;
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
    ['langsL', p.langs, null],
  ].filter(Boolean).map(([lbl, val, key]) =>
    `<div><dt ${T('ui.' + lbl)}>${esc(ui(lbl))}</dt><dd${key ? ' ' + T(key) : ''}>${esc(val)}</dd></div>`).join('\n          ');

  const deliv = p.t.fr.deliverables.map((d, j) =>
    `<li ${T(`${k}.d${j}`)}>${esc(put(`${k}.d${j}`, Object.fromEntries(LANGS.map((l) => [l, p.t[l].deliverables[j]]))))}</li>`).join('\n            ');

  const label = (pg, j, kind) => put(`${k}.${kind}${j}`, pg.label);
  const altOf = (pg, j, kind) => put(`${k}.${kind}a${j}`, Object.fromEntries(LANGS.map((l) => [l, `${p.name} — ${pg.label[l]}`])));
  const [main, ...rest] = p.pages;
  label(main, 0, 'pg'); const mainAlt = altOf(main, 0, 'pg');

  const pages = rest.map((pg, j) => `<figure class="pg">
            ${shot(p.slug, pg.file, altOf(pg, j + 1, 'pg'), 'frame', 1440, 900).replace('alt=', `${T(`${k}.pga${j + 1}`, '-alt')} alt=`)}
            <figcaption><b ${T(`${k}.pg${j + 1}`)}>${esc(label(pg, j + 1, 'pg'))}</b><code>${esc(pg.path)}</code></figcaption>
          </figure>`).join('\n          ');

  const phones = p.phones.map((pg, j) => `<figure class="ph">
              ${shot(p.slug, pg.file, altOf(pg, j, 'pha'), 'phone', 780, 1688).replace('alt=', `${T(`${k}.phaa${j}`, '-alt')} alt=`)}
              <figcaption ${T(`${k}.ph${j}`)}>${esc(label(pg, j, 'ph'))}</figcaption>
            </figure>`).join('\n            ');

  const sw = p.palette.map((c) => {
    const role = put('ui.role.' + c.role, Object.fromEntries(LANGS.map((l) => [l, UI[l].role[c.role]])));
    return `<li><i style="--c:${c.hex}"></i><b ${T('ui.role.' + c.role)}>${esc(role)}</b><code>${c.hex}</code></li>`;
  }).join('\n                ');

  // before/after pairs: a "before" file needs an "after" file of the same name
  const befores = files(p.slug, 'before'), afters = new Set(files(p.slug, 'after'));
  const pairs = befores.filter((f) => afters.has(f));
  const ba = pairs.length ? `
      <section class="sh-block" aria-labelledby="ba-${p.slug} h-${p.slug}">
        <h3 class="sh-h" id="ba-${p.slug}" ${T('ui.before')}>${esc(ui('before'))}</h3>
        ${pairs.map((f) => `<figure class="ba">
          <div><span class="ba-tag" ${T('ui.beforeL')}>${esc(ui('beforeL'))}</span><a class="zoom frame" href="../assets/work/${p.slug}/before/${f}"><img src="../assets/work/${p.slug}/before/${f}" alt="${esc(p.name)} — ${esc(caption(f))} (${esc(UI.fr.beforeL)})" loading="lazy" decoding="async"></a></div>
          <div><span class="ba-tag is-after" ${T('ui.afterL')}>${esc(ui('afterL'))}</span><a class="zoom frame" href="../assets/work/${p.slug}/after/${f}"><img src="../assets/work/${p.slug}/after/${f}" alt="${esc(p.name)} — ${esc(caption(f))} (${esc(UI.fr.afterL)})" loading="lazy" decoding="async"></a></div>
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

  return `
    <!-- ===================== ${p.name} ===================== -->
    <article class="sheet" id="${p.slug}" aria-labelledby="h-${p.slug}">
      <span class="tick tl" aria-hidden="true"></span><span class="tick tr" aria-hidden="true"></span>
      <span class="tick bl" aria-hidden="true"></span><span class="tick br" aria-hidden="true"></span>
      <header class="sh-head">
        <span class="sh-no"><span ${T('ui.sheet')}>${esc(ui('sheet'))}</span> ${n}</span>
        <h2 id="h-${p.slug}" dir="ltr">${esc(p.name)}</h2>
        <span class="chip is-${p.status}" ${T(`${k}.status`)}>${esc(statusTxt)}</span>
        <a class="visit" href="${esc(p.url)}"${ext ? ' target="_blank" rel="noopener"' : ''}><span ${T('ui.visit')}>${esc(visit)}</span> <span aria-hidden="true">${ext ? '↗' : '→'}</span></a>
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
          </ul>
        </div>
        <figure class="sh-main">
          <div class="chrome" aria-hidden="true"><i></i><i></i><i></i><span dir="ltr">${esc(p.url.replace(/^https?:\/\//, '').replace(/^\.\.\//, 'numidea.labs/'))}${esc(main.path === '/' ? '' : main.path)}</span></div>
          ${shot(p.slug, main.file, mainAlt, 'frame', 1440, 900, i === 0).replace('alt=', `${T(`${k}.pga0`, '-alt')} alt=`)}
          <figcaption class="dims" aria-hidden="true"><span class="dim-w">1440 px</span><span class="dim-h">900</span></figcaption>
        </figure>
      </div>

      <section class="sh-block" aria-labelledby="pg-${p.slug} h-${p.slug}">
        <h3 class="sh-h" id="pg-${p.slug}" ${T('ui.pages')}>${esc(ui('pages'))}</h3>
        <div class="pages">
          ${pages}
        </div>
      </section>

      <div class="sh-pair">
        <section class="sh-block" aria-labelledby="mb-${p.slug} h-${p.slug}">
          <h3 class="sh-h" id="mb-${p.slug}" ${T('ui.mobile')}>${esc(ui('mobile'))}</h3>
          <div class="phones">
            ${phones}
          </div>
        </section>
        <section class="sh-block" aria-labelledby="sy-${p.slug} h-${p.slug}">
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
      </div>${ba}${br}
    </article>`;
}

const sheets = PROJECTS.map(sheet).join('\n');
const index = PROJECTS.map((p, i) => `<li><a href="#${p.slug}"><span class="ix-n">${pad(i + 1)}</span><span class="ix-name" dir="ltr">${esc(p.name)}</span></a></li>`).join('\n        ');

const html = `<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${esc(ui('title'))}</title>
<meta name="description" content="${esc(ui('desc'))}">
<meta name="theme-color" content="#0A1420">
<meta name="color-scheme" content="dark">
<link rel="canonical" href="${BASE}scene/">
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
<meta property="og:image" content="${BASE}assets/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${BASE}assets/og.jpg">
<!-- GENERATED by scripts/build-scene.mjs from scripts/scene-data.mjs.
     Edit the data, then run: npm run scene -->
<!-- Language before first paint: ?lang= (a shared link), then the shared
     'numidea-lang' key, validated. The text is baked in French; for EN/AR
     paint is held until ../assets/page-i18n.js has applied the dictionary,
     so nobody sees the French sheets first. -->
<script>(function(){var d=document.documentElement,L=['fr','en','ar'],l='fr',q=null;
try{q=new URLSearchParams(location.search).get('lang');}catch(e){}
try{l=localStorage.getItem('numidea-lang')||l;}catch(e){}
if(q&&L.indexOf(q)!==-1)l=q;if(L.indexOf(l)===-1)l='fr';
d.lang=l;d.dir=l==='ar'?'rtl':'ltr';
if(l==='ar')document.write('<link rel="preload" as="font" type="font/woff2" crossorigin href="../assets/fonts/ibm-plex-sans-arabic-400-arabic.woff2"><link rel="preload" as="font" type="font/woff2" crossorigin href="../assets/fonts/ibm-plex-sans-arabic-700-arabic.woff2">');
if(l!=='fr'){d.setAttribute('data-i18n-pending','');var r=function(){d.removeAttribute('data-i18n-pending');};document.addEventListener('DOMContentLoaded',r);setTimeout(r,1500);}})();</script>
<style>html[data-i18n-pending] body{display:none}</style>
<link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
<link rel="preload" as="font" type="font/woff2" crossorigin href="../assets/fonts/cinzel-700-latin.woff2">
<link rel="preload" as="font" type="font/woff2" crossorigin href="../assets/fonts/geist-400-latin.woff2">
<link rel="preload" as="font" type="font/woff2" crossorigin href="../assets/fonts/geist-mono-400-latin.woff2">
<link rel="stylesheet" href="../assets/fonts.css?v=${stamp}">
<link rel="stylesheet" href="style.css?v=${stamp}">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Numidea Labs","item":"${BASE}"},{"@type":"ListItem","position":2,"name":"Planches","item":"${BASE}scene/"}]}</script>
</head>
<body>
<a class="skip" href="#sheets">Aller aux planches · Skip to the sheets</a>

<header class="hud">
  <nav class="bc" aria-label="Breadcrumb"><ol>
    <li><a href="../" class="hud-logo"><span class="d" aria-hidden="true">◆</span> NUMIDEA LABS</a></li>
    <li aria-current="page"><span ${T('ui.crumb')}>${esc(ui('crumb'))}</span></li>
  </ol></nav>
  <div class="lang" role="group" aria-label="Language">
    <button type="button" data-lang="fr" aria-pressed="true">FR</button>
    <button type="button" data-lang="en" aria-pressed="false">EN</button>
    <button type="button" data-lang="ar" aria-pressed="false" lang="ar">ع</button>
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

  <footer class="outro">
    <p ${T('ui.contact')}>${esc(ui('contact'))}</p>
    <a class="cta" href="../#contact" ${T('ui.contactCta')}>${esc(ui('contactCta'))}</a>
    <a class="back" href="../#work" ${T('ui.back')}>${esc(ui('back'))}</a>
  </footer>
</main>

<dialog class="viewer" id="viewer" ${T('ui.viewer', '-aria')} aria-label="${esc(ui('viewer'))}">
  <form method="dialog"><button class="viewer-x" type="submit" ${T('ui.close', '-aria')} aria-label="${esc(ui('close'))}">×</button></form>
</dialog>

<script type="application/json" id="i18n">${JSON.stringify(DICT).replace(/</g, '\\u003c')}</script>
<script src="../assets/page-i18n.js?v=${stamp}" defer></script>
<script src="app.js?v=${stamp}" defer></script>
</body>
</html>
`;
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
