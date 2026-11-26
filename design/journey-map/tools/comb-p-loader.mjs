// Inherited fixture artifact routing and cleanup only. Assertions are unchanged here.
export async function load(url,context,next){
 const result=await next(url,context);if(!url.includes('/design/journey-map/tools/'))return result;
 let s=String(result.source).replace(/journey-map-runs\/comb-(?:g3|g|l2|l|c|n|o)(?=['/])/g,'journey-map-runs/comb-p');
 if(url.endsWith('/comb-o-fixture.mjs'))s=s.replaceAll("!=='comb-o'","!=='comb-p'").replace('COMB_RUN=comb-o','COMB_RUN=comb-p');
 if(/\/(comb-browser|comb-g-browser-test|comb-g3-browser-test|comb-l-browser-test|comb-d-browser-test)\.mjs$/.test(url)){
  s=s.replace('mkdirSync, existsSync','mkdirSync, existsSync, rmSync').replace('mkdirSync,existsSync','mkdirSync,existsSync,rmSync');
  const child=url.endsWith('/comb-browser.mjs')?'process':'child',socket=child==='process'||url.endsWith('/comb-d-browser-test.mjs')?'socket':'ws';
  const close=`async close(){const exited=${child}.exitCode!==null||${child}.signalCode!==null?Promise.resolve():new Promise(r=>${child}.once('exit',r));try{await send('Browser.close',{},null);}catch{}${socket}.close();if(${child}.exitCode===null&&${child}.signalCode===null)${child}.kill();await exited;const absolute=resolve(profile),allowed=resolve('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-p');if(!absolute.startsWith(allowed+'/')&&!absolute.startsWith(allowed+'\\\\'))throw Error('Profile outside run folder');for(let attempt=0;attempt<50;attempt++){try{rmSync(absolute,{recursive:true,force:true,maxRetries:2,retryDelay:100});break;}catch(error){if(!existsSync(absolute))break;if(attempt===49)throw error;await new Promise(r=>setTimeout(r,100));}}}`;
  const pattern=/async close\(\)\s*\{\s*try\s*\{\s*await send\('Browser.close',[\s\S]*?\.kill\(\);\s*\}/;
  if(!pattern.test(s))throw Error('Missing inherited browser close: '+url);s=s.replace(pattern,close);
 }
 return{...result,source:s};
}
