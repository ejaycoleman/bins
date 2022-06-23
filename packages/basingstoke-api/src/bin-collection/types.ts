export type BinType = 'Refuse' | 'Recycling' | 'Glass' | 'GardenWaste'

export type BinCollection = {
  binType: BinType
  collectionDates: Date[]
}