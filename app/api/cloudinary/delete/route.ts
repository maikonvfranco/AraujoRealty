import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Chaves públicas que o Google usa para assinar os tokens do Firebase
const JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
  )
);

async function tokenValido(token: string) {
  console.log("projectId lido:", JSON.stringify(projectId));
  try {
    await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });
    return true;
  } catch (e) {
    console.error("Token do Firebase rejeitado:", e);
    return false;
  }
}

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !(await tokenValido(token))) {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  }

  const { publicIds } = await req.json();
  if (
    !Array.isArray(publicIds) ||
    publicIds.length === 0 ||
    !publicIds.every((id) => typeof id === "string")
  ) {
    return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 });
  }

  try {
    await cloudinary.api.delete_resources(publicIds, { resource_type: "image" });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erro do Cloudinary:", e);
    return NextResponse.json({ erro: "Falha no Cloudinary" }, { status: 500 });
  }
}