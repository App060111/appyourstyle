export async function visionAnalyze(){if(!process.env.GEMINI_API_KEY)return{mode:'mock',result:'Gemini Vision vorbereitet'};return{mode:'ready',result:'Gemini Vision Route aktivierbar'}}
