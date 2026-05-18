import Header from '../components/Header';
import Footer from '../components/Footer';
import Converter from '../components/Converter';
import { brands } from '../lib/data';

export default function Home(){
  return (
    <main className="container">
      <Header/>
      <section className="hero">
        <div>
          <span className="badge">Universal Size Intelligence Platform</span>
          <h1>Google Translate für Fashiongrößen.</h1>
          <p>AppYourStyle übersetzt Größen, Markenlogiken, Fits, Schuhe, Babygrößen und internationale Standards in eine verständliche Empfehlung.</p>
          <div className="notice">Jede Empfehlung zeigt Quelle, Confidence Score, Fit-Typ, Kategorie und Risiko. Keine Registrierung. Keine App-Pflicht.</div>
          <div className="brandCloud">{brands.slice(0,32).map(b=><span className="brandPill" key={b.id}>{b.name}</span>)}</div>
        </div>
        <Converter/>
      </section>
      <section className="grid">
        <a className="feature" href="/brands"><h3>Massive Brand Database</h3><p>Über {brands.length} Marken mit Fit-Profilen, Source-Logik und Datenstatus.</p></a>
        <a className="feature" href="/size-guides"><h3>SEO Size Guides</h3><p>Skalierbare Größen-Ratgeber für Google Longtail-Suchen.</p></a>
        <a className="feature" href="/nike-to-zara-size"><h3>Nike → Zara</h3><p>Direkte Antwortseite mit FAQ, Tabelle und Structured Data.</p></a>
      </section>
      <Footer/>
    </main>
  )
}
