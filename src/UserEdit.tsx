import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useJogadorStore } from './context/AuthContext';
import { toast } from 'sonner';

type User = {
  nome_usuario: string;
  tipo_usuario: string;
};

const apiUrl = import.meta.env.VITE_API_URL;

export default function UserEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useJogadorStore();
  const { register, handleSubmit, setValue } = useForm<User>();

  useEffect(() => {
    async function fetchUser() {
      if (token && id) {
        const response = await fetch(`${apiUrl}/usuarios/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setValue('nome_usuario', data.nome_usuario);
          setValue('tipo_usuario', data.tipo_usuario);
        }
      }
    }
    fetchUser();
  }, [token, id, setValue]);

  const onSubmit = async (data: User) => {
    if (token && id) {
      const response = await fetch(`${apiUrl}/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        toast.success('User updated successfully!');
        navigate('/admin/users');
      } else {
        toast.error('Failed to update user.');
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Edit User</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="nome_usuario" className="block text-sm font-medium">Username</label>
          <input id="nome_usuario" {...register('nome_usuario')} className="w-full p-2 rounded bg-gray-800 text-white" />
        </div>
        <div>
          <label htmlFor="tipo_usuario" className="block text-sm font-medium">Role</label>
          <select id="tipo_usuario" {...register('tipo_usuario')} className="w-full p-2 rounded bg-gray-800 text-white">
            <option value="JOGADOR">JOGADOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">Save</button>
      </form>
    </div>
  );
}
