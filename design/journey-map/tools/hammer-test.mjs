// Node-only rules, reproducibility, pool and balance checks. Default/--full: 200 per bot; --quick: 60.
import { strict as assert } from 'node:assert';
import { performance } from 'node:perf_hooks';
import { HAMMER } from '../data.mjs';
import { hammerStart, hammerStep, hammerWave, hammerPick, hammerRandom, hammerDamage, hammerHurt, hammerSlow, hammerPower, hammerFlightSpeed, hammerGloveSpeed } from '../hammer.mjs';

const H = HAMMER, input = { target: NaN, move: 0, throw: false };
const drawnBounds={};
// Every endpoint/control point of these M/L/H/V/Q silhouettes is inside the unchanged hit box, including stroke.
for(const kind of [...H.kinds,'hrungnir','clay']) {
  const path=H.paths.sprites[kind][2],tok=path.match(/[a-zA-Z]|[-+]?(?:\d*\.)?\d+/g);let i=0,cmd='',p=[0,0];const points=[];
  while(i<tok.length){if(/[a-zA-Z]/.test(tok[i]))cmd=tok[i++];if(cmd==='Z')continue;
    if(cmd==='H')p=[Number(tok[i++]),p[1]];else if(cmd==='V')p=[p[0],Number(tok[i++])];else{const q=[Number(tok[i++]),Number(tok[i++])];if(cmd==='Q'){points.push(q);p=[Number(tok[i++]),Number(tok[i++])];}else p=q;}points.push(p);if(cmd==='M')cmd='L';
  }
  const rx=kind==='hrungnir'?H.foe.bossRX:kind==='clay'?H.foe.clayRX:H.foe.rx,ry=kind==='hrungnir'?H.foe.bossRY:kind==='clay'?H.foe.clayRY:H.foe.ry;
  points.forEach(p=>assert.ok(Math.abs(p[0])+H.field.line/2<=rx&&Math.abs(p[1])+H.field.line/2<=ry,kind+' art outside hit box '+p));
  drawnBounds[kind]=[Math.min(...points.map(p=>p[0]))-H.field.line/2,Math.min(...points.map(p=>p[1]))-H.field.line/2,Math.max(...points.map(p=>p[0]))+H.field.line/2,Math.max(...points.map(p=>p[1]))+H.field.line/2];
}
const drawnHeight=kind=>drawnBounds[kind][3]-drawnBounds[kind][1];
for(const kind of ['rime','fire','chief'])nearHeight(drawnHeight(kind),H.foe.ry*2);
nearHeight(drawnHeight('draugr'),11);nearHeight(drawnHeight('wolf'),8);nearHeight(drawnBounds.wolf[2]-drawnBounds.wolf[0],H.foe.rx*2);
function nearHeight(a,b){assert.ok(Math.abs(a-b)<.002,'drawn dimension '+a+'/'+b);}
const firstKinds=[...new Set(hammerStart(H.seed.first).foes.filter(f=>f.live).map(f=>drawnHeight(f.kind)))];assert.ok(firstKinds.length>=2,'default wave 1 has distinct drawn heights');
const centres=H.paths.wall.centres,shieldRadius=7.5,wallHalf=H.shield.columns*H.shield.cell/2;
assert.ok(centres[0]-shieldRadius<=-wallHalf&&centres.at(-1)+shieldRadius>=wallHalf,'shields span segment cells');
centres.slice(1).forEach((x,i)=>assert.ok(x-centres[i]<shieldRadius*2,'adjacent rims overlap'));
console.log('ok: D3 foe heights incl stroke: giants/chief 16, hunched draugr 11, low full-width wolf 8; wave 1 varies; five overlapping shields span each unchanged segment');
console.log('ok: original Norse foe silhouettes and their strokes fit unchanged hit boxes');
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-7, `${a} != ${b}`);
const step = (s, seconds = H.step, control = input) => { for (let t = 0; t < seconds - H.step / 2; t += H.step) hammerStep(s, control, H.step); };
function fixture() {
  const s = hammerStart(H.seed.first); s.fate = -1; s.shotAt = H.limit; s.wolfAt = H.limit; s.valkAt = H.limit;
  for (const f of s.foes) f.live = false;
  const f = s.foes[0]; Object.assign(f, { live: true, kind: 'rime', x: 150, bx: 150, y: 140, by: 140, rx: H.foe.rx, ry: H.foe.ry, hp: 100, max: 100, burn: 0, spread: 0, freeze: H.limit, flash: 0, raid: 0, last: -1 });
  s.count = s.total = 1; s.dir = 1; return s;
}
function throwAt(s, mode = 'out', y = 145) {
  s.throwId++; Object.assign(s.hammer, { mode, x: s.foes[0].x, y, vx: 0, vy: mode === 'out' ? -H.throw.speed : H.throw.back, passed: 0 });
  hammerStep(s, input, H.step);
}
const digest = s => JSON.stringify(s, (k, v) => typeof v === 'function' ? undefined : v);
const a = hammerStart(42), b = hammerStart(42), seq = hammerRandom(173);
for (let i = 0; i < H.tests.determinism; i++) {
  const u = { target: 16 + seq() * 268, move: 0, throw: true };
  if (a.phase === 'runes') { const n = Math.floor(seq() * 3); hammerPick(a, n); hammerPick(b, n); }
  hammerStep(a, u, H.step); hammerStep(b, u, H.step); assert.equal(digest(a), digest(b), `deterministic step ${i}`);
}
console.log('ok: identical seeds and inputs match step for step');
let patterns = new Set();
for (let seed = 0; seed < 50; seed++) {
  const s = hammerStart(seed), seenFates = new Set();
  for (let wave = 1; wave <= 7; wave++) {
    if (wave > 1) hammerWave(s);
    if (s.fate >= 0) { assert.ok(!seenFates.has(s.fate)); seenFates.add(s.fate); }
    if (wave === 7) { assert.equal(s.foes[0].kind, 'hrungnir'); continue; }
    const w = H.waves[wave - 1], foes = s.foes.filter(f => f.live), chiefs = foes.filter(f => f.kind === 'chief').length;
    assert.ok(s.columns >= w.columns[0] && s.columns <= w.columns[1]); assert.ok(s.rows >= w.rows[0] && s.rows <= w.rows[1]);
    assert.ok(chiefs >= w.elites[0] && chiefs <= w.elites[1]);
    for (const f of foes) {
      assert.ok(f.x - f.rx >= H.field.margin && f.x + f.rx <= H.field.w - H.field.margin);
      assert.ok(f.y - f.ry >= 0 && f.y + f.ry < H.shield.y);
      assert.ok(f.col < s.columns && f.row < s.rows);
      assert.ok(f.kind === 'chief' || w.weights[H.kinds.indexOf(f.kind)] > 0);
      assert.equal(f.hp, H.foes[f.kind].hearts);
    }
    patterns.add(foes.map(f => `${f.col},${f.row}:${f.kind}`).join('|'));
  }
}
assert.ok(patterns.size > 200);
const boss = hammerStart(23); while (boss.wave < 7) hammerWave(boss);
boss.fate = -1; boss.shotAt = H.limit; const giant = boss.foes[0]; giant.hp = giant.max * H.boss.clayAt + 1; step(boss); assert.equal(boss.clayRisen, false);
hammerDamage(boss, giant, 1); step(boss); assert.equal(boss.clayRisen, true); assert.equal(boss.foes.find(f => f.live && f.kind === 'clay').hp, H.boss.clay);
giant.hp = giant.max * H.boss.heartAt + 1; step(boss); assert.equal(boss.heartShown, false); hammerDamage(boss, giant, 1); step(boss); assert.equal(boss.heartShown, true);
const stoneHP = giant.hp; boss.throwId++; Object.assign(boss.hammer, { mode: 'out', x: giant.x, y: giant.y + H.foe.bossRY, vx: 0, vy: -H.throw.speed, passed: 0 }); step(boss); assert.equal(giant.hp, stoneHP - H.boss.exposed);
console.log('ok: 350 seeded formations/bosses fit their wave rows; unique fates; clay at 60%, heart at 30%');

