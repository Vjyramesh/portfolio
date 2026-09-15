import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../../App'

describe('test harness: jsdom + React Testing Library', () => {
  it('renders the app into jsdom', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /get started/i })).toBeInTheDocument()
  })
})
