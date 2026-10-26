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
      title: 'Numidea Labs — Sites web sur mesure en français, anglais et arabe',
      'meta.desc': 'Studio web et logiciel à Bordj Bou Arréridj, Algérie. On conçoit, on code, on livre et on suit vos sites et applications, en français, anglais et arabe.',
      'nav.about': 'Méthode', 'nav.services': 'Services', 'nav.work': 'Projets',
      'nav.team': 'Équipe', 'nav.faq': 'FAQ', 'nav.contact': 'Contact',
      'hero.eyebrow': 'Studio web & logiciel · Bordj Bou Arréridj, Algérie',
      'hero.title': 'Votre site sur mesure, <span class="swash">en français, anglais ou arabe.</span>',
      'hero.lede': 'Entreprise immatriculée ? Avant tout paiement, on construit la page d\'accueil de votre nouveau site, avec votre contenu, en 5 jours ouvrés (4 Aperçus par mois au maximum, tous clients confondus). Aux commandes : un fondateur designer-développeur et trois spécialistes, du back-end au dernier pixel. Après la mise en ligne, on assure le suivi.',
      'hero.cta1': 'Demander mon Aperçu gratuit →', 'hero.cta2': 'Voir nos réalisations',
      'hero.plateLive': 'en ligne', 'tb.lang': 'Langues', 'tb.liveV': '4 sites clients', 'tb.live': 'En ligne', 'tb.previewV': 'Gratuit · 5 jours ouvrés', 'tb.preview': 'Aperçu', 'tb.replyV': '< 24 h ouvrées', 'tb.reply': 'Réponse', 'tb.langV': 'FR · EN · AR', 'tb.place': 'Bordj Bou Arréridj, Algérie', 'tb.studio': 'Studio',
      'sheet.scale': 'Éch. 1:1', 'sheet.rev': 'Rév. 2026-08', 'sheet.sheet': 'Feuille 01',
      'proof.kicker': '01 — Chiffres clés',
      'proof.s1': 'projets livrés', 'proof.s2': 'personnes dans l\'équipe', 'proof.s3': 'langues', 'proof.s4': 'de réponse, en heures ouvrées',
      'proof.line': 'Quatre sites clients sont en ligne aujourd\'hui — ouvrez-les ci-dessous.',
      'svc.kicker': '03 — Services',
      'svc.title': 'Ce qu\'on <em>construit pour vous.</em>',
      'svc.outcomeLabel': 'Résultat',
      'work.kicker': '02 — Projets',
      'work.title': 'Réalisations <em>choisies.</em>',
      'proj1.cat': 'Santé · Next.js', 'proj1.desc': 'Un site sobre, avec prise de rendez-vous en ligne, pour un petit cabinet.',
      'proj2.cat': 'Voyage · Croissance', 'proj2.desc': 'Identité, site trilingue et prise de rendez-vous visa pour une agence de voyages de Bordj Bou Arréridj.',
      'proj3.cat': 'Artisan · Île-de-France', 'proj3.desc': 'Le site d\'un artisan de Gennevilliers en climatisation, chauffage et plomberie : une page par métier, ses réalisations chantier par chantier et une demande de devis en un seul formulaire.',
      'proj4.cat': 'Industrie · B2B', 'proj4.desc': 'Site corporate B2B pour Bordj Steel SPA, leader de la construction métallique en Algérie — catalogue produits, références et espace recrutement.',
      'proj5.cat': 'PWA · Supabase', 'proj5.desc': 'Une application web progressive, pensée pour fonctionner hors connexion.',
      'proj6.cat': 'Voyage · Omra', 'proj6.desc': 'Une vitrine bilingue pour des voyages organisés et l\'Omra au départ de Constantine.',
      'proj7.cat': 'Commerce · Gaming', 'proj7.desc': 'Une marque fictive de matériel gaming et sa boutique en ligne, conçues de A à Z comme démo de portfolio.',
      'clients.h': 'Ils nous ont confié leur site',
      'proj4.gain': 'Un acheteur trouve la bonne gamme et ses caractéristiques techniques sans appeler.', 'proj2.gain': 'Un voyageur estime son budget et envoie une demande complète sur WhatsApp.',
      'proj3.gain': 'En cas de panne, un client appelle d\'un simple appui depuis la page du métier.', 'proj6.gain': 'Un pèlerin compare les forfaits Omra par prix et distance du Haram, puis écrit sur WhatsApp.',
      'work.gainMore': ' — le détail sur la planche',
      'work.lead': 'Les sites de nos clients, à visiter vous-même, ainsi qu\'une démo de portfolio et deux projets en cours.',
      'work.live': 'Voir le site →', 'work.soon': 'En cours', 'work.sheet': 'Voir la planche →', 'work.concept': 'Démo portfolio',
      'how.kicker': '04 — Méthode',
      'how.title': 'Quatre étapes. <em>Zéro surprise.</em>',
      'how.lead': 'Entreprise immatriculée ? Vous ne payez rien avant d\'avoir vu votre page d\'accueil tourner.',
      'scene.kicker': '◆ PLANCHES DE PROJET', 'scene.title': 'Nos projets, livrable par livrable.',
      'scene.lead': 'Les pages, le mobile et le système visuel de nos projets, capturés sur les sites en ligne.',
      'scene.cta': 'Ouvrir les planches →',
      'founder.kicker': '06 — Équipe & fondateur', 'founder.title': 'Le studio a un <em>visage.</em>',
      'founder.lead': 'Derrière Numidea : un fondateur qui conçoit, code et livre, et trois spécialistes autour de lui.',
      'founder.role': 'Designer graphique & développeur web · Fondateur', 'founder.years': '6 ans', 'founder.city': 'Bordj Bou Arréridj',
      'founder.bio': 'Six ans à concevoir des identités, coder des interfaces et livrer des produits, de la marque jusqu\'à la mise en ligne. Je transforme votre brief en produit fini, et je reste à vos côtés après le lancement.',
      'founder.cvBtn': 'Voir le parcours ↴', 'founder.cvClose': 'Masquer le parcours ↑', 'founder.portfolio': 'Portfolio personnel ↗',
      'founder.expLabel': 'Parcours', 'founder.skillsLabel': 'Compétences', 'founder.eduLabel': 'Formation',
      'founder.edu': 'Informatique — Université Mohamed El Bachir El Ibrahimi · 2018–2024',
      'founder.download': 'Télécharger le CV (PDF) ↓',
      'fx1': 'Designer graphique', 'fx2': 'Designer graphique & développeur web, en freelance', 'fx3': 'Développeur web & social media', 'fx4': 'Designer graphique & web', 'fx5': 'Créateur de contenu & vidéo',
      'fx1.when': "Mai 2026 — aujourd'hui", 'fx2.when': "2019 — aujourd'hui", 'fx3.when': 'Fév. – mai 2026', 'fx4.when': 'Août 2025 – fév. 2026', 'fx5.when': 'Mars – juil. 2024',
      'fx1.what': "Visuels et supports de communication pour une plateforme internationale de mobilité ; déclinaison de l'identité sur les campagnes et les réseaux.",
      'fx2.what': 'Sites vitrines et landing pages orientés conversion ; identités visuelles, affiches et pochettes ; direction artistique de campagnes NFT et de branding musical.',
      'fx3.what': "Le site complet de l'agence, la refonte visuelle de la marque et sa stratégie réseaux sociaux.",
      'fx4.what': "Refonte de l'identité (logo, charte) et des supports print, puis un site responsive livré de A à Z.",
      'fx5.what': "Vidéos courtes pour des événements et des campagnes communautaires ; animation d'ateliers créatifs.",
      'fs1.h': 'Design & identité', 'fs1': 'Branding · identité visuelle · illustration · direction artistique UI/UX · photo & retouche',
      'fs2.h': 'Web & front-end', 'fs2': 'HTML / CSS / JS · React · sites vitrines · landing pages · CMS · SEO · responsive',
      'fs3.h': 'Stratégie & contenu', 'fs3': 'Réseaux sociaux · rédaction créative · intégration IA · automatisation · gestion de projet',
      'founder.skillsNote': "Environ 20 % de temps de production en moins grâce à l'intégration d'outils IA. En cours d'apprentissage : motion design et montage vidéo.",
      'founder.certs': 'Certifications : Duolingo English Test · Design numérique (Artiland.Studio) · Motion design 3D',
      'pl.vista': 'Pl.\u00a0I — Les Bibans · Bordj Bou Arréridj', 'pl.arch': 'Pl.\u00a0II — Arc de Trajan · Timgad', 'pl.coins': 'Pl.\u00a0III — Monnaies numides', 'pl.strata': 'Pl.\u00a0IV — Coupe des couches', 'pl.light': 'Pl.\u00a0V — Cap Carbon · Béjaïa', 'pl.dunes': 'Pl.\u00a0VI — Le Grand Erg',
      'whq.kick': 'Le projet préféré du fondateur', 'whq.sub': 'WorkspaceHQ v3 est sorti — votre code, en jeu d\'arcade',
      'ui.top': 'Haut de page', 'tag.brand': 'Marque', 'tag.corporate': 'Institutionnel', 'tag.funnel': 'Tunnel de vente', 'tag.static': 'Site vitrine', 'tag.commerce': 'Commerce', 'tag.booking': 'Réservation', 'tag.offline': 'Hors ligne', 'tag.identity': 'Identité', 'tag.designSystems': 'Design systems', 'tag.motion': 'Animation', 'tag.maps': 'Cartes', 'tag.scoring': 'Scoring', 'tag.strategy': 'Stratégie', 'tag.funnels': 'Tunnels de vente', 'tag.audits': 'Audits', 'tag.seo': 'SEO', 'tag.apis': 'API', 'mk.srcRange': '(Confirmé → Agence)', 'footer.legal': 'Mentions légales', 'footer.privacy': 'Confidentialité', 'work.voicesH': "Ce qu'en disent nos clients", 'mbar.aria': 'Contact rapide', 'mbar.cta': 'Démarrer un projet', 'footer.studioH': 'Studio', 'footer.contactH': 'Contact', 'footer.founderH': 'Le fondateur', 'form.note': 'Le bouton ouvre votre messagerie avec votre message déjà rédigé : il ne vous reste qu\'à l\'envoyer. Ce site ne conserve pas votre message.', 'ui.skip': 'Aller au contenu', 'ui.navPrimary': 'Navigation principale', 'ui.theme': 'Thème', 'ui.lang': 'Langue', 'footer.navAria': 'Pied de page', 'hero.plateRail': "Projets à l'écran", 'hero.platePause': 'Mettre la rotation en pause', 'work.livePill': 'En ligne', 'work.bilingual': 'Bilingue', 'proj4.alt': 'Aperçu du site Bordj Steel', 'proj2.alt': 'Aperçu du site Alliance Travel', 'proj3.alt': 'Aperçu du site AlmaFlowClim', 'proj6.alt': 'Aperçu du site Nomara Voyages', 'proj7.alt': 'Aperçu du site Glaive Store', 'ui.menu': 'Menu', 'ui.close': 'Fermer', 'ui.sections': 'Sections', 'founder.arPill': 'AR langue maternelle', 'founder.linksAria': 'Profils du fondateur',
      'team.h': "Avec lui, l'équipe",
      'team.dFn': 'Spécialiste données', 'team.dDo': "Pipelines, scraping et la couche d'intelligence.",
      'team.sFn': 'Ventes & partenariats', 'team.sDo': "Premier contact : traduit l'idée en périmètre.",
      'team.tFn': 'Référent technique', 'team.tDo': 'Veille à la qualité de ce qui est livré et tient le client informé.',
      'stack.kicker': '07 — Outils',
      'stack.title': 'Nos outils, <em>sans esbroufe.</em>',
      'stack.lead': 'Choisis pour durer, pas pour suivre la mode.',
      'stack.gFront': 'Front', 'stack.gBack': 'Back', 'stack.gCloud': 'Cloud', 'stack.gData': 'Data', 'stack.gMobile': 'Mobile',
      'faq.kicker': '08 — FAQ', 'faq.title': 'Les questions <em>qui comptent.</em>',
      'faq.lead': 'Ce qu\'on nous demande avant de se lancer, et nos réponses sans détour.',
      'faq1.q': 'Combien de temps pour livrer ?', 'faq1.a': 'Cela dépend du périmètre : comptez 2 à 4 semaines pour un site vitrine, 3 à 7 pour un site sur mesure, 8 à 16 pour une application web. Le délai ferme est fixé dès que le projet est cadré ensemble.',
      'faq2.q': 'C\'est combien ?', 'faq2.a': 'Nos fourchettes de prix sont publiées dans la section Tarifs : nos formules commencent à 90 000 DA pour un site vitrine (en euros et en dollars dans la même section). Le prix ferme est fixé une fois le périmètre clair : un forfait, sans frais cachés. Et pour une entreprise immatriculée, on construit d\'abord votre page d\'accueil, gratuitement : c\'est l\'Aperçu (4 par mois au maximum, tous clients confondus).',
      'faq3.q': 'Vous travaillez en quelles langues ?', 'faq3.a': 'Français, arabe et anglais — à l\'oral, à l\'écrit, et dans le produit livré. Ce site même est trilingue, avec une expérience arabe (RTL) pensée nativement.',
      'faq4.q': 'Et après le lancement ?', 'faq4.a': 'On reste. Chaque formule inclut 1, 3 ou 6 mois de support, et on vous répond sous 24 h ouvrées. Ensuite, la maintenance est en option : au mois, sans engagement de durée (voir les tarifs). Pas de « bonne chance » le jour de la mise en ligne.',
      'faq5.q': 'Travaillez-vous à distance ?', 'faq5.a': 'Oui. On est basés à Bordj Bou Arréridj, mais on livre partout — y compris pour des clients en France. La distance ne change rien : vous parlez directement à celui qui construit votre projet.',
      'faq6.q': 'Qu\'est-ce qui vous différencie d\'une agence ?', 'faq6.a': 'Pas d\'intermédiaire : une seule équipe cadre, code et livre votre projet, du design au déploiement. Et pour une entreprise immatriculée, vous voyez votre page d\'accueil tourner avant de payer quoi que ce soit — dans la limite de 4 Aperçus par mois, tous clients confondus.',
      'contact.kicker': '09 — Contact',
      'contact.title': 'Parlons de <em>votre projet.</em>',
      'contact.sub': 'Dites-nous ce qu\'il vous faut : une urgence à traiter, quelque chose à corriger, une échéance à tenir. En français, anglais ou arabe.',
      'contact.chStudio': 'Studio', 'contact.chReply': 'Réponse',
      'contact.vStudio': 'Bordj Bou Arréridj · Algérie', 'contact.vReply': '< 24 h ouvrées · FR · EN · <span lang="ar">ع</span>',
      'form.name': 'Nom', 'form.namePh': 'Votre nom',
      'form.email': 'Email', 'form.emailPh': 'vous@entreprise.com',
      'form.message': 'Message', 'form.messagePh': 'Qu\'est-ce qu\'on construit ?',
      'form.send': 'Démarrer un projet →',
      'form.errName': 'Ajoutez un nom pour qu\'on sache à qui parler.',
      'form.errEmail': 'Ajoutez un email pour qu\'on puisse répondre.',
      'form.errEmailValid': 'Cet email a l\'air incomplet — vérifiez-le.',
      'form.errMsg': 'Dites-nous une ligne sur le projet.',
      'form.success': 'Votre messagerie devrait s\'ouvrir avec le message prêt — il ne reste qu\'à l\'envoyer.',
      'form.successAlt': 'Rien ne s\'est ouvert ? Écrivez-nous directement :',
      'form.edit': 'Revoir mon message',
      'footer.signoff': 'Construit à Bordj Bou Arréridj, avec du café noir et du TypeScript.',
      'footer.rights': '© 2026 Numidea Labs',
      'footer.tag': 'Enraciné en Numidie · bâti sur des idées'
    },
    en: {
      dir: 'ltr',
      title: 'Numidea Labs — Custom websites in English, French and Arabic',
      'meta.desc': 'Web and software studio in Bordj Bou Arréridj, Algeria. We design, build, launch and support websites and web apps in English, French and Arabic.',
      'nav.about': 'Process', 'nav.services': 'Services', 'nav.work': 'Work',
      'nav.team': 'Team', 'nav.faq': 'FAQ', 'nav.contact': 'Contact',
      'hero.eyebrow': 'Web & software studio · Bordj Bou Arréridj, Algeria',
      'hero.title': 'Custom websites, <span class="swash">in English, French and Arabic.</span>',
      'hero.lede': 'Registered business? Before you pay anything, we build your new site\'s homepage with your own content in 5 working days (at most 4 Previews a month, across all clients). Behind it: a designer-developer founder and three specialists, from the back-end to the last pixel, with support after launch.',
      'hero.cta1': 'Request my free Preview →', 'hero.cta2': 'See our work',
      'hero.plateLive': 'live', 'tb.lang': 'Languages', 'tb.liveV': '4 client sites', 'tb.live': 'Live', 'tb.previewV': 'Free · 5 working days', 'tb.preview': 'Preview', 'tb.replyV': '< 24 working hours', 'tb.reply': 'Reply', 'tb.langV': 'EN · FR · AR', 'tb.place': 'Bordj Bou Arréridj, Algeria', 'tb.studio': 'Studio',
      'sheet.scale': 'Scale 1:1', 'sheet.rev': 'Rev. 2026-08', 'sheet.sheet': 'Sheet 01',
      'proof.kicker': '01 — Proof',
      'proof.s1': 'projects delivered', 'proof.s2': 'people on the team', 'proof.s3': 'languages', 'proof.s4': 'response, in working hours',
      'proof.line': 'Four client sites are live today — open them below.',
      'svc.kicker': '03 — Services',
      'svc.title': 'What we <em>build for you.</em>',
      'svc.outcomeLabel': 'Outcome',
      'work.kicker': '02 — Work',
      'work.title': 'Selected <em>work.</em>',
      'proj1.cat': 'Healthcare · Next.js', 'proj1.desc': 'A calm site with online booking for a small practice.',
      'proj2.cat': 'Travel · Growth', 'proj2.desc': 'Brand identity and a trilingual website for a travel agency in Bordj Bou Arréridj, with a WhatsApp quote calculator and a visa-appointment service.',
      'proj3.cat': 'Contractor · Île-de-France', 'proj3.desc': 'The website of an air-conditioning, heating and plumbing firm in Gennevilliers, near Paris: one page per trade, a page of past jobs and a one-form quote request.',
      'proj4.cat': 'Industrial · B2B', 'proj4.desc': 'The B2B corporate site for Bordj Steel SPA, Algeria\'s structural-steel leader — product catalogue, references and a careers section.',
      'proj5.cat': 'PWA · Supabase', 'proj5.desc': 'An offline-first progressive web app built on Supabase.',
      'proj6.cat': 'Travel · Umrah', 'proj6.desc': 'A bilingual storefront for package tours and Umrah trips departing from Constantine.',
      'proj7.cat': 'Commerce · Gaming', 'proj7.desc': 'A fictional gaming-gear brand and online store, designed end to end as a portfolio demo.',
      'clients.h': 'They trusted us with their websites',
      'proj4.gain': 'A buyer finds the right product line and its technical data without calling.', 'proj2.gain': 'A traveller gets an estimate for their trip and sends a complete request on WhatsApp.',
      'proj3.gain': 'If something breaks down, a customer calls in one tap from the page for that trade.', 'proj6.gain': 'A pilgrim compares Umrah packages by price and distance from the Haram, then messages on WhatsApp.',
      'work.gainMore': ' — more on the project sheet',
      'work.lead': 'Our clients\' sites, to open yourself — plus a portfolio demo and two projects on the way.',
      'work.live': 'Visit the site →', 'work.soon': 'In progress', 'work.sheet': 'See the sheet →', 'work.concept': 'Portfolio demo',
      'how.kicker': '04 — Process',
      'how.title': 'Four steps. <em>No surprises.</em>',
      'how.lead': 'Registered business? You pay nothing until you have seen your homepage running.',
      'scene.kicker': '◆ PROJECT SHEETS', 'scene.title': 'Our projects, piece by piece.',
      'scene.lead': 'Each sheet shows a project\'s key pages, its mobile version and its visual system — every screenshot taken from the live site.',
      'scene.cta': 'Open the project sheets →',
      'founder.kicker': '06 — Team & founder', 'founder.title': 'The studio has a <em>face.</em>',
      'founder.lead': 'Behind Numidea: a founder who designs, codes and delivers, with three specialists around him.',
      'founder.role': 'Graphic designer & web developer · Founder', 'founder.years': '6 yrs', 'founder.city': 'Bordj Bou Arréridj',
      'founder.bio': 'Six years designing identities, coding interfaces and shipping products — brand to front-end to cloud. I turn the brief into the build, and I stay once it\'s live.',
      'founder.cvBtn': 'View the track record ↴', 'founder.cvClose': 'Hide the track record ↑', 'founder.portfolio': 'Personal portfolio ↗',
      'founder.expLabel': 'Experience', 'founder.skillsLabel': 'Skills', 'founder.eduLabel': 'Education',
      'founder.edu': 'Computer Science — Univ. Mohamed El Bachir El Ibrahimi · 2018–2024',
      'founder.download': 'Download résumé (PDF) ↓',
      'fx1': 'Graphic designer', 'fx2': 'Freelance graphic designer & web developer', 'fx3': 'Web developer & social media manager', 'fx4': 'Graphic & web designer', 'fx5': 'Content & video creator',
      'fx1.when': 'May 2026 — present', 'fx2.when': '2019 — present', 'fx3.when': 'Feb – May 2026', 'fx4.when': 'Aug 2025 – Feb 2026', 'fx5.when': 'Mar – Jul 2024',
      'fx1.what': 'Visuals and communication material for an international mobility platform; carrying the brand identity across campaigns and social.',
      'fx2.what': 'Conversion-focused showcase sites and landing pages; visual identities, posters and album covers; art direction for NFT campaigns and musician branding.',
      'fx3.what': "The agency's full website, a visual refresh of the brand and its social media strategy.",
      'fx4.what': 'A redesigned identity (logo, guidelines) and print collateral, then a responsive website delivered end to end.',
      'fx5.what': 'Short-form video for events and community campaigns; running creative workshops.',
      'fs1.h': 'Design & identity', 'fs1': 'Branding · visual identity · illustration · UI/UX art direction · photo & retouching',
      'fs2.h': 'Web & front-end', 'fs2': 'HTML / CSS / JS · React · showcase sites · landing pages · CMS · SEO · responsive',
      'fs3.h': 'Strategy & content', 'fs3': 'Social media · creative writing · AI integration · automation · project management',
      'founder.skillsNote': 'About 20% less production time from integrating AI tools. Currently learning: motion design and video editing.',
      'founder.certs': 'Certifications: Duolingo English Test · Digital design (Artiland.Studio) · 3D motion design',
      'pl.vista': 'Pl.\u00a0I — The Bibans · Bordj Bou Arréridj', 'pl.arch': 'Pl.\u00a0II — Arch of Trajan · Timgad', 'pl.coins': 'Pl.\u00a0III — Numidian coins', 'pl.strata': 'Pl.\u00a0IV — Section through the strata', 'pl.light': 'Pl.\u00a0V — Cap Carbon · Béjaïa', 'pl.dunes': 'Pl.\u00a0VI — The Grand Erg',
      'whq.kick': "The founder's favourite project", 'whq.sub': 'WorkspaceHQ v3 is out — your codebase, now playable',
      'ui.top': 'Back to top', 'tag.brand': 'Brand', 'tag.corporate': 'Corporate', 'tag.funnel': 'Funnel', 'tag.static': 'Showcase site', 'tag.commerce': 'Commerce', 'tag.booking': 'Booking', 'tag.offline': 'Offline', 'tag.identity': 'Identity', 'tag.designSystems': 'Design systems', 'tag.motion': 'Motion', 'tag.maps': 'Maps', 'tag.scoring': 'Scoring', 'tag.strategy': 'Strategy', 'tag.funnels': 'Funnels', 'tag.audits': 'Audits', 'tag.seo': 'SEO', 'tag.apis': 'APIs', 'mk.srcRange': '(Experienced → Agency)', 'footer.legal': 'Legal notice', 'footer.privacy': 'Privacy', 'work.voicesH': 'What clients say', 'mbar.aria': 'Quick contact', 'mbar.cta': 'Start a project', 'footer.studioH': 'Studio', 'footer.contactH': 'Contact', 'footer.founderH': 'The founder', 'form.note': 'Sending opens your mail app with the message ready. This site does not keep your message.', 'ui.skip': 'Skip to content', 'ui.navPrimary': 'Main navigation', 'ui.theme': 'Theme', 'ui.lang': 'Language', 'footer.navAria': 'Footer', 'hero.plateRail': 'Featured projects', 'hero.platePause': 'Pause the rotation', 'work.livePill': 'Live', 'work.bilingual': 'Bilingual', 'proj4.alt': 'Bordj Steel website preview', 'proj2.alt': 'Alliance Travel website preview', 'proj3.alt': 'AlmaFlowClim website preview', 'proj6.alt': 'Nomara Voyages website preview', 'proj7.alt': 'Glaive Store website preview', 'ui.menu': 'Menu', 'ui.close': 'Close', 'ui.sections': 'Sections', 'founder.arPill': 'AR native', 'founder.linksAria': "Founder's profiles",
      'team.h': 'Alongside him, the team',
      'team.dFn': 'Data specialist', 'team.dDo': 'Pipelines, scraping and the intelligence layer.',
      'team.sFn': 'Sales & partnerships', 'team.sDo': 'First contact: the translator between idea and scope.',
      'team.tFn': 'Technical representative', 'team.tDo': 'Keeps the build honest and the client informed.',
      'stack.kicker': '07 — Tools',
      'stack.title': 'The tools <em>we build with.</em>',
      'stack.lead': 'Chosen to last, not to follow trends.',
      'stack.gFront': 'Front', 'stack.gBack': 'Back', 'stack.gCloud': 'Cloud', 'stack.gData': 'Data', 'stack.gMobile': 'Mobile',
      'faq.kicker': '08 — FAQ', 'faq.title': 'The questions <em>that matter.</em>',
      'faq.lead': 'What people ask before they start — answered straight.',
      'faq1.q': 'How long does a project take?', 'faq1.a': 'It depends on the scope: 2 to 4 weeks for a showcase site, 3 to 7 for a custom site and 8 to 16 for a web application. You get a firm timeline as soon as we have agreed the scope together.',
      'faq2.q': 'What does it cost?', 'faq2.a': 'Our packages start at 90,000 DZD for a showcase site (see Pricing for euros and dollars), and every project gets one fixed price once the scope is clear — no surprise fees. Registered businesses can also get the Preview: we build your homepage for free, before you pay anything. We take on at most 4 a month, across all clients.',
      'faq3.q': 'What languages do you work in?', 'faq3.a': 'French, Arabic and English — spoken, written, and in everything we deliver. This very site is trilingual, with a natively mirrored Arabic (right-to-left) experience.',
      'faq4.q': 'What happens after launch?', 'faq4.a': 'We stay. Every package includes 1, 3 or 6 months of support, and we reply within 24 working hours. After that, maintenance is optional: monthly, with no lock-in (see Pricing). No “good luck” on launch day.',
      'faq5.q': 'Do you work remotely?', 'faq5.a': 'Yes. We\'re based in Bordj Bou Arréridj, but we work with clients anywhere — including in France. Distance doesn\'t change your direct line to the person building your project.',
      'faq6.q': 'How are you different from an agency?', 'faq6.a': 'No middleman: one team scopes, codes and ships your project, design to deploy. And for a registered business, you see your homepage running before you pay anything — up to 4 Previews a month, across all clients.',
      'contact.kicker': '09 — Contact',
      'contact.title': 'Let\'s talk about <em>your project.</em>',
      'contact.sub': 'Tell us what you need: an urgent job, something that needs fixing, a deadline to meet. In English, French or Arabic.',
      'contact.chStudio': 'Studio', 'contact.chReply': 'Reply',
      'contact.vStudio': 'Bordj Bou Arréridj · Algeria', 'contact.vReply': '< 24 working hours · FR · EN · AR',
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
      'form.edit': 'Back to my message',
      'footer.signoff': 'Built in Bordj Bou Arréridj, with black coffee and TypeScript.',
      'footer.rights': '© 2026 Numidea Labs',
      'footer.tag': 'Rooted in Numidia · built on ideas'
    },
    /* Arabic: written for this site, pending a native speaker's review (see
       OWNER-CONTENT.md). Conventions: Western digits, forward arrows ←,
       singular "you", brand names in Latin script except نوميديا in prose. */
    ar: {
      dir: 'rtl',
      title: 'Numidea Labs — مواقع ويب مخصّصة بالعربية والفرنسية والإنجليزية',
      'meta.desc': 'استوديو ويب وبرمجيات في برج بوعريريج، الجزائر. نصمّم ونبرمج ونطلق مواقع وتطبيقات الويب ونتابعها بعد الإطلاق، بالعربية والفرنسية والإنجليزية.',
      'nav.about': 'المنهج', 'nav.services': 'الخدمات', 'nav.work': 'الأعمال',
      'nav.team': 'الفريق', 'nav.faq': 'الأسئلة', 'nav.contact': 'تواصل',
      'hero.eyebrow': 'استوديو ويب وبرمجيات · برج بوعريريج، الجزائر',
      'hero.title': 'موقعك المخصّص، <span class="swash">بالعربية والفرنسية والإنجليزية.</span>',
      'hero.lede': 'شركة مسجّلة؟ قبل أيّ دفع، نبني الصفحة الرئيسية لموقعك الجديد بمحتواك أنت خلال 5 أيام عمل (4 معاينات في الشهر كحدّ أقصى لجميع العملاء). ووراء ذلك مؤسّس مصمّم ومطوّر وثلاثة مختصّين، من الخوادم إلى أدقّ تفاصيل الواجهة، مع متابعة بعد الإطلاق.',
      'hero.cta1': 'اطلب معاينتك المجانية ←', 'hero.cta2': 'شاهِد أعمالنا',
      'hero.plateLive': 'على الإنترنت', 'tb.lang': 'اللغات', 'tb.liveV': '4 مواقع لعملائنا', 'tb.live': 'على الإنترنت', 'tb.previewV': 'مجّانية · 5 أيام عمل', 'tb.preview': 'المعاينة', 'tb.replyV': 'أقل من 24 ساعة عمل', 'tb.reply': 'الردّ', 'tb.langV': 'العربية · الفرنسية · الإنجليزية', 'tb.place': 'برج بوعريريج، الجزائر', 'tb.studio': 'الاستوديو',
      'sheet.scale': 'مقياس 1:1', 'sheet.rev': 'مراجعة 2026-08', 'sheet.sheet': 'لوحة 01',
      'proof.kicker': '01 — الإثبات',
      'proof.s1': 'مشاريع مُسلَّمة', 'proof.s2': 'أعضاء في الفريق', 'proof.s3': 'لغات', 'proof.s4': 'زمن الردّ، بساعات العمل',
      'proof.line': 'أربعة مواقع لعملائنا تعمل اليوم على الإنترنت — تصفّحها أدناه.',
      'svc.kicker': '03 — الخدمات',
      'svc.title': 'ما <em>نبنيه لك.</em>',
      'svc.outcomeLabel': 'النتيجة',
      'work.kicker': '02 — الأعمال',
      'work.title': 'أعمال <em>مختارة.</em>',
      'proj1.cat': 'صحة · Next.js', 'proj1.desc': 'موقع هادئ لعيادة صغيرة، مع حجز المواعيد عبر الإنترنت.',
      'proj2.cat': 'سفر · نموّ', 'proj2.desc': 'هوية بصرية وموقع ثلاثي اللغة ومسار تسويقي لوكالة سفر في برج بوعريريج، مع خدمة لحجز مواعيد التأشيرة.',
      'proj3.cat': 'حِرفي · إيل دو فرانس', 'proj3.desc': 'موقع حِرفي في التكييف والتدفئة والسباكة بضواحي باريس: صفحة لكل خدمة، وصفحة لأعماله المنجزة، وطلب عرض سعر عبر استمارة واحدة.',
      'proj4.cat': 'صناعة · B2B', 'proj4.desc': 'الموقع المؤسسي B2B لـ Bordj Steel SPA، رائدة الإنشاءات المعدنية في الجزائر — كتالوج المنتجات والمراجع وقسم التوظيف.',
      'proj5.cat': 'PWA · Supabase', 'proj5.desc': 'تطبيق ويب تقدّمي مصمَّم ليعمل حتى دون اتصال بالإنترنت.',
      'proj6.cat': 'سفر · عمرة', 'proj6.desc': 'واجهة ثنائية اللغة لرحلات منظَّمة والعمرة انطلاقاً من قسنطينة.',
      'proj7.cat': 'تجارة · ألعاب', 'proj7.desc': 'متجر إلكتروني لعلامة خيالية لعتاد الألعاب، بهوية بصرية جريئة، صمّمناه من الألف إلى الياء ليكون عرضاً تجريبياً.',
      'clients.h': 'وثقوا بنا في إنجاز مواقعهم',
      'proj4.gain': 'يجد المشتري خط الإنتاج المناسب وخصائصه التقنية دون أن يتصل.', 'proj2.gain': 'يقدّر المسافر سعر رحلته ويرسل عبر واتساب طلب حجز كاملاً.',
      'proj3.gain': 'عند العطل، يتصل العميل بلمسة واحدة من صفحة التخصّص المعني.', 'proj6.gain': 'يقارن المعتمر باقات العمرة حسب السعر والمسافة عن الحرم، ثم يراسل الوكالة عبر واتساب.',
      'work.gainMore': ' — التفاصيل في لوحة المشروع',
      'work.lead': 'مواقع عملائنا، تصفّحها بنفسك، إضافةً إلى عرض تجريبي ومشروعين قيد الإنجاز.',
      'work.live': 'زيارة الموقع ←', 'work.soon': 'قيد الإنجاز', 'work.sheet': 'اعرض لوحة المشروع ←', 'work.concept': 'عرض تجريبي',
      'how.kicker': '04 — المنهج',
      'how.title': 'أربع خطوات. <em>بلا مفاجآت.</em>',
      'how.lead': 'شركة مسجّلة؟ لا تدفع شيئاً قبل أن ترى صفحتك الرئيسية تعمل.',
      'scene.kicker': '◆ اللوحات · بنداً ببند', 'scene.title': 'أعمالنا، مشروعاً بمشروع.',
      'scene.lead': 'الصفحات وعرض الهاتف والنظام البصري لكل مشروع، ملتقطة من المواقع كما هي على الإنترنت.',
      'scene.cta': 'افتح لوحات المشاريع ←',
      'founder.kicker': '06 — الفريق والمؤسّس', 'founder.title': 'للاستوديو <em>وجه.</em>',
      'founder.lead': 'خلف Numidea Labs: مؤسّس يصمّم ويبرمج ويُنجز، ومعه ثلاثة مختصّين.',
      'founder.role': 'مصمّم غرافيك ومطوّر ويب · المؤسّس', 'founder.years': '6 سنوات', 'founder.city': 'برج بوعريريج',
      'founder.bio': 'ستّ سنوات في تصميم الهويّات وبرمجة الواجهات وتسليم المنتجات — من العلامة إلى الواجهة إلى السحابة. أحوّل الفكرة إلى منتج، وأبقى بعد الإطلاق.',
      'founder.cvBtn': 'عرض المسار <span class="arr">↴</span>', 'founder.cvClose': 'إخفاء المسار ↑', 'founder.portfolio': 'المعرض الشخصي <span class="arr">↗</span>',
      'founder.expLabel': 'المسار', 'founder.skillsLabel': 'المهارات', 'founder.eduLabel': 'التعليم',
      'founder.edu': 'علوم الحاسوب — جامعة محمد البشير الإبراهيمي · 2018–2024',
      'founder.download': 'تحميل السيرة (PDF) ↓',
      'fx1': 'مصمّم غرافيك', 'fx2': 'مصمّم غرافيك ومطوّر ويب، مستقل', 'fx3': 'مطوّر ويب ومسيّر شبكات التواصل', 'fx4': 'مصمّم غرافيك وويب', 'fx5': 'صانع محتوى وفيديو',
      'fx1.when': 'ماي 2026 — حالياً', 'fx2.when': '2019 — حالياً', 'fx3.when': 'فيفري – ماي 2026', 'fx4.when': 'أوت 2025 – فيفري 2026', 'fx5.when': 'مارس – جويلية 2024',
      'fx1.what': 'تصاميم ومواد تواصل لمنصّة تنقّل دولية، وتطبيق هويّة العلامة على الحملات وشبكات التواصل.',
      'fx2.what': 'مواقع تعريفية وصفحات هبوط موجّهة للتحويل؛ هويّات بصرية وملصقات وأغلفة ألبومات؛ إدارة فنية لحملات NFT ولعلامات موسيقيين.',
      'fx3.what': 'الموقع الكامل للوكالة، وتجديد الهويّة البصرية للعلامة واستراتيجيتها على شبكات التواصل.',
      'fx4.what': 'إعادة تصميم الهويّة (الشعار والميثاق) والمطبوعات، ثم موقع متجاوب سُلِّم من الألف إلى الياء.',
      'fx5.what': 'فيديوهات قصيرة للفعاليات والحملات المجتمعية، وتنشيط ورشات إبداعية.',
      'fs1.h': 'التصميم والهويّة', 'fs1': 'العلامة التجارية · الهويّة البصرية · الرسم الرقمي · الإدارة الفنية لواجهات المستخدم · التصوير والمعالجة',
      'fs2.h': 'الويب والواجهات', 'fs2': 'HTML / CSS / JS · React · مواقع تعريفية · صفحات هبوط · أنظمة إدارة المحتوى · تحسين محرّكات البحث (SEO) · تصميم متجاوب',
      'fs3.h': 'الاستراتيجية والمحتوى', 'fs3': 'شبكات التواصل · الكتابة الإبداعية · دمج الذكاء الاصطناعي · الأتمتة · إدارة المشاريع',
      'founder.skillsNote': 'تقليص وقت الإنتاج بنحو 20٪ بفضل دمج أدوات الذكاء الاصطناعي. قيد التعلّم: التصميم الحركي والمونتاج.',
      'founder.certs': 'الشهادات: Duolingo English Test · التصميم الرقمي (Artiland.Studio) · التصميم الحركي ثلاثي الأبعاد',
      'pl.vista': 'لوحة 1 — جبال البيبان · برج بوعريريج', 'pl.arch': 'لوحة 2 — قوس تراجان · تيمقاد', 'pl.coins': 'لوحة 3 — نقود نوميدية', 'pl.strata': 'لوحة 4 — مقطع في طبقات الأرض', 'pl.light': 'لوحة 5 — رأس كاربون · بجاية', 'pl.dunes': 'لوحة 6 — العرق الكبير',
      'whq.kick': 'المشروع المفضّل لدى المؤسس', 'whq.sub': 'صدر WorkspaceHQ v3 — شيفرتك، لعبة أركيد',
      'ui.top': 'إلى الأعلى', 'tag.brand': 'هوية', 'tag.corporate': 'مؤسّسي', 'tag.funnel': 'مسار تسويقي', 'tag.static': 'موقع تعريفي', 'tag.commerce': 'تجارة', 'tag.booking': 'حجز', 'tag.offline': 'دون اتصال', 'tag.identity': 'هوية بصرية', 'tag.designSystems': 'أنظمة تصميم', 'tag.motion': 'حركة', 'tag.maps': 'خرائط', 'tag.scoring': 'تقييم', 'tag.strategy': 'استراتيجية', 'tag.funnels': 'مسارات تسويقية', 'tag.audits': 'تدقيق', 'tag.seo': 'تحسين محرّكات البحث (SEO)', 'tag.apis': 'واجهات برمجية', 'mk.srcRange': '(من المستقل المتمرّس ← إلى الوكالة)', 'footer.legal': 'الإشعار القانوني', 'footer.privacy': 'الخصوصية', 'work.voicesH': 'ما يقوله عملاؤنا', 'mbar.aria': 'تواصل سريع', 'mbar.cta': 'ابدأ مشروعاً', 'footer.studioH': 'الاستوديو', 'footer.contactH': 'تواصل', 'footer.founderH': 'المؤسّس', 'form.note': 'يفتح الإرسال تطبيق البريد لديك والرسالة جاهزة. لا يحتفظ هذا الموقع برسالتك.', 'ui.skip': 'انتقل إلى المحتوى', 'ui.navPrimary': 'التنقّل الرئيسي', 'ui.theme': 'المظهر', 'ui.lang': 'اللغة', 'footer.navAria': 'تذييل الصفحة', 'hero.plateRail': 'المشاريع المعروضة', 'hero.platePause': 'إيقاف التدوير مؤقتاً', 'work.livePill': 'على الإنترنت', 'work.bilingual': 'ثنائي اللغة', 'proj4.alt': 'معاينة موقع Bordj Steel', 'proj2.alt': 'معاينة موقع Alliance Travel', 'proj3.alt': 'معاينة موقع AlmaFlowClim', 'proj6.alt': 'معاينة موقع Nomara Voyages', 'proj7.alt': 'معاينة موقع Glaive Store', 'ui.menu': 'القائمة', 'ui.close': 'إغلاق', 'ui.sections': 'الأقسام', 'founder.arPill': 'العربية لغة أم', 'founder.linksAria': 'حسابات المؤسّس',
      'team.h': 'وإلى جانبه، الفريق',
      'team.dFn': 'مختصّ البيانات', 'team.dDo': 'خطوط المعالجة، واستخراج البيانات، وطبقة الذكاء.',
      'team.sFn': 'المبيعات والشراكات', 'team.sDo': 'أول تواصل: ترجمة الفكرة إلى نطاق عمل.',
      'team.tFn': 'مسؤول المتابعة التقنية', 'team.tDo': 'متابعة جودة ما نُسلّمه، وإطلاع العميل على سير العمل أولاً بأول.',
      'stack.kicker': '07 — الأدوات',
      'stack.title': 'أدوات متينة، <em>بلا استعراض.</em>',
      'stack.lead': 'مختارة لتدوم، لا لتتبع الموضة.',
      'stack.gFront': 'الواجهة', 'stack.gBack': 'الخادم', 'stack.gCloud': 'السحابة', 'stack.gData': 'البيانات', 'stack.gMobile': 'الهاتف',
      'faq.kicker': '08 — الأسئلة', 'faq.title': 'الأسئلة <em>التي تهمّ.</em>',
      'faq.lead': 'ما يُسأل قبل البدء — بإجابات صريحة.',
      'faq1.q': 'كم يستغرق الإنجاز؟', 'faq1.a': 'يعتمد على حجم المشروع: من 2 إلى 4 أسابيع للموقع التعريفي، ومن 3 إلى 7 أسابيع للموقع المخصّص، ومن 8 إلى 16 أسبوعاً لتطبيق الويب. ونحدّد معك موعد التسليم النهائي بمجرّد أن نضبط نطاق العمل معاً.',
      'faq2.q': 'كم التكلفة؟', 'faq2.a': 'أسعارنا منشورة في قسم الأسعار: تبدأ باقاتنا من 90 000 دج للموقع التعريفي، ونحدّد سعراً ثابتاً بعد توضيح نطاق العمل — دون مفاجآت. وللشركات المسجّلة نبني الصفحة الرئيسية أولاً ومجّاناً، وهذه هي المعاينة (4 معاينات في الشهر كحدّ أقصى لجميع العملاء).',
      'faq3.q': 'بأي لغات تعملون؟', 'faq3.a': 'الفرنسية والعربية والإنجليزية — حديثاً وكتابةً وفي المنتَج المُسلَّم. هذا الموقع نفسه ثلاثي اللغات، بنسخة عربية مصمّمة من الأساس للكتابة من اليمين إلى اليسار.',
      'faq4.q': 'وماذا بعد الإطلاق؟', 'faq4.a': 'نبقى معك. كل باقة تشمل دعماً لمدّة شهر أو 3 أو 6 أشهر، ونردّ عليك خلال 24 ساعة عمل. بعدها تصبح الصيانة اختيارية: اشتراك شهري دون التزام بمدّة (انظر الأسعار). لا «حظّاً موفقاً» يوم الإطلاق.',
      'faq5.q': 'هل تعملون عن بُعد؟', 'faq5.a': 'نعم. مقرّنا في برج بوعريريج، لكنّنا نعمل مع عملاء في كل مكان، ومنهم عملاء في فرنسا. والبُعد لا يغيّر شيئاً في تواصلك المباشر مع من يبني مشروعك.',
      'faq6.q': 'ما الذي يميّزكم عن وكالة؟', 'faq6.a': 'لا وسيط: فريق واحد يحدّد نطاق مشروعك ويبرمجه ويُسلّمه، من التصميم إلى النشر. وللشركات المسجّلة، ترى صفحتك الرئيسية تعمل قبل أن تدفع أيّ شيء — في حدود 4 معاينات في الشهر لجميع العملاء.',
      'contact.kicker': '09 — تواصل',
      'contact.title': 'لنتحدّث عن <em>مشروعك.</em>',
      'contact.sub': 'أخبرنا بما تريد إنجازه: أمر عاجل، أو موقع يحتاج إلى إصلاح، أو موعد نهائي يقترب. بالفرنسية أو الإنجليزية أو العربية.',
      'contact.chStudio': 'الاستوديو', 'contact.chReply': 'الردّ',
      'contact.vStudio': 'برج بوعريريج · الجزائر', 'contact.vReply': 'أقل من 24 ساعة عمل · بالفرنسية والإنجليزية والعربية',
      'form.name': 'الاسم', 'form.namePh': 'اسمك',
      'form.email': 'البريد', 'form.emailPh': 'you@company.com',
      'form.message': 'الرسالة', 'form.messagePh': 'ماذا سنبني؟',
      'form.send': 'ابدأ مشروعاً ←',
      'form.errName': 'أدخِل اسمك لنعرف مع من نتحدّث.',
      'form.errEmail': 'أدخِل بريدك الإلكتروني لنتمكّن من الردّ عليك.',
      'form.errEmailValid': 'يبدو هذا البريد ناقصاً — تحقّق منه.',
      'form.errMsg': 'أخبرنا بسطر عن المشروع.',
      'form.success': 'من المفترض أن يفتح تطبيق البريد والرسالة جاهزة — لم يبقَ سوى إرسالها.',
      'form.successAlt': 'لم يفتح شيء؟ راسلنا مباشرة:',
      'form.edit': 'العودة إلى رسالتي',
      'footer.signoff': 'بُني في برج بوعريريج، بقهوة سوداء و TypeScript.',
      'footer.rights': '© 2026 نوميديا لابز',
      'footer.tag': 'جذورها في نوميديا · مبنيّة على الأفكار'
    }
  };

  /* ---- Services Catalog + Trust strip strings (merged into I18N) ---- */
  var EXTRA = {
    fr: {
      'mk.h': 'Algérie, France, États-Unis : un projet, trois marchés',
      'mk.vizCap': "Échelle logarithmique : chaque grande graduation vaut dix fois la précédente. Entre les deux lignes en tirets, la fourchette de Numidea, prolongée sur les trois marchés ; une barre qui s'estompe n'a pas de plafond. Montants convertis au taux officiel, chiffres exacts dans le tableau ci-dessous.",
      'mk.k': 'k', 'mk.M': 'M', 'mk.k.n': 'k|k', 'mk.M.n': 'M|M',
      'prev.tl1': 'Vous envoyez votre contenu', 'prev.tl2': "On construit votre page d'accueil", 'prev.tl2d': '5 jours ouvrés',
      'prev.tl3': 'On vous la présente', 'prev.tl3d': 'visio de 30 min', 'prev.tl4': 'Vous décidez', 'prev.tl4d': "Payé jusqu'ici :",
      'mk.p': "Le même projet, chiffré sur trois marchés. Fourchettes courantes 2026, du freelance confirmé à l'agence — hors taxes.",
      'mk.curL': 'Afficher en', 'mk.curNative': "Devise d'origine",
      'mk.cap': 'Fourchettes de prix courantes par type de projet',
      'mk.colType': 'Projet', 'mk.colDz': 'Algérie', 'mk.colNl': 'Numidea', 'mk.colFr': 'France', 'mk.colUs': 'États-Unis',
      'mk.day1': 'Une journée de développeur confirmé en France coûte',
      'mk.day2': 'au taux officiel, soit à peu près le prix d\'un site vitrine complet sur le marché algérien.',
      'mk.note': 'Conversions au taux officiel de la Banque d\'Algérie, début octobre 2026 : 1 € ≈ 151 DA, 1 $ ≈ 134 DA. L\'écart tient au coût de la vie et au change, pas aux outils — nous livrons avec les mêmes outils que les studios européens et américains : React, Next.js, Vercel.',
      'mk.srcSum': 'Sources et méthode',
      'mk.method': "Chaque case va du bas de la fourchette d'un freelance confirmé au haut de celle d'une agence ; « + » signale une borne haute ouverte. Les extrêmes — sites à 300 € ou à 250 000 $ — sont exclus. La colonne Numidea est calculée par l'estimateur ci-dessus, au périmètre type de chaque projet.",
      'mk.srcDz': 'Algérie', 'mk.srcFr': 'France', 'mk.srcUs': 'États-Unis', 'mk.srcFx': 'Change',
      'md.h': 'Comment un projet est chiffré',
      'md.p': 'Il y a quatre façons de facturer un projet. Chacune est la norme quelque part.',
      'md.ours': 'Notre modèle',
      'md.fH': 'Au forfait', 'md.fP': "Un prix fixe pour un périmètre écrit. Si le travail déborde, c'est le prestataire qui absorbe l'écart.",
      'md.fW': "La norme en Algérie : le baromètre Onyxlab chiffre tout le développement au forfait. C'est ainsi que nous chiffrons chaque projet.",
      'md.tH': 'Au temps passé', 'md.tP': "Facturé au jour ou à l'heure. Souple quand le périmètre bouge, difficile à budgéter d'avance.",
      'md.tW': "La norme en France (480 –⁠ 650 € par jour pour un développeur confirmé) et aux États-Unis (100 –⁠ 149 $ de l'heure en agence).",
      'md.aH': "À l'abonnement", 'md.aP': 'Un montant mensuel pour un service continu : maintenance, évolutions, contenu.',
      'md.aW': 'Courant partout après le lancement. C\'est le modèle de notre maintenance : 18 000 –⁠ 60 000 DA par mois.',
      'md.vH': 'À la valeur', 'md.vP': "Le prix suit ce que le projet rapporte, pas le temps qu'il demande.",
      'md.vW': "Plus rare, surtout en conseil et en stratégie, là où l'enjeu se mesure.",
      'md.drH': 'Ce qui fait bouger un devis',
      'md.d1h': 'Le périmètre', 'md.d1p': "Le nombre de pages, de produits ou d'écrans.",
      'md.d2h': 'Le design', 'md.d2p': "Entièrement sur mesure, ou à partir de votre charte et de vos maquettes existantes.",
      'md.d3h': 'Les langues', 'md.d3p': "Chaque langue ajoute du contenu ; l'arabe ajoute une mise en page de droite à gauche.",
      'md.d4h': 'Les intégrations', 'md.d4p': 'Paiement, comptes utilisateurs, outils et API tiers.',
      'md.d5h': 'Le contenu', 'md.d5p': 'Textes, photos et vidéos : fournis par vous, ou à produire.',
      'md.d6h': 'Le délai', 'md.d6p': 'Un calendrier compressé coûte plus cher : +25 % dans notre estimateur.',
      'price.waSoonSuffix': ' · bientôt',
      'nav.pricing': 'Tarifs',
      'wa.hello': "Bonjour Numidea Labs — j'aimerais parler d'un projet.",
      'footer.wa': 'WhatsApp',
      'price.kicker': '05 — Tarifs', 'price.title': 'Un prix <em>avant le devis.</em>',
      'price.lead': 'Nos prix, publiés — à côté des tarifs courants en Algérie, en France et aux États-Unis. Ajustez le périmètre et voyez l\'estimation évoluer.',
      'price.cur': 'DA',
      'price.popular': 'Recommandé',
      'price.t1name': 'Essentiel', 'price.t1for': 'Une présence crédible, vite en ligne.', 'price.t1time': '2 à 4 semaines',
      'price.t1a': 'Vitrine ou landing, 1 à 5 pages',
      'price.t1b': 'Design sur mesure — jamais un modèle tout fait repeint à vos couleurs',
      'price.t1c': 'Responsive, performance et SEO de base',
      'price.t1d': 'Mise en ligne, domaine et certificat configurés',
      'price.t1e': '1 mois de support inclus',
      'price.t2name': 'Studio', 'price.t2for': "Le site qui porte vraiment l'entreprise.", 'price.t2time': '3 à 7 semaines',
      'price.t2a': 'Site sur mesure, 6 à 15 pages',
      'price.t2b': 'Trilingue FR / EN / AR, avec un arabe RTL pensé nativement',
      'price.t2c': 'Design system documenté — styles, composants, le kit complet',
      'price.t2d': 'CMS ou back-office pour gérer le contenu vous-même',
      'price.t2e': 'SEO technique, Core Web Vitals, accessibilité',
      'price.t2f': '3 mois de support inclus',
      'price.t3name': 'Moteur', 'price.t3for': 'Quand il vous faut un outil métier, pas seulement un site.', 'price.t3time': '8 à 16 semaines',
      'price.t3a': 'Application web sur mesure : plateforme, portail ou outil métier',
      'price.t3b': 'Paiement, comptes utilisateurs, tableaux de bord',
      'price.t3c': 'Scraping et intelligence marché, intégrés à l\'application',
      'price.t3d': 'Intégrations API et outils internes',
      'price.t3e': '6 mois de support inclus',
      'price.retainerA': 'Maintenance après livraison, si vous la voulez :', 'price.retainerB': 'par mois. Sans engagement de durée.',
      'price.curL': 'Afficher les prix en', 'price.exTax': 'HT',
      'price.curNoteEUR': "≈ Conversion au taux officiel de la Banque d'Algérie (1 € ≈ 151 DA, octobre 2026), arrondie. Prix HT. Entreprise française : facture sans TVA, autoliquidée par vos soins (art. 283-2 du CGI).",
      'price.curNoteUSD': "≈ Conversion au taux officiel de la Banque d'Algérie (1 $ ≈ 134 DA, octobre 2026), arrondie. Prix hors taxes.",
      'price.estH': 'Estimez votre projet',
      'price.estP': 'Indiquez ce dont vous avez besoin : la fourchette se met à jour en direct. Pour un site vitrine, un site sur mesure ou une application web, ce sont les mêmes chiffres que dans les formules ci-dessus.',
      'price.qType': 'Quel type de projet ?', 'price.qSize': 'Ampleur', 'price.qOpts': 'Options', 'price.qPace': 'Délai',
      'price.tyVitrine': 'Vitrine', 'price.tyCustom': 'Site sur mesure', 'price.tyShop': 'E-commerce',
      'price.tyApp': 'Application web', 'price.tyAuto': 'Automatisation', 'price.tyBrand': 'Identité visuelle',
      'price.oI18n': 'Trilingue FR / EN / AR + RTL', 'price.oCms': 'CMS / back-office', 'price.oPay': 'Paiement en ligne',
      'price.oDs': 'Design system complet', 'price.oSeo': 'SEO avancé & performance', 'price.oApi': 'Intégrations API', 'price.incl': 'déjà dans la formule',
      'price.studioBetter': 'La formule Studio inclut déjà ces options',
      'price.paceStd': 'Standard', 'price.paceRush': 'Accéléré',
      'price.uPages': 'pages', 'price.uPages.n': 'page|pages', 'price.uScreens': 'écrans', 'price.uScreens.n': 'écran|écrans', 'price.uProducts': 'produits', 'price.uProducts.n': 'produit|produits', 'price.uFlows': 'flux', 'price.uFlows.n': 'flux|flux', 'price.uSupports': 'supports', 'price.uSupports.n': 'support|supports',
      'price.estimate': 'Estimation', 'price.weeks': 'semaines', 'price.weeks.n': 'semaine|semaines',
      'price.estFine': "Fourchette indicative, pas un devis. Le prix ferme suit, une fois le périmètre cadré ensemble — et il ne bouge plus ensuite.",
      'price.estCta': 'Obtenir le prix ferme →',
      'price.moreSum': 'Comment on chiffre', 'price.moreHint': 'Le marché, les modèles de facturation, ce qui fait bouger un devis.',
      'price.ob1h': 'Vous décrivez le projet', 'price.ob1p': 'Deux minutes, par écrit ou de vive voix. En français, anglais ou arabe.',
      'price.ob2h': 'On revient sous 24 h ouvrées', 'price.ob2p': 'Avec nos questions, puis un périmètre écrit et un prix ferme dès que le cadrage est validé ensemble. Pas une fourchette, un chiffre.',
      'price.ob3h': 'On construit l\'Aperçu — gratuit', 'price.ob3p': 'La page d\'accueil de votre site, avec votre contenu, avant tout paiement. Pour les entreprises immatriculées, 4 par mois au maximum, tous clients confondus.',
      'price.ob4h': 'Vous décidez', 'price.ob4p': 'Si c\'est non, vous ne devez rien. Si c\'est oui, la page d\'accueil est déjà faite : on enchaîne sur le reste.',
      'price.obCta1': 'Décrire mon projet →', 'price.obCta2': 'WhatsApp',
      'price.waSoon': 'WhatsApp — bientôt',
      'svc.famBuild': 'Sites & design', 'svc.famEngine': 'Données & automatisation', 'svc.famMind': 'Conseil & IA',
      'svc.lead': 'Nos cinq services principaux — et cinq autres juste en dessous.',
      'prev.tag': 'Offre signature', 'prev.name': "L'Aperçu", 'prev.promise': 'Zéro risque. Juste la preuve.',
      'prev.brief': 'Avant tout paiement, on construit la page d\'accueil de votre nouveau site, avec votre contenu, en 5 jours ouvrés. On vous la présente en visio (30 min). Si vous dites non, vous ne devez rien.', 'prev.terms': 'Gratuit et sans engagement · réservé aux entreprises immatriculées · 4 Aperçus par mois au maximum, tous clients confondus.', 'prev.cta': 'Demander mon Aperçu →', 'prev.wa': 'ou par WhatsApp', 'prev.msg': 'Bonjour, je souhaite voir l\'Aperçu gratuit de mon futur site.\nEntreprise : \nSite actuel (s\'il existe) : \nCe dont j\'ai besoin : ', 'prev.waText': 'Bonjour Numidea Labs, je souhaite voir l\'Aperçu gratuit de mon futur site.', 'form.source': 'Source', 'contact.chTz': 'Fuseau', 'contact.vTz': 'UTC+1 · l\'heure de Paris en hiver, 1 h de moins en été', 'contact.waNote': 'message gratuit via l\'appli',
      'prev.outcome': 'Vous dites oui en connaissance de cause : vous avez déjà vu le résultat.',
      'f1.name': 'Sites & applications web', 'f1.promise': 'Le choix évident.',
      'f1.brief': 'Sites et applications web sur mesure — rapides, bien référencés, pensés pour convertir, du front-end au cloud. Pas de modèle acheté puis maquillé : on dessine votre site de zéro.',
      'f2.name': 'Identité & systèmes visuels', 'f2.promise': 'La confiance avant le premier mot.',
      'f2.brief': 'Logos, couleurs, typographie, animation et une charte complète, documentée, prête à l\'emploi : ce qui donne à une petite entreprise l\'allure d\'une maison établie.',
      'f3.name': 'Automatisation & pipelines', 'f3.promise': 'Supprimez la corvée.',
      'f3.brief': 'Scrapers, pipelines de données, génération de leads, automatisations, outils internes. Le travail répétitif et fragile qui dévore vos heures — on le fait tourner seul à 3 h du matin.',
      'f4.name': 'Intelligence marché & produit', 'f4.promise': 'Voir le marché clairement.',
      'f4.brief': 'Transformez les données publiques du web en base exploitable : veille concurrentielle, suivi des prix et des catalogues — collectées dans le respect des conditions de chaque site et du RGPD, structurées, interrogeables.',
      'f5.name': 'Stratégie & conseil croissance', 'f5.promise': 'De la donnée, pas des impressions.',
      'f5.brief': 'Audits marketing complets, analyse des tunnels de vente, positionnement concurrentiel, feuilles de route — honnêtes, ROI d\'abord, par phases. On étudie votre secteur avant le premier appel.',
      'cap.summary': 'Voir les 5 autres services', 'cap.hint': 'Boutique & réservation, design graphique, data science, systèmes de connaissance, outils IA.', 'cap.h': 'Les 5 autres services',
      'c1.name': 'Boutique & réservation', 'c1.promise': 'De la visite au paiement.',
      'c1.brief': 'Boutiques en ligne et systèmes de réservation adaptés aux habitudes d\'achat en Algérie : commande par WhatsApp, paiement à la livraison, ou boutique Shopify sur mesure quand c\'est pertinent.', 'c1.fam': 'Sites & design',
      'c2.name': 'Design graphique & réseaux sociaux', 'c2.promise': 'Des visuels qui arrêtent le regard.',
      'c2.brief': 'Packs réseaux sociaux, carrousels, infographies, print — depuis un système visuel verrouillé, pour que tout vous ressemble.', 'c2.fam': 'Sites & design',
      'c3.name': 'Data science & analytics', 'c3.promise': 'Du signal dans le bruit.',
      'c3.brief': 'Un travail statistique rigoureux — modélisation économétrique, séries temporelles, prévision, tableaux de bord. Analyse testée et défendable.', 'c3.fam': 'Données & automatisation',
      'c4.name': 'Systèmes de connaissance', 'c4.promise': 'Une entreprise qui se souvient.',
      'c4.brief': 'Architecture de connaissance interne — Obsidian/PARA + Zettelkasten, documentation, bases prêtes pour le RAG. Des structures qui s\'entretiennent seules.', 'c4.fam': 'Conseil & IA',
      'c5.name': 'Outils & assistants IA sur mesure', 'c5.promise': 'Le logiciel qui construit votre logiciel.',
      'c5.brief': 'Outils internes, générateurs et assistants sur mesure, propulsés par Claude : une tâche répétitive se lance en un clic.', 'c5.fam': 'Conseil & IA',
    },
    en: {
      'mk.h': 'Algeria, France, United States: one project, three markets',
      'mk.vizCap': "Logarithmic scale: each major gridline is ten times the one before. Between the two dashed lines, Numidea's range, carried across the three markets; a bar that fades out has no upper limit. Amounts converted at the official rate; exact figures in the table below.",
      'mk.k': 'k', 'mk.M': 'M', 'mk.k.n': 'k|k', 'mk.M.n': 'M|M',
      'prev.tl1': 'You send your content', 'prev.tl2': 'We build your homepage', 'prev.tl2d': '5 working days',
      'prev.tl3': 'We walk you through it', 'prev.tl3d': '30-minute video call', 'prev.tl4': 'You decide', 'prev.tl4d': 'Paid so far:',
      'mk.p': 'The same project, priced in three markets. Typical 2026 ranges, from an experienced freelancer to an agency — excluding tax.',
      'mk.curL': 'Show in', 'mk.curNative': 'Original currency',
      'mk.cap': 'Typical price ranges by project type',
      'mk.colType': 'Project', 'mk.colDz': 'Algeria', 'mk.colNl': 'Numidea', 'mk.colFr': 'France', 'mk.colUs': 'United States',
      'mk.day1': 'A day\'s work by an experienced developer in France costs',
      'mk.day2': 'at the official rate — roughly the price of an entire showcase site on the Algerian market.',
      'mk.note': "Converted at the Bank of Algeria's official rate, early October 2026: €1 ≈ 151 DZD, $1 ≈ 134 DZD. The gap comes from cost of living and exchange rates, not tools — we build with the same tools as European and American studios: React, Next.js, Vercel.",
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
      'md.d2h': 'Design', 'md.d2p': 'Fully custom, or built from your existing brand guidelines and mockups.',
      'md.d3h': 'Languages', 'md.d3p': 'Each language adds content; Arabic adds a right-to-left layout.',
      'md.d4h': 'Integrations', 'md.d4p': 'Payments, user accounts, third-party tools and APIs.',
      'md.d5h': 'Content', 'md.d5p': 'Copy, photos and video: supplied by you, or produced.',
      'md.d6h': 'Timeline', 'md.d6p': 'A compressed schedule costs more: +25% in our estimator.',
      'price.waSoonSuffix': ' · soon',
      'nav.pricing': 'Pricing',
      'wa.hello': 'Hello Numidea Labs — I would like to talk about a project.',
      'footer.wa': 'WhatsApp',
      'price.kicker': '05 — Pricing', 'price.title': 'A price <em>before the quote.</em>',
      'price.lead': 'Our prices, published — next to typical rates in Algeria, France and the United States. Set the scope and watch the estimate move.',
      'price.cur': 'DZD',
      'price.popular': 'Recommended',
      'price.t1name': 'Essential', 'price.t1for': 'A credible presence, live quickly.', 'price.t1time': '2 to 4 weeks',
      'price.t1a': 'Showcase or landing site, 1 to 5 pages',
      'price.t1b': 'Custom design — never a re-themed template',
      'price.t1c': 'Responsive, fast, with foundational SEO',
      'price.t1d': 'Deployment, domain and certificate configured',
      'price.t1e': '1 month of support included',
      'price.t2name': 'Studio', 'price.t2for': 'The site that actually carries the business.', 'price.t2time': '3 to 7 weeks',
      'price.t2a': 'Custom site, 6 to 15 pages',
      'price.t2b': 'Trilingual FR / EN / AR, with Arabic RTL built natively',
      'price.t2c': 'Documented design system — styles, components, the full kit',
      'price.t2d': 'CMS or back-office so you manage the content yourself',
      'price.t2e': 'Technical SEO, Core Web Vitals, accessibility',
      'price.t2f': '3 months of support included',
      'price.t3name': 'Engine', 'price.t3for': 'For when your business needs a tool, not just a site.', 'price.t3time': '8 to 16 weeks',
      'price.t3a': 'Custom web application: platform, portal or business tool',
      'price.t3b': 'Payments, user accounts, dashboards',
      'price.t3c': 'Scraping and market intelligence, built into the application',
      'price.t3d': 'API integrations and internal tools',
      'price.t3e': '6 months of support included',
      'price.retainerA': 'Maintenance after launch, if you want it:', 'price.retainerB': 'a month. No lock-in.',
      'price.curL': 'Show prices in', 'price.exTax': 'excl. tax',
      'price.curNoteEUR': '≈ Converted at the Bank of Algeria official rate (€1 ≈ 151 DZD, October 2026), rounded. Prices exclude VAT. French businesses: invoiced without VAT, which you self-assess (reverse charge, art. 283-2 CGI).',
      'price.curNoteUSD': '≈ Converted at the Bank of Algeria official rate ($1 ≈ 134 DZD, October 2026), rounded. Prices exclude taxes.',
      'price.estH': 'Estimate your project',
      'price.estP': 'Choose what you need: the range updates instantly. For showcase sites, custom sites and web applications, it uses the same figures as the packages above.',
      'price.qType': 'What kind of project?', 'price.qSize': 'Scale', 'price.qOpts': 'Options', 'price.qPace': 'Timeline',
      'price.tyVitrine': 'Showcase site', 'price.tyCustom': 'Custom site', 'price.tyShop': 'E-commerce',
      'price.tyApp': 'Web application', 'price.tyAuto': 'Automation', 'price.tyBrand': 'Visual identity',
      'price.oI18n': 'Trilingual FR / EN / AR + RTL', 'price.oCms': 'CMS / back-office', 'price.oPay': 'Online payments',
      'price.oDs': 'Full design system', 'price.oSeo': 'Advanced SEO & performance', 'price.oApi': 'API integrations', 'price.incl': 'included',
      'price.studioBetter': 'The Studio package already includes these options',
      'price.paceStd': 'Standard', 'price.paceRush': 'Accelerated',
      'price.uPages': 'pages', 'price.uPages.n': 'page|pages', 'price.uScreens': 'screens', 'price.uScreens.n': 'screen|screens', 'price.uProducts': 'products', 'price.uProducts.n': 'product|products', 'price.uFlows': 'flows', 'price.uFlows.n': 'flow|flows', 'price.uSupports': 'deliverables', 'price.uSupports.n': 'deliverable|deliverables',
      'price.estimate': 'Estimate', 'price.weeks': 'weeks', 'price.weeks.n': 'week|weeks',
      'price.estFine': 'An indicative range, not a quote. The firm price follows once we have scoped it together — and it does not move after that.',
      'price.estCta': 'Get the firm price →',
      'price.moreSum': 'How we price', 'price.moreHint': 'The market, billing models, what moves a quote.',
      'price.ob1h': 'You describe the project', 'price.ob1p': 'Two minutes, in writing or out loud. In French, English or Arabic.',
      'price.ob2h': 'We reply within 24 working hours', 'price.ob2p': 'First with our questions. Then, once we have agreed on what to build, with a written scope and a firm price. Not a range — one number.',
      'price.ob3h': 'We build the Preview — free', 'price.ob3p': 'Your site\'s homepage, with your own content, before any payment. For registered businesses: at most 4 a month, across all clients.',
      'price.ob4h': 'You decide', 'price.ob4p': 'If it\'s no, you owe nothing. If it\'s yes, the homepage is already done: we move straight on to the rest.',
      'price.obCta1': 'Describe my project →', 'price.obCta2': 'WhatsApp',
      'price.waSoon': 'WhatsApp — soon',
      'svc.famBuild': 'Sites & design', 'svc.famEngine': 'Data & automation', 'svc.famMind': 'Advisory & AI',
      'svc.lead': 'Our five core services — and five more just below.',
      'prev.tag': 'Signature offer', 'prev.name': 'The Preview', 'prev.promise': 'Zero risk: see it before you pay.',
      'prev.brief': 'Before any payment, we build your new site\'s homepage with your own content, in 5 working days, and walk you through it on a 30-minute video call. If you say no, you owe nothing.', 'prev.terms': 'Free, no obligation · registered businesses only · at most 4 Previews a month, across all clients.', 'prev.cta': 'Request my Preview →', 'prev.wa': 'or on WhatsApp', 'prev.msg': 'Hello, I would like to see a free Preview of my new website.\nCompany: \nCurrent site (if any): \nWhat I need: ', 'prev.waText': 'Hello Numidea Labs, I would like to see a free Preview of my new website.', 'form.source': 'Source', 'contact.chTz': 'Time zone', 'contact.vTz': 'UTC+1 (Algeria) · 2 h behind Riyadh, 3 h behind Dubai · same as Paris in winter, 1 h behind in summer', 'contact.waNote': 'free message in the app',
      'prev.outcome': 'The easiest yes you\'ll ever give — because you\'ve already seen it.',
      'f1.name': 'Sites & web applications', 'f1.promise': 'The obvious choice.',
      'f1.brief': 'Custom websites and web apps — fast, optimised for search engines and built to turn visitors into enquiries. No ready-made templates: we design your site from scratch.',
      'f2.name': 'Branding & visual systems', 'f2.promise': 'Trust before a word is read.',
      'f2.brief': 'Logos, colour, typography, motion and a complete, documented design system — everything that gives a small company the look of an established firm.',
      'f3.name': 'Automation & pipelines', 'f3.promise': 'Delete the busywork.',
      'f3.brief': 'Scrapers, data pipelines, lead engines, workflow automations, internal tools. The repetitive, error-prone work quietly eating hours — we make it run itself at 3am.',
      'f4.name': 'Market & product intelligence', 'f4.promise': 'See the market clearly.',
      'f4.brief': 'Turn public web data into a usable database: competitor monitoring, price and catalogue tracking — collected within each site\'s terms and the GDPR, structured and queryable.',
      'f5.name': 'Strategy & growth consulting', 'f5.promise': 'Data, not vibes.',
      'f5.brief': 'Full marketing audits, funnel analysis, competitive positioning, growth roadmaps — brutally honest, ROI-first, phased. We do the sector homework before the call.',
      'cap.summary': 'See the other 5 services', 'cap.hint': 'Shop & booking, graphic design, data science, knowledge systems, AI tools.', 'cap.h': 'The other five services',
      'c1.name': 'E-commerce & booking', 'c1.promise': 'From browse to paid.',
      'c1.brief': 'Online stores and booking systems built around how people buy in Algeria: ordering on WhatsApp, cash on delivery, or a custom Shopify store when it fits.', 'c1.fam': 'Sites & design',
      'c2.name': 'Graphic & social design', 'c2.promise': 'Scroll-stopping, on brand.',
      'c2.brief': 'Social packs, carousels, infographics, print — all from one locked visual system so everything looks like you.', 'c2.fam': 'Sites & design',
      'c3.name': 'Data science & analytics', 'c3.promise': 'Signal out of noise.',
      'c3.brief': 'Rigorous statistical work — econometric modelling, time-series analysis, forecasting, dashboards. Every model is tested, diagnosed and defensible.', 'c3.fam': 'Data & automation',
      'c4.name': 'Knowledge systems', 'c4.promise': 'A company that remembers.',
      'c4.brief': 'Internal knowledge architecture — Obsidian/PARA + Zettelkasten, documentation, RAG-ready bases. Self-maintaining structures.', 'c4.fam': 'Advisory & AI',
      'c5.name': 'Custom AI tools & skills', 'c5.promise': 'Software that builds your software.',
      'c5.brief': 'Claude-powered internal tools, generators and custom skills — a repeatable task becomes a one-click factory.', 'c5.fam': 'Advisory & AI',
    },
    /* Arabic: written for this site, pending a native speaker's review (see
       OWNER-CONTENT.md). Conventions: Western digits, forward arrows ←,
       singular "you", brand names in Latin script except نوميديا in prose. */
    ar: {
      'mk.h': 'الجزائر وفرنسا والولايات المتحدة: مشروع واحد، ثلاثة أسواق',
      'mk.vizCap': 'مقياس لوغاريتمي: كلّ تدريجة رئيسية تساوي عشرة أضعاف التي قبلها. بين الخطّين المتقطّعين يمتدّ نطاق أسعارنا عبر الأسواق الثلاثة، والشريط الذي يتلاشى لا حدّ أعلى له. المبالغ محوّلة بالسعر الرسمي، والأرقام الدقيقة في الجدول أدناه.',
      'mk.k': 'ألف', 'mk.M': 'مليون', 'mk.k.n': 'ألف|ألفان|آلاف|ألفاً|ألف', 'mk.M.n': 'مليون|مليونان|ملايين|مليوناً|مليون',
      'prev.tl1': 'ترسل إلينا محتواك', 'prev.tl2': 'نبني صفحتك الرئيسية', 'prev.tl2d': '5 أيام عمل',
      'prev.tl3': 'نعرضها عليك', 'prev.tl3d': 'في مكالمة فيديو من 30 دقيقة', 'prev.tl4': 'أنت تقرّر', 'prev.tl4d': 'المدفوع حتى الآن:',
      'mk.p': 'المشروع نفسه، مسعّراً في ثلاثة أسواق. الأسعار الشائعة لعام 2026، من المستقل المتمرّس إلى الوكالة — دون احتساب الضرائب.',
      'mk.curL': 'العملة', 'mk.curNative': 'العملة الأصلية',
      'mk.cap': 'الأسعار الشائعة حسب نوع المشروع',
      'mk.colType': 'المشروع', 'mk.colDz': 'الجزائر', 'mk.colNl': 'أسعارنا', 'mk.colFr': 'فرنسا', 'mk.colUs': 'الولايات المتحدة',
      'mk.day1': 'يكلّف يوم عمل واحد لمطوّر متمرّس في فرنسا',
      'mk.day2': 'بالسعر الرسمي — أي ما يقارب سعر موقع تعريفي كامل في السوق الجزائرية.',
      'mk.note': 'التحويلات بالسعر الرسمي لبنك الجزائر، مطلع أكتوبر 2026: 1 € ≈ 151 دج، 1 $ ≈ 134 دج. الفارق سببه تكلفة المعيشة وسعر الصرف لا الأدوات — فنحن نعمل بالتقنيات نفسها التي تعتمدها الاستوديوهات الأوروبية والأمريكية: React وNext.js وVercel.',
      'mk.srcSum': 'المصادر والمنهجية',
      'mk.method': 'تمتدّ كل خانة من أدنى سعر لدى المستقل المتمرّس إلى أعلى سعر لدى الوكالة، وتدلّ علامة «+» على حدّ أعلى مفتوح. استُبعدت الحالات القصوى — مواقع بـ300 € أو مشاريع بـ250 000 $. أمّا عمود «أسعارنا» فتحسبه حاسبة التقدير أعلاه، على أساس الحجم المعتاد لكل مشروع.',
      'mk.srcDz': 'الجزائر', 'mk.srcFr': 'فرنسا', 'mk.srcUs': 'الولايات المتحدة', 'mk.srcFx': 'الصرف',
      'md.h': 'كيف يُسعَّر المشروع',
      'md.p': 'هناك أربع طرق لفوترة مشروع، ولكلٍّ منها سوقٌ تسود فيه.',
      'md.ours': 'نموذجنا',
      'md.fH': 'بسعر ثابت', 'md.fP': 'سعر ثابت لنطاق عمل مكتوب. إن تجاوز العمل ما اتُّفق عليه، يتحمّل مقدّم الخدمة الفارق.',
      'md.fW': 'هو السائد في الجزائر: مقياس Onyxlab يسعّر كل أعمال التطوير بمبلغ مقطوع. وهكذا نسعّر كل مشروع.',
      'md.tH': 'حسب الوقت', 'md.tP': 'يُفوتَر باليوم أو بالساعة. مرنٌ حين يتغيّر النطاق، لكن يصعب تقدير ميزانيته مسبقاً.',
      'md.tW': 'هو السائد في فرنسا (480 –⁠ 650 € يومياً لمطوّر متمرّس) وفي الولايات المتحدة (100 –⁠ 149 $ للساعة في الوكالات).',
      'md.aH': 'بالاشتراك', 'md.aP': 'مبلغ شهري مقابل خدمة مستمرّة: صيانة وتطوير ومحتوى.',
      'md.aW': 'شائع في كل مكان بعد الإطلاق، وهو نموذج صيانتنا: من 18 000 إلى 60 000 دج شهرياً.',
      'md.vH': 'حسب القيمة', 'md.vP': 'يتبع السعر ما يحقّقه المشروع، لا الوقت الذي يستغرقه.',
      'md.vW': 'أندر، وأكثر ما يكون في الاستشارة والاستراتيجية، حيث يمكن قياس الأثر المالي للمشروع.',
      'md.drH': 'ما الذي يغيّر عرض السعر',
      'md.d1h': 'النطاق', 'md.d1p': 'عدد الصفحات أو المنتجات أو الشاشات.',
      'md.d2h': 'التصميم', 'md.d2p': 'مخصّص بالكامل، أو انطلاقاً من دليل هويتك البصرية ونماذج تصميمك الموجودة.',
      'md.d3h': 'اللغات', 'md.d3p': 'كل لغة تضيف محتوى، والعربية تضيف تخطيطاً من اليمين إلى اليسار.',
      'md.d4h': 'التكاملات', 'md.d4p': 'الدفع وحسابات المستخدمين والأدوات والواجهات البرمجية الخارجية.',
      'md.d5h': 'المحتوى', 'md.d5p': 'النصوص والصور والفيديو: تقدّمها أنت أو ننتجها نحن.',
      'md.d6h': 'المهلة', 'md.d6p': 'الجدول المضغوط أعلى تكلفة: ‎+25٪ في حاسبة التقدير.',
      'price.waSoonSuffix': ' · قريباً',
      'nav.pricing': 'الأسعار',
      'wa.hello': 'مرحباً نوميديا لابز — أودّ الحديث عن مشروع.',
      'footer.wa': 'واتساب',
      'price.kicker': '05 — الأسعار', 'price.title': 'سعر <em>قبل عرض السعر.</em>',
      'price.lead': 'أسعارنا منشورة — وإلى جانبها الأسعار الشائعة في الجزائر وفرنسا والولايات المتحدة. اضبط نطاق العمل وشاهد التقدير يتحرّك.',
      'price.cur': 'دج',
      'price.popular': 'الموصى به',
      'price.t1name': 'الأساسي', 'price.t1for': 'حضور موثوق، على الإنترنت بسرعة.', 'price.t1time': 'من 2 إلى 4 أسابيع',
      'price.t1a': 'موقع تعريفي أو صفحة هبوط، من 1 إلى 5 صفحات',
      'price.t1b': 'تصميم مخصّص — لا قالب معاد تلوينه أبداً',
      'price.t1c': 'متجاوب وسريع، مع أساسيات تحسين محرّكات البحث (SEO)',
      'price.t1d': 'النشر، واسم النطاق (الدومين)، وشهادة الأمان SSL — كلّها مُعدّة',
      'price.t1e': 'شهر دعم مشمول',
      'price.t2name': 'الاستوديو', 'price.t2for': 'الموقع الذي يحمل الشركة فعلاً.', 'price.t2time': 'من 3 إلى 7 أسابيع',
      'price.t2a': 'موقع مخصّص، من 6 إلى 15 صفحة',
      'price.t2b': 'ثلاثي اللغة فرنسي / إنجليزي / عربي، بعربية مصمّمة من الأساس للكتابة من اليمين إلى اليسار',
      'price.t2c': 'نظام تصميم موثّق — الأنماط والمكوّنات والعدّة كاملة',
      'price.t2d': 'نظام إدارة محتوى أو لوحة تحكّم لتدير المحتوى بنفسك',
      'price.t2e': 'الجانب التقني من تحسين محرّكات البحث (SEO)، ومؤشّرات الأداء، وإتاحة الوصول',
      'price.t2f': 'ثلاثة أشهر دعم مشمولة',
      'price.t3name': 'المحرّك', 'price.t3for': 'حين تحتاج شركتك إلى أداة عمل، لا إلى موقع فحسب.', 'price.t3time': 'من 8 إلى 16 أسبوعاً',
      'price.t3a': 'تطبيق ويب مخصّص: منصّة أو بوابة أو أداة عمل',
      'price.t3b': 'الدفع وحسابات المستخدمين ولوحات المتابعة',
      'price.t3c': 'استخراج البيانات وتحليل السوق، مدمجان في التطبيق',
      'price.t3d': 'تكاملات واجهات برمجية وأدوات داخلية',
      'price.t3e': 'ستّة أشهر دعم مشمولة',
      'price.retainerA': 'الصيانة بعد التسليم، إن أردتها:', 'price.retainerB': 'شهرياً، دون التزام بمدّة.',
      'price.curL': 'العملة', 'price.exTax': 'قبل الضريبة',
      'price.curNoteEUR': '≈ تحويل بالسعر الرسمي لبنك الجزائر (1 € ≈ 151 دج، أكتوبر 2026)، مع التقريب. الأسعار قبل الضريبة. للشركات الفرنسية: فاتورة دون ضريبة القيمة المضافة، يصرّح بها العميل ذاتياً (المادة 283-2 من القانون العام للضرائب الفرنسي).',
      'price.curNoteUSD': '≈ تحويل بالسعر الرسمي لبنك الجزائر (1 $ ≈ 134 دج، أكتوبر 2026)، مع التقريب. الأسعار قبل الضريبة.',
      'price.estH': 'قدّر مشروعك',
      'price.estP': 'اضبط ما تحتاجه، فيُعاد حساب السعر التقديري مباشرة. وللمواقع وتطبيقات الويب، هي الأرقام نفسها المعلنة في الباقات أعلاه.',
      'price.qType': 'أيّ نوع من المشاريع؟', 'price.qSize': 'الحجم', 'price.qOpts': 'الخيارات', 'price.qPace': 'المهلة',
      'price.tyVitrine': 'موقع تعريفي', 'price.tyCustom': 'موقع مخصّص', 'price.tyShop': 'متجر إلكتروني',
      'price.tyApp': 'تطبيق ويب', 'price.tyAuto': 'أتمتة', 'price.tyBrand': 'هوية بصرية',
      'price.oI18n': 'ثلاثي اللغة فرنسي / إنجليزي / عربي، والعربية من اليمين إلى اليسار', 'price.oCms': 'نظام إدارة محتوى / لوحة تحكّم', 'price.oPay': 'الدفع الإلكتروني',
      'price.oDs': 'نظام تصميم كامل', 'price.oSeo': 'تحسين محرّكات البحث (SEO) والأداء، بمستوى متقدّم', 'price.oApi': 'تكاملات واجهات برمجية', 'price.incl': 'ضمن الباقة',
      'price.studioBetter': 'هذه الخيارات مشمولة في باقة «الاستوديو»',
      'price.paceStd': 'عادي', 'price.paceRush': 'مستعجل',
      'price.uPages': 'صفحات', 'price.uPages.n': 'صفحة|صفحتان|صفحات|صفحة|صفحة', 'price.uScreens': 'شاشات', 'price.uScreens.n': 'شاشة|شاشتان|شاشات|شاشة|شاشة', 'price.uProducts': 'منتجات', 'price.uProducts.n': 'منتج|منتجان|منتجات|منتجاً|منتج', 'price.uFlows': 'مسارات', 'price.uFlows.n': 'مسار|مساران|مسارات|مساراً|مسار', 'price.uSupports': 'عناصر', 'price.uSupports.n': 'عنصر|عنصران|عناصر|عنصراً|عنصر',
      'price.estimate': 'التقدير', 'price.weeks': 'أسابيع', 'price.weeks.n': 'أسبوع|أسبوعان|أسابيع|أسبوعاً|أسبوع',
      'price.estFine': 'تقدير استرشادي، لا عرض سعر رسمي. السعر النهائي نحدّده بعد أن نضبط معاً نطاق العمل — ولا يتغيّر بعدها.',
      'price.estCta': 'احصل على السعر النهائي ←',
      'price.moreSum': 'كيف نسعّر', 'price.moreHint': 'السوق، نماذج الفوترة، وما يغيّر عرض السعر.',
      'price.ob1h': 'تصف المشروع', 'price.ob1p': 'دقيقتان، كتابةً أو مشافهة. بالفرنسية أو الإنجليزية أو العربية.',
      'price.ob2h': 'نعود إليك خلال 24 ساعة عمل', 'price.ob2p': 'بأسئلتنا أولاً، ثم بنطاق عمل مكتوب وسعر نهائي بمجرّد أن نتّفق معاً على هذا النطاق. ليس سعراً تقريبياً، بل رقمٌ واحد.',
      'price.ob3h': 'نبني المعاينة — مجّاناً', 'price.ob3p': 'الصفحة الرئيسية لموقعك بمحتواك، قبل أيّ دفع. للشركات المسجّلة، 4 معاينات في الشهر كحدّ أقصى لجميع العملاء.',
      'price.ob4h': 'أنت تقرّر', 'price.ob4p': 'إن كان الجواب لا، فلا شيء عليك. وإن كان نعم، فالصفحة الرئيسية جاهزة بالفعل: ننتقل مباشرة إلى بقية العمل.',
      'price.obCta1': 'صِف لنا مشروعك ←', 'price.obCta2': 'واتساب',
      'price.waSoon': 'واتساب — قريباً',
      'svc.famBuild': 'المواقع والتصميم', 'svc.famEngine': 'البيانات والأتمتة', 'svc.famMind': 'الاستشارة والذكاء الاصطناعي',
      'svc.lead': 'خدماتنا الخمس الرئيسية — وخمس أخرى أدناه.',
      'prev.tag': 'عرض مميّز', 'prev.name': 'المعاينة', 'prev.promise': 'بلا مخاطرة. ترى النتيجة قبل أن تدفع.',
      'prev.brief': 'قبل أيّ دفع، نبني الصفحة الرئيسية لموقعك الجديد بمحتواك أنت، خلال 5 أيام عمل، ونعرضها عليك في مكالمة فيديو مدّتها 30 دقيقة. إن قلت لا، فلا شيء عليك.', 'prev.terms': 'مجّاناً ودون التزام · للشركات المسجّلة فقط · 4 معاينات في الشهر كحدّ أقصى لجميع العملاء.', 'prev.cta': 'اطلب معاينتك ←', 'prev.wa': 'أو عبر واتساب', 'prev.msg': 'مرحباً، أرغب في الاطّلاع على معاينة مجانية لموقعي الجديد.\nالشركة: \nالموقع الحالي (إن وُجد): \nما أحتاجه: ', 'prev.waText': 'مرحباً نوميديا لابز، أرغب في الاطّلاع على معاينة مجانية لموقعي الجديد.', 'form.source': 'المصدر', 'contact.chTz': 'التوقيت', 'contact.vTz': 'UTC+1 (توقيت الجزائر) · أقلّ بساعتين من توقيت الرياض، وبثلاث ساعات من توقيت دبي', 'contact.waNote': 'رسالة مجانية عبر التطبيق',
      'prev.outcome': 'أسهل «نعم» ستقولها — لأنّك رأيتها بالفعل.',
      'f1.name': 'مواقع وتطبيقات ويب', 'f1.promise': 'الخيار البديهي.',
      'f1.brief': 'مواقع وتطبيقات ويب مخصّصة — سريعة، مع تحسين محرّكات البحث (SEO)، ومبنيّة لتحوّل الزوّار إلى عملاء، من الواجهة إلى السحابة. لا نعيد تلوين قالب جاهز: نصمّم موقعك من الصفر.',
      'f2.name': 'الهوية والأنظمة البصرية', 'f2.promise': 'الثقة قبل قراءة كلمة.',
      'f2.brief': 'شعارات وألوان وخطوط وحركة، ونظام تصميم كامل وموثّق — ما يمنح الشركة الصغيرة حضور مؤسسة راسخة.',
      'f3.name': 'الأتمتة ومعالجة البيانات', 'f3.promise': 'احذف العمل الممل.',
      'f3.brief': 'جمع البيانات من الويب، ومعالجتها آلياً، واستقطاب العملاء المحتملين، وأتمتة سير العمل، وأدوات داخلية. العمل المتكرّر الهشّ الذي يلتهم ساعاتك — نجعله يعمل وحده عند الثالثة فجراً.',
      'f4.name': 'تحليل السوق والمنتجات', 'f4.promise': 'رؤية السوق بوضوح.',
      'f4.brief': 'حوّل البيانات العامة على الويب إلى قاعدة بيانات قابلة للاستخدام: رصد المنافسين، وتتبّع الأسعار والكتالوجات — تُجمع وفق شروط كل موقع وقوانين حماية البيانات، مهيكلة وقابلة للاستعلام.',
      'f5.name': 'الاستراتيجية واستشارات النمو', 'f5.promise': 'بيانات، لا انطباعات.',
      'f5.brief': 'تدقيقات تسويقية كاملة، وتحليل المسارات التسويقية، وتموضع تنافسي، وخرائط طريق للنمو — بصراحة، والأولوية للعائد، وعلى مراحل. ندرس قطاعك جيداً قبل أيّ مكالمة.',
      'cap.summary': 'اعرض الخدمات الخمس الأخرى', 'cap.hint': 'المتجر والحجز، والتصميم الغرافيكي، وعلم البيانات، وأنظمة المعرفة، وأدوات الذكاء الاصطناعي.', 'cap.h': 'الخدمات الخمس الأخرى',
      'c1.name': 'متجر وحجز', 'c1.promise': 'من التصفّح إلى الدفع.',
      'c1.brief': 'متاجر إلكترونية وأنظمة حجز تناسب طريقة الشراء في الجزائر: الطلب عبر واتساب، والدفع نقداً عند الاستلام، وShopify بواجهة مخصّصة عند الحاجة.', 'c1.fam': 'المواقع والتصميم',
      'c2.name': 'تصميم غرافيك ومنشورات لشبكات التواصل', 'c2.promise': 'تصاميم تلفت الانتباه، وتبقى وفيّة لهويتك.',
      'c2.brief': 'حزم منشورات لشبكات التواصل، وتصاميم كاروسيل، وإنفوجرافيك، ومطبوعات — كلّها من نظام بصري واحد ثابت، لتحمل كلّ قطعة بصمتك.', 'c2.fam': 'المواقع والتصميم',
      'c3.name': 'علم البيانات والتحليلات', 'c3.promise': 'المعنى وسط الضجيج.',
      'c3.brief': 'عمل إحصائي دقيق — نمذجة قياسية، وسلاسل زمنية، وتنبّؤ، ولوحات متابعة تفاعلية. تحليلٌ مُختبَر يمكن الدفاع عنه.', 'c3.fam': 'البيانات والأتمتة',
      'c4.name': 'أنظمة المعرفة', 'c4.promise': 'شركة تتذكّر.',
      'c4.brief': 'بنية معرفة داخلية — Obsidian/PARA + Zettelkasten، توثيق، قواعد جاهزة للـ RAG. بنى تصون نفسها.', 'c4.fam': 'الاستشارة والذكاء الاصطناعي',
      'c5.name': 'أدوات ومهارات ذكاء اصطناعي مخصّصة', 'c5.promise': 'برمجيات تبني برمجياتك.',
      'c5.brief': 'أدوات داخلية ومولّدات ومهارات مخصّصة بقوّة Claude — مهمّة متكرّرة تصبح مصنعاً بنقرة.', 'c5.fam': 'الاستشارة والذكاء الاصطناعي',
    }
  };
  Object.keys(EXTRA).forEach(function (l) {
    for (var k in EXTRA[l]) { if (EXTRA[l].hasOwnProperty(k)) I18N[l][k] = EXTRA[l][k]; }
  });

  /* ---------------- estimator model ----------------
     Pure: figures and arithmetic only, no DOM and no dictionary, so a script
     can evaluate this block on its own and test it: everything from the
     ESTIMATE declaration below to the first line that is two spaces and
     the closing of that function call.

     Numidea's own prices, set in dinars. The market table (section 14) puts
     the Algerian market beside them (Onyxlab Baromètre 2026 grid and the
     2026 DZ agency surveys, from freelance confirmé to agency): some tiers
     sit inside that range and some above its top, and the page says so.

     The tier cards quote exactly what this model returns across each tier's
     stated scope: Essentiel = vitrine at 1-5 pages (base_u 5), Studio =
     surmesure at 6-15 pages (base_u 15), Moteur = app at its default. What a
     card lists as part of the tier is in its base price (incl): the
     estimator shows those options as included and adds nothing for them. An
     earlier version claimed this and was wrong — the defaults sat 30-60k
     below the cards. The market table reads its Numidea column from here
     too, so if a tier moves, move it here and nowhere else. */
  var ESTIMATE = (function () {
    var PRICE_MODEL = {
      vitrine:   { base: [90000, 160000],   unit: [6000, 12000],  min: 1,  max: 10,  def: 3,  step: 1,  u: 'price.uPages',    base_u: 5,  weeks: [2, 4] },
      surmesure: { base: [180000, 420000],  unit: [9000, 18000],  min: 3,  max: 25,  def: 8,  step: 1,  u: 'price.uPages',    base_u: 15, weeks: [3, 7],  incl: ['i18n', 'cms', 'ds', 'seo'] },
      ecommerce: { base: [220000, 550000],  unit: [900, 2200],    min: 10, max: 400, def: 60, step: 10, u: 'price.uProducts', base_u: 60, weeks: [5, 10] },
      app:       { base: [450000, 1200000], unit: [18000, 45000], min: 3,  max: 20,  def: 6,  step: 1,  u: 'price.uScreens',  base_u: 6,  weeks: [8, 16], incl: ['pay', 'api'] },
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
       where review still happens (a 2-week minimum stays 2 weeks). */
    var RUSH_PRICE = 1.25, RUSH_WEEKS = 0.7;
    var rushWeeks = function (w) { return Math.max(Math.ceil(w * 2 / 3), Math.round(w * RUSH_WEEKS)); };

    /* Round to a figure a human would actually say out loud. Quoting
       "186 400" implies a precision this model does not have. */
    var roundTo = function (n) {
      var g = n >= 500000 ? 50000 : n >= 150000 ? 10000 : 5000;
      return Math.round(n / g) * g;
    };

    // one tier, n units, the ticked options: what it adds up to, unrounded
    var tally = function (key, n, opts) {
      var m = PRICE_MODEL[key], over = Math.max(0, n - m.base_u), incl = m.incl || [];
      var q = { lo: m.base[0] + over * m.unit[0], hi: m.base[1] + over * m.unit[1],
                wLo: m.weeks[0], wHi: m.weeks[1], incl: [] };
      opts.forEach(function (o) {
        var p = PRICE_OPTS[o];
        if (!p) return;
        if (incl.indexOf(o) > -1) { q.incl.push(o); return; }   // in the tier's base price
        q.lo += p.add[0]; q.hi += p.add[1];
        q.wLo += p.weeks[0]; q.wHi += p.weeks[1];
      });
      return q;
    };

    /* The estimate for a tier (key), a size (n), the ticked option keys and
       the pace. Returns { lo, hi } in dinars, rounded, { wLo, wHi } in weeks,
       incl (ticked options already in the quoted tier's price), rush, and
       studio: true when a Vitrine was quoted as the Studio tier.

       A Vitrine is never quoted above the Studio tier for the same pages:
       Studio includes multilingual, CMS, design system and SEO at no extra
       cost, so each bound (price and weeks) is the lower of the Vitrine's own
       sum and the Studio figure. Bound by bound, never the whole Studio
       range: taking it whole when only the low end was cheaper would raise
       the top above what the Vitrine itself adds up to. studio: true when
       the Studio figure set either price bound. check.mjs tests every size,
       option set and pace. */
    function quote(key, n, opts, rush) {
      var q = tally(key, n, opts || []);
      q.studio = false;
      if (key === 'vitrine') {
        var s = tally('surmesure', n, opts || []);
        q.studio = s.lo < q.lo || s.hi < q.hi;
        q.lo = Math.min(q.lo, s.lo); q.hi = Math.min(q.hi, s.hi);
        q.wLo = Math.min(q.wLo, s.wLo); q.wHi = Math.min(q.wHi, s.wHi);
      }
      q.rush = !!rush;
      if (rush) {
        q.lo *= RUSH_PRICE; q.hi *= RUSH_PRICE;
        q.wLo = rushWeeks(q.wLo); q.wHi = rushWeeks(q.wHi);
      }
      q.lo = roundTo(q.lo); q.hi = roundTo(q.hi);
      return q;
    }

    return { PRICE_MODEL: PRICE_MODEL, PRICE_OPTS: PRICE_OPTS, quote: quote, tally: tally, roundTo: roundTo, RUSH_PRICE: RUSH_PRICE };
  })();

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

    /* The studio's own structured data describes it in the page's language
       too: its description is the meta description (the baked French one in
       index.html is I18N.fr's). */
    document.querySelectorAll('script[type="application/ld+json"]:not([id])').forEach(function (s) {
      try {
        var o = JSON.parse(s.textContent);
        if (o['@type'] !== 'ProfessionalService' || o.description === dict['meta.desc']) return;
        o.description = dict['meta.desc'];
        s.textContent = JSON.stringify(o, null, 1);
      } catch (e) {}
    });

    /* The FAQ structured data says what the visible FAQ says, in the same
       language (scripts/lib/i18n.mjs faqLd builds the French one baked into
       index.html the same way). */
    var ld = document.getElementById('ld-faq');
    if (ld) {
      var plain = function (s) {
        var d = document.createElement('div');
        d.innerHTML = s;
        return d.textContent.replace(/[ \t\r\n]+/g, ' ').trim();
      };
      var qs = [];
      for (var qi = 1; dict['faq' + qi + '.q'] != null; qi++) {
        qs.push({ '@type': 'Question', name: plain(dict['faq' + qi + '.q']),
                  acceptedAnswer: { '@type': 'Answer', text: plain(dict['faq' + qi + '.a']) } });
      }
      ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qs });
    }

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
    // image alternatives
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-alt');
      if (dict[key] != null) el.alt = dict[key];
    });

    // language buttons pressed-state
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });

    try { localStorage.setItem('numidea-lang', lang); } catch (e) {}
    // Anything that builds translated strings in JS (the estimator's unit and
    // option labels) has no data-i18n node to re-read and must rebuild itself.
    document.dispatchEvent(new CustomEvent('numidea:lang', { detail: { lang: lang } }));
  }

  /* ---------------- count-up ---------------- */
  function group(n) {
    var lang = document.documentElement.getAttribute('lang') || 'fr';
    // Arabic shows Western digits everywhere on this site (prices, counters, copy)
    try { return new Intl.NumberFormat(lang === 'ar' ? 'ar-u-nu-latn' : lang).format(n); }
    catch (e) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  }

  /* The suffix and number format are read at every write, so a language
     switch mid-count, or after it, shows the current language's unit. */
  function statText(el, v) {
    var lang = document.documentElement.getAttribute('lang') || 'fr';
    var suffix = el.getAttribute('data-suffix-' + lang);
    if (suffix == null) suffix = el.getAttribute('data-suffix') || '';
    var fig = (el.getAttribute('data-prefix') || '') + group(v);
    // Arabic reads the counter right to left ('<24' then the unit 'س'): the
    // comparison and the figure stay one left-to-right unit (LRI … PDI) and
    // the unit follows it in the reading order (styles.css sets RTL on .stat)
    return (lang === 'ar' ? '⁦' + fig + '⁩' : fig) + suffix;
  }
  function countUp(el) {
    if (el.getAttribute('data-counted') === '1') return;
    el.setAttribute('data-counted', '1');
    var target = parseFloat(el.getAttribute('data-count'));
    if (reduceMotion) { el.textContent = statText(el, target); return; }
    var dur = 1200, start = null;
    function frame(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = statText(el, p < 1 ? Math.round(target * eased) : target);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  document.addEventListener('numidea:lang', function () {
    document.querySelectorAll('[data-count][data-counted="1"]').forEach(function (el) {
      el.textContent = statText(el, parseFloat(el.getAttribute('data-count')));
    });
  });

  /* ---------------- DOM ready ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
   try {
    // the head resolver already chose the language (?lang=, then storage,
    // validated) and set it on <html>, and kept it in NUMIDEA_LANG: its
    // paint backstop puts <html> back to the baked French if this script is
    // late, and the visitor's language is applied here all the same
    applyLang(window.NUMIDEA_LANG || document.documentElement.getAttribute('lang') || DEFAULT_LANG);
    // The head bootstrap held paint for a non-French visitor so the 194-node
    // swap above could not be seen happening. It is done — release it.
    document.documentElement.removeAttribute('data-i18n-pending');

    // language switch
    function switchLang(l) {
      applyLang(l);
      // keep a shared ?lang= link truthful after a switch (as page-i18n.js
      // does), and the canonical, og:url and og:locale with it: they name the
      // version the address bar now shows (the head script's NUMIDEA_CANON)
      try {
        var u = new URL(location.href);
        if (u.searchParams.has('lang')) {
          u.searchParams.set('lang', l);
          history.replaceState(history.state, '', u);
          if (window.NUMIDEA_CANON) window.NUMIDEA_CANON(l);
        }
      } catch (e) {}
    }
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.addEventListener('click', function () { switchLang(b.getAttribute('data-lang')); });
    });

    // theme switcher — every theme is a token block in themes.css, so a switch
    // is one attribute; nothing loads, nothing re-lays out
    var THEMES = ['arcanum', 'noir', 'daylight', 'mono', 'altneon', 'engineering'];
    function applyTheme(t) {
      if (THEMES.indexOf(t) === -1) t = 'arcanum';
      document.documentElement.setAttribute('data-theme', t);
      // the browser's own bar takes the page colour (Daylight is light): read
      // from the theme's tokens, so it cannot drift from themes.css
      var bar = document.querySelector('meta[name="theme-color"]');
      var bg = getComputedStyle(document.documentElement).getPropertyValue('--void').trim();
      if (bar && bg) bar.setAttribute('content', bg);
      document.querySelectorAll('.theme-menu button').forEach(function (b) {
        b.setAttribute('aria-checked', b.getAttribute('data-theme-val') === t ? 'true' : 'false');
      });
      try { localStorage.setItem('numidea-theme', t); } catch (e) {}
      // type tokens change line lengths, so cached section tops are re-measured
      document.dispatchEvent(new CustomEvent('numidea:relayout'));
    }
    // the pre-paint script already resolved and applied this; mirror it here
    var defaultTheme = 'arcanum';
    var savedTheme = document.documentElement.getAttribute('data-theme') || defaultTheme;
    applyTheme(savedTheme);
    var themeBtn = document.querySelector('.theme-btn');
    var themeMenu = document.querySelector('.theme-menu');
    if (themeBtn && themeMenu) {
      /* An ARIA menu, so it keeps the menu's keyboard contract: opening moves
         focus to the checked theme, arrows/Home/End move between themes,
         choosing one or Escape closes and returns focus to the button, and
         Tab or a click elsewhere closes it. Items stay out of the Tab order. */
      var items = Array.prototype.slice.call(themeMenu.querySelectorAll('[role="menuitemradio"]'));
      var isOpen = function () { return themeMenu.classList.contains('open'); };
      var closeTheme = function (refocus) {
        if (!isOpen()) return;
        themeMenu.classList.remove('open');
        themeBtn.setAttribute('aria-expanded', 'false');
        if (refocus) themeBtn.focus();
      };
      var openTheme = function (which) {
        themeMenu.classList.add('open');
        themeBtn.setAttribute('aria-expanded', 'true');
        var i = which === 'last' ? items.length - 1 : which === 'first' ? 0
              : Math.max(0, items.findIndex(function (b) { return b.getAttribute('aria-checked') === 'true'; }));
        if (items[i]) items[i].focus();
      };
      themeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (isOpen()) closeTheme(false); else openTheme();
      });
      themeBtn.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); openTheme(e.key === 'ArrowUp' ? 'last' : null); }
      });
      items.forEach(function (b, i) {
        b.addEventListener('click', function (e) {
          e.stopPropagation();
          applyTheme(b.getAttribute('data-theme-val'));
          closeTheme(true);
        });
        b.addEventListener('keydown', function (e) {
          var n = items.length, to = null;
          if (e.key === 'ArrowDown') to = (i + 1) % n;
          else if (e.key === 'ArrowUp') to = (i - 1 + n) % n;
          else if (e.key === 'Home') to = 0;
          else if (e.key === 'End') to = n - 1;
          else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeTheme(true); return; }
          else if (e.key === 'Tab') { closeTheme(false); return; }
          if (to !== null) { e.preventDefault(); items[to].focus(); }
        });
      });
      themeMenu.addEventListener('focusout', function (e) {
        if (e.relatedTarget && !themeMenu.contains(e.relatedTarget) && e.relatedTarget !== themeBtn) closeTheme(false);
      });
      document.addEventListener('click', function () { closeTheme(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeTheme(themeMenu.contains(document.activeElement)); });
    }

    /* One read of the scroll position per scroll event, shared by everything
       scroll-linked below (navbar, progress, parallax, phone bar, scroll-spy,
       back to top). Reading scrollY forces a style recalculation whenever a
       style is dirty, and the handlers used to read it one after another
       around their own writes: traced on a phone (CPU 4x), over two thousand
       forced recalculations in one scroll of the page (the measured figures
       are in BRAND.md, "Scroll comfort (round 3)"). This listener is
       registered first, reads once, writes nothing; the others read
       `scrollPos`/`viewH` and only write. */
    var scrollPos = window.scrollY || window.pageYOffset || 0, viewH = window.innerHeight;
    window.addEventListener('scroll', function () { scrollPos = window.scrollY || window.pageYOffset || 0; }, { passive: true });
    window.addEventListener('resize', function () { viewH = window.innerHeight; scrollPos = window.scrollY || window.pageYOffset || 0; });

    // navbar scroll state + progress bar
    var navbar = document.querySelector('.navbar');
    var progress = document.querySelector('.progress');
    /* The bar scales instead of changing width (a width change is a layout),
       and the scrollable height is cached rather than read on every scroll
       event: reading scrollHeight there forced a layout per event. Where the
       browser runs scroll-driven animations (styles.css, .progress), the bar
       follows the scroll on the compositor and this writes nothing; under
       reduced motion that animation is switched off, so the script draws it. */
    var scrollTimelines = !!(window.CSS && CSS.supports && CSS.supports('animation-timeline', 'scroll()'));
    var cssProgress = !reduceMotion && scrollTimelines;
    var scrollMax = 1, wasScrolled = null, maxWired = false;
    function measureMax() { scrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); }
    function wireMax() {
      if (maxWired) return;
      maxWired = true;
      measureMax();
      window.addEventListener('resize', measureMax);
      window.addEventListener('load', measureMax);
      if ('ResizeObserver' in window) new ResizeObserver(measureMax).observe(document.body);
    }
    function onScroll() {
      var y = scrollPos;
      var sc = y > 24;
      if (navbar && sc !== wasScrolled) { navbar.classList.toggle('scrolled', sc); wasScrolled = sc; }
      if (progress && !cssProgress) progress.style.transform = 'scaleX(' + Math.min(1, y / scrollMax).toFixed(4) + ')';
    }
    if (!cssProgress) wireMax();
    /* The CSS animation runs only under no-preference, so a visitor who turns
       reduced motion on (or off) during the visit hands the bar over: without
       this it fell back to scaleX(0) and stayed empty for the rest of the visit. */
    var rmq = scrollTimelines && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (rmq) {
      var onMotionPref = function () {
        cssProgress = !rmq.matches;
        if (cssProgress) { if (progress) progress.style.transform = ''; }
        else wireMax();
        onScroll();
      };
      if (rmq.addEventListener) rmq.addEventListener('change', onMotionPref);
      else if (rmq.addListener) rmq.addListener(onMotionPref);
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
          // stagger the wave, but never make the last card wait too long:
          // a fling lands on a dozen at once, and at 490ms the last of them
          // was still blank while the reader was already looking at it
          el.style.setProperty('--rd', Math.min(i * 70, 210) + 'ms');
          try { revealNow(el); } catch (e) { el.classList.add('in'); }
        });
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          io.unobserve(en.target);
          queue(en.target);
        });
      // Starts a little BELOW the fold (+8%), not 8% inside it: content
      // used to enter blank and only begin to appear once well on screen,
      // up to 600ms after entering on a phone (before/after figures in
      // BRAND.md, "Scroll comfort (round 3)"). Now the wave is under way as
      // it comes into view.
      }, { threshold: 0, rootMargin: '0px 0px 8% 0px' });
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
    var finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    /* On a touch screen, content that is read (the kickers, the hero plate,
       the project screenshots) stays put; only decoration (aria-hidden) keeps
       its depth. A finger scroll runs on the compositor while this runs on the
       main thread, a frame or more behind and eased on purpose, so text that
       drifted with it read as the page swimming under the finger. .px-still
       also drops the element's will-change layer (styles.css, r3/a block). */
    var paraEls = [].slice.call(document.querySelectorAll('[data-parallax]')).filter(function (el) {
      if (finePointer || el.closest('[aria-hidden="true"]')) return true;
      el.classList.add('px-still');
      return false;
    }).map(function (el) {
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
               // Content that is read (a kicker over its heading) is bounded
               // at 12px: it sits 32px above its heading, and in a fast wheel
               // scroll the eased lag carried it 36px down, onto the heading
               // (measured at 1280: gap -4px). In view its target never
               // passes ~14px, so at rest the depth is the same.
               cap: parseFloat(el.getAttribute('data-parallax-cap')) || (el.closest('[aria-hidden="true"]') ? 64 : 12),
               sy: 0, ty: 0, docTop: 0, h: 0 };
    });

    /* On a touch screen the decoration that keeps its depth is driven by the
       scroll itself, on the compositor: one scroll-linked animation per
       element (a ScrollTimeline over the page), its keyframes the same
       formula as below, sampled at the points where the cap starts and
       stops clamping, so the piecewise-linear curve is exact. It moves in
       step with the finger, not a main-thread frame behind it, and costs
       no script per frame: traced on a phone (CPU 4x), the eased loop below
       was ~1.3s of script in one scroll of the page and over a third of the
       frames dropped. Without ScrollTimeline the touch screen keeps the loop. */
    var linked = !finePointer && !reduceMotion && typeof window.ScrollTimeline === 'function' && !!document.documentElement.animate;
    if (paraEls.length && linked) {
      (function () {
        var root = document.scrollingElement || document.documentElement;
        var tl = new ScrollTimeline({ source: root, axis: 'block' });
        var queued = false;
        function bind() {
          queued = false;
          var y = window.scrollY || window.pageYOffset || 0, vh = window.innerHeight;
          var max = Math.max(1, root.scrollHeight - root.clientHeight);
          // cancel first: a rect read back must not include our own translate
          paraEls.forEach(function (p) { if (p.anim) { p.anim.cancel(); p.anim = null; } });
          paraEls.forEach(function (p) {
            var r = p.el.getBoundingClientRect();
            if (!r.height || !p.k) return;           // hidden: nothing to drive
            // the scroll position that puts the element's centre at the
            // viewport's centre; the offset there is 0 and grows by k per px
            var c = r.top + y + r.height / 2 - vh / 2, span = p.cap / Math.abs(p.k);
            var at = function (s) { return Math.max(-p.cap, Math.min(p.cap, (c - s) * p.k)); };
            var pts = [0, max];
            [c - span, c + span].forEach(function (s) { if (s > 0 && s < max) pts.push(s); });
            pts.sort(function (a, b) { return a - b; });
            p.anim = p.el.animate(pts.map(function (s) {
              return { offset: s / max, translate: '0px ' + at(s).toFixed(1) + 'px' };
            }), { timeline: tl, fill: 'both', easing: 'linear' });
          });
        }
        function rebind() { if (!queued) { queued = true; requestAnimationFrame(bind); } }
        bind();
        // the page's height and every element's place move the curve: the
        // viewport, fonts and late images (load), a theme's type, a FAQ answer
        window.addEventListener('resize', rebind);
        window.addEventListener('load', function () { setTimeout(rebind, 260); });
        document.addEventListener('numidea:relayout', function () { setTimeout(rebind, 60); });
        if ('ResizeObserver' in window) new ResizeObserver(rebind).observe(document.body);
      })();
    } else if (paraEls.length && !reduceMotion) {
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
          paraEls[i].el.style.translate = '';
          paraEls[i].last = '';
        }
        for (var j = 0; j < paraEls.length; j++) {
          var q = paraEls[j], r = q.el.getBoundingClientRect();
          q.docTop = r.top + y;
          q.h = r.height;
        }
        vh = window.innerHeight;
        sy0 = y;
        aim();
      }

      /* The scroll position is read in the scroll event and cached, never in
         the rAF callback: by then frame() has written this frame's translates,
         and reading scrollY after a style write forces a synchronous style
         recalculation — measured at 45ms a frame on a 4x-throttled CPU. */
      var vh = window.innerHeight, sy0 = window.scrollY || window.pageYOffset || 0;
      function aim() {
        var y = sy0;
        for (var i = 0; i < paraEls.length; i++) {
          var p = paraEls[i];
          // a hidden element has no position worth chasing — leave it at
          // rest until it is shown
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
          // Off-screen elements keep easing in JS but are not written: a
          // write costs a style recalc, and nobody can see them move.
          if (p.docTop + p.h < sy0 - 300 || p.docTop > sy0 + vh + 300) continue;
          // One plain `translate` write per element. These were three CSS
          // custom properties — and custom properties INHERIT, so every write
          // restyled the element's whole subtree: ~166 elements per frame for
          // 39 moving ones. `translate` is not inherited, so only the element
          // itself is restyled, and an unchanged value is not written at all.
          var v = (pxC * d).toFixed(1) + 'px ' + (pyC * d * 0.55 + p.sy).toFixed(1) + 'px';
          if (v !== p.last) { p.el.style.translate = v; p.last = v; }
        }
        if (settled) { running = false; lastTs = 0; } else requestAnimationFrame(frame);
      }

      var pending = false;
      function onParaScroll() {
        sy0 = scrollPos;   // read once, by the first scroll listener
        if (pending) return;
        pending = true;
        requestAnimationFrame(function () { aim(); pending = false; });
      }
      window.addEventListener('scroll', onParaScroll, { passive: true });
      window.addEventListener('resize', function () { vh = window.innerHeight; cache(); });
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


    /* ---------- hero plate: four live client sites + the Glaive demo ----------
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
        tabs.forEach(function (e, i) { if (i === n) e.setAttribute('aria-current', 'true'); else e.removeAttribute('aria-current'); });
        if (idxEl) idxEl.textContent = ('0' + (n + 1)).slice(-2);
        cur = n;
      }

      // a slide's image has arrived, has failed for good, or is on its way
      function ready(i) { return slides[i].complete && slides[i].naturalWidth > 0; }
      function failed(i) { return slides[i].complete && !slides[i].naturalWidth; }

      /* The latest pick wins. A rail press during a wipe is kept and played
         when the wipe ends, not dropped (the plate stayed on the earlier
         slide under someone who had chosen another). A picked slide whose
         image has not arrived is asked for at once and waited for, so the
         wipe never uncovers a blank plate; one that failed is shown anyway:
         the visitor chose it, and the caption still names the client. */
      var want = -1, waiting = -1;
      function go(n) {
        want = n;
        if (busy) return;
        if (n === cur) { want = -1; return; }
        if (!ready(n) && !failed(n)) {
          // the rail answers at once; the plate follows when the image lands
          tabs.forEach(function (e, i) { if (i === n) e.setAttribute('aria-current', 'true'); else e.removeAttribute('aria-current'); });
          if (waiting !== n) {
            waiting = n;
            var again = function () { if (waiting !== n) return; waiting = -1; if (want === n) go(n); };
            slides[n].addEventListener('load', again, { once: true });
            slides[n].addEventListener('error', again, { once: true });
            slides[n].loading = 'eager';
          }
          return;
        }
        want = -1; waiting = -1;
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
          if (t < 1) { requestAnimationFrame(step); return; }
          wipe.style.setProperty('--wipe', '0'); wipe.style.setProperty('--wipeEdge', '0'); busy = false;
          if (want > -1) go(want);   // a pick made while this one ran
        }
        requestAnimationFrame(step);
      }

      function next() {
        // A pick still waiting for its image wins over the rotation.
        if (waiting > -1) return;
        // Never wipe onto an image that has not arrived. On a slow link the
        // low-priority slides land seconds after the first; advancing anyway
        // showed a blank plate and re-elected LCP onto whichever image came
        // last. The interval simply tries again next tick. An image that
        // failed (complete, but no pixels) never arrives: skip that slide,
        // or one bad request stops the deck for good.
        for (var k = 1; k < slides.length; k++) {
          var n = (cur + k) % slides.length;
          if (failed(n)) continue;
          if (ready(n)) go(n);
          return;
        }
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
      // `user` is the pause button: a latch only the button releases
      // `picked` is a rail tap by a finger (below)
      var held = { hover: false, focus: false, hidden: false, idle: true, user: false, picked: false };
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
        if (reduceMotion || held.hover || held.focus || held.hidden || held.idle || held.user || held.picked) return;
        timer = setInterval(next, HOLD);
      }
      function hold(k, v) { held[k] = v; arm(); }

      /* A finger has no hover, and in Safari a tapped button takes no focus,
         so neither latch held the deck after a rail pick on a phone: with
         the tap's focus dropped, as Safari does, it moved off the chosen
         slide 5.2s later. A touch pick holds it until the next touch
         outside the plate. */
      var lastPointer = '';
      wrap.addEventListener('pointerdown', function (e) { lastPointer = e.pointerType; }, { passive: true });
      wrap.addEventListener('keydown', function () { lastPointer = ''; });   // Enter/Space is not a finger
      document.addEventListener('pointerdown', function (e) {
        if (held.picked && !wrap.contains(e.target)) hold('picked', false);
      }, { passive: true });
      tabs.forEach(function (b, i) {
        b.addEventListener('click', function () {
          if (lastPointer === 'touch') held.picked = true;
          lastPointer = '';
          go(i); arm();
        });
      });
      // WCAG 2.2.2: anything that moves on its own for more than 5s can be paused
      var pauseBtn = wrap.querySelector('.pl-pause');
      if (pauseBtn) {
        if (reduceMotion) pauseBtn.hidden = true;     // nothing rotates, nothing to pause
        pauseBtn.addEventListener('click', function () {
          var on = pauseBtn.getAttribute('aria-pressed') !== 'true';
          pauseBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
          // an explicit pause or play overrides a finger's rail pick: the
          // button sits inside the plate, so its tap never clears `picked`,
          // and play would otherwise report a rotation that does not run
          held.picked = false;
          hold('user', on);
        });
      }
      // don't rotate under someone reading it, or when the tab is hidden
      wrap.addEventListener('pointerenter', function () { hold('hover', true); });
      wrap.addEventListener('pointerleave', function () { hold('hover', false); });
      // focus on the pause button itself is not reading: it would freeze the
      // rotation that button just resumed
      wrap.addEventListener('focusin',  function (e) { hold('focus', e.target !== pauseBtn); });
      wrap.addEventListener('focusout', function () { hold('focus', false); });
      document.addEventListener('visibilitychange', function () { hold('hidden', document.hidden); });
      arm();
    })();

    // mobile menu
    var toggle = document.querySelector('.menu-toggle');
    var menu = document.querySelector('.mobile-menu');
    var closeBtn = menu ? menu.querySelector('.close') : null;
    // A modal dialog: while open, everything behind it is inert (aria-modal is
    // not honoured everywhere; inert is), Tab stays inside, and closing returns
    // focus to the toggle unless a link click is taking the reader elsewhere.
    function setMenu(open, keepFocus) {
      if (!menu || open === menu.classList.contains('open')) return;
      menu.classList.toggle('open', open);
      if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
      Array.prototype.forEach.call(document.body.children, function (el) {
        if (el !== menu && !el.contains(menu) && el.tagName !== 'SCRIPT') el.inert = open;
      });
      document.dispatchEvent(new CustomEvent('numidea:menu', { detail: open }));
      if (open) { var first = menu.querySelector('a'); if (first) first.focus(); }
      else if (!keepFocus && toggle) toggle.focus();
    }
    if (toggle) toggle.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); });
    if (menu) menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false, true); }); });
    document.addEventListener('keydown', function (e) {
      if (!menu || !menu.classList.contains('open')) return;
      if (e.key === 'Escape') { setMenu(false); return; }
      if (e.key !== 'Tab') return;
      var f = Array.prototype.filter.call(menu.querySelectorAll('a[href],button:not([disabled])'),
        function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // Legacy deep links from the retired project explorer (#/work, #/work/<slug>)
    // land on the project sheets instead of a dead hash.
    (function () {
      var m = /^#\/work(?:\/([\w-]+))?/.exec(location.hash);
      if (!m) return;
      var SHEET = { 'bordj-steel': 'bordjsteel', 'alliance-travel': 'alliance', 'almaflowclim': 'almaflow', 'glaive-store': 'glaive' };
      // the query (?lang=, ?ref=, utm_*) goes along, as it does on every link
      if (m[1] && SHEET[m[1]]) location.replace('scene/' + location.search + '#' + SHEET[m[1]]);
      else history.replaceState(null, '', location.pathname + location.search + '#work');
    })();

    // founder — résumé accordion (max-height expand + label swap)
    var cvBtn = document.querySelector('#cv-toggle'), cvPanel = document.querySelector('#cv-panel');
    if (cvBtn && cvPanel) {
      // The panel ships closed, so it starts inert too — setting this only on
      // toggle left the initial (closed) state still holding a focusable link.
      cvPanel.inert = !cvPanel.classList.contains('open');
      // The label is derived from the state, so a language switch with the
      // panel open does not reset it to "view" (applyLang writes data-i18n).
      var cvLabel = function () {
        var k = ['founder.cvBtn', 'founder.cvClose'][cvPanel.classList.contains('open') ? 1 : 0];
        cvBtn.setAttribute('data-i18n', k);
        cvBtn.innerHTML = t(k);
      };
      cvBtn.addEventListener('click', function () {
        var open = cvPanel.classList.toggle('open');
        // Closed, the panel is only collapsed by max-height:0 — it still held a
        // focusable download link, so a keyboard user tabbed into an invisible
        // panel with nothing on screen to explain where focus had gone.
        cvPanel.inert = !open;
        cvBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        cvLabel();
      });
    }

    /* Text the page writes into the message field for the visitor: the
       Aperçu request (prev) or the estimator's scope (est). It is written
       only while the field is empty or still holds exactly what the page
       last wrote there, so the visitor's own words are never overwritten,
       but an untouched prefill follows a later CTA click, a language or
       currency switch and a re-configured estimate instead of going stale. */
    var msgBox = document.getElementById('f-message');
    var prefill = { kind: '', text: '' };
    function untouched() { return !msgBox.value.trim() || msgBox.value === prefill.text; }
    function prefillWith(kind, text) {
      if (!msgBox || !text || !untouched()) return;
      msgBox.value = text;
      prefill.kind = kind; prefill.text = msgBox.value;
    }
    // follow the page, but only a prefill of that kind still untouched
    function refill(kind, text) {
      if (msgBox && prefill.kind === kind && prefill.text && msgBox.value === prefill.text) prefillWith(kind, text);
    }
    document.addEventListener('numidea:lang', function () { refill('prev', t('prev.msg')); });

    /* Where the prefill lands. Stacked (.contact-grid is one column at
       ≤960px, styles.css), the five contact rows come before the form, so the
       #contact jump stopped about a screen above the message just written
       (390x844: the form 898px down, under an 844px screen). There, the frame
       after the link's own jump, the form is brought to the top. The jump is
       kept, so the URL, Back and where Tab continues from stay as on desktop
       and without this script; with preventDefault, Tab went back up to the
       button's own section. scrollIntoView() follows scroll-padding and
       scroll-behavior, so reduced motion stays instant. Nothing is focused:
       a phone's keyboard would cover the message. */
    var stacked = window.matchMedia('(max-width: 960px)');
    function toForm() {
      var f = document.getElementById('contact-form');
      if (f && stacked.matches) requestAnimationFrame(function () { f.scrollIntoView(); });
    }

    // L'Aperçu: the button hands its request to the message field, then the
    // normal #contact jump happens (carried on to the form where it stacks)
    var prevCta = document.getElementById('prev-cta');
    if (prevCta) prevCta.addEventListener('click', function () { prefillWith('prev', t('prev.msg')); toForm(); });

    // contact form — designed validation + success
    var form = document.querySelector('#contact-form');
    if (form) {
      // Without this script the form posts to a mailto: (its action) and the
      // browser checks the required fields; with it, the designed messages
      // below take over and the submit is handled here.
      form.noValidate = true;
      var success = document.querySelector('.form-success');
      function field(id) { return form.querySelector('[name="' + id + '"]').closest('.field'); }
      function err(id, key) {
        var f = field(id);
        var dict = I18N[document.documentElement.getAttribute('lang')] || I18N[DEFAULT_LANG];
        f.classList.add('invalid');
        var e = f.querySelector('.err');
        e.textContent = key ? dict[key] : '';
        if (key) e.setAttribute('data-err-key', key); else e.removeAttribute('data-err-key');
        f.querySelector('input,textarea').setAttribute('aria-invalid', 'true');
      }
      // A language switch re-translates the labels; the messages follow.
      document.addEventListener('numidea:lang', function () {
        form.querySelectorAll('.err[data-err-key]').forEach(function (e) { e.textContent = t(e.getAttribute('data-err-key')); });
      });
      function clear(id) {
        var f = field(id);
        f.classList.remove('invalid');
        f.querySelector('.err').textContent = '';
        f.querySelector('.err').removeAttribute('data-err-key');
        f.querySelector('input,textarea').removeAttribute('aria-invalid');
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
        // focus the first field to fix; its error is read through aria-describedby
        if (!ok) { var bad = form.querySelector('[aria-invalid="true"]'); if (bad) bad.focus(); return; }

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
                lang: document.documentElement.getAttribute('lang') || 'fr'
              })
            }).catch(function () {}); // best-effort — never blocks the visitor
          } catch (e2) {}
        }

        // Static site, no backend: hand the lead off to the visitor's mail client,
        // pre-filled to hamissemohamedyasser@gmail.com. Only show success after the handoff.
        var subject = 'Numidea Labs · ' + name;
        var src = leadSource();
        var body = name + ' <' + email + '>\n\n' + msg
          + '\n\n--\nnumidealabs · ' + (document.documentElement.getAttribute('lang') || 'fr')
          // French sets a narrow no-break space before the colon; English and Arabic none
          + (src ? '\n' + t('form.source') + (document.documentElement.getAttribute('lang') === 'fr' ? ' : ' : ': ') + src : '');
        window.location.href = 'mailto:hamissemohamedyasser@gmail.com'
          + '?subject=' + encodeURIComponent(subject)
          + '&body=' + encodeURIComponent(body);
        form.style.display = 'none';
        // the form just vanished from under the focus; land it on the outcome
        if (success) { success.classList.add('show'); success.focus(); }
      });
      /* When no mail app opened, the visitor's text is not lost: the form
         (still filled in) comes back, to copy from or to send again. */
      var editBtn = document.getElementById('form-edit');
      if (editBtn && success) editBtn.addEventListener('click', function () {
        success.classList.remove('show');
        form.style.display = '';
        if (msgBox) msgBox.focus();
      });
    }

    /* ---------------- 12 · project estimator ----------------
       The figures and the arithmetic are ESTIMATE (top of this file, pure);
       this section only reads the controls and writes the result. */
    var PRICE_MODEL = ESTIMATE.PRICE_MODEL, PRICE_OPTS = ESTIMATE.PRICE_OPTS;

    /* The plural category of n in the page's language. Without
       Intl.PluralRules, 1 is still "one" (and 2 the Arabic dual). */
    function plural(lang, n) {
      try { return new Intl.PluralRules(lang).select(n); } catch (e) {}
      if (n === 1) return 'one';
      if (lang === 'ar') {
        var h = n % 100;
        return n === 2 ? 'two' : h >= 3 && h <= 10 ? 'few' : h >= 11 ? 'many' : 'other';
      }
      return 'other';
    }
    /* A counted unit in the page's language: "1 page", "3 pages"; in Arabic
       the noun follows the number (one|two|few|many|other, e.g. 16 أسبوعاً).
       Forms live in the dictionary as '<key>.n', split on '|'. */
    function unit(k, n) {
      var lang = document.documentElement.getAttribute('lang') || DEFAULT_LANG;
      var d = I18N[lang] || I18N[DEFAULT_LANG], forms = d[k + '.n'];
      if (!forms) return d[k] || k;
      var f = forms.split('|');
      var i = (f.length === 5 ? ['one', 'two', 'few', 'many', 'other'] : ['one', 'other']).indexOf(plural(lang, n));
      return f[i > -1 ? i : f.length - 1];
    }
    /* The Arabic dual already says "two" (صفحتان is "two pages"): it stands
       without the numeral, which would read "2 two-pages". */
    function dual(n) {
      var lang = document.documentElement.getAttribute('lang');
      return lang === 'ar' && plural(lang, n) === 'two';
    }
    // "8 pages", "60 منتجاً", "صفحتان"
    function counted(k, n) { return dual(n) ? unit(k, n) : n + ' ' + unit(k, n); }

    /* dictionary lookup for strings built in JS (estimator, WhatsApp text) */
    function t(k, fb) {
      var d = I18N[document.documentElement.getAttribute('lang')] || I18N[DEFAULT_LANG];
      return d && d[k] != null ? d[k] : (fb || k);
    }

    /* ---------------- 12a · display currency ----------------
       Every price is set in dinars (PRICE_MODEL, RETAINER) and only converted
       for display, at the Bank of Algeria official rate of early October 2026
       (1 Oct: 1 € = 151.06 DA, 1 $ = 133.66 DA; an independent page agreed
       within 0.3%), rounded to what a person would actually quote. The tier
       cards, the maintenance line, the estimator and the market table all go
       through this one place, so no two figures on the page can disagree.
       ?cur= (an ad or a shared link) wins over the stored choice; dinars
       otherwise, which is also what the markup says with scripts off. */
    var FX = { DZD: 1, EUR: 151, USD: 134 };
    var CURS = ['DZD', 'EUR', 'USD'];
    var RETAINER = [18000, 60000];   // per month
    // narrow no-break space between groups: a normal space lets a figure wrap,
    // and a comma reads as a decimal point in DZ
    /* Numbers as each language writes them. French and Arabic group thousands
       with a narrow no-break space and put the currency after the figure
       (90 000 – 160 000 DA, 1 500 – 6 000 €); English groups with commas,
       closes up the range dash and puts € or $ before the figure
       (€1,500–6,000; 90,000–160,000 DZD). A range never breaks across lines:
       the dash is held by no-break spaces or word joiners. */
    var isEn = function () { return document.documentElement.getAttribute('lang') === 'en'; };
    var grp = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, isEn() ? ',' : ' '); };
    var dash = function () { return isEn() ? '\u2060–\u2060' : '\u00a0–\u2060\u00a0'; };
    var tidy = function (n, c) {
      var g = c === 'DZD' ? (n >= 1e6 ? 50000 : n >= 150000 ? 10000 : 5000)
                          : (n >= 10000 ? 500 : n >= 1000 ? 100 : 10);
      return Math.max(g, Math.round(n / g) * g);
    };
    var sym = function (c) { return c === 'DZD' ? t('price.cur') : c === 'EUR' ? '€' : '$'; };
    var pre = function (c) { return isEn() && c !== 'DZD' ? sym(c) : ''; };   // sign before the figure
    var post = function (c) { return pre(c) ? '' : sym(c); };                 // or after it
    // a dinar figure as shown in currency c (dinars pass through unrounded)
    var shown = function (dzd, c) { return c === 'DZD' ? dzd : tidy(dzd / FX[c], c); };
    var rangeText = function (lo, hi, c) {
      return (c === 'DZD' ? '' : '≈ ') + pre(c) + grp(shown(lo, c)) + dash() + grp(shown(hi, c));
    };
    var CUR = (function () {
      var q = '', s = '';
      try { q = (new URLSearchParams(location.search).get('cur') || '').toUpperCase(); } catch (e) {}
      try { s = localStorage.getItem('numidea-cur') || ''; } catch (e) {}
      // An ad's ?cur= is kept like ?lang= is, so the visitor's choice of
      // currency survives a visit to another page and the way back.
      if (CURS.indexOf(q) !== -1) { try { localStorage.setItem('numidea-cur', q); } catch (e) {} return q; }
      return CURS.indexOf(s) !== -1 ? s : 'DZD';
    })();
    var renderPrices = function () {
      document.querySelectorAll('.t-range[data-tier]').forEach(function (p) {
        var m = PRICE_MODEL[p.getAttribute('data-tier')];
        p.querySelector('b').textContent = rangeText(m.base[0], m.base[1], CUR);
        p.querySelector('.cur').textContent = post(CUR);
      });
      var ret = document.getElementById('pr-ret');
      if (ret) {
        ret.textContent = rangeText(RETAINER[0], RETAINER[1], CUR);
        ret.parentNode.querySelector('.cur').textContent = post(CUR);
      }
      var note = document.getElementById('pr-cur-note');
      if (note) { note.hidden = CUR === 'DZD'; note.textContent = CUR === 'DZD' ? '' : t('price.curNote' + CUR); }
      document.querySelectorAll('input[name="pr-cur"]').forEach(function (r) { r.checked = r.value === CUR; });
    };
    var setCur = function (c) {
      if (CURS.indexOf(c) === -1) return;
      CUR = c;
      try { localStorage.setItem('numidea-cur', c); } catch (e) {}
      // keep a shared ?cur= link truthful after a switch, as ?lang= is
      try {
        var u = new URL(location.href);
        if (u.searchParams.has('cur')) { u.searchParams.set('cur', c.toLowerCase()); history.replaceState(null, '', u); }
      } catch (e) {}
      renderPrices();
      document.dispatchEvent(new CustomEvent('numidea:cur', { detail: { cur: c } }));
    };
    document.querySelectorAll('input[name="pr-cur"]').forEach(function (r) {
      r.addEventListener('change', function () { if (r.checked) setCur(r.value); });
    });
    document.addEventListener('numidea:lang', renderPrices);
    renderPrices();

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

      var typeOf = function () {
        var r = est.querySelector('input[name="est-type"]:checked');
        return r ? r.value : 'surmesure';
      };

      /* What the visitor ticked is theirs. A tier that includes an option
         shows it ticked and locked; leaving that tier gives the box back as
         the visitor had left it (data-user), not unticked: a paid option
         chosen on Vitrine survives a look at Studio and back. */
      est.querySelectorAll('input[data-opt]').forEach(function (c) {
        c.addEventListener('change', function () { if (!c.disabled) c.dataset.user = c.checked ? '1' : ''; });
      });

      var syncSize = function (keepValue) {
        var m = PRICE_MODEL[typeOf()];
        var prev = parseInt(eSize.value, 10);
        eSize.min = m.min; eSize.max = m.max; eSize.step = m.step;
        eSize.value = keepValue && prev >= m.min && prev <= m.max ? prev : m.def;
        if (eSizeH) eSizeH.textContent = t(m.u);
        /* Options the tier already includes are shown ticked and locked,
           labelled as included; leaving that type frees them again. */
        est.querySelectorAll('input[data-opt]').forEach(function (c) {
          var inc = (m.incl || []).indexOf(c.getAttribute('data-opt')) > -1;
          var lab = c.closest('label'), tag = lab && lab.querySelector('.eo-incl');
          if (inc) {
            if (!c.disabled) c.dataset.user = c.checked ? '1' : '';
            c.checked = true; c.disabled = true;
          } else if (c.disabled) {
            c.checked = c.dataset.user === '1'; c.disabled = false;
          }
          if (inc && lab && !tag) {
            tag = document.createElement('small');
            tag.className = 'eo-incl';
            lab.appendChild(tag);
          }
          if (tag) {
            if (inc) tag.textContent = t('price.incl');
            else tag.remove();
          }
        });
      };

      var compute = function () {
        var key = typeOf(), m = PRICE_MODEL[key];
        var n = parseInt(eSize.value, 10) || m.def;
        var opts = [].map.call(est.querySelectorAll('input[data-opt]:checked'), function (c) { return c.getAttribute('data-opt'); });
        var rush = est.querySelector('input[name="est-pace"]:checked');
        var q = ESTIMATE.quote(key, n, opts, !!(rush && rush.value === 'rush'));
        var picked = opts.filter(function (o) { return PRICE_OPTS[o]; }).map(function (o) {
          return q.incl.indexOf(o) > -1 ? t(PRICE_OPTS[o].k) + ' (' + t('price.incl') + ')' : t(PRICE_OPTS[o].k);
        });
        if (q.rush) picked.push(t('price.paceRush'));
        // a Vitrine that would cost more than the Studio tier is quoted as Studio
        if (q.studio) picked.push(t('price.studioBetter'));

        eLo.textContent = (CUR === 'DZD' ? '' : '≈ ') + pre(CUR) + grp(shown(q.lo, CUR));
        eHi.textContent = grp(shown(q.hi, CUR));
        var eCur = eLo.parentNode.querySelector('.cur');
        if (eCur) eCur.textContent = post(CUR);
        // .eo-time is a status region: write only what changed, or every
        // slider step re-announces an unchanged delivery time
        var setText = function (el, v) { if (el && el.textContent !== v) el.textContent = v; };
        setText(eWeeks, q.wLo + dash() + q.wHi);
        setText(eWeeks.parentNode.querySelector('[data-i18n="price.weeks"]'), unit('price.weeks', q.wHi));

        // the size readout and the slider's spoken value carry the unit, which
        // changes meaning with the type (pages, products, screens…)
        var two = dual(n);
        if (eSizeV) { eSizeV.textContent = n; eSizeV.hidden = two; }
        if (eSizeH) eSizeH.textContent = unit(m.u, n);
        eSize.setAttribute('aria-valuetext', counted(m.u, n));
        if (eSum) {
          eSum.textContent = '';
          var head = document.createElement('li');
          head.className = 'eo-head';
          head.textContent = t('price.ty' + ({ vitrine: 'Vitrine', surmesure: 'Custom', ecommerce: 'Shop',
                                               app: 'App', auto: 'Auto', identite: 'Brand' }[key]))
                           + ' · ' + counted(m.u, n);
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
            + ' — ' + rangeText(q.lo, q.hi, CUR) + (post(CUR) ? ' ' + post(CUR) : '') + (CUR === 'DZD' ? '' : ' ' + t('price.exTax'));
          // a scope already handed to the message, untouched, follows this one
          refill('est', eCta.dataset.scope);
        }
      };

      est.addEventListener('change', function (ev) {
        if (ev.target.name === 'est-type') syncSize(false);
        compute();
      });
      eSize.addEventListener('input', compute);
      /* A finger that lands on the slider to scroll the page past it must
         not change the estimate. Chrome on Android moves the thumb to the
         touch point on pointerdown, then hands a vertical gesture to the
         page (pointercancel): measured at 320-844px, a swipe up from the
         track set 22 pages to 9 while the page scrolled 176px. When the
         browser takes the gesture as a scroll the value is put back; a
         sideways drag stays the slider's (no pointercancel). It is put back
         through the 'input' event, not a direct compute(): setting .value
         fires nothing, and every view of the estimate (the figures here, the
         range bar in 13b) listens to 'input', so all of them follow. */
      var touchFrom = null;
      eSize.addEventListener('pointerdown', function (e) { touchFrom = e.pointerType === 'touch' ? eSize.value : null; });
      eSize.addEventListener('pointerup', function () { touchFrom = null; });
      eSize.addEventListener('pointercancel', function () {
        if (touchFrom !== null && eSize.value !== touchFrom) { eSize.value = touchFrom; eSize.dispatchEvent(new Event('input')); }
        touchFrom = null;
      });

      /* Hand the scope to the message field rather than losing it on the jump. */
      if (eCta) {
        eCta.addEventListener('click', function () { prefillWith('est', eCta.dataset.scope); toForm(); });
      }

      /* Units and option labels are translated, so rebuild on language change. */
      document.addEventListener('numidea:lang', function () { syncSize(true); compute(); });
      document.addEventListener('numidea:cur', compute);
      syncSize(true);
      compute();
    }

    /* ---------------- 13 · WhatsApp ----------------
       NUMIDEA_WA is the studio's number in full international form, digits
       only (e.g. '213XXXXXXXXX'). While it is empty every WhatsApp control
       stays visibly pending rather than linking somewhere wrong — the same
       idiom hub/ uses for handles with no verified URL. */
    var WA = (window.NUMIDEA_WA || '').replace(/[^0-9]/g, '');
    /* Where a lead came from, read at the moment it is sent: ?ref= (each ad
       and email carries its own code), utm_* and whether Meta or Google added
       a click id. Nothing is stored or sent anywhere else: it rides in the
       mailto body and the WhatsApp text the visitor sends themselves. The
       query string survives every #anchor jump, and links to the site's
       other pages carry these parameters along (assets/carry.js).
       Declarations, not expressions: the form's submit handler (above) calls
       leadSource(), and a hoisted declaration exists even if something
       between there and here threw during start-up. */
    function leadSource() {
      var q; try { q = new URLSearchParams(location.search); } catch (e) { return ''; }
      var clean = function (v) { return (v || '').replace(/[^\w .:\/-]/g, '').slice(0, 40); };
      // the four usual utm_* first, as values; any other utm_* (term, id…)
      // named, so no campaign parameter is lost; then the ad's own ?ref=
      var MAIN = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
      var utm = {}, extra = [];    // first value of each utm_* key, any case
      q.forEach(function (v, k) {
        k = k.toLowerCase();
        if (k.indexOf('utm_') !== 0 || Object.prototype.hasOwnProperty.call(utm, k)) return;
        utm[k] = v;
        if (MAIN.indexOf(k) === -1) extra.push(k);
      });
      var parts = MAIN.map(function (k) { return clean(utm[k]); });
      extra.forEach(function (k) { if (clean(utm[k])) parts.push(clean(k.slice(4)) + ':' + clean(utm[k])); });
      parts.push(clean(q.get('ref')));
      parts = parts.filter(Boolean);
      if (q.has('fbclid')) parts.push('fbclid');
      if (q.has('gclid')) parts.push('gclid');
      return parts.join(' · ');
    }
    function refTag() {
      var r = ''; try { r = new URLSearchParams(location.search).get('ref') || ''; } catch (e) {}
      r = r.replace(/[^\w-]/g, '').slice(0, 20);
      return r ? ' [' + r + ']' : '';
    }
    // Rebuilt on a language swap, so the pre-filled greeting follows the page.
    var wireWA = function () { document.querySelectorAll('.wa-link').forEach(function (a) {
      if (WA) {
        // a link may carry its own opening line (the Aperçu one does)
        a.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(t(a.getAttribute('data-wa-text') || 'wa.hello') + refTag());
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


    /* ---------------- phone contact bar ----------------
       Phones only (the CSS hides it above 720px). Shown once the visitor is
       1.5 screens down, hidden again while #contact or the footer is on screen
       (both already offer the same two actions) and while the menu is open.
       It also steps aside while the reader scrolls down: with the navbar it
       covered 142px of a 320x568 screen (25%) the whole way down. It slides
       back on a scroll up, or once the page has been still for 600ms, and
       stays while focus is inside it. A same-page jump (a client logo to its
       card, a menu link) is reading too: the bar stays aside until the
       visitor moves the page themselves. Coming back 600ms after a logo's
       jump, it covered the benefit line the logo leads to on a 320x568
       phone. Caught on the click, not on hashchange, which a second tap on
       the same logo never fires; a touch, the wheel or a key clears it
       (each comes before the click it may lead to). */
    (function () {
      var bar = document.querySelector('.m-contact');
      if (!bar) return;
      // as in styles.css: phones, but not a phone on its side (short and at
      // least 480px wide), where the bar would cover a third of the screen
      var mq = window.matchMedia('(max-width: 720px) and (min-height: 561px), (max-width: 479px)');
      var inView = { contact: false, footer: false }, menuOpen = false;
      var lastY = scrollPos, goingDown = false, restT = 0, jumped = false;
      function update() {
        bar.classList.toggle('on', mq.matches && !menuOpen && !inView.contact && !inView.footer
          && scrollPos > viewH * 1.5 && !jumped && (!goingDown || bar.contains(document.activeElement)));
      }
      function rest() { goingDown = false; lastY = scrollPos; update(); }
      function onBarScroll() {
        var dy = scrollPos - lastY;
        // a few pixels either way (a settling fling, rubber-banding) change nothing
        if (dy > 6 || dy < -6) { goingDown = dy > 0; lastY = scrollPos; }
        clearTimeout(restT);
        if (goingDown) restT = setTimeout(rest, 600);
        update();
      }
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (e) { inView[e.target.classList.contains('footer') ? 'footer' : 'contact'] = e.isIntersecting; });
          update();
        });
        ['#contact', '.footer'].forEach(function (s) { var el = document.querySelector(s); if (el) io.observe(el); });
      }
      document.addEventListener('numidea:menu', function (e) { menuOpen = !!e.detail; update(); });
      document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[href^="#"]');
        if (!a || a.getAttribute('href').length < 2) return;
        jumped = true; clearTimeout(restT); update();
      });
      ['touchstart', 'wheel', 'keydown'].forEach(function (t) {
        window.addEventListener(t, function () { jumped = false; }, { passive: true });
      });
      window.addEventListener('scroll', onBarScroll, { passive: true });
      if (mq.addEventListener) mq.addEventListener('change', update); else if (mq.addListener) mq.addListener(update);
      update();
    })();

    /* ---------------- 13b · visualisations (r3/c) ----------------
       Pictures of numbers the page already states, drawn from the same
       sources and never from new ones: the method's four steps, the Aperçu's
       terms (prev.brief), PRICE_MODEL (each tier's weeks; the estimate against
       the three packages) and MARKET (section 14). Each one sits beside its
       text equivalent — the steps, the brief, the tier's own line, the
       estimator's status line, the market table — so the pictures themselves
       are aria-hidden.
       Motion is entrance only, started by IntersectionObserver (never a
       scroll handler), on transform and opacity. The drawn state is the
       default: the script adds .vz-arm to hold a picture back and .vz-go /
       .vz-lit to play it, so with scripts off, with reduced motion, or for a
       picture already on screen when this runs, nothing waits. Pictures
       whose marks this places keep their room from the first paint and are
       shown (.vz-on) once placed. Printing, or reduced motion turned on
       during the visit, finishes whatever is still held back.
       Its own try: a fault here must not stop the sections after it. */
    try {
      var vzMove = !reduceMotion && 'IntersectionObserver' in window;
      var vzPainted = false;
      try { vzPainted = performance.getEntriesByType('paint').length > 0; } catch (e) {}
      var vzRtl = function () { return document.documentElement.getAttribute('dir') === 'rtl'; };
      var vzPrint = [];   // how to finish each picture still held back, for print
      /* Hold el back for its entrance, unless motion is off or the visitor
         is already looking at it (a page opened on #pricing): a picture that
         blinked out and redrew itself in front of them would read as a fault. */
      var vzArm = function (el, finish) {
        if (!vzMove) return false;
        if (vzPainted) {
          var r = el.getBoundingClientRect();
          if (r.width && r.bottom > 0 && r.top < (window.innerHeight || 0)) return false;
        }
        el.classList.add('vz-arm');
        vzPrint.push(finish || function () { el.classList.remove('vz-arm'); });
        return true;
      };
      var vzFinish = function () { vzPrint.forEach(function (f) { f(); }); vzPrint = []; };
      window.addEventListener('beforeprint', vzFinish);
      /* Reduced motion turned on during the visit: every picture still held
         back is finished at once, as it would have been from the start, and
         none is held back after (vzMove). */
      var vzRmq = window.matchMedia('(prefers-reduced-motion: reduce)');
      var vzOnRm = function () { if (vzRmq.matches) { vzMove = false; vzFinish(); } };
      if (vzRmq.addEventListener) vzRmq.addEventListener('change', vzOnRm);
      else if (vzRmq.addListener) vzRmq.addListener(vzOnRm);
      // fn(el) the first time el is `share` on screen (only ever called on armed pictures)
      var vzOnce = function (els, share, fn) {
        if (!els.length) return;
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); fn(e.target); } });
        }, { threshold: share, rootMargin: '0px 0px -8% 0px' });
        els.forEach(function (el) { io.observe(el); });
      };
      // a share of a scale as a CSS percentage
      var pc = function (x) { return (x * 100).toFixed(3) + '%'; };
      // where v sits on a logarithmic scale from v0 to v1, clamped to 0..1
      var logAt = function (v, v0, v1) {
        return Math.max(0, Math.min(1, (Math.log(v) - Math.log(v0)) / (Math.log(v1) - Math.log(v0))));
      };

      /* -- the method: the line from node to node draws itself as the steps
         come into view, one segment at a time, then the node it reaches
         opens out to its size (it waits small, never faded: its number is
         text). Steps light in order, one every 420ms, so a jump down the
         page still draws the line node by node instead of all at once. */
      (function () {
        var list = document.querySelector('#how .steps');
        if (!list) return;
        var steps = [].slice.call(list.querySelectorAll('.step'));
        if (!vzArm(list, function () {
          list.style.setProperty('--rail', '1');
          steps.forEach(function (s) { s.classList.add('vz-lit'); });
          // and the steps still queued do not light one by one after it
          queue.length = 0; lit = steps.length;
          if (io) io.disconnect();
        })) return;
        /* The share of the rail's length up to node k's centre, read from
           the rail's own box (.steps::before) and layout offsets, which a
           step's reveal transform does not move; the last node takes the
           whole rail, which runs on past it. */
        var reach = function (k) {
          if (k >= steps.length - 1) return 1;
          var r = getComputedStyle(list, '::before'), node = steps[k].querySelector('.node');
          var w = parseFloat(r.width), h = parseFloat(r.height);
          if (!node || !(w > 0) || !(h > 0)) return 1;
          var cx = steps[k].offsetLeft + node.offsetLeft + node.offsetWidth / 2;
          var cy = steps[k].offsetTop + node.offsetTop + node.offsetHeight / 2;
          var f = w > h ? (cx - parseFloat(r.left)) / w : (cy - parseFloat(r.top)) / h;
          if (w > h && vzRtl()) f = 1 - f;
          return Math.max(0, Math.min(1, f));
        };
        var lit = 0, queue = [], busy = false;
        var pump = function () {
          if (!queue.length) { busy = false; return; }
          busy = true;
          var k = queue.shift();
          list.style.setProperty('--rail', reach(k).toFixed(4));   // the line reaches node k
          steps[k].classList.add('vz-lit');                          // which opens out (styles.css delays it)
          setTimeout(pump, 420);
        };
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            if (!e.isIntersecting) return;
            for (var i = steps.indexOf(e.target); lit <= i; lit++) { queue.push(lit); io.unobserve(steps[lit]); }
          });
          if (!busy) pump();
        }, { threshold: 0.5, rootMargin: '0px 0px -10% 0px' });
        steps.forEach(function (s) { io.observe(s); });
      })();

      /* -- the Aperçu: you send, five working days, the call, you decide.
         The amount paid at the decision is the one figure in it; it follows
         the currency switch like every price on the page. */
      (function () {
        var tl = document.querySelector('#apercu .ptl');
        if (!tl) return;
        var zero = tl.querySelector('.ptl-zero');
        var paint = function () {
          if (!zero || !zero.firstChild) return;
          zero.firstChild.nodeValue = pre(CUR) + '0' + (post(CUR) ? ' ' : '');
          var c = zero.querySelector('.cur');
          if (c) c.textContent = post(CUR);
        };
        document.addEventListener('numidea:cur', paint);
        document.addEventListener('numidea:lang', paint);
        paint();
        if (vzArm(tl, function () { tl.classList.add('vz-go'); })) {
          vzOnce([tl], 0.6, function (el) { el.classList.add('vz-go'); });
        }
      })();

      /* -- tiers: each tier's delivery window, shortest to longest, on one
         ruler shared by the three cards (0 to the longest tier's top, 16
         weeks), its ends labelled, so the windows compare at a glance. The
         line of text above stays the statement. */
      (function () {
        var cards = [].slice.call(document.querySelectorAll('.tier')).map(function (card) {
          var r = card.querySelector('.t-range[data-tier]'), w = card.querySelector('.t-weeks');
          var m = r && PRICE_MODEL[r.getAttribute('data-tier')];
          return m && w ? { w: w, m: m } : null;
        }).filter(Boolean);
        if (!cards.length) return;
        var n = Math.max.apply(null, cards.map(function (c) { return c.m.weeks[1]; }));
        var armed = [];
        // the ruler's far end, "16 semaines" / "16 weeks" / "16 أسبوعاً"
        var ends = function () {
          var far = n + '\u00a0' + unit('price.weeks', n);
          cards.forEach(function (c) { var e = c.w.querySelector('.t-wk-n span:last-child'); if (e) e.textContent = far; });
        };
        cards.forEach(function (c) {
          var b = c.w.querySelector('.t-wk b');
          c.w.style.setProperty('--wn', n);
          b.style.insetInlineStart = pc(c.m.weeks[0] / n);
          b.style.inlineSize = pc((c.m.weeks[1] - c.m.weeks[0]) / n);
        });
        ends();
        document.addEventListener('numidea:lang', ends);
        cards.forEach(function (c) {
          c.w.classList.add('vz-on');
          if (vzArm(c.w, function () { c.w.classList.add('vz-go'); })) armed.push(c.w);
        });
        vzOnce(armed, 0.9, function (el) { el.classList.add('vz-go'); });
      })();

      /* -- estimator: the live estimate as a dimension line over the three
         packages' price bands, on a logarithmic scale that holds every quote
         the estimator can give (worked out from PRICE_MODEL below: today
         90 000 to 2 700 000 DA, drawn from 72 000 to 2 970 000). It moves
         with the controls (transform transitions). The band of the package
         the chosen type belongs to is picked out — Studio's for a Vitrine the
         estimator quotes as Studio. The figures above are the statement and
         the status line. */
      (function () {
        var box = document.querySelector('#estimator .esc');
        if (!box || !est) return;
        /* The extremes: every type at its smallest size with nothing added,
           and at its largest with every option and the rush pace (a quote
           only grows with size, options and pace). */
        var all = Object.keys(PRICE_OPTS), qLo = Infinity, qHi = 0;
        Object.keys(PRICE_MODEL).forEach(function (k) {
          var m = PRICE_MODEL[k];
          qLo = Math.min(qLo, ESTIMATE.quote(k, m.min, [], false).lo);
          qHi = Math.max(qHi, ESTIMATE.quote(k, m.max, all, true).hi);
        });
        var V0 = qLo / 1.25, V1 = qHi * 1.1;
        var at = function (v) { return logAt(v, V0, V1); };
        var bar = box.querySelector('.esc-bar'), caps = box.querySelectorAll('.esc-cap');
        var bands = [].slice.call(box.querySelectorAll('.esc-band'));
        var names = [].slice.call(box.querySelectorAll('.esc-nm [data-tier]'));
        var span = {};
        bands.forEach(function (b) {
          var k = b.getAttribute('data-tier'), m = PRICE_MODEL[k];
          span[k] = [at(m.base[0]), at(m.base[1])];
          b.style.insetInlineStart = pc(span[k][0]);
          b.style.inlineSize = pc(span[k][1] - span[k][0]);
        });
        names.forEach(function (el) {
          var s = span[el.getAttribute('data-tier')];
          if (s) el.style.insetInlineStart = pc((s[0] + s[1]) / 2);
        });
        // held back, the line is a point at the estimate's middle; shown, it opens out
        var shown = true;
        var size = document.getElementById('est-size');
        var place = function () {
          var r = est.querySelector('input[name="est-type"]:checked');
          var key = r ? r.value : 'surmesure', m = PRICE_MODEL[key];
          var n = parseInt(size && size.value, 10) || m.def;
          var opts = [].map.call(est.querySelectorAll('input[data-opt]:checked'), function (c) { return c.getAttribute('data-opt'); });
          var pace = est.querySelector('input[name="est-pace"]:checked');
          var q = ESTIMATE.quote(key, n, opts, !!(pace && pace.value === 'rush'));
          var a = at(q.lo), z = at(q.hi), s = vzRtl() ? -1 : 1;
          if (!shown) a = z = (a + z) / 2;
          // a translate in % is a share of the element's own width, which is the track's
          bar.style.transform = 'translateX(' + (s * a * 100).toFixed(3) + '%) scaleX(' + Math.max(z - a, 0.002).toFixed(4) + ')';
          caps[0].style.transform = 'translateX(' + (s * a * 100).toFixed(3) + '%)';
          caps[1].style.transform = 'translateX(' + (s * z * 100).toFixed(3) + '%)';
          var tier = key === 'vitrine' && q.studio ? 'surmesure' : key;
          bands.forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-tier') === tier); });
          names.forEach(function (el) { el.classList.toggle('on', el.getAttribute('data-tier') === tier); });
        };
        var go = function () { shown = true; box.classList.add('vz-go'); place(); };
        shown = !vzArm(box, go);
        est.addEventListener('change', place);
        if (size) size.addEventListener('input', place);
        // Arabic mirrors the scale, and with it the sign of the move
        document.addEventListener('numidea:lang', place);
        place();
        box.classList.add('vz-on');
        if (!shown) vzOnce([box], 0.9, go);
      })();

      /* -- market: every range in the table as a bar on one logarithmic price
         scale (from 40 000 to 10 000 000 DA, widened if a figure ever falls
         outside; a € or $ range sits where it converts to at the official
         rate, FX), Numidea first and in the accent, the three markets in one
         neutral, and Numidea's range carried down through each group as a
         band: the point is where Numidea sits among them, for every kind of
         project. The bars never move with the currency (converting
         multiplies by a constant, which on a log scale only slides the
         labels); the gridlines and their labels do.
         It is built the first time the visitor opens the folded panel that
         holds it ("Comment on chiffre"): most visitors never do, so the
         page load pays nothing for it. The summary's click comes before the
         panel opens, so the chart is there in the first frame of the open
         panel; 'toggle' covers a panel opened another way (find in page),
         and an arrival on a fragment inside the panel builds it at once.
         MARKET and nlRange are declared in section 14 below, so even an
         open panel waits until the handler is done. */
      var drawMarket = function () {
        try {
          var fig = mkt && mkt.querySelector('.mkv'), plot = fig && fig.querySelector('.mkv-plot');
          if (!plot || !MARKET || typeof nlRange !== 'function') return;
          var TY = { vitrine: 'price.tyVitrine', surmesure: 'price.tyCustom', ecommerce: 'price.tyShop', app: 'price.tyApp', identite: 'price.tyBrand' };
          var LANES = [['nl', 'mk.colNl'], ['dz', 'mk.colDz'], ['fr', 'mk.colFr'], ['us', 'mk.colUs']];
          var rangeOf = function (row, lane) { return lane === 'nl' ? nlRange(row) : MARKET[row][lane]; };
          /* An open range ("+", no ceiling) is solid up to its stated top,
             like any other, then fades out over the next half of its value
             (top x OPEN): the fade says "and up", and eats nothing of the
             range the table states. */
          var V0 = 40000, V1 = 10000000, OPEN = 1.5;
          Object.keys(TY).forEach(function (row) {
            if (!MARKET[row]) return;
            LANES.forEach(function (ln) {
              var r = rangeOf(row, ln[0]), f = FX[NATIVE[ln[0]]];
              V0 = Math.min(V0, r[0] * f / 1.2);
              // an open range ("+") fades out past its top: room for the fade
              V1 = Math.max(V1, r[1] * f * (r[2] ? OPEN : 1.1));
            });
          });
          var at = function (dzd) { return logAt(dzd, V0, V1); };
          var el = function (tag, cls, key) {
            var e = document.createElement(tag);
            if (cls) e.className = cls;
            if (key) { e.setAttribute('data-i18n', key); e.textContent = t(key); }
            return e;
          };
          // the scale's labels, above the first group and again under the last
          var axes = ['', ' bot'].map(function (pos) {
            var ax = el('div', 'mkv-ax' + pos), u = el('span', 'mkv-unit'), tk = el('span', 'mkv-tk');
            ax.appendChild(u); ax.appendChild(tk);
            return { ax: ax, unit: u, tk: tk };
          });
          plot.appendChild(axes[0].ax);
          var grids = [], vals = [], lanes = [];
          Object.keys(TY).forEach(function (row, g) {
            if (!MARKET[row]) return;
            var box = el('div', 'mkv-g'), head = el('div', 'mkv-hd'), gl = el('span', 'mkv-gl');
            var nv = el('span', 'mkv-nv'), nr = nlRange(row);
            head.appendChild(el('span', 'mkv-ty', TY[row]));
            head.appendChild(nv);
            box.appendChild(head);
            box.appendChild(gl);
            // Numidea's range, carried down through the group's lanes
            var nb = el('b', 'mkv-nb');
            nb.style.insetInlineStart = pc(at(nr[0]));
            nb.style.inlineSize = pc(at(nr[1]) - at(nr[0]));
            grids.push({ gl: gl, nb: nb });
            LANES.forEach(function (ln, i) {
              var nl = ln[0] === 'nl', r = rangeOf(row, ln[0]);
              var from = NATIVE[ln[0]], lo = at(r[0] * FX[from]), hi = at(r[1] * FX[from]);
              var lane = el('div', 'mkv-ln' + (nl ? ' nl' : ''));
              var trk = el('span', 'mkv-trk'), bar = el('i', 'mkv-bar' + (r[2] ? ' open' : ''));
              lane.style.gridRow = String(i + 2);
              lane.appendChild(el('span', 'mkv-lab', ln[1]));
              bar.style.insetInlineStart = pc(lo);
              if (r[2]) {
                var tail = at(r[1] * FX[from] * OPEN);
                bar.style.inlineSize = pc(tail - lo);
                bar.style.setProperty('--solid', ((hi - lo) / (tail - lo) * 100).toFixed(2) + '%');
              } else bar.style.inlineSize = pc(Math.max(hi - lo, 0.008));
              bar.style.setProperty('--d', (g * 80 + i * 40) + 'ms');
              trk.appendChild(bar);
              lane.appendChild(trk);
              box.appendChild(lane);
              lanes.push(lane);
              vals.push({ r: r, from: from, row: row, lane: ln[1], head: nl ? nv : null, bar: bar });
            });
            plot.appendChild(box);
          });
          plot.appendChild(axes[1].ax);
          /* Tick labels in the chart's currency: 1, 2 and 5 times a power of
             ten, shortened the way each language shortens them (100 k with a
             no-break space, 100k, 100 ألف; the Arabic dual stands without
             its numeral). */
          var KM = [[1e6, 'mk.M'], [1e3, 'mk.k']];
          var label = function (v) {
            var lang = document.documentElement.getAttribute('lang') || DEFAULT_LANG;
            for (var i = 0; i < KM.length; i++) {
              if (v < KM[i][0]) continue;
              var n = v / KM[i][0], k = KM[i][1];
              if (lang === 'ar') return dual(n) ? unit(k, n) : n + ' ' + unit(k, n);
              return n + (lang === 'en' ? '' : ' ') + t(k);
            }
            return grp(v);
          };
          // the table's currency choice, or the page's when it shows each market's own
          var chartCur = function () {
            var sel = mkt.querySelector('input[name="mk-cur"]:checked');
            return sel && sel.value !== 'native' ? sel.value : CUR;
          };
          var text = function (o, c) {
            var lo = o.r[0], hi = o.r[1], ap = '';
            if (c !== o.from) { lo = tidy(lo * FX[o.from] / FX[c], c); hi = tidy(hi * FX[o.from] / FX[c], c); ap = '≈\u00a0'; }
            // a range is one unit, never split over two lines: no-break spaces throughout
            return ap + pre(c) + grp(lo) + dash() + grp(hi) + (o.r[2] ? '+' : '') + (post(c) ? ' ' + post(c) : '');
          };
          var render = function () {
            var c = chartCur(), ticks = [];
            for (var e = 1; e <= 8; e++) [1, 2, 5].forEach(function (m) {
              var v = m * Math.pow(10, e), p = (Math.log(v * FX[c]) - Math.log(V0)) / (Math.log(V1) - Math.log(V0));
              if (p > 0.015 && p < 0.985) ticks.push({ v: v, p: p, major: m === 1 });
            });
            axes.forEach(function (a) {
              a.unit.textContent = sym(c);
              a.tk.textContent = '';
              ticks.forEach(function (tk) {
                var s = el('span', tk.major ? 'mj' : 'mn');
                s.textContent = label(tk.v);
                s.style.insetInlineStart = pc(tk.p);
                a.tk.appendChild(s);
              });
            });
            grids.forEach(function (g) {
              g.gl.textContent = '';
              ticks.forEach(function (tk) {
                var s = el('i', tk.major ? 'mj' : 'mn');
                s.style.insetInlineStart = pc(tk.p);
                g.gl.appendChild(s);
              });
              g.gl.appendChild(g.nb);
            });
            // Numidea's own range is written out in each group's heading; the
            // markets' are one hover away, and all of them are in the table
            vals.forEach(function (o) { if (o.head) o.head.textContent = text(o, c); });
          };
          /* Hover (a mouse only; touch and keyboard read the table): the
             lane's range in its own currency and, converted, in the chart's.
             One floating label, pinned on its inline-start side and moved
             with a transform, so it never shifts the layout. */
          var tip = el('div', 'mkv-tip');
          plot.appendChild(tip);
          var show = function (i) {
            var o = vals[i], c = chartCur();
            tip.textContent = '';
            tip.appendChild(el('b', '')).textContent = t(TY[o.row]) + ' · ' + t(o.lane);
            tip.appendChild(el('span', '')).textContent = text(o, o.from);
            if (c !== o.from) tip.appendChild(el('span', '')).textContent = text(o, c);
            /* Centred over the bar, kept inside the plot: where its left edge
               should be, less where it already is. The label is pinned on its
               inline-start side (the plot's right edge in Arabic) so a new
               width never moves its start corner; offsetLeft reads that pinned
               place in either direction, untouched by the transform. */
            var pr = plot.getBoundingClientRect(), br = o.bar.getBoundingClientRect();
            var w = tip.offsetWidth, x = br.left + br.width / 2 - pr.left - w / 2;
            x = Math.max(0, Math.min(pr.width - w, x)) - tip.offsetLeft;
            tip.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(br.top - pr.top - tip.offsetHeight - 10) + 'px)';
            lanes.forEach(function (ln, k) { ln.classList.toggle('hl', k === i); });
            plot.classList.add('hov');
            tip.classList.add('on');
          };
          var hide = function () {
            tip.classList.remove('on');
            plot.classList.remove('hov');
            lanes.forEach(function (ln) { ln.classList.remove('hl'); });
          };
          lanes.forEach(function (ln, i) {
            ln.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') show(i); });
          });
          plot.addEventListener('pointerleave', hide);
          document.addEventListener('numidea:cur', render);
          document.addEventListener('numidea:lang', function () { hide(); render(); });
          mkt.addEventListener('change', function () { hide(); render(); });
          render();
          fig.hidden = false;
          if (vzArm(fig, function () { fig.classList.add('vz-go'); })) {
            vzOnce([plot], 0.15, function () { fig.classList.add('vz-go'); });
          }
        } catch (e2) { if (window.console && console.error) console.error(e2); }
      };
      Promise.resolve().then(function () {
        var fig = mkt && mkt.querySelector('.mkv'), shut = fig && fig.closest('details');
        if (!fig) return;
        /* The chart is 700-1000px tall and goes in above the table. Built in
           a panel that is already open on screen, it would push the table
           (and whatever the browser just scrolled to in it) down by that
           much: the table is held where it was. */
        var keep = function () {
          var below = mkt.querySelector('.mk-scroll'), t0 = below ? below.getBoundingClientRect().top : 0;
          drawMarket();
          var d = below ? below.getBoundingClientRect().top - t0 : 0;
          if (d > 0 && t0 < innerHeight) window.scrollBy({ top: d, behavior: 'instant' });
        };
        if (!shut || shut.open) { keep(); return; }
        /* Arriving on a fragment inside the folded panel (#mk-cap, or a
           #:~:text= link from a search result): the browser opens the panel
           itself and fixes where it will scroll at load, which can come
           before 'toggle' reaches this script; the chart, built then, landed
           between the start and the target and left the target a chart's
           height below the screen. So it is built now, before load. The text
           directive is not in location.hash; the navigation entry keeps it. */
        var arrival = '', tgt = null;
        try { arrival = performance.getEntriesByType('navigation')[0].name || ''; } catch (e3) {}
        try { tgt = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (e4) {}
        if ((tgt && shut.contains(tgt)) || arrival.indexOf(':~:') > -1) { drawMarket(); return; }
        // a summary click comes before the panel opens: the chart is simply
        // there in its first frame; any other opening (find in page) holds
        // the table in place
        var done = false;
        var once = function (ev) { if (!done) { done = true; if (ev && ev.type === 'toggle') keep(); else drawMarket(); } };
        var sum = shut.querySelector('summary');
        if (sum) sum.addEventListener('click', once);
        shut.addEventListener('toggle', once);
      });
    } catch (e) { if (window.console && console.error) console.error(e); }

    /* ---------------- 14 · market comparison ----------------
       Native figures live in the markup, so the table reads correctly with JS
       off. This converts them on request and computes the Numidea column from
       PRICE_MODEL — the table cannot quote a Numidea price the tier cards and
       the estimator disagree with.
       FX: Bank of Algeria official rate, early October 2026 (1 Oct: 1 € =
       151.06, 1 $ = 133.66; an independent page agreed within 0.3%). Rounded,
       because the comparison is about orders of magnitude, not centimes. */
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
        td.appendChild(document.createTextNode(approx + pre(to) + grp(lo) + dash() + grp(hi) + (range[2] ? '+' : '') + (post(to) ? ' ' : '')));
        var c = document.createElement('span'); c.className = 'cur'; c.textContent = post(to);
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
        // the French day rate, written as the page's language writes euros
        var dayEur = document.getElementById('mk-day-eur');
        if (dayEur) dayEur.textContent = pre('EUR') + grp(480) + dash() + grp(650) + (post('EUR') ? ' ' + post('EUR') : '');
        if (day) day.textContent = grp(tidy(480 * FX.EUR, 'DZD')) + dash() + grp(tidy(650 * FX.EUR, 'DZD')) + ' ' + t('price.cur');
      };
      // a visitor who chose € or $ for the prices sees the comparison in it too
      // and back: a switch to DA undoes what this set (the table and the
      // chart, which reads the same radio, would otherwise stay in € or $
      // under DA prices); a currency the visitor picked in the table stays.
      // Setting .checked from script fires no 'change', so the flag holds.
      var followed = false;
      var follow = function () {
        var r;
        if (CUR === 'DZD') {
          if (!followed) return;
          r = mkt.querySelector('input[name="mk-cur"][value="native"]');
          if (r) r.checked = true;
          followed = false;
          return;
        }
        r = mkt.querySelector('input[name="mk-cur"][value="' + CUR + '"]');
        if (r) { r.checked = true; followed = true; }
      };
      follow();
      document.addEventListener('numidea:cur', function () { follow(); renderMarket(); });
      mkt.addEventListener('change', function (e) {
        if (e.target && e.target.name === 'mk-cur') followed = false;
        renderMarket();
      });
      document.addEventListener('numidea:lang', renderMarket);
      renderMarket();
    }

    /* ---------- 15. illustrations and animated icons ----------
       Plates (.lz) only fetch their mask images once they come within a
       screen or so of the viewport — about 1MB of engraving would otherwise
       load with the first paint. Icons (.ai) draw themselves in once, the
       first time they are seen, and run their idle loop (.live) only while
       on screen, so off-screen icons cost nothing. */
    (function () {
      var lz = [].slice.call(document.querySelectorAll('.lz'));
      var ai = [].slice.call(document.querySelectorAll('.ai'));
      if (!('IntersectionObserver' in window)) {
        lz.forEach(function (el) { el.classList.add('lz-on'); });
        ai.forEach(function (el) { el.classList.add('on', 'live'); });
        [].forEach.call(document.querySelectorAll('.lv'), function (el) { el.classList.add('live'); });
        return;
      }
      var lio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('lz-on'); lio.unobserve(e.target); }
        });
      }, { rootMargin: '900px 0px' });
      lz.forEach(function (el) { lio.observe(el); });
      var aio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) e.target.classList.add('on');
          e.target.classList.toggle('live', e.isIntersecting);
        });
      }, { threshold: 0.35 });
      ai.forEach(function (el) { aio.observe(el); });
      // plates with motion (.lv) likewise only move while they are on screen
      var vio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { e.target.classList.toggle('live', e.isIntersecting); });
      }, { threshold: 0.15 });
      [].forEach.call(document.querySelectorAll('.lv'), function (el) { vio.observe(el); });
    })();


    /* ---------- 16. skeletons, wayfinding, back to top ---------- */
    // Skeleton: a picture's box shimmers until the picture has decoded. Only
    // images not yet complete get one, so cached loads never flash it.
    // The shimmer runs only while its box is on screen (.sk-run) and stops
    // for good once the picture is in. It animates a background, which the
    // compositor cannot take over, so every running copy cost a style
    // recalculation and a repaint per frame: traced on a phone (CPU 4x),
    // ~1,900 recalcs in fourteen swipes, nearly all for boxes off screen
    // whose 8 cycles had started with the page.
    var skio = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('sk-run', e.isIntersecting && !e.target.classList.contains('sk-done')); });
    }) : null;
    [].forEach.call(document.querySelectorAll('.proj .thumb img.shot, .plate img.pl, .fd-photo img'), function (img) {
      var box = img.closest('.thumb, .plate, .fd-photo'); if (!box || (img.complete && img.naturalWidth)) return;
      box.classList.add('sk');
      if (skio) skio.observe(box); else box.classList.add('sk-run');
      var done = function () { box.classList.add('sk-done'); box.classList.remove('sk-run'); if (skio) skio.unobserve(box); };
      img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true });
    });

    // Scroll-spy: the nav marks the section you are in (aria-current), and on
    // phones — where the links are folded into the menu — a breadcrumb names it.
    (function () {
      var links = [].slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
      var crumb = document.getElementById('crumb'), now = document.getElementById('crumbNow');
      var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
      var cur = -1, tops = [];
      // section tops are measured once (and on resize/reflow), never per
      // scroll frame: the scroll handler only compares numbers
      var measure = function () {
        var y = window.scrollY || window.pageYOffset || 0;
        tops = secs.map(function (el) { return el ? el.getBoundingClientRect().top + y : Infinity; });
      };
      // runs in a frame after the parallax has written its translates, so it
      // reads the cached position: reading scrollY here forced a style recalc
      var pick = function () {
        var line = scrollPos + viewH * 0.35, i = -1;
        for (var k = 0; k < tops.length; k++) { if (tops[k] <= line) i = k; }
        // the order of the links is the order of the page, so the last section
        // whose top has passed the reading line is the one being read
        if (i === cur) return; cur = i;
        links.forEach(function (a, k) { if (k === i) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
        if (crumb && now) { now.textContent = i >= 0 ? links[i].textContent : ''; crumb.classList.toggle('on', i >= 0); }
      };
      var tick = false;
      addEventListener('scroll', function () { if (tick) return; tick = true; requestAnimationFrame(function () { pick(); tick = false; }); }, { passive: true });
      var re = function () { scrollPos = window.scrollY || window.pageYOffset || 0; measure(); cur = -2; pick(); };
      document.addEventListener('numidea:lang', function () { setTimeout(re, 60); });
      addEventListener('resize', re); addEventListener('load', re);
      if ('ResizeObserver' in window) new ResizeObserver(re).observe(document.body);
      re();
    })();

    // Back to top: appears after a screen and a half of reading.
    (function () {
      var b = document.getElementById('toTop'); if (!b) return;
      var on = false;
      addEventListener('scroll', function () {
        var v = scrollPos > viewH * 1.5;
        if (v !== on) { on = v; b.classList.toggle('on', v); }
      }, { passive: true });
      b.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        var logo = document.querySelector('.navbar .logo'); if (logo) logo.focus({ preventScroll: true });
      });
    })();

    // The market table's frame is a keyboard stop (tabindex=0 in the markup,
    // so it can be scrolled from the keyboard) only while it actually
    // scrolls: where the whole table fits, it would be a Tab for nothing.
    (function () {
      var box = document.querySelector('.mk-scroll');
      if (!box || !('ResizeObserver' in window)) return;
      var fit = function () {
        if (!box.clientWidth) return;            // folded away: decide when shown
        if (box.scrollWidth > box.clientWidth + 1) box.setAttribute('tabindex', '0');
        else box.removeAttribute('tabindex');
      };
      var ro = new ResizeObserver(fit);
      ro.observe(box);
      if (box.firstElementChild) ro.observe(box.firstElementChild);
    })();

    /* Back/Forward can bring this page back from the browser's cache exactly
       as it was left, after the visitor chose another language (or theme, or
       currency) on another page. Take up the stored choice again, as a
       fresh load would. */
    window.addEventListener('pageshow', function (e) {
      // A plain Back (no cache) restores form controls after this script
      // ran: the currency radio could come back unchecked from what the
      // prices show. The prices are right; put the radio back in step.
      document.querySelectorAll('input[name="pr-cur"]').forEach(function (r) { r.checked = r.value === CUR; });
      if (!e.persisted) return;
      var l = null, th = null, c = null;
      try {
        l = localStorage.getItem('numidea-lang');
        th = localStorage.getItem('numidea-theme');
        c = localStorage.getItem('numidea-cur');
      } catch (x) {}
      if (SUPPORTED.indexOf(l) > -1 && l !== document.documentElement.getAttribute('lang')) switchLang(l);
      if (THEMES.indexOf(th) > -1 && th !== document.documentElement.getAttribute('data-theme')) applyTheme(th);
      if (CURS.indexOf(c) > -1 && c !== CUR) setCur(c);
    });

   } catch (e) {
    // Never let an init error leave content stuck behind scroll-reveal.
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('.lz').forEach(function (el) { el.classList.add('lz-on'); });
    document.querySelectorAll('.ai').forEach(function (el) { el.classList.add('on'); });
    if (window.console && console.error) console.error(e);
   }
  });
})();
