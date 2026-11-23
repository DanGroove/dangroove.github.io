# Journey map: depth, the space around the map, and a supernova that keeps burning

Read this whole file before writing anything. Then read `main.mjs`, `trip.mjs`, `stars.mjs`, `cards.mjs`, `footer.mjs`, `steps.mjs`, `join.mjs`, `data.mjs`, `map.css`, `join.css` and `art.mjs`. `STEPS.md`, `STEPS-BUILD.md` and `JOIN-BUILD.md` say how the page works today.

## 1. Why

Dan, on the preview, 22 and 23 November:

- "yes i like this first draft, lets make the experience have more depth though". He then agreed to a sense of space: the map in layers at different distances, a dive through cloud in place of a plain zoom, a light on the traveller, cards that lift off the map.
- "the space outside the map also feels too empty"
- "the super nova at the end is too static"

So this round does three things.

1. **Depth.** Layers under and over the ground move at different rates as the camera moves and as the pointer moves. The dive from the whole map to the first stop passes through cloud. The traveller carries a light. Cards lift off the map.
2. **The space around the chart.** Part of the starry sky stays around the map, the sea runs on past the frame, and clouds hang over both.
3. **The supernova.** It keeps moving after the blast and it answers a press.

The things you can play with on the map (the finds) are a later round. Do not change them here.

## 2. Hard rules

The sandbox on this machine is off, so these matter.

- Change files only inside `design/journey-map/`, and only these:
  - `data.mjs`, `main.mjs`, `trip.mjs`, `stars.mjs`, `cards.mjs`, `footer.mjs`, `steps.mjs`, `join.mjs`, `map.css`, `join.css`, `tools/check.mjs`
  - `art.mjs`: add new exported drawings only (section 8). Change nothing that is in it now.
  - new: `depth.mjs`, `tools/depth-test.mjs`, `DEPTH-BUILD.md`
  - written by the pack tools: `joined.html`, `dist/journey-map.html`, `dist/journey-joined.html`
- Never change anything in `hero-copy/`, `reference/` or `assets/`. Never change `BRIEF.md`, `JOIN.md`, `STEPS.md`, `DEPTH.md`, `BUILD.md`, `JOIN-BUILD.md`, `STEPS-BUILD.md`, `finds.mjs`, `timeline.mjs`, `pace.mjs` or `index.html`. Change `tools/pack.mjs` or `tools/pack-joined.mjs` only if packing fails without it, and say why in your report.
- Never touch any other path on the machine. Never run git. Never install anything. No network access, at build time or at run time.
- Do not start reviewer agents or sub-agents, even if your global instructions say to. The review happens elsewhere, in a real browser. Do not leave a server running. Do not claim a visual check you did not make.
- You may run `node` on files inside `design/journey-map/`.
- Module style, as now (`tools/check.mjs` enforces it): named exports and named imports only, each import on one line from a sibling file, no default exports, no dynamic imports, no top-level await, every top-level name unique across all modules, no colour literal outside `data.mjs`, no colour literal in `map.css`. Every line of copy and every number that shapes a look or a timing lives in `data.mjs`.
- Colours: only the ones in `C`. Paper for everything light, Ink for everything dark. Red stays reserved for the traveller, the X, the find markers and the playhead. The warm orange (`C.warm`) is used only in the supernova, as now.
- Drawings are in the map's own line style: Ink fill, a Paper line of the map's weight (the `o`, `g`, `l`, `t`, `pf` classes). No photos, no textures, no gradients on drawings. Soft things (mist, light, glow) are the only gradients.
- An animation always moves the thing that is already there. Nothing is swapped for a copy.
- Reduced motion (`prefers-reduced-motion: reduce`) keeps today's stacked page. Section 12 says the little it gets.
- Performance: change only `transform` and `opacity` on DOM elements in the frame loop. No layout reads in the frame loop. No animated `filter`, no SVG filter on anything new. Canvases redraw only when something they show has changed.

## 3. The depth model

One model places every layer. It lives in the new `depth.mjs`, whose top level touches neither `window` nor `document`, so Node can import its pure helpers.

**The camera's anchor.** `trip.mjs` builds each camera with an anchor (`ax`, `ay`), the point on screen the camera turns about, and drops it in `camFinal`. Keep it: `st.cam` becomes `{ s, tx, ty, ax, ay }`.

