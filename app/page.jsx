import Header from '../components/Header';
import Footer from '../components/Footer';
import Converter from '../components/Converter';

export default function Home() {
  const jsonLd = {
    '@context':'https://schema.org',
    '@type':'WebSite',
    name:'AppYourStyle',
    description:'Universal Size Converter für Fashiongrößen.',
    potentialAction:{'@type':'SearchAction', target:'https://appyourstyle.com/questions/{search_term_string}', 'query-input':'required name=search_term_string'}
  };

  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}} />
      <Header />
      <section className="hero">
        <div>
          <span className="badge">Universal Size Answer Engine</span>
          <h1>Deine perfekte Größe bei jeder Marke.</h1>
          <p>AppYourStyle übersetzt Fashiongrößen wie Google Translate Sprache übersetzt: Nike M zu Zara L, EU zu US Schuhgrößen, Babygrößen nach Alter und Körpergröße.</p>
          <div className="notice">Hinweis: Größen können je nach Schnitt, Material und Produkt variieren. AppYourStyle liefert Orientierung und wird mit Daten laufend präziser.</div>
        </div>
        <Converter />
      </section>

      <section className="grid">
        <a className="card" href="/convert/nike/zara"><h3>Nike → Zara</h3><p>Welche Zara Größe passt, wenn du Nike M trägst?</p></a>
        <a className="card" href="/shoe-size-converter"><h3>Schuhgrößen</h3><p>EU, US, UK und CM umrechnen.</p></a>
        <a className="card" href="/baby-size-guide"><h3>Babygrößen</h3><p>Baby- und Kindergrößen nach Alter und Körpergröße.</p></a>
      </section>

      <section className="grid">
        <a className="card" href="/fit/oversized"><h3>Oversized Fit</h3><p>Verstehe, wann du kleiner oder normal wählen solltest.</p></a>
        <a className="card" href="/fit/slim-fit"><h3>Slim Fit</h3><p>Körpernaher Schnitt und Größenrisiko erklärt.</p></a>
        <a className="card" href="/faq"><h3>FAQ</h3><p>Wie funktioniert AppYourStyle und wie genau sind Empfehlungen?</p></a>
      </section>
      <Footer />
    </main>
  );
}
