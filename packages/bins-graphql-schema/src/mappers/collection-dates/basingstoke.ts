import { BinCollection, findCollectionDates, coversAddress as basingstokeCoversAddress, BinType as BasingstokeBinType } from "@joshbalfour/basingstoke-api"
import { BinType } from "@joshbalfour/bins-types"
import { Address } from "../../entities/address"
import { CollectionDates } from "./types"

export const coversAddress = (address: Address) => basingstokeCoversAddress(address.data.UPRN)

const normaliseBinType = (binType: BasingstokeBinType): BinType => {
  if (binType == 'Refuse') {
    return 'General'
  }

  if (binType === 'GardenWaste') {
    return 'Garden'
  }

  return binType
}

const basingstokeCollectionToCollectionDates = (collection: BinCollection, addressId: string): CollectionDates => {
  const { collectionDates } = collection
  const binType = normaliseBinType(collection.binType)

  return {
    id: `${addressId}-${binType}`,
    type: binType,
    collections: collectionDates,
  }
}

export const getCollectionDates = async (address: Address): Promise<CollectionDates[]> => {
  const collectionDates = await findCollectionDates(address.data.UPRN)
  return collectionDates.map(cd => basingstokeCollectionToCollectionDates(cd, address.id))
}
