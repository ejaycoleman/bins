import { useParams } from 'react-router-native'
import styled from 'styled-components/native'
import { useAddressLookupById, Bin as BinType } from '../hooks/use-address-lookup'
import { Loading } from './loading'
import { HugeBold, TextSmallBold } from '../components/Text'
import React from 'react'
import { Bin } from '../components/Bin'
import { DateTime } from 'luxon'
import { Outcome } from '@joshbalfour/canterbury-api/src'
import Svg, { Path } from 'react-native-svg'
import { TouchableOpacity } from 'react-native'

const bins = [{"id":"10094586076-5600924-General","type":"General","collections":["2022-06-11T00:00:00.000Z","2022-06-24T00:00:00.000Z","2022-07-08T00:00:00.000Z","2022-07-22T00:00:00.000Z","2022-08-05T00:00:00.000Z","2022-08-19T00:00:00.000Z"],"status":{"id":"10094586076-5600924-General-Waste-Refuse 11-270522","date":"2022-05-27T08:02:19.843Z","outcome":"Collection Made"}},{"id":"10094586076-5600924-Food","type":"Food","collections":["2022-06-06T00:00:00.000Z","2022-06-11T00:00:00.000Z","2022-06-17T00:00:00.000Z","2022-06-24T00:00:00.000Z","2022-07-01T00:00:00.000Z","2022-07-08T00:00:00.000Z","2022-07-15T00:00:00.000Z","2022-07-22T00:00:00.000Z","2022-07-29T00:00:00.000Z","2022-08-05T00:00:00.000Z","2022-08-12T00:00:00.000Z","2022-08-19T00:00:00.000Z","2022-08-26T00:00:00.000Z"],"status":{"id":"10094586076-5600924-Food-Waste-Food 1-270522","date":"2022-05-27T09:14:05.283Z","outcome":"Collection Made"}},{"id":"10094586076-5600924-Recycling","type":"Recycling","collections":["2022-06-06T00:00:00.000Z","2022-06-17T00:00:00.000Z","2022-07-01T00:00:00.000Z","2022-07-15T00:00:00.000Z","2022-07-29T00:00:00.000Z","2022-08-12T00:00:00.000Z","2022-08-26T00:00:00.000Z"],"status":{"id":"10094586076-5600924-Recycling-Waste-Recycling 4-200522","date":"2022-05-20T08:18:28.082Z","outcome":"Collection Made"}}]

const Container = styled.View`
  flex: 1;
  /* width: 1024px; */
  align-items: flex-start;
`

const getOutcomeColor = (outcome?: Outcome) => {
  switch (outcome) {
    case 'Collection Made':
      return '#067306'
    default:
      return '#262338'
  }
}

const BinCardContainer = styled.View<{ outcome: Outcome }>`
  margin-bottom: 20px;
  border-radius: 32px;

  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;

  ${({ outcome }: { outcome: Outcome }) => {
    return `
      background-color: ${getOutcomeColor(outcome)};
    `
  }}
`

const TextContainer = styled.View`
  display: flex;
  margin-left: 26px;
  flex: 1;
`

const getBinText = ({ status, collections, isActive }: { status: BinType['status']; collections: Date[]; isActive?: boolean }) => {
  if (isActive) {
    // TODO - more of these
    return `${status.outcome} at ${DateTime.fromJSDate(status.date).toFormat(DateTime.TIME_SIMPLE)}`
  }

  const nextCollection = DateTime.fromJSDate(collections[0])

  return nextCollection.toRelative()
}

const InfoIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path fill-rule="evenodd" clip-rule="evenodd" d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM12 6C12.5523 6 13 6.44772 13 7V12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12V7C11 6.44772 11.4477 6 12 6ZM12 15C12.5523 15 13 15.4477 13 16V16.5C13 17.0523 12.5523 17.5 12 17.5C11.4477 17.5 11 17.0523 11 16.5V16C11 15.4477 11.4477 15 12 15Z" fill="#FCFCFC"/>
  </Svg>
)

const CheckIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path fill-rule="evenodd" clip-rule="evenodd" d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM9.70711 11.2426C9.31658 10.8521 8.68342 10.8521 8.29289 11.2426C7.90237 11.6331 7.90237 12.2663 8.29289 12.6568L10.4142 14.7781L11.1213 15.4852L11.8284 14.7781L16.0711 10.5355C16.4616 10.145 16.4616 9.5118 16.0711 9.12128C15.6805 8.73076 15.0474 8.73076 14.6569 9.12128L11.1213 12.6568L9.70711 11.2426Z" fill="#F2F2F2"/>
  </Svg>
)

