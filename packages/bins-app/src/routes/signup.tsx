import React, { useState } from 'react'
import { Route, Routes, useNavigate, useParams } from 'react-router'
import styled, { css } from 'styled-components/native'
import { postcodeValidator } from 'postcode-validator'
import { Picker } from '@react-native-picker/picker'

import { Button } from '../components/Button'
import { TextInput } from '../components/Input'
import { HugeBold, TextSmall } from '../components/Text'
import { useAddressLookup } from '../hooks/use-address-lookup'
import { useHomeAddressId } from '../hooks/use-home-addressId'
import Svg, { Path } from 'react-native-svg'
import { Platform, SafeAreaView, ScrollView } from 'react-native'
import { AnimatedLoadingIndicator } from '../components/LoadingIndicator'
import { requestPermissionsAsync } from 'expo-notifications'

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

  ${Platform.OS === 'android' ? css`
    overflow: hidden;
    border-radius: 15px;
    background-color: #4E4B66;
    padding-left: 8px;
  ` : ''}
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
  ${Platform.OS === 'web' ? css`
    padding-bottom: 24px;
  ` : css`flex: 1;`}
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
  const navigate = useNavigate()

  return (
    <Body>
      <StepContainer>
        <TextSmall style={{ marginBottom: 21 }}>Enter your postcode</TextSmall>
        <TextInput onSubmitEditing={e => {
          e.preventDefault()
          e.stopPropagation()
          if (postcodeValid) {
            navigate(`/signup/postcode/${postcode}`)
          }
        }} autoFocus style={{ width: 303 }} name="postcode" placeholder="e.g. E2 7DG" autoCorrect={false} autoComplete="postcode" value={postcode} onChangeText={text => {
          setPostcode(text.trim())
        }} />
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
  const [addressId, setAddressId] = useState(undefined)
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
          {Platform.OS === 'web' && !loading && (
            <Indicator>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path d="M19 9L12.0368 15.9632L5.07366 9" stroke="#D9DBE9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </Svg>
            </Indicator>
          )}
          <AnimatedLoadingIndicator loading={loading} style={{
            position: 'absolute',
            top: 12,
            right: 12,
          }} fill="#D9DBE9" />
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
  const destination = `/home/${addressId}`
  return (
    <Body>
      <StepContainer>
        <TextSmall style={{ marginBottom: 21 }}>Turn on push notifications</TextSmall>
        <ButtonContainer>
          <Button text={"Turn On"} onClick={async () => {
            await requestPermissionsAsync()
            navigate(destination)
          }} />
        </ButtonContainer>
      </StepContainer>

      <Footer>
        <Button variant="text" text={"Back"} onClick={() => {
          navigate(-1)
        }} />
        <Button variant="text" text={"Skip"} onClick={() => {
          navigate(destination)
        }} />
      </Footer>
    </Body>
  )
}

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`

export const Signup = () => {
  return (
    <Container>
      <Header>
        <TitleContainer>
          <HugeBold style={{ marginTop: 16, marginBottom: 16, flex: 1, textAlign: 'center' }}>Bins App</HugeBold>
        </TitleContainer>
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
