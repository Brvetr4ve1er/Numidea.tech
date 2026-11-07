#!/usr/bin/env node
/**
 * Contrast sweep — run before shipping visual changes (`npm run sweep`).
 *
 * Measures what is actually PAINTED, not what the CSS declares. Each page is
 * rendered once normally to collect every text run, then once more with all
 * text made transparent; the background under each run is sampled from that
 * second render and composited against the text colour. That handles
 * gradients, textures, translucent panels and parallax fields, which a
 * declared-colour check cannot see.
 *
 * Covers the home page (one page per language: index.html, en/, ar/) and the
 * price guide (tarifs/, en/tarifs/, ar/tarifs/: the market comparison, swept
 * on the home in every theme until it moved there) in all six themes, plus
 * hub/, scene/, 404 and workspacehq/,
 * and a second pass at other sizes and states: phones in the dark themes, the
 * guide's phone in arcanum and daylight, tablets,
 * short landscape, scene/ in Arabic and in the daylight and noir themes (it
 * follows numidea-theme since e8a2ea2), each on desktop and on a 390px phone,
 * 404 in other themes, and hub/ (one paper palette since 56f29c1) on a
 * 390px phone.
 * Exits non-zero on any failure. Optional arg: a single theme name.
 *
 * Each page is scrolled through once before it is measured, so every lazy
 * picture is there to be measured against (the hub's headings sit on its art)
 * and the hub's loops have been on screen: with reduced motion each must still
 * show its still, decoded (lib/loop-state.mjs), or the run fails.
 *
 * Visible text must meet 1.4.3 whatever its accessibility-tree state: text
 * inside an aria-hidden picture (the charts, the Aperçu timeline, the
 * estimator's package names) is still read by eye, so it counts like any
 * other. Only an element marked data-decorative (a glyph that is pure
 * ornament) is reported as a note instead of a failure. Pages are rendered
 * with reduced motion, so the pictures app.js would hold back for their
 * entrance (.vz-arm, some at opacity 0) are measured as drawn.
 *
 * Traps this script already guards against (each produced false results once):
 *  - color-mix() serialises as color(srgb r g b) with 0-1 channels, not 0-255
 *  - text clipped by an overflow ancestor is laid out but never painted
 *  - the CV panel is collapsed by default; it is audited open, as read
 *  - a fixed layer (the phone contact bar) is not where the full-page capture
 *    paints it: its text is sampled from a viewport capture, with the bar's
 *    state held through both renders (it read 1.03:1 on its own crimson),
 *    and the page's text it covers is not painted there (the guide's
 *    currency legend read 1.28:1 against the bar)
 *  - opening every <details> scrolls the page (app.js brings an FAQ answer
 *    opened under the bar into view): it is put back at the top before
 *    anything is measured
 */
import sharp from 'sharp';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {serve,launch} from './lib/serve.mjs';
import {loopState} from './lib/loop-state.mjs';
import {ROOT,THEMES} from './site.mjs';
const srv=await serve();
const B=srv.base;

