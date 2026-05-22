export function composeOutfit(user, items, fitAnalysis, styleResult) {
  return {
    outfit_id: `AYS-${Date.now()}`,
    user_profile: user,
    items,
    fit_analysis: fitAnalysis,
    style_result: styleResult,
    layering_logic: 'Topwear, bottoms and footwear are aligned by silhouette, material weight and body proportions.',
    composition_notes: [
      'Keep product identity recognizable.',
      'Normalize lighting and perspective across item images.',
      'Use body measurements and selected fit preference before rendering.'
    ]
  };
}
