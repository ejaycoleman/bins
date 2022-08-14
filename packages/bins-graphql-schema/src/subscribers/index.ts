import { AddressSubscriber } from "./address-subscriber"
import { BinStatusSubscriber } from "./bin-status-subscriber"

export const subscribers = [
  AddressSubscriber,
  BinStatusSubscriber,
]