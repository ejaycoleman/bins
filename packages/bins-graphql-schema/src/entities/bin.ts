import { BinType } from '@joshbalfour/canterbury-api'
import { Field, GraphQLISODateTime, ID, ObjectType } from 'type-graphql'
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { Address } from './address'
import { BinCollection } from './bin-collection'
import { BinStatus } from './bin-status'

@Entity()
@ObjectType()
export class Bin {
  @PrimaryColumn()
  @Field(() => ID)
  id: string

  @Column()
  @Field()
  type: BinType

  @OneToMany(() => BinCollection, (collection) => collection.bin, { eager: true })
  @Field(() => [BinCollection])
  collectionDates: BinCollection[]

  @Field(() => [GraphQLISODateTime])
  collections: Date[]

  @Field(() => [BinStatus])
  @OneToMany(() => BinStatus, (status) => status.bin, { eager: true })
  statusHistory: BinStatus[]

  @Field(() => BinStatus, { nullable: true })
  status?: BinStatus

  @ManyToOne(() => Address, address => address.bins)
  address: Address
}


@ObjectType()
export class ReportMissedCollection {
  @Field()
  success: boolean

  @Field()
  fallbackUrl: string
}