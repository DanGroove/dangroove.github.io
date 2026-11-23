// Pure progress/time conversion. Parts and beats follow the existing act sequence.
import { STEPS, HOLD, STOPS } from './data.mjs';
import { SEQ, progressForStop } from './trip.mjs';

export const BEATS = [
  { id: 'top', P: SEQ[0].a },
  { id: 'map', P: SEQ.find(s => s.kind === 'overview').a + SEQ.find(s => s.kind === 'overview').len / 2 },
  ...STOPS.map((s, i) => ({ id: s.id, P: progressForStop(i) })),
  { id: 'x', P: SEQ.find(s => s.kind === 'rush').a },
  { id: 'end', P: SEQ.find(s => s.kind === 'rest').a },
];
export const PACE_PARTS = (() => {
  const parts = []; let time = 0;
  const add = (a, b, seconds) => { parts.push({ a, b, t: time, seconds }); time += seconds; };
  SEQ.forEach(s => {
    const p = STEPS.pace;
    if (s.kind === 'rest') return;
    if (s.kind === 'hold') {
      const open = s.a + s.len * HOLD.open[1], fold = s.a + s.len * HOLD.fold[0];
      add(s.a, open, p.holdIn); add(open, fold, p.holdOpen); add(fold, s.a + s.len, p.holdOut);
    } else add(s.a, s.a + s.len, s.kind === 'leg' ? Math.min(p.legMax, p.legBase + p.legPerVh * s.len) : p[s.kind]);
  });
  return parts;
})();
const paceLimit = BEATS[BEATS.length - 1].P;
const paceLast = PACE_PARTS[PACE_PARTS.length - 1];
export const PACE_SECONDS = paceLast.t + paceLast.seconds;
const paceClamp = (v, hi) => Math.max(0, Math.min(hi, v));
export function paceT(P) {
  const p = paceClamp(P, paceLimit), part = PACE_PARTS.find(s => p <= s.b) || paceLast;
  return part.t + (p - part.a) / (part.b - part.a) * part.seconds;
}
export function paceP(T) {
  const t = paceClamp(T, PACE_SECONDS), part = PACE_PARTS.find(s => t <= s.t + s.seconds) || paceLast;
  return part.a + (t - part.t) / part.seconds * (part.b - part.a);
}
export function paceMove(P0, P1) {
  const T0 = paceT(P0), T1 = paceT(P1);
  return { P0: paceP(T0), P1: paceP(T1), T0, T1, D: Math.max(STEPS.minMove, Math.abs(T1 - T0) * (P1 < P0 ? STEPS.back : 1)) };
}
export function paceEase(x, D) {
  const q = paceClamp(x, 1), r = Math.min(0.5, STEPS.ramp / D);
  if (q < r) return q * q / (2 * r * (1 - r));
  if (q > 1 - r) return 1 - (1 - q) * (1 - q) / (2 * r * (1 - r));
  return (q - r / 2) / (1 - r);
}
export function paceAt(move, t) {
  if (t <= 0) return move.P0;
  if (t >= move.D) return move.P1;
  return paceP(move.T0 + (move.T1 - move.T0) * paceEase(t / move.D, move.D));
}
