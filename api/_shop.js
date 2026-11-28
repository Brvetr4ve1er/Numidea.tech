/**
 * The counter's price list (« Le comptoir », /comptoir/): one source for the page (GET /api/pay) and for the
 * charge (POST /api/pay, op "create", mode "cart"). A leading underscore keeps Vercel from serving it as a route.
 *
 * Every figure is a fixed price the owner already approved and the site already publishes, in dinars:
 * the Studio's « La carte » (assets/app.js ESTIMATE DESIGN, 2026-11-21) and the money services
 * « L'argent, sans jargon » (PRICE_MODEL.argent / PRICE_OPTS setup, pack, guides, 2026-11-16).
 * scripts/pay-test.mjs re-reads app.js and fails if a figure here drifts from it. Ranges (« 12 000 – 25 000 »)
 * are never sold here: they need a quote, and a quote is paid through a signed link (api/pay.js, mode "quote").
 *
 * PayPal cannot charge dinars, so the euro and dollar figures are the dinar price at the site's own rate
 * (assets/app.js FX: 1 € = 152 DA, 1 $ = 136 DA), rounded to the whole unit. A buyer paying in dinars
 * (CCP, BaridiMob) orders on WhatsApp with the same receipt.
 */

export const FX = { EUR: 152, USD: 136 };
export const CATS = ['services', 'cours', 'produits'];

/* id: stable (it is in every order's custom_id). n: names {fr,en,ar} (the carte's own words, hub/i18n.*.js).
   da: price in dinars. max: most a buyer may put in the bag. src: where the figure lives in app.js, for the test. */
export const ITEMS = [
  // Services: the Studio's carte, single-figure lines only
  { id: 'logo-ess', cat: 'services', da: 45000, max: 1, src: 'DESIGN.logo.essentiel', n: { fr: 'Logo · Essentiel, 2 pistes', en: 'Logo · Essential, 2 directions', ar: 'الشعار · أساسي، مقترحان' } },
  { id: 'logo-sig', cat: 'services', da: 70000, max: 1, src: 'DESIGN.logo.signature', n: { fr: 'Logo · Signature, bilingue', en: 'Logo · Signature, bilingual', ar: 'الشعار · توقيع، ثنائي اللغة' } },
  { id: 'illu', cat: 'services', da: 12000, max: 5, src: 'DESIGN.illu.spot', n: { fr: 'Illustration ponctuelle', en: 'One-off illustration', ar: 'رسم منفرد' } },
  { id: 'mascotte', cat: 'services', da: 55000, max: 1, src: 'DESIGN.illu.mascotte', n: { fr: 'Mascotte', en: 'Mascot', ar: 'شخصية مميزة' } },
  { id: 'audit-x', cat: 'services', da: 25000, max: 1, src: 'DESIGN.audit.express', n: { fr: 'Audit express · 10 écrans', en: 'Express audit · 10 screens', ar: 'تدقيق سريع · 10 شاشات' } },
  { id: 'audit-p', cat: 'services', da: 60000, max: 1, src: 'DESIGN.audit.parcours', n: { fr: 'Audit parcours', en: 'Journey audit', ar: 'تدقيق المسار' } },
  { id: 'landing', cat: 'services', da: 35000, max: 1, src: 'DESIGN.ui.landing', n: { fr: 'Maquette · landing', en: 'Mock-up · landing', ar: 'نموذج تصميم · صفحة هبوط' } },
  { id: 'site5', cat: 'services', da: 67000, max: 1, src: 'DESIGN.ui.site5', n: { fr: 'Maquette · site 5 écrans', en: 'Mock-up · 5-screen site', ar: 'نموذج تصميم · موقع 5 شاشات' } },
  { id: 'social', cat: 'services', da: 40000, max: 1, src: 'DESIGN.social.kit', n: { fr: 'Kit réseaux · 9 modèles', en: 'Social kit · 9 templates', ar: 'عُدّة التواصل · 9 قوالب' } },
  { id: 'social-a', cat: 'services', da: 65000, max: 1, src: 'DESIGN.social.anime', n: { fr: 'Kit réseaux animé · + 3 animés', en: 'Animated social kit · + 3', ar: 'عُدّة متحركة · + 3' } },
  { id: 'deck', cat: 'services', da: 48000, max: 1, src: 'DESIGN.deck.deck12', n: { fr: 'Pitch deck · 12 slides', en: 'Pitch deck · 12 slides', ar: 'عرض المستثمرين · 12 شريحة' } },
  { id: 'carte', cat: 'services', da: 8000, max: 3, src: 'DESIGN.print.carte', n: { fr: 'Carte de visite', en: 'Business card', ar: 'بطاقة زيارة' } },
  { id: 'flyer', cat: 'services', da: 12000, max: 3, src: 'DESIGN.print.flyer', n: { fr: 'Flyer ou affiche', en: 'Flyer or poster', ar: 'منشور أو ملصق' } },
  // 2026-11-27: the carte's other single-figure headline tiers, so their cards can link too (Papeterie's tag showed this pack)
  { id: 'papeterie', cat: 'services', da: 30000, max: 1, src: 'DESIGN.print.papeterie', n: { fr: 'Pack papeterie', en: 'Stationery pack', ar: 'حزمة القرطاسية' } },
  { id: 'app10', cat: 'services', da: 120000, max: 1, src: 'DESIGN.ui.app10', n: { fr: 'Maquette · app 10 écrans', en: 'Mock-up · 10-screen app', ar: 'نموذج تصميم · تطبيق 10 شاشات' } },
  { id: 'pack1', cat: 'services', da: 45000, max: 1, src: 'DESIGN.pack.ref1', n: { fr: 'Packaging · 1 référence', en: 'Packaging · 1 product', ar: 'تغليف · مرجع واحد' } },
  // Courses: « L'argent, sans jargon », one-to-one
  { id: 'appel', cat: 'cours', da: 3000, max: 6, src: 'PRICE_MODEL.argent.base.0', n: { fr: 'Appel 60 min · L’argent, sans jargon', en: '60-min call · Money, minus the jargon', ar: 'مكالمة 60 دقيقة · المال بلا تعقيد' } },
  { id: 'setup', cat: 'cours', da: 6000, max: 1, src: 'PRICE_OPTS.setup.add.0', n: { fr: 'Mise en place accompagnée', en: 'Guided setup', ar: 'إعداد مرافَق' } },
  { id: 'pack', cat: 'cours', da: 15000, max: 1, src: 'PRICE_OPTS.pack.add.0', n: { fr: 'Pack de départ freelance', en: 'Freelance starter pack', ar: 'حزمة انطلاق المستقل' } },
  // Products
  { id: 'guides', cat: 'produits', da: 4000, max: 1, src: 'PRICE_OPTS.guides.add.0', n: { fr: 'Guides et modèles · la collection', en: 'Guides and templates · the set', ar: 'الأدلة والنماذج · المجموعة' } },
  { id: 'stickers', cat: 'produits', da: 25000, max: 1, src: 'DESIGN.stick.planche6', n: { fr: 'Planche de 6 stickers Kūro', en: 'Sheet of 6 Kūro stickers', ar: 'لوحة من 6 ملصقات كورو' } },
];

