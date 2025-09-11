import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.tsx'
import Login from './Login.tsx'
import FichaPersonagem from './FichaPersonagem.tsx'
import FormPersonagem from './components/FormPersonagem.tsx'
import FormEditarPersonagem from './FormEditarPersonagem.tsx'

import Layout from './Layout.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const rotas = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: 'login', element: <Login /> },
      { path: 'personagem/criar', element: <FormPersonagem /> },
      { path: 'personagem/:personagemId', element: <FichaPersonagem /> },
      { path: 'personagem/:personagemId/editar', element: <FormEditarPersonagem /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)