import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {combDClock,combDAdvance} from './comb-d-clock-test.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
import {createServer} from 'node:http';
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g',tag=process.argv[2]||'before',b=await combBBrowser();
const failures=[];
let served='';const server=createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(served);});await new Promise(r=>server.listen(0,'127.0.0.1',r));
await b.send('Fetch.enable',{patterns:[{urlPattern:'*'}]});b.on('Fetch.requestPaused',p=>{const u=new URL(p.request.url),ok=['data:','blob:'].includes(u.protocol)||u.hostname==='127.0.0.1';void b.send(ok?'Fetch.continueRequest':'Fetch.failRequest',ok?{requestId:p.requestId}:{requestId:p.requestId,errorReason:'BlockedByClient'});});await b.send('Network.setBlockedURLs',{urls:[]});
const quant=a=>{a.sort((a,b)=>a-b);return {p50:a[Math.floor(a.length*.5)]||0,p95:a[Math.floor(a.length*.95)]||0,max:a.at(-1)||0};};
try{
 await combDClock(b);
 for(const[w,h]of[[1440,900],[412,730]])for(const action of['start','wheel','back']){
  await b.size(w,h,2);
  let html=readFileSync('dist/journey-joined.html','utf8');
  html=html.replace('function put(x, y, rad, al, col, added = false) {','function put(x, y, rad, al, col, added = false) { if(window.__fLog&&window.__fId){window.__fDraw[window.__fId]=[x,y];if(window.__fSwitchP===window.__fP&&window.__fId.startsWith("hero")&&SK.src){const hp=SK.src.drawn(+window.__fId.slice(4),[0,0]);window.__fTakeover=Math.max(window.__fTakeover,Math.hypot(x-hp[0],y-hp[1]));}}')
   .replace('SK.skyVisible = false;','SK.skyVisible = false;window.__fDraw={};window.__fP=st.P;if(window.__fLog&&(window.__fBack||!window.__fSeen)&&st.handoffT>0&&st.P<ACTS.hero){window.__fSeen=true;window.__fSwitchP=st.P;window.__fTakeover=0;}')
   .replace('for (const s of SK.list) {\n    let x, y','for (const s of SK.list) {\n    window.__fId=s.i>=0?"hero"+s.i:"map"+SK.list.indexOf(s);let x, y')
   .replace('  // the traveller: one red star','  window.__fId=null;\n  // the traveller: one red star')
   .replace('  const ta = (1 - smooth','  window.__fDraw.traveller=[tx,ty];\n  const ta = (1 - smooth')
   .replace('  ctx.globalAlpha = 1;\n}\n// one still frame','  if(window.__fLog)window.__fFrames.push({P:st.P,stars:window.__fDraw});\n  ctx.globalAlpha = 1;\n}\n// one still frame');
  html=html.replace("// the hero's script has a top-level await",'window.__fSource=()=>({api:!!JN.api,n:SK.n,count:SK.src?.count,ready:window.__hero?.loading===false&&window.__hero?.entering===null});\n// the hero\'s script has a top-level await');
  served=html;await b.send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/'+w+'-'+action});await combBWait(1000);await b.evaluate('document.fonts.ready.then(()=>true)');
  for(let n=0;n<800;n++){await combDAdvance(b,100);await combBWait(5);if(n>80&&await b.evaluate('typeof window.__fSource==="function"&&window.__fSource().api&&window.__fSource().count>0&&window.__hero?.loading===false&&window.__hero?.entering===null'))break;}
  await combBWait(600);const source=await b.evaluate('window.__fSource()');console.log('source '+JSON.stringify(source));if(!source.api||!source.count||!source.ready)throw Error('joined hero source unavailable or entrance unfinished: '+b.errors.join('\n'));
  if(action==='back'){await b.evaluate('window.dispatchEvent(new WheelEvent("wheel",{deltaY:100,cancelable:true,bubbles:true}))');for(let n=0;n<50;n++){await combDAdvance(b,100);await combBWait(5);}await combBWait(300);}
  await b.evaluate('window.__fFrames=[];window.__fLog=true;window.__fSeen=false;window.__fTakeover=null;window.__fSwitchP=null;window.__fBack='+JSON.stringify(action==='back'));
  if(action==='start')await b.evaluate('__jm.next()');else await b.evaluate('window.dispatchEvent(new WheelEvent("wheel",{deltaY:'+(action==='back'?-100:100)+',cancelable:true,bubbles:true}))');
  if(w===412&&action==='start')await b.shot(tag+'-joined-move-0000');
  for(let n=0;n<50;n++){await combDAdvance(b,100);await combBWait(5);if(w===412&&action==='start'&&n%2===1&&n<42)await b.shot(tag+'-joined-move-'+String((n+1)*100).padStart(4,'0'));}const frames=await b.evaluate('window.__fLog=false;window.__fFrames');
  const rows=frames.slice(1).map((f,i)=>{const p=frames[i],steps=Object.entries(f.stars).filter(([k])=>p.stars[k]).map(([k,v])=>[k,Math.hypot(v[0]-p.stars[k][0],v[1]-p.stars[k][1])]).filter(r=>r[1]>1e-5).sort((a,b)=>b[1]-a[1]);return{P:f.P,step:Math.abs(f.P-p.P),key:steps[0]?.[0],...quant(steps.map(r=>r[1]))};});
  const result={w,h,action,frames:frames.length,takeoverError:await b.evaluate('window.__fTakeover'),progress:quant(rows.map(r=>r.step)),stars:quant(rows.map(r=>r.max)),overLimit:rows.filter(r=>r.max>Math.hypot(w,h)*.025).length,rows};
  if(result.overLimit||result.takeoverError===null||result.takeoverError>1)failures.push(w+' '+action+' '+JSON.stringify({...result,rows:undefined}));
  writeFileSync(root+'/'+tag+'-stars-'+w+'-'+action+'.json',JSON.stringify(result));console.log(JSON.stringify({...result,rows:undefined}));
 }
 if(b.errors.length)throw Error(b.errors.join('\n'));
}finally{await b.close();server.close();}
console.log('Failures '+JSON.stringify(failures));process.exitCode=failures.length?1:0;
