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
      const yearPart = format.includes('YYYY') ? yearInBE.toString() : yearInBE.toString().slice(-2);
      const monthFull = THAI_MONTHS_FULL[date.month()];
      const monthShort = THAI_MONTHS_SHORT[date.month()];
      const monthNumber = date.format('MM');
      const day = date.format('DD');
      let formattedDate = format
        .replace('YYYY', yearPart)
        .replace('YY', yearPart.slice(-2))
        .replace('MMMM', monthFull)
        .replace('MMM', monthShort)
        .replace('MM', monthNumber)
        .replace('DD', day);
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
      // If value hasn't loaded yet, check again in a moment
      setTimeout(() => {
        if (this.mounted && !this.state.value) {
          const { formatMask } = this.state
          this.setState({
            ...DatePicker.updateDateTime(this.props, formatMask),
            loading: false,
          })
          // Keep checking if still no value and attempts are less than maxRetries
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

    // Allow actual Time Zone offset logic to save correctly (e.g., 16:14 local -> 23:14 UTC)
    // but force the correct selected DATE locally in case of midnight wrapping
    let lockedDate = null

    if (date) {
      // Get the year from the date object
      let year = date.year()

      // If calendar type is Buddhist, the year returned might be in Buddhist era
      // We need to convert it back to Gregorian for storage (subtract 543)
      if (calendarType === 'TH' || calendarType !== 'EN') {
        // Check if the year seems to be in Buddhist format (543 years ahead)
        if (year > 2500) {
          year = year - 543
        }
      }

      // Create a new date with the corrected Gregorian year
      const correctedDate = date.clone().year(year)
      lockedDate = correctedDate.format('YYYY-MM-DDTHH:mm:ss')
      lockedDate = dayjs(lockedDate).toISOString()
    }

    console.log('Saved Date:', lockedDate) // Added for verification
    this.setState({
      value: lockedDate,
      placeholder: formatMask.toLowerCase(),
    })
  }

  handleTimeChange = (time) => {
    // Keep exact local time selection in sync with database mathematical bounds
    const isoTime = time ? time.toISOString() : null
    console.log('Saved Time (Real UTC Math):', isoTime) // Added for verification
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
      value = dayjs().toISOString() // Let dayjs automatically calculate database UTC constraints
    } else if (props.defaultValue) {
      try {
        // Use formatMask for parsing natively, letting local/UTC offsets calculate correctly
        let parsedDate = dayjs(props.defaultValue, formatMask)

        if (parsedDate.isValid()) {
          // If calendar type is Buddhist and the parsed year is in Buddhist era range,
          // convert it back to Gregorian before saving
          if (calendarType !== 'EN' && parsedDate.year() > 2500) {
            parsedDate = parsedDate.year(parsedDate.year() - 543)
          }
          value = parsedDate.toISOString()
        } else {
          let fallbackDate = dayjs(props.defaultValue)
          // Apply the same Buddhist conversion to fallback parsing
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

    // Since we are correctly saving standard UTC in the database now,
    // dayjs will automatically bring it back up to local (+7 BKK) seamlessly!
    const localDate = dayjs(date)

    if (getCalendarType() === 'EN') {
      return localDate.format(formatMask)
    } else {
      // Convert to Buddhist calendar (add 543 years)
      return localDate.format(formatMask.replace('YYYY', 'BBBB'))
    }
  }

  getFormattedDateForPicker = (date, formatMask) => {
    if (!date) return ''

    const calendarType = getCalendarType()
    const localDate = dayjs(date)

    if (calendarType === 'EN') {
      return localDate.format(formatMask)
    } else {
      // Buddhist calendar - convert year to Buddhist Era
      const buddhist = localDate.format(formatMask.replace('YYYY', 'BBBB').replace('YY', 'BB'))
      return buddhist
    }
  }

  render() {
    const { showTimeSelect, showTimeSelectOnly } = this.props.data
    const userProperties =
      this.props.getActiveUserProperties && this.props.getActiveUserProperties()

    const savedEditor = this.props.editor
    const hasValue = this.state.value && this.state.value.toString().trim() !== ''

    // Allow editing if no value exists OR if user is the same editor
    let isSameEditor = true
    if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
      isSameEditor =
        userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
    }

    // Create tooltip text showing editor name
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
                  format={(value) => this.getFormattedDateForPicker(value, this.state.formatMask)}
                  showTime={showTimeSelect ? { format: 'HH:mm', showSecond: false } : null}
                  disabled={!isSameEditor || this.state.loading}
                  placeholder={this.state.placeholder}
                  style={{ display: 'inline-block', width: 'auto' }}
                />
              ) : (
                <DatePickerTH
                  name={props.name}
                  ref={props.ref}
                  onChange={this.handleChange}
                  value={this.state.value ? dayjs(this.state.value) : null}
                  className="form-control bold-date-picker"
                  format={this.state.formatMask.replace('YYYY', 'BBBB')}
                  showTime={showTimeSelect ? { format: 'HH:mm', showSecond: false } : null}
                  disabled={!isSameEditor || this.state.loading}
                  placeholder={this.state.placeholder}
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
