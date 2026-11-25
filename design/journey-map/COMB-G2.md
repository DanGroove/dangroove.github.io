# Polish round 2, part 9b: Dan's answers to the bug hunt's questions, and the shine

Dan answered the bug report's questions 1 to 4 on 2026-11-25 (4:02 PM ET), while part 9 ran:

1. "Go with your recommendation": a press made while the camera moves is cancelled by any new destination (G12).
2. "Go with your recommendation": pressing the X from afar keeps the jump, and the words and buttons shown on the way are fixed (G27).
3. "Leave them for now": the links that do nothing stay as they are. No change.
4. The trail stays buttons only: "Let's make the button shine or something to help with that", and a minute later "The button should also shine right away" (G30, new).

And questions 5 to 8 a minute later (4:03 PM ET):

5. "Keep": explore's footer keeps its fade. No change.
6. "Yes": each chest keeps its own number (G16a).
7. "Count them": the longship counts taps made during a pull (G16b).
8. "Keep them": Escape's two steps on a held find stay. No change.

Read `BRIEF.md`, `COMB-F.md`, `COMB-G.md` and part 9's report `COMB-G-BUILD.md` first; their rules hold. Keep everything part 9 (commit 2a6d778) and the cloud fixes before it did, unless an item here says otherwise.

## Items

- **G12. A press left behind (Dan: cancel it).** Today `findCapture` (findkit.mjs) stores `FD.pendingPress` on any press while the camera moves and `findKitFrame` replays it once no move runs, even after Next, Back, Top, Home, End, a timeline jump or a mini-map jump, so the camera dives into a find the visitor left behind (at another beat; a chest digs by itself). Any new destination asked for after the press drops it: Next, Back, Top, Home, End, a timeline or mini-map jump, a shield of another stop, the X's jump. A press during a glide still opens on arrival when nothing else was asked for (A15 stays).
  Test: by real input at 1440 x 900 and 412 x 730 touch: from the whole map press Next and, during the glide, press a find on screen (a chest, then another find), then before arrival press Next again, Back, the Home key, the End key or a timeline mark: after arrival and 3 s of rest nothing is open, the camera holds no find and the chest has no dig. Press a find during a glide and press nothing else: it opens on arrival.
- **G27. The X pressed from afar (Dan: keep the jump, fix what it shows).** Today a press on the X at the overview (or any beat before the X) jumps to the X, and on the way `#go-say` reads "The supernova is building. Press to add a flare.", the bar fades out (`go-leaving`) and focus moves to `#nova-hit`, because `stepsButtons` reads a cut landing on the X as the rush. The jump stays. On the way and on arrival the bar stays, `#go-say` says the X's own words ("The X"), and focus goes to Next ("Dig here"). The dig and the supernova still start only from "Dig here" or a press on the X at the X beat, as today.
  Test: at the whole map and at Lennard's stop (the two beats where the X is on screen), press the X by real input at 1440 x 900 and 412 x 730 touch; sample `#go-say`, the bar's classes and `document.activeElement` every 100 ms through the jump; then press "Dig here" and check the build-up starts as before.
- **G14b. Lennard's chest under the X (left from part 9).** Part 9 left one G14 row failing because it touched the X: in short landscape (844 x 390 and 730 x 412) the X's 44 px target (`.fx-hit`, `#nova-hit`) covers Lennard's chest, so a press on the chest's spade presses the X. Keep the X pressable, but where the two overlap the chest wins: in short landscape the X's target keeps to its drawn mark, as part 9 did for the stop buttons, and the touch pick in `main.mjs` prefers the chest when a touch is nearer the chest. Elsewhere the X's target stays 44 px.
  Test: part 9's `comb-g-spatial-test.mjs` G14 rows pass at all nine sizes; at 844 x 390 and 730 x 412 touch, a tap on Lennard's chest digs it and a tap on the X's mark still presses the X.
- **G16a. A chest keeps its number (Dan: yes).** Today `show()` in `findhoards.mjs` counts the chests open at the moment of the press (`n = o.items.filter(item => item.open).length`), so Lennard's chest reads "Hoard 1 of 5" when it is the first one dug up and "Hoard 2 of 5" when pressed again after HMC's. Each chest keeps the number it got when it was first opened (the order the visitor dug them up), for every later press, in explore and after a trip to the top.
  Test: dig up Lennard's chest first and HMC's second by real input, then press Lennard's again: "Hoard 1 of 5"; HMC's: "Hoard 2 of 5".
- **G16b. The longship counts every tap (Dan: count them).** Today a tap during a pull is dropped (`findwater.mjs`, the early return while `FD.now - o.pullTs < S.pull[2] + S.pull[3]`), so three quick taps give one pull and the pennant never flies. Every tap counts: a tap during a pull is queued and its pull plays as soon as the running one ends, at most `FIND_PLAY.ship.pulls` queued, and the window for the three pulls runs from the taps, so three quick taps fly the pennant once the third pull plays. Reduced motion: each tap is a pull at once, as today.
  Test: three taps 150 ms apart by real input at 412 x 730 touch and three clicks at 1440 x 900: three pulls play back to back and the pennant flies; one tap: one pull.
