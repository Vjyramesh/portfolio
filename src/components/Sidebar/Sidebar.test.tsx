import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { Sidebar } from './Sidebar'
import '../../i18n'

function renderSidebar(initialEntry = '/admin/skills') {
  const router = createMemoryRouter(
    [{ path: '*', element: <Sidebar /> }],
    { initialEntries: [initialEntry] },
  )
  render(<RouterProvider router={router} />)
}

describe('Sidebar', () => {
  it('renders a navigation landmark with an accessible name', () => {
    renderSidebar()

    expect(screen.getByRole('navigation', { name: /admin navigation/i })).toBeInTheDocument()
  })

  it('renders a link for every admin content category', () => {
    renderSidebar()

    const expectedLinks: [name: RegExp, href: string][] = [
      [/basic info/i, '/admin/basic-info'],
      [/experience/i, '/admin/experience'],
      [/works/i, '/admin/works'],
      [/^skills$/i, '/admin/skills'],
      [/blogs/i, '/admin/blogs'],
      [/case studies/i, '/admin/case-studies'],
      [/white papers/i, '/admin/white-papers'],
      [/certifications/i, '/admin/certifications'],
      [/education/i, '/admin/education'],
      [/contact us/i, '/admin/contact'],
    ]

    for (const [name, href] of expectedLinks) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', href)
    }
  })

  it('marks the link matching the current route as the current page', () => {
    renderSidebar('/admin/skills')

    expect(screen.getByRole('link', { name: /^skills$/i })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: /works/i })).not.toHaveAttribute('aria-current')
  })
})