assert.equal(H.runes.map(r => r.key).join(), 'th,r,k,g,h,n,i,j,ei,l,d,e');
assert.ok(H.runes.every(r => !['z', 's', 't', 'o'].includes(r.key)));
let runeChecks = 0;
for (let r = 0; r < H.runes.length; r++) for (let level = 1; level <= H.runes[r].max; level++) {
  const s = fixture(); s.levels[r] = level; const f = s.foes[0];
  if (r === 0) { for (let n = 0; n <= level; n++) { f.last = -1; throwAt(s); s.hammer.passed = n; s.hammer.mode = 'out'; f.last = -1; step(s); assert.equal(s.hammer.mode, n + 1 >= H.throw.pierce + level ? 'back' : 'out'); } }
  if (r === 1) { near(hammerFlightSpeed(s), H.throw.speed * (1 + level * 0.2)); Object.assign(s.hammer, { mode: 'back', x: s.x, y: 300, vx: 0, vy: H.throw.back * (1 + level * 0.2) }); step(s); near(s.hammer.vy, H.throw.back * (1 + level * 0.2)); }
  if (r === 2) { const n = s.foes[1]; Object.assign(n, f, { bx: f.bx + 24, x: f.x + 24, live: true }); s.count = s.total = 2; hammerDamage(s, f, 1, true); const hp = f.hp; step(s, H.rune.burn + H.step); assert.equal(f.hp, hp - 1); assert.ok(n.burn > 0); assert.equal(n.spread, level - 1); }
  if (r === 3) { s.levels[r]--; s.phase = 'runes'; s.choices[0] = r; s.maxHearts = H.hearts + level - 1; s.hearts = 1; hammerPick(s, 0); assert.equal(s.maxHearts, H.hearts + level); assert.equal(s.hearts, 2); }
  if (r === 4) { Object.assign(s.hammer, { mode: 'out', x: 150, y: 0, vy: -H.throw.speed }); step(s); assert.equal(s.hail.filter(p => p.live).length, level * H.rune.hail); }
  if (r === 5) { s.hearts = 1; assert.equal(hammerPower(s), level + 1); throwAt(s); assert.equal(f.hp, 100 - level - 1); }
  if (r === 6) { near(hammerSlow(s), 1 - level * H.rune.ice); const p = s.shots[0]; Object.assign(p, { live: true, x: 10, y: 10, vx: 0, vy: 100, kind: 'draugr' }); step(s); near(p.y, 10 + 100 * H.step * (1 - level * H.rune.ice)); }
  if (r === 7) { s.hearts = 1; s.count = 0; f.live = false; step(s); assert.equal(s.hearts, Math.min(s.maxHearts, 1 + level)); }
  if (r === 8) { throwAt(s, 'back', 135); assert.equal(f.hp, 99 - level); }
  if (r === 9) { Object.assign(s.hammer, { mode: 'out', x: 100, y: 200, vx: 0, vy: -H.throw.speed }); step(s); assert.ok(s.hammer.vx > 0); const expected = 50 * H.throw.bend * level * H.throw.turn * H.step; near(s.hammer.vx, expected); }
  if (r === 10) { for (let n = 0; n < level; n++) { s.hearts = 1; s.hurt = 0; s.shots[0].live = true; hammerHurt(s); assert.equal(s.hearts, 1); assert.ok(s.shots.every(p => !p.live)); assert.equal(s.phase, 'play'); } s.hurt = 0; hammerHurt(s); assert.equal(s.phase, 'end'); }
  if (r === 11) { near(hammerGloveSpeed(s), H.glove.speed * (1 + level * 0.2)); const x = s.x; step(s, H.step, { target: NaN, move: 1, throw: false }); near(s.x - x, H.glove.speed * (1 + level * 0.2) * H.step); }
  runeChecks++;
}
console.log(`ok: ${runeChecks} per-level rune effect checks; excluded runes absent`);

