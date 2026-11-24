// L11: actual field submission, historical displacement and both loader painters. Node only.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import * as P from '../loader-stars.mjs';
import { createTrailHistory, createField } from '../stars.mjs';
import { ART, buildingSize, paintBuilding, buildingChanges } from '../art.mjs';
import { pageMarkup } from './page.mjs';
const read = f => fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const close = (a,b,label,e=1e-6) => assert.ok(Math.abs(a-b)<=e, `${label}: ${a} != ${b}`);
function fakeGL() {
  const calls = [], uniforms = {}, divisors = {}, shaders = [];
  let buffer, next=0;
  const names = ['uStreak','uStroke','uPass','uSize','uDpr'];
  const gl = new Proxy({}, {get:(_o,key)=> {
    if (/^[A-Z_0-9]+$/.test(key)) return key;
    if (key === 'createProgram' || key === 'createBuffer' || key === 'createVertexArray') return () => ++next;
    if (key === 'getProgramParameter') return (_p,k)=>k==='ACTIVE_UNIFORMS'?names.length:true;
    if (key === 'getShaderParameter') return ()=>true;
    if (key === 'getActiveUniform') return (_p,i)=>({name:names[i]});
    if (key === 'getUniformLocation') return (_p,n)=>n;
    if (key === 'getExtension') return ()=>null;
    if (key === 'shaderSource') return (_s,code)=>shaders.push(code);
    if (key.startsWith('uniform')) return (u,...v)=>{uniforms[u]=v;};
    if (key === 'bindBuffer') return (_t,b)=>{buffer=b;};
    if (key === 'bufferData' || key === 'bufferSubData') return (...args)=>calls.push({kind:key,buffer,data:args.find(v=>ArrayBuffer.isView(v))?.slice()});
    if (key === 'vertexAttribDivisor') return (i,d)=>{divisors[i]=d;};
    if (key === 'drawArrays' || key === 'drawArraysInstanced') return (...args)=>calls.push({kind:key,args,uniforms:structuredClone(uniforms),divisors:{...divisors}});
    return ()=>{};
  }});
  return {gl,calls,shaders};
}
function rendererGate(source) {
  const {gl,calls,shaders}=fakeGL();
  const make = new Function('ART','buildingSize','paintBuilding','buildingChanges',source.replace(/^import .*;$/gm,'').replaceAll('export ','')+'; return createRenderer;')(ART,buildingSize,paintBuilding,buildingChanges);
  const renderer=make({getContext:()=>gl});
  renderer.setAtlas({pages:[{}],places:{}});
  const history=createTrailHistory(2);
  history.record(0,new Float64Array([10,10,30,30]));
  const trails=history.record(.02,new Float64Array([20,15,30,30]));
  const stars={count:2,attrs:new Float32Array([10,10,1,2,0,30,30,1,2,1]),offsets:new Float32Array([10,5,0,0]),flags:new Float32Array([3,0]),alpha:new Float32Array([.6,0]),mixes:new Float32Array([1,0]),front:1,attrsVersion:1,version:1,markSize:2,trails};
  calls.length=0;
  renderer.draw([],{W:100,H:100,S:10,cx:50,cy:50,cam:{r:[1,0,0],u:[0,1,0],v:[0,0,1]}},{stars});
  const strokes=calls.filter(c=>c.kind==='drawArraysInstanced'&&c.args[0]==='TRIANGLES');
  assert.equal(strokes.length,2,'L11 field streak: both star passes must submit tapered triangles');
  assert.deepEqual(strokes.map(c=>c.args),[['TRIANGLES',0,3,2],['TRIANGLES',0,3,2]],'L11 field streak: one taper per instance');
  assert.deepEqual(strokes.map(c=>c.uniforms.uPass),[[0],[1]],'L11 field streak: own pass colours and opacity');
  assert.ok(strokes.every(c=>c.uniforms.uStreak[0]===1&&Object.values(c.divisors).every(d=>d===1)),'L11 field streak: instanced geometry');
  const heads=calls.filter(c=>c.kind==='drawArrays'&&c.args[0]==='POINTS');
  assert.equal(heads.length,2,'L11 field streak: retain round dot heads');
  assert.ok(heads.every(c=>c.uniforms.uStreak[0]===0&&Object.values(c.divisors).every(d=>d===0)),'L11 field streak: dot attributes restored');
  assert.ok(shaders.some(s=>s.includes('length(aTrail.xy) > 2.0 * radius')&&s.includes('-aTrail.xy')&&s.includes('aTrail.zw *')),'L11 field streak: dot threshold and tail taper');
  assert.ok(calls.some(c=>c.kind==='bufferSubData'&&c.data?.length===trails.length&&c.data.every((v,i)=>v===trails[i])),'L11 field streak: actual history uploaded');
}
export async function checkL11(source = read('sq.mjs')) {
  const header=pageMarkup().match(/<a\b[^>]*data-mark[^>]*>[\s\S]*?<\/a>/)[0];
  const paths=[...header.matchAll(/<path\b[^>]*>/g)].map(([p])=>({d:p.match(/\bd="([^"]+)"/)[1],fill:p.match(/\bfill="([^"]+)"/)[1]}));
  let yields=0;
  const sample=P.sampleMark(paths);
  assert.deepEqual(await P.sampleMark(paths,P.STARS.mark.count,async()=>{yields++;}),sample,'L11 slices: identical mark sampling');
  assert.ok(yields>0,'L11 slices: sampler yields');
  const irregular=createTrailHistory(1);
  irregular.record(0,[0,0]); irregular.record(.013,[20,10]);
  const bent=irregular.record(.031,[50,20]);
  close(bent[0],50,'L11 field streak: irregular stirring x',.00001);
  close(bent[1],20,'L11 field streak: irregular stirring y',.00001);
  let checked=0, moving=0;
  for(const [W,H] of [[1440,900],[412,730]]) {
    const F=createField(W,H,P.placeMark(sample,W,H)), history=createTrailHistory(F.stars.length), snapshots=[];
    const positions=new Float64Array(F.stars.length*2), hold=F.press(W/2,H/2);
    for(let frame=0;frame<240*14;frame++) {
      const time=frame/240;
      if(time<8) F.gather(hold,[W/2,H/2],1/240);
      else if(frame===240*8) F.blast(hold,[W/2,H/2]);
      F.step(1/240);
      F.stars.forEach((s,i)=>positions.set([Math.fround(s.x)+F.offsets[2*i],Math.fround(s.y)+F.offsets[2*i+1]],2*i));
      snapshots.push({time,positions:positions.slice()});
      while(snapshots.length>2&&snapshots[1].time<=time-P.STREAK_WINDOW) snapshots.shift();
      const trail=history.record(time,positions), a=snapshots[0], b=snapshots[1]||a;
      const f=b.time>a.time?Math.max(0,Math.min(1,(time-P.STREAK_WINDOW-a.time)/(b.time-a.time))):0;
      for(let i=0;i<F.stars.length;i++) {
        const k=2*i,x=positions[k],y=positions[k+1];
        const tail=[a.positions[k]+(b.positions[k]-a.positions[k])*f,a.positions[k+1]+(b.positions[k+1]-a.positions[k+1])*f];
        const shape=P.streakGeometry(x,y,F.stars[i].size,tail);
        close(Math.hypot(trail[4*i],trail[4*i+1]),shape.length,'L11 field streak: .04 s displacement',.0001);
        if(shape.triangle.length) {
          const [tx,ty,ax,ay,bx,by]=shape.triangle;
          close(tx,tail[0],'L11 field streak: tail x'); close(ty,tail[1],'L11 field streak: tail y');
          close(Math.hypot(ax-bx,ay-by),F.stars[i].size,'L11 field streak: full head width');
          close((ax-bx)*(x-tx)+(ay-by)*(y-ty),0,'L11 field streak: perpendicular head',.0001); moving++;
        } else assert.ok(shape.length<=F.stars[i].size,'L11 field streak: dot at low speed');
        checked++;
      }
    }
    const rest=createTrailHistory(1); rest.record(0,[4,5]);
    assert.deepEqual(Array.from(rest.record(.1,[4,5])),[0,0,0,0],'L11 field streak: dot at rest');
    assert.deepEqual(P.streakGeometry(4,5,2,[4,5]).triangle,[],'L11 field streak: no resting taper');
  }
  rendererGate(source);
  // Execute the actual GPU painter in a VM and inspect its submitted geometry.
  const {gl,calls}=fakeGL(), painter=read('tools/page.mjs').split('function canvasPainter(')[1].split('\nfunction loaderWorker(')[0];
  const make=vm.runInNewContext('(function canvasPainter('+painter.trim()+')',{...P,Float32Array,Math});
  const canvas={getContext:()=>gl}, paint=make(canvas,paths,{width:1440,height:900},{width:1440,height:900,left:0,top:0},1);
  calls.length=0;
  const scene=P.loaderScene(sample,1440,900), state=P.loaderAt(3.26,{fonts:0,atlas:0,frame:0});
  paint.paint(state);
  const strokes=calls.find(c=>c.kind==='drawArrays'&&c.args[0]==='TRIANGLES');
  const dots=P.loaderDots(scene,state), triangles=dots.flatMap(d=>P.streakGeometry(d.x,d.y,d.size,d.tail||[d.x,d.y]).triangle.length? [d] : []);
  assert.equal(strokes.args[2],triangles.length*6,'L11 loader painter: GPU coverage quad count');
  const data=calls.filter(c=>c.kind==='bufferData'&&c.data?.length).at(-1).data;
  let at=0;
  for(const d of triangles) {
    const shape=P.streakGeometry(d.x,d.y,d.size,d.tail), [nx,ny]=shape.normal, dx=d.x-d.tail[0],dy=d.y-d.tail[1],length=Math.hypot(dx,dy);
    const radius=d.size/2+2,ux=dx/length*2,uy=dy/length*2;
    const a=[d.tail[0]-ux+nx*radius,d.tail[1]-uy+ny*radius],b=[d.tail[0]-ux-nx*radius,d.tail[1]-uy-ny*radius];
    const c=[d.x+ux+nx*radius,d.y+uy+ny*radius],e=[d.x+ux-nx*radius,d.y+uy-ny*radius];
    for(const p of [a,b,c,c,b,e]) {
      [p[0],p[1],d.size,...d.colour.map(n=>n/255),d.alpha*Math.min(1,d.size),d.x,d.y,...d.tail].forEach((v,k)=>close(data[at+k],v,'L13 coverage quad: original head/width/tail',.0001));
      at+=11;
    }
  }
  assert.ok(moving>1000,'L11 field streak: nonvacuous hold and blast');
  return `L11: ${checked} historical field samples, ${moving} tapered moves; exact .04 s history, dots at rest, two actual field passes, shared Canvas/GPU taper; sliced sampler identical.`;
}
export async function checkL11Controls() {
  const source=read('sq.mjs'), needle='gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, st.count);';
  assert.equal(source.split(needle).length,2,'L11 control: unique field draw site');
  try { rendererGate(source.replace(needle,'')); } catch(e) {
    assert.match(e.message,/L11 field streak: both star passes/);
    return 'field-dots-only -> '+e.message;
  }
  throw new Error('L11 field-dots-only escaped its gate');
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  console.log(await checkL11());
  if(process.argv.includes('--controls')) console.log(await checkL11Controls());
}
