/**
 * FormContext - Centralized state management for form generator
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import type { FormContextValue, FormFieldValue, FormValues } from '../types/form'

const defaultFormContextValue: FormContextValue = {
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

const FormContext = createContext<FormContextValue>(defaultFormContextValue)

type FormProviderProps = {
  children: ReactNode
  initialValues?: FormValues
}

export const FormProvider = ({ children, initialValues = {} }: FormProviderProps) => {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [variables, setVariables] = useState<Record<string, FormFieldValue>>({})
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const variableListenersRef = useRef<
    Array<(event: { propKey: string; value: FormFieldValue }) => void>
  >([])

  const valuesRef = useRef(values)
  const variablesRef = useRef(variables)
  const validationErrorsRef = useRef(validationErrors)
  valuesRef.current = values
  variablesRef.current = variables
  validationErrorsRef.current = validationErrors

  const updateValue = useCallback((fieldName: string, value: FormFieldValue) => {
    setValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }, [])

  const getValue = useCallback((fieldName: string) => valuesRef.current[fieldName], [])

  const getAllValues = useCallback(() => valuesRef.current, [])

  const resetValues = useCallback(() => {
    setValues(initialValues)
  }, [initialValues])

  const updateVariable = useCallback((varKey: string, value: FormFieldValue) => {
    setVariables((prev) => {
      const newVariables = {
        ...prev,
        [varKey]: value,
      }

      variableListenersRef.current.forEach((listener) => {
        listener({ propKey: varKey, value })
      })

      return newVariables
    })
  }, [])

  const getVariable = useCallback((varKey: string) => variablesRef.current[varKey], [])

  const getAllVariables = useCallback(() => variablesRef.current, [])

  const setAllVariables = useCallback((newVariables: Record<string, FormFieldValue>) => {
    setVariables(newVariables)
  }, [])

  const addVariableListener = useCallback(
    (listener: (event: { propKey: string; value: FormFieldValue }) => void) => {
      variableListenersRef.current.push(listener)
      return () => {
        variableListenersRef.current = variableListenersRef.current.filter((l) => l !== listener)
      }
    },
    []
  )

  const setErrors = useCallback((errors: string[]) => {
    setValidationErrors(errors)
  }, [])

  const getErrors = useCallback(() => validationErrorsRef.current, [])

  const value = useMemo<FormContextValue>(
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
      variables,
      validationErrors,
      updateValue,
      getValue,
      getAllValues,
      resetValues,
      updateVariable,
      getVariable,
      getAllVariables,
      setAllVariables,
      addVariableListener,
      setErrors,
      getErrors,
    ]
  )

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}

export const useFormContext = (): FormContextValue => {
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
