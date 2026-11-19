# Journey hero, second take: the motion

A brief for the build. The stills in this folder are approved. This adds time: the six scenes play as one loop of about 40 seconds.
Read `README.md` here first, then `stage.mjs`, `art.mjs`, `sq.mjs` and `kit.mjs`. Everything below builds on what they already do.

## Ground rules

- **You may write only inside `design/journey-hero/take-2/`.** Change `sq.mjs`, `art.mjs`, `stage.mjs`, `stills.mjs`, `stage.html`,
  `README.md` and `tools/sheet.mjs` as needed, and add `play.mjs`, `tools/page.mjs`, `tools/film.mjs`, `tools/checks.mjs` and
  `tools/preview.mjs`. Do not edit this brief.
- **Never touch anything else**: not `public/` (the first take stays as built, and `public/journey/hero/engine.mjs` is imported, not
  changed), not `src/`, `AGENTS.md`, `package.json`, or anything outside this repository.
- No git commands that change anything. No installs, no new dependencies, no network, no deploy. Node's own modules only, plus
  Playwright in the two review tools that already need it (it is not installed where you run, so write them and do not run them).
- The review happens elsewhere, in a real browser. Do not start reviewer agents and do not try to take screenshots.
- No agent's name, no real logo and no personal details go into any file. The flyer's two logos stay blobs.
- Keep each file's own style. In the hand-laid design files that means one idea to a line and comments that say why.
- When you finish, report: the files you changed, anything here you could not do or decided differently and why, and how you checked.

## The motion's own rules

The brand's motion is hard edged. These hold everywhere:

1. Things **cut or wipe**. Nothing fades, nothing is see-through, nothing blurs. Do not add blending or opacity to the renderer.
2. Nothing bounces or overshoots. Use the three eases in `engine.mjs`: `EASE.wipe` for every move from one pose to another,
   `EASE.enter` for something arriving, `EASE.exit` for something leaving. Playheads run at constant speed.
3. **The same object moves.** A thing that is seen leaving one place and arriving at another is one piece that travels. It is never
   removed in one place and made again in the other. A cut is allowed only where this brief says "cuts in" or "cuts out".
4. One cursor does all the work. Every change in an app follows something the cursor did, at the moment it did it.
5. Everything exported still lies flat, square to the screen, in the places it has today.

## How it is put together

### Time

`stage.mjs` exports the show and one function that builds any moment of it:

```js
export const SHOW = [ { key: 'ps', app: 'ps', layout: 'design', craft: 0, len: 4.3, still: 1.75 }, ... ];   // six scenes, in order
export const LOOP;                       // the sum of the lengths, in seconds
export function sceneAt(t);              // { i, scene, at } for a time in the loop (t wraps)
export function frameAt(t, o);           // every piece at that moment
export const SCENES, CRAFT, BLOCK, SCREEN, MAT, floorAt;   // as today
```

