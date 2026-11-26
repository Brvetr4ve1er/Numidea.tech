import json
BEAT=2000/3; E8=round(BEAT/8)
# ACTIONS: frame sequences. Each step = [asset id, hold in e8]. 'over' = layered on top of a base frame (rig).
A={
 # Yasser head rig (stack over yasser:rig:base, same 501x565 canvas)
 'y.blink':{'base':'yasser:rig:base','steps':[['yasser:rig:blink',1.5]],'loop':'idle','every':[2.2,4.8],'note':'random gap 2.2–4.8 s'},
 'y.talk':{'base':'yasser:rig:base','steps':[['yasser:rig:talk-a',2],['yasser:rig:base',1],['yasser:rig:talk-b',2],['yasser:rig:base',1]],'loop':'while-typing','note':'tie to text typing: one mouth shape per 2 letters'},
 'y.glance-left':{'base':'yasser:rig:base','steps':[['yasser:rig:glance',8]]},
 'y.glance-right':{'base':'yasser:rig:base','steps':[['yasser:rig:glance-r',8]]},
 'y.push-glasses':{'base':'yasser:rig:base','steps':[['yasser:rig:glasses',4],['yasser:rig:base',0]]},
 'y.half-lid':{'base':'yasser:rig:base','steps':[['yasser:rig:half',8]]},
 'y.laugh':{'base':'yasser:rig:base','steps':[['yasser:rig:laugh',2],['yasser:rig:smirk',1],['yasser:rig:laugh',2],['yasser:rig:smirk',1],['yasser:rig:laugh',4]]},
 'y.sip':{'base':'yasser:rig:base','steps':[['yasser:rig:sip',12]]},
 'y.smirk':{'base':'yasser:rig:base','steps':[['yasser:rig:smirk',8]]},
 'y.look-up':{'base':'yasser:rig:base','steps':[['yasser:rig:up',8]]},
 'y.yawn':{'base':'yasser:rig:base','steps':[['yasser:rig:half',2],['yasser:rig:yawn',10],['yasser:rig:half',3]]},
 # Yasser 2-frame body actions (a/b share one canvas)
 'y.wave':{'steps':[['yasser:action:wave-a',3],['yasser:action:wave-b',3]],'loop':3},
 'y.phone':{'steps':[['yasser:action:phone-a',4],['yasser:action:phone-b',4]],'loop':2},
 'y.point-up':{'steps':[['yasser:action:pointup-a',3],['yasser:action:pointup-b',5]]},
 'y.sketch':{'steps':[['yasser:action:sketch-a',2],['yasser:action:sketch-b',2]],'loop':4},
 'y.win':{'steps':[['yasser:action:win-a',3],['yasser:action:win-b',5]]},
 'duo.hug':{'steps':[['yasser:action:duo-a',6],['yasser:action:duo-b',6]]},
 'y.turn':{'steps':[['yasser:turn:front',2],['yasser:turn:34',2],['yasser:turn:side',2],['yasser:turn:34back',2],['yasser:turn:back',3],['yasser:turn:34back',2],['yasser:turn:side',2],['yasser:turn:34',2],['yasser:turn:front',2]],'note':'hard cuts, no tween: it reads as a turn because each view holds 2 e8'},
 # Kūro rig (stack over kuro:rig:base, 360x294)
 'k.blink':{'base':'kuro:rig:base','steps':[['kuro:rig:blink',1.5]],'loop':'idle','every':[3,6]},
 'k.ear':{'base':'kuro:rig:base','steps':[['kuro:rig:ear',1],['kuro:rig:base',1],['kuro:rig:ear',1]]},
 'k.look-left':{'base':'kuro:rig:base','steps':[['kuro:rig:left',8]]},
 'k.look-right':{'base':'kuro:rig:base','steps':[['kuro:rig:right',8]]},
 'k.startle':{'base':'kuro:rig:base','steps':[['kuro:rig:wide',6]]},
 'k.yawn':{'base':'kuro:rig:base','steps':[['kuro:rig:yawn',10]]},
}
# REACTIONS: one emotion = face + Kūro + mark + the motion it gets
R={
 'neutral':{'face':'deadpan','kuro':'peek','mark':'…','motion':'none','fr':'à l’écoute'},
 'joy':{'face':'laugh','kuro':'love','mark':'♪','motion':'pop','fr':'ravi','action':'y.laugh'},
 'smug':{'face':'smirk','kuro':'smug','mark':'✦','motion':'pop','fr':'content de lui','action':'y.smirk'},
 'thinking':{'face':'think','kuro':'peek','mark':'?','motion':'tilt','fr':'réfléchit','action':'y.look-up'},
 'focus':{'face':'focus','kuro':'stamp','mark':'!','motion':'push-in','fr':'concentré','action':'y.push-glasses'},
 'surprised':{'face':'shocked','kuro':'shook','mark':'!!','motion':'shake','fr':'surpris','kuroAction':'k.startle'},
 'annoyed':{'face':'sideeye','kuro':'judge','mark':'✱','motion':'tilt','fr':'regard en coin','action':'y.glance-right'},
 'angry':{'face':'angry','kuro':'hiss','mark':'✱✱','motion':'shake','fr':'pas d’accord'},
 'tired':{'face':'tired','kuro':'mug','mark':'//','motion':'droop','fr':'fatigué','action':'y.half-lid'},
 'sleepy':{'face':'sleep','kuro':'loaf','mark':'z','motion':'droop','fr':'à moitié endormi','action':'y.yawn','kuroAction':'k.yawn'},
 'embarrassed':{'face':'facepalm','kuro':'judge','mark':'//','motion':'droop','fr':'gêné'},
 'decisive':{'face':'pointyou','kuro':'stamp','mark':'!','motion':'slam','fr':'c’est toi qu’il pointe'},
}
# MOTIONS: what each motion word means, on the token ladder (ms, curve)
MO={
 'none':{},
 'pop':{'keyframes':[[0,'scale(.86)'],[.6,'scale(1.05)'],[1,'none']],'ms':250,'ease':'out'},
 'tilt':{'keyframes':[[0,'rotate(0)'],[1,'rotate(-4deg)']],'ms':333,'ease':'snap'},
 'push-in':{'keyframes':[[0,'scale(1)'],[1,'scale(1.06)']],'ms':333,'ease':'out'},
 'shake':{'keyframes':[[0,'none'],[.2,'translate(-8px,4px)'],[.4,'translate(7px,-3px)'],[.6,'translate(-4px,2px)'],[.8,'translate(2px,-1px)'],[1,'none']],'ms':200,'ease':'steps(5,jump-none)'},
 'droop':{'keyframes':[[0,'none'],[1,'translateY(10px) rotate(2deg)']],'ms':420,'ease':'move'},
 'slam':{'keyframes':[[0,'translateY(60px) scale(1.08,.94)'],[.55,'translateY(-10px) scale(.98,1.03)'],[.78,'translateY(3px) scale(1.01,.99)'],[1,'none']],'ms':420,'ease':'out'},
}
PROPCARD={'satchel':['La sacoche','Hublot inclus. Kūro voyage en première.'],'laptop':['Le portable','Touches rouges : ses raccourcis.'],'sketchbook':['Le carnet','Tout commence ici, avant le code.'],'box-closed':['Le colis','Scotché, testé, prêt à partir.'],'box-open':['Le colis, ouvert','C’est en ligne. Tu peux regarder.'],'headphones':['Le casque','Mode ne-pas-déranger.'],'scooter':['Le scooter','Plus rapide qu’un devis.'],'server':['La baie','Surveillée. Elle tient.'],'server-boom':['La baie, avant','Une fois. On n’en parle pas.']}
# SCENES: the talk acts (pose/action + word + prop + reaction). 'q' = the visitor's question, 'line' = his answer.
S={}
ACTS=[('wave','Salut !','Salut. Kūro t’a vu arriver avant moi.','joy','y.wave','Salut','satchel','peek'),
 ('build','Tu fais quoi, exactement ?','Des sites, des marques, des mascottes. Du début jusqu’à la mise en ligne.','focus','pose:laptop','Je code','laptop','none'),
 ('price','C’est combien ?','Prix fixe, écrit avant. Le menu est dans le Studio.','decisive','pose:invoice','Prix fixe',None,'stamp'),
 ('turn','Tourne-toi.','D’accord, un tour. Pas deux.','smug','y.turn','Un tour',None,'judge'),
 ('coffee','Tu dors quand ?','Après la mise en ligne. Donc rarement.','sleepy','pose:coffee','Café',None,'mug'),
 ('kuro','Kūro est gentil ?','Gentil, non. Juste. Il valide, ou il s’en va.','smug',None,None,None,'smug'),
 ('phone','On travaille ensemble ?','Écris-moi sur WhatsApp. Je réponds, même à 2 h.','decisive','y.phone','WhatsApp',None,'stamp'),
 ('ride','Tu peux venir sur place ?','Bordj Bou Arréridj et autour, oui. Sinon, tout se fait en ligne.','joy','y.wave','J’arrive','scooter','peek'),
 ('deploy','Et après la livraison ?','Je mets en ligne, je surveille, je corrige. Le site tient.','focus','y.point-up','Déployé','server','stamp'),
 ('nomiddleman','Un intermédiaire m’a dit…','Pas d’intermédiaire ici. Tu parles à celui qui code.','angry',None,None,None,'hiss'),
 ('show','Montre-moi un truc.','Ok, regarde. Une démo d’abord, le prix après.','focus','pose:sign','Regarde',None,'peek'),
 ('oops','Tu as raté quelque chose ?','Une fois. On n’en parle pas.','embarrassed','pose:facepalm','Oups','server-boom','judge'),
 # acts with no question yet (usable by the talk AI 'act' field)
 ('sketch',None,None,'focus','y.sketch','Je dessine','sketchbook','peek'),
 ('deliver',None,None,'smug','pose:handover','Livré','box-closed','stamp'),
 ('inspect',None,None,'thinking','pose:inspect','Détails',None,'peek'),
 ('celebrate',None,None,'joy','y.win','En ligne','box-open','love'),
 ('shrug',None,None,'neutral','pose:shrug','Ça dépend',None,'judge'),
 ('nap',None,None,'sleepy','pose:nap','Pause','headphones','loaf'),
]
for id,q,line,emo,body,word,prop,kuro in ACTS:
    sc={'reaction':emo,'kuro':kuro}
    if q: sc['q']=q; sc['line']=line
    if body: sc['body']=body; sc['word']=word
    if prop: sc['prop']=prop; sc['card']=PROPCARD[prop]
    S['talk.'+id]=sc
