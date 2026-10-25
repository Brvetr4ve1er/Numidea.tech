#!/usr/bin/env node
/**
 * Browser audit — `npm run audit`. Self-hosting; exits non-zero on any failure.
 *
 * 64 runs over every page (site.mjs PAGES): index.html in all six themes x
 * FR/EN/AR at 1280x900 and all six x FR/AR on a 390x844 phone; scene/ in each
 * language on desktop and phone; 404 in two themes in Arabic; hub/ in both of
 * its palettes; tablet (768x1024, 1024x768) and short landscape (844x390);
 * one run with the phone menu open and two with the CV panel open (axe reads
 * what it shows); the three WorkspaceHQ embeds on their own, and one run that
 * lets the trailer and the walkthrough load and play and boots the live
 * console; the legal preview when it exists. Each run scrolls the whole page,
 * then checks: layout shift (CLS > 0.01), axe (all default rules),
 * horizontal overflow (honouring clipping ancestors), reveals that never
 * fired, tap targets under 24px, broken images, infinite animations, JS
 * errors, failed requests, any third-party request, and every
 * Content-Security-Policy violation (securitypolicyviolation events, counted
 * in every frame). Desktop page runs fail when LCP, read at load before
 * anything is touched, is over 1.5 s.
 *
 * Then 404.html two folders down, where a relative link would resolve
 * against the missing folder (the local server answers a missing URL with
 * 404.html, as the hosts do): here, and on an emulated GitHub Pages under its
 * repository subpath with JavaScript on and off (the published 404.html, as
 * scripts/lib/stage-404.mjs stages it). Its three stylesheets must come from
 * the site root, nothing may be requested under the missing folder, every
 * link must lead to the site root, and the theme's tokens must apply.
 *
 * Then a throttled phone: index.html in French and in Arabic on Lighthouse's
 * mobile profile (412x823 at 1.75x, CPU 4x, Slow 4G as DevTools applies it:
 * 562.5 ms per request, 1.44 Mbit/s down), cold cache. Its targets: LCP at
 * most 2.5 s, the long tasks of the load adding up to at most 300 ms, and the
 * slowest scripted interaction (menu open and close, FAQ, estimator slider,
 * currency, language switch) at most 200 ms from input to the next paint,
 * read from the Event Timing API (the INP proxy). The local server gzips text
 * the way the hosts do, so transfer times match.
 *
 * The home page does not meet those targets yet (measured 2026-10-24 and 25
 * on a 4-CPU machine: LCP 2.8-3.7 s, long tasks 1.3-3.6 s, language switch
 * 0.4-0.9 s; RELEASE.md quotes the same), so they are REPORT-ONLY by default: printed on every run, listed
 * as warnings at the end, and not failing. AUDIT_PHONE_STRICT=1 makes them
 * fail, for the performance pass that brings the page under them (critical
 * CSS, later fonts, a cheaper language switch) and for CI once it has. What
 * fails those two runs in every mode: an interaction that did not do its job
 * (its timing would mean nothing), a JS error, a failed request and any CSP
 * violation, since these runs are the CSP proof for the language switch, the
 * estimator and the currency switch.
 *
 * Timing budgets that fail are measured again once: this machine and the CI
 * runners are shared, so a timing failure counts only when the second
 * measurement fails as well. Both measurements are printed.
 *
 * Two checks are deliberately WCAG-exact rather than naive, because the naive
 * versions produced confident false failures:
 *  - tap targets apply the 2.5.8 spacing exception: under 24px fails only if
 *    its 24px clear zone collides with another target's
 *  - "unrevealed" skips display:none and waits 1.8s, since reveals run 1s
 *    plus a stagger delay
 * axe "incomplete" results (things axe could not decide, e.g. an unresolved
 * aria-labelledby) are printed as warnings: they need a look, not a failure.
 *
 *   AUDIT_BASE=<url>    audit a deployed copy instead of this checkout, e.g.
 *                       AUDIT_BASE=https://brvetr4ve1er.github.io/Numidea.tech
 *                       (the legal preview, which is never deployed, is skipped)
 *   AUDIT_ONLY=<regex>  only the runs whose label matches, e.g. to measure one
 *                       timing failure again alone: AUDIT_ONLY='^throttled'
 *   AUDIT_PHONE_STRICT=1  the throttled phone's timing targets fail the run
 *                       instead of warning (see above)
 */
