// L7/L8/L9 pure drawing gates. Exercise loaderDots itself; no browser or pixels.
import assert from 'node:assert/strict';

const close = (a, b, message, epsilon = 1e-9) => assert.ok(Math.abs(a - b) <= epsilon, `${message}: ${a} != ${b}`);
const all = { fonts: 0, atlas: 0, frame: 0 };
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const at = (P, scene, time) => P.loaderLanding(P.loaderAt(time, all), scene.duration);
const expand = (scene, dots) => {
  const byStar = new Map(dots.map(d => [d.star, d])), byHome = new Map(dots.map(d => [d.home, d]));
  return [...scene.points.map((m, i) => byStar.get(i) || byHome.get(m.home)), ...scene.unpairedHomes.map(i => byHome.get(i))];
};

export function checkLoaderLanding(P, scene) {
  const { points, homes } = scene, where = `${scene.W}x${scene.H}`;
  // Check landing before angular pairing: L7's edge-bound leftovers must fail here.
  for (const [i, m] of points.entries()) {
    assert.ok(Number.isInteger(m.home) && homes[m.home], `L8 landing: ${where} star ${i} has no field home`);
  }
  const state = at(P, scene, 0), end = P.loaderDots(scene, at(P, scene, state.end));
  const byHome = new Map(end.map(d => [d.home, d]));
  let landingSamples = 0;
  for (const time of [state.end, state.end + 1 / 240, state.end + 1]) {
    const dots = P.loaderDots(scene, at(P, scene, time));
    assert.equal(dots.length, homes.length, `L8 landing: ${where} terminal field count`);
    assert.equal(new Set(dots.map(d => d.home)).size, homes.length, `L8 landing: ${where} draws a shared home twice`);
    for (const d of dots) {
      const home = homes[d.home];
      assert.ok(home, `L8 landing: ${where} endpoint has no field home`);
      assert.equal(d.x, home.x, 'L8 landing: x'); assert.equal(d.y, home.y, 'L8 landing: y');
      assert.equal(d.size, home.size, 'L8 landing: size'); assert.deepEqual(d.colour, home.colour, 'L8 landing: colour');
      assert.equal(d.alpha, 1, 'L8 landing: alpha'); assert.equal(d.flag, 0, 'L8 landing: field flag');
      landingSamples++;
    }
  }
  const before = expand(scene, P.loaderDots(scene, at(P, scene, state.end - 1e-7)));
  for (const [i, m] of points.entries()) {
    const d = byHome.get(m.home), home = homes[m.home], incoming = before[i];
    assert.ok(d, `L8 landing: ${where} star ${i} misses its home`);
    assert.equal(d.x, home.x, 'L8 landing: star x'); assert.equal(d.y, home.y, 'L8 landing: star y');
    assert.equal(d.size, home.size, 'L8 landing: star size'); assert.deepEqual(d.colour, home.colour, 'L8 landing: star colour');
    assert.equal(incoming.home, m.home, 'L8 handover: incoming home'); assert.equal(incoming.alpha, 1, 'L8 handover: incoming star fades');
    close(incoming.x, d.x, 'L8 handover: x', 0.001); close(incoming.y, d.y, 'L8 handover: y', 0.001);
    close(incoming.size, d.size, 'L8 handover: size', 0.001);
    incoming.colour.forEach((v, k) => close(v, d.colour[k], 'L8 handover: colour', 0.001));
  }
  const occupancy = homes.map((_, home) => points.filter(m => m.home === home).length);
  if (homes.length < points.length) {
    assert.ok(occupancy.every(n => n >= 1 && n <= 2), `L8 homes: ${where} needs one or two stars per home`);
    assert.equal(occupancy.filter(n => n === 2).length, points.length - homes.length, 'L8 homes: shared count');
  }
  return { viewport: where, stars: points.length, homes: homes.length,
    singleHomes: occupancy.filter(n => n === 1).length, sharedHomes: occupancy.filter(n => n === 2).length,
    landingSamples, starLandings: points.length };
}

