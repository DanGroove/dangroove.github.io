# Journey hero, second take

The first take (four bars that fold into four objects, now live in `public/journey/`) was judged "a little abstract and too simple".
This folder is the second take, as a prototype: each craft is a detailed object you can recognise, in real 3D with light and shadow.
Nothing here is published, and the built page does not use it yet.

## What is here

- `sq.mjs` the prototype renderer. WebGL2, no dependencies. Every piece is one superquadric: a box, a cylinder, a ball, a cone or a wedge,
  or anything between them, so one piece can change into another. One light, a shadow map, three brand tones per material.
- `kit.mjs` the helpers that make pieces (`box`, `cyl`, `ball`, `cone`, `wedge`, `stick`) and move them (`turn`, `move`).
- `objects.mjs` the four objects: graphic design, video, motion, UX/UI.
- `index.html` one object on its own. `?o=0..3` picks it, `?yaw=-25&pitch=8` turns the view.
- `stills.mjs` and `tools/sheet.mjs` the four objects in the hero's own layout, on one sheet for comments.

## Looking at it

    node design/journey-hero/tools/serve.mjs
    http://localhost:4173/design/journey-hero/take-2/?o=1

    node design/journey-hero/take-2/tools/sheet.mjs sheet.png

## What comes next

The loop: the pieces of one object rebuild into the next, and each object does one small thing (the clapper claps, the ball bounces,
the cursor clicks). Then a brief for the production build.
