import{analyzeSize}from'../../../../lib/data';export async function POST(req){return Response.json(analyzeSize(await req.json()))}
