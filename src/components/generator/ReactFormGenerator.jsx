/**
 * ReactForm (Form Generator) - Renders forms from JSON data structure
 *
 * @component
 * @class
 * @description Generates interactive forms from JSON configuration. Supports validation,
 * dynamic fields, formula parsing, and variable replacement. Handles form submission
 * and answer data pre-population.
 *
 * @example
 * // Basic usage
 * import { ReactFormGenerator } from 'react-form-builder2';
 * import 'react-form-builder2/dist/app.css';
 *
 * function DisplayForm({ formData }) {
 *   return (
 *     <ReactFormGenerator
 *       data={formData}
 *       form_action="/submit"
 *       form_method="POST"
 *     />
 *   );
 * }
 *
 * @example
 * // With answer data and custom submit handler
 * <ReactFormGenerator
 *   data={formData}
 *   answer_data={previousAnswers}
 *   onSubmit={(data) => {
 *     console.log('Submitted:', data);
 *     // Custom submission logic
 *   }}
 *   skip_validations={false}
 *   read_only={false}
 * />
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Form structure data (required)
 * @param {string} [props.form_action] - Form submission URL
 * @param {string} [props.form_method='POST'] - HTTP method for form submission
 * @param {string} [props.action_name='Submit'] - Submit button text
 * @param {string} [props.back_action] - URL for cancel/back button
 * @param {string} [props.back_name='Cancel'] - Cancel button text
 * @param {Function} [props.onSubmit] - Custom submit handler (overrides form POST)
 * @param {Array} [props.answer_data] - Pre-existing answers to populate form
 * @param {number} [props.task_id] - Hidden task ID to submit with form
 * @param {string} [props.authenticity_token] - CSRF token for Rails
 * @param {boolean} [props.hide_actions=false] - Hide submit/cancel buttons
 * @param {boolean} [props.skip_validations=false] - Skip form validation on submit
 * @param {boolean} [props.display_short=false] - Show only critical fields
 * @param {boolean} [props.read_only=false] - Render as read-only form
 * @param {Object} [props.variables] - Variables for signature replacement
 * @param {React.ReactElement} [props.submitButton] - Custom submit button component
 * @param {Function} [props.onUpdate] - Callback when form data changes
 *
 * @returns {React.ReactElement} The rendered form with all configured elements
 *
 * @since 0.1.0
 * @requires hot-formula-parser for formula fields
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from 'antd'
import ReactDOM from 'react-dom'

import { FormProvider, useFormContext } from '../../contexts/FormContext'
import FormValidator from './FormValidator'

// Hooks
import { useFormValidation } from './hooks/useFormValidation'
import { useFormDataCollection } from './hooks/useFormDataCollection'
import { useFormulaVariables } from './hooks/useFormulaVariables'

// Utils
import { convertAnswerData, getVariableValueHelper, getItemValue } from './utils/formHelpers'
import { renderFormElement } from './utils/formElementRenderer'

const ReactForm = (props) => {
  // Refs
  const formRef = useRef(null)
  const inputsRef = useRef({})

  // Get form context
  const formContext = useFormContext()

  // State
  const [answerData, setAnswerData] = useState(() => convertAnswerData(props.answer_data))

  // Initialize variables in context
  useEffect(() => {
    const ansData = convertAnswerData(props.answer_data)
    const initialVariables = getVariableValueHelper(ansData, props.data)
    formContext.setAllVariables(initialVariables)
  }, []) // Only on mount

  // Update state when props change
  useEffect(() => {
    const ansData = convertAnswerData(props.answer_data)
    setAnswerData(ansData)
    const newVariables = getVariableValueHelper(ansData, props.data)
    formContext.setAllVariables(newVariables)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.answer_data, props.data])

  // Helper functions
  const getDefaultValue = useCallback(
    (item) => {
      return answerData[item.field_name]
    },
    [answerData]
  )

  const getEditor = useCallback(
    (item) => {
      if (!props.answer_data || !Array.isArray(props.answer_data)) {
        return null
      }
      const itemAns = props.answer_data.find((x) => x.name === item.field_name)
      return itemAns && itemAns.editor
    },
    [props.answer_data]
  )

  const optionsDefaultValue = useCallback(
    (item) => {
      const defaultValue = getDefaultValue(item)
      if (defaultValue) {
        return defaultValue
      }

      const defaultChecked = []
      item.options.forEach((option) => {
        if (answerData[`option_${option.key}`]) {
          defaultChecked.push(option.key)
        }
      })
      return defaultChecked
    },
    [answerData, getDefaultValue]
  )

  const getDataById = useCallback(
    (id) => {
      const { data } = props
      const item = data.find((x) => x.id === id)
      return item
    },
    [props]
  )

  // Handle input changes and update variables via context
  const handleChange = useCallback(
    (propKey, value) => {
      // Update the form context with the new value
      formContext.updateValue(propKey, value)
      // Update variable if this field has a formularKey
      const item = props.data.find((d) => d.field_name === propKey)
      if (item?.formularKey) {
        formContext.updateVariable(item.formularKey, value)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.data]
  )

  // Custom hooks for specific functionality
  const { collectFormData, collectFormItems } = useFormDataCollection(
    props,
    inputsRef,
    getItemValue,
    getEditor
  )

  const { validateForm } = useFormValidation(
    props,
    inputsRef,
    getItemValue,
    collectFormItems
  )

  useFormulaVariables(props, setAnswerData)

  // Form submission handler
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()

      const { onSubmit } = props

      // submit with no form
      if (onSubmit) {
        let errors = []
        if (!props.skip_validations) {
          errors = validateForm()
          // Publish errors to context
          formContext.setErrors(errors)
        }

        // Only submit if there are no errors.
        if (errors.length < 1) {
          const data = collectFormData(props.data)
          onSubmit(data, props.parentElementId)
        }
      } else {
        // incase no submit function provided => go to form submit

        let errors = []
        if (!props.skip_validations) {
          errors = validateForm()
          // Publish errors to context
          formContext.setErrors(errors)
        }

        // Only submit if there are no errors.
        if (errors.length < 1) {
          const $form = ReactDOM.findDOMNode(formRef.current)
          $form.submit()
        }
      }
      // }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props, collectFormData, validateForm]
  )

  const handleRenderSubmit = useCallback(() => {
    const { actionName = 'Submit', submitButton = false } = props

    return (
      submitButton || (
        <Button type="primary" htmlType="submit" size="large">
          {actionName}
        </Button>
      )
    )
  }, [props])

  // Render logic
  let data_items = props.data

  if (props.display_short && Array.isArray(props.data)) {
    data_items = props.data.filter((i) => i.alternateForm === true)
  }

  // Ensure data_items is always an array
  if (!Array.isArray(data_items)) {
    data_items = []
  }

  data_items.forEach((item) => {
    if (
      item &&
      item.readOnly &&
      item.variableKey &&
      props.variables &&
      props.variables[item.variableKey]
    ) {
      answerData[item.field_name] = props.variables[item.variableKey]
    }
  })

  // Prepare helpers for rendering
  const renderHelpers = {
    handleChange,
    getDefaultValue,
    getEditor,
    optionsDefaultValue,
    getDataById,
    formContext,
  }

  const renderRefs = {
    inputsRef,
  }

  const items = data_items
    .filter((x) => !x.parentId)
    .map((item) => renderFormElement(item, props, {}, renderHelpers, renderRefs))

  const formTokenStyle = {
    display: 'none',
  }

  const backName = props.back_name ? props.back_name : 'Cancel'

  return (
    <div>
      <FormValidator />
      <div className="react-form-builder-form">
        <form
          encType="multipart/form-data"
          ref={formRef}
          action={props.form_action}
          onSubmit={handleSubmit}
          method={props.form_method}
        >
          {props.authenticity_token && (
            <div style={formTokenStyle}>
              <input name="utf8" type="hidden" value="&#x2713;" />
              <input name="authenticity_token" type="hidden" value={props.authenticity_token} />
              <input name="task_id" type="hidden" value={props.task_id} />
            </div>
          )}
          {items}
          <div className="btn-toolbar">
            {!props.hide_actions && handleRenderSubmit()}
            {!props.hide_actions && props.back_action && (
              <Button href={props.back_action} size="large" style={{ marginLeft: 8 }}>
                {backName}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

ReactForm.defaultProps = {
  validateForCorrectness: false,
  data: [],
  answer_data: {},
}

// Wrapper component that provides FormContext
const ReactFormWithContext = (props) => {
  // Convert answer_data to initial values for context
  const initialValues = props.answer_data || {}

  return (
    <FormProvider initialValues={initialValues}>
      <ReactForm {...props} />
    </FormProvider>
  )
}

export default ReactFormWithContext