`SCENES[i](o)` stays, and returns that scene at its `still` time, so `stills.mjs` and `tools/sheet.mjs` keep working.
`SCENES[2]({ at })` still places the copy of the booklet that is being read (the sheet's strip uses it), with the block fully out.

| key | app | layout | craft | len | still |
| --- | --- | --- | --- | --- | --- |
| `ps` | Photoshop | design | 0 | 4.3 | when the split is 0.44 of the way across (about 1.75) |
| `ai` | Illustrator | design | 0 | 5.05 | 3.9 |
| `id` | InDesign | design | 0 | 9.4 | when the turning leaf is at 1.82 (about 5.9) |
| `pr` | Premiere Pro | edit | 1 | 8.0 | 6.9 |
| `ae` | After Effects | edit | 2 | 7.2 | 6.2 |
| `fig` | Figma | board | 3 | 6.4 | 5.3 |

Times in each scene's section are seconds from that scene's start. "a to b" means the move starts at a, ends at b, and is eased over
that span. All places on the screen are in the screen's own units, as in `on()`.

### What a frame is made of

1. **The shell**, which never leaves: the screen, its bar, the panels' plates, the app's tile and name, the Export button, the cursor.
2. **The app's content**: everything the app shows on its plates and its canvas. It wipes on when the app opens and off when it closes.
3. **Work that travels**: a piece on its way between the canvas, the dock and a frame. It is not content, so the wipes leave it alone.
4. **The floor**: what was exported. Tag every piece that lies on the floor with `where: 'floor'`.

### The shell changes app (the first half second of every scene)

- **Plates, 0 to 0.5.** Each layout is a set of plates (tone `night`, as today), and a plate keeps its role from app to app:

  | role | design | edit | board | folded away |
  | --- | --- | --- | --- | --- |
  | left | the tools: `[0.08, 0.1, 0.36, TOP - 0.1]` | bin or project: `[0.08, MID, 0.86, TOP - MID]` | layers: `[0.08, 0.1, 0.72, TOP - 0.1]` | never |
  | right | `[PANEL, 0.1, 0.85, TOP - 0.1]` | `[3.64, MID, 1.15, TOP - MID]` | `[PANEL, 0.1, 0.85, TOP - 0.1]` | never |
  | view | none | `[1.04, MID, 2.5, TOP - MID]` | none | no height, at its top edge |
  | time | none | `[0.08, 0.1, W - 0.16, MID - 0.2]` | none | no height, at its bottom edge |
  | tools | none | none | today's floating toolbar | no width, at its middle |

  `MID = 1.3`. From the previous scene's layout to this one's, every plate's rectangle moves with `EASE.wipe`. A folded plate is not drawn.
  Between two apps of the same layout nothing moves.
- **Tile, 0.05 to 0.5.** The tile turns over like a coin about its upright middle line: 180 degrees with `EASE.wipe`, the old logo on
  the side that leaves and the new one on the side that arrives. It lifts off the bar while it turns (0.2 more lift at the half way
  point, none at either end) so that it never cuts into the screen.
- **Name, 0.05 to 0.5.** In the first half the old name wipes away to the right (its left edge moves right). In the second half the new
  name wipes on from the left.
- At the loop's start the previous scene is the last one, Figma.

### Content wipes on and off

One upright line sweeps the screen's face from its left edge to its right edge with `EASE.wipe`. While an app opens, its content shows
only to the left of the line. While it closes, only to the right. Do this with the renderer's new clip plane (see below), set on every
content piece, so that a piece is cut where the line crosses it. Each scene gives its two spans, "content on" and "content off".
Outside them content is either all there or not drawn.

### The cursor and the Export button

- The cursor is today's piece. Each scene gives it waypoints. Between two waypoints it moves in a straight line with `EASE.wipe`
  over that span, and it rests where a scene leaves it. Every scene starts and ends with its tip at today's place on the Export
  button, `[W - 0.42, H - 0.26]`.
- **Pressed**: while the cursor drags, and for 0.12 s at a click, it floats 0.12 in front of the face in place of 0.22.
- **A click on Export** also sinks the button for those 0.12 s (0.035 less lift), then export runs for the scene's span. While it
  runs the button is in two parts that share its one picture: red from its left edge as far as the progress, `ink` beyond that. The
  words stay whole across the join. Before and after, it is today's red button.

### The dock (graphic design only)

Photoshop and Illustrator land nothing on the floor. Their work goes into the bar at the top of the screen, between the app's name and
the Export button, and waits there until InDesign places it. A docked piece is a chip: the picture, with a `grey` plate 0.012 larger
on every side just behind it. Chips sit at `b = H - BAR + 0.09`, 0.26 tall:

| chip | picture | left edge | width |
| --- | --- | --- | --- |
| photo | `kPhoto` | 1.9 | 0.38 |
| map | `kMap` | 2.36 | 0.673 |
| loc | `kLoc` | 3.11 | 0.414 |

A piece travels between the canvas and the dock by its rectangle (and its picture's window, where one is given) with `EASE.wipe`.
On the way it lifts 0.08 further off the face at the half way point, so that it passes over everything else.

### The floor: exported work is fed out, and taken back

There is a slot line on the floor along the mat's back edge, `z = MAT.z`. Nothing is drawn for it.

- **Fed out**: a thing starts wholly behind the line, slides toward us along z with `EASE.enter` to its place, and is clipped at the
  line, so that it comes out of the line like a sheet from a printer. It starts far enough back that none of it shows: its own depth
  plus 0.05. Clip with the renderer's clip plane, in the shadow pass too.
- **Taken back**: in a scene's last 0.4 to 0.5 s everything on the floor slides back behind the line as one block, with `EASE.exit`.
- The floor is empty whenever the app changes, and through the whole of Photoshop and Illustrator.

## The renderer (`sq.mjs`)

1. **A clip plane for a piece**: `clip: [a, b, c, d]` keeps only what has `a x + b y + c z + d >= 0` in the world. It must hold in
   all three passes (shadow depth, colour, outline). A piece without it is whole.
2. **A lighter mesh for sharp pieces.** Almost every piece is a box, and today a box is drawn with the round shapes' mesh of about
   7,700 triangles, twice a frame. Keep that mesh for any piece with a roundness above 0.06. Give the rest a second mesh built from the
   same function with the angles `[0, 0.9, 0.98, 0.995]`. A sharp box must look as it does today: flat faces, thin bevels.
3. **Atlas pages.** The atlas is full (3,912 of 4,096 rows). `makeAtlas` returns `{ pages: [canvas, ...], places: { key: [page, x,
   y, w, h] } }`, with no page over 2048 x 2048, and the renderer keeps one texture per page and binds the page a piece needs.
   `stage.html?atlas=1` shows every page.
4. Set the canvas's size only when it changes, and avoid building new arrays for every piece in every frame where that is easy.
   The loop should hold 60 frames a second on a laptop's built in graphics.

## Pictures to add or change (`art.mjs`)

- `shotA`, `shotB`, `shotCfx`, each 480 x 270: the three shots at the viewer's size. `shotA` has no caption. `shotCfx` is shot C
  with its effect on: the same drawing with a `C.red` ground in place of the grey. `frameWide` goes.
- `cap1`, `cap2`, `cap3`, each 352 x 74: a burned in caption, ink words in Outfit 800 at 54 px, centred, on a paper ground that
  fills the picture. The words: "Look good.", "Move well.", "Work right.".
- `graphGrid`, 240 x 200: today's `graph` with only its grid. The curve, the handles and the keys become pieces. `graph` stays for Figma.
- `wMake` and `wMove`: the comp's two lines of words on a paper ground, cut out of `saas()` at the wide frame's measures.
  In the comp's 480 x 270 px, `wMake` is the box `[28, 62, 232, 62]` and `wMove` is `[28, 136, 168, 52]` (left, top, width, height).
- `rowA` and `rowB`, each 140 x 38: one row of the comp's list, with the red square and with the paper one.
- In `saas()` drop the see-through third row: it is drawn solid, where it is today. (The three exported screens use it.)
- Export what `stage.mjs` needs to place the comp's parts: where the ball starts, the point its path bends round, and the rows' places.

## The six scenes

### 1. Photoshop (`ps`, 4.3 s)

The grade is pulled across the photograph.

- Content on 0.4 to 0.8. It is today's scene, with the photograph all raw: the split stands at the photograph's right edge. The red
  slider starts at 0.2 and the grey one at 0.5.
- 0.6 to 1.2 the cursor goes to the split's handle. It presses at 1.3.
- **1.3 to 2.4 it drags the split to the photograph's left edge.** Left of the split is `kPhotoB`, right of it `kPhoto`, as today, so
  the graded picture is wiped on from the right. The two sliders move with the same progress, to 0.55 and 0.3.
- At 2.4 it lets go and the round handle cuts out. 2.4 to 2.55 the split's bar shrinks to nothing about its middle.
- 2.6 to 3.1 the cursor goes to Export. It clicks at 3.15. Export runs 3.15 to 3.65.
- **3.2 to 3.7 the photograph leaves the canvas for the dock** and becomes the photo chip. It stays there for the next two scenes.
- Content off 4.0 to 4.3.
- The still is today's still: the split at the building's corner, 0.44 of the way across.

### 2. Illustrator (`ai`, 5.05 s)

The two maps are drawn, a part of one is looked at closely, and its subway line is selected.

- Content on 0.1 to 0.5: the tools with the pen lit, the panel, and the two artboards empty: plates in the flyer's coal
  (`tones: FLYER.coal`, which is exactly the maps' ground, so a map revealed over its plate has no visible edge). The photo chip is docked.
- 0.3 to 0.7 the cursor goes to the left end of King Street on the upper artboard (the street is 426/850 of the way down it).
- **0.7 to 1.5, pressed, it runs to the right end, and `kMap` is revealed from the left as far as the cursor.**
- 1.5 to 1.65 it goes to the left end of King Street on the lower left artboard (368/850 of the way down).
- **1.65 to 2.25, pressed, it runs to that artboard's right edge, and `kLoc` is revealed the same way.**
- At 2.3 the lit tool changes from the pen to the arrow. 2.25 to 2.35 the cursor goes to the top left corner of the red frame's place.
- **2.35 to 2.65, pressed, it drags to the frame's bottom right corner, and the red frame grows from its top left corner to the cursor.**
- **2.7 to 3.2 the close-up comes out of the frame**: one piece showing `kLocClose`, whose rectangle goes from the frame's to
  today's place for the close-up.
- 3.2 to 3.25 the cursor goes to the subway line in the close-up, at the map's point (750, 506). It clicks at 3.25.
- **3.25 to 3.6 the red path runs along the line**, bar by bar from one end to the other. At 3.6 the points, the two handles' arms and
  their dots cut in. From 3.6 to 4.2 the picture is today's still, plus the docked photo chip.
- 3.7 to 4.15 the cursor goes to Export. It clicks at 4.2. Export runs 4.2 to 4.7.
- At 4.2 the selection cuts out (the frame, the path, the points and the handles). 4.2 to 4.45 the close-up goes back into its frame
  and is then gone. **4.25 to 4.75 the upper artboard goes to the dock as the map chip, and 4.45 to 4.95 the lower one as the loc chip.**
- Content off 4.75 to 5.05.

### 3. InDesign (`id`, 9.4 s)

The three assets are placed, the pieces are finished, the booklet is printed and read.

- Content on 0.1 to 0.5: the tools, the pages panel as today, and the canvas with nothing placed yet. The spread's two pages are plain
  coal plates. Where the map goes, and where the cover, the post and the e-blast go, there is an **empty frame**: a `night` plate (none
  is needed on the coal pages) with a thin `dark` outline and its two diagonals, drawn with bars (give `bar()` and `outline()` a tone).
  All three chips are docked.
- 0.25 to 0.55 the cursor goes to the middle of the map chip. It presses at 0.55.
- **0.55 to 1.0 it drags the map chip to the spread's frame**, with the cursor at the chip's middle. The rectangle goes from the dock's
  to the frame's (today's outline: (34, 84) to (2056, 826) of the 2200 x 850 spread), and the picture's window from all of it to that
  same part of it. At 1.0 it lets go: the chip is gone, the two pages cut to `kAmL` and `kAmR`, and today's outline and eight handles cut in.
- **0.8 to 1.25 the loc chip flies by itself to the pages panel**, onto the third row (the location spread), ending over the map's
  share of that row: its left 1352/2200. Then it is gone: the thumbnails under it show the same map.
- **1.1 to 1.55 the photo chip flies to the cover's empty frame.** It keeps its shape and ends as wide as the photograph's share of
  the cover (from 380/1100 of the cover's width to its right edge), in the middle of the cover's height.
  1.55 to 1.8 the finished cover, `kCover`, wipes on from the left over the frame and the chip. Then the chip is gone.
- 1.7 to 2.0 the post wipes on from the left over its frame, and 1.85 to 2.15 the e-blast. From 2.15 the canvas is today's still.
- 2.25 to 2.7 the cursor goes to Export. It clicks at 2.75. Export runs 2.75 to 3.55.
- **Fed out**: the stack with the top copy still on it 2.8 to 3.3, the phone 2.95 to 3.4, the tablet 3.1 to 3.55.
- **3.9 to 4.6 the top copy is taken off the stack and set down** (`at` from -1 to 0 at constant speed: `copy()` eases it).
- **The leaves turn**, each with `EASE.wipe`: 4.7 to 5.3 the cover (to The Offering), 5.6 to 6.2 (Location), 6.5 to 7.1
  (Amenities), 7.4 to 8.0 (the gallery).
- 8.9 to 9.4 the whole block, open copy and all, is taken back. Content off 9.1 to 9.4.

### 4. Premiere Pro (`pr`, 8.0 s)

Captions, a transition and an effect go on, the edit plays, and it is exported to three screens.

- Content on 0.4 to 0.8. It is today's scene with these changes: no caption blocks, no transition and no effect on the timeline yet.
  The viewer shows `shotA`. The effects panel has its three wheels with their dots in the middle, **two** sliders, both at 0.5, and
  under them two presets waiting: the transition's tile (0.2 square, at `[3.74, MID + 0.07]`) and the fx tile (0.36 x 0.2, at
  `[4.04, MID + 0.07]`). The playhead stands 0.9 along the timeline.
- 0.55 to 0.9 the cursor goes to the T at the head of the caption track. It clicks at 0.9.
- **0.95 to 1.5 the five caption blocks grow from their left ends**, one after another, 0.09 s apart, each in 0.18 s.
  1.2 to 1.4 the caption `cap2` wipes on in the viewer from the left. A caption is 0.704 wide and 0.148 tall, centred in the frame,
  with its top 0.28 above the frame's foot.
- 1.45 to 1.75 the cursor goes to the transition's tile. It presses at 1.8. **1.8 to 2.35 it drags the tile to the first cut**, where
  the tile is today, and the tile grows to today's size on the way. It lets go at 2.35.
- 2.45 to 2.75 the cursor goes to the fx tile. It presses at 2.8. **2.8 to 3.3 it drags it onto the last clip**, where it is today.
  It lets go at 3.3. 3.3 to 3.5 the wheels' dots go to today's places and the sliders to 0.62 and 0.3.
- 3.4 to 3.6 the cursor goes to the play button, the middle of the transport. It clicks at 3.6.
- **3.65 to 5.25 the edit plays.** The playhead cuts to the start and runs to the end of the last clip (3.9 along) at constant speed.
  The viewer shows what is under it: `shotA` up to 1.14; from 1.14 to 1.46 a wipe, `shotB` coming on from the left; `shotB` up to
  2.7; then a cut to `shotCfx`. While the playhead is over a caption block the viewer carries that block's caption, which cuts on
  and off. The blocks' captions are, in order, `cap1`, `cap2`, `cap3`, `cap1`, `cap2`.
- At 5.25 the playhead cuts back to 0.9, so the viewer shows the frame that is exported: `shotA` with "Move well.".
- 5.3 to 5.7 the cursor goes to Export. It clicks at 5.75. Export runs 5.75 to 6.45.
- **Fed out**: the tablet 5.8 to 6.3, the first phone 5.95 to 6.4, the second 6.05 to 6.45.
- 7.6 to 8.0 the row is taken back. Content off 7.7 to 8.0.

### 5. After Effects (`ae`, 7.2 s)

A layer is selected, its motion is eased in the graph, the comp is previewed and exported.

The comp is now made of pieces on a paper plate, so that it can play: `wMake`, `wMove`, the ball (a red disc), and three rows
(`rowA`, then `rowB` twice). `at` is the playhead's place along the timeline, in the timeline's own units. Each layer moves between
its two keyframes in `LAYERS`, and `p` is how far `at` is between them (0 before, 1 after):

- The two lines of words are revealed from the left as far as `EASE.wipe(p)`.
- The ball is not drawn before its first keyframe. Then it runs along its path (the curve in `saas()`: from its start, round the
  bend, to its place) as far as `bezier(0.542, 0, 0.458, 1)(p)`, which is the curve the graph ends up showing.
- A row is not drawn before its first keyframe. Then it slides in from the right: it is `(1 - EASE.enter(p)) * 0.75` of its own
  width to the right of its place, and it is clipped at the comp's right edge.

- Content on 0.1 to 0.5. Today's scene with nothing selected: no lit row, white keyframes on every row, no outline or path in the
  comp, and the graph panel showing `graphGrid` alone. The playhead stands at 1.6, so the comp shows that moment.
- 0.5 to 0.85 the cursor goes to the third row of the timeline, the ball's. It clicks at 0.9. **The row lights as today** (red
  keyframes), the ball gets today's outline and corner squares, its path cuts in (eleven small `dark` squares along the curve and an
  open square at its start), and the graph gets its two keys (paper squares at (24, 176) and (216, 24) of the 240 x 200 graph), a
  straight red line between them made of 14 bars, and two `grey` handles a third of the way along that line from each key.
