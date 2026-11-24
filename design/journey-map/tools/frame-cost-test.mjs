import { strict as assert } from 'node:assert';
import { deflateSync } from 'node:zlib';
import { framePNG, frameLines, frameIntervals, frameTrace } from './frame-cost.mjs';

const chunk=(name,body)=>{const b=Buffer.alloc(body.length+12);b.writeUInt32BE(body.length);b.write(name,4);body.copy(b,8);return b;};
function png(w,h,channels,pixels,filter) {
  const stride=w*channels,raw=Buffer.alloc((stride+1)*h),head=Buffer.alloc(13);
  head.writeUInt32BE(w);head.writeUInt32BE(h,4);head[8]=8;head[9]=channels===3?2:6;
  const paeth=(a,b,c)=>{const p=a+b-c,da=Math.abs(p-a),db=Math.abs(p-b),dc=Math.abs(p-c);return da<=db&&da<=dc?a:db<=dc?b:c;};
  for(let y=0;y<h;y++){raw[y*(stride+1)]=filter;for(let x=0;x<stride;x++){
    const p=y*stride+x,a=x>=channels?pixels[p-channels]:0,b=y?pixels[p-stride]:0,c=y&&x>=channels?pixels[p-stride-channels]:0;
    raw[y*(stride+1)+x+1]=(pixels[p]-[0,a,b,Math.floor((a+b)/2),paeth(a,b,c)][filter])&255;
  }}
  const zipped=deflateSync(raw),n=Math.floor(zipped.length/2);
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',head),chunk('IDAT',zipped.subarray(0,n)),chunk('IDAT',zipped.subarray(n)),chunk('IEND',Buffer.alloc(0))]);
}
for(const channels of [3,4])for(let filter=0;filter<5;filter++){
  const pixels=Buffer.from(Array.from({length:13*9*channels},(_,i)=>(i*83+7)%256)),out=framePNG(png(13,9,channels,pixels,filter));
  assert.equal(out.w,13);assert.equal(out.h,9);assert.equal(out.channels,channels);assert.deepEqual(out.pixels,pixels);
}
assert.throws(()=>framePNG(Buffer.from('bad')));
console.log('ok: PNG RGB/RGBA, split IDAT, all five scanline filters and invalid signature');
const pixels=Buffer.alloc(100*100*3,20);for(let x=10;x<90;x++)for(let y=40;y<=41;y++)for(let c=0;c<3;c++)pixels[(y*100+x)*3+c]=220;
const lines=frameLines(framePNG(png(100,100,3,pixels,4)));assert.equal(lines,160);
assert.equal(frameLines(framePNG(png(100,100,3,Buffer.alloc(30000,20),0))),0);
for(let y=0;y<100;y++)for(let x=0;x<100;x++){const i=(y*100+x)*3;pixels[i]=240;pixels[i+1]=48;pixels[i+2]=79;}
assert.equal(frameLines(framePNG(png(100,100,3,pixels,0))),0,'red glow is not neutral linework');
assert.deepEqual(frameIntervals([16,16,34,120]),{n:4,p50:16,p95:120,max:120,over33:2,over100:1});
assert.equal(frameIntervals([]).p95,null);
const events=[{ph:'M',name:'thread_name',pid:9,tid:9,args:{name:'CrRendererMain'}},{ph:'M',name:'thread_name',pid:1,tid:1,args:{name:'CrRendererMain'}},
  {ph:'X',name:'FunctionCall',pid:1,tid:1,ts:0,dur:20000},{ph:'X',name:'FireAnimationFrame',pid:1,tid:1,ts:0,dur:20000},
  {ph:'X',name:'Layout',pid:1,tid:1,ts:4000,dur:3000},{ph:'B',name:'Paint',pid:1,tid:1,ts:10000},{ph:'E',pid:1,tid:1,ts:12000},
  {ph:'X',name:'RasterTask',pid:1,tid:2,ts:5000,dur:4000}];
assert.deepEqual(frameTrace(events,0,20000,2,1),{mainThread:true,script:7.5,styleLayout:1.5,paint:1,raster:2});
assert.equal(frameTrace([],0,20,1).mainThread,false);
console.log('ok: neutral-line classifier, interval percentiles/thresholds, exclusive nested main-thread costs, B/E spans, target renderer and separate raster work');
