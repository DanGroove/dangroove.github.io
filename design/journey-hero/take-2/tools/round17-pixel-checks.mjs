// External Chromium gates. Local work exercises only the pure PNG/mask/count helpers below.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { inflateSync, deflateSync } from 'node:zlib';
import { GL } from './sheet.mjs';
import { previewMarkup } from './preview.mjs';
import { visibleProjection } from './correction-checks.mjs';
import { SHOW, SCRIPTS, playbackSpans } from '../stage.mjs';
import { EASE } from '../../../../public/journey/hero/engine.mjs';

const TAKE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = path.resolve(TAKE, '../../..');
const WORK = path.join(TAKE, '.scratch/review-out/r17');
export const PIXEL_SIZES = [[1474,996,1],[1474,996,2],[390,844,2]];
const paeth = (a,b,c) => {const p=a+b-c,x=Math.abs(p-a),y=Math.abs(p-b),z=Math.abs(p-c);return x<=y&&x<=z?a:y<=z?b:c;};

// Chromium emits non-interlaced 8-bit RGB or RGBA. All five PNG row predictors are supported.
export function decodePng(input) {
  const b=Buffer.isBuffer(input)?input:Buffer.from(input,'base64');
  assert.ok(b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'PNG signature');
  let width=0,height=0,channels=0,at=8,ended=false;const chunks=[];
  while(at+12<=b.length) {
    const n=b.readUInt32BE(at),type=b.toString('ascii',at+4,at+8);
    assert.ok(at+12+n<=b.length,'truncated PNG chunk');const data=b.subarray(at+8,at+8+n);
    if(type==='IHDR') {width=data.readUInt32BE(0);height=data.readUInt32BE(4);channels={2:3,6:4}[data[9]];assert.ok(width&&height&&data[8]===8&&channels&&data[10]===0&&data[11]===0&&data[12]===0,'unsupported PNG layout');}
    if(type==='IDAT')chunks.push(data);
    if(type==='IEND'){ended=true;break;}at+=n+12;
  }
  assert.ok(ended&&channels&&chunks.length,'incomplete PNG');
  const raw=inflateSync(Buffer.concat(chunks)),stride=width*channels,pixels=new Uint8Array(stride*height);
  assert.equal(raw.length,(stride+1)*height,'PNG scanline length');
  for(let y=0;y<height;y++)for(let x=0;x<stride;x++) {
    const row=y*stride,i=y*(stride+1),filter=raw[i],left=x>=channels?pixels[row+x-channels]:0,up=y?pixels[row+x-stride]:0,ul=y&&x>=channels?pixels[row+x-stride-channels]:0;
    const predictor=[0,left,up,Math.floor((left+up)/2),paeth(left,up,ul)][filter];
    assert.ok(Number.isFinite(predictor),'unsupported PNG filter');pixels[row+x]=(raw[i+1+x]+predictor)&255;
  }
  return {width,height,channels,pixels};
}

export function devicePolygon(points, view, hero, clip, dpr) {
  return points.map(([x,y])=>[(hero.x+view.cx+view.S*x-clip.x)*dpr,(hero.y+view.cy-view.S*y-clip.y)*dpr]);
}
const bounds = polygons => {
  const p=polygons.flat();assert.ok(p.length,'empty projected region');
  return [Math.min(...p.map(p=>p[0])),Math.min(...p.map(p=>p[1])),Math.max(...p.map(p=>p[0])),Math.max(...p.map(p=>p[1]))];
};
const boxPolygon = ([l,t,r,b],grow=0) => [[l-grow,t-grow],[r+grow,t-grow],[r+grow,b+grow],[l-grow,b+grow]];
const inside = (x,y,p) => {
  let hit=false;
  for(let i=0,j=p.length-1;i<p.length;j=i++) {const a=p[i],b=p[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])hit=!hit;}
  return hit;
};
// Include/exclude polygon unions, sampled at device-pixel centres. Exclusions win, including where masks overlap.
export function rasterMask(width,height,include=[],exclude=[]) {
  const mask=new Uint8Array(width*height);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++)if((!include.length||include.some(p=>inside(x+.5,y+.5,p)))&&!exclude.some(p=>inside(x+.5,y+.5,p)))mask[y*width+x]=1;
  return mask;
}
export function countDifferences(a,b,mask,threshold=8) {
  assert.equal(a.width,b.width,'pixel width');assert.equal(a.height,b.height,'pixel height');assert.equal(mask.length,a.width*a.height,'mask size');
  let changed=0,total=0,maximum=0;
  for(let i=0;i<mask.length;i++)if(mask[i]) {let difference=0;for(let c=0;c<3;c++)difference=Math.max(difference,Math.abs(a.pixels[i*a.channels+c]-b.pixels[i*b.channels+c]));maximum=Math.max(maximum,difference);total++;if(difference>threshold)changed++;}
  return {changed,total,maximum};
}
export function releaseVerdict(numbers,picturePixels,phone) {
  assert.ok(picturePixels>0,'empty changed-picture footprint');
  return {...numbers,picturePixels,fraction:numbers.changed/picturePixels,limit:phone?0.005:0,pass:numbers.changed<=(phone?picturePixels*0.005:0)};
}
export function sinkVerdict(samples,crossing) {
  let worstDrop=0;const violations=[];
  if(!samples.length||samples[0].changed===0)violations.push('empty first footprint');
  for(let i=0;i<samples.length;i++) {
    const row=samples[i],previous=samples[i-1];
    if(row.t<crossing-1e-9&&previous&&previous.changed) {const drop=(previous.changed-row.changed)/previous.changed;worstDrop=Math.max(worstDrop,drop);if(drop>0.05)violations.push({t:row.t,drop});}
    if(row.t>crossing+1e-9&&row.changed!==0)violations.push({t:row.t,after:row.changed});
  }
  return {pass:!violations.length,worstDrop,violations};
}

