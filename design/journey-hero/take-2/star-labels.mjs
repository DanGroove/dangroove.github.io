// Resting text line boxes, in hero CSS pixels. Called only at layout/boot measurement, never while drawing.
// Shared verbatim with the inline loader; its worker receives these rectangles from the main thread.
export function readStarLabels(hero, box) {
  const doc = hero.ownerDocument;
  if (!doc?.createRange) return [];
  const rects = [], range = doc.createRange();
  for (const el of hero.querySelectorAll('[data-nav] a, [data-cue], [data-pause]')) {
    const transform = el.style.transform;
    // The entrance translates these elements. Homes protect their settled line boxes.
    el.style.transform = '';
    try {
      const walker = doc.createTreeWalker(el, 4);
      while (walker.nextNode()) {
        const text = walker.currentNode;
        if (!text.data.trim()) continue;
        range.selectNodeContents(text);
        for (const r of range.getClientRects()) if (r.width && r.height) {
          rects.push({ left: r.left - box.left, top: r.top - box.top, right: r.right - box.left, bottom: r.bottom - box.top });
        }
      }
    } finally { el.style.transform = transform; }
  }
  return rects;
}
