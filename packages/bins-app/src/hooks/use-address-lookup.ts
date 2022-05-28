import { gql, useQuery } from "@apollo/client"

type Address = {
  id: string
  formatted: string
  postcode: string
  firstLine: string
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

export const useAddressLookupById = (addressId: string) => {
  const { loading, error, data } = useQuery(AddressLookupById, {
    variables: { addressId },
  })
  const address = data?.addressLookupById

  return {
    loading,
    error,
    address: address as Address,
  }
}
