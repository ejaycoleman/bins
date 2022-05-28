import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string

  @Field()
  addressId: string

  @Field()
  token: string
}
