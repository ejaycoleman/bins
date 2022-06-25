import { CollectionDates as BournemouthCollectionDates, BinType as BournemouthBinType, findCollectionDates } from "@joshbalfour/bournemouth-api"
import { BinType } from "@joshbalfour/bins-types"
import { Address } from "../../entities/address"
import { CollectionDates } from "./types"

export const coversAddress = async (address: Address) => {
  const res = await getCollectionDates(address)
  return !!res.length
}

const normaliseBinType = (binType: BournemouthBinType): BinType => {
  switch (binType) {
    case 'Food Waste':
      return 'Food'
    case 'Garden Waste':
      return 'Garden'
    case 'Rubbish':
      return 'General'
    default:
      return binType
  }
}

const bournemouthCollectionToCollectionDates = (collection: BournemouthCollectionDates, addressId: string): CollectionDates => {
  const binType = normaliseBinType(collection.type)

  return {
    id: `${addressId}-${binType}`,
    type: binType,
    collections: collection.collectionDates,
  }
}

export const getCollectionDates = async (address: Address): Promise<CollectionDates[]> => {
  const collectionDates = await findCollectionDates(address.data.UPRN)
  return collectionDates.map(cd => bournemouthCollectionToCollectionDates(cd, address.id))
}
