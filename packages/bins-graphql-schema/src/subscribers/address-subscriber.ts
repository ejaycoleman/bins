import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from "typeorm"
import { AppDataSource } from "../data-source"
import { Address } from "../entities"
import { notEmpty } from "../mappers/collection-dates/utils"
import { PushNotification, sendPushNotifications } from "../push"

const getNewlySupportedAddressNotifs = (address: Address): PushNotification[] => {
  return address.devices?.map(device => {
    return {
      device,
      title: '🎉 We now support your address',
      body: 'You will now get notified when to put your bins out',
    }
  }).flat().filter(notEmpty) || []
}

const binRegionChanged = async (addressId: string) => {
  const address = await AppDataSource.getRepository(Address).findOne({
    where: {
      id: addressId,
    },
    relations: ['devices'],
  })
  if (!address) {
    return
  }
  const notifications = getNewlySupportedAddressNotifs(address)
  await sendPushNotifications(notifications)
}

@EventSubscriber()
export class AddressSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return Address
  }

  async afterUpdate(event: UpdateEvent<Address>): Promise<void> {
    event.updatedColumns.forEach((column) => {
      const propertyName = column.propertyName as keyof Address
      let oldValue = event.databaseEntity[propertyName]
      let newValue = event.entity ? event.entity[propertyName] : undefined
      if (event.entity && propertyName === 'binRegion' && oldValue !== newValue) {
        binRegionChanged(event.entity.id)
      }
    })
  }
}
