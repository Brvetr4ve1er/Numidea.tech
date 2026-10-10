# Numidea Labs: France campaign (9 to 15 Nov 2026). Ad copy and WhatsApp scripts (French)

Everything a prospect sees is in French (Loi Toubon). Brand names (Numidea Labs, Bordj Steel, Alliance Travel, Glaive Store, WhatsApp) are not translated. The working notes around the copy are in English. The copy blocks are ready to paste once the placeholders are filled and the launch gates in section 4.1 are cleared.

**Rules for every piece of copy**
- Every price is excl. tax (HT) and marked as approximate (`~` or "environ").
- The free offer is one homepage. No headline, overlay or card may suggest that the whole site is built or shown before payment.
- Glaive Store is always labelled as a demo and never presented as a client.
- None of these appear anywhere: client counts, years of experience, team size, testimonials, ratings, guarantees, results figures.
- Opening hours appear only as {{HORAIRES}} until the real hours are confirmed (section 4.2).
- No instant lead forms. Every ad opens a WhatsApp chat carrying its own ref code.
- During the campaign (9 to 15 Nov 2026), Algeria and Paris share the same clock time (UTC+1).
- **French typography:** before pasting, put a non-breaking space (U+202F, or U+00A0) before `:` `;` `?` `!` and `»`, after `«`, inside numbers (`1 100`, `7 900`) and between a number and its unit (`600 €`, `9 h`). If you paste ordinary spaces, check the line breaks in the Meta preview and on a phone before publishing, so that a colon or a price never starts a new line.

---

## 1. Ads (CTA on all three: **Envoyer un message WhatsApp**)

### Concept 1: "Voyez votre nouveau site avant de payer" (ref FR-1)

**Visual:** L'Aperçu shown on a phone, using a neutral mock-up only: a generic homepage with « Votre logo », « Votre entreprise » and no invented brand. Do not use Bordj Steel or Alliance Travel here: under this headline they would look as if they came out of L'Aperçu. They belong in the Concept 2 carousel, as delivered work.

**Primary text, visible part (121 / 125 chars)**
```
Voyez votre nouveau site avant de payer : nous créons votre page d'accueil avec vos contenus, en 5 jours ouvrés. Gratuit.
```

**Optional continuation (after "Voir plus")**
```
L'Aperçu, c'est simple :
– nous réalisons la page d'accueil de votre futur site (une seule page), fonctionnelle, avec votre logo, vos textes et vos photos ;
– elle est prête dans les 5 jours ouvrés suivant la réception de vos contenus, et nous vous la présentons lors d'un appel vidéo de 30 minutes ;
– c'est gratuit et sans engagement : si vous dites non, vous ne devez rien.
Réservé aux entreprises immatriculées (SIRET). 4 Aperçus maximum par mois.
Numidea Labs, studio web basé en Algérie : nous travaillons en français, à l'heure de Paris.
Écrivez-nous sur WhatsApp pour réserver le vôtre.
```

| Field | Text | Length |
|---|---|---|
| Headline | Votre page d'accueil avant de payer | 35 / 40 |
| Description | Entreprises avec SIRET | 22 / 25 |
| On-image text | Voyez votre nouveau site avant de payer | 7 words |
| CTA | Envoyer un message WhatsApp | – |
| Prefilled message | Bonjour, je souhaite en savoir plus sur L'Aperçu gratuit de mon futur site. Réf. FR-1 | 85 |
| Tracking link (for chats and profile) | {{SITE}}?lang=fr&cur=eur&ref=FR-1 | – |

### Concept 2: carousel of real delivered work (ref FR-2)

**Primary text, visible part (120 / 125 chars)**
```
Des sites livrés et en ligne, ainsi qu'une boutique de démo. Le vôtre ? Voyez sa page d'accueil avant de payer. Gratuit.
```

