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
  // Lennard: white logo band over orange; Warm Gray 11 is its only dark, on the pill, button and chips.
  lennard: { logo: 'assets/logos/lennard.png', layout: 'band', ground: '#FF4C00', text: '#FFFFFF', sub: '#FFFFFF', button: '#FFFFFF', buttonText: '#706259', pill: '#706259', pillText: '#FFFFFF', band: '#FFFFFF', headline: '#FFFFFF', mark: '#FF4C00', hairline: '#FFFFFF', smallWeight: 500, chip: '#FFFFFF', chipText: '#706259' },
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
  todo: 'Yours to write', countAll: 'All {t} found',
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
  ygg: 'YGGDRASIL', well: "URD'S WELL", wellSub: 'was, is, shall be',
  legend: { stop: 'a stop', work: 'the work', find: 'something to play with', trail: 'the trail' },
  srMap: 'A map of how I got here, 2016 to now',
  stoneGo: 'Go to {name}, {dates}',
  miniMap: 'Mini-map. Choose a stop to jump there.',
  timeline: 'Timeline',
  timelineValue: '{name}, {dates}',
  timelineStart: 'Before the first stop',
  close: 'Close',
  flip: 'Flip it over',
  nova: 'The supernova. Press it.',
  steps: {
    group: 'Move through the journey', start: 'Start the journey', setOut: 'Set out', next: 'Next: {name}',
    toX: 'Next: the X', dig: 'Dig here', top: 'Back to the top', back: 'Back: {name}', returnTo: 'Back to the trail',
    names: { top: 'the top', map: 'the whole map', x: 'the X', end: 'the end' },
    say: { top: 'The top of the page', map: 'The whole map', stop: 'Stop {n} of {t}: {name}, {dates}', x: 'The X', end: 'The end of the trail: contact and links' },
    review: { label: 'Preview only', steps: 'Steps', scroll: 'Scroll', depth: 'Depth' },
  },
  footer: {
    label: 'Footer',
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
  { id: 'wayfinder', n: 1, x: 92, y: 716, view: [240, 660, 150], viewPhone: [108, 716, 75, 0], mark: [148, 672], label: 'The wayfinder. Pick a craft to light up the stops that used it. Arrow keys turn it, Enter on the centre clears it.' },
  { id: 'hoards', n: 2, x: 366, y: 354, mark: [382, 346], label: 'Hoards. Five buried chests, each near a stop.' },
  { id: 'ravens', n: 3, x: 456, y: 192, view: [456, 164, 44], mark: [478, 176], label: 'Huginn and Muninn, two ravens on a standing stone. Press to send the next raven for a thought or memory.' },
  { id: 'serpent', n: 4, x: 486, y: 98, view: [430, 78, 118], mark: [550, 74], label: 'The serpent. Poke three times to feed it a deadline.' },
  { id: 'beacon', n: 5, x: 536, y: 514, view: [468, 498, 92], mark: [558, 478], label: 'The beacon. Drag or arrows aim; Enter finds the next unread note.' },
  { id: 'runestone', n: 6, x: 250, y: 516, view: [250, 500, 40], mark: [270, 492], label: 'The rune stone. Press, rub, read, then flip the sheet.' },
  { id: 'tafl', n: 0, x: 112, y: 222, view: [112, 218, 34], label: 'A hnefatafl board. Play the king to a corner.' },
  { id: 'mist', n: 0, x: 156, y: 438, view: [154, 436, 62], label: 'The mist of 2020. Press or wipe to clear it.' },
  { id: 'horn', n: 0, x: 46, y: 476, view: [46, 470, 30], label: 'A horn on the shore. Press to raise it, press again to sound it.' },
  { id: 'well', n: 0, x: 302, y: 392, view: [300, 352, 66], label: "Urd's Well. Drop a pebble in. The Norns answer." },
  { id: 'longship', n: 0, x: 452, y: 622, label: 'The longship. Pull three times to fly its pennant.' },
];

