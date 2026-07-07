import React from 'react'
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FormProvider } from '../../../contexts/FormContext'
import { useFormValidation } from './useFormValidation'

const createWrapper = (initialValues = {}) => {
  const Wrapper = ({ children }) => (
    <FormProvider initialValues={initialValues}>{children}</FormProvider>
  )
  return Wrapper
}

describe('useFormValidation', () => {
  const baseHookArgs = [{ data: [] }, { current: {} }, () => undefined, () => []]

  it('marks empty required text fields as invalid', () => {
    const { result } = renderHook(() => useFormValidation(...baseHookArgs), {
      wrapper: createWrapper({ name_field: '' }),
    })

    expect(
      result.current.isInvalid({
        required: true,
        field_name: 'name_field',
        element: 'TextInput',
      })
    ).toBe(true)
  })

  it('accepts populated required text fields', () => {
    const { result } = renderHook(() => useFormValidation(...baseHookArgs), {
      wrapper: createWrapper({ name_field: 'Ada' }),
    })

    expect(
      result.current.isInvalid({
        required: true,
        field_name: 'name_field',
        element: 'TextInput',
      })
    ).toBe(false)
  })

  it('marks empty required checkbox groups as invalid', () => {
    const { result } = renderHook(() => useFormValidation(...baseHookArgs), {
      wrapper: createWrapper({ choices: [] }),
    })

    expect(
      result.current.isInvalid({
        required: true,
        field_name: 'choices',
        element: 'Checkboxes',
      })
    ).toBe(true)
  })

  it('ignores optional fields', () => {
    const { result } = renderHook(() => useFormValidation(...baseHookArgs), {
      wrapper: createWrapper({ optional_field: '' }),
    })

    expect(
      result.current.isInvalid({
        required: false,
        field_name: 'optional_field',
        element: 'TextInput',
      })
    ).toBe(false)
  })
})
