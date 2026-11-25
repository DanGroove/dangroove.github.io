import {readFileSync,writeFileSync} from 'node:fs';
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-f';
for(const w of [412,1440]){
 const {traceEvents:e,sample:s}=JSON.parse(readFileSync(root+'/after-trace-'+w+'.json','utf8'));
 const markers=e.filter(x=>x.ph==='X'&&x.name==='FunctionCall'&&x.args?.data?.functionName==='frame');
 const functions=new Map();for(const x of e)if(x.ph==='X'&&x.name==='FunctionCall'){const k=x.args?.data?.functionName||'?';functions.set(k,(functions.get(k)||0)+(x.dur||0)/1000);}
 console.log(w+' sample '+JSON.stringify({start:s.start,end:s.end,long:s.long})+' functions '+JSON.stringify([...functions].sort((a,b)=>b[1]-a[1]).slice(0,12)));
 const threads=new Set(e.filter(x=>x.name==='thread_name'&&x.args?.name==='CrRendererMain').map(x=>x.pid+':'+x.tid));
 const tasks=e.filter(x=>x.ph==='X'&&/RunTask/.test(x.name)&&threads.has(x.pid+':'+x.tid)).sort((a,b)=>b.dur-a.dur).slice(0,4);
 for(const t of tasks)console.log(w+' task '+t.dur/1000+' '+JSON.stringify(e.filter(x=>x.ph==='X'&&x.pid===t.pid&&x.tid===t.tid&&x.ts>=t.ts&&x.ts+(x.dur||0)<=t.ts+t.dur&&x!==t).sort((a,b)=>(b.dur||0)-(a.dur||0)).slice(0,8).map(x=>({name:x.name,ms:x.dur/1000,data:x.args?.data}))));
}
