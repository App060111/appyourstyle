export function validateExternalUrl(raw){
 try{
  const u=new URL(String(raw||'').trim());
  if(u.protocol!=='https:') return {ok:false,reason:'Nur HTTPS erlaubt'};
  const h=u.hostname.toLowerCase();
  if(['localhost','127.0.0.1','0.0.0.0'].includes(h)||h.startsWith('10.')||h.startsWith('192.168.')||h.startsWith('172.16.')) return {ok:false,reason:'Interne URL blockiert'};
  return {ok:true,url:u.toString(),domain:h.replace('www.','')};
 }catch(e){return {ok:false,reason:'Ungültige URL'}}
}
