"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { db, storage } from '../../../firebase/config'; // Ajuste a quantidade de ../ conforme sua estrutura
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Imovel } from '../../../types/imoveis'; 
import ImovelForm from "@/app/adm/components/ImovelForm";
import imageCompression from 'browser-image-compression';
import { toast } from 'react-toastify';

interface EditarImovelPageProps {
  params: Promise<{ id: string }>;
}

export default function EditarImovelPage({ params }: EditarImovelPageProps) {
  const router = useRouter();
  
  // Resolve o ID da URL de forma segura no Next.js
  const resolvedParams = use(params);
  const idImovel = resolvedParams.id;

  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [loadingDados, setLoadingDados] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Carrega os dados atuais do imóvel ao abrir a página
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

      // 1. Manter as fotos que já existiam e que não foram deletadas no formulário
      const fotosExistentes = imovel?.fotos || [];
      const novasFotosMapeadas: { url: string; path: string }[] = [];

      // 2. Processar e converter as NOVAS fotos, se houver
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
            render: `1/2 - Otimizando e enviando nova foto ${i + 1} de ${novosArquivos.length}...` 
          });

          try {
            const arquivoComprimidoBlob = await imageCompression(arquivo, options);
            const novoNome = arquivo.name.substring(0, arquivo.name.lastIndexOf('.')) + '.webp';
            const arquivoWebP = new File([arquivoComprimidoBlob], novoNome, { type: 'image/webp' });

            const nomeUnico = `${Date.now()}_${arquivoWebP.name}`;
            const caminhoStorage = `imoveis/${idImovel}/${nomeUnico}`;
            const storageRef = ref(storage, caminhoStorage);
            
            const snapshot = await uploadBytes(storageRef, arquivoWebP);
            const urlPublica = await getDownloadURL(snapshot.ref);
            
            novasFotosMapeadas.push({
              url: String(urlPublica),
              path: String(caminhoStorage)
            });
          } catch (compError) {
            console.error(`Erro ao converter, enviando original...`, compError);
            const nomeUnico = `${Date.now()}_${arquivo.name}`;
            const caminhoStorage = `imoveis/${idImovel}/${nomeUnico}`;
            const storageRef = ref(storage, caminhoStorage);
            const snapshot = await uploadBytes(storageRef, arquivo);
            const urlPublica = await getDownloadURL(snapshot.ref);
            
            novasFotosMapeadas.push({ url: String(urlPublica), path: String(caminhoStorage) });
          }
        }
      }

      toast.update(idToast, { render: "2/2 - Salvando alterações no banco..." });

      // Unifica as fotos antigas com as novas que acabaram de subir
      const listaFotosFinal = [...fotosExistentes, ...novasFotosMapeadas];

      // 3. Atualizar o documento no Firestore
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
        fotos: listaFotosFinal // Array atualizado
      });

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
        dadosIniciais={imovel} // Passa os dados preenchidos para o formulário
      />
    </div>
  );
}