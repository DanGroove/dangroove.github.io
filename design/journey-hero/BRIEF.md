# Journey page hero: build brief

You are the developer on this. The design is finished and it is in this repository as running code. Your job is to turn it into the
production page. A design lead reviews your work afterwards in a real browser, against the rough cut, and sends notes if anything is off.

Read `AGENTS.md` at the repository root first, then this file to the end before you write anything.

## Ground rules

You are running on the site owner's own computer, without a sandbox. Keep to this exactly.

**You may create or change only these:**

- `public/journey/index.html`
- `public/journey/journey.css`
- `public/journey/hero/render.mjs`
- `public/journey/hero/hero.mjs`
- anything inside `design/journey-hero/.scratch/` (throwaway files, ignored by git; delete what you put there when you finish)

**Never change, move or delete anything else.** In particular: `public/index.html`, `public/holding/`, `public/CNAME`, `src/`,
`package.json`, `.gitignore`, `AGENTS.md`, everything else under `design/`, and the three design files
`public/journey/hero/engine.mjs`, `timeline.mjs` and `layout.mjs`. If you think one of the design files has a bug, or needs to export
something it does not, say so in your report and work around it in your own files. Do not edit it.

**Never do any of these:**

- run `npm install`, `npm run deploy`, `npm run build` or `npm start`, or install anything by any other route
- run a git command that changes anything (commit, push, checkout, reset, stash, clean and so on). Reading is fine: `git status`, `git diff`, `git log`. Someone else commits your work
- read, write or run anything outside this repository folder, apart from starting a browser that is already installed (see "Looking at your work")
- change any setting, account or sign-in on this computer
- start reviewer agents or other sub-agents. This overrides any standing instruction to do so: the review happens elsewhere

If the brief is unclear, or you think it is wrong, do the most sensible thing within these rules and say what you chose in your report.
Do not redesign anything: sizes, colours, timings, wording and layout are all decided.

## What this is

The first screen of the journey page of danialendrawes.com, a designer's portfolio. Four bars, one for each of Danial's crafts, open
the page as four flat stripes, fold down into a deck, and then keep re-forming on a twelve second loop: a swatch fan (graphic design),
a clapperboard (video), a stack that turns between two walls (motion), and a window with rows and a button (UX/UI). The bar of the
craft on show is red. They are always the same four bars. Nothing is ever swapped out, faded or respawned.

The bars are flat-shaded solids seen from a fixed three-quarter view, drawn back to front by a small projector of our own. There is no
3D library and there must not be one: the labels have to stay razor sharp and the page has to stay tiny.

The page under the hero (the journey itself) does not exist yet. Build the hero only.

## What is already here

| Path | What it is | Yours to change? |
| --- | --- | --- |
| `public/journey/hero/engine.mjs` | Vector maths, the camera, easing, and the geometry of a bar (`barFaces`, `barBoxes`, `hull2`, `TONES`, `INK`, `HALO`) | No |
| `public/journey/hero/timeline.mjs` | The choreography: `stateAt(seconds, entrance, zoomE)` gives the four bars and their paint order at any moment | No |
| `public/journey/hero/layout.mjs` | Where the art sits on the page: `fitStage()` and `planEntrance()` | No |
| `design/journey-hero/rough-cut/index.html` | **The design.** The whole hero, moving, with its markup, CSS and player in one file | No |
| `design/journey-hero/rough-cut/svg.mjs` | The rough cut's renderer, in SVG. Your canvas renderer has to paint the same picture | No |
| `design/journey-hero/frames/` | Screenshots of the rough cut at held moments, desktop (1440 x 900) and phone (390 x 844 at 2x). The number in each name is the time in seconds | No |
| `design/journey-hero/tools/` | Review tools. `serve.mjs` and `checks.mjs` need only Node. The rest need Playwright and are for the reviewer | No |

The three design files are shipped as they are: the page imports them. Their numbers are design decisions.

## What to build

Four files. Together they are the rough cut, rebuilt for the live site: the same page, with the art drawn on a canvas instead of
rebuilt as SVG every frame, the script split into modules, and the loose ends of a prototype tied up.

1. `public/journey/index.html`: the page
2. `public/journey/journey.css`: its styles
3. `public/journey/hero/render.mjs`: draws one picture on a 2D canvas
4. `public/journey/hero/hero.mjs`: the player, which runs the clock, lays the art out on the page and handles input

Plain HTML, CSS and ES modules. No framework, no dependencies, no build step, no requests to any other host. The site's build copies
`public/` to the site unchanged, so every address in these files must be relative (`../favicon/favicon.png`, `hero/hero.mjs`). `%PUBLIC_URL%`
does not work outside `public/index.html`. The page has to work from any folder depth: it is served at `/journey/` on the site and at
`/public/journey/` by the review server.

