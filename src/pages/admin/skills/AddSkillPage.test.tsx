import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ApolloProvider } from '@apollo/client/react'
import { apolloClient } from '../../../lib/apolloClient'
import { AddSkillPage } from './AddSkillPage'
import '../../../i18n'

describe('AddSkillPage', () => {
  it('renders the add-skill form', () => {
    render(
      <ApolloProvider client={apolloClient}>
        <AddSkillPage />
      </ApolloProvider>,
    )

    expect(screen.getByRole('button', { name: /add skill/i })).toBeInTheDocument()
  })
})