// the home page is one page per language (build-lang.mjs), each opened directly; the price guide likewise (build-tarifs.mjs)
const HOME={fr:'/index.html',en:'/en/index.html',ar:'/ar/index.html'};
const TARIFS={fr:'/tarifs/index.html',en:'/en/tarifs/index.html',ar:'/ar/tarifs/index.html'};
const PAGES=[['index',HOME.fr],['index-en',HOME.en],['index-ar',HOME.ar],['tarifs',TARIFS.fr],['tarifs-en',TARIFS.en],['tarifs-ar',TARIFS.ar],['scene','/scene/index.html'],['404','/404.html'],['workspacehq','/workspacehq/index.html']];
const OWN={index:'fr','index-en':'en','index-ar':'ar',tarifs:'fr','tarifs-en':'en','tarifs-ar':'ar'};   // each home and guide page's language; the other pages are swept in French
const ONLY=process.argv[2];        // optional: restrict to one theme
const lum=([r,g,b])=>{const f=v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4};return .2126*f(r)+.7152*f(g)+.0722*f(b)};
const cr=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const br=await launch();
const report=[],loopBad=[];
const RUNS=[];
for(const theme of THEMES) for(const [pname,path] of PAGES){
  // every theme on the home and guide pages; the other pages once each in
  // arcanum (hub/ and workspacehq/ keep their own palettes; 404 and scene/
  // follow the theme and get their other themes in the second pass below)
  if(!OWN[pname] && theme!=='arcanum') continue;
  RUNS.push({theme,pname,path,lang:OWN[pname]||'fr',w:1280,h:900});
}
if(existsSync(join(ROOT,'legal-preview/index.html'))) RUNS.push({theme:'arcanum',pname:'legal-preview',path:'/legal-preview/index.html',lang:'fr',w:1280,h:900});
if(existsSync(join(ROOT,'legal/index.html'))) RUNS.push({theme:'arcanum',pname:'legal',path:'/legal/index.html',lang:'fr',w:1280,h:900});
// second pass: sizes and states the desktop pass never paints
for(const t of ['noir','mono','altneon']) for(const l of ['fr','ar']) RUNS.push({theme:t,pname:'index@390',path:HOME[l],lang:l,w:390,h:844});
for(const t of ['arcanum','daylight']) for(const l of ['fr','ar']) RUNS.push({theme:t,pname:'tarifs@390',path:TARIFS[l],lang:l,w:390,h:844});
RUNS.push({theme:'arcanum',pname:'index@768',path:HOME.fr,lang:'fr',w:768,h:1024});
RUNS.push({theme:'daylight',pname:'index@768',path:HOME.ar,lang:'ar',w:768,h:1024});
RUNS.push({theme:'noir',pname:'index@1024',path:HOME.fr,lang:'fr',w:1024,h:768});
RUNS.push({theme:'arcanum',pname:'index@844x390',path:HOME.fr,lang:'fr',w:844,h:390});
RUNS.push({theme:'arcanum',pname:'scene',path:'/scene/index.html',lang:'ar',w:1280,h:900});
RUNS.push({theme:'arcanum',pname:'scene@390',path:'/scene/index.html',lang:'ar',w:390,h:844});
// scene/ in the light theme and the darkest one, on desktop and on the phone
for(const t of ['daylight','noir']){
  RUNS.push({theme:t,pname:'scene',path:'/scene/index.html',lang:'fr',w:1280,h:900});
  RUNS.push({theme:t,pname:'scene@390',path:'/scene/index.html',lang:'fr',w:390,h:844});
}
RUNS.push({theme:'daylight',pname:'404@390',path:'/404.html',lang:'ar',w:390,h:844});
RUNS.push({theme:'noir',pname:'404',path:'/404.html',lang:'ar',w:1280,h:900});
// hub/: one paper palette (the character bible, 56f29c1: no void-theme), on the desktop pass above and here
// the Studio (hub/: French, English and Arabic by its own switch) and the character bible (hub/bible/), desktop and phone
for(const [pname,path,lang,w,h] of [['hub','/hub/index.html','fr',1280,900],['hub-ar','/hub/index.html','ar',1280,900],['hub-bible','/hub/bible/index.html','en',1280,900],
  ['hub@390','/hub/index.html','fr',390,844],['hub-ar@390','/hub/index.html','ar',390,844],['hub-bible@390','/hub/bible/index.html','en',390,844]])
  RUNS.push({theme:'arcanum',pname,path,lang,w,h});
