// COMB-T, 2026-11-27: inherited probes write only run evidence; deletion is disabled.
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-t';
const source=`import * as fs from 'node:fs'; import path from 'node:path'; export * from 'node:fs';
const root=${JSON.stringify(root)};
const str=p=>p instanceof URL?decodeURIComponent(p.pathname).replace(/^\\/([A-Za-z]:)/,'$1'):String(p).replaceAll('\\\\','/');
const old=p=>str(p).replace(/\\/comb-t\\/artifacts\\/(comb-[a-z0-9]+)\\//,'/$1/');
const readable=p=>fs.existsSync(p)?p:old(p);
const writable=p=>{const s=str(p),part='C:/Users/Admin/Documents/Portfolio/journey-map-runs/'+process.env.COMB_RUN;if(s!==root&&!s.startsWith(root+'/')&&!(process.env.COMB_RUN&&(s===part||s.startsWith(part+'/'))))throw Error('COMB-T protected write '+s);return p;};
export const readFileSync=(p,...a)=>fs.readFileSync(readable(p),...a);
export const existsSync=p=>fs.existsSync(p)||fs.existsSync(old(p));
export const writeFileSync=(p,...a)=>{writable(p);fs.mkdirSync(path.dirname(str(p)),{recursive:true});return fs.writeFileSync(p,...a);};
export const appendFileSync=(p,...a)=>fs.appendFileSync(writable(p),...a);
export const mkdirSync=(p,...a)=>fs.mkdirSync(writable(p),...a);
export const createWriteStream=(p,...a)=>fs.createWriteStream(writable(p),...a);
export const rmSync=()=>{};export const unlinkSync=()=>{throw Error('COMB-T no deletion');};
export default {...fs,readFileSync,existsSync,writeFileSync,appendFileSync,mkdirSync,createWriteStream,rmSync,unlinkSync};`;
const virtual='data:text/javascript;base64,'+Buffer.from(source).toString('base64');
export async function resolve(spec,ctx,next){if(spec==='node:fs'&&!ctx.parentURL?.startsWith('data:'))return{url:virtual,shortCircuit:true};return next(spec,ctx);}
export async function load(url,ctx,next){const r=await next(url,ctx);if(!url.includes('/design/journey-map/tools/')||url.endsWith('/comb-t-loader.mjs'))return r;
 let s=String(r.source).replace(/journey-map-runs\/(comb-[\w]+)(?=['/])/g,(v,part)=>part==='comb-t'?v:'journey-map-runs/comb-t/artifacts/'+part);
 s=s.replace(/'profile-'\s*\+\s*Date\.now\(\)/g,"'profile-'+globalThis.process.pid+'-'+Date.now()");s=s.replace("note('removed the browser profile')","note('retained browser profile: COMB-T prohibits deletion')");return{...r,source:s};}