- 1.1 to 1.45 the cursor goes to the end of the first key's handle. It presses at 1.5. **1.5 to 2.1 it drags that handle flat, to
  (128, 176), and the other handle mirrors it, to (112, 24). The red line bends into the ease curve as they move.** It lets go at 2.1.
- 2.3 to 2.6 the cursor goes to the play button. It clicks at 2.6.
- **2.65 to 4.25 the comp plays.** The playhead cuts to 0 and runs to 2.4 at constant speed. The outline stays on the ball and goes with it.
- At 4.25 the playhead cuts back to 1.6.
- 4.3 to 4.7 the cursor goes to Export. It clicks at 4.75. Export runs 4.75 to 5.45.
- **Fed out**: the tablet 4.8 to 5.3, the first phone 4.95 to 5.4, the second 5.05 to 5.45.
- 6.8 to 7.2 the row is taken back. Content off 6.9 to 7.2.

### 6. Figma (`fig`, 6.4 s)

The wireframes become designs, two of them are linked, and the page is exported.

- Content on 0.4 to 0.8: the layers, the panel with only its two tabs, the toolbar's tools, and the three wireframes with their names.
  No designs, no link.
- 0.6 to 0.95 the cursor goes to the middle of the desktop wireframe. It presses at 1.0.
- **1.0 to 1.4 it drags the desktop design out from behind the wireframe**, down to its place. The design is the piece showing
  `uiWide`: it starts exactly behind the wireframe, lower than it (lift 0.03), and slides down. The cursor stays on its middle and lets
  go at 1.4. **1.15 to 1.55 and 1.3 to 1.7 the two phone designs slide out the same way by themselves.** A design's name cuts in when it arrives.
