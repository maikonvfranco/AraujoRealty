"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Imovel } from '../../types/imoveis';
import ImovelForm from "@/app/adm/components/ImovelForm";
import imageCompression from 'browser-image-compression';
import { toast } from 'react-toastify';
import { uploadParaCloudinary, apagarDoCloudinary } from '@/lib/cloudinary';

export default function NovoImovelPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleCriarImovelEUpload = async (dados: Omit<Imovel, 'id'> | Imovel, arquivos: File[]) => {
    const idToast = toast.loading("Iniciando o cadastro do imóvel...");

    let idGerado: string | null = null;
    const novasFotosMapeadas: { url: string; path: string }[] = [];

    try {
      setSubmitting(true);

      // PASSO 1: Criar o documento inicial
      toast.update(idToast, { render: "1/3 - Criando registro no banco de dados..." });

      const fotosIniciais = dados.fotos || [];
      const dadosParaSalvar = {
        nome: dados.nome,
        descricao: dados.descricao,
        cidade: dados.cidade,
        bairro: dados.bairro,
        tipo: dados.tipo,
        ativo: dados.ativo,
        areaTerreno: dados.areaTerreno,
        valor: dados.valor,
        fotos: fotosIniciais
      };

      const docRef = await addDoc(collection(db, 'imoveis'), dadosParaSalvar);
      idGerado = docRef.id;

      // PASSO 2: Comprimir, converter para WebP e enviar ao Cloudinary
      if (arquivos.length > 0) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: 'image/webp'
        };

        const pasta = `imoveis/${idGerado}`;

        for (let i = 0; i < arquivos.length; i++) {
          const arquivo = arquivos[i];

          toast.update(idToast, {
            render: `2/3 - Otimizando e enviando foto ${i + 1} de ${arquivos.length}...`
          });

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

      // PASSO 3: Salvar a lista final de fotos
      toast.update(idToast, { render: "3/3 - Finalizando salvamento..." });
      const listaFotosFinal = [...fotosIniciais, ...novasFotosMapeadas];

      await updateDoc(doc(db, 'imoveis', idGerado), {
        fotos: listaFotosFinal
      });

      toast.update(idToast, {
        render: "Imóvel cadastrado com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });

      router.push('/adm');
      router.refresh();
    } catch (error) {
      console.error("Erro no fluxo de cadastro:", error);

      // Desfaz o que foi criado, para não sobrar imóvel sem fotos nem foto órfã
      if (idGerado) {
        try {
          await deleteDoc(doc(db, 'imoveis', idGerado));
        } catch (e) {
          console.error("Não foi possível desfazer o cadastro:", e);
        }
      }
      if (novasFotosMapeadas.length > 0) {
        try {
          await apagarDoCloudinary(novasFotosMapeadas);
        } catch (e) {
          console.error("Não foi possível apagar fotos já enviadas:", e);
        }
      }

      toast.update(idToast, {
        render: "Houve um erro ao salvar o imóvel. Nada foi cadastrado, tente novamente.",
        type: "error",
        isLoading: false,
        autoClose: 4000
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#000a18] p-4 md:p-8 flex justify-center items-start">

      {submitting && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-40 pointer-events-auto" />
      )}

      <ImovelForm
        titulo="Cadastrar Novo Imóvel"
        onSubmit={handleCriarImovelEUpload}
        submitting={submitting}
        onCancelar={() => router.push('/adm')}
        dadosIniciais={null}
      />
    </div>
  );
}