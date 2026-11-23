// Node-only pace checks, including every neighbouring beat in both directions.
import { BEATS, paceT, paceP, paceMove, paceAt } from '../pace.mjs';

const stepAssert = (condition, message) => { if (!condition) throw new Error(message); };
const stepEnd = BEATS[BEATS.length - 1].P;
let stepPrevious = -1;
for (let P = 0; P <= stepEnd; P++) {
  const t = paceT(P);
  stepAssert(t > stepPrevious, `paceT did not rise at ${P}`); stepPrevious = t;
  stepAssert(Math.abs(paceP(t) - P) < 1e-6, `inverse failed at ${P}`);
}
stepAssert(Math.abs(paceP(paceT(stepEnd)) - stepEnd) < 1e-6, 'inverse failed at rest');
console.log('ok: paceT strictly rises; paceP round trips every whole P and the rest boundary within 1e-6');
console.log('move | forward seconds | back seconds');
for (let i = 1; i < BEATS.length; i++) {
  const a = BEATS[i - 1], b = BEATS[i], forward = paceMove(a.P, b.P), back = paceMove(b.P, a.P);
  for (const move of [forward, back]) {
    stepAssert(paceAt(move, 0) === move.P0 && Math.abs(move.P0 - (move === forward ? a.P : b.P)) < 1e-6, 'move start');
    stepAssert(paceAt(move, move.D) === move.P1 && Math.abs(move.P1 - (move === forward ? b.P : a.P)) < 1e-6, 'move end');
    let prev = move.P0;
    for (let n = 1; n <= 1000; n++) {
      const p = paceAt(move, move.D * n / 1000);
      stepAssert((p - prev) * Math.sign(move.P1 - move.P0) >= -1e-9, `move reversed: ${a.id}/${b.id}`); prev = p;
    }
  }
  stepAssert(forward.D >= 1.5 && forward.D <= 5, `forward duration outside 1.5-5 seconds: ${a.id}/${b.id}`);
  console.log(`${a.id} -> ${b.id} | ${forward.D.toFixed(3)} | ${back.D.toFixed(3)}`);
}
console.log('ok: all 18 moves start/end correctly and never turn back; all 9 forward durations are within 1.5-5 seconds');
