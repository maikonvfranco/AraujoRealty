"use client";

import { useState, useEffect } from 'react';
import { Imovel, Foto } from '../../types/imoveis';

interface CardImovelProps {
  imovel: Imovel;
  onAlternarDisponibilidade: (id: string, novoEstado: boolean, tipo?: 'venda' | 'aluguel') => void;
  onEditar: (imovel: Imovel) => void;
  onDeletar: (id: string) => void;
}

export default function CardImovel({ imovel, onAlternarDisponibilidade, onEditar, onDeletar }: CardImovelProps) {
  // Função padrão para achar a foto de capa padrão
  const obterUrlCapa = (fotos?: Foto[]): string => {
    if (!fotos || fotos.length === 0) {
      return "https://firebasestorage.googleapis.com/v0/b/site-2749b.firebasestorage.app/o/imoveis%2FDefault%2FCard.webp?alt=media&token=c5388793-0f67-4e6d-9033-e095bf21d75f";
    }
    const capa = fotos.find(f => f.nome === 'capa');
    return capa ? capa.url : fotos[0].url;
  };

  // Estado local para permitir a troca dinâmica da imagem de exibição ao clicar na miniatura
  const [fotoPrincipal, setFotoPrincipal] = useState<string>(obterUrlCapa(imovel.fotos));

  // Efeito para sincronizar a foto caso a lista de fotos do imóvel mude remotamente
  useEffect(() => {
    setFotoPrincipal(obterUrlCapa(imovel.fotos));
  }, [imovel.fotos]);

  const totalFotos = imovel.fotos?.length || 0;
  const limiteMiniaturas = 4; // Quantidade máxima de miniaturas visíveis lado a lado

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
      <div>
        {/* FOTO PRINCIPAL */}
        <div className="relative h-40 bg-slate-950">
          <img 
            src={fotoPrincipal} 
            alt={imovel.nome} 
            className="w-full h-full object-cover opacity-80 transition-all duration-300" 
          />
          <span className={`absolute top-3 left-3 px-2 py-0.5 text-xs font-bold uppercase rounded-md shadow-md ${imovel.ativo ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : imovel.tipo === 'venda' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
            {imovel.ativo ? '🟢 Disponível' : imovel.tipo === 'venda' ? '🤝 Vendido' : '🔑 Alugado'}
          </span>
        </div>

        {/* CAROUSEL / FILEIRA DE MINIATURAS */}
        {totalFotos > 1 && (
          <div className="flex items-center gap-1.5 px-4 pt-3 overflow-x-auto scrollbar-none">
            {imovel.fotos?.slice(0, limiteMiniaturas).map((foto, index) => {
              const estaSelecionada = fotoPrincipal === foto.url;
              const ehOUltimoSlot = index === limiteMiniaturas - 1;
              const fotosRestantes = totalFotos - limiteMiniaturas;

              return (
                <div 
                  key={index} 
                  onClick={() => setFotoPrincipal(foto.url)}
                  className={`relative w-10 h-10 rounded-md overflow-hidden border cursor-pointer flex-shrink-0 transition-all ${
                    estaSelecionada ? 'border-emerald-500 scale-105 shadow-md' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={foto.url} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
                  
                  {/* Overlay de "+ X fotos" na última miniatura caso ultrapasse o limite */}
                  {ehOUltimoSlot && fotosRestantes > 0 && (
                    <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center pointer-events-none">
                      <span className="text-[10px] font-bold text-white">+{fotosRestantes}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* CONTEÚDO E INFORMAÇÕES */}
        <div className="p-4">
          <span className="text-xs font-medium text-emerald-400">📍 {imovel.bairro}, {imovel.cidade}</span>
          <h3 className="text-base font-bold text-white tracking-tight mt-0.5 line-clamp-1">{imovel.nome}</h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{imovel.descricao}</p>
          <p className="text-xs text-slate-500 mt-1">Terreno: {imovel.areaTerreno} m²</p>
          <span className="text-sm font-extrabold text-slate-300 block mt-2">
            {Number(imovel.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            {imovel.tipo === 'aluguel' && '/mês'}
          </span>
        </div>
      </div>

      {/* AÇÕES (BOTÕES) */}
      <div className="p-4 bg-slate-950/40 border-t border-slate-800/60 flex flex-col gap-2">
        <div className="flex gap-2">
          {!imovel.ativo && imovel.id && (
            <button onClick={() => onAlternarDisponibilidade(imovel.id!, true)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium py-1.5 px-2 rounded transition cursor-pointer">
              Liberar Imóvel
            </button>
          )}
          {imovel.ativo && imovel.id && (
            <button onClick={() => onAlternarDisponibilidade(imovel.id!, false, imovel.tipo)} className={`flex-1 text-xs font-semibold py-1.5 px-2 rounded transition cursor-pointer ${imovel.tipo === 'venda' ? 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/20' : 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/20'}`}>
              {imovel.tipo === 'venda' ? 'Marcar como Vendido' : 'Marcar como Alugado'}
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEditar(imovel)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-1.5 rounded transition cursor-pointer border border-slate-700">✏️ Editar</button>
          <button onClick={() => onDeletar(imovel.id!)} className="flex-1 bg-red-950/30 hover:bg-red-900/40 text-red-400 text-xs font-medium py-1.5 rounded transition cursor-pointer border border-red-900/30">🗑️ Excluir</button>
        </div>
      </div>
    </div>
  );
}