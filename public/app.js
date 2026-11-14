import {samples,exampleReport} from './samples.js';
const $=s=>document.querySelector(s);
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
let current=null, sampleIndex=0, uploadGeneration=0, busy=false;
const historyKey='nextstep-reports-v1';
function readHistory(){try{const value=JSON.parse(localStorage.getItem(historyKey)||'[]');return Array.isArray(value)?value.slice(0,10).filter(v=>v?.report&&v?.meta&&typeof v.id==='string'):[];}catch{return [];}}
function writeHistory(items){try{localStorage.setItem(historyKey,JSON.stringify(items));updateHistory();}catch{showError('This browser could not save the report. Export it instead.');}}
function setView(name){document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!==`view-${name}`);document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('active',n.dataset.view===name));$('#breadcrumb').textContent={analyze:'RESUME STUDIO',history:'SAVED REPORTS',prompts:'PROMPT LAB'}[name];if(name==='history')updateHistory();window.scrollTo({top:0,behavior:'smooth'});}
document.querySelectorAll('.nav').forEach(n=>n.addEventListener('click',()=>setView(n.dataset.view)));
for(const id of ['resume','job']) $('#'+id).addEventListener('input',updateCounts);
function updateCounts(){for(const [id,max] of [['resume',35000],['job',18000]]) $('#'+id+'-count').textContent=`${$('#'+id).value.length.toLocaleString()} / ${max.toLocaleString()}`;}
function showError(message){$('#error').textContent=message;$('#error').hidden=false;}
function loadSample(){if(busy)return;$('#error').hidden=true;const item=samples[sampleIndex++%samples.length];$('#resume').value=item.resume;$('#job').value=item.job;$('#track').value=item.track;$('#file-status').textContent=`Loaded fictional example: ${item.name}. Click Try a sample again for the next of five examples.`;$('#consent').checked=false;updateCounts();}
$('#sample-button').addEventListener('click',loadSample);
$('#sample-report').addEventListener('click',()=>{if(busy)return;$('#error').hidden=true;const item=samples[0];$('#resume').value=item.resume;$('#job').value=item.job;$('#track').value=item.track;updateCounts();renderReport(structuredClone(exampleReport));});
async function importFile(file){
 const generation=++uploadGeneration; if(!file)return;
 if(file.size>5*1024*1024){$('#file-status').textContent='File exceeds 5 MB. Choose a smaller file.';return;}
 $('#analyze').disabled=true;$('#file-status').textContent='Reading your file locally…';
 try{
  let text;
  if(/\.pdf$/i.test(file.name)){
   const pdfjs=await import('/vendor/pdf.mjs');pdfjs.GlobalWorkerOptions.workerSrc='/vendor/pdf.worker.mjs';
   const task=pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false});
   const pdf=await task.promise;
   try{
    if(pdf.numPages>15)throw new Error('Please use a PDF with no more than 15 pages.');
    const pages=[];
    for(let p=1;p<=pdf.numPages;p++){
     const content=await(await pdf.getPage(p)).getTextContent();
     pages.push(content.items.map(i=>i.str+(i.hasEOL?'\n':' ')).join(''));
    }
    text=pages.join('\n\n');
   }finally{await task.destroy();}
   if(text.trim().length<100)throw new Error('No usable text found. This may be a scanned PDF; use OCR first or paste the text.');
  }else if(/\.txt$/i.test(file.name)){text=await file.text();}
  else throw new Error('Choose a PDF or TXT file.');
  if(text.length>35000)throw new Error('Extracted text exceeds 35,000 characters. Shorten the resume and paste it.');
  if(generation!==uploadGeneration)return;
  $('#resume').value=text;updateCounts();$('#file-status').textContent=`${file.name} imported. Review the extracted text for reading-order errors before analyzing.`;
 }catch(err){if(generation===uploadGeneration)$('#file-status').textContent=err.name==='PasswordException'?'This PDF is password protected. Use an unlocked copy.':err.message;}
 finally{if(generation===uploadGeneration)$('#analyze').disabled=busy;}
}
$('#resume-file').addEventListener('change',e=>importFile(e.target.files[0]));
const drop=$('.upload');for(const type of ['dragenter','dragover'])drop.addEventListener(type,e=>{e.preventDefault();drop.classList.add('dragging');});
for(const type of ['dragleave','drop'])drop.addEventListener(type,e=>{e.preventDefault();drop.classList.remove('dragging');if(type==='drop')importFile(e.dataTransfer.files[0]);});
$('#analysis-form').addEventListener('submit',async e=>{
 e.preventDefault();if(busy)return;$('#error').hidden=true;busy=true;
 $('#analyze').disabled=true;$('#sample-button').disabled=true;$('#resume-file').disabled=true;
 $('#empty-state').hidden=true;$('#report').hidden=true;$('#loading').hidden=false;$('#results-column').setAttribute('aria-busy','true');
 const input={resume:$('#resume').value,job:$('#job').value,track:$('#track').value,language:$('#language').value,promptVersion:$('#prompt').value};
 try{
  const response=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input),signal:AbortSignal.timeout(55000)});
  let data;try{data=await response.json();}catch{throw new Error('The server returned an unreadable response. Check the deployment.');}
  if(!response.ok)throw new Error(data.error||'Analysis failed. Please try again.');
  if(!data.report||!data.meta)throw new Error('The response was incomplete. Please try again.');
  renderReport(data);
  if($('#save-history').checked){const item={...data,id:crypto.randomUUID()};writeHistory([item,...readHistory()].slice(0,10));}
 }catch(err){showError(err.name==='TimeoutError'?'The request timed out. Please try again.':err.message);$('#report').hidden=!current;$('#empty-state').hidden=Boolean(current);}
 finally{busy=false;$('#analyze').disabled=false;$('#sample-button').disabled=false;$('#resume-file').disabled=false;$('#loading').hidden=true;$('#results-column').setAttribute('aria-busy','false');}
});
function section(title,subtitle){const box=el('section',undefined,'card report-section');const h=el('h3',title,'section-title');if(subtitle)h.append(el('small',subtitle));box.append(h);return box;}
function actionButton(label,fn){const b=el('button',label,'secondary');b.type='button';b.addEventListener('click',fn);return b;}
function renderReport(data){
 current=data;const {report:r,meta:m}=data;const root=$('#report');root.replaceChildren();$('#empty-state').hidden=true;root.hidden=false;
 const top=el('div',undefined,'card report-top');const meta=el('div',undefined,'report-meta');meta.append(el('span',m.source==='illustrative'?'ILLUSTRATIVE SAMPLE · NOT LIVE AI':'YOUR CAREER SNAPSHOT'),el('span',`${m.promptVersion} · ${m.language}`));top.append(meta);
 const score=el('div',undefined,'score-area');const circle=el('strong',String(r.score),'score-circle');circle.append(el('small','/ 100'));const text=el('div');text.append(el('h2','Your next step, clearer.'),el('p','Coaching alignment estimate · not an ATS score'));score.append(circle,text);top.append(score,el('p',r.summary,'report-summary'));
 const bars=el('div',undefined,'rubric-bars');for(const [key,max] of [['skills',40],['experience',30],['impact',20],['clarity',10]]){const row=el('div');const progress=el('progress');progress.max=max;progress.value=r.category_scores[key];progress.setAttribute('aria-label',`${key}: ${r.category_scores[key]} out of ${max}`);row.append(el('label',key.charAt(0).toUpperCase()+key.slice(1)),progress,el('span',`${r.category_scores[key]}/${max}`));bars.append(row);}top.append(bars);root.append(top);
 const actions=el('div',undefined,'report-actions');actions.append(actionButton('Print / Save as PDF',()=>window.print()),actionButton('Export JSON',()=>downloadJSON(data)));root.append(actions);
 let box=section('What’s already working',`${r.strengths.length} strengths`);
 if(!r.strengths.length)box.append(el('p','No supported strengths were identified. Add more concrete project or work evidence.'));
 for(const item of r.strengths){const div=el('div',undefined,'report-item');div.append(el('strong',item.point),el('blockquote',item.evidence));box.append(div);}root.append(box);
 box=section('Keywords not evidenced',`${r.keyword_gaps.length} terms`);
 if(!r.keyword_gaps.length)box.append(el('p','No additional missing terms were identified. This does not confirm full qualification.'));
 for(const item of r.keyword_gaps){const div=el('div',undefined,'report-item');div.append(el('span',item.keyword,'chip'),el('p',item.reason),el('p',item.action));box.append(div);}root.append(box);
 box=section('Make these changes first','Prioritized edits');for(const item of r.improvements){const div=el('div',undefined,'report-item');const p=el('p');p.append(el('span',item.priority,`priority ${item.priority}`),el('strong',item.issue));div.append(p,el('blockquote',item.evidence),el('p',item.action));box.append(div);}if(!r.improvements.length)box.append(el('p','No grounded edits were identified. Review the document yourself before using it.'));root.append(box);
 box=section('Say it more clearly','Meaning preserved');for(const item of r.rewrites){const div=el('div',undefined,'report-item');div.append(el('blockquote',item.original),el('p','Suggested: '+item.revised));box.append(div);}if(!r.rewrites.length)box.append(el('p','No evidence-backed rewrites were produced.'));root.append(box);
 for(const [title,values] of [['Your action plan',r.plan],['Prepare for the conversation',r.interview_questions]]){box=section(title);const list=el('ol');for(const value of values)list.append(el('li',value));box.append(list);root.append(box);}
 const provenance=el('p',`${m.source==='illustrative'?'Handwritten demonstration':m.model} · ${m.promptName} · ${new Date(m.createdAt).toLocaleDateString()} · Review all advice before using it.`,'help');root.append(provenance);
}
function downloadJSON(data){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=el('a');a.href=url;a.download='nextstep-career-report.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function updateHistory(){const history=readHistory();$('#history-count').textContent=history.length;const root=$('#history-list');root.replaceChildren();if(!history.length){root.append(el('p','No saved reports yet. Select “Save report on this device” before your next live analysis.','page-description'));return;}
 for(const item of history){const card=el('article',undefined,'card history-card');const info=el('div');info.append(el('h2',`${item.report.score}/100 · ${item.meta.track}`),el('p',`${new Date(item.meta.createdAt).toLocaleString()} · ${item.meta.promptVersion} · ${item.meta.language}`));const actions=el('div',undefined,'actions');actions.append(actionButton('Open',()=>{renderReport(item);setView('analyze');}),actionButton('Delete',()=>writeHistory(readHistory().filter(x=>x.id!==item.id))));card.append(info,actions);root.append(card);}
}
$('#clear-history').addEventListener('click',()=>{if(readHistory().length&&window.confirm('Delete all saved reports from this device?'))writeHistory([]);});
for(const b of document.querySelectorAll('.choose-prompt'))b.addEventListener('click',()=>{$('#prompt').value=b.dataset.prompt;setView('analyze');});
for(const id of ['privacy-open','privacy-footer'])$('#'+id).addEventListener('click',()=>$('#privacy').showModal());$('#privacy-close').addEventListener('click',()=>$('#privacy').close());
$('#theme').addEventListener('click',()=>{document.body.classList.toggle('dark');try{localStorage.setItem('nextstep-theme-cyan-v1',document.body.classList.contains('dark')?'dark':'light');}catch{}});
try{document.body.classList.toggle('dark',localStorage.getItem('nextstep-theme-cyan-v1')!=='light');}catch{}
async function status(){try{const res=await fetch('/api/status');if(!res.ok)throw new Error();const data=await res.json();$('#connection').replaceChildren(el('i'),document.createTextNode(data.configured?'Gemini configured · ready to test':'Sample mode · live AI needs a server key'));$('#connection').classList.toggle('ready',data.configured);}catch{$('#connection').replaceChildren(el('i'),document.createTextNode('Server unavailable · sample report works'));}}
updateCounts();updateHistory();status();
