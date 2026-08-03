import React from 'react'
import { DatePicker as AntDatePicker, TimePicker as AntTimePicker } from 'antd'
import generatePicker from 'antd/es/date-picker/generatePicker';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import localeData from 'dayjs/plugin/localeData';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import th from 'dayjs/locale/th';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import ComponentHeader from './component-header'
import ComponentLabel from './component-label'


dayjs.extend(utc)
dayjs.extend(advancedFormat);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(buddhistEra);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

// Thai month names for Buddhist calendar
const THAI_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];
const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

const buddhistConfig = {
  ...dayjsGenerateConfig,
  getFixedDate: (string) => dayjs(string, ['DD/MM/YYYY'], 'en'),
  setYear: (date, year) => date.year(year - 543),
  getYear: (date) => {
    if (dayjs.isDayjs(date)) {
      return date.year() + 543;
    } else if (typeof date === 'string') {
      const dayjsDate = dayjs(date);
      return dayjsDate.year() + 543;
    } else {
      return null;
    }
  },
  locale: {
    getWeekFirstDay: (locale) => dayjs().locale('th').localeData().firstDayOfWeek(),
    getWeekFirstDate: (locale, date) => date.locale('th').day(0),
    getWeek: (locale, date) => date.locale('th').week(),
    getShortWeekDays: (locale) => dayjs().locale('th').localeData().weekdaysMin(),
    getShortMonths: (locale) => dayjs().locale('th').localeData().monthsShort(),
    format: (locale, date, format) => {
      const yearInBE = date.year() + 543;
      const yearPart = format.includes('YYYY') || format.includes('BBBB')
        ? yearInBE.toString()
        : yearInBE.toString().slice(-2);
      const monthFull = THAI_MONTHS_FULL[date.month()];
      const monthShort = THAI_MONTHS_SHORT[date.month()];
      const monthNumber = date.format('MM');
      const dayPadded = date.format('DD');  // "01" .. "31"
      const dayNum = date.format('D');      // "1"  .. "31"
      const hour24 = date.format('HH');
      const hour12 = date.format('hh');
      const minute = date.format('mm');
      const second = date.format('ss');
      const ampmUpper = date.format('A');
      const ampmLower = date.format('a');

      // Replace longer tokens first to avoid partial collisions.
      // Time tokens must be handled here too — otherwise datetime masks like
      // "DD/MM/YY HH:mm" render as "24/07/69 HH:mm" with literal HH:mm.
      let formattedDate = format
        .replace('MMMM', monthFull)
        .replace('MMM', monthShort)
        .replace('MM', monthNumber)
        .replace('DD', dayPadded)                    // two-digit day
        .replace(/(?<!D)D(?!D)/g, dayNum)            // single D not part of DD
        .replace('BBBB', yearPart)
        .replace(/(?<!B)BB(?!B)/g, yearPart.slice(-2))
        .replace('YYYY', yearPart)
        .replace(/(?<!Y)YY(?!Y)/g, yearPart.slice(-2)) // standalone YY only
        .replace('HH', hour24)
        .replace('hh', hour12)
        .replace('mm', minute)
        .replace('ss', second)
        .replace('A', ampmUpper)
        .replace('a', ampmLower);

      // rc-picker requests single-token formats (e.g. "D") for calendar cells.
      if (formattedDate === format) {
        return date.locale('th').format(format)
      }

      return formattedDate;
    },
    parse: (locale, text, formats) => {
      for (let i = 0; i < formats.length; i += 1) {
        const format = formats[i];
        const date = dayjs(text, format, true).locale('th');
        if (date.isValid()) {
          return date;
        }
      }
      return null;
    },
  },
};

const DatePickerTH = generatePicker(buddhistConfig);

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

const dateTimeFormatList = {
  'dd MMMM yyyy': 'DD MMMM YYYY HH:mm',
  'dd-MMM-yyyy': 'DD-MMM-YYYY HH:mm',
  'dd-MMM-yy': 'DD-MMM-YY HH:mm',
  'yyyy-MM-dd': 'YYYY-MM-DD HH:mm',
  'MM/dd/yyyy': 'MM/DD/YYYY HH:mm',
  'dd/MM/yyyy': 'DD/MM/YYYY HH:mm',
  'dd/MM/yy': 'DD/MM/YY HH:mm',
  'MMM dd, yyyy': 'MMM DD, YYYY HH:mm',
}

