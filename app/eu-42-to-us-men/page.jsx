import Header from '../../components/Header';
import Footer from '../../components/Footer';
import shoeSizes from '../../data/shoeSizes.json';
import { faqJsonLd } from '../../lib/seo';

export const metadata = {
  title: 'EU 42 in US Herren umrechnen | AppYourStyle',
  description: 'EU Schuhgröße 42 entspricht ungefähr US Men 9, UK 8.5 und 27 cm.'
};

export default function EU42ToUSMen() {
  const row = shoeSizes.find(s => s.eu === 42);
  const faq = faqJsonLd([
    { q:'Welche US Herren Größe ist EU 42?', a:`EU 42 entspricht ungefähr US Men ${row.us_men}.` },
    { q:'Welche UK Größe ist EU 42?', a:`EU 42 entspricht ungefähr UK ${row.uk}.` },
    { q:'Wie viele cm sind EU 42?', a:`EU 42 entspricht ungefähr ${row.cm} cm.` }
  ]);

  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faq)}} />
      <Header />
      <section className="hero">
        <div>
          <span className="badge">Shoe Size Converter</span>
          <h1>EU 42 in US Herren umrechnen</h1>
          <p><strong>EU 42 entspricht ungefähr US Men {row.us_men}.</strong> Zusätzlich entspricht es ungefähr UK {row.uk} und {row.cm} cm.</p>
          <div className="kpi">
            <div><strong>{row.us_men}</strong><span>US Men</span></div>
            <div><strong>{row.uk}</strong><span>UK</span></div>
            <div><strong>{row.cm} cm</strong><span>Fußlänge ca.</span></div>
          </div>
        </div>
        <div className="card">
          <h2>Wichtig</h2>
          <p>Schuhe können je nach Marke, Leistenform und Modell unterschiedlich ausfallen. Sneaker, Sportschuhe und Luxusmarken sollten getrennt bewertet werden.</p>
        </div>
      </section>
      <table className="table">
        <thead><tr><th>EU</th><th>US Men</th><th>US Women</th><th>UK</th><th>CM</th></tr></thead>
        <tbody>{shoeSizes.map(s => <tr key={s.eu}><td>{s.eu}</td><td>{s.us_men}</td><td>{s.us_women}</td><td>{s.uk}</td><td>{s.cm}</td></tr>)}</tbody>
      </table>
      <Footer />
    </main>
  );
}
