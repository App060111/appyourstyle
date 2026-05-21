import{analyzeOutfit}from'../../../../lib/data';export async function POST(req){const body=await req.json();return Response.json(analyzeOutfit(body.links||[]))}
