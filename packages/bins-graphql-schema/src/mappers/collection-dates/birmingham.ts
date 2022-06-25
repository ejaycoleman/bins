import { CollectionDates as BirminghamCollectionDates, BinType as BirminghamBinType, findCollectionDates } from "@joshbalfour/birmingham-api"
import { BinType } from "@joshbalfour/bins-types"
import { Address } from "../../entities/address"
import { CollectionDates } from "./types"

export const coversAddress = async (address: Address) => {
  const res = await getCollectionDates(address)
  return !!res.length
}

const normaliseBinType = (binType: BirminghamBinType): BinType => {
  if (binType == 'Household') {
    return 'General'
  }

  return binType
}

const birminghamCollectionToCollectionDates = (collection: BirminghamCollectionDates, addressId: string): CollectionDates => {
  const { date } = collection
  const binType = normaliseBinType(collection.type)

  return {
    id: `${addressId}-${binType}`,
    type: binType,
    collections: [date],
  }
}

export const getCollectionDates = async (address: Address): Promise<CollectionDates[]> => {
  const collectionDates = await findCollectionDates(address.postcode, address.data.UPRN)
  return collectionDates.map(cd => birminghamCollectionToCollectionDates(cd, address.id))
}
