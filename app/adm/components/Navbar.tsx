"use client";

interface NavbarProps {
  onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between gap-4">
        
        {/* Bloco de Títulos e Info */}
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-base sm:text-xl font-black text-white tracking-wider truncate">
            ARAÚJO <span className="text-emerald-500">IMÓVEIS</span>
          </span>
          
          <span className="text-[10px] sm:text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 whitespace-nowrap">
            Painel Admin
          </span>

          {/* O suporte agora fica visível a partir de telas médias (tablets/PC) para não amontoar */}
          <span className="hidden md:inline-block text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
            Suporte: (35) 9 9879-9211
          </span>
        </div>

        {/* Botão Adaptativo de Logout */}
        <button 
          onClick={onLogout} 
          title="Sair do Sistema"
          className="flex items-center justify-center gap-1.5 p-2.5 sm:px-4 sm:py-2 text-sm font-semibold rounded-lg transition cursor-pointer
                     bg-slate-800 border border-slate-700 text-slate-300
                     hover:bg-red-950/40 hover:text-red-400 hover:border-red-900/50"
        >
          <span>🚪</span>
          {/* O texto some no mobile e aparece no desktop */}
          <span className="hidden sm:inline">Sair do Sistema</span>
        </button>

      </div>
    </nav>
  );
}