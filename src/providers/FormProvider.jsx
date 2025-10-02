import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react'
import PropTypes from 'prop-types'

const SET_FIELD_VALUE = 'SET_FIELD_VALUE'
const SET_MULTIPLE_VALUES = 'SET_MULTIPLE_VALUES'
const RESET_FORM = 'RESET_FORM'
const TOGGLE_CHECKBOX = 'TOGGLE_CHECKBOX'
const SET_CHECKBOX_VALUES = 'SET_CHECKBOX_VALUES'
const SET_FIELD_METADATA = 'SET_FIELD_METADATA'
const SET_VALIDATION_ERROR = 'SET_VALIDATION_ERROR'
const CLEAR_VALIDATION_ERROR = 'CLEAR_VALIDATION_ERROR'
const REMOVE_FIELD = 'REMOVE_FIELD'

// Helper functions for immutable array operations
const toggleArrayValue = (array = [], value) => {
  const newArray = [...(Array.isArray(array) ? array : [])]
  const index = newArray.findIndex((item) => (
    typeof item === 'object' ? item.value === value : item === value
  ))

  if (index === -1) {
    newArray.push(value)
  } else {
    newArray.splice(index, 1)
  }

  return newArray
}

const ensureArray = (value) => {
  if (value === null || value === undefined) return []
  return Array.isArray(value) ? value : [value]
}

// Reducer to handle form state updates
const formReducer = (state, action) => {
  switch (action.type) {
    case SET_FIELD_VALUE: {
      const newState = {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value,
        },
      }
      console.log('FormProvider reducer SET_FIELD_VALUE - new state:', newState.values)
      return newState
    }

    case SET_MULTIPLE_VALUES: {
      // Handle both array and single values for each field
      const processedValues = Object.entries(action.values).reduce(
        (acc, [key, value]) => {
          // If the current field already has an array value, preserve array nature
          const isCurrentArray = Array.isArray(state.values[key])
          acc[key] = isCurrentArray ? ensureArray(value) : value
          return acc
        },
        {},
      )

      return {
        ...state,
        values: {
          ...state.values,
          ...processedValues,
        },
      }
    }

    case TOGGLE_CHECKBOX:
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: toggleArrayValue(state.values[action.field], action.value),
        },
      }

    case SET_CHECKBOX_VALUES:
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: ensureArray(action.values),
        },
      }

    case SET_FIELD_METADATA:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          [action.field]: {
            ...state.metadata[action.field],
            ...action.metadata,
          },
        },
      }

    case SET_VALIDATION_ERROR:
      return {
        ...state,
        validationErrors: {
          ...state.validationErrors,
          [action.field]: action.error,
        },
      }

    case CLEAR_VALIDATION_ERROR: {
      const newErrors = { ...state.validationErrors }
      delete newErrors[action.field]
      return {
        ...state,
        validationErrors: newErrors,
      }
    }

    case REMOVE_FIELD: {
      const newState = { ...state }
      delete newState.values[action.field]
      delete newState.metadata[action.field]
      delete newState.validationErrors[action.field]
      return newState
    }

    case RESET_FORM:
      return {
        values: action.initialValues || {},
        metadata: {},
        validationErrors: {},
      }

    default:
      return state
  }
}

// Create context with a default value
const FormContext = createContext({
  values: {},
  metadata: {},
  validationErrors: {},
  setFieldValue: () => {},
  setMultipleValues: () => {},
  toggleCheckbox: () => {},
  setCheckboxValues: () => {},
  resetForm: () => {},
  getFieldValue: () => {},
  setFieldMetadata: () => {},
  getFieldMetadata: () => {},
  setValidationError: () => {},
  clearValidationError: () => {},
  removeField: () => {},
  validateField: () => {},
  validateAllFields: () => {},
  getFieldsByType: () => {},
})