**Optional continuation**
```
Faites défiler :
– Bordj Steel : site d'une entreprise algérienne de charpente métallique, avec catalogue, références et recrutement (en ligne : bordjsteelb2b.netlify.app).
– Alliance Travel : identité de marque, tunnel de vente et site d'une agence de voyages de Bordj Bou Arréridj (en ligne : alliancetravel34.netlify.app).
– Glaive Store : boutique d'accessoires de jeu vidéo. Précision : c'est une démo de notre portfolio, pas un client.
Et votre site ? Avec L'Aperçu, nous réalisons gratuitement votre page d'accueil avec vos contenus, prête dans les 5 jours ouvrés suivant leur réception et présentée en appel vidéo de 30 minutes. Sans engagement : si vous dites non, vous ne devez rien.
Réservé aux entreprises immatriculées (SIRET), dans la limite de 4 par mois.
```

**Cards**

| Card | Visual | On-image text (max 8 words) | Headline (max 40) | Description (max 25) |
|---|---|---|---|---|
| 1 | Screenshot of bordjsteelb2b.netlify.app, cropped to the hero area (written permission needed, see 4.1) | Bordj Steel · site d'entreprise en ligne | Bordj Steel : site d'entreprise (31) | Catalogue, références (21) |
| 2 | Screenshot of alliancetravel34.netlify.app, cropped to the hero area (written permission needed, see 4.1) | Alliance Travel · marque, tunnel de vente, site | Alliance Travel : agence de voyages (35) | Marque, tunnel, site (20) |
| 3 | Glaive Store, with a visible "DÉMO" badge | Démo de portfolio · pas un client | Glaive Store : démo, pas un client (34) | Projet de démonstration (23) |
| 4 | L'Aperçu on a phone (neutral mock-up, as in Concept 1) | Votre page d'accueil, avant de payer | Votre page d'accueil avant de payer (35) | Aperçu gratuit (SIRET) (22) |

**Notes:**
- The demo label must be written on the Glaive image itself, not only in the text, because the image can be seen alone in the feed. Keep the separate "DÉMO" badge as well as the overlay.
- Screenshots of Bordj Steel and Alliance Travel: crop to the hero area, with no third-party logos (references, partners, airlines) and no identifiable people.

| Field | Text |
|---|---|
| CTA | Envoyer un message WhatsApp |
| Prefilled message (95 chars) | Bonjour, j'ai vu vos réalisations et je voudrais un Aperçu gratuit de mon futur site. Réf. FR-2 |
| Tracking link | {{SITE}}?lang=fr&cur=eur&ref=FR-2 |

### Concept 3: price anchor (ref FR-3)

**Visual:** simple price card, plus a phone showing a homepage (neutral mock-up).

**Primary text, visible part (125 / 125 chars)**
```
Site vitrine à partir d'environ 600 € HT. Avant de payer, découvrez votre page d'accueil réalisée avec vos contenus. Gratuit.
```

**Optional continuation**
```
Nos formules, en prix HT indicatifs (conversions approximatives au taux officiel de la Banque d'Algérie, début octobre 2026) :
– Essentiel, site vitrine de 1 à 5 pages : environ 600 à 1 100 € HT
– Studio, site sur mesure de 6 à 15 pages : environ 1 200 à 2 800 € HT
– Moteur, application web : environ 3 000 à 7 900 € HT
– Maintenance : environ 120 à 400 € HT par mois
Avant tout paiement, L'Aperçu : votre page d'accueil réalisée avec vos contenus, prête dans les 5 jours ouvrés suivant leur réception, présentée en appel vidéo de 30 minutes. Gratuit et sans engagement : si vous dites non, vous ne devez rien.
Réservé aux entreprises immatriculées (SIRET), dans la limite de 4 par mois.
```

**No market comparison in the ad.** The La Fabrique du Net figure is not used in any ad. For the chat-only version, see the note under /prix (2.3).

| Field | Text | Length |
|---|---|---|
| Headline | Site vitrine dès ~600 € HT | 26 / 40 |
| Description | Démo gratuite (SIRET) | 21 / 25 |
| On-image text | Site vitrine dès ~600 € HT · démo gratuite | 7 words + € (keep the "~" and "HT") |
| CTA | Envoyer un message WhatsApp | – |
| Prefilled message | Bonjour, je cherche un site vitrine et L'Aperçu gratuit m'intéresse. Réf. FR-3 | 78 |
| Tracking link | {{SITE}}?lang=fr&cur=eur&ref=FR-3 | – |

