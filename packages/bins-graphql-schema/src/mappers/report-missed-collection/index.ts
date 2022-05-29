import { Bin, ReportMissedCollection } from "../../entities/bin"

import * as canterbury from './canterbury'

export const reportMissedCollection = async (bin: Bin, extraInfo: any): Promise<ReportMissedCollection> => {
  const { address } = bin
  if (!address.binRegion) {
    throw new Error('Address does not have a bin region')
  }

  if (address.binRegion === 'canterbury') {
    await canterbury.reportMissedCollection(bin, extraInfo)
  }

  throw new Error('Bin region not supported')
}