import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'

const namespace = 'binsapp'

const homeAddressKey = `${namespace}:homeAddressId`

export const getHomeAddressId = async () => (await AsyncStorage.getItem(homeAddressKey)) || undefined
export const setHomeAddressId = async (homeAddressId?: string) => {
  if (homeAddressId) {
    await AsyncStorage.setItem(homeAddressKey, homeAddressId)
  } else {
    await AsyncStorage.removeItem(homeAddressKey)
  }
}

export const useHomeAddressId = () => {
  const [loading, setLoading] = useState(true)
  const [homeAddressId, setHomeAddressIdState] = useState<string | undefined>(undefined)

  useEffect(() => {
    getHomeAddressId().then((homeAddressId) => {
      setHomeAddressIdState(homeAddressId)
      setLoading(false)
    })
  }, [])

  const sethomeAddressId = async (homeAddressId: string) => {
    await setHomeAddressId(homeAddressId)
    setHomeAddressIdState(homeAddressId)
  }

  return {
    homeAddressId,
    sethomeAddressId,
    loading,
  }
}
