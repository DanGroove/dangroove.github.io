# FINDS build: Part A

23 November 2026. Sections 3 to 9 and their Part A portions of 16 to 19 are implemented. Part B is deliberately deferred. Browser review is still required.

## Constraints carried forward

Read FINDS in full, including Part B, its named find/art/data/controller/frame sources, DEPTH-BUILD, and the prior build records. The established detailed chart, winding trail, fine Paper strokes, rune instrument, standing stones and branded cards are the design constraints. No new personal facts, quotes or career copy were invented. The raven's thoughts read the existing STOPS copy.took and dates at the time of the return.

Acceptance criteria used: preserve the ground output exactly; preserve progress and the traveller when focusing; allow the initiating press and drag to play immediately; close overlays when leaving a find; retain each Part A payoff; keep the five Part B plays/drawings intact; give every find camera/popup/count integration; keep keyboard, touch and the stacked reduced-motion page usable; keep tuning copy/geometry/clocks in data; expose plain copied review state.

This file is the expressly requested project record inside the allowed file set. No external coordination file or pointer Markdown was created.

## What was built

- Shared kit (`findkit.mjs`): per-find place/radius/on-screen/awake/kept state, fresh hover/traveller attention, one seeded find random stream, 96 reusable bits, measured/clamped anchored popups with tails and an animated inner, chips for author slots, dialog focus/keyboard/wheel handling, marker fills, queued single-star count flights and count bumps. Overlay epochs prevent a finishing play from reopening an overlay after release or after another find takes the camera.
- Camera (`steps.mjs`, one appended `tripFocus` export, main wiring): rests at the same P, folds the card, geometrically changes scale, eases between views and releases without a return jump. Back only releases; Next releases and continues. Timeline, mini-map, mode changes, Home/End and Escape retain their roles. The return pill reads "Back to the trail". The review exposes focus as the held id or null.
- Wayfinder (`findhoards.mjs`): spring needle, exact pointer drag, awake pointing, arm pulse/thickness, retracting/growing sight lines and arrival rings, tally, shared card/timeline masks, persistent rune rotation, four-craft unlock and a derived all-four mask. Today that mask selects Lennard alone. Its hear answer spins the existing needle.
- Hoards (`findhoards.mjs`): three independent digs, held repeat, holes/earth/clods/puffs, thirds of chest rise, rattle, a separate opening move, original lid and eight-star burst plus pooled stars, persistent open chests and piece cards. Each card has its place-colour edge, opened-hoard tally, actual image or a kind-specific vector icon, existing title and inactive case-study button. Each chest has its own review state. The hoards count as one find when the first chest opens. Hear jumps the unopened scratch and glints.
- Ravens (`findcreatures.mjs`): distinct back-to-back birds with sitting/flying poses inside their original groups, attention/preening/ruffling/shyness, alternating flights with banking, flapping, rise/fade, carried items and landing squash. Huginn cycles through real stop thoughts/dates and keeps six tally scratches. Muninn returns the existing five-second iris reel with its new kicker and author slot. Hear makes both birds loop and return without a reward.
- Serpent (`findcreatures.mjs`): three-poke chase through the three supplied spots, travelling-wave loops, attention and tongue, flinch/sink/swim/wake/surface, three calendar leaves, eating and sequential gulp, a "Deadline met" payoff plus a slot, sleeping/settling/breathing and a later wake. The moving inner leaves the find's home data attributes intact. Hear ducks its head, or opens its sleeping eye.
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
4. `node tools/depth-test.mjs`: all nine output lines pass. Desktop 1440 by 900 and phone 390 by 844 cloud/deck passage, all six leg midpoints, camera boundaries, fixed ground, depth-off scale, recorded hero/sky/nova/still commands, and repeatable flare timing pass unchanged.
5. `node tools/steps-test.mjs`: pace rises and inverse agrees within 1e-6; all 18 moves start/end without reversing; all nine forward durations remain 1.5 to 5 seconds. Forward/back seconds: top to map 4.100/2.460; map"Laurier 3.180/1.908; Laurier"HMC1 3.637/2.182; HMC1"Mohawk 3.858/2.315; Mohawk"HMC2 4.033/2.420; HMC2"Interkom 3.253/1.952; Interkom"Lennard 3.630/2.178; Lennard"X 2.020/1.212; X"end 4.200/2.520.
6. `node tools/pack.mjs`: packs all 17 runtime modules; `dist/journey-map.html 426.3 KB`.
7. `node tools/pack-joined.mjs`: `joined.html written`; packs the map plus join; `dist/journey-joined.html 965.7 KB`. The existing pack tools' offline/reference checks pass.