for(const {theme,pname,path,lang,w,h,init={}} of RUNS){ if(ONLY&&theme!==ONLY)continue;
  {
   // reduced motion: every picture is drawn at once, never held at opacity 0
   const p=await br.newPage({viewport:{width:w,height:h},isMobile:w<600,hasTouch:w<600,reducedMotion:'reduce'});
   await p.addInitScript(([t,l,init])=>{try{localStorage.setItem('numidea-theme',t);localStorage.setItem('numidea-lang',l);for(const k in init)localStorage.setItem(k,init[k])}catch(e){}},[theme,lang,init]);
   await p.goto(B+path,{waitUntil:'networkidle'});
   // Chromium's beyond-viewport capture (the fullPage screenshot below) drops
   // touch emulation while it runs, so (pointer:coarse) rules un-apply and text
   // moves out from under the positions measured here: the footer language pill
   // was sampled against the page behind it (1:1). Measure and capture under the
   // same fine pointer. Colours do not depend on the pointer, and axe in
   // audit.mjs still checks contrast on the real coarse-pointer layout.
   if(w<600)await (await p.context().newCDPSession(p)).send('Emulation.setTouchEmulationEnabled',{enabled:false});
   await p.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}'});
   // the whole page on screen once, half a viewport at a time, then back to
   // the top: lazy pictures load (text over art is measured against the art)
   // and the hub's loops are seen; then every picture is waited for (3s at most)
   await p.evaluate(async()=>{const H=document.documentElement.scrollHeight;for(let y=0;y<H;y+=innerHeight/2){scrollTo(0,y);await new Promise(r=>setTimeout(r,45))}scrollTo(0,0);
     await Promise.all([...document.images].filter(i=>!i.complete).map(i=>new Promise(r=>{i.addEventListener('load',r);i.addEventListener('error',r);setTimeout(r,3000)})))});
   for(const l of (await p.evaluate(loopState)).filter(l=>!l.ok))loopBad.push(`${theme}/${pname}/${lang}: ${l.name} shows ${l.shows}, not its still ${l.want}`);
   await p.evaluate(()=>{document.querySelectorAll('.reveal,[data-reveal]').forEach(e=>e.classList.add('in','seen'));
     document.querySelectorAll('details').forEach(d=>d.open=true);
     // audit the CV panel in its open state — the state people actually read
     const cv=document.getElementById('cv-panel');if(cv){cv.classList.add('open');cv.inert=false;}});
   await p.waitForTimeout(500);
   // back to the top: an FAQ answer opened under the phone bar is brought into
   // view (app.js), so opening every <details> scrolled the page, and the
   // sticky and fixed layers were measured where the capture does not paint them
   await p.evaluate(()=>scrollTo(0,0));
   await p.waitForTimeout(200);
   // a fixed layer (the phone contact bar .m-contact, shown or hidden by
   // app.js as the page moves) keeps the state it has now through both
   // renders: the full-page capture resizes the viewport, which moves the
   // footer into view and once hid the bar under its own measured text
   await p.evaluate(()=>{for(const e of document.querySelectorAll('.m-contact')){const c=e.className;
     new MutationObserver(()=>{if(e.className!==c)e.className=c}).observe(e,{attributes:true,attributeFilter:['class']})}});
   // collect text-bearing elements
   const items=await p.evaluate(()=>{
     const out=[];const sy=window.scrollY;
     const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
     const seen=new Set();let n;
     while(n=walk.nextNode()){
       if(!n.textContent.trim())continue;
       const el=n.parentElement; if(!el||seen.has(el))continue; seen.add(el);
       const cs=getComputedStyle(el);
       if(cs.visibility==='hidden'||cs.display==='none')continue;
       // effective opacity up the tree
       let op=1,a=el;while(a){op*=parseFloat(getComputedStyle(a).opacity);a=a.parentElement}
       if(op<0.05)continue;
       const r=document.createRange();r.selectNodeContents(n);const rect=r.getBoundingClientRect();
       if(rect.width<2||rect.height<2)continue;
       // in a fixed layer: painted over the viewport, not at its place in the
       // document, so it is sampled from a viewport capture (below), and one
       // parked outside the viewport (the skip link until focused) is not painted
       let fixed=false;for(let f=el;f&&f!==document.body;f=f.parentElement)if(getComputedStyle(f).position==='fixed'){fixed=true;break}
       if(fixed&&(rect.bottom<=0||rect.top>=innerHeight))continue;
       // under a fixed layer (the guide's phone bar is on from the top): not
       // painted where it is laid out, in either render (the capture keeps the
       // bar over the first viewport), so it is read once it scrolls clear, by
       // eye; measured here it was the bar's own colour against the text's
       if(!fixed&&rect.top>=0&&rect.bottom<=innerHeight){const top=document.elementFromPoint(rect.left+rect.width/2,rect.top+rect.height/2);
         if(top&&!el.contains(top)&&!top.contains(el)){let lay=null;for(let f=top;f&&f!==document.body;f=f.parentElement)if(getComputedStyle(f).position==='fixed'){lay=f;break}
           if(lay&&!lay.contains(el))continue}}
       // skip off-screen/clipped-away (skip-link etc.)
       if(rect.right<0||rect.left>document.documentElement.clientWidth)continue;
       // ...and above the top of the document: a skip link parked at
       // translateY(-200%) is never painted until focused, so sampling 'behind'
       // it measures the page against nothing (light skip links only passed by luck)
       if(rect.bottom+sy<=0)continue;
       // text clipped away by its own box or an overflow ancestor is laid out
       // but never painted (a .sr-only span clips itself to 1px: workspacehq/'s
       // title cards say "Play" that way)
       let clipped=false,c=el;
       while(c&&c!==document.body){const cc=getComputedStyle(c);
         if(cc.overflow!=='visible'||cc.overflowX!=='visible'||cc.overflowY!=='visible'){
           const cr2=c.getBoundingClientRect();
           const vis=Math.min(rect.bottom,cr2.bottom)-Math.max(rect.top,cr2.top);
           if(vis<rect.height*0.5){clipped=true;break}}
         c=c.parentElement}
       if(clipped)continue;
       const fill=cs.webkitTextFillColor;
       const gradText=cs.backgroundClip==='text'||cs.webkitBackgroundClip==='text'||/rgba\(0, 0, 0, 0\)/.test(fill);
       const fs=parseFloat(cs.fontSize),fw=parseInt(cs.fontWeight)||400;
       const large=fs>=24||(fs>=18.66&&fw>=700);
       let sel=el.tagName.toLowerCase();if(el.id)sel+='#'+el.id;else if(el.classList.length)sel+='.'+[...el.classList].slice(0,2).join('.');
       let sec=el.closest('section,header,footer,nav,.modal,aside');
       const where=sec?(sec.id||sec.className.toString().split(' ')[0]||sec.tagName):'body';
       out.push({sel,where,text:n.textContent.trim().slice(0,40),color:cs.color,op,
         x:rect.left,y:fixed?rect.top:rect.top+sy,w:rect.width,h:rect.height,large,gradText,fixed,
         decorative:!!el.closest('[data-decorative]'),disabled:!!el.closest('[aria-disabled="true"]')});
     }
     return out;});
   // background-only render
   await p.addStyleTag({content:'*,*::before,*::after{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;caret-color:transparent!important}'});
   await p.waitForTimeout(150);
   // the fixed layers' text against the viewport as it is, before the
   // full-page capture moves them to the foot of a page-tall viewport
   const vbuf=items.some(it=>it.fixed)?await p.screenshot():null;
   const buf=await p.screenshot({fullPage:true});
   const sampler=async(b)=>{const {data,info}=await sharp(b).raw().toBuffer({resolveWithObject:true});
     return (x,y)=>{x=Math.max(0,Math.min(info.width-1,x|0));y=Math.max(0,Math.min(info.height-1,y|0));const i=(y*info.width+x)*info.channels;return [data[i],data[i+1],data[i+2]]}};
   const pxPage=await sampler(buf),pxView=vbuf?await sampler(vbuf):null;
   for(const it of items){
     const px=it.fixed?pxView:pxPage;
     if(it.gradText)continue;
     // color-mix() serialises as `color(srgb r g b / a)` with 0-1 channels;
     // rgb()/rgba() use 0-255. Reading the former as the latter turns every
     // mixed colour near-black and invents failures that do not exist.
     const m=it.color.match(/[\d.]+/g).map(Number);
     const unit=/^color\(srgb/.test(it.color)?255:1;
     let tc=m.slice(0,3).map(v=>v*unit);const ta=(m[3]??1)*it.op;
     // sample a 7x5 grid inside the text box
     const samples=[];
     for(let i=0;i<7;i++)for(let j=0;j<5;j++){
       const bg=px(it.x+it.w*(i+.5)/7, it.y+it.h*(j+.5)/5);
       // composite text alpha over this background
       const c=tc.map((v,k)=>v*ta+bg[k]*(1-ta));
       samples.push(cr(c,bg));
     }
     samples.sort((a,b)=>a-b);
     const med=samples[samples.length>>1], worst=samples[Math.floor(samples.length*.15)];
     const need=it.large?3:4.5;
     if(med<need){
       report.push({theme,page:pname,lang,where:it.where,sel:it.sel,text:it.text,med:+med.toFixed(2),worst:+worst.toFixed(2),need,
         note:it.disabled?'pending/disabled':it.decorative?'decorative':''});
     }
   }
   await p.close();
  }
}
await br.close();

// summarise
const key=r=>`${r.theme}/${r.page}/${r.lang}`;
const by={};for(const r of report){(by[key(r)]=by[key(r)]||[]).push(r)}
for(const k of Object.keys(by).sort()){
  const rs=by[k].filter(r=>!r.note);
  console.log(`\n== ${k}  (${rs.length} real, ${by[k].length-rs.length} pending/decorative)`);
  if(process.env.SWEEP_ALL)for(const r of by[k].filter(r=>r.note))console.log(`   (${r.note}) ${r.med}:1 ${r.sel} "${r.text}"`);
  for(const r of rs.sort((a,b)=>a.med-b.med).slice(0,14))
    console.log(`   ${String(r.med).padStart(5)}:1 (need ${r.need})  ${r.where.padEnd(12)} ${r.sel.padEnd(30)} "${r.text}"`);
}
const total=report.filter(r=>!r.note).length;
if(loopBad.length){console.log('\nloops not on their stills with reduced motion:');for(const l of loopBad)console.log('   '+l)}
console.log('\nTOTAL real failures:',total+loopBad.length);
srv.close();
process.exit(total+loopBad.length?1:0);
