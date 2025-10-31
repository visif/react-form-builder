/**
 * <FormValidator />
 */
import React from 'react'

import PropTypes from 'prop-types'

import xss from 'xss'

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

const FormValidator = (props) => {
  const [errors, setErrors] = React.useState([])

  React.useEffect(() => {
    const subscription = props.emitter.addListener('formValidation', (errors) => {
      setErrors(errors)
    })

    return () => {
      subscription.remove()
    }
  }, [props.emitter])

  const dismissModal = React.useCallback((e) => {
    e.preventDefault()
    setErrors([])
  }, [])

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

FormValidator.propTypes = {
  emitter: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
  }).isRequired,
}

export default FormValidator
