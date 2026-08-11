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
 * import { ReactFormGenerator } from '@visif/form-builder';
 * import '@visif/form-builder/dist/app.css';
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
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { Button } from 'antd'

import FORM_BUILDER_VERSION from '../../constants/version'
import { FormProvider, useFormContext } from '../../contexts/FormContext'
import type { ReactFormGeneratorProps } from '../../types/form'
import { withGeneratorLegacyKeys } from '../../utils/propAliases'
import FormValidator from './FormValidator'
import {
  clearDraftData,
  hasDraft,
  readDraftFromStorage,
  useDraftPersistence,
} from './hooks/useDraftPersistence'
import { useFormDataCollection } from './hooks/useFormDataCollection'
import { useFormulaVariables } from './hooks/useFormulaVariables'
// Hooks
import { useFormValidation } from './hooks/useFormValidation'
import { renderFormElement } from './utils/formElementRenderer'
// Utils
import { convertAnswerData, getVariableValueHelper } from './utils/formHelpers'

const ReactForm = forwardRef((incomingProps: ReactFormGeneratorProps, ref) => {
  const props = withGeneratorLegacyKeys(incomingProps)
  // Refs
  const formRef = useRef(null)

  // Get form context
  const formContext = useFormContext()

  // State — seed from answer_data merged with any restored draft
  const [answerData, setAnswerData] = useState(() => {
    const ansData = convertAnswerData(props.answer_data)
    const draft = readDraftFromStorage(props)
    return draft ? { ...ansData, ...draft } : ansData
  })

  // Initialize variables in context
  useEffect(() => {
    const ansData = convertAnswerData(props.answer_data)
    const draft = readDraftFromStorage(props)
    const merged = draft ? { ...ansData, ...draft } : ansData
    const initialVariables = getVariableValueHelper(merged, props.data)
    formContext.setAllVariables(initialVariables)
  }, []) // Only on mount

  // Update state when props change
  useEffect(() => {
    const ansData = convertAnswerData(props.answer_data)
    const draft = readDraftFromStorage(props)
    const merged = draft ? { ...ansData, ...draft } : ansData
    setAnswerData(merged)
    const newVariables = getVariableValueHelper(merged, props.data)
    formContext.setAllVariables(newVariables)

    // Also update FormContext values with answer data
    // Need to convert checkbox/radio values to proper format
    Object.keys(ansData).forEach((key) => {
      const item = props.data.find((d) => d.field_name === key)
      const value = ansData[key]

      // Convert simple arrays to checkbox/radio format
      if (item && (item.element === 'Checkboxes' || item.element === 'RadioButtons')) {
        if (Array.isArray(value) && value.length > 0) {
          // If already in correct format, use as-is
          if (typeof value[0] === 'object' && value[0].key !== undefined) {
            formContext.updateValue(key, value)
          } else {
            // Convert simple array to object format
            const convertedValue = value.map((val) => {
              const matchingOption = item.options?.find(
                (opt) => opt.value === val || opt.key === val || opt.text === val
              )
              return {
                key: matchingOption?.key || val,
                value: val,
                info: '',
              }
            })
            formContext.updateValue(key, convertedValue)
          }
        } else if (typeof value === 'string' || typeof value === 'number') {
          // Single value for radio button
          const matchingOption = item.options?.find(
            (opt) => opt.value === value || opt.key === value
          )
          formContext.updateValue(key, [
            {
              key: matchingOption?.key || value,
              value,
              info: '',
            },
          ])
        } else {
          formContext.updateValue(key, value)
        }
      } else {
        formContext.updateValue(key, value)
      }
    })

    // Seed FormContext with isDefault option values for Dropdowns without answer data
    props.data.forEach((item) => {
      if (item.element === 'Dropdown' && !ansData[item.field_name] && Array.isArray(item.options)) {
        const defaultOption = item.options.find((opt) => opt.isDefault === true)
        if (defaultOption) {
          formContext.updateValue(item.field_name, defaultOption.value)
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.answer_data, props.data])

  // Helper functions
  const getDefaultValue = useCallback(
    (item) => {
      const value = answerData[item.field_name]
      if (value !== undefined && value !== null) {
        return value
      }

      // For Dropdown, fall back to the option marked as isDefault
      if (item.element === 'Dropdown' && Array.isArray(item.options)) {
        const defaultOption = item.options.find((opt) => opt.isDefault === true)
        if (defaultOption) {
          return defaultOption.value
        }
      }

      return undefined
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

      // For Checkboxes and RadioButtons, convert array values to proper format
      if (defaultValue && (item.element === 'Checkboxes' || item.element === 'RadioButtons')) {
        // If defaultValue is already in the correct format [{key, value}], use it
        if (
          Array.isArray(defaultValue) &&
          defaultValue.length > 0 &&
          typeof defaultValue[0] === 'object'
        ) {
          return defaultValue
        }

        // If defaultValue is a simple array like ['tech', 'music'], convert it
        if (Array.isArray(defaultValue)) {
          return defaultValue.map((val) => {
            // Find the matching option to get the key
            const matchingOption = item.options?.find(
              (opt) => opt.value === val || opt.key === val || opt.text === val
            )
            return {
              key: matchingOption?.key || val,
              value: val,
              info: '',
            }
          })
        }

        // If defaultValue is a single value, wrap it in array
        if (typeof defaultValue === 'string' || typeof defaultValue === 'number') {
          const matchingOption = item.options?.find(
            (opt) => opt.value === defaultValue || opt.key === defaultValue
          )
          return [
            {
              key: matchingOption?.key || defaultValue,
              value: defaultValue,
              info: '',
            },
          ]
        }
      }

      if (defaultValue) {
        return defaultValue
      }

      const defaultChecked = []
      item.options?.forEach((option) => {
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
      // Find the item — propKey may be either a formularKey or a field_name
      const item = props.data.find((d) => d.field_name === propKey || d.formularKey === propKey)
      const fieldName = item?.field_name || propKey

      // Detect composite formula value from FormulaInput's publishValue:
      // { formula: "...", value: 16, variables: { s_1: 6 } }
      // Store it for form submission only — do NOT feed it into the variable system.
      const isCompositeFormula =
        value !== null && typeof value === 'object' && 'formula' in value && 'variables' in value
      if (isCompositeFormula) {
        formContext.updateValue(fieldName, value)
        return
      }

      // When a FormulaInput propagates its numeric result for formula-chaining
      // (called with formularKey, not field_name), only update the variable —
      // don't overwrite the composite submission value already stored above.
      if (item?.element === 'FormulaInput' && propKey !== fieldName) {
        formContext.updateVariable(propKey, value)
        return
      }

      // Regular input: store value AND update formula variable
      formContext.updateValue(fieldName, value)
      const varKey = item?.formularKey || propKey

      // Extract a scalar value for formula variables.
      // RadioButtons/Checkboxes emit [{key, value, info}] arrays — the formula
      // system expects a plain numeric/string value.
      let formulaValue = value
      if (Array.isArray(value)) {
        if (value.length === 0) {
          formulaValue = ''
        } else {
          const firstItem = value[0]
          if (typeof firstItem === 'object' && firstItem !== null && 'value' in firstItem) {
            formulaValue =
              typeof firstItem.value === 'boolean' ? (firstItem.value ? 1 : 0) : firstItem.value
          } else {
            formulaValue = firstItem
          }
        }
      } else if (typeof value === 'object' && value !== null && 'value' in value) {
        formulaValue = value.value
      }

      formContext.updateVariable(varKey, formulaValue)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.data]
  )

  // Custom hooks for specific functionality
  const { collectFormData, collectFormItems } = useFormDataCollection(props, getEditor)

  // Draft persistence
  const {
    draftRestored,
    handleFormInteraction,
    handleSignature2Change,
    saveDraft,
    clearDraft,
  } = useDraftPersistence(props, collectFormData)

  const { validateForm } = useFormValidation(props, collectFormItems)

  useFormulaVariables(props, setAnswerData)

  // Form submission handler
  const handleSubmit = useCallback(
    (e) => {
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault()
      }

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
          clearDraft()
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
          clearDraft()
          formRef.current.submit()
        }
      }
      // }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props, collectFormData, validateForm, clearDraft]
  )

  useImperativeHandle(
    ref,
    () => ({
      saveDraft,
      handleSubmit,
      clearDraft,
    }),
    [saveDraft, handleSubmit, clearDraft]
  )

  const handleClearDraft = useCallback(() => {
    clearDraft()
    // Reset form state back to original answer_data (without draft)
    const ansData = convertAnswerData(props.answer_data)
    setAnswerData(ansData)
    const newVariables = getVariableValueHelper(ansData, props.data)
    formContext.setAllVariables(newVariables)
  }, [clearDraft, props.answer_data, props.data, formContext])

  const handleRenderSubmit = useCallback(() => {
    const { actionName = 'Submit', submitButton = false } = props

    return (
      <>
        {submitButton || (
          <Button type="primary" htmlType="submit" size="large">
            {actionName}
          </Button>
        )}
        {!props.read_only && (
          <Button type="default" size="large" style={{ marginLeft: 8 }} onClick={handleClearDraft}>
            Clear Draft
          </Button>
        )}
      </>
    )
  }, [props, handleClearDraft])

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
    handleSignature2Change,
    getDefaultValue,
    getEditor,
    optionsDefaultValue,
    getDataById,
    formContext,
  }

  const items = data_items
    .filter((x) => !x.parentId)
    .map((item) => renderFormElement(item, props, {}, renderHelpers))

  const formTokenStyle = {
    display: 'none',
  }

  const backName = props.back_name ? props.back_name : 'Cancel'

  return (
    <div>
      <FormValidator />
      <div
        className="react-form-builder-form"
        data-rfb-version={FORM_BUILDER_VERSION}
        data-rfb-component="generator"
      >
        {draftRestored && !props.read_only && (
          <div className="alert alert-info" style={{ marginBottom: '10px' }}>
            Your previous draft has been restored.
          </div>
        )}
        <form
          encType="multipart/form-data"
          ref={formRef}
          action={props.form_action}
          onSubmit={handleSubmit}
          onChange={handleFormInteraction}
          onInput={handleFormInteraction}
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
})

ReactForm.displayName = 'ReactForm'

// Wrapper component that provides FormContext
const ReactFormWithContext = forwardRef((incomingProps: ReactFormGeneratorProps, ref) => {
  const props = withGeneratorLegacyKeys(incomingProps)
  // Convert answer_data to initial values for context
  // answer_data can be in array format [{name: 'field_name', value: 'value'}]
  // or object format {field_name: 'value'}
  const initialValues = convertAnswerData(props.answer_data)

  return (
    <FormProvider initialValues={initialValues}>
      <ReactForm {...props} ref={ref} />
    </FormProvider>
  )
})

ReactFormWithContext.displayName = 'ReactFormGenerator'

/**
 * Static helper – clear a draft without a component ref:
 *   ReactFormGenerator.clearDraftData({ form_action: '/api/form', ... })
 */
ReactFormWithContext.clearDraftData = clearDraftData

/**
 * Static helper – check if a draft exists:
 *   ReactFormGenerator.hasDraft({ form_action: '/api/form', ... })
 */
ReactFormWithContext.hasDraft = hasDraft

export default ReactFormWithContext
