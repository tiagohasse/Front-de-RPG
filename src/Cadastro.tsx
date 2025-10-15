import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

type Inputs = {
    nome_usuario: string;
    senha: string;
    confirmar_senha: string;
};

const apiUrl = import.meta.env.VITE_API_URL;

export default function Cadastro() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>({ mode: 'onChange' });
    const navigate = useNavigate();
    const senha = watch("senha");

    async function registraUsuario(data: Inputs) {
        try {
            const response = await fetch(`${apiUrl}/usuarios`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome_usuario: data.nome_usuario,
                    senha: data.senha,
                    tipo_usuario: "JOGADOR",
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.erro || "Falha ao registrar usuário.");
            }

            toast.success("Usuário registrado com sucesso! Você já pode fazer o login.");
            navigate("/login");

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
            toast.error(errorMessage);
        }
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div style={{ height: '5rem' }}></div>
            <div className="flex flex-col items-center px-6 mx-auto">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Criar Nova Conta
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(registraUsuario)}>
                            <div>
                                <label htmlFor="nome_usuario" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome de Usuário</label>
                                <input type="text" id="nome_usuario"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                       required
                                       {...register("nome_usuario")} />
                            </div>
                            <div>
                                <label htmlFor="senha" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
                                <input type="password" id="senha"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                       required
                                       {...register("senha")} />
                            </div>
                            <div>
                                <label htmlFor="confirmar_senha" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirmar Senha</label>
                                <input type="password" id="confirmar_senha"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                       required
                                       {...register("confirmar_senha", { validate: value => value === senha || "As senhas não coincidem" })} />
                                {errors.confirmar_senha && <p className="text-red-500 text-sm mt-1">{errors.confirmar_senha.message}</p>}
                            </div>
                            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Criar Conta
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Já possui uma conta? <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Faça o login</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

