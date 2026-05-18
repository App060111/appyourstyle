import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = { title:'Datenschutz | AppYourStyle', description:'Datenschutzhinweise für AppYourStyle.' };

export default function Privacy() {
  return (
    <main className="container">
      <Header />
      <section className="legal">
        <h1>Datenschutz</h1>
        <div className="notice">Vor Veröffentlichung bitte durch eine rechtlich geprüfte Datenschutzerklärung ersetzen.</div>
        <h2>Grundsatz</h2>
        <p>AppYourStyle ist auf offene Nutzung ohne Login ausgelegt. In der ersten Version werden keine verpflichtenden Nutzerkonten benötigt.</p>
        <h2>Technische Daten</h2>
        <p>Beim Betrieb einer Website können technische Zugriffsdaten durch Hostinganbieter verarbeitet werden.</p>
        <h2>Personalisierung</h2>
        <p>Personalisierte Größenprofile sollen erst später optional und mit ausdrücklicher Zustimmung erfolgen.</p>
      </section>
      <Footer />
    </main>
  );
}
