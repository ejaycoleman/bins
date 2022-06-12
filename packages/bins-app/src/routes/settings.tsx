import { usePermissions, getExpoPushTokenAsync, requestPermissionsAsync } from 'expo-notifications'
import styled from 'styled-components/native'
import { useNavigate } from 'react-router-native'
import { HugeBold, TextSmallBold } from '../components/Text'
import React from 'react'
import { setHomeAddressId, useHomeAddressId } from '../hooks/use-home-addressId'
import { TopBar } from '../components/TopBar'
import { Button, ButtonVariant } from '../components/Button'
import { useEnableNotifications } from '../hooks/use-enable-notifications'
import { Alert, Linking, Platform, ScrollView, Share } from 'react-native'
import { useDownloadData } from '../hooks/use-download-data'
import { useHandleBack } from '../hooks/use-handle-back'

const Container = styled.SafeAreaView`
  flex: 1;
  align-items: flex-start;
`

const BinsContainer = styled.View`
  flex: 1;
  flex-direction: column;
  width: 100%;
  padding-left: 9px;
  padding-right: 9px;
  padding-bottom: 32px;
  padding-left: 12px;
  padding-right: 12px;
`

const TopTextContainer = styled.View`
  display: flex;
  flex-direction: column;
  padding-left: 9px;

  margin-bottom: 24px;
`

const PushNotificationButton = () => {
  const [status] = usePermissions()
  const { homeAddressId } = useHomeAddressId()
  const { disableNotifications, loading } = useEnableNotifications(homeAddressId)

  const disable = async () => {
    const expoPushToken = await getExpoPushTokenAsync({
      experienceId: '@joshbalfour/bins',
    })
    await disableNotifications(expoPushToken.data)
  }
  const enable = async () => {
    await requestPermissionsAsync()
  }

  return <Button loading={loading} text={
    status ? (
      status.granted ? 'Disable Notifications' : (
        status.canAskAgain ? 'Enable Notifications' : 'Enable Notifications from Settings'
      )
    ) : ''
  } onClick={async () => {
    if (status.granted) {
      await disable()
    } else {
      if (status.canAskAgain) {
        await enable()
      } else {
        Linking.openSettings()
      }
    }
  }} />
}

const ResetButton = ({ text, variant = 'primary' }: { text:string; variant: ButtonVariant }) => {
  const navigate = useNavigate()
  const { disableNotifications, loading } = useEnableNotifications()
  const [status] = usePermissions()

  const disable = async () => {
    if (status.granted) {
      const expoPushToken = await getExpoPushTokenAsync({
        experienceId: '@joshbalfour/bins',
      })
      await disableNotifications(expoPushToken.data)
    }
  }

  return (
    <Button text={text} variant={variant} loading={loading} onClick={async () => {
      if (Platform.OS === 'web') {
        if (confirm('Are you sure?')) {
          await disable()
          await setHomeAddressId(undefined)
          navigate('/')
        }
      }
      Alert.alert(text, 'Are you sure?', [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        { text: 'OK', onPress: async () => {
          await disable()
          await setHomeAddressId(undefined)
          navigate('/')
        } },
      ])
    }} />
  )
}

const DataExportButton = () => {
  const { downloadData, loading } = useDownloadData()

  return (
    <Button text="Download Your Data" loading={loading} onClick={async () => {
      const data = await downloadData()
      if (!data) {
        return alert('It looks like we don\'t have any data stored about you.')
      }
      if (Platform.OS === 'web') {
        // open new tab
        return window.open(`data:text/json;charset=utf-8,${encodeURIComponent(data)}`, '_blank')
      }
      Share.share({
        title: 'Your Bins Data',
        message: data,
      })
    }} />
  )
}

const Subtitle = styled(TextSmallBold)`
  text-align: left;
  margin-top: 32px;
  margin-bottom: 18px;
`

const Spacer = styled.View`
  height: 18px;
`

export const Settings = () => {
  useHandleBack()

  return (
    <Container>
      <TopBar isSettings />
      <ScrollView style={{ width: '100%', paddingHorizontal: 8 }}>
        <TopTextContainer>
          <HugeBold style={{ textAlign: 'left' }}>Settings</HugeBold>
        </TopTextContainer>
        <BinsContainer>
          <Subtitle style={{ marginTop: 0 }}>App Settings</Subtitle>
          <PushNotificationButton />
          <Spacer />
          <ResetButton text="Reset App" variant="primary" />

          <Subtitle>Your Data</Subtitle>
          <Button variant='text' text='View Privacy Policy' to="/privacy" />
          <Spacer />
          <DataExportButton />
          <Spacer />
          <ResetButton variant='text' text="Delete all Data and Reset App" />

          <Subtitle>The Developer</Subtitle>
          <Button variant='text' text='Find Out More' onClick={() => {
            Linking.openURL('https://joshbalfour.co.uk')
          } } />
          <Spacer />
          <Button variant='text' text='Contact Us' onClick={() => {
            Linking.openURL('mailto:bins@joshbalfour.co.uk')
          } } />
        </BinsContainer>
      </ScrollView>
    </Container>
  )
}
