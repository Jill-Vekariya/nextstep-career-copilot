import { mkdir, copyFile, readFile } from 'node:fs/promises';
await mkdir('public/vendor', {recursive:true});
for (const name of ['pdf.mjs','pdf.worker.mjs']) await copyFile(`node_modules/pdfjs-dist/build/${name}`, `public/vendor/${name}`);
await copyFile('node_modules/pdfjs-dist/LICENSE','public/vendor/PDFJS-LICENSE.txt');
for (const f of ['public/index.html','public/app.js','public/style.css']) await readFile(f);
console.log('Built static app with self-hosted PDF.js. Vercel discovers api/*.js server functions.');
