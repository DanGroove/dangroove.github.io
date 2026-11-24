# Round 19: a short loader, and a calmer entrance

Dan, 24 Nov, 3:28 AM ET: "can we do a short loading thing before the in animations on the hero? the in animations also happen too fast and happen too much at the same time, hard to process".

Build on `0f38758` (round 18). Change nothing that this file does not name. Brand rules hold: ink #151314, paper #F7F6F3, #F0484F for small red on ink, Outfit, square corners, hard-edged motion (wipes and cuts, no opacity fades) except the stars and the name.

## What happens now (read in the code at 0f38758)

`ENTRANCE` in `entrance.mjs` runs everything in 1.4 s from the first frame that can draw: the mark (0 to 0.3 s), the nav cuts (0.24, 0.3), the name's two lines (0.08 to 0.4, 0.16 to 0.48), the lede (0.4 to 0.75), the craft hairlines (0.55 to 0.95), the floor and the star rings (0.2 to 0.9), the screen's clip plane (0.5 to 1.1) and the foot (1.1, 1.2). Between about 0.2 and 0.9 s, six of these move at once. Before the first frame, `play.mjs` waits for `fontsReady()`, `makeAtlas()` and `document.fonts.ready`, and the page shows ink with the entering parts held back (`.hero.is-entering` in `take-2.css`).

## L1 The loader

