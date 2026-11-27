// Native SVG raster clipping and retained keyboard readings.
import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
const b=await combBBrowser(),fail=[];
try{
 for(const[w,h]of[[412,730],[1440,900]]){
  await b.size(w,h);await b.page('dist/journey-map.html');await b.evaluate('window.__jm.go("map",{instant:true})');await combBWait(1000);
  const r=await b.evaluate(`(async()=>{
   const light=document.querySelector('.bc-light'),beam=light.querySelector('.bc-beam'),clip=document.getElementById('beacon-frame'),host=light.parentElement;
   let outside=0,lit=0;const canvas=document.createElement('canvas');canvas.width=600;canvas.height=900;const ctx=canvas.getContext('2d');
   for(let a=0;a<360;a+=30){
    const copy=light.cloneNode(true);copy.querySelector('.bc-beam path').setAttribute('fill','white');copy.querySelector('.bc-beam').setAttribute('transform','translate(0 -34) rotate('+a+')');
    const svg='<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900"><defs>'+clip.outerHTML+'</defs><g transform="'+host.getAttribute('transform')+'">'+copy.outerHTML+'</g></svg>';
    const img=new Image();img.src='data:image/svg+xml;base64,'+btoa(svg);await img.decode();ctx.clearRect(0,0,600,900);ctx.drawImage(img,0,0);const data=ctx.getImageData(0,0,600,900).data;
    for(let y=0;y<900;y++)for(let x=0;x<600;x++){const alpha=data[(y*600+x)*4+3];if(alpha>16){lit++;if(x<23||x>=577||y<23||y>=877)outside++;}}
   }
   return {outside,lit,clip:!!light.closest('[clip-path]'),rect:clip.querySelector('rect').outerHTML};
  })()`);
  console.log(w+' beam at 12 aim angles: '+JSON.stringify(r));if(r.outside||!r.lit||!r.clip)fail.push(w+' clip raster failed');
  for(let i=0;i<3;i++){await b.evaluate('document.getElementById("f-beacon").dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true,cancelable:true}))');await combBWait(2100);}
  const s=await b.evaluate('window.__jm.finds.state("beacon")');console.log(w+' read '+JSON.stringify(s.read));if(s.fire!==3||s.read.some(v=>!v))fail.push(w+' readings failed');
 }
 if(b.errors.length)fail.push(...b.errors);
}finally{await b.close();}
console.log('Failures: '+JSON.stringify(fail));process.exitCode=fail.length?1:0;
