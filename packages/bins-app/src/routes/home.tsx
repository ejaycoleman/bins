import { Text } from 'react-native'
import { useParams } from 'react-router-native'
import { useFindBinsForAddress } from '../hooks/use-find-bins-for-address'
import { Loading } from './loading'

export const Home = () => {
  const { addressId } = useParams()
  const { loading, bins } = useFindBinsForAddress(addressId)

  if (loading) {
    return <Loading />
  }

  console.log(bins)

  return <Text>{JSON.stringify(bins)}</Text>
}
