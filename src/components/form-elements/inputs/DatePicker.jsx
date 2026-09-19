import React from 'react'

import { DatePicker as AntDatePicker, TimePicker as AntTimePicker } from 'antd'
import dayjs from 'dayjs'

import {
  formatDatePickerDisplay,
  getCalendarType,
  getDateFormat,
  getPickerFormat,
  parseStoredDate,
  toStoredDateIso,
} from '../../../utils/dateUtil'
import {
  getPickerPopupContainer,
  isMulticolumnChild,
} from '../../../utils/multicolumnField'
import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'
import DatePickerTH from './DatePickerTH'

export { getDateFormat }

const DatePicker = (props) => {
  const inputField = React.useRef(null)
  const mounted = React.useRef(false)

  const updateFormat = React.useCallback(
    (oldFormatMask) => {
      const formatMask = getDateFormat(props.data.showTimeSelect, props.data.dateFormat)
      const updated = formatMask !== oldFormatMask
      return { updated, formatMask }
    },
    [props.data.showTimeSelect, props.data.dateFormat]
  )

  const updateDateTime = React.useCallback(
    (formatMask) => {
      let value
      const { defaultToday, showTimeSelectOnly } = props.data

      if (defaultToday && !props.defaultValue) {
        value = dayjs().toISOString()
      } else if (props.defaultValue) {
        try {
          value = parseStoredDate(props.defaultValue, formatMask)
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
      const lockedDate = toStoredDateIso(date)
      setValue(lockedDate)
      setPlaceholder(formatMask.toLowerCase())

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

  const formatDate = React.useCallback(
    (date, mask) => formatDatePickerDisplay(date, mask),
    []
  )

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

  const pickerPopupStyles = { popup: { root: { zIndex: 2100 } } }
  const pickerWidth = isMulticolumnChild(props.data) ? '100%' : 'auto'
  const pickerStyle = { display: 'inline-block', width: pickerWidth, maxWidth: '100%' }

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
            getCalendarType() === 'EN' ? (
            <AntDatePicker
              name={inputProps.name}
              ref={inputProps.ref}
              onChange={handleChange}
              value={value ? dayjs(value) : null}
              className="form-control bold-date-picker"
              format={getPickerFormat(formatMask)}
              showTime={showTimeSelect ? { format: 'HH:mm', showSecond: false } : null}
              disabled={!isSameEditor || loading}
              placeholder={placeholder}
              style={pickerStyle}
              getPopupContainer={getPickerPopupContainer}
              styles={pickerPopupStyles}
            />
            ) : (
            <DatePickerTH
              name={inputProps.name}
              ref={inputProps.ref}
              onChange={handleChange}
              value={value ? dayjs(value) : null}
              className="form-control bold-date-picker"
              format={getPickerFormat(formatMask)}
              showTime={showTimeSelect ? { format: 'HH:mm', showSecond: false } : null}
              disabled={!isSameEditor || loading}
              placeholder={placeholder}
              style={pickerStyle}
              getPopupContainer={getPickerPopupContainer}
              styles={pickerPopupStyles}
            />
            )
          ) : (
            <AntTimePicker
              name={inputProps.name}
              ref={inputProps.ref}
              onChange={handleTimeChange}
              value={value ? dayjs(value) : null}
              className="form-control bold-time-picker"
              disabled={!isSameEditor || loading}
              placeholder={placeholder}
              style={pickerStyle}
              format="HH:mm"
              minuteStep={1}
              getPopupContainer={getPickerPopupContainer}
              styles={pickerPopupStyles}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default DatePicker
