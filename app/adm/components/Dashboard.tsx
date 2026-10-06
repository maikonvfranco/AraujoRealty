"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db, storage } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';

// Subcomponentes importados
import { Imovel } from '../../types/imoveis';
import Navbar from './Navbar';
import CardImovel from './CardImovel';
import Footer from '../../components/Footer';
import SuporteDashboard from './SuporteDashboard';

export default function Dashboard() {
  const router = useRouter();
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [abaAtiva, setAbaAtiva] = useState<'venda' | 'aluguel'>('venda');

  const carregarImoveis = async () => {
    try {
      setLoading(true);
      console.log("Buscando imóveis no Firestore...");

      const querySnapshot = await getDocs(collection(db, 'imoveis'));
      const listaImoveis: Imovel[] = [];

      querySnapshot.forEach((docSnap) => {
        listaImoveis.push({
          id: docSnap.id,
          ...docSnap.data()
        } as Imovel);
      });

      // Ordena deixando os ativos no topo
      listaImoveis.sort((a, b) => (a.ativo === b.ativo ? 0 : a.ativo ? -1 : 1));

      setImoveis(listaImoveis);
      console.log(`${listaImoveis.length} imóveis carregados com sucesso!`);
    } catch (error) {
      console.error("Erro ao carregar imóveis:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarImoveis();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/adm/login');
    } catch (e) {
      console.error(e);
    }
  };

  const alternarDisponibilidade = async (id: string, novoEstadoAtivo: boolean) => {
    try {
      const imovelRef = doc(db, 'imoveis', id);
      await updateDoc(imovelRef, { ativo: novoEstadoAtivo });

      // Atualiza o estado local para refletir na tela na hora e reordena
      setImoveis(prev =>
        prev.map(item => item.id === id ? { ...item, ativo: novoEstadoAtivo } : item)
          .sort((a, b) => (a.ativo === b.ativo ? 0 : a.ativo ? -1 : 1))
      );
    } catch (error) {
      console.error("Erro ao alterar disponibilidade:", error);
      alert("Não foi possível alterar o status do imóvel.");
    }
  };

  // Função que realmente apaga os dados (executada após a confirmação)
  const executarExclusao = async (idImovel: string) => {
    const idToast = toast.loading("Iniciando exclusão do imóvel...");

    try {
      console.log(`Iniciando exclusão do imóvel: ${idImovel}`);

      // PASSO 1: Limpar fotos do Storage
      toast.update(idToast, { render: "1/2 - Removendo imagens do servidor..." });
      const pastaStorageRef = ref(storage, `imoveis/${idImovel}`);
      const listaArquivos = await listAll(pastaStorageRef);

      if (listaArquivos.items.length > 0) {
        const promessasDeExclusao = listaArquivos.items.map((arquivoRef) => deleteObject(arquivoRef));
        await Promise.all(promessasDeExclusao);
      }

      // PASSO 2: Excluir documento do Firestore
      toast.update(idToast, { render: "2/2 - Removendo dados do catálogo..." });
      const imovelDocRef = doc(db, 'imoveis', idImovel);
      await deleteDoc(imovelDocRef);

      // Atualiza o estado da tela
      setImoveis((prevImoveis) => prevImoveis.filter((imovel) => imovel.id !== idImovel));

      // Sucesso
      toast.update(idToast, {
        render: "Imóvel e fotos removidos permanentemente!",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });

    } catch (error) {
      console.error("Erro ao excluir imóvel e arquivos:", error);
      toast.update(idToast, {
        render: "Erro ao tentar excluir o imóvel.",
        type: "error",
        isLoading: false,
        autoClose: 4000
      });
    }
  };

  // Função principal chamada pelo botão do CardImovel
  const deletarImovel = (idImovel: string) => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3 p-1">
          <p className="text-sm font-medium text-white">
            ⚠️ Tem certeza que deseja excluir este imóvel e todas as suas fotos permanentemente?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={closeToast}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                closeToast();
                executarExclusao(idImovel);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition cursor-pointer"
            >
              Sim, Excluir
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        theme: "dark"
      }
    );
  };

  const irParaCriacao = () => {
    router.push('/adm/novo');
  };

  const irParaEdicao = (imovel: Imovel) => {
    router.push(`/adm/editar/${imovel.id}`);
  };

  const totalCadastrados = imoveis.length;
  const totalDisponiveis = imoveis.filter(i => i.ativo).length;
  const totalVendidos = imoveis.filter(i => i.tipo === 'venda' && !i.ativo).length;
  const totalAlugados = imoveis.filter(i => i.tipo === 'aluguel' && !i.ativo).length;

  const imoveisFiltrados = imoveis.filter(imovel => imovel.tipo === abaAtiva);

  return (
    <div className="min-h-screen bg-[#000a18] text-slate-100 flex flex-col">
      <Navbar onLogout={handleLogout} />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* CABEÇALHO */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Gerenciamento do Catálogo</h1>
            <p className="text-sm text-slate-400">Adicione, edite ou altere a disponibilidade dos seus imóveis no Firestore.</p>
          </div>
          <button onClick={irParaCriacao} className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md transition cursor-pointer">
            ➕ Adicionar Novo Imóvel
          </button>
        </div>

        {/* CONTADORES */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Cadastrados</p>
            <p className="text-2xl font-bold text-white mt-1">{totalCadastrados}</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl">
            <p className="text-xs text-emerald-400 font-medium uppercase tracking-wider">Disponíveis (Ativos)</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{totalDisponiveis}</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl">
            <p className="text-xs text-amber-400 font-medium uppercase tracking-wider">Vendidos (Inativos)</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{totalVendidos}</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl">
            <p className="text-xs text-sky-400 font-medium uppercase tracking-wider">Alugados (Inativos)</p>
            <p className="text-2xl font-bold text-sky-400 mt-1">{totalAlugados}</p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-6 border-b border-slate-800 pb-px">
          <button onClick={() => setAbaAtiva('venda')} className={`pb-3 text-sm font-bold border-b-2 transition cursor-pointer ${abaAtiva === 'venda' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
            🏡 Imóveis para Venda ({imoveis.filter(i => i.tipo === 'venda').length})
          </button>
          <button onClick={() => setAbaAtiva('aluguel')} className={`pb-3 text-sm font-bold border-b-2 transition cursor-pointer ${abaAtiva === 'aluguel' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
            🔑 Imóveis para Aluguel ({imoveis.filter(i => i.tipo === 'aluguel').length})
          </button>
        </div>

        {/* RENDERIZAÇÃO DO GRID */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg animate-pulse">⌛ Carregando imóveis...</p>
          </div>
        ) : imoveisFiltrados.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <p className="text-slate-400">Nenhum imóvel para {abaAtiva} cadastrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imoveisFiltrados.map((imovel) => (
              <CardImovel
                key={imovel.id}
                imovel={imovel}
                onAlternarDisponibilidade={alternarDisponibilidade}
                onEditar={irParaEdicao}
                onDeletar={deletarImovel}
              />
            ))}
          </div>
        )}
      </main>
      <SuporteDashboard />
      <Footer />
    </div>
  );
}