import qs from 'query-string'
import fetch from 'node-fetch'
import { parseHtml } from './find-collection-dates'

const defaultHeaders = {
  "accept": "*/*",
  "accept-language": "en-US,en;q=0.9",
  "cache-control": "no-cache",
  "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
  "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "\"macOS\"",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "x-microsoftajax": "Delta=true",
  "x-requested-with": "XMLHttpRequest",
  Origin: 'https://www.basingstoke.gov.uk',
  "Referer": "https://www.basingstoke.gov.uk/bincollections",
}

type ASPXStateField = '__VIEWSTATE' | '__VIEWSTATEGENERATOR' | '__EVENTVALIDATION'

type ASPXState = {
  [K in ASPXStateField]: string
}

const parseAspxResponse = (html: string): ASPXState => {
  const hiddenInputs = html.match(/<input type="hidden" name="(.*?)" id="(.*?)" value="(.*?)" \/>/g) || []

  return hiddenInputs.reduce((acc, obj) => {
    const name = obj.split('name="')[1].split('"')[0]
    const value = obj.split('value="')[1].split('"')[0]
    if ([
      '__VIEWSTATE',
      '__VIEWSTATEGENERATOR',
      '__EVENTVALIDATION'
    ].includes(name)) {
      acc[name as ASPXStateField] = value
    }
    return acc
  }, {} as ASPXState)
}

const parseAspxAjaxResponse = (html: string): ASPXState => {
  const lastLine = html.split('\n').pop()?.trim()
  const parts = lastLine?.split('|')

  if (!parts) {
    throw new Error('Could not parse ASP.NET AJAX response')
  }
  
  return {
    __VIEWSTATE: parts[12],
    __VIEWSTATEGENERATOR: parts[16],
    __EVENTVALIDATION: parts[20],
  }
}

const findAddressResults = (html: string) => {
  const options = html.match(/<option value="(.*?)">(.*?)<\/option>/g)
  if (!options) {
    return []
  }

  return options.map(option => {
    const uprn = option.split('value="')[1].split('"')[0].split(':')[1]
    const address = option.split('>')[1].split('<')[0]
    
    return {
      uprn,
      address,
    }
  })
}

export type AddressResults = {
  addresses: {
    uprn: string
    address: string
  }[]
  state: ASPXState
}

const getInitialState = async (): Promise<ASPXState> => {
  const homepage = await fetch("https://www.basingstoke.gov.uk/bincollections", {
    headers: defaultHeaders,
    method: "GET"
  })

  const homepageHtml = await homepage.text()

  return parseAspxResponse(homepageHtml)
}

export const lookupAddresses = async (postcode: string): Promise<AddressResults> => {
  const state = await getInitialState()

  const addressSearchForm = {
    ...state,
    __ASYNCPOST: true,
    __EVENTARGUMENT: '',
    rteelem$ctl05$ctl00: 'rteelem$ctl05$ctl01|rteelem$ctl05$gapAddress$ctl02',
    __EVENTTARGET: 'rteelem$ctl05$gapAddress$ctl02',
    rteelem$ctl05$gapAddress$txtStage1_SearchValue: postcode,
  }

  const addressSearch = await fetch("https://www.basingstoke.gov.uk/rte.aspx?id=1270", {
    headers: defaultHeaders,
    body: qs.stringify(addressSearchForm),
    method: 'POST',
  })

  const addressSearchBody = await addressSearch.text()

  if (addressSearchBody.includes('error')) {
    throw new Error('Address search failed: '+addressSearchBody)
  }

  const addressResults = findAddressResults(addressSearchBody)

  return {
    addresses: addressResults,
    state: parseAspxAjaxResponse(addressSearchBody),
  }
}

export const getCollectionDates = async (postcode: string, uprn: string) => {
  const { addresses, state } = await lookupAddresses(postcode)

  if (addresses.length === 0) {
    throw new Error('No address results')
  }

  const form = {
    ...state,
    __EVENTARGUMENT: '',
    __ASYNCPOST: true,
    rteelem$ctl05$ctl00: 'rteelem$ctl05$ctl01|rteelem$ctl05$gapAddress$ctl05',
    __EVENTTARGET: 'rteelem$ctl05$gapAddress$ctl05',
    rteelem$ctl05$gapAddress$lstStage2_SearchResults: `UPRN:${uprn}`,
  }

  const res = await fetch("https://www.basingstoke.gov.uk/rte.aspx?id=1270", {
    headers: defaultHeaders,
    method: 'POST',
    body: qs.stringify(form),
  })

  const html = await res.text()
  const h = html.split('rteelem_ctl05_ctl01|')[1].split('|0|')[0]

  return parseHtml(h)
}

export const findCollectionDates = async (postcode: string, uprn: string) => {

}