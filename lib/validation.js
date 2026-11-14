import { PROMPTS, TRACKS, REPORT_SCHEMA } from './prompts.js';
export class AppError extends Error {constructor(message,status=400){super(message);this.status=status;}}
export const normalized = value => value.normalize('NFKC').replace(/\s+/g,' ').trim().toLowerCase();
export function validateInput(body){
 if (!body || typeof body !== 'object' || Array.isArray(body)) throw new AppError('Send a JSON object.');
 for (const [key,min,max] of [['resume',180,35000],['job',80,18000]]) {
  if(typeof body[key] !== 'string' || body[key].trim().length<min || body[key].length>max) throw new AppError(`${key==='resume'?'Resume':'Job description'} must contain ${min}–${max.toLocaleString()} characters.`);
 }
 const {resume,job,track='general',language='English',promptVersion='v2'}=body;
 if(!Object.hasOwn(TRACKS,track)||!Object.hasOwn(PROMPTS,promptVersion)||!['English','Hindi'].includes(language)) throw new AppError('Choose a supported track, language and prompt version.');
 return {resume:resume.trim(),job:job.trim(),track,language,promptVersion};
}
function schemaCheck(v,s,path='report'){
 if(s.type==='object'){
  if(!v || typeof v!=='object'||Array.isArray(v)) throw new Error(path);
  if(s.required.some(k=>!Object.hasOwn(v,k)) || Object.keys(v).some(k=>!Object.hasOwn(s.properties,k))) throw new Error(path);
  for(const [k,sub] of Object.entries(s.properties)) schemaCheck(v[k],sub,`${path}.${k}`);
 }else if(s.type==='array'){
  if(!Array.isArray(v)||v.length<(s.minItems??0)||v.length>(s.maxItems??10)) throw new Error(path);
  v.forEach(x=>schemaCheck(x,s.items,path));
 }else if(s.type==='integer'){
  if(!Number.isInteger(v)||v<s.minimum||v>s.maximum) throw new Error(path);
 }else if(typeof v!=='string'||!v.trim()||v.length>2500||(s.enum&&!s.enum.includes(v))) throw new Error(path);
}
export function validateReport(value,input){
 try{
  schemaCheck(value,REPORT_SCHEMA);
  const resume=normalized(input.resume), job=normalized(input.job);
  for(const item of [...value.strengths,...value.improvements]) if(!resume.includes(normalized(item.evidence))) throw new Error('Unsupported quote');
  for(const item of value.rewrites) if(!resume.includes(normalized(item.original))) throw new Error('Unsupported original');
  const seen=new Set();
  for(const {keyword} of value.keyword_gaps){const k=normalized(keyword);if(k.length<2||!job.includes(k)||resume.includes(k)||seen.has(k)) throw new Error('Unsupported keyword');seen.add(k);}
  return {...value,score:Object.values(value.category_scores).reduce((a,b)=>a+b,0)};
 }catch{throw new AppError('The AI response did not pass evidence and format checks. Please try again.',502);}
}
