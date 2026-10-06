'use client'

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { getImoveis } from "../firebase/imoveis";
import { Imovel } from "../types/imoveis";

export default function Imoveis() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);

  // Alterado para 'venda' ser a aba padrão ao carregar a página
  const [abaAtiva, setAbaAtiva] = useState<'aluguel' | 'venda'>('venda');

  // Estados para o Modal
  const [imovelSelecionado, setImovelSelecionado] = useState<Imovel | null>(null);
  const [fotoAtivaIndex, setFotoAtivaIndex] = useState(0);

  // Estado para rastrear qual miniatura está selecionada em cada card individualmente
  // Estrutura: { [idDoImovel]: "url_da_foto_selecionada" }
  const [fotosPrincipaisCards, setFotosPrincipaisCards] = useState<Record<string, string>>({});

  const [filtroCidade, setFiltroCidade] = useState("");
  const [filtroBairro, setFiltroBairro] = useState("");

  const cidades = [...new Set(imoveis.map(i => i.cidade))].sort();
  const bairros = [...new Set(
    imoveis
      .filter(i => !filtroCidade || i.cidade === filtroCidade)
      .map(i => i.bairro)
  )].sort();

  const imoveisFiltrados = useMemo(() => {
    const filtrados = imoveis.filter(imovel => {
      if (imovel.tipo !== abaAtiva) return false; // Filtra pela aba ativa
      if (filtroCidade && imovel.cidade !== filtroCidade) return false;
      if (filtroBairro && imovel.bairro !== filtroBairro) return false;
      return true;
    });

    // Ordena colocando os inativos (ativo === false) por último
    return filtrados.sort((a, b) => {
      const ativoA = a.ativo !== false ? 1 : 0;
      const ativoB = b.ativo !== false ? 1 : 0;
      return ativoB - ativoA;
    });
  }, [imoveis, abaAtiva, filtroCidade, filtroBairro]);

  // Formatador de moeda padrão R$
  const formatarPreco = (valor: number, tipo: string) => {
    const formatado = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    return tipo === 'aluguel' ? `${formatado}/mês` : formatado;
  };

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await getImoveis();
        setImoveis(dados as Imovel[]);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const abrirModal = (imovel: Imovel) => {
    setImovelSelecionado(imovel);
    setFotoAtivaIndex(0);
  };

  if (loading) {
    return (
      <section className="py-20 text-center text-slate-400">
        Carregando imóveis...
      </section>
    );
  }

  const limiteMiniaturasCard = 4;

  return (
    <section id="imoveis" className="bg-[#000a18] py-16 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TÍTULO DA SEÇÃO */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Nossas Opções de Imóveis
          </h2>
          <p className="mt-3 text-lg text-slate-400 max-w-2xl mx-auto">
            Explore as melhores oportunidades da região selecionadas para você.
          </p>
        </div>

        {/* BARRA DE FILTROS */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 mb-10 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Filtro Cidade */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cidade</label>
              <select
                value={filtroCidade}
                onChange={(e) => setFiltroCidade(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 outline-none"
              >
                <option value="">Todas as cidades</option>
                {cidades.map((cidade) => (
                  <option key={cidade} value={cidade}>{cidade}</option>
                ))}
              </select>
            </div>

            {/* Filtro Bairro */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bairro</label>
              <select
                value={filtroBairro}
                onChange={(e) => setFiltroBairro(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 outline-none"
              >
                <option value="">Todos os bairros</option>
                {bairros.map((bairro) => (
                  <option key={bairro} value={bairro}>{bairro}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ABAS DE SELEÇÃO */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex gap-1">
            <button
              onClick={() => setAbaAtiva('venda')}
              className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all duration-350 cursor-pointer ${abaAtiva === 'venda'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
            >
              Venda
            </button>
            <button
              onClick={() => setAbaAtiva('aluguel')}
              className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all duration-350 cursor-pointer ${abaAtiva === 'aluguel'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
            >
              Aluguel
            </button>
          </div>
        </div>

        {/* LISTAGEM DE CARDS */}
        <div className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {imoveisFiltrados.length === 0 ? (
            <div className="text-center w-full py-12 text-slate-500 text-sm">
              Nenhum imóvel encontrado para esta categoria com os filtros selecionados.
            </div>
          ) : (
            imoveisFiltrados.map((imovel) => {
              const isAtivo = imovel.ativo !== false;
              const temFotos = Array.isArray(imovel.fotos) && imovel.fotos.length > 0 && imovel.fotos[0]?.url;

              // Define o padrão inicial usando a primeira foto existente ou o link padrão do Firebase Storage
              const urlCapaPadrao = temFotos
                ? imovel.fotos[0].url
                : "https://firebasestorage.googleapis.com/v0/b/site-2749b.firebasestorage.app/o/imoveis%2FDefault%2FCard.webp?alt=media&token=c5388793-0f67-4e6d-9033-e095bf21d75f";

              // Checa se o usuário já clicou em alguma miniatura deste card específico
              const imagemExibida = imovel.id ? (fotosPrincipaisCards[imovel.id] || urlCapaPadrao) : urlCapaPadrao;

              const totalFotos = imovel.fotos?.length || 0;

              return (
                <div
                  key={imovel.id}
                  onClick={() => abrirModal(imovel)}
                  className={`flex-shrink-0 w-[290px] sm:w-[340px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl snap-start hover:border-slate-700 transition duration-300 flex flex-col cursor-pointer group ${!isAtivo ? 'opacity-60 grayscale-[30%] border-dashed' : ''
                    }`}
                >
                  {/* Imagem do Imóvel */}
                  <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                    <Image
                      src={imagemExibida}
                      alt={imovel.nome}
                      fill
                      sizes="(max-width: 640px) 290px, 340px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <span className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-bold uppercase rounded-md shadow-md z-10 ${!isAtivo
                        ? 'bg-slate-700 text-slate-300'
                        : imovel.tipo === 'venda' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                      }`}>
                      {!isAtivo ? 'Vendido / Indisponível' : imovel.tipo === 'venda' ? 'Venda' : 'Aluguel'}
                    </span>

                    {!isAtivo && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="bg-slate-950/80 border border-slate-700 text-slate-400 text-xs tracking-widest font-black uppercase px-4 py-2 rounded">
                          Histórico de Vendas
                        </span>
                      </div>
                    )}
                  </div>

                  {/* FILEIRA DE MINIATURAS ADICIONADA AQUI */}
                  {temFotos && totalFotos > 1 && (
                    <div
                      className="flex items-center gap-1.5 px-5 pt-3 overflow-x-auto scrollbar-none"
                      onClick={(e) => e.stopPropagation()} // Impede que o clique na miniatura abra o modal direto
                    >
                      {imovel.fotos?.slice(0, limiteMiniaturasCard).map((foto, index) => {
                        const estaSelecionada = imagemExibida === foto.url;
                        const ehOUltimoSlot = index === limiteMiniaturasCard - 1;
                        const fotosRestantes = totalFotos - limiteMiniaturasCard;

                        return (
                          <div
                            key={index}
                            onClick={() => {
                              if (imovel.id) {
                                setFotosPrincipaisCards(prev => ({ ...prev, [imovel.id!]: foto.url }));
                              }
                            }}
                            className={`relative w-9 h-9 rounded-md overflow-hidden border cursor-pointer flex-shrink-0 transition-all ${estaSelecionada ? 'border-emerald-500 scale-105 shadow-md' : 'border-slate-800 opacity-50 hover:opacity-100'
                              }`}
                          >
                            <img src={foto.url} alt="" className="w-full h-full object-cover" />
                            {ehOUltimoSlot && fotosRestantes > 0 && (
                              <div className="absolute inset-0 bg-slate-950/85 flex items-center justify-center pointer-events-none">
                                <span className="text-[10px] font-black text-white">+{fotosRestantes}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Informações do Card */}
                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="text-xs font-medium text-emerald-400 mb-1 flex items-center justify-between gap-1">
                        <span>📍 {imovel.bairro} - {imovel.cidade}/MG</span>
                        {imovel.areaTerreno && (
                          <span className="text-slate-400 font-semibold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            📐 {Number(imovel.areaTerreno).toLocaleString('pt-BR')} m²
                          </span>
                        )}
                      </div>
                      <h3 className={`text-lg font-bold text-white tracking-tight line-clamp-1 group-hover:text-emerald-400 transition ${!isAtivo ? 'line-through text-slate-400' : ''
                        }`}>
                        {imovel.nome}
                      </h3>
                      <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {imovel.descricao}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500">Valor</span>
                        <span className={`text-lg font-extrabold text-white ${!isAtivo ? 'text-slate-400' : ''}`}>
                          {formatarPreco(imovel.valor, imovel.tipo)}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          abrirModal(imovel);
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold text-white rounded-md transition ${!isAtivo
                            ? 'bg-slate-800 hover:bg-slate-750 text-slate-400 border border-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                          }`}
                      >
                        {!isAtivo ? 'Ver Histórico' : 'Ver Detalhes'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* --- MODAL DE DETALHES --- */}
      {imovelSelecionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setImovelSelecionado(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão Fechar */}
            <button
              onClick={() => setImovelSelecionado(null)}
              className="cursor-pointer absolute top-4 right-4 z-10 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 text-white rounded-full p-2 transition"
            >
              ✕
            </button>

            {/* Visualizador de Fotos do Modal */}
            <div className="relative h-64 sm:h-96 w-full bg-slate-950">
              <Image
                src={(Array.isArray(imovelSelecionado.fotos) && imovelSelecionado.fotos.length > 0 && imovelSelecionado.fotos[fotoAtivaIndex]?.url) ? imovelSelecionado.fotos[fotoAtivaIndex].url : "/images/sem-imagem.jpg"}
                alt={imovelSelecionado.nome}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className={`object-cover ${imovelSelecionado.ativo === false ? 'opacity-70 grayscale-[20%]' : ''}`}
              />

              {/* Controles de Navegação das Imagens do Modal */}
              {Array.isArray(imovelSelecionado.fotos) && imovelSelecionado.fotos.length > 1 && (
                <>
                  <button
                    onClick={() => setFotoAtivaIndex(prev => prev === 0 ? imovelSelecionado.fotos!.length - 1 : prev - 1)}
                    className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 bg-slate-950/70 hover:bg-slate-950 text-white p-2 rounded-full border border-slate-800 transition"
                  >
                    ◀
                  </button>
                  <button
                    onClick={() => setFotoAtivaIndex(prev => prev === imovelSelecionado.fotos!.length - 1 ? 0 : prev + 1)}
                    className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 bg-slate-950/70 hover:bg-slate-950 text-white p-2 rounded-full border border-slate-800 transition"
                  >
                    ▶
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-4 bg-slate-950/80 px-3 py-1 text-xs rounded-full border border-slate-800 text-slate-300">
                {fotoAtivaIndex + 1} / {(Array.isArray(imovelSelecionado.fotos) && imovelSelecionado.fotos.length) || 1}
              </div>
            </div>

            {/* Miniaturas das Fotos no Modal */}
            {Array.isArray(imovelSelecionado.fotos) && imovelSelecionado.fotos.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto bg-slate-950/40 border-b border-slate-800 scrollbar-thin">
                {imovelSelecionado.fotos.map((foto, index) => (
                  <button
                    key={index}
                    onClick={() => setFotoAtivaIndex(index)}
                    className={`relative w-16 h-12 flex-shrink-0 rounded-md overflow-hidden border-2 transition ${index === fotoAtivaIndex ? 'border-emerald-500 scale-95' : 'border-transparent opacity-60'
                      }`}
                  >
                    <Image
                      src={foto.url}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Conteúdo do Modal */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className={`px-2.5 py-0.5 text-xs font-bold uppercase rounded-md ${imovelSelecionado.ativo === false
                      ? 'bg-slate-700 text-slate-300'
                      : imovelSelecionado.tipo === 'venda' ? 'bg-emerald-600' : 'bg-blue-600'
                    }`}>
                    {imovelSelecionado.ativo === false ? 'Vendido / Indisponível' : imovelSelecionado.tipo === 'venda' ? 'Venda' : 'Aluguel'}
                  </span>
                  <h3 className={`text-2xl font-bold text-white mt-2 ${imovelSelecionado.ativo === false ? 'line-through text-slate-400' : ''}`}>
                    {imovelSelecionado.nome}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-emerald-400 mt-1">
                    <span>📍 {imovelSelecionado.bairro} - {imovelSelecionado.cidade}/MG</span>
                    {imovelSelecionado.areaTerreno && (
                      <span className="text-slate-300 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded font-mono">
                        📐 Área: {Number(imovelSelecionado.areaTerreno).toLocaleString('pt-BR')} m²
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">
                    {imovelSelecionado.ativo === false ? 'Valor da Venda' : 'Valor do Investimento'}
                  </span>
                  <span className={`text-2xl font-black text-white ${imovelSelecionado.ativo === false ? 'text-slate-400' : ''}`}>
                    {formatarPreco(imovelSelecionado.valor, imovelSelecionado.tipo)}
                  </span>
                </div>
              </div>

              <hr className="border-slate-800" />

              <div>
                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Descrição Completa</h4>
                <p className="text-sm text-slate-400 whitespace-pre-line leading-relaxed">
                  {imovelSelecionado.descricao}
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                {imovelSelecionado.ativo !== false ? (
                  <a
                    href={`https://wa.me/5535992682896?text=Olá,%20tenho%20interesse%20no%20imóvel:%20${encodeURIComponent(imovelSelecionado.nome)} localizado em ${encodeURIComponent(imovelSelecionado.bairro)} - ${encodeURIComponent(imovelSelecionado.cidade)}. Poderia me fornecer mais informações, por favor?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-950/20"
                  >
                    Falar com Corretor no WhatsApp
                  </a>
                ) : (
                  <div className="w-full sm:w-auto text-center bg-slate-800 text-slate-400 font-semibold px-6 py-3 rounded-xl border border-slate-700">
                    Este imóvel não está mais disponível (Histórico)
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}