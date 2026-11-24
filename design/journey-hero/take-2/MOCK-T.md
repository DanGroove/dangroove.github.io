# MOCK-T: pop + sparks, the red-to-work step Dan picked (excerpt)

Dan picked "Pop + sparks" on 24 Nov 2026 at 3:06 PM ET, from a mock of five styles (pop, snap, stamp, lift, pop + sparks). This is an excerpt of that mock's code, built on the current hero with MOCK-X applied: **a reference for the look and the numbers only** (CORRECTIONS-19.md, L14). Build it properly inside L13's red-to-asset function and L13's star-layer sparks; do not paste it. Left out on purpose: the mock's style switch and the other four styles, its review panel and globals, and its separate 2D spark canvas.

## Units and their red blocks (stage.mjs)

```js
// A format's units: what turns as one. Each has parts, the red blocks it becomes (an object's own box: the stack, a device, each
// half of the copy lying open). Groups whose footprints overlap are one part (the copy lying shut on the stack); parts that only
// touch are one unit (the open copy's two halves); the rest are units of their own.
function boundsOf(pieces) {
  const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
  for (const pc of pieces) if (!pc.hide) for (const c of corners(pc)) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], c[k]); hi[k] = Math.max(hi[k], c[k]); }
  lo[1] = Math.max(0, lo[1]);
  return [lo, hi];
}
const overlaps = (a, b, gap = 0) => a[0][0] < b[1][0] + gap && b[0][0] < a[1][0] + gap && a[0][2] < b[1][2] + gap && b[0][2] < a[1][2] + gap;
const unite = (a, b) => [a[0].map((v, k) => Math.min(v, b[0][k])), a[1].map((v, k) => Math.max(v, b[1][k]))];
function unitsOf(f) {
  const body = f.pieces.find(pc => pc.deviceBody) || f.pieces[0], e = body.e.slice();
  const parts = (f.objects || [f.pieces]).map(g => g.filter(pc => !pc.hide)).filter(g => g.length).map(g => ({ pieces: g, box: boundsOf(g) }));
  for (let merged = true; merged;) {
    merged = false;
    for (let a = 0; a < parts.length && !merged; a++) for (let b = a + 1; b < parts.length && !merged; b++) if (overlaps(parts[a].box, parts[b].box)) {
      parts[a] = { pieces: [...parts[a].pieces, ...parts[b].pieces], box: unite(parts[a].box, parts[b].box) }; parts.splice(b, 1); merged = true;
    }
  }
  const units = [];
  for (const p of parts) {
    const u = units.find(u => u.parts.some(q => overlaps(q.box, p.box, 0.02)));
    if (u) { u.parts.push(p); u.box = unite(u.box, p.box); } else units.push({ parts: [p], box: p.box });
  }
  for (const u of units) { u.pieces = u.parts.flatMap(p => p.pieces); u.e = e; }
  return units;
}
// A red block lying over the box [lo, hi], or over its part between x0 and x1.
function redBox([lo, hi], e, part, grow = 0, x0 = -Infinity, x1 = Infinity) {
  const a = Math.max(lo[0], x0) - grow, b = Math.min(hi[0], x1) + grow, y0 = lo[1], y1 = hi[1] + grow, z0 = lo[2] - grow, z1 = hi[2] + grow;
  return redPiece([(a + b) / 2, (y0 + y1) / 2, (z0 + z1) / 2], [Math.max(0, (b - a) / 2), (z1 - z0) / 2, (y1 - y0) / 2], e.slice(), 'shape', part);
}
const redsOf = (u, part, grow = 0) => u.parts.map(p => redBox(p.box, u.e, part, grow));
// Scale pieces about the middle of the unit's footprint on the floor.
function scalePose(pieces, u, g) {
  const [lo, hi] = u.box, c = [(lo[0] + hi[0]) / 2, lo[1], (lo[2] + hi[2]) / 2];
  for (const pc of pieces) { pc.p = pc.p.map((v, k) => c[k] + g * (v - c[k])); pc.s = pc.s.map(v => v * g); }
  return pieces;
}
```

## The step, pop only (stage.mjs)

```js
const POP = { to: 1.08, at: 0.3 };
// The step between a unit's red blocks and the unit itself, one function used both ways. dir 'in' goes from red to the object
// (the arrival), 'out' from the object to red (the exit); k is the step's linear time, 0 to 1.
// pop: a quick swell, a cut at its height, and a settle. The arrival swells red and settles the object; the exit swells the
// object and settles red.
function become(P, u, k, dir, part) {
  const before = k < POP.at, g = before ? mix(1, POP.to, EASE.exit(k / POP.at)) : mix(POP.to, 1, EASE.enter((k - POP.at) / (1 - POP.at)));
  const showRed = dir === 'in' ? before : !before;
  if (showRed) P.push(...scalePose(redsOf(u, part), u, g));
  else { scalePose(u.pieces, u, g); for (const pc of u.pieces) P.push(pc); }
}
```

