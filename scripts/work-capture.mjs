#!/usr/bin/env node
/**
 * Refreshes the blueprint showcase captures — `npm run work:capture [slug]`.
 * Four desktop pages (1440×900) and two phone screens (390×844 @2x) per
 * project, from the live sites, into assets/work/<slug>/{d1..d4,m1,m2}.webp.
 * Page lists must match scripts/scene-data.mjs. Needs the local server on
 * :8765 for WorkspaceHQ (our own page). Then run: npm run scene
 *
 * Notes from the first capture (2026-10-06):
 *  - Alliance's home hero is a WebGL globe that renders black in headless
 *    Chromium, so its desktop "home" is the #voyages section.
 *  - Bordj Steel /products/charpente-metallique showed the site's own error
 *    screen at capture time; /products is used.
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdirSync } from 'fs';
const P={
 bordjsteel:{base:'https://bordjsteelb2b.netlify.app',d:['/','/products','/references','/about/history'],m:['/','/products']},
 alliance:{base:'https://alliancetravel34.netlify.app',d:['/#voyages','/istanbul/','/rendez-vous-visa/','/bali/'],m:['/','/istanbul/']},
 glaive:{base:'https://glaivestore.netlify.app',d:['/index.html','/shop.html?cat=Headsets','/product.html?id=aurel-elite','/quiz.html'],m:['/index.html','/product.html?id=aurel-elite']},
 almaflow:{base:'https://almaflowclim.netlify.app',d:['/','/climatisation','/realisations','/contact'],m:['/','/climatisation']},
 workspacehq:{base:'http://localhost:8765/workspacehq',d:['/','/#features','/#walkthrough','/#bit'],m:['/','/#features']},
};
const only=process.argv[2];
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const meta={};
for(const [k,s] of Object.entries(P)){ if(only&&k!==only)continue;
 mkdirSync(`assets/work/${k}`,{recursive:true});meta[k]={pages:[]};
 for(const [kind,list,vw] of [['d',s.d,{width:1440,height:900}],['m',s.m,{width:390,height:844}]]){
  let i=0;for(const path of list){i++;
   const ctx=await b.newContext({viewport:vw,deviceScaleFactor:kind==='m'?2:1,isMobile:kind==='m',hasTouch:kind==='m'});
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
   const title=await p.title();
   const buf=await p.screenshot({type:'png'});
   const out=`assets/work/${k}/${kind}${i}.webp`;
   await sharp(buf).resize(kind==='m'?780:1440).webp({quality:80}).toFile(out);
   meta[k].pages.push({file:out,kind,path,title});console.log(out,title.slice(0,50));
   await ctx.close();}}
}
await b.close();
