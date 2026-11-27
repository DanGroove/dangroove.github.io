// COMB-S, 2026-11-27: route inherited evidence into this run; never delete.
import {readFileSync} from 'node:fs';
const phase=process.env.COMB_PHASE||'baseline';
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-s';
const fsSource=`import * as fs from 'node:fs';
export * from 'node:fs';
const root=${JSON.stringify(root)},phase=${JSON.stringify(phase)},part='C:/Users/Admin/Documents/Portfolio/journey-map-runs/'+process.env.COMB_RUN;
const text=p=>p instanceof URL?decodeURIComponent(p.pathname).replace(/^\\/([A-Za-z]:)/,'$1'):String(p).replaceAll('\\\\','/');
const original=p=>text(p).replace('/comb-s/'+phase+'/artifacts/','/');
const readable=p=>fs.existsSync(p)?p:original(p);
const writable=p=>{const s=text(p);if(s!==root&&!s.startsWith(root+'/')&&!(process.env.COMB_RUN!=='comb-s'&&(s===part||s.startsWith(part+'/'))))throw Error('COMB-S protected write: '+s);return p;};
export const readFileSync=(p,...a)=>fs.readFileSync(readable(p),...a);
export const existsSync=p=>fs.existsSync(p)||fs.existsSync(original(p));
export const writeFileSync=(p,...a)=>fs.writeFileSync(writable(p),...a);
export const appendFileSync=(p,...a)=>fs.appendFileSync(writable(p),...a);
export const mkdirSync=(p,...a)=>fs.mkdirSync(writable(p),...a);
export const createWriteStream=(p,...a)=>fs.createWriteStream(writable(p),...a);
export const rmSync=()=>{};
export const unlinkSync=()=>{throw Error('COMB-S: deletion prohibited');};
export default {...fs,readFileSync,existsSync,writeFileSync,appendFileSync,mkdirSync,createWriteStream,rmSync,unlinkSync};`;
const virtual='data:text/javascript;base64,'+Buffer.from(fsSource).toString('base64');
export async function resolve(spec,context,next){if(spec==='node:fs'&&!context.parentURL?.startsWith('data:'))return{url:virtual,shortCircuit:true};try{return await next(spec,context);}catch(e){const old=spec.replace('/comb-s/'+phase+'/artifacts/','/');if(old!==spec)return next(old,context);throw e;}}
export async function load(url,context,next){const r=await next(url,context);if(!url.includes('/design/journey-map/tools/'))return r;
 let s=String(r.source);
 if(!url.endsWith('/comb-s-loader.mjs')&&!url.endsWith('/comb-s-suite-test.mjs'))s=s.replace(/journey-map-runs\/(comb-[\w]+)(?=['/])/g,(full,part)=>part==='comb-s'?full:'journey-map-runs/comb-s/'+phase+'/artifacts/'+part);
 s=s.replace(/'profile-'\s*\+\s*Date\.now\(\)/g,"'profile-'+globalThis.process.pid+'-'+Date.now()");
 return{...r,source:s};}
