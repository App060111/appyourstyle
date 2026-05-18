import { convertSize } from '../../../lib/data';

export async function POST(request){
  const body = await request.json();
  return Response.json(convertSize(body));
}
