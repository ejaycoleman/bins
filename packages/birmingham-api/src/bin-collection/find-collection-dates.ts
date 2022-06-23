import fetch from 'node-fetch'
import FormData from 'form-data'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { BinType, CollectionDates } from './types'
dayjs.extend(utc)

const url = 'https://www.birmingham.gov.uk/xfp/form/619'

const headers = {
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "accept-language": "en-US,en;q=0.9",
  "cache-control": "max-age=0",
  "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "\"macOS\"",
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "same-origin",
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1",
  "Referer": url,
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
}

const getTokenFromHtml = (html: string) => {
  const token = html.split('<input type="hidden" name="__token" value="')[1].split('"')[0]
  if (!token) {
    throw new Error('Could not find token')
  }
  return token[1]
}

const doToNumber = (day: string): number => {
  const d = day.split('(')[1].split(')')[0].split('')
  d.pop()
  d.pop()
  const n = parseInt(d.join(''), 10)
  return n
}

const parseStupidDate = (date: string): Date => {
  const [_, day] = date.split(' ')
  const n = doToNumber(day)
  const now = dayjs()
  if (dayjs().set('date', n).isBefore(now)) {
    return removeTime(dayjs().set('date', n).add(1, 'month').toDate())
  } else {
    return removeTime(dayjs().set('date', n).toDate())
  }
}

const removeTime = (date: Date): Date => {
  const dayJsDate = dayjs(date)
  const offsetDate = dayJsDate.add(dayJsDate.local().utcOffset(), 'minutes')
  return new Date(offsetDate.toDate().setHours(0, 0, 0, 0))
}

export const findCollectionDates = async (postcode: string, uprn: string): Promise<CollectionDates[]> => {
  const firstPage = await fetch(url, {
    headers,
    method: 'GET',
  })
  const firstPageHtml = await firstPage.text()

  // const form: {[key: string]: string | number } = {
  //   __token: getTokenFromHtml(firstPageHtml),
  //   page: 491,
  //   locale: 'en_GB',
  //   injectedParams: JSON.stringify({"formID":"619"}),
  //   q1f8ccce1d1e2f58649b4069712be6879a839233f_0_0: postcode,
  //   callback: JSON.stringify({"action":"ic","element":"q1f8ccce1d1e2f58649b4069712be6879a839233f","data":0,"tableRow":-1})
  // }

  // // multipart encode form
  // const formData = new FormData()
  // Object.keys(form).forEach((key) => {
  //   formData.append(key, form[key])
  // })

  // const addressPicker = await fetchCookie(url, {
  //   headers: {
  //     ...headers,
  //     ...formData.getHeaders(),
  //   },
  //   body: formData,
  //   method: 'POST',
  // })
  // const addressPickerHtml = await addressPicker.text()

  const form2: {[key: string]: string | number } = {
    __token: getTokenFromHtml(firstPageHtml),
    page: 491,
    locale: 'en_GB',
    q1f8ccce1d1e2f58649b4069712be6879a839233f_0_0: postcode,
    q1f8ccce1d1e2f58649b4069712be6879a839233f_1_0: uprn,
    next: 'Next'
  }

  // multipart encode form
  const formData2 = new FormData()
  Object.keys(form2).forEach((key) => {
    formData2.append(key, form2[key])
  })

  const secondPage = await fetch(url, {
    headers: {
      ...headers,
      ...formData2.getHeaders(),
    },
    body: formData2,
    method: 'POST',
  })

  const secondPageHtml = await secondPage.text()

  if (!secondPageHtml.includes('<table class="data-table">')) {
    console.error(secondPageHtml)
    throw new Error('Could not find table')
  }

  const helpfulHtml = secondPageHtml.split('<table class="data-table">')[1].split('</table>')[0]
  const results = helpfulHtml.split('<tbody>')[1].split('</tbody>')[0]
  const rows = results.split('<tr>')
  return rows.map((row) => {
    const cells = row.split('<td>')
    return cells.filter(Boolean).map((cell) => {
      return cell.split('</td>')[0].replace('</tr>', '')
    }).filter(Boolean)
  })
  .filter(r => r.length > 0)
  .map(row => {
    const [collection, date] = row
    return {
      type: collection.replace('Collection', '').trim() as BinType,
      date: parseStupidDate(date),
    }
  })
}
