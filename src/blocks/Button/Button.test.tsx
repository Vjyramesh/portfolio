import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button block', () => {
  it('renders its children as an accessible button', () => {
    render(<Button>Send</Button>)

    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument()
  })

  it('defaults to type="button" so it does not submit forms unexpectedly', () => {
    render(<Button>Send</Button>)

    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'button')
  })

  it('fires onClick when pressed', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Send</Button>)

    await userEvent.click(screen.getByRole('button', { name: 'Send' }))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Send
      </Button>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Send' }))

    expect(onClick).not.toHaveBeenCalled()
  })
})
