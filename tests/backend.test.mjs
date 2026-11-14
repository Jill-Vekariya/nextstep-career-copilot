import test from 'node:test';
import assert from 'node:assert/strict';
import {validateInput,validateReport} from '../lib/validation.js';
import {generateReport} from '../lib/gemini.js';
import handler,{rateAllowed} from '../api/analyze.js';
import status from '../api/status.js';
import {samples,exampleReport} from '../public/samples.js';
const input=validateInput({...samples[0],promptVersion:'v2',language:'English'});
const good=()=>{const r=structuredClone(exampleReport.report);delete r.score;return r;};
for(const sample of samples)test(`Fictional fixture accepted: ${sample.name}`,()=>assert.equal(validateInput(sample).track,sample.track));
test('Rejects too-short input and unsupported prompt/track injection',()=>{for(const data of [{...input,resume:'short'},{...input,promptVersion:'__proto__'},{...input,track:'constructor'},{...input,language:'Spanish'}])assert.throws(()=>validateInput(data));});
test('Score comes from bounded rubric components',()=>{const value=validateReport(good(),input);assert.equal(value.score,76);});
test('Rejects invented resume quote',()=>{const r=good();r.strengths[0].evidence='Managed a team of 100';assert.throws(()=>validateReport(r,input));});
test('Rejects keyword already present in resume',()=>{const r=good();r.keyword_gaps[0].keyword='React';assert.throws(()=>validateReport(r,input));});
test('Rejects missing keyword not in job description',()=>{const r=good();r.keyword_gaps[0].keyword='Kubernetes';assert.throws(()=>validateReport(r,input));});
test('Rejects fabricated original bullet and inflated score',()=>{const r=good();r.rewrites[0].original='Invented achievement';assert.throws(()=>validateReport(r,input));const x=good();x.category_scores.skills=100;assert.throws(()=>validateReport(x,input));});
test('Rejects malformed nested output',()=>{const r=good();r.plan={};assert.throws(()=>validateReport(r,input));});
test('Missing API key fails clearly without contacting provider',async()=>{await assert.rejects(()=>generateReport(input,{}),e=>e.status===503);});
test('Successful mocked provider response uses server header, schema and separate system prompt',async()=>{
 const fetcher=async(url,options)=>{assert.ok(url.startsWith('https://generativelanguage.googleapis.com/'));assert.equal(options.headers['x-goog-api-key'],'test-secret');const body=JSON.parse(options.body);assert.ok(body.generationConfig.responseJsonSchema);assert.ok(body.systemInstruction.parts[0].text.includes('ROLE'));assert.ok(!options.body.includes('test-secret'));return {ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{thought:true,text:'private reasoning'},{text:JSON.stringify(good())}]}}]})};};
 const result=await generateReport(input,{apiKey:'test-secret',fetcher});assert.equal(result.meta.source,'gemini');assert.equal(result.report.score,76);
});
for(const code of [400,403,404,429,503])test(`Provider HTTP ${code} produces safe error`,async()=>{await assert.rejects(()=>generateReport(input,{apiKey:'test',fetcher:async()=>({ok:false,status:code})}),e=>!e.message.includes('test-secret')&&e.status===(code===429?429:502));});
test('Truncated and malformed provider output rejected',async()=>{for(const candidate of [{finishReason:'MAX_TOKENS'},{finishReason:'STOP',content:{parts:[{text:'invalid'}]}}])await assert.rejects(()=>generateReport(input,{apiKey:'test',fetcher:async()=>({ok:true,json:async()=>({candidates:[candidate]})})}));});
test('Retries a transient provider failure once, then validates the real response',async()=>{
 let calls=0,pauses=0;
 const result=await generateReport(input,{apiKey:'test-secret',pause:async()=>{pauses++;},fetcher:async(_url,options)=>{
  calls++;assert.equal(JSON.parse(options.body).generationConfig.thinkingConfig.thinkingLevel,'low');
  return calls===1?{ok:false,status:503}:{ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(good())}]}}]})};
 }});assert.equal(calls,2);assert.equal(pauses,1);assert.equal(result.report.score,76);
});
test('Does not retry quota errors and stops after two transient failures',async()=>{
 for(const [code,expectedCalls] of [[429,1],[503,2]]){let calls=0;
  await assert.rejects(()=>generateReport(input,{apiKey:'test-secret',pause:async()=>{},fetcher:async()=>{calls++;return {ok:false,status:code};}}),e=>e.message.includes(`Provider HTTP ${code}`)&&!e.message.includes('test-secret'));
  assert.equal(calls,expectedCalls);
 }
});
function response(){return {headers:{},statusCode:200,setHeader(k,v){this.headers[k]=v;},status(s){this.statusCode=s;return this;},json(v){this.data=v;return this;}};}
test('API rejects GET, cross-origin, invalid JSON and oversized bodies',async()=>{
 for(const [req,code] of [[{method:'GET',headers:{}},405],[{method:'POST',headers:{origin:'https://other.example',host:'app.example','content-type':'application/json'}},403],[{method:'POST',headers:{'content-type':'application/json'},body:'{'},400],[{method:'POST',headers:{'content-type':'application/json'},body:'x'.repeat(81000)},413]]){const res=response();await handler(req,res);assert.equal(res.statusCode,code);assert.equal(res.headers['Cache-Control'],'no-store');}
});
test('Status never returns the API key',()=>{const old=process.env.GEMINI_API_KEY;process.env.GEMINI_API_KEY='private-sentinel';const res=response();status({method:'GET'},res);assert.equal(res.data.configured,true);assert.ok(!JSON.stringify(res.data).includes('private-sentinel'));if(old===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=old;});
test('Best-effort per-instance rate window expires',()=>{for(let i=0;i<6;i++)assert.equal(rateAllowed('test-ip',1000),true);assert.equal(rateAllowed('test-ip',1000),false);assert.equal(rateAllowed('test-ip',62000),true);});