**Lift.** How far apart the layers stand, from how far the camera has come down:

```js
z = (st.cam.s - VIEW.s0) / (VIEW.sT - VIEW.s0)     // 0 at the whole map, 1 at travelling height, about 1.5 at a stop
lift = max(0, DEPTH.base + DEPTH.gain * z)
```

At the whole map this is almost nothing, so the chart reads as a flat drawing. It grows as the camera comes down, so the drawing becomes a place. Measuring against the travelling height makes phones and desktops behave alike.

**A layer's factor.** Every layer has a height `a`. The ground is 0, things under it are negative, things over it are positive.

```js
k = max(0.05, 1 + a * lift)
```

**Placing a point.** For a point `p` in map units on a layer of height `a`:

```js
V = [st.cam.ax + look[0], st.cam.ay + look[1]]     // the vanishing point
g = toScreen(st, p)                                 // where the ground puts it
screen = [V[0] + (g[0] - V[0]) * k, V[1] + (g[1] - V[1]) * k]
size on screen = size in map units * st.cam.s * k
```

**Look.** `look` follows the pointer: its target is `((px - 0.5) * 2 * DEPTH.look, (py - 0.5) * 2 * DEPTH.look)` with `px`, `py` the pointer as shares of the view. It eases to the target with `look += (target - look) * (1 - exp(-dt / DEPTH.lookEase))`. It exists only where `matchMedia('(hover: hover) and (pointer: fine)')` matches. Elsewhere it is `[0, 0]`. The ground itself (the map's own `<svg>`, the star canvas's trail and sea, the stones) never moves with the pointer, so nothing under a finger or a cursor slides away.

**Passing a layer.** A layer over the ground is passed when the camera comes down through it. Each such layer names two windows of `k`: `show` (it fades in across this) and `pass` (it fades out across this). Its visibility is `smooth(show[0], show[1], k) * (1 - smooth(pass[0], pass[1], k))`.

**The table.** Add to `data.mjs`. These are starting values and will be tuned in the browser, so read them from the table every frame and never copy them into constants.

```js
export const DEPTH = {
  base: 0.045, gain: 0.55,        // lift at the whole map, and what coming down to travelling height adds
  look: 26, lookEase: 0.22,       // px the vanishing point follows the pointer; seconds
  idleFps: 12,                    // how often drifting things redraw when nothing else moves
  arc: 0.26, arcLen: 160,         // how far the camera rises on a leg, as a share of its zoom; the leg length (vh) that gets all of it
  rings: { on: 1, scale: [1.05, 1.10, 1.16], a: [-0.12, -0.24, -0.36], alpha: [0.55, 0.36, 0.2], colour: 'mid' },
  outer: { on: 1, cell: [86, 64], fill: 0.55, alpha: [0.3, 0.12], fade: 420, rays: 0.05 },
  light: { on: 1, dark: 0.45, darkPhone: 0.25, r: 0.55, core: 0.35, ptrR: 0.3, ptrCore: 0.3, amb: 0.35, card: 0.6, visit: 0.35 },
  mist: { on: 1, n: 120, nPhone: 60, a: [0.5, 1.8], r: [14, 36], stretch: [2.2, 3.4], turn: 0.2, alpha: [0.06, 0.14], near: [0.12, 0.42], thin: 0.35, show: [1.1, 1.3], pass: [2.4, 3.4], wind: 2.2 },
  deck: { on: 1, n: 60, nPhone: 34, a: [6.5, 11], r: [50, 120], stretch: [1.6, 2.6], alpha: 0.07, boost: 6, show: [1.6, 1.9], peak: [1.8, 2.3], pass: [2.3, 3.0] },
  clouds: { on: 1, show: [0.3, 0.8], pass: [2.0, 2.9], sway: [14, 26], period: [50, 90],
    // [x, y, size, drawing 1 to 3, flip, a]
    list: [[-150, 150, 1.5, 3, 1, 7.0], [-250, 520, 1.1, 1, -1, 6.4], [-90, 800, 0.9, 2, 1, 7.6], [760, 110, 1.2, 1, 1, 6.8], [860, 430, 1.6, 3, -1, 7.4],
           [720, 760, 1.0, 2, -1, 6.2], [30, 330, 0.8, 2, 1, 8.2], [575, 690, 0.8, 2, -1, 8.0], [300, -30, 1.3, 3, 1, 7.2], [330, 935, 1.2, 1, -1, 6.6]] },
  ravens: { on: 1, a: 2.2, size: 0.65, legs: [2, 4], from: 0.12, to: 0.88, side: 90, gap: 26, flap: 0.9, fold: 0.62 },
  card: { tilt: 14, ptrTilt: [2.2, 1.6], shift: 8, shadow: 0.5, drop: 18, ease: 0.12 },
  foot: { stars: 0.5, lobes: 0.25, text: 0.15 },   // how far the footer's layers follow `look`
};
```

