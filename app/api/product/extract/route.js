import{extractProductPage}from'../../../../lib/product/extract';export async function POST(req){const body=await req.json();return Response.json(await extractProductPage(body.url))}
