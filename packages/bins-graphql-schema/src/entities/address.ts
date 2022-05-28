import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
export class Address {
  @Field(() => ID)
  id: string

  @Field()
  formatted: string

  @Field()
  postcode: string

  @Field()
  firstLine: string
}
