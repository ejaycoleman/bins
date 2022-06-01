import { AppDataSource, BinCollection, Device, sendPushNotifications, PushNotification } from "@joshbalfour/bins-graphql-schema"

const listToHuman = (list: string[]) => {
  if (list.length === 0) {
    return "None"
  }
  if (list.length === 1) {
    return list[0]
  }
  if (list.length === 2) {
    return `${list[0]} and ${list[1]}`
  }
  return `${list.slice(0, -1).join(", ")}, and ${list[list.length - 1]}`
}

export const collectionNextDay = async () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0)
  tomorrow.setMinutes(0)
  tomorrow.setSeconds(0)
  tomorrow.setMilliseconds(0)

  const collections = await AppDataSource.getRepository(BinCollection).find({
    where: {
      date: tomorrow,
    },
    relations: ['bin', 'bin.address', 'bin.address.devices'],
  })

  const collectionsForDevices: Record<string, BinCollection[]> = {}
  const devices: Record<string, Device> = {}

  collections.filter(c => c.bin.address.devices?.length)
    .map(c => {
      // collection by device
      c.bin.address.devices?.forEach(device => {
        if (!collectionsForDevices[device.id]) {
          collectionsForDevices[device.id] = []
          devices[device.id] = device
        }

        collectionsForDevices[device.id].push(c)
      })
    })
  
  const pushNotifications: PushNotification[] = []
  Object.keys(devices).forEach(deviceId => {
    const device = devices[deviceId]
    const collections = collectionsForDevices[deviceId]

    const binTypes = collections.map(c => c.bin.type)

    pushNotifications.push({
      device,
      title: `You have ${binTypes.length} collection${binTypes.length > 1 ? 's' : ''} tomorrow.`,
      body: `Remember to put out your ${listToHuman(binTypes)} bins`,
    })
  })

  await sendPushNotifications(pushNotifications)
}