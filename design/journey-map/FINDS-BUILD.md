# FINDS build � Part A

23 November 2026. Sections 3�9 and their Part A portions of 16�19 are implemented. Part B is deliberately deferred. Browser review is still required.

## Constraints carried forward

Read FINDS in full, including Part B, its named find/art/data/controller/frame sources, DEPTH-BUILD, and the prior build records. The established detailed chart, winding trail, fine Paper strokes, rune instrument, standing stones and branded cards are the design constraints. No new personal facts, quotes or career copy were invented. The raven's thoughts read the existing STOPS copy.took and dates at the time of the return.

Acceptance criteria used: preserve the ground output exactly; preserve progress and the traveller when focusing; allow the initiating press and drag to play immediately; close overlays when leaving a find; retain each Part A payoff; keep the five Part B plays/drawings intact; give every find camera/popup/count integration; keep keyboard, touch and the stacked reduced-motion page usable; keep tuning copy/geometry/clocks in data; expose plain copied review state.

This file is the expressly requested project record inside the allowed file set. No external coordination file or pointer Markdown was created.

## What was built

- Shared kit (`findkit.mjs`): per-find place/radius/on-screen/awake/kept state, fresh hover/traveller attention, one seeded find random stream, 96 reusable bits, measured/clamped anchored popups with tails and an animated inner, chips for author slots, dialog focus/keyboard/wheel handling, marker fills, queued single-star count flights and count bumps. Overlay epochs prevent a finishing play from reopening an overlay after release or after another find takes the camera.
- Camera (`steps.mjs`, one appended `tripFocus` export, main wiring): rests at the same P, folds the card, geometrically changes scale, eases between views and releases without a return jump. Back only releases; Next releases and continues. Timeline, mini-map, mode changes, Home/End and Escape retain their roles. The return pill reads �Back to the trail�. The review exposes focus as the held id or null.
- Wayfinder (`findhoards.mjs`): spring needle, exact pointer drag, awake pointing, arm pulse/thickness, retracting/growing sight lines and arrival rings, tally, shared card/timeline masks, persistent rune rotation, four-craft unlock and a derived all-four mask. Today that mask selects Lennard alone. Its hear answer spins the existing needle.
- Hoards (`findhoards.mjs`): three independent digs, held repeat, holes/earth/clods/puffs, thirds of chest rise, rattle, a separate opening move, original lid and eight-star burst plus pooled stars, persistent open chests and piece cards. Each card has its place-colour edge, opened-hoard tally, actual image or a kind-specific vector icon, existing title and inactive case-study button. Each chest has its own review state. The hoards count as one find when the first chest opens. Hear jumps the unopened scratch and glints.
- Ravens (`findcreatures.mjs`): distinct back-to-back birds with sitting/flying poses inside their original groups, attention/preening/ruffling/shyness, alternating flights with banking, flapping, rise/fade, carried items and landing squash. Huginn cycles through real stop thoughts/dates and keeps six tally scratches. Muninn returns the existing five-second iris reel with its new kicker and author slot. Hear makes both birds loop and return without a reward.
- Serpent (`findcreatures.mjs`): three-poke chase through the three supplied spots, travelling-wave loops, attention and tongue, flinch/sink/swim/wake/surface, three calendar leaves, eating and sequential gulp, a �Deadline met� payoff plus a slot, sleeping/settling/breathing and a later wake. The moving inner leaves the find's home data attributes intact. Hear ducks its head, or opens its sleeping eye.
- Beacon (`findsheets.mjs`): manual aim and keyboard snap to the next unread note, cumulative reading, persistent lines, note flashes/sparks, growing Paper fire/glow/embers, lit leap and full rotating extended beam, and its hear dip/flare. `beaconLit()` is exported for Part B. The single added `depthBeam` export inserts a soft wedge at the existing destination-out boundary and includes it in lightAt; the original depth functions were not edited.
- Rune stone (`findsheets.mjs`): red carving trace; grown, pointer-rubbable masked charcoal sheet; sampled rubs, cell coverage and keyboard/button/idle zigzag; fill and nineteen individually rising/fading letters; delayed controls, flip to the existing poster, first stamp/shake, author slot at the foot, hover tilt, close-to-stone and persistent readable rubbing. Art exports rune middles/letters and the rubbing drawing. Hear runs the Paper band dash.
- Review (`window.__jm.finds`): found ids in first-play order; a plain copied state for a FINDS id or any chest id; Part A hear dispatch; and current screen placement. `window.__jm.focus` names the camera holder. No visit storage was added.
- Art/data/CSS: six Part A drawings are supplied by FIND_PLAY.drawings, with live bindings for relevant shared parameters. Original popup/reel/poster CSS dimensions and motion values moved into FIND_PLAY.css; new styles use the named FIND_PLAY parameters. Original map line classes and retained Part B drawings remain. Six marker groups have ids; the legend has none.
- Part B (`findlegacy.mjs`): the original tafl slide, mouse/press mist wipe, raised horn popup, undoing well and ship-line popup remain. They now use the shared camera, popup and found feedback. Their replacement plays, new drawings, hear answers, new content and all-eleven celebration were not built. No tafl rules module or tafl test was added.