No git, installs, network requests, server, browser or other agents were used. Source writes stayed in the authorized file set. The packers regenerated only their authorized outputs. Protected hero/reference/assets files and all listed frozen source/build documents were not changed.

## Browser review still to do

- Compare actual desktop and phone renderings side by side with the approved detailed chart and original find drawings at reading scale. Ground hashes prove source preservation, not visual composition. Check hierarchy, fine strokes, rune density, back-to-back raven legibility, the serpent at all three spots, popup/card size and the retained Part B appearance.
- At 1440 by 900 and 390 by 664, press a find at overview, while moving between beats and under an open card. Check focus scale, straight centre travel, card folding, dusk thinning, persistent P, swapping find views, Back/Next/wheel/swipe/arrows/Page keys/Home/End, timeline/mini-map, Escape and both modes. Try rejected presses before/after the playable map and during a jump.
- Drive every id and chest through __jm.finds.state/place/found; verify copied arrays do not mutate the live state. Call hear in each Part A stage. Part B hear answers are intentionally absent until its run.
- Mouse, pen and touch: hold-dig all chests, release/cancel mid-hold, open/reopen cards; drag the spring needle and beacon while the camera moves; rub slowly/quickly, touch over auto-rubbing, and use the auto button. Confirm no drag steps the journey, focus restoration works, sheets own their navigation keys/wheel and no hit target is too small.
- Check wayfinder line retraction/order/arrival pings, all-four unlock and steady spin; each hoard's rattle/lid/glow/burst and piece colours; bird banking/flap/flare/squash, real thought order and reel iris; serpent loop order, wake, third-leaf eating and sleeping state; four persistent notes, Paper flame, beam softness and lightAt response; rubbing hatch/mask coverage, nineteen letter centres, flip/stamp/shake, tilt and closing.
- Test very narrow/short views and large text: popup clamping, tail anchoring, image cards, sheet fit and controls. Measure clipping, animation overshoot, SVG non-scaling stroke/dash behavior and browser animation support.
- With reduced motion, check the stacked page, immediate landings, static five-second memory, no camera motion/loops/bits/flights, working controls and all kept results. Compare both packed files, including joined hero handoff and return.
- Verify no console errors or requests with network blocked; measure real frame time and off-screen idling. No rendered/independent critique or browser performance claim is made in this build.

## Slots and missing pieces for Dan

Author slots implemented in Part A:

- FIND_COPY.reelToCome: the actual memory reel/content ("Reel to come").
- FIND_COPY.serpentLines[0], [1], [2]: three deadline stories.
- FIND_COPY.beaconNotes[0..3].t: four invisible-ink notes.
- FIND_COPY.poster.foot: stock and the brief, combined at the poster foot.

Other existing missing deliverables retained: Laurier's piece/title, SafetyDrivesUs imagery, Melanoma Canada imagery and the 1 King Street W imagery/case studies. The annual-report image remains the real existing asset. Part B's existing tafl fact, horn quote and crossing line remain unchanged for that run; the well's new answers will come from STOPS then.

# FINDS build: Part B

23 November 2026. Implemented sections 10 to 15 and their portions of 16 to 19. All required Node checks pass. No browser, server, network, installation, git command, reviewer agent or sub-agent was used.

## Evidence and acceptance criteria

