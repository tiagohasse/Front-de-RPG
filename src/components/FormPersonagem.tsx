import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useJogadorStore } from "../context/AuthContext";
import { useEffect, useState } from "react";

type Inputs = {
    nome: string;
    raca: string;
    descricao: string;
    sistema_id: number;
    atributosJSON: string;
};

const apiUrl = import.meta.env.VITE_API_URL;

type SistemaType = {
    id: number;
    nome: string;
};

export default function FormPersonagem() {
    const { register, handleSubmit } = useForm<Inputs>();
    const navigate = useNavigate();
    const { token } = useJogadorStore();
    const [sistemas, setSistemas] = useState<SistemaType[]>([]);

    useEffect(() => {
        if (token) {
            async function buscaSistemas() {
                const response = await fetch(`${apiUrl}/sistemas`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setSistemas(data);
                }
            }
            buscaSistemas();
        }
    }, [token]);

    async function criaPersonagem(data: Inputs) {
        let atributosObjeto = null;

        try {
            if (data.atributosJSON) {
                atributosObjeto = JSON.parse(data.atributosJSON);
            }
        } catch (error) {
            toast.error("O texto inserido no campo 'Atributos' não é um JSON válido.");
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
            const response = await fetch(`${apiUrl}/personagens`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.erro || "Falha ao criar personagem");
            }
            
            toast.success("Personagem criado com sucesso!");
            navigate("/");

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro";
            toast.error(errorMessage);
        }
    }

    return (
        <section className="bg-gray-900 text-white">
            <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
                <h2 className="mb-4 text-xl font-bold">Adicionar um Novo Personagem</h2>
                <form onSubmit={handleSubmit(criaPersonagem)}>
                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                        <div className="sm:col-span-2">
                            <label htmlFor="nome" className="block mb-2 text-sm font-medium">Nome do Personagem</label>
                            <input type="text" id="nome" className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5" 
                                   required 
                                   {...register("nome")} />
                        </div>
                        <div>
                            <label htmlFor="raca" className="block mb-2 text-sm font-medium">Raça</label>
                            <input type="text" id="raca" className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5" 
                                   {...register("raca")} />
                        </div>
                        <div>
                            <label htmlFor="sistema_id" className="block mb-2 text-sm font-medium">Sistema de RPG</label>
                            <select id="sistema_id" className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5" required {...register("sistema_id")}>
                                <option value="">Selecione um sistema</option>
                                {sistemas.map(sistema => (
                                    <option key={sistema.id} value={sistema.id}>{sistema.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="descricao" className="block mb-2 text-sm font-medium">Descrição</label>
                            <textarea id="descricao" rows={6} className="block p-2.5 w-full text-sm text-white bg-gray-700 rounded-lg border border-gray-600" 
                                      placeholder="Descreva a história, aparência, etc."
                                      {...register("descricao")}></textarea>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-6 mt-6">
                         <div className="sm:col-span-2">
                            <label htmlFor="atributosJSON" className="block mb-2 text-sm font-medium">Atributos (em formato JSON)</label>
                            <textarea id="atributosJSON" rows={8} className="block p-2.5 w-full text-sm text-white bg-gray-700 rounded-lg border border-gray-600 font-mono" 
                                      placeholder={'{\n  "nivel": 1,\n  "pontosVida": 100,\n  "forca": 12\n}'}
                                      {...register("atributosJSON")}></textarea>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 mt-6">
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            Criar Personagem
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}