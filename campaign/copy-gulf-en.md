# Numidea Labs Gulf kit (English): ad copy and WhatsApp scripts

**Markets:** UAE and Saudi Arabia · **Refs:** GU-EN-1, GU-EN-2 (GU-EN-3 optional) · **Format:** Meta click-to-WhatsApp · **Dates:** Mon 9 to Sun 15 Nov 2026

Conventions used below:
- `{{...}}` is a placeholder for the whole kit. Fill it before launch (the legal ones once registration is done), and never invent a value for it.
- `[...]` is filled in for each chat.

---

## 0. Placeholders to fill before launch

| Placeholder | What goes in | Status |
|---|---|---|
| `{{SITE}}` | https://brvetr4ve1er.github.io/Numidea.tech/ (custom domain later) | ready |
| `{{WA}}` | +213 672 41 25 78 (WhatsApp Business, connected to the Page; shared with the FR and GU-AR kits) | ready |
| `{{EMAIL}}` | the pro mailbox | pending |
| `{{HOURS}}` | your real reply hours, Sunday to Thursday. In English, write them in all three time zones: "[start]-[end] Algeria time ([start+3]-[end+3] UAE · [start+2]-[end+2] Saudi)". In the shared away message, write them in each language block; the French block uses Algeria time (the same as Paris time until 29 Mar 2027). | owner decides |
| `{{LEGAL_NAME}}` `{{ANAE_NO}}` `{{NIF}}` `{{ADDRESS}}` | from the ANAE card | pending registration. Until then, use them only in internal notes and never in a message to prospects |
| `{{PRIVACY_URL}}` | privacy page on the site | pending. Until it's live, /privacy has no "Full notice" line |
| `{{RETENTION}}` | how long you keep chat data from people who don't become clients | owner decides |

---

## 1. Campaign at a glance

| | |
|---|---|
| Audience | Small and mid-size businesses, UAE and Saudi Arabia |
| Language | English (the Arabic ads are in the separate GU-AR kit) |
| Budget | Gulf total is USD 60, shared with GU-AR. An even split gives about USD 30 for English, or about USD 4.30 a day |
| Ads | **GU-EN-1** The Preview (single image or short video) · **GU-EN-2** Real work (carousel) · **GU-EN-3** Price anchor (optional, swap-in only) |
| CTA | Send WhatsApp message, going to `{{WA}}` |
| Lead forms | Not used (no privacy URL yet) |
| Links (sent in chat; the profile shows the bare `{{SITE}}`; the ads open WhatsApp, not these links) | `{{SITE}}?lang=en&cur=usd&ref=GU-EN-1` · `...&ref=GU-EN-2` · `...&ref=GU-EN-3` |

### Time zones and working weeks

Algeria is UTC+1, the UAE UTC+4 and Saudi Arabia UTC+3, and none of the three changes its clocks. All year, **UAE time = Algeria time + 3 h** and **Saudi time = Algeria time + 2 h**.

| Campaign day | Algeria (Sun-Thu) | UAE (Mon-Fri) | Saudi (Sun-Thu) |
|---|---|---|---|
| Mon 9 to Thu 12 Nov | working | working | working |
| Fri 13 Nov | weekend | **working** | weekend |
| Sat 14 Nov | weekend | weekend | weekend |
| Sun 15 Nov | working | **weekend** | working |

All three countries work Monday to Thursday. Saudi Arabia also overlaps with Algeria on Sunday. The away message covers UAE chats sent on Friday.

### Ads Manager settings (suggested; align with the master plan)
- **Objective:** a messaging campaign with WhatsApp as the destination. **Locations:** UAE and Saudi Arabia. **Age:** 25-65. **Language:** English. Use broad targeting.
- **Turn off Advantage+ creative enhancements**, including text improvements, automatic translation and generated backgrounds. They can rewrite the copy, drop the "excl. tax" or "demo" labels, or produce poor Arabic.
- **Carousel:** turn off "show best-performing cards first", so the demo label and the end card stay in place.
- Put both ads in one English ad set. Don't edit anything for the first 3 days.
- **Optional:** use a lifetime budget with an ad schedule that matches `{{HOURS}}` in Gulf time, so chats arrive when you can reply. Also decide whether to spend on Fri 13 and Sat 14, which are Algerian weekend days.
- **DSA beneficiary/payer** is only needed for ad sets targeting the EU (France). UAE- and Saudi-only ad sets don't need it.

---

## 2. Rules for every GU-EN ad

