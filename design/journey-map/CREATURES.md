# Journey map, round 7 part C2: Huginn and Muninn, the chests, and the review's last fixes

Read this whole file before writing anything. Then read `reference/round7/creatures.cjs` and look at its pictures in the same folder: `raven-poses.png` (the seven poses, big and at map size), `raven-flight.png` (a take-off and a landing, frame by frame), `raven-ash.png` (the two birds in their tree) and `chest-lid.png` (the lid opening from 0 to 118 degrees and settling at 110). Read `findcreatures.mjs` (`findRavens`), `findhoards.mjs`, `findkit.mjs`, `finds.mjs`, `art.mjs`, `data.mjs`, `map.css`, `steps.mjs` (`stepsFocus`, `stepsFocusNow`), `timeline.mjs`, `join.mjs`, `main.mjs`, `footname.mjs` and every file in `tools/` as well.

Parts A, B and C1 of this round are built before you. Do not undo any of their work. Jörmungandr (`findSerpent`), Yggdrasil and the well are C1's; leave them as they are.

## 1. Why

Dan's notes on preview version 6, in his words:

- "hugin and muginn need to be fixed, multiple mistakes i see on their animation."
- "need to fix the animation on the treasure chests, it looks weird at certain times"
- "they norse nodes look like gravestones, can we do something else?" The ravens sat on a standing stone; they move to a bare tree, so nothing on the map reads as a gravestone.
- "can you run a critique loop as well?" Two critics recorded the ravens' and the chests' faults frame by frame and agreed the fixes below.

What the critics found, so you know what not to rebuild:

- **Ravens.** Each bird is two unrelated drawings (`.rv-sit` and `.rv-fly`, the flying one about 2.5 times bigger) swapped by opacity in `landed()`, against a transform the tick wrote for flight, so the bird pops in size, shape, angle and facing on landing. The reel returns before the bird code runs, so a landed bird keeps its flight transform for the whole reel. `landed()` sets `landTs` on both birds. The tilt is not multiplied by the mirror, so a left-facing bird lands nose down. The shy step writes `x += shy` straight into position (a teleport), toward the other bird. The flight starts while the camera is still flying in, so the take-off is never seen; it then flies through the stone, the other bird, the step buttons and the serpent. The head can spin the beak into the body. Huginn's popup stays up while Muninn flies, and a thought is counted even when its popup could not show.
- **Chests.** `act()` acts on every press whatever the stage and wherever the camera is, so fast presses skip digs, open the lid underground and skip the rattle. Each dig restarts the rise with a bump. The lid is hinged at the front and snaps in 0.25 s. The chest is wider than its hole and comes up through the ground beside it; clods and flat puffs fly over the chest; the rattle dips its corners under the ground. The craft light shows a glow inside a chest still buried. A press on an open chest closes and reopens its popup (a flicker). The laurier chest's popup says "Piece to come" twice. The hint says "Dig three times, then open it." whatever the stage.

## 2. Hard rules

The sandbox on this machine is off, so these matter.

- Change files only inside `design/journey-map/`, and only these:
  - `findcreatures.mjs` (only `findRavens` and what it alone uses), `findhoards.mjs`, `findkit.mjs`, `finds.mjs`, `data.mjs`, `art.mjs`, `map.css`, `findhammer.mjs` (section 6's plural only), `steps.mjs` (only so `stepsFocusNow()` also reports whether its swap has finished), `timeline.mjs` (section 6 only), `join.mjs` and `main.mjs` (section 6 only), `footname.mjs` (only if section 6's check finds a read in the frame)
  - `tools/check.mjs`, `tools/finds-test.mjs`
  - new: `CREATURES-BUILD.md`
  - written by the pack tools: `joined.html`, `dist/journey-map.html`, `dist/journey-joined.html`
