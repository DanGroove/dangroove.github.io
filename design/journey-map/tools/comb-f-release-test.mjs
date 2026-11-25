import {combERun} from './comb-e-run-test.mjs';
let failed=0;
for(const args of [
 ['tools/pack.mjs'],['tools/pack-joined.mjs'],['tools/comb-f-syntax-test.mjs'],['tools/comb-f-pins-test.mjs','--record'],['tools/comb-d-pins-test.mjs','--record'],['tools/comb-d-suite-test.mjs'],
 ['tools/comb-f-stars-test.mjs','release'],['tools/comb-f-evidence-test.mjs','release','trace'],['tools/comb-f-sharpness-test.mjs'],['tools/comb-f-controls-test.mjs'],['tools/comb-f-names-test.mjs'],['tools/comb-f-gesture-test.mjs'],['tools/comb-f-interaction-test.mjs'],['tools/comb-f-route-test.mjs'],['tools/comb-d-drawings-test.mjs','--final-small'],['tools/comb-f-evidence-test.mjs','release','capture'],['tools/comb-f-compare-test.mjs']
]){console.log('Release '+args.join(' '));failed+=!!await combERun(args);}
console.log('Release validation: '+failed+' failed gates; consult the report.');process.exitCode=failed?1:0;
