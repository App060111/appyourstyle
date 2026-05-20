export async function geminiVisionAnalyze({imageBase64, prompt}){
  if(!process.env.GEMINI_API_KEY) return {mode:'mock', provider:'Gemini', result:{category:'unknown', brand:'unknown', fit:'unknown', note:'API Key fehlt. Vision Parsing vorbereitet.'}};
  const {GoogleGenerativeAI} = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({model:process.env.GEMINI_VISION_MODEL||'gemini-1.5-flash'});
  const parts = [{text: prompt || 'Analyze this fashion product image for brand, category, fit, size clues.'}];
  if(imageBase64) parts.push({inlineData:{mimeType:'image/jpeg', data:imageBase64}});
  const res = await model.generateContent(parts);
  return {mode:'real', provider:'Gemini', result:res.response.text()};
}
