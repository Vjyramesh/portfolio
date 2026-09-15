import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, Link, RouterProvider } from 'react-router'

function Home() {
  return <Link to="/next">Go</Link>
}

function Next() {
  return <h1>Arrived</h1>
}

describe('test harness: react-router navigation', () => {
  it('redirects to another route on navigation', async () => {
    const router = createMemoryRouter(
      [
        { path: '/', element: <Home /> },
        { path: '/next', element: <Next /> },
      ],
      { initialEntries: ['/'] },
    )

    render(<RouterProvider router={router} />)

    await userEvent.click(screen.getByRole('link', { name: 'Go' }))

    expect(await screen.findByRole('heading', { name: 'Arrived' })).toBeInTheDocument()
  })
})
