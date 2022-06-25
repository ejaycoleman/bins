import { useParams } from 'react-router-native'
import styled from 'styled-components/native'
import { useAddressLookupById, Bin as BinType } from '../hooks/use-address-lookup'
import { HugeBold, TextSmallBold } from '../components/Text'
import React from 'react'
import { Bin } from '../components/Bin'
import Svg, { Path, Rect } from 'react-native-svg'
import { RefreshControl } from 'react-native'
import { StepContainer } from './signup'
import { AnimatedLoadingIndicator } from '../components/LoadingIndicator'
import { TopBar } from '../components/TopBar'
import { dayjs } from '../dayjs'
import { Outcome } from '@joshbalfour/bins-types'
import { offWhite } from '../colors'

const Container = styled.SafeAreaView`
  flex: 1;
  /* width: 1024px; */
  align-items: flex-start;
`

const getOutcomeColor = (outcome?: Outcome) => {
  if (!outcome) return '#262338'
  switch (outcome) {
    case 'Collection Made':
      return '#067306'
    default:
      return '#FF75CB'
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

const formatDate = (date: Date) => {
  if (dayjs(date).isToday()) return 'Today'
  if (dayjs(date).isTomorrow()) return 'Tomorrow'
  if (dayjs(date).isYesterday()) return 'Yesterday'

  return dayjs(date).format('EEEE')
}

const getBinText = ({ status, collections, isActive }: { status?: BinType['status']; collections: Date[]; isActive?: boolean }) => {
  if (isActive && status) {
    const dt = dayjs(status.date)
    return `${status.outcome} ${formatDate(status.date)} at ${dt.format('HH:MM a')}`
  }

  const nextCollection = dayjs(collections.filter(c => dayjs(c).isAfter(dayjs()))[0])

  if (nextCollection.isToday()) {
    return 'Today'
  }
  if (nextCollection.isTomorrow()) {
    return 'Tomorrow'
  }

  // TODO: not sure which option here will be best

  // if (nextCollection.isBefore(dayjs().add(1, 'week'))) {
  //   return `This ${nextCollection.format('dddd')}`
  // }
  if (nextCollection.isAfter(dayjs().add(1, 'week'))) {
    return `Next ${nextCollection.format('dddd')}`
  }

  const inNdays = nextCollection.from(dayjs().startOf('day'))
  // capitalise first letter
  // return inNdays.charAt(0).toUpperCase() + inNdays.slice(1)
  return inNdays
}

const InfoIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path fillRule="evenodd" clipRule="evenodd" d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM12 6C12.5523 6 13 6.44772 13 7V12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12V7C11 6.44772 11.4477 6 12 6ZM12 15C12.5523 15 13 15.4477 13 16V16.5C13 17.0523 12.5523 17.5 12 17.5C11.4477 17.5 11 17.0523 11 16.5V16C11 15.4477 11.4477 15 12 15Z" fill="#FCFCFC"/>
  </Svg>
)

const CheckIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path fillRule="evenodd" clipRule="evenodd" d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM9.70711 11.2426C9.31658 10.8521 8.68342 10.8521 8.29289 11.2426C7.90237 11.6331 7.90237 12.2663 8.29289 12.6568L10.4142 14.7781L11.1213 15.4852L11.8284 14.7781L16.0711 10.5355C16.4616 10.145 16.4616 9.5118 16.0711 9.12128C15.6805 8.73076 15.0474 8.73076 14.6569 9.12128L11.1213 12.6568L9.70711 11.2426Z" fill="#F2F2F2"/>
  </Svg>
)

