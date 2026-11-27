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
 *
 * `context` and `gains` feed each sheet's "what it gives the client" block
 * ("Ce que le site apporte au client"; for the demo, what it shows; for our
 * product, what it gives its users). Read off the live sites on 2026-10-17:
 * every gain is something a visitor can do there today, and `at` is the page
 * that shows it (printed beside it, like the page captions). Phrased as what
 * the client or their customers can now do, never a result: no figures, no
 * "more", no "increased" (check.mjs refuses digits and %). 3 to 5 per sheet.
 *
 * Order (decision 16, 2026-10-30): the delivered client sites first, in the
 * order the home page shows them, then the other finished work under one
 * heading (UI.group): since wave 3 (2026-11-24) the industrial directory,
 * the portfolio demo, our own product and the studio's own site, each
 * labelled by its status; build-scene.mjs refuses a live sheet after that
 * cut. Four live sheets: the four delivered client sites. A `live` sheet ends on the offer's call to action
 * (decision 17), with the home page's own conditions (prev.terms).
 *
 * `identity` is a link beside a sheet's deliverables, not among them: work
 * of the founder's own, shown on his Behance (hub/), such as the Bordj Steel
 * brand identity. Its key is not `url`: check.mjs reads every `url:` of this
 * file as a client site that the home page must link.
 */

