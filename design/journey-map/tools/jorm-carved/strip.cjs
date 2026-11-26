const { inject, session } = require('./shoot.cjs');
const SAY = 'Jörmungandr, the revision loop. Poke him.';
const card = { css: 'position:fixed;left:1368px;top:186px;width:258px;background:#1F1C1D;border:1px solid #4A4541;border-radius:8px;padding:14px 16px;font-family:Outfit,sans-serif;color:#F7F6F3;z-index:99',
  html: '<div style="font-size:12px;letter-spacing:.14em;color:#9A948D;font-weight:600">SHIPPED</div><div style="margin-top:9px;border:1px dashed #9A948D;border-radius:5px;padding:9px 10px"><div style="font-size:10px;letter-spacing:.12em;color:#FF8A4C;font-weight:700">PLACEHOLDER · DAN TO WRITE</div><div style="font-size:15px;line-height:1.3;margin-top:5px;color:#C9C4BD">Every project goes round a few times. I make each round count.</div></div>' };
const STATES = [
  [{ file: { at: [434, 90], name: ['final.pdf'] } }, { say: SAY }],
  [{ jaw: -2, lump: 60 }, { say: SAY }],
  [{ jaw: 8, file: { at: [431, 90], rot: -8, name: ['final', '_v2', '.pdf'], caret: 1 } }, { say: SAY }],
  [{ jaw: 15, open: 1, file: { at: [430, 82], stamp: 1, name: ['final_v2', '_FINAL', '.pdf'], nameDy: -1, nameDx: 2, size: 4.6 } }, { say: 'Shipped. Poke him to start the next one.', card }],
];
(async () => {
  const k = process.argv[2] || 'A';
  let a = await session({ dpr: 2 });
  await a.run(7000);
  for (const o of 'ABC') { await inject(a, o, {}, { far: true }); await a.run(50); await a.shot('map-' + o, { clip: { x: 700, y: 30, width: 520, height: 760 } }); }
  await a.press('#mk-serpent'); await a.run(4500);
  for (const o of 'ABC') { await inject(a, o, STATES[0][0], { say: SAY }); await a.run(50); await a.shot('focus-' + o, { clip: { x: 420, y: 60, width: 1220, height: 770 } }); }
  for (let i = 0; i < 4; i++) { await inject(a, k, STATES[i][0], STATES[i][1]); await a.run(50); await a.shot('strip-' + (i + 1), { clip: { x: 476, y: 170, width: 1164, height: 622 } }); }
  await a.close();
  a = await session({ w: 412, h: 915, touch: true, dpr: 3 });
  await a.run(7000); await a.press('#mk-serpent'); await a.run(4500);
  await inject(a, k, STATES[0][0], { say: SAY }); await a.run(50); await a.shot('phone');
  await inject(a, k, STATES[3][0], { say: 'Shipped. Poke him to start the next one.' }); await a.run(50); await a.shot('phone-4');
  console.log(a.errors.slice(0, 3)); await a.close();
})();
