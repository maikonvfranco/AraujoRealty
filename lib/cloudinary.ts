import { auth } from "@/app/firebase/config"; 

type Foto = { url: string; path: string };

export async function apagarDoCloudinary(fotos: Foto[]) {

  const publicIds = fotos
    .filter((f) => f.url.includes("res.cloudinary.com"))
    .map((f) => f.path);

  if (publicIds.length === 0) return;

  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const resposta = await fetch("/api/cloudinary/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ publicIds }),
  });

  if (!resposta.ok) throw new Error("Falha ao apagar imagens no Cloudinary.");
}

export async function uploadParaCloudinary(arquivo: File, pasta?: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !preset) {
    throw new Error("Variáveis do Cloudinary não configuradas.");
  }

  const formData = new FormData();
  formData.append("file", arquivo);
  formData.append("upload_preset", preset);
  if (pasta) formData.append("folder", pasta);

  const resposta = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!resposta.ok) {
    const erro = await resposta.text();
    throw new Error(`Falha no upload (${resposta.status}): ${erro}`);
  }

  const dados = await resposta.json();
  return { url: String(dados.secure_url), path: String(dados.public_id) };
}