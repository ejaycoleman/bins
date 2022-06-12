import React from 'react'
import styled from 'styled-components/native'
import { TouchableOpacity } from 'react-native'
import { useNavigate } from 'react-router-native'
import { TextSmallBold } from './Text'
import Svg, { Line, Path } from 'react-native-svg'

const TopBarContainer = styled.View`
  display: flex;
  width: 100%;
  flex-direction: row;
  padding-top: 25px;
  padding-bottom: 25px;
`

const Cog = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path fillRule="evenodd" clipRule="evenodd" d="M13.7155 1.86291C12.939 0.56694 11.061 0.566938 10.2844 1.8629L9.57865 3.04067C9.12576 3.79647 8.2316 4.16684 7.37693 3.95266L6.04507 3.6189C4.57956 3.25164 3.25164 4.57955 3.6189 6.04507L3.95266 7.37693C4.16684 8.2316 3.79647 9.12576 3.04067 9.57865L1.86291 10.2844C0.56694 11.061 0.566938 12.939 1.8629 13.7155L3.04067 14.4213C3.79647 14.8742 4.16684 15.7684 3.95266 16.623L3.6189 17.9549C3.25164 19.4204 4.57955 20.7483 6.04507 20.3811L7.37693 20.0473C8.2316 19.8331 9.12576 20.2035 9.57865 20.9593L10.2844 22.137C11.061 23.433 12.939 23.433 13.7155 22.1371L14.4213 20.9593C14.8742 20.2035 15.7684 19.8331 16.623 20.0473L17.9549 20.3811C19.4204 20.7483 20.7483 19.4204 20.3811 17.9549L20.0473 16.623C19.8331 15.7684 20.2035 14.8742 20.9593 14.4213L22.137 13.7155C23.433 12.939 23.433 11.061 22.1371 10.2844L20.9593 9.57865C20.2035 9.12576 19.8331 8.2316 20.0473 7.37693L20.3811 6.04507C20.7483 4.57956 19.4204 3.25164 17.9549 3.6189L16.623 3.95266C15.7684 4.16684 14.8742 3.79647 14.4213 3.04067L13.7155 1.86291ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79084 14.2091 7.99998 12 7.99998C9.79084 7.99998 7.99998 9.79084 7.99998 12C7.99998 14.2091 9.79084 16 12 16Z" fill="#FCFCFC"/>
  </Svg>
)

const Back = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M9.71729 5L3.00021 12L9.71729 19" stroke="#FCFCFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <Line x1="1" y1="-1" x2="16.7331" y2="-1" transform="matrix(1 0 0 -1 3.26709 11.0317)" stroke="#FCFCFC" stroke-width="2" stroke-linecap="round"/>
  </Svg>
)

export const TopBar = ({ isSettings }: { isSettings?: boolean }) => {
  const navigate = useNavigate()

  return (
    <TopBarContainer>
      <TextSmallBold style={{ flex: 1 }}>Bin App</TextSmallBold>
      {!isSettings && (
        <TouchableOpacity style={{
          position: 'absolute',
          right: 16,
          top: 28,
        }} onPress={async () => {
          navigate('/settings')
        }}>
          <Cog />
        </TouchableOpacity>
      )}
      {isSettings && (
        <TouchableOpacity style={{
          position: 'absolute',
          left: 16,
          top: 28,
        }} onPress={async () => {
          navigate(-1)
        }}>
          <Back />
        </TouchableOpacity>
      )}
      
    </TopBarContainer>
  )
}