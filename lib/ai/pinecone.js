export async function semanticSearch({query}){if(!process.env.PINECONE_API_KEY)return{mode:'mock',matches:[]};return{mode:'ready',matches:[]}}
