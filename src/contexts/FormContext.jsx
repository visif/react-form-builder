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
import React, { createContext, useCallback, useContext, useState, useRef, useMemo } from 'react'

const FormContext = createContext(null)

export const FormProvider = ({ children, initialValues = {} }) => {
  const [values, setValues] = useState(initialValues)
  const [variables, setVariables] = useState({})
  const [validationErrors, setValidationErrors] = useState([])
  const variableListenersRef = useRef([])

  const updateValue = useCallback((fieldName, value) => {
    setValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }, [])

  const getValue = useCallback(
    (fieldName) => {
      return values[fieldName]
    },
    [values]
  )

  const getAllValues = useCallback(() => {
    return values
  }, [values])

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

  const getVariable = useCallback(
    (varKey) => {
      return variables[varKey]
    },
    [variables]
  )

  const getAllVariables = useCallback(() => {
    return variables
  }, [variables])

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
    return validationErrors
  }, [validationErrors])

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
    [
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
    ]
  )

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}

export const useFormContext = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider')
  }
  return context
}

export default FormContext
