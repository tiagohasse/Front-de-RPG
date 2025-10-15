import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useJogadorStore } from './context/AuthContext';

type ActivityLog = {
  id: number;
  action: string;
  timestamp: string;
};

const apiUrl = import.meta.env.VITE_API_URL;

export default function UserActivityLog() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const { token } = useJogadorStore();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    async function fetchLogs() {
      if (token && id) {
        const response = await fetch(`${apiUrl}/usuarios/${id}/logs`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setLogs(data);
        }
      }
    }
    fetchLogs();
  }, [token, id]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Logs de Atividade do Usuário</h1>
      <ul>
        {logs.map(log => (
          <li key={log.id} className="mb-2 p-2 bg-gray-800 rounded-lg text-white">
            {log.action} - <span className="text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
