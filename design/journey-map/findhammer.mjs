// The map find, accessible sheet and cached line-art renderer. The kit owns the frame clock.
import { C, FIND_COPY, FIND_PLAY, HAMMER } from './data.mjs';
import { VIEW, lerp } from './trip.mjs';
import { runeGlyph } from './art.mjs';
import { hammerStart, hammerStep, hammerPick } from './hammer.mjs';
import { FD, FIND_BY, attr, ease, press, opened, found, attend, findSheet, closeSheet, findFormat, findSlot } from './findkit.mjs';

export function hammerBestRead(fallback = 0) { try { const value = Number(localStorage.getItem(HAMMER.ui.bestKey)); return Number.isFinite(value) && value >= 0 ? Math.max(fallback, value) : fallback; } catch { return fallback; } }
export function hammerBestWrite(score, fallback = 0) { const best = Math.max(score, hammerBestRead(fallback)); try { localStorage.setItem(HAMMER.ui.bestKey, String(best)); } catch {} return best; }
const hammerText = (key, values = {}) => findFormat(FIND_COPY.hammer[key], values);
const hammerRuneNumber = (r, n) => r === 1 || r === 11 ? n * HAMMER.throw.ride * 100 : r === 3 ? HAMMER.hearts + n : r === 4 ? n * HAMMER.rune.hail : r === 5 ? n + 1 : r === 6 ? n * HAMMER.rune.ice * 100 : n;
const hammerRuneArt = (r, small = false) => { const U = HAMMER.ui, h = small ? U.mini : U.rune, w = small ? U.miniW : U.runeW, g = runeGlyph(HAMMER.runes[r].key, h); return `<svg viewBox="0 0 ${w} ${h}" aria-hidden="true"><path d="${g.d}"/></svg>`; };

