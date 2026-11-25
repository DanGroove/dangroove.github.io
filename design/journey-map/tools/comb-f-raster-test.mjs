// Native 3x Explore crops against freshly rendered SVG/star/deep layers.
// The product is read only; all layer swaps exist in the test page's memory.
import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {combDClock,combDAdvance} from './comb-d-clock-test.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
const b=await combBBrowser(),root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-f',rows=[],fail=[];
const html=readFileSync('dist/journey-map.html','utf8').replace('</script>','\nwindow.__fRaster={SK,DP,FT,FD,EX,VIEW,starsFrame,depthDeep};\n</script>');
const tick=async ms=>{for(let t=0;t<ms;t+=100)await combDAdvance(b,Math.min(100,ms-t));};
try{
 await combDClock(b);
 for(const dpr of [1,1.5,2.625]){
  await b.size(1440,900,dpr);await b.send('Page.navigate',{url:'data:text/html;base64,'+Buffer.from(html).toString('base64')});await combBWait(700);await b.evaluate('document.fonts.ready.then(()=>true)');await tick(2000);await b.evaluate('__jm.go("end",{instant:true})');await tick(1000);await b.evaluate('document.querySelector(".go-next").click()');await tick(2200);
  await b.evaluate('(()=>{const p=__jm.finds.place("well"),dy=-Math.log(3)/.0016/6;for(let n=0;n<6;n++)window.dispatchEvent(new WheelEvent("wheel",{clientX:p[0],clientY:p[1],deltaY:dy,bubbles:true,cancelable:true}));})()');await tick(2200);
  const crop=await b.evaluate('(()=>{const p=__jm.finds.place("well");return {x:Math.max(0,Math.min(1140,p[0]-150)),y:Math.max(0,Math.min(600,p[1]-150)),width:300,height:300,scale:1}})()');
  await b.evaluate('(()=>{window.__fVisibility=[...document.getElementById("stage").children].map(e=>[e,e.style.visibility]);for(const[e]of __fVisibility)e.style.visibility="hidden";document.querySelector(".jm-review").style.visibility="hidden";})()');
  for(const kind of ['svg','stars','deep']){
   await b.evaluate(`(()=>{const R=__fRaster,id=${JSON.stringify(kind==='svg'?'map':kind)},e=document.getElementById(id);window.__fSource=e;for(const[n]of __fVisibility)n.style.visibility='hidden';e.style.visibility='visible';if(${JSON.stringify(kind)}==='stars')R.starsFrame(R.FD.now,R.FD.st,[.5,.5],{look:[0,0]});if(${JSON.stringify(kind)}==='deep')R.depthDeep(R.FD.st,R.DP.look);})()`);
   const a=(await b.send('Page.captureScreenshot',{format:'png',clip:crop})).data;writeFileSync(root+'/raster-'+dpr+'-'+kind+'-native.png',Buffer.from(a,'base64'));
   await b.evaluate(`(()=>{const R=__fRaster,e=window.__fSource;let copy;if(${JSON.stringify(kind)}==='svg'){copy=e.cloneNode(true);copy.id='map-direct';copy.style.transform='none';copy.style.willChange='auto';}else{copy=document.createElement('canvas');copy.width=Math.round(R.VIEW.w*Math.min(3,devicePixelRatio));copy.height=Math.round(R.VIEW.h*Math.min(3,devicePixelRatio));copy.style.cssText='position:absolute;inset:0;width:100%;height:100%';const ctx=copy.getContext('2d');if(${JSON.stringify(kind)}==='stars'){const old=R.SK.ctx;R.SK.ctx=ctx;R.starsFrame(R.FD.now,R.FD.st,[.5,.5],{look:[0,0]});R.SK.ctx=old;}else{const old=R.DP.dc;R.DP.dc=ctx;R.depthDeep(R.FD.st,R.DP.look);R.DP.dc=old;}}e.style.visibility='hidden';copy.style.visibility='visible';document.getElementById('stage').appendChild(copy);window.__fDirect=copy;})()`);
   const z=(await b.send('Page.captureScreenshot',{format:'png',clip:crop})).data;writeFileSync(root+'/raster-'+dpr+'-'+kind+'-direct.png',Buffer.from(z,'base64'));
   const r=await b.evaluate(`(async()=>{const images=await Promise.all(${JSON.stringify([a,z])}.map(async data=>{const i=new Image();i.src='data:image/png;base64,'+data;await i.decode();return i;}));const buffers=images.map(i=>{const c=document.createElement('canvas');c.width=i.naturalWidth;c.height=i.naturalHeight;const x=c.getContext('2d');x.drawImage(i,0,0);return x.getImageData(0,0,c.width,c.height).data;});let changed=0,max=0;for(let n=0;n<buffers[0].length;n+=4){let d=0;for(let k=0;k<4;k++)d=Math.max(d,Math.abs(buffers[0][n+k]-buffers[1][n+k]));if(d>1)changed++;max=Math.max(max,d);}return {pixels:buffers[0].length/4,changed,max,fraction:changed/(buffers[0].length/4)};})()`);
   rows.push({dpr,kind,...r});console.log(JSON.stringify(rows.at(-1)));if(r.fraction>.005||r.max>8)fail.push(dpr+' '+kind+' direct raster mismatch');await b.evaluate('__fDirect.remove();__fSource.style.visibility="hidden"');
  }
 }
 if(b.errors.length)fail.push(...b.errors);
}finally{await b.close();}
writeFileSync(root+'/raster-comparison.json',JSON.stringify({rows,fail,tolerance:'<=0.5% pixels differ by >1/255; maximum channel delta <=8/255'},null,2));console.log('Failures '+JSON.stringify(fail));process.exitCode=fail.length?1:0;
