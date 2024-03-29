import { ApolloClient, gql, useMutation } from "@apollo/client"
import { getHomeAddressId } from "./use-home-addressId"

const EnableNotifications = gql`
  mutation enableNotifications($addressId: String!, $token: String!) {
    enableNotifications(addressId: $addressId, token: $token) {
      id
      token
    }
  }
`

const DisableNotifications = gql`
  mutation disableNotifications($token: String!) {
    disableNotifications(token: $token)
  }
`

type Device = {
  id: string
  token: string
}

export const enableNotifications = async (token: string, client: ApolloClient<any>) => {
  const addressId = await getHomeAddressId()

  if (addressId && token) {
    const { data, errors } = await client.mutate({
      mutation: EnableNotifications,
      variables: { addressId, token },
    })
    if (errors) {
      throw new Error(errors[0].message)
    }
    return data.enableNotifications as Device | undefined
  }
}

export const useEnableNotifications = () => {
  const [mutateEnable, enableData] = useMutation(EnableNotifications)
  const [mutateDisable, disableData] = useMutation(DisableNotifications)

  return {
    loading: enableData.loading || disableData.loading,
    error: enableData.error || disableData.error,
    enableNotifications: async (token: string) => {
      const addressId = await getHomeAddressId()
      try {
        if (!addressId) {
          throw new Error("addressId is required")
        }
        const result = await mutateEnable({ variables: { addressId, token } })
        return result.data?.enableNotifications as Device
      } catch (e) {
        console.error(e)
        return undefined
      }
    },
    disableNotifications: async (token: string) => {
      try {
        const { data } = await mutateDisable({
          variables: {
            token,
          },
        })

        return data?.disableNotifications
      } catch (e) {
        console.error(e)
        return false
      }
    },
  }
}
