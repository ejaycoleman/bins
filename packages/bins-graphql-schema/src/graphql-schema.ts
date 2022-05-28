import { GraphQLSchema } from 'graphql'
import { buildSchema } from 'type-graphql'

import { AddressLookupResolver } from './resolvers/address-lookup'
import { BinResolver } from './resolvers/bin-resolver'
import { NotificationResolver } from './resolvers/notification-resolver'

export const getSchema = (): Promise<GraphQLSchema> => {
  return buildSchema({
    resolvers: [
      AddressLookupResolver,
      BinResolver,
      NotificationResolver,
    ],
  })
}
