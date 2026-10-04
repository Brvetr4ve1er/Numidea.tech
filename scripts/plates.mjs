#!/usr/bin/env node
/**
 * Plate pipeline — `node scripts/plates.mjs <dir-of-source-jpgs>`.
 *
 * Turns the generated engravings (white line art on black, from Magnific;
 * the sources live in the account's Personal project, not in this repo) into
 * the luminance masks in assets/illus/*.webp, and writes .tmp/poly.json — the
 * skyline polygons that clip each vista layer's fill (see BRAND.md, "The
 * atlas"). Expects far/mid/near/strata/dunes/light/arch/bench/lantern/coins.jpg.
 * Every output is checked for polarity: a mask that came back inverted would
 * paint as a solid block.
 */
import sharp from 'sharp';
const G=process.argv[2], O='assets/illus/';
const lv = s => s.greyscale().linear(1.7,-30);
async function out(name, s, w, max=110, q=62){
  const buf = await lv(s).resize(w).toColourspace('b-w').toBuffer();
  const st = await sharp(buf).stats();
  const mean = st.channels[0].mean;
  if (mean > max) throw new Error(name+' polarity? mean '+mean);
  await sharp(buf).webp({quality:q, effort:6}).toFile(O+name+'.webp');
  const m=await sharp(O+name+'.webp').metadata();
  console.log(name, m.width+'x'+m.height, 'mean', mean.toFixed(1));
}
// skyline polygon: first bright row per column, widened by a running min so the fill hugs outlines
async function skyline(file, cols=160){
  const {data,info}=await sharp(file).greyscale().blur(1.2).raw().toBuffer({resolveWithObject:true});
  const W=info.width,H=info.height, top=[];
  for(let c=0;c<=cols;c++){
    const x0=Math.min(W-1,Math.round(c/cols*(W-1)));let best=H;
    for(let x=Math.max(0,x0-6);x<=Math.min(W-1,x0+6);x++){for(let y=0;y<H;y++){if(data[y*W+x]>70){best=Math.min(best,y);break}}}
    top.push(best);
  }
  // fill should sit a few px inside the outline so the line itself stays visible
  const pts=top.map((y,i)=>`${(i/cols*100).toFixed(2)}% ${Math.min(100,(y/H*100+1.2)).toFixed(2)}%`);
  return `polygon(${pts.join(',')},100% 100%,0% 100%)`;
}
const j=f=>sharp(G+'/'+f+'.jpg');
await out('vista-far', j('far'), 1600);
await out('vista-mid', j('mid'), 1600);
await out('vista-near', j('near'), 1500, 110, 50);
import fs from 'fs';fs.mkdirSync('.tmp',{recursive:true});fs.writeFileSync('.tmp/poly.json',JSON.stringify({far:await skyline(G+'/far.jpg'),mid:await skyline(G+'/mid.jpg'),near:await skyline(G+'/near.jpg')}));
// strata: drop the frame and inpaint the numbered markers with a patch of the
// same stratum taken from beside each one
{
  const base=j('strata');
  const comps=[];
  for(const y of [62,118,190,280,378,540]){
    const R=24, src=await sharp(G+'/strata.jpg').extract({left:792-R-70,top:y-R,width:2*R,height:2*R}).ensureAlpha()
      .composite([{input:Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${2*R}" height="${2*R}"><circle cx="${R}" cy="${R}" r="${R-1}" fill="#fff"/></svg>`),blend:'dest-in'}]).png().toBuffer();
    comps.push({input:src,left:792-R,top:y-R});
  }
  const b=await base.composite(comps).toBuffer();
  await out('strata', sharp(b).extract({left:26,top:14,width:1532,height:644}), 1100, 160, 38);
}
await out('dunes', j('dunes').extract({left:30,top:0,width:1540,height:612}), 1500, 110, 55);
await out('lighthouse', j('light').extract({left:46,top:36,width:1286,height:696}), 1100, 110, 52);
await out('arch', j('arch'), 1000, 110, 50);
await out('bench', j('bench'), 1100);
await out('lantern', j('lantern'), 560);
for(const [n,cx,cy] of [['coin-king',512,307],['coin-horse',265,674],['coin-palm',760,674]])
  await out(n, j('coins').extract({left:cx-212,top:cy-212,width:424,height:424}), 320);
