import React from 'react'

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
  className = 'form-control',
  renderOption = null,
  helpText = null,
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="control-label" htmlFor={id}>
          {label}
        </label>
      )}
      <select
        id={id}
        className={className}
        value={value}
        defaultValue={value}
        onBlur={onBlur}
        onChange={onChange}
      >
        {options.map((option, index) => {
          if (renderOption) {
            return renderOption(option, index)
          }

          // Support both {value, label} and simple string options
          const optionValue = typeof option === 'object' ? option.value : option
          const optionLabel = typeof option === 'object' ? option.label : option
          const optionKey = typeof option === 'object' ? option.key || option.value : option

          return (
            <option value={optionValue} key={optionKey || index}>
              {optionLabel}
            </option>
          )
        })}
      </select>
      {helpText && <p className="help-block">{helpText}</p>}
    </div>
  )
}

export default SelectFieldEditor
