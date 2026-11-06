# What only the owner can supply

The site leaves a place for each item below and shows nothing until the real
thing exists: no placeholders, no invented content. This file is not deployed.
Status as of 2026-11-06 (after the owner's answers of 2026-10-30, the fix
fleets of 2026-10-31 and of 2026-11-03, the hub rebuilt as your character
bible and the UX pass of 2026-11-06; sections 16 and 17 record those
answers, and the page now carries them; section 19 lists what the UX pass
left for you to decide).

| # | Item | Status | Where it goes |
|---|---|---|---|
| 1 | Legal notice + privacy details | **Missing (16 fields; 5 in three languages)**; "later" (owner, 2026-10-30): the pages stay unpublished, the slots stay empty | `scripts/legal-data.mjs` |
| 2 | Client quotes, with consent | None yet | `scripts/voices-data.mjs` |
| 3 | Founder photo | Still open: none yet (monogram "Y" shows, a 64 px mark since 2026-11-06) | `assets/founder.webp` |
| 4 | Team names and photos; the team-size claim | Answered 2026-10-30 and applied on 2026-11-03: one founder, with freelancers when a project calls for them (section 17). The page shows one team row, no initials and no photos | `index.html` #founder, `assets/i18n/*.js` (`team.*`) |
| 5 | A studio email on its own domain | Personal Gmail in use; it stays for now (owner, 2026-10-30) | everywhere one address appears |
| 6 | Clients' permission to appear in paid ads | Not asked yet | campaign kit (not in this repo) |
| 7 | Nomara Voyages: client or not? | Unconfirmed | `index.html` work grid, client logo strip |
| 8 | Arabic native review | Pending; every Arabic string added or changed on 2026-10-31, 2026-11-03 and 2026-11-06 is listed in section 8 and awaits it | `assets/i18n/ar.js`, `scripts/scene-data.mjs`, `scripts/build-og.mjs`, `404.html` |
| 9 | Clients' own domains | None verifies | `scripts/verify-domains.mjs` |
| 10 | Hub fan art | No fan art on the site since 2026-10-28 (still in git history). Not live: nothing has deployed since 2026-10-25, GitHub Actions being blocked on billing (RELEASE.md, "Outage and fallback") | git history of `hub/` |
| 11 | Supabase lead store | Off on purpose | `index.html`, `scripts/legal-data.mjs` |
| 12 | Campaign kit and git history | Kit with the owner | outside this repo |
| 13 | WorkspaceHQ: open source or not | Claim removed (no licence, no README) | `Brvetr4ve1er/workspace-HQ`, then `workspacehq/`, `scripts/scene-data.mjs` |
| 14 | Claims only the owner can confirm | 8 listed: 5 open (F11, the toolchain, now trimmed to what the builds use but still yours to confirm), 3 answered on 2026-10-30 and applied on 2026-11-03 | see section 14 |
| 15 | Hub: your character bible (you and Kūro) | Rebuilt on 2026-11-06 from your own design page; 6 points for your review (the character facts, the day's scenarios, your name's spelling, the "2 a.m." line, the coat's patch, Kūro); the earlier diary points closed with the diary | `hub/index.html`, `hub/app.js` (the rig's lines) |
| 16 | Commercial terms (payment, ownership, hosting, revisions, support, contract, the Aperçu rules) | On the page since 2026-11-03 as FAQ entries, drafted on your instruction of 2026-10-31; yours to change at any time | section 16; `faq3`, `faq7`, `faq8` in `assets/i18n/fr.js` |
| 17 | Team and contact facts | Answered 2026-10-30, on the page since 2026-11-03 | section 17 |
| 18 | The founder's name in Arabic script | Still open: the Arabic hero lede shows "Yasser Hamisse" in Latin script (isolated in a `<bdi>` since 2026-11-06) until you give the spelling | `assets/i18n/ar.js` (`hero.lede`) |
| 19 | The UX pass's questions | 16 asked on 2026-11-06 (IMPROVEMENTS decisions 28 to 43, the recommended option first), plus the sharper captures that need the live sites; nothing changes until you answer | section 19 |

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
Meanwhile the monogram is a 64 px mark (2026-11-06; it was up to 100 px with
a glow, and read as a missing avatar); `assets/styles.css` already places the
photo over it (`.fd-photo img`), so the slot needs only the file.

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
**Every Arabic string added or changed on 2026-10-31, 2026-11-03 and
2026-11-06 awaits native review** (the lists are at the end of this section,
"Written on 2026-10-31", "Written or changed on 2026-11-03" and "Written or
changed on 2026-11-06"); nothing Arabic written by the fix fleets has been
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

Files: the dictionaries `assets/i18n/ar.js` (the `ar` block carries a
banner; since 2026-10-31 the three languages are one file each, no longer in
`assets/app.js`), the `UI.ar` and project `ar` texts in
`scripts/scene-data.mjs`, `CARDS.ar` in `scripts/build-og.mjs`, and the
`lang="ar"` lines in `404.html`.

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
- **Themes** (decision 31): keep Arcanum (the default) and Daylight; Noir is
  a credible third now that its emphasis is red; Mono, Engineering and
  Alt-Neon read as recolours, or off-brand for a B2B studio. Removing one is
  one block in `assets/themes.css` plus the theme lists the gates keep in
  step. And (decision 32): should every theme set its headings in Cinzel,
  the wordmark's face, or should the grotesk themes keep theirs?
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
