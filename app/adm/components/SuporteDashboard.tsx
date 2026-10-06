"use client";

export default function SuporteDashboard() {
  const telefoneSuporte = "(35) 9 9879-9211";
  const linkWhatsapp = "https://api.whatsapp.com/send/?phone=5535998799211&text=Ol%C3%A1%2C+preciso+de+ajuda+no+Painel+Ara%C3%BAjo+Im%C3%B3veis.";

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-6 mt-8 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        
        {/* Texto de Chamada */}
        <div className="flex flex-col gap-1 text-center md:text-left">
          <h3 className="text-sm font-bold text-white tracking-wide uppercase flex items-center justify-center md:justify-start gap-2">
            <span className="animate-pulse inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            Suporte Técnico
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Precisa de ajuda com o sistema ou encontrou algum problema? Fale comigo!
          </p>
        </div>

        {/* Canais de Atendimento */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
          
          {/* Opção Telefone / Cópia */}
          <div className="w-full sm:w-auto flex items-center gap-3 bg-slate-950/60 border border-slate-800 px-4 py-2.5 rounded-lg text-xs sm:text-sm text-slate-300">
            <span className="text-slate-500">📞</span>
            <span className="font-medium select-all">{telefoneSuporte}</span>
          </div>

          {/* Botão Direto para o WhatsApp */}
          <a
            href={linkWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md hover:shadow-emerald-900/20 border border-emerald-500/20 transition cursor-pointer text-center"
          >
            <span>💬</span>
            Chamar no WhatsApp
          </a>

        </div>

      </div>
    </div>
  );
}