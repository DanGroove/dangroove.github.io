// Seeded rules only. Pools belong to a run; stepping neither grows them nor touches the page.
import { HAMMER } from './data.mjs';

export const hammerRandom = seed => () => { seed |= 0; seed = seed + HAMMER.seed.add | 0; let v = Math.imul(seed ^ seed >>> 15, 1 | seed); v = v + Math.imul(v ^ v >>> 7, 61 | v) ^ v; return ((v ^ v >>> 14) >>> 0) / HAMMER.seed.div; };
const hammerBetween = (s, a, b) => a + (b - a) * s.random();
const hammerInteger = (s, range) => Math.floor(hammerBetween(s, range[0], range[1] + 1));
const hammerClamp = (v, a, b) => Math.max(a, Math.min(b, v));
const hammerCold = s => s.fate === 0 ? HAMMER.fates.cold : 1;
export const hammerSlow = s => hammerCold(s) * (1 - s.levels[6] * HAMMER.rune.ice);
export const hammerPower = s => s.hearts === 1 && s.levels[5] ? 1 + s.levels[5] : 1;
export const hammerFlightSpeed = s => HAMMER.throw.speed * (1 + s.levels[1] * HAMMER.throw.ride) * hammerCold(s);
export const hammerGloveSpeed = (s, pointer = false) => (pointer ? HAMMER.glove.follow : HAMMER.glove.speed) * (1 + s.levels[11] * HAMMER.glove.horse) * hammerCold(s);

export function hammerStart(seed = HAMMER.seed.first) {
  const s = {
    seed, random: typeof seed === 'function' ? seed : hammerRandom(seed), time: 0, wave: 0, phase: 'play', paused: false,
    hearts: HAMMER.hearts, maxHearts: HAMMER.hearts, silver: 0, felled: 0, hurt: 0, losses: 0, waveLosses: 0, reason: '',
    levels: HAMMER.runes.map(() => 0), choices: [-1, -1, -1], fates: Array(HAMMER.fates.count).fill(false), fate: -1, dagazUsed: 0,
    x: HAMMER.glove.x, dir: 1, offset: 0, descent: 0, columns: 0, rows: 0, total: 0, count: 0,
    shotAt: 0, wolfAt: 0, valkAt: 0, throwId: 0, shake: 0, reduced: false, fall: 0, version: 0,
    events: { wave: 0, hurt: 0, rune: 0, gift: 0, clay: 0, heart: 0, end: 0 },
    hammer: { mode: 'held', x: HAMMER.glove.x, y: HAMMER.glove.y, vx: 0, vy: 0, angle: 0, passed: 0 },
    valk: { live: false, x: 0, y: HAMMER.valkyrie.y },
    foes: Array.from({ length: HAMMER.pools.foes }, () => ({ live: false, kind: '', x: 0, y: 0, bx: 0, by: 0, col: 0, row: 0, hp: 0, max: 0, last: -1, burn: 0, spread: 0, freeze: 0, flash: 0, revived: false, raid: 0, target: 0, rx: 0, ry: 0 })),
    shots: Array.from({ length: HAMMER.pools.shots }, () => ({ live: false, x: 0, y: 0, vx: 0, vy: 0, kind: '', split: 0 })),
    hail: Array.from({ length: HAMMER.pools.hail }, () => ({ live: false, x: 0, y: 0, vx: 0, age: 0 })),
    sparks: Array.from({ length: HAMMER.pools.sparks }, () => ({ live: false, x: 0, y: 0, vx: 0, vy: 0, age: 0 })),
    cells: Array.from({ length: HAMMER.pools.cells }, () => ({ live: false, x: 0, y: 0 })),
  };
  hammerWave(s); return s;
}

