# Round 7, part B: Hold the bridge

23 November 2026. Implemented the hammer find and seven-wave shooter. All six
required Node checks pass. Both pages have been packed with the existing pack
tools. No browser rendering, screenshot comparison or browser performance
measurement was performed. The external browser review remains necessary.

## Evidence and acceptance criteria

Read HAMMER.md in full before editing, its named source modules and tables,
FINDS.md section 10, FINDS-BUILD.md including the browser review, EXPLORE.md
and EXPLORE-BUILD.md. Carried forward the detailed chart, fine Paper line art,
Ink panels, quiet Dim/Note hierarchy, the existing find-to-sheet growth, the
original board's location/view, the eleven-find completion and part A's
explore/camera/keyboard ownership. No reference career facts were reused.

Acceptance criteria used:

- Replace the board only; preserve the original ground and protected digests,
  every other find and all of round 7 part A.
- Use original myth-derived line drawings, Paper/Dim/Note and warm fire,
  with no Red in the game and only the twelve approved game runes.
- Keep gameplay pure, seeded and driven by dt. Pool the moving entities;
  cache sprite canvases at the measured scale; read no layout during frames.
- Give keys, pointer, touch and automatic throwing working controls, native
  card buttons, meaningful focus, throttled words and all required pauses.
- Keep every new tuning value, copy line and drawing path in data.mjs.
- Meet both bot bounds, the runtime and gzip budgets, pass all six checks,
  and pack both pages only after that gate passes.

This report is the project record within the explicitly allowed file set.
No external coordination record or pointer Markdown was written.

## File-by-file implementation

- data.mjs: replaces the unnumbered tafl find with hammer at x 112, y 222,
  view 112/218/34. Removes the board play/copy tables. Adds HAMMER with field,
  fixed step, pools, waves, weights, gaps, elites, movement, collision, damage,
  fates, boss, effects, sheet metrics, bot parameters and all drawing paths.
  Adds the draft hammer copy, correct Norse letters, hint and hammerFact slot.
- art.mjs: replaces the board drawing with a short-handled, ring-ended
  Mjolnir head down on a low stone, with a simple knotwork band and three
  spark strokes. The existing map's runeGlyph and RUNES supply game glyphs.
  Ground generation and the other find drawings remain intact.
- hammer.mjs: new pure seeded simulation. Includes outbound piercing and
  steering return/catch, per-throw hit memory, marching formations, lowest-
  column fire, destructible overlapping shield cells, curved wolf raids,
  chief fans and neighbour stops, split embers, Valkyrie gifts, hearts and
  invulnerability, silver/perfect-wave bonuses, twelve levelled runes, unique
  fates, three rune choices after each formation and the Hrungnir/clay/stone-
  heart phases. Fire shots reserve their future children against the cap so
  promised splits are not clipped. Cold also slows both hammer flights.
  Dagaz saves lethal blows but not a bridge breach. No DOM, random ambient
  source or clock is used. All entity pools retain their objects while stepping.
- findhammer.mjs: new map life and sheet controller. Idle sparks, near-pointer
  tremble and horn hop/spark stop under reduced motion. Press finds the
  hammer and grows the existing kit's sheet. A 300 by 400 canvas and 330 by
  550 panel scale together to the available view with the kit's edge margin.
  DPR is capped at 2. Foes, glove, hammer and Valkyrie use cached offscreen
  sprites, reused on reopening at the same scale and rebuilt on scale change.
  The shared kit frame supplies fixed 1/120-second steps, capped at eight.
  Includes the HUD, HTML start/rune/pause/end cards, fact on start and end,
  rune key labels/focus, automatic-throw toggle/T, native button activation,
  keyboard/pointer/finger input, status events and all pause reasons. Every
  key is isolated from page/explore handlers while the sheet is open. Storage
  read/write helpers catch failures and retain the best score for this page.
- finds.mjs: wires findHammer in place of findBoard. Part A's explore-aware
  capture and release logic stays intact.