`rings.colour` names a key of `C`.

## 4. The layers

In `.stage`, bottom to top. The three new ones are built in `depth.mjs`.

| Element | What it holds |
|---|---|
| `<canvas id="deep">` (new) | under the map: depth rings in the sea, the sea beyond the frame |
| `<svg id="map">` | the map, as now |
| `<canvas id="stars">` | the stars, as now, and the sky that stays (section 6) |
| `<canvas id="air">` (new) | the light, the mist, the cloud you dive through |
| `<svg id="sky">` (new) | clouds and ravens, drawn in line |
| `.ov` | cards, mini-map, popups, footer, timeline, as now |

- All three new elements are `position: absolute; inset: 0`, `pointer-events: none` and `aria-hidden="true"`. They fill the stage. Size `#sky` on resize the way the map's `<svg>` is sized: `width`, `height`, and a `viewBox` of the view in px.
- `#deep` is drawn at `min(2, devicePixelRatio)`. `#air` is drawn at 1, whatever the screen: everything on it is soft.
- On the joined page the hero is layer 1 and the star canvas layer 2. Give `#air` and `#sky` layer 2 as well (they come later in the DOM, so they sit above the stars), and keep the overlay at 3, the jump cover at 4, the stepper at 5. `#deep` has no layer of its own and sits under the map.
- While a card is open the map and the star canvas dim to `st.dim`. `#deep` and `#sky` take the same opacity. On `#air` the mist is multiplied by `st.dim`. The light is handled in section 7.
- Everything new fades in with the sea during the hand-off and out with the blast, with the same curves `tripApply` uses for `#b-sea`, unless its own section says otherwise. Nothing new shows while the hero is in view.

## 5. Under the map (`#deep`)

**Depth rings.** Each island gets three rings in the water around it, like the depth lines of a sea chart.
- Take `COAST_A` and `COAST_B`. For each, find the centroid of its points. Ring `j` is the coast scaled about that centroid by `rings.scale[j]`, placed on a layer of height `rings.a[j]`.
- Stroke 1 px, the colour `C[rings.colour]`, opacity `rings.alpha[j]`. The outermost ring is dashed `2 5`.
- Clip to the chart's inner frame: the rectangle from `[22, 22]` to `[578, 878]` in map units, placed by `toScreen` (the ground).
- The land in the map's `<svg>` is opaque, so the rings show only in the water. As the camera moves they slide under the coast. That is the point.

**The sea beyond the frame.** Today the chart sits in bare Ink. The sea continues.
- Waves: a jittered grid over `x` from -1000 to 1600 and `y` from -200 to 1100 (map units), cells of `outer.cell`, each cell filled with probability `outer.fill`, seeded with `rnd` so it never changes. Each wave is the map's own wave mark, `M x y q2.5 -3 5 0 t5 0 t5 0`: three half-waves in a row, up, down, up, 15 units wide and 1.5 high. Stroke it Paper, 0.7 px. Skip any whose start is inside the chart's outer frame (`[14.5, 14.5]` to `[585.5, 885.5]`). Opacity runs from `outer.alpha[0]` at the frame to `outer.alpha[1]` at `outer.fade` map units from it. Draw only the ones on screen.
- Rhumb lines: the chart draws sixteen rays from the wayfinder at `[92, 716]`, at angles `i * PI / 8 + 0.2`, clipped to its frame. Draw the same sixteen rays on from the frame to 1600 units out, Paper at `outer.rays`, 0.7 px, clipped to everything outside the chart's outer frame.
- Both are on the ground (height 0), so they move exactly with the map.

Redraw `#deep` when the frame moved or `look` changed.

