export const json=(obj,status=200,extra={})=>new Response(JSON.stringify(obj),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','access-control-allow-origin':'same-origin',...extra}});
export const timeoutFetch=(url,opts={})=>fetch(url,{...opts,signal:AbortSignal.timeout(11000)});
export async function authorized(request){
 const token=(request.headers.get('authorization')||'').replace(/^Bearer\s+/i,'');
 const root=(process.env.SUPABASE_URL||'').replace(/\/$/,'');const anon=process.env.SUPABASE_ANON_KEY||'';
 if(!root||!anon)return {error:'Autenticação online não configurada no Netlify.',status:503};
 if(!token)return {error:'Entre na conta online para acessar a IA.',status:401};
 try {const r=await timeoutFetch(root+'/auth/v1/user',{headers:{Authorization:'Bearer '+token,apikey:anon}});
  if(!r.ok)return {error:'Sessão online expirada ou inválida.',status:401};
  const u=await r.json();if(!u?.id)return {error:'Usuário não identificado.',status:401};
  return {user:u};
 }catch{return {error:'Não foi possível validar o acesso online.',status:503}}
}
export const safeUrl=(url)=>{try{const u=new URL(url);return ['https:','http:'].includes(u.protocol)?u.href:null}catch{return null}};
