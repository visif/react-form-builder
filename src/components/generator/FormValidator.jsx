/**
 * <FormValidator />
 */
import React from 'react'
import { Alert, Button } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

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

  const dismissModal = React.useCallback(() => {
    formContext.setErrors([])
  }, [formContext])

  const errorItems = errors.map((error, index) => (
    <li key={`error_${index}`} dangerouslySetInnerHTML={{ __html: myxss.process(error) }} />
  ))

  return (
    <div>
      {errors.length > 0 && (
        <Alert
          message={
            <div>
              <ExclamationCircleOutlined style={{ marginRight: 8 }} />
              <ul style={{ display: 'inline-block', margin: 0, paddingLeft: 20 }}>
                {errorItems}
              </ul>
            </div>
          }
          type="error"
          closable
          onClose={dismissModal}
          style={{ marginBottom: 16 }}
        />
      )}
    </div>
  )
}

export default FormValidator
