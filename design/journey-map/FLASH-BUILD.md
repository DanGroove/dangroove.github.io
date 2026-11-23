# Round 7 part D1 build

Implementation and both packs are complete. The all-tests-pass gate is NOT complete: six checks pass and tools/finds-test.mjs stops at its protected trip.mjs source digest. No visual or browser check was made.

## Evidence and acceptance criteria

Read FLASH.md in full first, followed by the section 5 source and test files. Used the existing footer renderer, art.mjs gradients/filter, seeded data, stars resize pattern, find capture handler, and the existing explore/depth build records as implementation evidence. Read the installed motion-playbook and UI routing skills. FLASH.md's exact animation and file-scope requirements take precedence over generic design advice.

Acceptance criteria carried into the implementation:

- Preserve the existing nova equations, constants, seeds, gradient stops, screen mapping and SVG paint order. Keep the static rough SVG X through the journey and reduced motion. Make only a boundary visibility write when the canvas takes over or gives it back.
- Put the nova canvas immediately after the map and below stars, air, sky and overlay content. Cap its DPR at 2. Draw continuously during the footer acts/explore; clear once on return before the rush.
- Preserve the map camera matrix and fall reveals. Apply blast/explore fading to the complete SVG, hide it only at opacity zero, and promote opacity only during the fade.
- Preserve the press label, availability, click action, size and tab order. Use a native HTML button outside the SVG, and mirror joined-page inert state.
- Fade footer copy in linear time over the first 500 ms of entry and last 500 ms of exit. Promote the footer world only during motion/gesture/glide.
- Track allowed pointers on stage capture. Preserve owned single-pointer gestures, let a second pointer start a pinch, and suppress only the pointer click after a drag. Keyboard/programmatic detail-zero clicks always pass.

These are source and recording-test criteria. Rendered equivalence, seamless handoff, focus appearance, Android WebView compositing and phone frame behavior remain unverified for the real-browser review elsewhere.

## What was built

- footer.mjs: moved animated glows, rays, lobes, waves, flare rings, seeded streaks, rings, shells, core and animated X strokes/spikes to canvas. Cached radial sprites use the original stops. A reusable scratch canvas preserves SVG group-opacity compositing. Red stroke sprites rasterise the actual rough filter extracted from mapDefs(), using the original path and user space; resize prepares sufficient raster density and larger visible strokes request a larger sprite. Until ready, a round red line is drawn. Failed decodes keep the fallback without retrying every frame.
- main.mjs: added canvas#nova directly after svg#map, added the native nova button after map finds and before cards/footer, connected the canvas and button, and sized the canvas during resize.
- trip.mjs: moved blast fade to the SVG element, left the individual groups/trail with their own reveals, added visibility and temporary will-change, and cached every tripApply style/attribute write.
- explore.mjs: added linear footer opacity state and change-only world styles; capture-phase pointer tracking with narrowly scoped exclusions; owned single-pointer gestures; deferred pointer capture; pinch takeover; detail-zero-safe click suppression with key, lifecycle, pointerdown and release-timeout clearing. Capture-loss events from child finds no longer discard stage-owned pointers.
- join.mjs and map.css: mirrored map inert state onto the nova button; added canvas positioning and native round-button/focus/disabled styles. The nova canvas has no z-index.
- data.mjs: added only new numeric rendering/timing settings: NOVA_CANVAS.dpr/glowSprite and EXPLORE.footerFade/clickRelease. Existing NOVA, STARS, DEPTH and all other existing numbers are unchanged. The existing non-ASCII source letters were preserved.
- tools/check.mjs: added static checks for removed SVG effect names and canvas placement.
- tools/explore-test.mjs: updated the old 1 - exploreK footer assertion to the new linear-time contract. Added target-specific pinch/tap/pan/owned-drag tests, capture timing, exclusions, suppression clearing and temporary world promotion.
- tools/nova-test.mjs: new recording canvas/element tests for markup, DPR/filter/sprites, repeated animation frames, screen mapping, no identical-frame SVG/button writes, clear-once behavior, map-layer fade, button availability, resize and reduced motion.

## What was left out and why

- Did not alter tools/finds-test.mjs. Its line 35 asserts the entire trip.mjs digest is 180365617; the required tripApply changes produce 1420657627 (FNV digest after CRLF-to-LF normalization). FLASH.md section 4 permits finds-test edits only where an existing check must follow the moved press target. Re-recording this unrelated whole-source lock is outside that scope. No collision, bypass, compatibility shim or alternate test run was used. The test stops there, so its later assertions did not run.
- No recorded digest was changed in tools/check.mjs; it has no source-digest lock for these files. The existing STARS/DEPTH/NOVA digest still passes unchanged (1195292270).
- Did not add explicit cancellation hooks to the find or footer-name hold/drag implementations: those modules are outside the allowed write list. Pinch takeover transfers pointer capture and blocks the second pointerdown and subsequent drag-ending click; any additional owner-specific timer/hold cancellation was left out.
- No browser, visual comparison, pixel rendering, independent reviewer, device recording or performance claim. The task prohibits those checks/agents here. The motion skill's rendered-review advice and UI skill's network-capable CLI workflow were omitted under the task restrictions.
- RTK was unavailable (the prefixed command returned command-not-found). No utility was installed. Local file reads and permitted Node commands were used.

## Scope and packing

Wrote only footer.mjs, main.mjs, trip.mjs, explore.mjs, join.mjs, map.css, data.mjs, tools/check.mjs, tools/explore-test.mjs, tools/nova-test.mjs, this report, and the authorised pack outputs joined.html, dist/journey-map.html and dist/journey-joined.html.

No git command, install, network access, server, reviewer or sub-agent was used. No hero-copy, reference, assets, index.html, art.mjs, other Markdown file, or unlisted module was changed. Both pack tools were run successfully against the final source:

- node tools/pack.mjs: dist/journey-map.html 577.8 KB
- node tools/pack-joined.mjs: dist/journey-joined.html 1117.2 KB (also wrote joined.html)

The packed pages are candidates for the external review; the failed finds digest gate is not represented as a passing release. Node syntax checks also passed for main.mjs and join.mjs.

## Final test results and exact last output lines

- node tools/check.mjs: PASS
  Last process output line: ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid

- node tools/steps-test.mjs: PASS
  Last process output line: ok: X frame/phone box clear controls; rush through settle hides stepper and restores main focus

- node tools/depth-test.mjs: PASS
  Last process output line: ok: gather endpoints and continuous ring tangent for 32 arrival angles; explore restores depth fade

- node tools/finds-test.mjs: FAIL (protected trip.mjs source digest)
  Last process output line: Node.js v26.7.0

- node tools/hammer-test.mjs: PASS
  Last process output line: ok: 200-seed balance bounds, finite runs and <20-minute termination

- node tools/explore-test.mjs: PASS
  Last process output line: ok: capture-phase pinch on nova/stop/horn; nova taps; owned single drags; drag-only pointer clicks; key/end/depart/reset/down/500 ms suppression clearing; temporary world promotion

- node tools/nova-test.mjs: PASS
  Last process output line: ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged

For the failed finds test, the final line is Node's version trailer. The actual failure immediately above it is AssertionError [ERR_ASSERTION]: trip.mjs changed, actual 1420657627, expected 180365617. The last successful assertion message was: ok: STARS, DEPTH and NOVA values unchanged.

