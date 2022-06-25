
export type BinType = 'Food Waste' | 'Garden Waste' | 'Recycling' | 'Rubbish'
export type CollectionDates = {
  type: BinType
  collectionDates: Date[]
}