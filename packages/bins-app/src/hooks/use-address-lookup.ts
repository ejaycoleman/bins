import { gql, useQuery } from "@apollo/client"

type Address = {
  id: string
  formatted: string
}

const AddressLookup = gql`
  query addressLookup($postcode: String!) {
    addressLookup(postcode: $postcode) {
      id
      formatted
    }
  }
`

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
