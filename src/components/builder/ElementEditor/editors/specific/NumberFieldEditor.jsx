import React from 'react'

/**
 * Number range field editor with min/max/step controls
 * Used for Range, NumberInput, and similar numeric elements
 */
const NumberFieldEditor = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  type = 'number',
  min = null,
  max = null,
  step = null,
  className = 'form-control',
  helpText = null,
}) => {
  return (
    <div className="form-group">
      <div className="form-group-range">
        {label && (
          <label className="control-label" htmlFor={id}>
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          className={className}
          value={value}
          defaultValue={value}
          onBlur={onBlur}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
        />
        {helpText && <p className="help-block">{helpText}</p>}
      </div>
    </div>
  )
}

export default NumberFieldEditor
