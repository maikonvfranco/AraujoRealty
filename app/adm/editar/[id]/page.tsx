"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Imovel } from '../../../types/imoveis';
import ImovelForm from "@/app/adm/components/ImovelForm";
import imageCompression from 'browser-image-compression';
import { toast } from 'react-toastify';
import { uploadParaCloudinary, apagarDoCloudinary } from '@/lib/cloudinary';

interface EditarImovelPageProps {
  params: Promise<{ id: string }>;
}

export default function EditarImovelPage({ params }: EditarImovelPageProps) {
  const router = useRouter();

  const resolvedParams = use(params);
  const idImovel = resolvedParams.id;

  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [loadingDados, setLoadingDados] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const buscarImovel = async () => {
      try {
        const docRef = doc(db, 'imoveis', idImovel);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setImovel({ id: docSnap.id, ...docSnap.data() } as Imovel);
        } else {
          toast.error("Imóvel não encontrado!");
          router.push('/adm');
        }
      } catch (error) {
        console.error("Erro ao buscar imóvel:", error);
        toast.error("Erro ao carregar dados do imóvel.");
      } finally {
        setLoadingDados(false);
      }
    };

    buscarImovel();
  }, [idImovel, router]);

  const handleEditarImovel = async (dadosAtualizados: Omit<Imovel, 'id'> | Imovel, novosArquivos: File[]) => {
    const idToast = toast.loading("Atualizando imóvel...");

    try {
      setSubmitting(true);

      // Fotos que sobraram no formulário (as que o usuário não removeu com ✕)
      const fotosMantidas = dadosAtualizados.fotos || [];

      // Fotos que existiam no banco e não estão mais no formulário
      const fotosRemovidas = (imovel?.fotos || []).filter(
        (antiga) => !fotosMantidas.some((m) => m.path === antiga.path)
      );

      const novasFotosMapeadas: { url: string; path: string }[] = [];

      if (novosArquivos.length > 0) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: 'image/webp'
        };

        for (let i = 0; i < novosArquivos.length; i++) {
          const arquivo = novosArquivos[i];
          toast.update(idToast, {
            render: `1/3 - Otimizando e enviando nova foto ${i + 1} de ${novosArquivos.length}...`
          });

          const pasta = `imoveis/${idImovel}`;

          try {
            const arquivoComprimidoBlob = await imageCompression(arquivo, options);
            const novoNome = arquivo.name.substring(0, arquivo.name.lastIndexOf('.')) + '.webp';
            const arquivoWebP = new File([arquivoComprimidoBlob], novoNome, { type: 'image/webp' });

            novasFotosMapeadas.push(await uploadParaCloudinary(arquivoWebP, pasta));
          } catch (compError) {
            console.error(`Erro ao converter, enviando original...`, compError);
            novasFotosMapeadas.push(await uploadParaCloudinary(arquivo, pasta));
          }
        }
      }

      toast.update(idToast, { render: "2/3 - Salvando alterações no banco..." });

      const listaFotosFinal = [...fotosMantidas, ...novasFotosMapeadas];

      const imovelRef = doc(db, 'imoveis', idImovel);
      await updateDoc(imovelRef, {
        nome: dadosAtualizados.nome,
        descricao: dadosAtualizados.descricao,
        cidade: dadosAtualizados.cidade,
        bairro: dadosAtualizados.bairro,
        tipo: dadosAtualizados.tipo,
        ativo: dadosAtualizados.ativo,
        areaTerreno: dadosAtualizados.areaTerreno,
        valor: dadosAtualizados.valor,
        fotos: listaFotosFinal
      });

      // Só apaga no Cloudinary depois de salvar no Firestore.
      // Se a limpeza falhar, o imóvel já está salvo e só sobra uma foto órfã.
      if (fotosRemovidas.length > 0) {
        toast.update(idToast, { render: "3/3 - Removendo fotos antigas..." });
        try {
          await apagarDoCloudinary(fotosRemovidas);
        } catch (delError) {
          console.error("Não foi possível apagar fotos no Cloudinary:", delError);
        }
      }

      toast.update(idToast, {
        render: "Imóvel atualizado com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });

      router.push('/adm');
      router.refresh();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast.update(idToast, {
        render: "Erro ao atualizar o imóvel.",
        type: "error",
        isLoading: false,
        autoClose: 4000
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDados) {
    return (
      <div className="min-h-screen bg-[#000a18] flex items-center justify-center">
        <p className="text-white animate-pulse">Carregando dados do imóvel...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#000a18] p-4 md:p-8 flex justify-center items-start">
      {submitting && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-40 pointer-events-auto" />
      )}

      <ImovelForm
        titulo="Editar Imóvel"
        onSubmit={handleEditarImovel}
        submitting={submitting}
        onCancelar={() => router.push('/adm')}
        dadosIniciais={imovel}
      />
    </div>
  );
}