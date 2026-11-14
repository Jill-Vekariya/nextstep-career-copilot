import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import analyze from '../api/analyze.js';
import status from '../api/status.js';
try { process.loadEnvFile('.env.local'); } catch {}
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.txt':'text/plain'};
const server=http.createServer(async(req,res)=>{
 res.status=code=>{res.statusCode=code;return res;};res.json=data=>res.end(JSON.stringify(data));
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/api/status') return status(req,res);
 if(url.pathname==='/api/analyze'){
  const chunks=[];let bytes=0;
  for await (const chunk of req){bytes+=chunk.length;if(bytes>80000){res.statusCode=413;return res.json({error:'Input too large.'});}chunks.push(chunk);}
  req.body=Buffer.concat(chunks).toString();return analyze(req,res);
 }
 const name=path.resolve('public','.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
 if(!name.startsWith(path.resolve('public')+path.sep)){res.statusCode=403;return res.end();}
 try{const data=await readFile(name);res.setHeader('Content-Type',mime[path.extname(name)]||'application/octet-stream');res.end(data);}catch{res.statusCode=404;res.end('Not found');}
});
const portArg=process.argv.indexOf('--port');
server.listen(Number(process.env.PORT)||(portArg>=0?Number(process.argv[portArg+1]):3000),'0.0.0.0',()=>console.log('NextStep development server ready'));
