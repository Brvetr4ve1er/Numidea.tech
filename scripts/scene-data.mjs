/**
 * The blueprint showcase (scene/) — single source of truth.
 *
 * Every fact here was read off the live site or our own repo on 2026-10-06:
 * page lists from each site's navigation, colours from its CSS custom
 * properties and rendered pixels, typefaces from computed styles. Nothing is
 * estimated. Copy that cannot be checked against the live site does not go
 * in.
 *
 * Captures live in assets/work/<slug>/ and are refreshed with
 * `npm run work:capture`. Optional client material is picked up
 * automatically by `npm run scene` when it exists:
 *   assets/work/<slug>/before/<name>.webp + after/<name>.webp → before/after pair
 *   assets/work/<slug>/brand/<name>.webp                      → delivered assets
 * The file name becomes the caption ("logo-primary.webp" → "logo primary").
 */

export const PROJECTS = [
  {
    slug: 'bordjsteel',
    name: 'Bordj Steel',
    url: 'https://bordjsteelb2b.netlify.app',
    status: 'live',
    pages: [
      { file: 'd1', path: '/', label: { fr: 'Accueil', en: 'Home', ar: 'الرئيسية' } },
      { file: 'd2', path: '/products', label: { fr: 'Produits', en: 'Products', ar: 'المنتجات' } },
      { file: 'd3', path: '/references', label: { fr: 'Références', en: 'References', ar: 'المراجع' } },
      { file: 'd4', path: '/about/history', label: { fr: 'Notre histoire', en: 'Our history', ar: 'تاريخنا' } },
    ],
    phones: [
      { file: 'm1', label: { fr: 'Accueil', en: 'Home', ar: 'الرئيسية' } },
      { file: 'm2', label: { fr: 'Produits', en: 'Products', ar: 'المنتجات' } },
    ],
    pageCount: 12,
    langs: 'FR',
    palette: [
      { hex: '#BF272C', role: 'accent' },
      { hex: '#4B4B4B', role: 'ink' },
      { hex: '#6B6B6B', role: 'muted' },
      { hex: '#F5F5F5', role: 'surface' },
      { hex: '#FFFFFF', role: 'ground' },
    ],
    type: ['Montserrat'],
    t: {
      fr: {
        sector: 'Construction métallique · B2B · Algérie',
        scope: 'Site corporate B2B',
        summary: "La présence en ligne d'un fabricant de charpente métallique et de panneaux sandwich : un catalogue par métier, des références chiffrées, un media center et un espace recrutement.",
        deliverables: ['Site corporate, 12 pages', 'Catalogue produits : 4 fiches métier', 'Références et chiffres clés', 'Media center (blog)', 'Contact et recrutement', 'Pages légales'],
      },
      en: {
        sector: 'Structural steel · B2B · Algeria',
        scope: 'B2B corporate site',
        summary: 'The online presence of a structural-steel and sandwich-panel manufacturer: a catalogue by trade, references with figures, a media center and a careers space.',
        deliverables: ['Corporate site, 12 pages', 'Product catalogue: 4 trade pages', 'References and key figures', 'Media center (blog)', 'Contact and careers', 'Legal pages'],
      },
      ar: {
        sector: 'إنشاءات معدنية · B2B · الجزائر',
        scope: 'موقع مؤسسي B2B',
        summary: 'الحضور الرقمي لمصنّع هياكل معدنية وألواح عازلة: كتالوج حسب التخصّص، ومراجع بالأرقام، ومركز إعلامي، وفضاء للتوظيف.',
        deliverables: ['موقع مؤسسي من 12 صفحة', 'كتالوج المنتجات: 4 صفحات تخصّص', 'المراجع والأرقام الرئيسية', 'مركز إعلامي (مدوّنة)', 'الاتصال والتوظيف', 'الصفحات القانونية'],
      },
    },
  },
  {
    slug: 'alliance',
    name: 'Alliance Travel',
    url: 'https://alliancetravel34.netlify.app',
    status: 'live',
    pages: [
      { file: 'd1', path: '/#voyages', label: { fr: 'Les voyages', en: 'The trips', ar: 'الرحلات' } },
      { file: 'd2', path: '/istanbul/', label: { fr: 'Istanbul', en: 'Istanbul', ar: 'إسطنبول' } },
      { file: 'd3', path: '/rendez-vous-visa/', label: { fr: 'Rendez-vous visa', en: 'Visa appointments', ar: 'مواعيد التأشيرة' } },
      { file: 'd4', path: '/bali/', label: { fr: 'Bali', en: 'Bali', ar: 'بالي' } },
    ],
    phones: [
      { file: 'm1', label: { fr: 'Accueil', en: 'Home', ar: 'الرئيسية' } },
      { file: 'm2', label: { fr: 'Istanbul', en: 'Istanbul', ar: 'إسطنبول' } },
    ],
    pageCount: 9,
    langs: 'FR · EN · AR',
    palette: [
      { hex: '#002C51', role: 'ink' },
      { hex: '#237A4A', role: 'accent' },
      { hex: '#9CE8B2', role: 'highlight' },
      { hex: '#F7F1E3', role: 'ground' },
      { hex: '#0A0F15', role: 'night' },
    ],
    type: ['DM Sans', 'Tajawal'],
    t: {
      fr: {
        sector: 'Agence de voyage · Bordj Bou Arréridj',
        scope: 'Identité, site et parcours de réservation',
        summary: "Une agence de voyages organisés : chaque destination a sa page, son prix « à partir de » et un calculateur qui envoie le devis sur WhatsApp. Trilingue, arabe en RTL, en mode clair et sombre.",
        deliverables: ['Identité de marque', 'Site trilingue FR · EN · AR, arabe en RTL', '7 pages destination', 'Calculateur de devis vers WhatsApp', 'Service de rendez-vous visa', 'Mode clair et mode sombre'],
      },
      en: {
        sector: 'Travel agency · Bordj Bou Arréridj',
        scope: 'Identity, site and booking journey',
        summary: 'An organised-travel agency: every destination has its own page, a "from" price and a calculator that sends the quote to WhatsApp. Trilingual, Arabic in RTL, in light and dark mode.',
        deliverables: ['Brand identity', 'Trilingual site FR · EN · AR, Arabic in RTL', '7 destination pages', 'Quote calculator to WhatsApp', 'Visa appointment service', 'Light and dark mode'],
      },
      ar: {
        sector: 'وكالة سفر · برج بوعريريج',
        scope: 'الهوية والموقع ومسار الحجز',
        summary: 'وكالة رحلات منظّمة: لكل وجهة صفحتها وسعر «ابتداءً من» وحاسبة ترسل عرض السعر عبر واتساب. ثلاثي اللغة، والعربية من اليمين إلى اليسار، بوضعين فاتح وداكن.',
        deliverables: ['الهوية البصرية', 'موقع ثلاثي اللغة FR · EN · AR', '7 صفحات للوجهات', 'حاسبة عرض سعر عبر واتساب', 'خدمة مواعيد التأشيرة', 'وضع فاتح ووضع داكن'],
      },
    },
  },
  {
    slug: 'glaive',
    name: 'Glaive Store',
    url: 'https://glaivestore.netlify.app',
    // the live site states it: "Portfolio demo · fictional brand and products"
    status: 'concept',
    pages: [
      { file: 'd1', path: '/', label: { fr: 'Accueil', en: 'Home', ar: 'الرئيسية' } },
      { file: 'd2', path: '/shop.html', label: { fr: 'Boutique', en: 'Shop', ar: 'المتجر' } },
      { file: 'd3', path: '/product.html', label: { fr: 'Fiche produit', en: 'Product page', ar: 'صفحة منتج' } },
      { file: 'd4', path: '/quiz.html', label: { fr: 'Quiz « Find your gear »', en: '"Find your gear" quiz', ar: 'اختبار «Find your gear»' } },
    ],
    phones: [
      { file: 'm1', label: { fr: 'Accueil', en: 'Home', ar: 'الرئيسية' } },
      { file: 'm2', label: { fr: 'Fiche produit', en: 'Product page', ar: 'صفحة منتج' } },
    ],
    pageCount: null,
    langs: 'EN',
    palette: [
      { hex: '#FF5101', role: 'accent' },
      { hex: '#0A0A0B', role: 'ground' },
      { hex: '#18181B', role: 'surface' },
      { hex: '#F5F5F6', role: 'ink' },
      { hex: '#A1A1AA', role: 'muted' },
    ],
    type: ['Archivo', 'Inter'],
    t: {
      fr: {
        sector: 'E-commerce · Matériel gaming',
        scope: 'Marque fictive et boutique complète',
        summary: "Une démo de portfolio, annoncée comme telle sur le site : une marque de matériel gaming inventée de A à Z, avec boutique filtrable, fiches produit et un quiz qui recommande le bon équipement.",
        deliverables: ['Identité de marque fictive', 'Boutique filtrable par catégorie', 'Fiches produit', 'Quiz de recommandation', 'Page logiciel', 'Liste de favoris'],
      },
      en: {
        sector: 'E-commerce · Gaming gear',
        scope: 'Fictional brand and full store',
        summary: 'A portfolio demo, labelled as one on the site: a gaming-gear brand invented end to end, with a filterable shop, product pages and a quiz that recommends the right gear.',
        deliverables: ['Fictional brand identity', 'Shop filterable by category', 'Product pages', 'Recommendation quiz', 'Software page', 'Wishlist'],
      },
      ar: {
        sector: 'تجارة إلكترونية · عتاد الألعاب',
        scope: 'علامة خيالية ومتجر كامل',
        summary: 'نموذج عرض ضمن الأعمال، ومُعلَن كذلك على الموقع: علامة لعتاد الألعاب مبتكرة بالكامل، بمتجر قابل للتصفية وصفحات منتجات واختبار يقترح العتاد المناسب.',
        deliverables: ['هوية علامة خيالية', 'متجر قابل للتصفية حسب الفئة', 'صفحات المنتجات', 'اختبار توصية', 'صفحة البرمجيات', 'قائمة المفضّلة'],
      },
    },
  },
  {
    slug: 'workspacehq',
    name: 'WorkspaceHQ v3',
    url: '../workspacehq/',
    status: 'product',
    pages: [
      { file: 'd1', path: '/', label: { fr: 'Lancement', en: 'Launch', ar: 'الإطلاق' } },
      { file: 'd2', path: '/#features', label: { fr: 'Fonctionnalités', en: 'Features', ar: 'الميزات' } },
      { file: 'd3', path: '/#walkthrough', label: { fr: 'Démonstration guidée', en: 'Walkthrough', ar: 'جولة إرشادية' } },
      { file: 'd4', path: '/#bit', label: { fr: 'Bit, le compagnon', en: 'Bit, the sidekick', ar: 'Bit، الرفيق' } },
    ],
    phones: [
      { file: 'm1', label: { fr: 'Lancement', en: 'Launch', ar: 'الإطلاق' } },
      { file: 'm2', label: { fr: 'Fonctionnalités', en: 'Features', ar: 'الميزات' } },
    ],
    pageCount: null,
    langs: 'EN',
    palette: [
      { hex: '#07060F', role: 'ground' },
      { hex: '#00F0FF', role: 'accent' },
      { hex: '#FF2BD6', role: 'highlight' },
      { hex: '#FFD23F', role: 'cta' },
      { hex: '#E8E6FF', role: 'ink' },
    ],
    type: ['Press Start 2P', 'VT323'],
    t: {
      fr: {
        sector: 'Outil développeur · Open source',
        scope: 'Produit, site de lancement et personnage',
        summary: "Notre propre produit : une console qui scanne chaque dépôt de la machine et transforme l'hygiène git en quêtes. Livré avec son site de lancement, une démo jouable et Bit, son compagnon en pixel art.",
        deliverables: ['Console CLI, open source sur GitHub', 'Site de lancement', 'Vidéo et démonstration guidée', 'Démo interactive dans le navigateur', 'Personnage Bit en pixel art'],
      },
      en: {
        sector: 'Developer tool · Open source',
        scope: 'Product, launch site and character',
        summary: 'Our own product: a console that scans every repo on the machine and turns git hygiene into quests. Shipped with its launch site, a playable demo and Bit, its pixel-art sidekick.',
        deliverables: ['CLI console, open source on GitHub', 'Launch site', 'Reel and guided walkthrough', 'Interactive in-browser demo', 'Bit, a pixel-art character'],
      },
      ar: {
        sector: 'أداة للمطوّرين · مفتوحة المصدر',
        scope: 'المنتج وموقع الإطلاق والشخصية',
        summary: 'منتجنا الخاص: وحدة تحكّم تفحص كل مستودع على الجهاز وتحوّل نظافة git إلى مهام. يأتي مع موقع إطلاقه وعرض تفاعلي وBit، رفيقه بفنّ البكسل.',
        deliverables: ['وحدة تحكّم CLI مفتوحة المصدر على GitHub', 'موقع الإطلاق', 'فيديو وجولة إرشادية', 'عرض تفاعلي في المتصفّح', 'شخصية Bit بفنّ البكسل'],
      },
    },
  },
  {
    slug: 'almaflow',
    name: 'AlmaFlowClim',
    url: 'https://almaflowclim.netlify.app',
    status: 'live',
    pages: [
      { file: 'd1', path: '/', label: { fr: 'Accueil', en: 'Home', ar: 'الرئيسية' } },
      { file: 'd2', path: '/climatisation', label: { fr: 'Climatisation', en: 'Air conditioning', ar: 'التكييف' } },
      { file: 'd3', path: '/realisations', label: { fr: 'Réalisations', en: 'Projects', ar: 'الإنجازات' } },
      { file: 'd4', path: '/contact', label: { fr: 'Devis', en: 'Quote', ar: 'طلب عرض سعر' } },
    ],
    phones: [
      { file: 'm1', label: { fr: 'Accueil', en: 'Home', ar: 'الرئيسية' } },
      { file: 'm2', label: { fr: 'Climatisation', en: 'Air conditioning', ar: 'التكييف' } },
    ],
    pageCount: 7,
    langs: 'FR',
    palette: [
      { hex: '#3A6EA5', role: 'accent' },
      { hex: '#0D141A', role: 'ink' },
      { hex: '#4DD0E1', role: 'highlight' },
      { hex: '#FEA419', role: 'cta' },
      { hex: '#E3F2FD', role: 'surface' },
    ],
    type: ['Roboto'],
    t: {
      fr: {
        sector: 'Climatisation, chauffage, plomberie · Île-de-France',
        scope: 'Site vitrine et demande de devis',
        summary: "Un artisan de Gennevilliers qui installe et dépanne climatisation, chauffage et plomberie : une page par métier, une galerie de chantiers filtrable et un devis en un formulaire, pensés pour les recherches locales.",
        deliverables: ['Site vitrine, 7 pages', '3 pages métier', 'Galerie de réalisations filtrable', 'Formulaire de devis', 'SEO local par ville desservie', 'Mentions légales'],
      },
      en: {
        sector: 'Air conditioning, heating, plumbing · Île-de-France',
        scope: 'Showcase site and quote request',
        summary: 'A Gennevilliers installer for air conditioning, heating and plumbing: one page per trade, a filterable gallery of jobs and a one-form quote, built for local search.',
        deliverables: ['Showcase site, 7 pages', '3 trade pages', 'Filterable project gallery', 'Quote form', 'Local SEO by town served', 'Legal notice'],
      },
      ar: {
        sector: 'تكييف وتدفئة وسباكة · إيل دو فرانس',
        scope: 'موقع تعريفي وطلب عرض سعر',
        summary: 'حِرفي في جونفيلييه يركّب ويصلح التكييف والتدفئة والسباكة: صفحة لكل تخصّص، ومعرض ورشات قابل للتصفية، وطلب عرض سعر في استمارة واحدة، مهيّأ للبحث المحلي.',
        deliverables: ['موقع تعريفي من 7 صفحات', '3 صفحات تخصّص', 'معرض إنجازات قابل للتصفية', 'استمارة عرض سعر', 'سيو محلي لكل مدينة', 'الإشعار القانوني'],
      },
    },
  },
];

