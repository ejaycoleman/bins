import { Platform } from 'react-native'
import { useLocation } from 'react-router'

import { usePushTokenHandler } from '../hooks/use-push-token-handler'

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1)

export const PageTitle = () => {
  usePushTokenHandler()
  const location = useLocation()
  if (Platform.OS === 'web') {
    const [,route] = location.pathname.split('/')
    document.title = `Bins - ${capitalizeFirstLetter(route)}`
  }
  return null
}