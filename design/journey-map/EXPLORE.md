# Journey map, round 7 part A: buttons only, explore at the end, the footer name, no selection, the supernova

Read this whole file before writing anything. Read `steps.mjs`, `main.mjs`, `trip.mjs`, `footer.mjs`, `depth.mjs`, `stars.mjs`, `cards.mjs`, `timeline.mjs`, `join.mjs`, `finds.mjs`, `findkit.mjs`, `data.mjs`, `map.css` and `join.css` as well. `BRIEF.md`, `STEPS.md`, `DEPTH.md`, `FINDS.md` and `JOIN.md` say how the page came to be.

## 1. Why: Dan's notes on preview version 6

- "I think we maybe turn off scrolling alltogether. the scrolling can just be zooming in/out and click and drag can move the camera. this would all be after the fact though, first the user would go through the journey with forward and backward buttons. my name at the end should be have the same way as it does in the beginning. i think we need to remove the ability to click and drag to copy and paste alltogether on the journey"
- "repeat clicking on the super nova shouldnt delete older things that happened because of the click. there should be a hidden cap though so it doesnt destroy their framerate if they spam click too much"
- "The stars that gather into the supernova all come from above it so it looks weird"
- "I should be able to X out of a card as well"
- After my reply that described this plan (in it, a scroll or a swipe nudged the Next button): "no scroll or swipe", and "after the supernova and the end card there should be a CTA to back to the map to explore freely"

Other notes of his (the board game, Yggdrasil, the serpent, the chests, the ravens, the stop marks, Toronto) are later parts. Do not touch them here.

## 2. Hard rules

The sandbox on this machine is off, so these matter.

- Change files only inside `design/journey-map/`, and only these:
  - `data.mjs`, `main.mjs`, `trip.mjs`, `steps.mjs`, `cards.mjs`, `footer.mjs`, `depth.mjs`, `stars.mjs`, `timeline.mjs`, `join.mjs`, `finds.mjs`, `map.css`, `join.css`, `tools/check.mjs`, `tools/steps-test.mjs`, `tools/depth-test.mjs`
  - in `tools/finds-test.mjs`, only the three recorded digests that guard `trip.mjs`, `depth.mjs` and the `STARS`/`DEPTH`/`NOVA` tables: this build changes those on purpose, so once your changes are done, record their new digests there (the failing assertion prints them) and list the three new numbers in your report. Change nothing else in that file.
  - new: `explore.mjs`, `footname.mjs`, `tools/explore-test.mjs`, `EXPLORE-BUILD.md`
  - written by the pack tools: `joined.html`, `dist/journey-map.html`, `dist/journey-joined.html`
- Never change anything in `hero-copy/`, `reference/` or `assets/`, any other `.md` file, `art.mjs`, `pace.mjs`, `index.html`, or any find module other than `finds.mjs` (`findkit.mjs`, `findboard.mjs`, `findcreatures.mjs`, `findhoards.mjs`, `findwater.mjs`, `findhorn.mjs`, `findall.mjs`, `findsheets.mjs`, `tafl.mjs` belong to later parts). Change `tools/pack.mjs` or `tools/pack-joined.mjs` only if packing fails without it, and say why in your report.
- Never touch any other path on the machine. Never run git. Never install anything. No network access, at build time or at run time.
- Do not start reviewer agents or sub-agents, even if your global instructions say to. The review happens elsewhere, in a real browser. Do not leave a server running. Do not claim a visual check you did not make.
- You may run `node` on files inside `design/journey-map/`.
- Module style, as now (`tools/check.mjs` enforces it): named exports and named imports only, each import on one line from a sibling file, no default exports, no dynamic imports, no top-level await, every top-level name unique across all modules, no colour literal outside `data.mjs`, no colour literal in `map.css`. Every line of copy, every number you tune and every timing lives in `data.mjs`.
- Never import from `hero-copy/`. Where this brief says to match the hero, copy the behaviour and its numbers into the map's own files.
- No per-frame layout reads (`getBoundingClientRect`, `offsetWidth`, `clientWidth`, `scrollHeight` and the like) in anything the frame loop calls. Read layout on events (resize, fonts ready, a press, a state change) and keep the numbers.
- Everything on the trip stays a pure function of progress `P`. Exploring and a closed card are overrides on the frame's state, like the find focus (`tripFocus`) is today: they never change `P`.
- If a rule stops you from doing something the plain way, leave that thing out and say so in your report. Do not work around a rule.
- Plain ASCII punctuation in `EXPLORE-BUILD.md`.

