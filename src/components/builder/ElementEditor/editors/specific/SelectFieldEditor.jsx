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
        defaultValue={value}
        onBlur={onBlur}
        onChange={onChange}
        options={antdOptions}
        style={{ width: '100%' }}
      />
      {helpText && <p className="help-block">{helpText}</p>}
    </div>
  )
}

export default SelectFieldEditor
