/**
 * FormContext - Centralized state management for form generator
 *
 * Provides a context for managing form field values, formula variables,
 * and validation errors without relying on refs or external event emitters.
 *
 * @example
 * // In ReactForm (Provider)
 * <FormProvider>
 *   <FormElements />
 * </FormProvider>
 *
 * // In a form element (Consumer)
 * const { values, updateValue, variables, updateVariable } = useFormContext()
 * updateValue('field_name', newValue)
 * updateVariable('varKey', computedValue)
 */
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

// Default no-op context value for when FormProvider is not available
// (e.g., duplicate React instances via yarn link, or components used standalone)
const defaultFormContextValue = {
  values: {},
  updateValue: () => {},
  getValue: () => undefined,
  getAllValues: () => ({}),
  resetValues: () => {},
  variables: {},
  updateVariable: () => {},
  getVariable: () => undefined,
  getAllVariables: () => ({}),
  setAllVariables: () => {},
  addVariableListener: () => () => {},
  validationErrors: [],
  setErrors: () => {},
  getErrors: () => [],
}

const FormContext = createContext(defaultFormContextValue)

export const FormProvider = ({ children, initialValues = {} }) => {
  const [values, setValues] = useState(initialValues)
  const [variables, setVariables] = useState({})
  const [validationErrors, setValidationErrors] = useState([])
  const variableListenersRef = useRef([])

  // Refs for stable getter functions — avoid re-creating callbacks when state changes
  const valuesRef = useRef(values)
  const variablesRef = useRef(variables)
  const validationErrorsRef = useRef(validationErrors)
  valuesRef.current = values
  variablesRef.current = variables
  validationErrorsRef.current = validationErrors

  const updateValue = useCallback((fieldName, value) => {
    setValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }, [])

  const getValue = useCallback((fieldName) => {
    return valuesRef.current[fieldName]
  }, [])

  const getAllValues = useCallback(() => {
    return valuesRef.current
  }, [])

  const resetValues = useCallback(() => {
    setValues(initialValues)
  }, [initialValues])

  // Variable management for formula fields
  const updateVariable = useCallback((varKey, value) => {
    setVariables((prev) => {
      const newVariables = {
        ...prev,
        [varKey]: value,
      }

      // Notify listeners about variable change
      variableListenersRef.current.forEach((listener) => {
        listener({ propKey: varKey, value })
      })

      return newVariables
    })
  }, [])

  const getVariable = useCallback((varKey) => {
    return variablesRef.current[varKey]
  }, [])

  const getAllVariables = useCallback(() => {
    return variablesRef.current
  }, [])

  const setAllVariables = useCallback((newVariables) => {
    setVariables(newVariables)
  }, [])

  const addVariableListener = useCallback((listener) => {
    variableListenersRef.current.push(listener)
    // Return unsubscribe function
    return () => {
      variableListenersRef.current = variableListenersRef.current.filter((l) => l !== listener)
    }
  }, [])

  // Validation error management
  const setErrors = useCallback((errors) => {
    setValidationErrors(errors)
  }, [])

  const getErrors = useCallback(() => {
    return validationErrorsRef.current
  }, [])

  const value = useMemo(
    () => ({
      values,
      updateValue,
      getValue,
      getAllValues,
      resetValues,
      variables,
      updateVariable,
      getVariable,
      getAllVariables,
      setAllVariables,
      addVariableListener,
      validationErrors,
      setErrors,
      getErrors,
    }),
    [values, variables, validationErrors]
  )

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}

export const useFormContext = () => {
  const context = useContext(FormContext)
  if (context === defaultFormContextValue && process.env.NODE_ENV !== 'production') {
    console.warn(
      'useFormContext: No FormProvider found. Using default no-op context. ' +
        'If you are using yarn link or npm link, ensure only one copy of React is loaded. ' +
        'See: https://react.dev/warnings/invalid-hook-call-warning'
    )
  }
  return context
}

export default FormContext
