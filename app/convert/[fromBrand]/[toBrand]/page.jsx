import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import { convertSize, getReturnRisk, getBrandNote } from '../../../../lib/sizeEngine';
import { faqJsonLd, breadcrumbJsonLd } from '../../../../lib/seo';

export async function generateMetadata({ params }) {
  return {
    title: `${params.fromBrand} Größe in ${params.toBrand} umrechnen | AppYourStyle`,
    description: `Übersetze ${params.fromBrand} Größen in ${params.toBrand} Größen. Sofortige Antwort ohne Login.`
  };
}

export default function ConvertPage({ params }) {
  const from = params.fromBrand;
  const to = params.toBrand;
  const sizes = ['XS','S','M','L','XL','XXL'];
  const example = convertSize(from,to,'M');
  const rows = sizes.map(size => convertSize(from,to,size));

  const faq = faqJsonLd([
    { q:`Welche ${to} Größe passt, wenn ich bei ${from} M trage?`, a:`Bei ${from} M entspricht die grobe ${to} Empfehlung ${example.outputSize}.` },
    { q:`Ist die Empfehlung exakt?`, a:'Die Empfehlung ist eine Größenübersetzung. Exakte Passform hängt von Schnitt, Material und Produkt ab.' },
    { q:`Wie fällt ${to} aus?`, a:getBrandNote(to) }
  ]);

  const breadcrumb = breadcrumbJsonLd([
    { name:'Start', url:'https://appyourstyle.com' },
    { name:'Größenvergleich', url:'https://appyourstyle.com/convert' },
    { name:`${from} zu ${to}`, url:`https://appyourstyle.com/convert/${from}/${to}` }
  ]);

  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faq)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumb)}} />
      <Header />
      <section className="hero">
        <div>
          <span className="badge">Sofortige Größenübersetzung</span>
          <h1>{from} Größe in {to} umrechnen</h1>
          <p>Wenn du bei {from} M trägst, ist deine ungefähre Größe bei {to}: <strong>{example.outputSize}</strong>.</p>
          <p>Fit-Hinweis: {getBrandNote(to)}</p>
        </div>
        <div className="card">
          <h2>Direkte Antwort</h2>
          <div className="result">
            <div>{from} M entspricht ungefähr</div>
            <strong>{to} {example.outputSize}</strong>
            <p>Retourenrisiko: {getReturnRisk(example.confidence)}</p>
          </div>
        </div>
      </section>
      <table className="table">
        <thead><tr><th>{from}</th><th>{to}</th><th>Hinweis</th></tr></thead>
        <tbody>{rows.map(row => <tr key={row.inputSize}><td>{row.inputSize}</td><td>{row.outputSize}</td><td>{row.note}</td></tr>)}</tbody>
      </table>
      <Footer />
    </main>
  );
}
