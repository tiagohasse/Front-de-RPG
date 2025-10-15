export type PersonagemType = {
    id: number;
    nome: string;
    raca: string | null;
    descricao: string | null;
    url_ficha_pdf: string | null;
    atributos: any;
    usuario_id: number;
    sistema_id: number;
    campanhas?: { campanha: { id: number; nome: string } }[];
}