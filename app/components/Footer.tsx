export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-6 px-4">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        {/* Identificação da Imobiliária */}
        <div className="flex-1 flex flex-col items-center md:items-start">
          <span className="text-white font-bold tracking-tight text-lg">
            ARAÚJO IMÓVEIS
          </span>
          <span className="text-xs text-emerald-500 font-medium tracking-widest uppercase">
            E Família
          </span>
        </div>

        {/* Créditos Desenvolvedor */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <a
            href="https://www.maikonfranco.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center cursor-pointer group"
          >
            <span className="text-xs text-blue-400 group-hover:text-blue-300 transition mb-1">
              Desenvolvido por:
            </span>
            <span className="text-sm text-blue-400 group-hover:text-blue-300 transition">
              www.maikonfranco.com.br
            </span>
          </a>
        </div>

        {/* Direitos e CRECI */}
        <div className="flex-1 flex flex-col items-center md:items-end">
          <p className="text-xs sm:text-sm text-center md:text-right leading-relaxed">
            &copy; {new Date().getFullYear()} Araújo Imóveis. Todos os direitos
            reservados.
            <br />
            <span className="text-xs text-slate-600 block mt-0.5">
              CRECI M.G. nº 63.855
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
