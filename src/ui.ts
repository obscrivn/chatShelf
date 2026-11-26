import {analyze, type SafeLibrary, type SafeBook} from './index.js';
const get = <T extends HTMLElement>(id:string) => document.getElementById(id) as T;
const shelves=get('shelves'), status=get('status'), empty=get('empty'), detail=get<HTMLDialogElement>('detail');
const picker=get<HTMLInputElement>('files');
let generation=0;
function element<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string,className?:string){const node=document.createElement(tag);if(text)node.textContent=text;if(className)node.className=className;return node;}
function showBook(book:SafeBook, opener:HTMLButtonElement){
 const body=get('detail-body');body.replaceChildren(element('p','FROM YOUR SHELF','eyebrow'),element('h2',book.topic),element('p',`${book.conversations} distinct conversations`,'muted'));
 if(!book.recurring.length)body.append(element('p','No recurring task detected yet. A reusable task needs evidence in at least two distinct conversations.'));
 for(const task of book.recurring){body.append(element('h3',task.task),element('p',`${task.conversations} conversations share this task.`),element('h4','A prompt to start with'),element('p',task.prompt,'prompt'),element('h4','Your checklist'));const list=element('ol');task.checklist.forEach(item=>list.append(element('li',item)));body.append(list);}
 body.append(element('p','These are predefined guides, never excerpts from your conversations.','muted'));
 detail.showModal();detail.addEventListener('close',()=>opener.focus(),{once:true});
}
function render(library:SafeLibrary){
 shelves.replaceChildren();empty.hidden=library.books.length>0;
 for(const book of library.books){
 const section=element('section',undefined,`shelf ${book.topic.toLowerCase()}`);const heading=element('div',undefined,'shelf-heading');heading.append(element('h2',book.topic),element('span',`${book.conversations} conversations`,'muted'));section.append(heading);
 const row=element('div',undefined,'book-row');const button=element('button',undefined,'book');button.type='button';button.setAttribute('aria-label',`Open ${book.topic}, ${book.conversations} conversations`);
 button.append(element('span','CHATSHELF COLLECTION','book-edition'),element('span',book.topic,'book-title'),element('span',book.recurring[0]?.task ?? 'Topic collection','book-subtitle'),element('span',`${book.conversations} conversations`,'book-count'));
 button.addEventListener('click',()=>showBook(book,button));row.append(button,element('p',book.recurring.length ? 'A familiar task.\nA fresh starting point.' : 'Ideas gathered here.\nPatterns take time.','shelf-note'));section.append(row);shelves.append(section);
 }
}
function clear(message='Session cleared. Import files to begin again.'){
 generation++;picker.value='';detail.close();get('detail-body').replaceChildren();render({books:[],status:'READY'});status.textContent=message;
}
get('clear').addEventListener('click',()=>clear());
get('import').addEventListener('click',()=>picker.click());
get('close').addEventListener('click',()=>detail.close());
get('demo').addEventListener('click',()=>{
 generation++;picker.value='';detail.close();get('detail-body').replaceChildren();
 const texts=['Debug python code and fix a function bug','Revise writing and edit an essay draft','Create a lesson quiz for a course','Plan project milestones and schedule tasks'];
 const records=texts.flatMap((text,i)=>[0,1,2].slice(0,i===3?2:3).map(j=>({id:`demo-${i}-${j}`,current_node:'u',mapping:{u:{parent:null,message:{author:{role:'user'},content:{content_type:'text',parts:[text]}}}}})));
 render(analyze([JSON.stringify(records)]));status.textContent='Synthetic sample library. No personal data is loaded.';
});
picker.addEventListener('change',async()=>{
 const token=++generation;const files=Array.from(picker.files ?? []);picker.value='';
 detail.close();get('detail-body').replaceChildren();render({books:[],status:'READY'});
 if(!files.length)return;
 if(files.length>20||files.some(f=>f.size>10000000)){status.textContent='Import not accepted. Choose up to 20 JSON files, each no larger than 10 MB.';return;}
 status.textContent='Reading locally…';
 try {
 const source:string[]=[];for(const file of files){if(token!==generation)return;source.push(await file.text());}
 if(token!==generation)return;const library=analyze(source);source.length=0;render(library);
 status.textContent=library.status==='REJECTED_INPUT'?'Import not accepted. Check the JSON format and size limits.':library.books.length?'Your local library is ready. Select a book to explore.':'No approved topics found. Unsupported, unknown or sensitive content may be excluded.';
 }catch{if(token===generation)status.textContent='Import could not be read. Please choose JSON files again.';}
});
window.addEventListener('pagehide',()=>clear('Session cleared.'));
