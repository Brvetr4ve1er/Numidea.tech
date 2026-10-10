# Numidea Labs : kit de prospection par e-mail (France) et plan LinkedIn

Document de travail pour Yasser Hamisse, fondateur de Numidea Labs. Cible : entreprises françaises immatriculées. Rédigé le 9 octobre 2026.

Tout ce qui est entre {{ }} est à remplacer avant usage. Les variables d'identité légale et de conformité ({{LEGAL_NAME}}, {{ANAE_NO}}, {{NIF}}, {{ADDRESS}}, {{PRIVACY_URL}}, {{EU_REP}}) ne doivent jamais être inventées. Tant qu'elles ne sont pas connues, aucun e-mail ne part.

---

## 0. Points bloquants : aucun e-mail avant que tout soit coché

- [ ] Immatriculation auto-entrepreneur obtenue : {{LEGAL_NAME}}, {{ANAE_NO}}, {{NIF}} et {{ADDRESS}} sont connus.
- [ ] Page de confidentialité en ligne, en français, à l'adresse {{PRIVACY_URL}} (contenu minimal en section 3.6).
- [ ] Représentant dans l'UE désigné ({{EU_REP}}), ou avis juridique écrit qui confirme l'exemption de l'art. 27.2 RGPD (section 7.1).
- [ ] Registre des traitements tenu (modèle simplifié de la CNIL), avec trois traitements : 1) prospection entre professionnels par e-mail ; 2) gestion des demandes entrantes (LinkedIn, WhatsApp, publicités) et devis ; 3) liste d'opposition. Détail en section 3.8.
- [ ] Avis obtenu côté algérien : formalités de la loi 18-07 modifiée et hébergement hors d'Algérie (section 7.2).
- [ ] Version française du site vérifiée ({{SITE}}?lang=fr&cur=eur) : textes en français, mêmes fourchettes HT avec « conversion approximative », identité de l'éditeur, aucun traceur non essentiel sans bandeau de consentement (pas de pixel Meta ni d'outil de mesure d'audience sans accord).
- [ ] Boîte professionnelle {{EMAIL}} sur le domaine du studio ({{DOMAINE_STUDIO}}), avec SPF, DKIM et DMARC valides (section 4.1). Aucun envoi depuis l'adresse Gmail personnelle.
- [ ] Échauffement de la boîte terminé (section 4.2).
- [ ] Fichiers `prospects-template.csv` et `suppression.csv` créés (sections 3.4 et 3.5).
- [ ] Compteur commun des Aperçus du mois (e-mail + LinkedIn + publicités Meta) en place : 4 au maximum.

Le plan LinkedIn (section 5) démarre en deux temps :
- **Tout de suite** : le profil et les posts qui n'invitent pas à vous écrire (P1, P2, P4, P5, P6, P7 et P9). Tant que {{EMAIL}} n'existe pas, aucune adresse électronique sur le profil ni dans les posts. Le lien {{SITE}} n'apparaît qu'une fois la version française du site vérifiée (point ci-dessus).
- **Seulement quand {{LEGAL_NAME}} et {{PRIVACY_URL}} existent** : les posts qui appellent à vous écrire « Aperçu » (P3 avec sa dernière ligne, P8, P10), le numéro WhatsApp sur le profil, et toute qualification d'une personne qui vous écrit (première réponse type en section 2.7).

Si quelqu'un vous écrit avant cette date, répondez-lui sans rien lui demander (ni SIRET, ni budget, ni coordonnées) et proposez-lui de reprendre l'échange plus tard.

---

## 1. Le cadre en un tableau

| Règle | Comment le kit l'applique |
|---|---|
| Prospection B2B par e-mail sans consentement préalable, si le message concerne la profession du destinataire (CNIL) | On écrit uniquement au dirigeant ou au contact général de l'entreprise, à propos du site web de l'entreprise. Jamais à compta@, rh@, etc. |
| Identité de l'expéditeur et objet en rapport avec l'offre (art. L34-5 du CPCE). Publicité identifiable comme telle (art. 20 LCEN) | Bloc « Expéditeur » dans chaque message. Objets qui annoncent clairement une proposition. |
| Information RGPD dès le premier message quand les données ne viennent pas de la personne (art. 14), au plus tard 1 mois après la collecte | Bloc « Vos données » + lien {{PRIVACY_URL}}. Premier envoi au plus tard 30 jours après la collecte, sinon la ligne est supprimée. |
| Source des données (art. 14.2.f) | Ligne « Source : contact professionnel trouvé sur votre site, page Mentions légales, le {{DATE}}. » |
| Information des personnes qui vous écrivent d'elles-mêmes (art. 13 RGPD) | Première réponse type avec responsable, finalité, lien {{PRIVACY_URL}} et STOP (section 2.7). Aucune qualification avant que {{LEGAL_NAME}} et {{PRIVACY_URL}} existent. |
| Représentant dans l'UE (art. 27 RGPD) | Désigné avant le premier envoi ({{EU_REP}}), cité dans chaque premier message et sur {{PRIVACY_URL}}, sauf avis juridique écrit qui confirme l'exemption (section 7.1). |
| Registre des traitements (art. 30 RGPD) | Tenu avant le premier envoi (section 3.8). |
| Opposition simple, gratuite, à tout moment (art. 21 RGPD) | « Répondez STOP » dans chaque message, et une liste d'opposition consultée avant chaque envoi. |
| Pas de pistage | Texte brut, envoi manuel, aucun pixel d'ouverture, aucun lien de suivi individuel, aucune pièce jointe. |
| Minimisation | Le fichier ne contient que ce qui sert à l'envoi (section 3.4) : ni téléphone, ni profil de réseau social. |
| Pas d'extraction automatique (LinkedIn, PagesJaunes) | Collecte à la main, sur le site de l'entreprise uniquement. |
| WhatsApp : jamais en premier | Le numéro {{WA}} figure dans l'e-mail, mais c'est toujours la personne qui ouvre la conversation. On honore STOP sur WhatsApp aussi. |
| Loi Toubon | Tout en français. Dans les messages envoyés : « adresse électronique », « appel vidéo », « commerce en ligne », « publication ». |

---

## 2. Les modèles

### 2.1 Variables (e-mails et LinkedIn)