1. Every Preview mention gives the conditions: **free, no obligation, registered businesses only (trade licence / CR), max 4 a month.** When a time is given, the 5 working days count **from when the prospect's content arrives**. "Registered businesses only" is always attached to the Preview, never to working with us in general.
2. Prices are always **"about", "excl. tax"** and labelled **approximate conversions at the Bank of Algeria official rate, early Oct 2026**.
3. **Glaive Store is always a "portfolio demo, not a client"**, in the image *and* in the text.
4. Only Bordj Steel and Alliance Travel may be cited as client work. Don't use client counts, years, team size, testimonials, ratings, guarantees, results figures, "best/#1" or named competitors.
5. Be open about location: say "studio based in Algeria". Don't use a local-office look, Gulf landmarks, flags or national emblems.
6. Mock-ups show a **fictional business only**, never a real Gulf brand.
7. Payment methods are never discussed in ads. They appear only in the written proposal.

---

## 3. GU-EN-1: The Preview

**Primary text**
```
See your new website before you pay anything: free, with no obligation.

Send us your content and we build one working homepage of your new site with it, ready 5 working days after it arrives. Then we walk you through it on a 30-minute video call.

• If it's a no, you owe nothing
• English, Arabic or both, with proper right-to-left layouts for Arabic
• Registered businesses only (trade licence / CR) · max 4 Previews a month

Numidea Labs · custom websites and web apps · studio based in Algeria
```

