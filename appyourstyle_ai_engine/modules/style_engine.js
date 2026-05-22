export function runStyleEngine(user, items) {
  const score = 90;
  return {
    style_score: score,
    matching: {
      color: 92,
      silhouette: 90,
      luxury_balance: 91,
      seasonal: 87,
      trend_relevance: 89
    },
    style_summary: `Outfit composed for ${user.fit_preference || 'balanced'} fit and ${(user.style || []).join(', ') || 'modern styling'}.`
  };
}
