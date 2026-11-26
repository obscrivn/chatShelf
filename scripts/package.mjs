import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const bytes=await readFile('release/ChatShelf.html');
await writeFile('release/SHA256SUMS',`${createHash('sha256').update(bytes).digest('hex')}  ChatShelf.html\n`);
console.log(`Packaged release/ChatShelf.html: ${bytes.length} bytes`);