export const PROJECTS = [
  {
    slug: 'bordjsteel',
    studio: 'case-bordjsteel',   // its case on the Studio (hub/#case-bordjsteel): the sheet links to it (journey-12)
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
    // the brand identity is the founder's design work, on his Behance (the
    // same gallery the hub's design grid shows); the site is the studio's
    identity: {
      href: 'https://www.behance.net/gallery/233148849/BORDJ-STEEL-BRANDING-PROJECT',
      fr: 'Identité de marque sur Behance ↗', en: 'Brand identity on Behance ↗', ar: 'الهوية البصرية على Behance ↗',
    },
    context: {
      fr: "Un fabricant de Bordj\u00a0Bou\u00a0Arréridj aux quatre unités de production, qui travaille pour des usines, des projets agricoles et des promoteurs industriels dans toute l’Algérie.",
      en: "A Bordj\u00a0Bou\u00a0Arréridj manufacturer with four production units, working for factories, farm projects and industrial developers across Algeria.",
      ar: "مصنّع في برج بوعريريج له أربع وحدات إنتاج، يعمل لصالح المصانع والمشاريع الزراعية والمطوّرين الصناعيين في أنحاء الجزائر.",
    },
    gains: [
      { at: "/products",
        fr: "Un acheteur trouve la bonne gamme sans appeler\u202f: une page par unité de production, avec ce qu’elle fabrique et à quoi cela sert.",
        en: "A buyer finds the right product line without calling: one page per production unit, with what it makes and what it is used for.",
        ar: "يجد المشتري خط الإنتاج المناسب دون أن يتصل: صفحة لكل وحدة إنتاج، فيها ما تصنعه وفيمَ يُستعمل." },
      { at: "/products/sandwich-panels",
        fr: "Un bureau d’études lit les caractéristiques techniques en\u00a0ligne, essaie les épaisseurs de panneau sur une coupe interactive et télécharge le catalogue en PDF.",
        en: "An engineering office reads the technical data online, tries each panel thickness on an interactive cross-section and downloads the PDF catalogue.",
        ar: "يقرأ مكتب الدراسات الخصائص التقنية على الموقع، ويجرّب سماكات الألواح على مقطع تفاعلي، ويحمّل الكتالوج بصيغة PDF." },
      { at: "/contact",
        fr: "Un client joint directement le bon service, du commercial au montage : chacun a son numéro direct, et numéros comme e-mails se copient d’un clic.",
        en: "A customer reaches the right department directly, from sales to site assembly: each has its own direct number, and numbers and email addresses copy in one click.",
        ar: "يتصل العميل مباشرة بالقسم المعني، من المبيعات إلى التركيب: لكل قسم رقمه المباشر، والأرقام والبريد تُنسخ بنقرة واحدة." },
      { at: "/references",
        fr: "Avant un premier rendez-vous, un maître d’ouvrage voit des chantiers de référence — où, et ce qui a été fourni et monté.",
        en: "Before a first meeting, a project owner sees reference projects — where, and what was supplied and put up.",
        ar: "قبل أول لقاء، يطّلع صاحب المشروع على مشاريع مرجعية — أين أُنجزت وما الذي وُرِّد ورُكِّب فيها." },
      { at: "/recrutement",
        fr: "Un candidat consulte les offres d’emploi et postule, ou envoie une candidature spontanée.",
        en: "A job seeker reads the openings and applies, or sends an open application.",
        ar: "يطّلع الباحث عن عمل على عروض التوظيف ويتقدّم إليها، أو يرسل طلب توظيف من تلقاء نفسه." },
    ],
    t: {
      fr: {
        sector: 'Construction métallique\u00a0· B2B\u00a0· Algérie',
        scope: 'Site corporate B2B',
        summary: "La présence en\u00a0ligne d’un fabricant de charpente métallique et de panneaux sandwich\u202f: un catalogue par métier, des références chiffrées, un media center et un espace recrutement.",
        deliverables: ['Site corporate, 12 pages', 'Catalogue produits\u202f: 4 fiches métier', 'Références et chiffres clés', 'Media center (blog)', 'Contact et recrutement', 'Pages légales'],
      },
      en: {
        sector: 'Structural steel\u00a0· B2B\u00a0· Algeria',
        scope: 'B2B corporate site',
        summary: 'The online presence of a structural-steel and sandwich-panel manufacturer: a product catalogue organised by business line, client references with key figures, a media centre and a careers section.',
        deliverables: ['Corporate site, 12 pages', 'Product catalogue: 4 pages, one per business line', 'References and key figures', 'Media centre (blog)', 'Contact and careers', 'Legal pages'],
      },
      ar: {
        sector: 'إنشاءات معدنية\u00a0· B2B\u00a0· الجزائر',
        scope: 'موقع مؤسسي B2B',
        summary: 'الحضور الرقمي لمصنّع هياكل معدنية وألواح عازلة: كتالوج حسب التخصّص، ومراجع بالأرقام، ومركز إعلامي، وقسم للتوظيف.',
        deliverables: ['موقع مؤسسي من 12 صفحة', 'كتالوج المنتجات: 4 صفحات تخصّص', 'المراجع والأرقام الرئيسية', 'مركز إعلامي (مدوّنة)', 'الاتصال والتوظيف', 'الصفحات القانونية'],
      },
    },
  },
  {
    slug: 'alliance',
    studio: 'case-alliance',   // its case on the Studio (hub/#case-alliance): the sheet links to it (journey-12)
    book: '../hub/brand/alliance/',   // the brand book made for it, on the Studio
    name: 'Alliance Travel',
    url: 'https://alliancetravel.app/',
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
    langs: 'FR\u00a0· EN\u00a0· AR',
    palette: [
      { hex: '#002C51', role: 'ink' },
      { hex: '#237A4A', role: 'accent' },
      { hex: '#9CE8B2', role: 'highlight' },
      { hex: '#F7F1E3', role: 'ground' },
      { hex: '#0A0F15', role: 'night' },
    ],
    type: ['DM Sans', 'Tajawal'],
    context: {
      fr: "Une agence de voyages organisés de Bordj\u00a0Bou\u00a0Arréridj, présente aussi à M’Sila, chez qui l’on réserve par téléphone, sur WhatsApp ou au guichet.",
      en: "A package-tour agency from Bordj\u00a0Bou\u00a0Arréridj, also in M’Sila, where people book by phone, on WhatsApp or at the desk.",
      ar: "وكالة رحلات منظّمة من برج بوعريريج، لها فرع في المسيلة أيضاً، يحجز عملاؤها بالهاتف أو عبر واتساب أو في الوكالة مباشرة.",
    },
    gains: [
      { at: "/istanbul/",
        fr: "Un voyageur choisit sa date, son hôtel, sa chambre et le nombre de voyageurs par âge, et voit le total estimé avant de contacter l’agence.",
        en: "A traveller picks the date, hotel, room and how many travellers of each age, and sees the estimated total before contacting the agency.",
        ar: "يختار المسافر التاريخ والفندق ونوع الغرفة وعدد المسافرين حسب أعمارهم، فيرى المجموع التقديري قبل أن يتصل بالوكالة." },
      { at: "/istanbul/",
        fr: "Il prépare son dossier en\u00a0ligne — le passeport de chaque voyageur, vérifié à la saisie — et l’envoie sur WhatsApp en un message complet, ou par e-mail.",
        en: "They put the booking file together online — each traveller’s passport details, checked as they type — and send it on WhatsApp as one complete message, or by email.",
        ar: "يُعِدّ ملف الحجز على الموقع — بيانات جواز سفر كل مسافر، مع التحقّق منها أثناء الكتابة — ثم يرسله عبر واتساب في رسالة واحدة كاملة، أو بالبريد الإلكتروني." },
      { at: "/bali/",
        fr: "Avant de réserver, il lit le programme de chaque destination jour par jour, ce que couvre le forfait et ce qui reste à prévoir.",
        en: "Before booking, they read each destination’s day-by-day programme, what the package covers and what to budget for on top.",
        ar: "وقبل الحجز، يقرأ برنامج كل وجهة يوماً بيوم، وما تشمله الباقة، وما يبقى عليه أن يحسب حسابه." },
      { at: "/rendez-vous-visa/",
        fr: "Pour un visa, il voit pour chaque pays le centre qui traite le dossier et ce que l’agence peut faire, puis écrit à un conseiller avec sa demande déjà rédigée.",
        en: "For a visa, they see for each country which centre handles the file and what the agency can do, then message an advisor with the request already written.",
        ar: "وللتأشيرة، يرى لكل بلد المركز الذي يعالج الملف وما يمكن للوكالة أن تتكفّل به، ثم يراسل مستشاراً برسالة طلب جاهزة." },
      { at: "/#agences",
        fr: "Il lit le site en arabe, en français ou en anglais, et trouve l’agence la plus proche avec son itinéraire.",
        en: "They read the site in Arabic, French or English, and find the nearest branch with directions.",
        ar: "يقرأ الموقع بالعربية أو الفرنسية أو الإنجليزية، ويجد أقرب فرع مع طريق الوصول إليه." },
    ],
    t: {
      fr: {
        sector: 'Agence de voyage\u00a0· Bordj\u00a0Bou\u00a0Arréridj',
        scope: 'Identité, site et parcours de réservation',
        summary: "Une agence de voyages organisés\u202f: chaque destination a sa page, son prix «\u202fà partir de\u202f» et un calculateur qui envoie le devis sur WhatsApp. Trilingue, arabe en RTL, en mode clair et sombre.",
        deliverables: ['Identité de marque', 'Site trilingue FR\u00a0· EN\u00a0· AR, arabe en RTL', '7 pages destination', 'Calculateur de devis vers WhatsApp', 'Service de rendez-vous visa', 'Mode clair et mode sombre'],
      },
      en: {
        sector: 'Travel agency\u00a0· Bordj\u00a0Bou\u00a0Arréridj',
        scope: 'Identity, site and booking journey',
        summary: 'A travel agency selling package tours: every destination has its own page with a starting price, and a calculator sends the quote straight to WhatsApp. In English, French and Arabic (right-to-left), with light and dark modes.',
        deliverables: ['Brand identity', 'Trilingual site FR\u00a0· EN\u00a0· AR, with right-to-left Arabic', '7 destination pages', 'WhatsApp quote calculator', 'Visa appointment service', 'Light and dark mode'],
      },
      ar: {
        sector: 'وكالة سفر\u00a0· برج بوعريريج',
        scope: 'الهوية والموقع ومسار الحجز',
        summary: 'وكالة رحلات منظّمة: لكل وجهة صفحتها وسعر «ابتداءً من» وحاسبة ترسل عرض السعر عبر واتساب. ثلاثي اللغة، والعربية من اليمين إلى اليسار، بوضعين فاتح وداكن.',
        deliverables: ['الهوية البصرية', 'موقع ثلاثي اللغة (الفرنسية والإنجليزية والعربية)، والعربية من اليمين إلى اليسار', '7 صفحات للوجهات', 'حاسبة عرض سعر عبر واتساب', 'خدمة مواعيد التأشيرة', 'وضع فاتح ووضع داكن'],
      },
    },
  },
  {
    slug: 'almaflow',
    studio: 'case-almaflow',   // its case on the Studio (hub/#case-almaflow): the sheet links to it (journey-12)
    book: '../hub/brand/almaflow/',   // the brand book made for it, on the Studio
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
    context: {
      fr: "Un artisan de Gennevilliers qui installe, entretient et dépanne climatisation, chauffage et plomberie chez des particuliers et des professionnels d’Île-\u2060de-\u2060France.",
      en: "A Gennevilliers firm that installs, services and repairs air conditioning, heating and plumbing for homes and businesses across Île-\u2060de-\u2060France.",
      ar: "حِرفي في جونفيلييه يركّب أنظمة التكييف والتدفئة والسباكة ويصونها ويصلح أعطالها، لدى الأفراد والمهنيين في منطقة إيل دو فرانس.",
    },
    gains: [
      { at: "/climatisation",
        fr: "En cas de panne, un client appelle d’un simple appui depuis la page du métier concerné\u202f: le numéro est en tête de page.",
        en: "If something breaks down, a customer calls in one tap from the page for that trade: the number sits at the top.",
        ar: "عند العطل، يتصل العميل بلمسة واحدة من صفحة التخصّص المعني: الرقم في أعلى الصفحة." },
      { at: "/contact",
        fr: "Pour un projet, il choisit sa prestation dans le formulaire de devis — installation, entretien, dépannage, chauffe-eau, salle de bain — et la demande arrive avec son type de travaux.",
        en: "For a project, they pick the job in the quote form — installation, servicing, repair, water heater, bathroom — so the request arrives with its type of work.",
        ar: "ولمشروع جديد، يختار الخدمة في استمارة عرض السعر — تركيب أو صيانة أو إصلاح أو سخّان ماء أو حمّام — فيصل الطلب ومعه نوع الأشغال." },
      { at: "/chauffage",
        fr: "Sur la page du métier qui le concerne, il lit ce qui est installé ou réparé, les marques suivies et les étapes d’une installation, du devis à la mise en service.",
        en: "On the page for the trade they need, they read what is installed or repaired, the brands covered and the steps of an installation, from quote to commissioning.",
        ar: "وفي صفحة التخصّص الذي يحتاجه، يقرأ ما يُركَّب أو يُصلَح، والعلامات التي يتعامل معها الحِرفي، ومراحل التركيب من عرض السعر إلى التشغيل." },
      { at: "/realisations",
        fr: "Il lit des chantiers proches du sien, chacun avec son métier, sa ville et ce qui a été posé.",
        en: "They read about jobs like their own, each with its trade, its town and what was fitted.",
        ar: "يقرأ عن أشغال تشبه ما يحتاجه، لكلّ منها تخصّصها ومدينتها وما رُكِّب فيها." },
      { at: "/#zones-title",
        fr: "Un habitant de Colombes ou de Nanterre voit d’emblée que l’artisan se déplace chez lui\u202f: les villes desservies sont listées sur l’accueil.",
        en: "Someone in Colombes or Nanterre sees at once that the firm comes to their town: the towns served are listed on the home page.",
        ar: "يرى ساكن كولومب أو نانتير من أول نظرة أن الحِرفي يتنقّل إلى مدينته: المدن المخدومة مذكورة في الصفحة الرئيسية." },
    ],
    t: {
      fr: {
        sector: 'Climatisation, chauffage, plomberie\u00a0· Île-\u2060de-\u2060France',
        scope: 'Site vitrine et demande de devis',
        summary: "Un artisan de Gennevilliers qui installe et dépanne climatisation, chauffage et plomberie\u202f: une page par métier, ses réalisations chantier par chantier et un devis en un formulaire, pensés pour les recherches locales.",
        deliverables: ['Site vitrine, 7 pages', '3 pages métier', 'Page de réalisations', 'Formulaire de devis', 'SEO local par ville desservie', 'Mentions légales'],
      },
      en: {
        sector: 'Air conditioning, heating, plumbing\u00a0· Île-\u2060de-\u2060France',
        scope: 'Showcase site and quote request',
        summary: 'A Gennevilliers installer for air conditioning, heating and plumbing: one page per trade, a page of past jobs and a one-form quote, built for local search.',
        deliverables: ['Showcase site, 7 pages', '3 trade pages', 'Past-jobs page', 'Quote form', 'Local SEO by town served', 'Legal notice'],
      },
      ar: {
        sector: 'تكييف وتدفئة وسباكة\u00a0· إيل دو فرانس',
        scope: 'موقع تعريفي وطلب عرض سعر',
        summary: 'حِرفي في جونفيلييه يركّب ويصلح التكييف والتدفئة والسباكة: صفحة لكل تخصّص، وصفحة للأعمال المنجزة، وطلب عرض سعر في استمارة واحدة، مع تحسين محرّكات البحث (SEO) للظهور في نتائج البحث المحلية.',
        deliverables: ['موقع تعريفي من 7 صفحات', '3 صفحات تخصّص', 'صفحة الإنجازات', 'استمارة عرض سعر', 'تحسين محرّكات البحث (SEO) لكل مدينة يخدمها', 'الإشعار القانوني'],
      },
    },
  },
  {
    // wave 3 (2026-11-24, the owner: a delivered client site): the fourth
    // delivered client, read off its live pages that day (nav, the Omra,
    // trips, destination and service pages, the contact page; colours and
    // faces from its own stylesheet, Rihla mode and its dark mode). Arabic
    // first, French on its switch; its captures are the Arabic pages.
    slug: 'nomara',
    studio: 'case-nomara',   // its case on the Studio (hub/#case-nomara)
    name: 'Nomara Voyages',
    url: 'https://nomaravoyages.netlify.app',
    status: 'live',
    pages: [
      { file: 'd1', path: '/', label: { fr: 'Accueil', en: 'Home', ar: 'الرئيسية' } },
      { file: 'd2', path: '/omra/', label: { fr: 'Omra et Hajj', en: 'Umrah and Hajj', ar: 'العمرة والحج' } },
      { file: 'd3', path: '/voyages/', label: { fr: 'Voyages organisés', en: 'Package tours', ar: 'الرحلات المنظمة' } },
      { file: 'd4', path: '/turquie/', label: { fr: 'Istanbul', en: 'Istanbul', ar: 'إسطنبول' } },
    ],
    phones: [
      { file: 'm1', label: { fr: 'Accueil', en: 'Home', ar: 'الرئيسية' } },
      { file: 'm2', label: { fr: 'Omra et Hajj', en: 'Umrah and Hajj', ar: 'العمرة والحج' } },
    ],
    // the home, Omra and Hajj, the trips, five destinations, the services
    // and their three pages, about, FAQ, contact: every page its nav and
    // footer link
    pageCount: 15,
    langs: 'AR · FR',
    palette: [
      { hex: '#1F8A7A', role: 'accent' },
      { hex: '#E8602C', role: 'cta' },
      { hex: '#14211E', role: 'ink' },
      { hex: '#FCFAF6', role: 'ground' },
      { hex: '#061A17', role: 'night' },
    ],
    type: ['Changa', 'Readex Pro'],
    context: {
      fr: "Une agence de voyages et d’Omra d’Aïn M’lila, qui fait partir les voyageurs de l’Est algérien depuis l’aéroport de Constantine ; on y réserve sur WhatsApp ou par téléphone.",
      en: "A travel and Umrah agency from Aïn M’lila that flies travellers from eastern Algeria out of Constantine airport; people book on WhatsApp or by phone.",
      ar: "وكالة سياحة وعمرة من عين مليلة، تُسفّر المسافرين من شرق الجزائر انطلاقاً من مطار قسنطينة، ويحجز عملاؤها عبر واتساب أو بالهاتف.",
    },
    gains: [
      { at: "/omra/",
        fr: "Un pèlerin compare les forfaits Omra de chaque saison par hôtel, distance du Haram et prix par personne, et lit ce que le prix comprend, visa compris.",
        en: "A pilgrim compares each season’s Umrah packages by hotel, distance from the Haram and price per person, and reads what the price covers, visa included.",
        ar: "يقارن المعتمر باقات العمرة لكل موسم حسب الفندق والمسافة من الحرم والسعر للشخص، ويقرأ ما يشمله السعر، بما فيه التأشيرة." },
      { at: "/voyages/",
        fr: "Un voyageur parcourt sur une seule page les destinations au départ de Constantine, prix par personne à l’appui, ou sur demande, et ouvre de chacune le détail ou WhatsApp.",
        en: "A traveller looks through the destinations leaving from Constantine on a single page, with the price per person, or on request, and opens the details or WhatsApp from each.",
        ar: "يتصفّح المسافر في صفحة واحدة الوجهات المنطلقة من قسنطينة مع السعر للشخص أو عند الطلب، ويفتح من كل وجهة تفاصيلها أو واتساب." }, // AR review: p.nomara.g1 (2026-11-24, wave 3 review)
      { at: "/turquie/",
        fr: "Sur la page d’une destination, il lit le programme, ce que le prix comprend et, écrit en clair, ce qu’il ne comprend pas.",
        en: "On a destination’s page, they read the programme, what the price covers and, spelled out, what it does not.",
        ar: "وفي صفحة كل وجهة، يقرأ البرنامج وما يشمله السعر، وما لا يشمله مكتوباً بوضوح." },
      { at: "/services/visa/",
        fr: "Pour un visa, un hôtel ou un billet d’avion, il lit comment l’agence procède, étape par étape, puis lance sa demande sur WhatsApp.",
        en: "For a visa, a hotel or a plane ticket, they read how the agency goes about it, step by step, then start the request on WhatsApp.",
        ar: "ولتأشيرة أو فندق أو تذكرة طيران، يقرأ كيف تعمل الوكالة خطوة بخطوة، ثم يبدأ طلبه عبر واتساب." },
      { at: "/",
        fr: "Il lit le site en arabe ou en français, en mode clair ou en mode sombre.",
        en: "They read the site in Arabic or French, in light or dark mode.",
        ar: "يقرأ الموقع بالعربية أو بالفرنسية، بالوضع الفاتح أو الداكن." },
    ],
    t: {
      fr: {
        sector: 'Voyages et Omra · Aïn M’lila',
        scope: 'Site vitrine bilingue et réservation WhatsApp',
        summary: "Une agence de voyages et d’Omra de l’Est algérien : les forfaits Omra par hôtel et distance du Haram, une page par destination avec son programme et ce que le prix comprend, les services (hôtels, billets, visa) et la réservation sur WhatsApp. En arabe et en français, en mode clair et sombre.",
        deliverables: ['Site bilingue AR · FR, arabe en RTL', 'Page Omra et Hajj', '5 pages destination', '3 pages de services', 'Réservation sur WhatsApp', 'Mode clair et mode sombre'],
      },
      en: {
        sector: 'Travel and Umrah · Aïn M’lila',
        scope: 'Bilingual showcase site and WhatsApp booking',
        summary: 'A travel and Umrah agency in eastern Algeria: Umrah packages by hotel and distance from the Haram, one page per destination with its programme and what the price covers, the services (hotels, flights, visas) and booking on WhatsApp. In Arabic and French, with light and dark modes.',
        deliverables: ['Bilingual site AR · FR, with right-to-left Arabic', 'Umrah and Hajj page', '5 destination pages', '3 service pages', 'Booking on WhatsApp', 'Light and dark mode'],
      },
      ar: {
        sector: 'سياحة وعمرة · عين مليلة',
        scope: 'موقع تعريفي ثنائي اللغة وحجز عبر واتساب',
        summary: 'وكالة سياحة وعمرة في شرق الجزائر: باقات العمرة حسب الفندق والمسافة من الحرم، وصفحة لكل وجهة ببرنامجها وما يشمله السعر، والخدمات (الفنادق والتذاكر والتأشيرة)، والحجز عبر واتساب. بالعربية والفرنسية، بوضعين فاتح وداكن.', // AR review: p.nomara.summary (2026-11-24, wave 3 review)
        deliverables: ['موقع ثنائي اللغة (العربية والفرنسية)، والعربية من اليمين إلى اليسار', 'صفحة العمرة والحج', '5 صفحات للوجهات', '3 صفحات للخدمات', 'الحجز عبر واتساب', 'وضع فاتح ووضع داكن'],
      },
    },
  },
  {
    // wave 3 (2026-11-24, the owner: a finished project, on Vercel): read off
    // its live pages that day (the directory, two company pages, its legal
    // notice, the directory in Arabic; colours from its stylesheet, the face from its font file). Its
    // own name only: it is not counted among the delivered client sites, and
    // nothing here says whose order it was. Never its admin space.
    slug: 'annuaire',
    name: 'Annuaire industriel algérien',
    // the heading per language: the site's own French name in fr and en, the
    // Arabic name the Arabic home and the Studio use (proof.annuaire) in ar
    // (OWNER-CONTENT, wave-3 Arabic review)
    nameT: { fr: 'Annuaire industriel algérien', en: 'Annuaire industriel algérien', ar: 'الدليل الصناعي الجزائري' }, // AR review: p.annuaire.name (2026-11-24, wave 3 review)
    url: 'https://annuaire-dz.vercel.app/fr',
    status: 'finished',
    pages: [
      { file: 'd1', path: '/', label: { fr: 'L’annuaire', en: 'The directory', ar: 'الدليل' } },
      { file: 'd2', path: '/entreprises/africaver-spa', label: { fr: 'Fiche entreprise, Jijel', en: 'Company page, Jijel', ar: 'صفحة مؤسسة، جيجل' } },
      { file: 'd3', path: '/entreprises/briks-eurl-kadri-et-fils', label: { fr: 'Fiche entreprise, Bordj Bou Arréridj', en: 'Company page, Bordj Bou Arréridj', ar: 'صفحة مؤسسة، برج بوعريريج' } },
      // the directory in Arabic, beside /fr at the host's root (root: true; the legal notice stays a deliverable line only)
      { file: 'd4', path: '/ar', root: true, label: { fr: 'L’annuaire en arabe', en: 'The directory in Arabic', ar: 'الدليل بالعربية' } }, // AR review: p.annuaire.pg3 (2026-11-24, wave 3 review)
    ],
    phones: [
      { file: 'm1', label: { fr: 'L’annuaire', en: 'The directory', ar: 'الدليل' } },
      { file: 'm2', label: { fr: 'Fiche entreprise', en: 'Company page', ar: 'صفحة مؤسسة' } },
    ],
    pageCount: null,
    langs: 'FR · AR · EN',
    palette: [
      { hex: '#047857', role: 'accent' },
      { hex: '#0F172A', role: 'ink' },
      { hex: '#475569', role: 'muted' },
      { hex: '#ECFDF5', role: 'surface' },
      { hex: '#F8FAFC', role: 'ground' },
    ],
    type: ['Plus Jakarta Sans'],
    context: {
      fr: "Un annuaire public des entreprises industrielles algériennes : ce qu’elles savent faire et ce qu’elles recherchent, pour que les acheteurs, les investisseurs et les partenaires trouvent celles qu’il leur faut.",
      en: "A public directory of Algerian industrial companies: what they can do and what they are looking for, so that buyers, investors and partners find the ones they need.",
      ar: "دليل عمومي للمؤسسات الصناعية الجزائرية: ما تتقنه وما تبحث عنه، ليجد المشترون والمستثمرون والشركاء المؤسسات التي يحتاجونها.",
    },
    gains: [
      { at: "/",
        fr: "Un acheteur cherche une entreprise ou une activité, puis filtre la liste par wilaya et par type d’entreprise.",
        en: "A buyer searches for a company or an activity, then narrows the list by wilaya and by type of company.",
        ar: "يبحث المشتري عن مؤسسة أو نشاط، ثم يصفّي القائمة حسب الولاية ونوع المؤسسة." },
      { at: "/entreprises/africaver-spa",
        fr: "Sur la fiche d’une entreprise, il lit ce qu’elle sait faire, ses certifications et ses besoins, avec sa wilaya, sa tranche d’effectif et un lien vers son site.",
        en: "On a company’s page, they read what it can do, its certifications and its needs, with its wilaya, its headcount band and a link to its website.",
        ar: "في صفحة كل مؤسسة، يقرأ ما تتقنه وشهاداتها واحتياجاتها، مع ولايتها وفئة عدد عمّالها ورابط موقعها." },
      { at: "/entreprises/africaver-spa",
        fr: "De là, il passe à des entreprises similaires.",
        en: "From there, they move on to similar companies.",
        ar: "ومن هناك، ينتقل إلى مؤسسات مشابهة." },
      { at: "/mentions-legales",
        fr: "Il sait ce qui est publié et ce qui ne l’est jamais : ni les coordonnées des personnes, ni les chiffres des entreprises, ni leurs financements.",
        en: "They know what is published and what never is: no one’s contact details, no company figures, no funding.",
        ar: "ويعرف ما يُنشر وما لا يُنشر أبداً: لا بيانات اتصال الأشخاص، ولا أرقام المؤسسات، ولا تمويلاتها." },
      { at: "/",
        fr: "Il lit l’annuaire en français, en arabe ou en anglais.",
        en: "They read the directory in French, Arabic or English.",
        ar: "يقرأ الدليل بالفرنسية أو العربية أو الإنجليزية." },
    ],
    t: {
      fr: {
        sector: 'Annuaire industriel · Algérie',
        scope: 'Annuaire en ligne trilingue',
        summary: "L’annuaire des entreprises industrielles algériennes : savoir-faire, certifications et besoins. Une recherche filtrée par wilaya et par type, une fiche par entreprise avec ses entreprises similaires, en français, en arabe et en anglais.",
        deliverables: ['Annuaire trilingue FR · AR · EN, arabe en RTL', 'Recherche et filtres par wilaya et par type', 'Une fiche par entreprise', 'Entreprises similaires', 'Espace d’administration', 'Mentions légales et confidentialité'],
      },
      en: {
        sector: 'Industrial directory · Algeria',
        scope: 'Trilingual online directory',
        summary: 'The directory of Algerian industrial companies: capabilities, certifications and needs. A search filtered by wilaya and type, one page per company with its similar companies, in French, Arabic and English.',
        deliverables: ['Trilingual directory FR · AR · EN, with right-to-left Arabic', 'Search and filters by wilaya and type', 'One page per company', 'Similar companies', 'Admin area', 'Legal notice and privacy'],
      },
      ar: {
        sector: 'دليل صناعي · الجزائر',
        scope: 'دليل إلكتروني ثلاثي اللغة',
        summary: 'دليل المؤسسات الصناعية الجزائرية: الكفاءات والشهادات والاحتياجات. بحث مع تصفية حسب الولاية والنوع، وصفحة لكل مؤسسة مع مؤسسات مشابهة، بالفرنسية والعربية والإنجليزية.',
        deliverables: ['دليل ثلاثي اللغة (الفرنسية والعربية والإنجليزية)، والعربية من اليمين إلى اليسار', 'بحث وتصفية حسب الولاية والنوع', 'صفحة لكل مؤسسة', 'مؤسسات مشابهة', 'فضاء الإدارة', 'الإشعار القانوني والخصوصية'],
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
      { file: 'd4', path: '/quiz.html', label: { fr: 'Quiz «\u202fFind your gear\u202f»', en: '"Find your gear" quiz', ar: 'اختبار «Find your gear»' } },
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
    context: {
      fr: "Pas de client\u202f: une marque inventée par le studio, annoncée comme démo sur chaque page, pour montrer une boutique en\u00a0ligne complète.",
      en: "No client: a brand the studio invented, labelled as a demo on every page, to show a complete online store.",
      ar: "لا عميل هنا: علامة ابتكرها الاستوديو، ومُعلَن في كل صفحة أنها عرض تجريبي، لإظهار متجر إلكتروني كامل.",
    },
    gains: [
      { at: "/quiz.html",
        fr: "Un acheteur qui hésite répond à trois questions — type de matériel, avec ou sans fil, ce qui compte le plus pour lui — et reçoit une sélection.",
        en: "An undecided shopper answers three questions — kind of gear, wired or wireless, what matters most — and gets a shortlist.",
        ar: "يجيب المتسوّق المتردّد عن ثلاثة أسئلة — نوع العتاد، سلكي أو لاسلكي، وما يهمّه أكثر — فيحصل على تشكيلة مقترحة." },
      { at: "/shop.html",
        fr: "Il filtre la boutique par catégorie et par prix maximum, puis trie par nouveauté, prix ou note.",
        en: "They filter the shop by category and maximum price, then sort by newest, price or rating.",
        ar: "يصفّي المتجر حسب الفئة والسعر الأقصى، ثم يرتّب المنتجات حسب الأحدث أو السعر أو التقييم." },
      { at: "/compare.html",
        fr: "Il place des produits côte à côte et compare leurs caractéristiques ligne par ligne.",
        en: "They put products side by side and compare their specifications line by line.",
        ar: "يضع المنتجات جنباً إلى جنب ويقارن خصائصها سطراً بسطر." },
      { at: "/product.html",
        fr: "Sur chaque fiche produit, il lit les caractéristiques techniques dans un tableau, juste sous le bouton d’achat.",
        en: "On each product page, they read the specifications in a table, just below the buy button.",
        ar: "ويقرأ في صفحة كل منتج خصائصه التقنية في جدول، تحت زرّ الشراء مباشرة." },
    ],
    t: {
      fr: {
        sector: 'E-\u2060commerce\u00a0· Matériel gaming',
        scope: 'Marque fictive et boutique complète',
        summary: "Une démo de portfolio, annoncée comme telle sur le site\u202f: une marque de matériel gaming inventée de A à Z, avec boutique filtrable, fiches produit et un quiz qui recommande le bon équipement.",
        deliverables: ['Identité de marque fictive', 'Boutique filtrable par catégorie', 'Fiches produit', 'Quiz de recommandation', 'Page logiciel', 'Liste de favoris'],
      },
      en: {
        sector: 'E-\u2060commerce\u00a0· Gaming gear',
        scope: 'Fictional brand and full store',
        summary: 'A portfolio demo, labelled as one on the site: a gaming-gear brand invented end to end, with a filterable shop, product pages and a quiz that recommends the right gear.',
        deliverables: ['Fictional brand identity', 'Shop filterable by category', 'Product pages', 'Recommendation quiz', 'Software page', 'Wishlist'],
      },
      ar: {
        sector: 'تجارة إلكترونية\u00a0· عتاد الألعاب',
        scope: 'علامة خيالية ومتجر كامل',
        summary: 'عرض تجريبي ضمن الأعمال، ومُعلَن كذلك على الموقع: علامة لعتاد الألعاب مبتكرة بالكامل، بمتجر قابل للتصفية وصفحات منتجات واختبار يقترح العتاد المناسب.',
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
    context: {
      fr: "Notre propre produit, pour les développeurs qui gardent de nombreux dépôts git sur une même machine.",
      en: "Our own product, for developers who keep many git repositories on one machine.",
      ar: "منتجنا الخاص، للمطوّرين الذين يحتفظون بمستودعات git كثيرة على جهاز واحد.",
    },
    gains: [
      { at: "/#faq",
        fr: "Un développeur voit l’état de tous ses dépôts en un seul scan, qui tourne sur sa machine\u202f: branches, travail non validé ou non poussé, builds et tests.",
        en: "A developer sees the state of every repo in a single scan, run on their own machine: branches, uncommitted or unpushed work, builds and tests.",
        ar: "يرى المطوّر حالة جميع مستودعاته في فحص واحد يجري على جهازه: الفروع، والعمل غير المحفوظ أو غير المرفوع، والبناء والاختبارات." },
      { at: "/#features",
        fr: "À son retour, il lit ce qui a bougé pendant son absence, et une seule action prioritaire s’affiche en tête.",
        en: "Coming back, they read what moved while they were away, and a single priority action sits on top.",
        ar: "عند عودته، يقرأ ما تغيّر أثناء غيابه، وتظهر في الأعلى خطوة واحدة ذات أولوية." },
      { at: "/#features",
        fr: "Il voit signalés les clés et secrets laissés en clair, avant qu’ils ne partent dans un commit.",
        en: "They see keys and secrets left in plain text flagged before they ship with a commit.",
        ar: "ويرى تنبيهاً إلى المفاتيح والأسرار المتروكة مكشوفة، قبل أن تُرسَل مع أي إيداع (commit)." },
      { at: "/#features",
        fr: "Il lit les diffs de chaque projet et pose ses questions à Claude sur ses vrais dépôts, sans quitter la console.",
        en: "They read each project’s diffs and ask Claude about their actual repos, without leaving the console.",
        ar: "يقرأ تغييرات كل مشروع ويسأل Claude عن مستودعاته الفعلية، دون مغادرة وحدة التحكّم." },
      { at: "/#demo",
        fr: "Avant d’installer quoi que ce soit, il essaie la vraie console dans le navigateur, sur des dépôts d’exemple.",
        en: "Before installing anything, they try the real console in the browser, on sample repos.",
        ar: "قبل تثبيت أي شيء، يجرّب وحدة التحكّم الحقيقية في المتصفّح على مستودعات تجريبية." },
    ],
    t: {
      fr: {
        sector: 'Outil développeur',
        scope: 'Produit, site de lancement et personnage',
        summary: "Notre propre produit\u202f: une console qui scanne chaque dépôt de la machine et transforme l’hygiène git en quêtes. Livré avec son site de lancement, une démo jouable et Bit, son compagnon en pixel art.",
        deliverables: ['Console de bureau (Electron), code public sur GitHub', 'Site de lancement', 'Vidéo et démonstration guidée', 'Démo interactive dans le navigateur', 'Personnage Bit en pixel art'],
      },
      en: {
        sector: 'Developer tool',
        scope: 'Product, launch site and character',
        summary: 'Our own product: a console that scans every repo on the machine and turns git hygiene into quests. Shipped with its launch site, a playable demo and Bit, its pixel-art sidekick.',
        deliverables: ['Desktop console (Electron), code public on GitHub', 'Launch site', 'Reel and guided walkthrough', 'Interactive in-browser demo', 'Bit, a pixel-art character'],
      },
      ar: {
        sector: 'أداة للمطوّرين',
        scope: 'المنتج وموقع الإطلاق والشخصية',
        summary: 'منتجنا الخاص: وحدة تحكّم لسطح المكتب تفحص كل مستودع شيفرة على الجهاز وتحوّل العناية بـ git إلى مهمّات على طريقة الألعاب. يأتي مع موقع إطلاقه وعرض تفاعلي وBit، رفيقه بفنّ البكسل.',
        deliverables: ['وحدة تحكّم لسطح المكتب (Electron)، شيفرتها منشورة على GitHub', 'موقع الإطلاق', 'فيديو وجولة إرشادية', 'عرض تفاعلي في المتصفّح', 'شخصية Bit بفنّ البكسل'],
      },
    },
  },
  {
    // 2026-11-27 (owner, world map thread): the owner's store universe joins
    // the finished projects. Today the domain holds one product page (CMF Buds
    // 2a, cash on delivery); it grows into the clothing brand, mangas,
    // stickers, merch and the app and game stores the home's portals open.
    // Captured from this repository's shop/ (the numidea-shop Vercel project).
    slug: 'tr4velerz',
    name: 'Tr4velerz Studio',
    url: 'https://tr4velerz.studio/',
    status: 'product',
    pages: [
      { file: 'd1', path: '/', label: { fr: 'Fiche produit', en: 'Product page', ar: 'صفحة المنتج' } },
      { file: 'd2', path: '/ar.html', label: { fr: 'La même, en arabe', en: 'The same, in Arabic', ar: 'الصفحة نفسها بالعربية' } },
    ],
    phones: [
      { file: 'm1', label: { fr: 'Fiche produit', en: 'Product page', ar: 'صفحة المنتج' } },
      { file: 'm2', label: { fr: 'En arabe', en: 'In Arabic', ar: 'بالعربية' } },
    ],
    pageCount: null,
    langs: 'FR · AR',
    palette: [
      { hex: '#E4E6EA', role: 'ground' },
      { hex: '#16181C', role: 'ink' },
      { hex: '#FF5A1F', role: 'accent' },
      { hex: '#FFFFFF', role: 'surface' },
    ],
    type: ['Space Grotesk', 'Space Mono'],
    context: {
      fr: "Notre propre boutique : elle commence par un produit, payé à la livraison, et deviendra la maison des vêtements, des mangas, des stickers et des boutiques d’applications et de jeux de Numidea.",
      en: "Our own store: it starts with one product, paid on delivery, and will become the home of Numidea’s clothing, mangas, stickers and app and game stores.",
      ar: "متجرنا الخاص: يبدأ بمنتج واحد يُدفع ثمنه عند الاستلام، وسيصبح بيت ملابس نوميديا ومانغاتها وملصقاتها ومتاجر تطبيقاتها وألعابها.",
    },
    gains: [
      { at: "/",
        fr: "Un acheteur choisit sa couleur, voit le prix final en dinars et commande sans carte : il paie à la livraison, après avoir vérifié le colis.",
        en: "A buyer picks a colour, sees the final price in dinars and orders without a card: they pay on delivery, after checking the parcel.",
        ar: "يختار المشتري اللون، ويرى السعر النهائي بالدينار، ويطلب دون بطاقة: يدفع عند الاستلام بعد أن يتفقّد الطرد." },
      { at: "/ar.html",
        fr: "Il lit la même page en arabe, écrite pour l’Algérie, et confirme sa commande sur WhatsApp.",
        en: "They read the same page in Arabic, written for Algeria, and confirm the order on WhatsApp.",
        ar: "يقرأ الصفحة نفسها بالعربية، مكتوبة للجزائر، ويؤكّد طلبه عبر واتساب." },
      { at: "/",
        fr: "Avant de commander, il sait ce qu’il reçoit, le délai de livraison selon sa wilaya et ce qui se passe si le produit arrive abîmé.",
        en: "Before ordering, they know what they get, the delivery time for their wilaya and what happens if the product arrives damaged.",
        ar: "قبل أن يطلب، يعرف ما سيستلمه، ومدّة التوصيل حسب ولايته، وما يحدث إن وصله المنتج تالفاً." },
    ],
    t: {
      fr: {
        sector: 'E-⁠commerce · Algérie',
        scope: 'Notre boutique, en deux langues',
        summary: "Notre propre boutique, sur tr4velerz.studio : aujourd’hui une fiche produit payée à la livraison, en français et en arabe ; demain les vêtements, les mangas, les stickers et les boutiques d’applications et de jeux.",
        deliverables: ['Fiche produit FR · AR, arabe en RTL', 'Choix de couleur et stock', 'Paiement à la livraison', 'Commande par WhatsApp', 'Réglages en un seul fichier'],
      },
      en: {
        sector: 'E-⁠commerce · Algeria',
        scope: 'Our store, in two languages',
        summary: 'Our own store, on tr4velerz.studio: today one product page paid on delivery, in French and Arabic; next, the clothing, mangas, stickers and the app and game stores.',
        deliverables: ['Product page FR · AR, with right-to-left Arabic', 'Colour choice and stock', 'Cash on delivery', 'Orders through WhatsApp', 'Settings in a single file'],
      },
      ar: {
        sector: 'تجارة إلكترونية · الجزائر',
        scope: 'متجرنا، بلغتين',
        summary: 'متجرنا الخاص على tr4velerz.studio: اليوم صفحة منتج يُدفع ثمنه عند الاستلام، بالفرنسية والعربية؛ وغداً الملابس والمانغا والملصقات ومتاجر التطبيقات والألعاب.',
        deliverables: ['صفحة منتج بالفرنسية والعربية، والعربية من اليمين إلى اليسار', 'اختيار اللون والمخزون', 'الدفع عند الاستلام', 'الطلب عبر واتساب', 'الإعدادات في ملف واحد'],
      },
    },
  },
  {
    // wave 3 (2026-11-24, the owner: "numidea itself should be among the
    // finished projects"): the studio's own site, labelled as such (as the
    // Glaive demo is labelled a demo). Captured from this repository (lib/serve.mjs),
    // never from the live host; its link is the home page, relative like
    // WorkspaceHQ's, so the browser bar shows the published address.
    slug: 'numidea',
    name: 'Numidea Labs',
    url: '../',
    status: 'own',
    pages: [
      { file: 'd1', path: '/', label: { fr: 'Accueil', en: 'Home', ar: 'الرئيسية' } },
      { file: 'd2', path: '/tarifs/', label: { fr: 'Guide des prix', en: 'Price guide', ar: 'دليل الأسعار' } },
      { file: 'd3', path: '/hub/', label: { fr: 'Le Studio', en: 'The Studio', ar: 'الاستوديو' } },
      { file: 'd4', path: '/hub/lanterne/', label: { fr: 'La Librairie Lanterne', en: 'The Lantern Bookshop', ar: 'المكتبة' } },
    ],
    phones: [
      { file: 'm1', label: { fr: 'Accueil', en: 'Home', ar: 'الرئيسية' } },
      { file: 'm2', label: { fr: 'Le Studio', en: 'The Studio', ar: 'الاستوديو' } },
    ],
    pageCount: null,
    langs: 'FR · EN · AR',
    // the home's night (Arcanum, assets/themes.css) and the Studio's cream day (hub/style.css)
    palette: [
      { hex: '#0A1420', role: 'ground' },
      { hex: '#EAF1F8', role: 'ink' },
      { hex: '#E6B450', role: 'accent' },
      { hex: '#34D0E8', role: 'highlight' },
      { hex: '#F3ECE1', role: 'surface' },
      { hex: '#A34135', role: 'cta' },
    ],
    type: ['Cinzel', 'Geist', 'IBM Plex Sans Arabic'],
    context: {
      fr: "Notre propre site, celui que vous lisez : le studio y présente ses prix et ses travaux, et y tient ses leçons gratuites.",
      en: "Our own site, the one you are reading: the studio shows its prices and its work there, and keeps its free lessons.",
      ar: "موقعنا الخاص، الذي تقرؤه الآن: فيه يعرض الاستوديو أسعاره وأعماله، وفيه دروسه المجانية.",
    },
    gains: [
      { at: "/",
        fr: "Un visiteur lit le site en français, en anglais ou en arabe, et demande un Aperçu gratuit de sa page d’accueil avant de payer.",
        en: "A visitor reads the site in French, English or Arabic, and asks for a free Preview of their home page before paying.",
        ar: "يقرأ الزائر الموقع بالفرنسية أو الإنجليزية أو العربية، ويطلب معاينة مجانية لصفحته الرئيسية قبل أن يدفع." },
      { at: "/tarifs/",
        fr: "Il lit les prix publiés, en dinars, et ce que chaque formule comprend, avant d’écrire.",
        en: "They read the published prices, in dinars, and what each package includes, before writing.",
        ar: "يقرأ الأسعار المنشورة بالدينار، وما تشمله كل باقة، قبل أن يراسل." },
      { at: "/hub/",
        fr: "Au Studio, il ouvre le dossier de chaque client livré, pièce par pièce, et estime son propre projet.",
        en: "In the Studio, they open each delivered client’s case file piece by piece, and estimate their own project.",
        ar: "وفي الاستوديو، يفتح ملف كل عميل سُلِّم عمله، قطعة بقطعة، ويقدّر كلفة مشروعه." },
      { at: "/hub/lanterne/",
        fr: "À la Librairie Lanterne, il suit des leçons gratuites, chacune un atlas qu’on joue quartier par quartier.",
        en: "In the Lantern Bookshop, they take free lessons, each an atlas played district by district.",
        ar: "وفي المكتبة، يتابع دروساً مجانية، كلّ منها أطلس يُلعب حيّاً بحيّ." },
      { at: "/hub/lanterne/enquetes.html",
        fr: "Aux enquêtes de nuit, il lit une affirmation en vogue et pointe la preuve sur un écran factice, gratuitement, dans son navigateur.",
        en: "In the night cases, they read a fashionable claim and point at the proof on a mock screen, free, in their browser.",
        ar: "وفي تحقيقات الليل، يقرأ ادّعاءً رائجاً ويشير إلى الدليل على شاشة وهمية، مجاناً، في متصفّحه." },
    ],
    t: {
      fr: {
        sector: 'Studio web · Bordj Bou Arréridj',
        scope: 'Notre propre site, en trois langues',
        summary: "Notre propre site, celui que vous lisez : en français, en anglais et en arabe, avec un guide des prix publiés, le Studio et les dossiers des clients, la Librairie Lanterne et ses leçons gratuites, et les enquêtes de nuit, un jeu.",
        deliverables: ['Site trilingue FR · EN · AR, arabe en RTL', 'Guide des prix', 'Le Studio et les dossiers clients', 'La Librairie Lanterne', 'Les enquêtes de nuit, un jeu', 'Deux thèmes, nuit et jour'],
      },
      en: {
        sector: 'Web studio · Bordj Bou Arréridj',
        scope: 'Our own site, in three languages',
        summary: 'Our own site, the one you are reading: in French, English and Arabic, with a guide to its published prices, the Studio and the clients’ case files, the Lantern Bookshop and its free lessons, and the night cases, a game.',
        deliverables: ['Trilingual site FR · EN · AR, with right-to-left Arabic', 'Price guide', 'The Studio and the client case files', 'The Lantern Bookshop', 'The night cases, a game', 'Two themes, night and day'],
      },
      ar: {
        sector: 'استوديو ويب · برج بوعريريج',
        scope: 'موقعنا الخاص، بثلاث لغات',
        summary: 'موقعنا الخاص، الذي تقرؤه الآن: بالفرنسية والإنجليزية والعربية، مع دليل لأسعارنا المنشورة، والاستوديو وملفات العملاء، والمكتبة ودروسها المجانية، وتحقيقات الليل، وهي لعبة.',
        deliverables: ['موقع ثلاثي اللغة (الفرنسية والإنجليزية والعربية)، والعربية من اليمين إلى اليسار', 'دليل الأسعار', 'الاستوديو وملفات العملاء', 'المكتبة', 'تحقيقات الليل، لعبة', 'مظهران، ليلي ونهاري'],
      },
    },
  },
];

/* Interface copy, per language. A buyer reads "projet", never "planche":
   the design term stays in the kicker only. `group` heads the sheets that
   are not client work; `act` is the offer's call to action under each live
   sheet (its conditions come from the home dictionaries, prev.terms); `by`
   introduces a sheet's `identity` link. `altDesk` and `altPhone` are each
   capture's alt, filled in by build-scene.mjs: the project's name, the
   page's label and, on a desk capture, its address. An arrow at either end
   of a label (`act`, `contactCta`, `back`, `identity`) is cut off by
   build-scene.mjs and drawn instead. */
export const UI = {
  fr: {
    dir: 'ltr', studio: 'Dossier au Studio →', book: 'Livre de marque →',
    title: 'Nos réalisations web, projet par projet — Numidea Labs',
    desc: "Sites livrés en Algérie et en France, captures à l'appui\u202f: pages, version mobile, système visuel et lien vers le site en ligne.",
    crumb: 'Réalisations', crumbNav: "Fil d’Ariane", langs: 'Langue', kicker: 'En détail',
    h1: 'Nos réalisations, <em>livrable par livrable.</em>',
    lead: "Les quatre premières planches sont des sites livrés à des clients, tels qu’ils sont en\u00a0ligne\u202f; puis nos autres projets terminés\u202f: un annuaire industriel, une démo de portfolio, notre propre outil, notre boutique et ce site.",
    group: 'Autres projets terminés\u202f: un annuaire, une démo, notre outil et ce site',
    act: 'Demander mon Aperçu gratuit →', by: 'Par le fondateur', full: 'Voir la planche complète',
    index: 'Sommaire des réalisations', sheet: 'Planche', visit: 'Voir le site', open: 'Ouvrir',
    sector: 'Secteur', scope: 'Périmètre', pagesL: 'Pages', langsL: 'Langues', statusL: 'Statut',
    deliverables: 'Livrables', pages: 'Pages livrées', mobile: 'Sur mobile', system: 'Système visuel',
    palette: 'Couleurs', type: 'Typographie', before: 'Avant / après', beforeL: 'Avant', afterL: 'Après', brand: 'Éléments de marque livrés', voice: 'Le client en parle', skip: 'Aller aux réalisations',
    status: { live: 'En\u00a0ligne', concept: 'Démo de portfolio', product: 'Produit maison', finished: 'Projet terminé', own: 'Notre propre site' },
    gain: { live: 'Ce que le site apporte au client', concept: 'Ce que la démo montre', product: "Ce que l’outil apporte à ses utilisateurs", finished: 'Ce que le site apporte à ses visiteurs', own: 'Ce que le site apporte à ses visiteurs' },
    ctxL: { live: 'Le client', concept: 'Le cadre', product: 'Pour qui', finished: 'Le projet', own: 'Le cadre' },
    role: { accent: 'Accent', ink: 'Texte', muted: 'Secondaire', surface: 'Surface', ground: 'Fond', highlight: 'Relief', night: 'Mode sombre', cta: 'Action' },
    viewer: 'Capture agrandie', close: 'Fermer', zoomIn: 'Toucher pour agrandir', zoomOut: 'Toucher pour ajuster à l’écran', tech: 'Fiche technique',
    altDesk: '{name}, page {label} ({path})\u202f: capture du site en\u00a0ligne sur un écran de 1440\u00a0px', altPhone: '{name}, page {label}\u202f: capture du site en\u00a0ligne sur un téléphone',
    captured: 'Captures du site en\u00a0ligne', back: '← Retour à Numidea Labs', contact: 'Un projet à poser sur la table\u202f?', contactCta: 'Demander mon Aperçu gratuit →',
  },
  en: {
    dir: 'ltr', studio: 'The Studio’s case file →', book: 'Brand book →',
    title: 'Our web projects, one by one — Numidea Labs',
    desc: 'Sites delivered in Algeria and France, screenshots included: pages, mobile version, visual system and a link to the live site.',
    crumb: 'Work', crumbNav: 'Breadcrumb', langs: 'Language', kicker: 'In detail',
    h1: 'Our work, <em>piece by piece.</em>',
    lead: 'The first four sheets are sites delivered to clients, as they are live today; then our other finished projects: an industrial directory, a portfolio demo, our own tool, our store and this site.',
    group: 'Other finished projects: a directory, a demo, our tool and this site',
    act: 'Request my free Preview →', by: 'By the founder', full: 'See the full sheet',
    index: 'Work index', sheet: 'Sheet', visit: 'Visit the site', open: 'Open',
    sector: 'Sector', scope: 'Scope', pagesL: 'Pages', langsL: 'Languages', statusL: 'Status',
    deliverables: 'Deliverables', pages: 'Pages delivered', mobile: 'On mobile', system: 'Visual system',
    palette: 'Colour', type: 'Type', before: 'Before / after', beforeL: 'Before', afterL: 'After', brand: 'Brand assets delivered', voice: 'In the client’s words', skip: 'Skip to the work',
    status: { live: 'Live', concept: 'Portfolio demo', product: 'Our product', finished: 'Finished project', own: 'Our own site' },
    gain: { live: 'What the site gives the client', concept: 'What the demo shows', product: 'What the tool gives its users', finished: 'What the site gives its visitors', own: 'What the site gives its visitors' },
    ctxL: { live: 'The client', concept: 'The brief', product: 'Who it is for', finished: 'The project', own: 'The brief' },
    role: { accent: 'Accent', ink: 'Text', muted: 'Secondary', surface: 'Surface', ground: 'Ground', highlight: 'Highlight', night: 'Dark mode', cta: 'Action' },
    viewer: 'Enlarged screenshot', close: 'Close', zoomIn: 'Tap to zoom', zoomOut: 'Tap to fit the screen', tech: 'Technical sheet',
    altDesk: '{name}, {label} page ({path}): screenshot of the live site on a 1440\u00a0px screen', altPhone: '{name}, {label} page: screenshot of the live site on a phone',
    captured: 'Captured from the live site', back: '← Back to Numidea Labs', contact: 'Have a project in mind?', contactCta: 'Request my free Preview →',
  },
  ar: {
    dir: 'rtl', studio: 'الملف في الاستوديو ←', book: 'دليل الهوية ←', // AR review: ui.studio, ui.book (2026-11-23)
    title: 'أعمالنا على الويب، مشروعاً بمشروع — Numidea Labs',
    desc: 'مواقع سُلِّمت في الجزائر وفرنسا، مع لقطات شاشة: الصفحات، ونسخة الهاتف، والنظام البصري، ورابط الموقع على الإنترنت.',
    crumb: 'الأعمال', crumbNav: 'مسار التنقّل', langs: 'اللغة', kicker: 'بالتفصيل',
    h1: 'الأعمال، <em>بنداً ببند.</em>',
    lead: 'اللوحات الأربع الأولى مواقع سُلِّمت لعملاء، كما هي على\u00a0الإنترنت اليوم؛ ثم مشاريعنا المنجزة الأخرى: دليل صناعي، وعرض تجريبي ضمن الأعمال، وأداتنا الخاصة، ومتجرنا، وهذا الموقع.', // AR review: ui.lead (2026-11-24, wave 3)
    group: 'مشاريع منجزة أخرى: دليل، وعرض تجريبي، وأداتنا، وهذا الموقع', // AR review: ui.group (2026-11-24, wave 3)
    act: 'اطلب معاينتك المجانية ←', by: 'من عمل المؤسّس', full: 'عرض اللوحة كاملة', // AR review: ui.full
    index: 'فهرس الأعمال', sheet: 'لوحة', visit: 'زيارة الموقع', open: 'فتح',
    sector: 'القطاع', scope: 'النطاق', pagesL: 'الصفحات', langsL: 'اللغات', statusL: 'الحالة',
    deliverables: 'المُخرَجات', pages: 'الصفحات المسلّمة', mobile: 'على الهاتف', system: 'النظام البصري',
    palette: 'الألوان', type: 'الخطوط', before: 'قبل / بعد', beforeL: 'قبل', afterL: 'بعد', brand: 'عناصر الهوية المسلّمة', voice: 'بكلمات العميل', skip: 'انتقل إلى الأعمال',
    status: { live: 'على\u00a0الإنترنت', concept: 'عرض تجريبي', product: 'منتجنا', finished: 'مشروع منجز', own: 'موقعنا الخاص' }, // AR review: ui.status.finished, ui.status.own (wave 3)
    gain: { live: 'ما يقدّمه الموقع للعميل', concept: 'ما يبيّنه العرض التجريبي', product: 'ما تقدّمه الأداة لمستخدميها', finished: 'ما يقدّمه الموقع لزوّاره', own: 'ما يقدّمه الموقع لزوّاره' }, // AR review: ui.gain.finished, ui.gain.own (wave 3)
    ctxL: { live: 'العميل', concept: 'الإطار', product: 'لمن', finished: 'المشروع', own: 'الإطار' }, // AR review: ui.ctxL.finished (wave 3)
    role: { accent: 'لون مميّز', ink: 'النص', muted: 'ثانوي', surface: 'سطح', ground: 'خلفية', highlight: 'إبراز', night: 'الوضع الداكن', cta: 'إجراء' },
    viewer: 'لقطة مكبّرة', close: 'إغلاق', zoomIn: 'المس للتكبير', zoomOut: 'المس للملاءمة مع الشاشة', tech: 'البطاقة التقنية', // AR review: ui.zoomIn, ui.zoomOut, ui.tech
    altDesk: '{name}، صفحة {label} ({path}): لقطة من الموقع على\u00a0الإنترنت على شاشة بعرض 1440\u00a0بكسل', altPhone: '{name}، صفحة {label}: لقطة من الموقع على\u00a0الإنترنت على هاتف',
    captured: 'لقطات من الموقع على\u00a0الإنترنت', back: '→ العودة إلى Numidea Labs', contact: 'مشروع تريد وضعه على الطاولة؟', contactCta: 'اطلب معاينتك المجانية ←',
  },
};
