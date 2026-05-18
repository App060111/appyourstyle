import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = { title:'About AppYourStyle', description:'AppYourStyle ist Google Translate für Fashiongrößen.' };

export default function About() {
  return (
    <main className="container">
      <Header />
      <section className="legal">
        <h1>About AppYourStyle</h1>
        <p>AppYourStyle entwickelt eine universelle Größen- und Fit-Infrastruktur für die globale Fashion-Welt.</p>
        <p>Ziel ist, jede Fashiongröße verständlich zu machen: Marken, Schuhe, Babygrößen, Fits und regionale Standards.</p>
      </section>
      <Footer />
    </main>
  );
}
