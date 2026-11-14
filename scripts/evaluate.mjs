// Optional live five-fixture evaluation. Run only with your own configured API key.
import {mkdir,writeFile} from 'node:fs/promises';
import {samples} from '../public/samples.js';
import {validateInput} from '../lib/validation.js';
import {generateReport} from '../lib/gemini.js';
try{process.loadEnvFile('.env.local');}catch{}
if(!process.env.GEMINI_API_KEY){console.error('No GEMINI_API_KEY configured. Live evaluation NOT run.');process.exit(1);}
await mkdir('evaluation-results',{recursive:true});
let failed=0;
for(let i=0;i<samples.length;i++){
 try{
  const result=await generateReport(validateInput({...samples[i],promptVersion:'v2',language:'English'}),{apiKey:process.env.GEMINI_API_KEY,model:process.env.GEMINI_MODEL||'gemini-3.8-flash'});
  await writeFile(`evaluation-results/case-${i+1}.json`,JSON.stringify(result,null,2));
  console.log(`${i+1}. ${samples[i].name}: evidence/format PASS, coaching score ${result.report.score}/100. Human quality review required.`);
 }catch(err){failed++;console.error(`${i+1}. ${samples[i].name}: ${err.message}`);}
}
process.exitCode=failed?1:0;
