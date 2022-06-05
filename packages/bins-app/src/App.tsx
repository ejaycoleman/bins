import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import { Router } from './router'
import { Route, Routes, useNavigate } from 'react-router'
import { ApolloProvider } from '@apollo/client'
import { useFonts, Poppins_700Bold, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins'

import { client } from './graphql'
import { Loading } from './routes/loading'
import { offBlack, offWhite } from './colors'
import { Signup } from './routes/signup'
import { useHomeAddressId } from './hooks/use-home-addressId'
import { Home } from './routes/home'

const Redirect = () => {
  const { homeAddressId, loading } = useHomeAddressId()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) {
      return
    }
    if (homeAddressId) {
      navigate(`/home/${homeAddressId}`)
    } else {
      navigate('/signup')
    }
  }, [homeAddressId, loading])

  if (loading) {
    return <Loading />
  }

  return null
}

export default function App() {
  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_400Regular,
  })

  if (!fontsLoaded) {
    return (
      <Containers>
        <Loading />
      </Containers>
    )
  }

  return (
    <Containers>
      <StatusBar style="auto" />
      <ApolloProvider client={client}>
        <Router>
          <Routes>
            <Route path="/" element={<Redirect />} />
            <Route path="/signup/*" element={<Signup />} />
            <Route path="/home/:addressId" element={<Home />} />
          </Routes>
        </Router>
      </ApolloProvider>
    </Containers>
  )
}

const Containers = ({ children }: { children: any }) => (
  <View style={styles.container}>
    <View style={styles.subcontainer}>
      {children}
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: offBlack,
    color: offWhite,
  },
  subcontainer: {
    flex: 1,
    maxWidth: 812,
    width: '100%',
    marginHorizontal: 'auto',
  },
})
