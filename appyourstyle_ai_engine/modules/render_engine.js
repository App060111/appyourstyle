export function buildRenderPrompt(composition) {
  const itemText = composition.items
    .map((item) => `${item.brand || 'unknown brand'} ${item.type || 'item'} from ${item.store || 'unknown store'}`)
    .join(', ');

  return `Create a photorealistic premium editorial fashion image of one person wearing: ${itemText}. Preserve garment design, fabric texture, proportions, realistic layering, shadows, folds and natural body fit. Avoid distorted anatomy, floating garments, broken overlaps and mismatched lighting. The result must look like a high-end ecommerce campaign and realistic virtual try-on.`;
}