Read FINDS completely before editing, then FINDS-BUILD and the existing kit, Part A modules, art/data/controller/camera/frame code and DEPTH-BUILD. The original detailed chart and the recorded reference constraints remain authoritative: fine Paper lines, the existing map hierarchy and density, unchanged ground, existing standing stones/cards and the six working Part A toys. The supplied browser-review findings are constraints, especially popup clearances, separate sheet rows and pointer-free decorations. Used the installed motion-playbook for continuity of moving objects, staging and reduced-motion feedback. The UI skill router's CLI was not run because this task prohibits installs/network and permits Node only on project files. RTK was attempted but is not installed in this shell; ordinary local commands were used afterwards.

Acceptance criteria: retain all six Part A handlers and their tuning rows; preserve protected source/table digests; keep P and the outer ship transform under their existing owners; use one live board with individually persistent pieces; make every new play work by keyboard and in reduced motion; keep the well's popup below its water and crown; give each board-sheet item its own room; keep all new overlay drawings out of pointer handling; expose copied game/coverage/horn/Norn/pennant state through the existing review handle; land the final count before the one-time frame accent.

The earlier Part A record describes its original build. Its getter aliases and depth/context workarounds were replaced in the intervening browser review. Part B uses that reviewed plain implementation and does not restore those workarounds. This append is the project record expressly authorized inside the allowed file set; nothing was written to an external notes folder.

## What was built

- `tafl.mjs`: pure Brandubh start, legal rook movement, throne/corner restrictions, simultaneous custodial captures, ordinary king capture, corner escape, no-move loss and the 80-move draw. The attacker tries every legal move with the supplied score terms and seeded tie breaking. Inputs are not mutated.
- `findboard.mjs`: the true thirteen-piece start on the map, awake king pulse, a grown dialog, selected-piece ring, legal-square dots, sliding moves, captured rows, delayed attacker reply, restart, cursor keys, spoken square labels and live move/status announcements. The actual board group and its thirteen pieces move into the sheet and return to the map on close; no board or animated piece is substituted. The game persists across closes. Hear hops the map pieces in order.
- The board sheet is 312 by 574 px, with a 280 px board and 40 px cells. The rows are 324 px for board plus two 22 px capture trays, 54 for status, 34 for rules, 70 for the end slot and 36 for buttons. Four 6 px gaps, two 15 px pads and two 1 px borders complete the height. At 390 by 664 it has 39 px horizontal and 45 px vertical clearance when centred, with no fit scaling. The slot's reserved row remains separate before the game ends. These are source arithmetic checks, not measured browser typography.
- `findwater.mjs`, mist: six soft ellipses at 0.62, three supplied cairns, mouse/pen/finger mask wipes, direction-following puffs, traveller wipes that do not find it, 8 by 4 coverage and a three-quarter lift with eastward puffs and staggered top-stone glints. Three keyboard presses clear the thirds. Hear shifts the fog east and back. The lift and cairns remain.
- `findhorn.mjs`: raise plus existing greeting and author slot; second press or a 0.45 s hold sounds it; the existing camera accepts the wide view and returns to the horn when the four rings end. Rings and missed-find glints have no pointer handling. Every existing kit hear callback is dispatched after distance/speed delay. Pending far replies finish without taking the camera back after the visitor releases it. Horn state records sounded count, heard ids, hold, stage and view request.
- `findwater.mjs`, well: idle root drops, arcing pebble, splash and outward ripples; sequential Norns, using current visited flags and live STOPS short names/dates; three watering streams and fifteen persistent crown stars. The well no longer undoes another find. Its popup uses the new explicit below-anchor option, with its tail above it. Hear gives one ring. Watering, current Norn, trip stop, answer and star-batch clocks are visible through state.
- `findwater.mjs`, longship: only `ls-rock` and its children move. The trip-owned `.ls-ship` transform remains untouched. Rocking, sail breathing, stop shields that follow visited flags in both directions, an oar pull/surge/water bits, a clear mast popup, three pulls in four seconds unlocking the pennant, and a beaconLit-driven lamp are implemented. Hear fills the sail and doubles the rocking. Pennant/lamp state remains for the visit.
- `findall.mjs`: starts only when the eleventh count flight lands, or immediately for reduced motion. Count text uses countAll through tlSetCount. A single Paper dash travels the frame, the existing corner-knot groups turn as it passes, the six numbered markers pulse, and the dashed frame settles to 0.5. There is no extra popup or nova change.
- Shared extensions: `findkit.mjs` accepts an explicit popup side, publishes the new board CSS variables from data and starts completion at count landing. `finds.mjs` wires the five new builders into the existing lifecycle/review handle and keeps the bit pool last. `timeline.mjs` chooses the all-found count copy. `art.mjs` changes Part B drawings and adds only a class to knot. All Part B CSS is appended at the end of map.css under its Part B comment. New tuning rows are the last rows of FIND_PLAY; existing rows were left intact. `findlegacy.mjs` is now one comment saying it can be removed; nothing imports it.

