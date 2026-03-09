import React from 'react'
import { DatePicker as AntDatePicker, TimePicker as AntTimePicker } from 'antd'
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import utc from 'dayjs/plugin/utc'
import ComponentHeader from './component-header'
import ComponentLabel from './component-label'

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

const dateTimeFormatList = {
  'dd MMMM yyyy': 'DD MMMM YYYY HH:MM',
  'dd-MMM-yyyy': 'DD-MMM-YYYY HH:MM',
  'dd-MMM-yy': 'DD-MMM-YY HH:MM',
  'yyyy-MM-dd': 'YYYY-MM-DD HH:MM',
  'MM/dd/yyyy': 'MM/DD/YYYY HH:MM',
  'dd/MM/yyyy': 'DD/MM/YYYY HH:MM',
  'dd/MM/yy': 'DD/MM/YY HH:MM',
  'MMM dd, yyyy': 'MMM DD, YYYY HH:MM',
}

export const getDateFormat = (showTimeSelect) => {
  const key = showTimeSelect
    ? dateTimeFormatList[localStorage.getItem(keyDateFormat)]
    : dateFormatList[localStorage.getItem(keyDateFormat)]
  return key || (showTimeSelect ? 'DD MMMM YYYY HH:MM' : 'DD MMMM YYYY')
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
    // Allow actual Time Zone offset logic to save correctly (e.g., 16:14 local -> 23:14 UTC)
    // but force the correct selected DATE locally in case of midnight wrapping
    const lockedDate = date ? dayjs(date.format('YYYY-MM-DDTHH:mm:ss')).toISOString() : null

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

    if (defaultToday && !props.defaultValue) {
      value = dayjs().toISOString() // Let dayjs automatically calculate database UTC constraints
    } else if (props.defaultValue) {
      try {
        // Use formatMask for parsing natively, letting local/UTC offsets calculate correctly
        value = dayjs(props.defaultValue, formatMask).isValid()
          ? dayjs(props.defaultValue, formatMask).toISOString()
          : dayjs(props.defaultValue).toISOString()
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
              <AntDatePicker
                name={props.name}
                ref={props.ref}
                onChange={this.handleChange}
                // Use standard dayjs parse of the DB ISO String, naturally matching your local BKK clock
                value={this.state.value ? dayjs(this.state.value) : null}
                className="form-control bold-date-picker"
                format={(value) => this.formatDate(value, this.state.formatMask)}
                showTime={showTimeSelect ? { format: 'HH:mm', showSecond: false } : null}
                disabled={!isSameEditor || this.state.loading}
                placeholder={this.state.placeholder}
                style={{ display: 'inline-block', width: 'auto' }}
              />
            ) : (
              <AntTimePicker
                name={props.name}
                ref={props.ref}
                onChange={this.handleTimeChange}
                // Use standard dayjs parse of the DB ISO String, naturally returning +7 BKK safely
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
