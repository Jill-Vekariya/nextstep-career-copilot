import { PROMPTS, TRACKS, REPORT_SCHEMA } from './prompts.js';
import { AppError, validateReport } from './validation.js';
export async function generateReport(input,{apiKey,model='gemini-3.8-flash',fetcher=fetch}={}){
 if(!apiKey) throw new AppError('Live AI is not configured. Add GEMINI_API_KEY in Vercel settings and redeploy. You can explore the sample report meanwhile.',503);
 if(!/^gemini-[a-zA-Z0-9.\-]+$/.test(model)) throw new AppError('The server model setting is invalid.',503);
 let response;
 try{
  response=await fetcher(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{
   method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':apiKey},signal:AbortSignal.timeout(45000),
   body:JSON.stringify({systemInstruction:{parts:[{text:PROMPTS[input.promptVersion].text}]},contents:[{role:'user',parts:[{text:JSON.stringify({career_track:TRACKS[input.track],feedback_language:input.language,resume_data:input.resume,job_description_data:input.job})}]}],generationConfig:{responseMimeType:'application/json',responseJsonSchema:REPORT_SCHEMA,maxOutputTokens:8192}})
  });
 }catch(err){throw new AppError(err.name==='TimeoutError'?'Analysis timed out. Please try again.':'Could not reach Gemini. Please try again shortly.',504);}
 if(!response.ok){
  const message={400:'Gemini rejected the request. Check the configured model supports structured output.',401:'The Gemini API key was rejected. Update the server secret.',403:'Gemini access was denied. Check the API key and project permissions.',404:'The configured Gemini model is unavailable. Set GEMINI_MODEL to an available model and redeploy.',429:'Gemini quota or rate limit reached. Wait and try again; check your AI Studio limits.'}[response.status]||'Gemini is temporarily unavailable. Please try again.';
  throw new AppError(message,response.status===429?429:502);
 }
 let result;
 try{
  const data=await response.json(); const candidate=data.candidates?.[0];
  if(candidate?.finishReason!=='STOP') throw new Error('Incomplete response');
  const text=candidate.content.parts.filter(p=>p.text&&!p.thought).map(p=>p.text).join('');result=JSON.parse(text);
 }catch{throw new AppError('Gemini returned an incomplete or unreadable report. Please try again.',502);}
 return {report:validateReport(result,input),meta:{model,promptVersion:input.promptVersion,promptName:PROMPTS[input.promptVersion].name,language:input.language,track:input.track,createdAt:new Date().toISOString(),source:'gemini'}};
}
