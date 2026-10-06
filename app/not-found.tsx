"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const [segundos, setSegundos] = useState(5);

  useEffect(() => {
    // Contador visual diminuindo de 1 em 1 segundo
    const intervalo = setInterval(() => {
      setSegundos((prev) => prev - 1);
    }, 1000);

    // Redirecionamento após os 5 segundos (5000ms)
    const timer = setTimeout(() => {
      router.replace("/");
    }, 5000);

    // Limpa os timers caso o usuário saia da página antes
    return () => {
      clearInterval(intervalo);
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-[#000a18] flex flex-col items-center justify-center px-4 text-center text-slate-100">
      
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Número do Erro em Destaque */}
        <span className="text-7xl sm:text-8xl font-black text-emerald-500 tracking-wider drop-shadow-[0_0_15px_rgba(16,185,129,0.15)] select-none">
          404
        </span>

        {/* Mensagem Principal */}
        <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Página não encontrada
        </h1>
        
        <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
          O link que você tentou acessar não existe ou mudou de endereço. 
          Não se preocupe, estamos te levando de volta para o início.
        </p>

        {/* Barra de Progresso / Contador Visual */}
        <div className="mt-8 bg-slate-900 border border-slate-800 p-4 rounded-xl w-full flex items-center justify-center gap-3">
          <span className="animate-pulse text-emerald-400">⏳</span>
          <p className="text-xs sm:text-sm font-medium text-slate-300">
            Redirecionando em <span className="text-emerald-400 font-bold text-base px-1">{segundos}</span> {segundos === 1 ? 'segundo' : 'segundos'}...
          </p>
        </div>

        {/* Botão de Escape Imediato */}
        <button
          onClick={() => router.replace("/")}
          className="mt-6 text-xs font-semibold text-slate-400 hover:text-white underline underline-offset-4 transition cursor-pointer"
        >
          Ir para a página inicial agora
        </button>
      </div>

    </main>
  );
}