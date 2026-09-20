import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'

const deleteButtonStyle = {
  cursor: 'pointer',
  color: '#ff4d4f',
  background: 'transparent',
  border: 'none',
  padding: 0,
  lineHeight: 1,
  fontSize: 15,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}

const iconStyle = { fontSize: 15, lineHeight: 1 }

const FormDeleteButton = React.forwardRef(({ title, onClick, className }, ref) => (
  <button
    ref={ref}
    type="button"
    title={title}
    aria-label={title}
    className={className}
    style={deleteButtonStyle}
    onClick={onClick}
  >
    <DeleteOutlined style={iconStyle} />
  </button>
))

FormDeleteButton.displayName = 'FormDeleteButton'

export default FormDeleteButton
