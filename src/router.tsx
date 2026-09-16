import { createBrowserRouter } from 'react-router'
import App from './App'
import { AddSkillForm } from './components/AddSkillForm/AddSkillForm'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    
  },
  {
    path: '/skills/new',
    element: <AddSkillForm />,
  },
])
