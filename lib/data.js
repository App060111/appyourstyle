import brands from '../data/brands.json';
import fitProfiles from '../data/fitProfiles.json';
import sizeMappings from '../data/sizeMappings.json';
import regionMappings from '../data/regionMappings.json';

export { brands, fitProfiles, sizeMappings, regionMappings };

export function normalizeBrand(value){
  return String(value||'').toLowerCase().replace(/[^a-z0-9]/g,'');
}

export function getBrand(id){
  const clean = normalizeBrand(id);
  return brands.find(b => b.id === clean) || null;
}

export function getFitProfile(id){
  const clean = normalizeBrand(id);
  return fitProfiles[clean] || null;
}

export function percent(v){
  return `${Math.round((v || 0) * 100)}%`;
}

export function convertSize({ fromBrand, toBrand, inputSize, category='tops', genderCategory='unisex' }){
  const from = normalizeBrand(fromBrand);
  const to = normalizeBrand(toBrand);
  const size = String(inputSize || 'M').toUpperCase();

  const exact = sizeMappings.find(m =>
    m.fromBrand === from &&
    m.toBrand === to &&
    m.inputSize === size &&
    m.category === category
  );

  const fromB = getBrand(from);
  const toB = getBrand(to);

  if (exact) {
    return {
      ...exact,
      fromBrandName: fromB?.name || fromBrand,
      toBrandName: toB?.name || toBrand,
      confidencePercent: percent(exact.confidenceScore),
      note: `${fromB?.name || fromBrand} ${size} entspricht bei ${toB?.name || toBrand} ungefähr ${exact.outputSize}. Quelle: ${exact.sourceType}.`
    };
  }

  return {
    fromBrand: from,
    toBrand: to,
    fromBrandName: fromB?.name || fromBrand,
    toBrandName: toB?.name || toBrand,
    inputSize: size,
    outputSize: size,
    category,
    genderCategory,
    region: 'INT',
    fitType: toB?.defaultFitType || 'product-dependent',
    sourceType: 'estimated',
    confidenceScore: 0.45,
    confidencePercent: '45%',
    returnRisk: 'high',
    updatedAt: new Date().toISOString().slice(0,10),
    note: 'Für diese Kombination liegt noch keine ausreichend verlässliche Datenbasis vor. Empfehlung nur als neutrale Orientierung nutzen.'
  };
}

export function shoeEU(eu){
  return regionMappings.shoeSizes.find(s => String(s.eu) === String(eu));
}
