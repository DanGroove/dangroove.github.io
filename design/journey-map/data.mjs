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
  // logoH: HMC's stacked lockup stands taller than the wordmarks' 44 px (L-9)
  hmc: { shield: ["#0D7247","#FFFFFF","#1E345D"], logo: 'assets/logos/hmc.png', logoH: 64, layout: 'ground', ground: '#1E345D', text: '#FFFFFF', sub: '#B8C4DA', button: '#0D7247', buttonText: '#FFFFFF', pill: '#0D7247', pillText: '#FFFFFF', band: '#FFFFFF', headline: '#FFFFFF', mark: '#0D7247', hairline: '#B8C4DA' },
  laurier: { shield: ["#EAA41E","#330172","#FFFFFF"], logo: 'assets/logos/laurier.png', layout: 'band', ground: '#330172', text: '#FFFFFF', sub: '#CFC3E0', button: '#EAA41E', buttonText: '#330172', pill: '#EAA41E', pillText: '#330172', band: '#FFFFFF', headline: '#FFFFFF', mark: '#EAA41E', hairline: '#CFC3E0' },
  mohawk: { shield: ["#FB9632","#991030","#030303"], logo: 'assets/logos/mohawk.png', layout: 'ground', ground: '#030303', text: '#F4F4F4', sub: '#A3A3A3', button: '#FB9632', buttonText: '#030303', pill: '#991030', pillText: '#FFFFFF', band: '#FFFFFF', headline: '#F4F4F4', mark: '#FB9632', hairline: '#A3A3A3' },
  interkom: { shield: ["#E85155","#F7F3E2","#242021"], logo: 'assets/logos/interkom.png', layout: 'ground', ground: '#F7F3E2', text: '#242021', sub: '#5E5A56', button: '#242021', buttonText: '#F7F3E2', arrow: '#E85155', pill: '#242021', pillText: '#F7F3E2', band: '#FFFFFF', headline: '#242021', mark: '#E85155', hairline: '#5E5A56' },
  // Lennard: white logo band over orange; Warm Gray 11 is its only dark, on the pill, button and chips.
  lennard: { shield: ["#FF4C00","#D8D1CA","#706259"], logo: 'assets/logos/lennard.png', layout: 'band', ground: '#FF4C00', text: '#FFFFFF', sub: '#FFFFFF', button: '#FFFFFF', buttonText: '#706259', pill: '#706259', pillText: '#FFFFFF', band: '#FFFFFF', headline: '#FFFFFF', mark: '#FF4C00', hairline: '#FFFFFF', panel: '#FFFFFF', panelText: '#706259', panelHair: '#706259', panelButton: '#706259', panelButtonText: '#FFFFFF', smallWeight: 500, chip: '#FFFFFF', chipText: '#706259' },
};

export const CRAFTS = ['Print', 'Video', 'Motion', 'Screen'];

export const PIECE_IMAGE = 'assets/hmc-report.jpg';

// Stops: real facts. spans are [start, end] as 'YYYY-MM' (end month inclusive) or 'now'.
// crafts: draft for Dan to correct.
export const STOPS = [
  { id: 'laurier', palette: 'laurier', name: 'Wilfrid Laurier University', short: 'Laurier', dates: '2016 to 2017', spans: [['2016-09', '2017-12']], track: 'school', role: 'Game Design and Development', crafts: ['Screen'], w: 0, rune: 'l',
    // the name 4 units lower, its dates unmoved: the traveller's glow stays off the L (K-3)
    label: { t: 'Laurier', sub: '2016 to 2017, game design', x: 158, y: 240, subDY: -4, a: 'middle' },
    copy: { draft: true, headline: 'Where it started.', para: 'I went to Laurier for game design. Systems, rules and play came first, before I ever chose graphic design.', took: 'Think about how someone moves through it.', piece: null, caption: '' } },
  { id: 'hmc1', palette: 'hmc', name: 'HMC Connections', short: 'HMC Connections', dates: 'Summers 2018 and 2020', spans: [['2018-04', '2018-08'], ['2020-06', '2020-08']], track: 'work', role: 'Graphic designer, video editor, web designer', crafts: ['Print', 'Video', 'Screen'], w: 7, rune: 'h',
    label: { t: 'HMC Connections', sub: 'summers 2018 and 2020', x: 431, y: 271, a: 'end', tracking: -0.55 },
    copy: { draft: true, headline: 'First job, three hats.', para: 'Two summers as the student who did design, video and web at once. I designed the SafetyDrivesUs logo and built its website, plus flyers and infographics.', took: 'One person can carry a job across print, video and web.', piece: null, caption: '' } },
  { id: 'mohawk', palette: 'mohawk', name: 'Mohawk College', short: 'Mohawk', dates: '2019 to 2021', spans: [['2019-01', '2021-04']], track: 'school', role: 'Advanced Diploma, Graphic Design', crafts: ['Print', 'Screen'], w: 17, rune: 'm',
    // tracked in, 2 left and 4 down (was 131, 392): the k clears the trail's dots (K-5); phones leave no more room
    label: { t: 'Mohawk', sub: '2019 to 2021', x: 129, y: 396, a: 'middle', tracking: -0.5 },
    copy: { draft: true, headline: 'Where the craft got formal.', para: 'Type, layout and critique, every week, until the reasons behind a good page became habit.', took: 'Type first.', piece: null, caption: '' } },
  { id: 'hmc2', palette: 'hmc', name: 'HMC Connections', short: 'HMC, again', dates: '2021 to 2022', spans: [['2021-06', '2022-03']], track: 'work', role: 'Graphic designer, on contract', crafts: ['Print', 'Screen'], w: 26, rune: 'h',
    label: { t: 'HMC, again', sub: 'on contract, 2021 to 2022', x: 461, y: 297, a: 'start' },
    copy: { draft: true, headline: 'Back as the designer.', para: 'I came back on contract, redesigned hmcconnections.com, designed the 2020/2021 annual report and built the HMC anti-racism movement website.', took: 'Long documents are where a system proves itself.', piece: PIECE_IMAGE, caption: 'Annual report, 2020 to 2021' } },
  { id: 'interkom', palette: 'interkom', name: 'Interkom', short: 'Interkom', dates: 'Autumn 2022', spans: [['2022-09', '2022-12']], track: 'work', role: 'Junior graphic designer, on contract', crafts: ['Print', 'Screen'], w: 29, rune: 'i',
    label: { t: 'Interkom', sub: 'autumn 2022', x: 494, y: 465, a: 'end' },
    copy: { draft: true, headline: 'Agency pace.', para: "Four months, several clients at once: social graphics for Flato Markham Theatre, Art Windsor-Essex and JNAAG, and a redesign of Melanoma Canada's sixth edition booklet.", took: 'Switch brands without dropping the thread.', piece: null, caption: '' } },
  { id: 'lennard', palette: 'lennard', name: 'Lennard Commercial Realty', short: 'Lennard', dates: '2023 to now', spans: [['2023-10', '2024-03'], ['2024-04', '2025-07'], ['2025-07', 'now']], track: 'work', role: 'Freelance, junior, now graphic designer', crafts: ['Print', 'Video', 'Motion', 'Screen'], w: 35, rune: 'l',
    label: { t: 'Lennard', sub: '2023 to now', x: 313, y: 702, a: 'end' },
    copy: { draft: true, headline: 'All four crafts, one job.', para: 'I started freelance, came on as a junior and became the graphic designer. I design the marketing for commercial listings, edit and animate LennieTV and the monthly Deal Board, and lay out The Q.', took: 'Carry the idea from first sketch to final cut.', piece: null, caption: '', steps: ['Freelance 2023', 'Junior 2024', 'Graphic designer 2025'] } },
];

// Map geometry (600 by 900 units), ported from reference/round2.cjs
export const MAP = {
  w: 600, h: 900,
  coastA: [[108, 196], [128, 150], [200, 132], [290, 146], [380, 128], [452, 150], [492, 196], [486, 236], [460, 266], [440, 294], [470, 322], [506, 342], [524, 392], [516, 452], [548, 504], [540, 540], [498, 566], [430, 590], [345, 578], [262, 606], [178, 592], [116, 540], [84, 462], [100, 392], [72, 322], [84, 250]],
  coastB: [[196, 690], [262, 660], [340, 668], [420, 656], [476, 684], [494, 736], [462, 784], [392, 806], [300, 800], [222, 796], [182, 750]],
  waypoints: [[158, 214], [186, 222], [214, 212], [252, 228], [300, 238], [352, 228], [402, 240], [452, 262], [420, 278], [372, 272], [330, 286], [284, 272], [244, 292], [226, 326], [198, 346], [216, 362], [182, 370], [150, 372], [160, 400], [150, 428], [190, 452], [250, 470], [318, 468], [378, 452], [428, 404], [452, 362], [470, 332], [496, 372], [508, 430], [508, 490], [506, 540], [474, 598], [440, 630], [404, 662], [368, 702], [334, 712], [275, 731], [256, 768]],
  xIdx: 37, trailSeg: 8, dotGap: 5.6,
  x: [256, 768],
  well: [302, 392],
  ygg: [304, 374],
  treeNudges: [[5,-8,0],[40,0,-3.5],[41,0,-5],[55,-134,-28],[56,-134,-28],[57,-155,-30],[58,-134,-28],[62,31,0]], treeDrops: [59],
  jorm: {"ring":[[500,101],[524,106],[546,122],[558,150],[563,190],[562,240],[560,290],[563,340],[563,390],[562,440],[563,490],[563,535],[552,572],[524,604],[484,622],[440,626],[396,622],[350,614],[300,618],[252,624],[204,618],[160,600],[124,572],[98,532],[80,490],[62,446],[56,400],[56,350],[56,300],[62,252],[76,206],[98,166],[128,132],[168,116],[214,112],[262,116],[312,120],[362,113],[410,108],[444,105],[468,102.5]],"surf":[[0,0.085],[0.235,0.29],[0.43,0.5],[0.655,0.715],[0.885,1]],"w":9,"seg":10,"tail":9,"taper":[0.9,0.1,0.8],"subAlpha":0.55,"edgeAlpha":0.22,"edgeWidth":0.8,"dash":"3 2.2","surfaceTaper":0.012,"edgeNarrow":[0.45,0.55],"water":"q2.4 -2 4.8 0t4.8 0t4.8 0","waterAt":[-7,1],"waterAlpha":0.8,"swellPath":"M-7 -3.2Q0 -6.2 7 -3.2L7 3.2Q0 6.2 -7 3.2Z","hornPath":"M-7 -3.2Q0 -4.7 7 -3.2L7 3.2Q0 4.7 -7 3.2Z","swellLength":14,"swellExtra":9,"hornExtra":1.5,"swellSub":0.45,"swellRamp":3,"neck":1.25,"lead":[[510,101],[530,101.4],[545,108],[554,126]],"tailEnd":[[462,103.6],[482,104.4]],"tailOpen":[[434,107.5],[443,116],[442,129]]},
  toronto: {"at":[358,752],"k":0.105,"facts":{"cn":553.3,"cnMain":346,"cnSky":447,"cnMastFoot":457,"rogers":86,"fcp":298,"scotia":275,"cibc":241,"ccw":239,"td":223,"bac":218,"brookfield":207,"rbp":180},"box":[352,688,484,758],"width":114.4,"back":[[18.5,4,15],[30.5,4,18],[33.6,3.4,13.5],[40.5,4.2,23],[52,3.6,26.5],[60.5,4,21],[77,3.6,24],[86,4.2,20],[101,4,17.5],[111,3.6,14]],"buildings":[["rogers",0,20],["cn",26,8.4],["rbp",36,6.4],["brookfield",43.6,6],["td",50.8,7],["fcp",59,6.4],["ccw",66.6,6],["scotia",73.8,7.2],["bac",82.2,6],["cibc",89.4,6.4]],"east":[[97,4.2,12],[102.4,4.6,16],[108.2,5,10]],"drawing":"<path class=\"t\" d=\"M18.5 0V-15H22.5V0M30.5 0V-18H34.5V0M33.6 0V-13.5H37V0M40.5 0V-23H44.7V0M52 0V-26.5H55.6V0M60.5 0V-21H64.5V0M77 0V-24H80.6V0M86 0V-20H90.2V0M101 0V-17.5H105V0M111 0V-14H114.6V0\"/><path class=\"g\" d=\"M0 0V-4.6Q10 -13.4 20 -4.6V0Z\"/><path class=\"t\" d=\"M0 -4.6H20M3.4 -7Q10 -10.6 16.6 -7\"/><path class=\"g\" d=\"M21.8 0C23.4 -6 24.5 -16 24.8 -34.3H27.2C27.5 -16 28.6 -6 30.2 0Z\"/><path class=\"t\" d=\"M26 -1V-33.9\"/><path class=\"g\" d=\"M22.2 -35.099999999999994Q21.4 -36.9 23 -37.9H29Q30.6 -36.9 29.8 -35.099999999999994Z\"/><path class=\"t\" d=\"M21.9 -36.3H30.1\"/><path class=\"g\" d=\"M25.1 -37.9V-46.1H26.9V-37.9\"/><path class=\"g\" d=\"M24.3 -46.1H27.7V-47.9H24.3Z\"/><path class=\"l\" d=\"M26 -47.9V-48\"/><path class=\"l\" d=\"M26 -48V-58.1\" stroke-opacity=\".8\"/><path class=\"g\" d=\"M36 0V-18.3L37.6 -18.9L39.2 -18.3L40.8 -18.9L42.4 -18.3V0\"/><path class=\"t\" d=\"M37.6 -1V-18.9M40.8 -1V-18.9\"/><path class=\"g\" d=\"M43.6 0V-19.7H44.6V-21.7H48.6V-19.7H49.6V0\"/><path class=\"t\" d=\"M44.6 -2.4H48.6M44.6 -4.8H48.6M44.6 -7.2H48.6M44.6 -9.6H48.6M44.6 -12.0H48.6M44.6 -14.4H48.6M44.6 -16.8H48.6\"/><path class=\"o\" d=\"M50.800000000000004 0V-23.4H57.800000000000004V0\"/><path class=\"t\" d=\"M52.2 -1V-22.4M53.6 -1V-22.4M55.0 -1V-22.4M56.4 -1V-22.4\"/><path class=\"t\" d=\"M51.300000000000004 -1.8H57.3M51.300000000000004 -3.6H57.3M51.300000000000004 -5.4H57.3M51.300000000000004 -7.2H57.3M51.300000000000004 -9.0H57.3M51.300000000000004 -10.8H57.3M51.300000000000004 -12.6H57.3M51.300000000000004 -14.4H57.3M51.300000000000004 -16.2H57.3M51.300000000000004 -18.0H57.3M51.300000000000004 -19.8H57.3M51.300000000000004 -21.6H57.3\"/><path class=\"g\" d=\"M59 0V-30.5L59.8 -31.3H64.6L65.4 -30.5V0\"/><path class=\"t\" d=\"M59.8 -1V-31.3M64.6 -1V-31.3\"/><path class=\"g\" d=\"M66.6 0V-25.1H72.6V0\"/><path class=\"t\" d=\"M66.6 -23.5H72.6M66.6 -22.900000000000002H72.6\"/><path class=\"t\" d=\"M68.1 -1V-21.7M69.6 -1V-21.7M71.1 -1V-21.7\"/><path class=\"g\" d=\"M73.8 0V-25.9L75.2 -27.5V-28.9L77.39999999999999 -26.5L79.6 -28.9V-27.5L81 -25.9V0\"/><path class=\"t\" d=\"M76.2 -1V-24.9M78.6 -1V-24.9\"/><path class=\"g\" d=\"M82.2 0V-21.5H83V-22.9H87.4V-21.5H88.2V0\"/><path class=\"t\" d=\"M83.2 -2.2H87.2M83.2 -4.4H87.2M83.2 -6.6H87.2M83.2 -8.8H87.2M83.2 -11.0H87.2M83.2 -13.2H87.2M83.2 -15.4H87.2M83.2 -17.6H87.2M83.2 -19.8H87.2\"/><path class=\"g\" d=\"M89.4 0V-25.3H95.80000000000001V0\"/><path class=\"t\" d=\"M89.4 -2L95.80000000000001 -8M89.4 -9L95.80000000000001 -15M89.4 -16L95.80000000000001 -22\"/><path class=\"g\" d=\"M97 0V-12H101.2V0\"/><path class=\"t\" d=\"M97.6 -1.6H100.6M97.6 -3.2H100.6M97.6 -4.8H100.6M97.6 -6.4H100.6M97.6 -8.0H100.6M97.6 -9.6H100.6\"/><path class=\"g\" d=\"M102.4 0V-16H107V0\"/><path class=\"t\" d=\"M103 -1.6H106.4M103 -3.2H106.4M103 -4.8H106.4M103 -6.4H106.4M103 -8.0H106.4M103 -9.6H106.4M103 -11.2H106.4M103 -12.8H106.4M103 -14.4H106.4\"/><path class=\"g\" d=\"M108.2 0V-10H113.2V0\"/><path class=\"t\" d=\"M108.8 -1.6H112.6M108.8 -3.2H112.6M108.8 -4.8H112.6M108.8 -6.4H112.6M108.8 -8.0H112.6\"/><path class=\"l\" d=\"M-4 0H118.4\"/><path class=\"t\" d=\"M2 2.6q2.4 -1.8 4.8 0t4.8 0M94.4 2.6q2.4 -1.8 4.8 0t4.8 0t4.8 0\"/>"},
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
    { t: 'THE MARGINS', x: 258, y: 545 },
    { t: 'KERNING NARROWS', x: 300, y: 636, i: 1 },
    { t: 'LENNARDGARD', x: 412, y: 768, rune: 'lennardgard' },
    { t: 'HERE BE REVISIONS', x: 477, y: 118 },
  ],
  notes: [
    { t: 'the diploma climb', x: 238, y: 356, s: 6.5 },
    { t: 'the mist of 2020', x: 104, y: 464, s: 6.5 },
    { t: 'left intentionally blank', x: 258, y: 554, s: 5.6, a: 'middle', dim: 1 },
    { t: 'the crossing of uncertainty', x: 470, y: 613, s: 6.3 },
    { t: 'the road not taken: game dev', x: 268, y: 172, s: 6 },
  ],
  sea: 'SEA OF FEEDBACK',
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
  nova: 'The supernova. Press to add a flare.',
  steps: {
    group: 'Move through the journey', start: 'Start the journey', setOut: 'Set out', next: 'Next: {name}',
    toX: 'Next: the X', dig: 'Dig here', top: 'Back to the top', back: 'Back: {name}', returnTo: 'Back to the trail',
    names: { hmc2: 'back to HMC', top: 'the top', map: 'the whole map', x: 'the X', end: 'the end' },
    say: { top: 'The top of the page', map: 'The whole map', stop: 'Stop {n} of {t}: {name}, {dates}', x: 'The X', end: 'The end of the trail: contact and links' },
    review: { label: 'Preview only', depth: 'Depth' },
  },
  explore: { button: 'Explore the map', back: 'Back to the end', hint: 'Scroll to zoom. Drag to look around.',
    hintPhone: 'Pinch to zoom. Drag to look around.', say: 'Exploring the map. Back returns to the end.' },
  cardClose: 'Close the {name} card',
  cardOpen: 'Open the {name} card',
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
  { id: 'wayfinder', n: 1, x: 102, y: 716, view: [250, 660, 150], viewPhone: [118, 716, 75, 0], mark: [148, 672], label: 'The wayfinder. Pick a craft to light up the stops that used it. Arrow keys turn it, Enter on the centre clears it.' },
  { id: 'hoards', n: 2, x: 366, y: 354, mark: [393, 347], label: 'Hoards. Five buried chests, each near a stop.' },
  { id: 'ravens', n: 3, x: 440.5, y: 201.5, view: [442.5, 181.5, 42], mark: [462.5, 193.5], label: 'Huginn and Muninn, two ravens in a bare tree. Press to send the next raven for a thought or memory.' },
  { id: 'serpent', n: 4, x: 500, y: 101, view: [478, 96, 50], mark: [555, 71], label: 'J\u00f6rmungandr, the revision loop. Poke him.' },
  { id: 'beacon', n: 5, x: 516.4, y: 425.5, view: [474, 456, 100], mark: [545, 440], label: 'The beacon. Drag or arrows aim; Enter finds the next unread note.' },
  { id: 'runestone', n: 6, x: 250, y: 516, view: [250, 500, 40], mark: [270, 492], label: 'The rune stone. Press, rub, read, then flip the sheet.' },
  { id: 'hammer', n: 0, x: 102, y: 222, view: [108, 224, 34], label: 'Mjölnir on a stone near Laurier. Press it to hold the bridge.' },
  { id: 'mist', n: 0, x: 156, y: 438, view: [154, 436, 62], label: 'The mist of 2020. Press or wipe to clear it.' },
  { id: 'horn', n: 0, x: 144, y: 520, view: [144, 502, 42], viewCap: 12, label: 'Two tankards on the shore. Press to raise them, press again to clink them.' },
  { id: 'well', n: 0, x: 302, y: 392, view: [306, 350, 72], label: "Urd's Well. Drop a pebble in. The Norns answer." },
  { id: 'longship', n: 0, x: 452, y: 622, label: 'The longship. Pull three times to fly its pennant.' },
];

