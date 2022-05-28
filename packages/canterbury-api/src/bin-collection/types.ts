
export type BinDatesAPIResponse = {
  dates: string
  status: string
}

export type BinDates<DateType> = {
  blackBinDay: DateType[]
  recyclingBinDay: DateType[]
  gardenBinDay: DateType[]
  foodBinDay: DateType[]
  postcode: string
  firstLine: string
  validWorkpacks: string[]
  relatedUprn?: string
}

export type BinType = 'General' | 'Food' | 'Recycling' | 'Garden' | 'Black bin' | 'Red recycling' | 'Blue Recycling'
export const binTypes: BinType[] = ['General', 'Food', 'Recycling', 'Garden', 'Black bin', 'Red recycling', 'Blue Recycling']

export type Outcome = 'Reported Missed' | 'Collection Made' | 'Side waste' /* purple sacks */ | 'More than 1 bin' /* only 1 black bin per household*/ | 'Bin not out' | 'Wrong bin put out' | 'Bin contaminated' | 'Bin broken' | 'Bin too heavy' | 'Unable to access' | 'Road closed' | 'Severe weather' | 'Due for collection' | 'Road still blocked' | 'Road blocked' | 'Road blocked - access' | 'Not collected' | 'Not subscribed' | 'Collection delayed'

export type StreetStatus<DateType> = {
  date: DateType
  workpack: string
  type: BinType
  outcome: Outcome
}

export type BinStatus<DateType> = {
  streetStatus: StreetStatus<DateType>[]
  propertyStatus: any[],
  endDate: DateType
}

export type ParsedBinDates<DateType> = {
  dates: BinDates<DateType>
  status: BinStatus<DateType>
}

export type CollectionDates = ParsedBinDates<Date>