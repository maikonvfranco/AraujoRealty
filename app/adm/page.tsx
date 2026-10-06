'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase/config'; // Certifique-se de que o caminho está correto de acordo com sua estrutura
import Dashboard from './components/Dashboard';

export default function Admin() {
  const router = useRouter();
  const [estaVerificando, setEstaVerificando] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState(false);

  useEffect(() => {
    // Escuta o estado da autenticação do Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuarioLogado(true);
        setEstaVerificando(false);
      } else {
        // Se não estiver logado, redireciona para a tela de login
        router.push("/adm/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // renderiza tela de loading
  if (estaVerificando) {
    return (
      <div className="fixed inset-0 bg-[#000a18] flex flex-col items-center justify-center text-white z-50">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-slate-400 tracking-wider font-medium animate-pulse">
          Verificando credenciais...
        </p>
      </div>
    );
  }

  // Só renderiza o Dashboard se a verificação terminar e o usuário estiver logado
  return usuarioLogado ? <Dashboard /> : null;
}