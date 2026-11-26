import assert from'node:assert/strict';import{pBrowser,save}from'./comb-p-fixture.mjs';
const b=await pBrowser(),rows=[],fail=[];const check=(v,m)=>{if(!v)fail.push(m);};
try{for(const[w,h,touch]of[[1920,950,false],[1440,900,false],[412,915,true],[390,844,true]]){await b.size(w,h,touch,touch?2.625:2);await b.page(false,'lennard');const start=await b.read('({trav:__p.frames.at(-1)?.trav,cam:__g.FD.st.cam})');
 await b.begin();await b.click('.go-next',touch);await b.rest();const data=await b.end(),frames=data.frames.filter(f=>f.trav);let prev=0,maxStep=0;
 for(let i=1;i<frames.length;i++){const step=Math.hypot(frames[i].trav[0]-frames[i-1].trav[0],frames[i].trav[1]-frames[i-1].trav[1]);check(step<=1.6*prev+2,w+' smooth frame '+frames[i].frame+' step '+step+' prev '+prev);maxStep=Math.max(maxStep,step);prev=step;}
 // Phones (part 13 review, 2026-11-26): the X stays centred unless the city needs room; then it moves left just enough to show the whole skyline.
 const end=frames.at(-1),xm=await b.read('__g.CAMERA.xMargin'),shifted=touch&&end.trav[0]<w/2-2;check(shifted?Math.abs(end.skyline[1]+12*end.cam.s+xm-w)<=2:Math.abs(end.trav[0]-w/2)<=2,w+' X centred unless the city needs room '+end.trav[0]+' '+end.skyline);check(end.skyline[0]>=0&&end.skyline[1]<=w,w+' full skyline '+end.skyline);
 rows.push({w,h,maxStep,end,cutRight:Math.max(0,end.skyline[1]-w)});await b.shot('p-x-'+w);
 await b.begin();await b.click('.go-next',touch);await b.rest();const rush=await b.end(),build=rush.frames.filter(f=>f.kind==='rush');check(build.length>0,w+' build sampled');check(shifted?build.every((f,i)=>f.trav[0]<=w/2+2&&(!i||f.trav[0]>=build[i-1].trav[0]-.5))&&Math.abs(build.at(-1).trav[0]-w/2)<=2:build.every(f=>Math.abs(f.trav[0]-w/2)<=2),w+(shifted?' rush slides the X once to the centre':' rush has no sideways slide'));await b.shot('p-footer-'+w);
 // Re-open Lennard, reach X with real input, and reverse with Back.
 await b.page(false,'lennard');const anchor=await b.read('(()=>{const s=__g.FD.st;return [s.trav[0]*s.cam.s+s.cam.tx,s.trav[1]*s.cam.s+s.cam.ty]})()');await b.click('.go-next',touch);await b.rest();await b.begin();await b.click('.go-back',touch);await b.rest();const reverse=await b.end(),back=reverse.frames.at(-1).trav;
 const path=frames.filter(f=>f.trav),at=P=>{for(let i=1;i<path.length;i++)if(P>=path[i-1].P&&P<=path[i].P){const a=path[i-1],z=path[i],k=(P-a.P)/(z.P-a.P||1);return a.trav.map((v,j)=>v+(z.trav[j]-v)*k);}return null;};
 let reverseError=0;for(const f of reverse.frames){const expected=at(f.P);if(expected)reverseError=Math.max(reverseError,Math.hypot(f.trav[0]-expected[0],f.trav[1]-expected[1]));}check(reverseError<=2,w+' reverse path '+reverseError);rows.at(-1).reverseError=reverseError;
check(Math.hypot(back[0]-anchor[0],back[1]-anchor[1])<=2,w+' back trail anchor');
 }check(!b.errors.length,'console '+b.errors);console.log(JSON.stringify({rows,fail}));assert.deepEqual(fail,[]);}finally{save('p-x',{rows,fail});await b.close();}
