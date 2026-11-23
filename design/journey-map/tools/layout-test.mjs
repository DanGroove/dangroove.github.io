// Analytic boxes and recording nodes only. No browser or font rasterizer is involved.
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { CAMERA, COPY, NOVA, PHONE_LAYOUT, STEPS, LABELS, EXPLORE } from '../data.mjs';
import { footerPhoneLayout, footerBuild, footerBuildX, footerResize, footerFrame } from '../footer.mjs';
import { stepsExploreBoxes } from '../steps.mjs';
import { tripResize, tripState, toScreen, VIEW } from '../trip.mjs';
import { exploreBuild, exploreResize, exploreStart, exploreApply, exploreReset } from '../explore.mjs';
import { BEATS } from '../pace.mjs';

const gap = (a,b) => Math.hypot(Math.max(a[0]-b[2],b[0]-a[2],0),Math.max(a[1]-b[3],b[1]-a[3],0));
let inFrame = false, reads = 0, fixture;
class LayoutNode {
  constructor(classes='') { this.classes=new Set(classes.split(' ').filter(Boolean));this.style={setProperty(k,v){this[k]=v;}};this.hidden=false;this.classList={add:c=>this.classes.add(c),remove:c=>this.classes.delete(c),contains:c=>this.classes.has(c),toggle:(c,on)=>on?this.classes.add(c):this.classes.delete(c)}; }
  setAttribute() {} addEventListener() {} appendChild() {}
  getBoundingClientRect() { assert.equal(inFrame,false,'layout read in frame');reads++;return this.box?.() || {left:0,top:0,right:700,bottom:100,width:700,height:100}; }
}
const root=new LayoutNode(), go=new LayoutNode('go'), buttons=Array.from({length:3},()=>new LayoutNode()), label=new LayoutNode();
go.hidden=true;buttons[2].hidden=true;go.querySelectorAll=()=>buttons;go.querySelector=()=>label;label.textContent='Next: a long stop name';root.classList.add('jm-focus');
go.box=()=>{assert.equal(go.hidden,false);assert.ok(go.classList.contains('go-end'));assert.ok(!root.classList.contains('jm-focus'));assert.equal(label.textContent,COPY.explore.button);assert.ok(buttons.every(b=>!b.hidden));return{bottom:fixture.goBottom};};
const inner=new LayoutNode(), name=new LayoutNode(), nameLine=new LayoutNode();name.parentElement=nameLine;
nameLine.box=()=>({top:fixture.nameTop});Object.defineProperty(nameLine,'clientWidth',{get:()=>fixture.w-32});
const headline=new LayoutNode(),talk=new LayoutNode(),rule=new LayoutNode(),spacer=new LayoutNode();
headline.box=()=>({height:fixture.headlineH});talk.box=()=>({width:fixture.talkW,height:fixture.talkH});
const footer=new LayoutNode();footer.querySelector=s=>({'.ft-in':inner,'.ft-name span':name,'.ft-rule':rule,'.ft-q':headline,'.ft-talk':talk,'.ft-sp':spacer})[s];footer.querySelectorAll=()=>[];
globalThis.document={documentElement:root,getElementById:id=>id==='go'?go:new LayoutNode(),createElement:()=>new LayoutNode()};
globalThis.window={addEventListener(){},dispatchEvent(){}};
footerBuild(footer,true);footerBuildX(new LayoutNode(),false);
const endP=BEATS.at(-1).P,journey={P:endP,moving:false,beats:BEATS},stage=new LayoutNode(),world=new LayoutNode();
exploreBuild({stage,world,journey,rm:false});
for(const [w,h] of [[390,844],[360,640],[412,915]]) {
  tripResize(w,h,96);
  // Conservative three-line 24px headline and the lower stack's analytic reservation.
  fixture={w,h,goBottom:128,headlineH:24*1.08*3,talkW:160,talkH:46,nameTop:h-180.2};
  const b=footerPhoneLayout(fixture);assert.ok(b.fits,w+' footer stack fits');
  const boxes=[[16,40,w-16,fixture.goBottom],b.headline,b.talk,b.target,[16,fixture.nameTop,w-16,fixture.nameTop+40]];
  for(let i=1;i<boxes.length;i++)assert.ok(boxes[i][1]-boxes[i-1][3]>=16-1e-9,w+' vertical gap '+i);
  assert.ok(b.novaY>=h*CAMERA.footerXPhone[1],'nova never moves up');
  assert.equal(b.novaY,Math.max(h*.5,b.talk[3]+16+NOVA.flare.hit),'nova moves down only as far as necessary');
  const before=reads;footerResize();assert.equal(+inner.style.paddingTop.slice(0,-2),b.top);assert.equal(VIEW.footerY,b.novaY);assert.ok(reads>before);
  assert.equal(+spacer.style.minHeight.slice(0,-2),b.spacer);assert.ok(b.talk[3]+b.spacer>=b.target[3]+16,'flow spacer reserves the target and name gap');
  assert.equal(go.hidden,true);assert.equal(buttons[2].hidden,true);assert.ok(!go.classList.contains('go-end'),'measurement restores live controls');
  assert.equal(label.textContent,'Next: a long stop name');assert.ok(root.classList.contains('jm-focus'));
  const end=tripState(endP);assert.equal(toScreen(end,[256,768])[1],b.novaY,'camera uses measured footer anchor');
  inFrame=true;try{footerFrame(end);}finally{inFrame=false;}
  exploreResize();assert.equal(exploreStart(),true);const state=tripState(endP);exploreApply(state,1.6);
  const row=stepsExploreBoxes(w,h),title=toScreen(state,[44,78]),titleBox=[title[0],title[1]-30*.8*state.cam.s,title[0]+COPY.title.length*30*LABELS.width*state.cam.s,title[1]+30*.2*state.cam.s];
  assert.ok(row.top[0]-row.back[2]>=PHONE_LAYOUT.exploreGap);
  assert.ok(row.back[2]-row.back[0]>=COPY.explore.back.length*12*LABELS.width+14+8+24+2,'back label, arrow, gap, padding and border fit one line');
  assert.ok(row.top[2]-row.top[0]>=COPY.steps.top.length*10*LABELS.width+(COPY.steps.top.length-1)*1.2+18,'top label fits one line');
  for(const box of Object.values(row)){assert.ok(box[0]>=16&&box[2]<=w-16);assert.ok(gap(box,titleBox)>=16,w+' explore row clear of title');assert.equal(box[3]-box[1],STEPS.nav.h);}
  exploreReset();console.log('ok '+w+'x'+h+': measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title');
}
const taller=footerPhoneLayout({...fixture,goBottom:170});assert.ok(taller.fits);assert.equal(taller.headline[1],186,'CTA follows a taller go bar');
const css=readFileSync(new URL('../map.css',import.meta.url),'utf8');assert.match(css,/\.jm-explore \.go\.go-end \.go-back\s*\{[^}]*border-radius: var\(--go-h\)[^}]*white-space: nowrap/);assert.match(css,/\.jm-explore \.go\.go-end\s*\{[^}]*top: auto[^}]*flex-wrap: nowrap/);
assert.match(css,/\.jm-explore \.go\s*\{\s*animation: exploreRow var\(--explore-row-fade\) var\(--explore-row-delay\) linear both;/);
assert.match(css,/@keyframes exploreRow\s*\{ from \{ opacity: 0; \} to \{ opacity: 1; \} \}/);
tripResize(360,640,96);exploreResize();assert.equal(exploreStart(),true);
const entryRow=stepsExploreBoxes(360,640),footerLinks=[16,520,344,640]; // Conservative full link band, deliberately overlapping the row.
assert.ok(Object.values(entryRow).some(b=>gap(b,footerLinks)===0));
for(let ms=0;ms<=600;ms++){
  const state=tripState(endP);exploreApply(state,ms?0.001:0);footerFrame(state);
  const rowAlpha=Math.max(0,Math.min(1,(ms/1000-EXPLORE.rowDelay)/EXPLORE.rowFade));
  assert.ok(!(rowAlpha>0&&Number(inner.style.opacity)>.2+1e-9),'row overlaps a still-visible footer link at '+ms+' ms');
  if(ms<=400)assert.equal(rowAlpha,0);if(ms===600)assert.ok(rowAlpha>1-1e-9);
}
exploreReset();console.log('ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms');
console.log('ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads');
