import { BinType } from '@joshbalfour/canterbury-api'
import { Field, ID, ObjectType, GraphQLISODateTime } from 'type-graphql'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm'
import { Address } from './address'
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

  @Column('simple-array', {
    transformer: {
      from: (value: string[]) => value.map(v => new Date(v)),
      to: (value: Date[]) => value.map(v => v.toISOString()),
    },
  })
  @Field(() => [GraphQLISODateTime])
  collections: Date[]

  @OneToOne(() => BinStatus, { eager: true })
  @Field(() => BinStatus, { nullable: true })
  @JoinColumn()
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