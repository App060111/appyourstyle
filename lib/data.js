import brands from '../data/brands.json';
import sizeMappings from '../data/sizeMappings.json';
import fitDNA from '../data/fitDNA.json';
import {validateExternalUrl} from './security';

export {brands,sizeMappings,fitDNA};
export function normalizeBrand(v){return String(v||'').toLowerCase().replace(/[^a-z0-9]/g,'')}
export function findBrand(q){const n=normalizeBrand(q);return brands.find(b=>b.id===n||normalizeBrand(b.name)===n||(b.aliases||[]).some(a=>normalizeBrand(a)===n))||null}
export function searchBrands(q){const n=normalizeBrand(q);if(!n)return brands;return brands.filter(b=>b.id.includes(n)||normalizeBrand(b.name).includes(n)||(b.aliases||[]).some(a=>normalizeBrand(a).includes(n)))}
export function percent(v){return `${Math.round((v||0)*100)}%`}
export function convertSize({fromBrand,toBrand,inputSize='M',category='tops'}){
 const f=findBrand(fromBrand)||brands[0]; const t=findBrand(toBrand)||brands[2]; const s=String(inputSize).toUpperCase();
 const m=sizeMappings.find(x=>x.fromBrand===f.id&&x.toBrand===t.id&&x.inputSize===s&&x.category===category)||sizeMappings.find(x=>x.fromBrand===f.id&&x.toBrand===t.id&&x.inputSize===s);
 if(m)return {...m,fromBrandName:f.name,toBrandName:t.name,confidencePercent:percent(m.confidenceScore),note:`${f.name} ${s} entspricht bei ${t.name} ungefähr ${m.outputSize}.`,dna:fitDNA[t.id]};
 return {fromBrandName:f.name,toBrandName:t.name,inputSize:s,outputSize:s,confidenceScore:.42,confidencePercent:'42%',sourceType:'estimated',returnRisk:'high',fitType:t.fit,alternativeSizes:['S','L'],dna:fitDNA[t.id],note:'Grobe Orientierung.'}
}
export function extractProductFromUrl(raw,index=1){
 const v=validateExternalUrl(raw);
 if(!v.ok)return {index,valid:false,url:String(raw||''),error:v.reason};
 const lower=v.url.toLowerCase();
 const brand=brands.find(b=>lower.includes(b.id)||(b.aliases||[]).some(a=>lower.includes(a.replaceAll(' ',''))))||null;
 const category=lower.includes('shoe')||lower.includes('sneaker')||lower.includes('schuh')?'shoes':lower.includes('pants')||lower.includes('jeans')||lower.includes('hose')?'pants':lower.includes('jacket')||lower.includes('jacke')?'outerwear':lower.includes('shirt')||lower.includes('hoodie')||lower.includes('top')?'tops':'product';
 const marketplace=['temu','aliexpress','alibaba','shein','taobao','dhgate'].some(x=>v.domain.includes(x));
 return {index,valid:true,url:v.url,domain:v.domain,brandId:brand?.id||'',brandName:brand?.name||'vom Nutzer bestätigen',category,title:`Produkt ${index} von ${v.domain}`,imageUrl:null,size:'bestätigen',color:'bestätigen',confidenceScore:brand?brand.baseConfidence:(marketplace?.38:.46),confidencePercent:percent(brand?brand.baseConfidence:(marketplace?.38:.46)),risk:marketplace?'high':brand?.risk||'medium',fitHint:brand?.fit||'Produktdaten bestätigen',marketplace};
}
export function analyzeOutfit(products,userSize='M'){
 const valid=products.filter(p=>p.valid); const avg=valid.length?valid.reduce((a,p)=>a+(p.confidenceScore||0),0)/valid.length:0; const high=valid.filter(p=>p.risk==='high').length;
 const score=Math.max(.25,Math.min(.86,avg-high*.05));
 return {itemCount:valid.length,outfitConfidenceScore:score,outfitConfidencePercent:percent(score),returnRisk:high?'high':score>.68?'low':'medium',recommendation:high?'Marketplace- oder Datenrisiko vorhanden. CM-Maße prüfen.':'Outfit wirkt grundsätzlich kompatibel. Fit-Hinweise prüfen.',userSize};
}
