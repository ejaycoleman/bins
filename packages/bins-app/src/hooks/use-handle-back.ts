import { useEffect } from "react"
import { BackHandler } from "react-native"
import { useNavigate } from "react-router-native"

export const useHandleBack = (enabled?: boolean) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (enabled) {
      const handler = BackHandler.addEventListener('hardwareBackPress', () => {
        navigate(-1)
        return true
      })

      return () => handler.remove()
    }
  }, [enabled])
}
