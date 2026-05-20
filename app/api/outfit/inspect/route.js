import{inspectOutfitLinks}from'../../../../lib/data';export async function POST(req){const body=await req.json();return Response.json({items:inspectOutfitLinks(body.links||[])})}