// Small generated PNGs exercise the production decoder, not another implementation of it. No browser is imported/launched.
export function checkPixelHelpers() {
  let cases=0;
  const chunk=(type,data)=>{const h=Buffer.alloc(8),crc=Buffer.alloc(4);h.writeUInt32BE(data.length);h.write(type,4);return Buffer.concat([h,data,crc]);};
  for(const channels of [3,4])for(let filter=0;filter<5;filter++) {
    const width=3,height=3,stride=width*channels,pixels=Uint8Array.from({length:stride*height},(_,i)=>(i*71+17)&255),raw=Buffer.alloc((stride+1)*height);
    for(let y=0;y<height;y++){raw[y*(stride+1)]=filter;for(let x=0;x<stride;x++){const p=y*stride+x,a=x>=channels?pixels[p-channels]:0,b=y?pixels[p-stride]:0,c=y&&x>=channels?pixels[p-stride-channels]:0;raw[y*(stride+1)+1+x]=(pixels[p]-[0,a,b,Math.floor((a+b)/2),paeth(a,b,c)][filter])&255;}}
    const header=Buffer.alloc(13);header.writeUInt32BE(width);header.writeUInt32BE(height,4);header[8]=8;header[9]=channels===3?2:6;
    const data=deflateSync(raw),png=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',data.subarray(0,3)),chunk('IDAT',data.subarray(3)),chunk('IEND',Buffer.alloc(0))]);
    assert.deepEqual(decodePng(png).pixels,pixels,'synthetic PNG predictor '+filter);cases++;
  }
  assert.throws(()=>decodePng(Buffer.from('bad')),/PNG signature/);
  assert.equal(isToolRailPiece({art:'tLine',furniture:true}),true);assert.equal(isToolRailPiece({art:'tImage',furniture:true}),true);assert.equal(isToolRailPiece({art:'tHash'}),true);assert.equal(isToolRailPiece({art:'tT'}),false);
  const all=boxPolygon([0,0,4,4]),hole=boxPolygon([1,1,3,3]),mask=rasterMask(4,4,[all,all],[hole,hole]);
  assert.equal(mask.reduce((a,b)=>a+b,0),12,'overlapping include/exclude masks');
  assert.equal(rasterMask(2,2,[[[0,0],[2,0],[0,2]]]).reduce((a,b)=>a+b,0),1,'polygon mask, not bounding box');
  assert.deepEqual(devicePolygon([[1,2]],{cx:10,cy:20,S:3},{x:4,y:6},{x:2,y:3},2),[[30,34]],'device pixel conversion');
  const a={width:4,height:4,channels:4,pixels:new Uint8Array(64)},b={...a,pixels:new Uint8Array(64)};
  b.pixels[0]=8;b.pixels[4]=9;b.pixels[(1*4+1)*4]=255;
  assert.deepEqual(countDifferences(a,b,mask),{changed:1,total:12,maximum:9},'threshold/mask/channel counting');
  assert.equal(releaseVerdict({changed:1},200,true).pass,true);assert.equal(releaseVerdict({changed:2},200,true).pass,false);assert.equal(releaseVerdict({changed:1},200,false).pass,false);
  assert.equal(sinkVerdict([{t:0,changed:100},{t:.001,changed:95},{t:.002,changed:0}],.002).pass,true);
  assert.equal(sinkVerdict([{t:0,changed:100},{t:.001,changed:94},{t:.002,changed:0}],.002).pass,false);
  assert.equal(sinkVerdict([{t:0,changed:100},{t:.003,changed:1}],.002).pass,false);
  return {pngCases:cases,filters:5,channels:[3,4],maskPixels:12,threshold:8};
}

