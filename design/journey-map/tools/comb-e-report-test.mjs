// Generate the allowed short report, then verify its evidence links and ASCII.
import {readFileSync,writeFileSync,existsSync,readdirSync,appendFileSync} from 'node:fs';
import {strict as assert} from 'node:assert';
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-f',file='COMB-E-BUILD.md';
const link=(name,label)=>'['+(label||name)+']('+root+'/'+name+')';
const pair=(name)=>link('before-'+name+'.png','before')+' / '+link('after-'+name+'.png','after');
if(process.argv.includes('--write')){
 // The initial two commands preceded the logging helper. Preserve their
 // complete observed stdout from the session rather than omit those runs.
 if(!readFileSync(root+'/tests.log','utf8').includes('## node tools/comb-e-capture-test.mjs before')){
  appendFileSync(root+'/tests.log','\n## node tools/comb-e-setup-test.mjs (exit 0)\nInherited test profiles, captures and appended output confined to C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-e\n\n## node tools/comb-e-capture-test.mjs before (exit 0)\nbefore 412x730 DPR 2 captured\nbefore 360x640 DPR 2 captured\nbefore 1440x900 DPR 2 captured\n');
 }
 const logs=readFileSync(root+'/tests.log','utf8'),latest=new Map();
 for(const m of logs.matchAll(/(?:^## node (.*?) \(exit (\d+)\)|^node (.*?) -> (\d+))/gm))latest.set((m[1]||m[3]).trim().replace(/--cdp\s+ws:\S+/,'--cdp LOCAL'),Number(m[2]||m[4]));
 for(const row of readFileSync(root+'/exits.jsonl','utf8').trim().split('\n').map(s=>JSON.parse(s)))latest.set(row.command.replace(/^node /,'').replace(/--cdp\s+ws:\S+/,'--cdp LOCAL'),row.code);
 const syntax=[...latest].filter(([s])=>s.startsWith('--check '));
 const table=[...latest].filter(([s])=>!s.startsWith('--check ')).sort(([a],[b])=>a.localeCompare(b)).map(([s,n])=>'| `node '+s+'` | '+n+' |');
 table.unshift('| `node --check` ('+syntax.length+' source/tool files; full names in log) | '+(syntax.some(([,n])=>n)?1:0)+' |');
 const report=`# COMB-E build record

This is a partial completion. E1, E2 and the Lennard part of E4 remain failing
after two attempts. E5's warm-up slice check passes; its broader startup task gate does
not. No independent review or all-pass acceptance is claimed.

The BRIEF, COMB-D, COMB-D-BUILD and COMB-E constraints were carried forward.
The approved sheet-map.jpg, incumbent phone/desktop captures, map-hand guidance
and earlier GLIDE/COMB intent informed the work: keep the winding chart, small
thin-line drawings, shield/name relationships, restrained type and existing
story. Acceptance was recorded before editing: 2 px label ink clearance,
4 px drawing/label clearance, upright humps, an interior-only beam, recognizable
T-grip dig cues, bounded idle work and unchanged motion/preservation gates.

## Changes and evidence

- **E5:** Ink sampling and each row's search now resume from generators.
  Batched stipple reads its exact authored dot coordinates once. A 2 px coarse
  candidate grid is refined locally at 0.5 px; 13 scales replace 25, and sub-line
  suffix checks no longer repeat the same search. Stationary-state and existing
  public journey/hero reads gate idle callbacks; nothing was added per frame.
  Glides, focus, Explore/opening, the nova and the joined hero block work. Resize
  and font load cancel stale jobs. An early Explore uses a fixed seed layout;
  the unfinished job resumes only after Explore closes, so it cannot change
  visible labels when it finishes. The existing sub-line opacity fade remains.
  At CPU x4 the four final cases measured 205-269 callbacks, maxima 1.6-1.7 ms,
  zero working callbacks during motion and unchanged early-Explore text.
  Full renderer traces still show map module startup at 177-541 ms, plus other
  over-16-ms layout/paint/frame tasks. The strict load-through-first-glide gate
  therefore fails. The startup wiring cannot be rewritten under main.mjs's
  hook-only allowance. The other three glide timings await the prohibited cost
  pass; their analytic and rendering preservation tests pass.
  The final first-second opening test also fails: joined desktop reaches
  18.031 ms (three slices over 16), and map 390 x 844 returned no renderer slices,
  so that case is unverified. The other six cases measured 12.570-14.549 ms.
  Initial zero-callback timing runs exposed idle starvation and are superseded,
  not passing evidence. The final trace precedes restoring the original small
  sketch coordinates and relocating the spade path from data to art; the
  scheduler, sampler and frame code are the same. The later scope check proves
  the path relocation preserves the 46,730-byte finds SVG exactly (2671831128).
  Trace evidence: ${link('warm-journey-map-412.json','map phone')},
  ${link('warm-journey-map-1440.json','map desktop')},
  ${link('warm-journey-joined-412.json','joined phone')},
  ${link('warm-journey-joined-1440.json','joined desktop')}.
- **E1:** Tried 12-unit drawing nudges, then changed the HMC names to the left
  and Mohawk to the right of their own shields. The nudges were removed to keep
  the original overview relationships. Names remain one line; fallback layouts
  are constant-cost and stable during Explore. The warmed study lets the first
  HMC sub-line show close in, but the second HMC sub-line still has no valid
  threshold. Ink, proximity, opening and early-layout failures remain in the
  final spatial tests. The missing sub-lines in an early unfinished opening are
  also unresolved. Per the two-attempt rule, no further layout iteration was
  made. Rest comparisons: 412 x 730 ${pair('412x730-explore')};
  360 x 640 ${pair('360x640-explore')};
  1440 x 900 ${pair('1440x900-explore')}.
- **E2:** Each surfaced band now arches upward from level feet centered on its
  own ring point. The back outline, scale ticks, width, neck and tail fin remain.
  Surfaced intervals moved along the unchanged submerged ring; two spans were
  shortened to keep the upright arches within the frame. The top hump moved off
  the kicker. The expanded eight-size drawing test includes the title/kicker,
  head and complete calendar geometry. It still finds 1.97 px from the kicker
  at 1024 x 600, below the 4 px gate. E2 is incomplete; the better drawing was
  retained under the two-attempt rule. Phone close view: ${pair('412x730-serpent')}.
- **E3:** A stationary local SVG clip surrounds the animated beam. The clip maps
  to the inner rectangle (23,23)-(577,877), so the resting and aimed beam share
  the same boundary. The rest sweep and reading logic are unchanged. Native
  raster and four-reading results are in comb-e-beam-test. Existing reading
  positions are outside the inner frame: interaction still reaches them, but
  the clipped ray cannot draw to those exterior notes. Moving the readings is
  outside COMB-E's data allowance, so they were preserved for review.
  Phone close view: ${pair('412x730-beacon')}.
- **E4:** Replaced the grip loop with a short T crossbar, a straight handle at
  about 15 degrees, and a closed pointed blade sunk into a smooth earth arc.
  Three clods remain. The cue is about 14.44 CSS px wide at the 412 overview.
  Whole pit/chest/hit/hint groups move with the hoard data: Laurier +16 y,
  first HMC +6 y, Lennard -7 x/-14 y; the other two stay put. Laurier and HMC
  pass the native eight-size check, as do the other unchanged marks. Lennard's
  final minimum is 1.35 px at 360 x 640 and 1.79 px at 1024 x 600, below 4 px;
  narrowing the cue did not solve it. The better
  placement was kept and iteration stopped. Recognition of the small T-grip
  still needs real-browser judgment. Phone close view: ${pair('412x730-hoards')}.

Whole-chart comparisons, judged beside the original reference at reading scale:
412 x 730 ${pair('412x730-overview')}; 1440 x 900 ${pair('1440x900-overview')}.
The existing density, cards, coast/stipple, footer, palettes and source copy were
preserved. Drawings were inspected both close in and in their whole chart.

## Tests

Updated inherited B/D browser fixtures and append-only log destinations to the
allowed run folder; brought the headless target to the foreground. D capture's
default is now verified-after so it cannot overwrite the original captures.
The D drawing test now includes the title/kicker and the entire serpent head/pad.
The label probe follows the generator completion point. finds-test re-records
only authorized sea/data/trip pins and recognizes the added beacon clip while
still checking all five hoard clips and unique IDs. Protected coast/fill, depth,
original-sky restoration, motion and rendering expectations were not relaxed.

Added E tests: run/suite retain full logs and exits; capture supplies the exact
requested DPR 2 views; place/label-study/probe diagnose actual ink and cache
results; warm measures callbacks and renderer slices at CPU x4; trace-audit
keeps the failed strict startup gate explicit; beam tests native clipping at
12 angles and all four readings; report verifies ASCII and local evidence.
The initial setup/drawing-edit helpers' output is in the log. The drawing editor
was removed after correcting its data scope mistake: the original hoard path
field is restored and the authorized drawing is in art.mjs. The added scope
test proves the resulting SVG is byte-identical and all hoard moves are <=16.

Last exit of every named test/pack command run (0 is only that test's scope).
Syntax checks are grouped; their individual commands are in the full log.

| Command | Last exit |
| --- | --- |
${table.join('\n')}

Full output: ${link('tests.log','tests.log')} and
${link('inherited-tests.log','inherited-tests.log')}. Profiles, captures, placement
studies and traces are all in the same permitted run folder. Gzip budgets were
not raised; the final check output contains the measured values.

## Limits and handoff

The legacy comb-d-report-test rewrites COMB-D-BUILD.md and was not executed;
that write is explicitly forbidden. Its syntax was checked. No cost launcher,
git command, install, external network access, server or agent was used. main.mjs,
join.mjs, depth.mjs, map.css, cards.mjs, join.css, hero-copy and earlier reports
were not edited. The three HTML outputs were written only by the pack tools.

The ${'[design-critique-loop skill](C:/Users/Admin/.codex/skills/design-critique-loop/SKILL.md)'}
says, "Use two reviewers other than the implementer with complementary visual
and integrity scopes." The explicit no-agent rule takes precedence. That gate
is incomplete. UI polish/craft and motion guidance were applied; launchers and
external notes were omitted under the network/write-path rules. No scores are
manufactured. This allowed report is the project decision record.

Review the unresolved name/ink and sub-line cases at rest, through opening and
at all zooms; the Lennard cue/date clearance and spade recognition; upright
arches in the full map; clipped light versus exterior notes; and first-glide
timing in the separate quiet real-browser pass. Failed gates remain failed.
`;
 writeFileSync(file,report);
}
const text=readFileSync(file,'utf8');assert.ok(!/[^\x00-\x7f]/.test(text),'report must be ASCII');
const links=[...text.matchAll(/\]\(([^)]+)\)/g)].map(m=>m[1]);for(const path of links)assert.ok(existsSync(path),'missing evidence '+path);
assert.ok(text.includes('partial completion')&&text.includes('strict load-through-first-glide gate'),'failed gates must remain explicit');
console.log('ok: ASCII report; '+links.length+' existing local evidence links; failures and limits stated');
