# What only the owner can supply

The site leaves a place for each item below and shows nothing until the real
thing exists: no placeholders, no invented content. This file is not deployed.
Status as of 2026-11-11 (after the recovery of the old personal page, section 21's last block; before it, on 2026-11-08, the themes were cut to Arcanum and Daylight, section 19, and fleet 4b: the Studio page at /hub/, the critique pass; sections 20 and 21 are new, section 8 gained its list; before it, the owner's answers of 2026-10-30, the fix
fleets of 2026-10-31 and of 2026-11-03, the hub rebuilt as your character
bible and the UX pass of 2026-11-06; sections 16 and 17 record those
answers, and the page now carries them; section 19 lists what the UX pass
left for you to decide; section 20 the copy proposals of the critique, section 21
what the Studio page changed from your design).

| # | Item | Status | Where it goes |
|---|---|---|---|
| 1 | Legal notice + privacy details | **Missing (16 fields; 5 in three languages)**; "later" (owner, 2026-10-30): the pages stay unpublished, the slots stay empty | `scripts/legal-data.mjs` |
| 2 | Client quotes, with consent | None yet | `scripts/voices-data.mjs` |
| 3 | Founder photo | Still open: none yet (monogram "Y" shows, a 64 px mark since 2026-11-06) | `assets/founder.webp` |
| 4 | Team names and photos; the team-size claim | Answered 2026-10-30 and applied on 2026-11-03: one founder, with freelancers when a project calls for them (section 17). The page shows one team row, no initials and no photos | `index.html` #founder, `assets/i18n/*.js` (`team.*`) |
| 5 | A studio email on its own domain | Personal Gmail in use; it stays for now (owner, 2026-10-30) | everywhere one address appears |
| 6 | Clients' permission to appear in paid ads | Not asked yet | campaign kit (not in this repo) |
| 7 | Nomara Voyages: client or not? | Unconfirmed | `index.html` work grid, client logo strip |
| 8 | Arabic native review | Pending; every Arabic string added or changed on 2026-10-31, 2026-11-03, 2026-11-06, 2026-11-07, 2026-11-08, 2026-11-11, 2026-11-14, 2026-11-19 and 2026-11-21 (the recovery's new Studio, brand-book and home keys; the theme toggle's two labels; the Studio page and its five cases above all; on 2026-11-19 the two client courses, la fabrique and the alt texts of the owner's placed artworks, §38 to §41; on 2026-11-21 the courses' critique fixes and the web3 course's nine modules, 1,770 strings, §42) is listed in section 8 and awaits it | `assets/i18n/ar.js`, `scripts/scene-data.mjs`, `scripts/build-og.mjs`, `404.html` |
| 9 | Clients' own domains | None verifies | `scripts/verify-domains.mjs` |
| 10 | Hub fan art | No fan art on the site since 2026-10-28 (still in git history). Not live: nothing has deployed since 2026-10-25, GitHub Actions being blocked on billing (RELEASE.md, "Outage and fallback") | git history of `hub/` |
| 11 | Supabase lead store | Off on purpose | `index.html`, `scripts/legal-data.mjs` |
| 12 | Campaign kit and git history | Kit with the owner | outside this repo |
| 13 | WorkspaceHQ: open source or not | Claim removed (no licence, no README) | `Brvetr4ve1er/workspace-HQ`, then `workspacehq/`, `scripts/scene-data.mjs` |
| 14 | Claims only the owner can confirm | 8 listed: 5 open (F11, the toolchain, now trimmed to what the builds use but still yours to confirm), 3 answered on 2026-10-30 and applied on 2026-11-03 | see section 14 |
| 15 | Hub: your character bible (you and Kūro) | Rebuilt on 2026-11-06 from your own design page; 6 points for your review (the character facts, the day's scenarios, your name's spelling, the "2 a.m." line, the coat's patch, Kūro); the earlier diary points closed with the diary | `hub/index.html`, `hub/app.js` (the rig's lines) |
| 16 | Commercial terms (payment, ownership, hosting, revisions, support, contract, the Aperçu rules) | On the page since 2026-11-03 as FAQ entries, drafted on your instruction of 2026-10-31; yours to change at any time | section 16; `faq3`, `faq7`, `faq8` in `assets/i18n/fr.js` |
| 17 | Team and contact facts | Answered 2026-10-30, on the page since 2026-11-03 | section 17 |
| 18 | The names (person, artist handle, studio, characters) | Closed 2026-11-15 with the set you approved: the person is Yasser Hamisse; the artist handle is br4vetr4veler everywhere (b4vetrave1er.exe retired); the studio is Numidea Labs, Instagram @stick_itty; VOIDSPLUNKER.std is the character-bible project only; tr4veler.exe is the traveler world, Instagram @yass3r.0. The Arabic spelling of the founder's name is now «ياسر حميس» on the Studio (`founder.name` in `hub/src/i18n/ar.json`), AR review; the home's Arabic hero lede still shows the Latin spelling in a `<bdi>` | `hub/src/i18n/*.json`, `hub/bible/index.html`, `hub/brand/numidea/index.html`, `assets/i18n/ar.js` (`hero.lede`); BRAND.md "Night Shift Poster" |
| 19 | The UX pass's questions | 16 asked on 2026-11-06 (IMPROVEMENTS decisions 28 to 43, the recommended option first), plus the sharper captures that need the live sites; nothing changes until you answer | section 19 |
| 20 | Copy proposals (I4): one claim per section heading, ledes that claim, the service taglines, a "je" version of the offer and the FAQ | Proposals only, each beside the current string; nothing on the pages changed (IMPROVEMENTS decisions 46, 47) | section 20 |
| 21 | The Studio page (/hub/): what changed from your design, the pictures it lacks, the claims to confirm | Built 2026-11-07, then the lost content of your old page recovered 2026-11-11 (Behance dossier, "Ce que je fais", plate, diary, three brand books, links from the home); the copy deviations are listed for your yes; 8 kinds of pictures still stand in; the Brand Enhancement question; Arabic unreviewed | section 21; section 8 |

## 1. Legal notice + privacy page
Fill every `null` in `scripts/legal-data.mjs`. `false` means "does not apply"
and is accepted. Then run `npm run build`: it writes `legal/`, adds the
"Mentions légales / Confidentialité" links to the footer and the contact form,
and the page joins the deploy, the sitemap and every gate. Until the last field
is filled, nothing is published and `check.mjs` refuses any link to `legal/`.

Fields: legal name, legal form (e.g. auto-entrepreneur), capital (or `false`),
postal address, contact email, registration label and number (ANAE card / NIF),
publication director, GitHub's postal address (public, in GitHub's terms),
retention period for enquiries, the email for privacy requests, the ANPDP
declaration status (or `false`), the licence for the site's text and images
(`cc0` keeps the current LICENSE; `reserved` reserves them), the date of the
review, and, since 2026-10-31, two facts about how leads arrive:
`privacy.metaAds` (does the studio run Facebook/Instagram ads?) and
`privacy.whatsappBusiness` (is the number on the WhatsApp Business app?). For
those two, `true` prints the sentences, `false` drops them (the ad section
and its "et les publicités" clause go, and the WhatsApp Business sentence with
them), and `null` blocks publication like any other field. Preview with the
gaps marked: `node scripts/build-legal.mjs --preview` → `legal-preview/`
(never deployed). One thing to know before answering `metaAds: false`: the ad
section is also the only place the privacy page explains how `?ref=`, `utm_*`
and a Meta or Google click id are handled, and the site carries them into the
email and the WhatsApp text whether or not an ad brought the visitor. If the
answer is no, say so and a short neutral paragraph on campaign codes replaces
the section; nothing is invented meanwhile.

Five of those are text that changes with the language, so each takes one
value per language, `{ fr, en, ar }`: the legal form, the capital, the
registration label, the retention period and the ANPDP status (for example
`retention: { fr: '3 ans après le dernier échange', en: '3 years after the
last exchange', ar: '3 سنوات بعد آخر تواصل' }`). A plain string there counts
as missing in all three languages. Names, numbers, addresses and emails take
one value. The build counts 16 fields (26 gaps counting each language); a
translated field with gaps counts once per missing language.

The hosts list names GitHub only. If the Netlify or Vercel mirror is public,
add `'netlify'` / `'vercel'` to `hosts` so the privacy page names every host
that serves the site.

The footer shows only "© 2026 Numidea Labs". It used to add "Tous droits
réservés", but the repository's LICENSE is CC0 (public domain), and the two
contradicted each other. Choose with `ip.licence`: `cc0` keeps the LICENSE as
it is; `reserved` means changing the LICENSE (for example to cover the code
only) before the footer says "all rights reserved" again.

## 2. Client quotes (voices)
Add an entry to `VOICES` in `scripts/voices-data.mjs`, then `npm run build`.
The quote appears under the work grid and on that client's project sheet, in
the language the client gave it. The build refuses an entry without a past
consent date and a note of where the consent is kept, a quote over 280
characters, or a client that is not a delivered one (never the Glaive demo or
WorkspaceHQ). Only Bordj Steel, Alliance Travel, AlmaFlowClim and Nomara
Voyages can be quoted. Get written agreement to the exact text.

