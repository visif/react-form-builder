import React from 'react'

import { DatePicker as AntDatePicker, TimePicker as AntTimePicker } from 'antd'
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import utc from 'dayjs/plugin/utc'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

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
      const { defaultToday } = props.data

      if (defaultToday && !props.defaultValue) {
        value = dayjs().toISOString()
      } else if (props.defaultValue) {
        try {
          // Use formatMask for parsing if available
          value = dayjs(props.defaultValue, formatMask).isValid()
            ? dayjs(props.defaultValue, formatMask).toISOString()
            : dayjs(props.defaultValue).utc(true).toISOString()
        } catch (error) {
          console.warn('Invalid date value:', props.defaultValue)
          value = null
        }
      }

      return {
        value,
        placeholder: formatMask.toLowerCase(),
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
  const [loading, setLoading] = React.useState(true)

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
      const isoDate = date ? date.toISOString() : null
      setValue(isoDate)
      setPlaceholder(formatMask.toLowerCase())
    },
    [formatMask]
  )

  const handleTimeChange = React.useCallback((time) => {
    const isoTime = time ? time.toISOString() : null
    setValue(isoTime)
    setPlaceholder('HH:MM')
  }, [])

  const formatDate = React.useCallback((date, mask) => {
    if (!date) return ''

    if (getCalendarType() === 'EN') {
      return dayjs(date).utc(true).format(mask)
    } else {
      // Convert to Buddhist calendar (add 543 years)
      return dayjs(date).utc(true).format(mask.replace('YYYY', 'BBBB'))
    }
  }, [])

  const { showTimeSelect, showTimeSelectOnly } = props.data
  const userProperties = props.getActiveUserProperties && props.getActiveUserProperties()

  const savedEditor = props.editor
  let isSameEditor = true
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor =
      userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
  }

  const inputProps = {
    type: 'date',
    name: props.data.field_name,
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

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className="form-group">
        <ComponentLabel {...props} />
        <div>
          {readOnly ? (
            <input
              type="text"
              name={inputProps.name}
              ref={inputProps.ref}
              readOnly={readOnly}
              placeholder={placeholder}
              value={value ? formatDate(value, formatMask) : ''}
              disabled={!isSameEditor}
              style={{ width: '100%' }}
            />
          ) : !showTimeSelectOnly ? (
            <AntDatePicker
              name={inputProps.name}
              ref={inputProps.ref}
              onChange={handleChange}
              value={value ? dayjs(value).utc(true) : null}
              format={(val) => formatDate(val, formatMask)}
              showTime={showTimeSelect ? { format: 'HH:mm', showSecond: false } : null}
              disabled={!isSameEditor || loading}
              placeholder={placeholder}
              style={{ width: '100%' }}
            />
          ) : (
            <AntTimePicker
              name={inputProps.name}
              ref={inputProps.ref}
              onChange={handleTimeChange}
              value={value ? dayjs(value).utc(true) : null}
              disabled={!isSameEditor || loading}
              placeholder={placeholder}
              style={{ width: '100%' }}
              format="HH:mm"
              minuteStep={1}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default DatePicker
