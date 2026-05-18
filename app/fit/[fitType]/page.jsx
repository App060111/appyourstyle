import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

const text = {
  oversized: 'Oversized bedeutet bewusst weiter geschnitten. Wenn kein sehr lockerer Look gewünscht ist, kann eine kleinere Größe sinnvoll sein.',
  'slim-fit': 'Slim Fit ist körpernah geschnitten. Bei breiteren Schultern, Brust oder Hüfte kann eine Größe größer angenehmer sein.',
  regular: 'Regular Fit ist klassisch geschnitten und meist die neutralste Ausgangsbasis.'
};

export async function generateMetadata({ params }) {
  return { title: `${params.fitType} erklärt | AppYourStyle`, description: `Was bedeutet ${params.fitType} und welche Größe passt?` };
}

export default function FitPage({ params }) {
  return (
    <main className="container">
      <Header />
      <section className="hero"><div><span className="badge">Fit Guide</span><h1>{params.fitType} verstehen</h1><p>{text[params.fitType] || 'Dieser Fit ist produkt- und markenabhängig.'}</p></div></section>
      <Footer />
    </main>
  );
}
