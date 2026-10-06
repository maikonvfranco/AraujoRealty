import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-slate-950 border-b border-slate-800 backdrop-blur-md bg-slate-950/90 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-26 flex items-center justify-between">
        <div className="flex items-center justify-center">
          <Image
            src="/images/logo.png"
            alt="Logo Araújo Imóveis e Família"
            width={80}
            height={40}
            className="w-20 h-auto object-contain"
            priority
          />
        </div>
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
          <a href="#inicio" className="hover:text-emerald-600 transition">Início</a>
          <a href="#sobre" className="hover:text-emerald-600 transition">Quem Somos</a>
          <a href="#contato" className="hover:text-emerald-600 transition">Contato</a>
          <a href="#imoveis" className="hover:text-emerald-600 transition">Imóveis</a>
        </nav>
        <div>
          <a
            href="https://wa.me/5535992682896"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}