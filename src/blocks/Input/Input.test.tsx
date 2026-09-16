import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'

describe('Input block', () => {
  it('associates the label with the input so it has an accessible name', () => {
    render(<Input label="Name" />)

    expect(screen.getByLabelText('Name')).toBeInTheDocument()
  })

  it('forwards a ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input label="Name" ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('accepts typed input and fires onChange', async () => {
    const onChange = vi.fn()
    render(<Input label="Name" onChange={onChange} />)

    await userEvent.type(screen.getByLabelText('Name'), 'Vijay')

    expect(screen.getByLabelText('Name')).toHaveValue('Vijay')
    expect(onChange).toHaveBeenCalled()
  })

  it('has no error styling or alert when no error is given', () => {
    render(<Input label="Name" />)

    expect(screen.getByLabelText('Name')).not.toHaveAttribute('aria-invalid')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('links an error message via aria-describedby and marks the field invalid', () => {
    render(<Input label="Name" error="This field is required" />)

    const input = screen.getByLabelText('Name')
    const alert = screen.getByRole('alert')

    expect(alert).toHaveTextContent('This field is required')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby', alert.id)
  })

  it('disables the input when disabled is set', () => {
    render(<Input label="Name" disabled />)

    expect(screen.getByLabelText('Name')).toBeDisabled()
  })
})
