// Export bursts share the star renderer, its head/taper geometry and the loader's exposure window.
import { STREAK_WINDOW, streakGeometry } from './loader-stars.mjs';

const seed = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const red = new Set(Array.from({ length: 140 }, (_, i) => i).sort((a, b) => seed(a, 5) - seed(b, 5)).slice(0, 98));
export const SPARKS = Array.from({ length: 140 }, (_, i) => {
  const a = 2 * Math.PI * (i + 0.6 * seed(i, 1)) / 140, up = 0.08 + 0.85 * seed(i, 7) ** 1.6, flat = Math.sqrt(1 - up * up);
  return { d: [Math.cos(a) * flat, up, Math.sin(a) * flat], v: 5 + 11 * seed(i, 2) ** 1.4,
    tau: 0.13 + 0.11 * seed(i, 3), size: 1.5 + 1.5 * seed(i, 4), red: red.has(i), life: 0.7 + 0.55 * seed(i, 6) };
});
export const PUFF = SPARKS.filter((_, i) => i % 4 === 0).map(s => ({ ...s, v: s.v * 0.3, life: s.life * 0.6 }));
export function sparkOrigin(event, spark) {
  if (event.hx === undefined) return event.centre;
  const [dx, , dz] = spark.d, distance = Math.min(event.hx / Math.abs(dx), event.hz / Math.abs(dz));
  return [event.centre[0] + dx * distance, event.centre[1], event.centre[2] + dz * distance];
}
export function sparkAt(spark, centre, age) {
  const distance = spark.v * spark.tau * (1 - Math.exp(-Math.max(0, age) / spark.tau));
  return centre.map((v, i) => v + spark.d[i] * distance);
}
const wrap = (t, loop) => ((t % loop) + loop) % loop;
const project = (p, view) => [view.cx + view.S * p.reduce((n, v, i) => n + v * view.cam.r[i], 0),
  view.cy - view.S * p.reduce((n, v, i) => n + v * view.cam.u[i], 0)];
// Pure in loop time: held frames and seeks show the same sparks; they do not trigger field impulses.
export function sparkFrame(events, time, loop, view) {
  const attrs = [], trails = [];
  for (const event of events) {
    const age = wrap(time - event.at, loop);
    for (const spark of event.hx === undefined ? SPARKS : PUFF) {
      if (age > spark.life) continue;
      const fade = 1 - Math.min(1, Math.max(0, (age - 0.55 * spark.life) / (0.45 * spark.life)));
      const size = spark.size * fade * fade * (3 - 2 * fade);
      if (!(size > 0)) continue;
      const origin = sparkOrigin(event, spark);
      const [x, y] = project(sparkAt(spark, origin, age), view);
      const tail = project(sparkAt(spark, origin, age - STREAK_WINDOW), view);
      const shape = streakGeometry(x, y, size, tail);
      attrs.push(x, y, 1, size, spark.red ? 1 : 0);
      trails.push(x - tail[0], y - tail[1], ...shape.normal);
    }
  }
  const count = attrs.length / 5;
  return { count, attrs: new Float32Array(attrs), offsets: new Float32Array(count * 2), flags: new Float32Array(count).fill(1),
    alpha: new Float32Array(count).fill(1), mixes: new Float32Array(count), trails: new Float32Array(trails), front: count,
    attrsVersion: attrs, version: attrs, markSize: 0, par: [0, 0], scroll: 0, reveal: null };
}
// Called only by forward playback, once per crossed event, including across the loop boundary.
export function kickExportBursts(events, time, step, loop, view, field) {
  if (!view || !field || !(step > 0)) return;
  for (const event of events) if (event.hx === undefined && wrap(time - event.at, loop) < step) {
    const [x, y] = project(event.centre, view);
    field.burstAt(x, y, 2.6 * view.S);
  }
}
