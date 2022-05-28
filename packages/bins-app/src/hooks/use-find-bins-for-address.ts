import { gql, useQuery } from "@apollo/client"
import { BinType, Outcome } from "@joshbalfour/canterbury-api"

const FindBinsForAddress = gql`
  query findBinsForAddress($addressId: String!) {
    findBinsForAddress(addressId: $addressId) {
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

type Bin = {
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
  collections: apiBin.collections.map(date => new Date(date)),
  status: {
    id: apiBin.status.id,
    date: new Date(apiBin.status.date),
    outcome: apiBin.status.outcome as Outcome,
  },
})

export const useFindBinsForAddress = (addressId: string) => {
  const { loading, error, data } = useQuery(FindBinsForAddress, {
    variables: { addressId },
  })
  const bins = (data?.findBinsForAddress || []) as APIBin[]

  return {
    loading,
    error,
    bins: bins.map(apiBinToBin) as Bin[],
  }
}
