// Second take, prototype renderer: every piece is one superquadric (a box, a cylinder, a ball, a cone, a wedge, or anything between),
// lit by one light with a shadow map, shaded in three brand tones. WebGL2, no dependencies.
//
// A piece: { p: [x, y, z], q: [x, y, z, w], s: [a, b, c] half sizes, e: [up, around] roundness (0.02 sharp .. 1 round),
//            taper: [tx, ty] how much x and y shrink toward the local +z end (1 = to a point), shear: x += shear * y, tone: 'paper',
//            art: 'key' a picture from the atlas on its local +z face, cut: true to keep only the picture (a flat cut-out shape),
//            window: [u0, v0, u1, v1] the part of the picture to show (default all of it) }

export const TONES = {
  //        lit (faces the light)  mid (tops)   shade (away, or in shadow)
  paper: ['#F7F6F3', '#D5D0C9', '#8E8781'],
  red: ['#C0262E', '#A31D25', '#73141A'],
  ink: ['#34302E', '#292625', '#1D1B1A'],
  grey: ['#B9B4AE', '#9C9690', '#6A6460'],
  dark: ['#5A5552', '#48433F', '#322E2C'],
  night: ['#3B3735', '#2F2C2A', '#232120'],
};
export const INK = '#151314';
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);

// angles that crowd toward the diagonals, so a sharp box keeps flat faces and thin bevels, and a round shape still looks round
const OCT = [0, 0.15, 0.3, 0.45, 0.6, 0.72, 0.82, 0.9, 0.95, 0.98, 0.995];
function angles(quadrants, start) {
  const out = [], Q = Math.PI / 2;
  for (let k = 0; k < quadrants; k++) {
    const a0 = start + k * Q;
    for (const t of OCT) out.push(a0 + t * Q / 2);
    out.push(a0 + Q / 2);
    for (let i = OCT.length - 1; i > 0; i--) out.push(a0 + Q - OCT[i] * Q / 2);
  }
  out.push(start + quadrants * Q);
  return out;
}

