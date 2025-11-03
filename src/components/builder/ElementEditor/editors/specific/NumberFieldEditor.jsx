import React from 'react'
import { InputNumber } from 'antd'

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
  className,
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
        <InputNumber
          id={id}
          value={value}
          defaultValue={value}
          onBlur={onBlur}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          style={{ width: '100%' }}
        />
        {helpText && <p className="help-block">{helpText}</p>}
      </div>
    </div>
  )
}

export default NumberFieldEditor
