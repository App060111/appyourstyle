import brands from '../data/brands.json';
import categories from '../data/categories.json';
import { validateExternalUrl } from './security';
export { brands, categories };

export function norm(v){ return String(v||'').toLowerCase().replace(/[^a-z0-9äöüß]/g,'') }
export function findBrand(q){ const n=norm(q); return brands.find(b=>b.id===n||norm(b.name)===n||(b.aliases||[]).some(a=>norm(a)===n))||null }
export function searchBrands(q){ const n=norm(q); if(!n)return brands; return brands.filter(b=>b.id.includes(n)||norm(b.name).includes(n)||(b.aliases||[]).some(a=>norm(a).includes(n))||norm(b.segment).includes(n)).slice(0,24) }
export function defaultSize(cat){ const c=categories[cat]||categories.oberteile; if(cat==='jeans')return 'W32 / L32'; if(cat==='unterwäsche')return 'EU 75 C'; return (c.sizes||['M'])[3]||(c.sizes||['M'])[0] }

function actionRecommendation({cat, from, to, risk, confidence, input}){
 if(risk==='hoch') return 'Nicht blind kaufen: Produktmaße, Bewertungen und Rückgabe prüfen.';
 if(cat==='schuhe'){
  if(input.width==='breit'||input.width==='extra breit') return 'Empfehlung: Größe beibehalten, aber Wide/Weite prüfen.';
  if(input.use==='Running') return 'Empfehlung: Größe beibehalten, bei Running etwas Zehenfreiheit einplanen.';
  return 'Empfehlung: Größe beibehalten, Passformhinweis beachten.';
 }
 if(cat==='jeans') return 'Empfehlung: Bundweite und Länge getrennt prüfen, nicht nur Buchstabengröße vergleichen.';
 if(cat==='oberteile'||cat==='jacken'){
  if(input.fit==='oversized') return 'Empfehlung: Nicht automatisch größer kaufen — Oversized ist bereits eingerechnet.';
  if(to.fit.includes('schmal')) return 'Empfehlung: Bei enger Passform eine Größe größer prüfen.';
  return 'Empfehlung: Ausgangsgröße beibehalten und Schnitt beachten.';
 }
 if(cat==='luxus') return 'Empfehlung: Designergrößen vorsichtig prüfen, IT/FR/EU-System beachten.';
 if(cat==='unterwäsche') return 'Empfehlung: Band und Cup separat vergleichen.';
 if(cat==='kinder') return 'Empfehlung: Körpergröße in CM höher gewichten als Alter.';
 return 'Empfehlung: Größe mit Passformhinweis prüfen.';
}

export function analyzeSize(input){
 const from=findBrand(input.fromBrand)||brands[0], to=findBrand(input.toBrand)||brands[2];
 const cat=input.category||'oberteile', c=categories[cat]||categories.oberteile;
 let rec=input.size||defaultSize(cat);
 if(cat==='schuhe')rec=input.shoeSize||'EU 42';
 if(cat==='jeans')rec=`${input.waist||'W32'} / ${input.length||'L32'}`;
 if(cat==='unterwäsche')rec=`${input.band||'EU 75'} ${input.cup||'C'}`;
 const base=(from.confidence+to.confidence)/2;
 const penalty=(from.risk==='hoch'||to.risk==='hoch')?18:(from.risk==='mittel'||to.risk==='mittel')?8:0;
 const catBonus=(cat==='schuhe'||cat==='oberteile')?4:0;
 const confidence=Math.max(28,Math.min(92,Math.round(base-penalty+catBonus)));
 const risk=confidence<55?'hoch':confidence<72?'mittel':'niedrig';
 const action=actionRecommendation({cat,from,to,risk,confidence,input});
 const similar=brands.filter(b=>b.id!==to.id&&(b.segment===to.segment||(b.cats||[]).includes(cat))).slice(0,5).map(b=>b.name);
 return {
  category:cat,categoryLabel:c.label,fromBrandName:from.name,toBrandName:to.name,
  recommended:rec,confidence,confidenceText:`${confidence}%`,risk,
  action,
  decisionTitle: risk==='hoch'?'Mit Vorsicht kaufen': confidence>78?'Gute Passform-Chance':'Zusatzprüfung empfohlen',
  sourceType: from.risk==='hoch'||to.risk==='hoch'?'Marketplace-/Schätzlogik + Analyse':'öffentliche Daten + Analyse',
  fitFeeling:`${to.name} wirkt hier eher: ${to.fit}.`,
  why:`${from.name} → ${to.name}: ${to.recommendation}`,
  nextStep: risk==='hoch'?'Maßtabelle, Bewertungen und Rückgabe prüfen.':'Empfehlung anwenden und Schnitt/Weite beachten.',
  similar
 }
}