## Precedence decisions and departures

1. The prompt's specific deferral of Part B takes precedence over section 16's general copy changes for those finds. COPY.wellSub, their spoken labels and their existing placeholder strings remain as today. The well still undoes the last find. Part B's slots, Norns, ship log, horn sounding and all-eleven wording/celebration belong to the later run. COPY.todo and COPY.countAll are present for the shared kit/future run.
2. Section 2's data rule takes precedence over inline numerical SVG/CSS examples. Part A drawing geometry, new particle paths, legacy popup/sheet style values, added sizes and motion settings are data. Mathematic identities, indices and unit conversions remain calculations in code. No STARS, DEPTH or NOVA value changed; the regression digest checks their values.
3. The single-export restrictions are preserved. COPY.findFocus is a live getter alias to FIND_PLAY.focus so tripFocus needs no import edit. MAP.findBeam similarly supplies defaults to the additive depthBeam hook without changing depth imports. The hook wraps the existing compositing boundary and lighting function from inside that one export. Main changes are wiring only.
4. Camera capture also runs on pointer down, in addition to click and Enter/Space, so the same first press can start a dig or drag. A refused pointer-down gesture also suppresses its eventual click. This is the small input extension needed to combine section 3.3 with the pointer-down digging of section 5; no replay or pointer-down visit guard remains.
5. Section 2's frame rule takes precedence over direct frame-loop dash/display/text writes. Trace/reel dash animations are configured when opened using the browser animation API; state-boundary DOM changes, popup measurement, dead-bit display changes and count text updates run outside the frame callback. The frame owns transforms/opacities and particle shape setup. No new SVG filter or animated filter was added.
6. In reduced motion the five-second memory remains open long enough to read, with static shapes and immediate iris placement/closing; the other moves land immediately. No camera focus, bits, loops or star flights run there.

No other intentional design/content departures. Visual fidelity and actual input behavior are unverified until the browser review below; passing Node checks is not a design approval.

## Final checks

All final commands exited 0. Neither pack tool needed an edit.

1. `node --check` on every `.mjs` recursively under design/journey-map: `ok: node --check on all 40 .mjs files under design/journey-map/`.
2. `node tools/check.mjs`:

   ```text
   ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 18 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 10 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, three bounded serpent spots/leaves, nine fixed views
   ```

3. `node tools/finds-test.mjs`:

   ```text
   ok: original sea/fill/coast lengths and hashes unchanged
   ok: STARS, DEPTH and NOVA values unchanged
   ok: trip.mjs original bytes unchanged before the single appended export
   ok 1440x900: 36 views/cameras, k=0 deep-equal, k=1 centred/clamped/cards folded, monotone scale, P/traveller unchanged
   ok 390x664: 36 views/cameras, k=0 deep-equal, k=1 centred/clamped/cards folded, monotone scale, P/traveller unchanged
   ok: eleven accessible find groups, six marker ids and unnumbered legend id
   ok: all-four mask derived from STOPS is Lennard alone; nineteen rune middles/letters; all piece icons available
   ok: recording DOM runs six Part A plays, kept state, all-four unlock, reel, chase, four notes, rubbing, copied review state and Back/Scroll focus rules; no NaN attributes or frame layout reads
   ok: five retained Part B handlers still move/wipe/raise/undo/open; all eleven count through the shared kit
   ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged
   ```

   The extra Node recording DOM is a state/attribute harness, not pixel rendering or a real browser. It also checks rejection before the map/during a jump, and that releasing a flight preserves its tally without reopening the popup. Baselines recorded before art edits: sea 73566 / 1305240864; fill 12855 / 3665486802; coast 4401 / 2408021381 (length / FNV-style digest). Protected-table digest: 3201252347. Original trip bytes digest: 3102748704.
