import { initializeDataSource } from "@joshbalfour/bins-graphql-schema"
import { collectionNextDay } from "./jobs/collection-next-day"
import { updateAllData } from "./jobs/update-data"
import { processNotificationReceipts } from "./jobs/process-notification-receipts"

const isIt5pm = () => {
  const now = new Date()
  const isIt = now.getHours() === 17 && now.getMinutes() === 0
  return isIt
}

const go = async () => {
  console.log('worker started')
  await initializeDataSource()
  
  await updateAllData()
  await processNotificationReceipts()
  
  if (isIt5pm()) {
    await collectionNextDay()
  }
  console.log('worker finished')
}

go().catch(console.error)