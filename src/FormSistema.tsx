import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useJogadorStore } from "./context/AuthContext";
import { useEffect } from "react";

type Inputs = {
  nome: string;
};

const apiUrl = import.meta.env.VITE_API_URL;

export default function FormSistema() {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useJogadorStore();

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && token) {
      async function carregarDados() {
        try {
          const response = await fetch(`${apiUrl}/sistemas`, { // Fetch all to find the one
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) throw new Error("Falha ao carregar dados do sistema.");
          const sistemas = await response.json();
          const sistemaAtual = sistemas.find((s: any) => s.id === Number(id));
          if (sistemaAtual) {
            reset(sistemaAtual);
          }
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Erro desconhecido");
        }
      }
      carregarDados();
    }
  }, [isEditing, id, token, reset]);

  async function onSubmit(data: Inputs) {
    const url = isEditing ? `${apiUrl}/sistemas/${id}` : `${apiUrl}/sistemas`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || "Falha ao salvar o sistema.");
      }

      toast.success(`Sistema ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
      navigate("/sistemas");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ocorreu um erro");
    }
  }

  return (
    <section className="bg-gray-900 text-white">
      <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
        <h2 className="mb-4 text-xl font-bold">{isEditing ? "Editar Sistema" : "Adicionar Novo Sistema"}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
            <div className="sm:col-span-2">
              <label htmlFor="nome" className="block mb-2 text-sm font-medium">Nome do Sistema</label>
              <input
                type="text"
                id="nome"
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5"
                required
                {...register("nome")}
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-6">
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              {isEditing ? "Salvar Alterações" : "Criar Sistema"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