export const getDateFormat = (showTimeSelect) => {
  const key = showTimeSelect
    ? dateTimeFormatList[localStorage.getItem(keyDateFormat)]
    : dateFormatList[localStorage.getItem(keyDateFormat)]
  return key || (showTimeSelect ? 'DD MMMM YYYY HH:mm' : 'DD MMMM YYYY')
}

export const getCalendarType = () => {
  var key = localStorage.getItem(keyCalendarType)
  return key || 'EN'
}

// Helper: convert a dayjs format mask to Buddhist Era format safely
const toBuddhistFormat = (formatMask) => {
  return formatMask
    .replace('YYYY', 'BBBB')
    .replace(/(?<!B)YY(?![Y])/g, 'BB')
}

class DatePicker extends React.Component {
  constructor(props) {
    super(props)
    this.inputField = React.createRef()
    this.mounted = false

    const { formatMask } = DatePicker.updateFormat(props, null)
    this.state = {
      ...DatePicker.updateDateTime(props, formatMask),
      loading: true,
    }
  }

  componentDidMount() {
    this.mounted = true
    this.checkForValue()
  }

  componentWillUnmount() {
    this.mounted = false
  }

  checkForValue = (attempt = 0) => {
    const { defaultValue } = this.props
    const maxRetries = 3

    if (!this.state.value && defaultValue) {
      setTimeout(() => {
        if (this.mounted && !this.state.value) {
          const { formatMask } = this.state
          this.setState({
            ...DatePicker.updateDateTime(this.props, formatMask),
            loading: false,
          })
          if (!this.state.value && attempt < maxRetries) {
            this.checkForValue(attempt + 1)
          }
        }
      }, 500)
    } else {
      this.setState({ loading: false })
    }
  }

  handleChange = (date) => {
    const { formatMask } = this.state
    const calendarType = getCalendarType()

    let lockedDate = null

    if (date) {
      let year = date.year()

      if (calendarType === 'TH' || calendarType !== 'EN') {
        if (year > 2500) {
          year = year - 543
        }
      }

      const correctedDate = date.clone().year(year)
      lockedDate = correctedDate.format('YYYY-MM-DDTHH:mm:ss')
      lockedDate = dayjs(lockedDate).toISOString()
    }

    console.log('Saved Date:', lockedDate)
    this.setState({
      value: lockedDate,
      placeholder: formatMask.toLowerCase(),
    })
  }

  handleTimeChange = (time) => {
    const isoTime = time ? time.toISOString() : null
    console.log('Saved Time (Real UTC Math):', isoTime)
    this.setState({
      value: isoTime,
      placeholder: 'HH:mm',
    })
  }

  static getDerivedStateFromProps(props, state) {
    if (props.defaultValue && props.defaultValue !== state.defaultValue) {
      const { formatMask } = DatePicker.updateFormat(props, null)
      return DatePicker.updateDateTime(props, formatMask)
    }
    return null
  }

  static updateFormat(props, oldFormatMask) {
    const formatMask = getDateFormat(props.data.showTimeSelect)
    const updated = formatMask !== oldFormatMask
    return { updated, formatMask }
  }

  static updateDateTime(props, formatMask) {
    let value
    const { defaultToday, showTimeSelectOnly } = props.data
    const calendarType = getCalendarType()

    if (defaultToday && !props.defaultValue) {
      value = dayjs().toISOString()
    } else if (props.defaultValue) {
      try {
        let parsedDate = dayjs(props.defaultValue, formatMask)

        if (parsedDate.isValid()) {
          if (calendarType !== 'EN' && parsedDate.year() > 2500) {
            parsedDate = parsedDate.year(parsedDate.year() - 543)
          }
          value = parsedDate.toISOString()
        } else {
          let fallbackDate = dayjs(props.defaultValue)
          if (calendarType !== 'EN' && fallbackDate.year() > 2500) {
            fallbackDate = fallbackDate.year(fallbackDate.year() - 543)
          }
          value = fallbackDate.toISOString()
        }
      } catch (error) {
        console.warn('Invalid date value:', props.defaultValue)
        value = null
      }
    }

    return {
      value,
      placeholder: props.data.showTimeSelectOnly ? 'HH:mm' : formatMask.toLowerCase(),
      defaultToday,
      formatMask,
      defaultValue: props.defaultValue,
    }
  }