- Never change anything in `hero-copy/`, `reference/` or `assets/`, any other `.md` file, `index.html`, or any module not listed. `findSerpent` stays exactly as C1 left it. Change `tools/pack.mjs` or `tools/pack-joined.mjs` only if packing fails without it, and say why.
- Never touch any other path on the machine. Never run git. Never install anything. No network access, at build time or at run time.
- Do not start reviewer agents or sub-agents, even if your global instructions say to. The review happens elsewhere, in a real browser. Do not leave a server running. Do not claim a visual check you did not make.
- You may run `node` on files inside `design/journey-map/`.
- Module style, as now (`tools/check.mjs` enforces it): named exports and named imports only, each import on one line from a sibling file, no default exports, no dynamic imports, no top-level await, every top-level name unique across all modules, no colour literal outside `data.mjs`, none in `map.css`. Every line of copy, every number you tune, every timing and every drawing path lives in `data.mjs` (drawings may be built in `art.mjs` from data, as now).
- `reference/round7/creatures.cjs` is a reference. Port its shapes, poses and numbers into `art.mjs`, `data.mjs` and the find code; never import it. Its colour literals become `C` tokens (`#FF8A4C` is `C.warm`).
- Do not change the `STARS`, `DEPTH` or `NOVA` tables, or any digest test except the ones section 7 names.
- No per-frame layout reads in anything the frame loop calls. The frame writes transforms, opacities and, only while a lid moves, one path's `d`. Anything else happens on a state change, on resize or when fonts are ready.
- "An animation always moves the object that is already there" (Dan). One drawing per raven, moved and posed; nothing swaps or pops.
- If a rule stops you from doing something the plain way, leave that thing out and say so in your report. Do not work around a rule.
- Plain ASCII punctuation in `CREATURES-BUILD.md`.

## 3. A press counts once the camera has landed (shared)

- Add `findReady(id)` to `findkit.mjs`: true while exploring or under reduced motion; in Steps, true only when `stepsFocusNow()` names `id` with `k` at 1 and its swap finished.
- The ravens and each chest use it. A press that is not ready is kept (at most one per find) and plays when `findReady` turns true; more presses before then are dropped. The press that brings the camera still does its job of bringing it.
- `showPop` returns `true` when it showed the popup and `false` when it did not (the overlay epoch moved on). Nothing else about it changes.

## 4. Huginn and Muninn

### 4.1 The tree and the find

