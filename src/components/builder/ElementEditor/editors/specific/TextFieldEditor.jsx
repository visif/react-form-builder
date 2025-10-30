import React from 'react'
import TextAreaAutosize from 'react-textarea-autosize'

/**
 * Reusable text field editor component
 * Handles single-line text inputs and text areas
 */
const TextFieldEditor = ({
  label,
  id,
  value,
  onChange,
  onBlur,
  type = 'text',
  multiline = false,
  placeholder = '',
  helpText = null,
  className = 'form-control'
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="control-label" htmlFor={id}>
          {label}
        </label>
      )}
      {multiline ? (
        <TextAreaAutosize
          id={id}
          type={type}
          className={className}
          value={value}
          defaultValue={value}
          onBlur={onBlur}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : (
        <input
          id={id}
          type={type}
          className={className}
          value={value}
          defaultValue={value}
          onBlur={onBlur}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
      {helpText && <p className="help-block">{helpText}</p>}
    </div>
  )
}

export default TextFieldEditor
