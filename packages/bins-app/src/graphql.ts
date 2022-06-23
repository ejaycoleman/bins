import { ApolloClient, InMemoryCache } from '@apollo/client'

const uri = 'http://10.0.1.14:4010'
// const uri = 'https://bins.joshbalfour.co.uk/api'

export const client = new ApolloClient({
  uri,
  cache: new InMemoryCache()
})