function hammerFoe(s, kind, x, y, col, row) {
  let f; for (let i = 0; i < s.foes.length; i++) if (!s.foes[i].live) { f = s.foes[i]; break; }
  if (!f) return null;
  const boss = kind === 'hrungnir', clay = kind === 'clay';
  f.live = true; f.kind = kind; f.x = f.bx = x; f.y = f.by = y; f.col = col; f.row = row;
  f.hp = f.max = boss ? HAMMER.boss.hearts : clay ? HAMMER.boss.clay : HAMMER.foes[kind].hearts;
  f.rx = boss ? HAMMER.foe.bossRX : clay ? HAMMER.foe.clayRX : HAMMER.foe.rx;
  f.ry = boss ? HAMMER.foe.bossRY : clay ? HAMMER.foe.clayRY : HAMMER.foe.ry;
  f.last = -1; f.burn = f.spread = f.freeze = f.flash = f.raid = 0; f.revived = false; s.count++; return f;
}

export function hammerWave(s) {
  s.wave++; s.phase = 'play'; s.offset = s.descent = 0; s.dir = s.random() < 0.5 ? -1 : 1; s.count = 0; s.waveLosses = s.losses;
  s.hammer.mode = 'held'; s.hammer.x = s.x; s.hammer.y = HAMMER.glove.y;
  for (let i = 0; i < s.foes.length; i++) s.foes[i].live = false;
  for (let i = 0; i < s.shots.length; i++) s.shots[i].live = false;
  for (let i = 0; i < s.hail.length; i++) s.hail[i].live = false;
  s.fate = -1;
  if (s.wave >= 2 && s.random() < HAMMER.fates.chance) {
    const start = Math.floor(s.random() * HAMMER.fates.count);
    for (let i = 0; i < HAMMER.fates.count; i++) { const f = (start + i) % HAMMER.fates.count; if (!s.fates[f]) { s.fate = f; s.fates[f] = true; break; } }
  }
  const W = HAMMER.shield; let cell = 0;
  for (let wall = 0; wall < W.walls; wall++) for (let row = 0; row < W.rows * W.double; row++) for (let col = 0; col < W.columns; col++) {
    const c = s.cells[cell++]; c.x = W.x + wall * W.gap + (col - (W.columns - 1) / 2) * W.cell + row % 2 * W.stagger;
    c.y = W.y - row * W.cell; c.live = row < W.rows * (s.fate === 3 ? W.double : 1);
  }
  s.clayRisen = false; s.heartShown = false; s.clayDir = 1;
  if (s.wave === HAMMER.waves.length + 1) {
    hammerFoe(s, 'hrungnir', HAMMER.glove.x, HAMMER.boss.y, 0, 0); s.columns = s.rows = 1;
  } else {
    const w = HAMMER.waves[s.wave - 1]; s.columns = hammerInteger(s, w.columns); s.rows = hammerInteger(s, w.rows);
    let weight = 0; for (let k = 0; k < w.weights.length; k++) weight += w.weights[k];
    for (let row = 0; row < s.rows; row++) for (let col = 0; col < s.columns; col++) {
      if (s.random() < w.gaps && row !== s.rows - 1) continue;
      let roll = s.random() * weight, kind = 0; while (roll >= w.weights[kind]) roll -= w.weights[kind++];
      hammerFoe(s, HAMMER.kinds[kind], HAMMER.field.w / 2 + (col - (s.columns - 1) / 2) * HAMMER.march.column, HAMMER.field.top + row * HAMMER.march.row, col, row);
    }
    const elites = hammerInteger(s, w.elites);
    for (let i = 0; i < elites; i++) { const f = s.foes[i]; f.kind = 'chief'; f.hp = f.max = HAMMER.foes.chief.hearts; }
  }
  s.total = s.count; s.shotAt = 0; s.wolfAt = hammerBetween(s, ...HAMMER.wolf.every); s.valkAt = hammerBetween(s, ...HAMMER.valkyrie.every); s.valk.live = false;
  s.events.wave++; s.version++;
}

