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
      'nav.team': 'Équipe', 'nav.faq': 'FAQ', 'nav.contact': 'Contact',
      'hero.eyebrow': 'Atelier d\'ingénierie · Bordj Bou Arréridj · DZ',
      'hero.title': 'On construit. On livre. <span class="swash">On répond.</span>',
      'hero.lede': 'Sites, applications, pipelines de données. Conçus et codés ici, à Bordj Bou Arréridj. Cinq sont en ligne. Réponse sous 24 heures.',
      'hero.cta1': 'Démarrer un projet', 'hero.cta2': 'Voir le travail',
      'hero.deckTag': '5 sites clients en ligne — les voir →',
      'proof.kicker': '01 — Preuves',
      'proof.s1': 'projets livrés', 'proof.s2': 'spécialistes', 'proof.s3': 'langues', 'proof.s4': 'de réponse',
      'proof.line': 'Cinq sites en ligne. Cliquables. Vérifiez.',
      'svc.kicker': '03 — Services',
      'svc.title': 'Ce qu\'on <em>construit.</em>',
      'svc.outcomeLabel': 'Résultat',
      'work.kicker': '02 — Réalisations',
      'work.title': 'La preuve, <em>en direct.</em>',
      'proj1.cat': 'Santé · Next.js', 'proj1.desc': 'Une plateforme calme, prête à la prise de rendez-vous, qui donne à un petit cabinet une allure établie.',
      'proj2.cat': 'Voyage · Croissance', 'proj2.desc': 'Marque, funnel et stratégie de marché pour une agence de BBA dans la bataille des visas Schengen.',
      'proj3.cat': 'Industrie · Web', 'proj3.desc': 'Une présence statique nette, conçue pour convertir les demandes de devis.',
      'proj4.cat': 'Industrie · B2B', 'proj4.desc': 'Site corporate B2B pour Bordj Steel SPA, leader de la construction métallique en Algérie — catalogue produits, références et espace recrutement.',
      'proj5.cat': 'PWA · Supabase', 'proj5.desc': 'Une application web progressive offline-first, avec une vraie ingénierie en dessous.',
      'proj6.cat': 'Voyage · Omra', 'proj6.desc': 'Une vitrine bilingue pour des voyages organisés et l\'Omra au départ de Constantine.',
      'proj7.cat': 'Commerce · Gaming', 'proj7.desc': 'Une boutique de matériel gaming au branding affûté, pensée pour la conversion.',
      'work.lead': 'Des sites réels, en ligne, qu\'on peut cliquer — pas des maquettes.',
      'work.live': 'Démo →', 'work.soon': 'Bientôt', 'work.all': 'Voir tout le portfolio →',
      'how.kicker': '04 — Méthode',
      'how.title': 'Aucun <em>intermédiaire.</em>',
      'how1.h': 'Vous parlez au constructeur.', 'how1.p': 'Pas de chef de projet, pas de téléphone arabe. Celui qui cadre, c\'est celui qui livre.',
      'how2.h': 'Une équipe possède toute la chaîne.', 'how2.p': 'Design → code → déploiement. Rien ne se perd dans un transfert qui n\'a jamais lieu.',
      'how3.h': 'On répond quand ça casse.', 'how3.p': 'Délais tenus, réponse en moins de 24h. Après le lancement, toujours là.',
      'scene.kicker': '◆ PLAN D\'ATELIER · PLANCHE PAR PLANCHE', 'scene.title': 'Les projets, comme un plan.',
      'scene.lead': 'Chaque projet dessiné comme une planche d\'ingénierie : cotes, statuts honnêtes, et le site en vrai.',
      'scene.cta': 'Ouvrir les planches →',
      'founder.kicker': '05 — Équipe & fondateur', 'founder.title': 'Un nom. <em>Un visage.</em>',
      'founder.lead': 'Le fondateur conçoit, code et livre. Vous lui parlez directement.',
      'founder.role': 'Designer & développeur · Fondateur', 'founder.years': '6 ans',
      'founder.bio': 'Six ans. Identités, interfaces, produits livrés. De la marque au front-end au cloud. Le brief devient le build. Je reste quand c\'est en ligne.',
      'founder.cvBtn': 'Ouvrir le parcours', 'founder.cvClose': 'Fermer le parcours', 'founder.portfolio': 'Portfolio personnel',
      'founder.expLabel': 'Parcours', 'founder.skillsLabel': 'Compétences', 'founder.eduLabel': 'Formation',
      'founder.skills': 'Design & identité. Web & front-end. Stratégie & contenu. Production ~20 % plus rapide avec l\'IA.',
      'founder.edu': 'Informatique — Université Mohamed El Bachir El Ibrahimi · 2018–2024',
      'founder.download': 'CV (PDF)',
      'founder.teamRow': 'Équipe : <b>D</b> données & pipelines · <b>S</b> ventes & partenariats · <b>T</b> représentant technique',
      'fx1': 'Graphiste', 'fx2': 'Designer freelance', 'fx3': 'Web & social', 'fx4': 'Identité & web', 'fx5': 'Contenu & vidéo',
      'stack.kicker': '06 — Stack',
      'stack.title': 'Le flex <em>discret.</em>',
      'faq.kicker': '07 — FAQ', 'faq.title': 'Questions. <em>Réponses.</em>',
      'faq.lead': 'Demandé avant chaque projet. Répondu sans détour.',
      'faq1.q': 'Combien de temps pour livrer ?', 'faq1.a': 'La plupart des sites : quelques semaines. Le délai est ferme dès le cadrage. On ne le déplace pas.',
      'faq2.q': 'C\'est combien ?', 'faq2.a': 'Prix fixe, au projet. Chiffré une fois le périmètre clair. Aucun frais surprise. Souvent la démo arrive avant le devis.',
      'faq3.q': 'Vous travaillez en quelles langues ?', 'faq3.a': 'Français, arabe, anglais. À l\'oral, à l\'écrit, dans le produit. Ce site est trilingue. L\'arabe est en RTL natif.',
      'faq4.q': 'Et après le lancement ?', 'faq4.a': 'On reste. On maintient ce qu\'on livre. Réponse sous 24 heures quand ça casse.',
      'faq5.q': 'Travaillez-vous à distance ?', 'faq5.a': 'Oui. Basés à Bordj Bou Arréridj. On livre partout, France comprise. Vous parlez au constructeur, pas à un relais.',
      'faq6.q': 'Qu\'est-ce qui vous différencie d\'une agence ?', 'faq6.a': 'Pas d\'intermédiaire. Qui cadre le projet le code et le livre. Une équipe, du design au déploiement.',
      'contact.kicker': '08 — Contact',
      'contact.title': 'On le <em>rend réel ?</em>',
      'contact.sub': 'Dites-nous ce que vous cherchez à concrétiser — l\'urgent, le cassé, l\'échéance. On répond en moins de 24 heures, en français, anglais ou arabe.',
      'contact.chStudio': 'Studio', 'contact.chReply': 'Réponse',
      'contact.vStudio': 'Bordj Bou Arréridj · Algérie', 'contact.vReply': '< 24 heures · FR · EN · ع',
      'form.name': 'Nom', 'form.namePh': 'Votre nom',
      'form.email': 'Email', 'form.emailPh': 'vous@entreprise.com',
      'form.message': 'Message', 'form.messagePh': 'Qu\'est-ce qu\'on construit ?',
      'form.send': 'Démarrer un projet →',
      'form.errName': 'Ajoutez un nom pour qu\'on sache à qui parler.',
      'form.errEmail': 'Ajoutez un email pour qu\'on puisse répondre.',
      'form.errEmailValid': 'Cet email a l\'air incomplet — vérifiez-le.',
      'form.errMsg': 'Dites-nous une ligne sur le projet.',
      'form.success': 'Votre email est prêt dans votre messagerie — envoyez-le et on revient sous 24h.',
      'footer.signoff': 'Construit en lots. Jamais en série.',
      'footer.rights': '© 2026 Numidea Labs · Tous droits réservés',
      'footer.tag': 'Rooted in Numidia · built on ideas'
    },
    en: {
      dir: 'ltr',
      title: 'Numidea Labs — We build the software your business has been waiting for',
      'meta.desc': 'A development studio in Bordj Bou Arréridj. We design, build, ship and answer when it breaks. No middlemen.',
      'nav.about': 'About', 'nav.services': 'Services', 'nav.work': 'Work',
      'nav.team': 'Team', 'nav.faq': 'FAQ', 'nav.contact': 'Contact',
      'hero.eyebrow': 'Engineering workshop · Bordj Bou Arréridj · DZ',
      'hero.title': 'We build. We ship. <span class="swash">We answer.</span>',
      'hero.lede': 'Sites, applications, data pipelines. Designed and coded here, in Bordj Bou Arréridj. Five are live. Reply under 24 hours.',
      'hero.cta1': 'Start a project', 'hero.cta2': 'See the work',
      'hero.deckTag': '5 client sites live — see them →',
      'proof.kicker': '01 — Proof',
      'proof.s1': 'projects shipped', 'proof.s2': 'specialists', 'proof.s3': 'languages', 'proof.s4': 'response',
      'proof.line': 'Five sites live. Clickable. Check them.',
      'svc.kicker': '03 — Services',
      'svc.title': 'What we <em>build.</em>',
      'svc.outcomeLabel': 'Outcome',
      'work.kicker': '02 — Selected work',
      'work.title': 'Proof, <em>live.</em>',
      'proj1.cat': 'Healthcare · Next.js', 'proj1.desc': 'A calm, booking-ready platform that makes a small practice feel established.',
      'proj2.cat': 'Travel · Growth', 'proj2.desc': 'Brand, funnel and market strategy for a BBA agency in the Schengen-visa fight.',
      'proj3.cat': 'Industrial · Web', 'proj3.desc': 'A sharp static presence engineered to convert quote requests.',
      'proj4.cat': 'Industrial · B2B', 'proj4.desc': 'The B2B corporate site for Bordj Steel SPA, Algeria\'s structural-steel leader — product catalogue, references and a careers space.',
      'proj5.cat': 'PWA · Supabase', 'proj5.desc': 'An offline-first progressive web app with real engineering underneath.',
      'proj6.cat': 'Travel · Umrah', 'proj6.desc': 'A bilingual storefront for organized trips and Umrah departing from Constantine.',
      'proj7.cat': 'Commerce · Gaming', 'proj7.desc': 'A sharp-branded gaming-gear store, built to convert.',
      'work.lead': 'Real sites, live and clickable — not mockups.',
      'work.live': 'Live demo →', 'work.soon': 'Soon', 'work.all': 'See the full portfolio →',
      'how.kicker': '04 — How we work',
      'how.title': 'No <em>middlemen.</em>',
      'how1.h': 'You talk to the builder.', 'how1.p': 'No account manager, no telephone game. Whoever scopes it, ships it.',
      'how2.h': 'One team owns the whole chain.', 'how2.p': 'Design → code → deploy. Nothing gets lost in a handoff that never happens.',
      'how3.h': 'We answer when it breaks.', 'how3.p': 'Deadlines kept, replies in under 24h. After launch, still here.',
      'scene.kicker': '◆ ATELIER DRAWING · SHEET BY SHEET', 'scene.title': 'The work, as a drawing.',
      'scene.lead': 'Every project drawn as an engineering sheet: dimensions, honest statuses, and the real site.',
      'scene.cta': 'Open the sheets →',
      'founder.kicker': '05 — Team & founder', 'founder.title': 'One name. <em>One face.</em>',
      'founder.lead': 'The founder designs, codes and ships. You talk to him directly.',
      'founder.role': 'Designer & developer · Founder', 'founder.years': '6 yrs',
      'founder.bio': 'Six years. Identities, interfaces, shipped products. Brand to front-end to cloud. The brief becomes the build. I stay once it is live.',
      'founder.cvBtn': 'Open the record', 'founder.cvClose': 'Close the record', 'founder.portfolio': 'Personal portfolio',
      'founder.expLabel': 'Experience', 'founder.skillsLabel': 'Skills', 'founder.eduLabel': 'Education',
      'founder.skills': 'Design & identity. Web & front-end. Strategy & content. Production ~20% faster with AI.',
      'founder.edu': 'Computer Science — Univ. Mohamed El Bachir El Ibrahimi · 2018–2024',
      'founder.download': 'Résumé (PDF)',
      'founder.teamRow': 'Team: <b>D</b> data & pipelines · <b>S</b> sales & partnerships · <b>T</b> technical rep',
      'fx1': 'Graphic Designer', 'fx2': 'Freelance Designer', 'fx3': 'Web & social', 'fx4': 'Identity & web', 'fx5': 'Content & video',
      'stack.kicker': '06 — Stack',
      'stack.title': 'The quiet <em>flex.</em>',
      'faq.kicker': '07 — FAQ', 'faq.title': 'Questions. <em>Answers.</em>',
      'faq.lead': 'Asked before every project. Answered straight.',
      'faq1.q': 'How long does it take to ship?', 'faq1.a': 'Most sites: a few weeks. The date is fixed at scoping. We do not move it.',
      'faq2.q': 'What does it cost?', 'faq2.a': 'Fixed price, per project. Quoted once the scope is clear. No surprise fees. Often the demo lands before the quote.',
      'faq3.q': 'What languages do you work in?', 'faq3.a': 'French, Arabic, English. Spoken, written, in the product. This site is trilingual. The Arabic is native RTL.',
      'faq4.q': 'What happens after launch?', 'faq4.a': 'We stay. We maintain what we ship. Reply under 24 hours when it breaks.',
      'faq5.q': 'Do you work remotely?', 'faq5.a': 'Yes. Based in Bordj Bou Arréridj. We ship anywhere, France included. You talk to the builder, not a relay.',
      'faq6.q': 'How are you different from an agency?', 'faq6.a': 'No middleman. Whoever scopes it codes it and ships it. One team, design to deploy.',
      'contact.kicker': '08 — Contact',
      'contact.title': 'Let\'s make it <em>real.</em>',
      'contact.sub': 'Tell us what you\'re trying to make real — what\'s urgent, what\'s broken, what\'s due. We reply in under 24 hours, in French, English, or Arabic.',
      'contact.chStudio': 'Studio', 'contact.chReply': 'Reply',
      'contact.vStudio': 'Bordj Bou Arréridj · Algeria', 'contact.vReply': '< 24 hours · FR · EN · AR',
      'form.name': 'Name', 'form.namePh': 'Your name',
      'form.email': 'Email', 'form.emailPh': 'you@company.com',
      'form.message': 'Message', 'form.messagePh': 'What are we building?',
      'form.send': 'Start a project →',
      'form.errName': 'Add a name so we know who we\'re talking to.',
      'form.errEmail': 'Add an email so we can reply.',
      'form.errEmailValid': 'That email looks incomplete — check it.',
      'form.errMsg': 'Give us one line about the project.',
      'form.success': 'Your email is ready in your mail app — hit send and we\'ll reply within 24h.',
      'footer.signoff': 'Made in batches. Never in bulk.',
      'footer.rights': '© 2026 Numidea Labs · All rights reserved',
      'footer.tag': 'Rooted in Numidia · built on ideas'
    },
    ar: {
      dir: 'rtl',
      title: 'نوميديا لابز — نبني البرمجيات التي ينتظرها عملك',
      'meta.desc': 'استوديو تطوير في برج بوعريريج. نصمّم ونبرمج ونطلق ونردّ حين يتعطّل شيء. دون وسطاء.',
      'nav.about': 'من نحن', 'nav.services': 'الخدمات', 'nav.work': 'الأعمال',
      'nav.team': 'الفريق', 'nav.faq': 'الأسئلة', 'nav.contact': 'تواصل',
      'hero.eyebrow': 'ورشة هندسة · برج بوعريريج · الجزائر',
      'hero.title': 'نبني. نُطلق. <span class="swash">ونردّ.</span>',
      'hero.lede': 'مواقع، تطبيقات، أنابيب بيانات. مصمّمة ومبرمَجة هنا، في برج بوعريريج. خمسة منها مباشرة. ردّ في أقل من ٢٤ ساعة.',
      'hero.cta1': 'ابدأ مشروعاً', 'hero.cta2': 'شاهد الأعمال',
      'hero.deckTag': '٥ مواقع عملاء مباشرة — شاهدها →',
      'proof.kicker': '٠١ — الإثبات',
      'proof.s1': 'مشروعاً مُسلَّماً', 'proof.s2': 'مختصّين', 'proof.s3': 'لغات', 'proof.s4': 'زمن الردّ',
      'proof.line': 'خمسة مواقع مباشرة. قابلة للنقر. تحقّق.',
      'svc.kicker': '٠٣ — الخدمات',
      'svc.title': 'ما <em>نبنيه.</em>',
      'svc.outcomeLabel': 'النتيجة',
      'work.kicker': '٠٢ — أعمال مختارة',
      'work.title': 'الإثبات، <em>حيّاً.</em>',
      'proj1.cat': 'صحة · Next.js', 'proj1.desc': 'منصّة هادئة جاهزة للحجز تمنح عيادة صغيرة حضوراً راسخاً.',
      'proj2.cat': 'سفر · نموّ', 'proj2.desc': 'هوية وقمع واستراتيجية سوق لوكالة في برج بوعريريج وسط معركة تأشيرة شنغن.',
      'proj3.cat': 'صناعة · ويب', 'proj3.desc': 'حضور ثابت دقيق مُصمَّم لتحويل طلبات عروض الأسعار.',
      'proj4.cat': 'صناعة · B2B', 'proj4.desc': 'الموقع المؤسسي B2B لـ Bordj Steel SPA، رائدة الإنشاءات المعدنية في الجزائر — كتالوج المنتجات والمراجع وفضاء التوظيف.',
      'proj5.cat': 'PWA · Supabase', 'proj5.desc': 'تطبيق ويب تقدّمي يعمل دون اتصال، بهندسة حقيقية تحته.',
      'proj6.cat': 'سفر · عمرة', 'proj6.desc': 'واجهة ثنائية اللغة لرحلات منظَّمة والعمرة انطلاقاً من قسنطينة.',
      'proj7.cat': 'تجارة · ألعاب', 'proj7.desc': 'متجر لعتاد الألعاب بهوية حادّة، مبنيٌّ للتحويل.',
      'work.lead': 'مواقع حقيقية، منشورة وقابلة للنقر — لا نماذج.',
      'work.live': 'عرض حيّ →', 'work.soon': 'قريباً', 'work.all': 'شاهد كل الأعمال →',
      'how.kicker': '٠٤ — كيف نعمل',
      'how.title': 'بلا <em>وسطاء.</em>',
      'how1.h': 'تتحدّث إلى من يبني.', 'how1.p': 'لا مدير حساب، ولا هاتف مكسور. من يضع النطاق هو من يُسلّم.',
      'how2.h': 'فريق واحد يملك السلسلة كاملة.', 'how2.p': 'تصميم ← كود ← نشر. لا شيء يضيع في تسليم لا يحدث أبداً.',
      'how3.h': 'نردّ حين يتعطّل شيء.', 'how3.p': 'مواعيد محترمة، وردّ في أقل من ٢٤ ساعة. بعد الإطلاق، ما زلنا هنا.',
      'scene.kicker': '◆ مخطط الورشة · لوحةً بلوحة', 'scene.title': 'الأعمال، كمخطط.',
      'scene.lead': 'كل مشروع مرسوم كلوحة هندسية: أبعاد، وحالات صادقة، والموقع الحقيقي.',
      'scene.cta': 'افتح اللوحات →',
      'founder.kicker': '٠٥ — الفريق والمؤسّس', 'founder.title': 'اسم واحد. <em>ووجه واحد.</em>',
      'founder.lead': 'المؤسّس يصمّم ويبرمج ويُسلّم. تتحدّث إليه مباشرة.',
      'founder.role': 'مصمّم ومطوّر · المؤسّس', 'founder.years': '٦ سنوات',
      'founder.bio': 'ستّ سنوات. هويّات، واجهات، منتجات مُسلَّمة. من العلامة إلى الواجهة إلى السحابة. الفكرة تصير منتجاً. وأبقى بعد الإطلاق.',
      'founder.cvBtn': 'افتح المسار', 'founder.cvClose': 'أغلق المسار', 'founder.portfolio': 'المعرض الشخصي',
      'founder.expLabel': 'المسار', 'founder.skillsLabel': 'المهارات', 'founder.eduLabel': 'التعليم',
      'founder.skills': 'تصميم وهويّة. ويب وواجهات. استراتيجية ومحتوى. إنتاج أسرع بنحو ٢٠٪ بالذكاء الاصطناعي.',
      'founder.edu': 'علوم الحاسوب — جامعة محمد البشير الإبراهيمي · ٢٠١٨–٢٠٢٤',
      'founder.download': 'السيرة (PDF)',
      'founder.teamRow': 'الفريق: <b>D</b> بيانات وأنابيب · <b>S</b> مبيعات وشراكات · <b>T</b> ممثّل تقني',
      'fx1': 'مصمّم غرافيك', 'fx2': 'مصمّم مستقل', 'fx3': 'ويب واجتماعي', 'fx4': 'هويّة وويب', 'fx5': 'محتوى وفيديو',
      'stack.kicker': '٠٦ — التقنيات',
      'stack.title': 'التباهي <em>الهادئ.</em>',
      'faq.kicker': '٠٧ — الأسئلة', 'faq.title': 'أسئلة. <em>أجوبة.</em>',
      'faq.lead': 'يُسأل قبل كل مشروع. ويُجاب دون لفّ.',
      'faq1.q': 'كم يستغرق الإنجاز؟', 'faq1.a': 'معظم المواقع: بضعة أسابيع. الموعد يُثبَّت عند تحديد النطاق. ولا نحرّكه.',
      'faq2.q': 'كم التكلفة؟', 'faq2.a': 'سعر ثابت، حسب المشروع. يُحدَّد بعد وضوح النطاق. لا رسوم مفاجئة. وغالباً تصل النسخة التجريبية قبل عرض السعر.',
      'faq3.q': 'بأي لغات تعملون؟', 'faq3.a': 'الفرنسية والعربية والإنجليزية. حديثاً وكتابةً وفي المنتَج. هذا الموقع ثلاثي اللغات. والعربية RTL أصلية.',
      'faq4.q': 'وماذا بعد الإطلاق؟', 'faq4.a': 'نبقى. نصون ما نُسلّمه. وردّ في أقل من ٢٤ ساعة حين يتعطّل شيء.',
      'faq5.q': 'هل تعملون عن بُعد؟', 'faq5.a': 'نعم. مقرّنا برج بوعريريج. نُسلّم في كل مكان، وفرنسا ضمنها. تتحدّث إلى من يبني، لا إلى وسيط.',
      'faq6.q': 'ما الذي يميّزكم عن وكالة؟', 'faq6.a': 'لا وسيط. من يحدّد النطاق يبرمجه ويُسلّمه. فريق واحد، من التصميم إلى النشر.',
      'contact.kicker': '٠٨ — تواصل',
      'contact.title': '<em>نجعله حقيقة؟</em>',
      'contact.sub': 'أخبرنا بما تسعى إلى تحقيقه — العاجل، المتعطّل، المستحقّ. نردّ في أقل من ٢٤ ساعة، بالفرنسية أو الإنجليزية أو العربية.',
      'contact.chStudio': 'الاستوديو', 'contact.chReply': 'الردّ',
      'contact.vStudio': 'برج بوعريريج · الجزائر', 'contact.vReply': 'أقل من ٢٤ ساعة · FR · EN · ع',
      'form.name': 'الاسم', 'form.namePh': 'اسمك',
      'form.email': 'البريد', 'form.emailPh': 'you@company.com',
      'form.message': 'الرسالة', 'form.messagePh': 'ماذا سنبني؟',
      'form.send': 'ابدأ مشروعاً →',
      'form.errName': 'أضف اسماً لنعرف بمن نتحدّث.',
      'form.errEmail': 'أضف بريداً لنتمكّن من الردّ.',
      'form.errEmailValid': 'يبدو هذا البريد ناقصاً — تحقّق منه.',
      'form.errMsg': 'أخبرنا بسطر عن المشروع.',
      'form.success': 'بريدك جاهز في تطبيق البريد — أرسله وسنعود إليك خلال ٢٤ ساعة.',
      'footer.signoff': 'يُبنى على دفعات. لا بالجملة.',
      'footer.rights': '© ٢٠٢٦ نوميديا لابز · كل الحقوق محفوظة',
      'footer.tag': 'جذورها في نوميديا · مبنيّة على الأفكار'
    }
  };

  /* ---- Services Catalog + Trust strip strings (merged into I18N) ---- */
  var EXTRA = {
    fr: {
      'svc.lead': 'Cinq offres. Cinq capacités de plus en dessous.',
      'svc.flagship': '★ Flagship',
      'prev.tag': 'Offre signature', 'prev.name': "L'Aperçu", 'prev.promise': 'Zéro risque. Juste la preuve.',
      'prev.brief': 'On construit une démo qui tourne. Avant le devis. Vous la voyez en direct, puis vous décidez.',
      'prev.outcome': 'Vous avez déjà vu le produit. Le reste est une formalité.',
      'f1.name': 'Sites & applications web', 'f1.promise': 'Rapide, référencé, fait pour vendre.',
      'f1.brief': 'React, Next.js, Vite, Tailwind. Déployé sur Vercel. Pas de template thémé. Un design system fin. Chaque token à nous.',
      'f2.name': 'Identité & systèmes visuels', 'f2.promise': 'La confiance avant le premier mot.',
      'f2.brief': 'Logo, couleur, typo, motion. Tokens primitifs, sémantiques, composants — documentés. Un studio de quatre qui pèse quarante.',
      'f3.name': 'Automatisation & pipelines', 'f3.promise': 'Supprimez la corvée.',
      'f3.brief': 'Scrapers, pipelines, moteurs de leads, outils internes. Le travail répétitif tourne seul à 3h du matin. Python, Playwright, APIs, Claude.',
      'f4.name': 'Intelligence marché & produit', 'f4.promise': 'Le marché, en chiffres.',
      'f4.brief': 'Maps, Facebook, Ouedkniss, Jumia, Instagram. Concurrents, prix, produits, leads — structurés, scorés, requêtables. 54 leads enrichis au dernier run.',
      'f5.name': 'Stratégie & conseil croissance', 'f5.promise': 'De la donnée, pas des impressions.',
      'f5.brief': 'Audits, funnels, positionnement, feuilles de route. Par phases, ROI d\'abord. 544 634 demandes analysées pour le dossier Schengen.',
      'cap.summary': 'Cinq capacités de plus', 'cap.hint': 'Pour qui creuse.',
      'c1.name': 'Boutique & réservation', 'c1.promise': 'De la visite au paiement.',
      'c1.brief': 'Paiement WhatsApp, flux cash, Shopify headless si pertinent. Réglé sur l\'achat local.', 'c1.fam': 'Le Build',
      'c2.name': 'Design graphique & social', 'c2.promise': 'On scroll, on s\'arrête.',
      'c2.brief': 'Carrousels, infographies, print, packs social. Un seul système verrouillé. Tout se ressemble.', 'c2.fam': 'Le Build',
      'c3.name': 'Data science & analytics', 'c3.promise': 'Du signal dans le bruit.',
      'c3.brief': 'Modélisation économétrique, séries temporelles, prévision, dashboards. Testé, diagnostiqué, défendable.', 'c3.fam': "L'Engine",
      'c4.name': 'Systèmes de connaissance', 'c4.promise': 'Une entreprise qui se souvient.',
      'c4.brief': 'Obsidian/PARA, Zettelkasten, documentation, bases prêtes pour le RAG. Des structures qui tiennent seules.', 'c4.fam': "L'Esprit",
      'c5.name': 'Outils & skills IA sur mesure', 'c5.promise': 'Le logiciel qui construit votre logiciel.',
      'c5.brief': 'Outils internes, générateurs, skills Claude. Une tâche répétitive devient une usine.', 'c5.fam': "L'Esprit",
      'portfolio.kicker': 'Portfolio', 'portfolio.title': 'Tout le <em>travail.</em>',
      'portfolio.close': 'Fermer', 'portfolio.searchLabel': 'Rechercher un projet', 'portfolio.searchPh': 'Rechercher…',
      'portfolio.all': 'Tout', 'portfolio.empty': 'Aucun projet ne correspond — essayez un autre terme.',
      'portfolio.projects': 'projets', 'portfolio.view': 'Détails', 'portfolio.back': 'Tous les projets',
      'portfolio.prev': 'Précédent', 'portfolio.next': 'Suivant',
      'detail.visit': 'Voir le site en direct →', 'detail.soon': 'Bientôt en ligne',
      'detail.problem': 'Le défi', 'detail.approach': 'L\'approche', 'detail.outcome': 'Le résultat',
      'cat.health': 'Santé', 'cat.travel': 'Voyage', 'cat.industrial': 'Industrie', 'cat.commerce': 'Commerce', 'cat.pwa': 'PWA'
    },
    en: {
      'svc.lead': 'Five offers. Five more capabilities underneath.',
      'svc.flagship': '★ Flagship',
      'prev.tag': 'Signature offer', 'prev.name': 'The Preview', 'prev.promise': 'Zero risk. Just proof.',
      'prev.brief': 'We build a demo that runs. Before the quote. You watch it live, then you decide.',
      'prev.outcome': 'You have already seen the product. The rest is paperwork.',
      'f1.name': 'Sites & web applications', 'f1.promise': 'Fast, ranked, built to sell.',
      'f1.brief': 'React, Next.js, Vite, Tailwind. Deployed on Vercel. No themed template. A thin design system. Every token ours.',
      'f2.name': 'Branding & visual systems', 'f2.promise': 'Trust before a word is read.',
      'f2.brief': 'Logo, colour, type, motion. Primitive, semantic, component tokens — documented. A four-person studio that reads as forty.',
      'f3.name': 'Automation & pipelines', 'f3.promise': 'Delete the busywork.',
      'f3.brief': 'Scrapers, pipelines, lead engines, internal tools. The repetitive work runs itself at 3am. Python, Playwright, APIs, Claude.',
      'f4.name': 'Market & product intelligence', 'f4.promise': 'The market, in numbers.',
      'f4.brief': 'Maps, Facebook, Ouedkniss, Jumia, Instagram. Competitors, prices, products, leads — structured, scored, queryable. 54 leads enriched on the last run.',
      'f5.name': 'Strategy & growth consulting', 'f5.promise': 'Data, not vibes.',
      'f5.brief': 'Audits, funnels, positioning, roadmaps. Phased, ROI first. 544,634 applications analysed for the Schengen file.',
      'cap.summary': 'Five more capabilities', 'cap.hint': 'For whoever digs.',
      'c1.name': 'E-commerce & booking', 'c1.promise': 'From browse to paid.',
      'c1.brief': 'WhatsApp checkout, cash flows, headless Shopify when it fits. Tuned to how people buy here.', 'c1.fam': 'The Build',
      'c2.name': 'Graphic & social design', 'c2.promise': 'Scroll-stopping, on brand.',
      'c2.brief': 'Carousels, infographics, print, social packs. One locked system. Everything matches.', 'c2.fam': 'The Build',
      'c3.name': 'Data science & analytics', 'c3.promise': 'Signal out of noise.',
      'c3.brief': 'Econometric modelling, time-series, forecasting, dashboards. Tested, diagnosed, defensible.', 'c3.fam': 'The Engine',
      'c4.name': 'Knowledge systems', 'c4.promise': 'A company that remembers.',
      'c4.brief': 'Obsidian/PARA, Zettelkasten, documentation, RAG-ready bases. Structures that hold themselves up.', 'c4.fam': 'The Mind',
      'c5.name': 'Custom AI tools & skills', 'c5.promise': 'Software that builds your software.',
      'c5.brief': 'Internal tools, generators, Claude skills. A repeatable task becomes a factory.', 'c5.fam': 'The Mind',
      'portfolio.kicker': 'Portfolio', 'portfolio.title': 'All the <em>work.</em>',
      'portfolio.close': 'Close', 'portfolio.searchLabel': 'Search projects', 'portfolio.searchPh': 'Search…',
      'portfolio.all': 'All', 'portfolio.empty': 'No project matches — try another term.',
      'portfolio.projects': 'projects', 'portfolio.view': 'Details', 'portfolio.back': 'All projects',
      'portfolio.prev': 'Previous', 'portfolio.next': 'Next',
      'detail.visit': 'Visit the live site →', 'detail.soon': 'Coming soon',
      'detail.problem': 'The challenge', 'detail.approach': 'The approach', 'detail.outcome': 'The outcome',
      'cat.health': 'Healthcare', 'cat.travel': 'Travel', 'cat.industrial': 'Industrial', 'cat.commerce': 'Commerce', 'cat.pwa': 'PWA'
    },
    ar: {
      'svc.lead': 'خمسة عروض. وخمس قدرات أخرى تحتها.',
      'svc.flagship': '★ الرائد',
      'prev.tag': 'عرض مميّز', 'prev.name': 'المعاينة', 'prev.promise': 'بلا مخاطرة. مجرّد إثبات.',
      'prev.brief': 'نبني نسخة تجريبية تعمل. قبل عرض السعر. تراها مباشرة، ثم تقرّر.',
      'prev.outcome': 'رأيت المنتج بالفعل. الباقي إجراءات.',
      'f1.name': 'مواقع وتطبيقات ويب', 'f1.promise': 'سريع، مُفهرَس، مبنيّ للبيع.',
      'f1.brief': 'React وNext.js وVite وTailwind. منشور على Vercel. لا قالب جاهز. نظام تصميم رفيع. وكل token لنا.',
      'f2.name': 'الهوية والأنظمة البصرية', 'f2.promise': 'الثقة قبل قراءة كلمة.',
      'f2.brief': 'شعار، لون، خط، حركة. رموز أوّلية ودلالية ومكوّنات — موثّقة. استوديو من أربعة يزن أربعين.',
      'f3.name': 'الأتمتة والأنابيب', 'f3.promise': 'احذف العمل الممل.',
      'f3.brief': 'كاشطات، أنابيب، محرّكات عملاء، أدوات داخلية. العمل المتكرّر يعمل وحده عند الثالثة فجراً. Python وPlaywright وواجهات وClaude.',
      'f4.name': 'استخبارات السوق والمنتج', 'f4.promise': 'السوق، بالأرقام.',
      'f4.brief': 'Maps وFacebook وOuedkniss وJumia وInstagram. منافسون، أسعار، منتجات، عملاء — مهيكلة ومُقيَّمة وقابلة للاستعلام. ٥٤ عميلاً مُثرى في آخر تشغيل.',
      'f5.name': 'الاستراتيجية واستشارات النمو', 'f5.promise': 'بيانات، لا انطباعات.',
      'f5.brief': 'تدقيقات، قمع، تموضع، خرائط طريق. على مراحل، والعائد أولاً. ٥٤٤٬٦٣٤ طلباً حُلِّل لملف شنغن.',
      'cap.summary': 'خمس قدرات أخرى', 'cap.hint': 'لمن يبحث.',
      'c1.name': 'متجر وحجز', 'c1.promise': 'من التصفّح إلى الدفع.',
      'c1.brief': 'دفع واتساب، تدفّقات نقدية، Shopify headless عند الحاجة. مضبوط على الشراء المحلّي.', 'c1.fam': 'البناء',
      'c2.name': 'تصميم جرافيكي واجتماعي', 'c2.promise': 'يوقف التمرير، على الهوية.',
      'c2.brief': 'كاروسيل، إنفوجرافيك، مطبوعات، حزم اجتماعية. نظام واحد مُقفل. كل شيء متطابق.', 'c2.fam': 'البناء',
      'c3.name': 'علم البيانات والتحليلات', 'c3.promise': 'إشارة من الضجيج.',
      'c3.brief': 'نمذجة قياسية، سلاسل زمنية، تنبّؤ، لوحات. مُختبَر، مُشخَّص، قابل للدفاع.', 'c3.fam': 'المحرّك',
      'c4.name': 'أنظمة المعرفة', 'c4.promise': 'شركة تتذكّر.',
      'c4.brief': 'Obsidian/PARA، Zettelkasten، توثيق، قواعد جاهزة للـ RAG. بنى تصمد وحدها.', 'c4.fam': 'العقل',
      'c5.name': 'أدوات ومهارات ذكاء اصطناعي مخصّصة', 'c5.promise': 'برمجيات تبني برمجياتك.',
      'c5.brief': 'أدوات داخلية، مولّدات، مهارات Claude. مهمّة متكرّرة تصير مصنعاً.', 'c5.fam': 'العقل',
      'portfolio.kicker': 'بورتفوليو', 'portfolio.title': '<em>كل</em> الأعمال.',
      'portfolio.close': 'إغلاق', 'portfolio.searchLabel': 'ابحث عن مشروع', 'portfolio.searchPh': 'ابحث…',
      'portfolio.all': 'الكل', 'portfolio.empty': 'لا مشروع مطابق — جرّب كلمة أخرى.',
      'portfolio.projects': 'مشاريع', 'portfolio.view': 'التفاصيل', 'portfolio.back': 'كل المشاريع',
      'portfolio.prev': 'السابق', 'portfolio.next': 'التالي',
      'detail.visit': 'زيارة الموقع →', 'detail.soon': 'قريباً على الإنترنت',
      'detail.problem': 'التحدّي', 'detail.approach': 'المقاربة', 'detail.outcome': 'النتيجة',
      'cat.health': 'صحة', 'cat.travel': 'سفر', 'cat.industrial': 'صناعة', 'cat.commerce': 'تجارة', 'cat.pwa': 'PWA'
    }
  };
  Object.keys(EXTRA).forEach(function (l) {
    for (var k in EXTRA[l]) { if (EXTRA[l].hasOwnProperty(k)) I18N[l][k] = EXTRA[l][k]; }
  });

  /* ---------------- A/B/C variant (one codebase, three deployments) ----------
     a — GitHub Pages : control — proof-first atelier, dark Arcanum
     b — Vercel       : light corporate — Daylight default, decoration stripped
     c — Netlify      : offer-first — demo-before-you-pay leads the page
     The variant is resolved before first paint by the inline script in <head>
     (which also picks the default theme); read it back here. Variant-only
     markup lives in the HTML behind [data-variant-only], so it works with
     JS disabled and never needs DOM injection. */
  var VARIANT = document.documentElement.getAttribute('data-variant') || 'a';

  /* Per-variant copy overrides. Each block supplies whole fr/en/ar sets, so the
     dictionary stays balanced (npm run check enforces multiples of 3). */
  var COPY = {
    b: {
      fr: {
        'hero.title': 'Le studio qui construit, livre et <span class="swash">reste.</span>',
        'hero.lede': 'Numidea Labs conçoit, développe et maintient sites, applications et systèmes de données pour les entreprises algériennes. Une seule équipe, du premier pixel à la mise en production.',
        'hero.cta1': 'Parler de votre projet →'
      },
      en: {
        'hero.title': 'The studio that builds, ships and <span class="swash">stays.</span>',
        'hero.lede': 'Numidea Labs designs, develops and maintains websites, applications and data systems for Algerian businesses. One team, from the first pixel to production.',
        'hero.cta1': 'Discuss your project →'
      },
      ar: {
        'hero.title': 'الاستوديو الذي يبني ويُسلّم <span class="swash">ويبقى.</span>',
        'hero.lede': 'نوميديا لابز تصمّم وتطوّر وتصون المواقع والتطبيقات وأنظمة البيانات للشركات الجزائرية. فريق واحد، من أول بكسل إلى الإطلاق.',
        'hero.cta1': 'تحدّث عن مشروعك →'
      }
    },
    c: {
      fr: {
        'hero.title': 'Votre site, construit <span class="swash">avant que vous ne payiez.</span>',
        'hero.lede': 'On construit une démo réelle et fonctionnelle de votre site. Vous la voyez en direct, vous décidez ensuite. Cinq sites clients déjà en ligne — le vôtre peut être le prochain.',
        'hero.cta1': 'Demander ma démo gratuite →',
        'hero.cta2': 'Voir les 5 sites en ligne'
      },
      en: {
        'hero.title': 'Your site, built <span class="swash">before you pay for it.</span>',
        'hero.lede': 'We build a real, working demo of your site up front. You see it live, then you decide. Five client sites already live — yours can be next.',
        'hero.cta1': 'Get my free demo →',
        'hero.cta2': 'See the 5 live sites'
      },
      ar: {
        'hero.title': 'موقعك، مبنيٌّ <span class="swash">قبل أن تدفع.</span>',
        'hero.lede': 'نبني نسخة تجريبية حقيقية وعاملة من موقعك مسبقاً. تراها حيّة، ثم تقرّر. خمسة مواقع عملاء مباشرة بالفعل — وموقعك قد يكون التالي.',
        'hero.cta1': 'اطلب تجربتك المجانية →',
        'hero.cta2': 'شاهد المواقع الخمسة'
      }
    }
  };
  if (COPY[VARIANT]) {
    Object.keys(COPY[VARIANT]).forEach(function (l) {
      var set = COPY[VARIANT][l];
      for (var k in set) { if (set.hasOwnProperty(k)) I18N[l][k] = set[k]; }
    });
  }

  var SUPPORTED = ['fr', 'en', 'ar'];
  var DEFAULT_LANG = 'fr';
  var explorerRerender = null; // set by the project explorer; re-renders it on language switch

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
    if (typeof explorerRerender === 'function') explorerRerender();
  }

  /* ---------------- count-up ---------------- */
  function group(n) {
    var lang = document.documentElement.getAttribute('lang') || 'fr';
    try { return new Intl.NumberFormat(lang).format(n); }
    catch (e) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  }

  function countUp(el) {
    if (el.getAttribute('data-counted') === '1') return;
    el.setAttribute('data-counted', '1');
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    if (reduceMotion) { el.textContent = prefix + group(target) + suffix; return; }
    // INDEX ROLL — an odometer, not a tween: 14 discrete steps, then lock
    var STEPS = 14, i = 0;
    var tick = setInterval(function () {
      i++;
      el.textContent = prefix + group(Math.round(target * (i / STEPS))) + suffix;
      if (i >= STEPS) { clearInterval(tick); el.textContent = prefix + group(target) + suffix; }
    }, 40);
  }

  /* ---------------- DOM ready ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
   try {
    // restore language
    var saved = DEFAULT_LANG;
    try { saved = localStorage.getItem('numidea-lang') || DEFAULT_LANG; } catch (e) {}
    applyLang(saved);

    // language switch
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); });
    });

    // theme switcher
    // the five approved brand pairings — no other combination exists
    var THEMES = ['flare', 'espresso', 'marigold', 'void', 'signal'];
    function applyTheme(t) {
      if (THEMES.indexOf(t) === -1) t = VARIANT === 'b' ? 'signal' : 'flare';
      document.documentElement.setAttribute('data-theme', t);
      document.querySelectorAll('.theme-menu button').forEach(function (b) {
        b.setAttribute('aria-checked', b.getAttribute('data-theme-val') === t ? 'true' : 'false');
      });
      try { localStorage.setItem('numidea-theme', t); } catch (e) {}
    }
    // the pre-paint script already resolved and applied this; mirror it here
    var defaultTheme = VARIANT === 'b' ? 'signal' : 'flare';
    var savedTheme = document.documentElement.getAttribute('data-theme') || defaultTheme;
    applyTheme(savedTheme);
    var themeBtn = document.querySelector('.theme-btn');
    var themeMenu = document.querySelector('.theme-menu');
    if (themeBtn && themeMenu) {
      function closeTheme() { themeMenu.classList.remove('open'); themeBtn.setAttribute('aria-expanded', 'false'); }
      themeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = themeMenu.classList.toggle('open');
        themeBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      themeMenu.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () { applyTheme(b.getAttribute('data-theme-val')); closeTheme(); });
      });
      document.addEventListener('click', closeTheme);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeTheme(); });
    }

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

    // reveal-on-scroll + count-up
    function revealNow(el) {
      if (el.classList.contains('in')) return;
      el.classList.add('in');
      el.querySelectorAll('[data-count]').forEach(countUp);
      if (el.hasAttribute('data-count')) countUp(el);
    }
    var revealEls = document.querySelectorAll('.reveal, [data-count]');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          revealNow(en.target);
          io.unobserve(en.target);
        });
      }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
      // Safety net: never leave on-screen content stuck invisible if the
      // observer is slow/janky — reveal anything in (or near) the viewport now.
      function revealInView() {
        var h = window.innerHeight || document.documentElement.clientHeight;
        revealEls.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < h * 0.92 && r.bottom > 0) revealNow(el);
        });
      }
      revealInView();
      window.addEventListener('load', revealInView);
    } else {
      revealEls.forEach(revealNow);
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

    // ===================== PROJECT EXPLORER =====================
    // Single source of truth for every project. Text (cat/desc) resolves through
    // the i18n dictionaries via catKey/descKey so it stays trilingual. Optional
    // `story` per lang ({problem, approach, outcome}) powers the case-study view.
    var PROJECTS = [
      { slug: 'bordj-steel', name: 'Bordj Steel', cat: 'industrial', status: 'live',
        url: 'https://bordjsteelb2b.netlify.app', shot: 'assets/previews/bordjsteel.webp',
        accent: '214,55,48', tags: ['B2B', 'Corporate'], featured: true,
        catKey: 'proj4.cat', descKey: 'proj4.desc' },
      { slug: 'almaflowclim', name: 'AlmaFlowClim', cat: 'industrial', status: 'live',
        url: 'https://almaflowclim.netlify.app', shot: 'assets/previews/almaflowclim.webp',
        accent: '59,164,224', tags: ['Static', 'SEO'], featured: true,
        catKey: 'proj3.cat', descKey: 'proj3.desc' },
      { slug: 'alliance-travel', name: 'Alliance Travel', cat: 'travel', status: 'live',
        url: 'https://alliancetravel34.netlify.app', shot: 'assets/previews/alliancetravel.webp',
        accent: '95,214,134', tags: ['Brand', 'Funnel'], featured: true,
        catKey: 'proj2.cat', descKey: 'proj2.desc' },
      { slug: 'nomara-voyages', name: 'Nomara Voyages', cat: 'travel', status: 'live',
        url: 'https://nomaravoyages.netlify.app', shot: 'assets/previews/nomara.webp',
        accent: '34,180,104', tags: ['Bilingue', 'SEO'], featured: true,
        catKey: 'proj6.cat', descKey: 'proj6.desc' },
      { slug: 'glaive-store', name: 'Glaive Store', cat: 'commerce', status: 'live',
        url: 'https://glaivestore.netlify.app', shot: 'assets/previews/glaive.webp',
        accent: '255,90,31', tags: ['Commerce', 'Brand'], featured: true,
        catKey: 'proj7.cat', descKey: 'proj7.desc' },
      { slug: 'doctor-cherfia', name: 'Doctor Cherfia Clinic', cat: 'health', status: 'soon',
        url: null, shot: null, accent: null, tags: ['Next.js', 'Booking'], featured: true,
        catKey: 'proj1.cat', descKey: 'proj1.desc' },
      { slug: 'etoile-est', name: 'Étoile de l\'Est', cat: 'pwa', status: 'soon',
        url: null, shot: null, accent: null, tags: ['PWA', 'Supabase', 'Offline'], featured: true,
        catKey: 'proj5.cat', descKey: 'proj5.desc' }
    ];

    var pOpen = document.querySelector('#portfolio-open');
    var modal = document.querySelector('#portfolio-modal');
    if (pOpen && modal) {
      var browseEl = modal.querySelector('#explorer-browse');
      var detailEl = modal.querySelector('#explorer-detail');
      var grid = modal.querySelector('#portfolio-grid');
      var filtersEl = modal.querySelector('#portfolio-filters');
      var psearch = modal.querySelector('#portfolio-search');
      var pempty = modal.querySelector('#portfolio-empty');
      var countEl = modal.querySelector('#explorer-count');
      var detailBody = modal.querySelector('#detail-body');
      var panel = modal.querySelector('.modal-panel');
      var lastFocus = null, curCat = 'all', curSlug = null, modalOpen = false;

      function dict() { return I18N[document.documentElement.getAttribute('lang')] || I18N[DEFAULT_LANG]; }
      function t(k, fb) { var d = dict(); return d[k] != null ? d[k] : (fb || k); }
      function pad2(n) { return (n < 10 ? '0' : '') + n; }
      function bySlug(s) { for (var i = 0; i < PROJECTS.length; i++) if (PROJECTS[i].slug === s) return PROJECTS[i]; return null; }
      function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
      function domainOf(p) { return p.url ? p.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : p.name; }
      function statusPill(p) {
        return p.status === 'live'
          ? '<span class="pill live">Live</span>'
          : '<span class="pill soon">' + esc(t('work.soon', 'Bientôt')) + '</span>';
      }

      function cardHTML(p) {
        var d = dict();
        var cat = d[p.catKey] || p.cat, desc = d[p.descKey] || '';
        var brand = p.accent ? ' proj--brand' : '';
        var style = p.accent ? ' style="--accent:' + p.accent + '"' : '';
        var thumb = p.shot
          ? '<div class="thumb"><div class="browser" aria-hidden="true"><i></i><i></i><i></i><span>' + esc(domainOf(p)) + '</span></div>'
            + '<img class="shot" src="' + p.shot + '" alt="" loading="lazy" decoding="async" width="1280" height="800"></div>'
          : '<div class="thumb thumb--art"><div class="browser" aria-hidden="true"><i></i><i></i><i></i><span>' + esc(domainOf(p)) + '</span></div>'
            + '<div class="art" aria-hidden="true"></div><span class="cover" aria-hidden="true">' + esc(p.name) + '</span></div>';
        var pills = p.tags.map(function (x) { return '<span class="pill">' + esc(x) + '</span>'; }).join('') + statusPill(p);
        var idx = pad2(PROJECTS.indexOf(p) + 1) + '/' + pad2(PROJECTS.length);
        return '<a class="proj' + brand + '" data-cat="' + esc(p.cat) + '" data-idx="' + idx + '" href="#/work/' + p.slug + '"' + style + '>'
          + thumb
          + '<div class="body"><span class="cat">' + esc(cat) + '</span><h3>' + esc(p.name) + '</h3>'
          + '<p>' + esc(desc) + '</p><div class="pills">' + pills + '</div>'
          + '<span class="proj-cta">' + esc(t('portfolio.view', 'Détails')) + ' →</span></div></a>';
      }

      function buildFilters() {
        var d = dict(), cats = [], counts = {};
        PROJECTS.forEach(function (p) { if (cats.indexOf(p.cat) === -1) cats.push(p.cat); counts[p.cat] = (counts[p.cat] || 0) + 1; });
        filtersEl.innerHTML = '';
        function chip(key, label, count) {
          var b = document.createElement('button');
          b.type = 'button'; b.className = 'filter-chip';
          b.setAttribute('data-cat', key);
          b.setAttribute('aria-pressed', key === curCat ? 'true' : 'false');
          b.innerHTML = esc(label) + ' <span class="ct">' + count + '</span>';
          b.addEventListener('click', function () { curCat = key; renderGrid(); });
          return b;
        }
        filtersEl.appendChild(chip('all', d['portfolio.all'] || 'Tout', PROJECTS.length));
        cats.forEach(function (k) { filtersEl.appendChild(chip(k, d['cat.' + k] || k, counts[k])); });
      }

      function renderGrid() {
        var d = dict(), term = (psearch.value || '').trim().toLowerCase();
        var list = PROJECTS.filter(function (p) {
          if (curCat !== 'all' && p.cat !== curCat) return false;
          if (!term) return true;
          var hay = (p.name + ' ' + (d[p.catKey] || '') + ' ' + (d[p.descKey] || '') + ' ' + p.tags.join(' ')).toLowerCase();
          return hay.indexOf(term) !== -1;
        });
        filtersEl.querySelectorAll('.filter-chip').forEach(function (b) {
          b.setAttribute('aria-pressed', b.getAttribute('data-cat') === curCat ? 'true' : 'false');
        });
        grid.innerHTML = list.map(cardHTML).join('');
        pempty.hidden = list.length !== 0;
        countEl.textContent = list.length + ' / ' + PROJECTS.length + ' ' + (d['portfolio.projects'] || 'projets');
      }

      function detailHTML(p) {
        var d = dict(), lang = document.documentElement.getAttribute('lang');
        var cat = d[p.catKey] || p.cat, desc = d[p.descKey] || '';
        var brand = p.accent ? ' detail--brand' : '';
        var style = p.accent ? ' style="--accent:' + p.accent + '"' : '';
        var hero = p.shot
          ? '<div class="detail-shot-wrap"><div class="browser" aria-hidden="true"><i></i><i></i><i></i><span>' + esc(domainOf(p)) + '</span></div>'
            + '<img class="detail-shot" src="' + p.shot + '" alt="' + esc(p.name) + '" width="1280" height="800"></div>'
          : '<div class="detail-shot-wrap detail-art"><span class="cover">' + esc(p.name) + '</span></div>';
        var pills = p.tags.map(function (x) { return '<span class="pill">' + esc(x) + '</span>'; }).join('') + statusPill(p);
        var action = p.url
          ? '<a class="btn btn-primary" href="' + p.url + '" target="_blank" rel="noopener">' + esc(t('detail.visit', 'Voir le site →')) + '</a>'
          : '<span class="detail-soon">' + esc(t('detail.soon', 'Bientôt en ligne')) + '</span>';
        var story = '';
        if (p.story && p.story[lang]) {
          var s = p.story[lang];
          function sec(key, val) { return val ? '<div class="detail-sec"><h4>' + esc(t(key)) + '</h4><p>' + esc(val) + '</p></div>' : ''; }
          var body = sec('detail.problem', s.problem) + sec('detail.approach', s.approach) + sec('detail.outcome', s.outcome);
          if (body) story = '<div class="detail-story">' + body + '</div>';
        }
        return '<div class="detail-hero' + brand + '"' + style + '>' + hero + '</div>'
          + '<div class="detail-info' + brand + '"' + style + '>'
          + '<span class="cat">' + esc(cat) + '</span>'
          + '<h3 id="detail-title" tabindex="-1">' + esc(p.name) + '</h3>'
          + '<p class="detail-overview">' + esc(desc) + '</p>'
          + '<div class="pills">' + pills + '</div>'
          + '<div class="detail-actions">' + action + '</div>'
          + story + '</div>';
      }

      function renderDetail(slug) {
        var p = bySlug(slug);
        if (!p) { location.hash = '#/work'; return; }
        curSlug = slug;
        var d = dict();
        detailBody.innerHTML = detailHTML(p);
        var idx = PROJECTS.indexOf(p);
        var prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
        var next = PROJECTS[(idx + 1) % PROJECTS.length];
        var pv = modal.querySelector('#detail-prev'), nx = modal.querySelector('#detail-next');
        pv.innerHTML = '<span class="dn-dir">← ' + esc(d['portfolio.prev'] || 'Précédent') + '</span><span class="dn-name">' + esc(prev.name) + '</span>';
        nx.innerHTML = '<span class="dn-dir">' + esc(d['portfolio.next'] || 'Suivant') + ' →</span><span class="dn-name">' + esc(next.name) + '</span>';
        pv.onclick = function () { location.hash = '#/work/' + prev.slug; };
        nx.onclick = function () { location.hash = '#/work/' + next.slug; };
        browseEl.hidden = true; detailEl.hidden = false;
        panel.scrollTop = 0;
        var h = detailBody.querySelector('#detail-title'); if (h) h.focus();
      }

      function showBrowse() { curSlug = null; detailEl.hidden = true; browseEl.hidden = false; }

      function openModal() {
        if (modalOpen) return;
        lastFocus = document.activeElement;
        buildFilters(); renderGrid();
        modal.hidden = false; document.body.classList.add('modal-open'); modalOpen = true;
      }
      function closeModal() {
        if (!modalOpen) return;
        modal.hidden = true; document.body.classList.remove('modal-open'); modalOpen = false;
        showBrowse();
        if (location.hash.indexOf('#/work') === 0) history.replaceState(null, '', location.pathname + location.search);
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      }

      // hash router — #/work opens the explorer, #/work/<slug> opens a case study.
      // Uses a slash so it never clashes with section anchors like #work.
      function route() {
        var m = location.hash.match(/^#\/work(?:\/([\w-]+))?/);
        if (!m) { if (modalOpen) closeModal(); return; }
        openModal();
        if (m[1]) renderDetail(m[1]);
        else { showBrowse(); if (psearch) psearch.focus(); }
      }
      window.addEventListener('hashchange', route);

      pOpen.addEventListener('click', function (e) { e.preventDefault(); location.hash = '#/work'; });
      var backBtn = modal.querySelector('#detail-back');
      if (backBtn) backBtn.addEventListener('click', function () { location.hash = '#/work'; });
      modal.querySelectorAll('[data-close]').forEach(function (el) { el.addEventListener('click', closeModal); });
      psearch.addEventListener('input', renderGrid);

      document.addEventListener('keydown', function (e) {
        if (!modalOpen) return;
        if (e.key === 'Escape') { if (!detailEl.hidden) location.hash = '#/work'; else closeModal(); return; }
        if (e.key === 'Tab') {
          var f = Array.prototype.filter.call(
            panel.querySelectorAll('a[href],button:not([disabled]),input,[tabindex]:not([tabindex="-1"])'),
            function (el) { return el.offsetParent !== null; });
          if (!f.length) return;
          var first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });

      // re-render on language switch (called from applyLang)
      explorerRerender = function () {
        if (!modalOpen) return;
        buildFilters(); renderGrid();
        if (curSlug) renderDetail(curSlug);
      };

      route(); // honor a deep link on initial load
    }

    // founder — résumé accordion (max-height expand + label swap)
    var cvBtn = document.querySelector('#cv-toggle'), cvPanel = document.querySelector('#cv-panel');
    if (cvBtn && cvPanel) {
      cvBtn.addEventListener('click', function () {
        var open = cvPanel.classList.toggle('open');
        cvBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        var d = I18N[document.documentElement.getAttribute('lang')] || I18N[DEFAULT_LANG];
        cvBtn.textContent = open ? (d['founder.cvClose'] || 'Close ↑') : (d['founder.cvBtn'] || 'View résumé ↴');
      });
    }

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

        // Durable capture: best-effort insert into Supabase so the lead survives
        // even when the visitor has no mail client configured (the mailto handoff
        // below fails silently in that case — this doesn't depend on it at all).
        // SUPABASE_URL/KEY are filled in once the project exists; until then this
        // silently no-ops and behaviour is identical to the mailto-only original.
        if (window.NUMIDEA_SUPABASE_URL && window.NUMIDEA_SUPABASE_KEY) {
          try {
            fetch(window.NUMIDEA_SUPABASE_URL + '/rest/v1/leads', {
              method: 'POST',
              keepalive: true,
              headers: {
                'Content-Type': 'application/json',
                'apikey': window.NUMIDEA_SUPABASE_KEY,
                'Authorization': 'Bearer ' + window.NUMIDEA_SUPABASE_KEY
              },
              body: JSON.stringify({
                name: name, contact: email, message: msg,
                lang: document.documentElement.getAttribute('lang') || 'fr',
                variant: VARIANT
              })
            }).catch(function () {}); // best-effort — never blocks the visitor
          } catch (e2) {}
        }

        // Static site, no backend: hand the lead off to the visitor's mail client,
        // pre-filled to hello@numidealabs.com. Only show success after the handoff.
        var subject = 'Numidea Labs · ' + name;
        var body = name + ' <' + email + '>\n\n' + msg
          + '\n\n--\nnumidealabs · ' + VARIANT + ' · ' + (document.documentElement.getAttribute('lang') || 'fr');
        window.location.href = 'mailto:hello@numidealabs.com'
          + '?subject=' + encodeURIComponent(subject)
          + '&body=' + encodeURIComponent(body);
        form.style.display = 'none';
        if (success) success.classList.add('show');
      });
    }
   } catch (e) {
    // Never let an init error leave content stuck behind scroll-reveal.
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    if (window.console && console.error) console.error(e);
   }
  });
})();