**Backup primary text** (swap in only if needed; don't run both on about USD 30)
```
Your new homepage, built before you pay. Free Preview, ready 5 working days after you send your content, shown on a 30-minute video call. Say no and you owe nothing. English, Arabic or both (right-to-left for Arabic). Registered businesses only, max 4 a month. Studio based in Algeria.
```

| Field | Copy |
|---|---|
| Headline | See your new site before you pay |
| Alt headline | Free Preview for registered businesses |
| Description | Free Preview · registered businesses · max 4/month |
| CTA | Send WhatsApp message |

**Creative brief**
- **Sizes:** 4:5 for feed and 9:16 for Stories/Reels, with the same content.
- **Visual:** a phone showing a clean homepage for a fictional business ("Your logo"), with an **EN | عربي** switch. Optionally add a second phone showing the same page mirrored right-to-left in Arabic.
- **Overlay:** "See it first. Pay only if you go ahead."
- **Small print:** "Free Preview · 5 working days from your content · registered businesses · max 4/month"
- **Optional 6-10 s video:** scroll the homepage, tap EN → عربي, and the layout mirrors. End frame: "Free Preview for registered businesses · max 4/month · message us on WhatsApp".

**Prefilled WhatsApp message**
```
Hi Numidea Labs, I'd like a free Preview of my new website. Ref: GU-EN-1
```
**Link to send in chat:** `{{SITE}}?lang=en&cur=usd&ref=GU-EN-1`

---

## 4. GU-EN-2: Real work carousel

**Primary text**
```
Real websites we built and delivered, live online today. Plus one portfolio demo, clearly marked.

Want to see yours before you pay? We build your new homepage first: free Preview, ready 5 working days after you send your content, no obligation. English, Arabic or both.

Free Preview for registered businesses only · max 4 a month · studio based in Algeria
```

| Card | Image | Headline | Description |
|---|---|---|---|
| 1 | Bordj Steel homepage (desktop and phone). Overlay: "Live client site · Algeria" | Bordj Steel · B2B steel site | Catalogue, references, careers |
| 2 | Alliance Travel site. Overlay: "Live client site · Algeria" | Alliance Travel · travel agency | Brand, funnel and website |
| 3 | Glaive Store, with a permanent top banner: **"PORTFOLIO DEMO · not a client"** | Glaive Store · portfolio demo | Demo shop, not a client |
| 4 | Phone showing a "Your logo" EN/AR homepage. Small print: "Free Preview · 5 working days from your content · registered businesses · max 4/month" | Your homepage next? | Free Preview · registered businesses · max 4/month |

Every card uses the CTA "Send WhatsApp message" and the same prefilled message:
```
Hi Numidea Labs, I saw your work and I'd like to talk about a website for my business. Ref: GU-EN-2
```
**Link to send in chat:** `{{SITE}}?lang=en&cur=usd&ref=GU-EN-2`

Before launch, get written permission from Bordj Steel and Alliance Travel to feature their sites in paid ads, and keep a copy.

---

## 5. GU-EN-3: Price anchor (optional)

Use this only as a swap-in for an ad with no chats by day 4. GU-EN-3 is a **new ref**: add it to the tracking sheet and the labels before you use it. If the exchange rate moves before launch, recompute the prices from the site's price source. Use the same package labels as the site's English price page.

**Primary text**
```
Website prices in USD, excl. tax:
• Business website (1-5 pages): about $670-1,200
• Custom website (6-15 pages): about $1,300-3,100
• Web app: about $3,400-9,000

Not sure yet? See your homepage first: a free Preview, ready 5 working days after you send your content, with no obligation. For registered businesses only, max 4 a month. English, Arabic or both.

Prices are approximate conversions at the Bank of Algeria official rate (early Oct 2026).
```

| Field | Copy |
|---|---|
| Headline | Business website from ~$670 excl. tax |
| Description | Free Preview for registered businesses |
| Image overlay | "Business website from about $670 excl. tax" / "See your homepage first: free Preview" / small print: "Approx. conversion, Bank of Algeria official rate, early Oct 2026 · Free Preview: 5 working days from your content · registered businesses · max 4/month" |

**Prefilled message**
```
Hi Numidea Labs, I'd like website prices in USD. Ref: GU-EN-3
```

---

## 6. WhatsApp Business setup

> **Shared with the FR and GU-AR kits: don't set these from this kit alone.** The profile, greeting message and away message are set once for the whole number `{{WA}}`, so French prospects (FR-1 to FR-3) and Arabic-speaking prospects (GU-AR) see the same text. Below is a proposed shared version in French, English and Arabic. Agree it with the FR and GU-AR kits, have the French and Arabic checked by native speakers, and set it only once all three kits sign off. The French block comes first and must be at least as prominent as the others.

**Profile**
- **Name:** Numidea Labs
- **Address:** Bordj Bou Arréridj, Algeria (switch to `{{ADDRESS}}` once registered)
- **Hours:** Sunday to Thursday, `{{HOURS}}`
- **Email:** `{{EMAIL}}`
- **Website:** `{{SITE}}` (no lang/cur parameters; the links sent in chat carry them)
- **Description** (check it saves in the app; if it's too long, shorten all three languages equally):
```
FR · Sites et applications web sur mesure en français, anglais et arabe (mise en page de droite à gauche comprise). L'Aperçu, gratuit et sans engagement : voyez votre nouvelle page d'accueil avant de payer (entreprises immatriculées, 4 par mois maximum). Studio à Bordj Bou Arréridj (Algérie), dirigé par Yasser Hamisse.

EN · Custom websites and web apps in French, English and Arabic (including right-to-left layouts). Free Preview, no obligation: see your new homepage before you pay (registered businesses, max 4 a month). Studio in Bordj Bou Arréridj, Algeria, led by Yasser Hamisse.

AR · مواقع وتطبيقات ويب حسب الطلب بالعربية والفرنسية والإنجليزية، مع تصميم كامل من اليمين إلى اليسار. المعاينة مجانية ودون أي التزام: شاهد صفحتك الرئيسية الجديدة قبل أن تدفع (للشركات المسجّلة، 4 معاينات شهريًا كحد أقصى). استوديو في برج بوعريريج، الجزائر.
```

**Labels** (shared with the FR and GU-AR kits; the app limits how many labels you can have, so keep the list short):
- Refs: GU-EN-1, GU-EN-2, (GU-EN-3), Ref unknown (one label shared by all three kits)
- Status: Qualified, Not qualified, Preview booked, Preview delivered, Won, Lost, Follow-up (record the month in the sheet), STOP

**Greeting message** (on; sent on a first message). Keep each automatic message short and check that it saves in the app. If the three-language version won't save, keep only the hello, identity, privacy line and STOP in each language: the first reply by ref (/pre, /work1...) does the rest.
```
FR · Bonjour et merci pour votre message ! Ici Numidea Labs, studio web à Bordj Bou Arréridj (Algérie). Yasser, le fondateur, vous répondra personnellement, en français. Confidentialité : vos messages servent uniquement à traiter votre demande de site et à identifier l'annonce que vous avez vue. Répondez DONNÉES pour en savoir plus, ou STOP pour ne plus recevoir de messages.

EN · Hello, and thanks for your message! This is Numidea Labs, a web studio in Bordj Bou Arréridj, Algeria. Yasser, the founder, will reply to you personally, in English. Privacy: we use your messages only for your website request and to see which ad you came from. Reply PRIVACY for details, or STOP and we won't message you again.

AR · مرحبًا، وشكرًا على رسالتك! نحن Numidea Labs، استوديو ويب في برج بوعريريج بالجزائر. سيرد عليك ياسر، مؤسس الاستوديو، شخصيًا بالعربية. الخصوصية: نستخدم رسائلك فقط للرد على طلب موقعك ولمعرفة الإعلان الذي وصلت منه. أرسل «خصوصية» للاطلاع على التفاصيل، أو «توقف» ولن نراسلك مجددًا.
```

**Away message** (on, "outside business hours", with business hours set to Sunday-Thursday `{{HOURS}}`). If it won't save, drop the "Meanwhile..." sentence in every language first, then the weekend sentence; always keep identity, hours, the privacy line and STOP in each language.
```
FR · Merci pour votre message ! Numidea Labs est un studio web en Algérie (UTC+1 : même heure qu'à Paris en hiver, une heure de moins en été). Nous travaillons du dimanche au jeudi, {{HOURS}} : nous sommes absents pour le moment et vous répondrons dès notre retour. Le dimanche, notre réponse peut arriver pendant votre week-end : répondez quand cela vous convient. En attendant, vous pouvez nous indiquer le nom de votre entreprise, votre pays et l'objet du site. Vos messages servent uniquement à traiter votre demande de site et à identifier l'annonce que vous avez vue. Répondez DONNÉES pour en savoir plus, ou STOP pour ne plus recevoir de messages.

EN · Thanks for your message! Numidea Labs is a web studio in Algeria (UTC+1: 3 hours behind the UAE, 2 hours behind Saudi Arabia). Our working week is Sunday to Thursday, {{HOURS}}, so we're away right now. We'll reply when we're back. In the UAE? Our Sunday replies may land on your weekend: reply whenever it suits you. Meanwhile, feel free to send your business name, country and what the website is for. We use your messages only for your website request and to see which ad you came from. Reply PRIVACY for details, or STOP to opt out.

AR · شكرًا على رسالتك! نحن Numidea Labs، استوديو ويب في الجزائر. توقيتنا UTC+1، أي أننا نتأخر بثلاث ساعات عن توقيت الإمارات وبساعتين عن توقيت السعودية. نعمل من الأحد إلى الخميس، {{HOURS}}، ولسنا متاحين الآن، وسنرد عليك فور عودتنا. إذا كنت في الإمارات، فقد يصلك ردّنا يوم الأحد خلال عطلتك الأسبوعية: ردّ متى ناسبك. وفي هذه الأثناء، يمكنك إرسال اسم شركتك وبلدك والغرض من الموقع. نستخدم رسائلك فقط للرد على طلب موقعك ولمعرفة الإعلان الذي وصلت منه. أرسل «خصوصية» للاطلاع على التفاصيل، أو «توقف» ولن نراسلك مجددًا.
```

---

## 7. Chat scripts (save as quick replies)

### 7.1 First reply, by ref

**/pre** (GU-EN-1)
```
Hi [Name], thanks for your message! I'm Yasser from Numidea Labs.

Here's how the Preview works:
• Before any payment, we build ONE working homepage of your new website, with your own content
• It's ready 5 working days after we receive your content
• I present it to you on a 30-minute video call, then you decide

It's free and there's no obligation: if you say no, you owe nothing.

We only build 4 Previews a month, for registered businesses. May I ask you a few quick questions?
```

**/work1** (GU-EN-2)
```
Hi [Name], thanks for your message! I'm Yasser from Numidea Labs. Here's the work from the ad: two live client sites and one portfolio demo.
• Bordj Steel (live client site): B2B site for an Algerian structural-steel company (catalogue, references, careers): https://bordjsteelb2b.netlify.app
• Alliance Travel (live client site): brand, funnel and website for a travel agency in Bordj Bou Arréridj: https://alliancetravel34.netlify.app
• Glaive Store: portfolio demo (a gaming-gear shop we built to show our skills, not a client project)

Would you like to see yours? Our free Preview is one working homepage of your new site, with your content, ready 5 working days after you send it and presented on a 30-minute video call. No payment, and nothing owed if it's a no. It's for registered businesses, max 4 a month.

May I ask a few quick questions about your project?
```

**/price1** (GU-EN-3): send **/prices** (7.7), then:
```
The best way to judge is to see it: we can build your new homepage first, free, ready 5 working days after you send your content, and show it to you on a 30-minute video call. Nothing owed if it's a no. (The Preview is for registered businesses, max 4 a month.) May I ask a few quick questions?
```

**/ref?** (the ref was deleted from the first message; add the "Ref unknown" label)
```
Hi [Name], thanks for your message! I'm Yasser from Numidea Labs. Quick question so I send you the right information: did you see our ad about seeing your new site before you pay, our past work, or our prices?
```

### 7.2 Qualification

**/q** (send together with **/privacy** if they haven't had it yet: this is the first real collection of their data)
```
Just a few questions:
1. What's your business name, and is it registered (trade licence in the UAE, commercial registration in Saudi Arabia)?
2. Do you have a website today? If yes, please send the link.
3. What do you need: a business website (1-5 pages), a larger custom website (6-15 pages) or a web app? In English, Arabic or both?
4. Our prices start at about USD 670 excl. tax for a business website (approximate conversion). Does that fit your budget?
5. When would you like to decide: within the next 3 months, or later?
```

> **A lead is qualified when all four are true:** registered business (Q1), needs a website (Q3), budget at or above about USD 670 excl. tax (Q4), and a decision within 3 months (Q5).
> - All four true: use **/ok**.
> - Any one false: use 7.6.
> - Before booking, check the shared cap of 4 Previews a month (FR + GU-EN + GU-AR).

### 7.3 Qualified: Preview steps

**/ok**
```
Good news: your project qualifies for a Preview. Here's what happens next:
1. You send your content (list below), here or by email to {{EMAIL}}
2. We build your homepage within 5 working days of receiving it (our working days are Sunday to Thursday)
3. We present it on a 30-minute video call, then you decide

No payment before the call, and nothing to pay if it's a no.

One last check: please send your trade licence or CR number. Just the number, please: there's no need to send ID cards, passports, Emirates ID/Iqama or photos of documents. We only use it to confirm your business is registered.
```
Internal: if an ID document or a photo of a document arrives anyway, delete it from the chat and the phone's storage, and note the deletion in the sheet.

**/content**
```
For your Preview homepage, please send whatever you have:
• Your logo (if you don't have one, just tell me)
• Your main services or products (3 to 6), one line each
• A few photos: premises, team, products or projects
• Contact details to show: phone, email, address, opening hours
• Language: English, Arabic or both
• One or two websites you like, in any industry

Please only send photos and texts you have the right to use (and that the people pictured are OK with). Rough drafts are fine: you'll review everything on the call.
```
Internal rule for Preview hosting: host each Preview on a private link (unlisted, set to noindex, password-protected if possible). Take it down after the decision, and within `{{RETENTION}}` after the last exchange at the latest, unless the /keep decision says otherwise.

**/book** (the call date must be at least 5 Algerian working days after the content arrives)
```
Let's book your 30-minute Preview call. Please send me 2 or 3 times that suit you.
• Our hours: Sunday to Thursday, {{HOURS}}
• Monday to Thursday works for both the UAE and Saudi Arabia; Sunday also works for Saudi Arabia
• Time check: Algeria is 3 hours behind the UAE and 2 hours behind Saudi Arabia

I'll send you a Google Meet, Zoom or Teams link (WhatsApp video calls often don't work in the UAE).
```

**/booked**
```
Booked: [day, date] at [time] your time ([time] in Algeria). Link: [meeting link]. Your Preview will be ready for the call. If you need to move it, just reply here.
```

**/remind** (send once, the day before)
```
Hi [Name], a quick reminder: your Preview call is tomorrow, [day] at [time] your time. Link: [meeting link]. See you then!
```

### 7.4 Preview call (30 minutes)

| Min | What |
|---|---|
| 0-3 | Hello, recap their goals |
| 3-15 | Share screen: the homepage on desktop and phone, with the EN ↔ AR switch if it's bilingual |
| 15-22 | What the full site would include; the matching package and its price range ("about", excl. tax) |
| 22-28 | Their questions |
| 28-30 | Next step: a written proposal if they want one, or a clear "no", with nothing owed |

During the call, don't push for a decision, don't promise results or rankings, and don't give dates you haven't checked.

### 7.5 After the call

**/yes**
```
Thank you, [Name]! As discussed, I'll send you a written proposal with the scope, the final price (excl. tax), the timeline and payment terms, along with our legal details. Nothing is due until you accept it.
```
Internal notes:
- The proposal must show `{{LEGAL_NAME}}`, ANAE no. `{{ANAE_NO}}`, NIF `{{NIF}}` and `{{ADDRESS}}`. **Don't send a proposal or invoice until these exist.**
- Before the first proposal, check with an accountant: the UAE/KSA reverse-charge VAT wording, and Saudi withholding tax on payments to non-residents. In chat and ads, only ever say "excl. tax".

**/no**
```
Thank you for your time, [Name]. As promised, you owe nothing. We'll delete the content you sent us within {{RETENTION}} after our last exchange, or sooner if you ask. If things change, you know where to find us. All the best with [business]!
```

### 7.6 Not qualified or not now

**/nolicence**
```
Thanks for being upfront! The free Preview is only for registered businesses (trade licence in the UAE, commercial registration in Saudi Arabia). I'm still happy to send you our price ranges, and once your business is registered, just message us for a Preview.
```

**/budget**
```
Thanks for telling me. To be transparent: our smallest package (a business website of 1-5 pages) starts at about USD 670 excl. tax (approximate conversion). If that's above your budget right now, a Preview wouldn't be a good use of your time. You're welcome to come back whenever it fits.
```

**/later** (deciding in more than 3 months)
```
No problem. As we only build 4 Previews a month, we keep them for projects deciding within 3 months. Would you like me to message you once, closer to the time? If yes, just tell me the month. If not, no worries: you can always write to us here.
```
Only follow up if they say yes, and only once. Add the "Follow-up" label and record the date of their yes and the agreed month in the sheet.

**/followup** (the one agreed follow-up; see the timing rule in 7.8)
```
Hi [Name], it's Yasser from Numidea Labs. You asked me to get back to you around now about your website. Would you like to book a free Preview? If not, no problem: reply STOP if you'd rather not hear from us.
```

**/full**
```
This month's Preview slots are all taken. I can reserve one for you in [month]. Would you like that?
```

**/nofit** (they don't need a website or web app)
```
Thanks for asking! We build websites and web apps, so for [their need] we're not the right studio. Good luck with it!
```

### 7.7 FAQ and objections

**/prices**
```
Our price ranges in USD, excl. tax (approximate conversions at the Bank of Algeria official rate, early Oct 2026):
• Essentiel, business website (1-5 pages): about $670-1,200
• Studio, custom website (6-15 pages): about $1,300-3,100
• Moteur, web app: about $3,400-9,000
• Maintenance: about $130-450 per month

The exact price is set in a written proposal (after your free Preview, if you're eligible for one). Details: {{SITE}}?lang=en&cur=usd&ref=[REF]
```

**/whyfree**: "What's the catch?"
```
No catch: seeing your own homepage is the clearest way to decide. You pay nothing for the Preview, we never ask for card details, and nothing is owed if it's a no. Because each Preview is real work, we only build 4 a month, and only for registered businesses.
```

**/where**: "Where are you? Why an Algerian number?"
```
We're Numidea Labs, a small web studio in Bordj Bou Arréridj, Algeria, led by me, Yasser Hamisse. We work remotely with clients by WhatsApp, email and video calls. Algeria is UTC+1 all year: 3 hours behind the UAE and 2 hours behind Saudi Arabia.
```

**/clients**: "Do you have clients in the UAE or Saudi Arabia?"
```
The client work I can show you is in Algeria: Bordj Steel and Alliance Travel (I can send the links). That's exactly why we offer the Preview: you can judge our work on your own homepage before paying anything.
```

**/arabic**
```
Yes: Arabic-only, English-only or bilingual Arabic/English sites, with proper right-to-left layouts (menus, text and forms mirrored). Your Preview homepage can be in both languages.
```

**/pay**
```
Payment terms are set out in the written proposal, which you only get after the Preview and only if you want to go ahead. We never ask for payment before the Preview.
```

**/tax**
```
Our prices are excl. tax. How tax applies depends on your country and your business's VAT status; it will be stated clearly in the proposal.
```

**/cheaper**: "Why are you cheaper than local agencies?"
```
I can't compare us with other agencies. We're a small studio based in Algeria, our prices are published on our site, and with the Preview you see real work on your own homepage before you spend anything.
```

**/timeline**
```
It depends on the number of pages and features. The proposal gives a clear timeline for your project.
```

**/meet**
```
We work fully remotely, by WhatsApp, email and video call, so our meetings, including the Preview call, happen on video. Our working days overlap with yours Monday to Thursday (and Sunday too for Saudi Arabia); our hours are {{HOURS}}.
```

**/keep**: "Can I keep the Preview if I say no?"
> **Owner decision before launch:** write the answer here. Until it's decided, say: "Good question: I'll confirm that in writing before we start."

### 7.8 Follow-up rule
- Only message people who wrote first. Never use cold WhatsApp, broadcast lists, group contacts, or chat numbers uploaded as ad audiences.
- If a chat goes quiet, send **one** nudge after 2 of your working days, then stop.
- Send /nudge and any agreed follow-up (/followup) only between 09:00 and 18:00 in the prospect's local time, on their working days. Never send either after a no or STOP.

**/nudge**
```
Hi [Name], just checking whether you saw my last message about the Preview. If now isn't the right time, no problem: I won't message again unless you write back.
```

### 7.9 STOP
**Triggers:** STOP, stop, unsubscribe, "remove me", "don't message me", and in Arabic توقف / إيقاف / ايقاف / لا ترسل / إلغاء / الغاء / إلغاء الاشتراك / أوقف الرسائل / لا تراسلني (French triggers: see the FR kit). Treat any clear request to stop as STOP, whatever the language or spelling.

**/stop** (send once, then nothing more)
```
Done: you won't receive any more messages from us. We'll keep only your number, on a do-not-contact list so it stays that way, and delete the rest of our conversation within {{RETENTION}}. All the best!
```
Then:
1. Add the STOP label and record the STOP date in the sheet.
2. Add the number to the shared suppression list (the same list as email).
3. Delete the chat content, any files received, the matching email and the personal details in the sheet row (keep only date, ref, country and STOP for the counts), within `{{RETENTION}}` at the latest. Make sure phone and cloud backups don't keep them. Keep only the number on the suppression list.
4. If the person writes again on their own, answer only what they ask.

### 7.10 Prospect writes in Arabic
Reply in Arabic using the GU-AR kit. Keep the GU-EN label they arrived with, so the ad gets the credit.

---

## 8. Privacy notice

- **Short version:** in the shared greeting and away messages, in French, English and Arabic (purpose line, PRIVACY / DONNÉES / خصوصية, and STOP / توقف).
- **Full version:** send **/privacy** together with **/q** (the first questions about their business), whenever someone replies PRIVACY or asks, and in any case before collecting the licence number or any content.
- **Language:** /privacy is the English notice. Someone who replies DONNÉES (or DONNEES) gets the FR kit's notice; someone who replies خصوصية gets the GU-AR kit's notice.

**/privacy** (safe to send before registration; contains no legal placeholders)
```
Privacy notice: Numidea Labs
• Who we are: Numidea Labs, a web studio run by Yasser Hamisse (founder), Bordj Bou Arréridj, Algeria. Registration as an Algerian auto-entrepreneur is in progress. Contact: here on WhatsApp or {{EMAIL}}
• What we collect: your name, number, business details (including your trade licence/CR number), your answers to our questions, and what you send in this chat for your Preview.
• Why: to reply to you, check your business is eligible, and build and present your Preview. We also count which ad brought you (the code at the end of your first message, e.g. GU-EN-1), in internal totals only.
• Legal basis: your request to us and the steps before a possible contract; for any later follow-up, your consent.
• What's needed: your answers, your licence/CR number and your content are needed to check eligibility and build a Preview; without them we can't offer one.
• Shared only with: WhatsApp (Meta), which carries our messages; the video-call service for your call (Google Meet, Zoom or Teams); our email provider; and our own storage and hosting tools, including the private link that hosts your Preview. We never sell your data or use it for anything else.
• Where: we handle your data from Algeria; the services above may process it in other countries.
• How long: if we don't work together, we delete your data within {{RETENTION}} after our last exchange, or sooner if you ask. If you reply STOP, we keep only your number, on a do-not-contact list, so we never message you again.
• Your rights: ask us any time to see, correct or delete your data, here or at {{EMAIL}}.
• Opt out: reply STOP and we won't message you again.
```
Internal notes:
- **Once registered:** replace "Registration as an Algerian auto-entrepreneur is in progress." with "`{{LEGAL_NAME}}`, ANAE no. `{{ANAE_NO}}`, `{{ADDRESS}}`, Algeria."
- **Once the privacy page is live:** add a last line, "Full notice: `{{PRIVACY_URL}}`". Until then, there is no such line.
- **Rights requests (see, correct, delete):** log each request in the sheet (date and what was asked), reply within 30 days at most, correct or delete the data everywhere it is stored (WhatsApp including backups, the sheet, email, Preview hosting), and confirm in chat.

---

## 9. Tracking by ref

Ads Manager may report conversations started for Gulf ad sets. **Count chats by hand anyway, by ref**, so the numbers compare with France and so a chat is never counted as a lead.

**Sheet columns:**
- Date & time (Algeria) · Ref · Country · Language · Business name
- Registered (Y/N) · Needs website (Y/N) · Budget ≥ ~$670 excl. tax (Y/N) · Decision ≤ 3 months (Y/N)
- **Qualified** (all four Y)
- Preview booked (date) · Preview delivered (date)
- Outcome (open / won / lost) · Follow-up consent (date + month agreed) · STOP (Y/N) · STOP date
- Privacy notes (rights requests, ID documents received and deleted) · Notes

**Routine:**
- **Every day, same time:** count new chats per ref label, copy the spend per ad from Ads Manager, and work out the cost per chat and cost per qualified lead for each ref.
- **Launch day and day 4:** check that both client sites load and that the landing page matches the ads (see the checklist). If a client site is down, pause GU-EN-2 until it's back.
- **Day 4 (Thu 12 Nov):** if one ad has no chats and the other has some, pause the silent one and optionally swap in GU-EN-3. Make no edits before then.
- **Preview cap:** the 4-a-month limit is shared by FR, GU-EN and GU-AR. Track slots in one place; Previews booked late in the campaign may roll into December.
- **After Sun 15 Nov:** record chats, qualified leads and Previews booked per ref. These numbers stay internal and never appear in ads.

---

## 10. Pre-launch checklist

- [ ] `{{HOURS}}` (in FR, EN and AR for the shared messages), `{{EMAIL}}` and `{{RETENTION}}` filled in.
- [ ] Legal placeholders never invented: until registration they appear only in internal notes, never in a message to prospects.
- [ ] No quick reply that goes to prospects contains an unfilled `{{...}}` token. /privacy has no "Full notice" line until `{{PRIVACY_URL}}` is live.
- [ ] Shared profile, greeting and away message agreed with the FR and GU-AR kits (French block first and at least as prominent), French and Arabic checked by native speakers, profile website set to the bare `{{SITE}}`, and each automatic message checked to save in the app.
- [ ] Prices checked against the site's price source at the current Bank of Algeria rate; "about" and "excl. tax" everywhere; package labels match the site's English price page (if it doesn't say "business website", use its label).
- [ ] The Preview conditions (free, no obligation, registered businesses, max 4/month) appear in every Preview ad, and "5 working days" always counts from when the content arrives.
- [ ] Glaive Store labelled "portfolio demo, not a client" in the image, headline and description.
- [ ] Written permission from Bordj Steel and Alliance Travel for paid ads, with a copy kept.
- [ ] Launch day and day 4: bordjsteelb2b.netlify.app and alliancetravel34.netlify.app load; `{{SITE}}?lang=en&cur=usd` shows the same USD ranges in English, labelled approximate and excl. tax; Glaive is labelled as a demo on the site. Pause GU-EN-2 if a client site goes down.
- [ ] Mock-ups use a fictional business only; no flags, emblems or landmarks.
- [ ] Advantage+ creative enhancements off, and carousel auto-ordering off.
- [ ] Each ad has its own prefilled message with the right ref; all ref labels (and the shared "Ref unknown" label) created in WhatsApp Business.
- [ ] Greeting and away messages on; business hours set to Sunday-Thursday `{{HOURS}}`.
- [ ] Quick replies saved, including /privacy, /stop and /followup. PRIVACY, DONNÉES and خصوصية replies routed to the right notice. Suppression list shared with email.
- [ ] Preview hosting set up as private links (unlisted, noindex, password if possible), with a take-down routine.
- [ ] Deletion routine covers WhatsApp (including phone and cloud backups), the sheet, email and Preview hosting; rights-request procedure ready (reply within 30 days at most).
- [ ] Data-protection formalities checked and the outcome recorded: ANPDP declaration requirements under Algerian Law 18-07 for prospect data and transfers abroad; whether Saudi PDPL requires a representative or registration for a controller outside KSA. No claim about either in the copy.
- [ ] No lead forms. No cold WhatsApp. One nudge at most, and nudges and follow-ups only 09:00-18:00 in the prospect's local time.
- [ ] Meeting link tool ready (Meet, Zoom or Teams) for UAE calls.
- [ ] Owner decision recorded for /keep.
- [ ] No proposal or invoice is sent until the ANAE registration details exist; accountant check on UAE/KSA reverse-charge VAT wording and Saudi withholding tax done before the first proposal.