## 6. The sky that stays (`stars.mjs`)

Today every star falls into the map and the space around the chart goes black. From now on part of the sky stays where it is, as the night around the map. This is the most delicate file in the page: the joined page hands the real hero's stars over to this canvas. Change only what this section names.

**Which stars stay.**
- Stand-in page (`starsBuild`): add `STARS.sky` more stars (start at 300) of a new kind, `sky`. They are made like the others (place, depth, size, alpha, red share) and are part of the stand-in hero's field.
- Joined page (`heroList`): before the trail, sea and coast places are given out, choose the sky. Candidates are hero stars, other than the traveller, drawn at least 10 px outside the chart's outer frame as it sits at the whole map (from `VIEW.s0`, `VIEW.ox`, `VIEW.oy`). Shuffle them with the seeded `r` and keep `min(candidates, floor(N * STARS.skyShare))` (start `skyShare` at 0.38), but never so many that fewer than `trail dots + sea points + 200` stars are left to fall. The rest fall as now: trail dots, sea, coasts. On small phones nothing stays, which is fine.

**How a sky star is drawn.**
- Through the hero act it is drawn exactly like every other star, so the stand-in hero and the joined page's hand-over look as they do now. At the switch on the joined page (progress 99 to 100) every hero star must still be drawn exactly where and how it is drawn today.
- From the start of the fall it simply stays. On the joined page that is its last drawn place from the hero. On the stand-in page the field's sideways drift must stop with the fall: replace the use of `time` in `heroPos` by a drift clock kept in `SK` that advances by `dt * (1 - smooth(0, 1, handoffT))`. That holds for every star of the stand-in field.
- Two small movements are added, both scaled by `smooth(0, 0.3, handoffT)` so nothing jumps at the switch: it follows `look` by `look * z * STARS.skyLook` (start 0.5), and it follows the camera by `(c - c0) * STARS.skyFollow` (start 0.04), where `c` is where the centre of the map (`[MAP.w / 2, MAP.h / 2]`) is on screen now and `c0` where it is at the whole map. So the sky moves the way the map moves, a twenty-fifth as far, as something very far away would.
- Twinkle: its opacity is multiplied by `1 - STARS.twinkle * (0.5 + 0.5 * sin(time * f + phase))`, with `twinkle` starting at 0.35 and each star its own `f` between 0.5 and 1.6 and its own phase.
- Colour: Red until half way through the fall, Paper after, the same rule the other stars follow.
- Hidden by the chart: a sky star inside the chart's outer frame (placed by `toScreen` now) is not drawn once the land has formed. Multiply its opacity by `1 - smooth(0.25, 0.75, handoffT)` while it is inside, and ramp from 0 at the frame's edge to full 14 px outside it. So as the chart grows in the dive, it slides over the sky.
- The rush leaves the sky alone. In the blast a shock passes through it: with `d` its distance from the X on screen and `R` the radius of the blast's ring (the same value `footer.mjs` uses), push it outward by `STARS.skyPush * exp(-((d - R) / 90) ** 2)` px (start `skyPush` at 26) and brighten it by the same bump. It settles back as the ring moves on.
- In the footer the sky stays, twinkling.

**When the star canvas redraws.** Today it redraws when the frame moved, during the hand-off, or when the join asks. Add: while `look` is still easing, and at most `DEPTH.idleFps` times a second while any sky is on screen (for the twinkle). Skip the idle redraw when the chart's frame covers the whole view. A `false` from `JOIN.frame` still wins: before the switch the canvas is left alone.

Reduced motion: sky stars are drawn at rest like any star, with no twinkle.

## 7. Over the map: the light and the mist (`#air`)

Drawn in this order, bottom to top. Redraw `#air` when the frame moved, when `look` changed, or at `DEPTH.idleFps` while mist is drifting on screen.

**7.1 The light.** The traveller carries a light, and the pointer carries a smaller one.
- A veil: fill the canvas with Ink at opacity `dark * smooth(0, 1, st.pushT) * (1 - light.card * st.cardOpen) * (1 - smooth(0, 0.5, st.rushT))`. `dark` is `light.dark`, or `light.darkPhone` on phones. While the page is visiting a find (section 12) multiply by `light.visit`.
- Then cut two soft holes with `globalCompositeOperation = 'destination-out'`, each a radial gradient that is opaque to `core * R` and falls to nothing at `R`:
  - at the traveller (`toScreen(st, st.trav)`), with `R = light.r * min(w, h)` and `core = light.core`;
  - at the pointer, only where `look` exists, with `R = light.ptrR * min(w, h)` and `core = light.ptrCore`.
