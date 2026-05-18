import { convertSize, getReturnRisk } from '../../../lib/sizeEngine';

export async function POST(request) {
  const body = await request.json();
  const result = convertSize(body.fromBrand, body.toBrand, body.size);
  return Response.json({...result, returnRisk:getReturnRisk(result.confidence)});
}
