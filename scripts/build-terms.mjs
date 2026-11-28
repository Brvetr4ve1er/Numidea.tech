#!/usr/bin/env node
/**
 * Builds Le comptoir's terms of sale and refund policy (comptoir/conditions/index.html, FR/EN/AR on one page) from
 * scripts/terms-data.mjs and the seller's identity in scripts/legal-data.mjs (payments, 2026-11-27).
 *
 *   node scripts/build-terms.mjs            writes the page and the counter's link once nothing is missing; else lists the gaps
 *   node scripts/build-terms.mjs --preview  writes terms-preview/index.html with every gap marked (git-ignored, never deployed)
 *   node scripts/build-terms.mjs --check    fails if the page or the counter's link is out of step with the data
 *
 * The shop's own figures come from api/_shop.js and assets/app.js (the deposit, its threshold, the rates, the mock-up
 * credit), so the page cannot drift from the counter.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';
import { TERMS, termsMissing } from './terms-data.mjs';
import { LEGAL, missing as legalMissing } from './legal-data.mjs';
import { DEPOSIT, DEPOSIT_FROM, FX } from '../api/_shop.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'comptoir/conditions/index.html');
const COUNTER = join(ROOT, 'comptoir/index.html');

// the mock-up / audit credit window, read from the estimator's DESIGN (assets/app.js), as the carte does
const creditDays = (() => {
  const src = readFileSync(join(ROOT, 'assets/app.js'), 'utf8');
  const i = src.indexOf('var DESIGN = {'); let d = 0, j = i + 13;
  for (; j < src.length; j++) { if (src[j] === '{') d++; if (src[j] === '}' && !--d) break; }
  return vm.runInNewContext('(' + src.slice(i + 13, j + 1) + ')').ui.creditDays;
})();

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (n, l) => new Intl.NumberFormat(l === 'en' ? 'en-US' : 'fr-FR').format(n).replace(/ /g, ' ');

/* a value for language l, or a marked gap in preview */
function val(path, l, preview) {
  const [a, b] = path.split('.');
  const src = a === 'legal' ? LEGAL : TERMS;
  let v = a === 'legal' ? b.split('/').reduce((o, k) => (o == null ? o : o[k]), LEGAL) : TERMS[a];
  if (v && typeof v === 'object' && !Array.isArray(v)) v = v[l];
  if (v === null || v === undefined || v === '') return preview ? `<mark dir="ltr">⟦${esc(a === 'legal' ? 'legal-data: ' + b.replace(/\//g, '.') : 'terms-data: ' + a)}⟧</mark>` : '';
  void src;
  return esc(v);
}

