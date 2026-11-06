import {json,timeoutFetch} from '../lib/common.mjs';
const SERIES=[{id:'432',name:'Selic meta',unit:'% a.a.'},{id:'11',name:'Selic diária',unit:'% a.d.'},{id:'433',name:'IPCA mensal',unit:'%'},{id:'1',name:'Dólar comercial (venda)',unit:'R$/US$'}];
export default async function handler(request){
 if(request.method!=='GET')return json({error:'Método não permitido'},405);
 const records=await Promise.all(SERIES.map(async s=>{
  try{const url=`https://api.bcb.gov.br/dados/serie/bcdata.sgs.${s.id}/dados/ultimos/valores?formato=json`;
    const response=await timeoutFetch(url,{headers:{Accept:'application/json'}});if(!response.ok)throw Error('BCB '+response.status);
    const arr=await response.json();const last=Array.isArray(arr)?arr.at(-1):null;if(!last?.data||!last?.valor)throw Error('Dados não disponíveis');
    return {name:s.name,unit:s.unit,value:Number(String(last.valor).replace(',','.')),date:last.data,source:'Banco Central do Brasil · SGS',url:`https://www.bcb.gov.br/`,stale:false};
  }catch(e){return {name:s.name,unit:s.unit,error:'Indisponível agora',source:'Banco Central do Brasil · SGS'};}
 }));
 return json({items:records,fetchedAt:new Date().toISOString(),notes:['Selic diária e IPCA não são cotações instantâneas.','Os números têm a periodicidade e data oficial divulgadas pelo BCB.']},200,{'cache-control':'public, max-age=300, s-maxage=900'});
}