// All hammer tuning, geometry and paths. Foe rows: columns, rows, weights, speed, shot interval, cap, gaps, elites.
export const HAMMER = {
  field: { w: 300, h: 400, margin: 16, top: 34, bridge: 378, line: 1.2, dpr: 2 },
  step: 1 / 120, steps: 8, limit: 1200, hearts: 3, most: 5, hurt: 1.75, waveBonus: 50, perfect: 35,
  pools: { foes: 60, shots: 80, hail: 12, sparks: 64, cells: 126 },
  seed: { first: 719, span: 2147483647, add: 0x6D2B79F5, div: 4294967296 },
  throw: { speed: 650, back: 720, turn: 14, radius: 5, catch: 9, spin: 13, pierce: 1, ride: 0.2, bend: 1.8 },
  glove: { x: 150, y: 378, min: 16, max: 284, speed: 148, follow: 190, radius: 9, horse: 0.2, flicker: 18 },
  march: { column: 26, row: 22, down: 10, boost: 1.3, chiefStop: 1.3 },
  waves: [
    { columns: [5, 7], rows: [2, 2], weights: [7, 2, 1, 0, 0], speed: 12, rate: 1.7, cap: 5, gaps: 0.08, elites: [0, 0] },
    { columns: [6, 8], rows: [2, 3], weights: [5, 3, 2, 0, 0], speed: 14, rate: 1.45, cap: 7, gaps: 0.1, elites: [0, 0] },
    { columns: [6, 8], rows: [3, 3], weights: [4, 3, 2, 3, 0], speed: 17, rate: 1.3, cap: 9, gaps: 0.12, elites: [0, 0] },
    { columns: [7, 9], rows: [3, 3], weights: [3, 3, 3, 3, 0], speed: 17, rate: 1.25, cap: 11, gaps: 0.12, elites: [1, 2] },
    { columns: [7, 9], rows: [3, 4], weights: [2, 4, 3, 4, 0], speed: 20, rate: 1.05, cap: 13, gaps: 0.14, elites: [1, 3] },
    { columns: [8, 10], rows: [3, 4], weights: [2, 4, 4, 4, 0], speed: 23, rate: 0.9, cap: 15, gaps: 0.14, elites: [2, 3] },
  ],
  kinds: ['draugr', 'rime', 'fire', 'wolf', 'chief'],
  foes: {
    draugr: { hearts: 1, silver: 10, speed: 88 }, rime: { hearts: 2, silver: 20, speed: 135 },
    fire: { hearts: 1, silver: 15, speed: 102 }, wolf: { hearts: 1, silver: 25, speed: 104 }, chief: { hearts: 4, silver: 60, speed: 124 },
  },
  foe: { rx: 10, ry: 8, bossRX: 56, bossRY: 23, clayRX: 21, clayRY: 27 },
  shot: { radius: 3, splitY: 202, splitAgain: 282, angle: 0.36, fan: 0.28, dead: 412 },
  wolf: { every: [10, 16], time: 3.4, curve: 24, pack: 3 },
  shield: { walls: 3, columns: 7, rows: 3, x: 47, gap: 100, y: 340, cell: 5, radius: 3.5, stagger: 2.5, double: 2 },
  valkyrie: { every: [14, 21], speed: 51, y: 18, silver: 75, rx: 14, ry: 7 },
  fates: { chance: 0.66, count: 5, cold: 0.72 },
  runes: [
    { key: 'th', max: 3 }, { key: 'r', max: 3 }, { key: 'k', max: 3 }, { key: 'g', max: 2 },
    { key: 'h', max: 3 }, { key: 'n', max: 2 }, { key: 'i', max: 3 }, { key: 'j', max: 3 },
    { key: 'ei', max: 3 }, { key: 'l', max: 3 }, { key: 'd', max: 3 }, { key: 'e', max: 3 },
  ],
  rune: { burn: 0.8, spread: 32, ice: 0.12, hail: 2, hailSpeed: 150, hailRise: 22, hailLife: 1.6 },
  boss: { hearts: 64, fan: 1.6, fans: 5, speed: 17, x: [72, 228], y: 59, shardSpeed: 124, aimSpread: 0.23, clay: 13, clayAt: 0.6, heartAt: 0.3, clayY: 203, claySpeed: 30, clayX: [72, 228], faster: 0.66, exposed: 2, heartRX: 13, heartRY: 15, heartY: 17, silver: 500, fall: 1.3, gravity: 90 },
  fx: { sparks: 4, life: 0.25, speed: 40, shake: 1.8, flash: 0.09, flashAlpha: 0.65, trail: 12 },
  map: { near: 20, scale: 0.7, hit: [-6, -6, 34, 34], centre: [10.5, 10.5], stone: 'M-3 23L0 20L24 20L27 23L25 25L-2 25Z', hammer: 'M-2 12L2 10H19L22 12V18L19 20H2L-2 18ZM2 11V19M18 11V19M8 10V-3H12V10M8 5H12M8 -1H12M9 -3Q4 -10 9 -11Q16 -12 11 -3', kept: 'M4 14L7 17L14 13M5 19H15', spark: 'M-2 12L-5 10L-4 7M21 16L25 14L24 11M9 23L11 26', every: 4.3, sparkTime: 0.18, tremble: 0.55, trembleRate: 33, hop: 2, hopTime: 0.3 },
  ui: { w: 330, h: 558, fieldW: 300, fieldH: 400, pad: 14, border: 1, radius: 10, gap: 8, header: 24, status: 36, buttons: 44, font: 12, line: 17, small: 11, title: 22, titleWeight: '800', autoFlex: '2', waveShare: '50%', cardPad: 14, inset: 12, rune: 32, runeW: 18, mini: 17, miniW: 11, spritePad: 4, glyphLine: 1.4, heartW: 10, heartH: 9, heartGap: 2, notice: 1, bestKey: 'jm-hammer-best' },
  paths: {
    bridge: ['M0 386Q150 364 300 386', 'M0 391Q150 369 300 391', 'M0 396Q150 374 300 396'],
    heart: 'M0 3C-6 -3 -6 -7 -2 -7Q0 -7 0 -5Q0 -7 2 -7C6 -7 6 -3 0 3Z', heartBox: '-6 -8 12 12',
    crack: 'M-3 -6L1 -2L-2 1L3 6', stoneHeart: 'M0 -9L-9 7L10 6ZM0 -5L-3 2L5 3',
    shot: ['M-1 -3L1 3M-2 -2L1 -3M-1 3L2 2', 'M-2 -4L2 -4L0 5Z', 'M0 4Q-4 0 0 -4Q4 0 0 4Z'],
    wall: { centres: [-17.5, -8.75, 0, 8.75, 17.5], paths: { wallRim: 'M-7.5 0A7.5 7.5 0 1 0 7.5 0A7.5 7.5 0 1 0 -7.5 0Z', wallBoss: 'M-1.5 0A1.5 1.5 0 1 0 1.5 0A1.5 1.5 0 1 0 -1.5 0Z', wallPlanks: 'M-4 -6V6M0 -7.5V-1.5M0 1.5V7.5M4 -6V6' } },
    spark: 'M-2 0H2M0 -2V2',
    sprites: {
      glove: [24, 20, 'M-10 7L-8 1L-7 -5L-3 -7L0 -5L3 -7L6 -5L8 -1L7 2L10 7ZM-8 2H8M-4 -5V0M0 -5V0M4 -5V0M-7 5H-5M0 5H2M6 5H7'],
      hammer: [20, 20, 'M-1 1V8Q-3 11 0 11Q3 11 1 8V1M-8 -7L-5 -5H5L8 -7L9 -6V1L8 2L5 0H-5L-8 2L-9 1V-6ZM-5 -4L0 -1L5 -4M-5 -1L0 -4L5 -1'],
      draugr: [24, 20, 'M-4 1.1 L-5 -1 L-3 -2.4 L0 -1.7 L1 0.4 L-1 1.1 M-4 1.1 Q-7 1.8 -6 3.9 L-5 6.7 L-3 5.3 L-2 7.4 L0 5.3 L2 6.7 L1 2.5 L-1 1.1 M-4 2.5 L-2 3.9 L1 3.2 L5 3.9 M4 3.9 L7 -1 L8 -0.3 L7 1.1 L8 1.8 L6 4.6 M-3 -1 H-2 M-3 2.5 V4.6 M-4 6.7 L-5 7.4 M0 6 L1 7.4'],
      rime: [24, 20, 'M-3 -4.229 L-3 -7.4 H2 L3 -4.229 M-3 -4.229 L-7 -3.171 L-8 1.057 L-5 2.114 L-4 5.286 L-4 7.4 H-1 L0 4.229 L1 7.4 H4 L4 2.114 L6 1.057 M-3 -3.171 L-2 1.057 L-1 -1.057 L0 2.114 L1 -1.057 L2 0 L3 -3.171 M-2 -5.286 H-1 M1 -5.286 H2 M5 4.229 L6 -4.229 M5 -4.229 L5 -7.4 L8 -7.4 L9 -5.286 L8 -3.171 L6 -3.171'],
      fire: [24, 20, 'M-2 -4.229 Q-5 -5.286 -3 -7.4 L-1 -6.343 L0 -7.4 L1 -4.229 L3 -7.4 Q5 -3.171 2 -2.114 M-2 -2.114 L-4 0 L-3 3.171 L-2 2.114 L-2 7.4 H0 L1 3.171 L2 7.4 H4 L3 0 L2 -2.114 ZM-2 -4.229 V-2.114 H2 V-4.229 M-3 0 L-6 2.114 M3 0 L5 1.057 M5 2.114 L8 -5.286 L9 -4.229 L7 3.171 M-1 -3.171 H0 M0 0 L1 2.114'],
      wolf: [26, 20, 'M-9.4 3.48 L-6.267 1.44 L-1.044 0.76 L3.133 1.44 L4.178 -0.6 L6.267 0.76 L8.356 0.76 L9.4 2.12 L7.311 3.48 L4.178 3.48 L2.089 4.84 L-3.133 4.84 L-6.267 4.16 L-8.356 5.52 L-9.4 4.84 M-7.311 2.8 L-9.4 0.76 M-3.133 4.16 L-1.044 6.2 L1.044 6.2 M2.089 4.16 L5.222 5.52 L7.311 5.52 M6.267 1.44 H7.311'],
      chief: [26, 22, 'M-3 -3.171 V-5.286 L0 -7.4 L3 -5.286 V-3.171 M-3 -5.286 L-7 -7.4 L-6 -4.229 L-3 -3.171 M3 -5.286 L7 -7.4 L6 -4.229 L3 -3.171 M-3 -2.114 L-7 0 L-6 3.171 L-3 2.114 L-3 7.4 H-1 L0 3.171 L1 7.4 H4 L3 2.114 L6 1.057 L5 -1.057 L3 -2.114 M-5 1.057 L-1 0 L4 -1.057 M-2 2.114 L2 0 L5 -1.057 M-7 2.114 L7 -3.171 M6 -4.229 L8 -6.343 L9 -4.229 L8 -2.114 L6 -2.114 ZM-1 -4.229 H1 M-2 -1.057 H2'],
      valkyrie: [36, 22, 'M-15 5L-9 1L-4 2L0 -1L5 0L8 -3L13 -2L16 1L12 4H6L4 8M-8 4L-9 8M-3 4L-1 8M1 -1V-8L4 -10L6 -7L4 -4L7 -1M2 -7L-6 -9L-2 -5L-8 -6L-2 -2M7 -7L13 -10'],
      hrungnir: [128, 62, 'M-18 -7L-20 -15L-8 -20L13 -18L19 -12L17 -7M-20 -15L-35 -22L-32 -13L-20 -9M17 -14L32 -22L29 -12L18 -8M-18 -7L-37 -2L-43 8L-28 11L-19 6L-18 21H-5L0 10L5 21H21L18 5L35 7L41 0L27 -5L17 -7M-29 4L-10 6L16 0M29 1L13 7L-7 3M-44 11L43 -6M39 -10L47 -17L54 -11L50 -1L42 0ZM-12 -12H-6M6 -12H12M-8 -6L0 -3L9 -6M-10 10L0 18L11 10'],
      clay: [52, 64, 'M-9 -8L-10 -20L-2 -25L8 -20L9 -9L17 -4L19 9L11 12L10 25H3L0 15L-3 25H-11L-12 9L-19 7L-17 -3ZM-7 -16L-3 -15M3 -15L7 -16M-5 -9L3 -7M-11 -3L-5 1L-8 8M10 -1L4 5L8 10M-2 11L2 8'],
    },
    fragments: [[-32, -8, 'M-25 -9L-7 -14L5 0L-12 13Z'], [0, -14, 'M-18 -13L12 -12L23 2L0 17L-13 4Z'], [32, 1, 'M-8 -11L17 3L10 20L-17 6Z']],
  },
  tests: { quick: 60, full: 200, seeds: 1001, botStep: 1 / 120, think: 12, dodge: 0.5, dodgeX: 27, threat: 18, reach: 0.6, win: [0.15, 0.45], idle: 0.8, poolSteps: 10000, determinism: 3000, averageMS: 0.3 },
};