export function hammerPick(s, choice) {
  if (s.phase !== 'runes' || choice < 0 || choice >= s.choices.length) return false;
  const rune = s.choices[choice]; if (rune < 0 || s.levels[rune] >= HAMMER.runes[rune].max) return false;
  s.levels[rune]++;
  if (rune === 3) { s.maxHearts = Math.min(HAMMER.most, s.maxHearts + 1); s.hearts = Math.min(s.maxHearts, s.hearts + 1); }
  s.taken = rune; s.events.rune++; hammerWave(s); return true;
}

function hammerEnd(s, reason) { s.phase = 'end'; s.reason = reason; s.fall = 0; s.events.end++; s.version++; }
export function hammerHurt(s) {
  if (s.hurt > 0 || s.phase !== 'play') return;
  s.hearts--; s.losses++; s.events.hurt++; s.version++; s.hurt = HAMMER.hurt;
  if (s.hearts <= 0) {
    if (s.dagazUsed < s.levels[10]) { s.dagazUsed++; s.hearts = 1; for (let i = 0; i < s.shots.length; i++) s.shots[i].live = false; }
    else hammerEnd(s, 'hearts');
  }
}

function hammerSpark(s, x, y) {
  if (s.reduced) return;
  s.shake = HAMMER.fx.life;
  let made = 0;
  for (let i = 0; i < s.sparks.length && made < HAMMER.fx.sparks; i++) {
    const p = s.sparks[i]; if (p.live) continue;
    p.live = true; p.x = x; p.y = y; p.age = 0; const a = s.random() * Math.PI * 2;
    p.vx = Math.cos(a) * HAMMER.fx.speed; p.vy = Math.sin(a) * HAMMER.fx.speed; made++;
  }
}

export function hammerDamage(s, f, power, ignite = false) {
  if (!f.live) return;
  f.hp -= power; f.flash = s.reduced ? 0 : HAMMER.fx.flash; hammerSpark(s, f.x, f.y);
  if (f.hp > 0) {
    if (ignite && s.levels[2] && !f.burn) { f.burn = HAMMER.rune.burn; f.spread = s.levels[2]; }
    return;
  }
  if (s.fate === 4 && f.kind === 'draugr' && !f.revived) { f.hp = 1; f.revived = true; f.freeze = HAMMER.rune.burn; return; }
  f.live = false; s.count--; s.felled++; s.silver += f.kind === 'hrungnir' ? HAMMER.boss.silver : f.kind === 'clay' ? 0 : HAMMER.foes[f.kind].silver; s.version++;
  if (f.kind === 'chief') for (let i = 0; i < s.foes.length; i++) { const n = s.foes[i]; if (n.live && n.row === f.row && Math.abs(n.col - f.col) === 1) n.freeze = HAMMER.march.chiefStop; }
  if (f.kind === 'hrungnir') { s.hearts = Math.min(s.maxHearts, s.hearts + s.levels[7]); s.silver += HAMMER.waveBonus * s.wave + (s.losses === s.waveLosses ? HAMMER.perfect * s.wave : 0); hammerEnd(s, 'won'); }
}

