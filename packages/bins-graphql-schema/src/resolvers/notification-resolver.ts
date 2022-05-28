import { Arg, Mutation, Resolver } from 'type-graphql'
import { Notification } from '../entities/Notification'

@Resolver(Notification)
export class NotificationResolver {
  @Mutation(() => [Notification])
  async enableNotifications(@Arg('token') token: string, @Arg('addressId') addressId: string): Promise<Notification> {
    // TODO - store

    return {
      id: '',
      addressId,
      token,
    }
  }
}