export const FIND_COPY = {
  crafts: ['PRINT', 'VIDEO', 'MOTION', 'SCREEN'],
  wayfinderRunes: 'print video motion screen',
  wayTally: '{craft}: {n} of {t} stops', wayAll: 'All four: {names}', hoardTally: 'Hoard {n} of {t}',
  hoardHints: ['Dig three times, then open it.', 'Dig twice more.', 'Dig once more.', 'Open it.', 'Press it to see the piece again.'],
  huginn: 'Huginn, thought', muninn: 'Muninn, memory', ravenFrom: 'Brought back from {name}',
  reelToCome: { t: 'Reel to come', todo: 1 }, reelLabel: 'Memory reel, piece to come', rubHint: 'Rub to reveal', rubDo: 'Rub it for me',
  serpentLeaves: [['FRI', '5 PM'], ['TODAY', 'EOD'], ['NOW', 'ASAP']], serpentFed: 'Shipped', serpentShippedHint: 'Shipped. Poke him to start the next one.',
  hoards: [
    { id: 'hoard-laurier', kind: 'bundle', stop: 'laurier', x: 208, y: 282, title: 'Piece to come', image: null, label: 'A scratch in the ground near Laurier. Dig three times, then open it.' },
    { id: 'hoard-hmc1', kind: 'screen', stop: 'hmc1', x: 404, y: 288, title: 'SafetyDrivesUs logo and website', image: null, label: 'A scratch in the ground near HMC Connections. Dig three times, then open it.' },
    { id: 'hoard-hmc2', kind: 'book', stop: 'hmc2', x: 371, y: 365, title: '2020/2021 annual report', image: PIECE_IMAGE, label: 'A scratch in the ground near HMC, again. Dig three times, then open it.' },
    { id: 'hoard-interkom', kind: 'book', stop: 'interkom', x: 452, y: 558, title: 'Melanoma Canada booklet', image: null, label: 'A scratch in the ground near Interkom. Dig three times, then open it.' },
    { id: 'hoard-lennard', kind: 'sheet', stop: 'lennard', x: 228, y: 728, title: '1 King Street W flyer', image: null, label: 'A scratch in the ground near Lennard. Dig three times, then open it.' },
  ],
  ravenTime: ['00:00', '00:05'],
  serpentNames: ["final","final_v2","final_v2_FINAL","final_v3_FINAL","final_v3_FINAL_real"],
  serpentLines: [{ t: 'A shipped story goes here.', todo: 1 }, { t: 'A shipped story goes here.', todo: 1 }, { t: 'A shipped story goes here.', todo: 1 }],
  serpentLeaf: ['FRI', '5 PM'],
  beaconNotes: [
    { x: 442, y: 412, rune: 'note one', t: { t: 'A note in invisible ink goes here.', todo: 1 } },
    { x: 455, y: 458, rune: 'note two', t: { t: 'A note in invisible ink goes here.', todo: 1 } },
    { x: 552, y: 372, rune: 'note three', t: { t: 'A note in invisible ink goes here.', todo: 1 } },
  ],
  runestoneRunes: 'first sketch final cut',
  poster: { head: 'WANTED', who: 'ONE DESIGNER', line1: 'who sees a job through, from', line2: 'first sketch to final cut', reward: 'REWARD: THE WORK', stamp: 'PRINT', back: ['Stock: to come', 'The brief: to come'], foot: { t: 'Stock: to come. The brief: to come.', todo: 1 } },
  hammerFact: { t: 'A fact from the game design year goes here.', todo: 1 },
  hammer: {
    title: 'Hold the bridge', intro: 'Giants march on Bifröst. Throw Mjölnir at them; it always flies back to your hand.',
    controls: 'Move: arrows or A/D, or point. Throw: hold Space, Up or W, or press. T or Keep throwing toggles automatic throws. P pauses.',
    controlsTouch: 'Drag anywhere to move Járngreipr. Keep a finger down to throw. Keep throwing toggles automatic throws. Pause takes a breath.',
    field: 'Hold the bridge playfield. Left/Right or A/D move; Space, Up or W throw; T keeps throwing; P pauses; 1, 2, 3 choose a rune; Escape closes.',
    start: 'Start a run', waveLine: 'Wave {n} of 7', waveStart: 'Wave {n} begins.',
    runeTitle: 'Wave {n} held. Take a rune.', runeKeys: 'Choose with 1, 2 or 3, or press a rune.',
    runeTaken: '{name}, level {n}, taken.', runeLevel: '{key}. {name}, level {n}. {line}',
    pause: 'Paused', pauseButton: 'Pause', resume: 'Resume', newRun: 'New run', close: 'Close', auto: 'Keep throwing',
    lost: 'The bridge fell at wave {n}.', lostHearts: 'Your hearts gave out at wave {n}.', won: 'Hrungnir falls. The bridge holds.',
    heartLost: 'A heart lost. {n} heart{s} left.', gift: 'A Valkyrie leaves a heart and silver.',
    stats: '{silver} silver. {foes} foe{s} felled.', best: 'Best run: {silver} silver.', silver: '{n} silver', hearts: '{n} of {max} heart{s}', runes: 'Runes taken',
    boss: 'Hrungnir', clay: 'Mökkurkálfi rises.', heart: "Hrungnir's stone heart is bare.",
    foes: { draugr: 'Draugr', rime: 'Rime giant', fire: 'Son of Múspell', wolf: 'Wolf', chief: 'Giant chief' },
    fates: [
      ['Fimbulwinter', 'Everything moves slower in the cold, the glove too.'],
      ["Múspell's heat", 'Embers split twice.'], ['Wolf-age', 'Wolves run in packs.'],
      ['Shield-maidens', 'The shield wall stands doubled.'], ["Hel's tide", 'A fallen draugr rises once.'],
    ],
    runes: [
      ['Thurisaz, thorn', 'Pass through {n} more foe{s} on the way up.'], ['Raidho, ride', 'Fly {n}% faster, out and back.'],
      ['Kenaz, torch', 'Burn for 1 damage after 0.8 s; spread to {n} neighbour{s}.'], ['Gebo, gift', 'Gain one heart now; hold {n} heart{s} at most.'],
      ['Hagalaz, hail', 'Throw {n} hail shard{s} sideways when the hammer turns.'], ['Naudiz, need', 'With one heart, hit {n} time{s} as hard.'],
      ['Isa, ice', 'Foes and their shots move {n}% slower.'], ['Jera, harvest', 'Heal {n} heart{s} when a wave is held.'],
      ['Eihwaz, yew', 'Deal {n} more damage on the way back.'], ['Laguz, water', 'Bend toward the nearest foe at strength {n}.'],
      ['Dagaz, day', 'Survive {n} ending blow{s} per run; clear the falling shots.'], ['Ehwaz, horse', 'Move the glove {n}% faster.'],
    ],
  },
  horn: ['Skál.', { t: 'A line from someone I worked with goes here.', todo: 1 }],
  norns: [['Urd', 'what was'], ['Verdandi', 'what is'], ['Skuld', 'what shall be']],
  nornKicker: '{name}, {time}', wellStop: '{name}, {dates}',
  wellNone: 'nothing yet', wellMap: 'the whole map', wellNext: 'not yet carved',
  // One short line of what to do, shown above the step buttons while a find has the camera. Draft copy.
  wayPickedHint: 'Pick another craft, or press the centre to clear.',
  hints: { wayfinder: 'Pick a craft to light the stops that used it.', hoards: 'Dig three times, then open it.', ravens: 'Press to send a raven out.',
    serpent: 'J\u00f6rmungandr, the revision loop. Poke him.', beacon: 'Press the tower for the next note, or drag to aim the beam.', runestone: 'Rub the stone to lift its carving.',
    hammer: 'Press it to hold the bridge.', mist: 'Press or wipe to clear it.', horn: 'Press to raise them, press again to clink them.',
    well: 'Drop a pebble in. The Norns answer.', longship: 'Pull three times to fly its pennant.' },
  shipLog: 'The crossing of uncertainty', longship: { t: '2023: Dan to write this line.', todo: 1 },
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
  xEase: [0.5, 1], xAnchorY: 0.42, xFloor: 0.85, xGroupPhone: [-16, 108], xBand: [0.42, 0.62], xMargin: 16, xPhoneFloor: .8, frameBottom: 885.5, xGap: 12, timeline: 56,
  footerX: [0.68, 0.3], footerXPhone: [0.58, 0.5],
};

export const HOLD = { zoomIn: [0, 0.18], zoomOut: [0.86, 1], open: [0.1, 0.32], fold: [0.72, 0.92], visited: 0.3 };

// Clock-driven journey. Pace and animation durations are seconds.
export const STEPS = {
  // A move pressed while moving (D5): shortest durations in seconds; centre acceleration caps in lengths of the screen's longer side per second squared (D5-1); the duration search's step, sample and limit.
  carry: { min: 0.35, hurryMin: 0.45, acceleration: 1.2, hurryAcceleration: 3, searchStep: 0.05, sample: 0.016, searchMax: 30, fillBlend: 0.3 },
  heroCurve: [0,.05,.1,.9,.95,1], scroll: { gesture: 250, swipe: 24, slop: 6, line: 16, velocityWindow: 80 },
  glide: { seconds: [2.6, 4.2], ease: 'cosine-ramp', ramp: 0.18, cruiseSwell: 0.05, distancePower: 0.5, fold: 0.5, open: 0.5, openWindow: 0.6,
    secondsPhone: [2.6, 4.4], zoomOut: 0.26, zoomOutPhone: 0.1, zoomLength: 160, overviewDistance: 300, controls: 8, samples: 2048, warmDelay: 0.1, warmGap: 0.05 },
  pace: { hero: 0.9, handoff: 2.8, overview: 0.8, pushIn: 1.6, holdIn: 1.0, holdOpen: 0.4, holdOut: 0.6,
    legBase: 0.8, legPerVh: 0.006, legMax: 2.4, legX: 1.2, rush: 3.0, blast: 1.6, settle: 1.3 },
  ramp: 0.35, back: 0.6, hurry: 0.3, minMove: 0.3, cut: [0.18, 0.32],
  nav: { h: 44, gap: 14, bar: 52 },
  frameMax: 0.05, reveal: 0.3,
  shine: { time: 700, reduced: 600, cooldown: 2500, glow: 14, alpha: 0.65 },
};

export const EXPLORE = { in: 1.6, out: 0.9, most: 3, margin: 24, marginPhone: 12, wheel: 0.0016, wheelMax: 120, pinchWheel: 0.01,
  footerFade: 0.5, clickRelease: 500, pressWait: 120, rowDelay: 0.4, rowFade: 0.2,
  keyPan: 90, keyShift: 3, calmAlpha: 0.35, calmScale: 0.6, autoReserve: 2,
  ease: 0.12, slop: 6, friction: 5, velocityWindow: 0.08, key: 1.25, hintTime: 8, linePx: 16,
  bar: { edgePhone: 16, padStart: 14, padEnd: 34, arrowPhone: 12 },
  // keep: the share of the view's width and height a pan keeps on the map frame (L-15)
  keep: 0.65 };
// A growing card's scale (1 = open) at which the stone mark hands over to the card's face, and at which its words come in.
export const CARD_GROW = { face: [0, 0.002], words: [0.16, 0.42] };
export const CARD_CLOSE = { time: 0.45, hit: 44, inset: 0, icon: 12, stroke: 1.6 };
export const CARD_TAIL = { base: 28, basePhone: 24, gap: 2, len: 84, lenShort: 40, ringGap: 5, edgeGap: 9, minLine: 16, dot: 2.8, bar: 32, barGap: 1, reviewGap: 8, paintTime: 0.4 };
// Copied from the hero's NAME table, entrance name renderer and EASE curves.
export const FOOT_NAME = { radius: 0.95, near: 1.2, hop: 0.16, rise: 0.07, feel: 1.3, wave: 55, open: 9,
  spring: 240, damp: 12, kick: 26, red: C.red, dy: 1.4, far: -1e5, fallbackEm: 16,
  weight: [300, 800], wipe: [0.475, 0, 0.075, 1], enter: [0.23, 1, 0.32, 1], name: [[0.08, 0.4], [0.16, 0.48]],
  clipBottom: 3, clipSlack: 7, clipLeft: -50, clipRight: 150, clipFloor: 200,
  openEpsilon: 0.003, radiusEpsilon: 0.5, paintEpsilon: 0.001, restEpsilon: 0.0005, speedEpsilon: 0.005,
  solveIterations: 40, solveEpsilon: 1e-7, measureSize: 100 };

// travZoomed: the traveller's size at the overview against its size at a stop (K-3)
export const STARS = { count: 420, red: 0.05, dprCap: 3, fall: { window: .88, stagger: .1, coastEnd: .84, traveller: [.15,1] }, drift: 0.012, parallax: 14, travZoomed: 0.75,
  sky: 300, skyShare: 0.38, skyLook: 0.5, skyFollow: 0.04, twinkle: 0.35, skyPush: 26,
  skyReserve: 200, skyMargin: 10, skyEdge: 14, skyShock: 90, skyF: [0.5, 1.6], skyMove: [0, 0.3], skyCover: [0.25, 0.75],
  skySeed: 157, fieldZ: [0.25, 1], fieldR: [0.5, 1.6], fieldAlpha: [0.35, 0.95],
  supply: { seed: 173, alpha: 0.4, radius: 0.65, margin: 0.04, fade: [0.7, 1], out: 0.04 },
};

