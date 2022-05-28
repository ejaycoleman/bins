import { Field, ID, ObjectType, GraphQLISODateTime } from 'type-graphql'

@ObjectType()
export class BinStatus {
  @Field(() => ID)
  id: string

  @Field(() => GraphQLISODateTime)
  date: Date

  @Field()
  outcome: string
}

@ObjectType()
export class Bin {
  @Field(() => ID)
  id: string

  @Field()
  type: string

  @Field(() => [GraphQLISODateTime])
  collections: Date[]

  @Field(() => BinStatus)
  status: BinStatus
}

@ObjectType()
export class ReportMissedCollection {
  @Field()
  success: boolean

  @Field()
  fallbackUrl: string
}