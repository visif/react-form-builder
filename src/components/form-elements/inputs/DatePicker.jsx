import React from 'react'

import { DatePicker as AntDatePicker, TimePicker as AntTimePicker } from 'antd'
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import utc from 'dayjs/plugin/utc'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'
import {
  getPickerPopupContainer,
  isMulticolumnChild,
} from '../../../utils/multicolumnField'

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

const DatePicker = (props) => {
  const inputField = React.useRef(null)
  const mounted = React.useRef(false)

  const updateFormat = React.useCallback(
    (oldFormatMask) => {
      const formatMask = getDateFormat(props.data.showTimeSelect)
      const updated = formatMask !== oldFormatMask
      return { updated, formatMask }
    },
    [props.data.showTimeSelect]
  )

  const updateDateTime = React.useCallback(
    (formatMask) => {
      let value
      const { defaultToday, showTimeSelectOnly } = props.data

      if (defaultToday && !props.defaultValue) {
        value = dayjs().toISOString()
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
        placeholder: showTimeSelectOnly ? 'HH:mm' : formatMask.toLowerCase(),
        defaultToday,
        formatMask,
        defaultValue: props.defaultValue,
      }
    },
    [props.data, props.defaultValue]
  )

  const { formatMask: initialFormatMask } = updateFormat(null)
  const initialState = updateDateTime(initialFormatMask)

  const [value, setValue] = React.useState(initialState.value)
  const [placeholder, setPlaceholder] = React.useState(initialState.placeholder)
  const [formatMask, setFormatMask] = React.useState(initialState.formatMask)
  const [loading, setLoading] = React.useState(() => !initialState.value && Boolean(props.defaultValue))

  const checkForValue = React.useCallback(
    (attempt = 0) => {
      const maxRetries = 3

      if (!value && props.defaultValue) {
        // If value hasn't loaded yet, check again in a moment
        setTimeout(() => {
          if (mounted.current && !value) {
            const updated = updateDateTime(formatMask)
            setValue(updated.value)
            setPlaceholder(updated.placeholder)
            setLoading(false)
            // Keep checking if still no value and attempts are less than maxRetries
            if (!value && attempt < maxRetries) {
              checkForValue(attempt + 1)
            }
          }
        }, 500)
      } else {
        setLoading(false)
      }
    },
    [value, props.defaultValue, formatMask, updateDateTime]
  )

  React.useEffect(() => {
    mounted.current = true
    checkForValue()
    return () => {
      mounted.current = false
    }
  }, [checkForValue])

  React.useEffect(() => {
    if (props.defaultValue && props.defaultValue !== value) {
      const { formatMask: newFormatMask } = updateFormat(formatMask)
      const updated = updateDateTime(newFormatMask)
      setValue(updated.value)
      setPlaceholder(updated.placeholder)
      setFormatMask(updated.formatMask)
    }
  }, [props.defaultValue, value, formatMask, updateFormat, updateDateTime])

  const handleChange = React.useCallback(
    (date) => {
      // Allow actual Time Zone offset logic to save correctly (e.g., 16:14 local -> 23:14 UTC)
      // but force the correct selected DATE locally in case of midnight wrapping
      const lockedDate = date ? dayjs(date.format('YYYY-MM-DDTHH:mm:ss')).toISOString() : null
      setValue(lockedDate)
      setPlaceholder(formatMask.toLowerCase())

      // Update form context
      if (props.handleChange) {
        props.handleChange(props.data.field_name, lockedDate)
      }
    },
    [formatMask, props]
  )

  const handleTimeChange = React.useCallback(
    (time) => {
      const isoTime = time ? time.toISOString() : null
      setValue(isoTime)
      setPlaceholder('HH:mm')

      // Update form context
      if (props.handleChange) {
        props.handleChange(props.data.field_name, isoTime)
      }
    },
    [props]
  )

  // Initialize form context with initial value
  React.useEffect(() => {
    if (props.handleChange && value !== undefined) {
      props.handleChange(props.data.field_name, value)
    }
  }, []) // Only on mount

  const formatDate = React.useCallback((date, mask) => {
    if (!date) return ''

    // Since we are correctly saving standard UTC in the database now,
    // dayjs will automatically bring it back up to local time seamlessly
    const localDate = dayjs(date)

    if (getCalendarType() === 'EN') {
      return localDate.format(mask)
    } else {
      // Convert to Buddhist calendar (add 543 years)
      return localDate.format(mask.replace('YYYY', 'BBBB'))
    }
  }, [])

  const { showTimeSelect, showTimeSelectOnly } = props.data
  const userProperties = props.getActiveUserProperties && props.getActiveUserProperties()

  const savedEditor = props.editor
  const hasValue = value && value.toString().trim() !== ''

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
          value ? formatDate(value, showTimeSelectOnly ? 'HH:mm' : formatMask) : ''
        }\nEdited by: ${savedEditor.name}`
      : ''

  const inputProps = {
    type: 'date',
    className: 'form-control',
    name: props.data.field_name,
  }
  if (tooltipText) {
    inputProps.title = tooltipText
  }

  const readOnly = props.data.readOnly || props.read_only || !isSameEditor

  if (props.mutable) {
    inputProps.defaultValue = props.defaultValue
    inputProps.ref = inputField
  }

  let baseClasses = 'SortableItem rfb-item'
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }
  if (isMulticolumnChild(props.data)) {
    baseClasses += ' is-isolated rfb-multicolumn-interactive'
  }

  const formGroupClassName = isMulticolumnChild(props.data)
    ? 'form-group is-isolated'
    : 'form-group'

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={formGroupClassName} title={tooltipText}>
        <ComponentLabel {...props} />
        <div>
          {readOnly ? (
            <input
              type="text"
              name={inputProps.name}
              ref={inputProps.ref}
              readOnly={readOnly}
              placeholder={placeholder}
              value={value ? formatDate(value, showTimeSelectOnly ? 'HH:mm' : formatMask) : ''}
              disabled={!isSameEditor}
              className="form-control"
            />
          ) : !showTimeSelectOnly ? (
            <AntDatePicker
              name={inputProps.name}
              ref={inputProps.ref}
              onChange={handleChange}
              value={value ? dayjs(value) : null}
              className="form-control bold-date-picker"
              format={(val) => formatDate(val, formatMask)}
              showTime={showTimeSelect ? { format: 'HH:mm', showSecond: false } : null}
              disabled={!isSameEditor || loading}
              placeholder={placeholder}
              style={{ display: 'inline-block', width: 'auto' }}
              getPopupContainer={getPickerPopupContainer}
            />
          ) : (
            <AntTimePicker
              name={inputProps.name}
              ref={inputProps.ref}
              onChange={handleTimeChange}
              value={value ? dayjs(value) : null}
              className="form-control bold-time-picker"
              disabled={!isSameEditor || loading}
              placeholder={placeholder}
              style={{ display: 'inline-block', width: 'auto' }}
              format="HH:mm"
              minuteStep={1}
              getPopupContainer={getPickerPopupContainer}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default DatePicker
