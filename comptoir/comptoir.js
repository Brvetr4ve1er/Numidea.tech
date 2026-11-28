/* /comptoir/: the counter. Draws the shop from the catalog GET /api/pay serves (api/_shop.js), keeps the bag,
   and sends it to PayPal through POST /api/pay. The server prices the bag again from its own list; the figures
   here are for display only. A signed quote link (?ref=Q-…&sig=…) turns the page into that contract.
   Language: ?lang=en|ar (French by default). */
(() => {
  const T = {
    fr: {
      title: 'Le comptoir · Numidea Labs', skip: 'Aller aux articles', home: '← Numidea Labs', kicker: 'Boutique · prix fixes', h: 'Le comptoir',
      say0: 'Choisis ton butin. Kūro tient la caisse.', sayAdd: 'Bon choix. Dans le sac.', sayCombo: 'COMBO ! −5 000 DA, Kūro offre la remise.',
      sayLvl: 'Niveau atteint : l’acompte 40\u00a0% est débloqué.', sayEmpty: 'Sac vidé. On recommence ?', sayPaid: 'Le sceau est posé. Merci !',
      pick: 'Rayons', all: 'Tout', cats: { services: 'Services', cours: 'Cours', produits: 'Produits' },
      rar: { common: 'Commun', rare: 'Rare', epic: 'Épique' },
      add: 'Ajouter', remove: 'Retirer', inBag: 'Dans le sac', less: 'Un de moins', more: 'Un de plus',
      live: (n, tot) => (n ? `Sac : ${n} article${n > 1 ? 's' : ''}, total ${tot}` : 'Ton sac est vide'), bag: 'Ton sac', empty: 'Ton sac est vide. Ajoute une carte pour commencer.', total: 'Total',
      lvl: (n) => `Encore ${n} pour débloquer l’acompte 40\u00a0%`, lvlMax: 'Acompte 40\u00a0% débloqué',
      combo: 'Combo départ', hint: (x, off) => `Ajoute « ${x} » : combo débloqué, −${off}.`,
      route: 'Comment régler', routes: { paypal: 'PayPal · carte', ccp: 'CCP · BaridiMob', wire: 'Virement € / $' },
      order: 'Bon de commande', waGo: 'Envoyer le bon sur WhatsApp', copy: 'Copier le bon', terms: 'Conditions de vente et remboursements', copied: 'Bon copié ✓',
      ppGo: (a) => `Payer ${a} sur PayPal`,
      steps: {
        ccp: (a) => ['Envoie le bon sur WhatsApp.', 'Kūro répond avec le RIP CCP et le numéro BaridiMob.', `Paie ${a} et renvoie la photo du reçu : le travail démarre.`],
        wire: (a) => ['Envoie le bon sur WhatsApp.', 'Kūro répond avec les coordonnées bancaires (IBAN, SWIFT) et la facture.', `Vire ${a} : le travail démarre à réception.`],
        link: (a) => [`Paie ${a} sur PayPal : le montant est déjà rempli.`, 'Envoie le bon sur WhatsApp pour relier le paiement à ta commande.'],
      },
      fineR: {
        ccp: 'En dinars, sans conversion : le prix de la carte, tel quel.',
        wire: 'Depuis l’étranger. Montant converti au taux du site : 1 € = 152 DA, 1 $ = 136 DA.',
        link: 'Carte bancaire ou compte PayPal. Tu paies chez PayPal ; nous ne voyons jamais tes données de carte.',
      },
      edu: 'De l’éducation : ni conseil financier ni conseil en placement.', okStart: 'Je demande que le travail commence dès la confirmation, et je reconnais perdre mon droit de rétractation dès qu’il a commencé.', okNeed: 'Coche la case au-dessus des boutons pour continuer.', okLine: 'Démarrage dès confirmation demandé ; renonciation à la rétractation une fois le travail commencé : acceptée.',
      waOrder: (ref, lines, tot, due, route) => `Salam ! Commande ${ref} au comptoir :\n${lines}\nTotal : ${tot}\n${due}\nRèglement : ${route}`,
      cur: 'Devise', part: 'Régler', full: 'Tout régler', deposit: 'Acompte 40\u00a0%',
      due: (a, p) => (p === 'deposit' ? `Acompte aujourd’hui : ${a}` : `À régler : ${a}`),
      pay: 'Payer avec PayPal', payX: (a) => `Payer ${a} avec PayPal`, busy: 'Ouverture de PayPal…',
      waDA: 'Payer en dinars · WhatsApp', see: 'Voir le sac',
      waMsg: (lines, tot) => `Salam ! Je voudrais commander au comptoir :\n${lines}\nTotal : ${tot}\nPaiement en dinars (CCP ou BaridiMob).`,
      fine: 'Carte bancaire ou compte PayPal. Vous validez chez PayPal ; nous ne voyons jamais vos données de carte. En dinars : CCP ou BaridiMob, le reçu part sur WhatsApp.',
      sandbox: 'Mode test (sandbox) : aucun argent réel ne circule.',
      offline: 'Le paiement en ligne n’est pas disponible pour le moment. Commandez en dinars sur WhatsApp, ou écrivez-nous.',
      down: 'Le comptoir ne répond pas pour le moment. Écrivez-nous sur WhatsApp : on prend la commande à la main.',
      cancel: 'Paiement annulé : rien n’a été débité. Ton sac t’attend.',
      wait: 'Confirmation du paiement…', fail: 'Le paiement n’a pas abouti et rien n’a été débité. Réessaie, ou écris-nous.',
      doneK: 'Butin obtenu', paid: 'Paiement reçu. Kūro a posé le sceau : on se met au travail. Un reçu PayPal arrive par e-mail, et on vous écrit sous 24 h.',
      qk: 'Contrat · paiement', ref: 'Devis', stage: 'Étape', amount: 'Montant',
      p_deposit: 'Acompte 40\u00a0%', p_balance: 'Solde 60 %', p_full: 'Paiement complet',
      ready: 'Vérifiez le devis et le montant, puis réglez en une minute.',
      expired: 'Ce lien de paiement a expiré ou a été modifié. Demandez-nous un nouveau lien sur WhatsApp.',
      da: 'DA',
    },
    en: {
      title: 'The counter · Numidea Labs', skip: 'Skip to the items', home: '← Numidea Labs', kicker: 'Shop · fixed prices', h: 'The counter',
      say0: 'Pick your loot. Kūro runs the till.', sayAdd: 'Good pick. In the bag.', sayCombo: 'COMBO! −5,000 DA, on Kūro.',
      sayLvl: 'Level up: the 40% deposit is unlocked.', sayEmpty: 'Bag emptied. Again?', sayPaid: 'Seal stamped. Thank you!',
      pick: 'Aisles', all: 'All', cats: { services: 'Services', cours: 'Lessons', produits: 'Products' },
      rar: { common: 'Common', rare: 'Rare', epic: 'Epic' },
      add: 'Add', remove: 'Remove', inBag: 'In the bag', less: 'One fewer', more: 'One more',
      live: (n, tot) => (n ? `Bag: ${n} item${n > 1 ? 's' : ''}, total ${tot}` : 'Your bag is empty'), bag: 'Your bag', empty: 'Your bag is empty. Add a card to start.', total: 'Total',
      lvl: (n) => `${n} more to unlock the 40% deposit`, lvlMax: '40% deposit unlocked',
      combo: 'Starter combo', hint: (x, off) => `Add “${x}”: combo unlocked, −${off}.`,
      route: 'How to pay', routes: { paypal: 'PayPal · card', ccp: 'CCP · BaridiMob (DZD)', wire: 'Bank transfer € / $' },
      order: 'Order ref', waGo: 'Send the order on WhatsApp', copy: 'Copy the order', terms: 'Terms of sale and refunds', copied: 'Order copied ✓',
      ppGo: (a) => `Pay ${a} on PayPal`,
      steps: {
        ccp: (a) => ['Send the order on WhatsApp.', 'Kūro replies with the CCP account and the BaridiMob number.', `Pay ${a} and send back a photo of the receipt: work starts.`],
        wire: (a) => ['Send the order on WhatsApp.', 'Kūro replies with the bank details (IBAN, SWIFT) and the invoice.', `Transfer ${a}: work starts when it lands.`],
        link: (a) => [`Pay ${a} on PayPal: the amount is already filled in.`, 'Send the order on WhatsApp so we can match the payment to it.'],
      },
      fineR: {
        ccp: 'In dinars, no conversion: the carte price as it stands.',
        wire: 'From abroad. Converted at the site’s rate: €1 = 152 DA, $1 = 136 DA.',
        link: 'Card or PayPal account. You pay on PayPal; we never see your card details.',
      },
      edu: 'Education: not financial or investment advice.', okStart: 'I ask for the work to start as soon as the order is confirmed, and I acknowledge that I lose my right of withdrawal once it has started.', okNeed: 'Tick the box above the buttons to continue.', okLine: 'Start on confirmation requested; withdrawal waived once work has started: accepted.',
      waOrder: (ref, lines, tot, due, route) => `Hello! Order ${ref} from the counter:\n${lines}\nTotal: ${tot}\n${due}\nPaying by: ${route}`,
      cur: 'Currency', part: 'Pay', full: 'Pay in full', deposit: '40% deposit',
      due: (a, p) => (p === 'deposit' ? `Deposit today: ${a}` : `To pay: ${a}`),
      pay: 'Pay with PayPal', payX: (a) => `Pay ${a} with PayPal`, busy: 'Opening PayPal…',
      waDA: 'Pay in dinars · WhatsApp', see: 'See the bag',
      waMsg: (lines, tot) => `Hello! I'd like to order from the counter:\n${lines}\nTotal: ${tot}\nPaying in dinars (CCP or BaridiMob).`,
      fine: 'Card or PayPal account. You confirm on PayPal; we never see your card details. In dinars: CCP or BaridiMob, the receipt goes over WhatsApp.',
      sandbox: 'Test mode (sandbox): no real money moves.',
      offline: 'Online payment is not available right now. Order in dinars on WhatsApp, or write to us.',
      down: 'The counter is not answering right now. Write to us on WhatsApp and we take the order by hand.',
      cancel: 'Payment cancelled: nothing was charged. Your bag is waiting.',
      wait: 'Confirming the payment…', fail: 'The payment did not go through and nothing was charged. Try again, or write to us.',
      doneK: 'Loot secured', paid: 'Payment received. Kūro stamped the seal: work starts now. A PayPal receipt is on its way by email, and we write to you within 24 h.',
      qk: 'Contract · payment', ref: 'Quote', stage: 'Stage', amount: 'Amount',
      p_deposit: '40% deposit', p_balance: '60% balance', p_full: 'Full payment',
      ready: 'Check the quote and the amount, then pay in a minute.',
      expired: 'This payment link has expired or was changed. Ask us for a new one on WhatsApp.',
      da: 'DA',
    },
    ar: {
      title: 'الكونتوار · Numidea Labs', skip: 'انتقل إلى المنتجات', home: 'Numidea Labs →', kicker: 'متجر · أسعار ثابتة', h: 'الكونتوار',
      say0: 'اختر غنيمتك. كورو على الصندوق.', sayAdd: 'اختيار موفّق. في الحقيبة.', sayCombo: 'كومبو! ⁦−5 000 DA⁩ هدية من كورو.',
      sayLvl: 'مستوى جديد: العربون ⁦40\u00a0%⁩ متاح الآن.', sayEmpty: 'أُفرغت الحقيبة. نبدأ من جديد؟', sayPaid: 'خُتم العقد. شكرًا لك!',
      pick: 'الأقسام', all: 'الكل', cats: { services: 'خدمات', cours: 'دروس', produits: 'منتجات' },
      rar: { common: 'عادي', rare: 'نادر', epic: 'ملحمي' },
      add: 'أضف', remove: 'أزل', inBag: 'في الحقيبة', less: 'واحد أقل', more: 'واحد أكثر',
      live: (n, tot) => (n ? `الحقيبة: عدد العناصر ${n}، المجموع ${tot}` : 'حقيبتك فارغة'), bag: 'حقيبتك', empty: 'حقيبتك فارغة. أضف بطاقة للبدء.', total: 'المجموع',
      lvl: (n) => `بقي ⁦${n}⁩ لفتح العربون ⁦40\u00a0%⁩`, lvlMax: 'العربون ⁦40\u00a0%⁩ متاح',
      combo: 'كومبو الانطلاق', hint: (x, off) => `أضف «${x}»: يُفتح الكومبو، ⁦−${off}⁩.`,
      route: 'طريقة الدفع', routes: { paypal: 'PayPal · بطاقة', ccp: 'CCP · بريدي موب', wire: 'تحويل بنكي € / $' },
      order: 'رقم الطلب', waGo: 'أرسل الطلب عبر واتساب', copy: 'انسخ الطلب', terms: 'شروط البيع والاسترداد', copied: 'نُسخ الطلب ✓',
      ppGo: (a) => `ادفع \u2066${a}\u2069 على PayPal`,
      steps: {
        ccp: (a) => ['أرسل الطلب عبر واتساب.', 'يردّ كورو برقم حساب CCP ورقم بريدي موب.', `ادفع \u2066${a}\u2069 وأرسل صورة الوصل: يبدأ العمل.`],
        wire: (a) => ['أرسل الطلب عبر واتساب.', 'يردّ كورو بالبيانات البنكية (IBAN، SWIFT) والفاتورة.', `حوّل \u2066${a}\u2069: يبدأ العمل عند الاستلام.`],
        link: (a) => [`ادفع \u2066${a}\u2069 على PayPal: المبلغ مُعبّأ مسبقًا.`, 'أرسل الطلب عبر واتساب لنربط الدفع بطلبك.'],
      },
      fineR: {
        ccp: 'بالدينار، دون تحويل: سعر القائمة كما هو.',
        wire: 'من الخارج. المبلغ محوَّل بسعر الموقع: \u20661 € = 152 DA، 1 $ = 136 DA\u2069.',
        link: 'بطاقة بنكية أو حساب PayPal. تدفع لدى PayPal، ولا نرى بيانات بطاقتك أبدًا.',
      },
      edu: 'تعليم فقط: ليس استشارة مالية ولا استثمارية.', okStart: 'أطلب أن يبدأ العمل فور تأكيد الطلب، وأُقرّ بأنني أفقد حقّي في العدول بمجرد بدئه.', okNeed: 'ضع علامة في الخانة فوق الأزرار للمتابعة.', okLine: 'طُلب البدء فور التأكيد؛ التنازل عن العدول بمجرد بدء العمل: مقبول.',
      waOrder: (ref, lines, tot, due, route) => `السلام عليكم! الطلب ${ref} من الكونتوار:\n${lines}\nالمجموع: ${tot}\n${due}\nطريقة الدفع: ${route}`,
      cur: 'العملة', part: 'الدفع', full: 'الدفع الكامل', deposit: 'عربون ⁦40\u00a0%⁩',
      due: (a, p) => (p === 'deposit' ? `العربون اليوم: ⁦${a}⁩` : `المبلغ المستحق: ⁦${a}⁩`),
      pay: 'ادفع عبر PayPal', payX: (a) => `ادفع ⁦${a}⁩ عبر PayPal`, busy: 'جارٍ فتح PayPal…',
      waDA: 'ادفع بالدينار · واتساب', see: 'الحقيبة',
      waMsg: (lines, tot) => `السلام عليكم! أريد الطلب من الكونتوار:\n${lines}\nالمجموع: ${tot}\nالدفع بالدينار (CCP أو بريدي موب).`,
      fine: 'بطاقة بنكية أو حساب PayPal. تؤكّد الدفع لدى PayPal، ولا نرى بيانات بطاقتك أبدًا. بالدينار: CCP أو بريدي موب، والإيصال عبر واتساب.',
      sandbox: 'وضع تجريبي (sandbox): لا تتحرك أموال حقيقية.',
      offline: 'الدفع عبر الإنترنت غير متاح حاليًا. اطلب بالدينار على واتساب، أو راسلنا.',
      down: 'الكونتوار لا يستجيب حاليًا. راسلنا على واتساب ونأخذ طلبك يدويًا.',
      cancel: 'أُلغي الدفع: لم يُخصم أي مبلغ. حقيبتك بانتظارك.',
      wait: 'جارٍ تأكيد الدفع…', fail: 'لم يتم الدفع ولم يُخصم أي مبلغ. أعد المحاولة، أو راسلنا.',
      doneK: 'الغنيمة لك', paid: 'تم استلام الدفع. ختم كورو العقد: نبدأ العمل الآن. يصلك إيصال PayPal عبر البريد، ونراسلك خلال 24 ساعة.',
      qk: 'عقد · دفع', ref: 'عرض السعر', stage: 'المرحلة', amount: 'المبلغ',
      p_deposit: 'عربون ⁦40\u00a0%⁩', p_balance: 'الباقي ⁦60 %⁩', p_full: 'الدفع الكامل',
      ready: 'تحقّق من عرض السعر والمبلغ، ثم ادفع في دقيقة.',
      expired: 'انتهت صلاحية رابط الدفع هذا أو تم تعديله. اطلب منا رابطًا جديدًا على واتساب.',
      da: 'دج',
    },
  };

  const q = new URLSearchParams(location.search);
  const lang = T[q.get('lang')] ? q.get('lang') : 'fr';
  const t = T[lang];
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const track = (what) => { try { window.numideaGame && window.numideaGame(`shop-${what}`); } catch { /* analytics never blocks */ } };
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WA = 'https://wa.me/213672412578';

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = t.title;
  document.querySelectorAll('[data-t]').forEach((n) => { if (typeof t[n.dataset.t] === 'string') n.textContent = t[n.dataset.t]; });
  const termsA = document.querySelector('.c-terms'); if (termsA) termsA.href = 'conditions/#' + lang;
  $('c-off').hidden = true;

  // Arabic groups thousands with a space like the Studio's carte (70 000 دج), not ar-DZ's dot, which reads as a decimal
  const locale = lang === 'en' ? 'en-US' : 'fr-FR';
  const nf = new Intl.NumberFormat(locale);
  // fr-FR groups with a narrow no-break space the condensed display face does not draw
  const sp = (x) => x.replace(/\u202f/g, '\u00a0');
  const fmtDA = (n) => sp(`${nf.format(n)} ${t.da}`);
  const fmtCur = (n, cur) => sp(new Intl.NumberFormat(locale, { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(n));
  const msg = (text, err) => { const m = $('c-msg'); m.hidden = false; m.textContent = text; m.className = err ? 'c-msg is-err' : 'c-msg'; };
  const say = (text) => { const b = $('c-say'); b.textContent = text; if (still) return; b.classList.remove('is-new'); void b.offsetWidth; b.classList.add('is-new'); };
  const post = (body) => fetch('/api/pay', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const status = () => fetch('/api/pay').then((r) => r.json());

  /* ---------- back from PayPal: capture once, then the seal ---------- */
  const token = q.get('token');
  if (q.has('done') && token) {
    msg(t.wait);
    post({ op: 'capture', token }).then((r) => (r.ok ? r.json() : Promise.reject(r.status))).then(() => {
      $('c-msg').hidden = true;
      $('c-done').hidden = false;
      say(t.sayPaid);
      track('paid');
      try { sessionStorage.removeItem('comptoir-bag'); } catch { /* storage may be off */ }
      // drop the token so a reload does not look like a fresh return
      history.replaceState(null, '', `${location.pathname}?${new URLSearchParams(lang === 'fr' ? {} : { lang })}`);
    }).catch(() => { msg(t.fail, true); track('fail'); start(); });
    return;
  }
  start();

  function start() {
    const f = { ref: q.get('ref'), part: q.get('part'), amt: q.get('amt'), cur: q.get('cur'), exp: q.get('exp'), sig: q.get('sig') };
    const quote = /^Q-\d{4}-\d{3,4}$/.test(f.ref || '') && ['deposit', 'balance', 'full'].includes(f.part) && /^\d{1,6}\.\d{2}$/.test(f.amt || '')
      && ['EUR', 'USD'].includes(f.cur) && /^\d{10}$/.test(f.exp || '') && !!f.sig;
    if (quote) quoteMode(f); else shop();
  }

  /* ---------- a signed quote ---------- */
  function quoteMode(f) {
    $('c-quote').hidden = false;
    document.querySelector('.c-skip').setAttribute('href', '#c-h-quote');
    $('c-qref').textContent = f.ref;
    $('c-qpart').textContent = t[`p_${f.part}`];
    $('c-qamt').textContent = new Intl.NumberFormat(locale, { style: 'currency', currency: f.cur }).format(+f.amt);
    $('c-say').textContent = t.ready;
    if (+f.exp * 1000 < Date.now()) { msg(t.expired, true); track('expired'); return; }
    if (q.has('cancel')) msg(t.cancel);
    status().then((s) => {
      if (!s.ready) { msg(t.offline, true); return; }
      $('c-qact').hidden = false;
      track('quote-view');
    }).catch(() => msg(t.offline, true));
    const btn = $('c-qpay');
    btn.addEventListener('click', () => {
      if (!$('c-qok').checked) { msg(t.okNeed, true); $('c-qok').focus(); return; }
      checkout(btn, { op: 'create', lang, startOk: true, ...f }, t.pay);
    });
  }

  /* ---------- the shop ---------- */
  function shop() {
    status().then((s) => {
      if (!s.catalog) throw new Error('catalog');
      draw(s.catalog, s);
    }).catch(() => {
      msg(t.down, true);
      document.querySelector('.c-skip').setAttribute('href', '#c-msg');
      $('c-say').textContent = t.down;
      track('down');
    });
  }

  function draw(cat, s) {
    const items = cat.items, byId = Object.fromEntries(items.map((i) => [i.id, i]));
    const bag = new Map();
    let tab = 'all', cur = lang === 'en' ? 'USD' : 'EUR', part = 'full', lastTotal = 0, hadCombo = false, hadLvl = false, route = null, ref = null;
    try {
      const saved = JSON.parse(sessionStorage.getItem('comptoir-bag') || 'null');
      if (saved && Array.isArray(saved.bag)) saved.bag.forEach(([id, n]) => { if (byId[id] && Number.isInteger(n) && n >= 1 && n <= byId[id].max) bag.set(id, n); });
      if (saved && cat.fx[saved.cur]) cur = saved.cur;
      if (saved && /^N-\d{8}-[A-Z0-9]{4}$/.test(saved.ref || '')) ref = saved.ref;
    } catch { /* storage may be off */ }

    // ?add=<id>[*n][,<id>[*n]…]: a carte card or the console's receipt, put in the bag (an item already there keeps its count)
    let add = null;
    for (const part of (q.get('add') || '').split(',').slice(0, 8)) {
      const [id, k] = part.split('*'), i = byId[id], n = k === undefined ? 1 : Number(k);
      if (!i || !Number.isInteger(n) || n < 1 || n > i.max) continue;
      if (!bag.has(i.id)) bag.set(i.id, n);
      add = add || i;
    }
    if (add) tab = add.cat;
    // where the bag came from (a Lanterne book, the shelf…): one count per landing, as /go/game/shop-from-<src>
    const src = q.get('from');
    if (add && src && /^[a-z]{2,10}$/.test(src)) track(`from-${src}`);
    const name = (i) => i.n[lang] || i.n.fr;
    const rarity = (da) => (da > 50000 ? 'epic' : da > 15000 ? 'rare' : 'common');
    const fxOf = (da, c) => Math.max(1, Math.round(da / cat.fx[c]));

    /* category chips, with counts */
    const tabs = $('c-tabs');
    [['all', items.length], ...cat.cats.map((c) => [c, items.filter((i) => i.cat === c).length])].forEach(([id, n]) => {
      const b = el('button', 'c-chip');
      b.type = 'button'; b.setAttribute('role', 'radio'); b.dataset.tab = id;
      b.append(el('span', '', id === 'all' ? t.all : t.cats[id] || id), el('span', 'c-chip__n c-num', String(n)));
      b.addEventListener('click', () => { tab = id; paintTabs(); paintGrid(); track(`tab-${id}`); });
      tabs.append(b);
    });
    // arrow keys move along the radiogroup
    tabs.addEventListener('keydown', (e) => {
      const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (!(e.key in keys)) return;
      e.preventDefault();
      const list = [...tabs.children], i = list.findIndex((b) => b.dataset.tab === tab);
      const step = keys[e.key] * (lang === 'ar' && e.key.startsWith('Arrow') && /Left|Right/.test(e.key) ? -1 : 1);
      const next = list[(i + step + list.length) % list.length];
      next.click(); next.focus();
    });
    function paintTabs() {
      [...tabs.children].forEach((b) => { const on = b.dataset.tab === tab; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; });
    }

    /* loot cards */
    const grid = $('c-grid');
    function paintGrid(newId) {
      grid.textContent = '';
      items.filter((i) => tab === 'all' || i.cat === tab).forEach((i) => {
        const n = bag.get(i.id) || 0, r = rarity(i.da);
        const li = el('li', `c-card${n ? ' is-in' : ''}${newId === i.id && !still ? ' is-new' : ''}`);
        li.dataset.r = r;
        const b = el('div', 'c-card__b');
        const price = el('div', 'c-price');
        price.append(el('span', 'c-da c-num', fmtDA(i.da)), el('span', 'c-fx c-num', `≈ ${fmtCur(fxOf(i.da, cur), cur)}`));
        b.append(el('span', 'c-rar', `${t.rar[r]} · ${t.cats[i.cat]}`), el('h3', 'c-name', name(i)), price);
        if (i.cat === 'cours') b.append(el('p', 'c-edu', t.edu));
        const foot = el('div', 'c-card__f');
        if (i.max > 1 && n) {
          const st = el('div', 'c-step');
          const minus = el('button', '', '−'), plus = el('button', '', '+'), out = el('output', 'c-num', String(n));
          minus.type = plus.type = 'button';
          minus.setAttribute('aria-label', `${t.less} · ${name(i)}`); plus.setAttribute('aria-label', `${t.more} · ${name(i)}`);
          plus.disabled = n >= i.max;
          minus.addEventListener('click', () => set(i.id, n - 1, `[data-id="${i.id}"] .c-step button:first-child`));
          plus.addEventListener('click', () => set(i.id, n + 1, `[data-id="${i.id}"] .c-step button:last-child`));
          st.append(minus, out, plus);
          foot.append(st);
        } else {
          const add = el('button', 'c-add', n ? t.remove : t.add);
          add.type = 'button';
          add.setAttribute('aria-pressed', String(!!n));
          add.setAttribute('aria-label', `${n ? t.remove : t.add} · ${name(i)}`);
          add.addEventListener('click', () => set(i.id, n ? 0 : 1, `[data-id="${i.id}"] .c-add, [data-id="${i.id}"] .c-step button:last-child`));
          foot.append(add);
        }
        li.dataset.id = i.id;
        li.append(b, foot);
        if (n) li.append(el('span', 'c-stamp', i.max > 1 ? `${t.inBag} ×${n}` : t.inBag));
        grid.append(li);
      });
    }

    function set(id, n, refocus) {
      const before = bag.get(id) || 0;
      if (n <= 0) bag.delete(id); else bag.set(id, Math.min(n, byId[id].max));
      if (n > before) { say(t.sayAdd); track(`add-${id}`); }
      paintGrid(n > before && before === 0 ? id : null);
      paintBag();
      if (!bag.size && before) say(t.sayEmpty);
      if (refocus) { const f = grid.querySelector(refocus) || grid.querySelector(`[data-id="${id}"] button`); if (f) f.focus(); }
    }

    /* the bag, priced the way api/_shop.js prices it */
    function quote() {
      const lines = [...bag].map(([id, n]) => ({ id, n, da: byId[id].da * n }));
      const combos = cat.combos.filter((c) => c.needs.every((id) => bag.has(id)));
      const total = lines.reduce((s, l) => s + l.da, 0) - combos.reduce((s, c) => s + c.off, 0);
      const canDeposit = total >= cat.depositFrom;
      const p = canDeposit ? part : 'full';
      const dueDA = p === 'deposit' ? Math.round(total * cat.deposit) : total;
      return { lines, combos, total, p, dueDA, due: fxOf(dueDA, cur), canDeposit };
    }

    // the order as the owner reads it on WhatsApp (and as the copy button gives it)
    // custom work and digital guides need the buyer's "start now" request (the terms' withdrawal clause);
    // everything the counter sells is one or the other since the sticker sheets moved to tr4velerz.studio
    const needOk = () => bag.size > 0;
    const blocked = (e) => {
      if (!needOk() || $('c-ok').checked) return false;
      if (e) e.preventDefault();
      $('c-ok-l').classList.add('is-need'); msg(t.okNeed, true); $('c-ok').focus();
      return true;
    };
    const order = (k, dueTxt) => t.waOrder(ref,
      k.lines.map((l) => `• ${name(byId[l.id])}${l.n > 1 ? ` ×${l.n}` : ''}: ${fmtDA(l.da)}`)
        .concat(k.combos.map((c) => `★ ${c.n[lang] || t.combo}: −${fmtDA(c.off)}`)).join('\n'),
      fmtDA(k.total), t.due(dueTxt, k.p), t.routes[route]).concat(needOk() && $('c-ok').checked ? `\n${t.okLine}` : '').replace(/[\u2066-\u2069]/g, '');   // a chat app shows bidi marks as boxes
    function newRef() {
      const d = new Date(), pad = (n) => String(n).padStart(2, '0'), A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      const r = crypto.getRandomValues(new Uint8Array(4));
      return `N-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${[...r].map((x) => A[x % A.length]).join('')}`;
    }

    const chips = (box, list, val, pick) => {
      box.textContent = '';
      list.forEach(([id, label]) => {
        const b = el('button', 'c-chip', label);
        b.type = 'button'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', String(id === val));
        b.addEventListener('click', () => { pick(id); paintBag(); paintGrid(); });
        box.append(b);
      });
      box.setAttribute('role', 'radiogroup');
    };

    let liveT = 0, painted = false;
    function paintBag() {
      const k = quote(), count = [...bag.values()].reduce((s, n) => s + n, 0);
      try { sessionStorage.setItem('comptoir-bag', JSON.stringify({ bag: [...bag], cur, ref })); } catch { /* storage may be off */ }
      $('c-count').textContent = String(count);
      $('c-empty').hidden = !!bag.size;
      // one reference per bag: made when the first card lands, dropped when the bag empties
      if (bag.size && !ref) ref = newRef();
      if (!bag.size) ref = null;
      $('c-tot').hidden = $('c-route-f').hidden = $('c-act').hidden = !bag.size;

      // receipt lines
      const sum = $('c-sum');
      sum.textContent = '';
      k.lines.forEach((l) => {
        const li = el('li');
        li.append(el('span', '', `${name(byId[l.id])}${l.n > 1 ? ` ×${l.n}` : ''}`), el('span', 'c-v c-num', fmtDA(l.da)));
        sum.append(li);
      });
      k.combos.forEach((c) => {
        const li = el('li', 'is-combo');
        li.append(el('span', '', `★ ${c.n[lang] || t.combo}`), el('span', 'c-v c-num', `−${fmtDA(c.off)}`));
        sum.append(li);
      });

      // a combo one card away
      const near = cat.combos.find((c) => !k.combos.includes(c) && c.needs.filter((id) => bag.has(id)).length === c.needs.length - 1);
      const hint = $('c-hint');
      hint.hidden = !near;
      if (near) hint.textContent = t.hint(name(byId[near.needs.find((id) => !bag.has(id))]), fmtDA(near.off));
      if (k.combos.length && !hadCombo) { say(t.sayCombo); track('combo'); }
      hadCombo = !!k.combos.length;

      // the level bar, toward the deposit threshold
      const pct = Math.min(100, Math.round((k.total / cat.depositFrom) * 100));
      $('c-lvl-fill').style.width = `${pct}%`;
      $('c-lvl').classList.toggle('is-max', k.canDeposit);
      $('c-lvl-t').textContent = k.canDeposit ? t.lvlMax : t.lvl(fmtDA(cat.depositFrom - k.total));
      if (k.canDeposit && !hadLvl) say(t.sayLvl);
      hadLvl = k.canDeposit;

      // total, rolled
      const big = $('c-big');
      if (!still && k.total !== lastTotal && bag.size) {
        const from = lastTotal, to = k.total, t0 = performance.now();
        const roll = (now) => { const x = Math.min(1, (now - t0) / 280); big.textContent = fmtDA(Math.round(from + (to - from) * (1 - (1 - x) ** 3))); if (x < 1) requestAnimationFrame(roll); };
        requestAnimationFrame(roll);
        big.classList.remove('is-roll'); void big.offsetWidth; big.classList.add('is-roll');
      } else big.textContent = fmtDA(k.total);
      lastTotal = k.total;
      // the spoken total: one polite line once the bag settles, never on the first paint
      clearTimeout(liveT);
      if (painted) liveT = setTimeout(() => { $('c-live').textContent = t.live(count, fmtDA(k.total)); }, 450);
      painted = true;
      const dueTxt = route === 'ccp' ? fmtDA(k.dueDA) : fmtCur(k.due, cur);
      $('c-due').textContent = t.due(dueTxt, k.p);

      chips($('c-route'), routes.map((r) => [r, t.routes[r]]), route, (r) => { route = r; track(`route-${r}`); });
      $('c-cur-f').hidden = !bag.size || route === 'ccp';
      chips($('c-cur'), [['EUR', 'EUR €'], ['USD', 'USD $']], cur, (c) => { cur = c; track(`cur-${c}`); });
      $('c-part-f').hidden = !k.canDeposit;
      if (k.canDeposit) chips($('c-part'), [['full', t.full], ['deposit', t.deposit]], k.p, (p) => { part = p; track(`part-${p}`); });

      // the route: the API checkout, a prefilled PayPal.me link, or an order sent on WhatsApp (CCP, transfer)
      const api = route === 'paypal' && ready, link = route === 'paypal' && !ready && s.paylink;
      $('c-ref').textContent = ref || '';
      $('c-pay').hidden = !api;
      $('c-pp').hidden = !link;
      $('c-pay-t').textContent = t.payX(dueTxt);
      if (link) { $('c-pp').href = `${s.paylink}/${k.due}${cur}`; $('c-pp-t').textContent = t.ppGo(dueTxt); }
      const steps = $('c-steps');
      steps.textContent = '';
      (api ? [] : t.steps[link ? 'link' : route](dueTxt)).forEach((x) => steps.append(el('li', '', x)));
      steps.hidden = api;
      $('c-fine').textContent = api ? `${t.fine}${s.env === 'sandbox' ? ` ${t.sandbox}` : ''}` : t.fineR[link ? 'link' : route];
      $('c-wa').href = `${WA}?text=${encodeURIComponent(order(k, dueTxt))}`;
      $('c-wa').classList.toggle('c-btn--alt', api || !!link);

      const gate = needOk() && !$('c-ok').checked;
      $('c-ok-l').hidden = !needOk();
      ['c-pay', 'c-pp', 'c-wa', 'c-copy'].forEach((id) => { if (gate) $(id).setAttribute('aria-disabled', 'true'); else $(id).removeAttribute('aria-disabled'); });
      $('c-dock').hidden = !bag.size;
      $('c-dock-n').textContent = String(count);
      $('c-dock-t').textContent = fmtDA(k.total);
    }

    // PayPal is a route only when it can take the money (the API, or the owner's PayPal.me link);
    // CCP and a bank transfer always are, closed by hand on WhatsApp
    const ready = !!s.ready;
    const routes = [...(ready || s.paylink ? ['paypal'] : []), 'ccp', 'wire'];
    route = routes.includes('paypal') ? 'paypal' : lang === 'en' ? 'wire' : 'ccp';
    if (q.has('cancel')) { msg(t.cancel); track('cancel'); }

    $('c-shop').hidden = false;
    paintTabs(); paintGrid(); paintBag();
    hadCombo = !!quote().combos.length; hadLvl = quote().canDeposit;
    track('view');
    if (add) { say(t.sayAdd); track(`deeplink-${add.id}`); }

    $('c-ok').addEventListener('change', () => { $('c-ok-l').classList.remove('is-need'); track(`start-ok-${$('c-ok').checked}`); paintBag(); });
    const btn = $('c-pay');
    btn.addEventListener('click', () => {
      const k = quote();
      if (!k.lines.length || blocked()) return;
      track(`click-${k.p}`);
      checkout(btn, { op: 'create', mode: 'cart', lang, cur, part: k.p, startOk: $('c-ok').checked, bag: k.lines.map((l) => ({ id: l.id, qty: l.n })) }, t.payX(fmtCur(k.due, cur)));
    });
    $('c-wa').addEventListener('click', (e) => { if (!blocked(e)) track(`wa-${route}`); });
    $('c-pp').addEventListener('click', (e) => { if (!blocked(e)) track('paylink'); });
    $('c-copy').addEventListener('click', () => {
      if (blocked()) return;
      const k = quote(), b = $('c-copy');
      const txt = order(k, route === 'ccp' ? fmtDA(k.dueDA) : fmtCur(k.due, cur));
      Promise.resolve().then(() => navigator.clipboard.writeText(txt)).then(() => {
        b.textContent = t.copied; track('copy');
        setTimeout(() => { b.textContent = t.copy; }, 2000);
      }).catch(() => { /* no clipboard: the WhatsApp button carries the same text */ });
    });
  }

  function checkout(btn, body, label) {
    if (btn.getAttribute('aria-busy') === 'true') return;
    btn.setAttribute('aria-busy', 'true');
    const lab = btn.querySelector('.c-btn__t');
    lab.textContent = t.busy;
    post(body).then((r) => (r.ok ? r.json() : r.json().then((j) => Promise.reject(j.error))))
      .then((j) => { location.assign(j.approve); })
      .catch((e) => {
        btn.removeAttribute('aria-busy');
        lab.textContent = label;
        msg(e === 'link' ? t.expired : t.fail, true);
      });
  }
})();