## Where and when the sparks start (stage.mjs)

`POP_SPOTS` is a module global the frame code fills; in the build, keep each unit's top rectangle at its cut in whatever state the star layer reads.

```js
export const POP_SPOTS = {};
// In exportOut, the arrival (per format j, units = unitsOf(f)), before anything else that frame:
    if (u < b.wipe + POP.at * (b.wiped - b.wipe)) POP_SPOTS[key + ':in:' + j] = units.map(topOf);
// and the exit (per format j, once its step has started):
        const exitUnits = unitsOf(f);
        if (v < w0 + POP.at * EXIT.wipe) POP_SPOTS[key + ':out:' + j] = exitUnits.map(topOf);

// The loop times of the cuts in "pop + sparks", one per unit each way, with where their sparks start.
export function popBursts() {
  const out = [];
  SHOW.forEach((scene, i) => {
    if (!['id', 'pr', 'ae', 'fig'].includes(scene.key)) return;
    const s = SCRIPTS[scene.key], a = action(s, 'export').start, { off } = playbackSpans(s);
    for (let j = 0; j < 3; j++) {
      const b = ballBeats(scene.key, j), inAt = starts[i] + a + (b.wipe + POP.at * (b.wiped - b.wipe)) * PACE, outAt = starts[i] + off[0] + (j * EXIT.stagger + POP.at * EXIT.wipe) * PACE;
      for (const o of POP_SPOTS[scene.key + ':in:' + j] || []) out.push({ at: inAt, centre: o.c, hx: o.hx, hz: o.hz });
      for (const o of POP_SPOTS[scene.key + ':out:' + j] || []) out.push({ at: outAt, centre: o.c, hx: o.hx, hz: o.hz });
    }
  });
  return out;
}
const topOf = u => ({ c: [(u.box[0][0] + u.box[1][0]) / 2, u.box[1][1], (u.box[0][2] + u.box[1][2]) / 2], hx: (u.box[1][0] - u.box[0][0]) / 2, hz: (u.box[1][2] - u.box[0][2]) / 2 });
```

## The puff (play.mjs, drawn over the scene with the burst's sparks)

```js
const PUFF = SPARKS.filter((_, i) => i % 4 === 0).map(sp => ({ ...sp, v: sp.v * 0.3, life: sp.life * 0.6 })), PUFF_LIFE = Math.max(...PUFF.map(sp => sp.life));

  const drawSet = (set, centre, age, from) => {
    for (const sp of set) {
      if (age > sp.life) continue;
      const c = from ? from(sp) : centre;
      const fade = 1 - Math.min(1, Math.max(0, (age - 0.55 * sp.life) / (0.45 * sp.life))), base = sp.size * fade * fade * (3 - 2 * fade);
      if (!(base > 0.05)) continue;
      const [x, y] = toScreen(sparkAt(sp, c, age)), [tx, ty] = toScreen(sparkAt(sp, c, age - win));
      const len = Math.hypot(x - tx, y - ty), size = base;   // the mock's width control was at 1 (x1 width)
      sctx.fillStyle = sp.red ? '#F0484F' : '#F7F6F3';
      if (len > size) {
        const nx = -(y - ty) / len * size / 2, ny = (x - tx) / len * size / 2;
        sctx.beginPath(); sctx.moveTo(tx, ty); sctx.lineTo(x + nx, y + ny); sctx.lineTo(x - nx, y - ny); sctx.closePath(); sctx.fill();
      }
      sctx.beginPath(); sctx.arc(x, y, size / 2, 0, 2 * Math.PI); sctx.fill();
    }
  };

  // As each object pops, the red comes off its top edges as a ring of the same sparks, each
  // leaving the edge where its own direction crosses it.
  for (const b of popBursts()) {
    const age = wrap(t - b.at);
    if (age > PUFF_LIFE) continue;
    drawSet(PUFF, b.centre, age, sp => { const dx = sp.d[0], dz = sp.d[2], m = Math.min(b.hx / Math.max(1e-6, Math.abs(dx)), b.hz / Math.max(1e-6, Math.abs(dz))); return [b.centre[0] + dx * m, b.centre[1], b.centre[2] + dz * m]; });
  }
}
```
