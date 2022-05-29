import { GraphQLSchema } from 'graphql'
import { buildSchema } from 'type-graphql'
import { initializeDataSource } from './data-source'

import { AddressLookupResolver } from './resolvers/address-lookup'
import { BinResolver } from './resolvers/bin-resolver'
import { NotificationResolver } from './resolvers/notification-resolver'

export * from './entities/address'

export const getSchema = async (): Promise<GraphQLSchema> => {
  await initializeDataSource()
  return buildSchema({
    resolvers: [
      AddressLookupResolver,
      BinResolver,
      NotificationResolver,
    ],
  })
}
