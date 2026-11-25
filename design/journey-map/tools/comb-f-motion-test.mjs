import {paceMove,paceAt,BEATS} from '../pace.mjs';
import {strict as assert} from 'node:assert';
for(const [a,b]of[[0,BEATS[1].P],[BEATS[1].P,0]]){
 const m=paceMove(a,b),steps=[];let p=a;for(let n=1;n/60<m.D;n++){const q=paceAt(m,n/60);steps.push(Math.abs(q-p));p=q;}
 const change=Math.max(...steps.slice(1).map((v,i)=>Math.abs(v/steps[i]-1)));console.log(JSON.stringify({from:a,to:b,seconds:m.D,movingIntervalChange:change,maxStep:Math.max(...steps),endpoint:paceAt(m,m.D)}));assert.ok(change<=.08,'F15 moving intervals change <=8%');assert.equal(paceAt(m,m.D),b);assert.ok(Math.abs(m.D/(b>a?4.1:2.46)-1)<.1,'F15 duration preserved');
}
