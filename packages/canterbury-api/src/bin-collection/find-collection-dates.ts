import fetch from 'node-fetch'
import { defaultHeaders, stringToDateTime } from "../utils"
import { BinDates, BinDatesAPIResponse, BinStatus, CollectionDates, Outcome } from "./types"

const sanitizeOutcome = (outcome: string): Outcome => {
  // capitalize first letter of each word
  return outcome.replace(/\b\w/g, (l) => l.toUpperCase()) as Outcome
}

type BackendError = {
  errorType: string
  errorMessage: string 
}

const statusIsError = (status: BinStatus<string> | BackendError): status is BackendError => {
  return (status as BackendError).errorType !== undefined
}

export const coversAddress = async (uprn: string, usrn: string) : Promise<boolean> => {
  const res = await fetch('https://zbr7r13ke2.execute-api.eu-west-2.amazonaws.com/Beta/get-bin-dates', {
    headers: defaultHeaders,
    body: JSON.stringify({ uprn, usrn }),
    method: 'POST'
  })
  const json = await res.json() as BinDatesAPIResponse
  const dates = JSON.parse(json.dates) as BinDates<string>

  return !!dates.blackBinDay.length
}

export const findCollectionDates = async (uprn: string, usrn: string): Promise<CollectionDates> => {
  const res = await fetch('https://zbr7r13ke2.execute-api.eu-west-2.amazonaws.com/Beta/get-bin-dates', {
    headers: defaultHeaders,
    body: JSON.stringify({ uprn, usrn }),
    method: 'POST'
  })

  const json = await res.json() as BinDatesAPIResponse

  const dates = JSON.parse(json.dates) as BinDates<string>
  const status = JSON.parse(json.status) as (BinStatus<string> | BackendError)

  let statusToReturn: BinStatus<Date> | undefined

  if (!statusIsError(status)) {
    statusToReturn = {
      streetStatus: status.streetStatus.map(s => ({
        ...s,
        outcome: sanitizeOutcome(s.outcome),
        date: stringToDateTime(s.date),
      })),
      propertyStatus: status.propertyStatus,
      endDate: stringToDateTime(status.endDate),
    }
  }

  return { 
    dates: {
      ...dates,
      blackBinDay: dates.blackBinDay.map(stringToDateTime),
      foodBinDay: dates.foodBinDay.map(stringToDateTime),
      gardenBinDay: dates.gardenBinDay.map(stringToDateTime),
      recyclingBinDay: dates.recyclingBinDay.map(stringToDateTime),
    },
    status: statusToReturn,
  }
}