- findkit.mjs: removes retired board CSS variables. The hammer owns its own
  sheet key handling, allowing Space/Enter on real buttons while isolating
  field keys. Other sheets keep the existing key guard and lifecycle.
- findall.mjs: unchanged. Its existing FINDS-based count/completion already
  handles the replacement id, including the horn's eleven hear recipients.
- map.css: replaces the board rules with the hammer panel, HUD, canvas,
  cards, rune buttons, status, visible focus and automatic-throw state.
  Uses existing colour variables and HAMMER-fed geometry/type variables.
- tools/check.mjs: replaces board assertions with field/panel/find/rune
  checks; rejects the four excluded keys in the game's rune list. Adds the
  game, combined runtime, individual source and packed gzip budgets.
- tools/finds-test.mjs: replaces board-only cases with hammer press/found,
  sheet/start/end fact, focus, key isolation and fixed P, toggle, pointer speed,
  close/blur/hidden/focusout pause, retained run, new seed, cached sprites,
  rune choice and throwing-storage cases. Adds recording canvas/Path2D and
  contains support. Corrects the recording DOM's stopPropagation semantics:
  other listeners on the same node still run; stopImmediatePropagation stops
  them. Retains the other find cases and all original regression digests.
- tools/hammer-test.mjs: new deterministic step comparison, 350 seeded wave
  constructions, phase thresholds and exposed-heart hit, 34 per-level rune
  checks, excluded runes, fate/upgrade interactions, return/catch/hit memory,
  shields and bridge loss, 10,000-step pool size/identity checks, finite values,
  shot caps, termination, average step cost and both seeded bots.
- Deleted tafl.mjs, findboard.mjs and tools/tafl-test.mjs as requested.
- joined.html, dist/journey-map.html and dist/journey-joined.html: regenerated
  by the two existing, unmodified pack tools after the clean six-test gate.
- HAMMER-BUILD.md: this ASCII handoff and evidence record.

## Bots and timing

The full 200-run test is fast on this machine, so the plain command retains
200 runs per bot. --full explicitly selects that same full run. An optional
--quick diagnostic uses 60 per bot with the same bounds. All three were run
against the final source, with seeds starting at 1001. Each bot chooses runes
with a separate seeded random stream. The steady bot tracks the lowest foe's
column and steps aside from shots predicted to arrive within half a second;
the idle bot never moves. Both always throw.

| Command | Runs per bot | Steady reaches wave 4 | Steady wins | Idle ends by wave 3 | Wall time |
| --- | --- | --- | --- | --- | --- |
| node tools/hammer-test.mjs | 200 | 74.0% (148/200) | 17.5% (35/200) | 91.5% (183/200) | 5.13 s |
| node tools/hammer-test.mjs --full | 200 | 74.0% (148/200) | 17.5% (35/200) | 91.5% (183/200) | 4.95 s |
| node tools/hammer-test.mjs --quick | 60 | 83.3% (50/60) | 21.7% (13/60) | 95.0% (57/60) | 2.40 s |

All idle win rates were 0%. The full steady and idle longest runs were 223.6
and 216.3 seconds of game time. No run reached the 20-minute guard. The plain
run averaged 0.00078 ms per steady step and 0.00069 ms per idle step, including
bot/test overhead, well below 0.3 ms. These are Node timings, not browser
frame timings. The plain command is well below the requested two-minute cap.

Final tuning includes 650/720 outward/return speed, a 1.75-second hurt window,
10-16 seconds between wolf raids, 14-21 seconds between Valkyries, and shot
intervals 1.7/1.45/1.3/1.25/1.05/0.9 seconds for the six formations. Values
were tuned in HAMMER; bot thresholds were not relaxed.

## Final validation and delivery weight

From design/journey-map, all commands exited 0:

