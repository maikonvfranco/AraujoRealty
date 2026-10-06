"use client";

import { useState, FormEvent, useEffect, ChangeEvent } from 'react';
import { Imovel } from '../../types/imoveis';
import Image from 'next/image';

interface ImovelFormProps {
  dadosIniciais?: Imovel | null;
  // Agora o onSubmit envia os dados do form E a lista de arquivos de imagem selecionados
  onSubmit: (dados: Omit<Imovel, 'id'> | Imovel, arquivos: File[]) => Promise<void>;
  submitting: boolean;
  onCancelar: () => void;
  titulo: string;
}

export default function ImovelForm({ dadosIniciais, onSubmit, submitting, onCancelar, titulo }: ImovelFormProps) {
  const [arquivosSelecionados, setArquivosSelecionados] = useState<File[]>([]);
  const [previewsTemporarios, setPreviewsTemporarios] = useState<string[]>([]);

  const [form, setForm] = useState<Omit<Imovel, 'id'> | Imovel>({
    nome: '',
    descricao: '',
    cidade: '',
    bairro: '',
    tipo: 'venda',
    ativo: true,
    areaTerreno: 0,
    valor: 0,
    fotos: [] // Armazena URLs de fotos já existentes (em caso de edição)
  });

  useEffect(() => {
    if (dadosIniciais) {
      setForm(dadosIniciais);
    }
  }, [dadosIniciais]);

  // --- SELECIONAR FOTOS LOCALMENTE ---
  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const arquivos = Array.from(e.target.files);

    // Cria URLs blob temporárias para mostrar o preview na tela instantaneamente
    const novosPreviews = arquivos.map(arquivo => URL.createObjectURL(arquivo));

    setArquivosSelecionados(prev => [...prev, ...arquivos]);
    setPreviewsTemporarios(prev => [...prev, ...novosPreviews]);
  };

  // --- REMOVER FOTO DA LISTA LOCAL ---
  const handleRemoverFotoLocal = (index: number) => {
    // Revoga a URL do blob da memória para evitar memory leak
    URL.revokeObjectURL(previewsTemporarios[index]);

    setArquivosSelecionados(prev => prev.filter((_, i) => i !== index));
    setPreviewsTemporarios(prev => prev.filter((_, i) => i !== index));
  };

  // --- REMOVER FOTO EXISTENTE (Para o caso de Edição) ---
  const handleRemoverFotoExistente = (fotoParaRemover: { url: string; path: string }) => {
    setForm(prev => ({
      ...prev,
      fotos: prev.fotos.filter(foto => foto.path !== fotoParaRemover.path)
    }));
  };

  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.cidade || !form.bairro || form.valor <= 0) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    // Envia os dados do formulário e os arquivos binários para a página tratar
    onSubmit(form, arquivosSelecionados);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 md:p-8 shadow-2xl">

      <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{titulo}</h1>
          <p className="text-xs text-slate-400 mt-1">Escolha as fotos locais. Elas serão salvas junto com o imóvel.</p>
        </div>
        <button type="button" onClick={onCancelar} className="text-slate-400 hover:text-white text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition">
          Voltar
        </button>
      </div>

      <form onSubmit={handleSubmitForm} className="space-y-5">

        {/* ZONA DE PICKER DE FOTOS */}
        <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-4">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Fotos do Imóvel</label>

          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-800 border-dashed rounded-lg cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition hover:border-emerald-500">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                <p className="mb-2 text-sm text-slate-400">📸 Selecionar fotos do computador/celular</p>
                <p className="text-xs text-slate-500">Múltiplas fotos permitidas</p>
              </div>
              <input type="file" multiple accept="image/*" onChange={handleFotoChange} className="hidden" />
            </label>
          </div>

          {/* PREVIEWS */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
            {/* Fotos antigas salvas no banco (Objetos com url e path) */}
            {form.fotos?.map((foto: any, index) => (
              <div key={`existente-${index}`} className="relative aspect-square rounded-lg overflow-hidden border border-emerald-500/30 group bg-slate-900">
                <Image
                  src={foto.url} // Acessa a string da URL dentro do Map
                  alt="Foto existente"
                  fill
                  className="object-cover opacity-80"
                />
                <button
                  type="button"
                  onClick={() => handleRemoverFotoExistente(foto)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow hover:bg-red-700"
                >
                  ✕
                </button>
                <span className="absolute bottom-1 left-1 bg-emerald-950/90 text-[10px] text-emerald-400 px-1 rounded border border-emerald-500/30">Salva</span>
              </div>
            ))}

            {/* Novas fotos selecionadas pelo picker local (Blobs temporários) */}
            {previewsTemporarios.map((urlBlob, index) => (
              <div key={`nova-${index}`} className="relative aspect-square rounded-lg overflow-hidden border border-dashed border-slate-700 group bg-slate-900">
                <Image src={urlBlob} alt="Preview nova foto" fill className="object-cover" />
                <button type="button" onClick={() => handleRemoverFotoLocal(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow hover:bg-red-700">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* DEMAIS CAMPOS (NOME, DESCRIÇÃO, ETC.) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5 tracking-wider">Título do Imóvel *</label>
          <input type="text" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5 tracking-wider">Descrição</label>
          <textarea rows={4} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none transition" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5 tracking-wider">Cidade *</label>
            <input type="text" required value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5 tracking-wider">Bairro *</label>
            <input type="text" required value={form.bairro} onChange={(e) => setForm({ ...form, bairro: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5 tracking-wider">Tipo de Negócio *</label>
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as 'venda' | 'aluguel' })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition">
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5 tracking-wider">Área do Terreno (m²) *</label>
            <input type="number" required min="0" value={form.areaTerreno === 0 ? '' : form.areaTerreno} onChange={(e) => setForm({ ...form, areaTerreno: e.target.value === '' ? 0 : Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5 tracking-wider">Valor (R$) *</label>
          <input type="number" required min="0" step="0.01" value={form.valor === 0 ? '' : form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value === '' ? 0 : Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition" />
        </div>

        <div className="flex items-center gap-2 py-2">
          <input type="checkbox" id="ativo" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} className="w-4 h-4 accent-emerald-500 rounded cursor-pointer" />
          <label htmlFor="ativo" className="text-sm text-slate-300 cursor-pointer select-none">Imóvel ativo (visível no catálogo público)</label>
        </div>

        <div className="flex justify-end gap-3 pt-5 border-t border-slate-800 mt-6">
          <button type="button" onClick={onCancelar} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold transition">Cancelar</button>
          <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50">
            {submitting ? 'Processando e Salvando...' : 'Salvar Imóvel'}
          </button>
        </div>
      </form>
    </div>
  );
}