- The ravens leave the standing stone for a bare, wind-bent tree, drawn as one shape: every limb's outline first at double width, then every fill on top, so no seam shows where limbs meet (`perchTree()` in the reference: six tapered limbs from `TREE`, drawn at `1 / TK` and scaled by `TK`, plus `TREELINES` for the roots, two bark lines and the ground line). The stone, its rune and its ground line go.
- The find moves a little inland so the birds sit clear of the coastline's band and hatching: `FINDS` row `ravens` becomes `x: 442, y: 200`, `view: [444, 180, 42]`, `mark: [464, 192]`. Its label becomes "Huginn and Muninn, two ravens in a bare tree. Press to send the next raven for a thought or memory."
- `FIND_PLAY.raven.scale` (the find group's scale) becomes 0.62. In find units, Huginn perches at `PERCHES[0]` facing left and Muninn at `PERCHES[1]` facing right, each at bird scale 0.85.
- The hit area covers the tree and both birds at rest with 3 units to spare. The tally scratches move onto the ground right of the trunk, in find units x 6 to 20, y -6 to 0, clear of the root lines: four uprights, the strike across them, and a sixth upright.
- `check.mjs`: the find's whole drawing at rest is at least 4 map units from the coast's band, the region labels and the find mark; the mark is at least 3 units from the drawing.

### 4.2 One raven rig

- Each bird is the reference's `bird()`: one group per bird (`.rv-a` Huginn, `.rv-b` Muninn) whose transform the tick writes (`translate`, `rotate`, `scale(mirror * k, k)`), and inside it a body group (`.rv-body`: tilt about `PIV`, squash `sq` about `PIV`) holding, back to front: the far wing (`.rv-far`, class `o`), the legs (`.rv-legs`, scaled about `HIP`), the body and tail lines, the head (`.rv-head` at `N`: fill with no stroke, then the open outline, the bill lines, the eye, and the carried item `.rv-item` at the bill tip) and the near wing (`.rv-near`, class `g`, with its two feather lines).
- A pose is the reference's `POSES` row (`sq`, `body`, `head`, `wing`, `far`, `legs`). The tick mixes two poses with the reference's `mix()` and writes the inner transforms. The folded wing is the open wing turned and squashed; there is no second wing drawing.
- The flap: one beat runs `up`, `mid`, `down`, `mid`, `up`, mixed smoothly, 4 beats a second.
- All shapes, poses, `N`, `S`, `HIP`, `PIV`, `TK`, `TREE`, `PERCHES` and timings go to `data.mjs` (a `RAVEN_RIG` table beside `FIND_PLAY.raven`); paths may be stored as computed strings or built in `art.mjs` from the reference's helpers.

### 4.3 A flight (Huginn's thought, Muninn's memory)

All distances in find units; `side` is -1 for Huginn and +1 for Muninn. Each bird leaves on its own side and comes back the same way, so the two never cross, and neither goes near the tree's other limbs, Jörmungandr or the step buttons.

1. **Crouch, 0.12 s.** `sit` to `unfold` on the perch, legs to 0.7.
2. **Out, 1.1 s.** The bird springs off along the cubic from the perch with controls perch + (side x 10, -26), perch + (side x 55, -32) and end point perch + (side x R, -29), speeding up (parameter `q ** 1.6`). Its first 0.18 s mix `unfold` to `up`; then it flaps. R is 177, or more if needed so the end point lies 12 map units past the side of the focused frame (worked out from the camera's numbers when the flight starts, no layout read). No fading: it always leaves the frame.
3. **Away, 0.4 s.** Out of sight.
4. **Back, 1.0 s.** Along the same cubic reversed, from out of view, slowing to a stop at the perch (parameter `1 - (1 - q) ** 2`), in `glide` with one flap every 0.35 s for the first 0.7 s, holding its item in its bill.
5. **Landing.** Over the last 0.35 s of the way back, `glide` to `flare` (wings up, legs down); then a 0.2 s settle, `flare` to `sit`, with the squash `sq` easing from 0.85 to 1.
6. **Turn on the perch.** It arrives facing the trunk, so it turns to its perch's facing: a 0.16 s hop (lifting 1.5 units) while its x scale passes through 0 to the new facing.
7. **Set down.** Its head dips 25 degrees (0.15 s and back) and the item moves from its bill to the bough just in front of its feet, where it stays while the popup or the reel is open, then fades in 0.2 s when they close.
8. **Then:** Huginn's popup opens (anchored above the tree top, about 4 units above Muninn's head), or Muninn's reel grows from the item's place on screen.

Rules for every frame of a flight and of the hear loop:

- **The angle of travel** is the velocity's angle against the horizontal, `atan2(vy, |vx|)`, clamped to 30 degrees either way and multiplied by the mirror, so a climbing bird's beak points up whichever way it faces. It eases to 0 over the last 0.3 s before touching down.
- **Every change of facing is a 0.12 s turn:** the x scale passes through 0, eased. Never a jump. In a flight the facing follows the horizontal velocity's sign with a 0.1 s hysteresis, so it changes at most once per leg.
- **On touchdown** the sit pose, rotate 0 and the perched transform are written in the same frame.
- **The other bird** keeps its perched transform from the take-off to the landing and through the whole reel; it goes on breathing, turning its head and preening.
- **`landTs`** is set only on the bird that flew.
- The bird code runs on every tick, during the reel too.

### 4.4 The hear loop (when the horn sounds)

Each bird flies one loop of radius 24 find units on its own side and lands back on its perch: Huginn's loop is centred at its perch + (-20.8, -12) and Muninn's at its perch + (20.8, -12). Each leaves upward, goes over the top and round the outside, and comes back to its perch from below. Huginn starts first; Muninn starts 0.55 s later, so they are half a loop apart and mirror each other. Take-off 0.2 s, loop 1.1 s, then the same landing, settle and turn as a flight. The top of each loop stays at least 5 units below Jörmungandr's hit box. Not under reduced motion.

### 4.5 At rest

- **The head** follows the pointer within 35 degrees either side of the bird's facing, eased as now. The preen is a tuck: the head turns 20 degrees beak down and moves 1.5 back and 1.5 down, over 0.5 s, every 6 to 10 s, the birds taking turns.
- **The shy hop.** When the pointer comes within `near` of a bird on its trunk side, the bird hops 4 units outward along its bough (Huginn left, Muninn right; the bough's line sets the height): 0.25 s, eased, lifting 1.5 units at mid-hop. It hops back the same way when the pointer leaves. It never moves toward the trunk or the other bird.
- The ruffle on waking and the take-off feathers stay as they are, on the new rig.

### 4.6 Presses, popups and the reel

- Presses go through `findReady` (section 3). A press during a flight or a loop is ignored, as now. Presses alternate Huginn and Muninn, as now.
- When Muninn takes off, Huginn's popup closes if it is open. No popup shows over the reel.
- A thought counts only if its popup showed: `landed()` adds to `thoughts` and the tally only when `showPop` returned true. Otherwise the same stop is still owed and the next Huginn brings it back.
- Under reduced motion nothing flies: a press counts and opens the popup or the reel at once, as now.

## 5. The chests

### 5.1 The dig

- A press counts only when `findReady` is true for that chest and its current stage has finished (buried at rest, out with the rattle ended, or open). One press made before then is kept and plays then; more are dropped. Holding the pointer repeats, as now, under the same gate.
- The hole is wider than the chest: `hole` becomes `[16, 28, 38]` (the last at least the chest's half-width plus 6). `holeRatio` stays.
- The chest stays in the hole until the third dig: `lift` per dig `[0.18, 0.24, 1]` of `travel`, so after the first dig the hole is just a hole, after the second the top of the lid shows inside it, and the third dig brings the chest all the way out (`rise` 0.28 s for the first two, 0.5 s for the third).
- Each rise is one back-out ease from where the chest is shown to its new height, with at most 1.2 units of overshoot at the end. Nothing restarts it.
- Each chest gets its own clip: the half-plane above the ground line together with its current hole ellipse (updated with the hole). Then draw the front half of the hole's rim (`.hd-rim`) over the chest, so the chest reads as standing in the hole.
- Clods are each chest's own (7 per dig, in a group drawn behind the chest), thrown from the hole's left and right rims outward and up, landing beside the hole. No puffs. The dirt pile sits outside the hole's right rim and grows about its own foot.
- **The rattle** (after the third rise, 0.36 s, three rocks of 4 degrees) rocks about the bottom corner it leans toward, so neither corner goes under the ground line.

### 5.2 The lid

- The lid is hinged at the back edge, as in `chest(deg)` in the reference: the dome rises by `D x sin` and squashes toward the rim by `cos`; the inside face (class `g`, two plank lines and a cross line) grows up from the rim by `sin` and leans back past 90 degrees (its top corners move in by `lean`); the dark mouth with its warm line (`C.warm`, opacity 0.7) opens under the rim over the first 60 degrees. Draw order: body, inside face, mouth, dome.
- A press on a chest that is out and still opens it: 0 to 118 degrees in 0.4 s (ease out), then back to 110 in 0.12 s. The lid never moves before the stage is out and the rattle has ended, and never turns more than 25 degrees in a 16 ms frame.
- While the lid moves, the inside face's `d` is rewritten each frame (its lean); everything else is transforms.
- A press on an open chest lifts the lid to 118 and back to 110 in 0.25 s. If its popup is open, the popup stays exactly as it is (same element, opacity 1); if it was closed, it opens again.
- The glow and the star burst on opening stay as they are.

### 5.3 Light, hints and the popup

- **The craft light** (the wayfinder on a craft): a chest with fewer than three digs gets no glow; its scratch strokes go to full width (`scratchWidth`) and one ring ping plays on it (as the wayfinder pings a stop). A chest that is out or open glows, as now.
- **The hint line follows the stage:** "Dig three times, then open it." / "Dig twice more." / "Dig once more." / "Open it." / "Press it to see the piece again." (new copy in `FIND_COPY`, written when the stage changes, never in the frame).
- **One "Piece to come" per popup:** the popup's title line is left out when it says the same as the empty piece's line.
- **Keyboard focus** on a chest is round: its hit area becomes a circle (radius 40, centred 24 above its foot), so the focus ring follows it.
- **`#f-hoards`** becomes `role="group"` with its `aria-label`, no `tabindex` and no press handler. The five chests stay buttons in the tab order.

## 6. The review's last small fixes

- **Timeline keys:** Home goes to the first stop and End to the last, on the slider, like its arrows.
- **The hero's leave first in the frame:** `join.mjs` gives `main.mjs` a hook that sets the hero's leave (`api.setLeave`, and `setAway` as now) and `main.mjs` calls it right after `stepsFrame` and before any other write in the frame; `JOIN.frame` then no longer sets it. Behaviour stays the same; the hero's own reads then hit a clean layout.
- **The footer name** measures only on resize, fonts ready, the settle's end and the start or end of exploring. Add a check that counts its layout reads over a whole run; change `footname.mjs` only if a read happens anywhere else.
- **No hint line over a sheet.** On a phone the find's hint line ("Press the hammer to play.") shows on top of an open sheet, because it lives in the step bar's stacking context. While any sheet is open the hint fades out: `findSheet` sets a class on the root and `closeSheet` clears it, and `map.css` hides `.find-hint` under it.
- **The hammer game's copy agrees in number.** Its rune lines read "1 hearts", "1 more foes", "1 neighbours", "1 ending blows", and "A heart lost. 1 remain." Give that copy a plural mark (for example `{s}`, empty when the number is 1) filled where the line is formatted, so it reads "Heal 1 heart", "Pass through 1 more foe", "spread to 1 neighbour", "Survive 1 ending blow"; Eihwaz's line becomes "Deal {n} more damage on the way back."; and the heart line becomes "A heart lost. {n} heart{s} left." Nothing else in the game changes.

## 7. Checks before you finish

Run every test in `tools/` and the two pack tools. Re-run only what failed while you fix it. All new tests run on the existing fake clocks, 16 ms ticks, no real waits.

- `tools/finds-test.mjs`, ravens (both flights and the hear loop, on 1440 x 900 and 390 x 844 with the find's focus camera):
  - no tick where the pose is `sit` and the outer rotate is not 0;
  - the bird that did not fly has the same outer transform from the other's take-off to its landing and through the whole reel;
  - the sign of the x scale changes at most once per leg of a flight (out, back, and the turn on the perch) and at most twice per loop, and never jumps (each tick's change at most what a 0.12 s turn allows);
  - climbing, the beak points up for both facings (`sign(rotate x mirror)`);
  - the shy hop moves at most 1 unit per tick, and never toward the trunk;
  - consecutive ticks change the bird's box area by at most 15 percent;
  - a press during the camera's move starts nothing until the camera has landed, then starts the flight;
  - in each flight the bird is wholly out of view for at most 1.2 s in total, and its take-off and landing are in view;
  - the bird's box never crosses the other bird's box, the tree's limbs (except within 3 units of its own perch), Jörmungandr's hit box or the step bar's band;
  - `landTs` changes only on the bird that flew;
  - Huginn's popup closes when Muninn takes off;
  - with the overlay epoch moved on before Huginn lands, `thoughts` and the tally stay as they were.
- `tools/finds-test.mjs`, chests:
  - five presses 0.06 s apart right after `stepsFocus`: at most one dig while the camera moves, at most two by the end, never open;
  - the lid angle is 0 until the stage is out and the rattle has ended; it never turns more than 25 degrees in a tick; it peaks at 118 or less and rests at 110;
  - within a rise the chest's y never moves away from its target except the final overshoot (1.2 units or less);
  - at every tick of the third rise the chest's sides are inside the hole's width at the ground line; during the rattle neither bottom corner is under the ground line;
  - with the wayfinder on a craft, every chest with fewer than three digs has glow 0;
  - four presses on an open chest keep the same popup element at opacity 1;
  - the hint text matches each stage; no popup shows "Piece to come" twice.
- `tools/check.mjs`: section 4.1's clearances; `#f-hoards` is a group with a label and no `tabindex`; the timeline handles Home and End; `main.mjs` calls the join's leave hook straight after `stepsFrame`; `map.css` hides the hint under the open-sheet class; no hammer copy line formats a number before a plural noun without the plural mark; the gzip budgets still pass.
- Re-record only the digests these changes must move (the `trip.mjs` and `depth.mjs` source digests must not move) and say which and why. `STARS`, `DEPTH` and `NOVA` keep their digest.

## 8. Report: `CREATURES-BUILD.md`

What you built, section by section; anything left out and the rule that stopped it; every number you had to choose; the digests you re-recorded and why; every test's last output line; the packed sizes and gzip numbers. Say plainly that no browser check was made.
