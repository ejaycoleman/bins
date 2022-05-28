export const defaultHeaders = {
  "accept": "*/*",
  "accept-language": "en-US,en;q=0.9",
  "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Google Chrome\";v=\"101\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "\"macOS\"",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "cross-site",
  "origin": "https://www.canterbury.gov.uk",
  "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
}

export const stringToDateTime = (d: string): Date => {
  const [date, time] = d.split('T')
  const [year, month, day] = date.split('-')
  const [hour, minute, s] = time.split(':')
  const [second, millisecond] = s.split('.')

  return new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second), millisecond ? Number(millisecond) : 0)
  )
}
