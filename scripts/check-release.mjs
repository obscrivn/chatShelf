import {readFileSync} from 'node:fs';
const m=JSON.parse(readFileSync(new URL('../docs/metrics.json',import.meta.url),'utf8'));
const checks=[['Topic macro F1',m.topicMacroF1,.80],['Recurring pair precision',m.recurringPrecision,.85],['Recurring pair recall',m.recurringRecall,.75]];
let failed=false;
for(const [name,value,target] of checks){const pass=typeof value==='number'&&Number.isFinite(value)&&value>=target;console.log(`${pass?'PASS':'FAIL'} ${name}: ${value} (target ${target})`);failed ||= !pass;}
// Numeric failures remain failures. The explicit release exception is documented
// separately; Chrome evidence is recorded under docs/PHASE5_REPORT.md.
if(failed && process.argv.includes('--allow-documented-limitations')) {
 const notes=readFileSync(new URL('../docs/RELEASE_NOTES.md',import.meta.url),'utf8');
 if(!notes.includes('0.50') || !notes.includes('0.75') || !notes.includes('user authorized')) throw new Error('Missing documented quality exception');
 console.log('RELEASE EXCEPTION: user authorized publication with disclosed quality limitations; failed metrics remain failed.');
} else process.exitCode=failed?1:0;
