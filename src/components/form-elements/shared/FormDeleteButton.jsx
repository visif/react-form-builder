import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'

const deleteButtonStyle = {
  cursor: 'pointer',
  color: '#ff4d4f',
  background: 'transparent',
  border: 'none',
  padding: 4,
  lineHeight: 1,
  fontSize: 16,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}

const iconStyle = { fontSize: 16 }

const FormDeleteButton = ({ title, onClick }) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    style={deleteButtonStyle}
    onClick={onClick}
  >
    <DeleteOutlined style={iconStyle} />
  </button>
)

export default FormDeleteButton
