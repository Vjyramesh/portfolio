import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { Admin } from './Admin'
import '../../i18n'

function renderAdmin(initialEntry = '/admin') {
  const router = createMemoryRouter(
    [
      {
        path: '/admin',
        element: <Admin />,
        children: [{ path: 'child', element: <p>Child page content</p> }],
      },
    ],
    { initialEntries: [initialEntry] },
  )
  render(<RouterProvider router={router} />)
}

describe('Admin layout', () => {
  it('renders the admin sidebar navigation', () => {
    renderAdmin()

    expect(screen.getByRole('navigation', { name: /admin navigation/i })).toBeInTheDocument()
  })

  it('renders the matched child route inside the layout', () => {
    renderAdmin('/admin/child')

    expect(screen.getByText('Child page content')).toBeInTheDocument()
  })
})