const cold = fixture(); cold.fate = 0; near(hammerFlightSpeed(cold), H.throw.speed * H.fates.cold); near(hammerGloveSpeed(cold), H.glove.speed * H.fates.cold); near(hammerSlow(cold), H.fates.cold);
const heat = fixture(); heat.fate = 1; Object.assign(heat.shots[0], { live: true, x: 150, y: H.shot.splitY, vx: 0, vy: 100, kind: 'fire', split: 0 }); step(heat); assert.equal(heat.shots.filter(p => p.live).length, 2); heat.shots.forEach(p => { if (p.live) p.y = H.shot.splitAgain; }); step(heat); assert.equal(heat.shots.filter(p => p.live).length, 4);
const hel = fixture(); hel.fate = 4; hel.foes[0].kind = 'draugr'; hel.foes[0].hp = 1; hammerDamage(hel, hel.foes[0], 1); assert.equal(hel.foes[0].hp, 1); assert.equal(hel.foes[0].revived, true); hammerDamage(hel, hel.foes[0], 1); assert.equal(hel.foes[0].live, false);
const combined = fixture(); combined.hearts = 1; combined.levels[5] = 2; combined.levels[8] = 2; throwAt(combined, 'back', 135); assert.equal(combined.foes[0].hp, 91);
console.log('ok: cold includes both flights and glove; heat splits twice; draugr rises once; need multiplies the return upgrade; exposed stone heart doubles a hit');

