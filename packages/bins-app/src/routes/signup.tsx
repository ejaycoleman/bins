import React, { useState } from 'react'
import { Route, Routes, useNavigate, useParams } from 'react-router'
import styled, { css } from 'styled-components/native'
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
import Svg, { Path } from 'react-native-svg'
import { Platform, SafeAreaView, ScrollView } from 'react-native'
import { AnimatedLoadingIndicator } from '../components/LoadingIndicator'

const Header = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  width: 327px;
`

const StyledContainer = styled.KeyboardAvoidingView.attrs({
  behavior: Platform.OS === 'ios' ? 'padding' : 'height',
})`
  align-items: center;
  flex: 1;
  width: 100%;
`

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StyledContainer>
          <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{
            flexGrow: 1,
          }}>
            {children}
          </ScrollView>
        </StyledContainer>
    </SafeAreaView>
  )
}

const SmallLogo = styled(Logo)`
  width: 64px;
  height: 64px;
`

const Body = styled.View`
  margin-top: 64px;
  margin-bottom: 24px;

  /* max-width: 258px; */
  align-items: center;
  flex: 1;
`

const Footer = styled.View`
  width: 331px;
  margin-top: 24px;
  flex-direction: row;
`

const StyledPicker = styled(Picker)`
  ${Platform.OS === 'web' ? css`
    appearance: none;

    padding: 16px;
    padding-left: 24px;
    padding-right: 40px;
  ` : ''}
  
  border: none;

  background-color: #4E4B66;
  color: #EFF0F6;
  border-radius: 15px;
  width: 303px;
`

const PickerContainer = styled.View`
  position: relative;
`


const StyledStepContainer = styled.View`
  flex-direction: column;
  align-items: center;
  background: #262338;
  border-radius: 16px;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 27px;
  padding-bottom: 27px;
  width: 328px;
`

const SCContainer = styled.View`
  flex: 1;
`

export const StepContainer = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <SCContainer style={style}>
    <StyledStepContainer>
      {children}
    </StyledStepContainer>
  </SCContainer>
)

export const Step1 = () => {
  const [postcode, setPostcode] = useState('')
  const postcodeValid = postcodeValidator(postcode, 'GB')

  return (
    <Body>
      <StepContainer>
        <TextSmall style={{ marginBottom: 21 }}>Enter your postcode</TextSmall>
        <TextInput autoFocus style={{ width: 303 }} name="postcode" placeholder="e.g. E2 7DG" autoCorrect={false} autoComplete="postcode" value={postcode} onChangeText={setPostcode} />
      </StepContainer>
      <Footer>
        <Button text={"Continue"} disabled={!postcodeValid} to={`/signup/postcode/${postcode}`} />
      </Footer>
    </Body>
  )
}

const Indicator = styled.View`
  position: absolute;
  right: 12px;
  top: 12px;
`

export const Step2 = () => {
  const navigate = useNavigate()
  const { postcode } = useParams()
  const [addressId, setAddressId] = useState('')
  const { addresses, loading } = useAddressLookup(postcode)
  const { sethomeAddressId } = useHomeAddressId()

  return (
    <Body>
      <StepContainer>
        <TextSmall style={{ marginBottom: 21 }}>Choose your address</TextSmall>
        <PickerContainer>
          <StyledPicker
            selectedValue={addressId}
            enabled={!loading}
            onValueChange={(itemValue, itemIndex) => {
              sethomeAddressId(itemValue)
              setAddressId(itemValue)
            }}
            itemStyle={{
              color: '#EFF0F6',
            }}
            dropdownIconColor="#D9DBE9"
            >
            {addresses.map(address => (
              <Picker.Item label={address.formatted} value={address.id} key={address.id} />
            ))}
          </StyledPicker>
          {Platform.OS === 'web' && (
            <Indicator>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path d="M19 9L12.0368 15.9632L5.07366 9" stroke="#D9DBE9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </Svg>
            </Indicator>
          )}
          <AnimatedLoadingIndicator loading={loading} size={64} style={{
            position: 'absolute',
            left: '50%',
            marginTop: -7,
            marginLeft: -32,
          }} />
        </PickerContainer>
      </StepContainer>

      <Footer>
        <Button text={"Back"} variant="text" onClick={() => {
          navigate(-1)
        }} />
        <Button text={"Continue"} disabled={!addressId} to={`/signup/address/${addressId}`} />
      </Footer>
    </Body>
  )
}

const ButtonContainer = styled.View`
  width: 303px;
  height: 56px;
`

export const Step3 = () => {
  const navigate = useNavigate()
  const { addressId } = useParams()
  const { enableNotifications, loading } = useEnableNotifications(addressId)

  return (
    <Body>
      <StepContainer>
        <TextSmall style={{ marginBottom: 21 }}>Turn on push notifications</TextSmall>
        <ButtonContainer>
          <Button loading={loading} text={"Turn On"} onClick={async () => {
            const expoPushToken = await Notifications.getExpoPushTokenAsync({
              experienceId: '@joshbalfour/bins',
            })
            await enableNotifications(expoPushToken.data)
            navigate('/')
          }} />
        </ButtonContainer>
      </StepContainer>

      <Footer>
        <Button variant="text" text={"Back"} onClick={() => {
          navigate(-1)
        }} />
        <Button variant="text" text={"Skip"} onClick={() => {
          navigate('/')
        }} />
      </Footer>
    </Body>
  )
}

const LogoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`

export const Signup = () => {
  return (
    <Container>
      <Header>
        <LogoContainer>
          <HugeBold style={{ marginTop: 16, marginBottom: 16, flex: 1, textAlign: 'center' }}>Bins App</HugeBold>
        </LogoContainer>
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
