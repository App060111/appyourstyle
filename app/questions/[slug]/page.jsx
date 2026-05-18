import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export async function generateMetadata({ params }) {
  return { title: `${params.slug.replaceAll('-', ' ')} | AppYourStyle`, description: 'Sofortige Antwort auf Größenfragen.' };
}

export default function QuestionPage({ params }) {
  const readable = params.slug.replaceAll('-', ' ');
  return (
    <main className="container">
      <Header />
      <section className="hero">
        <div><span className="badge">Direkte Antwort</span><h1>{readable}</h1><p>AppYourStyle beantwortet Größenfragen direkt. Nutze den Universal Size Converter für konkrete Markenvergleiche.</p><a className="badge" href="/">Zur Größenübersetzung</a></div>
      </section>
      <Footer />
    </main>
  );
}
