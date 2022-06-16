import { ApolloClient, InMemoryCache } from '@apollo/client'

// const uri = 'https://10.0.1.28:4010'
const uri = 'https://bins.joshbalfour.co.uk'

export const client = new ApolloClient({
  uri,
  cache: new InMemoryCache()
})