### 1. The page

Take `<main>` and everything in it from the rough cut. Keep every class and every `data-` attribute: the styles, the player and the
review tools all find things by them. Then make these changes.

- The art is a canvas: `<canvas class="hero-art" data-art aria-hidden="true"></canvas>` in place of the `<svg data-art>`.
- The mark links to `../`. Keep its `aria-label`.
- In the nav, Journey links to `./` and keeps `aria-current="page"`. Contact uses the same `mailto:` address as the Contact link in
  `public/index.html`: copy that `href` exactly.
- Leave out the rough cut's line of script that stops links from working.
- Keep `is-entering` on the hero in the markup, as the rough cut has it, so the foot row is hidden from the first paint. Add
  `<noscript><style>.hero.is-entering [data-foot]{visibility:visible}.hero-pause{display:none}</style></noscript>` to the head, after
  the stylesheet, so the page is complete with scripts off.

The head:

- `<!doctype html>`, `<html lang="en">`, charset, and `<meta name="viewport" content="width=device-width, initial-scale=1">`
- `<title>Journey · Danial Endrawes</title>`
- `<meta name="description" content="The journey of Danial Endrawes through study and work in graphic design, video, motion and UX/UI.">`
- `<meta name="robots" content="noindex">` (the page is not finished; this comes out when the journey section ships)
- `<link rel="canonical" href="https://danialendrawes.com/journey/">`
- `<meta name="theme-color" content="#151314">` and `<meta name="color-scheme" content="dark">`
- the same three favicon links as `public/index.html`, pointing at `../favicon/`
- a preload for the font: `<link rel="preload" href="../holding/fonts/outfit-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>`
- the stylesheet, then `<link rel="modulepreload">` for each of the five modules, then `<script type="module" src="hero/hero.mjs"></script>`

No inline styles and no inline script, apart from the `<noscript>` rule above.

### 2. The styles

Move the rough cut's CSS into `journey.css`. **Every value stays as it is**: sizes, spacing, breakpoints (1199px and 719px), colours,
the weight animation on the name, the `svh` units with their `vh` fallbacks, the safe-area gutters, the `--stacked` flag the player
reads. Changes:

- Lay it out readably (one declaration to a line, a short comment per section). The rough cut's is packed tight on purpose; the site's should not be.
- The font is at `../holding/fonts/outfit-latin-wght-normal.woff2` from the stylesheet. Keep `font-display: block`.
- `.hero-art` is now a canvas. It still covers the whole hero (`position: absolute; inset: 0; width: 100%; height: 100%; display: block`).
  The player sets its pixel size.

Nothing on this page fades, slides or eases in CSS except the name's weight, which is already there. State changes cut. Do not add transitions.

### 3. The renderer: `render.mjs`

Export one function. The player owns the canvas (size, pixel ratio, clearing); the renderer only paints.

```js
// ctx     a CanvasRenderingContext2D whose units are CSS px (the caller has applied the pixel ratio and cleared the canvas)
// bars    state.bars from stateAt(): the four bars, keyed by id
// order   state.order: their ids, back to front
// view    { S, cx, cy, cam, labels }: px per stripe width, the stage centre in px, a camera from makeCamera(), and LABELS
export function drawHero(ctx, bars, order, view) {}
```

It is a port of `renderSVG()` in `design/journey-hero/rough-cut/svg.mjs`. Read that function first: it is thirty lines and it is the
specification. Same steps, same order, same numbers. For each bar id in `order`:

1. **Knockout.** For every box in `barBoxes(bar)`: project its eight corners, take `hull2()` of them, and fill and stroke that polygon
   in `INK` with `lineWidth = 2 * HALO * S`, `lineJoin = 'miter'`, `miterLimit = 6`. This cuts the brand's gap into whatever the bar
   passes over. `INK` is also the page's background colour, so the cut must be indistinguishable from the ground.
2. **Edge faces.** From `barFaces(bar, cam)`, the faces with `main === false`. Colour: `Math.abs(face.n[1]) > 0.7071 ? tone.up : tone.side`
   where `tone = TONES[face.color]`. Draw all faces of one colour as one path: fill it, then stroke it in the same colour with
   `lineWidth = 0.6`, `lineJoin = 'miter'` and `miterLimit = 4`. The hairline stroke hides the seams between neighbouring faces.
