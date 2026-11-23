// Required pure-rules checks. Run from the journey-map directory.
import { strict as assert } from 'node:assert';
import { taflStart, taflMoves, taflPlay, taflReply } from '../tafl.mjs';
import { rnd } from '../art.mjs';
import { FIND_PLAY } from '../data.mjs';

const R = FIND_PLAY.tafl.rules, random = rnd(471);
const setup = (pieces, turn = 'king') => ({ ...taflStart(), board: Array(R.size ** 2).fill(null).map((v, i) => pieces[i] || null), turn });
const start = taflStart();
assert.equal(start.board.filter(p => p === 'a').length, 8); assert.equal(start.board.filter(p => p === 'd').length, 4); assert.equal(start.board.filter(p => p === 'k').length, 1);
console.log('ok: start has eight attackers, four defenders and one king');
function legal(state) {
  const moves = [];
  state.board.forEach((p, from) => taflMoves(state, from).forEach(to => {
    const x = from % R.size, y = Math.floor(from / R.size), dx = to % R.size - x, dy = Math.floor(to / R.size) - y;
    assert.ok((!dx || !dy) && from !== to); assert.equal(state.board[to], null);
    if (p !== 'k') assert.ok(to !== R.centre && !R.corners.includes(to));
    for (let s = from + Math.sign(dx) + R.size * Math.sign(dy); s !== to; s += Math.sign(dx) + R.size * Math.sign(dy)) assert.equal(state.board[s], null);
    moves.push([from, to]);
  })); return moves;
}
let s = setup({ 24: 'k', 15: 'd', 17: 'a', 18: 'd', 3: 'a' });
assert.deepEqual(taflPlay(s, 15, 16).taken, [17]); assert.equal(s.board[17], 'a');
assert.equal(taflPlay(setup({ 7: 'k', 3: 'a' }), 7, 0).winner, 'king');
// The king is taken only when shut in on all four sides (rules.kingSides is 4): two attackers are not enough, four are,
// three and the empty centre are, and on the edge he cannot be taken (rules.kingEdge is false).
assert.equal(R.kingSides, 4); assert.equal(R.kingEdge, false);
assert.equal(taflPlay(setup({ 7: 'a', 9: 'k', 10: 'a' }, 'attackers'), 7, 8).winner, null);
assert.equal(taflPlay(setup({ 9: 'k', 2: 'a', 16: 'a', 10: 'a', 7: 'a' }, 'attackers'), 7, 8).winner, 'attackers');
assert.equal(taflPlay(setup({ 17: 'k', 10: 'a', 18: 'a', 15: 'a' }, 'attackers'), 15, 16).winner, 'attackers');
assert.equal(taflPlay(setup({ 2: 'k', 1: 'a', 3: 'a', 23: 'a', 40: 'd' }, 'attackers'), 23, 9).winner, null);
assert.deepEqual(taflPlay(setup({ 15: 'd', 17: 'a', 23: 'a', 24: 'k', 3: 'a' }), 15, 16).taken, []);
// A defender may pass through the empty throne, but may not stop there.
assert.ok(taflMoves(setup({ 23: 'd', 1: 'k', 3: 'a' }), 23).includes(25));
assert.ok(!taflMoves(setup({ 23: 'd', 1: 'k', 3: 'a' }), 23).includes(24));
assert.deepEqual(taflPlay(setup({ 24: 'k', 23: 'd', 17: 'a', 10: 'd', 3: 'a' }), 23, 16).taken, []);
console.log('ok: clear rook moves, restricted squares, exact capture, king capture/escape and moving between enemies');
// The king on c7 has one open way to a corner, a7 by b7. b6-b7 shuts it.
s = setup({ 44: 'k', 46: 'a', 36: 'a', 24: 'd' }, 'attackers');
assert.ok(taflMoves({ ...s, turn: 'king' }, 44).includes(42));
const stopped = taflReply(s, random);
assert.ok(stopped.winner === 'attackers' || !taflMoves(stopped, stopped.board.indexOf('k')).some(k => R.corners.includes(k)), 'reply must stop a stoppable immediate escape');
assert.ok(legal(s).some(([a, b]) => a === stopped.last.from && b === stopped.last.to));
console.log('ok: reply legally stops an immediate corner escape when it can');
s = setup({ 14: 'k', 10: 'a', 35: 'a', 24: 'd' }, 'attackers');
const blocked = taflReply(s, random); assert.ok(!taflMoves(blocked, blocked.board.indexOf('k')).some(k => R.corners.includes(k)));
assert.ok(blocked.board.includes('k'), 'this fixture should block, without taking the king');
assert.equal(taflPlay({ ...taflStart(), moves: R.limit - 1 }, 17, 16).winner, 'draw');
assert.equal(taflPlay(setup({ 24: 'k', 17: 'd' }), 17, 10).winner, 'king');
console.log('ok: non-capturing escape block, move-limit draw and no-move loss');
let max = 0, replies = 0;
for (let game = 0; game < 200; game++) {
  let state = taflStart(), ply = 0;
  while (!state.winner && ply < 200) {
    const before = structuredClone(state), moves = legal(state); assert.ok(moves.length);
    if (state.turn === 'king') state = taflPlay(state, ...moves[Math.floor(random() * moves.length)]);
    else { state = taflReply(state, random); replies++; assert.ok(moves.some(([a, b]) => a === state.last.from && b === state.last.to)); }
    assert.deepEqual(before.board.filter(Boolean).length - state.taken.length, state.board.filter(Boolean).length);
    assert.ok(state.board.filter(p => p === 'k').length <= 1); ply++;
  }
  assert.ok(state.winner && ply < 200); max = Math.max(max, ply);
}
console.log(`ok: 200 seeded random king-side games finish within ${max} moves; ${replies} legal attacker replies; every generated move checked`);
