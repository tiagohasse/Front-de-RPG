import Titulo from './components/Titulo.tsx'
import { Outlet, Link } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useJogadorStore } from './context/AuthContext'
import type { JogadorType } from './utils/JogadorType'

export default function Layout() {
  const { token, setToken, setJogador, jogador } = useJogadorStore()

  useEffect(() => {
    const storedToken = localStorage.getItem("rpg_token")

    if (storedToken && !token) {
      try {
        const jogadorDecodificado: JogadorType = jwtDecode(storedToken);
        setToken(storedToken);
        setJogador(jogadorDecodificado);
      } catch (error) {
        localStorage.removeItem("rpg_token");
        setToken(null);
        setJogador(null);
      }
    }
  }, [])

  return (
    <div className="flex flex-col h-screen">
      <Titulo />
      <div className="flex flex-1">
        {jogador?.tipo_usuario === 'ADMIN' && (
          <aside className="w-64 bg-gray-800 text-white p-4">
            <nav>
              <ul>
                <li className="mb-2">
                  <Link to="/admin/dashboard" className="hover:text-blue-400">Dashboard</Link>
                </li>
                <li className="mb-2">
                  <Link to="/admin/users" className="hover:text-blue-400">Usuários</Link>
                </li>
              </ul>
            </nav>
          </aside>
        )}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      <Toaster richColors position="top-center" />
    </div>
  )
}