// Phone smoke test over adb-forwarded Chrome DevTools. Node 22+, no dependencies.
// Needs: adb forward tcp:9222 localabstract:chrome_devtools_remote, and fps.html open in phone Chrome.
const list = await (await fetch('http://127.0.0.1:9222/json/list')).json();
const page = list.find(t => t.type === 'page' && t.url.includes('localhost:8765/fps.html'));
if (!page) { console.log('NO fps.html TAB. Tabs: ' + JSON.stringify(list.map(t => t.url))); process.exit(2); }
const ws = new WebSocket('ws://127.0.0.1:9222' + new URL(page.webSocketDebuggerUrl).pathname);
await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = no; });
let id = 0; const pend = new Map();
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } };
const send = (method, params = {}) => new Promise(ok => { const i = ++id; pend.set(i, ok); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const m = await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true }); return m.result?.result?.value ?? m; };
await new Promise(r => setTimeout(r, 3000));
const r = await ev(`(()=>{const t=__fps.times.slice(-361),d=t.slice(1).map((x,i)=>x-t[i]).sort((a,b)=>a-b);
return {fps:+((t.length-1)*1000/(t.at(-1)-t[0])).toFixed(1),p50:+d[d.length>>1].toFixed(2),p95:+d[Math.floor(d.length*.95)].toFixed(2),max:+d.at(-1).toFixed(2),
over9ms:d.filter(x=>x>9).length,frames:d.length,dpr:devicePixelRatio,css:innerWidth+'x'+innerHeight,screen:screen.width+'x'+screen.height,
reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,visible:document.visibilityState,ua:navigator.userAgent,taps:__fps.taps}})()`);
console.log(JSON.stringify(r, null, 1)); ws.close();