## Precedence decisions and departures

1. The specific prompt overrides section 13's above-well popup: the well always requests below, at its data anchor. The tree, stars, water and ripples therefore stay above its popup. Horn and ship also use data anchors beyond everything they draw.
2. Section 2 allows only an id/class addition to knot, despite section 15 asking for an inner group. Added its class and turn its existing group by composing rotation after the original translation. No inner group or knot geometry edit was needed.
3. Section 12's exact ring formula makes each ring disappear after 1.8 s at a radius of 274 map units; the fourth disappears at 2.34 s. Several finds are farther away. Kept these specified numbers and the specified camera return time, while delivering all remaining hear callbacks at distance/150 afterwards. Thus the farthest responses happen after the visible rings have ended and the camera has started returning. The horn remains busy with those echoes until their glints finish. The browser review can tune the Part B horn row if a longer visible whole-map answer is wanted.
4. Section 2 forbids new SVG filters, so the rewritten mist uses a radial soft gradient on its six ellipses, rather than retaining the old blur filter. No new filter, texture or drawing gradient was added elsewhere.
5. Section 2's frame rule takes precedence over per-frame dash writes. The comet dash and final frame stroke opacity are configured once with the browser animation API at count landing. The frame loop updates transforms and opacities. State-boundary board labels, mask additions and overlay contents use the existing kit's event/microtask pattern; there are no frame layout reads. The map board is temporarily inside its sheet rather than leaving a duplicate on the map during play.
6. In reduced motion, slides/replies, pebble landings, clearing, horn answers, stars, pennant and final count/frame state land immediately. There are no new loops, bits, flights, camera moves or completion rotations. As in the shared kit, a sheet closes immediately; no extra board-close animation was introduced.

No Part A find module, existing FIND_PLAY line or Part A FINDS row was intentionally changed. Main, steps, cards, trip and depth needed no edits. STARS, DEPTH and NOVA values and all protected digests were left unchanged. No aliases, Proxy wrappers or reassigned functions were introduced. Frozen source, reference and asset files were not changed. Neither pack tool needed an edit.

## Section 18 checks

All final commands exited 0.

