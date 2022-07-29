import { AppDataSource, Bin, Address, updateAddressData, BinStatus, PushNotification, sendPushNotifications } from "@joshbalfour/bins-graphql-schema"
import { notEmpty } from "@joshbalfour/bins-graphql-schema/src/mappers/collection-dates/utils"

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
  const newlySupportedAddresses: Address[] = []

  for (const addressChunk of addressChunks) {
    const chunkResults = await Promise.all(addressChunk.map(updateAddressData))
    statusChanges.push(...chunkResults.flat().map(c => c.changedStatuses).flat())
    newlySupportedAddresses.push(...chunkResults.flat().filter(c => c.binRegionChanged).map(c => c.address).flat())
  }

  const statusChangeNotifs: PushNotification[] = statusChanges.map(statusChange => {
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

  const newlySupportedNotifs: PushNotification[] = newlySupportedAddresses.map(address => {
    return address.devices?.map(device => {
      return {
        device,
        title: '🎉 We now support your address',
        body: 'You will now get notified when to put your bins out',
      }
    })
  }).flat().filter(notEmpty)

  await sendPushNotifications([
    ...newlySupportedNotifs,
    ...statusChangeNotifs,
  ])
}
