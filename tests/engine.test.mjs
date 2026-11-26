import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {analyze,syntheticMockLibrary} from '../dist/index.js';
const truth=JSON.parse(readFileSync(new URL('./ground-truth.json',import.meta.url)));
const make=(text,id='synthetic')=>({id,title:'TITLE_CANARY',current_node:'u',mapping:{root:{parent:null,message:null},u:{parent:'root',message:{author:{role:'user'},content:{content_type:'text',parts:[text]}}},abandoned:{parent:'root',message:{author:{role:'user'},content:{content_type:'text',parts:['Revise writing essay draft']}}}}});
const run=(rows,t=.3)=>analyze([JSON.stringify(rows)],t);
test('active branch only; all supported wrappers',()=>{
 const c=make('Debug python code');
 for(const root of [c,[c],{conversations:[c]}]) assert.deepEqual(analyze([JSON.stringify(root)]).books.map(x=>x.topic),['Programming']);
});
test('malformed, cycles, missing parents, unknown roles and multimodal fail closed',()=>{
 assert.equal(analyze(['{']).status,'REJECTED_INPUT');
 for(const mutate of [c=>c.current_node='missing',c=>c.mapping.root.parent='u',c=>delete c.mapping.u.parent,c=>c.mapping.u.message.content.parts=[{}],c=>c.mapping.u.message.author.role='assistant',c=>c.mapping.u.id='wrong']){
  const c=make('Debug python code'); mutate(c); assert.equal(run([c]).books.length,0);
 }
 assert.equal(run([{messages:[],id:'flat'}]).books.length,0);
});
test('deduplicate split files and quarantine conflicts independent of ordering',()=>{
 const c=make('Debug python code');assert.equal(analyze([JSON.stringify([c]),JSON.stringify({conversations:[c]})]).books[0].conversations,1);
 for(const rows of [[c,make('Revise writing draft')],[make('Revise writing draft'),c]]) assert.equal(run(rows).books.length,0);
});
test('recurrence counts conversations, multi-label spans projects',()=>{
 const c=make('Debug python code debug python code'); assert.equal(run([c]).books[0].recurring.length,0);
 const result=run([c,make('Fix python function','other')]);assert.equal(result.books[0].recurring[0].conversations,2);
 assert.equal(run([make('Teach python code with lesson quiz')]).books.length,2);
 assert.equal(syntheticMockLibrary.books[0].recurring.length,1);
});
test('privacy canaries never enter safe DTO or errors',()=>{
 for(const canary of ['CANARY_RAW_NAME','person@example.invalid','sk-ABC123','medical diagnosis','password abc','https://example.invalid','123-45-6789','<script>alert(1)</script>']) {
 const result=run([make(`Debug python code ${canary}`)]); const out=JSON.stringify(result);
 assert.ok(!out.includes(canary));assert.ok(!out.includes('TITLE_CANARY'));assert.ok(!out.includes('synthetic'));
 if(/@|sk-|medical|password|https|123-45/.test(canary)) assert.equal(result.books.length,0);
 }
 assert.equal(run([make('unclassified nonsense')]).books.length,0);
});
test('resource limits and deterministic output',()=>{
 assert.equal(analyze(Array(21).fill('[]')).status,'REJECTED_INPUT');
 assert.equal(run([make('x'.repeat(100001))]).books.length,0);
 assert.deepEqual(run([make('Debug python code')]),run([make('Debug python code')]));
 assert.equal(analyze(['[]'],NaN).status,'REJECTED_INPUT');
});
function evaluate(rows,threshold){
 const topics=['Programming','Writing','Learning','Planning'];let tp=0,fp=0,fn=0;
 const f1=topics.map(topic=>{let a=0,b=0,c=0;rows.forEach((r,i)=>{const p=run([make(r.text,String(i))],threshold).books.some(x=>x.topic===topic),g=r.topics.includes(topic);a+=p&&g?1:0;b+=p&&!g?1:0;c+=!p&&g?1:0});return 2*a/(2*a+b+c||1)});
 // Pairs are the recurrence unit; each pair requires two distinct conversations.
 for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){
 const predicted=run([make(rows[i].text,'a'),make(rows[j].text,'b')],threshold).books.flatMap(b=>b.recurring.map(x=>x.task));
 const expected=rows[i].tasks.filter(t=>rows[j].tasks.includes(t));
 for(const t of new Set([...predicted,...expected])){if(predicted.includes(t)&&expected.includes(t))tp++;else if(predicted.includes(t))fp++;else fn++;}
 }
 return {topicMacroF1:f1.reduce((a,b)=>a+b,0)/4,recurringPrecision:tp+fp ? tp/(tp+fp) : null,recurringRecall:tp+fn ? tp/(tp+fn) : null,recurrencePairs:{tp,fp,fn}};
}
test('frozen evaluation and development threshold sweep',()=>{
 const sweep=[.25,.30,.40,.50].map(threshold=>({threshold,...evaluate(truth.development,threshold)}));
 const metrics=evaluate(truth.heldout,.30);
 const report={threshold:.30,developmentSweep:sweep,heldoutCases:truth.heldout.length,...metrics};
 writeFileSync(new URL('../docs/metrics.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
 console.log('SYNTHETIC_METRICS',JSON.stringify(report));
 assert.ok(metrics.topicMacroF1>=.80);assert.ok(metrics.recurringPrecision>=.85);assert.equal(metrics.recurringRecall,.50); // Regression check; acceptance recall target remains unmet.
});
test('checked-in synthetic export is deterministic and produces four topics',()=>{
 const fixture=readFileSync(new URL('./synthetic-export.json',import.meta.url),'utf8');
 const first=analyze([fixture]);const second=analyze([fixture]);assert.deepEqual(first,second);
 assert.equal(first.books.length,4);
});
test('runtime source has no network, storage, logging or dynamic execution APIs',()=>{
 const source=readFileSync(new URL('../src/index.ts',import.meta.url),'utf8');
 assert.ok(!/\b(fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage|indexedDB|console|eval)\s*[.(]/.test(source));
});

test('review regressions: negation, unrelated clauses and explicit treatment suppress false tasks',()=>{
 for (const text of ['Do not debug python code.', 'Explain python code and fix punctuation in an essay draft.']) {
  const result=run([make(text,'a'),make(text,'b')]);
  assert.equal(result.books.flatMap(b=>b.recurring).length,0);
 }
 assert.equal(run([make('Plan project tasks for my chemotherapy appointments.')]).books.length,0);
 assert.equal(run([make('Debug python code. Plan project tasks.','a'),make('Fix python code. Organize project tasks.','b')]).books.filter(b=>b.recurring.length).length,2);
});

test('parser preserves user-turn boundaries and quarantines structurally different duplicates',()=>{
 const multi=make('Debug','a');
 multi.mapping.v={parent:'u',message:{author:{role:'user'},content:{content_type:'text',parts:['python code']}}};multi.current_node='v';
 const second=structuredClone(multi);second.id='b';
 assert.equal(run([multi,second]).books[0].recurring.length,0);
 const flattened=make('Debug python code','a');
 assert.equal(run([multi,flattened]).books.length,0);
 for(const mutate of [c=>delete c.mapping.u.message.author,c=>c.mapping.u.message.author.role='unknown',c=>c.mapping.u.message.author={}]){
  const c=make('Debug python code');mutate(c);assert.equal(run([c]).books.length,0);
 }
});
test('quoted and hypothetical tasks abstain while affirmative multi-topic requests survive',()=>{
 for(const text of ['The example says "debug python code".', 'If needed debug python code.', 'I can’t debug python code.']){
  assert.equal(run([make(text,'a'),make(text,'b')]).books.flatMap(b=>b.recurring).length,0);
 }
 const text='Debug python code. Rewrite essay draft. Prepare course quiz. Organize project tasks.';
 assert.equal(run([make(text,'a'),make(text,'b')]).books.filter(b=>b.recurring.length).length,4);
});
