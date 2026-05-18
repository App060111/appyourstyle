import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = { title:'Impressum | AppYourStyle', description:'Impressum von AppYourStyle.' };

export default function Imprint() {
  return (
    <main className="container">
      <Header />
      <section className="legal">
        <h1>Impressum</h1>
        <div className="notice">Wichtig: Diese Seite muss vor Veröffentlichung mit echten Anbieterangaben ergänzt werden.</div>
        <p><strong>Angaben gemäß § 5 TMG / DDG</strong></p>
        <p>Name / Firma: [bitte ergänzen]</p>
        <p>Adresse: [bitte ergänzen]</p>
        <p>E-Mail: [bitte ergänzen]</p>
        <p>Verantwortlich für den Inhalt: [bitte ergänzen]</p>
      </section>
      <Footer />
    </main>
  );
}
