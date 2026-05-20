export async function replicateOutfitImage({prompt}){
  if(!process.env.REPLICATE_API_TOKEN) return {mode:'mock', provider:'Replicate', imageUrl:null, label:'Mock Preview: Replicate API Token fehlt', prompt};
  const Replicate = (await import('replicate')).default;
  const replicate = new Replicate({auth:process.env.REPLICATE_API_TOKEN});
  const model = process.env.REPLICATE_IMAGE_MODEL || 'black-forest-labs/flux-schnell';
  const output = await replicate.run(model, {input:{prompt, go_fast:true, num_outputs:1, aspect_ratio:'3:4', output_format:'webp'}});
  return {mode:'real', provider:'Replicate', imageUrl:Array.isArray(output)?output[0]:output, label:'KI-generiert', prompt};
}