| Variable | Contenu |
|---|---|
| {{SALUTATION}} | « Bonjour Madame Durand, » ou « Bonjour Monsieur Martin, » si l'adresse est nominative. « Bonjour, » si elle est générique (contact@…). |
| {{OBSERVATION}} | Première ligne personnalisée : un seul constat factuel, vu par vous (exemples sous chaque modèle). |
| {{ENTREPRISE}} | Nom de l'entreprise tel qu'affiché sur son site. |
| {{DOMAINE}} | Domaine du site du prospect. |
| {{ANNEE}} | Année réellement constatée sur le site du prospect (exemple d'observation A5). |
| {{DATE}} | Date de collecte de l'adresse (colonne `date_collecte`), écrite en toutes lettres : « 3 novembre 2026 ». |
| {{OBJET_EMAIL_1}} | Objet du premier message, repris pour la relance dans le même fil. |
| {{PRENOM}} | Prénom de la personne (note d'invitation LinkedIn, première réponse de la section 2.7). |
| {{SUJET}} | Sujet d'une publication LinkedIn que vous avez réellement lue (section 5.3). |
| {{PLACES_RESTANTES}} | Nombre réel d'Aperçus encore libres dans le mois, tous canaux confondus (P10). |
| {{ANNEE_ETUDE}}, {{LIEN_ETUDE}}, {{HT_OU_TTC}} | Année, lien et base de prix (HT ou TTC) de l'étude de La Fabrique du Net, relevés sur la source elle-même (P6). |
| {{SITE}}, {{WA}}, {{EMAIL}} | Site du studio, WhatsApp +213 672 41 25 78, boîte professionnelle. |
| {{DOMAINE_STUDIO}} | Domaine du studio, acheté pour la boîte professionnelle et le site (section 4.1). |
| {{LEGAL_NAME}}, {{ANAE_NO}}, {{NIF}}, {{ADDRESS}}, {{PRIVACY_URL}}, {{EU_REP}} | Identité légale et représentant dans l'UE. Ne jamais les inventer. |

Forme de tous les messages : texte brut (pas de HTML, pas d'image, pas de logo dans la signature), aucune pièce jointe, aucun raccourcisseur de liens, peu de liens, un seul destinataire par message, jamais de copie cachée groupée.

### 2.2 Modèle A : entreprise dont le site a des problèmes visibles

Objets possibles (en choisir un, sans « Re: » ni « Fwd: » au premier envoi) :
- `{{ENTREPRISE}} : une remarque sur votre site et une proposition`
- `Votre site {{DOMAINE}} : une remarque et une proposition`

Évitez « gratuit » et les majuscules dans l'objet, car ils déclenchent souvent les filtres anti-spam.

```text
Objet : {{ENTREPRISE}} : une remarque sur votre site et une proposition

{{SALUTATION}}

{{OBSERVATION}}

Je me permets de vous le signaler et de vous faire une proposition.

Je m'appelle Yasser Hamisse et je dirige Numidea Labs, un petit studio web installé à Bordj Bou Arréridj, en Algérie. Je conçois des sites et des applications web sur mesure, en français, en anglais et en arabe.

Je vous propose L'Aperçu : avant tout paiement, je construis la page d'accueil de votre nouveau site, fonctionnelle, avec vos propres contenus. Je vous la livre en 5 jours ouvrés après réception de ces contenus et je vous la présente lors d'un appel vidéo de 30 minutes. C'est gratuit et sans engagement : si vous dites non, vous ne devez rien.

Conditions : réservé aux entreprises immatriculées (numéro SIRET), 4 Aperçus au maximum par mois.

Pour situer les budgets : un site vitrine de 1 à 5 pages revient à environ 600 à 1 100 € HT (conversion approximative de mes tarifs au taux officiel de la Banque d'Algérie, début octobre 2026).

Si cela vous intéresse, répondez simplement « Aperçu » à ce message, ou écrivez-moi sur WhatsApp au {{WA}}.

Bien cordialement,

Yasser Hamisse
Fondateur, Numidea Labs
{{SITE}}?lang=fr&cur=eur

--
Expéditeur : {{LEGAL_NAME}}, auto-entrepreneur (marque : Numidea Labs)
Carte ANAE n° {{ANAE_NO}} · NIF {{NIF}}
Adresse : {{ADDRESS}}
Contact : {{EMAIL}} · WhatsApp {{WA}}

Pourquoi ce message : il concerne votre activité professionnelle (le site web de {{ENTREPRISE}}).
Source : contact professionnel trouvé sur votre site, page Mentions légales, le {{DATE}}.
Vos données : {{LEGAL_NAME}}, responsable du traitement, utilise votre adresse électronique professionnelle, vos nom et fonction s'ils figurent sur votre site, le nom et le site de votre entreprise ainsi que la remarque ci-dessus, uniquement pour vous proposer ses services (prospection entre professionnels, fondée sur son intérêt légitime). Elles ne sont ni vendues ni louées. Traitement réalisé depuis l'Algérie (hors Union européenne). Représentant dans l'UE : {{EU_REP}}. Sans réponse de votre part, elles sont supprimées au plus tard 12 mois après leur collecte.
Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et d'opposition, et pouvez adresser une réclamation à la CNIL (cnil.fr). Détails et exercice de vos droits : {{PRIVACY_URL}}
Pour ne plus recevoir de messages, répondez simplement STOP (sans frais).
```

Ne retirez la ligne « Représentant dans l'UE » que si un avis juridique écrit confirme l'exemption (section 7.1).

Exemples d'{{OBSERVATION}} pour le modèle A (à adapter à ce que vous avez réellement vu) :
1. « Sur mobile, le menu de {{DOMAINE}} ne s'ouvre pas : depuis mon téléphone, je n'ai pas réussi à atteindre votre page Contact. »
2. « En ouvrant {{DOMAINE}}, mon navigateur affiche « Non sécurisé » : le certificat HTTPS ne semble plus valide. »
3. « Sur votre page d'accueil, les liens « Nos services » et « Réalisations » mènent à une page d'erreur. »
4. « Sur téléphone, le texte de votre page d'accueil dépasse de l'écran : il faut faire défiler la page sur le côté pour le lire. »
5. « La rubrique Actualités de {{DOMAINE}} s'arrête en {{ANNEE}}. »

Règles pour l'observation :
- Un seul constat, que le destinataire peut vérifier en 30 secondes.
- Constaté par vous à la date de collecte, et vérifié à nouveau la veille de l'envoi.
- Ton neutre et courtois, jamais de jugement (« daté », « catastrophique »).
- Aucun chiffre que vous n'avez pas mesuré, aucune estimation de clients ou de chiffre d'affaires perdus.
- Aucune accusation juridique (RGPD, accessibilité, mentions légales).
- N'envoyez jamais de message test par leur formulaire pour « vérifier ».

### 2.3 Modèle B : entreprise sans vrai site

À utiliser seulement si le domaine affiche quand même une page Mentions légales (ou Contact) avec une adresse sur le domaine de l'entreprise. Sinon, la ligne Source serait fausse : on passe à l'entreprise suivante.

Objets possibles :
- `Un site pour {{ENTREPRISE}} : voir la page d'accueil avant de payer`
- `{{ENTREPRISE}} : voir votre future page d'accueil avant de payer`

```text
Objet : Un site pour {{ENTREPRISE}} : voir la page d'accueil avant de payer

{{SALUTATION}}

{{OBSERVATION}}

Si un site complet fait partie de vos projets, voici une façon simple de commencer.

Je m'appelle Yasser Hamisse et je dirige Numidea Labs, un petit studio web installé à Bordj Bou Arréridj, en Algérie. Je conçois des sites et des applications web sur mesure, en français, en anglais et en arabe.

Je vous propose L'Aperçu : avant tout paiement, je construis la page d'accueil de votre futur site, fonctionnelle, avec vos propres contenus (logo, textes, photos). Je vous la livre en 5 jours ouvrés après réception de ces contenus et je vous la présente lors d'un appel vidéo de 30 minutes. C'est gratuit et sans engagement : si vous dites non, vous ne devez rien.

Conditions : réservé aux entreprises immatriculées (numéro SIRET), 4 Aperçus au maximum par mois.

Repères de prix (hors taxes, conversions approximatives de mes tarifs au taux officiel de la Banque d'Algérie, début octobre 2026) :
- site vitrine de 1 à 5 pages (formule Essentiel) : environ 600 à 1 100 € HT ;
- site sur mesure de 6 à 15 pages (formule Studio) : environ 1 200 à 2 800 € HT.

Si cela vous intéresse, répondez simplement « Aperçu » à ce message, ou écrivez-moi sur WhatsApp au {{WA}}.

Bien cordialement,

Yasser Hamisse
Fondateur, Numidea Labs
{{SITE}}?lang=fr&cur=eur

--
Expéditeur : {{LEGAL_NAME}}, auto-entrepreneur (marque : Numidea Labs)
Carte ANAE n° {{ANAE_NO}} · NIF {{NIF}}
Adresse : {{ADDRESS}}
Contact : {{EMAIL}} · WhatsApp {{WA}}

Pourquoi ce message : il concerne votre activité professionnelle (la présence en ligne de {{ENTREPRISE}}).
Source : contact professionnel trouvé sur votre site, page Mentions légales, le {{DATE}}.
Vos données : {{LEGAL_NAME}}, responsable du traitement, utilise votre adresse électronique professionnelle, vos nom et fonction s'ils figurent sur votre site, le nom et le site de votre entreprise ainsi que la remarque ci-dessus, uniquement pour vous proposer ses services (prospection entre professionnels, fondée sur son intérêt légitime). Elles ne sont ni vendues ni louées. Traitement réalisé depuis l'Algérie (hors Union européenne). Représentant dans l'UE : {{EU_REP}}. Sans réponse de votre part, elles sont supprimées au plus tard 12 mois après leur collecte.
Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et d'opposition, et pouvez adresser une réclamation à la CNIL (cnil.fr). Détails et exercice de vos droits : {{PRIVACY_URL}}
Pour ne plus recevoir de messages, répondez simplement STOP (sans frais).
```

Exemples d'{{OBSERVATION}} pour le modèle B :
1. « En cherchant {{ENTREPRISE}}, je suis arrivé sur {{DOMAINE}}, qui affiche pour l'instant une page « Site en construction ». »
2. « Votre site {{DOMAINE}} tient aujourd'hui sur une seule page : vos coordonnées et vos mentions légales, mais pas encore vos services. »
3. « Sur {{DOMAINE}}, la page d'accueil reprend le modèle par défaut de l'outil de création de site, sans présentation de votre activité. »

Si l'adresse a été trouvée sur la page Contact et non sur les Mentions légales, remplacez « page Mentions légales » par « page Contact ». La ligne Source doit toujours être exacte. La ligne « Représentant dans l'UE » suit la même règle que pour le modèle A.

### 2.4 Relance unique (7 jours plus tard)

Une seule relance, envoyée dans le même fil, uniquement en l'absence de réponse et de STOP. Ensuite, on n'écrit plus. Un message d'absence automatique n'est pas une réponse.

```text
Objet : Re: {{OBJET_EMAIL_1}}

{{SALUTATION}}

Je me permets une seule relance au sujet de L'Aperçu ; ensuite, je ne vous écrirai plus.

Pour juger sur pièces, voici deux projets livrés et en ligne :
- Bordj Steel, site interentreprises d'une société algérienne d'acier de construction (catalogue, références, carrières) : https://bordjsteelb2b.netlify.app
- Alliance Travel, marque, tunnel de conversion et site d'une agence de voyages de Bordj Bou Arréridj : https://alliancetravel34.netlify.app

La proposition tient toujours : la page d'accueil de votre nouveau site, fonctionnelle et construite avec vos contenus, livrée en 5 jours ouvrés après leur réception et présentée en 30 minutes d'appel vidéo. Gratuit et sans engagement. Réservé aux entreprises immatriculées (SIRET), 4 par mois au maximum.

Une réponse « Aperçu » suffit. Sinon, je n'insiste pas : ce message est le dernier.

Bien cordialement,

Yasser Hamisse
Numidea Labs

--
Expéditeur : {{LEGAL_NAME}}, auto-entrepreneur (marque : Numidea Labs) · Carte ANAE n° {{ANAE_NO}} · NIF {{NIF}} · {{ADDRESS}} · {{EMAIL}}
Source : contact professionnel trouvé sur votre site, page Mentions légales, le {{DATE}}. Vos données et vos droits : {{PRIVACY_URL}}
Pour ne plus recevoir de messages, répondez simplement STOP (sans frais).
```

Si un test d'envoi montre que la relance arrive en indésirables, retirez les deux liens et proposez de les envoyer sur demande.

### 2.5 Confirmation après STOP

Traitez comme un STOP toute réponse qui refuse le contact : « STOP », « non merci », « désinscription », « ne plus me contacter », ou une réponse agacée. Faites-le dans la journée, et annulez la relance prévue.

```text
Objet : Re: {{OBJET_EMAIL_1}}

Bonjour,

C'est noté : vous ne recevrez plus aucun message de Numidea Labs.

Vos données de prospection (nom, entreprise, remarque sur votre site) sont supprimées. Seule votre adresse électronique est conservée, pendant 3 ans, dans la liste d'opposition de Numidea Labs, qui sert uniquement à ne plus vous écrire.

Toutes mes excuses pour le dérangement.

Yasser Hamisse
{{LEGAL_NAME}} (Numidea Labs) · {{EMAIL}}
```

Pas de lien, pas d'offre, pas de « dernière chance ». Si la personne demande aussi l'effacement de l'adresse, effacez-la, en lui expliquant d'abord qu'elle ne pourra plus être filtrée.

### 2.6 Quand la personne répond « Aperçu » : qualification

```text
Objet : Re: {{OBJET_EMAIL_1}}

Merci pour votre réponse ! Pour préparer votre Aperçu, j'ai besoin de quatre précisions :

1. Le numéro SIRET de votre entreprise ;
2. Votre projet : création ou refonte, et combien de pages environ ;
3. Votre budget indicatif. Pour repère (conversions approximatives au taux officiel de la Banque d'Algérie, début octobre 2026) : site vitrine de 1 à 5 pages, environ 600 à 1 100 € HT ; site sur mesure de 6 à 15 pages, environ 1 200 à 2 800 € HT ; application web, environ 3 000 à 7 900 € HT ; maintenance, environ 120 à 400 € HT par mois ;
4. Le moment où vous souhaitez décider.

Ces informations servent uniquement à préparer votre Aperçu et votre devis. Responsable : {{LEGAL_NAME}} (Numidea Labs). Vos droits : {{PRIVACY_URL}}.

Ensuite, je vous propose un créneau pour la présentation (l'Algérie est actuellement à la même heure que Paris) et je vous indique les contenus à m'envoyer : logo, textes, photos. Je vous livre votre Aperçu 5 jours ouvrés après leur réception.

Pour information, si nous travaillons ensemble : la facture est émise depuis l'Algérie, sans TVA française, avec la mention « Autoliquidation » (vous autoliquidez la TVA).

Bien cordialement,
Yasser Hamisse
```

La parenthèse « l'Algérie est actuellement à la même heure que Paris » est vraie du 25 octobre 2026 à la fin mars 2027. En été, écrivez plutôt « l'Algérie a actuellement une heure de moins que Paris ».

| Critère de lead qualifié | Question | Qualifié si |
|---|---|---|
| Entreprise immatriculée | Numéro SIRET | SIRET actif, vérifié sur l'Annuaire des Entreprises |
| Besoin d'un site | Création ou refonte, nombre de pages | Projet de site réel |
| Budget | Budget envisagé | Au moins le plancher Essentiel, soit environ 600 € HT |
| Délai | Date de décision | Dans les 3 mois |

Un lead est qualifié seulement si les quatre critères sont remplis. Notez son origine : EMAIL-A, EMAIL-B ou LI. Les leads issus des publicités gardent leur code FR-1, FR-2 ou FR-3.

Les 4 places du mois sont communes à tous les canaux. Quand elles sont prises, proposez honnêtement le mois suivant.

Ne commencez jamais un Aperçu avant d'avoir l'accord écrit, le SIRET vérifié et les contenus reçus. N'utilisez jamais le logo ou les textes d'une entreprise sans son accord.

### 2.7 Première réponse à une personne qui vous écrit (LinkedIn, WhatsApp)

À envoyer à toute personne qui vous écrit d'elle-même en français : message privé LinkedIn, ou conversation WhatsApp ouverte depuis le site, le profil ou une publicité (codes FR-1, FR-2, FR-3). Utilisez ce modèle seulement quand {{LEGAL_NAME}} et {{PRIVACY_URL}} existent. Avant, répondez sans rien demander (section 0).

```text
Bonjour {{PRENOM}},

Merci pour votre message !

Vos données (nom, entreprise, projet) servent uniquement à préparer votre Aperçu et votre devis. Responsable : {{LEGAL_NAME}} (Numidea Labs). Vos droits : {{PRIVACY_URL}}. Répondez STOP pour ne plus recevoir de messages de ma part.

Pour préparer votre Aperçu, j'ai besoin de quatre précisions :
1. le numéro SIRET de votre entreprise ;
2. votre projet : création ou refonte, et combien de pages environ ;
3. votre budget indicatif (site vitrine de 1 à 5 pages : environ 600 à 1 100 € HT ; site sur mesure de 6 à 15 pages : environ 1 200 à 2 800 € HT ; application web : environ 3 000 à 7 900 € HT ; conversions approximatives au taux officiel de la Banque d'Algérie, début octobre 2026) ;
4. le moment où vous souhaitez décider.

Yasser Hamisse, Numidea Labs
```

Notez l'origine du lead (LI, ou le code de la publicité) et appliquez les critères de la section 2.6. Un STOP reçu sur LinkedIn ou WhatsApp va dans `suppression.csv` (canal LinkedIn ou WhatsApp), et vous n'écrivez plus.

### 2.8 Demandes d'exercice des droits

- Toute demande d'accès, de rectification, d'effacement ou d'opposition reçoit une réponse au plus tard sous un mois (art. 12 RGPD). En pratique, visez 72 heures.
- **Accès** : envoyez les champs du fichier qui concernent la personne, avec la source, la date de collecte et la finalité.
- **Effacement** : supprimez la ligne. L'adresse reste dans `suppression.csv`, sauf si la personne demande aussi son effacement.
- **Redirection vers un collègue** (« écrivez plutôt à Paul ») : votre premier message à Paul contient le même bloc d'information, avec la source exacte (« adresse transmise par Madame X, le {{DATE}} »).

---

## 3. Constituer la liste de prospects légalement

### 3.1 Cible

- Entreprises françaises immatriculées (TPE et PME) :
  - dont le site a un problème visible (modèle A) ;
  - ou qui n'ont pas de vrai site (modèle B).
- Secteurs à privilégier, parce qu'ils correspondent aux projets livrés :
  - industrie, métallerie et construction (Bordj Steel) ;
  - voyage et tourisme (Alliance Travel) ;
  - entreprises qui s'adressent aussi à une clientèle anglophone ou arabophone (sites FR/EN/AR, y compris de droite à gauche).
- Hors cible : administrations et collectivités, associations, particuliers.

### 3.2 Sources

**Autorisées :**
1. **Repérage manuel** : un moteur de recherche ou une carte, par secteur et par ville, pour trouver le site d'une entreprise. On ne recopie rien depuis les pages de résultats.
2. **Le site de l'entreprise, page Mentions légales.** On y relève la raison sociale, le SIRET, le numéro de TVA, l'adresse électronique et le nom du responsable. À défaut, la page Contact, et la ligne Source le précise.
3. **L'Annuaire des Entreprises** (annuaire-entreprises.data.gouv.fr), pour vérifier seulement :
   - que le SIRET est actif ;
   - le numéro de TVA intracommunautaire ;
   - le statut de diffusion.

   On n'y collecte pas d'adresse.

**Interdites :**
- extraction ou copie de données LinkedIn, PagesJaunes ou d'autres annuaires ;
- fichiers achetés ou loués ;
- outils qui « trouvent » ou devinent des adresses (prenom.nom@…), et extensions qui extraient des adresses d'une page ;
- adresses trouvées sur des profils personnels de réseaux sociaux ;
- numéros de téléphone (on n'en relève aucun) ;
- tout premier contact par WhatsApp.

### 3.3 Filtres : on garde une entreprise seulement si tout est vrai

- [ ] Entreprise française, SIRET actif. Si la fiche indique une diffusion partielle ou « non diffusible », on passe.
- [ ] Adresse sur le domaine de l'entreprise (contact@entreprise.fr, prenom@entreprise.fr). On saute les adresses d'apparence personnelle, même publiées dans les Mentions légales : gmail.com, orange.fr, wanadoo.fr, free.fr, sfr.fr, laposte.net, hotmail.fr, outlook.fr, live.fr, yahoo.fr, icloud.com.
- [ ] Destinataire pertinent : adresse générale (contact@, info@, direction@) ou adresse nominative du dirigeant ou du responsable de la communication.
- [ ] Préférence aux entreprises qui affichent un numéro de TVA intracommunautaire (FR + 11 caractères). Il confirme une entreprise établie et assujettie, ce qui simplifie la facture avec la mention « Autoliquidation ».
- [ ] Besoin visible (modèle A ou B), noté en une phrase.
- [ ] Absente de `suppression.csv` et jamais contactée auparavant.
- [ ] Le site ne refuse pas publiquement le démarchage (« pas de sollicitation commerciale »).
- [ ] Une seule adresse par entreprise.
- [ ] Premier envoi prévu au plus tard 30 jours après la collecte. Collectez chaque semaine seulement ce que vous enverrez dans les deux semaines.

### 3.4 `prospects-template.csv`

```csv
prospect_id,date_collecte,entreprise,siret,siret_verifie_le,tva_intracom,domaine,email,type_email,prenom,nom,fonction,page_source,url_source,secteur,ville,modele,observation,observation_verifiee_le,date_email_1,date_relance,reponse,date_reponse,immatriculee,besoin_site,budget_ok,decision_3_mois,qualifie,apercu,suppression_prevue,notes
```

| Colonne | Contenu et règle |
|---|---|
| prospect_id | P-0001, P-0002… |
| date_collecte | AAAA-MM-JJ. C'est la date reprise dans {{DATE}}. |
| entreprise, domaine | Tels qu'affichés sur le site |
| siret, siret_verifie_le | 14 chiffres, vérifiés sur l'Annuaire des Entreprises, avec la date de vérification |
| tva_intracom | FR… ou vide |
| email | Adresse sur le domaine de l'entreprise uniquement |
| type_email | générique / nominatif |
| prenom, nom, fonction | Seulement s'ils sont publiés sur le site et utiles pour la salutation (gérant, directeur de la publication…) |
| page_source, url_source | « Mentions légales » ou « Contact », et l'URL exacte de la page |
| secteur, ville | Pour cibler et trier |
| modele | A (site avec problème visible) ou B (pas de vrai site) |
| observation, observation_verifiee_le | Le texte exact de {{OBSERVATION}}, et la date de la dernière vérification |
| date_email_1, date_relance | La relance a lieu 7 jours après le premier envoi, seulement sans réponse |
| reponse, date_reponse | aucune / intéressé / pas intéressé / STOP / droits / adresse invalide |
| immatriculee, besoin_site, budget_ok, decision_3_mois, qualifie | oui / non. Qualifié = 4 fois « oui ». |
| apercu | proposé / planifié / livré / refusé |
| suppression_prevue | Sans réponse : date_collecte + 12 mois au plus tard. Si la personne a répondu : 3 ans après son dernier message. |
| notes | Rien de personnel ou de sensible |

Le fichier est conservé sur un compte protégé par la double authentification. Il n'est partagé avec personne.

### 3.5 `suppression.csv` (liste d'opposition)

```csv
email_ou_domaine,date_opposition,canal,motif
```

- `canal` : email / WhatsApp / LinkedIn.
- `motif` : STOP / refus / effacement.
- Vous pouvez inscrire le domaine entier si l'entreprise demande qu'on ne la contacte plus.
- Consultez cette liste avant chaque collecte et avant chaque envoi.
- Chaque ligne est conservée 3 ans après la dernière opposition, puis supprimée.
- Une adresse invalide (rebond définitif) est supprimée du fichier prospects. Elle ne va pas dans cette liste.

### 3.6 Ce que doit contenir la page {{PRIVACY_URL}} (en français)

- Identité et coordonnées du responsable : {{LEGAL_NAME}}, auto-entrepreneur (marque : Numidea Labs), {{ADDRESS}}, {{EMAIL}}.
- Représentant dans l'UE : {{EU_REP}}. À retirer seulement si un avis juridique écrit confirme l'exemption de l'art. 27.2 (section 7.1).
- Finalités et bases légales :
  - prospection entre professionnels, fondée sur l'intérêt légitime. Intérêt légitime poursuivi : développer la clientèle de Numidea Labs auprès des entreprises ;
  - réponse aux demandes (e-mail, LinkedIn, WhatsApp, publicités) et préparation des devis, fondée sur les mesures précontractuelles prises à la demande de la personne.
- Catégories de données et sources :
  - prospection : les données de la section 3.4, issues des coordonnées professionnelles publiées sur le site de l'entreprise ;
  - demandes entrantes : les informations que la personne transmet elle-même (nom, entreprise, SIRET, projet, budget, délai de décision).
- Destinataires et sous-traitants : fournisseur de messagerie, hébergeur, ainsi que LinkedIn et WhatsApp pour les échanges qui y ont lieu. Aucune vente ni location.
- Lieu du traitement : Algérie, hors Union européenne. Préciser aussi le pays des fournisseurs.
- Durées de conservation :
  - prospects sans réponse : 12 mois au plus après la collecte ;
  - prospects ayant répondu : 3 ans après le dernier contact venant de leur part ;
  - clients : durée de la relation, puis durées comptables légales ;
  - liste d'opposition : 3 ans, durée renouvelée à chaque nouvelle opposition.
- Droits : accès, rectification, effacement, limitation, opposition. Comment les exercer, délai d'un mois, droit de réclamation auprès de la CNIL.

### 3.7 Purge

Une fois par mois :
- supprimez les lignes arrivées à `suppression_prevue` ;
- supprimez les lignes non envoyées 30 jours après leur collecte ;
- supprimez de `suppression.csv` les lignes dont la dernière opposition date de plus de 3 ans ;
- supprimez les messages correspondants du dossier Envoyés.

### 3.8 Registre des traitements

À tenir avant le premier envoi (le modèle simplifié de la CNIL suffit), et à mettre à jour à chaque changement d'outil ou de fournisseur. Trois traitements :
1. prospection entre professionnels par e-mail ;
2. gestion des demandes entrantes (LinkedIn, WhatsApp, publicités) et devis ;
3. liste d'opposition.

Pour chacun, notez :
- la finalité et la base légale ;
- les catégories de données et leur source ;
- les destinataires et sous-traitants, avec leur pays ;
- les durées de conservation (section 3.6) ;
- les mesures de sécurité (double authentification, fichier partagé avec personne).

---

## 4. Règles d'envoi

### 4.1 Domaine et DNS

- Envoyez depuis {{EMAIL}}, sur le domaine du studio ({{DOMAINE_STUDIO}}), avec le site accessible sur ce même domaine. Achetez-le dès maintenant : plus un domaine est ancien au moment des premiers envois, mieux c'est.
- **SPF** : un seul enregistrement TXT sur {{DOMAINE_STUDIO}}, `v=spf1 include:<valeur donnée par votre fournisseur> -all`. Utilisez `~all` pendant les tests.
- **DKIM** : activez la signature dans la console du fournisseur de messagerie et publiez la clé (2 048 bits si possible).
- **DMARC** : enregistrement TXT sur `_dmarc.{{DOMAINE_STUDIO}}`, `v=DMARC1; p=none; rua=mailto:{{EMAIL}}`. Après 2 à 4 semaines de rapports propres, passez à `p=quarantine`.
- **Test** : envoyez-vous un message sur une boîte Gmail et une boîte Outlook. Dans « Afficher l'original », vous devez lire `spf=pass`, `dkim=pass` et `dmarc=pass`.

### 4.2 Échauffement (à la main, sans service automatique de faux échanges)

J0 est le jour où le domaine, la boîte, l'identité légale et la page de confidentialité sont prêts.

| Période | Ce qu'on envoie |
|---|---|
| J0 à J+13 | Aucun message de prospection. Uniquement des échanges réels : 5 à 15 messages par jour à des personnes qui vous connaissent et vous répondent (contacts, fournisseurs, partenaires). |
| J+14 à J+20 | 5 premiers messages de prospection, aux meilleurs prospects |
| J+21 à J+27 | 10 à 15 messages |
| À partir de J+28 | 20 à 30 messages par semaine, relances comprises |

Exemple : si J0 tombe le lundi 19 octobre, les premiers envois partent le mardi 3 novembre. La semaine de la campagne Meta (9 au 15 novembre), on envoie 10 à 15 messages, le mardi 10 et le jeudi 12 novembre (le mercredi 11 novembre est férié en France). Le rythme plein commence la semaine du 16 novembre. Si J0 arrive plus tard, tout se décale d'autant.

### 4.3 Volume et rythme

- 20 à 30 envois par semaine au total, relances comprises, du mardi au jeudi : 7 à 10 par jour, jamais plus de 10.
- Entre 8 h 30 et 11 h, heure de Paris. Jusqu'au 24 octobre, 8 h 30 à Paris correspond à 7 h 30 en Algérie ; à partir du 25 octobre, l'heure est la même.
- Pas d'envoi les jours fériés français.
- Exemple de semaine type :
  - lundi : repérage et vérification de 10 à 15 entreprises (environ 1 h 30) ;
  - mardi à jeudi : 7 à 10 envois par jour, un par un, à la main ;
  - relances le même jour de la semaine suivante.
- Pas d'outil d'envoi en masse. Si un outil est utilisé un jour, le suivi des ouvertures et des clics doit être désactivé.

### 4.4 Contenu

- Texte brut, sans image ni pièce jointe.
- Liens complets, jamais raccourcis. Aucun paramètre propre à un destinataire : `?lang=fr&cur=eur` est identique pour tout le monde.
- Objet honnête, en rapport avec la proposition. Jamais de faux « Re: » au premier envoi.
- Le bloc Expéditeur, la ligne Source, le lien {{PRIVACY_URL}} et « répondez STOP » figurent dans chaque message de prospection (premier envoi et relance).

### 4.5 Réponses

- Répondez dans la journée.
- STOP et refus : confirmation (section 2.5) le jour même, inscription dans `suppression.csv`, relance annulée.
- Intéressé : envoyez la qualification (section 2.6), puis notez le lead et son origine.

### 4.6 Surveillance et arrêt

À chaque fin de semaine, comptez dans le fichier :
- les envois ;
- les rebonds ;
- les réponses, dont les STOP ;
- les leads qualifiés ;
- les Aperçus réservés.

Mettez les envois en pause et vérifiez la liste et la configuration DNS dans ces cas :
- plus de 3 % de rebonds dans la semaine ;
- un message de test classé en indésirables ;
- une plainte pour spam ;
- un taux de STOP inhabituel.

Vos premiers envois de la semaine finissent en indésirables ? Revenez à l'étape précédente de l'échauffement.

---

## 5. Plan LinkedIn du fondateur (4 semaines, en français)

### 5.1 Règles

- Tout se fait à la main. Interdits :
  - invitations ou messages automatiques ;
  - extensions qui extraient des profils ;
  - groupes d'engagement (« pods ») ;
  - achat d'abonnés ou de réactions ;
  - commentaires générés et postés automatiquement.

  La programmation d'un post avec l'outil natif de LinkedIn reste acceptable.
- 2 à 3 posts par semaine, à 8 h 30 heure de Paris. Le lien vers le site ou un projet va en premier commentaire.
- Les visuels sont des captures réelles des sites en ligne. Glaive Store porte toujours la mention « démo de portfolio, pas un client », sur l'image comme dans le texte.
- Aucune donnée LinkedIn ne va dans le fichier de prospects (modèle `prospects-template.csv`). Si quelqu'un vous écrit ou vous donne son adresse dans une conversation, c'est une demande entrante : répondez avec la section 2.7 et notez-la dans le suivi des leads.
- Pas de message commercial à une personne qui vient d'accepter votre invitation. Vous parlez de L'Aperçu seulement si elle exprime un besoin ou écrit « Aperçu ».
- Répondez à chaque commentaire dans la journée. Chaque jour ouvré, passez 15 à 20 minutes à écrire des commentaires utiles sous les posts de dirigeants de votre cible.

### 5.2 Semaine 0 (12 au 18 octobre) : profil

- **Photo** : une vraie photo de Yasser.
- **Bannière** : « Voyez votre nouveau site avant de payer : L'Aperçu ».
- **Lieu** : Bordj Bou Arréridj, Algérie.
- **Titre** : « Fondateur de Numidea Labs · Sites et applications web sur mesure en français, anglais et arabe · L'Aperçu : votre page d'accueil avant tout paiement ».
- **Infos (texte à coller)** :

```text
Je suis Yasser Hamisse, fondateur de Numidea Labs, un petit studio web installé à Bordj Bou Arréridj, en Algérie.

Je conçois des sites vitrines, des sites sur mesure et des applications web, en français, en anglais et en arabe (y compris en mise en page de droite à gauche).

Pour démarrer, je propose L'Aperçu : avant tout paiement, je construis la page d'accueil de votre nouveau site, avec vos contenus, je vous la livre en 5 jours ouvrés après leur réception et je vous la présente lors d'un appel vidéo de 30 minutes. Gratuit et sans engagement. Réservé aux entreprises immatriculées (SIRET), 4 par mois au maximum.

Projets en ligne : Bordj Steel (site interentreprises d'une société d'acier de construction) et Alliance Travel (marque, tunnel de conversion et site d'une agence de voyages). Glaive Store est une démo de portfolio, pas un projet client.

Site : {{SITE}}?lang=fr&cur=eur
```

  Ajouts au texte, à faire plus tard :
  - quand {{LEGAL_NAME}} et {{PRIVACY_URL}} existent : « Pour demander votre Aperçu : WhatsApp {{WA}} » ;
  - quand la boîte professionnelle existe : « {{EMAIL}} ».
- **Sélection (« Featured »)** :
  - Bordj Steel ;
  - Alliance Travel ;
  - Glaive Store, intitulé « Démo de portfolio (pas un client) ».
- **Coordonnées** :
  - {{SITE}}, une fois la version française vérifiée ;
  - WhatsApp {{WA}}, quand {{PRIVACY_URL}} est en ligne ;
  - {{EMAIL}}, quand la boîte existe.

  Jamais l'adresse personnelle.

### 5.3 Invitations, à la main

- **Cible** : dirigeants et gérants de TPE et PME en France, dans les secteurs de la section 3.1.
- **Volume** :
  - S1 : 5 par jour ouvré ;
  - S2 à S4 : jusqu'à 10 par jour ouvré, rarement plus de 50 par semaine.

  Respectez toujours les limites affichées par LinkedIn.
- **Note d'invitation** (moins de 200 caractères, sans proposition commerciale). Les comptes gratuits ont peu de notes personnalisées par mois : gardez-les pour les meilleurs profils. Utilisez la première note seulement si vous avez réellement lu la publication. Sinon, utilisez la note neutre.

```text
Bonjour {{PRENOM}}, votre publication sur {{SUJET}} m'a intéressé. Je suis Yasser, je crée des sites web (français, anglais, arabe) chez Numidea Labs. Au plaisir d'échanger ici.
```

```text
Bonjour {{PRENOM}}, je suis Yasser, je crée des sites web en français, anglais et arabe chez Numidea Labs. Au plaisir d'échanger ici.
```

### 5.4 Calendrier

En S1, 8 h 30 heure de Paris correspond à 7 h 30 heure d'Algérie. À partir de S2, les deux heures sont identiques.

| Semaine | Dates | Posts |
|---|---|---|
| S1 | 19 au 25 oct. | mar. 20 : P1 Présentation · jeu. 22 : P2 Bordj Steel |
| S2 | 26 oct. au 1er nov. | mar. 27 : P3 L'Aperçu* · mer. 28 : P4 L'arabe, de droite à gauche · jeu. 29 : P5 Alliance Travel |
| S3 | 2 au 8 nov. | mar. 3 : P6 Mes prix · jeu. 5 : P7 Glaive Store (démo) |
| S4 (campagne Meta) | 9 au 15 nov. | mar. 10 : P8 Ce qu'il me faut pour un Aperçu* · jeu. 12 : P9 Travailler avec un studio en Algérie · ven. 13 : P10 Places de novembre*. Rien le mer. 11 (férié). |

\* Ces posts invitent à vous écrire. Publiez-les seulement si {{LEGAL_NAME}} et {{PRIVACY_URL}} existent à leur date. Sinon :
- publiez P3 sans sa dernière ligne ;
- reportez P8 ;
- ne publiez P10 que s'il reste réellement des places dans le mois en cours.

### 5.5 Les 10 posts

**P1 · mar. 20 oct. · Présentation.** Visuel : vraie photo de Yasser au travail.

```text
Je crée des sites web depuis Bordj Bou Arréridj, en Algérie.
En français, en anglais et en arabe, y compris de droite à gauche.

Je m'appelle Yasser Hamisse, j'ai fondé Numidea Labs, un petit studio web.

Ce que je construis :
→ des sites vitrines (1 à 5 pages)
→ des sites sur mesure (6 à 15 pages)
→ des applications web

Dans les semaines qui viennent, je partagerai ici des projets réels et en ligne, mes fourchettes de prix et une façon de travailler un peu différente : vous montrer la page d'accueil de votre futur site avant tout paiement.

Vous dirigez une entreprise et votre site ne vous ressemble plus ? Suivez-moi : la suite jeudi.
```

**P2 · jeu. 22 oct. · Bordj Steel (concept 2).**
- Visuel : carrousel de captures réelles (accueil, catalogue, références, carrières), sur ordinateur et sur mobile.
- Premier commentaire : `https://bordjsteelb2b.netlify.app`

```text
Un site industriel n'a pas besoin d'être austère pour être sérieux.

Voici Bordj Steel : le site interentreprises (B2B) d'une société algérienne d'acier de construction.

Trois publics, trois rubriques :
1. Les acheteurs → un catalogue des produits.
2. Les donneurs d'ordre → les références de l'entreprise.
3. Les candidats → une page carrières.

Le site est en ligne : lien en premier commentaire.

Question aux industriels qui me lisent : que cherchent vos clients en premier quand ils arrivent sur votre site ?
```

**P3 · mar. 27 oct. · L'Aperçu (concept 1).** Visuel : « Voyez votre nouveau site avant de payer », avec un téléphone qui affiche la page d'accueil du site du studio. Si vous montrez plutôt un projet client, légendez-le « Exemple : page d'accueil livrée pour Bordj Steel (projet client) ». Si Glaive Store apparaît, légende « démo de portfolio, pas un client ».

```text
Choisir un prestataire web sur la seule base d'un devis, c'est payer pour une promesse.
Je préfère vous montrer d'abord votre page d'accueil.

C'est le principe de L'Aperçu :
→ avant tout paiement, je construis la page d'accueil de votre nouveau site ;
→ elle fonctionne vraiment, avec vos propres contenus ;
→ je vous la livre en 5 jours ouvrés après réception de ces contenus ;
→ je vous la présente lors d'un appel vidéo de 30 minutes.

Si vous dites non, vous ne devez rien. C'est gratuit et sans engagement.

Deux conditions :
• être une entreprise immatriculée (SIRET) ;
• je n'en réalise que 4 par mois.

Envie de voir la page d'accueil de votre futur site ? Écrivez-moi « Aperçu » en message privé.
```

**P4 · mer. 28 oct. · L'arabe, de droite à gauche.** Visuel : la page d'accueil de {{SITE}} en version française (?lang=fr) et en version arabe (?lang=ar), côte à côte.

```text
Traduire un site en arabe ne suffit pas : il faut aussi inverser sa mise en page.

L'arabe se lit de droite à gauche, et toute la page doit suivre :
→ le menu et le logo passent à droite ;
→ les flèches « suivant » et « précédent » s'inversent ;
→ les colonnes, les formulaires et les icônes changent de côté ;
→ les caractères arabes demandent leurs propres polices et interlignes.

Je construis des sites en français, en anglais et en arabe, y compris en mise en page de droite à gauche.
Si une partie de votre clientèle lit l'arabe, en France ou à l'export, votre site peut lui parler aussi.

Vous avez déjà vu un site traduit « à moitié » ? Partagez votre exemple en commentaire.
```

**P5 · jeu. 29 oct. · Alliance Travel (concept 2).**
- Visuel : carrousel de captures réelles (marque, parcours, site).
- Premier commentaire : `https://alliancetravel34.netlify.app`

```text
Une agence de voyages ne vend pas des pages web. Elle vend des départs.

Pour Alliance Travel, agence de voyages à Bordj Bou Arréridj, j'ai conçu trois éléments qui fonctionnent ensemble :
1. La marque : l'identité visuelle de l'agence.
2. Le tunnel de conversion : le parcours d'un visiteur, de la découverte de l'agence jusqu'au contact.
3. Le site, qui relie les deux.

Ce que j'en retiens : on pense d'abord au parcours du client, ensuite aux pages.

Le site est en ligne : lien en premier commentaire.
```

**P6 · mar. 3 nov. · Mes prix (concept 3).**
- Visuel : « Site vitrine dès ~600 € HT · démo gratuite », avec en petit « conversion approximative ». Le chiffre de La Fabrique du Net ne figure jamais sur le visuel.
- Premier commentaire : {{LIEN_ETUDE}}.
- Avant de publier, relevez sur la source l'année, le lien et la base (HT ou TTC). Si vous ne pouvez pas les vérifier, supprimez le paragraphe « Repère ».

```text
Combien coûte un site ? Voici mes fourchettes, hors taxes.

→ Essentiel, site vitrine de 1 à 5 pages : environ 600 à 1 100 € HT
→ Studio, site sur mesure de 6 à 15 pages : environ 1 200 à 2 800 € HT
→ Moteur, application web : environ 3 000 à 7 900 € HT
→ Maintenance : environ 120 à 400 € HT par mois

Ce sont des conversions approximatives de ma grille de prix, au taux officiel de la Banque d'Algérie (début octobre 2026).

Repère : selon La Fabrique du Net (étude {{ANNEE_ETUDE}}, lien en premier commentaire), le prix médian d'un site réalisé par une agence en France est d'environ 5 200 € ({{HT_OU_TTC}} selon la source). Les contenus et les fonctions varient d'un projet à l'autre : comparez toujours à périmètre égal.

Pour les entreprises françaises : pas de TVA française facturée, mention « Autoliquidation » sur la facture (vous autoliquidez la TVA).

Et avant de payer quoi que ce soit, vous pouvez voir la page d'accueil de votre futur site : c'est L'Aperçu. Elle est construite avec vos contenus, livrée en 5 jours ouvrés après leur réception et présentée en 30 minutes d'appel vidéo. Gratuit, sans engagement, réservé aux entreprises immatriculées (SIRET), 4 par mois au maximum.
```

**P7 · jeu. 5 nov. · Glaive Store, démo de portfolio.** Visuel : captures portant toutes la mention « DÉMO DE PORTFOLIO, PAS UN CLIENT ».

```text
Ce site n'est pas celui d'un client. Je préfère le dire tout de suite.

Glaive Store est une démo de portfolio : une boutique en ligne de matériel de jeu vidéo, imaginée et construite pour montrer ce que je peux faire en commerce en ligne.

Pourquoi le préciser ? Parce qu'un portfolio honnête sépare les projets livrés (Bordj Steel, Alliance Travel) des démonstrations.

Ce que la démo permet de voir : [compléter avec 2 ou 3 éléments réellement présents dans la démo].

Si vous vendez en ligne, ou si vous y pensez, je vous la montre volontiers en appel vidéo.
```

**P8 · mar. 10 nov. · Ce qu'il me faut pour un Aperçu.** Visuel : liste en trois points sur fond de la page d'accueil du studio.

```text
Ce qu'il me faut pour construire votre Aperçu :

1. Votre numéro SIRET : L'Aperçu est réservé aux entreprises immatriculées.
2. Vos contenus : logo, textes, photos. C'est votre page, avec vos mots.
3. 30 minutes de votre temps, en appel vidéo, pour la présentation.

De mon côté : la page d'accueil de votre nouveau site, fonctionnelle, livrée en 5 jours ouvrés après réception de vos contenus.

Elle ne vous convainc pas ? Vous dites non et vous ne devez rien. C'est gratuit et sans engagement.

4 Aperçus par mois au maximum. Pour réserver le vôtre, écrivez-moi « Aperçu » en message privé ou sur WhatsApp au {{WA}}.
```

**P9 · jeu. 12 nov. · Travailler avec un studio en Algérie.** Visuel : texte seul, ou carrousel de 3 cartes.

```text
Travailler avec un studio web installé en Algérie : trois questions légitimes.

1. Le décalage horaire ?
Aucun en ce moment. L'Algérie reste à UTC+1 toute l'année : même heure que Paris tout l'hiver, une heure de moins en été.

2. La langue ?
Je travaille en français, en anglais et en arabe.

3. La facture ?
Émise depuis l'Algérie, sans TVA française, avec la mention « Autoliquidation » : en tant qu'entreprise, vous autoliquidez la TVA.

On échange par appel vidéo, par courriel ou sur WhatsApp.

Une autre question ? Posez-la en commentaire.
```

**P10 · ven. 13 nov. · Places de novembre.** Publiez-le seulement avec le vrai nombre de places restantes, compté sur tous les canaux. S'il n'en reste aucune, remplacez la première ligne par : « Les Aperçus de novembre sont tous pris : je prends les demandes pour décembre. »

```text
Novembre : il reste {{PLACES_RESTANTES}} Aperçu(s) sur 4.

Le principe, en une phrase : avant tout paiement, je construis la page d'accueil de votre nouveau site avec vos contenus, je vous la livre en 5 jours ouvrés après leur réception et je vous la présente en 30 minutes d'appel vidéo. Gratuit, sans engagement.

Réservé aux entreprises immatriculées (SIRET).

Pour réserver, écrivez-moi « Aperçu » en message privé ou sur WhatsApp au {{WA}}.
Si novembre est complet, je vous proposerai une place en décembre.
```

### 5.6 Suivi hebdomadaire

Notez chaque semaine, sans vous fixer d'objectif chiffré à l'avance :
- les posts publiés et leurs statistiques LinkedIn ;
- les commentaires reçus ;
- les invitations envoyées et acceptées ;
- les messages « Aperçu » ;
- les leads qualifiés (origine LI) ;
- les Aperçus réservés, sur le compteur commun.

---

## 6. Formulations : autorisées et interdites

**Autorisées (et seulement celles-ci) :**
- « petit studio web installé à Bordj Bou Arréridj, en Algérie », dirigé par Yasser Hamisse ;
- « sites et applications web sur mesure, en français, en anglais et en arabe (y compris de droite à gauche) » ;
- L'Aperçu avec toutes ses conditions :
  - une page d'accueil fonctionnelle, avec les contenus du prospect ;
  - livrée en 5 jours ouvrés après réception des contenus, présentée en 30 minutes d'appel vidéo ;
  - gratuit, sans engagement : « si vous dites non, vous ne devez rien » ;
  - réservé aux entreprises immatriculées (SIRET), 4 par mois au maximum ;
- « Voyez votre nouveau site avant de payer » comme accroche de visuel (concept 1). Dans les textes, parlez de la page d'accueil ;
- prix en euros, toujours avec « HT » et « conversion approximative au taux officiel de la Banque d'Algérie, début octobre 2026 » ;
- « pas de TVA française facturée, mention « Autoliquidation » » ;
- « UTC+1 toute l'année, même heure que Paris tout l'hiver » ;
- Bordj Steel et Alliance Travel, décrits comme ci-dessus, avec leurs liens ;
- Glaive Store, toujours qualifié de « démo de portfolio, pas un client » ;
- la médiane de La Fabrique du Net (environ 5 200 €), présentée comme un repère, avec l'année et le lien de l'étude, la base HT ou TTC indiquée par la source et la mise en garde sur le périmètre. Jamais sur un visuel.

**Interdites :**
- nombre de clients, années d'expérience, taille d'équipe ;
- témoignages, notes ou avis ;
- toute garantie ;
- chiffres de résultats (trafic, ventes, conversions) ;
- « le moins cher » ou « moins cher que les agences » ;
- un nombre de places qui ne soit pas réel ;
- tout autre projet que les trois cités ;
- présenter un projet client comme un Aperçu réalisé avant paiement ;
- toute identité légale inventée ;
- tout contact WhatsApp à l'initiative du studio.

---

## 7. À faire vérifier avant les premiers envois

1. **Représentant dans l'UE (art. 27 RGPD) : bloquant.**
   - Numidea Labs est établi hors de l'UE et s'adresse à des personnes en France : il faut considérer que le RGPD s'applique (art. 3.2).
   - L'article 27 impose alors un représentant dans l'UE, sauf si le traitement est occasionnel et peu risqué. Les lignes directrices 3/2018 du Comité européen de la protection des données entendent par « occasionnel » ce qui n'est ni régulier ni systématique. Or 20 à 30 messages de prospection chaque semaine forment un programme régulier.
   - Avant le premier envoi, désignez un représentant ({{EU_REP}}) et indiquez-le sur {{PRIVACY_URL}} et dans le bloc « Vos données » des modèles A et B. L'autre option : obtenir un avis juridique écrit qui confirme l'exemption de l'art. 27.2. Dans ce second cas seulement, retirez la ligne « Représentant dans l'UE ».
2. **Côté algérien : bloquant.** La loi 18-07 relative à la protection des données personnelles a été modifiée par la loi 25-11 du 24 juillet 2025. Confirmez auprès de l'ANPDP ou d'un conseil :
   - les formalités applicables (déclaration, délégué à la protection des données, registre) ;
   - l'autorisation éventuellement nécessaire pour héberger le fichier de prospects et la messagerie hors d'Algérie.

   Gardez une trace écrite de l'avis obtenu (section 0).
3. **Nom commercial.** Vérifiez sur la carte ANAE si l'auto-entrepreneur peut exercer sous un nom commercial. D'ici là, les messages indiquent « {{LEGAL_NAME}}, auto-entrepreneur (marque : Numidea Labs) », sans « exerçant sous le nom ».
4. **Facture (avant la première facture à un client français).** Faites valider la formulation exacte de la facture : mention « Autoliquidation », numéros d'identification des deux parties.
5. **LinkedIn.** Les limites d'invitations et de notes personnalisées changent. Suivez ce qu'affiche l'interface, sans jamais chercher à les contourner.
