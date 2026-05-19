export function faqJsonLd(items){
  return {'@context':'https://schema.org','@type':'FAQPage',mainEntity:items.map(item=>({'@type':'Question',name:item.q,acceptedAnswer:{'@type':'Answer',text:item.a}}))}
}
