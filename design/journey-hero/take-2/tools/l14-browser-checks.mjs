// Same installed Playwright/Edge, persistent isolated profiles and offline packed page as L13.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { previewMarkup } from './preview.mjs';
import { steps, ks, startOf } from './l14-checks.mjs';
import * as M from '../stage.mjs';
import * as E from '../entrance.mjs';
import { checkL12DOM } from './l12-checks.mjs';
const take = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), out = path.join(take, '.scratch/l14/browser');
const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch {
  const runtimes = path.join(process.env.LOCALAPPDATA, 'OpenAI/Codex/runtimes/cua_node');
  const installed = fs.readdirSync(runtimes).map(d => path.join(runtimes, d, 'bin/node_modules/playwright-core')).find(p => fs.existsSync(p));
  if (!installed) throw Error('Local Playwright required. No package is installed by this tool.');
  playwright = require(installed);
}
const fails = async (name, gate, fn) => {
  let message; try { await fn(); } catch(e) { message = e.message.split('\n')[0]; }
  assert.ok(message?.startsWith(gate), name + ' escaped: ' + message); return { name, message };
};
const stats = frames => {
  const gaps = frames.slice(1).map((v, i) => v - frames[i]).sort((a,b)=>a-b);
  return { count: gaps.length, max: gaps.at(-1), p95: gaps[Math.floor(.95 * (gaps.length - 1))], over20: gaps.filter(v=>v>20).length,
    gaps: frames.slice(1).flatMap((v,i)=>v-frames[i]>20?[{from:frames[i],to:v,ms:v-frames[i]}]:[]) };
};
export function frameGate(row) { assert.equal(row.over20, 0, 'L14 frame target: interval over 20 ms'); }
export async function checkL14Browser({ sheets = true, performance = true } = {}) {
  fs.mkdirSync(out, { recursive: true });
  const html = previewMarkup(), requests = [], errors = [], result = { name: [], controls: [], sheets: [], performance: [], closed: [], requests, errors };
  const file = (name, content) => { const p = path.join(out,name+'.html'); fs.writeFileSync(p,content); return pathToFileURL(p).href; };
  const heldURL = file('held', html);
  for (const [W,H] of [[1440,900],[390,844],[412,730]]) {
    const context = await playwright.chromium.launchPersistentContext(path.join(out,'edge-'+W), {
      executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true,
      viewport: { width: W, height: H }, deviceScaleFactor: 1, isMobile: W < 500, hasTouch: W < 500,
      args: ['--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check','--disable-extensions'],
    });
    await context.route('**/*', route => { const u=route.request().url(); if(/^(file|data|blob):/.test(u)) return route.continue(); requests.push(u); return route.abort('blockedbyclient'); });
    context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
    try {
      if (W !== 412) for (const ramp of [false,true]) {
        const page = await context.newPage();
        const rampHtml = html.replace('up(el, (1 - p.reveal) * g.drop);', 'up(el, (1 - p.reveal) * g.drop); el.style.fontWeight = p.progress >= 1 ? "" : (300+500*(1-(1-p.progress)**3)).toFixed(3);');
        if(ramp) assert.notEqual(rampHtml,html,'L14 ramp control: mutation site');
        await page.goto((ramp ? file('ramp-'+W,rampHtml) : heldURL)+'?t=0');
        await page.waitForFunction(()=>window.__ready);
        const data = await page.evaluate(() => {
          const rect = node => {const r=node.getBoundingClientRect();return [r.left,r.top,r.width,r.height];};
          const lines=[...document.querySelectorAll('.name-line')], range=document.createRange();
          const expected=lines.map(line=>Array.from(line.firstChild.data,(_,i)=>{range.setStart(line.firstChild,i);range.setEnd(line.firstChild,i+1);return rect(range);}));
          let samples=0, letters=0, mismatches=0, maxLanding=0;
          const frames=[];
          for(let n=0;n<=276;n++) {
            __hero.entrance(n/60);let moving=0,bad=0;
            lines.forEach((line,i)=>{const weight=getComputedStyle(line).fontWeight;
              line.querySelectorAll('.entrance-letter').forEach((el,j)=>{const start=[.3,.5][i]+j*.055;
                if(n/60>=start&&n/60<start+.85){moving++;letters++;if(getComputedStyle(el).fontWeight!==weight){bad++;mismatches++;}}
              });
            });frames.push({t:n/60,moving,bad});samples++;
          }
          // Each letter is checked on its own landing, while its line overlay still exists.
          const landings=[];
          lines.forEach((line,i)=>expected[i].forEach((box,j)=>{
            __hero.entrance([.3,.5][i]+j*.055+.85-1e-7);
            const el=line.querySelectorAll('.entrance-letter')[j], actual=rect(el);
            const error=Math.max(...actual.map((v,k)=>Math.abs(v-box[k])));maxLanding=Math.max(maxLanding,error);landings.push({line:i,letter:j,error});
          }));
          __hero.entrance(4.6);
          return {samples,letters,mismatches,maxLanding,frames,landings};
        });
        fs.writeFileSync(path.join(out,`name-${W}-${ramp?'ramp':'current'}.json`),JSON.stringify(data,null,2));
        const gate=()=>assert.equal(data.mismatches,0,'L14 name weight: differs from flow text');
        if(ramp) result.controls.push(await fails('L12 weight ramp '+W,'L14 name weight:',gate));
        else {gate();assert.ok(data.letters>500,'L14 name: nonvacuous sampling');assert.ok(data.maxLanding<=.5,'L14 name landing: more than .5 px');result.name.push({W,H,...data,frames:undefined});}
        await page.close();
      }
      if(sheets) {
        const page=await context.newPage();await page.goto(heldURL+'?t=0');await page.waitForFunction(()=>window.__ready);
        const cells=[];
        for(const s of steps()) for(const k of ks) {
          await page.evaluate(t=>{__hero.seek(t);__hero.measure();},s.at+k*s.duration);
          const box=await page.locator('[data-stage-box]').boundingBox(),x=Math.max(0,Math.floor(box.x-8)),y=Math.max(0,Math.floor(box.y-8));
          const png=await page.screenshot({clip:{x,y,width:Math.min(W-x,Math.ceil(box.width+16)),height:Math.min(H-y,Math.ceil(box.height+16))}});
          const name=`${W}x${H}-${s.key}-${s.direction}-${s.part}-${k}.png`;fs.writeFileSync(path.join(out,name),png);
          cells.push({label:`${s.key} ${s.direction} format ${s.part} k=${k}`,png:png.toString('base64')});
        }
        const sheet=await context.newPage();await sheet.goto(file('sheet-'+W,'<!doctype html><style>body{margin:0;background:#151314;color:#F7F6F3;font:14px Arial}main{display:grid;grid-template-columns:repeat(6,340px)}figure{margin:4px}img{width:332px}figcaption{padding:8px}</style><main>'+cells.map(c=>`<figure><img src="data:image/png;base64,${c.png}"><figcaption>${c.label}</figcaption></figure>`).join('')+'</main>'));
        await sheet.setViewportSize({width:2040,height:1000});await sheet.screenshot({path:path.join(out,`contact-${W}x${H}.png`),fullPage:true});await sheet.close();await page.close();
        result.sheets.push({W,H,cells:cells.length,file:`contact-${W}x${H}.png`});
      }
      if(performance&&W!==390) {
        const page=await context.newPage();
        await page.addInitScript(()=>{
          const p=window.__l14Perf={frames:[],landing:null,end:null,phase:'entrance',contexts:[]};
          const original=HTMLCanvasElement.prototype.getContext;
          HTMLCanvasElement.prototype.getContext=function(...args){const gl=original.apply(this,args);if(gl&&args[0]==='webgl2'){const ext=gl.getExtension('WEBGL_debug_renderer_info');p.contexts.push({renderer:ext&&gl.getParameter(ext.UNMASKED_RENDERER_WEBGL),attributes:gl.getContextAttributes()});}return gl;};
          function frame(){const now=performance.now();
            if(window.__hero&&!__hero.loading){p.landing??=now;if(__hero.entering===null)p.end??=now;}
            if(p.landing!==null&&p.end===null)p.frames.push(now);
            requestAnimationFrame(frame);
          }requestAnimationFrame(frame);
        });
        await page.goto(heldURL);await page.waitForFunction(()=>window.__l14Perf?.end!==null);
        const entrance=await page.evaluate(()=>({...__l14Perf,frames:[...__l14Perf.frames,__l14Perf.end]}));
        const records=[{W,H,phase:'entrance',...stats(entrance.frames),contexts:entrance.contexts}];
        // Start at the real export action. rAF runs without controlled-clock simulation.
        for(const direction of ['in','out']) {
          const s=M.SCRIPTS.id,from=startOf(M,'id')+(direction==='in'?s.actions.find(a=>a.id==='export').start:M.playbackSpans(s).off[0]);
          const duration=direction==='in'?M.ballLength('id'):1.5;
          const frames=await page.evaluate(async({from,duration})=>{
            __hero.seek(from);document.querySelector('[data-pause]').click();
            return new Promise(resolve=>{const frames=[];let first=null;
              function sample(){const now=performance.now();first??=now;frames.push(now);if(now-first>=duration*1000){document.querySelector('[data-pause]').click();resolve(frames);}else requestAnimationFrame(sample);}
              requestAnimationFrame(sample);
            });
          },{from,duration});
          records.push({W,H,phase:'id '+direction,...stats(frames)});
        }
        result.performance.push(...records);fs.writeFileSync(path.join(out,`frames-${W}x${H}.json`),JSON.stringify({entrance,records},null,2));
        await page.close();
      }
    } finally {await context.close();result.closed.push('edge-'+W);fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(result,null,2));}
  }
  // Check 4's write whitelist has its own fault, independent of the weight equality gate.
  const source=fs.readFileSync(path.join(take,'entrance.mjs'),'utf8').replace('up(el, (1 - p.reveal) * g.drop);','up(el, (1 - p.reveal) * g.drop); el.style.opacity = "1";');
  const module=await import('data:text/javascript;base64,'+Buffer.from(source.replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g,(_,q,ref)=>`from '${new URL(ref,pathToFileURL(path.join(take,'entrance.mjs'))).href}'`)).toString('base64'));
  checkL12DOM(E);result.controls.push(await fails('per-frame opacity write','L12 frame: wrote opacity',()=>checkL12DOM(module)));
  result.controls.push(await fails('25 ms frame','L14 frame target:',()=>frameGate({over20:1})));
  assert.equal(requests.length,0,'L14 offline: attempted network');assert.equal(errors.length,0,'L14 browser errors');
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(result,null,2));
  for(const row of result.performance) frameGate(row);
  return result;
}
if(process.argv[1]===fileURLToPath(import.meta.url)) console.log(JSON.stringify(await checkL14Browser({sheets:!process.argv.includes('--quick'),performance:!process.argv.includes('--quick')})));
