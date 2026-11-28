/* Tr4velerz Studio (tr4velerz.studio, the shop/ folder, Vercel project numidea-shop): the catalogue.
 *
 * This file is the only place to edit sections and products. `node scripts/build-shop.mjs` writes every
 * store page (FR at the root, /en/, /ar/), shop/assets/catalog.js and shop/sitemap.xml from it.
 *
 * Owner decisions (survey 2026-11-28): a store hub at /, five sections, games and apps "Bientôt" with a
 * WhatsApp waitlist, Numidea's game UI with the store's own orange, physical goods sell here (Numidea only
 * teases them). The catalogue gets filled once the shop is built: add products below.
 *
 * A product:
 *   id       unique, lowercase, used in the bag and in ?add=<id>
 *   section  one of the SECTIONS ids
 *   name     { fr, en, ar }
 *   note     { fr, en, ar }  one short line under the name (optional)
 *   price    in DA, a whole number; null = "price coming", the card shows no add button
 *   options  optional { label: {fr,en,ar}, values: [{ id, fr, en, ar }] }  (sizes, colours)
 *   img      path under shop/ (optional; without one the card draws Kūro)
 *   page     path of its own product page (optional)
 *   max      most per order (default 5)
 *   ready    false = shown on the shelf as a teaser, not sold yet
 */

export const WHATSAPP_FALLBACK = '213672412578'; // the live number comes from shop/config.js (CMF_CONFIG.whatsapp)

export const SECTIONS = [
  {
    id: 'vetements', n: '01', city: { fr: 'Oran', en: 'Oran', ar: 'وهران' }, kuro: 'smug', kind: 'physical',
    name: { fr: 'Le Vestiaire', en: 'The Wardrobe', ar: 'الخزانة' },
    sub: { fr: 'Vêtements, merch et stickers', en: 'Clothing, merch and stickers', ar: 'ملابس وسلع وملصقات' },
    say: {
      fr: 'Ici, on habille les voyageurs. Les premières pièces arrivent : passe me voir souvent.',
      en: 'This is where travellers get dressed. The first pieces are on their way, so check back often.',
      ar: 'هنا نُلبس المسافرين. القطع الأولى في الطريق، عُد لزيارتي كثيرًا.',
    },
  },
  {
    id: 'bibliotheque', n: '02', city: { fr: 'Constantine', en: 'Constantine', ar: 'قسنطينة' }, kuro: 'loaf', kind: 'physical',
    name: { fr: 'La Bibliothèque', en: 'The Library', ar: 'المكتبة' },
    sub: { fr: 'Mangas et livres', en: 'Manga and books', ar: 'مانغا وكتب' },
    say: {
      fr: 'Les histoires de Yasser et Kūro, sur papier. Je garde la pile au chaud en attendant.',
      en: 'Yasser and Kūro’s stories, on paper. I’m keeping the pile warm until then.',
      ar: 'قصص ياسر وكورو على الورق. أحرس الكومة دافئة حتى ذلك الحين.',
    },
  },
  {
    id: 'jeux', n: '03', city: { fr: 'Tamanrasset', en: 'Tamanrasset', ar: 'تمنراست' }, kuro: 'peek', kind: 'digital',
    name: { fr: 'L’Arcade', en: 'The Arcade', ar: 'الأركيد' },
    sub: { fr: 'Nos jeux', en: 'Our games', ar: 'ألعابنا' },
    say: {
      fr: 'Le premier jeu se prépare dans l’atelier. Inscris-toi et je te préviens dès qu’il sort.',
      en: 'The first game is being made in the workshop. Sign up and I’ll tell you the day it’s out.',
      ar: 'اللعبة الأولى قيد الإعداد في الورشة. سجّل وسأخبرك يوم صدورها.',
    },
  },
  {
    id: 'apps', n: '04', city: { fr: 'Ghardaïa', en: 'Ghardaïa', ar: 'غرداية' }, kuro: 'mug', kind: 'digital',
    name: { fr: 'La Logithèque', en: 'The App Shelf', ar: 'رفّ التطبيقات' },
    sub: { fr: 'Nos applications', en: 'Our apps', ar: 'تطبيقاتنا' },
    say: {
      fr: 'Des outils faits par le studio, pour ton téléphone et ton ordinateur. Bientôt sur cette étagère.',
      en: 'Tools made by the studio, for your phone and your computer. On this shelf soon.',
      ar: 'أدوات من صنع الاستوديو لهاتفك وحاسوبك. قريبًا على هذا الرف.',
    },
  },
  {
    id: 'gadgets', n: '05', city: { fr: 'Alger', en: 'Algiers', ar: 'الجزائر' }, kuro: 'shook', kind: 'physical',
    name: { fr: 'Les Gadgets', en: 'Gadgets', ar: 'الأجهزة' },
    sub: { fr: 'Tech et accessoires', en: 'Tech and accessories', ar: 'تقنية وإكسسوارات' },
    say: {
      fr: 'Des écouteurs qui coupent le bruit. Même moi, j’ai sursauté. Paiement à la livraison.',
      en: 'Earbuds that cut the noise. Even I jumped. Pay on delivery.',
      ar: 'سماعات تعزل الضجيج. حتى أنا قفزت. الدفع عند الاستلام.',
    },
  },
];

export const PRODUCTS = [
  {
    id: 'cmf-buds-2a', section: 'gadgets', ready: true, price: 6500, max: 3,
    name: { fr: 'CMF Buds 2a', en: 'CMF Buds 2a', ar: 'CMF Buds 2a' },
    note: { fr: 'Réduction de bruit active · 3 couleurs', en: 'Active noise cancelling · 3 colours', ar: 'عزل نشط للضجيج · 3 ألوان' },
    img: 'assets/three-cases.webp',
    page: { fr: 'gadgets/cmf-buds-2a/', en: 'gadgets/cmf-buds-2a/', ar: 'ar/gadgets/cmf-buds-2a/' },
    options: {
      label: { fr: 'Couleur', en: 'Colour', ar: 'اللون' },
      values: [
        { id: 'orange', fr: 'Orange', en: 'Orange', ar: 'برتقالي' },
        { id: 'lightgrey', fr: 'Gris clair', en: 'Light grey', ar: 'رمادي فاتح' },
        { id: 'darkgrey', fr: 'Gris foncé', en: 'Dark grey', ar: 'رمادي داكن' },
      ],
    },
  },
  {
    // Moved from Numidea's /comptoir/ (2026-11-28). Its price there (25 000 DA) was wrong; the owner sets the real one.
    id: 'stickers-kuro', section: 'vetements', ready: false, price: null,
    name: { fr: 'Planche de 6 stickers Kūro', en: 'Sheet of 6 Kūro stickers', ar: 'لوحة من 6 ملصقات كورو' },
    note: { fr: 'Six humeurs de Kūro', en: 'Six Kūro moods', ar: 'ست حالات لكورو' },
    kuro: 'stamp',
  },
];
