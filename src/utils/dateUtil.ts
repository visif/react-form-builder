import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(buddhistEra)
dayjs.extend(customParseFormat)

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

const dateTimeFormatList: Record<string, string> = {
  'dd MMMM yyyy': 'DD MMMM YYYY HH:mm',
  'dd-MMM-yyyy': 'DD-MMM-YYYY HH:mm',
  'dd-MMM-yy': 'DD-MMM-YY HH:mm',
  'yyyy-MM-dd': 'YYYY-MM-DD HH:mm',
  'MM/dd/yyyy': 'MM/DD/YYYY HH:mm',
  'dd/MM/yyyy': 'DD/MM/YYYY HH:mm',
  'dd/MM/yy': 'DD/MM/YY HH:mm',
  'MMM dd, yyyy': 'MMM DD, YYYY HH:mm',
}

const readStorage = (key: string): string => {
  try {
    return localStorage.getItem(key) || ''
  } catch {
    return ''
  }
}

const lookupFormat = (
  table: Record<string, string>,
  raw: string | null | undefined
): string | undefined => {
  if (!raw) {
    return undefined
  }
  if (table[raw]) {
    return table[raw]
  }
  const normalized = raw
    .replace(/DD/g, 'dd')
    .replace(/YYYY/g, 'yyyy')
    .replace(/YY/g, 'yy')
  return table[normalized]
}

export const getDateFormat = (showTimeSelect?: boolean, elementDateFormat?: string): string => {
  const table = showTimeSelect ? dateTimeFormatList : dateFormatList
  return (
    lookupFormat(table, readStorage(keyDateFormat)) ||
    lookupFormat(table, elementDateFormat) ||
    (showTimeSelect ? 'DD MMMM YYYY HH:mm' : 'DD MMMM YYYY')
  )
}

export const getCalendarType = (): string => readStorage(keyCalendarType) || 'EN'

export const isThaiCalendar = (): boolean => getCalendarType() !== 'EN'

export const THAI_MONTHS_FULL = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
]

export const THAI_MONTHS_SHORT = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
]

export const toBuddhistFormat = (formatMask: string): string =>
  formatMask.replace('YYYY', 'BBBB').replace(/(?<!B)YY(?![Y])/g, 'BB')

export const getPickerFormat = (formatMask: string): string =>
  isThaiCalendar() ? toBuddhistFormat(formatMask) : formatMask

/** Thai Buddhist display: Thai month names + year + 543, matching FormTimeLine. */
export const formatThaiCalendar = (date: dayjs.Dayjs, formatMask: string): string => {
  if (!date?.isValid()) {
    return ''
  }

  const yearInBE = date.year() + 543
  const yearPart =
    formatMask.includes('YYYY') || formatMask.includes('BBBB')
      ? yearInBE.toString()
      : yearInBE.toString().slice(-2).padStart(2, '0')

  return formatMask
    .replace('MMMM', THAI_MONTHS_FULL[date.month()])
    .replace('MMM', THAI_MONTHS_SHORT[date.month()])
    .replace('MM', date.format('MM'))
    .replace('DD', date.format('DD'))
    .replace('BBBB', yearPart)
    .replace('YYYY', yearPart)
    .replace(/(?<!Y)YY(?!Y)/g, yearPart.slice(-2))
    .replace('HH', date.format('HH'))
    .replace('mm', date.format('mm'))
    .replace('ss', date.format('ss'))
}

const toGregorianYear = (year: number): number => {
  if (getCalendarType() !== 'EN' && year > 2500) {
    return year - 543
  }
  return year
}

/**
 * DatePicker save: keep the selected local wall-clock, then convert that
 * instant to a real UTC ISO string (e.g. 16:14 local → 09:14Z in UTC+7).
 */
export const toStoredDateIso = (date?: dayjs.Dayjs | null): string | null => {
  if (!date) {
    return null
  }
  const corrected = date.clone().year(toGregorianYear(date.year()))
  return dayjs(corrected.format('YYYY-MM-DDTHH:mm:ss')).toISOString()
}

/**
 * DatePicker load: parse a stored ISO or formatted string and return UTC ISO
 * after converting Buddhist years back to Gregorian.
 */
export const parseStoredDate = (
  value?: string | number | Date | dayjs.Dayjs | null,
  formatMask?: string
): string | null => {
  if (value == null || value === '') {
    return null
  }

  let parsed = formatMask ? dayjs(value, formatMask) : dayjs(value)
  if (!parsed.isValid()) {
    parsed = dayjs(value)
  }
  if (!parsed.isValid()) {
    return null
  }

  return parsed.year(toGregorianYear(parsed.year())).toISOString()
}

/** DatePicker display: ISO UTC → local, then apply the system format mask. */
export const formatDatePickerDisplay = (
  date?: string | number | Date | dayjs.Dayjs | null,
  formatMask?: string
): string => {
  if (!date) {
    return ''
  }
  const mask = formatMask || getDateFormat()
  const localDate = dayjs(date)
  if (!localDate.isValid()) {
    return ''
  }
  if (isThaiCalendar()) {
    return formatThaiCalendar(localDate, mask)
  }
  return localDate.format(mask)
}

/**
 * Signature2 save: stamp the local clock as UTC (`dayjs().utc(true)` → ...Z)
 * so reopen does not shift the day by the browser offset.
 */
export const nowAsSignatureUtcIso = (): string => dayjs().utc(true).toISOString()

export const serializeSignedDateTime = (value?: unknown): string | null => {
  if (!value) {
    return null
  }
  if (typeof value === 'string') {
    return value
  }
  if (typeof (value as { toISOString?: () => string }).toISOString === 'function') {
    try {
      return (value as { toISOString: () => string }).toISOString()
    } catch {
      return String(value)
    }
  }
  return String(value)
}

/**
 * Signature2 display: parse as UTC so a saved ISO string does not shift.
 */
export const formatDate = (date?: string | number | Date | dayjs.Dayjs | null): string => {
  if (!date) {
    return ''
  }

  const format = getDateFormat()
  const utcDate = dayjs.utc(date)
  if (!utcDate.isValid()) {
    return ''
  }

  if (isThaiCalendar()) {
    return formatThaiCalendar(utcDate, format)
  }

  return utcDate.format(format)
}
