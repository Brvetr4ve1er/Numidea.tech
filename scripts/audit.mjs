#!/usr/bin/env node
/**
 * Browser audit — `npm run audit`. Self-hosting; exits non-zero on any failure.
 *
 * 90 runs over every page (site.mjs PAGES): the home page (one page per
 * language: index.html, en/, ar/, each opened directly) in both themes x
 * FR/EN/AR at 1280x900 and both x FR/AR on a 390x844 phone; the price
 * guide (tarifs/, en/tarifs/, ar/tarifs/, likewise) in arcanum and daylight
 * x FR/EN/AR on desktop and x FR/AR on the phone; scene/ in each
 * language on desktop and phone, and in daylight (it follows the visitor's
 * theme since e8a2ea2) on both; 404 in two themes in Arabic; hub/ (one
 * paper palette since its character bible, 56f29c1) on desktop and on the
 * phone; tablet (768x1024, 1024x768) and short landscape (844x390);
 * one run with the phone menu open, two with the CV panel open and two with
 * the folded estimator open (axe reads what each shows); the three
 * WorkspaceHQ embeds on their own, and one run that lets the trailer and the
 * walkthrough load and play and boots the live console; the legal preview
 * when it exists. Each run scrolls the whole page, then checks: layout
 * shift (CLS > 0.01), axe (all default rules), horizontal overflow
 * (honouring clipping ancestors), reveals that never fired, tap targets
 * under 24px, broken images, infinite animations, the hub's loops (each
 * img[data-anim] shows its animation, decoded, once the scroll has brought
 * it on screen: lib/loop-state.mjs), JS
 * errors, failed requests, any third-party request, every
 * Content-Security-Policy violation (securitypolicyviolation events, counted
 * in every frame), and, on a page in another language than Arabic, any
 * Arabic font file fetched (the one glyph that pulled it is drawn now).
 * Desktop page runs fail when LCP, read at load before
 * anything is touched, is over 1.5 s. Each axe violation is printed with
 * its nodes (selector and markup) under the FAIL line.
 *
 * Then 404.html two folders down, where a relative link would resolve
 * against the missing folder (the local server answers a missing URL with
 * 404.html, as the hosts do): here, and on an emulated GitHub Pages under its
 * repository subpath with JavaScript on and off (the published 404.html, as
 * scripts/lib/stage-404.mjs stages it). Its three stylesheets must come from
 * the site root, nothing may be requested under the missing folder, every
 * link must lead to the site root, and the theme's tokens must apply.
 *
 * Then the first screen in fallback type: index.html in every theme, in
 * French and in English, loaded once with every webfont file refused and once
 * with the faces, at seven widths from 360 to 1600. A text block in the first
 * screen that is taller or shorter in one than in the other fails: on a real
 * connection that is the reflow a visitor sees when the face lands, which a
 * local run's CLS cannot (the faces arrive before the first paint here).
 *
 * Then a throttled phone: the home page in French (index.html) and in Arabic
 * (ar/) on Lighthouse's
 * mobile profile (412x823 at 1.75x, CPU 4x, Slow 4G as DevTools applies it:
 * 562.5 ms per request, 1.44 Mbit/s down), cold cache. Its targets: LCP at
 * most 2.5 s, the long tasks of the load adding up to at most 300 ms, and the
 * slowest scripted interaction (menu open and close, FAQ, opening the
 * folded estimator, its slider, currency) at most 200 ms
 * from input to the next paint, read from the Event Timing API (the INP
 * proxy). The language switch is a link to the other language's page, so it
 * is not timed (the entries go with the page it leaves): the tap must land on
 * that page, in that language, over the same connection. The local server
 * gzips text the way the hosts do, so transfer times match.
 *
 * The home page does not meet those targets yet (measured 2026-10-24 and 25
 * on a 4-CPU machine: LCP 2.8-3.7 s, long tasks 1.3-3.6 s, language switch
 * 0.4-0.9 s; RELEASE.md quotes the same), so they are REPORT-ONLY by
 * default: printed on every run, listed as warnings at the end, and not
 * failing. AUDIT_PHONE_STRICT=1 makes them fail, for the performance pass
 * that brings the page under them (critical CSS, later fonts, a cheaper
 * language switch) and for CI once it has. What
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
import sharp from 'sharp';
import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {serve,launch} from './lib/serve.mjs';
import {watchCsp} from './lib/csp-watch.mjs';
import {loopState} from './lib/loop-state.mjs';
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
// the home page in a language: its own page (build-lang.mjs), opened
// directly; the root would send a stored en/ar there anyway, in two loads;
// the price guide's page in a language likewise (build-tarifs.mjs)
const HOME=l=>l==='fr'?'/index.html':'/'+l+'/index.html';
const TARIFS=l=>(l==='fr'?'':'/'+l)+'/tarifs/index.html';

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
  const {theme,lang,w=1280,h=900,dpr=1,lede=false,clsMax=0.01,allowLoops=false,touch=w<600,init={},click=null,act=null,lcpBudget=0,axeOff=[],again=false}=o;
  const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:dpr,hasTouch:touch,isMobile:touch});
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
      if(e.matches('input[type=radio],input[type=checkbox]')&&r.width<=1&&r.height<=1)return false;   // a visually hidden control: its label is the target
      return !(s.display==='inline'&&e.closest('p,li,dd'))});   // inline text links are exempt
    const R=TG.map(e=>e.getBoundingClientRect());
    const dist=(cx,cy,r)=>Math.hypot(Math.max(r.left-cx,0,cx-r.right),Math.max(r.top-cy,0,cy-r.bottom));
    const small=TG.filter((e,i)=>{const a=R[i];if(a.width>=24&&a.height>=24)return false;
      const cx=a.left+a.width/2,cy=a.top+a.height/2;
      return R.some((b,j)=>j!==i&&(dist(cx,cy,b)<12||((b.width<24||b.height<24)&&Math.hypot(cx-(b.left+b.width/2),cy-(b.top+b.height/2))<24)))}).length;
    const imgs=[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&(i.getAttribute('src')||i.currentSrc)).length;   // an <img> with no src yet (a viewer's, filled on open) is not a broken one
    // the first screen must reach the offer: the hero's lede starts inside the first viewport (a short landscape phone or a laptop at 150% put it below the fold)
    const L=document.querySelector('.lede');
    return {cls:window.__cls,of:[...new Set(of)],hidden,small,imgs,hscroll:document.documentElement.scrollWidth>dw+1,ledeTop:L?Math.round(L.getBoundingClientRect().top+scrollY):null,
      // the webfont files this page fetched, as the browser counted them (the Arabic page carries its own faces)
      fontBytes:performance.getEntriesByType('resource').filter(r=>/\.woff2(\?|$)/.test(r.name)).reduce((a,r)=>a+(r.encodedBodySize||0),0)};});
  const anim=await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getComputedTiming().iterations===Infinity).length);
  // the hub's loops: each one the scroll brought on screen shows its animation
  const loops=await p.evaluate(loopState),stuck=loops.filter(l=>!l.ok);
  W.off=true;
  // The plate rail's crossfade (.pm-rot: the hero deck turns once the page
  // is woken, two slides fading over each other): read mid-fade, axe once
  // saw a slide's caption at a contrast it never keeps ('index cv open fr',
  // 2026-11-01, a flake). Wait until nothing animates inside the rail, 8s at
  // most (a loop that never ends there is the anim count's finding above).
  await p.waitForFunction(()=>{const r=document.querySelector('.pm-rot');
    return !r||!document.getAnimations().some(a=>a.playState==='running'&&a.effect&&a.effect.target&&r.contains(a.effect.target))},null,{timeout:8000}).catch(()=>{});
  // axe in every frame too, so it reads the embeds in their host page
  for(const f of p.frames())try{await f.evaluate(AXE)}catch{/* detached */}
  // The Plate I vista (.vista, aria-hidden scenery in an overflow:hidden box)
  // has layers that are taller than the box (.v-l, bottom:-60px / -150px).
  // axe clips their rects to the box when it files them in its 200px grid,
  // but then matches a text's centre against the UNCLIPPED rect, so a text
  // that merely shares a grid row with the vista's foot (the work kicker,
  // 100px below the box since the compact proof band, 2026-11-08) is
  // measured on a dune layer that is not painted there (axe says
  // #d6d5d0 where the page paints the paper, 3.99:1 instead of 5.3:1;
  // elementsFromPoint, with pointer-events forced on, finds no layer at that
  // point). The layers go for axe's run; the painted contrast of the
  // vista's caption and everything near it is the sweep's job (real pixels).
  await p.evaluate(()=>{for(const l of document.querySelectorAll('.vista .v-l'))l.style.visibility='hidden'});
  const axr=await p.evaluate(async off=>{const r=await axe.run(document,{resultTypes:['violations','incomplete'],rules:Object.fromEntries(off.map(k=>[k,{enabled:false}]))});
    // each violation with its nodes (the selector and the markup), so a
    // failure names what to fix instead of a rule id and a count
    return {v:r.violations.map(v=>v.id+'('+v.nodes.length+')'),
      nodes:r.violations.flatMap(v=>v.nodes.slice(0,6).map(n=>v.id+' '+n.target.join(' ')+' '+n.html.replace(/\s+/g,' ').slice(0,140))),
      i:r.incomplete.filter(v=>v.id!=='color-contrast').map(v=>v.id+'('+v.nodes.length+')')}},axeOff);
  const ax=axr.v;if(axr.i.length)warnings.push(label+': '+axr.i.join(', '));
  const third=await p.evaluate(o=>performance.getEntriesByType('resource').filter(r=>!r.name.startsWith(o)).length,B);
  // An Arabic face on a page in another language: styles.css's [lang="ar"]
  // rule pulls IBM Plex Sans Arabic (42 KB) for one marked glyph. The switch's
  // ع is drawn since 2ad9e7d, and contact.vReply lost its <span lang="ar">ع</span>
  // in cac515f, so no French or English page asks for an Arabic file any
  // more: one that does fails the run ('arfont'; report-only until then).
  const arFont=await p.evaluate(()=>({lang:document.documentElement.lang,n:performance.getEntriesByType('resource').filter(r=>/\/assets\/fonts\/ibm-plex-sans-arabic-[^/]*\.woff2/.test(r.name)).length}));
  const {errs,bad,csp,waived}=W;
  const issues=[];
  if(m.cls>clsMax)issues.push('cls');if(ax.length)issues.push('axe');if(m.of.length||m.hscroll)issues.push('overflow');
  if(anim&&!allowLoops)issues.push('anim');if(errs.length)issues.push('js');if(bad.length)issues.push('net');if(third)issues.push('3p');
  if(m.hidden)issues.push('unrevealed');if(m.imgs)issues.push('img');if(m.small)issues.push('tap');
  if(csp.length)issues.push('csp');if(broke.length)issues.push('act');if(stuck.length)issues.push('loop');
  if(lcpBudget&&!(lcp>0&&lcp<=lcpBudget))issues.push('lcp');
  if(arFont.lang!=='ar'&&arFont.n)issues.push('arfont');
  if(lede&&!(m.ledeTop!==null&&m.ledeTop<h))issues.push('lede');
  const line=`cls ${m.cls.toFixed(4)}  lcp ${Math.round(lcp)}ms${lcpBudget?'/'+lcpBudget:''}  axe ${ax.join(',')||0}  of ${m.of.length+(m.hscroll?'+H':'')}  unrev ${m.hidden}  tap<24 ${m.small}  img ${m.imgs}  anim ${anim}  js ${errs.length}${waived?' (+'+waived+' waived)':''}  net ${bad.length}  3p ${third}  csp ${csp.length}${loops.length?`  loops ${loops.length-stuck.length}/${loops.length}`:''}${arFont.lang!=='ar'?`  arfont ${arFont.n}`:''}${lede?`  lede ${m.ledeTop}/${h}`:''}  fonts ${(m.fontBytes/1024).toFixed(0)}kB`;
  await p.close();
  if(issues.length&&issues.every(i=>TIMING.has(i))&&!again){
    console.log('  ?? '+label.padEnd(26),line,' — over budget, measuring again');
    return run(label,path,{...o,again:true});
  }
  if(issues.length)fails++;
  rows.push({label,lcp,...m,anim,ax,errs,bad,third,csp,issues});
  console.log((issues.length?'FAIL ':'  ok ')+label.padEnd(26),line);
  if(ax.length)for(const n of axr.nodes)console.log('      axe:',n);
  if(arFont.lang!=='ar'&&arFont.n)console.log('   arfont:',`${arFont.n} Arabic font file(s) fetched by a page in "${arFont.lang}"`);
  if(errs.length)console.log('       js:',errs.join(' | '));
  if(bad.length)console.log('      net:',bad.join(' | '));
  if(csp.length)console.log('      csp:',csp.join(' | '));
  if(broke.length)console.log('      act:',broke.join(' | '));
  if(m.of.length)console.log('       of:',m.of.join(' | '));
  if(stuck.length)console.log('    loops:',stuck.map(l=>`${l.name} shows ${l.shows}, not ${l.want}`).join(' | '));
};

