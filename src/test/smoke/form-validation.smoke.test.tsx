import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
})

type FormValues = z.infer<typeof schema>

function TestForm({ onValid }: { onValid: (data: FormValues) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <input {...register('email')} aria-label="email" />
      {errors.email && <span role="alert">{errors.email.message}</span>}
      <button type="submit">Submit</button>
    </form>
  )
}

describe('test harness: react-hook-form + zod validation', () => {
  it('blocks submission and surfaces a zod error for invalid input', async () => {
    const onValid = vi.fn()
    render(<TestForm onValid={onValid} />)

    await userEvent.type(screen.getByLabelText('email'), 'not-an-email')
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Enter a valid email')
    expect(onValid).not.toHaveBeenCalled()
  })

  it('calls onValid with the parsed data for valid input', async () => {
    const onValid = vi.fn()
    render(<TestForm onValid={onValid} />)

    await userEvent.type(screen.getByLabelText('email'), 'person@example.com')
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onValid).toHaveBeenCalledWith({ email: 'person@example.com' }, expect.anything())
    })
  })
})
