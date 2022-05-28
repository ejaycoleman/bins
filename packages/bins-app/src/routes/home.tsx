import { useParams } from 'react-router-native'
import styled from 'styled-components/native'
import { useAddressLookupById } from '../hooks/use-address-lookup'
import { Bin as BinType, useFindBinsForAddress } from '../hooks/use-find-bins-for-address'
import { Loading } from './loading'
import { HugeBold, TextSmallBold } from '../components/Text'
import React from 'react'
import { Bin } from '../components/Bin'
import { DateTime } from 'luxon'
import { Outcome } from '@joshbalfour/canterbury-api/src'

const bins = [{"id":"10094586076-5600924-General","type":"General","collections":["2022-06-11T00:00:00.000Z","2022-06-24T00:00:00.000Z","2022-07-08T00:00:00.000Z","2022-07-22T00:00:00.000Z","2022-08-05T00:00:00.000Z","2022-08-19T00:00:00.000Z"],"status":{"id":"10094586076-5600924-General-Waste-Refuse 11-270522","date":"2022-05-27T08:02:19.843Z","outcome":"Collection Made"}},{"id":"10094586076-5600924-Food","type":"Food","collections":["2022-06-06T00:00:00.000Z","2022-06-11T00:00:00.000Z","2022-06-17T00:00:00.000Z","2022-06-24T00:00:00.000Z","2022-07-01T00:00:00.000Z","2022-07-08T00:00:00.000Z","2022-07-15T00:00:00.000Z","2022-07-22T00:00:00.000Z","2022-07-29T00:00:00.000Z","2022-08-05T00:00:00.000Z","2022-08-12T00:00:00.000Z","2022-08-19T00:00:00.000Z","2022-08-26T00:00:00.000Z"],"status":{"id":"10094586076-5600924-Food-Waste-Food 1-270522","date":"2022-05-27T09:14:05.283Z","outcome":"Collection Made"}},{"id":"10094586076-5600924-Recycling","type":"Recycling","collections":["2022-06-06T00:00:00.000Z","2022-06-17T00:00:00.000Z","2022-07-01T00:00:00.000Z","2022-07-15T00:00:00.000Z","2022-07-29T00:00:00.000Z","2022-08-12T00:00:00.000Z","2022-08-26T00:00:00.000Z"],"status":{"id":"10094586076-5600924-Recycling-Waste-Recycling 4-200522","date":"2022-05-20T08:18:28.082Z","outcome":"Collection Made"}}]

const Container = styled.View`
  flex: 1;
  width: 1024px;
  align-items: flex-start;
`

const getOutcomeColor = (outcome: Outcome) => {
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
  height: 113px;

  display: flex;
  flex-direction: row;
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
`

const dateIsThisWeek = (date: DateTime) => {
  const today = DateTime.local()
  const thisWeek = today.startOf('week')
  const nextWeek = thisWeek.plus({ days: 7 })
  return date.startOf('day').isBetween(thisWeek, nextWeek)
}

const getBinText = ({ status, collections, isActive }: { status: BinType['status']; collections: Date[]; isActive?: boolean }) => {
  if (isActive) {
    // TODO - more of these
    return `${status.outcome} at ${DateTime.fromJSDate(status.date).toFormat(DateTime.TIME_SIMPLE)}`
  }

  const nextCollection = DateTime.fromJSDate(collections[0])

  return `${dateIsThisWeek(nextCollection) ? 'Next' : 'Next week'} collection ${nextCollection.toFormat('dddd')}`
}

const BinCard = ({ type, status, collections, isActive }: BinType & { isActive?: boolean }) => {
  return (
    <BinCardContainer outcome={status.outcome}>
      <Bin type={type} width={50} height={81} fillColor={getOutcomeColor(status.outcome)} />
      <TextContainer>
        <HugeBold style={{ textAlign: 'left' }}>{type}</HugeBold>
        <TextSmallBold>{getBinText({ status, collections, isActive })}</TextSmallBold>
      </TextContainer>
    </BinCardContainer>
  )
}

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

export const Home = () => {
  const { addressId } = useParams()
  const { loading, bins } = useFindBinsForAddress(addressId)
  const { address } = useAddressLookupById(addressId)

  if (loading || !address) {
    return <Loading />
  }

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
      <TopTextContainer>
        <TextSmallBold style={{ color: '#6E7191', textAlign: 'left' }}>Good Morning</TextSmallBold>
        <HugeBold style={{ textAlign: 'left' }}>{address.firstLine}</HugeBold>
      </TopTextContainer>
      <BinsContainer>
        {activeBins.map(bin => <BinCard isActive key={bin.id} {...bin} />)}
        <HugeBold style={{ marginTop: 58 }}>Coming up</HugeBold>
        {inactiveBins.map(bin => <BinCard key={bin.id} {...bin} />)}
      </BinsContainer>
    </Container>
  )
}
