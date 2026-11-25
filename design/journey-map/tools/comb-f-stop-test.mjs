// Close only the named local test fixture after a bounded evidence run.
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const path=resolve(process.argv[2]||''),root=resolve('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g2');
if(!path.startsWith(root+'\\'))throw Error('not a comb-f profile');
const [port,endpoint]=readFileSync(path+'/DevToolsActivePort','utf8').trim().split('\n');
const socket=new WebSocket('ws://127.0.0.1:'+port+endpoint);await new Promise((r,j)=>{socket.onopen=r;socket.onerror=j;});socket.send(JSON.stringify({id:1,method:'Browser.close'}));await new Promise(r=>{socket.onclose=r;setTimeout(r,3000);});socket.close();console.log('Closed bounded comb-f fixture.');
