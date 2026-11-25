// Screenshot comparisons only; reference files are read, never changed.
import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {readFileSync,existsSync} from 'node:fs';
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-f',b=await combBBrowser();
const uri=f=>'data:image/png;base64,'+readFileSync(root+'/'+f).toString('base64');
const page=async(html,w,h)=>{await b.size(w,h);await b.send('Page.navigate',{url:'about:blank'});const{frameTree}=await b.send('Page.getFrameTree');await b.send('Page.setDocumentContent',{frameId:frameTree.frame.id,html:'<!doctype html><html><meta charset="utf-8"><style>body{margin:0;background:#151314;color:#f7f6f3;font:14px Arial}main{display:flex;gap:16px;padding:16px}figure{margin:0}figcaption{height:28px;line-height:28px}img{display:block;width:100%;height:auto}</style>'+html+'</html>'});await b.evaluate('Promise.all([...document.images].map(i=>i.decode())).then(()=>true)');await combBWait(200);};
try{
 for(const[w,h]of[[412,730],[1440,900]]){
  await b.size(w,h);await b.page('dist/journey-map.html');await b.evaluate('__jm.go("lennard",{instant:true})');await combBWait(1100);await b.evaluate('document.querySelector("#stop-lennard .c-close").click()');await combBWait(700);await b.shot('release-'+w+'x'+h+'-lennard-closed');
 }
 const pairs=[
 ['overview-phone','before-412x730-overview.png','release-412x730-overview.png',412,730,'Before F','F revision'],
 ['overview-desktop','before-1440x900-overview.png','release-1440x900-overview.png',720,450,'Before F','F revision'],
 ['serpent-phone','ref-captures/6d71e9f-412x730-serpent.png','release-412x730-serpent.png',412,730,'6d71e9f reference','F rest view'],
 ['serpent-desktop','ref-captures/6d71e9f-1440x900-serpent.png','release-1440x900-serpent.png',720,450,'6d71e9f reference','F rest view'],
 ['tree-phone','before-412x730-well.png','release-412x730-well.png',412,730,'Before F','F tree view'],
 ['beacon-phone','before-412x730-beacon.png','release-412x730-beacon.png',412,730,'Before F','F first reading'],
 ['horn-phone','before-412x730-horn.png','release-412x730-horn.png',412,730,'Before F (provided capture)','F raised horn and card'],
 ['hoard-phone','before-412x730-hoard-hmc1.png','release-412x730-hoard-hmc1.png',412,730,'Before F','F open chest and card'],
 ['trail-sketch','sketch','release-1440x900-lennard-closed.png',720,450,"Dan's sketch",'F held view, card folded']
 ];
 for(const[name,a,z,w,h,left,right]of pairs){const source=a==='sketch'?'data:image/png;base64,'+readFileSync('reference/dan-trail-sketch.png').toString('base64'):uri(a);await page('<main><figure style="width:'+w+'px"><figcaption>'+left+'</figcaption><img src="'+source+'"></figure><figure style="width:'+w+'px"><figcaption>'+right+'</figcaption><img src="'+uri(z)+'"></figure></main>',w*2+48,h+60);await b.shot('compare-'+name);}
 for(const[w,h]of[[412,730],[360,640],[1440,900]]){const width=w===1440?720:w,height=w===1440?450:h;await page('<main>'+[['before-'+w+'x'+h+'-explore.png','Before F'],['release-'+w+'x'+h+'-explore.png','F Explore rest']].map(([f,t])=>'<figure style="width:'+width+'px"><figcaption>'+t+'</figcaption><img src="'+uri(f)+'"></figure>').join('')+'</main>',width*2+48,height+60);await b.shot('compare-explore-'+w);}
 const frames=[];for(let ms=0;ms<=4200;ms+=200){const f='release-joined-move-'+String(ms).padStart(4,'0')+'.png';if(!existsSync(root+'/'+f))throw Error('missing joined strip '+f);frames.push('<figure style="width:206px"><figcaption>'+ms+' ms</figcaption><img src="'+uri(f)+'"></figure>');}await page('<main style="display:grid;grid-template-columns:repeat(4,206px);gap:8px">'+frames.join('')+'</main>',880,2420);await b.shot('release-joined-move-strip');
 console.log('Created 12 side-by-side comparisons and the joined 200 ms strip. References untouched.');
}finally{await b.close();}
