import { Outlet } from 'react-router'
import { Sidebar } from '../../components/Sidebar/Sidebar'
import './Admin.css'

export function Admin() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}
