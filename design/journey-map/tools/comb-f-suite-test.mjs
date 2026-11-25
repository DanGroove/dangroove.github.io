// Final permitted validation batch. No cost launchers or report mutators.
import {combERun} from './comb-e-run-test.mjs';
import {readdirSync} from 'node:fs';
const list=process.argv.slice(2),defaults=['comb-b-browser-test','comb-b-detail-test','comb-b-layout-test','comb-d-layout-test','comb-d-readings-test','comb-d-opening-test','comb-d-opening-ink-test','comb-d-opening-capture-test','comb-d-beacon-probe-test','comb-d-conflict-test','comb-d-label-probe-test','comb-d-stipple-test','comb-d-origin-test','comb-d-evidence-test','comb-d-capture-test','comb-e-beam-test','comb-e-warm-test','comb-e-trace-audit-test','comb-e-place-test','comb-e-label-study-test','comb-e-probe-test','comb-e-scope-test','comb-e-capture-test','comb-e-report-test','comb-f-route-test'];
let failed=0;
for(const test of list.length?list:defaults){if(/^(frame-cost|comb-[bc]-cost-test|comb-d-report-test|comb-e-setup-test)$/.test(test))throw Error('Prohibited entry point');console.log('Starting '+test);failed+=!!await combERun(['tools/'+test+'.mjs']);}
console.log(failed+' failed checks');process.exitCode=failed?1:0;
