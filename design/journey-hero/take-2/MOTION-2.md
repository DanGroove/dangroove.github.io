# The motion, second pass: everything is built on screen

Read `MOTION.md` first. It is still the brief for the screen, the change of shell between apps, the dock, the line the
exported work feeds out of, the renderer, the player and the tools. This file replaces its section "The six scenes", its
lengths and its times, and it moves the exported work. Where the two disagree, this file wins.

## What Dan said after watching the first build

> looks good so far. for photoshop it should show more of a process for editing a photo. same for premiere and aftereffects,
> it should show me like dragging the clip into the timeline, cutting it, adding the transitions/effects and the captions,
> editing the audio and music. honestly, for every part, it should start empty with me filling everything in. look at every
> piece and have it actually build it like if there is text, it should show it typing that. also for the exported materials,
> let's make sure they're centered below the screen. for video, motion and ux ui exports, it needs to show the final version
> actually moving mirroring what was done on the big screen, not static.

So four things change:

1. **Every app opens on an empty document, and the cursor makes every piece of it.** Nothing that belongs to the document
   arrives with the opening wipe any more.
2. **Text is typed.**
3. **The exported work is centred below the screen**, as the camera sees it.
4. **The exported video, motion piece and prototype play on their devices**, in step with the big screen.

## Ground rules

- Write only inside `design/journey-hero/take-2/`. Do not change `MOTION.md` or this file. Nothing in `public/`, `src/` or
  the first take's tools may change: the first hero stays exactly as it is.
- No git commands that change anything, no installs, no network, no deploy, no reviewer agents. The review happens elsewhere.
- No agent names, no contact details, no real logos of Lennard or of the building. App logos stay as they are drawn today.
- The motion's own rules in `MOTION.md` hold: things cut or wipe, nothing fades or is see-through, nothing bounces, the same
  object moves and is never respawned, one cursor does all the work, and only the three `EASE` curves are used.
- When a document is finished, just before its Export click, the screen must look exactly like today's still of that app,
  apart from the changes this file names. The approved design is the destination; this pass is about how it gets there.

## Order of work, and the clock

This is a large pass. Note the time when you start, and build in this order, keeping `tools/checks.mjs` clean and the player
running after every stage:

1. The shared actions below, the centring, and exports that play (Premiere Pro, After Effects, Figma).
2. Photoshop. 3. Premiere Pro. 4. After Effects. 5. Figma. 6. InDesign. 7. Illustrator.

If about 60 minutes have passed and stages remain, stop there: leave the remaining apps as they are today (they must still
run, with the centred floor), and say plainly in your report which stages are done and which are not.

## How things get made: the actions

Write each scene as a script: an ordered list of actions with their own lengths, laid end to end by one small helper that
works out every start time. Do not hand-write absolute times. Put one number, `PACE`, near the top of `stage.mjs` that scales
every action and every cursor move (1 is this brief), so the whole loop can be made brisker or easier later.

Before an action the cursor travels to where it starts, with `EASE.wipe`: 0.12 s for under 0.5 screen units, 0.2 s up to 1.5,
0.28 s beyond. Tools change by keyboard: the lit tool in the rail cuts to the right one as the action begins, and the cursor
does not travel to the rail.

| Action | What happens |
| --- | --- |
| **click** | The cursor presses for 0.05 s. What the click makes cuts in on the press. |
| **draw** | The cursor presses at the shape's top left corner and drags to its bottom right. The shape's own rectangle follows the cursor, so it grows from the corner. Frames and artboards are drawn empty, as an outline or a flat plate, and get their content afterwards: a picture is never stretched. |
| **type** | The cursor clicks where the text starts and rests there. The text appears one character at a time, in equal steps, with a caret at the edge: a bar as tall as the text, 0.012 wide, in the text's own colour. The caret cuts out when the typing ends. Speed: 0.035 s a character, and never more than 0.6 s for one text. Type in the direction the text reads, so upright text is typed upward. |
| **stroke** | The pen's point runs along the line and the line is revealed behind it. |
| **run** | Several like things cut in one at a time, in reading order, 0.07 s apart, while the cursor runs along them. This is step and repeat, or paste. Use it for the small pieces: markers, blocks, pins, small labels, layer rows. |
| **drag** | The cursor presses on a thing, carries that same piece, lifted, and lets go at its place. Its rectangle and its window go from the source's to the target's. Things come from a bin, a panel or the dock, never from nowhere. |
| **slide** | The cursor drags a slider's handle or a graph's handle, and what it controls follows. |
| **set** | A whole-picture change that cannot wipe (levels, a fill, a style) cuts in hard steps, each on a click or on letting go. |
| **play** | The cursor clicks play. The playhead runs at constant speed and the viewer shows the piece. |
| **export** | As today: the cursor goes to Export, the button sinks, its progress fills, and the work feeds out of the line or goes to the dock. |

How to show a piece being built from a picture: either draw the picture's stages as pictures of their own (the artboard with
only the street, then with its markers, then with its type) and reveal each stage over the one before, or reveal regions of
the finished picture one after another. Either way the finished piece must match today's picture exactly, and small type
must not go through the alpha test (`cut`), because it turns ragged. Keep the atlas to at most six pages of 2048 × 2048.

