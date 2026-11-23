# Round 7, part C1: world build

23 November 2026.

C1 source implementation is built. All six required Node tests pass. The joined
page has been packed. The standalone map pack is omitted because its packer
reads a font outside the permitted directory. The existing standalone packed
map is stale and does not contain C1. This is an incomplete two-pack delivery.

No browser check was made.

## Evidence and acceptance criteria

Read WORLD.md in full, drawings.cjs, the eight supplied reference PNGs, every required runtime module and every
file in tools/. Read the existing build records for the map, finds, explore
and hammer and their recorded review constraints. The reference PNGs were
viewed; the revised page was not rendered.

Acceptance criteria carried into implementation:

- Preserve the detailed chart, coasts, trail, existing line styles, career
  content and working parts A and B.
- Port the reference geometry locally. Runtime modules never import or read
  the reference file. Drawing paths, geometry and adjustable values are data.
- Preserve the reference tree's draw order and the skyline's west-to-east
  order. Keep the ring in the sea beneath land, trail, ship and finds.
- Animate the existing actors and actual calendar leaves. Preserve count,
  keyboard, queued-press, sleep/wake and reduced-motion behavior.
- Separate floored primary labels from faded secondary labels. Keep analytic
  primary label boxes and their halos inside the frame and apart.
- Give cards their shared header/headline/body/footer arrangement, their own
  measured height and the requested contrast treatment.
- Keep camera overrides separate from trip depth, retain P during explore,
  hide controls through the blast and restore their focus.
- Preserve STARS, DEPTH and NOVA, the ravens and chest behavior, and every
  unlisted module. Do not use a browser, network, server, git or agents.

This expressly allowed report is the project record. No external project note
or other Markdown file was written.

## Section 3: Yggdrasil and the well

- Moved the trunk foot to 304/374. Ported five tapered roots, rootlets, the
  three-bough trunk, seed-7 scalloped crown, four overlap chains from seeds
  20-23, the reference's seed-33 leaf-mark pass, eagle, Ratatoskr and Nidhogg.
  Ported scallop and tube alongside spline. Paths and seeds are in YGG.
- Preserved roots/rootlets/trunk/crown/overlaps/leaves/actors draw order after
  the grove. Added yg-eagle/yg-wings, yg-rat/yg-tail and yg-nid/yg-nid-head.
- Replaced the old circular tree exclusion with shared crown, trunk and root
  geometry. Grove exclusion includes a conservative 13-unit tree reach as
  well as the required six-unit clearance. Kept the well exclusion.
- Put Yggdrasil at 318/361, start anchored in tier 2. Checked its analytic box
  against the crown, roots, trunk/rat region and relocated chest scratch.
- Moved the well root and trunk stream, distributed all fifteen stars over
  the new crown with the specified inset and spacing, and set the well view
  to 306/350/72. Moved hoard-hmc2 and its grove exclusion to 372/368.
- Added the rat climb/pause/two tail flicks/return, eagle stretches and
  Nidhogg gnaws. Their idle intervals use a separate seeded tree stream so
  they do not consume the ravens' shared idle random sequence.
- Hear flies the existing eagle through takeoff, one radius-16 circle around
  its elevated centre and landing over 2.6 seconds. The well remains playing
  through flight. Reduced motion keeps these actors still.

## Section 4: Jormungandr

- Ported the ring centreline, five surfaced intervals, taper, submerged band,
  dashed edges, chevrons and breaking water. Shared sampled geometry drives
  drawing, clearances and moving swells.
- Placed it after waves and shore dots inside the existing sea clip. The
  static body ends nine units before the tip. The actual last nine units
  form the movable tail beneath the head at the fixed 500/101 joint.
- Replaced the old serpent drawing and swimming/spots table. Ported the
  profile into separate skull, hinged jaw, eye/lid, tongue, tail and calendar
  pad groups. The three real leaves are stacked with exposed offsets,
  binding strips, ring dots and their existing day/time copy.
- Implemented release, overshooting lunge, bite/tear bits, return with the
  actual leaf attached to the head turn, flutter, swallow and travelling
  body swell. A single pending press is retained during the feeding step.
  Additional presses after leaf three cannot request a nonexistent leaf.
- Between leaves the jaw and tail remain hungry. After the third, the board
  sinks, the final swell reaches the tail, the jaw releases it, the tail
  returns to the mouth and the jaw closes. The existing payoff and round
  slot open above/left, then the eye shuts and the head breathes.