/* Interface copy, per language. */
export const UI = {
  fr: {
    dir: 'ltr', title: 'Planches — le travail, livrable par livrable · Numidea Labs',
    desc: "Chaque projet de Numidea Labs posé comme une planche : les pages livrées, le mobile, le système visuel, et le site en vrai.",
    crumb: 'Planches', kicker: 'Planches de projet',
    h1: 'Le travail, <em>livrable par livrable.</em>',
    lead: "Chaque planche montre ce qui a été livré, tel qu'il est en ligne aujourd'hui : les pages, le mobile, le système visuel. Les captures viennent des sites eux-mêmes.",
    index: 'Sommaire des planches', sheet: 'Pl.', visit: 'Voir le site', open: 'Ouvrir',
    sector: 'Secteur', scope: 'Périmètre', pagesL: 'Pages', langsL: 'Langues', statusL: 'Statut',
    deliverables: 'Livrables', pages: 'Pages livrées', mobile: 'Sur mobile', system: 'Système visuel',
    palette: 'Couleurs', type: 'Typographie', before: 'Avant / après', beforeL: 'Avant', afterL: 'Après', brand: 'Éléments de marque livrés',
    status: { live: 'En ligne', concept: 'Démo de portfolio', product: 'Produit maison' },
    role: { accent: 'Accent', ink: 'Texte', muted: 'Secondaire', surface: 'Surface', ground: 'Fond', highlight: 'Relief', night: 'Mode sombre', cta: 'Action' },
    captured: 'Captures du site en ligne', back: '← Retour à Numidea Labs', contact: 'Un projet à poser sur la table ?', contactCta: 'Parlons-en →',
  },
  en: {
    dir: 'ltr', title: 'Sheets — the work, deliverable by deliverable · Numidea Labs',
    desc: 'Every Numidea Labs project laid out as a sheet: the pages delivered, mobile, the visual system, and the live site.',
    crumb: 'Sheets', kicker: 'Project sheets',
    h1: 'The work, <em>deliverable by deliverable.</em>',
    lead: 'Each sheet shows what was delivered, as it is live today: the pages, mobile, the visual system. The captures come from the sites themselves.',
    index: 'Sheet index', sheet: 'Sh.', visit: 'Visit the site', open: 'Open',
    sector: 'Sector', scope: 'Scope', pagesL: 'Pages', langsL: 'Languages', statusL: 'Status',
    deliverables: 'Deliverables', pages: 'Pages delivered', mobile: 'On mobile', system: 'Visual system',
    palette: 'Colour', type: 'Type', before: 'Before / after', beforeL: 'Before', afterL: 'After', brand: 'Brand assets delivered',
    status: { live: 'Live', concept: 'Portfolio demo', product: 'Our product' },
    role: { accent: 'Accent', ink: 'Text', muted: 'Secondary', surface: 'Surface', ground: 'Ground', highlight: 'Highlight', night: 'Dark mode', cta: 'Action' },
    captured: 'Captured from the live site', back: '← Back to Numidea Labs', contact: 'A project to put on the table?', contactCta: "Let's talk →",
  },
  ar: {
    dir: 'rtl', title: 'اللوحات — الأعمال، مُخرَجاً بمُخرَج · Numidea Labs',
    desc: 'كل مشروع من Numidea Labs معروض كلوحة: الصفحات المسلّمة، والهاتف، والنظام البصري، والموقع الحيّ.',
    crumb: 'اللوحات', kicker: 'لوحات المشاريع',
    h1: 'الأعمال، <em>مُخرَجاً بمُخرَج.</em>',
    lead: 'كل لوحة تعرض ما سُلِّم كما هو على الإنترنت اليوم: الصفحات، والهاتف، والنظام البصري. اللقطات مأخوذة من المواقع نفسها.',
    index: 'فهرس اللوحات', sheet: 'لوحة', visit: 'زيارة الموقع', open: 'فتح',
    sector: 'القطاع', scope: 'النطاق', pagesL: 'الصفحات', langsL: 'اللغات', statusL: 'الحالة',
    deliverables: 'المُخرَجات', pages: 'الصفحات المسلّمة', mobile: 'على الهاتف', system: 'النظام البصري',
    palette: 'الألوان', type: 'الخطوط', before: 'قبل / بعد', beforeL: 'قبل', afterL: 'بعد', brand: 'عناصر الهوية المسلّمة',
    status: { live: 'على الإنترنت', concept: 'نموذج عرض', product: 'منتجنا' },
    role: { accent: 'لون مميّز', ink: 'النص', muted: 'ثانوي', surface: 'سطح', ground: 'خلفية', highlight: 'إبراز', night: 'الوضع الداكن', cta: 'إجراء' },
    captured: 'لقطات من الموقع الحيّ', back: '→ العودة إلى Numidea Labs', contact: 'مشروع تريد وضعه على الطاولة؟', contactCta: 'لنتحدّث ←',
  },
};
