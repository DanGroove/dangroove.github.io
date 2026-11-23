// One board and thirteen persistent pieces move between the map and the dialog.
import { C, COPY, FIND_COPY, FIND_PLAY } from './data.mjs';
import { VIEW, clamp01, lerp } from './trip.mjs';
import { taflStart, taflMoves, taflPlay, taflReply } from './tafl.mjs';
import { FD, FIND_BY, ease, attr, fEsc, found, opened, press, findSheet, closeSheet, findSvg, findFormat, findRandom } from './findkit.mjs';

export const taflPanelHeight = () => { const T = FIND_PLAY.tafl; return T.board + T.tray * 2 + T.statusH + T.slotH + T.buttonsH + T.gap * 3 + T.pad * 2 + T.border * 2; };
const taflCellName = sq => FIND_COPY.taflColumns[sq % FIND_PLAY.tafl.rules.size] + (Math.floor(sq / FIND_PLAY.tafl.rules.size) + 1);
const taflPoint = sq => { const T = FIND_PLAY.tafl; return [(sq % T.rules.size + 0.5) * T.cell, (Math.floor(sq / T.rules.size) + 0.5) * T.cell, 1]; };

export function findBoard(svg) {
  const f = FIND_BY.tafl, el = svg.querySelector('#f-tafl'), board = el.querySelector('.tf-board'), home = board.parentElement;
  const T = FIND_PLAY.tafl, R = T.rules, starts = [R.king, ...R.defenders, ...R.attackers];
  const o = { id: f.id, el, game: taflStart(), stage: 'rest', kept: false, selected: null, cursor: R.king, busy: false, replyAt: null, hearTs: -Infinity, endTs: -Infinity, moveText: '', pieces: [] };
  o.pieces = [...board.querySelectorAll('.tf-piece')].map((g, i) => ({ g, kind: i === 0 ? 'k' : i <= R.defenders.length ? 'd' : 'a', sq: starts[i], start: starts[i], point: taflPoint(starts[i]), from: taflPoint(starts[i]), to: taflPoint(starts[i]), ts: -Infinity, duration: T.slide[1] }));
  const statusText = () => o.game.winner === 'king' ? FIND_COPY.taflWin : o.game.winner === 'attackers' ? (o.game.board.includes('k') ? FIND_COPY.taflStuck : FIND_COPY.taflLose) : o.game.winner === 'draw' ? FIND_COPY.taflDraw : o.game.turn === 'attackers' || o.busy ? FIND_COPY.taflThem : FIND_COPY.taflYou;
  const refresh = () => {
    if (FD.sheetOwner !== o) return;
    const Q = FIND_PLAY.tafl, moves = o.selected === null ? [] : taflMoves(o.game, o.selected);
    o.status.textContent = findFormat(FIND_COPY.taflStatus, { move: o.moveText, turn: statusText() }).trim();
    o.slot.hidden = !o.game.winner; o.rule.hidden = !!o.game.winner; // one row: the rules while a game is on, the slot when it is over
    const line = FIND_COPY.tafl; o.slot.innerHTML = typeof line === 'object' && line.todo ? `<div class="find-slot"><span class="pop-k">${fEsc(COPY.todo)}</span><p>${fEsc(line)}</p></div>` : `<p>${fEsc(line)}</p>`;
    o.cells.forEach((cell, i) => { cell.tabIndex = i === o.cursor ? 0 : -1; attr(cell, 'aria-label', findFormat(FIND_COPY.taflCell, { cell: taflCellName(i), piece: FIND_COPY.taflKinds[o.game.board[i] || 'empty'] })); attr(cell, 'aria-selected', i === o.selected); attr(o.dots[i], 'opacity', moves.includes(i) && !o.busy ? Q.dotAlpha : 0); });
    attr(o.selection, 'opacity', o.selected === null ? 0 : 1);
    if (o.selected !== null) { const p = taflPoint(o.selected); attr(o.selection, 'transform', `translate(${p[0]} ${p[1]})`); }
    const p = taflPoint(o.cursor); attr(o.cursorRing, 'transform', `translate(${p[0] - Q.cell / 2} ${p[1] - Q.cell / 2})`);
  };
  const destination = (piece, point, duration) => { piece.from = piece.point.slice(); piece.to = point; piece.ts = FD.now; piece.duration = duration; if (FD.rm) piece.point = point.slice(); };
  const finish = () => {
    o.busy = false;
    o.stage = FD.sheetOwner === o ? 'sheet' : 'rest';
    if (o.game.winner && o.game.last) o.endTs = FD.now;
    if (!o.game.winner && o.game.turn === 'attackers') { o.replyAt = FD.now + FIND_PLAY.tafl.reply; o.stage = 'reply'; }
    refresh();
  };
  const move = next => {
    const Q = FIND_PLAY.tafl, last = next.last, moving = o.pieces.find(p => p.sq === last.from), distance = Math.abs(last.from % R.size - last.to % R.size) + Math.abs(Math.floor(last.from / R.size) - Math.floor(last.to / R.size));
    const duration = Math.max(Q.slide[1], Math.min(Q.slide[2], Q.slide[0] * distance));
    destination(moving, taflPoint(last.to), duration); moving.sq = last.to;
    next.taken.forEach(sq => {
      const p = o.pieces.find(piece => piece.sq === sq), count = o.pieces.filter(piece => (piece.kind === 'a') === (p.kind === 'a') && piece.sq < 0).length;
      p.sq = -1; destination(p, [Q.trayInset + count * (Q.board - Q.trayInset * 2) / (R.attackers.length - 1), p.kind === 'a' ? Q.board + Q.tray / 2 : -Q.tray / 2, Q.capturedScale], duration);
    });
    o.game = next; o.kept = true; o.selected = null; o.busy = true; o.stage = 'sliding'; o.replyAt = null;
    o.moveText = findFormat(FIND_COPY.taflMove, { from: taflCellName(last.from), to: taflCellName(last.to) }) + (next.taken.length ? findFormat(FIND_COPY.taflTaken, { n: next.taken.length }) : '');
    refresh(); if (FD.rm) finish();
  };
  const reply = () => { o.replyAt = null; if (o.game.winner || o.game.turn !== 'attackers') return; move(taflReply(o.game, findRandom)); };
  const choose = sq => {
    if (o.busy || o.game.winner || o.game.turn !== 'king') return;
    o.cursor = sq;
    if (o.selected !== null && taflMoves(o.game, o.selected).includes(sq)) { move(taflPlay(o.game, o.selected, sq)); if (FD.rm && o.game.turn === 'attackers' && !o.game.winner) reply(); }
    else { o.selected = o.game.board[sq] && o.game.board[sq] !== 'a' ? sq : null; refresh(); }
  };
  const newGame = () => {
    o.game = taflStart(); o.selected = null; o.cursor = R.king; o.replyAt = null; o.moveText = ''; o.busy = true; o.stage = 'sliding';
    o.pieces.forEach(p => { p.sq = p.start; destination(p, taflPoint(p.start), FIND_PLAY.tafl.slide[2]); }); refresh(); if (FD.rm) finish();
  };
  const sheet = () => {
    opened(o);
    const Q = FIND_PLAY.tafl;
    if (!findSheet(o, 'tafl-sheet', `<div class="tf-panel"><svg class="tf-surface" viewBox="0 ${-Q.tray} ${Q.board} ${Q.board + Q.tray * 2}" role="grid" aria-label="${fEsc(FIND_COPY.taflBoard)}"></svg><p class="tf-status" role="status" aria-live="polite" aria-atomic="true"></p><div class="tf-slot-space"><p class="tf-rule">${fEsc(FIND_COPY.taflRule)}</p><div class="tf-slot" hidden></div></div><div class="tf-buttons"><button class="tf-new" type="button">${fEsc(FIND_COPY.taflNew)}</button><button class="tf-close" type="button">${fEsc(COPY.close)}</button></div></div>`, [f.x, f.y])) return;
    FD.sheet.querySelector('.tf-surface').appendChild(board); attr(board, 'transform', 'scale(1)');
    o.status = FD.sheet.querySelector('.tf-status'); o.rule = FD.sheet.querySelector('.tf-rule'); o.slot = FD.sheet.querySelector('.tf-slot'); o.cells = []; o.dots = [];
    o.input = findSvg('g', { class: 'tf-input', role: 'rowgroup' }); board.appendChild(o.input);
    const rows = Array.from({ length: R.size }, () => findSvg('g', { role: 'row' })); rows.forEach(row => o.input.appendChild(row));
    for (let sq = 0; sq < R.size ** 2; sq++) {
      const p = taflPoint(sq), g = findSvg('g', { class: 'tf-cell', role: 'gridcell', 'data-square': sq, 'aria-rowindex': Math.floor(sq / R.size) + 1, 'aria-colindex': sq % R.size + 1 }), hit = findSvg('rect', { x: p[0] - Q.cell / 2, y: p[1] - Q.cell / 2, width: Q.cell, height: Q.cell, fill: 'transparent' }), dot = findSvg('circle', { cx: p[0], cy: p[1], r: Q.dotR, fill: C.paper, opacity: 0, 'pointer-events': 'none' });
      g.append(hit, dot); rows[Math.floor(sq / R.size)].appendChild(g); o.cells.push(g); o.dots.push(dot);
    }
    o.selection = findSvg('circle', { r: Q.selectR, fill: 'none', stroke: C.paper, 'stroke-width': Q.outline, 'stroke-dasharray': Q.selectDash.join(' '), 'pointer-events': 'none', opacity: 0 });
    o.cursorRing = findSvg('rect', { class: 'tf-cursor', x: Q.cursorInset, y: Q.cursorInset, width: Q.cell - Q.cursorInset * 2, height: Q.cell - Q.cursorInset * 2, fill: 'none', stroke: C.paper, 'stroke-width': Q.cursorLine, 'pointer-events': 'none' }); o.input.append(o.selection, o.cursorRing);
    o.input.addEventListener('click', e => { const cell = e.target.closest('.tf-cell'); if (cell) { choose(+cell.dataset.square); o.cells[o.cursor].focus({ preventScroll: true }); } });
    o.input.addEventListener('keydown', e => {
      const delta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
      if (delta) { e.preventDefault(); e.stopPropagation(); const x = Math.max(0, Math.min(R.size - 1, o.cursor % R.size + delta[0])), y = Math.max(0, Math.min(R.size - 1, Math.floor(o.cursor / R.size) + delta[1])); o.cursor = y * R.size + x; refresh(); o.cells[o.cursor].focus({ preventScroll: true }); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); choose(o.cursor); }
    });
    FD.sheet.querySelector('.tf-new').addEventListener('click', newGame); FD.sheet.querySelector('.tf-close').addEventListener('click', () => closeSheet());
    o.sheetTs = FD.now; o.stage = o.busy ? 'sliding' : o.replyAt !== null ? 'reply' : 'sheet'; refresh(); o.cells[o.cursor].focus({ preventScroll: true }); found(o.id);
  };
  press(el, sheet);
  o.onSheetClose = () => {
    if (o.input) { o.input.remove(); o.input = null; }
    home.appendChild(board); attr(board, 'transform', `scale(${FIND_PLAY.tafl.mapCell / FIND_PLAY.tafl.cell})`);
    if (!o.busy && o.replyAt === null) o.stage = 'rest';
  };
  o.hear = () => { if (!FD.rm) { o.hearTs = FD.now; o.hearing = true; } };
  o.tick = t => {
    const Q = FIND_PLAY.tafl;
    o.pieces.forEach((p, i) => {
      const q = FD.rm ? 1 : ease((t - p.ts) / p.duration); p.point = p.from.map((v, j) => lerp(v, p.to[j], q));
      const hop = FD.rm || FD.sheetOwner === o ? 0 : Q.hop / (Q.scale * Q.mapCell / Q.cell) * Math.sin(Math.PI * clamp01((t - o.hearTs - i * Q.hopGap) / Q.hopTime));
      let scale = p.point[2];
      if (p.kind === 'k' && FD.sheetOwner === o && o.game.winner === 'king' && !FD.rm) scale *= 1 + Q.win[0] * Math.abs(Math.sin(Math.PI * Q.win[2] * clamp01((t - o.endTs) / Q.win[1]))); // the king who got away swells twice
      if (p.kind === 'k' && FD.sheetOwner !== o) scale *= (o.awake && !FD.rm ? lerp(Q.kingPulse[0], Q.kingPulse[1], (1 - Math.cos(Math.PI * 2 * t / Q.kingPulse[2])) / 2) : Q.mapKing) / (Q.kingR * Q.mapCell / Q.cell);
      attr(p.g, 'transform', `translate(${p.point[0]} ${p.point[1] - hop}) scale(${scale})`);
    });
    if (o.hearing && t - o.hearTs >= Q.hopTime + (o.pieces.length - 1) * Q.hopGap) o.hearing = false;
    if (o.busy && o.pieces.every(p => FD.rm || t - p.ts >= p.duration)) { o.busy = false; queueMicrotask(finish); }
    if (!o.busy && o.replyAt !== null && t >= o.replyAt) { o.replyAt = null; queueMicrotask(reply); }
    if (FD.sheetOwner === o) {
      const q = FD.rm ? 1 : ease((t - o.sheetTs) / Q.grow), fit = Math.min(1, (VIEW.w - FIND_PLAY.kit.sheet.edge * 2) / Q.width, (VIEW.h - FIND_PLAY.kit.sheet.edge * 2) / taflPanelHeight()), from = FD.sheetFrom;
      FD.sheet.style.transform = `translate(${lerp(from[0], VIEW.w / 2, q)}px,${lerp(from[1], VIEW.h / 2, q)}px) scale(${lerp(FIND_PLAY.kit.sheet.from, fit, q)})`;
    }
  };
  return o;
}
