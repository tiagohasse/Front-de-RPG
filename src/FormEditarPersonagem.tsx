import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useJogadorStore } from "./context/AuthContext";
import { useEffect } from "react";

type Inputs = {
    nome: string;
    raca: string;
    descricao: string;
    sistema_id: number;
    atributosJSON: string;
};

const apiUrl = import.meta.env.VITE_API_URL;

export default function FormEditarPersonagem() {
    const { register, handleSubmit, reset } = useForm<Inputs>();
    const navigate = useNavigate();
    const params = useParams(); // Para pegar o ID da URL
    const { token } = useJogadorStore();
    const personagemId = params.personagemId;

    // Efeito para carregar os dados do personagem quando a página abrir
    useEffect(() => {
        async function carregarDados() {
            try {
                const response = await fetch(`${apiUrl}/personagens/${personagemId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error("Falha ao carregar dados do personagem.");

                const data = await response.json();
                
                // Preenche o formulário com os dados existentes
                reset({
                    ...data,
                    atributosJSON: data.atributos ? JSON.stringify(data.atributos, null, 2) : ''
                });

            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Erro desconhecido");
            }
        }
        if (token && personagemId) {
            carregarDados();
        }
    }, [token, personagemId, reset]);

    async function salvaAlteracoes(data: Inputs) {
        let atributosObjeto = null;
        try {
            if (data.atributosJSON) {
                atributosObjeto = JSON.parse(data.atributosJSON);
            }
        } catch (error) {
            toast.error("O texto no campo 'Atributos' não é um JSON válido.");
            return;
        }

        const payload = {
            nome: data.nome,
            raca: data.raca,
            descricao: data.descricao,
            sistema_id: Number(data.sistema_id),
            atributos: atributosObjeto,
        };

        try {
            const response = await fetch(`${apiUrl}/personagens/${personagemId}`, {
                method: "PUT", // Usamos o método PUT para atualizar
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.erro || "Falha ao salvar alterações.");
            }
            
            toast.success("Personagem atualizado com sucesso!");
            navigate(`/personagem/${personagemId}`); // Volta para a ficha do personagem

        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Ocorreu um erro");
        }
    }

    return (
        <section className="bg-gray-900 text-white">
            <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
                <h2 className="mb-4 text-xl font-bold">Editar Personagem</h2>
                <form onSubmit={handleSubmit(salvaAlteracoes)}>
                    {/* O JSX do formulário é idêntico ao de criação */}
                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                        <div className="sm:col-span-2">
                            <label htmlFor="nome" className="block mb-2 text-sm font-medium">Nome do Personagem</label>
                            <input type="text" id="nome" className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5" required {...register("nome")} />
                        </div>
                        <div>
                            <label htmlFor="raca" className="block mb-2 text-sm font-medium">Raça</label>
                            <input type="text" id="raca" className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5" {...register("raca")} />
                        </div>
                        <div>
                            <label htmlFor="sistema_id" className="block mb-2 text-sm font-medium">ID do Sistema</label>
                            <input type="number" id="sistema_id" className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5" required {...register("sistema_id")} />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="descricao" className="block mb-2 text-sm font-medium">Descrição</label>
                            <textarea id="descricao" rows={6} className="block p-2.5 w-full text-sm text-white bg-gray-700 rounded-lg border border-gray-600" {...register("descricao")}></textarea>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 pt-6 mt-6">
                         <div className="sm:col-span-2">
                            <label htmlFor="atributosJSON" className="block mb-2 text-sm font-medium">Atributos (em formato JSON)</label>
                            <textarea id="atributosJSON" rows={8} className="block p-2.5 w-full text-sm text-white bg-gray-700 rounded-lg border border-gray-600 font-mono" {...register("atributosJSON")}></textarea>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-6">
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}