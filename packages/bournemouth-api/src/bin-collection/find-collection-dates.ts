import fetch from 'node-fetch'
import { BinType, CollectionDates } from './types'

const weirdDateToDate = (weirdDate: string): Date => {
  const utc = weirdDate.split('/Date(')[1].split(')/')[0]
  const date = new Date(parseInt(utc, 10))
  return date
}

type CollectionInfo = {
  Communal: boolean
  Next: string
  PdfLink: string
  Previous: string
}

type ApiResponse = Record<BinType, CollectionInfo>

export const findCollectionDates = async (uprn: string): Promise<CollectionDates[]> => {
  const res = await fetch(`https://online.bcpcouncil.gov.uk/customer/llpg/bindaylookup/?uprn=${uprn}`)
  const data: ApiResponse = await res.json()

  const collections = Object.entries(data).map(([type, info]) => ({
    type: type as BinType,
    collectionDates: [weirdDateToDate(info.Next), weirdDateToDate(info.Previous)],
  }))

  return collections
}
