// COMB-S, 2026-11-27: unmasked base/new pixels; the idle clock alone is synchronized.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rBrowser,gRoot,save} from './comb-r-fixture.mjs';
import {png} from './comb-n-fixture.mjs';
const b=await rBrowser(),base=readFileSync(gRoot+'/base/journey-map.html','utf8'),rows=[],fail=[];let useBase=false;
b.patch=html=>{if(useBase){const at=html.lastIndexOf('window.__g='),hook=html.slice(at,html.indexOf('</script>',at)),end=base.indexOf('</script>',base.indexOf('// ---- main.mjs ----'));html=base.slice(0,end)+'\n'+hook+'\n'+base.slice(end);}
 // The brief compares equal idle poses. This replaces only the paused clock's read,
 // using the same deterministic global clock as the base; no drawing is masked.
 return html.replace('return layer ? layer.time : FD.now;','return FD.now;');};
try{for(const[w,h]of[[1920,950],[412,915]])for(const view of['overview','explore','wayfinder','beacon','serpent']){const pair=[];await b.size(w,h,w<641,1);
 for(const old of[true,false]){useBase=old;await b.page(false,view==='explore'?'end':'map');if(view==='explore'){await b.until('__g.TRIP_EL.exploreReady',120000);await b.click('.go-next',w<641);await b.until('__g.EX.active&&!__g.EX.motion');}else if(view!=='overview'){await b.click('#mk-'+view,w<641);await b.until('__g.FD.st.focusK===1');}
 await b.advance(2000);await b.raw('Promise.all(document.getAnimations().filter(a=>Number.isFinite(a.effect.getComputedTiming().endTime)).map(a=>a.finished.catch(()=>{}))).then(()=>true)');const name='s-picture-'+w+'-'+view+'-'+(old?'base':'new');await b.shotAt(name,20000);pair.push(png(gRoot+'/'+name+'.png'));}
 const[a,z]=pair;let max=0,over3=0;const box=[Infinity,Infinity,-Infinity,-Infinity];for(let y=0;y<a.h;y++)for(let x=0;x<a.w;x++){const at=(y*a.w+x)*4;let d=0;for(let c=0;c<4;c++)d=Math.max(d,Math.abs(a.pixels[at+c]-z.pixels[at+c]));max=Math.max(max,d);if(d>3){over3++;box[0]=Math.min(box[0],x);box[1]=Math.min(box[1],y);box[2]=Math.max(box[2],x);box[3]=Math.max(box[3],y);}}
 rows.push({w,h,view,max,over3,box});if(max>3)fail.push(w+' '+view+' max '+max+'/255');console.log(JSON.stringify(rows.at(-1)));
 }if(b.errors.length)fail.push(...b.errors);
}finally{await b.close();save('s-picture-results',{rows,fail});}assert.deepEqual(fail,[]);
