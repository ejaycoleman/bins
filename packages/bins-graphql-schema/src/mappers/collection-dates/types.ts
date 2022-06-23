import { BinType, Outcome } from "@joshbalfour/bins-types"

export type CollectionStatus = {
  outcome: Outcome
  date: Date
  workpack: string
  id: string
}

export type CollectionDates = {
  type: BinType
  id: string
  collections: Date[]
  status?: CollectionStatus
}