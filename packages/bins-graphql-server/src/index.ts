import { ApolloServer } from 'apollo-server'
import { getSchema } from '@joshbalfour/bins-graphql-schema'

const go = async () => {
  const schema = await getSchema()
  const server = new ApolloServer({
    cors: {
      origin: [
        'https://studio.apollographql.com',
        'https://bins.joshbalfour.co.uk',
        'http://localhost:19006',
      ]
    },
    schema,
    formatError: (error) => {
      console.error(JSON.stringify(error, null, 2))
      return error
    }
  })
  server.listen(process.env.PORT || 4010).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
}

go().catch(console.error)
