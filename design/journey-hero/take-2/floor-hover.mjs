import { pointerFloor } from './view.mjs';

// One coalesced redraw while held; playback picks up the point on its own next frame.
export function createFloorHover(hero, fine, reduced, geometry, running, available, draw, raf) {
  let pointer = null, pending = false;
  function redraw() {
    if (!available() || running() || pending) return;
    pending = true;
    raf(() => { pending = false; if (available() && !running()) draw(); });
  }
  function clear() { if (pointer) { pointer = null; redraw(); } }
  hero.addEventListener('pointermove', event => {
    if (!fine.matches || reduced.matches || (event.pointerType && event.pointerType !== 'mouse')) return;
    const h = geometry()?.h;
    if (!h) return;
    const next = [event.clientX - h.left, event.clientY - h.top];
    if (pointer && pointer.every((v, i) => v === next[i])) return;
    pointer = next; redraw();
  });
  hero.addEventListener('pointerleave', clear);
  fine.addEventListener('change', clear);
  reduced.addEventListener('change', clear);
  return { clear, point: view => pointer && fine.matches && !reduced.matches ? pointerFloor(...pointer, view) : null };
}
