// External Chromium gates. Local work exercises only the pure PNG/mask/count helpers below.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { inflateSync, deflateSync } from 'node:zlib';
import { execFileSync } from 'node:child_process';
import { GL } from './sheet.mjs';
import { previewMarkup } from './preview.mjs';
import { visibleProjection } from './correction-checks.mjs';
import { SHOW, SCRIPTS, playbackSpans, BUILDING_USES, BLOCK_ROW } from '../stage.mjs';
import { EASE, quatRotate, dot } from '../../../../public/journey/hero/engine.mjs';

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
  return {...numbers,picturePixels,fraction:numbers.changed/picturePixels,limit:0,pass:numbers.changed===0};
}
export function growMask(mask,width,height,radius) {
  const result=new Uint8Array(mask.length);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(mask[y*width+x])for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++)if(dx*dx+dy*dy<=radius*radius&&x+dx>=0&&y+dy>=0&&x+dx<width&&y+dy<height)result[(y+dy)*width+x+dx]=1;
  return result;
}
export function intersectMasks(a,b) {assert.equal(a.length,b.length);return a.map((v,i)=>v&&b[i]?1:0);}
export function textureVerdict(actual,reference) {
  const levels=[];
  for(let n=0;n<4;n++) {const a=actual[n],b=reference[n];assert.ok(a&&b,'missing texture mip');assert.equal(a.level,n);assert.equal(b.level,n);assert.equal(a.width,b.width);assert.equal(a.height,b.height);assert.equal(a.pixels.length,a.width*a.height*4);assert.equal(a.pixels.length,b.pixels.length);let changed=0,maximum=0;for(let i=0;i<a.pixels.length;i++){const d=Math.abs(a.pixels[i]-b.pixels[i]);if(d)changed++;maximum=Math.max(maximum,d);}levels.push({level:n,width:a.width,height:a.height,changed,maximum});}
  return {levels,pass:levels.every(p=>p.changed===0)};
}
export function costVerdict(samples) {
  assert.ok(samples.length,'no build cost samples');const sorted=[...samples].sort((a,b)=>a-b),mid=Math.floor(sorted.length/2),median=sorted.length%2?sorted[mid]:(sorted[mid-1]+sorted[mid])/2,worst=sorted.at(-1);
  return {samples:samples.length,median,worst,pass:worst<=16&&median<=4};
}
export function attributionCounts(image,mask) {
  const counts={floor:0,top:0,side:0,outline:0,mixed:0};
  for(let i=0;i<mask.length;i++)if(mask[i]) {const p=i*image.channels,[r,g,b]=image.pixels.slice(p,p+3);if(Math.max(r,g,b)<=8)counts.floor++;else {counts[r>=g&&r>=b?'top':g>=b?'side':'outline']++;if(r+g+b<247)counts.mixed++;}}
  return {...counts,pass:counts.floor===0};
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
  assert.equal(releaseVerdict({changed:0},200,true).pass,true);assert.equal(releaseVerdict({changed:1},200,true).pass,false);assert.equal(releaseVerdict({changed:1},200,false).pass,false);
  assert.deepEqual([...intersectMasks(Uint8Array.of(1,0,1),Uint8Array.of(0,1,1))],[0,0,1]);
  assert.equal(growMask(Uint8Array.of(0,0,0,0,1,0,0,0,0),3,3,1).reduce((a,b)=>a+b),5);
  const levels=Array.from({length:4},(_,level)=>({level,width:1,height:1,pixels:[17,0,0,255]}));
  assert.equal(textureVerdict(levels,levels).pass,true);assert.equal(textureVerdict(levels,levels.map((p,i)=>i===3?{...p,pixels:[18,0,0,255]}:p)).pass,false);
  assert.equal(costVerdict([0,4,16]).pass,true);assert.equal(costVerdict([0,4,16.001]).pass,false);assert.equal(costVerdict([4.001]).pass,false);
  assert.equal(costVerdict([0,8]).median,4);
  const region=faceRegion({p:[0,0,0],q:[0,0,0,1],s:[2,3,1]},[.25,.25,.75,.75]);
  assert.deepEqual(region.p,[0,0,1-1e-9]);assert.deepEqual(region.s,[1,1.5,1e-9]);
  assert.equal(attributionCounts({channels:3,pixels:Uint8Array.of(255,0,0,0,255,0,0,0,255)},Uint8Array.of(1,1,1)).pass,true);
  assert.equal(attributionCounts({channels:3,pixels:Uint8Array.of(0,0,0)},Uint8Array.of(1)).pass,false);
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

// All reference packing is offline and read-only. A missing historical commit is an explicit failed gate.
function referencePreview(revision) {
  const read=fs.readFileSync,cache=new Map();
  fs.readFileSync=function(file,...args) {
    const absolute=file instanceof URL?fileURLToPath(file):path.resolve(String(file));
    if(absolute.startsWith(ROOT+path.sep)&&/\.(?:mjs|css|html)$/.test(absolute)) {
      const relative=path.relative(ROOT,absolute).split(path.sep).join('/');
      if(!cache.has(relative))cache.set(relative,execFileSync('git',['show',revision+':'+relative],{cwd:ROOT,encoding:'utf8',stdio:['ignore','pipe','pipe']}));
      return cache.get(relative);
    }
    return read.call(fs,file,...args);
  };
  try {
    const html=previewMarkup(),id=html.match(/\/\/ design\/journey-hero\/take-2\/art\.mjs\s+const (__module\d+)/)?.[1];
    assert.ok(id,'reference atlas module missing');const at=html.lastIndexOf('</script>');
    const api=`\nglobalThis.__r17Atlas = async () => Promise.all(${id}.makeAtlas().pages.slice(0,5).map(async page=>({width:page.width,height:page.height,sha256:Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',page.getContext('2d').getImageData(0,0,page.width,page.height).data))).map(n=>n.toString(16).padStart(2,'0')).join('')})));\n`;
    return html.slice(0,at)+api+html.slice(at);
  }finally {fs.readFileSync=read;}
}
const globalStart=scene=>starts[SHOW.findIndex(s=>s.key===scene)];
const useEnd=use=>globalAction(use.scene,use.last);
function faceRegion(pc,r=[0,0,1,1]) {
  const [l,t,right,b]=r,offset=quatRotate(pc.q,[(l+right-1)*pc.s[0],(1-t-b)*pc.s[1],pc.s[2]-1e-9]);
  return {...pc,p:pc.p.map((v,i)=>v+offset[i]),s:[pc.s[0]*(right-l),pc.s[1]*(b-t),1e-9]};
}
function facePolygons(state,predicate,clip,dpr) {return polygons({...state,pieces:state.pieces.filter(predicate).map(pc=>faceRegion(pc))},()=>true,clip,dpr);}
const maskWithout=(mask,exclude)=>mask.map((v,i)=>v&&!exclude[i]?1:0);
const maskUnion=(a,b)=>a.map((v,i)=>v||b[i]?1:0);
function polygonMask(image,polys) {return polys.length?rasterMask(image.width,image.height,polys):new Uint8Array(image.width*image.height);}
function maskedRegion(image,polys,exclude,dpr,grow=4) {return maskWithout(growMask(polygonMask(image,polys),image.width,image.height,grow*dpr),exclude);}
async function capture(page,t,clip) {const state=await frame(page,t);return {state,image:await screenshot(page,clip)};}

export async function checkRound17Pixels(chromium,previewPath) {
  const rows=[],failures=[],browser=await chromium.launch({headless:true,args:GL});
  const add=row=>{rows.push(row);if(row.pass===false)failures.push(row);};
  const references={};
  for(const revision of ['dcb8094','9ba17ea']) {
    try {fs.mkdirSync(WORK,{recursive:true});const file=path.join(WORK,'critique3-reference-'+revision+'.html');fs.writeFileSync(file,referencePreview(revision));references[revision]=file;}
    catch(error){add({gate:'historical reference',revision,pass:false,error:error.message});}
  }
  try {
    for(const [W,H,dpr] of PIXEL_SIZES) {
      const context=await browser.newContext({viewport:{width:W,height:H},deviceScaleFactor:dpr,serviceWorkers:'block'}),requests=[],errors=[],size=[W,H,dpr],clip={x:0,y:0,width:W,height:H};
      try {
        await context.route('**/*',route=>{if(/^(?:file|data|blob):/.test(route.request().url()))return route.continue();requests.push(route.request().url());return route.abort();});
        const open=async file=>{const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});await page.goto(pathToFileURL(path.resolve(file)).href+'?t=0&stars=0');await page.waitForFunction(()=>window.__ready,null,{timeout:30000});await page.evaluate(()=>document.fonts.ready);return page;};
        const page=await open(previewPath),old={};for(const [revision,file] of Object.entries(references))old[revision]=await open(file);
        assert.ok(await page.evaluate(()=>!!window.__hero.buildings),'building review API missing');
        if(old.dcb8094)try {const actual=await page.evaluate(()=>window.__hero.buildings.atlasHashes()),reference=await old.dcb8094.evaluate(()=>window.__r17Atlas());add({gate:'C3 atlas pages 0–4 bytes',size,actual,reference,pass:JSON.stringify(actual)===JSON.stringify(reference)});}catch(error){add({gate:'C3 atlas pages 0–4 bytes',size,pass:false,error:error.message});}
        // Exact GPU readback: each use's final texture versus an independent full-source fresh paint.
        for(const use of BUILDING_USES)try {
          await frame(page,useEnd(use)+.002);
          const data=await page.evaluate(id=>({actual:window.__hero.buildings.readback(id),reference:window.__hero.buildings.reference(id),texture:window.__hero.buildings.inspect(id)}),use.id);
          add({gate:'C3 mip readback',size,id:use.id,t:useEnd(use)+.002,texture:data.texture,...textureVerdict(data.actual,data.reference)});
        }catch(error){add({gate:'C3 mip readback',size,id:use.id,pass:false,error:error.message});}
        // There are no same-picture atlas handovers: original instances, copies, thumbnails and travels retain their use.
        for(const release of PIXEL_RELEASES)try {
          const a=await capture(page,release.t-.002,clip),b=await capture(page,release.t+.002,clip),masks=[...exclusions(a.state,clip,dpr),...exclusions(b.state,clip,dpr)];
          // C3 no longer masks the tool rail on releases. Its intended changes are compared with the historical after-frame.
          const cursorCaret=state=>polygons(state,p=>p.art==='cursor'||p.caret,clip,dpr).map(p=>boxPolygon(bounds([p]),4*dpr));
          const exclude=rasterMask(a.image.width,a.image.height,[boxPolygon([0,0,a.image.width,a.image.height])],[...cursorCaret(a.state),...cursorCaret(b.state)]);
          const hidden=exclude.map(v=>v?0:1),stage=await page.locator('[data-stage-box]').boundingBox();assert.ok(stage,'missing stage box');
          const stageMask=intersectMasks(exclude,rasterMask(a.image.width,a.image.height,[boxPolygon([stage.x*dpr,stage.y*dpr,(stage.x+stage.width)*dpr,(stage.y+stage.height)*dpr])]));
          const whole=countDifferences(a.image,b.image,stageMask);
          const own=state=>facePolygons(state,p=>pictureOf(p,release.picture)&&!p.echo&&p.where!=='floor'&&p.where!=='travel',clip,dpr);
          const A=maskedRegion(a.image,own(a.state),hidden,dpr),B=maskedRegion(b.image,own(b.state),hidden,dpr),common=intersectMasks(A,B);
          const placement=release.scene==='id'&&['map','loc'].includes(release.action);
          add({gate:'whole-stage release record',size,...release,...whole,percentage:100*whole.changed/Math.max(1,whole.total),pass:null});
          if(!placement)add({gate:'C3 scoped release',size,...release,...releaseVerdict(countDifferences(a.image,b.image,common),common.reduce((n,v)=>n+v,0))});
          const other=facePolygons(b.state,p=>!!p.building&&!pictureOf(p,release.picture),clip,dpr);
          if(other.length) {const mask=maskedRegion(b.image,other,hidden,dpr);const result=countDifferences(a.image,b.image,mask);add({gate:'C3 other buildings stable',size,...release,...result,pass:result.changed===0});}
          if(old.dcb8094) {
            const ref=await capture(old.dcb8094,release.t+.002,clip);
            const buildings=facePolygons(b.state,p=>!!p.building,clip,dpr),allFaces=[...own(b.state),...buildings];
            const protectedMask=placement?exclude:maskWithout(exclude,growMask(polygonMask(b.image,allFaces),b.image.width,b.image.height,4*dpr));
            const result=countDifferences(b.image,ref.image,protectedMask);add({gate:placement?'G designed placement after':'C3 outside faces versus dcb8094',size,...release,...result,pass:result.changed===0});
            if(placement){const refBefore=await capture(old.dcb8094,release.t-.002,clip),result=countDifferences(a.image,refBefore.image,exclude);add({gate:'G designed placement before',size,...release,...result,pass:result.changed===0});}
          }
        }catch(error){add({gate:'C3 release',size,...release,pass:false,error:error.message});}
        // Build changes are confined to the active source mark/reveal (+24 atlas texels), cursor/caret and rail.
        for(const use of BUILDING_USES)try {
          const first=globalStart(use.scene)+SCRIPTS[use.scene].actions.find(a=>a.id===use.first).start,end=useEnd(use),cost=[];
          await page.evaluate(()=>window.__hero.buildings.resetTimes());let previous=await capture(page,first,clip),samples=0,changedOutside=0,baselineOutside=0;
          cost.push(await page.evaluate(id=>window.__hero.buildings.times.filter(p=>p.id===id).reduce((n,p)=>n+p.total,0),use.id));
          for(let t=first+1/60;t<=end+1e-9;t+=1/60) {
            await page.evaluate(()=>window.__hero.buildings.resetTimes());const state=await frame(page,t);
            const timing=await page.evaluate(()=>window.__hero.buildings.times);cost.push(timing.filter(p=>p.id===use.id).reduce((n,p)=>n+p.total,0));
            const current={state,image:W===1474&&dpr===1?await screenshot(page,clip):null};
            if(current.image) {
              const parts=[];
              for(const pc of state.pieces.filter(p=>p.building&&!p.echo&&p.where==='content')) {
                const prior=previous.state.pieces.find(p=>p.building?.id===pc.building.id&&!p.echo&&p.where==='content');
                const regions=await page.evaluate(({source,before,after})=>window.__hero.buildings.changedRegions(source,before,after),{source:pc.building.source,before:prior?.building.plan,after:pc.building.plan});
                parts.push(...regions.map(r=>faceRegion(pc,r)));
              }
              const allowed=polygons({...state,pieces:parts},()=>true,clip,dpr),toolMasks=[...exclusions(previous.state,clip,dpr),...exclusions(state,clip,dpr)];
              // The retained photo drag precedes its first placed base; it is the current action's picture mark too.
              if(use.scene==='id')for(const snapshot of [previous.state,state])allowed.push(...facePolygons(snapshot,p=>p.where==='travel'&&p.photoProfile==={kCover:'cover',kPost:'post',eblast:'mail'}[use.source],clip,dpr));
              const mask=maskWithout(rasterMask(current.image.width,current.image.height,[],toolMasks),growMask(polygonMask(current.image,allowed),current.image.width,current.image.height,4*dpr));
              changedOutside+=countDifferences(previous.image,current.image,mask).changed;samples++;
              if(old['9ba17ea']) {const reference=await capture(old['9ba17ea'],t,clip),faces=facePolygons(state,p=>!!p.building,clip,dpr),outside=polygonMask(current.image,faces).map(v=>v?0:1);baselineOutside+=countDifferences(current.image,reference.image,outside).changed;}
            }
            previous=current;
          }
          if(W===1474&&dpr===1)add({gate:'C3 build locality',size,id:use.id,samples,changedOutside,pass:changedOutside===0});
          if(W===1474&&dpr===1&&old['9ba17ea'])add({gate:'C3 build preservation',size,id:use.id,samples,baselineOutside,pass:baselineOutside===0});
          if((W===1474&&dpr===1)||W===390)add({gate:'C3 build cost',size,id:use.id,...costVerdict(cost)});
        }catch(error){add({gate:'C3 build/cost',size,id:use.id,pass:false,error:error.message});}
        // Finished stills versus a plain fresh texture in the same grid; historical differences inside are records only.
        const stills=SHOW.map((s,i)=>starts[i]+s.still),rests=['id','pr','ae','fig'].map(scene=>globalStart(scene)+playbackSpans(SCRIPTS[scene]).land+.8),early=['id','pr','ae','fig'].map(scene=>globalStart(scene)+playbackSpans(SCRIPTS[scene]).off[0]+.15);
        for(const t of [...stills,...rests,...early])try {
          const current=await capture(page,t,clip),faces=facePolygons(current.state,p=>!!p.building,clip,dpr),insideMask=polygonMask(current.image,faces),outside=insideMask.map(v=>v?0:1);
          if(faces.length){await page.evaluate(()=>{window.__hero.buildings.referenceOnly=true;});const fresh=await capture(page,t,clip);await page.evaluate(()=>{window.__hero.buildings.referenceOnly=false;});const result=countDifferences(current.image,fresh.image,insideMask);add({gate:'C3 still fresh source',size,t,...result,pass:result.changed===0});}
          if(old['9ba17ea']){const ref=await capture(old['9ba17ea'],t,clip),result=countDifferences(current.image,ref.image,outside);add({gate:'retained outside eight pictures',size,t,...result,pass:result.changed===0});}
          if(old.dcb8094){const ref=await capture(old.dcb8094,t,clip);add({gate:'stills/rest side-effect record',size,t,...countDifferences(current.image,ref.image,insideMask),pass:null});}
        }catch(error){await page.evaluate(()=>{window.__hero.buildings.referenceOnly=false;});add({gate:'stills/rest',size,t,pass:false,error:error.message});}
        if(W===1474)for(const scene of ['id','pr','ae','fig'])try {
          const off=playbackSpans(SCRIPTS[scene]).off.map(t=>t+globalStart(scene)),Hmax={id:.25,pr:.05,ae:.05,fig:.12}[scene],target=1/(1+.02/Hmax);let lo=0,hi=1;
          for(let n=0;n<60;n++){const m=(lo+hi)/2;if(EASE.wipe(m)<target)lo=m;else hi=m;}
          const crossing=off[0]+(lo+hi)/2,first=crossing-.1,state=await frame(page,first),footprint=polygons(state,p=>p.where==='floor'&&p.sink&&!p.hide&&p.sinkTop>=0,clip,dpr);
          assert.ok(footprint.length,'no sinking objects');const empty=await capture(page,off[1]-.000001,clip),mask=rasterMask(empty.image.width,empty.image.height,footprint),samples=[];
          for(let n=0;n<=120;n++){const t=first+n*.001,current=await capture(page,t,clip);samples.push({t,...countDifferences(current.image,empty.image,mask)});}
          add({gate:'C5 sink',size,scene,crossing,samples,...sinkVerdict(samples,crossing)});
        }catch(error){add({gate:'C5 sink',size,scene,pass:false,error:error.message});}
        if(W===1474)try {
          const samples=[],zBoundary=BLOCK_ROW.stack[1]+BLOCK_ROW.stack[3];
          for(let n=0;n<=120;n++) {
            const t=43.300+n*.001,state=await frame(page,t),reading=state.pieces.filter(p=>p.where==='floor'&&p.sink&&p.device===undefined&&p.p[2]>zBoundary);
            assert.ok(reading.length,'C7 attribution: no reading copy');
            const top=pc=>Math.max(...[-1,1].flatMap(x=>[-1,1].flatMap(y=>[-1,1].map(z=>quatRotate(pc.q,[x*pc.s[0],y*pc.s[1],z*pc.s[2]]).map((v,i)=>v+pc.p[i])))).map(p=>p[1]));
            const left=Math.max(...reading.filter(p=>p.p[0]<-.1).map(top)),right=Math.max(...reading.filter(p=>p.p[0]>=-.1).map(top)),z0=Math.min(...reading.map(p=>p.p[2]-p.s[1])),z1=Math.max(...reading.map(p=>p.p[2]+p.s[1]));
            await page.evaluate(z=>{window.__hero.buildings.spineAttribution={z};},zBoundary);await frame(page,t);const diagnostic=await screenshot(page,clip);await page.evaluate(()=>{window.__hero.buildings.spineAttribution=false;});
            const mask=new Uint8Array(diagnostic.width*diagnostic.height);
            for(let j=1;j<100;j++){const world=[-.1,(left+right)/2,z0+(z1-z0)*j/100],point=devicePolygon([[dot(state.view.cam.r,world),dot(state.view.cam.u,world)]],state.view,state.hero,clip,dpr)[0],x=Math.floor(point[0]),y=Math.floor(point[1]);if(x>=0&&y>=0&&x<diagnostic.width&&y<diagnostic.height)mask[y*diagnostic.width+x]=1;}
            samples.push({t,...attributionCounts(diagnostic,mask),samplePixels:mask.reduce((a,b)=>a+b,0)});
          }
          add({gate:'C7 spine attribution',size,samples,pass:samples.every(p=>p.pass&&p.samplePixels>0),floorPixels:samples.reduce((n,p)=>n+p.floor,0),sidePixels:samples.reduce((n,p)=>n+p.side,0),outlinePixels:samples.reduce((n,p)=>n+p.outline,0)});
        }catch(error){await page.evaluate(()=>{window.__hero.buildings.spineAttribution=false;});add({gate:'C7 spine attribution',size,pass:false,error:error.message});}
        add({gate:'offline/render errors',size,pass:!requests.length&&!errors.length,requests,errors});
      }catch(error){add({gate:'preview ready',size,pass:false,error:error.message,requests,errors});}
      finally {await context.close();}
    }
  }finally {await browser.close();}
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
  if(!preview){fs.mkdirSync(WORK,{recursive:true});preview=path.join(WORK,'critique3-pixel-preview.html');fs.writeFileSync(preview,previewMarkup());}
  let result;
  try {result=await checkRound17Pixels(playwright.chromium,preview);}
  catch(error){console.log('round17-pixel-checks UNAVAILABLE: '+error.message);process.exitCode=2;return;}
  fs.mkdirSync(WORK,{recursive:true});fs.writeFileSync(path.join(WORK,'critique3-pixels.json'),JSON.stringify(result,null,2));
  for(const row of result.rows) {
    const {samples,...summary}=row;
    console.log((row.pass?'PASS ':'FAIL ')+JSON.stringify({...summary,...(samples?{sampleCount:samples.length,firstCount:samples[0]?.changed,lastCount:samples.at(-1)?.changed}: {})}));
  }
  process.exitCode=result.failures.length?1:0;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await main();
