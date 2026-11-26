import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const html=readFileSync(new URL('../release/ChatShelf.html',import.meta.url),'utf8');
test('single HTML artifact has matching script/style hashes and restrictive CSP',()=>{
 const csp=html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
 for(const tag of ['script','style']){const source=html.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))[1];const hash=createHash('sha256').update(source).digest('base64');assert.ok(csp.includes(`'sha256-${hash}'`));}
 for(const rule of ["default-src 'none'","connect-src 'none'","worker-src 'none'","form-action 'none'","object-src 'none'"])assert.ok(csp.includes(rule));
 assert.ok(!/unsafe-inline|unsafe-eval|__CSP__|__CSS__|__JS__/.test(html));
 assert.ok(!/<(?:script|link|img|iframe)[^>]+(?:src|href)=/i.test(html));
});
test('UI imports only safe entry point and contains no data sinks or storage',()=>{
 const source=readFileSync(new URL('../src/ui.ts',import.meta.url),'utf8');
 assert.ok(source.includes("from './index.js'"));
 assert.ok(!/innerHTML|outerHTML|insertAdjacentHTML|localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|console\./.test(source));
 assert.ok(!/\.name\b/.test(source));
 assert.ok(source.includes("picker.value=''"));assert.ok(source.includes('token!==generation'));assert.ok(source.includes("window.addEventListener('pagehide'"));
});
