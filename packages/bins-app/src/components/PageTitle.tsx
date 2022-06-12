import { Platform } from 'react-native'
import { useLocation } from 'react-router'

import { usePushTokenHandler } from '../hooks/use-push-token-handler'

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1)

const defaultText = `Get notified when your bins need taking out, and are collected.`

export const PageTitle = () => {
  usePushTokenHandler()
  const location = useLocation()
  if (Platform.OS === 'web') {
    const [,route] = location.pathname.split('/')
    document.title = `Bins - ${route ? capitalizeFirstLetter(route) : defaultText}`
  }
  return null
}