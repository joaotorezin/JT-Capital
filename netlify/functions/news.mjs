import {json,timeoutFetch,safeUrl} from '../lib/common.mjs';
const TOPICS={fidc:'FIDC securitização crédito recebíveis Brasil',economia:'economia Brasil Copom Selic inflação crédito',industria:'indústria Brasil crédito empresas',mercado:'mercado financeiro Brasil B3 investimentos'};
function decode(t){return String(t||'').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim()}
function pick(x,t){return (x.match(new RegExp('<'+t+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/'+t+'>','i'))||[])[1]||''}
export default async function handler(request){
 if(request.method!=='GET')return json({error:'Método não permitido'},405);
 const topic=new URL(request.url).searchParams.get('topic')||'fidc';if(!Object.hasOwn(TOPICS,topic))return json({error:'Tema inválido'},400);
 try{
  const query=encodeURIComponent(TOPICS[topic]+' when:7d');const rss=`https://news.google.com/rss/search?q=${query}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
  const r=await timeoutFetch(rss,{headers:{'user-agent':'JTCapitalNewsReader/4.0 (+RSS)'}});if(!r.ok)throw Error('Serviço indisponível ('+r.status+')');
  const xml=await r.text();const blocks=[...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].slice(0,16);
  const items=blocks.map((m,i)=>{const x=m[1],title=decode(pick(x,'title')),url=safeUrl(decode(pick(x,'link'))),pub=decode(pick(x,'pubDate'));
   const source=decode(pick(x,'source'))||'Google Notícias';const enc=x.match(/<media:thumbnail[^>]*url=["']([^"']+)/i)||x.match(/<media:content[^>]*url=["']([^"']+)/i);
   const image=enc?safeUrl(decode(enc[1])):null;
   return {id:i,title,source,url,image,date:pub&&Number.isFinite(Date.parse(pub))?new Date(pub).toISOString():null,summary:'Leia a notícia na fonte original para conferir detalhes.'};
  }).filter(x=>x.title&&x.url);
  return json({items,topic,fetchedAt:new Date().toISOString(),source:'RSS público do Google Notícias; links para matérias externas',status:items.length?'ok':'empty'},200,{'cache-control':'public, max-age=180, s-maxage=600'});
 }catch(e){return json({items:[],status:'error',error:'Não foi possível consultar as notícias neste momento.'},503)}
}