- node tools/check.mjs
- node tools/finds-test.mjs
- node tools/hammer-test.mjs
- node tools/steps-test.mjs
- node tools/depth-test.mjs
- node tools/explore-test.mjs
- node tools/hammer-test.mjs --full
- node tools/hammer-test.mjs --quick
- node tools/pack.mjs
- node tools/pack-joined.mjs
- node tools/check.mjs again, including the newly packed files

The finds test retains and passes the sea/fill/coast length/hash checks,
STARS/DEPTH/NOVA digest 1195292270, trip digest 15594086 and depth digest
2235235323. Part A's step, card, explore, star/nova and reduced-motion tests
pass unchanged. The recording find harness also rejects layout reads during
frame callbacks and nonfinite attributes/canvas coordinates. It is not a
browser, screen reader or pixel renderer.

| Gzip payload | Size | Budget |
| --- | --- | --- |
| Hammer modules, data, copy and drawing | 14.90 KB | less than 30 KB |
| All top-level map .mjs plus map.css combined | 113.15 KB | 150 KB |
| dist/journey-map.html | 229.69 KB | 320 KB |
| dist/journey-joined.html | 449.95 KB | 540 KB |

Every individual top-level source also passes the 150 KB gzip ceiling. Raw
packed sizes are 520.8 KB for the map and 1060.1 KB for the joined page. Both
packers' offline/reference checks pass. Neither pack tool required an edit.

## Departures, omissions and limits

No intentional gameplay feature was left out. The conditional permission to
make the plain bot test 60 runs was unnecessary: its full 200-run default
takes about five seconds. --full remains available, and the optional --quick
60-run diagnostic is also reported above.

External installed skill files, RTK.md and external notes were not opened
because this task forbids touching other paths. The standing independent
design-critique workflow was not run because this task expressly forbids
reviewer agents and sub-agents. No workaround or claimed critique pass was
substituted. The authorized report records the reference-derived constraints.

No browser, visual check, side-by-side rendered comparison, device gesture
check, screen-reader session or 95th-percentile browser frame measurement was
made. In particular, the 4 ms browser script target is a design target, not
a measured pass. The external browser review owns those gates.

Only the listed source/new/deleted files and the three packed outputs were
changed. No other Markdown, index.html, hero-copy, reference, assets or
unlisted module was edited. No git, installation, network access, server,
reviewer agent or sub-agent was used. No server was started or left running.

## Browser review first

1. At 1440 by 900 and a narrow phone, compare the map hammer beside the
   original board/reference and the rest of the detailed chart at reading
   scale. Check the short handle, ring, widened faces, knotwork, stone, spark,
   attention tremble and horn hop. Verify the rest of the map and part A.
2. Inspect real sheet typography and scaling, all card states, the fact
   without playing, rune names/next-level numbers, HUD wrapping with fates,
   long status messages, focus rings and large text. The fit arithmetic
   passes; actual font wrapping has not been rendered here.
3. Play mouse, held keys, T/the toggle, touch drag, pointer cancellation and
   keyboard-only rune selection. Use Space/Enter on each button. Test every
   key while exploring, especially Escape, 0, + and -, and confirm no journey
   step or camera change. Check blur, hidden, focus departure, close/reopen,
   pause/resume and an interrupted run.
4. Judge throw/catch feel, returning hits, all twelve rune effects, fates,
   shield erosion/rebuild, packs, elite fans/stops and Valkyrie gifts. Fight
   Hrungnir through both thresholds and inspect the plain triangular heart
   and falling stone pieces. Assess human difficulty beyond the bot bounds.
5. Check screen-reader announcements, combined rune/wave messages, heart-loss
   priority, rune focus and normal native button operation. Repeat with
   blocked storage and reduced motion; the latter must keep play without
   map tremble/hop/sparks, game shake, flashes or glove flicker.
6. Measure script frame cost at the required desktop size with the busiest
   wave and every pool full, including drawing and status transitions. Check
   DPR/resize, console output, offline behavior and both packed pages.
