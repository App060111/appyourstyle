import data from '../data/brandMappings.json';

export function normalizeBrand(brand) {
  return String(brand || '').toLowerCase().replace('&', '').replace(/\s+/g, '');
}

export function convertSize(fromBrand, toBrand, size) {
  const key = `${normalizeBrand(fromBrand)}:${normalizeBrand(toBrand)}`;
  const mapping = data.mappings[key];

  if (!mapping) {
    return {
      fromBrand,
      toBrand,
      inputSize: size,
      outputSize: size,
      confidence: 0.52,
      note: 'Noch keine geprüfte direkte Markenübersetzung vorhanden. Empfehlung als neutrale Orientierung nutzen.'
    };
  }

  const outputSize = mapping[String(size).toUpperCase()] || mapping[String(size)] || size;
  const note = data.fitNotes[normalizeBrand(toBrand)] || 'Fit ist produkt-, schnitt- und materialabhängig.';

  return {
    fromBrand,
    toBrand,
    inputSize: size,
    outputSize,
    confidence: 0.74,
    note
  };
}

export function getReturnRisk(confidence) {
  if (confidence >= 0.75) return 'niedrig';
  if (confidence >= 0.6) return 'mittel';
  return 'hoch';
}

export function getBrandNote(brand) {
  return data.fitNotes[normalizeBrand(brand)] || 'Fit ist produkt-, schnitt- und materialabhängig.';
}
