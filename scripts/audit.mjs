#!/usr/bin/env node
/**
 * Browser audit — `npm run audit`. Self-hosting; exits non-zero on any failure.
 *
 * ~55 runs over every page (site.mjs PAGES): index.html in all six themes x
 * FR/EN/AR at 1280x900 and all six x FR/AR on a 390x844 phone; scene/ in each
 * language on desktop and phone; 404 in two themes in Arabic; hub/ in both of
 * its palettes; tablet (768x1024, 1024x768) and short landscape (844x390);
 * one run with the phone menu open; the legal preview when it exists. Each
 * run scrolls the whole page, then
 * checks: layout shift (CLS > 0.01), LCP, axe (all default rules), horizontal
 * overflow (honouring clipping ancestors), reveals that never fired, tap
 * targets under 24px, broken images, infinite animations, JS errors, failed
 * requests and any third-party request.
 *
 * Two checks are deliberately WCAG-exact rather than naive, because the naive
 * versions produced confident false failures:
 *  - tap targets apply the 2.5.8 spacing exception: under 24px fails only if
 *    its 24px clear zone collides with another target's
 *  - "unrevealed" skips display:none and waits 1.8s, since reveals run 1s
 *    plus a stagger delay
 * axe "incomplete" results (things axe could not decide, e.g. an unresolved
 * aria-labelledby) are printed as warnings: they need a look, not a failure.
 */
import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {serve,launch} from './lib/serve.mjs';
import {ROOT,THEMES} from './site.mjs';
const srv=await serve();
const B=srv.base;
const AXE=readFileSync(join(ROOT,'node_modules/axe-core/axe.min.js'),'utf8');
const b=await launch();
let fails=0;const rows=[],warnings=[];
const run=async(label,path,{theme,lang,w=1280,h=900,allowLoops=false,touch=w<600,init={},click=null}={})=>{
  const p=await b.newPage({viewport:{width:w,height:h},hasTouch:touch,isMobile:touch});
  const errs=[],bad=[];
  p.on('pageerror',e=>errs.push(String(e).slice(0,80)));
  p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,80))});
  p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url().replace(B,''))});
  p.on('requestfailed',r=>bad.push('FAIL '+r.url().replace(B,'')));
  await p.addInitScript(([t,l,init])=>{if(t)localStorage.setItem('numidea-theme',t);if(l)localStorage.setItem('numidea-lang',l);for(const k in init)localStorage.setItem(k,init[k]);
    window.__cls=0;window.__lcp=0;
    new PerformanceObserver(x=>{for(const e of x.getEntries())if(!e.hadRecentInput)window.__cls+=e.value}).observe({type:'layout-shift',buffered:true});
    new PerformanceObserver(x=>{for(const e of x.getEntries())window.__lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});},[theme,lang,init]);
  await p.goto(B+path,{waitUntil:'networkidle'});
  if(click){await p.click(click);await p.waitForTimeout(500);}
  await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'});
  await p.evaluate(async()=>{const H=document.body.scrollHeight;for(let y=0;y<H;y+=innerHeight/2){scrollTo(0,y);await new Promise(r=>setTimeout(r,45))}scrollTo(0,0)});
  await p.waitForTimeout(1800);   // reveals run 1s plus a stagger delay
  const m=await p.evaluate(()=>{
    const dw=document.documentElement.clientWidth;const of=[];
    for(const e of document.querySelectorAll('*')){const r=e.getBoundingClientRect();if(!r.width)continue;
      if(r.right<=dw+1&&r.left>=-1)continue;let a=e.parentElement,c=false;
      while(a){const s=getComputedStyle(a);if(/hidden|clip|auto|scroll/.test(s.overflowX)||s.clipPath!=='none'){c=true;break}a=a.parentElement}
      if(!c)of.push(e.tagName+'.'+String(e.className).slice(0,24))}
    // unrevealed content after a full scroll = a reveal gate that never fired
    const hidden=[...document.querySelectorAll('.reveal,[data-reveal]')].filter(e=>getComputedStyle(e).display!=='none'&&parseFloat(getComputedStyle(e).opacity)<0.5).length;
    // tap targets under 24px (WCAG 2.5.8)
    // WCAG 2.5.8: under 24px fails only if its 24px clear zone collides
    const TG=[...document.querySelectorAll('a[href],button,input,select,textarea,summary,label.echip,label.eopt')].filter(e=>{
      const r=e.getBoundingClientRect(),s=getComputedStyle(e);if(!r.width||s.visibility==='hidden'||e.closest('[inert],[hidden]'))return false;
      return !(s.display==='inline'&&e.closest('p,li,dd'))});   // inline text links are exempt
    const R=TG.map(e=>e.getBoundingClientRect());
    const dist=(cx,cy,r)=>Math.hypot(Math.max(r.left-cx,0,cx-r.right),Math.max(r.top-cy,0,cy-r.bottom));
    const small=TG.filter((e,i)=>{const a=R[i];if(a.width>=24&&a.height>=24)return false;
      const cx=a.left+a.width/2,cy=a.top+a.height/2;
      return R.some((b,j)=>j!==i&&(dist(cx,cy,b)<12||((b.width<24||b.height<24)&&Math.hypot(cx-(b.left+b.width/2),cy-(b.top+b.height/2))<24)))}).length;
    const imgs=[...document.images].filter(i=>i.complete&&i.naturalWidth===0).length;
    return {cls:window.__cls,lcp:window.__lcp,of:[...new Set(of)],hidden,small,imgs,hscroll:document.documentElement.scrollWidth>dw+1};});
  const anim=await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getComputedTiming().iterations===Infinity).length);
  await p.evaluate(AXE);
  const axr=await p.evaluate(async()=>{const r=await axe.run(document,{resultTypes:['violations','incomplete']});
    return {v:r.violations.map(v=>v.id+'('+v.nodes.length+')'),i:r.incomplete.filter(v=>v.id!=='color-contrast').map(v=>v.id+'('+v.nodes.length+')')}});
  const ax=axr.v;if(axr.i.length)warnings.push(label+': '+axr.i.join(', '));
  const third=await p.evaluate(o=>performance.getEntriesByType('resource').filter(r=>!r.name.startsWith(o)).length,B);
  const issues=[];
  if(m.cls>0.01)issues.push('cls');if(ax.length)issues.push('axe');if(m.of.length||m.hscroll)issues.push('overflow');
  if(anim&&!allowLoops)issues.push('anim');if(errs.length)issues.push('js');if(bad.length)issues.push('net');if(third)issues.push('3p');
  if(m.hidden)issues.push('unrevealed');if(m.imgs)issues.push('img');if(m.small)issues.push('tap');
  if(issues.length)fails++;
  rows.push({label,...m,anim,ax,errs,bad,third,issues});
  console.log((issues.length?'FAIL ':'  ok ')+label.padEnd(26),`cls ${m.cls.toFixed(4)}  lcp ${Math.round(m.lcp)}ms  axe ${ax.join(',')||0}  of ${m.of.length+(m.hscroll?'+H':'')}  unrev ${m.hidden}  tap<24 ${m.small}  img ${m.imgs}  anim ${anim}  js ${errs.length}  net ${bad.length}  3p ${third}`);
  if(errs.length)console.log('       js:',errs.join(' | '));
  if(bad.length)console.log('      net:',bad.join(' | '));
  if(m.of.length)console.log('       of:',m.of.join(' | '));
  await p.close();
};
console.log('— desktop 1280×900 —');
await run('hub','/hub/index.html');
for(const l of ['fr','en','ar']) await run('scene '+l,'/scene/index.html',{lang:l});
await run('404','/404.html');
await run('404 noir/ar','/404.html',{theme:'noir',lang:'ar'});
// WorkspaceHQ is a different product with its own arcade identity: blinking
// INSERT COIN, the glitching headline and the marquee ARE the design, so the
// no-endless-loop rule is waived there (its loops pause when off screen).
await run('workspacehq','/workspacehq/index.html',{allowLoops:true});
if(existsSync(join(ROOT,'legal-preview/index.html'))) await run('legal preview','/legal-preview/index.html');
if(existsSync(join(ROOT,'legal/index.html'))) await run('legal','/legal/index.html');
for(const t of THEMES)
  for(const l of ['fr','en','ar']) await run(`index ${t}/${l}`,'/index.html',{theme:t,lang:l});
