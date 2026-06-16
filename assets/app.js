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

  /* ---- Services Catalog + Trust strip strings (merged into I18N) ---- */
  var EXTRA = {
    fr: {
      'svc.lead': 'Dix capacités, trois familles. On met cinq offres en avant — la profondeur attend ceux qui creusent.',
      'svc.proofLabel': 'Preuve', 'svc.flagship': '★ Flagship',
      'rail1': 'I · Le Build', 'rail2': "II · L'Engine", 'rail3': "III · L'Esprit",
      'fam1.label': 'Famille I — Le Build', 'fam1.tag': "Ce qu'on ouvre, clique et achète.",
      'fam2.label': "Famille II — L'Engine", 'fam2.tag': 'Le moat. Presque aucun studio local ne le propose.',
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
      'cap.summary': 'Capacités — 5 de plus', 'cap.hint': 'La profondeur, pour qui creuse.',
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
      'cat.health': 'Santé', 'cat.travel': 'Voyage', 'cat.industrial': 'Industrie', 'cat.streaming': 'Streaming', 'cat.pwa': 'PWA'
    },
    en: {
      'svc.lead': 'Ten capabilities, three families. We feature five up front — the depth waits for whoever digs.',
      'svc.proofLabel': 'Proof', 'svc.flagship': '★ Flagship',
      'rail1': 'I · The Build', 'rail2': 'II · The Engine', 'rail3': 'III · The Mind',
      'fam1.label': 'Family I — The Build', 'fam1.tag': 'Things people open, click, and buy through.',
      'fam2.label': 'Family II — The Engine', 'fam2.tag': 'The moat. Almost no local studio offers this.',
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
      'cap.summary': 'Capabilities — 5 more', 'cap.hint': 'Depth, for whoever digs.',
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
      'cat.health': 'Healthcare', 'cat.travel': 'Travel', 'cat.industrial': 'Industrial', 'cat.streaming': 'Streaming', 'cat.pwa': 'PWA'
    },
    ar: {
      'svc.lead': 'عشر قدرات، ثلاث عائلات. نُبرز خمساً في المقدّمة — والعمق ينتظر من يبحث.',
      'svc.proofLabel': 'الإثبات', 'svc.flagship': '★ الرائد',
      'rail1': '١ · البناء', 'rail2': '٢ · المحرّك', 'rail3': '٣ · العقل',
      'fam1.label': 'العائلة الأولى — البناء', 'fam1.tag': 'ما يفتحه الناس ويضغطونه ويشترون عبره.',
      'fam2.label': 'العائلة الثانية — المحرّك', 'fam2.tag': 'الخندق. يكاد لا يقدّمه أيّ استوديو محلّي.',
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
      'cap.summary': 'قدرات — ٥ أخرى', 'cap.hint': 'العمق، لمن يبحث.',
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
      'cat.health': 'صحة', 'cat.travel': 'سفر', 'cat.industrial': 'صناعة', 'cat.streaming': 'بث', 'cat.pwa': 'PWA'
    }
  };
  Object.keys(EXTRA).forEach(function (l) {
    for (var k in EXTRA[l]) { if (EXTRA[l].hasOwnProperty(k)) I18N[l][k] = EXTRA[l][k]; }
  });

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

    // portfolio modal — filterable gallery built from the live work cards
    var pOpen = document.querySelector('#portfolio-open');
    var modal = document.querySelector('#portfolio-modal');
    if (pOpen && modal) {
      var grid = modal.querySelector('#portfolio-grid');
      var filtersEl = modal.querySelector('#portfolio-filters');
      var psearch = modal.querySelector('#portfolio-search');
      var pempty = modal.querySelector('#portfolio-empty');
      var panel = modal.querySelector('.modal-panel');
      var sourceCards = document.querySelectorAll('#work .proj');
      var lastFocus = null, curCat = 'all';
      function pdict() { return I18N[document.documentElement.getAttribute('lang')] || I18N[DEFAULT_LANG]; }

      function buildFilters() {
        var d = pdict(), cats = [], counts = {};
        sourceCards.forEach(function (c) {
          var k = c.getAttribute('data-cat') || 'other';
          if (cats.indexOf(k) === -1) cats.push(k);
          counts[k] = (counts[k] || 0) + 1;
        });
        filtersEl.innerHTML = '';
        function chip(key, label, count) {
          var b = document.createElement('button');
          b.type = 'button'; b.className = 'filter-chip';
          b.setAttribute('data-cat', key);
          b.setAttribute('aria-pressed', key === curCat ? 'true' : 'false');
          b.innerHTML = label + ' <span class="ct">' + count + '</span>';
          b.addEventListener('click', function () { curCat = key; updateChips(); apply(); });
          return b;
        }
        filtersEl.appendChild(chip('all', d['portfolio.all'] || 'Tout', sourceCards.length));
        cats.forEach(function (k) { filtersEl.appendChild(chip(k, d['cat.' + k] || k, counts[k])); });
      }
      function updateChips() {
        filtersEl.querySelectorAll('.filter-chip').forEach(function (b) {
          b.setAttribute('aria-pressed', b.getAttribute('data-cat') === curCat ? 'true' : 'false');
        });
      }
      function buildGrid() {
        grid.innerHTML = '';
        sourceCards.forEach(function (c) {
          var clone = c.cloneNode(true);
          clone.classList.remove('reveal', 'in');
          grid.appendChild(clone);
        });
      }
      function apply() {
        var term = (psearch.value || '').trim().toLowerCase(), shown = 0;
        grid.querySelectorAll('.proj').forEach(function (card) {
          var okCat = curCat === 'all' || card.getAttribute('data-cat') === curCat;
          var okTerm = !term || card.textContent.toLowerCase().indexOf(term) !== -1;
          var show = okCat && okTerm;
          card.style.display = show ? '' : 'none';
          if (show) shown++;
        });
        pempty.hidden = shown !== 0;
      }
      function openModal() {
        lastFocus = document.activeElement;
        curCat = 'all'; psearch.value = '';
        buildFilters(); buildGrid(); apply();
        modal.hidden = false;
        document.body.classList.add('modal-open');
        psearch.focus();
      }
      function closeModal() {
        modal.hidden = true;
        document.body.classList.remove('modal-open');
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      }
      pOpen.addEventListener('click', openModal);
      modal.querySelectorAll('[data-close]').forEach(function (el) { el.addEventListener('click', closeModal); });
      psearch.addEventListener('input', apply);
      document.addEventListener('keydown', function (e) {
        if (modal.hidden) return;
        if (e.key === 'Escape') { closeModal(); return; }
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
        // front-end demo: swap form for the designed success state
        form.style.display = 'none';
        if (success) success.classList.add('show');
      });
    }
  });
})();
