const LANGS=['Urdu','English','Arabic','Hindi','French','German','Spanish','Turkish','Persian','Chinese'];
const hits=new Map();
function limited(req){const ip=String(req.headers['x-forwarded-for']||'x').split(',')[0],n=Date.now(),a=(hits.get(ip)||[]).filter(t=>n-t<6e4);a.push(n);hits.set(ip,a);return a.length>20}
async function chat(content,max=4096){
  const key=process.env.GROQ_API_KEY;if(!key)throw new Error('Server is missing GROQ_API_KEY');
  const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},
    body:JSON.stringify({model:process.env.GROQ_MODEL||'meta-llama/llama-4-scout-17b-16e-instruct',messages:[{role:'user',content}],max_tokens:max,temperature:0})});
  const d=await r.json();if(!r.ok)throw new Error((d.error&&d.error.message)||'AI error '+r.status);
  return String((d.choices&&d.choices[0]&&d.choices[0].message.content)||'').trim();
}
module.exports={LANGS,limited,chat};
