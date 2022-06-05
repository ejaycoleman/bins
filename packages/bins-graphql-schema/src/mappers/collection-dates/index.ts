import { AppDataSource } from "../../data-source"
import { Address } from "../../entities/address"

import * as canterbury from './canterbury'

export const findCollectionDates = async (address: Address) => {
  if (!address.binRegion) {
    // try all
    try {
      const collectionDates = await canterbury.getCollectionDates(address)
      if (collectionDates) {
        await AppDataSource.getRepository(Address).update(address.id, {
          binRegion: 'canterbury',
        })
        return collectionDates
      }
    } catch (e) {
      // not supported
    }
  }

  if (address.binRegion) {
    if (address.binRegion === 'canterbury') {
      const collectionDates = await canterbury.getCollectionDates(address)
      if (collectionDates) {
        return collectionDates
      }
    }
  }

  return []
}