export function findHammer(svg) {
  const f = FIND_BY.hammer, el = svg.querySelector('#f-hammer'), lift = el.querySelector('.hm-lift'), spark = el.querySelector('.hm-spark');
  const o = { id: f.id, el, stage: 'rest', game: null, best: hammerBestRead(), serial: HAMMER.seed.first, accumulator: 0, hearTs: -Infinity, canvas: null, ctx: null, version: -1, queued: false, input: { move: 0, target: NaN, throw: false }, keys: { left: false, right: false, fire: false }, pointer: null, auto: false, held: false, sprites: {}, paths: {}, seen: {}, notices: {}, last: 0 };
  const announce = (kind, text, always = false) => { if (!o.status || FD.sheetOwner !== o) return; if (always || FD.now - (o.notices[kind] ?? -Infinity) >= HAMMER.ui.notice) { o.announcement += (o.announcement ? ' ' : '') + text; o.notices[kind] = FD.now; } };
  const clearInput = () => { o.keys.left = o.keys.right = o.keys.fire = o.held = false; o.pointer = null; o.input.move = 0; o.input.target = NaN; o.input.throw = false; o.accumulator = 0; };
  const focusField = () => o.canvas?.focus({ preventScroll: true });
  const pause = () => { if (!o.game || o.game.phase === 'end' || o.game.paused) return; o.game.paused = true; clearInput(); refresh(); };
  const run = () => { o.game = hammerStart(o.serial++); o.game.reduced = FD.rm; o.auto = false; o.seen = {}; o.version = -1; clearInput(); refresh(); focusField(); };
  const resume = () => { if (!o.game) return; o.game.paused = false; clearInput(); refresh(); if (o.game.phase === 'play') focusField(); };
  const toggle = () => { o.auto = !o.auto; if (o.autoButton) attr(o.autoButton, 'aria-pressed', o.auto); };
  const choose = i => { if (o.game && !o.game.paused && hammerPick(o.game, i)) { refresh(); focusField(); } };
  const runeCards = () => o.game.choices.map((r, i) => { const n = o.game.levels[r] + 1, row = FIND_COPY.hammer.runes[r], line = findFormat(row[1], { n: hammerRuneNumber(r, n) }); return `<button type="button" class="hm-rune" data-rune="${i}" aria-label="${hammerText('runeLevel', { key: i + 1, name: row[0], n, line })}">${hammerRuneArt(r)}<span><strong>${i + 1}. ${row[0]}</strong><span>${line}</span></span></button>`; }).join('');
  function refresh() {
    if (FD.sheetOwner !== o || !o.canvas) return;
    const s = o.game, H = FIND_COPY.hammer; let html = '';
    if (!s) html = `<h2>${H.title}</h2><p>${H.intro}</p><p class="hm-quiet">${FD.hover ? H.controls : H.controlsTouch}</p><button type="button" class="hm-start">${H.start}</button>${findSlot(FIND_COPY.hammerFact)}`;
    else if (s.paused) html = `<h2>${H.pause}</h2><button type="button" class="hm-resume">${H.resume}</button><button type="button" class="hm-new">${H.newRun}</button>`;
    else if (s.phase === 'runes') html = `<h2>${hammerText('runeTitle', { n: s.wave })}</h2><p class="hm-quiet">${H.runeKeys}</p>${runeCards()}`;
    else if (s.phase === 'end') {
      o.best = hammerBestWrite(s.silver, o.best);
      html = `<h2>${s.reason === 'won' ? H.won : hammerText(s.reason === 'hearts' ? 'lostHearts' : 'lost', { n: s.wave })}</h2><p>${hammerText('stats', { silver: s.silver, foes: s.felled })}</p><div class="hm-taken" aria-label="${H.runes}">${s.levels.map((n, r) => n ? `<span aria-label="${H.runes[r][0]}, ${n}">${hammerRuneArt(r, true)}<span>${n}</span></span>` : '').join('')}</div><p>${hammerText('best', { silver: o.best })}</p>${findSlot(FIND_COPY.hammerFact)}<button type="button" class="hm-new">${H.newRun}</button><button type="button" class="hm-end-close">${H.close}</button>`;
    }
    const cardKey = !s ? 'start' : s.paused ? 'pause' : s.phase === 'runes' ? 'runes' + s.wave : s.phase;
    if (o.cardKey !== cardKey) {
      o.cardKey = cardKey; o.card.innerHTML = html; o.card.hidden = !html;
      o.card.querySelector('.hm-start')?.addEventListener('click', run); o.card.querySelector('.hm-resume')?.addEventListener('click', resume);
      o.card.querySelectorAll('.hm-new').forEach(b => b.addEventListener('click', run)); o.card.querySelector('.hm-end-close')?.addEventListener('click', () => closeSheet());
      o.card.querySelectorAll('.hm-rune').forEach((b, i) => b.addEventListener('click', () => choose(i)));
      const first = o.card.querySelector('button'); if (first) first.focus({ preventScroll: true });
    }
    o.wave.textContent = hammerText('waveLine', { n: s ? s.wave : 1 }) + (s && s.fate >= 0 ? ' / ' + H.fates[s.fate][0] : '');
    const hearts = s ? s.hearts : HAMMER.hearts, most = s ? s.maxHearts : HAMMER.hearts;
    o.hearts.innerHTML = Array.from({ length: most }, (_, i) => `<svg viewBox="${HAMMER.paths.heartBox}" aria-hidden="true"><path d="${HAMMER.paths.heart}" fill="${i < hearts ? C.paper : C.ink}"/></svg>`).join('');
    attr(o.hearts, 'aria-label', hammerText('hearts', { n: hearts, max: most })); o.silver.textContent = hammerText('silver', { n: s ? s.silver : 0 });
    attr(o.autoButton, 'aria-pressed', o.auto); o.pauseButton.disabled = !s || s.phase === 'end'; o.pauseButton.textContent = s?.paused ? H.resume : H.pauseButton;
    if (s) {
      o.announcement = '';
      if (s.events.rune !== (o.seen.rune || 0)) announce('rune', hammerText('runeTaken', { name: H.runes[s.taken][0], n: s.levels[s.taken] }));
      if (s.events.wave !== (o.seen.wave || 0)) announce('wave', hammerText('waveStart', { n: s.wave }) + (s.fate >= 0 ? ' ' + H.fates[s.fate].join('. ') : ''));
      if (s.events.gift !== (o.seen.gift || 0)) announce('gift', H.gift);
      if (s.events.clay !== (o.seen.clay || 0)) announce('clay', H.clay);
      if (s.events.heart !== (o.seen.heart || 0)) announce('heart', H.heart);
      if (s.events.end !== (o.seen.end || 0)) announce('end', s.reason === 'won' ? H.won : hammerText(s.reason === 'hearts' ? 'lostHearts' : 'lost', { n: s.wave }));
      if (s.events.hurt !== (o.seen.hurt || 0)) announce('hurt', hammerText('heartLost', { n: s.hearts }), true);
      if (o.announcement) o.status.textContent = o.announcement;
      Object.assign(o.seen, s.events); o.version = s.version;
    }
  }
  const measure = () => {
    if (FD.sheetOwner !== o || !o.canvas) return;
    const U = HAMMER.ui; o.fit = Math.min(1, (VIEW.w - FIND_PLAY.kit.sheet.edge * 2) / U.w, (VIEW.h - FIND_PLAY.kit.sheet.edge * 2) / U.h);
    const scale = Math.min(HAMMER.field.dpr, window.devicePixelRatio || 1) * o.fit;
    o.canvas.width = Math.round(HAMMER.field.w * scale); o.canvas.height = Math.round(HAMMER.field.h * scale); const previous = o.scale; o.scale = scale;
    o.ctx = o.canvas.getContext('2d');
    if (previous === scale && o.sprites.glove) return;
    o.sprites = {};
    for (const [name, row] of Object.entries(HAMMER.paths.sprites)) {
      const c = document.createElement('canvas'), pad = U.spritePad;
      c.width = Math.ceil((row[0] + pad * 2) * scale); c.height = Math.ceil((row[1] + pad * 2) * scale);
      const ctx = c.getContext('2d'); ctx.scale(scale, scale); ctx.translate(row[0] / 2 + pad, row[1] / 2 + pad); ctx.lineWidth = HAMMER.field.line; ctx.strokeStyle = C.paper; ctx.lineCap = ctx.lineJoin = 'round'; ctx.stroke(new Path2D(row[2]));
      o.sprites[name] = { canvas: c, w: row[0] + pad * 2, h: row[1] + pad * 2 };
    }
  };
  const paintSprite = (name, x, y) => { const p = o.sprites[name]; o.ctx.drawImage(p.canvas, x - p.w / 2, y - p.h / 2, p.w, p.h); };
  const paintPath = (p, x, y, colour) => { const c = o.ctx; c.save(); c.translate(x, y); c.strokeStyle = colour; c.stroke(p); c.restore(); };
  const draw = () => {
    const c = o.ctx, s = o.game; if (!c) return;
    c.setTransform(o.scale, 0, 0, o.scale, 0, 0); c.fillStyle = C.ink; c.fillRect(0, 0, HAMMER.field.w, HAMMER.field.h); c.lineWidth = HAMMER.field.line; c.lineCap = c.lineJoin = 'round';
    c.save(); if (s && !FD.rm && s.shake > 0) c.translate(Math.sin(s.time * HAMMER.map.trembleRate) * HAMMER.fx.shake * s.shake / HAMMER.fx.life, 0);
    for (let i = 0; i < o.paths.bridge.length; i++) paintPath(o.paths.bridge[i], 0, 0, i % 2 ? C.note : C.dim);
    if (s) {
      for (let i = 0; i < s.cells.length; i++) { const p = s.cells[i]; if (p.live) paintPath(o.paths.shield, p.x, p.y, C.dim); }
      for (let i = 0; i < s.foes.length; i++) {
        const p = s.foes[i]; if (!p.live) continue; c.globalAlpha = !FD.rm && p.flash ? HAMMER.fx.flashAlpha : 1; paintSprite(p.kind, p.x, p.y); c.globalAlpha = 1;
        if (p.kind === 'rime' && p.hp < p.max) paintPath(o.paths.crack, p.x, p.y, C.note);
        if (p.burn > 0) paintPath(o.paths.shot[2], p.x, p.y, C.warm);
        if (p.kind === 'hrungnir') { c.fillStyle = C.mid; c.fillRect(p.x - HAMMER.foe.bossRX, p.y + HAMMER.foe.bossRY, HAMMER.foe.bossRX * 2, HAMMER.shield.cell); c.fillStyle = C.note; c.fillRect(p.x - HAMMER.foe.bossRX, p.y + HAMMER.foe.bossRY, HAMMER.foe.bossRX * 2 * p.hp / p.max, HAMMER.shield.cell); if (s.heartShown) paintPath(o.paths.stoneHeart, p.x, p.y + HAMMER.boss.heartY, C.paper); }
      }
      for (let i = 0; i < s.shots.length; i++) { const p = s.shots[i]; if (p.live) paintPath(o.paths.shot[p.kind === 'fire' ? 2 : p.kind === 'rime' ? 1 : 0], p.x, p.y, p.kind === 'fire' ? C.warm : C.paper); }
      for (let i = 0; i < s.hail.length; i++) { const p = s.hail[i]; if (p.live) paintPath(o.paths.shot[1], p.x, p.y, C.paper); }
      if (!FD.rm) for (let i = 0; i < s.sparks.length; i++) { const p = s.sparks[i]; if (p.live) { c.globalAlpha = 1 - p.age / HAMMER.fx.life; paintPath(o.paths.spark, p.x, p.y, C.paper); } } c.globalAlpha = 1;
      if (s.valk.live) paintSprite('valkyrie', s.valk.x, s.valk.y);
      if (s.reason === 'won' && !FD.rm) for (let i = 0; i < o.paths.fragments.length; i++) { const row = HAMMER.paths.fragments[i], t = s.fall; c.globalAlpha = 1 - t / HAMMER.boss.fall; paintPath(o.paths.fragments[i], s.foes[0].x + row[0] * (1 + t), s.foes[0].y + row[1] + HAMMER.boss.gravity * t * t, C.paper); } c.globalAlpha = 1;
    }
    const x = s ? s.x : HAMMER.glove.x;
    if (!s || FD.rm || !s.hurt || Math.sin(s.time * HAMMER.glove.flicker) >= 0) paintSprite('glove', x, HAMMER.glove.y);
    const h = s?.hammer; c.save(); c.translate(h && h.mode !== 'held' ? h.x : x, h && h.mode !== 'held' ? h.y : HAMMER.glove.y - HAMMER.ui.mini);
    if (h && h.mode !== 'held') c.rotate(h.angle); paintSprite('hammer', 0, 0); c.restore(); c.restore();
  };
  const handleKey = e => {
    if (FD.sheetOwner !== o) return;
    const key = e.key.toLowerCase(), used = ['arrowleft', 'arrowright', 'a', 'd', ' ', 'arrowup', 'w', 'p', 't', '1', '2', '3', 'escape'].includes(key);
    e.stopPropagation();
    const nativeButton = key === ' ' && e.target.closest?.('button');
    if (!nativeButton && (used || ['0', '+', '-', '=', 'arrowdown', 'pageup', 'pagedown', 'home', 'end'].includes(key))) e.preventDefault();
    if (e.type === 'keyup') { if (['arrowleft', 'a'].includes(key)) o.keys.left = false; if (['arrowright', 'd'].includes(key)) o.keys.right = false; if ([' ', 'arrowup', 'w'].includes(key)) o.keys.fire = false; return; }
    if (key === 'escape') { closeSheet(); return; }
    if (!e.repeat) {
      if (key === 'p') { if (o.game?.paused) resume(); else pause(); }
      if (key === 't') toggle();
      if (['1', '2', '3'].includes(key)) choose(Number(key) - 1);
    }
    if (e.target !== o.canvas || !o.game || o.game.paused || o.game.phase !== 'play') return;
    if (['arrowleft', 'a'].includes(key)) { o.keys.left = true; o.input.target = NaN; }
    if (['arrowright', 'd'].includes(key)) { o.keys.right = true; o.input.target = NaN; }
    if ([' ', 'arrowup', 'w'].includes(key)) o.keys.fire = true;
  };
  const sheet = () => {
    opened(o); const H = FIND_COPY.hammer;
    if (!findSheet(o, 'hammer-sheet', `<div class="hm-panel"><div class="hm-header"><span class="hm-wave"></span><span class="hm-vitals"><span class="hm-hearts" role="img"></span><span class="hm-silver"></span></span></div><div class="hm-field"><canvas class="hm-canvas" tabindex="0" role="img" aria-label="${H.field}"></canvas><div class="hm-card"></div></div><p class="hm-status" role="status" aria-live="polite" aria-atomic="true"></p><div class="hm-buttons"><button class="hm-auto" type="button" aria-pressed="false">${H.auto}</button><button class="hm-pause" type="button">${H.pauseButton}</button><button class="hm-close" type="button">${H.close}</button></div></div>`, [f.x, f.y])) return;
    for (const [name, value] of Object.entries(HAMMER.ui)) if (name !== 'bestKey') FD.sheet.style.setProperty('--hm-' + name, typeof value === 'number' ? value + 'px' : value);
    const q = selector => FD.sheet.querySelector(selector);
    o.canvas = q('.hm-canvas'); o.card = q('.hm-card'); o.status = q('.hm-status'); o.wave = q('.hm-wave'); o.hearts = q('.hm-hearts'); o.silver = q('.hm-silver'); o.autoButton = q('.hm-auto'); o.pauseButton = q('.hm-pause'); o.cardKey = null;
    o.paths = { bridge: HAMMER.paths.bridge.map(d => new Path2D(d)), shot: HAMMER.paths.shot.map(d => new Path2D(d)), fragments: HAMMER.paths.fragments.map(row => new Path2D(row[2])) };
    for (const key of ['shield', 'spark', 'crack', 'stoneHeart']) o.paths[key] = new Path2D(HAMMER.paths[key]);
    measure(); refresh(); draw();
    q('.hm-close').addEventListener('click', () => closeSheet()); o.autoButton.addEventListener('click', toggle); o.pauseButton.addEventListener('click', () => o.game?.paused ? resume() : pause());
    const point = e => { const box = o.canvas.getBoundingClientRect(); o.input.target = (e.clientX - box.left) * HAMMER.field.w / box.width; };
    o.canvas.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && e.button !== 0 || o.pointer !== null) return; e.preventDefault(); e.stopPropagation(); point(e); o.pointer = e.pointerId; o.held = true; o.canvas.setPointerCapture(e.pointerId); focusField(); });
    o.canvas.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' || o.pointer === e.pointerId) point(e); });
    const release = e => { if (o.pointer === e.pointerId) { o.pointer = null; o.held = false; } };
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) o.canvas.addEventListener(type, release);
    found(o.id); o.stage = 'sheet'; o.sheetTs = FD.now; o.accumulator = 0;
  };
  press(el, sheet);
  o.onSheetClose = () => { if (o.game && o.game.phase !== 'end') o.game.paused = true; clearInput(); o.canvas = o.ctx = null; o.stage = 'rest'; };
  o.hear = () => { if (!FD.rm) o.hearTs = FD.now; };
  window.addEventListener('resize', measure);
  window.addEventListener('blur', pause);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  // Chrome and Edge send focusout when a focused button is removed (Start, a rune, Resume), so the check waits until the
  // press has finished and the field has its focus back; only focus that really left the sheet pauses the run.
  FD.sheet.addEventListener('focusout', () => { if (FD.sheetOwner === o) setTimeout(() => { if (FD.sheetOwner === o && !FD.sheet.contains(document.activeElement)) pause(); }, 0); });
  FD.sheet.addEventListener('keydown', handleKey); FD.sheet.addEventListener('keyup', handleKey);
  // Also isolate page hotkeys if focus has left the open sheet. Tab remains native.
  window.addEventListener('keydown', e => { if (FD.sheetOwner === o && !FD.sheet.contains(e.target)) { if (e.key !== 'Tab') e.preventDefault(); e.stopImmediatePropagation(); if (e.key === 'Escape') closeSheet(); } }, true);
  o.tick = t => {
    const M = HAMMER.map, age = t - o.hearTs, ringing = age >= 0 && age < M.hopTime;
    const hop = !FD.rm && ringing ? M.hop * Math.sin(Math.PI * age / M.hopTime) : 0, tremble = !FD.rm && attend(o, M.near) ? M.tremble * Math.sin(t * M.trembleRate) : 0;
    attr(lift, 'transform', `translate(${tremble} ${-hop})`); attr(spark, 'opacity', !FD.rm && (ringing || t % M.every < M.sparkTime) ? 1 : 0);
    if (FD.sheetOwner !== o) return;
    const q = FD.rm ? 1 : ease((t - o.sheetTs) / FIND_PLAY.kit.sheet.grow), from = FD.sheetFrom;
    FD.sheet.style.transform = `translate(${lerp(from[0], VIEW.w / 2, q)}px,${lerp(from[1], VIEW.h / 2, q)}px) scale(${lerp(FIND_PLAY.kit.sheet.from, o.fit, q)})`;
    const s = o.game;
    if (s && !s.paused) {
      o.input.move = Number(o.keys.right) - Number(o.keys.left); o.input.throw = o.auto || o.keys.fire || o.held; o.accumulator = Math.min(o.accumulator + FD.dt, HAMMER.step * HAMMER.steps);
      let n = 0; while (o.accumulator >= HAMMER.step && n++ < HAMMER.steps) { hammerStep(s, o.input, HAMMER.step); o.accumulator -= HAMMER.step; }
      if (s.version !== o.version && !o.queued) { o.queued = true; queueMicrotask(() => { o.queued = false; refresh(); }); }
    }
    draw();
  };
  return o;
}
