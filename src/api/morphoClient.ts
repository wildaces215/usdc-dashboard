import { GraphQLClient } from 'graphql-request'

// Morpho's free public GraphQL API — no API key required for read-only access.
const ENDPOINT = 'https://api.morpho.org/graphql'

export const morphoClient = new GraphQLClient(ENDPOINT, {
  headers: { 'Content-Type': 'application/json' },
})