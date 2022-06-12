import styled from 'styled-components'

export const AppStoreButton = styled.a`
  width: 175px;
  height: 56px;
  background-image: url(${require('../../assets/app-store-download.svg')});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`

export const PlayStoreButton = styled.a`
  width: 220px;
  height: 56px;
  background-image: url(${require('../../assets/google-play-badge.png')});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`
