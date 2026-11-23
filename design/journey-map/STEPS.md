# Journey map: move in steps instead of by scroll

Read this whole file before writing anything. Read `main.mjs`, `trip.mjs`, `join.mjs`, `cards.mjs`, `timeline.mjs`, `finds.mjs`, `footer.mjs`, `data.mjs` and `map.css` as well. `BRIEF.md`, `JOIN.md`, `BUILD.md` and `JOIN-BUILD.md` say how the page came to be.

## 1. Why

Dan scrolled the joined page and said: "maybe instead of scrolling, we have a way to go next as scrolling feels jittery only because people scroll at different speeds and the experience will vastly differ for people."

So the journey stops following the scroll bar. It rests at a few places, called beats, and one press plays the move to the next beat at a set speed with set easing. Every visitor gets the same motion. The old scrolling stays in the page behind a review-only switch, so Dan can compare the two.

A second, small change rides along: Lennard's card goes back to its earlier layout (section 12).

## 2. Hard rules

The sandbox on this machine is off, so these matter.

- Change files only inside `design/journey-map/`, and only these:
  - `data.mjs`, `main.mjs`, `trip.mjs`, `cards.mjs`, `finds.mjs`, `footer.mjs`, `timeline.mjs`, `join.mjs`, `map.css`, `join.css`, `tools/check.mjs`
  - new: `pace.mjs`, `steps.mjs`, `tools/steps-test.mjs`, `STEPS-BUILD.md`
  - written by the pack tools: `joined.html`, `dist/journey-map.html`, `dist/journey-joined.html`
- Never change anything in `hero-copy/`, `reference/` or `assets/`. Never change `BRIEF.md`, `JOIN.md`, `STEPS.md`, `BUILD.md`, `JOIN-BUILD.md`, `stars.mjs`, `art.mjs` or `index.html`. Change `tools/pack.mjs` or `tools/pack-joined.mjs` only if packing fails without it, and say why in your report.
- Never touch any other path on the machine. Never run git. Never install anything. No network access, at build time or at run time.
- Do not start reviewer agents or sub-agents, even if your global instructions say to. The review happens elsewhere, in a real browser. Do not leave a server running. Do not claim a visual check you did not make.
- You may run `node` on files inside `design/journey-map/`.
- Module style, as now (`tools/check.mjs` enforces it): named exports and named imports only, each import on one line from a sibling file, no default exports, no dynamic imports, no top-level await, every top-level name unique across all modules, no colour literal outside `data.mjs`, no colour literal in `map.css`. Every line of copy and every timing lives in `data.mjs`.
- The rule from `BRIEF.md` still holds: everything on the trip is a pure function of progress `P`. This work changes only where `P` comes from. `tripState(P)` and the `ACTS` table keep their meaning and their values.

## 3. Two modes

- **Steps** (the default): the page does not scroll. `P` is driven by a clock.
- **Scroll**: exactly today's behaviour. `P = window.scrollY / VIEW.unit`.

Reduced motion (`prefers-reduced-motion: reduce`) always uses today's stacked, scrolling page. No stepper, no switch, nothing else new.

Start mode: `?mode=scroll` or `?mode=steps` in the address wins, then the value saved in `sessionStorage` under `jm-mode` (wrap every read and write in try/catch), then Steps.

`steps.mjs` owns the one value of `P` for both modes. `main.mjs` asks it once per frame, and `join.mjs` uses the same value. Nothing else reads `window.scrollY` to find progress.

In Steps mode:
- `<html>` has the class `jm-steps` (in Scroll mode, `jm-scroll`). `#trip` is one viewport tall. `html` and `body` get `height: 100%`, `overflow: hidden` and `overscroll-behavior: none`. Scroll to 0, and set `history.scrollRestoration = 'manual'`.
- `.stage` gets `touch-action: pinch-zoom`, and a phone card (`.face`) gets `touch-action: pan-y pinch-zoom`, so the browser never pans the page but a tall card still scrolls inside.
- A resize keeps `P` as it is.

## 4. Beats

Ten places where the page rests. Build them in the new `pace.mjs` from `SEQ`, never from typed numbers.

