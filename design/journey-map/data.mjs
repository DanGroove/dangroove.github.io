// Every fact, date, colour, label, line of copy and timing for the journey map.

// Colours
export const C = {
  ink: '#151314', paper: '#F7F6F3', red: '#F0484F', line: '#2E2B29', mid: '#4A4541',
  dim: '#9A948D', note: '#C9C4BD', land: '#1F1C1D', landEdge: '#2B2728', halo: '#1A1819',
  warm: '#FF8A4C', white: '#FFFFFF', shade: '#0D0C0D', screenBg: '#1B1819',
  posterShade: '#D9D5CD', posterRed: '#C0262E', posterCorner: '#BFBAB1', black: '#000000',
};

// Card palettes, one row per stop. Every palette value lives here.
// headline: the headline colour. mark: the place's colour wherever it sits on the Ink ground
// (lit stop mark, timeline block, mini-map). hairline: rules and empty frames on the card.
export const PALETTES = {
  hmc: { logo: 'assets/logos/hmc.png', layout: 'ground', ground: '#1E345D', text: '#FFFFFF', sub: '#B8C4DA', button: '#0D7247', buttonText: '#FFFFFF', pill: '#0D7247', pillText: '#FFFFFF', band: '#FFFFFF', headline: '#FFFFFF', mark: '#0D7247', hairline: '#B8C4DA' },
  laurier: { logo: 'assets/logos/laurier.png', layout: 'band', ground: '#330172', text: '#FFFFFF', sub: '#CFC3E0', button: '#EAA41E', buttonText: '#330172', pill: '#EAA41E', pillText: '#330172', band: '#FFFFFF', headline: '#FFFFFF', mark: '#EAA41E', hairline: '#CFC3E0' },
  mohawk: { logo: 'assets/logos/mohawk.png', layout: 'ground', ground: '#030303', text: '#F4F4F4', sub: '#A3A3A3', button: '#FB9632', buttonText: '#030303', pill: '#991030', pillText: '#FFFFFF', band: '#FFFFFF', headline: '#F4F4F4', mark: '#FB9632', hairline: '#A3A3A3' },
  interkom: { logo: 'assets/logos/interkom.png', layout: 'ground', ground: '#F7F3E2', text: '#242021', sub: '#5E5A56', button: '#E85155', buttonText: '#F7F3E2', pill: '#242021', pillText: '#F7F3E2', band: '#FFFFFF', headline: '#242021', mark: '#E85155', hairline: '#5E5A56' },
  // Lennard follows its own design system: white ground, Warm Gray 11 text, one orange idea (the headline).
  lennard: { logo: 'assets/logos/lennard.png', layout: 'ground', ground: '#FFFFFF', text: '#706259', sub: '#706259', button: '#706259', buttonText: '#FFFFFF', pill: '#F1EFEF', pillText: '#706259', band: '#FFFFFF', headline: '#FF4C00', mark: '#FF4C00', hairline: '#D8D1CA' },
};

export const CRAFTS = ['Print', 'Video', 'Motion', 'Screen'];

export const PIECE_IMAGE = 'assets/hmc-report.jpg';

