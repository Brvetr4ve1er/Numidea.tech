#!/usr/bin/env node
/**
 * Layout scanner — `npm run vbugs`. Renders index.html at 7 widths x 4
 * theme/language pairs and reports overlapping text, text escaping its card,
 * text clipped by an overflow box, stretched images and horizontal scroll.
 * Content of closed <details> is skipped (it keeps stale layout boxes).
 *
 * Exits non-zero on any issue not in scripts/vbugs-allow.json, where each
 * accepted issue (matched by prefix) carries the reason it is acceptable.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { serve, launch } from './lib/serve.mjs';
import { ROOT } from './site.mjs';
const srv = await serve();
const combos=[];for(const w of [1440,1280,1024,768,414,390,360])for(const [t,l] of [['arcanum','fr'],['arcanum','ar'],['engineering','en'],['daylight','fr']])combos.push([w,t,l]);
const b = await launch();
const agg={};
for(const [w,t,l] of combos){
 const p=await b.newPage({viewport:{width:w,height:w<600?800:900}});
 await p.addInitScript(([t,l])=>{localStorage.setItem('numidea-theme',t);localStorage.setItem('numidea-lang',l)},[t,l]);
 await p.goto(srv.base+'/',{waitUntil:'networkidle'});
 await p.evaluate(async()=>{const H=document.body.scrollHeight;for(let y=0;y<H;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,40))}scrollTo(0,0)});
 await p.waitForTimeout(1500);
 await p.addStyleTag({content:'[data-parallax]{translate:none!important}*{transition:none!important}'});
 await p.waitForTimeout(100);
 const r=await p.evaluate(()=>{
  const out=[];const vis=e=>{const cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden')return false;let a=e;while(a){if(parseFloat(getComputedStyle(a).opacity)<.1)return false;a=a.parentElement}return true};
  const sel=e=>{let s=e.tagName.toLowerCase();if(e.id)s+='#'+e.id;else if(e.classList.length)s+='.'+[...e.classList].slice(0,2).join('.');const sec=e.closest('section,header,footer,aside,.vista');return (sec?(sec.id||sec.className.split(' ')[0]):'body')+' '+s};
  // text leaf boxes
  const texts=[];const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
  while(n=tw.nextNode()){if(!n.textContent.trim())continue;const el=n.parentElement;if(!el||el.closest('[aria-hidden="true"],script,style,noscript,.modal:not(.open),dialog:not([open]),.cv-panel:not(.open)'))continue;const dd=el.closest('details');if(dd&&!dd.open&&!el.closest('summary'))continue;if(!vis(el))continue;
   const rg=document.createRange();rg.selectNodeContents(n);for(const rc of rg.getClientRects()){if(rc.width<3||rc.height<3)continue;texts.push({el,x:rc.left,y:rc.top+scrollY,w:rc.width,h:rc.height,t:n.textContent.trim().slice(0,24)})}}
  // 1 overlapping text from different elements
  texts.sort((a,b)=>a.y-b.y);
  for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length&&texts[j].y<texts[i].y+texts[i].h;j++){const a=texts[i],c=texts[j];if(a.el===c.el||a.el.contains(c.el)||c.el.contains(a.el))continue;
    const ix=Math.min(a.x+a.w,c.x+c.w)-Math.max(a.x,c.x),iy=Math.min(a.y+a.h,c.y+c.h)-Math.max(a.y,c.y);
    if(ix>4&&iy>Math.min(a.h,c.h)*.35)out.push('OVERLAP '+sel(a.el)+' "'+a.t+'" × '+sel(c.el)+' "'+c.t+'"')}
  // 2 text outside its card/box ancestor (bordered/background container)
  for(const tx of texts){let c=tx.el.parentElement;while(c&&c!==document.body){const cs=getComputedStyle(c);if((cs.borderTopWidth!=='0px'&&cs.borderStyle!=='none')||cs.backgroundColor!=='rgba(0, 0, 0, 0)'||cs.backgroundImage!=='none')break;c=c.parentElement}
    if(!c||c===document.body)continue;const r=c.getBoundingClientRect();const L=r.left,R=r.right,T=r.top+scrollY,B=r.bottom+scrollY;
    if(tx.x<L-2||tx.x+tx.w>R+2||tx.y<T-2||tx.y+tx.h>B+2)out.push('ESCAPES '+sel(tx.el)+' "'+tx.t+'" from '+sel(c))}
  // 3 clipped text (overflow hidden, content wider/taller), excluding ellipsis
  for(const e of document.querySelectorAll('body *')){if(!vis(e)||e.closest('[aria-hidden="true"]'))continue;const cs=getComputedStyle(e);if(cs.overflowX==='visible'&&cs.overflowY==='visible')continue;if(cs.textOverflow==='ellipsis')continue;
    if(!e.textContent.trim())continue;{const dd=e.closest('details');if(dd&&!dd.open&&!e.closest('summary'))continue;}if(e.scrollWidth>e.clientWidth+2&&cs.overflowX!=='auto'&&cs.overflowX!=='scroll'&&e.clientWidth>0)out.push('HCLIP '+sel(e)+' '+e.scrollWidth+'>'+e.clientWidth)}
  // 4 images whose box aspect differs from intrinsic with object-fit fill (stretch)
  for(const im of document.images){if(!vis(im)||!im.naturalWidth)continue;const r=im.getBoundingClientRect();if(r.width<10)continue;const cs=getComputedStyle(im);if(cs.objectFit!=='fill')continue;const d=Math.abs((r.width/r.height)/(im.naturalWidth/im.naturalHeight)-1);if(d>.03)out.push('STRETCH '+sel(im)+' '+(d*100).toFixed(0)+'%')}
  // 5 element wider than viewport
  const dw=document.documentElement.clientWidth;if(document.documentElement.scrollWidth>dw+1)out.push('HSCROLL '+document.documentElement.scrollWidth);
  return out});
 for(const x of r){(agg[x]=agg[x]||[]).push(`${w}/${t}/${l}`)}
 await p.close();
}
await b.close();
srv.close();
const ALLOW = JSON.parse(readFileSync(join(ROOT, 'scripts/vbugs-allow.json'), 'utf8'));
const allowed = (k) => ALLOW.find((a) => k.startsWith(a.prefix));
const rows=Object.entries(agg).sort((a,b)=>b[1].length-a[1].length);
let fresh = 0;
for(const [k,v] of rows){ const a = allowed(k); if (!a) fresh++;
  console.log((a ? ' allowed ' : '   ISSUE ') + String(v.length).padStart(3), k.slice(0,150), '|', v.slice(0,4).join(' ')); }
console.log(`\n${rows.length} distinct, ${rows.length - fresh} allowed, ${fresh} new`);
process.exit(fresh ? 1 : 0);