const VERT = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aAng;
uniform mat4 uVP;
uniform vec3 uPos, uSize;
uniform vec4 uQuat;
uniform vec2 uExp, uTaper;
uniform float uShear, uGrow;
out vec3 vN, vW, vL;
out float vFace;
vec2 superellipse(float ang, float e) {
  float c = cos(ang), s = sin(ang), ac = abs(c), as = abs(s), m = max(ac, as), p = 2.0 / e;
  return vec2(c, s) / (m * pow(pow(ac / m, p) + pow(as / m, p), 1.0 / p));
}
float pw(float x, float k) { return sign(x) * pow(max(abs(x), 1e-12), k); }
vec3 turn(vec4 q, vec3 p) { return p + 2.0 * cross(q.xyz, cross(q.xyz, p) + q.w * p); }
void main() {
  vec2 xy = superellipse(aAng.x, uExp.y), rz = superellipse(aAng.y, uExp.x);
  rz.x = max(rz.x, 0.0);
  float p1 = 2.0 / uExp.x - 1.0, p2 = 2.0 / uExp.y - 1.0;
  vec3 unit = vec3(rz.x * xy, rz.y);
  float R = pow(max(rz.x, 1e-12), p1);
  vec3 n = vec3(R * pw(xy.x, p2) / uSize.x, R * pw(xy.y, p2) / uSize.y, pw(rz.y, p1) / uSize.z);
  vec3 p = unit * uSize;
  float h = unit.z * 0.5 + 0.5;
  float f = 1.0 - uTaper.x * h, g = 1.0 - uTaper.y * h;
  float da = -uTaper.x * 0.5 / uSize.z * p.x, db = -uTaper.y * 0.5 / uSize.z * p.y;
  n = vec3(g * n.x, f * n.y, f * g * n.z - da * g * n.x - db * f * n.y);
  p.xy *= vec2(f, g);
  n.y -= uShear * n.x;
  p.x += uShear * p.y;
  float len = length(n);
  n = len > 1e-20 ? n / len : vec3(0.0, 0.0, 1.0);
  vFace = n.z;
  vec3 wn = turn(uQuat, n);
  vec3 wp = uPos + turn(uQuat, p) + wn * uGrow;
  vN = wn; vW = wp; vL = unit;
  gl_Position = uVP * vec4(wp, 1.0);
}`;

const SHADOW_FN = `
uniform mat4 uLightVP;
uniform sampler2DShadow uShadow;
float shadowAt(vec3 w, float spread) {
  vec3 s = (uLightVP * vec4(w, 1.0)).xyz * 0.5 + 0.5;
  vec2 px = spread / vec2(textureSize(uShadow, 0));
  float sum = 0.0;
  for (int i = -2; i <= 2; i++) for (int j = -2; j <= 2; j++) sum += texture(uShadow, vec3(s.xy + vec2(i, j) * px, s.z - 0.0015));
  return sum / 25.0;
}`;

const ART_FN = `
uniform sampler2D uAtlas;
uniform vec4 uArt;                    // the picture's place in the atlas: x, y, w, h
uniform float uArtMode;               // 0 none, 1 a picture on the face, 2 only the picture
vec4 artAt(vec3 l, float face) {
  if (uArtMode < 0.5 || face < 0.7) return vec4(0.0);
  vec2 uv = clamp(vec2(l.x, -l.y) * 0.5 + 0.5, 0.0, 1.0);
  return texture(uAtlas, uArt.xy + uv * uArt.zw);
}`;

const FRAG = `#version 300 es
precision highp float;
precision highp sampler2DShadow;
in vec3 vN, vW, vL;
in float vFace;
uniform vec3 uA, uB, uC, uLight;
uniform float uSoft, uSpread;
out vec4 o;
${SHADOW_FN}
${ART_FN}
void main() {
  vec4 art = artAt(vL, vFace);
  if (uArtMode > 1.5 && art.a < 0.5) discard;
  vec3 n = normalize(vN);
  float d = dot(n, uLight);
  float lit = shadowAt(vW + n * 0.03, uSpread);
  float w = max(fwidth(d), 0.002) + uSoft;
  float mid = smoothstep(0.22 - w, 0.22 + w, d) * lit;
  float top = smoothstep(0.66 - w, 0.66 + w, d) * lit;
  vec3 col = mix(uC, mix(uB, uA, top), mid);
  // A picture keeps its own colours whichever way its face is turned (a page lying on the floor is as bright as one on the screen):
  // only a cast shadow dims it, by as much as it dims the piece itself.
  float k = mix(dot(uC, vec3(1.0)) / max(dot(uA, vec3(1.0)), 1e-4), 1.0, lit);
  if (uArtMode > 1.5) col = art.rgb / art.a * k; else col = col * (1.0 - art.a) + art.rgb * k;
  o = vec4(col, 1.0);
}`;

const FRAG_FLAT = `#version 300 es
precision highp float;
uniform vec3 uA;
out vec4 o;
void main() { o = vec4(uA, 1.0); }`;

const FRAG_NONE = `#version 300 es
precision highp float;
in vec3 vL;
in float vFace;
${ART_FN}
void main() { if (uArtMode > 1.5 && artAt(vL, vFace).a < 0.5) discard; }`;

const VERT_FLOOR = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aXZ;
uniform mat4 uVP;
out vec3 vW;
void main() { vW = vec3(aXZ.x, 0.0, aXZ.y); gl_Position = uVP * vec4(vW, 1.0); }`;

const FRAG_FLOOR = `#version 300 es
precision highp float;
precision highp sampler2DShadow;
in vec3 vW;
uniform vec3 uInk, uPool, uDot;
uniform vec4 uFloor;                  // centre x, centre z, radius, dot pitch
uniform float uSpread;
out vec4 o;
${SHADOW_FN}
void main() {
  float r = length(vW.xz - uFloor.xy) / uFloor.z;
  float pool = 1.0 - smoothstep(0.25, 1.0, r);
  float lit = shadowAt(vW + vec3(0.0, 0.03, 0.0), uSpread);
  vec3 c = mix(uInk, uPool, pool * (0.25 + 0.75 * lit));
  vec2 g = (fract(vW.xz / uFloor.w + 0.5) - 0.5) * uFloor.w;
  float dist = length(g), aa = fwidth(dist);
  float dotv = (1.0 - smoothstep(0.03 - aa, 0.03 + aa, dist)) * pool * (0.35 + 0.65 * lit);
  o = vec4(mix(c, uDot, dotv), 1.0);
}`;

function program(gl, vs, fs) {
  const make = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) + '\n' + src);
    return s;
  };
  const p = gl.createProgram();
  gl.attachShader(p, make(gl.VERTEX_SHADER, vs)); gl.attachShader(p, make(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const u = {};
  for (let i = 0, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i < n; i++) { const info = gl.getActiveUniform(p, i); u[info.name.replace('[0]', '')] = gl.getUniformLocation(p, info.name); }
  return { p, u };
}

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = a => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };

