# Journey map: the things you play with, made richer (build 5)

Read this whole file before writing anything. Then read `finds.mjs`, the find drawings in `art.mjs` (from `// ---- finds` down, and the finds block at the end of `bigMap`), the `FINDS`, `FIND_COPY` and `FIND_TIMING` tables in `data.mjs`, `steps.mjs`, `tripState` and the camera functions above it in `trip.mjs`, the `frame` function in `main.mjs`, and `DEPTH-BUILD.md`.

This brief is built in two runs. Your prompt says which part to build. **Part A** is sections 3 to 9. **Part B** is sections 10 to 15. Sections 1, 2 and 16 to 19 apply to both.

## 1. Why

Dan, on the preview: "i meant the little things you can interact with along the way need more depth. they feel too bare bones". Earlier, on the sketch of them: "These are too simplistic".

Today most of the eleven finds work the same way: one press, one short animation, a small popup with a placeholder sentence. The visitor does nothing but press, nothing changes for good, and what comes back is a line that is not written yet.

After this build each find is a small toy:

- it is alive before it is touched, and it notices the visitor coming;
- playing it takes two to four moves of the visitor's own, and each move changes it;
- what it gives back is something to look at, or something true from the journey (a real piece, a real date, a real line already on a card). A placeholder sentence never stands alone as the reward;
- it stays changed afterwards, so the map shows where the visitor has been.

No fact, quote or story about Dan is invented anywhere. Lines only Dan can write stay as marked slots (section 3.5).

## 2. Hard rules

The sandbox on this machine is off, so these matter.

