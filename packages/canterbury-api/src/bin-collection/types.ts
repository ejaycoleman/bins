
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

export type Outcome = 'Reported Missed' | 'Collection Made' | 'Side Waste' /* purple sacks */ | 'More Than 1 Bin' /* only 1 black bin per household*/ | 'Bin Not Out' | 'Wrong Bin Put Out' | 'Bin Contaminated' | 'Bin Broken' | 'Bin Too Heavy' | 'Unable To Access' | 'Road Closed' | 'Severe Weather' | 'Due For Collection' | 'Road Still Blocked' | 'Road Blocked' | 'Road Blocked - Access' | 'Not Collected' | 'Not Subscribed' | 'Collection Delayed'  

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
  status?: BinStatus<DateType>
}

export type CollectionDates = ParsedBinDates<Date>