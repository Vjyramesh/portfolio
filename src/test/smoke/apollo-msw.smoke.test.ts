import { describe, expect, it } from 'vitest'
import { gql } from '@apollo/client'
import { graphql, HttpResponse } from 'msw'
import { apolloClient } from '../../lib/apolloClient'
import { server } from '../mocks/server'

interface HealthQueryResult {
  health: {
    status: string
    environment: string
    databaseConnected: boolean
  }
}

const HEALTH_QUERY = gql`
  query Health {
    health {
      status
      environment
      databaseConnected
    }
  }
`

describe('test harness: MSW intercepting Apollo Client GraphQL requests', () => {
  it('resolves a mocked GraphQL response through Apollo Client', async () => {
    const link = graphql.link(import.meta.env.VITE_GRAPHQL_URI)
    server.use(
      link.query('Health', () =>
        HttpResponse.json({
          data: {
            health: { status: 'ok', environment: 'test', databaseConnected: true },
          },
        }),
      ),
    )

    const { data } = await apolloClient.query<HealthQueryResult>({
      query: HEALTH_QUERY,
      fetchPolicy: 'no-cache',
    })

    expect(data?.health).toEqual({
      status: 'ok',
      environment: 'test',
      databaseConnected: true,
    })
  })
})
