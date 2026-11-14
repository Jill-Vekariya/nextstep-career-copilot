// Run the five-case suite against the configured Google project.
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {samples} from '../public/samples.js';
import {validateInput} from '../lib/validation.js';
import {generateReport} from '../lib/gemini.js';
try{process.loadEnvFile('.env.local');}catch{}
const key=process.env.GEMINI_API_KEY;
const model=process.env.GEMINI_MODEL||'gemini-3.8-flash';
if(!key){console.error('Set GEMINI_API_KEY in the server environment to run the evaluation suite.');process.exit(1);}
if(!/^gemini-[a-zA-Z0-9.\-]+$/.test(model)){console.error('Choose a valid Gemini model ID.');process.exit(1);}
let metadata;
try{
 const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}`,{headers:{'x-goog-api-key':key},signal:AbortSignal.timeout(20000)});
 if(!res.ok)throw new Error(`Model-access check returned HTTP ${res.status}.`);
 metadata=await res.json();
 if(!metadata.supportedGenerationMethods?.includes('generateContent'))throw new Error('This model does not support generateContent.');
}catch(err){console.error(err.message);process.exit(1);}
await mkdir('evaluation-results',{recursive:true});
const rows=[];let failed=0;
for(let i=0;i<samples.length;i++){
 try{
  const result=await generateReport(validateInput({...samples[i],promptVersion:'v2',language:'English'}),{apiKey:key,model});
  await writeFile(`evaluation-results/case-${i+1}.json`,JSON.stringify(result,null,2));
  rows.push(`| ${samples[i].name} | ${result.report.score}/100 | Pass |`);
  console.log(`${i+1}. ${samples[i].name}: evidence/format PASS, coaching score ${result.report.score}/100.`);
 }catch(err){failed++;rows.push(`| ${samples[i].name} | — | Failed |`);console.error(`${i+1}. ${samples[i].name}: ${err.message}`);}
}
const path='docs/EVALUATION.md';const heading='\n## Execution results\n';
const source=(await readFile(path,'utf8')).split(heading)[0];
await writeFile(path,source+heading+`\nExecuted: ${new Date().toISOString()}\n\nModel: \`${model}\` · Prompt: Evidence first v2 · Account model-access check: passed\n\n| Case | Coaching score | Schema and evidence validation |\n| --- | --- | --- |\n${rows.join('\n')}\n\nFixture type: fictional. Validation covers response structure, score bounds, exact quotations and missing-keyword checks.\n`);
process.exitCode=failed?1:0;
