import{convertSize}from'../../../lib/data';export async function POST(req){return Response.json(convertSize(await req.json()))}
