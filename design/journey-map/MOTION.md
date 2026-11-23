# Round 7 part D4: scroll between the hero and the map, and one slow glide between stops

Read this whole file before you change anything. Then read the files in section 5.

Parts D1 to D3 stay as they are; do not undo or rework them (the supernova on `canvas#nova`, the map fading as one layer, the build-up before the blast, the explore gestures, the card focus rules). Motion will be judged on real frames in a browser after you finish, so describe in your report how each move now runs, with its numbers.

## 1. Dan's notes

Dan's words: "you should be able to scroll between the hero and the map but once you click start, then scrolling shouldnt do anything. the transitions between nodes as well need to be slower and smoother".

## 2. Scroll between the hero and the whole map

**Today.** In the steps mode the wheel is blocked everywhere outside explore, sheets and scrollable card faces (`stepsBlockWheel`, steps.mjs), so the hero reaches the map only through the Start the journey button or the keys.

**The change.** The stretch from the top of the page (`top`, the hero on the joined page, the title screen on the map page) to the whole map (`map`) scrolls, both ways; the journey itself stays buttons only.
- While scrolling is live, the wheel, a trackpad and a vertical touch swipe move `P` continuously between the `top` beat's P and the `map` beat's P, through the hero's leave and the fall exactly as a step plays them. One screen height of scroll moves P by about 100 (P is in vh), so the hero rises one to one with the scroll. Smooth the wheel: P eases toward the scroll target with a time constant of about 0.12 s, and clamps at both ends.
- Settling: 400 ms after the last scroll input, if P is between the two ends, finish the move at the step pace: back to where that scroll began if it covered less than 12 % of the stretch, otherwise to the end the last input was heading for. A swipe released faster than about 0.5 px per ms finishes in its own direction.
- Scrolling is live from page load. It switches off when the visitor presses Start the journey (the hero's button) or Set out, or takes any step to a stop by button or key ("once you click start, then scrolling shouldnt do anything"). It comes back only when the journey returns to the top (Back to the top, or Back steps that reach it). While it is off, the wheel and swipes do nothing, as today.
- Scrolling down at the whole map does nothing (it never starts the journey; Dan has said no scroll or swipe for the journey itself), and scrolling up at the top does nothing.
- A swipe that starts on a hero element that handles its own drag (its pointer or touch event is default-prevented, or it sets `touch-action: none`) belongs to that element, not to the scroll. Buttons and links still take taps.
- Keys, the step buttons, explore's wheel and pinch, the timeline, sheets and scrollable card faces work as today. Reduced motion keeps its native scroll page.
- Both pages: the joined page (hero to map) and the map page (title screen to map).

**Checks (steps-test, both pages, on the fake clock):** wheel input at the top moves P toward the map continuously and the hero's leave follows it; wheel up returns it; a 10 % scroll settles back to the top; a 30 % scroll settles on the whole map; after Start the journey or Set out the wheel no longer changes P at any beat; after Back to the top it moves P again; at the whole map, wheel down leaves P unchanged.

## 3. One slow, continuous glide between stops

**Today, measured at 1440 x 900 on the map page:** a move from one stop to the next takes 3.2 to 4.0 s, but the camera moves for only about 1.9 s of it, in three separate eased moves that each stop dead: nothing for the first 0.6 s (the card folds), a zoom out in about 0.25 s (a zoom rate of 1.7 per second), a near stop, the travel along the trail (the centre point peaks at about 1,200 px/s), another near stop, a zoom in over about 0.45 s, then about 1 s with the camera still while the next card opens. That is the jerkiness Dan sees. The segment eases (`HOLD.zoomOut`, the leg's `easeIO`, `HOLD.zoomIn`) each go to zero speed at their ends, so the camera stops at every boundary.

**The change.** Every move between two resting points of the journey becomes one continuous glide: the move from the whole map to Laurier (Set out), each stop to the next, Lennard to the X, and each of those backward.
- The camera starts moving within 50 ms of the press and settles once, at the end. In between, its speed rises once and falls once: no dead stop and no dip, anywhere in the move.
- One clock drives the whole move: a single eased parameter T from 0 to 1 (ease in and out gently, for example a sine ease or smootherstep), and from it together: the traveller's progress along the trail, the camera's centre (from the first stop's held view, along the trail, into the next stop's held view) and its scale (out from the held scale and back in, as one smooth curve; the farther the move, the further out, about as far out as today's arc at the middle of the longest leg).
- Slower: the camera moves for the whole move, about 2.6 s for the shortest moves up to about 4.0 s for the longest, scaled by the trail distance. Peak speeds come down by about half.
- The cards move with the camera instead of before and after it: the card being left folds over the first 0.5 s while the camera is already easing away; the next card opens over the last 0.6 s as the camera settles and is fully open within 0.3 s after the camera stops. The stop marks and labels follow the same timing.
- `P` stays the single progress owner. The glide is a function of P (a move from one rest point to the next maps to one stretch of P), so Back, the timeline scrub and a reload at any point show the same frames, and pressing Next again while moving still hurries the move.
- The X's own beat (the camera on the X, then the build-up and the blast) keeps its timing; only the move from Lennard into the X becomes a glide like the others.
- The hero's leave and the fall onto the map are not part of this (section 2 covers them).
- Reduced motion keeps its cuts. The phone gets the same glide, with the same durations.

**Numbers** go in one table in data.mjs (for example `STEPS.glide`): the duration rule, the ease, the card fold and open windows and the zoom-out depth. Give the final values in the report.

**Checks (a new `tools/motion-test.mjs` on the fake clock, desktop 1440 x 900 and phone 390 x 844; sample the camera every 16 ms through every move listed above, forward and back):**
- the camera has moved by the second sample after the press;
- for the screen points at the centre and at the four quarter points of the view, the largest speed per frame rises once and falls once: after it first passes half its peak, it never drops below 60 % of the peak until the final descent;
- the centre point's peak speed is at most 0.6 view widths per second, and its acceleration at most 1.2 view widths per second squared;
- each move takes 2.6 to 4.4 s from press to the next card fully open;
- the card being left starts folding within 100 ms, and the next card is open within 0.3 s after the camera settles;
- the same P gives the same camera forward and backward.

## 4. Tests and files
Every existing test must still pass, plus the checks above. Where an existing assertion reads something you changed on purpose (move durations, the hold and leg windows, the wheel being blocked at the top), change it to the new behaviour and say so in the report. If a test holds a digest of a file you changed (tools/finds-test.mjs locks trip.mjs's digest), re-record it and list it in the report.

You may write only these, all under `design/journey-map/`: `steps.mjs`, `trip.mjs`, `data.mjs`, `cards.mjs`, `join.mjs` (only for section 2 on the joined page), `main.mjs` (only to wire listeners), `explore.mjs` (only if the wheel handlers' order needs it), `depth.mjs` (only if the arc moves), `map.css` (only `touch-action` and the like), `tools/steps-test.mjs`, `tools/motion-test.mjs` (new), `tools/depth-test.mjs`, `tools/finds-test.mjs`, `tools/explore-test.mjs`, `tools/check.mjs`, `tools/nova-test.mjs` (only if an existing assertion must follow), the files the two pack tools write (`joined.html`, `dist/journey-map.html`, `dist/journey-joined.html`) and your report `MOTION-BUILD.md` (new). Never change `hero-copy/`, `reference/`, `hammer.mjs`, `footer.mjs` or any find module.

## 5. Read first
`REVIEW3.md` and `REVIEW3-BUILD.md` (part D3), `steps.mjs` (the moves, `paceMove`, `paceAt`, `hurry`, `stepsBlockWheel`, the keys), `trip.mjs` (the segments, `HOLD`, `camTrip`, `camMix`, the arc, the footer acts), `cards.mjs` (the fold and open), `join.mjs` (the hero's leave and the fall), `explore.mjs` (its wheel), `data.mjs` (`STEPS`, `HOLD`, `ACTS`, `DEPTH.arc`) and the tests in `tools/`.

## 6. Done means
All tests in `tools/` pass, both pack tools have run, and `MOTION-BUILD.md` says what you built (the scroll stretch and its rules, the glide and its final numbers, each move's measured duration and peak speed from motion-test), what you left out and why, and each test's last line. Do not claim any visual or browser check: the review happens elsewhere in a real browser.