import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {serve,launch} from './lib/serve.mjs';
import {watchCsp} from './lib/csp-watch.mjs';
import {deployFiles} from './lib/deploy-files.mjs';
import {stage404} from './lib/stage-404.mjs';
import {ROOT,BASE,THEMES,LEGAL_PUBLISHED} from './site.mjs';
const REMOTE=(process.env.AUDIT_BASE||'').trim().replace(/\/+$/,'');
const ONLY=process.env.AUDIT_ONLY?new RegExp(process.env.AUDIT_ONLY):null;
// a missing URL gets 404.html with status 404, as on every host
const srv=REMOTE?null:await serve(ROOT,{compress:true,fallback404:true});
const B=REMOTE||srv.base;
const AXE=readFileSync(join(ROOT,'node_modules/axe-core/axe.min.js'),'utf8');
const b=await launch();
const DESKTOP_LCP=1500;
const PHONE={lcp:2500,lt:300,inp:200};
const PHONE_STRICT=process.env.AUDIT_PHONE_STRICT==='1';
const TIMING=new Set(['lcp','lt','inp']);
let fails=0;const rows=[],warnings=[],phoneWarn=[];
const short=u=>u.replace(B,'').split(/[?#]/)[0]||'/';

/* The live console's template (embed/console.html, as the design tool exports
   it) holds SVG attributes like points="{{ t.pts }}" that its runtime fills
   in; Chrome's parser logs each one as an error before it does. They are
   known and harmless, so they are waived, for that file and that message
   only, and counted on the row. */
const WAIVED=[[/\/workspacehq\/embed\/console\.html$/,/^Error: <\w+> attribute [\w:-]+: Expected (number|length), "\{\{/]];

/* Listeners shared by every run: JS errors, failed requests and CSP
   violations, the last from every frame (lib/csp-watch.mjs, which keys.mjs
   shares: keys holds the CSP proof for the lightbox, the viewer and the
   form, which only it drives). w.off is set before the harness
   injects axe, which is not the page: its CSSOM preload fetches a
   stylesheet's @import against the document instead of the sheet (the
   console's design-system tokens came back 404 that way). */
const watch=async p=>{
  const w={errs:[],bad:[],csp:[],waived:0,off:false};
  p.on('pageerror',e=>{if(!w.off)w.errs.push(String(e).slice(0,80))});
  p.on('console',m=>{if(w.off||m.type()!=='error')return;
    const at=(m.location().url||'').split(/[?#]/)[0],t=m.text();
    if(WAIVED.some(([f,r])=>f.test(at)&&r.test(t))){w.waived++;return}
    w.errs.push(t.slice(0,80))});
  p.on('response',r=>{if(!w.off&&r.status()>=400)w.bad.push(r.status()+' '+short(r.url()))});
  p.on('requestfailed',r=>{if(!w.off)w.bad.push('FAIL '+short(r.url()))});
  await watchCsp(p,(u,v)=>{if(!w.off)w.csp.push(short(u)+': '+v)});
  return w;
};

const run=async(label,path,o={})=>{
  if(ONLY&&!ONLY.test(label))return;
  const {theme,lang,w=1280,h=900,allowLoops=false,touch=w<600,init={},click=null,act=null,lcpBudget=0,axeOff=[],again=false}=o;
  const p=await b.newPage({viewport:{width:w,height:h},hasTouch:touch,isMobile:touch});
  const W=await watch(p);
  await p.addInitScript(([t,l,init])=>{if(t)localStorage.setItem('numidea-theme',t);if(l)localStorage.setItem('numidea-lang',l);for(const k in init)localStorage.setItem(k,init[k]);
    window.__cls=0;window.__lcp=0;
    new PerformanceObserver(x=>{for(const e of x.getEntries())if(!e.hadRecentInput)window.__cls+=e.value}).observe({type:'layout-shift',buffered:true});
    new PerformanceObserver(x=>{for(const e of x.getEntries())window.__lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});},[theme,lang,init]);
  await p.goto(B+path,{waitUntil:'networkidle'});
  // LCP at load, before a click or the scroll below can add a candidate
  const lcp=await p.evaluate(()=>window.__lcp);
  if(click){await p.click(click);await p.waitForTimeout(500);}
  // a control the act needs that is missing (an older deploy, a renamed id) is a failure, not a crash
  const broke=act?await act(p).catch(e=>['stopped: '+e.message.split('\n')[0].slice(0,120)]):[];
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
    return {cls:window.__cls,of:[...new Set(of)],hidden,small,imgs,hscroll:document.documentElement.scrollWidth>dw+1};});
  const anim=await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getComputedTiming().iterations===Infinity).length);
  W.off=true;
  // axe in every frame too, so it reads the embeds in their host page
  for(const f of p.frames())try{await f.evaluate(AXE)}catch{/* detached */}
  const axr=await p.evaluate(async off=>{const r=await axe.run(document,{resultTypes:['violations','incomplete'],rules:Object.fromEntries(off.map(k=>[k,{enabled:false}]))});
    return {v:r.violations.map(v=>v.id+'('+v.nodes.length+')'),i:r.incomplete.filter(v=>v.id!=='color-contrast').map(v=>v.id+'('+v.nodes.length+')')}},axeOff);
  const ax=axr.v;if(axr.i.length)warnings.push(label+': '+axr.i.join(', '));
  const third=await p.evaluate(o=>performance.getEntriesByType('resource').filter(r=>!r.name.startsWith(o)).length,B);
  const {errs,bad,csp,waived}=W;
  const issues=[];
  if(m.cls>0.01)issues.push('cls');if(ax.length)issues.push('axe');if(m.of.length||m.hscroll)issues.push('overflow');
  if(anim&&!allowLoops)issues.push('anim');if(errs.length)issues.push('js');if(bad.length)issues.push('net');if(third)issues.push('3p');
  if(m.hidden)issues.push('unrevealed');if(m.imgs)issues.push('img');if(m.small)issues.push('tap');
  if(csp.length)issues.push('csp');if(broke.length)issues.push('act');
  if(lcpBudget&&!(lcp>0&&lcp<=lcpBudget))issues.push('lcp');
  const line=`cls ${m.cls.toFixed(4)}  lcp ${Math.round(lcp)}ms${lcpBudget?'/'+lcpBudget:''}  axe ${ax.join(',')||0}  of ${m.of.length+(m.hscroll?'+H':'')}  unrev ${m.hidden}  tap<24 ${m.small}  img ${m.imgs}  anim ${anim}  js ${errs.length}${waived?' (+'+waived+' waived)':''}  net ${bad.length}  3p ${third}  csp ${csp.length}`;
  await p.close();
  if(issues.length&&issues.every(i=>TIMING.has(i))&&!again){
    console.log('  ?? '+label.padEnd(26),line,' — over budget, measuring again');
    return run(label,path,{...o,again:true});
  }
  if(issues.length)fails++;
  rows.push({label,lcp,...m,anim,ax,errs,bad,third,csp,issues});
  console.log((issues.length?'FAIL ':'  ok ')+label.padEnd(26),line);
  if(errs.length)console.log('       js:',errs.join(' | '));
  if(bad.length)console.log('      net:',bad.join(' | '));
  if(csp.length)console.log('      csp:',csp.join(' | '));
  if(broke.length)console.log('      act:',broke.join(' | '));
  if(m.of.length)console.log('       of:',m.of.join(' | '));
};

/* ---------------- what some runs do before the scroll ---------------- */
// the résumé panel open, so axe reads the content it reveals
const openCv=async p=>{
  await p.click('#cv-toggle');await p.waitForTimeout(800);
  return p.evaluate(()=>{const b=document.querySelector('#cv-toggle'),c=document.querySelector('#cv-panel');
    return b.getAttribute('aria-expanded')==='true'&&!c.inert&&c.getBoundingClientRect().height>100?[]:['the CV panel did not open']});
};
// WorkspaceHQ: the trailer and the walkthrough load (they are lazy) and play,
// then the live console boots; every frame's errors and CSP violations count
const bootConsole=async p=>{
  const broke=[];
  const playheads=()=>p.evaluate(()=>{const o={};for(const k of Object.keys(localStorage)){const m=/^animstage-v3:.*\/(\w+)\.html:t$/.exec(k);if(m)o[m[1]]=parseFloat(localStorage.getItem(k))}return o});
  for(const [sel,name] of [['#reel iframe','trailer'],['#walkFrame','walkthrough']]){
    const el=p.locator(sel);await el.scrollIntoViewIfNeeded();
    try{const f=await (await el.elementHandle()).contentFrame();
      await f.waitForLoadState('load',{timeout:30000});
      await f.waitForSelector('[data-om-exportable-video-with-duration-secs]',{timeout:20000});
    }catch{broke.push('the '+name+' did not load')}
  }
  const t0=await playheads();await p.waitForTimeout(2500);const t1=await playheads();
  for(const n of ['trailer','walkthrough'])if(!(t1[n]>(t0[n]||0)))broke.push(`the ${n} did not play (${t0[n]} → ${t1[n]})`);
  await p.locator('#bootDemo').scrollIntoViewIfNeeded();
  await p.click('#bootDemo');
  try{const f=await (await p.waitForSelector('#demoStage iframe',{timeout:5000})).contentFrame();
    await f.waitForLoadState('load',{timeout:30000});
    // booted = the runtime replaced the template: the prompt bar is there and no {{ }} is left on screen
    await f.waitForFunction(()=>/workspace-hq/.test(document.body.innerText)&&!/\{\{/.test(document.body.innerText),null,{timeout:20000});
  }catch{broke.push('the console did not boot')}
  await p.waitForTimeout(3000);
  return broke;
};

/* ---------------- 404 at a nested missing URL ----------------
   The hosts answer a missing URL at any depth with 404.html, so its links
   must come from the site root: the head script writes them so (the
   repository subpath on *.github.io, "/" elsewhere), and staging points the
   JavaScript-off copy and the home links there (lib/stage-404.mjs). At
   /404.html, where the runs above open it, a relative link and a root one
   land on the same file, so these runs open it two folders down: here (this
   server answers with 404.html, as the hosts do) and on an emulated GitHub
   Pages under its repository subpath (BASE's host routed to this checkout:
   the published files, the staged 404.html with status 404 for anything
   else), with JavaScript on and off. Each must load the three stylesheets
   from <root>assets/, request nothing under the missing folder, have every
   link lead to <root>, and paint with the theme's tokens. The page's own
   404 is the one failed request expected. */
const PUBLISHED=new Set(deployFiles());
const pagesRoot=new URL(BASE).pathname;
const nested404=async(label,{site,path,js=true,theme,lang})=>{
  if(ONLY&&!ONLY.test(label))return;
  const emulate=site.startsWith(BASE);
  const ctx=await b.newContext({viewport:{width:1280,height:900},javaScriptEnabled:js});
  if(emulate){
    const staged=stage404(readFileSync(join(ROOT,'404.html'),'utf8'),pagesRoot);
    await ctx.route(()=>true,r=>{
      const u=new URL(r.request().url());
      if(u.origin!==new URL(BASE).origin)return r.abort();
      if(!u.pathname.startsWith(pagesRoot))return r.fulfill({status:404,body:''});
      let rel=decodeURIComponent(u.pathname.slice(pagesRoot.length));
      if(rel===''||rel.endsWith('/'))rel+='index.html';
      return PUBLISHED.has(rel)?r.fulfill({status:200,path:join(ROOT,rel)}):r.fulfill({status:404,contentType:'text/html',body:staged});
    });
  }
  const p=await ctx.newPage();
  const W=await watch(p);
  const reqs=[];p.on('request',r=>reqs.push(r.url()));
  if(theme||lang)await p.addInitScript(([t,l])=>{if(t)localStorage.setItem('numidea-theme',t);if(l)localStorage.setItem('numidea-lang',l)},[theme,lang]);
  const doc=site+path;
  await p.goto(doc,{waitUntil:'networkidle'});
  const m=await p.evaluate(()=>({sheets:[...document.styleSheets].map(s=>s.href).filter(Boolean),links:[...document.querySelectorAll('a[href]')].map(a=>a.href),
    ice:getComputedStyle(document.documentElement).getPropertyValue('--ice').trim(),font:getComputedStyle(document.querySelector('.mark')).fontFamily}));
  await ctx.close();
  const root=site;   // each run's site is its root
  const folder=new URL('.',doc).href;
  const issues=[],act=[];
  if(m.sheets.length!==3||m.sheets.some(h=>!h.startsWith(root+'assets/')))act.push('stylesheets '+JSON.stringify(m.sheets.map(h=>h.replace(/\?.*/,''))));
  const under=reqs.filter(u=>u.startsWith(folder)&&u.split(/[?#]/)[0]!==doc.split(/[?#]/)[0]);
  if(under.length)act.push('requested under the missing folder: '+[...new Set(under.map(u=>u.replace(folder,'')))].join(', '));
  const off=m.links.filter(h=>h!==root);if(off.length||!m.links.length)act.push('links '+JSON.stringify(m.links));
  if(!m.ice)act.push('no theme tokens (unstyled; .mark in '+m.font+')');
  // the document's own 404 is expected; any other failed request is not (and
  // the console line each 404 adds is already counted as a request)
  const bad=W.bad.filter(x=>x!=='404 '+short(doc));
  const errs=W.errs.filter(t=>!/^Failed to load resource: the server responded with a status of 404/.test(t));
  if(act.length)issues.push('act');if(bad.length)issues.push('net');if(errs.length)issues.push('js');if(W.csp.length)issues.push('csp');
  if(issues.length)fails++;
  rows.push({label,issues});
  console.log((issues.length?'FAIL ':'  ok ')+label.padEnd(26),`root ${root.replace(/^https?:\/\/[^/]+/,'')}  sheets ${m.sheets.length}  links ${m.links.length}  requests under the folder ${under.length}  js ${errs.length}  net ${bad.length}  csp ${js?W.csp.length:'n/a (no JS)'}`);
  if(act.length)console.log('      act:',act.join(' | '));
  if(bad.length)console.log('      net:',bad.join(' | '));
  if(errs.length)console.log('       js:',errs.join(' | '));
  if(W.csp.length)console.log('      csp:',W.csp.join(' | '));
};

/* ---------------- the throttled phone ---------------- */
// Lighthouse's mobile emulation and its DevTools-applied "Slow 4G"
const SLOW4G={offline:false,latency:562.5,downloadThroughput:1474.56*1024/8,uploadThroughput:675*1024/8};
const phone=async(label,path,{lang,to},again=false)=>{
  if(ONLY&&!ONLY.test(label))return;
  const ctx=await b.newContext({viewport:{width:412,height:823},deviceScaleFactor:1.75,isMobile:true,hasTouch:true});
  const p=await ctx.newPage();
  const W=await watch(p);
  const cdp=await ctx.newCDPSession(p);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions',SLOW4G);
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  await p.addInitScript(l=>{localStorage.setItem('numidea-lang',l);window.__lcp=0;window.__lt=[];window.__ev=[];
    new PerformanceObserver(x=>{for(const e of x.getEntries())window.__lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});
    new PerformanceObserver(x=>{for(const e of x.getEntries())window.__lt.push(e.duration)}).observe({type:'longtask',buffered:true});
    new PerformanceObserver(x=>{for(const e of x.getEntries())if(e.interactionId)window.__ev.push([e.startTime,e.duration,e.name])}).observe({type:'event',durationThreshold:16,buffered:true});},lang);
  await p.goto(B+path,{waitUntil:'networkidle',timeout:120000});
  await p.waitForTimeout(1000);
  const load=await p.evaluate(()=>({lcp:window.__lcp,lt:window.__lt.reduce((a,d)=>a+d,0),n:window.__lt.length,max:Math.max(0,...window.__lt)}));
  // each interaction: input to next paint, the slowest event of the
  // interactions that started after it began; and it must have done its job
  // (done() is a function, not a string to eval: eval would be the harness's
  // own CSP violation on a page without 'unsafe-eval')
  const acts=[];
  const time=async(name,go,done,arg)=>{
    const t0=await p.evaluate(()=>performance.now());
    await go();await p.waitForTimeout(1200);
    const d=await p.evaluate(t0=>Math.max(0,...window.__ev.filter(e=>e[0]>=t0).map(e=>e[1])),t0);
    acts.push({name,d,ok:await p.evaluate(done,arg)});
  };
  const settle=async sel=>{await p.locator(sel).first().scrollIntoViewIfNeeded();await p.waitForTimeout(1500)};
  const menuOpen=()=>document.querySelector('.mobile-menu').classList.contains('open');
  try{
    await time('menu open',()=>p.tap('.menu-toggle'),menuOpen);
    await time('menu close',()=>p.tap('.mobile-menu .close'),()=>!document.querySelector('.mobile-menu').classList.contains('open'));
    await settle('.faq-item summary');
    await time('FAQ',()=>p.locator('.faq-item summary').first().tap(),()=>document.querySelector('.faq-item').open);
    await settle('#est-size');
    const v0=await p.inputValue('#est-size');
    await time('estimator',async()=>{const r=await p.locator('#est-size').boundingBox();await p.touchscreen.tap(r.x+r.width*0.8,r.y+r.height/2)},
      v0=>document.querySelector('#est-size').value!==v0,v0);
    await settle('.pr-cur');
    await time('currency',()=>p.tap('.pr-cur label.echip:has(input[value="EUR"])'),()=>document.querySelector('.pr-cur input[value="EUR"]').checked);
    await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(800);
    await p.tap('.menu-toggle');await p.waitForTimeout(1000);
    await time('language',()=>p.tap(`.mobile-menu .lang button[data-lang="${to}"]`),to=>document.documentElement.lang===to,to);
  }catch(e){acts.push({name:'stopped: '+e.message.split('\n')[0].slice(0,120),d:0,ok:false})}
  await ctx.close();
  const worst=acts.reduce((a,x)=>x.d>a.d?x:a,{d:0,name:'-'});
  // over a timing target: a failure under AUDIT_PHONE_STRICT=1, a warning otherwise
  const ms=d=>d?Math.round(d)+'':'<16';
  const over=[];
  if(load.lcp>PHONE.lcp)over.push(['lcp',`LCP ${Math.round(load.lcp)} ms > ${PHONE.lcp}`]);
  if(load.lt>PHONE.lt)over.push(['lt',`long tasks ${Math.round(load.lt)} ms > ${PHONE.lt}`]);
  if(worst.d>PHONE.inp)over.push(['inp',`${worst.name} ${ms(worst.d)} ms > ${PHONE.inp}`]);
  const issues=PHONE_STRICT?over.map(x=>x[0]):[];
  // failing in every mode: no LCP at all, an interaction that did nothing, JS errors, failed requests, CSP
  if(!(load.lcp>0))issues.push('no lcp');
  const dead=acts.filter(x=>!x.ok).map(x=>x.name);if(dead.length)issues.push('act');
  const {errs,bad,csp}=W;if(errs.length)issues.push('js');if(bad.length)issues.push('net');if(csp.length)issues.push('csp');
  const line=`lcp ${Math.round(load.lcp)}ms/${PHONE.lcp}  long tasks ${Math.round(load.lt)}ms/${PHONE.lt} (${load.n}, longest ${Math.round(load.max)})  slowest interaction ${ms(worst.d)}ms/${PHONE.inp} (${worst.name})  js ${errs.length}  net ${bad.length}  csp ${csp.length}`;
  const detail='       interactions: '+acts.map(x=>`${x.name} ${ms(x.d)}${x.ok?'':' (did nothing)'}`).join(', ');
  if(issues.length&&issues.every(i=>TIMING.has(i))&&!again){
    console.log('  ?? '+label.padEnd(26),line,' — over budget, measuring again');console.log(detail);
    return phone(label,path,{lang,to},true);
  }
  if(issues.length)fails++;
  else if(over.length)phoneWarn.push(label+': '+over.map(x=>x[1]).join(', '));
  rows.push({label,...load,acts,issues});
  console.log((issues.length?'FAIL ':over.length?'warn ':'  ok ')+label.padEnd(26),line);console.log(detail);
  if(errs.length)console.log('       js:',errs.join(' | '));
  if(bad.length)console.log('      net:',bad.join(' | '));
  if(csp.length)console.log('      csp:',csp.join(' | '));
};

console.log(REMOTE?`auditing ${REMOTE} (remote: the never-deployed legal preview is skipped)`:'auditing this checkout');
console.log('— desktop 1280×900 —');
const D={lcpBudget:DESKTOP_LCP};
await run('hub','/hub/index.html',D);
for(const l of ['fr','en','ar']) await run('scene '+l,'/scene/index.html',{...D,lang:l});
await run('404','/404.html',D);
await run('404 noir/ar','/404.html',{...D,theme:'noir',lang:'ar'});
// WorkspaceHQ is a different product with its own arcade identity: blinking
// INSERT COIN, the glitching headline and the marquee ARE the design, so the
// no-endless-loop rule is waived there (its loops pause when off screen).
await run('workspacehq','/workspacehq/index.html',{...D,allowLoops:true});
await run('workspacehq console booted','/workspacehq/index.html',{allowLoops:true,act:bootConsole});
// The embeds on their own. They are documents for workspacehq/'s frames, not
// landing pages: no LCP budget, and no landmark rule ('region'), since their
// landmark is the host page's <main>; axe reads them there, with that rule,
// in the runs above.
for(const e of ['trailer','walkthrough','console']) await run('embed '+e,`/workspacehq/embed/${e}.html`,{allowLoops:true,axeOff:['region']});
if(!REMOTE&&existsSync(join(ROOT,'legal-preview/index.html'))) await run('legal preview','/legal-preview/index.html',D);
if(LEGAL_PUBLISHED) await run('legal','/legal/index.html',D);
for(const t of THEMES)
  for(const l of ['fr','en','ar']) await run(`index ${t}/${l}`,'/index.html',{...D,theme:t,lang:l});
await run('index cv open fr','/index.html',{lang:'fr',act:openCv});
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
await run('index cv open ar m','/index.html',{lang:'ar',w:390,h:844,act:openCv});
console.log('— tablet and landscape —');
await run('index arcanum/fr 768','/index.html',{theme:'arcanum',lang:'fr',w:768,h:1024,touch:true});
await run('index daylight/ar 768','/index.html',{theme:'daylight',lang:'ar',w:768,h:1024,touch:true});
await run('index noir/fr 1024','/index.html',{theme:'noir',lang:'fr',w:1024,h:768,touch:true});
await run('index arcanum/ar 1024','/index.html',{theme:'arcanum',lang:'ar',w:1024,h:768,touch:true});
await run('index arcanum/fr 844×390','/index.html',{theme:'arcanum',lang:'fr',w:844,h:390,touch:true});
await run('index arcanum/ar 844×390','/index.html',{theme:'arcanum',lang:'ar',w:844,h:390,touch:true});
await run('404 844×390','/404.html',{w:844,h:390,touch:true});
console.log('— 404 two folders down —');
await nested404('404 nested noir/ar',{site:B+'/',path:'a/b/missing?lang=ar',theme:'noir'});
if(!REMOTE){
  await nested404('404 pages nested fr',{site:BASE,path:'a/b/missing?lang=fr'});
  await nested404('404 pages nested no-JS',{site:BASE,path:'a/b/c/nope.html',js:false});
}
console.log(`— throttled phone: 412×823, CPU 4×, Slow 4G, cold cache (timing targets ${PHONE_STRICT?'strict':'report-only'}) —`);
await phone('throttled index fr','/index.html',{lang:'fr',to:'ar'});
await phone('throttled index ar','/index.html',{lang:'ar',to:'fr'});
await b.close();srv?.close();
if(warnings.length){console.log('\naxe incomplete (review, not failing):');for(const w of warnings)console.log('  '+w)}
if(phoneWarn.length){console.log('\nthrottled phone over its targets (report-only; AUDIT_PHONE_STRICT=1 fails on them):');for(const w of phoneWarn)console.log('  '+w)}
if(!rows.length){console.log(`\nno run matched AUDIT_ONLY=${process.env.AUDIT_ONLY}`);process.exit(1)}
console.log(fails?`\nFAILURES: ${fails} of ${rows.length}`:`\nALL CLEAN (${rows.length} runs${phoneWarn.length?`; ${phoneWarn.length} over the throttled phone's report-only targets`:''})`);
process.exit(fails?1:0);