3. **Labelled faces.** The faces with `main === true`, colour `tone.face`, drawn the same way.
4. **The label**, only if `dot(ez, cam.v) > 0.02` where `ez = cross(bar.ex, bar.ey)`, and only if `labels[bar.id]` exists.
   A bar can be two colours for a moment while the red wipes along it. So for each colour among the bar's labelled faces: clip to
   those faces (one path of all of them, in screen px), then draw the text in `TONES[colour].text`.

The label is real type lying on the bar's face, so it shears with the bar. In the rough cut it is an SVG `<text>` with this transform,
which you apply with `ctx.transform(m[0], m[1], m[2], m[3], ox, oy)`:

```js
const base = add(bar.c, add(mul(bar.ex, bar.lab), add(mul(bar.ey, -0.3), mul(ez, T / 2))));   // start of the baseline, in the world
const [ox, oy] = project(base, cam, S, cx, cy);
const m = [S * dot(cam.r, bar.ex), -S * dot(cam.u, bar.ex), -S * dot(cam.r, bar.ey), S * dot(cam.u, bar.ey)];
```

Inside that transform one unit is one stripe width, x runs along the bar and y runs down its face. The text starts at the origin on an
alphabetic baseline, left aligned. It is Outfit at weight 800, font size `0.6 / 0.7` units (which makes the capitals 0.6 of the stripe
high), with `0.027em` of letter spacing.

Two things about type on a canvas:

