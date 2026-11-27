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