// Stops: real facts. spans are [start, end] as 'YYYY-MM' (end month inclusive) or 'now'.
// crafts: draft for Dan to correct.
export const STOPS = [
  { id: 'laurier', palette: 'laurier', name: 'Wilfrid Laurier University', short: 'Laurier', dates: '2016 to 2017', spans: [['2016-09', '2017-12']], track: 'school', role: 'Game Design and Development', crafts: ['Screen'], w: 0, rune: 'l',
    label: { t: 'Laurier', sub: '2016 to 2017, game design', x: 158, y: 236, a: 'middle' },
    copy: { draft: true, headline: 'Where it started.', para: 'I went to Laurier for game design. Systems, rules and play came first, before I ever chose graphic design.', took: 'Think about how someone moves through it.', piece: null, caption: '' } },
  { id: 'hmc1', palette: 'hmc', name: 'HMC Connections', short: 'HMC Connections', dates: 'Summers 2018 and 2020', spans: [['2018-04', '2018-08'], ['2020-06', '2020-08']], track: 'work', role: 'Graphic designer, video editor, web designer', crafts: ['Print', 'Video', 'Screen'], w: 7, rune: 'h',
    label: { t: 'HMC Connections', sub: 'summers 2018 and 2020', x: 466, y: 250, a: 'start' },
    copy: { draft: true, headline: 'First job, three hats.', para: 'Two summers as the student who did design, video and web at once. I designed the SafetyDrivesUs logo and built its website, plus flyers and infographics.', took: 'One person can carry a job across print, video and web.', piece: null, caption: '' } },
  { id: 'mohawk', palette: 'mohawk', name: 'Mohawk College', short: 'Mohawk', dates: '2019 to 2021', spans: [['2019-01', '2021-04']], track: 'school', role: 'Advanced Diploma, Graphic Design', crafts: ['Print', 'Screen'], w: 17, rune: 'm',
    label: { t: 'Mohawk', sub: '2019 to 2021', x: 124, y: 387, a: 'middle' },
    copy: { draft: true, headline: 'Where the craft got formal.', para: 'Type, layout and critique, every week, until the reasons behind a good page became habit.', took: 'Type first.', piece: null, caption: '' } },
  { id: 'hmc2', palette: 'hmc', name: 'HMC Connections', short: 'HMC, again', dates: '2021 to 2022', spans: [['2021-06', '2022-03']], track: 'work', role: 'Graphic designer, on contract', crafts: ['Print', 'Screen'], w: 26, rune: 'h',
    label: { t: 'HMC, again', sub: 'on contract, 2021 to 2022', x: 458, y: 322, a: 'end' },
    copy: { draft: true, headline: 'Back as the designer.', para: 'I came back on contract, redesigned hmcconnections.com, designed the 2020/2021 annual report and built the HMC anti-racism movement website.', took: 'Long documents are where a system proves itself.', piece: PIECE_IMAGE, caption: 'Annual report, 2020 to 2021' } },
  { id: 'interkom', palette: 'interkom', name: 'Interkom', short: 'Interkom', dates: 'Autumn 2022', spans: [['2022-09', '2022-12']], track: 'work', role: 'Junior graphic designer, on contract', crafts: ['Print', 'Screen'], w: 29, rune: 'i',
    label: { t: 'Interkom', sub: 'autumn 2022', x: 498, y: 468, a: 'end' },
    copy: { draft: true, headline: 'Agency pace.', para: "Four months, several clients at once: social graphics for Flato Markham Theatre, Art Windsor-Essex and JNAAG, and a redesign of Melanoma Canada's sixth edition booklet.", took: 'Switch brands without dropping the thread.', piece: null, caption: '' } },
  { id: 'lennard', palette: 'lennard', name: 'Lennard Commercial Realty', short: 'Lennard', dates: '2023 to now', spans: [['2023-10', '2024-03'], ['2024-04', '2025-07'], ['2025-07', 'now']], track: 'work', role: 'Freelance, junior, now graphic designer', crafts: ['Print', 'Video', 'Motion', 'Screen'], w: 35, rune: 'l',
    label: { t: 'Lennard', sub: '2023 to now', x: 322, y: 706, a: 'end' },
    copy: { draft: true, headline: 'All four crafts, one job.', para: 'I started freelance, came on as a junior and became the graphic designer. I design the marketing for commercial listings, edit and animate LennieTV and the monthly Deal Board, and lay out The Q.', took: 'Carry the idea from first sketch to final cut.', piece: null, caption: '', steps: ['Freelance 2023', 'Junior 2024', 'Graphic designer 2025'] } },
];

// Map geometry (600 by 900 units), ported from reference/round2.cjs
export const MAP = {
  w: 600, h: 900,
  coastA: [[108, 196], [128, 150], [200, 132], [290, 146], [380, 128], [452, 150], [492, 196], [486, 236], [460, 266], [440, 294], [470, 322], [506, 342], [524, 392], [516, 452], [548, 504], [540, 540], [498, 566], [430, 590], [345, 578], [262, 606], [178, 592], [116, 540], [84, 462], [100, 392], [72, 322], [84, 250]],
  coastB: [[196, 690], [262, 660], [340, 668], [420, 656], [476, 684], [494, 736], [462, 784], [392, 806], [300, 800], [222, 796], [182, 750]],
  waypoints: [[158, 214], [186, 222], [214, 212], [252, 228], [300, 238], [352, 228], [402, 240], [452, 262], [420, 278], [372, 272], [330, 286], [284, 272], [244, 292], [226, 326], [198, 346], [216, 362], [182, 370], [150, 372], [160, 400], [150, 428], [190, 452], [250, 470], [318, 468], [378, 452], [428, 404], [452, 362], [470, 332], [496, 372], [508, 430], [508, 490], [506, 540], [474, 598], [440, 630], [404, 662], [376, 694], [330, 720], [290, 746], [256, 768]],
  xIdx: 37, trailSeg: 8, dotGap: 5.6,
  x: [256, 768],
  well: [302, 392],
  ygg: [300, 374],
};

