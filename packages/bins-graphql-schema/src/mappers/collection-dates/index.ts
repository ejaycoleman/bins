import { AppDataSource } from "../../data-source"
import { Address, BinRegion } from "../../entities/address"

import * as canterbury from './canterbury'
import * as basingstoke from './basingstoke'
import { CollectionDates } from "./types"

const findBinRegion = async (address: Address): Promise<BinRegion | undefined> => {
  try {
    const regionIsCanterbury = await canterbury.coversAddress(address)
    if (regionIsCanterbury) {
      return 'canterbury'
    }
  } catch (e) {
    // not supported
  }

  try {
    const regionIsBasingstoke = await basingstoke.coversAddress(address)
    if (regionIsBasingstoke) {
      return 'basingstoke'
    }
  } catch (e) {
    // not supported
  }
}

export const findCollectionDates = async (address: Address): Promise<CollectionDates[]> => {
  if (!address.binRegion) {
    const binRegion = await findBinRegion(address)
    address.binRegion = binRegion
    await AppDataSource.getRepository(Address).save(address)
  }

  switch (address.binRegion) {
    case 'canterbury':
      return canterbury.getCollectionDates(address)
    case 'basingstoke':
      return basingstoke.getCollectionDates(address)
    default:
      return []
  }
}