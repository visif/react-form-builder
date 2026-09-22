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

export const filterDropdownOption = (input, option) => {
  const query = String(input ?? '')
    .trim()
    .toLowerCase()
  if (!query) return true
  const label = String(option?.label ?? '').toLowerCase()
  const optionValue = String(option?.value ?? '').toLowerCase()
  return label.includes(query) || optionValue.includes(query)
}

const Dropdown = (props) => {
  const inputField = React.useRef()
  const parsedDefault = parseDropdownValue(props.defaultValue)
  const [value, setValue] = React.useState(parsedDefault.value)
  const [info, setInfo] = React.useState(parsedDefault.info)
  const [searchValue, setSearchValue] = React.useState('')

  // Update value when defaultValue prop changes
  React.useEffect(() => {
    const next = parseDropdownValue(props.defaultValue)
    setValue(next.value)
    setInfo(next.info)
    setSearchValue('')
  }, [props.defaultValue])

  const selectedOption = props.data.options?.find((option) => option.value == value)
  const showInfo = !!selectedOption?.info
  const isSearching = searchValue.length > 0

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
      const nextValue = selectedValue ?? ''
      const selected = props.data.options?.find((option) => option.value == nextValue)
      const nextInfo = selected?.info ? info : ''
      setSearchValue('')
      setValue(nextValue)
      setInfo(nextInfo)
      emitChange(nextValue, nextInfo)
    },
    [emitChange, info, props.data.options]
  )

  const handleSearch = React.useCallback((input) => {
    setSearchValue(input)
  }, [])

  const handleInputKeyDown = React.useCallback(
    (event) => {
      if (event.key === 'Backspace' && !searchValue && value) {
        handleChange('')
      }
    },
    [handleChange, searchValue, value]
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

  const isDisabled = !!(props.read_only || !isSameEditor)
  const selectProps = {}
  selectProps.style = {
    width: '100%',
    fontSize: '15px',
  }
  selectProps.className = isSearching
    ? 'rfb-dropdown-select rfb-dropdown-searching'
    : 'rfb-dropdown-select'
  selectProps.placeholder = isSearching ? undefined : 'Please Select'
  selectProps.value = value || undefined
  selectProps.onSearch = handleSearch
  selectProps.onChange = handleChange
  selectProps.onInputKeyDown = handleInputKeyDown
  selectProps.onDropdownVisibleChange = (open) => {
    if (!open) setSearchValue('')
  }
  selectProps.showSearch = true
  selectProps.allowClear = !isDisabled
  selectProps.autoClearSearchValue = true
  selectProps.optionFilterProp = 'label'
  selectProps.filterOption = filterDropdownOption

  if (props.mutable) {
    selectProps.ref = inputField
  }

  if (isDisabled) {
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
            disabled={isDisabled}
          />
        )}
      </div>
    </div>
  )
}

export default Dropdown