export function checkLoaderMoves(P, scene) {
  const { points, homes, mark, centre } = scene, weight = [centre[0] + mark.weight[0], centre[1] + mark.weight[1]];
  const where = `${scene.W}x${scene.H}`, base = at(P, scene, 0), launches = points.map(() => 0);
  const draw = time => P.loaderDots(scene, at(P, scene, time));
  close(scene.weight[0], weight[0], 'L7 scale: weight x'); close(scene.weight[1], weight[1], 'L7 scale: weight y');
  const angle = p => Math.atan2(p.y - weight[1], p.x - weight[0]);
  const order = list => list.map((p, i) => i).sort((a, b) => angle(list[a]) - angle(list[b]) || a - b);
  const markOrder = order(points), homeOrder = order(homes), count = Math.min(points.length, homes.length);
  for (const [rank, i] of markOrder.entries()) assert.equal(points[i].home, homeOrder[Math.floor(rank * homes.length / points.length)], `L7 angle order: ${where} star ${i}`);
  const used = new Set(points.map(m => m.home)), unused = homeOrder.filter(i => !used.has(i));
  assert.equal(used.size, count, `L7 homes: paired coverage ${where}`);
  assert.deepEqual(scene.unpairedHomes, unused, `L7 homes: unpaired field stars ${where}`);
  close(P.LOADER.flight, 1, 'L7 flight curve: duration');
  const durations = points.map(m => m.duration), minDuration = Math.min(...durations), maxDuration = Math.max(...durations);
  close(scene.duration, maxDuration, 'L9 depth: last landing');
  for (const [i, m] of points.entries()) {
    const d = homes[m.home].d, jitter = 0.94 + 0.12 * P.hash(m.home, 21);
    close(m.duration, (1 + 0.6 * (1 - d)) * jitter, `L9 depth: duration ${where}/${i}`);
    assert.ok(m.duration >= 0.94 && m.duration <= 1.696, 'L9 depth: range');
  }
  // Jitter can exchange close depths. Removing it must give strict depth order;
  // depths with nonoverlapping jitter bands must land in that order even with jitter.
  const depthOrder = [...points].sort((a, b) => homes[a.home].d - homes[b.home].d);
  for (let i = 1; i < depthOrder.length; i++) {
    const far = depthOrder[i - 1], near = depthOrder[i];
    assert.ok(far.duration / (0.94 + 0.12 * P.hash(far.home, 21)) >= near.duration / (0.94 + 0.12 * P.hash(near.home, 21)) - 1e-12, 'L9 depth: normalized order');
  }
  for (const far of points) for (const near of points) {
    if ((1 + 0.6 * (1 - homes[far.home].d)) * 0.94 > (1 + 0.6 * (1 - homes[near.home].d)) * 1.06) assert.ok(far.duration > near.duration, 'L9 depth: separated order');
  }
  close(base.end, base.burstStart + maxDuration, 'L5 timing: scene landing');
  assert.ok(!at(P, scene, base.end - 1e-8).done && at(P, scene, base.end).done, 'L5 timing: actual last star boundary');
  assert.equal(at(P, scene, base.end).entranceTime, 0, 'L5 timing: scene entrance zero');
  let flightSamples = 0, scaleSamples = 0, explosionSamples = 0, streakSamples = 0, waveSamples = 0;
  let longestFlight = 0, longestBlast = 0, maximumRise = 0, depthGrowth = 1;
  const checkTrail = (d, previous, gate) => {
    const length = distance(d, previous);
    close(d.streak ?? 0, length, `${gate} length`, 1e-8);
    if (length > d.size) {
      assert.ok(d.tail, `${gate} absent tail`);
      close(d.tail[0], previous.x, `${gate} tail x`); close(d.tail[1], previous.y, `${gate} tail y`);
    }
    streakSamples++; return length;
  };
  // Every original Bezier, with a local launch clock. Keep L7's 240 position/look samples.
  const flightAt = time => P.loaderDots(scene, { ...base, launches, time });
  const flightTimes = new Set([...Array.from({ length: 240 }, (_, i) => (i + 1) / 240), 0.02]);
  for (const f of [...flightTimes].sort((a, b) => a - b)) {
    const n = f * 240, t = 1 - (1 - f) ** 3, u = 1 - t, dots = flightAt(f);
    const previous = f > 0.02 ? flightAt(f - 0.02) : null;
    assert.equal(dots.length, points.length, 'L7 flight curve: lost star');
    for (const [i, m] of points.entries()) {
      const d = dots[i];
      close(d.x, u * u * m.start[0] + 2 * u * t * m.control[0] + t * t * m.x, `L7 flight curve: x ${where}/${i}/${n}`);
      close(d.y, u * u * m.start[1] + 2 * u * t * m.control[1] + t * t * m.y, `L7 flight curve: y ${where}/${i}/${n}`);
      assert.equal(d.size, m.size, 'L7 flight curve: size'); assert.deepEqual(d.colour, m.colour, 'L7 flight curve: colour');
      longestFlight = Math.max(longestFlight, checkTrail(d, previous?.[i] || { x: m.start[0], y: m.start[1] }, 'L9 streak: flight'));
      flightSamples++;
    }
  }
  const inOut = p => p <= 0.5 ? 4 * p * p * p : 1 - 4 * (1 - p) ** 3;
  for (const [phase, start, duration] of [['hold', base.holdAt, 0.15], ['shrink', base.shrinkStart, 0.35], ['compressed', base.compressedStart, 0.08], ['swell', base.swellStart, 0.18]]) {
    const times = new Set([0, duration - 1e-8]);
    for (let n = 0; n / 240 < duration; n++) times.add(n / 240);
    for (const local of times) {
      const p = local / duration, time = start + local;
      const scale = phase === 'hold' ? 1 : phase === 'shrink' ? 1 - 0.22 * inOut(p) : phase === 'compressed' ? 0.78 : 0.78 + 0.32 * p ** 3;
      const charge = 1 + 0.3 * inOut(Math.min(1, Math.max(0, (time - base.shrinkStart) / 0.43)));
      const dots = draw(time);
      assert.equal(dots.length, points.length, 'L7 scale: star count');
      for (const [i, m] of points.entries()) {
        const d = dots[i];
        close(d.x, weight[0] + (m.x - weight[0]) * scale, `L7 scale: ${phase} x ${where}/${i}`);
        close(d.y, weight[1] + (m.y - weight[1]) * scale, `L7 scale: ${phase} y ${where}/${i}`);
        close(d.size, m.size * charge, 'L9 size: charge'); assert.deepEqual(d.colour, m.colour, 'L7 scale: colour');
        assert.equal(d.alpha, 1, 'L7 scale: alpha'); assert.ok(!(d.streak > 0), 'L9 streak: wind-up'); scaleSamples++;
      }
    }
  }
  const h = 1e-5, noise = 1e-5;
  let flightArrivalSpeed = 0, scaleStop = 0, arrivalSpeed = 0;
  const derivative = (a, b, c) => Math.hypot(3 * a.x - 4 * b.x + c.x, 3 * a.y - 4 * b.y + c.y) / (2 * h);
  const fa = flightAt(1), fb = flightAt(1 - h), fc = flightAt(1 - 2 * h);
  for (const [i] of points.entries()) {
    const speed = derivative(fa[i], fb[i], fc[i]);
    assert.ok(speed <= noise, `L7 flight curve: nonzero arrival ${where}/${i}`); flightArrivalSpeed = Math.max(flightArrivalSpeed, speed);
  }
  for (const [time, sign] of [[base.shrinkStart, 1], [base.compressedStart, -1], [base.swellStart, 1]]) {
    const a = draw(time), b = draw(time + sign * h), c = draw(time + sign * 2 * h);
    for (let i = 0; i < points.length; i++) {
      const speed = derivative(a[i], b[i], c[i]);
      assert.ok(speed <= noise, `L7 scale stop: ${where}/${i} ${speed}`); scaleStop = Math.max(scaleStop, speed);
    }
  }
  let previous = null, speeds = null;
  const blastAt = local => expand(scene, draw(base.burstStart + local));
  const samples = new Set([0, 0.02, maxDuration, 0.3, ...durations]);
  for (let n = 0; n / 240 < maxDuration; n++) samples.add(n / 240);
  // Fixed 240 Hz intervals check monotone speed; exact individual arrival samples
  // additionally check each final size/colour and shared-home merge.
  for (const elapsed of [...samples].sort((a, b) => a - b)) {
    const actual = draw(base.burstStart + elapsed), dots = expand(scene, actual);
    const drawnStars = new Set(actual.map(d => d.star));
    const trailing = blastAt(Math.max(0, elapsed - 0.02));
    const landedHomes = new Set();
    let expectedCount = unused.length;
    for (const m of points) if (base.burstStart + elapsed < base.burstStart + m.duration) expectedCount++; else landedHomes.add(m.home);
    expectedCount += landedHomes.size;
    assert.equal(actual.length, expectedCount, 'L8 landing: per-home merge');
    for (const [i, m] of points.entries()) {
      const d = dots[i], target = homes[m.home], p = Math.min(1, elapsed / m.duration), g = 1 - (1 - p) ** 3;
      const x = weight[0] + (m.x - weight[0]) * 1.10, y = weight[1] + (m.y - weight[1]) * 1.10;
      close(d.x, x + (target.x - x) * g, `L7 explosion curve: line x ${where}/${i}`);
      close(d.y, y + (target.y - y) * g, `L7 explosion curve: line y ${where}/${i}`);
      const depth = 1 + 1.6 * Math.max(0, target.d - 0.4) * Math.sin(Math.PI * g);
      const flare = 1 + 0.7 * Math.max(0, 1 - elapsed / 0.3) ** 3;
      close(d.size, (m.size + (target.size - m.size) * g) * depth * flare, 'L9 size: depth/flare');
      depthGrowth = Math.max(depthGrowth, depth);
      d.colour.forEach((v, k) => close(v, m.colour[k] + (target.colour[k] - m.colour[k]) * g, 'L7 explosion curve: colour'));
      assert.equal(d.alpha, 1, 'L8 explosion: mark star fades');
      if (drawnStars.has(i)) longestBlast = Math.max(longestBlast, checkTrail(d, trailing[i], 'L9 streak: blast'));
      if (elapsed >= m.duration) {
        close(d.size, target.size, 'L9 size: exact individual landing');
        assert.ok(!(d.streak > d.size), 'L9 streak: landed star is not a dot');
      }
      explosionSamples++;
    }
    for (const [j, home] of unused.entries()) {
      const d = dots[points.length + j], target = homes[home], start = scene.wave.find(w => w.home === home).start;
      assert.equal(d.home, home, 'L7 homes: field identity'); assert.equal(d.x, target.x, 'L7 homes: field x'); assert.equal(d.y, target.y, 'L7 homes: field y');
      assert.equal(d.size, target.size, 'L7 homes: field size'); assert.deepEqual(d.colour, target.colour, 'L7 homes: field colour');
      const fade = Math.min(1, Math.max(0, (elapsed - start) / 0.2));
      close(d.alpha, elapsed >= maxDuration ? 1 : 1 - (1 - fade) ** 3, 'L9 wave: fade curve');
      assert.ok(!(d.streak > 0), 'L9 streak: stationary field star'); waveSamples++;
    }
  }
  for (let n = 0; n / 240 <= maxDuration; n++) {
    const dots = blastAt(n / 240);
    if (previous) {
      const next = dots.map((d, i) => distance(d, previous[i]) * 240);
      if (speeds) next.forEach((speed, i) => {
        const rise = speed - speeds[i]; maximumRise = Math.max(maximumRise, rise);
        assert.ok(rise <= noise, `L7 explosion speed: rises ${rise} ${where}/${i}/${n}`);
      });
      speeds = next;
    }
    previous = dots;
  }
  // Independently validate the precomputed wave against the actual leading edge,
  // including no earlier passage at any sampled time, not just the stored start.
  const leading = time => Math.max(...blastAt(time).slice(0, points.length).map(d => Math.hypot(d.x - weight[0], d.y - weight[1])));
  const leadingSamples = Array.from({ length: Math.ceil(maxDuration * 240) }, (_, n) => leading(n / 240));
  for (const w of scene.wave) {
    const target = homes[w.home], radius = Math.hypot(target.x - weight[0], target.y - weight[1]);
    if (!Number.isFinite(w.start)) {
      assert.ok(scene.W !== 1440 && radius > leading(maxDuration), 'L9 wave: missing reachable crossing'); continue;
    }
    assert.ok(w.start + 0.2 <= maxDuration, 'L9 wave: cannot finish before landing');
    if (w.start === 0) assert.ok(leading(0) >= radius, 'L9 wave: initial reach');
    else close(leading(w.start), radius, 'L9 wave: leading-edge crossing', 1e-6);
    if (w.start > 1e-5) assert.ok(leading(w.start - 1e-5) < radius, 'L9 wave: starts before passage');
    for (let n = 0; n / 240 < w.start; n++) assert.ok(leadingSamples[n] <= radius + 1e-8, 'L9 wave: missed earlier crossing');
  }
  for (const [i, m] of points.entries()) {
    const a = blastAt(m.duration), b = blastAt(m.duration - h), c = blastAt(m.duration - 2 * h);
    const speed = derivative(a[i], b[i], c[i]);
    assert.ok(speed <= noise, `L7 explosion speed: nonzero arrival ${where}/${i} ${speed}`); arrivalSpeed = Math.max(arrivalSpeed, speed);
  }
  for (const d of draw(base.end + 0.02)) assert.ok(!(d.streak > 0), 'L9 streak: at rest');
  for (const d of P.loaderDots(scene, P.loaderAt(0, {}, { reduced: true }))) {
    assert.equal(d.size, P.STARS.mark.size, 'L9 size: reduced flare'); assert.ok(!(d.streak > 0), 'L9 streak: reduced motion');
  }
  return { viewport: where, paired: points.length, otherHomes: unused.length, sharedHomes: points.length - count,
    minDuration, maxDuration, flightSamples, scaleSamples, explosionSamples, streakSamples, waveSamples,
    longestFlight, longestBlast, depthGrowth, flightArrivalSpeed, scaleStop, maximumRise, arrivalSpeed };
}
