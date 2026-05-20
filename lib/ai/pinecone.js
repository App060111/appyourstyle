export async function pineconeSearch({vector, topK=5}){
  if(!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX || !vector?.length) return {mode:'mock', matches:[]};
  const {Pinecone} = await import('@pinecone-database/pinecone');
  const pc = new Pinecone({apiKey:process.env.PINECONE_API_KEY});
  const index = pc.index(process.env.PINECONE_INDEX);
  const res = await index.query({vector, topK, includeMetadata:true});
  return {mode:'real', matches:res.matches||[]};
}
