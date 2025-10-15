import type { PersonagemType } from "./PersonagemType";

export type CampanhaType = {
  id: number;
  nome: string;
  descricao: string | null;
  mestre_do_jogo: string | null;
  data_inicio: string | null;
  sistema: { nome: string };
  personagens: { personagem: PersonagemType }[];
};