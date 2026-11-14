import { createHash } from 'node:crypto';
import { validateInput,AppError } from '../lib/validation.js';
import { generateReport } from '../lib/gemini.js';
const windows=new Map();
export function rateAllowed(id,now=Date.now()){
 for(const [k,v] of windows) if(v.reset<=now) windows.delete(k);
 if(windows.size>10000) return false;
 const key=createHash('sha256').update(id).digest('hex');
 const state=windows.get(key)||{count:0,reset:now+60000}; state.count++;windows.set(key,state);return state.count<=6;
}
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Use POST for analysis.'});}
 try{
  const origin=req.headers.origin;
  if(origin && new URL(origin).host!==req.headers.host) throw new AppError('Please use this app to request an analysis.',403);
  if(!req.headers['content-type']?.includes('application/json')) throw new AppError('Content-Type must be application/json.',415);
  if(!rateAllowed(req.headers['x-real-ip']||req.socket?.remoteAddress||'unknown')){res.setHeader('Retry-After','60');throw new AppError('Too many requests. Wait one minute and try again.',429);}
  const raw=typeof req.body==='string'?req.body:JSON.stringify(req.body??null);
  if(Buffer.byteLength(raw)>80000) throw new AppError('Input is too large. Please shorten the documents.',413);
  let body;try{body=JSON.parse(raw);}catch{throw new AppError('Invalid JSON input.');}
  const input=validateInput(body);
  const result=await generateReport(input,{apiKey:process.env.GEMINI_API_KEY,model:process.env.GEMINI_MODEL||'gemini-3.5-flash-lite'});
  return res.status(200).json(result);
 }catch(err){return res.status(err instanceof AppError?err.status:500).json({error:err instanceof AppError?err.message:'Analysis failed. Please try again.'});}
}
