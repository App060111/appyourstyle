export async function openAIAnswer({question, context}){
  if(!process.env.OPENAI_API_KEY) return {mode:'mock', provider:'OpenAI', answer:'Mock: API Key fehlt. Fit-Erklärung vorbereitet.', confidence:.42};
  const OpenAI = (await import('openai')).default;
  const client = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
  const res = await client.chat.completions.create({
    model: process.env.OPENAI_TEXT_MODEL || 'gpt-4o',
    messages: [
      {role:'system', content:'Du bist AppYourStyle. Antworte kurz, mit Confidence, Quelle und Risiko. Keine absoluten Größenversprechen.'},
      {role:'user', content:`Frage: ${question}\nKontext: ${JSON.stringify(context||{})}`}
    ],
    temperature:.2
  });
  return {mode:'real', provider:'OpenAI', answer:res.choices[0]?.message?.content||'', confidence:.72};
}
export async function createEmbedding(text){
  if(!process.env.OPENAI_API_KEY) return {mode:'mock', vector:[]};
  const OpenAI = (await import('openai')).default;
  const client = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
  const res = await client.embeddings.create({model:process.env.OPENAI_EMBEDDING_MODEL||'text-embedding-3-small', input:text});
  return {mode:'real', vector:res.data[0].embedding};
}
