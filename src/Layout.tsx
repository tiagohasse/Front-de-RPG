import Titulo from './components/Titulo.tsx'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useJogadorStore } from './context/AuthContext'
import type { JogadorType } from './utils/JogadorType'

export default function Layout() {
  const { token, setToken, setJogador } = useJogadorStore()

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
    <>
      <Titulo />
      <Outlet />
      <Toaster richColors position="top-center" />
    </>
  )
}