MENU=[('travaux','Travaux','/scene/','smirk','stamp','box-open','Des vrais sites, en ligne. Clique, tu verras.'),
 ('tarifs','Tarifs','/tarifs/','focus','judge','fineliner','Le prix est écrit avant qu’on commence. Pas de surprise.'),
 ('atelier','L’Atelier','/hub/','think','peek','laptop','Là où je fabrique. Entre, mais ne touche pas au clavier.'),
 ('lanterne','La Lanterne','/hub/lanterne/','laugh','loaf','sketchbook','Ce que j’ai appris, rangé pour que tu l’apprennes plus vite.'),
 ('bible','La Bible','/hub/bible/','deadpan','love','hairsticks','Moi, Kūro, et les règles du dessin. Tu peux même me parler.'),
 ('contact','Contact','WhatsApp','pointyou','smug','scooter','Pas d’intermédiaire. Tu écris, c’est moi qui réponds.')]
for id,lab,dest,face,kuro,prop,line in MENU:
    S['menu.'+id]={'label':lab,'dest':dest,'face':face,'kuro':kuro,'prop':prop,'line':line,'body':'yasser:scene:master-full','wants':'one drawn pose per section (missing)'}
json.dump({'clock':{'bpm':90,'beat':round(BEAT),'e8':E8,'note':'step holds are in e8 units'},'ease':{'out':'cubic-bezier(.16,1,.3,1)','in':'cubic-bezier(.7,0,.84,0)','snap':'cubic-bezier(.34,1.56,.64,1)','move':'cubic-bezier(.65,0,.35,1)'},
  'actions':A,'reactions':R,'motions':MO,'scenes':S},open('kit.json','w'),ensure_ascii=False,indent=1)
print(len(A),len(R),len(S))
