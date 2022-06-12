import * as Notifications from 'expo-notifications'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useEnableNotifications } from './use-enable-notifications'
import { useHomeAddressId } from './use-home-addressId'

const namespace = 'binsapp'
const pushTokenKey = `${namespace}:pushToken`

const getPushToken = async (): Promise<string | undefined> => (await AsyncStorage.getItem(pushTokenKey)) || undefined
const persistPushToken = async (pushToken?: string) => {
  if (pushToken) {
    await AsyncStorage.setItem(pushTokenKey, pushToken)
  } else {
    await AsyncStorage.removeItem(pushTokenKey)
  }
}

const usePushToken = () => {
  const [pushToken, setPushToken] = useState<string | null>(null)
  const sub = Notifications.addPushTokenListener(async () => {
    const expoPushToken = await Notifications.getExpoPushTokenAsync({
      experienceId: '@joshbalfour/bins',
    })
    setPushToken(expoPushToken.data)
  })

  useEffect(() => {
    return () => {
      sub.remove()
    }
  })

  return pushToken
}

export const usePushTokenHandler = () => {
  const { homeAddressId } = useHomeAddressId()
  const { enableNotifications } = useEnableNotifications(homeAddressId)
  const pushToken = usePushToken()

  useEffect(() => {
    if (pushToken) {
      getPushToken().then((persistedPushToken) => {
        if (persistedPushToken && persistedPushToken !== pushToken) {
          persistPushToken(pushToken).then(() => {
            enableNotifications(pushToken)
          })
        }
      })
    }
  }, [pushToken])
}
