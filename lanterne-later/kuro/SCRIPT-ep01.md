# Le dernier départ / The Last Run / الرحلة الأخيرة

Generated from `ep01-dernier-depart.json`. Edit the JSON, not this file.

Reward: +100 Encre (first finish only), world flags {'kuro_in_bag': True}.

## Opening

Pose `shrug`, face `deadpan`, mark `?`

  - **FR** Le scooter est prêt. Le colis est emballé. Et Kūro a disparu. Il ne rate jamais un départ… alors il est forcément dans l'atelier.
  - **EN** The scooter's ready. The parcel's packed. And Kūro has vanished. He never misses a run… so he has to be somewhere in the studio.
  - **AR** السكوتر جاهز. الطرد مغلَّف. وكورو اختفى. لا يفوّت أي رحلة أبداً… إذن هو حتماً في مكان ما داخل الورشة.

## Hotspots and actions

Conditions: *when* = flags needed, *unless* = flags that hide the action. Wrong turns are marked ✗.

### Le laptop fermé · The closed laptop · الحاسوب المغلق  (`laptop`, art `laptop-closed`)

**Toucher le capot** / Touch the lid / المس الغطاء  
always. face `focus`, mark `!`. sets warm; lesson last-known

  - **FR** Encore tiède. Il dormait dessus il y a cinq minutes. Et il y a des poils noirs sur le bureau… qui partent vers la sacoche.
  - **EN** Still warm. He was asleep on it five minutes ago. And there's black fur on the desk… leading toward the bag.
  - **AR** ما زال دافئاً. كان نائماً عليه قبل خمس دقائق. وهناك شعر أسود على المكتب… يتّجه نحو الحقيبة.

**✗ L'ouvrir pour chercher** / Open it and search / افتحه وابحث  
always. face `sideeye`, mark `✱`. 

  - **FR** Il n'est pas dans le laptop. Il dort *dessus*, nuance. Touche plutôt le capot.
  - **EN** He's not *in* the laptop. He sleeps *on* it. Try touching the lid.
  - **AR** ليس داخل الحاسوب. إنه ينام *فوقه*، هناك فرق. المس الغطاء بدلاً من ذلك.

### Le carnet de croquis · The sketchbook · دفتر الرسم  (`sketchbook`, art `sketchbook`)

**Lire la page cornée** / Read the dog-eared page / اقرأ الصفحة المطويّة  
always. face `think`, mark `?`. sets plan; lesson user-height

  - **FR** Page 12 : « Sacoche v2. Hublot découpé à hauteur de moustaches. Testé par l'utilisateur. » L'utilisateur, évidemment, c'est Kūro.
  - **EN** Page 12: “Bag v2. Porthole cut at whisker height. Tested by the user.” The user, of course, is Kūro.
  - **AR** الصفحة ١٢: «الحقيبة، النسخة الثانية. نافذة مستديرة بارتفاع الشوارب. جرّبها المستخدم». والمستخدم، طبعاً، هو كورو.

### Le colis emballé · The packed parcel · الطرد المغلَّف  (`parcel`, art `box-closed`)

**Vérifier l'étiquette** / Check the label / تحقّق من الملصق  
always. face `smirk`, mark `✦`. lesson check-before

  - **FR** Adresse, téléphone, scotch en H dessus et dessous. Tout a été vérifié *avant* de fermer. Et non, Kūro n'est pas dedans : il déteste le scotch.
  - **EN** Address, phone, H-taped top and bottom. All checked *before* it was sealed. And no, Kūro isn't inside: he hates tape.
  - **AR** العنوان، الهاتف، شريط لاصق على شكل H من الأعلى والأسفل. كل شيء فُحص *قبل* الإغلاق. ولا، كورو ليس بداخله: إنه يكره الشريط اللاصق.

