import fetch from 'node-fetch'
import FormData from 'form-data'
import ical, { VEvent, CalendarComponent } from 'node-ical'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { CollectionDates, BinType } from './types'

dayjs.extend(utc)

const calendarComponentIsEvent = (component: CalendarComponent): component is VEvent => {
  return component.type === 'VEVENT'
}

const offsetDate = (date: Date): Date => {
  const dayJsDate = dayjs(date)
  return dayJsDate.add(dayJsDate.local().utcOffset(), 'minutes').toDate()
}

export const findCollectionDates = async (uprn: string): Promise<CollectionDates[]> => {
  const url = `https://www.southampton.gov.uk/whereilive/waste-calendar?UPRN=${uprn}`
  const res = await fetch(url)
  const html = await res.text()
  const ufprt = html.split('<input name="ufprt" type="hidden" value="')[1].split('"')[0]
  const ddlReminder = 0

  const formData = new FormData()

  formData.append('ufprt', ufprt)
  formData.append('ddlReminder', ddlReminder)
  formData.append('btniCal', '')

  const fetchIcal = await fetch(url, {
    headers: {
      ...formData.getHeaders(),
    },
    body: formData,
    method: 'POST',
  })

  const icalText = await fetchIcal.text()
  const collectionDates = await ical.async.parseICS(icalText)

  const collections = Object.values(collectionDates)
    .filter(calendarComponentIsEvent)
    .map((collectionDate) => ({
      type: collectionDate.summary as BinType,
      date: offsetDate(collectionDate.start),
    }))

    // group by type
  const groupedCollections = collections.reduce((acc, collection) => {
    const type = collection.type
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(collection.date)
    return acc
  }, {} as Record<BinType, Date[]>)

  return Object.entries(groupedCollections).map(([type, dates]) => ({
    type: type as BinType,
    collectionDates: dates,
  }))
}
