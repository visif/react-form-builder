import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import PropTypes from 'prop-types'

import { Input } from 'antd'
import { Parser } from 'hot-formula-parser'

import debounce from '../../../utils/debounce'
import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

/**
 * Evaluate a formula string against a set of variables.
 * Returns the computed result, or fallback if parsing fails.
 */
const evaluateFormula = (formula, variables, fallback = '') => {
  const parser = new Parser()
  Object.entries(variables).forEach(([key, val]) => {
    const num = parseFloat(val)
    if (!Number.isNaN(num)) {
      parser.setVariable(key, num)
    }
  })
  const result = parser.parse(formula)
  return result?.result ?? fallback
}

/**
 * Shallow-compare two variable objects, treating values as floats.
 * Returns true when they differ.
 */
const variablesHaveChanged = (incoming, previous) => {
  const inKeys = Object.keys(incoming)
  const prevKeys = Object.keys(previous)
  if (inKeys.length !== prevKeys.length) return true
  return inKeys.some((k) => {
    const a = parseFloat(incoming[k])
    const b = parseFloat(previous[k])
    if (Number.isNaN(a) && Number.isNaN(b)) return false
    if (Number.isNaN(a) || Number.isNaN(b)) return true
    return Math.abs(a - b) > 0.0001
  })
}

