import * as Notifications from 'expo-notifications'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { enableNotifications, useEnableNotifications } from './use-enable-notifications'
import { Platform } from 'react-native'
import { client } from '../graphql'

const namespace = 'binsapp'
const pushTokenKey = `${namespace}:pushToken2`

const getPushToken = async (): Promise<string | undefined> => (await AsyncStorage.getItem(pushTokenKey)) || undefined
export const persistPushToken = async (pushToken?: string) => {
  if (pushToken) {
    await AsyncStorage.setItem(pushTokenKey, pushToken)
  } else {
    await AsyncStorage.removeItem(pushTokenKey)
  }
}

export const usePushToken = () => {
  const [loading, setLoading] = useState(true)
  const [pushToken, setPushToken] = useState<string | undefined>(undefined)

  const refetch = async () => {
    const pushToken = await getPushToken()
    setPushToken(pushToken)
    setLoading(false)
  }

  useEffect(() => {
    refetch()
    const int = setInterval(refetch, 300)

    return () => {
      clearInterval(int)
    }
  })

  return {
    pushToken,
    loading,
    refetch,
  }
}

export const getRemotePushToken = async (): Promise<string | undefined> => {
  const pushToken = await getPushToken()
  if (pushToken) {
    return pushToken
  }

  if (Platform.OS === 'web') {
    return undefined
  }

  const permission = await Notifications.getPermissionsAsync()
  if (permission.status !== 'granted') {
    return undefined
  }

  try {
    const expoPushToken = await Notifications.getExpoPushTokenAsync({
      experienceId: '@joshbalfour/bins',
    })
    await persistPushToken(expoPushToken.data)
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return expoPushToken.data
  } catch (e) {
    console.error(e)
    return undefined
  }
}

export const runOnStart = async () => {
  const token = await getRemotePushToken()
  if (token) {
    await enableNotifications(token, client)
  }
}

export const usePushTokenHandler = () => {
  const { enableNotifications } = useEnableNotifications()

  const callback = async () => {
    const token = await getRemotePushToken()
    if (token) {
      await enableNotifications(token)
    }
  }

  useEffect(() => {
    const sub = Notifications.addPushTokenListener(callback)
    return () => {
      sub.remove()
    }
  }, [])
}