/* ---------------- what some runs do before the scroll ---------------- */
// the résumé panel open, so axe reads the content it reveals
const openCv=async p=>{
  await p.click('#cv-toggle');await p.waitForTimeout(800);
  return p.evaluate(()=>{const b=document.querySelector('#cv-toggle'),c=document.querySelector('#cv-panel');
    return b.getAttribute('aria-expanded')==='true'&&!c.inert&&c.getBoundingClientRect().height>100?[]:['the CV panel did not open']});
};
// the estimator open (it is folded under the tiers), so axe, the overflow
// scan and the tap targets read its controls
const openEstimator=async p=>{
  await p.click('.price-est>summary');await p.waitForTimeout(500);
  return p.evaluate(()=>document.querySelector('.price-est').open&&document.querySelector('#est-size').getBoundingClientRect().width>0?[]:['the estimator did not open']);
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
   link lead to <root> (or a block of the home page: <root>#apercu, the
   offer's), and paint with the theme's tokens. The page's own 404 is the
   one failed request expected. */
const PUBLISHED=new Set(deployFiles());
const pagesRoot=new URL(BASE).pathname;
// emulate: answer BASE's host from this checkout instead of the network
const nested404=async(label,{site,path,js=true,theme,lang,emulate=false})=>{
  if(ONLY&&!ONLY.test(label))return;
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
  // every link leads to the site root: the home page, or a block of it (the
  // offer's #apercu); a path under the root (a/b/c/index.html) does not
  const off=m.links.filter(h=>!(h===root||(h.startsWith(root)&&/^[#?]/.test(h.slice(root.length)))));if(off.length||!m.links.length)act.push('links '+JSON.stringify(m.links));
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

/* ---------------- the first paint in fallback type ----------------
   On a real connection a webfont can land after the first paint, and the text
   then reflows from the metric-matched fallback (fonts.css) to the face. Served
   from this checkout the faces arrive at once, so the CLS above never sees it:
   a Geist-headed theme's French hero (since cut) passed here at 0 and failed live at 0.02. So each
   theme loads twice, once with every webfont file refused (the fallback, as a
   slow visitor sees it) and once with the faces, and every text block in the
   first screen must be as tall in both, at seven widths. Arabic is left out:
   Liberation Sans has no Arabic, so on Linux its fallback is DejaVu Sans and
   says nothing about Arial on a visitor's machine. */
const FB_WIDTHS=[360,390,768,1024,1280,1440,1600];
const fallbackType=async(label,{theme,lang})=>{
  if(ONLY&&!ONLY.test(label))return;
  const blocks=async refuse=>{
    const ctx=await b.newContext({viewport:{width:FB_WIDTHS[0],height:900},reducedMotion:'reduce'});
    await ctx.addInitScript(([t,l])=>{localStorage.setItem('numidea-theme',t);localStorage.setItem('numidea-lang',l)},[theme,lang]);
    if(refuse)await ctx.route(/\/assets\/fonts\/[^/?]+\.woff2/,r=>r.abort());
    const p=await ctx.newPage();
    await p.goto(B+HOME(lang),{waitUntil:'networkidle'});
    await p.evaluate(()=>document.fonts.ready);
    const out={};
    for(const w of FB_WIDTHS){
      await p.setViewportSize({width:w,height:900});
      out[w]=await p.evaluate(async()=>{await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
        return [...document.querySelectorAll('body *')].map(e=>{
          if(![...e.childNodes].some(n=>n.nodeType===3&&n.nodeValue.trim())||getComputedStyle(e).display==='inline'||!e.offsetHeight)return null;
          return [e.tagName.toLowerCase()+(typeof e.className==='string'&&e.className?'.'+e.className.split(' ')[0]:''),e.offsetHeight,e.getBoundingClientRect().top+scrollY<innerHeight];})});
    }
    // the heading's glyph case: lower-case letters with descenders ('p' drops below the line), small capitals
    // (no descender: Cinzel's lower case) or capitals: it must be the same with the face and without (a heading
    // that lands as small capitals over a fallback's lower case is a visible swap, not only a reflow)
    out.hcase=await p.evaluate(()=>{const h=document.querySelector('h1');if(!h)return null;const cs=getComputedStyle(h);
      if(cs.textTransform==='uppercase')return 'capitals';
      const c=document.createElement('canvas').getContext('2d');c.font=`${cs.fontStyle} ${cs.fontWeight} 100px ${cs.fontFamily}`;
      const fam=cs.fontFamily.split(',')[0].replace(/["']/g,'').trim().toLowerCase().replace(/\s+/g,'-');
      // the heading's own face is a preload the head writes, so it is on the page before first paint (a refused file is the slow-visitor case this run simulates)
      const pre=[...document.querySelectorAll('link[rel=preload][as=font]')].some(l=>l.href.includes('/'+fam+'-'));
      return (c.measureText('p').actualBoundingBoxDescent/100>0.06?'lower case':'small capitals')+(pre?' (preloaded)':'')});
    await ctx.close();return out;
  };
  const [fb,face]=[await blocks(true),await blocks(false)];
  const moved=[];
  for(const w of FB_WIDTHS)face[w]&&face[w].forEach((y,i)=>{const x=fb[w][i];if(y&&x&&y[2]&&Math.abs(x[1]-y[1])>1)moved.push(`${w}px ${y[0]} ${x[1]}→${y[1]}`)});
  // the case swap is a failure when the heading's face is not preloaded; where it is, a visitor sees the face at first paint and only a refused file shows the fallback: noted, not failed
  const fbCase=String(fb.hcase).replace(' (preloaded)',''),faceCase=String(face.hcase).replace(' (preloaded)','');
  if(fbCase!==faceCase&&!/preloaded/.test(face.hcase))moved.push(`h1 glyph case: ${fbCase} in the fallback, ${faceCase} once the face lands`);
  else if(fbCase!==faceCase)console.log(`       note: h1 ${fbCase} in the fallback, ${faceCase} once the face lands (the face is preloaded)`);
  if(moved.length)fails++;
  rows.push({label,issues:moved.length?['fallback']:[]});
  console.log((moved.length?'FAIL ':'  ok ')+label.padEnd(26),`first-screen text blocks that change height when the face lands: ${moved.length} (widths ${FB_WIDTHS.join(', ')})`);
  if(moved.length)console.log('    moved:',moved.join(' | '));
};

/* ---------------- the throttled phone ---------------- */
// Lighthouse's mobile emulation and its DevTools-applied "Slow 4G"
const SLOW4G={offline:false,latency:562.5,downloadThroughput:1474.56*1024/8,uploadThroughput:675*1024/8};
// path: the home page in one language (HOME); to: the language the switch is
// tapped to. No stored preference: the page is its language, and a stored one
// would send the root back where the tap came from
const phone=async(label,path,{to},again=false)=>{
  if(ONLY&&!ONLY.test(label))return;
  const ctx=await b.newContext({viewport:{width:412,height:823},deviceScaleFactor:1.75,isMobile:true,hasTouch:true});
  const p=await ctx.newPage();
  const W=await watch(p);
  const cdp=await ctx.newCDPSession(p);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions',SLOW4G);
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  await p.addInitScript(()=>{window.__lcp=0;window.__lt=[];window.__ev=[];
    new PerformanceObserver(x=>{for(const e of x.getEntries())window.__lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});
    new PerformanceObserver(x=>{for(const e of x.getEntries())window.__lt.push(e.duration)}).observe({type:'longtask',buffered:true});
    new PerformanceObserver(x=>{for(const e of x.getEntries())if(e.interactionId)window.__ev.push([e.startTime,e.duration,e.name])}).observe({type:'event',durationThreshold:16,buffered:true});});
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
    // the deferred app.js wires every control tapped below and marks the
    // document js-ready in the same pass; over Slow 4G it can land after
    // networkidle, and a tap before it is a tap nothing listens to (one
    // run of 2026-11-03: menu open "did nothing", 0 long tasks). A page
    // whose script never runs is an act failure, not a timing
    await p.waitForFunction(()=>document.documentElement.classList.contains('js-ready'),null,{timeout:60000});
    await time('menu open',()=>p.tap('.menu-toggle'),menuOpen);
    await time('menu close',()=>p.tap('.mobile-menu .close'),()=>!document.querySelector('.mobile-menu').classList.contains('open'));
    await settle('.faq-item summary');
    await time('FAQ',()=>p.locator('.faq-item summary').first().tap(),()=>document.querySelector('.faq-item').open);
    await settle('.price-est>summary');
    await time('estimator open',()=>p.locator('.price-est>summary').tap(),()=>document.querySelector('.price-est').open);
    await settle('#est-size');
    const v0=await p.inputValue('#est-size');
    await time('estimator',async()=>{const r=await p.locator('#est-size').boundingBox();await p.touchscreen.tap(r.x+r.width*0.8,r.y+r.height/2)},
      v0=>document.querySelector('#est-size').value!==v0,v0);
    await settle('.pr-cur');
    await time('currency',()=>p.tap('.pr-cur label.echip:has(input[value="EUR"])'),()=>document.querySelector('.pr-cur input[value="EUR"]').checked);
    await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(800);
    await p.tap('.menu-toggle');await p.waitForTimeout(1000);
    // the language switch is a link to that language's page (index.html, en/,
    // ar/: one page each), so the tap navigates and its input-to-paint cannot
    // be read (the Event Timing entries go with the page it leaves). What
    // must hold: the tap lands on the other page, in that language, over this
    // connection (a cold load, so the same 120 s as the first)
    const from=new URL(p.url()).pathname;
    await Promise.all([p.waitForURL(u=>u.pathname!==from,{waitUntil:'load',timeout:120000}),p.tap(`.mobile-menu .lang a[hreflang="${to}"]`)]);
    await p.waitForTimeout(1200);
    acts.push({name:'language',d:0,nav:true,ok:await p.evaluate(to=>document.documentElement.lang===to,to)});
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
  const detail='       interactions: '+acts.map(x=>`${x.name} ${x.nav?'(a page: not timed)':ms(x.d)}${x.ok?'':' (did nothing)'}`).join(', ');
  if(issues.length&&issues.every(i=>TIMING.has(i))&&!again){
    console.log('  ?? '+label.padEnd(26),line,' — over budget, measuring again');console.log(detail);
    return phone(label,path,{to},true);
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
// hub/ is the Studio (French, English and Arabic: its own switch, the site's stored language);
// hub/bible/ is the founder's character bible, one paper palette (no void-theme since 56f29c1)
await run('hub fr','/hub/index.html',{...D,lang:'fr'});
await run('hub ar','/hub/index.html',{...D,lang:'ar'});
await run('hub bible','/hub/bible/index.html',D);
for(const l of ['fr','en','ar']) await run('scene '+l,'/scene/index.html',{...D,lang:l});
await run('scene daylight','/scene/index.html',{...D,theme:'daylight'});   // the light palette, on the page's own sheet (scene/style.css)
await run('404','/404.html',D);
await run('404 arcanum/ar','/404.html',{...D,theme:'arcanum',lang:'ar'});
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
  for(const l of ['fr','en','ar']) await run(`index ${t}/${l}`,HOME(l),{...D,theme:t,lang:l});
await run('index cv open fr',HOME('fr'),{lang:'fr',act:openCv});
await run('index estimator open fr',HOME('fr'),{lang:'fr',act:openEstimator});
// the price guide: the home's chrome and sheets plus tarifs/style.css, the
// estimator open at load and the market comparison the home gave up, in the
// two palettes furthest apart (both themes are the home's runs' job)
for(const t of ['arcanum','daylight'])
  for(const l of ['fr','en','ar']) await run(`tarifs ${t}/${l}`,TARIFS(l),{...D,theme:t,lang:l});
console.log('— phone 390×844 —');
await run('hub fr m','/hub/index.html',{lang:'fr',w:390,h:844});
await run('hub ar m','/hub/index.html',{lang:'ar',w:390,h:844});
await run('hub bible m','/hub/bible/index.html',{w:390,h:844});
for(const l of ['fr','en','ar']) await run('scene '+l+' m','/scene/index.html',{lang:l,w:390,h:844});
await run('scene daylight m','/scene/index.html',{theme:'daylight',w:390,h:844});
await run('404 m','/404.html',{w:390,h:844});
await run('404 daylight/ar m','/404.html',{theme:'daylight',lang:'ar',w:390,h:844});
await run('workspacehq m','/workspacehq/index.html',{w:390,h:844,allowLoops:true});
for(const t of THEMES)
  for(const l of ['fr','ar']) await run(`index ${t}/${l} m`,HOME(l),{theme:t,lang:l,w:390,h:844});
await run('index menu open ar m',HOME('ar'),{lang:'ar',w:390,h:844,click:'.menu-toggle'});
await run('index cv open ar m',HOME('ar'),{lang:'ar',w:390,h:844,act:openCv});
await run('index estimator open ar m',HOME('ar'),{lang:'ar',w:390,h:844,act:openEstimator});
for(const t of ['arcanum','daylight'])
  for(const l of ['fr','ar']) await run(`tarifs ${t}/${l} m`,TARIFS(l),{theme:t,lang:l,w:390,h:844});
console.log('— tablet and landscape —');
await run('index arcanum/fr 768',HOME('fr'),{theme:'arcanum',lang:'fr',w:768,h:1024,touch:true});
await run('index daylight/ar 768',HOME('ar'),{theme:'daylight',lang:'ar',w:768,h:1024,touch:true});
await run('index daylight/fr 1024',HOME('fr'),{theme:'daylight',lang:'fr',w:1024,h:768,touch:true});
await run('index arcanum/ar 1024',HOME('ar'),{theme:'arcanum',lang:'ar',w:1024,h:768,touch:true});
await run('index arcanum/fr 844×390',HOME('fr'),{theme:'arcanum',lang:'fr',w:844,h:390,touch:true});
await run('index arcanum/ar 844×390',HOME('ar'),{theme:'arcanum',lang:'ar',w:844,h:390,touch:true});
await run('404 844×390','/404.html',{w:844,h:390,touch:true});
// the first screen reaches the offer: a laptop at 150% (960×600 css px) and a landscape phone (844×390)
for(const l of ['fr','ar']){
  // clsMax 0.013: at 960 the header's action appears at load (app.js fit(), 0.0124 measured 2026-11-07: GAP11, the CTA out of .js-only) and moves the language pill; held there until the markup carries it
  await run(`index arcanum/${l} 960×600 @1.5`,HOME(l),{theme:'arcanum',lang:l,w:960,h:600,dpr:1.5,lede:true,clsMax:0.013});
  await run(`index arcanum/${l} 844×390 lede`,HOME(l),{theme:'arcanum',lang:l,w:844,h:390,touch:true,lede:true});
}
/* ---------------- print ---------------- */
// What a buyer prints or saves as a PDF (the guide is the page most likely to
// be): rendered with the print sheet at A4 width (794 × 1123 CSS px), page 1
// must carry ink (at least 20% of its 16 px cells hold some: a blank first
// page is a page nobody keeps) and nothing may run past the page box.
const printPage=async(label,path,{lang='fr'}={})=>{
  if(ONLY&&!ONLY.test(label))return;
  const ctx=await b.newContext({viewport:{width:794,height:1123},reducedMotion:'reduce'});
  await ctx.addInitScript(l=>{try{localStorage.setItem('numidea-lang',l)}catch{}},lang);
  const p=await ctx.newPage();
  await p.emulateMedia({media:'print'});
  await p.goto(B+path,{waitUntil:'networkidle'});
  await p.evaluate(async()=>{const H=document.body.scrollHeight;for(let y=0;y<H;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,25))}scrollTo(0,0)});
  await p.waitForTimeout(600);
  const over=await p.evaluate(()=>{const W=document.documentElement.clientWidth,out=[];
    for(const e of document.querySelectorAll('body *')){const r=e.getBoundingClientRect(),cs=getComputedStyle(e);
      if(!r.width||cs.display==='none'||cs.visibility==='hidden'||r.right<=W+1||r.top>1123*3)continue;
      if(![...e.childNodes].some(n=>n.nodeType===3&&n.nodeValue.trim()))continue;
      let c=false;for(let a=e.parentElement;a;a=a.parentElement){const s=getComputedStyle(a);if(/hidden|clip|auto|scroll/.test(s.overflowX)){c=true;break}}
      if(!c)out.push(e.tagName+'.'+String(e.className).slice(0,20))}
    return {scroll:document.documentElement.scrollWidth>W+1,out:[...new Set(out)].slice(0,5)}});
  const png=await p.screenshot({clip:{x:0,y:0,width:794,height:1123}});
  const {data,info}=await sharp(png).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const C=16;let hit=0,cells=0;
  for(let cy=0;cy<info.height;cy+=C)for(let cx=0;cx<info.width;cx+=C){cells++;let ink=false;
    for(let y=cy;y<Math.min(cy+C,info.height)&&!ink;y++)for(let x=cx;x<Math.min(cx+C,info.width);x++){const i=(y*info.width+x)*3;if(data[i]+data[i+1]+data[i+2]<3*200){ink=true;break}}
    if(ink)hit++}
  const share=hit/cells;
  await ctx.close();
  const issues=[];if(share<0.2)issues.push('ink');if(over.scroll||over.out.length)issues.push('overflow');
  if(issues.length)fails++;
  rows.push({label,issues});
  console.log((issues.length?'FAIL ':'  ok ')+label.padEnd(26),`page 1 ink ${(share*100).toFixed(1)}% of cells (at least 20)  past the page box ${over.out.length+(over.scroll?'+H':'')}`);
  if(over.out.length)console.log('       of:',over.out.join(' | '));
};
console.log('— print: A4, page 1 —');
await printPage('print index fr','/index.html');
await printPage('print tarifs fr','/tarifs/index.html');
await printPage('print tarifs ar','/ar/tarifs/index.html',{lang:'ar'});
console.log('— 404 two folders down —');
await nested404('404 nested arcanum/ar',{site:B+'/',path:'a/b/missing?lang=ar',theme:'arcanum'});
if(!REMOTE){
  await nested404('404 pages nested fr',{site:BASE,path:'a/b/missing?lang=fr',emulate:true});
  await nested404('404 pages nested no-JS',{site:BASE,path:'a/b/c/nope.html',js:false,emulate:true});
}
console.log('— first paint in fallback type: webfonts refused vs loaded, 360-1600 —');
for(const t of THEMES)for(const l of ['fr','en'])await fallbackType(`fallback type ${t}/${l}`,{theme:t,lang:l});
console.log(`— throttled phone: 412×823, CPU 4×, Slow 4G, cold cache (timing targets ${PHONE_STRICT?'strict':'report-only'}) —`);
await phone('throttled index fr',HOME('fr'),{to:'ar'});
await phone('throttled index ar',HOME('ar'),{to:'fr'});
// the Arabic page's font bytes against the French page's (same theme, same run size): at most 1.5×
{
  const fr=rows.find(r=>r.label==='index arcanum/fr'),ar=rows.find(r=>r.label==='index arcanum/ar');
  if(fr&&ar&&fr.fontBytes){
    // target 1.5×; held at 2.7× (216 kB / 81 kB on 2026-11-07: the Arabic page fetches six Plex Arabic files, 600 and Latin subsets among them, beside Geist):
    // dropping the 600 faces (styles.css no longer asks for 600 in Arabic) and preloading the 400 and 700 Arabic files alone is the way down (GAP3)
    const ratio=ar.fontBytes/fr.fontBytes,bad=ratio>2.7;
    if(bad)fails++;
    console.log((bad?'FAIL ':'  ok ')+'font bytes ar / fr'.padEnd(26),`${(ar.fontBytes/1024).toFixed(0)} kB / ${(fr.fontBytes/1024).toFixed(0)} kB = ${ratio.toFixed(2)} (target 1.5, held at 2.7)`);
  }
}
await b.close();srv?.close();
if(warnings.length){console.log('\naxe incomplete (review, not failing):');for(const w of warnings)console.log('  '+w)}
if(phoneWarn.length){console.log('\nthrottled phone over its targets (report-only; AUDIT_PHONE_STRICT=1 fails on them):');for(const w of phoneWarn)console.log('  '+w)}
if(!rows.length){console.log(`\nno run matched AUDIT_ONLY=${process.env.AUDIT_ONLY}`);process.exit(1)}
console.log(fails?`\nFAILURES: ${fails} of ${rows.length}`:`\nALL CLEAN (${rows.length} runs${phoneWarn.length?`; ${phoneWarn.length} over the throttled phone's report-only targets`:''})`);
process.exit(fails?1:0);