- Poking asleep raises the same pad and restores its leaves for a new round.
  Hear lifts the head and sends a slower, shallower swell. Tongue flicks
  require a fresh nearby pointer. Reduced motion consumes leaves immediately
  without swell, bob, tongue or breathing.
- Retained id serpent and its existing story copy. place() returns the joint;
  the on-screen radius uses view radius plus near. Steps and swells keep the
  find playing. Four transparent pooled swell groups live under the land.

## Section 5: shields

Replaced stoneSvg with shieldSvg, using the reference's quartered B geometry:
shadow, six face planks, visited paint and dark planks inside its quarters,
Paper rim, boss, highlight, eight studs and the existing glow. No rune is
drawn; stop rune data remains.

Cards use MARK's 10/min-14/max-36 screen sizing and stand three pixels above
the waypoint. The mark button is round. The legend now has a small quartered
grey shield. The article remains the element that grows into its card.

## Section 6: Toronto

Ported the lake-facing skyline at 368/752, including the CN Tower's shaft,
pods and mast; Rogers Centre; the eight financial district towers; back row;
three lower eastern towers; facade details; baseline and water strokes.
Facts, positions, widths and drawing paths are in MAP.toronto. Removed the
unused win pattern, retained the landing post exactly, and replaced the
grove exclusion with the requested skyline box.

Two small reference geometry corrections satisfy the explicit height gate:
the Rogers dome's quadratic control rises from 11.4 to 13.4 so its actual
curve reaches 9 units, and Royal Bank Plaza's sawtooth roof peaks at 18.9
rather than 19.5. The dome and sawtooth forms remain. Heights agree with
metres times 0.105 within 0.15 units. Every sampled skyline stroke remains
inside COAST_B.

## Section 7: label tiers and permitted adjustments

Primary labels have translated anchors and separate scale groups. tripBuild
collects them; tripApply changes scale only beyond the half-percent threshold.
The kicker's plate/rule scale with its text. One secondary group controls
regions/runes, asides, sea/deadline labels, tree and well copy. On phones,
stop sub-lines move into that group without a floor. The fade uses 1.3-1.5
times the overview scale.

Permitted label changes, all in map units:

- All six stop names and the X headline move up 4.
- The six stop sub-lines move down 4.
- HMC summers' sub-line also moves left 4.4. Its total displacement is
  approximately 5.95, within the six-unit limit.
- The X sub-line moves down 3.5.
- Desktop sub-line floor is lowered from 8 to 7.6 pixels. Caps and desktop
  name floors remain as specified. No other floor is lowered.

Analytic checks include a conservative glyph-width estimate and the text
halo, at 1440x900 with a 120-pixel timeline/control reservation and 390x844
with 96 pixels. They pass frame and inter-label checks; desktop stop names
are at least 10 pixels. These are not measured browser font boxes.

## Section 8: cards

Moved every headline below the header and above both body columns. The body
holds text and the piece/caption; the full-width foot has crafts on the left
(maximum 340 pixels) and the button on the right. The phone foot stacks.
Pieces centre in their column.

cardsResize measures each card's content on resize and fonts readiness,
caps each at the existing available height and stores that card's own height
for the morph. The face retains internal scrolling. Removed forced body
stretch and the crafts' auto top margin.

Lennard keeps the white logo band, orange field and large white headline.
All remaining body/foot copy is in the white 10-pixel-radius, 16-pixel-padded
panel with Warm Gray 11 text, rules, pills and button. Interkom's button is
dark with cream text and a coral arrow. Small-text and headline contrast
checks pass. Actual wrapping, visual balance and the 80-pixel empty-space
criterion still require the external browser review.

## Sections 9 and 10: layout and explore

- Added the data-sized 150/190-pixel Ink control scrim above map/depth and
  below overlays. Its opacity follows the primary/secondary zoom threshold.
- Desktop X uses anchor 0.42, with a bounded short-window scale adjustment.
  Phone X fits the specified box with 16-pixel margins above the step bar.
  The last half of legX eases into this view and rush starts from it.
- Moved the compass east ten units and its side words to +/-46. Analytic
  SCREEN/frame and VIDEO/coast-halo clearance checks pass.
- Popup ground and tail stay opaque; only pop-body fades during its scale
  entrance. Added transparent tap highlighting.
- The stepper hides when rush starts moving, throughout blast/settle, and
  returns with its reveal and remembered main-button focus. The resting X
  boundary retains Dig so the journey can start its rush.
- Footer content fades with 1 - exploreK and becomes inert during explore.
  Its existing composition and animated name are retained.