export function createRenderer(canvas, { shadowSize = 2048 } = {}) {
  const gl = canvas.getContext('webgl2', { antialias: true, alpha: false, preserveDrawingBuffer: true });
  if (!gl) throw new Error('no webgl2');
  const piece = program(gl, VERT, FRAG), flat = program(gl, VERT, FRAG_FLAT), depth = program(gl, VERT, FRAG_NONE), floor = program(gl, VERT_FLOOR, FRAG_FLOOR);

  // the one mesh every piece shares
  const around = angles(4, -Math.PI), up = angles(2, -Math.PI / 2), nu = around.length, nv = up.length;
  const verts = new Float32Array(nu * nv * 2);
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) { verts[(j * nu + i) * 2] = around[i]; verts[(j * nu + i) * 2 + 1] = up[j]; }
  const idx = new Uint16Array((nu - 1) * (nv - 1) * 6);
  let k = 0;
  for (let j = 0; j < nv - 1; j++) for (let i = 0; i < nu - 1; i++) {
    const a = j * nu + i, b = a + 1, c = a + nu, d = c + 1;
    idx[k++] = a; idx[k++] = b; idx[k++] = d; idx[k++] = a; idx[k++] = d; idx[k++] = c;
  }
  const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);

  const fvao = gl.createVertexArray(); gl.bindVertexArray(fvao);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-40, -40, -40, 40, 40, -40, 40, 40]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  // the shadow map
  const shadowTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, shadowTex);
  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT24, shadowSize, shadowSize);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
  const shadowFbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, shadowTex, 0);
  gl.drawBuffers([gl.NONE]); gl.readBuffer(gl.NONE);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  // the atlas of pictures: one canvas, and where each picture sits in it
  const atlasTex = gl.createTexture();
  let places = {};
  gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, atlasTex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
  function setAtlas(atlas) {
    places = atlas.places;
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, atlasTex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas.canvas);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, 3);                // the pictures have 8px of room around them: enough for three halvings
    const aniso = gl.getExtension('EXT_texture_filter_anisotropic');
    if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(4, gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
  }

  const setPiece = (u, pc, grow) => {
    gl.uniform3fv(u.uPos, pc.p); gl.uniform4fv(u.uQuat, pc.q);
    gl.uniform3f(u.uSize, Math.max(pc.s[0], 1e-4), Math.max(pc.s[1], 1e-4), Math.max(pc.s[2], 1e-4));
    gl.uniform2f(u.uExp, Math.max(pc.e[0], 0.012), Math.max(pc.e[1], 0.012));
    gl.uniform2fv(u.uTaper, pc.taper || [0, 0]); gl.uniform1f(u.uShear, pc.shear || 0); gl.uniform1f(u.uGrow, grow);
    const place = pc.art && places[pc.art];
    if (u.uArtMode) {
      gl.uniform1f(u.uArtMode, place ? (pc.cut ? 2 : 1) : 0);
      if (place) { const w = pc.window || [0, 0, 1, 1]; gl.uniform4f(u.uArt, place[0] + w[0] * place[2], place[1] + w[1] * place[3], (w[2] - w[0]) * place[2], (w[3] - w[1]) * place[3]); }
    }
  };
  const drawAll = (prog, pieces, grow, tone) => {
    for (const pc of pieces) {
      if (pc.hide) continue;
      setPiece(prog.u, pc, typeof grow === 'function' ? grow(pc) : grow);
      if (tone) tone(prog.u, pc);
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
    }
  };

  // view: { W, H (css px), dpr, S (px per unit), cx, cy (px), cam: { r, u, v } }
  // look: { light: [x, y, z], outline (units), soft, spread, floor: { on, x, z, radius, pitch }, centre: [x, y, z] of the lit volume, reach }
  function draw(pieces, view, look = {}) {
    const { W, H, dpr = 1, S, cx, cy, cam } = view;
    const L = norm(look.light || [-0.3, 0.55, 0.78]), outline = look.outline ?? 0.035, soft = look.soft ?? 0, spread = look.spread ?? 1;
    const C = look.centre || [0, 2.2, 0], reach = look.reach || 7;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);

    const vp = new Float32Array([
      2 * S / W * cam.r[0], 2 * S / H * cam.u[0], -cam.v[0] / 60, 0,
      2 * S / W * cam.r[1], 2 * S / H * cam.u[1], -cam.v[1] / 60, 0,
      2 * S / W * cam.r[2], 2 * S / H * cam.u[2], -cam.v[2] / 60, 0,
      2 * cx / W - 1, 1 - 2 * cy / H, 0, 1,
    ]);
    const lr = norm(cross([0, 1, 0], L)), lu = cross(L, lr);
    const lvp = new Float32Array([
      lr[0] / reach, lu[0] / reach, -L[0] / (2 * reach), 0,
      lr[1] / reach, lu[1] / reach, -L[1] / (2 * reach), 0,
      lr[2] / reach, lu[2] / reach, -L[2] / (2 * reach), 0,
      -dot(lr, C) / reach, -dot(lu, C) / reach, dot(L, C) / (2 * reach), 1,
    ]);

    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.enable(gl.CULL_FACE);
    gl.bindVertexArray(vao);

    // 1. depth from the light
    gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFbo); gl.viewport(0, 0, shadowSize, shadowSize);
    gl.clearDepth(1); gl.clear(gl.DEPTH_BUFFER_BIT);
    const solid = pieces.filter(pc => !pc.cut), cuts = pieces.filter(pc => pc.cut);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, atlasTex);
    gl.useProgram(depth.p); gl.uniformMatrix4fv(depth.u.uVP, false, lvp); gl.uniform1i(depth.u.uAtlas, 1);
    gl.cullFace(gl.FRONT);
    drawAll(depth, solid.filter(pc => !pc.noShadow), 0);
    gl.disable(gl.CULL_FACE);
    drawAll(depth, cuts.filter(pc => !pc.noShadow), 0);
    gl.enable(gl.CULL_FACE);

    // 2. the picture
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, canvas.width, canvas.height);
    const ink = hex(look.bg || INK);
    gl.clearColor(ink[0], ink[1], ink[2], 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, shadowTex);

    gl.cullFace(gl.BACK);
    gl.useProgram(piece.p);
    gl.uniformMatrix4fv(piece.u.uVP, false, vp); gl.uniformMatrix4fv(piece.u.uLightVP, false, lvp);
    gl.uniform1i(piece.u.uShadow, 0); gl.uniform1i(piece.u.uAtlas, 1);
    gl.uniform3fv(piece.u.uLight, L); gl.uniform1f(piece.u.uSoft, soft); gl.uniform1f(piece.u.uSpread, spread);
    const tones = (u, pc) => {
      const t = pc.tones || TONES[pc.tone] || TONES.paper;
      gl.uniform3fv(u.uA, typeof t[0] === 'string' ? hex(t[0]) : t[0]); gl.uniform3fv(u.uB, typeof t[1] === 'string' ? hex(t[1]) : t[1]); gl.uniform3fv(u.uC, typeof t[2] === 'string' ? hex(t[2]) : t[2]);
    };
    drawAll(piece, solid, 0, tones);
    gl.disable(gl.CULL_FACE);
    drawAll(piece, cuts, 0, tones);
    gl.enable(gl.CULL_FACE);

    if (outline > 0) {
      gl.cullFace(gl.FRONT);
      gl.useProgram(flat.p); gl.uniformMatrix4fv(flat.u.uVP, false, vp); gl.uniform3fv(flat.u.uA, hex(look.line || INK));
      drawAll(flat, solid.filter(pc => !pc.noLine), pc => outline * (pc.line ?? 1));
      gl.cullFace(gl.BACK);
    }

    if (look.floor && look.floor.on !== false) {
      const f = look.floor;
      gl.bindVertexArray(fvao); gl.useProgram(floor.p); gl.disable(gl.CULL_FACE);
      gl.uniformMatrix4fv(floor.u.uVP, false, vp); gl.uniformMatrix4fv(floor.u.uLightVP, false, lvp); gl.uniform1i(floor.u.uShadow, 0); gl.uniform1f(floor.u.uSpread, spread);
      gl.uniform3fv(floor.u.uInk, ink); gl.uniform3fv(floor.u.uPool, hex(f.pool || '#262323')); gl.uniform3fv(floor.u.uDot, hex(f.dot || '#4A4543'));
      gl.uniform4f(floor.u.uFloor, f.x ?? 0, f.z ?? 0, f.radius ?? 5.5, f.pitch ?? 0.5);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.enable(gl.CULL_FACE);
    }
    gl.bindVertexArray(null);
  }
  return { gl, draw, setAtlas };
}
