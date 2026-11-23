// Brandubh rules and a deliberately beatable, one-ply attacker. No DOM or hidden state.
import { FIND_PLAY } from './data.mjs';

const taflSide = piece => piece === 'a' ? 'attackers' : piece ? 'king' : null;
const taflOther = side => side === 'king' ? 'attackers' : 'king';
const taflNeighbour = (square, dx, dy) => {
  const n = FIND_PLAY.tafl.rules.size, x = square % n + dx, y = Math.floor(square / n) + dy;
  return x >= 0 && x < n && y >= 0 && y < n ? y * n + x : -1;
};
const taflDirections = [[1, 0], [-1, 0], [0, 1], [0, -1]];
function taflReach(board, from) {
  const R = FIND_PLAY.tafl.rules, piece = board[from], moves = [];
  if (!piece) return moves;
  for (const [dx, dy] of taflDirections) {
    for (let to = taflNeighbour(from, dx, dy); to !== -1 && !board[to]; to = taflNeighbour(to, dx, dy)) {
      if (piece === 'k' || to !== R.centre && !R.corners.includes(to)) moves.push(to);
    }
  }
  return moves;
}
function taflCaptures(board, from, to) {
  const R = FIND_PLAY.tafl.rules, side = taflSide(board[from]), taken = [];
  const at = square => square === from ? null : square === to ? board[from] : board[square];
  for (const [dx, dy] of taflDirections) {
    const enemy = taflNeighbour(to, dx, dy); if (enemy === -1 || !at(enemy) || taflSide(at(enemy)) === side) continue;
    const beyond = taflNeighbour(enemy, dx, dy); if (beyond === -1) continue;
    if (taflSide(at(beyond)) === side || R.corners.includes(beyond) || beyond === R.centre && !at(beyond)) taken.push(enemy);
  }
  return taken;
}
function taflApply(state, from, to) {
  const board = state.board.slice(), taken = taflCaptures(board, from, to), piece = board[from];
  board[to] = piece; board[from] = null; taken.forEach(s => board[s] = null);
  return { board, turn: taflOther(state.turn), moves: state.moves + 1, taken, last: { from, to, piece }, winner: !board.includes('k') ? 'attackers' : FIND_PLAY.tafl.rules.corners.includes(board.indexOf('k')) ? 'king' : null };
}
const taflHasMove = (board, side) => board.some((p, s) => taflSide(p) === side && taflReach(board, s).length);
export function taflStart() {
  const R = FIND_PLAY.tafl.rules, board = Array(R.size ** 2).fill(null);
  R.attackers.forEach(s => board[s] = 'a'); R.defenders.forEach(s => board[s] = 'd'); board[R.king] = 'k';
  return { board, turn: 'king', moves: 0, taken: [], last: null, winner: null };
}
export function taflMoves(state, from) {
  return state.winner || taflSide(state.board[from]) !== state.turn ? [] : taflReach(state.board, from);
}
export function taflPlay(state, from, to) {
  if (!taflMoves(state, from).includes(to)) throw new RangeError('Illegal tafl move');
  const next = taflApply(state, from, to);
  if (!next.winner && !taflHasMove(next.board, next.turn)) next.winner = taflOther(next.turn);
  if (!next.winner && next.moves >= FIND_PLAY.tafl.rules.limit) next.winner = 'draw';
  return next;
}
export function taflReply(state, random) {
  if (state.winner || state.turn !== 'attackers') return state;
  const R = FIND_PLAY.tafl.rules, S = R.score;
  let best = -Infinity, choices = [];
  state.board.forEach((piece, from) => {
    if (piece !== 'a') return;
    taflReach(state.board, from).forEach(to => {
      const next = taflApply(state, from, to), king = next.board.indexOf('k'), reach = king < 0 ? [] : taflReach(next.board, king);
      let score = king < 0 ? S.king : 0;
      if (reach.some(s => R.corners.includes(s))) score -= S.corner;
      for (const edge of reach) {
        const x = edge % R.size, y = Math.floor(edge / R.size);
        if (x && x !== R.size - 1 && y && y !== R.size - 1 || R.corners.includes(edge)) continue;
        const board = next.board.slice(); board[king] = null; board[edge] = 'k';
        if (taflReach(board, edge).some(s => R.corners.includes(s))) score -= S.edge;
      }
      score += S.defender * next.taken.filter(s => state.board[s] === 'd').length;
      let worst = 0;
      next.board.forEach((p, s) => { if (p && p !== 'a') for (const dest of taflReach(next.board, s)) worst = Math.max(worst, taflCaptures(next.board, s, dest).filter(k => next.board[k] === 'a').length); });
      score -= S.attacker * worst + S.mobility * reach.length;
      if (king >= 0 && taflDirections.some(([dx, dy]) => taflNeighbour(king, dx, dy) === to)) score += S.adjacent;
      if (score > best) { best = score; choices = [[from, to]]; } else if (score === best) choices.push([from, to]);
    });
  });
  if (!choices.length) return { ...state, board: state.board.slice(), taken: [], winner: 'king' };
  const choice = choices[Math.min(choices.length - 1, Math.floor(Math.max(0, random()) * choices.length))];
  return taflPlay(state, ...choice);
}
