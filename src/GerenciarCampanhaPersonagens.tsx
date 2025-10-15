import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { useJogadorStore } from "./context/AuthContext";
import type { PersonagemType } from "./utils/PersonagemType";

type CampanhaDetailsType = {
  id: number;
  nome: string;
  personagens: { personagem: PersonagemType }[];
};

const apiUrl = import.meta.env.VITE_API_URL;

export default function GerenciarCampanhaPersonagens() {
  const { id: campanhaId } = useParams();
  const { token } = useJogadorStore();

  const [campanha, setCampanha] = useState<CampanhaDetailsType | null>(null);
  const [allPersonagens, setAllPersonagens] = useState<PersonagemType[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    if (!token || !campanhaId) return;
    setLoading(true);
    try {
      // Fetch campaign details (including assigned characters)
      const campResponse = await fetch(`${apiUrl}/campanhas/${campanhaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!campResponse.ok) throw new Error("Falha ao carregar dados da campanha.");
      const campData = await campResponse.json();
      setCampanha(campData);

      // Fetch all characters
      const persResponse = await fetch(`${apiUrl}/personagens`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!persResponse.ok) throw new Error("Falha ao carregar personagens.");
      const persData = await persResponse.json();
      setAllPersonagens(persData);

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [token, campanhaId]);

  const handleAddPersonagem = async (personagemId: number) => {
    try {
      const response = await fetch(`${apiUrl}/campanhas/${campanhaId}/personagens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ personagem_id: personagemId }),
      });
      if (!response.ok) throw new Error("Falha ao adicionar personagem.");
      toast.success("Personagem adicionado!");
      fetchData(); // Refresh data
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao adicionar");
    }
  };

  const handleRemovePersonagem = async (personagemId: number) => {
    try {
      const response = await fetch(`${apiUrl}/campanhas/${campanhaId}/personagens/${personagemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Falha ao remover personagem.");
      toast.success("Personagem removido!");
      fetchData(); // Refresh data
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao remover");
    }
  };

  const personagensNaCampanhaIds = campanha?.personagens.map(p => p.personagem.id) || [];
  const personagensDisponiveis = allPersonagens.filter(p => !personagensNaCampanhaIds.includes(p.id));

  if (loading) return <p className="text-center text-white mt-8">Carregando...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-6 text-white">
      <h1 className="text-3xl font-bold mb-2">Gerenciar Personagens</h1>
      <h2 className="text-xl text-yellow-400 mb-6">{campanha?.nome}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Coluna de Personagens na Campanha */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Na Campanha</h3>
          <div className="bg-gray-800 p-4 rounded-lg space-y-3">
            {campanha?.personagens && campanha.personagens.length > 0 ? (
              campanha.personagens.map(({ personagem }) => (
                <div key={personagem.id} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                  <span>{personagem.nome}</span>
                  <button onClick={() => handleRemovePersonagem(personagem.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs">Remover</button>
                </div>
              ))
            ) : (
              <p className="text-gray-400">Nenhum personagem nesta campanha.</p>
            )}
          </div>
        </div>

        {/* Coluna de Personagens Disponíveis */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Disponíveis</h3>
          <div className="bg-gray-800 p-4 rounded-lg space-y-3">
            {personagensDisponiveis.length > 0 ? (
              personagensDisponiveis.map(personagem => (
                <div key={personagem.id} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                  <span>{personagem.nome}</span>
                  <button onClick={() => handleAddPersonagem(personagem.id)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs">Adicionar</button>
                </div>
              ))
            ) : (
              <p className="text-gray-400">Nenhum personagem disponível.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
