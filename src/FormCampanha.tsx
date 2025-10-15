import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useJogadorStore } from "./context/AuthContext";
import { useEffect, useState } from "react";

type Inputs = {
  nome: string;
  descricao: string;
  mestre_do_jogo: string;
  data_inicio: string;
  sistema_id: number;
};

const apiUrl = import.meta.env.VITE_API_URL;

type SistemaType = {
  id: number;
  nome: string;
};

export default function FormCampanha() {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useJogadorStore();
  const [sistemas, setSistemas] = useState<SistemaType[]>([]);

  const isEditing = Boolean(id);

  useEffect(() => {
    async function carregarDados() {
      try {
        // Carregar sistemas para o dropdown
        const responseSistemas = await fetch(`${apiUrl}/sistemas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (responseSistemas.ok) {
          setSistemas(await responseSistemas.json());
        }

        // Se estiver editando, carregar dados da campanha
        if (isEditing) {
          const responseCampanha = await fetch(`${apiUrl}/campanhas/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!responseCampanha.ok) throw new Error("Falha ao carregar dados da campanha.");
          const data = await responseCampanha.json();
          // Formata a data para o input type="date"
          const formattedData = {
            ...data,
            data_inicio: data.data_inicio ? new Date(data.data_inicio).toISOString().split('T')[0] : '',
          };
          reset(formattedData);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro desconhecido");
      }
    }

    if (token) {
      carregarDados();
    }
  }, [isEditing, id, token, reset]);

  async function onSubmit(data: Inputs) {
    const url = isEditing ? `${apiUrl}/campanhas/${id}` : `${apiUrl}/campanhas`;
    const method = isEditing ? "PUT" : "POST";

    const payload = {
        ...data,
        sistema_id: Number(data.sistema_id),
        data_inicio: data.data_inicio ? new Date(data.data_inicio) : null
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || "Falha ao salvar a campanha.");
      }

      toast.success(`Campanha ${isEditing ? 'atualizada' : 'criada'} com sucesso!`);
      navigate("/campanhas");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ocorreu um erro");
    }
  }

  return (
    <section className="bg-gray-900 text-white">
      <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
        <h2 className="mb-4 text-xl font-bold">{isEditing ? "Editar Campanha" : "Adicionar Nova Campanha"}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
            <div className="sm:col-span-2">
              <label htmlFor="nome" className="block mb-2 text-sm font-medium">Nome da Campanha</label>
              <input type="text" id="nome" className="bg-gray-700 border border-gray-600 text-sm rounded-lg block w-full p-2.5" required {...register("nome")} />
            </div>
            <div>
              <label htmlFor="sistema_id" className="block mb-2 text-sm font-medium">Sistema de RPG</label>
              <select id="sistema_id" className="bg-gray-700 border border-gray-600 text-sm rounded-lg block w-full p-2.5" required {...register("sistema_id")}>
                <option value="">Selecione um sistema</option>
                {sistemas.map(sistema => (
                  <option key={sistema.id} value={sistema.id}>{sistema.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="mestre_do_jogo" className="block mb-2 text-sm font-medium">Mestre do Jogo</label>
              <input type="text" id="mestre_do_jogo" className="bg-gray-700 border border-gray-600 text-sm rounded-lg block w-full p-2.5" {...register("mestre_do_jogo")} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="data_inicio" className="block mb-2 text-sm font-medium">Data de Início</label>
              <input type="date" id="data_inicio" className="bg-gray-700 border border-gray-600 text-sm rounded-lg block w-full p-2.5" {...register("data_inicio")} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="descricao" className="block mb-2 text-sm font-medium">Descrição</label>
              <textarea id="descricao" rows={6} className="block p-2.5 w-full text-sm bg-gray-700 rounded-lg border border-gray-600" {...register("descricao")}></textarea>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-6">
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              {isEditing ? "Salvar Alterações" : "Criar Campanha"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
