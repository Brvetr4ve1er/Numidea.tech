# Builds the character kit: art (cleaned, named), manifest, actions, reactions, scenes.
import os, json, shutil, subprocess, glob
from PIL import Image
REPO='/home/claude/numidea.tech/hub/bible/art'
CLEAN='/mnt/project-files/characters/bible-clean'
PROPS='/mnt/project-files/characters/new-props/cut-v2'
TOOLS='/mnt/project-files/characters/tools'
OUT='art'; shutil.rmtree(OUT, ignore_errors=True)
for d in ['yasser/pose','yasser/action','yasser/face','yasser/rig','yasser/turn','yasser/scene','kuro/react','kuro/rig','props']: os.makedirs(f'{OUT}/{d}')
import tempfile; tmp=tempfile.mkdtemp(prefix='kit-dehalo-')
def src(name):
    c=f'{CLEAN}/{name}.webp'
    if os.path.exists(c): return c, 'bible-clean'
    r=f'{REPO}/{name}.webp'
    # dehalo the repo frame on the fly
    subprocess.run(['python3',f'{TOOLS}/dehalo.py',tmp,r],check=True,capture_output=True)
    return f'{tmp}/{name}.webp','bible (dehaloed here)'
M=[]
def put(name,dest,kind,tags,maxside=None,source=None,note=''):
    s,origin=(source,'props cut-v2') if source else src(name)
    im=Image.open(s).convert('RGBA')
    if maxside and max(im.size)>maxside:
        k=maxside/max(im.size); im=im.resize((round(im.size[0]*k),round(im.size[1]*k)),Image.LANCZOS)
    p=f'{OUT}/{dest}.webp'; im.save(p,'WEBP',quality=86,method=6)
    M.append({'id':dest.replace('/',':'),'file':p,'w':im.size[0],'h':im.size[1],'kind':kind,'tags':tags,'origin':origin,'bytes':os.path.getsize(p),**({'note':note} if note else {})})
POSES={'coffee':['tired','break'],'facepalm':['embarrassed','oops'],'flagstack':['launch','proud'],'handover':['deliver'],'inspect':['detail','focus'],'invoice':['price'],'laptop':['build','code'],'nap':['sleep','break'],'point':['decisive','you'],'receipt':['price','paid'],'shrug':['depends'],'sign':['show','present']}
for k,t in POSES.items(): put(f'pose-{k}',f'yasser/pose/{k}','pose',t)
for k in ['phone','pointup','sketch','wave','win','duo']:
    for f in 'ab': put(f'actor-{k}-{f}',f'yasser/action/{k}-{f}','action-frame',[k])
for k in ['angry','deadpan','facepalm','focus','laugh','pointyou','shocked','sideeye','sleep','smirk','think','tired']: put(f'face-{k}',f'yasser/face/{k}','face',[k])
for k in ['base','blink','glance','glance-r','glasses','half','laugh','sip','smirk','talk-a','talk-b','up','yawn']: put(f'rig-y-{k}',f'yasser/rig/{k}','rig-frame',['head'])
for k in ['front','34','side','34back','back']: put(f'turn-{k}',f'yasser/turn/{k}','turn',['turnaround'])
for k in ['hiss','judge','leave','loaf','love','mug','peek','shook','smug','stamp','scale']: put(f'kuro-{k}',f'kuro/react/{k}','kuro',[k])
for k in ['base','blink','ear','left','right','wide','yawn']: put(f'rig-k-{k}',f'kuro/rig/{k}','rig-frame',['kuro'])
PR={'satchel':'satchel','satchel-open':'satchel-open','laptop':'laptop-open','laptop-closed':'laptop-closed','sketchbook':'sketchbook','fineliner':'fineliner','fountain-pen':'fountain-pen','marker':'marker','box-closed':'box-closed','box-open':'box-open','headphones':'headphones','headphones-flat':'headphones-flat','scooter':'scooter','scooter-front':'scooter-front','server':'server-rack','server-side':'server-side','server-boom':'server-boom','hairsticks':'hairsticks-x'}
for k,f in PR.items(): put(k,f'props/{k}','prop',[k],maxside=480,source=f'{PROPS}/{f}.webp')
put('tarot',f'props/tarot','prop',['tarot','kuro'],maxside=480,source='/mnt/project-files/characters/new-props/cut/tarot-front.webp')
put('tarot-back',f'props/tarot-back','prop',['tarot'],maxside=480,source='/mnt/project-files/characters/new-props/cut/tarot-back.webp')
put('master-full','yasser/scene/master-full','hero',['full body','menu'],maxside=1278,source=f'{PROPS}/yasser-master-full.webp')
put('master-head','yasser/scene/master-head','hero',['bust'],maxside=900,source=f'{PROPS}/yasser-master-head.webp')
put('kuro-sit','kuro/react/sit-master','kuro',['sit','hero'],maxside=600,source=f'{PROPS}/kuro-master-sit.webp')
json.dump({'generated':'2026-11-26','count':len(M),'bytes':sum(m['bytes'] for m in M),'assets':M},open('manifest.json','w'),ensure_ascii=False,indent=1)
print(len(M), sum(m['bytes'] for m in M))