- So the map is clear around the traveller and around the pointer, and falls off to dusk between. Moving the pointer is a way to look around. The whole map (before the dive) is evenly lit.
- Keep a function `lightAt(x, y)` that returns how lit a screen point is. With `hole` the larger of the two holes' values at that point (0 to 1) and `v` the veil's opacity now as a share of `dark` (0 to 1): `lightAt = 1 - v * (1 - light.amb) * (1 - hole)`. So it is 1 everywhere while there is no veil, and `light.amb` in full dusk. The mist uses it.

**7.2 The low mist.** Thin wisps close over the ground. They are what makes travel read as flight: they pass faster than the land.
- Make one soft sprite once: a 128 px offscreen canvas with a radial gradient of Paper, opacity 1 at the centre, 0.5 at 40 %, 0 at the edge.
- `mist.n` wisps (`mist.nPhone` on phones), seeded, never changing. Each has a place in map units over `x` -100 to 700 and `y` -50 to 950, a height in `mist.a`, a radius in `mist.r` (map units), a stretch in `mist.stretch` (width over height), a turn of up to plus or minus `mist.turn` radians, and an opacity in `mist.alpha`.
- Wind: each wisp's `x` advances by `mist.wind * (0.5 + its height)` map units a second and wraps from 700 back to -100. Fade it over the last 60 units before the wrap and the first 60 after.
- Draw each with `drawImage` of the sprite, placed and sized by section 3. Its opacity is its own, times its layer's visibility (`mist.show`, `mist.pass`), times `lightAt` at its centre, times `st.dim`, times a thinning near the traveller: `mist.thin + (1 - mist.thin) * smooth(mist.near[0], mist.near[1], d / min(w, h))` with `d` its distance from the traveller on screen. The trail under the traveller stays readable.
- Skip the ones off screen.

**7.3 The cloud you dive through.** Between the whole map and the first stop the camera comes down through a layer of cloud.
- `deck.n` large wisps (`deck.nPhone` on phones), made like the mist's, with heights in `deck.a`, radii in `deck.r`, stretches in `deck.stretch`, over the same area. No wind.
- Opacity of each: `deck.alpha * (1 + deck.boost * smooth(deck.peak[0], deck.peak[1], k))`, times its visibility from `deck.show` and `deck.pass`. So it is nothing at the whole map, thickens as the camera nears it, whites much of the view at its thickest, and is gone as the camera passes below it. It is not dimmed by the light.
- With the starting values this happens once, in the first two thirds of the dive, and again in reverse on the way back up. It must never show on a leg between stops: `tools/depth-test.mjs` checks that (section 13).

## 8. Over the map: clouds and ravens (`#sky`)

Drawn as SVG so the lines are as crisp as the map's. Add the drawings to `art.mjs` as new exports and build `#sky` from them. Use the map's classes: `o` (Ink fill, Paper line) for bodies, `t` for the thin inner lines, `pf` for a Paper fill. Every stroke already has `vector-effect: non-scaling-stroke` through those classes, so lines keep the map's weight at any size.

