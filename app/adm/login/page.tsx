"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase/config'; 
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, deleteUser } from 'firebase/auth';
import { getAdditionalUserInfo } from 'firebase/auth';

export default function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const router = useRouter();

  // Login email
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

  // Login com Google
  const handleGoogleLogin = async () => {
    setErro('');
    setCarregando(true);
    const provider = new GoogleAuthProvider();

    try {
      const resultado = await signInWithPopup(auth, provider);
      const dadosAdicionais = getAdditionalUserInfo(resultado);

      // Bloqueio de segurança: se a conta acabou de ser criada, ela não é permitida
      if (dadosAdicionais?.isNewUser) {
        if (auth.currentUser) {
          await deleteUser(auth.currentUser); // Deleta a conta recém-criada
        }
        setErro('Acesso negado. Esta conta Google não está registrada como administrador.');
        return;
      }

      // Se já existia entra 
      router.push('/adm');
    } catch (error: any) {
      console.error('Erro ao autenticar com Google:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setErro('Falha na autenticação com o Google. Tente novamente.');
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
          
          {/* BOTÃO DO GOOGLE */}
          <div className="mb-6">
            <button
              type="button"
              disabled={carregando}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-200 rounded-lg text-sm font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Entrar com o Google
            </button>
          </div>

          {/* DIVISOR */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-500 font-medium tracking-wider">ou acesse com</span>
            </div>
          </div>

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