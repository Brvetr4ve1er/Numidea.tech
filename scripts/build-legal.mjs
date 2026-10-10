#!/usr/bin/env node
/**
 * Builds the legal notice + privacy policy from scripts/legal-data.mjs —
 * part of `npm run build`.
 *
 *   all owner fields set  → writes legal/index.html and fills the LEGAL marker
 *                           regions in index.html (footer + contact form links)
 *   any field still null  → writes nothing, empties the marker regions, and
 *                           lists what is missing
 *   --preview             → writes legal-preview/index.html with the gaps
 *                           marked (git-ignored, never deployed)
 *   --check               → exit 1 if legal/ or the marker regions are not what
 *                           the data says they should be
 *
 * The three languages are all in the page; html[lang] (set before paint by
 * the head resolver) shows one, so no text is swapped after paint.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, BASE, THEMES } from './site.mjs';
import { LEGAL, missing } from './legal-data.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const stamp = () => (readFileSync(join(ROOT, 'index.html'), 'utf8').match(/\?v=(\d+)/) || [, '1'])[1];

/* a value, or (preview only) a visible gap marker */
function val(v, path, preview) {
  if (v === null || v === undefined) {
    if (!preview) throw new Error('legal field missing: ' + path);
    return `<mark class="gap">[À COMPLÉTER · ${esc(path)}]</mark>`;
  }
  return esc(v);
}

const UI = {
  fr: { title: 'Mentions légales et confidentialité · Numidea Labs', h1: 'Mentions légales <em>et confidentialité</em>',
        mentions: 'Mentions légales', privacy: 'Confidentialité', back: '← Retour à Numidea Labs', updated: 'Dernière mise à jour' },
  en: { title: 'Legal notice and privacy · Numidea Labs', h1: 'Legal notice <em>and privacy</em>',
        mentions: 'Legal notice', privacy: 'Privacy', back: '← Back to Numidea Labs', updated: 'Last updated' },
  ar: { title: 'الإشعار القانوني والخصوصية · Numidea Labs', h1: 'الإشعار القانوني <em>والخصوصية</em>',
        mentions: 'الإشعار القانوني', privacy: 'الخصوصية', back: '→ العودة إلى Numidea Labs', updated: 'آخر تحديث' },
};

