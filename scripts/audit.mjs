#!/usr/bin/env node
/**
 * Browser audit — `npm run audit`. Self-hosting; exits non-zero on any failure.
 *
 * 30 runs: hub/, scene/, 404 and index.html in all six themes x FR/EN/AR at
 * 1280x900, plus a 390x844 touch pass. Each run scrolls the whole page, then
 * checks: layout shift (CLS > 0.01), LCP, axe (all default rules), horizontal
 * overflow (honouring clipping ancestors), reveals that never fired, tap
 * targets under 24px, broken images, infinite animations, JS errors, failed
 * requests and any third-party request.
 *
 * Two checks are deliberately WCAG-exact rather than naive, because the naive
 * versions produced confident false failures:
 *  - tap targets apply the 2.5.8 spacing exception: under 24px fails only if
 *    its 24px clear zone collides with another target's
 *  - "unrevealed" skips display:none (the Engineering-only terminal) and waits
 *    1.8s, since reveals run 1s plus a stagger delay
 */
import {chromium} from 'playwright';
import {readFileSync} from 'node:fs';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {join,extname} from 'node:path';
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.json':'application/json','.ico':'image/x-icon','.pdf':'application/pdf','.txt':'text/plain'};
const srv=createServer(async(q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';try{const b=await readFile(join(process.cwd(),p));r.writeHead(200,{'content-type':T[extname(p)]||'application/octet-stream'});r.end(b)}catch{r.writeHead(404);r.end()}}).listen(0);
await new Promise(r=>srv.on('listening',r));
const B='http://127.0.0.1:'+srv.address().port;
const AXE=readFileSync('node_modules/axe-core/axe.min.js','utf8');
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
let fails=0;const rows=[];
const run=async(label,path,{theme,lang,w=1280,h=900}={})=>{
  const p=await b.newPage({viewport:{width:w,height:h},hasTouch:w<600,isMobile:w<600});
  const errs=[],bad=[];
  p.on('pageerror',e=>errs.push(String(e).slice(0,80)));
  p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,80))});
  p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url().replace(B,''))});
  p.on('requestfailed',r=>bad.push('FAIL '+r.url().replace(B,'')));
  await p.addInitScript(([t,l])=>{if(t)localStorage.setItem('numidea-theme',t);if(l)localStorage.setItem('numidea-lang',l);
    window.__cls=0;window.__lcp=0;
    new PerformanceObserver(x=>{for(const e of x.getEntries())if(!e.hadRecentInput)window.__cls+=e.value}).observe({type:'layout-shift',buffered:true});
    new PerformanceObserver(x=>{for(const e of x.getEntries())window.__lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});},[theme,lang]);
  await p.goto(B+path,{waitUntil:'networkidle'});
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
  const ax=await p.evaluate(async()=>(await axe.run(document,{resultTypes:['violations']})).violations.map(v=>v.id+'('+v.nodes.length+')'));
  const third=await p.evaluate(o=>performance.getEntriesByType('resource').filter(r=>!r.name.startsWith(o)).length,B);
  const issues=[];
  if(m.cls>0.01)issues.push('cls');if(ax.length)issues.push('axe');if(m.of.length||m.hscroll)issues.push('overflow');
  if(anim)issues.push('anim');if(errs.length)issues.push('js');if(bad.length)issues.push('net');if(third)issues.push('3p');
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
for(const [n,path] of [['hub','/hub/index.html'],['scene','/scene/index.html'],['404','/404.html']]) await run(n,path);
for(const t of ['arcanum','noir','daylight','mono','altneon','engineering'])
  for(const l of ['fr','en','ar']) await run(`index ${t}/${l}`,'/index.html',{theme:t,lang:l});
console.log('— mobile 390×844 —');
for(const [n,path] of [['hub','/hub/index.html'],['scene','/scene/index.html'],['404','/404.html']]) await run(n+' m',path,{w:390,h:844});
for(const t of ['arcanum','daylight','engineering'])
  for(const l of ['fr','ar']) await run(`index ${t}/${l} m`,'/index.html',{theme:t,lang:l,w:390,h:844});
await b.close();srv.close();
console.log(fails?`\nFAILURES: ${fails} of ${rows.length}`:`\nALL CLEAN (${rows.length} runs)`);
process.exit(fails?1:0);
