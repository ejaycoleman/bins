export type BinType = 'HOUSEHOLD' | 'RECYCLING' | 'GLASS'
export type CollectionDates = {
  type: BinType
  collectionDates: Date[]
}