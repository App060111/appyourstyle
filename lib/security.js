export function validateExternalUrl(raw){
  try{
    const url = new URL(String(raw||'').trim());
    if(url.protocol !== 'https:') return {ok:false, reason:'Nur HTTPS erlaubt'};
    const host = url.hostname.toLowerCase();
    const blocked = ['localhost','127.0.0.1','0.0.0.0'];
    if(blocked.includes(host) || host.startsWith('10.') || host.startsWith('192.168.') || host.startsWith('172.16.')){
      return {ok:false, reason:'Private/interne URL blockiert'};
    }
    return {ok:true, url:url.toString(), domain:host.replace('www.','')};
  }catch(e){return {ok:false, reason:'Ungültige URL'}}
}
