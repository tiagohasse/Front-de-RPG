import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.tsx'
import Login from './Login.tsx'
import FichaPersonagem from './FichaPersonagem.tsx'
import FormPersonagem from './components/FormPersonagem.tsx'
import FormEditarPersonagem from './components/FormEditarPersonagem.tsx'
import Cadastro from './Cadastro.tsx'
import Sistemas from './Sistemas.tsx'
import FormSistema from './FormSistema.tsx'
import Campanhas from './Campanhas.tsx'
import FormCampanha from './FormCampanha.tsx'
import GerenciarCampanhaPersonagens from './GerenciarCampanhaPersonagens.tsx'
import FichaCampanha from './FichaCampanha.tsx'
import MeusPersonagens from './MeusPersonagens.tsx'
import Dashboard from './Dashboard.tsx'
import UserList from './UserList.tsx'
import UserEdit from './UserEdit.tsx'
import UserActivityLog from './UserActivityLog.tsx'
import ProtectedRoute from './ProtectedRoute.tsx'

import Layout from './Layout.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const rotas = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: 'login', element: <Login /> },
      { path: 'cadastro', element: <Cadastro /> },
      { path: 'sistemas', element: <Sistemas /> },
      { path: 'sistemas/criar', element: <FormSistema /> },
      { path: 'sistemas/:id/editar', element: <FormSistema /> },
      { path: 'campanhas', element: <Campanhas /> },
      { path: 'campanhas/criar', element: <FormCampanha /> },
      { path: 'campanhas/:id', element: <FichaCampanha /> },
      { path: 'campanhas/:id/editar', element: <FormCampanha /> },
      { path: 'campanhas/:id/gerenciar-personagens', element: <GerenciarCampanhaPersonagens /> },
      { path: 'meus-personagens', element: <MeusPersonagens /> },
      { path: 'personagem/criar', element: <FormPersonagem /> },
      { path: 'personagem/:personagemId', element: <FichaPersonagem /> },
      { path: 'personagem/:personagemId/editar', element: <FormEditarPersonagem /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/admin/dashboard', element: <Dashboard /> },
          { path: '/admin/users', element: <UserList /> },
          { path: '/admin/users/:id/edit', element: <UserEdit /> },
          { path: '/admin/users/:id/logs', element: <UserActivityLog /> },
        ]
      }
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)