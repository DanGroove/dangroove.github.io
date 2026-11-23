# Round 7, part A

Source implementation is complete. The required six-test gate is incomplete.
Five commands pass. tools/finds-test.mjs fails on its legacy Scroll-mode API
call. Packing is withheld because the brief requires all six checks to pass
before packing. Existing joined.html and dist files have not been refreshed.

## Constraints and acceptance criteria

Read EXPLORE.md in full, the named map modules and styles, the earlier BRIEF,
STEPS, DEPTH, FINDS and JOIN briefs, and the specified copied hero name code,
name CSS, entrance renderer and easing curves. The copied hero supplied behavior
and numbers only; no hero module is imported by the new map modules.

The implementation criteria carried forward were:

- Keep ACTS, tripState(P), beats, pace, original map geometry, palettes, card
  content and find modules intact. Keep the reduced-motion stacked page.
- Outside reduced motion, only buttons, keys and timeline controls advance P.
  Wheel and swipe do not step. Only the end CTA starts exploring.
- Explore and card closing override frame state without changing P or the
  traveller. Restore the existing map objects, keep the traveller merged into
  the X and keep the mini-map hidden at the end.
- Preserve the footer composition. Put its name and timeline rule in one world
  layer for exploring. Copy the hero's name wipe, weight, lens and spring wave.
- Stack independent flares with eight pooled rings and additive capped shares.
  Gather existing map stars and half the sky from distributed arrival angles.
- Keep every new timing, copy line and adjustable number in data.mjs. Read
  geometry only during events, resize, fonts readiness or state transitions.

No browser rendering, screenshot comparison, visual quality gate or frame-rate
measurement was performed. The original/reference and revised page have not
been compared side by side. These remain browser-review work.

## Files changed

- data.mjs: removed wheel/swipe stepping values and the two mode-button labels.
  Added EXPLORE, CARD_CLOSE, FOOT_NAME and required copy. Added the flare caps
  and gather table. Copied the hero's NAME values, entrance name spans and
  wipe/enter control points. Added local input, measurement and control geometry
  values needed by the implementation. Other existing tuning stays unchanged.
- steps.mjs: removed address/session mode selection, the mode setter, mode
  switching and swipe/wheel stepping. Retained scroll progress only for reduced
  motion and wheel prevention/card-face scrolling for Steps. Review has its
  label and Depth button. The end Next control becomes the explore CTA, with a
  reveal on arrival; Next keys/API calls at the end do not start exploring.
  Back first exits explore, then steps to the X on a second press.
- explore.mjs: new end-only state owner and pure geometry helpers. Implements
  entry/exit with the trip ease, pointer-anchored eased wheel zoom, Ctrl+wheel,
  captured drag with slop, two-finger zoom/pan, release velocity and friction,
  bounds, zoom keys, Escape/0, resize preservation, cursor states and a one-time
  hint. Publishes exploreK and the end scale on the frame state. The actual
  entry/exit camera is the blend from its saved start view to its target.
  Input takes over from the currently painted view. Cut navigation stops input
  immediately and holds the last view until the cover hides the P change.
- main.mjs: constructs ft-world around the existing footer and timeline, wires
  explore after tripState/tripFocus and before renderers, applies card overrides,
  counts override movement, and measures footer/timeline with a neutral world
  transform on resize. Exploring stop marks use the existing cut navigation.
  Adds a document capture listener cancelling dragstart and card Escape handling
  after the existing overlay handler.
- trip.mjs: lifts blast fades by exploreK and fully draws the completed trail
  while exploring. No tripState, ACTS, traveller or camera-path changes.
- depth.mjs: lifts the depth/sky blast fades by exploreK. Replaces the single
  flare timestamp with an independently expiring list, press/prune helpers and
  capped additive pulse/kick shares. Expiry compares each flare's end timestamp
  to avoid floating-point subtraction delaying its removal at the boundary.
- stars.mjs: seeded shuffled arrival angles, a smooth cubic-to-spiral gather
  path with a continuous tangent at its ring, participating sky-star return,
  reversed map-star return staggered by ord2, and pooled-flare ember bursts.
  Orbit and ember distances use the end-view scale during explore. The same
  stars retain their map places; the sky keeps its sky places.
- footer.mjs: creates eight flare circles once, paints each flare independently,
  and uses additive capped core shares. Auto flares use the same capped list.
  Uses the end scale for the supernova while exploring. The name delegates to
  footname; the other footer lines retain their existing fade/rise windows.
- footname.mjs: new local copy of the hero's name model and curves. Flow text
  owns layout and accessibility; generated letters paint the live name and red
  lens. Measures only on resize/fonts/state change/press. Mouse coordinates
  pass through the inverse world transform and account for footer parallax.
  Springs and the wipe use the existing shared frame loop. Reduced motion does
  not build or run the name effect.
- cards.mjs: adds a labelled 44 px X after each card's other controls. It sits
  outside the scrollable face so scrolling cannot carry it away. Closing and
  reopening use a timed fold-strength override. The closed fold is retained
  while leaving that hold, avoiding a flash-open card, then forgotten. A later
  visit opens normally. Reduced-motion list cards have no X.
- finds.mjs: lets find presses play locally while exploring instead of invoking
  the focus capture handler. Leaving explore closes overlays through the
  existing kit. No find module was edited.
- join.mjs: retains the reduced-motion scroll listener and the hero's synthetic
  measurement events, removes the old mode-switch cue restoration, and keeps
  the start button outside reduced motion.