const BinCard = ({ type, status, collections, isActive }: BinType & { isActive?: boolean }) => {
  const collectionDateDiff = dayjs(collections[0]).diff(dayjs().add(2, 'days'), 'day')
  const collectedToday = dayjs(collections[0]).isToday()
  const collectionSoon = collections.length > 0 && collectionDateDiff < 0
  const isReallyActive = isActive && (!collectionSoon || collectedToday)

  return (
    <BinCardContainer outcome={isReallyActive && status?.outcome}>
      <Bin type={type} width={50} height={75} fillColor={getOutcomeColor(isReallyActive ? status?.outcome : undefined)} />
      <TextContainer>
        <HugeBold style={{ textAlign: 'left' }}>{type}</HugeBold>
        <TextSmallBold style={{ textAlign: 'left' }}>{getBinText({ status, collections, isActive: isReallyActive })}</TextSmallBold>
      </TextContainer>
      {isReallyActive &&
        status?.outcome === 'Collection Made' && <CheckIcon />}
      {isReallyActive &&
        status?.outcome !== 'Collection Made' && <InfoIcon />}
    </BinCardContainer>
  )
}

const BinsContainer = styled.ScrollView`
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

  margin-bottom: 24px;
`

const NotSupported = () => (
  <StepContainer style={{
    alignSelf: 'center'
  }}>
    <Svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ marginBottom: 24 }}>
      <Rect x="2" y="17.0754" width="21.3199" height="21.3199" transform="rotate(-45 2 17.0754)" stroke="#6E7191" strokeWidth="2"/>
    </Svg>
    <TextSmallBold>We don't support your area yet, but we will soon!</TextSmallBold>
    <TextSmallBold style={{ marginTop: 12 }}>You'll get bin collection notifications automatically when we do.</TextSmallBold>
  </StepContainer>
)

const LoadingContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
`

const Loading = () => <LoadingContainer><AnimatedLoadingIndicator fill="white" loading style={{ right: '50%', marginRight: -21 }} size={42} /></LoadingContainer>

const timeOfDay = () => {
  const hour = dayjs().hour()

  if (hour >= 6 && hour < 12) return 'Morning'
  if (hour >= 12 && hour < 18) return 'Afternoon'
  if (hour >= 18 && hour < 24) return 'Evening'

  return 'Night'
}

export const Home = () => {
  const { addressId } = useParams()
  const { loading, address, refetch } = useAddressLookupById(addressId)

  if (loading) {
    return (
      <Container>
        <TopBar />
        <Loading />
      </Container>
    )
  }

  const { bins } = address

  const activeBins = bins.filter(bin => {
    // collection is today or tomorrow
    const collectionIsTodayOrTomorrow = bin.collections.some(collection => {
      const d = dayjs(collection)
      return d.isToday() || d.isTomorrow()
    })

    if (bin.status) {
      // status is not "Collection Made"
      const collectionNotMade = bin.status.outcome !== 'Collection Made'
      // was collected today
      const collectedToday = dayjs(bin.status.date).isToday() && bin.status.outcome === 'Collection Made'

      return collectionIsTodayOrTomorrow || collectionNotMade || collectedToday
    }

    return collectionIsTodayOrTomorrow
  })

  const inactiveBins = bins.filter(bin => !activeBins.some(activeBin => activeBin.id === bin.id))

  return (
    <Container>
      <TopBar />
      <TopTextContainer>
        <TextSmallBold style={{ color: '#6E7191', textAlign: 'left' }}>Good {timeOfDay()}</TextSmallBold>
        <HugeBold style={{ textAlign: 'left' }}>{address.firstLine}</HugeBold>
      </TopTextContainer>
      <BinsContainer
        refreshControl={<RefreshControl tintColor={offWhite} refreshing={loading} onRefresh={refetch} />}
      >
        {!bins.length && <NotSupported />}
        {activeBins.map(bin => <BinCard isActive key={bin.id} {...bin} />)}
        {!!activeBins.length && <HugeBold style={{ marginTop: 58, marginBottom: 16, textAlign: 'left' }}>Coming up</HugeBold>}
        {inactiveBins.sort((a, b) => {
          const aDates = a.collections.filter(d => dayjs(d).isAfter(new Date()))
          const bDates = b.collections.filter(d => dayjs(d).isAfter(new Date()))
          const aNextCollection = dayjs(aDates[0])
          const bNextCollection = dayjs(bDates[0])
          return aNextCollection.diff(bNextCollection)
        }).map(bin => <BinCard key={bin.id} {...bin} />)}
      </BinsContainer>
    </Container>
  )
}