---

## 2. WhatsApp Business app

Everything in this section is for the France number ({{WA}}). Read 2.0 first.

Greeting and away messages are limited to 1,024 characters in the app. As written, the greeting below is about 895 characters and the away message about 395. Once the placeholders are filled, expect roughly 950 to 1,000 for the greeting and about 420 for the away message, depending on their length. Check before saving: if the greeting goes over 1,024, shorten the hours wording or the privacy URL first, never the identity, data or STOP lines.

### 2.0 One number or two? (decide before launch)

The brief gives one WhatsApp number ({{WA}}) for France and the Gulf, and both campaigns run 9 to 15 Nov. The WhatsApp Business app holds only one greeting message and one away message per account, and it routes them by contact (everyone, contacts not in the address book, and so on), not by ref or language. With one number, the greeting saved last is the one every lead gets. French leads would then receive the EN/AR text, with no French and a privacy notice they may not understand (Loi Toubon), or Gulf leads would receive this French one with Paris hours.

- **Option A (preferred):** run a second WhatsApp Business account on a second number for the Gulf campaign (the app can run two accounts on a dual-SIM phone). {{WA}} and everything in this section stay France-only, and the Gulf ads point to the second number.
- **Option B (fallback, one number for both markets):**
  - Use one compact greeting: the French block below first, then the EN and AR blocks from the Gulf deliverable. Keep each block to about 300 to 330 characters, and the whole greeting under 1,024 once filled.
  - Move the ANAE card number and NIF to the WhatsApp Business profile and to the privacy page.
  - The away message must give the hours in Paris time and in Gulf time.
  - Save the full greeting from 2.1 as quick reply **/bienvenue**, and send it by hand as the first reply in every FR-x chat.

**Compact French block (option B only, about 300 characters before filling)**
```
Bonjour, merci ! Ici Yasser Hamisse, de Numidea Labs (nom commercial de {{LEGAL_NAME}}, auto-entrepreneur de droit algérien). Je réponds {{HORAIRES}}, heure de Paris. Vos données servent à traiter votre demande ; infos et droits : {{PRIVACY_URL}}. Répondez STOP pour ne plus recevoir de messages.
```

Record the choice in section 4.1, item 1.

### 2.1 Greeting message (first contact, or after 14 days without a message)
```
Bonjour et merci pour votre message !
Ici Yasser Hamisse, de Numidea Labs, studio web à Bordj Bou Arréridj (Algérie). Numidea Labs est le nom commercial de {{LEGAL_NAME}}, auto-entrepreneur de droit algérien (carte ANAE n° {{ANAE_NO}}, NIF {{NIF}}).

Et ensuite ? Je vous réponds personnellement ({{HORAIRES}}, heure de Paris) avec quelques questions rapides sur votre entreprise et votre projet. Si L'Aperçu vous convient, nous fixerons ensemble un appel vidéo de 30 minutes.

Vos données (numéro, nom, messages, SIRET vérifié dans l'annuaire public des entreprises) servent à traiter votre demande, à préparer un éventuel devis et, si vous répondez STOP, à ne plus vous écrire. Traitées depuis l'Algérie, elles ne sont jamais vendues. Responsable du traitement : {{LEGAL_NAME}}. Destinataires, durées et droits : {{PRIVACY_URL}}

Répondez STOP à tout moment pour ne plus recevoir de messages.
```
The full address ({{ADDRESS}}), the recipients, the retention periods and the other items listed in 4.1 (item 4) go on the {{PRIVACY_URL}} page. That keeps the greeting under the character limit.

### 2.2 Away message (schedule: outside business hours)
```
Merci pour votre message, nous l'avons bien reçu.
Nous sommes actuellement en dehors de nos horaires : nous répondons {{HORAIRES}}, heure de Paris, et reviendrons vers vous dès le jour ouvré suivant.
Pour gagner du temps, vous pouvez déjà nous indiquer le nom de votre entreprise, son numéro SIRET et le lien de votre site actuel (s'il existe).
Répondez STOP pour ne plus recevoir de messages.
```
**Summer time:** the app schedule uses the phone's time zone (Algeria). From 28 March 2027, when Europe moves to summer time, Algeria is one hour behind Paris. To keep the same Paris hours, move the app schedule one hour earlier in Algeria time.