- Do not set a font size under a pixel. Set `ctx.font = '800 100px Outfit'` and scale the context by `(0.6 / 0.7) / 100` after the transform.
- Do not use `ctx.letterSpacing` (older Safari lacks it). Place the label glyph by glyph: with the 100px font, glyph `i` of `text`
  goes at `x = width(text.slice(0, i + 1)) - width(text[i]) + i * 2.7`, where `width` is `ctx.measureText(...).width`. Measured this
  way the kerning between letters survives. Measure once per label and keep the numbers. They are only right once Outfit has loaded,
  so give the player a way to throw them away (see the player's start-up).

The picture has to match the rough cut closely enough that the two can be overlaid: same shapes to the pixel, same colours exactly,
labels to the pixel. This section has been tried out: a renderer written from it alone matched the rough cut in all sixty of the
reviewer's comparison pictures, with nothing between them but a pixel of edge smoothing. So follow it literally, steps in this order.

### 4. The player: `hero.mjs`

Port the script at the bottom of the rough cut. Its behaviour is the specification, including every number in it. In outline:

- **Layout** (`measure()`): reads the hero's size, the stage box, and where the text sits, and from those gets the scale and stage
  centre (`fitStage`) and the opening stripes (`planEntrance`). The opening passes under the nav and the text on wide screens, and
  between the nav and the name on the stacked layout (under 720px, flagged by `--stacked: 1`). If the stacked opening would have to
  shrink below 0.7, it ignores the nav instead, and the nav links are hidden until the stripes have lifted (`nav-late`). Port it as
  it stands: the gaps (`14`, `36`, `12`) and insets (`20`, `112`) are design decisions.
- **Clock**: `t` in seconds. The opening is the first 3 seconds (`ENTRANCE + 1`), then a 12 second loop. After the first pass `t` wraps
  inside `[LOOP0, LOOP0 + BEATS)`. Frame time is capped at 0.05s so a stall never makes a jump.
- **Per frame**: `stateAt(t, L.entrance, L.zoom)`, then draw with `S: L.S * state.zoom`. `is-entering` is on the hero while
  `t < ENTRANCE + 1`. The craft button for `state.act` carries `aria-current="true"`; no button does during the opening (`act` is -1).
- **Craft buttons** jump to a craft by running the timeline at 8 beats a second, the shorter way round, to `ARRIVED[k]`. During the
  opening there is only forward. A jump works while paused and stays paused on arrival.
- **Clicking the stage box** goes to the next craft.
- **Pause** stops and starts the clock. Its word is what pressing it will do: "Pause" while playing, "Play" while paused.
- **Pointer tilt**: on devices with a fine pointer that can hover, the view follows the pointer by up to 6 degrees of yaw and 4 of
  pitch, eased with a 0.14s time constant, held flat during the opening, and eased back to flat when the pointer leaves the hero.
- **Reduced motion**: nothing plays. The page shows the still for the first craft (`LOOP0 + STILL[0]`), the craft buttons and the
  stage cut straight to `LOOP0 + STILL[k]`, the pause button is hidden (CSS does that), and there is no tilt.
- The loop only runs when there is something to draw: it stops when paused with no jump under way and the tilt at rest.

What the production player adds to the rough cut:

1. **Canvas upkeep.** The canvas's pixel size is the hero's CSS size times the pixel ratio, where the ratio is
   `Math.min(devicePixelRatio, 3)`, lowered further if the canvas would pass 16 million pixels. Set it only when the size or the ratio
   changes, then `ctx.setTransform(ratio, 0, 0, ratio, 0, 0)` and redraw in the same task so it never shows blank. React to the hero
   resizing (ResizeObserver, as now), to the window resizing (browser zoom changes the ratio), and to the stage box resizing.
2. **Start-up without top-level `await`.** Wait for Outfit at weights 800 and 300 (`document.fonts.load`), but no longer than 3
   seconds. Then measure and start. If the wait timed out and the font arrives later, throw away the label measurements, measure the
   layout again and redraw. If there is no 2D context, do nothing and leave the page as it is.
3. **Stop when out of sight.** Run only while the hero is on screen (IntersectionObserver) and the tab is visible. Coming back never
   jumps: the clock carries on from where it stopped. Handle a page restored from the back/forward cache the same way.
4. **Reduced motion can change while the page is open.** Listen for it. Going to reduced: stop and cut to the still of the craft on
   show. Going back: play on from there.
5. **Touch the DOM only when something changes.** No per-frame writes of a class or attribute that already has that value. Never
   measure layout inside the frame loop.
6. **Nothing in the console** in normal running: no logs, no warnings, no errors, no failed requests.

### The review hooks

The reviewer's tools drive the page through these. They must behave exactly as in the rough cut.

- `?t=<seconds>` in the address: the page loads holding that moment, paused and without tilt, whatever the motion setting.
- `window.__hero`, set as soon as the module runs:
  - `seek(t)`: stop, cancel any jump, flatten the tilt, measure again, and draw the moment `t` before returning. It does not touch the Pause button.
  - `layout()`: `null` until the first measure, then `{ vw, vh, S, cx, cy, entrance, zoom }` exactly as the rough cut builds it.
  - `t`: a getter for the clock.
- These hooks in the markup, unchanged: `data-hero`, `data-art`, `data-stage-box`, `data-mark`, `data-nav`, `data-name`, `data-lede`,
  `data-crafts`, `data-craft="0"` to `"3"`, `data-foot`, `data-cue`, `data-pause`. And the classes `hero`, `is-entering`, `nav-late`.

The reviewer will measure your page at some twenty screen sizes and expect the text and the art to sit where the rough cut puts them, to
half a pixel. Then compare screenshots of the two pages at twenty held moments, and then use the page: buttons, pause, stage,
keyboard, resize, reduced motion.

## The bar to clear

- **Browsers:** current Chrome, Edge, Firefox and Safari, and Safari on iOS 15.4 and later. Use nothing the oldest of those cannot run.
- **Speed:** a steady 60 frames a second on an ordinary laptop, and no work at all when nothing is moving.
- **Access:** everything the rough cut has, kept: real buttons and links, the visible focus ring, the tab order (mark, Journey,
  Contact, the four crafts, Pause), the larger hit areas on the small links, the canvas hidden from assistive technology.
- **Code:** written to be read by the next person. Formatted to the repository's `.prettierrc`. Comments say why, in plain words.
  No dead code, no leftovers from the prototype, nothing clever that a comment has to apologise for.

## Looking at your work

`node design/journey-hero/tools/checks.mjs` must still print `all clean` when you finish. It checks the design files, which you have not touched.

If Node is installed, `node design/journey-hero/tools/serve.mjs` serves the repository on this computer only:
`http://localhost:4173/public/journey/` is your page and `http://localhost:4173/design/journey-hero/rough-cut/` is the rough cut.
Add `?t=6` to hold a moment. Stop the server when you are done.

If Edge or Chrome is installed, you can take a picture of your page without opening a window, and compare it by eye with the frame
of the same moment in `design/journey-hero/frames/`:

```
"<path to msedge.exe or chrome.exe>" --headless=new --disable-gpu --hide-scrollbars --window-size=1440,900 --virtual-time-budget=5000 --user-data-dir="<repo>\design\journey-hero\.scratch\profile" --screenshot="<repo>\design\journey-hero\.scratch\built-6.png" "http://localhost:4173/public/journey/?t=6"
```

Do the same for the rough cut's address to see the two side by side. Worth checking at least `?t=1.5`, `?t=6`, `?t=8.3` and `?t=12`
at 1440 x 900, and `?t=12` at 390 x 844. Keep everything this makes inside `design/journey-hero/.scratch/` and delete that folder's
contents when you finish. If this does not work after a couple of tries, leave it and say so: the reviewer has a browser. Do not
install anything to make it work.

## What to report

Finish with a short written report:

- the files you wrote
- anything you did differently from this brief, and why
- anything in the design files or the rough cut that looks wrong to you
- what you checked and how, with the results, and what you could not check
- anything left undone