**The three clouds** (origin at the cloud's middle, about 120 to 200 units wide at size 1):

```js
// 1
body  'M-52 12Q-64 12 -62 2Q-62 -9 -48 -9Q-46 -23 -29 -22Q-21 -35 -4 -30Q8 -41 23 -30Q38 -33 43 -18Q58 -17 56 -3Q62 10 50 12Z'
inner 'M-34 -5Q-26 -14 -15 -8M5 -15Q15 -23 26 -14M-8 3Q0 -3 9 2'
wisps 'M-78 20H-36M-24 26H34M48 20H80'
// 2
body  'M-40 10Q-52 10 -50 0Q-50 -10 -37 -9Q-34 -24 -17 -21Q-8 -33 8 -25Q22 -30 29 -16Q44 -16 42 -2Q46 10 36 10Z'
inner 'M-24 -6Q-16 -14 -6 -8M8 -12Q16 -18 24 -11'
wisps 'M-62 18H-22M-10 23H30M40 17H64'
// 3
body  'M-70 12Q-82 12 -80 3Q-79 -7 -66 -6Q-64 -19 -48 -17Q-40 -31 -23 -25Q-12 -38 5 -30Q18 -42 34 -31Q48 -35 54 -21Q68 -22 69 -9Q82 -8 80 3Q82 12 72 12Z'
inner 'M-52 -3Q-44 -12 -33 -6M-12 -14Q-3 -23 9 -15M30 -16Q39 -23 48 -15M-22 4Q-13 -3 -3 3M20 2Q28 -4 37 2'
wisps 'M-98 20H-52M-40 27H42M56 20H100'
```

`body` takes class `o`. `inner` and `wisps` take class `t`.

- One `<g>` per row of `DEPTH.clouds.list`: `[x, y, size, drawing, flip, a]`. Each frame set one `transform` on it: `translate(screen) scale(flip * size * st.cam.s * k, size * st.cam.s * k)`, with `screen` and `k` from section 3 for its place and height.
- Sway: its `x` moves by `sway * sin(2 * PI * time / period + phase)` map units, with its own `sway` in `clouds.sway`, `period` in `clouds.period` (seconds) and phase, all seeded. Clouds never drift away from their places.
- Opacity: `smooth(clouds.show[0], clouds.show[1], st.handoffT)`, times `1 - smooth(clouds.pass[0], clouds.pass[1], k)`, times the blast's fade. So at the whole map they hang around and over the chart, they answer the pointer, and in the dive they grow, sweep outward past the edges and are gone.
- Hide a group (`display: none`) while its opacity is 0. Update transforms when the frame moved or `look` changed, and at `DEPTH.idleFps` for the sway.

**The ravens.** Two ravens, seen from above, cross over the trail on two of the legs.

```js
wing 'M1.6 -3Q8 -8.4 15 -6.6L20 -4.4L16.8 -3.6L19.2 -1.8L15.8 -1.7L17.4 .2L13.6 -.4Q8 1.8 1.6 2.4Z'   // the right wing; mirror it for the left
tail 'M-1.8 6L-2.7 11.2L0 13.4L2.7 11.2L1.8 6Z'
body 'M0 -10Q2.7 -7 2.2 -1Q2.4 5 0 8Q-2.4 5 -2.2 -1Q-2.7 -7 0 -10Z'
beak 'M-.8 -9.4L0 -13.2L.8 -9.4Z'
```

Wings, tail and body take class `o`, the beak class `pf`. Draw order: wings, tail, body, beak. The bird points up (toward negative `y`) and is 40 units across.

- They fly on the legs whose index is in `ravens.legs` (`seg.i` of a `leg`), from `ravens.from` to `ravens.to` of that leg's `t`.
- The path, in map units: let `A` and `B` be the leg's two stops and `M` their midpoint, `d` the unit vector from `A` to `B` and `n` its left normal. The first raven flies from `M - d * L / 2 + n * side` to `M + d * L / 2 - n * side`, with `L` the distance from `A` to `B`. So it crosses the trail from one side to the other, going the traveller's way. The second flies the same line `ravens.gap` units behind and to the side.
- Height `ravens.a`, size `ravens.size`, placed and sized by section 3. It turns to face along its path on screen.
- Wings: scale both wings in `x` between `ravens.fold` and 1 by `0.5 + 0.5 * sin(P * ravens.flap)`, with `P` the page's progress. So they beat as the trip advances and hold still when it rests.
- Opacity ramps in over the first tenth of the flight and out over the last.

## 9. The camera rises between stops (`trip.mjs`)

On a leg the camera lifts and comes down again, like a hop.

```js
arc = VIEW.depth ? DEPTH.arc * min(1, seg.len / DEPTH.arcLen) * sin(PI * st.t) ** 2 : 0
cam = camTrip(st.u, 1 - arc)
```

For `leg` and `legX`. The square keeps the speed of the zoom at zero at both ends, so there is no kink where a hold meets a leg. `VIEW.depth` is a new key of `VIEW`, 1 at the start, set to 1 or 0 by the switch in section 12. Nothing else in `tripState` changes, and with `VIEW.depth` at 0 it returns exactly what it returns today (plus `ax`, `ay`).

## 10. Cards lift off the map (`cards.mjs`, `map.css`)

Desktop only (not `VIEW.phone`), and only while depth is on.

- `.stop` gets `perspective: 1100px`.
- Add one empty element, `.c-sh`, before `.face` in each stop: the card's shadow. It is the card's box drawn in `C.shade` with a wide soft edge made by `box-shadow`, never by `filter`. It takes `transform` and `opacity` only.
- As a card opens (`e` from 0 to 1) its face tips up to meet the viewer: `rotateX(card.tilt * (1 - smooth(0.1, 0.9, e)))` degrees, about its own centre. The shadow's opacity is `card.shadow * e` and it drops by `card.drop * e` px.
- While a card is open and `look` exists, the card answers the pointer like a plate: `rotateY(lx * card.ptrTilt[0]) rotateX(-ly * card.ptrTilt[1])` degrees with `lx`, `ly` the look as shares from -1 to 1, and it shifts by `-lx * card.shift`, `-ly * card.shift` px, against the pointer, as the nearest thing in view. The shadow shifts a third as far the other way. While the pointer is inside the card's box the tilt eases back to flat, so the card is flat while it is read. Ease the tilt with `card.ease` per frame.
- When the tilt is under 0.01 degrees write no rotation at all, so the text is drawn sharp.
- The stone, the buttons and the focus order do not change.

## 11. The supernova keeps burning (`footer.mjs`, `stars.mjs`)

Today the blast settles into a still glow, two still rings and still stars. From the blast on, it should never be still. All of this is skipped under reduced motion.

Add to `data.mjs`:

```js
export const NOVA = {
  pulse: [3.4, 0.05, 1.3, 0.025],   // the core breathes: a slow period (s) and share, a quick period and share
  spike: [2.2, 0.08],               // the spikes lengthen and shorten: period, share
  glow: [5.2, 0.025],               // the big glow breathes
  rays: { n: 14, len: [3, 7], alpha: [0.1, 0.2], turn: 0.035 },             // a fan of thin rays behind the core; radians a second
  lobes: { n: 6, nPhone: 4, r: [120, 260], orbit: [40, 170], speed: [0.02, 0.06], alpha: [0.16, 0.34], breathe: 0.08 },
  waves: { n: 3, every: 3.6, reach: 0.7, alpha: 0.22 },                     // rings that keep leaving the core
  shells: [1.2, -0.8],                                                       // the two faint rings turn: degrees a second
  orbit: 0.012, embers: { n: 24, nPhone: 12, life: [4, 7], reach: [0.12, 0.34], alpha: 0.8 },
  flare: { time: 1.6, core: 0.5, kick: 0.12, hit: 70 },
};
```

Sizes in px are of the screen. `reach` values are shares of the longer side of the view.

**In the X's group (`footerBuildX`), new elements, all quiet until the blast:**
- `fx-rays`: a group of `rays.n` thin Paper lines from just outside the core to `rays.len` core radii out, each with its own length and opacity in the ranges, seeded. The group turns by `rays.turn`. Each ray's opacity also breathes with its own phase.
- `fx-lobe` (`lobes.n`, fewer on phones): soft discs filled with the existing `rglow` and `oglow` gradients in turn. Each orbits the core at its own radius, speed and direction, and breathes in size by `lobes.breathe`. They sit above the two big glows and under the rings. They make the cloud around the star uneven and alive.
- `fx-wave` (`waves.n`): thin Paper rings that leave the core one after another, one every `waves.every` seconds, grow to `waves.reach` and fade as they go. They are always the same three elements, taken round again.
- The two faint rings that exist (`fx-r1`, `fx-r2`) become dashed (`2 10`) and turn slowly in opposite directions (`NOVA.shells`).
- The core and the two spikes breathe (`NOVA.pulse`, `NOVA.spike`). The big red glow breathes (`NOVA.glow`).

Everything fades in with the blast and is full by the settled footer. `footerFrame` runs only when the frame moved. Add a second function that runs every frame while the blast or the footer is in view, takes the time, and writes these. One function owns each attribute: where a value has both a base from progress and a breath from time, compute the base in one place and write the product once.

**In the star canvas (`stars.mjs`), only inside the blast branch:**
- The stars the blast keeps turn slowly about the X: the inner ones faster. Keep an orbit clock in `SK` that advances by `dt * smooth(0.5, 1, blastT)`, and add `NOVA.orbit * (0.3 + 0.7 * (1 - s.kr)) * clock` to each kept star's angle.
- Embers: `embers.n` small sparks keep leaving the core, slowing as they go, fading out over their life, then leaving again in a new direction. Colour `C.warm`. Compute each from the clock, its own life and a hash of its number and its round, so no list has to be kept.
- The star canvas redraws every frame while the blast or the footer is in view.

**The footer's layers follow `look`** (`DEPTH.foot`): the sky stars by section 6, the lobes by `look * foot.lobes`, and the footer's text block (`.ft-in`) by `-look * foot.text` through the `translate` property.

**It answers a press.** The X's round hit area exists (`.fx-hit`). Once the footer has settled, enable it again with the label `COPY.nova` and a radius of `flare.hit` px. A press (click, Enter, Space) is a flare: one more ring leaves the core fast and bright (`flare.time`), the core swells by `flare.core` and settles, the kept stars are kicked outward by `flare.kick` of their distance and swing back, and the embers leave in a burst. A press during a flare starts another. Between the hand-off and the rush the hit area keeps doing what it does today.

## 12. Switches, phones, reduced motion

- **Depth switch.** `?depth=0` in the address starts with depth off. The review control at the top centre (`[data-review]`, built in `steps.mjs`) gets a third button, `COPY.steps.review.depth`, with `aria-pressed`, a thin Dim rule before it. Off means: `VIEW.depth = 0`, `#deep`, `#air` and `#sky` hidden, no card tilt or shadow, `look` held at zero. The sky stars and the supernova's motion are not part of the switch.
- **Handles.** Add to `window.__jm`: `depth` (the live `DEPTH` object), `nova` (the live `NOVA` object), `setDepth(on)`, and `visiting` (true while Back would return from a find, that is while `returnP` is set).
- **Phones** (`VIEW.phone`): no `look`, so no pointer light, no card tilt, no footer parallax. The smaller counts named above. Everything else is the same.
- **Reduced motion.** `#deep` is drawn once for the still map, and again on resize. Sky stars are drawn at rest. No `#air`, no `#sky`, no arcs, no card lift, no supernova motion.
- **Copy** (draft, in `data.mjs`): `COPY.steps.review.depth: 'Depth'`, `COPY.nova: 'The supernova. Press it.'`.

## 13. Checks to run before you finish

1. `node --check` on every `.mjs` you changed or added.
2. `node tools/check.mjs`. Add to it: every number in `DEPTH`, `NOVA` and the new `STARS` keys is finite; every row of `DEPTH.clouds.list` has six numbers with a drawing from 1 to 3 and a flip of 1 or -1; `rings.colour` is a key of `C`.
3. `node tools/depth-test.mjs` (new, Node only, imports `depth.mjs`, `trip.mjs` and `data.mjs`). Set the view with `tripResize(1440, 900, 120)` and again with `tripResize(390, 844, 96)`, and for each:
   - at the whole map, every cloud's opacity factor from `pass` is 1, and the deck's opacity is 0;
   - at the end of the dive and at every whole `P` of every hold, `leg` and `legX`, every cloud and every deck height in range is fully passed (visibility 0), with `VIEW.depth` at 1;
   - at the middle of every leg the low mist's visibility is above 0.5 for a height of 1;
   - with `VIEW.depth` at 1, the camera (`s`, `tx`, `ty`) at the last `P` of each hold equals the camera at the first `P` of the leg after it within 1e-6, and the same where each leg meets the next hold; the camera's scale at the middle of the longest leg is below its scale at the leg's ends;
   - with `VIEW.depth` at 0, the camera's scale equals `VIEW.sT` at every whole `P` of every `leg` and `legX`.
4. `node tools/steps-test.mjs`, `node tools/pack.mjs` and `node tools/pack-joined.mjs` all pass.
5. Read your changes once more against section 2 and section 6.

## 14. DEPTH-BUILD.md

Short and plain: what each changed file now does, every place you departed from this brief and why, and what could not be checked without a browser. Finish with a list of the things a browser check should look at first, and for each look that may need tuning, the name of the value in `DEPTH`, `NOVA` or `STARS` that tunes it.
