// COMB-T, 2026-11-27: the ash replaces the well find and is the tree zoom anchor.
import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {combDClock,combDAdvance} from './comb-d-clock-test.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
const b=await combBBrowser(),root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3',fail=[],rows=[];
const tick=async ms=>{for(let t=0;t<ms;t+=100)await combDAdvance(b,Math.min(100,ms-t));};
const html=readFileSync('dist/journey-map.html','utf8').replace('</script>','\nwindow.__f={FD,EX,stepsFocus,findView,findPlace,showPop,closePop,placePop};\n</script>');
try{
 await combDClock(b);
 for(const[w,h]of[[412,730],[360,640],[1440,900]]){
  await b.size(w,h);await b.send('Page.navigate',{url:'data:text/html;base64,'+Buffer.from(html).toString('base64')});await combBWait(600);await tick(2000);
  for(const id of ['hoard-laurier','hoard-hmc1','hoard-hmc2','hoard-interkom','hoard-lennard','horn','serpent','ravens','ash','longship']){
   await b.key('Escape');await tick(1000);await b.evaluate('__jm.go("map",{instant:true})');
   const exists=await b.evaluate('!!document.getElementById("f-'+id+'")');if(!exists){console.log('no popup owner '+id);continue;}
   await b.evaluate('__f.stepsFocus('+JSON.stringify(id)+',__f.findView('+JSON.stringify(id)+'))');await tick(1500);
   const presses=id.startsWith('hoard')?4:id==='serpent'?3:1;
   for(let i=0;i<presses;i++){await b.evaluate('document.getElementById("f-'+id+'").dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true,cancelable:true}))');await tick(id==='serpent'?3800:1200);}
   if(id==='ravens')await tick(4000);
   for(let z=0;z<2;z++){
    if(z){await b.evaluate('(()=>{const E=__f.EX;E.active=true;E.k=1;E.footer=0;E.motion=null;E.velocity=[0,0];E.cam={...__f.FD.st.cam};E.target={...E.cam};E.changed=true;window.__fBeforeZoom=E.cam.s;document.documentElement.classList.add("jm-explore");const p=__jm.finds.place('+JSON.stringify(id)+');window.dispatchEvent(new WheelEvent("wheel",{clientX:p[0],clientY:p[1],deltaY:-120,bubbles:true,cancelable:true}));})()');await tick(1400);}
    const row=await b.evaluate(`(()=>{const F=__f.FD,o=F.popOwner,p=F.pop;if(!o)return {id:${JSON.stringify(id)},open:false};const e=o.el.querySelector('.hd-chest,.hn-horn,.jg-head,.rv-tree,.ls-rock')||o.el,r=e.getBoundingClientRect(),q=F.popInner.getBoundingClientRect(),tail=F.popTail.getBoundingClientRect(),gap=Math.hypot(Math.max(q.left-r.right,r.left-q.right,0),Math.max(q.top-r.bottom,r.top-q.bottom,0));return {id:${JSON.stringify(id)},open:true,visible:getComputedStyle(p).visibility!=='hidden',side:p.dataset.side,gap,draw:[r.x,r.y,r.width,r.height],card:[q.x,q.y,q.width,q.height],tail:[tail.x,tail.y,tail.width,tail.height],ceiling:F.popCeiling,floor:F.popFloor};})()`);
    rows.push({w,h,z,zoom:z?await b.evaluate('__f.EX.cam.s/window.__fBeforeZoom'):1,...row});if(row.open&&(!row.visible||row.gap<7.5||row.gap>16.5))fail.push(w+' '+id+' z'+z+' '+JSON.stringify(row));
    if(w===412&&!z)await b.shot('final-412x730-'+id+'-card');
   }
  }
  const off=await b.evaluate('(()=>{const F=__f.FD;if(!F.popOwner)return true;const x=F.st.cam.tx;F.st.cam.tx+=innerWidth*3;__f.placePop();const hidden=getComputedStyle(F.pop).visibility==="hidden";F.st.cam.tx=x;__f.placePop();return hidden;})()');if(!off)fail.push(w+' offscreen popup pinned to edge');
  await b.key('Escape');await tick(1000);await b.evaluate('__jm.go("end",{instant:true})');await tick(1000);await b.evaluate('document.querySelector(".go-next").click()');await tick(2000);
  for(let z=0;z<4;z++){if(z){await b.evaluate('window.dispatchEvent(new KeyboardEvent("keydown",{key:"+",bubbles:true,cancelable:true}))');await tick(1000);}const v=await b.evaluate('getComputedStyle(document.querySelector(".tl-base")).opacity');if(v!=='0')fail.push(w+' Explore base '+z+' '+v);}
  await b.key('Escape');await tick(2000);await b.evaluate('__jm.go("map",{instant:true})');await b.evaluate('__f.stepsFocus("runestone",__f.findView("runestone"))');await tick(1000);
  await b.evaluate('document.getElementById("f-runestone").dispatchEvent(new MouseEvent("click",{bubbles:true}))');await tick(6000);
  const rub=await b.evaluate('({read:__f.FD.list.runestone.read,hint:!!document.querySelector(".rub-hint"),auto:__f.FD.list.runestone.autoTs})');if(rub.read||!rub.hint||rub.auto!==null)fail.push(w+' pointer rubbing '+JSON.stringify(rub));
 }
 if(b.errors.length)fail.push(...b.errors);
}finally{await b.close();}
writeFileSync(root+'/popup-measurements.json',JSON.stringify({rows,fail},null,2));console.log('Popup measurements '+rows.length+'; failures '+fail.length);console.log(JSON.stringify(fail));process.exitCode=fail.length?1:0;
