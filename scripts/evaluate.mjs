// Run live evaluations locally or through the deployed server; keep credentials server-side.
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {parseArgs} from 'node:util';
import {samples} from '../public/samples.js';
import {validateInput,validateReport} from '../lib/validation.js';
import {generateReport} from '../lib/gemini.js';
try{process.loadEnvFile('.env.local');}catch{}
const {values}=parseArgs({options:{url:{type:'string'}}});
const key=process.env.GEMINI_API_KEY;
const target=values.url||process.env.EVALUATION_URL;
const model=process.env.GEMINI_MODEL||'gemini-3.8-flash';
let targetOrigin='';try{if(target)targetOrigin=new URL(target).origin;}catch{targetOrigin='invalid endpoint';}
const started=new Date();const mode=target?'deployed endpoint':'direct Gemini';
const rows=[];let failed=0,generationAttempts=0,setup='Passed',usedModel=model;
const safe=value=>String(value).replaceAll(key||'__no_secret__','[redacted]').replaceAll('|','/').replace(/\s+/g,' ').slice(0,500);
async function saveRecord(){
 const path='docs/EVALUATION.md';const heading='\n## Execution results\n';
 const source=(await readFile(path,'utf8')).split(heading)[0];
 const table=rows.map(r=>`| ${safe(r.case)} | ${r.status} | ${r.score??'—'} | ${r.ms??'—'} | ${safe(r.details)} |`).join('\n');
 await writeFile(path,source+heading+`\nStarted: ${started.toISOString()}\n\nMode: ${mode}${target?` · Endpoint: ${targetOrigin}`:''}\n\nModel: \`${safe(usedModel)}\` · Prompt: Evidence first v2\n\nSetup: ${safe(setup)}\n\nGeneration attempts: ${generationAttempts} · Successful reports: ${rows.filter(r=>r.status==='Passed').length}/5\n\n| Case | Status | Coaching score | Duration (ms) | Findings / failure |\n| --- | --- | --- | --- | --- |\n${table}\n\nInputs: five fictional resume/job-description pairs. A passed case means a real provider response passed schema, score-bound, exact-quotation and missing-keyword validation. Coaching usefulness and factual preservation still need a separate content assessment.\n`);
}
try{
 if(target){
  const url=new URL(target);if(url.protocol!=='https:'||url.username||url.password)throw new Error('Use an HTTPS deployment URL without credentials.');
  const response=await fetch(new URL('/api/status',url),{signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw new Error(`Deployment status returned HTTP ${response.status}.`);
  const status=await response.json();usedModel=status.model||model;
  if(!status.configured)throw new Error('The deployed server has no GEMINI_API_KEY configured.');
 }else{
  if(!key)throw new Error('GEMINI_API_KEY is absent from the local server environment.');
  if(!/^gemini-[a-zA-Z0-9.\-]+$/.test(model))throw new Error('Choose a valid Gemini model ID.');
  const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}`,{headers:{'x-goog-api-key':key},signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw new Error(`Account model-access check returned HTTP ${response.status}.`);
  const metadata=await response.json();
  if(!metadata.supportedGenerationMethods?.includes('generateContent'))throw new Error('The selected model does not support generateContent.');
 }
}catch(error){
 setup=`Blocked: ${safe(error.message)}`;
 for(const item of samples)rows.push({case:item.name,status:'Not run',details:setup});
 await saveRecord();console.error(setup);process.exitCode=1;
}
if(!process.exitCode){
 await mkdir('evaluation-results',{recursive:true});
 for(let i=0;i<samples.length;i++){
  const input=validateInput({...samples[i],promptVersion:'v2',language:'English'});const before=Date.now();generationAttempts++;
  try{
   let result;
   if(target){
    const response=await fetch(new URL('/api/analyze',target),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input),signal:AbortSignal.timeout(110000)});
    const data=await response.json();if(!response.ok)throw new Error(data.error||`Analysis returned HTTP ${response.status}.`);
    if(data.meta?.source!=='gemini')throw new Error('The response is not a live Gemini analysis.');
    const report={...data.report};delete report.score;
    result={...data,report:validateReport(report,input)};
   }else result=await generateReport(input,{apiKey:key,model});
   usedModel=result.meta.model;
   await writeFile(`evaluation-results/case-${i+1}.json`,JSON.stringify(result,null,2));
   rows.push({case:samples[i].name,status:'Passed',score:result.report.score,ms:Date.now()-before,details:`${result.report.strengths.length} supported strengths; ${result.report.keyword_gaps.length} checked keyword gaps; ${result.report.rewrites.length} rewrite originals verified.`});
   console.log(`${i+1}. ${samples[i].name}: PASS, ${result.report.score}/100.`);
  }catch(error){
   failed++;const message=safe(error.message);rows.push({case:samples[i].name,status:'Failed',ms:Date.now()-before,details:message});
   await writeFile(`evaluation-results/case-${i+1}-failure.json`,JSON.stringify({case:samples[i].name,error:message},null,2));
   console.error(`${i+1}. ${samples[i].name}: ${message}`);
  }
 }
 await saveRecord();process.exitCode=failed?1:0;
}