## 3. Founder photo
A real photo, never a generated face: square, at least 400 px, saved as
`assets/founder.webp`. In `index.html` (#founder, `.fd-photo`), uncomment the
`<img>` line; the monogram steps aside. Run `npm run bump`. Still open on 2026-11-06.
No stand-in face or monogram stands in the card meanwhile (the old 'Y' mark is gone). Since
2026-11-08 (Fleet 6 round 2) the card's right column holds an engraved plate instead, the Arch of
Trajan at Timgad (`assets/illus/arch.webp`, the studio's own atlas, Pl. III), with crop marks and a
caption, and it stays when the photo arrives: the photo goes beside the name (`.fd-photo`).

## 4. Team
**Answered on 2026-10-30: one founder, with freelancers when needed** (section
17). Applied on 2026-11-03, in all three languages: the hero lede names the
founder as designer-developer who calls on freelancers when a project needs
them, the team block is one row (`team.fFn`, `team.fDo`) under the heading
`team.h`, the initials D, S, T and their rows are gone, and the brand-identity
service no longer says "a four-person studio". There are no team photos to
supply: there is no team to show. The hub's line "an agency of one" stays as
the owner chose on 2026-10-28; it no longer contradicts the home page.

## 5. Studio email on its own domain
Today every contact point uses `hamissemohamedyasser@gmail.com`. Once a domain
mailbox exists, replace the address in `index.html` (links, text and the
JSON-LD), `assets/app.js` (the form's mailto) and `hub/index.html`, then
`npm run check`. It fails until all of them match. The domain also gives a
stable address for the legal page and for cold email (SPF, DKIM, DMARC).
Pointing the site itself at the domain is in [RELEASE.md](RELEASE.md#6-domain-and-dns).

## 6. Clients' permission for paid ads
The Bordj Steel and Alliance Travel ad cards (campaign kit) need each client's
written permission before they run in paid ads. An email or WhatsApp message
is enough; keep it.

## 7. Nomara Voyages
Shown as delivered work. Confirm it is a real client with permission to show
the site; otherwise it comes off the work grid, the hero plate, the counts and
the client logo strip (its `<li>` in index.html, `assets/clients/nomara.webp`,
its rule in styles.css and its block in `scripts/client-logos.mjs`), and its
card's benefit line (`proj6.gain` in app.js); `nomara` then leaves
`VOICE_CLIENTS` in `scripts/voices-data.mjs`, the list `check.mjs` holds the
strip and the benefit lines to.

The logo strip ("Ils nous ont confié leur site") shows each client's own
logo, in one theme colour. Using a client's logo on the studio's site is
usually agreed with the client; the same email or WhatsApp message as for
item 6 can cover it.

## 8. Arabic native review
**Every Arabic string added or changed on 2026-10-31, 2026-11-03,
2026-11-06, 2026-11-07, 2026-11-08, 2026-11-11, 2026-11-14, 2026-11-15, 2026-11-19 and 2026-11-21 awaits native review** (the lists are at the end of this section,
"Written on 2026-10-31", "Written or changed on 2026-11-03", "Written or
changed on 2026-11-06", "Written or changed on 2026-11-07", "Written or changed on 2026-11-08", "Written or changed on 2026-11-11", "Written or changed on 2026-11-14", "Written or changed on 2026-11-15", "Written or changed on 2026-11-19", "Also written on 2026-11-19" and "Written or changed on 2026-11-21"); nothing Arabic written by the fix fleets has been
read by a native speaker.

The Arabic copy was written for this site and needs a native speaker's pass.
Conventions to keep: Western digits, forward arrows `←`, singular "you", brand
names in Latin script except نوميديا in prose. Points worth a second look:
- the services title (`svc.title`) reads as a question but ends with a period;
- "Shopify بواجهة مستقلة (headless)";
- the tag pills;
- the estimator's counted nouns (`price.*.n` in app.js: one, two, 3–10, 11–99,
  100+, e.g. «60 منتجاً», «16 أسبوعاً»);
- the privacy paragraph on ad parameters (`scripts/build-legal.mjs`);
- the Gulf versus Maghreb word choices in the campaign kit.

Written or changed in October 2026 (round 5), in `assets/app.js`; each says
what its French and English counterparts say:
- `founder.skillsNote`, the CV's "about 20 % less production time":
  «تقليص وقت الإنتاج بنحو 20٪ بفضل دمج أدوات الذكاء الاصطناعي.» (the
  "currently learning" half is unchanged);
- `f1.brief` and `f3.brief`, each one sentence shorter (their tool lists
  went; the pills under them name the tools);
- `faq2.a`: no-break spaces in «90 000 دج», and the new «(وباليورو والدولار
  في القسم نفسه)»: since 2026-11-03 the word is اليورو (it was الأورو, Maghreb
  usage), and the timeline's dates are numbered months; for the reviewer to
  confirm
- the contact form's copy button and its two lines: `form.copy`
  «نسخ رسالتي», `form.copied`
  «نُسخت رسالتك. الصقها في بريد إلكتروني جديد إلى العنوان أعلاه.» and
  `form.copyFail` «تعذّر النسخ: رسالتك محدَّدة، انسخها بنفسك.»

Written on 2026-10-26 (owner decisions), in `assets/app.js`:
- `proof.line`, the trust line that replaced the four counters under
  «01 — الإثبات»: «4 مواقع مُسلَّمة · الردّ في أقل من 24 ساعة عمل ·
  بالفرنسية والإنجليزية والعربية» (French: "4 sites livrés · réponse < 24 h
  ouvrées · FR · EN · AR"). The languages are written out as in
  `contact.vReply`; the title block lists them Arabic first
  (`tb.langV`). Which order reads better here?
- `work.lead`, the line under «أعمال مختارة.», now that the two cards in
  progress are off the page: «مواقع عملائنا، تصفّحها بنفسك، إضافةً إلى عرض
  تجريبي.» (French: "Les sites de nos clients, à visiter vous-même, et une
  démo de portfolio."). The clause «ومشروعين قيد الإنجاز» was dropped; does
  «عرض تجريبي» alone say "a portfolio demo" here, as it does on the card's
  pill (`work.concept`)?
- renumbered when the tools section («أدوات متينة») and its plate left the
  page; only the number changed in each: `pl.light` «لوحة 4 — رأس كاربون ·
  بجاية», `pl.dunes` «لوحة 5 — العرق الكبير». `faq.kicker` and
  `contact.kicker` were renumbered too, then again when the method section
  left; their current values are in the "renumbered again" item below. The
  section's own strings (`stack.*`, `pl.strata`) are gone and need no
  review.
- `hero.cta2`, the hero's second button, which now opens WhatsApp with
  the Aperçu message (`prev.waText`, unchanged) instead of leading to the
  projects: «راسلنا عبر واتساب» (French: "Écrire sur WhatsApp"; English:
  "Chat on WhatsApp"). It replaced «شاهِد أعمالنا». The verb follows
  `form.successAlt` («راسلنا مباشرة»); is «عبر واتساب» or «على واتساب»
  more natural on a button?
- nothing new from the footer trim: its column headings
  (`footer.studioH`, `footer.contactH`, `footer.founderH`), the signoff
  (`footer.signoff`) and the WorkspaceHQ cartridge (`whq.kick`, `whq.sub`)
  left the page and need no review.
- `price.estHint`, the new line under «قدّر مشروعك» now that the
  estimator is folded under the tiers (its title, `price.estH`, is
  unchanged): «الأتمتة، المتجر الإلكتروني، الهوية البصرية، الخيارات خارج
  الباقة، والتنفيذ المستعجل: ما لا تُسعّره الباقات.» (French:
  "Automatisation, e-commerce, identité visuelle, options hors formule et
  délai accéléré : ce que les formules ne chiffrent pas."). The items repeat
  the estimator's own labels (`price.tyAuto`, `price.tyShop`,
  `price.tyBrand`, `price.qOpts`), except «التنفيذ المستعجل» for
  `price.paceRush` «مستعجل»; is «تُسعّره» right for "price", as in
  `price.moreSum` «كيف نسعّر»? Changed on 2026-10-27: «الخيارات» became
  «الخيارات خارج الباقة», the opposite of the estimator's «ضمن الباقة»,
  since every option is already in the Studio or Moteur package; is
  «خارج الباقة» natural, or «غير المشمولة في الباقة»?
- the path in the Aperçu card (`prev.tl1`–`prev.tl5`), which now tells the
  method's steps too, since the method section («أربع خطوات. بلا مفاجآت.»)
  left the page. Read as one list under «قبل أيّ دفع، نبني…»:
  - moved word for word from the method (`price.ob1h`, `price.ob1p`,
    `price.ob2h`, `price.ob2p`): `prev.tl1` «تصف المشروع», `prev.tl1p`
    «دقيقتان، كتابةً أو مشافهة. بالفرنسية أو الإنجليزية أو العربية.»,
    `prev.tl2` «نعود إليك خلال 24 ساعة عمل», `prev.tl2p` «بأسئلتنا أولاً، ثم
    بنطاق عمل مكتوب وسعر نهائي بمجرّد أن نتّفق معاً على هذا النطاق. ليس سعراً
    تقريبياً، بل رقمٌ واحد.»;
  - renumbered, words unchanged: `prev.tl3d` «5 أيام عمل», `prev.tl4`
    «نعرضها عليك», `prev.tl4d` «في مكالمة فيديو من 30 دقيقة», `prev.tl5`
    «أنت تقرّر», `prev.tl5d` «المدفوع حتى الآن:»;
  - joined on 2026-10-27, so the client's one task before the build stays
    in the path: `prev.tl3` «ترسل إلينا محتواك، ونبني صفحتك الرئيسية»
    (French: "Vous envoyez votre contenu, on construit votre page
    d'accueil"), the card's old first step «ترسل إلينا محتواك» and its old
    build step «نبني صفحتك الرئيسية», both in their earlier words; does
    the joined sentence read naturally as a step title?
  - new, the second half of the method's last step made to stand alone:
    `prev.tl5p` «إن كان الجواب نعم، فالصفحة الرئيسية جاهزة بالفعل: ننتقل
    مباشرة إلى بقية العمل.» (French: "Si c'est oui, la page d'accueil est
    déjà faite : on enchaîne sur le reste.").
- `prev.brief`, the line above the path, cut on 2026-10-27 to what the
  path does not say, since the path now gives the 5 working days and the
  30-minute call: «قبل أيّ دفع، نبني الصفحة الرئيسية لموقعك الجديد بمحتواك
  أنت. إن قلت لا، فلا شيء عليك.» (French: "Avant tout paiement, on
  construit la page d'accueil de votre nouveau site, avec votre contenu. Si
  vous dites non, vous ne devez rien."). Only «، خلال 5 أيام عمل، ونعرضها
  عليك في مكالمة فيديو مدّتها 30 دقيقة» was removed; does the shorter
  sentence still read well?
- `faq2.a` now ends with a link to the card instead of restating the offer:
  «انظر أيضاً <a>المعاينة</a>.» (French: "Voir aussi l'Aperçu."; English:
  "See also the Preview."). «انظر أيضاً» or «اطّلع أيضاً على»?
- `faq6.a` loses its last sentence and ends at «… من التصميم إلى النشر.»
- renumbered again when the method section left the page; only the number
  changed in each: `price.kicker` «04 — الأسعار», `founder.kicker` «05 —
  الفريق والمؤسّس», `faq.kicker` «06 — الأسئلة», `contact.kicker` «07 —
  تواصل». The section's own strings (`how.*`, `price.ob*`) are gone and need
  no review; `nav.about` «المنهج» is unchanged and now leads to the card.

Written on 2026-10-31 (the fix fleet), each saying what its French and
English counterparts say; none read by a native speaker yet:
- the Arabic share card's texts, in `assets/i18n/ar.js`: `meta.ogDesc`,
  `meta.twDesc` (the Aperçu promise, as the French og and twitter
  descriptions say it) and `meta.ogAlt`;
- the card itself, `assets/og-ar.jpg`, drawn by `scripts/build-og.mjs`
  (`CARDS.ar`): the kicker «المعاينة · عرضنا المميّز», the subtitle, the foot
  line «استوديو ويب · برج بوعريريج · العربية · الفرنسية · الإنجليزية» and the
  plate caption «لوحة 2 — قوس تراجان · تيمقاد»;
- the price guide's eight keys in `assets/i18n/ar.js` (`tarifs.title`,
  `tarifs.desc`, `tarifs.crumbAria`, `tarifs.kicker`, `tarifs.h1`,
  `tarifs.lead`, `tarifs.link`, `tarifs.navLink`), baked into
  `ar/tarifs/index.html`;
- `price.lead`, changed in the three languages so that it no longer says the
  market comparison is beside the prices (it is on the guide now); the
  Arabic change is machine-drafted.
Nothing else Arabic changed that day: the ad and WhatsApp Business sentences
of the privacy page are the existing ones, now conditional (section 1), and
the language switch's ع is drawn, with its `aria-label` «العربية (ع)»
unchanged.

Written or changed on 2026-11-03 (the second fix fleet; the strings follow
the new French, none read by a native speaker; key names only). By area:
- the home dictionary, `assets/i18n/ar.js`, added: `team.fFn`, `team.fDo`,
  `faq7.q`, `faq7.a`, `faq8.q`, `faq8.a`, `form.waInstead`, `form.subjPrev`,
  `form.subjEst`, `form.subj`;
- the home dictionary, changed: `title`, `meta.desc`, `nav.about`, `nav.team`,
  `hero.eyebrow`, `hero.title`, `hero.lede`, `hero.cta1`, `tb.previewV`,
  `tb.replyV`, `proof.line`, `proj2.desc`, `proj4.desc`, `work.sheet`,
  `scene.cta`, `founder.kicker`, `founder.title`, `founder.lead`,
  `founder.bio`, `fx1.when`, `fx3.when`, `fx4.when`, `fx5.when`,
  `tag.designSystems`, `mbar.cta`, `proj2.alt`, `proj3.alt`, `proj4.alt`,
  `proj6.alt`, `proj7.alt`, `team.h`, `faq2.a`, `faq3.q`, `faq3.a`, `faq4.a`,
  `faq5.a`, `faq6.a`, `contact.sub`, `contact.vReply`, `contact.waNote`,
  `form.send`, `form.success`, `footer.rights`, `wa.hello`, `prev.tl2`,
  `prev.tl2p`, `prev.promise`, `prev.msg`, `prev.waText`, `prev.outcome`,
  `f3.promise`, `c4.brief`, `c5.name`, `c5.brief`;
- the price guide's keys, in the same file (they bake into
  `ar/tarifs/index.html` and the Arabic page's price section): `mk.note`,
  `price.lead`, `price.t2c`, `price.t2e`, `price.t3c`, `price.oDs`,
  `price.estCta`, `tarifs.lead`;
- the project sheets, `scripts/scene-data.mjs`: `UI.ar` keys `title`, `desc`,
  `crumb`, `lead`, `group`, `act`, `by`, `index`, `sheet`, `skip`, and the
  Bordj Steel sheet's `identity` line.
Choices to check in them: the founder's name stays in Latin script in
`hero.lede` (item 18); the brand is "Numidea Labs" in Latin script in
`footer.rights`, `wa.hello` and `prev.waText`; «اليورو» replaces «الأورو»
in the money sentences (this answers the earlier question about Maghreb usage); the CV
dates are numbered months (`fx1.when` and the three after it), no longer the
Maghreb month names; «حزمة تصميم» for "kit graphique" and «وسند طلب موقّع»
for "bon de commande signé" are the drafter's judgement.

Written or changed on 2026-11-06 (the UX pass; ccc4b42, 8fe0f45; none read
by a native speaker). By kind:
- changed words: `hero.eyebrow`, now «استوديو ويب · برج بوعريريج · AR · FR ·
  EN», the codes in a `<bdi>` and held on one line, where it said «مواقع
  بالعربية أو الفرنسية أو الإنجليزية»: the Arabic language names gave way to
  the same short codes as the French and English eyebrows (IMPROVEMENTS
  decision 30 asks whether to keep them); `founder.cvBtn` «عرض المسار ↓»,
  only its arrow changed (it was ↴, which read as a stray comma);
- new keys, in `assets/i18n/ar.js`: `ui.resume` «استئناف التناوب» (the hero
  plate's pause button once pressed), `price.estHello` «مرحباً، هذا مشروعي:»
  (the line above the estimate carried into the message), `faq.ask` «سؤال
  آخر؟» (the line that closes the FAQ), and the price guide's jump row,
  `tarifs.jTiers` «الباقات», `tarifs.jEst` «المقدِّر», `tarifs.jMk`
  «الأسواق», `tarifs.jMd` «النماذج», `tarifs.jFaq` «الأسئلة الشائعة»;
- unchanged words, the Latin runs now isolated in `<bdi>` so the comma and
  the brand sit on the right side of them (read them for the flow, not the
  words): `hero.lede`, `proj4.desc`, `founder.lead`, `fx2.what`, `fs2`,
  `founder.certs`, `tag.seo`, `faq3.a`, `faq8.a`, `mk.note`, `md.fW`,
  `price.t1c`, `price.t1d`, `price.t2e`, `price.oSeo`, `f1.brief`,
  `c1.brief`, `c4.brief`, `c5.brief`;
- the legal page, `scripts/build-legal.mjs`: the fonts sentence gains a
  clause for the one face under the Apache License 2.0 (the hub's Permanent
  Marker), «، و… بترخيص Apache License 2.0», after the OFL faces.
Left plain on purpose: Arabic text in attributes and titles (alt, aria
labels, the meta tags, the mail subject, the WhatsApp texts, placeholders)
cannot carry a `<bdi>`, so its Latin runs are as they were.

Written or changed on 2026-11-07 (fleet 4b; none read by a native speaker).
Each key is "AR review: <key>".

- the home and the price guide's dictionaries (`assets/i18n/ar.js`):
  `mbar.cta` (now «معاينتي», was «معاينتي المجانية»; the phone bar's label is
  one word so it fits on one line), `work.sheet` (only the hidden trailing
  arrow glyph left; the wording is unchanged); a66a2df and b9829d3 also wrote
  ranges in words, made arrows `aria-hidden` and fixed one offer label (the
  keys are in those commits' diffs);
- the Studio page, `hub/src/i18n/ar.json` (333 keys; the design's own Arabic
  kept where the page kept the sentence, the keys below are new or rewritten):
  - `ui.title`, `ui.desc`, `ui.skip`, `ui.ogAlt`; `nav.aria`, `nav.home`,
    `nav.lang`; `sting.skip`, `sting.skipL`; `hero.live`, `hero.still`;
  - the rig: `rig.alt`, `rig.poke`, `rig.pokeKuro`, `rig.said`,
    `rig.mood.base`; the wedge: `wedge.oursR`, `wedge.kuro`;
  - services: `services.lead`, `services.actor`, `services.items.0.alt` to
    `services.items.3.alt`, `services.items.1.weeks` to
    `services.items.3.weeks`;
  - the Aperçu: `preview.lead`, `preview.steps.1.d`, `preview.steps.2.d`,
    `preview.alt`;
  - the process: `process.steps.1.d` to `process.steps.4.d`,
    `process.steps.4.m`, `process.steps.0.alt` to `process.steps.4.alt`;
  - pricing: `pricing.title`, `pricing.lead`, `pricing.size`,
    `pricing.pace`, `pricing.care`, `pricing.careL`, `pricing.dz`,
    `pricing.eu`, `pricing.us`, `pricing.running`, `pricing.sources`,
    `pricing.noJs`, `pricing.kuroAlt`; brand: `brand.pick`; tech:
    `tech.items.0.statL`;
  - proof: `proof.title`, `proof.lead`, `proof.actor`, `proof.own`,
    `proof.glaive`, `proof.whq`;
  - the lab: `lab.lead`, `lab.bible`, `lab.bibleD`, `lab.items.0.t` to
    `lab.items.8.t`, `lab.items.0.alt` to `lab.items.8.alt`;
  - the founder: `founder.teamL`, `founder.team.0.r`, `founder.team.0.d`,
    `founder.modesAlt.0` to `founder.modesAlt.2`, `founder.photo`,
    `founder.duo`, `founder.deskAlt`, `founder.stickersAlt`,
    `founder.bible`, `founder.cv`;
  - `faq.actor`; contact: `contact.lead`, `contact.hours`, `contact.waK`,
    `contact.previewK`, `contact.signAlt`; footer: `footer.line`,
    `footer.site`, `footer.bible`, `footer.nav`; the case shell: `case.prev`,
    `case.next`, `case.drag`, `case.close`, `case.zoom`, `case.new`,
    `case.seen`, `case.unlocked`, `case.open`, `case.newTab`;
  - the sting's HUD stays in Latin («06:12 · BORDJ BOU ARRÉRIDJ · DAWN»), as
    the design has it: confirm;
- the five cases (`hub/src/cases/<slug>.i18n.json`, keys under
  `cases.<slug>.`):
  - Bordj Steel: every `cases.bordjsteel.*` key;
  - Alliance Travel: `dn.cairo-sharm` (مصر / القاهرة + شرم), `dn.bali`
    (بالي / مدرجات الأرز والمعابد), `dn.kuala-lumpur` (كوالالمبور / ماليزيا),
    `dn.vietnam` (فيتنام / خليج ها لونغ), `dn.tunisie` (تونس / سيدي بوسعيد),
    `chart` (الدليل البصري), `chartAlt`, `carousel` (كاروسيل · CANVA),
    `alt.aze`, `prevPage`, `nextPage`, `nextSlide`; the keys of the case's
    first pass were not re-read;
  - AlmaFlowClim: `tag`, `track`, `logo`, `mockup`, `cover.s`, `site.h`,
    `site.fv.0` to `.2`, `site.fl.0` to `.2`, `data.k`, `data.al`,
    `data.bl`, `data.n`, `post.k`, `post.next`, `post.h.0` to `.2`,
    `post.s.0` to `.2`, `quote.k`, `quote.svAria`, `quote.townAria`,
    `quote.minus`, `quote.plus`, `quote.demo`, `seo.k`, `seo.gbp`, `seo.a`,
    `seo.days`, `mk.cards`, `mk.hanger`, `alt.tech`, `alt.cards`,
    `alt.hanger`, `alt.van`, `alt.shop`, `alt.phone`, `alt.ac`, `night`,
    `brand.k`, `brand.t`, `scope.k`, `scope.n`, `scope.note`,
    `scope.items.1`, `scope.items.7`, `scope.cta`;
  - Traveler: `track`, `real.label`, `real.prev`, `real.next`,
    `shelf.group`, `atlas.s`, `mock`, `ws.lv`, `ig.sheet`, `peace.k`,
    `end.items.6`, `alt.quote`, `alt.ink`, `alt.hoodie`, `alt.flat`,
    `alt.stickers`, `alt.store`, `alt.worn` (the rest is the design's own);
  - Heetch: `hud`, `tag`, `cover.s` (uses «ماي 2026»: check the Algerian
    spelling of the month), `published`, `type.code`, `alt.phone`,
    `alt.merch`, `alt.bill`, `alt.duo`, `plan.fmt.0` to `.2`, `end.k`,
    `end.chip`, `end.t`, `end.big`, `end.note`, `end.items.0` to `.5`,
    `end.cta`, `track`, `prevPoster`, `nextPoster`.

Written or changed on 2026-11-08 (the themes cut to Arcanum and Daylight; none
read by a native speaker). Each key is "AR review: <key>". The toggle's label
names the theme it switches to; the theme names are as they were
(`theme.arcanum` «أركانوم», `theme.daylight` «نهاري», unchanged):
- AR review: `theme.toArcanum`, new: «التبديل إلى أركانوم (داكن)», the toggle's
  label and tooltip while Daylight is on (also the visible text of the button
  in the phone menu);
- AR review: `theme.toDaylight`, new: «التبديل إلى النهاري (فاتح)», the same
  while Arcanum is on;
- removed with their themes, nothing to review: `theme.noir` «أسود»,
  `theme.mono` «أحادي اللون», `theme.altneon` «نيون بديل», `theme.engineering`
  «هندسي».

Written or changed on 2026-11-08 (Fleet 5: the home and the Studio; none read
by a native speaker). Each key is "AR review: <key>":
- AR review for the home: `hero.lede`, `hero.terms`, `work.lead`, `work.demo`,
  `pl.vista`, `pl.dunes`, `contact.vReply` (the merged reply and UTC+1),
  `founder.langs`, `founder.xp`, `founder.basedL`, `founder.recent`, and the
  seven kicker keys (the digits are dropped, nothing else). The en and fr texts
  are in the commits;
- AR review for the home, Fleet 7 round 2: `prev.tl3` (shortened to «ترسل إلينا محتواك») and `prev.tl3p` (new: «ونبني صفحتك الرئيسية.», the sentence that used to end the step's title); the work rows' visitor line shows its label «للزائر» on the lead row only (no copy change).
- AR review for the home, Fleet 6 round 2: `work.outcome` (new: the label «للزائر» over each work row's benefit line, "for the visitor"), `pl.arch` (new: the founder's plate caption «لوحة 3 — قوس تراجان في تيمقاد»), `proj2.desc`, `proj3.desc`, `proj4.desc` (shortened to two lines);
- Fleet 6 closing (2026-11-08): no further Arabic key changed after rounds 1 and 2 (the hub's Arabic faces are a font preload, no copy). The bible's footer and project page are English only and have no Arabic;
- AR review for the home, Fleet 6 round 1: `price.lead` (cut to one sentence), `price.tIncl` (new: the disclosure's label); the planche label's figures (`3/6`, CSS content in `assets/styles.css`) carry no Arabic word, say if one is wanted;
- AR review for the Studio: `proof.lead`, `proof.vs.kicker`, `proof.vs.tag`,
  `proof.vs.sub`, `proof.vs.desc`, `proof.vs.facts` (four chips),
  `proof.vs.cta`, `proof.vs.lang`, `proof.vs.alt`, `footer.bible`;
- the Arabic phone number and mail key (`contact.waK`, `contact.mailK`) now
  carry invisible bidi and zero-width characters (U+2066, U+2069, U+200B) so they
  read left to right inside Arabic text: check they paste and read right;
- the retired home keys are deleted in fr, en and ar (an older cached app.js
  does not reference them), nothing to review.

Written or changed on 2026-11-11 (the recovery of the old personal page; none
read by a native speaker). Each key is "AR review: <key>". The home's restored
descriptions and taglines are your own words from the 3 November dictionary and
are not listed as new; what follows is new or changed.
- AR review for the home and the tarifs/scene pages: `contact.tzNote`
  (the time-zone note under the hours), `founder.studio` and `founder.bible`
  (the two links from the founder card to the Studio and to the English-only
  bible), `footer.studio` (the footer's link), `scene` card label `ui.full`
  («عرض اللوحة كاملة», the fold under the Glaive Store and WorkspaceHQ
  cards in `scripts/scene-data.mjs`);
- AR review for the Studio (`hub/src/i18n/ar.json`): `wedge.close.a`,
  `wedge.close.b` (the closing line of the wedge), `brand.more` (the link to
  the three brand books), `proof.be.*` (dossier 08 "Sur Behance": `kicker`,
  `name`, `tag`, `sub`, `cta`, `case`, `listLabel` and the twelve covers'
  `items.0` to `items.11` with their `title` and `alt`; the project titles are
  Latin as on Behance), `proof.whqCart.kick`, `proof.whqCart.sub` (the
  WorkspaceHQ cartridge ticket, which replaces `proof.whq`), `lab.diary.kicker`,
  `lab.diary.title` and `lab.diary.items.0` to `.7` (the eight titled prints),
  `founder.handle`, `founder.eyebrow`, `founder.motto` (kept in English as your
  signature), `founder.plate`, `founder.plateAlt` (the plate caption; its mixed
  Latin and Arabic date line reads slightly jumbled in bidi, so look at it),
  `founder.make.title`, `founder.make.aside`, `founder.make.design`,
  `founder.make.diary` and `founder.make.items.0` to `.2` (`role`, `line`,
  `alt`);
- AR review for MERCURY (dossier 07), whose nine key frames became your five
  posters on 2026-11-11: `proof.mc.facts.1` («5 ملصقات»), `proof.mc.framesLabel`
  and `proof.mc.frames.0` to `.4` (one description per poster; the titles stay
  Latin as on the posters);
- AR review for the cases: AlmaFlowClim `brand.k`, `brand.t`, `brand.cta` and
  `scope.items.7` (the brand-book tile and delivered item; `brand.k` now reads
  "14 PLANCHES" with the new plates), Traveler
  `peace.cta` and `end.items.6` («الكودكس» for the codex, back at the end of
  the closing list);
- the brand books are French only (AlmaFlow, Traveler) and English only
  (Numidea's identity), like the bible, so they carry no Arabic to review.

Written or changed on 2026-11-14 (the mobile pass; none read by a native
speaker):
- AR review: `prev.more` («كل الخطوات بالتفصيل», the home's folded Aperçu steps);
- AR review: `ui.zoomIn` («المس للتكبير»), `ui.zoomOut` («المس للملاءمة مع
  الشاشة») and `ui.tech` («البطاقة التقنية») on the project sheets
  (`scripts/scene-data.mjs`);
- AR review: the Studio's `nav.menu` («القائمة») and `nav.menuClose` («أغلق
  القائمة») (`hub/src/i18n/ar.json`).

Written or changed on 2026-11-14 (Google tag; the privacy page of
`scripts/build-legal.mjs`, unpublished until the owner fields are in; none read
by a native speaker):
- AR review: the "On your device" paragraph, rewritten because the site now
  loads Google Tag Manager with every consent signal refused: «لا تُخزَّن أي
  ملفات تعريف ارتباط. يحمّل الموقع Google Tag Manager …» (no cookies; Google
  receives only cookieless, anonymous pings for aggregate audience measurement;
  no advertising, no profile; no other third-party request);
- AR review: in the ads paragraph, «ولا يحتوي هذا الموقع على بكسل Meta ولا على أداة
  تتبّع إعلانية» (no Meta pixel and no advertising tracker; it said "no pixel or
  tracker") and the new ending «ومع عنوان الصفحة المعروضة في قياس الزيارات المذكور
  أدناه» (the page address goes with the audience pings);
- AR review: in "Who has access", «Google (البريد، وقياس الزيارات المذكور أدناه)».

Owner to confirm (not Arabic): the VOIDSPLUNKER dossier on the Studio says only
what the bible page prints; confirm that the character bible is a studio
project (not a client, not "the artist's page") and that "English only" is
the wording you want on its button. Open as before: decision 22 (bible footer
"agency of one"), §15 (the "2 a.m." voice), Q45, the founder photo slot, the
Instagram handle.

Arabic display and Latin digits: Reem Kufi and Aref Ruqaa (the Studio's
Arabic display and hand faces) are Arabic-script subsets without Latin digits,
so Arabic display text with digits falls back to the next family.

Files: the dictionaries `assets/i18n/ar.js` (the `ar` block carries a
banner; since 2026-10-31 the three languages are one file each, no longer in
`assets/app.js`), the `UI.ar` and project `ar` texts in
`scripts/scene-data.mjs`, `CARDS.ar` in `scripts/build-og.mjs`, and the
`lang="ar"` lines in `404.html`.

Written or changed on 2026-11-15 (the creative-audit moves: the premise, the
night workshop band, the founder's scene, the 404, the Studio's two doors and
"Start here", the seal; none read by a native speaker; every Arabic string
below is **AR review**). The approved premise is the source: FR first, EN and AR
translated from it.
- AR review, home dictionary `assets/i18n/ar.js`: `atelier.kicker`,
  `atelier.title` («ورشة الليل.»), `atelier.line` (the premise), `atelier.cta`
  («ادخل الورشة»), `atelier.alt` (the diorama's alt text); `founder.sceneAlt`,
  `founder.sceneCap` (the founder's drawn portrait); `seal.est` («تقدير») and
  `seal.sent` («أُرسل»), the two stamp words;
- AR review, `404.html` (inline, `lang="ar"`): the line under the facepalm
  panel («أما الورشة فما زالت مفتوحة.») and the image's alt text («ياسر يضع يده
  على وجهه»); the label «Kūro» stays in Latin script on purpose;
- AR review, the Studio `hub/src/i18n/ar.json`, new: `doors.aria`,
  `doors.kicker`, `doors.premise` (the premise), `doors.skip`,
  `doors.a.{k,t,d,go,preview,pricing,work,contact}`,
  `doors.b.{k,t,d,go,bible}`, `start.{kicker,title,aria,see,bible}`,
  `start.day.{k,d}`, `start.night.{k,d}`, `start.real.{k,d}`, `nav.world`,
  `nav.groupSite`, `nav.groupWorld`;
- AR review, the Studio, changed values: `sting.hud` (the English line, as
  before), `proof.vs.tag` («دفتر الشخصيات»), `footer.bible`, `founder.name`
  («ياسر حميس»); the bible is «الدفتر» in `doors.b.bible` and `start.bible`.
  The Studio's English and French counterparts carry the same keys;
- the bible and the brand books are English only; the premise sentence added
  to the bible's cover is English and has no Arabic to review.
- AR review (2026-11-16, the calculator), `assets/i18n/ar.js`, new:
  `price.lnUpTo` («الباقة، حتى»), `price.lnStudio` («تطبيق باقة الاستوديو»),
  `price.lnRush` («معجَّل، +25%»), `price.lnTotal` («المجموع»); changed: the
  rate and its date in `mk.note`, `price.curNoteEUR`, `price.curNoteUSD`
  (10 نوفمبر 2026, 152 and 136);
- AR review (2026-11-16), the Studio `hub/src/i18n/ar.json`, new:
  `pricing.console` («حاسبة الاستوديو»), `pricing.consoleAlt`,
  `pricing.beyond` («بعد ذلك:»), `pricing.rc.{title,cap,line,min,max}`
  («إيصال التقدير», «من», «إلى»), `pricing.pad.{up,down,less,more}`,
  `pricing.mk.{title,you,lead}`. The console's name, DOURO·8, stays in Latin
  script on purpose.
- AR review (2026-11-16, the money section), `assets/i18n/ar.js`, new:
  `price.tyMoney` («استشارات ومال»), `price.uCalls` and its five forms,
  `price.oSetup`, `price.oPack`, `price.oGuides`, `price.lnKit`
  («عُدّة الرحّال»);
- AR review (2026-11-16), the Studio `hub/src/i18n/ar.json`, new: the whole
  `money` group (about 150 strings: the head, the four services, the kit,
  the mid-range rule, the six lessons with their explanations, questions and
  answers, the two notes), `nav.groupLearn`, `nav.money`, `pricing.rc.call`,
  `pricing.rc.mid`. The lessons' Arabic is a translation of the French and
  uses technical words («عبارة الاسترداد», «العملة المستقرة», «العقد
  الذكي») that a native reader should confirm.
- AR review (2026-11-16, the motion section), `assets/i18n/ar.js`, new:
  `price.tyMotion` («موشن ديزاين»), `price.uSecs` and its five forms,
  `price.oAnim` («حركات الموقع»), `mk.srcMotion`;
- AR review (2026-11-16), the Studio `hub/src/i18n/ar.json`, new: the
  `motion` group (the head, the three offers, the reel's head, the three
  market markers), and the six clips' names and lines in
  `hub/src/reel.json` (`name.ar`, `what.ar`).
- AR review (2026-11-16, the radio), the Studio `hub/src/i18n/ar.json`, new:
  the `radio` group («راديو الورشة», the keys' labels, «على الهواء»,
  «مُطفأ», «متوقف مؤقتاً»), and three track names in `hub/src/radio.json`
  («الثانية صباحاً», «قهوة رقم 1», «كورو نائم»).
- AR review (2026-11-16, the split), the Studio `hub/src/i18n/ar.json`, new or
  changed: `doors.aria` and the `doors.c` group («أتعلّم», «افتح الدليل»),
  `nav.manual` («الدليل»), `proof.lead`, `pricing.mk.why`, `motion.line`,
  `motion.reel.price`, `money.kit.go`, and the whole `manual` group (the new
  page's title, its menu, «لنذهب أبعد، معاً.», «الاستوديو يبنيه.»).
- AR review (2026-11-16, Kūro on the manual), the Studio `hub/src/i18n/ar.json`,
  new: the whole `life` group («جولة الليل», «كورو يسكن هذه الصفحة.», the
  pad's labels, «رسم الليل.», Kūro's short lines under `life.k` and Yasser's
  under `life.y`).
- AR review (2026-11-16, the gamification course), the Studio
  `hub/src/i18n/ar.json`, new: the whole `jeu` group («اللعب النظيف.», the
  eight levels' titles, texts, questions and answers, the sticker names),
  `manual.nav.course`, and the page's opening line `money.lead`. The word
  chosen for gamification is «التلعيب», for a sticker «ملصق», for
  "pointsification" «التنقيط».
- AR review (2026-11-16, the nomad lessons), the Studio
  `hub/src/i18n/ar.json`, new: the whole `nomade` group («دفتر الطريق.», the
  eight stops' titles, texts, calculator labels, questions and answers, the
  stamp words), `manual.nav.lessons` and `manual.nav.nomad` («المال»,
  «الترحال»), `manual.ui.desc` and the page's opening line `money.lead`. The
  words chosen: «دفتر الطريق» for the road book, «محطة» for a stop, «عرض
  السعر» for a quote, «مفوتر» for billed, «مشاركة اتصال الهاتف» for a phone
  hotspot. Agency and product names stay in Latin letters (ANSSI, NCSC, Zoom,
  Google Meet, BitLocker, FileVault).
- AR review (2026-11-16, the copy sweep), the Studio `hub/src/i18n/ar.json`:
  the new titles `ui.title` and `manual.ui.title`, `doors.c.d`, the four
  `services.items.N.line`, and the whole `start.codex` group («الفهرس», its
  eleven entries, type tags and link texts). The words chosen: «الفهرس» for
  the codex, «البنّاء» for the builder, «الختم» for the seal, «المترحّل» for
  nomad in the title.
- AR review (2026-11-17, the copy sweep's second slice), the Studio
  `hub/src/i18n/ar.json`: the second tags on eleven labels («أيادٍ كثيرة»,
  «أربع عائلات», «قبل أن تدفع», «بالدليل», «خمس مراحل», «معلنة», «بلا طلب»,
  «يد واحدة», «كتابةً», «المال», «سعر ثابت»), `services.lead`, the five
  `process.steps.N.d`, `proof.lead`, `lab.lead`, `doors.b.d`, the three
  `start.*.d`, `contact.lead`, the end of `proof.vs.desc`; and on the home
  page (`assets/i18n/ar.js`): `founder.lead`, `founder.sceneCap`, `svc.lead`.
- AR review (2026-11-17, the copy sweep's third slice), the Studio
  `hub/src/i18n/ar.json`: six headlines, `proof.title` («كل ما يلي موجود
  فعلًا.»), `process.title` («من أول مكالمة إلى المفاتيح. ثم نبقى.»),
  `pricing.title` («الأسعار على الطاولة.»), `tech.title` («سريع. ثابت.
  ظاهر.»), `faq.title` («الأسئلة المحرجة، أولًا.»), `contact.title` («الباب
  مفتوح. اكتب لنا.»).
- AR review (2026-11-17, the copy sweep's fourth slice), the Studio
  `hub/src/i18n/ar.json`: the first heading, `hero.h1a`, `hero.h1b`,
  `hero.h1c` («فكرتك.» «يد واحدة.» «برنامجك.»).
- AR review (2026-11-18, the world's page), the Studio
  `hub/src/i18n/ar.json`: the `world` group («خلف باب الليل.», the title and
  description, the label, the line under the premise, the six names in the
  bar: «الفهرس», «الدفتر», «التصميم», «المختبر», «اليوميات»).
- AR review (2026-11-19, the visual pass; **AR: native review**, none read
  by a native speaker). The Studio, `hub/src/i18n/ar.json`: `doors.title`
  («ثلاثة أبواب. أيّها بابك؟»), `doors.c.lessons` («الدروس»), `doors.c.nomad`
  («الحياة الرحّالة»), `doors.c.radio` («الراديو»), `contact.place` («الباب»),
  `contact.sceneAlt` («باب الورشة مفتوح ليلاً: ياسر عند العتبة يرفع لافتة،
  وكورو ينتظر على الدرجة.»), `brand.aside` («المبنى، بأساساته.»),
  `brand.sectionAlt` («مقطع للورشة: اللافتة في الشارع، ثم تحت الرصيف غرفة
  الرسم، فالهيكل الحديدي والآلات، فالأساسات حيث يحرس كورو.»), `faq.winAlt`
  («كورو جالس على كومة أوراق مطويّة قرب نافذة ليلية، بجانب ختم أحمر وفنجان
  قهوة.»), `founder.floor` («استراحة قهوة · كورو يراقب»); the reel
  (`hub/src/reel.json`): the opening's line «2.7 ث · في كل زيارة». The home
  (`assets/i18n/ar.js`): `founder.sceneAlt` («ياسر عند نافذة الورشة ليلاً
  وفي يده قهوة، وكورو على حافة النافذة.»), `faq.winAlt` (as the Studio's),
  `tarifs.seal` («سعر منشور»), `tarifs.console` («DOURO·8 · منصّة
  الاستوديو»); the 404's alt for the road scene (`404.html`, `ALT.ar`: «طريق
  خالٍ ليلاً عند مخرج المدينة: ياسر يخفي وجهه بجانب علامة الطريق، وكورو
  جالس فوقها، والورشة بعيداً ما زالت مضاءة.»); the sheets' seal
  (`scripts/build-scene.mjs`, `ui.delivered`: «تم التسليم»). Removed keys:
  `doors.a.contact`, `contact.signAlt`. Waiting for the new passage clip:
  «تُرفع الصفحة والتالية تحتها» (not yet on the page).

Open art items (2026-11-15): the white patch behind the Sign pose is cleared
(transparent now; the old file is kept in the retouch folder of the session),
so it is no longer an owner item. Three non-pose bible files still carry a
detached alpha speck (`face-smirk.webp` 90 px, `rig-y-glasses.webp` 49 px,
`rig-y-sip.webp` 25 px, held in `scripts/design-check.mjs`): confirm whether
they are intended or have them cut.
The Studio has no contact form (WhatsApp, the Aperçu and e-mail only), so the
sent-form seal exists on the home's form only; the estimator seal is on the
home, the price guide and the Studio. The real photograph of Yasser (section 3)
still replaces the drawn portrait where the home's founder card keeps its slot.

Written or changed on 2026-11-19 (the manual's two client courses, §38; none
read by a native speaker; every string is **AR: native review**). In
`hub/src/i18n/ar.json`: the whole of the groups `fiche` (the brief's shared
controls), `brandc` ("Le logo vient après") and `web3c` ("Le web3, sans
fumée"), 739 strings, and the changed keys `money.lead`, `money.ls.kicker`,
`money.ls.tabs`, `manual.ui.title`, `manual.ui.desc`, `manual.nav.brand`,
`manual.nav.web3`, `doors.c.d`, `doors.c.buy`, `doors.c.buyBrand`,
`doors.c.buyWeb3`, `brand.prep`, `services.items.2.prep`,
`money.ls.items.4.web3`, `start.codex.e.manuel.d`. New with your answers of
2026-11-18: `brandc.items.5.rows.{2,3,4,6}.ours`, `brandc.items.6.rights`,
`brandc.items.7.opts.{base,dsHas}`, `web3c.items.2.scope.line`. Please read
the brand course with a shop owner, not only for grammar; the positioning
sentence (`brandc.items.2.grid.line`, «لمن يبحث عن {seek} ({who}): …») is
built so the buyer chip needs no agreement: check that it reads naturally.

Also written on 2026-11-19, for la fabrique (§39) and your artworks (§40), none
read by a native speaker, every string **AR: native review**. In
`hub/src/i18n/ar.json`: the whole group `fab` (357 strings, 146 of them
written in that pass: all of `fab.w3.*`, the web3 engineering track, plus
`fab.ui.desc`, `fab.nav.chaine`, `fab.s.0.scale`, `fab.course.lead`,
`fab.course.web3.{d,go,client}` and `fab.ch.all.go`); the Studio's changed keys
`doors.a.how`, `services.how`, `brand.how`, `motion.line.how` and `nav.fab`;
and for your artworks `proof.mc.framesLabel` (changed), `proof.mc.frames.5`,
`proof.mc.frames.6`, `start.crew.alt` and `lab.pieces.30` to `lab.pieces.35`.
`fab.ui.title` (the page's search title) is unchanged in Arabic; only the
French was shortened on integration (§41). Each string is read in
`hub/src/i18n/ar.json` under its key.

Written or changed on 2026-11-21 (the courses after the critique and the web3
course in nine modules, §42), none read by a native speaker, every string
**AR: native review**: 1,770 strings in `hub/src/i18n/ar.json`. They are
(1) the whole group `web3c.mods` (the nine modules: 33 stops, their labs,
misconceptions, questions, bridges and questions for the provider) and the
shell's groups `web3c.path`, `web3c.chap`, `web3c.carnet`, `web3c.dock`,
`web3c.deeper`, `web3c.x` and `web3c.brief.l.asks`, 1,438 strings written in
the integration; (2) the keys whose French changed and whose Arabic was
rewritten from it: `web3c.lead`, `web3c.hud`, `web3c.tabs`, `web3c.src.note`,
and the lesson count (38 → 71) in `manual.ui.title`, `manual.ui.desc`,
`doors.c.d` and `start.codex.e.manuel.d`; (3) the critique pass's 272 keys
(`fiche.*`, `brandc.*` and `web3c.*` outside the modules: the decision row,
the requests, the card-payment questions, the invented cases, the wrong-answer
lines, the act labels) and the nine module pictures' and two case cards'
alternative texts (`web3c.mods.N.alt`, `brandc.case.alt`, `web3c.case.alt`).
Conventions for the reviewer: Modern Standard Arabic; a technical term carries
its Latin form in brackets on first use, isolated (`<bdi>`, which the build
turns into FSI/PDI); chain names are transliterated (بيتكوين، إيثريوم،
سولانا); project, library and standard names stay in Latin, as the published
web3c Arabic does. The words the published course already used were kept
(سلسلة، سلسلة الكتل، رمز، سجل، محفظة، المفتاح الخاص، عبارة الاسترداد، العقدة،
العقد الذكي، العملة المستقرة، رسوم، توقيع، التعدين، احتيال، المُصدِر); the new
ones to confirm include مدقّق (validator), إثبات العمل / إثبات الحصّة, الطبقة
الأولى / الثانية, تجميع (rollup), البذرة (seed), المحلِّل (ENS resolver), الغاز
(gas), البقشيش (tip), الاستحقاق التدريجي (vesting), فترة الانتظار (cliff), صانع
السوق الآلي (AMM), الانزلاق (slippage), عامل الصحة, التصفية (liquidation),
القرض الفوري (flash loan), إعادة الدخول (reentrancy), الفيضان (overflow),
الاختبار العشوائي (fuzzing), الجسر (bridge) and الأوراكل (oracle). The
lab's pseudo-code (module 9, step 1) is written in Arabic words (سحب() …).

Also written or changed on 2026-11-21, **the Librairie Lanterne and la carte** (§43, §44), all new, all for a
native reader. In `hub/src/i18n/ar.json`, under `lant.*`: the shop's name « مكتبة الفانوس » (`lant.shelf.name`),
the engine and shelf lines (`lant.ui.*` 95, `lant.shelf.*` 58, `lant.cast.*` 14, `lant.stub.*` 4), « Le cours du
soir » (`lant.at.cds.*`, 236, ported from the prototype), the money book (`lant.at.argent.*`, 61), the road book
(`lant.at.route.*`, 80) and the game book (`lant.at.jeu.*`, 79); the plural lines carry all six Arabic forms. The
shelf's hero picture now has its own description (`lant.shelf.heroAlt`: « مكتبة الفانوس ليلًا: تحت المظلة المخططة
بالأحمر والكريمي، كتاب كبير مفتوح على المنضدة وفانوس مضاء؛ ياسر جالس يقرأ أطلسًا قرب الكشك، وكورو نائم على
المنضدة، وأبراج المدينة تحت سماء مرصّعة بالنجوم. »), and the act plates of the three books theirs
(`lant.at.<book>.plate.*`). Changed keys that pointed at the manual now point at the Librairie: `nav.manual`,
`doors.c.*`, `start.codex.e.manuel.*`, `kuro.d/go`, `radio.d`, `life.lead`, `life.y.*`, `world.mercuryLant`,
`fab.course.capstone.lant`, `fab.w3.all.d`. In `hub/src/carte.i18n.json`, the whole of la carte (253 lines: the
tabs, the 18 cards, the tiers, the market lines, the bundles, the sources). Words to confirm: أطلس (atlas), حيّ
(district), جواز السفر (passport), تذكار (keepsake), السجلّ (journal), الحقيبة (sac), الطريق الجانبي (side route), and
the guides' names kept in Latin letters (Raven, Techno Pigeon, Ratman). The money and road books reuse the money and
nomad courses' reviewed answers word for word for their right answers.

## 8b. The Google tag and consent (2026-11-14)
The site loads the owner's Google Tag Manager container (GTM-PMF7RWVK) on every
page with Google Consent Mode **denied for good** and no cookie bar: Google gets
cookieless, anonymous pings only, which is what the privacy page promises (no
cookie is set). That promise holds only while the container itself stays quiet:
**a tag added inside the GTM container that does not honour Consent Mode (a Meta
Pixel, Hotjar, a custom HTML tag, any third-party script) would set cookies or
send identifiers whatever the page says**, and would make the privacy page
false. Any such tag needs a consent bar built first (and the page's consent
default changed on purpose: the site never updates consent to granted today).
Keep the container to Google's own tags, with their consent checks on.
Open for the owner: the privacy page says what Google receives (page viewed,
approximate time, browser type); the container's GA4 settings (for example
Google signals, advertising features, data retention) should stay off so that
stays true.
Confirmed by the owner 2026-11-14: the privacy page's new line that campaign
parameters (`?ref=`, `utm_*`) leave with the page address in Google's anonymous
pings, not only with the visitor's message, is the wording the owner wants.

## 9. Clients' own domains
The cards link the Netlify builds, because none of the clients' domains serves
the delivered site:
- `bordj-steel.com`, `alliance-travel.dz` and `nomaravoyages.com` do not resolve
  (NXDOMAIN);
- `almaflowclim.fr` serves a different Hostinger site;
- the two projects in progress (Doctor Cherfia, Étoile de l'Est) have no
  card on the page until each site is live (owner decision, 2026-10-26);
  each then comes back with its own screenshot, link and host line.

When a client points a domain at the build, run `node scripts/verify-domains.mjs`.
It reports a domain as switchable only when it serves the same site. Then the
link changes in one place per client (`check.mjs` keeps the plate, the card
and the project sheet in step; the card's host line, which replaced its
drawn browser bar on 2026-11-06, is typed by hand: change it with the link).

## 10. Hub fan art
No fan art on the site since 2026-10-28: the fan art and the remade poster
series left `hub/` with its rebuild (IMPROVEMENTS A11, pushed on 2026-10-28
after your review; the live site changes at the next deploy). The files stay
in the git history of earlier commits (see §12 for
what removing them from history involves), so the rights question no longer
concerns the site.

## 11. Supabase lead store
It is off: the keys in `index.html` are empty. Switching it on needs:
- the legal page published;
- the database region set in `scripts/legal-data.mjs` (`privacy.supabaseRegion`);
- a new `form.note`, because the current one promises the site keeps nothing.

`check.mjs` enforces all three.

## 12. Campaign kit and this repository
This repository is **public**. The campaign kit (strategy, budget, client
permissions) was removed from it on 2026-10-12 and is now with the owner as a
zip. It is still in the git history of earlier commits. Removing it from
history needs a force-push rewrite (e.g. `git filter-repo --path campaign
--invert-paths`, then `git push --force`), which also rewrites every later
commit. That is the owner's call, best done when no pull request is open.
`knowledge-base/` and `audit/` are also readable on GitHub (never on the site).
[RELEASE.md](RELEASE.md#8-the-git-history) has the facts for the decision:
which refs hold the kit today, what GitHub Support will and will not remove,
and why the rewrite is cleanest before Dependabot's first pull request.

## 13. WorkspaceHQ: open source
The site called WorkspaceHQ "open source" and told visitors to "follow the
README". On 2026-10-13 the repository `Brvetr4ve1er/workspace-HQ` had no
licence file and no README, and `dashboard/package.json` is `"private": true`
with `"start": "electron ."`: public code without a licence is not open source,
and it is a desktop (Electron) app, not a CLI. The pages now say the code is
public on GitHub and describe a desktop console. To say "open source" again,
add a LICENSE (for example MIT) and a root README with the start steps to
that repository, then restore the wording in `workspacehq/index.html` and
`scripts/scene-data.mjs` (`npm run scene`).

## 14. Claims only the owner can confirm
Each is on the site today. None is proven false; none could be verified.
Confirm it, or say what is true and the copy changes in all three languages.
Eight are listed: five open, three answered on 2026-10-30 (marked) and all
three applied on 2026-11-03.
- **"6 ans" of experience** (founder card) next to freelance work "2019 —
  aujourd'hui", which is about 7 years in October 2026.
- **"des clients en France"** (FAQ 5, plural): the portfolio shows one French
  client (AlmaFlowClim).
- **"nous livrons avec … React, Next.js, Vercel"** (market note, on the price
  guide since 2026-10-31): every delivered build linked from the site is
  served by Netlify, and only Bordj Steel shows Next.js. (F11: since
  2026-11-03 the pills are trimmed to what the builds use, React, Next.js and
  Tailwind, with Vite and Vercel gone; the rest of the toolchain is still
  yours to confirm.)
- **Essentiel: "Mise en ligne, domaine et certificat configurés"**: no
  delivered client site is served from its own domain yet (see 9).
- **"Si c'est oui, la page d'accueil est déjà faite : on enchaîne sur le
  reste."** (`prev.tl5p`, the last step of the path in the Aperçu card;
  until 2026-10-26, step 4 of the method, which first said "on est déjà à
  mi-chemin") after a one-page Aperçu, for projects of up to 16 weeks. The
  Aperçu rules you ordered drafted (section 16) say what a yes includes; the
  sentence stays until you confirm it against them.
- **"Leader de la construction métallique en Algérie"** (Bordj Steel's card,
  `proj4.desc`; IMPROVEMENTS F13): the client's own tagline, stated as fact
  in the studio's voice. **Answered 2026-10-30** (decision 19) and **done
  2026-11-03** (F13): Bordj Steel is now described as the sheet describes it,
  "fabricant de charpente métallique et de panneaux sandwich à Bordj Bou
  Arréridj".
- **"avec du café noir et du TypeScript"** (the README's signature; until
  2026-10-26 also the footer signoff, which left with the Studio column and
  whose key is gone from the dictionaries; IMPROVEMENTS F14): this site
  contains no TypeScript. **Answered 2026-10-30** (decision 10): JavaScript;
  applied to the README on 2026-10-31, the last place it was said.
- **hub/: "VOIDSPLUNKER.std is an agency of one"** while the home page
  presents a studio of four specialists. **Answered 2026-10-30**: one
  founder, with freelancers when needed (section 17); the line stays on the
  hub as you chose on 2026-10-28, and the home page's team wording followed
  on 2026-11-03.

Dropped from this list on 2026-10-31: AlmaFlowClim labelled "Industrie". The
card has read "Artisan · Île-de-France" since the copy rewrite of 2026-10-14,
which is what its own site presents.

## 15. Hub illustrations
**Since 2026-11-07 `/hub/` is the Studio page (section 21) and the character
bible described below lives at `/hub/bible/`.** Everything in this section is
about the bible; its points still wait for you.

Since 2026-11-06 (56f29c1, 6216ec9; IMPROVEMENTS A15) `hub/` is your
character bible, built from your own design page: a cover; 00 He's alive, a
live drawn rig of you and Kūro that follows the cursor, says a line and
reacts to a click for five seconds, then rests (with reduced motion, only a
click or a button changes a face); 01 Who he is; 02 The silhouette; 03
Twelve faces; 04 What he does; 04b Head to toe; 05 Kūro; 06 How he talks;
07 A day on Studio; 08 Elsewhere, the verified links and the email; the
footer with your "agency of one" line (section 4). One paper palette: the
theme pill is gone. The Behance covers grid, the studio diary and its
viewer, the animated loops (`hub/loops/`) and the cartridge left the page
with the rebuild, so the earlier points about the diary are closed: its
titles (approved on 2026-10-28, IMPROVEMENTS decision 26) and the
Tifinagh-like glyphs in "A world in miniature" are no longer on the site
(they stay in the git history). As you chose (IMPROVEMENTS decision 24), the
page carries no credit line and names no tool. The pictures in `hub/art/`
are cut from your masters by `npm run hub:rig` (README); their licence is
yours to choose (NOTICE.md).

The words are your design page's, kept as written except where they were
internal notes (its section "To finish him" was not published). Six points
are yours to confirm, because only you can:
- **the character facts in "Who he is"**: Role "Founder · creative director
  · the one who actually ships it"; Base "Bordj Bou Arréridj, Algeria — the
  studio roof at dawn"; Seal 夜 *yoru*, "He does his best work after
  everyone logs off"; Fuel "Black coffee, the Numidea mug"; Partner Kūro; the
  four lines Wants, Fears, Flaw and Tell; and the six axes with their
  percentages (calm 38 % toward chaotic, night 14 % toward day, talks 84 %
  toward ships, polished 66 % toward messy, serious 72 % toward deadpan
  funny, solo 90 % toward with Kūro). Read as a character, they are yours to
  set; read as facts about the founder of the studio a buyer meets on the
  home page, say if any is not true;
- **the scenarios of "A day on Studio"**: eight beats (the sting at dawn,
  the hero, services, pricing, work, FAQ, contact, after 23:00) describe how
  the character would behave on a studio site: mug steam that writes
  NUMIDEA LABS, a marker note "c'est tout." beside the price total, Kūro
  loafing on the case tile you hover, a face change on each FAQ answer, a
  pointer at the field being typed in. None of it exists on the home page
  today. Confirm they are shown as a design idea, not a feature, or say
  which you want built;
- **your name's spelling**: the page's title, its share card and "Who he
  is" say "Yasser Hamisse", as the home page does; the footer says
  "Hamisse Mohamed Yasser", and the LinkedIn link "Mohamed Yasser Hamisse"
  (as the profile's address spells it). Say which the hub should use, or confirm the
  footer keeps the full civil order on purpose;
- **"the builder who answers at 2 a.m."** (the tagline, the description and
  share texts, and the line "Il est 2 h. Oui, je réponds encore." in How he
  talks and the rig): the home page promises a reply the next working day,
  Sunday to Thursday, 9h–18h (section 17). As a character trait it is
  yours; confirm a buyer will not read it as a promise;
- **the coat's patch**: the silhouette notes say "NUMIDEA patch on the left
  sleeve", and the mug is "the Numidea mug". The page of 2026-10-28 treated
  the hexagon "N" as a costume detail; the bible now names it as the
  studio's mark. Confirm;
- **Kūro**: the page now says more than "the black cat": "a black cat with
  taste and no patience", "the quality gate has whiskers", and ten cards
  (judge, loaf, smug, stamp and the rest). Say if any of it should not be
  said of your own cat.

## 16. Commercial terms
The site said nothing about what happens after the yes (IMPROVEMENTS A1,
A5). On 2026-10-31 you answered "make them up", so the studio's commercial
terms below were drafted on your instruction of that date, conservative and
standard; they are yours and you can change any of them at any time. The
change of 2026-11-03 wrote them into the FAQ (payment; ownership and hosting;
the Aperçu rules), French first, English and Arabic translated, the Arabic
marked for native review (section 8). They live in the dictionaries
`assets/i18n/fr.js`, `en.js` and `ar.js`, under `faq3.q` and `faq3.a`
(payment, contract, firm price), `faq7.q` and `faq7.a` (ownership and
hosting) and `faq8.q` and `faq8.a` (the Aperçu rules); revisions and support
are in `faq4.a` (30 days of fixes). To change a term, edit those keys in the
French file and say so, so the two other languages follow; then
`npm run build`.

- **Payment:** 40 % at order (devis signé), 60 % at delivery, before the site
  goes live. Bank transfer or CCP in Algeria; bank transfer in euros or
  dollars abroad. Firm price fixed after scoping; it does not move; overruns
  are on the studio.
- **Ownership:** once paid in full, the client owns the site, its code, its
  design files and its content. The domain is registered in the client's
  name. The studio keeps the right to show the work in its portfolio unless
  the client refuses in writing.
- **Hosting:** chosen with the client and billed yearly by the host, in the
  client's name; the studio sets it up and hands over the access. An order
  of magnitude ("à partir de ~5 000 DA/an pour un site vitrine") is printed
  only if a checkable public price exists for the recommended host;
  otherwise no figure.
- **Revisions:** two rounds per stage (design, then build) included; further
  rounds quoted.
- **Support:** 30 days of bug fixes after delivery included; the optional
  maintenance (18 000–60 000 DA/month, already published) covers updates,
  backups, small changes and a reply the next working day.
- **Contract:** a written quote and a signed order form before any work;
  Algerian law.
- **Aperçu rules:** any registered business (RC, carte d'auto-entrepreneur,
  SIRET or an equivalent trade licence); the 5 working days start when the
  studio has the content (logo, texts, photos) after a 30-minute call; after
  a no, the preview is deleted and nothing is owed; after a yes, the preview
  becomes the homepage inside the package at no extra cost; when the month's
  4 places are taken, the request goes to the next month in order of
  arrival.

The tax line on dinar prices (HT, TTC or not liable to TVA) and the € note's
reverse-charge clause are not in this list: they are facts, not terms, and
stay with you (IMPROVEMENTS A1, owner facts).

## 17. Team and contact facts (answered 2026-10-30)
- **Team:** one founder, with freelancers when needed. See section 4 for
  what the page now says.
- **Contact:** WhatsApp only, no voice calls; Sunday to Thursday, 9h–18h
  (Algiers time); the Gmail address stays (section 5). On the page this
  turns every "24 h ouvrées" into "le jour ouvré suivant (dimanche–jeudi,
  9h–18h)" (the title block, the proof line, the Aperçu path, FAQ 4, the
  contact block), and no `tel:` link is added. On the page since 2026-11-03;
  recorded as your answers of 2026-10-30.

## 19. The UX pass's questions (asked 2026-11-06)
The UX and visual pass of 2026-11-06 changed only how the pages look and
behave; the reviewers' proposals that would change a fact, a cut you made or
one of your recorded decisions were left to you. Each is a decision in
IMPROVEMENTS.md, its recommended option first; nothing changes until you
answer.
- **Themes** (decision 31): **answered 2026-11-08, "cut the themes to arcanum
  and daylight"**. Done: the site has Arcanum (dark, the default) and
  Daylight (light), one toggle button, and a first visit follows the visitor's
  OS preference (Daylight if it asks for light, Arcanum otherwise, nothing
  stored until they press the toggle). Decision 32 (heading faces) is moot:
  both themes set Cinzel.
- **Founder photo** (section 3): the monogram is a 64 px mark meanwhile; the
  slot takes the file as it is.
- **Hero lede** (decision 33): the reviewers want it cut to two lines, the
  founder sentence moved to the founder section or the Aperçu card. That
  reverses your decision 21 (the founder named in the lede). The other way:
  keep the name and shorten the offer sentence.
- **Proof band** (decision 34): folding it into the hero's foot reverses your
  decision 7; it stays one left-aligned line and the logo strip meanwhile.
- **Title block** (decision 35): FONDATEUR "Yasser Hamisse" and LIVRAISON
  "Page d'accueil en 5 j ouvrés" instead of STUDIO and LANGUES; the
  languages would then be said only in the h1 and the eyebrow.
- **Service cards** (decision 36): dropping the tool tags (React, Next.js,
  Tailwind, Playwright, Python) from the five home cards, kept on the
  project sheets. The tags are facts you confirmed (F11), so it is a cut,
  not a correction.
- **Project cards on a phone** (decision 37): five full cards take 3.5
  screens; a sideways scroller or "Voir les 2 autres" would save about
  3,000 px but hides client work behind a gesture.
- **Price guide** (decisions 38 to 40): a strip of the three tiers' prices
  under its h1 (the tiers would be said twice); a "−45 % vs France" chip (a
  new comparative claim, to be checked against the guide's sources); which
  FAQ entries the guide copies.
- **FAQ order** (decision 41): should "Comment fonctionne l'Aperçu ?" and
  "C'est combien ?" lead the list (today rows 8 and 2)? The same order in
  the three languages and in the structured data.
- **The rest** (decisions 28, 29, 42, 43): a "Pages" label over the desktop
  footer's links; the pricing section's lead beside its heading on wide
  screens; an optional phone field in the form; each option's "+X DA" in
  the estimator.
- **Legal links in the footer and the form**: they wait for the legal facts
  (section 1).
- **Arabic**: the eyebrow's language codes (decision 30) and every Arabic
  string the pass added or changed join the native review (section 8).

One item needs a machine, not an answer: sharper hero slides and page
thumbnails (2x WebP), and new captures of Nomara without its footer band,
Alliance Travel's home without its sticky header and its Istanbul and Bali
pages from the top, need the live sites. Run `npm run shots` and
`npm run work:capture` on a machine with network access (README, "Project
previews"), then `npm run build`. The cards' crop is already centred in CSS
meanwhile.

## 20. Copy proposals (I4, fleet 4b)

The critique found the section headings, ledes and service taglines to be
template slots (they could sit on any agency's page) and the voice to switch
between "nous" (the studio) and "je" (the founder's bio). Nothing below is on
a page; each proposal is French, the current string beside it, and a yes
(IMPROVEMENTS decisions 46 and 47) writes it in all three languages, the
Arabic into section 8. Each proposal only uses what the page already says.

**Section headings (`h2`)**

| Key | Today | Proposal | Why |
|---|---|---|---|
| `work.title` | Réalisations choisies. | Quatre entreprises, en ligne. | the title block already counts "4 sites clients"; a claim, not a label |
| `svc.title` | Ce qu'on construit pour vous. | Cinq services, un seul interlocuteur. | FAQ 6: "vous gardez un seul interlocuteur" |
| `founder.title` | Qui construit votre site. | Celui qui vous répond est celui qui code. | FAQ 5: "vous parlez directement à celui qui construit votre site" |
| `faq.title` | Les questions qui comptent. | Avant de dire oui. | the lede says these are asked before starting |
| `contact.title` | Parlons de votre projet. | Deux lignes suffisent. | `contact.sub` says exactly that; the heading becomes the offer |
| `price.title` | Un prix avant le devis. | (keep) | already a claim |

**Ledes**

| Key | Today | Proposal |
|---|---|---|
| `svc.lead` | Nos cinq services principaux — et cinq autres juste en dessous. | Cinq services en détail, cinq autres sur demande, le même interlocuteur du premier appel à la maintenance. |
| `work.lead` | Les sites de nos clients, à visiter vous-même, et une démo de portfolio. | Chaque site est en ligne : ouvrez-le, essayez-le sur votre téléphone. |
| `price.lead` | Nos prix, publiés, en dinars, en euros ou en dollars. Trois formules ; … | Trois formules, un prix ferme avant que vous ne signiez ; l'estimateur couvre le reste. |
| `faq.lead` | Ce qu'on nous demande avant de se lancer, et nos réponses sans détour. | Paiement, délais, propriété du site : les réponses, sans détour. |
| `founder.lead` | Derrière Numidea : un fondateur qui conçoit, code et livre lui-même, et des freelances quand un projet le demande. | (keep) |

**Service taglines.** The five home cards carry a family label (`svc.famBuild`
"Sites & design", `svc.famEngine` "Données & automatisation", `svc.famMind`
"Conseil & IA") and a stock tagline (`f1.promise` to `f5.promise`). The ten
services stay (decision M2); this is only the line on top of each card. Option
A, cut both (the name and the brief remain). Option B, a claim for each tagline
(the brief of the same card is its evidence):

| Key | Today | Proposal (B) |
|---|---|---|
| `f1.promise` | Le choix évident. | Un site dessiné de zéro, pas un modèle maquillé. |
| `f2.promise` | La confiance avant le premier mot. | Une marque qui a l'allure d'une maison établie. |
| `f3.promise` | Supprimez la corvée. | Le travail répétitif tourne seul, même à 3 h du matin. |
| `f4.promise` | Voir le marché clairement. | Les prix et les catalogues de vos concurrents, à jour. |
| `f5.promise` | De la donnée, pas des impressions. | Des décisions fondées sur vos chiffres. |

**A "je" version of the offer and the FAQ.** The selling point is "Vous
parlez directement à celui qui construit" (FAQ 5); the studio's first person
plural contradicts it. Samples, not a rewrite of the page (the same pattern
goes through the offer, the guide and the other FAQ rows if you say yes):

| Key | Today | Proposal |
|---|---|---|
| `hero.lede` | Avant tout paiement, nous construisons la page d'accueil de votre nouveau site, avec votre contenu, en 5 jours ouvrés. C'est l'Aperçu : gratuit, réservé aux entreprises immatriculées, 4 par mois au plus. Yasser Hamisse, fondateur designer-développeur, conçoit, code et livre lui-même, avec des freelances quand un projet le demande. | Avant tout paiement, je construis la page d'accueil de votre nouveau site, avec votre contenu, en 5 jours ouvrés. C'est l'Aperçu : gratuit, réservé aux entreprises immatriculées, 4 par mois au plus. Je suis Yasser Hamisse : je conçois, je code et je livre moi-même, avec des freelances quand un projet le demande. |
| `prev.brief` | Avant tout paiement, nous construisons la page d'accueil de votre nouveau site, avec votre contenu. Si vous dites non, vous ne devez rien. | Avant tout paiement, je construis la page d'accueil de votre nouveau site, avec votre contenu. Si vous dites non, vous ne me devez rien. |
| `faq4.a` (opening) | Nous restons. Trente jours de corrections après la livraison … | Je reste. Trente jours de corrections après la livraison … |
| `faq5.a` | Oui. Le studio est à Bordj Bou Arréridj, et nous livrons partout — y compris pour des clients en France. La distance ne change rien : vous parlez directement à celui qui construit votre site. | Oui. Je travaille depuis Bordj Bou Arréridj et je livre partout, y compris pour des clients en France. La distance ne change rien : vous parlez directement à celui qui construit votre site. |
| `faq6.a` | Pas d'intermédiaire : celui qui cadre votre projet est celui qui le conçoit, le code et le livre. Quand un projet le demande, un freelance intervient … | Pas d'intermédiaire : je cadre votre projet, je le conçois, je le code et je le livre. Quand il le demande, un freelance intervient … |

A "je" voice is a statement about the studio's size, not only a style: the
footer line «agency of one» (decision 22) and the freelancers row already say
it; FAQ 6 keeps "freelance" as the only exception. The Arabic is rewritten by
the native reviewer, not translated from these lines. The Studio page keeps the
third person, as before.

## 21. The Studio page (/hub/, 2026-11-07)

`/hub/` is now your Studio page, built from your design (`hub/src`,
`scripts/build-hub.mjs`; BRAND.md "hub/ — the Studio page"). The character
bible moved to `/hub/bible/`. The page is trilingual, with the five cases in
09 Proof. The facts the site publishes win over the design where they differ;
every difference is below for your yes. Arabic is in section 8. Nothing was
pushed or deployed.

**Design copy changed to the site's facts**

| Where | The design said | The page says | Reason |
|---|---|---|---|
| Wordmark | Archivo "NUMIDEA LABS" text | the site's drawn wordmark, the accent in the Studio's red, the kana beside it | one wordmark everywhere (F34) |
| FR nav, CTAs | "Preview" | "Aperçu" ("Demander un Aperçu", "Demander mon Aperçu"); English keeps "Preview" | the offer's French name |
| Rig | a line "Il est tard ? Je réponds quand même." | dropped (five lines remain) | a response promise outside the published hours |
| Hero mood badge | ● LIVE | ● EN DIRECT (FR); at rest ● AU REPOS / ● AT REST / ● ساكن | French; the rig rests under reduced motion |
| Wedge | RÉPONSE < 24 H | RÉPONSE LE JOUR OUVRÉ SUIVANT | the published reply time (F-1) |
| Services lead | une seule équipe du premier appel à la maintenance | un seul interlocuteur … | the studio is one founder (F-3) |
| Service durations | Engine 1–4 weeks, Mark 2–6, Mind 1–2 | Engine 2–6, Mark 2–5, Mind "sur devis" | aligned to the published model; Mind has no published figure |
| Aperçu lead and steps | "Avant tout devis signé, on construit une première version qui fonctionne." and three invented steps | "Avant tout paiement, on construit la page d'accueil de votre futur site, avec votre contenu." with the home's steps (you describe the project; the Aperçu in 5 working days; you decide, and if no, it is deleted and you owe nothing) and the home's terms line | the published offer (F-6) |
| Process steps 02 to 05 | "Une démo qui fonctionne"; "Sprints courts, une démo par semaine"; "formation de votre équipe"; "On répond quand ça casse. Mises à jour et suivi chaque mois." | "Votre page d'accueil construite, avant tout engagement."; "Un périmètre écrit, un prix ferme, et vous voyez le site avancer."; "tous les accès remis à votre nom"; "Trente jours de corrections, le support de votre formule, puis la maintenance si vous la voulez." | the home's terms (payment, handover, support) |
| Pricing title | Les prix du marché. Sans surprise. | Nos prix. Sans surprise. | these are the studio's own published prices (F-12) |
| Estimator | landing-page type, pages-only slider, languages switch, 8 000–25 000 DA maintenance, hosting 15 000–43 000 DA/an, a Freelance/Studio/Agence bar, a sources list | the home's six types with a size slider in each unit, its six options and pace switch, maintenance 18 000 – 60 000 DA / mois, hosting "facturé à l'année par l'hébergeur, à votre nom" (no figure), no market bar, the home's fine print; "EN DINARS / ≈ EN EUROS / ≈ EN DOLLARS"; a link to the guide's market section | one price model, no new figure (F-10) |
| Tech 01 stat | +8,4 % … (Google × Deloitte study) | "Chaque seconde d'attente fait partir des clients : on mesure, on allège, on livre rapide." | a third-party statistic not on the site (F-24) |
| Proof title and lead | Ils nous font confiance. | Le travail, en vrai. "Trois clients livrés, et deux travaux personnels du fondateur. Chaque dossier dit ce qui a été fait, et pour qui." | third person (decision on "je" waits, section 20) |
| Proof extras | four client cards (Hamma Sat, Shippily, Condor, Glaive Gaming) and the "Concept : ce qu'on ferait pour Heetch" grid | dropped; one line: "Aussi, faits maison : Glaive, la démo du studio · WorkspaceHQ, le produit du studio" | clients not on the site (F-14, F-15) |
| Founder | "/ 4 PERSONNES · TOUTES SENIORS"; three discipline rows; polaroid parallax | "/ UN FONDATEUR · DES FREELANCES QUAND IL LE FAUT"; "LE FONDATEUR" and the home's freelancers row; links to the bible and the CV; no parallax | the team answer of 2026-10-30 (F-3) |
| FAQ | six drafts | the home's six settled answers, verbatim: faq8, faq7, faq1, faq5, faq4, faq3 | F-6 to F-9 |
| Contact | "Réponse sous 24 h, par quelqu'un qui code."; a "Réserver un appel / BIENTÔT" card; e-mail hello@numidealabs.com | "Réponse le jour ouvré suivant, par celui qui code."; hours line "Dimanche–jeudi, 9h–18h · messages seulement, pas d'appels"; WhatsApp +213 672 41 25 78; the Aperçu card opens WhatsApp with the home's message; the e-mail is the site's Gmail; no call card | reply time, hours and contact as answered on 2026-10-30 (F-1, F-2) |
| Footer | TypeScript; @NUM_IDEA | JavaScript; handle dropped; links to the site, the bible, Instagram stick_itty and Behance | F-5 |
| Sting | HUD "DAWN"; skip label "SKIP" at 8.5px; audio | "AUBE" in French; "PASSER" / "SKIP" / «تخطَّ» at 12px; no audio; gone by 2.6 s, skippable by any key, once per session | accessibility; motion cap |
| Lab | 25 tiles, "déposez une nouvelle pièce" slots | the grid is 30 pieces (P and Y tiles, from the bible's art), then the titled diary row of eight prints (J01 to J08, since 2026-11-11), then a link tile to the bible; no slots | the other tiles' pictures were never supplied |
| Contrast | opacity .38 on inactive process steps; cut chips at .4; #937F6B text | .72 on the step body only (numbers keep full colour); muted text and a line border; `--stone` #A8957F | AA as painted |
| Sizes | 8.5 to 11px mono labels, 40×36 language buttons, 28px range | 12px (13px in Arabic), 44×44, 44px | targets and legibility |
| Fonts | Arabic watermarks in Aref Ruqaa on every page | system serif outside the Arabic page; the nav's ع drawn | no Arabic face fetched for a decoration |
| Share card | a Studio card | the Aperçu card (`assets/og.jpg`) until a Studio card exists | open |
| Page title | | "Numidea Labs — le studio : sites, applications et marques" | 70 and 160-character limits |

**Cases: changed from the design**

| Case | The design said | The page says | Reason |
|---|---|---|---|
| All | prices on covers and scope cards; embedded live frames | no price (decision 19): the cover shows the case's tag and a scope card lists what was delivered; a link with `rel=noopener`, never a frame | the standard CSP frames nothing; no client prices are published |
| Bordj Steel | a price chip on the cover | tag "Site B2B · marque"; the figures (300+ projects, +14 years, ISO) and the logo wall captioned as Bordj Steel's own | decision 19 |
| Alliance Travel | pack price and "200 000 DA" scope card; totals 123 000 / 219 000 / 180 000 DA; "178 textes traduits"; "Sora · DM Sans"; scroll dots | tag "Identité + site"; a scope card of eight delivered items; the seven destinations say "Sur devis"; "9 pages en ligne", the visa service and the day-by-day programmes (scene's own figures); "DM Sans · Tajawal"; an "n / 4" counter | no published prices or claims; the faces the client's site uses |
| Alliance Travel | cover chips "Omra" and "Billetterie", "par une seule équipe" | dropped | the site does not carry them; one founder |
| Alliance Travel | the client's Instagram stories and flyers | shown as the client's artwork, prices in DA included (219 000 DA on the Bali story, 180000 DA on the Sharm flyer, 123.000 DZD on the Istanbul flyer) | decision needed (below) |
| AlmaFlowClim | header chip "450 €"; card "450 € ≈ 68 000 DA"; "rappel sous 24h", "150+ clients", "RGE", "17 communes / 4 + FAQ"; almaflowclim.fr and a live frame; "Envoyée · rappel sous 24h"; the street address and phone on the Google card; a brand-book link | tag "Identité + site" and an eight-item delivery checklist; "une demande de devis, en un seul formulaire", "1 page par métier · 1 formulaire de devis · Gennevilliers (Île-de-France)"; almaflowclim.netlify.app and a link; "Démo : ce formulaire n'envoie rien."; "Gennevilliers (92)" only, MAQUETTE; the close-up as a plain "Visuel · maquette" tile; since 2026-11-11 the FIG. 10 tile reads "Brand book · 12 planches" with "Ouvrir le brand book ↗" to `/hub/brand/almaflow/`, ported without the "24h", RGE / décennale, "Devis gratuit", MaPrime Rénov', phone, address, e-mail and domain | F-10, F-11, F-13, F-17, F-18, F-26 |
| AlmaFlowClim | one quote summary line "TOWN · n × SERVICE"; tile click advances a post | separate service and town tabs and a stepper; an explicit "Post suivant" button; posts reworded and MAQUETTE | the shell's hooks |
| Traveler | "Cliquer pour sauter." on the atlas; a Codex tile (12 plates, "Ouvrir le codex"); a fake ISBN; an iframe of WorkspaceHQ with LV 27 / 7240 XP / 9/20 / 22j | atlas dots not interactive; "PLANCHE XII · AFFICHE / Anatomy of Peace" opening in the viewer; "Colophon" and "VOL.04"; a link tile to ../workspacehq/ with bars and no numbers; since 2026-11-11 the poster tile also carries "Ouvrir le codex ↗" to `/hub/brand/traveler/` (the 12-plate codex, a static page ported from your design) and "Codex" ends the closing list | the first build said the codex file did not exist; it does (`brand/Traveler Brand Book.dc.html`) and is ported; no invented figures |
| Traveler | merch pictures labelled only on the store | every staged merch picture tagged MAQUETTE; brick marker text #8E382E (the colophon swatch keeps #A34135) | honesty; 4.8:1 |
| Heetch | kicker "HEETCH DZ × NUMIDEA"; "TEMPS PLEIN" chip; "Heetch Pro" launch; a copy-the-code button (ERKEB50); "EN INTERNE · RÉEL"; "Le même rythme pour vous"; "le rapport qualité/vitesse d'une équipe produit" | "YASSER × HEETCH"; tag "Campagnes + réseaux"; "Chez Heetch depuis mai 2026" (the CV); no Pro claim; the code as plain type; "PUBLIÉ"; "Le même soin pour vous"; "du brief à la publication." | F-21, F-22, F-26: only what the CV says |

**Pictures the design could not supply**

The masters of these were never in the download; the page uses pictures that
exist instead. Please supply the originals or tell me to drop the slot.
(Corrected 2026-11-11: the first list below named the Lab as lacking tiles and
the scenes as untitled stand-ins; the Lab is 30 pieces and the eight diary
scenes are now a titled row.)
- Services 01, 02 and 04: desk, diorama and sunset stand in;
- Process frames: sunset, diorama, desk, actor-win and the sting rooftop
  stand in;
- the Lab: the design's 25 tiles are 30 pieces from the bible's art, plus the
  diary row of eight prints and a link tile;
- the Founder modes: pose-laptop, pose-coffee and kuro-loaf stand in;
- studio scenes desk3 and empty; p01 to p20; c01 to c07; the poses 0, 2, 3, 4, 5 and
  7 (the Alliance case restored its charter flipbook, Canva carousel and extra
  destinations from the files that exist); AlmaFlow's x-pac and x-pipes macros
  were never placed by the design (the AlmaFlow brand book now uses them);
- no longer stand-ins: the scenes brain, clutter, desk2, am4, revs, trav3 and
  trav3b are the eight prints of the Lab's "Journal d'atelier" with their
  titles;
- the brand books: the design project has four (`brand/*.dc.html`). Three are
  ported (`/hub/brand/almaflow/`, `/hub/brand/traveler/`,
  `/hub/brand/numidea/`). The fourth, "Brand Enhancement", is not a Bordj
  Steel brand book (it is the studio's own "LOUD gear" exploration, a turn-1
  draft with three superseded mascot concepts), so the Bordj Steel case has no
  brand-book link. **Update, 2026-11-11, on the owner's word ("publish brand
  enhancement as a labelled exploration"): it is now published as a labelled
  exploration at `/hub/brand/exploration/`** (banner "Exploration · not
  adopted", mascots marked superseded, linked from the Numidea identity page
  only; the Studio is unchanged). English only, so no Arabic review key.
  **Update, 2026-11-11, on the owner's word ("keep the AlmaFlow mockups as
  they are but add more branded social media content and infographics in the
  context of a European HVAC company and brand"): the AlmaFlow brand book
  gains plate 13 (Réseaux sociaux: nine Instagram posts, three stories, two
  LinkedIn / Facebook posts and the kit's rules) and plate 14 (Infographies:
  the air/water heat pump in four steps, the yearly maintenance calendar, how
  to read an energy label (structure only), five gestures to consume less).**
  All are maquettes drawn in HTML and CSS from the book's own photos; the 12
  earlier plates are unchanged. No business fact is stated: no phone, price,
  delay, guarantee, certification, review or address (the places for a phone
  number read `[téléphone]`, the account `[@compte]`; since 2026-11-15, on the
  owner's choice of a neutral stand-in rather than the studio's own WhatsApp,
  the two phone slots show 01 99 00 12 34, a number in ARCEP's range reserved
  for fiction, labelled as a sample, to replace with the client's own; the
  account still reads `[@compte]`); the advice is general
  (annual boiler maintenance "obligatoire chaque année", heating around 19 °C,
  filters, shutters in a heat wave). French only, no Arabic page.
  **Confirmed by the owner on 2026-11-11:** "Gennevilliers (92)" is right in
  the posts' footers, and post 03's speed promise ("On vient vite", the
  "Rapide" tag) stays, like the mockups' "sous 24h".
  **Update, 2026-11-11, on the owner's word ("add more posts to the traveler
  codex too"): the Traveler codex gains plate 13 (Réseaux sociaux: an
  Instagram profile with five highlight covers, nine square posts in a 3 x 3
  grid, three 9:16 stories and the kit's rules) and plate 14 (Carrousel &
  reel: the five-image carousel "Quatre présences", a five-frame reel
  storyboard, three caption examples).** The 12 earlier plates are unchanged;
  the page now says 14 planches (title, kicker, facts, contents); the Studio's
  codex tile states no count, so the case only has a source comment updated.
  All are maquettes in HTML and CSS from the codex's own pictures and lines
  (the posters, the cat and the pigeons cut as round medals, the maquette
  merch tagged MAQUETTE and "hors vente", "Prochain monde", the terminal
  boot lines). No fact is added: no price, release date, stock, follower or
  like count, shop address, collaboration, exhibition or place; dates read
  `[date]`, links `[lien]`. The account is @yass3r.0 (the owner's choice of
  2026-11-11 for the Instagram handle). French only, no Arabic page, so no
  AR review key. Please confirm: that the Matrix-style "robot" picture of plate 08
  may be cut as a round crop in the carousel; that "Le chat est d'accord" and
  the other lines may be reused as post copy.
  **Update, 2026-11-11, on the owner's word ("add more posts to the numidea
  identity too"): Numidea's own identity page gains plate 18 (Social: an
  Instagram profile with five highlight covers, nine square posts in a 3 x 3
  grid, three 9:16 stories, two LinkedIn landscape posts and the kit's rules)
  and plate 19 (Explainers: three carousels, "The Preview in five steps" in
  eight slides, "How a project runs" and "A site in three languages" as a
  cover and three slides each).** Plates 01 to 17 are unchanged; the page now
  says 19 plates (title, descriptions, facts, contents). English only, like the
  page. The posts are maquettes in HTML and CSS from the rulebook's own
  rules (Arcanum void and navy, paper for the cast, brass button, one arcane
  word, the wordmark on a navy band or chip) and the pictures the page already
  uses (the Bordj Steel and Alliance Travel captures, Yasser and Kūro's
  drawings). Every fact is one the site states: "See your homepage before you
  pay", the Preview (free, registered businesses only, at most 4 a month, 5
  working days, a 30-minute call, 0 DA paid so far), three languages FR, EN and
  AR, "From 90,000 DZD", the reply the next working day, Sunday to Thursday
  9am-6pm, Bordj Bou Arréridj, "No middlemen. Just the builder.". No
  follower or like count, quote, award, launch date or new price. Placeholders
  are filled: the Instagram account is @stick_itty and the link is the studio's
  WhatsApp, the home page's number +213 672 41 25 78 / wa.me/213672412578 (both
  the owner's choice, 2026-11-15). Please confirm: that the Alliance Travel
  capture, which shows the client's own "A PARTIR DE 169,000 DA" badge in its
  top corner, may be used in post 06 (it is cropped to hide it); and that the
  French and Arabic feeds should follow this grid. The Arabic greeting was
  left out of post 05 (it reads "Marhaba." in Latin letters, mirrored): the
  Arabic script waits for the native review. No Arabic page, so no new AR key.
  **Update, 2026-11-11, on the owner's word ("add more posts to the bible
  too"): the character bible gains section 07b, "On the feed", the
  characters' social kit.** Sections 00 to 08 are unchanged and nothing is
  renumbered. It holds an Instagram profile with five highlight covers, twelve
  square posts (Yasser's reveal, the head-to-toe sheet, the twelve-face sheet,
  a "Things he says" quote, Kūro judging, asleep and with his paw, a
  silhouette-to-final process post, the motto, the cover of a "day in the
  void" carousel, a sticker drop marked Maquette, a two-panel meme), three 9:16
  stories (poll, link sticker, quote), a four-slide "Meet Kūro" carousel and
  the kit's rules (which drawings, scale and crop, safe zones, colour per post
  type with measured contrast, type sizes, what never to do). English only,
  like the page. Maquettes in HTML and CSS from the bible's own drawings and
  its two Studio stickers; every quoted line is a line the bible already has,
  and no count, date, price, shop or collaboration is stated. Placeholders
  read `[the commit under review]` only; the handle is @stick_itty (the
  owner's choice, 2026-11-14, for the Studio and the bible) and the links are
  the studio's WhatsApp, the home page's number, wa.me/213672412578 (the
  owner's choice, 2026-11-15). Please
  confirm: that twelve
  posts, not nine, is the grid you want; and the rules that are the kit's own
  choice rather than the bible's: Kūro never on red or teal, alone in a post he
  sits low and off-centre, the 80 px post margin and the 250 px top and 340 px
  bottom story bands. No new image file, no Arabic page, no new AR key.

**Claims to confirm (nothing was invented; these come from your design or the
CV)**
- the Instagram handle: the owner chose yass3r.0 on 2026-11-11 for the
  Traveler codex's social kit, and on 2026-11-14 stick_itty for the Studio
  (founder card and footer) and the bible (its links and its social kit's
  maquettes), and on 2026-11-15 stick_itty for the Numidea identity's social
  kit too: settled;
- permission to show Bordj Steel's figures and logos, the clients' work, and
  Heetch's posters on a portfolio; "Chez Heetch depuis mai 2026" (the CV);
  "temps plein" and "Heetch Pro" were left out;
- the AlmaFlow mockups show a phone number (07 55 01 60 13) and "Intervention
  sous 24h" and "Devis gratuit" in the pictures themselves, and the cards show
  contact@almaflowclim.fr; they are tagged MAQUETTE. Re-render without the
  number and the 24 h promise, or keep them?
- AlmaFlow's six towns (Gennevilliers, Asnières, Colombes, Nanterre, Clichy,
  Courbevoie), its four trades (Rénovation included) and the hours
  "Lun–Ven 8h00–18h00" come from your design and notes; the "92" wording is
  the design's. Confirm or drop;
- the Alliance flyers and stories show DA prices (the client's artwork), against
  the "no case prices" rule: keep showing them?
- the order of your name: the page keeps the design's "Hamisse Mohamed
  Yasser"; the CV says "Mohamed Yasser Hamisse";
- the service durations (Engine 2–6, Mark 2–5, Mind on quote) and the
  process copy rewritten to the home's terms;
- the Arabic sting HUD kept in Latin.

**The recovery of 2026-11-11** (your request of 2026-11-10 to bring back what
the overwrite of the old personal page lost; RECOVERY report items L01 to L13
and R01 to R17, all with your yes of 2026-11-11, which undoes decision 11 and
M5). Local commits, not pushed. What is on the Studio now:
- dossier 08 "Sur Behance" (12 covers, the profile link, Kūro's sticker), the
  WorkspaceHQ cartridge ticket and "Pas d'intermédiaires. Juste le builder.";
- the founder section's long-coat plate, your handle, eyebrow and motto,
  "Ce que je fais" (Designer, Developer, Artist) and Kūro's paw; Yasser's wave
  in the contact card, Kūro asleep in the footer, one yawn in the rig;
- the Lab's "Journal d'atelier" (J01 to J08) in the one viewer;
- the three brand books and their links (above);
- on the home, /en/ and /ar/: the links to the Studio and the bible, your
  restored descriptions, taglines and coordinates mark; on /scene/, /tarifs/
  and WorkspaceHQ: the Glaive Store and WorkspaceHQ full sheets, the price
  guide's lines and the breadcrumb.
Still yours to decide: the Brand Enhancement question above; the AlmaFlow
mockup pictures that carry a phone number and "Intervention sous 24h"; the
Numidea identity page is a cleaned version of your 27 October draft (it keeps
"Proposed" tags and your name order); the engraving place names stay off
(neither picture shows the place the old caption named); the Arabic keys in
section 8.

**Known small issues** (owner-visible): the thin pale line at the right edge of
the Heetch c08, c09 and c10 pictures (it looks like it is in the source images);
the Traveler and Bordj posters at 2x make the full scroll about 3.1 MB on a
phone, over the 2.5 MB target; Arabic Reem Kufi has no Latin digits.

## 22. The calculator (2026-11-16)

You said the calculator was broken. Measured on the live Studio on 15 November:
the size slider did nothing for half its range, some options added nothing, the
total was rounded after it was summed (90 000 + 22 000 read 110 000), and the
weeks never moved with the size. It is rebuilt on your approval of the plan
"The living Studio". No published price changed: the three tier cards, the
90 000 DA floor and the maintenance line are what they were.

**What is new, and yours to change:**

- **Every quote is a receipt.** Each part is a line (the package up to its base
  size, the units over it, each option, "Formule Studio appliquée" when a
  Vitrine would cost more than the Studio package, "Accéléré, +25 %"), and the
  total is the exact sum of the lines. Nothing is rounded after the sum, so
  totals such as 526 000 DA now appear where 550 000 did.
- **Weeks grow with the size** (drafted by me, none of this was on the site
  before; change any figure in `assets/app.js`, `PRICE_MODEL`, field `per`):
  one more week for every 5 pages over the package on a Vitrine or a Studio
  site, every 100 products on a shop, every 2 screens on an application, every
  3 flows on an automation, every 3 deliverables on an identity. A 400-product
  shop reads 8 to 13 weeks (5 to 10 before); a 20-screen application 15 to 23.
- **Exchange rate:** 1 € ≈ 152 DA, 1 $ ≈ 136 DA, the Bank of Algeria's official
  rate of 10 November 2026 (152.37 and 136.13, as the Algerian press printed
  the bank's daily table). It was 151 and 134 (1 October).
- **The Studio's calculator is a small console, DOURO·8** (a working name:
  "douro", the old coin). It is an original drawing, not a copy of any
  existing cartoon console. Say so if you want another name.
- **The market, inside the calculator:** three bars (Algeria, France, United
  States) from the price guide's sourced table, with your estimate laid
  across. An automation has no row in that table, so it shows no market.
- **One price list, in dinars.** A client abroad sees the same prices
  converted at the official rate. A separate price list in euros for clients
  abroad is your decision; nothing was done about it.
- **The drawing beside the title** (`hub/img/studio/douro-kuro.webp`) is new
  art made for this section. Kūro is fluffier in it than in your own
  drawings; say if you want it redrawn closer to your line.

## 23. The money section (2026-11-16)

"L'argent, sans jargon", on the Studio after "Le web, sans jargon". You
confirmed the four services are real and chose "full crypto services" with the
legal side yours. Everything below is drafted on your instruction ("price them
very attractively and make the rules beneficial on the medium range") and is
yours to change. The figures live in one place, `assets/app.js`
(`PRICE_MODEL.argent`, the options `setup`, `pack`, `guides`, `MID_RANGE`); the
cards, the kit strip and the calculator all read them from there.

| Service | Price | What the page says the client gets |
|---|---|---|
| Appel 1:1, 60 min, en visio | 3 000 DA | One hour on their situation: getting paid from abroad, accounts, prices, first steps in crypto |
| Mise en place accompagnée, 90 min | 6 000 DA | Accounts, wallet and invoicing opened and set up during the session, screen shared |
| Pack de départ freelance | 15 000 DA | Platform profiles, quote and invoice templates, a price sheet; two calls included |
| Guides et modèles | 1 500 DA le guide, 4 000 DA la collection | Written guides and templates, no session |

- **Anchor:** the Onyxlab barometer (March 2026) lists a confirmed
  consultant's hour at 3 000 DA and an agency's at 6 000 DA.
- **Kit nomade:** the pack and the setup together take 5 000 DA off. With two
  calls that is 22 000 DA instead of 27 000 (the strip on the page). With one
  call it is 19 000 instead of 24 000: the saving starts at the first call on
  purpose, or a second call would have made the order cheaper than one.
- **Mid-range rule:** a web project whose firm price lands between 180 000
  and 450 000 DA includes one coaching call and may be paid in three parts
  (40 / 30 / 30). It is stated in this section and as a note on the
  calculator's receipt. The home's payment answer (40 / 60) is unchanged and
  stays the default; say if you want the three-part option written there too.
- **What I did not know and left out:** how many guides there are and their
  titles; whether the calls are in French, English or Arabic; how the client
  pays for a call. The page promises none of these.
- **Crypto:** it is taught (lessons 1 and 5, and the client course "Le web3, sans fumée", §38) and it is a topic of the call
  and of the setup session. The page says, in three languages, that this is
  education and not financial advice, with no trading signals, no management
  of funds and no promise of gain, and it names Algeria's law 25-10 of July
  2025 (buying, selling, holding and promoting crypto-assets are banned
  there). Those two lines are in `money.note1` and `money.note2`; removing
  them is your call, I would keep them.
- **What the lessons do not say:** no payment provider is named, and no
  Algerian banking rule is stated as fact. I found no official text I could
  check on how a bank there treats a freelancer's foreign income, only pages
  from sellers of payment accounts. Where the answer depends on the reader's
  bank, the lesson says to ask the bank. If you want providers named, tell me
  which ones you use and I will check each one's own country list.
- **The calculators** in lessons 3 and 4 use the visitor's own numbers and
  one stated assumption (7 hours in a billed day).
- **Stamps:** a right answer stamps the lesson. This is kept in the
  visitor's browser only (`localStorage`, key `numidea-lessons`) and is sent
  nowhere; it is not a cookie and needs no consent.
- **New art** (made for this section): the night-desk scene and six lesson
  pictures, in `hub/img/studio/money/`. The passport in the scene carries the
  word "PASSPORT".

## 24. The motion section (2026-11-16)

"Le mouvement", on the Studio after "Ce qu'on fait". Drafted on your
instruction ("add animation and motion design… a creative section where I can
show gifs of my animations… play on hover… price them accordingly"); the
prices are the ones in the plan you approved and are yours to change. They live
in `assets/app.js` (`PRICE_MODEL.motion`, the option `anim`); the cards and the
calculator read them from there.

| Offer | Price | What the page says |
|---|---|---|
| Logo animé, 3 à 5 s, trois formats | 25 000 – 45 000 DA | The logo in motion, delivered landscape, square and vertical |
| Vidéo animée, à la seconde | + 1 800 – 4 000 DA la seconde au-delà de 5 s | 30 s: 70 000 – 145 000 DA; 60 s: 124 000 – 265 000 DA |
| Animations du site (option d'un projet web) | + 35 000 – 90 000 DA | An opening, characters that react, a receipt that prints |

- **In the calculator:** a type "Motion design" sold by the second (5 to 90 s),
  and an option "Animations du site" on the four web types. Delivery: 1 to 2
  weeks for a logo, one more week for every 15 seconds (drafted).
- **The market markers on the page** are quoted from two pages I read on
  16 November: LeFreelance.fr (updated 7 October 2026: an animated logo of 3
  to 5 s in three ratios, 600 to 1 500 € excluding tax from a freelancer; a
  60 s explainer, 3 000 to 9 000 €) and Yum Yum Videos (updated 6 August 2026:
  1 000 to 5 000 $ a minute from freelancers, 5 000 to 8 000 $ from small
  studios; it is a studio's own page). Algeria: the Onyxlab barometer has no
  motion line, and the page says so; the nearest line is a short social video,
  6 000 to 20 000 DA a post. Both links are in the price guide's sources.
- **The reel today holds six clips, none of them a client's:** five are this
  site's own motion, recorded from the page (the opening, the hero characters,
  the calculator printing a receipt, a lesson being stamped, the page turn),
  and the sixth is your MERCURY act 2 film, the same file as in dossier 07.
- **To show your own animations:** put the GIF or video anywhere on your
  machine and run
  `npm run motion:add -- <file> <id> "<name>" "<line under the name>"`
  then `npm run build`. The script cuts a small silent MP4 and a poster (at
  most 12 seconds, 640 px wide, or 540 for a portrait clip), and adds the
  clip to `hub/src/reel.json`. Add `"en"` and `"ar"` beside `"fr"` there for
  the other two languages. Needs ffmpeg. To remove a clip, delete its entry
  from `reel.json` and its two files from `hub/img/studio/reel/`.
- **How a clip behaves:** it is a still picture until the pointer rests on it
  or it is pressed, plays while the pointer stays, and stops when it leaves. On
  a phone a tap plays it once. Nothing plays by itself, and a visitor who asks
  for reduced motion gets a clip only on a press. The file is not downloaded
  before that first play.
- **One format, not two:** the clips are MP4 (H.264) only. The plan said WebM
  and MP4; MP4 alone plays everywhere and halves the weight (the five new
  clips come to about 365 kB together, posters 75 kB).

## 25. The workshop radio (2026-11-16)

"La radio de l'atelier", a shelf on the Studio under the two doors. You asked
for a music player; this is it, drawn as a small radio with Kūro asleep on it.

- **Please listen to the four tracks before you judge this section.** They
  were made for the studio on 16 November and I cannot hear them: I checked
  only their length, their loudness and that none has a long silence. If one
  is wrong for the brand, tell me which and I replace it.

  | # | Name on the page | What was asked for | File |
  |---|---|---|---|
  | 1 | Deux heures du matin | slow desert blues, clean guitar, hand claps, night sky | `hub/audio/nuit.mp3` |
  | 2 | Café no 1 | jazzhop, brushed drums, electric piano, nylon guitar | `hub/audio/cafe.mp3` |
  | 3 | DOURO·8 | mellow chiptune over a slow beat | `hub/audio/douro.mp3` |
  | 4 | Kūro dort | quiet piano lullaby with rain | `hub/audio/kuro.mp3` |

  A fifth, a lo-fi piece with an oud, was refused by the music service's
  filter and does not exist. The names are mine; rename them in
  `hub/src/radio.json`.
- **Each track is cut to two minutes** with a fade, evened in loudness, as MP3
  at 80 kbit/s (1.2 MB each, 4.8 MB together). The originals run about 2 min 45
  and are kept in the service's project folder, not in this repository.
- **It never starts by itself.** Nothing is downloaded and nothing sounds
  until a visitor presses play. After that the tracks follow each other and
  come round again until the visitor pauses or turns it off.
- **Controls:** play and pause, previous and next, the four tracks by name,
  the volume; all work from the keyboard. Once it is on and the shelf has
  scrolled away, a small control stays at the foot of the screen (above the
  phone's bottom bar) with pause, next and off. A phone's lock screen shows
  the track with its keys.
- **What is remembered:** the track, the place in it and the volume, in the
  visitor's browser only (`localStorage`, key `numidea-radio`). The next visit
  shows the same track and, when play is pressed, takes up where it stopped.
  Nothing is sent anywhere; it is not a cookie.
- **One difference from the plan:** the radio is on the Studio page only. The
  plan said it would carry over between the Studio's pages; the bible and the
  brand books have no radio, so the music stops when a visitor opens one. Say
  if you want it there too.
- **To add or replace a track:** put an `.mp3` in `hub/audio/`, add or edit
  its entry in `hub/src/radio.json` (`id`, `src`, `dur` in seconds, `name` in
  the three languages), then `npm run build`. A file in `hub/audio/` that the
  list does not name stops the build.
- **Rights:** see NOTICE.md. Like your illustrations, no licence is chosen
  for the music; that choice is yours.

## 26. The split: the Studio for clients, the manual for learners (2026-11-16)

You approved items 1 to 4 of my review of the new sections. This is what they
became. Sections 23 (money), 24 (motion) and 25 (radio) above still describe
what each piece is; where each one sits is now as written here.

- **A new page, "Le manuel":** `/hub/manuel.html`. It holds the night-desk
  scene, the workshop radio, the six lessons with their two notes, the four
  coaching services and the Kit nomade, and at its foot a band that sends a
  reader back to the Studio and the Aperçu. Three languages, like the Studio.
- **Three ways to reach it from the Studio:** a third, slimmer door under the
  two ("03 · LE MANUEL, J'apprends"), the phone menu's "Apprendre" group, and
  the footer.
- **The Studio's order is now:** the opening, the doors, the problem (01),
  what we do (02), the Aperçu (03), client work (04), the method (05), the
  prices (06), the brand (07), the web (08), then "the world" (start here,
  VOIDSPLUNKER.std, MERCURY, the rest of the work), the Lab (09), the studio
  (10), questions (11), contact (12). On a phone the Studio went from 40.3 screens to 33.4 (2,864 words to 2,171, 370 controls to 311); the Aperçu now starts at screen 5.8 (it was at 10.0), client work at 7.1 (22.6), the prices at 13.0 (12.0) and the contact at 31.7 (38.7).
- **Taken off the Studio:**
  - the radio. Music is on the manual page only, so it stops when a visitor
    leaves that page. Say if you want it on the Studio as well;
  - the three motion cards. Motion is now one line at the foot of "Ce qu'on
    fait" (its three prices and two links: the calculator, the reel). The reel
    is in the Lab. The list of market sources that stood under the cards is no
    longer on the page; the same figures remain in the calculator's three
    market bars and in the price guide;
  - the coaching type in the calculator ("L'argent") and its three options.
    The calculator prices client projects only. Coaching is booked from the
    manual page: each card and the kit open WhatsApp with a line that names the
    service and its price;
  - the sentence under the money cards about projects between 180 000 and
    450 000 DA. The rule itself is unchanged and still prints on the receipt
    when an estimate meets that band.
- **Copy I drafted, yours to change** (`hub/src/i18n/fr.json`, with English
  and Arabic beside it):
  - the third door: "Se faire payer de loin, fixer son tarif, comprendre la
    crypto : six leçons courtes, quatre services à prix fixe, et la radio de
    l'atelier." (`doors.c`);
  - under the three market bars: "Notre prix comprend la conception sur mesure,
    des fichiers et un code qui vous appartiennent une fois le projet payé, un
    seul interlocuteur du premier appel à la livraison, et 30 jours de
    corrections ensuite." (`pricing.mk.why`). Each part comes from the terms of
    31 October (ownership once paid in full, 30 days of fixes) and from the
    Studio's own line "conçus et codés par les mêmes mains". Check that it is
    what you want to promise on a motion or an identity job too;
  - the manual page's title "Le manuel — gagner sa vie de loin", its services
    head "Pour aller plus loin, à deux." with "Les leçons sont gratuites. Si
    vous voulez qu'on regarde votre situation ensemble, voici quatre services à
    prix fixe : le prix est écrit, il ne bouge pas.", and the closing band "Le
    Studio le construit." (`manual`);
  - the client-work lead no longer counts the two personal projects, which
    moved to "the world": "Trois clients livrés et deux travaux du fondateur."
- **The reel's clips were recorded before the split.** "Le tampon" shows the
  lessons on the Studio and "Le passage" shows two doors. They are still
  recordings of this site's pages; say if you want them recorded again.
- **Not done, waiting for your word** (items 5 and 6 of the review): what a
  visitor gets for six stamps, a way to follow the studio from the manual page,
  and then the characters and the wider manual, both on the new page.

## 27. The official address: www.numedialab.dev (2026-11-16)

You chose the studio's own domain as the address people and Google should
find, and confirmed that Search Console verified `numedialab.dev`.

- **What changed:** every page now names `https://www.numedialab.dev/` as its
  own address (the canonical link, the address in a shared link's preview, the
  language alternates), and so do `sitemap.xml` and `robots.txt`.
- **What did not:** the site is still served by Vercel, and
  `numidea-tech.vercel.app` still shows the same pages. Links you already
  shared keep working. `numedialab.dev` without `www` forwards to `www`.
- **For you, in Search Console:** open Sitemaps and submit
  `https://www.numedialab.dev/sitemap.xml`. Then use URL Inspection and
  "Request indexing" on the home page, `/en/`, `/ar/`, `/tarifs/`, `/hub/` and
  `/hub/manuel.html`.
- **Your decision, not done:** the Vercel address could forward every visit to
  the domain, so only one address is ever seen. It is cleaner for search, and
  it means the Vercel address stops being a second way in. Say the word and I
  set it up.
- **Elsewhere:** the links on Behance, Instagram and DeviantArt, and any link
  on a client's site, are yours to point at the new address.

## 28. Kūro lives on the manual, and can be played (2026-11-16)

Step 5 of "The living Studio": you asked for Yasser and Kūro living on the
site "like Mario on a 2D plane". This first version is Kūro's, on the manual
page, where you agreed the characters go.

- **What a visitor sees without doing anything special.** Kūro sleeps on the
  radio. When a scroll ends and he is out of sight, he comes to something in
  view (the top edge of the scene, the radio, the night card, the lessons'
  plate, the line above a lesson's question, a service card, the kit, the
  last band, the footer) and sits. He goes to the lesson you pick, taps a paw
  at a wrong answer, hops at a right one, sits on the radio when it starts
  and sleeps when it stops, and goes to a service card a mouse rests on. Each
  trip lasts a few seconds and then he is still: nothing on the page moves by
  itself.
- **"Jouer avec Kūro".** A night card under the radio, "La ronde de nuit".
  The arrow keys (or a pad at the foot of the screen on a phone) walk him;
  Up leaps to the thing above, Down drops to the thing below, Space hops.
  Seven red seals wait on the page; all seven open "Le dessin de nuit", a new
  drawing of Yasser and Kūro on the workshop roof at four in the morning.
  Seals are kept in the visitor's browser only (`numidea-seals`).
- **Yasser.** He does not walk. When Kūro reaches the last band, where Yasser
  stands, a bubble from Yasser counts the visitor's lesson stamps and points
  to the lessons. A walk for Yasser was not tried: his likeness is harder to
  hold across frames than a black cat's, and I preferred one character done
  well. Say if you want it tried.
- **How the art was made.** One clean side view of Kūro, drawn from your
  existing Kūro drawings, then five short clips of that same drawing (walk,
  sit, jump, paw, sleep). I cut 47 frames out of them into one sheet
  (`hub/img/studio/life/kuro.webp`) and gave him a cream sticker edge so he
  reads on paper, on the navy and on ink. Please look at him closely: he is
  smoother and rounder than your ink drawings. Spent on this step: 960
  credits (2,865 of the 15,000 so far).
- **Lines I wrote for them, yours to change** (`hub/src/i18n/fr.json`, group
  `life`): Kūro's "Bon choix.", "Tamponné.", "Kūro valide.", "Non.",
  "Relis.", "Plus fort.", "Prix fixe. J'ai vérifié.", "Sept. Regarde.";
  Yasser's "Pas encore de tampon ? Les leçons sont plus haut." and "Six
  tampons sur six. Respect."; the card's title "Kūro habite cette page." and
  the drawing's caption.
- **Reduced motion and no scripts.** A visitor whose device asks for less
  motion gets none of this: the sleeping picture stays on the radio and the
  card says the game is off. That excludes those visitors from the game; it
  is the careful choice, and yours to revisit. Without scripts the card is
  not shown.
- **Two small layout changes for his sake:** 86 px between the services'
  heading and its four cards on a wide screen (it was 44), and on a phone
  72 px above the line over each lesson's question. That air is where he
  sits.
- **Still open from the review:** what a visitor gets for six lesson stamps
  (the seals have their drawing; the stamps have nothing yet), and a way to
  follow the studio from this page.

## 29. The retro pack and "Le jeu juste", the gamification course (2026-11-16)

You asked, while Kūro was being built, for "a new gamified N64 vibe pack"
(stickers and pixel-art versions of the characters) and "a master course in
gamification and how it's good for business", with real cases and with your
own brand's use of it. You confirmed that "no run" meant "now run".

- **The pack** (`hub/img/studio/jeu/`), made from your characters:
  - a key picture in the look of a late-1990s 3D console game: Yasser with
    his coffee, Kūro leaping after a trail of red seals, the DOURO·8 console
    glowing on the next island (`key.webp`);
  - eight pixel-art pictures, one per level of the course (`lv-1` to `lv-8`);
  - eight stickers (`st-1` to `st-8`): Kūro at a game pad, Yasser with a
    headset and a thumb up, Kūro riding the console, Kūro and a cup, a high
    five, Kūro asleep on a cartridge, Kūro catching a star, a seal with a paw;
    and the whole sheet as one transparent picture (`stickers.webp`).
  It is original work: no console maker's name or logo, no existing game's
  characters or interface. "N64" is the feeling you named, not a mark used.
  Spent on the pack: 390 credits (3,255 of the 15,000 so far).
- **The course**, on the manual page between the money lessons and the
  services (`#jeu`), three languages, eight levels in the lessons' own form
  (one idea, one explanation at a time, one question):
  1. what gamification is, and what it is not;
  2. why it works: the three needs a game feeds;
  3. what research says about learning;
  4. the mechanics, one by one;
  5. what it does for a brand;
  6. what it earns: four real cases;
  7. when it harms;
  8. the rules this site plays by, with the place to check each one.
  A right answer stamps the level and puts one sticker in the visitor's book;
  eight of eight offers the sticker sheet to download. Like the other stamps,
  these stay in the visitor's browser (`numidea-lessons-jeu`).
- **Every figure has a source, and I checked each one before writing.** The
  list is under the course ("Les sources du cours", 21 entries, each a link).
  What the check changed:
  - the loyalty-card study (Nunes and Drèze) is told without its percentages:
    the "34% against 19%" you see quoted everywhere could not be read in the
    paper itself, only in other people's summaries;
  - Foldit says "three weeks", which is what the university's release says;
    "ten days" is press wording and is not used;
  - the Stockholm speed-camera lottery is told as what it is: three days, no
    control group, and a figure that comes from the sponsor, Volkswagen;
  - Starbucks and Deloitte are marked as the companies' own figures;
  - Gartner's "80%" is marked as a forecast, not a measurement, and it links
    to a news report of the release because Gartner's own page could not be
    opened;
  - one study (Hanus and Fox) is marked as small: two classes.
- **Level 5 is an opinion, and says so**: what play gives a brand (a voice,
  a world, a ritual, and the limit). It is my reading of your site, written
  in the studio's voice. Change it to your own words if it is not what you
  think.
- **Level 8 makes promises on your behalf**, each true of the site today:
  nothing starts by itself; the calculator's total is the exact sum of its
  lines; a reward is a drawing or a sticker, never traded for an address or a
  purchase; stamps, seals and stickers are sent nowhere, with no account and
  no leaderboard; no streak and no countdown. If you later add any of those
  things, this level must change with it.
- **A closing line sends a reader to the Studio**: "Un site, un cours ou une
  marque qui joue juste, ça se construit. En parler au Studio →". It names no
  price and no new service. Say if you want gamified work listed as an offer.
- **The page's opening line changed** to name both courses: "Se faire payer
  depuis l'étranger, choisir ses comptes, fixer son tarif, comprendre la
  crypto : six leçons courtes. Puis un maître-cours sur la gamification, et
  quatre services pour aller plus loin."
- **The stickers are yours to use elsewhere** (messages, posts). Like the
  rest of the art made for the site, no licence is chosen for them yet.

## 30. "Le carnet de route", the nomad lessons (2026-11-16)

You said "go, start the nomad-life lessons". This is step 6 of the plan, the
last of the six things you asked for.

- **Where**: on the manual page, between the money lessons and the
  gamification course (`#nomade`), in three languages. The top bar now reads
  Argent · Nomade · Jeu juste · Services · Radio.
- **Eight stops**, in the lessons' own form (one idea, one gesture, one
  question):
  1. finding clients: a calculator, how many messages to send for the clients
     you want, at your own reply and signing rates;
  2. pricing a project: day rate, times days, plus a margin; and the 40% asked
     at the order;
  3. the quote that protects you: scope, deposit, revisions, ownership,
     deadline;
  4. working across time zones: the hours two 9-to-18 days share;
  5. the bag and the connection: backups, bandwidth for a call, a second
     connection;
  6. security on the road: public Wi-Fi, two-step verification, passwords,
     disk encryption, habits on the spot;
  7. a freelancer's year: how many days a year can really be billed;
  8. before you leave: the questions to ask about the stay, taxes, health,
     the bank and the phone.
  A right answer inks one stamp in a passport strip above the lessons; eight
  of eight offers a phone wallpaper of the terrace scene. Like the other
  stamps, these stay in the visitor's browser (`numidea-lessons-nomade`).
- **Stop 3 quotes your own terms**, as they are published on the home page's
  questions: 40% at the order and 60% at delivery; two rounds of revisions
  per stage, further ones quoted separately; the site belongs to the client
  once paid in full; the firm deadline set once the project is scoped. It
  says "these are our terms, not a legal template". Stop 2 quotes "si le
  travail déborde, l'écart est pour nous". If you change those terms on the
  home page, these two stops must change with them.
- **The calculators claim nothing.** Their starting values are examples and
  the text says so ("des exemples, pas des moyennes"): 10 replies per 100
  messages, 25 signatures per 100 replies, 60% of time billed, 5 weeks
  without work. The day rate that stop 2 starts from, 12,500, is the result
  the money manual's own rate lesson starts on. Change any of them if you
  have truer starting points from your own experience.
- **Every piece of advice has a source, and each was checked before
  writing** (nine entries under the lessons, "Les sources du carnet"). What
  the check changed:
  - public Wi-Fi: no official page I could open says "never do your banking
    on public Wi-Fi", so the lesson does not say it. It says what the French
    agency (ANSSI) and the British one (NCSC) do say: avoid networks you do
    not control when you can, use the mobile network, or a VPN;
  - two-step verification: Microsoft's well-known "blocks 99.9% of attacks"
    is its own marketing figure with no method given, so it is not used;
  - disk encryption: no agency page says in so many words "your data is safe
    if the laptop is stolen", so the lesson gives the NCSC's actual advice
    (encryption that asks for a password at start-up) and no promise;
  - the 3-2-1 backup rule is given in the NCSC's wording (three copies, two
    devices, one elsewhere), which I could read directly;
  - video calls: Zoom's and Google Meet's figures are marked as the vendors'
    own; Google gives no figure for a call between two people, so the lesson
    gives its per-participant figure and says so;
  - the Schengen rule is given with the Commission's own hedge ("en
    général"), and nothing is said about any other country's visa;
  - Algeria's UTC+1 with no summer time comes from the time-zone database
    that computers use, not from an Algerian official page (I found none).
  The ANSSI guide dates from 2019 and is written for employees; the note
  under the sources says so.
- **Stop 8 gives questions, not answers.** Stay, tax, health and banking
  rules depend on nationality, status and country, and I had no official
  text for an Algerian freelancer's case. So the lesson tells the reader
  what to ask the consulate, the tax office, the insurer and the bank. The
  note under the sources says "Rien ici n'est un conseil juridique ou
  fiscal". If you want real answers there (for Algeria, for France), they
  need to come from you or from an accountant.
- **The art** (`hub/img/studio/nomade/`), made from your characters: the
  terrace scene (Yasser at a table above a lit coastal town at night, Kūro on
  the backpack), eight small pictures of Kūro, one per stop, and a tall
  version of the terrace for a phone screen. Spent: 325 credits (3,580 of the
  15,000 so far). No licence is chosen for it yet, like the rest.
- **The page's opening line and its search description changed** to name the
  three sets: "Se faire payer depuis l'étranger, fixer son tarif, comprendre
  la crypto : six leçons d'argent. Puis un carnet de route pour travailler de
  partout, un maître-cours sur la gamification, et quatre services pour aller
  plus loin."
- **Not done, on purpose**: the plan's older idea of lessons about the
  Studio's own offer (what a site costs, the Aperçu, the five steps) is not
  in this set; the Studio page already says those things to clients. And the
  six money lessons still have no reward for a full set. Say if you want
  either.

## 31. The copy sweep, first slice: search titles and the world's voice (2026-11-16)

You asked for "an improvement sweep on the website copy" using Google's
search starter guide, in a writing style that mixes two references: the
Cyberpunk wiki and the Bloodborne wiki. This is the first slice, on the Studio
page; I stopped there so you can judge the voice before it goes further.

- **What Google's guide asks, and where the site stood.** I read the guide in
  full and checked every published page against it. Most of it was already in
  place: one unique title and description per page, one main heading, a
  canonical address, alternate languages, alt text on content images, no vague
  link text, a sitemap. The guide itself says not to chase keywords, word
  counts or heading order, so I did not.
- **What changed for search**:
  - the Studio's title now says what it is and where: "Studio web et logiciel
    à Bordj Bou Arréridj | Numidea Labs" (it was "Numidea Labs — le studio :
    sites, applications et marques");
  - the manual's title now says what a searcher gets: "Manuel du freelance
    nomade : 22 leçons gratuites | Numidea Labs" (it was "Le manuel — gagner
    sa vie de loin");
  - the third door on the Studio still said "six leçons courtes"; it now says
    twenty-two and names the three sets;
  - the codex (below) defines the site's own names in plain sight, each with a
    link whose text says where it leads. That is the guide's "write good link
    text" and "make it unique", applied to your world.
- **The voice, written down** (BRAND.md, "The world's voice"). Two registers.
  A plain one for whatever a client or Google must understand: titles, the
  offer, prices, terms, answers, buttons. A world one for the rest, which
  fuses the two references as I read them: short street-tech lines (a tag, a
  number, things that ship) and the cadence of an object's description (what
  it is, whose it is, what it does or costs, and a last line that turns).
  **Nothing is taken from either reference**: no name, no slang, no term.
  Only the method.
- **I could not open the Cyberpunk wiki**: it refuses automated readers. I
  worked from what I know of that voice, not from the pages. The Bloodborne
  wiki and Google's guide I read directly.
- **Where the voice was applied**:
  - the four service cards: each still opens on the plain words a client
    searches ("Sites vitrines, e-commerce et applications web sur mesure"),
    then two short lines in the world's register ("Écrits à la main, ligne
    après ligne. Ce qui est lent ne sort pas de l'atelier.");
  - **the codex**, new, inside "Commencer ici" on the Studio: eleven entries
    that open one by one (Yasser, Kūro, the night workshop, the Aperçu, the
    seal, DOURO·8, the radio, the manual, tr4veler.exe, MERCURY,
    VOIDSPLUNKER.std). Every fact in them is already printed elsewhere on the
    site; the wry lines are mine ("Ce qui en sort au matin a été relu par un
    chat."). Change or cut any of them.
- **What I left alone, on purpose**: the Studio's headings, the Aperçu, the
  prices, the questions and the contact block. They already have a voice and
  they sell; rewriting them for style would cost clarity. Say if you want the
  voice pushed further there.
- **Not done yet** (the next slices, on your word): the home page and the
  price guide (the pages that earn; I would touch only labels and the
  founder's card), the manual's section heads, the character bible and the
  brand books (English), and the 404 page.
- **A note on search**: Google's guide says a change can take from a few
  hours to several months to show. The titles are the part most likely to be
  seen first.

## 32. The copy sweep, second slice: the voice pushed further (2026-11-17)

You answered the first slice with "keep the codex, push the voice further, do
the next slices". This is that pass. I read every surface before touching it,
and the honest finding is that most of them already spoke in this voice: the
work was mainly on the Studio.

- **The Studio, pushed** (three languages):
  - nine section labels gained a second tag, in the short "signal" register:
    "/ 01 · LE PROBLÈME · TROP DE MAINS", "/ 03 · L'OFFRE SIGNATURE · AVANT DE
    PAYER", "/ 04 · LES REÇUS · PIÈCES À L'APPUI", "/ 05 · LA MÉTHODE · CINQ
    TEMPS", "/ 06 · LES PRIX · PUBLIÉS", "/ 09 · LE LAB · HORS COMMANDE",
    "/ 10 · LE STUDIO · UNE SEULE MAIN", "/ 12 · ON EN PARLE · PAR ÉCRIT", and
    "/ 02 · CE QU'ON FAIT · QUATRE FAMILLES". The number and the plain name
    stay first;
  - the five steps of the method each end on a short last line ("Le jargon
    reste à la porte.", "On montre d'abord ; l'argent vient après.", "Le
    prix, lui, ne bouge plus.", "Les clés changent de main.", "Un site
    s'entretient comme un outil.");
  - the three layers of the world each gained a last line ("Ce qui paie le
    café.", "Rien n'en sort sans avoir été regardé.", "Chaque projet livré
    en ouvre la porte.");
  - a few leads: the services ("Personne ne vous passe à un autre."), the
    proofs ("…pour qui, et où le vérifier."), the Lab ("Personne ne les a
    commandées ; c'est pourtant là que naît la direction artistique de vos
    projets."), the contact block ("Pas de standard, pas de ticket."), the
    night door, and the VOIDSPLUNKER dossier's last line.
  Each added line says something already true of the site. "Pas de standard,
  pas de ticket" and "Personne ne vous passe à un autre" are promises about
  how you work: they match what the page already says (one contact, messages
  only), but they are yours to keep.
- **The manual**: two labels gained a tag ("/ SIX LEÇONS · L'ARGENT", "/
  QUATRE SERVICES · PRIX FIXE"). Its three sets of lessons, the radio and
  Kūro's lines were written in this voice already; I left them.
- **The home page**: three lines only, because it is the page that earns and
  its register is the plain one: the founder's lead ("Derrière Numidea, une
  seule main : un fondateur qui conçoit, code et livre lui-même. Des
  freelances le rejoignent quand un projet le demande."), the caption under
  your portrait ("Yasser, à l'atelier. Ce café n'est pas le premier."), and
  the services' lead ("…Un seul interlocuteur pour tous."). The headline, the
  offer, the prices and the answers are untouched.
- **The character bible**: one pair added to "He does / He never" ("Names a
  thing, says whose it is and what it costs, then one dry line." / "Borrows
  another world's slang to sound like it."), and a link to the codex among
  its ways back to the Studio.
- **The studio's rulebook** (the brand identity page): the voice plate now
  states the two registers, with one line from the codex as an example.
- **Left alone, and why**:
  - the 404 page: its three lines and Kūro's ("L'atelier, lui, est resté
    ouvert.") are already this voice;
  - the traveller's codex: it is your own lore, with its own voice plate; a
    studio voice laid over it would flatten it;
  - AlmaFlowClim's brand book: it is a client's brand, in the client's voice;
  - the exploration page: labelled as not adopted.
- **If you want it louder still**, the places left are the ones I kept plain
  on purpose: the Studio's headlines, the Aperçu's three steps, the prices
  and the answers to questions. Changing those trades clarity for style, so
  that is a decision for you, not a sweep.

## 33. The copy sweep, third slice: the Studio's headlines (2026-11-17)

You answered the second slice with "keep the promises, go louder on the
headlines too". The two promises stay as published ("Personne ne vous passe
à un autre.", "Pas de standard, pas de ticket."). This slice is the
headlines.

- **Six section headlines of the Studio changed** (three languages). They
  were the flat ones; each new line states something its section shows:

  | Section | Before | Now |
  |---|---|---|
  | 04 · Les reçus | Le travail, en vrai. | Tout ce qui suit existe. |
  | 05 · La méthode | Comment on travaille. | Du premier appel aux clés. Puis on reste. |
  | 06 · Les prix | Nos prix. Sans surprise. | Les prix sont sur la table. |
  | 08 · Le web, sans jargon | Trois choses que votre site doit faire. | Vite. Solide. Trouvé. |
  | 11 · Questions | Ce qu'on nous demande. | Les questions qui fâchent, d'abord. |
  | 12 · On en parle | Rendons-le réel. | La porte est ouverte. Écrivez. |

  The label above each headline still carries the section's plain name and
  number, so a reader who scans, or a search engine, loses nothing.
- **What each one leans on**: "Tout ce qui suit existe" on the five dossiers,
  each with a place to check it; "Du premier appel aux clés. Puis on reste"
  on the five steps (the call, the accesses handed over in your name, then
  thirty days of fixes and the maintenance if wanted); "Les prix sont sur la
  table" on the published prices; "Vite. Solide. Trouvé" on the section's
  three cards (speed, hosting, search); "Les questions qui fâchent" on the
  six questions (payment, ownership, delay); "La porte est ouverte. Écrivez"
  on the contact block, which takes messages and no calls.
- **Four headlines I kept, because they are already at full volume**:
  "Chaque intermédiaire coûte de l'argent et du sens.", "Une vraie démo.
  Avant de payer.", "Votre logo n'est pas votre marque.", "Assez petits pour
  s'en soucier. Assez seniors pour livrer." (three of them are quoted in your
  rulebook as the lines to write towards), along with "Ce qu'on rend réel."
  and "Ce qu'on fait quand personne ne commande."
- **One I held back on purpose: the page's first heading**, "On construit le
  logiciel que votre business attend." It is what a visitor reads first and
  what Google is most likely to show with the title; it says plainly what
  the studio does. Tell me if you want it changed too, and to what.
- **"Rendons-le réel" is gone as the closing line.** It mirrored "Ce qu'on
  rend réel" at the top of the services. If you miss the pair, say so and I
  put it back.

## 34. The copy sweep, fourth slice: the Studio's first heading (2026-11-17)

You said "go louder on the first heading too". It is done, on the Studio page
only.

- **Before**: "On construit le logiciel que votre business attend."
- **Now**, three short lines, the last in red:
  **"Votre idée. Une seule main. Votre logiciel."**
  In English "Your idea. One pair of hands. Your product.", in Arabic
  «فكرتك. يد واحدة. برنامجك.» (The English says "product" because
  "SOFTWARE." is too wide a word for the heading's column on a very wide
  screen: it touched the card beside it.)
- **Why this line**: it is the page's whole argument in three beats. What is
  yours goes in, what is yours comes out, and one pair of hands stands
  between the two: the same claim the first section makes at length ("Pas
  d'intermédiaires. Juste le builder."). "Une seule main" is already how the
  page names you (the label over section 10, the founder's lead on the home
  page).
- **A first wording was dropped**: "Votre idée entre. Un logiciel sort. Une
  seule main." At desktop width the heading's column is narrow, and it broke
  into eight one-word lines that pushed the two buttons further down. The
  wording kept holds in six lines there, one fewer than the old heading, and
  in three on a phone.
- **What keeps it clear**: the plain words sit directly around it. The label
  above still reads "/ STUDIO LOGICIEL · BORDJ BOU ARRÉRIDJ · FR·EN·AR", the
  line below still reads "Sites, applications, automatisations et identités,
  conçus et codés par les mêmes mains.", and the page's title, the one Google
  shows, is unchanged: "Studio web et logiciel à Bordj Bou Arréridj | Numidea
  Labs".
- **The honest caveat**: this is the first thing a visitor reads, and it is
  now a claim about how you work more than a description of what you sell.
  "Une seule main" is true as the page tells it (you scope, design, code and
  deliver; freelancers join for a precise part and you answer for the
  delivery). If a project ever runs otherwise, this line is the first to
  change. And if enquiries from the Studio page drop in the coming weeks, the
  old heading is one edit away.
- **Not changed**: the home page's first heading ("Voyez votre page d'accueil
  avant de payer."), which is the offer itself, and the README's opening
  quote, which is the studio's general tagline.

## 35. An outside scorecard, checked claim by claim (2026-11-17)

You pasted a scorecard of the site (eight areas, scored 4 to 6 out of 10,
with six priority fixes). I measured every claim on the built site before
acting on any of it. Two things explain most of the low scores: the reviewer
came in by the Studio page and took it for the home page, and they read the
site on its second address, `numidea-tech.vercel.app`.

**What the reviewer did not see.** The home page is `/`, not `/hub/`. It is
navy and gold like the price guide, its first heading is the offer ("Voyez
votre page d'accueil avant de payer."), the offer's conditions are printed
under the button, and it makes 26 requests. So "make the Preview the front
door" describes the page that already is the front door.

| The scorecard says | Measured | Verdict |
|---|---|---|
| The hub, /tarifs/ and the 404 look like three studios | Two looks: navy and gold (home, price guide, 404), cream and red (the Studio, the manual). It was decided on 15 November as night and day modes. | True as seen, and deliberate. Still a fair point: a visitor who lands on the Studio first meets a different studio one click later. |
| The hub loads Archivo, Montserrat, Manrope, Sora, DM Sans | At load: Archivo, Geist, Geist Mono, Permanent Marker, Noto Sans JP. The other four are the clients' own typefaces, fetched only when their case study scrolls into view. | Mostly false. |
| The rulebook lists other faces than the Studio uses | The rulebook describes the home page's system only. | True: the Studio's faces are written in BRAND.md, not in the public rulebook. |
| The hub makes 166 requests, 2.4 MB, 319 images | 47 requests when the page opens; 169 only after scrolling all 35,000 px of it. 298 of the 319 images load lazily. | True of a full scroll, not of a visit. The page is long. |
| /tarifs/ is light and well titled | 14 requests, no image, one heading. | True. |
| The brand page is a public draft with internal notes | It says "draft 0.1 · 27.10.2026" and tags plates "Proposed". It is linked from the Studio. | True. Yours to decide: sign it off, or unlink it. |
| 24 of 36 images on it have no alt text | No image lacks the attribute. 24 are marked decorative on purpose: they sit inside mock social posts whose captions describe them. | False. |
| Canonical tags point to the wrong address | Every page names itself on `www.numedialab.dev`. The reviewer was on `numidea-tech.vercel.app`, where that looks like a mismatch. An English browser on /tarifs/ is sent to /en/tarifs/, whose canonical is /en/tarifs/. | False as a defect; true as a symptom of two live addresses. |
| The 404 is French by default | It prints its line in three languages and highlights the visitor's. | Minor. |
| The Preview's conditions are hidden in question 1 | They are printed under the offer on the home page and in the Studio's Aperçu section. | False. Whether the conditions are too strict is a business choice. |
| Prices in euros and dollars, but only an Algerian WhatsApp and a Gmail | Correct. | True. A contact address on your own domain would answer half of it. |
| The first heading fails contrast | Its red line measured 3.91:1. That passes the standard for large type (3:1) and fails the stricter 4.5:1 some tools apply. | Fixed: it is now 5.16:1. |
| Tiny text | A few decorative labels under 12 px, none read by a screen reader. | Partly true. The course's level labels are now 12 px. Two remain by design: the arcade card's "PRESS START" and the word on the seal. |
| No sign of reduced-motion handling | Each page carries 8 to 20 reduced-motion rules, and the scripts stop all movement; a check runs on every page for it. | False. |
| Autoplay-style video | Seven clips, none plays by itself, each has a poster. | False. |
| Three clients, no quotes | Correct: no client quote is published. It has been on your list since October (consent). | True, and yours. |
| A job test shown as a case study | The Studio's Heetch dossier is your work as an employee there, and says so. "Heetch Entry Test" is the title of one of twelve Behance projects listed in dossier 08. | Misread, but the title does read like a test. One line to remove if you want. |
| The copy contradicts itself | The home page says four client sites delivered; the Studio says three clients. Nomara Voyages is on the home page and has no dossier in the Studio. | True. Which number is right is yours to say. |

**Fixed now** (small, no decision needed): the red line of the Studio's first
heading uses the darker text red; the course's level labels are 12 px.

**One link I can no longer confirm by machine: your Behance profile**
(`behance.net/br4vetr4aveler1`, linked from the home page, the Studio and the
character bible). Since 17 November Behance answers "forbidden" to automated
readers for profile pages, as it always did for project pages. The link has
not changed and it answered until then, but please open it once yourself to
be sure it still leads to your profile.

**Their six priorities, and what I would do with each:**
1. *Make /tarifs/ and the Preview the front door.* Already so at `/`. What
   would help: share `/` as the link, not `/hub/`.
2. *One domain.* The tags are already right. The fix is the redirect from
   `numidea-tech.vercel.app` to `www.numedialab.dev`, offered on the 16th and
   still waiting for your word. This scorecard is the proof it matters.
3. *Hub under 40 requests.* It opens with 47. Moving the world (below) is
   what would cut it properly.
4. *Move the lore to its own section.* The one structural change I would
   make: a page for the world (the dossiers 06 to 08, the Lab, the diary, the
   codex), as was done for the manual. The Studio would be the client page it
   says it is, and far lighter.
5. *Contrast, reduced motion, draft labels.* Contrast is fixed, reduced
   motion was already there, the draft label is your decision.
6. *Two client quotes, remove the Heetch test.* The quotes need your
   clients' consent. The Behance title is one line.

## 36. The world has its own page, and the second address redirects (2026-11-18)

You said "do the redirect and give the world its own page". Both are done.

**The world's page** is `/hub/monde.html`. It holds what was the back half of
the Studio: "Commencer ici" with the codex, the dossiers 06 (VOIDSPLUNKER.std),
07 (MERCURY) and 08 (the design work on Behance), the Lab's thirty pieces and
the workshop diary. It opens on the premise you approved and one plain line:
"Rien sur cette page n'a été commandé par un client."

- **The Studio is now the client's page from top to bottom**: the offer, the
  proofs, the method, the prices, the brand, the web, then you, the questions
  and the contact. Its sections are renumbered 01 to 11 (the studio is 09,
  the questions 10, the contact 11). On a desktop it is about a third
  shorter (22,900 px against 35,100) and carries 255 pictures against 319.
- **The motion reel stayed on the Studio**, moved up under the motion line of
  the services: it shows a service you sell, with its button to the
  calculator, so it belongs with the client's page and not with the Lab.
- **The tr4veler.exe and Heetch dossiers stayed on the Studio** too, among
  the five proofs, as "deux travaux du fondateur". Say if you would rather
  have tr4veler.exe on the world's page.
- **Every way in follows**: the Studio's second door, its "Le monde" link in
  the bar and the menu, its footer, the founder's two links (the design work,
  the diary), the traveler dossier's "voir aussi", and the character bible's
  ways back, which now say "The world".
- **The page's title and heading**: the title is plain ("Le monde de Yasser
  et Kūro : bible, MERCURY, codex | Numidea Labs"); the heading is the
  world's ("Derrière la porte de nuit."), with the label "/ LE MONDE ·
  PROJETS PERSONNELS" above it. Both are mine; change them freely.
- **One clip of the reel is out of date**: "Les personnages" was recorded
  with the Studio's old first heading. It joins the two clips already on
  your list to record again.

**The redirect.** `numidea-tech.vercel.app` (and Vercel's team address for
the project) now answer every page with a permanent redirect to the same
page on `www.numedialab.dev`. Old links and bookmarks keep working; a visitor
or a reviewer can no longer read the site on the second address. The preview
addresses Vercel makes for each change are left alone, so a change can still
be looked at before it is published.

## 37. The visual pass: the doors, the framed scenes, the transitions (2026-11-19)

You asked to redesign "the brand or website section", which you found ugly,
to fix the empty areas and the badly cropped or badly centred pictures, to
give the weak sections a meaning or a drawing, to enhance the transitions,
and to use the image service to expand the brand. The plan is in the
session's notes (2026-11-18); this is what landed. Nothing is committed yet.

**What changed on the Studio**
- **The doors are one street with three doors.** The workshop's façade in one
  frame: a navy cornice with the name and the coordinates, three bays on one
  pavement (the shop by day with Yasser, the arched door at night with Kūro,
  the lit window of the manual with Kūro over the laptop), one red button.
  The heading is now a question: "Trois portes. Laquelle est la vôtre ?"; the
  premise is the line beside it.
- **The contact is the open door at night**: Yasser in the frame holds the
  board, Kūro on the step; "SALUT." is written on the board by the page, so
  it is translated. The three stickers are gone.
- **The footer has the town at night** over the colophon, with one lit
  window (the workshop) that lights once. The colophon's five-column bug on
  wide screens (one word per line) is fixed.
- **"Votre logo n'est pas votre marque." shows the building in section**:
  the sign, the drawing room, the frame and machines, the foundations where
  Kūro keeps watch; the four layers are its bands.
- **Kūro's window** sits beside the questions (Studio and home, wide
  screens only); the founder plate's heading moved into its empty paper; the
  lessons each get a framed drawing; Kūro now stands beside LE BUILDER; the
  Heetch cover and the stat tiles are no longer cut on a phone.
- **The reel**: three posters re-taken, the console clip cropped to its
  content, the opening re-recorded from today's intro (its line now says
  "2,7 s · à chaque visite").

**What changed on the home and its pages**: the founder's painted night
plate (the photo slot stays for your real photograph), five small drawings
for the services on wide screens, the 404's road at night, Kūro's window by
the FAQ, better crops of the hero plate and the atelier scene on phones; the
price guide's ranges on a receipt with a "Prix publié" seal and a panel
for the Studio's console; a "Livré" seal on the live project sheets.

**The brand books and the bible**: the post grids are thumbnails on a
tablet (a tap opens the post), cards in swipe rows keep their own height,
the Numidea cast stands on its floor, the Traveler wall and the bible's
"Head to toe" fill whole rows.

**Transitions.** Page changes are the page lift (the old paper wipes are
gone). New: the bar stays put through it; a viewer grows out of the
picture you pressed and shrinks back into it; the case pictures of Bordj
Steel and AlmaFlow fly from the home into their sheet; pictures unroll; the
seals stamp; lessons slide in from their side; the books' posts are pasted
up one by one. All of it on the site's beat, nothing loops, nothing moves
with reduced motion.

**The art made for it, and its credits.** Ten scenes, painted in the site's
style with Yasser and Kūro inside them (not cut-outs pasted on): B01-B03 the
three doors, B04 the contact door, B05 the town at night, B06 the 404 road,
B07 the home founder, B08 the building in section, B09 the five service
drawings, B10 Kūro's window. Every take was looked at before it was cut;
off-model takes were rejected and are listed with the files in the session's
art folder. Spent: B01 355, B02 225, B03 355, B04 150, B05 205, B06 80,
B07 130, B08 195, B09 305, B10 65, **2,065 credits in all** (the plan's hard
stop was 2,000; the overrun is B09's sheet, which cost 205 instead of 145).
No licence is chosen for these yet, like the rest of the art.

**Decisions taken in the pass**
- **H1 is dropped.** The plan proposed taking "Claude" off the home's
  automation pill and the c5 brief; your decision 27 keeps that name, so
  neither was touched.
- The doors are painted with the characters inside; the plan's hover face
  swap is dropped (there is no second frame), the lit doormat, glow and arrow
  carry the hover.
- The board at the contact and the 404 plaque are blank in the paintings;
  the words are the page's.
- The town strip is painted without Kūro, so he is never shown twice (the
  sleeping picture sits on the sill on the Studio and the world's page; on
  the manual the living Kūro takes the sill and looks up when the window
  lights).
- The tablet grids of the brand books are thumbnails, not full posts: full
  posts three across at 768 px broke the type (16 new visual faults). The
  bible's duo card takes its card's full width instead of spanning two.
- The skyline is not on the price guide (it does not fit its themes).
- The home's frames use the theme's own pale colour, not a true cream: the
  themes' contract allows no new colour. Two optional colours
  (`--frame-edge`, `--voice-text`) could be added if you want the cream.
- The published-size ceiling (`scripts/check.mjs`) is raised to
  42,428,949 bytes (+1,098,338): the ten scenes, the reel's re-takes and the
  code, less the three stickers and the old 404 dunes.

**What only you can do**
- **Record the "passage" clip again.** It still shows the old two doors and
  the paper wipe. A clean recording of a Studio-to-bible page change with the
  new street at the top needs a real screen recorder (the automatic capture
  drops the lift to one frame): about 2.8 s at 1280x720, then
  `npm run motion:add -- <file> wipe2 "Le passage" "La page se soulève, la suivante est dessous" 2.5`,
  swap the ids in `hub/src/reel.json` and delete the old `wipe.mp4` and
  `wipe.webp`. English: "The page lifts; the next is underneath". The
  characters' clip ("Les personnages", §36) is still on the list too.
- **The contact door's façade colour.** The open door is set in dark navy
  stone, not the cream plaster of the three doors. It reads as night, but it
  is not the same building. Say if you want it painted again in the plaster
  (about 75 credits).
- **The Arabic** of this pass is listed in §8 (AR: native review).
- Two small questions: should the red button's hard shadow be mirrored in
  Arabic (it falls to the right in both directions now)? The Studio
  founder's floor label is an ink label, not brass (brass is kept for
  places, and brass text on cream is too faint): say if you prefer brass.
- `yasser-coffee.webp` and `yasser-facepalm.webp` in `assets/illus/` are no
  longer shown by the home or the 404: keep them or have them deleted.
- E20 (the Bordj Steel references capture with its grey band) needs a new
  capture of the live site.

## 38. The two client courses: "Le logo vient après" and "Le web3, sans fumée" (2026-11-19)

The manual (`hub/manuel.html`) now carries two courses for clients, after the
money lessons: **#marque** "Le logo vient après" (nine stops) and **#web3**
"Le web3, sans fumée" (eight stops). Each ends in a brief (the fiche): the
visitor's answers fill a one-page brief set as the Studio's receipt, with an
estimate from the calculator's own prices, and it leaves only when the
visitor presses: WhatsApp, the home page's contact form (carried as the
price guide's estimate is), copy, or print. Answers stay on the device. The
money set drops "Web3 101" (L6), which grew into the web3 course: the manual
now counts 38 lessons (5 + 9 + 8 + 8 + 8). The Studio links in from the third
door ("Avant d'acheter : la marque · le web3"), the brand section (a button)
and the MARK service card.

**Your answers of 2026-11-18, as published**
- **Course B is published on your decision of 2026-11-18, without a
  lawyer's review** (W4, law 25-10). You take the legal responsibility, as for
  the coaching. `money.note1` and `money.note2` are printed by key under the
  plate, in the payment panel, on the Algeria card and on the brief.
- **What the studio builds in web3 (W1): the ordinary routes only.** The
  course says, on step 3 and on every brief that carries a route: « Nous ne
  construisons pas la partie chaîne (contrats, jetons, portefeuilles) ; nous
  construisons la solution ordinaire, et nous vous aidons à décider. » A brief
  whose six questions end in "maybe" prints no price; the 1:1 call is not
  offered for web3 (W3).
- **Ownership of an identity (B1): sources + written rights.** Step 6 (the
  rights row) and step 8 say: once paid, the vector sources and a written
  assignment of the rights naming use, place and duration; the studio keeps
  the right to show the work; fonts and photos follow their own licence.
- **Package and rounds (B2/B3): base + kit, three rounds.** The base identity
  is the logo (full, compact, one ink: O2), colours, type and tone of voice;
  the "Kit graphique complet" adds the guidelines, reusable components, the
  animated social kit and the campaign master (O3). Two first routes, then
  three rounds of changes per stage. The kit toggle is shown on step 9, with
  its contents under it; its price is the calculator's `ds` option.
- Everything else is the spec's safe default (B4-B14, W2, W5-W7, X1-X4): no
  VARA disclaimer is published (W7); the form subject stays "Estimation" (X4).

**What I could not do, or did differently**
- **Two tab pictures (3b, 4b) were not drawn.** Steps 5 (16 pixels) and 4
  (chain and base) use crops of the two course scenes instead
  (`brandc/bk-9.webp`: Kūro's paw on the red stamp; `web3c/wk-8.webp`: the
  three cubes beside the cardboard boxes). Say if you want them drawn.
- **The A4 reward** (`brandc/fiche-kuro.webp`): the generated "NUMIDEA LABS"
  lettering and the generated seal were painted out with the paper's colour
  and replaced by the site's wordmark (the Cinzel paths of
  `scripts/lib/wordmark.mjs`) and a true 印 from the Studio's own Japanese
  face. No drawn letters remain.
- **The send cap.** WhatsApp and the form's mail both travel as URLs, so the
  text is capped at 6 000 encoded characters; a fully filled Arabic brief
  loses its last rows in the text (the printed brief stays whole). It was not
  tried on a real phone: please send one Arabic brief to yourself.
- The vague words of step 3 differ in number per language, so the
  dictionaries hold them as one string split by `|`.
- The published-size ceiling in `scripts/check.mjs` is not raised here (the
  integrator does it): the two courses add about 1.7 MB (two scenes and their
  -800 twins, 16 tab pictures, the reward, the wallpaper and the road, the
  manual's markup and three dictionaries).
- The Arabic is listed in §8.

## 39. La fabrique: your "Outside the Artboard" as a Studio page (2026-11-19)

`hub/fabrique.html`, "Hors du plan de travail.", built from your upload and the
spec ATELIER.md. Four scenes (brand identity, design systems, campaign artwork,
motion identity), each a framed plate with the studio's own visual and one of
your characters, your line for that character, then a breakdown: why, what you
get (your words), the published service line it maps to, the published price
(from the calculator, never typed) and a button that opens the console on that
type. Then "Apprendre en fabriquant": the brand track links to the manual's
course; the application's six lessons ("Le chantier", with the booking lab) and
the web3 engineering track's six ("La chaîne locale", with the receipt lab) are
on the page.

**Decisions taken by default (your answers of 2026-11-18, "Defaults taken"; you may overrule)**
- P1: Adobe Illustrator, Figma, Adobe Photoshop on iPad and Adobe After Effects
  are printed as small labels on the four plates, as your own statement of the
  tools you use. Nothing else names a tool, except the references (Figma's own
  help page is source [1] of scene 02).
- P2: each scene prints your "what you get" as written, then the published line
  and its price. Scene 03 (the campaign) has no published price: "Pas de prix
  publié à part : cela se chiffre au cadrage", and its button opens the contact.
  Scene 02 prints the "Kit graphique complet" option's price (+ 60 000 – 140 000
  DA) as an option of the identity.
- P4: the traveller Yasser and the crouching Kūro are used as drawn, on la
  fabrique only; Kūro's plate is cream so his fur reads. P5: Ratman and Techno
  Pigeon appear only as speakers, in Latin letters, no codex entry. P6: Kūro's
  line is yours, translated faithfully.
- P7: the web3 engineering track is published as education (all six of the
  upload's lessons, including contracts and tests, events and indexing), under
  your line "Nous ne construisons pas la partie chaîne (contrats, jetons,
  portefeuilles) ; nous construisons la solution ordinaire, et nous vous aidons
  à décider." and `money.note1` / `money.note2`. Its facts name ethereum.org;
  what is not cited is labelled the workshop's method. Its all-done line leads
  to the manual's web3 course, not to a price.
- P8: the twelve tabs have no pictures (text only). P9: no new seal glyph.
- The four documentation screenshots of the upload (Illustrator, Figma,
  Photoshop, After Effects) are not used anywhere: the plates show the studio's
  own wordmark and favicon (with a 16-to-104-pixel slider), the Studio's own
  service card in three languages, the sting still with four crop windows, and
  this site's entrance curve over the reel's opening.

**Art.** `hub/img/studio/atelier/`: five cut-outs from your PNGs (01, 03, 05, 07,
08; halo cleaned, never upscaled) and two cuts of the Studio's own sting still.
298 736 bytes. `scripts/check.mjs` TOTAL raised by 831 752 bytes for the page
(the courses' own 1.7 MB are still outside it, see §38).

**Arabic.** Every Arabic string of the page (357 under `fab`, 146 written in this
pass) awaits a native reader.



## 40. Your own artworks, placed (2026-11-19)

The art director's picks from your folders (ten pieces, nineteen files in
`hub/img`, 2 332 646 bytes; `scripts/check.mjs` TOTAL raised by 2 350 646 with
their markup and alt text) are on the site:

- **The world page (`hub/monde.html`).** MERCURY's poster strip gains two
  reference sheets under the five posters, `06 · RAVEN · REFERENCE` and
  `07 · RAT · REFERENCE`, opening full size in the viewer with the posters.
  "Trois couches, un seul atelier." gains a framed strip of the crew on the
  ledge (a crop of your "HOME" poster with none of its drawn text). The Lab
  wall gains six tiles after A07: A08 (the cartographer), Y06 (Yasser, model
  02, shown as a study; the bible's `rig-y-base` stays canon), P21 (last
  transmission), P22 (the listener), P23 and P24 (the two halo screenprints).
  Each opens its large file in the viewer, as the set "lab".
- **La fabrique (`hub/fabrique.html`).** The web3 track card shows the techno
  pigeon standing (`atelier/pigeon-stand.webp`, cut out); scene 04 keeps the
  flying pigeon.

**Your question to answer: which rat is canon?** The grey rat of MERCURY (your
sheet SytXzOiUb8, the act-2 poster's rat in the satchel, now on the world page)
or the tan Ratman on la fabrique (`atelier/ratman-tag.webp`, the full-stack
card)? Nothing is decided: the two never appear on the same page, and the
world page's caption says "RAT", not "Ratman", until you answer.

**Arabic.** The ten new alt texts and the strip's new label are written in
Arabic and await a native reader.

## 41. The three pieces together: the courses, la fabrique and your artworks (2026-11-19)

The three passes of 2026-11-19 (§38 to §40) are one change set. In short, what
is now on the site and what was decided for you:

- **The two client courses (manual, §38).** "Le logo vient après" (`#marque`,
  nine stops) and "Le web3, sans fumée" (`#web3`, eight stops), each ending in
  a brief priced by the calculator itself. Your answers of 2026-11-18 are
  applied: **web3 is published on your decision of 2026-11-18, without a
  lawyer's review** (W4, law 25-10; `money.note1` and `money.note2` stay on
  every crypto screen); the studio builds the ordinary routes only and says it
  in your sentence (W1), a "maybe chain" brief prints no price and the 1:1
  call is not offered for web3 (W3); an identity is handed over as vector
  sources with a written assignment of the rights (B1); base identity plus the
  "Kit graphique complet", two first routes and three rounds per stage (B2/B3).
- **La fabrique (`hub/fabrique.html`, §39).** Four scenes from your "Outside
  the Artboard", each with what it delivers at the published price, and two
  six-lesson sets ("Le chantier" and "La chaîne locale", the web3 engineering
  track published as education). The defaults taken for you (O1 to O5, P1 to
  P9) are listed in §39 and your answers file; you may overrule any of them.
- **Your artworks (§40).** Nineteen files placed on the world page (MERCURY's
  two reference sheets, the crew strip, six new Lab tiles) and the standing
  pigeon on la fabrique.

**Your questions still open**
- **Which rat is canon** (§40): MERCURY's grey rat or the tan Ratman. Until you
  answer they never share a page and the world page says "RAT".
- **The courses' other questions were left at the spec's safe defaults**
  (B4 to B14, W2, W5 to W7, X1 to X4): among them, no VARA disclaimer is
  published (W7) and the form subject stays "Estimation" (X4). Say if any
  should change.
- The two course tab pictures that were not drawn (3b, 4b, §38) and the twelve
  text-only tabs of la fabrique (P8, IMPROVEMENTS A14).
- The Arabic of all three passes (§8): none of it has been read by a native
  speaker.
- A fully filled Arabic brief loses its last rows in the sent text (the 6 000
  character cap, §38): please send one to yourself from a phone.

**Changed on integration**
- La fabrique's French search title was 79 characters, over the validator's 70:
  it is now « Identité, design system, campagne, motion : la méthode | Numidea
  Labs » (English and Arabic unchanged). Its scenes section is named by its own
  label (« Les scènes »), not by the page heading, and the crop scene's caption
  is the figure's last element (shown in the same place).
- In Arabic, the reel's tempo numbers sat on the pigeon (contrast 3.4:1); they
  move to the other side. On a 280-pixel phone the Studio's contact label wrapped
  over the board's word « salut. »; it stays on one line.
- On a phone, la fabrique's lesson tabs (text only) cut a word in two
  (« الصلاحيات » at 390 pixels, « Confiance » at 280): the title now takes the
  tab's whole width, and under 360 pixels the six tabs sit in two columns.
- The audit no longer fails a French or English page for loading the Arabic
  face when the page shows real Arabic copy (la fabrique's MARK card in three
  languages); a stray Arabic glyph still fails it.
- `scripts/check.mjs` TOTAL raised to the measured published set, for the
  courses' art and markup (which §38 left outside it), la fabrique and the
  artworks.

## 42. The courses after the critique, and the web3 course in nine modules (2026-11-21)

Two passes on the manual's client courses (§38), integrated together. Nothing
is committed or deployed yet; the cache-bust stamp waits for `npm run bump`.

**The critique, and what changed.** A critique of the two courses found that
the web3 course's verdict did not carry forward, that the brand brief printed
the exercise's own sentences back, that some answers needed to set a price were
never asked, and that the opening of each stop explained before it posed a
problem. What changed:
- **The web3 verdict carries forward.** A new decision row (« Je prends la
  route ordinaire / J'en parle d'abord avec vous / Je garde l'idée de chaîne
  (ou de paiement en crypto) ») folds the chain material on an ordinary route
  (it stays published); keys and « si le jeton valait zéro » are asked only
  for a chain kept, and chain rows print only then.
- **The brand brief asks in writing.** « À clarifier avant de signer » became
  « Ce que je demanderai par écrit »: one request per real gap the visitor
  flagged, never the exercise's sentence.
- **The questions a price needs:** keep / refresh / redo the current logo; the
  visitor's own logo in the 16-pixel test (read on the device, never sent);
  scripts on the sign (Arabic, Latin, Tifinagh); two brands liked and why; an
  optional ceiling; what comes first; who looks after it after delivery; an
  optional first name. With an existing site, the route reads « à chiffrer au
  cadrage, pas de prix publié »: no new price was added. For a card payment,
  six questions labelled as our list (currency, usual amount, deposit or full,
  refund rule, where the customer pays, who receives).
- **Euros and dollars on both briefs** (your Q1: yes), from the calculator's
  own rates, under every DZD total.
- **Two invented cases tell the story:** Pâtisserie Hodna (Nadia) in the brand
  course and Samia's gym in the web3 course, each in a closed block labelled
  « exemple inventé » on every stop, with a finished case brief. Their pictures
  are the two case cards below.
- **Less friction:** a next-stop button after each stamp, a phone bar with the
  position and the brief's count, right answers at varied places with one
  explanation per wrong answer, typed fields kept when the page closes, and the
  last stop reopens with « Vous étiez à l'étape n ».
- Your legal lines stay where they were: `money.note1`, `money.note2` and the
  law 25-10 line, by key, on every crypto screen and on the brief.

**The web3 course in nine modules, on your decision of 2026-11-21.** You chose
to expand the course with your nine-module curriculum, each topic « short
explanation + one diagram or small interactive + one check question ». As
published:
- **Two ways in**, under the plate: « J'ai un projet à préparer » keeps the
  eight-step buyer path and its brief; « Je veux comprendre le web3 » opens the
  modules. The choice writes nothing into the brief. With no choice, the page
  opens on the buyer path as before.
- **Nine modules, 33 stops:** 1 « Fondations : d'où vient le web3 », 2 « Sous
  le capot d'une chaîne », 3 « Portefeuilles, clés et identité », 4 « Jetons,
  normes et règles d'émission », 5 « Smart contracts et développement »,
  6 « Applications et infrastructure », 7 « La DeFi, expliquée », 8 « DAO et
  gouvernance », 9 « Sécurité, audits et ponts entre chaînes ». Each stop: a short explanation,
  one hands-on diagram (a « lab »), the common misconception and what is true,
  its sources, the brief one press away, and one question. A sommaire with a
  picture per module, and a carnet of nine seals that ink as modules are done
  (on this device only).
- **The lab rule.** A lab runs in the page and sends nothing: no network
  call, no real chain, no real wallet, no key that leaves memory, nothing
  written into the brief. Its numbers are worked out in the browser or carry
  their source; where the real thing cannot run in a browser (the curves these
  chains use), the lab says so. No lab invites anyone to buy, swap, lend or
  stake; the ones that show money mechanics carry « Ce schéma montre un
  mécanisme, pas une offre ni un rendement ». Without scripts each lab shows a
  still state with the same numbers. Nothing moves on its own; with reduced
  motion nothing moves at all.
- **Questions for the provider.** Each module ends with a bridge to the buyer
  step it explains and two question chips; ticked, they print in the brief as
  « Mes questions pour le prestataire ».
- The manual now counts 71 lessons (it said 38).

**The names policy.** Education only: no coin, token, exchange, wallet or
provider is recommended, and none is named as something to use. A project,
chain, tool or library is named only in the stops where the curriculum needs it,
introduced as an example taken from its own documentation (« par exemple »,
« selon sa documentation »), and under the line « Les outils et les chaînes
cités sont des exemples tirés de leur propre documentation, pas des
recommandations ». The table of which name may appear in which stop is the
course's names law, and some names are never printed anywhere in the course:
among them staking and lending services, stablecoin issuers, layer-2 networks,
and every wallet and exchange brand. The buyer path's new lines and the brief's
questions name no project. It was checked on the built French page and, key by
key, on the English and Arabic translations.

**Magnific credits spent: 715.** Eleven generations (Nano Banana 2.1, 2k,
65 credits each): the nine module headers, one rejected take of module 9 (four
sieves where the lesson says five), and the two case cards in one picture. Cap
900; balance 2,522 → 1,807. Every picture was retouched locally to remove
letter-like marks (no credits). The carnet's reward drawing (Kūro stamping the
last seal) was not made: 75 credits were budgeted for it.

**Your questions still open**
- **Q2: what one « support » delivers**, **Q3: a published floor for payment
  on an existing site**, **Q6: a maintenance offer from the studio**. Until you
  answer, the briefs ask and print no figure for them.
- **Q4: may the courses follow Nadia and Samia?** They are published as
  invented examples, labelled as such on every stop and in the pictures' alt
  text. Say if you want them removed.
- **The carnet reward picture** (above): make it, or keep the carnet without
  a downloadable drawing (today: nine of nine shows a line and a print button).
- **The manual's size.** The modules bring the manual to about 10,700 HTML
  tags (2.9 times the committed page; the specification's gate was 1.6 times)
  and about 1.08 MB (211 kB compressed). The specification's fallback is to
  move the nine modules to their own page (`hub/web3.html`, X6): say if you
  want it. Until then the plate, the two ways in and the sommaire put the buyer
  path's first stop about two and a half screens down on a phone.
- **Art details to confirm:** the cuff pattern on Yasser's coat can read as
  « H: » at full size (kept to match the published scene); the brass pipe nuts
  in module 7's header are nuts, not coins; Kūro looks away from the rope in
  module 9's header (the alt says so).
- **The new seal kanji** of the carnet render in the system's fallback
  Japanese face: the Studio's Noto Sans JP subset was not re-cut.
- **The Arabic** (§8): none of it has been read by a native speaker.

**Changed on integration**
- The art is placed with its width and height (`srcset` by file width) and its
  alt text in three languages.
- About 1,470 French-only strings of the nine modules and the shell, and the
  four keys whose French had changed, were translated into English and Arabic;
  the three dictionaries hold the same keys (3,933 each).
- A templated line of a lab (« Bloc 10 · frais de base … », « Mois écoulés … »)
  was written once in French when the page was generated; it is now written
  again in the page's language when the labs load, with English and Arabic
  number formats; module 8's legal lab and module 6's block-tag line likewise.
- The bridges and misconception cards were HTML landmarks without a unique
  name (42 validator errors): they are plain blocks now.
- Opened at a module's address (`#web3-m1`), the page swapped chapters and
  scrolled in the same frame, which read as a layout shift of the whole screen
  (CLS 1.0 in the audit): the scroll now waits one frame more.
- Two gates learned the course's new shapes: the audit no longer counts a
  module's header picture inside a chapter not shown as a reveal that never
  fired, and the layout scanner treats the course's dock (« Ma fiche → »,
  stuck to the bottom of the course) as a floating layer, as it does the fixed
  ones.
- `scripts/check.mjs` TOTAL raised to the measured published set,
  51,651,557 bytes (+4,214,942), for both passes' art, markup and dictionaries.

## 43. « La carte »: the services catalogue, at the prices you approved (2026-11-21)

The Studio's reel is gone from `#services`: in its place, under the four families, « La carte » lists 18 services in
five families (Marque, Web & écrans, Réseaux & motion, Print & objets, Pitch & conseil), each with what you get, the
lead time, the price, a mockup made from the studio's real work, and what the same work costs elsewhere (eleven
numbered sources, all read on 2026-11-21). The reel's six clips moved to la fabrique, scene 04 (`fabrique.html#mouvement`);
nothing was deleted, and old links to `#motion` and `#reel` land on the motion card.

**Prices approved by you on 2026-11-21** (they live in `assets/app.js`, `DESIGN`, beside the estimator's model; the
page is written from there, nothing is typed in the markup):

| Card | Figures (DA) | Lead time |
|---|---|---|
| A1 Logo | Essentiel 45 000 · ★ Signature 70 000 | 1–2 weeks |
| A3 Charte (aussi) | set of 12 SVG icons 30 000 | — |
| A4 Mascotte & illustration | illustration 12 000 · ★ mascot 55 000 | 1–3 weeks |
| B1 Landing page | ★ 35 000 · + 8 000 / screen | 1 week |
| B2 Site · 5 écrans | ★ **67 000** (the model's own sum, 35 000 + 4 × 8 000) · + 8 000 / screen | 1–2 weeks |
| B3 App & tableau de bord | ★ 120 000 · + 12 000 / screen | 2–3 weeks |
| C1 Kit réseaux sociaux | 40 000 · ★ animated 65 000 · 30 000 / month | 1–2 weeks |
| C2 Créas publicitaires | ★ 12 000 – 25 000 · + 8 000 – 15 000 / concept | 3–5 days |
| C4 Modèle d'e-mail | ★ 30 000 – 60 000 · + 10 000 – 20 000 / layout | 1 week |
| D1 Packaging & étiquettes | ★ 1 product 45 000 · range of 3 75 000 · + 15 000 / product | 1–3 weeks |
| D2 Print & papeterie | card 8 000 · flyer 12 000 · ★ pack 30 000 · menu 20 000 · brochure 28 000 | 3–5 days |
| D3 Stickers & merch | ★ sheet of 6 25 000 · t-shirt or tote 12 000 – 30 000 | 1 week |
| E1 Pitch deck | 4 000 / slide · ★ 12 slides 48 000 · + master 75 000 | 1–2 weeks |
| E2 Infographie | ★ 15 000 – 35 000 | 1 week |
| E3 Audit UX | express 25 000 · ★ journey 60 000 | 1 week |
| E4 L'atelier au mois | ★ 65 000 / month · quarter 180 000 | per request (below) |
| Bundle « Lancement de marque » | from 190 000 (190 000 – 360 000) | — |
| Bundle « Lancement produit » | 185 000 | — |

A2 Identité, A3 Charte and C3 Motion read the estimator's own figures (identité, option `ds`, motion, option `anim`),
and « On le construit aussi » the start prices of vitrine, sur mesure and boutique. No « brouillon » tag is printed.

**Defaults taken where you did not answer (each reversible, say the word):**
- Q3: the line « Remboursé sur le développement s'il est commandé sous 60 jours » stays on B1–B3 and E3.
- Q4/Q12: the monthly plan does not print « 1er jet en 48 h »; it prints « un délai par demande, convenu au cadrage ».
- Q2: the charte alone (A3) is asked for on WhatsApp, not in the console.
- Q5: print and packaging are FR/AR by default, as on the D1 label.
- Q9: Bordj Steel stays on A1 until you say Amanatkom is a client.
- Q10: the old reel clips are in la fabrique, scene 04.
- Q11: the infographic stays at 15 000 – 35 000.
- Q13: no Kūro turnaround is drawn; A4 shows Yasser's four poses with Kūro beside.

The Arabic of la carte (hub/src/carte.i18n.json) waits for your native review, like every Arabic string.

## 44. La Librairie Lanterne: the learning side as a night bookshop (2026-11-21)

The manual (`hub/manuel.html`) became **La Librairie Lanterne** / The Lantern Bookshop / « مكتبة الفانوس »
(`hub/lanterne/`), built from the specification you approved. Each course is a book on the shelf, and each book an
atlas you play district by district: a diorama, a short dossier with a situation and three answers, a field exercise,
a journal note and a keepsake. Progress stays in the visitor's browser; nothing leaves the page. Nothing is committed
or deployed yet; the cache-bust stamp waits for `npm run bump`.

**Your answers of 2026-11-21: « go with the defaults » (L1–L13), and what was done with each.**
- L1: the Arabic name is « مكتبة الفانوس » (in the native-review list below).
- L2: the address is `/hub/lanterne/`; `hub/manuel.html` is now a forwarding page (no index, kept at least twelve
  months). Every old address was tested: `#radio`, `#game` (now the night round), `#services` (now the counter),
  `#lessons` and `?ls=pay…crypto`, `#nomade` and `?ls=n1…n8`, `#jeu` and `?ls=g1…g8`, the source anchors and `?lang=`,
  with and without script.
- L3: la fabrique keeps its lesson sets and capstone; the capstone now links to « Le cours du soir », and both pages
  link to each other.
- L4: the guide is named Ratman; the tan Ratman cut-out stays where you placed it in « Le cours du soir ».
- L5: the money and road books follow Selma, an illustrator in Bordj Bou Arréridj, and « Le jeu juste » the
  Lantern's own loyalty card; both are labelled « exemple inventé », and every number comes from the courses' own
  questions or calculator defaults.
- L6: your plates are shown at most at their natural size (607 px wide), never enlarged. Send originals of at least
  1 214 px to sharpen them on large screens.
- L7: keepsakes as specified (the drawn objects and the poster miniatures), renamable later.
- L8: the traveller Yasser cut-out appears only in « Le cours du soir » and « Le carnet de route ».
- L9: **the web3 course's second volume (the nine modules) is held for a later release.** The shelf shows it
  « bientôt », with no link. Its chapters, lab script, strings and module headers moved, untouched, to
  `lanterne-later/web3-modules/` (not published); nothing was deleted. What §42 says about the nine modules applies
  when that volume is published.
- L10: the money book has no reward of its own; its keepsakes count in the shared passport.
- L11: Kūro's page life (the seven seals) runs on the shelf only.
- L12: BRAND.md now says your own drawing style also lives on the Librairie.
- L13: your Field Atlas compositions are kept as built (the doubles included), behind one switch in
  `hub/src/lanterne/atlases/cours-du-soir.json` (`asDrawn`).

**What is on the shelf in this state.** « Le cours du soir » (your Field Atlas, ten districts), « Gagner sa vie de
loin » (five), « Le carnet de route » (eight) and « Le jeu juste » (eight levels, with its pixel level icons in the
list) are built and played end to end (French and Arabic; English checked page by page). **The two client courses, « Le logo vient
après » (marque) and « Le web3, sans fumée » (volume 1), are not yet atlases**: their books read « bientôt », and old
links to `#marque`, `#web3`, `?ls=b…` and `?ls=w…` land on the shelf. Those two courses were published on the
manual before; until their atlases exist, they are not on the site. Their art is ready (four act plates and their
small files in `hub/img/lanterne/plates/`, the courses' own pictures in `hub/img/studio/brandc` and `web3c`) and is
listed, not refused, by the build while the books wait. **Decide before publishing:** wait for the two atlases, or
publish without them for a time.

**The critique fixes (§42).** The fixes to the brand and web3 courses (the verdict that carries forward, the brief's
written requests, the case blocks, the card-payment path) are in `hub/src/manuel.html`, the source the two atlases
will be cut from; they reach the site with those atlases. A second review of 44 points was made on the old manual;
the points about the phone layout of the course bar, the stop pictures on phones and the page weight are answered by
the atlas layout; the points about the nine modules wait with volume 2; the points about the brand and web3 buyer
path (for example, the brief's hand-off opening with two greetings) wait for the two atlases.

**New art for the Librairie, made with Magnific** (folder « numidea labs / Site art 2026-11 Librairie Lanterne »):
thirteen act plates in your screenprint family (no lettering, no people or animals, so your cut-outs can stand on
them) and the shelf's night key art, « lanterne-nuit » (Yasser reading by the stall, Kūro asleep on the counter, on
model with the character bible). Each was checked at full size; on the key art, a stray white mark on Yasser's sleeve
patch that read as a « 2 » was painted out. **Magnific credits spent: 985** (13 × 65 + 75, plus one retake of the
brand book's second plate); about 637 left on the account. The plates are cut, never enlarged.

**La carte, corrected while checking the whole site.** On a phone the Studio page used to slide down to la carte as it
opened; it now opens at the top. The market sources under la carte are numbered 1 to 11, so the small numbers on the
cards point at a visible line. In Arabic la carte's small lines are one size larger, and on phones its small links are
full-size targets. No price or word changed.

**Open for you:**
- the two client atlases (above), and when to publish;
- your plates' originals at 1 214 px or more (L6);
- four keepsake objects you may want to draw yourself (a pass, a seal, a key, a lens; L7);
- the dioramas of the money, road and game books stand your cut-out objects (cup, feather, ring, paper…) as props;
  the specification asked for each stop's own tab drawing there, but those drawings are square pictures that would
  read as boxes on a plate, so they are the keepsakes instead. Say if you prefer them on the plates;
- the Arabic of the whole Librairie, in §8 below the 2026-11-21 lists.
