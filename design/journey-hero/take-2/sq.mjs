// Second take, prototype renderer: every piece is one superquadric (a box, a cylinder, a ball, a cone, a wedge, or anything between),
// lit by one light with a shadow map, shaded in three brand tones. WebGL2, no dependencies.
//
// A piece: { p: [x, y, z], q: [x, y, z, w], s: [a, b, c] half sizes, e: [up, around] roundness (0.02 sharp .. 1 round),
//            taper: [tx, ty] how much x and y shrink toward the local +z end (1 = to a point), shear: x += shear * y, tone: 'paper',
//            art: 'key' a picture from the atlas on its local +z face, cut: true to keep only the picture (a flat cut-out shape),
//            window: [u0, v0, u1, v1] the part of the picture to show (default all of it),
//            clip: [a, b, c, d] keeps world points where ax + by + cz + d >= 0 in every pass,
//            shade: true to dim the picture where its face turns from the light (a sheet that bends shows its bend that way) }
// shadowP optionally keeps a depth-only colour lift's shadow caster at its authored position.

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
function angles(quadrants, start, oct = OCT) {
  const out = [], Q = Math.PI / 2;
  for (let k = 0; k < quadrants; k++) {
    const a0 = start + k * Q;
    for (const t of oct) out.push(a0 + t * Q / 2);
    out.push(a0 + Q / 2);
    for (let i = oct.length - 1; i > 0; i--) out.push(a0 + Q - oct[i] * Q / 2);
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
uniform float uArtShade;              // 1: the picture is also dimmed where its face turns from the light
vec4 artAt(vec3 l, float face) {
  if (uArtMode < 0.5 || face < 0.7) return vec4(0.0);
  vec2 uv = clamp(vec2(l.x, -l.y) * 0.5 + 0.5, 0.0, 1.0);
  return texture(uAtlas, uArt.xy + uv * uArt.zw);
}`;

// The same world plane cuts the picture, its silhouette and its cast shadow. uReveal is the entrance's one plane for the whole draw.
const CLIP_FN = `
uniform vec4 uClip, uReveal;
void clipAt(vec3 w) { if (dot(uClip, vec4(w, 1.0)) < 0.0 || dot(uReveal, vec4(w, 1.0)) < 0.0) discard; }
`;

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
${CLIP_FN}
void main() {
  clipAt(vW);
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
  // only a cast shadow dims it, by as much as it dims the piece itself. A piece that asks for it is dimmed the same way where it
  // turns from the light, with the same hard edge as the tones have.
  float k = mix(dot(uC, vec3(1.0)) / max(dot(uA, vec3(1.0)), 1e-4), 1.0, uArtShade > 0.5 ? mid : lit);
  if (uArtMode > 1.5) col = art.rgb / art.a * k; else col = col * (1.0 - art.a) + art.rgb * k;
  o = vec4(col, 1.0);
}`;

const FRAG_FLAT = `#version 300 es
precision highp float;
uniform vec3 uA;
in vec3 vW;
out vec4 o;
${CLIP_FN}
void main() { clipAt(vW); o = vec4(uA, 1.0); }`;

const FRAG_NONE = `#version 300 es
precision highp float;
in vec3 vL, vW;
in float vFace;
${ART_FN}
${CLIP_FN}
void main() { clipAt(vW); if (uArtMode > 1.5 && artAt(vL, vFace).a < 0.5) discard; }`;

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
uniform float uReach;                 // the entrance's hard circle from the centre, world units (huge when off)
out vec4 o;
${SHADOW_FN}
void main() {
  float r = length(vW.xz - uFloor.xy) / uFloor.z;
  float glow = 1.0 - smoothstep(0.25, 1.0, r);
  float pool = length(vW.xz - uFloor.xy) <= uReach ? glow : 0.0;
  float lit = shadowAt(vW + vec3(0.0, 0.03, 0.0), uSpread);
  vec2 g = (fract(vW.xz / uFloor.w + 0.5) - 0.5) * uFloor.w;
  float dist = length(g), aa = fwidth(dist);
  vec2 centre = floor(vW.xz / uFloor.w + 0.5) * uFloor.w;
  // A dot is on or off by its grid centre alone, so the growing circle never cuts one.
  float on = distance(centre, uFloor.xy) <= uReach ? 1.0 : 0.0;
  float dotv = (1.0 - smoothstep(0.03 - aa, 0.03 + aa, dist)) * glow * on * (0.35 + 0.65 * lit);
  // Round 8: the colour it always had, mix(mix(ink, pool, k), dot, dotv), written premultiplied over what is behind: over ink it
  // is unchanged, and the star field shows only where the floor adds nothing.
  float k = pool * (0.25 + 0.75 * lit), a = 1.0 - (1.0 - k) * (1.0 - dotv);
  o = vec4(uPool * k * (1.0 - dotv) + uDot * dotv, a);
}`;

// Round 8 (B1): the star field, one point per star in the hero's CSS px. Parallax, scroll and the entrance's rings come from
// uniforms; aOff is the star's own offset (stirring, gathering, the blast). Colours are paper or red mixed into ink; no fades.
const VERT_STARS = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aHome;
layout(location = 1) in vec3 aLook;   // depth, size (css px across), red
layout(location = 2) in vec2 aOff;
layout(location = 3) in float aFlag;   // round 9 (L1): 0 behind, 1 in front, 2 in front as G (paper), 3 in front as D (red)
uniform vec2 uSize;                    // the hero, css px
uniform float uDpr, uScroll;
uniform float uPass, uMarkSize;        // 0 the pass behind the scene, 1 the pass in front; a mark star's least size, css px
uniform vec2 uPar;                     // followed pointer fraction x 28 px
uniform vec3 uRings;                   // centre x, y, reach (huge when off, -1 before)
uniform vec3 uInk, uPaper, uRedInk;
uniform vec2 uMix;
out vec3 vCol;
out float vR;
void main() {
  float d = aLook.x;
  vec2 p = aHome + aOff - uPar * (0.12 + 0.88 * d * d) - vec2(0.0, uScroll * 0.12 * d);
  bool on = distance(aHome, uRings.xy) <= uRings.z && (aFlag > 0.5) == (uPass > 0.5);
  // A star in the mark cuts at once to the mark's colour at full strength and at least uMarkSize across: no in-between.
  vR = 0.5 * (aFlag > 1.5 ? max(aLook.y, uMarkSize) : aLook.y) * uDpr;
  vCol = aFlag > 2.5 ? uRedInk : aFlag > 1.5 ? uPaper : mix(uInk, aLook.z > 0.5 ? uRedInk : uPaper, mix(uMix.x, uMix.y, d));
  gl_PointSize = ceil(2.0 * vR) + 2.0;
  gl_Position = on ? vec4(p.x / uSize.x * 2.0 - 1.0, 1.0 - p.y / uSize.y * 2.0, 0.0, 1.0) : vec4(2.0, 2.0, 2.0, 1.0);
}`;
const FRAG_STARS = `#version 300 es
precision highp float;
in vec3 vCol;
in float vR;
out vec4 o;
void main() {
  float dist = length(gl_PointCoord - 0.5) * (ceil(2.0 * vR) + 2.0);
  float a = clamp(vR + 0.5 - dist, 0.0, 1.0) * min(1.0, 2.0 * vR);
  if (a <= 0.0) discard;
  o = vec4(vCol * a, a);
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
  const starProgram = program(gl, VERT_STARS, FRAG_STARS);
  // Round 8 (B1): the star field's buffers. Its look is uploaded when the field is made; offsets only when they change.
  const starVao = gl.createVertexArray(), starLook = gl.createBuffer(), starOff = gl.createBuffer(), starFlag = gl.createBuffer();
  gl.bindVertexArray(starVao);
  gl.bindBuffer(gl.ARRAY_BUFFER, starLook);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 20, 0);
  gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 20, 8);
  gl.bindBuffer(gl.ARRAY_BUFFER, starOff);
  gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, starFlag);
  gl.enableVertexAttribArray(3); gl.vertexAttribPointer(3, 1, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);
  let starLookVersion = -1, starOffVersion = -1, starCountNow = 0;

  // Rounded pieces keep the dense mesh; sharp boxes need only the face and bevel angles.
  function mesh(oct) {
    const around = angles(4, -Math.PI, oct), up = angles(2, -Math.PI / 2, oct), nu = around.length, nv = up.length;
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

    return { vao, count: idx.length };
  }
  const roundMesh = mesh(OCT), sharpMesh = mesh([0, 0.9, 0.98, 0.995]);
  let boundMesh = null;

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

  // One texture per atlas page. A draw binds only when its picture changes page.
  let atlasTextures = [], places = {}, boundPage = -1;
  function setAtlas(atlas) {
    atlasTextures.forEach(tex => gl.deleteTexture(tex));
    places = atlas.places;
    const aniso = gl.getExtension('EXT_texture_filter_anisotropic');
    atlasTextures = atlas.pages.map(canvas => {
      const tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, 3);
      if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(4, gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
      return tex;
    });
    boundPage = -1;
  }
  const whole = [0, 0, 1, 1], noClip = [0, 0, 0, 1], noTaper = [0, 0];
  const colourCache = new Map();
  const colour = value => { if (!colourCache.has(value)) colourCache.set(value, hex(value)); return colourCache.get(value); };

  const setPiece = (u, pc, grow) => {
    gl.uniform3fv(u.uPos, pc.p); gl.uniform4fv(u.uQuat, pc.q);
    gl.uniform3f(u.uSize, Math.max(pc.s[0], 1e-4), Math.max(pc.s[1], 1e-4), Math.max(pc.s[2], 1e-4));
    gl.uniform2f(u.uExp, Math.max(pc.e[0], 0.012), Math.max(pc.e[1], 0.012));
    gl.uniform2fv(u.uTaper, pc.taper || noTaper); gl.uniform1f(u.uShear, pc.shear || 0); gl.uniform1f(u.uGrow, grow);
    gl.uniform4fv(u.uClip, pc.clip || noClip);
    const place = pc.art && places[pc.art];
    if (place && boundPage !== place[0]) {
      boundPage = place[0]; gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, atlasTextures[boundPage]);
    }
    if (u.uArtMode) {
      gl.uniform1f(u.uArtMode, place ? (pc.cut ? 2 : 1) : 0);
      if (u.uArtShade) gl.uniform1f(u.uArtShade, pc.shade ? 1 : 0);
      if (place) { const w = pc.window || whole; gl.uniform4f(u.uArt, place[1] + w[0] * place[3], place[2] + w[1] * place[4], (w[2] - w[0]) * place[3], (w[3] - w[1]) * place[4]); }
    }
  };
  const drawAll = (prog, pieces, grow, tone, skip) => {
    for (const pc of pieces) {
      if (pc.hide || (skip && pc[skip])) continue;
      const mesh = Math.max(pc.e[0], pc.e[1]) > 0.06 ? roundMesh : sharpMesh;
      if (mesh !== boundMesh) { gl.bindVertexArray(mesh.vao); boundMesh = mesh; }
      setPiece(prog.u, pc, typeof grow === 'function' ? grow(pc) : grow);
      if (prog === depth && pc.shadowP) gl.uniform3fv(prog.u.uPos, pc.shadowP);
      if (tone) tone(prog.u, pc);
      gl.drawElements(gl.TRIANGLES, boundMesh.count, gl.UNSIGNED_SHORT, 0);
    }
  };

  const solid = [], cuts = [];

  // view: { W, H (css px), dpr, S (px per unit), cx, cy (px), cam: { r, u, v } }
  // look: { light: [x, y, z], outline (units), soft, spread, floor: { on, x, z, radius, pitch, reveal }, centre: [x, y, z] of the lit volume, reach,
  //         reveal: [a, b, c, d] one more clip plane for every piece (the entrance) }
  function draw(pieces, view, look = {}) {
    const { W, H, dpr = 1, S, cx, cy, cam } = view;
    const L = norm(look.light || [-0.3, 0.55, 0.78]), outline = look.outline ?? 0.035, soft = look.soft ?? 0, spread = look.spread ?? 1;
    const C = look.centre || [0, 2.2, 0], reach = look.reach || 7, reveal = look.reveal || noClip;
    const width = Math.round(W * dpr), height = Math.round(H * dpr);
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;

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
    boundMesh = null; boundPage = -1;

    // 1. depth from the light
    gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFbo); gl.viewport(0, 0, shadowSize, shadowSize);
    gl.clearDepth(1); gl.clear(gl.DEPTH_BUFFER_BIT);
    solid.length = cuts.length = 0;
    for (const pc of pieces) (pc.cut ? cuts : solid).push(pc);
    gl.useProgram(depth.p); gl.uniformMatrix4fv(depth.u.uVP, false, lvp); gl.uniform1i(depth.u.uAtlas, 1); gl.uniform4fv(depth.u.uReveal, reveal);
    gl.cullFace(gl.FRONT);
    drawAll(depth, solid, 0, null, 'noShadow');
    gl.disable(gl.CULL_FACE);
    drawAll(depth, cuts, 0, null, 'noShadow');
    gl.enable(gl.CULL_FACE);

    // 2. the picture
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, canvas.width, canvas.height);
    const ink = hex(look.bg || INK);
    gl.clearColor(ink[0], ink[1], ink[2], 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, shadowTex);

    // Round 8 (B1): the star field first, behind everything; one draw call, no depth. Round 9 (L1): captured stars are left out
    // here and drawn by a second pass after the scene, only while any is out.
    const starPass = pass => {
      const st = look.stars;
      gl.disable(gl.DEPTH_TEST); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.bindVertexArray(starVao); boundMesh = null;
      if (st.attrsVersion !== starLookVersion || st.count !== starCountNow) {
        gl.bindBuffer(gl.ARRAY_BUFFER, starLook); gl.bufferData(gl.ARRAY_BUFFER, st.attrs, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, starOff); gl.bufferData(gl.ARRAY_BUFFER, st.offsets.byteLength, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, starFlag); gl.bufferData(gl.ARRAY_BUFFER, st.count * 4, gl.DYNAMIC_DRAW);
        starLookVersion = st.attrsVersion; starCountNow = st.count; starOffVersion = -1;
      }
      if (st.version !== starOffVersion) {
        gl.bindBuffer(gl.ARRAY_BUFFER, starOff); gl.bufferSubData(gl.ARRAY_BUFFER, 0, st.offsets);
        gl.bindBuffer(gl.ARRAY_BUFFER, starFlag); if (st.flags) gl.bufferSubData(gl.ARRAY_BUFFER, 0, st.flags);
        starOffVersion = st.version;
      }
      gl.useProgram(starProgram.p);
      gl.uniform1f(starProgram.u.uPass, pass); gl.uniform1f(starProgram.u.uMarkSize, st.markSize || 2);
      gl.uniform2f(starProgram.u.uSize, W, H); gl.uniform1f(starProgram.u.uDpr, dpr); gl.uniform1f(starProgram.u.uScroll, st.scroll || 0);
      gl.uniform2fv(starProgram.u.uPar, st.par || [0, 0]);
      gl.uniform3f(starProgram.u.uRings, st.centre?.[0] ?? 0, st.centre?.[1] ?? 0, st.reveal === null || st.reveal === undefined ? 1e9 : st.reveal);
      gl.uniform3fv(starProgram.u.uInk, ink); gl.uniform3fv(starProgram.u.uPaper, hex('#F7F6F3')); gl.uniform3fv(starProgram.u.uRedInk, hex('#F0484F'));
      gl.uniform2f(starProgram.u.uMix, 0.12, 0.55);
      gl.drawArrays(gl.POINTS, 0, st.count);
      gl.bindVertexArray(null); gl.disable(gl.BLEND); gl.enable(gl.DEPTH_TEST);
    };
    if (look.stars && look.stars.count) starPass(0);

    gl.cullFace(gl.BACK);
    gl.useProgram(piece.p);
    gl.uniformMatrix4fv(piece.u.uVP, false, vp); gl.uniformMatrix4fv(piece.u.uLightVP, false, lvp);
    gl.uniform1i(piece.u.uShadow, 0); gl.uniform1i(piece.u.uAtlas, 1);
    gl.uniform4fv(piece.u.uReveal, reveal);
    gl.uniform3fv(piece.u.uLight, L); gl.uniform1f(piece.u.uSoft, soft); gl.uniform1f(piece.u.uSpread, spread);
    const tones = (u, pc) => {
      const t = pc.tones || TONES[pc.tone] || TONES.paper;
      gl.uniform3fv(u.uA, typeof t[0] === 'string' ? colour(t[0]) : t[0]); gl.uniform3fv(u.uB, typeof t[1] === 'string' ? colour(t[1]) : t[1]); gl.uniform3fv(u.uC, typeof t[2] === 'string' ? colour(t[2]) : t[2]);
    };
    drawAll(piece, solid, 0, tones);
    gl.disable(gl.CULL_FACE);
    drawAll(piece, cuts, 0, tones);
    gl.enable(gl.CULL_FACE);

    if (outline > 0) {
      gl.cullFace(gl.FRONT);
      gl.useProgram(flat.p); gl.uniformMatrix4fv(flat.u.uVP, false, vp); gl.uniform4fv(flat.u.uReveal, reveal); gl.uniform3fv(flat.u.uA, hex(look.line || INK));
      drawAll(flat, solid, pc => outline * (pc.line ?? 1), null, 'noLine');
      gl.cullFace(gl.BACK);
    }

    if (look.floor && look.floor.on !== false) {
      const f = look.floor;
      gl.bindVertexArray(fvao); gl.useProgram(floor.p); gl.disable(gl.CULL_FACE);
      gl.uniformMatrix4fv(floor.u.uVP, false, vp); gl.uniformMatrix4fv(floor.u.uLightVP, false, lvp); gl.uniform1i(floor.u.uShadow, 0); gl.uniform1f(floor.u.uSpread, spread);
      gl.uniform3fv(floor.u.uInk, ink); gl.uniform3fv(floor.u.uPool, hex(f.pool || '#262323')); gl.uniform3fv(floor.u.uDot, hex(f.dot || '#4A4543'));
      gl.uniform4f(floor.u.uFloor, f.x ?? 0, f.z ?? 0, f.radius ?? 5.5, f.pitch ?? 0.5);
      gl.uniform1f(floor.u.uReach, f.reveal ?? 1e6);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.disable(gl.BLEND);
      gl.enable(gl.CULL_FACE);
    }
    // Round 9 (L1): the captured stars, in front of the scene's pieces from capture until home.
    if (look.stars && look.stars.count && look.stars.front > 0) starPass(1);
    gl.bindVertexArray(null);
  }
  return { gl, draw, setAtlas };
}
