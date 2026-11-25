import {gBrowser,gRoot,gWait} from './comb-g-browser-test.mjs';
import {writeFileSync} from 'node:fs';
const b=await gBrowser(),fail=[],rows=[];
try{
 await b.size(1440,900);await b.page(false,'laurier');await b.click('#stop-laurier .c-close');await gWait(500);await b.click('.mm-stop[data-i="5"]');await b.rest();const mini=await b.read('({beat:document.documentElement.dataset.beat,focus:document.activeElement?.outerHTML.slice(0,180)})');rows.push(mini);if(mini.beat!=='lennard'||mini.focus?.startsWith('<body'))fail.push('G17 mini-map focus handoff');
 await b.size(412,730,true);await b.page(true,'top');await b.click('.jm-start',true);await b.rest();await b.click('.go-back',true);await b.rest();const touch=await b.read('({start:document.activeElement?.matches(".jm-start"),outline:getComputedStyle(document.activeElement).outlineStyle})');rows.push(touch);if(!touch.start||touch.outline!=='none')fail.push('G21 touch ring');await b.key('Tab');await b.key('Tab',true);const keyboard=await b.read('({start:document.activeElement?.matches(".jm-start"),outline:getComputedStyle(document.activeElement).outlineStyle,width:getComputedStyle(document.activeElement).outlineWidth})');rows.push(keyboard);if(!keyboard.start||keyboard.outline==='none'||parseFloat(keyboard.width)<2)fail.push('G21 keyboard ring restored');
 if(b.errors.length)fail.push(...b.errors);
}finally{await b.close();writeFileSync(gRoot+'/focus-results.json',JSON.stringify({fail,rows},null,2));}
console.log('Focus failures '+JSON.stringify(fail));process.exitCode=fail.length?1:0;
