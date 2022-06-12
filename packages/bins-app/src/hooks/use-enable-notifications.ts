import { gql, useMutation } from "@apollo/client"

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

type Notification = {
  id: string
  token: string
}

export const useEnableNotifications = (addressId?: string) => {
  const [mutateEnable, enableData] = useMutation(EnableNotifications)
  const [mutateDisable, disableData] = useMutation(DisableNotifications)

  return {
    loading: enableData.loading || disableData.loading,
    error: enableData.error || disableData.error,
    enableNotifications: async (token: string) => {
      if (!addressId) {
        throw new Error("addressId is required")
      }
      const { data } = await mutateEnable({
        variables: {
          addressId,
          token,
        },
      })

      return data?.enableNotifications as Notification
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