// Copy outside the cards
export const COPY = {
  docTitle: 'The saga so far: journey map prototype',
  heroCaption: 'The hero goes here',
  title: 'The saga so far',
  kicker: 'A MAP OF HOW I GOT HERE, 2016 TO NOW',
  cue: 'Scroll to set out',
  took: 'WHAT I TOOK WITH ME',
  caseStudy: 'See the case study',
  pieceToCome: 'Piece to come',
  count: '{n} of {t} found',
  regions: [
    { t: 'LAURIERVIK', x: 150, y: 170, rune: 'lauriervik' },
    { t: 'THE IRONWOOD', x: 318, y: 198, rune: 'the ironwood' },
    { t: 'MOHAWKFJELL', x: 140, y: 258, rune: 'mohawkfjell' },
    { t: 'THE MARGINS', x: 172, y: 540 },
    { t: 'KERNING NARROWS', x: 300, y: 636, i: 1 },
    { t: 'LENNARDGARD', x: 412, y: 768, rune: 'lennardgard' },
    { t: 'HERE BE DEADLINES', x: 486, y: 132 },
  ],
  notes: [
    { t: 'the diploma climb', x: 238, y: 356, s: 6.5 },
    { t: 'the mist of 2020', x: 104, y: 464, s: 6.5 },
    { t: 'left intentionally blank', x: 172, y: 549, s: 5.6, a: 'middle', dim: 1 },
    { t: 'the 2023 crossing', x: 470, y: 613, s: 6.3 },
    { t: 'the road not taken: game dev', x: 268, y: 172, s: 6 },
  ],
  sea: 'SEA OF REVISIONS',
  xLabel: 'X marks the work', xSub: 'case studies and everything else',
  ygg: 'YGGDRASIL', well: "URD'S WELL", wellSub: 'what was, again',
  legend: { stop: 'a stop', work: 'the work', find: 'something to play with', trail: 'the trail' },
  srMap: 'A map of how I got here, 2016 to now',
  stoneGo: 'Go to {name}, {dates}',
  miniMap: 'Mini-map. Choose a stop to jump there.',
  timeline: 'Timeline',
  timelineValue: '{name}, {dates}',
  timelineStart: 'Before the first stop',
  close: 'Close',
  flip: 'Flip it over',
  footer: {
    cta: 'Got an idea that needs carrying to the final cut?',
    talk: "Let's talk",
    name: 'Danial Endrawes',
    tagline: 'From first sketch to final cut, and everything in between.',
    links: ['Case studies', 'Work'],
    small: 'LINKEDIN / EMAIL / RESUME',
  },
};

// Finds. n is the number on the Red marker (main finds only). x, y are map units.
export const FINDS = [
  { id: 'wayfinder', n: 1, x: 92, y: 716, mark: [148, 672], label: 'The wayfinder. Pick a craft to light up the stops that used it. Arrow keys turn it, Enter on the centre clears it.' },
  { id: 'hoards', n: 2, x: 366, y: 354, mark: [382, 346], label: 'Hoards. Five buried chests, each near a stop.' },
  { id: 'ravens', n: 3, x: 456, y: 192, mark: [478, 176], label: 'Huginn and Muninn, two ravens on a standing stone. Press to play the reel.' },
  { id: 'serpent', n: 4, x: 486, y: 98, mark: [550, 74], label: 'The serpent. Poke it.' },
  { id: 'beacon', n: 5, x: 536, y: 514, mark: [558, 478], label: 'The beacon. Arrow keys aim the beam to read the notes.' },
  { id: 'runestone', n: 6, x: 250, y: 516, mark: [270, 492], label: 'The rune stone. Press to take a rubbing.' },
  { id: 'tafl', n: 0, x: 112, y: 222, label: 'A hnefatafl board. Press to move a piece.' },
  { id: 'mist', n: 0, x: 156, y: 438, label: 'The mist of 2020. Press or wipe to clear it.' },
  { id: 'horn', n: 0, x: 46, y: 476, label: 'A horn on the shore. Press to raise it.' },
  { id: 'well', n: 0, x: 302, y: 392, label: "Urd's Well. Press to undo the last thing you opened." },
  { id: 'longship', n: 0, x: 452, y: 622, label: 'The longship. Press for its line.' },
];

