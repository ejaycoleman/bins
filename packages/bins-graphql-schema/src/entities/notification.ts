import { Field, ID, ObjectType } from 'type-graphql'
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Device } from './device'

@ObjectType()
@Entity()
export class Notification {
  @PrimaryColumn()
  @Field(() => ID)
  id: string

  @ManyToOne(() => Device, (device) => device.notifications)
  @JoinColumn()
  device: Device
}
