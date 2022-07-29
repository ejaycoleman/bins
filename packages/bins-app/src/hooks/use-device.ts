import { gql, useQuery } from "@apollo/client"

const GetDevice = gql`
  query getDevice($token: String!) {
    getDevice(token: $token) {
      id
      token
    }
  }
`

export type Device = {
  id: string
  token: string
}

export const useDevice = (token?: string) => {
  const { loading, error, data } = useQuery(GetDevice, {
    variables: { token },
    skip: !token
  })
  const device = data?.getDevice

  return {
    loading,
    error,
    device: device as Device | undefined,
  }
}