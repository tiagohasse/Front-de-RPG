import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useJogadorStore } from "./context/AuthContext";

const apiUrl = import.meta.env.VITE_API_URL;

type SistemaType = {
  id: number;
  nome: string;
};

export default function Sistemas() {
  const [sistemas, setSistemas] = useState<SistemaType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { jogador, token } = useJogadorStore();

  async function buscaSistemas() {
    try {
      const response = await fetch(`${apiUrl}/sistemas`);
      if (response.ok) {
        const data = await response.json();
        setSistemas(Array.isArray(data) ? data : []);
      } else {
        setSistemas([]);
        toast.error("Falha ao buscar sistemas.");
      }
    } catch (error) {
      toast.error("Erro de rede ao buscar sistemas.");
    }
  }

  useEffect(() => {
    buscaSistemas();
  }, []);

  const excluirSistema = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este sistema?")) {
      try {
        const response = await fetch(`${apiUrl}/sistemas/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Falha ao excluir o sistema.");
        toast.success("Sistema excluído com sucesso!");
        buscaSistemas();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro desconhecido.");
      }
    }
  };

  const filteredSistemas = sistemas.filter(sistema =>
    sistema.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Gerenciar Sistemas de RPG</h1>
        {jogador?.tipo_usuario === "ADMIN" && (
          <Link
            to="/sistemas/criar"
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Criar Novo Sistema
          </Link>
        )}
      </div>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Buscar sistema..."
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

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs uppercase bg-gray-700 text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Nome do Sistema</th>
              {jogador?.tipo_usuario === "ADMIN" && (
                <th scope="col" className="px-6 py-3 text-right">Ações</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredSistemas.length > 0 ? (
              filteredSistemas.map((sistema) => (
                <tr key={sistema.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                    {sistema.id}
                  </th>
                  <td className="px-6 py-4">{sistema.nome}</td>
                  {jogador?.tipo_usuario === "ADMIN" && (
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link to={`/sistemas/${sistema.id}/editar`} className="font-medium text-blue-500 hover:underline">Editar</Link>
                      <button onClick={() => excluirSistema(sistema.id)} className="font-medium text-red-500 hover:underline">Excluir</button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={jogador?.tipo_usuario === "ADMIN" ? 3 : 2} className="px-6 py-4 text-center">
                  Nenhum sistema encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
