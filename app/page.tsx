import Header from './components/Header'
import Inicio from './components/Inicio'
import Hero from './components/Hero'
import Sobre from './components/Sobre'
import Servicos from './components/Servicos'
import Equipe from './components/Equipe'
import Imoveis from './components/Imoveis'
import Footer from './components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">

      <Header />

      <Inicio />

      <Hero />

      <Sobre />

      <Servicos />

      <Equipe />

      <Imoveis />

      <Footer />

    </div>
  );
}