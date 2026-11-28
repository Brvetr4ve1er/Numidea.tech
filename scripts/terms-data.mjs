/**
 * Le comptoir's terms of sale and refund policy (comptoir/conditions/): the owner's facts (payments, 2026-11-27).
 *
 * Same rule as scripts/legal-data.mjs: every `null` is a fact only the owner can give, and it BLOCKS publication.
 * `node scripts/build-terms.mjs` lists what is missing and writes nothing; once every field here AND every field of
 * legal-data.mjs (the seller's identity, which this page repeats) is filled, it writes comptoir/conditions/index.html
 * and links it from the counter, next to the pay buttons.
 *
 * Free text takes one value per language, { fr, en, ar }; each language left null is a gap of its own.
 * Preview with the gaps marked: node scripts/build-terms.mjs --preview (writes terms-preview/, git-ignored).
 *
 * The words are a draft, not legal advice: `reviewed` stays null until the owner (ideally with a lawyer) has read
 * them against Loi 18-05 (e-commerce, Algeria) and, for buyers in the EU paying in euros, the EU consumer rules.
 */
export const TERMS = {
  // how fast the studio confirms an order after the payment arrives, e.g. { fr: '24 heures ouvrées', en: '24 working hours', ar: '24 ساعة عمل' }
  confirm: { fr: null, en: null, ar: null },
  // a cancellation before any work started, e.g. { fr: 'remboursée en totalité', en: 'refunded in full', ar: 'يُستردّ كاملًا' }
  cancelBeforeStart: { fr: null, en: null, ar: null },
  // the deposit once work has started, e.g. { fr: 'reste acquis au studio', en: 'is kept by the studio', ar: 'يبقى من حق الاستوديو' }
  depositAfterStart: { fr: null, en: null, ar: null },
  callNotice: null,      // hours of notice to move a call free of charge, e.g. 24
  refundDays: null,      // days within which a refund is sent, by the route it was paid, e.g. 14
  // the sticker sheets (the only physical product): where they ship, the cost, the delay
  shipping: { fr: null, en: null, ar: null },
  portfolio: null,       // true: the studio may show finished work in its portfolio unless the client asks otherwise; false: never without written consent
  // the court for disputes, e.g. { fr: 'les tribunaux de Sétif', en: 'the courts of Sétif', ar: 'محاكم سطيف' }
  court: { fr: null, en: null, ar: null },
  lastUpdated: null,     // 'YYYY-MM-DD' of the last review
  reviewed: null,        // true once the owner has read (and ideally had checked) this text; it does not publish before
};

export const TERMS_TRANSLATED = ['confirm', 'cancelBeforeStart', 'depositAfterStart', 'shipping', 'court'];

export function termsMissing(data = TERMS, langs = ['fr', 'en', 'ar']) {
  const out = [];
  for (const [k, v] of Object.entries(data)) {
    if (TERMS_TRANSLATED.includes(k)) {
      for (const l of langs) if (!v || typeof v[l] !== 'string' || !v[l].trim()) out.push(`${k}.${l}`);
    } else if (v === null) out.push(k);
  }
  if (data.reviewed === false) out.push('reviewed');
  return out;
}
