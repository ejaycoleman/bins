import fetch from 'node-fetch'
import makeFetchCookie from 'fetch-cookie'
import FormData from 'form-data'
import qs from 'query-string'

import { BinType } from "./types"
import { defaultHeaders } from "../utils"

const formId = 782
const formUrl = `https://forms.canterbury.gov.uk/xfp/form/${formId}`

type ReportMissedUrl = {
  postcode: string
  bin: BinType
  uprn: string
  workpack: string
  firstLine: string
}

export const getReportMissedUrl = ({ uprn, firstLine, postcode, bin, workpack }: ReportMissedUrl) => {
  const qsData = {
    uprn,
    first: firstLine,
    pc: postcode,
    bin,
    workpack,
  }
  const query = qs.stringify(qsData)
  const url = `${formUrl}?${query}`

  return url
}

export const reportMissed = async ({ uprn, firstLine, postcode, bin, workpack, firstName, lastName, emailAddress, usuallyLeaveBins }: {
  uprn: string
  firstLine: string
  postcode: string
  bin: BinType
  workpack: string

  firstName: string,
  lastName: string,
  emailAddress: string,
  usuallyLeaveBins?: string,
}) => {
  const fetchCookie = makeFetchCookie(fetch)
  // with cookie jar
  // GET
  const url = getReportMissedUrl({ uprn, firstLine, postcode, bin, workpack })
  const initialPage = await fetchCookie(url, {
    headers: defaultHeaders,
  })

  const initialPageHtml = await initialPage.text()
  const [,__token] = initialPageHtml.match(/<input type="hidden" name="__token" value="(.*?)"/) || []

  if (!__token) {
    throw new Error('Could not find __token')
  }

  const qsData = {
    uprn,
    first: firstLine,
    pc: postcode,
    bin,
    workpack,
  }

  // POST with cookie jar
  // multipart/form-data
  const data: any = {
    __token,
    page: 1167,
    locale: 'en_GB',
    injectedParams: JSON.stringify({ ...qsData, formID: formId }),
    q6070094a28c9d749c2d3a6ed3e177104365ee256: firstName,
    q18700d5d1bb7a34f89e2a73b76acc186476e7586: lastName,
    qb1db689d83bdbb26b03d44d7d7af27822141f277: emailAddress,
    qba212ce77e288a2c851637c0ef11f1158d07cab9: usuallyLeaveBins,
    q0f7d8ccac5934761e0cfa535bba64f15220850ee: firstLine,
    q24d85b7f301b3b4e982a262ff08681847047400b: postcode,
    q9779cfb3a260983b4ebc4fd4725f635a0da26a2b: bin,
    qa35becf45384dbd19dd6ce04cf95dd3878a60e14: uprn,
    q62224dee6a7a64cad6bcc85f267be20a6d341b2f: workpack,
    next: 'Next'
  }
  const form = new FormData()
  Object.keys(data).forEach(key => form.append(key, data[key]))

  await fetchCookie(formUrl, {
    headers: {
      ...defaultHeaders,
      Referer: url,
      'Referrer-Policy': "strict-origin-when-cross-origin",
      ...form.getHeaders(),
    },
    body: form,
    method: "POST"
  })

  const form2 = new FormData()
  form2.append('__token', __token)
  form2.append('page', 'Confirmation')
  form2.append('locale', 'en_GB')
  form2.append('commit', 'Submit Form')

  await fetchCookie(formUrl, {
    headers: {
      ...defaultHeaders,
      Referer: url,
      'Referrer-Policy': "strict-origin-when-cross-origin",
      ...form2.getHeaders(),
    },
    body: form2,
    method: 'POST'
  })
}