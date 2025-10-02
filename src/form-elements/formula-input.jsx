import React, { useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Parser } from 'hot-formula-parser'
import ComponentHeader from './component-header'
import ComponentLabel from './component-label'
import { useFormInput } from '../providers/FormProvider'

const FormulaInput = ({ data, emitter, formContext, variables, handleChange, ...props }) => {
  const hookContext = useFormInput()
  const context = formContext || hookContext

  // Only require context in form generation mode (when variables are provided)
  if (!context && variables) {
    console.error('FormulaInput: FormProvider context is required for form generation')
    return null
  }

  const { setFieldValue, getFieldValue } = context || {}
  console.log('FormulaInput context mode:', formContext ? 'generator' : 'builder', 'has context:', !!context)

  // Local state for current value and error
  const [currentValue, setCurrentValue] = useState(0) // Track current value locally
  const [error, setError] = useState('')

  const elementId = data?.field_name || `formula_${data?.id}`

  // Calculate formula value using variables from props
  const calculateFormula = useCallback((currentVariables) => {
    if (!data?.formula) return '0.00'

    try {
      const parser = new Parser()
      // Set variables from props (passed from form's variables state)
      Object.keys(currentVariables || {}).forEach(varKey => {
        const varValue = currentVariables[varKey]
        if (varValue !== undefined && varValue !== null && varValue !== '') {
          const numValue = parseFloat(varValue)
          if (!Number.isNaN(numValue)) {
            parser.setVariable(varKey, numValue)
          }
        }
      })

      const result = parser.parse(data.formula)
      if (result.error) {
        setError(`Formula Error: ${result.error}`)
        return '0.00'
      }

      setError('')
      return result.result || 0
    } catch (err) {
      setError(`Error: ${err.message}`)
      return '0.00'
    }
  }, [data?.formula])

  // Initialize current value from FormProvider on mount (only in generator mode)
  useEffect(() => {
    if (getFieldValue) {
      const storedValue = getFieldValue(elementId)
      if (storedValue !== undefined && storedValue !== null) {
        setCurrentValue(storedValue)
      }
    }
  }, [getFieldValue, elementId])

  // Recalculate when variables prop changes OR when formula changes
  useEffect(() => {
    if (data?.formula) {
      const result = calculateFormula(variables || {})

      // Store the result in FormProvider and update local state
      const storedValue = getFieldValue(elementId)
      if (result !== storedValue) {
        setFieldValue(elementId, result)
        setCurrentValue(result)
      }
    }
  }, [data?.formula, calculateFormula, setFieldValue, elementId, getFieldValue]) // Removed variables from dependency

  // Separate effect for variables changes to avoid infinite loops
  useEffect(() => {
    if (data?.formula && variables && Object.keys(variables).length > 0) {
      const result = calculateFormula(variables)

      // Use a ref to track the last calculated value to prevent loops
      const lastResult = currentValue
      if (Math.abs(result - lastResult) > 0.0001) { // Use small epsilon for float comparison
        setFieldValue(elementId, result)
        setCurrentValue(result)

        // If this FormulaInput has a formularKey, emit its value as a variable for other formulas
        if (data?.formularKey && handleChange) {
          setTimeout(() => {
            handleChange(data.formularKey, result)
          }, 50)
        }
      }
    } else {
      console.log('FormulaInput Debug - Skipping calculation - no formula or empty variables')
    }
  }, [variables, data?.formula, data?.formularKey, calculateFormula, elementId, setFieldValue, handleChange, currentValue])

  // Format number for display
  const formatNumber = (num) => {
    if (num === '' || num === null || num === undefined || Number.isNaN(num)) {
      return '0.00'
    }
    const numValue = parseFloat(num)
    return numValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // Remove the duplicate currentValue declaration
  let baseClasses = `${data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      {/* eslint-disable react/jsx-props-no-spreading */}
      <ComponentHeader data={data} {...props} />
      <div className={data.isShowLabel !== false ? 'form-group' : ''}>
        <ComponentLabel data={data} {...props} />
        <input
          type="text"
          className={`form-control ${error ? 'is-invalid' : ''}`}
          name={data?.field_name}
          value={formatNumber(currentValue)}
          disabled
          readOnly
        />
        {error && <div className="invalid-feedback">{error}</div>}
        {data?.formula && (
          <small className="form-text text-muted">
            {`Formula: ${data.formula}`}
          </small>
        )}
      </div>
    </div>
  )
}

FormulaInput.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
    formula: PropTypes.string.isRequired,
    formularKey: PropTypes.string,
    field_name: PropTypes.string,
    pageBreakBefore: PropTypes.bool,
    isShowLabel: PropTypes.bool,
  }).isRequired,
  emitter: PropTypes.shape({
    addListener: PropTypes.func,
  }),
  formContext: PropTypes.shape({
    setFieldValue: PropTypes.func,
    getFieldValue: PropTypes.func,
    values: PropTypes.objectOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      PropTypes.array,
    ])),
  }),
  variables: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])),
  handleChange: PropTypes.func,
}

FormulaInput.defaultProps = {
  emitter: null,
  formContext: null,
  variables: {},
  handleChange: null,
}

export default FormulaInput
