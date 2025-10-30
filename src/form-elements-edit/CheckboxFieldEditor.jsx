import React from 'react'

/**
 * Reusable checkbox field editor component
 * Handles boolean properties with checkbox inputs
 */
const CheckboxFieldEditor = ({
  id,
  label,
  checked,
  onChange,
  className = 'custom-control custom-checkbox'
}) => {
  return (
    <div className={className}>
      <input
        id={id}
        className="custom-control-input"
        type="checkbox"
        checked={checked}
        value
        onChange={onChange}
      />
      <label className="custom-control-label" htmlFor={id}>
        {label}
      </label>
    </div>
  )
}

export default CheckboxFieldEditor
