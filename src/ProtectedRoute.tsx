import { Navigate, Outlet } from "react-router-dom";
import { useJogadorStore } from "./context/AuthContext";

export default function ProtectedRoute() {
  const { jogador } = useJogadorStore();

  if (jogador?.tipo_usuario !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
