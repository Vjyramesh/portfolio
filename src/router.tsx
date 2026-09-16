import { createBrowserRouter } from 'react-router'
import App from './App'
import { Admin } from './pages/admin/Admin'
import { AddSkillPage } from './pages/admin/skills/AddSkillPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/admin',
    element: <Admin />,
    children: [{ path: 'skills/new', element: <AddSkillPage /> }],
  },
])
