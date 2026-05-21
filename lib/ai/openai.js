export async function aiAnswer({question,context}){
 if(!process.env.OPENAI_API_KEY) return {mode:'mock',answer:'AI-ready: echte Antwort wird nach OPENAI_API_KEY aktiviert.',confidence:42};
 const OpenAI=(await import('openai')).default;
 const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
 const res=await client.chat.completions.create({model:process.env.OPENAI_TEXT_MODEL||'gpt-4o-mini',temperature:.2,messages:[
  {role:'system',content:'Du bist AppYourStyle. Antworte kurz, deutsch, nutzerfreundlich, mit Unsicherheit und Risiko.'},
  {role:'user',content:`Frage: ${question}\nKontext: ${JSON.stringify(context||{})}`}
 ]});
 return {mode:'real',answer:res.choices[0]?.message?.content||'',confidence:74};
}