  formatDate = (date, formatMask) => {
    if (!date) return ''
    const localDate = dayjs(date)
    if (getCalendarType() === 'EN') {
      return localDate.format(formatMask)
    } else {
      return localDate.format(toBuddhistFormat(formatMask))
    }
  }

  getPickerFormat = () => {
    const { formatMask } = this.state
    const calendarType = getCalendarType()
    return calendarType === 'EN' ? formatMask : toBuddhistFormat(formatMask)
  }

  render() {
    const { showTimeSelect, showTimeSelectOnly } = this.props.data
    const userProperties =
      this.props.getActiveUserProperties && this.props.getActiveUserProperties()

    const savedEditor = this.props.editor
    const hasValue = this.state.value && this.state.value.toString().trim() !== ''

    let isSameEditor = true
    if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
      isSameEditor =
        userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
    }

    const tooltipText =
      savedEditor && savedEditor.name && hasValue
        ? `${
            this.state.value
              ? this.formatDate(this.state.value, showTimeSelectOnly ? 'HH:mm' : this.state.formatMask)
              : ''
          }\nEdited by: ${savedEditor.name}`
        : ''

    const props = {
      type: 'date',
      className: 'form-control',
      name: this.props.data.field_name,
    }
    if (tooltipText) {
      props.title = tooltipText
    }

    const readOnly = this.props.data.readOnly || this.props.read_only || !isSameEditor

    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue
      props.ref = this.inputField
    }

    let baseClasses = 'SortableItem rfb-item'
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    const calendarType = getCalendarType();
    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group" title={tooltipText}>
          <ComponentLabel {...this.props} />
          <div>
            {readOnly ? (
              <input
                type="text"
                name={props.name}
                ref={props.ref}
                readOnly={readOnly}
                placeholder={this.state.placeholder}
                value={
                  this.state.value
                    ? this.formatDate(this.state.value, showTimeSelectOnly ? 'HH:mm' : this.state.formatMask)
                    : ''
                }
                disabled={!isSameEditor}
                className="form-control"
              />
            ) : !showTimeSelectOnly ? (
              calendarType === 'EN' ? (
                <AntDatePicker
                  name={props.name}
                  ref={props.ref}
                  onChange={this.handleChange}
                  value={this.state.value ? dayjs(this.state.value) : null}
                  className="form-control bold-date-picker"
                  format={this.getPickerFormat()}
                  showTime={showTimeSelect ? { format: 'HH:mm', showSecond: false } : null}
                  disabled={!isSameEditor || this.state.loading}
                  placeholder={this.state.placeholder}
                  getPopupContainer={() => document.body}
                  styles={{ popup: { root: { zIndex: 2100 } } }}
                  style={{ display: 'inline-block', width: 'auto' }}
                />
              ) : (
                <DatePickerTH
                  name={props.name}
                  ref={props.ref}
                  onChange={this.handleChange}
                  value={this.state.value ? dayjs(this.state.value) : null}
                  className="form-control bold-date-picker"
                  format={this.getPickerFormat()}
                  showTime={showTimeSelect ? { format: 'HH:mm', showSecond: false } : null}
                  disabled={!isSameEditor || this.state.loading}
                  placeholder={this.state.placeholder}
                  getPopupContainer={() => document.body}
                  styles={{ popup: { root: { zIndex: 2100 } } }}
                  style={{ display: 'inline-block', width: 'auto' }}
                />
              )
            ) : (
              <AntTimePicker
                name={props.name}
                ref={props.ref}
                onChange={this.handleTimeChange}
                value={this.state.value ? dayjs(this.state.value) : null}
                className="form-control bold-time-picker"
                disabled={!isSameEditor || this.state.loading}
                placeholder={this.state.placeholder}
                getPopupContainer={() => document.body}
                styles={{ popup: { root: { zIndex: 2100 } } }}
                style={{ display: 'inline-block', width: 'auto' }}
                format="HH:mm"
                minuteStep={1}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default DatePicker
