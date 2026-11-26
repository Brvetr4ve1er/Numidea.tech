# Builds index.html and menu.html. Run: python3 gen.py
import html
e=html.escape
JY=[0,-2,1,-1,2,-1]; JR=[-2,1,-1,2,-1,1]
def cut(w,o):  # cut-letter jitter, only for the logo
    return ''.join('<span class="nl-ch" style="transform:translateY(%dpx) rotate(%ddeg)">%s</span>'%(JY[(i+o)%6],JR[(i+o)%6],' ' if c==' ' else e(c)) for i,c in enumerate(w))
WA="https://wa.me/213672412578?text=Bonjour%20Numidea%20Labs%20%E2%80%94%20j'aimerais%20parler%20d'un%20projet."
ITEMS=[('Travaux','Les sites livrés','/scene/','/scene/','Des vrais sites, en ligne. Clique, tu verras.','smirk','stamp','approuve','box'),
('Tarifs','Prix fixe, écrit avant','/tarifs/','/tarifs/','Le prix est écrit avant qu’on commence. Pas de surprise.','focus','judge','juge','fineliner'),
('L’Atelier','Outils, démos, coulisses','/hub/','/hub/','Là où je fabrique. Entre, mais ne touche pas au clavier.','think','peek','surveille','laptop'),
('La Lanterne','La librairie','/hub/lanterne/','/hub/lanterne/','Ce que j’ai appris, rangé pour que tu l’apprennes plus vite.','laugh','loaf','se repose','sketchbook'),
('La Bible','Qui je suis, et le chat','/hub/bible/','/hub/bible/','Moi, Kūro, et les règles du dessin. Tu peux même me parler.','deadpan','love','adore','sticks'),
('Contact','WhatsApp, directement moi',WA,'WhatsApp','Pas d’intermédiaire. Tu écris, c’est moi qui réponds.','pointyou','smug','est d’accord','scooter')]
# Layout grid (1280x800): cards 420x84, margins 48, rows 330/438/546 (84 + 24 gap),
# each row steps 24 px toward him; right column mirrors the left around x = 640; tilts mirror too.
COLX_L=[48,72,96]; ROWS=[330,438,546]; TILT_L=[-5,-3,-1]
POS=[(COLX_L[k],ROWS[k],TILT_L[k],'l') for k in range(3)]+[(1280-COLX_L[k]-420,ROWS[k],-TILT_L[k],'r') for k in range(3)]
RM=[-2,2,-2,2,-2,2]   # phone: alternate a small tilt
cards=[]
for i,(lab,sub,href,dest,say,face,kuro,ksay,prop) in enumerate(ITEMS):
    x,y,r,side=POS[i]
    ext=' target="_blank" rel="noopener"' if href.startswith('http') else ''
    cards.append(f'''<li><a class="nl-item {side}{' on' if i==0 else ''}" href="{e(href)}"{ext} style="--x:{x}px;--y:{y}px;--r:{r}deg;--rm:{RM[i]}deg;--d:{i*42}ms" data-label="{e(lab)}" data-dest="{e(dest)}" data-say="{e(say)}" data-face="{face}" data-kuro="{kuro}" data-kuro-say="{e(ksay)}">
 <span class="nl-pr"><span class="nl-sh"></span><span class="nl-face"></span>
  <span class="nl-tx"><span class="nl-key" aria-hidden="true">{i+1}</span><span class="nl-lab">{e(lab)}</span></span>
  <span class="nl-sub">{e(sub)}</span>
  <img class="nl-prop" src="img/prop-{prop}.webp" alt="" width="240" height="240" loading="lazy" decoding="async">
 </span>
</a></li>''')
moods=''.join(f'<div class="nl-mood{" on" if f=="smirk" else ""}" data-face="{f}"><img src="img/face-{f}.webp" alt="" width="72" height="56" decoding="async"></div>' for f in ['smirk','focus','laugh','think'])
first=ITEMS[0]
body=f'''<section class="nl-menu p4" aria-label="Numidea Labs, menu">
<div class="nl-stage">
 <div class="nl-abs nl-stripes" aria-hidden="true"></div>
 <div class="nl-abs nl-dots" aria-hidden="true"></div>
 <canvas class="nl-abs nl-mesh" aria-hidden="true"></canvas>
 <div class="nl-abs nl-shake" aria-hidden="true">
  <div class="nl-abs nl-slab"></div>
  <div class="nl-abs nl-shard s1"></div><div class="nl-abs nl-shard s2"></div><div class="nl-abs nl-shard s3"></div>
  <div class="nl-abs nl-burst"></div>
  <div class="nl-abs nl-mark">ヌミデア</div>
  <div class="nl-abs nl-echo"><img src="img/yasser-full.webp" alt="" width="564" height="1278" decoding="async"></div>
  <img class="nl-abs nl-fig" src="img/yasser-full.webp" alt="" width="564" height="1278" fetchpriority="high" decoding="async">
 </div>
 <p class="nl-abs nl-line" data-text="Numidea Labs · le studio de nuit" aria-hidden="true">Numidea Labs · le studio de nuit</p>
 <h1 class="nl-abs nl-name"><span aria-hidden="true">{cut('Numidea',1)}<br>{cut('Labs',4)}</span><span class="nl-sr">Numidea Labs</span></h1>

 <div class="nl-abs nl-hud nl-moods" aria-hidden="true"><div class="nl-moods-grid">{moods}</div><span class="nl-tag">humeurs</span></div>
 <div class="nl-abs nl-hud nl-kuro" aria-hidden="true"><img class="nl-tarot" src="img/tarot.webp" alt="" width="141" height="240" loading="lazy" decoding="async"><img class="nl-cat" src="img/kuro-stamp.webp" alt="" width="240" height="185" decoding="async"><span class="nl-tag">Kūro : approuve</span></div>

 <nav aria-label="Navigation principale"><ul class="nl-nav">
{chr(10).join(cards)}
 </ul></nav>

 <div class="nl-abs nl-hud nl-say"><div class="nl-say-in"><span class="nl-say-dest">{e(first[0])} → {e(first[3])}</span><p class="nl-say-box">{e(first[4])}</p></div></div>

 <div class="nl-abs nl-hud nl-topright"><div class="nl-langs"><a href="/" lang="fr" aria-current="true">FR</a><a href="/en/" lang="en">EN</a><a href="/ar/" lang="ar">AR</a></div><button class="nl-replay" type="button">Rejouer l’intro</button></div>
 <button class="nl-abs nl-skip" type="button">Passer l’intro</button>
 <div class="nl-abs nl-go" aria-hidden="true"></div>
 <div class="nl-abs nl-gotxt" aria-hidden="true"><span class="nl-golab"></span><span class="nl-godest"></span></div>
</div>
</section>'''
page=f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Numidea Labs · menu (preview)</title>
<link rel="preload" href="fonts/archivo-900-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="img/yasser-full.webp" as="image" fetchpriority="high">
<style>html,body{{margin:0;background:#211E1B}}</style>
<link rel="stylesheet" href="menu.css">
</head>
<body>
<!-- MENU: copy from here ... -->
{body}
<!-- ... to here. Then load menu.css in <head> and menu.js with defer. -->
<script src="menu.js" defer></script>
</body>
</html>
'''
open('index.html','w').write(page); open('menu.html','w').write(body+'\n')
