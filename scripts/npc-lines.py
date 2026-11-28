#!/usr/bin/env python3
"""Writes the home NPC's dialogue tree into assets/cast/lines.json under each language's "npc" key.

Each line is [text, face, emote, kuro]:
  face  = a frame of yasser.webp (cast.js Y list),
  emote = ! ? dots sweat vein spark note zz heart or "",
  kuro  = a Kūro reaction (cast.js KR list) or "".
A node has q (its label when offered as a choice), l (its lines), o (follow-up choices, else the hub),
and a (a menu card whose real link is offered after it: tarifs, contact).
French: the script puts the narrow no-break space before ? ! : ; itself.
Run: python3 scripts/npc-lines.py
"""
import json, re, pathlib

P = pathlib.Path(__file__).resolve().parent.parent / 'assets/cast/lines.json'

HUB = ['what', 'cat', 'coffee', 'contact', 'coat', 'secret']
SHAPE = {  # node -> (follow-ups, menu card)
    'what': (['price', 'solo'], ''), 'price': ([], 'tarifs'), 'solo': ([], ''),
    'cat': (['pet'], ''), 'pet': ([], ''), 'coffee': (['coffee2'], ''), 'coffee2': ([], ''),
    'contact': ([], 'contact'), 'coat': ([], ''), 'secret': ([], ''),
}
# faces, emotes, Kūro: the same in every language
ACT = {
    'first': [('glance', '!', ''), ('smirk', '', 'judge')],
    'back': [('smirk', 'note', 'smug')],
    'night': [('half', 'zz', 'loaf')],
    'what': [('glasses', '', ''), ('base', 'dots', '')],
    'price': [('smirk', '!', 'judge')],
    'solo': [('glance', 'sweat', 'judge')],
    'cat': [('base', 'dots', 'judge'), ('glasses', 'sweat', 'smug')],
    'pet': [('smirk', '', ''), ('glance-r', 'sweat', 'hiss')],
    'coffee': [('sip', 'dots', '')],
    'coffee2': [('smirk', 'spark', 'mug')],
    'contact': [('base', 'note', ''), ('laugh', 'spark', 'smug')],
    'coat': [('smirk', '', 'loaf')],
    'secret': [('glasses', 'sweat', ''), ('laugh', 'heart', 'peek')],
    'bye': [('smirk', '', '')],
    'poke': [('glance', '!', ''), ('glasses', 'sweat', ''), ('glance-r', 'vein', 'stamp'),
             ('smirk', 'dots', 'judge'), ('laugh', 'spark', 'love'), ('half', 'zz', 'loaf')],
}

