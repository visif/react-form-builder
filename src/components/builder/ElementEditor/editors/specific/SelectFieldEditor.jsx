import React from 'react'
import { Select } from 'antd'

/**
 * Reusable select dropdown field editor component
 * Handles dropdown selections with customizable options
 */
const SelectFieldEditor = ({
  id,
  label,
  value,
  options = [],
  onChange,
  onBlur,
  className,
  renderOption = null,
  helpText = null,
}) => {
  // Debug: Log the options
  console.log('SelectFieldEditor options:', options)
  console.log('SelectFieldEditor value:', value)

  // Convert options to Ant Design format
  const antdOptions = options.map((option, index) => {
    if (renderOption) {
      // For custom render, we need to extract value/label from the rendered element
      const rendered = renderOption(option, index)
      return {
        value: rendered.props.value,
        label: rendered.props.children,
      }
    }

    // Support both {value, label} and simple string options
    const optionValue = typeof option === 'object' ? option.value : option
    const optionLabel = typeof option === 'object' ? option.label : option

    return {
      value: optionValue,
      label: optionLabel,
    }
  })

  console.log('SelectFieldEditor antdOptions:', antdOptions)

  // Wrap onChange to convert Ant Design's value to event-like object
  const handleChange = (selectedValue) => {
    console.log('SelectFieldEditor handleChange:', selectedValue)
    if (onChange) {
      // Create a synthetic event object that mimics native select behavior
      const syntheticEvent = {
        target: {
          value: selectedValue,
          checked: undefined,
        },
      }
      onChange(syntheticEvent)
    }
  }

  return (
    <div className="form-group">
      {label && (
        <label className="control-label" htmlFor={id}>
          {label}
        </label>
      )}
      <Select
        id={id}
        value={value}
        onBlur={onBlur}
        onChange={handleChange}
        options={antdOptions}
        style={{ width: '100%' }}
        placeholder="Please select"
        showSearch
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        getPopupContainer={(trigger) => trigger.parentNode}
        dropdownStyle={{ zIndex: 9999 }}
      />
      {helpText && <p className="help-block">{helpText}</p>}
    </div>
  )
}

export default SelectFieldEditor