console.log('— phone 390×844 —');
await run('hub m','/hub/index.html',{w:390,h:844});
await run('hub light m','/hub/index.html',{w:390,h:844,init:{'void-theme':'light'}});
for(const l of ['fr','en','ar']) await run('scene '+l+' m','/scene/index.html',{lang:l,w:390,h:844});
await run('404 m','/404.html',{w:390,h:844});
await run('404 daylight/ar m','/404.html',{theme:'daylight',lang:'ar',w:390,h:844});
await run('workspacehq m','/workspacehq/index.html',{w:390,h:844,allowLoops:true});
for(const t of THEMES)
  for(const l of ['fr','ar']) await run(`index ${t}/${l} m`,'/index.html',{theme:t,lang:l,w:390,h:844});
await run('index menu open ar m','/index.html',{lang:'ar',w:390,h:844,click:'.menu-toggle'});
console.log('— tablet and landscape —');
await run('index arcanum/fr 768','/index.html',{theme:'arcanum',lang:'fr',w:768,h:1024,touch:true});
await run('index daylight/ar 768','/index.html',{theme:'daylight',lang:'ar',w:768,h:1024,touch:true});
await run('index noir/fr 1024','/index.html',{theme:'noir',lang:'fr',w:1024,h:768,touch:true});
await run('index arcanum/ar 1024','/index.html',{theme:'arcanum',lang:'ar',w:1024,h:768,touch:true});
await run('index arcanum/fr 844×390','/index.html',{theme:'arcanum',lang:'fr',w:844,h:390,touch:true});
await run('index arcanum/ar 844×390','/index.html',{theme:'arcanum',lang:'ar',w:844,h:390,touch:true});
await run('404 844×390','/404.html',{w:844,h:390,touch:true});
await b.close();srv.close();
if(warnings.length){console.log('\naxe incomplete (review, not failing):');for(const w of warnings)console.log('  '+w)}
console.log(fails?`\nFAILURES: ${fails} of ${rows.length}`:`\nALL CLEAN (${rows.length} runs)`);
process.exit(fails?1:0);