T = {
 'fr': {
  'ui': {'prompt': 'Parler', 'aria': 'Parler à Yasser', 'close': 'Fermer', 'next': 'Suite', 'ask': 'Pose ta propre question…',
         'bye': 'Rien, je regarde.', 'ph': 'Ta question…', 'go': {'tarifs': 'Ouvrir les Tarifs', 'contact': 'Écrire sur WhatsApp'}},
  'first': ['Oh. Quelqu’un a cliqué sur le grand dessin. Ça arrive moins souvent que tu crois.',
            'Je suis Yasser. Je fais des sites la nuit. Kūro, lui, juge.'],
  'back': ['Te revoilà. Kūro a parié que tu reviendrais. Il ne parie jamais contre lui-même.'],
  'night': ['Il est tard. On est donc deux. Trois avec le chat.'],
  'what': ('Tu fais quoi, exactement ?', ['Des sites, des boutiques, des applis. Je dessine, je code, je mets en ligne.',
            'Tout seul, depuis Bordj Bou Arréridj. Surtout la nuit, quand les notifications dorment.']),
  'price': ('Et ça coûte combien ?', ['Les prix sont écrits sur la page Tarifs. Je ne les improvise pas. Même pour toi. Surtout pour toi.']),
  'solo': ('Tu travailles vraiment seul ?', ['Seul, oui. Kūro supervise. Il n’a jamais validé un seul commit.']),
  'cat': ('Pourquoi le chat me regarde comme ça ?', ['Il juge tout le monde. Ne le prends pas personnellement.',
            'Ce matin, il m’a jugé pendant vingt minutes. J’avais juste ouvert le frigo.']),
  'pet': ('Je peux le caresser ?', ['Tu peux essayer. La carte de tarot ne garantit rien.', '… Voilà. Il a décidé que non.']),
  'coffee': ('Tu bois combien de cafés ?', ['Je ne compte plus. Compter, c’est admettre qu’il y a un problème.']),
  'coffee2': ('Il y a un problème ?', ['Non. C’est une méthode de travail. Très documentée. Par moi.']),
  'contact': ('Je peux te parler pour de vrai ?', ['Sur WhatsApp, oui. C’est moi qui réponds, pas un standard.',
            'Ici, c’est la version dessinée. Elle est plus polie et elle dort moins.']),
  'coat': ('Pourquoi un manteau blanc la nuit ?', ['Pour qu’on me retrouve dans le noir. Et le noir était déjà pris par le chat.']),
  'secret': ('Dis-moi un secret.', ['Le menu derrière toi ? Je l’ai refait onze fois.', 'La douzième, c’est celle que tu vois. Ne dis rien à Kūro.']),
  'bye': ['D’accord. Le menu ne mord pas. Le chat, je ne promets rien.'],
  'poke': ['Oui, c’est toujours moi.', 'Tu cliques sur un dessin. Je dis ça, je dis rien.', 'Kūro, il recommence.',
           'Je note ça dans ton dossier. Il n’y a pas de dossier. Mais je note.',
           'Bravo. Tu as débloqué : rien. Le jeu, c’est sur La Lanterne.', '…'],
 },
 'en': {
  'ui': {'prompt': 'Talk', 'aria': 'Talk to Yasser', 'close': 'Close', 'next': 'Next', 'ask': 'Ask your own question…',
         'bye': 'Nothing, just looking.', 'ph': 'Your question…', 'go': {'tarifs': 'Open Pricing', 'contact': 'Write on WhatsApp'}},
  'first': ['Oh. Someone clicked the big drawing. That happens less than you’d think.',
            'I’m Yasser. I build websites at night. Kūro judges.'],
  'back': ['You’re back. Kūro bet you would be. He never bets against himself.'],
  'night': ['It’s late. So there are two of us. Three with the cat.'],
  'what': ('What do you actually do?', ['Websites, shops, apps. I draw, I code, I put them online.',
            'On my own, from Bordj Bou Arréridj. Mostly at night, when notifications sleep.']),
  'price': ('And how much does it cost?', ['The prices are written on the Pricing page. I don’t improvise them. Not even for you. Especially for you.']),
  'solo': ('Do you really work alone?', ['Alone, yes. Kūro supervises. He has never approved a single commit.']),
  'cat': ('Why is the cat looking at me like that?', ['He judges everyone. Don’t take it personally.',
            'This morning he judged me for twenty minutes. I had only opened the fridge.']),
  'pet': ('Can I pet him?', ['You can try. The tarot card guarantees nothing.', '… There. He decided no.']),
  'coffee': ('How many coffees do you drink?', ['I stopped counting. Counting means admitting there’s a problem.']),
  'coffee2': ('Is there a problem?', ['No. It’s a work method. Well documented. By me.']),
  'contact': ('Can I talk to you for real?', ['On WhatsApp, yes. I answer myself, not a front desk.',
            'This is the drawn version. It’s more polite and sleeps less.']),
  'coat': ('Why a white coat at night?', ['So people can find me in the dark. And black was already taken by the cat.']),
  'secret': ('Tell me a secret.', ['The menu behind you? I redid it eleven times.', 'The twelfth is the one you’re looking at. Don’t tell Kūro.']),
  'bye': ['Fine. The menu doesn’t bite. The cat, no promises.'],
  'poke': ['Yes, still me.', 'You’re clicking a drawing. Just saying.', 'Kūro, he’s doing it again.',
           'I’m writing this in your file. There is no file. But I’m writing.',
           'Well done. You unlocked: nothing. The game is in The Lantern.', '…'],
 },
 'ar': {
  'ui': {'prompt': 'تحدّث', 'aria': 'تحدّث إلى ياسر', 'close': 'إغلاق', 'next': 'التالي', 'ask': 'اطرح سؤالك الخاص…',
         'bye': 'لا شيء، أتفرّج فقط.', 'ph': 'سؤالك…', 'go': {'tarifs': 'افتح الأسعار', 'contact': 'اكتب على واتساب'}},
  'first': ['أوه. أحدهم نقر على الرسمة الكبيرة. هذا يحدث أقل مما تظن.',
            'أنا ياسر. أصنع المواقع ليلاً. أما كورو، فيحكم على الجميع.'],
  'back': ['عدتَ إذن. راهن كورو على أنك ستعود. هو لا يراهن أبداً ضد نفسه.'],
  'night': ['الوقت متأخر. نحن اثنان إذن. ثلاثة مع القط.'],
  'what': ('ماذا تفعل بالضبط؟', ['مواقع، متاجر، تطبيقات. أرسم، أبرمج، وأنشرها.',
            'وحدي، من برج بوعريريج. في الليل غالباً، حين تنام الإشعارات.']),
  'price': ('وكم يكلّف ذلك؟', ['الأسعار مكتوبة في صفحة الأسعار. لا أرتجلها. ولا حتى لك. خصوصاً لك.']),
  'solo': ('هل تعمل وحدك حقاً؟', ['وحدي، نعم. كورو يشرف. لم يوافق على سطر برمجي واحد قط.']),
  'cat': ('لماذا ينظر إليّ القط هكذا؟', ['إنه يحكم على الجميع. لا تأخذ الأمر بشكل شخصي.',
            'هذا الصباح حكم عليّ عشرين دقيقة. كل ما فعلته أنني فتحت الثلاجة.']),
  'pet': ('هل يمكنني أن أداعبه؟', ['يمكنك المحاولة. بطاقة التاروت لا تضمن شيئاً.', '… ها هو. قرّر أن الجواب لا.']),
  'coffee': ('كم فنجان قهوة تشرب؟', ['توقفت عن العدّ. العدّ اعتراف بأن هناك مشكلة.']),
  'coffee2': ('وهل هناك مشكلة؟', ['لا. إنها طريقة عمل. موثّقة جيداً. من طرفي.']),
  'contact': ('هل يمكنني التحدث معك فعلاً؟', ['على واتساب، نعم. أنا من يردّ، لا موظف استقبال.',
            'هنا النسخة المرسومة. أكثر تهذيباً، وتنام أقل.']),
  'coat': ('لماذا معطف أبيض في الليل؟', ['كي يجدوني في الظلام. ولأن الأسود كان محجوزاً للقط.']),
  'secret': ('أخبرني سراً.', ['القائمة خلفك؟ أعدت تصميمها إحدى عشرة مرة.', 'الثانية عشرة هي التي تراها. لا تخبر كورو.']),
  'bye': ['حسناً. القائمة لا تعضّ. القط، لا أعدك بشيء.'],
  'poke': ['نعم، ما زلت أنا.', 'أنت تنقر على رسمة. مجرد ملاحظة.', 'كورو، إنه يعيدها.',
           'سأسجّل هذا في ملفك. لا يوجد ملف. لكنني أسجّل.',
           'أحسنت. فتحت: لا شيء. اللعبة في الفانوس.', '…'],
 },
}

