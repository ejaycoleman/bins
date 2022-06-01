import { Field, GraphQLISODateTime, ObjectType } from "type-graphql"
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { Bin } from "./bin"

@Entity()
@ObjectType()
export class BinCollection {
  @PrimaryColumn()
  @Field(() => GraphQLISODateTime)
  date: Date

  @PrimaryColumn()
  binId: string

  @ManyToOne(() => Bin, bin => bin.status)
  @JoinColumn()
  bin: Bin
}