// Form provider component
export const FormProvider = ({ children, initialValues = {}, initialMetadata = {} }) => {
  const [state, dispatch] = useReducer(formReducer, {
    values: initialValues,
    metadata: initialMetadata,
    validationErrors: {},
  })

  const setFieldValue = useCallback((field, value) => {
    console.log('FormProvider setFieldValue called - field:', field, 'value:', value)
    dispatch({ type: SET_FIELD_VALUE, field, value })
  }, [])

  const setMultipleValues = useCallback((values) => {
    dispatch({ type: SET_MULTIPLE_VALUES, values })
  }, [])

  const toggleCheckbox = useCallback((field, value) => {
    dispatch({ type: TOGGLE_CHECKBOX, field, value })
  }, [])

  const setCheckboxValues = useCallback((field, values) => {
    dispatch({ type: SET_CHECKBOX_VALUES, field, values })
  }, [])

  const resetForm = useCallback((newInitialValues) => {
    dispatch({ type: RESET_FORM, initialValues: newInitialValues })
  }, [])

  const getFieldValue = useCallback(
    (field) => state.values[field],
    [state.values],
  )

  const setFieldMetadata = useCallback((field, metadata) => {
    dispatch({ type: SET_FIELD_METADATA, field, metadata })
  }, [])

  const getFieldMetadata = useCallback(
    (field) => state.metadata[field],
    [state.metadata],
  )

  const setValidationError = useCallback((field, error) => {
    dispatch({ type: SET_VALIDATION_ERROR, field, error })
  }, [])

  const clearValidationError = useCallback((field) => {
    dispatch({ type: CLEAR_VALIDATION_ERROR, field })
  }, [])

  const removeField = useCallback((field) => {
    dispatch({ type: REMOVE_FIELD, field })
  }, [])

  const validateField = useCallback((field) => {
    const metadata = state.metadata[field]
    const value = state.values[field]

    if (!metadata) return { isValid: true, error: null }

    if (metadata.required && (!value || value === '' || value === null || value === undefined)) {
      const error = `${metadata.label || metadata.element || field} is required`
      setValidationError(field, error)
      return { isValid: false, error }
    }

    switch (metadata.element) {
      case 'Email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          const error = `${metadata.label || 'Email'} must be a valid email address`
          setValidationError(field, error)
          return { isValid: false, error }
        }
        break

      case 'NumberInput':
        if (value && Number.isNaN(Number(value))) {
          const error = `${metadata.label || 'Number'} must be a valid number`
          setValidationError(field, error)
          return { isValid: false, error }
        }
        break

      case 'PhoneNumber':
        if (value && !/^\+?[\d\s\-()]+$/.test(value)) {
          const error = `${metadata.label || 'Phone Number'} must be a valid phone number`
          setValidationError(field, error)
          return { isValid: false, error }
        }
        break

      default:
        break
    }

    clearValidationError(field)
    return { isValid: true, error: null }
  }, [state.values, state.metadata, setValidationError, clearValidationError])

  const validateAllFields = useCallback(() => {
    const errors = {}
    let isFormValid = true

    Object.keys(state.metadata).forEach(field => {
      const validation = validateField(field)
      if (!validation.isValid) {
        errors[field] = validation.error
        isFormValid = false
      }
    })

    return {
      isValid: isFormValid,
      errors,
    }
  }, [state.metadata, validateField])

  const getFieldsByType = useCallback((elementType) => (
    Object.keys(state.metadata)
      .filter(field => state.metadata[field].element === elementType)
      .reduce((acc, field) => {
        acc[field] = {
          value: state.values[field],
          metadata: state.metadata[field],
        }
        return acc
      }, {})
  ), [state.values, state.metadata])

  const value = useMemo(
    () => ({
      // Core state
      values: state.values,
      metadata: state.metadata,
      validationErrors: state.validationErrors,

      // Primary FormProvider methods
      setFieldValue,
      setMultipleValues,
      toggleCheckbox,
      setCheckboxValues,
      resetForm,
      getFieldValue,
      setFieldMetadata,
      getFieldMetadata,
      setValidationError,
      clearValidationError,
      removeField,
      validateField,
      validateAllFields,
      getFieldsByType,
    }),
    [
      state.values,
      state.metadata,
      state.validationErrors,
      setFieldValue,
      setMultipleValues,
      toggleCheckbox,
      setCheckboxValues,
      resetForm,
      getFieldValue,
      setFieldMetadata,
      getFieldMetadata,
      setValidationError,
      clearValidationError,
      removeField,
      validateField,
      validateAllFields,
      getFieldsByType,
    ],
  )

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}

FormProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialValues: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.array,
  ])),
  initialMetadata: PropTypes.objectOf(PropTypes.shape({
    element: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.bool,
  })),
}

FormProvider.defaultProps = {
  initialValues: {},
  initialMetadata: {},
}

// Custom hook to use form context
export const useFormStore = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormStore must be used within a FormProvider')
  }
  return context
}

// Alias for backward compatibility
export const useFormInput = useFormStore
