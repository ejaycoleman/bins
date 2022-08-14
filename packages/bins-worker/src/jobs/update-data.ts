import { AppDataSource, Bin, Address, updateAddressData } from "@joshbalfour/bins-graphql-schema"

const chunk = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

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
  const addressChunks = chunk(Object.values(addresses), 5)

  for (const addressChunk of addressChunks) {
    await Promise.all(addressChunk.map(address => {
      return updateAddressData(address).catch(console.error)
    }))
  }
}
