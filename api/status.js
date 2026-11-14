export default function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Use GET.'});}
 return res.status(200).json({configured:Boolean(process.env.GEMINI_API_KEY),model:process.env.GEMINI_MODEL||'gemini-3.5-flash-lite'});
}