/* The combo is the site's own bundle rule (PRICE_MODEL.argent.kit): the setup and the pack with at least one
   call make the order cheaper by 5 000 DA. src lets the test re-read it. */
export const COMBOS = [
  { id: 'kit-argent', needs: ['setup', 'pack', 'appel'], off: 5000, src: 'PRICE_MODEL.argent.kit.off',
    n: { fr: 'Combo départ : appel + mise en place + pack', en: 'Starter combo: call + setup + pack', ar: 'كومبو الانطلاق: مكالمة + إعداد + حزمة' } },
];

const BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i]));
export const DEPOSIT = 0.4;              // the studio's terms: 40 % at order
export const DEPOSIT_FROM = 40000;       // under this, a bag is paid in full (a deposit on 8 000 DA is noise)

/* the bag as sent, checked and priced; null when anything is off */
export function price(bag, cur = 'EUR', part = 'full') {
  if (!Array.isArray(bag) || !bag.length || bag.length > ITEMS.length) return null;
  if (!FX[cur] || !['full', 'deposit'].includes(part)) return null;
  const seen = new Set(), lines = [];
  for (const row of bag) {
    const it = row && BY_ID[row.id], qty = row && row.qty;
    if (!it || seen.has(it.id) || !Number.isInteger(qty) || qty < 1 || qty > it.max) return null;
    seen.add(it.id);
    lines.push({ id: it.id, qty, da: it.da * qty });
  }
  const combos = COMBOS.filter((c) => c.needs.every((id) => seen.has(id))).map((c) => ({ id: c.id, da: -c.off }));
  const totalDA = lines.reduce((s, l) => s + l.da, 0) + combos.reduce((s, c) => s + c.da, 0);
  if (part === 'deposit' && totalDA < DEPOSIT_FROM) return null;
  const dueDA = part === 'deposit' ? Math.round(totalDA * DEPOSIT) : totalDA;
  const amount = Math.max(1, Math.round(dueDA / FX[cur])).toFixed(2);
  return { lines, combos, totalDA, dueDA, part, cur, amount };
}

/* what the page needs to draw the counter (no secret in it) */
export const publicCatalog = () => ({ fx: FX, cats: CATS, deposit: DEPOSIT, depositFrom: DEPOSIT_FROM,
  items: ITEMS.map(({ id, cat, da, max, n }) => ({ id, cat, da, max, n })),
  combos: COMBOS.map(({ id, needs, off, n }) => ({ id, needs, off, n })) });
