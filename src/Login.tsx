import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { useJogadorStore } from "./context/AuthContext";
import type { JogadorType } from "./utils/JogadorType";

type Inputs = {
    nome_usuario: string;
    senha: string;
    manter: boolean;
};

const apiUrl = import.meta.env.VITE_API_URL;

export default function Login() {
    const { register, handleSubmit } = useForm<Inputs>();
    const { setToken, setJogador } = useJogadorStore();
    const navigate = useNavigate();

    async function verificaLogin(data: Inputs) {
        try {
            const response = await fetch(`${apiUrl}/login`, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({
                    nome_usuario: data.nome_usuario,
                    senha: data.senha,
                }),
            });

            if (!response.ok) {
                throw new Error("Credenciais inválidas");
            }

            const { token } = await response.json();
            
            const jogadorDecodificado: JogadorType = jwtDecode(token);

            setToken(token);
            setJogador(jogadorDecodificado);

            if (data.manter) {
                localStorage.setItem("rpg_token", token);
            }

            navigate("/");

        } catch (error) {
            toast.error("Erro: Nome de usuário ou senha incorretos.");
            setToken(null);
            setJogador(null);
            localStorage.removeItem("rpg_token");
        }
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div style={{ height: '5rem' }}></div>
            <div className="flex flex-col items-center px-6 mx-auto">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Acesso do Jogador
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(verificaLogin)} >
                            <div>
                                <label htmlFor="nome_usuario" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seu Nome de Usuário</label>
                                <input type="text" id="nome_usuario" 
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                       required 
                                       {...register("nome_usuario")} />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha de Acesso</label>
                                <input type="password" id="password" 
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                       required 
                                       {...register("senha")} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" aria-describedby="remember" type="checkbox" 
                                               className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" 
                                               {...register("manter")} />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Manter Conectado</label>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Entrar
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Ainda não possui conta? <Link to="/cadastro" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Cadastre-se</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}