export const FIND_COPY = {
  crafts: ['PRINT', 'VIDEO', 'MOTION', 'SCREEN'],
  wayfinderRunes: 'print video motion screen',
  hoards: [
    { id: 'hoard-laurier', stop: 'laurier', x: 208, y: 266, title: 'Piece to come', image: null, label: 'A scratch in the ground near Laurier. Dig it up.' },
    { id: 'hoard-hmc1', stop: 'hmc1', x: 404, y: 304, title: 'SafetyDrivesUs logo and website', image: null, label: 'A scratch in the ground near HMC Connections. Dig it up.' },
    { id: 'hoard-hmc2', stop: 'hmc2', x: 366, y: 354, title: '2020/2021 annual report', image: PIECE_IMAGE, label: 'A scratch in the ground near HMC, again. Dig it up.' },
    { id: 'hoard-interkom', stop: 'interkom', x: 452, y: 558, title: 'Melanoma Canada booklet', image: null, label: 'A scratch in the ground near Interkom. Dig it up.' },
    { id: 'hoard-lennard', stop: 'lennard', x: 228, y: 728, title: '1 King Street W flyer', image: null, label: 'A scratch in the ground near Lennard. Dig it up.' },
  ],
  ravenTime: ['00:00', '00:05'],
  serpentLines: ['A deadline story goes here.', 'A deadline story goes here.', 'A deadline story goes here.'],
  serpentLeaf: ['FRI', '5 PM'],
  beaconNotes: [
    { x: 420, y: 476, rune: 'note one', t: 'A note in invisible ink goes here.' },
    { x: 424, y: 520, rune: 'note two', t: 'A note in invisible ink goes here.' },
    { x: 446, y: 562, rune: 'note three', t: 'A note in invisible ink goes here.' },
    { x: 446, y: 434, rune: 'note four', t: 'A note in invisible ink goes here.' },
  ],
  runestoneRunes: 'first sketch final cut',
  poster: { head: 'WANTED', who: 'ONE DESIGNER', line1: 'who sees a job through, from', line2: 'first sketch to final cut', reward: 'REWARD: THE WORK', stamp: 'PRINT', back: ['Stock: to come', 'The brief: to come'] },
  tafl: 'A fact from the game design year goes here.',
  horn: ['Skál.', 'A line from someone I worked with goes here.'],
  longship: '2023: Dan to write this line.',
};

// Timing. Act lengths are in viewport heights.
export const ACTS = {
  hero: 100, handoff: 120, overview: 70, pushIn: 60, hold: 130, legPerUnit: 0.45,
  footer: { rush: 80, blast: 90, settle: 70, rest: 80 },
  footerTotal: 320,
};

export const CAMERA = {
  pushScale: 3.2, pushScalePhone: 2.6, holdZoom: 1.35, holdDim: 0.35, craftDim: 0.55,
  anchorX: 0.45, anchorY: 0.55, smooth: 30, phoneMax: 640,
  footerX: [0.68, 0.3], footerXPhone: [0.66, 0.22],
};

export const HOLD = { zoomIn: [0, 0.18], zoomOut: [0.86, 1], open: [0.1, 0.32], fold: [0.72, 0.92], visited: 0.3 };

export const STARS = { count: 420, red: 0.05, dprCap: 2, drift: 0.012, parallax: 14 };

export const FIND_TIMING = { burst: 0.7, dig: 0.6, ravenLoop: 1.1, reel: 5, iris: 0.5, serpentSink: 0.9, serpentSurface: 1.0, beamSweep: 0.35, beamCone: 22, noteDelay: 0.4, carving: 1.0, unroll: 0.8, slide: 0.35, ripple: 0.9, closeScroll: 8 };
