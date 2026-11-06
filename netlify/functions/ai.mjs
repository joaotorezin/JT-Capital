import {json,authorized,timeoutFetch} from '../lib/common.mjs';
const LIMIT=1500;
export default async function handler(request){
 if(request.method!=='POST')return json({error:'Método não permitido'},405);
 const auth=await authorized(request);if(auth.error)return json({error:auth.error},auth.status);
 const key=process.env.OPENAI_API_KEY;if(!key)return json({error:'OPENAI_API_KEY ainda não configurada no Netlify.'},503);
 let body;try{body=await request.json()}catch{return json({error:'JSON inválido'},400)}
 const question=String(body.question||'').trim();if(!question||question.length>LIMIT)return json({error:'A pergunta precisa ter entre 1 e 1500 caracteres.'},400);
 const snapshot=body.snapshot&&typeof body.snapshot==='object'?body.snapshot:null;
 const compact=snapshot?JSON.stringify(snapshot).slice(0,3500):'';
 const system='Você é JARVIS Capital 4.0, assistente de inteligência comercial e financeira, em português brasileiro. Distingua dados oficiais, hipóteses e projeções. Não invente números, datas ou notícias. Se a pergunta exigir informações recentes, use pesquisa na web e cite links de fontes reais. FIDC, securitização e antecipação de recebíveis são áreas importantes. Os dados locais enviados são resumos autorizados, nunca autorize alterações financeiras. Caso não haja dados suficientes, diga isso. Responda objetivamente e com clareza.';
 try{
 const payload={model:process.env.OPENAI_MODEL||'gpt-5.4',instructions:system,input:compact?'Resumo numérico local autorizado (não verificado externamente): '+compact+'\n\nPergunta: '+question:question,max_output_tokens:1200,tools:[{type:'web_search',search_context_size:'low'}],store:false};
 const r=await timeoutFetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:'Bearer '+key,'content-type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(45000)});
 const data=await r.json();if(!r.ok)return json({error:'A IA não conseguiu responder ('+r.status+'). Verifique credenciais, modelo, créditos ou limites.'},r.status===429?429:502);
 const message=(data.output||[]).filter(x=>x.type==='message').flatMap(x=>x.content||[]).filter(x=>x.type==='output_text');
 const answer=message.map(x=>x.text||'').join('\n').trim();
 const sources=[];for(const t of message){for(const a of t.annotations||[]){if(a.type==='url_citation'&&a.url&&/^https?:\/\//i.test(a.url)&&!sources.some(s=>s.url===a.url))sources.push({title:a.title||a.url,url:a.url})}}
 return json({answer:answer||'Nenhuma resposta foi produzida.',sources:sources.slice(0,12),model:data.model||payload.model,at:new Date().toISOString()});
 }catch{return json({error:'O serviço de IA não respondeu. Tente novamente mais tarde.'},503)}
}
