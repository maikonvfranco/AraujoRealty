import Image from 'next/image';
import Card from '../../public/images/Card.webp'
export default function Inicio() {
  return (
    <section id="inicio" className="relative w-full h-[50vw] overflow-hidden bg-[#000c1a]">
      <Image
        src={Card}
        alt="Logo Araújo Imóveis e Família"
        fill
        priority
        sizes="100vw"
        className="object-contain "
      />
    </section>
  )
}