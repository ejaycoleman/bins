import { Field, GraphQLISODateTime, ID, ObjectType } from "type-graphql"
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm"
import { Bin } from "./bin"

@Entity()
@ObjectType()
export class BinStatus {
  @PrimaryColumn()
  @Field(() => ID)
  id: string

  @Column()
  @Field(() => GraphQLISODateTime)
  date: Date

  @Column()
  @Field()
  outcome: string
}