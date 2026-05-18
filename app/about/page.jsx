import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'About AppYourStyle',
  description: 'AppYourStyle ist Google Translate für Fashiongrößen.'
};

export default function About() {
  return (
    <main className="container">
      <Header />
      <section className="legal">
        <h1>About AppYourStyle</h1>
        <p>AppYourStyle entwickelt eine universelle Größen- und Fit-Infrastruktur für die globale Fashion-Welt.</p>
        <p>Die Mission: Jede Person soll sofort verstehen, welche Größe bei welcher Marke passt — ohne Login, ohne App-Zwang und ohne komplizierte Einrichtung.</p>
        <h2>Warum?</h2>
        <p>Fashiongrößen sind weltweit uneinheitlich. Nike M ist nicht automatisch Zara M. Schuhgrößen, Babygrößen, Luxusgrößen und Fits unterscheiden sich je nach Marke, Land, Schnitt und Material.</p>
        <h2>Ziel</h2>
        <p>AppYourStyle soll langfristig der offene Standard für Größenübersetzung, Fit-Logik und Return Intelligence werden.</p>
      </section>
      <Footer />
    </main>
  );
}
