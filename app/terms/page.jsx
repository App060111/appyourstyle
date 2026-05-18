import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = { title:'Nutzung & Haftung | AppYourStyle', description:'Nutzungshinweise und Haftung zu AppYourStyle.' };

export default function Terms() {
  return (
    <main className="container">
      <Header />
      <section className="legal">
        <h1>Nutzung & Haftung</h1>
        <p>AppYourStyle liefert Größen- und Fit-Orientierung. Empfehlungen ersetzen keine offiziellen Größentabellen oder Produktangaben der jeweiligen Händler.</p>
        <p>Passformen können je nach Schnitt, Material, Kollektion und persönlicher Präferenz abweichen.</p>
      </section>
      <Footer />
    </main>
  );
}
