// Audit the saved load traces without rerunning the deferred cost machinery.
import {readFileSync} from 'node:fs';
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-e';
let failed=0;
for(const page of ['journey-map','journey-joined'])for(const w of[412,1440]){
 const trace=JSON.parse(readFileSync(root+'/warm-'+page+'-'+w+'.json','utf8')).traceEvents;
 // The first inline module in each packed page is the map's own module bundle.
 const loads=trace.filter(e=>e.ph==='X'&&e.name==='v8.evaluateModule'&&e.args?.data?.url?.endsWith('/'+page+'.html')).sort((a,b)=>a.ts-b.ts);
 const mapLoad=loads[0],ms=(mapLoad?.dur||0)/1000;
 console.log(page+' '+w+': map module evaluation '+ms.toFixed(3)+' ms; strict load-through-first-glide 16 ms gate '+(ms>0&&ms<=16?'PASS':'FAIL')+'. See the full renderer trace for layout/paint and other tasks.');
 if(!mapLoad||ms>16)failed++;
}
process.exitCode=failed?1:0;
