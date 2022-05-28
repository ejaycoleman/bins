import AsyncStorage from '@react-native-community/async-storage'
import { useEffect, useState } from 'react'

const namespace = 'smartmeter'

const homeAddressKey = `${namespace}:homeAddressId`

export const getHomeAddressId = async () => (await AsyncStorage.getItem(homeAddressKey)) || undefined
export const setHomeAddressId = async (homeAddressId: string) => await AsyncStorage.setItem(homeAddressKey, homeAddressId)

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
