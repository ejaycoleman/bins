import { AppDataSource } from "../../data-source"
import { Address } from "../../entities/address"

import * as canterbury from './canterbury'

export const findCollectionDates = async (address: Address) => {
  if (!address.binRegion) {
    // try all
    const collectionDates = await canterbury.getCollectionDates(address)
    if (collectionDates) {
      await AppDataSource.getRepository(Address).update(address.id, {
        binRegion: 'canterbury',
      })
      return collectionDates
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