const BinCard = ({ type, status, collections, isActive }: BinType & { isActive?: boolean }) => (
  <BinCardContainer outcome={isActive && status.outcome}>
    <Bin type={type} width={50} height={75} fillColor={getOutcomeColor(isActive ? status.outcome : undefined)} />
    <TextContainer>
      <HugeBold style={{ textAlign: 'left' }}>{type}</HugeBold>
      <TextSmallBold style={{ textAlign: 'left' }}>{getBinText({ status, collections, isActive })}</TextSmallBold>
    </TextContainer>
    {isActive && 
      status.outcome === 'Collection Made' && <CheckIcon />}
    {isActive && 
      status.outcome !== 'Collection Made' && <InfoIcon />}
  </BinCardContainer>
)

const BinsContainer = styled.View`
  flex: 1;
  flex-direction: column;
  width: 100%;
  padding-left: 9px;
  padding-right: 9px;
`

const TopTextContainer = styled.View`
  display: flex;
  flex-direction: column;
  padding-left: 9px;

  margin-top: 34px;
  margin-bottom: 57px;
`
const isToday = (someDate: Date) => {
  const today = new Date()

  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}

const isTomorrow = (someDate: Date) => {
  const today = new Date()
  today.setDate(today.getDay() + 1)

  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}

const TopBar = styled.View`
  display: flex;
  width: 100%;
  flex-direction: row;
  padding-top: 25px;
`

const Cog = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path fill-rule="evenodd" clip-rule="evenodd" d="M13.7155 1.86291C12.939 0.56694 11.061 0.566938 10.2844 1.8629L9.57865 3.04067C9.12576 3.79647 8.2316 4.16684 7.37693 3.95266L6.04507 3.6189C4.57956 3.25164 3.25164 4.57955 3.6189 6.04507L3.95266 7.37693C4.16684 8.2316 3.79647 9.12576 3.04067 9.57865L1.86291 10.2844C0.56694 11.061 0.566938 12.939 1.8629 13.7155L3.04067 14.4213C3.79647 14.8742 4.16684 15.7684 3.95266 16.623L3.6189 17.9549C3.25164 19.4204 4.57955 20.7483 6.04507 20.3811L7.37693 20.0473C8.2316 19.8331 9.12576 20.2035 9.57865 20.9593L10.2844 22.137C11.061 23.433 12.939 23.433 13.7155 22.1371L14.4213 20.9593C14.8742 20.2035 15.7684 19.8331 16.623 20.0473L17.9549 20.3811C19.4204 20.7483 20.7483 19.4204 20.3811 17.9549L20.0473 16.623C19.8331 15.7684 20.2035 14.8742 20.9593 14.4213L22.137 13.7155C23.433 12.939 23.433 11.061 22.1371 10.2844L20.9593 9.57865C20.2035 9.12576 19.8331 8.2316 20.0473 7.37693L20.3811 6.04507C20.7483 4.57956 19.4204 3.25164 17.9549 3.6189L16.623 3.95266C15.7684 4.16684 14.8742 3.79647 14.4213 3.04067L13.7155 1.86291ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79084 14.2091 7.99998 12 7.99998C9.79084 7.99998 7.99998 9.79084 7.99998 12C7.99998 14.2091 9.79084 16 12 16Z" fill="#FCFCFC"/>
  </Svg>
)

export const Home = () => {
  const { addressId } = useParams()
  const { loading, address } = useAddressLookupById(addressId)

  if (loading || !address) {
    return <Loading />
  }

  const { bins } = address

  const activeBins = bins.filter(bin => {
    // collection is today or tomorrow
    const collectionIsTodayOrTomorrow = bin.collections.some(collection => {
      return isToday(collection) || isTomorrow(collection)
    })
    // status is not "Collection Made"
    const collectionNotMade = bin.status.outcome !== 'Collection Made'
    // was collected today
    const collectedToday = isToday(bin.status.date) && bin.status.outcome === 'Collection Made'

    console.log(bin.type,{ collectionIsTodayOrTomorrow, collectionNotMade, collectedToday})

    return collectionIsTodayOrTomorrow || collectionNotMade || collectedToday
  })

  const inactiveBins = bins.filter(bin => !activeBins.some(activeBin => activeBin.id === bin.id))

  return (
    <Container>
      <TopBar>
        <TextSmallBold style={{ flex: 1 }}>Bin App</TextSmallBold>
        <TouchableOpacity>
          <Cog />
        </TouchableOpacity>
      </TopBar>
      <TopTextContainer>
        <TextSmallBold style={{ color: '#6E7191', textAlign: 'left' }}>Good Morning</TextSmallBold>
        <HugeBold style={{ textAlign: 'left' }}>{address.firstLine}</HugeBold>
      </TopTextContainer>
      <BinsContainer>
        {activeBins.map(bin => <BinCard isActive key={bin.id} {...bin} />)}
        {!!activeBins.length && <HugeBold style={{ marginTop: 58, textAlign: 'left' }}>Coming up</HugeBold>}
        {inactiveBins.sort((a, b) => {
          return DateTime.fromJSDate(a.collections[0]).diff(DateTime.fromJSDate(b.collections[0]))
        }).map(bin => <BinCard key={bin.id} {...bin} />)}
      </BinsContainer>
    </Container>
  )
}
