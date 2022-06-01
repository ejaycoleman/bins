import { cleanNotifications } from '@joshbalfour/bins-graphql-schema'

export const processNotificationReceipts = async () => {
  return cleanNotifications()
}