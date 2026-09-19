import generatePicker from 'antd/es/date-picker/generatePicker'
import dayjsGenerateConfig from '@rc-component/picker/es/generate/dayjs'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import 'dayjs/locale/th'

import { THAI_MONTHS_FULL, THAI_MONTHS_SHORT } from '../../../utils/dateUtil'

dayjs.extend(advancedFormat)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(customParseFormat)
dayjs.extend(localizedFormat)

const buddhistConfig = {
  ...dayjsGenerateConfig,
  getFixedDate: (string) => dayjs(string, ['DD/MM/YYYY'], 'en'),
  setYear: (date, year) => date.year(year - 543),
  getYear: (date) => {
    if (dayjs.isDayjs(date)) {
      return date.year() + 543
    }
    if (typeof date === 'string') {
      return dayjs(date).year() + 543
    }
    return null
  },
  locale: {
    getWeekFirstDay: () => dayjs().locale('th').localeData().firstDayOfWeek(),
    getWeekFirstDate: (_locale, date) => date.locale('th').day(0),
    getWeek: (_locale, date) => date.locale('th').week(),
    getShortWeekDays: () => dayjs().locale('th').localeData().weekdaysMin(),
    getShortMonths: () => THAI_MONTHS_SHORT,
    format: (_locale, date, format) => {
      if (!date || !dayjs.isDayjs(date) || !date.isValid()) {
        return ''
      }

      const yearInBE = date.year() + 543
      const yearPart =
        format.includes('YYYY') || format.includes('BBBB')
          ? yearInBE.toString()
          : yearInBE.toString().slice(-2)
      const monthFull = THAI_MONTHS_FULL[date.month()]
      const monthShort = THAI_MONTHS_SHORT[date.month()]
      const monthNumber = date.format('MM')
      const dayPadded = date.format('DD')
      const dayNum = date.format('D')
      const hour24 = date.format('HH')
      const hour12 = date.format('hh')
      const minute = date.format('mm')
      const second = date.format('ss')
      const ampmUpper = date.format('A')
      const ampmLower = date.format('a')

      const formattedDate = format
        .replace('MMMM', monthFull)
        .replace('MMM', monthShort)
        .replace('MM', monthNumber)
        .replace('DD', dayPadded)
        .replace(/(?<!D)D(?!D)/g, dayNum)
        .replace('BBBB', yearPart)
        .replace(/(?<!B)BB(?!B)/g, yearPart.slice(-2))
        .replace('YYYY', yearPart)
        .replace(/(?<!Y)YY(?!Y)/g, yearPart.slice(-2))
        .replace('HH', hour24)
        .replace('hh', hour12)
        .replace('mm', minute)
        .replace('ss', second)
        .replace('A', ampmUpper)
        .replace('a', ampmLower)

      if (formattedDate === format) {
        return date.locale('th').format(format)
      }

      return formattedDate
    },
    parse: (_locale, text, formats) => {
      for (let i = 0; i < formats.length; i += 1) {
        const date = dayjs(text, formats[i], true).locale('th')
        if (date.isValid()) {
          return date
        }
      }
      return null
    },
  },
}

const DatePickerTH = generatePicker(buddhistConfig)

export default DatePickerTH
