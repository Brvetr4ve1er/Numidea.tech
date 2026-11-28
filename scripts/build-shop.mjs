#!/usr/bin/env node
/* Builds the Tr4velerz Studio store (tr4velerz.studio = shop/, Vercel project numidea-shop) from
 * scripts/shop-data.mjs: the hub, the five sections and the bag, in FR (root), EN (/en/) and AR (/ar/),
 * plus shop/assets/catalog.js and shop/sitemap.xml. The CMF Buds product pages (shop/gadgets/cmf-buds-2a/,
 * shop/ar/gadgets/cmf-buds-2a/) are hand-written and only linked from here.
 *
 *   node scripts/build-shop.mjs          write the pages
 *   node scripts/build-shop.mjs --check  fail if a page on disk differs from what the data builds
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SECTIONS, PRODUCTS, WHATSAPP_FALLBACK } from './shop-data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'shop');
const BASE = 'https://tr4velerz.studio/';
const NUMIDEA = 'https://www.numedialab.dev/';
const LANGS = ['fr', 'en', 'ar'];
const PRE = { fr: '', en: 'en/', ar: 'ar/' };
const CHECK = process.argv.includes('--check');

const T = {
  fr: {
    store: 'Tr4velerz Studio', tag: 'La boutique de l’univers Numidea',
    heroK: 'Comptoir des voyageurs', heroH: 'Choisis ta porte',
    heroSay: 'Salut, voyageur. Moi c’est Kūro. Ici on vend les objets de l’univers Numidea : vêtements, mangas, jeux, applis et gadgets. Choisis une porte, je te suis.',
    doors: 'Les portes', open: 'Ouvert', soon: 'Bientôt', enter: 'Entrer',
    showcase: 'En vitrine', how: 'Comment commander',
    steps: [
      ['Remplis ton sac', 'Ajoute les objets, choisis la couleur ou la taille.'],
      ['Envoie sur WhatsApp', 'Ton sac part en un message, avec un numéro de commande.'],
      ['Paie comme tu veux', 'À la livraison, ou par CCP / BaridiMob. On confirme tout sur WhatsApp.'],
    ],
    bag: 'Sac', bagH: 'Ton sac', bagEmpty: 'Ton sac est vide. Kūro attend que tu choisisses quelque chose.',
    add: 'Ajouter au sac', added: 'Dans le sac', see: 'Voir le produit', priceSoon: 'Prix bientôt',
    teaser: 'En préparation', waitH: 'Préviens-moi', waitBtn: 'Préviens-moi sur WhatsApp',
    waitMsg: (s) => `Bonjour Tr4velerz ! Prévenez-moi quand ${s} ouvre.`,
    shelfEmpty: 'Étagère en préparation', slot: 'Emplacement libre',
    back: 'Toutes les portes', qty: 'Quantité', remove: 'Retirer', total: 'Total',
    delivery: 'Livraison en plus, selon la wilaya : on te donne le prix sur WhatsApp.',
    form: { name: 'Nom et prénom', phone: 'Téléphone', wilaya: 'Wilaya', addr: 'Adresse (commune, rue)', pay: 'Paiement' },
    pays: [['cod', 'À la livraison'], ['ccp', 'CCP / BaridiMob'], ['ask', 'On en parle sur WhatsApp']],
    send: 'Envoyer la commande sur WhatsApp', sent: 'WhatsApp s’ouvre avec ta commande. Si rien ne s’ouvre, copie le message ci-dessous.',
    copy: 'Copier le message', copied: 'Copié',
    ref: 'Commande', msgHi: 'Bonjour Tr4velerz ! Je voudrais commander :',
    need: 'Il manque :', from: 'Un projet de', numidea: 'Numidea Labs', map: 'La Carte du monde Numidea',
    langName: 'Français', skip: 'Aller au contenu', da: 'DA',
  },
  en: {
    store: 'Tr4velerz Studio', tag: 'The store of the Numidea world',
    heroK: 'The travellers’ counter', heroH: 'Pick your door',
    heroSay: 'Hi, traveller. I’m Kūro. This is where the objects of the Numidea world are sold: clothing, manga, games, apps and gadgets. Pick a door and I’ll follow you.',
    doors: 'The doors', open: 'Open', soon: 'Soon', enter: 'Enter',
    showcase: 'In the window', how: 'How to order',
    steps: [
      ['Fill your bag', 'Add the items, choose the colour or the size.'],
      ['Send it on WhatsApp', 'Your bag goes out as one message, with an order number.'],
      ['Pay your way', 'On delivery, or by CCP / BaridiMob. We confirm everything on WhatsApp.'],
    ],
    bag: 'Bag', bagH: 'Your bag', bagEmpty: 'Your bag is empty. Kūro is waiting for you to pick something.',
    add: 'Add to bag', added: 'In the bag', see: 'See the product', priceSoon: 'Price soon',
    teaser: 'In the works', waitH: 'Tell me first', waitBtn: 'Tell me on WhatsApp',
    waitMsg: (s) => `Hi Tr4velerz! Let me know when ${s} opens.`,
    shelfEmpty: 'Shelf in the works', slot: 'Empty slot',
    back: 'All the doors', qty: 'Quantity', remove: 'Remove', total: 'Total',
    delivery: 'Delivery is extra and depends on your wilaya: we give you the price on WhatsApp.',
    form: { name: 'Full name', phone: 'Phone', wilaya: 'Wilaya', addr: 'Address (town, street)', pay: 'Payment' },
    pays: [['cod', 'On delivery'], ['ccp', 'CCP / BaridiMob'], ['ask', 'Let’s talk on WhatsApp']],
    send: 'Send the order on WhatsApp', sent: 'WhatsApp opens with your order. If nothing opens, copy the message below.',
    copy: 'Copy the message', copied: 'Copied',
    ref: 'Order', msgHi: 'Hi Tr4velerz! I would like to order:',
    need: 'Missing:', from: 'A project by', numidea: 'Numidea Labs', map: 'The Numidea world map',
    langName: 'English', skip: 'Skip to content', da: 'DA',
  },
  ar: {
    store: 'Tr4velerz Studio', tag: 'متجر عالم نوميديا',
    heroK: 'دكّان المسافرين', heroH: 'اختر بابك',
    heroSay: 'أهلًا أيها المسافر. أنا كورو. هنا تُباع أشياء عالم نوميديا: ملابس، مانغا، ألعاب، تطبيقات وأجهزة. اختر بابًا وسأتبعك.',
    doors: 'الأبواب', open: 'مفتوح', soon: 'قريبًا', enter: 'ادخل',
    showcase: 'في الواجهة', how: 'كيف تطلب',
    steps: [
      ['املأ حقيبتك', 'أضف الأشياء واختر اللون أو المقاس.'],
      ['أرسلها على واتساب', 'تذهب حقيبتك في رسالة واحدة مع رقم الطلب.'],
      ['ادفع كما تحب', 'عند الاستلام، أو عبر CCP / بريدي موب. نؤكد كل شيء على واتساب.'],
    ],
    bag: 'الحقيبة', bagH: 'حقيبتك', bagEmpty: 'حقيبتك فارغة. كورو ينتظر أن تختار شيئًا.',
    add: 'أضف إلى الحقيبة', added: 'في الحقيبة', see: 'شاهد المنتج', priceSoon: 'السعر قريبًا',
    teaser: 'قيد التحضير', waitH: 'أعلمني أولًا', waitBtn: 'أعلمني على واتساب',
    waitMsg: (s) => `مرحبًا Tr4velerz! أعلموني عندما يُفتح ${s}.`,
    shelfEmpty: 'رفّ قيد التحضير', slot: 'مكان شاغر',
    back: 'كل الأبواب', qty: 'الكمية', remove: 'إزالة', total: 'المجموع',
    delivery: 'التوصيل إضافي حسب الولاية: نعطيك السعر على واتساب.',
    form: { name: 'الاسم واللقب', phone: 'الهاتف', wilaya: 'الولاية', addr: 'العنوان (البلدية، الشارع)', pay: 'الدفع' },
    pays: [['cod', 'عند الاستلام'], ['ccp', 'CCP / بريدي موب'], ['ask', 'نتحدث على واتساب']],
    send: 'أرسل الطلب على واتساب', sent: 'يُفتح واتساب مع طلبك. إن لم يُفتح شيء، انسخ الرسالة أدناه.',
    copy: 'انسخ الرسالة', copied: 'نُسخت',
    ref: 'الطلب', msgHi: 'مرحبًا Tr4velerz! أود أن أطلب:',
    need: 'ينقص:', from: 'مشروع من', numidea: 'Numidea Labs', map: 'خريطة عالم نوميديا',
    langName: 'العربية', skip: 'انتقل إلى المحتوى', da: 'دج',
  },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = (n, l) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, l === 'en' ? ',' : '\u202F')}\u00A0${T[l].da}`;
const url = (l, path = '') => '/' + PRE[l] + path;
const abs = (l, path = '') => BASE + PRE[l] + path;
const isOpen = (s) => PRODUCTS.some((p) => p.section === s.id && p.ready);

function head(l, { title, desc, path, noindex }) {
  const alt = LANGS.map((x) => `<link rel="alternate" hreflang="${x}" href="${abs(x, path)}">`).join('\n');
  return `<!doctype html>
<html lang="${l}" dir="${l === 'ar' ? 'rtl' : 'ltr'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex">\n' : ''}<link rel="canonical" href="${abs(l, path)}">
${alt}
<link rel="alternate" hreflang="x-default" href="${abs('fr', path)}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${abs(l, path)}"><meta property="og:image" content="${BASE}assets/og.jpg">
<meta name="theme-color" content="#211E1B">
<link rel="preload" href="/assets/fonts/archivo-cond-900-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/store.css">
<script src="/config.js" defer></script>
<script src="/assets/catalog.js" defer></script>
<script src="/assets/store.js" defer></script>
</head>`;
}

function top(l, path) {
  const t = T[l];
  const langs = LANGS.filter((x) => x !== l).map((x) => `<a href="${url(x, path)}" hreflang="${x}" lang="${x}">${T[x].langName}</a>`).join('');
  return `<body data-lang="${l}">
<a class="skip" href="#main">${t.skip}</a>
<header class="bar">
  <a class="brand" href="${url(l)}"><span class="brand__mark" aria-hidden="true">T4</span><span class="brand__name" dir="ltr">Tr4velerz<b>Studio</b></span></a>
  <nav class="bar__nav" aria-label="${esc(t.doors)}">
    <span class="bar__langs">${langs}</span>
    <a class="bagbtn" href="${url(l, 'sac/')}"><span>${t.bag}</span><b class="g-num" data-bag-count>0</b></a>
  </nav>
</header>
<div class="tape" aria-hidden="true"><span>${esc(t.tag)} · ${esc(t.tag)} · ${esc(t.tag)} · ${esc(t.tag)} · ${esc(t.tag)}</span></div>`;
}

function foot(l) {
  const t = T[l];
  return `<footer class="foot">
  <img class="foot__cat" src="/assets/kuro/leave.webp" width="240" height="209" alt="" loading="lazy">
  <p class="foot__from">${t.from} <a href="${NUMIDEA}${l === 'fr' ? '' : l + '/'}?from=tr4velerz">${t.numidea}</a></p>
  <p class="foot__links"><a href="${NUMIDEA}carte/?from=tr4velerz">${t.map}</a> · <span dir="ltr">tr4velerz.studio</span></p>
</footer>
</body>
</html>
`;
}

function say(l, kuro, text, cls = '') {
  return `<div class="say ${cls}">
  <img class="say__cat" src="/assets/kuro/${kuro}.webp" alt="" width="240" height="200">
  <div class="say__box"><p class="say__who g-label">Kūro</p><p class="say__txt">${esc(text)}</p></div>
</div>`;
}

function card(l, p) {
  const t = T[l];
  const pic = p.img
    ? `<img src="/${p.img}" alt="" loading="lazy" width="560" height="559">`
    : `<img class="card__kuro" src="/assets/kuro/${p.kuro || 'judge'}.webp" alt="" loading="lazy" width="240" height="190">`;
  const price = p.price != null ? `<p class="card__price g-num">${fmt(p.price, l)}</p>` : `<p class="card__price card__price--soon g-label">${t.priceSoon}</p>`;
  const opt = p.ready && p.options
    ? `<label class="card__opt"><span class="g-label">${esc(p.options.label[l])}</span><select data-opt="${p.id}">${p.options.values.map((v) => `<option value="${v.id}">${esc(v[l])}</option>`).join('')}</select></label>`
    : '';
  const page = p.page ? `<a class="g-btn" href="/${p.page[l]}">${t.see}</a>` : '';
  const add = p.ready && p.price != null ? `<button class="g-btn g-btn--hot" type="button" data-add="${p.id}" data-added="${esc(t.added)}">${t.add}</button>` : '';
  const chip = p.ready ? '' : `<span class="chip chip--soon g-label">${t.teaser}</span>`;
  return `<article class="card${p.ready ? '' : ' card--teaser'}" id="p-${p.id}">
  <div class="card__pic">${pic}${chip}</div>
  <div class="card__body">
    <h3 class="card__name">${esc(p.name[l])}</h3>
    ${p.note ? `<p class="card__note">${esc(p.note[l])}</p>` : ''}
    ${price}
    ${opt}
    <div class="card__go">${add}${page}</div>
  </div>
</article>`;
}

function slots(l, n) {
  return Array.from({ length: n }, () => `<div class="slot" aria-hidden="true"><span class="slot__lock"></span><span class="g-label">${T[l].slot}</span></div>`).join('\n');
}

function hub(l) {
  const t = T[l];
  const doors = SECTIONS.map((s) => {
    const open = isOpen(s);
    return `<li class="door door--${s.id}${open ? ' is-open' : ''}">
  <a href="${url(l, s.id + '/')}">
    <span class="door__n g-num" aria-hidden="true">${s.n}</span>
    <span class="door__city g-label">${esc(s.city[l])}</span>
    <span class="door__name">${esc(s.name[l])}</span>
    <span class="door__sub">${esc(s.sub[l])}</span>
    <span class="chip ${open ? 'chip--open' : 'chip--soon'} g-label">${open ? t.open : t.soon}</span>
    <img class="door__cat" src="/assets/kuro/${s.kuro}.webp" alt="" loading="lazy" width="240" height="190">
  </a>
</li>`;
  }).join('\n');
  const shown = PRODUCTS.slice(0, 4).map((p) => card(l, p)).join('\n');
  const steps = t.steps.map(([h, p], i) => `<li><span class="step__n g-num" aria-hidden="true">${i + 1}</span><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join('');
  return head(l, { title: `${t.store} · ${t.tag}`, desc: t.heroSay, path: '' }) + '\n' + top(l, '') + `
<main id="main">
  <section class="hero">
    <p class="g-label hero__k">${esc(t.heroK)}</p>
    <h1 class="hero__h">${esc(t.heroH)}</h1>
    ${say(l, 'love', t.heroSay, 'say--hero')}
  </section>
  <section class="band" aria-labelledby="h-doors">
    <h2 class="band__h" id="h-doors"><span class="g-label">${SECTIONS.length}</span> ${esc(t.doors)}</h2>
    <ul class="doors">
${doors}
    </ul>
  </section>
  <section class="band" aria-labelledby="h-show">
    <h2 class="band__h" id="h-show">${esc(t.showcase)}</h2>
    <div class="shelf">
${shown}
    </div>
  </section>
  <section class="band band--ink" aria-labelledby="h-how">
    <h2 class="band__h" id="h-how">${esc(t.how)}</h2>
    <ol class="steps">${steps}</ol>
  </section>
</main>
` + foot(l);
}

function section(l, s) {
  const t = T[l];
  const items = PRODUCTS.filter((p) => p.section === s.id);
  const open = isOpen(s);
  const waitTxt = t.waitMsg(s.name[l]);
  const wait = !open || s.kind === 'digital'
    ? `<div class="wait"><p class="g-label">${t.waitH}</p><a class="g-btn g-btn--hot" data-wa="${esc(waitTxt)}" href="https://wa.me/${WHATSAPP_FALLBACK}?text=${encodeURIComponent(waitTxt)}" target="_blank" rel="noopener">${t.waitBtn}</a></div>`
    : '';
  const shelf = items.map((p) => card(l, p)).join('\n') + '\n' + slots(l, Math.max(0, 3 - items.length));
  return head(l, { title: `${s.name[l]} · ${t.store}`, desc: `${s.sub[l]}. ${s.say[l]}`, path: s.id + '/', noindex: !open }) + '\n' + top(l, s.id + '/') + `
<main id="main" class="sec sec--${s.id}">
  <p class="crumb"><a href="${url(l)}">← ${esc(t.back)}</a></p>
  <section class="sec__head">
    <span class="sec__n g-num" aria-hidden="true">${s.n}</span>
    <p class="g-label">${esc(s.city[l])} · ${open ? t.open : t.soon}</p>
    <h1 class="hero__h">${esc(s.name[l])}</h1>
    <p class="sec__sub">${esc(s.sub[l])}</p>
    ${say(l, s.kuro, s.say[l])}
    ${wait}
  </section>
  <section class="band" aria-label="${esc(s.name[l])}">
    <div class="shelf">
${shelf}
    </div>
  </section>
</main>
` + foot(l);
}

function bag(l) {
  const t = T[l];
  const f = t.form;
  const pays = t.pays.map(([v, n], i) => `<label class="pay"><input type="radio" name="pay" value="${v}"${i === 0 ? ' checked' : ''}><span>${esc(n)}</span></label>`).join('');
  return head(l, { title: `${t.bagH} · ${t.store}`, desc: t.delivery, path: 'sac/', noindex: true }) + '\n' + top(l, 'sac/') + `
<main id="main" class="sacpage">
  <p class="crumb"><a href="${url(l)}">← ${esc(t.back)}</a></p>
  <h1 class="hero__h">${esc(t.bagH)}</h1>
  <div class="sac" data-sac>
    <div class="sac__empty" data-sac-empty>${say(l, 'judge', t.bagEmpty)}</div>
    <ul class="sac__list" data-sac-list></ul>
    <p class="sac__total" data-sac-total hidden><span class="g-label">${t.total}</span> <b class="g-num" data-sac-sum></b></p>
    <p class="sac__note">${esc(t.delivery)}</p>
    <form class="order" data-order hidden novalidate>
      <label><span class="g-label">${f.name}</span><input id="o-name" name="name" autocomplete="name" required></label>
      <label><span class="g-label">${f.phone}</span><input id="o-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" required></label>
      <label><span class="g-label">${f.wilaya}</span><input id="o-wilaya" name="wilaya" autocomplete="address-level1" required></label>
      <label><span class="g-label">${f.addr}</span><input id="o-addr" name="addr" autocomplete="street-address" required></label>
      <fieldset><legend class="g-label">${f.pay}</legend><div class="pays">${pays}</div></fieldset>
      <p class="order__err" data-order-err role="alert" hidden></p>
      <button class="g-btn g-btn--hot g-btn--big" type="submit">${t.send}</button>
      <div class="order__done" data-order-done hidden>
        <p>${esc(t.sent)}</p>
        <pre class="order__msg" data-order-msg></pre>
        <button class="g-btn" type="button" data-copy data-copied="${esc(t.copied)}">${t.copy}</button>
      </div>
    </form>
  </div>
</main>
` + foot(l);
}

function catalogJs() {
  const data = {
    wa: WHATSAPP_FALLBACK,
    t: Object.fromEntries(LANGS.map((l) => [l, {
      qty: T[l].qty, remove: T[l].remove, ref: T[l].ref, hi: T[l].msgHi, total: T[l].total, need: T[l].need, da: T[l].da,
      form: T[l].form, pays: Object.fromEntries(T[l].pays),
    }])),
    products: Object.fromEntries(PRODUCTS.filter((p) => p.ready && p.price != null).map((p) => [p.id, {
      name: p.name, price: p.price, max: p.max || 5, img: p.img || null, kuro: p.kuro || 'judge',
      options: p.options ? Object.fromEntries(p.options.values.map((v) => [v.id, { fr: v.fr, en: v.en, ar: v.ar }])) : null,
    }])),
  };
  return `/* Generated by scripts/build-shop.mjs from scripts/shop-data.mjs. Do not edit by hand. */\nwindow.TR4 = ${JSON.stringify(data).replace(/</g, '\\u003c')};\n`;
}

function sitemap() {
  const pages = [''].concat(SECTIONS.filter(isOpen).map((s) => s.id + '/'));
  const rows = pages.map((p) => LANGS.map((l) => `<url><loc>${abs(l, p)}</loc>${LANGS.map((x) => `<xhtml:link rel="alternate" hreflang="${x}" href="${abs(x, p)}"/>`).join('')}</url>`).join('\n')).join('\n');
  const buds = ['gadgets/cmf-buds-2a/', 'ar/gadgets/cmf-buds-2a/'].map((p) => `<url><loc>${BASE}${p}</loc><xhtml:link rel="alternate" hreflang="fr-DZ" href="${BASE}gadgets/cmf-buds-2a/"/><xhtml:link rel="alternate" hreflang="ar-DZ" href="${BASE}ar/gadgets/cmf-buds-2a/"/></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${rows}\n${buds}\n</urlset>\n`;
}

const out = new Map();
for (const l of LANGS) {
  out.set(PRE[l] + 'index.html', hub(l));
  for (const s of SECTIONS) out.set(PRE[l] + s.id + '/index.html', section(l, s));
  out.set(PRE[l] + 'sac/index.html', bag(l));
}
out.set('assets/catalog.js', catalogJs());
out.set('sitemap.xml', sitemap());

let bad = 0;
for (const [rel, body] of out) {
  const file = join(ROOT, rel);
  if (CHECK) {
    if (!existsSync(file) || readFileSync(file, 'utf8') !== body) { console.error(`stale: shop/${rel}`); bad++; }
  } else {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, body);
  }
}
if (CHECK && bad) { console.error(`${bad} store file(s) out of date: run node scripts/build-shop.mjs`); process.exit(1); }
console.log(CHECK ? `store: ${out.size} files up to date` : `store: wrote ${out.size} files`);