/** Format a number for display with 2 decimal places. */
const formatNumber = (num) => {
  if (num === '' || num === null || num === undefined || Number.isNaN(num)) {
    return '0.00'
  }
  return parseFloat(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const FormulaInput = (props) => {
  const { data, style, variables: propVariables, emitter, defaultValue, handleChange } = props

  // --- state ---
  const [error] = useState('')
  const [formula, setFormula] = useState(data?.formula || '')
  const [variables, setVariables] = useState(propVariables || {})
  const [value, setValue] = useState(() => {
    if (data?.formula && propVariables) {
      return evaluateFormula(data.formula, propVariables)
    }
    return ''
  })
  const [isUpdating, setIsUpdating] = useState(false)

  // Refs to let the debounced callback always read the latest state
  const formulaRef = useRef(formula)
  const variablesRef = useRef(variables)
  const valueRef = useRef(value)
  const isUpdatingRef = useRef(isUpdating)

  formulaRef.current = formula
  variablesRef.current = variables
  valueRef.current = value
  isUpdatingRef.current = isUpdating

  /**
   * Extract the variable names actually referenced in a formula string.
   * hot-formula-parser variables are bare identifiers like s_1, total, etc.
   */
  const getFormulaVarNames = useCallback((formulaStr) => {
    if (!formulaStr) return []
    // Match identifiers that are NOT pure numbers and NOT known function names
    const tokens = formulaStr.match(/[A-Za-z_]\w*/g) || []
    // Deduplicate
    return [...new Set(tokens)]
  }, [])

  /**
   * Publish the composite { formula, value, variables } to FormContext
   * using field_name so collectFormData can pick it up on submit.
   * Only includes variables that the formula actually references.
   */
  const publishValue = useCallback(
    (f, v, vars) => {
      if (handleChange && data?.field_name) {
        // Filter variables to only those referenced in the formula
        const usedNames = getFormulaVarNames(f)
        const filteredVars = {}
        usedNames.forEach((name) => {
          if (vars[name] !== undefined) {
            filteredVars[name] = vars[name]
          }
        })
        handleChange(data.field_name, { formula: f, value: v, variables: filteredVars })
      }
    },
    [handleChange, data?.field_name, getFormulaVarNames]
  )

  // ---------------------------------------------------------------
  // getDerivedStateFromProps equivalent — sync state from props
  // ---------------------------------------------------------------
  // 1. defaultValue override
  useEffect(() => {
    if (
      defaultValue &&
      defaultValue.value !== value &&
      defaultValue.value !== '' &&
      defaultValue.value !== null &&
      defaultValue.value !== undefined
    ) {
      const newFormula = defaultValue.formula || formula
      const newVars = defaultValue.variables || variables
      if (defaultValue.formula) setFormula(newFormula)
      if (defaultValue.variables) setVariables(newVars)
      setValue(defaultValue.value)
      publishValue(newFormula, defaultValue.value, newVars)
    }
  }, [defaultValue]) // eslint-disable-line react-hooks/exhaustive-deps

  // 2. Recalculate when props.variables or props.data.formula change
  const incomingVars = useMemo(() => propVariables || {}, [propVariables])

  useEffect(() => {
    if (!data?.formula) return

    const formulaChanged = data.formula !== formulaRef.current
    const varsChanged = variablesHaveChanged(incomingVars, variablesRef.current)

    if (formulaChanged || varsChanged) {
      const merged = { ...variablesRef.current, ...incomingVars }
      const newValue = evaluateFormula(data.formula, merged)
      setFormula(data.formula)
      setVariables(merged)
      setValue(newValue)
      publishValue(data.formula, newValue, merged)
    }
  }, [data?.formula, incomingVars]) // eslint-disable-line react-hooks/exhaustive-deps

  // 3. Publish initial value on mount
  useEffect(() => {
    publishValue(formula, value, variables)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ---------------------------------------------------------------
  // processVariableChange (called by debounced emitter handler)
  // ---------------------------------------------------------------
  const processVariableChange = useCallback(
    (params) => {
      const currentFormula = formulaRef.current
      const currentVars = variablesRef.current
      const currentValue = valueRef.current
      if (!currentFormula) return

      setIsUpdating(true)

      const parser = new Parser()
      let newVariables = { ...currentVars }

      if (params.value === '' || params.value === null || params.value === undefined) {
        newVariables[params.propKey] = 0
      } else {
        const processedValue = params.value
        if (typeof processedValue === 'string' && processedValue.trim().endsWith('%')) {
          const numericPart = processedValue.trim().slice(0, -1).replace(/,/g, '')
          const parsed = parseFloat(numericPart)
          newVariables[params.propKey] = !Number.isNaN(parsed) ? parsed / 100 : 0
        } else {
          const parsed = parseFloat(String(processedValue).replace(/,/g, ''))
          newVariables[params.propKey] = !Number.isNaN(parsed) ? parsed : 0
        }
      }

      Object.entries(newVariables).forEach(([key, val]) => {
        const numValue = parseFloat(val)
        parser.setVariable(key, !Number.isNaN(numValue) ? numValue : 0)
      })

      const parseResult = parser.parse(currentFormula)
      const newValue = parseResult?.result || 0

      setVariables(newVariables)
      setValue(newValue)
      setIsUpdating(false)

      // Always publish the composite value for form submission
      publishValue(currentFormula, newValue, newVariables)

      // Propagate change via handleChange if the value actually changed
      const { formularKey } = data
      const valueChanged = Math.abs(currentValue - newValue) > 0.0001
      if (formularKey && handleChange && valueChanged && params.propKey !== formularKey) {
        setTimeout(() => handleChange(formularKey, newValue), 50)
      }
    },
    [data, handleChange]
  )

  // Create the debounced version once and keep it stable
  const debouncedUpdate = useMemo(
    () => debounce((params) => processVariableChange(params), 100),
    [processVariableChange]
  )

  // Cancel pending debounce on unmount
  useEffect(() => {
    return () => {
      if (debouncedUpdate.cancel) debouncedUpdate.cancel()
    }
  }, [debouncedUpdate])

  // ---------------------------------------------------------------
  // Emitter subscription (variableChange)
  // ---------------------------------------------------------------
  useEffect(() => {
    if (!emitter || typeof emitter.addListener !== 'function') return

    const handler = (params) => {
      if (!formulaRef.current || isUpdatingRef.current) return
      debouncedUpdate(params)
    }

    const subscription = emitter.addListener('variableChange', handler)
    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove()
      }
    }
  }, [emitter, debouncedUpdate])

  // ---------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------
  let baseClasses = `${data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div style={{ ...style }} className={baseClasses}>
      {/* eslint-disable react/jsx-props-no-spreading */}
      <ComponentHeader data={data} style={style} {...props} />
      <div className={data.isShowLabel !== false ? 'form-group' : ''}>
        <ComponentLabel data={data} style={style} {...props} />
        <Input
          type="text"
          name={data?.field_name}
          value={formatNumber(value)}
          disabled={true}
          status={error ? 'error' : ''}
          style={{
            width: '100%',
            borderStyle: 'solid',
            cursor: 'not-allowed',
            color: 'rgba(0, 0, 0, 0.85)',
            WebkitTextFillColor: 'rgba(0, 0, 0, 0.85)',
            opacity: 1,
          }}
        />
        {/* eslint-enable react/jsx-props-no-spreading */}
        {error && (
          <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>{error}</div>
        )}
      </div>
    </div>
  )
}

FormulaInput.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string,
    formula: PropTypes.string,
    field_name: PropTypes.string,
    formularKey: PropTypes.string,
    pageBreakBefore: PropTypes.bool,
    isShowLabel: PropTypes.bool,
  }).isRequired,
  variables: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  emitter: PropTypes.shape({
    addListener: PropTypes.func,
  }),
  defaultValue: PropTypes.shape({
    formula: PropTypes.string,
    variables: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  style: PropTypes.shape({}),
  handleChange: PropTypes.func,
}

FormulaInput.defaultProps = {
  variables: {},
  emitter: null,
  defaultValue: null,
  style: {},
  handleChange: null,
}

export default FormulaInput
