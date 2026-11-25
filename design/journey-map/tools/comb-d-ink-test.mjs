// Independent rendered-ink sampler. Empty SVG interiors are deliberately ignored.
export function combDInk(){
 const visible=e=>{for(let p=e;p&&p!==document.body;p=p.parentElement){const s=getComputedStyle(p);if(s.visibility==='hidden'||s.display==='none'||Number(s.opacity)<.02)return false;}return true;};
 const rect=e=>{const r=e.getBoundingClientRect();return[r.left,r.top,r.right,r.bottom];};
 const gap=(a,p)=>Math.hypot(Math.max(a[0]-p.x,0,p.x-a[2]),Math.max(a[1]-p.y,0,p.y-a[3]));
 const segmentRect=(a,b,r)=>{let best=Math.min(gap(r,{x:a[0],y:a[1]}),gap(r,{x:b[0],y:b[1]}));const dx=b[0]-a[0],dy=b[1]-a[1],D=dx*dx+dy*dy;for(const x of[r[0],r[2]])for(const y of[r[1],r[3]]){const t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(D||1)));best=Math.min(best,Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t));}for(const x of[r[0],r[2]]){const t=(x-a[0])/dx,y=a[1]+t*dy;if(t>=0&&t<=1&&y>=r[1]&&y<=r[3])return 0;}for(const y of[r[1],r[3]]){const t=(y-a[1])/dy,x=a[0]+t*dx;if(t>=0&&t<=1&&x>=r[0]&&x<=r[2])return 0;}return best;};
 const ink=[];
 for(const e of document.querySelectorAll('#b-detail path,#b-detail line,#b-detail circle,#b-detail ellipse,#b-detail rect,#b-sea path,#b-sea circle,#finds path,#finds circle,#finds ellipse,#b-coast path')){
  if(e.closest('.label-anchor,.map-tier1,.map-tier2,.lg,.legend-symbol,.mk,defs,.bc-beam,.bc-glow,.jg-swell,.hd-chest,.hd-glow,.hd-stars,.wl-rip,.rv-gifts')||e.matches('.hit,.touch-hit,.find-focus-ring')||!visible(e))continue;
  const local=e.getBBox();if(local.width>500&&local.height>800)continue;
  const s=getComputedStyle(e),m=e.getScreenCTM(),L=e.getTotalLength?.();if(!L||L>6000||s.stroke==='none'&&s.fill==='none')continue;
  const scale=Math.hypot(m.a,m.b),half=s.vectorEffect==='non-scaling-stroke'?parseFloat(s.strokeWidth)/2:parseFloat(s.strokeWidth)*scale/2;
  const who=e.closest('.find')?.id||e.getAttribute('d')?.slice(0,55)||e.tagName;
  const d=e.getAttribute('d');if(e.closest('.jg-ring')&&d&&!/[CQAHVSTcqahvst]/.test(d)){let last,home;for(const q of d.matchAll(/([MLZ])(?:(-?[\d.]+) (-?[\d.]+))?/g)){const p=q[1]==='Z'?home:[m.a*+q[2]+m.c*+q[3]+m.e,m.b*+q[2]+m.d*+q[3]+m.f];if(q[1]==='M')home=p;else if(last&&p)ink.push({a:last,b:p,half,who});last=p;}continue;}
  for(let u=0;u<=L;u+=e.classList.contains('sea-stipple')?.004:.6/Math.max(.1,scale)){const p=e.getPointAtLength(u);ink.push({x:m.a*p.x+m.c*p.y+m.e,y:m.b*p.x+m.d*p.y+m.f,half,who});}
 }
 const path=document.getElementById('trail-done'),m=path.getScreenCTM(),L=path.getTotalLength();
 for(let u=0;u<=L;u+=.5){const p=path.getPointAtLength(u);ink.push({x:m.a*p.x+m.c*p.y+m.e,y:m.b*p.x+m.d*p.y+m.f,half:1.5,who:'trail'});}
 // Native tangent/fill queries locate the visible outer half of the coast ticks.
 for(const e of document.querySelectorAll('.coast-ticks')){
  const m=e.getScreenCTM(),scale=Math.hypot(m.a,m.b),L=e.getTotalLength(),half=parseFloat(getComputedStyle(e).strokeWidth)/2;
  for(let u=0;u<=L;u+=.4/scale){
   if((u*scale)%3.2>.7)continue;
   const p=e.getPointAtLength(u),a=e.getPointAtLength(Math.max(0,u-.1)),b=e.getPointAtLength(Math.min(L,u+.1)),len=Math.hypot(b.x-a.x,b.y-a.y);if(!len)continue;
   let nx=-(b.y-a.y)/len,ny=(b.x-a.x)/len;
   if(e.isPointInFill(new DOMPoint(p.x+nx,p.y+ny))){nx=-nx;ny=-ny;}
   for(let d=0;d<=half;d+=.4){const x=p.x+nx*d/scale,y=p.y+ny*d/scale;ink.push({x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f,half:.2,who:'coast tick'});}
  }
 }
 for(const e of document.querySelectorAll('.mk-size > circle,.stop .st-line')){
  if(!visible(e)||e.closest('.legend-symbol'))continue;
  const r=e.getBoundingClientRect(),m=e.getScreenCTM(),half=parseFloat(getComputedStyle(e).strokeWidth)/2*Math.hypot(m.a,m.b);
  ink.push({x:(r.left+r.right)/2,y:(r.top+r.bottom)/2,half:r.width/2+half,who:e.closest('.stop')?'shield':'find marker'});
 }
 const labels=[];
 for(const e of document.querySelectorAll('.label-anchor')){
  if(!visible(e))continue;const b=rect(e.querySelector('text'));let min=Infinity,who;
  for(const p of ink){const d=(p.a?segmentRect(p.a,p.b,b):gap(b,p))-p.half;if(d<min){min=d;who=p.who;}}
  // The live X is in its own canvas. Query its visible red/white stroke cores
  // beside the label; exclude the soft glow and the dark build-up veil.
  const cv=document.getElementById('nova');
  if(cv?.width&&visible(cv)){
   const cr=cv.getBoundingClientRect(),sx=cv.width/cr.width,sy=cv.height/cr.height,pad=3;
   const x0=Math.max(0,Math.floor((b[0]-pad-cr.left)*sx)),y0=Math.max(0,Math.floor((b[1]-pad-cr.top)*sy)),x1=Math.min(cv.width,Math.ceil((b[2]+pad-cr.left)*sx)),y1=Math.min(cv.height,Math.ceil((b[3]+pad-cr.top)*sy));
   if(x1>x0&&y1>y0){const W=x1-x0,H=y1-y0,pixels=cv.getContext('2d').getImageData(x0,y0,W,H).data;
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const n=(y*W+x)*4,r=pixels[n],g=pixels[n+1],blue=pixels[n+2],a=pixels[n+3],red=r>g+35&&r>blue+20,white=r>180&&g>180&&blue>170;
     if(a>=160&&(red||white)){const d=gap(b,{x:cr.left+(x0+x+.5)/sx,y:cr.top+(y0+y+.5)/sy})-.5/Math.min(sx,sy);if(d<min){min=d;who='nova canvas stroke core';}}
    }
   }
  }
  labels.push({text:e.textContent,box:b,gap:+min.toFixed(2),who,clear:e.dataset.exploreClear,from:e.dataset.exploreFrom,missed:e.dataset.exploreMissed});
 }
 return labels;
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/comb-d-ink-test.mjs')){
 const {combBBrowser,combBWait}=await import('./comb-d-browser-test.mjs');const b=await combBBrowser();
 try{await b.size(412,730);await b.page('dist/journey-map.html');await b.evaluate('window.__jm.go("end",{instant:true})');await combBWait(1700);await b.evaluate('document.querySelector(".go-next").click()');await combBWait(2200);console.log(await b.evaluate('('+combDInk.toString()+')()'));await b.shot('study-ink');}finally{await b.close();}
}
