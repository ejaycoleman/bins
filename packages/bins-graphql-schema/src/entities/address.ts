import { AddressAttributes } from '@joshbalfour/canterbury-api'
import { Field, ID, ObjectType } from 'type-graphql'
import { Column, Entity, Index, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Bin } from './bin'
import { Device } from './device'

export type BinRegion = 'canterbury' | 'basingstoke'

@ObjectType()
@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string

  @Column()
  @Field()
  formatted: string

  @Column()
  @Field()
  @Index()
  postcode: string

  @Column()
  @Field()
  firstLine: string

  @Column('simple-json')
  data: AddressAttributes

  @OneToMany(() => Bin, bin => bin.address)
  @Field(() => [Bin], { nullable: true })
  bins: Bin[]

  @Column({ nullable: true })
  @Field({ nullable: true })
  binRegion?: BinRegion
  
  @Column({ nullable: true })
  @Field({ nullable: true })
  lastUpdatedAt?: Date

  @ManyToMany(() => Device, (device) => device.address)
  devices?: Device[]
}