function body(lang, d, preview) {
  const v = (x, p) => val(x, p, preview);
  const pub = d.publisher, reg = d.registration;
  const hosts = d.hosts.map((h) => {
    const c = d.hostCatalogue[h];
    return `<li><b>${esc(c.name)}</b> — ${v(c.address, 'hostCatalogue.' + h + '.address')} — <a href="${esc(c.site)}" rel="noopener">${esc(c.site.replace(/^https?:\/\//, ''))}</a></li>`;
  }).join('');
  const capital = pub.capital === false ? '' : pub.capital === null ? v(null, 'publisher.capital') : esc(pub.capital);
  const regLine = reg.number === false ? '' : `${v(reg.label, 'registration.label')} : ${v(reg.number, 'registration.number')}`;
  const ipCc0 = d.ip.licence === 'cc0', ipSet = d.ip.licence === 'cc0' || d.ip.licence === 'reserved';
  const ipGap = ipSet ? '' : v(null, 'ip.licence');
  const supa = d.privacy.supabaseRegion;
  const anpdp = d.privacy.anpdp === false ? '' : d.privacy.anpdp === null ? v(null, 'privacy.anpdp') : esc(d.privacy.anpdp);
  const rights = v(d.privacy.rightsEmail, 'privacy.rightsEmail');

  if (lang === 'fr') return `
  <section id="mentions" aria-labelledby="mentions-h-fr"><h2 id="mentions-h-fr">Mentions légales</h2>
    <h3>Éditeur</h3>
    <p>${v(pub.name, 'publisher.name')} — ${v(pub.legalForm, 'publisher.legalForm')}${capital ? `, capital ${capital}` : ''}<br>
    ${v(pub.address, 'publisher.address')}<br>
    <a href="mailto:${v(pub.email, 'publisher.email')}">${v(pub.email, 'publisher.email')}</a> · <span dir="ltr">${v(pub.phone, 'publisher.phone')}</span>${regLine ? `<br>${regLine}` : ''}</p>
    <h3>Directeur de la publication</h3><p>${v(d.director, 'director')}</p>
    <h3>Hébergement</h3><ul>${hosts}</ul>
    <h3>Propriété intellectuelle</h3>
    <p>${ipGap || (ipCc0
      ? 'Le code, les textes, les illustrations et le CV de ce site sont placés dans le domaine public (CC0 1.0).'
      : `Les textes, les illustrations et le CV de ce site appartiennent à ${v(pub.name, 'publisher.name')} ; toute reproduction sans autorisation écrite est interdite.`)}
    Les sites, marques et visuels des clients présentés comme références restent la propriété de leurs titulaires.</p>
    <h3>Polices</h3><p>Cinzel, Geist, Geist Mono et IBM Plex Sans Arabic, sous licence SIL Open Font License 1.1, servies depuis ce site.</p>
  </section>
  <section id="confidentialite" aria-labelledby="privacy-h-fr"><h2 id="privacy-h-fr">Confidentialité</h2>
    <h3>Responsable du traitement</h3><p>${v(pub.name, 'publisher.name')} — pour toute question : <a href="mailto:${rights}">${rights}</a>.</p>
    <h3>Le formulaire de contact</h3>
    <p>Il demande votre nom, votre e-mail et votre message (qui peut contenir l'estimation préparée avec l'estimateur, et la langue de la page). <strong>Le site ne transmet rien lui-même</strong> : « Démarrer un projet » ouvre votre messagerie avec un e-mail pré-rempli adressé au studio, et c'est votre messagerie qui l'envoie. Il est reçu sur une boîte Gmail (Google).${supa ? ` Le message est aussi enregistré dans une base de données Supabase (région ${esc(supa)}).` : ''}</p>
    <p>Si vous écrivez sur WhatsApp, l'échange passe par WhatsApp (Meta).</p>
    <h3>Si vous arrivez par une publicité</h3><p>Le studio diffuse des publicités sur Facebook et Instagram (Meta). Meta traite les données liées à leur affichage selon sa propre politique ; ce site n'a ni pixel ni traceur. Le lien d'une publicité peut contenir un code de campagne (<code>ref</code>, <code>utm_*</code>) et un identifiant de clic ajouté par Meta (<code>fbclid</code>) : le site ne les lit qu'au moment où vous envoyez le formulaire ou ouvrez WhatsApp, et les ajoute à votre message (« Source : … ») pour savoir quelle annonce vous a amené. Il ne les enregistre nulle part. Une conversation WhatsApp démarrée depuis une annonce arrive dans l'application WhatsApp Business du studio.</p>
    <h3>Pourquoi</h3><p>Uniquement pour répondre à votre demande et préparer un devis : mesures précontractuelles prises à votre demande. Rien n'est revendu, et vos données ne servent pas à cibler de la publicité.</p>
    <h3>Combien de temps</h3><p>${v(d.privacy.retention, 'privacy.retention')}</p>
    <h3>Qui y a accès</h3><p>Le studio. Ses prestataires techniques traitent les données nécessaires à leur service : Google (messagerie), Meta (WhatsApp, si vous l'utilisez, et les publicités) et l'hébergeur du site, qui conserve des journaux de connexion techniques (dont l'adresse IP) selon ses propres règles. Ces prestataires peuvent traiter des données hors de l'Union européenne et de l'Algérie, notamment aux États-Unis.</p>
    <h3>Sur votre appareil</h3><p>Aucun cookie, aucune mesure d'audience, aucune requête vers un service tiers. Le site garde dans le stockage local de votre navigateur : <code>numidea-lang</code> (langue), <code>numidea-theme</code> (thème), <code>numidea-cur</code> (devise d'affichage des prix), <code>void-theme</code> (thème de la page de l'artiste) et l'état de la démo WorkspaceHQ (<code>animstage-v3:t</code>, et <code>whq3-place</code> le temps de la session). Aucune de ces valeurs ne vous identifie ; vous pouvez les effacer depuis votre navigateur.</p>
    <h3>Vos droits</h3><p>Accès, rectification, effacement, limitation et opposition : écrivez à <a href="mailto:${rights}">${rights}</a>. Vous pouvez aussi saisir la CNIL (France, <a href="https://www.cnil.fr" rel="noopener">cnil.fr</a>) ou l'ANPDP (Algérie)${anpdp ? ` — ${anpdp}` : ''}.</p>
  </section>`;

  if (lang === 'en') return `
  <section id="mentions-en" aria-labelledby="mentions-h-en"><h2 id="mentions-h-en">Legal notice</h2>
    <h3>Publisher</h3>
    <p>${v(pub.name, 'publisher.name')} — ${v(pub.legalForm, 'publisher.legalForm')}${capital ? `, share capital ${capital}` : ''}<br>
    ${v(pub.address, 'publisher.address')}<br>
    <a href="mailto:${v(pub.email, 'publisher.email')}">${v(pub.email, 'publisher.email')}</a> · <span dir="ltr">${v(pub.phone, 'publisher.phone')}</span>${regLine ? `<br>${regLine}` : ''}</p>
    <h3>Publication director</h3><p>${v(d.director, 'director')}</p>
    <h3>Hosting</h3><ul>${hosts}</ul>
    <h3>Intellectual property</h3>
    <p>${ipGap || (ipCc0
      ? "This site's code, text, illustrations and CV are dedicated to the public domain (CC0 1.0)."
      : `This site's text, illustrations and CV belong to ${v(pub.name, 'publisher.name')}; reproduction without written permission is prohibited.`)}
    Client sites, brands and visuals shown as references remain the property of their owners.</p>
    <h3>Fonts</h3><p>Cinzel, Geist, Geist Mono and IBM Plex Sans Arabic, under the SIL Open Font License 1.1, served from this site.</p>
  </section>
  <section id="privacy-en" aria-labelledby="privacy-h-en"><h2 id="privacy-h-en">Privacy</h2>
    <h3>Controller</h3><p>${v(pub.name, 'publisher.name')} — any question: <a href="mailto:${rights}">${rights}</a>.</p>
    <h3>The contact form</h3>
    <p>It asks for your name, your email and your message (which may include the estimate prepared with the estimator, and the page language). <strong>The site sends nothing itself</strong>: "Start a project" opens your email app with a pre-filled email to the studio, and your email app sends it. It is received in a Gmail (Google) mailbox.${supa ? ` The message is also stored in a Supabase database (region ${esc(supa)}).` : ''}</p>
    <p>If you write on WhatsApp, the conversation goes through WhatsApp (Meta).</p>
    <h3>If you arrive from an ad</h3><p>The studio runs ads on Facebook and Instagram (Meta). Meta processes the data tied to showing them under its own policy; this site has no pixel or tracker. An ad's link may carry a campaign code (<code>ref</code>, <code>utm_*</code>) and a click identifier added by Meta (<code>fbclid</code>): the site reads them only when you send the form or open WhatsApp, and adds them to your message ("Source: …") so the studio knows which ad brought you. It stores them nowhere. A WhatsApp conversation started from an ad arrives in the studio's WhatsApp Business app.</p>
    <h3>Why</h3><p>Only to answer your request and prepare a quote: pre-contractual steps taken at your request. Nothing is sold, and your data is not used to target advertising.</p>
    <h3>How long</h3><p>${v(d.privacy.retention, 'privacy.retention')}</p>
    <h3>Who has access</h3><p>The studio. Its technical providers process what their service needs: Google (email), Meta (WhatsApp, if you use it, and the ads) and the site's host, which keeps technical connection logs (including IP addresses) under its own rules. These providers may process data outside the European Union and Algeria, notably in the United States.</p>
    <h3>On your device</h3><p>No cookies, no analytics, no requests to third-party services. The site keeps in your browser's local storage: <code>numidea-lang</code> (language), <code>numidea-theme</code> (theme), <code>numidea-cur</code> (the currency prices are shown in), <code>void-theme</code> (the artist page's theme) and the WorkspaceHQ demo's state (<code>animstage-v3:t</code>, and <code>whq3-place</code> for the session). None of these identifies you; you can clear them from your browser.</p>
    <h3>Your rights</h3><p>Access, rectification, erasure, restriction and objection: write to <a href="mailto:${rights}">${rights}</a>. You can also complain to the CNIL (France, <a href="https://www.cnil.fr" rel="noopener">cnil.fr</a>) or the ANPDP (Algeria)${anpdp ? ` — ${anpdp}` : ''}.</p>
  </section>`;

  return `
  <section id="mentions-ar" aria-labelledby="mentions-h-ar"><h2 id="mentions-h-ar">الإشعار القانوني</h2>
    <h3>الناشر</h3>
    <p>${v(pub.name, 'publisher.name')} — ${v(pub.legalForm, 'publisher.legalForm')}${capital ? `، رأس المال ${capital}` : ''}<br>
    ${v(pub.address, 'publisher.address')}<br>
    <a href="mailto:${v(pub.email, 'publisher.email')}" dir="ltr">${v(pub.email, 'publisher.email')}</a> · <span dir="ltr">${v(pub.phone, 'publisher.phone')}</span>${regLine ? `<br>${regLine}` : ''}</p>
    <h3>مدير النشر</h3><p>${v(d.director, 'director')}</p>
    <h3>الاستضافة</h3><ul>${hosts}</ul>
    <h3>الملكية الفكرية</h3>
    <p>${ipGap || (ipCc0
      ? 'شيفرة هذا الموقع ونصوصه ورسومه والسيرة الذاتية مُتاحة في الملك العام (CC0 1.0).'
      : `نصوص هذا الموقع ورسومه والسيرة الذاتية مملوكة لـ ${v(pub.name, 'publisher.name')}؛ يُمنع نسخها دون إذن كتابي.`)}
    مواقع العملاء وعلاماتهم ومرئياتهم المعروضة كمراجع تبقى ملكاً لأصحابها.</p>
    <h3>الخطوط</h3><p>Cinzel وGeist وGeist Mono وIBM Plex Sans Arabic، بترخيص SIL Open Font License 1.1، تُخدَم من هذا الموقع.</p>
  </section>
  <section id="privacy-ar" aria-labelledby="privacy-h-ar"><h2 id="privacy-h-ar">الخصوصية</h2>
    <h3>المسؤول عن المعالجة</h3><p>${v(pub.name, 'publisher.name')} — لأي سؤال: <a href="mailto:${rights}" dir="ltr">${rights}</a>.</p>
    <h3>استمارة الاتصال</h3>
    <p>تطلب اسمك وبريدك الإلكتروني ورسالتك (وقد تتضمّن التقدير المُعدّ بالحاسبة، ولغة الصفحة). <strong>الموقع لا يُرسل شيئاً بنفسه</strong>: زر «ابدأ مشروعاً» يفتح تطبيق بريدك برسالة جاهزة موجّهة إلى الاستوديو، وتطبيق بريدك هو من يُرسلها. تصل إلى صندوق Gmail ‏(Google).${supa ? ` وتُحفظ الرسالة أيضاً في قاعدة بيانات Supabase (المنطقة ${esc(supa)}).` : ''}</p>
    <p>إن راسلتنا عبر واتساب، فالمحادثة تمرّ عبر واتساب (Meta).</p>
    <h3>إن وصلت عبر إعلان</h3><p>ينشر الاستوديو إعلانات على Facebook وInstagram ‏(Meta). تعالج Meta البيانات المرتبطة بعرضها وفق سياستها الخاصة، ولا يحتوي هذا الموقع على أي بكسل أو أداة تتبّع. قد يحمل رابط الإعلان رمز حملة (<code>ref</code>، <code>utm_*</code>) ومعرّف نقرة تضيفه Meta ‏(<code>fbclid</code>): لا يقرؤها الموقع إلا عند إرسالك الاستمارة أو فتحك واتساب، فيضيفها إلى رسالتك («المصدر: …») ليعرف الاستوديو الإعلان الذي أوصلك. ولا يحفظها في أي مكان. وتصل محادثة واتساب التي تبدأ من إعلان إلى تطبيق WhatsApp Business الخاص بالاستوديو.</p>
    <h3>لماذا</h3><p>للردّ على طلبك وإعداد عرض سعر فقط: إجراءات سابقة للتعاقد بطلب منك. لا يُباع شيء، ولا تُستخدم بياناتك لاستهداف الإعلانات.</p>
    <h3>إلى متى</h3><p>${v(d.privacy.retention, 'privacy.retention')}</p>
    <h3>من يطّلع عليها</h3><p>الاستوديو. ويعالج مزوّدوه التقنيون ما تحتاجه خدمتهم: Google (البريد)، وMeta (واتساب إن استعملته، والإعلانات)، ومستضيف الموقع الذي يحتفظ بسجلّات اتصال تقنية (منها عنوان IP) وفق قواعده. قد يعالج هؤلاء المزوّدون بيانات خارج الاتحاد الأوروبي والجزائر، ولا سيما في الولايات المتحدة.</p>
    <h3>على جهازك</h3><p>لا ملفات تعريف ارتباط، ولا قياس للزيارات، ولا طلبات إلى خدمات خارجية. يحفظ الموقع في التخزين المحلي لمتصفّحك: <code>numidea-lang</code> (اللغة)، <code>numidea-theme</code> (المظهر)، <code>numidea-cur</code> (عملة عرض الأسعار)، <code>void-theme</code> (مظهر صفحة الفنان) وحالة عرض WorkspaceHQ (<code>animstage-v3:t</code>، و<code>whq3-place</code> طوال الجلسة). لا شيء منها يُعرّف بك، ويمكنك حذفها من متصفّحك.</p>
    <h3>حقوقك</h3><p>الاطّلاع والتصحيح والمحو والتقييد والاعتراض: راسل <a href="mailto:${rights}" dir="ltr">${rights}</a>. ويمكنك أيضاً تقديم شكوى إلى CNIL (فرنسا، <a href="https://www.cnil.fr" rel="noopener">cnil.fr</a>) أو ANPDP (الجزائر)${anpdp ? ` — ${anpdp}` : ''}.</p>
  </section>`;
}

export function renderLegal(data = LEGAL, { preview = false } = {}) {
  const st = stamp();
  const dict = Object.fromEntries(Object.entries(UI).map(([l, u]) => [l, { 'ui.title': u.title }]));
  const updated = data.lastUpdated === null ? val(null, 'lastUpdated', preview) : esc(data.lastUpdated);
  const blocks = ['fr', 'en', 'ar'].map((l) => `
