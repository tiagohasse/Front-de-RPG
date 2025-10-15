import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useJogadorStore } from "./context/AuthContext";
import type { PersonagemType } from "./utils/PersonagemType";
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_API_URL;

type SistemaType = {
  id: number;
  nome: string;
};

export default function FichaPersonagem() {
  const params = useParams();
  const navigate = useNavigate(); // 2. Inicializado o hook de navegação
  const { token, jogador } = useJogadorStore();

  const [personagem, setPersonagem] = useState<PersonagemType | null>(null);
  const [nomeSistema, setNomeSistema] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const buscaDados = async () => {
      try {
        const responsePersonagem = await fetch(`${apiUrl}/personagens/${params.personagemId}`);
        if (!responsePersonagem.ok) throw new Error("Personagem não encontrado.");
        const dadosPersonagem = await responsePersonagem.json();
        setPersonagem(dadosPersonagem);

        const responseSistemas = await fetch(`${apiUrl}/sistemas`);
        if (!responseSistemas.ok) throw new Error("Não foi possível carregar os sistemas.");
        const dadosSistemas: SistemaType[] = await responseSistemas.json();
        
        const sistemaEncontrado = dadosSistemas.find(s => s.id === dadosPersonagem.sistema_id);
        if (sistemaEncontrado) {
          setNomeSistema(sistemaEncontrado.nome);
        } else {
          setNomeSistema("Sistema não identificado");
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
        setPersonagem(null);
      } finally {
        setLoading(false);
      }
    };

    buscaDados();
  }, [params.personagemId]);

  const excluirPersonagem = async () => {
    if (!personagem) return;

    if (window.confirm(`Tem certeza que deseja excluir o personagem "${personagem.nome}"?`)) {
      try {
        const response = await fetch(`${apiUrl}/personagens/${personagem.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Falha ao excluir o personagem.");
        }

        toast.success("Personagem excluído com sucesso!");
        navigate("/");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
      }
    }
  };


  if (loading) {
    return <h2 className="text-center text-white text-2xl mt-8">Carregando ficha do personagem...</h2>;
  }
  
  if (error) {
    return <h2 className="text-center text-red-500 text-2xl mt-8">{error}</h2>;
  }
  
  if (!personagem) {
    return <h2 className="text-center text-white text-2xl mt-8">Nenhum personagem para exibir.</h2>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg text-white">
      <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-600">
          <div>
              <h1 className="text-4xl font-bold tracking-tight">{personagem.nome}</h1>
              {personagem.raca && (
                  <p className="text-xl text-gray-300 mt-1">{personagem.raca}</p>
              )}
          </div>
          {jogador && jogador.usuarioId === personagem.usuario_id && (
              <div className="flex items-center space-x-2">
              <Link to={`/personagem/${personagem.id}/editar`} className="text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                Editar
              </Link>
              <button onClick={excluirPersonagem} className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                Excluir
              </button>
            </div>
          )}
      </div>
      <div className="border-b border-gray-600 pb-4 mb-4">
        <h1 className="text-4xl font-bold tracking-tight">{personagem.nome}</h1>
        {personagem.raca && (
          <p className="text-xl text-gray-300 mt-1">{personagem.raca}</p>
        )}
      </div>

      {personagem.descricao && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-yellow-400">Descrição</h2>
          <p className="text-gray-300 whitespace-pre-wrap">{personagem.descricao}</p>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-yellow-400">Atributos</h2>
        <div className="bg-gray-900 p-4 rounded-lg">
          {personagem.atributos ? (
            <pre className="text-sm text-white whitespace-pre-wrap">
              <code>
                {JSON.stringify(personagem.atributos, null, 2)}
              </code>
            </pre>
          ) : (
            <p className="text-gray-400">Nenhum atributo definido.</p>
          )}
        </div>
      </div>

      {personagem.campanhas && personagem.campanhas.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-yellow-400">Campanhas</h2>
          <div className="flex flex-wrap gap-2">
            {personagem.campanhas.map((item) => (
              <Link to={`/campanhas/${item.campanha.id}`} key={item.campanha.id} className="bg-gray-700 text-gray-200 text-sm font-medium me-2 px-2.5 py-0.5 rounded hover:bg-gray-600">
                {item.campanha.nome}
              </Link>
            ))}
          </div>
        </div>
      )}
      
      <div className="text-center border-t border-gray-600 pt-4 mt-4 text-sm text-gray-400">
        <p>Sistema: {nomeSistema || `ID ${personagem.sistema_id}`}</p>
        {personagem.url_ficha_pdf && (
            <a href={personagem.url_ficha_pdf} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mt-2 inline-block">
                Ver Ficha em PDF
            </a>
        )}
      </div>
    </div>
  );
}