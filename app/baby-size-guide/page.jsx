import Header from '../../components/Header';
import Footer from '../../components/Footer';
import babySizes from '../../data/babyKidsSizes.json';

export const metadata = { title:'Babygrößen nach Alter und Körpergröße | AppYourStyle', description:'Baby- und Kindergrößen nach Alter und Körpergröße verstehen.' };

export default function BabyPage(){
  return <main className="container"><Header/><section className="hero"><div><span className="badge">Baby & Kids Size Guide</span><h1>Babygrößen nach Alter und Körpergröße</h1><p>Die beste Orientierung ist die Körpergröße, nicht nur das Alter.</p></div></section><table className="table"><thead><tr><th>Alter</th><th>Körpergröße</th><th>Größe</th></tr></thead><tbody>{babySizes.map(s=><tr key={s.size}><td>{s.age}</td><td>{s.height_cm} cm</td><td>{s.size}</td></tr>)}</tbody></table><Footer/></main>
}
