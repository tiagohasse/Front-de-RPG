import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useJogadorStore } from "../context/AuthContext";
import { useEffect, useState } from "react";
import type { PersonagemType } from "../utils/PersonagemType";

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

type CampanhaType = {
    id: number;
    nome: string;
};

export default function FormEditarPersonagem() {
    const { register, handleSubmit, reset } = useForm<Inputs>();
    const navigate = useNavigate();
    const { token } = useJogadorStore();
    const { personagemId } = useParams<{ personagemId: string }>();

    const [sistemas, setSistemas] = useState<SistemaType[]>([]);
    const [campanhas, setCampanhas] = useState<CampanhaType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedCampanhaId, setSelectedCampanhaId] = useState<number | null>(null);

    useEffect(() => {
        if (!token) {
            setError("Você precisa estar logado para editar um personagem.");
            setLoading(false);
            return;
        }

        async function fetchData() {
            try {
                if (personagemId) {
                    const responsePersonagem = await fetch(`${apiUrl}/personagens/${personagemId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!responsePersonagem.ok) throw new Error("Personagem não encontrado.");
                    const dadosPersonagem: PersonagemType & { campanhas: { campanha_id: number }[] } = await responsePersonagem.json();
                    
                                        reset({
                        nome: dadosPersonagem.nome,
                        raca: dadosPersonagem.raca || "",
                        descricao: dadosPersonagem.descricao || "",
                        sistema_id: dadosPersonagem.sistema_id,
                        atributosJSON: JSON.stringify(dadosPersonagem.atributos, null, 2),
                    });

                    if (dadosPersonagem.campanhas && dadosPersonagem.campanhas.length > 0) {
                        setSelectedCampanhaId(dadosPersonagem.campanhas[0].campanha_id);
                    } else {
                        setSelectedCampanhaId(null);
                    }
                }

                const responseSistemas = await fetch(`${apiUrl}/sistemas`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!responseSistemas.ok) throw new Error("Não foi possível carregar os sistemas.");
                const dadosSistemas: SistemaType[] = await responseSistemas.json();
                setSistemas(dadosSistemas);

                const responseCampanhas = await fetch(`${apiUrl}/campanhas`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!responseCampanhas.ok) throw new Error("Não foi possível carregar as campanhas.");
                const dadosCampanhas: CampanhaType[] = await responseCampanhas.json();
                setCampanhas(dadosCampanhas);

            } catch (err) {
                setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido ao carregar dados.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [token, personagemId, reset]);

    async function atualizaPersonagem(data: Inputs) {
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
            campanha_id: selectedCampanhaId,
        };

        try {
            const response = await fetch(`${apiUrl}/personagens/${personagemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.erro || "Falha ao atualizar personagem");
            }
            
            toast.success("Personagem atualizado com sucesso!");
            navigate(`/personagem/${personagemId}`);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro";
            toast.error(errorMessage);
        }
    }

    if (loading) {
        return <h2 className="text-center text-white text-2xl mt-8">Carregando dados do personagem...</h2>;
    }
    
    if (error) {
        return <h2 className="text-center text-red-500 text-2xl mt-8">{error}</h2>;
    }

    return (
        <section className="bg-gray-900 text-white">
            <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
                <h2 className="mb-4 text-xl font-bold">Editar Personagem</h2>
                <form onSubmit={handleSubmit(atualizaPersonagem)}>
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
                            <label htmlFor="campanha_id" className="block mb-2 text-sm font-medium">Campanha (Opcional)</label>
                            <select id="campanha_id" className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5" 
                                    value={selectedCampanhaId || ""} 
                                    onChange={(e) => setSelectedCampanhaId(e.target.value ? Number(e.target.value) : null)}>
                                <option value="">Nenhuma Campanha</option>
                                {campanhas.map(campanha => (
                                    <option key={campanha.id} value={campanha.id}>{campanha.nome}</option>
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
                                      placeholder='{"nivel": 1, "pontosVida": 100, "forca": 12}'
                                      {...register("atributosJSON")}></textarea>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 mt-6">
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            Atualizar Personagem
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
