import * as Notifications from 'expo-notifications'
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useEnableNotifications } from './use-enable-notifications'
import { useHomeAddressId } from './use-home-addressId'

const namespace = 'binsapp'
const pushTokenKey = `${namespace}:pushToken`

const getPushToken = async (): Promise<string | undefined> => (await AsyncStorage.getItem(pushTokenKey)) || undefined
export const persistPushToken = async (pushToken?: string) => {
  if (pushToken) {
    await AsyncStorage.setItem(pushTokenKey, pushToken)
  } else {
    await AsyncStorage.removeItem(pushTokenKey)
  }
}

export const getRemotePushToken = async (): Promise<string | undefined> => {
  const pushToken = await getPushToken()
  if (pushToken) {
    return pushToken
  }

  const expoPushToken = await Notifications.getExpoPushTokenAsync({
    experienceId: '@joshbalfour/bins',
  })
  persistPushToken(expoPushToken.data)
  return expoPushToken.data
}

export const usePushTokenHandler = () => {
  const { homeAddressId } = useHomeAddressId()
  const { enableNotifications } = useEnableNotifications(homeAddressId)

  useEffect(() => {
    const sub = Notifications.addPushTokenListener(async () => {
      const token = await getRemotePushToken()
      if (token) {
        await enableNotifications(token)
      }
    })
    return () => {
      sub.remove()
    }
  })
}