// All new depth geometry, drawing paths and tuning values. Random identities are unit samples;
// the renderers turn them into these live ranges on each frame.
export const DEPTH = {
  base: 0.045, gain: 0.55, look: 26, lookEase: 0.22, idleFps: 12, arc: 0.26, arcLen: 160,
  minK: 0.05, epsilon: 0.01, seed: 137, dpr: 3,
  fade: { sea: [0.2, 0.7], blast: [0, 0.45] },
  frame: { inner: [22, 22, 578, 878], outer: [14.5, 14.5, 585.5, 885.5] },
  rings: { on: 1, scale: [1.05, 1.10, 1.16], a: [-0.12, -0.24, -0.36], alpha: [0.55, 0.36, 0.2], colour: 'mid', width: 1, dash: [2, 5] },
  outer: { on: 1, cell: [66, 48], fill: 0.8, alpha: [0.5, 0.2], fade: 420, rays: 0.1,
    area: [-1000, -200, 1600, 1100], jitter: 0.8, width: 0.7, wave: [2.5, -3, 5], waveCount: 3, origin: [92, 716], n: 16, angle: 0.2, reach: 1600 },
  light: { on: 1, dark: 0.45, darkPhone: 0.25, r: 0.55, core: 0.35, ptrR: 0.3, ptrCore: 0.3, amb: 0.35, card: 0.6, visit: 0.35, rush: [0, 0.5] },
  field: { area: [-100, -50, 700, 950], wrapFade: 60, sprite: 384, spriteMid: 0.4, spriteAlpha: 0.5 },
  mist: { on: 1, n: 120, nPhone: 60, a: [0.5, 1.8], r: [14, 36], stretch: [2.2, 3.4], turn: 0.2, alpha: [0.06, 0.14], near: [0.12, 0.42], thin: 0.35, show: [1.1, 1.3], pass: [2.4, 3.4], wind: 2.2 },
  // The cloud deck the Set out dive passes through: a soft veil, never a wash (at most about 1.6 times the overview's brightness).
  deck: { on: 1, n: 60, nPhone: 34, a: [6.5, 11], r: [50, 120], stretch: [1.6, 2.6], alpha: 0.035, boost: 1, show: [1.6, 1.9], peak: [1.8, 2.3], pass: [2.3, 3.0] },
  clouds: { on: 1, show: [0.3, 0.8], pass: [2.0, 2.9], sway: [14, 26], period: [50, 90], low: 2,
    list: [[-150, 150, 1.5, 3, 1, 7.0], [-250, 520, 1.1, 1, -1, 6.4], [-90, 800, 0.9, 2, 1, 7.6], [760, 110, 1.2, 1, 1, 6.8], [860, 430, 1.6, 3, -1, 7.4],
      [720, 760, 1.0, 2, -1, 6.2], [30, 330, 0.8, 2, 1, 8.2], [575, 690, 0.8, 2, -1, 8.0], [300, -30, 1.3, 3, 1, 7.2], [900, 935, 1.2, 1, -1, 6.6],
      [-62, 150, 0.42, 2, 1, 0.5], [-96, 300, 0.5, 1, -1, 0.7], [-58, 452, 0.38, 2, -1, 0.4], [-104, 610, 0.5, 3, 1, 0.6], [-64, 770, 0.4, 1, 1, 0.5],
      [662, 120, 0.44, 1, -1, 0.6], [700, 270, 0.4, 2, 1, 0.4], [668, 420, 0.5, 3, -1, 0.7], [706, 570, 0.4, 2, -1, 0.5], [666, 730, 0.46, 1, 1, 0.6]] },
  dust: { on: 1, n: 240, nPhone: 120, tile: [800, 600], a: [-0.85, -0.2], r: [0.5, 1.1], alpha: [0.25, 0.75], show: [0.12, 0.4] },
  wolves: { on: 1, legs: [2, 4], from: 0.06, to: 0.94, ramp: 0.1, size: [1.05, 1.8, 860], margin: [0.06, 70], yTop: 0.16, arcH: [0.24, 0.16], lag: 64,
    gap: 24, maxBand: .55, minBand: 360, bandBlend: 120, sunR: 18, glowR: 7, motes: 10, spark: '#FFE2A6',
    skoll: { window: [.36,.98], k: 1, gallop: 2.4, swing: 24, bob: 0.5 }, hati: { window: [.02,.66], k: 1.12, gallop: 1.7, swing: 20, bob: 1.3 } },
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
    skoll: {"front":"M6 -10C2 -4 4 4 10.5 8.6C15 11.6 20 13.2 24.6 14C27.2 14.4 29.4 15.4 32 15C33.6 14.6 33.8 13 32.4 12.4C30 11.6 28 11.6 25.8 10.8C22.2 9.6 20.6 7.2 19.8 4.4C19.2 1.6 19.6 -2 18.6 -5C16.6 -9.6 11 -11.4 6 -10Z","hind":"M-12 -10.6C-9.6 -5 -10.6 2 -15.4 6.2C-19.4 9.2 -24.6 10.4 -29.4 11.4C-33.6 12.2 -38 13.4 -41.6 14.4C-44.2 15 -46.2 14.6 -45.8 13C-45.4 11.8 -43.6 11.4 -41.6 11C-38.4 10.2 -34.6 9 -31.4 7.4C-28.6 5.8 -27.4 2.6 -27.4 -1.2C-27.4 -5.6 -25 -9.4 -21 -11C-17.6 -12.2 -14 -12 -12 -10.6Z","farFront":"translate(-2.6 2) rotate(13 10 -2)","farHind":"translate(2 1.6) rotate(-12 -19 -4)","body":"M40.6 -9.2C39 -11 35.8 -12.2 32.2 -13.2C30.6 -15.4 29 -17 27 -17.8L23.6 -25.2L21.8 -18.4L19.8 -24.2L18.2 -17.6C16.2 -17.8 14 -17.6 12.6 -16.6C10.6 -15.4 8.4 -14.8 6 -14.4C-3 -12.6 -10 -11.6 -17 -12.2C-21.4 -12.6 -24.8 -12.2 -27.4 -10.6C-34 -14.2 -43.6 -15 -50.4 -13.4C-54.4 -12.4 -57.6 -10.4 -59 -8.2C-53.6 -5.8 -46 -4.4 -38.6 -4.4C-33.6 -4.2 -30.4 -3 -28.8 -0.8C-26.4 2.8 -21 4.8 -15.4 4.4C-9 4 -3 7.6 4 8.8C9.4 9.6 14.6 9.2 18.6 6.2C21.6 3.8 23.4 0.6 25 -1.2L24.4 1L26.6 -0.4L28.6 -2.2C31.6 -3 35.4 -3.6 38.4 -4.2C39.2 -4.4 39.6 -4.8 39.2 -5.2L32.6 -7.4L37.4 -7.9L37.9 -6.4L38.5 -8.1L40.2 -8.3C40.8 -8.4 40.9 -8.9 40.6 -9.2Z","lines":["M17.2 -14Q15.6 -10 16.8 -6.4","M-36.6 -8.6Q-44.6 -9.6 -52.6 -9","M29.6 -10.6Q27.8 -8.4 26.8 -5.6"],"marks":["M13.1 -2.26L13.06 -2.06L12.96 -1.87L12.78 -1.7L12.54 -1.57L12.24 -1.52L11.92 -1.56L11.6 -1.69L11.31 -1.93L11.07 -2.26L10.93 -2.67L10.9 -3.12L11 -3.59L11.23 -4.05L11.59 -4.44L12.07 -4.74L12.64 -4.91L13.26 -4.93L13.88 -4.78L14.47 -4.45L14.98 -3.97L15.35 -3.34L15.56 -2.62L15.57 -1.84L15.37 -1.05L14.96 -0.32L14.35 0.3L13.59 0.75L12.7 1","M-19.91 -2.89L-19.9 -2.69L-19.81 -2.48L-19.64 -2.29L-19.4 -2.14L-19.1 -2.07L-18.76 -2.08L-18.42 -2.2L-18.1 -2.43L-17.83 -2.75L-17.66 -3.17L-17.6 -3.64L-17.67 -4.14L-17.88 -4.63L-18.24 -5.07L-18.72 -5.41L-19.3 -5.63L-19.95 -5.68L-20.61 -5.56L-21.25 -5.26L-21.81 -4.78L-22.25 -4.15L-22.51 -3.4L-22.57 -2.58L-22.41 -1.74L-22.02 -0.95L-21.42 -0.26L-20.65 0.27L-19.73 0.59"],"eye":"M28.6 -13.2L31.2 -12.4L28.8 -11.8Z"},
    hati: {"front":"M5 -10C0 -4 2 4 9.5 9C14 12 19 13.6 23.6 14.6C26.2 15 28.4 16.2 31 16C32.8 15.6 33 13.8 31.4 13.2C29 12.2 27 12 24.8 11C21.2 9.6 19.8 7 19.2 4C18.6 1 19.2 -2.6 18 -5.6C15.8 -10.2 10 -11.6 5 -10Z","hind":"M-12 -10.6C-9.4 -4.6 -10.4 2.4 -15.4 6.8C-19.6 10 -24.8 11 -29.6 12C-33.8 12.8 -37.8 14 -41.2 15C-43.8 15.6 -45.8 15.2 -45.4 13.6C-45 12.4 -43.2 12 -41.2 11.6C-38 10.8 -34.4 9.6 -31.2 8C-28.4 6.4 -27.4 3 -27.6 -1C-27.8 -5.8 -25.2 -9.8 -21 -11.2C-17.6 -12.4 -14 -12.2 -12 -10.6Z","farFront":"translate(-2.6 2) rotate(13 10 -2)","farHind":"translate(2 1.6) rotate(-12 -19 -4)","body":"M41.6 -6.2C40.4 -8.6 37.4 -10.4 33.6 -11.8C31.8 -13.6 30 -14.8 28.2 -15.2L21.6 -19.6L24.4 -15.4L18.8 -18.2L21 -14.6Q18.46 -18.47 13.85 -18.91Q15.48 -17.21 16.15 -14.95Q14 -19.49 9.11 -20.66Q10.85 -18.24 11.3 -15.3Q9.04 -19.65 4.23 -20.61Q5.93 -18.4 6.45 -15.65Q3.86 -19.42 -0.71 -19.76Q0.9 -18.16 1.6 -16C-6 -15.2 -12.4 -14.2 -18 -13.6C-22.4 -13.4 -25.6 -13 -28 -11.6Q-31.8 -14.97 -36.85 -14.45Q-35.92 -13.31 -35.5 -11.9Q-39.1 -15.67 -44.32 -15.55Q-43.32 -14.01 -43 -12.2Q-46.56 -16.06 -51.81 -16.05Q-50.8 -14.41 -50.5 -12.5Q-54.25 -15.97 -59.34 -15.55Q-58.39 -14.31 -58 -12.8L-63.4 -8.8Q-64.18 -7 -65.59 -5.65Q-60.15 -4.06 -55.3 -7Q-56.09 -4.8 -57.67 -3.06Q-51.96 -1.83 -47.2 -5.2Q-47.99 -2.89 -49.61 -1.07Q-43.84 0.08 -39.1 -3.4Q-39.88 -1.4 -41.38 0.14Q-35.81 1.56 -31 -1.6C-28.8 2.4 -23 5 -16.6 5.2Q-16.99 6.68 -17.91 7.89Q-13.91 8.71 -10.6 6.3Q-10.98 7.98 -11.98 9.39Q-7.86 10.02 -4.6 7.4Q-4.98 9.08 -5.98 10.49Q-1.86 11.12 1.4 8.5Q1.01 9.98 0.09 11.19Q4.09 12.01 7.4 9.6C11.4 9.8 15.2 8.8 18.2 6.6Q18.7 7.84 18.69 9.17Q21.38 7.19 21.73 3.87Q22.47 5.3 22.59 6.91Q25.2 4.61 25.27 1.13Q25.85 2.44 25.88 3.86Q28.54 1.77 28.8 -1.6C32.4 -2.2 36 -2.4 38.8 -2.6C39.8 -2.8 40.2 -3.2 39.6 -3.6L37.4 -4.2L36.9 -5.9L35.9 -4.5L32.8 -5.4L37 -6.4L37.5 -4.8L38.4 -6.7L40.6 -6.4C41.4 -6.4 41.8 -6 41.6 -6.2Z","lines":["M-40 -9.4Q-47 -10.4 -54 -9.8","M29.6 -9Q28 -7.2 27.2 -4.8"],"marks":["M10.8 -5.52A3.6 3.6 0 0 1 14.4 0.72A4.5 4.5 0 0 0 10.8 -5.52Z","M-21.3 -6.49A3.8 3.8 0 0 1 -17.5 0.09A4.75 4.75 0 0 0 -21.3 -6.49Z"],"eye":"M29.2 -11.4L32.2 -10.6L29.4 -9.8Z"},
    sun: {"disc":"M8 0A8 8 0 1 1 -8 0A8 8 0 1 1 8 0Z","rays":"M10.6 1.5L16 0L10.6 -1.5ZM8.43 6.6L11.6 6.7L9.93 4ZM4 9.93L8 13.86L6.6 8.43ZM-1.5 10.6L0 13.4L1.5 10.6ZM-6.6 8.43L-8 13.86L-4 9.93ZM-9.93 4L-11.6 6.7L-8.43 6.6ZM-10.6 -1.5L-16 0L-10.6 1.5ZM-8.43 -6.6L-11.6 -6.7L-9.93 -4ZM-4 -9.93L-8 -13.86L-6.6 -8.43ZM1.5 -10.6L0 -13.4L-1.5 -10.6ZM6.6 -8.43L8 -13.86L4 -9.93ZM9.93 -4L11.6 -6.7L8.43 -6.6Z"},
    moon: {"crescent":"M8.01 4.11A9 9 0 1 1 -0.41 -8.99A7.8 7.8 0 1 0 8.01 4.11Z"},
  },
};

