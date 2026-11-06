import {json} from '../lib/common.mjs';
export default async function handler(request){if(request.method!=='GET')return json({error:'Método não permitido'},405);
return json({authConfigured:Boolean(process.env.SUPABASE_URL&&process.env.SUPABASE_ANON_KEY),aiConfigured:Boolean(process.env.OPENAI_API_KEY),supabaseUrl:process.env.SUPABASE_URL||'',supabaseAnonKey:process.env.SUPABASE_ANON_KEY||'',note:'Chave anon é pública; nunca disponibilize service_role.'});}
