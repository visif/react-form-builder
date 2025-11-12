/**
 * <FormValidator />
 */
import React from 'react'
import { ExclamationCircleOutlined, CloseOutlined } from '@ant-design/icons'

import xss from 'xss'

import { useFormContext } from '../../contexts/FormContext'

const myxss = new xss.FilterXSS({
  whiteList: {
    u: [],
    br: [],
    b: [],
    i: [],
    ol: ['style'],
    ul: ['style'],
    li: [],
    p: ['style'],
    sub: [],
    sup: [],
    div: ['style'],
    em: [],
    strong: [],
    span: ['style'],
  },
})

const FormValidator = () => {
  const formContext = useFormContext()
  const errors = formContext.validationErrors

  // Debug: Log errors when they change
  React.useEffect(() => {
    if (errors.length > 0) {
      console.log('FormValidator - Current errors:', errors)
    }
  }, [errors])

  const handleClose = () => {
    formContext.setErrors([])
  }

  if (errors.length === 0) {
    return null
  }

  // Create a unique key based on error content to force re-render when errors change
  const errorKey = errors.join('|')

  return (
    <div
      key={errorKey}
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        width: 400,
        backgroundColor: '#ffebee',
        border: '1px solid #ffcdd2',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        padding: '16px',
        zIndex: 1000,
        animation: 'slideInRight 0.3s ease-out',
      }}
    >
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#d32f2f' }}>
            <ExclamationCircleOutlined style={{ marginRight: 8 }} />
            Validation Error
          </div>

          {errors.length === 1 ? (
            <div
              style={{ color: '#5f2120' }}
              dangerouslySetInnerHTML={{ __html: myxss.process(errors[0]) }}
            />
          ) : (
            <div>
              <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#5f2120' }}>
                {errors.length} required fields are missing:
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#5f2120' }}>
                {errors.map((error, idx) => (
                  <li key={idx} dangerouslySetInnerHTML={{ __html: myxss.process(error) }} />
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            marginLeft: '8px',
            fontSize: '14px',
            color: '#d32f2f',
            lineHeight: 1,
          }}
          aria-label="Close"
        >
          <CloseOutlined />
        </button>
      </div>
    </div>
  )
}

export default FormValidator
