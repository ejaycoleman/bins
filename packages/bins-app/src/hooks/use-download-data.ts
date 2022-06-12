import { gql, useLazyQuery } from "@apollo/client"
import { getExpoPushTokenAsync, usePermissions } from "expo-notifications"

const GetDevice = gql`
  query getDevice($token: String!) {
    getDevice(token: $token) {
      id
      address {
        id
        formatted
        postcode
        firstLine
        bins {
          id
          type
          collectionDates {
            date
          }
          collections
          statusHistory {
            id
            date
            outcome
          }
          status {
            id
            date
            outcome
          }
        }
        binRegion
      }
      token
    }
  }
`

export const useDownloadData = () => {
  const [query, { loading }] = useLazyQuery(GetDevice)
  const [status] = usePermissions()

  return {
    loading,
    downloadData: async () => {
      if (!status.granted) {
        return undefined
      }
      const expoPushToken = await getExpoPushTokenAsync({
        experienceId: '@joshbalfour/bins',
      })
      if (!expoPushToken?.data) {
        return undefined
      }
      const result = await query({ variables: { token: expoPushToken.data } })

      return result.data?.getDevice ? JSON.stringify(result.data?.getDevice, null, 2) : undefined
    }
  }
}
