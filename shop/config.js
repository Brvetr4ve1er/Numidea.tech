/* CMF Buds 2a landing page settings: shared by index.html and ar.html. Edit this file only. */
window.CMF_CONFIG = {
  store: "Numidea Shop",                 // shop name shown in header and footer
  whatsapp: "213XXXXXXXXX",         // WhatsApp Business number, international format, digits only (213 + 9 digits, no leading 0)
  price: 6500,                      // DZD
  compareAt: null,                  // e.g. 8500 shows a strike-through. Only if you really sold at that price recently.
  genuine: null,                    // true = show "original" claims · false = hide them · null = show with an À CONFIRMER tag
  warrantyDays: null,               // e.g. 30 → "Garantie 30 jours" chip. null hides it.
  inspection: true,                 // true if buyers may open the parcel before paying
  deliveryEta: { fr: "24 à 72 h selon la wilaya", ar: "من 24 إلى 72 ساعة حسب الولاية" },
  returns: { fr: "Si le produit présente un défaut à la réception, contacte-nous sur WhatsApp sous 48 h : échange contre un produit neuf.", ar: "إذا كان المنتج فيه عيب كي تستلمو، راسلنا في واتساب في 48 ساعة: نبدلوهولك بواحد جديد." },
  returnsConfirmed: false,          // set true once the returns text above matches your real policy
  stock: { orange: true, lightgrey: true, darkgrey: true },
  maxQty: 3,
  sheetEndpoint: "",                // optional Google Apps Script web-app URL: every order is logged before WhatsApp opens
  pixelId: "",                      // optional Meta Pixel ID: fires PageView, ViewContent, InitiateCheckout, Lead
  autoOpenWhatsApp: true            // after submit, jump straight to WhatsApp when the page is not embedded
};
