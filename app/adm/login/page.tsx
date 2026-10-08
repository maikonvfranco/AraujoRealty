"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase/config'; 
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const router = useRouter();

  // Login com e-mail e senha
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    if (!email || !senha) {
      setErro('Por favor, preencha todos os campos.');
      setCarregando(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      router.push('/adm'); 
    } catch (error: any) {
      console.error('Erro ao autenticar:', error);
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setErro('E-mail ou senha incorretos.');
          break;
        case 'auth/too-many-requests':
          setErro('Acesso bloqueado temporariamente por muitas tentativas falhas.');
          break;
        default:
          setErro('Ocorreu um erro ao tentar entrar. Tente novamente mais tarde.');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#000a18] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      
      <div className="sm:mx-auto w-full sm:max-w-md text-center px-4">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Painel Administrativo
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Araújo Imóveis • Gerenciamento de Imóveis
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full sm:max-w-md px-4">
        <div className="bg-slate-900 border border-slate-800/80 py-8 px-6 shadow-2xl rounded-xl sm:px-10">
          
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {/* Mensagem de Erro Dinâmica */}
            {erro && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg text-center font-medium">
                ⚠️ {erro}
              </div>
            )}

            {/* Campo de email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                E-mail de Acesso
              </label>
              <input
                id="email"
                type="email"
                required
                disabled={carregando}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@araujoimoveis.com"
                className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-3 outline-none transition placeholder-slate-600 disabled:opacity-50"
              />
            </div>

            {/* Campo de Senha */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Senha
                </label>
                <a href="#" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition">
                  Esqueceu a senha?
                </a>
              </div>
              <input
                id="password"
                type="password"
                required
                disabled={carregando}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-3 outline-none transition placeholder-slate-600 disabled:opacity-50"
              />
            </div>

            {/* Lembrar-me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  disabled={carregando}
                  className="h-4 w-4 bg-slate-950 border-slate-800 text-emerald-600 focus:ring-emerald-500 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-400 cursor-pointer select-none">
                  Lembrar conexão neste dispositivo
                </label>
              </div>
            </div>

            {/* Botão de Entrar */}
            <div>
              <button
                type="submit"
                disabled={carregando}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {carregando ? 'Autenticando...' : 'Entrar no Painel'}
              </button>
            </div>

          </form>

        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          <a href="/" className="font-semibold text-slate-400 hover:text-slate-300 underline transition">
            ← Voltar para a página inicial
          </a>
        </p>
      </div>

    </section>
  );
}