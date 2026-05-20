# API Anmeldung

1. OpenAI API
- Website: https://platform.openai.com/
- Zweck: Text, Fit-Erklärung, AI Search, Embeddings
- Env: OPENAI_API_KEY

2. Google AI Studio / Gemini API
- Website: https://aistudio.google.com/app/apikey
- Docs: https://ai.google.dev/gemini-api/docs/api-key
- Zweck: Vision, Screenshot, Produktklassifikation
- Env: GEMINI_API_KEY

3. Pinecone
- Website: https://www.pinecone.io/
- App: https://app.pinecone.io/
- Zweck: Vector Search, ähnliche Marken/Fits
- Env: PINECONE_API_KEY, PINECONE_INDEX

4. Replicate
- Website: https://replicate.com/
- Tokens: https://replicate.com/account/api-tokens
- Zweck: Outfitbild-Generierung
- Env: REPLICATE_API_TOKEN

Entscheidung:
- OpenAI statt nur GPT-4o/GPT-5 Diskussion: Modell per OPENAI_TEXT_MODEL austauschbar.
- Gemini Flash zuerst: günstiger/schneller für Vision.
- Pinecone statt Weaviate: managed, weniger DevOps.
- Replicate statt eigener GPU: schneller Start, keine Infrastrukturkosten.