An app's own furniture still arrives with the opening wipe: its tool rail, its panels' frames and titles, empty lanes,
swatches. What belongs to the document does not: layers, pages, bin items, clips, captions, keys, layer rows, properties,
artboards, frames, and everything on the canvas. Those start empty and are made.

## Where the exported work lies

Centre each exported group under the screen as the home camera sees it: the middle of the group's footprint on the floor and
the middle of the screen's face must have the same `dot(HOME.r, p)`. The groups are InDesign's block (the stack, the phone,
the tablet and the room the open copy takes) and the row of three screens for Premiere Pro, After Effects and Figma. The two
groups are not equally deep, so each gets its own place along x. Keep the back edge where it is (`MAT.z`), keep the sizes
and gaps, keep the feed out of the line and the way it is taken back. Centre the floor's pool of light under the same
middle. `tools/checks.mjs` must check the centring.

## Exports that play

From the moment a device lands until the row is taken back, it plays the finished piece on a loop: two plays, 1.6 s each,
the same clock on all three devices and on the big screen, whose viewer and playhead run again while the devices play.

- Keep each device's own chrome (its frame, its bars, its feed around the post) as a picture. Make the picture area inside
  it out of pieces, with the same function that draws the piece in the big screen's viewer or comp, laid out for that
  device's shape. A progress line on the device grows with the play.
- **Video:** the edit as cut: the three shots, their captions, the wipe between the first two, the effect on the third.
- **Motion:** the animation as it plays in the comp: the words wipe on, the ball runs its path with its ease, the rows
  slide in. Each device keeps the layout its picture has today.
- **UX/UI:** the prototype in use. On the phones a tap mark (a `paper` dot, 0.05 across) cuts in on the hot spot, then
  the screen wipes to the linked screen with an upright line; 0.8 s later a tap takes it back. The two phones start on
  different screens and swap at the same moments. On the desktop screen the craft list's marker steps through the four
  crafts, one each 0.4 s, and the little screen in the design cuts to another tone with each step. On the big screen a
  `paper` bead runs along the red link each time a tap fires.

## The six scenes

Lengths are targets for the whole scene, cursor moves included. If a scene runs long, speed its runs and its typing first.
Never drop a step. The loop should come to between 68 and 76 seconds at `PACE` 1. The first 0.5 s of every scene is still the change of
shell, then the app's furniture wipes on in 0.3 s; the last 0.3 s is still the content wiping off.

### Photoshop (8 to 9 s): a photo edit, start to finish

New pictures of the same photo, made from today's drawing: **raw** (about a fifth darker and duller, a flat pale grey sky,
and two distractions: a traffic cone with a barrier on the pavement in the lower left quarter, and a crane's arm crossing the
sky in the upper right), **levelled** (raw at today's brightness), **sky** (levelled, with today's sky), **clean** (today's
ungraded photo) and today's graded photo. A dark histogram, bunched to the left, beside today's.

1. **click** the empty canvas: the raw photo opens, wiping on left to right in 0.3 s. A layer row appears. The histogram
   shows the dark one.
2. **slide** the two levels sliders, 0.35 s each. On letting go of the first the photo cuts half way to levelled, on the
   second all the way, and the histogram cuts to today's. A "levels" row appears in the layers.
3. **click** the sky with the wand: today's sky wipes across the sky, left to right, 0.5 s. A row appears.
4. **click** the cone, then the crane, with the healing brush (the cursor wears a `paper` ring 0.14 across while this tool is
   lit). Each cuts out on its click: a patch of the clean photo over that spot. A row appears.
5. **slide** the grade across, as today: the split goes from the photo's right edge to its left in 1.1 s, with today's two
   sliders, and its bar shrinks away.
6. **export**: the photo goes to the dock, as today.

### Illustrator (9 to 10.5 s): two maps, drawn

1. **draw** the upper artboard, then the lower one, 0.3 s each.
2. Amenities map, on the upper artboard, layer by layer in the order a designer would draw it: **stroke** the street
   (0.5 s); **run** the markers along it; **type** the labels as one text along the map, then the title; **draw** the badge.
3. Location map, on the lower artboard: **draw** the first city block, **run** the rest; **stroke** the main streets and the
   coloured line (0.5 s); **run** the pins and badges; **type** the labels as one text.
4. The close-up, as today: the marquee drags a frame, the close-up comes out of it, the pen **strokes** the subway line and
   its handles cut in.
5. **export**: the selection cuts out, the close-up goes back, and both artboards go to the dock one after the other, each
   carried by the cursor.

### InDesign (13.5 to 15 s): a document from nothing

1. **draw** four frames with the frame tool, 0.3 s each: the spread, the cover, the post, the e-blast. Each is today's empty
   frame with its diagonals.
2. **drag** the amenities map from the dock into the spread, as today. Then **type** the spread's heading and **run** the
   rest of its type. A page appears in the pages panel.