const T = {
  fr: {
    h: 'Conditions de vente et remboursements', lead: 'Ce qui s’applique quand vous commandez au comptoir de Numidea Labs.',
    s: [
      ['Le vendeur', (v) => `<p>${v('legal.publisher/name')}, ${v('legal.publisher/legalForm')}, ${v('legal.registration/label')} ${v('legal.registration/number')}. Adresse : ${v('legal.publisher/address')}. Contact : <a href="mailto:${v('legal.publisher/email')}">${v('legal.publisher/email')}</a>, WhatsApp +213 672 41 25 78.</p>`],
      ['Ce que vend le comptoir', () => `<p>Des services du studio à prix fixe (design, maquettes, audits), des appels « L’argent, sans jargon » et des produits numériques (guides et modèles). Les objets physiques (vêtements, stickers, livres) se vendent sur la boutique Tr4velerz Studio, tr4velerz.studio, sous ses propres conditions. Les prix sont en dinars ; les montants en euros et en dollars sont convertis au taux affiché (1 € = ${FX.EUR} DA, 1 $ = ${FX.USD} DA). Le montant dû est celui du bon de commande. Les projets dont le prix est une fourchette ne se vendent pas ici : ils font l’objet d’un devis. Les appels et les cours sont de l’éducation : ni conseil financier, ni conseil en placement, ni gestion de fonds, et aucune recommandation de produit, de plateforme ou de crypto-actif ; vos décisions restent les vôtres.</p>`],
      ['Commande et paiement', (v) => `<p>Chaque sac reçoit un bon de commande (N-…) que vous nous envoyez avec le paiement : CCP · BaridiMob en dinars, virement en euros ou en dollars, ou PayPal quand il est proposé. La commande est ferme quand le paiement est reçu et que le studio la confirme, sous ${v('confirm')}. À partir de ${num(DEPOSIT_FROM, 'fr')} DA, vous pouvez régler un acompte de ${Math.round(DEPOSIT * 100)} % à la commande et le solde à la livraison.</p>`],
      ['Exécution et livraison', (v) => `<p>Le délai indiqué sur chaque carte court à partir de la confirmation et du brief complet. Les fichiers sont livrés par lien ou par e-mail. Les tours de corrections inclus sont ceux de la carte du service.</p>`],
      ['Annulation et remboursement', (v) => `<p>Avant le début du travail, une commande annulée est ${v('cancelBeforeStart')}. Une fois le travail commencé à votre demande, l’acompte ${v('depositAfterStart')} : un travail sur mesure ne se reprend pas. Un appel se déplace sans frais jusqu’à ${v('callNotice')} h avant. Si le studio annule ou ne livre pas, vous êtes remboursé en totalité. Une maquette ou un audit est déduit d’un site commandé dans les ${creditDays} jours. Un remboursement part par le moyen de paiement utilisé, sous ${v('refundDays')} jours.</p>`],
      ['Droit de rétractation', () => `<p>Si vous bénéficiez d’un droit de rétractation (par exemple comme consommateur dans l’Union européenne, 14 jours), il ne s’applique pas à un travail fait sur mesure selon votre brief : en demandant qu’il commence avant la fin de ce délai, vous acceptez de perdre ce droit dès que le travail a commencé, et l’acompte de ${Math.round(DEPOSIT * 100)} % couvre ce qui est déjà fait. Il ne s’applique pas non plus à un guide numérique fourni dès l’achat avec votre accord.</p>`],
      ['Droits sur le travail', (v) => `<p>Les droits d’usage des livrables vous sont cédés au paiement complet. ${v('portfolio')}</p>`],
      ['Réclamations et litiges', (v) => `<p>Écrivez-nous d’abord : on répond et on cherche une solution. À défaut, le droit algérien s’applique (notamment la loi 18-05 sur le commerce électronique) et ${v('court')} sont compétents. Vos données : voir les <a href="../../legal/">mentions légales et la politique de confidentialité</a>.</p>`],
    ],
    portfolio: ['Le studio peut montrer le travail terminé dans son portfolio, sauf si vous le refusez par écrit.', 'Le studio ne montre jamais votre travail sans votre accord écrit.'],
    upd: 'Mise à jour',
  },
  en: {
    h: 'Terms of sale and refunds', lead: 'What applies when you order at the Numidea Labs counter.',
    s: [
      ['The seller', (v) => `<p>${v('legal.publisher/name')}, ${v('legal.publisher/legalForm')}, ${v('legal.registration/label')} ${v('legal.registration/number')}. Address: ${v('legal.publisher/address')}. Contact: <a href="mailto:${v('legal.publisher/email')}">${v('legal.publisher/email')}</a>, WhatsApp +213 672 41 25 78.</p>`],
      ['What the counter sells', () => `<p>The studio’s fixed-price services (design, mock-ups, audits), the “Money, minus the jargon” calls, and digital products (guides and templates). Physical goods (clothing, stickers, books) are sold on the Tr4velerz Studio store, tr4velerz.studio, under its own terms. Prices are in Algerian dinars; euro and dollar amounts are converted at the rate shown (€1 = ${FX.EUR} DA, $1 = ${FX.USD} DA). The amount due is the one on the order slip. Projects priced as a range are not sold here: they get a quote. The calls and lessons are education: not financial or investment advice, no fund management, and no recommendation of any product, platform or crypto-asset; your decisions stay yours.</p>`],
      ['Order and payment', (v) => `<p>Every bag gets an order slip (N-…) that you send us with the payment: CCP · BaridiMob in dinars, a bank transfer in euros or dollars, or PayPal when offered. The order is firm once the payment has arrived and the studio confirms it, within ${v('confirm')}. From ${num(DEPOSIT_FROM, 'en')} DA you may pay a ${Math.round(DEPOSIT * 100)}% deposit with the order and the balance on delivery.</p>`],
      ['Delivery', (v) => `<p>The lead time on each card runs from the confirmation and a complete brief. Files are delivered by link or e-mail. The rounds of changes included are the ones on the service’s card.</p>`],
      ['Cancellation and refunds', (v) => `<p>Before work starts, a cancelled order is ${v('cancelBeforeStart')}. Once work has started at your request, the deposit ${v('depositAfterStart')}: made-to-order work cannot be taken back. A call can be moved free of charge up to ${v('callNotice')} hours before. If the studio cancels or does not deliver, you are refunded in full. A mock-up or an audit is credited against a website ordered within ${creditDays} days. Refunds go back by the payment method used, within ${v('refundDays')} days.</p>`],
      ['Right of withdrawal', () => `<p>If you have a right of withdrawal (for example as a consumer in the European Union, 14 days), it does not apply to work made to order from your brief: by asking for it to start before that period ends, you accept that you lose this right once the work has started, and the ${Math.round(DEPOSIT * 100)}% deposit covers what has already been done. Nor does it apply to a digital guide supplied at purchase with your consent.</p>`],
      ['Rights in the work', (v) => `<p>The rights to use the deliverables pass to you on full payment. ${v('portfolio')}</p>`],
      ['Complaints and disputes', (v) => `<p>Write to us first: we answer and look for a fix. Failing that, Algerian law applies (in particular Law 18-05 on e-commerce) and ${v('court')} have jurisdiction. Your data: see the <a href="../../legal/">legal notice and privacy policy</a>.</p>`],
    ],
    portfolio: ['The studio may show finished work in its portfolio unless you refuse in writing.', 'The studio never shows your work without your written consent.'],
    upd: 'Last updated',
  },
  ar: {
    h: 'شروط البيع والاسترداد', lead: 'ما ينطبق عند الطلب من متجر نوميديا لابس.',
    s: [
      ['البائع', (v) => `<p>${v('legal.publisher/name')}، ${v('legal.publisher/legalForm')}، ${v('legal.registration/label')} <bdi>${v('legal.registration/number')}</bdi>. العنوان: ${v('legal.publisher/address')}. التواصل: <a href="mailto:${v('legal.publisher/email')}"><bdi>${v('legal.publisher/email')}</bdi></a>، واتساب <bdi>+213 672 41 25 78</bdi>.</p>`],
      ['ما يبيعه المتجر', () => `<p>خدمات الاستوديو بسعر ثابت (تصميم، نماذج، تدقيق)، ومكالمات «المال بلا تعقيد»، ومنتجات رقمية (أدلة ونماذج). أما الأشياء المادية (ملابس، ملصقات، كتب) فتُباع في متجر Tr4velerz Studio على tr4velerz.studio بشروطه الخاصة. الأسعار بالدينار الجزائري؛ والمبالغ باليورو والدولار محوّلة بالسعر المعروض (<bdi>1 € = ${FX.EUR} DA</bdi>، <bdi>1 $ = ${FX.USD} DA</bdi>). المبلغ المستحق هو المذكور في وصل الطلب. المشاريع التي يُعرض سعرها كنطاق لا تُباع هنا: تخضع لعرض سعر. المكالمات والدروس تعليم فقط: ليست استشارة مالية ولا استثمارية ولا إدارة أموال، ولا توصية بأي منتج أو منصة أو أصل مشفّر؛ وتبقى قراراتك لك.</p>`],
      ['الطلب والدفع', (v) => `<p>لكل حقيبة وصل طلب (<bdi>N-…</bdi>) ترسله إلينا مع الدفع: CCP · بريدي موب بالدينار، أو تحويل بنكي باليورو أو الدولار، أو PayPal عند توفّره. يصبح الطلب نهائيًا عند وصول الدفع وتأكيد الاستوديو له، خلال ${v('confirm')}. ابتداءً من <bdi>${num(DEPOSIT_FROM, 'ar')} DA</bdi> يمكنك دفع عربون <bdi>${Math.round(DEPOSIT * 100)} %</bdi> عند الطلب والباقي عند التسليم.</p>`],
      ['التنفيذ والتسليم', (v) => `<p>تبدأ المدة المذكورة في كل بطاقة من التأكيد واكتمال الموجز. تُسلَّم الملفات عبر رابط أو بريد إلكتروني. جولات التعديل المشمولة هي المذكورة في بطاقة الخدمة.</p>`],
      ['الإلغاء والاسترداد', (v) => `<p>قبل بدء العمل، الطلب الملغى ${v('cancelBeforeStart')}. بعد بدء العمل بطلبك، العربون ${v('depositAfterStart')}: العمل المصمَّم حسب الطلب لا يُستعاد. يمكن تأجيل المكالمة مجانًا حتى <bdi>${v('callNotice')}</bdi> ساعة قبل موعدها. إذا ألغى الاستوديو أو لم يسلّم، يُستردّ المبلغ كاملًا. يُخصم ثمن النموذج أو التدقيق من موقع يُطلب خلال ${creditDays} يومًا. يُرسل الاسترداد بوسيلة الدفع نفسها خلال <bdi>${v('refundDays')}</bdi> يومًا.</p>`],
      ['حق العدول', () => `<p>إن كان لك حق العدول (مثلاً كمستهلك في الاتحاد الأوروبي، 14 يومًا)، فهو لا يسري على عمل مصمَّم حسب موجزك: بطلبك أن يبدأ قبل انتهاء هذه المدة، تقبل فقدان هذا الحق بمجرد بدء العمل، ويغطي العربون <bdi>${Math.round(DEPOSIT * 100)} %</bdi> ما أُنجز. ولا يسري كذلك على دليل رقمي يُسلَّم عند الشراء بموافقتك.</p>`],
      ['الحقوق على العمل', (v) => `<p>تنتقل إليك حقوق استعمال المخرجات عند الدفع الكامل. ${v('portfolio')}</p>`],
      ['الشكاوى والنزاعات', (v) => `<p>راسلنا أولًا: نجيب ونبحث عن حل. وإلا يُطبَّق القانون الجزائري (لا سيما القانون 18-05 المتعلق بالتجارة الإلكترونية) وتختص ${v('court')}. بياناتك: انظر <a href="../../legal/">الإشعار القانوني وسياسة الخصوصية</a>.</p>`],
    ],
    portfolio: ['يمكن للاستوديو عرض العمل المنجز في معرض أعماله ما لم ترفض ذلك كتابيًا.', 'لا يعرض الاستوديو عملك أبدًا دون موافقتك الكتابية.'],
    upd: 'آخر تحديث',
  },
};

