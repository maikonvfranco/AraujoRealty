import Image from 'next/image';
export default function Inicio() {
    return (
              <section id="inicio" className="relative w-full h-[50vw] overflow-hidden bg-[#000c1a]">
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/site-2749b.firebasestorage.app/o/imoveis%2FDefault%2FCard.webp?alt=media&token=c5388793-0f67-4e6d-9033-e095bf21d75f"
                  alt="Logo Araújo Imóveis e Família"
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain "
                />
              </section>
    )}