- Glow, rays and lobes calm toward 0.35 opacity and 0.6 scale using EXPLORE
  values. Automatic flares reserve two pool places for visitor presses.
- Back to the top now has an Ink ground and border.
- Arrow keys pan 90 pixels, or 270 with Shift, through the existing eased,
  bounded explore target. They never change journey progress. Escape exits.
- tripState records tripS before focus/explore overrides. Deck alpha uses
  tripS while deck placement still follows the displayed camera.

## Digests and preservation

FNV-1a, with source CRLF normalized to LF:

- sea: length 100054, hash 3547300242. Re-recorded for the ring and its
  initially invisible pooled swells. Original wave/shore generation remains.
- fill: length 12855, hash 3665486802, unchanged.
- coast: length 4401, hash 2408021381, unchanged.
- trip.mjs: 180365617. Re-recorded for label groups, the control scrim, X
  camera and tripS.
- depth.mjs: 3982895838. Re-recorded solely for deck alpha's tripS source.
- JSON.stringify([STARS, DEPTH, NOVA]): 1195292270, unchanged.

No edits to hero-copy, reference, assets, index.html, other Markdown,
unlisted modules, raven behavior or chest behavior. The expressly requested
HMC-again chest position changed; its animation did not. No pack tool edit.

## Final test output lines

All commands below ran from design/journey-map and exited 0. The existing
pace, find, reduced-motion, protected-table and full hammer tests remain.

- node tools/check.mjs: PASS
  ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid

- node tools/steps-test.mjs: PASS
  ok: X frame/phone box clear controls; rush through settle hides stepper and restores main focus

- node tools/depth-test.mjs: PASS
  ok: gather endpoints and continuous ring tangent for 32 arrival angles; explore restores depth fade

- node tools/finds-test.mjs: PASS
  ok: reduced-motion hammer plays/pauses without map sparks/tremble/hop; mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change

- node tools/explore-test.mjs: PASS
  ok: actual footer writer sets opacity to 1 - exploreK and disables its controls while exploring

- node tools/hammer-test.mjs: PASS
  ok: 200-seed balance bounds, finite runs and <20-minute termination

Additional gates include the rapid-poke queue, real held-leaf transform,
sleep/wake/tail/eye/popup states, reduced-motion absence of swells, eagle
return/stillness, every skyline stroke, both arrow-pan axes, actual footer
opacity/inert writes, focused/explore deck sweeps in 0.05 steps, X clearances
and stepper focus restoration. The recording find DOM rejects frame layout
reads and nonfinite attributes. It is not a browser.

## Packaging and sizes

node tools/pack-joined.mjs: PASS.
Last output line: dist/journey-joined.html 1093.2 KB

- Current dist/journey-joined.html: 1119460 bytes, 1093.22 KB raw;
  472184 bytes, 461.12 KB gzip, below 540 KB.
- Current joined.html: 4157 bytes, 4.06 KB raw; 1592 bytes, 1.55 KB gzip.
- Current combined map modules and map.css: 124.29 KB gzip, below 150 KB.
- Hammer rules/find/data/copy/drawing: 14.89 KB gzip, below 30 KB.
- Existing, stale dist/journey-map.html: 533337 bytes, 520.84 KB raw;
  235198 bytes, 229.69 KB gzip. This is the previous build, not a C1 pack.

The joined packer's offline-reference checks pass. Its three script blocks
also parse as their actual script/module types in Node without execution.

node tools/pack.mjs: NOT RUN. Its FONT path resolves to
../../public/holding/fonts/outfit-latin-wght-normal.woff2, outside
design/journey-map. WORLD section 2 and the task's no-other-path rule stop
that read. Per the instruction to leave out blocked actions instead of
working around a rule, no alternate packer, font-path substitution, copied
font or filesystem wrapper was introduced. The standalone output is left
unchanged. It must not be used to review C1.

## Remaining external review and omissions

No browser check was made. No fresh rendering, side-by-side output comparison,
real font-box measurement, pixel critique, device-gesture session, screen
reader check or browser performance measurement is claimed. Review the
current joined pack, especially creature motion, real label metrics, card
wrapping/column space and overlay/control stacking.

The installed external skill/RTK files and external notes were not opened
under the no-other-path rule. No reviewer agents or sub-agents were started.
No git, installation, network request or server was used. No server remains.

The only release omission is the standalone pack described above. Browser
verification and the independent review remain with the external reviewer,
as the task directs.
