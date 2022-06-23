import fetch from 'node-fetch'
import * as Cheerio from 'cheerio'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { BinCollection, BinType } from './types'

dayjs.extend(utc)

export const parseHtml = (html: string) => {
  const $ = Cheerio.load(html)
  const outputDiv = $('#rteelem_ctl05_upnlOutput')
  const bins = $(outputDiv).find('.service')

  const results = [] as any[]

  bins.each((i, bin) => {
    const binType = bin.attribs.id.split('_').pop() as BinType
    const dates = $(bin).find('li')
    const collectionDates = [] as any[]

    dates.each((i, date) => {
      const dateText = $(date).text()
      const dayJsDate = dayjs(dateText)
      // correct for BST
      const offsetDate = dayJsDate.add(dayJsDate.local().utcOffset(), 'minutes')
      collectionDates.push(offsetDate.toDate())
    })

    results.push({
      binType,
      collectionDates,
    })
  })

  return results
}

export const coversAddress = async (uprn: string): Promise<boolean> => {
  const res = await findCollectionDates(uprn)
  return res.length > 0
}

export const findCollectionDates = async (uprn: string): Promise<BinCollection[]> => {
  const res = await fetch("https://www.basingstoke.gov.uk/bincollections", {
    headers: {
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
      cookie: `WhenAreMyBinsCollected=${uprn}`,
    },
    method: "GET"
  })

  const html = await res.text()

  return parseHtml(html)
}
