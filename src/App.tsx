import { CardPersonagem } from "./components/CardPersonagem";
import type { PersonagemType } from "./utils/PersonagemType";
import { useEffect, useState } from "react";
import { useJogadorStore } from "./context/AuthContext";
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

export default function App() {
  const [personagens, setPersonagens] = useState<PersonagemType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { jogador } = useJogadorStore();

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${apiUrl}/personagens`);
      
      if (response.ok) {
          const dados = await response.json();
          setPersonagens(Array.isArray(dados) ? dados : []);
      } else {
          setPersonagens([]);
      }
    }
    buscaDados();
  }, []);

  const filteredPersonagens = personagens.filter(personagem =>
    personagem.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const listaPersonagens = filteredPersonagens.map((personagem) => (
    <CardPersonagem data={personagem} key={personagem.id} />
  ));

  return (
    <div className="max-w-7xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-5xl dark:text-white">
          Personagens em Destaque
        </h1>
        {jogador && jogador.usuarioId && (
          <Link
            to="/personagem/criar"
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Criar Novo Personagem
          </Link>
        )}
      </div>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Buscar personagem..."
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

      {filteredPersonagens.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listaPersonagens}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          Nenhum personagem encontrado no reino.
        </p>
      )}
    </div>
  );
}