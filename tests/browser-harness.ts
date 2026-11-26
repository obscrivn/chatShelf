(async()=>{
// Synthetic-only browser integration checks. Not included in release/ChatShelf.html.
const results: {check:string;passed:boolean}[]=[];
let prohibited=0;let logs=0;
const nativeFetch=window.fetch.bind(window);
const forbid=()=>{prohibited++;throw new Error('PROHIBITED_TEST_API');};
window.fetch=forbid;window.WebSocket=forbid as unknown as typeof WebSocket;
window.XMLHttpRequest=forbid as unknown as typeof XMLHttpRequest;
navigator.sendBeacon=forbid;
for(const method of ['setItem','getItem','removeItem','clear'] as const)Storage.prototype[method]=forbid;
try{window.indexedDB.open=forbid;}catch{/* file origins may already restrict indexedDB */}
try{navigator.serviceWorker.register=forbid;}catch{/* unavailable on some file origins */}
for(const method of ['log','error','warn','info','debug'] as const)console[method]=()=>{logs++;};
const byId=(id:string)=>document.getElementById(id)!;
const check=(name:string,passed:boolean)=>results.push({check:name,passed});
const click=(id:string)=>(byId(id) as HTMLButtonElement).click();
const sleep=()=>new Promise(resolve=>setTimeout(resolve,10));
const record=(text:string,id='ID_CANARY')=>({id,title:'TITLE_CANARY',current_node:'u',mapping:{u:{parent:null,message:{author:{role:'user'},content:{content_type:'text',parts:[text]}}}}});
async function importFiles(files:File[]){const transfer=new DataTransfer();files.forEach(f=>transfer.items.add(f));const input=byId('files') as HTMLInputElement;input.files=transfer.files;input.dispatchEvent(new Event('change'));for(let i=0;i<200&&byId('status').textContent==='Reading locally…';i++)await sleep();}
const jsonFile=(value:unknown)=>new File([JSON.stringify(value)],'FILENAME_CANARY.json',{type:'application/json'});
try{
 await import('../src/ui.js');
 check('Empty startup',byId('shelves').children.length===0);
 click('demo');check('Synthetic library renders four books',byId('shelves').querySelectorAll('button').length===4);
 (byId('shelves').querySelector('button') as HTMLButtonElement).click();
 check('Book detail contains fixed prompt and checklist',(byId('detail') as HTMLDialogElement).open&&byId('detail-body').querySelectorAll('li').length===3);
 click('close');click('clear');check('Clear removes books and details',byId('shelves').children.length===0&&byId('detail-body').children.length===0);
 await importFiles([jsonFile([record('Debug python code NAME_CANARY <script>MARKUP_CANARY</script>'),record('Fix python function','second')])]);
 check('Synthetic import and recurrence',byId('shelves').querySelectorAll('button').length===1&&byId('shelves').textContent!.includes('2 conversations'));
 check('Input filename cleared',(byId('files') as HTMLInputElement).value==='');
 (byId('shelves').querySelector('button') as HTMLButtonElement).click();
 check('Raw canaries excluded from visible UI',!['ID_CANARY','TITLE_CANARY','NAME_CANARY','FILENAME_CANARY','MARKUP_CANARY'].some(c=>document.body.innerText.includes(c)));
 click('close');
 await importFiles([jsonFile([record('Debug python code medical diagnosis person@example.invalid')])]);
 check('Sensitive content suppressed',byId('shelves').children.length===0&&byId('status').textContent!.startsWith('No approved topics'));
 await importFiles([new File(['{MALFORMED_CANARY'],'ERROR_CANARY.json')]);
 check('Malformed input gives fixed safe error',byId('status').textContent==='Import not accepted. Check the JSON format and size limits.'&&!document.body.innerText.includes('CANARY'));
 await importFiles(Array.from({length:21},()=>jsonFile([])));
 check('File count limit enforced',byId('status').textContent!.includes('up to 20 JSON files'));
 const slow=jsonFile([]);let finish:(text:string)=>void=()=>{};
 slow.text=()=>new Promise(resolve=>{finish=resolve;});
 const pending=importFiles([slow]);click('clear');finish(JSON.stringify([record('Debug python code')]));await pending;await sleep();
 check('Clear cancels stale import result',byId('shelves').children.length===0&&byId('status').textContent!.startsWith('Session cleared'));
 check('No runtime network or storage API calls',prohibited===0);
 check('No application console logs',logs===0);
 check('No external subresources',performance.getEntriesByType('resource').every(r=>!/^https?:/.test(r.name)));
 let blocked=false;document.addEventListener('securitypolicyviolation',event=>{if(event.effectiveDirective==='connect-src')blocked=true;});
 try{await nativeFetch('https://example.invalid/chatshelf-synthetic-csp-probe');}catch{/* expected CSP rejection before network */}
 for(let i=0;i<50&&!blocked;i++)await sleep();
 check('Browser enforces connect-src CSP',blocked);
}catch{check('Harness completed without unexpected exception',false);}
const report=document.createElement('section');report.id='qa-report';
report.append(Object.assign(document.createElement('h1'),{textContent:`Browser checks: ${results.filter(r=>r.passed).length}/${results.length} passed`}));
for(const result of results)report.append(Object.assign(document.createElement('p'),{textContent:`${result.passed?'PASS':'FAIL'} · ${result.check}`}));
document.body.replaceChildren(report);

})();