## 3. The journey moves only by Back and Next

- Steps is the only mode outside reduced motion. Remove the `?mode=` address parameter, the saved `jm-mode` in `sessionStorage`, and the review switch's Steps and Scroll buttons (the switch keeps its label and the Depth button). Reduced motion keeps today's stacked, scrolling page exactly as it is: keep the code it needs and nothing else of the old Scroll mode. Remove what only the old Scroll mode used.
- The wheel and a finger swipe do nothing to the journey, anywhere on it, the end included (Dan: "no scroll or swipe"). Remove the wheel and swipe stepping (`stepsWheel`, the swipe handlers, `STEPS.wheel`, `STEPS.swipe`). The page still prevents the browser's own scroll, as now. Only exploring (section 4) gives the wheel and a drag a job.
- A card face that can scroll inside (`.face`) still scrolls with the wheel and a finger, as now. Wheel and touch inside an open find sheet do nothing to the page, as now.
- Keys stay as they are: one press, one step (`stepsKey`). The timeline stays as it is (a press on a stop's block jumps, its arrow keys jump, dragging the playhead scrubs).
- No line of copy may tell the visitor to scroll, except the explore hint in section 4.6. (The stand-in hero's `cue` shows only in reduced motion, where the page does scroll: leave it.)

## 4. Explore at the end

"this would all be after the fact": once the visitor has reached the end of the trail, the wheel zooms and a drag moves the camera, over the whole map.

### 4.1 The state

A new module `explore.mjs` owns it: whether the visitor is exploring, the blend `k` (0 at the end view, 1 while exploring, eased over time), the explore camera `{ s, tx, ty }` (screen = world x `s` + `t`, the same convention as `st.cam`), its target, the glide velocity, and the end view's camera (`sEnd`, `txEnd`, `tyEnd`, read from `tripState` at the end beat on each resize). `main.mjs` calls one function after `tripState` (and after `tripFocus`) that writes the explore camera into `st.cam` (blended by `k`, the way `tripFocus` blends) and sets `st.exploreK = k`, before anything reads `st`. Every frame where the explore camera or `k` changes counts as moved.

Exploring is possible only at the `end` beat: `JOURNEY.P` equals the end beat's `P`, no move or cut is playing, outside reduced motion.

### 4.2 Starting and ending

- Starting: only a call to action does it (Dan: "after the supernova and the end card there should be a CTA to back to the map to explore freely"). At the end beat today the Next pill hides. Instead, once the supernova and the footer have settled, the Next pill shows again in the end bar (`.go.go-end`, between Back and "Back to the top"), looking exactly like Next, with the label "Explore the map" (`COPY.explore.button`) and the bar's own reveal. A press on it starts exploring. Before that press the wheel, a swipe, a drag and the zoom keys do nothing at the end.
- On that press, the map comes back (4.3) and the camera eases from the end view out to `fit` (4.4: the whole map with the footer under it) over `EXPLORE.in` seconds, with the trip's own ease. From there the visitor zooms and drags. A wheel turn or a drag during that ease takes over from it at once, from where the camera is.
- The pill hides while exploring.
- While exploring, the Back button shows the text "Back to the end" (`COPY.explore.back`) the way it shows "Back to the trail" while a find has the camera, and its label says the same. Back, Escape and the `0` key end exploring: the camera eases back to the end view and `k` eases to 0 over `EXPLORE.out` seconds. A second Back then steps back to the X as now.
- Anything that leaves the end beat (Back to the X, "Back to the top", a timeline jump, a stop mark) ends exploring at once; the move or the cut's cover hides the change.

### 4.3 The map comes back

At the end the map is gone: the blast fades the sea, land, coasts, details, finds, stop marks and the trail (`DEPTH.fade.blast`), and the map's stars are thrown out of the X or orbit it. Exploring brings the map back out of the supernova, with the same objects that went in:

- Over `EXPLORE.in` seconds as `k` rises, every place that fades the map for the blast lifts that fade by `st.exploreK`: the sea, land, coasts, details, finds (`tripApply`), the solid trail (fully drawn: the trip is done), the stop marks (`cardsFrame`'s opacity; the cards stay closed). The traveller stays merged into the X. The mini-map stays hidden.
- The map's stars (trail dots, sea sparkle, coast stars) travel from wherever the blast left them back to their own places on the map (`s.map`), each on a smooth curve that leaves the X along the star's own angle (the reverse of the gather in section 6.2), staggered by `ord2`. Thrown-out stars come back in from off screen along the same angle. When `k` falls, they go back the same way.
- The settled supernova keeps burning at the X. The sky stars stay in the sky.
- Finds are live while exploring and play where they are (they never take the camera at the end; `stepsFocus` already refuses there). Popups and sheets work as they do anywhere.
- A press on a stop mark while exploring ends exploring and goes to that stop the way a mini-map press does (a cut).

### 4.4 The camera

- **Zoom range:** from `fit`, the scale at which the explore bounds fit the stage (inside `EXPLORE.margin` px, `EXPLORE.marginPhone` on a phone, and above the button bar), up to `EXPLORE.most` x `VIEW.sT`.
- **Bounds:** the map's outer frame (`DEPTH.frame.outer`) joined with the world rectangle the end view shows (so the footer is always within reach). The camera's centre stays inside the bounds; when the bounds are smaller than the view, they sit centred.
- **Wheel:** zoom about the pointer, so the world point under the pointer stays under it. Normalise `deltaY` to px (`deltaMode` 1: x 16; 2: x the view height), clamp it to `EXPLORE.wheelMax` per event, and turn it into a factor `exp(-dy x EXPLORE.wheel)`. A Ctrl+wheel (a trackpad pinch) zooms too, with `EXPLORE.pinchWheel` as the gain, and its default is prevented only while exploring. The zoom eases to its target with the time constant `EXPLORE.ease`, so a mouse wheel and a trackpad feel alike. Wheel down zooms out.
- **Drag:** a mouse button or one finger pressed on empty space (not a find, a button, a link, a card, the timeline, a popup, a sheet, the review switch or the footer's controls) and moved past `EXPLORE.slop` px pans: the world point under the pointer stays under it. Pointer capture, so a drag that leaves the stage keeps going. On release the camera glides on with the release velocity (measured over the last `EXPLORE.velocityWindow` seconds), damped by `EXPLORE.friction` per second, and stops at the bounds without overshoot. A press that never passed the slop is an ordinary press.
- **Pinch:** two fingers zoom about their midpoint and pan with it, both at once.
- **Keys while exploring:** `+` and `=` zoom in by `EXPLORE.key`, `-` zooms out by it, about the stage's centre. The arrows keep their meaning (Back ends exploring first).
- **Cursor:** `grab` over empty space while exploring, `grabbing` while dragging.
- **Touch:** the stage gets `touch-action: none` while exploring (today's `pinch-zoom` otherwise), so the browser neither pans nor zooms the page.
- **Resize** while exploring keeps the world point at the stage's centre and the zoom's share between `fit` and the top, then clamps.

### 4.5 The footer belongs to the world while exploring

Wrap the footer (`#ft`) and the timeline element (at the end it is the rule under the name) in one new layer, `#ft-world`, that fills the stage, has `transform-origin: 0 0` and takes no pointer itself (its children keep theirs). Outside exploring its transform is none, so the end view looks exactly as now. While exploring it gets `translate(dx, dy) scale(c)` with `c = s / sEnd`, `dx = tx - txEnd x c`, `dy = ty - tyEnd x c`: the name, the call to action and the links shrink with the map when the visitor zooms out and sit under it as the map's signature, and a drag carries them. Check that `tlResize` still measures the same with the layer in place.

The supernova and its parts size themselves in screen px today (`u(px) = px / s` in `footerMotion`, the press circle, the embers and the orbit in `starsFrame`). While exploring they must keep the size they have at the end view in map units, so they zoom with the map: use `sEnd` where they use the camera's scale, and scale screen-px distances around the X by `c`.

### 4.6 The hint

The first time exploring starts on a page load, a hint line shows `COPY.explore.hint` ("Scroll to zoom. Drag to look around.") or, on a phone, `COPY.explore.hintPhone` ("Pinch to zoom. Drag to look around."). It looks like the find hint (`.find-hint`: same type, colour, place and fade) but is its own element, made by `explore.mjs`. It goes after the first zoom or drag, or after `EXPLORE.hintTime` seconds, and does not come back on this page load. Screen readers get `COPY.explore.say` through the existing status line each time exploring starts.

## 5. The footer name behaves like the hero's

"my name at the end should be have the same way as it does in the beginning." Read the hero's `hero-copy/design/journey-hero/take-2/name-react.mjs`, the `.hero-name` rules in `hero-copy/design/journey-hero/take-2/take-2.css`, the name parts of `hero-copy/design/journey-hero/take-2/entrance.mjs`, and the `EASE` curves that file imports (`hero-copy/public/journey/hero/engine.mjs`). Build the same behaviour for the footer's name in the new `footname.mjs`, with every number copied into a new `FOOT_NAME` table in `data.mjs` (the red is `C.red`):

- **Entrance:** the name's reveal becomes the hero's: a wipe up from the baseline while the weight goes from 300 to 800, with the hero's curves (copy `EASE.wipe` and `EASE.enter` as they are). It is driven by the progress that reveals the footer now (`st.settleT`, inside the name's own window from `NOVA.base.textIn` and `textGap`), so Back plays it backwards. The name no longer fades or rises; the other footer lines keep their fade and rise.
- **Once the name is fully in:** the red lens (a red copy of the letters, clipped to a circle around a mouse pointer near the name, opening as the pointer comes within `near` em), the letters lifting near the pointer, and a press on the name knocking every letter with a spring hop in a wave from the press point. The same numbers as the hero's `NAME` table. Mouse only (a finger does nothing, as in the hero). Nothing of this under reduced motion. The knock and lift move only the painted letters: the line's layout and its fit to the width (`footerResize`) never change.
- **Paint and layout:** as in the hero, the flow text keeps the layout and is what screen readers read; once live, an overlay of the same letters (generated content) paints them at their measured pen positions, with the red copy above. Read layout only on measure: resize, fonts ready, the end beat settling, and exploring starting or ending.
- **While exploring:** the name keeps reacting. Map the pointer into the layer's own coordinates through the inverse of `#ft-world`'s transform (`(pointer - d) / c`).

## 6. The supernova

### 6.1 Presses stack, under a hidden cap

- Replace the one flare (`NOVA_LIVE.flareAt`, `serial`) with a list of live flares, each `{ at, serial }`, dropped when it is `NOVA.flare.time` old. A press on the settled supernova (pointer, Enter or Space) adds one; the auto flare (`NOVA.flare.auto`) adds one. A new press never shortens, restarts or removes a flare that is playing.
- Each live flare has its own ring (from a pool of `NOVA.flare.cap` circles made once, never per press), its own ember burst (seeded by its own serial), and its own share of the core's pulse and of the orbiting stars' kick. The shares add up, clamped at `NOVA.flare.coreMax` and `NOVA.flare.kickMax`.
- The hidden cap: while `NOVA.flare.cap` flares are live, a press does nothing. No message, nothing visible.
- Update `tools/depth-test.mjs` to the list: two presses half a flare apart are both live and the first ends on its own time; a press at the cap adds nothing; flares end and leave the list.

### 6.2 The stars gather from all around

Today, in the rush, every map star flies from its place to the X on a gentle bend, and since nearly all the map lies above the X they all arrive from above. Instead:

- Each star arrives from its own direction, spread evenly around the X. Give every map star an arrival angle, evenly spread over the full circle and shuffled so neighbours on the map come in from different sides (a golden-angle step on a shuffled index works). Make the blast throw each star out along that same angle (it uses `s.ang` today: make them one value), so a star leaves the X the way it came in.
- Its path is one smooth curve with no corner: from its place on the map out around the X to a point on a circle about the X at its arrival angle (radius `NOVA.gather.ring` x the smaller side of the view), then curling in to the X through `NOVA.gather.swirl` of a turn, all the stars turning the same way. The stagger by `ord2` stays. The tails follow the motion as now.
- The sky stars join in: a share `NOVA.gather.sky` of them (`kind: 'sky'`), from every side of the view including below and beside the map, are pulled in the same way during the rush, so the X fills from all around the screen. The blast throws those same stars back out to their own places in the sky, where they settle by the end of the blast. No star is added or removed.

## 7. An X to close a card

"I should be able to X out of a card as well."

- Every card gets a close button in its top right corner: an X drawn in the card's own text colour (`--tx`), a 44 x 44 px hit area, in the tab order after the card's other controls, with the label `COPY.cardClose` ("Close the {name} card").
- Closing folds the card back into its stop mark with the card's own fold motion, over `CARD_CLOSE.time` seconds (an override on that stop's `st.cardK`, eased; `P` does not change). The camera stays at the stop. Escape closes an open card too, when no popup or sheet is open (those close first, as now).
- While a card is closed at its own stop, a press on that stop's mark opens it again with the same motion forwards, instead of navigating. Back and Next work as now; leaving the stop forgets the closed state, so the next visit opens the card as usual.
- Desktop and phone. Not in reduced motion's stacked page (its cards are a list there; no close button).

## 8. No selection and no dragging anywhere on the page

"remove the ability to click and drag to copy and paste alltogether on the journey."

- `user-select: none`, `-webkit-user-select: none` and `-webkit-touch-callout: none` on the whole page, both pages, the hero included (from `map.css`, on `html`), `-webkit-user-drag: none` on images, SVG and links, and a `dragstart` listener on the document that cancels every drag. Focus, presses, keyboard use and screen readers are unaffected.
- Done when: a triple click or a press-and-drag across the hero, a card, a popup, a sheet or the footer selects nothing, and dragging a logo, a link or the map starts no drag image.

## 9. What does not change

Everything else: the journey's motion, beats and pace, the cards apart from the close button, every find, the depth layers, the hero join (only JOIN.md's five edits in `hero-copy/`), the timeline, reduced motion's stacked page, the review switch's Depth button. `tripState(P)` and the `ACTS` table keep their meaning and values.

## 10. Data (`data.mjs`)

Add (starting values; tune nothing else):

```
EXPLORE: { in: 1.6, out: 0.9, most: 3, margin: 24, marginPhone: 12, wheel: 0.0016, wheelMax: 120, pinchWheel: 0.01,
  ease: 0.12, slop: 6, friction: 5, velocityWindow: 0.08, key: 1.25, hintTime: 8 }
FOOT_NAME: the hero's NAME numbers and the entrance's name curve, as they are in the hero
NOVA.flare.cap: 8, NOVA.flare.coreMax: 1.2, NOVA.flare.kickMax: 0.3
NOVA.gather: { ring: 0.32, swirl: 0.35, sky: 0.5 }
CARD_CLOSE: { time: 0.45 }
COPY.explore: { button: 'Explore the map', back: 'Back to the end', hint: 'Scroll to zoom. Drag to look around.',
  hintPhone: 'Pinch to zoom. Drag to look around.', say: 'Exploring the map. Back returns to the end.' }
COPY.cardClose: 'Close the {name} card'
```

## 11. Checks before you finish

- `node tools/check.mjs`, `node tools/steps-test.mjs`, `node tools/depth-test.mjs`, `node tools/finds-test.mjs` (with its three digests recorded anew, section 2), `node tools/tafl-test.mjs` and the new `node tools/explore-test.mjs` all pass.
- `tools/explore-test.mjs` (Node, the pure parts of `explore.mjs`): zoom never goes below `fit` or above the top; the centre stays inside the bounds; a zoom about a point keeps that world point fixed; a glide slows and stops and never crosses the bounds; the layer transform and its inverse round-trip a point.
- Pack both pages: `node tools/pack.mjs` and `node tools/pack-joined.mjs`.

## 12. Report: `EXPLORE-BUILD.md`

What you built, file by file; where you differ from this brief and why; anything you left out (and which rule stopped you); what a browser review should look at first. Plain ASCII punctuation.
