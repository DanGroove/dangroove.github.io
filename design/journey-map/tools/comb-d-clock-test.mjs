// Test-only rAF clock. Product files are loaded directly and stay unchanged.
// Each 100 ms sample advances six real product frame callbacks, then stops.
export async function combDClock(b){
 await b.send('Page.addScriptToEvaluateOnNewDocument',{source:`(()=>{
  const callbacks=new Map();let id=0,now=0;
  window.requestAnimationFrame=fn=>{callbacks.set(++id,fn);return id;};
  window.cancelAnimationFrame=n=>callbacks.delete(n);
  window.__dClock={get now(){return now;},advance(ms){
   const end=now+ms;
   while(now<end-.0001){now=Math.min(end,now+1000/60);const list=[...callbacks.values()];callbacks.clear();for(const fn of list)fn(now);}
   return now;
  }};
 })();`});
}
export async function combDAdvance(b,ms){return b.evaluate('window.__dClock.advance('+ms+')');}