function hammerShotLoad(s) {
  let count = 0;
  for (let i = 0; i < s.shots.length; i++) { const p = s.shots[i]; if (p.live) count += p.kind === 'fire' ? 2 ** ((s.fate === 1 ? 2 : 1) - p.split) : 1; }
  return count;
}
function hammerShot(s, x, y, vx, vy, kind, split = 0) {
  // Reserve a fire shot's descendants, so the cap never clips a promised split.
  const cost = kind === 'fire' ? 2 ** ((s.fate === 1 ? 2 : 1) - split) : 1;
  if (hammerShotLoad(s) + cost > (s.wave <= HAMMER.waves.length ? HAMMER.waves[s.wave - 1].cap : HAMMER.pools.shots)) return;
  for (let i = 0; i < s.shots.length; i++) { const p = s.shots[i]; if (p.live) continue; p.live = true; p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.kind = kind; p.split = split; return; }
}
function hammerTurn(s) {
  const h = s.hammer; if (h.mode !== 'out') return;
  h.mode = 'back'; h.vx = 0; h.vy = HAMMER.throw.back * (1 + s.levels[1] * HAMMER.throw.ride) * hammerCold(s);
  const n = s.levels[4] * HAMMER.rune.hail; let made = 0;
  for (let i = 0; i < s.hail.length && made < n; i++) { const p = s.hail[i]; if (p.live) continue; p.live = true; p.age = 0; p.x = h.x; p.y = h.y; p.vx = (made % 2 ? 1 : -1) * HAMMER.rune.hailSpeed * (1 + Math.floor(made / 2) / HAMMER.rune.hail); made++; }
}
function hammerHeld(s) {
  s.silver += HAMMER.waveBonus * s.wave + (s.losses === s.waveLosses ? HAMMER.perfect * s.wave : 0);
  s.hearts = Math.min(s.maxHearts, s.hearts + s.levels[7]); s.phase = 'runes';
  for (let c = 0; c < s.choices.length; c++) {
    let available = 0;
    for (let r = 0; r < HAMMER.runes.length; r++) { let used = false; for (let k = 0; k < c; k++) if (s.choices[k] === r) used = true; if (s.levels[r] < HAMMER.runes[r].max && !used) available++; }
    let roll = Math.floor(s.random() * available); s.choices[c] = -1;
    for (let r = 0; r < HAMMER.runes.length; r++) {
      let used = false; for (let k = 0; k < c; k++) if (s.choices[k] === r) used = true;
      if (!used && s.levels[r] < HAMMER.runes[r].max && roll-- === 0) { s.choices[c] = r; break; }
    }
  }
  s.version++;
}

