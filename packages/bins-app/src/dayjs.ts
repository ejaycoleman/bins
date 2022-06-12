import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isTomorrow from 'dayjs/plugin/isTomorrow'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'

dayjs.extend(relativeTime)
dayjs.extend(isYesterday)
dayjs.extend(isTomorrow)
dayjs.extend(isToday)

export {
  dayjs
}
