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
 * Covers index.html in all six themes x FR/AR, plus hub/, scene/ and 404.
 * Exits non-zero on any failure. Optional arg: a single theme name.
 *
 * Traps this script already guards against (each produced false results once):
 *  - color-mix() serialises as color(srgb r g b) with 0-1 channels, not 0-255
 *  - text clipped by an overflow ancestor is laid out but never painted
 *  - the CV panel is collapsed by default; it is audited open, as read
 */
import {chromium} from 'playwright';
import sharp from 'sharp';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {join, extname, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=join(dirname(fileURLToPath(import.meta.url)),'..');
const TYPES={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.webp':'image/webp',
  '.woff2':'font/woff2','.svg':'image/svg+xml','.json':'application/json','.jpg':'image/jpeg','.ico':'image/x-icon'};
const srv=createServer(async(q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';
  try{const b=await readFile(join(ROOT,p));r.writeHead(200,{'content-type':TYPES[extname(p)]||'application/octet-stream'});r.end(b)}
  catch{r.writeHead(404);r.end()}}).listen(0);
await new Promise(r=>srv.on('listening',r));
const B='http://127.0.0.1:'+srv.address().port;

const PAGES=[['index','/index.html'],['hub','/hub/index.html'],['scene','/scene/index.html'],['404','/404.html']];
const THEMES=['arcanum','noir','daylight','mono','altneon','engineering'];
const ONLY=process.argv[2];        // optional: restrict to one theme
const lum=([r,g,b])=>{const f=v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4};return .2126*f(r)+.7152*f(g)+.0722*f(b)};
const cr=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const br=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const report=[];
for(const theme of THEMES){ if(ONLY&&theme!==ONLY)continue;
 for(const [pname,path] of PAGES){
  // hub/scene/404 have their own palettes; only index honours the 6 themes
  if(pname!=='index' && theme!=='arcanum') continue;
  for(const lang of (pname==='index'?['fr','ar']:['fr'])){
   const p=await br.newPage({viewport:{width:1280,height:900}});
   await p.addInitScript(([t,l])=>{try{localStorage.setItem('numidea-theme',t);localStorage.setItem('numidea-lang',l)}catch(e){}},[theme,lang]);
   await p.goto(B+path,{waitUntil:'networkidle'});
   await p.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}'});
   await p.evaluate(()=>{document.querySelectorAll('.reveal,[data-reveal]').forEach(e=>e.classList.add('in','seen'));
     document.querySelectorAll('details').forEach(d=>d.open=true);
     // audit the CV panel in its open state — the state people actually read
     const cv=document.getElementById('cv-panel');if(cv){cv.classList.add('open');cv.inert=false;}});
   await p.waitForTimeout(500);
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
       // skip off-screen/clipped-away (skip-link etc.)
       if(rect.right<0||rect.left>document.documentElement.clientWidth)continue;
       // text clipped away by an overflow ancestor is laid out but never painted
       let clipped=false,c=el.parentElement;
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
         x:rect.left,y:rect.top+sy,w:rect.width,h:rect.height,large,gradText,
         ariaHidden:!!el.closest('[aria-hidden="true"]'),disabled:!!el.closest('[aria-disabled="true"],[data-pending],[data-wa-pending]')});
     }
     return out;});
   // background-only render
   await p.addStyleTag({content:'*,*::before,*::after{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;caret-color:transparent!important}'});
   await p.waitForTimeout(150);
   const buf=await p.screenshot({fullPage:true});
   const img=sharp(buf);const meta=await img.metadata();
   const {data,info}=await img.raw().toBuffer({resolveWithObject:true});
   const px=(x,y)=>{x=Math.max(0,Math.min(info.width-1,x|0));y=Math.max(0,Math.min(info.height-1,y|0));const i=(y*info.width+x)*info.channels;return [data[i],data[i+1],data[i+2]]};
   for(const it of items){
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
         note:it.disabled?'pending/disabled':it.ariaHidden?'aria-hidden':''});
     }
   }
   await p.close();
  }
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
console.log('\nTOTAL real failures:',total);
srv.close();
process.exit(total?1:0);
