import assert from 'node:assert/strict';
import {tBrowser,save} from './comb-t-fixture.mjs';
const b=await tBrowser(),rows=[],fail=[];
try{for(const[w,h]of[[1920,950],[412,915]]){await b.size(w,h,w<641,1);for(const beat of['map','laurier','hmc1','mohawk','hmc2','interkom','lennard','x']){
 await b.page(false,beat);await b.advance(1500);
 const r=await b.raw(`(()=>{const box=e=>{const r=e.getBoundingClientRect();return[r.left,r.top,r.right,r.bottom]},words=[...document.querySelectorAll('.lg text')].map(box),symbols=[...document.querySelectorAll('.legend-symbol')].sort((a,b)=>a.dataset.i-b.dataset.i).map(box),gaps=words.slice(0,3).map((a,i)=>symbols[i+1][0]-a[2]),inside=words.map((a,i)=>a[0]-symbols[i][2]),c=__g.FD.st.cam;return{words,symbols,gaps,inside,center:(symbols[0][0]+words[3][2])/2,expected:300*c.s+c.tx}})()`);
 for(const kind of['gaps','inside'])if(Math.max(...r[kind])-Math.min(...r[kind])>.5)fail.push(w+' '+beat+' '+kind+' '+r[kind]);if(Math.abs(r.center-r.expected)>.5)fail.push(w+' '+beat+' center '+(r.center-r.expected));rows.push({w,h,beat,...r});
 }}if(b.errors.length)fail.push(...b.errors);}finally{await b.close();save('t-legend-results',{rows,fail});}console.log(JSON.stringify({rows:rows.length,fail}));assert.deepEqual(fail,[]);