- Change files only inside `design/journey-map/`, and only these:
  - `finds.mjs`, and new sibling modules you split it into (suggested: `findkit.mjs` for the shared kit, one module per group of finds, `tafl.mjs` for the game's rules). `finds.mjs` keeps its four exports: `findsBuild`, `findsFrame`, `findsPointer`, `findsCloseAll`.
  - `art.mjs`: the find drawings, the finds block of `bigMap`, and `marker`, `knot` and `yggdrasil` only to add an id or a class. New exports are fine. Nothing else in the map's drawing changes: `bigMap().sea`, `.fill` and `.coast` must come out exactly as they do now (section 18 checks it).
  - `data.mjs`, but not one value in its `STARS`, `DEPTH` or `NOVA` tables: those are being tuned in the review while you build.
  - `map.css`, `timeline.mjs`, `cards.mjs`, `steps.mjs`, `tools/check.mjs`
  - `trip.mjs`: only the one export in section 3.3. Not one other line.
  - `main.mjs`: wiring only.
  - `depth.mjs`: only the one export in section 8.
  - new: `tools/finds-test.mjs`, `tools/tafl-test.mjs` (Part B), `FINDS-BUILD.md`
  - written by the pack tools: `joined.html`, `dist/journey-map.html`, `dist/journey-joined.html`
- Never change anything in `hero-copy/`, `reference/` or `assets/`. Never change `BRIEF.md`, `JOIN.md`, `STEPS.md`, `DEPTH.md`, `FINDS.md`, `BUILD.md`, `JOIN-BUILD.md`, `STEPS-BUILD.md`, `DEPTH-BUILD.md`, `pace.mjs`, `stars.mjs`, `footer.mjs`, `join.mjs`, `join.css` or `index.html`. Change `tools/pack.mjs` or `tools/pack-joined.mjs` only if packing fails without it, and say why in your report.
- Never touch any other path on the machine. Never run git. Never install anything. No network access, at build time or at run time.
- Do not start reviewer agents or sub-agents, even if your global instructions say to. The review happens elsewhere, in a real browser. Do not leave a server running. Do not claim a visual check you did not make.
- You may run `node` on files inside `design/journey-map/`.
- Module style, as now (`tools/check.mjs` enforces it): named exports and named imports only, each import on one line from a sibling file, no default exports, no dynamic imports, no top-level await, every top-level name unique across all modules, no colour literal outside `data.mjs`, no colour literal in `map.css`. Every line of copy and every number that shapes a look or a timing lives in `data.mjs`.
- Colours: only the ones in `C`. Red stays reserved for the traveller, the X, the find markers and the playhead, plus the two uses the finds already have (the chosen craft word on the wayfinder, the trace on the rune stone). A card may use its own place's colours inside the card. The warm orange stays in the supernova only: fire here is Paper.
- Drawings are in the map's own line style: the `o`, `g`, `l`, `t`, `pf` classes, lines that keep their weight at any size. No photos, no textures, no gradients on drawings. Soft things (mist, glow, light) are the only gradients.
- An animation always moves the thing that is already there. Nothing is swapped for a copy. Two allowed forms: a pose change inside one group that happens in a single frame while the thing is moving (a bird opening its wings), and small particles that are born and die (section 3.4).
- Nothing from any game, film or show. The Norse material is the mythology itself.
- A find never changes `P`. In Steps mode a pressed find gets the camera and the trip rests until the visitor moves on (section 3.3). In Scroll mode and in reduced motion the trip never waits for a find and the camera never moves for one.
- Performance: change only `transform` and `opacity` (and an attribute a shape needs, such as a path's `d` at the moment it is made) in the frame loop. No layout reads in the frame loop. No animated `filter`, no SVG filter on anything new. A find that is off screen and not in the middle of a play does nothing in the frame loop.

## 3. What every find gets (the kit)

Build these once and use them in every find.

### 3.1 A find's life

Each find keeps: its place (`x`, `y`, map units), a radius `rad` that covers everything it draws, whether it is on screen, whether it is awake, and what it has kept.

- **On screen:** `toScreen(st, [x, y])` lies inside the view grown by `rad * st.cam.s + 40` px. Work it out once a frame per find.
- **Asleep** (on screen, nobody near): a small loop of its own, given per find.
- **Awake** (the pointer is near, or it has keyboard focus, or it holds the camera): a reaction, given per find.
- **Play:** the moves, given per find.
- **Kept:** what stays for the rest of the visit. Nothing is stored between visits.

### 3.2 What a find looks at

`attend(find, reach)` returns a map point or null:

1. the pointer, if the device can hover (`matchMedia('(hover: hover)')`), the pointer moved in the last `FIND_PLAY.fresh` seconds, and it is within `reach` map units of the find;
2. else the traveller (`st.trav`), if there is one and it is within `2 * reach`;
3. else null.

So the ravens and the serpent watch the red star go by when nobody is pointing at them.

### 3.3 A pressed find gets the camera (Steps mode)

Measured at 1440 by 900: the trip runs at 2.54 px to a map unit, so a chest is 46 px across and a raven 33 px. On a phone it is 1.5 px to a unit. That is too small to play with. And today a find pressed while the trip is moving plays while it is carried off screen and under the next card.

One mechanism fixes both. **In Steps mode a press on a find gives that find the camera.** The camera glides in on it, the open card folds out of the way, the trip rests where it is, and `P` never changes. Back, Escape or moving on gives the camera back.

This replaces the visit by a jump. Remove `stepsFind`, `findNeedsVisit`, `findVisitP`, the replayed press (`FD.replayEvent` and the two listeners that wait for it) and `SC.returnP`. The Ink cut stays for the timeline and the mini-map only.

**The view.** Every find has a view, `[x, y, r]` in map units: the circle that has to fit on screen while the find is played, with room for its popup. Put `view` on each row of `FINDS`:

```js
wayfinder [240, 660, 150]   // wide on purpose: the sight lines have to be seen arriving
ravens    [456, 164, 44]
serpent   [430, 78, 118]    // all three places it surfaces
beacon    [468, 498, 92]    // the tower and its four notes
runestone [250, 500, 40]
tafl      [112, 218, 34]
mist      [154, 436, 62]
horn      [46, 470, 30]
well      [300, 352, 66]    // the well and the tree above it
```

A chest's view is its own place plus `focus.chest` (`[dx, dy, r]`). The longship's is the place `trip.mjs` has drawn the ship at that moment plus `focus.ship`. `hoards` and `longship` get no `view` in `FINDS`.

**`trip.mjs`** gains one export and changes in no other way:

```js
// Rewrites st for a find that has the camera. view is [x, y, r]; k runs from 0 (the trip's own camera) to 1.
export function tripFocus(st, view, k) { /* ... */ }
```

With `F = FIND_PLAY.focus`:

- the scale to reach: `sF = clamp(F.fill * Math.min(VIEW.w, VIEW.h) / (2 * r), Math.max(VIEW.s0, least * VIEW.sT), F.most * VIEW.sT)`, where `least` is the view's fourth number if it has one and `F.least` if not. So on a narrow phone a wide view never backs far out of the trip's own scale, and only the horn's view of the whole map (`focus.wide`, fourth number 0) may go all the way out;
- the scale now: `s = st.cam.s * (sF / st.cam.s) ** k`;
- the view's middle crosses the screen in a straight line, from where the trip's own camera has it, `toScreen(st, [x, y])` taken before anything is changed, to `[F.at[0] * VIEW.w, F.at[1] * VIEW.h]`. Call the point for this `k` `p`;
- `st.cam = { s, tx: p[0] - x * s, ty: p[1] - y * s, ax, ay }`, with `ax` and `ay` going the same way from their old values to `F.at[0] * VIEW.w` and `F.at[1] * VIEW.h`;
- the card steps aside and the map comes back up to full strength: every `st.cardK[i]` and `st.cardOpen` are multiplied by `1 - k`, and `st.dim` becomes `lerp(st.dim, 1, k)`;
- at `k = 0` it changes nothing at all, to the last digit.

**`steps.mjs`** owns the focus. `SC.focus` is null, or holds the find's id, the view it is easing from and the view it is easing to, how far that easing has got, the strength `k`, and whether it is held or letting go.

- `stepsFocus(id, view)`. Only in Steps mode, never in reduced motion, never during a jump, and only while the map is there to be played with (at the current `P`, `handoffT` is 1 and `rushT` is 0); otherwise it does nothing and returns false. It cancels a playing move where it is, so the trip rests at that `P`, between beats if need be, and Next and Back work from there as they do from any `P`. If no find has the camera, `k` rises from 0 to 1 over `focus.in` seconds. If another find has it, or this find asks for another view, the view eases from what it is now to the new one over `focus.swap` seconds (`x` and `y` in a straight line, `r` geometrically, ease in and out) and `k` goes on to 1.
- `stepsRelease()`: `k` falls to 0 over `focus.out` seconds, then `SC.focus` is null.
- `stepsFrame` advances both. `stepsFocusNow()` returns null, or `{ id, view, k }` with the view as eased and `k` eased in and out.
- **Letting go.** Back, and everything that acts as Back (wheel up, swipe, the arrow keys, Page Up), only lets go: the trip stays at its `P`. Next, and everything that acts as Next, lets go and goes on. Home, End, the timeline, the mini-map and the mode switch let go and do what they do. Escape closes what is open; with nothing open it lets go.
- `JOURNEY.visiting` is true while a find holds the camera, so the dusk veil thins as it does now for a visit. `JOURNEY.focus` is that find's id, or null. The root has the class `jm-focus` while it is held.
- While it is held the back button is always shown, and it is a pill that reads `COPY.steps.returnTo` beside its arrow (change that line to "Back to the trail"); its spoken label is the same text.

**`main.mjs`**, in `frame`, straight after `tripState(P)` and before anything reads `st`: `const f = stepsFocusNow(); if (f) tripFocus(st, f.view, f.k);`. The frame counts as `moved` while the focus is changing (compare `k` and the view with the last frame's). Nothing else changes there: the cards, the timeline, the depth layers, the stars, the finds and the popups already read `st`.

**`finds.mjs`:**

- In Steps mode the capture handler does one thing. A click, or Enter or Space, on a find that does not hold the camera calls `stepsFocus(id, view)` and then lets the press through: the press that calls the camera is also the find's first move. A find that holds the camera just gets the press. When `stepsFocus` refuses (a jump is playing, or the map is not there yet or any more) the press is swallowed and nothing plays. The pointer-down guard goes: a drag may start on the same press.
- Hovering never calls the camera. Only a press does.
- Every screen-to-map conversion uses the frame's state (`FD.st`), never a fresh `tripState`, so the pointer stays right while the camera moves.
- When the camera lets go, an open popup or sheet closes (`findsCloseAll`). The find keeps what it has kept.
- A find may ask for another view while it holds the camera, with the same call. The horn does (section 12).
- In Scroll mode and in reduced motion there is no focus: a find plays where it is, at the size it is, as now.

### 3.4 Bits (small particles)

One pool of `FIND_PLAY.bits.pool` `<path>` elements in `<g id="f-bits" pointer-events="none">`, the last child of `#finds`. A dead bit is hidden with `display: none` and reused; when the pool is full the oldest is reused.

```js
// kind: path data (origin at the bit's middle, map units) and class
dot     'M-.8 0a.8 .8 0 1 0 1.6 0a.8 .8 0 1 0 -1.6 0Z'    pf
clod    'M-1.4 .6L-.6 -1.1L1.2 -.7L1.5 .8L-.2 1.3Z'         g
star    starPath(0, 0, 2.2)                                 pf, no stroke
drop    'M0 -1.6Q1.1 .2 0 1.1Q-1.1 .2 0 -1.6Z'             pf, no stroke
spark   'M0 0V-2.4'                                         l
feather 'M0 -3Q1.5 0 0 3Q-1.5 0 0 -3Z'                     g
puff    'M-3.2 0a3.2 3.2 0 1 0 6.4 0a3.2 3.2 0 1 0 -6.4 0Z' Paper fill, no stroke, opacity at most .22
ring    'M-3 0a3 1 0 1 0 6 0a3 1 0 1 0 -6 0Z'              t (a ripple: it only grows and fades)
```

`findBits(kind, x, y, n, o)` throws `n` bits from a map point. `o` holds `speed: [min, max]` (map units a second), `dir: [from, to]` (degrees, 0 is east, -90 is up the screen), `g` (gravity, units a second squared, down the screen), `drag`, `life: [min, max]` (seconds), `size: [start, end]` (scale), `spin` (degrees a second) and `alpha`. Each frame: speed gains gravity and loses drag, place gains speed, opacity is `alpha * (1 - (age / life) ** 2)`, and the bit's one `transform` is `translate rotate scale`. All randomness comes from one seeded `rnd`. No bits in reduced motion.

### 3.5 Popups, cards and slots

- A popup grows out of its anchor: scale 0.6 to 1 with a slight overshoot and fades in over 0.22 s, from a small tail (a 10 by 6 px triangle) that points at the anchor. Put the scale on an inner element so the placing transform stays as it is.
- A popup never leaves the view. Measure it once when it opens (not in the frame loop). If there is no room above the anchor it opens below, tail on top. Keep it 8 px inside the left and right edges; the tail stays on the anchor.
- **Slots.** A line only Dan can write is a slot. In `data.mjs` it is an object with its placeholder text and `todo: 1`. It is drawn as a quiet chip: 11 px, Dim text, a 1 px dashed Mid border, with the kicker `COPY.todo` above it. A slot comes last in whatever it sits in, under the real payoff, and never opens by itself. When Dan writes a line, removing `todo` makes it ordinary text.
- One popup and one sheet at a time, as now. Escape closes them, as now.
- While a sheet is open: arrow keys, Space, Page keys, Home and End pressed inside it belong to the sheet (`preventDefault`, so the trip does not step), and a wheel over the sheet does nothing.

### 3.6 Found

On a find's first play:

1. Its numbered marker (the six main finds) fills: the circle turns Red and the numeral Ink. Give each marker a group with `class="mk"` and `id="mk-<find id>"` in `art.mjs` (the one in the legend gets no id), and switch a class.
2. A star flies to the count. One reusable 14 px star in the overlay (an HTML element holding the map's four-point star, Paper) starts at the find's place on screen and reaches the middle of the count at the right end of the timeline in `star.time` seconds, ease in and out, rising `star.arc` px on the way. Read the count's box once, when the flight starts. On landing the count takes the new number and bumps (scale 1.3 to 1 over `star.bump` seconds).
3. `tlSetCount` stays the way the count is written.

### 3.7 Hearing the horn

Every find has a `hear()`: its small answer when the horn's sound reaches it (section 12). Each find's section gives it. Build `hear()` with the find; the horn that calls it comes in Part B. Until then `window.__jm.finds.hear()` (section 17) calls all of them, for the review.

### 3.8 Keyboard, touch, reduced motion

- Every find stays one focusable group with a spoken label. Enter or Space is its main press. Every play can be finished from the keyboard, and each section says how. Keyboard focus counts as being near.
- A sheet is a dialog: keyboard focus moves into it when it opens and back to its find when it closes.
- Touch: nothing depends on hover. A drag that starts on a find never steps the trip (`touch-action: none` on what is dragged). No target is under 17 map units across.
- Reduced motion keeps today's stacked page. Every play still works there with each move landing at once: no bits, no loops, no flights, and the camera stays where it is.

## 4. The wayfinder (Part A)

It stays where it is and keeps its job: pick a craft, see which stops used it. It gains the feel of an instrument and three things to see.

- **The needle is a spring.** Angle and speed: each frame `speed += (way.stiff * diff - way.damp * speed) * dt`, `angle += speed * dt`, with `diff` the shortest way to the target. It overshoots and settles. While dragged it follows the pointer exactly.
- **Asleep:** the drift it has now. **Awake** (pointer within `way.near`, no craft chosen): the needle points at the pointer.
- **Picking a craft** (drag, press an arm, arrow keys, as now): the word turns Red and the map dims, as now. New:
  - the chosen arm's line thickens to 2.2 px and the arm pulses once (scale 1 to 1.12 to 1 about the hub, 0.25 s);
  - **sight lines:** one line from the hub to each stop that used the craft, ending `way.short` units before the stop's waypoint. Paper, 1 px, dashed `2 4`, opacity 0.6. They are drawn in a group just before `#f-wayfinder`, so the wayfinder covers their start. They grow out of the hub one after another in trail order (`way.line` seconds each, `way.gap` apart), and as each arrives a ring opens at its stop (radius 6 to 14 units, opacity 0.7 to 0, `way.ping` seconds). Lines to the other stops are not shown. Choosing another craft takes the old lines back to the hub first;
  - **the tally:** one line of text 22 units under the ring, 5.2 units, Note colour, letter-spacing 1: `FIND_COPY.wayTally` filled in, for example "PRINT: 5 of 6 stops";
  - **the timeline:** `timeline.mjs` gains `tlSetCraft(mask)` (a list of true or false per stop, or null). Blocks of the lit stops get a 1 px Paper outline; the others fall to 0.35.
  - `cardsSetCraft` in `cards.mjs` takes the same mask instead of a craft name. The hoards light as now.
- **All four.** Once the visitor has chosen each of the four crafts at least once, a ring breathes around the hub (radius 4 to 9 units, 1.6 s, looping). Pressing the hub with nothing chosen then lights every stop that used all four crafts (worked out from `STOPS`, never hard-coded): all four words turn Red, the needle turns steadily at 40 degrees a second, the sight lines to those stops are solid at 0.9, and the tally reads `FIND_COPY.wayAll`, for example "ALL FOUR: Lennard, 2023 to now". If no stop used all four, this state does not exist. Pressing the hub with something chosen clears it, as now. The arrow keys step through the four crafts, and through all four as a fifth once it is unlocked.
- **Kept:** after the first pick the ring of runes turns slowly for the rest of the visit (`way.runes` degrees a second). Put the rune paths in one group so they turn together.
- **`hear()`:** the needle spins one full turn (`way.spin` seconds) and settles.
- Found on the first pick, as now.

## 5. Hoards (Part A)

Five chests, where they are now. Today a press digs one up for you. Now the visitor digs.

Each chest keeps `digs` (0 to 3) and whether it is open.

- **Asleep:** every `hoard.glint[0]` to `hoard.glint[1]` seconds (its own seeded rhythm) a small star glints on the scratch: `starPath(0, -4, 5)`, scale 0 to 1 to 0 with a 45 degree turn, 0.5 s.
- **Awake** (pointer within `hoard.near`): the scratch's two crossing strokes thicken to 1.6 px, and two clods hop (`clod`, speed 8, up, gravity 40).
- **Dig** (a press while `digs < 3`): `digs` goes up by one.
  - Clods fly from the hole: 7 `clod` bits, speed 18 to 34, directions -150 to -30, gravity 90, life 0.6 s, with 2 `puff` bits.
  - A hole opens under the chest: an ellipse of class `o` at the ground point, drawn before the chest's clip group. Its `rx` is `hoard.hole[digs - 1]` (local units), `ry` is 0.28 of that. The scratch fades out on the first dig.
  - A pile of earth grows beside it: `<path class="g" d="M14 2q6 -10 13 0z"/>`, scale 0.5, 0.75, 1.
  - The chest rises a third: its travel is `60 * (1 - digs / 3)` local units, over `hoard.rise` seconds with a back-out overshoot of `hoard.over` units.
  - Holding the pointer down keeps digging, one dig every `hoard.repeat` seconds. With a pointer the dig happens on pointer down; a key press or a replayed press digs once.
- **After the third dig** the chest is out. It rattles: plus and minus 4 degrees, three times, in `hoard.rattle` seconds, about its ground point.
- **Open** (the next press, or `hoard.openHold` seconds later if the pointer is still held): the lid springs back as now but with a back-out overshoot, the glow inside comes up to 1 in 0.3 s and rests at 0.6, the eight stars burst as now, 6 `star` bits rise slowly (life 1.1 s), and the piece's card comes up out of the chest.
- **The piece card** (a popup, class `piece`, 260 px wide, anchored 18 units above the chest), top to bottom:
  - a 3 px top edge in the place's `mark` colour;
  - kicker: the stop's name, then `FIND_COPY.hoardTally` filled in ("Hoard 2 of 5", counting chests opened so far);
  - the piece: its image where there is one. Where there is none, a frame with a hairline border holding a line drawing of the kind of piece (64 px, from the new export `pieceIcon(kind)`) over the words `COPY.pieceToCome`. Each hoard in `FIND_COPY.hoards` gains a `kind`: `bundle` (Laurier), `screen` (SafetyDrivesUs), `book` (annual report), `book` (Melanoma Canada), `sheet` (1 King Street W);
  - the title, and the "See the case study" link, which still does nothing.

```js
// pieceIcon(kind): viewBox -32 -32 64 64
sheet  '<rect class="l" x="-14" y="-20" width="28" height="40"/><rect class="t" x="-10" y="-16" width="20" height="12"/><path class="t" d="M-10 2H10M-10 7H10M-10 12H4"/>'
book   '<path class="l" d="M0 -16Q-10 -20 -22 -17V15Q-10 12 0 16Q10 12 22 15V-17Q10 -20 0 -16Z"/><path class="t" d="M0 -16V16M-17 -10Q-9 -12 -4 -10M-17 -4Q-9 -6 -4 -4M-17 2Q-9 0 -4 2M4 -10Q9 -12 17 -10M4 -4Q9 -6 17 -4"/>'
screen '<rect class="l" x="-22" y="-16" width="44" height="32" rx="2"/><path class="t" d="M-22 -9H22"/><circle class="pf" cx="-18" cy="-12.5" r="1"/><circle class="pf" cx="-14.5" cy="-12.5" r="1"/><path class="t" d="M-16 -3H2M-16 3H10M-16 9H-2"/><rect class="t" x="8" y="-4" width="10" height="10"/>'
bundle '<rect class="l" x="-16" y="-12" width="32" height="26"/><path class="t" d="M0 -12V14M-16 1H16"/><path class="l" d="M0 -12q-6 -8 -9 -3q-1 4 9 3q10 1 9 -3q-3 -5 -9 3"/>'
```

- **Kept:** an opened chest stays out and open, glow at 0.35. Pressing it again brings its card back with a small bounce of the lid. Closing the card leaves the chest open.
- **`hear()`:** an unopened chest's scratch jumps 2 units and glints.
- Found when the first chest opens.

## 6. Huginn and Muninn (Part A)

Thought and memory. In the myth they fly out over the world each day and come back to tell what they saw. So: they fly out, and each brings something back.

**The drawing.** Today the two birds overlap and read as one. Stand them back to back on the stone, looking out: Huginn on the left facing left, Muninn on the right facing right. `finds.mjs` owns each bird's whole `transform` from now on (place, mirror, scale, turn). Perched: Huginn `translate(-5.5 -34) scale(-.85 .85)`, Muninn `translate(6 -33.5) scale(.85)`, in the stone's units.

Each bird is one group with two poses inside it, `rv-sit` (today's body and head) and `rv-fly`, shown one at a time, plus an empty group `rv-item` at the beak.

```js
// rv-fly: flying to the right, wings up. Origin at the body's middle. Draw in this order.
far wing  '<path class="g" d="M-2 -3Q-4 -17 5 -22L4.5 -17L8.5 -17.5L6 -13L9.5 -12.5Q5 -6 2 -3.5Z"/>'
tail      '<path class="g" d="M-11 -1L-19 -4.5L-20 -.5L-18.5 3L-11 1.5Z"/>'
body      '<path class="g" d="M-12 0Q-6 -5.5 3 -5.5Q8 -5.5 10.5 -3.5L15 -2L10.5 -.8Q6 3 -3 2.2Q-9 2 -12 0Z"/>'
eye       '<circle class="pf" cx="8.6" cy="-3.4" r=".5"/>'
near wing '<path class="g" d="M0 -3.5Q1 -18 12 -23L10.5 -17.8L15 -18L11.5 -13.5L15 -12.5L11 -9.5Q7 -4.5 4.5 -2.5Z"/>'
```

The wings beat by scaling in `y` about the shoulder: the near wing about `(2, -3.5)` between 1 and -0.5, the far wing about `(0, -3.5)` between 0.9 and -0.45, `raven.flap` beats a second.

- **Asleep:** heads follow `attend(find, 120)`, as they follow the pointer now; with nothing to look at they look about slowly. Every `raven.preen[0]` to `raven.preen[1]` seconds one of them, in turn, preens (the head dips 70 degrees to the breast and back, 0.5 s) or ruffles (the body swells to 1.1 and back, 0.3 s).
- **Awake** (pointer within `raven.near`): both ruffle once, and the nearer one sidesteps `raven.shy` units away along the top of the stone, coming back when the pointer leaves.
- **Play:** a press sends the next bird out. Huginn goes first, then Muninn, then Huginn again. A press while one is away does nothing.
  - **The flight**, in map units, from the bird's perch `A`: let `u` be the unit vector toward where it is going and `n` its left normal. Out: `A + u * raven.reach * s + n * 26 * sin(PI * s)` for `s` from 0 to 1 over `raven.out` seconds, ease-in. Away for `raven.away` seconds. Back along the same line with the bend on the other side, `s` from 1 to 0 over `raven.back` seconds, ease-out.
  - It turns to face along its path. When the path points left, mirror it so it is never upside down.
  - It rises as it goes: scale 1 to `raven.rise` by `s = 0.5`. It fades out between `s = 0.65` and 1, and comes back the same way.
  - Taking off: the pose changes from `rv-sit` to `rv-fly` in the first frame of the flight, and two `feather` bits drift down (gravity 12, drag 2, life 1.4 s, slow spin). Landing: the last `raven.land` seconds it flares (the body tilts up 25 degrees, wings held up), then the pose changes back and it squashes once (scale `y` 0.85 to 1).
  - Coming back it carries something at the beak (`rv-item`): Huginn a rolled strip (a Paper rectangle 4 by 1.6), Muninn a small frame (a rectangle of class `o`, 4 by 3).
- **Huginn, thought,** flies toward a stop: first Laurier, then each next stop in trail order, round again after the sixth. On landing the strip unrolls into a popup above the stone:
  - kicker: `FIND_COPY.huginn`, then `FIND_COPY.ravenFrom` with the stop's short name ("HUGINN, THOUGHT. Brought back from Mohawk");
  - the line: that stop's `copy.took`, the line already on its card under "What I took with me", read from `STOPS`, never copied into another table;
  - under it, small: the stop's dates.
  - A tally grows at the foot of the stone, one scratch for each thought brought back, up to six: `M13 -8V-1`, `M15.5 -8V-1`, `M18 -8V-1`, `M20.5 -8V-1`, `M11.5 -2.5L22 -6.5` (the fifth crosses the four), `M24.5 -8V-1`, class `t` at stroke-opacity 0.9.
- **Muninn, memory,** flies toward the X and brings back the frame, which opens into the reel exactly as today (the iris, the player, five seconds, the iris closing). Add inside the player: the kicker `FIND_COPY.muninn` at the top left, and under the moving shapes a slot (section 3.5) reading `FIND_COPY.reelToCome`.
- **`hear()`:** both take off, fly one loop of 40 units about the stone in `raven.loop` seconds and land. Nothing is brought back.
- Found on the first flight. Kept: the tally.

## 7. The serpent (Part A)

Jörmungandr under "HERE BE DEADLINES". Today: one poke, it sinks, it comes back with a calendar leaf and a placeholder line. Now it is a short chase with an ending.

It has three places to surface (`serpent.spots`, map units): home, then two more in the same sea. `finds.mjs` moves the serpent's inner group between them; the find's `data-x` and `data-y` stay at home.

Add to the drawing, inside `sp-head`: a tongue `<path class="l sp-tongue" d="M-101 -40l-8 1.5M-109 -38.5l-3.5 -2.5M-109 -38.5l-3 3"/>`, the eye as `sp-eye` (the dot it has now) and a shut eye `<path class="l sp-shut" d="M-86.2 -43q2.2 1.8 4.4 0"/>`. Give the leaf's two texts classes so they can be rewritten.

- **Asleep (but awake as a serpent):** the loops ride a travelling wave: loop `j` moves `serpent.bob[0] * sin(2 * PI * (time / serpent.bob[1] - j / 5))` local units in `y`. The head follows `attend(find, 140)`, within 25 degrees, as it follows the pointer now.
- **Awake** (pointer within `serpent.near` of the head): the tongue flicks, scale `x` 0 to 1 to 0 about the snout `(-101, -40)` in `serpent.tongue[0]` seconds, again every `serpent.tongue[1]` seconds. Otherwise the tongue is hidden.
- **A poke** (press) while it is up. Poke `n` is 1, 2 or 3:
  1. It flinches: the head rears 18 degrees in `serpent.flinch` seconds.
  2. It sinks loop by loop as now, with 4 `drop` bits where each loop goes under. Every time in this step and step 4 is multiplied by `serpent.speed[n - 1]`, so it gets quicker.
  3. It swims under water to the next place (home, second, third, home). Move the group there over `serpent.swim[n - 1]` seconds along a line that bulges `serpent.bulge` units to the north, and leave a wake on the surface above it: one `ring` bit every 0.06 s (scale 1 to 3.5, opacity 0.7 to 0, life 0.6 s).
  4. It surfaces there, tail first as now, with a calendar leaf in its teeth showing `FIND_COPY.serpentLeaves[n - 1]`: "FRI / 5 PM", then "TODAY / EOD", then "NOW / ASAP". The leaf flutters (plus and minus 6 degrees, three times a second) while held.
- **After the third surfacing,** half a second later, it eats the deadline:
  - the leaf slides into the mouth (toward `(-86, -42)`, scale to 0, 0.3 s);
  - a gulp runs down the body: the neck, then each loop, then the tail swells to `serpent.gulp[2]` and back, each lasting `serpent.gulp[1]` seconds and starting `serpent.gulp[0]` after the one before;
  - a popup opens by the head: kicker `FIND_COPY.serpentFed` ("DEADLINE MET"), and under it the slot `FIND_COPY.serpentLines[round % 3]`;
  - then it sleeps: the eye shuts, the loops settle `serpent.settle` local units lower, the head rests 10 degrees down, and it breathes (`serpent.breathe[0]` units, every `serpent.breathe[1]` seconds).
- **Poked asleep:** it starts awake (`serpent.wake` seconds: the eye opens, the head lifts) and is ready for a new round from where it lies.
- **`hear()`:** it ducks its head 25 degrees for half a second. Asleep, it opens its eye for a second.
- Found on the first poke. Kept: asleep, where it ended.

## 8. The beacon (Part A)

Today the beam shows four notes while it rests on them and that is all. Now the notes stay read, the fire grows with each one, and at four the beacon is lit.

- **Asleep:** the flame flickers: scale `x` by `1 + 0.08 * sin(11 t) + 0.05 * sin(17.3 t)` and `y` by `1 + 0.12 * sin(13.1 t)` about its foot `(0, -47)`. The beam sweeps as now at opacity `beacon.idle`.
- **Aiming** (drag, arrow keys, as now): the beam is at full opacity while aimed by hand. Enter or Space turns the beam to the next unread note over `beacon.snap` seconds, so the keyboard can finish it.
- **Reading a note:** a note in the light shows its runes, and after `noteDelay` its English line, as now. New: held in the light for `beacon.read` seconds in all, it is read. It flashes (6 `spark` bits, the note swells to 1.12 and back) and from then on it stays on the map at 0.55 when the light is elsewhere, with its line. A note whose line is a slot shows the kicker `COPY.todo` above the line in 3.4 unit Dim capitals.
- **The fire grows.** With `fire` the number of notes read: the flame's size is `beacon.flame[fire]`; a Paper glow sits behind it (the `glow` gradient, 16 local units, opacity `0.15 * fire`); and `fire * beacon.embers` `spark` bits a second rise from the basket (speed 10, up, life 1.2 s) while it is on screen.
- **Lit** (four read): the flame leaps to `beacon.leap[0]` for `beacon.leap[1]` seconds and settles, 14 sparks burst, and from then on, when nobody is aiming, the beam turns all the way round at `beacon.turn` degrees a second and reaches `beacon.reach` times as far (scale the beam and use the longer reach for lighting notes). Other finds can ask `beaconLit()`.
- **The beam lights the dusk.** `depth.mjs` gains one export, `depthBeam(b)`, where `b` is null or `{ x, y, angle, half, reach }` (map units, degrees). When set, the veil in `#air` gets a third hole: a wedge from that point, cut with `destination-out` like the other two, full at the origin and fading to nothing at `reach`, soft over the last 4 degrees at each side. `lightAt` counts it. `#air` redraws while the beam moves and is on screen. Call it every frame the beacon is on screen with the veil up, and with null otherwise. If `depth.mjs` has no veil to cut (read `DEPTH-BUILD.md`), leave this bullet out and say so.
- **`hear()`:** the flame drops to 0.6 of its size for 0.3 s, then flares.
- Found on the first aim, as now. Kept: the notes read, the fire, the turning beam.

## 9. The rune stone (Part A)

"Press to take a rubbing." Today the stone does it for you and a poster appears. Now the visitor takes the rubbing, the rubbing can be read, and the poster is its other side.

1. **Press.** The band traces itself in Red as now, in `rune.carving` seconds. Then the sheet grows from the stone to the middle of the view (`rune.grow` seconds), as the poster does now.
2. **The sheet** is the existing flip card (`pz`), 300 by 400 px. Its front is now the rubbing; its back is the poster. The front is one `<svg viewBox="0 0 300 400">`:
   - the paper: a Paper rectangle, and the stone's outline at 0.1 opacity so there is something to aim at;
   - the charcoal, inside a mask, clipped to the outline: Ink at 0.34; hatching `M x 0 L (x - 231) 400` for `x` from -200 to 520 in steps of 7, each shifted by up to 2 at random (seeded), Ink, 2.6 px, opacity 0.42; a second hatching `M x 0 L (x - 107) 400` for `x` from -100 to 420 in steps of 11, 1.6 px, opacity 0.3; the outline again at 0.45, 1.5 px;
   - the carving, in the same mask, over the charcoal, Paper, 4.4 px, round ends: the band's two lines, their feet, and four lines of runes;
   - the mask: black, with one soft white circle added for every rub (radius `rune.r`, opaque to 60 percent of its radius, then fading to nothing).

```js
outline    'M40 392L28 150Q36 34 150 12Q264 34 272 156L260 392Z'
band outer 'M60 380L50 152Q57 56 150 34Q243 56 250 158L240 380'
band inner 'M74 380L64 154Q70 70 150 50Q230 70 236 160L226 380'
feet       'M60 380H74M226 380H240'   and a Paper dot of radius 2.2 at (67, 372)
runes      the words of FIND_COPY.runestoneRunes, one word a line: 'first', 'sketch', 'final', 'cut'.
           Rune height 30, gap 0.32 of the height, each line centred on x = 150, tops at y = 92, 158, 224, 290.
```

3. **Rubbing.** Drag across the sheet with a pointer or a finger: a circle is added every `rune.step` px of travel, and one for a plain press. A grid of `rune.grid[0]` by `rune.grid[1]` cells covers the stone (`x` 40 to 260, `y` 30 to 390); a cell counts as rubbed when a circle's middle is within 30 px of the cell's middle. If nothing has been rubbed `rune.auto[0]` seconds after the sheet opens, or straight away when it was opened from the keyboard, the sheet rubs itself: a zigzag of `rune.auto[2]` passes over the stone in `rune.auto[1]` seconds. A touch takes over from it at any time. A button under the sheet, `FIND_COPY.rubDo`, starts the same zigzag.
4. **Read.** When `rune.done` of the cells are rubbed, the rest fill in over `rune.fill` seconds, and the rubbing is read: under each rune its letter appears (13 px, weight 800, Paper, centred under the rune, 15 px below it), one after another, `rune.letter[0]` seconds apart, each rising 4 px and fading in over `rune.letter[1]` seconds. Nineteen letters: FIRST, SKETCH, FINAL, CUT. Export a helper from `art.mjs` that gives each rune's middle. The runes stay; the letters are added.
5. **Flip.** The controls appear when the reading is done: `COPY.flip` and `COPY.close`. Flip turns the sheet to the poster (the markup it has now). The first time, the stamp lands: it waits `rune.stamp[0]` seconds from the start of the flip at scale `rune.stamp[2]` and opacity 0, then drops to scale 1 at full opacity in `rune.stamp[1]` seconds, and the sheet shakes (`rune.shake[0]` px, twice, in `rune.shake[1]` seconds). The poster's old back, the two lines "Stock: to come" and "The brief: to come", moves to the poster's foot as one slot.
6. On a device that can hover, the sheet tilts up to `rune.tilt` degrees toward the pointer. Closing shrinks the sheet back into the stone in `rune.close` seconds.

- **Asleep:** nothing. **Awake** (pointer within 24 units): a short bright dash runs along the band (the trace path, Paper, `stroke-dasharray: 6 200`, the offset moving), once every 1.5 s.
- **Kept:** the stone's runes brighten (stroke-opacity 1). A later press opens the sheet with the rubbing done and read.
- **`hear()`:** the dash runs once.
- Found when the sheet opens.

---

# Part B

## 10. The hnefatafl board

Laurier is where Dan studied game design, and hnefatafl is the board game the Norse played. Today a piece slides one square. Now the board can be played.

### 10.1 The rules (`tafl.mjs`, pure, no DOM)

The seven by seven game, brandubh, with the rules kept short.

- Squares are numbered `row * 7 + column`. Corners: 0, 6, 42, 48. Centre: 24.
- Start: the king on 24; four defenders on 17, 23, 25, 31; eight attackers on 3, 10, 21, 22, 26, 27, 38, 45.
- The visitor plays the king's side and moves first. The page plays the attackers.
- A piece moves any number of empty squares along its row or column, and never jumps. Only the king may stop on the centre or a corner. Any piece may pass over the empty centre.
- Taking: when a piece lands, look at each of its four neighbours that holds an enemy. If the square straight beyond that enemy holds one of the mover's own pieces, or is a corner, or is the empty centre, the enemy is taken. The king takes like any other piece, but he is taken only when he is shut in on all four sides, each by an attacker, a corner or the empty centre (`rules.kingSides: 4`); against the edge he cannot be taken (`rules.kingEdge: false`). A piece that moves between two enemies is safe. (Changed in the review. With the king taken like any other piece, a casual player lost nearly every game within five moves.)
- The king's side wins when the king stands on a corner. The attackers win when the king is taken. A side with no move loses. After 80 moves with no winner it is a draw.

Exports: `taflStart()`, `taflMoves(state, from)`, `taflPlay(state, from, to)` (returns the new state, with the squares taken and the winner if there is one) and `taflReply(state, random)`.

**The reply.** Try every attacker move and keep the best score, breaking ties with `random`:

- plus 1000 if it takes the king;
- minus 900 if, after it, the king can reach a corner in one move;
- minus 120 for each square on the edge the king can reach in one move from which a corner is then open;
- plus 30 for each defender taken;
- minus 25 for each attacker the king's side could then take in one move (the worst case over its replies);
- minus 2 for each move the king has;
- plus 1 if the piece ends next to the king.

It is meant to block and to be beaten. A visitor who looks for two corners at once should win in about ten moves.

### 10.2 On the map

The small board shows the true starting position (today's pieces are scattered), with one element per piece so it can mirror the game. Asleep: nothing. Awake (pointer within 20 units): the king swells from 1.3 to 1.7 and back, once a second.

### 10.3 The sheet

A press lifts the board into a sheet in the middle of the view (grown from the board like the other sheets): a panel in the popup's style (Ink ground, Line border, 10 px corners), 312 px wide, holding:

- the board, 280 px, cells of 40: a Paper outline, grid lines at 0.28, a Paper cross on each corner (two strokes of 18 px), a diamond outline on the centre;
- pieces: attackers are Ink discs with a 1.6 px Paper line, radius 13; defenders are Paper discs, radius 13; the king is a Paper disc, radius 15.5, with an Ink four-point star (`starPath`, size 9);
- a status line (`role="status"`): `taflYou` on the visitor's turn, `taflThem` while the page replies, then `taflWin`, `taflLose` or `taflDraw`;
- the rules, `taflRule`, small and Dim, in a row of its own (three lines at this width, `ruleH: 49`);
- when a game ends, the slot `FIND_COPY.tafl`;
- two buttons: `taflNew` and `COPY.close`.

Play: press one of your pieces and it gets a dashed ring, and each square it can reach gets a dot (radius 4, opacity 0.55). Press a dot and the piece slides there (0.05 s a square, at least 0.12 s, at most 0.3 s). A taken piece slides off the board to a row beside it (attackers below, defenders above). The reply comes 0.45 s later and slides the same way. A new game slides every piece home.

Keyboard: the arrow keys move a cursor square (a 2 px Paper ring on the cell), Enter or Space picks a piece and then a square, Escape closes. Each cell has a spoken label ("c4, attacker"; columns a to g, rows 1 to 7), and each move is spoken through the status line.

- **Kept:** the board on the map shows the game as it stands when the sheet closes; opening it again goes on with that game.
- **`hear()`:** the pieces on the map hop (1.2 units, one after another).
- Found when the sheet opens.

## 11. The mist of 2020

Today the mist wipes off and there is nothing under it. Now it hides the way, and the way is marked.

- **Thicker:** six ellipses, the group at opacity 0.62.
- **Under it,** drawn inside the find before the mist: three cairns beside the trail, at `[138, 418]`, `[166, 452]` and `[200, 440]`, scale 0.8. Travellers build cairns to mark a path through fog.

```js
cairn '<path class="g" d="M-6.5 0L-5.6 -2.8L5.2 -3.2L6.8 0Z"/><path class="g" d="M-4.8 -3L-4.2 -5.6L4.6 -5.9L4 -3.1Z"/><path class="g" d="M-3.4 -5.7L-3 -8L2.6 -8.3L3.4 -5.9Z"/><path class="g" d="M-1.6 -8.1L-1 -10.2L1.6 -10.4L1.4 -8.2Z"/>'
```

- **Wiping** as now (a mouse wipes as it moves, a press wipes more), and a finger or pen wipes while it is down and moving (radius 14). Each wipe throws one `puff` bit that drifts the way the pointer was going (life 0.8 s).
- **The traveller cuts through it:** while the mist is not lifted and the traveller is inside the mist's box grown by 10 units, wipe at the traveller with radius 7. That does not count as found.
- **Lifting:** a grid of 8 by 4 cells over the mist's box; a cell is clear when a wipe's middle is within 10 units of the cell's middle. When three quarters are clear, the rest lifts: the mist group fades to nothing over 1.2 s (opacity only) while 8 `puff` bits drift east. Then each cairn's top stone glints in turn (the hoard's glint, 0.15 s apart).
- Keyboard: each Enter or Space clears the next third.
- **`hear()`:** the mist's group slides 6 units east and back in 0.8 s.
- Found on the first wipe, as now. Kept: lifted, cairns showing.

## 12. The horn

Today it lifts and says "Skál." Now it can also be sounded, and the whole map answers. It is also how a visitor finds what they missed.

- **Asleep:** nothing. **Awake** (pointer within 24 units): it tips 6 degrees toward the pointer.
- **First press:** it is raised as now, with the popup: "Skál." and under it the slot `FIND_COPY.horn[1]`.
- **Pressed again while raised, or held down for 0.45 s:** it is sounded.
  - In Steps mode it asks for the wide view, `stepsFocus('horn', focus.wide)`, so the camera pulls back and the visitor sees the whole map answer. When the last ring is gone it asks for its own view again.
  - It swells (scale 1 to 1.12 and back, six times a second) for 0.9 s.
  - Four rings leave the bell, the map point `[f.x + 7, f.y - 14]`, 0.18 s apart: circles of class `t` in a group `#hn-rings` in `#finds`, `pointer-events: none`. A ring's radius is `4 + 150 * age` map units and its opacity `0.7 * (1 - age / 1.8) ** 1.5`; it is gone at 1.8 s.
  - As the first ring reaches each find (its distance from the bell over 150 units a second), that find's `hear()` runs. If the find has not been found yet, a glint shows on it as well: `starPath` size 5 at its marker, or at its place if it has none, scale 0 to 1 to 0 with a quarter turn, 0.6 s.
  - Then the horn comes down and the popup closes.
- Label: "A horn on the shore. Press to raise it, press again to sound it."
- Found on the first press.

## 13. Urd's Well

Today it undoes the last find. That goes. In the myth three Norns keep the well at the foot of Yggdrasil: Urd, what was; Verdandi, what is; Skuld, what shall be. They water the tree from it every day. So: drop a pebble in, and the well answers from the journey itself.

- **Asleep:** every 4 to 7 seconds a drop falls from the root at `[300, 381]` to the water at `[300, 390]` (a `drop` bit, 0.35 s), then one `ring`.
- **Press:** a pebble (a Paper dot, radius 1.2) arcs from the pointer, or from 30 units to the left and 34 above the well for a key press, into the middle of the well in 0.45 s, 16 units high at its top. It lands with 6 `drop` bits (speed 22, up, gravity 80), and the well's three rings now run outward (scale 0.2 to 1.25, opacity 0.9 to 0, 0.18 s apart).
- **The answer:** a popup above the well. The presses go round the three Norns in order. Let `cur` be the last stop the trip has visited (`st.visited`), or -1.
  - Urd: kicker "URD, WHAT WAS"; the line is the stop before `cur`, short name and dates, or `FIND_COPY.wellNone` when there is none.
  - Verdandi: kicker "VERDANDI, WHAT IS"; the line is stop `cur`, or `FIND_COPY.wellMap` before the first stop.
  - Skuld: kicker "SKULD, WHAT SHALL BE"; the line is the stop after `cur`, or `FIND_COPY.wellNext` after the last.
  Names and dates come from `STOPS`. The kickers come from `FIND_COPY.norns`.
- **The tree is watered:** each of the first three presses sends a Paper dot up the trunk (from `[300, 374]` to `[300, 338]` in 0.4 s) and then five small stars open in the crown (`starPath`, size 2.4, Paper, no stroke; scale 0 to 1.3 to 1 in 0.3 s, 0.06 s apart). They stay and twinkle slowly (opacity 0.6 to 1, each in its own time). Places, from `MAP.ygg`:

```js
[[-24, -44], [-6, -56], [12, -60], [26, -50], [2, -40]]
[[-30, -52], [-14, -66], [8, -70], [28, -60], [16, -38]]
[[-33, -42], [-22, -60], [-2, -64], [20, -66], [31, -46]]
```

- The label under the well's name on the map changes to `COPY.wellSub`, now "was, is, shall be". Spoken label: "Urd's Well. Drop a pebble in. The Norns answer."
- **`hear()`:** one ring.
- Found on the first press. Kept: the stars in the tree.

## 14. The longship

It still carries the traveller across. `trip.mjs` sets the `transform` of `.ls-ship` and must go on doing so untouched: put everything the ship draws inside one inner group, `ls-rock`, and move only that.

Add to the drawing: six oars `<path class="l ls-oars" d="M-18 -5L-25 8M-11 -5L-18 8M-4 -5L-11 8M3 -5L-4 8M10 -5L3 8M17 -5L10 8"/>` (hidden at rest), a pennant at the masthead `<path class="pf ls-pennant" d="M0 -39.5L24 -38L18 -36.5L24 -35L0 -33.5Z"/>` (hidden), a lamp above it (a Paper dot of radius 1.5 at `(0, -42)` over a `glow` circle of radius 7, hidden), and a class on each of the six shields in order.

- **Asleep:** it rocks: `ls-rock` turns `2.2 * sin(1.3 t)` degrees and rides `0.8 * sin(1.9 t)` units; the sail's width breathes by 4 percent.
- **Shields are stops.** Shield `i` is filled Paper once `st.visited[i]` is true, Ink before. So at the crossing five are lit and one is still to come. This follows the trip, backward as well as forward.
- **Press:** the oars come out and pull once: they swing from -18 to 14 degrees about the rail in 0.35 s and back in 0.5 s, the ship surges 3 units forward and eases back, with a `ring` bit at the water and 4 `drop` bits. The popup opens above the mast: kicker `FIND_COPY.shipLog`, and under it the slot `FIND_COPY.longship`.
- **Three pulls** within 4 seconds: the pennant runs out (scale `x` 0 to 1 from the mast in 0.4 s) and flies for the rest of the visit, rippling (skew `y` plus and minus 6 degrees, 2.5 times a second).
- **When the beacon is lit** (`beaconLit()`), the lamp shows and twinkles.
- **`hear()`:** the sail fills (width 1.12 for 0.6 s) and it rocks twice as hard for a second.
- Found on the first press. Kept: the pennant, the lamp.

## 15. All eleven found

When the eleventh star lands:

- the count reads `COPY.countAll` ("All 11 found");
- a comet runs once round the chart's frame: a rectangle on the dashed frame's line (`x` 18, `y` 18, 564 by 864) with `pathLength="100"`, Paper, 2 px, `stroke-dasharray="6 94"`, its offset going from 100 to 0 in 2.6 s, then fading;
- each corner knot turns once (0.8 s) as the comet passes its corner (give `knot` a class and an inner group to turn);
- the six markers pulse once together (scale 1.25 and back, 0.4 s);
- afterwards the dashed frame line rests at opacity 0.5 instead of 0.28.

Nothing else. No popup, no change to the supernova.

---

## 16. Copy and numbers (`data.mjs`)

All copy is draft. Add `COPY.todo: 'Yours to write'`, `COPY.countAll: 'All {t} found'`, and change `COPY.wellSub` to `'was, is, shall be'`.

Add to `FIND_COPY` (slots are objects with `todo: 1`; turn the existing placeholder strings into slots where a section calls them slots):

```js
wayTally: '{craft}: {n} of {t} stops', wayAll: 'All four: {names}',
hoardTally: 'Hoard {n} of {t}',
huginn: 'Huginn, thought', muninn: 'Muninn, memory', ravenFrom: 'Brought back from {name}',
reelToCome: { t: 'Reel to come', todo: 1 },
serpentLeaves: [['FRI', '5 PM'], ['TODAY', 'EOD'], ['NOW', 'ASAP']], serpentFed: 'Deadline met',
rubDo: 'Rub it for me',
taflYou: 'Your move. Get the king to a corner.', taflThem: 'The attackers move.', taflWin: 'The king is away.',
taflLose: 'The king is taken.', taflDraw: 'No way through. A draw.', taflNew: 'New game',
taflRule: 'Pieces move in straight lines. Trap a piece between two of yours to take it.',
norns: [['Urd', 'what was'], ['Verdandi', 'what is'], ['Skuld', 'what shall be']],
wellNone: 'nothing yet', wellMap: 'the whole map', wellNext: 'not yet carved',
shipLog: 'The 2023 crossing',
```

Update each find's spoken `label` in `FINDS` to say what it does now. Keep them short.

Add `FIND_PLAY`. Starting values; the review will tune them:

```js
export const FIND_PLAY = {
  fresh: 3,
  focus: { fill: 0.72, least: 0.85, most: 3, at: [0.5, 0.46], in: 0.7, out: 0.5, swap: 0.6, chest: [0, -16, 30], ship: [0, -10, 34], wide: [300, 450, 330, 0] },
  bits: { pool: 96 },
  star: { time: 0.75, arc: 46, bump: 0.3 },
  way: { stiff: 90, damp: 9, near: 70, line: 0.45, gap: 0.1, short: 9, ping: 0.5, runes: 0.6, spin: 0.8 },
  hoard: { hole: [12, 20, 27], rise: 0.28, over: 1.6, repeat: 0.3, rattle: 0.36, openHold: 0.3, near: 26, glint: [5, 8] },
  raven: { near: 30, shy: 3, preen: [6, 10], out: 0.9, away: 0.5, back: 0.9, reach: 150, rise: 1.4, flap: 5, land: 0.15, loop: 1.2 },
  serpent: { spots: [[486, 98], [372, 84], [470, 56]], bob: [1.6, 3.2], near: 34, tongue: [0.25, 0.7], flinch: 0.12,
    swim: [0.9, 0.65, 0.45], speed: [1, 0.8, 0.6], bulge: 14, gulp: [0.14, 0.26, 1.18], settle: 6, breathe: [0.8, 4.8], wake: 0.2 },
  beacon: { read: 1.2, flame: [1, 1.3, 1.6, 1.9, 2.3], leap: [3, 0.3], embers: 1.5, turn: 30, reach: 1.4, idle: 0.7, snap: 0.4 },
  rune: { carving: 0.6, grow: 0.4, r: 34, step: 12, grid: [5, 7], done: 0.8, auto: [1.2, 1.6, 7], fill: 0.25,
    letter: [0.05, 0.18], stamp: [0.45, 0.12, 2.4], shake: [3, 0.16], tilt: 5, close: 0.3 },
};
```

Part B adds its own rows (`tafl`, `mist`, `horn`, `well`, `ship`, `all`) with the numbers its sections give. `FIND_TIMING` keeps what is still used.

## 17. A handle for the review

Add to `window.__jm`:

```js
window.__jm.finds = {
  found: () => [...ids found, in order],
  state: id => ({ ...a plain copy of that find's state: stage, digs, fire, read, kept and so on }),
  hear: () => { /* run every find's hear() now */ },
  place: id => [x, y],   // where the find is on screen now, in px
};
window.__jm.focus          // the id of the find that holds the camera, or null (the getter from section 3.3)
```

`id` is a row of `FINDS` or one of the five chests (`hoard-laurier` and so on).

## 18. Checks to run before you finish

- `node --check` on every `.mjs`.
- `node tools/check.mjs`: extend it for the new tables (every `FIND_PLAY` number finite; every slot has text; five hoards each with a known `kind`; three serpent leaves and three spots; every spot's drawing inside the chart's inner frame, `[22, 22]` to `[578, 878]`; nine rows of `FINDS` with a `view` of three finite numbers and a radius above 0, and none on `hoards` or `longship`).
- `node tools/finds-test.mjs` (new, node only):
  - `tripFocus`, at 1440 by 900 and at 390 by 664, for every view (the nine in `FINDS`, a chest's, the ship's and `focus.wide`), from the trip's camera at the map beat, at a stop's beat (card open) and halfway along a leg: at `k = 0` the state is unchanged, deep-equal; at `k = 1` the view's middle is at `focus.at` to within a hundredth of a pixel, the scale is the clamped one, every `cardK` is 0 and `dim` is 1; in between the scale moves one way only;
  - `bigMap().sea`, `.fill` and `.coast` are unchanged. Before you change `art.mjs`, record each one's length and a simple hash, and put those numbers in the test.
  - every find in `FINDS` still has its group in `bigMap().finds` with `role="button"`, `tabindex="0"`, a label, `data-x` and `data-y`;
  - six markers carry ids; the legend's does not;
  - the wayfinder's "all four" list is worked out from `STOPS` and is Lennard alone with today's data.
- Part B: `node tools/tafl-test.mjs`: the start has 8, 4 and 1 pieces; every move `taflMoves` gives is along a clear row or column and ends on an allowed square; a set-up capture takes exactly the piece it should; the king on a corner ends the game; the reply is always a legal move; when the king could reach a corner next move and one attacker move can stop it, the reply stops it; 200 games of random king-side moves against the reply all end, with no error, inside 200 moves.
- `node tools/depth-test.mjs` and `node tools/steps-test.mjs` still pass.
- `node tools/pack.mjs` and `node tools/pack-joined.mjs` both pack.

## 19. FINDS-BUILD.md

Write, for the part you built: what you built, find by find; every place you departed from this brief and why; what you could not check without a browser, as a list the review can work through; the slots Dan has to fill, as a list. Part B appends to the file Part A wrote.
