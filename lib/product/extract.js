import * as cheerio from 'cheerio';
import {validateExternalUrl} from '../security';

export async function extractProductPage(raw){
  const v = validateExternalUrl(raw);
  if(!v.ok) return {valid:false,error:v.reason,url:raw};
  try{
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), 6000);
    const res = await fetch(v.url,{headers:{'user-agent':'AppYourStyleBot/0.1'}, signal:controller.signal});
    clearTimeout(timeout);
    const html = await res.text();
    const $ = cheerio.load(html);
    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
    const image = $('meta[property="og:image"]').attr('content') || '';
    const desc = $('meta[property="og:description"]').attr('content') || '';
    const jsonld = [];
    $('script[type="application/ld+json"]').each((_,el)=>{try{jsonld.push(JSON.parse($(el).text()))}catch(e){}});
    return {valid:true,url:v.url,domain:v.domain,title,image,description:desc,jsonld,source:'opengraph/jsonld'};
  }catch(e){return {valid:false,url:v.url,domain:v.domain,error:'Extraction failed or blocked by shop',source:'fallback'}}
}
