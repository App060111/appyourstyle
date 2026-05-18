import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = { title:'Kontakt | AppYourStyle', description:'Kontakt zu AppYourStyle.' };

export default function Contact() {
  return (
    <main className="container">
      <Header />
      <section className="legal">
        <h1>Kontakt</h1>
        <p>Für Anfragen, Partnerschaften oder Hinweise zu Größendaten:</p>
        <p><strong>E-Mail:</strong> hello@appyourstyle.com</p>
        <p>Bitte ersetze diese Adresse später durch deine echte Kontaktadresse.</p>
      </section>
      <Footer />
    </main>
  );
}
