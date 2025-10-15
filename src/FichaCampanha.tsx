import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useJogadorStore } from "./context/AuthContext";
import type { CampanhaType } from "./utils/CampanhaType";
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_API_URL;

export default function FichaCampanha() {
  const params = useParams();
  const { token } = useJogadorStore();

  const [campanha, setCampanha] = useState<CampanhaType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token && params.id) {
      setLoading(true);
      setError(null);

      const buscaDados = async () => {
        try {
          const response = await fetch(`${apiUrl}/campanhas/${params.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!response.ok) throw new Error("Campanha não encontrada.");
          const dados = await response.json();
          setCampanha(dados);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
          setCampanha(null);
        } finally {
          setLoading(false);
        }
      };

      buscaDados();
    } else {
      setLoading(false);
      if (!token) setError("Você precisa estar logado para ver os detalhes de uma campanha.");
    }
  }, [token, params.id]);

  if (loading) {
    return <h2 className="text-center text-white text-2xl mt-8">Carregando detalhes da campanha...</h2>;
  }
  
  if (error) {
    return <h2 className="text-center text-red-500 text-2xl mt-8">{error}</h2>;
  }
  
  if (!campanha) {
    return <h2 className="text-center text-white text-2xl mt-8">Nenhuma campanha para exibir.</h2>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg text-white">
      <div className="border-b border-gray-600 pb-4 mb-4">
        <h1 className="text-4xl font-bold tracking-tight">{campanha.nome}</h1>
        <p className="text-xl text-gray-300 mt-1">Sistema: {campanha.sistema.nome}</p>
        {campanha.mestre_do_jogo && <p className="text-lg text-gray-400">Mestre: {campanha.mestre_do_jogo}</p>}
      </div>

      {campanha.descricao && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-yellow-400">Descrição</h2>
          <p className="text-gray-300 whitespace-pre-wrap">{campanha.descricao}</p>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-yellow-400">Personagens na Campanha</h2>
        {campanha.personagens && campanha.personagens.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campanha.personagens.map(({ personagem }) => (
              <Link to={`/personagem/${personagem.id}`} key={personagem.id} className="block p-4 bg-gray-700 border border-gray-600 rounded-lg shadow hover:bg-gray-600">
                <h5 className="text-lg font-bold tracking-tight text-white">{personagem.nome}</h5>
                {personagem.raca && <p className="font-normal text-gray-400">{personagem.raca}</p>}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Nenhum personagem nesta campanha ainda.</p>
        )}
      </div>
    </div>
  );
}