| # | id | P | what the visitor sees |
|---|---|---|---|
| 0 | `top` | 0 | the hero |
| 1 | `map` | the middle of the `overview` act (255) | the whole map |
| 2 to 7 | the stop's own id | `progressForStop(i)` | the stop's card, open |
| 8 | `x` | the start of the `rush` act (1904.8) | the traveller at the X |
| 9 | `end` | the start of the `rest` act (2144.8) | the footer, settled |

`pace.mjs` is pure (no DOM, no `window`), so Node can import it. It exports the beats and the functions in section 5.

One fix in `trip.mjs` makes beat 8 clean. Today the camera jumps about 20 px where the last leg ends and the rush starts: the leg centres on the smoothed trail, and the rush centres on the X itself. Make the rush start from the centre the leg ended on and ease to the X with `e1`, so there is no jump at that boundary. Nothing else in `tripState` changes.

## 5. Pace: how long a move takes

Add one table to `data.mjs`. All values are seconds unless noted.

```js
export const STEPS = {
  // seconds to play each stretch of the trip at its own pace
  pace: { hero: 0.9, handoff: 2.8, overview: 0.8, pushIn: 1.6, holdIn: 1.0, holdOpen: 0.4, holdOut: 0.6,
          legBase: 0.8, legPerVh: 0.006, legMax: 2.4, legX: 1.2, rush: 1.3, blast: 1.6, settle: 1.3 },
  ramp: 0.35,        // easing at each end of a move
  back: 0.6,         // going back takes this share of the time
  hurry: 0.3,        // a press during a move finishes it within this
  minMove: 0.3,
  cut: [0.18, 0.32], // a jump: fade out, fade in
  wheel: { min: 24, quiet: 180 },  // px of wheel to count as a gesture; ms without wheel events that ends one
  swipe: { min: 48, slope: 1.5 },  // px of travel; how much more vertical than sideways
  nav: { h: 44, gap: 14, bar: 52 }, // the stepper: height and gap above the timeline on desktop; the bar's height on phones
};
```

**Parts.** Cut the trip into parts, in `SEQ` order. Inside a part, time is linear in `P`.
- `hero`, `handoff`, `overview`, `pushIn`, `rush`, `blast`, `settle`: one part each, with that key's seconds.
- each `hold`: three parts, split at `HOLD.open[1]` and `HOLD.fold[0]` of its length, taking `holdIn`, `holdOpen` and `holdOut`.
- each `leg`: one part of `min(legMax, legBase + legPerVh * len)`. `legX`: one part of `legX`.
- `rest`: no part. Nothing moves there, and steps never go past its start.

**Functions.**
- `paceT(P)`: seconds from 0 to `P` at this pace (`P` clamped from 0 to the start of `rest`). `paceP(T)`: its inverse.
- A move from `P0` to `P1`: `T0 = paceT(P0)`, `T1 = paceT(P1)`, and its length `D = max(minMove, |T1 - T0| * (P1 < P0 ? back : 1))`.
- At `t` seconds into a move: `x = ease(t / D)`, then `P = paceP(T0 + (T1 - T0) * x)`.
- `ease(x)` holds a steady speed with a ramp at each end. With `r = min(0.5, ramp / D)`: below `r` it is `x*x / (2*r*(1-r))`; above `1-r` it is `1 - (1-x)*(1-x) / (2*r*(1-r))`; between, `(x - r/2) / (1-r)`.

With these values a press takes 2.0 to 4.2 seconds: hero to map 4.1, map to Laurier 3.2, stop to stop 3.3 to 4.0, Lennard to the X 2.0, the X to the footer 4.2.

**The clock.** Advance a move inside the existing frame loop, from the frame's timestamp. Count at most 0.05 s for one frame, so a move pauses with a hidden tab and never skips ahead. No second `requestAnimationFrame` loop, and no timers for motion.

## 6. Going somewhere

`steps.mjs` exports the controller. In Steps mode:

