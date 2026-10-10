/**
 * Ad creative: what each image says and shows. Rendered by
 * scripts/build-creative.mjs into campaign/out/.
 *
 * Every line on an image is copied from the reviewed kit (copy-fr.md,
 * copy-gulf-en.md, copy-gulf-ar.md). Prices are not typed here: {fromEUR} and
 * {fromUSD} are filled from PRICE_MODEL at render time. Screens show real
 * captures (assets/work/<client>/d1|m1.webp) or the neutral "your logo" demo
 * homepage the kit requires for L'Aperçu, never an AI-drawn interface.
 *
 * Launch gates that live outside the images (see campaign/README.md and
 * copy-fr.md 4.1): the Bordj Steel and Alliance Travel cards need the client's
 * written permission before they run in paid ads.
 */
export const SCENES = {
  // id: [file in campaign/scenes, device on screen]
  'fr-phone-916': ['fr-phone-916.jpg', 'phone'],
  'fr-phone-11': ['fr-phone-11.jpg', 'phone'],
  'fr-laptop-11': ['fr-laptop-11.jpg', 'laptop'],
  'fr-cafe-916': ['fr-cafe-916.jpg', 'phone'],
  'gu-phone-916': ['gu-phone-916.jpg', 'phone'],
  'gu-phone-11': ['gu-phone-11.jpg', 'phone'],
  'gu-laptop-11': ['gu-laptop-11.jpg', 'laptop'],
  'gu-cafe-916': ['gu-cafe-916.jpg', 'phone'],
};

// screen content: 'mock:<lang>' = the neutral demo homepage; otherwise a real capture
const BS = 'assets/work/bordjsteel/d1.webp', AT = 'assets/work/alliance/d1.webp', GL = 'assets/work/glaive/d1.webp';

