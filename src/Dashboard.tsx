import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useJogadorStore } from './context/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const { token } = useJogadorStore();

  useEffect(() => {
    async function fetchStats() {
      if (token) {
        const response = await fetch(`${apiUrl}/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      }
    }
    fetchStats();
  }, [token]);

  if (!stats) {
    return <div>Carregando...</div>;
  }

  const data = [
    { name: 'Usuários', total: stats.totalUsuarios },
    { name: 'Personagens', total: stats.totalPersonagens },
    { name: 'Campanhas', total: stats.totalCampanhas },
    { name: 'Sistemas', total: stats.totalSistemas },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 text-white p-4 rounded-lg">
          <h2 className="text-xl">Total de Usuários</h2>
          <p className="text-3xl font-bold">{stats.totalUsuarios}</p>
        </div>
        <div className="bg-gray-800 text-white p-4 rounded-lg">
          <h2 className="text-xl">Total de Personagens</h2>
          <p className="text-3xl font-bold">{stats.totalPersonagens}</p>
        </div>
        <div className="bg-gray-800 text-white p-4 rounded-lg">
          <h2 className="text-xl">Total de Campanhas</h2>
          <p className="text-3xl font-bold">{stats.totalCampanhas}</p>
        </div>
        <div className="bg-gray-800 text-white p-4 rounded-lg">
          <h2 className="text-xl">Total de Sistemas</h2>
          <p className="text-3xl font-bold">{stats.totalSistemas}</p>
        </div>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Últimas Atividades</h2>
        <ul>
          {stats.lastActivities.map((activity: any) => (
            <li key={activity.id} className="mb-2 p-2 bg-gray-800 rounded-lg">
              <span className="font-bold">{activity.usuario.nome_usuario}</span>: {activity.action} - <span className="text-gray-400">{new Date(activity.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
