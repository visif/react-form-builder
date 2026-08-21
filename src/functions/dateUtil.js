import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(buddhistEra)

const keyDateFormat = 'setting_date_format'
const keyCalendarType = 'setting_calendar_type'

const dateFormatList = {
  'dd MMMM yyyy': 'DD MMMM YYYY',
  'dd-MMM-yyyy': 'DD-MMM-YYYY',
  'dd-MMM-yy': 'DD-MMM-YY',
  'yyyy-MM-dd': 'YYYY-MM-DD',
  'MM/dd/yyyy': 'MM/DD/YYYY',
  'dd/MM/yyyy': 'DD/MM/YYYY',
  'dd/MM/yy': 'DD/MM/YY',
  'MMM dd, yyyy': 'MMM DD, YYYY',
}

export const getDateFormat = () => {
  return dateFormatList[localStorage.getItem(keyDateFormat)] || 'DD MMMM YYYY'
}

export const getCalendarType = () => {
  return localStorage.getItem(keyCalendarType) || 'EN'
}

export const formatDate = (date) => {
  if (!date) return ''

  const format = getDateFormat()
  // Signatures store local clock time as UTC (dayjs().utc(true) → ...Z).
  // Parse as UTC so a saved ISO string does not shift by the browser offset.
  const utcDate = dayjs.utc(date)

  if (getCalendarType() === 'EN') {
    return utcDate.format(format)
  } else {
    return utcDate.format(format.replace('YYYY', 'BBBB'))
  }
}
