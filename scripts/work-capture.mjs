#!/usr/bin/env node
/**
 * Refreshes the blueprint showcase captures — `npm run work:capture [slug]`.
 * Four desktop pages (1440×900) and two phone screens (390×844 @2x) per
 * project, from the live sites, into assets/work/<slug>/{d1..d4,m1,m2}.webp,
 * each with a half-width copy beside it (d<n>-720, m<n>-416): the srcset's
 * small candidate in build-scene.mjs shot(), which a phone takes instead
 * of the 1440 file.
 * Page lists must match scripts/scene-data.mjs. WorkspaceHQ (our own page) is
 * served from this repository by lib/serve.mjs, on a free port. Then run:
 * npm run scene
 *
 * Notes from the first capture (2026-10-06):
 *  - Alliance's home hero is a WebGL globe that renders black in headless
 *    Chromium, so its desktop "home" is the #voyages section.
 *  - Bordj Steel /products/charpente-metallique showed the site's own error
 *    screen at capture time; /products is used.
 */
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { launch, serve } from './lib/serve.mjs';
const P={
 bordjsteel:{base:'https://bordjsteelb2b.netlify.app',d:['/','/products','/references','/about/history'],m:['/','/products']},
 alliance:{base:'https://alliancetravel34.netlify.app',d:['/#voyages','/istanbul/','/rendez-vous-visa/','/bali/'],m:['/','/istanbul/'],
  // trip pages: their hero is built dark, and in the light scheme its text and
  // nav are dark on black (their own dark scheme is the one that reads)
  dark:['/istanbul/','/bali/']},
 glaive:{base:'https://glaivestore.netlify.app',d:['/index.html','/shop.html?cat=Headsets','/product.html?id=aurel-elite','/quiz.html'],m:['/index.html','/product.html?id=aurel-elite']},
 almaflow:{base:'https://almaflowclim.netlify.app',d:['/','/climatisation','/realisations','/contact'],m:['/','/climatisation']},
 workspacehq:{base:'',d:['/','/#features','/#walkthrough','/#bit'],m:['/','/#features']},
};
const only=process.argv[2];
const srv=await serve();
P.workspacehq.base=srv.base+"/workspacehq";
// the gates' browser (lib/serve.mjs picks it); software GL so WebGL pages render
const b = await launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const meta={};
for(const [k,s] of Object.entries(P)){ if(only&&k!==only)continue;
 mkdirSync(`assets/work/${k}`,{recursive:true});meta[k]={pages:[]};
 for(const [kind,list,vw] of [['d',s.d,{width:1440,height:900}],['m',s.m,{width:390,height:844}]]){
  let i=0;for(const path of list){i++;
   // French (the reference language, so the client's nav and body agree) and
   // reduced motion (no reveal caught half-way)
   const ctx=await b.newContext({viewport:vw,locale:'fr-FR',reducedMotion:'reduce',colorScheme:(s.dark||[]).includes(path)?'dark':'light',deviceScaleFactor:kind==='m'?2:1,isMobile:kind==='m',hasTouch:kind==='m'});
   const p=await ctx.newPage();
   try{await p.goto(s.base+path,{waitUntil:'networkidle',timeout:60000})}catch(e){console.log(k,path,e.message.slice(0,60))}
   await p.waitForTimeout(1500);
   // Alliance's trip pages open on a scroll-driven title intro; its own
   // "Passer" (skip) control shows the page a visitor actually lands on
   const skip=p.locator('button:has-text("Passer"), a:has-text("Passer"), button:has-text("Skip")').first();
   if(await skip.count()&&await skip.isVisible()){await skip.click().catch(()=>{});await p.waitForTimeout(1500)}
   if(path.includes('#')){await p.evaluate(h=>{const e=document.querySelector(h);if(e){document.documentElement.style.scrollBehavior='auto';e.scrollIntoView()}},path.slice(path.indexOf('#')))}
   // let reveal-on-scroll content settle in the visible fold
   // instant scrolling only: a smooth restore was still travelling when the
   // shot fired. Nudge to fire reveal-on-scroll, restore, then let intro
   // animations finish.
   await p.evaluate(async()=>{document.documentElement.style.scrollBehavior='auto';const y=scrollY;window.scrollBy({top:300,behavior:'instant'});await new Promise(r=>setTimeout(r,500));window.scrollTo({top:y,behavior:'instant'})});
   await p.waitForTimeout(k==='alliance'?6000:2500);
   // every image painted, not still decoding
   await p.evaluate(()=>Promise.race([Promise.all([...document.images].filter(i=>i.complete).map(i=>i.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,4000))]));
   // a fixed header must not sit on the client's h1: where the two meet
   // (Alliance's trip pages, after the skip) scroll back up till the h1 is
   // clear of it, never above the top of the page
   const lift=await p.evaluate(()=>{const h=document.querySelector('h1');if(!h)return 0;
    let nb=0;for(const e of document.querySelectorAll('body *')){const c=getComputedStyle(e);if(c.position==='fixed'||c.position==='sticky'){const r=e.getBoundingClientRect();if(r.height>20&&r.height<=200&&r.width>300&&r.top<=100&&r.bottom>0)nb=Math.max(nb,r.bottom)}}
    const t=h.getBoundingClientRect().top,want=nb+24;
    if(!nb||t>=want||h.getBoundingClientRect().bottom<0)return 0;
    const d=Math.min(want-t,scrollY);window.scrollBy({top:-d,behavior:'instant'});return d});
   if(lift){await p.waitForTimeout(1200);await p.evaluate(()=>Promise.race([Promise.all([...document.images].filter(i=>i.complete).map(i=>i.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,4000))]))}
   const title=await p.title();
   const buf=await p.screenshot({type:'png'});
   const out=`assets/work/${k}/${kind}${i}.webp`,small=kind==='m'?416:720;
   await sharp(buf).resize(kind==='m'?780:1440).webp({quality:80}).toFile(out);
   await sharp(buf).resize(small).webp({quality:80}).toFile(out.replace('.webp',`-${small}.webp`));
   meta[k].pages.push({file:out,kind,path,title});console.log(out,title.slice(0,50));
   await ctx.close();}}
}
await b.close();srv.close();
