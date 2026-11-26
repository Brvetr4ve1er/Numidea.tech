const { chromium } = require('playwright');const path=require('path'),fs=require('fs');const dir='sitemenu';
(async()=>{const b=await chromium.launch();
for (const vp of [[1440,900],[1280,720],[1920,1080],[390,844]]){
const c=await b.newContext({viewport:{width:vp[0],height:vp[1]}});
await c.route('http://nl.test/**',r=>{const u=new URL(r.request().url());const f=path.resolve(dir,'.'+u.pathname);r.fulfill({status:200,body:fs.readFileSync(f),contentType:{'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.woff2':'font/woff2'}[path.extname(f)]})});
const p=await c.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://nl.test/index.html');
const cls=await p.evaluate(()=>new Promise(r=>{let v=0;new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)v+=e.value}).observe({type:'layout-shift',buffered:true});setTimeout(()=>r(v),4500)}));
await p.waitForTimeout(9000);
const inf=await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').map(a=>[a.animationName||a.transitionProperty,a.effect.getComputedTiming().iterations]));
const ov=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
await p.screenshot({path:'siteshots/v-'+vp[0]+'.png'});
console.log(vp.join('x'),'CLS',cls.toFixed(4),'running',JSON.stringify(inf),'overflowX',ov);await c.close()}
await b.close()})();
