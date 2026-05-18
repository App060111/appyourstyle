import Header from '../../components/Header';
import Footer from '../../components/Footer';
import babySizes from '../../data/babyKidsSizes.json';
import { faqJsonLd } from '../../lib/seo';

export const metadata = {
  title: 'Babygrößen nach Alter und Körpergröße | AppYourStyle',
  description: 'Baby- und Kindergrößen einfach nach Alter und Körpergröße verstehen.'
};

export default function BabyPage() {
  const faq = faqJsonLd([
    { q:'Welche Babygröße hat ein Kind mit 12 Monaten?', a:'Häufig liegt die Größe bei etwa 80 bis 86, abhängig von Körpergröße und Marke.' },
    { q:'Ist Babygröße 86 immer gleich?', a:'Nein. Körpergröße und Marke sind wichtiger als Alter allein.' }
  ]);
  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faq)}} />
      <Header />
      <section className="hero"><div><span className="badge">Baby & Kids Size Guide</span><h1>Babygrößen nach Alter und Körpergröße</h1><p>Die beste Orientierung ist die Körpergröße, nicht nur das Alter.</p></div></section>
      <table className="table">
        <thead><tr><th>Alter</th><th>Körpergröße</th><th>Empfohlene Größe</th></tr></thead>
        <tbody>{babySizes.map(s => <tr key={s.size}><td>{s.age}</td><td>{s.height_cm} cm</td><td>{s.size}</td></tr>)}</tbody>
      </table>
      <Footer />
    </main>
  );
}
