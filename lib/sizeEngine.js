import data from '../data/brandMappings.json';

export function normalizeBrand(brand) {
  return String(brand || '').toLowerCase().replace('&', '').replace(/\s+/g, '');
}

export function convertSize(fromBrand, toBrand, size) {
  const key = `${normalizeBrand(fromBrand)}:${normalizeBrand(toBrand)}`;
  const mapping = data.mappings[key];
  const normalizedSize = String(size).toUpperCase();

  if (!mapping || !mapping[normalizedSize]) {
    return {
      fromBrand,
      toBrand,
      inputSize: size,
      outputSize: size,
      confidence: 0.52,
      returnRisk: 'hoch',
      note: 'Noch keine geprüfte direkte Markenübersetzung vorhanden. Empfehlung als neutrale Orientierung nutzen.'
    };
  }

  const result = mapping[normalizedSize];

  return {
    fromBrand,
    toBrand,
    inputSize: size,
    outputSize: result.size,
    confidence: result.confidence,
    returnRisk: result.risk,
    note: result.note
  };
}

export function getBrandProfile(brand) {
  return data.brandFitProfiles[normalizeBrand(brand)] || {
    fit: 'produktabhängig',
    tendency: 'keine geprüfte Tendenz',
    confidence: 0.5
  };
}

export function percent(value) {
  return `${Math.round(value * 100)}%`;
}
