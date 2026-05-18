import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { convertSize, percent, getBrandProfile } from '../../lib/sizeEngine';
import { faqJsonLd } from '../../lib/seo';

export const metadata = {
  title: 'Adidas vs H&M Fit Vergleich | AppYourStyle',
  description: 'Wie unterscheiden sich Adidas und H&M Größen? Fit-Vergleich, Tabellen und Retourenrisiko.'
};

export default function AdidasVsHM() {
  const sizes = ['XS','S','M','L','XL'];
  const rows = sizes.map(size => convertSize('Adidas', 'H&M', size));
  const example = convertSize('Adidas', 'H&M', 'M');
  const adidas = getBrandProfile('Adidas');
  const hm = getBrandProfile('H&M');

  const faq = faqJsonLd([
    { q:'Ist Adidas M gleich H&M M?', a:'Häufig ja, aber H&M ist stärker kollektionsabhängig. Bei Slim-Fit kann eine Größe größer sinnvoll sein.' },
    { q:'Fällt Adidas größer aus als H&M?', a:'Adidas wirkt bei sportlichen Regular-Fits oft etwas lockerer als H&M.' }
  ]);

  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faq)}} />
      <Header />
      <section className="hero">
        <div>
          <span className="badge">Adidas vs H&M Fit</span>
          <h1>Adidas vs H&M Größen & Fit</h1>
          <p><strong>Adidas M entspricht meist H&M {example.outputSize}.</strong> H&M ist jedoch stärker abhängig von Kollektion, Schnitt und Material.</p>
          <div className="kpi">
            <div><strong>{example.outputSize}</strong><span>H&M Empfehlung bei Adidas M</span></div>
            <div><strong>{percent(example.confidence)}</strong><span>Confidence</span></div>
            <div><strong>{example.returnRisk}</strong><span>Retourenrisiko</span></div>
          </div>
        </div>
        <div className="card">
          <h2>Fit-Profile</h2>
          <p>Adidas: {adidas.fit} — {adidas.tendency}</p>
          <p>H&M: {hm.fit} — {hm.tendency}</p>
        </div>
      </section>
      <table className="table">
        <thead><tr><th>Adidas</th><th>H&M Empfehlung</th><th>Confidence</th><th>Hinweis</th></tr></thead>
        <tbody>{rows.map(r => <tr key={r.inputSize}><td>{r.inputSize}</td><td>{r.outputSize}</td><td>{percent(r.confidence)}</td><td>{r.note}</td></tr>)}</tbody>
      </table>
      <Footer />
    </main>
  );
}
