/**
 * FormContext - Centralized state management for form generator
 *
 * Provides a context for managing form field values without relying on refs.
 * This allows functional components to easily update and access form state.
 *
 * @example
 * // In ReactForm (Provider)
 * <FormProvider>
 *   <FormElements />
 * </FormProvider>
 *
 * // In a form element (Consumer)
 * const { values, updateValue } = useFormContext()
 * updateValue('field_name', newValue)
 */

import React, { createContext, useContext, useState, useCallback } from 'react'

const FormContext = createContext(null)

export const FormProvider = ({ children, initialValues = {} }) => {
  const [values, setValues] = useState(initialValues)

  const updateValue = useCallback((fieldName, value) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }, [])

  const getValue = useCallback((fieldName) => {
    return values[fieldName]
  }, [values])

  const getAllValues = useCallback(() => {
    return values
  }, [values])

  const resetValues = useCallback(() => {
    setValues(initialValues)
  }, [initialValues])

  const value = {
    values,
    updateValue,
    getValue,
    getAllValues,
    resetValues
  }

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  )
}

export const useFormContext = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider')
  }
  return context
}

export default FormContext
