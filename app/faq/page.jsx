import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { faqJsonLd } from '../../lib/seo';

export const metadata = { title:'FAQ | AppYourStyle', description:'Antworten zu Größenübersetzung, Fits und Datenschutz.' };

export default function FAQ() {
  const faq = faqJsonLd([
    { q:'Was ist AppYourStyle?', a:'AppYourStyle ist eine offene Größenübersetzungsplattform für Fashiongrößen.' },
    { q:'Muss ich mich registrieren?', a:'Nein. AppYourStyle funktioniert zuerst offen ohne Login.' },
    { q:'Sind die Daten öffentlich?', a:'Die erste Datenbasis orientiert sich an öffentlich zugänglichen Größenlogiken und allgemeinen Umrechnungstabellen.' }
  ]);

  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faq)}} />
      <Header />
      <section className="legal">
        <h1>FAQ</h1>
        <h2>Was ist AppYourStyle?</h2><p>AppYourStyle ist Google Translate für Fashiongrößen.</p>
        <h2>Muss ich mich registrieren?</h2><p>Nein. Der Kern funktioniert offen ohne Login.</p>
        <h2>Wie genau sind Empfehlungen?</h2><p>Die Empfehlungen sind Orientierung und werden mit geprüften Daten, Nutzerfeedback und Markeninformationen präziser.</p>
      </section>
      <Footer />
    </main>
  );
}
