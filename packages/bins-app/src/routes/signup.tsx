import React, { useState } from 'react'
import { Route, Routes, useNavigate, useParams } from 'react-router'
import styled from 'styled-components/native'
import { postcodeValidator } from 'postcode-validator'
import { Picker } from '@react-native-picker/picker'
import * as Notifications from 'expo-notifications'

import { Button } from '../components/Button'
import { TextInput } from '../components/Input'
import { Logo } from '../components/Logo'
import { HugeBold, TextSmall } from '../components/Text'
import { useAddressLookup } from '../hooks/use-address-lookup'
import { useEnableNotifications } from '../hooks/use-enable-notifications'
import { useHomeAddressId } from '../hooks/use-home-addressId'

const Header = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin-top: 72px;
  max-width: 258px;
  margin-bottom: 10px;
`

const Container = styled.View`
  align-items: center;
`

const SmallLogo = styled(Logo)`
  width: 84px;
  height: 84px;

  margin-bottom: 23px;
`

const Body = styled.View`
  margin-top: 64px;
  margin-bottom: 44px;

  max-width: 258px;
  align-items: center;
`

const Footer = styled.View`
  min-width: 327px;
  margin-top: 36px;
`

export const Step1 = () => {
  const [postcode, setPostcode] = useState('')
  const postcodeValid = postcodeValidator(postcode, 'GB')

  return (
    <Body>
      <TextSmall style={{ marginBottom: 21 }}>Enter your postcode</TextSmall>
      <TextInput name="postcode" placeholder="e.g. E2 7DG" autoCorrect={false} autoComplete="postcode" value={postcode} onChangeText={setPostcode} />

      <Footer>
        <Button text={"Continue"} disabled={!postcodeValid} to={`/signup/postcode/${postcode}`} />
      </Footer>
    </Body>
  )
}

export const Step2 = () => {
  const navigate = useNavigate()
  const { postcode } = useParams()
  const [addressId, setAddressId] = useState('')
  const { addresses, loading } = useAddressLookup(postcode)
  const { sethomeAddressId } = useHomeAddressId()

  return (
    <Body>
      <TextSmall style={{ marginBottom: 21 }}>Choose your address</TextSmall>
      <Picker
        selectedValue={addressId}
        enabled={!loading}
        onValueChange={(itemValue, itemIndex) => {
          sethomeAddressId(itemValue)
          setAddressId(itemValue)
        }}>
        {addresses.map(address => (
          <Picker.Item label={address.formatted} value={address.id} key={address.id} />
        ))}
      </Picker>

      <Footer>
        <Button text={"Back"} onClick={() => {
          navigate(-1)
        }} />
        <Button text={"Continue"} disabled={!addressId} to={`/signup/address/${addressId}`} />
      </Footer>
    </Body>
  )
}

export const Step3 = () => {
  const navigate = useNavigate()
  const { addressId } = useParams()
  const { enableNotifications } = useEnableNotifications(addressId)

  return (
    <Body>
      <TextSmall style={{ marginBottom: 21 }}>Turn on push notifications</TextSmall>
      <Button text={"Turn On"} onClick={async () => {
        const expoPushToken = await Notifications.getExpoPushTokenAsync({
          experienceId: '@joshbalfour/bins',
        })
        await enableNotifications(expoPushToken.data)
        navigate('/')
      }} />

      <Footer>
        <Button text={"Back"} onClick={() => {
          navigate(-1)
        }} />
        <Button text={"Skip"} onClick={() => {
          navigate('/')
        }} />
      </Footer>
    </Body>
  )
}

export const Signup = () => {
  return (
    <Container>
      <Header>
        <SmallLogo />
        <HugeBold>Bins App</HugeBold>
        <TextSmall>
          Get reminded when to put your bins out, and when to get them back.
        </TextSmall>
      </Header>
      <Routes>
        <Route path="/" element={<Step1 />} />
        <Route path="/postcode/:postcode" element={<Step2 />} />
        <Route path="/address/:addressId" element={<Step3 />} />
      </Routes>
    </Container>
  )
}
