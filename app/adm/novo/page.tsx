"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, storage } from '../../firebase/config'; 
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Imovel } from '../../types/imoveis'; 
import ImovelForm from "@/app/adm/components/ImovelForm";
import imageCompression from 'browser-image-compression';
import { toast } from 'react-toastify';

export default function NovoImovelPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleCriarImovelEUpload = async (dados: Omit<Imovel, 'id'> | Imovel, arquivos: File[]) => {
    // 2. Criar um ID de toast persistente para podermos atualizá-lo durante o fluxo
    const idToast = toast.loading("Iniciando o cadastro do imóvel...");
    
    try {
      setSubmitting(true);
      
      // PASSO 1: Criar o documento bruto inicial
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
      const idGerado = docRef.id;

      // PASSO 2: Comprimir, Converter para WebP e fazer Upload
      const novasFotosMapeadas: { url: string; path: string }[] = [];
      
      if (arquivos.length > 0) {
        const options = {
          maxSizeMB: 1,            
          maxWidthOrHeight: 1920,  
          useWebWorker: true,      
          fileType: 'image/webp'   
        };
        
        for (let i = 0; i < arquivos.length; i++) {
          const arquivo = arquivos[i];
          
          // Atualiza o toast notificando qual foto está sendo processada
          toast.update(idToast, { 
            render: `2/3 - Otimizando e enviando foto ${i + 1} de ${arquivos.length}...` 
          });

          try {
            const arquivoComprimidoBlob = await imageCompression(arquivo, options);
            const novoNome = arquivo.name.substring(0, arquivo.name.lastIndexOf('.')) + '.webp';
            const arquivoWebP = new File([arquivoComprimidoBlob], novoNome, { type: 'image/webp' });

            const nomeUnico = `${Date.now()}_${arquivoWebP.name}`;
            const caminhoStorage = `imoveis/${idGerado}/${nomeUnico}`;
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
            const caminhoStorage = `imoveis/${idGerado}/${nomeUnico}`;
            const storageRef = ref(storage, caminhoStorage);
            const snapshot = await uploadBytes(storageRef, arquivo);
            const urlPublica = await getDownloadURL(snapshot.ref);
            
            novasFotosMapeadas.push({ url: String(urlPublica), path: String(caminhoStorage) });
          }
        }
      }

      // PASSO 3: Atualizar o documento final
      toast.update(idToast, { render: "3/3 - Finalizando salvamento..." });
      const listaFotosFinal = [...fotosIniciais, ...novasFotosMapeadas];
      
      const imovelCriadoRef = doc(db, 'imoveis', idGerado);
      await updateDoc(imovelCriadoRef, {
        fotos: listaFotosFinal 
      });

      // 3. Sucesso! Transforma o loading em um toast verde de sucesso
      toast.update(idToast, { 
        render: "Imóvel cadastrado com sucesso absoluto!", 
        type: "success", 
        isLoading: false,
        autoClose: 3000
      });

      router.push('/adm'); 
      router.refresh();
    } catch (error) {
      console.error("Erro no fluxo de cadastro:", error);
      
      // 4. Erro! Transforma o loading em um toast vermelho de erro
      toast.update(idToast, { 
        render: "Houve um erro crítico ao salvar o imóvel.", 
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