const starts=SHOW.map((_,i)=>SHOW.slice(0,i).reduce((n,s)=>n+s.len,0));
const globalAction=(scene,id)=>starts[SHOW.findIndex(s=>s.key===scene)]+SCRIPTS[scene].actions.find(a=>a.id===id).end;
export const PIXEL_RELEASES = [
  ['ps','black','photo'],['ps','white','photo'],['ai','badge','kMap'],['ai','block','kLoc'],['ai','cityLabels','kLoc'],
  ['id','map','kMap'],['id','loc','kLoc'],['id','coverTitle','kCover'],['id','postButton','kPost'],['id','mailFlyer','eblast'],
  ['id','blob','kCover'],['fig','details','wire'],
].map(([scene,action,picture])=>({scene,action,picture,t:globalAction(scene,action)}));
const pictureOf = (pc,key) => {
  const art=pc.cutoutSource||pc.labelSource||pc.art||'';
  if(key==='photo')return /^photo(?:Raw|Half|Levels)$/.test(art);
  if(key==='wire')return /^wire(?:Wide|Tablet|Tall)/.test(art);
  if(key==='kLoc')return /^(?:kLoc|loc(?:Blocks|Streets|Pins|Ground))/.test(art);
  if(key==='kCover')return /^(?:kCover|cover(?:Photo|Blob|Decor))/.test(art);
  return art.startsWith(key);
};
async function frame(page,t) {
  return page.evaluate(time=>{
    window.__hero.seek(time);
    const h=document.querySelector('[data-hero]').getBoundingClientRect();
    return {view:window.__hero.view,pieces:window.__hero.pieces,hero:{x:h.x,y:h.y}};
  },t);
}
function polygons(state,predicate,clip,dpr) {
  return state.pieces.filter(predicate).map(pc=>devicePolygon(visibleProjection(pc,state.view.cam),state.view,state.hero,clip,dpr)).filter(p=>p.length>=3);
}
export function isToolRailPiece(pc) {
  return !!(pc.furniture && /^t[A-Z]/.test(pc.art || '')) || ['tArrow','tHash','tRect','tPen','tType','tChat'].includes(pc.art);
}
function exclusions(state,clip,dpr) {
  const cursor=polygons(state,pc=>pc.art==='cursor',clip,dpr),caret=polygons(state,pc=>!!pc.caret,clip,dpr);
  const tools=polygons(state,isToolRailPiece,clip,dpr);
  const masks=[...cursor.map(p=>boxPolygon(bounds([p]),4*dpr)),...caret.map(p=>boxPolygon(bounds([p]),dpr))];
  if(tools.length)masks.push(boxPolygon(bounds(tools),4*dpr));
  return masks;
}
function clipFor(polys,W,H,dpr,pad=4) {
  const [l,t,r,b]=bounds(polys),x=Math.max(0,Math.floor(l/dpr-pad)),y=Math.max(0,Math.floor(t/dpr-pad));
  return {x,y,width:Math.min(W,Math.ceil(r/dpr+pad))-x,height:Math.min(H,Math.ceil(b/dpr+pad))-y};
}
const screenshot=async(page,clip)=>decodePng(await page.screenshot({clip,animations:'disabled',scale:'device'}));

