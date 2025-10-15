import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useJogadorStore } from "./context/AuthContext";

const apiUrl = import.meta.env.VITE_API_URL;

type CampanhaType = {
  id: number;
  nome: string;
  descricao: string | null;
  mestre_do_jogo: string | null;
  sistema: { nome: string };
};

export default function Campanhas() {
  const [campanhas, setCampanhas] = useState<CampanhaType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { jogador, token } = useJogadorStore();

  async function buscaCampanhas() {
    try {
      const response = await fetch(`${apiUrl}/campanhas`);
      if (response.ok) {
        const data = await response.json();
        setCampanhas(Array.isArray(data) ? data : []);
      } else {
        setCampanhas([]);
        toast.error("Falha ao buscar campanhas.");
      }
    } catch (error) {
      toast.error("Erro de rede ao buscar campanhas.");
    }
  }

  useEffect(() => {
    buscaCampanhas();
  }, []);

  const excluirCampanha = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta campanha?")) {
      try {
        const response = await fetch(`${apiUrl}/campanhas/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Falha ao excluir a campanha.");
        toast.success("Campanha excluída com sucesso!");
        buscaCampanhas(); // Re-fetch the list
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro desconhecido.");
      }
    }
  };

  const filteredCampanhas = campanhas.filter(campanha =>
    campanha.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Gerenciar Campanhas de RPG</h1>
        {jogador?.tipo_usuario === "ADMIN" && (
          <Link
            to="/campanhas/criar"
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Criar Nova Campanha
          </Link>
        )}
      </div>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Buscar campanha..."
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          onClick={() => setSearchTerm("")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Exibir Todos
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampanhas.length > 0 ? (
          filteredCampanhas.map((campanha) => (
            <Link to={`/campanhas/${campanha.id}`} key={campanha.id} className="block p-6 bg-gray-800 border border-gray-700 rounded-lg shadow hover:bg-gray-700">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">{campanha.nome}</h5>
              <p className="font-normal text-gray-400 mb-1">Sistema: {campanha.sistema.nome}</p>
              {campanha.mestre_do_jogo && <p className="font-normal text-gray-400">Mestre: {campanha.mestre_do_jogo}</p>}
              {campanha.descricao && <p className="mt-4 text-sm text-gray-300">{campanha.descricao}</p>}
              {jogador?.tipo_usuario === "ADMIN" && (
                <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-700">
                  <Link to={`/campanhas/${campanha.id}/gerenciar-personagens`} onClick={(e) => e.stopPropagation()} className="font-medium text-green-500 hover:underline">Personagens</Link>
                  <Link to={`/campanhas/${campanha.id}/editar`} onClick={(e) => e.stopPropagation()} className="font-medium text-blue-500 hover:underline">Editar</Link>
                  <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); excluirCampanha(campanha.id); }} className="font-medium text-red-500 hover:underline">Excluir</button>
                </div>
              )}
            </Link>
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center">Nenhuma campanha encontrada.</p>
        )}
      </div>
    </div>
  );
}
