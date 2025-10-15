import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useJogadorStore } from './context/AuthContext';

type User = {
  id: number;
  nome_usuario: string;
  tipo_usuario: string;
};

const apiUrl = import.meta.env.VITE_API_URL;

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const { token } = useJogadorStore();

  useEffect(() => {
    async function fetchUsers() {
      if (token) {
        const response = await fetch(`${apiUrl}/usuarios`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      }
    }
    fetchUsers();
  }, [token]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Usuários</h1>
      <table className="min-w-full bg-gray-800 text-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Nome de Usuário</th>
            <th className="py-2 px-4 border-b">Função</th>
            <th className="py-2 px-4 border-b">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.id}</td>
              <td className="py-2 px-4 border-b">{user.nome_usuario}</td>
              <td className="py-2 px-4 border-b">{user.tipo_usuario}</td>
              <td className="py-2 px-4 border-b">
                <Link to={`/admin/users/${user.id}/edit`} className="text-blue-400 hover:underline mr-4">Editar</Link>
                <Link to={`/admin/users/${user.id}/logs`} className="text-green-400 hover:underline">Logs</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
