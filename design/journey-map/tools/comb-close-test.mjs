// Deterministic shared exit score. Real browser entry/exit is checked separately.
import { strict as assert } from 'node:assert';
import { FD, closeSheet, findSheet, findSheetFrame } from '../findkit.mjs';
import { VIEW } from '../trip.mjs';
globalThis.document = { getElementById() { return null; }, documentElement: { classList: { remove() {} } } };
Object.assign(VIEW, { w: 1000, h: 800 });
const style = () => ({ setProperty(k,v) { this[k] = v; } });
let cases = 0;
for (const id of ['hammer','runestone','ravens']) for (const path of ['Close','Escape','outside','Back','camera','replace']) for (const opening of [0,.23,1]) {
  let returned = false;
  const owner = { id, el: { focus() { returned = true; } } };
  Object.assign(FD, { rm: false, now: 0, st: { P: 0, cam: { s:1,tx:0,ty:0 } }, sheetOwner: owner, sheet: { style: style() }, dismiss: {}, sheetFrom: [10,20], sheetAnchor: [10,20], sheetK: opening, sheetClosing: false });
  closeSheet(path === 'replace'); assert.equal(FD.sheetOwner, owner); assert.equal(FD.sheetMotion.from, opening);
  for (let ms=0; ms<200; ms+=4) { FD.now=ms/1000; findSheetFrame(owner,1); await Promise.resolve(); assert.equal(FD.sheetOwner, owner, id+'/'+path+' removed early'); assert.ok(FD.sheetK <= opening + 1e-12, 'exit jumped to full size'); }
  FD.now=.201; findSheetFrame(owner,1); await Promise.resolve(); assert.equal(FD.sheetOwner,null); assert.equal(returned,true); cases++;
}
for(const id of ['hammer','runestone','ravens']) {
  const owner={id};Object.assign(FD,{rm:false,now:0,st:{P:0,cam:{s:1,tx:0,ty:0}},sheetOwner:owner,sheet:{style:style()},sheetK:.7,sheetClosing:false,sheetFrom:[10,20],sheetAnchor:[10,20]});
  closeSheet();FD.now=.08;findSheetFrame(owner,1);const at=FD.sheetK;
  assert.equal(findSheet(owner,'','',[10,20]),true);assert.equal(FD.sheetMotion.from,at);assert.equal(FD.sheetClosing,false);
  findSheetFrame(owner,1);assert.equal(FD.sheetK,at,'reopening jumped');FD.now+=.36;findSheetFrame(owner,1);assert.equal(FD.sheetK,1);
}
console.log(`ok: ${cases} shared sheet exits across three owners, six paths and three opening positions stay present for 200 ms; three mid-close reopenings reverse continuously`);
