import Header from '../components/Header';
import Footer from '../components/Footer';
import Converter from '../components/Converter';

export default function Home() {
  return (
    <main className="container">
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
        <a className="card" href="/nike-to-zara-size"><h3>Nike → Zara</h3><p>Welche Zara Größe passt, wenn du Nike M trägst?</p></a>
        <a className="card" href="/adidas-vs-hm-fit"><h3>Adidas vs H&M</h3><p>Fit-Vergleich zwischen Adidas und H&M.</p></a>
        <a className="card" href="/eu-42-to-us-men"><h3>EU 42 → US Men</h3><p>Schuhgröße EU 42 in US Herren umrechnen.</p></a>
      </section>
      <Footer />
    </main>
  );
}