export const NOVA_CANVAS = { dpr: 3, glowSprite: 512 };
// Performance only: label recovery after a composited gesture (seconds), raster guard (CSS px).
export const FRAME_PERF = { baseMin: .5, baseMax: 1.15, baseAhead: 1.15, baseMargin: 2, labelSettle: 0.25, rasterPad: 2, scaleMin: .87, scaleMax: 1.15, exploreMin: .8, exploreMax: 1.25, skyMin: .8, skyMax: 1.3, slack: 1.1, positionEnd: .1, scaleEnd: .001, sharpStep: .5, flingEnd: 6, starPaths: true, outerGeometry: true, rayBands: true, ringPieces: true, airEmpty: true, ringBox: 160, skyLayers: true, glideHold: true, trailPieces: true };
export const NOVA = {
  build: { kindle: 0.2, draw: 0.76, hold: 1, throbs: [0.26, 0.45, 0.60, 0.72], rise: 0.12, fall: 0.32, pull: 1.8,
    push: 0.08, pushPhone: 0.06, recoil: 0.4, veil: 0.65, veilPhone: 0.45, veilOut: 0.25, hole: [0.6, 0.18], holeBreath: 0.04,
    kindleGlow: 36, kindleAlpha: 0, kindleHeat: 0, glow: [104, 44], swell: [0.15, 0.22, 0.29, 0.35], glowAlpha: [0.18, 0.44, 0.72], throbAlpha: [0.08, 0.11, 0.14, 0.18],
    spikeGrow: 1.12, compressed: 0.6, thickness: 1.12, heat: [0.15, 0.9, 1], core: [4, 13, 9],
    arrival: [0.82, 1], arrivalTail: 0.85, jitter: [0.5, 2], jitterHz: 24,
    // The white along each arm: half its share of the arm at full heat, grown over this heat range (the held breath's white cross),
    // and gone within this many seconds of the blast, under its first flash.
    whiteReach: 0.34, whiteFrom: [0.6, 1], whiteOut: 0.06 },
  // The X's hand-over to the canvas: the canvas X's fade-in and the sprite's fade-out (s), the sprite's reach (map units), the
  // largest scale drift and screen slip (CSS px) it is shown at.
  handover: { fadeIn: 0.12, fadeOut: 0.12, reach: 20, drift: 0.02, slip: 0.5 },
  pulse: [2.6, 0.12, 0.9, 0.06], spike: [1.7, 0.2, 3.14], glow: [4.2, 0.07],
  rays: { n: 22, len: [4, 12], alpha: [0.3, 0.7], turn: 0.12, start: 1.1, width: 1, breathe: 0.7, period: [1.2, 3.2], peak: 0.16 },
  lobes: { n: 6, nPhone: 4, r: [120, 260], orbit: [40, 170], speed: [0.12, 0.3], alpha: [0.22, 0.42], breathe: 0.2 },
  waves: { n: 4, every: 2.2, reach: 0.7, alpha: 0.42, width: 1 },
  shells: [6, -4], shellDash: [2, 10],
  orbit: 0.06, embers: { n: 40, nPhone: 20, life: [2.5, 5], reach: [0.16, 0.45], alpha: 1, r: [1, 2.4], slow: 3, burst: 2, fade: [0.15, 1] },
  flare: { time: 1.6, core: 0.5, kick: 0.12, hit: 70, alpha: 0.9, reach: 0.85, auto: [7, 12], cap: 8, coreMax: 1.2, kickMax: 0.3 },
  // The original release settings stay intact. Rush sources are stratified across each sector's whole visible depth.
  gather: { ring: 0.32, swirl: 0.35, sky: 0.5, join: 0.5, stagger: 0.35, time: 0.6, tail: 0.02, tailGain: 0.08, golden: 0.6180339887498949, spread: 0.24, ringTail: 0.3,
    sectors: 12, perSector: 14, perSectorPhone: 8, sourceRing: 0.55, drain: 0.45, turnPower: 2, coreFade: 0.995, twinkleHome: [0.8, 1] },
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
// Round 7 C2: reference rig geometry, with no runtime dependency on the reference.
export const RAVEN_RIG = (() => {
  const n1 = n => +(+n).toFixed(2);
  const P = a => a.map(([c, ...v]) => c + v.map(n1).join(' ')).join('');
// rounded bumps along a polyline (outward = left of travel), for feather edges
  const bumps = (pts, b) => { let d = ''; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1], mx = (a[0] + c[0]) / 2, my = (a[1] + c[1]) / 2, dx = c[0] - a[0], dy = c[1] - a[1], L = Math.hypot(dx, dy) || 1; d += `Q${n1(mx + dy / L * b * L)} ${n1(my - dx / L * b * L)} ${n1(c[0])} ${n1(c[1])}`; } return d; };
// body and tail, one outline
  const BODY = P([['M', 6.4, -12.4], ['C', 7.4, -10.4, 6.9, -7.3, 4.5, -5.3], ['C', 2.7, -3.9, -0.8, -3.4, -4.0, -4.0],
  ['L', -8.8, -0.6], ['L', -13.4, 2.1], ['L', -12.9, -0.4], ['L', -12.4, -1.8], ['L', -7.6, -6.6],
  ['C', -6.2, -9.0, -3.2, -12.0, 0.6, -13.8], ['C', 2.4, -14.7, 4.2, -15.0, 5.6, -14.6], ['Z']]);
  const TAILLINES = P([['M', -8.6, -3.4], ['L', -12.6, 0.6], ['M', -9.0, -5.0], ['L', -12.5, -1.0]]);
// head, relative to the neck point N: a fill that reaches into the body, and an open outline (no seam at the neck)
  const N = [4.4, -14.2];
  const HEADLINE = [['M', -2.2, -0.6], ['C', -2.2, -2.0, -1.4, -3.2, 0.2, -3.7], ['C', 1.4, -4.0, 2.6, -3.8, 3.6, -3.2],
  ['C', 5.8, -3.1, 8.4, -2.3, 10.2, -0.7], ['C', 10.3, -0.4, 10.1, -0.1, 9.8, -0.1], ['C', 8.0, -0.1, 6.0, 0.1, 4.0, 0.3],
  ['L', 3.5, 0.2], ['L', 3.7, 1.1], ['L', 2.8, 0.8], ['L', 3.0, 1.9], ['L', 2.0, 1.5], ['L', 2.1, 2.6], ['L', 1.3, 2.1], ['L', 1.4, 3.0]];
  const HEADFILL = P([...HEADLINE, ['L', -1.0, 3.4], ['L', -3.0, 1.6], ['Z']]);
  const HEADOUT = P(HEADLINE);
  const BILL = P([['M', 3.4, -1.2], ['C', 5.2, -1.4, 7.2, -1.1, 8.8, -0.6], ['M', 3.6, -3.1], ['C', 4.3, -2.6, 4.9, -2.1, 5.3, -1.6]]);
  const EYE = [1.5, -2.2, 0.4];
// the wing, drawn open with its length straight up from the shoulder (origin), the hand's fingers at the top, the fan to the back (-x)
  const TIPS = [[-1.0, -20.0], [-3.3, -21.2], [-5.8, -20.8], [-8.0, -19.2], [-9.7, -16.6]];
  const HC = [-4.6, -10.0]; // the hand's centre, for the notches between fingers
  const fingers = () => {
  let d = ''; const dir = t => { const dx = t[0] - HC[0], dy = t[1] - HC[1], L = Math.hypot(dx, dy); return [dx / L, dy / L]; };
  TIPS.forEach((t, i) => {
    const [ux, uy] = dir(t), px = -uy, py = ux, w = 0.85, r = 1.1;
    const a = [t[0] - ux * r + px * w, t[1] - uy * r + py * w], b = [t[0] - ux * r - px * w, t[1] - uy * r - py * w];
    d += `L${n1(a[0])} ${n1(a[1])}Q${n1(t[0] + ux * 0.5)} ${n1(t[1] + uy * 0.5)} ${n1(b[0])} ${n1(b[1])}`;
    if (i < TIPS.length - 1) { const nx = (t[0] + TIPS[i + 1][0]) / 2, ny = (t[1] + TIPS[i + 1][1]) / 2, k = 0.42; d += `L${n1(nx + (HC[0] - nx) * k)} ${n1(ny + (HC[1] - ny) * k)}`; }
  });
  return d;
};
  const TRAIL = [[-10.0, -13.8], [-9.8, -10.6], [-9.0, -7.6], [-7.8, -4.8], [-5.8, -2.2], [-3.0, 0.0], [0.8, 0.6]];
  const WING = `M0.8 0.6C1.2 -3.6 1.0 -7.6 -0.2 -11.4` + fingers() + `L-10.0 -13.8` + bumps(TRAIL, 0.16) + 'Z';
  const WINGLINES = P([['M', -0.6, -11.2], ['C', -3.4, -10.0, -6.6, -10.2, -9.6, -11.6], ['M', -0.4, -6.2], ['C', -2.8, -5.4, -5.6, -5.4, -8.8, -6.6]]);
  const S = [0.4, -11.8]; // shoulder
  const LEGS = P([['M', -0.9, -3.8], ['L', -0.7, 0], ['M', 1.3, -3.9], ['L', 1.6, 0], ['M', -2.2, 0.1], ['L', 0.4, 0.1], ['M', 0.4, 0.1], ['L', 2.8, 0.2]]);
  const HIP = [0.2, -4.0], PIV = [-2.0, -8.0]; // the body group turns about PIV
  const POSES = {
  sit: { sq: [1, 1], body: 0, head: 0, wing: [-121, 0.3, 0.66], far: [-121, 0.26, 0.6], legs: 1 },
  unfold: { sq: [1.03, 0.94], body: 12, head: -6, wing: [-72, 0.66, 0.84], far: [-70, 0.58, 0.78], legs: 0.7 },
  up: { sq: [1.08, 0.84], body: 26, head: -18, wing: [-34, 1, 1], far: [-26, 0.86, 0.9], legs: 0 },
  mid: { sq: [1.08, 0.84], body: 28, head: -20, wing: [-92, 1, 0.55], far: [-88, 0.86, 0.5], legs: 0 },
  down: { sq: [1.08, 0.84], body: 28, head: -20, wing: [-150, 1, 0.82], far: [-148, 0.86, 0.75], legs: 0 },
  glide: { sq: [1.1, 0.82], body: 28, head: -22, wing: [-62, 1, 0.62], far: [-56, 0.86, 0.56], legs: 0 },
  flare: { sq: [1.02, 0.96], body: 4, head: -2, wing: [-22, 1, 1], far: [-14, 0.86, 0.92], legs: 0.8 },
};
  const spl = (Pt, seg = 8) => { const n = Pt.length, out = []; const g = i => Pt[Math.max(0, Math.min(n - 1, i))]; for (let i = 0; i < n - 1; i++) { const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2); for (let j = 0; j < seg; j++) { const t = j / seg, t2 = t * t, t3 = t2 * t; out.push([0, 1].map(k => .5 * (2 * p1[k] + (p2[k] - p0[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * t3))); } } out.push(Pt[n - 1]); return out; };
  const tube = (Pt, w0, w1) => { const S = spl(Pt), n = S.length, L = [], R = []; for (let i = 0; i < n; i++) { const a = S[Math.max(0, i - 1)], c = S[Math.min(n - 1, i + 1)], dx = c[0] - a[0], dy = c[1] - a[1], l = Math.hypot(dx, dy) || 1, t = i / (n - 1), w = (w0 + (w1 - w0) * t) / 2; L.push([S[i][0] - dy / l * w, S[i][1] + dx / l * w]); R.push([S[i][0] + dy / l * w, S[i][1] - dx / l * w]); } return 'M' + [...L, ...R.reverse()].map(p => n1(p[0]) + ' ' + n1(p[1])).join('L') + 'Z'; };
  const TK = 1.45; // the tree is drawn at 1/1.45 and scaled up
  const PERCHES = [[-11 * TK, -18.2 * TK], [11 * TK, -28.4 * TK]]; // Huginn (faces left), Muninn (faces right)
  const TREE = [
  tube([[0, 0.6], [0.4, -5], [0.6, -10], [0.8, -13.4]], 4.6, 2.8),
  tube([[0.4, -11.6], [-3, -15.2], [-7, -17.4], [-11, -18.2], [-15.6, -18.6]], 2.6, 0.5),
  tube([[0.8, -13], [2.6, -18], [5, -23.4], [8, -27], [11, -28.4], [15.4, -29.2]], 2.4, 0.5),
  tube([[-6.4, -17.1], [-7.4, -20.4], [-7.0, -23.6]], 1.0, 0.3),
  tube([[4.6, -22.6], [3.4, -27.4], [3.8, -31.2]], 1.0, 0.3),
  tube([[0.3, -7.6], [-2.6, -9.0], [-4.4, -9.2]], 1.2, 0.4),
];
  const TREELINES = 'M-1.6 0.6Q-3.6 1.2 -5.4 1.8M1.8 0.6Q3.8 1.2 5.6 1.6M-0.4 -2V-9M1.2 -3.2V-8.4M-15 2H15';
  return { BODY, TAILLINES, N, HEADFILL, HEADOUT, BILL, EYE, WING, WINGLINES, S, LEGS, HIP, PIV, POSES, TK, PERCHES, TREE, TREELINES,
    farOffset: [1.2, -0.8], treeLine: 2.2, itemAt: [10.2, -0.7],
    hit: [-31.4, -61, 63.8, 67], restBox: [-28.4, -58, 29.4, 3],
    gift: [4, -1], hopSlope: [-0.087, -0.174], shyTime: 0.25, hopHeight: 1.5,
    crouch: 0.12, unfold: 0.18, outPower: 1.6, backPower: 2, controls: [[10, -26], [55, -32]], endY: -29,
    turn: 0.12, hysteresis: 0.1, perchTurn: 0.16, settle: 0.2, land: 0.35, level: 0.3,
    dip: 0.15, dipAngle: 25, itemFade: 0.2, offFrame: 12, birdMargin: 18,
    loopRadius: 20, loopCentre: [20, 0], loopTakeoff: 0.2, loopTime: 1.1, loopGap: 0.55, featherAt: [6, -4],
    returnBeat: 0.35, returnFlaps: 0.7, beat: ['up', 'mid', 'down', 'mid', 'up'],
    preenMove: [-1.5, 1.5], breathe: [0.012, 2.8],
  };
})();
export const FIND_PLAY = {
  fresh: 3, seed: 171,
  focus: { fill: 0.72, least: 0.85, most: 3, at: [0.5, 0.46], in: 0.7, out: 0.5, swap: 0.6, chest: [0, -40, 30], ship: [0, -10, 34], wide: [300, 450, 330, 0] },
  bits: { pool: 96, starSize: 2.2, puffAlpha: 0.22,
    kinds: { dot: ['M-.8 0a.8 .8 0 1 0 1.6 0a.8 .8 0 1 0 -1.6 0Z', 'pf'], clod: ['M-1.4 .6L-.6 -1.1L1.2 -.7L1.5 .8L-.2 1.3Z', 'g'], drop: ['M0 -1.6Q1.1 .2 0 1.1Q-1.1 .2 0 -1.6Z', 'pf'], spark: ['M0 0V-2.4', 'l'], feather: ['M0 -1.2V1.2M0 -1Q.6 -.6 0 .6M0 -.8Q-.45 -.3 0 .5', 't'], puff: ['M-3.2 0a3.2 3.2 0 1 0 6.4 0a3.2 3.2 0 1 0 -6.4 0Z', 'pf'], wisp: ['M-6 0a6 3 0 1 0 12 0a6 3 0 1 0 -12 0Z', 'mist-wisp'], ring: ['M-3 0a3 1 0 1 0 6 0a3 1 0 1 0 -6 0Z', 't'] },
    base: { speed: [0, 0], dir: [-90, -90], g: 0, drag: 0, life: [0.6, 0.6], size: [1, 1], spin: 0, alpha: 1 },
    clods: { speed: [18, 34], dir: [-150, -30], g: 90, life: [0.6, 0.6], spin: 80 },
    puffs: { speed: [3, 7], dir: [-160, -20], life: [0.6, 0.6], size: [0.4, 1.5], alpha: 0.22 },
    feathers: { speed: [2, 4], dir: [65, 115], g: 10, drag: 1, life: [0.65, 0.75], spin: 25, size: [0.65, 0.45] },
    stars: { speed: [6, 12], dir: [-120, -60], life: [1.1, 1.1], size: [1, 0.2], spin: 20 },
    drops: { speed: [8, 18], dir: [-140, -40], g: 60, life: [0.5, 0.7] },
    wake: { speed: [0, 0], life: [0.6, 0.6], size: [1, 3.5], alpha: 0.7 },
    sparks: { speed: [10, 10], dir: [-100, -80], life: [1.2, 1.2], size: [1, 0.2] },
    hop: { speed: [8, 8], dir: [-100, -80], g: 40, life: [0.4, 0.4] },
  },
  star: { time: 0.75, arc: 46, bump: 0.3, size: 14, peak: 1.3 },
  kit: { margin: 40, rad: 70, shipBerth: [40, 11, 0], starZ: 7, dt: 0.05, popup: { anchorGap: 12, anchorMax: 16, scale: 0.6, over: 1.08, time: 0.22, edge: 8, tail: [10, 6], width: 240, radius: 10, pad: [10, 14], font: 13, line: 1.4, kicker: 9.5, gap: 4 }, slot: { font: 11, weight: 500, border: 1, pad: 6 }, target: 17, sheet: { from: 0.06, edge: 24, grow: 0.35, offset: 20 }, deg: 180, turn: 360 },
  way: { stiff: 90, damp: 9, near: 70, line: 0.45, gap: 0.1, short: 9, ping: 0.5, runes: 0.6, spin: 0.8, timelineDim: 0.35, lineWidth: 1, wide: [300, 480, 250, 0],
    drift: [0.8, 4, 0.31, 2], dim: 0.55, armWidth: 2.2, pulse: [1.12, 0.25], dash: [2, 4], alpha: 0.6, solidAlpha: 0.9, pingR: [6, 14], pingAlpha: 0.7, tally: [22, 5.2, 1, 10.5, 9], ring: [4, 9, 1.6], allSpeed: 40, hub: 6,
    // The craft words sit wordGap screen px off the ring (radius wordRing) at every zoom (16: Dan's pick on preview 22, 9 sat too close); wordCap is the caps' height per font size.
    wordRing: 42, wordGap: 16, wordCap: 0.7, veilZoom: .1, veilCore: .6, veilPad: 5,
  },
  hoard: { hole: [16, 28, 38], lift: [0.18, 0.24, 1], rise: [0.28, 0.28, 0.5], backEase: 0.8, over: 1.2, repeat: 0.3, rattle: 0.36, openHold: 0.3, near: 26, glint: [5, 8],
    scale: 0.3, travel: 64, holeRatio: 0.28, pile: [0.5, 0.75, 1], scratchWidth: 1.6, glintAt: [0, -4], glintSize: 5, glintTime: 0.5, glintTurn: 45, clods: 7, rattleAngle: 4, rattleCycles: 3,
    lidTime: 0.5, lidSettle: 0.18, lidBounce: 0.3, lidPeak: 118, lidRest: 110, rim: -34, depth: 24, half: 30, lean: [90, 20, 2.4], mouthAngle: 60,
    glowR: 46, starCount: 8, starY: -44, starSizes: [6, 4], glowTime: 0.3, glowPeak: 1, glowRest: 0.6, glowKept: 0.35, stars: 6, burstTravel: [48, 34], burstLift: 14, anchor: 18, width: 260, top: 3, icon: 64, iconBox: [-32, -32, 64, 64], rad: 35, scratchHop: 2,
    hit: [0, -24, 40], clip: [-240, -200, 480, 200], pileAt: [48, 2], pilePath: 'M-7 0q6 -10 13 0z',
    clodLife: 0.6, clodSpeed: [18, 34], clodUp: [28, 44], clodSpin: 80, clodFloor: 2,
    scratchPath: 'M-23 2H23M-19 2Q-1 -13 18 2M6 -4L9 -17M7 -17L8 -22L14 -21L13 -16ZM4 -5L10 -4L8 1L5 0ZM-27 3L-25 0L-22 3ZM23 4L26 0L29 3ZM-16 5L-13 3L-10 5Z',
    body: '<rect class="g" x="-30" y="-34" width="60" height="34" rx="2"/><path class="t" d="M-18 -34V0M18 -34V0M-30 -22H30"/><rect class="pf" x="-4.5" y="-27" width="9" height="10" rx="1.5"/>',
    dome: '<path class="g" d="M-30 -34Q0 -56 30 -34Z"/><path class="t" d="M-18 -42V-34M18 -42V-34"/>',
    mouth: 'M-29 0L-27 -4.5H27L29 0Z', mouthLine: 'M-22 -2.2H22', mouthAlpha: 0.7, mouthWidth: 1.2,
    insideLines: ['M-18 0V-26', 'M18 0V-26', 'M-29 -6H29'], inside: [30, 24, 6], planks: [18, 0.6, 2, 29, -6], rimPath: 'M-1 0A1 1 0 0 0 1 0',
  },
  raven: { near: 30, shy: 4, preen: [6, 10], out: 1.1, away: 0.4, back: 1, reach: 177, flap: 4,
    scale: 0.62, birdScale: 0.85, popupAt: 61, attend: 120, squash: 0.85, preenAngle: 20, preenTime: 0.5, ruffle: [1.1, 0.3], headLimit: 35, headEase: 6, idle: [0.7, 0.43], feathers: 2, tilt: 30, strip: [4, 1.6], frame: [4, 3], tallyAlpha: 0.9,
    thoughtArt: '<path class="o" d="M0 0Q-2 -3 1 -3H8Q11 -3 10 0V4Q10 6 7 6H1Q-1 6 0 3ZM1 -3Q4 -3 3 0H0M3 6Q6 6 5 3H10"/><path class="t" d="M4 0H8M4 2H8"/>',
    frameArt: '<rect class="o" x="0" y="-3" width="10" height="8" rx="1"/><path class="pf" d="M4 -1L7 1L4 3Z"/>',
    tally: ['M6 -6V0', 'M8.5 -6V0', 'M11 -6V0', 'M13.5 -6V0', 'M6 -1L14 -5', 'M20 -6V0'],
    reel: { ringSvg: '<svg class="ring" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16"/><circle class="ring-p" cx="20" cy="20" r="16" pathLength="100" stroke-dasharray="100 100"/></svg>', timeJoin: ' / ', iris: 440, width: 360, ratio: [16, 11], motion: [1.3, 0.4, 2, 60, 1.1, 0.3, 22, 40], ring: 100, tc: '00:0{n} / {end}', labelTop: 12, slotBottom: 36 },
  },
  serpent: {"near":34,"scale":1,"bounds":[-70,-34,34,38],"head":[-17.6,-8.2],"attend":140,"headLimit":4,"headEase":5,"bob":[2.5,0.5,3.4],"jaw":20,"jawPivot":[8,8],"swell":[2.4,2.4,2.4],"restAngle":0,"breathe":[0.6,4.8],"hear":[8,0.8,4],"popup":[-65,-34],"hit":[-50,-30,62,42],"bite":0.4,"lap":2.4,"spit":0.28,"type":0.48,"open":0.6,"wake":0.6,"fileAt":[-66,-11],"returnAt":[-69,-11],"shipAt":[-70,-19],"enterAt":[-80,-5],"filePhone":13,"nameDy":-11.5,"nameSize":5,"namePhone":0.85,"shipName":[2,-1,4.6],"shippedJaw":15,"queueRest":0.4,"files":["pdf","mp4","aep","fig"],"lapStops":[0,0.3,0.7,1],"lapPlaces":[0,0.09,0.91,1],"lapSlopes":[0.14,0.65,0.65,0.14]},
  beacon: { rad: 200, read: 1.2, flame: [1, 1.35, 1.75, 2.2], leap: [3, 0.3], embers: 1.5, turn: 0, reach: 1, idle: 0.7, snap: 0.4,
    scale: 0.6, origin: [0, -34], flameFoot: [0, -31], glowR: 8, glowAlpha: 0.15, flicker: [0.08, 11, 0.05, 17.3, 0.12, 13.1], baseAngle: 196, sweep: 0.5, baseReach: 230, manual: 6, arrow: 6, slop: 6, notePhone: 1.7, noteWidths: [44,44,40], noteGuard: .2, noteGap: 4, seaPhoneFlash: 1.1, noteLine: 1.1, emberTime: .6, emberArc: 22, swellTime: .25, overshoot: .15, glowLevels: [0,.3,.55,.85], glowRadii: [1,1.3,1.65,2.1], finaleFlame: [2.2,3.4,2.4], finaleTime: .9, finaleFlash: .2, finaleRing: [150,1.4], finaleTurn: 1.8, finaleReach: 1.25, litHint: "The beacon is lit.", soft: 4, wedgeSteps: 32, rest: 0.55, sparkN: 6, burstN: 14, noteScale: 1.12, flash: 0.3, hear: [0.6, 0.3, 1.3, 0.3], englishEase: 5, noteEase: 6, noteFont: 4.6, todoFont: 3.4, runeY: -7, lineY: 7, todoY: 1, runeSize: 4.2,
  },
  rune: { hintDelay: 4, carving: 0.6, grow: 0.4, r: 34, step: 12, grid: [5, 7], done: 0.8, auto: [1.2, 1.6, 7], fill: 0.25,
    letter: [0.05, 0.18], stamp: [0.45, 0.12, 2.4], shake: [3, 0.16], tilt: 5, close: 0.3,
    width: 300, height: 400, outline: 'M40 392L28 150Q36 34 150 12Q264 34 272 156L260 392Z', outer: 'M60 380L50 152Q57 56 150 34Q243 56 250 158L240 380', inner: 'M74 380L64 154Q70 70 150 50Q230 70 236 160L226 380', feet: 'M60 380H74M226 380H240', dot: [67, 372, 2.2],
    hatch: [[-200, 520, 7, 231, 2.6, 0.42], [-100, 420, 11, 107, 1.6, 0.3]], jitter: 2, charcoal: 0.34, guide: 0.1, outlineAlpha: 0.45, outlineWidth: 1.5, carvingWidth: 4.4, maskCore: 0.6, runeHeight: 30, runeGap: 0.32, tops: [92, 158, 224, 290], cx: 150, cells: [40, 30, 260, 390], cellR: 30, letterSize: 13, letterWeight: 800, letterDown: 15, letterRise: 4, near: 24, dash: [6, 200], dashTime: 1.5, scale: 0.55, anchor: -20, stampAngle: -14, flipTime: 0.6, perspective: 1400, controlTop: 214,
  },
  drawings: {
    wayfinder: `<circle class="hit" r="58"/><circle class="o" r="42"/><circle class="t" r="34.4"/><g class="wf-runes"><path class="rn" transform="rotate(8) translate(-0.7 -40.5)" d="M0 0L0 4.6M0 0L1.4 1.2M1.4 1.2L0.8 1.7M0 4.6L1.4 3.5M1.4 3.5L0.8 2.9"/><path class="rn" transform="rotate(24.4) translate(-0.7 -40.5)" d="M0 4.6L0 0L1.4 1.2L0 2.3L1.4 4.6"/><path class="rn" transform="rotate(40.7) translate(0 -40.5)" d="M0 0L0 4.6"/><path class="rn" transform="rotate(57.1) translate(-0.7 -40.5)" d="M0.7 0L0.7 4.6M0 1.7L1.4 2.9"/><path class="rn" transform="rotate(73.5) translate(-0.7 -40.5)" d="M0.7 0L0.7 4.6M0 1.2L0.7 0L1.4 1.2"/><path class="rn" transform="rotate(89.8) translate(-0.7 -40.5)" d="M0 4.6L0 0L1.4 1.2L0 2.3"/><path class="rn" transform="rotate(106.2) translate(0 -40.5)" d="M0 0L0 4.6"/><path class="rn" transform="rotate(122.5) translate(-0.7 -40.5)" d="M0 0L0 4.6L1.4 0L1.4 4.6L0 0"/><path class="rn" transform="rotate(138.9) translate(-0.7 -40.5)" d="M0 4.6L0 0L0.7 1.2L1.4 0L1.4 4.6"/><path class="rn" transform="rotate(155.3) translate(-0.7 -40.5)" d="M0 4.6L1.4 2.3L0.7 0.9L0 2.3L1.4 4.6"/><path class="rn" transform="rotate(171.6) translate(-0.7 -40.5)" d="M0 4.6L0 0L1.4 1.7M1.4 4.6L1.4 0L0 1.7"/><path class="rn" transform="rotate(188) translate(-0.7 -40.5)" d="M0 4.6L1.4 2.3L0.7 0.9L0 2.3L1.4 4.6"/><path class="rn" transform="rotate(204.4) translate(-0.7 -40.5)" d="M0.7 0L0.7 4.6M0 1.2L0.7 0L1.4 1.2"/><path class="rn" transform="rotate(220.7) translate(0 -40.5)" d="M0 0L0 4.6"/><path class="rn" transform="rotate(237.1) translate(-0.7 -40.5)" d="M0 4.6L1.4 2.3L0.7 0.9L0 2.3L1.4 4.6"/><path class="rn" transform="rotate(253.5) translate(-0.7 -40.5)" d="M0.7 0L0.7 4.6M0 1.7L1.4 2.9"/><path class="rn" transform="rotate(269.8) translate(-0.7 -40.5)" d="M1.4 0L0 1.7L1.4 2.9L0 4.6"/><path class="rn" transform="rotate(286.2) translate(-0.6 -40.5)" d="M1.3 0L0 1.2L1.3 2.3"/><path class="rn" transform="rotate(302.5) translate(-0.7 -40.5)" d="M0 4.6L0 0L1.4 1.2L0 2.3L1.4 4.6"/><path class="rn" transform="rotate(318.9) translate(-0.7 -40.5)" d="M0 4.6L0 0L0.7 1.2L1.4 0L1.4 4.6"/><path class="rn" transform="rotate(335.3) translate(-0.7 -40.5)" d="M0 4.6L0 0L0.7 1.2L1.4 0L1.4 4.6"/><path class="rn" transform="rotate(351.6) translate(-0.7 -40.5)" d="M0.7 0L0.7 4.6M0 1.7L1.4 2.9"/></g><g class="wf-arm" data-i="0" transform="rotate(0)"><path class="l" d="M0 0V-31.08M0 -31.08l-4 -4M0 -31.08l4 -4M0 -31.08v-5"/></g><g class="wf-arm" data-i="1" transform="rotate(90)"><path class="l" d="M0 0V-31.08M0 -34.08m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/></g><g class="wf-arm" data-i="2" transform="rotate(180)"><path class="l" d="M0 0V-31.08M-4 -27.08L0 -33.08L4 -27.08"/></g><g class="wf-arm" data-i="3" transform="rotate(270)"><path class="l" d="M0 0V-31.08M-5 -31.08H5M-3 -35.08H3"/></g><g transform="rotate(45)"><path class="l" d="M0 0V-17.64M0 -17.64l-3 -3"/></g><g transform="rotate(135)"><path class="l" d="M0 0V-17.64M0 -17.64l3 -3"/></g><g transform="rotate(225)"><path class="l" d="M0 0V-17.64M-3 -17.64H3"/></g><g transform="rotate(315)"><path class="l" d="M0 0V-17.64M0 -17.64m-1.5 -2a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0"/></g><text x="0" y="-66" font-size="6.5" fill="${C.paper}" font-weight="700" text-anchor="middle" letter-spacing="1.2" class="wf-word h">${FIND_COPY.crafts[0]}</text><text x="60" y="2.5" font-size="6.5" fill="${C.paper}" font-weight="700" text-anchor="start" letter-spacing="1.2" class="wf-word h">${FIND_COPY.crafts[1]}</text><text x="0" y="90" font-size="6.5" fill="${C.paper}" font-weight="700" text-anchor="middle" letter-spacing="1.2" class="wf-word h">${FIND_COPY.crafts[2]}</text><text x="-60" y="2.5" font-size="6.5" fill="${C.paper}" font-weight="700" text-anchor="end" letter-spacing="1.2" class="wf-word h">${FIND_COPY.crafts[3]}</text><g class="wf-needle"><path class="pf" d="M0 -26L3 0L-3 0Z"/><path class="o" d="M0 26L3 0L-3 0Z"/></g><circle class="o wf-hub" r="3.4"/><circle class="t wf-all" r="{{way.ring.0}}" opacity="0"/><text x="0" y="-112" font-size="{{way.tally.1}}" fill="${C.note}" font-weight="500" text-anchor="middle" letter-spacing="{{way.tally.2}}" class="wf-tally h"></text>`,
    serpent: "<g class=\"jo-head jg-head\">\n<g class=\"jo-jaw jg-jaw\" transform=\"rotate(0 8 8)\"><path fill=\"#151314\" d=\"M-12 2.5L-40 6C-43.6 6.4 -45.4 8 -44.6 9.8C-43 12.2 -37 12.8 -31 12.6C-21 12.4 -10 12 0 10.6C10 9.4 20 8.6 32 8L32 0Z\"/><path class=\"l\" d=\"M-12 2.5L-40 6C-43.6 6.4 -45.4 8 -44.6 9.8C-43 12.2 -37 12.8 -31 12.6C-21 12.4 -10 12 0 10.6C6 9.9 11 9.4 16 9\"/><path class=\"l\" d=\"M-43 11C-46 13 -47.6 16.6 -45 18.4C-43 19.8 -40.4 18 -41.4 16.2C-42.2 15 -43.8 15.6 -43.4 16.8\"/><path class=\"pf\" d=\"M-38.6 5.7L-37.4 1.8L-36 5.4Z\"/><g class=\"jd\"><path class=\"t\" d=\"M-36 9.6C-28 10.4 -16 10 -4 8.2\"/></g></g>\n<path class=\"jg-skin\" fill=\"#151314\" d=\"M33 -8C25 -14.6 13 -18.4 1 -17.8C-9 -17.2 -17 -13.6 -25 -10.2C-33 -7 -41 -7.6 -47 -8.8C-51 -9.6 -54.6 -7.2 -54 -3.8C-53.6 -1.2 -51 .4 -48 .2L-40 -.2C-32 -.8 -22 .4 -12 2.5L33 8Z\"/>\n<path class=\"l jg-crown\" d=\"M33 -8C25 -14.6 13 -18.4 1 -17.8C-9 -17.2 -17 -13.6 -25 -10.2C-33 -7 -41 -7.6 -47 -8.8C-51 -9.6 -54.6 -7.2 -54 -3.8C-53.6 -1.2 -51 .4 -48 .2L-40 -.2C-32 -.8 -22 .4 -12 2.5\"/>\n<path class=\"l\" d=\"M-46.4 -8.7C-50.6 -10.4 -55.6 -13.4 -54.6 -18C-53.8 -21.2 -49 -21 -49 -17.6C-49 -15.6 -51.6 -15.4 -51.8 -17.2\"/>\n<path class=\"pf\" d=\"M-47.6 0L-46 5.6L-44 -.1ZM-41 -.2L-39.9 3.4L-38.6 -.3ZM-34.6 -.5L-33.7 2.4L-32.6 -.3Z\"/>\n<g class=\"jg-eye\"><path class=\"l\" d=\"M-28.5 -7.2C-24 -12.2 -15 -12.8 -9.6 -8C-14 -4.2 -23 -3.8 -28.5 -7.2Z\"/><circle class=\"pf\" cx=\"-17.6\" cy=\"-8.2\" r=\"1.7\"/></g><path class=\"l jg-shut\" d=\"M-28.5 -7.2Q-19 -2.5 -9.6 -8\" opacity=\"0\"/>\n<path class=\"l\" d=\"M-31 -9.4C-25 -15.4 -12 -16.2 -5 -10.4\"/>\n<path class=\"l\" d=\"M-12 2.5C-6 5.2 1 4.4 2.2 0C3 -3.4 -1.6 -5 -3.4 -2.4C-4.6 -.6 -2.8 1 -1.6 .2\"/>\n<path fill=\"#151314\" d=\"M-7 -16.6C0 -28 13 -35 25 -33C32 -31.8 34.6 -25.6 31 -22.6C24.6 -27.6 14 -24 9 -16Z\"/><path class=\"l\" d=\"M-7 -16.6C0 -28 13 -35 25 -33C32 -31.8 34.6 -25.6 31 -22.6C28.4 -20.6 25 -22.6 26.2 -25.4C27 -27.2 29.6 -26.8 29.2 -25M9 -16.4C13 -22.6 19 -26.6 25.6 -27.2\"/>\n<path class=\"l\" d=\"M14 -15.2C19 -20 25 -21.4 30.6 -19.2C33.4 -18 33.2 -14.6 30.8 -14.4\"/>\n<path class=\"l jg-neck-edge\" d=\"M16 9C22 8.6 28 8.2 33 8\"/><path class=\"l\" d=\"M19 -13.4C23 -5 23 3 20 9.6M25.4 -11.2C28.6 -4 28.6 2 26 8.8\"/>\n<g class=\"jd\"><circle class=\"pf\" cx=\"23.6\" cy=\"-6\" r=\".7\"/><circle class=\"pf\" cx=\"24.6\" cy=\"-1\" r=\".7\"/><circle class=\"pf\" cx=\"24\" cy=\"4\" r=\".7\"/><path class=\"t\" d=\"M-44 -5.4C-36 -4 -30 -4.6 -24 -7M2 -14.6C8 -13.6 13 -11 17 -7.6M3 -24C8 -28 14 -30 21 -30\"/><path class=\"t\" d=\"M-50.4 -5.6C-49.6 -4.6 -48.6 -4.4 -47.8 -4.8\"/></g><g class=\"jd jg-neck-detail\"><path class=\"t jg-neck-stripes\"/><circle class=\"pf jg-neck-stud\" r=\".55\"/></g></g><g class=\"jf jg-file\" transform=\"translate(-66 -11)\"><path class=\"o\" d=\"M-6 -7.5H2.5L6 -4V7.5H-6Z\"/><path class=\"l\" d=\"M2.5 -7.5V-4H6\"/><path class=\"t\" d=\"M-3.4 -2H3.4M-3.4 .8H3.4M-3.4 3.6H1\"/><g class=\"jf-stamp\" opacity=\"0\" transform=\"translate(.5 1.2) rotate(-14)\"><rect x=\"-13\" y=\"-3.4\" width=\"26\" height=\"6.8\" rx=\"1\" fill=\"#F7F6F3\" stroke=\"#151314\" stroke-width=\".7\"/><rect x=\"-12.1\" y=\"-2.5\" width=\"24.2\" height=\"5\" rx=\".5\" fill=\"none\" stroke=\"#151314\" stroke-width=\".25\"/><text text-anchor=\"middle\" y=\"1.55\" font-size=\"4.1\" font-weight=\"800\" letter-spacing=\".55\" fill=\"#151314\">SHIPPED</text></g></g><text class=\"jf-name\" x=\"-66\" y=\"-22.5\" text-anchor=\"middle\" font-size=\"5\" fill=\"#F7F6F3\" font-weight=\"500\"><tspan class=\"jf-base\">final</tspan><tspan class=\"jf-added\" font-weight=\"800\" text-decoration=\"underline\"></tspan><tspan class=\"jf-ext\">.pdf</tspan></text><rect class=\"hit\" x=\"-50\" y=\"-30\" width=\"62\" height=\"42\"/>",
    beacon: `<circle class="bc-glow" cx="{{beacon.flameFoot.0}}" cy="{{beacon.flameFoot.1}}" r="{{beacon.glowR}}" fill="url(#glow)" opacity="0"/><g class="bc-light" clip-path="url(#beacon-frame)"><g class="bc-beam" transform="translate(0 -34) rotate(0)"><path d="M0 0L-230 -44.7L-230 44.7Z" fill="url(#beam)"/></g></g><rect class="hit" x="-26" y="-66" width="52" height="70"/><path class="g" d="M-5.8 0L-4 -3L-1 -2L1 -4L3 -2L5.8 0Z"/><path class="g" d="M-5.6 -3L-4.2 -24H4.2L5.6 -3Z"/><path class="t" d="M-5.1 -9H5.1M-4.6 -17H4.6M-1 -3V-9M2 -9V-17M-2 -17V-24"/><rect class="o" x="-1.3" y="-9" width="2.6" height="6"/><path class="l" d="M-6 -24H6M-3 -24L-4 -30M3 -24L4 -30"/><path class="o" d="M-5.5 -31L-4 -26H4L5.5 -31Z"/><path class="pf bc-flame" d="M-2 -31Q-2.5 -34 0 -37Q.7 -34 1.7 -33Q2.5 -32 2 -31Z"/>`,
    runestone: `<rect class="hit" x="-20" y="-66" width="40" height="70"/><path class="g" d="M-14 0L-16 -40Q-12 -60 0 -62Q13 -60 15 -38L13 0Z"/><path d="M-10 -2L-11.5 -38Q-9 -53 0 -55Q10 -53 11 -36L9.5 -6Q9 -1 5 -3" fill="none" stroke="${C.paper}" stroke-width="4" stroke-linecap="round"/><path d="M-10 -2L-11.5 -38Q-9 -53 0 -55Q10 -53 11 -36L9.5 -6Q9 -1 5 -3" fill="none" stroke="${C.land}" stroke-width="2.2" stroke-linecap="round"/><path class="l rs-trace" d="M-10 -2L-11.5 -38Q-9 -53 0 -55Q10 -53 11 -36L9.5 -6Q9 -1 5 -3"/><circle class="pf" cx="5" cy="-3" r="1"/><g transform="translate(2.2 -9) rotate(-90)"><path class="rn" d="M0 0L0 3.4M0 1.4L1.1 0.4M0 2.3L1.1 1.4M2.2 0L2.2 3.4M3.2 3.4L3.2 0L4.3 0.8L3.2 1.7L4.3 3.4M6.5 0L5.4 1.3L6.5 2.1L5.4 3.4M8.1 0L8.1 3.4M7.5 0.8L8.1 0L8.6 0.8M13.1 0L12.1 1.3L13.1 2.1L12.1 3.4M15.2 0L14.2 0.8L15.2 1.7M16.2 3.4L16.2 0L16.8 0.8L17.3 0L17.3 3.4M18.9 0L18.9 3.4M18.4 0.8L18.9 0L19.5 0.8M21.5 0L20.5 0.8L21.5 1.7M22.6 0L22.6 3.4M23.6 0L23.6 3.4M22.6 1.3L23.6 2.1M27.1 0L27.1 3.4M27.1 1.4L28.2 0.4M27.1 2.3L28.2 1.4M29.2 0L29.2 3.4M30.9 0L30.9 3.4M30.3 1.3L31.4 2.1M32.5 0L32.5 3.4M32.5 0L33.5 0.8M32.5 1.1L33.5 2M34.6 3.4L34.6 0L35.7 0.8M40.1 0L39.2 0.8L40.1 1.7M41.2 3.4L41.2 0L42.3 1.1L42.3 3.4M43.9 0L43.9 3.4M43.3 0.8L43.9 0L44.4 0.8"/></g><path class="t" d="M-20 0H20"/>`,
  },
  icons: {
    sheet: '<rect class="l" x="-14" y="-20" width="28" height="40"/><rect class="t" x="-10" y="-16" width="20" height="12"/><path class="t" d="M-10 2H10M-10 7H10M-10 12H4"/>',
    book: '<path class="l" d="M0 -16Q-10 -20 -22 -17V15Q-10 12 0 16Q10 12 22 15V-17Q10 -20 0 -16Z"/><path class="t" d="M0 -16V16M-17 -10Q-9 -12 -4 -10M-17 -4Q-9 -6 -4 -4M-17 2Q-9 0 -4 2M4 -10Q9 -12 17 -10M4 -4Q9 -6 17 -4"/>',
    screen: '<rect class="l" x="-22" y="-16" width="44" height="32" rx="2"/><path class="t" d="M-22 -9H22"/><circle class="pf" cx="-18" cy="-12.5" r="1"/><circle class="pf" cx="-14.5" cy="-12.5" r="1"/><path class="t" d="M-16 -3H2M-16 3H10M-16 9H-2"/><rect class="t" x="8" y="-4" width="10" height="10"/>',
    bundle: '<rect class="l" x="-16" y="-12" width="32" height="26"/><path class="t" d="M0 -12V14M-16 1H16"/><path class="l" d="M0 -12q-6 -8 -9 -3q-1 4 9 3q10 1 9 -3q-3 -5 -9 3"/>',
  },
  mist: { near: 62, rad: 70, box: [102, 410, 104, 50], alpha: 0.62, grid: [8, 4], cellR: 10, done: 0.75, thirds: 3,
    wipe: 9, press: 16, finger: 14, soft: [1.7, 0.4], step: 0.4, traveller: 7, travellerEdge: 10, lift: 1.2, hear: [6, 0.8],
    fill: 'M104 430Q112 418 129 422Q145 410 163 421Q182 414 199 427Q212 438 199 447Q181 460 162 454Q144 462 130 451Q108 453 104 440Z',
    strokes: ['M106 430Q115 421 130 427Q143 417 158 425Q172 419 183 426', 'M119 435Q133 428 147 435Q161 429 176 435Q191 427 204 435', 'M105 442Q119 435 132 442Q146 437 158 443', 'M144 449Q158 442 173 449Q188 443 201 447', 'M127 455Q139 451 150 455M180 453Q190 450 197 452'],
    cairns: [[195, 424], [166, 452], [200, 440]], cairnScale: 0.8, glintAt: [0, -10.4], glintSize: 5, glintTime: 0.5, glintGap: 0.15, glintTurn: 45,
    cairn: '<path class="g" d="M-6 0Q-7 -3 -3 -4H3Q7 -3 6 0ZM-4 -4Q-5 -7 -1 -8H2Q5 -6 4 -4ZM-2 -8Q-3 -12 1 -12Q4 -11 3 -8Z"/>',
    puffs: 8, puff: { speed: [6, 12], life: [0.8, 0.8], size: [0.6, 1.3], alpha: 0.3 }, east: [0, 0], wisps: [3, 35],
  },
  horn: { near: 24, scale: 1.15, rad: 40, soundRad: 700, tip: 6, raise: 0.35, lift: [3, -7], turn: -30, pivot: [-8, -4], anchor: [0, -42],
    hold: 0.45, swell: [1.12, 6, 0.9], bell: [0, -18.52367214638378], rings: 4, gap: 0.18, radius: 4, speed: 300, life: 2.2, alpha: 0.8, power: 0.7,
    glint: [11, 0.6, 90], hit: [-24, -36, 48, 44], clink: .12, bounce: .3, splash: .25, rim: [5,-14], poses: [["rest",0,0,4.4],["first press: raised",12,-6,3],["second press: the clink",22,-9,0],["after: back to raised",12,-6,3]], ground: "M-18 4H18",
    paths: ["M-5.2 -12.2C-12.2 -12.2 -12.2 -2.2 -5.5 -2.2L-5.45 -5.2C-8.7 -5.2 -8.7 -9.2 -5.3 -9.2Z","M-5.6 0L-5 -14L5 -14L5.6 0Z","M-5.45 -3.6H5.45M-5.15 -10.6H5.15M-1.7 -14V0M1.8 -14V0","M-5.5 -14Q-5.6 -16.8 -3 -16.3Q-1.6 -18.6 1 -16.9Q3.4 -18.4 5.3 -15.8Q6.1 -14.3 5 -14Z"], kept: 'M2.3 -14.5V-11.9A1 1 0 0 0 4.3 -11.9V-14.5',
  },
  well: { near: 38, rad: 116, hit: [38, 22], water: [300, 390], root: [303, 389], drip: [4, 7], dripTime: 0.35,
    pebbleR: 1.2, pebbleFrom: [-30, -34], pebbleTime: 0.45, arc: 16, anchor: [0, 26],
    rings: 3, ringR: [30, 15], ringTime: 0.9, ringGap: 0.18, ringScale: [0.2, 1.25], ringAlpha: 0.9,
    drops: 6, splash: { speed: [22, 22], dir: [-120, -60], g: 80, life: [0.45, 0.6] },
    trunk: [[297, 373], [297, 323]], trunkTime: 0.4, starSize: 2.4, starTime: 0.3, starGap: 0.06, starOver: 1.3,
    twinkle: [0.6, 1], twinkleTime: [3.1, 4.7, 5.3, 3.9, 6.1],
    stars: [[[-45,-50],[-28,-62],[-7,-67],[25,-64],[53,-54]],[[-54,-40],[-27,-45],[0,-55],[29,-45],[62,-49]],[[-36,-59],[-15,-66],[5,-54],[37,-63],[49,-40]]],
  },
  ship: { near: 34, rad: 38, scale: 0.55, anchor: [0, -34], rock: [2.2, 1.3, 0.8, 1.9], breathe: [0.04, 1.7],
    pull: [-18, 14, 0.35, 0.5], rail: [0, -5], surge: 3, pulls: 3, window: 4, pennantTime: 0.4, ripple: [6, 2.5],
    hear: [1.12, 0.6, 2, 1], sailPivot: [0, -25], lamp: [0, -42, 1.5, 7], twinkle: [0.65, 1, 4.1], drops: 4, water: [0, 8],
    hit: [-36, -50, 72, 60], shields: [-18, -11, -4, 3, 10, 17], shieldY: -6, shieldR: 2.6, bossR: 0.6,
    paths: { hull: 'M-26 -6Q-20 5 -10 5H12Q22 5 26 -6Z', ends: 'M-26 -6Q-33 -13 -29 -20Q-25 -25 -22 -20Q-21 -16 -24.5 -16.5M26 -6Q31 -11 28 -15Q26 -17 25 -15', mast: 'M0 -6V-38', sail: 'M-12 -35H12V-15H-12Z', stripes: 'M-6 -35V-15M0 -35V-15M6 -35V-15', water: 'M-36 8q4 -3 8 0t8 0M16 9q4 -3 8 0t8 0',
      oars: 'M-18 -5L-25 8M-11 -5L-18 8M-4 -5L-11 8M3 -5L-4 8M10 -5L3 8M17 -5L10 8', pennant: 'M0 -39.5L24 -38L18 -36.5L24 -35L0 -33.5Z' },
  },
  all: { frame: [18, 18, 564, 864], length: 100, width: 2, dash: [6, 94], time: 2.6, fade: 0.4, wait: 0.6, knotTime: 0.8, markerTime: 0.4, markerScale: 1.25, frameAlpha: 0.5,
    knots: [[36, 36], [564, 36], [36, 864], [564, 864]], corners: [0, 564, 2286, 1428] },
};

