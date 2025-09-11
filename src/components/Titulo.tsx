import { Link } from "react-router-dom"
import { useJogadorStore } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Titulo() {
    const { jogador, deslogaJogador } = useJogadorStore()
    const navigate = useNavigate()

    function jogadorSair() {
        if (confirm("Tem certeza que quer sair?")) {
            deslogaJogador()
            if (localStorage.getItem("rpg_token")) {
                localStorage.removeItem("rpg_token")
            }
            navigate("/login")
        }
    }

    return (
        <nav className="border-gray-200 bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <svg className="h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18"></path></svg>
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                        Repositório de RPG
                    </span>
                </Link>
                <div className="w-full md:block md:w-auto" id="navbar-solid-bg">
                    <ul className="flex flex-col font-medium mt-4 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
                        <li>
                            {jogador && jogador.usuarioId ?
                                <>
                                    <span className="text-white">
                                        Olá, {jogador.nome_usuario}
                                    </span>&nbsp;&nbsp;
                                    <Link to="/" className="text-white font-bold bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:outline-none focus:ring-blue-400 rounded-lg text-sm w-full sm:w-auto px-3 py-2 text-center">
                                        Personagens
                                    </Link>&nbsp;&nbsp;
                                    <span className="cursor-pointer font-bold text-gray-400 hover:text-white"
                                        onClick={jogadorSair}>
                                        Sair
                                    </span>
                                </>
                                :
                                <Link to="/login" className="block py-2 px-3 md:p-0 text-white rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-500">
                                    Login
                                </Link>
                            }
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}