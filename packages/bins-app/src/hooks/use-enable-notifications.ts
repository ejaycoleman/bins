import { gql, useMutation } from "@apollo/client"

const EnableNotifications = gql`
  mutation enableNotifications($addressId: String!, $token: String!) {
    enableNotifications(addressId: $addressId, token: $token) {
      id
      addressId
      token
    }
  }
`

type Notification = {
  id: string
  addressId: string
  token: string
}

export const useEnableNotifications = (addressId: string) => {
  const [mutate, { loading, error }] = useMutation(EnableNotifications)

  return {
    loading,
    error,
    enableNotifications: async (token: string) => {
      const { data } = await mutate({
        variables: {
          addressId,
          token,
        },
      })

      return data?.enableNotifications as Notification
    },
  }
}