export const FIND_COPY = {
  crafts: ['PRINT', 'VIDEO', 'MOTION', 'SCREEN'],
  wayfinderRunes: 'print video motion screen',
  wayTally: '{craft}: {n} of {t} stops', wayAll: 'All four: {names}', hoardTally: 'Hoard {n} of {t}',
  huginn: 'Huginn, thought', muninn: 'Muninn, memory', ravenFrom: 'Brought back from {name}',
  reelToCome: { t: 'Reel to come', todo: 1 }, reelLabel: 'Memory reel, piece to come', rubDo: 'Rub it for me',
  serpentLeaves: [['FRI', '5 PM'], ['TODAY', 'EOD'], ['NOW', 'ASAP']], serpentFed: 'Deadline met',
  hoards: [
    { id: 'hoard-laurier', kind: 'bundle', stop: 'laurier', x: 208, y: 266, title: 'Piece to come', image: null, label: 'A scratch in the ground near Laurier. Dig three times, then open it.' },
    { id: 'hoard-hmc1', kind: 'screen', stop: 'hmc1', x: 404, y: 304, title: 'SafetyDrivesUs logo and website', image: null, label: 'A scratch in the ground near HMC Connections. Dig three times, then open it.' },
    { id: 'hoard-hmc2', kind: 'book', stop: 'hmc2', x: 366, y: 354, title: '2020/2021 annual report', image: PIECE_IMAGE, label: 'A scratch in the ground near HMC, again. Dig three times, then open it.' },
    { id: 'hoard-interkom', kind: 'book', stop: 'interkom', x: 452, y: 558, title: 'Melanoma Canada booklet', image: null, label: 'A scratch in the ground near Interkom. Dig three times, then open it.' },
    { id: 'hoard-lennard', kind: 'sheet', stop: 'lennard', x: 228, y: 728, title: '1 King Street W flyer', image: null, label: 'A scratch in the ground near Lennard. Dig three times, then open it.' },
  ],
  ravenTime: ['00:00', '00:05'],
  serpentLines: [{ t: 'A deadline story goes here.', todo: 1 }, { t: 'A deadline story goes here.', todo: 1 }, { t: 'A deadline story goes here.', todo: 1 }],
  serpentLeaf: ['FRI', '5 PM'],
  beaconNotes: [
    { x: 442, y: 418, rune: 'note one', t: { t: 'A note in invisible ink goes here.', todo: 1 } },
    { x: 413, y: 454, rune: 'note two', t: { t: 'A note in invisible ink goes here.', todo: 1 } },
    { x: 410, y: 495, rune: 'note three', t: { t: 'A note in invisible ink goes here.', todo: 1 } },
    { x: 432, y: 533, rune: 'note four', t: { t: 'A note in invisible ink goes here.', todo: 1 } },
  ],
  runestoneRunes: 'first sketch final cut',
  poster: { head: 'WANTED', who: 'ONE DESIGNER', line1: 'who sees a job through, from', line2: 'first sketch to final cut', reward: 'REWARD: THE WORK', stamp: 'PRINT', back: ['Stock: to come', 'The brief: to come'], foot: { t: 'Stock: to come. The brief: to come.', todo: 1 } },
  tafl: { t: 'A fact from the game design year goes here.', todo: 1 },
  taflYou: 'Your move. Get the king to a corner.', taflThem: 'The attackers move.', taflWin: 'The king is away.',
  taflLose: 'The king is taken.', taflDraw: 'No way through. A draw.', taflNew: 'New game',
  taflRule: 'Pieces move in straight lines. Trap a piece between two of yours to take it.',
  taflBoard: 'Brandubh. You play the king and defenders.', taflColumns: 'abcdefg',
  taflKinds: { a: 'attacker', d: 'defender', k: 'king', empty: 'empty' },
  taflCell: '{cell}, {piece}', taflMove: '{from} to {to}.', taflTaken: ' {n} taken.', taflStatus: '{move} {turn}',
  horn: ['Skál.', { t: 'A line from someone I worked with goes here.', todo: 1 }],
  norns: [['Urd', 'what was'], ['Verdandi', 'what is'], ['Skuld', 'what shall be']],
  nornKicker: '{name}, {time}', wellStop: '{name}, {dates}',
  wellNone: 'nothing yet', wellMap: 'the whole map', wellNext: 'not yet carved',
  shipLog: 'The 2023 crossing', longship: { t: '2023: Dan to write this line.', todo: 1 },
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

// Clock-driven journey. Pace and animation durations are seconds; wheel.quiet is milliseconds.
export const STEPS = {
  pace: { hero: 0.9, handoff: 2.8, overview: 0.8, pushIn: 1.6, holdIn: 1.0, holdOpen: 0.4, holdOut: 0.6,
    legBase: 0.8, legPerVh: 0.006, legMax: 2.4, legX: 1.2, rush: 1.3, blast: 1.6, settle: 1.3 },
  ramp: 0.35, back: 0.6, hurry: 0.3, minMove: 0.3, cut: [0.18, 0.32],
  wheel: { min: 24, quiet: 180 }, swipe: { min: 48, slope: 1.5 }, nav: { h: 44, gap: 14, bar: 52 },
  frameMax: 0.05, reveal: 0.3,
};

export const STARS = { count: 420, red: 0.05, dprCap: 2, drift: 0.012, parallax: 14,
  sky: 300, skyShare: 0.38, skyLook: 0.5, skyFollow: 0.04, twinkle: 0.35, skyPush: 26,
  skyReserve: 200, skyMargin: 10, skyEdge: 14, skyShock: 90, skyF: [0.5, 1.6], skyMove: [0, 0.3], skyCover: [0.25, 0.75],
  skySeed: 157, fieldZ: [0.25, 1], fieldR: [0.5, 1.6], fieldAlpha: [0.35, 0.95],
};

// All new depth geometry, drawing paths and tuning values. Random identities are unit samples;
// the renderers turn them into these live ranges on each frame.
export const DEPTH = {
  base: 0.045, gain: 0.55, look: 26, lookEase: 0.22, idleFps: 12, arc: 0.26, arcLen: 160,
  minK: 0.05, epsilon: 0.01, seed: 137, dpr: 2,
  fade: { sea: [0.2, 0.7], blast: [0, 0.45] },
  frame: { inner: [22, 22, 578, 878], outer: [14.5, 14.5, 585.5, 885.5] },
  rings: { on: 1, scale: [1.05, 1.10, 1.16], a: [-0.12, -0.24, -0.36], alpha: [0.55, 0.36, 0.2], colour: 'mid', width: 1, dash: [2, 5] },
  outer: { on: 1, cell: [66, 48], fill: 0.8, alpha: [0.5, 0.2], fade: 420, rays: 0.1,
    area: [-1000, -200, 1600, 1100], jitter: 0.8, width: 0.7, wave: [2.5, -3, 5], waveCount: 3, origin: [92, 716], n: 16, angle: 0.2, reach: 1600 },
  light: { on: 1, dark: 0.45, darkPhone: 0.25, r: 0.55, core: 0.35, ptrR: 0.3, ptrCore: 0.3, amb: 0.35, card: 0.6, visit: 0.35, rush: [0, 0.5] },
  field: { area: [-100, -50, 700, 950], wrapFade: 60, sprite: 128, spriteMid: 0.4, spriteAlpha: 0.5 },
  mist: { on: 1, n: 120, nPhone: 60, a: [0.5, 1.8], r: [14, 36], stretch: [2.2, 3.4], turn: 0.2, alpha: [0.06, 0.14], near: [0.12, 0.42], thin: 0.35, show: [1.1, 1.3], pass: [2.4, 3.4], wind: 2.2 },
  deck: { on: 1, n: 60, nPhone: 34, a: [6.5, 11], r: [50, 120], stretch: [1.6, 2.6], alpha: 0.07, boost: 6, show: [1.6, 1.9], peak: [1.8, 2.3], pass: [2.3, 3.0] },
  clouds: { on: 1, show: [0.3, 0.8], pass: [2.0, 2.9], sway: [14, 26], period: [50, 90], low: 2,
    list: [[-150, 150, 1.5, 3, 1, 7.0], [-250, 520, 1.1, 1, -1, 6.4], [-90, 800, 0.9, 2, 1, 7.6], [760, 110, 1.2, 1, 1, 6.8], [860, 430, 1.6, 3, -1, 7.4],
      [720, 760, 1.0, 2, -1, 6.2], [30, 330, 0.8, 2, 1, 8.2], [575, 690, 0.8, 2, -1, 8.0], [300, -30, 1.3, 3, 1, 7.2], [330, 935, 1.2, 1, -1, 6.6],
      [-62, 150, 0.42, 2, 1, 0.5], [-96, 300, 0.5, 1, -1, 0.7], [-58, 452, 0.38, 2, -1, 0.4], [-104, 610, 0.5, 3, 1, 0.6], [-64, 770, 0.4, 1, 1, 0.5],
      [662, 120, 0.44, 1, -1, 0.6], [700, 270, 0.4, 2, 1, 0.4], [668, 420, 0.5, 3, -1, 0.7], [706, 570, 0.4, 2, -1, 0.5], [666, 730, 0.46, 1, 1, 0.6]] },
  dust: { on: 1, n: 240, nPhone: 120, tile: [800, 600], a: [-0.85, -0.2], r: [0.5, 1.1], alpha: [0.25, 0.75], show: [0.12, 0.4] },
  ravens: { on: 1, a: 2.2, size: 0.65, legs: [2, 4], from: 0.12, to: 0.88, side: 90, gap: 26, flap: 0.9, fold: 0.62, ramp: 0.1 },
  card: { tilt: 14, ptrTilt: [2.2, 1.6], shift: 8, shadow: 0.5, drop: 18, ease: 0.12,
    perspective: 1100, open: [0.1, 0.9], flat: 0.01, shadowShare: 3, blur: 28, spread: 10, radius: 14 },
  // Section 6 gives the sky one pointer gain. Both review names tune that same gain.
  foot: { get stars() { return STARS.skyLook; }, set stars(value) { STARS.skyLook = value; }, lobes: 0.25, text: 0.15 },
  review: { rule: 1, gap: 6 },
  drawings: {
    clouds: [
      ['M-52 12Q-64 12 -62 2Q-62 -9 -48 -9Q-46 -23 -29 -22Q-21 -35 -4 -30Q8 -41 23 -30Q38 -33 43 -18Q58 -17 56 -3Q62 10 50 12Z', 'M-34 -5Q-26 -14 -15 -8M5 -15Q15 -23 26 -14M-8 3Q0 -3 9 2', 'M-78 20H-36M-24 26H34M48 20H80'],
      ['M-40 10Q-52 10 -50 0Q-50 -10 -37 -9Q-34 -24 -17 -21Q-8 -33 8 -25Q22 -30 29 -16Q44 -16 42 -2Q46 10 36 10Z', 'M-24 -6Q-16 -14 -6 -8M8 -12Q16 -18 24 -11', 'M-62 18H-22M-10 23H30M40 17H64'],
      ['M-70 12Q-82 12 -80 3Q-79 -7 -66 -6Q-64 -19 -48 -17Q-40 -31 -23 -25Q-12 -38 5 -30Q18 -42 34 -31Q48 -35 54 -21Q68 -22 69 -9Q82 -8 80 3Q82 12 72 12Z', 'M-52 -3Q-44 -12 -33 -6M-12 -14Q-3 -23 9 -15M30 -16Q39 -23 48 -15M-22 4Q-13 -3 -3 3M20 2Q28 -4 37 2', 'M-98 20H-52M-40 27H42M56 20H100'],
    ],
    raven: { wing: 'M1.6 -3.4Q9.9 -10 19 -7.4L25.5 -4.6L21.4 -3.8L24.5 -1.8L20.1 -1.7L22.1 .4L17.2 -.2Q9.9 2.2 1.6 2.6Z', tail: 'M-1.7 6L-3.3 11.6L-1.1 10.7L0 13.2L1.1 10.7L3.3 11.6L1.7 6Z', body: 'M0 -10Q2.7 -7 2.2 -1Q2.4 5 0 8Q-2.4 5 -2.2 -1Q-2.7 -7 0 -10Z', beak: 'M-.8 -9.4L0 -13.2L.8 -9.4Z' },
  },
};

export const NOVA = {
  pulse: [2.6, 0.12, 0.9, 0.06], spike: [1.7, 0.2, 3.14], glow: [4.2, 0.07],
  rays: { n: 22, len: [4, 12], alpha: [0.3, 0.7], turn: 0.12, start: 1.1, width: 1, breathe: 0.7, period: [1.2, 3.2], peak: 0.16 },
  lobes: { n: 6, nPhone: 4, r: [120, 260], orbit: [40, 170], speed: [0.12, 0.3], alpha: [0.22, 0.42], breathe: 0.2 },
  waves: { n: 4, every: 2.2, reach: 0.7, alpha: 0.42, width: 1 },
  shells: [6, -4], shellDash: [2, 10],
  orbit: 0.06, embers: { n: 40, nPhone: 20, life: [2.5, 5], reach: [0.16, 0.45], alpha: 1, r: [1, 2.4], slow: 3, burst: 2, fade: [0.15, 1] },
  flare: { time: 1.6, core: 0.5, kick: 0.12, hit: 70, alpha: 0.9, reach: 0.85, auto: [7, 12] },
  motionIn: [0, 1], orbitIn: [0.5, 1], seed: 149,
  base: { spikeLength: 12.7, angles: [45, -45], rushLen: 2.4, peakLen: 10, endLen: 5, spikePeak: 0.3, spikeEnd: 58,
    thin: [1, 0.55, 0.8, 0.5], heat: [0.05, 0.7], redOut: [0.2, 0.9],
    redGlow: [220, 1.1, 0.62, 0.58], glowPeak: 0.4, glowAspect: 0.82, rushGlowAlpha: 0.6,
    orangeGlow: [120, 300], orangeAlpha: 0.9, core: [90, 60, 0.5, 70],
    ringStart: 30, ringReach: 0.75, ringFade: [0.2, 0.9], ringAlpha: [0.9, 0.35],
    streak: [20, 0.09], streakIn: [0, 0.06], streakOut: [0.25, 0.7],
    shellIn: [0.2, 0.8], shellR: [200, 330], shellPhone: [120, 190], shellAlpha: [0.3, 0.14],
    textIn: [0.4, 0.62], textGap: 0.1, textRise: 24, textShow: 0.3, digHit: 26, hitTolerance: 0.5,
    starInner: 60, starReach: 0.55, starAspect: 0.85, starBlast: 0.7, starSpeed: [0.3, 0.7],
  },
};

export const FIND_TIMING = { burst: 0.7, dig: 0.6, ravenLoop: 1.1, reel: 5, iris: 0.5, serpentSink: 0.9, serpentSurface: 1.0, beamSweep: 0.35, beamCone: 22, noteDelay: 0.4, carving: 1.0, unroll: 0.8, slide: 0.35, ripple: 0.9, closeScroll: 8 };

// Part A live tuning. Geometry, copy, dimensions and clocks are read by the find kit.
export const FIND_PLAY = {
  fresh: 3, seed: 171,
  focus: { fill: 0.72, least: 0.85, most: 3, at: [0.5, 0.46], in: 0.7, out: 0.5, swap: 0.6, chest: [0, -16, 30], ship: [0, -10, 34], wide: [300, 450, 330, 0] },
  bits: { pool: 96, starSize: 2.2, puffAlpha: 0.22,
    kinds: { dot: ['M-.8 0a.8 .8 0 1 0 1.6 0a.8 .8 0 1 0 -1.6 0Z', 'pf'], clod: ['M-1.4 .6L-.6 -1.1L1.2 -.7L1.5 .8L-.2 1.3Z', 'g'], drop: ['M0 -1.6Q1.1 .2 0 1.1Q-1.1 .2 0 -1.6Z', 'pf'], spark: ['M0 0V-2.4', 'l'], feather: ['M0 -3Q1.5 0 0 3Q-1.5 0 0 -3Z', 'g'], puff: ['M-3.2 0a3.2 3.2 0 1 0 6.4 0a3.2 3.2 0 1 0 -6.4 0Z', 'pf'], ring: ['M-3 0a3 1 0 1 0 6 0a3 1 0 1 0 -6 0Z', 't'] },
    base: { speed: [0, 0], dir: [-90, -90], g: 0, drag: 0, life: [0.6, 0.6], size: [1, 1], spin: 0, alpha: 1 },
    clods: { speed: [18, 34], dir: [-150, -30], g: 90, life: [0.6, 0.6], spin: 80 },
    puffs: { speed: [3, 7], dir: [-160, -20], life: [0.6, 0.6], size: [0.4, 1.5], alpha: 0.22 },
    feathers: { speed: [2, 6], dir: [20, 160], g: 12, drag: 2, life: [1.4, 1.4], spin: 25 },
    stars: { speed: [6, 12], dir: [-120, -60], life: [1.1, 1.1], size: [1, 0.2], spin: 20 },
    drops: { speed: [8, 18], dir: [-140, -40], g: 60, life: [0.5, 0.7] },
    wake: { speed: [0, 0], life: [0.6, 0.6], size: [1, 3.5], alpha: 0.7 },
    sparks: { speed: [10, 10], dir: [-100, -80], life: [1.2, 1.2], size: [1, 0.2] },
    hop: { speed: [8, 8], dir: [-100, -80], g: 40, life: [0.4, 0.4] },
  },
  star: { time: 0.75, arc: 46, bump: 0.3, size: 14, peak: 1.3 },
  kit: { margin: 40, rad: 70, shipY: 5, starZ: 7, dt: 0.05, popup: { scale: 0.6, over: 1.08, time: 0.22, edge: 8, tail: [10, 6], width: 240, radius: 10, pad: [10, 14], font: 13, line: 1.4, kicker: 9.5, gap: 4 }, slot: { font: 11, weight: 500, border: 1, pad: 6 }, target: 17, sheet: { from: 0.06, edge: 24, grow: 0.35, offset: 20 }, deg: 180, turn: 360 },
  way: { stiff: 90, damp: 9, near: 70, line: 0.45, gap: 0.1, short: 9, ping: 0.5, runes: 0.6, spin: 0.8, timelineDim: 0.35, lineWidth: 1, wide: [300, 480, 250, 0],
    drift: [0.8, 4, 0.31, 2], dim: 0.55, armWidth: 2.2, pulse: [1.12, 0.25], dash: [2, 4], alpha: 0.6, solidAlpha: 0.9, pingR: [6, 14], pingAlpha: 0.7, tally: [22, 5.2, 1, 10.5, 9], ring: [4, 9, 1.6], allSpeed: 40, hub: 6,
  },
  hoard: { hole: [12, 20, 27], rise: 0.28, over: 1.6, repeat: 0.3, rattle: 0.36, openHold: 0.3, near: 26, glint: [5, 8],
    scale: 0.3, travel: 60, holeRatio: 0.28, pile: [0.5, 0.75, 1], scratchWidth: 1.6, glintAt: [0, -4], glintSize: 5, glintTime: 0.5, glintTurn: 45, clods: 7, puffs: 2, rattleAngle: 4, rattleCycles: 3, lidPivot: [30, -34], lidAngle: -32, lidLift: -6, lidTime: 0.25, lidOver: 1.7, glowTime: 0.3, glowPeak: 1, glowRest: 0.6, glowKept: 0.35, stars: 6, burstTravel: [48, 34], burstLift: 14, anchor: 18, width: 260, top: 3, icon: 64, iconBox: [-32, -32, 64, 64], rad: 35, scratchHop: 2, hopClods: 2,
    pilePath: 'M14 2q6 -10 13 0z',
  },
  raven: { near: 30, shy: 3, preen: [6, 10], out: 0.9, away: 0.5, back: 0.9, reach: 150, rise: 1.4, flap: 5, land: 0.15, loop: 1.2,
    headAt: [5, -9], wingNearX: 2, scale: 0.72, birdScale: 0.85, perches: [[-5.5, -34], [6, -33.5]], popupAt: 52, attend: 120, bend: 26, fade: 0.65, tilt: 25, squash: 0.85, preenAngle: 70, preenTime: 0.5, ruffle: [1.1, 0.3], headLimit: 35, headEase: 6, idle: [0.7, 0.43], feathers: 2, hearReach: 40, wingNear: [1, -0.5], wingFar: [0.9, -0.45], wingY: -3.5, strip: [4, 1.6], frame: [4, 3], beak: [15, -2], tallyAlpha: 0.9,
    tally: ['M13 -8V-1', 'M15.5 -8V-1', 'M18 -8V-1', 'M20.5 -8V-1', 'M11.5 -2.5L22 -6.5', 'M24.5 -8V-1'],
    fly: ['M-2 -3Q-4 -17 5 -22L4.5 -17L8.5 -17.5L6 -13L9.5 -12.5Q5 -6 2 -3.5Z', 'M-11 -1L-19 -4.5L-20 -.5L-18.5 3L-11 1.5Z', 'M-12 0Q-6 -5.5 3 -5.5Q8 -5.5 10.5 -3.5L15 -2L10.5 -.8Q6 3 -3 2.2Q-9 2 -12 0Z', 'M0 -3.5Q1 -18 12 -23L10.5 -17.8L15 -18L11.5 -13.5L15 -12.5L11 -9.5Q7 -4.5 4.5 -2.5Z'], eye: [8.6, -3.4, 0.5],
    reel: { ringSvg: '<svg class="ring" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16"/><circle class="ring-p" cx="20" cy="20" r="16" pathLength="100" stroke-dasharray="100 100"/></svg>', timeJoin: ' / ', iris: 440, width: 360, ratio: [16, 11], motion: [1.3, 0.4, 2, 60, 1.1, 0.3, 22, 40], ring: 100, tc: '00:0{n} / {end}', labelTop: 12, slotBottom: 36 },
  },
  serpent: { spots: [[486, 98], [372, 84], [470, 56]], bob: [1.6, 3.2], near: 34, tongue: [0.25, 0.7], flinch: 0.12,
    swim: [0.9, 0.65, 0.45], speed: [1, 0.8, 0.6], bulge: 14, gulp: [0.14, 0.26, 1.18], settle: 6, breathe: [0.8, 4.8], wake: 0.2,
    scale: 0.52, bounds: [-114, -60, 118, 44], head: [-86, -42], pivot: [-72, -40], attend: 140, headLimit: 25, headEase: 5, rear: 18, sink: 34, sinkStep: 0.12, sinkTime: 0.35, surfStep: 0.08, surfTime: 0.5, wakeGap: 0.06, drops: 4, flutter: [6, 3], eatWait: 0.5, eatTime: 0.3, leaf: [-104, -40, 8], restAngle: 10, hear: [25, 0.5, 1], popup: [-60, -70],
    tonguePath: 'M-101 -40l-8 1.5M-109 -38.5l-3.5 -2.5M-109 -38.5l-3 3', shutPath: 'M-86.2 -43q2.2 1.8 4.4 0', snout: [-101, -40],
  },
  beacon: { rad: 200, read: 1.2, flame: [1, 1.3, 1.6, 1.9, 2.3], leap: [3, 0.3], embers: 1.5, turn: 30, reach: 1.4, idle: 0.7, snap: 0.4,
    scale: 0.6, origin: [0, -50], flameFoot: [0, -47], glowR: 16, glowAlpha: 0.15, flicker: [0.08, 11, 0.05, 17.3, 0.12, 13.1], baseAngle: 176, sweep: 36, baseReach: 230, manual: 6, arrow: 6, slop: 6, notePhone: 1.7, soft: 4, wedgeSteps: 32, rest: 0.55, sparkN: 6, burstN: 14, noteScale: 1.12, flash: 0.3, hear: [0.6, 0.3, 1.3, 0.3], englishEase: 5, noteEase: 6, noteFont: 4.6, todoFont: 3.4, runeY: -7, lineY: 7, todoY: 1, runeSize: 4.2,
  },
  rune: { carving: 0.6, grow: 0.4, r: 34, step: 12, grid: [5, 7], done: 0.8, auto: [1.2, 1.6, 7], fill: 0.25,
    letter: [0.05, 0.18], stamp: [0.45, 0.12, 2.4], shake: [3, 0.16], tilt: 5, close: 0.3,
    width: 300, height: 400, outline: 'M40 392L28 150Q36 34 150 12Q264 34 272 156L260 392Z', outer: 'M60 380L50 152Q57 56 150 34Q243 56 250 158L240 380', inner: 'M74 380L64 154Q70 70 150 50Q230 70 236 160L226 380', feet: 'M60 380H74M226 380H240', dot: [67, 372, 2.2],
    hatch: [[-200, 520, 7, 231, 2.6, 0.42], [-100, 420, 11, 107, 1.6, 0.3]], jitter: 2, charcoal: 0.34, guide: 0.1, outlineAlpha: 0.45, outlineWidth: 1.5, carvingWidth: 4.4, maskCore: 0.6, runeHeight: 30, runeGap: 0.32, tops: [92, 158, 224, 290], cx: 150, cells: [40, 30, 260, 390], cellR: 30, letterSize: 13, letterWeight: 800, letterDown: 15, letterRise: 4, near: 24, dash: [6, 200], dashTime: 1.5, scale: 0.55, anchor: -20, stampAngle: -14, flipTime: 0.6, perspective: 1400, controlTop: 214,
  },
  drawings: {
    wayfinder: `<circle class="hit" r="58"/><circle class="o" r="42"/><circle class="t" r="34.4"/><g class="wf-runes"><path class="rn" transform="rotate(8) translate(-0.7 -40.5)" d="M0 0L0 4.6M0 0L1.4 1.2M1.4 1.2L0.8 1.7M0 4.6L1.4 3.5M1.4 3.5L0.8 2.9"/><path class="rn" transform="rotate(24.4) translate(-0.7 -40.5)" d="M0 4.6L0 0L1.4 1.2L0 2.3L1.4 4.6"/><path class="rn" transform="rotate(40.7) translate(0 -40.5)" d="M0 0L0 4.6"/><path class="rn" transform="rotate(57.1) translate(-0.7 -40.5)" d="M0.7 0L0.7 4.6M0 1.7L1.4 2.9"/><path class="rn" transform="rotate(73.5) translate(-0.7 -40.5)" d="M0.7 0L0.7 4.6M0 1.2L0.7 0L1.4 1.2"/><path class="rn" transform="rotate(89.8) translate(-0.7 -40.5)" d="M0 4.6L0 0L1.4 1.2L0 2.3"/><path class="rn" transform="rotate(106.2) translate(0 -40.5)" d="M0 0L0 4.6"/><path class="rn" transform="rotate(122.5) translate(-0.7 -40.5)" d="M0 0L0 4.6L1.4 0L1.4 4.6L0 0"/><path class="rn" transform="rotate(138.9) translate(-0.7 -40.5)" d="M0 4.6L0 0L0.7 1.2L1.4 0L1.4 4.6"/><path class="rn" transform="rotate(155.3) translate(-0.7 -40.5)" d="M0 4.6L1.4 2.3L0.7 0.9L0 2.3L1.4 4.6"/><path class="rn" transform="rotate(171.6) translate(-0.7 -40.5)" d="M0 4.6L0 0L1.4 1.7M1.4 4.6L1.4 0L0 1.7"/><path class="rn" transform="rotate(188) translate(-0.7 -40.5)" d="M0 4.6L1.4 2.3L0.7 0.9L0 2.3L1.4 4.6"/><path class="rn" transform="rotate(204.4) translate(-0.7 -40.5)" d="M0.7 0L0.7 4.6M0 1.2L0.7 0L1.4 1.2"/><path class="rn" transform="rotate(220.7) translate(0 -40.5)" d="M0 0L0 4.6"/><path class="rn" transform="rotate(237.1) translate(-0.7 -40.5)" d="M0 4.6L1.4 2.3L0.7 0.9L0 2.3L1.4 4.6"/><path class="rn" transform="rotate(253.5) translate(-0.7 -40.5)" d="M0.7 0L0.7 4.6M0 1.7L1.4 2.9"/><path class="rn" transform="rotate(269.8) translate(-0.7 -40.5)" d="M1.4 0L0 1.7L1.4 2.9L0 4.6"/><path class="rn" transform="rotate(286.2) translate(-0.6 -40.5)" d="M1.3 0L0 1.2L1.3 2.3"/><path class="rn" transform="rotate(302.5) translate(-0.7 -40.5)" d="M0 4.6L0 0L1.4 1.2L0 2.3L1.4 4.6"/><path class="rn" transform="rotate(318.9) translate(-0.7 -40.5)" d="M0 4.6L0 0L0.7 1.2L1.4 0L1.4 4.6"/><path class="rn" transform="rotate(335.3) translate(-0.7 -40.5)" d="M0 4.6L0 0L0.7 1.2L1.4 0L1.4 4.6"/><path class="rn" transform="rotate(351.6) translate(-0.7 -40.5)" d="M0.7 0L0.7 4.6M0 1.7L1.4 2.9"/></g><g class="wf-arm" data-i="0" transform="rotate(0)"><path class="l" d="M0 0V-31.08M0 -31.08l-4 -4M0 -31.08l4 -4M0 -31.08v-5"/></g><g class="wf-arm" data-i="1" transform="rotate(90)"><path class="l" d="M0 0V-31.08M0 -34.08m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/></g><g class="wf-arm" data-i="2" transform="rotate(180)"><path class="l" d="M0 0V-31.08M-4 -27.08L0 -33.08L4 -27.08"/></g><g class="wf-arm" data-i="3" transform="rotate(270)"><path class="l" d="M0 0V-31.08M-5 -31.08H5M-3 -35.08H3"/></g><g transform="rotate(45)"><path class="l" d="M0 0V-17.64M0 -17.64l-3 -3"/></g><g transform="rotate(135)"><path class="l" d="M0 0V-17.64M0 -17.64l3 -3"/></g><g transform="rotate(225)"><path class="l" d="M0 0V-17.64M-3 -17.64H3"/></g><g transform="rotate(315)"><path class="l" d="M0 0V-17.64M0 -17.64m-1.5 -2a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0"/></g><text x="0" y="-48" font-size="6.5" fill="${C.paper}" font-weight="700" text-anchor="middle" letter-spacing="1.2" class="wf-word h">${FIND_COPY.crafts[0]}</text><text x="49" y="2.5" font-size="6.5" fill="${C.paper}" font-weight="700" text-anchor="start" letter-spacing="1.2" class="wf-word h">${FIND_COPY.crafts[1]}</text><text x="0" y="54" font-size="6.5" fill="${C.paper}" font-weight="700" text-anchor="middle" letter-spacing="1.2" class="wf-word h">${FIND_COPY.crafts[2]}</text><text x="-49" y="2.5" font-size="6.5" fill="${C.paper}" font-weight="700" text-anchor="end" letter-spacing="1.2" class="wf-word h">${FIND_COPY.crafts[3]}</text><g class="wf-needle"><path class="pf" d="M0 -26L3 0L-3 0Z"/><path class="o" d="M0 26L3 0L-3 0Z"/></g><circle class="o wf-hub" r="3.4"/><circle class="t wf-all" r="{{way.ring.0}}" opacity="0"/><text x="0" y="64" font-size="{{way.tally.1}}" fill="${C.note}" font-weight="500" text-anchor="middle" letter-spacing="{{way.tally.2}}" class="wf-tally"></text>`,
    hoard: `<rect class="hit" x="-40" y="-60" width="80" height="72"/><path class="l hd-scratch" d="M-12 -6l14 8M2 -6l-14 8M-24 2l-3 -6M-20 2l1 -7M14 2l3 -6M20 2l-1 -6"/><ellipse class="o hd-hole" rx="0" ry="0"/><path class="g hd-pile" d="{{hoard.pilePath}}" opacity="0"/><path class="pf hd-glint" d="{{hoard.glintPath}}" opacity="0"/><circle class="hd-glow" cx="0" cy="-20" r="46" fill="url(#litGlow)" opacity="0"/><g clip-path="url(#hclip)"><g class="hd-chest" transform="translate(0 60)"><rect class="g" x="-30" y="-34" width="60" height="34" rx="2"/><path class="t" d="M-18 -34V0M18 -34V0M-30 -22H30"/><rect class="pf" x="-4.5" y="-27" width="9" height="10" rx="1.5"/><g class="hd-lid"><path class="g" d="M-30 -34Q0 -56 30 -34Z"/><path class="t" d="M-18 -42V-34M18 -42V-34"/></g></g></g><g class="hd-stars"><path class="pf hd-star" d="M0 -50Q0 -44 6 -44Q0 -44 0 -38Q0 -44 -6 -44Q0 -44 0 -50Z" opacity="0"/><path class="pf hd-star" d="M0 -48Q0 -44 4 -44Q0 -44 0 -40Q0 -44 -4 -44Q0 -44 0 -48Z" opacity="0"/><path class="pf hd-star" d="M0 -50Q0 -44 6 -44Q0 -44 0 -38Q0 -44 -6 -44Q0 -44 0 -50Z" opacity="0"/><path class="pf hd-star" d="M0 -48Q0 -44 4 -44Q0 -44 0 -40Q0 -44 -4 -44Q0 -44 0 -48Z" opacity="0"/><path class="pf hd-star" d="M0 -50Q0 -44 6 -44Q0 -44 0 -38Q0 -44 -6 -44Q0 -44 0 -50Z" opacity="0"/><path class="pf hd-star" d="M0 -48Q0 -44 4 -44Q0 -44 0 -40Q0 -44 -4 -44Q0 -44 0 -48Z" opacity="0"/><path class="pf hd-star" d="M0 -50Q0 -44 6 -44Q0 -44 0 -38Q0 -44 -6 -44Q0 -44 0 -50Z" opacity="0"/><path class="pf hd-star" d="M0 -48Q0 -44 4 -44Q0 -44 0 -40Q0 -44 -4 -44Q0 -44 0 -48Z" opacity="0"/></g>`,
    ravens: `<rect class="hit" x="-20" y="-56" width="40" height="60"/><path class="g" d="M-9 0L-10 -24Q-7 -34 0 -35Q8 -34 10 -22L9 0Z"/><path class="rn" d="M-2.5 -26L-2.5 -20M-0.6 -26L-0.6 -20M-2.5 -23.8L-0.6 -22.3M1.3 -20L1.3 -26L3.2 -23.8M3.2 -20L3.2 -26L1.3 -23.8"/><path class="t" d="M-16 0H16"/><g class="rv-a"><g class="rv-sit"><g class="rv-body"><path class="g" d="M-11 1L-6 -2Q-3 -8 4 -8Q8 -7 7 -3Q3 1 -4 0Z"/><path class="t" d="M-4 -4Q0 -7 4 -5M0 0v2.5M2.5 0v2.5"/></g><g class="rv-head" transform="translate(5 -9)"><circle class="g" r="2.6"/><path class="pf" d="M2 -1L6 .3L2 1.3Z"/><circle class="pf" cx=".8" cy="-.6" r=".5"/></g></g><g class="rv-fly" opacity="0"><g class="rv-far"><path class="g" d="{{raven.fly.0}}"/></g><path class="g" d="{{raven.fly.1}}"/><path class="g" d="{{raven.fly.2}}"/><circle class="pf" cx="{{raven.eye.0}}" cy="{{raven.eye.1}}" r="{{raven.eye.2}}"/><g class="rv-near"><path class="g" d="{{raven.fly.3}}"/></g></g><g class="rv-item"></g></g><g class="rv-b"><g class="rv-sit"><g class="rv-body"><path class="g" d="M-11 1L-6 -2Q-3 -8 4 -8Q8 -7 7 -3Q3 1 -4 0Z"/><path class="t" d="M-4 -4Q0 -7 4 -5M0 0v2.5M2.5 0v2.5"/></g><g class="rv-head" transform="translate(5 -9)"><circle class="g" r="2.6"/><path class="pf" d="M2 -1L6 .3L2 1.3Z"/><circle class="pf" cx=".8" cy="-.6" r=".5"/></g></g><g class="rv-fly" opacity="0"><g class="rv-far"><path class="g" d="{{raven.fly.0}}"/></g><path class="g" d="{{raven.fly.1}}"/><path class="g" d="{{raven.fly.2}}"/><circle class="pf" cx="{{raven.eye.0}}" cy="{{raven.eye.1}}" r="{{raven.eye.2}}"/><g class="rv-near"><path class="g" d="{{raven.fly.3}}"/></g></g><g class="rv-item"></g></g><g class="rv-tally"><path class="t" d="M13 -8V-1" opacity="0"/><path class="t" d="M15.5 -8V-1" opacity="0"/><path class="t" d="M18 -8V-1" opacity="0"/><path class="t" d="M20.5 -8V-1" opacity="0"/><path class="t" d="M11.5 -2.5L22 -6.5" opacity="0"/><path class="t" d="M24.5 -8V-1" opacity="0"/></g>`,
    serpent: `<rect class="hit" x="-112" y="-60" width="230" height="78"/><g class="sp-tail sp-loop"><path d="M58 4C60 -20 86 -24 84 -6C82 8 64 6 66 -8" fill="none" stroke="${C.paper}" stroke-width="7" stroke-linecap="round"/><path d="M58 4C60 -20 86 -24 84 -6C82 8 64 6 66 -8" fill="none" stroke="${C.land}" stroke-width="2.8" stroke-linecap="round"/><path d="M66 -8C68 -20 84 -26 96 -18" fill="none" stroke="${C.paper}" stroke-width="7" stroke-linecap="round"/><path d="M66 -8C68 -20 84 -26 96 -18" fill="none" stroke="${C.land}" stroke-width="2.8" stroke-linecap="round"/><path class="g" d="M95 -19l10 -6l-2 12z"/></g><g class="sp-loop"><path d="M23 4A11 11 0 0 1 45 4" fill="none" stroke="${C.paper}" stroke-width="9" stroke-linecap="round"/><path d="M23 4A11 11 0 0 1 45 4" fill="none" stroke="${C.land}" stroke-width="4.8" stroke-linecap="round"/><path class="t" d="M27.1 0L21.9 -3"/><path class="t" d="M30 -2.9L27 -8.1"/><path class="t" d="M34 -4L34 -10"/><path class="t" d="M38 -2.9L41 -8.1"/><path class="t" d="M40.9 0L46.1 -3"/><path class="g" d="M30 -11l4 -8l4 8z"/></g><g class="sp-loop"><path d="M-10 4A14 14 0 0 1 18 4" fill="none" stroke="${C.paper}" stroke-width="9" stroke-linecap="round"/><path d="M-10 4A14 14 0 0 1 18 4" fill="none" stroke="${C.land}" stroke-width="4.8" stroke-linecap="round"/><path class="t" d="M-5.5 -1.5L-10.7 -4.5"/><path class="t" d="M-1.5 -5.5L-4.5 -10.7"/><path class="t" d="M4 -7L4 -13"/><path class="t" d="M9.5 -5.5L12.5 -10.7"/><path class="t" d="M13.5 -1.5L18.7 -4.5"/><path class="g" d="M0 -14l4 -8l4 8z"/></g><g class="sp-loop"><path d="M-44 4A16 16 0 0 1 -12 4" fill="none" stroke="${C.paper}" stroke-width="9" stroke-linecap="round"/><path d="M-44 4A16 16 0 0 1 -12 4" fill="none" stroke="${C.land}" stroke-width="4.8" stroke-linecap="round"/><path class="t" d="M-39.3 -2.5L-44.5 -5.5"/><path class="t" d="M-34.5 -7.3L-37.5 -12.5"/><path class="t" d="M-28 -9L-28 -15"/><path class="t" d="M-21.5 -7.3L-18.5 -12.5"/><path class="t" d="M-16.7 -2.5L-11.5 -5.5"/><path class="g" d="M-32 -16l4 -8l4 8z"/></g><g class="sp-loop sp-neck"><path d="M-58 6C-58 -22 -62 -34 -76 -40" fill="none" stroke="${C.paper}" stroke-width="10" stroke-linecap="round"/><path d="M-58 6C-58 -22 -62 -34 -76 -40" fill="none" stroke="${C.land}" stroke-width="5.8" stroke-linecap="round"/><g class="sp-head"><path class="l sp-tongue" d="{{serpent.tonguePath}}" opacity="0"/><path class="l sp-shut" d="{{serpent.shutPath}}" opacity="0"/><path class="g" d="M-70 -47Q-86 -55 -101 -40Q-88 -29 -70 -34Z"/><circle class="pf sp-eye" cx="-84" cy="-43" r="1.5"/><path class="t" d="M-100 -40l6 -1M-73 -48l4 -8l3 8"/><g class="sp-leaf" opacity="0" transform="translate(-104 -40) rotate(8)"><rect x="-9" y="0" width="18" height="21" fill="${C.paper}"/><rect x="-9" y="0" width="18" height="6" fill="${C.note}"/><text class="sp-day" x="0" y="4.8" font-size="4.2" font-weight="800" text-anchor="middle" fill="${C.ink}">${FIND_COPY.serpentLeaves[0][0]}</text><text class="sp-date" x="0" y="15.5" font-size="6.4" font-weight="800" text-anchor="middle" fill="${C.ink}">${FIND_COPY.serpentLeaves[0][1]}</text></g></g></g><rect x="-114" y="4" width="232" height="40" fill="${C.ink}"/><g class="sp-rip"><ellipse class="t" cx="-40" cy="6" rx="18" ry="3" opacity="0"/><ellipse class="t" cx="0" cy="6" rx="18" ry="3" opacity="0"/><ellipse class="t" cx="40" cy="6" rx="18" ry="3" opacity="0"/></g><path class="t" d="M-98 7q4 -3 8 0t8 0"/><path class="t" d="M-72 10q4 -3 8 0t8 0"/><path class="t" d="M-44 7q4 -3 8 0t8 0"/><path class="t" d="M-12 10q4 -3 8 0t8 0"/><path class="t" d="M20 7q4 -3 8 0t8 0"/><path class="t" d="M50 10q4 -3 8 0t8 0"/><path class="t" d="M76 7q4 -3 8 0t8 0"/><path class="t" d="M100 10q4 -3 8 0t8 0"/>`,
    beacon: `<circle class="bc-glow" cx="{{beacon.flameFoot.0}}" cy="{{beacon.flameFoot.1}}" r="{{beacon.glowR}}" fill="url(#glow)" opacity="0"/><g class="bc-beam" transform="translate(0 -50) rotate(0)"><path d="M0 0L-230 -44.7L-230 44.7Z" fill="url(#beam)"/></g><rect class="hit" x="-26" y="-66" width="52" height="70"/><path class="g" d="M-20 0q4 -9 11 -4q8 -7 15 0q7 -5 14 4z"/><path class="g" d="M-9 -3L-7 -40H7L9 -3Z"/><path class="t" d="M-8.4 -12H8.4M-8 -21H8M-7.6 -30H7.6M-2 -3V-12M3 -12V-21M-3 -21V-30M2 -30V-40"/><rect class="o" x="-1.8" y="-10" width="3.6" height="7"/><path class="l" d="M-10 -40H10"/><path class="l" d="M-4 -40L-6 -46M4 -40L6 -46"/><path class="o" d="M-7 -47L-5 -42H5L7 -47Z"/><path class="pf bc-flame" d="M-3 -47Q-4 -53 0 -58Q1 -53 3 -51Q4 -49 3 -47Z"/>`,
    runestone: `<rect class="hit" x="-20" y="-66" width="40" height="70"/><path class="g" d="M-14 0L-16 -40Q-12 -60 0 -62Q13 -60 15 -38L13 0Z"/><path d="M-10 -2L-11.5 -38Q-9 -53 0 -55Q10 -53 11 -36L9.5 -6Q9 -1 5 -3" fill="none" stroke="${C.paper}" stroke-width="4" stroke-linecap="round"/><path d="M-10 -2L-11.5 -38Q-9 -53 0 -55Q10 -53 11 -36L9.5 -6Q9 -1 5 -3" fill="none" stroke="${C.land}" stroke-width="2.2" stroke-linecap="round"/><path class="l rs-trace" d="M-10 -2L-11.5 -38Q-9 -53 0 -55Q10 -53 11 -36L9.5 -6Q9 -1 5 -3"/><circle class="pf" cx="5" cy="-3" r="1"/><g transform="translate(2.2 -9) rotate(-90)"><path class="rn" d="M0 0L0 3.4M0 1.4L1.1 0.4M0 2.3L1.1 1.4M2.2 0L2.2 3.4M3.2 3.4L3.2 0L4.3 0.8L3.2 1.7L4.3 3.4M6.5 0L5.4 1.3L6.5 2.1L5.4 3.4M8.1 0L8.1 3.4M7.5 0.8L8.1 0L8.6 0.8M13.1 0L12.1 1.3L13.1 2.1L12.1 3.4M15.2 0L14.2 0.8L15.2 1.7M16.2 3.4L16.2 0L16.8 0.8L17.3 0L17.3 3.4M18.9 0L18.9 3.4M18.4 0.8L18.9 0L19.5 0.8M21.5 0L20.5 0.8L21.5 1.7M22.6 0L22.6 3.4M23.6 0L23.6 3.4M22.6 1.3L23.6 2.1M27.1 0L27.1 3.4M27.1 1.4L28.2 0.4M27.1 2.3L28.2 1.4M29.2 0L29.2 3.4M30.9 0L30.9 3.4M30.3 1.3L31.4 2.1M32.5 0L32.5 3.4M32.5 0L33.5 0.8M32.5 1.1L33.5 2M34.6 3.4L34.6 0L35.7 0.8M40.1 0L39.2 0.8L40.1 1.7M41.2 3.4L41.2 0L42.3 1.1L42.3 3.4M43.9 0L43.9 3.4M43.3 0.8L43.9 0L44.4 0.8"/></g><path class="t" d="M-20 0H20"/>`,
  },
  icons: {
    sheet: '<rect class="l" x="-14" y="-20" width="28" height="40"/><rect class="t" x="-10" y="-16" width="20" height="12"/><path class="t" d="M-10 2H10M-10 7H10M-10 12H4"/>',
    book: '<path class="l" d="M0 -16Q-10 -20 -22 -17V15Q-10 12 0 16Q10 12 22 15V-17Q10 -20 0 -16Z"/><path class="t" d="M0 -16V16M-17 -10Q-9 -12 -4 -10M-17 -4Q-9 -6 -4 -4M-17 2Q-9 0 -4 2M4 -10Q9 -12 17 -10M4 -4Q9 -6 17 -4"/>',
    screen: '<rect class="l" x="-22" y="-16" width="44" height="32" rx="2"/><path class="t" d="M-22 -9H22"/><circle class="pf" cx="-18" cy="-12.5" r="1"/><circle class="pf" cx="-14.5" cy="-12.5" r="1"/><path class="t" d="M-16 -3H2M-16 3H10M-16 9H-2"/><rect class="t" x="8" y="-4" width="10" height="10"/>',
    bundle: '<rect class="l" x="-16" y="-12" width="32" height="26"/><path class="t" d="M0 -12V14M-16 1H16"/><path class="l" d="M0 -12q-6 -8 -9 -3q-1 4 9 3q10 1 9 -3q-3 -5 -9 3"/>',
  },
  tafl: { near: 20, scale: 0.7, mapCell: 3, mapHit: [-4, -4, 29, 29], kingPulse: [1.3, 1.7, 1], mapKing: 1.3,
    cell: 40, board: 280, width: 312, border: 1, pad: 15, radius: 10, gap: 6, tray: 22,
    statusH: 54, ruleH: 34, slotH: 70, buttonsH: 36, font: 13, line: 18, small: 11, smallLine: 15,
    gridAlpha: 0.28, outline: 1.1, pieceLine: 1.6, pieceR: 13, kingR: 15.5, kingStar: 9, cross: 18,
    diamond: 9, dotR: 4, dotAlpha: 0.55, selectR: 18, selectDash: [3, 3], cursorInset: 3, cursorLine: 2,
    slide: [0.05, 0.12, 0.3], reply: 0.45, grow: 0.35, close: 0.25, capturedScale: 0.5, trayInset: 17,
    hop: 1.2, hopTime: 0.22, hopGap: 0.045,
    rules: { size: 7, centre: 24, corners: [0, 6, 42, 48], king: 24, defenders: [17, 23, 25, 31], attackers: [3, 10, 21, 22, 26, 27, 38, 45], limit: 80,
      score: { king: 1000, corner: 900, edge: 120, defender: 30, attacker: 25, mobility: 2, adjacent: 1 } },
  },
  mist: { near: 62, rad: 70, box: [102, 410, 104, 50], alpha: 0.62, grid: [8, 4], cellR: 10, done: 0.75, thirds: 3,
    wipe: 9, press: 16, finger: 14, step: 0.4, traveller: 7, travellerEdge: 10, lift: 1.2, hear: [6, 0.8],
    ellipses: [[150, 428, 26, 11], [180, 444, 24, 10], [134, 446, 18, 8], [117, 426, 19, 12], [158, 450, 25, 10], [192, 429, 22, 12]],
    cairns: [[138, 418], [166, 452], [200, 440]], cairnScale: 0.8, glintAt: [0, -10.4], glintSize: 5, glintTime: 0.5, glintGap: 0.15, glintTurn: 45,
    cairn: '<path class="g" d="M-6.5 0L-5.6 -2.8L5.2 -3.2L6.8 0Z"/><path class="g" d="M-4.8 -3L-4.2 -5.6L4.6 -5.9L4 -3.1Z"/><path class="g" d="M-3.4 -5.7L-3 -8L2.6 -8.3L3.4 -5.9Z"/><path class="g" d="M-1.6 -8.1L-1 -10.2L1.6 -10.4L1.4 -8.2Z"/>',
    puffs: 8, puff: { speed: [3, 7], life: [0.8, 0.8], size: [0.5, 1.8], alpha: 0.22 }, east: [0, 0],
  },
  horn: { near: 24, scale: 0.7, rad: 40, soundRad: 700, tip: 6, raise: 0.35, lift: [3, -7], turn: -30, pivot: [-8, -4], anchor: [0, -42],
    hold: 0.45, swell: [1.12, 6, 0.9], bell: [7, -14], rings: 4, gap: 0.18, radius: 4, speed: 150, life: 1.8, alpha: 0.7, power: 1.5,
    glint: [5, 0.6, 90], hit: [-18, -30, 34, 38],
    paths: ['M-12 -4C-14 -16 -2 -24 10 -22L10 -16C0 -17 -6 -12 -5 -4Z', 'M5 -21.5L5.5 -16.5M0 -20L1.5 -15.5M-5 -16L-2.5 -12.5', 'M10 -22L10 -16', 'M-16 3q4 -3 8 0t8 0t8 0'],
  },
  well: { near: 38, rad: 116, hit: [38, 22], water: [300, 390], root: [300, 381], drip: [4, 7], dripTime: 0.35,
    pebbleR: 1.2, pebbleFrom: [-30, -34], pebbleTime: 0.45, arc: 16, anchor: [0, 26],
    rings: 3, ringR: [30, 15], ringTime: 0.9, ringGap: 0.18, ringScale: [0.2, 1.25], ringAlpha: 0.9,
    drops: 6, splash: { speed: [22, 22], dir: [-120, -60], g: 80, life: [0.45, 0.6] },
    trunk: [[300, 374], [300, 338]], trunkTime: 0.4, starSize: 2.4, starTime: 0.3, starGap: 0.06, starOver: 1.3,
    twinkle: [0.6, 1], twinkleTime: [3.1, 4.7, 5.3, 3.9, 6.1],
    stars: [[[-24, -44], [-6, -56], [12, -60], [26, -50], [2, -40]], [[-30, -52], [-14, -66], [8, -70], [28, -60], [16, -38]], [[-33, -42], [-22, -60], [-2, -64], [20, -66], [31, -46]]],
  },
  ship: { near: 34, rad: 38, scale: 0.55, anchor: [0, -34], rock: [2.2, 1.3, 0.8, 1.9], breathe: [0.04, 1.7],
    pull: [-18, 14, 0.35, 0.5], rail: [0, -5], surge: 3, pulls: 3, window: 4, pennantTime: 0.4, ripple: [6, 2.5],
    hear: [1.12, 0.6, 2, 1], sailPivot: [0, -25], lamp: [0, -42, 1.5, 7], twinkle: [0.65, 1, 4.1], drops: 4, water: [0, 8],
    hit: [-36, -50, 72, 60], shields: [-18, -11, -4, 3, 10, 17], shieldY: -6, shieldR: 2.6, bossR: 0.6,
    paths: { hull: 'M-26 -6Q-20 5 -10 5H12Q22 5 26 -6Z', ends: 'M-26 -6Q-33 -13 -29 -20Q-25 -25 -22 -20Q-21 -16 -24.5 -16.5M26 -6Q31 -11 28 -15Q26 -17 25 -15', mast: 'M0 -6V-38', sail: 'M-12 -35H12V-15H-12Z', stripes: 'M-6 -35V-15M0 -35V-15M6 -35V-15', water: 'M-36 8q4 -3 8 0t8 0M16 9q4 -3 8 0t8 0',
      oars: 'M-18 -5L-25 8M-11 -5L-18 8M-4 -5L-11 8M3 -5L-4 8M10 -5L3 8M17 -5L10 8', pennant: 'M0 -39.5L24 -38L18 -36.5L24 -35L0 -33.5Z' },
  },
  all: { frame: [18, 18, 564, 864], length: 100, width: 2, dash: [6, 94], time: 2.6, fade: 0.4, knotTime: 0.8, markerTime: 0.4, markerScale: 1.25, frameAlpha: 0.5,
    knots: [[36, 36], [564, 36], [36, 864], [564, 864]], corners: [0, 564, 2286, 1428] },
};
