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
      'hero.title': 'Une ingénierie qui tient de la magie. <span class="swash">La rigueur qui la livre.</span>',
      'hero.lede': 'Quatre spécialistes qui conçoivent, codent et livrent toute la chaîne — du back-end au dernier pixel. Des systèmes puissants, rendus accessibles, et assumés quand ça casse.',
      'hero.cta1': 'Construisons →', 'hero.cta2': 'Voir les preuves',
      'proof.kicker': '01 — Preuves',
      'proof.s1': 'projets livrés', 'proof.s2': 'spécialistes', 'proof.s3': 'langues', 'proof.s4': 'de réponse',
      'proof.line': 'De vrais clients. De vrais déploiements. Les preuves sont plus bas — ouvrez-les.',
      'svc.kicker': '02 — Services',
      'svc.title': 'Ce qu\'on <em>rend réel.</em>',
      'svc.outcomeLabel': 'Résultat',
      'work.kicker': '03 — Réalisations',
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
      'team.kicker': '05 — Équipe',
      'team.title': 'Votre avantage <em>injuste.</em>',
      'team.lead': 'Assez petits pour s\'investir. Assez seniors pour livrer.',
      'm1.role': 'Design & développement', 'm1.detail': 'Transforme le brief en build.',
      'm2.role': 'Spécialiste données', 'm2.detail': 'Pipelines, scraping, la couche intelligence.',
      'm3.role': 'Ventes & partenariats', 'm3.detail': 'Votre premier contact ; le traducteur entre l\'idée et le cadrage.',
      'm4.role': 'Représentant technique', 'm4.detail': 'Garde le build honnête et le client informé.',
      'scene.kicker': '◆ CONSTRUIT AU SCROLL · SCÈNE PAR SCÈNE', 'scene.title': 'Les projets, en 3D.',
      'scene.lead': 'Une scène 3D pilotée au scroll : nos déploiements réels, rendus un par un.',
      'scene.cta': 'Entrer dans la scène →',
      'founder.kicker': '06 — Fondateur', 'founder.title': 'Le studio a un <em>visage.</em>',
      'founder.lead': 'Derrière Numidea : un designer-développeur qui conçoit, code et livre — sans intermédiaire.',
      'founder.role': 'Designer & développeur · Fondateur', 'founder.years': '6 ans',
      'founder.bio': 'Six ans à concevoir des identités, coder des interfaces et livrer des produits — de la marque au front-end au cloud. Je transforme le brief en build, et je reste quand c\'est en ligne.',
      'founder.cvBtn': 'Voir le parcours ↴', 'founder.cvClose': 'Masquer le parcours ↑', 'founder.portfolio': 'Portfolio personnel ↗',
      'founder.expLabel': 'Parcours', 'founder.skillsLabel': 'Compétences', 'founder.eduLabel': 'Formation',
      'founder.skills': 'Design & identité · Web & front-end · Stratégie & contenu. Production ~20 % plus rapide grâce à l\'IA.',
      'founder.edu': 'Informatique — Université Mohamed El Bachir El Ibrahimi · 2018–2024',
      'founder.download': 'Télécharger le CV (PDF) ↓',
      'founder.teamRow': 'Avec lui : <b>D</b> — données & pipelines · <b>S</b> — ventes & partenariats · <b>T</b> — représentant technique',
      'fx1': 'Graphiste', 'fx2': 'Designer freelance', 'fx3': 'Web & social', 'fx4': 'Identité & web', 'fx5': 'Contenu & vidéo',
      'stack.kicker': '07 — Stack',
      'stack.title': 'Le flex <em>discret.</em>',
      'stack.lead': 'La pile qu\'on utilise vraiment, choisie pour durer.',
      'faq.kicker': '08 — FAQ', 'faq.title': 'Les questions <em>qui comptent.</em>',
      'faq.lead': 'Ce qu\'on nous demande avant de se lancer — répondu franchement.',
      'faq1.q': 'Combien de temps pour livrer ?', 'faq1.a': 'Ça dépend du périmètre — mais on ne vous fait pas attendre. La plupart des sites partent en quelques semaines, et vous repartez avec un délai ferme dès qu\'on a cadré le projet ensemble.',
      'faq2.q': 'C\'est combien ?', 'faq2.a': 'Au projet, jamais au modèle copié-collé. On chiffre une fois le périmètre clair — un prix fixe, sans frais surprise. Et souvent, on construit une démo fonctionnelle avant que vous ne vous engagiez.',
      'faq3.q': 'Vous travaillez en quelles langues ?', 'faq3.a': 'Français, arabe et anglais — à l\'oral, à l\'écrit, et dans le produit livré. Ce site même est trilingue, avec une expérience arabe (RTL) pensée nativement.',
      'faq4.q': 'Et après le lancement ?', 'faq4.a': 'On reste. On maintient ce qu\'on livre et on répond quand ça casse — en moins de 24 heures. Pas de « bonne chance » le jour de la mise en ligne.',
      'faq5.q': 'Travaillez-vous à distance ?', 'faq5.a': 'Oui. On est basés à Bordj Bou Arréridj, mais on livre partout — y compris pour des clients en France. La distance ne change rien à l\'accès direct au builder.',
      'faq6.q': 'Qu\'est-ce qui vous différencie d\'une agence ?', 'faq6.a': 'Pas d\'intermédiaire. La personne qui cadre votre projet est celle qui le code et le livre — une seule équipe, du design au déploiement. Et souvent, vous voyez une démo réelle avant de payer.',
      'contact.kicker': '09 — Contact',
      'contact.title': 'On le <em>rend réel ?</em>',
      'contact.sub': 'Dites-nous ce que vous cherchez à concrétiser — l\'urgent, le cassé, l\'échéance. On répond en moins de 24 heures, en français, anglais ou arabe.',
      'contact.reassure': 'Réponse < 24h · Bordj Bou Arréridj · DZ',
      'form.name': 'Nom', 'form.namePh': 'Votre nom',
      'form.email': 'Email', 'form.emailPh': 'vous@entreprise.com',
      'form.message': 'Message', 'form.messagePh': 'Qu\'est-ce qu\'on construit ?',
      'form.send': 'Démarrer un projet →',
      'form.errName': 'Ajoutez un nom pour qu\'on sache à qui parler.',
      'form.errEmail': 'Ajoutez un email pour qu\'on puisse répondre.',
      'form.errEmailValid': 'Cet email a l\'air incomplet — vérifiez-le.',
      'form.errMsg': 'Dites-nous une ligne sur le projet.',
      'form.success': 'Votre email est prêt dans votre messagerie — envoyez-le et on revient sous 24h.',
      'footer.signoff': 'Construit à Bordj Bou Arréridj, avec du café noir et du TypeScript.',
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
      'hero.title': 'Engineering that feels like magic. <span class="swash">Discipline that ships it.</span>',
      'hero.lede': 'Four specialists who design, build, and ship the whole chain — from the data layer to the last pixel. Powerful systems, made accessible, and answered for when they break.',
      'hero.cta1': 'Let\'s build it →', 'hero.cta2': 'See the proof',
      'proof.kicker': '01 — Proof',
      'proof.s1': 'projects shipped', 'proof.s2': 'specialists', 'proof.s3': 'languages', 'proof.s4': 'response',
      'proof.line': 'Real clients. Real deployments. The receipts are below — open them.',
      'svc.kicker': '02 — Services',
      'svc.title': 'What we <em>make real.</em>',
      'svc.outcomeLabel': 'Outcome',
      'work.kicker': '03 — Selected work',
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
      'team.kicker': '05 — Team',
      'team.title': 'Your unfair <em>advantage.</em>',
      'team.lead': 'Small enough to care. Senior enough to ship.',
      'm1.role': 'Design & development', 'm1.detail': 'Turns the brief into the build.',
      'm2.role': 'Data specialist', 'm2.detail': 'Pipelines, scraping, the intelligence layer.',
      'm3.role': 'Sales & partnerships', 'm3.detail': 'Your first call; translator between idea and scope.',
      'm4.role': 'Technical representative', 'm4.detail': 'Keeps the build honest and the client informed.',
      'scene.kicker': '◆ SCROLL-BUILT · SCENE BY SCENE', 'scene.title': 'The work, in dimension.',
      'scene.lead': 'A scroll-built 3D scene: our real deployments, rendered one by one.',
      'scene.cta': 'Enter the scene →',
      'founder.kicker': '06 — Founder', 'founder.title': 'The studio has a <em>face.</em>',
      'founder.lead': 'Behind Numidea: a designer-developer who conceives, codes and ships — no middleman.',
      'founder.role': 'Designer & developer · Founder', 'founder.years': '6 yrs',
      'founder.bio': 'Six years designing identities, coding interfaces and shipping products — brand to front-end to cloud. I turn the brief into the build, and I stay once it\'s live.',
      'founder.cvBtn': 'View the track record ↴', 'founder.cvClose': 'Hide the track record ↑', 'founder.portfolio': 'Personal portfolio ↗',
      'founder.expLabel': 'Experience', 'founder.skillsLabel': 'Skills', 'founder.eduLabel': 'Education',
      'founder.skills': 'Design & identity · Web & front-end · Strategy & content. Production ~20% faster with AI.',
      'founder.edu': 'Computer Science — Univ. Mohamed El Bachir El Ibrahimi · 2018–2024',
      'founder.download': 'Download résumé (PDF) ↓',
      'founder.teamRow': 'Alongside him: <b>D</b> — data & pipelines · <b>S</b> — sales & partnerships · <b>T</b> — technical rep',
      'fx1': 'Graphic Designer', 'fx2': 'Freelance Designer', 'fx3': 'Web & social', 'fx4': 'Identity & web', 'fx5': 'Content & video',
      'stack.kicker': '07 — Stack',
      'stack.title': 'The quiet <em>flex.</em>',
      'stack.lead': 'The stack we actually use, chosen to last.',
      'faq.kicker': '08 — FAQ', 'faq.title': 'The questions <em>that matter.</em>',
      'faq.lead': 'What people ask before they start — answered straight.',
      'faq1.q': 'How long does it take to ship?', 'faq1.a': 'It depends on scope — but we don\'t keep you waiting. Most sites ship in a few weeks, and you get a firm timeline the moment we\'ve scoped the project together.',
      'faq2.q': 'What does it cost?', 'faq2.a': 'Per project, never a copy-paste template. We quote once the scope is clear — a fixed price, no surprise fees. And we often build a working demo before you commit a dinar.',
      'faq3.q': 'What languages do you work in?', 'faq3.a': 'French, Arabic and English — spoken, written, and in what we ship. This very site is trilingual, with a natively mirrored Arabic (RTL) experience.',
      'faq4.q': 'What happens after launch?', 'faq4.a': 'We stay. We maintain what we ship and we answer when it breaks — in under 24 hours. No "good luck" on launch day.',
      'faq5.q': 'Do you work remotely?', 'faq5.a': 'Yes. We\'re based in Bordj Bou Arréridj but we deliver anywhere — including clients in France. Distance doesn\'t change your direct line to the builder.',
      'faq6.q': 'How are you different from an agency?', 'faq6.a': 'No middleman. The person who scopes your project is the one who codes and ships it — one team, design to deploy. And often, you see a real demo before you pay.',
      'contact.kicker': '09 — Contact',
      'contact.title': 'Let\'s make it <em>real.</em>',
      'contact.sub': 'Tell us what you\'re trying to make real — what\'s urgent, what\'s broken, what\'s due. We reply in under 24 hours, in French, English, or Arabic.',
      'contact.reassure': 'Response < 24h · Bordj Bou Arréridj · DZ',
      'form.name': 'Name', 'form.namePh': 'Your name',
      'form.email': 'Email', 'form.emailPh': 'you@company.com',
      'form.message': 'Message', 'form.messagePh': 'What are we building?',
      'form.send': 'Start a project →',
      'form.errName': 'Add a name so we know who we\'re talking to.',
      'form.errEmail': 'Add an email so we can reply.',
      'form.errEmailValid': 'That email looks incomplete — check it.',
      'form.errMsg': 'Give us one line about the project.',
      'form.success': 'Your email is ready in your mail app — hit send and we\'ll reply within 24h.',
      'footer.signoff': 'Built in Bordj Bou Arréridj, with black coffee and TypeScript.',
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
      'hero.title': 'هندسةٌ تكاد تكون سحراً. <span class="swash">وانضباطٌ يُسلّمها.</span>',
      'hero.lede': 'أربعة مختصّين يصمّمون ويبرمجون ويُطلقون السلسلة كاملةً — من الخادم إلى آخر بكسل. أنظمةٌ قوية، مُتاحةٌ للجميع، ونتحمّل مسؤوليتها حين تتعطّل.',
      'hero.cta1': 'لنبنِ →', 'hero.cta2': 'شاهد الإثبات',
      'proof.kicker': '٠١ — الإثبات',
      'proof.s1': 'مشروعاً مُسلَّماً', 'proof.s2': 'مختصّين', 'proof.s3': 'لغات', 'proof.s4': 'زمن الردّ',
      'proof.line': 'عملاء حقيقيون. عمليات نشر حقيقية. الإثباتات في الأسفل — افتحها.',
      'svc.kicker': '٠٢ — الخدمات',
      'svc.title': 'ما الذي <em>نجعله حقيقة.</em>',
      'svc.outcomeLabel': 'النتيجة',
      'work.kicker': '٠٣ — أعمال مختارة',
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
      'team.kicker': '٠٥ — الفريق',
      'team.title': 'ميزتك <em>غير العادلة.</em>',
      'team.lead': 'صغار بما يكفي للاهتمام. خبراء بما يكفي للتسليم.',
      'm1.role': 'تصميم وتطوير', 'm1.detail': 'يحوّل الموجز إلى منتج.',
      'm2.role': 'مختصّ بيانات', 'm2.detail': 'الأنابيب، الكشط، طبقة الذكاء.',
      'm3.role': 'مبيعات وشراكات', 'm3.detail': 'اتصالك الأول؛ المترجم بين الفكرة والنطاق.',
      'm4.role': 'ممثّل تقني', 'm4.detail': 'يبقي البناء صادقاً والعميل مُطّلعاً.',
      'scene.kicker': '◆ مبنيّ بالتمرير · مشهداً بمشهد', 'scene.title': 'الأعمال، بالأبعاد الثلاثة.',
      'scene.lead': 'مشهد ثلاثي الأبعاد يتحرّك مع التمرير: مشاريعنا الحقيقية، واحداً تلو الآخر.',
      'scene.cta': 'ادخل المشهد →',
      'founder.kicker': '٠٦ — المؤسّس', 'founder.title': 'للاستوديو <em>وجه.</em>',
      'founder.lead': 'خلف Numidea: مصمّم-مطوّر يتصوّر ويبرمج ويُسلّم — دون وسيط.',
      'founder.role': 'مصمّم ومطوّر · المؤسّس', 'founder.years': '٦ سنوات',
      'founder.bio': 'ستّ سنوات في تصميم الهويّات وبرمجة الواجهات وتسليم المنتجات — من العلامة إلى الواجهة إلى السحابة. أحوّل الفكرة إلى منتج، وأبقى بعد الإطلاق.',
      'founder.cvBtn': 'عرض المسار ↴', 'founder.cvClose': 'إخفاء المسار ↑', 'founder.portfolio': 'المعرض الشخصي ↗',
      'founder.expLabel': 'المسار', 'founder.skillsLabel': 'المهارات', 'founder.eduLabel': 'التعليم',
      'founder.skills': 'تصميم وهويّة · ويب وواجهات · استراتيجية ومحتوى. إنتاج أسرع بنحو ٢٠٪ بفضل الذكاء الاصطناعي.',
      'founder.edu': 'علوم الحاسوب — جامعة محمد البشير الإبراهيمي · ٢٠١٨–٢٠٢٤',
      'founder.download': 'تحميل السيرة (PDF) ↓',
      'founder.teamRow': 'إلى جانبه: <b>D</b> — البيانات والأنابيب · <b>S</b> — المبيعات والشراكات · <b>T</b> — الممثّل التقني',
      'fx1': 'مصمّم غرافيك', 'fx2': 'مصمّم مستقل', 'fx3': 'ويب واجتماعي', 'fx4': 'هويّة وويب', 'fx5': 'محتوى وفيديو',
      'stack.kicker': '٠٧ — التقنيات',
      'stack.title': 'التباهي <em>الهادئ.</em>',
      'stack.lead': 'التقنيات التي نستخدمها فعلاً، مختارة لتدوم.',
      'faq.kicker': '٠٨ — الأسئلة', 'faq.title': 'الأسئلة <em>التي تهمّ.</em>',
      'faq.lead': 'ما يُسأل قبل البدء — بإجابات صريحة.',
      'faq1.q': 'كم يستغرق الإنجاز؟', 'faq1.a': 'يعتمد على حجم المشروع — لكنّنا لا نُبقيك تنتظر. معظم المواقع تنطلق خلال أسابيع، وتحصل على موعد نهائي واضح بمجرّد أن نحدّد نطاق العمل معاً.',
      'faq2.q': 'كم التكلفة؟', 'faq2.a': 'حسب المشروع، لا قوالب جاهزة. نُسعّر بعد توضيح النطاق — سعر ثابت دون مفاجآت. وغالباً نبني نموذجاً يعمل قبل أن تلتزم.',
      'faq3.q': 'بأي لغات تعملون؟', 'faq3.a': 'الفرنسية والعربية والإنجليزية — حديثاً وكتابةً وفي المنتَج المُسلَّم. هذا الموقع نفسه ثلاثي اللغات، بتجربة عربية (RTL) مصمّمة أصلاً.',
      'faq4.q': 'وماذا بعد الإطلاق؟', 'faq4.a': 'نبقى معك. نصون ما نُسلّمه ونردّ حين يتعطّل شيء — في أقل من ٢٤ ساعة. لا « حظّاً موفقاً » يوم الإطلاق.',
      'faq5.q': 'هل تعملون عن بُعد؟', 'faq5.a': 'نعم. مقرّنا في برج بوعريريج لكنّنا نُسلّم في كل مكان — بما في ذلك عملاء في فرنسا. البُعد لا يغيّر تواصلك المباشر مع من يبني.',
      'faq6.q': 'ما الذي يميّزكم عن وكالة؟', 'faq6.a': 'لا وسيط. من يحدّد نطاق مشروعك هو من يبرمجه ويُسلّمه — فريق واحد من التصميم إلى النشر. وغالباً ترى نموذجاً حقيقياً قبل أن تدفع.',
      'contact.kicker': '٠٩ — تواصل',
      'contact.title': '<em>نجعله حقيقة؟</em>',
      'contact.sub': 'أخبرنا بما تسعى إلى تحقيقه — العاجل، المتعطّل، المستحقّ. نردّ في أقل من ٢٤ ساعة، بالفرنسية أو الإنجليزية أو العربية.',
      'contact.reassure': 'ردّ < ٢٤ ساعة · برج بوعريريج · الجزائر',
      'form.name': 'الاسم', 'form.namePh': 'اسمك',
      'form.email': 'البريد', 'form.emailPh': 'you@company.com',
      'form.message': 'الرسالة', 'form.messagePh': 'ماذا سنبني؟',
      'form.send': 'ابدأ مشروعاً →',
      'form.errName': 'أضف اسماً لنعرف بمن نتحدّث.',
      'form.errEmail': 'أضف بريداً لنتمكّن من الردّ.',
      'form.errEmailValid': 'يبدو هذا البريد ناقصاً — تحقّق منه.',
      'form.errMsg': 'أخبرنا بسطر عن المشروع.',
      'form.success': 'بريدك جاهز في تطبيق البريد — أرسله وسنعود إليك خلال ٢٤ ساعة.',
      'footer.signoff': 'بُني في برج بوعريريج، بقهوة سوداء و TypeScript.',
      'footer.rights': '© ٢٠٢٦ نوميديا لابز · كل الحقوق محفوظة',
      'footer.tag': 'جذورها في نوميديا · مبنيّة على الأفكار'
    }
  };

  /* ---- Services Catalog + Trust strip strings (merged into I18N) ---- */
  var EXTRA = {
    fr: {
      'svc.lead': 'Dix capacités, trois familles. On met cinq offres en avant — la profondeur attend ceux qui creusent.',
      'svc.proofLabel': 'Preuve', 'svc.flagship': '★ Flagship',
      'rail1': 'I · Le Build', 'rail2': "II · L'Engine", 'rail3': "III · L'Esprit",
      'fam1.label': 'Famille I — Le Build', 'fam1.tag': "Là où l'idée devient ce qu'on ouvre, clique et achète.",
      'fam2.label': "Famille II — L'Engine", 'fam2.tag': 'Votre moat — la machinerie que presque aucun studio local ne construit.',
      'fam3.label': "Famille III — L'Esprit", 'fam3.tag': 'Stratégie, systèmes et outils qui se composent.',
      'prev.tag': 'Offre signature', 'prev.name': "L'Aperçu", 'prev.promise': 'Zéro risque. Juste la preuve.',
      'prev.brief': 'On construit une démo réelle et fonctionnelle de votre site, en amont. Vous arrivez en réunion, vous la voyez en direct, puis vous décidez.',
      'prev.outcome': 'Le « oui » le plus facile que vous donnerez — parce que vous l\'avez déjà vu.',
      'f1.name': 'Sites & applications web', 'f1.promise': 'Le choix évident.',
      'f1.brief': 'Sites et applications web sur mesure — rapides, référencés, pensés pour convertir, du front-end au cloud. React · Next.js · Vite · Tailwind sur Vercel. On ne thème pas un template ; on construit un design system fin et on possède chaque token.',
      'f1.outcome': 'Une présence qui dépasse vos concurrents de trois catégories.',
      'f1.proof': 'Doctor Cherfia Clinic · almaflowclim.fr · Étoile de l\'Est (PWA).',
      'f2.name': 'Identité & systèmes visuels', 'f2.promise': 'La confiance avant le premier mot.',
      'f2.brief': 'Logos, couleur, typo, motion et le kit design-system complet — tokens primitifs → sémantiques → composants, documentés. Ce qui fait passer un studio de quatre pour un de quarante.',
      'f2.outcome': 'Une cohérence qui fait de votre client le leader de sa catégorie.',
      'f2.proof': 'Verdant (système clinique) · Éclat (système IPTV) · okami-streetwear.',
      'f3.name': 'Automatisation & pipelines', 'f3.promise': 'Supprimez la corvée.',
      'f3.brief': 'Scrapers, pipelines de données, moteurs de leads, automatisations, outils internes. Le travail répétitif et fragile qui dévore vos heures — on le fait tourner seul à 3h du matin. Python · Playwright · APIs · Claude.',
      'f3.outcome': 'La corvée disparaît ; vos gens font le travail qui exige un humain.',
      'f3.proof': 'Pipeline Playwright → Claude : scrape → enrichissement FR/AR → génération de démos → ZIP par entreprise.',
      'f4.name': 'Intelligence marché & produit', 'f4.promise': 'Voir le marché clairement.',
      'f4.brief': 'Transformez le web ouvert en base de données. Veille concurrentielle, intelligence prix/produit, enrichissement de leads sur Maps, Facebook, Ouedkniss, Jumia, Instagram — structuré, scoré, requêtable.',
      'f4.outcome': 'Des décisions sur preuves, pas sur intuition.',
      'f4.proof': 'Architecture d\'intelligence produit e-commerce Algérie · base de leads enrichis.',
      'f4.statlabel': 'leads enrichis',
      'f5.name': 'Stratégie & conseil croissance', 'f5.promise': 'De la donnée, pas des impressions.',
      'f5.brief': 'Audits marketing complets, analyse de funnels, positionnement concurrentiel, feuilles de route — honnêtes, ROI d\'abord, par phases. On fait les devoirs sur votre secteur avant l\'appel.',
      'f5.outcome': 'Vous arrêtez de deviner où l\'argent fuit et vous le réparez par ordre d\'impact.',
      'f5.proof': 'Audit marché Schengen Alliance Travel — funnel complet + feuille de route en 3 phases.',
      'f5.stat1label': 'demandes analysées', 'f5.stat2label': 'taux de refus',
      'cap.summary': 'Voir toutes les capacités →', 'cap.hint': '5 capacités de plus, pour qui creuse.',
      'c1.name': 'Boutique & réservation', 'c1.promise': 'De la visite au paiement.',
      'c1.brief': 'Boutiques en ligne et systèmes de réservation pensés pour l\'achat local — paiement WhatsApp, flux cash, Shopify headless si pertinent.', 'c1.fam': 'Le Build',
      'c2.name': 'Design graphique & social', 'c2.promise': 'On scroll, on s\'arrête.',
      'c2.brief': 'Packs social, carrousels, infographies, print — depuis un système visuel verrouillé, pour que tout vous ressemble.', 'c2.fam': 'Le Build',
      'c3.name': 'Data science & analytics', 'c3.promise': 'Du signal dans le bruit.',
      'c3.brief': 'Vrai travail statistique — modélisation économétrique, séries temporelles, prévision, dashboards. Analyse testée et défendable.', 'c3.fam': "L'Engine",
      'c4.name': 'Systèmes de connaissance', 'c4.promise': 'Une entreprise qui se souvient.',
      'c4.brief': 'Architecture de connaissance interne — Obsidian/PARA + Zettelkasten, documentation, bases prêtes pour le RAG. Des structures qui s\'entretiennent seules.', 'c4.fam': "L'Esprit",
      'c5.name': 'Outils & skills IA sur mesure', 'c5.promise': 'Le logiciel qui construit votre logiciel.',
      'c5.brief': 'Outils internes, générateurs et skills sur mesure propulsés par Claude — une tâche répétitive devient une usine en un clic.', 'c5.fam': "L'Esprit",
      'trust.1': 'FR · EN · ع — trilingue', 'trust.2': 'Délais tenus', 'trust.3': 'Réponse < 24h',
      'trust.4': 'Zéro intermédiaire', 'trust.5': 'Révisions incluses', 'trust.6': 'Tous formats livrés',
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
      'svc.lead': 'Ten capabilities, three families. We feature five up front — the depth waits for whoever digs.',
      'svc.proofLabel': 'Proof', 'svc.flagship': '★ Flagship',
      'rail1': 'I · The Build', 'rail2': 'II · The Engine', 'rail3': 'III · The Mind',
      'fam1.label': 'Family I — The Build', 'fam1.tag': 'Where the idea becomes something people open, click, and buy through.',
      'fam2.label': 'Family II — The Engine', 'fam2.tag': 'Your moat — the machinery almost no local studio builds.',
      'fam3.label': 'Family III — The Mind', 'fam3.tag': 'Strategy, systems, and tools that compound.',
      'prev.tag': 'Signature offer', 'prev.name': 'The Preview', 'prev.promise': 'Zero risk. Just proof.',
      'prev.brief': 'We build a real, working demo of your site up front. Walk into the meeting, see it live, then decide.',
      'prev.outcome': 'The easiest yes you\'ll ever give — because you\'ve already seen it.',
      'f1.name': 'Sites & web applications', 'f1.promise': 'The obvious choice.',
      'f1.brief': 'Bespoke websites and web apps — fast, ranked, conversion-built, front-end to cloud. React · Next.js · Vite · Tailwind on Vercel. We don\'t theme a template; we build a thin design system and own every token.',
      'f1.outcome': 'A presence that punches three weight classes above your competitors\'.',
      'f1.proof': 'Doctor Cherfia Clinic · almaflowclim.fr · Étoile de l\'Est (PWA).',
      'f2.name': 'Branding & visual systems', 'f2.promise': 'Trust before a word is read.',
      'f2.brief': 'Logos, color, type, motion and the full design-system kit — primitive → semantic → component tokens, documented. The thing that makes a four-person studio look like a forty-person one.',
      'f2.outcome': 'Consistency that makes your client look like the category leader.',
      'f2.proof': 'Verdant (clinic system) · Éclat (IPTV system) · okami-streetwear.',
      'f3.name': 'Automation & pipelines', 'f3.promise': 'Delete the busywork.',
      'f3.brief': 'Scrapers, data pipelines, lead engines, workflow automations, internal tools. The repetitive, error-prone work quietly eating hours — we make it run itself at 3am. Python · Playwright · APIs · Claude.',
      'f3.outcome': 'The boring work disappears; your people do the work that needs a human.',
      'f3.proof': 'Playwright → Claude lead pipeline: scrape → enrich FR/AR → auto-generate demos → ZIP per business.',
      'f4.name': 'Market & product intelligence', 'f4.promise': 'See the market clearly.',
      'f4.brief': 'Turn the open web into a database. Competitor monitoring, price/product intelligence, lead enrichment across Maps, Facebook, Ouedkniss, Jumia, Instagram — structured, scored, queryable.',
      'f4.outcome': 'Decisions on evidence, not gut.',
      'f4.proof': 'Algeria e-commerce product-intelligence architecture · enriched acquisition database.',
      'f4.statlabel': 'leads enriched',
      'f5.name': 'Strategy & growth consulting', 'f5.promise': 'Data, not vibes.',
      'f5.brief': 'Full marketing audits, funnel analysis, competitive positioning, growth roadmaps — brutally honest, ROI-first, phased. We do the sector homework before the call.',
      'f5.outcome': 'You stop guessing where the money leaks and fix it in order of impact.',
      'f5.proof': 'Alliance Travel Schengen-market audit — full funnel + 3-phase roadmap.',
      'f5.stat1label': 'applications analyzed', 'f5.stat2label': 'refusal rate',
      'cap.summary': 'See every capability →', 'cap.hint': '5 more capabilities, for whoever digs.',
      'c1.name': 'E-commerce & booking', 'c1.promise': 'From browse to paid.',
      'c1.brief': 'Online stores and booking systems tuned for how people buy locally — WhatsApp checkout, cash-economy flows, headless Shopify when it fits.', 'c1.fam': 'The Build',
      'c2.name': 'Graphic & social design', 'c2.promise': 'Scroll-stopping, on brand.',
      'c2.brief': 'Social packs, carousels, infographics, print — all from one locked visual system so everything looks like you.', 'c2.fam': 'The Build',
      'c3.name': 'Data science & analytics', 'c3.promise': 'Signal out of noise.',
      'c3.brief': 'Real statistical work — econometric modeling, time-series, forecasting, dashboards. Tested, diagnosed, defensible analysis.', 'c3.fam': 'The Engine',
      'c4.name': 'Knowledge systems', 'c4.promise': 'A company that remembers.',
      'c4.brief': 'Internal knowledge architecture — Obsidian/PARA + Zettelkasten, documentation, RAG-ready bases. Self-maintaining structures.', 'c4.fam': 'The Mind',
      'c5.name': 'Custom AI tools & skills', 'c5.promise': 'Software that builds your software.',
      'c5.brief': 'Claude-powered internal tools, generators and custom skills — a repeatable task becomes a one-click factory.', 'c5.fam': 'The Mind',
      'trust.1': 'FR · EN · ع — trilingual', 'trust.2': 'Deadlines kept', 'trust.3': 'Reply < 24h',
      'trust.4': 'Zero middlemen', 'trust.5': 'Revisions included', 'trust.6': 'Every format delivered',
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
      'svc.lead': 'عشر قدرات، ثلاث عائلات. نُبرز خمساً في المقدّمة — والعمق ينتظر من يبحث.',
      'svc.proofLabel': 'الإثبات', 'svc.flagship': '★ الرائد',
      'rail1': '١ · البناء', 'rail2': '٢ · المحرّك', 'rail3': '٣ · العقل',
      'fam1.label': 'العائلة الأولى — البناء', 'fam1.tag': 'حيث تصير الفكرة شيئاً يفتحه الناس ويضغطونه ويشترون عبره.',
      'fam2.label': 'العائلة الثانية — المحرّك', 'fam2.tag': 'خندقك — الآلة التي لا يبنيها أيّ استوديو محلّي تقريباً.',
      'fam3.label': 'العائلة الثالثة — العقل', 'fam3.tag': 'الاستراتيجية والأنظمة والأدوات التي تتراكم.',
      'prev.tag': 'عرض مميّز', 'prev.name': 'المعاينة', 'prev.promise': 'بلا مخاطرة. مجرّد إثبات.',
      'prev.brief': 'نبني نسخة تجريبية حقيقية وعاملة من موقعك مسبقاً. تدخل الاجتماع، تراها حيّة، ثم تقرّر.',
      'prev.outcome': 'أسهل «نعم» ستقولها — لأنّك رأيتها بالفعل.',
      'f1.name': 'مواقع وتطبيقات ويب', 'f1.promise': 'الخيار البديهي.',
      'f1.brief': 'مواقع وتطبيقات ويب مخصّصة — سريعة، مُحسّنة للبحث، مبنية للتحويل، من الواجهة إلى السحابة. React · Next.js · Vite · Tailwind على Vercel. لا نُلبِس قالباً جاهزاً؛ نبني نظام تصميم رفيعاً ونملك كل token.',
      'f1.outcome': 'حضورٌ يتفوّق على منافسيك بثلاث مراتب.',
      'f1.proof': 'Doctor Cherfia Clinic · almaflowclim.fr · Étoile de l\'Est (PWA).',
      'f2.name': 'الهوية والأنظمة البصرية', 'f2.promise': 'الثقة قبل قراءة كلمة.',
      'f2.brief': 'شعارات، ألوان، خطوط، حركة، وطقم نظام التصميم الكامل — رموز أوّلية ← دلالية ← مكوّنات، موثّقة. ما يجعل استوديو من أربعة يبدو كاستوديو من أربعين.',
      'f2.outcome': 'اتّساقٌ يجعل عميلك يبدو قائد فئته.',
      'f2.proof': 'Verdant (نظام عيادة) · Éclat (نظام IPTV) · okami-streetwear.',
      'f3.name': 'الأتمتة والأنابيب', 'f3.promise': 'احذف العمل الممل.',
      'f3.brief': 'كاشطات، أنابيب بيانات، محرّكات عملاء، أتمتة سير العمل، أدوات داخلية. العمل المتكرّر الهشّ الذي يلتهم ساعاتك — نجعله يعمل وحده عند الثالثة فجراً. بايثون · Playwright · واجهات · Claude.',
      'f3.outcome': 'العمل الممل يختفي؛ وفريقك ينجز ما يحتاج إنساناً.',
      'f3.proof': 'أنبوب Playwright ← Claude: كشط ← إثراء فرنسي/عربي ← توليد نماذج ← ZIP لكل نشاط.',
      'f4.name': 'استخبارات السوق والمنتج', 'f4.promise': 'رؤية السوق بوضوح.',
      'f4.brief': 'حوّل الويب المفتوح إلى قاعدة بيانات. مراقبة المنافسين، استخبارات الأسعار والمنتجات، إثراء العملاء عبر Maps وFacebook وOuedkniss وJumia وInstagram — مهيكلة، مُقيَّمة، قابلة للاستعلام.',
      'f4.outcome': 'قراراتٌ على الأدلّة لا على الحدس.',
      'f4.proof': 'بنية استخبارات منتجات التجارة الإلكترونية في الجزائر · قاعدة عملاء مُثراة.',
      'f4.statlabel': 'عميلاً مُثرى',
      'f5.name': 'الاستراتيجية واستشارات النمو', 'f5.promise': 'بيانات، لا انطباعات.',
      'f5.brief': 'تدقيقات تسويقية كاملة، تحليل قمع، تموضع تنافسي، خرائط نمو — صريحة، تضع العائد أولاً، على مراحل. ننجز واجب القطاع قبل المكالمة.',
      'f5.outcome': 'تتوقّف عن تخمين مكان تسرّب المال وتصلحه بترتيب الأثر.',
      'f5.proof': 'تدقيق سوق شنغن لـ Alliance Travel — قمع كامل + خارطة من ٣ مراحل.',
      'f5.stat1label': 'طلباً حُلِّل', 'f5.stat2label': 'نسبة الرفض',
      'cap.summary': 'اعرض كل القدرات →', 'cap.hint': '٥ قدرات أخرى، لمن يبحث.',
      'c1.name': 'متجر وحجز', 'c1.promise': 'من التصفّح إلى الدفع.',
      'c1.brief': 'متاجر إلكترونية وأنظمة حجز مضبوطة على طريقة الشراء المحلّية — دفع واتساب، تدفّقات نقدية، Shopify headless عند الحاجة.', 'c1.fam': 'البناء',
      'c2.name': 'تصميم جرافيكي واجتماعي', 'c2.promise': 'يوقف التمرير، على الهوية.',
      'c2.brief': 'حزم اجتماعية، كاروسيل، إنفوجرافيك، مطبوعات — من نظام بصري واحد مُقفل، ليبدو كلّ شيء أنت.', 'c2.fam': 'البناء',
      'c3.name': 'علم البيانات والتحليلات', 'c3.promise': 'إشارة من الضجيج.',
      'c3.brief': 'عمل إحصائي حقيقي — نمذجة قياسية، سلاسل زمنية، تنبّؤ، لوحات. تحليلٌ مُختبَر وقابل للدفاع.', 'c3.fam': 'المحرّك',
      'c4.name': 'أنظمة المعرفة', 'c4.promise': 'شركة تتذكّر.',
      'c4.brief': 'بنية معرفة داخلية — Obsidian/PARA + Zettelkasten، توثيق، قواعد جاهزة للـ RAG. بنى تصون نفسها.', 'c4.fam': 'العقل',
      'c5.name': 'أدوات ومهارات ذكاء اصطناعي مخصّصة', 'c5.promise': 'برمجيات تبني برمجياتك.',
      'c5.brief': 'أدوات داخلية ومولّدات ومهارات مخصّصة بقوّة Claude — مهمّة متكرّرة تصبح مصنعاً بنقرة.', 'c5.fam': 'العقل',
      'trust.1': 'FR · EN · ع — ثلاثية اللغة', 'trust.2': 'مواعيد محترمة', 'trust.3': 'ردّ < ٢٤ ساعة',
      'trust.4': 'بلا وسطاء', 'trust.5': 'مراجعات مشمولة', 'trust.6': 'كل الصيغ مُسلّمة',
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
    var dur = 1200, start = null;
    function frame(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + group(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = prefix + group(target) + suffix;
    }
    requestAnimationFrame(frame);
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
    var THEMES = ['arcanum', 'noir', 'daylight', 'mono', 'altneon'];
    function applyTheme(t) {
      if (THEMES.indexOf(t) === -1) t = 'arcanum';
      document.documentElement.setAttribute('data-theme', t);
      document.querySelectorAll('.theme-menu button').forEach(function (b) {
        b.setAttribute('aria-checked', b.getAttribute('data-theme-val') === t ? 'true' : 'false');
      });
      try { localStorage.setItem('numidea-theme', t); } catch (e) {}
    }
    var savedTheme = 'arcanum';
    try { savedTheme = localStorage.getItem('numidea-theme') || 'arcanum'; } catch (e) {}
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

    // services family rail — scroll-spy
    var rail = document.querySelectorAll('.rail-item');
    var families = document.querySelectorAll('.family');
    if (rail.length && families.length && 'IntersectionObserver' in window) {
      var inView = {};
      function setActive(id) {
        rail.forEach(function (r) {
          var on = !!id && r.getAttribute('href') === '#' + id;
          r.classList.toggle('active', on);
          if (on) r.setAttribute('aria-current', 'true'); else r.removeAttribute('aria-current');
        });
      }
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { inView[en.target.id] = en.isIntersecting; });
        // highlight the first family (document order) currently in the band; clear if none
        var active = null;
        families.forEach(function (f) { if (active === null && inView[f.id]) active = f.id; });
        setActive(active);
      }, { rootMargin: '-20% 0px -55% 0px', threshold: 0 });
      families.forEach(function (f) { spy.observe(f); });
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
        return '<a class="proj' + brand + '" data-cat="' + esc(p.cat) + '" href="#/work/' + p.slug + '"' + style + '>'
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
        // Static site, no backend: hand the lead off to the visitor's mail client,
        // pre-filled to hello@numidealabs.com. Only show success after the handoff.
        var subject = 'Numidea Labs · ' + name;
        var body = name + ' <' + email + '>\n\n' + msg;
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
