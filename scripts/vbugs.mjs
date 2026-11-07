#!/usr/bin/env node
/**
 * Layout scanner — `npm run vbugs`. Renders the home page (one page per
 * language: index.html, en/, ar/, opened directly) and the price guide
 * (tarifs/, en/tarifs/, ar/tarifs/, the same way) at 7 widths x 4
 * theme/language pairs, and hub/ at 1440, 1024, 768 and 390 (one paper
 * palette since the character bible, 56f29c1: no void-theme, no night); and
 * reports overlapping text, text escaping its card, text clipped by an
 * overflow box, stretched images and horizontal scroll (any: the document's
 * scrollWidth is its clientWidth, to the pixel). Since 2026-11-06 also,
 * at every width, visible text under the floor (TINY: 12px, 13px for a run
 * in Arabic script; screen-reader text, aria-hidden glyphs and
 * data-decorative ornament aside) and, at 390 and 360, a link, button or
 * summary whose hit box is under 44x44 (SMALLTAP; a link inline in running
 * text, inside a p, li or dd, is the sentence's and exempt, as in audit.mjs;
 * a stretched link counts at the size of the box its ::after fills).
 * Text in a fixed layer (the phone contact bar .m-contact, the back-to-top
 * button) lies over the page on purpose, as the bar does over whatever
 * scrolls under it: it is compared for OVERLAP with the other fixed text
 * only. Content of closed <details> is skipped (it keeps stale layout
 * boxes). Each issue is named by its page first ("index …", "hub …").
 *
 * Exits non-zero on any issue not in scripts/vbugs-allow.json, where each
 * accepted issue (matched by prefix) carries the reason it is acceptable.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { serve, launch } from './lib/serve.mjs';
import { ROOT } from './site.mjs';
const srv = await serve();
// [page, path, width, what it is set to (localStorage), how a row names it]
const combos=[];
// the home page in a language is its own page (build-lang.mjs): opened there,
// not through the root, which would send the stored language on in a second load
const HOME={fr:'/',en:'/en/',ar:'/ar/'};
const TARIFS={fr:'/tarifs/',en:'/en/tarifs/',ar:'/ar/tarifs/'};
for(const w of [1440,1280,1024,768,414,390,360])for(const [t,l] of [['arcanum','fr'],['arcanum','ar'],['engineering','en'],['daylight','fr']]){
 combos.push(['index',HOME[l],w,{'numidea-theme':t,'numidea-lang':l},`${w}/${t}/${l}`]);
 combos.push(['tarifs',TARIFS[l],w,{'numidea-theme':t,'numidea-lang':l},`${w}/${t}/${l}`]);
}
// the Studio (hub/) in French and Arabic, the character bible (hub/bible/) as before
for(const w of [1440,1024,768,390]){
 combos.push(['hub','/hub/',w,{'numidea-lang':'fr'},`hub ${w}`]);
 combos.push(['hub','/hub/',w,{'numidea-lang':'ar'},`hub ${w}/ar`]);
 combos.push(['bible','/hub/bible/',w,{},`bible ${w}`]);
}
const b = await launch();
const agg={};
for(const [page,path,w,init,label] of combos){
 const p=await b.newPage({viewport:{width:w,height:w<600?800:900}});
 await p.addInitScript((init)=>{for(const k in init)localStorage.setItem(k,init[k])},init);
 await p.goto(srv.base+path,{waitUntil:'networkidle'});
 // both pages scroll smoothly (html{scroll-behavior:smooth}): left on, each
 // scrollTo below only began a glide the next one cut short, the scan never
 // reached the foot of the page, and whatever reveals on scroll stayed at
 // opacity 0 and was skipped as hidden (until 2026-10-28)
 await p.evaluate(async()=>{document.documentElement.style.scrollBehavior='auto';const H=document.body.scrollHeight;for(let y=0;y<H;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,40))}scrollTo(0,0)});
 await p.waitForTimeout(1500);
 await p.addStyleTag({content:'[data-parallax]{translate:none!important}*{transition:none!important}'});
 await p.waitForTimeout(100);
 const r=await p.evaluate((w)=>{
  const out=[];const vis=e=>{const cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden')return false;let a=e;while(a){if(parseFloat(getComputedStyle(a).opacity)<.1)return false;a=a.parentElement}return true};
  // visually hidden on purpose (.sr-only: a 1px box clipped to nothing): screen-reader text, never a visual bug
  const srOnly=e=>{for(let a=e;a;a=a.parentElement){const c=getComputedStyle(a);if(c.clip==='rect(0px, 0px, 0px, 0px)'&&a.clientWidth<=1)return true}return false};
  // inside a closed <details> and not in that details' own <summary>, at any
  // depth: not painted, but its stale layout box stays. Only the nearest
  // <details> was asked once, so the summary of a <details> nested in a closed
  // one ("Sources et méthode" in the folded pricing block) counted as shown and
  // "overlapped" the founder text below it (2026-10-28, once the scan really
  // reached the bottom of the page)
  const folded=e=>{for(let a=e;a&&a.parentElement;a=a.parentElement){const d=a.parentElement;if(d.tagName==='DETAILS'&&!d.open&&!(a.tagName==='SUMMARY'&&a===d.querySelector(':scope>summary')))return true}return false};
  // the fixed layer an element is in (position:fixed on it or an ancestor), or null
  const fixedOf=e=>{for(let a=e;a&&a!==document.body;a=a.parentElement)if(getComputedStyle(a).position==='fixed')return a;return null};
  const sel=e=>{let s=e.tagName.toLowerCase();if(e.id)s+='#'+e.id;else if(e.classList.length)s+='.'+[...e.classList].slice(0,2).join('.');const sec=e.closest('section,header,footer,aside,.vista');return (sec?(sec.id||sec.className.split(' ')[0]):'body')+' '+s};
  // text leaf boxes
  const texts=[];const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
  while(n=tw.nextNode()){if(!n.textContent.trim())continue;const el=n.parentElement;if(!el||el.closest('[aria-hidden="true"],script,style,noscript,.modal:not(.open),dialog:not([open]),.cv-panel:not(.open)'))continue;if(folded(el))continue;if(!vis(el)||srOnly(el))continue;
   const rg=document.createRange();rg.selectNodeContents(n);for(const rc of rg.getClientRects()){if(rc.width<3||rc.height<3)continue;texts.push({el,n,x:rc.left,y:rc.top+scrollY,w:rc.width,h:rc.height,t:n.textContent.trim().slice(0,24),fixed:fixedOf(el)})}}
  // 1 overlapping text from different elements
  texts.sort((a,b)=>a.y-b.y);
  for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length&&texts[j].y<texts[i].y+texts[i].h;j++){const a=texts[i],c=texts[j];if(a.el===c.el||a.el.contains(c.el)||c.el.contains(a.el))continue;
    if(!a.fixed!==!c.fixed)continue;   // a fixed layer over the page, by design
    const ix=Math.min(a.x+a.w,c.x+c.w)-Math.max(a.x,c.x),iy=Math.min(a.y+a.h,c.y+c.h)-Math.max(a.y,c.y);
    if(ix>4&&iy>Math.min(a.h,c.h)*.35)out.push('OVERLAP '+sel(a.el)+' "'+a.t+'" × '+sel(c.el)+' "'+c.t+'"')}
  // 2 text outside its card/box ancestor (bordered/background container). A box
  // that scrolls on an axis (overflow auto/scroll: the market table's labelled
  // .mk-scroll region, 640px wide at least, on the price guide) holds what lies
  // past its edge there, reached by scrolling, so only its other axis counts
  for(const tx of texts){let c=tx.el.parentElement;while(c&&c!==document.body){const cs=getComputedStyle(c);if((cs.borderTopWidth!=='0px'&&cs.borderStyle!=='none')||cs.backgroundColor!=='rgba(0, 0, 0, 0)'||cs.backgroundImage!=='none')break;c=c.parentElement}
    if(!c||c===document.body)continue;const r=c.getBoundingClientRect();const L=r.left,R=r.right,T=r.top+scrollY,B=r.bottom+scrollY;
    const cc=getComputedStyle(c),sx=/auto|scroll/.test(cc.overflowX),sy=/auto|scroll/.test(cc.overflowY);
    if((!sx&&(tx.x<L-2||tx.x+tx.w>R+2))||(!sy&&(tx.y<T-2||tx.y+tx.h>B+2)))out.push('ESCAPES '+sel(tx.el)+' "'+tx.t+'" from '+sel(c))}
  // 3 clipped text (overflow hidden, content wider/taller), excluding ellipsis
  for(const e of document.querySelectorAll('body *')){if(!vis(e)||e.closest('[aria-hidden="true"]'))continue;const cs=getComputedStyle(e);if(cs.overflowX==='visible'&&cs.overflowY==='visible')continue;if(cs.textOverflow==='ellipsis')continue;
    if(srOnly(e))continue;
    if(!e.textContent.trim())continue;if(folded(e))continue;if(e.scrollWidth>e.clientWidth+2&&cs.overflowX!=='auto'&&cs.overflowX!=='scroll'&&e.clientWidth>0){
      // what is cut off: text (HCLIP, always an issue unless allowed by name) or only decoration
      // (HCLIP-DECOR: nothing rendered past the box carries text of its own; an element
      // under a display:none parent has a zero box and is not rendered)
      const r=e.getBoundingClientRect(),own=(n)=>[...n.childNodes].some((c)=>c.nodeType===3&&c.textContent.trim());
      const cut=(own(e)&&e.children.length===0)?e:[...e.querySelectorAll('*')].find((d)=>{if(!own(d)||d.closest('[aria-hidden="true"]')||!vis(d))return false;const q=d.getBoundingClientRect();return q.width>0&&q.height>0&&(q.left<r.left-2||q.right>r.right+2)});
      out.push(cut?'HCLIP '+sel(e)+' '+e.scrollWidth+'>'+e.clientWidth+' cuts '+sel(cut)+' "'+cut.textContent.trim().slice(0,30)+'"':'HCLIP-DECOR '+sel(e)+' '+e.scrollWidth+'>'+e.clientWidth)}}
  // 4 images whose box aspect differs from intrinsic with object-fit fill (stretch)
  for(const im of document.images){if(!vis(im)||!im.naturalWidth)continue;const r=im.getBoundingClientRect();if(r.width<10)continue;const cs=getComputedStyle(im);if(cs.objectFit!=='fill')continue;const d=Math.abs((r.width/r.height)/(im.naturalWidth/im.naturalHeight)-1);if(d>.03)out.push('STRETCH '+sel(im)+' '+(d*100).toFixed(0)+'%')}
  // 5 element wider than viewport: the document scrolls sideways by even a pixel
  const dw=document.documentElement.clientWidth;if(document.documentElement.scrollWidth!==dw)out.push('HSCROLL '+document.documentElement.scrollWidth+'>'+dw);
  // 6 text under the floor: 12px, 13px for a run in Arabic script (its
  // letters are smaller on the same size). Read on each text node's parent;
  // aria-hidden, sr-only and closed content are already out of texts, and
  // data-decorative marks a glyph that is ornament (sweep.mjs reads it too)
  const AR=/[\u0600-\u06ff\u0750-\u077f\ufb50-\ufdff\ufe70-\ufeff]/;
  const tiny=new Set();
  for(const tx of texts){if(tiny.has(tx.el)||tx.el.closest('[data-decorative]'))continue;const fs=parseFloat(getComputedStyle(tx.el).fontSize),min=AR.test(tx.n.textContent)?13:12;
    if(fs<min-.05){tiny.add(tx.el);out.push('TINY '+sel(tx.el)+' "'+tx.t+'" '+(Math.round(fs*10)/10)+'px<'+min)}}
  // 7 on phones (390 and 360): every link, button and summary is a 44x44 hit
  // box at least; a link inline in running text (p, li, dd) is exempt
  if(w<=390)for(const e of document.querySelectorAll('a[href],button,summary')){
    if(!vis(e)||srOnly(e)||folded(e)||e.closest('[inert],[hidden],[aria-hidden="true"],.modal:not(.open),dialog:not([open]),.cv-panel:not(.open)'))continue;
    const cs=getComputedStyle(e);if(cs.display==='inline'&&e.closest('p,li,dd'))continue;
    // a stretched link (an absolute ::after at inset 0, as .proj h3 a over
    // its card) is the size of the box it fills
    const af=getComputedStyle(e,'::after'),cb=cs.position!=='static'?e:e.offsetParent;
    const r=(af.content!=='none'&&af.position==='absolute'&&af.top==='0px'&&af.left==='0px'&&cb?cb:e).getBoundingClientRect();if(!r.width||!r.height||r.bottom+scrollY<=0)continue;
    if(r.width<43.5||r.height<43.5)out.push('SMALLTAP '+sel(e)+' "'+(e.getAttribute('aria-label')||e.textContent).trim().replace(/\s+/g,' ').slice(0,24)+'" '+Math.round(r.width)+'x'+Math.round(r.height))}
  return out},w);
 for(const x of r){const k=page+' '+x;(agg[k]=agg[k]||[]).push(label)}
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