1. **What it shows.** On the page's own ink, the DG mark in paper (the header's own mark artwork, as an inline SVG, so it needs no font and no script), centred in the first screen: 44 px tall on desktop, 36 px on phones. 20 px under it, a 2 px hairline track as wide as the mark, one step lighter than the ink (#2B2829), which fills left to right in #F0484F. Square ends. Nothing else shows: no star field, no floor, no text.
2. **It shows from the first paint.** Its markup and CSS are in the page itself (`tools/page.mjs` builds the page; the offline preview from `tools/preview.mjs` must carry them too). It does not wait for any script, font or picture.
3. **The fill is real.** The boot steps that `play.mjs` already waits for (fonts ready, the atlas built, the first frame drawn) each move the fill's target on by their share. The drawn fill moves toward its target at a steady speed (it fills its whole width in no less than 0.8 s), never jumps, and never goes back.
4. **Short.** It is on screen for at least 0.8 s, and it ends when every step is done and the fill has reached the end. Then it holds full for 0.15 s, and the mark and hairline wipe out together, left to right, over 0.3 s (a hard-edged clip with `EASE.wipe`). The entrance starts when that wipe ends.
5. **Reduced motion.** The mark and an empty track show while loading; the track fills in hard steps as each boot step completes; then a cut to the finished page (the existing reduced-motion state). No wipe.
6. **Review links skip it.** A page opened with `?t=` (the film, sheet and pixel tools, Dan's review links) skips the loader as it skips the entrance now. `__hero.entrance` holds and `window.__ready` keep working as they do.

## L2 A calmer entrance

The same parts, the same wipes and cuts, the same order, but slower and one idea at a time: at any instant at most two groups move, in reading order. New `ENTRANCE` (seconds from the loader's end; old values in brackets):

| Part | New | Old |
|---|---|---|
| mark (wipe) | 0.00 to 0.45 | 0 to 0.3 |
| nav (cuts) | 0.35, 0.45 | 0.24, 0.3 |
| name: Danial, Endrawes (wipe up, weight 300 to 800) | 0.40 to 1.00, 0.60 to 1.20 | 0.08 to 0.4, 0.16 to 0.48 |
| lede (one wipe per line) | start 1.05, end 2.00, step 0.15 | 0.4, 0.75, 0.06 |
| floor and stars (rings from the stage's centre) | 1.80 to 2.80 | 0.2 to 0.9 |
| screen (clip plane rising) | 2.40 to 3.20 | 0.5 to 1.1 |
| crafts (hairlines) | start 3.00, end 3.60, step 0.10 | 0.55, 0.95, 0.05 |
| foot (cuts) | 3.60, 3.70 | 1.1, 1.2 |
| end | 3.80 | 1.4 |

- The loop's clock still starts when the screen's wipe ends (now 3.20 s), so the current craft's row is lit as its row cuts in.
- The star field takes the pointer when its rings end (2.80 s, was 0.90 s); the name reacts once the entrance has ended (3.80 s), as now.
- Every other rule of the round 6 entrance stays: hard edges, `staggerSpans`, the floor's and stars' wholly-on-or-off rings, the screen's clip plane, the review hold.

## L4 A more impressive loader: the stars gather into the mark

Dan, 24 Nov, 4:47 AM ET, on v32 (8c57810): "can we have a more impressive loading screen?". Offered two directions, he chose (4:52 AM ET) "Stars gather into your mark": stars fly in from the edges and form his DG mark as the page loads, then burst out into the hero's star field. **L4 replaces L1's look. L3 below is withdrawn: do not build it.**

L1's rules stay: the loader shows from the first paint without waiting for the page's module graph, fonts or pictures; real boot progress (fonts, atlas, first frame, the shares already chosen) drives it; what it shows never jumps or goes back; `?t=` skips it; it lasts no longer than loading needs beyond its own minimum. Stars may move softly (the brand's exception); everything else stays hard-edged.

1. **The same stars as the hero.** The mark is the hero's own star mark: the stars `stars.mjs` uses when a hold forms the DG mark (`STARS.mark`: its count, sampling, size once arrived, and colour flags, so the D's stars are red and the G's are paper exactly as the hero shows them), at the hero's own mark size (`STARS.mark.height` of the hero's height), centred in the first screen. The loader computes these with the same code as `stars.mjs` (build a small pure module both use, and have `tools/page.mjs` inline it so the first paint does not wait for the module graph). Add a check that the loader's positions, sizes and colours equal `stars.mjs`'s for desktop, tablet and phone viewports.
2. **They fly in from the edges.** Each of the mark's stars starts just outside a screen edge (a seeded point, spread round all four edges) and flies to its place in the mark along a gentle curve, 0.7 s, easing out. Star i launches when the displayed progress passes its share, spread over 0 to 0.85 so the last ones launch before the end. Order the launches so the mark fills evenly, not one part first. The displayed progress moves at no more than a whole gather per 1.4 s, so the gathering takes at least 2.1 s (1.4 s of launches plus the last flight), and it waits where loading waits.
3. **Formed.** When every star has arrived and the page is ready, the mark holds for 0.35 s.
4. **The burst.** The mark's stars blast outward, as the hero's release does, and each settles at its own home in the hero's star field over 0.9 s; the field's other stars fade in at their homes over the same 0.9 s. When they land, the WebGL star field takes over in that same frame with identical positions, sizes and colours, and the loader is removed. Nothing jumps at the handover.
5. **The entrance starts with the burst.** L2's timetable runs from the burst's start, with the stars' ring step dropped (the stars are already there); the floor's ring stays at 1.80 to 2.80. The star field takes the pointer when the burst ends. At most two groups move at once still holds (the burst counts as one).
6. **Keeps moving while the page builds.** Prefer drawing the loader in a worker with an `OffscreenCanvas`, so the stars keep flying while the main thread builds the atlas; the main thread posts each boot step. Where that is not available, draw on the main thread and hold the last frame through the build, with no gap. If a rule stops you, leave it out and say so.
7. **Reduced motion.** The mark of stars shows formed and still, with no flight and no burst. When the page is ready, cut to the finished page.
8. **Light.** A canvas and a small inline script; no new dependencies.

L4's checks: replace L1's loader checks with L4's as a pure timing function of time and progress (launch shares and order, flight time, the gathering's speed limit and monotonic count of arrived stars, the 0.35 s hold, the 0.9 s burst, the entrance starting at the burst with the star ring dropped, the pointer handover at the burst's end), plus the consistency check in item 1 and a check that the burst's end positions equal the field's homes. Negative controls: a gathering faster than 1.4 s fails; a loader star whose mark position differs from `stars.mjs`'s fails; an entrance that still runs the star ring fails.

## L5 The page waits for the stars to land

Run 3 (f1f6b52) built L4 and reported that L4's item 5 contradicts itself: started with the burst, L2's timetable puts three groups in motion at 0.35 s and 0.40 to 0.45 s (the burst, the mark's wipe, the name). Resolve it the calm way: the entrance starts when the burst ends (the stars have landed and the WebGL field has taken over), not when it starts. L2's timetable then runs unchanged from that moment (star ring still dropped, floor ring 1.80 to 2.80), and the star field takes the pointer at the same moment. Update the checks so the two-group limit passes with the burst counted, and add a negative control that starts the entrance with the burst again; it must fail. Nothing else changes.

## L6 Every star glides to a stop

Dan, 24 Nov, 5:46 AM ET, on v34 (01e9ad2): "the stars stop too suddenly". Cause, read in `loaderDots`: the burst moves each star with `soft(p)`, a smoothstep, which eases in as well as out, so the stars are at full speed late in the burst and brake hard at the end (a star with an 800 px journey still moves about 480 px/s 0.09 s before it stops dead). Size, colour and the other stars' fade-in use the same curve. The gathering's flights ease out (cubic), but still come in fast near the end of their 0.7 s.

1. **The burst eases out only, like the hero's own release.** Each star leaves the mark at its fastest (the release's outward kick plus its pull toward home) and then only slows, all the way to rest at its home. Make the burst 1.2 s (was 0.9 s). For the pull home use an ease-out whose speed falls to zero at the end, for example `1 - (1 - p) ** 4`. Make the outward kick die away sooner than the pull, for example `A * p * (1 - p) ** 6`, with A set so the kick's furthest point out is where today's is. Size, colour and the field's other stars' fade-in follow the same ease-out as the pull; no smoothstep is left in the burst.
2. **The gathering's flights soften the same way.** Keep each flight's 0.7 s, its curve and its launch order; only its easing changes to the same kind of ease-out (for example `1 - (1 - f) ** 4`). If a curve misses item 3 for some stars (a flight's bend, or the burst's kick adding to the pull), use a stronger ease-out (a higher power) rather than loosening the rule, and say so.
3. **The rule, for both stops:** in the last third of its move (the last 0.4 s of the burst, the last 0.233 s of a flight), every star's speed never rises and stays under a sixth of its average speed over the whole move, and it reaches zero on arrival. Today's smoothstep burst breaks it (its speed a third from the end is about 1.33 times the average).
4. **Nothing else changes.** The burst still lands exactly on the field's homes with their sizes and colours, the WebGL handover is the same, and L5 still holds: the entrance and the pointer start when the burst ends, so 0.3 s later than now (3.65 s on an all-ready boot). The gathering's speed limit, launch shares, the 0.35 s hold, reduced motion and `?t=` are unchanged.

L6's checks: the rule in item 3 for every star of the burst and of every flight, sampled every 1/240 s, on the desktop and phone scenes the loader checks already use; the burst's end positions, sizes and colours still equal the field's homes; L5's checks with the new times. Negative controls: the smoothstep burst fails item 3; the cubic flight fails item 3; an entrance that starts at the old 0.9 s point fails L5.

## L7 The mark shrinks, swells and explodes; every move eases further

Dan, 24 Nov, 6:12 AM ET, on v35 (4c56935): "maybe the logo shrinks then grows then explodes. the stars still need more easing". Read in the code: the quartic moves still brake hard because they are short and fast (a 0.7 s flight across 800 px starts near 4,600 px/s and decelerates at about 19,600 px/s² from its first frame; the 1.2 s burst covers half its journey in 0.2 s). The burst also pairs each mark star with an arbitrary home (`i % homes.length`), so stars cross the mark and turn sharply after the 0.1 s kick. L7 replaces L6's curves and L6's speed rule; everything else in L4 to L6 stands.

1. **Gentler flights in.** Each flight takes 1.0 s (was 0.7 s) with a cubic ease-out, `1 - (1 - f) ** 3`; same paths, launch shares and order. The gathering's minimum becomes 2.4 s (1.4 s of launches plus the last flight).
2. **Hold, shrink, swell.** Once the mark is formed it holds 0.15 s (was 0.35 s). Then the whole mark shrinks to 0.84 of its size about its weight centre (`placeMark`'s `weight`, not the box centre) over 0.4 s, easing in and out (`0.5 - 0.5 * cos(PI * p)`), and swells from 0.84 to 1.10 over 0.25 s, accelerating (ease-in, `p ** 2`). It is one uniform scale: every star keeps its place in the mark, its size and its colour, so the mark keeps its shape. No tremble or jitter (Dan removed it in round 18).
3. **A radial explosion.** At the end of the swell the mark explodes: each star flies on a straight line from its swollen position to a field home that lies in its own direction from the weight centre. Pair stars to homes by angle round the weight centre: sort the mark's stars by angle, sort the homes by angle, and pair them in that order. Where the field has more homes than stars (desktop), the paired homes are spread evenly through the sorted homes and the others fade in at their homes during the explosion, as now. Where it has fewer (phone), every home gets one star and the stars left over fly out along their own rays like the rest and fade to nothing by the landing. No separate kick: the swell is the wind-up.
4. **More easing on the explosion.** It takes 1.6 s (was 1.2 s) with a cubic ease-out, `1 - (1 - p) ** 3`, for position, size, colour and fades alike. The speed jumps up once, at the explosion's first frame (that is the blast), in the swell's own direction, then only falls, to zero on arrival.
5. **Nothing else changes.** The explosion still lands exactly on the field's homes with their sizes and colours, the WebGL handover is the same, and L5 still holds: the entrance and the pointer start at the landing, which on an all-ready boot is now at 4.8 s (2.4 + 0.15 + 0.4 + 0.25 + 1.6). Reduced motion (the formed mark, still, then the cut) and `?t=` are unchanged.

L7's checks, replacing L6's: the flight and explosion curves and durations above (sampled every 1/240 s on the desktop and phone scenes the loader checks use); during the shrink and the swell every star sits at the weight centre plus its mark offset times the scale, and its speed is zero at the hold's end and at the shrink's end; every star leaves on its line to its paired home and the speed never rises after the explosion's first frame; on desktop every paired home is used once, on phone every home is used once; the pairing keeps angle order; the landing equals the field's homes; L5's checks with the new times. Negative controls: v35's quartic 1.2 s burst fails the curve check; an explosion with no shrink fails; pairing by `i % homes.length` fails the angle-order check; an entrance that starts before the landing fails L5.

## L3 (withdrawn, not to be built) A more impressive loader: the mark, from first sketch to final

Dan, 24 Nov, 4:47 AM ET, on v32 (8c57810): "can we have a more impressive loading screen?". L3 replaces L1's look. L1's rules stay: the loader shows from the first paint without waiting for any script, font or picture; real boot progress (fonts, atlas, first frame, the shares you chose) drives it; it never jumps or goes back; `?t=` skips it; it lasts no longer than loading needs beyond its own minimum. Only the picture and its steps change.

The idea is Dan's line, "From first sketch to final cut", played on his own DG mark in the hero's own tool language (guides, a pen path with anchor points, a fill), hard-edged throughout.

1. **Size and place.** The mark centred in the first screen, 128 px tall on desktop and 88 px on phones (width from the mark's 1080 x 797.3). Nothing else shows behind it: ink only.
2. **Guides (0 to 0.4 s).** Construction hairlines draw on, each as a line drawing itself from one end (a dash offset, `EASE.wipe`, 0.2 s each, 0.05 s apart): the mark's bounding box, its vertical and horizontal centre lines extended 24 px past the box, each of the three parts' bounding boxes, and one circle fitted to the outer curve of the G's bowl and one to the D's bowl (fitted to the path's own curve points). 1 px, #3A3637, square ends.
3. **The pen (from 0.3 s, driven by progress).** The outline of `MARK_D`'s three parts (the G's two parts, then the D) is traced in a 1.5 px paper stroke, as if drawn with a pen tool. The traced length is the displayed progress: it moves at no more than one whole outline per 1.0 s, so the trace takes at least 1.0 s, and it waits where progress waits. As the trace passes each on-curve point of the path, a 5 px paper square (an anchor point, hollow, 1 px) cuts in there and stays. The anchor just placed shows its two bezier handles (1 px paper lines to small 3 px filled dots at its control points); the previous anchor's handles cut away when the next anchor appears.
4. **The fill (when the trace is complete and the page is ready).** Hold 0.1 s. Then the three parts fill with a hard wipe up from their bottom edge over 0.35 s: the G's parts in paper and the D in red, exactly as the header mark draws them on ink. The instant the fill completes, the guides, anchors, handles and the stroke cut away together.
5. **The arrival.** Hold 0.25 s. Then the filled mark moves and scales from the centre to the header mark's place and size over 0.6 s (`EASE.wipe`, a hard-edged move, no fade), landing exactly on the header's mark. In the frame it lands, the header mark shows and the loader is gone, so there is never a second mark. The entrance then starts with the header mark already in: skip its mark wipe and keep the rest of L2's timetable as it is (nav at 0.35 and 0.45, the name at 0.40, and so on).
6. **Reduced motion.** The filled mark sits centred, with no guides, trace or move. When the page is ready, cut to the finished page.
7. **When loading is instant**, the whole loader takes about 2.2 s (guides and trace 1.3 s, hold, fill 0.35 s, hold, move 0.6 s). When loading is slower, only the trace waits.
8. **Keep it light.** Inline SVG and a small inline script that needs nothing else from the page; no new dependencies, no canvas library. It must keep drawing (or hold its last drawn frame without a gap) while the atlas is being built.

L3's checks: update L1's loader checks to L3's steps as a pure timing function of time and progress (the guides' spans, the trace's speed limit and monotonic length, anchor and handle timing, the fill's 0.35 s, the 0.25 s hold, the 0.6 s move, the entrance starting after the landing with the mark wipe skipped). Check that the move's end rectangle equals the header mark's rectangle. Negative controls: a trace faster than one outline per 1.0 s fails; an entrance that runs the mark wipe after the arrival fails.

## Checks

1. Update `tools/entrance-checks.mjs` (and any other check that reads the old timetable) to the new numbers, and list every changed expectation with its old and new value.
2. Add a check that samples the new timetable every 1/60 s and finds at most two groups in motion at any instant (cuts count only at their instant), with the groups in the order of the table. Negative control: the screen back at 0.5 to 1.1 must fail it.
3. Write the loader's timing as a pure function of time and boot progress (where the fill is, when it holds, when the wipe runs, when the entrance starts), and check it in Node: the fill never jumps or goes back; the loader lasts at least 0.8 s when everything is ready at once; the wipe is 0.3 s; the entrance starts at its end; `?t=` and reduced motion take their own paths. Negative control: a loader that ends at 0.5 s must fail.
4. Run `tools/checks.mjs` to `all clean`, and every negative control fails at its gate.

## Done when

- The checks above pass and every control fails at its gate.
- BUILD.md has a "Round 19" part: what changed, the old and new numbers, every earlier check that changed, and anything you could not do or decided differently, with why.
