/* /carte/: La Carte. Applies ?lang=en|ar (French is baked in the page), opens a city's dossier from its seal,
   lights its route, and keeps the passport: one stamp per city whose door was taken. The stamps live in this
   browser only (localStorage, a convenience; the page works without it) and are announced to the game loop
   through window.numideaGame (assets/carry.js), the hook the game loop's slice 4 reads.
   Names follow the home's portals (assets/i18n/*.js, portals.*). */
(() => {
  const STORE = 'https://tr4velerz.studio/';
  const T = {
    fr: {
      title: 'La Carte · Numidea Labs', skip: 'Aller à la carte', home: '← Numidea Labs', readMap: 'LA CARTE', readSheet: 'FEUILLE 1', langNav: 'Langue',
      kicker: 'Le monde Numidea', h: 'La Carte',
      lede: 'Tout le monde Numidea tient sur une feuille : le studio au nord, et trois boutiques au bout des routes. Choisis une ville.',
      pass: 'Passeport', passHint: 'Un tampon par ville visitée. Le QG te l’offre : tu y es.', passDone: 'Quatre tampons : tu as fait le tour de la carte.',
      winBar: 'nuit · terrasse · la carte', say: 'Kūro garde la carte. Les routes rouges sont ouvertes ; le reste viendra.',
      winAlt: 'La nuit, sur une terrasse au-dessus de la mer, Yasser dessine sur son ordinateur ; Kūro, le chat noir, veille sur le sac à dos. Une carte est dépliée sur la table.',
      stageH: 'La carte', here: 'Vous êtes ici', soon: 'Bientôt',
      legendBar: 'Légende', legendH: 'Comment lire la carte',
      lgSeal: 'Un sceau : une ville, une boutique ou le studio. Touche-le pour ouvrir son dossier.',
      lgRoute: 'Une route rouge : le chemin depuis le QG.', lgFog: 'Les hachures : terres à venir. Elles s’ouvriront avec ton rang.', lgPaw: 'La patte de Kūro : vous êtes ici.',
      back: '← Revenir à la légende', carnetH: 'Carnet de route', carnetS: 'Les mêmes lieux, sans la carte.',
      lTarifs: 'Les tarifs', lComptoir: 'Le comptoir', lAtelier: 'L’atelier', lContact: 'Écrire au studio', newTab: ' (nouvel onglet)',
      note: 'Carte dessinée à la main : les villes sont à leur vraie place, les frontières à main levée.',
      mapTitle: 'Carte de l’Algérie : le QG à Bordj Bou Arréridj, le Vestiaire à Oran, la Logithèque à Ghardaïa, l’Arcade à Tamanrasset',
      sea: 'MER MÉDITERRANÉE', sahara: 'SAHARA', ergW: 'Grand Erg Occidental', ergE: 'Grand Erg Oriental', tassili: 'Tassili n’Ajjer', hoggar: 'Hoggar', atlasS: 'Atlas saharien',
      fogA: 'TERRES À VENIR', fogB: 'TERRES À VENIR', nbMa: 'MAROC', nbTn: 'TUNISIE', nbLy: 'LIBYE', nbMl: 'MALI', nbNe: 'NIGER',
      alger: 'Alger', inSalah: 'In Salah', meniaa: 'El Meniaa', cartK: 'ATLAS DU STUDIO', cartS: 'Numidea · feuille 1',
      hqCity: 'Bordj Bou Arréridj', hqName: 'Le QG', hqWhat: 'Le studio Numidea',
      hqP: 'Là où les sites se construisent. Tout ce que le studio vend et raconte part d’ici.',
      oranCity: 'Oran', oranName: 'Le Vestiaire', oranWhat: 'Vêtements, mangas, stickers',
      oranP: 'La ville qui s’habille. Le merch de Yasser et Kūro : vêtements, mangas imprimés, stickers.', oranGo: 'Entrer au Vestiaire',
      ghardaiaCity: 'Ghardaïa', ghardaiaName: 'La Logithèque', ghardaiaWhat: 'Applications',
      ghardaiaP: 'La vallée des bâtisseurs. Nos applications, de WorkspaceHQ aux outils de la Lanterne.', ghardaiaGo: 'Entrer à la Logithèque',
      tamanrassetCity: 'Tamanrasset', tamanrassetName: 'L’Arcade', tamanrassetWhat: 'Jeux',
      tamanrassetP: 'Le bout de la route, au pied du Hoggar. Nos jeux, à télécharger.', tamanrassetGo: 'Entrer à l’Arcade',
      fine: 'Sur tr4velerz.studio, dans un nouvel onglet. La boutique ouvre bientôt.', hqFine: '',
      stamped: (n) => `Tampon posé : ${n}.`,
    },
    en: {
      title: 'The Map · Numidea Labs', skip: 'Skip to the map', home: '← Numidea Labs', readMap: 'THE MAP', readSheet: 'SHEET 1', langNav: 'Language',
      kicker: 'The Numidea world', h: 'The Map',
      lede: 'The whole Numidea world fits on one sheet: the studio up north, and three stores at the end of the roads. Pick a city.',
      pass: 'Passport', passHint: 'One stamp for each city you visit. The HQ gives you its own: you are here.', passDone: 'Four stamps: you have toured the whole map.',
      winBar: 'night · terrace · the map', say: 'Kūro guards the map. The red roads are open; the rest will come.',
      winAlt: 'At night, on a terrace above the sea, Yasser draws on his laptop; Kūro, the black cat, keeps watch on the backpack. A map lies open on the table.',
      stageH: 'The map', here: 'You are here', soon: 'Soon',
      legendBar: 'Legend', legendH: 'How to read the map',
      lgSeal: 'A seal: a city, a store or the studio. Tap it to open its file.',
      lgRoute: 'A red road: the way from the HQ.', lgFog: 'The hatching: lands to come. They open with your rank.', lgPaw: 'Kūro’s paw: you are here.',
      back: '← Back to the legend', carnetH: 'Road log', carnetS: 'The same places, without the map.',
      lTarifs: 'Prices', lComptoir: 'The counter', lAtelier: 'The workshop', lContact: 'Write to the studio', newTab: ' (opens in a new tab)',
      note: 'A hand-drawn map: the cities sit where they really are, the borders are freehand.',
      mapTitle: 'Map of Algeria: the HQ in Bordj Bou Arréridj, the Wardrobe in Oran, the App Shelf in Ghardaïa, the Arcade in Tamanrasset',
      sea: 'MEDITERRANEAN SEA', sahara: 'SAHARA', ergW: 'Great Western Erg', ergE: 'Great Eastern Erg', tassili: 'Tassili n’Ajjer', hoggar: 'Hoggar', atlasS: 'Saharan Atlas',
      fogA: 'LANDS TO COME', fogB: 'LANDS TO COME', nbMa: 'MOROCCO', nbTn: 'TUNISIA', nbLy: 'LIBYA', nbMl: 'MALI', nbNe: 'NIGER',
      alger: 'Algiers', inSalah: 'In Salah', meniaa: 'El Meniaa', cartK: 'THE STUDIO ATLAS', cartS: 'Numidea · sheet 1',
      hqCity: 'Bordj Bou Arréridj', hqName: 'The HQ', hqWhat: 'The Numidea studio',
      hqP: 'Where the websites get built. Everything the studio sells and tells starts here.',
      oranCity: 'Oran', oranName: 'The Wardrobe', oranWhat: 'Clothing, mangas, stickers',
      oranP: 'The city that dresses up. Yasser and Kūro’s merch: clothing, printed mangas, stickers.', oranGo: 'Enter the Wardrobe',
      ghardaiaCity: 'Ghardaïa', ghardaiaName: 'The App Shelf', ghardaiaWhat: 'Apps',
      ghardaiaP: 'The builders’ valley. Our apps, from WorkspaceHQ to the Lanterne’s tools.', ghardaiaGo: 'Enter the App Shelf',
      tamanrassetCity: 'Tamanrasset', tamanrassetName: 'The Arcade', tamanrassetWhat: 'Games',
      tamanrassetP: 'The end of the road, at the foot of the Hoggar. Our games, to download.', tamanrassetGo: 'Enter the Arcade',
      fine: 'On tr4velerz.studio, in a new tab. The store opens soon.', hqFine: '',
      stamped: (n) => `Stamp added: ${n}.`,
    },
    ar: {
      title: 'الخريطة · نوميديا لابز', skip: 'انتقل إلى الخريطة', home: 'نوميديا لابز →', readMap: 'الخريطة', readSheet: 'الورقة 1', langNav: 'اللغة',
      kicker: 'عالم نوميديا', h: 'الخريطة',
      lede: 'عالم نوميديا كله على ورقة واحدة: الاستوديو في الشمال، وثلاثة متاجر في نهاية الطرق. اختر مدينة.',
      pass: 'جواز السفر', passHint: 'ختم لكل مدينة تزورها. المقر يمنحك ختمه: أنت هنا.', passDone: 'أربعة أختام: طفت الخريطة كلها.',
      winBar: 'ليل · شرفة · الخريطة', say: 'كورو يحرس الخريطة. الطرق الحمراء مفتوحة، والباقي سيأتي.',
      winAlt: 'في الليل، على شرفة تطل على البحر، يرسم ياسر على حاسوبه؛ وكورو، القط الأسود، يحرس حقيبة الظهر. خريطة مفرودة على الطاولة.',
      stageH: 'الخريطة', here: 'أنت هنا', soon: 'قريبًا',
      legendBar: 'مفتاح الخريطة', legendH: 'كيف تقرأ الخريطة',
      lgSeal: 'الختم: مدينة، متجر أو الاستوديو. المسه لفتح ملفه.',
      lgRoute: 'الطريق الأحمر: الدرب من المقر.', lgFog: 'التظليل: أراضٍ قادمة، تنفتح مع رتبتك.', lgPaw: 'أثر مخلب كورو: أنت هنا.',
      back: 'العودة إلى مفتاح الخريطة →', carnetH: 'دفتر الطريق', carnetS: 'الأماكن نفسها، دون الخريطة.',
      lTarifs: 'الأسعار', lComptoir: 'المنضدة', lAtelier: 'الورشة', lContact: 'راسل الاستوديو', newTab: ' (يفتح في تبويب جديد)',
      note: 'خريطة مرسومة باليد: المدن في أماكنها الحقيقية، والحدود بخط اليد.',
      mapTitle: 'خريطة الجزائر: المقر في برج بوعريريج، غرفة الملابس في وهران، مكتبة التطبيقات في غرداية، الأركيد في تمنراست',
      sea: 'البحر الأبيض المتوسط', sahara: 'الصحراء', ergW: 'العرق الغربي الكبير', ergE: 'العرق الشرقي الكبير', tassili: 'طاسيلي ناجر', hoggar: 'الهقار', atlasS: 'الأطلس الصحراوي',
      fogA: 'أراضٍ قادمة', fogB: 'أراضٍ قادمة', nbMa: 'المغرب', nbTn: 'تونس', nbLy: 'ليبيا', nbMl: 'مالي', nbNe: 'النيجر',
      alger: 'الجزائر', inSalah: 'عين صالح', meniaa: 'المنيعة', cartK: 'أطلس الاستوديو', cartS: 'نوميديا · الورقة 1',
      hqCity: 'برج بوعريريج', hqName: 'المقر', hqWhat: 'استوديو نوميديا',
      hqP: 'هنا تُبنى المواقع. كل ما يبيعه الاستوديو ويرويه ينطلق من هنا.',
      oranCity: 'وهران', oranName: 'غرفة الملابس', oranWhat: 'ملابس، مانغا، ملصقات',
      oranP: 'المدينة التي تتأنق. منتجات ياسر وكورو: ملابس، مانغا مطبوعة، ملصقات.', oranGo: 'ادخل غرفة الملابس',
      ghardaiaCity: 'غرداية', ghardaiaName: 'مكتبة التطبيقات', ghardaiaWhat: 'تطبيقات',
      ghardaiaP: 'وادي البنّائين. تطبيقاتنا، من WorkspaceHQ إلى أدوات الفانوس.', ghardaiaGo: 'ادخل مكتبة التطبيقات',
      tamanrassetCity: 'تمنراست', tamanrassetName: 'الأركيد', tamanrassetWhat: 'ألعاب',
      tamanrassetP: 'آخر الطريق، عند سفح الهقار. ألعابنا، للتحميل.', tamanrassetGo: 'ادخل الأركيد',
      fine: 'على tr4velerz.studio، في تبويب جديد. المتجر يفتح قريبًا.', hqFine: '',
      stamped: (n) => `وُضع الختم: ${n}.`,
    },
  };
  const SEAL = { hq: '旅', oran: '品', ghardaia: '技', tamanrasset: '遊' };
  const ORDER = ['hq', 'oran', 'ghardaia', 'tamanrasset'];
  const HQ_LINKS = [['../tarifs/', 'lTarifs'], ['../comptoir/', 'lComptoir'], ['../hub/', 'lAtelier'], ['../#contact', 'lContact']];

  const q = new URLSearchParams(location.search);
  const lang = T[q.get('lang')] ? q.get('lang') : 'fr';
  const t = T[lang];
  const $ = (id) => document.getElementById(id);
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const game = (what) => { try { window.numideaGame && window.numideaGame(what); } catch { /* the game never blocks the map */ } };
  const withLang = (href) => (lang === 'fr' || /^https?:/.test(href) ? href : href.replace(/^([^#]*?)(#.*)?$/, (m, p, h) => `${p}?lang=${lang}${h || ''}`));

  /* ---------- language ---------- */
  const root = document.documentElement;
  root.lang = lang; root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = t.title;
  document.querySelectorAll('[data-t]').forEach((n) => { const v = t[n.dataset.t]; if (typeof v === 'string') n.textContent = v; });
  document.querySelectorAll('[data-t-aria]').forEach((n) => n.setAttribute('aria-label', t[n.dataset.tAria]));
  document.querySelectorAll('[data-t-alt]').forEach((n) => n.setAttribute('alt', t[n.dataset.tAlt]));
  document.querySelectorAll('.ct-lang a').forEach((a) => { if (a.dataset.l === lang) a.setAttribute('aria-current', 'true'); });
  if (lang !== 'fr') document.querySelectorAll('.ct-log a[href^="../"],.ct-home').forEach((a) => a.setAttribute('href', withLang(a.getAttribute('href'))));
  // the store links say which city sent the visitor (the game loop's ?from= convention)
  const storeHref = (city) => `${STORE}?from=numidea&city=${city}${lang === 'fr' ? '' : `&lang=${lang}`}`;

  /* ---------- the passport ---------- */
  const KEY = 'numidea-carte-stamps';
  let stamps = ['hq'];
  try { const s = JSON.parse(localStorage.getItem(KEY) || '[]'); if (Array.isArray(s)) stamps = [...new Set(['hq', ...s.filter((c) => SEAL[c])])]; } catch { /* storage may be off */ }
  const drawPass = (fresh) => {
    document.querySelectorAll('.ct-stamp').forEach((li) => {
      const on = stamps.includes(li.dataset.city); li.classList.toggle('is-on', on);
      if (on && li.dataset.city === fresh && !still) { li.classList.remove('is-new'); void li.offsetWidth; li.classList.add('is-new'); }
    });
    $('ct-pass-n').textContent = `${stamps.length}/4`;
    if (stamps.length === 4) document.querySelector('.ct-pass__h').textContent = t.passDone;
  };
  const stamp = (city) => {
    if (stamps.includes(city)) return;
    stamps.push(city); drawPass(city);
    try { localStorage.setItem(KEY, JSON.stringify(stamps)); } catch { /* storage may be off */ }
    game(`map-stamp-${city}`);
  };
  drawPass();

  /* ---------- the dossier ---------- */
  const map = $('ct-map'), legend = $('ct-dos-legend'), file = $('ct-dos-city');
  const pins = [...document.querySelectorAll('.ct-pin')];
  const land = (box) => { if (still) return; box.classList.remove('is-new'); void box.offsetWidth; box.classList.add('is-new'); };
  const light = (city) => {
    map.classList.toggle('is-focus', !!city);
    document.querySelectorAll('.ct-city').forEach((li) => li.classList.toggle('is-on', li.dataset.city === city));
    document.querySelectorAll('.m-route').forEach((r) => r.classList.toggle('is-on', !!city && (r.dataset.route === city || (city === 'tamanrasset' && r.dataset.route === 'ghardaia'))));
  };
  let open = null;
  const show = (city, focus) => {
    open = city;
    pins.forEach((b) => b.setAttribute('aria-pressed', String(b.closest('.ct-city').dataset.city === city)));
    light(city);
    $('ct-d-city').textContent = t[`${city}City`];
    $('ct-d-n').textContent = String(ORDER.indexOf(city) + 1).padStart(2, '0');
    $('ct-d-seal').textContent = SEAL[city];
    $('ct-d-h').textContent = t[`${city}Name`];
    $('ct-d-what').textContent = t[`${city}What`];
    $('ct-d-p').textContent = t[`${city}P`];
    const links = $('ct-d-links'); links.textContent = '';
    const go = $('ct-d-go');
    if (city === 'hq') {
      HQ_LINKS.forEach(([href, k]) => { const li = document.createElement('li'), a = document.createElement('a'); a.href = withLang(href); a.textContent = t[k]; li.append(a); links.append(li); });
      go.hidden = true; $('ct-d-fine').textContent = t.hqFine;
    } else {
      go.hidden = false; go.href = storeHref(city); go.dataset.city = city;
      $('ct-d-go-t').textContent = t[`${city}Go`];
      $('ct-d-fine').textContent = t.fine;
    }
    legend.hidden = true; file.hidden = false; land(file);
    game(`map-open-${city}`);
    if (focus) {
      $('ct-d-h').focus({ preventScroll: true });
      // on a phone the dossier sits under the map: bring it into view
      if (!matchMedia('(min-width:1100px)').matches) file.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
    }
  };
  const reset = () => {
    const was = open; open = null;
    pins.forEach((b) => b.setAttribute('aria-pressed', 'false')); light(null);
    file.hidden = true; legend.hidden = false; land(legend);
    if (was) document.querySelector(`.ct-city[data-city="${was}"] .ct-pin`).focus();
  };
  pins.forEach((b) => {
    const city = b.closest('.ct-city').dataset.city;
    b.addEventListener('click', () => (open === city ? reset() : show(city, true)));
    // a preview while pointing or tabbing: the route lights, the dossier waits for a choice
    b.addEventListener('pointerenter', () => { if (!open) light(city); });
    b.addEventListener('pointerleave', () => { if (!open) light(null); });
    b.addEventListener('focus', () => { if (!open) light(city); });
    b.addEventListener('blur', () => { if (!open) light(null); });
  });
  $('ct-d-back').addEventListener('click', reset);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) reset(); });
  // taking a store's door stamps the passport
  $('ct-d-go').addEventListener('click', (e) => stamp(e.currentTarget.dataset.city));
  document.querySelectorAll('.ct-log li').forEach((li) => li.querySelectorAll('a[target="_blank"]').forEach((a) => {
    a.href = storeHref(li.dataset.city); a.addEventListener('click', () => stamp(li.dataset.city));
  }));
  // a link may name a city: /carte/?city=oran opens its file
  const asked = q.get('city'); if (SEAL[asked]) show(asked, false);
})();
