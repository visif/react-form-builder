import React from 'react'
import { Input } from 'antd'

const { TextArea } = Input

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
  className,
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="control-label" htmlFor={id}>
          {label}
        </label>
      )}
      {multiline ? (
        <TextArea
          id={id}
          value={value}
          defaultValue={value}
          onBlur={onBlur}
          onChange={onChange}
          placeholder={placeholder}
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      ) : (
        <Input
          id={id}
          type={type}
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
