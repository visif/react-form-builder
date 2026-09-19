import React from 'react'

import { Input, Select } from 'antd'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'
import { INFO_TEXTAREA_STYLE } from '../shared/optionInfoLayout'

const { TextArea } = Input

const parseDropdownValue = (raw) => {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return { value: raw.value ?? '', info: raw.info ?? '' }
  }
  return { value: raw || '', info: '' }
}

const Dropdown = (props) => {
  const inputField = React.useRef()
  const parsedDefault = parseDropdownValue(props.defaultValue)
  const [value, setValue] = React.useState(parsedDefault.value)
  const [info, setInfo] = React.useState(parsedDefault.info)

  // Update value when defaultValue prop changes
  React.useEffect(() => {
    const next = parseDropdownValue(props.defaultValue)
    setValue(next.value)
    setInfo(next.info)
  }, [props.defaultValue])

  const selectedOption = props.data.options?.find((option) => option.value == value)
  const showInfo = !!selectedOption?.info

  const emitChange = React.useCallback(
    (selectedValue, nextInfo) => {
      const { data, handleChange: onFormularChange } = props
      const { formularKey, field_name } = data
      const selected = data.options?.find((option) => option.value == selectedValue)
      const payload = selected?.info
        ? { value: selectedValue, info: nextInfo || '' }
        : selectedValue

      if (onFormularChange) {
        onFormularChange(formularKey || field_name, payload)
      }

      if (props.onElementChange) {
        const updatedData = {
          ...props.data,
          value: payload,
        }

        props.onElementChange(updatedData)

        if (props.data.dirty === undefined || props.data.dirty) {
          updatedData.dirty = true
          if (props.updateElement) {
            props.updateElement(updatedData)
          }
        }
      }
    },
    [props]
  )

  const handleChange = React.useCallback(
    (selectedValue) => {
      const selected = props.data.options?.find((option) => option.value == selectedValue)
      const nextInfo = selected?.info ? info : ''
      setValue(selectedValue)
      setInfo(nextInfo)
      emitChange(selectedValue, nextInfo)
    },
    [emitChange, info, props.data.options]
  )

  const handleInfoChange = React.useCallback(
    (e) => {
      const nextInfo = e.target.value
      setInfo(nextInfo)
      emitChange(value, nextInfo)
    },
    [emitChange, value]
  )

  const userProperties = props.getActiveUserProperties && props.getActiveUserProperties()

  const savedEditor = props.editor
  let isSameEditor = true
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor =
      userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
  }

  const selectProps = {}
  selectProps.style = {
    width: '100%',
    fontSize: '15px',
    color: 'rgba(0, 0, 0, 0.85)',
    WebkitTextFillColor: 'rgba(0, 0, 0, 0.85)',
    opacity: 1,
  }
  selectProps.className = 'rfb-dropdown-select'
  selectProps.placeholder = 'Please Select'
  selectProps.value = value || undefined
  selectProps.onChange = handleChange

  if (props.mutable) {
    selectProps.ref = inputField
  }

  if (props.read_only || !isSameEditor) {
    selectProps.disabled = true
  }

  // Convert options to Ant Design format
  const options = [
    { value: '', label: 'Please Select' },
    ...props.data.options.map((option) => ({
      value: option.value,
      label: option.text,
    })),
  ]

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <ComponentLabel {...props} />
        <Select {...selectProps} options={options} popupClassName="rfb-dropdown-popup" />
        {showInfo && (
          <TextArea
            className="rfb-info-textarea"
            rows={2}
            style={{ ...INFO_TEXTAREA_STYLE, marginTop: 8 }}
            placeholder="Additional information"
            value={info}
            onChange={handleInfoChange}
            disabled={props.read_only || !isSameEditor}
          />
        )}
      </div>
    </div>
  )
}

export default Dropdown
