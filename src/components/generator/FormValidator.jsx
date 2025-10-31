/**
 * <FormValidator />
 */
import React from 'react'

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
        <div className="alert alert-danger validation-error">
          <div className="clearfix">
            <i className="fas fa-exclamation-triangle float-left"></i>
            <ul className="float-left">{errorItems}</ul>
          </div>
          <div className="clearfix">
            <a className="float-right btn btn-default btn-sm btn-danger" onClick={dismissModal}>
              Dismiss
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormValidator
