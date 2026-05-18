import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { convertSize, percent, getBrandProfile } from '../../lib/sizeEngine';
import { faqJsonLd } from '../../lib/seo';

export const metadata = {
  title: 'Nike Größe in Zara umrechnen | Nike M zu Zara L | AppYourStyle',
  description: 'Welche Zara Größe passt, wenn du Nike M trägst? AppYourStyle übersetzt Nike Größen in Zara Größen.'
};

export default function NikeToZara() {
  const sizes = ['XS','S','M','L','XL','XXL'];
  const rows = sizes.map(size => convertSize('Nike', 'Zara', size));
  const example = convertSize('Nike', 'Zara', 'M');
  const nike = getBrandProfile('Nike');
  const zara = getBrandProfile('Zara');

  const faq = faqJsonLd([
    { q:'Welche Zara Größe passt, wenn ich Nike M trage?', a:`Nike M entspricht bei Zara ungefähr ${example.outputSize}.` },
    { q:'Fällt Zara kleiner aus als Nike?', a:'Zara fällt bei vielen Fashion-Fits schmaler oder trendbasierter aus; deshalb kann eine Größe größer sinnvoll sein.' },
    { q:'Ist Nike M immer Zara L?', a:'Nein. Schnitt, Material und Produktkategorie können die Passform verändern.' }
  ]);

  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faq)}} />
      <Header />
      <section className="hero">
        <div>
          <span className="badge">Nike → Zara Size Converter</span>
          <h1>Nike Größe in Zara umrechnen</h1>
          <p><strong>Nike M entspricht ungefähr Zara {example.outputSize}.</strong> Zara fällt häufig schmaler oder modischer aus als Nike.</p>
          <div className="kpi">
            <div><strong>{example.outputSize}</strong><span>Empfohlene Zara Größe bei Nike M</span></div>
            <div><strong>{percent(example.confidence)}</strong><span>Confidence</span></div>
            <div><strong>{example.returnRisk}</strong><span>Retourenrisiko</span></div>
          </div>
        </div>
        <div className="card">
          <h2>Fit-Logik</h2>
          <p>Nike: {nike.fit} — {nike.tendency}</p>
          <p>Zara: {zara.fit} — {zara.tendency}</p>
        </div>
      </section>
      <table className="table">
        <thead><tr><th>Nike</th><th>Zara Empfehlung</th><th>Confidence</th><th>Hinweis</th></tr></thead>
        <tbody>{rows.map(r => <tr key={r.inputSize}><td>{r.inputSize}</td><td>{r.outputSize}</td><td>{percent(r.confidence)}</td><td>{r.note}</td></tr>)}</tbody>
      </table>
      <Footer />
    </main>
  );
}
