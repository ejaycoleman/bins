import fetch from 'node-fetch'
import { defaultHeaders, stringToDateTime } from "../utils"
import { BinDates, BinDatesAPIResponse, BinStatus, CollectionDates } from "./types"

export const findCollectionDates = async (uprn: string, usrn: string): Promise<CollectionDates> => {
  const res = await fetch('https://zbr7r13ke2.execute-api.eu-west-2.amazonaws.com/Beta/get-bin-dates', {
    headers: defaultHeaders,
    body: JSON.stringify({ uprn, usrn }),
    method: 'POST'
  })

  const json = await res.json() as BinDatesAPIResponse
  const dates = JSON.parse(json.dates) as BinDates<string>
  const status = JSON.parse(json.status) as BinStatus<string>

  return { 
    dates: {
      ...dates,
      blackBinDay: dates.blackBinDay.map(stringToDateTime),
      foodBinDay: dates.foodBinDay.map(stringToDateTime),
      gardenBinDay: dates.gardenBinDay.map(stringToDateTime),
      recyclingBinDay: dates.recyclingBinDay.map(stringToDateTime),
    },
    status: {
      streetStatus: status.streetStatus.map(s => ({
        ...s,
        date: stringToDateTime(s.date),
      })),
      propertyStatus: status.propertyStatus,
      endDate: stringToDateTime(status.endDate),
    },
  }
}
