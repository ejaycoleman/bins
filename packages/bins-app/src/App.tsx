import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Platform, StyleSheet, View } from 'react-native'
import { Router } from './router'
import { Route, Routes, useNavigate } from 'react-router'
import { ApolloProvider } from '@apollo/client'
import { useFonts, Poppins_700Bold, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins'
import * as NavigationBar from 'expo-navigation-bar'

import { client } from './graphql'
import { Loading } from './routes/loading'
import { offBlack, offWhite } from './colors'
import { Signup } from './routes/signup'
import { useHomeAddressId } from './hooks/use-home-addressId'
import { Home } from './routes/home'
import { Settings } from './routes/settings'
import { PageTitle } from './components/PageTitle'
import { Privacy } from './routes/privacy'
import { LandingPage } from './routes/landing-page'
import { PushTokenHandler } from './components/PushTokenHandler'

const Redirect = () => {
  const { homeAddressId, loading } = useHomeAddressId()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) {
      return
    }
    if (homeAddressId) {
      navigate(`/home/${homeAddressId}`)
    }
  }, [homeAddressId, loading])

  if (loading) {
    return <Loading />
  }

  return <LandingPage />
}

export default function App() {
  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_400Regular,
  })

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(offBlack)
    }
  }, [])

  if (!fontsLoaded) {
    return (
      <Containers>
        <Loading />
      </Containers>
    )
  }

  return (
    <Containers>
      <StatusBar style="light" backgroundColor={offBlack} />
      <ApolloProvider client={client}>
        <Router>
          <Routes>
            <Route path="/" element={<Redirect />} />
            <Route path="/signup/*" element={<Signup />} />
            <Route path="/home/:addressId" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
          <PageTitle />
          <PushTokenHandler />
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
    paddingHorizontal: Platform.OS === 'android' ? 8 : 0,
    paddingTop: Platform.OS === 'android' ? 32 : 0,
    width: '100%',
    marginHorizontal: 'auto',
  },
})