export function hammerStep(s, input, dt) {
  if (s.paused || s.phase === 'runes') return;
  if (s.phase === 'end') { if (s.reason === 'won') s.fall = Math.min(HAMMER.boss.fall, s.fall + dt); return; }
  s.time += dt; if (s.time >= HAMMER.limit) { hammerEnd(s, 'bridge'); return; }
  s.hurt = Math.max(0, s.hurt - dt); s.shake = Math.max(0, s.shake - dt);
  const slow = hammerSlow(s), h = s.hammer;
  const target = Number.isFinite(input.target) ? input.target : s.x + (input.move || 0) * hammerGloveSpeed(s) * dt;
  const step = hammerGloveSpeed(s, Number.isFinite(input.target)) * dt;
  s.x = hammerClamp(s.x + hammerClamp(target - s.x, -step, step), HAMMER.glove.min, HAMMER.glove.max);
  if (h.mode === 'held') {
    h.x = s.x; h.y = HAMMER.glove.y;
    if (input.throw) { s.throwId++; h.mode = 'out'; h.vx = 0; h.vy = -hammerFlightSpeed(s); h.passed = 0; }
  }
  if (s.wave <= HAMMER.waves.length) {
    const w = HAMMER.waves[s.wave - 1]; let left = Infinity, right = -Infinity;
    for (let i = 0; i < s.foes.length; i++) { const f = s.foes[i]; if (f.live && !f.raid) { left = Math.min(left, f.x - f.rx); right = Math.max(right, f.x + f.rx); } }
    const dx = s.dir * w.speed * (1 + HAMMER.march.boost * (1 - s.count / s.total)) * slow * dt;
    if (left + dx <= HAMMER.field.margin || right + dx >= HAMMER.field.w - HAMMER.field.margin) { s.dir *= -1; s.descent += HAMMER.march.down; }
    else s.offset += dx;
  }
  for (let i = 0; i < s.foes.length; i++) {
    const f = s.foes[i]; if (!f.live) continue;
    f.flash = Math.max(0, f.flash - dt);
    if (f.burn > 0) {
      f.burn -= dt;
      if (f.burn <= 0) {
        f.burn = 0;
        if (f.spread > 0) { let near = null, distance = HAMMER.rune.spread;
          for (let j = 0; j < s.foes.length; j++) { const n = s.foes[j], d = Math.hypot(n.x - f.x, n.y - f.y); if (n !== f && n.live && !n.burn && d < distance) { near = n; distance = d; } }
          if (near) { near.burn = HAMMER.rune.burn; near.spread = f.spread - 1; }
        }
        hammerDamage(s, f, 1); if (!f.live) continue;
      }
    }
    if (f.freeze > 0) { f.freeze = Math.max(0, f.freeze - dt * slow); continue; }
    if (f.kind === 'hrungnir') {
      f.x += s.dir * HAMMER.boss.speed * slow * dt;
      if (f.x < HAMMER.boss.x[0] || f.x > HAMMER.boss.x[1]) s.dir *= -1;
      if (!s.clayRisen && f.hp <= f.max * HAMMER.boss.clayAt) { s.clayRisen = true; hammerFoe(s, 'clay', HAMMER.glove.x, HAMMER.boss.clayY, 0, 0); s.events.clay++; s.version++; }
      if (!s.heartShown && f.hp <= f.max * HAMMER.boss.heartAt) { s.heartShown = true; s.events.heart++; s.version++; }
    } else if (f.kind === 'clay') {
      f.x += s.clayDir * HAMMER.boss.claySpeed * slow * dt;
      if (f.x < HAMMER.boss.clayX[0] || f.x > HAMMER.boss.clayX[1]) s.clayDir *= -1;
    } else if (f.raid > 0) {
      f.raid += dt * slow; const q = Math.min(1, f.raid / HAMMER.wolf.time), k = Math.sin(Math.PI * q);
      f.x = (f.bx + s.offset) * (1 - k) + f.target * k + Math.sin(Math.PI * 2 * q) * HAMMER.wolf.curve;
      f.y = (f.by + s.descent) * (1 - k) + HAMMER.glove.y * k;
      if (Math.abs(f.x - s.x) < f.rx + HAMMER.glove.radius && Math.abs(f.y - HAMMER.glove.y) < f.ry + HAMMER.glove.radius) hammerHurt(s);
      if (s.phase === 'end') return;
      if (q === 1) f.raid = 0;
    } else { f.x = f.bx + s.offset; f.y = f.by + s.descent; }
    if (!f.raid && f.y + f.ry >= HAMMER.field.bridge) { hammerEnd(s, 'bridge'); return; }
    if (f.y + f.ry >= HAMMER.shield.y - HAMMER.shield.rows * HAMMER.shield.cell) for (let j = 0; j < s.cells.length; j++) { const c = s.cells[j]; if (c.live && Math.abs(c.x - f.x) < f.rx && Math.abs(c.y - f.y) < f.ry) c.live = false; }
  }
  s.wolfAt -= dt * slow;
  if (s.wave >= 3 && s.wave <= HAMMER.waves.length && s.wolfAt <= 0) {
    let pack = s.fate === 2 ? HAMMER.wolf.pack : 1;
    for (let i = 0; i < s.foes.length && pack; i++) { const f = s.foes[i]; if (!f.live || f.kind !== 'wolf' || f.raid) continue;
      let front = true; for (let j = 0; j < s.foes.length; j++) { const n = s.foes[j]; if (n.live && n.col === f.col && n.y > f.y) front = false; }
      if (front) { f.raid = dt; f.target = s.x; pack--; }
    }
    s.wolfAt = hammerBetween(s, ...HAMMER.wolf.every);
  }
  s.shotAt -= dt * slow;
  if (s.shotAt <= 0) {
    const live = hammerShotLoad(s);
    if (s.wave <= HAMMER.waves.length) {
      const w = HAMMER.waves[s.wave - 1], col = Math.floor(s.random() * s.columns); let f = null;
      for (let i = 0; i < s.foes.length; i++) { const n = s.foes[i]; if (n.live && !n.raid && n.col === col && (!f || n.y > f.y)) f = n; }
      if (f && live + (f.kind === 'chief' ? 3 : 1) <= w.cap) {
        const speed = HAMMER.foes[f.kind].speed;
        if (f.kind === 'chief') for (let j = -1; j <= 1; j++) hammerShot(s, f.x, f.y + f.ry, Math.sin(j * HAMMER.shot.fan) * speed, Math.cos(j * HAMMER.shot.fan) * speed, 'rime');
        else hammerShot(s, f.x, f.y + f.ry, 0, speed, f.kind);
      }
      s.shotAt = w.rate;
    } else {
      const f = s.foes[0]; let clay = false; for (let i = 1; i < s.foes.length; i++) if (s.foes[i].live && s.foes[i].kind === 'clay') clay = true;
      const aim = Math.atan2(s.x - f.x, HAMMER.glove.y - f.y);
      for (let j = 0; j < HAMMER.boss.fans; j++) { const a = aim + (j - (HAMMER.boss.fans - 1) / 2) * HAMMER.boss.aimSpread; hammerShot(s, f.x, f.y + f.ry, Math.sin(a) * HAMMER.boss.shardSpeed, Math.cos(a) * HAMMER.boss.shardSpeed, 'rime'); }
      s.shotAt = HAMMER.boss.fan * (clay ? HAMMER.boss.faster : 1);
    }
  }
  for (let i = 0; i < s.shots.length; i++) {
    const p = s.shots[i]; if (!p.live) continue; p.x += p.vx * dt * slow; p.y += p.vy * dt * slow;
    if (p.kind === 'fire' && p.split < (s.fate === 1 ? 2 : 1) && p.y >= (p.split ? HAMMER.shot.splitAgain : HAMMER.shot.splitY)) {
      const stage = p.split + 1, speed = HAMMER.foes.fire.speed; p.live = false;
      hammerShot(s, p.x, p.y, -Math.sin(HAMMER.shot.angle * stage) * speed, speed, 'fire', stage);
      hammerShot(s, p.x, p.y, Math.sin(HAMMER.shot.angle * stage) * speed, speed, 'fire', stage); continue;
    }
    if (p.y > HAMMER.shot.dead || p.x < 0 || p.x > HAMMER.field.w) { p.live = false; continue; }
    if (p.y >= HAMMER.shield.y - HAMMER.shield.rows * HAMMER.shield.double * HAMMER.shield.cell - HAMMER.shield.radius && p.y <= HAMMER.shield.y + HAMMER.shield.radius) {
      for (let j = 0; j < s.cells.length; j++) { const c = s.cells[j]; if (c.live && Math.abs(c.x - p.x) < HAMMER.shield.radius && Math.abs(c.y - p.y) < HAMMER.shield.radius) { c.live = p.live = false; break; } }
    }
    if (p.live && Math.abs(p.x - s.x) < HAMMER.glove.radius + HAMMER.shot.radius && Math.abs(p.y - HAMMER.glove.y) < HAMMER.glove.radius + HAMMER.shot.radius) { p.live = false; hammerHurt(s); }
    if (s.phase === 'end') return;
  }
  if (h.mode !== 'held') {
    const oldX = h.x, oldY = h.y, speed = hammerFlightSpeed(s);
    if (h.mode === 'out' && s.levels[9]) {
      let f = null, distance = Infinity;
      for (let i = 0; i < s.foes.length; i++) { const n = s.foes[i], d = Math.hypot(n.x - h.x, n.y - h.y); if (n.live && n.last !== s.throwId && n.y < h.y && d < distance) { f = n; distance = d; } }
      if (f) h.vx += (hammerClamp((f.x - h.x) * HAMMER.throw.bend * s.levels[9], -speed, speed) - h.vx) * Math.min(1, HAMMER.throw.turn * dt);
      h.vy = -Math.sqrt(Math.max(0, speed * speed - h.vx * h.vx));
    }
    if (h.mode === 'back') {
      const dx = s.x - h.x, dy = HAMMER.glove.y - h.y, distance = Math.hypot(dx, dy), back = HAMMER.throw.back * (1 + s.levels[1] * HAMMER.throw.ride) * hammerCold(s);
      if (distance <= Math.max(HAMMER.throw.catch, back * dt)) h.mode = 'held';
      else { const turn = Math.min(1, HAMMER.throw.turn * dt); h.vx += (dx / distance * back - h.vx) * turn; h.vy += (dy / distance * back - h.vy) * turn; }
    }
    if (h.mode !== 'held') {
      h.x = hammerClamp(h.x + h.vx * dt, 0, HAMMER.field.w); h.y += h.vy * dt; h.angle += HAMMER.throw.spin * dt * hammerCold(s);
      // Order candidate intersections by distance along this short swept segment.
      let searching = true;
      while (searching && h.mode !== 'held') {
        let hit = null, nearest = Infinity;
        for (let i = 0; i < s.foes.length; i++) { const f = s.foes[i]; if (!f.live || f.last === s.throwId) continue;
          if (Math.abs(f.x - h.x) <= f.rx + HAMMER.throw.radius && f.y + f.ry + HAMMER.throw.radius >= Math.min(oldY, h.y) && f.y - f.ry - HAMMER.throw.radius <= Math.max(oldY, h.y)) { const d = Math.hypot(f.x - oldX, f.y - oldY); if (d < nearest) { nearest = d; hit = f; } }
        }
        if (!hit) searching = false;
        else {
          hit.last = s.throwId;
          let power = hammerPower(s) * (1 + (h.mode === 'back' ? s.levels[8] : 0));
          if (hit.kind === 'hrungnir' && s.heartShown && Math.abs(h.x - hit.x) <= HAMMER.boss.heartRX && Math.abs(h.y - hit.y - HAMMER.boss.heartY) <= HAMMER.boss.heartRY + HAMMER.throw.radius) power *= HAMMER.boss.exposed;
          hammerDamage(s, hit, power, true);
          if (h.mode === 'out' && ++h.passed >= HAMMER.throw.pierce + s.levels[0]) { hammerTurn(s); searching = false; }
        }
      }
      if (h.mode === 'out' && h.y <= 0) hammerTurn(s);
      if (s.valk.live && Math.abs(h.x - s.valk.x) <= HAMMER.valkyrie.rx && Math.abs(h.y - s.valk.y) <= HAMMER.valkyrie.ry) { s.valk.live = false; s.hearts = Math.min(s.maxHearts, s.hearts + 1); s.silver += HAMMER.valkyrie.silver; s.events.gift++; s.version++; if (h.mode === 'out') hammerTurn(s); }
    }
  }
  for (let i = 0; i < s.hail.length; i++) { const p = s.hail[i]; if (!p.live) continue; p.age += dt; p.x += p.vx * dt * hammerCold(s); p.y -= HAMMER.rune.hailRise * dt * hammerCold(s);
    if (p.age >= HAMMER.rune.hailLife || p.x < 0 || p.x > HAMMER.field.w) { p.live = false; continue; }
    for (let j = 0; j < s.foes.length; j++) { const f = s.foes[j]; if (f.live && Math.abs(f.x - p.x) < f.rx && Math.abs(f.y - p.y) < f.ry) { hammerDamage(s, f, 1); p.live = false; break; } }
  }
  s.valkAt -= dt;
  if (s.valkAt <= 0) { s.valk.live = true; s.valk.x = -HAMMER.valkyrie.rx; s.valkAt = hammerBetween(s, ...HAMMER.valkyrie.every); }
  if (s.valk.live) { s.valk.x += HAMMER.valkyrie.speed * slow * dt; if (s.valk.x > HAMMER.field.w + HAMMER.valkyrie.rx) s.valk.live = false; }
  for (let i = 0; i < s.sparks.length; i++) { const p = s.sparks[i]; if (!p.live) continue; p.age += dt; if (p.age >= HAMMER.fx.life) p.live = false; else { p.x += p.vx * dt; p.y += p.vy * dt; } }
  if (s.count === 0 && s.phase === 'play') hammerHeld(s);
}
