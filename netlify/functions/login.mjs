import {json,timeoutFetch} from '../lib/common.mjs';
export default async function handler(request){if(request.method!=='POST')return json({error:'Método não permitido'},405);
 const root=(process.env.SUPABASE_URL||'').replace(/\/$/,'');const key=process.env.SUPABASE_ANON_KEY;
 if(!root||!key)return json({error:'Supabase Auth não configurado.'},503);
 let v;try{v=await request.json()}catch{return json({error:'Requisição inválida.'},400)}
 const email=String(v.email||'').trim(),password=String(v.password||'');if(email.length>200||password.length>200||!email.includes('@')||!password)return json({error:'Informe e-mail e senha válidos.'},400);
 try{const r=await timeoutFetch(root+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:key,'content-type':'application/json'},body:JSON.stringify({email,password})});
 if(!r.ok)return json({error:'Credenciais inválidas ou login indisponível.'},401);
 const x=await r.json();return json({accessToken:x.access_token,expiresIn:x.expires_in,userEmail:x.user?.email||email});}
 catch{return json({error:'Não foi possível entrar na conta online.'},503)}
}