// One hit per foe per throw, a miss returns, shields absorb shots, and Dagaz cannot stop a bridge breach.
const hit = fixture(); throwAt(hit); assert.equal(hit.foes[0].hp, 99); Object.assign(hit.hammer, { mode: 'back', x: hit.foes[0].x, y: 135, vy: H.throw.back }); step(hit); assert.equal(hit.foes[0].hp, 99);
const missed = fixture(); missed.foes[0].x = missed.foes[0].bx = 250; step(missed, 3, { target: 100, move: 0, throw: true }); assert.ok(missed.throwId >= 2);
const wall = fixture(), cell = wall.cells.find(c => c.live); Object.assign(wall.shots[0], { live: true, x: cell.x, y: cell.y - 1, vx: 0, vy: 100, kind: 'rime' }); step(wall); assert.equal(wall.shots[0].live, false); assert.equal(cell.live, false);
const breach = fixture(); breach.levels[10] = 3; breach.foes[0].freeze = 0; breach.foes[0].by = H.field.bridge; step(breach); assert.equal(breach.reason, 'bridge');
const pools = fixture(), sizes = ['foes', 'shots', 'hail', 'sparks', 'cells'].map(k => pools[k].length), identities = ['foes', 'shots', 'hail', 'sparks', 'cells'].map(k => pools[k].slice());
for (let i = 0; i < H.tests.poolSteps; i++) hammerStep(pools, input, H.step);
['foes', 'shots', 'hail', 'sparks', 'cells'].forEach((k, i) => { assert.equal(pools[k].length, sizes[i]); pools[k].forEach((p, j) => assert.equal(p, identities[i][j])); });
console.log('ok: return/catch, first-hit memory, shields, bridge loss; pool sizes and identities unchanged after 10,000 steps');

