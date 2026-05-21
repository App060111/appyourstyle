import brands from '../data/brands.json';
import categories from '../data/categories.json';
export { brands, categories };

export function norm(v){ return String(v||'').toLowerCase().replace(/[^a-z0-9äöüß]/g,'') }
export function findBrand(q){
 const n=norm(q);
 return brands.find(b=>b.id===n || norm(b.name)===n || (b.aliases||[]).some(a=>norm(a)===n)) || null;
}
export function searchBrands(q){
 const n=norm(q);
 if(!n) return brands;
 return brands.filter(b=>b.id.includes(n)||norm(b.name).includes(n)||(b.aliases||[]).some(a=>norm(a).includes(n))||norm(b.segment).includes(n)).slice(0,20);
}
export function allBrandsForCategory(cat){
 return brands.filter(b => !cat || (b.cats||[]).includes(cat) || true);
}
export function defaultSize(cat){
 const c=categories[cat]||categories.oberteile;
 if(cat==='jeans') return 'W32 / L32';
 if(cat==='unterwäsche') return 'EU 75 C';
 return (c.sizes||['M'])[3] || (c.sizes||['M'])[0];
}
export function analyzeSize(input){
 const from=findBrand(input.fromBrand)||brands[0];
 const to=findBrand(input.toBrand)||brands[2];
 const cat=input.category||'oberteile';
 const c=categories[cat]||categories.oberteile;
 let rec=input.size||defaultSize(cat);
 let alt='zweite Größe mitbestellen, wenn unsicher';
 if(cat==='schuhe'){rec=input.shoeSize||'EU 42'; alt='bei Running und breiten Füßen Weite prüfen';}
 if(cat==='jeans'){rec=`${input.waist||'W32'} / ${input.length||'L32'}`; alt='W31/W33 oder andere Länge prüfen';}
 if(cat==='unterwäsche'){rec=`${input.band||'EU 75'} ${input.cup||'C'}`; alt='Band und Cup separat prüfen';}
 const base=(from.confidence+to.confidence)/2;
 const penalty=(from.risk==='hoch'||to.risk==='hoch')?18:(from.risk==='mittel'||to.risk==='mittel')?8:0;
 const catBonus=cat==='schuhe'||cat==='oberteile'?4:0;
 const confidence=Math.max(28,Math.min(92,Math.round(base-penalty+catBonus)));
 const risk=confidence<55?'hoch':confidence<72?'mittel':'niedrig';
 const similar=brands.filter(b=>b.id!==to.id && (b.segment===to.segment || (b.cats||[]).includes(cat))).slice(0,5).map(b=>b.name);
 return {
  category:cat, categoryLabel:c.label, fromBrandName:from.name, toBrandName:to.name,
  recommended:rec, alternative:alt, confidence, confidenceText:`${confidence}%`,
  risk, sourceType: from.sourceType==='public'&&to.sourceType==='public'?'öffentliche Daten + Analyse':'geschätzte Logik + Analyse',
  explanation:`${to.name} wirkt in dieser Kategorie eher: ${to.fit}. ${cat==='schuhe'?'Bei Schuhen sind Größensystem und Weite entscheidend.':''}`,
  similar, materialNote: input.material==='Leder'||input.material==='Denim'?'Material kann enger oder weniger flexibel wirken.':'Normales Materialrisiko.',
  why:['Herstellerprofil','Kategorie-Logik','Passform','Risiko','Datenqualität']
 }
}
export function analyzeOutfit(links){
 const clean=(links||[]).filter(Boolean);
 const marketplace=clean.filter(l=>/temu|aliexpress|shein|alibaba|taobao/i.test(l)).length;
 const risk=marketplace?'hoch':clean.length?'mittel':'keine Daten';
 return {
  count:clean.length, risk,
  confidence: clean.length? Math.max(38, 78-marketplace*18):0,
  items: clean.map((url,i)=>({index:i+1,url,role:['Hose','Oberteil','Schuhe','Jacke','Accessoire'][i]||'Produkt',risk:/temu|aliexpress|shein/i.test(url)?'hoch':'mittel'})),
  summary: clean.length ? `${clean.length} Produktlinks erkannt. Rollen, Risiko und Kompatibilität wurden vorbereitet.` : 'Bitte mindestens einen Produktlink einfügen.'
 }
}
export function parseQuestion(q){
 const t=String(q||'').toLowerCase();
 const cat=t.includes('schuh')||t.includes('sneaker')?'schuhe':t.includes('jeans')||t.includes('hose')?'jeans':t.includes('bh')?'unterwäsche':'oberteile';
 const found=brands.filter(b=>t.includes(b.id)||t.includes(b.name.toLowerCase())||(b.aliases||[]).some(a=>t.includes(a.toLowerCase()))).map(b=>b.name);
 return {category:cat, brandsFound:found, intent:t.includes('größer')||t.includes('kleiner')?'Passform-Vergleich':t.includes('risiko')?'Risiko':'Größenfrage'};
}
