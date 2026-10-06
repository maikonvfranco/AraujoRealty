export interface Foto {
    nome: string;
    ordem: number;
    path: string;
    url: string;
  }

  export interface Imovel {
    id: string;
    nome: string;
    cidade: string;
    bairro: string;
    tipo: "venda" | "aluguel";
    valor: number;
    descricao: string;
    fotos: Foto[];
    ativo: boolean;
    areaTerreno: number;
  }