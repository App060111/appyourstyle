export async function imagePreview({prompt}){if(!process.env.REPLICATE_API_TOKEN)return{mode:'mock',label:'AI Image Mock',prompt};return{mode:'ready',label:'Replicate bereit',prompt}}
