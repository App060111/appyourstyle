import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { brands } from '../../lib/data';

export const metadata = {
  title:'Size Guides | AppYourStyle',
  description:'Skalierbare Size Guides für Marken, Schuhe, Babygrößen und internationale Größen.'
};

export default function SizeGuides(){
  return (
    <main className="container">
      <Header/>
      <section className="hero">
        <div>
          <span className="badge">SEO Content System</span>
          <h1>Size Guides für jede Größenfrage.</h1>
          <p>Diese Struktur ist auf hunderte SEO-Landingpages, zukünftige API-Integrationen und KI-Empfehlungen ausgelegt.</p>
        </div>
        <div className="card"><h2>Core Pages</h2><p>Nike→Zara, Adidas vs H&M, EU42→US, Brand Guides, Baby/Kids.</p></div>
      </section>
      <section className="grid">
        <a className="feature" href="/nike-size-chart"><h3>Nike Size Chart</h3><p>Brand Guide mit Quelle, Datenstatus und Fit-Logik.</p></a>
        <a className="feature" href="/zara-size-guide"><h3>Zara Size Guide</h3><p>Zara Fit-Tendenz und Größenhinweise.</p></a>
        <a className="feature" href="/gucci-shoe-size-converter"><h3>Gucci Shoe Converter</h3><p>Luxus-Schuhgrößen verständlich übersetzen.</p></a>
      </section>
      <Footer/>
    </main>
  )
}
