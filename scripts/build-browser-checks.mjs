import {build} from 'esbuild';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const output=await build({entryPoints:['tests/browser-harness.ts'],bundle:true,format:'iife',target:'chrome110',write:false,minify:true});
const js=output.outputFiles[0].text.trim();const css=(await readFile('src/style.css','utf8')).trim();
const hash=x=>createHash('sha256').update(x).digest('base64');
const csp=`default-src 'none'; script-src 'sha256-${hash(js)}'; style-src 'sha256-${hash(css)}'; connect-src 'none'; worker-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'`;
const html=(await readFile('src/shell.html','utf8')).replace('__CSP__',csp).replace('__CSS__',css).replace('__JS__',()=>js);
await mkdir('dist/qa',{recursive:true});await writeFile('dist/qa/browser-checks.html',html);console.log('Built synthetic browser checks: dist/qa/browser-checks.html');