function steer(s, control) {
  let lowest = null; for (const f of s.foes) if (f.live && !f.raid && (!lowest || f.y > lowest.y)) lowest = f;
  let target = lowest ? lowest.x : s.x, danger = null, soon = Infinity; const slow = hammerSlow(s);
  for (const p of s.shots) {
    if (!p.live || p.vy <= 0) continue;
    const time = (H.glove.y - p.y) / (p.vy * slow), x = p.x + p.vx * slow * time;
    if (time >= 0 && time <= H.tests.dodge && (Math.abs(x - s.x) < H.tests.threat || Math.abs(x - target) < H.tests.threat) && time < soon) { danger = x; soon = time; }
  }
  if (danger !== null) {
    target = Math.max(H.glove.min, Math.min(H.glove.max, danger + (s.x <= danger ? -H.tests.dodgeX : H.tests.dodgeX)));
  }
  control.target = target;
}
function bots(mode, count) {
  let reach = 0, won = 0, early = 0, longest = 0, steps = 0, ms = 0; const ends = {};
  const start = performance.now();
  for (let run = 0; run < count; run++) {
    const s = hammerStart(H.tests.seeds + run), choiceRandom = hammerRandom(H.tests.seeds + run), control = { target: NaN, move: 0, throw: true }; let i = 0;
    while (s.phase !== 'end' && s.time < H.limit) {
      if (s.phase === 'runes') hammerPick(s, Math.floor(choiceRandom() * s.choices.length));
      if (mode === 'steady' && i % H.tests.think === 0) steer(s, control);
      hammerStep(s, control, H.tests.botStep); i++; steps++;
      assert.ok(s.shots.reduce((n, p) => n + Number(p.live), 0) <= (s.wave <= H.waves.length ? H.waves[s.wave - 1].cap : H.pools.shots), 'falling shot cap');
      if (i % H.tests.poolSteps === 0) { assert.ok(Number.isFinite(s.x + s.time + s.hammer.x + s.hammer.y + s.hearts + s.silver)); for (const p of s.shots) if (p.live) assert.ok(Number.isFinite(p.x + p.y)); for (const f of s.foes) if (f.live) assert.ok(Number.isFinite(f.x + f.y + f.hp)); }
    }
    assert.equal(s.phase, 'end', `${mode} seed ${s.seed} did not finish`); assert.ok(s.time <= H.limit + H.step);
    assert.ok(Number.isFinite(s.x + s.time + s.hammer.x + s.hammer.y + s.hammer.vx + s.hammer.vy + s.hearts + s.silver));
    for (const p of [...s.foes, ...s.shots, ...s.hail, ...s.sparks, ...s.cells]) assert.ok(Number.isFinite(p.x + p.y));
    if (s.wave >= 4) reach++; if (s.reason === 'won') won++; if (s.wave <= 3) early++; longest = Math.max(longest, s.time); const end = `${s.wave}:${s.reason}`; ends[end] = (ends[end] || 0) + 1;
  }
  ms = performance.now() - start;
  console.log(`${mode}: ${count} seeds; wave 4 ${(100 * reach / count).toFixed(1)}%; wins ${(100 * won / count).toFixed(1)}%; ended by wave 3 ${(100 * early / count).toFixed(1)}%; longest ${longest.toFixed(1)}s; ${(ms / steps).toFixed(5)} ms/step; ${(ms / 1000).toFixed(1)}s wall`);
  console.log('ends ' + JSON.stringify(ends));
  assert.ok(ms / steps < H.tests.averageMS);
  return { reach: reach / count, won: won / count, early: early / count };
}
const runs = process.argv.includes('--quick') ? H.tests.quick : H.tests.full;
const steady = bots('steady', runs), idle = bots('idle', runs);
assert.ok(steady.reach >= H.tests.reach, `steady wave 4 ${steady.reach}`);
assert.ok(steady.won >= H.tests.win[0] && steady.won <= H.tests.win[1], `steady win ${steady.won}`);
assert.ok(idle.early >= H.tests.idle, `idle early ${idle.early}`);
console.log(`ok: ${runs}-seed balance bounds, finite runs and <20-minute termination`);
