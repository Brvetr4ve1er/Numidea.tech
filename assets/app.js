/* ============================================================
   NUMIDEA LABS — interactions
   i18n (FR · EN · AR/RTL), nav, scroll progress, count-ups,
   reveal-on-scroll, mobile menu, contact form states.
   No dependencies. Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- i18n dictionary ---------------- */
  var I18N = {
    fr: {
      dir: 'ltr',
      title: 'Numidea Labs — On construit le logiciel que votre entreprise attend',
      'meta.desc': 'Studio de développement à Bordj Bou Arréridj. On conçoit, on code, on livre et on répond quand ça casse. Sans intermédiaire.',
      'nav.about': 'À propos', 'nav.services': 'Services', 'nav.work': 'Projets',
      'nav.team': 'Équipe', 'nav.contact': 'Contact', 'nav.cta': 'Parlons-en →',
      'hero.eyebrow': 'Studio de développement · Bordj Bou Arréridj · DZ',
      'hero.title': 'On construit le logiciel que votre entreprise <span class="swash">attend.</span>',
      'hero.lede': 'Quatre personnes. Le design, le code, la donnée, et celui qui décroche vraiment le téléphone. Du back-end au pixel — et personne entre les deux.',
      'hero.cta1': 'Parlons-en →', 'hero.cta2': 'Voir les projets',
      'ship.status': 'production',
      'proof.kicker': '01 — Preuves',
      'proof.s1': 'projets livrés', 'proof.s2': 'spécialistes', 'proof.s3': 'langues', 'proof.s4': 'de réponse',
      'proof.line': 'De vrais clients. De vrais déploiements. Les liens sont plus bas — cliquez-les.',
      'svc.kicker': '02 — Services',
      'svc.title': 'Ce qu\'on <em>construit.</em>',
      'svc1.name': 'Sites & applications', 'svc1.promise': 'Le site qui fait de vous le choix évident.',
      'svc1.desc': 'Sites et applications web sur mesure — rapides, référencés, pensés pour convertir, du front-end au cloud.',
      'svc1.outcome': 'Une présence qui dépasse vos concurrents de trois catégories.',
      'svc2.name': 'Automatisation & données', 'svc2.promise': 'On supprime les tâches répétitives que vous payez à la main.',
      'svc2.desc': 'Scrapers, pipelines de leads, veille marché, outils internes, intégrations. Python · Playwright · APIs.',
      'svc2.outcome': 'Le travail ennuyeux et répétitif tourne seul — en silence, à 3h du matin.',
      'svc3.name': 'Identité & design', 'svc3.promise': 'Un look qui inspire confiance avant qu\'on ait lu un mot.',
      'svc3.desc': 'Logos, identité visuelle, design systems, motion, le kit complet.',
      'svc3.outcome': 'Une cohérence qui fait passer un studio de quatre pour un de quarante.',
      'svc4.name': 'Stratégie & conseil', 'svc4.promise': 'On a fait les devoirs sur votre secteur avant l\'appel.',
      'svc4.desc': 'Audits de marché, analyse de funnels, intelligence concurrentielle, feuilles de route de croissance.',
      'svc4.outcome': 'Des décisions appuyées sur la donnée, pas sur des impressions.',
      'svc5.name': 'L\'aperçu — offre signature', 'svc5.promise': 'Voyez votre site avant de le payer.',
      'svc5.desc': 'On construit une démo réelle et fonctionnelle de votre projet en amont. Vous arrivez en réunion, vous la voyez en direct, puis vous décidez.',
      'svc5.outcome': 'Une entrée sans risque.',
      'svc.outcomeLabel': 'Résultat',
      'work.kicker': '03 — Réalisations',
      'work.title': 'La preuve, <em>en direct.</em>',
      'proj1.cat': 'Santé · Next.js', 'proj1.desc': 'Une plateforme calme, prête à la prise de rendez-vous, qui donne à un petit cabinet une allure établie.',
      'proj2.cat': 'Voyage · Croissance', 'proj2.desc': 'Marque, funnel et stratégie de marché pour une agence de BBA dans la bataille des visas Schengen.',
      'proj3.cat': 'Industrie · Web', 'proj3.desc': 'Une présence statique nette, conçue pour convertir les demandes de devis.',
      'proj4.cat': 'Streaming · Commerce', 'proj4.desc': 'Une boutique de streaming avec paiement WhatsApp, pensée pour l\'acheteur algérien.',
      'proj5.cat': 'PWA · Supabase', 'proj5.desc': 'Une application web progressive offline-first, avec une vraie ingénierie en dessous.',
      'work.live': 'Démo →', 'work.code': 'Code', 'work.all': 'Voir tout le portfolio →',
      'how.kicker': '04 — Méthode',
      'how.title': 'Aucun <em>intermédiaire.</em>',
      'how1.h': 'Vous parlez au constructeur.', 'how1.p': 'Pas de chef de projet, pas de téléphone arabe. Celui qui cadre, c\'est celui qui livre.',
      'how2.h': 'Une équipe possède toute la chaîne.', 'how2.p': 'Design → code → déploiement. Rien ne se perd dans un transfert qui n\'a jamais lieu.',
      'how3.h': 'On répond quand ça casse.', 'how3.p': 'Délais tenus, réponse en moins de 24h. Après le lancement, toujours là.',
      'team.kicker': '05 — Équipe',
      'team.title': 'Votre avantage <em>injuste.</em>',
      'team.lead': 'Assez petits pour s\'investir. Assez seniors pour livrer.',
      'm1.role': 'Design & développement', 'm1.detail': 'Transforme le brief en build.',
      'm2.role': 'Spécialiste données', 'm2.detail': 'Pipelines, scraping, la couche intelligence.',
      'm3.role': 'Ventes & partenariats', 'm3.detail': 'Votre premier contact ; le traducteur entre l\'idée et le cadrage.',
      'm4.role': 'Représentant technique', 'm4.detail': 'Garde le build honnête et le client informé.',
      'stack.kicker': '06 — Stack',
      'stack.title': 'Le flex <em>discret.</em>',
      'contact.kicker': '07 — Contact',
      'contact.title': 'On <em>construit ?</em>',
      'contact.sub': 'Dites-nous ce que vous fabriquez. On répond en moins de 24 heures — en français, en anglais ou en arabe.',
      'contact.reassure': 'Réponse < 24h · Bordj Bou Arréridj · DZ',
      'form.name': 'Nom', 'form.namePh': 'Votre nom',
      'form.email': 'Email', 'form.emailPh': 'vous@entreprise.com',
      'form.message': 'Message', 'form.messagePh': 'Qu\'est-ce qu\'on construit ?',
      'form.send': 'Envoyer →',
      'form.errName': 'Ajoutez un nom pour qu\'on sache à qui parler.',
      'form.errEmail': 'Ajoutez un email pour qu\'on puisse répondre.',
      'form.errEmailValid': 'Cet email a l\'air incomplet — vérifiez-le.',
      'form.errMsg': 'Dites-nous une ligne sur le projet.',
      'form.success': 'Reçu. On revient vers vous sous 24h.',
      'footer.signoff': 'Construit à Bordj Bou Arréridj, avec du café noir et du TypeScript.',
      'footer.rights': '© 2026 Numidea Labs · Tous droits réservés',
      'footer.tag': 'Rooted in Numidia · built on ideas'
    },
    en: {
      dir: 'ltr',
      title: 'Numidea Labs — We build the software your business has been waiting for',
      'meta.desc': 'A development studio in Bordj Bou Arréridj. We design, build, ship and answer when it breaks. No middlemen.',
      'nav.about': 'About', 'nav.services': 'Services', 'nav.work': 'Work',
      'nav.team': 'Team', 'nav.contact': 'Contact', 'nav.cta': 'Let\'s talk →',
      'hero.eyebrow': 'Development studio · Bordj Bou Arréridj · DZ',
      'hero.title': 'We build the software your business has been <span class="swash">waiting</span> for.',
      'hero.lede': 'Four people. Design, code, data, and the one who actually picks up the phone. From the back-end to the pixel — and no one in between.',
      'hero.cta1': 'Let\'s talk →', 'hero.cta2': 'See the work',
      'ship.status': 'production',
      'proof.kicker': '01 — Proof',
      'proof.s1': 'projects shipped', 'proof.s2': 'specialists', 'proof.s3': 'languages', 'proof.s4': 'response',
      'proof.line': 'Real clients. Real deployments. The links are below — click them.',
      'svc.kicker': '02 — Services',
      'svc.title': 'What we <em>build.</em>',
      'svc1.name': 'Sites & applications', 'svc1.promise': 'The site that makes you the obvious choice.',
      'svc1.desc': 'Bespoke websites and web apps — fast, ranked, conversion-built, front-end to cloud.',
      'svc1.outcome': 'A presence that punches three weight classes above your competitors\'.',
      'svc2.name': 'Automation & data', 'svc2.promise': 'We delete the busywork you\'re paying humans to do.',
      'svc2.desc': 'Scrapers, lead pipelines, market-intelligence systems, internal tools, integrations. Python · Playwright · APIs.',
      'svc2.outcome': 'The boring, repetitive, error-prone work runs itself — quietly, at 3am.',
      'svc3.name': 'Brand & design systems', 'svc3.promise': 'A look people trust before they read a word.',
      'svc3.desc': 'Logos, visual identity, design systems, motion, the full kit.',
      'svc3.outcome': 'Consistency that makes a four-person studio look like a forty-person one.',
      'svc4.name': 'Strategy & consulting', 'svc4.promise': 'We did the homework on your sector before the call.',
      'svc4.desc': 'Market audits, funnel analysis, competitive intelligence, growth roadmaps.',
      'svc4.outcome': 'Decisions backed by data, not vibes.',
      'svc5.name': 'The preview — signature offer', 'svc5.promise': 'See your site before you pay for it.',
      'svc5.desc': 'We build a real, working demo of your project up front. Walk into the meeting, see it live, then decide.',
      'svc5.outcome': 'Zero-risk entry.',
      'svc.outcomeLabel': 'Outcome',
      'work.kicker': '03 — Selected work',
      'work.title': 'Proof, <em>live.</em>',
      'proj1.cat': 'Healthcare · Next.js', 'proj1.desc': 'A calm, booking-ready platform that makes a small practice feel established.',
      'proj2.cat': 'Travel · Growth', 'proj2.desc': 'Brand, funnel and market strategy for a BBA agency in the Schengen-visa fight.',
      'proj3.cat': 'Industrial · Web', 'proj3.desc': 'A sharp static presence engineered to convert quote requests.',
      'proj4.cat': 'Streaming · Commerce', 'proj4.desc': 'A streaming storefront with WhatsApp checkout, built for the Algerian buyer.',
      'proj5.cat': 'PWA · Supabase', 'proj5.desc': 'An offline-first progressive web app with real engineering underneath.',
      'work.live': 'Live demo →', 'work.code': 'Code', 'work.all': 'See the full portfolio →',
      'how.kicker': '04 — How we work',
      'how.title': 'No <em>middlemen.</em>',
      'how1.h': 'You talk to the builder.', 'how1.p': 'No account manager, no telephone game. Whoever scopes it, ships it.',
      'how2.h': 'One team owns the whole chain.', 'how2.p': 'Design → code → deploy. Nothing gets lost in a handoff that never happens.',
      'how3.h': 'We answer when it breaks.', 'how3.p': 'Deadlines kept, replies in under 24h. After launch, still here.',
      'team.kicker': '05 — Team',
      'team.title': 'Your unfair <em>advantage.</em>',
      'team.lead': 'Small enough to care. Senior enough to ship.',
      'm1.role': 'Design & development', 'm1.detail': 'Turns the brief into the build.',
      'm2.role': 'Data specialist', 'm2.detail': 'Pipelines, scraping, the intelligence layer.',
      'm3.role': 'Sales & partnerships', 'm3.detail': 'Your first call; translator between idea and scope.',
      'm4.role': 'Technical representative', 'm4.detail': 'Keeps the build honest and the client informed.',
      'stack.kicker': '06 — Stack',
      'stack.title': 'The quiet <em>flex.</em>',
      'contact.kicker': '07 — Contact',
      'contact.title': 'Let\'s build the <em>thing.</em>',
      'contact.sub': 'Tell us what you\'re making. We answer in under 24 hours — in French, English, or Arabic.',
      'contact.reassure': 'Response < 24h · Bordj Bou Arréridj · DZ',
      'form.name': 'Name', 'form.namePh': 'Your name',
      'form.email': 'Email', 'form.emailPh': 'you@company.com',
      'form.message': 'Message', 'form.messagePh': 'What are we building?',
      'form.send': 'Send →',
      'form.errName': 'Add a name so we know who we\'re talking to.',
      'form.errEmail': 'Add an email so we can reply.',
      'form.errEmailValid': 'That email looks incomplete — check it.',
      'form.errMsg': 'Give us one line about the project.',
      'form.success': 'Got it. We\'ll be back to you within 24h.',
      'footer.signoff': 'Built in Bordj Bou Arréridj, with black coffee and TypeScript.',
      'footer.rights': '© 2026 Numidea Labs · All rights reserved',
      'footer.tag': 'Rooted in Numidia · built on ideas'
    },
    ar: {
      dir: 'rtl',
      title: 'نوميديا لابز — نبني البرمجيات التي ينتظرها عملك',
      'meta.desc': 'استوديو تطوير في برج بوعريريج. نصمّم ونبرمج ونطلق ونردّ حين يتعطّل شيء. دون وسطاء.',
      'nav.about': 'من نحن', 'nav.services': 'الخدمات', 'nav.work': 'الأعمال',
      'nav.team': 'الفريق', 'nav.contact': 'تواصل', 'nav.cta': 'لنتحدّث →',
      'hero.eyebrow': 'استوديو تطوير · برج بوعريريج · الجزائر',
      'hero.title': 'نبني <span class="swash">البرمجيات</span> التي ينتظرها عملك.',
      'hero.lede': 'أربعة أشخاص. التصميم، الكود، البيانات، والشخص الذي يردّ على الهاتف فعلاً. من الخادم إلى آخر بكسل — ولا أحد بينهما.',
      'hero.cta1': 'لنتحدّث →', 'hero.cta2': 'شاهد الأعمال',
      'ship.status': 'الإنتاج',
      'proof.kicker': '٠١ — الإثبات',
      'proof.s1': 'مشروعاً مُسلَّماً', 'proof.s2': 'مختصّين', 'proof.s3': 'لغات', 'proof.s4': 'زمن الردّ',
      'proof.line': 'عملاء حقيقيون. عمليات نشر حقيقية. الروابط في الأسفل — اضغط عليها.',
      'svc.kicker': '٠٢ — الخدمات',
      'svc.title': 'ما الذي <em>نبنيه.</em>',
      'svc1.name': 'مواقع وتطبيقات', 'svc1.promise': 'الموقع الذي يجعلك الخيار البديهي.',
      'svc1.desc': 'مواقع وتطبيقات ويب مخصّصة — سريعة، مُحسّنة للبحث، مبنية للتحويل، من الواجهة إلى السحابة.',
      'svc1.outcome': 'حضورٌ يتفوّق على منافسيك بثلاث مراتب.',
      'svc2.name': 'الأتمتة والبيانات', 'svc2.promise': 'نحذف المهام المتكرّرة التي تدفع لبشر لإنجازها.',
      'svc2.desc': 'كاشطات، أنابيب عملاء محتملين، أنظمة استخبارات السوق، أدوات داخلية، تكاملات. بايثون · Playwright · واجهات برمجية.',
      'svc2.outcome': 'العمل الممل والمتكرّر يجري تلقائياً — بصمت، عند الثالثة فجراً.',
      'svc3.name': 'الهوية والتصميم', 'svc3.promise': 'مظهرٌ يثق به الناس قبل قراءة كلمة.',
      'svc3.desc': 'شعارات، هوية بصرية، أنظمة تصميم، حركة، الطقم الكامل.',
      'svc3.outcome': 'اتّساقٌ يجعل استوديو من أربعة يبدو كاستوديو من أربعين.',
      'svc4.name': 'الاستراتيجية والاستشارة', 'svc4.promise': 'أنجزنا الواجب عن قطاعك قبل المكالمة.',
      'svc4.desc': 'تدقيق السوق، تحليل القمع، الاستخبارات التنافسية، خرائط طريق النمو.',
      'svc4.outcome': 'قراراتٌ مدعومة بالبيانات، لا بالانطباعات.',
      'svc5.name': 'المعاينة — عرض مميّز', 'svc5.promise': 'شاهد موقعك قبل أن تدفع ثمنه.',
      'svc5.desc': 'نبني نسخة تجريبية حقيقية وعاملة من مشروعك مسبقاً. تدخل الاجتماع، تراها حيّة، ثم تقرّر.',
      'svc5.outcome': 'دخولٌ بلا مخاطرة.',
      'svc.outcomeLabel': 'النتيجة',
      'work.kicker': '٠٣ — أعمال مختارة',
      'work.title': 'الإثبات، <em>حيّاً.</em>',
      'proj1.cat': 'صحة · Next.js', 'proj1.desc': 'منصّة هادئة جاهزة للحجز تمنح عيادة صغيرة حضوراً راسخاً.',
      'proj2.cat': 'سفر · نموّ', 'proj2.desc': 'هوية وقمع واستراتيجية سوق لوكالة في برج بوعريريج وسط معركة تأشيرة شنغن.',
      'proj3.cat': 'صناعة · ويب', 'proj3.desc': 'حضور ثابت دقيق مُصمَّم لتحويل طلبات عروض الأسعار.',
      'proj4.cat': 'بث · تجارة', 'proj4.desc': 'متجر بثّ مع دفع عبر واتساب، مبنيٌّ للمشتري الجزائري.',
      'proj5.cat': 'PWA · Supabase', 'proj5.desc': 'تطبيق ويب تقدّمي يعمل دون اتصال، بهندسة حقيقية تحته.',
      'work.live': 'عرض حيّ →', 'work.code': 'الكود', 'work.all': 'شاهد كل الأعمال →',
      'how.kicker': '٠٤ — كيف نعمل',
      'how.title': 'بلا <em>وسطاء.</em>',
      'how1.h': 'تتحدّث إلى من يبني.', 'how1.p': 'لا مدير حساب، ولا هاتف مكسور. من يضع النطاق هو من يُسلّم.',
      'how2.h': 'فريق واحد يملك السلسلة كاملة.', 'how2.p': 'تصميم ← كود ← نشر. لا شيء يضيع في تسليم لا يحدث أبداً.',
      'how3.h': 'نردّ حين يتعطّل شيء.', 'how3.p': 'مواعيد محترمة، وردّ في أقل من ٢٤ ساعة. بعد الإطلاق، ما زلنا هنا.',
      'team.kicker': '٠٥ — الفريق',
      'team.title': 'ميزتك <em>غير العادلة.</em>',
      'team.lead': 'صغار بما يكفي للاهتمام. خبراء بما يكفي للتسليم.',
      'm1.role': 'تصميم وتطوير', 'm1.detail': 'يحوّل الموجز إلى منتج.',
      'm2.role': 'مختصّ بيانات', 'm2.detail': 'الأنابيب، الكشط، طبقة الذكاء.',
      'm3.role': 'مبيعات وشراكات', 'm3.detail': 'اتصالك الأول؛ المترجم بين الفكرة والنطاق.',
      'm4.role': 'ممثّل تقني', 'm4.detail': 'يبقي البناء صادقاً والعميل مُطّلعاً.',
      'stack.kicker': '٠٦ — التقنيات',
      'stack.title': 'التباهي <em>الهادئ.</em>',
      'contact.kicker': '٠٧ — تواصل',
      'contact.title': '<em>نبني؟</em>',
      'contact.sub': 'أخبرنا بما تصنعه. نردّ في أقل من ٢٤ ساعة — بالفرنسية أو الإنجليزية أو العربية.',
      'contact.reassure': 'ردّ < ٢٤ ساعة · برج بوعريريج · الجزائر',
      'form.name': 'الاسم', 'form.namePh': 'اسمك',
      'form.email': 'البريد', 'form.emailPh': 'you@company.com',
      'form.message': 'الرسالة', 'form.messagePh': 'ماذا سنبني؟',
      'form.send': 'إرسال →',
      'form.errName': 'أضف اسماً لنعرف بمن نتحدّث.',
      'form.errEmail': 'أضف بريداً لنتمكّن من الردّ.',
      'form.errEmailValid': 'يبدو هذا البريد ناقصاً — تحقّق منه.',
      'form.errMsg': 'أخبرنا بسطر عن المشروع.',
      'form.success': 'وصلتنا. سنعود إليك خلال ٢٤ ساعة.',
      'footer.signoff': 'بُني في برج بوعريريج، بقهوة سوداء و TypeScript.',
      'footer.rights': '© ٢٠٢٦ نوميديا لابز · كل الحقوق محفوظة',
      'footer.tag': 'جذورها في نوميديا · مبنيّة على الأفكار'
    }
  };

  var SUPPORTED = ['fr', 'en', 'ar'];
  var DEFAULT_LANG = 'fr';

  function applyLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;
    var dict = I18N[lang];
    var html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', dict.dir);
    document.title = dict.title;

    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', dict['meta.desc']);

    // text / inline-html content
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    // placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-ph');
      if (dict[key] != null) el.setAttribute('placeholder', dict[key]);
    });
    // aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      if (dict[key] != null) el.setAttribute('aria-label', dict[key]);
    });

    // language buttons pressed-state
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });

    try { localStorage.setItem('numidea-lang', lang); } catch (e) {}
  }

  /* ---------------- count-up ---------------- */
  function countUp(el) {
    if (el.getAttribute('data-counted') === '1') return;
    el.setAttribute('data-counted', '1');
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    if (reduceMotion) { el.textContent = prefix + target + suffix; return; }
    var dur = 1200, start = null;
    function frame(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(frame);
  }

  /* ---------------- DOM ready ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
    // restore language
    var saved = DEFAULT_LANG;
    try { saved = localStorage.getItem('numidea-lang') || DEFAULT_LANG; } catch (e) {}
    applyLang(saved);

    // language switch
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); });
    });

    // navbar scroll state + progress bar
    var navbar = document.querySelector('.navbar');
    var progress = document.querySelector('.progress');
    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      if (navbar) navbar.classList.toggle('scrolled', y > 24);
      if (progress) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // reveal-on-scroll + count-up via IntersectionObserver
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add('in');
          en.target.querySelectorAll('[data-count]').forEach(countUp);
          if (en.target.hasAttribute('data-count')) countUp(en.target);
          io.unobserve(en.target);
        });
      }, { threshold: 0.18 });
      document.querySelectorAll('.reveal, [data-count]').forEach(function (el) { io.observe(el); });
    } else {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      document.querySelectorAll('[data-count]').forEach(countUp);
    }

    // mobile menu
    var toggle = document.querySelector('.menu-toggle');
    var menu = document.querySelector('.mobile-menu');
    var closeBtn = menu ? menu.querySelector('.close') : null;
    function setMenu(open) {
      if (!menu) return;
      menu.classList.toggle('open', open);
      if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    if (toggle) toggle.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); });
    if (menu) menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

    // contact form — designed validation + success
    var form = document.querySelector('#contact-form');
    if (form) {
      var success = document.querySelector('.form-success');
      function field(id) { return form.querySelector('[name="' + id + '"]').closest('.field'); }
      function err(id, key) {
        var f = field(id);
        var dict = I18N[document.documentElement.getAttribute('lang')] || I18N[DEFAULT_LANG];
        f.classList.add('invalid');
        f.querySelector('.err').textContent = key ? dict[key] : '';
      }
      function clear(id) {
        var f = field(id);
        f.classList.remove('invalid');
        f.querySelector('.err').textContent = '';
      }
      ['name', 'email', 'message'].forEach(function (id) {
        form.querySelector('[name="' + id + '"]').addEventListener('input', function () { clear(id); });
      });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;
        var name = form.querySelector('[name="name"]').value.trim();
        var email = form.querySelector('[name="email"]').value.trim();
        var msg = form.querySelector('[name="message"]').value.trim();
        if (!name) { err('name', 'form.errName'); ok = false; }
        if (!email) { err('email', 'form.errEmail'); ok = false; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err('email', 'form.errEmailValid'); ok = false; }
        if (!msg) { err('message', 'form.errMsg'); ok = false; }
        if (!ok) return;
        // front-end demo: swap form for the designed success state
        form.style.display = 'none';
        if (success) success.classList.add('show');
      });
    }
  });
})();