- **Next** goes to the first beat with `P` more than 0.5 above the current `P`. **Back** goes to the last beat more than 0.5 below it. Both work from any `P`, at rest or in the middle of a move.
- **A press during a move.** If it asks for the move's own target, hurry: finish from the current `P` within `min(time left, hurry)`, easing out. If it asks for anything else (Back during a forward move), start a new move from the current `P`.
- **Go to a beat** (timeline block, mini-map stop, a stone, Home, End). If no other beat lies between the current `P` and the target, play it as a move. Otherwise it is a **jump**: fade a full-stage Ink cover in over `cut[0]`, set `P`, fade it out over `cut[1]`. The cover is its own element above the map, the stars and the cards, and below the stepper. Presses during a jump are ignored.
- **Set `P` directly** (dragging the timeline). Cancels any move. `P` then rests where it was left, and Next and Back work from there.

In Scroll mode the same calls do what they do today: `window.scrollTo`, smooth for a stop, instant for a scrub.

Route every existing caller through the controller: `goStop` and the two timeline hooks in `main.mjs`, the mini-map stops, the stones.

## 7. Input (Steps mode only)

**Wheel**, one listener on `window`, `{ passive: false }`.
- Let it through untouched when `ctrlKey` is down (pinch and browser zoom), or when its target is inside a `.face` that can still scroll in that direction.
- Otherwise call `preventDefault()`, always, so the wheel never scrolls a page around this one.
- A gesture is a run of wheel events with gaps under `wheel.quiet` ms and one direction. Normalise `deltaMode` (a line is 16 px, a page is the viewport's height). When a gesture's summed `deltaY` passes `wheel.min`, it counts as one press, Next for down and Back for up. Then the rest of that gesture is ignored, inertia included. A new gesture starts after the quiet gap or when the direction turns.

**Keys**, one `keydown` listener on `window`.
- Next: ArrowDown, ArrowRight, PageDown, Space. Back: ArrowUp, ArrowLeft, PageUp, Shift+Space. Home goes to `top`, End to `end`.
- Ignore the event when `defaultPrevented` is already true (a find or the timeline used the key), when `repeat` is true, when Ctrl, Meta or Alt is down, or when the target is inside `.tl`.
- Ignore Space when the target is a button, a link, an input, a `.find`, or anything with `role="button"`: that press belongs to the control.
- Call `preventDefault()` on every key you act on.

**Touch**, with `touchstart`, `touchmove` and `touchend` on `window`.
- A swipe is `swipe.min` px of travel that is at least `swipe.slope` times more vertical than sideways. Up is Next, down is Back. Act as soon as it qualifies, once per touch. Ignore touches with more than one finger.
- Ignore a touch that starts inside `.tl`, `.find`, `.pop`, `.sheet`, the stepper or the review switch. Ignore one that starts inside a `.face` that can still scroll in the direction of the swipe.

## 8. The stepper

The visible way to go next. Build it in `steps.mjs`. Its copy is in section 13.

```html
<div class="go" id="go" role="group" aria-label="…" hidden>
  <button class="go-back" type="button" aria-label="…">(arrow, pointing left)</button>
  <button class="go-next" type="button"><i class="go-fill" aria-hidden="true"></i><span class="go-t">…</span>(arrow)</button>
  <button class="go-top" type="button">…</button>
</div>
<p class="sr" id="go-say" role="status"></p>
```

- Put `.go` straight in `.stage`, before the map's `<svg>` in the DOM, so it comes early in the tab order. It sits above everything else in the stage, the jump cover included. Reuse the `.arr` arrow.
- **Desktop.** Centred, its bottom edge `nav.gap` px above the timeline bar. Next is a Paper pill with Ink text, `nav.h` tall, at least 230 px wide, label centred, Outfit 14 px at weight 700. Back is a `nav.h` circle with an Ink ground, a 1 px Mid border and a Paper arrow. No Red anywhere on it.
- **Phones** (up to 640 px wide). A bar `nav.bar` px tall across the very bottom on an Ink ground: Back is a square at the left, Next fills the rest. The timeline moves up to sit on top of the bar.
- **Room for it.** `tripResize` is given the timeline's height plus the stepper's (`nav.h + nav.gap + 6` on desktop, `nav.bar` on phones), so the whole map still fits above both at beat 1. On phones a card's bottom edge sits 6 px above the bar, and its height is at most 82 percent of the view less the bar. On desktop a card keeps at least 12 px clear of the stepper: move its centre up when the view is short, never closer than 12 px to the top. In Scroll mode all of this is as today.
- **Labels.** Next names the beat it leads to (section 13). Its label changes when the page arrives, never during a move.
- **During a move.** `<html>` has the class `jm-moving`. `.go-fill` is an Ink wash at 14 percent over the pill, scaled from the left by the move's progress (transform only, set in the frame loop). The buttons stay live, for hurrying and for turning back.
- **At `top`.** Back is hidden. On the stand-in page Next reads `start`. On the joined page the hero has its own control (section 10) and the stepper is hidden altogether. `join.mjs` says so with a flag on the existing `JOIN` object.
- **At `end`.** The footer fills the view, so the stepper moves to the top left corner (28 px in, 20 px down; 16 and 14 on phones) and becomes two quiet controls: Back (the circle) and `.go-top`, a text button in the cue's small caps style that jumps to `top`. Next is hidden. If the hidden button held the focus, move the focus to Back.
- **States.** Hover on Next moves its arrow 2 px. Active scales the pill to 0.97. The page's focus ring applies. The stepper fades in over 0.3 s the first time it shows. Use transform and opacity only.
- **Announce.** When the page arrives at a beat, write that beat's line into `#go-say`.
- Set `data-beat` on `<html>` to the id of the beat the page rests on, or to an empty string when it rests elsewhere.

The map's cue ("Scroll to set out") is hidden in Steps mode.

## 9. Finds and the X

**Finds.** In Steps mode the page rests on stops, where a card covers the map, so a find needs a way to be reached. When a find is pressed (click, Enter or Space) while any of these is true: the camera is under 80 percent of the trip's scale, a card is more than half open, or the find's centre is outside the middle 80 percent of the view, then the page goes to the find first.
- Catch the press in the capture phase on the map's `<svg>`, for any target inside a `.find`. Stop it and remember the element. Every `.find` carries its place in map units as `data-x` and `data-y`.
- The place to go: sample `P` every 2 vh through every `leg` and `legX` act, and take the `P` whose state puts the find nearest the point 50 percent across and 46 percent down the view.
- Go there as a jump. On arrival, send the same press on to the find, once: a click as a click, a key as the same key. Let that one through untouched.
- Remember the `P` the visitor came from. While that is remembered, Back returns there (as a jump) and its label is `returnTo`. Any other navigation forgets it.

In Scroll mode finds behave as today.

**The X.** Give the X a transparent round hit area with `role="button"`, `tabindex="0"` and the label `dig`. It takes presses only between the end of the hand-off and the start of the rush. Pressed at beat 8, it does what Next does. Pressed from anywhere else, it goes to beat 8. In Scroll mode it scrolls smoothly to the end.

## 10. The joined page (`join.mjs`, `join.css`)

- `place()` takes `P` from the controller. Keep the `scroll` listener for Scroll mode.
- The hero's own code re-measures on `scroll` events: the name's reaction and its stars both listen. In Steps mode there are none, so after every change of the lift (`setLeave`) dispatch a plain `scroll` event on `window`. The map's own listeners must do nothing with it in Steps mode.
- **The hero's start control.** The hero's foot holds `<p data-cue>Scroll for the journey</p>`. In Steps mode, replace that paragraph's content with `<button type="button" class="jm-start">` holding the `start` copy. Do it as `join.mjs` first runs, which is before the hero's own script. Style it in `join.css` to inherit the paragraph's type and colour exactly: no ground, no border, no padding, a pointer cursor, the page's focus ring. A press on it is Next. In Scroll mode put the original text back. Swap it again whenever the mode changes. This happens in the page at run time. No file in `hero-copy/` changes.
- While the hero is present the map and its overlay are inert, as now. The stepper is outside the overlay, so hide it yourself at `top` on this page.
- Layer order in the stage: hero 1, star canvas 2, overlay 3, jump cover 4, stepper 5.
- Reduced motion on this page stays exactly as it is.

## 11. The review switch

Review only, to be removed before launch. A small fixed control at the top centre of the view, appended to `body` (it must work while the overlay is inert), above everything: a `preview` label and two buttons, Steps and Scroll, with `aria-pressed`. Type 10 px, small caps, Dim, with the pressed one in Paper. Mark it `data-review`.

Switching live keeps the place:
- to Scroll: give `#trip` its tall height again, restore page scrolling, and scroll to `P * VIEW.unit` at once.
- to Steps: read `P` from the scroll position, make `#trip` one view tall, scroll to 0, then play a move to the nearest beat.

Save the choice in `sessionStorage`. Call `resize()` after a switch, because the map's fit and the cards' places differ between the modes.

## 12. Lennard's card

Dan, 22 November: "i think we go back to the old lennard layout, the white by itself is too simple. still the correct colors though".

So Lennard's card goes back to the band layout, like Laurier's: a white band at the top holds the logo, and the field below is Lennard's orange with white type. The colours stay the ones from Lennard's design system. The orange is `#FF4C00`. The only dark is Warm Gray 11, `#706259`, which now fills the date pill and letters the button. Never `#0F151E`, `#1A1A1A` or black.

In `data.mjs`:

```js
lennard: { logo: 'assets/logos/lennard.png', layout: 'band', ground: '#FF4C00', text: '#FFFFFF', sub: '#FFFFFF', button: '#FFFFFF', buttonText: '#706259', pill: '#706259', pillText: '#FFFFFF', band: '#FFFFFF', headline: '#FFFFFF', mark: '#FF4C00', hairline: '#FFFFFF', smallWeight: 500, chip: '#FFFFFF', chipText: '#706259' },
```

Three optional palette keys are new, and only Lennard sets them:
- `smallWeight`: the weight of the role line, the paragraph, the craft labels, the caption and the empty frame's text. `cards.mjs` passes it as `--sw`, and `map.css` uses `font-weight: var(--sw, 400)` on those.
- `chip` and `chipText`: the fill and text of the step chips (`.c-steps li`), passed as `--chip` and `--chtx`. With no value a chip stays as it is now, an outline in the hairline colour.

Replace the comment above the row. Update `tools/check.mjs`: Lennard's layout is `band`, its ground is `#FF4C00`, and the three new keys are allowed.

## 13. Copy (all of it draft, in `data.mjs`)

```js
// COPY.steps
group: 'Move through the journey',
start: 'Start the journey',        // to the map: the hero's own control, and Next at the top of the stand-in page
setOut: 'Set out',                 // to the first stop
next: 'Next: {name}',              // to a later stop, with that stop's `short` name
toX: 'Next: the X',
dig: 'Dig here',                   // to the end, and the X's own label
top: 'Back to the top',
back: 'Back: {name}',              // the Back button's spoken label
returnTo: 'Back to where you were',
names: { top: 'the top', map: 'the whole map', x: 'the X', end: 'the end' },
say: { top: 'The top of the page', map: 'The whole map', stop: 'Stop {n} of {t}: {name}, {dates}', x: 'The X', end: 'The end of the trail: contact and links' },
review: { label: 'Preview only', steps: 'Steps', scroll: 'Scroll' },
```

## 14. A handle for the review

```js
window.__jm = { mode, P, moving, beats, go(id, opts), next(), back(), set(P), setMode(mode) }
```

`mode`, `P` and `moving` are getters. `beats` is the list of `{ id, P }`. `go(id, { instant: true })` lands at once, with no move and no fade. Also read `?beat=<id>` from the address and start there at once.

## 15. Checks to run before you finish

1. `node --check` on every `.mjs` you changed or added.
2. `node tools/check.mjs`. Add to it: every `STEPS` number is finite and positive, there are ten beats with strictly rising `P`, and Lennard's row as in section 12.
3. `node tools/steps-test.mjs` (new, Node only, imports `pace.mjs`):
   - `paceT` rises strictly, and `paceP(paceT(P))` returns `P` within 1e-6 for every whole `P` from 0 to the start of `rest`.
   - a move starts on `P0`, ends on `P1` and never turns back, for every pair of neighbouring beats in both directions.
   - print the length of every move between neighbouring beats, and fail if a forward one is under 1.5 s or over 5 s.
4. `node tools/pack.mjs` and `node tools/pack-joined.mjs` both pass.
5. Read your changes once more against sections 2, 3 and 7.

## 16. STEPS-BUILD.md

Short and plain: what each changed file now does, the table of move lengths the test printed, every place you departed from this brief and why, and what could not be checked without a browser. Finish with a list of the things a browser check should look at first.