### 2.3 Quick replies
Type "/" in a chat to insert one. You can edit the text before sending.

**/apercu** (the offer's terms)
```
L'Aperçu, en bref :
• Avant tout paiement, nous réalisons une seule page d'accueil, fonctionnelle, de votre futur site, avec vos propres contenus (logo, textes, photos).
• Livrée dans les 5 jours ouvrés suivant la réception de vos contenus, puis présentée lors d'un appel vidéo de 30 minutes.
• Gratuit et sans engagement : si vous dites non, vous ne devez rien.
• Réservé aux entreprises immatriculées (SIRET).
• 4 Aperçus maximum par mois.
• Vos contenus servent uniquement à votre Aperçu. Il est partagé par un lien privé et n'est jamais publié ni réutilisé sans votre accord écrit. Si vous ne donnez pas suite, vos contenus et l'Aperçu sont supprimés sous {{DELAI_SUPPRESSION}} jours.
Si le résultat vous plaît, nous vous proposons ensuite un devis pour le site complet.
```

**/prix** (before sending, change `FR-1` in the link to the chat's own ref; registered businesses only, see Step 1)
```
Nos tarifs indicatifs, hors taxes (conversions approximatives au taux officiel de la Banque d'Algérie, début octobre 2026) :
• Essentiel – site vitrine de 1 à 5 pages : environ 600 à 1 100 € HT
• Studio – site sur mesure de 6 à 15 pages : environ 1 200 à 2 800 € HT
• Moteur – application web : environ 3 000 à 7 900 € HT
• Maintenance : environ 120 à 400 € HT par mois
TVA : nos factures sont émises depuis l'Algérie, sans TVA française et avec la mention « Autoliquidation » ; c'est votre entreprise qui déclare la TVA. Si vous êtes en franchise de TVA, vérifiez l'impact avec votre comptable.
Le prix exact dépend de votre projet ; L'Aperçu, lui, reste gratuit.
Détails : {{SITE}}?lang=fr&cur=eur&ref=FR-1
```

*Optional, chat only, and only if a prospect asks how these prices compare with the French market.* First check the source's year, its HT/TTC basis and the scope of its median. If you cannot check all three, do not use the line. Never put it in an ad, and never turn it into "X fois moins cher" or "moins cher que les agences".
```
Repère : selon La Fabrique du Net ([année]), un site réalisé par une agence en France coûte environ 5 200 € [HT/TTC] en médiane ([périmètre de l'étude]).
```

**/delais**
```
Nos délais :
• L'Aperçu : livré dans les 5 jours ouvrés suivant la réception de vos contenus, puis présenté lors d'un appel vidéo de 30 min.
• Site complet : le délai est fixé dans le devis, selon la formule (Essentiel, Studio ou Moteur) et le rythme de vos retours.
Nous répondons {{HORAIRES}}, heure de Paris.
```

**/qualif** (all six questions in one message, for people who prefer to answer at once)
```
Pour vérifier que L'Aperçu correspond à votre projet, voici 6 questions rapides :
1. Le nom de votre entreprise et son numéro SIRET ?
2. Avez-vous déjà un site ? Si oui, le lien.
3. Qu'attendez-vous du nouveau site, et combien de pages environ ?
4. Votre enveloppe HT : A) moins de 600 € B) 600 à 1 100 € C) 1 100 à 2 800 € D) plus de 2 800 € E) je ne sais pas encore
5. Dans quel délai comptez-vous décider : A) ce mois-ci B) d'ici 3 mois C) plus tard / pas encore défini
6. Qui prendra la décision finale ?
Vous pouvez répondre en une seule fois, en reprenant les numéros.
```

**/exemples** (optional extra)
```
Quelques réalisations en ligne :
• Bordj Steel, site d'une entreprise algérienne de charpente métallique (catalogue, références, recrutement) : https://bordjsteelb2b.netlify.app
• Alliance Travel, marque, tunnel de vente et site d'une agence de voyages de Bordj Bou Arréridj : https://alliancetravel34.netlify.app
Nous avons aussi une boutique de démonstration, Glaive Store : c'est un projet de portfolio, pas un client.
```

**/stop** (optional extra; send once, then never write to that number again)
```
C'est noté : vous ne recevrez plus de messages de notre part. Merci et bonne continuation.
```

**/bienvenue** (option B in 2.0 only): the full greeting from 2.1, sent by hand as the first reply in every FR-x chat.

### 2.4 Six-step qualification script and call booking

**A lead is qualified when all four are true:**
- the SIRET is valid;
- the business needs a website or web app;
- the budget is B, C or D, or the person accepts a floor of about 600 € HT;
- the decision will be taken within 3 months (answer A or B).

Ask one question per message. Write politely, use "vous", and keep it short.

**Step 1: business and SIRET**
```
Bonjour, ici Yasser, de Numidea Labs. Merci pour votre message ! Pour commencer : quel est le nom de votre entreprise et son numéro SIRET ? L'Aperçu est réservé aux entreprises immatriculées.
```
- *Internal:* check the SIRET (14 digits) on the public French business directory, annuaire-entreprises.data.gouv.fr.
- *If there is no SIRET* (private person, or a company not yet registered). Replace `FR-x` with the chat's ref:
```
Merci pour votre réponse. L'Aperçu est réservé aux entreprises déjà immatriculées, je ne peux donc pas vous le proposer pour l'instant. Vous trouverez nos tarifs indicatifs ici : {{SITE}}?lang=fr&cur=eur&ref=FR-x. Dès que votre SIRET est attribué, écrivez-nous et nous reprendrons volontiers la discussion.
```
  Then label the chat "Non qualifié". Do not follow up. Do not send /prix in this branch: its VAT paragraph only applies to registered businesses.

**Step 2: current site**
```
Merci ! Avez-vous déjà un site internet ? Si oui, pouvez-vous m'envoyer le lien ? (Si vous n'en avez pas encore, aucun souci.)
```

**Step 3: the need**
```
Qu'attendez-vous surtout du nouveau site ? Par exemple : présenter vos services, recevoir des demandes de devis, prendre des réservations, un espace client… Et, à peu près, combien de pages ?
```
- *Internal mapping:*
  - 1 to 5 pages: Essentiel.
  - 6 to 15 pages: Studio.
  - Accounts, bookings, back-office: Moteur.
- *If the need is not a website or web app:*
```
Merci pour ces précisions. Notre métier, c'est la création de sites et d'applications web : pour ce besoin-là, nous ne sommes pas la bonne adresse, et je préfère vous le dire franchement.
```

**Step 4: budget band**
```
Pour vous orienter vers la bonne formule, quelle enveloppe HT envisagez-vous ?
A) moins de 600 €
B) 600 à 1 100 €
C) 1 100 à 2 800 €
D) plus de 2 800 €
E) je ne sais pas encore
```
- *If the answer is E:* send /prix, then ask:
```
Avec ces repères, un budget d'environ 600 € HT minimum vous paraît-il envisageable ?
```
- *If the answer is A:*
```
Merci pour votre transparence. Notre formule la plus simple, Essentiel, démarre autour de 600 € HT : nous ne serons sans doute pas la bonne solution pour le moment. Si votre budget évolue, n'hésitez pas à revenir vers nous.
```
  Label the chat "Non qualifié".

**Step 5: timing**
```
Dans quel délai pensez-vous prendre votre décision pour ce projet ?
A) ce mois-ci
B) d'ici 3 mois
C) plus tard / pas encore défini
```
- *If the answer is C:*
```
C'est noté. Comme nous ne réalisons que 4 Aperçus par mois, nous les réservons aux projets dont la décision est prévue dans les 3 mois. Souhaitez-vous que je vous recontacte plus tard ? Si oui, indiquez-moi simplement quand.
```
  Recontact only after an explicit yes, and on the date they gave. Record the consent in the tracking sheet (date, the person's exact words, requested recontact date) and label the chat "Rappel accepté". Send one recontact only, on that date. If there is no answer, do not follow up again.

**Step 6: decision maker**
```
Dernière question : est-ce vous qui prendrez la décision finale pour ce site ? Sinon, qui doit participer à l'appel vidéo de présentation (30 min) ?
```
- *If someone else decides:* ask for that person to attend the call. Never book the call without the decision maker.

**Booking (qualified leads only)**
```
Merci, votre projet correspond bien à L'Aperçu. Voici comment cela se déroule :
1. Vous m'envoyez vos contenus : logo, textes (ou simplement les points clés), photos, et vos couleurs si vous en avez. Ici ou par courriel : {{EMAIL}}.
2. Je réalise une page d'accueil fonctionnelle de votre futur site, dans les 5 jours ouvrés suivant leur réception.
3. Je vous la présente lors d'un appel vidéo de 30 minutes.
C'est gratuit et sans engagement : si vous dites non, vous ne devez rien.
Vos contenus servent uniquement à votre Aperçu. Il est partagé par un lien privé et n'est jamais publié ni réutilisé sans votre accord écrit. Si vous ne donnez pas suite, vos contenus et l'Aperçu sont supprimés sous {{DELAI_SUPPRESSION}} jours.
Si je reçois vos contenus d'ici [jour], je vous propose l'appel le [jour J+5 ouvrés] à [HH h] ou à [HH h], heure de Paris. Quel créneau vous convient le mieux ?
```
- *Scheduling:*
  - Count the 5 jours ouvrés on the French calendar, which is how a French prospect reads them: Monday to Friday, skipping French public holidays.
  - Do not propose Wednesday 11 November 2026, and do not count it as a working day. It is a public holiday in France.

**Confirmation**
```
C'est noté : appel vidéo le [jour, date] à [HH h], heure de Paris, avec [participants]. Je vous enverrai le lien la veille. Dès réception de vos contenus, je commence votre Aperçu.
```

**Reminder the day before the call**
```
Bonjour [Prénom], petit rappel : notre appel vidéo de 30 minutes pour vous présenter votre Aperçu a lieu demain à [HH h] (heure de Paris). Voici le lien : [lien]. À demain !
```

**If the month's 4 places are taken**
```
Les 4 Aperçus de [mois] sont déjà attribués. Je peux vous réserver une place début [mois suivant] : cela vous convient ?
```

**If the content has not arrived** (one follow-up only)
```
Bonjour [Prénom], avez-vous pu rassembler vos contenus ? Le délai de 5 jours ouvrés démarre à leur réception. Si le moment n'est pas idéal, dites-le-moi simplement.
```

### 2.5 STOP and tracking
- **STOP:** if someone writes STOP (or "arrêtez", "désinscription" and similar), send /stop once. Then:
  - label the chat "STOP";
  - add the number to the suppression list;
  - never write to that number again.
- **No cold WhatsApp:** only reply to chats the person starts. Only recontact someone who explicitly asked for it, with the consent recorded (Step 5).
- **Labels:** create these labels in the app: FR-1, FR-2, FR-3, Réf. inconnue, Qualifié, Non qualifié, Rappel accepté, Appel réservé, STOP.
- **Counting:** Meta hides "conversations started" for ads shown in the EEA, so count new chats by ref label every evening.
  - Record: date, ref, new chats, qualified leads, calls booked.
  - Cost per chat for each ad = that ad's spend in Ads Manager ÷ chats with its label.

---

## 3. DSA beneficiary and payer (ad set, ads reaching the EU)

These two fields are **published in the Meta Ad Library**. Enter the same values in all three French ad sets.

- **Bénéficiaire** (the person or organisation the ad is shown for): `Numidea Labs ({{LEGAL_NAME}})`
- **Payeur** (who actually pays for the ads, if different from the beneficiary): `{{LEGAL_NAME}}`, but only if the card or payment account used is in that name.

How to fill them:
- Use the legal name exactly as it appears on the ANAE card.
- If the ads are paid with a card in the founder's own name, the payer is that natural person, under his legal name.
- If the card or payment account belongs to another person, or to an agency or reseller, the payer is that name, not {{LEGAL_NAME}}.
- Update the field whenever the payment method changes.
- Never put a phone number or email address in these fields.
- If Meta offers a verified business in the drop-down, pick it only if it matches this legal name.
- Be aware that the founder's legal name will be shown publicly in the Ad Library.

---

## 4. Before launch

### 4.1 Launch gates (nothing goes live until each one is done)
1. **One WhatsApp number or two.** Choose option A or option B from 2.0 and record it here: `Option retenue : [A / B]`. Without that decision, neither the French nor the Gulf greeting can be set up safely, so neither campaign should start.
2. **Placeholders.** Fill in {{LEGAL_NAME}}, {{ANAE_NO}}, {{NIF}}, {{ADDRESS}}, {{PRIVACY_URL}}, {{EMAIL}}, {{SITE}}, {{HORAIRES}} and {{DELAI_SUPPRESSION}}, plus {{EU_REP}} on the privacy page (item 11 below). No ad and no automatic message should go live with braces showing. The privacy page has to be online first, because the greeting links to it.
3. **ANAE card and NIF.** If they have not been issued by about 6 Nov 2026, postpone the campaign. Do not launch with the status line removed from the greeting.
4. **Privacy page ({{PRIVACY_URL}}).** It must contain:
   - identity: {{LEGAL_NAME}}, the trade name Numidea Labs, the ANAE card number, the NIF and {{ADDRESS}};
   - the data collected and their source, including the SIRET checked in the public French business directory;
   - the purposes and their legal bases: handling the request, the Aperçu and the quote (steps before a contract, GDPR art. 6(1)(b)); recontact at the person's request; the suppression list after STOP (legitimate interest or legal obligation);
   - the recipients: WhatsApp/Meta, the email host, the video-call tool;
   - processing outside the EU, in Algeria;
   - retention periods, including {{DELAI_SUPPRESSION}} days for Aperçu content after a "no";
   - the person's rights and their right to complain to the CNIL;
   - the EU representative ({{EU_REP}}), or why none is named (item 11).
5. **Client permission for the carousel.** Get written permission from Bordj Steel and Alliance Travel to show their sites in paid ads (an email or WhatsApp message is enough). Crop the screenshots to the hero area, with no third-party logos and no identifiable people. If a client says no, drop that card.
6. **Landing page consistency and cookies.** Check that {{SITE}}?lang=fr&cur=eur shows, in French: the same rounded € HT ranges, marked as approximate conversions; the terms of L'Aperçu (SIRET, 4 per month, free and no obligation, 5 working days); Glaive Store labelled as a demo; and the identity (placeholders filled). No Meta Pixel, analytics or other measurement cookie runs without a consent banner (prior consent for French visitors).

### 4.2 Decisions and checks
7. **Business hours ({{HORAIRES}}).** Use your real hours, the same in the greeting, the away message, /delais, the app profile and the app's away schedule. "Du lundi au vendredi, de 9 h à 18 h" was only a suggestion. Check it against your real working week in Algeria before using it.
8. **When the 5 working days start.** The copy says they start when the prospect's content arrives. Confirm that this is how you work, and count them on the French calendar (2.4, Scheduling).
9. **When a prospect says no.** The copy now promises that their content is used only for the Aperçu, shared by a private link, never published or reused without written consent, and deleted within {{DELAI_SUPPRESSION}} days. Set that number, and host every Aperçu on a private URL marked noindex. Still to decide: whether the prospect keeps anything from the Aperçu page or the files. The copy says nothing about it on purpose.
10. **VAT, quotes and invoices.**
    - A client under the "franchise en base de TVA" scheme still has to account for VAT under reverse charge and cannot get it back. /prix tells them to check with their accountant.
    - Quotes and invoices for France: written in French, amounts HT, with the mention « Autoliquidation ». Ask for the client's intra-EU VAT number when you send the quote, including for businesses under the franchise en base scheme.
    - Have an accountant confirm this wording and the invoice template.
11. **EU representative (GDPR art. 27).** The studio is outside the EU and offers its services to businesses in France. Either appoint an EU representative (paid services exist) and name them on {{PRIVACY_URL}}, or document why the exemption for occasional processing applies.
12. **Algerian data-protection law.** Once the ANAE status is obtained, declare the "prospects WhatsApp" processing to the ANPDP under Law 18-07. Also check the current rules for transfers abroad (WhatsApp/Meta, the email host).
