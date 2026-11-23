import { HOME } from '../../../public/journey/hero/engine.mjs';

// Pure projection helpers shared by the player and the browser-free checks.
export function centreScene(view, need, textRight) {
  if (view.W < 720 || !Number.isFinite(textRight)) return view;
  return { ...view, cx: (textRight + view.W) / 2 - view.S * need.x };
}

export const sideGutter = width => Math.min(64, Math.max(40, 0.3 * width - 296));

export function stageTarget(view, need, boxLeft, boxRight) {
  const left = Math.min(boxLeft, view.cx + view.S * (need.x - need.w / 2));
  const right = Math.max(boxRight, view.cx + view.S * (need.x + need.w / 2));
  return { left, width: right - left };
}

export function equivalent(a, b, message, epsilon = 1e-8) {
  const visit = (x, y, key) => {
    if (typeof x === 'number' && typeof y === 'number') { if (Math.abs(x - y) <= epsilon) return; }
    else if (x === y) return;
    else if (x && y && typeof x === 'object' && typeof y === 'object' && Object.keys(x).join('|') === Object.keys(y).join('|')) { for (const k of Object.keys(x)) visit(x[k], y[k], key + '.' + k); return; }
    throw new Error(`${message} at ${key}: ${JSON.stringify(x)} != ${JSON.stringify(y)}`);
  };
  visit(a, b, 'pieces');
}

// Orthographic viewing rays: solve their intersection with y=0 in the current camera.
export function pointerFloor(x, y, { S, cx, cy, cam }) {
  const a = (x - cx) / S, b = (cy - y) / S;
  const d = cam.r[0] * cam.u[2] - cam.r[2] * cam.u[0];
  if (Math.abs(d) < 1e-9) return null;
  return [(a * cam.u[2] - cam.r[2] * b) / d, 0, (cam.r[0] * b - cam.u[0] * a) / d];
}

export const DEFAULT_FIT = Object.freeze({ w: 6.472556630033903, h: 7.02662378036781, x: 0.4431895737378033, y: 1.9701472394822923 });
export function sceneEnvelope(scenes, corners, dot, cam) {
  if (['r', 'u', 'v'].every(key => cam[key].every((n, i) => Math.abs(n - HOME[key][i]) < 1e-12))) return DEFAULT_FIT;
  const points = scenes.flatMap(make => make().flatMap(corners));
  const xs = points.map(p => dot(cam.r, p)), ys = points.map(p => dot(cam.u, p));
  const bounds = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  return { bounds, w: bounds[1] - bounds[0] + 0.5, h: bounds[3] - bounds[2] + 0.5, x: (bounds[0] + bounds[1]) / 2, y: (bounds[2] + bounds[3]) / 2 };
}
