COMB-Q build, 2026-11-26. Implemented Q1, then Q2. Acceptance is incomplete: the clearance gates below remain failed. Starting pages, exits, full logs and the external decision record are in [comb-q](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-q/). All part 13 review fixes remain; the scope audit verifies 359 protected files, unlisted data and other art unchanged, including the protected drawings.

Q1: the old ash emits the exact approved SVG, using its supplied generator once at load to reduce delivery size. Removed the root creature and its gnaw life. Preserved eagle/squirrel animation with offsets (-3,1)/(0,-6), moved the climb to x297, traced the crown and tapered root centre lines, and placed all 15 stars inside foliage. Sampled crown error is 0.46 map units; trail gaps pass. YGGDRASIL moved only 0.1 right to (318.1,361), with labelBox (318.1,355,359.1,363); its close-up gap passes, including 2.02 units on phone. [Reference comparison](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-q/q-ygg-reference-comparison.png).

The grove retains 64 trees. Old T38/T39 were replaced at (405.3,393.7) and (393.4,395.2). Old T42 moved (403.0,346.4) -> (403.0,351.4); T43 moved (412.8,369.7) -> (412.8,364.7) as the existing index nudges followed the regenerated inventory. T38-T45 consequently renumber; [full inventory](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-q/q-grove.json) records every correspondence.

Q2: installed A's carved head, banded ribbon, taper and open tail while retaining the ring interior and surface windows. Detail fades with camera scale. The first map press only focuses; two 2.4-second laps return typed, bold, underlined suffixes. The third poke opens the loop, stamps SHIPPED in Ink on Paper and shows the existing todo slot, "A shipped story goes here." The next closes it with final.mp4; pdf/mp4/aep/fig cycle. Rapid pokes wait through the shipped handoff. Horn response, dozing and reduced-motion states pass. The phone file is about 13 px high. HERE BE REVISIONS moved from y132 to y118 through data only; SEA OF FEEDBACK remains. The current drawing entry is FIND_PLAY.drawings.serpent, called FIND_ART.serpent in the brief.

Required 1920x950 stills: [1 rest](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-q/q-serpent-1920-state-1.png), [2 lap](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-q/q-serpent-1920-state-2.png), [3 renamed](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-q/q-serpent-1920-state-3.png), [4 shipped](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-q/q-serpent-1920-state-4.png). [Reference comparison](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-q/q-serpent-reference-comparison.png). Behavior, queue, horn, reduced-motion, filename-fit and stamp-pixel checks pass at the tested sizes; the new tests exit 1 for spatial failures.

Remaining: Q1 collides with marker 2 at overview and misses the HMC scratch's 4-unit gap (minimum 2.46 units). Q2 retains inherited HMC/title/beacon overlaps and adds marker 4 deficits, 3.93 px at 1440 and 1.15 px on phone. The wider ribbon leaves the ship's north berth 8.56 units away against its unchanged 9.5-unit requirement. These were left unresolved rather than moving protected finds/labels or cutting the approved drawings. Hold adds seven whole-page pixel failures from changed art. Quiet's failed-gate set is unchanged.

Added comb-q-ygg-test and comb-q-serpent-test use real CDP input, geometry/state/count observations and captures; serpent also checks stamp pixels. Changed finds-test's authorized sea/data pins, old calendar sequence and removed-creature assertion; comb-b-art removes the old creature expectation; comb-b-detail studies the new crown; comb-d-drawings includes nested ribbon/studs and flattens ash curves for sampling. Explore-test adds the sea layer to its fixture. Comb-l2-finds-test closes its browser even when its existing EPERM save failure throws. Other assertions, including the ship clearance, remain. Check.mjs changes only RUNTIME_KB and its dated note: Q adds 3.40 KB, limit 202.7; actual 203.14 still carries the starting overrun. The packed standalone is 319.21 KB gzip, below 320.

The table gives each check's last exit, not runner success. "No" means no additional failed gate observed; blocked and joined-based checks do not validate the new standalone. Joined remains unchanged: pack-joined.mjs also writes protected joined.html, so it was not run.

| Test | Base | Last | Added failure observed |
| --- | --- | --- | --- |
| check | 1 | 1 | Yes: canopy/coast gates |
| comb-b-art-test | 0 | 0 | No |
| comb-b-detail-test | 0 | 0 | No |
| comb-b-layout-test | 1 | 1 | No |
| comb-d-capture-test | 0 | 0 | No |
| comb-d-drawings-test | 0 | 0 | No |
| comb-d-evidence-test | 1 | 1 | No |
| comb-d-ink-test | 0 | 0 | No |
| comb-d-layout-test | 1 | 1 | No |
| comb-e-capture-test | 0 | 0 | No |
| comb-extra-test | 0 | 0 | No |
| comb-f-compare-test | 1 | 1 | No |
| comb-f-controls-test | 0 | 0 | No |
| comb-f-evidence-test | 0 | 0 | No |
| comb-f-interaction-test | 1 | 1 | No |
| comb-f-raster-test | 1 | 1 | No |
| comb-f-report-test | 1 | 1 | No; historical evidence blocker |
| comb-g-input-test | 1 | 0 | No |
| comb-g2-preservation-test | 1 | 1 | No; missing baseline record |
| comb-l2-all-finds-test | 0 | 0 | No |
| comb-l2-finds-test | 1 | 1 | No; same save blocker |
| comb-l2-scope-test | 1 | 1 | No; missing baseline record |
| comb-l2-smoke-test | 0 | 0 | No |
| comb-m-layers-test | 1 | 1 | No |
| comb-m2-ship-test | 0 | 1 | Yes: ring clearance |
| comb-n-hold-test | 1 | 1 | Yes: changed-art pixels |
| comb-p-quiet-test | 1 | 1 | No |
| comb-p-style-test | 0 | 0 | No |
| comb-q-serpent-test | - | 1 | New: clearance failures |
| comb-q-ygg-test | - | 1 | New: clearance failures |
| comb-reduced-test | 0 | 0 | No |
| depth-test | 0 | 0 | No |
| explore-test | 0 | 0 | No |
| finds-test | 0 | 0 | No |
| glide-visual-test | 1 | 1 | No; run-folder guard |
| scope-audit | - | 0 | No |
| steps-test | 0 | 0 | No |

Omitted protected report writers: comb-d-report, comb-e-report, comb-l2-report and comb-report. Comb-f-sharpness measures timings and was omitted; comb-f-evidence ran capture mode only. Glide-visual stopped at its comb-a output-folder guard and was not worked around. Offline skill setup was omitted. The [design-critique-loop skill](C:/Users/Admin/.codex/skills/design-critique-loop/SKILL.md) requires "Use two reviewers other than the implementer"; the no-agents rule prevents that independent gate. No scores or independent approval are claimed. No git, installation, external network, agents or timing measurements were used.

Profile cleanup is incomplete. The inherited EPERM save failure left profile-1795729143881 and profile-1795731060513 in comb-q before its finally cleanup was corrected. Both are inactive. Automatic approval review rejected recursive deletion of the first, stating "blocked by policy"; the directories remain for manual cleanup. No removal workaround was used.
