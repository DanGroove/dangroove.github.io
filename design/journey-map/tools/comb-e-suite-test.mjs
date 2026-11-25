// Final bounded preservation and evidence pass. No prohibited cost launchers.
import {combERun} from './comb-e-run-test.mjs';
const list=process.argv.slice(2);
const defaults=['comb-b-suite-test','comb-b-browser-test','comb-b-detail-test','comb-b-layout-test','comb-d-layout-test','comb-d-drawings-test','comb-d-readings-test','comb-d-opening-test','comb-d-opening-ink-test','comb-d-opening-capture-test','comb-d-beacon-probe-test','comb-d-conflict-test','comb-d-label-probe-test','comb-d-stipple-test','comb-d-origin-test','comb-d-evidence-test','comb-d-capture-test','comb-e-beam-test'];
let failed=0;
for(const test of list.length?list:defaults){console.log('Starting '+test);failed+=!!await combERun(['tools/'+test+'.mjs']);}
console.log(failed+' failed checks');process.exitCode=failed?1:0;