<div class="lg" lang="${l}"${l === 'ar' ? ' dir="rtl"' : ''}>
  <h1>${UI[l].h1}</h1>
  <nav class="lg-toc" aria-label="${esc(UI[l].mentions)} · ${esc(UI[l].privacy)}"><a href="#${l === 'fr' ? 'mentions' : 'mentions-' + l}">${esc(UI[l].mentions)}</a><a href="#${l === 'fr' ? 'confidentialite' : 'privacy-' + l}">${esc(UI[l].privacy)}</a></nav>
  ${body(l, data, preview)}
  <p class="lg-upd">${esc(UI[l].updated)} : <span dir="ltr">${updated}</span></p>
  <a class="lg-back" href="../">${esc(UI[l].back)}</a>
</div>`).join('\n');
  return `<!DOCTYPE html>
<html lang="fr" dir="ltr" data-theme="arcanum">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${esc(UI.fr.title)}</title>
<meta name="description" content="Éditeur, hébergement, propriété intellectuelle et données personnelles de numidea labs.">
<meta name="theme-color" content="#0A1420">
${preview ? '<meta name="robots" content="noindex">\n' : ''}<link rel="canonical" href="${BASE}legal/">
<link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
<!-- GENERATED by scripts/build-legal.mjs from scripts/legal-data.mjs. Edit the data, then: npm run build -->
<script>(function(){var d=document.documentElement,T=${JSON.stringify(THEMES)},L=['fr','en','ar'],th='arcanum',l='fr',q=null;
try{q=new URLSearchParams(location.search).get('lang');}catch(e){}
try{th=localStorage.getItem('numidea-theme')||th;l=localStorage.getItem('numidea-lang')||l;}catch(e){}
if(q&&L.indexOf(q)!==-1)l=q;if(T.indexOf(th)===-1)th='arcanum';if(L.indexOf(l)===-1)l='fr';
d.setAttribute('data-theme',th);d.lang=l;d.dir=l==='ar'?'rtl':'ltr';})();</script>
<link rel="preload" as="font" type="font/woff2" crossorigin href="../assets/fonts/geist-400-latin.woff2">
<link rel="preload" as="font" type="font/woff2" crossorigin href="../assets/fonts/geist-600-latin.woff2">
<link rel="stylesheet" href="../assets/fonts.css?v=${st}">
<link rel="stylesheet" href="../assets/themes.css?v=${st}">
<link rel="stylesheet" href="../assets/styles.css?v=${st}">
<style>
  .lg-page{max-width:46rem;margin:0 auto;padding:calc(var(--s-8) + env(safe-area-inset-top)) var(--gutter) var(--s-9)}
  .lg-top{display:flex;align-items:center;justify-content:space-between;gap:var(--s-4);margin-bottom:var(--s-7)}
  .lg{display:none}
  html[lang="fr"] .lg[lang="fr"],html[lang="en"] .lg[lang="en"],html[lang="ar"] .lg[lang="ar"]{display:block}
  .lg h1{font-family:var(--font-display);font-weight:600;font-size:clamp(30px,4vw,44px);line-height:1.1;color:var(--ice);margin-bottom:var(--s-5)}
  .lg h1 em{font-style:normal;color:var(--crimson-text)}
  .lg[lang="ar"] h1,.lg[lang="ar"] h2{font-family:var(--font-ar-display)}
  .lg-toc{display:flex;flex-wrap:wrap;gap:var(--s-3);margin-bottom:var(--s-7)}
  .lg-toc a{font-family:var(--font-mono);font-size:var(--t-label,11px);letter-spacing:.14em;text-transform:uppercase;color:var(--teal-text);
    border:1px solid var(--hairline-2);border-radius:var(--r-sm);padding:10px 14px;text-decoration:none}
  .lg[lang="ar"] .lg-toc a{font-family:var(--font-ar-body);letter-spacing:0;text-transform:none;font-size:14px}
  .lg h2{font-family:var(--font-display);font-weight:600;font-size:26px;color:var(--ice);margin:var(--s-7) 0 var(--s-4);scroll-margin-top:24px}
  .lg h3{font-size:16px;font-weight:600;color:var(--ice);margin:var(--s-5) 0 6px}
  .lg p,.lg li{color:var(--body-strong);font-size:15px;line-height:1.7}
  .lg ul{padding-inline-start:1.2em}
  .lg a{color:var(--teal-text)}
  .lg code{font-family:var(--font-mono);font-size:.9em;color:var(--ice)}
  .lg .gap{background:color-mix(in srgb,var(--crimson) 25%,transparent);color:var(--ice);padding:0 4px;border-radius:4px;font-family:var(--font-mono);font-size:.85em}
  .lg-upd{margin-top:var(--s-7);color:var(--muted)!important;font-size:13px!important}
  .lg-back{display:inline-block;margin-top:var(--s-5);font-family:var(--font-mono);font-size:13px;color:var(--muted)}
