import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ApolloProvider } from '@apollo/client/react'
import { graphql, HttpResponse } from 'msw'
import { apolloClient } from '../../lib/apolloClient'
import { server } from '../../test/mocks/server'
import { AddSkillForm } from './AddSkillForm'
import '../../i18n'

function renderForm() {
  render(
    <ApolloProvider client={apolloClient}>
      <AddSkillForm />
    </ApolloProvider>,
  )
}

async function fillValidSkill() {
  await userEvent.type(screen.getByLabelText(/^name$/i), 'TypeScript')
  await userEvent.type(screen.getByLabelText(/category/i), 'Languages')
  await userEvent.type(screen.getByLabelText(/level/i), 'Expert')
  await userEvent.type(screen.getByLabelText(/proficiency/i), '90')
  await userEvent.type(screen.getByLabelText(/years of experience/i), '5')
}

describe('AddSkillForm', () => {
  it('renders a labeled field for each skill attribute and a submit button', () => {
    renderForm()

    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/level/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/proficiency/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/years of experience/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add skill/i })).toBeInTheDocument()
  })

  it('blocks submission and shows validation errors when required fields are empty', async () => {
    renderForm()

    await userEvent.click(screen.getByRole('button', { name: /add skill/i }))

    expect(await screen.findAllByRole('alert')).not.toHaveLength(0)
  })

  it('submits the skill to the backend and shows a success message', async () => {
    let receivedVariables: unknown
    const link = graphql.link(import.meta.env.VITE_GRAPHQL_URI)
    server.use(
      link.mutation('AddSkill', ({ variables }) => {
        receivedVariables = variables
        return HttpResponse.json({
          data: { addSkill: { id: '1', ...variables } },
        })
      }),
    )

    renderForm()
    await fillValidSkill()
    await userEvent.click(screen.getByRole('button', { name: /add skill/i }))

    expect(await screen.findByRole('status')).toHaveTextContent(/added/i)
    expect(receivedVariables).toEqual({
      name: 'TypeScript',
      category: 'Languages',
      level: 'Expert',
      proficiency: 90,
      yearsOfExperience: 5,
    })
  })

  it('shows an error message when the mutation fails', async () => {
    const link = graphql.link(import.meta.env.VITE_GRAPHQL_URI)
    server.use(
      link.mutation('AddSkill', () =>
        HttpResponse.json({ errors: [{ message: 'Server error' }] }),
      ),
    )

    renderForm()
    await fillValidSkill()
    await userEvent.click(screen.getByRole('button', { name: /add skill/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i)
  })
})