export const ADS = [
  // ---------------- France (French only: Loi Toubon) ----------------
  { id: 'FR-1', lang: 'fr', scene: 'fr-phone-916', sizes: ['9x16', '4x5'], screen: 'mock:fr',
    head: 'Voyez votre nouveau site avant de payer',
    small: "L'Aperçu : votre page d'accueil avec vos contenus, en 5 jours ouvrés · gratuit, sans engagement · entreprises immatriculées (SIRET) · 4 par mois" },
  { id: 'FR-2-1', lang: 'fr', scene: 'fr-laptop-11', sizes: ['1x1'], screen: BS, gate: 'client permission',
    head: "Bordj Steel · site d'entreprise en ligne" },
  { id: 'FR-2-2', lang: 'fr', scene: 'fr-laptop-11', sizes: ['1x1'], screen: AT, gate: 'client permission',
    head: 'Alliance Travel · marque, tunnel de vente, site' },
  { id: 'FR-2-3', lang: 'fr', scene: 'fr-laptop-11', sizes: ['1x1'], screen: GL, badge: 'DÉMO',
    head: 'Démo de portfolio · pas un client' },
  { id: 'FR-2-4', lang: 'fr', scene: 'fr-phone-11', sizes: ['1x1'], screen: 'mock:fr',
    head: "Votre page d'accueil, avant de payer" },
  { id: 'FR-3', lang: 'fr', scene: 'fr-cafe-916', sizes: ['9x16', '4x5'], screen: 'mock:fr',
    head: 'Site vitrine dès ~{fromEUR} € HT · démo gratuite',
    small: "Prix HT indicatif, conversion au taux officiel de la Banque d'Algérie (début octobre 2026)" },

  // ---------------- Gulf, English ----------------
  { id: 'GU-EN-1', lang: 'en', scene: 'gu-phone-916', sizes: ['9x16', '4x5'], screen: 'mock:en',
    head: 'See it first. Pay only if you go ahead.',
    small: 'Free Preview · 5 working days from your content · registered businesses · max 4/month' },
  { id: 'GU-EN-2-1', lang: 'en', scene: 'gu-laptop-11', sizes: ['1x1'], screen: BS, gate: 'client permission',
    head: 'Live client site · Algeria' },
  { id: 'GU-EN-2-2', lang: 'en', scene: 'gu-laptop-11', sizes: ['1x1'], screen: AT, gate: 'client permission',
    head: 'Live client site · Algeria' },
  { id: 'GU-EN-2-3', lang: 'en', scene: 'gu-laptop-11', sizes: ['1x1'], screen: GL, banner: 'PORTFOLIO DEMO · not a client',
    head: 'Glaive Store · portfolio demo' },
  { id: 'GU-EN-2-4', lang: 'en', scene: 'gu-phone-11', sizes: ['1x1'], screen: 'mock:en',
    head: 'Your homepage next?',
    small: 'Free Preview · 5 working days from your content · registered businesses · max 4/month' },
  { id: 'GU-EN-3', lang: 'en', scene: 'gu-cafe-916', sizes: ['9x16', '4x5'], screen: 'mock:en',
    head: 'Business website from about ${fromUSD} excl. tax',
    sub: 'See your homepage first: free Preview',
    small: 'Approx. conversion, Bank of Algeria official rate, early Oct 2026 · Free Preview: 5 working days from your content · registered businesses · max 4/month' },

  // ---------------- Gulf, Arabic ----------------
  { id: 'GU-AR-1', lang: 'ar', scene: 'gu-phone-916', sizes: ['9x16', '4x5'], screen: 'mock:ar',
    head: 'موقعك الجديد… تراه قبل أن تدفع',
    sub: 'صفحة رئيسية حقيقية بمحتواك أنت، جاهزة خلال 5 أيام عمل من استلامه',
    small: 'مجانًا ودون التزام · للأنشطة التجارية المسجّلة' },
  { id: 'GU-AR-2-1', lang: 'ar', scene: 'gu-laptop-11', sizes: ['1x1'], screen: BS, gate: 'client permission',
    head: 'موقع Bordj Steel للشركات', small: 'عمل منشور: bordjsteelb2b.netlify.app' },
  { id: 'GU-AR-2-2', lang: 'ar', scene: 'gu-laptop-11', sizes: ['1x1'], screen: AT, gate: 'client permission',
    head: 'هوية وموقع وكالة Alliance Travel', small: 'عمل منشور: alliancetravel34.netlify.app' },
  { id: 'GU-AR-2-3', lang: 'ar', scene: 'gu-laptop-11', sizes: ['1x1'], screen: GL, banner: 'نموذج تجريبي (Demo) من إعدادنا، وليس لعميل',
    head: 'متجر Glaive Store: نموذج تجريبي' },
  { id: 'GU-AR-2-4', lang: 'ar', scene: 'gu-phone-11', sizes: ['1x1'], screen: 'mock:ar',
    head: 'موقعك أنت… قبل أن تدفع',
    small: 'موقع تعريفي من نحو {fromUSD} دولارًا قبل الضريبة · سعر تقريبي · 4 معاينات شهريًا' },
];

// the neutral demo homepage on the phone screens (placeholders, no invented brand)
export const MOCK = {
  fr: { dir: 'ltr', logo: 'Votre logo', name: 'Votre entreprise', line: 'Votre activité, vos services, en une phrase claire.',
        cta: 'Demander un devis', cards: ['Service 1', 'Service 2', 'Service 3'], note: 'Exemple de page d’accueil', contact: 'Contact et horaires', langs: null },
  en: { dir: 'ltr', logo: 'Your logo', name: 'Your business', line: 'What you do and who you do it for, in one clear line.',
        cta: 'Get a quote', cards: ['Service 1', 'Service 2', 'Service 3'], note: 'Example homepage', contact: 'Contact and opening hours', langs: ['EN', 'عربي'] },
  ar: { dir: 'rtl', logo: 'شعارك هنا', name: 'اسم نشاطك', line: 'نشاطك وخدماتك في جملة واحدة واضحة.',
        cta: 'اطلب عرض سعر', cards: ['خدمة 1', 'خدمة 2', 'خدمة 3'], note: 'مثال توضيحي', contact: 'التواصل وأوقات العمل', langs: ['عربي', 'EN'] },
};
