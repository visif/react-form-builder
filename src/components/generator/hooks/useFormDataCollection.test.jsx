import React from 'react'
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FormProvider } from '../../../contexts/FormContext'
import { useFormDataCollection } from './useFormDataCollection'

const createWrapper = (initialValues = {}) => {
  const Wrapper = ({ children }) => (
    <FormProvider initialValues={initialValues}>{children}</FormProvider>
  )
  return Wrapper
}

describe('useFormDataCollection', () => {
  it('collects values from FormContext', () => {
    const { result } = renderHook(
      () => useFormDataCollection({}, () => null),
      { wrapper: createWrapper({ text_field: 'Ada' }) }
    )

    expect(
      result.current.collect({
        element: 'TextInput',
        field_name: 'text_field',
        custom_name: 'Name',
      })
    ).toEqual({
      name: 'text_field',
      custom_name: 'Name',
      value: 'Ada',
      editor: null,
    })
  })

  it('uses empty defaults when FormContext has no value', () => {
    const { result } = renderHook(
      () => useFormDataCollection({}, () => null),
      { wrapper: createWrapper() }
    )

    expect(
      result.current.collect({
        element: 'Checkboxes',
        field_name: 'choices',
      })
    ).toEqual({
      name: 'choices',
      custom_name: 'choices',
      value: [],
      editor: null,
    })
  })

  it('skips display-only elements', () => {
    const { result } = renderHook(
      () => useFormDataCollection({}, () => null),
      { wrapper: createWrapper() }
    )

    expect(
      result.current.collect({
        element: 'Header',
        field_name: 'header_1',
      })
    ).toBeNull()
  })
})