- 1.85 to 2.15 the cursor goes to the right end of the hot spot. It presses at 2.2, and the hot spot's outline and the dot at its end cut in.
- **2.25 to 2.85 it drags the link to the second phone.** The red line runs from the dot to the cursor all the way: the same
  curve as today, in 8 bars, with its reach no more than a third of the distance covered. It lets go at 2.85, on the second phone's
  left edge, and the arrowhead cuts in.
- 2.9 to 3.2 the panel fills in, one thing cutting in after another, 0.07 s apart: where the flow starts, the link's row, the graph,
  the two bars.
- 3.3 to 3.7 the cursor goes to Export. It clicks at 3.75. Export runs 3.75 to 4.45.
- **Fed out**: the tablet 3.8 to 4.3, the first phone 3.95 to 4.4, the second 4.05 to 4.45.
- 6.0 to 6.4 the row is taken back. Content off 6.1 to 6.4.

## The player (`play.mjs`) and its page

`tools/page.mjs` writes the page the way `writeStillsPage()` does today (the built page's own markup, with its script swapped), once
for the stills and once for the player. Keep `writeStillsPage` exported from `tools/sheet.mjs`.

`play.mjs` runs the loop in that page. Use relative imports, so that the preview tool can pack it.

- It fits the stage exactly as `stills.mjs` does, from the six stills, so the scene is the size it is today at every screen size.
- It plays from 0 and wraps at `LOOP`. The craft in the list that belongs to the scene on show carries `aria-current`.
- A craft's button cuts to the start of that craft's first scene. A click on the stage goes to the next craft. The Pause button
  stops and starts time, and reads "Play" while stopped.
- With `prefers-reduced-motion: reduce` nothing plays: the page shows a still, and the buttons change which. The four stills are
  InDesign's, Premiere Pro's, After Effects' and Figma's.
- It stops drawing while the tab is hidden or the hero is off screen, and it draws at no more than 2 device pixels to a CSS pixel.
- `?t=12.5` holds a moment. `window.__hero = { seek(t), t, LOOP, SHOW }` lets a tool hold any moment: `seek` draws at once.
  It also sets `window.__ready` and `window.__need` as `stills.mjs` does.

## Tools

- `tools/checks.mjs`, for Node, no browser: steps through the loop 60 times a second and checks every piece of every frame.
  Every number finite, no negative size, every tone and every picture's key known, every window inside the picture with its edges in
  order, exactly one cursor, no floor piece in `ps` or `ai` or in the first 0.1 s of any scene, and every scene's still and
  `SCENES[i]()` the same list. It prints `all clean` or what is wrong and when. Run it, and leave it passing.
- `tools/film.mjs <out.png> <from> <to> <step> [--phone]`, with Playwright like `tools/sheet.mjs`: holds each moment with
  `__hero.seek`, takes the stage (the stage box and 16 px around it), and lays the frames out eight to a row at half size, each with
  its time and its scene's key under it. `--phone` uses the 390 x 664 page.
- `tools/preview.mjs <out.html>`: the player's page as **one self-contained file** in the frame shape that
  `design/journey-hero/tools/preview.mjs --frame` makes (read it: no doctype, html, head or body tags, a title, the hero fills its
  frame, and the page's own links go nowhere, with their addresses left out of the file). It must need no network and no
  dependency, so it does not use esbuild: it packs the modules itself (each module wrapped in a function that returns what it
  exports, in the order they depend on each other, with the entry last and able to await). The stylesheet's font goes inline as
  the other tool does it. The three faces that `fontsReady()` loads go inline too, as data addresses that `fontsReady()` uses when
  the page provides them. The title is "Journey hero preview".
- `tools/sheet.mjs` keeps working as it does today.

## Done when

1. `node design/journey-hero/take-2/tools/checks.mjs` prints `all clean`.
2. Every scene's still is today's still, apart from what this brief changes on purpose (the photo chip in Illustrator's bar, two
   sliders in Premiere Pro, the playhead's parked place there, and the comp's solid third row).
3. Every beat above happens at its time, with the ease named, and the rules at the top hold in every frame.
4. `README.md` in this folder describes the motion, the new files and how to run the tools, in the same plain voice.
