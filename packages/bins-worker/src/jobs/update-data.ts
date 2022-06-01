import { AppDataSource, Bin, Address, updateAddressData, BinStatus, PushNotification, sendPushNotifications } from "@joshbalfour/bins-graphql-schema"
import { notEmpty } from "@joshbalfour/bins-graphql-schema/src/mappers/collection-dates/canterbury"

export const updateAllData = async () => {
  const bins = await AppDataSource.getRepository(Bin).find({
    relations: ['address', 'address.devices'],
  })
  const addresses: Record<string, Address> = {}
  bins.forEach(bin => {
    if (bin.address) {
      addresses[bin.address.id] = bin.address
    }
  })
  // chunk into groups of 5
  const addressChunks = Object.values(addresses).reduce((acc, address, i) => {
    if (i % 5 === 0) {
      acc.push([address])
    } else {
      acc[acc.length - 1].push(address)
    }

    return acc
  }, [] as Address[][])

  const statusChanges: BinStatus[] = []

  for (const addressChunk of addressChunks) {
    const chunkResults = await Promise.all(addressChunk.map(updateAddressData))
    statusChanges.push(...chunkResults.flat().map(c => c.changedStatuses).flat())
  }

  const pushNotifications: PushNotification[] = statusChanges.map(statusChange => {
    const body =`Your ${statusChange.bin.type} is now ${statusChange.outcome}`
    const title = `${statusChange.bin.type} bin update`
    const bin = bins.find(b => b.id === statusChange.bin.id)
    if (bin) {
      return bin.address.devices?.map(device => {
        return {
          device,
          title,
          body,
        }
      })
    }
  }).flat().filter(notEmpty)

  await sendPushNotifications(pushNotifications)
}