**✗ Rouvrir le colis** / Open the parcel again / أعد فتح الطرد  
always. face `angry`, mark `✱✱`. lesson check-before

  - **FR** Stop ! Je viens de le sceller. Rouvrir un colis pour vérifier, c'est le refermer pour rien. On vérifie avant de fermer, pas après.
  - **EN** Stop! I just sealed that. Reopening a parcel to check it means sealing it twice. You check before you close, not after.
  - **AR** توقّف! لقد أغلقته للتوّ. فتح الطرد للتحقّق يعني إغلاقه مرّتين. نتحقّق قبل الإغلاق، لا بعده.

### La sacoche de livraison · The delivery bag · حقيبة التوصيل  (`bag`, art `satchel`)

**Examiner** / Look at it / تفحّصها  
unless plan/warm. face `think`, mark `…`. 

  - **FR** La sacoche du soir. Un peu plus lourde que d'habitude… d'environ quatre kilos. Bizarre.
  - **EN** The evening bag. A little heavier than usual… by about four kilos. Odd.
  - **AR** حقيبة المساء. أثقل قليلاً من المعتاد… بحوالي أربعة كيلوغرامات. غريب.

**La soulever** / Lift it / ارفعها  
when warm; unless plan/found. face `shocked`, mark `!`. 

  - **FR** Quatre kilos de trop, et ça ronronne. Il y a sûrement un moyen de voir dedans sans l'ouvrir… le carnet en parle peut-être.
  - **EN** Four kilos too heavy, and it's purring. There must be a way to see inside without opening it… maybe the sketchbook says.
  - **AR** أربعة كيلوغرامات زائدة، وهي تخرخر. لا بدّ من طريقة للنظر داخلها دون فتحها… ربما يذكرها دفتر الرسم.

**Regarder par le hublot** / Look through the porthole / انظر من النافذة المستديرة  
when plan; unless found. face `shocked`, kuro `judge`, mark `!!`. sets found

  - **FR** Le voilà. Installé en première classe, hublot inclus. Mais… sa queue est coincée dans la boucle du rabat.
  - **EN** There he is. Flying first class, porthole included. But… his tail is caught in the flap's buckle.
  - **AR** ها هو. يسافر في الدرجة الأولى، مع النافذة. لكن… ذيله عالق في إبزيم الغطاء.

**✗ Tirer doucement la queue** / Gently pull the tail / اسحب الذيل برفق  
when found; unless freed. face `angry`, kuro `hiss`, mark `✱✱`. 

  - **FR** Non, non, non ! Quand ça coince, on ne tire jamais. On desserre d'abord.
  - **EN** No, no, no! When something's stuck, you never pull. You loosen it first.
  - **AR** لا، لا، لا! عندما يعلق شيء، لا نسحب أبداً. نرخيه أولاً.

**Défaire la boucle** / Undo the buckle / افتح الإبزيم  
when found; unless freed. face `laugh`, kuro `love`, mark `♪`. sets freed; art → satchel-open; lesson loosen-first

  - **FR** Boucle ouverte, queue libérée, boucle refermée un cran plus lâche. Il ne bouge pas : c'est sa place.
  - **EN** Buckle open, tail free, buckle closed one notch looser. He's not moving: that's his seat.
  - **AR** فُتح الإبزيم، تحرّر الذيل، وأُغلق الإبزيم بدرجة أوسع. لا يتحرّك: هذا مقعده.

**Dire bonsoir à Kūro** / Say goodnight to Kūro / قل مساء الخير لكورو  
when freed. face `smirk`, kuro `love`, mark `♪`. 

  - **FR** Il cligne lentement des yeux. Chez les chats, c'est un merci.
  - **EN** He blinks slowly at you. In cat, that's a thank-you.
  - **AR** يرمش ببطء. في لغة القطط، هذا يعني شكراً.

### Le scooter · The scooter · السكوتر  (`scooter`, art `scooter`)

**Faire le tour** / Walk around it / تفقّده  
always. face `focus`, mark `…`. 

  - **FR** Plein fait, rétro réglé, casque sur la selle. Il ne manque que le passager.
  - **EN** Tank full, mirror set, helmet on the seat. Only the passenger is missing.
  - **AR** الخزّان ممتلئ، المرآة مضبوطة، الخوذة على المقعد. لا ينقص إلا الراكب.