export function extractProductFromUrl(raw,index){
 const v=validateExternalUrl(raw);
 if(!v.ok) return {index,valid:false,url:raw,error:v.reason};
 const low=v.url.toLowerCase();
 const brand=brands.find(b=>low.includes(b.id)||(b.aliases||[]).some(a=>low.includes(a.replaceAll(' ',''))))||null;
 const role=['Hose','Oberteil','Schuhe','Jacke'][index-1]||'Produkt';
 const cat=low.includes('shoe')||low.includes('sneaker')||low.includes('schuh')?'schuhe':low.includes('jeans')||low.includes('hose')||low.includes('pants')?'jeans':low.includes('jacket')||low.includes('jacke')?'jacken':'oberteile';
 const marketplace=/temu|aliexpress|shein|alibaba|taobao|dhgate/i.test(v.domain);
 return {index,valid:true,url:v.url,domain:v.domain,role,category:cat,brandName:brand?.name||'Marke bestätigen',risk:marketplace?'hoch':brand?.risk||'mittel',confidence:brand?.confidence||(marketplace?38:55),note:brand?.recommendation||'Produktdaten prüfen'};
}

export function analyzeOutfit(links){
 const products=(links||[]).slice(0,4).map((l,i)=>extractProductFromUrl(l,i+1)).filter(p=>p.url||p.error);
 const valid=products.filter(p=>p.valid);
 const high=valid.filter(p=>p.risk==='hoch').length;
 const avg=valid.length?Math.round(valid.reduce((a,p)=>a+(p.confidence||0),0)/valid.length):0;
 const score=Math.max(20,Math.min(92,avg-high*12));
 const risk=high?'hoch':score>74?'niedrig':'mittel';
 const harmony=valid.length>=3?'Outfit kann als Gesamtlook bewertet werden.':'Für bessere Outfit-Harmonie mindestens 3 Links einfügen.';
 const outfitId=Buffer.from(JSON.stringify(valid.map(p=>p.url))).toString('base64url').slice(0,60);
 const smartLink=`/outfit-hold?id=${outfitId}`;
 return {
  count:valid.length, risk, confidence:score, smartLink,
  summary: valid.length?`${valid.length} Produktlinks erkannt. AppYourStyle bündelt Rollen, Risiko, Passform und Originalshops in einem Smart-Outfit-Link.`:'Bitte mindestens einen Produktlink einfügen.',
  recommendation: risk==='hoch'?'Nicht als Gesamtoutfit blind kaufen: Marketplace-/Produktmaß-Risiko prüfen.':'Outfit ist grundsätzlich nutzbar. Einzelgrößen und Passformhinweise beachten.',
  harmony, products:valid
 }
}

export function parseQuestion(q){
 const t=String(q||'').toLowerCase();
 const cat=t.includes('schuh')||t.includes('sneaker')?'schuhe':t.includes('jeans')||t.includes('hose')?'jeans':t.includes('bh')?'unterwäsche':'oberteile';
 const found=brands.filter(b=>t.includes(b.id)||t.includes(b.name.toLowerCase())||(b.aliases||[]).some(a=>t.includes(a.toLowerCase()))).map(b=>b.name);
 return {category:cat,brandsFound:found,intent:t.includes('größer')||t.includes('kleiner')?'Passform-Vergleich':t.includes('risiko')?'Risiko':'Größenfrage'};
}
