import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from "typeorm"
import { AppDataSource } from "../data-source"
import { BinStatus } from "../entities"
import { notEmpty } from "../mappers/collection-dates/utils"
import { PushNotification, sendPushNotifications } from "../push"

const getStatusChangeNotifications = (statusChange: BinStatus): PushNotification[] => {
  const body =`Your ${statusChange.bin.type} is now ${statusChange.outcome}`
  const title = `${statusChange.bin.type} bin update`
  return statusChange.bin.address.devices?.map(device => {
    return {
      device,
      title,
      body,
    }
  }).flat().filter(notEmpty) || []
}

const binStatusChanged = async (binStatusId: string) => {
  const binStatus = await AppDataSource.getRepository(BinStatus).findOne({
    where: {
      id: binStatusId,
    },
    relations: ['bin', 'bin.address', 'bin.address.devices'],
  })
  if (!binStatus) {
    return
  }
  const notifications = getStatusChangeNotifications(binStatus)
  await sendPushNotifications(notifications)
}

@EventSubscriber()
export class BinStatusSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return BinStatus
  }

  async afterUpdate(event: UpdateEvent<BinStatus>): Promise<void> {
    event.updatedColumns.forEach((column) => {
      const propertyName = column.propertyName as keyof BinStatus
      let oldValue = event.databaseEntity[propertyName]
      let newValue = event.entity ? event.entity[propertyName] : undefined
      if (event.entity && propertyName === 'outcome' && oldValue !== newValue) {
        binStatusChanged(event.entity.id)
      }
    })
  }
}
