import Header from '../../components/Header';
import Footer from '../../components/Footer';
import shoeSizes from '../../data/shoeSizes.json';
import { faqJsonLd } from '../../lib/seo';

export const metadata = {
  title: 'Schuhgrößen EU US UK CM umrechnen | AppYourStyle',
  description: 'Schuhgrößen schnell zwischen EU, US, UK und CM umrechnen.'
};

export default function ShoePage() {
  const faq = faqJsonLd([
    { q:'Welche US Größe ist EU 43?', a:'EU 43 entspricht ungefähr US Men 10, UK 9.5 und etwa 28 cm.' },
    { q:'Sind Schuhgrößen bei jeder Marke gleich?', a:'Nein. Sneaker, Sportschuhe und Luxusmarken können unterschiedlich ausfallen.' }
  ]);
  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faq)}} />
      <Header />
      <section className="hero"><div><span className="badge">Shoe Size Converter</span><h1>Schuhgrößen EU, US, UK und CM umrechnen</h1><p>Sofortige Übersicht für internationale Schuhgrößen.</p></div></section>
      <table className="table">
        <thead><tr><th>EU</th><th>US Herren</th><th>US Damen</th><th>UK</th><th>CM</th></tr></thead>
        <tbody>{shoeSizes.map(s => <tr key={s.eu}><td>{s.eu}</td><td>{s.us_men}</td><td>{s.us_women}</td><td>{s.uk}</td><td>{s.cm}</td></tr>)}</tbody>
      </table>
      <Footer />
    </main>
  );
}
