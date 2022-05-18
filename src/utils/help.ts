import dayjs from 'dayjs'

export function formatTime(t = new Date(), fmt = 'YYYY-MM-DDTHH') {
  return dayjs(t).format(fmt)
}
