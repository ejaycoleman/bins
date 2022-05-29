import { AddressAttributes } from '@joshbalfour/canterbury-api'
import { Field, ID, ObjectType } from 'type-graphql'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Bin } from './bin'

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
  binRegion?: string
}
