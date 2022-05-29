import { Field, ID, ObjectType } from 'type-graphql'
import { Bin } from './bin'

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

  @Field({ nullable: true })
  supported?: boolean

  @Field(() => [Bin], { nullable: true })
  bins: Bin[]
}