export function renderTerms({ preview = false } = {}) {
  const sections = ['fr', 'en', 'ar'].map((l) => {
    const L = T[l];
    const v = (path) => path === 'portfolio'
      ? (TERMS.portfolio === null ? (preview ? '<mark dir="ltr">⟦terms-data: portfolio⟧</mark>' : '') : esc(L.portfolio[TERMS.portfolio ? 0 : 1]))
      : val(path, l, preview);
    return `<section class="t-lang" lang="${l}" dir="${l === 'ar' ? 'rtl' : 'ltr'}" id="${l}">
  <h2>${L.h}</h2>
  <p class="t-lead">${L.lead}</p>
${L.s.map(([h, f]) => `  <h3>${h}</h3>\n  ${f(v)}`).join('\n')}
  <p class="t-upd">${L.upd} : <time>${val('lastUpdated', l, preview)}</time></p>
</section>`;
  }).join('\n');
  return `<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'">
<meta name="robots" content="noindex, nofollow">
<title>Conditions de vente · Le comptoir · Numidea Labs</title>
<meta name="description" content="Conditions de vente et remboursements du comptoir de Numidea Labs, en français, anglais et arabe.">
<link rel="canonical" href="https://www.numedialab.dev/comptoir/conditions/">
<link rel="icon" href="../../assets/favicon.svg" type="image/svg+xml">
<style>
body{margin:0;background:#f3ece0;color:#221d1a;font:17px/1.6 system-ui,sans-serif}
main{max-width:720px;margin:0 auto;padding:32px 16px 64px}
a{color:#9e3a2e}h1{font-size:28px;line-height:1.2;margin:16px 0 8px}h2{font-size:22px;margin:40px 0 4px}h3{font-size:17px;margin:24px 0 4px}
nav a{display:inline-flex;align-items:center;min-height:44px;margin-inline-end:16px}
.t-lead,.t-upd{color:#5a514a}mark{background:#ffe08a;color:#221d1a}
.t-lang+.t-lang{border-top:2px solid #221d1a;margin-top:40px}
</style>
</head>
<body>
<main>
<p><a href="../">← Le comptoir</a></p>
<h1>Conditions de vente · Terms of sale · شروط البيع</h1>
<nav aria-label="Langue · Language · اللغة"><a href="#fr">Français</a><a href="#en">English</a><a href="#ar" lang="ar">العربية</a></nav>
${sections}
</main>
</body>
</html>
`;
}

