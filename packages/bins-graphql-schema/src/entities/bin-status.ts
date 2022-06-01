import { Outcome } from "@joshbalfour/canterbury-api"
import { Field, GraphQLISODateTime, ID, ObjectType } from "type-graphql"
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
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
  outcome: Outcome

  @ManyToOne(() => Bin, bin => bin.status)
  @JoinColumn()
  bin: Bin
}