1. `node --check` on every .mjs recursively: `ok: node --check on all 46 .mjs files under design/journey-map/`.
2. `node tools/check.mjs`: `ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 23 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 10 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, three bounded serpent spots/leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields and board dimensions valid`.
3. `node tools/finds-test.mjs`:

   ```text
   ok: original sea/fill/coast lengths and hashes unchanged
   ok: STARS, DEPTH and NOVA values unchanged
   ok: trip.mjs and depth.mjs unchanged since the review
   ok 1440x900: 36 views/cameras, k=0 deep-equal, k=1 centred/clamped/cards folded, monotone scale, P/traveller unchanged
   ok 390x664: 36 views/cameras, k=0 deep-equal, k=1 centred/clamped/cards folded, monotone scale, P/traveller unchanged
   ok: eleven accessible find groups, six marker ids and unnumbered legend id
   ok: all-four mask derived from STOPS is Lennard alone; nineteen rune middles/letters; all piece icons available
   ok: recording DOM runs six Part A plays, kept state, all-four unlock, reel, chase, four notes, rubbing, copied review state and Back/Scroll focus rules; no NaN attributes or frame layout reads
   ok: same board/pieces lift, slide, reply, persist, restart and end; keyboard cursor and end slot; 312x574 sheet fits 390x664 with separate 324/54/34/70/36 px rows
   ok: captured king and defenders occupy distinct positions in their shared upper tray
   ok: traveller wipes without finding; three mist thirds; all eleven hear timed horn; hold sounds, wide view and release; three Norns/stars/below tail; ship pennant/lamp; all-eleven landing/count/frame; overlays do not take pointers
   ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged
   ok: reduced-motion Part B game/reply, mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change
   ```

   The existing protected digests were not edited. Ground baselines remain sea 73566/1305240864, fill 12855/3665486802 and coast 4401/2408021381. The table digest is 3766120675; trip/depth digests are 2847150186 and 2672825336. The recording DOM is a state/attribute harness, not a browser or renderer.
4. `node tools/tafl-test.mjs`:

   ```text
   ok: start has eight attackers, four defenders and one king
   ok: clear rook moves, restricted squares, exact capture, king capture/escape and moving between enemies
   ok: reply legally stops an immediate corner escape when it can
   ok: non-capturing escape block, move-limit draw and no-move loss
   ok: 200 seeded random king-side games finish within 24 moves; 943 legal attacker replies; every generated move checked
   ```

5. `node tools/depth-test.mjs`: all nine output lines pass. Desktop 1440x900 and phone 390x844 high-cloud/deck passage and ten retained low clouds, all six leg midpoints, camera boundaries, fixed ground, depth-off scale, preserved recorded star positions, sky freezing, continuing nova, still drawing and restartable flare timing pass.
6. `node tools/steps-test.mjs`: paceT rises, paceP agrees within 1e-6, all 18 moves start/end without reversing, and all nine forward durations are within 1.5 to 5 seconds. Printed forward/back seconds: top-map 4.100/2.460; map-Laurier 3.180/1.908; Laurier-HMC1 3.637/2.182; HMC1-Mohawk 3.858/2.315; Mohawk-HMC2 4.033/2.420; HMC2-Interkom 3.253/1.952; Interkom-Lennard 3.630/2.178; Lennard-X 2.020/1.212; X-end 4.200/2.520.
7. `node tools/pack.mjs`: 21 runtime modules packed; `dist/journey-map.html 467.2 KB`.
8. `node tools/pack-joined.mjs`: `joined.html written`; 22 map/join modules packed; `dist/journey-joined.html 1006.6 KB`. Both existing packers' offline/reference checks pass; no packer changes.

## Browser checks still required

- Compare the real new drawings and kept states beside the approved detailed chart/reference at reading scale. Preserve the map's hierarchy, density and strokes, and confirm all six Part A toys still match the current browser-tuned version. No new rendered comparison or independent critique pass is claimed; the requested external browser review owns that gate.
- At 1440x900 and 390x664, verify actual board-sheet typography and clearances in all turns, captures, win/loss/draw and ordinary-text slot states. Check the tray pieces, selected ring, dots, cell cursor, New game and Close, closing mid-slide/reply and reopening. Source arithmetic passes but real font metrics, zoom/large-text wrapping and perceived motion remain unverified.
- Play a deliberate two-corner winning strategy, judge the reply's difficulty and confirm captures/announcements with a real screen reader. Random games and blocking fixtures prove rules/termination, not a balanced human game.
- Test mouse, pen and finger fog wipes, pointer capture/cancel, the traveller's cut, keyboard thirds, lift/glints and the always-present wipe target. Verify no wipe or hold steps the trip.
- Test horn raise, fast second press, hold, release/cancel, repeated sounds, partial camera transitions and Back/Next/mode/timeline departure during echoes. Assess the specified short rings against the delayed far replies described above. Confirm every missed-find glint stays out of pointer handling.
- Cycle the well before the first stop, between stops, after the last and while reversing. Check actual bottom-popup clearance/tail, pebble/drop paths, ripple direction and all fifteen stars in the tree. The well must leave every other kept find untouched.
- Test ship pulls while the camera/trip moves, three pulls just inside/outside four seconds, pennant motion, sail/rock hear response, all shield states backward/forward, and the lamp before/after lighting the beacon. Confirm mast popup clearance at all scales.
- Find all eleven in different orders: count landing, one comet, corner timing, marker pulse and final frame opacity. Check restart/reopen does not celebrate twice and does not change the nova.
- Check both offline packs, Steps/Scroll and the reduced-motion stacked page; very short/narrow views, real touch, screen-reader focus return, console/network output, hardware frame time and off-screen idling. No browser, pixel-rendering, offline browser-network or performance claim is made.