const LINK_RE = /<!-- terms -->[\s\S]*?<!-- \/terms -->/;
const LINK_ON = '<!-- terms --><a class="c-terms" href="conditions/" data-t="terms">Conditions de vente et remboursements</a><!-- /terms -->';
const LINK_OFF = '<!-- terms --><!-- /terms -->';

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const gaps = [...termsMissing(), ...legalMissing().map((g) => 'legal-data: ' + g)];
  const complete = gaps.length === 0;
  if (process.argv.includes('--preview')) {
    mkdirSync(join(ROOT, 'terms-preview'), { recursive: true });
    writeFileSync(join(ROOT, 'terms-preview/index.html'), renderTerms({ preview: true }));
    console.log(`✓ terms-preview/index.html (${gaps.length} gaps marked; git-ignored, never deployed)`);
    process.exit(0);
  }
  const counter = readFileSync(COUNTER, 'utf8');
  if (!LINK_RE.test(counter)) { console.log('✗ comptoir/index.html has no <!-- terms --> marker'); process.exit(1); }
  const wantCounter = counter.replace(LINK_RE, complete ? LINK_ON : LINK_OFF);
  if (process.argv.includes('--check')) {
    const okC = counter === wantCounter;
    const okP = complete ? existsSync(OUT) && readFileSync(OUT, 'utf8') === renderTerms() : !existsSync(OUT);
    console.log(okC && okP ? '✓ terms page and counter link match scripts/terms-data.mjs' : '✗ terms page or counter link out of step (run: node scripts/build-terms.mjs)');
    process.exit(okC && okP ? 0 : 1);
  }
  writeFileSync(COUNTER, wantCounter);
  if (complete) {
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, renderTerms());
    console.log('✓ comptoir/conditions/index.html published; the counter links to it');
  } else {
    console.log(`· terms of sale not published: ${gaps.length} values missing`);
    console.log('  ' + gaps.join(', '));
  }
}
