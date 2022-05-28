import { ApolloServer } from 'apollo-server'
import { getSchema } from '@joshbalfour/bins-graphql-schema'

const go = async () => {
  const schema = await getSchema()
  const server = new ApolloServer({ schema, context: ({ req }) => ({ token: req.headers.authorization?.replace('Bearer ', '') }) })
  server.listen(process.env.PORT || 4010).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
}

go().catch(console.error)