## Slots Dan must fill

New Part B author slots, all with placeholder text and todo: 1:

- FIND_COPY.tafl: the fact or line from the game-design year, shown only after a game ends.
- FIND_COPY.horn[1]: the line from someone Dan worked with, below the existing greeting.
- FIND_COPY.longship: the personal line for the 2023 crossing, below the log kicker and ship play.

The well invents no author story: names/dates are read directly from STOPS and the fallback draft copy is in FIND_COPY. Part A's author slots and missing pieces listed above remain for Dan. Removing todo from a slot makes its text ordinary copy.

# Browser review of Part B

23 November 2026, after the merge. Played in Chromium at 1440x900 and on a 390 px phone with taps and a finger, in Steps and Scroll mode and with reduced motion. No page errors in any run.

What changed:

- **Board game rules.** Checked against an independent reading of section 10.1 over about 25,000 moves: every move list, capture and result agreed. But with the king taken like any other piece, a casual king's side lost nearly every game within five moves. The king is now taken only when shut in on all four sides (`rules.kingSides: 4`), each side by an attacker, a corner or the empty centre, and never against the edge (`rules.kingEdge: false`). Simulated: a thoughtful player wins 90% in a median of 8 moves, a casual one 45%, random moves 22%. The rule line says so.
- **Board sheet.** The rules and the end slot share one row (the rules while a game is on, the slot when it is over), so the sheet is 534 px tall. The keyboard cursor square shows only while a cell has keyboard focus. A king whose side cannot move gets its own line (`FIND_COPY.taflStuck`). The king who reaches a corner swells twice.
- **Mist.** Wipes punched hard-edged black holes and the puffs read as a row of grey coins. Wipes now fade at the edge (a radial mask gradient, `mist.soft`), and every third wipe throws one soft wisp fanned either side of the stroke.
- **Horn.** The rings died at 274 units, so the far finds answered after the rings had gone and the camera had gone back. The rings now cross the whole map while they can still be seen (`speed: 300, life: 2.2, power: 0.7`), drawn a little stronger, and each find answers as a ring passes it inside the wide view. The greeting popup closes when it sounds, leaving the wide view clear. Glints on missed finds are larger (`glint[0]: 11`). The ring radius no longer goes to infinity before the first sound (a console error).
- **Well.** Its answer sat behind the step buttons. Any popup now stays above the step buttons and the timeline (their tops are read when the popup opens, not per frame), and the well's view sits a little lower so its answer clears them with the crown still in view.
- **The finish.** The comet ran round the frame while the camera was zoomed in on the eleventh find, so it was never seen. When a find has the camera, the finish now asks for the whole chart, starts the comet once the camera is there (`all.wait`), and hands the camera back to the find after.
- **Longship.** Played as specified (pull, popup clear of the mast, pennant on three pulls, shields following the trip, lamp once the beacon is lit); nothing changed.
- **A hint line (added in the review).** While a find has the camera, one short line of what to do sits above the step buttons (above the timeline on a phone), from `FIND_COPY.hints` (draft copy). Its words change only when a find takes the camera, and popups stay above it. Without it most of the new depth (three digs, a second press on the horn, three pokes, aiming the beam) was easy to miss.
