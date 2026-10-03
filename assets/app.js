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
      'hero.plateLive': 'en ligne',
      'tb.project': 'Projet', 'tb.stack': 'Pile', 'tb.lang': 'Langues', 'tb.deploy': 'Déploiement', 'tb.status': 'État',
      'tb.stackV': 'dépendance · sans build', 'tb.deployV': '18 s · Actions',
      'sheet.scale': 'Éch. 1:1', 'sheet.rev': 'Rév. 2026-08', 'sheet.sheet': 'Feuille 01',
      'proof.kicker': '01 — Preuves',
      'proof.s1': 'projets livrés', 'proof.s2': 'spécialistes', 'proof.s3': 'langues', 'proof.s4': 'de réponse',
      'proof.line': 'De vrais clients. De vrais déploiements. Les preuves sont plus bas — ouvrez-les.',
      'svc.kicker': '03 — Services',
      'svc.title': 'Ce qu\'on <em>rend réel.</em>',
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
      'how.kicker': '05 — Méthode',
      'how.title': 'Aucun <em>intermédiaire.</em>',
      'how1.h': 'Vous parlez au constructeur.', 'how1.p': 'Pas de chef de projet, pas de téléphone arabe. Celui qui cadre, c\'est celui qui livre.',
      'how2.h': 'Une équipe possède toute la chaîne.', 'how2.p': 'Design → code → déploiement. Rien ne se perd dans un transfert qui n\'a jamais lieu.',
      'how3.h': 'On répond quand ça casse.', 'how3.p': 'Délais tenus, réponse en moins de 24h. Après le lancement, toujours là.',
      'scene.kicker': '◆ PLAN D\'ATELIER · PLANCHE PAR PLANCHE', 'scene.title': 'Les projets, comme un plan.',
      'scene.lead': 'Chaque projet dessiné comme une planche d\'ingénierie : cotes, statuts honnêtes, et le site en vrai.',
      'scene.cta': 'Ouvrir les planches →',
      'founder.kicker': '06 — Équipe & fondateur', 'founder.title': 'Le studio a un <em>visage.</em>',
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
      'form.success': 'Votre messagerie devrait s\'ouvrir avec le message prêt — il ne reste qu\'à l\'envoyer.',
      'form.successAlt': 'Rien ne s\'est ouvert ? Écrivez-nous directement :',
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
      'hero.lede': 'Four specialists who design, build, and ship the whole chain — from the back-end to the last pixel. Powerful systems, made accessible, and answered for when they break.',
      'hero.cta1': 'Let\'s build it →', 'hero.cta2': 'See the proof',
      'hero.plateLive': 'live',
      'tb.project': 'Project', 'tb.stack': 'Stack', 'tb.lang': 'Languages', 'tb.deploy': 'Deploy', 'tb.status': 'Status',
      'tb.stackV': 'dependency · no build step', 'tb.deployV': '18 s · Actions',
      'sheet.scale': 'Scale 1:1', 'sheet.rev': 'Rev. 2026-08', 'sheet.sheet': 'Sheet 01',
      'proof.kicker': '01 — Proof',
      'proof.s1': 'projects shipped', 'proof.s2': 'specialists', 'proof.s3': 'languages', 'proof.s4': 'response',
      'proof.line': 'Real clients. Real deployments. The receipts are below — open them.',
      'svc.kicker': '03 — Services',
      'svc.title': 'What we <em>make real.</em>',
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
      'how.kicker': '05 — How we work',
      'how.title': 'No <em>middlemen.</em>',
      'how1.h': 'You talk to the builder.', 'how1.p': 'No account manager, no telephone game. Whoever scopes it, ships it.',
      'how2.h': 'One team owns the whole chain.', 'how2.p': 'Design → code → deploy. Nothing gets lost in a handoff that never happens.',
      'how3.h': 'We answer when it breaks.', 'how3.p': 'Deadlines kept, replies in under 24h. After launch, still here.',
      'scene.kicker': '◆ ATELIER DRAWING · SHEET BY SHEET', 'scene.title': 'The work, as a drawing.',
      'scene.lead': 'Every project drawn as an engineering sheet: dimensions, honest statuses, and the real site.',
      'scene.cta': 'Open the sheets →',
      'founder.kicker': '06 — Team & founder', 'founder.title': 'The studio has a <em>face.</em>',
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
      'form.success': 'Your mail app should open with the message ready — all that is left is to send it.',
      'form.successAlt': 'Nothing opened? Write to us directly:',
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
      'hero.lede': 'أربعة مختصّين يصمّمون ويبرمجون ويُطلقون السلسلة كاملةً — من الواجهة الخلفية إلى آخر بكسل. أنظمةٌ قوية، مُتاحةٌ للجميع، ونتحمّل مسؤوليتها حين تتعطّل.',
      'hero.cta1': 'لنبنِ →', 'hero.cta2': 'شاهد الإثبات',
      'hero.plateLive': 'مباشر',
      'tb.project': 'المشروع', 'tb.stack': 'التقنيات', 'tb.lang': 'اللغات', 'tb.deploy': 'النشر', 'tb.status': 'الحالة',
      'tb.stackV': 'اعتمادية · بلا بناء', 'tb.deployV': '١٨ ث · Actions',
      'sheet.scale': 'مقياس ١:١', 'sheet.rev': 'مراجعة ٢٠٢٦-٠٨', 'sheet.sheet': 'لوحة ٠١',
      'proof.kicker': '٠١ — الإثبات',
      'proof.s1': 'مشروعاً مُسلَّماً', 'proof.s2': 'مختصّين', 'proof.s3': 'لغات', 'proof.s4': 'زمن الردّ',
      'proof.line': 'عملاء حقيقيون. عمليات نشر حقيقية. الإثباتات في الأسفل — افتحها.',
      'svc.kicker': '٠٣ — الخدمات',
      'svc.title': 'ما الذي <em>نجعله حقيقة.</em>',
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
      'how.kicker': '٠٥ — كيف نعمل',
      'how.title': 'بلا <em>وسطاء.</em>',
      'how1.h': 'تتحدّث إلى من يبني.', 'how1.p': 'لا مدير حساب، ولا هاتف مكسور. من يضع النطاق هو من يُسلّم.',
      'how2.h': 'فريق واحد يملك السلسلة كاملة.', 'how2.p': 'تصميم ← كود ← نشر. لا شيء يضيع في تسليم لا يحدث أبداً.',
      'how3.h': 'نردّ حين يتعطّل شيء.', 'how3.p': 'مواعيد محترمة، وردّ في أقل من ٢٤ ساعة. بعد الإطلاق، ما زلنا هنا.',
      'scene.kicker': '◆ مخطط الورشة · لوحةً بلوحة', 'scene.title': 'الأعمال، كمخطط.',
      'scene.lead': 'كل مشروع مرسوم كلوحة هندسية: أبعاد، وحالات صادقة، والموقع الحقيقي.',
      'scene.cta': 'افتح اللوحات →',
      'founder.kicker': '٠٦ — الفريق والمؤسّس', 'founder.title': 'للاستوديو <em>وجه.</em>',
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
      'form.success': 'من المفترض أن يفتح تطبيق البريد والرسالة جاهزة — لم يبقَ سوى إرسالها.',
      'form.successAlt': 'لم يفتح شيء؟ راسلنا مباشرة:',
      'footer.signoff': 'بُني في برج بوعريريج، بقهوة سوداء و TypeScript.',
      'footer.rights': '© ٢٠٢٦ نوميديا لابز · كل الحقوق محفوظة',
      'footer.tag': 'جذورها في نوميديا · مبنيّة على الأفكار'
    }
  };

  /* ---- Services Catalog + Trust strip strings (merged into I18N) ---- */
  var EXTRA = {
    fr: {
      'mk.h': 'Ici et ailleurs',
      'mk.p': "Le même projet, chiffré sur trois marchés. Fourchettes courantes 2026, du freelance confirmé à l'agence — hors taxes.",
      'mk.curL': 'Afficher en', 'mk.curNative': "Devise d'origine",
      'mk.cap': 'Fourchettes de prix courantes par type de projet',
      'mk.colType': 'Projet', 'mk.colDz': 'Algérie', 'mk.colNl': 'Numidea', 'mk.colFr': 'France', 'mk.colUs': 'États-Unis',
      'mk.day1': 'Une journée de développeur confirmé en France',
      'mk.day2': "au taux officiel — l'ordre de prix d'un site vitrine entier sur le marché algérien.",
      'mk.note': "Conversions au taux officiel de la Banque d'Algérie, début octobre 2026 : 1 € ≈ 151 DA, 1 $ ≈ 134 DA. L'écart tient au coût de la vie et au change, pas aux outils — nous livrons avec le même stack que les studios européens et américains : React, Next.js, Vercel.",
      'mk.srcSum': 'Sources et méthode',
      'mk.method': "Chaque case va du bas de la fourchette d'un freelance confirmé au haut de celle d'une agence ; « + » signale une borne haute ouverte. Les extrêmes — sites à 300 € ou à 250 000 $ — sont exclus. La colonne Numidea est calculée par l'estimateur ci-dessus, au périmètre type de chaque projet.",
      'mk.srcDz': 'Algérie', 'mk.srcFr': 'France', 'mk.srcUs': 'États-Unis', 'mk.srcFx': 'Change',
      'md.h': 'Comment un projet est chiffré',
      'md.p': 'Il y a quatre façons de facturer un projet. Chacune est la norme quelque part.',
      'md.ours': 'Notre modèle',
      'md.fH': 'Au forfait', 'md.fP': "Un prix fixe pour un périmètre écrit. Si le travail déborde, c'est le prestataire qui absorbe l'écart.",
      'md.fW': "La norme en Algérie : le baromètre Onyxlab chiffre tout le développement au forfait. C'est ainsi que nous chiffrons chaque projet.",
      'md.tH': 'Au temps passé', 'md.tP': "Facturé au jour ou à l'heure. Souple quand le périmètre bouge, difficile à budgéter d'avance.",
      'md.tW': "La norme en France (480 –⁠ 650 € par jour pour un développeur confirmé) et aux États-Unis (100 –⁠ 149 $ de l'heure en agence).",
      'md.aH': "À l'abonnement", 'md.aP': 'Un montant mensuel pour un service continu : maintenance, évolutions, contenu.',
      'md.aW': 'Courant partout après le lancement. C\'est le modèle de notre maintenance : 18 000 –⁠ 60 000 DA par mois.',
      'md.vH': 'À la valeur', 'md.vP': "Le prix suit ce que le projet rapporte, pas le temps qu'il demande.",
      'md.vW': "Plus rare, surtout en conseil et en stratégie, là où l'enjeu se mesure.",
      'md.drH': 'Ce qui fait bouger un devis',
      'md.d1h': 'Le périmètre', 'md.d1p': "Le nombre de pages, de produits ou d'écrans.",
      'md.d2h': 'Le design', 'md.d2p': "Sur mesure, ou adapté d'un modèle existant.",
      'md.d3h': 'Les langues', 'md.d3p': "Chaque langue ajoute du contenu ; l'arabe ajoute une mise en page de droite à gauche.",
      'md.d4h': 'Les intégrations', 'md.d4p': 'Paiement, comptes utilisateurs, outils et API tiers.',
      'md.d5h': 'Le contenu', 'md.d5p': 'Textes, photos et vidéos : fournis par vous, ou à produire.',
      'md.d6h': 'Le délai', 'md.d6p': 'Un calendrier compressé coûte plus cher : +25 % dans notre estimateur.',
      'price.waSoonSuffix': ' · bientôt',
      'nav.pricing': 'Tarifs',
      'wa.hello': "Bonjour Numidea Labs — j'aimerais parler d'un projet.",
      'footer.wa': 'WhatsApp',
      'price.kicker': '04 — Tarifs', 'price.title': 'Un prix <em>avant le devis.</em>',
      'price.lead': "Les fourchettes réelles du marché algérien, publiées. Réglez le périmètre, voyez l'estimation bouger — puis recevez un prix ferme sous 24 heures.",
      'price.cur': 'DA',
      'price.freeH': "L'Aperçu reste gratuit.",
      'price.freeP': "Avant le moindre dinar, on construit une démo réelle et fonctionnelle de votre projet. Vous la voyez tourner, puis vous décidez. Rien de ce qui suit ne s'engage sans ça.",
      'price.popular': 'Le plus choisi',
      'price.t1fam': 'Le Build', 'price.t1name': 'Essentiel', 'price.t1for': 'Une présence crédible, vite en ligne.', 'price.t1time': '2 à 4 semaines',
      'price.t1a': 'Vitrine ou landing, 1 à 5 pages',
      'price.t1b': 'Design sur mesure — jamais un template rethémé',
      'price.t1c': 'Responsive, performance et SEO de base',
      'price.t1d': 'Mise en ligne, domaine et certificat configurés',
      'price.t1e': '1 mois de support inclus',
      'price.t2fam': 'Le Build', 'price.t2name': 'Studio', 'price.t2for': "Le site qui porte vraiment l'entreprise.", 'price.t2time': '3 à 7 semaines',
      'price.t2a': 'Site sur mesure, 6 à 15 pages',
      'price.t2b': 'Trilingue FR / EN / AR, avec un arabe RTL pensé nativement',
      'price.t2c': 'Design system documenté — tokens, composants, le kit complet',
      'price.t2d': 'CMS ou back-office pour gérer le contenu vous-même',
      'price.t2e': 'SEO technique, Core Web Vitals, accessibilité',
      'price.t2f': '3 mois de support inclus',
      'price.t3fam': 'Le Moteur', 'price.t3name': 'Moteur', 'price.t3for': "La machinerie que presque personne ne construit ici.", 'price.t3time': '8 à 16 semaines',
      'price.t3a': "E-commerce, application web ou pipeline d'automatisation",
      'price.t3b': 'Paiement, comptes utilisateurs, tableaux de bord',
      'price.t3c': 'Scraping et intelligence marché — le web ouvert en base de données',
      'price.t3d': 'Intégrations API et outils internes',
      'price.t3e': '6 mois de support inclus',
      'price.retainer': 'Maintenance après livraison, si vous la voulez : 18 000 –⁠ 60 000 DA par mois. Sans engagement de durée.',
      'price.estH': 'Estimez votre projet',
      'price.estP': 'Réglez ce dont vous avez besoin. La fourchette se recalcule en direct, sur les mêmes chiffres que les paliers ci-dessus.',
      'price.qType': 'Quel type de projet ?', 'price.qSize': 'Ampleur', 'price.qOpts': "Ce qu'il vous faut en plus", 'price.qPace': 'Délai',
      'price.tyVitrine': 'Vitrine', 'price.tyCustom': 'Site sur mesure', 'price.tyShop': 'E-commerce',
      'price.tyApp': 'Application web', 'price.tyAuto': 'Automatisation', 'price.tyBrand': 'Identité visuelle',
      'price.oI18n': 'Trilingue FR / EN / AR + RTL', 'price.oCms': 'CMS / back-office', 'price.oPay': 'Paiement en ligne',
      'price.oDs': 'Design system complet', 'price.oSeo': 'SEO avancé & performance', 'price.oApi': 'Intégrations API',
      'price.paceStd': 'Standard', 'price.paceRush': 'Accéléré',
      'price.uPages': 'pages', 'price.uScreens': 'écrans', 'price.uProducts': 'produits', 'price.uFlows': 'flux', 'price.uSupports': 'supports',
      'price.estimate': 'Estimation', 'price.weeks': 'semaines',
      'price.estFine': "Fourchette indicative, pas un devis. Le prix ferme arrive sous 24 heures, une fois le périmètre cadré ensemble — et il ne bouge plus ensuite.",
      'price.estCta': 'Obtenir le prix ferme →',
      'price.obH': 'Comment on démarre', 'price.obP': 'Quatre étapes. Vous ne payez rien avant la troisième.',
      'price.ob1h': 'Vous décrivez le projet', 'price.ob1p': 'Deux minutes, par écrit ou de vive voix. En français, anglais ou arabe.',
      'price.ob2h': 'On revient sous 24 heures', 'price.ob2p': 'Avec un périmètre écrit et un prix ferme. Pas une fourchette, un chiffre.',
      'price.ob3h': "On construit L'Aperçu — gratuit", 'price.ob3p': 'Une démo réelle de votre projet, avant paiement. Vous la voyez tourner en direct.',
      'price.ob4h': 'Vous décidez', 'price.ob4p': "Si c'est non, vous ne devez rien. Si c'est oui, on est déjà à mi-chemin.",
      'price.obCta1': 'Décrire mon projet →', 'price.obCta2': 'WhatsApp',
      'price.waSoon': 'WhatsApp — bientôt',
      'svc.famBuild': 'Le Build', 'svc.famEngine': 'Le Moteur', 'svc.famMind': "L'Esprit",
      'svc.lead': 'Cinq offres en avant, cinq capacités en réserve — la profondeur attend ceux qui creusent.',
      'prev.tag': 'Offre signature', 'prev.name': "L'Aperçu", 'prev.promise': 'Zéro risque. Juste la preuve.',
      'prev.brief': 'On construit une démo réelle et fonctionnelle de votre site, en amont. Vous arrivez en réunion, vous la voyez en direct, puis vous décidez.',
      'prev.outcome': 'Le « oui » le plus facile que vous donnerez — parce que vous l\'avez déjà vu.',
      'f1.name': 'Sites & applications web', 'f1.promise': 'Le choix évident.',
      'f1.brief': 'Sites et applications web sur mesure — rapides, référencés, pensés pour convertir, du front-end au cloud. React · Next.js · Vite · Tailwind sur Vercel. On ne thème pas un template ; on construit un design system fin et on possède chaque token.',
      'f2.name': 'Identité & systèmes visuels', 'f2.promise': 'La confiance avant le premier mot.',
      'f2.brief': 'Logos, couleur, typo, motion et le kit design-system complet — tokens primitifs → sémantiques → composants, documentés. Ce qui fait passer un studio de quatre pour un de quarante.',
      'f3.name': 'Automatisation & pipelines', 'f3.promise': 'Supprimez la corvée.',
      'f3.brief': 'Scrapers, pipelines de données, moteurs de leads, automatisations, outils internes. Le travail répétitif et fragile qui dévore vos heures — on le fait tourner seul à 3h du matin. Python · Playwright · APIs · Claude.',
      'f4.name': 'Intelligence marché & produit', 'f4.promise': 'Voir le marché clairement.',
      'f4.brief': 'Transformez le web ouvert en base de données. Veille concurrentielle, intelligence prix/produit, enrichissement de leads sur Maps, Facebook, Ouedkniss, Jumia, Instagram — structuré, scoré, requêtable.',
      'f5.name': 'Stratégie & conseil croissance', 'f5.promise': 'De la donnée, pas des impressions.',
      'f5.brief': 'Audits marketing complets, analyse de funnels, positionnement concurrentiel, feuilles de route — honnêtes, ROI d\'abord, par phases. On fait les devoirs sur votre secteur avant l\'appel.',
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
      'mk.h': 'Here and elsewhere',
      'mk.p': 'The same project, priced in three markets. Typical 2026 ranges, from an experienced freelancer to an agency — excluding tax.',
      'mk.curL': 'Show in', 'mk.curNative': 'Original currency',
      'mk.cap': 'Typical price ranges by project type',
      'mk.colType': 'Project', 'mk.colDz': 'Algeria', 'mk.colNl': 'Numidea', 'mk.colFr': 'France', 'mk.colUs': 'United States',
      'mk.day1': 'One day of an experienced developer in France',
      'mk.day2': 'at the official rate — roughly the price of an entire showcase site on the Algerian market.',
      'mk.note': "Converted at the Bank of Algeria's official rate, early October 2026: €1 ≈ 151 DZD, $1 ≈ 134 DZD. The gap comes from cost of living and exchange rates, not tools — we ship on the same stack as European and American studios: React, Next.js, Vercel.",
      'mk.srcSum': 'Sources and method',
      'mk.method': "Each cell runs from the low end of an experienced freelancer's range to the high end of an agency's; \u201c+\u201d marks an open upper bound. Extremes — €300 sites or $250,000 builds — are left out. The Numidea column is computed by the estimator above, at each project's typical scope.",
      'mk.srcDz': 'Algeria', 'mk.srcFr': 'France', 'mk.srcUs': 'United States', 'mk.srcFx': 'Exchange rate',
      'md.h': 'How a project is priced',
      'md.p': 'There are four ways to bill a project. Each one is the norm somewhere.',
      'md.ours': 'Our model',
      'md.fH': 'Fixed price', 'md.fP': 'One fixed price for a written scope. If the work overruns, the provider absorbs the difference.',
      'md.fW': "The norm in Algeria: the Onyxlab barometer prices all development as a fixed fee. It's how we price every project.",
      'md.tH': 'Time and materials', 'md.tP': 'Billed by the day or the hour. Flexible when the scope moves, hard to budget in advance.',
      'md.tW': 'The norm in France (€480–650 a day for an experienced developer) and the US ($100–149 an hour at agencies).',
      'md.aH': 'Retainer', 'md.aP': 'A monthly fee for an ongoing service: maintenance, improvements, content.',
      'md.aW': "Common everywhere after launch. It's how our maintenance works: 18,000–60,000 DZD a month.",
      'md.vH': 'Value-based', 'md.vP': 'The price follows what the project earns, not the time it takes.',
      'md.vW': 'Rarer, mostly in consulting and strategy, where the stakes can be measured.',
      'md.drH': 'What moves a quote',
      'md.d1h': 'Scope', 'md.d1p': 'The number of pages, products or screens.',
      'md.d2h': 'Design', 'md.d2p': 'Fully custom, or adapted from an existing template.',
      'md.d3h': 'Languages', 'md.d3p': 'Each language adds content; Arabic adds a right-to-left layout.',
      'md.d4h': 'Integrations', 'md.d4p': 'Payments, user accounts, third-party tools and APIs.',
      'md.d5h': 'Content', 'md.d5p': 'Copy, photos and video: supplied by you, or produced.',
      'md.d6h': 'Timeline', 'md.d6p': 'A compressed schedule costs more: +25% in our estimator.',
      'price.waSoonSuffix': ' · soon',
      'nav.pricing': 'Pricing',
      'wa.hello': 'Hello Numidea Labs — I would like to talk about a project.',
      'footer.wa': 'WhatsApp',
      'price.kicker': '04 — Pricing', 'price.title': 'A price <em>before the quote.</em>',
      'price.lead': 'The real Algerian market ranges, published. Set the scope, watch the estimate move — then get a firm price within 24 hours.',
      'price.cur': 'DZD',
      'price.freeH': 'The Preview stays free.',
      'price.freeP': 'Before a single dinar, we build a real, working demo of your project. You watch it run, then you decide. Nothing below commits you without that.',
      'price.popular': 'Most chosen',
      'price.t1fam': 'The Build', 'price.t1name': 'Essential', 'price.t1for': 'A credible presence, live quickly.', 'price.t1time': '2 to 4 weeks',
      'price.t1a': 'Showcase or landing site, 1 to 5 pages',
      'price.t1b': 'Custom design — never a re-themed template',
      'price.t1c': 'Responsive, fast, with foundational SEO',
      'price.t1d': 'Deployment, domain and certificate configured',
      'price.t1e': '1 month of support included',
      'price.t2fam': 'The Build', 'price.t2name': 'Studio', 'price.t2for': 'The site that actually carries the business.', 'price.t2time': '3 to 7 weeks',
      'price.t2a': 'Custom site, 6 to 15 pages',
      'price.t2b': 'Trilingual FR / EN / AR, with Arabic RTL built natively',
      'price.t2c': 'Documented design system — tokens, components, the full kit',
      'price.t2d': 'CMS or back-office so you manage the content yourself',
      'price.t2e': 'Technical SEO, Core Web Vitals, accessibility',
      'price.t2f': '3 months of support included',
      'price.t3fam': 'The Engine', 'price.t3name': 'Engine', 'price.t3for': 'The machinery almost nobody here builds.', 'price.t3time': '8 to 16 weeks',
      'price.t3a': 'E-commerce, web application or automation pipeline',
      'price.t3b': 'Payments, user accounts, dashboards',
      'price.t3c': 'Scraping and market intelligence — the open web as a database',
      'price.t3d': 'API integrations and internal tools',
      'price.t3e': '6 months of support included',
      'price.retainer': 'Maintenance after launch, if you want it: 18,000 –⁠ 60,000 DZD per month. No lock-in.',
      'price.estH': 'Estimate your project',
      'price.estP': 'Set what you need. The range recalculates live, on the same numbers the tiers above quote.',
      'price.qType': 'What kind of project?', 'price.qSize': 'Scale', 'price.qOpts': 'What else you need', 'price.qPace': 'Timeline',
      'price.tyVitrine': 'Showcase site', 'price.tyCustom': 'Custom site', 'price.tyShop': 'E-commerce',
      'price.tyApp': 'Web application', 'price.tyAuto': 'Automation', 'price.tyBrand': 'Visual identity',
      'price.oI18n': 'Trilingual FR / EN / AR + RTL', 'price.oCms': 'CMS / back-office', 'price.oPay': 'Online payments',
      'price.oDs': 'Full design system', 'price.oSeo': 'Advanced SEO & performance', 'price.oApi': 'API integrations',
      'price.paceStd': 'Standard', 'price.paceRush': 'Accelerated',
      'price.uPages': 'pages', 'price.uScreens': 'screens', 'price.uProducts': 'products', 'price.uFlows': 'flows', 'price.uSupports': 'deliverables',
      'price.estimate': 'Estimate', 'price.weeks': 'weeks',
      'price.estFine': 'An indicative range, not a quote. The firm price arrives within 24 hours once we have scoped it together — and it does not move after that.',
      'price.estCta': 'Get the firm price →',
      'price.obH': 'How we start', 'price.obP': 'Four steps. You pay nothing before the third.',
      'price.ob1h': 'You describe the project', 'price.ob1p': 'Two minutes, in writing or out loud. In French, English or Arabic.',
      'price.ob2h': 'We come back within 24 hours', 'price.ob2p': 'With a written scope and a firm price. Not a range — a number.',
      'price.ob3h': 'We build the Preview — free', 'price.ob3p': 'A real demo of your project, before payment. You watch it run live.',
      'price.ob4h': 'You decide', 'price.ob4p': 'If it is no, you owe nothing. If it is yes, we are already halfway.',
      'price.obCta1': 'Describe my project →', 'price.obCta2': 'WhatsApp',
      'price.waSoon': 'WhatsApp — soon',
      'svc.famBuild': 'The Build', 'svc.famEngine': 'The Engine', 'svc.famMind': 'The Mind',
      'svc.lead': 'Five offers up front, five more in reserve — the depth waits for whoever digs.',
      'prev.tag': 'Signature offer', 'prev.name': 'The Preview', 'prev.promise': 'Zero risk. Just proof.',
      'prev.brief': 'We build a real, working demo of your site up front. Walk into the meeting, see it live, then decide.',
      'prev.outcome': 'The easiest yes you\'ll ever give — because you\'ve already seen it.',
      'f1.name': 'Sites & web applications', 'f1.promise': 'The obvious choice.',
      'f1.brief': 'Bespoke websites and web apps — fast, ranked, conversion-built, front-end to cloud. React · Next.js · Vite · Tailwind on Vercel. We don\'t theme a template; we build a thin design system and own every token.',
      'f2.name': 'Branding & visual systems', 'f2.promise': 'Trust before a word is read.',
      'f2.brief': 'Logos, color, type, motion and the full design-system kit — primitive → semantic → component tokens, documented. The thing that makes a four-person studio look like a forty-person one.',
      'f3.name': 'Automation & pipelines', 'f3.promise': 'Delete the busywork.',
      'f3.brief': 'Scrapers, data pipelines, lead engines, workflow automations, internal tools. The repetitive, error-prone work quietly eating hours — we make it run itself at 3am. Python · Playwright · APIs · Claude.',
      'f4.name': 'Market & product intelligence', 'f4.promise': 'See the market clearly.',
      'f4.brief': 'Turn the open web into a database. Competitor monitoring, price/product intelligence, lead enrichment across Maps, Facebook, Ouedkniss, Jumia, Instagram — structured, scored, queryable.',
      'f5.name': 'Strategy & growth consulting', 'f5.promise': 'Data, not vibes.',
      'f5.brief': 'Full marketing audits, funnel analysis, competitive positioning, growth roadmaps — brutally honest, ROI-first, phased. We do the sector homework before the call.',
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
      'mk.h': 'هنا وفي الخارج',
      'mk.p': 'المشروع نفسه، مسعّراً في ثلاثة أسواق. النطاقات الشائعة لعام ٢٠٢٦، من المستقل المتمرّس إلى الوكالة — دون احتساب الضرائب.',
      'mk.curL': 'العرض بـ', 'mk.curNative': 'العملة الأصلية',
      'mk.cap': 'نطاقات الأسعار الشائعة حسب نوع المشروع',
      'mk.colType': 'المشروع', 'mk.colDz': 'الجزائر', 'mk.colNl': 'نوميديا', 'mk.colFr': 'فرنسا', 'mk.colUs': 'الولايات المتحدة',
      'mk.day1': 'يوم عمل واحد لمطوّر متمرّس في فرنسا',
      'mk.day2': 'بالسعر الرسمي — أي ما يقارب سعر موقع تعريفي كامل في السوق الجزائرية.',
      'mk.note': 'التحويلات بالسعر الرسمي لبنك الجزائر، مطلع أكتوبر ٢٠٢٦: ١ € ≈ ١٥١ دج، ١ $ ≈ ١٣٤ دج. الفارق سببه تكلفة المعيشة وسعر الصرف لا الأدوات — فنحن نسلّم بالتقنيات نفسها التي تعتمدها الاستوديوهات الأوروبية والأمريكية: React وNext.js وVercel.',
      'mk.srcSum': 'المصادر والمنهجية',
      'mk.method': 'تمتدّ كل خانة من أدنى نطاق المستقل المتمرّس إلى أعلى نطاق الوكالة، وتدلّ علامة «+» على حدّ أعلى مفتوح. استُبعدت الحالات القصوى — مواقع بـ٣٠٠ € أو مشاريع بـ٢٥٠٬٠٠٠ $. أمّا عمود نوميديا فيحسبه المقدِّر أعلاه، بالنطاق المعتاد لكل مشروع.',
      'mk.srcDz': 'الجزائر', 'mk.srcFr': 'فرنسا', 'mk.srcUs': 'الولايات المتحدة', 'mk.srcFx': 'الصرف',
      'md.h': 'كيف يُسعَّر المشروع',
      'md.p': 'هناك أربع طرق لفوترة مشروع، ولكلٍّ منها سوقٌ تسود فيه.',
      'md.ours': 'نموذجنا',
      'md.fH': 'بسعر جزافي', 'md.fP': 'سعر ثابت لنطاق عمل مكتوب. إن تجاوز العمل ما اتُّفق عليه، يتحمّل مقدّم الخدمة الفارق.',
      'md.fW': 'هو السائد في الجزائر: مقياس Onyxlab يسعّر كل أعمال التطوير جزافياً. وهكذا نسعّر كل مشروع.',
      'md.tH': 'حسب الوقت', 'md.tP': 'يُفوتَر باليوم أو بالساعة. مرنٌ حين يتغيّر النطاق، لكن يصعب تقدير ميزانيته مسبقاً.',
      'md.tW': 'هو السائد في فرنسا (٤٨٠ –⁠ ٦٥٠ € يومياً لمطوّر متمرّس) وفي الولايات المتحدة (١٠٠ –⁠ ١٤٩ $ للساعة في الوكالات).',
      'md.aH': 'بالاشتراك', 'md.aP': 'مبلغ شهري مقابل خدمة مستمرّة: صيانة وتطوير ومحتوى.',
      'md.aW': 'شائع في كل مكان بعد الإطلاق، وهو نموذج صيانتنا: من ١٨٬٠٠٠ إلى ٦٠٬٠٠٠ دج شهرياً.',
      'md.vH': 'حسب القيمة', 'md.vP': 'يتبع السعر ما يحقّقه المشروع، لا الوقت الذي يستغرقه.',
      'md.vW': 'أندر، وأكثر ما يكون في الاستشارة والاستراتيجية، حيث يمكن قياس الرهان.',
      'md.drH': 'ما الذي يغيّر عرض السعر',
      'md.d1h': 'النطاق', 'md.d1p': 'عدد الصفحات أو المنتجات أو الشاشات.',
      'md.d2h': 'التصميم', 'md.d2p': 'مخصّص بالكامل، أو مقتبس من قالب موجود.',
      'md.d3h': 'اللغات', 'md.d3p': 'كل لغة تضيف محتوى، والعربية تضيف تخطيطاً من اليمين إلى اليسار.',
      'md.d4h': 'التكاملات', 'md.d4p': 'الدفع وحسابات المستخدمين والأدوات والواجهات البرمجية الخارجية.',
      'md.d5h': 'المحتوى', 'md.d5p': 'النصوص والصور والفيديو: تقدّمونها أنتم أو ننتجها نحن.',
      'md.d6h': 'المهلة', 'md.d6p': 'الجدول المضغوط أعلى تكلفة: ‎+٢٥٪ في مقدِّرنا.',
      'price.waSoonSuffix': ' · قريباً',
      'nav.pricing': 'الأسعار',
      'wa.hello': 'مرحباً نوميديا لابز — أودّ الحديث عن مشروع.',
      'footer.wa': 'واتساب',
      'price.kicker': '٠٤ — الأسعار', 'price.title': 'سعر <em>قبل عرض السعر.</em>',
      'price.lead': 'نطاقات السوق الجزائري الحقيقية، معلنة. اضبط نطاق العمل، وشاهد التقدير يتحرّك — ثم استلم سعراً نهائياً خلال ٢٤ ساعة.',
      'price.cur': 'دج',
      'price.freeH': 'النموذج المبدئي يبقى مجّانياً.',
      'price.freeP': 'قبل أيّ دينار، نبني نموذجاً حقيقياً وعاملاً لمشروعك. تراه يشتغل، ثم تقرّر. لا شيء ممّا يلي يُلزمك قبل ذلك.',
      'price.popular': 'الأكثر اختياراً',
      'price.t1fam': 'البناء', 'price.t1name': 'الأساسي', 'price.t1for': 'حضور موثوق، على الإنترنت بسرعة.', 'price.t1time': 'من ٢ إلى ٤ أسابيع',
      'price.t1a': 'موقع تعريفي أو صفحة هبوط، من ١ إلى ٥ صفحات',
      'price.t1b': 'تصميم مخصّص — لا قالب معاد تلوينه أبداً',
      'price.t1c': 'متجاوب وسريع، مع تهيئة أساسية لمحرّكات البحث',
      'price.t1d': 'النشر والنطاق والشهادة — كلّها مُعدّة',
      'price.t1e': 'شهر دعم مشمول',
      'price.t2fam': 'البناء', 'price.t2name': 'الاستوديو', 'price.t2for': 'الموقع الذي يحمل الشركة فعلاً.', 'price.t2time': 'من ٣ إلى ٧ أسابيع',
      'price.t2a': 'موقع مخصّص، من ٦ إلى ١٥ صفحة',
      'price.t2b': 'ثلاثي اللغة فرنسي / إنجليزي / عربي، بعربية من اليمين إلى اليسار مبنيّة أصلاً',
      'price.t2c': 'نظام تصميم موثّق — الرموز والمكوّنات والعدّة كاملة',
      'price.t2d': 'نظام إدارة محتوى أو لوحة تحكّم لتديروا المحتوى بأنفسكم',
      'price.t2e': 'تهيئة تقنية لمحرّكات البحث، ومؤشّرات الأداء، وإتاحة الوصول',
      'price.t2f': 'ثلاثة أشهر دعم مشمولة',
      'price.t3fam': 'المحرّك', 'price.t3name': 'المحرّك', 'price.t3for': 'الآلة التي لا يبنيها هنا أحد تقريباً.', 'price.t3time': 'من ٨ إلى ١٦ أسبوعاً',
      'price.t3a': 'متجر إلكتروني أو تطبيق ويب أو خطّ أتمتة',
      'price.t3b': 'الدفع وحسابات المستخدمين ولوحات المتابعة',
      'price.t3c': 'استخراج البيانات وذكاء السوق — الويب المفتوح كقاعدة بيانات',
      'price.t3d': 'تكاملات واجهات برمجية وأدوات داخلية',
      'price.t3e': 'ستّة أشهر دعم مشمولة',
      'price.retainer': 'الصيانة بعد التسليم، إن أردتموها: من ١٨٬٠٠٠ إلى ٦٠٬٠٠٠ دج شهرياً. دون ارتباط بمدّة.',
      'price.estH': 'قدّر مشروعك',
      'price.estP': 'اضبط ما تحتاجه. يُعاد حساب النطاق مباشرة، بالأرقام نفسها المعلنة في الباقات أعلاه.',
      'price.qType': 'أيّ نوع من المشاريع؟', 'price.qSize': 'الحجم', 'price.qOpts': 'ما تحتاجه إضافةً إلى ذلك', 'price.qPace': 'المهلة',
      'price.tyVitrine': 'موقع تعريفي', 'price.tyCustom': 'موقع مخصّص', 'price.tyShop': 'متجر إلكتروني',
      'price.tyApp': 'تطبيق ويب', 'price.tyAuto': 'أتمتة', 'price.tyBrand': 'هوية بصرية',
      'price.oI18n': 'ثلاثي اللغة فرنسي / إنجليزي / عربي + اتجاه RTL', 'price.oCms': 'نظام إدارة محتوى / لوحة تحكّم', 'price.oPay': 'الدفع الإلكتروني',
      'price.oDs': 'نظام تصميم كامل', 'price.oSeo': 'تهيئة متقدّمة وأداء', 'price.oApi': 'تكاملات واجهات برمجية',
      'price.paceStd': 'عادي', 'price.paceRush': 'مستعجل',
      'price.uPages': 'صفحات', 'price.uScreens': 'شاشات', 'price.uProducts': 'منتجات', 'price.uFlows': 'مسارات', 'price.uSupports': 'مخرجات',
      'price.estimate': 'التقدير', 'price.weeks': 'أسابيع',
      'price.estFine': 'نطاق استرشادي، لا عرض سعر. السعر النهائي يصل خلال ٢٤ ساعة بعد تحديد نطاق العمل معاً — ولا يتغيّر بعدها.',
      'price.estCta': 'احصل على السعر النهائي →',
      'price.obH': 'كيف نبدأ', 'price.obP': 'أربع خطوات. لا تدفع شيئاً قبل الثالثة.',
      'price.ob1h': 'تصف المشروع', 'price.ob1p': 'دقيقتان، كتابةً أو مشافهة. بالفرنسية أو الإنجليزية أو العربية.',
      'price.ob2h': 'نعود إليك خلال ٢٤ ساعة', 'price.ob2p': 'بنطاق عمل مكتوب وسعر نهائي. لا فورقة — رقم واحد.',
      'price.ob3h': 'نبني النموذج المبدئي — مجّاناً', 'price.ob3p': 'نموذج حقيقي لمشروعك، قبل الدفع. تراه يشتغل مباشرة.',
      'price.ob4h': 'أنت تقرّر', 'price.ob4p': 'إن كان الجواب لا، فلا شيء عليك. وإن كان نعم، فنحن في منتصف الطريق أصلاً.',
      'price.obCta1': 'صف مشروعي →', 'price.obCta2': 'واتساب',
      'price.waSoon': 'واتساب — قريباً',
      'svc.famBuild': 'البناء', 'svc.famEngine': 'المحرّك', 'svc.famMind': 'العقل',
      'svc.lead': 'خمسة عروض في المقدّمة وخمس قدرات في الاحتياط — والعمق ينتظر من يبحث.',
      'prev.tag': 'عرض مميّز', 'prev.name': 'المعاينة', 'prev.promise': 'بلا مخاطرة. مجرّد إثبات.',
      'prev.brief': 'نبني نسخة تجريبية حقيقية وعاملة من موقعك مسبقاً. تدخل الاجتماع، تراها حيّة، ثم تقرّر.',
      'prev.outcome': 'أسهل «نعم» ستقولها — لأنّك رأيتها بالفعل.',
      'f1.name': 'مواقع وتطبيقات ويب', 'f1.promise': 'الخيار البديهي.',
      'f1.brief': 'مواقع وتطبيقات ويب مخصّصة — سريعة، مُحسّنة للبحث، مبنية للتحويل، من الواجهة إلى السحابة. React · Next.js · Vite · Tailwind على Vercel. لا نُلبِس قالباً جاهزاً؛ نبني نظام تصميم رفيعاً ونملك كل token.',
      'f2.name': 'الهوية والأنظمة البصرية', 'f2.promise': 'الثقة قبل قراءة كلمة.',
      'f2.brief': 'شعارات، ألوان، خطوط، حركة، وطقم نظام التصميم الكامل — رموز أوّلية ← دلالية ← مكوّنات، موثّقة. ما يجعل استوديو من أربعة يبدو كاستوديو من أربعين.',
      'f3.name': 'الأتمتة والأنابيب', 'f3.promise': 'احذف العمل الممل.',
      'f3.brief': 'كاشطات، أنابيب بيانات، محرّكات عملاء، أتمتة سير العمل، أدوات داخلية. العمل المتكرّر الهشّ الذي يلتهم ساعاتك — نجعله يعمل وحده عند الثالثة فجراً. بايثون · Playwright · واجهات · Claude.',
      'f4.name': 'استخبارات السوق والمنتج', 'f4.promise': 'رؤية السوق بوضوح.',
      'f4.brief': 'حوّل الويب المفتوح إلى قاعدة بيانات. مراقبة المنافسين، استخبارات الأسعار والمنتجات، إثراء العملاء عبر Maps وFacebook وOuedkniss وJumia وInstagram — مهيكلة، مُقيَّمة، قابلة للاستعلام.',
      'f5.name': 'الاستراتيجية واستشارات النمو', 'f5.promise': 'بيانات، لا انطباعات.',
      'f5.brief': 'تدقيقات تسويقية كاملة، تحليل قمع، تموضع تنافسي، خرائط نمو — صريحة، تضع العائد أولاً، على مراحل. ننجز واجب القطاع قبل المكالمة.',
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
    // Anything that builds translated strings in JS (the estimator's unit and
    // option labels) has no data-i18n node to re-read and must rebuild itself.
    document.dispatchEvent(new CustomEvent('numidea:lang', { detail: { lang: lang } }));
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
    // The head bootstrap held paint for a non-French visitor so the 194-node
    // swap above could not be seen happening. It is done — release it.
    document.documentElement.removeAttribute('data-i18n-pending');

    // language switch
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); });
    });

    // theme switcher
    // 'engineering' is an alternate stylesheet, not a token swap
    var THEMES = ['arcanum', 'noir', 'daylight', 'mono', 'altneon', 'engineering'];
    function applyTheme(t) {
      if (THEMES.indexOf(t) === -1) t = VARIANT === 'b' ? 'daylight' : 'arcanum';
      document.documentElement.setAttribute('data-theme', t);
      // The boot path parser-inserts this sheet (see index.html) so it is
      // render-blocking for a visitor who arrives on Engineering. A switch made
      // here is user-initiated, so its restyle is excluded from CLS and a
      // dynamically appended link is fine.
      var alt = document.getElementById('theme-eng');
      if (t === 'engineering') {
        if (!alt) {
          alt = document.createElement('link');
          alt.rel = 'stylesheet'; alt.id = 'theme-eng';
          alt.href = window.NUMIDEA_ENG_CSS;
          document.head.appendChild(alt);
        } else { alt.media = 'all'; }
      } else if (alt) { alt.media = 'not all'; }
      document.querySelectorAll('.theme-menu button').forEach(function (b) {
        b.setAttribute('aria-checked', b.getAttribute('data-theme-val') === t ? 'true' : 'false');
      });
      try { localStorage.setItem('numidea-theme', t); } catch (e) {}
      // Themes change what is on the page, not just its colours: Engineering
      // reveals the deploy terminal, which is display:none everywhere else
      // and therefore cached at position zero. Re-measure after the swap.
      document.dispatchEvent(new CustomEvent('numidea:relayout'));
    }
    // the pre-paint script already resolved and applied this; mirror it here
    var defaultTheme = VARIANT === 'b' ? 'daylight' : 'arcanum';
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
    // Progressive enhancement: CSS only hides .reveal under html.js-ready, so a
    // visitor whose app.js never arrives sees everything. If the page has
    // ALREADY painted by the time this runs (slow network, deferred script
    // landing late), reveal what is on screen in the same style pass that
    // arms the gate, so nothing that was visible blinks off.
    var painted = false;
    try { painted = performance.getEntriesByType('paint').length > 0; } catch (e) {}
    if (painted) {
      var vh0 = window.innerHeight || document.documentElement.clientHeight;
      revealEls.forEach(function (el) {
        var r0 = el.getBoundingClientRect();
        if (r0.top < vh0 * 0.92 && r0.bottom > 0) revealNow(el);
      });
    }
    document.documentElement.classList.add('js-ready');
    if ('IntersectionObserver' in window) {
      // Entries that cross together are revealed as one batch, delayed in
      // sequence, so a row of cards assembles as a wave rather than a
      // flashbulb. The flush is scheduled on the next animation frame, not
      // on a resettable timer: a fast scroll fires the observer faster than
      // any debounce window, so a re-armed timeout can be starved
      // indefinitely and strand cards invisible. A frame always arrives.
      var batch = [], flushQueued = false;
      function queue(el) {
        if (el.classList.contains('in') || batch.indexOf(el) >= 0) return;
        batch.push(el);
        if (flushQueued) return;
        flushQueued = true;
        requestAnimationFrame(flush);
      }
      function flush() {
        var items = batch;
        batch = [];
        flushQueued = false;
        items.forEach(function (el, i) {
          // stagger the wave, but never make the last card wait too long
          el.style.setProperty('--rd', Math.min(i * 70, 490) + 'ms');
          try { revealNow(el); } catch (e) { el.classList.add('in'); }
        });
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          io.unobserve(en.target);
          queue(en.target);
        });
      }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
      // Safety net: never leave on-screen content stuck invisible if the
      // observer is slow/janky — reveal anything in (or near) the viewport.
      // `direct` skips the stagger queue: on `load` correctness beats grace.
      function revealInView(direct) {
        var h = window.innerHeight || document.documentElement.clientHeight;
        revealEls.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top >= h * 0.92 || r.bottom <= 0) return;
          if (direct) return revealNow(el);
          io.unobserve(el);
          queue(el);
        });
      }
      revealInView(false);   // first screen still arrives as a wave
      window.addEventListener('load', function () { revealInView(true); });
    } else {
      revealEls.forEach(revealNow);
    }

    /* ---------- ambient parallax ----------
       Two independent sources — the pointer and the scroll position —
       each write their own CSS variable; styles.css composes both into a
       single `translate`. Neither can clobber the other, and because
       `translate` is its own property it never fights the reveal
       transform or a hover scale.

       Every value is eased toward its target rather than tracked
       directly. That lag is the whole point: the page settles instead of
       snapping, which is what reads as calm. */
    var paraEls = [].slice.call(document.querySelectorAll('[data-parallax]')).map(function (el) {
      return { el: el, k: parseFloat(el.getAttribute('data-parallax')) || 0,
               // optional bound, in px. An element drifting INSIDE a clipped
               // frame must never travel further than its own overscan, or a
               // bare edge appears at the extremes of the scroll. Capping is
               // self-adjusting; matching overscan percentages to card sizes
               // by hand is not.
               // Bounded by DEFAULT. Unbounded, offset grows with distance from
               // the viewport: a kicker 8000px down the page computes ~261px of
               // displacement. You never watch it drift there, but jump to that
               // anchor and you land on visibly displaced content settling into
               // place. 64px is past what reads as depth anyway.
               cap: parseFloat(el.getAttribute('data-parallax-cap')) || 64,
               sy: 0, ty: 0, docTop: 0, h: 0 };
    });
    var finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

    if (paraEls.length && !reduceMotion) {
      var pxT = 0, pyT = 0, pxC = 0, pyC = 0, running = false;

      /* Layout positions are cached, never re-read while scrolling. Two
         reasons, both learned the hard way: a rect read back includes the
         translate we just applied (so each measurement feeds on the last
         and the element creeps), and a rotating element's bounding box
         grows and shrinks as it spins — the ring's box swings by 20px per
         revolution, which would pump that wobble straight into its own
         parallax target. Caching makes the target a pure function of
         scroll position: no feedback, no wobble. */
      function cache() {
        var y = window.scrollY || window.pageYOffset || 0;
        for (var i = 0; i < paraEls.length; i++) {
          var p = paraEls[i];
          p.el.style.setProperty('--px', '0px');
          p.el.style.setProperty('--py', '0px');
          p.el.style.setProperty('--sy', '0px');
        }
        for (var j = 0; j < paraEls.length; j++) {
          var q = paraEls[j], r = q.el.getBoundingClientRect();
          q.docTop = r.top + y;
          q.h = r.height;
        }
        aim();
      }

      function aim() {
        var vh = window.innerHeight, y = window.scrollY || window.pageYOffset || 0;
        for (var i = 0; i < paraEls.length; i++) {
          var p = paraEls[i];
          // a hidden element (the terminal outside Engineering) has no
          // position worth chasing — leave it at rest until it is shown
          if (!p.h) { p.ty = 0; continue; }
          // how far the element's centre sits from the viewport centre
          p.ty = (p.docTop - y + p.h / 2 - vh / 2) * p.k;
          if (p.cap) p.ty = Math.max(-p.cap, Math.min(p.cap, p.ty));
        }
        if (!running) { running = true; requestAnimationFrame(frame); }
      }

      /* The easing is time-based, not per-frame. A fixed per-frame factor
         would settle twice as fast on a 120Hz display as on a 60Hz one —
         and "unhurried" is the entire brief, so it can't be a property of
         the user's monitor. dt is expressed in 60fps frames and clamped so
         a background tab returning doesn't snap everything at once. */
      var lastTs = 0;
      function frame(ts) {
        var dt = lastTs ? Math.min((ts - lastTs) / 16.667, 4) : 1;
        lastTs = ts;
        var ep = 1 - Math.pow(0.96, dt);    // pointer follow — the calm lives here
        var es = 1 - Math.pow(0.93, dt);    // scroll follow
        pxC += (pxT - pxC) * ep;
        pyC += (pyT - pyC) * ep;
        var settled = Math.abs(pxT - pxC) < 0.02 && Math.abs(pyT - pyC) < 0.02;
        for (var i = 0; i < paraEls.length; i++) {
          var p = paraEls[i], d = Math.abs(p.k) * 150;   // pointer travel, px at full deflection
          p.sy += (p.ty - p.sy) * es;
          if (Math.abs(p.ty - p.sy) < 0.05) p.sy = p.ty; else settled = false;
          p.el.style.setProperty('--px', (pxC * d).toFixed(2) + 'px');
          p.el.style.setProperty('--py', (pyC * d * 0.55).toFixed(2) + 'px');
          p.el.style.setProperty('--sy', p.sy.toFixed(2) + 'px');
        }
        if (settled) { running = false; lastTs = 0; } else requestAnimationFrame(frame);
      }

      var pending = false;
      function onParaScroll() {
        if (pending) return;
        pending = true;
        requestAnimationFrame(function () { aim(); pending = false; });
      }
      window.addEventListener('scroll', onParaScroll, { passive: true });
      window.addEventListener('resize', cache);
      // reveal transitions and late fonts move things: re-cache once settled
      window.addEventListener('load', function () { setTimeout(cache, 260); });
      document.addEventListener('numidea:relayout', function () { setTimeout(cache, 60); });

      if (finePointer) {
        window.addEventListener('pointermove', function (e) {
          pxT = (e.clientX / window.innerWidth - 0.5) * 2;
          pyT = (e.clientY / window.innerHeight - 0.5) * 2;
          if (!running) { running = true; requestAnimationFrame(frame); }
        }, { passive: true });
      }
      cache();
    }


    /* ---------- hero plate: the five live client sites ----------
       Wipe, don't cross-fade. Two flat UIs dissolving through each other
       is a smear; a hard edge keeps both razor sharp. The image swaps at
       the midpoint, hidden behind the wipe bar. */
    (function () {
      var wrap = document.querySelector('.plate-wrap');
      if (!wrap) return;
      var plate = wrap.querySelector('.plate'),
          wipe  = wrap.querySelector('.pl-wipe'),
          slides = [].slice.call(wrap.querySelectorAll('.pl')),
          items  = [].slice.call(wrap.querySelectorAll('.pm-item')),
          tabs   = [].slice.call(wrap.querySelectorAll('.plate-rail button')),
          idxEl  = wrap.querySelector('.pm-idx b');
      if (slides.length < 2) return;
      var cur = 0, busy = false, timer = null, HOLD = 5200;

      function paint(n) {
        slides.forEach(function (e, i) { e.classList.toggle('on', i === n); });
        items.forEach(function (e, i) { e.classList.toggle('on', i === n); });
        tabs.forEach(function (e, i) { e.setAttribute('aria-selected', i === n ? 'true' : 'false'); });
        if (idxEl) idxEl.textContent = ('0' + (n + 1)).slice(-2);
        cur = n;
      }

      function go(n) {
        if (busy || n === cur) return;
        if (reduceMotion || !wipe) { paint(n); return; }
        busy = true;
        var t0 = 0, DUR = 620, swapped = false;
        function step(ts) {
          if (!t0) t0 = ts;
          var t = Math.min(1, (ts - t0) / DUR);
          // out: bar sweeps across, covering the plate; in: it retreats
          var half = t < .5 ? t * 2 : 1 - (t - .5) * 2;
          var e = half < .5 ? 4 * half * half * half : 1 - Math.pow(-2 * half + 2, 3) / 2;
          wipe.style.setProperty('--wipe', e.toFixed(3));
          wipe.style.setProperty('--wipeEdge', (t > .96 ? 0 : 1).toString());
          if (t >= .5 && !swapped) { paint(n); swapped = true; }   // swap behind the bar
          if (t < 1) requestAnimationFrame(step);
          else { wipe.style.setProperty('--wipe', '0'); wipe.style.setProperty('--wipeEdge', '0'); busy = false; }
        }
        requestAnimationFrame(step);
      }

      function next() {
        var n = (cur + 1) % slides.length;
        // Never wipe onto an image that has not arrived. On a slow link the
        // low-priority slides land seconds after the first; advancing anyway
        // showed a blank plate and re-elected LCP onto whichever image came
        // last. The interval simply tries again next tick.
        if (!(slides[n].complete && slides[n].naturalWidth > 0)) return;
        go(n);
      }
      /* `held` is a latch, not a timer state. Clicking a rail tab re-arms —
         but the pointer is already inside the component at that moment, so
         no fresh pointerenter will ever fire to pause it again, and it
         would resume rotating under someone who just chose a slide. */
      // `idle` holds rotation until the visitor has done anything at all. LCP
      // is finalised at the first interaction, and every rotation before that
      // re-elected it onto the new slide: measured on Slow 3G, an LCP of 3.6s
      // reported as 10.8s because the deck turned at 10.8s. A visitor who has
      // not moved yet sees the first, high-priority slide, which is the point.
      var held = { hover: false, focus: false, hidden: false, idle: true };
      var wake = function () {
        if (!held.idle) return;
        held.idle = false; arm();
        ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart', 'wheel'].forEach(function (ev) {
          window.removeEventListener(ev, wake, true);
        });
      };
      ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart', 'wheel'].forEach(function (ev) {
        window.addEventListener(ev, wake, { capture: true, passive: true });
      });
      function halt() { clearInterval(timer); timer = null; }
      function arm() {
        clearInterval(timer); timer = null;
        if (reduceMotion || held.hover || held.focus || held.hidden || held.idle) return;
        timer = setInterval(next, HOLD);
      }
      function hold(k, v) { held[k] = v; arm(); }

      tabs.forEach(function (b, i) {
        b.addEventListener('click', function () { go(i); arm(); });
      });
      // don't rotate under someone reading it, or when the tab is hidden
      wrap.addEventListener('pointerenter', function () { hold('hover', true); });
      wrap.addEventListener('pointerleave', function () { hold('hover', false); });
      wrap.addEventListener('focusin',  function () { hold('focus', true); });
      wrap.addEventListener('focusout', function () { hold('focus', false); });
      document.addEventListener('visibilitychange', function () { hold('hidden', document.hidden); });
      arm();
    })();

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
        var style = p.accent ? ' style="--brand:' + p.accent + '"' : '';
        var thumb = p.shot
          ? '<div class="thumb"><div class="browser" aria-hidden="true"><i></i><i></i><i></i><span>' + esc(domainOf(p)) + '</span></div>'
            + '<img class="shot" src="' + p.shot + '" alt="" loading="lazy" decoding="async" width="1280" height="800"></div>'
          : '<div class="thumb thumb--art"><div class="browser" aria-hidden="true"><i></i><i></i><i></i><span>' + esc(domainOf(p)) + '</span></div>'
            + '<div class="art" aria-hidden="true"></div><span class="cover" aria-hidden="true">' + esc(p.name) + '</span></div>';
        var pills = p.tags.map(function (x) { return '<span class="pill">' + esc(x) + '</span>'; }).join('') + statusPill(p);
        var idx = (PROJECTS.indexOf(p) + 1 < 10 ? '0' : '') + (PROJECTS.indexOf(p) + 1) + '/0' + PROJECTS.length;
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
        var style = p.accent ? ' style="--brand:' + p.accent + '"' : '';
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
        // aria-modal is not honoured everywhere; inert is. Nothing behind the
        // dialog is reachable by Tab or a screen reader while it is open.
        document.querySelectorAll('main, .navbar, .footer').forEach(function (el) { el.inert = true; });
      }
      function closeModal() {
        if (!modalOpen) return;
        modal.hidden = true; document.body.classList.remove('modal-open'); modalOpen = false;
        document.querySelectorAll('main, .navbar, .footer').forEach(function (el) { el.inert = false; });
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
      // The panel ships closed, so it starts inert too — setting this only on
      // toggle left the initial (closed) state still holding a focusable link.
      cvPanel.inert = !cvPanel.classList.contains('open');
      cvBtn.addEventListener('click', function () {
        var open = cvPanel.classList.toggle('open');
        // Closed, the panel is only collapsed by max-height:0 — it still held a
        // focusable download link, so a keyboard user tabbed into an invisible
        // panel with nothing on screen to explain where focus had gone.
        cvPanel.inert = !open;
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
        // pre-filled to Hamissemohamedyasser@gmail.com. Only show success after the handoff.
        var subject = 'Numidea Labs · ' + name;
        var body = name + ' <' + email + '>\n\n' + msg
          + '\n\n--\nnumidealabs · ' + VARIANT + ' · ' + (document.documentElement.getAttribute('lang') || 'fr');
        window.location.href = 'mailto:Hamissemohamedyasser@gmail.com'
          + '?subject=' + encodeURIComponent(subject)
          + '&body=' + encodeURIComponent(body);
        form.style.display = 'none';
        if (success) success.classList.add('show');
      });
    }

    /* ---------------- 12 · project estimator ----------------
       Ranges are anchored to the Onyxlab Baromètre 2026 Algerian freelance
       grid and the 2026 DZ agency surveys, positioned between that grid's
       "Confirmé" and "Agence" columns — a four-person studio carries neither
       a junior's inexperience nor an agency's overhead. Every number is DZD.

       The tier cards quote exactly what this model returns across each tier's
       stated scope: Essentiel = vitrine at 1-5 pages (base_u 5), Studio =
       surmesure at 6-15 pages (base_u 15), Moteur = app at its default. An
       earlier version claimed this and was wrong — the defaults sat 30-60k
       below the cards. The market table (section 14) reads its Numidea column
       from here too, so if a tier moves, move it here and nowhere else. */
    var PRICE_MODEL = {
      vitrine:   { base: [90000, 160000],   unit: [6000, 12000],  min: 1,  max: 10,  def: 3,  step: 1,  u: 'price.uPages',    base_u: 5,  weeks: [2, 4] },
      surmesure: { base: [180000, 420000],  unit: [9000, 18000],  min: 3,  max: 25,  def: 8,  step: 1,  u: 'price.uPages',    base_u: 15, weeks: [3, 7] },
      ecommerce: { base: [220000, 550000],  unit: [900, 2200],    min: 10, max: 400, def: 60, step: 10, u: 'price.uProducts', base_u: 60, weeks: [5, 10] },
      app:       { base: [450000, 1200000], unit: [18000, 45000], min: 3,  max: 20,  def: 6,  step: 1,  u: 'price.uScreens',  base_u: 6,  weeks: [8, 16] },
      auto:      { base: [140000, 420000],  unit: [15000, 40000], min: 1,  max: 12,  def: 3,  step: 1,  u: 'price.uFlows',    base_u: 3,  weeks: [2, 6] },
      identite:  { base: [90000, 180000],   unit: [8000, 16000],  min: 1,  max: 8,   def: 2,  step: 1,  u: 'price.uSupports', base_u: 2,  weeks: [2, 5] }
    };
    var PRICE_OPTS = {
      i18n: { add: [22000, 55000],  weeks: [1, 2], k: 'price.oI18n' },
      cms:  { add: [35000, 90000],  weeks: [1, 2], k: 'price.oCms' },
      pay:  { add: [45000, 110000], weeks: [1, 2], k: 'price.oPay' },
      ds:   { add: [60000, 140000], weeks: [1, 3], k: 'price.oDs' },
      seo:  { add: [20000, 45000],  weeks: [0, 1], k: 'price.oSeo' },
      api:  { add: [30000, 80000],  weeks: [1, 2], k: 'price.oApi' }
    };
    /* Rushing does not make the work smaller, it makes it more expensive and
       compresses the calendar — never below two thirds, which is the floor
       where review still happens. */
    var RUSH_PRICE = 1.25, RUSH_WEEKS = 0.7;

    /* The explorer's `t` is local to its own closure; this is the same
       lookup, hoisted to where the estimator can reach it. */
    function t(k, fb) {
      var d = I18N[document.documentElement.getAttribute('lang')] || I18N[DEFAULT_LANG];
      return d && d[k] != null ? d[k] : (fb || k);
    }

    var est = document.getElementById('estimator');
    if (est) {
      var eSize   = document.getElementById('est-size'),
          eSizeV  = document.getElementById('est-size-v'),
          eSizeH  = document.getElementById('est-size-h'),
          eLo     = document.getElementById('est-lo'),
          eHi     = document.getElementById('est-hi'),
          eWeeks  = document.getElementById('est-weeks'),
          eSum    = document.getElementById('est-summary'),
          eCta    = document.getElementById('est-cta');

      /* Round to a figure a human would actually say out loud. Quoting
         "186 400" implies a precision this model does not have. */
      var roundTo = function (n) {
        var g = n >= 500000 ? 50000 : n >= 150000 ? 10000 : 5000;
        return Math.round(n / g) * g;
      };
      /* Thin no-break space between groups: a normal space lets the number
         wrap mid-figure, and a comma reads as a decimal point in DZ. */
      var money = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };

      var typeOf = function () {
        var r = est.querySelector('input[name="est-type"]:checked');
        return r ? r.value : 'surmesure';
      };

      var syncSize = function (keepValue) {
        var m = PRICE_MODEL[typeOf()];
        var prev = parseInt(eSize.value, 10);
        eSize.min = m.min; eSize.max = m.max; eSize.step = m.step;
        eSize.value = keepValue && prev >= m.min && prev <= m.max ? prev : m.def;
        if (eSizeH) eSizeH.textContent = t(m.u);
      };

      var compute = function () {
        var key = typeOf(), m = PRICE_MODEL[key];
        var n = parseInt(eSize.value, 10) || m.def;
        var over = Math.max(0, n - m.base_u);
        var lo = m.base[0] + over * m.unit[0];
        var hi = m.base[1] + over * m.unit[1];
        var wLo = m.weeks[0], wHi = m.weeks[1];
        var picked = [];

        est.querySelectorAll('input[data-opt]:checked').forEach(function (c) {
          var o = PRICE_OPTS[c.getAttribute('data-opt')];
          if (!o) return;
          lo += o.add[0]; hi += o.add[1];
          wLo += o.weeks[0]; wHi += o.weeks[1];
          picked.push(t(o.k));
        });

        var rush = est.querySelector('input[name="est-pace"]:checked');
        if (rush && rush.value === 'rush') {
          lo *= RUSH_PRICE; hi *= RUSH_PRICE;
          wLo = Math.max(1, Math.round(wLo * RUSH_WEEKS));
          wHi = Math.max(2, Math.round(wHi * RUSH_WEEKS));
          picked.push(t('price.paceRush'));
        }

        lo = roundTo(lo); hi = roundTo(hi);
        eLo.textContent = money(lo);
        eHi.textContent = money(hi);
        eWeeks.textContent = wLo + ' – ' + wHi;

        if (eSizeV) eSizeV.textContent = n;
        if (eSum) {
          eSum.textContent = '';
          var head = document.createElement('li');
          head.className = 'eo-head';
          head.textContent = t('price.ty' + ({ vitrine: 'Vitrine', surmesure: 'Custom', ecommerce: 'Shop',
                                               app: 'App', auto: 'Auto', identite: 'Brand' }[key]))
                           + ' · ' + n + ' ' + t(m.u);
          eSum.appendChild(head);
          picked.forEach(function (label) {
            var li = document.createElement('li');
            li.textContent = label;
            eSum.appendChild(li);
          });
        }

        /* Carry the configured scope into the contact form, so the visitor
           does not have to retype what they just clicked. */
        if (eCta) {
          eCta.dataset.scope = (eSum && eSum.textContent ? eSum.innerText.replace(/\n+/g, ' · ') : '')
            + ' — ' + money(lo) + '–' + money(hi) + ' ' + t('price.cur');
        }
      };

      est.addEventListener('change', function (ev) {
        if (ev.target.name === 'est-type') syncSize(false);
        compute();
      });
      eSize.addEventListener('input', compute);

      /* Hand the scope to the message field rather than losing it on the jump. */
      if (eCta) {
        eCta.addEventListener('click', function () {
          var msg = document.getElementById('f-message');
          if (msg && !msg.value.trim() && eCta.dataset.scope) {
            msg.value = eCta.dataset.scope;
          }
        });
      }

      /* Units and option labels are translated, so rebuild on language change. */
      document.addEventListener('numidea:lang', function () { syncSize(true); compute(); });
      syncSize(true);
      compute();
    }

    /* ---------------- 13 · WhatsApp ----------------
       NUMIDEA_WA is the studio's number in full international form, digits
       only (e.g. '213XXXXXXXXX'). While it is empty every WhatsApp control
       stays visibly pending rather than linking somewhere wrong — the same
       idiom hub/ uses for handles with no verified URL. */
    var WA = (window.NUMIDEA_WA || '').replace(/[^0-9]/g, '');
    // Rebuilt on a language swap, so the pre-filled greeting follows the page.
    var wireWA = function () { document.querySelectorAll('.wa-link').forEach(function (a) {
      if (WA) {
        a.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(t('wa.hello'));
        a.target = '_blank';
        a.rel = 'noopener';
        a.removeAttribute('data-wa-pending');
        a.removeAttribute('aria-disabled');
      } else {
        a.removeAttribute('href');
        a.setAttribute('data-wa-pending', '');
        a.setAttribute('aria-disabled', 'true');
        // The suffix is rendered from this attribute so it stays translatable;
        // a hard-coded CSS `content` string could not follow the language.
        a.setAttribute('data-soon', t('price.waSoonSuffix'));
      }
    }); };
    wireWA();
    document.addEventListener('numidea:lang', wireWA);

    /* ---------------- 14 · market comparison ----------------
       Native figures live in the markup, so the table reads correctly with JS
       off. This converts them on request and computes the Numidea column from
       PRICE_MODEL — the table cannot quote a Numidea price the tier cards and
       the estimator disagree with.
       FX: Bank of Algeria official rate, early October 2026 (1 Oct: 1 € =
       151.06, 1 $ = 133.66; an independent page agreed within 0.3%). Rounded,
       because the comparison is about orders of magnitude, not centimes. */
    var FX = { DZD: 1, EUR: 151, USD: 134 };
    var MARKET = {   // [low, high, openEnded] — freelance confirmé low → agency high
      vitrine:   { dz: [50000, 100000],   fr: [1500, 6000],     us: [1500, 12000] },
      surmesure: { dz: [180000, 400000],  fr: [6000, 10000, 1], us: [6000, 20000] },
      ecommerce: { dz: [150000, 1000000], fr: [2000, 20000],    us: [5000, 30000] },
      app:       { dz: [200000, 2000000], fr: [10000, 50000],   us: [20000, 60000, 1] },
      identite:  { dz: [80000, 150000],   fr: [1200, 5000, 1],  us: [500, 30000] }
    };
    var NATIVE = { dz: 'DZD', nl: 'DZD', fr: 'EUR', us: 'USD' };
    var mkt = document.getElementById('market');
    if (mkt) {
      var grp = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };
      // a converted figure is rounded to what a person would actually quote
      var tidy = function (n, cur) {
        var g = cur === 'DZD' ? (n >= 1e6 ? 50000 : n >= 150000 ? 10000 : 5000)
                              : (n >= 10000 ? 500 : n >= 1000 ? 100 : 10);
        return Math.max(g, Math.round(n / g) * g);
      };
      var sym = function (cur) { return cur === 'DZD' ? t('price.cur') : cur === 'EUR' ? '€' : '$'; };
      var nlRange = function (key) {
        var m = PRICE_MODEL[key], over = Math.max(0, m.def - m.base_u);
        return [m.base[0] + over * m.unit[0], m.base[1] + over * m.unit[1]];
      };
      var fill = function (td, range, from, to) {
        var lo = range[0], hi = range[1], approx = '';
        if (to !== from) {
          lo = tidy(lo * FX[from] / FX[to], to); hi = tidy(hi * FX[from] / FX[to], to);
          approx = '≈ ';
        }
        td.textContent = '';
        td.appendChild(document.createTextNode(approx + grp(lo) + ' – ' + grp(hi) + (range[2] ? '+' : '') + ' '));
        var c = document.createElement('span'); c.className = 'cur'; c.textContent = sym(to);
        td.appendChild(c);
      };
      var renderMarket = function () {
        var sel = mkt.querySelector('input[name="mk-cur"]:checked');
        var want = sel ? sel.value : 'native';
        mkt.querySelectorAll('tbody tr[data-row]').forEach(function (tr) {
          var key = tr.getAttribute('data-row');
          tr.querySelectorAll('td[data-mk]').forEach(function (td) {
            var col = td.getAttribute('data-mk'), from = NATIVE[col];
            fill(td, col === 'nl' ? nlRange(key) : MARKET[key][col], from, want === 'native' ? from : want);
          });
        });
        var day = document.getElementById('mk-day-dz');
        if (day) day.textContent = grp(tidy(480 * FX.EUR, 'DZD')) + ' – ' + grp(tidy(650 * FX.EUR, 'DZD')) + ' ' + t('price.cur');
      };
      mkt.addEventListener('change', renderMarket);
      document.addEventListener('numidea:lang', renderMarket);
      renderMarket();
    }

   } catch (e) {
    // Never let an init error leave content stuck behind scroll-reveal.
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    if (window.console && console.error) console.error(e);
   }
  });
})();
