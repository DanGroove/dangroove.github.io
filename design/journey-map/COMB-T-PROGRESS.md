# COMB-T progress (part 16): stopped for the PC to sleep

Codex ran COMB-T.md on Dan's PC from 21:54:57Z on 27 Nov 2026. I stopped it at 23:02:37Z (6:02 PM ET), about 68 minutes in, during T9's press group, so the PC can sleep; the rest of part 16 continues in the cloud. Codex did not write COMB-T-BUILD.md. The statuses below come from its run log and the diff in this commit.

`node tools/check.mjs` passes (exit 0): runtime 221.01 KB of 221.1, dist/journey-map.html 337.41 KB of 337.5, dist/journey-joined.html 584.05 KB of 584.1. Every changed file is on COMB-T.md's allowed list; joined.html is unchanged.

| Item | Status |
|---|---|
| T6 HMC chest off the trail | Done. The chest is moved; the geometry and real-press checks pass, including a new screen hit for the chest. |
| T2 rename | Done: "point of interest". |
| T7 Skoll's and Hati's gaps | Done per the log; in depth.mjs only the wolves' lag line changed. |
| T5 note one | Done: moved. |
| T4 Mohawk below-left | Done, as a hard constraint: the name clears the trail at all 13 scales. |
| T2 even gaps | Done: the legend places its items from cached measurements; 16 of 16 cases pass. |
| T1 compass words at one size | Done: the words sit on bounded screen surfaces of their own; the word test passes 22 cases. |
| T3 Shake the ash | Done: the crown and trunk take the press (marker 7, six leaves). The well's pebble and answer code are removed; its art, drip and ripple stay. |
| T5 endless beam and pyre | Done: the beam turns forever on a wedge layer of its own; the beacon checks pass. |
| T8 checks | Run, with two failures: the strict picture comparison fails, and one inherited beacon check is one frame over its air-redraw limit. The ash, beacon, word, legend, chest-press and geometry checks pass. |
| T9 measuring on this PC | Partly done. Rest group finished: about 234 to 235 fps on both builds, no frame over 25 ms, no paint clip bigger than the viewport; the three presses read 3 of 3 notes on the new build and 2 of 3 on the base. Press group (press:print, press:ash, press:pyre) stopped after 7 rows; the base has no ash hit, so its press:ash rows are unavailable. Moving group not run. |
| T10 stage the phone pass | Not started: no phone-pass.ps1. |
| Report | COMB-T-BUILD.md not written. |

Not in this commit: the run's logs, traces, captures and browser profiles, which stay in journey-map-runs\comb-t on the PC.

## Review in the cloud (Claude, 27 Nov 2026, 6:05 to 7:00 PM ET)

Reviewed by hand with real clicks, taps, keys and wheel at 1920x950 and 412x915, on the packed page.

**Fixes made on top of Codex's work**

- **Particles were shown only while the camera moved, since part 15.** The particle layer (`#f-bits`'s idle layer) has no actor, so once its first burst ended it was marked hidden and skipped at rest. Light the beacon at Interkom: Preview 29 showed every frame that had live particles (413 of 413); part 15 and Codex's part 16 showed 27 of 435 and 26 of 485. `findIdleFrame` now treats that layer as active while any particle is live or it is still shown (506 of 512 shown at 1920; the rest are off-screen or the first frame). This brings back the pyre's sparks and tongues (T5), the lit beacon's sparks, the chests' rings and stars, the ravens' feathers, the ash's drip and the mist's wisps.
- **Part 15's two review fixes**, held until now: an idle layer is shown only while some of its box is on screen (beacon and flame afterimages up to 400 px off in Next to hmc1), and `.bc-light`'s layer box holds the beam's whole turn (explore cut its upper edge flat). `findIdleBox` in findkit.mjs; main.mjs's `buildIdleLayers` uses it.
- Size budgets: +0.5 KB for these (check.mjs).

**What checked out**

- T1: every compass word is 10 px with 2.7 px tracking and the same gap off the ring at each stop, at X, and in every frame of Lennard to X and X back.
- T2: 8 px inside and 16 px between items at the overview at both sizes, even at every zoom; "point of interest".
- T3: marker 7 and real clicks on the crown drop the six leaves in trail order, each with its stop's pop; a seventh press only shakes; then "Every place has dropped its leaf." The press lands on the whole crown and the trunk. The pop sits above the crown, as every find's pop does.
- T4: Mohawk's explore name sits below and left of its marker, clear of the trail, at both sizes.
- T5: note one sits higher and clear of the others; after the finale the beam turns about 46 degrees a second (one turn in 7.8 s) with the map beam hidden; the pyre leaps and settles, and with the particle fix its sparks and tongues rise.
- T6: the HMC Connections chest sits clear below the trail (Preview 29 touched it).
- T7: through every glide frame, Sköll stays 30 px (1920) and 15 px (412) clear of the sun, where Preview 29 overlapped by 35 and 23 px; Hati stays 36 and 18 px clear of the moon.
- No layer misaligned and no afterimage in any move (Set out, Next, Back, Lennard, explore opening, visit, Escape, wheel, pinch, drag), and no idle ink clipped at rest.
- Cloud runs of the tests (cloud Chromium, no GPU): comb-s-idle, comb-s-raster, comb-t-words, comb-t-legend, comb-t-ash, comb-t-beacon, comb-t-scope, comb-t-spatial and finds pass. comb-t-picture fails only where an authorized change sits outside its masks: the legend's rename and gaps (its mask follows the new boxes, not the old ones) and note one's move.

**Still for the PC:** T9's press group (stopped at 7 rows) and moving group, and T10's phone pass.
