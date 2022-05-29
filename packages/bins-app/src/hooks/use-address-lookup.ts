import { gql, useQuery } from "@apollo/client"
import { BinType, Outcome } from "@joshbalfour/canterbury-api/src"

type Address = {
  id: string
  formatted: string
  postcode: string
  firstLine: string
  bins?: Bin[]
}

const AddressLookup = gql`
  query addressLookup($postcode: String!) {
    addressLookup(postcode: $postcode) {
      id
      postcode
      formatted
      firstLine
    }
  }
`

const AddressLookupById = gql`
  query addressLookupById($addressId: String!) {
    addressLookupById(addressId: $addressId) {
      id
      postcode
      formatted
      firstLine
      bins {
        id
        type
        collections
        status {
          id
          date
          outcome
        }
      }
    }
  }
`

type APIBin = {
  id: string
  type: string
  collections: string[]
  status: {
    id: string
    date: string
    outcome: string
  }
}

export type Bin = {
  id: string
  type: BinType
  collections: Date[]
  status: {
    id: string
    date: Date
    outcome: Outcome
  }
}

const apiBinToBin = (apiBin: APIBin): Bin => ({
  id: apiBin.id,
  type: apiBin.type as BinType,
  collections: apiBin.collections.map(date => new Date(Date.parse(date))),
  status: {
    id: apiBin.status.id,
    date: new Date(Date.parse(apiBin.status.date)),
    outcome: apiBin.status.outcome as Outcome,
  },
})

export const useAddressLookup = (postcode: string) => {
  const { loading, error, data } = useQuery(AddressLookup, {
    variables: { postcode },
  })
  const addresses = data?.addressLookup || []

  return {
    loading,
    error,
    addresses: addresses as Address[],
  }
}

export const useAddressLookupById = (addressId: string) => {
  const { loading, error, data } = useQuery(AddressLookupById, {
    variables: { addressId },
  })
  const address = data?.addressLookupById

  return {
    loading,
    error,
    address: {
      ...address,
      bins: address?.bins?.map(apiBinToBin) || [],
    } as Address,
  }
}
