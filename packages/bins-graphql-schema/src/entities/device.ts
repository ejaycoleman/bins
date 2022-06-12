import { Field, ID, ObjectType } from 'type-graphql'
import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { Address } from './address'
import { Notification } from './notification'

@ObjectType()
@Entity()
export class Device {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string

  @Field(() => Address)
  @ManyToMany(() => Address, (address) => address.devices)
  @JoinTable()
  address: Address

  @OneToMany(() => Notification, (notification) => notification.device)
  notifications: Notification[]

  @Index('device_token_unique', { unique: true })
  @Field()
  @Column()
  token: string
}