</style>
</head>
<body>
<a class="skip" href="#lg-main">Aller au contenu · Skip to content</a>
<div class="lg-page">
  <header class="lg-top">
    <a class="logo" href="../">Num<i>idea</i> Labs</a>
    <div class="lang" role="group" aria-label="Language">
      <button type="button" data-lang="fr" aria-pressed="true">FR</button>
      <button type="button" data-lang="en" aria-pressed="false">EN</button>
      <button type="button" data-lang="ar" aria-pressed="false" lang="ar">ع</button>
    </div>
  </header>
  <main id="lg-main" tabindex="-1">${blocks}
  </main>
</div>
<script type="application/json" id="i18n">${JSON.stringify(dict).replace(/</g, '\\u003c')}</script>
<script src="../assets/page-i18n.js?v=${st}" defer></script>
</body>
</html>
`;
}

/* the links index.html carries once the page is published */
export const MARKERS = {
  footer: { html: '<a href="legal/#mentions" data-i18n="footer.legal">Mentions légales</a><a href="legal/#confidentialite" data-i18n="footer.privacy">Confidentialité</a>' },
  form: { html: ' <a href="legal/#confidentialite" data-i18n="footer.privacy">Confidentialité</a>' },
};
export function markerRegions(html, published) {
  let out = html;
  for (const [name, m] of Object.entries(MARKERS)) {
    const re = new RegExp(`(<!-- LEGAL:${name} -->)[\\s\\S]*?(<!-- /LEGAL:${name} -->)`);
    if (re.test(out)) out = out.replace(re, `$1${published ? m.html : ''}$2`);
  }
  return out;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const gaps = missing();
  const complete = gaps.length === 0;
  const idxPath = join(ROOT, 'index.html');
  const outPath = join(ROOT, 'legal/index.html');
  if (process.argv.includes('--preview')) {
    mkdirSync(join(ROOT, 'legal-preview'), { recursive: true });
    writeFileSync(join(ROOT, 'legal-preview/index.html'), renderLegal(LEGAL, { preview: true }));
    console.log(`✓ legal-preview/index.html (${gaps.length} gaps marked; git-ignored, never deployed)`);
    process.exit(0);
  }
  const wantIdx = markerRegions(readFileSync(idxPath, 'utf8'), complete);
  if (process.argv.includes('--check')) {
    const okIdx = readFileSync(idxPath, 'utf8') === wantIdx;
    const okPage = complete ? existsSync(outPath) && readFileSync(outPath, 'utf8') === renderLegal() : !existsSync(outPath);
    console.log(okIdx && okPage ? '✓ legal page and links match scripts/legal-data.mjs' : '✗ legal page or links out of step with scripts/legal-data.mjs (run: npm run build)');
    process.exit(okIdx && okPage ? 0 : 1);
  }
  writeFileSync(idxPath, wantIdx);
  if (complete) {
    mkdirSync(join(ROOT, 'legal'), { recursive: true });
    writeFileSync(outPath, renderLegal());
    console.log('✓ legal/index.html published; footer and form link to it');
  } else {
    console.log(`· legal page not published: ${gaps.length} owner fields missing in scripts/legal-data.mjs`);
    console.log('  ' + gaps.join(', '));
  }
}
