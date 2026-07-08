import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(buddhistEra)

const keyDateFormat = 'setting_date_format'
const keyCalendarType = 'setting_calendar_type'

const dateFormatList: Record<string, string> = {
  'dd MMMM yyyy': 'DD MMMM YYYY',
  'dd-MMM-yyyy': 'DD-MMM-YYYY',
  'dd-MMM-yy': 'DD-MMM-YY',
  'yyyy-MM-dd': 'YYYY-MM-DD',
  'MM/dd/yyyy': 'MM/DD/YYYY',
  'dd/MM/yyyy': 'DD/MM/YYYY',
  'dd/MM/yy': 'DD/MM/YY',
  'MMM dd, yyyy': 'MMM DD, YYYY',
}

export const getDateFormat = (): string =>
  dateFormatList[localStorage.getItem(keyDateFormat) || ''] || 'DD MMMM YYYY'

export const getCalendarType = (): string => localStorage.getItem(keyCalendarType) || 'EN'

export const formatDate = (date?: string | number | Date | dayjs.Dayjs | null): string => {
  if (!date) return ''

  const format = getDateFormat()

  if (getCalendarType() === 'EN') {
    return dayjs(date).format(format)
  }
  // Use Buddhist Era (BBBB) formatting
  return dayjs(date).format(format.replace('YYYY', 'BBBB'))
}
