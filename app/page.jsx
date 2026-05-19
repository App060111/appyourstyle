import Header from '../components/Header';
import Footer from '../components/Footer';
import Converter from '../components/Converter';
import {brands} from '../lib/data';

export default function Home(){
  const topBrands = brands.slice(0,16);
  return (
    <main className="container">
      <Header/>
      <section className="hero">
        <div className="heroText">
          <span className="badge">Universal Size Intelligence</span>
          <h1>Google Translate für Fashiongrößen.</h1>
          <p>AppYourStyle übersetzt Größen, Markenlogiken, Fits, Schuhe, Babygrößen und internationale Standards in eine verständliche Empfehlung.</p>
          <div className="notice">Öffentlich orientierte Größenlogik. Keine offizielle Markenpartnerschaft. Jede Empfehlung zeigt Quelle, Confidence Score, Fit-Typ, Kategorie und Risiko.</div>
          <div className="trustBar">
            <span className="trustItem">Ohne Login</span>
            <span className="trustItem">Mobile First</span>
            <span className="trustItem">SourceType</span>
            <span className="trustItem">Confidence Score</span>
          </div>
          <div className="brandCloud">{topBrands.map(b=><span className="brandPill" key={b.id}>{b.name}</span>)}</div>
          <a className="showAllLink" href="/brands">Alle Marken ansehen</a>
        </div>
        <Converter/>
      </section>
      <section className="grid">
        <a className="feature" href="/brands"><h3>Brand Database</h3><p>Über {brands.length} Marken mit Fit-Profilen, Quellenlogik und Datenstatus.</p></a>
        <a className="feature" href="/size-guides"><h3>SEO Size Guides</h3><p>Skalierbare Ratgeber für Google Longtail-Suchen.</p></a>
        <a className="feature" href="/nike-to-zara-size"><h3>Nike → Zara</h3><p>Direkte Antwortseite mit Tabelle, FAQ und Structured Data.</p></a>
      </section>
      <Footer/>
    </main>
  )
}