4. `node tools/depth-test.mjs`: all nine output lines pass. Desktop 1440�900 and phone 390�844 cloud/deck passage, all six leg midpoints, camera boundaries, fixed ground, depth-off scale, recorded hero/sky/nova/still commands, and repeatable flare timing pass unchanged.
5. `node tools/steps-test.mjs`: pace rises and inverse agrees within 1e-6; all 18 moves start/end without reversing; all nine forward durations remain 1.5�5 seconds. Forward/back seconds: top�map 4.100/2.460; map�Laurier 3.180/1.908; Laurier�HMC1 3.637/2.182; HMC1�Mohawk 3.858/2.315; Mohawk�HMC2 4.033/2.420; HMC2�Interkom 3.253/1.952; Interkom�Lennard 3.630/2.178; Lennard�X 2.020/1.212; X�end 4.200/2.520.
6. `node tools/pack.mjs`: packs all 17 runtime modules; `dist/journey-map.html 426.3 KB`.
7. `node tools/pack-joined.mjs`: `joined.html written`; packs the map plus join; `dist/journey-joined.html 965.7 KB`. The existing pack tools' offline/reference checks pass.

No git, installs, network requests, server, browser or other agents were used. Source writes stayed in the authorized file set. The packers regenerated only their authorized outputs. Protected hero/reference/assets files and all listed frozen source/build documents were not changed.

## Browser review still to do

- Compare actual desktop and phone renderings side by side with the approved detailed chart and original find drawings at reading scale. Ground hashes prove source preservation, not visual composition. Check hierarchy, fine strokes, rune density, back-to-back raven legibility, the serpent at all three spots, popup/card size and the retained Part B appearance.
- At 1440�900 and 390�664, press a find at overview, while moving between beats and under an open card. Check focus scale, straight centre travel, card folding, dusk thinning, persistent P, swapping find views, Back/Next/wheel/swipe/arrows/Page keys/Home/End, timeline/mini-map, Escape and both modes. Try rejected presses before/after the playable map and during a jump.
- Drive every id and chest through __jm.finds.state/place/found; verify copied arrays do not mutate the live state. Call hear in each Part A stage. Part B hear answers are intentionally absent until its run.
- Mouse, pen and touch: hold-dig all chests, release/cancel mid-hold, open/reopen cards; drag the spring needle and beacon while the camera moves; rub slowly/quickly, touch over auto-rubbing, and use the auto button. Confirm no drag steps the journey, focus restoration works, sheets own their navigation keys/wheel and no hit target is too small.
- Check wayfinder line retraction/order/arrival pings, all-four unlock and steady spin; each hoard's rattle/lid/glow/burst and piece colours; bird banking/flap/flare/squash, real thought order and reel iris; serpent loop order, wake, third-leaf eating and sleeping state; four persistent notes, Paper flame, beam softness and lightAt response; rubbing hatch/mask coverage, nineteen letter centres, flip/stamp/shake, tilt and closing.
- Test very narrow/short views and large text: popup clamping, tail anchoring, image cards, sheet fit and controls. Measure clipping, animation overshoot, SVG non-scaling stroke/dash behavior and browser animation support.
- With reduced motion, check the stacked page, immediate landings, static five-second memory, no camera motion/loops/bits/flights, working controls and all kept results. Compare both packed files, including joined hero handoff and return.
- Verify no console errors or requests with network blocked; measure real frame time and off-screen idling. No rendered/independent critique or browser performance claim is made in this build.

## Slots and missing pieces for Dan

Author slots implemented in Part A:

- FIND_COPY.reelToCome: the actual memory reel/content (�Reel to come�).
- FIND_COPY.serpentLines[0], [1], [2]: three deadline stories.
- FIND_COPY.beaconNotes[0..3].t: four invisible-ink notes.
- FIND_COPY.poster.foot: stock and the brief, combined at the poster foot.

Other existing missing deliverables retained: Laurier's piece/title, SafetyDrivesUs imagery, Melanoma Canada imagery and the 1 King Street W imagery/case studies. The annual-report image remains the real existing asset. Part B's existing tafl fact, horn quote and crossing line remain unchanged for that run; the well's new answers will come from STOPS then.