- **G30. The button shines (new).** On the trail, nothing happens when a visitor swipes or scrolls (Dan keeps it buttons only, round 7), and a first-time phone visitor will try a swipe first. Make the button that does what they tried shine once, so they see where to press:
  - Right away (Dan, 4:04 PM ET: "The button should also shine right away"): the first time the step bar appears at the whole map on a visit (after the move from the hero, or on a load at the map), Next ("Set out") shines once as soon as its reveal ends, without waiting for a swipe. Once per page load; never again on later arrivals.
  - When: a vertical swipe (from `STEPS.scroll.swipe`, 24 px) or a wheel gesture that moves nothing, from the whole map onwards (`SC.P >= stepsMap`) and at the end, with the bar shown and no move running. Not in explore, not with a sheet or popup open, not inside a scrolling card or sheet, not during the hero's loader, not at the top (a scroll there already plays the move to the map). Keys need no shine.
  - Which: forward (swipe up, wheel down) shines Next; backward (swipe down, wheel up) shines Back. If that button is hidden, nothing shines.
  - How: one pass of about 700 ms on the button that is already there: a soft light band sweeps across it in its direction (left to right for Next, right to left for Back) and a soft Paper glow swells around it and fades. Light and Paper only, never Red, no change of size or position, nothing on the phone's full-width bar that runs past its edges. One shine per gesture (a trackpad's stream of wheel events is one gesture, `STEPS.scroll.gesture`), and at most one per button every 2.5 s. Apart from the first appearance, no shine without a swipe or scroll.
  - Reduced motion: no sweep; the Paper glow fades in and out over 600 ms, opacity only.
  - Purely visual: `aria-hidden` on anything added, nothing announced, focus untouched, the button's hit area and label unchanged.
  - Numbers in `data.mjs` (`STEPS.shine`), styles in `map.css`, the detection in `steps.mjs`'s existing wheel and touch handlers. No per-frame work while idle.
  Test: by real input at 412 x 730 touch, 844 x 390 touch and 1440 x 900 mouse: from the hero, one swipe or wheel notch to the whole map: Next shines once when the bar has appeared, and not again at the next arrivals; swipe up and wheel down at the whole map, at a stop and at the X: Next shines once (its animation runs within 100 ms of the gesture and is gone after 1 s); swipe down and wheel up: Back shines; ten wheel events in 200 ms: one shine; a tap, a horizontal swipe, a drag in explore, a swipe inside an open sheet, a scroll at the top: no shine. Screenshots mid-shine (device scale 2) of Next and Back on the phone bar and on the desktop pill.

## Checks

As in `COMB-G.md`: real input only, all tests pass, pins re-recorded where they change and named in the report, no frame-cost runs, gzip budgets hold. After part 9 the modules and CSS are at 182.98 of their 185 KB gzip budget, so keep every addition small, and never raise a budget. Add the tests as `tools/comb-g2-*-test.mjs`. Aim to finish within 75 minutes.

## Rules

- You may write only these files, all under `design/journey-map/`: `findkit.mjs` and `finds.mjs` (the pending press for G12 only), `findhoards.mjs` (G16a only), `findwater.mjs` (G16b only), `steps.mjs` (G12's new destinations, G27 and G30), `cards.mjs`, `timeline.mjs` and `minimap.mjs` (only to drop the pending press on their jumps, G12), `main.mjs` and `footer.mjs` (the X press's route for G27 and the X's target for G14b only), `data.mjs` (`STEPS.shine` and the X's words only), `map.css` (G30, and the X's target in short landscape for G14b, only), the test files in `tools/`, `joined.html`, `dist/journey-map.html` and `dist/journey-joined.html` (these three only through `node tools/pack.mjs` and `node tools/pack-joined.mjs`), and your report `COMB-G2-BUILD.md`. The browser's profile, captures and full test logs go only in the run folder your prompt names.
- Never touch `depth.mjs` (not even a comment), `hero-copy/`, the briefs and other build reports, the audits, or anything else outside `design/journey-map/`.
- Never run git, never install anything, never use the network (the local headless Edge on 127.0.0.1 is not the network), never start reviewer agents or other agents.
- If a rule stops you from doing something this brief asks, leave it out and say so in your report. Do not work around a rule.
- Plain ASCII punctuation in `COMB-G2-BUILD.md`.

## Report

`COMB-G2-BUILD.md`, short: for each item, what you changed and why, with the screenshots asked for; each test you changed or added and why; one table with the last exit of every test you ran; anything you left out and why; what the review should look at. Full test output in a log file in the run folder, not in the report.