// Round 7 C1: ported reference paths and independent layout/motion tuning.
// COMB-Q, 2026-11-26: approved old ash; geometry follows its foliage and tapered roots.
export const YGG = {
  "crown": [
    [
      -12,
      -78
    ],
    [
      -9,
      -78
    ],
    [
      -7.5,
      -76.5
    ],
    [
      -5.5,
      -78
    ],
    [
      -3.5,
      -78
    ],
    [
      -2.5,
      -77
    ],
    [
      -0.5,
      -78
    ],
    [
      2.5,
      -78
    ],
    [
      5,
      -75.5
    ],
    [
      10,
      -75.5
    ],
    [
      11,
      -73.5
    ],
    [
      14.5,
      -74
    ],
    [
      16,
      -76
    ],
    [
      18.5,
      -75.5
    ],
    [
      20,
      -77
    ],
    [
      23,
      -77
    ],
    [
      25,
      -76
    ],
    [
      26.5,
      -78
    ],
    [
      30.5,
      -78
    ],
    [
      32,
      -76
    ],
    [
      33.5,
      -76
    ],
    [
      34,
      -77
    ],
    [
      37,
      -77
    ],
    [
      39,
      -75.5
    ],
    [
      39,
      -74.5
    ],
    [
      43,
      -75
    ],
    [
      46,
      -72.5
    ],
    [
      48,
      -72.5
    ],
    [
      50,
      -71
    ],
    [
      50.5,
      -68.5
    ],
    [
      52,
      -67.5
    ],
    [
      53.5,
      -64
    ],
    [
      55,
      -63.5
    ],
    [
      56,
      -65
    ],
    [
      58,
      -65
    ],
    [
      59.5,
      -63
    ],
    [
      61.5,
      -64
    ],
    [
      66,
      -63.5
    ],
    [
      67.5,
      -62
    ],
    [
      68,
      -60
    ],
    [
      71,
      -58.5
    ],
    [
      71,
      -55
    ],
    [
      72,
      -53
    ],
    [
      73.5,
      -53
    ],
    [
      74.5,
      -52
    ],
    [
      75.5,
      -49.5
    ],
    [
      75.5,
      -45.5
    ],
    [
      73.5,
      -43
    ],
    [
      72,
      -42.5
    ],
    [
      71.5,
      -40.5
    ],
    [
      68,
      -40.5
    ],
    [
      65.5,
      -38.5
    ],
    [
      62.5,
      -39.5
    ],
    [
      58.5,
      -39
    ],
    [
      57,
      -35.5
    ],
    [
      52.5,
      -34
    ],
    [
      51.5,
      -32
    ],
    [
      49,
      -31.5
    ],
    [
      47,
      -33.5
    ],
    [
      43,
      -33
    ],
    [
      41.5,
      -34
    ],
    [
      40.5,
      -40.5
    ],
    [
      38.5,
      -37.5
    ],
    [
      36.5,
      -36.5
    ],
    [
      33.5,
      -36.5
    ],
    [
      31.5,
      -35
    ],
    [
      28,
      -35
    ],
    [
      25,
      -37.5
    ],
    [
      22,
      -37
    ],
    [
      20.5,
      -39.5
    ],
    [
      17.5,
      -41.5
    ],
    [
      17,
      -46.5
    ],
    [
      19.5,
      -50
    ],
    [
      22.5,
      -50.5
    ],
    [
      23,
      -52
    ],
    [
      21.5,
      -51
    ],
    [
      19,
      -51
    ],
    [
      17.5,
      -52.5
    ],
    [
      17.5,
      -51.5
    ],
    [
      16.5,
      -50.5
    ],
    [
      15,
      -50.5
    ],
    [
      12,
      -47
    ],
    [
      8.5,
      -47
    ],
    [
      6.5,
      -45
    ],
    [
      3.5,
      -46
    ],
    [
      2.5,
      -44.5
    ],
    [
      -0.5,
      -44.5
    ],
    [
      -2,
      -45.5
    ],
    [
      -2,
      -46.5
    ],
    [
      -3.5,
      -46.5
    ],
    [
      -4.5,
      -45.5
    ],
    [
      -8.5,
      -45.5
    ],
    [
      -11,
      -48
    ],
    [
      -11,
      -49
    ],
    [
      -14.5,
      -49
    ],
    [
      -16,
      -50.5
    ],
    [
      -16.5,
      -53
    ],
    [
      -19,
      -52.5
    ],
    [
      -22.5,
      -53.5
    ],
    [
      -23,
      -52.5
    ],
    [
      -22,
      -51.5
    ],
    [
      -20,
      -52
    ],
    [
      -17.5,
      -49.5
    ],
    [
      -16,
      -49.5
    ],
    [
      -14.5,
      -48
    ],
    [
      -14,
      -41.5
    ],
    [
      -16,
      -40.5
    ],
    [
      -19,
      -37
    ],
    [
      -22.5,
      -38.5
    ],
    [
      -23,
      -37.5
    ],
    [
      -27,
      -38
    ],
    [
      -29,
      -36
    ],
    [
      -31.5,
      -36
    ],
    [
      -34,
      -38
    ],
    [
      -34.5,
      -39.5
    ],
    [
      -36.5,
      -39.5
    ],
    [
      -39,
      -41.5
    ],
    [
      -39.5,
      -45
    ],
    [
      -42,
      -45
    ],
    [
      -43,
      -43
    ],
    [
      -45.5,
      -42.5
    ],
    [
      -45,
      -38
    ],
    [
      -48,
      -34
    ],
    [
      -50.5,
      -34
    ],
    [
      -52,
      -32
    ],
    [
      -56,
      -33
    ],
    [
      -58,
      -31.5
    ],
    [
      -60.5,
      -31.5
    ],
    [
      -63,
      -33.5
    ],
    [
      -63.5,
      -35.5
    ],
    [
      -65.5,
      -37
    ],
    [
      -65.5,
      -40
    ],
    [
      -64,
      -41
    ],
    [
      -64,
      -44.5
    ],
    [
      -62.5,
      -46
    ],
    [
      -64.5,
      -48.5
    ],
    [
      -65.5,
      -55
    ],
    [
      -64.5,
      -56.5
    ],
    [
      -62.5,
      -57
    ],
    [
      -61,
      -60
    ],
    [
      -57.5,
      -60.5
    ],
    [
      -54.5,
      -63.5
    ],
    [
      -51.5,
      -63.5
    ],
    [
      -49.5,
      -62
    ],
    [
      -49,
      -65
    ],
    [
      -46,
      -66
    ],
    [
      -45.5,
      -70
    ],
    [
      -43.5,
      -72
    ],
    [
      -40.5,
      -72.5
    ],
    [
      -40.5,
      -73.5
    ],
    [
      -38.5,
      -75
    ],
    [
      -37,
      -75
    ],
    [
      -35.5,
      -73.5
    ],
    [
      -33,
      -75
    ],
    [
      -31,
      -75
    ],
    [
      -28,
      -72.5
    ],
    [
      -26,
      -74
    ],
    [
      -20,
      -73.5
    ],
    [
      -19,
      -75
    ],
    [
      -16.5,
      -76
    ],
    [
      -13.5,
      -75.5
    ],
    [
      -13.5,
      -76.5
    ],
    [
      -12,
      -77.5
    ]
  ],
  "windows": "",
  "roots": [
    [
      [
        [
          -16,
          -7
        ],
        [
          -32,
          -2
        ],
        [
          -48,
          3
        ],
        [
          -60,
          4
        ],
        [
          -71,
          8
        ],
        [
          -80,
          8
        ]
      ],
      12,
      [
        12,
        8,
        5.5,
        3.6,
        2,
        0.8
      ]
    ],
    [
      [
        [
          2,
          -6
        ],
        [
          22,
          -2
        ],
        [
          40,
          3
        ],
        [
          55,
          3
        ],
        [
          66,
          6
        ],
        [
          76,
          6
        ]
      ],
      12,
      [
        12,
        8.5,
        5.5,
        3.4,
        2,
        0.8
      ]
    ],
    [
      [
        [
          -36,
          0
        ],
        [
          -45,
          7
        ],
        [
          -54,
          9
        ],
        [
          -61,
          13
        ]
      ],
      5,
      [
        5,
        3.4,
        2.2,
        0.8
      ]
    ],
    [
      [
        [
          36,
          2
        ],
        [
          46,
          8
        ],
        [
          55,
          9
        ],
        [
          63,
          12
        ]
      ],
      5,
      [
        5,
        3,
        2,
        0.8
      ]
    ],
    [
      [
        [
          -14,
          -5
        ],
        [
          -26,
          3
        ],
        [
          -36,
          9
        ],
        [
          -44,
          12
        ],
        [
          -51,
          12
        ],
        [
          -57,
          15
        ]
      ],
      12,
      [
        12,
        8,
        5.5,
        3.6,
        2,
        0.8
      ]
    ],
    [
      [
        [
          0,
          -5
        ],
        [
          16,
          3
        ],
        [
          28,
          8
        ],
        [
          36,
          16
        ],
        [
          40,
          25
        ],
        [
          40,
          33
        ],
        [
          37,
          40
        ]
      ],
      12,
      [
        12,
        9,
        6.5,
        4.6,
        3,
        1.8,
        0.8
      ]
    ],
    [
      [
        [
          -13,
          -14
        ],
        [
          -14,
          -3
        ],
        [
          -17,
          6
        ],
        [
          -23,
          12
        ],
        [
          -25,
          19
        ],
        [
          -29,
          25
        ]
      ],
      9,
      [
        9,
        8.5,
        6.5,
        4.4,
        2.8,
        0.8
      ]
    ],
    [
      [
        [
          -7,
          -14
        ],
        [
          -6,
          -3
        ],
        [
          -4,
          7
        ],
        [
          -7,
          15
        ],
        [
          -3,
          22
        ],
        [
          -5,
          29
        ]
      ],
      10,
      [
        10,
        9.5,
        7,
        4.6,
        2.8,
        0.8
      ]
    ],
    [
      [
        [
          -1,
          -14
        ],
        [
          1,
          -3
        ],
        [
          7,
          6
        ],
        [
          14,
          10
        ],
        [
          18,
          17
        ],
        [
          23,
          21
        ]
      ],
      9,
      [
        9,
        8.5,
        6,
        4,
        2.4,
        0.8
      ]
    ]
  ],
  "trunkLine": [
    [
      -7,
      -1
    ],
    [
      -7,
      -10
    ],
    [
      -8,
      -20
    ],
    [
      -8,
      -29
    ],
    [
      -7,
      -36
    ],
    [
      -6,
      -42
    ]
  ],
  "eagle": "<g class=\"yg-wings\" transform=\"scale(1.1 .78)\"><path class=\"g\" d=\"M-1.3 -7.6C-3.4 -9.6 -6.2 -12.4 -9.4 -15C-9.2 -13.8 -8.8 -13.2 -8.3 -12.8L-9.8 -12.6C-9.2 -11.6 -8.6 -11.2 -7.9 -11L-9.4 -10.4C-8.4 -9.6 -7.4 -9.3 -6.4 -9.2L-7.4 -8.4C-5.4 -7.8 -3.4 -6.8 -1.6 -5.6Z\"/><path class=\"g\" d=\"M1.2 -7.6C3.4 -9.8 6.4 -12.6 9.8 -15.2C9.6 -14 9.2 -13.4 8.7 -13L10.2 -12.8C9.6 -11.8 9 -11.4 8.3 -11.2L9.8 -10.6C8.8 -9.8 7.8 -9.5 6.8 -9.4L7.8 -8.6C5.8 -8 3.6 -6.9 1.6 -5.6Z\"/></g><path class=\"g\" d=\"M-1.4 0L1.4 0L1.8 -3C2.2 -5 1.9 -7 1.1 -8.4C1.6 -9.3 1.5 -10.6 .5 -11.3C-.6 -12 -2 -11.6 -2.6 -10.8C-3.4 -11 -4.4 -10.7 -4.7 -9.7C-4.3 -10 -3.7 -9.9 -3.2 -9.4C-2.7 -9 -2.1 -8.7 -1.5 -8.6C-2.1 -7 -2.2 -5 -1.9 -3Z\"/><circle class=\"pf\" cx=\"-1.3\" cy=\"-10.4\" r=\".35\"/><path class=\"t\" d=\"M-2 -1.5L-2.6 .8M2 -1.5L2.6 .8\"/>",
  "rat": "<g class=\"yg-tail\"><path class=\"g\" d=\"M.6 -.6C2.4 -.4 3.4 -1.8 3.2 -3.6C3 -5.2 3.8 -6.6 5 -6.6C4.4 -5.6 4.4 -4.6 4.6 -3.4C4.9 -1.4 3.2 .6 .8 .4Z\"/></g><path class=\"g\" d=\"M-.8 0C-1.4 -1.4 -1.4 -3 -.9 -4.2C-.6 -5 -.6 -5.6 -1 -6.2C-1.2 -6.8 -.9 -7.4 -.3 -7.5C.3 -7.6 .8 -7.2 .9 -6.6C1.4 -6.2 1.4 -5.4 1 -4.8C1.4 -3.6 1.4 -1.6 .8 0Z\"/><path class=\"l\" d=\"M.3 -7.4L.5 -8.2M-1 -3.4L-1.8 -2.8\"/><circle class=\"pf\" cx=\"-.2\" cy=\"-6.7\" r=\".25\"/>",
  "eagleAt": [
    -7,
    -76
  ],
  "ratAt": [
    -4,
    -17
  ],
  "fork": [
    297,
    336
  ],
  "label": [
    318.1,
    361
  ],
  "labelBox": [
    318.1,
    355,
    359.1,
    363
  ],
  "clearance": 6,
  "groveReach": 13,
  "labelGap": 2,
  "starInset": 5,
  "starSame": 7,
  "starOther": 4,
  "eagleClear": 6,
  "tube": {
    "seg": 8,
    "power": 0.8,
    "mult": 16807,
    "mod": 2147483647
  },
  "life": {
    "seed": 73,
    "ratEvery": [
      9,
      15
    ],
    "climb": 0.9,
    "pause": 1.2,
    "tail": 15,
    "tailRoot": [
      0.8,
      0
    ],
    "eagleEvery": [
      6,
      10
    ],
    "stretch": 0.7,
    "wingX": 1.1,
    "wingY": [
      0.78,
      0.95
    ],
    "flight": 2.6,
    "flightStops": [
      0.1,
      0.2,
      0.8,
      0.9
    ],
    "rise": 6,
    "radius": 16,
    "centre": 14,
    "flap": 4,
    "flapY": [
      0.6,
      1
    ]
  },
  drawing: (() => {
    // Small drawing kit for the Yggdrasil sketches. Units: map units, origin at the tree's foot, y down.
    const rnd = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const n1 = v => Math.round(v * 10) / 10;
    const LAND = '#1F1C1D', INK = '#151314', PAPER = '#F7F6F3';
    // Catmull-Rom through points
    function spline(P, closed = false, seg = 8) {
      const n = P.length, out = [], g = i => closed ? P[(i + n) % n] : P[Math.max(0, Math.min(n - 1, i))];
      for (let i = 0; i < (closed ? n : n - 1); i++) { const a = g(i - 1), b = g(i), c = g(i + 1), d = g(i + 2);
        for (let j = 0; j < seg; j++) { const t = j / seg, t2 = t * t, t3 = t2 * t; out.push([0, 1].map(k => .5 * (2 * b[k] + (c[k] - a[k]) * t + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * t2 + (3 * b[k] - a[k] - 3 * c[k] + d[k]) * t3))); } }
      if (!closed) out.push(P[n - 1]); return out;
    }
    // smooth path through points using midpoint quadratics
    function smooth(P, closed = false) {
      const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], f = p => n1(p[0]) + ' ' + n1(p[1]);
      if (closed) { let d = 'M' + f(m(P[P.length - 1], P[0])); P.forEach((p, i) => { d += 'Q' + f(p) + ' ' + f(m(p, P[(i + 1) % P.length])); }); return d + 'Z'; }
      if (P.length < 3) return 'M' + P.map(f).join('L');
      let d = 'M' + f(P[0]); for (let i = 1; i < P.length - 1; i++) d += 'Q' + f(P[i]) + ' ' + f(i === P.length - 2 ? P[i + 1] : m(P[i], P[i + 1])); return d;
    }
    const area = P => P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
    // tapered limb: centre points [x,y,width]; returns polygon (consistent winding)
    function limb(C, { seg = 6, wob = 0, r = Math.random, tip = true } = {}) {
      const S = spline(C.map(c => [c[0], c[1]]), false, seg), W = spline(C.map((c, i) => [i, c[2]]), false, seg).map(p => p[1]);
      const L = [], R = [];
      S.forEach((p, i) => { const a = S[Math.max(0, i - 1)], b = S[Math.min(S.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, w = Math.max(.15, W[i] / 2 * (1 + wob * (r() - .5)));
        L.push([p[0] + dy / l * w, p[1] - dx / l * w]); R.push([p[0] - dy / l * w, p[1] + dx / l * w]); });
      const P = [...L, ...R.reverse()]; return area(P) < 0 ? P.reverse() : P;
    }
    const centre = (C, seg = 6) => spline(C.map(c => [c[0], c[1]]), false, seg);
    // union look: one outline round a set of overlapping shapes
    function union(polys, { fill = LAND, cls = 'g', w = 2.3 } = {}) {
      const d = polys.map(P => smooth(P, true)).join('');
      return `<path class="${cls}" style="stroke-width:${w}" d="${d}"/><path d="${d}" fill="${fill}" stroke="none"/>`;
    }
    // scalloped closed outline round a loop of points
    function scallop(P, r, { step = 6, bump = [.3, .25], jit = .35 } = {}) {
      const S = spline(P, true, 10), pts = []; let acc = 0, next = 0;
      S.forEach((p, i) => { const q = S[(i + 1) % S.length]; acc += Math.hypot(q[0] - p[0], q[1] - p[1]); if (acc >= next) { pts.push(p); next = acc + step * (1 - jit / 2 + r() * jit); } });
      const cw = area(pts) > 0 ? 1 : -1, f = p => n1(p[0]) + ' ' + n1(p[1]); let d = 'M' + f(pts[0]);
      pts.forEach((a, i) => { const b = pts[(i + 1) % pts.length], dx = b[0] - a[0], dy = b[1] - a[1], k = (bump[0] + r() * bump[1]) * cw;
        d += 'Q' + f([(a[0] + b[0]) / 2 + dy * k * 2, (a[1] + b[1]) / 2 - dx * k * 2]) + ' ' + f(b); });
      return { d: d + 'Z', pts };
    }
    const inside = (p, P) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) if ((P[i][1] > p[1]) !== (P[j][1] > p[1]) && p[0] < (P[j][0] - P[i][0]) * (p[1] - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) c = !c; return c; };
    const blob = (cx, cy, rx, ry, r, n = 9, j = .18) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2, k = 1 + (r() - .5) * 2 * j; return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]; });
    
    // Option A, "The old ash": a colossal bole, tiered foliage, roots that grip the well.
    const r = rnd(11);
    const f = p => n1(p[0]) + ' ' + n1(p[1]);
    const back = [
      [[-16,-7,12],[-32,-2,8],[-48,3,5.5],[-60,4,3.6],[-71,8,2],[-80,8,.8]],
      [[2,-6,12],[22,-2,8.5],[40,3,5.5],[55,3,3.4],[66,6,2],[76,6,.8]],
      [[-36,0,5],[-45,7,3.4],[-54,9,2.2],[-61,13,.8]],
      [[36,2,5],[46,8,3],[55,9,2],[63,12,.8]],
    ];
    const arms = [
      [[-14,-5,12],[-26,3,8],[-36,9,5.5],[-44,12,3.6],[-51,12,2],[-57,15,.8]],
      [[0,-5,12],[16,3,9],[28,8,6.5],[36,16,4.6],[40,25,3],[40,33,1.8],[37,40,.8]],
    ];
    const front = [
      [[-13,-14,9],[-14,-3,8.5],[-17,6,6.5],[-23,12,4.4],[-25,19,2.8],[-29,25,.8]],
      [[-7,-14,10],[-6,-3,9.5],[-4,7,7],[-7,15,4.6],[-3,22,2.8],[-5,29,.8]],
      [[-1,-14,9],[1,-3,8.5],[7,6,6],[14,10,4],[18,17,2.4],[23,21,.8]],
    ];
    const twigs = [[[-71,8],[-75,12],[-81,13]],[[-60,4],[-65,1],[-71,1]],[[66,6],[70,10],[76,11]],[[55,3],[60,0],[66,1]],[[-51,12],[-54,8],[-59,8]],[[40,33],[44,36],[45,40]],[[-44,12],[-46,17],[-44,21]],[[-25,19],[-21,23],[-22,27]],[[-3,22],[0,26],[-1,31]],[[18,17],[16,22],[19,26]]];
    const L = (rows, o) => rows.map(c => limb(c, { wob: .1, r, ...o }));
    const trunk = [[-7,-1,19],[-7,-10,23],[-8,-20,22],[-8,-29,22],[-7,-36,25],[-6,-42,28]];
    const boughs = [
      [[-15,-33,9],[-28,-39,7],[-42,-41,5.5],[-54,-44,3.5]],
      [[-13,-38,9],[-20,-49,6.5],[-29,-57,5],[-36,-63,3]],
      [[-7,-38,10],[-6,-50,7],[-5,-60,5],[-6,-68,3]],
      [[-1,-38,9],[12,-47,6.5],[26,-55,5],[38,-61,3]],
      [[1,-33,9],[20,-36,7],[42,-40,5.5],[56,-46,4],[62,-49,2.5]],
    ];
    // foliage [cx,cy,rx,ry,marks], back to front: a few big masses, smaller ones at the bough ends
    const clumps = [
      [-7,-67,21,10,0],[-30,-63,19,11,1],[27,-64,22,11.5,1],
      [-50,-52,15,10,0],[52,-55,18,10,0],[2,-55,17,9.5,1],
      [62,-49,13,8.5,1],[-55,-40,10.5,7.5,1],[-26,-45,13,8,1],[30,-45,14,8,1],[50,-39,9,5.5,0],
    ];
    let fol = '';
    clumps.forEach(([cx, cy, rx, ry, marks]) => {
      const B = blob(cx, cy, rx, ry, r, 9, .14), s = scallop(B, r, { step: 6.2, bump: [.16, .2], jit: .9 });
      fol += `<path class="g" d="${s.d}"/>`;
      if (marks) { const I = spline(B.map(p => [cx + (p[0] - cx) * .52 + rx * .1, cy + (p[1] - cy) * .46 + ry * .14]), true, 6), n = I.length, a0 = Math.floor(n * (.5 + r() * .08)), run = I.slice(a0, a0 + Math.floor(n * (.2 + r() * .12)));
        let d = 'M' + f(run[0]); for (let k = 3; k < run.length; k += 3) { const a = run[k - 3], b = run[k], dx = b[0] - a[0], dy = b[1] - a[1]; d += 'Q' + f([(a[0] + b[0]) / 2 + dy * .5, (a[1] + b[1]) / 2 - dx * .5]) + ' ' + f(b); }
        fol += `<path class="l" d="${d}"/>`; }
      let h = ''; const m = 2 + Math.floor(r() * 3); for (let k = 0; k < m; k++) { const x = cx + rx * (.05 + .16 * k + r() * .05), y = cy + ry * (.55 - .06 * k); h += `M${n1(x)} ${n1(y)}l${n1(1.6 + r())} ${n1(-3 - r() * 1.5)}`; }
      fol += `<path class="t" d="${h}"/>`;
    });
    const bark = 'M-15 -8Q-13 -18 -15 -28Q-16 -33 -20 -37M-10 -6Q-8 -16 -10 -26Q-11 -32 -10 -39M-3 -8Q-1 -17 -3 -26Q-3 -32 1 -36M1 -9Q2 -14 1 -19M-25 -1Q-35 1 -44 5M12 0Q24 2 34 5M-16 2Q-18 7 -22 11M-5 1Q-4 8 -6 13M20 6Q27 9 32 15';
    const hollow = '<path class="o" d="M-13 -19Q-14.5 -23.5 -12 -26Q-9 -24 -10 -20Q-11 -17.5 -13 -19Z"/>';
    const ripples = '<path class="t" d="M-34 26q5 -2.5 10 0M-10 30q5 -2.5 10 0M18 22q5 -2.5 10 0"/>';
    const twig = `<path class="l" d="${twigs.map(t => smooth(spline(t, false, 4))).join('')}"/>`;
    const svg = `<!--META{"eagle":[-3,1],"rat":[0,-6]}-->
<g class="ygg-a">
<g class="yg-roots">${twig}${union(L(back))}${union(L(arms))}</g>
<g class="yg-trunk">${union([...L(boughs), limb(trunk, { wob: .05, r }), ...L(front)])}<path class="t" d="${bark}"/>${hollow}${ripples}</g>
<g class="yg-crown">${fol}</g>
</g>`;
    return svg;
  })().replace(/\n/g, '\r\n')
};
YGG.canopy = 'M' + YGG.crown.map(p => p.join(' ')).join('L') + 'Z';
YGG.trunk = YGG.drawing.split('<g class="yg-trunk">')[1].split('</g>')[0];
// lift: how far a stop's shield stands off its trail point, as a share of half its size plus stand (0 = centred on the trail, Dan on preview 21; 1 = standing on it as before).
export const MARK = { k: 10, min: 14, max: 36, stand: 3, lift: 0, ringWidth: 1.2, ringGap: 2, box: 400, centre: 200, radius: 176, rim: 20, boss: 54, bossLine: 16, highlight: [186,186,12,.55], shadow: [200,392,120,10,.35], planks: [-120,-72,-24,24,72,120], plankLine: 7, plankAlpha: .28, paintAlpha: .35, studs: 8, stud: 9, studLine: 5, quarters: 'M200 200L200 24A176 176 0 0 1 376 200ZM200 200L200 376A176 176 0 0 1 24 200Z', legend: [68,864,4.6,.9,1.2,.45] };
export const LABELS = { name: { unit: 9.5, floor: 10, phone: 9 }, x: { unit: 8.5, floor: 10, phone: 9 }, sub: { unit: 6.3, floor: 7.6, phone: 7.6 }, small: { unit: 6.5, floor: 9, phone: 9 }, legend: { unit: 6.5, floor: 9, phone: 9 }, marker: { unit: 7.5, floor: 6, phone: 6 }, fade: [1.3,1.5], epsilon: .005, width: .56, line: 1.2, xBreak: ' the ', ascent: .8, descent: .2, halo: 1.5, nameDY: -4, subDY: 4, xSubDY: 9.5, hmcSubDX: -8, hmcSubDY: -27.5, hmcAgainSubDX: 3, hmcAgainTracking: -0.15, subOffset: 9.5, xAt: [18,8], xSubAt: [18,17.5], kicker: [45,101], plate: [-3,-5.8,204,8], rule: [0,8,196], legendAt: [[78,866],[155,866],[255,866],[485,866]],
  // cardDim: other stops' labels behind an open card (desktop, phone); underFade: the share of a label under the timeline or
  // step bar at which it has gone (sideFade: off the screen's side); bar: the bar's keep-out (half width, pad); hint: a find
  // view's lift of it, for the hint (px); edgeFade: the seconds a label takes to fade fully out or in at those edges, however
  // fast the camera carries it there (a moving label crossed the old share-based fades in one or two frames: Dan's phone
  // "popping in and out around the edges", 2026-11-27)
  cardDim: [0.35, 0.12], underFade: 0.4, sideFade: 0.1, bar: [190, 6], hint: 44, edgeFade: 0.3 };
