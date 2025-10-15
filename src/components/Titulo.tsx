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
                    <svg className="h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
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
                                    <Link to="/meus-personagens" className="text-white font-bold bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:outline-none focus:ring-blue-400 rounded-lg text-sm w-full sm:w-auto px-3 py-2 text-center">
                                        Meus Personagens
                                    </Link>&nbsp;&nbsp;
                                    <Link to="/sistemas" className="text-white font-bold bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:outline-none focus:ring-blue-400 rounded-lg text-sm w-full sm:w-auto px-3 py-2 text-center">
                                        Sistemas
                                    </Link>&nbsp;&nbsp;
                                    <Link to="/campanhas" className="text-white font-bold bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:outline-none focus:ring-blue-400 rounded-lg text-sm w-full sm:w-auto px-3 py-2 text-center">
                                        Campanhas
                                    </Link>&nbsp;&nbsp;
                                    <span className="cursor-pointer font-bold text-gray-400 hover:text-white"
                                        onClick={jogadorSair}>
                                        Sair
                                    </span>
                                </>
                                :
                                <div className="flex flex-row space-x-4">
                                    <Link to="/" className="py-2 px-3 md:p-0 text-white rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-500">
                                        Personagens
                                    </Link>
                                    <Link to="/sistemas" className="py-2 px-3 md:p-0 text-white rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-500">
                                        Sistemas
                                    </Link>
                                    <Link to="/campanhas" className="py-2 px-3 md:p-0 text-white rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-500">
                                        Campanhas
                                    </Link>
                                    <Link to="/login" className="py-2 px-3 md:p-0 text-white rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-500">
                                        Login
                                    </Link>
                                </div>
                            }
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}