export async function checkRound17Pixels(chromium,previewPath) {
  const rows=[],failures=[],browser=await chromium.launch({headless:true,args:GL});
  const add=row=>{rows.push(row);if(!row.pass)failures.push(row);};
  try {
    for(const [W,H,dpr] of PIXEL_SIZES) {
      const context=await browser.newContext({viewport:{width:W,height:H},deviceScaleFactor:dpr,serviceWorkers:'block'}),requests=[],errors=[];
      try {
        await context.route('**/*',route=>{if(/^(?:file|data|blob):/.test(route.request().url()))return route.continue();requests.push(route.request().url());return route.abort();});
        const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
        await page.goto(pathToFileURL(path.resolve(previewPath)).href+'?t=0&stars=0');
        await page.waitForFunction(()=>window.__ready,null,{timeout:30000});await page.evaluate(()=>document.fonts.ready);
        for(const release of PIXEL_RELEASES) {
          try {
            const before=await frame(page,release.t-.002),after=await frame(page,release.t+.002),zero={x:0,y:0};
            // Compare the whole stage, with only the specified cursor/caret/rail masks. The phone allowance uses picture area.
            const stage=await page.locator('[data-stage-box]').boundingBox();
            const clip={x:Math.max(0,Math.floor(stage.x-16)),y:Math.max(0,Math.floor(stage.y-16)),width:0,height:0};
            clip.width=Math.min(W,Math.ceil(stage.x+stage.width+16))-clip.x;clip.height=Math.min(H,Math.ceil(stage.y+stage.height+16))-clip.y;
            await frame(page,release.t-.002);const a=await screenshot(page,clip);await frame(page,release.t+.002);const b=await screenshot(page,clip);
            const masks=[...exclusions(before,clip,dpr),...exclusions(after,clip,dpr)],mask=rasterMask(a.width,a.height,[],masks);
            const picturePolys=[...polygons(before,p=>pictureOf(p,release.picture),clip,dpr),...polygons(after,p=>pictureOf(p,release.picture),clip,dpr)];
            const picturePixels=rasterMask(a.width,a.height,picturePolys,masks).reduce((a,b)=>a+b,0);
            const result=releaseVerdict(countDifferences(a,b,mask),picturePixels,W===390);
            add({gate:'C3 release',size:[W,H,dpr],...release,...result});
          } catch(error){add({gate:'C3 release',size:[W,H,dpr],...release,pass:false,error:error.message});}
        }
        if(W===1474)for(const scene of ['id','pr','ae','fig']) {
          try {
            const i=SHOW.findIndex(s=>s.key===scene),off=playbackSpans(SCRIPTS[scene]).off.map(t=>t+starts[i]);
            // Shared clearance fixes the crossing independently of object height; max body H is .25/.05/.05/.12.
            const Hmax={id:.25,pr:.05,ae:.05,fig:.12}[scene],target=1/(1+.02/Hmax);let lo=0,hi=1;
            for(let n=0;n<60;n++){const m=(lo+hi)/2;if(EASE.wipe(m)<target)lo=m;else hi=m;}
            const crossing=off[0]+(lo+hi)/2,first=crossing-.1,state=await frame(page,first),zero={x:0,y:0};
            const footprint=polygons(state,p=>p.where==='floor'&&p.sink&&!p.hide&&p.sinkTop>=0,zero,dpr);
            assert.ok(footprint.length,'no sinking objects');const clip=clipFor(footprint,W,H,dpr);
            const polys=footprint.map(p=>p.map(([x,y])=>[x-clip.x*dpr,y-clip.y*dpr]));
            await frame(page,off[1]-.000001);const empty=await screenshot(page,clip),mask=rasterMask(empty.width,empty.height,polys);
            const samples=[];
            for(let n=0;n<=120;n++){const t=first+n*.001;await frame(page,t);const image=await screenshot(page,clip);samples.push({t,...countDifferences(image,empty,mask)});}
            add({gate:'C5 sink',size:[W,H,dpr],scene,crossing,samples,...sinkVerdict(samples,crossing)});
          } catch(error){add({gate:'C5 sink',size:[W,H,dpr],scene,pass:false,error:error.message});}
        }
        add({gate:'offline/render errors',size:[W,H,dpr],pass:!requests.length&&!errors.length,requests,errors});
      } catch(error) {add({gate:'preview ready',size:[W,H,dpr],pass:false,error:error.message,requests,errors});}
      finally {await context.close();}
    }
  } finally {await browser.close();}
  return {rows,failures};
}

async function main() {
  const require=createRequire(path.join(ROOT,'package.json'));let playwright;
  for(const name of ['playwright','@playwright/test','playwright-core']) {
    try {const resolved=require.resolve(name);if(resolved.startsWith(ROOT+path.sep)){playwright=require(resolved);break;}}
    catch(error){if(error.code!=='MODULE_NOT_FOUND')throw error;}
  }
  if(!playwright){console.log('round17-pixel-checks UNAVAILABLE: Playwright is not installed in the repository.');process.exitCode=2;return;}
  let preview=process.argv[2];
  if(!preview){fs.mkdirSync(WORK,{recursive:true});preview=path.join(WORK,'critique2-pixel-preview.html');fs.writeFileSync(preview,previewMarkup());}
  let result;
  try {result=await checkRound17Pixels(playwright.chromium,preview);}
  catch(error){console.log('round17-pixel-checks UNAVAILABLE: '+error.message);process.exitCode=2;return;}
  fs.mkdirSync(WORK,{recursive:true});fs.writeFileSync(path.join(WORK,'critique2-pixels.json'),JSON.stringify(result,null,2));
  for(const row of result.rows) {
    const {samples,...summary}=row;
    console.log((row.pass?'PASS ':'FAIL ')+JSON.stringify({...summary,...(samples?{sampleCount:samples.length,firstCount:samples[0]?.changed,lastCount:samples.at(-1)?.changed}: {})}));
  }
  process.exitCode=result.failures.length?1:0;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await main();