ARCANA = {
    'fr': {'judge': ['VIII', 'La Justice'], 'loaf': ['XIV', 'La Tempérance'], 'smug': ['XIX', 'Le Soleil'], 'stamp': ['IV', 'L’Empereur'], 'peek': ['XVIII', 'La Lune'],
           'shook': ['XVI', 'La Tour'], 'hiss': ['XI', 'La Force'], 'love': ['VI', 'L’Amoureux'], 'leave': ['0', 'Le Mat'], 'mug': ['IX', 'L’Ermite']},
    'en': {'judge': ['VIII', 'Justice'], 'loaf': ['XIV', 'Temperance'], 'smug': ['XIX', 'The Sun'], 'stamp': ['IV', 'The Emperor'], 'peek': ['XVIII', 'The Moon'],
           'shook': ['XVI', 'The Tower'], 'hiss': ['XI', 'Strength'], 'love': ['VI', 'The Lovers'], 'leave': ['0', 'The Fool'], 'mug': ['IX', 'The Hermit']},
    'ar': {'judge': ['VIII', 'العدالة'], 'loaf': ['XIV', 'الاعتدال'], 'smug': ['XIX', 'الشمس'], 'stamp': ['IV', 'الإمبراطور'], 'peek': ['XVIII', 'القمر'],
           'shook': ['XVI', 'البرج'], 'hiss': ['XI', 'القوة'], 'love': ['VI', 'العشاق'], 'leave': ['0', 'الأحمق'], 'mug': ['IX', 'الناسك']},
}

NB = ' '
def fr(s):
    return re.sub(r'[   ]*([?!:;])', NB + r'\1', s)

def lines(lang, key, texts):
    acts = ACT[key]
    assert len(acts) == len(texts), (lang, key)
    out = []
    for txt, (fc, em, kr) in zip(texts, acts):
        if lang == 'fr': txt = fr(txt)
        assert len(txt) <= 160, (lang, key, len(txt))
        out.append([txt, fc, em, kr])
    return out

L = json.loads(P.read_text())
for lang, D in T.items():
    ui = dict(D['ui'])
    if lang == 'fr':
        ui = {k: (fr(v) if isinstance(v, str) else {a: fr(b) for a, b in v.items()}) for k, v in ui.items()}
    nodes = {}
    for k, (o, a) in SHAPE.items():
        q, ls = D[k]
        nodes[k] = {'q': fr(q) if lang == 'fr' else q, 'l': lines(lang, k, ls)}
        if o: nodes[k]['o'] = o
        if a: nodes[k]['a'] = a
    L[lang]['npc'] = {
        'ui': ui, 'hub': HUB, 'gate': {'secret': 3},
        'open': {k: lines(lang, k, D[k]) for k in ('first', 'back', 'night')},
        'bye': lines(lang, 'bye', D['bye']), 'poke': lines(lang, 'poke', D['poke']),
        'nodes': nodes,
        'arcana': ARCANA[lang],
        'hover': {'tarifs': '!', 'contact': 'note', 'travaux': 'spark', 'atelier': 'dots', 'lanterne': '?', 'bible': 'heart'},
    }
P.write_text(json.dumps(L, ensure_ascii=False, indent=1) + '\n')
print('ok', P.stat().st_size)
