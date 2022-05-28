import fetch from 'node-fetch'
import { AddressResults } from "./types"
import { defaultHeaders } from "../utils"

export const addressLookup = async (postcode: string): Promise<AddressResults> => {
  const res = await fetch(`https://trsewmllv7.execute-api.eu-west-2.amazonaws.com/dev/address?type=standard&postcode=${postcode}`, {
    headers: defaultHeaders,
  })

  const json = await res.json()
  return json as AddressResults
}