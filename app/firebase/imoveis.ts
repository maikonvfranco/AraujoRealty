import { collection, getDocs } from "firebase/firestore";
import { db } from "./config";
import { Imovel } from "../types/imoveis";

export async function getImoveis(): Promise<Imovel[]> {
  const snapshot = await getDocs(collection(db, "imoveis"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Imovel, "id">),
  }));
}