### Yasser · Yasser · ياسر  (`yasser`, art `None`)

**Appeler Kūro** / Call Kūro / نادِ كورو  
unless found. pose `shrug`, face `deadpan`, mark `…`. 

  - **FR** « Kūro ! »… Rien. Quand il est bien installé quelque part, il ne répond jamais. Il faut le trouver, pas l'appeler.
  - **EN** “Kūro!”… Nothing. When he's comfortable somewhere, he never answers. You have to find him, not call him.
  - **AR** «كورو!»… لا شيء. عندما يرتاح في مكان ما، لا يجيب أبداً. يجب أن نجده، لا أن نناديه.

**✗ Lui donner les clés** / Hand him the keys / أعطه المفاتيح  
unless freed. pose `facepalm`, face `deadpan`, mark `…`. 

  - **FR** On part sans le chat ? Garde-les encore une minute.
  - **EN** We're leaving without the cat? Hold on to those a minute.
  - **AR** سنغادر من دون القطّ؟ احتفظ بها دقيقة أخرى.

**Lui donner les clés** / Hand him the keys / أعطه المفاتيح  
when freed. pose `handover`, face `laugh`, kuro `love`, mark `♪`. **ENDS the episode**

  - **FR** Colis, chat, clés. Dans cet ordre. Merci. Tu fermes l'atelier en partant ?
  - **EN** Parcel, cat, keys. In that order. Thanks. Lock up the studio on your way out?
  - **AR** الطرد، القطّ، المفاتيح. بهذا الترتيب. شكراً. هل تغلق الورشة وأنت خارج؟

## Lessons (the notebook)

**Débogage** (`last-known`)

  - **FR** Avant de fouiller partout, regarde où ça marchait en dernier. Le dernier état connu vaut dix suppositions.
  - **EN** Before you search everywhere, look where it last worked. The last known state beats ten guesses.
  - **AR** قبل أن تبحث في كل مكان، انظر أين كان يعمل آخر مرة. آخر حالة معروفة أفضل من عشر تخمينات.

**Design** (`user-height`)

  - **FR** On dessine à la hauteur du vrai utilisateur, pas à la sienne. Ici, c'était des moustaches.
  - **EN** Design at your real user's eye level, not your own. Here, that was whisker height.
  - **AR** صمّم على مستوى نظر المستخدم الحقيقي، لا على مستواك أنت. هنا، كان ذلك بارتفاع الشوارب.

**Livraison** (`check-before`)

  - **FR** On vérifie avant de fermer. Rouvrir un livrable coûte plus cher que de le vérifier.
  - **EN** Check before you close. Reopening a delivery costs more than checking it.
  - **AR** تحقّق قبل الإغلاق. إعادة فتح ما سُلِّم تكلّف أكثر من التحقّق منه.

**Réparation** (`loosen-first`)

  - **FR** Quand ça coince, on desserre avant de tirer. Un retour en arrière propre bat un passage en force.
  - **EN** When it's stuck, loosen before you pull. A clean step back beats forcing it.
  - **AR** عندما يعلق الأمر، أرخِه قبل أن تسحب. التراجع النظيف أفضل من الفرض بالقوة.

## Ending

Title: Départ réussi / Run complete / انطلاقة ناجحة

  - **FR** Le scooter s'éloigne. Dans le hublot, deux yeux ambre regardent la ville défiler.
  - **EN** The scooter pulls away. In the porthole, two amber eyes watch the city go by.
  - **AR** يبتعد السكوتر. ومن النافذة المستديرة، عينان كهرمانيّتان تراقبان المدينة وهي تمرّ.

Back in the hub:

  - **FR** De retour à l'atelier, Kūro dort désormais dans la sacoche, le nez au hublot.
  - **EN** Back at the studio, Kūro now sleeps in the bag, nose to the porthole.
  - **AR** في الورشة، صار كورو ينام في الحقيبة، وأنفه على النافذة المستديرة.

