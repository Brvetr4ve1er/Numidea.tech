"""Write SCRIPT.md (the readable script, FR/EN/AR) from an episode JSON, so the script never drifts from what plays.
usage: python3 script-md.py episodes/ep01-dernier-depart.json > SCRIPT-ep01.md"""
import json, sys
d = json.load(open(sys.argv[1]))
L = ['fr', 'en', 'ar']
o = []
o.append(f"# {d['title']['fr']} / {d['title']['en']} / {d['title']['ar']}\n")
o.append(f"Generated from `{sys.argv[1].split('/')[-1]}`. Edit the JSON, not this file.\n")
o.append(f"Reward: +{d['reward']['encre']} Encre (first finish only), world flags {d['reward']['world']}.\n")
def lines(x):
    return '\n'.join(f"  - **{l.upper()}** {x[l]}" for l in L)
s = d['start']
o.append("## Opening\n")
o.append(f"Pose `{s.get('pose')}`, face `{s.get('face')}`, mark `{s.get('mark')}`\n\n{lines(s['line'])}\n")
o.append("## Hotspots and actions\n")
o.append("Conditions: *when* = flags needed, *unless* = flags that hide the action. Wrong turns are marked ✗.\n")
for h in d['hotspots']:
    o.append(f"### {h['name']['fr']} · {h['name']['en']} · {h['name']['ar']}  (`{h['id']}`, art `{h.get('art')}`)\n")
    for a in h['actions']:
        wrong = a.get('wrong')
        cond = []
        if a.get('when'): cond.append('when ' + '+'.join(a['when']))
        if a.get('unless'): cond.append('unless ' + '/'.join(a['unless']))
        eff = []
        if a.get('set'): eff.append('sets ' + ', '.join(a['set']))
        if a.get('swap'): eff.append('art → ' + a['swap'])
        if a.get('lesson'): eff.append('lesson ' + a['lesson'])
        if a.get('end'): eff.append('**ENDS the episode**')
        react = ', '.join(f"{k} `{a[k]}`" for k in ('pose', 'face', 'kuro', 'mark') if a.get(k))
        o.append(f"**{'✗ ' if wrong else ''}{a['label']['fr']}** / {a['label']['en']} / {a['label']['ar']}  \n"
                 f"{'; '.join(cond) or 'always'}. {react}. {'; '.join(eff)}\n\n{lines(a['line'])}\n")
o.append("## Lessons (the notebook)\n")
for ls in d['lessons']:
    o.append(f"**{ls['tag']['fr']}** (`{ls['id']}`)\n\n{lines(ls['text'])}\n")
e = d['end']
o.append("## Ending\n")
o.append(f"Title: {e['title']['fr']} / {e['title']['en']} / {e['title']['ar']}\n\n{lines(e['line'])}\n\nBack in the hub:\n\n{lines(e['hub'])}\n")
print('\n'.join(o))
