import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = { title:'Datenschutz | AppYourStyle', description:'Datenschutz bei AppYourStyle.' };

export default function Privacy() {
  return (
    <main className="container">
      <Header />
      <section className="legal">
        <h1>Datenschutz</h1>
        <div className="notice">Bitte vor endgültiger Veröffentlichung rechtlich prüfen lassen.</div>
        <h2>Verantwortlicher</h2>
        <p>Florian Kissel<br/>Sauererlenstr. 23<br/>65824 Schwalbach am Taunus<br/>Deutschland</p>
        <h2>Grundsatz</h2>
        <p>AppYourStyle ist auf offene Nutzung ohne Login ausgelegt. In der ersten Version werden keine verpflichtenden Nutzerkonten benötigt.</p>
        <h2>Hosting</h2>
        <p>Die Website wird über einen Hostinganbieter bereitgestellt. Dabei können technische Zugriffsdaten verarbeitet werden.</p>
        <h2>Personalisierung</h2>
        <p>Personalisierte Größenprofile sollen erst später optional und mit ausdrücklicher Zustimmung erfolgen.</p>
      </section>
      <Footer />
    </main>
  );
}
