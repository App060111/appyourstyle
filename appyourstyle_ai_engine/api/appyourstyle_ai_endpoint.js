import { runFitEngine } from '../modules/fit_engine.js';
import { runStyleEngine } from '../modules/style_engine.js';
import { composeOutfit } from '../modules/outfit_composer.js';
import { buildRenderPrompt } from '../modules/render_engine.js';

export async function appYourStyleAIHandler(req, res) {
  try {
    const { user, items } = req.body;

    if (!user || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Missing user or items array.' });
    }

    const fitAnalysis = runFitEngine(user, items);
    const styleResult = runStyleEngine(user, items);
    const composition = composeOutfit(user, items, fitAnalysis, styleResult);
    const renderPrompt = buildRenderPrompt(composition);

    return res.status(200).json({
      render_prompt: renderPrompt,
      fit_analysis: fitAnalysis,
      style_result: styleResult,
      composition,
      final_output_contract: [
        'Final rendered outfit visualization',
        'Fit prediction',
        'Size recommendations',
        'Style compatibility score',
        'Product summary',
        'Unified shopping links',
        'Alternative suggestions',
        'Confidence score'
      ]
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
