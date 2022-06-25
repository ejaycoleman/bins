import React from 'react'
import { Linking, Platform } from 'react-native'
import styled from 'styled-components/native'

import { Button } from '../components/Button'
import { Logo } from '../components/Logo'
import { AppStoreButton, PlayStoreButton } from '../components/StoreButtons'
import { HugeBold, TextSmallBold } from '../components/Text'

const Center = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
  padding-left: 12px;
  padding-right: 12px;
`

const MediumLogo = styled(Logo)`
  width: 200px;
  height: 200px;
  margin-bottom: 24px;
`

const TextContainer = styled.View`
  display: flex;
  max-width: 420px;
  align-items: center;
`

const ButtonsContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
`

const Container = styled.View`
  display: flex;
  flex: 1;
`

const Footer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

export const LandingPage = () => (
  <Container>
    <Center>
      <MediumLogo />
      <TextContainer>
        <HugeBold>Bin Notifier</HugeBold>
        <TextSmallBold style={{ marginVertical: 21 }}>
          Get notified when your bins need taking out, and are collected.
        </TextSmallBold>
        {Platform.OS === 'web' && (
          <>
            <TextSmallBold style={{ marginVertical: 21 }}>
              Download the app to get push notifications
            </TextSmallBold>
            <ButtonsContainer>
              <AppStoreButton href='https://itunes.apple.com/gb/app/bin-notifier/id1629334191?mt=8' target="_blank" rel="noopener noreferrer" />
              <PlayStoreButton href='https://play.google.com/store/apps/details?id=com.joshbalfour.bins' target="_blank" rel="noopener noreferrer"/>
            </ButtonsContainer>
            <TextSmallBold style={{ marginVertical: 21 }}>or</TextSmallBold>
          </>
        )}
        <ButtonsContainer style={{ marginTop: 0 }}>
          <Button text={Platform.OS === 'web' ? 'Use in Browser' : 'Get Started'} to="/signup" />
        </ButtonsContainer>
      </TextContainer>
    </Center>
    {Platform.OS === 'web' && (
      <Footer>
        <Button text="by Josh Balfour" variant="text" onClick={() => {
          Linking.openURL('https://joshbalfour.co.uk')
        }} />
        <Button text="Privacy Policy" variant="text" to="/privacy" />
      </Footer>
    )}
  </Container>
)
