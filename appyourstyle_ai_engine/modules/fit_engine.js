export function runFitEngine(user, items) {
  return items.map((item) => {
    const fit = (item.fit || '').toLowerCase();
    let confidence = 82;
    let expectedFit = 'regular fit';
    let recommendedSize = item.size_selected || 'unknown';

    if (fit.includes('oversized')) {
      expectedFit = 'intentionally oversized with relaxed drape';
      confidence = 90;
    }
    if (fit.includes('slim')) {
      expectedFit = 'close to body with possible tension zones';
      confidence = 86;
    }
    if (item.material && item.material.toLowerCase().includes('stretch')) {
      confidence += 4;
    }

    return {
      type: item.type,
      brand: item.brand,
      store: item.store,
      selected_size: item.size_selected,
      recommended_size: recommendedSize,
      expected_fit: expectedFit,
      confidence: Math.min(confidence, 96),
      notes: [
        'Use official brand size chart when available.',
        'Compare selected size against body data and preferred fit.',
        'Downgrade confidence if garment measurements are missing.'
      ]
    };
  });
}
