import { CollectionDates as SouthamptonCollectionDates, BinType as SouthamptonBinType, findCollectionDates } from "@joshbalfour/southampton-api"
import { BinType } from "@joshbalfour/bins-types"
import { Address } from "../../entities/address"
import { CollectionDates } from "./types"

export const coversAddress = async (address: Address) => {
  const res = await getCollectionDates(address)
  return !!res.length
}

const normaliseBinType = (binType: SouthamptonBinType): BinType => {
  switch (binType) {
    case 'HOUSEHOLD':
      return 'General'
    case 'GLASS':
      return 'Glass'
    case 'RECYCLING': 
      return 'Recycling'
    default:
      return binType
  }
}

const southamptonCollectionToCollectionDates = (collection: SouthamptonCollectionDates, addressId: string): CollectionDates => {
  const binType = normaliseBinType(collection.type)

  return {
    id: `${addressId}-${binType}`,
    type: binType,
    collections: collection.collectionDates,
  }
}

export const getCollectionDates = async (address: Address): Promise<CollectionDates[]> => {
  const collectionDates = await findCollectionDates(address.data.UPRN)
  return collectionDates.map(cd => southamptonCollectionToCollectionDates(cd, address.id))
}