3. **drag** the location map from the dock to the pages panel, as today, but carried by the cursor.
4. **drag** the photo from the dock into the cover's frame. **draw** the cover's blob, **type** its title. A page appears.
5. **drag** a copy of the photo from the cover into the post (the cover keeps its own), **type** its headline, **draw** its
   button. The same for the e-blast.
6. **export**: the block feeds out, the top copy is taken off the stack and its four leaves turn, exactly as today, and
   the block is taken back.

### Premiere Pro (13.5 to 15 s): an edit from an empty timeline

The timeline gains sound. Under each clip lies its own thin strip of voice, a waveform that moves with the clip. Below
that is a music lane: today's long waveform becomes the music, one block as long as the edit, with a level line along it,
a thin `paper` bar with square keys. Fit the caption lane, the clips, the voice and the music into the same plate.

1. **click** the bin: three shots and the music cut in as a **run**.
2. **drag** the first shot to the start of the timeline, then the second, then the third, 0.4 s each. Each lands with its
   voice strip. The viewer is dark until the first clip lands, then shows it. The second clip is dragged in too long.
3. Cut: with the blade lit, **click** the second clip where it should end. A cut line appears. With the arrow, **click** the
   offcut: it takes a red outline, then it cuts out, and the third clip and its voice slide left to close the gap (0.25 s).
4. **drag** the transition onto the first cut, and the effect onto the last clip; the wheels and sliders settle. As today.
5. Captions: with the type tool, **click** the viewer and **type** the first caption there; its block grows on the caption
   lane as it is typed. The other four blocks follow as a **run**, each with its caption cutting into the viewer.
6. Sound: **drag** the music from the bin into its lane. **slide** the middle of its level line down, so the waveform under
   it drops to about half its height where the voice speaks. **slide** the line's end down to nothing: a fade out, with
   the waveform tapering under it in hard steps.
7. **play** once, as today. Then **export**: the three screens feed out and play (see above), and are taken back.

### After Effects (12 to 13.5 s): an animation from an empty comp

1. **click**: a new comp. Its paper plate wipes on in the viewer, and the project panel gets an empty thumbnail.
2. **type** "Make it", then "move." in red. Each gets a layer row and a bar in the timeline as its typing starts.
3. **draw** the ball where its path starts, with the ellipse tool. **draw** the first row as a plate, its details cut in, and
   two copies follow as a **run**. Each gets its layer row and bar.
4. Keys: **click** the ball's row (it lights, as today), **click** its stopwatch: a key at the playhead, which is at the
   start. **drag** the playhead to where the move ends. **drag** the ball to the end of its path: the path's squares appear
   behind it one by one, and a second key appears. Then a marquee is **drawn** over the other rows and their keys cut in
   as a **run**, staggered as today.
5. **slide** the graph's handle, as today: the straight line becomes the ease.
6. **play** once, as today. Then **export**: the three screens feed out and play, and are taken back.

### Figma (12 to 13.5 s): wireframes, then designs, then the prototype

1. **draw** three frames with the frame tool, 0.3 s each: the desktop, then the two phones. Layer rows appear.
2. Wireframe the desktop: **draw** the picture's box (its cross cuts in), **type** the heading (wireframe text is grey
   bars: they grow left to right like typing), **draw** the button. The phones' pieces follow as a **run**.
3. A marquee is **drawn** over the three wireframes, and copies are **dragged** down from them, as the designs slide out
   today. The copies are wireframes at first.
4. Design them, each step on all three frames, desktop first: **set** the fill (the frames cut to ink); **drag** the hero's
   picture from the panel into the desktop's box, and it cuts into the phones; **type** the name on the desktop, and the
   phones' type cuts in; **set** the accent (the red pieces cut in).
5. Prototype, as today: the hot spot, the link dragged to the second phone, the panel filling in.
6. **export**: the three screens feed out and play the prototype, and are taken back.

## Player, tools, checks, README

- `SHOW`, `LOOP`, `sceneAt`, `frameAt`, `SCENES`, `CRAFT`, `BLOCK` keep their meanings. Each scene's `still` is a finished
  moment: Photoshop and Illustrator just before the Export click, InDesign with the leaf at 1.82 as today, the other three
  with the screens out, a third of the way through the first play.
- `play.mjs`: a craft button pressed while the player is paused shows that craft's still, not an empty shell.
- `tools/preview.mjs`: the title is "Journey hero take two".
- `tools/checks.mjs` also checks: each document is empty until its first action; the cursor is where each action needs it;
  the centring; the floor is empty outside an export; device clocks match the big screen's; `LOOP / PACE` is between 68 and 76.
- README: replace the table of scenes with the new one, with every action's start time, and list each place where a still
  now differs from the approved sheet and why.

## Done when

`node design/journey-hero/take-2/tools/checks.mjs` prints `all clean`, `tools/preview.mjs` packs, every document starts
empty and is built by the cursor in the order above, every text is typed, the exported groups are centred under the
screen, and the screens of the last three apps play. Report what you built, stage by stage, anything you could not do,
and how long it took.
