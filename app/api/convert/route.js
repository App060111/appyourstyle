import{convertSize}from'../../../lib/data';export async function POST(request){return Response.json(convertSize(await request.json()))}
