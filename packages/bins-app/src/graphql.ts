import { ApolloClient, InMemoryCache } from '@apollo/client'

export const client = new ApolloClient({
  uri: 'http://10.0.1.28:4010',
  cache: new InMemoryCache()
})
