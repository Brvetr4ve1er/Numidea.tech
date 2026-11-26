/* /payer/: reads the signed quote link, shows the contract, sends the visitor to PayPal through /api/pay, and
   captures on return. The server re-checks every field; this file only displays them. Language: ?lang=en|ar
   (French by default, which is also the page without script). */
(() => {
  const T = {
    fr: {
      title: 'Régler votre devis · Numidea Labs', home: '← Numidea Labs', kicker: 'Contrat · paiement', h: 'Régler votre devis',
      ref: 'Devis', part: 'Étape', amount: 'Montant',
      p_deposit: 'Acompte 40 %', p_balance: 'Solde 60 %', p_full: 'Paiement complet',
      nolink: 'Cette page sert à régler un devis signé. Le lien de paiement vous est envoyé avec le devis : ouvrez-le depuis votre message, ou écrivez-nous.',
      ready: 'Vérifiez le devis et le montant, puis réglez en une minute.',
      expired: 'Ce lien de paiement a expiré ou a été modifié. Demandez-nous un nouveau lien sur WhatsApp.',
      offline: 'Le paiement en ligne n’est pas disponible pour le moment. Réglez par virement ou CCP (coordonnées sur votre devis), ou écrivez-nous.',
      cancel: 'Paiement annulé : rien n’a été débité. Vous pouvez réessayer quand vous voulez.',
      wait: 'Confirmation du paiement…',
      fail: 'Le paiement n’a pas abouti et rien n’a été débité. Réessayez, ou écrivez-nous.',
      sandbox: 'Mode test (sandbox) : aucun argent réel ne circule.',
      pay: 'Payer avec PayPal', busy: 'Ouverture de PayPal…',
      fine: 'Carte bancaire ou compte PayPal. Vous validez le paiement chez PayPal ; nous ne voyons jamais vos données de carte.',
      paid: 'Paiement reçu. Kūro a posé le sceau : le travail continue. Un reçu PayPal arrive par e-mail.',
      altH: 'Autres moyens', alt: 'Virement ou CCP en Algérie, virement en euros ou en dollars depuis l’étranger : les coordonnées figurent sur votre devis.',
      wa: 'Une question ? WhatsApp',
    },
    en: {
      title: 'Pay your quote · Numidea Labs', home: '← Numidea Labs', kicker: 'Contract · payment', h: 'Pay your quote',
      ref: 'Quote', part: 'Stage', amount: 'Amount',
      p_deposit: '40% deposit', p_balance: '60% balance', p_full: 'Full payment',
      nolink: 'This page settles a signed quote. Your payment link comes with the quote: open it from your message, or write to us.',
      ready: 'Check the quote and the amount, then pay in a minute.',
      expired: 'This payment link has expired or was changed. Ask us for a new one on WhatsApp.',
      offline: 'Online payment is not available right now. Pay by bank transfer (details on your quote), or write to us.',
      cancel: 'Payment cancelled: nothing was charged. Try again whenever you like.',
      wait: 'Confirming the payment…',
      fail: 'The payment did not go through and nothing was charged. Try again, or write to us.',
      sandbox: 'Test mode (sandbox): no real money moves.',
      pay: 'Pay with PayPal', busy: 'Opening PayPal…',
      fine: 'Card or PayPal account. You confirm the payment on PayPal; we never see your card details.',
      paid: 'Payment received. Kūro stamped the seal: the work goes on. A PayPal receipt is on its way by email.',
      altH: 'Other ways to pay', alt: 'Bank transfer in euros or dollars from abroad, or CCP in Algeria: the details are on your quote.',
      wa: 'A question? WhatsApp',
    },
    ar: {
      title: 'تسديد عرض السعر · Numidea Labs', home: 'Numidea Labs →', kicker: 'عقد · دفع', h: 'تسديد عرض السعر',
      ref: 'عرض السعر', part: 'المرحلة', amount: 'المبلغ',
      p_deposit: 'عربون \u206640 %\u2069', p_balance: 'الباقي \u206660 %\u2069', p_full: 'الدفع الكامل',
      nolink: 'هذه الصفحة لتسديد عرض سعر موقَّع. يصلك رابط الدفع مع عرض السعر: افتحه من رسالتك، أو راسلنا.',
      ready: 'تحقّق من عرض السعر والمبلغ، ثم ادفع في دقيقة.',
      expired: 'انتهت صلاحية رابط الدفع هذا أو تم تعديله. اطلب منا رابطًا جديدًا على واتساب.',
      offline: 'الدفع عبر الإنترنت غير متاح حاليًا. ادفع بتحويل بنكي أو CCP (البيانات في عرض السعر)، أو راسلنا.',
      cancel: 'أُلغي الدفع: لم يُخصم أي مبلغ. يمكنك المحاولة مجددًا متى شئت.',
      wait: 'جارٍ تأكيد الدفع…',
      fail: 'لم يتم الدفع ولم يُخصم أي مبلغ. أعد المحاولة، أو راسلنا.',
      sandbox: 'وضع تجريبي (sandbox): لا تتحرك أموال حقيقية.',
      pay: 'ادفع عبر PayPal', busy: 'جارٍ فتح PayPal…',
      fine: 'بطاقة بنكية أو حساب PayPal. تؤكّد الدفع لدى PayPal، ولا نرى بيانات بطاقتك أبدًا.',
      paid: 'تم استلام الدفع. ختم كورو العقد: العمل مستمر. يصلك إيصال PayPal عبر البريد.',
      altH: 'طرق أخرى', alt: 'تحويل بنكي أو CCP في الجزائر، أو تحويل باليورو أو الدولار من الخارج: البيانات في عرض السعر.',
      wa: 'سؤال؟ واتساب',
    },
  };

  const q = new URLSearchParams(location.search);
  const lang = T[q.get('lang')] ? q.get('lang') : 'fr';
  const t = T[lang];
  const $ = (id) => document.getElementById(id);
  const track = (what) => { try { window.numideaGame && window.numideaGame(`pay-${what}`); } catch { /* analytics never blocks */ } };

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = t.title;
  document.querySelectorAll('[data-t]').forEach((el) => { if (t[el.dataset.t]) el.textContent = t[el.dataset.t]; });

  const msg = (text, err) => { const m = $('p-msg'); m.textContent = text; m.className = err ? 'p-err' : 'p-lead'; };

  // the link's fields, shape-checked only for display; /api/pay decides
  const f = { ref: q.get('ref'), part: q.get('part'), amt: q.get('amt'), cur: q.get('cur'), exp: q.get('exp'), sig: q.get('sig') };
  const shaped = /^Q-\d{4}-\d{3,4}$/.test(f.ref || '') && ['deposit', 'balance', 'full'].includes(f.part) && /^\d{1,6}\.\d{2}$/.test(f.amt || '')
    && ['EUR', 'USD'].includes(f.cur) && /^\d{10}$/.test(f.exp || '') && !!f.sig;
  if (!shaped) { track('nolink'); return; }

  $('p-ref').textContent = f.ref;
  $('p-part').textContent = t[`p_${f.part}`];
  const locale = lang === 'fr' ? 'fr-FR' : lang === 'ar' ? 'ar-DZ-u-nu-latn' : 'en-US';
  $('p-amt').textContent = new Intl.NumberFormat(locale, { style: 'currency', currency: f.cur }).format(+f.amt);
  $('p-sum').hidden = false;

  if (+f.exp * 1000 < Date.now()) { msg(t.expired, true); track('expired'); return; }

  const post = (body) => fetch('/api/pay', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

  // back from PayPal: capture once, then show the seal
  const token = q.get('token');
  if (q.has('done') && token) {
    msg(t.wait);
    post({ op: 'capture', token }).then((r) => (r.ok ? r.json() : Promise.reject(r.status))).then(() => {
      $('p-msg').hidden = true;
      $('p-done').hidden = false;
      track('paid');
      // drop the token from the address so a reload does not look like a fresh return
      history.replaceState(null, '', `${location.pathname}?${new URLSearchParams({ lang, ref: f.ref })}`);
    }).catch(() => { msg(t.fail, true); track('fail'); showButton(); });
    return;
  }

  if (q.has('cancel')) { msg(t.cancel); track('cancel'); } else msg(t.ready);
  showButton();

  function showButton() {
    fetch('/api/pay').then((r) => r.json()).then((s) => {
      if (!s.ready) { msg(t.offline, true); track('offline'); return; }
      if (s.env === 'sandbox') $('p-fine').textContent = `${t.fine} ${t.sandbox}`;
      $('p-act').hidden = false;
      track('view');
    }).catch(() => { msg(t.offline, true); });
  }

  $('p-pay').addEventListener('click', () => {
    const btn = $('p-pay');
    if (btn.getAttribute('aria-busy') === 'true') return;
    btn.setAttribute('aria-busy', 'true');
    btn.querySelector('.p-btn__t').textContent = t.busy;
    track('click');
    post({ op: 'create', lang, ...f }).then((r) => (r.ok ? r.json() : r.json().then((j) => Promise.reject(j.error))))
      .then((j) => { location.assign(j.approve); })
      .catch((e) => {
        btn.removeAttribute('aria-busy');
        btn.querySelector('.p-btn__t').textContent = t.pay;
        msg(e === 'link' ? t.expired : t.fail, true);
      });
  });
})();