- map.css: global selection/callout/drag restrictions; the world-layer and
  generated name-letter paint rules; explore cursor/touch/hint/Back states;
  end CTA phone sizing; the card X, header clearance and constrained logo width.
- tools/check.mjs: validates new tables, copy, copied curves and required caps,
  and rejects the removed wheel/swipe tables.
- tools/steps-test.mjs: keeps the pace checks and adds recording-node controller
  and card checks: wheel never advances a beat, no swipe handlers, only the end
  CTA enters explore, Back exits first, keys still work, card folding leaves P
  fixed, reopening is local, departure forgets closure, and RM has no X.
- tools/depth-test.mjs: tests independent stacked flare lifetimes and cap
  rejection, additive limits, final pruning, gather endpoints and ring tangent
  continuity at 32 angles, and explore restoration of the sea fade. Keeps the
  existing depth and recording-canvas checks.
- tools/explore-test.mjs: new Node geometry/state checks for desktop and phone
  zoom bounds, centred cameras, anchored zoom, damped bounded glides, layer
  transform/inverse, end gating, entry takeover, pointer pan/release, resize,
  exit/departure, P/traveller invariance and the copied name curves/spring.
- tools/finds-test.mjs: changed only its three permitted recorded digest numbers.
- EXPLORE-BUILD.md: this ASCII project and handoff record.

timeline.mjs, join.css, index.html, art.mjs, pace.mjs, hero-copy, reference,
assets, later-part find modules and all other Markdown files were unchanged.
Neither pack tool was changed. No file outside design/journey-map was changed.
No git, installs, network access, server, reviewer or sub-agent was used.

## Recorded digests

- JSON.stringify([STARS, DEPTH, NOVA]): 1195292270
- trip.mjs, with CRLF normalized to LF: 15594086
- depth.mjs, with CRLF normalized to LF: 2235235323

## Validation and the hard-rule conflict

Commands were run from design/journey-map:

- node tools/check.mjs: PASS.
- node tools/steps-test.mjs: PASS, including all 18 neighbouring moves.
- node tools/depth-test.mjs: PASS.
- node tools/finds-test.mjs: FAIL at line 187, TypeError:
  JOURNEY.setMode is not a function.
- node tools/tafl-test.mjs: PASS, including 200 seeded games and 3144 checked
  legal attacker replies.
- node tools/explore-test.mjs: PASS.

The finds test passes its original sea/fill/coast hashes, all three updated
digests, desktop/phone focus geometry and six Part A play assertions before
reaching the removed Scroll API. Its later assertions are not completed.

EXPLORE section 3 requires removal of the old Scroll mode. Section 2 permits
only three digest edits in tools/finds-test.mjs. That unchanged test calls
JOURNEY.setMode('scroll') and tests the old mode, starting at line 187. Its
remaining mode tests cannot pass against the required controller. Those lines
were left unchanged. No compatibility mode or test bypass was introduced.

node tools/pack.mjs and node tools/pack-joined.mjs were NOT RUN. The explicit
all-six-tests-passing prerequisite is blocked by the conflict above. Existing
joined.html, dist/journey-map.html and dist/journey-joined.html remain prior
outputs and do not contain these changes. This is an incomplete release gate,
not a claimed passing build.

All 17 changed/new JavaScript files passed node --check. The report was checked
for ASCII-only content. Node recording tests are not a visual browser check.

External installed skill files, RTK.md and external project-note paths were not
opened because the current task forbids touching any path outside this folder.
The no-reviewer rule also prevents the standing independent critique workflow.

## Browser review first

1. On both pages, use Back/Next through the full journey, wheel and swipe at
   every beat, keys, the timeline and stop marks. Confirm no accidental step,
   no zoom or drag at the end before the CTA, and correct CTA reveal/tab order.
2. Enter explore and interrupt entry with wheel, mouse drag and two fingers.
   Check zoom anchoring, bounds, inertia, phone touch capture and rotation or
   resize. Back/Escape/0 should return to the end; another Back reaches the X.
   A stop mark or timeline jump should hide the reset under its cut.
3. Check the restored sea, land, finds, complete trail and stop marks; keep
   cards closed, traveller merged and mini-map hidden. Play finds and sheets
   at their map positions. Check overlay Escape priority.
4. Compare footer layout and name fit to the prior page at useful reading
   scale. Check the baseline wipe and 300-to-800 weight in both directions,
   mouse lens/lift/repeated spring knocks, phone inactivity, and pointer
   alignment when the footer is small, panned or zoomed.
5. Watch the all-around gather and map-star return, then spam the settled X.
   Check that earlier rings and ember bursts survive later presses, the cap
   is invisible, and the settled supernova scales with the world signature.
6. Check the X on every palette and at phone widths, including a scrolled card.
   Check keyboard order, fold/reopen, Next from a closed card, and a new visit.
7. Triple-click and drag across hero, cards, popups, sheets and footer. Drag
   images, SVG and links. Confirm no text selection or native drag image while
   controls, focus and screen-reader labels remain usable.
8. Verify reduced-motion stacked pages on desktop and phone: ordinary scrolling,
   existing find plays, no explore controls, no card X or name reaction.

Visual comparison, actual device gestures, accessible focus behavior in a real
browser and performance remain unverified. Use source modules for review until
the test conflict is resolved and the mandated pack tools can run after a clean
gate.