// titleOut: the push-in share over which the map's title and kicker fade out (back in at the overview and in explore).
// coastDraw: the share of the fall over which the coasts draw, from its first moments
export const WORLD = { scrim: [150,190,.85], titleOut: [.3, .8], titleZoom: [1.15, 1.6], coastDraw: [.1891891891891892, .72], card: { w:640, edge:32, phoneBottom:0, gap:12, panelRadius:10, panelPad:16, crafts:340, title:26, titleWeight:800, titleGap:14, footGap:16, footMargin:18, topPad:8, topPadX:14 } };
export const PHONE_LAYOUT = { gap: 16, edge: 16, ctaShare: .14, headlineGap: 20, exploreGap: 8, exploreBottom: 8, exploreBack: 152, exploreTop: 172 };

// COMB-A: interaction and responsive label values. Original drawing geometry stays in place.
export const COMB = { target: 44, popClose: .16, sheetClose: .2, panelFade: .14, wayFade: .3,
  markerPx: 17, wordPx: 10, hintDelay: .5, handoverOverlap: 28, mapFindsIn: .5,
  labels: { laurier: [166,240], hmc1: [478,277], hmc2: [494,351] },
  exploreSides: { laurier: 'below', hmc1: 'left', mohawk: 'right', hmc2: 'left', interkom: 'left', lennard: 'left', x: 'right' },
  readings: [[442,412],[455,458],[552,372]],
  hornHints: ['Press to raise them.', 'Press again to clink them.', 'Listen as the other finds answer.'],
  craftLit: '{craft}: used here', craftUnlit: '{craft}: not used here',
  waySay: '{craft}. Matching stops: {names}.', novaSay: 'The supernova is building. Press to add a flare.',
};
