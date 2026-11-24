// L7's pure drawing gates. Exercise loaderDots itself; no browser, pixels or alternate renderer.
import assert from 'node:assert/strict';

const close = (a, b, message, epsilon = 1e-9) => assert.ok(Math.abs(a - b) <= epsilon, `${message}: ${a} != ${b}`);
const all = { fonts: 0, atlas: 0, frame: 0 };
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

export function checkLoaderMoves(P, scene) {
  const { points, homes, mark, centre } = scene, weight = [centre[0] + mark.weight[0], centre[1] + mark.weight[1]];
  const where = `${scene.W}x${scene.H}`;
  close(scene.weight[0], weight[0], 'L7 scale: weight x'); close(scene.weight[1], weight[1], 'L7 scale: weight y');
  const angle = p => Math.atan2(p.y - weight[1], p.x - weight[0]);
  const order = list => list.map((p, i) => i).sort((a, b) => angle(list[a]) - angle(list[b]) || a - b);
  const markOrder = order(points), homeOrder = order(homes), count = Math.min(points.length, homes.length);
  const expected = new Map(Array.from({ length: count }, (_, rank) => [markOrder[Math.floor(rank * points.length / count)], homeOrder[Math.floor(rank * homes.length / count)]]));
  // Angular order is checked before uniqueness, so the old index/modulo pairing fails its own gate.
  for (const [i, m] of points.entries()) assert.equal(m.home, expected.get(i) ?? null, `L7 angle order: ${where} star ${i}`);
  const assigned = markOrder.filter(i => points[i].home !== null).map(i => points[i].home);
  assert.equal(new Set(assigned).size, count, `L7 homes: duplicate paired home ${where}`);
  if (homes.length <= points.length) assert.deepEqual([...assigned].sort((a, b) => a - b), homes.map((_, i) => i), `L7 homes: unused phone home ${where}`);
  const used = new Set(assigned), unused = homeOrder.filter(i => !used.has(i));
  assert.deepEqual(scene.unpairedHomes, unused, `L7 homes: unpaired field stars ${where}`);
  for (const m of points.filter(m => m.home === null)) {
    const dx = m.x - weight[0], dy = m.y - weight[1], ex = m.exit[0] - weight[0], ey = m.exit[1] - weight[1];
    close(dx * ey - dy * ex, 0, `L7 rays: surplus star turns ${where}`, 1e-8);
    assert.ok(dx * ex + dy * ey > 1.10 * (dx * dx + dy * dy), `L7 rays: surplus star does not go outward ${where}`);
    assert.ok(m.exit[0] < 0 || m.exit[0] > scene.W || m.exit[1] < 0 || m.exit[1] > scene.H, `L7 rays: surplus endpoint inside screen ${where}`);
  }
  close(P.LOADER.flight, 1, 'L7 flight curve: duration'); close(P.LOADER.burst, 1.6, 'L7 explosion curve: duration');
  const base = P.loaderAt(0, all), launches = points.map(() => 0);
  let flightSamples = 0, scaleSamples = 0, explosionSamples = 0;
  // Align local clocks to exercise every original Bezier, not just the first launched star.
  for (let n = 1; n <= 240; n++) {
    const f = n / 240, t = 1 - (1 - f) ** 3, u = 1 - t;
    const dots = P.loaderDots(scene, { ...base, launches, time: f });
    assert.equal(dots.length, points.length, 'L7 flight curve: lost star');
    for (const [i, m] of points.entries()) {
      const d = dots[i];
      close(d.x, u * u * m.start[0] + 2 * u * t * m.control[0] + t * t * m.x, `L7 flight curve: x ${where}/${i}/${n}`);
      close(d.y, u * u * m.start[1] + 2 * u * t * m.control[1] + t * t * m.y, `L7 flight curve: y ${where}/${i}/${n}`);
      assert.equal(d.size, m.size, 'L7 flight curve: size'); assert.deepEqual(d.colour, m.colour, 'L7 flight curve: colour');
      flightSamples++;
    }
  }
  const draw = time => P.loaderDots(scene, P.loaderAt(time, all));
  for (const phase of ['hold', 'shrink', 'swell']) {
    const start = phase === 'hold' ? base.holdAt : phase === 'shrink' ? base.shrinkStart : base.swellStart;
    const duration = phase === 'hold' ? 0.15 : phase === 'shrink' ? 0.4 : 0.25;
    for (let n = 0; n <= duration * 240; n++) {
      const p = n / (duration * 240), scale = phase === 'hold' ? 1 : phase === 'shrink' ? 1 - 0.16 * (0.5 - 0.5 * Math.cos(Math.PI * p)) : 0.84 + 0.26 * p * p;
      const dots = draw(start + n / 240);
      assert.equal(dots.length, phase === 'swell' && n === duration * 240 ? points.length + unused.length : points.length, 'L7 scale: star count');
      for (const [i, m] of points.entries()) {
        const d = dots[i];
        close(d.x, weight[0] + (m.x - weight[0]) * scale, `L7 scale: ${phase} x ${where}/${i}/${n}`);
        close(d.y, weight[1] + (m.y - weight[1]) * scale, `L7 scale: ${phase} y ${where}/${i}/${n}`);
        assert.equal(d.size, m.size, 'L7 scale: changed star size'); assert.deepEqual(d.colour, m.colour, 'L7 scale: changed colour');
        assert.equal(d.alpha, 1, 'L7 scale: changed alpha'); scaleSamples++;
      }
    }
  }
  // One-sided, three-point derivatives stay within the shrink at its endpoints.
  // 1e-5 px/s is numerical subtraction/stencil noise, not a design speed tolerance.
  const h = 1e-5, noise = 1e-5;
  let flightArrivalSpeed = 0, scaleStop = 0, arrivalSpeed = 0;
  const flightEnd = time => P.loaderDots(scene, { ...base, launches, time });
  const fa = flightEnd(1), fb = flightEnd(1 - h), fc = flightEnd(1 - 2 * h);
  for (let i = 0; i < points.length; i++) {
    const speed = Math.hypot(3 * fa[i].x - 4 * fb[i].x + fc[i].x, 3 * fa[i].y - 4 * fb[i].y + fc[i].y) / (2 * h);
    assert.ok(speed <= noise, `L7 flight curve: nonzero arrival ${where}/${i} ${speed}`); flightArrivalSpeed = Math.max(flightArrivalSpeed, speed);
  }
  for (const [time, sign] of [[base.shrinkStart, 1], [base.swellStart, -1]]) {
    const a = draw(time), b = draw(time + sign * h), c = draw(time + sign * 2 * h);
    for (let i = 0; i < points.length; i++) {
      const speed = Math.hypot(3 * a[i].x - 4 * b[i].x + c[i].x, 3 * a[i].y - 4 * b[i].y + c[i].y) / (2 * h);
      assert.ok(speed <= noise, `L7 scale stop: ${where}/${i} ${speed}`); scaleStop = Math.max(scaleStop, speed);
    }
  }
  let previous = null, speeds = null, maximumRise = 0;
  for (let n = 0; n <= 384; n++) {
    const p = n / 384, blend = 1 - (1 - p) ** 3, dots = draw(base.burstStart + n / 240);
    assert.equal(dots.length, points.length + unused.length, 'L7 explosion curve: star count');
    for (const [i, m] of points.entries()) {
      const d = dots[i], home = homes[m.home], target = home || { x: m.exit[0], y: m.exit[1], size: m.size, colour: m.colour };
      const x = weight[0] + (m.x - weight[0]) * 1.10, y = weight[1] + (m.y - weight[1]) * 1.10;
      close(d.x, x + (target.x - x) * blend, `L7 explosion curve: line x ${where}/${i}/${n}`);
      close(d.y, y + (target.y - y) * blend, `L7 explosion curve: line y ${where}/${i}/${n}`);
      close(d.size, m.size + (target.size - m.size) * blend, 'L7 explosion curve: size');
      d.colour.forEach((v, k) => close(v, m.colour[k] + (target.colour[k] - m.colour[k]) * blend, 'L7 explosion curve: colour'));
      close(d.alpha, home ? 1 : 1 - blend, 'L7 explosion curve: surplus fade'); explosionSamples++;
    }
    for (const [j, home] of unused.entries()) {
      const d = dots[points.length + j];
      assert.equal(d.home, home, 'L7 homes: field identity'); assert.equal(d.x, homes[home].x, 'L7 homes: field x'); assert.equal(d.y, homes[home].y, 'L7 homes: field y');
      assert.equal(d.size, homes[home].size, 'L7 homes: field size'); assert.deepEqual(d.colour, homes[home].colour, 'L7 homes: field colour');
      close(d.alpha, blend, 'L7 explosion curve: other field fade');
    }
    if (previous) {
      const nextSpeeds = dots.map((d, i) => distance(d, previous[i]) * 240);
      if (speeds) nextSpeeds.forEach((speed, i) => {
        const rise = speed - speeds[i]; maximumRise = Math.max(maximumRise, rise);
        assert.ok(rise <= noise, `L7 explosion speed: rises ${rise} ${where}/${i}/${n}`);
      });
      speeds = nextSpeeds;
    }
    previous = dots;
  }
  const a = draw(base.end), b = draw(base.end - h), c = draw(base.end - 2 * h);
  for (let i = 0; i < a.length; i++) {
    const speed = Math.hypot(3 * a[i].x - 4 * b[i].x + c[i].x, 3 * a[i].y - 4 * b[i].y + c[i].y) / (2 * h);
    assert.ok(speed <= noise, `L7 explosion speed: nonzero arrival ${where}/${i} ${speed}`); arrivalSpeed = Math.max(arrivalSpeed, speed);
  }
  return { viewport: where, paired: count, otherHomes: unused.length, surplus: points.length - count,
    flightSamples, scaleSamples, explosionSamples, flightArrivalSpeed, scaleStop, maximumRise, arrivalSpeed };
}
