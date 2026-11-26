import {build} from 'esbuild';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const result=await build({entryPoints:['src/ui.ts'],bundle:true,format:'iife',target:'chrome110',write:false,minify:true});
const js=result.outputFiles[0].text.trim();const css=(await readFile('src/style.css','utf8')).trim();
const hash=s=>createHash('sha256').update(s).digest('base64');
const csp=`default-src 'none'; script-src 'sha256-${hash(js)}'; style-src 'sha256-${hash(css)}'; connect-src 'none'; img-src 'none'; font-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; worker-src 'none'; frame-src 'none'`;
const html=(await readFile('src/shell.html','utf8')).replace('__CSP__',csp).replace('__CSS__',css).replace('__JS__',()=>js);
await mkdir('release',{recursive:true});await writeFile('release/ChatShelf.html',html);console.log('Built release/ChatShelf.html (self-contained, hash-based CSP)');
