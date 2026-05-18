import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { faqJsonLd } from '../../lib/seo';

export const metadata = {
  title: 'FAQ | AppYourStyle',
  description: 'Antworten zu Größenübersetzung, Fits, Datenschutz und AppYourStyle.'
};

export default function FAQ() {
  const faq = faqJsonLd([
    { q:'Was ist AppYourStyle?', a:'AppYourStyle ist eine offene Größenübersetzungsplattform für Fashiongrößen.' },
    { q:'Muss ich mich registrieren?', a:'Nein. Die Plattform funktioniert zuerst offen ohne Login.' },
    { q:'Sind die Größenempfehlungen exakt?', a:'Sie sind Orientierung. Exakte Passform hängt von Produkt, Schnitt, Material und Marke ab.' },
    { q:'Warum ist AppYourStyle anders als Shop-the-Look?', a:'AppYourStyle fokussiert zuerst Größenübersetzung und Fit-Logik, nicht nur Produktverlinkung.' }
  ]);

  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faq)}} />
      <Header />
      <section className="legal">
        <h1>FAQ</h1>
        <h2>Was ist AppYourStyle?</h2>
        <p>AppYourStyle ist „Google Translate für Fashiongrößen“: eine offene Antwortmaschine für Marken-, Schuh-, Baby- und Fit-Größenfragen.</p>
        <h2>Muss ich mich registrieren?</h2>
        <p>Nein. Der Kern funktioniert ohne Login, ohne App und ohne Extension.</p>
        <h2>Wie genau sind Empfehlungen?</h2>
        <p>Die Empfehlungen sind Orientierung. Sie werden mit besseren Daten, Nutzerfeedback und Markeninformationen präziser.</p>
        <h2>Warum ist Vertrauen wichtig?</h2>
        <p>Größenempfehlungen beeinflussen Kaufentscheidungen. Deshalb sind Transparenz, Datenschutz und klare Hinweise zentral.</p>
      </section>
      <Footer />
    </main>
  );
}
